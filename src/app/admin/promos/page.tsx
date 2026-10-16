"use client";

import { useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";

type Row = {
  id: string;
  code: string;
  description?: string | null;
  type: string;
  value: number;
  minSubtotal?: number | null;
  excludeOriginals: boolean;
  active: boolean;
  validUntil?: string | null;
  usageLimit?: number | null;
  usageCount: number;
};

const empty: Omit<Row, "id" | "usageCount"> = {
  code: "",
  description: "",
  type: "PERCENT",
  value: 10,
  minSubtotal: null,
  excludeOriginals: false,
  active: true,
  validUntil: null,
  usageLimit: null,
};

export default function PromosPage() {
  const { items, loading, load, save, remove } = useAdminResource<Row>("/api/admin/promos");
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
        value: Number(form.value),
        minSubtotal: form.minSubtotal == null || form.minSubtotal === ("" as never) ? null : Number(form.minSubtotal),
        usageLimit: form.usageLimit == null || form.usageLimit === ("" as never) ? null : Number(form.usageLimit),
        validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
        description: form.description || null,
      },
      editId,
    );
    if (ok) setOpen(false);
  };

  return (
    <AdminPage
      title="Промокоды"
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
                <th>Код</th>
                <th>Тип</th>
                <th>Значение</th>
                <th>Использовано</th>
                <th>Активен</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.code}</td>
                  <td>{r.type}</td>
                  <td>{r.type === "PERCENT" ? `${r.value}%` : "FREE SHIP"}</td>
                  <td>
                    {r.usageCount}
                    {r.usageLimit != null ? ` / ${r.usageLimit}` : ""}
                  </td>
                  <td>{r.active ? "да" : "нет"}</td>
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
              <h2>{editId ? "Промокод" : "Новый промокод"}</h2>
              <button type="button" className="cms-iconbtn" onClick={() => setOpen(false)}>
                <Icons.close size={16} />
              </button>
            </div>
            <div className="cms-grid-2">
              <label className="cms-label">
                Код
                <input className="cms-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </label>
              <label className="cms-label">
                Тип
                <select className="cms-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="PERCENT">PERCENT</option>
                  <option value="FREE_SHIPPING">FREE_SHIPPING</option>
                </select>
              </label>
              <label className="cms-label">
                Значение %
                <input type="number" className="cms-input" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
              </label>
              <label className="cms-label">
                Min subtotal
                <input
                  type="number"
                  className="cms-input"
                  value={form.minSubtotal ?? ""}
                  onChange={(e) => setForm({ ...form, minSubtotal: e.target.value ? Number(e.target.value) : null })}
                />
              </label>
            </div>
            <label className="cms-label">
              Описание
              <input className="cms-input" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="cms-check">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Активен
            </label>
            <label className="cms-check">
              <input type="checkbox" checked={form.excludeOriginals} onChange={(e) => setForm({ ...form, excludeOriginals: e.target.checked })} />
              Исключить оригиналы
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
