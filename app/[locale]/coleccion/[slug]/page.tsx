export const revalidate = 60;

import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductDetailClient } from "@/app/[locale]/components/product-detail-client";
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client, urlFor } from "@/sanity/lib/client";
import { ESTADO_EFECTIVO } from "@/sanity/lib/reservas";
import { CACHE_CATALOGO } from "@/sanity/lib/cache";
import { traducir, type ProductoSanity } from "@/sanity/lib/tipos";
import { Metadata } from "next";
import { alternatesPara, ogLocale } from "@/app/[locale]/lib/seo";
import { hrefPieza, rutaLocalizada, urlAbsoluta } from "@/app/[locale]/lib/rutas";
import {
  descripcionProducto,
  jsonLdHtml,
  migasJsonLd,
  nombreProducto,
  ordenarPorDisponibilidad,
  productoJsonLd,
  tituloProducto,
  conNombreArchivo,
  nombreArchivoFoto,
  tieneCertificado,
} from "@/app/[locale]/lib/producto-seo";

export async function generateStaticParams() {
  const query = `*[_type == "producto" && defined(slug.current)] { "slug": slug.current }`;
  const productos = await client.fetch(query);
  const locales = ["es", "en"];

  return productos.flatMap((producto: { slug: string }) =>
    locales.map((locale) => ({
      locale,
      slug: producto.slug,
    }))
  );
}

// Campos de la pieza que necesitan la ficha, los metadatos y el JSON-LD
const CAMPOS_PIEZA = `
  _id,
  nombre,
  slug,
  precio,
  descripcion,
  descripcionLarga,
  "imagen": imagen { ..., asset-> },
  "imagenes": imagenes[] { ..., asset-> },
  materialBase,
  materialPantalla,
  cable,
  medidas,
  cuidados,
  tipo,
  madera,
  electrico,
  numeroPieza,
  fechaCreacion,
  certificado,
  origenMadera,
  proceso,
  ${ESTADO_EFECTIVO}
`;

async function getProductoSanityBySlug(slug: string): Promise<ProductoSanity | null> {
  return await client.fetch(`*[_type == "producto" && slug.current == $slug][0] { ${CAMPOS_PIEZA} }`, { slug }, CACHE_CATALOGO);
}

// Otras piezas para no dejar la ficha sin salida: primero las disponibles
async function getPiezasRelacionadas(slug: string): Promise<ProductoSanity[]> {
  const piezas: ProductoSanity[] = await client.fetch(
    `*[_type == "producto" && defined(slug.current) && slug.current != $slug] | order(_createdAt desc) {
      _id, nombre, "slug": slug.current, precio, descripcion, imagen, tipo, ${ESTADO_EFECTIVO}
    }`,
    { slug },
    CACHE_CATALOGO
  );
  return ordenarPorDisponibilidad(piezas).slice(0, 3);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const producto = await getProductoSanityBySlug(slug);

  if (!producto) {
    return {
      title: locale === "en" ? "Piece not found" : "Producto no encontrado",
      robots: { index: false },
    };
  }

  // «Nombre · Lámpara de sobremesa»; la plantilla del layout añade « | Veta & Lux»
  const titulo = tituloProducto(producto, locale);
  const descripcion = descripcionProducto(producto, locale);
  const imagenUrl = producto.imagen?.asset ? urlFor(producto.imagen).width(1200).height(630).fit("crop").auto("format").url() : undefined;

  return {
    title: titulo,
    description: descripcion,
    alternates: alternatesPara(locale, hrefPieza(slug)),
    openGraph: {
      title: `${titulo} | Veta & Lux`,
      description: descripcion,
      url: rutaLocalizada(hrefPieza(slug), locale),
      locale: ogLocale(locale),
      images: imagenUrl ? [{ url: imagenUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | Veta & Lux`,
      description: descripcion,
      images: imagenUrl ? [imagenUrl] : [],
    },
  };
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductoPage(props: PageProps) {
  const { slug, locale } = await props.params;
  setRequestLocale(locale);

  const [producto, relacionadas] = await Promise.all([getProductoSanityBySlug(slug), getPiezasRelacionadas(slug)]);

  if (!producto) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "FichaProducto" });
  const nombre = nombreProducto(producto, locale);

  // Datos estructurados: producto con oferta, envíos y devoluciones, y migas de pan
  const imagenesLd = [producto.imagen, ...(producto.imagenes ?? [])]
    .filter((img) => img?.asset)
    .slice(0, 4)
    .map((img, i) => conNombreArchivo(urlFor(img!).width(1200).auto("format").url(), nombreArchivoFoto(producto, locale, i)));

  // Secciones de la ficha (solo las que tienen texto): lo que buscan saber quien compra, Google y las IA
  const parrafos = (texto?: string) => (texto ?? "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const fecha = producto.fechaCreacion
    ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(producto.fechaCreacion))
    : null;
  const textoCertificado = [
    t("certificadoTexto"),
    producto.numeroPieza ? t("certificadoNumero", { numero: producto.numeroPieza }) : null,
    fecha ? t("terminada", { fecha }) : null,
  ].filter(Boolean).join(" ");
  const secciones = [
    { id: "la-pieza", titulo: t("laPieza"), parrafos: parrafos(traducir(producto.descripcionLarga, locale)) },
    { id: "origen", titulo: t("origen"), parrafos: parrafos(traducir(producto.origenMadera, locale)) },
    { id: "hecha-a-mano", titulo: t("proceso"), parrafos: parrafos(traducir(producto.proceso, locale)) },
    { id: "certificado", titulo: t("certificadoTitulo"), parrafos: tieneCertificado(producto) ? [textoCertificado] : [] },
  ].filter((s) => s.parrafos.length > 0);
  const migas = [
    { nombre: t("migaInicio"), url: urlAbsoluta("/", locale) },
    { nombre: t("migaColeccion"), url: urlAbsoluta("/coleccion", locale) },
    { nombre, url: urlAbsoluta(hrefPieza(slug), locale) },
  ];

  return (
    <main className="min-h-screen bg-stone-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(productoJsonLd(producto, locale, slug, imagenesLd))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(migasJsonLd(migas))} />

      <SiteNav />

      <nav aria-label={t("migasAria")} className="max-w-6xl mx-auto px-6 pt-12">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
          <li><Link href="/" className="hover:text-stone-900 underline-offset-4 hover:underline">{t("migaInicio")}</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link href="/coleccion" className="hover:text-stone-900 underline-offset-4 hover:underline">{t("migaColeccion")}</Link></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-stone-900">{nombre}</li>
        </ol>
      </nav>

      <ProductDetailClient producto={producto} />

      {secciones.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
          {secciones.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`}>
              <h2 id={`${s.id}-titulo`} className="text-2xl md:text-3xl font-nixie text-stone-900 mb-4">{s.titulo}</h2>
              <div className="space-y-4 text-stone-700 text-lg font-light leading-relaxed font-urbanist">
                {s.parrafos.map((texto, i) => <p key={i}>{texto}</p>)}
                {s.id === "origen" && (
                  <p>
                    <Link href="/materiales-y-procedencia" className="text-sm uppercase tracking-[0.2em] font-bold underline underline-offset-4 hover:text-amber-900">{t("verMateriales")}</Link>
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {relacionadas.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24" aria-labelledby="otras-piezas">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-stone-200 pt-12 mb-10">
            <h2 id="otras-piezas" className="text-2xl md:text-3xl font-nixie text-stone-900">{t("relacionadas")}</h2>
            <Link href="/coleccion" className="text-xs uppercase tracking-[0.2em] font-bold text-stone-700 underline underline-offset-4 hover:text-stone-950">{t("verColeccion")}</Link>
          </div>
          <ProductGallery productos={relacionadas} listName="relacionadas" />
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
