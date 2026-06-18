import { Link } from "@/navigation"; 
import { getTranslations } from "next-intl/server"; 
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

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
    estado
  }`;

  return await client.fetch(query, {}, { next: { revalidate: 10 } });
}

export default async function ColeccionPage() {
  const productosSanity = await getColeccionCompleta();
  const t = await getTranslations("Coleccion");

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-900/60 font-urbanist">
          {t("tagline")}
        </p>
        
        <h1 className="text-4xl md:text-6xl font-nixie text-[#3a3530] mt-4 leading-tight">
          {t("titulo")}
        </h1>
        
        <p className="max-w-2xl text-lg text-[#6b645d] leading-relaxed font-urbanist">
          {t("descripcion")}
        </p>
        
        <p className="mt-6 text-sm text-[#6b645d] font-urbanist">
          <Link
            href="/"
            className="border-b border-[#a69680] hover:text-[#3a3530] hover:border-[#3a3530] transition-colors"
          >
            {t("botonVolver")}
          </Link>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="sr-only">{t("srObras")}</h2>
        <ProductGallery productos={productosSanity} />
      </section>

      <SiteFooter />
    </main>
  );
}