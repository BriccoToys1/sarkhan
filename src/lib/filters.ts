import type { Availability, ProductDTO, ProductType } from "./types";

export type SortKey = "default" | "price-asc" | "price-desc" | "new" | "limited";

export type Filters = {
  q: string;
  types: ProductType[];
  collections: string[];
  minPrice: number;
  maxPrice: number;
  availability: Availability[];
  sort: SortKey;
};

export const SORT_LABELS: Record<SortKey, string> = {
  default: "По умолчанию",
  "price-asc": "От дешёвых к дорогим",
  "price-desc": "От дорогих к дешёвым",
  new: "Новинки",
  limited: "Лимитированные издания",
};

/** Фильтрация каталога (ТЗ 4.1): OR внутри группы, AND между группами. */
export function filterProducts(products: ProductDTO[], f: Filters) {
  const words = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list = products.filter((p) => {
    if (f.types.length > 0 && !f.types.includes(p.type)) return false;
    if (f.collections.length > 0 && !(p.collection && f.collections.includes(p.collection.slug))) return false;
    if (p.price < f.minPrice || p.price > f.maxPrice) return false;
    if (f.availability.length > 0 && !f.availability.includes(p.availability)) return false;
    if (words.length > 0) {
      const hay = `${p.title} ${p.titleEn ?? ""} ${p.sku} ${p.shortDescription} ${p.collection?.title ?? ""}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return false;
    }
    return true;
  });

  const sorted = [...list];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "new":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "limited":
      sorted.sort((a, b) => Number(b.isLimited) - Number(a.isLimited) || a.sortOrder - b.sortOrder);
      break;
    default:
      sorted.sort((a, b) => Number(a.availability === "SOLD_OUT") - Number(b.availability === "SOLD_OUT") || a.sortOrder - b.sortOrder);
  }
  return sorted;
}
