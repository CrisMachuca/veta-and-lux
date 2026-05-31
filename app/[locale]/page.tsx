// 🌟 Forzamos a Next.js a tratar la Home como dinámica en producción.
export const dynamic = "force-dynamic";

import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server"; 
import Image from "next/image"; // Optimización de imágenes
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client } from "@/sanity/lib/client";

async function getProductosDestacados() {
  const query = `*[_type == "producto" && destacado == true] | order(_createdAt desc) {
    _id, nombre, "slug": slug.current, precio, descripcion, 
    descripcionLarga, imagen, imagenes, materialBase, 
    materialPantalla, cable, medidas, cuidados, estado
  }`;

  return await client.fetch(query, {}, { cache: "no-store", next: { revalidate: 0 } });
}

export default async function Page() {
  const productosSanity = await getProductosDestacados();
  const t = await getTranslations("Inicio");

  return (
    <main className="min-h-screen bg-stone-50 antialiased text-stone-800">
      <SiteNav />

      {/* 💎 HERO ÚNICO: Elegante, optimizado y SEO Friendly */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden rounded-sm mx-4 md:mx-8 mt-4 bg-stone-950">
  {/* Imagen clara: opacidad alta para que se vea la veta */}
  <Image
    src="/detalle.png"
    alt="Veta & Lux - Alta iluminación artesanal"
    fill
    className="object-cover opacity-80" 
    priority
  />
  
  {/* Filtro oscuro muy sutil (20% en lugar del 40-60% anterior) */}
  <div className="absolute inset-0 bg-stone-950/20"></div>
  
  <div className="relative z-10 max-w-3xl space-y-8 px-4">
    {/* Tagline con sombra suave para legibilidad */}
    <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-stone-200 font-semibold border-b border-white/20 pb-3 block drop-shadow-lg">
      {t("Hero.tagline")}
    </span>

    {/* Título blanco con sombra para que destaque sobre cualquier tono de madera */}
    <h1 className="text-6xl md:text-9xl font-light tracking-tighter text-white select-none pt-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
      Veta<span className="font-serif italic text-stone-300 font-normal">&</span>Lux
    </h1>

    {/* Párrafo blanco con sombra para máxima legibilidad */}
    <p className="text-white font-light leading-relaxed text-base md:text-lg max-w-xl mx-auto tracking-wide drop-shadow-md">
      {t("Hero.parrafo")}
    </p>

    <div className="pt-6">
      <Link
        href="/coleccion"
        className="group relative inline-block border border-white/50 bg-transparent text-white px-14 py-4 rounded-none transition-all duration-500 text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden shadow-xl"
      >
        <span className="absolute inset-0 w-full h-full bg-white transition-transform duration-500 ease-out transform translate-y-full group-hover:translate-y-0"></span>
        <span className="relative z-10 transition-colors duration-500 ease-out group-hover:text-stone-950 font-bold">
          {t("Hero.botonAdquirir")}
        </span>
      </Link>
    </div>
  </div>
</section>

      {/* 🪵 SECCIÓN PIEZAS DESTACADAS */}
      <section className="py-24">
  <h2 className="text-xs font-medium text-stone-400 mb-16 text-center uppercase tracking-[0.3em] px-6">
    {t("Galeria.titulo")}
  </h2>

  {/* Eliminamos el max-w-6xl aquí para que el carrusel respire en móvil */}
  <div className="px-6 md:max-w-6xl md:mx-auto">
    <ProductGallery productos={productosSanity} />
  </div>

  <div className="mt-16 text-center px-6">
    <Link href="/coleccion" className="border border-stone-900 px-12 py-4 uppercase text-xs tracking-widest hover:bg-stone-900 hover:text-white transition-all">
      {t("Galeria.botonVerColeccion")}
    </Link>
  </div>
</section>

      {/* 📜 SECCIÓN: GARANTÍA */}
      <section className="bg-stone-100/60 border-y border-stone-200/80 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-serif text-sm italic text-stone-900">{t(`Garantias.g${i}Titulo`)}</h4>
              <p className="text-stone-600 text-xs font-light">{t(`Garantias.g${i}Texto`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🛠️ SECCIÓN: MANIFIESTO */}
      <section className="max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
          <Image src="/detalle.png" alt="Artesanía" fill className="object-cover" />
        </div>
        <div className="space-y-6">
          <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest">{t("Manifiesto.tagline")}</p>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 leading-tight">
            {t("Manifiesto.titulo")} <span className="italic">{t("Manifiesto.subtitulo")}</span>
          </h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">{t("Manifiesto.p1")}</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}