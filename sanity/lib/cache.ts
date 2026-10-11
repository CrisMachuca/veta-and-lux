import { revalidateTag } from "next/cache";

// Caché de las páginas del catálogo (portada, colección, fichas, encargos y sitemap).
// Las consultas a Sanity se guardan como mucho 60 s y llevan esta etiqueta para poder
// invalidarlas al momento cuando cambia una pieza (venta, reserva, edición en el Studio).
export const ETIQUETA_PRODUCTOS = "productos";

export const CACHE_CATALOGO = { next: { revalidate: 60, tags: [ETIQUETA_PRODUCTOS] } };

// Journal: su etiqueta y la de productos (los artículos muestran piezas relacionadas)
export const ETIQUETA_JOURNAL = "journal";
export const CACHE_JOURNAL = { next: { revalidate: 60, tags: [ETIQUETA_JOURNAL, ETIQUETA_PRODUCTOS] } };

// Tras vender, reservar, liberar o editar una pieza: la siguiente visita ya ve el dato nuevo
// (expire: 0 = no se sirve la versión anterior mientras se regenera).
export function invalidarCatalogo() {
  revalidateTag(ETIQUETA_PRODUCTOS, { expire: 0 });
}

// Tras publicar o editar un artículo del Journal
export function invalidarJournal() {
  revalidateTag(ETIQUETA_JOURNAL, { expire: 0 });
}
