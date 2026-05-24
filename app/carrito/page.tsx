import Link from "next/link";
import { CarritoClient } from "@/app/components/carrito-client";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";

export default function CarritoPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />

      <section className="max-w-3xl mx-auto px-6 pt-14 pb-8 md:pt-20 md:pb-10">
        <p className="text-sm uppercase tracking-widest text-stone-500 mb-4">
          Tu selección
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight mb-6">
          Carrito
        </h1>
        <p className="text-stone-600 leading-relaxed">
          Revisa las piezas y cantidades. Para formalizar el pedido, escríbenos
          desde contacto con el detalle de tu carrito.
        </p>
        <p className="mt-6 text-sm text-stone-500">
          <Link
            href="/coleccion"
            className="border-b border-stone-400 hover:text-stone-800 hover:border-stone-800 transition-colors"
          >
            Seguir comprando
          </Link>
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <CarritoClient />
      </section>

      <SiteFooter />
    </main>
  );
}
