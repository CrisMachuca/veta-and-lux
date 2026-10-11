import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { CACHE_CATALOGO } from "@/sanity/lib/cache";
import { locales } from "@/navigation";
import { urlAbsoluta, hrefPieza, type Href } from "@/app/[locale]/lib/rutas";
import { TEXTOS_LEGALES_BORRADOR } from "@/app/[locale]/lib/legal";

// Se regenera con el catálogo (antes solo al compilar: las piezas nuevas no entraban hasta el siguiente despliegue)
export const revalidate = 60;

// Cada URL lleva sus alternativas por idioma (hreflang) para que Google
// relacione la versión /es y la /en de la misma página.
function entradas(
  ruta: Href,
  opciones: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, urlAbsoluta(ruta, l)]));
  return locales.map((locale) => ({
    url: urlAbsoluta(ruta, locale),
    alternates: { languages },
    ...opciones,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Rutas estáticas principales
  const rutasEstaticas = ["/", "/coleccion", "/lamparas-a-medida", "/sobre-el-taller", "/proceso", "/contacto"] as const;

  // 2. Rutas de ayuda / legales (del footer)
  const rutasLegales: Href[] = [
    "/envios-devoluciones", "/aviso-legal", "/politica-cookies",
    // Con noindex mientras sean borrador: fuera del sitemap hasta entonces
    ...(TEXTOS_LEGALES_BORRADOR ? [] : (["/condiciones-venta", "/politica-privacidad"] as const)),
  ];

  const staticUrls = rutasEstaticas.flatMap((ruta) =>
    entradas(ruta, {
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: ruta === "/" ? 1.0 : 0.8,
    })
  );

  const legalUrls = rutasLegales.flatMap((ruta) =>
    entradas(ruta, {
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3, // Prioridad baja para páginas legales
    })
  );

  // 3. Rutas dinámicas de los productos desde Sanity
  const query = `*[_type == "producto" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
  const productos: { slug: string; _updatedAt: string }[] = await client.fetch(query, {}, CACHE_CATALOGO);

  const productUrls = productos.flatMap((producto) =>
    entradas(hrefPieza(producto.slug), {
      lastModified: new Date(producto._updatedAt || Date.now()),
      changeFrequency: "daily",
      priority: 0.9,
    })
  );

  return [...staticUrls, ...legalUrls, ...productUrls];
}
