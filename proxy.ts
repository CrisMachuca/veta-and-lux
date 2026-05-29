import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Los idiomas que soporta tu web
  locales: ['es', 'en'],
  // Idioma por defecto si no se detecta ninguno
  defaultLocale: 'es'
});

export const config = {
  // 🌟 Esta es la clave: Le dice a Next.js qué rutas DEBEN pasar por el filtro de idioma
  // e ignora completamente la carpeta /api, los favicons y los archivos estáticos.
  matcher: [
    '/', 
    '/(de|en|es)/:path*', 
    '/((?!api|_next|_vercel|[\\w-]+\\.\\w+).*)' // 💡 Aquí 'api' está blindado
  ]
};