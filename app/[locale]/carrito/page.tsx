import Link from "next/link";
import { useTranslations } from "next-intl"; // 1. Importa el hook
import { CarritoClient } from "@/app/[locale]/components/carrito-client";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";

export default function CarritoPage() {
  const t = useTranslations("Carrito"); // 2. Inicializa el hook

  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />

      <section className="max-w-3xl mx-auto px-6 pt-14 pb-8 md:pt-20 md:pb-10">
        <p className="text-sm uppercase tracking-widest text-stone-500 mb-4">
          {t("subtitulo")}
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight mb-6">
          {t("titulo")}
        </h1>
        
        <p className="text-stone-600 leading-relaxed">
          {t("descripcion")}
        </p>
        
        <p className="mt-6 text-sm text-stone-500">
          <Link
            href="/coleccion"
            className="border-b border-stone-400 hover:text-stone-800 hover:border-stone-800 transition-colors"
          >
            {t("seguirComprando")}
          </Link>
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <CarritoClient />
      </section>

      <SiteFooter />
    </main>
  );
}