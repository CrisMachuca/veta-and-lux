import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/app/[locale]/components/contact-form";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { metadataPagina } from "@/app/[locale]/lib/seo";

export const generateMetadata = metadataPagina("contacto", "/contacto");

export default async function ContactoPage() {
  const t = await getTranslations("Contacto");

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      {/* CABECERA DE CONTACTO */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/70 font-urbanist mb-4">
            {t("tagline")}
          </p>
          <h1 className="text-5xl md:text-7xl font-nixie font-bold text-[#2a2623] tracking-tight mb-6">
            {t("titulo")}
          </h1>
          <p className="text-lg md:text-xl text-[#6b645d] leading-relaxed font-urbanist font-light max-w-2xl mx-auto">
            {t("descripcion")}
          </p>
          <p className="mt-8 text-sm font-urbanist">
            <Link
              href="/"
              className="border-b border-[#a69680] pb-1 hover:text-[#3a3530] hover:border-[#3a3530] transition-colors uppercase tracking-[0.2em] text-[10px]"
            >
              ← {t("botonVolver")}
            </Link>
          </p>
        </div>
      </section>

      {/* CONTENEDOR PRINCIPAL */}
      <section className="px-6 md:px-12 lg:px-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* BLOQUES DE CONTACTO (Izquierda) */}
          <div className="lg:col-span-5 space-y-6">
            {[
              { title: t("taller.titulo"), body: t("taller.ubicacion"), desc: t("taller.texto"), type: 'text' },
              { title: t("email.titulo"), body: "info@vetandlux.com", desc: t("email.texto"), type: 'email' },
              { title: t("whatsapp.titulo"), body: "+34 660 80 06 31", desc: t("whatsapp.texto"), type: 'whatsapp' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-stone-200/80 bg-stone-100/30 p-8">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-[#8c857e] mb-3 font-urbanist font-bold">
                  {item.title}
                </h2>
                {item.type === 'email' ? (
                  <a href="mailto:info@vetandlux.com" className="text-[#2a2623] text-xl md:text-2xl border-b border-[#a69680] hover:border-[#3a3530] transition-colors font-urbanist">
                    {item.body}
                  </a>
                ) : item.type === 'whatsapp' ? (
                  <a href="https://wa.me/34660800631" target="_blank" rel="noopener noreferrer" className="text-[#2a2623] text-xl md:text-2xl border-b border-[#a69680] hover:border-[#3a3530] transition-colors font-urbanist">
                    {item.body}
                  </a>
                ) : (
                  <p className="text-[#2a2623] text-xl md:text-2xl font-medium font-urbanist">{item.body}</p>
                )}
                <p className="text-[#6b645d] text-base md:text-lg mt-3 leading-relaxed font-urbanist font-light">
                  {item.desc}
                </p>
              </div>
            ))}

            {/* Horario */}
            <div className="rounded-2xl border border-stone-200/80 bg-white/60 p-8">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-[#8c857e] mb-3 font-urbanist font-bold">
                {t("horario.titulo")}
              </h2>
              <p className="text-[#6b645d] text-base md:text-lg leading-relaxed font-urbanist font-light">
                {t("horario.linea1")} <span className="text-[#2a2623] font-medium">{t("horario.horas")}</span>
                <br />
                {t("horario.linea2")}
              </p>
            </div>
          </div>

          {/* FORMULARIO DE CONTACTO (Derecha) */}
          <div className="lg:col-span-7 bg-stone-100/20 border border-stone-200/60 rounded-2xl p-8 md:p-12">
            <h2 className="sr-only">{t("srFormulario")}</h2>
            <ContactForm />
          </div>

        </div>
      </section>

      <SiteFooter />
    </main>
  );
}