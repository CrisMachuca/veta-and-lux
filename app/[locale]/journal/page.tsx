export const revalidate = 60;

import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { metadataPagina } from "@/app/[locale]/lib/seo";
import { disponibleEn, fechaLegible, getArticulos, hrefArticulo } from "@/app/[locale]/lib/journal";
import { urlFor } from "@/sanity/lib/client";
import { traducir } from "@/sanity/lib/tipos";

type Props = { params: Promise<{ locale: string }> };

// Mientras no haya artículos en este idioma, la página no se indexa (sería una página vacía para Google)
export async function generateMetadata(props: Props): Promise<Metadata> {
  const base = await metadataPagina("journal", "/journal")(props);
  const { locale } = await props.params;
  const hay = (await getArticulos()).some((a) => disponibleEn(a, locale));
  return hay ? base : { ...base, robots: { index: false, follow: true } };
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Journal" });
  const articulos = (await getArticulos()).filter((a) => disponibleEn(a, locale));

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <SiteNav />

      <header className="px-6 pt-20 pb-14 md:pt-28 md:pb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/90 font-urbanist mb-4">{t("tagline")}</p>
          <h1 className="text-5xl md:text-7xl font-nixie leading-tight mb-6">{t("titulo")}</h1>
          <p className="text-lg md:text-xl text-[#5f5852] leading-relaxed font-urbanist font-light">{t("descripcion")}</p>
        </div>
      </header>

      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          {articulos.length === 0 ? (
            <p className="text-center text-[#5f5852] font-urbanist">{t("vacio")}</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
              {articulos.map((a) => (
                <li key={a._id}>
                  <Link href={hrefArticulo(a.slug)} className="group block space-y-4">
                    {a.imagen?.asset && (
                      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-stone-100">
                        <Image
                          src={urlFor(a.imagen).width(900).height(600).fit("crop").auto("format").url()}
                          alt={traducir(a.imagen.alt, locale) || traducir(a.titulo, locale) || ""}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-urbanist">{fechaLegible(a.publicado, locale)}</p>
                    <h2 className="text-2xl md:text-3xl font-nixie leading-snug group-hover:text-amber-900 transition-colors">{traducir(a.titulo, locale)}</h2>
                    {traducir(a.resumen, locale) && <p className="text-[#5f5852] font-urbanist leading-relaxed line-clamp-3">{traducir(a.resumen, locale)}</p>}
                    <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold underline underline-offset-4 font-urbanist">{t("leer")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
