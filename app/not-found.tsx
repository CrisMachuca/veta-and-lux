import Link from "next/link";
import "@/app/[locale]/globals.css";

// 404 fuera de /es y /en (p. ej. un idioma que no existe). Las de la web usan app/[locale]/not-found.tsx.
export default function NoEncontradaGlobal() {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#fcfaf8] text-[#3a3530] antialiased flex items-center justify-center px-6 text-center">
        <title>Página no encontrada | Veta & Lux</title>
        <main className="space-y-6">
          <h1 className="text-4xl">Página no encontrada</h1>
          <p>
            <Link href="/es" className="underline underline-offset-4">Ir a la portada</Link>
            {" · "}
            <Link href="/en" lang="en" className="underline underline-offset-4">Go to the home page</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
