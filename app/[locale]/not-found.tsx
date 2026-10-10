import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

// Página 404 en el idioma de la URL, con salidas útiles (Next añade noindex y el estado 404)
export default async function NoEncontrada() {
  const t = await getTranslations("NoEncontrada");

  const enlaces = [
    { href: "/coleccion", texto: t("coleccion") },
    { href: "/lamparas-a-medida", texto: t("aMedida") },
    { href: "/sobre-el-taller", texto: t("taller") },
    { href: "/contacto", texto: t("contacto") },
  ] as const;

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased flex flex-col">
      <title>{`${t("titulo")} | Veta & Lux`}</title>
      <SiteNav />
      <section className="flex-1 px-6 py-24 md:py-32 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/90 font-urbanist">{t("etiqueta")}</p>
          <h1 className="text-4xl md:text-6xl font-nixie leading-tight">{t("titulo")}</h1>
          <p className="text-lg text-[#5f5852] font-urbanist leading-relaxed">{t("texto")}</p>
          <div className="pt-4">
            <Link href="/" className="inline-block rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors">{t("inicio")}</Link>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-4 font-urbanist text-sm">
            {enlaces.map((e) => (
              <li key={e.href}><Link href={e.href} className="underline underline-offset-4 hover:text-amber-900">{e.texto}</Link></li>
            ))}
          </ul>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
