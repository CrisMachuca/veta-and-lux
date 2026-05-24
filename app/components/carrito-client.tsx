"use client";

import Link from "next/link";
import { useCart } from "@/app/components/cart-provider";
import { formatEUR } from "@/app/lib/precio";

export function CarritoClient() {
  const { lines, subtotal, setLineQuantity, removeLine, clearCart } = useCart();

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-10 md:p-14 text-center ring-1 ring-stone-100">
        <p className="text-stone-600 leading-relaxed mb-6">
          Tu carrito está vacío. Explora la colección y añade piezas que te
          inspiren.
        </p>
        <Link
          href="/coleccion"
          className="inline-block rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-sm uppercase tracking-widest hover:bg-stone-800 transition-colors"
        >
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <ul className="space-y-6">
        {lines.map((line) => (
          <li
            key={line.productId}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-stone-200/80 bg-white/80 p-4 sm:p-5 ring-1 ring-stone-100"
          >
            <div className="shrink-0 w-full sm:w-28 aspect-[4/5] sm:aspect-square overflow-hidden rounded-xl bg-stone-100">
              <img
                src={line.imagen}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-stone-900">
                  {line.nombre}
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  {line.precioLabel} / unidad
                </p>
              </div>
              <div className="flex flex-col items-stretch sm:items-end gap-3">
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`qty-${line.productId}`}>
                    Cantidad para {line.nombre}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setLineQuantity(line.productId, line.quantity - 1)
                    }
                    className="h-10 w-10 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-lg leading-none"
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <input
                    id={`qty-${line.productId}`}
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) =>
                      setLineQuantity(
                        line.productId,
                        parseInt(e.target.value, 10) || 1
                      )
                    }
                    className="w-14 text-center rounded-lg border border-stone-200 py-2 text-stone-900 tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setLineQuantity(line.productId, line.quantity + 1)
                    }
                    className="h-10 w-10 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-lg leading-none"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <p className="text-stone-900 font-medium tabular-nums">
                  {formatEUR(line.precioUnit * line.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeLine(line.productId)}
                  className="text-sm text-stone-500 hover:text-stone-900 underline decoration-stone-300 underline-offset-2 self-start sm:self-end"
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-stone-200/80 bg-stone-100/40 p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-sm uppercase tracking-widest text-stone-500">
            Subtotal
          </span>
          <span className="text-2xl font-light text-stone-900 tabular-nums">
            {formatEUR(subtotal)}
          </span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          Los envíos y plazos los concretamos por email. Este total es orientativo
          según las piezas seleccionadas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-stone-600 hover:text-stone-900 underline decoration-stone-300 underline-offset-2 order-2 sm:order-1"
          >
            Vaciar carrito
          </button>
          <Link
            href="/contacto"
            className="order-1 sm:order-2 inline-flex justify-center rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-sm uppercase tracking-widest hover:bg-stone-800 transition-colors"
          >
            Solicitar pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
