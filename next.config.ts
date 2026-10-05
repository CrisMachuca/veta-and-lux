import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"; // 🌟 Importamos el plugin

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Fotos de Sanity servidas por next/image (galería): solo las de nuestro proyecto.
  // Sin "search" porque las URLs de Sanity llevan parámetros (?w=, rect=...).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/h7lwi6jz/**" }],
  },
  async headers() {
    return [
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