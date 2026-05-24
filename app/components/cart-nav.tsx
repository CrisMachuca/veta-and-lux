"use client";

import Link from "next/link";
import { useCart } from "@/app/components/cart-provider";
import { useEffect, useRef, useState } from "react";

export function CartNav() {
  const { totalQuantity } = useCart();
  const [isBouncing, setIsBouncing] = useState(false);
  const prevQuantityRef = useRef(totalQuantity);
  const bounceTimeoutRef = useRef<number | null>(null);

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
      className="text-stone-900 hover:text-stone-600 transition-colors"
    >
      <span
        className={`inline-block text-xs uppercase tracking-widest font-medium ${
          isBouncing ? "animate-bounce" : ""
        }`}
      >
        Carrito ({totalQuantity})
      </span>
    </Link>
  );
}
