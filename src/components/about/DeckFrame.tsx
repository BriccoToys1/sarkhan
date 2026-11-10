import { ArtImage } from "@/components/ui/ArtImage";

/** Одна фото-рамка колоды — всегда справа от линии хронологии. */
export function DeckFrame({ name, photoUrl }: { name: string; photoUrl: string }) {
  return (
    <figure className="mx-auto w-full max-w-[11rem] sm:max-w-[13rem]">
      <div className="relative aspect-[2/3] w-full border border-gold/40 bg-abyss p-1.5 shadow-abyss">
        <div className="pointer-events-none absolute inset-2 z-10 border border-gold/20" aria-hidden />
        <div className="relative h-full w-full overflow-hidden bg-obsidian/80">
          {photoUrl ? (
            <ArtImage src={photoUrl} alt={name} fill sizes="208px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center font-display text-[0.55rem] uppercase tracking-[0.2em] text-gold/35">
              Фото
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-center font-display text-[0.58rem] uppercase leading-snug tracking-[0.16em] text-gold/85">
        {name}
      </figcaption>
    </figure>
  );
}
