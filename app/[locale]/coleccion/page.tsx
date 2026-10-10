export const dynamic = "force-dynamic";

import { Link } from "@/navigation"; 
import { getTranslations } from "next-intl/server"; 
import { ColeccionFiltrable } from "@/app/[locale]/components/coleccion-filtrable";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client";
import { ESTADO_EFECTIVO } from "@/sanity/lib/reservas";
import { metadataPagina } from "@/app/[locale]/lib/seo";
import { jsonLdHtml, ordenarPorDisponibilidad } from "@/app/[locale]/lib/producto-seo";
import type { ProductoSanity } from "@/sanity/lib/tipos";

export const generateMetadata = metadataPagina("coleccion", "/coleccion");

async function getColeccionCompleta() {
  // Traemos el objeto slug completo para que el enlace funcione
  const query = `*[_type == "producto"] | order(_createdAt desc) {
    _id,
    nombre,
    slug,
    precio,
    descripcion,
    descripcionLarga,
    imagen,
    imagenes,
    materialBase,
    materialPantalla,
    cable,
    medidas,
    cuidados,
    tipo,
    ${ESTADO_EFECTIVO}
  }`;

  const piezas: ProductoSanity[] = await client.fetch(query, {}, { next: { revalidate: 10 } });
  // Primero lo que se puede comprar; después reservadas y vendidas (archivo)
  return ordenarPorDisponibilidad(piezas);
}

// Preguntas frecuentes: mismas condiciones que la página de envíos y el carrito
const PREGUNTAS = ["p1", "p2", "p3", "p4", "p5"] as const;

const claseEnlace = "underline underline-offset-2 hover:text-stone-900";
const enlacesFaq = {
  contacto: (c: React.ReactNode) => <Link href="/contacto" className={claseEnlace}>{c}</Link>,
  envios: (c: React.ReactNode) => <Link href="/envios-devoluciones" className={claseEnlace}>{c}</Link>,
  medida: (c: React.ReactNode) => <Link href="/lamparas-a-medida" className={claseEnlace}>{c}</Link>,
};

export default async function ColeccionPage() {
  const productosSanity = await getColeccionCompleta();
  const t = await getTranslations("Coleccion");

  // Marcado FAQPage con el mismo texto visible (sin las etiquetas de los enlaces)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREGUNTAS.map((p) => ({
      "@type": "Question",
      name: t(`faq.${p}.pregunta`),
      acceptedAnswer: { "@type": "Answer", text: (t.raw(`faq.${p}.respuesta`) as string).replace(/<\/?\w+>/g, "") },
    })),
  };

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(faqJsonLd)} />
      <SiteNav />

      {/* CABECERA DE LA COLECCIÓN (Centrada, elegante y con escala adaptada) */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <div className="max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/90 font-urbanist mb-4">
              {t("tagline")}
            </p>
          
            <h1 className="text-5xl md:text-7xl font-nixie text-[#3a3530] leading-tight mb-6">
              {t("titulo")}
            </h1>
          
            <p className="text-lg md:text-xl text-[#6b645d] leading-relaxed font-urbanist font-light mb-8 max-w-2xl mx-auto">
              {t("descripcion")}
            </p>
          
            <p className="text-sm font-urbanist">
              <Link
                href="/"
                className="border-b border-[#a69680] pb-1 hover:text-[#3a3530] hover:border-[#3a3530] transition-colors uppercase tracking-[0.2em] text-[10px]"
              >
                {t("botonVolver")}
              </Link>
            </p>
        </div>
      </section>

      {/* GALERÍA DE PRODUCTOS (Ancho fluido adaptado a pantallas grandes) */}
      <section className="px-6 md:px-12 lg:px-20 pb-24">
        <h2 className="sr-only">{t("srObras")}</h2>
        <ColeccionFiltrable productos={productosSanity} />
      </section>

      <section aria-labelledby="preguntas-frecuentes" className="px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <h2 id="preguntas-frecuentes" className="text-3xl md:text-4xl font-nixie text-[#3a3530] text-center mb-10">
            {t("faq.titulo")}
          </h2>
          <div className="divide-y divide-stone-200 border-y border-stone-200 font-urbanist">
            {PREGUNTAS.map((p) => (
              <details key={p} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base md:text-lg text-[#3a3530] [&::-webkit-details-marker]:hidden">
                  {t(`faq.${p}.pregunta`)}
                  <span aria-hidden="true" className="text-xl text-stone-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[#5f5852] leading-relaxed">{t.rich(`faq.${p}.respuesta`, enlacesFaq)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}