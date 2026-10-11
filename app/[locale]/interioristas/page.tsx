import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { EnlacesContactoEncargo } from "@/app/[locale]/components/enlaces-contacto-encargo";
import { metadataPagina } from "@/app/[locale]/lib/seo";
import { jsonLdHtml, paginaJsonLd } from "@/app/[locale]/lib/producto-seo";
import { urlAbsoluta } from "@/app/[locale]/lib/rutas";

export const generateMetadata = metadataPagina("interioristas", "/interioristas");

type Bloque = { titulo: string; texto: string };

// Recorrido profesional: interioristas, arquitectos y estudios (proyectos con varias piezas o a medida)
export default async function InterioristasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Interioristas" });
  const tm = await getTranslations({ locale, namespace: "Metadata" });
  const ofrecemos = t.raw("ofrecemos") as Bloque[];
  const pasos = t.raw("pasos") as Bloque[];

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(
          paginaJsonLd("WebPage", { url: urlAbsoluta("/interioristas", locale), nombre: tm("interioristas.titulo"), descripcion: tm("interioristas.descripcion"), locale })
        )}
      />
      <SiteNav />

      <header className="px-6 pt-20 pb-14 md:pt-28 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/90 font-urbanist mb-4">{t("tagline")}</p>
          <h1 className="text-5xl md:text-7xl font-nixie leading-tight mb-8">{t("titulo")}</h1>
          <p className="text-lg md:text-xl text-[#5f5852] leading-relaxed font-urbanist font-light text-left md:text-center">{t("respuesta")}</p>
        </div>
      </header>

      <section aria-labelledby="ofrecemos" className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 id="ofrecemos" className="text-3xl md:text-4xl font-nixie text-center mb-12">{t("ofrecemosTitulo")}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {ofrecemos.map((o) => (
              <li key={o.titulo} className="border-t border-[#3a3530]/20 pt-6 space-y-3">
                <h3 className="font-nixie text-xl">{o.titulo}</h3>
                <p className="text-[#5f5852] font-urbanist leading-relaxed">{o.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="proyecto" className="bg-[#f2efe9] border-y border-[#e5e0d8] px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 id="proyecto" className="text-3xl md:text-4xl font-nixie text-center mb-12">{t("pasosTitulo")}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasos.map((paso, i) => (
              <li key={paso.titulo} className="space-y-3">
                <span className="block font-urbanist text-xs uppercase tracking-[0.3em] text-amber-900/80 font-bold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-nixie text-xl">{paso.titulo}</h3>
                <p className="text-[#5f5852] font-urbanist leading-relaxed">{paso.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 flex flex-col sm:flex-row gap-4 justify-center text-center font-urbanist">
            <Link href="/lamparas-a-medida" className="text-xs uppercase tracking-[0.25em] font-bold underline underline-offset-4 hover:text-amber-900">{t("ctaMedida")}</Link>
            <Link href="/materiales-y-procedencia" className="text-xs uppercase tracking-[0.25em] font-bold underline underline-offset-4 hover:text-amber-900">{t("ctaMateriales")}</Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="ficha-tecnica" className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 id="ficha-tecnica" className="text-3xl font-nixie">{t("fichaTitulo")}</h2>
          <p className="text-lg text-[#5f5852] font-urbanist leading-relaxed">{t("fichaTexto")}</p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center space-y-6 rounded-2xl border border-stone-200 bg-white p-8 md:p-12">
          <h2 className="text-3xl font-nixie">{t("ctaTitulo")}</h2>
          <p className="text-[#5f5852] font-urbanist">{t("ctaTexto")}</p>
          <EnlacesContactoEncargo
            textoWhatsapp={t("ctaWhatsapp")}
            textoEmail={t("ctaEmail")}
            mensajeWhatsapp={t("whatsappMensaje")}
            asuntoEmail={t("asunto")}
            origen="interioristas"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
