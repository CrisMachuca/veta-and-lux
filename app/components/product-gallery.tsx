"use client";

import { useCart } from "@/app/components/cart-provider";
import { urlFor } from "@/sanity/lib/client"; 
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function ProductGallery({ productos }: { productos: any[] }) {
  const { addItem } = useCart();
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
    /* 🌟 MEJORA 1: Grid dinámico. grid-cols-3 en móvil, cambia a 2 en tablets y 3 grandes en PC. 
       El espacio (gap) se reduce en móvil para maximizar el tamaño de las imágenes. */
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12">
      {productos.map((producto) => (
        <article key={producto._id} className="group flex flex-col justify-between">
          <Link
            href={`/coleccion/${producto.slug}`}
            className="block rounded-xl md:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          >
            {/* Contenedor relativo de la imagen (mantiene la proporción 4/5 elegante) */}
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
                  Sin imagen
                </div>
              )}
              
              {/* ✨ ETIQUETA FLOTANTE ADAPTADA: Se hace más compacta en móviles para no devorar la foto */}
              {producto.estado && producto.estado !== "disponible" && (
                <div className={`absolute top-1.5 right-1.5 md:top-4 md:right-4 backdrop-blur-md text-[8px] md:text-[10px] text-white uppercase tracking-wider md:tracking-widest px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-full font-medium shadow-sm z-10 transition-all ${
                  producto.estado === "reservado"
                    ? "bg-amber-800/90 border border-amber-600/30"
                    : "bg-stone-900/95 border border-stone-700/30"
                }`}>
                  {producto.estado === "reservado" ? "Reservada" : "Vendida"}
                </div>
              )}
            </div>
          </Link>

          {/* MEJORA 2: Área de textos. Cambiamos flex-row a flex-col en móviles para que el precio no empuje al texto */}
          <div className="mt-2 md:mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 md:gap-4 px-0.5">
            <div className="min-w-0">
              {/* Título adaptado a tamaño minúsculo en móvil para que no se corte bruscamente */}
              <h3 className="text-[11px] sm:text-xl font-medium text-stone-900 truncate sm:whitespace-normal">
                {producto.nombre}
              </h3>
              
              {/* La descripción detallada se oculta en móviles de 3 columnas para mantener la rejilla limpia */}
              <p className="hidden sm:block text-stone-500 mt-1 text-sm line-clamp-1">
                {producto.descripcion}
              </p>
              
              {/* MEJORA 3: Enlaces y Botón de añadir adaptados a tamaño micro en móviles */}
              <div className="mt-1 md:mt-4 flex flex-col gap-1 sm:flex-row sm:gap-4 text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest">
                <Link
                  href={`/coleccion/${producto.slug}`}
                  className="text-stone-500 hover:text-stone-900 sm:text-stone-700 underline decoration-stone-300 sm:decoration-stone-400 underline-offset-2 md:underline-offset-4 hover:decoration-stone-900 transition-colors"
                >
                  Detalles
                </Link>
                
                <button
                  type="button"
                  disabled={producto.estado === "vendido" || producto.estado === "reservado"}
                  onClick={() => handleAdd(producto)}
                  className={`text-left sm:text-center transition-all duration-300 font-medium ${
                    producto.estado === "vendido" || producto.estado === "reservado"
                      ? "text-stone-400 cursor-not-allowed line-through"
                      : "cursor-pointer"
                  } ${
                    addedProductId === producto._id
                      ? "text-stone-900 underline decoration-stone-800 underline-offset-2 md:underline-offset-4 bg-stone-200/70 sm:px-2 sm:py-1 rounded-md"
                      : producto.estado !== "vendido" && producto.estado !== "reservado"
                        ? "text-stone-800 underline decoration-stone-300 sm:decoration-stone-400 underline-offset-2 md:underline-offset-4 hover:decoration-stone-900 hover:text-stone-900"
                        : ""
                  }`}
                >
                  {producto.estado === "vendido"
                    ? "Agotado"
                    : producto.estado === "reservado"
                      ? "Reservado"
                      : addedProductId === producto._id
                        ? "✓ Añadido"
                        : "Añadir"}
                </button>
              </div>
            </div>
            
            {/* Precio destacado, tipografía sutil en móviles */}
            <span className="text-[11px] sm:text-lg font-mono sm:font-light text-stone-950 shrink-0">
              {producto.precio}€
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}