// Piezas cuya dirección web ha cambiado: dirección antigua → nueva.
// La ficha redirige con 308 (permanente) solo cuando la antigua ya no existe en Sanity,
// así que da igual cambiar primero el slug en el Studio o desplegar primero este archivo.
export const SLUGS_RENOMBRADOS: Record<string, string> = {
  // Era de eucalipto, no de olivo (octubre de 2026)
  "olivo-a-la-deriva": "eucalipto-a-la-deriva",
};
