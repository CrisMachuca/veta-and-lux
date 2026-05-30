import { Link } from "@/navigation"; // Usamos nuestro Link localizado
import { getTranslations } from "next-intl/server"; //getTranslations para Server Components
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

export default async function ElProcesoPage() {
  // Activamos las traducciones del nodo "Proceso"
  const t = await getTranslations("Proceso");

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      {/* Cabecera Editorial */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-4">
          {t("Header.tagline")}
        </p>
        <h1 className="text-4xl md:text-6xl font-serif italic text-stone-900 font-light leading-tight">
          {t("Header.titulo")}
        </h1>
        <p className="max-w-xl mx-auto mt-6 text-stone-500 font-light text-sm md:text-base leading-relaxed">
          {t("Header.descripcion")}
        </p>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-10"></div>
      </header>

      {/* Cronología del Proceso en detalle */}
      <section className="max-w-4xl mx-auto px-6 pb-32 space-y-24 md:space-y-36">
        
        {/* 🎥 PASO 1: El Origen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover filter brightness-[0.95]"
            >
              <source src="/hallazgo.mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de vídeos.
            </video>
            <div className="absolute inset-0 border-[12px] border-stone-50/10 m-4 rounded-sm pointer-events-none"></div>
          </div>
          <div className="md:col-span-5 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">
              {t("Fase1.tagline")}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">
              {t("Fase1.titulo")}
            </h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase1.p1")}
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase1.p2")}
            </p>
          </div>
        </div>

        {/* ⏳ PASO 2: El Letargo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <img
              src="/curado.png"
              alt="Madera recuperada en proceso de curado y secado natural"
              className="w-full h-full object-cover filter brightness-[0.98]"
            />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">
              {t("Fase2.tagline")}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">
              {t("Fase2.titulo")}
            </h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase2.p1")}
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase2.p2")}
            </p>
          </div>
        </div>

        {/* ✨ PASO 3: Saneado y Escultura */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <img
              src="/saneado.jpeg"
              alt="Madera recuperada pulida meticulosamente y herramientas en el banco de trabajo"
              className="w-full h-full object-cover filter brightness-[0.98]"
            />
          </div>
          <div className="md:col-span-5 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">
              {t("Fase3.tagline")}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">
              {t("Fase3.titulo")}
            </h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase3.p1")}
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase3.p2")}
            </p>
          </div>
        </div>

        {/* 💡 PASO 4: Arquitectura Lumínica */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <img
              src="/tronco2.jpeg"
              alt="Componentes de latón cepillado, cables de lino y ensamblaje de la lámpara"
              className="w-full h-full object-cover filter brightness-[0.98]"
            />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">
              {t("Fase4.tagline")}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">
              {t("Fase4.titulo")}
            </h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase4.p1")}
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t("Fase4.p2")}
            </p>
          </div>
        </div>

        {/* Cierre / Manifiesto */}
        <div className="bg-stone-900 text-stone-100 p-8 md:p-16 rounded-sm text-center space-y-6 max-w-3xl mx-auto shadow-md">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-mono">
            {t("Cierre.tagline")}
          </p>
          <blockquote className="font-serif italic text-xl md:text-2xl text-stone-200 font-light max-w-xl mx-auto leading-relaxed">
            {t("Cierre.cita")}
          </blockquote>
          <div className="pt-4">
            <Link
              href="/coleccion"
              className="inline-block border-b border-stone-500 text-stone-300 hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest pb-1 font-mono"
            >
              {t("Cierre.boton")}
            </Link>
          </div>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}