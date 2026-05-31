"use client";

import type { Producto } from "@/app/[locale]/lib/productos";
import { precioToNumber } from "@/app/[locale]/lib/precio";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "vetalux-carrito";

export type CartLine = {
  productId: number;
  nombre: string;
  precioLabel: string;
  precioUnit: number;
  imagen: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  totalQuantity: number;
  subtotal: number;
  addItem: (producto: Producto) => void;
  removeLine: (productId: number) => void;
  setLineQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is CartLine =>
        row &&
        typeof row === "object" &&
        typeof (row as CartLine).productId === "number" &&
        typeof (row as CartLine).quantity === "number" &&
        (row as CartLine).quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // Carga antes del pintado para que el primer clic en «Añadir al carrito» no sea
  // sobrescrito por el estado vacío inicial (useEffect corre después del pintado).
  useLayoutEffect(() => {
    setLines(loadLines());
    hydratedRef.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (lines.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      }
    } catch {
      /* ignore quota */
    }
  }, [lines, hydrated]);

  const addItem = useCallback((producto: Producto) => {
    const precioUnit = precioToNumber(producto.precio);
    setLines((prev) => {
      const base = hydratedRef.current ? prev : loadLines();
      const i = base.findIndex((l) => l.productId === producto.id);
      
      // CAMBIO AQUÍ: Si el producto ya existe (i >= 0), simplemente retornamos 'base'
      // sin modificar nada. Esto impide que la cantidad suba a 2 o más.
      if (i >= 0) {
        return base; 
      }

      // Si no existe, lo añadimos con cantidad 1 (garantizado)
      return [
        ...base,
        {
          productId: producto.id,
          nombre: producto.nombre,
          precioLabel: producto.precio,
          precioUnit,
          imagen: producto.imagen,
          quantity: 1, // Siempre será 1 para piezas únicas
        },
      ];
    });
    
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      setHydrated(true);
    }
  }, []);

  const removeLine = useCallback((productId: number) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setLineQuantity = useCallback((productId: number, quantity: number) => {
    const q = Math.max(0, Math.floor(quantity));
    if (q === 0) {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId ? { ...l, quantity: q } : l
      )
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const totalQuantity = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.precioUnit * l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      totalQuantity,
      subtotal,
      addItem,
      removeLine,
      setLineQuantity,
      clearCart,
    }),
    [
      lines,
      totalQuantity,
      subtotal,
      addItem,
      removeLine,
      setLineQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
