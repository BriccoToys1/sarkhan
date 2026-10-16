"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { ProductDTO } from "@/lib/types";
import { QuickViewModal } from "@/components/shop/QuickViewModal";

type QuickViewState = { open: (product: ProductDTO, trigger?: HTMLElement | null) => void; close: () => void };

const QuickViewContext = createContext<QuickViewState>({ open: () => {}, close: () => {} });

export const useQuickView = () => useContext(QuickViewContext);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const open = useCallback((p: ProductDTO, el?: HTMLElement | null) => {
    trigger.current = el ?? (document.activeElement as HTMLElement | null);
    setProduct(p);
    navigator.sendBeacon?.("/api/views", new Blob([JSON.stringify({ kind: "product", id: p.id })], { type: "application/json" }));
  }, []);

  const close = useCallback(() => setProduct(null), []);

  return (
    <QuickViewContext.Provider value={{ open, close }}>
      {children}
      <QuickViewModal product={product} onClose={close} onExitComplete={() => trigger.current?.focus({ preventScroll: true })} />
    </QuickViewContext.Provider>
  );
}
