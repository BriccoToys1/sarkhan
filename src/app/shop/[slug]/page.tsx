import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { ProductSpecs } from "@/components/shop/ProductSpecs";
import { ProductCard } from "@/components/shop/ProductCard";
import { ViewBeacon } from "@/components/shop/ViewBeacon";
import { Vignette } from "@/components/ui/Vignette";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { TYPE_LABELS } from "@/lib/labels";
import { Markdown } from "@/lib/markdown";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Артефакт не найден" };
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: product.title, description: product.shortDescription, type: "website" },
  };
}

export default function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/shop/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    description: product.shortDescription,
    image: product.images.map((i) => (i.startsWith("http") ? i : `${SITE.url}${i}`)),
    brand: { "@type": "Brand", name: "Sarkhan Grim" },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      url: `${SITE.url}/shop/${product.slug}`,
      availability:
        product.availability === "IN_STOCK"
          ? "https://schema.org/InStock"
          : product.availability === "PRE_ORDER"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/SoldOut",
    },
  };

  return (
    <article className="mx-auto max-w-7xl px-6 pb-28 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ViewBeacon kind="product" id={product.id} />
      <nav aria-label="Хлебные крошки" className="mb-10 flex flex-wrap items-center gap-2 font-display text-[0.6rem] uppercase tracking-[0.24em] text-ash">
        <Link href="/shop" className="flex items-center gap-1 text-gold hover:text-parchment">
          <ChevronLeft className="h-3 w-3" /> Храм артефактов
        </Link>
        {product.collection && (
          <>
            <span className="text-gold/30">/</span>
            <Link href={`/collections/${product.collection.slug}`} className="hover:text-gold">
              {product.collection.title}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} title={product.title} priority />
        </div>
        <div className="space-y-8 lg:col-span-6 lg:pt-4">
          <div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-display text-[0.6rem] uppercase tracking-[0.28em]">
              <span className="text-gold/60">SKU: {product.sku}</span>
              <span className="text-ash">{TYPE_LABELS[product.type]}</span>
            </div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-parchment sm:text-5xl">{product.title}</h1>
            {product.titleEn && <p className="mt-2 font-serif text-xl italic text-ash">{product.titleEn}</p>}
            <p className="mt-6 font-display text-3xl text-gold">{formatPrice(product.price)}</p>
          </div>
          <p className="font-serif text-xl italic leading-relaxed text-parchment/85">{product.shortDescription}</p>
          <ProductPurchase product={product} />
          <ProductSpecs product={product} />
        </div>
      </div>

      <section className="mx-auto mt-24 max-w-2xl">
        <Vignette className="mb-12" />
        <h2 className="eyebrow mb-6 text-center">Эзотерическое описание</h2>
        <div className="space-y-6 font-serif text-xl leading-relaxed text-parchment/85">
          <Markdown source={product.description} dropCap />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="mb-12 text-center font-serif text-3xl uppercase tracking-[0.14em] text-parchment">Родственные артефакты</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 pt-40 lg:grid-cols-2">
      <div className="aspect-[2/3] animate-pulse border border-gold/10 bg-abyss" />
      <div className="space-y-6 pt-4">
        <div className="h-3 w-40 animate-pulse bg-gold/10" />
        <div className="h-12 w-3/4 animate-pulse bg-gold/10" />
        <div className="h-8 w-32 animate-pulse bg-gold/10" />
        <div className="h-24 w-full animate-pulse bg-gold/5" />
      </div>
    </div>
  );
}
