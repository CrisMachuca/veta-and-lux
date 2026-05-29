import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"; // 🌟 Importamos el plugin

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* Si en el futuro necesitas añadir opciones de Next (como configurar Sanity o imágenes), las pones aquí */
};

// 🌟 Envolvemos la configuración para que Next.js procese las traducciones
export default withNextIntl(nextConfig);