// 🌟 OBLIGATORIO: Forzamos a Next.js a tratar la Home como dinámica en producción.
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ProductGallery } from "./components/product-gallery";
import { SiteFooter } from "./components/site-footer";
import { SiteNav } from "./components/site-nav";
import { client } from "@/sanity/lib/client";

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

  return await client.fetch(
    query, 
    {}, 
    { cache: "no-store", next: { revalidate: 0 } }
  );
}

export default async function Page() {
  const productosSanity = await getProductosDestacados();

  return (
    <main className="min-h-screen bg-stone-50 antialiased text-stone-800">
      <SiteNav />
      
      {/* SECCIÓN HERO (Enfoque Galería de Lujo) */}
      <section className="relative flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden rounded-2xl mx-4 md:mx-8 mt-6">
        <img
          src="/detalle.png"
          alt="Textura de madera recuperada premium"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-950/25"></div>
        <div className="relative z-10 bg-stone-50/85 backdrop-blur-md border border-stone-200/60 rounded-xl px-8 py-12 md:px-16 md:py-16 shadow-xl max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-5 block font-medium">
            Esculturas de Luz · Ediciones Únicas
          </span>

          <h1 className="text-5xl md:text-7xl font-light text-stone-900 mb-6 tracking-tight">
            Veta<span className="font-serif italic">&</span>Lux
          </h1>

          <p className="text-stone-600 font-light leading-relaxed text-base md:text-lg mb-10">
            Piezas de alta iluminación esculpidas a partir de maderas antiguas recuperadas. 
            Arte atemporal y alma orgánica preservados en piezas numeradas de diseño exclusivo.
          </p>

          <Link
            href="/coleccion"
            className="inline-block bg-stone-900 text-stone-50 px-10 py-3.5 rounded-full hover:bg-stone-800 transition-all duration-300 text-xs uppercase tracking-widest font-medium shadow-md hover:shadow-lg"
          >
            Adquirir Pieza Única
          </Link>
        </div>
      </section>
      
      {/* SECCIÓN PIEZAS DESTACADAS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-xs font-medium text-stone-400 mb-12 text-center uppercase tracking-[0.3em]">
          Obras Disponibles en Taller
        </h2>

        <ProductGallery productos={productosSanity} />
      </section>

      {/* 🌟 NUEVA SECCIÓN: GARANTÍA Y VALORES LUXURY */}
      <section className="bg-stone-100/60 border-t border-b border-stone-200/80 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="font-serif text-sm italic text-stone-900 font-medium">01 / Autenticidad Certificada</h4>
            <p className="text-stone-600 text-xs font-light leading-relaxed">
              Cada obra se entrega firmada por el autor y acompañada de un certificado físico que detalla la procedencia histórica, especie y coordenadas de hallazgo de la madera.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-sm italic text-stone-900 font-medium">02 / Embalaje de Alta Custodia</h4>
            <p className="text-stone-600 text-xs font-light leading-relaxed">
              Diseñamos y fabricamos de manera artesanal cajas de alta protección a medida para cada lámpara, garantizando una preservación absoluta durante el trayecto.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-sm italic text-stone-900 font-medium">03 / Logística Premium de Cortesía</h4>
            <p className="text-stone-600 text-xs font-light leading-relaxed">
              El valor de la obra incluye un seguro a todo riesgo y envío especializado sin coste adicional para la Península, gestionado por transportistas de obras de arte.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN: ADELANTO EDITORIAL DEL PROCESO ARTESANAL */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Bloque Imagen Izquierda */}
          <div className="relative aspect-[4/5] md:aspect-square bg-stone-100 overflow-hidden rounded-sm ring-1 ring-stone-200/60 shadow-sm flex items-center justify-center">
            <img
              src="/detalle.png"
              alt="Madera recuperada y herramientas en el banco de trabajo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-[12px] border-stone-50/20 m-4 rounded-sm"></div>
          </div>

          {/* Bloque Texto Derecha */}
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
              Cada tronco o raíz inicia un letargo de meses en nuestro banco de trabajo para asegurar su estabilidad natural. Solo entonces, mediante un saneado manual y componentes de alta custodia en latón macizo y lino puro, liberamos la luz latente en su veta.
            </p>
            
            {/* Pequeño índice visual de las fases */}
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

      {/* 🌟 NUEVA SECCIÓN: CONSULTAS PRIVADAS / ENCARGOS */}
      <section className="bg-stone-900 text-stone-100 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-3xl font-serif font-light text-stone-50">
            ¿Busca un proyecto a medida o asesoramiento técnico?
          </h3>
          <p className="text-stone-400 font-light text-sm md:text-base leading-relaxed">
            Trabajamos mano a mano con interioristas, arquitectos y coleccionistas privados para concebir piezas exclusivas adaptadas a espacios singulares.
          </p>
          <div className="pt-4">
            <Link
              href="/contacto"
              className="inline-block bg-stone-50 text-stone-950 px-8 py-3 rounded-full hover:bg-stone-200 transition-all text-xs uppercase tracking-widest font-medium"
            >
              Contactar con el Atelier
            </Link>
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </main>
  );
}