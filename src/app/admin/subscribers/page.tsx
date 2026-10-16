"use client";

import { AdminPage } from "../AdminPage";
import { useAdminResource } from "@/components/admin/useAdminResource";
import { Icons } from "@/components/admin/icons";
import { adminFetch, refreshAdminCounts } from "@/lib/admin-client";

type Row = { id: string; email: string; source: string; createdAt: string };

export default function SubscribersPage() {
  const { items, loading, load, notify } = useAdminResource<Row>("/api/admin/subscribers");

  const remove = async (id: string) => {
    if (!confirm("Удалить подписчика?")) return;
    const res = await adminFetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
    if (!res.ok) notify("Не удалось удалить");
    else {
      notify("Удалено");
      await load();
      refreshAdminCounts();
    }
  };

  return (
    <AdminPage
      title="Подписчики"
      count={items.length}
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
      ) : items.length === 0 ? (
        <div className="cms-empty">Подписчиков пока нет</div>
      ) : (
        <div className="cms-table-wrap">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Источник</th>
                <th>Дата</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.email}</td>
                  <td>{r.source}</td>
                  <td className="cms-muted">{new Date(r.createdAt).toLocaleString("ru-RU")}</td>
                  <td>
                    <button type="button" className="cms-iconbtn" onClick={() => remove(r.id)}>
                      <Icons.trash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  );
}
