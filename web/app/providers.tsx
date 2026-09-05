"use client";

import { type ReactNode } from "react";
import { AosProvider } from "@/components/animation/aos-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AosProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </AosProvider>
  );
}
