import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/app/[locale]/components/contact-form";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";

export default async function ContactoPage() {
  const t = await getTranslations("Contacto");

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-12">
        {/* Tagline: Urbanist */}
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-900/60 font-urbanist mb-4">
          {t("tagline")}
        </p>
        {/* Título: Nixie One */}
        <h1 className="text-4xl md:text-5xl font-nixie font-bold text-[#2a2623] tracking-tight mb-6">
          {t("titulo")}
        </h1>
        {/* Descripción: Urbanist */}
        <p className="max-w-2xl text-lg text-[#6b645d] leading-relaxed font-urbanist">
          {t("descripcion")}
        </p>
        <p className="mt-6 text-sm text-[#6b645d] font-urbanist">
          <Link
            href="/"
            className="border-b border-[#a69680] hover:text-[#3a3530] hover:border-[#3a3530] transition-colors"
          >
            {t("botonVolver")}
          </Link>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bloques de contacto: Títulos en Urbanist uppercase, cuerpo en Urbanist */}
            {[
              { title: t("taller.titulo"), body: t("taller.ubicacion"), desc: t("taller.texto"), type: 'text' },
              { title: t("email.titulo"), body: "info@vetandlux.com", desc: t("email.texto"), type: 'email' },
              { title: t("whatsapp.titulo"), body: "+34 660 80 06 31", desc: t("whatsapp.texto"), type: 'whatsapp' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-stone-200/80 bg-stone-100/30 p-6">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#8c857e] mb-3 font-urbanist font-bold">
                  {item.title}
                </h2>
                {item.type === 'email' ? (
                  <a href="mailto:info@vetandlux.com" className="text-[#2a2623] text-lg border-b border-[#a69680] hover:border-[#3a3530] transition-colors font-urbanist">
                    {item.body}
                  </a>
                ) : item.type === 'whatsapp' ? (
                  <a href="https://wa.me/34660800631" target="_blank" rel="noopener noreferrer" className="text-[#2a2623] text-lg border-b border-[#a69680] hover:border-[#3a3530] transition-colors font-urbanist">
                    {item.body}
                  </a>
                ) : (
                  <p className="text-[#2a2623] font-medium font-urbanist">{item.body}</p>
                )}
                <p className="text-[#6b645d] text-sm mt-2 leading-relaxed font-urbanist">
                  {item.desc}
                </p>
              </div>
            ))}

            {/* Horario */}
            <div className="rounded-2xl border border-stone-200/80 bg-white/60 p-6">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#8c857e] mb-3 font-urbanist font-bold">
                {t("horario.titulo")}
              </h2>
              <p className="text-[#6b645d] text-sm leading-relaxed font-urbanist">
                {t("horario.linea1")} <span className="text-[#2a2623] font-bold">{t("horario.horas")}</span>
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