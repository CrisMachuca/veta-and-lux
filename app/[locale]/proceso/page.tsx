"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

export default function ElProcesoPage() {
  const t = useTranslations("Proceso");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ClickableImage = ({ src, alt }: { src: string; alt: string }) => (
    <img
      src={src}
      alt={alt}
      onClick={() => setSelectedImage(src)}
      className="w-full h-full object-cover filter brightness-[0.98] cursor-zoom-in transition-transform duration-500 hover:scale-[1.02]"
    />
  );

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      <header className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Tagline: Urbanist + Uppercase + tracking */}
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-900/60 font-urbanist">{t("Header.tagline")}</p>
        
        {/* Título: Nixie One */}
        <h1 className="text-4xl md:text-6xl font-nixie text-[#3a3530] mt-4 leading-tight">{t("Header.titulo")}</h1>
        
        {/* Descripción: Urbanist */}
        <p className="max-w-xl mx-auto mt-6 text-[#6b645d] font-light text-sm md:text-base leading-relaxed font-urbanist">{t("Header.descripcion")}</p>
        <div className="w-12 h-[1px] bg-[#e5e0d8] mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pb-32 space-y-24 md:space-y-36">
        
        {/* PASO 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm flex items-center justify-center">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover filter brightness-[0.95]">
              <source src="/hallazgo.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 border-[12px] border-stone-50/10 m-4 rounded-sm pointer-events-none"></div>
          </div>
          <div className="md:col-span-5 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-900/60 font-urbanist">{t("Fase1.tagline")}</p>
            <h2 className="text-2xl md:text-3xl font-nixie text-[#3a3530]">{t("Fase1.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase1.p1")}</p>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase1.p2")}</p>
          </div>
        </div>

        {/* PASO 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <ClickableImage src="/curado.png" alt="Curado" />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-900/60 font-urbanist">{t("Fase2.tagline")}</p>
            <h2 className="text-2xl md:text-3xl font-nixie  font-bold text-[#3a3530]">{t("Fase2.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase2.p1")}</p>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase2.p2")}</p>
          </div>
        </div>

        {/* PASO 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <ClickableImage src="/saneado.jpeg" alt="Saneado" />
          </div>
          <div className="md:col-span-5 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-900/60 font-urbanist">{t("Fase3.tagline")}</p>
            <h2 className="text-2xl md:text-3xl font-nixie  font-bold text-[#3a3530]">{t("Fase3.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase3.p1")}</p>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase3.p2")}</p>
          </div>
        </div>

        {/* PASO 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <ClickableImage src="/tronco2.jpeg" alt="Arquitectura" />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-900/60 font-urbanist">{t("Fase4.tagline")}</p>
            <h2 className="text-2xl md:text-3xl font-nixie  font-bold text-[#3a3530]">{t("Fase4.titulo")}</h2>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase4.p1")}</p>
            <p className="text-[#6b645d] font-light text-sm leading-relaxed font-urbanist">{t("Fase4.p2")}</p>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95 p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Vista ampliada" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <SiteFooter />
    </main>
  );
}