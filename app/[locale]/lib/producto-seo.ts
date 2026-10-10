// Nombre, título, descripción y datos estructurados de una pieza: la misma lógica para la ficha,
// los metadatos (title/description) y el JSON-LD.
import { traducir, type EstadoPieza, type ProductoSanity, type TipoLampara } from "@/sanity/lib/tipos";
import { COSTES_ENVIO } from "@/app/[locale]/lib/envio";
import { SITE_URL } from "@/app/[locale]/lib/sitio";

const ETIQUETAS_TIPO: Record<TipoLampara, { es: string; en: string }> = {
  sobremesa: { es: "Lámpara de sobremesa", en: "Table lamp" },
  colgante: { es: "Lámpara colgante", en: "Pendant lamp" },
  pie: { es: "Lámpara de pie", en: "Floor lamp" },
  aplique: { es: "Aplique de pared", en: "Wall light" },
  otra: { es: "Lámpara", en: "Lamp" },
};

const idioma = (locale: string) => (locale === "en" ? "en" : "es");

export function etiquetaTipo(tipo: TipoLampara | undefined, locale: string) {
  return tipo ? ETIQUETAS_TIPO[tipo]?.[idioma(locale)] : undefined;
}

// Nombre visible (H1, alt de las fotos). Si la pieza aún no tiene nombre en Sanity, uno genérico en vez de vacío.
export function nombreProducto(p: ProductoSanity, locale: string) {
  return traducir(p.nombre, locale)?.trim() || etiquetaTipo(p.tipo, locale) || (idioma(locale) === "en" ? "Handcrafted wooden lamp" : "Lámpara artesanal de madera");
}

// Título para buscadores: «Nombre · Lámpara de sobremesa» (la plantilla del layout añade «| Veta & Lux»)
export function tituloProducto(p: ProductoSanity, locale: string) {
  const nombre = nombreProducto(p, locale);
  const tipo = etiquetaTipo(p.tipo, locale);
  return tipo && tipo !== nombre ? `${nombre} · ${tipo}` : nombre;
}

function recortar(texto: string, max = 155) {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "")}…`;
}

// Metadescripción: la descripción corta solo si dice algo (≥ 70 caracteres); si no, la larga recortada.
export function descripcionProducto(p: ProductoSanity, locale: string) {
  const corta = traducir(p.descripcion, locale)?.trim() || "";
  const larga = traducir(p.descripcionLarga, locale)?.trim() || "";
  if (corta.length >= 70) return recortar(corta);
  if (larga) return recortar(larga);
  if (corta) return corta;
  return idioma(locale) === "en"
    ? "One-of-a-kind wooden lamp, handmade in our workshop in Malaga, Spain."
    : "Lámpara de madera única, hecha a mano en nuestro taller de Málaga.";
}

const DISPONIBILIDAD: Record<EstadoPieza, string> = {
  disponible: "https://schema.org/InStock",
  reservado: "https://schema.org/OutOfStock", // reservada 48 h a la espera de una transferencia
  vendido: "https://schema.org/SoldOut",
};

export const ID_DEVOLUCIONES = `${SITE_URL}/#politica-devoluciones`;

// Devoluciones: 14 días, por mensajería, envío de vuelta a cargo del cliente (páginas de envíos y condiciones).
export const POLITICA_DEVOLUCIONES = {
  "@type": "MerchantReturnPolicy",
  "@id": ID_DEVOLUCIONES,
  applicableCountry: ["ES", "FR", "IT", "DE", "PT"],
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
};

// Envíos marcables: Google solo admite regiones dentro de un país en EE. UU., Australia y Japón,
// así que España (gratis en Península, 25 € en islas) no se puede expresar con una sola tarifa:
// se configura en Merchant Center. Se marcan los países con tarifa única.
const ENVIOS_MARCADOS = ["FR", "IT", "DE", "PT"].map((pais) => ({
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: COSTES_ENVIO.internacional, currency: "EUR" },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: pais },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
  },
}));

export function productoJsonLd(p: ProductoSanity, locale: string, slug: string, imagenes: string[]) {
  const url = `${SITE_URL}/${idioma(locale)}/coleccion/${slug}`;
  const material = traducir(p.materialBase, locale);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tituloProducto(p, locale),
    description: descripcionProducto(p, locale),
    image: imagenes,
    sku: slug,
    brand: { "@type": "Brand", name: "Veta & Lux" },
    ...(material ? { material } : {}),
    offers: {
      "@type": "Offer",
      url,
      price: p.precio,
      priceCurrency: "EUR",
      availability: DISPONIBILIDAD[p.estado ?? "disponible"],
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: ENVIOS_MARCADOS,
      hasMerchantReturnPolicy: POLITICA_DEVOLUCIONES,
    },
  };
}

export function migasJsonLd(migas: { nombre: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nombre, item: m.url })),
  };
}

export function organizacionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organizacion`,
    name: "Veta & Lux",
    url: SITE_URL,
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    email: "info@vetandlux.com",
    address: { "@type": "PostalAddress", addressLocality: "Málaga", addressCountry: "ES" },
    founder: [
      { "@type": "Person", name: "Cristina" },
      { "@type": "Person", name: "Rafa" },
    ],
    hasMerchantReturnPolicy: POLITICA_DEVOLUCIONES,
  };
}

// Inserta un objeto JSON-LD en un <script> sin permitir cerrar la etiqueta desde los datos
export function jsonLdHtml(datos: object) {
  return { __html: JSON.stringify(datos).replace(/</g, "\\u003c") };
}

// Orden del catálogo: primero lo que se puede comprar
const ORDEN_ESTADO: Record<EstadoPieza, number> = { disponible: 0, reservado: 1, vendido: 2 };
export function ordenarPorDisponibilidad<T extends { estado?: EstadoPieza }>(piezas: T[]) {
  return [...piezas].sort((a, b) => ORDEN_ESTADO[a.estado ?? "disponible"] - ORDEN_ESTADO[b.estado ?? "disponible"]);
}
