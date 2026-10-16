import { DEFAULT_SITE } from "./site-config";

/** Sync fallback for modules that cannot await DB (emails, build-time metadata). */
export const SITE = {
  ...DEFAULT_SITE,
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};

export const NAV = [
  { href: "/shop", label: "Магазин" },
  { href: "/collections", label: "Коллекции" },
  { href: "/gallery", label: "Галерея" },
  { href: "/about", label: "Об авторе" },
  { href: "/journal", label: "Журнал" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const BLESSINGS = [
  "Пусть огонь вашей воли осветит самые тёмные лабиринты разума.",
  "Покров Верховной Жрицы хранит ваши тайны и истинное знание.",
  "Впереди вас ждёт алхимическая трансформация судьбы — не бойтесь чёрной стадии.",
  "Силы четырёх стихий призваны охранять ваш порог.",
  "Луна этой ночью смотрит на вас благосклонно. Слушайте сны.",
  "То, что вы ищете, уже ищет вас. Оставьте дверь приоткрытой.",
  "Пусть ваши карты говорят тихо, а вы — слышите каждое слово.",
  "Змей кусает свой хвост: всё, что вы отдаёте, вернётся к вам преображённым.",
];
