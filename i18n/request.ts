import { getRequestConfig } from 'next-intl/server';
import { locales } from '../navigation'; // Enlazamos con tus locales ['es', 'en']

export default getRequestConfig(async ({ requestLocale }) => {
  // Esperamos el locale de la petición
  let locale = await requestLocale;

  // Si no hay locale o no es válido, usamos el español por defecto
  if (!locale || !locales.includes(locale as any)) {
    locale = 'es';
  }

  return {
    locale,
    // Importamos dinámicamente el archivo JSON correspondiente desde tu carpeta /messages
    messages: (await import(`../messages/${locale}.json`)).default
  };
});