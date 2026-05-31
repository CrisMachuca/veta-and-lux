"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-stone-900 text-stone-300 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <span className="text-xl font-medium tracking-tighter text-stone-50 block mb-4">
            Veta <span className="italic font-serif">&</span> Lux
          </span>
          <p className="text-sm leading-relaxed text-stone-400">
            {t("descripcion")}
          </p>
        </div>

        <div>
          <h4 className="text-stone-50 font-medium mb-4 uppercase text-xs tracking-widest">
            {t("nav.titulo")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-stone-50 transition-colors">{t("nav.inicio")}</Link></li>
            <li><Link href="/coleccion" className="hover:text-stone-50 transition-colors">{t("nav.coleccion")}</Link></li>
            <li><Link href="/proceso" className="hover:text-stone-50 transition-colors">{t("nav.proceso")}</Link></li>
            <li><Link href="/contacto" className="hover:text-stone-50 transition-colors">{t("nav.contacto")}</Link></li>
            <li><Link href="/carrito" className="hover:text-stone-50 transition-colors">{t("nav.carrito")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-50 font-medium mb-4 uppercase text-xs tracking-widest">
            {t("ayuda.titulo")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/envios-devoluciones" className="hover:text-stone-50 transition-colors">{t("ayuda.envios")}</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-stone-50 transition-colors">{t("ayuda.aviso")}</Link></li>
            <li><Link href="/politica-cookies" className="hover:text-stone-50 transition-colors">{t("ayuda.cookies")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-50 font-medium mb-4 uppercase text-xs tracking-widest">
            {t("contacto.titulo")}
          </h4>
          <p className="text-sm text-stone-400 mb-2">{t("contacto.ubicacion")}</p>
          <p className="text-sm text-stone-400">
            <Link href="/contacto" className="hover:text-stone-200 transition-colors underline decoration-stone-600 underline-offset-2">
              {t("contacto.irContacto")}
            </Link>
            <span className="mx-2 text-stone-600">·</span>
            <a href="mailto:info@vetandlux.com" className="hover:text-stone-200 transition-colors">info@vetandlux.com</a>
          </p>
          
          <div className="flex gap-4 mt-6">
            <a href="https://www.instagram.com/vetandlux" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-stone-50 hover:border-stone-400 hover:bg-stone-800 transition-all duration-300" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com/vetandlux" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-stone-50 hover:border-stone-400 hover:bg-stone-800 transition-all duration-300" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-stone-800 text-xs text-stone-500 flex justify-between flex-wrap gap-4">
        <p>{t("copy")}</p>
        <p>{t("hecho")}</p>
      </div>
    </footer>
  );
}