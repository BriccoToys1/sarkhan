"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";
import { AmbientProvider } from "./Ambient";
import { CustomCursor } from "./CustomCursor";
import { PageTransition } from "./PageTransition";
import { QuickViewProvider } from "./QuickView";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AmbientControl } from "@/components/layout/AmbientControl";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    useCart.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === useCart.persist.getOptions().name) useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

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
