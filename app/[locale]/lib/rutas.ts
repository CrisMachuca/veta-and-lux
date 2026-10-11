// Dirección pública de una página en un idioma: /es/coleccion/viga ↔ /en/collection/viga.
// Para canonical, hreflang, sitemap, datos estructurados, migas y Stripe (i18n/routing.ts).
import { getPathname } from "@/navigation";
import { SITE_URL } from "@/app/[locale]/lib/sitio";

export type Href = Parameters<typeof getPathname>[0]["href"];

export function rutaLocalizada(href: Href, locale: string) {
  return getPathname({ href, locale });
}

export function urlAbsoluta(href: Href, locale: string) {
  return `${SITE_URL}${rutaLocalizada(href, locale)}`;
}

export const hrefPieza = (slug: string) => ({ pathname: "/coleccion/[slug]" as const, params: { slug } });
