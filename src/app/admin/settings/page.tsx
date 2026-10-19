"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "../AdminPage";
import { adminFetch } from "@/lib/admin-client";
import { useAdminShell } from "../AdminShell";
import {
  APPEARANCE_SETTING_KEY,
  applyAppearance,
  cacheAppearance,
  DEFAULT_APPEARANCE,
  parseAppearance,
  type AdminAppearance,
} from "@/components/admin/appearance";
import { DEFAULT_SITE, SEO_SETTING_KEY, SESSIONS_SETTING_KEY, SITE_SETTING_KEY, type SiteConfig } from "@/lib/site-config";

interface SeoConfig {
  title: string;
  description: string;
  ogDescription: string;
  titleEn: string;
  descriptionEn: string;
  ogDescriptionEn: string;
}

const DEFAULT_SEO: SeoConfig = {
  title: "",
  description: "",
  ogDescription: "",
  titleEn: "",
  descriptionEn: "",
  ogDescriptionEn: "",
};

export default function SettingsPage() {
  const shell = useAdminShell();
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE);
  const [seo, setSeo] = useState<SeoConfig>(DEFAULT_SEO);
  const [appearance, setAppearance] = useState<AdminAppearance>(DEFAULT_APPEARANCE);
  const [sessions, setSessions] = useState<{ at: string; email: string; name: string; ip: string; userAgent: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      adminFetch(`/api/admin/settings?key=${SITE_SETTING_KEY}`).then((r) => r.json()),
      adminFetch(`/api/admin/settings?key=${SEO_SETTING_KEY}`).then((r) => r.json()),
      adminFetch(`/api/admin/settings?key=${APPEARANCE_SETTING_KEY}`).then((r) => r.json()),
      adminFetch(`/api/admin/settings?key=${SESSIONS_SETTING_KEY}`).then((r) => r.json()),
    ]).then(([siteRes, seoRes, appRes, sessRes]) => {
      if (siteRes?.value) {
        try {
          const parsed = { ...DEFAULT_SITE, ...JSON.parse(siteRes.value) } as SiteConfig;
          parsed.socials = (parsed.socials ?? []).filter((s) => s.label.toLowerCase() !== "instagram");
          if (parsed.socials.length === 0) parsed.socials = DEFAULT_SITE.socials;
          setSite(parsed);
        } catch {
          /* keep default */
        }
      }
      if (seoRes?.value) {
        try {
          setSeo({ ...DEFAULT_SEO, ...JSON.parse(seoRes.value) });
        } catch {
          /* keep */
        }
      }
      if (appRes?.value) {
        const a = parseAppearance(appRes.value);
        setAppearance(a);
        applyAppearance(a);
      }
      if (sessRes?.value) {
        try {
          const list = JSON.parse(sessRes.value);
          if (Array.isArray(list)) setSessions(list);
        } catch {
          /* keep */
        }
      }
    });
  }, []);

  const put = async (key: string, value: unknown) => {
    const res = await adminFetch("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ key, value: typeof value === "string" ? value : JSON.stringify(value) }),
    });
    return res.ok;
  };

  const saveSite = async () => {
    setSaving(true);
    const ok = await put(SITE_SETTING_KEY, site);
    shell?.toast(ok ? "Настройки сайта сохранены" : "Ошибка сохранения");
    setSaving(false);
  };

  const saveSeo = async () => {
    setSaving(true);
    const ok = await put(SEO_SETTING_KEY, seo);
    shell?.toast(ok ? "SEO сохранено" : "Ошибка сохранения");
    setSaving(false);
  };

  const saveAppearance = async () => {
    setSaving(true);
    applyAppearance(appearance);
    cacheAppearance(appearance);
    const ok = await put(APPEARANCE_SETTING_KEY, appearance);
    shell?.toast(ok ? "Внешний вид сохранён" : "Ошибка сохранения");
    setSaving(false);
  };

  return (
    <AdminPage title="Настройки">
      <div className="cms-panel">
        <h2>Сайт</h2>
        <div className="cms-grid-2">
          <label className="cms-label">
            Название
            <input className="cms-input" value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} />
          </label>
          <label className="cms-label">
            Tagline
            <input className="cms-input" value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} />
          </label>
          <label className="cms-label">
            Email
            <input className="cms-input" value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} />
          </label>
          <label className="cms-label">
            Адрес
            <input className="cms-input" value={site.address} onChange={(e) => setSite({ ...site, address: e.target.value })} />
          </label>
        </div>
        <label className="cms-label">
          Описание
          <textarea className="cms-textarea" rows={3} value={site.description} onChange={(e) => setSite({ ...site, description: e.target.value })} />
        </label>
        <label className="cms-label">
          Соцсети (JSON: [{`{label, href}`}])
          <textarea
            className="cms-textarea"
            rows={3}
            value={JSON.stringify(site.socials, null, 2)}
            onChange={(e) => {
              try {
                setSite({ ...site, socials: JSON.parse(e.target.value) });
              } catch {
                /* typing */
              }
            }}
          />
        </label>
        <button type="button" className="cms-btn cms-btn-primary" disabled={saving} onClick={saveSite}>
          Сохранить сайт
        </button>
      </div>

      <div className="cms-panel">
        <h2>SEO</h2>
        <div className="cms-grid-2">
          <label className="cms-label">
            Title RU
            <input className="cms-input" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
          </label>
          <label className="cms-label">
            Title EN
            <input className="cms-input" value={seo.titleEn} onChange={(e) => setSeo({ ...seo, titleEn: e.target.value })} />
          </label>
        </div>
        <label className="cms-label">
          Description RU
          <textarea className="cms-textarea" rows={3} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} />
        </label>
        <label className="cms-label">
          Description EN
          <textarea className="cms-textarea" rows={3} value={seo.descriptionEn} onChange={(e) => setSeo({ ...seo, descriptionEn: e.target.value })} />
        </label>
        <label className="cms-label">
          OG Description RU
          <textarea className="cms-textarea" rows={3} value={seo.ogDescription} onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })} />
        </label>
        <label className="cms-label">
          OG Description EN
          <textarea className="cms-textarea" rows={3} value={seo.ogDescriptionEn} onChange={(e) => setSeo({ ...seo, ogDescriptionEn: e.target.value })} />
        </label>
        <button type="button" className="cms-btn cms-btn-primary" disabled={saving} onClick={saveSeo}>
          Сохранить SEO
        </button>
      </div>

      <div className="cms-panel">
        <h2>Внешний вид админки</h2>
        <label className="cms-label">
          Liquid glass: {appearance.glass}%
          <input
            type="range"
            min={0}
            max={100}
            value={appearance.glass}
            onChange={(e) => {
              const next = { ...appearance, glass: Number(e.target.value) };
              setAppearance(next);
              applyAppearance(next);
            }}
          />
        </label>
        <label className="cms-label">
          Wallpaper URL
          <input
            className="cms-input"
            value={appearance.wallpaperUrl}
            onChange={(e) => {
              const next = { ...appearance, wallpaperUrl: e.target.value };
              setAppearance(next);
              applyAppearance(next);
            }}
          />
        </label>
        <label className="cms-label">
          Затемнение обоев: {appearance.wallpaperDim}%
          <input
            type="range"
            min={0}
            max={100}
            value={appearance.wallpaperDim}
            onChange={(e) => {
              const next = { ...appearance, wallpaperDim: Number(e.target.value) };
              setAppearance(next);
              applyAppearance(next);
            }}
          />
        </label>
        <button type="button" className="cms-btn cms-btn-primary" disabled={saving} onClick={saveAppearance}>
          Сохранить вид
        </button>
      </div>

      <div className="cms-panel">
        <h2>
          Сессии <span className="cms-muted" style={{ fontWeight: 400, fontSize: 12 }}>
            История входов: устройство, IP, время
          </span>
        </h2>
        {sessions.length === 0 ? (
          <p className="cms-muted">Пока нет записей</p>
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>IP</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 20).map((s, i) => (
                  <tr key={`${s.at}-${i}`}>
                    <td>{s.name || s.email}</td>
                    <td className="cms-muted">{s.ip}</td>
                    <td className="cms-muted">{new Date(s.at).toLocaleString("ru-RU")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
