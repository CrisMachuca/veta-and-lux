import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/app/components/product-detail-client";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { client } from "@/sanity/lib/client"; // Importamos el cliente de Sanity
import { ProductoSanity } from "@/app/lib/productos";

// 1. Modificamos generateStaticParams para que Next.js pre-renderice usando Sanity si lo deseas
export async function generateStaticParams() {
  const query = `*[_type == "producto"] { "slug": slug.current }`;
  const productos = await client.fetch(query);
  return productos.map((producto: { slug: string }) => ({ slug: producto.slug }));
}

// 2. Creamos la función que consulta la lámpara específica en la nube de Sanity
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

  return await client.fetch(query, { slug });
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // 3. Traemos la información en tiempo real desde Sanity
  const producto = await getProductoSanityBySlug(slug);

  if (!producto) {
    notFound();
  }

  // 4. Adaptamos el objeto antes de pasárselo a ProductDetailClient 
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