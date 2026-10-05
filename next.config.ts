import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"; // 🌟 Importamos el plugin

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Fotos de Sanity servidas por next/image (galería): solo las de nuestro proyecto.
  // Sin "search" porque las URLs de Sanity llevan parámetros (?w=, rect=...).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/h7lwi6jz/**" }],
  },
};

// 🌟 Envolvemos la configuración para que Next.js procese las traducciones
export default withNextIntl(nextConfig);