// 🌟 Forzamos a Next.js a tratar la Home como dinámica en producción.
export const dynamic = "force-dynamic";

import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server"; 
import Image from "next/image"; // Optimización de imágenes
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client";

// Importamos tu componente envolvente de animación flexible
import FadeIn from "@/app/[locale]/components/motion/FadeIn";

async function getProductosDestacados() {
  const query = `*[_type == "producto" && destacado == true] | order(_createdAt desc) {
    _id, nombre, "slug": slug.current, precio, descripcion, 
    descripcionLarga, imagen, imagenes, materialBase, 
    materialPantalla, cable, medidas, cuidados, estado
  }`;

  return await client.fetch(query, {}, { cache: "no-store", next: { revalidate: 0 } });
}

export default async function Page() {
  const productosSanity = await getProductosDestacados();
  const t = await getTranslations("Inicio");

  return (
    <main className="min-h-screen bg-stone-50 antialiased text-stone-800 font-urbanist">
      <SiteNav />

      {/* 💎 HERO ÚNICO: Cinemático, Profundo e Inmersivo */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden rounded-sm mx-4 md:mx-8 mt-4 bg-stone-950 shadow-2xl">
        {/* Imagen de fondo con zoom lento Ken Burns */}
        <div className="absolute inset-0 z-0 animate-ken-burns">
          <Image
            src="/detalle.png"
            alt="Veta & Lux - Alta iluminación artesanal"
            fill
            className="object-cover opacity-80 scale-105" 
            priority
          />
        </div>
        
        {/* Filtro oscuro sutil y degradado de lujo */}
        <div className="absolute inset-0 bg-stone-950/20 bg-gradient-to-b from-stone-950/10 via-stone-950/20 to-stone-950/40 z-1"></div>
        
        <div className="relative z-10 max-w-3xl space-y-8 px-4 py-20">
          {/* Coreografía 1: Tagline */}
          <FadeIn direction="down" delay={0.4} duration={1.2}>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-stone-200 font-semibold border-b border-white/20 pb-4 block select-none drop-shadow-md">
              {t("Hero.tagline")}
            </span>
          </FadeIn>

          {/* Coreografía 2: Título Monumental */}
          <FadeIn direction="none" delay={0.8} duration={1.5}>
          <h1 className="text-6xl md:text-9xl font-nixie tracking-tight text-white select-none pt-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            Veta <span className="inline-block w-[0.8em] text-center text-amber-100 opacity-90">&</span> Lux
          </h1>
          </FadeIn>

          {/* Coreografía 3: Párrafo y Botón */}
          <FadeIn direction="up" delay={1.3} duration={1.2}>
            <div className="space-y-10">
            <p className="text-stone-200 font-light leading-relaxed text-base md:text-lg max-w-lg mx-auto tracking-[0.05em] font-serif italic opacity-90">
  {t("Hero.parrafo")}
</p>

              <div className="pt-6">
                <Link
                  href="/coleccion"
                  className="group relative inline-block border border-white/40 bg-stone-950/20 text-white px-16 py-4 rounded-full transition-all duration-500 text-[11px] uppercase tracking-[0.4em] font-medium overflow-hidden shadow-xl hover:border-white/60"
                >
                  <span className="absolute inset-0 w-full h-full bg-white transition-transform duration-500 ease-out transform translate-y-full group-hover:translate-y-0"></span>
                  <span className="relative z-10 transition-colors duration-500 ease-out group-hover:text-stone-950 font-bold">
                    {t("Hero.botonAdquirir")}
                  </span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 🪵 SECCIÓN PIEZAS DESTACADAS: El Alma de la Web */}
      <section className="py-32">
        <FadeIn direction="up" delay={0.2}>
          <h2 className="text-xs font-semibold text-stone-400 mb-20 text-center uppercase tracking-[0.5em] px-6">
            {t("Galeria.titulo")}
          </h2>
        </FadeIn>

        {/* Galería con zoom sutil en cada pieza */}
        <FadeIn direction="up" delay={0.5} scale={0.96}>
          <div className="px-6 md:max-w-7xl md:mx-auto">
            <ProductGallery productos={productosSanity} isHome={true} />
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.8}>
          <div className="mt-20 text-center px-6">
            <Link href="/coleccion" className="border-b-2 border-stone-900 pb-2 uppercase text-xs tracking-[0.4em] font-bold text-stone-900 hover:text-stone-600 hover:border-stone-400 transition-all">
              {t("Galeria.botonVerColeccion")}
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 📜 SECCIÓN: GARANTÍA - Escalada rítmica */}
      <section className="bg-stone-100/60 border-y border-stone-200/80 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          {[1, 2, 3].map((i, index) => (
            <FadeIn key={i} direction="up" delay={0.3 * i} duration={1}>
              <div className="space-y-4 border-l-2 border-amber-900/10 pl-6 h-full flex flex-col justify-center">
                <h4 className="font-serif italic text-lg text-stone-900 font-medium">{t(`Garantias.g${i}Titulo`)}</h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed">{t(`Garantias.g${i}Texto`)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 🛠️ SECCIÓN: MANIFIESTO - Coreografía de revelado */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <FadeIn direction="left" delay={0.2} scale={0.9}>
            <div className="relative aspect-[4/5] md:aspect-square bg-stone-100 overflow-hidden rounded-sm ring-1 ring-stone-200/60 shadow-xl flex items-center justify-center">
              <img src="/detalle.png" alt="Artesanía Veta & Lux" className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-[16px] border-stone-50/20 m-6 rounded-sm"></div>
            </div>
          </FadeIn>

          <div className="space-y-8">
            <FadeIn direction="up" delay={0.5}>
              <p className="font-mono text-xs text-amber-900/70 uppercase tracking-[0.5em] font-bold">{t("Manifiesto.tagline")}</p>
            </FadeIn>

            <FadeIn direction="up" delay={0.7}>
              <h2 className="text-4xl md:text-5xl font-serif italic text-stone-950 font-light leading-tight">
                {t("Manifiesto.titulo")} <br />
                <span className="italic text-amber-950/90">{t("Manifiesto.subtitulo")}</span>
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.9}>
              <div className="space-y-6 text-stone-700 font-light leading-relaxed text-base md:text-lg">
                <p>{t("Manifiesto.p1")}</p>
                <p>{t("Manifiesto.p2")}</p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={1.1}>
              <div className="grid grid-cols-3 gap-3 py-6 border-t border-b border-stone-200 font-mono text-xs text-stone-400 uppercase tracking-[0.3em]">
                <div className="border-r border-stone-100 pr-3">{t("Manifiesto.fase1")}</div>
                <div className="border-r border-stone-100 pr-3">{t("Manifiesto.fase2")}</div>
                <div>{t("Manifiesto.fase3")}</div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={1.3}>
              <div className="pt-4">
                <Link href="/proceso" className="group inline-flex items-center text-stone-950 font-semibold border-b-2 border-amber-900 pb-2 hover:text-stone-600 hover:border-amber-700 transition-all text-xs uppercase tracking-[0.4em] font-mono">
                  {t("Manifiesto.botonProceso")}
                  <span className="inline-block transform transition-transform group-hover:translate-x-2 ml-3">→</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 💼 SECCIÓN: CONSULTAS PRIVADAS - Contraste Monolítico */}
      <section className="py-24 px-6 bg-[#f7f4f0]"> 
  <FadeIn direction="up" delay={0.3} duration={1.2}>
    <div className="max-w-3xl mx-auto py-16 text-center space-y-8">
      
      {/* 1. Título más pequeño, sin uppercase, con tracking sutil */}
      <h3 className="text-4xl md:text-6xl font-serif italic font-light leading-tight text-[#3a3530]">
        {t("Encargos.titulo")}
      </h3>
      
      {/* 2. Barra decorativa para anclar la mirada */}
      <div className="w-16 h-[1px] bg-[#3a3530]/20 mx-auto"></div>
      
      {/* 3. Párrafo con mejor contraste y espacio */}
      <p className="text-[#6b645d] font-light text-base md:text-lg leading-relaxed max-w-xl mx-auto font-urbanist tracking-[0.02em]">
        {t("Encargos.texto")}
      </p>

      {/* 4. Botón ajustado para no competir */}
      <div className="pt-4">
        <Link 
          href="/contacto" 
          className="inline-block text-[#3a3530] border-b border-[#3a3530] pb-1 uppercase tracking-[0.2em] text-[10px] hover:text-[#a69680] hover:border-[#a69680] transition-all"
        >
          {t("Encargos.botonContacto")}
        </Link>
      </div>
    </div>
  </FadeIn>
</section>

      <SiteFooter />
    </main>
  );
}