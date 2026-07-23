import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vetandlux.com";
  const locales = ["es", "en"];

  // 1. Rutas estáticas principales
  const rutasEstaticas = ["", "/coleccion", "/proceso", "/contacto"];
  
  // 2. Rutas de ayuda / legales (del footer)
  const rutasLegales = ["/envios-devoluciones", "/aviso-legal", "/politica-cookies"];

  const staticUrls = locales.flatMap((locale) =>
    rutasEstaticas.map((ruta) => ({
      url: `${baseUrl}/${locale}${ruta}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: ruta === "" ? 1.0 : 0.8,
    }))
  );

  const legalUrls = locales.flatMap((locale) =>
    rutasLegales.map((ruta) => ({
      url: `${baseUrl}/${locale}${ruta}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3, // Prioridad baja para páginas legales
    }))
  );

  // 3. Rutas dinámicas de los productos desde Sanity
  const query = `*[_type == "producto" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
  const productos = await client.fetch(query);

  const productUrls = productos.flatMap((producto: { slug: string; _updatedAt: string }) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/coleccion/${producto.slug}`,
      lastModified: new Date(producto._updatedAt || Date.now()),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }))
  );

  return [...staticUrls, ...legalUrls, ...productUrls];
}