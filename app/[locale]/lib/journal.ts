// Journal: consultas, idiomas disponibles y datos estructurados de los artículos (sanity/schemaTypes/articulo.ts)
import type { PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { CACHE_JOURNAL } from "@/sanity/lib/cache";
import { ESTADO_EFECTIVO } from "@/sanity/lib/reservas";
import { traducir, type ImagenSanity, type ProductoSanity, type Traducible } from "@/sanity/lib/tipos";
import { urlFor } from "@/sanity/lib/client";
import { SITE_URL } from "@/app/[locale]/lib/sitio";
import { urlAbsoluta } from "@/app/[locale]/lib/rutas";

export type ArticuloSanity = {
  _id: string;
  _updatedAt?: string;
  titulo?: Traducible;
  slug: string;
  resumen?: Traducible;
  imagen?: ImagenSanity;
  cuerpo?: Traducible<PortableTextBlock[]>;
  autor?: string;
  publicado: string;
  revisado?: string;
  piezas?: ProductoSanity[];
  tieneEn?: boolean;
};

export const hrefArticulo = (slug: string) => ({ pathname: "/journal/[slug]" as const, params: { slug } });

// En español basta el título; en inglés hacen falta título y cuerpo traducidos (nada de texto español bajo /en/)
export function disponibleEn(a: ArticuloSanity, locale: string) {
  if (locale === "en") return Boolean(a.titulo?.en?.trim() && (a.tieneEn || (a.cuerpo?.en?.length ?? 0) > 0));
  return Boolean(a.titulo?.es?.trim());
}

export const idiomasDe = (a: ArticuloSanity) => (["es", "en"] as const).filter((l) => disponibleEn(a, l));

const PUBLICADOS = `_type == "articulo" && defined(slug.current) && defined(publicado) && dateTime(publicado) <= dateTime(now())`;

export async function getArticulos(): Promise<ArticuloSanity[]> {
  return client.fetch(
    `*[${PUBLICADOS}] | order(publicado desc) {
      _id, _updatedAt, titulo, "slug": slug.current, resumen, imagen, autor, publicado, revisado,
      "tieneEn": count(cuerpo.en) > 0
    }`,
    {},
    CACHE_JOURNAL
  );
}

export async function getArticulo(slug: string): Promise<ArticuloSanity | null> {
  return client.fetch(
    `*[${PUBLICADOS} && slug.current == $slug][0] {
      _id, _updatedAt, titulo, "slug": slug.current, resumen, "imagen": imagen { ..., asset-> }, cuerpo, autor, publicado, revisado,
      "tieneEn": count(cuerpo.en) > 0,
      "piezas": piezas[]-> { _id, nombre, "slug": slug.current, precio, descripcion, imagen, tipo, madera, materialBase, ${ESTADO_EFECTIVO} }
    }`,
    { slug },
    CACHE_JOURNAL
  );
}

export function fechaLegible(fecha: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(fecha));
}

// Datos estructurados del artículo: quién lo escribe, cuándo, y que pertenece a la web de la marca
export function articuloJsonLd(a: ArticuloSanity, locale: string) {
  const url = urlAbsoluta(hrefArticulo(a.slug), locale);
  const autores = (a.autor ?? "Cristina y Rafa").split(" y ").map((name) => ({ "@type": "Person", name, worksFor: { "@id": `${SITE_URL}/#organizacion` } }));
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: traducir(a.titulo, locale),
    description: traducir(a.resumen, locale),
    url,
    mainEntityOfPage: url,
    inLanguage: locale === "en" ? "en" : "es",
    ...(a.imagen?.asset ? { image: [urlFor(a.imagen).width(1200).auto("format").url()] } : {}),
    author: autores,
    publisher: { "@id": `${SITE_URL}/#organizacion` },
    isPartOf: { "@id": `${SITE_URL}/#web` },
    datePublished: a.publicado,
    dateModified: a.revisado ?? a.publicado,
  };
}
