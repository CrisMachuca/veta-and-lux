import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  // Sin hreflang en la cabecera HTTP `Link`: la única fuente es el HTML (lib/seo.ts) y el sitemap.
  // La cabecera de next-intl usaba otro x-default y el host de la petición (también sin www).
  alternateLinks: false
});

export const config = {
  // La clave está en añadir 'studio' a la lista de exclusiones (el bloque después de ?!)
  matcher: [
    '/', 
    '/(es|en)/:path*', 
    // Excluimos api, _next, _vercel, archivos estáticos y AHORA TAMBIÉN studio
    '/((?!api|_next|_vercel|.*\\..*|studio).*)' 
  ]
};