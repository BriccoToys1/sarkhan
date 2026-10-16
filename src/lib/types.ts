export type ProductType = "DECK" | "PRINT" | "ORIGINAL" | "ACCESSORY" | "BOOK";
export type Availability = "IN_STOCK" | "PRE_ORDER" | "SOLD_OUT";
export type ShippingMethod = "STANDARD" | "EXPRESS";
export type PaymentMethod = "CARD" | "CRYPTO";
export type OrderStatus = "PENDING" | "PAID" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type JournalRubric = "SYMBOLISM" | "TAROT_HISTORY" | "ALCHEMY_ART" | "STUDIO_NEWS";
export type ContactTopic = "COLLABORATION" | "CUSTOM_PAINTING" | "DELIVERY" | "PRESS";
export type CryptoCurrency = "BTC" | "ETH" | "SOL";

export type CollectionRef = { slug: string; title: string };

export type ProductDTO = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  titleEn: string | null;
  type: ProductType;
  price: number;
  shortDescription: string;
  description: string;
  visualDescription: string | null;
  specs: Record<string, string>;
  images: string[];
  stock: number;
  availability: Availability;
  leadTimeDays: number | null;
  isLimited: boolean;
  editionSize: number | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  collection: CollectionRef | null;
};

export type CollectionDTO = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  era: string | null;
  excerpt: string;
  lore: string;
  coverImage: string;
  ambientPreset: string;
  ambientUrl: string | null;
  productCount: number;
};

export type OracleCardDTO = {
  id: string;
  numeral: string;
  name: string;
  keyword: string;
  interpretation: string;
  image: string;
  product: { slug: string; title: string; type: ProductType } | null;
};

export type ArtworkDTO = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  materials: string;
  dimensions: string | null;
  description: string;
  image: string;
  imageHiRes: string | null;
  audioUrl: string | null;
  audioTranscript: string | null;
  product: { slug: string; title: string; price: number; availability: Availability } | null;
};

export type JournalPostDTO = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  rubric: JournalRubric;
  coverImage: string | null;
  author: string;
  readingTime: number;
  publishedAt: string;
};

export type VenueDTO = {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  address: string | null;
  url: string | null;
  latitude: number;
  longitude: number;
  isStudio: boolean;
};

export type PromoRule = {
  code: string;
  type: "PERCENT" | "FREE_SHIPPING";
  value: number;
  minSubtotal: number | null;
  excludeOriginals: boolean;
  description: string | null;
};
