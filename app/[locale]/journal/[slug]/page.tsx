export const revalidate = 60;

import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, toPlainText, type PortableTextComponents } from "next-sanity";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { ogLocale } from "@/app/[locale]/lib/seo";
import { jsonLdHtml, migasJsonLd } from "@/app/[locale]/lib/producto-seo";
import { rutaLocalizada, urlAbsoluta } from "@/app/[locale]/lib/rutas";
import { articuloJsonLd, disponibleEn, fechaLegible, getArticulo, hrefArticulo, idiomasDe } from "@/app/[locale]/lib/journal";
import { urlFor } from "@/sanity/lib/client";
import { traducir, type ImagenSanity, type Traducible } from "@/sanity/lib/tipos";
import { ordenarPorDisponibilidad } from "@/app/[locale]/lib/producto-seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Los artículos se generan al visitarlos por primera vez y se guardan en caché (60 s o al publicar)
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const articulo = await getArticulo(slug);
  if (!articulo || !disponibleEn(articulo, locale)) return { robots: { index: false } };

  const titulo = traducir(articulo.titulo, locale) ?? "";
  const descripcion = traducir(articulo.resumen, locale) ?? "";
  const idiomas = idiomasDe(articulo);
  const href = hrefArticulo(slug);
  const imagen = articulo.imagen?.asset ? urlFor(articulo.imagen).width(1200).height(630).fit("crop").auto("format").url() : undefined;

  return {
    title: titulo,
    description: descripcion,
    // hreflang solo entre los idiomas en que existe el artículo; x-default, el inglés si existe
    alternates: {
      canonical: rutaLocalizada(href, locale),
      languages: {
        ...Object.fromEntries(idiomas.map((l) => [l, rutaLocalizada(href, l)])),
        "x-default": rutaLocalizada(href, idiomas.includes("en") ? "en" : "es"),
      },
    },
    openGraph: {
      type: "article",
      title: titulo,
      description: descripcion,
      url: rutaLocalizada(href, locale),
      locale: ogLocale(locale),
      publishedTime: articulo.publicado,
      modifiedTime: articulo.revisado ?? articulo.publicado,
      authors: articulo.autor ? [articulo.autor] : undefined,
      images: imagen ? [{ url: imagen }] : undefined,
    },
  };
}

// Medidas de una foto de Sanity a partir de su referencia (image-<id>-1200x800-jpg)
function medidas(img: ImagenSanity) {
  const ref = img.asset?._ref ?? img.asset?._id ?? "";
  const [ancho, alto] = (ref.match(/-(\d+)x(\d+)-/) ?? []).slice(1).map(Number);
  return { ancho: ancho || 1200, alto: alto || 800 };
}

export default async function ArticuloPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const articulo = await getArticulo(slug);
  if (!articulo || !disponibleEn(articulo, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Journal" });
  const titulo = traducir(articulo.titulo, locale) ?? "";
  const resumen = traducir(articulo.resumen, locale);
  const cuerpo = traducir(articulo.cuerpo, locale) ?? [];
  // Tiempo de lectura a unas 200 palabras por minuto
  const palabras = `${resumen ?? ""} ${toPlainText(cuerpo)}`.split(/\s+/).filter(Boolean).length;
  const minutos = Math.max(1, Math.round(palabras / 200));
  const piezas = ordenarPorDisponibilidad(articulo.piezas ?? []).filter((p) => p?._id);
  const revisado = articulo.revisado && articulo.revisado > articulo.publicado ? articulo.revisado : null;

  const migas = [
    { nombre: t("migaInicio"), url: urlAbsoluta("/", locale) },
    { nombre: t("tagline"), url: urlAbsoluta("/journal", locale) },
    { nombre: titulo, url: urlAbsoluta(hrefArticulo(slug), locale) },
  ];

  const componentes: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="text-lg text-[#4a443e] leading-relaxed">{children}</p>,
      h2: ({ children }) => <h2 className="text-3xl font-nixie text-[#3a3530] pt-6">{children}</h2>,
      h3: ({ children }) => <h3 className="text-2xl font-nixie text-[#3a3530] pt-4">{children}</h3>,
      // «Cita» en el Studio: recuadro destacado para lo esencial
      blockquote: ({ children }) => <blockquote className="rounded-xl border border-[#e5e0d8] bg-[#f2efe9] px-6 py-5 text-lg text-[#3a3530] leading-relaxed">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 text-lg text-[#4a443e]">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 text-lg text-[#4a443e]">{children}</ol>,
    },
    marks: {
      link: ({ value, children }) => {
        const href: string = value?.href ?? "";
        const externo = /^https?:\/\//.test(href) && !/vetandlux\.com/.test(href);
        return (
          <a href={href} className="underline underline-offset-2 hover:text-amber-900" {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }: { value: ImagenSanity & { pie?: Traducible } }) => {
        if (!value?.asset) return null;
        const { ancho, alto } = medidas(value);
        return (
          <figure className="py-4 space-y-3">
            {/* Las fotos verticales, a 4:5 y con ancho limitado: a todo el ancho ocuparían una pantalla entera */}
            {alto > ancho ? (
              <Image
                src={urlFor(value).width(900).height(1125).fit("crop").auto("format").url()}
                alt={traducir(value.alt, locale) ?? ""}
                width={900}
                height={1125}
                sizes="(max-width: 768px) 90vw, 448px"
                className="w-full max-w-md mx-auto h-auto rounded-xl"
              />
            ) : (
              <Image
                src={urlFor(value).width(1400).auto("format").url()}
                alt={traducir(value.alt, locale) ?? ""}
                width={ancho}
                height={alto}
                sizes="(max-width: 768px) 100vw, 720px"
                className="w-full h-auto rounded-xl"
              />
            )}
            {traducir(value.pie, locale) && (
              <figcaption className="text-sm text-stone-500 text-center">{traducir(value.pie, locale)}</figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(articuloJsonLd(articulo, locale))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(migasJsonLd(migas))} />
      <SiteNav />

      <article className="px-6 pt-12 pb-20">
        <div className="max-w-3xl mx-auto">
          <nav aria-label={t("tagline")} className="mb-10 font-urbanist text-sm text-stone-600">
            <Link href="/journal" className="hover:text-stone-900 underline-offset-4 hover:underline">← {t("volver")}</Link>
          </nav>

          <header className="space-y-5 mb-10">
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-amber-900/90 font-urbanist">{t("tagline")}</p>
            <h1 className="text-4xl md:text-6xl font-nixie leading-tight">{titulo}</h1>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600 font-urbanist">
              {articulo.autor && <span>{t("por", { autor: articulo.autor })}</span>}
              <time dateTime={articulo.publicado}>{t("publicado", { fecha: fechaLegible(articulo.publicado, locale) })}</time>
              <span>{t("lectura", { minutos })}</span>
              {revisado && <time dateTime={revisado}>{t("revisado", { fecha: fechaLegible(revisado, locale) })}</time>}
            </p>
          </header>

          {/* Respuesta directa: lo primero que se lee, y lo que suelen citar buscadores y asistentes de IA */}
          {resumen && (
            <p className="text-xl md:text-2xl text-[#3a3530] leading-relaxed font-urbanist font-light border-l-2 border-amber-900/40 pl-5 mb-12">{resumen}</p>
          )}

          {articulo.imagen?.asset && (
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-stone-100 mb-12">
              <Image
                src={urlFor(articulo.imagen).width(1600).height(1067).fit("crop").auto("format").url()}
                alt={traducir(articulo.imagen.alt, locale) ?? titulo}
                fill
                priority={false}
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-6 font-urbanist">
            <PortableText value={cuerpo} components={componentes} />
          </div>
        </div>
      </article>

      {piezas.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20" aria-labelledby="piezas-relacionadas">
          <h2 id="piezas-relacionadas" className="text-2xl md:text-3xl font-nixie text-stone-900 border-t border-stone-200 pt-12 mb-10">{t("piezasTitulo")}</h2>
          <ProductGallery productos={piezas} listName="journal" />
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
