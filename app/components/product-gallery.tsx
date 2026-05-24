"use client";

import { useCart } from "@/app/components/cart-provider";
import { urlFor } from "@/sanity/lib/client"; // Importamos urlFor para procesar las imágenes de Sanity
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function ProductGallery({ productos }: { productos: any[] }) {
  const { addItem } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  function handleAdd(producto: any) {
    // Generamos la URL real optimizada de Sanity para que el carrito la entienda como texto plano
    const imagenUrl = producto.imagen ? urlFor(producto.imagen).url() : "";

    const productoMapeado = {
      ...producto,
      id: producto._id,       // Mapeamos _id a id para la estructura interna de tu carrito
      imagen: imagenUrl,      // Reemplazamos el objeto de Sanity por la URL de texto real
    };

    addItem(productoMapeado);
    setAddedProductId(producto._id); // Usamos el ._id dinámico de Sanity

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {productos.map((producto) => (
        <article key={producto._id} className="group">
          <Link
            href={`/coleccion/${producto.slug}`}
            className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/50 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:ring-stone-300/80">
              {producto.imagen ? (
                <img
                  src={urlFor(producto.imagen).url()} // Corregido: Renderiza la URL real desde la CDN de Sanity
                  alt={producto.nombre}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                  Sin imagen disponible
                </div>
              )}
              
              {/* Etiqueta de estado si la pieza no está disponible */}
              {producto.estado && producto.estado !== "disponible" && (
                <div className="absolute top-4 right-4 bg-stone-900/95 backdrop-blur-sm text-[10px] text-stone-100 uppercase tracking-widest px-3 py-1.5 rounded-full font-medium shadow-sm">
                  {producto.estado === "reservado" ? "Reservada" : "Vendida"}
                </div>
              )}
            </div>
          </Link>

          <div className="mt-6 flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-medium text-stone-900">
                {producto.nombre}
              </h3>
              <p className="text-stone-500 mt-1 text-sm line-clamp-1">
                {producto.descripcion}
              </p>
              
              <div className="mt-4 flex gap-4 text-xs uppercase tracking-widest">
                <Link
                  href={`/coleccion/${producto.slug}`}
                  className="text-stone-700 underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900 hover:text-stone-900 transition-colors"
                >
                  Ver detalles
                </Link>
                
                <button
                  type="button"
                  disabled={producto.estado === "vendido"}
                  onClick={() => handleAdd(producto)}
                  className={`transition-all duration-300 font-medium ${
                    producto.estado === "vendido"
                      ? "text-stone-400 cursor-not-allowed line-through"
                      : "cursor-pointer"
                  } ${
                    addedProductId === producto._id
                      ? "text-stone-900 underline decoration-stone-800 underline-offset-4 bg-stone-200/70 px-2 py-1 rounded-md shadow-sm"
                      : producto.estado !== "vendido"
                        ? "text-stone-800 underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900 hover:text-stone-900"
                        : ""
                  }`}
                >
                  {producto.estado === "vendido"
                    ? "Agotado"
                    : addedProductId === producto._id
                      ? "Añadido al carrito"
                      : "Añadir al carrito"}
                </button>
              </div>
            </div>
            
            <span className="text-lg font-light text-stone-900 shrink-0">
              {producto.precio}€
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}