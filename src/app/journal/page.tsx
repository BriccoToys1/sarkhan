import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { JournalIndex } from "@/components/journal/JournalIndex";
import { getJournalPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Журнал — эзотерический блог",
  description: "Символизм, история Таро, алхимия в искусстве и новости мастерской Сархана Грима.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const posts = await getJournalPosts();
  return (
    <>
      <PageHeader eyebrow="Гримуар мыслей" title="Эзотерический журнал">
        Записи о символах, картах и алхимии — в духе мистических альманахов XIX века.
      </PageHeader>
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <JournalIndex posts={posts} />
      </section>
    </>
  );
}
