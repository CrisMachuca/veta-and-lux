// 🌟 OBLIGATORIO: Forzamos a Next.js a tratar la Home como dinámica en producción.
// Esto evita que Hostinger cachee el estado anterior ("disponible") de las lámparas.
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ProductGallery } from "./components/product-gallery";
import { SiteFooter } from "./components/site-footer";
import { SiteNav } from "./components/site-nav";
import { client } from "@/sanity/lib/client";

// Modificamos la consulta para filtrar por productos donde 'destacado == true'
async function getProductosDestacados() {
  const query = `*[_type == "producto" && destacado == true] | order(_createdAt desc) {
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

  // 🌟 CLAVE: Forzamos a que no almacene datos en el fetch ("no-store") 
  // para obtener el estado "reservado" o "vendido" al segundo desde Sanity.
  return await client.fetch(
    query, 
    {}, 
    { cache: "no-store", next: { revalidate: 0 } }
  );
}

export default async function Page() {
  // Traemos las lámparas destacadas en tiempo real sin caché
  const productosSanity = await getProductosDestacados();

  return (
    <main className="min-h-screen bg-stone-50 antialiased text-stone-800">
      <SiteNav />
      
      {/* SECCIÓN HERO */}
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
            className="inline-block bg-stone-900 text-stone-50 px-8 py-3 rounded-full hover:bg-stone-800 transition-colors duration-300 text-sm tracking-wider"
          >
            Explorar Colección
          </Link>
        </div>
      </section>
      
      {/* SECCIÓN PIEZAS DESTACADAS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light text-stone-800 mb-12 text-center uppercase tracking-widest">
          Piezas Destacadas
        </h2>

        {/* Muestra exclusivamente las piezas seleccionadas en Sanity */}
        <ProductGallery productos={productosSanity} />
      </section>

      {/* 🌟 NUEVA SECCIÓN: ADELANTO EDITORIAL DEL PROCESO ARTESANAL */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Bloque Imagen Izquierda */}
          <div className="relative aspect-[4/5] md:aspect-square bg-stone-100 overflow-hidden rounded-sm ring-1 ring-stone-200/60 shadow-sm flex items-center justify-center text-stone-400 text-xs tracking-widest uppercase font-mono">
            <img
              src="/detalle.png"
              alt="Madera recuperada y herramientas en el banco de trabajo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-[12px] border-stone-50/20 m-4 rounded-sm"></div>
          </div>

          {/* Bloque Texto Derecha (El Adelanto de la historia) */}
          <div className="space-y-6">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">
              El Manifiesto del Taller
            </p>
            
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-light leading-tight">
              Elogio a la madera: <br />
              <span className="italic">El valor de lo pausado</span>
            </h2>
            
            <p className="text-stone-600 font-light leading-relaxed text-sm md:text-base">
              Nuestras obras comienzan lejos del ruido comercial. Buscamos maderas que ya han vivido: piezas esculpidas por el mar en la costa, ramas caídas en el bosque o restos procedentes de podas controladas y totalmente éticas. 
            </p>
            
            <p className="text-stone-600 font-light leading-relaxed text-sm md:text-base">
              Cada tronco o raíz inicia un letargo de meses en nuestro banco de trabajo para estabilizar su fibra. Solo entonces, mediante un saneado manual humilde y una electrónica de alta custodia con acabados de latón y lino, liberamos la luz que reside en su veta.
            </p>
            
            {/* Pequeño índice visual de las fases para picar la curiosidad */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-stone-200 font-mono text-[10px] text-stone-400 uppercase tracking-wider">
              <div>01. El Hallazgo</div>
              <div>02. El Letargo</div>
              <div>03. La Luz</div>
            </div>

            <div className="pt-2">
              <Link
                href="/proceso"
                className="inline-block text-stone-950 font-medium border-b border-stone-950 pb-1 hover:text-stone-500 hover:border-stone-300 transition-all text-xs uppercase tracking-widest font-mono"
              >
                Descubrir el proceso completo →
              </Link>
            </div>
          </div>

        </div>
      </section>
      
      <SiteFooter />
    </main>
  );
}