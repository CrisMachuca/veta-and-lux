"use client";

import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { useTranslations } from "next-intl";

export default function AvisoLegalPage() {
  const t = useTranslations("AvisoLegal");

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">
          {t("transparencia")}
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 font-light">
          {t("titulo")}
        </h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-8"></div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-12 text-stone-600 font-light leading-relaxed text-sm">
        
        <p className="text-base text-stone-700">{t("intro")}</p>

        <div className="space-y-3 pt-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            {t("s1_titulo")}
          </h2>
          <div className="rounded-sm border border-stone-200 bg-white p-6 font-mono text-xs text-stone-700 space-y-2">
            <p><span className="text-stone-400 mr-2">{t("denominacion")}:</span> Veta & Lux</p>
            <p><span className="text-stone-400 mr-2">{t("titular")}:</span> [Tu Nombre Completo]</p>
            <p><span className="text-stone-400 mr-2">{t("nif")}:</span> [Tu DNI o CIF]</p>
            <p><span className="text-stone-400 mr-2">{t("domicilio")}:</span> [Tu Dirección Postal, Ciudad, España]</p>
            <p><span className="text-stone-400 mr-2">{t("contacto")}:</span> info@vetandlux.com</p>
            <p><span className="text-stone-400 mr-2">{t("telefono")}:</span> +34 660 80 06 31</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("s2_titulo")}</h2>
          <p>{t("s2_p1")}</p>
          <p>{t("s2_p2")}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("s3_titulo")}</h2>
          <p>{t("s3_p1")}</p>
          <p>{t("s3_p2")}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("s4_titulo")}</h2>
          <p>{t("s4_p1")}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("s5_titulo")}</h2>
          <p>{t("s5_p1")}</p>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}