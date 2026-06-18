export const dynamic = "force-dynamic";

import { Link } from "@/navigation"; 
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server"; 
import { ProductDetailClient } from "@/app/[locale]/components/product-detail-client";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client"; 

export async function generateStaticParams() {
  const query = `*[_type == "producto"] { "slug": slug.current }`;
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
  // Traemos el objeto completo de Sanity
  const query = `*[_type == "producto" && slug.current == $slug][0] {
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

  return await client.fetch(
    query, 
    { slug }, 
    { cache: "no-store", next: { revalidate: 0 } }
  );
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductoPage(props: PageProps) {
  const resolvedParams = await props.params;
  const { slug } = resolvedParams;
  
  const producto = await getProductoSanityBySlug(slug);

  if (!producto) {
    notFound();
  }

  const t = await getTranslations("FichaProducto");

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