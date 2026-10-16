"use client";

import { useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  rubric: string;
  coverImage?: string | null;
  author: string;
  readingTime: number;
  status: string;
  publishedAt: string;
};

const empty: Omit<Row, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  rubric: "STUDIO_NEWS",
  coverImage: "",
  author: "Сархан Грим",
  readingTime: 5,
  status: "PUBLISHED",
  publishedAt: new Date().toISOString(),
};

export default function JournalAdminPage() {
  const { items, loading, load, save, remove } = useAdminResource<Row>("/api/admin/journal");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const openEdit = (r?: Row) => {
    if (r) {
      setEditId(r.id);
      setForm({ ...r });
    } else {
      setEditId(null);
      setForm({ ...empty, publishedAt: new Date().toISOString() });
    }
    setOpen(true);
  };

  const onSave = async () => {
    const ok = await save(
      {
        ...form,
        coverImage: form.coverImage || null,
        readingTime: Number(form.readingTime),
        publishedAt: new Date(form.publishedAt).toISOString(),
      },
      editId,
    );
    if (ok) setOpen(false);
  };

  return (
    <AdminPage
      title="Журнал"
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
                <th>Заголовок</th>
                <th>Рубрика</th>
                <th>Статус</th>
                <th>Дата</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div>{r.title}</div>
                    <div className="cms-muted" style={{ fontSize: 12 }}>
                      {r.slug}
                    </div>
                  </td>
                  <td>{r.rubric}</td>
                  <td>
                    <span className={`cms-status cms-status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td className="cms-muted">{new Date(r.publishedAt).toLocaleDateString("ru-RU")}</td>
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
              <h2>{editId ? "Пост" : "Новый пост"}</h2>
              <button type="button" className="cms-iconbtn" onClick={() => setOpen(false)}>
                <Icons.close size={16} />
              </button>
            </div>
            <div className="cms-grid-2">
              <label className="cms-label">
                Заголовок
                <input className="cms-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label className="cms-label">
                Slug
                <input className="cms-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </label>
              <label className="cms-label">
                Рубрика
                <select className="cms-select" value={form.rubric} onChange={(e) => setForm({ ...form, rubric: e.target.value })}>
                  {["SYMBOLISM", "TAROT_HISTORY", "ALCHEMY_ART", "STUDIO_NEWS"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
              <label className="cms-label">
                Cover
                <input className="cms-input" value={form.coverImage || ""} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              </label>
              <label className="cms-label">
                Автор
                <input className="cms-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
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
              Content (Markdown)
              <textarea className="cms-textarea" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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
