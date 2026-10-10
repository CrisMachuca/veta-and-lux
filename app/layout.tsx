import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veta & Lux | Iluminación Artesanal",
  description: "Piezas de iluminación escultórica de diseño artesanal confeccionadas con maderas nobles recuperadas.",
};

// Layout raíz que solo pasa el contenido: <html> y <body> los ponen app/[locale]/layout.tsx
// (con el idioma de la URL), app/studio/layout.tsx y app/not-found.tsx.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
