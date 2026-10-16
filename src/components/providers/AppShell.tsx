"use client";

import { useEffect, type ReactNode } from "react";
import { useCart } from "@/store/cart";
import { AmbientProvider } from "./Ambient";
import { CustomCursor } from "./CustomCursor";
import { PageTransition } from "./PageTransition";
import { QuickViewProvider } from "./QuickView";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AmbientControl } from "@/components/layout/AmbientControl";

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    useCart.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === useCart.persist.getOptions().name) useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AmbientProvider>
      <PageTransition>
        <QuickViewProvider>
          {children}
          <CartDrawer />
          <AmbientControl />
        </QuickViewProvider>
      </PageTransition>
      <CustomCursor />
    </AmbientProvider>
  );
}
