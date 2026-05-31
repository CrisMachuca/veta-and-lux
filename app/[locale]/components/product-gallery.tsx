"use client";

import { useCart } from "@/app/[locale]/components/cart-provider";
import { urlFor } from "@/sanity/lib/client"; 
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/**
 * @param isHome - Si es true, activa el efecto carrusel con peek en móvil.
 */
export function ProductGallery({ productos, isHome = false }: { productos: any[], isHome?: boolean }) {
  const { addItem, lines } = useCart();
  const t = useTranslations("Gallery");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  function handleAdd(producto: any) {
    const imagenUrl = producto.imagen ? urlFor(producto.imagen).url() : "";

    const productoMapeado = {
      ...producto,
      id: producto._id,        
      imagen: imagenUrl,       
    };

    addItem(productoMapeado);
    setAddedProductId(producto._id); 

    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  }

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`
      ${isHome 
        ? "flex md:grid md:grid-cols-3 gap-4 md:gap-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-4" 
        : "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12"}
    `}>
      {productos.map((producto) => {
        const isAdded = lines.some(l => l.productId === producto._id);
        const isDisabled = producto.estado === "vendido" || producto.estado === "reservado" || isAdded;

        return (
          <article 
            key={producto._id} 
            className={`group flex flex-col justify-between ${isHome ? "flex-none w-[75vw] md:w-auto snap-start" : ""}`}
          >
            <Link
              href={`/coleccion/${producto.slug}`}
              className="block rounded-xl md:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl md:rounded-2xl bg-stone-100 ring-1 ring-stone-200/50 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:ring-stone-300/80">
                {producto.imagen ? (
                  <img
                    src={urlFor(producto.imagen).url()} 
                    alt={producto.nombre}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] md:text-xs">
                    {t("sin_imagen")}
                  </div>
                )}
                
                {producto.estado && producto.estado !== "disponible" && (
                  <div className={`absolute top-1.5 right-1.5 md:top-4 md:right-4 backdrop-blur-md text-[8px] md:text-[10px] text-white uppercase tracking-wider md:tracking-widest px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-full font-medium shadow-sm z-10 transition-all ${
                    producto.estado === "reservado"
                      ? "bg-amber-800/90 border border-amber-600/30"
                      : "bg-stone-900/95 border border-stone-700/30"
                  }`}>
                    {producto.estado === "reservado" ? t("estado_reservado") : t("estado_vendido")}
                  </div>
                )}
              </div>
            </Link>

            <div className="mt-2 md:mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 md:gap-4 px-0.5">
              <div className="min-w-0">
                <h3 className="text-[11px] sm:text-xl font-medium text-stone-900 truncate sm:whitespace-normal">
                  {producto.nombre}
                </h3>
                
                <p className="hidden sm:block text-stone-500 mt-1 text-sm line-clamp-1">
                  {producto.descripcion}
                </p>
                
                <div className="mt-1 md:mt-4 flex flex-col gap-1 sm:flex-row sm:gap-4 text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest">
                  <Link
                    href={`/coleccion/${producto.slug}`}
                    className="text-stone-500 hover:text-stone-900 sm:text-stone-700 underline decoration-stone-300 sm:decoration-stone-400 underline-offset-2 md:underline-offset-4 hover:decoration-stone-900 transition-colors"
                  >
                    {t("detalles")}
                  </Link>
                  
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleAdd(producto)}
                    className={`text-left sm:text-center transition-all duration-300 font-medium ${
                      isDisabled 
                        ? "text-stone-400 cursor-not-allowed " + (producto.estado === "disponible" ? "" : "line-through")
                        : "cursor-pointer"
                    } ${
                      isAdded
                        ? "text-stone-900 underline decoration-stone-800 underline-offset-2 md:underline-offset-4 bg-stone-200/70 sm:px-2 sm:py-1 rounded-md"
                        : "text-stone-800 underline decoration-stone-300 sm:decoration-stone-400 underline-offset-2 md:underline-offset-4 hover:decoration-stone-900 hover:text-stone-900"
                    }`}
                  >
                    {producto.estado === "vendido"
                      ? t("agotado")
                      : producto.estado === "reservado"
                        ? t("reservado")
                        : isAdded
                          ? t("anadido")
                          : t("anadir")}
                  </button>
                </div>
              </div>
              
              <span className="text-[11px] sm:text-lg font-mono sm:font-light text-stone-950 shrink-0">
                {producto.precio}€
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}