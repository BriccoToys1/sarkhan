"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "@/store/cart";

/** true, когда корзина восстановлена из localStorage. */
export function useCartReady() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}
