import Link from "next/link";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

export default function EnviosDevolucionesPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      {/* Cabecera de la Página */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">
          Compromiso Veta & Lux
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 font-light">
          Envíos y Retornos de Cortesía
        </h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-8"></div>
      </header>

      {/* Contenido Principal */}
      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-16">
        
        {/* Bloque 1: Filosofía de Embalaje */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 flex items-center gap-3">
            <span className="text-amber-800/60 font-serif text-lg">01.</span> El Arte del Embalaje
          </h2>
          <p className="text-stone-600 font-light leading-relaxed text-base">
            Cada lámpara de nuestra colección es una escultura de madera y luz irrepetible. Por ello, el proceso de empaquetado se realiza a mano en nuestro propio taller, utilizando cajas de alta resistencia a medida y protecciones internas sostenibles que garantizan que la pieza viaje suspendida y totalmente aislada de impactos.
          </p>
        </div>

        {/* Bloque 2: Logística y Tiempos */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 flex items-center gap-3">
              <span className="text-amber-800/60 font-serif text-lg">02.</span> Transporte de Alta Custodia
            </h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Trabajamos exclusivamente con agencias de transporte premium con servicio de seguimiento en tiempo real y entrega bajo firma. Queremos que la experiencia sea impecable desde que la pieza sale del taller hasta que ilumina su hogar.
            </p>
          </div>

          {/* Tabla de Tarifas / Tiempos */}
          <div className="rounded-sm border border-stone-200 bg-white p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-stone-600">
              <div className="space-y-1">
                <p className="font-bold text-stone-900 uppercase tracking-wider">España Peninsular</p>
                <p>Envío de cortesía (Gratuito) — Entrega en 24/48 horas laborables.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-stone-900 uppercase tracking-wider">Unión Europea</p>
                <p>Tarifa calculada al checkout — Entrega en 3-5 días laborables.</p>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 font-light italic pt-2 border-t border-stone-100">
              * Para envíos internacionales fuera de la UE o islas, por favor contáctenos directamente a través de nuestro taller.
            </p>
          </div>
        </div>

        {/* Bloque 3: Devoluciones */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 flex items-center gap-3">
            <span className="text-amber-800/60 font-serif text-lg">03.</span> Periodo de Reflexión y Retornos
          </h2>
          <p className="text-stone-600 font-light leading-relaxed">
            Entendemos que el arte y el diseño requieren ser experimentados en su espacio definitivo. Si una vez ubicada en su estancia siente que la pieza no dialoga a la perfección con el entorno, dispone de un plazo de <strong>14 días naturales</strong> desde la recepción para solicitar su devolución.
          </p>
          <p className="text-stone-600 font-light leading-relaxed">
            La pieza deberá ser enviada de vuelta en su embalaje original de alta seguridad para asegurar que no sufra daños en el transporte. Una vez recibida e inspeccionada en el taller, le reembolsaremos el importe íntegro por el mismo método de pago.
          </p>
        </div>

        {/* Bloque 4: Piezas por Encargo */}
        <div className="rounded-2xl border border-stone-200/80 bg-stone-100/60 p-8 space-y-3">
          <h3 className="font-serif italic text-stone-900 text-lg">Nota sobre Proyectos a Medida</h3>
          <p className="text-sm text-stone-500 font-light leading-relaxed">
            Aquellas lámparas creadas bajo encargo personalizado, adaptando medidas específicas o maderas seleccionadas expresamente para un proyecto, no admiten devolución estándar al tratarse de obras exclusivas co-creadas para el cliente. Naturalmente, cualquier incidencia en el transporte queda cubierta de manera inmediata por el taller.
          </p>
        </div>

        {/* Cierre / Enlace de soporte */}
        <div className="pt-8 text-center space-y-4">
          <p className="text-sm text-stone-500 font-light">
            ¿Tiene alguna duda sobre la idoneidad de una pieza o su transporte?
          </p>
          <Link
            href="https://wa.me/34660800631"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-all font-medium shadow-sm"
          >
            Consultar con el Taller →
          </Link>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}