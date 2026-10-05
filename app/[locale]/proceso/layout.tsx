import type { Metadata } from "next";
import { SITE_URL } from "@/app/[locale]/lib/seo";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" }); // O tu espacio de nombres correspondiente para proceso

  // Definimos las rutas exactas según el idioma
  const currentPath = locale === "es" ? "/es/proceso" : "/en/process";

  return {
    title: t("proceso.titulo", { default: "El Proceso" }),
    description: t("proceso.descripcion", { default: "Descubre nuestro proceso de creación y artesanía." }),
    alternates: {
      canonical: `${SITE_URL}${currentPath}`,
      languages: {
        "es": `${SITE_URL}/es/proceso`,
        "en": `${SITE_URL}/en/process`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
