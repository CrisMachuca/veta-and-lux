export const dynamic = "force-dynamic";

import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server"; 
import Image from "next/image"; 
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client";
import { ESTADO_EFECTIVO } from "@/sanity/lib/reservas";
import FadeIn from "@/app/[locale]/components/motion/FadeIn";
import { metadataPagina } from "@/app/[locale]/lib/seo";

export const generateMetadata = metadataPagina("inicio", "", { tituloAbsoluto: true });

async function getProductosDestacados() {
  const query = `*[_type == "producto" && destacado == true] | order(_createdAt desc) {
    _id, 
    nombre, 
    "slug": slug.current,
    precio, 
    descripcion, 
    imagen, 
    imagenes, 
    ${ESTADO_EFECTIVO}
  }`;
  return await client.fetch(query);
}

export default async function Page() {
  const productosSanity = await getProductosDestacados();
  const t = await getTranslations("Inicio");

  return (
    <main className="min-h-screen bg-[#fcfaf8] antialiased text-[#3a3530]">
      <SiteNav />

      {/* 💎 HERO: Dos imágenes en móvil con fundido limpio + Tríptico en escritorio */}
      <section className="relative h-[92vh] mx-4 md:mx-8 mt-4 rounded-sm overflow-hidden bg-[#0d0c0b] shadow-2xl">
        
        {/* IMAGEN 1: Móvil (fija de fondo) y Escritorio (izquierda) */}
        <div className="absolute inset-0 z-0 overflow-hidden lg:w-1/3 lg:left-0 lg:border-r lg:border-white/10">
          <div className="relative w-full h-full motion-safe:animate-ken-burns">
            <Image
              src="/patilla-baja.jpg"
              alt="Lámpara escultórica Veta & Lux"
              fill
              sizes="(max-width: 1023px) 100vw, 33vw"
              priority={true}
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        </div>

        {/* IMAGEN 2: Móvil (fundido encima) y Escritorio (derecha) */}
        <div className={`absolute inset-0 z-0 overflow-hidden lg:w-1/3 opacity-0 motion-safe:animate-hero-swap lg:animate-none lg:opacity-100 lg:left-2/3 lg:border-l lg:border-white/10`}>
          <div className="relative w-full h-full motion-safe:animate-ken-burns" style={{ animationDelay: `-6s` }}>
            <Image
              src="/escultura-olivo-sombra.jpg"
              alt="Detalle de escultura de olivo Veta & Lux"
              fill
              sizes="(max-width: 1023px) 100vw, 33vw"
              priority={false}
              className="object-cover"
            />
          </div>
        </div>

        {/* VELO LOCALIZADO: En móvil solo oscurece la parte inferior (base) para que resalte el texto blanco, 
            dejando el resto de la imagen y las lámparas totalmente luminosas y nítidas. 
            En escritorio mantiene un tono muy sutil y elegante. */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0d0c0b] via-transparent to-transparent lg:bg-black/25"></div>

        {/* Contenido centrado */}
        <div className="relative z-10 flex flex-col items-center justify-end lg:justify-center h-full max-w-4xl mx-auto pb-16 lg:pb-0 px-6 pointer-events-none">
          <div className="pointer-events-auto text-center w-full max-w-xl lg:max-w-[30vw] mx-auto px-4">
            
            <FadeIn direction="down" delay={0.4} duration={1.2}>
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-white/90 font-light border-b border-white/40 pb-3 mb-6 block select-none text-balance drop-shadow-md">
                {t("Hero.tagline")}
              </span>
            </FadeIn>

            <FadeIn direction="none" delay={0.8} duration={1.5}>
              <h1 className="text-5xl md:text-6xl lg:text-[clamp(2.8rem,5vw,6.5rem)] font-nixie tracking-tighter text-white select-none drop-shadow-xl">
                Veta
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent px-2">
                  &
                </span>
                Lux
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={1.2} duration={1.2}>
              <div className="mt-10">
                <Link 
                  href="/coleccion" 
                  className="group relative inline-block bg-black/30 backdrop-blur-md border border-white/80 text-white px-8 md:px-10 py-3.5 rounded-none transition-all duration-500 text-[10px] uppercase tracking-[0.4em] whitespace-nowrap font-medium hover:bg-white hover:text-[#1a1816] shadow-2xl"
                >
                  <span className="relative z-10">{t("Hero.botonAdquirir")}</span>
                </Link>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* El resto de la página se mantiene igual... */}
      {/* 🪵 GALERÍA */}
      <section className="py-28">
        <FadeIn direction="up" delay={0.2}>
          <div className="text-center px-6 mb-16 space-y-4">
            <span className="text-[10px] font-bold text-amber-800/80 uppercase tracking-[0.5em] font-urbanist block">
              {t("Galeria.subtitulo")}
            </span>
            <h2 className="text-4xl md:text-5xl font-nixie text-[#3a3530] uppercase tracking-wide">
              {t("Galeria.titulo")}
            </h2>
            <div className="w-12 h-[1px] bg-[#3a3530]/20 mx-auto mt-6"></div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.5} scale={0.96}>
          <div className="px-6 md:px-12 lg:px-20 w-full">
            <ProductGallery productos={productosSanity} isHome={true} />
            
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
            <Image 
              src="/baseolivo.jpg" 
              alt="Artesanía" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-cover" 
            />
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