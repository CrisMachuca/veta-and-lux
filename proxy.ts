import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es'
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