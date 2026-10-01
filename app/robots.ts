import { MetadataRoute } from "next";
import { SITE_URL } from "@/app/[locale]/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Panel de Sanity, API y pasos de compra: no aportan nada en buscadores
      disallow: ["/studio", "/api/", "/*/carrito", "/*/checkout/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
