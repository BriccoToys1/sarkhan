"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPage } from "../AdminPage";
import { Icons } from "@/components/admin/icons";
import { adminFetch, refreshAdminCounts } from "@/lib/admin-client";
import { useAdminShell } from "../AdminShell";

type Item = {
  id: string;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  image?: string | null;
};

type Order = {
  id: string;
  number: number;
  email: string;
  phone: string;
  name: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  shippingMethod: string;
  paymentMethod: string;
  paymentProvider: string;
  promoCode?: string | null;
  shippingCost: number;
  total: number;
  currency: string;
  status: string;
  trackingNumber?: string | null;
  note?: string | null;
  items: Item[];
  createdAt: string;
};

const STATUSES = ["PENDING", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default function OrdersPage() {
  const shell = useAdminShell();
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState<Order | null>(null);
  const [track, setTrack] = useState("");
  const [note, setNote] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      const res = await adminFetch(`/api/admin/orders?${params}`);
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = (o: Order) => {
    setView(o);
    setTrack(o.trackingNumber || "");
    setNote(o.note || "");
    setNewStatus(o.status);
  };

  const save = async () => {
    if (!view) return;
    const res = await adminFetch(`/api/admin/orders/${view.id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: newStatus,
        trackingNumber: track || null,
        note: note || null,
      }),
    });
    if (!res.ok) {
      shell?.toast("Не удалось сохранить");
      return;
    }
    shell?.toast("Заказ обновлён");
    setView(null);
    await load();
    refreshAdminCounts();
  };

  return (
    <AdminPage
      title="Заказы"
      count={items.length}
      actions={
        <button type="button" className="cms-iconbtn" onClick={() => load()}>
          <Icons.refresh size={16} />
        </button>
      }
    >
      <div className="cms-toolbar">
        <input
          className="cms-input"
          placeholder="Поиск по имени / email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <select className="cms-select" style={{ maxWidth: 180 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Все статусы</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="button" className="cms-btn" onClick={() => load()}>
          Фильтр
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
                <th>№</th>
                <th>Клиент</th>
                <th>Сумма</th>
                <th>Оплата</th>
                <th>Статус</th>
                <th>Дата</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id}>
                  <td>#{o.number}</td>
                  <td>
                    <div>{o.name}</div>
                    <div className="cms-muted" style={{ fontSize: 12 }}>
                      {o.email}
                    </div>
                  </td>
                  <td>
                    ${Number(o.total).toFixed(2)} {o.currency}
                  </td>
                  <td className="cms-muted">
                    {o.paymentMethod} / {o.paymentProvider}
                  </td>
                  <td>
                    <span className={`cms-status cms-status-${o.status.toLowerCase()}`}>{o.status}</span>
                  </td>
                  <td className="cms-muted">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</td>
                  <td>
                    <button type="button" className="cms-iconbtn" onClick={() => open(o)}>
                      <Icons.eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view ? (
        <div className="cms-modal-backdrop" onClick={() => setView(null)}>
          <div className="cms-modal cms-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h2>Заказ #{view.number}</h2>
              <button type="button" className="cms-iconbtn" onClick={() => setView(null)}>
                <Icons.close size={16} />
              </button>
            </div>
            <div className="cms-grid-2">
              <div>
                <p>
                  <strong>{view.name}</strong>
                </p>
                <p className="cms-muted">{view.email}</p>
                <p className="cms-muted">{view.phone}</p>
                <p style={{ marginTop: 8 }}>
                  {view.address}, {view.postalCode}
                  <br />
                  {view.city}, {view.country}
                </p>
              </div>
              <div>
                <p>
                  Доставка: {view.shippingMethod} (${Number(view.shippingCost).toFixed(2)})
                </p>
                <p>
                  Итого: <strong>${Number(view.total).toFixed(2)}</strong>
                  {view.promoCode ? ` · promo ${view.promoCode}` : ""}
                </p>
                <label className="cms-label">
                  Статус
                  <select className="cms-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="cms-label">
                  Трек-номер
                  <input className="cms-input" value={track} onChange={(e) => setTrack(e.target.value)} />
                </label>
                <label className="cms-label">
                  Заметка
                  <textarea className="cms-textarea" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                </label>
              </div>
            </div>
            <div className="cms-panel" style={{ marginTop: 12 }}>
              <h2>Позиции</h2>
              {view.items.map((it) => (
                <div key={it.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  {it.image ? <img src={it.image} alt="" className="cms-thumb" /> : null}
                  <div style={{ flex: 1 }}>
                    {it.title} × {it.quantity}
                    <div className="cms-muted" style={{ fontSize: 12 }}>
                      {it.sku}
                    </div>
                  </div>
                  <div>${Number(it.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="cms-modal-foot">
              <button type="button" className="cms-btn" onClick={() => setView(null)}>
                Закрыть
              </button>
              <button type="button" className="cms-btn cms-btn-primary" onClick={save}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}
