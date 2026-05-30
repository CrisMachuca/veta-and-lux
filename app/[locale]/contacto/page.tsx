import { Link } from "@/navigation"; // 🌟 Usamos el Link localizado
import { getTranslations } from "next-intl/server"; // 🌟 getTranslations para Server Components
import { ContactForm } from "@/app/[locale]/components/contact-form";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";

export default async function ContactoPage() {
  // 🌟 Cargamos el diccionario del nodo "Contacto"
  const t = await getTranslations("Contacto");

  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="text-sm uppercase tracking-widest text-stone-500 mb-4">
          {t("tagline")}
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight mb-6">
          {t("titulo")}
        </h1>
        <p className="max-w-2xl text-lg text-stone-600 leading-relaxed">
          {t("descripcion")}
        </p>
        <p className="mt-6 text-sm text-stone-500">
          <Link
            href="/"
            className="border-b border-stone-400 hover:text-stone-800 hover:border-stone-800 transition-colors"
          >
            {t("botonVolver")}
          </Link>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Taller */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-100/50 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                {t("taller.titulo")}
              </h2>
              <p className="text-stone-800 font-medium">{t("taller.ubicacion")}</p>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                {t("taller.texto")}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-100/50 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                {t("email.titulo")}
              </h2>
              <a
                href="mailto:info@vetandlux.com"
                className="text-stone-900 text-lg border-b border-stone-400 hover:border-stone-900 transition-colors"
              >
                info@vetandlux.com
              </a>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                {t("email.texto")}
              </p>
            </div>

            {/* WhatsApp Directo */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-100/50 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                {t("whatsapp.titulo")}
              </h2>
              <a
                href="https://wa.me/34660800631" // 👈 Corregido el número real aquí
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 text-lg border-b border-stone-400 hover:border-stone-900 transition-colors inline-flex items-center gap-2"
              >
                +34 660 80 06 31
              </a>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                {t("whatsapp.texto")}
              </p>
            </div>

            {/* Horario */}
            <div className="rounded-2xl border border-stone-200/80 bg-white/60 p-6 ring-1 ring-stone-100">
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                {t("horario.titulo")}
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                {t("horario.linea1")}
                <span className="text-stone-900">{t("horario.horas")}</span>
                <br />
                {t("horario.linea2")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="sr-only">{t("srFormulario")}</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}