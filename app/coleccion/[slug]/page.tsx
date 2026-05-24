import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/app/components/product-detail-client";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { getProductoBySlug, productos } from "@/app/lib/productos";

export function generateStaticParams() {
  return productos.map((producto) => ({ slug: producto.slug }));
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);

  if (!producto) {
    notFound();
  }

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
      <ProductDetailClient producto={producto} />
      <SiteFooter />
    </main>
  );
}
