import type { Metadata, Viewport } from "next";
import { Alice } from "next/font/google";
import { AppShell } from "@/components/providers/AppShell";
import { StorefrontChrome } from "@/components/layout/StorefrontChrome";
import { SITE } from "@/lib/site";
import { getSiteConfig } from "@/lib/site-settings";
import "./globals.css";

const alice = Alice({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-alice",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Sarkhan Grim — Mystical Cards & Dark Occult Art", template: "%s · Sarkhan Grim" },
  description: SITE.description,
  applicationName: "Sarkhan Grim",
  keywords: ["Таро", "авторская колода", "оккультное искусство", "офорт", "Sarkhan Grim", "Сархан Грим", "эзотерика", "гримуар"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Sarkhan Grim",
    title: "Sarkhan Grim — Mystical Cards & Esoteric Artifacts",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteConfig = await getSiteConfig();
  const site = { ...siteConfig, url: SITE.url };

  return (
    <html lang="ru" className={alice.variable}>
      <body className="alice-regular min-h-screen overflow-x-hidden bg-obsidian">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian">
          К содержимому
        </a>
        <AppShell>
          <StorefrontChrome site={site}>{children}</StorefrontChrome>
        </AppShell>
      </body>
    </html>
  );
}
