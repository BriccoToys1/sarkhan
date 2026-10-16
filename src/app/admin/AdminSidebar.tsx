"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/components/admin/icons";
import {
  APPEARANCE_SETTING_KEY,
  applyAppearance,
  cacheAppearance,
  parseAppearance,
  readCachedAppearance,
} from "@/components/admin/appearance";
import { ADMIN_COUNTS_REFRESH_EVENT, adminFetch, clearAdminAuthToken } from "@/lib/admin-client";

interface Counts {
  newOrders: number;
  newContacts: number;
}

const NAV: { href: string; label: string; icon: keyof typeof Icons; countKey?: keyof Counts; section?: boolean }[] = [
  { href: "/admin", label: "Дашборд", icon: "dashboard" },
  { href: "/admin/orders", label: "Заказы", icon: "orders", countKey: "newOrders" },
  { href: "", label: "", icon: "dashboard", section: true },
  { href: "/admin/products", label: "Товары", icon: "products" },
  { href: "/admin/collections", label: "Коллекции", icon: "collections" },
  { href: "/admin/gallery", label: "Галерея", icon: "gallery" },
  { href: "/admin/oracle", label: "Оракул", icon: "oracle" },
  { href: "/admin/journal", label: "Журнал", icon: "journal" },
  { href: "", label: "", icon: "dashboard", section: true },
  { href: "/admin/promos", label: "Промокоды", icon: "promo" },
  { href: "/admin/subscribers", label: "Подписчики", icon: "subscribers" },
  { href: "/admin/contacts", label: "Контакты", icon: "contacts", countKey: "newContacts" },
  { href: "/admin/venues", label: "Точки", icon: "venues" },
  { href: "/admin/media", label: "Медиа", icon: "media" },
  { href: "", label: "", icon: "dashboard", section: true },
  { href: "/admin/settings", label: "Настройки", icon: "settings" },
];

const MOBILE = [
  { href: "/admin", label: "Дашборд", icon: "dashboard" as const },
  { href: "/admin/orders", label: "Заказы", icon: "orders" as const },
  { href: "/admin/products", label: "Товары", icon: "products" as const },
  { href: "/admin/settings", label: "Ещё", icon: "settings" as const },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState<Counts>({ newOrders: 0, newContacts: 0 });
  const [confirmLogout, setConfirmLogout] = useState(false);

  const loadCounts = useCallback(() => {
    adminFetch("/api/admin/counts")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setCounts({ newOrders: d.newOrders || 0, newContacts: d.newContacts || 0 });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const cached = readCachedAppearance();
    if (cached) applyAppearance(cached);
    adminFetch(`/api/admin/settings?key=${APPEARANCE_SETTING_KEY}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.value) return;
        const next = parseAppearance(d.value);
        applyAppearance(next);
        cacheAppearance(next);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    loadCounts();
    const onRefresh = () => loadCounts();
    window.addEventListener(ADMIN_COUNTS_REFRESH_EVENT, onRefresh);
    const id = setInterval(loadCounts, 60_000);
    return () => {
      window.removeEventListener(ADMIN_COUNTS_REFRESH_EVENT, onRefresh);
      clearInterval(id);
    };
  }, [loadCounts]);

  const logout = async () => {
    await adminFetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    clearAdminAuthToken();
    document.cookie = "admin_token=; path=/; max-age=0";
    router.replace("/admin/login");
  };

  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <aside className={`cms-sidebar${collapsed ? " is-collapsed" : ""}`}>
        <div className="cms-sidebar-brand">
          <span className="cms-sidebar-brand-text">Sarkhan Grim</span>
        </div>
        <nav className="cms-nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div key={`s-${i}`} className="cms-nav-section" />
            ) : (
              <Link key={item.href} href={item.href} className={`cms-nav-item${active(item.href) ? " is-active" : ""}`}>
                {(() => {
                  const Icon = Icons[item.icon];
                  return <Icon className="cms-nav-icon" size={18} />;
                })()}
                <span className="cms-nav-label">{item.label}</span>
                {item.countKey && counts[item.countKey] > 0 ? (
                  <span className="cms-nav-badge">{counts[item.countKey]}</span>
                ) : null}
              </Link>
            ),
          )}
        </nav>
        <div className="cms-sidebar-foot">
          <button type="button" className="cms-sidebar-btn" onClick={() => setCollapsed((c) => !c)}>
            <Icons.collapse size={18} />
            <span className="cms-nav-label">{collapsed ? "Развернуть" : "Свернуть"}</span>
          </button>
          <a
            className="cms-sidebar-btn"
            href={process.env.NEXT_PUBLIC_SITE_URL || "/"}
            target="_blank"
            rel="noreferrer"
          >
            <Icons.external size={18} />
            <span className="cms-nav-label">На сайт</span>
          </a>
          {!confirmLogout ? (
            <button type="button" className="cms-sidebar-btn" onClick={() => setConfirmLogout(true)}>
              <Icons.logout size={18} />
              <span className="cms-nav-label">Выход</span>
            </button>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" className="cms-btn cms-btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmLogout(false)}>
                Отмена
              </button>
              <button type="button" className="cms-btn cms-btn-danger" style={{ flex: 1 }} onClick={logout}>
                Выйти
              </button>
            </div>
          )}
        </div>
      </aside>
      <nav className="cms-mobile-nav">
        {MOBILE.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <Link key={item.href} href={item.href} className={active(item.href) ? "is-active" : ""}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
