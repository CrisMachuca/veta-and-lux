"use client";

import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { useTranslations } from "next-intl";

export default function PoliticaCookiesPage() {
  const t = useTranslations("Cookies");

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">
          {t("navegacion")}
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 font-light">
          {t("titulo")}
        </h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-8"></div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-12 text-stone-600 font-light leading-relaxed text-sm">
        
        <div className="space-y-4">
          <p className="text-base text-stone-700">{t("intro1")}</p>
          <p>{t("intro2")}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("seccion1_titulo")}</h2>
          <p>{t("seccion1_texto")}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("seccion2_titulo")}</h2>
          <p>{t("seccion2_intro")}</p>

          <div className="space-y-4 mt-4">
            <div className="p-5 rounded-sm border border-stone-200 bg-white space-y-2">
              <p className="font-mono text-xs font-bold text-stone-950 uppercase tracking-wider">{t("tipoA_titulo")}</p>
              <p className="text-xs text-stone-600">{t("tipoA_texto")}</p>
            </div>
            <div className="p-5 rounded-sm border border-stone-200 bg-white space-y-2">
              <p className="font-mono text-xs font-bold text-stone-950 uppercase tracking-wider">{t("tipoB_titulo")}</p>
              <p className="text-xs text-stone-600">{t("tipoB_texto")}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("seccion3_titulo")}</h2>
          <p>{t("seccion3_texto1")}</p>
          <p className="text-xs text-stone-500 italic">{t("seccion3_texto2")}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{t("seccion4_titulo")}</h2>
          <p>{t("seccion4_texto")}</p>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}