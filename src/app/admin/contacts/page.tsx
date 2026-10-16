"use client";

import { useState } from "react";
import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";
import { adminFetch, refreshAdminCounts } from "@/lib/admin-client";

type Row = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  handled: boolean;
  createdAt: string;
};

export default function ContactsPage() {
  const { items, loading, load, remove, notify } = useAdminResource<Row>("/api/admin/contacts");
  const [view, setView] = useState<Row | null>(null);

  const toggle = async (r: Row) => {
    const res = await adminFetch(`/api/admin/contacts/${r.id}`, {
      method: "PUT",
      body: JSON.stringify({ handled: !r.handled }),
    });
    if (!res.ok) notify("Не удалось обновить");
    else {
      notify("Обновлено");
      await load();
      refreshAdminCounts();
    }
  };

  const openCount = items.filter((i) => !i.handled).length;

  return (
    <AdminPage
      title="Контакты"
      count={items.length}
      notifyCount={openCount}
      actions={
        <button type="button" className="cms-iconbtn" onClick={() => load()}>
          <Icons.refresh size={16} />
        </button>
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
                <th>От кого</th>
                <th>Тема</th>
                <th>Статус</th>
                <th>Дата</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div>{r.name}</div>
                    <div className="cms-muted" style={{ fontSize: 12 }}>
                      {r.email}
                    </div>
                  </td>
                  <td>{r.topic}</td>
                  <td>
                    <span className={`cms-status ${r.handled ? "cms-status-delivered" : "cms-status-pending"}`}>
                      {r.handled ? "Обработано" : "Новое"}
                    </span>
                  </td>
                  <td className="cms-muted">{new Date(r.createdAt).toLocaleString("ru-RU")}</td>
                  <td>
                    <div className="cms-row-actions">
                      <button type="button" className="cms-iconbtn" onClick={() => setView(r)}>
                        <Icons.eye size={14} />
                      </button>
                      <button type="button" className="cms-iconbtn" onClick={() => toggle(r)} title="Переключить статус">
                        <Icons.check size={14} />
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

      {view ? (
        <div className="cms-modal-backdrop" onClick={() => setView(null)}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h2>{view.name}</h2>
              <button type="button" className="cms-iconbtn" onClick={() => setView(null)}>
                <Icons.close size={16} />
              </button>
            </div>
            <p className="cms-muted">
              {view.email} · {view.topic}
            </p>
            <p style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{view.message}</p>
            <div className="cms-modal-foot">
              <a className="cms-btn" href={`mailto:${view.email}`}>
                Написать
              </a>
              <button type="button" className="cms-btn cms-btn-primary" onClick={() => toggle(view).then(() => setView(null))}>
                {view.handled ? "Вернуть в новые" : "Отметить обработанным"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}
