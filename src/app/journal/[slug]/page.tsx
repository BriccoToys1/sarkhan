import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { ArtImage } from "@/components/ui/ArtImage";
import { Vignette } from "@/components/ui/Vignette";
import { getJournalPost, getJournalPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { RUBRIC_LABELS } from "@/lib/labels";
import { Markdown } from "@/lib/markdown";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return (await getJournalPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getJournalPost(slug);
  if (!data) return { title: "Запись не найдена" };
  return {
    title: data.post.title,
    description: data.post.excerpt,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: { type: "article", title: data.post.title, description: data.post.excerpt, publishedTime: data.post.publishedAt },
  };
}

export default function JournalPostPage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-screen max-w-3xl animate-pulse px-6 pt-40" />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: Pick<PageProps<"/journal/[slug]">, "params">) {
  const { slug } = await params;
  const data = await getJournalPost(slug);
  if (!data) notFound();
  const { post, newer, older } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Sarkhan Grim" },
    mainEntityOfPage: `${SITE.url}/journal/${post.slug}`,
  };

  return (
    <article className="pb-28 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="mx-auto max-w-3xl px-6 text-center">
        <Link href="/journal" className="inline-flex items-center gap-1 font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold hover:text-parchment">
          <ChevronLeft className="h-3 w-3" /> Журнал
        </Link>
        <p className="mt-10 font-display text-[0.62rem] uppercase tracking-[0.34em] text-gold">{RUBRIC_LABELS[post.rubric]}</p>
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-parchment sm:text-6xl">{post.title}</h1>
        <p className="mt-6 font-serif text-lg italic text-ash">
          {post.author} · {formatDate(post.publishedAt)} · {post.readingTime} мин чтения
        </p>
        <Vignette className="mt-10" />
      </header>

      {post.coverImage && (
        <div className="mx-auto mt-14 max-w-5xl px-6">
          <div className="relative aspect-[12/7] overflow-hidden border border-gold/25 p-2 shadow-abyss">
            <div className="relative h-full w-full overflow-hidden">
              <ArtImage src={post.coverImage} alt="" fill sizes="(min-width:1024px) 960px, 95vw" className="object-cover" preload />
            </div>
          </div>
        </div>
      )}

      <div className="paper-grain mx-auto mt-16 max-w-3xl px-6 xl:max-w-[68rem] xl:pr-[22rem]">
        <div className="space-y-7 font-serif text-[1.35rem] leading-[1.75] text-parchment/85">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-gold/80">{post.excerpt}</p>
          <Markdown source={post.content} dropCap />
        </div>
      </div>

      <nav className="mx-auto mt-20 grid max-w-5xl gap-6 border-t border-gold/10 px-6 pt-12 sm:grid-cols-2" aria-label="Другие записи">
        {older ? (
          <Link href={`/journal/${older.slug}`} className="group">
            <span className="font-display text-[0.58rem] uppercase tracking-[0.26em] text-ash">← Предыдущая запись</span>
            <span className="mt-2 block font-serif text-2xl text-parchment group-hover:text-gold">{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={`/journal/${newer.slug}`} className="group sm:text-right">
            <span className="font-display text-[0.58rem] uppercase tracking-[0.26em] text-ash">Следующая запись →</span>
            <span className="mt-2 block font-serif text-2xl text-parchment group-hover:text-gold">{newer.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
