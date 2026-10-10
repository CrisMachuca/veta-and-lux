"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProductGallery } from "@/app/[locale]/components/product-gallery";
import type { ProductoSanity } from "@/sanity/lib/tipos";

// Colección con un conmutador «Todas / Disponibles» que no crea URL nuevas.
// Arranca en «Todas», así el HTML del servidor enlaza todas las fichas (también las vendidas, que son archivo).
export function ColeccionFiltrable({ productos }: { productos: ProductoSanity[] }) {
  const t = useTranslations("Coleccion");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const disponibles = productos.filter((p) => p.estado !== "vendido" && p.estado !== "reservado");
  // Solo tiene sentido filtrar si hay de las dos clases
  const hayFiltro = disponibles.length > 0 && disponibles.length < productos.length;
  const visibles = hayFiltro && soloDisponibles ? disponibles : productos;

  const claseBoton = (activo: boolean) =>
    `px-5 py-2 text-[11px] font-medium uppercase tracking-wider rounded-lg transition-all ${
      activo ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
    }`;

  return (
    <>
      {hayFiltro && (
        <div role="group" aria-label={t("filtro.aria")} className="flex justify-center mb-10 md:mb-14">
          <div className="inline-flex gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/40 font-urbanist">
            <button type="button" aria-pressed={!soloDisponibles} onClick={() => setSoloDisponibles(false)} className={claseBoton(!soloDisponibles)}>
              {t("filtro.todas", { n: productos.length })}
            </button>
            <button type="button" aria-pressed={soloDisponibles} onClick={() => setSoloDisponibles(true)} className={claseBoton(soloDisponibles)}>
              {t("filtro.disponibles", { n: disponibles.length })}
            </button>
          </div>
        </div>
      )}
      <ProductGallery productos={visibles} listName={soloDisponibles ? "coleccion_disponibles" : "coleccion"} prioridad />
    </>
  );
}
