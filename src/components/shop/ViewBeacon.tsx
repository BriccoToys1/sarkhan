"use client";

import { useEffect } from "react";

/** Отправляет просмотр товара или работы в аналитику панели администратора. */
export function ViewBeacon({ kind, id }: { kind: "product" | "artwork"; id: string }) {
  useEffect(() => {
    const body = new Blob([JSON.stringify({ kind, id })], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/views", body)) fetch("/api/views", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [kind, id]);
  return null;
}
