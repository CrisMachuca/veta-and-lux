import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales } from "@/navigation";

// Dominio público de la web. En producción NEXT_PUBLIC_SITE_URL ya debe ser el dominio real
// (Stripe lo usa para volver tras el pago); en local apunta a localhost.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://vetandlux.com").replace(/\/$/, "");

export const IMAGEN_OG_POR_DEFECTO = "/lampara-principal.jpeg";

type ParamsLocale = { params: Promise<{ locale: string }> };

const ogLocale = (locale: string) => (locale === "en" ? "en_GB" : "es_ES");

// canonical + hreflang para una ruta sin prefijo de idioma ("" = home, "/coleccion", ...)
export function alternatesPara(locale: string, ruta: string): Metadata["alternates"] {
  return {
    canonical: `/${locale}${ruta}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${ruta}`])),
      "x-default": `/es${ruta}`,
    },
  };
}

// Devuelve un generateMetadata para una página estática con título y descripción
// traducidos en el namespace "Metadata" de messages/*.json.
export function metadataPagina(clave: string, ruta: string, opciones: { noIndex?: boolean; tituloAbsoluto?: boolean } = {}) {
  return async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    const titulo = t(`${clave}.titulo`);
    const descripcion = t(`${clave}.descripcion`);

    return {
      title: opciones.tituloAbsoluto ? { absolute: titulo } : titulo,
      description: descripcion,
      alternates: alternatesPara(locale, ruta),
      openGraph: {
        title: titulo,
        description: descripcion,
        url: `/${locale}${ruta}`,
        locale: ogLocale(locale),
        type: "website",
        siteName: "Veta & Lux",
        images: [IMAGEN_OG_POR_DEFECTO],
      },
      robots: opciones.noIndex ? { index: false, follow: true } : undefined,
    };
  };
}

export { ogLocale };
