import Link from "next/link";
import { CartNav } from "@/app/components/cart-nav";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-medium tracking-tighter text-stone-900"
        >
          Veta <span className="italic font-serif">&</span> Lux
        </Link>

        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-stone-600">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Inicio
          </Link>
          <Link href="/coleccion" className="hover:text-stone-900 transition-colors">
            Colección
          </Link>
          <Link href="/contacto" className="hover:text-stone-900 transition-colors">
            Contacto
          </Link>
        </div>

        <CartNav />
      </div>
    </nav>
  );
}
