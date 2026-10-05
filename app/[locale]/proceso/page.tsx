"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

function ClickableImage({ src, alt, onOpen }: { src: string; alt: string; onOpen: (src: string) => void }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 60vw"
      onClick={() => onOpen(src)}
      className="object-cover filter brightness-[0.98] cursor-zoom-in transition-transform duration-500 hover:scale-[1.02]"
    />
  );
}

export default function ElProcesoPage() {
  const t = useTranslations("Proceso");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      {/* CABECERA */}
      <header className="px-6 pt-24 pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/70 font-urbanist">{t("Header.tagline")}</p>
          
          <h1 className="text-5xl md:text-7xl font-nixie text-[#3a3530] mt-4 leading-tight">{t("Header.titulo")}</h1>
          
          <p className="max-w-2xl mx-auto mt-6 text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Header.descripcion")}</p>
          <div className="w-16 h-[1px] bg-[#e5e0d8] mx-auto mt-10"></div>
        </div>
      </header>

      {/* FASES / PASOS */}
      <section className="px-6 md:px-12 lg:px-24 pb-32 space-y-32 md:space-y-48">
        
        {/* PASO 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[16/10] rounded-sm relative overflow-hidden shadow-sm flex items-center justify-center">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="metadata"
              className="w-full h-full object-cover filter brightness-[0.95]"
            >
              {/* Vídeo ligero para dispositivos móviles */}
              <source src="/hallazgo2.mp4" type="video/mp4" media="(max-width: 767px)" />
              {/* Vídeo en máxima calidad de 10,9 MB para escritorio */}
              <source src="/hallazgo.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 border-[12px] border-stone-50/10 m-4 rounded-sm pointer-events-none"></div>
          </div>
          <div className="md:col-span-5 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/70 font-urbanist">{t("Fase1.tagline")}</p>
            <h2 className="text-3xl md:text-5xl font-nixie text-[#3a3530] leading-tight">{t("Fase1.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase1.p1")}</p>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase1.p2")}</p>
          </div>
        </div>

        {/* PASO 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[16/10] rounded-sm relative overflow-hidden shadow-sm">
            <ClickableImage src="/curado.png" alt="Curado" onOpen={setSelectedImage} />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/70 font-urbanist">{t("Fase2.tagline")}</p>
            <h2 className="text-3xl md:text-5xl font-nixie font-bold text-[#3a3530] leading-tight">{t("Fase2.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase2.p1")}</p>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase2.p2")}</p>
          </div>
        </div>

        {/* PASO 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[16/10] rounded-sm relative overflow-hidden shadow-sm">
            <ClickableImage src="/saneado.jpeg" alt="Saneado" onOpen={setSelectedImage} />
          </div>
          <div className="md:col-span-5 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/70 font-urbanist">{t("Fase3.tagline")}</p>
            <h2 className="text-3xl md:text-5xl font-nixie font-bold text-[#3a3530] leading-tight">{t("Fase3.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase3.p1")}</p>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase3.p2")}</p>
          </div>
        </div>

        {/* PASO 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[16/10] rounded-sm relative overflow-hidden shadow-sm">
            <ClickableImage src="/tronco2.jpeg" alt="Arquitectura" onOpen={setSelectedImage} />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/70 font-urbanist">{t("Fase4.tagline")}</p>
            <h2 className="text-3xl md:text-5xl font-nixie font-bold text-[#3a3530] leading-tight">{t("Fase4.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase4.p1")}</p>
            <p className="text-[#6b645d] font-light text-lg md:text-xl leading-relaxed font-urbanist">{t("Fase4.p2")}</p>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95 p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <div className="relative w-full h-full">
            <Image src={selectedImage} alt="Vista ampliada" fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}

      <SiteFooter />
    </main>
  );
}