"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { SiteConfig } from "@/lib/site-config";

export function StorefrontChrome({
  children,
  site,
}: {
  children: ReactNode;
  site: SiteConfig & { url: string };
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <Footer site={site} />
    </>
  );
}
