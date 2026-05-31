"use client";

import type { Producto } from "@/app/[locale]/lib/productos";
import { precioToNumber } from "@/app/[locale]/lib/precio";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
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

// Función para cargar datos de forma segura
function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // CORRECCIÓN: Inicializamos directamente con loadLines()
  // Esto evita el parpadeo de "carrito vacío" al cambiar de idioma.
  const [lines, setLines] = useState<CartLine[]>(() => loadLines());

  // Guardar en localStorage cada vez que lines cambie
  useEffect(() => {
    try {
      if (lines.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      }
    } catch (e) {
      console.error("No se pudo guardar el carrito:", e);
    }
  }, [lines]);

  const addItem = useCallback((producto: Producto) => {
    const precioUnit = precioToNumber(producto.precio);
    setLines((prev) => {
      // Si el producto ya está, no hacemos nada (pieza única)
      if (prev.some((l) => l.productId === producto.id)) return prev;

      return [
        ...prev,
        {
          productId: producto.id,
          nombre: producto.nombre,
          precioLabel: producto.precio,
          precioUnit,
          imagen: producto.imagen,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeLine = useCallback((productId: number) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setLineQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeLine(productId);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, quantity } : l))
    );
  }, [removeLine]);

  const clearCart = useCallback(() => setLines([]), []);

  const totalQuantity = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.precioUnit * l.quantity, 0), [lines]);

  const value = useMemo(() => ({
    lines,
    totalQuantity,
    subtotal,
    addItem,
    removeLine,
    setLineQuantity,
    clearCart,
  }), [lines, totalQuantity, subtotal, addItem, removeLine, setLineQuantity, clearCart]);

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