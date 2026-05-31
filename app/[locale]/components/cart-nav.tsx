"use client";

import Link from "next/link";
import { useCart } from "@/app/[locale]/components/cart-provider";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";

export function CartNav() {
  const { totalQuantity } = useCart();
  const [isBouncing, setIsBouncing] = useState(false);
  const [mounted, setMounted] = useState(false); // Estado para evitar hidratación incorrecta
  const prevQuantityRef = useRef(totalQuantity);
  const bounceTimeoutRef = useRef<number | null>(null);

  // 1. Efecto para marcar el componente como montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Lógica de animación
  useEffect(() => {
    if (totalQuantity > prevQuantityRef.current) {
      setIsBouncing(true);
      if (bounceTimeoutRef.current) {
        window.clearTimeout(bounceTimeoutRef.current);
      }
      bounceTimeoutRef.current = window.setTimeout(() => {
        setIsBouncing(false);
      }, 450);
    }
    prevQuantityRef.current = totalQuantity;
  }, [totalQuantity]);

  // Limpieza del timeout
  useEffect(() => {
    return () => {
      if (bounceTimeoutRef.current) {
        window.clearTimeout(bounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Link
      href="/carrito"
      className="relative flex items-center justify-center p-2 text-stone-900 hover:text-stone-600 transition-colors"
      aria-label="Carrito de compra"
    >
      <div className={isBouncing ? "animate-bounce" : ""}>
        {/* Icono de bolsa de la compra */}
        <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
        
        {/* SOLUCIÓN: Solo renderizamos el contador cuando 'mounted' sea true.
           Esto asegura que el servidor (que no tiene localStorage) y el cliente 
           coincidan en el primer renderizado.
        */}
        {mounted && totalQuantity > 0 && (
          <span className="absolute -top-1 -right-0.5 bg-stone-900 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
            {totalQuantity}
          </span>
        )}
      </div>
    </Link>
  );
}