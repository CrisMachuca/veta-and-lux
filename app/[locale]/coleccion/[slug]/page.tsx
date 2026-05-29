// 🌟 OBLIGATORIO: Forzamos a Next.js a tratar el detalle del producto como dinámico.
// Esto evita que el botón de compra o el estado de la lámpara se queden congelados en la caché.
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/app/[locale]/components/product-detail-client";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client"; // Importamos el cliente de Sanity
import { ProductoSanity } from "@/app/lib/productos";

// Modificamos generateStaticParams para que Next.js conozca las rutas base inicialmente
export async function generateStaticParams() {
  const query = `*[_type == "producto"] { "slug": slug.current }`;
  const productos = await client.fetch(query);
  return productos.map((producto: { slug: string }) => ({ slug: producto.slug }));
}

// Creamos la función que consulta la lámpara específica en la nube de Sanity
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

  // Forzamos de forma explícita a que no use la caché ("no-store")
  // para obtener el campo 'estado' en vivo cada vez que un cliente abre la ficha.
  return await client.fetch(
    query, 
    { slug }, 
    { cache: "no-store", next: { revalidate: 0 } }
  );
}

// El tipado acepta tanto Promesas como objetos directos para asegurar máxima compatibilidad con motores JS antiguos
interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProductoPage(props: PageProps) {
  // 🌟 SOLUCIÓN PANTALLA EN BLANCO: Resolvemos params de forma segura y tolerante a fallos
  const resolvedParams = await props.params;
  const { slug } = resolvedParams;
  
  // Traemos la información en tiempo real desde Sanity sin intermediarios de caché
  const producto = await getProductoSanityBySlug(slug);

  if (!producto) {
    notFound();
  }

  // Adaptamos el objeto antes de pasárselo a ProductDetailClient 
  // Esto evita tener que reescribir todo el componente visual del cliente,
  // inyectándole un "id" de imitación y el precio formateado con el símbolo "€"
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
            ← Volver a colección
          </Link>
        </p>
      </section>
      {/* Le enviamos el producto adaptado para que tu diseño siga funcionando perfecto */}
      <ProductDetailClient producto={productoAdaptado as any} />
      <SiteFooter />
    </main>
  );
}