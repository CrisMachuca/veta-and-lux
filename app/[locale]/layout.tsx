import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "@/app/[locale]/components/providers";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any; // Usamos any temporalmente para evitar conflictos de tipado entre versiones de Next
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