// 🌟 OBLIGATORIO: Forzamos a Next.js a tratar el detalle del producto como dinámico.
export const dynamic = "force-dynamic";

import { Link } from "@/navigation"; // 🌟 Usamos el Link configurado para next-intl
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server"; // 🌟 getTranslations para Server Components asíncronos
import { ProductDetailClient } from "@/app/[locale]/components/product-detail-client";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client"; 
import { ProductoSanity } from "@/app/lib/productos";

// Modificamos generateStaticParams para incluir el parámetro 'locale' en el enrutamiento dinámico
export async function generateStaticParams() {
  const query = `*[_type == "producto"] { "slug": slug.current }`;
  const productos = await client.fetch(query);
  
  // Idiomas soportados por el ecosistema de tu aplicación
  const locales = ["es", "en"];

  // Multiplicamos las rutas para mapear tanto /es/coleccion/slug como /en/coleccion/slug
  return productos.flatMap((producto: { slug: string }) =>
    locales.map((locale) => ({
      locale,
      slug: producto.slug,
    }))
  );
}

// Consultamos la lámpara directamente en el almacenamiento de Sanity
async function getProductoSanityBySlug(slug: string): Promise<ProductoSanity | null> {
  const query = `*[_type == "producto" && slug.current == $slug][0] {
    _id,
    nombre,
    "slug": slug.current,
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

// Soportamos de forma nativa los params asíncronos de Next.js
interface PageProps {
  params: Promise<{ slug: string; locale: string }> | { slug: string; locale: string };
}

export default async function ProductoPage(props: PageProps) {
  // Resolvemos los parámetros con seguridad
  const resolvedParams = await props.params;
  const { slug } = resolvedParams;
  
  // Solicitamos los datos a Sanity
  const producto = await getProductoSanityBySlug(slug);

  if (!producto) {
    notFound();
  }

  // 🌟 Cargamos el diccionario traducible para los botones fijos de la ficha
  const t = await getTranslations("FichaProducto");

  // Mapeamos el objeto para mantener compatibilidad con el resto de componentes de UI
  const productoAdaptado = {
    ...producto,
    id: producto._id,
    precio: `${producto.precio}€`
  };

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
      
      {/* Pasamos los datos estructurados al componente de cliente */}
      <ProductDetailClient producto={productoAdaptado as any} />
      
      <SiteFooter />
    </main>
  );
}