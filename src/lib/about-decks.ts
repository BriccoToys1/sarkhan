/** Колоды хронологии «Об авторе» — ключ стабилен, имя видно на сайте и в админке. */
export type AboutDeck = {
  key: string;
  name: string;
  year: string;
};

export const ABOUT_DECKS: AboutDeck[] = [
  { key: "new-age", name: "New Age", year: "2023" },
  { key: "herald-of-the-night", name: "Herald of the Night", year: "2023" },
  { key: "lord-of-skull", name: "Lord of Skull", year: "2023" },
  { key: "red-robe", name: "Red Robe", year: "2023" },
  { key: "red-mercury", name: "Red Mercury", year: "2023" },
  { key: "world-classic-for-sarkhan", name: "World Classic for Sarkhan", year: "2023" },
  { key: "the-golden-age", name: "The Golden Age", year: "2024" },
  { key: "red-robe-reprint", name: "Red Robe (переиздание)", year: "2024" },
  { key: "red-mercury-reprint", name: "Red Mercury (переиздание)", year: "2024" },
  { key: "slavyanka", name: "Славянка", year: "2024" },
  { key: "scary-funny-tales", name: "Страшно-смешные сказки", year: "2024" },
  { key: "emotion-tarot", name: "Emotion Tarot", year: "2024" },
  { key: "the-secret-world", name: "The Secret World", year: "2025" },
  { key: "the-twilight-gate", name: "The Twilight Gate", year: "2025" },
  { key: "emotion-tarot-2026", name: "Emotion Tarot", year: "2026" },
  { key: "the-mystery-of-blood", name: "The Mystery of Blood", year: "2026" },
];

/** Примерные плейсхолдеры, пока админ не загрузил свои фото. */
export const DEFAULT_ABOUT_DECK_PHOTOS: Record<string, string> = {
  "new-age": "/art/products/lilith-deck-box.svg",
  "herald-of-the-night": "/art/products/hermetic-deck-box.svg",
  "lord-of-skull": "/art/products/bestiary-deck-box.svg",
  "red-robe": "/art/products/lilith-deck-cards.svg",
  "red-mercury": "/art/products/hermetic-deck-cards.svg",
  "world-classic-for-sarkhan": "/art/oracle/magician.svg",
  "the-golden-age": "/art/oracle/sun.svg",
  "red-robe-reprint": "/art/products/lilith-deck-cards.svg",
  "red-mercury-reprint": "/art/products/hermetic-deck-cards.svg",
  slavyanka: "/art/oracle/star.svg",
  "scary-funny-tales": "/art/oracle/devil.svg",
  "emotion-tarot": "/art/oracle/moon.svg",
  "the-secret-world": "/art/oracle/world.svg",
  "the-twilight-gate": "/art/oracle/hermit.svg",
  "emotion-tarot-2026": "/art/oracle/moon.svg",
  "the-mystery-of-blood": "/art/oracle/death.svg",
};

export function decksByYear(year: string) {
  return ABOUT_DECKS.filter((d) => d.year === year);
}

export function resolveDeckPhoto(key: string, photos: Record<string, string>) {
  const custom = photos[key]?.trim();
  if (custom) return custom;
  return DEFAULT_ABOUT_DECK_PHOTOS[key] ?? "";
}
