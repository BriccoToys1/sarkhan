export const SITE_SETTING_KEY = "site_v1";
export const SEO_SETTING_KEY = "seo_global";
export const APPEARANCE_SETTING_KEY = "admin_appearance";
export const SESSIONS_SETTING_KEY = "admin_sessions_v1";

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  email: string;
  address: string;
  socials: { label: string; href: string }[];
}

export const DEFAULT_SITE: SiteConfig = {
  name: "Sarkhan Grim",
  tagline: "Mystical Cards & Esoteric Artifacts",
  description:
    "Авторские колоды Таро, оригиналы картин, офорты и ритуальные артефакты художника Сархана Грима. Готический романтизм, алхимия и тёмное оккультное искусство.",
  email: "grim@mysticalcards.org",
  address: "Прага, Старе Место, Celetná 13",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Telegram", href: "https://t.me/" },
    { label: "Pinterest", href: "https://pinterest.com/" },
  ],
};

export function parseSiteConfig(raw: unknown): SiteConfig {
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
  const socials = Array.isArray(obj.socials)
    ? obj.socials
        .filter((s): s is { label: string; href: string } => !!s && typeof s === "object")
        .map((s) => ({
          label: String((s as { label?: unknown }).label ?? ""),
          href: String((s as { href?: unknown }).href ?? ""),
        }))
        .filter((s) => s.label && s.href)
    : DEFAULT_SITE.socials;

  return {
    name: typeof obj.name === "string" && obj.name.trim() ? obj.name.trim() : DEFAULT_SITE.name,
    tagline: typeof obj.tagline === "string" ? obj.tagline : DEFAULT_SITE.tagline,
    description: typeof obj.description === "string" ? obj.description : DEFAULT_SITE.description,
    email: typeof obj.email === "string" && obj.email.includes("@") ? obj.email.trim() : DEFAULT_SITE.email,
    address: typeof obj.address === "string" ? obj.address : DEFAULT_SITE.address,
    socials: socials.length ? socials : DEFAULT_SITE.socials,
  };
}
