export const dynamic = "force-dynamic";

import { Link } from "@/navigation"; 
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server"; 
import { ProductDetailClient } from "@/app/[locale]/components/product-detail-client";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client"; 

export async function generateStaticParams() {
  const query = `*[_type == "producto" && defined(slug.current)] { "slug": slug.current }`;
  const productos = await client.fetch(query);
  const locales = ["es", "en"];

  return productos.flatMap((producto: { slug: string }) =>
    locales.map((locale) => ({
      locale,
      slug: producto.slug,
    }))
  );
}

async function getProductoSanityBySlug(slug: string) {
  const query = `*[_type == "producto" && slug.current == $slug][0] {
    _id,
    nombre,
    slug,
    precio,
    descripcion,
    descripcionLarga,
    "imagen": imagen { ..., asset-> },
    "imagenes": imagenes[] { ..., asset-> },
    materialBase,
    materialPantalla,
    cable,
    medidas,
    cuidados,
    estado
  }`;

  return await client.fetch(query, { slug }, { cache: "no-store" });
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductoPage(props: PageProps) {
  // 1. Extraemos correctamente tanto slug como locale
  const { slug, locale } = await props.params;
  
  const producto = await getProductoSanityBySlug(slug);

  if (!producto) {
    notFound();
  }

  // 2. Pasamos el locale a getTranslations si es necesario para el contexto
  const t = await getTranslations({ locale, namespace: "FichaProducto" });

  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />
      
      <section className="max-w-6xl mx-auto px-6 pt-12">
        <p className="text-sm text-stone-500">
          <Link
            href="/coleccion"
            className="border-b border-stone-400 hover:text-stone-800 hover:border-stone-800 transition-colors"
          >
            {t("botonVolver")}
          </Link>
        </p>
      </section>
      
      {/* Pasamos el objeto producto completo al cliente */}
      <ProductDetailClient producto={producto} />
      
      <SiteFooter />
    </main>
  );
}