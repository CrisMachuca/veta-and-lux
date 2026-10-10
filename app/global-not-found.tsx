import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "@/app/[locale]/components/providers";
import { ConsentimientoCookies } from "@/app/[locale]/components/consentimiento-cookies";
import NoEncontrada from "@/app/[locale]/not-found";
import { CLASES_FUENTES } from "@/app/[locale]/lib/fuentes";
import "@/app/[locale]/globals.css";

// 404 de cualquier URL que no existe (/es/lo-que-sea). Next la sirve directamente, con el HTML completo,
// en lugar de pasar por notFound() dentro de [locale], que en Next 16 deja un HTML de error y la pinta
// solo en el navegador. Muestra la misma 404 que el resto de la web, en el idioma de la URL
// (el proxy de next-intl lo deja en la petición). Next añade noindex y el estado 404.
export default async function GlobalNotFound() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className={`${CLASES_FUENTES} font-sans antialiased min-h-full flex flex-col`}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Providers>
              <NoEncontrada />
              <ConsentimientoCookies />
            </Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
