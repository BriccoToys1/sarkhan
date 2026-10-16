import { cacheLife, cacheTag } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import type {
  ArtworkDTO,
  Availability,
  CollectionDTO,
  JournalPostDTO,
  JournalRubric,
  OracleCardDTO,
  ProductDTO,
  ProductType,
  VenueDTO,
} from "./types";

/** Теги кэша — их же сбрасывает POST /api/revalidate. */
export const CACHE_TAGS = ["products", "collections", "oracle", "gallery", "journal", "venues"] as const;
export type CacheTag = (typeof CACHE_TAGS)[number];

const productInclude = { collection: { select: { slug: true, title: true } } } as const;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toSpecs(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, String(v)]));
}

function mapProduct(p: ProductRow): ProductDTO {
  return {
    id: p.id,
    sku: p.sku,
    slug: p.slug,
    title: p.title,
    titleEn: p.titleEn,
    type: p.type as ProductType,
    price: Number(p.price),
    shortDescription: p.shortDescription,
    description: p.description,
    visualDescription: p.visualDescription,
    specs: toSpecs(p.specs),
    images: p.images.length > 0 ? p.images : ["/art/oracle/back.svg"],
    stock: p.stock,
    availability: p.availability as Availability,
    leadTimeDays: p.leadTimeDays,
    isLimited: p.isLimited,
    editionSize: p.editionSize,
    isFeatured: p.isFeatured,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    collection: p.collection,
  };
}

export async function getProducts(): Promise<ProductDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: productInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(mapProduct);
}

export async function getProduct(slug: string): Promise<ProductDTO | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products", `product:${slug}`);
  const row = await prisma.product.findFirst({ where: { slug, status: "PUBLISHED" }, include: productInclude });
  return row ? mapProduct(row) : null;
}

export async function getFeaturedProducts(limit = 4) {
  const all = await getProducts();
  const featured = all.filter((p) => p.isFeatured);
  return (featured.length >= limit ? featured : [...featured, ...all.filter((p) => !p.isFeatured)]).slice(0, limit);
}

export async function getRelatedProducts(product: ProductDTO, limit = 4) {
  const all = await getProducts();
  const others = all.filter((p) => p.id !== product.id);
  const sameCollection = others.filter((p) => p.collection?.slug && p.collection.slug === product.collection?.slug);
  const sameType = others.filter((p) => p.type === product.type && !sameCollection.includes(p));
  return [...sameCollection, ...sameType, ...others].filter((p, i, arr) => arr.indexOf(p) === i).slice(0, limit);
}

export async function getCollections(): Promise<CollectionDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("collections", "products");
  const rows = await prisma.collection.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });
  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    era: c.era,
    excerpt: c.excerpt,
    lore: c.lore,
    coverImage: c.coverImage,
    ambientPreset: c.ambientPreset,
    ambientUrl: c.ambientUrl,
    productCount: c._count.products,
  }));
}

export async function getCollection(slug: string) {
  const collections = await getCollections();
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return null;
  const products = (await getProducts()).filter((p) => p.collection?.slug === slug);
  return { collection, products };
}

export async function getOracleCards(): Promise<OracleCardDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("oracle", "products");
  const rows = await prisma.oracleCard.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { product: { select: { slug: true, title: true, type: true, status: true } } },
  });
  return rows.map((c) => ({
    id: c.id,
    numeral: c.numeral,
    name: c.name,
    keyword: c.keyword,
    interpretation: c.interpretation,
    image: c.image,
    product:
      c.product && c.product.status === "PUBLISHED"
        ? { slug: c.product.slug, title: c.product.title, type: c.product.type as ProductType }
        : null,
  }));
}

export async function getArtworks(): Promise<ArtworkDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("gallery", "products");
  const rows = await prisma.artwork.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
    include: { product: { select: { slug: true, title: true, price: true, availability: true, status: true } } },
  });
  return rows.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    year: a.year,
    materials: a.materials,
    dimensions: a.dimensions,
    description: a.description,
    image: a.image,
    imageHiRes: a.imageHiRes,
    audioUrl: a.audioUrl,
    audioTranscript: a.audioTranscript,
    product:
      a.product && a.product.status === "PUBLISHED"
        ? {
            slug: a.product.slug,
            title: a.product.title,
            price: Number(a.product.price),
            availability: a.product.availability as Availability,
          }
        : null,
  }));
}

export const GALLERY_PAGE_SIZE = 3;

export async function getArtworkPage(cursor: number) {
  const all = await getArtworks();
  const items = all.slice(cursor, cursor + GALLERY_PAGE_SIZE);
  const next = cursor + GALLERY_PAGE_SIZE < all.length ? cursor + GALLERY_PAGE_SIZE : null;
  return { items, next, total: all.length };
}

export async function getJournalPosts(): Promise<JournalPostDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("journal");
  const rows = await prisma.journalPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    rubric: p.rubric as JournalRubric,
    coverImage: p.coverImage,
    author: p.author,
    readingTime: p.readingTime,
    publishedAt: p.publishedAt.toISOString(),
  }));
}

export async function getJournalPost(slug: string) {
  const posts = await getJournalPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return { post: posts[index], newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null };
}

export async function getVenues(): Promise<VenueDTO[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("venues");
  const rows = await prisma.venue.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((v) => ({
    id: v.id,
    name: v.name,
    city: v.city,
    country: v.country,
    description: v.description,
    address: v.address,
    url: v.url,
    latitude: v.latitude,
    longitude: v.longitude,
    isStudio: v.isStudio,
  }));
}
