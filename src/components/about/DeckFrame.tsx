/** Одна фото-рамка колоды: высота у всех одинаковая, ширина — по фото админа. */
export function DeckFrame({ name, photoUrl }: { name: string; photoUrl: string }) {
  return (
    <figure className="flex flex-col items-center md:items-start">
      <div className="relative inline-flex h-52 max-w-full border border-gold/40 bg-abyss p-1.5 shadow-abyss sm:h-60">
        <div className="pointer-events-none absolute inset-2 z-10 border border-gold/20" aria-hidden />
        <div className="relative z-0 flex h-full max-w-full items-center justify-center overflow-hidden bg-obsidian/80">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- free-size admin photo: fixed height, natural width
            <img src={photoUrl} alt={name} className="h-full w-auto max-w-full object-contain" />
          ) : (
            <div className="flex h-full w-36 items-center justify-center px-2 text-center font-display text-[0.55rem] uppercase tracking-[0.2em] text-gold/35">
              Фото
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-3 max-w-full text-center font-display text-[0.58rem] uppercase leading-snug tracking-[0.16em] text-gold/85 md:text-left">
        {name}
      </figcaption>
    </figure>
  );
}
