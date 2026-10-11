import { createNavigation } from 'next-intl/navigation';
import { routing } from './i18n/routing';

export const locales = routing.locales;
export const localePrefix = routing.localePrefix;

// Enlaces con la dirección traducida de cada idioma: <Link href="/coleccion"> lleva a /en/collection en inglés.
// Las rutas con parámetros se escriben { pathname: '/coleccion/[slug]', params: { slug } }.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
