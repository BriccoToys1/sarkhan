import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { getCollections, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Магазин — Храм артефактов",
  description: "Авторские колоды Таро, оригиналы картин, офорты ограниченных тиражей, гримуары и алтарные аксессуары Сархана Грима.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  return (
    <>
      <PageHeader eyebrow="Арсенал оккультиста" title="Храм артефактов">
        Колоды Таро, гравюры ограниченных тиражей, гримуары и оригинальные полотна — каждый предмет создан вручную в пражской мастерской.
      </PageHeader>
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <ShopCatalog products={products} collections={collections.map((c) => ({ slug: c.slug, title: c.title }))} />
      </section>
    </>
  );
}
