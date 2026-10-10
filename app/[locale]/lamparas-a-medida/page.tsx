export const dynamic = "force-dynamic";

import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { EnlacesContactoEncargo } from "@/app/[locale]/components/enlaces-contacto-encargo";
import { client, urlFor } from "@/sanity/lib/client";
import { ESTADO_EFECTIVO } from "@/sanity/lib/reservas";
import type { ProductoSanity } from "@/sanity/lib/tipos";
import { metadataPagina } from "@/app/[locale]/lib/seo";
import { nombreProducto } from "@/app/[locale]/lib/producto-seo";

export const generateMetadata = metadataPagina("encargos", "/lamparas-a-medida");

type Paso = { titulo: string; texto: string };

// Piezas ya vendidas como ejemplos de lo que se puede encargar
async function getPiezasVendidas(): Promise<ProductoSanity[]> {
  const piezas: ProductoSanity[] = await client.fetch(
    `*[_type == "producto" && defined(slug.current) && defined(imagen.asset)] | order(_createdAt desc) {
      _id, nombre, "slug": slug.current, imagen, tipo, ${ESTADO_EFECTIVO}
    }`,
    {},
    { cache: "no-store" }
  );
  return piezas.filter((p) => p.estado === "vendido").slice(0, 6);
}

export default async function LamparasAMedidaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Encargos" });
  const pasos = t.raw("pasos") as Paso[];
  const vendidas = await getPiezasVendidas();

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      <header className="px-6 pt-20 pb-14 md:pt-28 md:pb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/80 font-urbanist mb-4">{t("tagline")}</p>
          <h1 className="text-5xl md:text-7xl font-nixie text-[#3a3530] leading-tight mb-6">{t("titulo")}</h1>
          <p className="text-lg md:text-xl text-[#5f5852] leading-relaxed font-urbanist font-light max-w-2xl mx-auto">{t("intro")}</p>
        </div>
      </header>

      <section className="px-6 pb-20" aria-labelledby="como-funciona">
        <div className="max-w-5xl mx-auto">
          <h2 id="como-funciona" className="text-3xl md:text-4xl font-nixie text-center mb-12">{t("pasosTitulo")}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasos.map((paso, i) => (
              <li key={paso.titulo} className="border-t border-[#3a3530]/20 pt-6 space-y-3">
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

      <section className="bg-[#f2efe9] border-y border-[#e5e0d8] px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-nixie">{t("interioristasTitulo")}</h2>
          <p className="text-[#5f5852] font-urbanist leading-relaxed">{t("interioristasTexto")}</p>
        </div>
      </section>

      {vendidas.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-20" aria-labelledby="ejemplos">
          <div className="max-w-6xl mx-auto">
            <h2 id="ejemplos" className="text-3xl md:text-4xl font-nixie text-center mb-3">{t("ejemplosTitulo")}</h2>
            <p className="text-center text-[#5f5852] font-urbanist mb-12">{t("ejemplosTexto")}</p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
              {vendidas.map((p) => (
                <li key={p._id}>
                  <Link href={`/coleccion/${p.slug as string}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
                      <Image
                        src={urlFor(p.imagen!).width(600).height(750).fit("crop").auto("format").url()}
                        alt={nombreProducto(p, locale)}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-3 font-nixie text-sm md:text-lg">{nombreProducto(p, locale)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center space-y-6 rounded-2xl border border-stone-200 bg-white p-8 md:p-12">
          <h2 className="text-3xl font-nixie">{t("ctaTitulo")}</h2>
          <p className="text-[#5f5852] font-urbanist">{t("ctaTexto")}</p>
          <EnlacesContactoEncargo
            textoWhatsapp={t("ctaWhatsapp")}
            textoEmail={t("ctaEmail")}
            mensajeWhatsapp={t("whatsappMensaje")}
            asuntoEmail={t("titulo")}
          />
          <p className="text-xs text-stone-500 font-urbanist">{t("devolucionNota")}</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
