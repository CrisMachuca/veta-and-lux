import type { Metadata } from "next";
import "@/app/[locale]/globals.css";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Veta & Lux | Iluminación Artesanal",
  description: "Piezas de iluminación escultórica de diseño artesanal confeccionadas con maderas nobles recuperadas.",
};

// Layout raíz absoluto: Requerido por Next.js para estructurar el HTML base
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Idioma de la URL (/es, /en). En /studio, que no pasa por el middleware, cae en "es".
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        {/* Aquí simplemente inyectamos lo que Next.js resuelva dentro de la carpeta [locale] */}
        {children}
      </body>
    </html>
  );
}