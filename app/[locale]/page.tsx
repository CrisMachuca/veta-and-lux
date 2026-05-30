// 🌟 OBLIGATORIO: Forzamos a Next.js a tratar la Home como dinámica en producción.
export const dynamic = "force-dynamic";

import { Link } from "@/navigation";
// 🌟 SOLUCIÓN: Usamos getTranslations de next-intl/server para Server Components asíncronos
import { getTranslations } from "next-intl/server"; 
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
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
  
  // 🌟 SOLUCIÓN: Cargamos las traducciones de la sección "Inicio" con await
  const t = await getTranslations("Inicio");

  return (
    <main className="min-h-screen bg-stone-50 antialiased text-stone-800">
      <SiteNav />
      
      {/* 💎 SECCIÓN HERO 1: ALTA COSTURA EDITORIAL */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden rounded-sm mx-4 md:mx-8 mt-4 bg-stone-950">
        <img
          src="/detalle.png"
          alt="Veta & Lux - Alta illumination artesanal"
          className="absolute inset-0 w-full h-full object-cover transform scale-102 opacity-85 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/40 to-stone-950/85 bg-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950/90"></div>
        
        <div className="relative z-10 max-w-3xl space-y-8 px-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-stone-400 font-semibold block sm:inline-block border-b border-amber-800/30 pb-3">
            {t("Hero.tagline")}
          </span>

          <h1 className="text-6xl md:text-9xl font-light tracking-tighter text-white select-none pt-4">
            Veta<span className="font-serif italic text-stone-300 font-normal">&</span>Lux
          </h1>

          <p className="text-stone-300/90 font-light leading-relaxed text-base md:text-lg max-w-xl mx-auto font-sans tracking-wide">
            {t("Hero.parrafo")}
            <span className="block mt-2 text-stone-400 italic font-serif text-sm md:text-base">
              {t("Hero.subParrafo")}
            </span>
          </p>

          <div className="pt-6">
            <Link
              href="/coleccion"
              className="group relative inline-block border border-white/30 bg-transparent text-white px-14 py-4 rounded-none transition-all duration-500 text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-white transition-transform duration-500 ease-out transform translate-y-full group-hover:translate-y-0 z-0"></span>
              <span className="relative z-10 transition-colors duration-500 ease-out group-hover:text-stone-950 flex items-center justify-center gap-2">
                {t("Hero.botonAdquirir")}
                <span className="opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0 font-serif italic text-sm">
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 💎 SECCIÓN HERO 2: ENFOQUE GALERÍA DE LUJO */}
      <section className="relative flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden rounded-2xl mx-4 md:mx-8 mt-6">
        <img
          src="/detalle.png"
          alt="Textura de madera recuperada premium"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-950/25"></div>
        <div className="relative z-10 bg-stone-50/85 backdrop-blur-md border border-stone-200/60 rounded-xl px-8 py-12 md:px-16 md:py-16 shadow-xl max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-5 block font-medium">
            {t("Hero.tagline")}
          </span>

          <h1 className="text-5xl md:text-7xl font-light text-stone-900 mb-6 tracking-tight">
            Veta<span className="font-serif italic">&</span>Lux
          </h1>

          <p className="text-stone-600 font-light leading-relaxed text-base md:text-lg mb-10">
            {t("Hero.parrafo")} {t("Hero.subParrafo")}
          </p>

          <Link
            href="/coleccion"
            className="inline-block bg-stone-900 text-stone-50 px-10 py-3.5 rounded-full hover:bg-stone-800 transition-all duration-300 text-xs uppercase tracking-widest font-medium shadow-md hover:shadow-lg"
          >
            {t("Hero.botonAdquirir")}
          </Link>
        </div>
      </section>
      
      {/* 💎 SECCIÓN HERO 3: ENFOQUE INMERSIVO DE LUJO */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center overflow-hidden rounded-sm mx-4 md:mx-8 mt-4">
        <img
          src="/detalle.png"
          alt="Veta & Lux - Alta illumination artesanal"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-900/50 to-stone-950/70"></div>
        
        <div className="relative z-10 max-w-3xl space-y-6 text-stone-100 px-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-stone-300 font-medium block">
            {t("Hero.tagline")}
          </span>

          <h1 className="text-5xl md:text-8xl font-light tracking-tight text-white">
            Veta<span className="font-serif italic text-stone-300">&</span>Lux
          </h1>

          <p className="text-stone-200 font-light leading-relaxed text-base md:text-lg max-w-2xl mx-auto font-sans">
            {t("Hero.parrafo")} {t("Hero.subParrafo")}
          </p>

          <div className="pt-4">
            <Link
              href="/coleccion"
              className="inline-block bg-white text-stone-950 px-12 py-4 rounded-none hover:bg-stone-200 transition-all duration-300 text-xs uppercase tracking-widest font-medium shadow-sm"
            >
              {t("Hero.botonAdquirir")}
            </Link>
          </div>
        </div>
      </section>
      
      {/* 🪵 SECCIÓN PIEZAS DESTACADAS */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-xs font-medium text-stone-400 mb-16 text-center uppercase tracking-[0.3em]">
          {t("Galeria.titulo")}
        </h2>

        <ProductGallery productos={productosSanity} />

        <div className="mt-16 text-center">
          <Link
            href="/coleccion"
            className="inline-block border border-stone-900 bg-transparent text-stone-900 hover:bg-stone-900 hover:text-stone-50 px-12 py-4 rounded-none transition-all duration-300 text-xs uppercase tracking-widest font-medium shadow-sm font-mono"
          >
            {t("Galeria.botonVerColeccion")}
          </Link>
        </div>
      </section>

      {/* 📜 SECCIÓN: GARANTÍA Y VALORES LUXURY */}
      <section className="bg-stone-100/60 border-t border-b border-stone-200/80 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <div className="space-y-2">
            <h4 className="font-serif text-sm italic text-stone-900 font-medium">{t("Garantias.g1Titulo")}</h4>
            <p className="text-stone-600 text-xs font-light leading-relaxed">
              {t("Garantias.g1Texto")}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-serif text-sm italic text-stone-900 font-medium">{t("Garantias.g2Titulo")}</h4>
            <p className="text-stone-600 text-xs font-light leading-relaxed">
              {t("Garantias.g2Texto")}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-serif text-sm italic text-stone-900 font-medium">{t("Garantias.g3Titulo")}</h4>
            <p className="text-stone-600 text-xs font-light leading-relaxed">
              {t("Garantias.g3Texto")}
            </p>
          </div>

        </div>
      </section>

      {/* 🛠️ SECCIÓN: MANIFIESTO DEL PROCESO ARTESANAL */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="relative aspect-[4/5] md:aspect-square bg-stone-100 overflow-hidden rounded-sm ring-1 ring-stone-200/60 shadow-sm flex items-center justify-center">
            <img
              src="/detalle.png"
              alt="Madera recuperada y herramientas en el banco de trabajo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-[12px] border-stone-50/20 m-4 rounded-sm"></div>
          </div>

          <div className="space-y-6">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">
              {t("Manifiesto.tagline")}
            </p>
            
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-light leading-tight">
              {t("Manifiesto.titulo")} <br />
              <span className="italic">{t("Manifiesto.subtitulo")}</span>
            </h2>
            
            <p className="text-stone-600 font-light leading-relaxed text-sm md:text-base">
              {t("Manifiesto.p1")}
            </p>
            
            <p className="text-stone-600 font-light leading-relaxed text-sm md:text-base">
              {t("Manifiesto.p2")}
            </p>
            
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-stone-200 font-mono text-[10px] text-stone-400 uppercase tracking-wider">
              <div>{t("Manifiesto.fase1")}</div>
              <div>{t("Manifiesto.fase2")}</div>
              <div>{t("Manifiesto.fase3")}</div>
            </div>

            <div className="pt-2">
              <Link
                href="/proceso"
                className="inline-block text-stone-950 font-medium border-b border-stone-950 pb-1 hover:text-stone-500 hover:border-stone-300 transition-all text-xs uppercase tracking-widest font-mono"
              >
                {t("Manifiesto.botonProceso")}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 💼 SECCIÓN: CONSULTAS PRIVADAS / ENCARGOS */}
      <section className="bg-stone-900 text-stone-100 py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-3xl font-serif font-light text-stone-50">
            {t("Encargos.titulo")}
          </h3>
          <p className="text-stone-400 font-light text-sm md:text-base leading-relaxed">
            {t("Encargos.texto")}
          </p>
          <div className="pt-4">
            <Link
              href="/contacto"
              className="inline-block bg-white text-stone-950 px-10 py-3.5 rounded-none hover:bg-stone-200 transition-all text-xs uppercase tracking-widest font-medium"
            >
              {t("Encargos.botonContacto")}
            </Link>
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </main>
  );
}