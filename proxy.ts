import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Idioma por URL, direcciones traducidas y detección del idioma del navegador en "/" (i18n/routing.ts)
export default createMiddleware(routing);

export const config = {
  // La clave está en añadir 'studio' a la lista de exclusiones (el bloque después de ?!)
  matcher: [
    '/',
    '/(es|en)/:path*',
    // Excluimos api, _next, _vercel, archivos estáticos y AHORA TAMBIÉN studio
    '/((?!api|_next|_vercel|.*\\..*|studio).*)'
  ]
};
