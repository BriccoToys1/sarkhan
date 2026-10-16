"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPage } from "../AdminPage";
import { Icons } from "@/components/admin/icons";
import { adminFetch } from "@/lib/admin-client";
import { useAdminShell } from "../AdminShell";

type MediaItem = { name: string; url: string; size: number; mtime: string };

export default function MediaPage() {
  const shell = useAdminShell();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/media");
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await adminFetch("/api/admin/media", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          shell?.toast(data.error || "Ошибка загрузки");
          break;
        }
        shell?.toast(`Загружено: ${data.url}`);
        await navigator.clipboard?.writeText(data.url).catch(() => undefined);
      }
      await load();
    } finally {
      setUploading(false);
    }
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    shell?.toast("URL скопирован");
  };

  return (
    <AdminPage
      title="Медиа"
      count={items.length}
      actions={
        <button type="button" className="cms-iconbtn" onClick={() => load()}>
          <Icons.refresh size={16} />
        </button>
      }
    >
      <label className="cms-dropzone">
        <Icons.attach size={18} /> {uploading ? "Загрузка…" : "Перетащите файл или нажмите для выбора"}
        <input
          type="file"
          multiple
          accept="image/*,audio/*"
          style={{ display: "none" }}
          onChange={(e) => upload(e.target.files)}
        />
      </label>

      {loading ? (
        <div className="cms-loading">
          <div className="cms-spinner" />
        </div>
      ) : (
        <div className="cms-media-grid">
          {items.map((m) => (
            <button key={m.name} type="button" className="cms-media-item" onClick={() => copy(m.url)} title="Скопировать URL">
              {m.url.match(/\.(mp3|wav|ogg|m4a)$/i) ? (
                <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--cms-accent)" }}>
                  <Icons.attach size={28} />
                </div>
              ) : (
                <img src={m.url} alt={m.name} />
              )}
              <span>
                {m.name}
                <br />
                {(m.size / 1024).toFixed(0)} KB
              </span>
            </button>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
