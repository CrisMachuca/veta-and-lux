import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Esperamos el locale de la petición
  let locale = await requestLocale;

  // Si no hay locale o no es válido, el idioma por defecto (inglés, como el x-default)
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Importamos dinámicamente el archivo JSON correspondiente desde tu carpeta /messages
    messages: (await import(`../messages/${locale}.json`)).default
  };
});