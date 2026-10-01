import { metadataPagina } from "@/app/[locale]/lib/seo";

// La página es un componente de cliente y no puede exportar metadatos: los pone este layout.
export const generateMetadata = metadataPagina("proceso", "/proceso");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
