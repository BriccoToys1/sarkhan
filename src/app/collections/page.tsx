import type { Metadata } from "next";
import { CollectionCover } from "@/components/collections/CollectionCover";
import { getCollections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Коллекции — художественные вселенные",
  description: "«Тень Лилит», «Герметическая Алхимия», «Средневековый Бестиарий» — вселенные и эпохи творчества Сархана Грима.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <>
      <h1 className="sr-only">Коллекции Сархана Грима</h1>
      {collections.map((c, i) => (
        <CollectionCover key={c.id} collection={c} index={i} />
      ))}
    </>
  );
}
