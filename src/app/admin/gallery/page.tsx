"use client";

import { useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";

type Row = {
  id: string;
  slug: string;
  title: string;
  year?: number | null;
  materials: string;
  dimensions?: string | null;
  description: string;
  image: string;
  imageHiRes?: string | null;
  audioUrl?: string | null;
  audioTranscript?: string | null;
  productId?: string | null;
  sortOrder: number;
  status: string;
  views: number;
};

const empty: Omit<Row, "id" | "views"> = {
  slug: "",
  title: "",
  year: null,
  materials: "",
  dimensions: "",
  description: "",
  image: "",
  imageHiRes: "",
  audioUrl: "",
  audioTranscript: "",
  productId: null,
  sortOrder: 0,
  status: "PUBLISHED",
};

export default function GalleryAdminPage() {
  const { items, loading, load, save, remove } = useAdminResource<Row>("/api/admin/gallery");
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
        year: form.year == null || form.year === ("" as never) ? null : Number(form.year),
        dimensions: form.dimensions || null,
        imageHiRes: form.imageHiRes || null,
        audioUrl: form.audioUrl || null,
        audioTranscript: form.audioTranscript || null,
        productId: form.productId || null,
        sortOrder: Number(form.sortOrder),
      },
      editId,
    );
    if (ok) setOpen(false);
  };

  return (
    <AdminPage
      title="Галерея"
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
                <th>Работа</th>
                <th>Год</th>
                <th>Просмотры</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.image ? <img src={r.image} alt="" className="cms-thumb" /> : null}</td>
                  <td>
                    <div>{r.title}</div>
                    <div className="cms-muted" style={{ fontSize: 12 }}>
                      {r.materials}
                    </div>
                  </td>
                  <td>{r.year ?? "—"}</td>
                  <td>{r.views}</td>
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
              <h2>{editId ? "Работа" : "Новая работа"}</h2>
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
                Год
                <input
                  type="number"
                  className="cms-input"
                  value={form.year ?? ""}
                  onChange={(e) => setForm({ ...form, year: e.target.value ? Number(e.target.value) : null })}
                />
              </label>
              <label className="cms-label">
                Материалы
                <input className="cms-input" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
              </label>
              <label className="cms-label">
                Размеры
                <input className="cms-input" value={form.dimensions || ""} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} />
              </label>
              <label className="cms-label">
                Image
                <input className="cms-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </label>
              <label className="cms-label">
                Hi-res
                <input className="cms-input" value={form.imageHiRes || ""} onChange={(e) => setForm({ ...form, imageHiRes: e.target.value })} />
              </label>
              <label className="cms-label">
                Audio URL
                <input className="cms-input" value={form.audioUrl || ""} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} />
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
              Описание (Markdown)
              <textarea className="cms-textarea" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="cms-label">
              Транскрипт аудиогида
              <textarea className="cms-textarea" rows={3} value={form.audioTranscript || ""} onChange={(e) => setForm({ ...form, audioTranscript: e.target.value })} />
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
