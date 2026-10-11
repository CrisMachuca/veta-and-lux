import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales } from "@/navigation";
import { routing } from "@/i18n/routing";
import { rutaLocalizada, type Href } from "@/app/[locale]/lib/rutas";

import { SITE_URL } from "@/app/[locale]/lib/sitio";
export { SITE_URL };

export const IMAGEN_OG_POR_DEFECTO = "/lampara-principal.jpeg";

type ParamsLocale = { params: Promise<{ locale: string }> };

const ogLocale = (locale: string) => (locale === "en" ? "en_GB" : "es_ES");

// canonical + hreflang de una página («/», «/coleccion», { pathname: "/coleccion/[slug]", params }),
// cada idioma con su dirección traducida. x-default: la versión inglesa, para el resto de Europa.
export function alternatesPara(locale: string, href: Href): Metadata["alternates"] {
  return {
    canonical: rutaLocalizada(href, locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, rutaLocalizada(href, l)])),
      "x-default": rutaLocalizada(href, routing.defaultLocale),
    },
  };
}

// Devuelve un generateMetadata para una página estática con título y descripción
// traducidos en el namespace "Metadata" de messages/*.json.
export function metadataPagina(clave: string, ruta: Href, opciones: { noIndex?: boolean; tituloAbsoluto?: boolean } = {}) {
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
        url: rutaLocalizada(ruta, locale),
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
