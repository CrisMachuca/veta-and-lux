import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veta & Lux | Iluminación Artesanal",
  description: "Piezas de iluminación escultórica de diseño artesanal confeccionadas con maderas nobles recuperadas.",
};

// Layout raíz absoluto: Requerido por Next.js para estructurar el HTML base
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        {/* Aquí simplemente inyectamos lo que Next.js resuelva dentro de la carpeta [locale] */}
        {children}
      </body>
    </html>
  );
}