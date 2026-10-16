import type { MetadataRoute } from "next";
import { getCollections, getJournalPosts, getProducts } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts] = await Promise.all([getProducts(), getCollections(), getJournalPosts()]);
  const page = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${SITE.url}${path}`, priority });
  return [
    page("/", 1),
    page("/shop", 0.9),
    page("/collections", 0.8),
    page("/gallery", 0.8),
    page("/about", 0.6),
    page("/journal", 0.7),
    page("/contacts", 0.5),
    page("/shipping", 0.3),
    page("/returns", 0.3),
    page("/faq", 0.3),
    page("/privacy", 0.2),
    ...products.map((p) => page(`/shop/${p.slug}`, 0.8)),
    ...collections.map((c) => page(`/collections/${c.slug}`, 0.7)),
    ...posts.map((p) => ({ ...page(`/journal/${p.slug}`, 0.6), lastModified: p.publishedAt })),
  ];
}
