
export const dynamic = "force-dynamic";

import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server"; 
import Image from "next/image"; 
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client";
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
    <main className="min-h-screen bg-[#fcfaf8] antialiased text-[#3a3530]">
      <SiteNav />

      {/* 💎 HERO GALERÍA OPTIMIZADA - CORRECCIÓN DE CONTRASTE Y PARPADEO */}
<section className="relative h-[90vh] mx-4 md:mx-8 mt-4 rounded-sm overflow-hidden bg-stone-950 shadow-2xl">
  
  {/* Capa de oscurecimiento global (Resuelve el parpadeo de fondos) */}
  <div className="absolute inset-0 z-[1] bg-stone-950/40 md:bg-stone-950/30"></div>

  {["/patilla-baja.jpg", "/rodaja-peque.png", "/escultura-olivo-sombra.jpg"].map((src, i) => (
    <div 
      key={src} 
      className={`
        absolute inset-0 z-0 animate-fade-hero overflow-hidden
        ${i === 0 ? 'block' : 'block md:left-[33.33%]'}
        ${i === 1 ? 'md:left-[33.33%]' : ''}
        ${i === 2 ? 'md:left-[66.66%]' : ''}
        md:w-1/3 md:h-full
        ${i < 2 ? 'md:border-r border-white/10' : ''} 
      `}
      style={{ animationDelay: `${i * 3}s` }}
    >
      <div className="relative w-full h-full">
        <Image 
          src={src} 
          alt={`Veta & Lux ${i}`} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={true} 
          loading="eager"
          className="object-cover transition-transform duration-[10s] hover:scale-105"
        />
      </div>
    </div>
  ))}

  {/* Contenido (Texto Estático con Sombra para mejorar lectura en móvil) */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6 pointer-events-none">
    <div className="pointer-events-auto text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
      <FadeIn direction="down" delay={0.4} duration={1.2}>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-amber-50/90 font-bold border-b border-white/30 pb-4 mb-8 block select-none">
          {t("Hero.tagline")}
        </span>
      </FadeIn>

      <FadeIn direction="none" delay={0.8} duration={1.5}>
        <h1 className="text-6xl md:text-9xl font-nixie tracking-tighter text-white select-none pt-4">
          Veta
          <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 bg-clip-text text-transparent">
            &
          </span>
          Lux
        </h1>
      </FadeIn>

      <FadeIn direction="up" delay={1.3} duration={1.2}>
        <div className="mt-10 space-y-10">
          <p className="text-white font-light leading-relaxed text-base md:text-lg max-w-lg mx-auto tracking-[0.05em] font-urbanist italic opacity-95">
            {t("Hero.parrafo")}
          </p>
          <div className="pt-6">
            <Link href="/coleccion" className="group relative inline-block border border-white/60 text-white px-16 py-4 rounded-full transition-all duration-500 text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden shadow-2xl hover:bg-white hover:text-stone-950 hover:border-white">
              <span className="relative z-10">{t("Hero.botonAdquirir")}</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  </div>
</section>
     {/* 💎 SECCIÓN EDITORIAL */}
<section className="my-24 md:my-40 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
    
    {/* Imagen */}
    <FadeIn direction="left" duration={1.5}>
      <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
        <Image 
          src="/lampara-principal.jpeg" 
          alt="Detalle artesanal Veta & Lux" 
          fill 
          className="object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.05]"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </FadeIn>

    {/* Texto */}
    <FadeIn direction="right" duration={1.5} delay={0.3}>
      <div className="space-y-8">
        <span className="text-[11px] uppercase tracking-[0.5em] text-amber-900/60 font-bold font-urbanist">
          {t("Editorial.tagline")}
        </span>
        
        <h2 className="text-5xl md:text-6xl font-nixie text-[#3a3530] leading-[1.1]">
          {t("Editorial.titulo")} <br/><span className="italic">{t("Editorial.tituloDestacado")}</span>
        </h2>
        
        <div className="w-20 h-[1px] bg-stone-300"></div>
        
        <p className="text-stone-600 font-urbanist leading-relaxed text-lg md:text-xl max-w-lg">
          {t("Editorial.descripcion")}
        </p>
        
        <div className="pt-4">
          <Link 
            href="/coleccion" 
            className="inline-block border-b border-[#3a3530] pb-1 uppercase tracking-[0.4em] text-[10px] font-bold font-urbanist hover:text-amber-900 hover:border-amber-900 transition-all"
          >
            {t("Galeria.botonVerColeccion")} →
          </Link>
        </div>
      </div>
    </FadeIn>
  </div>
</section>

      {/* 🪵 GALERÍA */}
      <section className="py-32">
  <FadeIn direction="up" delay={0.2}>
    <div className="text-center px-6 mb-20 space-y-4">
      {/* 1. Tagline pequeño para contraste */}
      <span className="text-[10px] font-bold text-amber-800/80 uppercase tracking-[0.5em] font-urbanist block">
        {t("Galeria.subtitulo")}
      </span>
      
      {/* 2. Título principal  */}
      <h2 className="text-4xl md:text-5xl font-nixie text-[#3a3530] uppercase tracking-wide">
        {t("Galeria.titulo")}
      </h2>
      
      {/* 3. Línea decorativa*/}
      <div className="w-12 h-[1px] bg-[#3a3530]/20 mx-auto mt-6"></div>
    </div>
  </FadeIn>

  {/* Galería... */}
  <FadeIn direction="up" delay={0.5} scale={0.96}>
    <div className="px-6 md:max-w-7xl md:mx-auto">
      <ProductGallery productos={productosSanity} isHome={true} />
      {/* BOTÓN: Ver Colección Completa */}
      <div className="flex justify-center mt-16 md:mt-20">
          <Link 
            href="/coleccion" 
            className="px-10 py-3 border border-[#3a3530]/20 text-[#3a3530] text-[10px] uppercase tracking-[0.3em] font-bold font-urbanist rounded-full hover:bg-[#3a3530] hover:text-white transition-all duration-300"
          >
            {t("Galeria.botonVerColeccion")}
          </Link>
        </div>
    </div>
  </FadeIn>
</section>

      {/* 📜 GARANTÍA */}
      <section className="bg-[#f2efe9] border-y border-[#e5e0d8] py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          {[1, 2, 3].map((i) => (
            <FadeIn key={i} direction="up" delay={0.3 * i} duration={1}>
              <div className="space-y-4 border-l-2 border-amber-900/10 pl-6 h-full flex flex-col justify-center">
                <h4 className="font-nixie text-lg text-[#3a3530] font-medium">{t(`Garantias.g${i}Titulo`)}</h4>
                <p className="text-[#6b645d] text-sm font-light leading-relaxed font-urbanist">{t(`Garantias.g${i}Texto`)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 🛠️ MANIFIESTO */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <FadeIn direction="left" delay={0.2} scale={0.9}>
            <div className="relative aspect-[4/5] bg-stone-100 rounded-sm shadow-xl overflow-hidden">
              <img src="/baseolivo.jpg" alt="Artesanía" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
          <div className="space-y-8">
            <FadeIn direction="up" delay={0.5}>
              <p className="text-[10px] text-amber-800/80 uppercase tracking-[0.5em] font-bold font-urbanist">{t("Manifiesto.tagline")}</p>
            </FadeIn>
            <FadeIn direction="up" delay={0.7}>
              <h2 className="text-4xl md:text-5xl font-nixie text-[#3a3530] leading-tight">
                {t("Manifiesto.titulo")} <br />
                <span className="italic">{t("Manifiesto.subtitulo")}</span>
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.9}>
              <div className="space-y-6 text-[#6b645d] font-light leading-relaxed text-base md:text-lg font-urbanist">
                <p>{t("Manifiesto.p1")}</p>
                <p>{t("Manifiesto.p2")}</p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={1.1}>
              <div className="grid grid-cols-3 gap-3 py-6 border-t border-b border-[#e5e0d8] font-urbanist text-[10px] text-stone-400 uppercase tracking-[0.3em]">
                <div className="border-r border-stone-200 pr-3">{t("Manifiesto.fase1")}</div>
                <div className="border-r border-stone-200 pr-3">{t("Manifiesto.fase2")}</div>
                <div>{t("Manifiesto.fase3")}</div>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={1.3}>
              <Link href="/proceso" className="inline-block border-b border-[#3a3530] pb-1 uppercase tracking-[0.4em] text-[10px] font-bold font-urbanist hover:text-amber-900 hover:border-amber-900 transition-all">
                {t("Manifiesto.botonProceso")} →
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 💼 CONSULTAS PRIVADAS */}
      <section className="py-24 px-6 bg-[#f7f4f0]"> 
        <FadeIn direction="up" delay={0.3} duration={1.2}>
          <div className="max-w-3xl mx-auto py-16 text-center space-y-8">
            <h3 className="text-3xl md:text-4xl font-nixie text-[#3a3530] leading-tight">
              {t("Encargos.titulo")}
            </h3>
            <div className="w-16 h-[1px] bg-[#3a3530]/20 mx-auto"></div>
            <p className="text-[#6b645d] font-light text-base md:text-lg leading-relaxed max-w-xl mx-auto tracking-[0.02em] font-urbanist">
              {t("Encargos.texto")}
            </p>
            <div className="pt-4">
              <Link href="/contacto" className="inline-block text-[#3a3530] border-b border-[#3a3530] pb-1 uppercase tracking-[0.2em] text-[10px] font-bold font-urbanist hover:text-amber-900 hover:border-amber-900 transition-all">
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