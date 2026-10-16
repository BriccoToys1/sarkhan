"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellContextValue {
  setFill: (fill: boolean) => void;
  toast: (msg: string) => void;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export function useAdminShell() {
  return useContext(AdminShellContext);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [toastMsg, setToastMsg] = useState("");
  const setFill = useCallback(() => undefined, []);
  const toast = useCallback((msg: string) => setToastMsg(msg), []);
  const value = useMemo(() => ({ setFill, toast }), [setFill, toast]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminShellContext.Provider value={value}>
      <div className="cms-root">
        <AdminSidebar />
        {children}
        {toastMsg ? (
          <div className={`cms-toast cms-toast-${/ошибк|не удалось|сбой|failed|error/i.test(toastMsg) ? "error" : "success"}`}>
            {toastMsg}
            <button type="button" className="cms-iconbtn" onClick={() => setToastMsg("")} aria-label="Закрыть">
              ×
            </button>
          </div>
        ) : null}
      </div>
    </AdminShellContext.Provider>
  );
}
