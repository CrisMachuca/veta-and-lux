import { createNavigation } from 'next-intl/navigation';

export const locales = ['es', 'en'] as const;
export const localePrefix = 'always'; 

// 🌟 Actualizado con el nuevo método simplificado de next-intl
export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix });