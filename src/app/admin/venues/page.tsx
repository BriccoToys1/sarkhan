"use client";

import { useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";

type Row = {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  address?: string | null;
  url?: string | null;
  latitude: number;
  longitude: number;
  isStudio: boolean;
  sortOrder: number;
};

const empty: Omit<Row, "id"> = {
  name: "",
  city: "",
  country: "",
  description: "",
  address: "",
  url: "",
  latitude: 0,
  longitude: 0,
  isStudio: false,
  sortOrder: 0,
};

export default function VenuesPage() {
  const { items, loading, load, save, remove } = useAdminResource<Row>("/api/admin/venues");
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
        address: form.address || null,
        url: form.url || null,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        sortOrder: Number(form.sortOrder),
      },
      editId,
    );
    if (ok) setOpen(false);
  };

  return (
    <AdminPage
      title="Точки"
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
                <th>Название</th>
                <th>Город</th>
                <th>Студия</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>
                    {r.city}, {r.country}
                  </td>
                  <td>{r.isStudio ? "да" : "—"}</td>
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
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h2>{editId ? "Точка" : "Новая точка"}</h2>
              <button type="button" className="cms-iconbtn" onClick={() => setOpen(false)}>
                <Icons.close size={16} />
              </button>
            </div>
            <div className="cms-grid-2">
              <label className="cms-label">
                Название
                <input className="cms-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="cms-label">
                Город
                <input className="cms-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </label>
              <label className="cms-label">
                Страна
                <input className="cms-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </label>
              <label className="cms-label">
                Адрес
                <input className="cms-input" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </label>
              <label className="cms-label">
                Lat
                <input type="number" step="any" className="cms-input" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} />
              </label>
              <label className="cms-label">
                Lng
                <input type="number" step="any" className="cms-input" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} />
              </label>
            </div>
            <label className="cms-label">
              Описание
              <textarea className="cms-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="cms-check">
              <input type="checkbox" checked={form.isStudio} onChange={(e) => setForm({ ...form, isStudio: e.target.checked })} />
              Студия
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
