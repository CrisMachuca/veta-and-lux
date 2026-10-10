import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"; // 🌟 Importamos el plugin

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // 404 con HTML completo para las URL que no existen (app/global-not-found.tsx)
  experimental: {
    globalNotFound: true,
  },
  // Fotos de Sanity servidas por next/image (galería): solo las de nuestro proyecto.
  // Sin "search" porque las URLs de Sanity llevan parámetros (?w=, rect=...).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/h7lwi6jz/**" }],
  },
  // Un solo dominio: vetandlux.com (sin www) redirige con 301 a www.vetandlux.com, conservando ruta y parámetros.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "vetandlux.com" }],
        destination: "https://www.vetandlux.com/:path*",
        statusCode: 301,
      },
    ];
  },
  async headers() {
    // HTML de la web: Next lo sirve desde su caché (ISR), pero el CDN de Hostinger no debe guardarlo,
    // porque no se vacía con revalidateTag (ventas, reservas, Studio) ni quizá al desplegar.
    // Sin «no-store», el navegador puede volver atrás al instante (bfcache).
    const htmlSinCacheEnCdn = [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }];
    return [
      { source: "/:locale(es|en)", headers: htmlSinCacheEnCdn },
      { source: "/:locale(es|en)/:path*", headers: htmlSinCacheEnCdn },
      { source: "/studio/:path*", headers: htmlSinCacheEnCdn },
      // La confirmación del pedido lleva datos del pedido en la URL: nunca se guarda (la última regla manda)
      {
        source: "/:locale(es|en)/checkout/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }],
      },
      {
        // Aplica esta regla a cualquier archivo .mp4 dentro de la carpeta public
        source: "/:path*\\.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// 🌟 Envolvemos la configuración para que Next.js procese las traducciones
export default withNextIntl(nextConfig);