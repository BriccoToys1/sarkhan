"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPage } from "./AdminPage";
import { adminFetch } from "@/lib/admin-client";
import { Icons } from "@/components/admin/icons";

interface Dash {
  ordersTotal: number;
  ordersPaid: number;
  revenue: number;
  products: number;
  contactsOpen: number;
  subscribers: number;
  recentOrders: {
    id: string;
    number: number;
    name: string;
    email: string;
    total: number;
    currency: string;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dash | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <AdminPage
      title="Дашборд"
      actions={
        <a className="cms-btn" href={process.env.NEXT_PUBLIC_SITE_URL || "/"} target="_blank" rel="noreferrer">
          <Icons.external size={14} />
          Сайт
        </a>
      }
    >
      {!data ? (
        <div className="cms-loading">
          <div className="cms-spinner" />
        </div>
      ) : (
        <>
          <div className="cms-stats">
            <div className="cms-stat">
              <div className="cms-stat-label">Заказы</div>
              <div className="cms-stat-value">{data.ordersTotal}</div>
            </div>
            <div className="cms-stat">
              <div className="cms-stat-label">Оплачено</div>
              <div className="cms-stat-value">{data.ordersPaid}</div>
            </div>
            <div className="cms-stat">
              <div className="cms-stat-label">Выручка</div>
              <div className="cms-stat-value">${data.revenue.toFixed(0)}</div>
            </div>
            <div className="cms-stat">
              <div className="cms-stat-label">Товары</div>
              <div className="cms-stat-value">{data.products}</div>
            </div>
            <div className="cms-stat">
              <div className="cms-stat-label">Контакты</div>
              <div className="cms-stat-value">{data.contactsOpen}</div>
            </div>
            <div className="cms-stat">
              <div className="cms-stat-label">Подписчики</div>
              <div className="cms-stat-value">{data.subscribers}</div>
            </div>
          </div>

          <div className="cms-panel">
            <h2>Последние заказы</h2>
            {data.recentOrders.length === 0 ? (
              <p className="cms-muted">Пока нет заказов</p>
            ) : (
              <div className="cms-table-wrap">
                <table className="cms-table">
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Клиент</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o) => (
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
                        <td>
                          <span className={`cms-status cms-status-${o.status.toLowerCase()}`}>{o.status}</span>
                        </td>
                        <td>
                          <Link className="cms-btn cms-btn-ghost" href="/admin/orders">
                            Открыть
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPage>
  );
}
