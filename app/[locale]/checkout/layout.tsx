import { metadataPagina } from "@/app/[locale]/lib/seo";

// Confirmación del pedido: lee los parámetros de la URL en cada visita, así que nunca se cachea
export const dynamic = "force-dynamic";

// La página es un componente de cliente y no puede exportar metadatos: los pone este layout.
export const generateMetadata = metadataPagina("checkout", "/checkout/success", { noIndex: true });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
