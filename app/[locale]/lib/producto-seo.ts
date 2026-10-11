// Nombre, título, descripción y datos estructurados de una pieza: la misma lógica para la ficha,
// los metadatos (title/description) y el JSON-LD.
import { traducir, type EstadoPieza, type MaderaPieza, type ProductoSanity, type TipoLampara } from "@/sanity/lib/tipos";
import { COSTES_ENVIO } from "@/app/[locale]/lib/envio";
import { SITE_URL } from "@/app/[locale]/lib/sitio";
import { hrefPieza, urlAbsoluta } from "@/app/[locale]/lib/rutas";

const ETIQUETAS_TIPO: Record<TipoLampara, { es: string; en: string }> = {
  sobremesa: { es: "Lámpara de sobremesa", en: "Table lamp" },
  colgante: { es: "Lámpara colgante", en: "Pendant lamp" },
  pie: { es: "Lámpara de pie", en: "Floor lamp" },
  aplique: { es: "Aplique de pared", en: "Wall light" },
  otra: { es: "Lámpara", en: "Lamp" },
};

const idioma = (locale: string) => (locale === "en" ? "en" : "es");

export function etiquetaTipo(tipo: TipoLampara | undefined, locale: string) {
  return tipo ? ETIQUETAS_TIPO[tipo]?.[idioma(locale)] : undefined;
}

// Nombre visible (H1, alt de las fotos). Si la pieza aún no tiene nombre en Sanity, lo que es («Lámpara de madera de olivo»).
export function nombreProducto(p: ProductoSanity, locale: string) {
  return traducir(p.nombre, locale)?.trim() || descriptorProducto(p, locale);
}

// --- Qué es la pieza, con las palabras que busca la gente («lámpara de sobremesa de madera de olivo») ---

const MADERAS: Record<Exclude<MaderaPieza, "otra">, { es: string; en: string; patron: RegExp }> = {
  olivo: { es: "olivo", en: "Olive wood", patron: /olivo|olive/i },
  eucalipto: { es: "eucalipto", en: "Eucalyptus", patron: /eucalipt/i },
  castano: { es: "castaño", en: "Chestnut", patron: /casta[ñn]o|chestnut/i },
  roble: { es: "roble", en: "Oak", patron: /roble|\boak\b/i },
  nogal: { es: "nogal", en: "Walnut", patron: /nogal|walnut/i },
  pino: { es: "pino", en: "Pine", patron: /\bpino\b|\bpine\b/i },
  almendro: { es: "almendro", en: "Almond wood", patron: /almendro|almond/i },
};

// Tipo y madera elegidos en Sanity. Mientras falten, se deducen del texto de la pieza
// («Madera de Olivo recuperada», «Sobremesa Raíz Serena»); lo elegido en el Studio siempre manda.
// Se mira el nombre, la descripción corta («Lámpara de sobremesa de olivo…») y la dirección web
function tipoPieza(p: ProductoSanity): TipoLampara | undefined {
  if (p.tipo) return p.tipo;
  const slug = typeof p.slug === "string" ? p.slug : p.slug?.current;
  for (const texto of [p.nombre?.es, p.descripcion?.es, slug]) {
    if (/sobremesa/i.test(texto ?? "")) return "sobremesa";
    if (/colgante/i.test(texto ?? "")) return "colgante";
    if (/aplique/i.test(texto ?? "")) return "aplique";
  }
  return undefined;
}

// Se mira la madera de la base, el nombre y la dirección web («viga-castano»)
function maderaPieza(p: ProductoSanity) {
  if (p.madera) return p.madera === "otra" ? undefined : MADERAS[p.madera];
  const slug = typeof p.slug === "string" ? p.slug : p.slug?.current;
  for (const texto of [p.materialBase?.es, p.nombre?.es, slug?.replace(/-/g, " ")]) {
    const madera = Object.values(MADERAS).find((m) => m.patron.test(texto ?? ""));
    if (madera) return madera;
  }
  return undefined;
}

const TIPO_EN_FRASE: Record<TipoLampara, { es: string; en: string }> = {
  sobremesa: { es: "Lámpara de sobremesa", en: "table lamp" },
  colgante: { es: "Lámpara colgante", en: "pendant lamp" },
  pie: { es: "Lámpara de pie", en: "floor lamp" },
  aplique: { es: "Aplique de pared", en: "wall light" },
  otra: { es: "Lámpara", en: "lamp" },
};

// «Lámpara de sobremesa de madera de olivo» / «Olive wood table lamp». Va bajo el H1, en el título y en el JSON-LD.
export function descriptorProducto(p: ProductoSanity, locale: string) {
  const tipo = TIPO_EN_FRASE[tipoPieza(p) ?? "otra"];
  const madera = maderaPieza(p);
  return idioma(locale) === "en"
    ? `${madera?.en ?? "Wooden"} ${tipo.en}`
    : `${tipo.es} de madera${madera ? ` de ${madera.es}` : ""}`;
}

// Título para buscadores: lo que es primero y el nombre después, como los talleres que mejor posicionan:
// «Lámpara de sobremesa de madera de eucalipto · Eucalipto a la deriva» (la plantilla del layout añade «| Veta & Lux»)
export function tituloProducto(p: ProductoSanity, locale: string) {
  const nombre = traducir(p.nombre, locale)?.trim();
  const descriptor = descriptorProducto(p, locale);
  return nombre ? `${descriptor} · ${nombre}` : descriptor;
}

// --- Fotos: nombre de archivo descriptivo en la URL de Sanity (Google Imágenes lo lee) ---

const enMinusculasSinTildes = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

// «lampara-de-sobremesa-de-madera-de-eucalipto-eucalipto-a-la-deriva» (y «-2», «-3»… para el resto de fotos)
export function nombreArchivoFoto(p: ProductoSanity, locale: string, indice = 0) {
  const base = enMinusculasSinTildes(tituloProducto(p, locale));
  return indice > 0 ? `${base}-${indice + 1}` : base;
}

// El CDN de Sanity acepta un nombre tras el archivo: …/abc-896x1195.jpg/lampara-de-olivo.jpg?w=720
export function conNombreArchivo(url: string, nombre: string) {
  const [ruta, consulta] = url.split("?");
  const extension = ruta.match(/\.(\w+)$/)?.[1] ?? "jpg";
  return `${ruta}/${nombre}.${extension}${consulta ? `?${consulta}` : ""}`;
}

function recortar(texto: string, max = 155) {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "")}…`;
}

// Metadescripción: la descripción corta solo si dice algo (≥ 70 caracteres); si no, la larga recortada.
export function descripcionProducto(p: ProductoSanity, locale: string) {
  const corta = traducir(p.descripcion, locale)?.trim() || "";
  const larga = traducir(p.descripcionLarga, locale)?.trim() || "";
  if (corta.length >= 70) return recortar(corta);
  if (larga) return recortar(larga);
  if (corta) return corta;
  const descriptor = descriptorProducto(p, locale);
  return idioma(locale) === "en"
    ? `One-of-a-kind ${descriptor.charAt(0).toLowerCase()}${descriptor.slice(1)}, handmade in our workshop in Malaga, Spain.`
    : `Pieza única hecha a mano en nuestro taller de Málaga: ${descriptor.charAt(0).toLowerCase()}${descriptor.slice(1)}.`;
}

const DISPONIBILIDAD: Record<EstadoPieza, string> = {
  disponible: "https://schema.org/InStock",
  reservado: "https://schema.org/OutOfStock", // reservada 48 h a la espera de una transferencia
  vendido: "https://schema.org/SoldOut",
};

export const ID_DEVOLUCIONES = `${SITE_URL}/#politica-devoluciones`;

// Devoluciones: 14 días, por mensajería, envío de vuelta a cargo del cliente (páginas de envíos y condiciones).
export const POLITICA_DEVOLUCIONES = {
  "@type": "MerchantReturnPolicy",
  "@id": ID_DEVOLUCIONES,
  applicableCountry: ["ES", "FR", "IT", "DE", "PT"],
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
};

// Envíos marcables: Google solo admite regiones dentro de un país en EE. UU., Australia y Japón,
// así que España (gratis en Península, 25 € en islas) no se puede expresar con una sola tarifa:
// se configura en Merchant Center. Se marcan los países con tarifa única.
const ENVIOS_MARCADOS = ["FR", "IT", "DE", "PT"].map((pais) => ({
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: COSTES_ENVIO.internacional, currency: "EUR" },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: pais },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
  },
}));

// Todas las piezas se entregan con certificado salvo que en el Studio se desmarque expresamente
export const tieneCertificado = (p: ProductoSanity) => p.certificado !== false;

const CATEGORIAS: Record<TipoLampara, { es: string; en: string }> = {
  sobremesa: { es: "Lámparas de sobremesa", en: "Table lamps" },
  colgante: { es: "Lámparas colgantes", en: "Pendant lamps" },
  pie: { es: "Lámparas de pie", en: "Floor lamps" },
  aplique: { es: "Apliques de pared", en: "Wall lights" },
  otra: { es: "Lámparas", en: "Lamps" },
};

const centimetros = (valor?: number) =>
  typeof valor === "number" ? { "@type": "QuantitativeValue", value: valor, unitCode: "CMT" } : undefined;

// Lo que hace única a la pieza, como datos verificables (lo leen Google y los asistentes de IA)
function propiedadesPieza(p: ProductoSanity, locale: string) {
  const en = idioma(locale) === "en";
  const madera = maderaPieza(p);
  const propiedades: [string, string | undefined][] = [
    [en ? "Edition" : "Edición", en ? "One of a kind" : "Pieza única"],
    [en ? "Production method" : "Fabricación", en ? "Handcrafted in Malaga, Spain" : "Hecha a mano en Málaga"],
    [en ? "Wood" : "Madera", madera ? (en ? madera.en : madera.es.charAt(0).toUpperCase() + madera.es.slice(1)) : undefined],
    [en ? "Piece number" : "Número de pieza", p.numeroPieza],
    [en ? "Certificate of authenticity" : "Certificado de autenticidad", tieneCertificado(p) ? (en ? "Included" : "Incluido") : undefined],
  ];
  return propiedades
    .filter((par): par is [string, string] => Boolean(par[1]))
    .map(([name, value]) => ({ "@type": "PropertyValue", name, value }));
}

export function productoJsonLd(p: ProductoSanity, locale: string, slug: string, imagenes: string[]) {
  const url = urlAbsoluta(hrefPieza(slug), idioma(locale));
  const pantalla = traducir(p.materialPantalla, locale);
  const materiales = [traducir(p.materialBase, locale), pantalla?.tipo]
    .map((m) => m?.trim())
    .filter((m): m is string => Boolean(m));
  const tipo = tipoPieza(p);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tituloProducto(p, locale),
    description: descripcionProducto(p, locale),
    image: imagenes,
    // El número del certificado identifica la pieza; si aún no lo tiene, su dirección
    sku: p.numeroPieza || slug,
    brand: { "@type": "Brand", name: "Veta & Lux" },
    ...(tipo ? { category: CATEGORIAS[tipo][idioma(locale)] } : {}),
    ...(materiales.length ? { material: materiales.length === 1 ? materiales[0] : materiales } : {}),
    ...(centimetros(p.medidas?.alto) ? { height: centimetros(p.medidas?.alto) } : {}),
    ...(centimetros(p.medidas?.ancho) ? { width: centimetros(p.medidas?.ancho) } : {}),
    ...(centimetros(p.medidas?.largo) ? { depth: centimetros(p.medidas?.largo) } : {}),
    ...(p.fechaCreacion ? { productionDate: p.fechaCreacion } : {}),
    additionalProperty: propiedadesPieza(p, locale),
    offers: {
      "@type": "Offer",
      url,
      price: p.precio,
      priceCurrency: "EUR",
      availability: DISPONIBILIDAD[p.estado ?? "disponible"],
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: ENVIOS_MARCADOS,
      hasMerchantReturnPolicy: POLITICA_DEVOLUCIONES,
    },
  };
}

export function migasJsonLd(migas: { nombre: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nombre, item: m.url })),
  };
}

const ID_ORGANIZACION = `${SITE_URL}/#organizacion`;
const ID_WEB = `${SITE_URL}/#web`;

// Qué es la marca, en una frase verificable: la definición que usan Google y los asistentes de IA
const DESCRIPCION_MARCA = {
  es: "Taller de Málaga que crea lámparas escultóricas únicas, hechas a mano con maderas recuperadas como el olivo, el eucalipto o el castaño.",
  en: "Workshop in Malaga, Spain, creating one-of-a-kind sculptural lamps handcrafted from reclaimed woods such as olive, eucalyptus and chestnut.",
};

export function organizacionJsonLd(locale = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ID_ORGANIZACION,
    name: "Veta & Lux",
    url: SITE_URL,
    description: DESCRIPCION_MARCA[idioma(locale)],
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    email: "info@vetandlux.com",
    address: { "@type": "PostalAddress", addressLocality: "Málaga", addressCountry: "ES" },
    founder: [
      { "@type": "Person", name: "Cristina" },
      { "@type": "Person", name: "Rafa" },
    ],
    hasMerchantReturnPolicy: POLITICA_DEVOLUCIONES,
  };
}

// La web oficial de la marca (portada)
export function webSiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ID_WEB,
    url: SITE_URL,
    name: "Veta & Lux",
    description: DESCRIPCION_MARCA[idioma(locale)],
    inLanguage: ["es", "en"],
    publisher: { "@id": ID_ORGANIZACION },
  };
}

// Página general (Sobre el taller, colección…) enlazada con la web y la marca
export function paginaJsonLd(tipo: "AboutPage" | "CollectionPage" | "WebPage", datos: { url: string; nombre: string; descripcion?: string; locale: string; piezas?: { nombre: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": tipo,
    url: datos.url,
    name: datos.nombre,
    ...(datos.descripcion ? { description: datos.descripcion } : {}),
    inLanguage: idioma(datos.locale),
    isPartOf: { "@id": ID_WEB },
    about: { "@id": ID_ORGANIZACION },
    ...(datos.piezas?.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: datos.piezas.length,
            itemListElement: datos.piezas.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.nombre, url: p.url })),
          },
        }
      : {}),
  };
}

// Inserta un objeto JSON-LD en un <script> sin permitir cerrar la etiqueta desde los datos
export function jsonLdHtml(datos: object) {
  return { __html: JSON.stringify(datos).replace(/</g, "\\u003c") };
}

// Orden del catálogo: primero lo que se puede comprar
const ORDEN_ESTADO: Record<EstadoPieza, number> = { disponible: 0, reservado: 1, vendido: 2 };
export function ordenarPorDisponibilidad<T extends { estado?: EstadoPieza }>(piezas: T[]) {
  return [...piezas].sort((a, b) => ORDEN_ESTADO[a.estado ?? "disponible"] - ORDEN_ESTADO[b.estado ?? "disponible"]);
}
