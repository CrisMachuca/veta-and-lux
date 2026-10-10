import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { metadataPagina } from "@/app/[locale]/lib/seo";
import fs from "node:fs";
import path from "node:path";

export const generateMetadata = metadataPagina("taller", "/sobre-el-taller");

type Persona = { nombre: string; rol: string; texto: string };

// Fotos personales y del taller: basta con dejarlas en public/sobre-el-taller/ con estos nombres
// (JPG o WebP) y aparecen solas. Si un archivo no existe, su hueco no se muestra.
const CARPETA = "sobre-el-taller";
const FOTO_PERSONA: Record<string, string> = { Cristina: "cristina", Rafa: "rafa" };
const FOTOS_TALLER = ["taller-1", "taller-2", "taller-3"];

function rutaFoto(nombre: string) {
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", CARPETA, `${nombre}.${ext}`))) return `/${CARPETA}/${nombre}.${ext}`;
  }
  return null;
}

export default async function SobreElTallerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Taller" });
  const historia = t.raw("historia") as string[];
  const personas = t.raw("personas") as Persona[];
  const etapas = t.raw("etapas") as string[];
  const altPersonas = t.raw("altPersonas") as Record<string, string>;
  const galeria = FOTOS_TALLER.map(rutaFoto).filter((r): r is string => r !== null);

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      {/* CABECERA */}
      <header className="px-6 pt-20 pb-14 md:pt-28 md:pb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/90 font-urbanist mb-4">{t("tagline")}</p>
          <h1 className="text-5xl md:text-7xl font-nixie leading-tight mb-6">{t("titulo")}</h1>
          <p className="text-lg md:text-xl text-[#5f5852] leading-relaxed font-urbanist font-light max-w-2xl mx-auto">{t("intro")}</p>
        </div>
      </header>

      {/* HISTORIA */}
      <section className="px-6 md:px-12 lg:px-24 pb-24" aria-labelledby="como-empezo">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-6 relative aspect-[4/5] rounded-sm overflow-hidden bg-stone-100 shadow-sm">
            <Image src="/saneado.jpeg" alt={t("altTaller")} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </div>
          <div className="md:col-span-6 space-y-6">
            <h2 id="como-empezo" className="text-3xl md:text-5xl font-nixie leading-tight">{t("historiaTitulo")}</h2>
            {historia.map((parrafo) => (
              <p key={parrafo} className="text-[#5f5852] font-light text-lg leading-relaxed font-urbanist">{parrafo}</p>
            ))}
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="bg-[#f2efe9] border-y border-[#e5e0d8] px-6 py-20" aria-labelledby="quienes-somos">
        <div className="max-w-5xl mx-auto">
          <h2 id="quienes-somos" className="text-3xl md:text-4xl font-nixie text-center mb-12">{t("personasTitulo")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {personas.map((persona) => (
              <article key={persona.nombre} className="bg-[#fcfaf8] border border-[#e5e0d8] rounded-sm overflow-hidden">
                {(() => {
                  const foto = rutaFoto(FOTO_PERSONA[persona.nombre] ?? "");
                  return foto ? (
                    <div className="relative aspect-[4/3] bg-stone-100">
                      <Image src={foto} alt={altPersonas[persona.nombre] ?? persona.nombre} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    </div>
                  ) : null;
                })()}
                <div className="p-8 space-y-3">
                <h3 className="text-2xl font-nixie">{persona.nombre}</h3>
                <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-amber-900/90 font-urbanist">{persona.rol}</p>
                <p className="text-[#5f5852] font-urbanist leading-relaxed">{persona.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TODO PASA POR NUESTRAS MANOS */}
      <section className="px-6 md:px-12 lg:px-24 py-24" aria-labelledby="nuestras-manos">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-6 md:order-2 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-stone-100">
              <Image src="/curado.png" alt={t("altCurado")} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-stone-100">
              <Image src="/tronco2.jpeg" alt={t("altLampara")} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
          </div>
          <div className="md:col-span-6 md:order-1 space-y-6">
            <h2 id="nuestras-manos" className="text-3xl md:text-5xl font-nixie leading-tight">{t("manosTitulo")}</h2>
            <p className="text-[#5f5852] font-light text-lg leading-relaxed font-urbanist">{t("manosTexto")}</p>
            <ul className="flex flex-wrap gap-2 font-urbanist">
              {etapas.map((etapa) => (
                <li key={etapa} className="border border-[#3a3530]/20 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-[#3a3530]">{etapa}</li>
              ))}
            </ul>
            <Link href="/proceso" className="inline-block border-b border-[#3a3530] pb-1 uppercase tracking-[0.3em] text-[10px] font-bold font-urbanist hover:text-amber-900 hover:border-amber-900 transition-colors">
              {t("ctaProceso")} →
            </Link>
          </div>
        </div>
      </section>

      {/* EL TALLER POR DENTRO: solo si hay fotos en public/sobre-el-taller/ */}
      {galeria.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 pb-24" aria-labelledby="galeria-taller">
          <div className="max-w-6xl mx-auto">
            <h2 id="galeria-taller" className="text-3xl md:text-4xl font-nixie text-center mb-10">{t("galeriaTitulo")}</h2>
            <div className={`grid grid-cols-1 gap-4 ${galeria.length > 1 ? "sm:grid-cols-2" : ""} ${galeria.length > 2 ? "lg:grid-cols-3" : ""}`}>
              {galeria.map((foto, i) => (
                <div key={foto} className="relative aspect-[4/3] rounded-sm overflow-hidden bg-stone-100">
                  <Image src={foto} alt={`${t("altGaleria")} (${i + 1})`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DÓNDE ESTAMOS */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-6 border-t border-[#e5e0d8] pt-16">
          <h2 className="text-3xl md:text-4xl font-nixie">{t("ubicacionTitulo")}</h2>
          <p className="text-[#5f5852] font-urbanist text-lg leading-relaxed">{t("ubicacionTexto")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/contacto" className="rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors">{t("ctaContacto")}</Link>
            <Link href="/coleccion" className="rounded-full border border-stone-900 text-stone-900 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-stone-50 transition-colors">{t("ctaColeccion")}</Link>
          </div>
          <p className="text-sm font-urbanist">
            <Link href="/lamparas-a-medida" className="underline underline-offset-4 hover:text-amber-900">{t("ctaMedida")}</Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
