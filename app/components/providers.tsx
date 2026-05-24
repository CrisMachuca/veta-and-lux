"use client";

import { CartProvider } from "@/app/components/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
