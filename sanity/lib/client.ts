import { createClient } from 'next-sanity';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'; // Corregido: Importación moderna recomendada
import type { ImagenSanity } from './tipos';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-24', // Versión estable de la API
  useCdn: false, // Puesta en false para actualizar stocks al instante sin caché
});

// Configuración moderna del generador de URLs para las imágenes de Sanity
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource | ImagenSanity) {
  return builder.image(source as SanityImageSource);
}