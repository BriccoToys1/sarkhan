"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";
import { adminFetch } from "@/lib/admin-client";

type Product = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  type: string;
  collectionId?: string | null;
  price: number;
  shortDescription: string;
  description: string;
  visualDescription?: string | null;
  specs?: Record<string, string>;
  images: string[];
  stock: number;
  availability: string;
  leadTimeDays?: number | null;
  isLimited: boolean;
  editionSize?: number | null;
  isFeatured: boolean;
  status: string;
  sortOrder: number;
  collection?: { id: string; title: string } | null;
};

type CollectionOpt = { id: string; title: string };

const empty: Omit<Product, "id"> = {
  sku: "",
  slug: "",
  title: "",
  titleEn: "",
  type: "DECK",
  collectionId: null,
  price: 0,
  shortDescription: "",
  description: "",
  visualDescription: "",
  specs: {},
  images: [],
  stock: 0,
  availability: "IN_STOCK",
  leadTimeDays: null,
  isLimited: false,
  editionSize: null,
  isFeatured: false,
  status: "PUBLISHED",
  sortOrder: 0,
};

export default function ProductsPage() {
  const { items, loading, load, save, remove } = useAdminResource<Product>("/api/admin/products");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [collections, setCollections] = useState<CollectionOpt[]>([]);
  const [specsText, setSpecsText] = useState("{}");
  const [imagesText, setImagesText] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/collections")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: CollectionOpt[]) => setCollections(rows.map((c) => ({ id: c.id, title: c.title }))))
      .catch(() => undefined);
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm(empty);
    setSpecsText("{}");
    setImagesText("");
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ ...p, collectionId: p.collectionId || null });
    setSpecsText(JSON.stringify(p.specs || {}, null, 2));
    setImagesText((p.images || []).join("\n"));
    setOpen(true);
  };

  const onSave = async () => {
    let specs: Record<string, string> = {};
    try {
      specs = JSON.parse(specsText || "{}");
    } catch {
      alert("Specs: невалидный JSON");
      return;
    }
    const images = imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const ok = await save(
      {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        sortOrder: Number(form.sortOrder),
        leadTimeDays: form.leadTimeDays === null || form.leadTimeDays === ("" as never) ? null : Number(form.leadTimeDays),
        editionSize: form.editionSize == null ? null : Number(form.editionSize),
        collectionId: form.collectionId || null,
        specs,
        images,
      },
      editId,
    );
    if (ok) setOpen(false);
  };

  return (
    <AdminPage
      title="Товары"
      count={items.length}
      actions={
        <>
          <button type="button" className="cms-iconbtn" onClick={() => load(q)} aria-label="Обновить">
            <Icons.refresh size={16} />
          </button>
          <button type="button" className="cms-btn cms-btn-primary" onClick={openNew}>
            <Icons.plus size={14} /> Добавить
          </button>
        </>
      }
    >
      <div className="cms-toolbar">
        <input
          className="cms-input"
          placeholder="Поиск…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(q)}
        />
        <button type="button" className="cms-btn" onClick={() => load(q)}>
          Найти
        </button>
      </div>

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
                <th>SKU</th>
                <th>Тип</th>
                <th>Цена</th>
                <th>Сток</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.images[0] ? <img src={p.images[0]} alt="" className="cms-thumb" /> : null}</td>
                  <td>
                    <div>{p.title}</div>
                    <div className="cms-muted" style={{ fontSize: 12 }}>
                      {p.slug}
                    </div>
                  </td>
                  <td>{p.sku}</td>
                  <td>{p.type}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`cms-status cms-status-${p.status.toLowerCase()}`}>{p.status}</span>
                  </td>
                  <td>
                    <div className="cms-row-actions">
                      <button type="button" className="cms-iconbtn" onClick={() => openEdit(p)}>
                        <Icons.edit size={14} />
                      </button>
                      <button type="button" className="cms-iconbtn" onClick={() => remove(p.id)}>
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
              <h2>{editId ? "Редактировать товар" : "Новый товар"}</h2>
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
                Title EN
                <input className="cms-input" value={form.titleEn || ""} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </label>
              <label className="cms-label">
                SKU
                <input className="cms-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </label>
              <label className="cms-label">
                Slug
                <input className="cms-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </label>
              <label className="cms-label">
                Тип
                <select className="cms-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {["DECK", "PRINT", "ORIGINAL", "ACCESSORY", "BOOK"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="cms-label">
                Коллекция
                <select
                  className="cms-select"
                  value={form.collectionId || ""}
                  onChange={(e) => setForm({ ...form, collectionId: e.target.value || null })}
                >
                  <option value="">—</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="cms-label">
                Цена (USD)
                <input
                  type="number"
                  className="cms-input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </label>
              <label className="cms-label">
                Сток
                <input
                  type="number"
                  className="cms-input"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </label>
              <label className="cms-label">
                Наличие
                <select
                  className="cms-select"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                >
                  {["IN_STOCK", "PRE_ORDER", "SOLD_OUT"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
              Краткое описание
              <textarea className="cms-textarea" rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            </label>
            <label className="cms-label">
              Описание (Markdown)
              <textarea className="cms-textarea" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="cms-label">
              Изображения (URL по строкам)
              <textarea className="cms-textarea" rows={3} value={imagesText} onChange={(e) => setImagesText(e.target.value)} />
            </label>
            <label className="cms-label">
              Specs (JSON)
              <textarea className="cms-textarea" rows={3} value={specsText} onChange={(e) => setSpecsText(e.target.value)} />
            </label>
            <div className="cms-grid-3">
              <label className="cms-check">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                Featured
              </label>
              <label className="cms-check">
                <input type="checkbox" checked={form.isLimited} onChange={(e) => setForm({ ...form, isLimited: e.target.checked })} />
                Limited
              </label>
              <label className="cms-label">
                Sort
                <input type="number" className="cms-input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </label>
            </div>
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
