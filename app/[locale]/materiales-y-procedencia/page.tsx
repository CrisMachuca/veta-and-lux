import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { PreguntasFrecuentes, type Pregunta } from "@/app/[locale]/components/preguntas-frecuentes";
import { metadataPagina } from "@/app/[locale]/lib/seo";
import { jsonLdHtml, paginaJsonLd } from "@/app/[locale]/lib/producto-seo";
import { urlAbsoluta } from "@/app/[locale]/lib/rutas";

export const generateMetadata = metadataPagina("materiales", "/materiales-y-procedencia");

type Bloque = { titulo: string; texto: string };

// De dónde viene la madera y cómo se prepara: la página de referencia que enlazan las fichas
// («La madera y su origen») y que pueden citar buscadores y asistentes de IA
export default async function MaterialesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Materiales" });
  const tm = await getTranslations({ locale, namespace: "Metadata" });
  const procedencias = t.raw("procedencias") as Bloque[];
  const pasos = t.raw("pasos") as Bloque[];
  const preguntas = t.raw("faq") as Pregunta[];

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(
          paginaJsonLd("WebPage", { url: urlAbsoluta("/materiales-y-procedencia", locale), nombre: tm("materiales.titulo"), descripcion: tm("materiales.descripcion"), locale })
        )}
      />
      <SiteNav />

      <header className="px-6 pt-20 pb-14 md:pt-28 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/90 font-urbanist mb-4">{t("tagline")}</p>
          <h1 className="text-5xl md:text-7xl font-nixie leading-tight mb-8">{t("titulo")}</h1>
          {/* Respuesta directa: lo primero que leen quien llega y los asistentes de IA */}
          <p className="text-lg md:text-xl text-[#5f5852] leading-relaxed font-urbanist font-light text-left md:text-center">{t("respuesta")}</p>
        </div>
      </header>

      <section aria-labelledby="procedencias" className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 id="procedencias" className="text-3xl md:text-4xl font-nixie text-center mb-12">{t("procedenciasTitulo")}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {procedencias.map((p) => (
              <li key={p.titulo} className="border-t border-[#3a3530]/20 pt-6 space-y-3">
                <h3 className="font-nixie text-xl">{p.titulo}</h3>
                <p className="text-[#5f5852] font-urbanist leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="preparacion" className="bg-[#f2efe9] border-y border-[#e5e0d8] px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 id="preparacion" className="text-3xl md:text-4xl font-nixie text-center mb-12">{t("preparacionTitulo")}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasos.map((paso, i) => (
              <li key={paso.titulo} className="space-y-3">
                <span className="block font-urbanist text-xs uppercase tracking-[0.3em] text-amber-900/80 font-bold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-nixie text-xl">{paso.titulo}</h3>
                <p className="text-[#5f5852] font-urbanist leading-relaxed">{paso.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-center font-urbanist">
            <Link href="/proceso" className="text-xs uppercase tracking-[0.25em] font-bold underline underline-offset-4 hover:text-amber-900">{t("ctaProceso")}</Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="maderas" className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 id="maderas" className="text-3xl md:text-4xl font-nixie">{t("maderasTitulo")}</h2>
          <p className="text-lg text-[#5f5852] font-urbanist leading-relaxed">{t("maderasTexto")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 font-urbanist">
            <Link href="/coleccion" className="rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors">{t("ctaColeccion")}</Link>
            <Link href="/lamparas-a-medida" className="rounded-full border border-stone-900 text-stone-900 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-stone-50 transition-colors">{t("ctaMedida")}</Link>
          </div>
        </div>
      </section>

      <PreguntasFrecuentes titulo={t("faqTitulo")} preguntas={preguntas} />

      <SiteFooter />
    </main>
  );
}
