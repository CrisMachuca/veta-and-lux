import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { TEXTOS_LEGALES_BORRADOR } from "@/app/[locale]/lib/legal";

type Seccion = { titulo: string; parrafos: string[] };

// Página legal con el mismo aspecto que el Aviso legal; el contenido sale de messages/*.json
export async function PaginaLegal({ locale, namespace }: { locale: string; namespace: "Privacidad" | "Condiciones" }) {
  const t = await getTranslations({ locale, namespace });
  const tl = await getTranslations({ locale, namespace: "Legal" });
  const secciones = t.raw("secciones") as Seccion[];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold mb-3">{t("tagline")}</p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 font-light">{t("titulo")}</h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-8"></div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-10 text-stone-700 font-light leading-relaxed text-sm">
        {TEXTOS_LEGALES_BORRADOR && (
          <p role="note" className="rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 font-normal">
            {tl("borrador")}
          </p>
        )}

        <p className="text-base text-stone-800">{t("intro")}</p>

        {secciones.map((s) => (
          <div key={s.titulo} className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">{s.titulo}</h2>
            {s.parrafos.map((p) => <p key={p}>{p}</p>)}
          </div>
        ))}

        <p className="text-xs text-stone-500 border-t border-stone-200 pt-6">
          {tl("ultimaRevision")} ·{" "}
          <Link href="/aviso-legal" className="underline underline-offset-2 hover:text-stone-900">{tl("avisoLegal")}</Link>
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
