import { NextResponse } from "next/server";

// Traducción ES → EN para el botón «Traducir al inglés» del Studio (/studio).
// La clave de DeepL vive solo en el servidor; sin clave se usa MyMemory (gratis, peor calidad).

const MAX_TEXTOS = 40;
const MAX_CARACTERES = 8000; // por petición
const MAX_CARACTERES_DIA = 150_000; // tope global diario (el plan gratuito de DeepL da 500.000 al mes)

// Límite por IP: 20 peticiones cada 10 minutos (en memoria del proceso)
const VENTANA_MS = 10 * 60 * 1000;
const MAX_PETICIONES = 20;
const peticionesPorIp = new Map<string, number[]>();

let consumoHoy = { dia: "", caracteres: 0 };

function superaLimite(ip: string) {
  const ahora = Date.now();
  const recientes = (peticionesPorIp.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  peticionesPorIp.set(ip, recientes);
  return recientes.length > MAX_PETICIONES;
}

function superaCupoDiario(caracteres: number) {
  const hoy = new Date().toISOString().slice(0, 10);
  if (consumoHoy.dia !== hoy) consumoHoy = { dia: hoy, caracteres: 0 };
  if (consumoHoy.caracteres + caracteres > MAX_CARACTERES_DIA) return true;
  consumoHoy.caracteres += caracteres;
  return false;
}

// Solo se aceptan peticiones del propio Studio (mismo origen que la web)
function origenPermitido(request: Request) {
  const origen = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origen || !host) return false;
  try {
    return new URL(origen).host === host;
  } catch {
    return false;
  }
}

const CONTEXTO =
  "Product listing for a Spanish online shop of handmade lamps crafted from reclaimed wood " +
  "(table lamps, pendant lamps, floor lamps). 'Pantalla' means lampshade, 'sobremesa' means table lamp, " +
  "'casquillo' means bulb holder / lamp socket, 'veta' means wood grain.";

// Correcciones habituales de vocabulario de lámparas, aplicadas después de traducir
const GLOSARIO: [RegExp, string][] = [
  [/\b(desktop|tabletop|after-dinner|sobremesa) lamp\b/gi, "table lamp"],
  [/\b(desktop|tabletop|after-dinner|sobremesa) lamps\b/gi, "table lamps"],
  [/\b(desktop|sobremesa)\b/gi, "table lamp"],
  [/\btabletop\b/gi, "table lamp"],
  [/\blamp screens?\b/gi, "lampshade"],
  [/\bscreens?\b/gi, "shade"],
  [/\btable lamp lamp\b/gi, "table lamp"],
  [/\bled(?= (bulbs?|lights?|lamps?|strips?)\b)/gi, "LED"],
];

// Mantiene el estilo de mayúsculas del original: «DESKTOP», «Desktop Lamp», «Desktop lamp» o «desktop»
function conMayuscula(original: string, nuevo: string) {
  if (original.length > 1 && original === original.toUpperCase()) return nuevo.toUpperCase();
  const palabras = original.split(/\s+/);
  if (palabras.every((p) => p[0] === p[0].toUpperCase())) return nuevo.replace(/\b\w/g, (l) => l.toUpperCase());
  if (original[0] === original[0].toUpperCase()) return nuevo[0].toUpperCase() + nuevo.slice(1);
  return nuevo;
}

function aplicarGlosario(texto: string) {
  let resultado = texto;
  for (const [patron, reemplazo] of GLOSARIO) {
    resultado = resultado.replace(patron, (encontrado) => conMayuscula(encontrado, reemplazo));
  }
  return resultado.trim();
}

async function traducirDeepL(textos: string[], clave: string) {
  const base = clave.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
  const respuesta = await fetch(`${base}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${clave}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: textos,
      source_lang: "ES",
      target_lang: "EN-GB",
      context: CONTEXTO,
      preserve_formatting: true,
    }),
  });
  if (!respuesta.ok) throw new Error(`DeepL ${respuesta.status}: ${await respuesta.text()}`);
  const datos = (await respuesta.json()) as { translations: { text: string }[] };
  return datos.translations.map((t) => t.text);
}

// Respeta el formato del original línea a línea: viñeta «- », mayúscula inicial y sin punto final añadido
function ajustarLinea(original: string, traducida: string) {
  const vineta = original.match(/^\s*[-•*]\s*/)?.[0].trim() ?? "";
  const cuerpo = original.replace(/^\s*[-•*]\s*/, "").trim();
  let texto = aplicarGlosario(traducida.replace(/^\s*[-•*]\s*/, ""));
  if (!cuerpo || !texto) return "";
  if (!/[.!?…:]$/.test(cuerpo)) texto = texto.replace(/\.$/, "");
  if (/^[A-ZÁÉÍÓÚÑ]/.test(cuerpo)) texto = texto[0].toUpperCase() + texto.slice(1);
  return vineta ? `${vineta} ${texto}` : texto;
}

function pulir(original: string, traducido: string) {
  const lineasOriginal = original.split("\n");
  const lineasTraducidas = traducido.split("\n");
  if (lineasOriginal.length !== lineasTraducidas.length) return aplicarGlosario(traducido);
  return lineasOriginal.map((linea, i) => ajustarLinea(linea, lineasTraducidas[i])).join("\n").trim();
}

// MyMemory admite como mucho 500 caracteres por consulta: se traduce línea a línea y las líneas largas por frases
function trocear(linea: string, maximo = 450) {
  if (linea.length <= maximo) return [linea];
  const trozos: string[] = [];
  let actual = "";
  for (const frase of linea.split(/(?<=[.!?;])\s+/)) {
    if (actual && (actual + " " + frase).length > maximo) {
      trozos.push(actual);
      actual = frase;
    } else {
      actual = actual ? `${actual} ${frase}` : frase;
    }
  }
  if (actual) trozos.push(actual);
  return trozos;
}

async function traducirMyMemory(textos: string[]) {
  const email = process.env.EMAIL_NOTIFICACIONES; // sube el cupo diario gratuito de MyMemory
  const traducirTrozo = async (trozo: string) => {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", trozo);
    url.searchParams.set("langpair", "es|en");
    if (email) url.searchParams.set("de", email);
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`MyMemory ${respuesta.status}`);
    const datos = (await respuesta.json()) as { responseStatus: number | string; responseData: { translatedText: string } };
    if (Number(datos.responseStatus) !== 200) throw new Error(`MyMemory: ${datos.responseData?.translatedText}`);
    return datos.responseData.translatedText;
  };
  const traducirLinea = async (linea: string) => {
    const cuerpo = linea.replace(/^\s*[-•*]\s*/, "").trim();
    if (!cuerpo) return "";
    const trozos = await Promise.all(trocear(cuerpo).map(traducirTrozo));
    return trozos.join(" ");
  };
  const resultados: string[] = [];
  for (const texto of textos) {
    const lineas = await Promise.all(texto.split("\n").map(traducirLinea));
    resultados.push(lineas.join("\n"));
  }
  return resultados;
}

export async function POST(request: Request) {
  if (!origenPermitido(request)) {
    return NextResponse.json({ error: "origen" }, { status: 403 });
  }

  let datos: { textos?: unknown };
  try {
    datos = await request.json();
  } catch {
    return NextResponse.json({ error: "invalido" }, { status: 400 });
  }

  const textos = Array.isArray(datos.textos) ? datos.textos : null;
  if (!textos || textos.length === 0 || textos.length > MAX_TEXTOS || !textos.every((t) => typeof t === "string")) {
    return NextResponse.json({ error: "invalido" }, { status: 400 });
  }
  const caracteres = textos.reduce((total: number, t: string) => total + t.length, 0);
  if (caracteres > MAX_CARACTERES) {
    return NextResponse.json({ error: "demasiado-largo" }, { status: 413 });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida";
  if (superaLimite(ip) || superaCupoDiario(caracteres)) {
    return NextResponse.json({ error: "limite" }, { status: 429 });
  }

  const limpios = (textos as string[]).map((t) => t.trim());
  const clave = process.env.DEEPL_API_KEY?.trim();

  try {
    if (clave) {
      try {
        const traducciones = await traducirDeepL(limpios, clave);
        return NextResponse.json({ traducciones: traducciones.map((t, i) => pulir(limpios[i], t)), motor: "deepl" });
      } catch (error) {
        console.error("❌ DeepL ha fallado, se usa MyMemory:", error);
      }
    }
    const traducciones = await traducirMyMemory(limpios);
    return NextResponse.json({ traducciones: traducciones.map((t, i) => pulir(limpios[i], t)), motor: "mymemory" });
  } catch (error) {
    console.error("❌ Error traduciendo:", error);
    return NextResponse.json({ error: "traductor" }, { status: 502 });
  }
}
