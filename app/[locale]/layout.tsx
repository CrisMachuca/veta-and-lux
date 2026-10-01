import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "@/app/[locale]/components/providers";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { IMAGEN_OG_POR_DEFECTO, SITE_URL, ogLocale } from "@/app/[locale]/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Valores por defecto para todas las páginas; cada página define su título y descripción.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("inicio.titulo"), template: "%s | Veta & Lux" },
    description: t("inicio.descripcion"),
    openGraph: {
      siteName: "Veta & Lux",
      locale: ogLocale(locale),
      type: "website",
      images: [IMAGEN_OG_POR_DEFECTO],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. Forzamos la espera de los parámetros de la URL
  const { locale } = await params;
  
  const localesValidos = ["es", "en"];
  if (!localesValidos.includes(locale)) {
    notFound();
  }

  // 2. 🛠️ SOLUCIÓN: Le pasamos explícitamente el locale a getMessages para evitar el 'undefined.json'
  const messages = await getMessages({ locale });

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Providers>
          {children}
        </Providers>
      </NextIntlClientProvider>
    </div>
  );
}