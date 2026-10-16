"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Availability, ProductDTO, ProductType, PromoRule, ShippingMethod } from "@/lib/types";

export type CartLine = {
  productId: string;
  sku: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  type: ProductType;
  availability: Availability;
  stock: number;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  promo: PromoRule | null;
  shippingMethod: ShippingMethod;
  isOpen: boolean;
  add: (product: ProductDTO, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setPromo: (promo: PromoRule | null) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  open: () => void;
  close: () => void;
  sync: (fresh: FreshProduct[]) => void;
};

export type FreshProduct = Pick<CartLine, "price" | "title" | "stock" | "availability" | "type" | "slug"> & {
  id: string;
  image: string | null;
};

export function lineLimit(line: Pick<CartLine, "availability" | "stock">) {
  if (line.availability === "SOLD_OUT") return 0;
  if (line.availability === "PRE_ORDER") return 99;
  return Math.min(99, line.stock);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promo: null,
      shippingMethod: "STANDARD",
      isOpen: false,
      add: (product, quantity = 1) => {
        const existing = get().lines.find((l) => l.productId === product.id);
        const base: CartLine = existing ?? {
          productId: product.id,
          sku: product.sku,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.images[0],
          type: product.type,
          availability: product.availability,
          stock: product.stock,
          quantity: 0,
        };
        const limit = lineLimit({ availability: product.availability, stock: product.stock });
        const next = Math.min(limit, base.quantity + quantity);
        if (next <= 0) return;
        const line = { ...base, price: product.price, stock: product.stock, availability: product.availability, quantity: next };
        set((s) => ({
          lines: existing ? s.lines.map((l) => (l.productId === product.id ? line : l)) : [...s.lines, line],
          isOpen: true,
        }));
      },
      setQuantity: (productId, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.productId === productId ? { ...l, quantity: Math.min(lineLimit(l), quantity) } : l))
            .filter((l) => l.quantity > 0),
        })),
      remove: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [], promo: null }),
      setPromo: (promo) => set({ promo }),
      setShippingMethod: (shippingMethod) => set({ shippingMethod }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      sync: (fresh) =>
        set((s) => ({
          lines: s.lines
            .map((l) => {
              const f = fresh.find((p) => p.id === l.productId);
              if (!f) return null;
              const merged: CartLine = {
                ...l,
                price: f.price,
                title: f.title,
                stock: f.stock,
                availability: f.availability,
                type: f.type,
                slug: f.slug,
                image: f.image ?? l.image,
              };
              return { ...merged, quantity: Math.min(lineLimit(merged), l.quantity) };
            })
            .filter((l): l is CartLine => l !== null && l.quantity > 0),
        })),
    }),
    {
      name: "sarkhan-grim-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, promo: s.promo, shippingMethod: s.shippingMethod }),
      skipHydration: true,
    },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
