import { notFound } from "next/navigation";

// Cualquier ruta inexistente dentro de /es o /en muestra la 404 propia (app/[locale]/not-found.tsx)
// en vez de la genérica de Next, que no tiene idioma, menú ni enlaces.
export default function RutaInexistente() {
  notFound();
}
