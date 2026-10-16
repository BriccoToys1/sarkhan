"use client";

import type { ReactNode } from "react";

interface AdminPageProps {
  title: ReactNode;
  count?: number;
  notifyCount?: number;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminPage({ title, count, notifyCount, actions, children }: AdminPageProps) {
  return (
    <main className="cms-main">
      <header className="cms-header">
        <h1 className="cms-header-title">
          <span>{title}</span>
          {typeof count === "number" ? <span className="cms-badge">{count}</span> : null}
          {typeof notifyCount === "number" && notifyCount > 0 ? (
            <span className="cms-badge cms-badge-danger">{notifyCount}</span>
          ) : null}
        </h1>
        {actions ? <div className="cms-header-actions">{actions}</div> : null}
      </header>
      <div className="cms-content">{children}</div>
    </main>
  );
}
