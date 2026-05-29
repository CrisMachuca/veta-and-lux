"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation"; // 🌟 Importamos desde nuestro archivo del Paso 1
import { ChangeEvent, useTransition } from "react";

export function SelectorIdioma() {
  const locale = useLocale(); // Idioma actual ('es' o 'en')
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const cambiarIdioma = (event: ChangeEvent<HTMLSelectElement>) => {
    const siguienteLocale = event.target.value;
    
    // Cambia el prefijo de la URL de forma fluida conservando la ruta interna
    startTransition(() => {
      router.replace(pathname, { locale: siguienteLocale });
    });
  };

  return (
    <div className="relative inline-block text-left">
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={cambiarIdioma}
        className="bg-transparent text-stone-700 text-xs uppercase tracking-widest font-medium border-none cursor-pointer focus:outline-none focus:ring-0 py-1 pl-2 pr-4 opacity-80 hover:opacity-100 disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2378716c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:8px_auto] bg-[right_0_center] bg-no-repeat"
        title="Cambiar idioma"
      >
        <option value="es" className="text-stone-900 bg-white">ES</option>
        <option value="en" className="text-stone-900 bg-white">EN</option>
      </select>
    </div>
  );
}