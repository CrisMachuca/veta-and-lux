import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <span className="text-xl font-medium tracking-tighter text-stone-50 block mb-4">
            Veta <span className="italic font-serif">&</span> Lux
          </span>
          <p className="text-sm leading-relaxed text-stone-400">
            Artesanía en iluminación con madera recuperada. Cada pieza es única,
            sostenible y hecha a mano.
          </p>
        </div>

        <div>
          <h4 className="text-stone-50 font-medium mb-4 uppercase text-xs tracking-widest">
            Navegación
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-stone-50 transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/coleccion"
                className="hover:text-stone-50 transition-colors"
              >
                Colección
              </Link>
            </li>
            <li>
              <Link
                href="/taller"
                className="hover:text-stone-50 transition-colors"
              >
                Proceso
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="hover:text-stone-50 transition-colors"
              >
                Contacto
              </Link>
            </li>
            <li>
              <Link
                href="/carrito"
                className="hover:text-stone-50 transition-colors"
              >
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-50 font-medium mb-4 uppercase text-xs tracking-widest">
            Ayuda
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-stone-50 transition-colors">
                Envíos y Devoluciones
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-stone-50 transition-colors">
                Aviso Legal
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-stone-50 transition-colors">
                Política de Cookies
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-50 font-medium mb-4 uppercase text-xs tracking-widest">
            Contacto
          </h4>
          <p className="text-sm text-stone-400 mb-2">Taller en Málaga, España</p>
          <p className="text-sm text-stone-400">
            <Link
              href="/contacto"
              className="hover:text-stone-200 transition-colors underline decoration-stone-600 underline-offset-2"
            >
              Ir a contacto
            </Link>
            <span className="mx-2 text-stone-600">·</span>
            <a
              href="mailto:info@vetaylux.com"
              className="hover:text-stone-200 transition-colors"
            >
              info@vetandlux.com
            </a>
          </p>
          <div className="flex gap-4 mt-6">
            <div className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center hover:bg-stone-800 cursor-pointer transition-colors">
              ig
            </div>
            <div className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center hover:bg-stone-800 cursor-pointer transition-colors">
              fb
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-stone-800 text-xs text-stone-500 flex justify-between flex-wrap gap-4">
        <p>© 2026 Veta & Lux. Todos los derechos reservados.</p>
        <p>Hecho con ❤️ y madera recuperada.</p>
      </div>
    </footer>
  );
}
