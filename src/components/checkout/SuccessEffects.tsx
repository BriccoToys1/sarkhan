"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Очищает корзину и, пока сеть не подтвердила крипто-перевод, периодически обновляет статус. */
export function SuccessEffects({ orderId, token, pending }: { orderId: string; token: string; pending: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const clear = () => useCart.getState().clear();
    if (useCart.persist.hasHydrated()) clear();
    return useCart.persist.onFinishHydration(clear);
  }, []);

  useEffect(() => {
    if (!pending) return;
    const t = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/confirm`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
        const data = (await res.json()) as { status?: string };
        if (data.status && data.status !== "PENDING") router.refresh();
      } catch {}
    }, 8000);
    return () => window.clearInterval(t);
  }, [pending, orderId, token, router]);

  return null;
}
