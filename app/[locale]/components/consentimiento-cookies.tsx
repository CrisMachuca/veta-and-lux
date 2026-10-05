"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import {
  EVENTO_ABRIR_BANNER,
  GA_ID,
  esDominioProduccion,
  guardarConsentimiento,
  leerConsentimiento,
  suscribirConsentimiento,
} from "@/app/[locale]/lib/analytics";

// "pendiente" = todavía no sabemos (render del servidor / hidratación)
const leerEnServidor = () => "pendiente" as const;

export function ConsentimientoCookies() {
  const t = useTranslations("CookiesBanner");
  const consentimiento = useSyncExternalStore(suscribirConsentimiento, leerConsentimiento, leerEnServidor);
  const [reabierto, setReabierto] = useState(false);

  // El enlace "Configurar cookies" del pie vuelve a mostrar el banner
  useEffect(() => {
    const abrir = () => setReabierto(true);
    window.addEventListener(EVENTO_ABRIR_BANNER, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_BANNER, abrir);
  }, []);

  const elegir = (valor: "aceptadas" | "rechazadas") => {
    guardarConsentimiento(valor);
    setReabierto(false);
  };

  const mostrarBanner = consentimiento === null || reabierto;
  const cargarAnalytics = consentimiento === "aceptadas" && esDominioProduccion();

  return (
    <>
      {cargarAnalytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window['ga-disable-${GA_ID}'] = false;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      {mostrarBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t("titulo")}
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl border border-stone-200 bg-stone-50/95 p-5 shadow-2xl backdrop-blur-md md:p-6"
        >
          <p className="font-nixie text-lg text-stone-900">{t("titulo")}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 font-urbanist">
            {t("texto")}{" "}
            <Link href="/politica-cookies" className="underline decoration-stone-400 underline-offset-2 hover:text-stone-900">
              {t("politica")}
            </Link>
            .
          </p>
          {/* Aceptar y rechazar con el mismo peso visual, como pide la AEPD */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => elegir("rechazadas")}
              className="rounded-full border border-stone-900 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-stone-900 transition-colors hover:bg-stone-900 hover:text-stone-50"
            >
              {t("rechazar")}
            </button>
            <button
              type="button"
              onClick={() => elegir("aceptadas")}
              className="rounded-full border border-stone-900 bg-stone-900 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-stone-50 transition-colors hover:bg-stone-800"
            >
              {t("aceptar")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
