import { ArtImage } from "@/components/ui/ArtImage";

export function DeckFrame({
  name,
  photoUrl,
  align = "left",
}: {
  name: string;
  photoUrl: string;
  align?: "left" | "right";
}) {
  return (
    <figure className={`flex w-[7.5rem] shrink-0 flex-col gap-2 sm:w-36 ${align === "right" ? "items-end" : "items-start"}`}>
      <div className="relative aspect-[2/3] w-full border border-gold/40 bg-abyss p-1.5 shadow-abyss">
        <div className="pointer-events-none absolute inset-2 z-10 border border-gold/20" aria-hidden />
        <div className="relative h-full w-full overflow-hidden bg-obsidian/80">
          {photoUrl ? (
            <ArtImage src={photoUrl} alt={name} fill sizes="144px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center font-display text-[0.5rem] uppercase tracking-[0.2em] text-gold/35">
              Фото
            </div>
          )}
        </div>
      </div>
      <figcaption
        className={`font-display text-[0.55rem] uppercase leading-snug tracking-[0.16em] text-gold/85 ${align === "right" ? "text-right" : "text-left"}`}
      >
        {name}
      </figcaption>
    </figure>
  );
}

export function DeckFrames({
  decks,
  photos,
  align = "left",
  label,
}: {
  decks: { key: string; name: string }[];
  photos: Record<string, string>;
  align?: "left" | "right";
  label: string;
}) {
  if (!decks.length) return null;
  return (
    <ul
      className={`mt-6 flex flex-wrap gap-4 sm:gap-5 ${align === "right" ? "justify-end" : "justify-start"}`}
      aria-label={label}
    >
      {decks.map((d) => (
        <li key={d.key}>
          <DeckFrame name={d.name} photoUrl={photos[d.key] ?? ""} align={align} />
        </li>
      ))}
    </ul>
  );
}
