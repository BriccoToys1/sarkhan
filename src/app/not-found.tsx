import Link from "next/link";
import { Glyph } from "@/components/ui/Glyph";
import { btnPrimary } from "@/components/ui/buttons";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Glyph animated className="h-24 w-24 text-gold/70" />
      <p className="mt-10 font-display text-7xl tracking-[0.2em] text-gold/40">CDIV</p>
      <h1 className="mt-4 font-serif text-3xl uppercase tracking-[0.14em] text-parchment">Путь потерян во тьме</h1>
      <p className="mt-4 max-w-md font-serif text-xl text-ash">Эта дверь ведёт в пустоту. Возможно, артефакт уже обрёл владельца или страница переместилась в другой зал.</p>
      <Link href="/" className={`${btnPrimary} mt-10`}>
        Вернуться в Храм
      </Link>
    </div>
  );
}
