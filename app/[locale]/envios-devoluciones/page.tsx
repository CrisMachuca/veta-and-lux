"use client";

import Link from "next/link";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { useTranslations } from "next-intl";

export default function EnviosDevolucionesPage() {
  const t = useTranslations("EnviosDevoluciones");

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">
          {t("compromiso")}
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 font-light">
          {t("titulo")}
        </h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-8"></div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-16">
        
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 flex items-center gap-3">
            <span className="text-amber-800/60 font-serif text-lg">01.</span> {t("b1_titulo")}
          </h2>
          <p className="text-stone-600 font-light leading-relaxed text-base">{t("b1_texto")}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 flex items-center gap-3">
              <span className="text-amber-800/60 font-serif text-lg">02.</span> {t("b2_titulo")}
            </h2>
            <p className="text-stone-600 font-light leading-relaxed">{t("b2_texto")}</p>
          </div>

          <div className="rounded-sm border border-stone-200 bg-white p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-stone-600">
              <div className="space-y-1">
                <p className="font-bold text-stone-900 uppercase tracking-wider">{t("tab_es")}</p>
                <p>{t("tab_es_info")}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-stone-900 uppercase tracking-wider">{t("tab_ue")}</p>
                <p>{t("tab_ue_info")}</p>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 font-light italic pt-2 border-t border-stone-100">
              {t("tab_nota")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 flex items-center gap-3">
            <span className="text-amber-800/60 font-serif text-lg">03.</span> {t("b3_titulo")}
          </h2>
          <p className="text-stone-600 font-light leading-relaxed">{t("b3_p1")}</p>
          <p className="text-stone-600 font-light leading-relaxed">{t("b3_p2")}</p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-stone-100/60 p-8 space-y-3">
          <h3 className="font-serif italic text-stone-900 text-lg">{t("nota_medida")}</h3>
          <p className="text-sm text-stone-500 font-light leading-relaxed">{t("nota_medida_texto")}</p>
        </div>

        <div className="pt-8 text-center space-y-4">
          <p className="text-sm text-stone-500 font-light">{t("duda")}</p>
          <Link
            href="https://wa.me/34660800631"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-all font-medium shadow-sm"
          >
            {t("boton")}
          </Link>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}