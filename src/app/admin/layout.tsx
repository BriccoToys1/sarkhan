import type { Metadata, Viewport } from "next";
import { AdminShell } from "./AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: "Sarkhan Grim Admin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
