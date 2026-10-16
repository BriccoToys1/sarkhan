import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import {
  DEFAULT_SITE,
  parseSiteConfig,
  SITE_SETTING_KEY,
  type SiteConfig,
} from "./site-config";

export {
  APPEARANCE_SETTING_KEY,
  DEFAULT_SITE,
  parseSiteConfig,
  SEO_SETTING_KEY,
  SESSIONS_SETTING_KEY,
  SITE_SETTING_KEY,
  type SiteConfig,
} from "./site-config";

export async function getSiteConfig(): Promise<SiteConfig> {
  "use cache";
  cacheLife("minutes");
  cacheTag("site");
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: SITE_SETTING_KEY } });
    if (!row?.value) return DEFAULT_SITE;
    return parseSiteConfig(row.value);
  } catch {
    return DEFAULT_SITE;
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function upsertSetting(key: string, value: string) {
  return prisma.siteSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
