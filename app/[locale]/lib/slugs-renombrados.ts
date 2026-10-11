// Piezas cuya dirección web ha cambiado: dirección antigua → nueva.
// next.config.ts las redirige con 308 (permanente) en los dos idiomas.
// Al renombrar una pieza: añadir aquí la entrada, desplegar y entonces cambiar el slug en el Studio.
// (No se redirige desde la página: en caché, Next guardaba el 308 sin la cabecera Location.)
export const SLUGS_RENOMBRADOS: Record<string, string> = {
  // Era de eucalipto, no de olivo (octubre de 2026)
  "olivo-a-la-deriva": "eucalipto-a-la-deriva",
};
