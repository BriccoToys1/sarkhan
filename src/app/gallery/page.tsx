import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Exhibition } from "@/components/gallery/Exhibition";
import { getArtworkPage } from "@/lib/data";

export const metadata: Metadata = {
  title: "Галерея — цифровой музей",
  description: "Виртуальная выставка оригинальных работ Сархана Грима: масло, офорт, сусальное золото. Лупа сверхвысокого разрешения и аудиогид художника.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const page = await getArtworkPage(0);
  return (
    <div className="bg-black">
      <PageHeader eyebrow="Цифровой музей" title="Выставочный зал">
        Работы висят в тёмном пространстве под лучами софитов. Коснитесь полотна, чтобы рассмотреть каждый штрих пера и трещину лака.
      </PageHeader>
      <Exhibition initial={page.items} next={page.next} total={page.total} />
    </div>
  );
}
