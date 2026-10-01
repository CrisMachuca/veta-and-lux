import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { locales } from "@/navigation";
import { SITE_URL } from "@/app/[locale]/lib/seo";

// Cada URL lleva sus alternativas por idioma (hreflang) para que Google
// relacione la versión /es y la /en de la misma página.
function entradas(
  ruta: string,
  opciones: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${ruta}`]));
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${ruta}`,
    alternates: { languages },
    ...opciones,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Rutas estáticas principales
  const rutasEstaticas = ["", "/coleccion", "/proceso", "/contacto"];

  // 2. Rutas de ayuda / legales (del footer)
  const rutasLegales = ["/envios-devoluciones", "/aviso-legal", "/politica-cookies"];

  const staticUrls = rutasEstaticas.flatMap((ruta) =>
    entradas(ruta, {
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: ruta === "" ? 1.0 : 0.8,
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
  const productos: { slug: string; _updatedAt: string }[] = await client.fetch(query);

  const productUrls = productos.flatMap((producto) =>
    entradas(`/coleccion/${producto.slug}`, {
      lastModified: new Date(producto._updatedAt || Date.now()),
      changeFrequency: "daily",
      priority: 0.9,
    })
  );

  return [...staticUrls, ...legalUrls, ...productUrls];
}
