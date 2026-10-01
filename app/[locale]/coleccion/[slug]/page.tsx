export const dynamic = "force-dynamic";

import { Link } from "@/navigation"; 
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server"; 
import { ProductDetailClient } from "@/app/[locale]/components/product-detail-client";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { client, urlFor } from "@/sanity/lib/client"; 
import { ESTADO_EFECTIVO } from "@/sanity/lib/reservas";
import { Metadata } from "next";

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

// 🌟 NUEVO: Función para generar el SEO dinámico por cada producto e idioma
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;

  const query = `*[_type == "producto" && slug.current == $slug][0] {
    nombre,
    descripcion,
    imagen
  }`;

  const producto = await client.fetch(query, { slug }, { cache: "no-store" });

  if (!producto) {
    return {
      title: "Producto no encontrado | Veta & Lux",
    };
  }

  // Extraemos el nombre y descripción adaptados al idioma (locale)
  const nombreProducto = producto.nombre?.[locale] || producto.nombre?.es || "Lámpara artesanal";
  const descProducto = producto.descripcion?.[locale] || producto.descripcion?.es || "Descubre esta pieza única hecha a mano.";
  const imagenUrl = producto.imagen?.asset ? urlFor(producto.imagen).url() : undefined;

  return {
    title: `${nombreProducto} | Veta & Lux`,
    description: descProducto,
    openGraph: {
      title: `${nombreProducto} | Veta & Lux`,
      description: descProducto,
      images: imagenUrl ? [{ url: imagenUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${nombreProducto} | Veta & Lux`,
      description: descProducto,
      images: imagenUrl ? [imagenUrl] : [],
    },
  };
}

async function getProductoSanityBySlug(slug: string) {
  const query = `*[_type == "producto" && slug.current == $slug][0] {
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
    ${ESTADO_EFECTIVO}
  }`;

  return await client.fetch(query, { slug }, { cache: "no-store" });
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductoPage(props: PageProps) {
  const { slug, locale } = await props.params;
  
  const producto = await getProductoSanityBySlug(slug);

  if (!producto) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "FichaProducto" });

  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />
      
      <section className="max-w-6xl mx-auto px-6 pt-12">
        <p className="text-sm text-stone-500">
          <Link
            href="/coleccion"
            className="border-b border-stone-400 hover:text-stone-800 hover:border-stone-800 transition-colors"
          >
            {t("botonVolver")}
          </Link>
        </p>
      </section>
      
      <ProductDetailClient producto={producto} />
      
      <SiteFooter />
    </main>
  );
}