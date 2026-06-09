"use client";

import { useCart } from "@/app/[locale]/components/cart-provider";
import { urlFor } from "@/sanity/lib/client"; 
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function ProductGallery({ productos, isHome = false }: { productos: any[], isHome?: boolean }) {
  const { addItem, lines } = useCart();
  const t = useTranslations("Gallery");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  function handleAdd(producto: any) {
    const imagenUrl = producto.imagen ? urlFor(producto.imagen).url() : "";
    const productoMapeado = { ...producto, id: producto._id, imagen: imagenUrl };

    addItem(productoMapeado);
    setAddedProductId(producto._id); 

    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = window.setTimeout(() => setAddedProductId(null), 1200);
  }

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return (
    <div className={`${isHome ? "flex md:grid md:grid-cols-3 gap-4 md:gap-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-4" : "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12"}`}>
      {productos.map((producto) => {
        const isAdded = lines.some(l => l.productId === producto._id);
        const isDisabled = producto.estado === "vendido" || producto.estado === "reservado" || isAdded;

        return (
          <article key={producto._id} className={`group flex flex-col h-full ${isHome ? "flex-none w-[75vw] md:w-auto snap-start" : ""}`}>
            <Link href={`/coleccion/${producto.slug}`} className="block rounded-xl md:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl md:rounded-2xl bg-stone-100 ring-1 ring-stone-200/50 shadow-sm transition-all duration-500 group-hover:shadow-md">
                {producto.imagen ? (
                  <img src={urlFor(producto.imagen).url()} alt={producto.nombre} className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] md:text-xs">{t("sin_imagen")}</div>
                )}
                
                {producto.estado && producto.estado !== "disponible" && (
  <div className={`
    absolute top-3 left-3 md:top-4 md:left-4 
    px-3 py-1 
    backdrop-blur-md 
    border 
    text-[9px] md:text-[10px] 
    uppercase tracking-[0.2em] font-bold 
    shadow-sm z-10
    ${producto.estado === "reservado" 
      ? "bg-amber-50/80 border-amber-200 text-amber-900" // Tono cálido para reservado
      : "bg-white/70 border-white/50 text-stone-900"     // Tono neutro para vendido
    }
  `}>
    {producto.estado === "reservado" ? t("estado_reservado") : t("estado_vendido")}
  </div>
)}
              </div>
            </Link>

            <div className="mt-4 flex flex-col flex-grow justify-between px-0.5">
              <div className="min-w-0">
                <h3 className="text-[11px] sm:text-xl font-bold text-stone-950 font-nixie leading-tight">
                  {producto.nombre}
                </h3>
                
                <p className="hidden sm:block text-stone-500 mt-2 text-sm line-clamp-2 font-urbanist min-h-[2.5em]">
                  {producto.descripcion}
                </p>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div className="flex flex-col gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] font-urbanist font-bold">
                  <Link href={`/coleccion/${producto.slug}`} className="text-stone-500 hover:text-stone-950 transition-colors underline underline-offset-4 w-fit">
                    {t("detalles")}
                  </Link>
                  
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleAdd(producto)}
                    className={`px-4 py-2 rounded-full border transition-all duration-300 w-fit ${
                      isDisabled 
                        ? "border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed" 
                        : "border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white cursor-pointer"
                    }`}
                  >
                    {producto.estado === "vendido" ? t("agotado") : producto.estado === "reservado" ? t("reservado") : isAdded ? t("anadido") : t("anadir")}
                  </button>
                </div>
                
                <span className="text-[13px] sm:text-[18px] font-medium text-stone-900 tracking-[0.05em] font-urbanist tabular-nums shrink-0">
  {producto.precio.toLocaleString()}
  <span className="text-[10px] ml-0.5 opacity-50 font-normal">EUR</span>
</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}