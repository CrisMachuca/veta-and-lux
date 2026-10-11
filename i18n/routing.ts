import { defineRouting } from 'next-intl/routing';

// Idiomas y direcciones de la web. Las carpetas de app/[locale] usan los nombres en español
// (la ruta interna); cada idioma tiene su dirección pública traducida.
// Para añadir alemán: 'de' en locales y su dirección en cada ruta (y sus textos en messages/de.json).
export const routing = defineRouting({
  locales: ['es', 'en'],
  // Inglés para quien no tiene el navegador en español (y x-default del hreflang): la web se dirige a Europa
  defaultLocale: 'en',
  localePrefix: 'always',
  // Sin hreflang en la cabecera HTTP `Link`: la única fuente es el HTML (lib/seo.ts) y el sitemap
  alternateLinks: false,
  pathnames: {
    '/': '/',
    '/coleccion': { es: '/coleccion', en: '/collection' },
    '/coleccion/[slug]': { es: '/coleccion/[slug]', en: '/collection/[slug]' },
    '/proceso': { es: '/proceso', en: '/process' },
    '/sobre-el-taller': { es: '/sobre-el-taller', en: '/our-story' },
    '/lamparas-a-medida': { es: '/lamparas-a-medida', en: '/bespoke-lamps' },
    '/materiales-y-procedencia': { es: '/materiales-y-procedencia', en: '/materials-and-provenance' },
    '/interioristas': { es: '/interioristas', en: '/for-interior-designers' },
    '/journal': '/journal',
    '/journal/[slug]': '/journal/[slug]',
    '/contacto': { es: '/contacto', en: '/contact' },
    '/carrito': { es: '/carrito', en: '/cart' },
    '/checkout/success': '/checkout/success',
    '/envios-devoluciones': { es: '/envios-devoluciones', en: '/shipping-returns' },
    '/condiciones-venta': { es: '/condiciones-venta', en: '/terms-of-sale' },
    '/politica-privacidad': { es: '/politica-privacidad', en: '/privacy-policy' },
    '/politica-cookies': { es: '/politica-cookies', en: '/cookie-policy' },
    '/aviso-legal': { es: '/aviso-legal', en: '/legal-notice' },
  },
});

export type Ruta = keyof typeof routing.pathnames;
