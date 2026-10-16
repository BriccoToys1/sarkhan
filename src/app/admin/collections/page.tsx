"use client";

import { useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";

type Row = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  era?: string | null;
  excerpt: string;
  lore: string;
  coverImage: string;
  ambientPreset: string;
  ambientUrl?: string | null;
  sortOrder: number;
  status: string;
  _count?: { products: number };
};

const empty: Omit<Row, "id"> = {
  slug: "",
  title: "",
  subtitle: "",
  era: "",
  excerpt: "",
  lore: "",
  coverImage: "",
  ambientPreset: "default",
  ambientUrl: "",
  sortOrder: 0,
  status: "PUBLISHED",
};

export default function CollectionsPage() {
  const { items, loading, load, save, remove } = useAdminResource<Row>("/api/admin/collections");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const openEdit = (r?: Row) => {
    if (r) {
      setEditId(r.id);
      setForm({ ...r });
    } else {
      setEditId(null);
      setForm(empty);
    }
    setOpen(true);
  };

  const onSave = async () => {
    const ok = await save(
      {
        ...form,
        subtitle: form.subtitle || null,
        era: form.era || null,
        ambientUrl: form.ambientUrl || null,
        sortOrder: Number(form.sortOrder),
      },
      editId,
    );
    if (ok) setOpen(false);
  };

  return (
    <AdminPage
      title="Коллекции"
      count={items.length}
      actions={
        <>
          <button type="button" className="cms-iconbtn" onClick={() => load()}>
            <Icons.refresh size={16} />
          </button>
          <button type="button" className="cms-btn cms-btn-primary" onClick={() => openEdit()}>
            <Icons.plus size={14} /> Добавить
          </button>
        </>
      }
    >
      {loading ? (
        <div className="cms-loading">
          <div className="cms-spinner" />
        </div>
      ) : (
        <div className="cms-table-wrap">
          <table className="cms-table">
            <thead>
              <tr>
                <th />
                <th>Название</th>
                <th>Эра</th>
                <th>Товары</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.coverImage ? <img src={r.coverImage} alt="" className="cms-thumb" /> : null}</td>
                  <td>
                    <div>{r.title}</div>
                    <div className="cms-muted" style={{ fontSize: 12 }}>
                      {r.slug}
                    </div>
                  </td>
                  <td>{r.era || "—"}</td>
                  <td>{r._count?.products ?? 0}</td>
                  <td>
                    <span className={`cms-status cms-status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td>
                    <div className="cms-row-actions">
                      <button type="button" className="cms-iconbtn" onClick={() => openEdit(r)}>
                        <Icons.edit size={14} />
                      </button>
                      <button type="button" className="cms-iconbtn" onClick={() => remove(r.id)}>
                        <Icons.trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open ? (
        <div className="cms-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="cms-modal cms-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h2>{editId ? "Коллекция" : "Новая коллекция"}</h2>
              <button type="button" className="cms-iconbtn" onClick={() => setOpen(false)}>
                <Icons.close size={16} />
              </button>
            </div>
            <div className="cms-grid-2">
              <label className="cms-label">
                Название
                <input className="cms-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label className="cms-label">
                Slug
                <input className="cms-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </label>
              <label className="cms-label">
                Subtitle
                <input className="cms-input" value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </label>
              <label className="cms-label">
                Эра
                <input className="cms-input" value={form.era || ""} onChange={(e) => setForm({ ...form, era: e.target.value })} />
              </label>
              <label className="cms-label">
                Cover URL
                <input className="cms-input" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              </label>
              <label className="cms-label">
                Ambient preset
                <select className="cms-select" value={form.ambientPreset} onChange={(e) => setForm({ ...form, ambientPreset: e.target.value })}>
                  {["default", "lilith", "alchemy", "bestiary"].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="cms-label">
                Ambient URL
                <input className="cms-input" value={form.ambientUrl || ""} onChange={(e) => setForm({ ...form, ambientUrl: e.target.value })} />
              </label>
              <label className="cms-label">
                Статус
                <select className="cms-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </label>
            </div>
            <label className="cms-label">
              Excerpt
              <textarea className="cms-textarea" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </label>
            <label className="cms-label">
              Lore (Markdown)
              <textarea className="cms-textarea" rows={8} value={form.lore} onChange={(e) => setForm({ ...form, lore: e.target.value })} />
            </label>
            <div className="cms-modal-foot">
              <button type="button" className="cms-btn" onClick={() => setOpen(false)}>
                Отмена
              </button>
              <button type="button" className="cms-btn cms-btn-primary" onClick={onSave}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}
