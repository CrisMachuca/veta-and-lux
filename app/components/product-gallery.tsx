"use client";

import { useCart } from "@/app/components/cart-provider";
import type { Producto } from "@/app/lib/productos";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type { Producto };

export function ProductGallery({ productos }: { productos: Producto[] }) {
  const { addItem } = useCart();
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  function handleAdd(producto: Producto) {
    addItem(producto);
    setAddedProductId(producto.id);
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
        <article key={producto.id} className="group">
          <Link
            href={`/coleccion/${producto.slug}`}
            className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
            aria-label={`Ver detalles de ${producto.nombre}`}
          >
            <div className="aspect-[4/5] overflow-hidden bg-stone-100 rounded-2xl mb-6 ring-1 ring-stone-200/80 shadow-sm">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Link>

          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-medium text-stone-900">{producto.nombre}</h3>
              <p className="text-stone-500 mt-1">{producto.descripcion}</p>
              <div className="mt-4 flex gap-4 text-xs uppercase tracking-widest">
                <Link
                  href={`/coleccion/${producto.slug}`}
                  className="text-stone-700 underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900 hover:text-stone-900 transition-colors"
                >
                  Ver detalles
                </Link>
                <button
                  type="button"
                  onClick={() => handleAdd(producto)}
                  className={`cursor-pointer transition-all duration-300 ${
                    addedProductId === producto.id
                      ? "text-stone-900 underline decoration-amber-700/60 underline-offset-4 bg-stone-200/70 px-2 py-1 rounded-md shadow-sm"
                      : "text-stone-800 underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900 hover:text-stone-900"
                  }`}
                >
                  {addedProductId === producto.id ? "Añadido al carrito" : "Añadir al carrito"}
                </button>
              </div>
            </div>
            <span className="text-lg font-light text-stone-900 shrink-0">{producto.precio}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
