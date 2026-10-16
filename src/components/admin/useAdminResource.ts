"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch, refreshAdminCounts } from "@/lib/admin-client";
import { useAdminShell } from "@/app/admin/AdminShell";

export function useAdminResource<T extends { id: string }>(endpoint: string) {
  const shell = useAdminShell();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const notify = useCallback(
    (msg: string) => {
      setToast(msg);
      shell?.toast(msg);
    },
    [shell],
  );

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const url = q ? `${endpoint}?q=${encodeURIComponent(q)}` : endpoint;
      const res = await adminFetch(url);
      if (!res.ok) throw new Error("load failed");
      setItems(await res.json());
    } catch {
      notify("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, [endpoint, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (payload: Record<string, unknown>, id?: string | null) => {
    const res = await adminFetch(id ? `${endpoint}/${id}` : endpoint, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      notify(data.error || "Ошибка сохранения");
      return false;
    }
    notify("Сохранено");
    await load();
    refreshAdminCounts();
    return true;
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить запись?")) return false;
    const res = await adminFetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify("Не удалось удалить");
      return false;
    }
    notify("Удалено");
    await load();
    refreshAdminCounts();
    return true;
  };

  return { items, loading, load, save, remove, toast, setToast, notify };
}
