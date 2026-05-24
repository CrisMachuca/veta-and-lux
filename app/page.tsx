import Link from "next/link";
import { ProductGallery } from "./components/product-gallery";
import { SiteFooter } from "./components/site-footer";
import { SiteNav } from "./components/site-nav";
import { productos } from "./lib/productos";

export default function Page() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />
      {/* CODIGO HERO */}
      <section className="relative flex flex-col items-center justify-center py-20 px-6 text-center overflow-hidden rounded-2xl mx-4 md:mx-8 mt-6">
        <img
          src="/detalle.png"
          alt="Fondo de madera artesanal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-950/30"></div>
        <div className="relative z-10 bg-stone-50/80 backdrop-blur-sm border border-stone-200/70 rounded-xl px-8 py-10 md:px-12 md:py-12 shadow-lg">
          <span className="text-sm uppercase tracking-widest text-stone-500 mb-4 block">
            Hecho a mano · Madera recuperada
          </span>

          <h1 className="text-5xl md:text-7xl font-light text-stone-900 mb-6 tracking-tight">
            Veta <span className="font-serif italic">&</span> Lux
          </h1>

          <p className="max-w-xl text-lg text-stone-600 leading-relaxed mb-10">
            Iluminación con alma. Rescatamos la belleza oculta en maderas
            antiguas para crear piezas únicas que cuentan una historia en cada
            destello.
          </p>

          <Link
            href="/coleccion"
            className="inline-block bg-stone-900 text-stone-50 px-8 py-3 rounded-full hover:bg-stone-800 transition-colors duration-300"
          >
            Explorar Colección
          </Link>
        </div>
      </section>
      {/* AQUÍ TERMINA EL CÓDIGO DEL HERO */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light text-stone-800 mb-12 text-center uppercase tracking-widest">
          Piezas Destacadas
        </h2>

        <ProductGallery productos={productos} />
      </section>
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square bg-stone-100 overflow-hidden rounded-2xl ring-1 ring-stone-200/80 shadow-sm">
            <img
              src="/detalle.png"
              alt="Madera recuperada y herramientas"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-[15px] border-stone-50/25 m-4 rounded-xl"></div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-light text-stone-900 tracking-tight">
              Del olvido a la <span className="italic font-serif">luz</span>
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Cada pieza de **Veta & Lux** comienza su viaje en lugares
              olvidados: graneros antiguos, vigas de derribo o troncos caídos
              tras la tormenta.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Respetamos las cicatrices, los nudos y la historia de la madera,
              transformando materiales honestos en esculturas de luz que aportan
              calidez y serenidad a tu hogar.
            </p>
            <div className="pt-4">
              <Link
                href="/taller"
                className="text-stone-900 font-medium border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-400 transition-all"
              >
                Conoce nuestro taller →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
