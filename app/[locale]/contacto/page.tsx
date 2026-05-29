import Link from "next/link";
import { ContactForm } from "@/app/[locale]/components/contact-form";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="text-sm uppercase tracking-widest text-stone-500 mb-4">
          Hablemos
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight mb-6">
          Contacto
        </h1>
        <p className="max-w-2xl text-lg text-stone-600 leading-relaxed">
          ¿Te gustaría una pieza a medida, resolver dudas sobre envíos o pasar
          por el taller? Escríbenos: respondemos con la misma calma con la que
          trabajamos la madera.
        </p>
        <p className="mt-6 text-sm text-stone-500">
          <Link
            href="/"
            className="border-b border-stone-400 hover:text-stone-800 hover:border-stone-800 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Taller */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-100/50 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                Taller
              </h2>
              <p className="text-stone-800 font-medium">Málaga, España</p>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                Visitas con cita previa para conocer el proceso y ver piezas
                disponibles.
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-100/50 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                Email
              </h2>
              <a
                href="mailto:info@vetandlux.com"
                className="text-stone-900 text-lg border-b border-stone-400 hover:border-stone-900 transition-colors"
              >
                info@vetandlux.com
              </a>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                Pedidos, encargos personalizados y consultas generales.
              </p>
            </div>

            {/* 🟢 NUEVO: WhatsApp Directo */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-100/50 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                WhatsApp
              </h2>
              <a
                href="https://wa.me/34600000000" // 👈 Pon tu número aquí (SIn espacios ni símbolos)
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 text-lg border-b border-stone-400 hover:border-stone-900 transition-colors inline-flex items-center gap-2"
              >
                +34 660 80 06 31
              </a>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                Atención rápida para dudas inmediatas o consultas de stock en vivo.
              </p>
            </div>

            {/* Horario */}
            <div className="rounded-2xl border border-stone-200/80 bg-white/60 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                Horario
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                Lunes a viernes, mañanas{" "}
                <span className="text-stone-900">9:00 – 14:00</span>
                <br />
                Tardes con cita concertada.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="sr-only">Formulario de contacto</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}