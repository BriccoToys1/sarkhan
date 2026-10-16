export interface AdminAppearance {
  glass: number;
  wallpaperUrl: string;
  wallpaperDim: number;
}

export const APPEARANCE_SETTING_KEY = "admin_appearance";
const STORAGE_KEY = "cms_appearance_v1";

export const DEFAULT_APPEARANCE: AdminAppearance = { glass: 35, wallpaperUrl: "", wallpaperDim: 55 };

const clamp = (n: unknown, fallback: number) => {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.max(0, Math.min(100, v));
};

export function parseAppearance(raw: unknown): AdminAppearance {
  let obj: Record<string, unknown> = {};
  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      obj = {};
    }
  } else if (raw && typeof raw === "object") {
    obj = raw as Record<string, unknown>;
  }
  const url = typeof obj.wallpaperUrl === "string" ? obj.wallpaperUrl.trim() : "";
  return {
    glass: clamp(obj.glass, DEFAULT_APPEARANCE.glass),
    wallpaperUrl: /^(https?:\/\/|\/)[^\s"'()]+$/.test(url) ? url : "",
    wallpaperDim: clamp(obj.wallpaperDim, DEFAULT_APPEARANCE.wallpaperDim),
  };
}

export function applyAppearance(a: AdminAppearance): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--cms-glass", String(a.glass / 100));
  root.style.setProperty("--cms-wallpaper-dim", String(a.wallpaperDim / 100));
  if (a.wallpaperUrl) {
    root.style.setProperty("--cms-wallpaper", `url("${a.wallpaperUrl}")`);
    root.setAttribute("data-cms-wallpaper", "1");
  } else {
    root.style.setProperty("--cms-wallpaper", "none");
    root.removeAttribute("data-cms-wallpaper");
  }
}

export function readCachedAppearance(): AdminAppearance | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseAppearance(raw) : null;
  } catch {
    return null;
  }
}

export function cacheAppearance(a: AdminAppearance): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* ignore */
  }
}
