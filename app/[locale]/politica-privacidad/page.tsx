import { PaginaLegal } from "@/app/[locale]/components/pagina-legal";
import { metadataPagina } from "@/app/[locale]/lib/seo";
import { TEXTOS_LEGALES_BORRADOR } from "@/app/[locale]/lib/legal";

export const generateMetadata = metadataPagina("privacidad", "/politica-privacidad", { noIndex: TEXTOS_LEGALES_BORRADOR });

export default async function PoliticaPrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PaginaLegal locale={locale} namespace="Privacidad" />;
}
