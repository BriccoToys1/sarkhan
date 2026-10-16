import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Montserrat } from "next/font/google";
import { AppShell } from "@/components/providers/AppShell";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${montserrat.variable} ${cinzel.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-obsidian">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian">
          К содержимому
        </a>
        <AppShell>
          <Header />
          <main id="main" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AppShell>
      </body>
    </html>
  );
}
