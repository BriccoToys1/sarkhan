"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true после гидрации — для данных из localStorage (корзина). */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
