"use client";

import { CartProvider } from "@/app/[locale]/components/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
