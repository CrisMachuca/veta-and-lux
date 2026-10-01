export const dynamic = "force-dynamic";

import { Link } from "@/navigation"; 
import { getTranslations } from "next-intl/server"; 
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client";
import { ESTADO_EFECTIVO } from "@/sanity/lib/reservas";
import FadeIn from "@/app/[locale]/components/motion/FadeIn";
import { metadataPagina } from "@/app/[locale]/lib/seo";

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
    ${ESTADO_EFECTIVO}
  }`;

  return await client.fetch(query, {}, { next: { revalidate: 10 } });
}

export default async function ColeccionPage() {
  const productosSanity = await getColeccionCompleta();
  const t = await getTranslations("Coleccion");

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      {/* CABECERA DE LA COLECCIÓN (Centrada, elegante y con escala adaptada) */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <FadeIn direction="down" delay={0.2}>
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/70 font-urbanist mb-4">
              {t("tagline")}
            </p>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.4}>
            <h1 className="text-5xl md:text-7xl font-nixie text-[#3a3530] leading-tight mb-6">
              {t("titulo")}
            </h1>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.6}>
            <p className="text-lg md:text-xl text-[#6b645d] leading-relaxed font-urbanist font-light mb-8 max-w-2xl mx-auto">
              {t("descripcion")}
            </p>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.8}>
            <p className="text-sm font-urbanist">
              <Link
                href="/"
                className="border-b border-[#a69680] pb-1 hover:text-[#3a3530] hover:border-[#3a3530] transition-colors uppercase tracking-[0.2em] text-[10px]"
              >
                ← {t("botonVolver")}
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* GALERÍA DE PRODUCTOS (Ancho fluido adaptado a pantallas grandes) */}
      <section className="px-6 md:px-12 lg:px-20 pb-32">
        <FadeIn direction="up" delay={0.5} scale={0.97}>
          <h2 className="sr-only">{t("srObras")}</h2>
          <ProductGallery productos={productosSanity} />
        </FadeIn>
      </section>

      <SiteFooter />
    </main>
  );
}