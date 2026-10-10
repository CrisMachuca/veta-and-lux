import { metadataPagina } from "@/app/[locale]/lib/seo";

// La página es un componente de cliente y no puede exportar metadatos: los pone este layout.
// La ruta es la misma en los dos idiomas (/es/proceso y /en/proceso), como el resto de páginas.
export const generateMetadata = metadataPagina("proceso", "/proceso");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
