import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      {/* Cabecera de la Página */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">
          Navegación Privada y Segura
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 font-light">
          Política de Cookies
        </h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-8"></div>
      </header>

      {/* Contenido Principal */}
      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-12 text-stone-600 font-light leading-relaxed text-sm">
        
        <div className="space-y-4">
          <p className="text-base text-stone-700">
            En Veta & Lux respetamos la intimidad de su entorno digital. Con el fin de ofrecerle una experiencia de navegación fluida, sofisticada y adaptada a sus preferencias estéticas, este sitio web utiliza tecnologías de almacenamiento de información denominadas cookies.
          </p>
          <p>
            A continuación, le detallamos qué son estas tecnologías, con qué propósitos exclusivos las empleamos en nuestro taller digital y cómo puede gestionarlas o restringirlas en cualquier momento a través de las herramientas de su navegador.
          </p>
        </div>

        {/* 1. Qué son las cookies */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            1. ¿Qué es una Cookie?
          </h2>
          <p>
            Una cookie es un pequeño archivo de texto que se descarga de forma desatendida en su dispositivo (ordenador, smartphone o tablet) al acceder a la gran mayoría de portales web. Permiten a un sitio, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario para reconocerle y ofrecerle un servicio óptimo y personalizado.
          </p>
        </div>

        {/* 2. Tipos de cookies utilizadas */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            2. Tipologías Utilizadas en Veta & Lux
          </h2>
          <p>
            Este portal web únicamente activa herramientas tecnológicas esenciales y de análisis respetuoso para mantener el correcto funcionamiento del espacio de exposición y venta:
          </p>

          <div className="space-y-4 mt-4">
            {/* Tipo A */}
            <div className="p-5 rounded-sm border border-stone-200 bg-white space-y-2">
              <p className="font-mono text-xs font-bold text-stone-950 uppercase tracking-wider">
                — Cookies Técnicas y de Sesión (Estrictamente Necesarias)
              </p>
              <p className="text-xs text-stone-600">
                Son indispensables para permitirle navegar por la colección de luminarias, interactuar con el panel de Sanity en tiempo real, visualizar el stock real y mantener la integridad del proceso de contacto o reserva mediante WhatsApp. No recopilan información confidencial ni se utilizan con fines comerciales.
              </p>
            </div>

            {/* Tipo B */}
            <div className="p-5 rounded-sm border border-stone-200 bg-white space-y-2">
              <p className="font-mono text-xs font-bold text-stone-950 uppercase tracking-wider">
                — Cookies de Análisis Estadístico (Opcionales)
              </p>
              <p className="text-xs text-stone-600">
                Tratadas de forma anónima por nosotros o por terceros (como Google Analytics), nos permiten cuantificar el número de personas que aprecian nuestras piezas y realizar mediciones estadísticas del uso que hacen los visitantes del portal con el único fin de mejorar la fluidez técnica y el diseño del catálogo.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Desactivación de cookies */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            3. Control y Desactivación de Preferencias
          </h2>
          <p>
            Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador que utilice en su dispositivo. Sin embargo, tenga en cuenta que si bloquea la totalidad de las cookies técnicas, algunas funcionalidades de la galería (como la sincronización inmediata del stock en los productos) podrían no comportarse con la fluidez habitual.
          </p>
          <p className="text-xs text-stone-500 italic">
            Puede consultar los manuales específicos de privacidad de los principales navegadores del mercado en los menús de configuración de Google Chrome, Apple Safari, Mozilla Firefox o Microsoft Edge.
          </p>
        </div>

        {/* 4. Actualizaciones */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            4. Actualizaciones de la Política de Privacidad
          </h2>
          <p>
            Es posible que actualicemos la Política de Cookies de nuestro sitio web para adaptarla a nuevas normativas o a las necesidades técnicas derivadas de la incorporación de nuevos artesanos o pasarelas de pago premium. Le recomendamos revisar esta sección periódicamente si desea estar plenamente informado sobre cómo protegemos su navegación.
          </p>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}