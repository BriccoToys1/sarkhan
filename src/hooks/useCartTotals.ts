"use client";

import { useMemo } from "react";
import { useCart } from "@/store/cart";
import { calculateTotals } from "@/lib/pricing";

export function useCartTotals() {
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const method = useCart((s) => s.shippingMethod);
  return useMemo(() => calculateTotals(lines, method, promo), [lines, method, promo]);
}
