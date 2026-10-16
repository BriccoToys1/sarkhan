"use client";

import { useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";

type Row = {
  id: string;
  numeral: string;
  name: string;
  keyword: string;
  interpretation: string;
  image: string;
  productId?: string | null;
  active: boolean;
  sortOrder: number;
};

const empty: Omit<Row, "id"> = {
  numeral: "",
  name: "",
  keyword: "",
  interpretation: "",
  image: "",
  productId: null,
  active: true,
  sortOrder: 0,
};

export default function OraclePage() {
  const { items, loading, load, save, remove } = useAdminResource<Row>("/api/admin/oracle");
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
    const ok = await save({ ...form, productId: form.productId || null, sortOrder: Number(form.sortOrder) }, editId);
    if (ok) setOpen(false);
  };

  return (
    <AdminPage
      title="Оракул"
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
                <th>Карта</th>
                <th>Ключ</th>
                <th>Активна</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.image ? <img src={r.image} alt="" className="cms-thumb" /> : null}</td>
                  <td>
                    {r.numeral}. {r.name}
                  </td>
                  <td>{r.keyword}</td>
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
              <h2>{editId ? "Карта" : "Новая карта"}</h2>
              <button type="button" className="cms-iconbtn" onClick={() => setOpen(false)}>
                <Icons.close size={16} />
              </button>
            </div>
            <div className="cms-grid-2">
              <label className="cms-label">
                Numeral
                <input className="cms-input" value={form.numeral} onChange={(e) => setForm({ ...form, numeral: e.target.value })} />
              </label>
              <label className="cms-label">
                Имя
                <input className="cms-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="cms-label">
                Keyword
                <input className="cms-input" value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} />
              </label>
              <label className="cms-label">
                Image
                <input className="cms-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </label>
            </div>
            <label className="cms-label">
              Interpretation
              <textarea className="cms-textarea" rows={4} value={form.interpretation} onChange={(e) => setForm({ ...form, interpretation: e.target.value })} />
            </label>
            <label className="cms-check">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Активна
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
