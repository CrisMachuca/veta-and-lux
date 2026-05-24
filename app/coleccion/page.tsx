import Link from "next/link";
import { ProductGallery } from "@/app/components/product-gallery";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { productos } from "@/app/lib/productos";

export default function ColeccionPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
        <p className="text-sm uppercase tracking-widest text-stone-500 mb-4">
          Catálogo
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight mb-6">
          Colección
        </h1>
        <p className="max-w-2xl text-lg text-stone-600 leading-relaxed">
          Sobremesas, vigas y piezas de tronco con luz cálida. Cada referencia es
          artesanal; pulsa una imagen para entrar a su ficha completa con galería,
          cuidados y zoom detallado.
        </p>
        <p className="mt-6 text-sm text-stone-500">
          <Link
            href="/"
            className="border-b border-stone-400 hover:text-stone-800 hover:border-stone-800 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="sr-only">Piezas disponibles</h2>
        <ProductGallery productos={productos} />
      </section>

      <SiteFooter />
    </main>
  );
}
