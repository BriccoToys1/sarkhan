export const SITE = {
  name: "Sarkhan Grim",
  tagline: "Mystical Cards & Esoteric Artifacts",
  description:
    "Авторские колоды Таро, оригиналы картин, офорты и ритуальные артефакты художника Сархана Грима. Готический романтизм, алхимия и тёмное оккультное искусство.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  email: "grim@mysticalcards.org",
  address: "Прага, Старе Место, Celetná 13",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Telegram", href: "https://t.me/" },
    { label: "Pinterest", href: "https://pinterest.com/" },
  ],
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
