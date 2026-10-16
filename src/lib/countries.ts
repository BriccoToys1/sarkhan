export type Zone = "EU" | "EUROPE" | "AMERICAS" | "ASIA" | "OCEANIA" | "OTHER";

export type Country = { code: string; name: string; zone: Zone; postal: RegExp | null; postalHint: string };

const c = (code: string, name: string, zone: Zone, postal: RegExp | null, postalHint: string): Country => ({
  code,
  name,
  zone,
  postal,
  postalHint,
});

export const COUNTRIES: Country[] = [
  c("RU", "Россия", "EUROPE", /^\d{6}$/, "123456"),
  c("BY", "Беларусь", "EUROPE", /^\d{6}$/, "220030"),
  c("KZ", "Казахстан", "ASIA", /^([A-Z]\d{2}[A-Z]\d[A-Z]\d|\d{6})$/i, "050000"),
  c("UA", "Украина", "EUROPE", /^\d{5}$/, "01001"),
  c("AM", "Армения", "EUROPE", /^\d{4}$/, "0010"),
  c("GE", "Грузия", "EUROPE", /^\d{4}$/, "0105"),
  c("AZ", "Азербайджан", "EUROPE", /^(AZ\s?)?\d{4}$/i, "AZ 1000"),
  c("RS", "Сербия", "EUROPE", /^\d{5}$/, "11000"),
  c("TR", "Турция", "EUROPE", /^\d{5}$/, "34000"),
  c("CZ", "Чехия", "EU", /^\d{3}\s?\d{2}$/, "110 00"),
  c("DE", "Германия", "EU", /^\d{5}$/, "10115"),
  c("AT", "Австрия", "EU", /^\d{4}$/, "1010"),
  c("FR", "Франция", "EU", /^\d{5}$/, "75004"),
  c("IT", "Италия", "EU", /^\d{5}$/, "00184"),
  c("ES", "Испания", "EU", /^\d{5}$/, "28001"),
  c("PT", "Португалия", "EU", /^\d{4}-\d{3}$/, "1100-148"),
  c("NL", "Нидерланды", "EU", /^\d{4}\s?[A-Z]{2}$/i, "1012 AB"),
  c("BE", "Бельгия", "EU", /^\d{4}$/, "1000"),
  c("PL", "Польша", "EU", /^\d{2}-\d{3}$/, "00-001"),
  c("HU", "Венгрия", "EU", /^\d{4}$/, "1051"),
  c("GR", "Греция", "EU", /^\d{3}\s?\d{2}$/, "105 57"),
  c("FI", "Финляндия", "EU", /^\d{5}$/, "00100"),
  c("SE", "Швеция", "EU", /^\d{3}\s?\d{2}$/, "111 22"),
  c("DK", "Дания", "EU", /^\d{4}$/, "1050"),
  c("EE", "Эстония", "EU", /^\d{5}$/, "10111"),
  c("LV", "Латвия", "EU", /^(LV-?)?\d{4}$/i, "LV-1050"),
  c("LT", "Литва", "EU", /^(LT-?)?\d{5}$/i, "LT-01100"),
  c("IE", "Ирландия", "EU", /^[A-Z]\d[\dW]\s?[A-Z\d]{4}$/i, "D02 X285"),
  c("NO", "Норвегия", "EUROPE", /^\d{4}$/, "0150"),
  c("CH", "Швейцария", "EUROPE", /^\d{4}$/, "8001"),
  c("GB", "Великобритания", "EUROPE", /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, "NW1 2BA"),
  c("IS", "Исландия", "EUROPE", /^\d{3}$/, "101"),
  c("IL", "Израиль", "ASIA", /^\d{7}$/, "6100000"),
  c("AE", "ОАЭ", "ASIA", null, "—"),
  c("IN", "Индия", "ASIA", /^\d{6}$/, "110001"),
  c("CN", "Китай", "ASIA", /^\d{6}$/, "100000"),
  c("JP", "Япония", "ASIA", /^\d{3}-?\d{4}$/, "150-0042"),
  c("KR", "Южная Корея", "ASIA", /^\d{5}$/, "03187"),
  c("SG", "Сингапур", "ASIA", /^\d{6}$/, "018956"),
  c("TH", "Таиланд", "ASIA", /^\d{5}$/, "10200"),
  c("US", "США", "AMERICAS", /^\d{5}(-\d{4})?$/, "10001"),
  c("CA", "Канада", "AMERICAS", /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, "M5V 2T6"),
  c("MX", "Мексика", "AMERICAS", /^\d{5}$/, "06000"),
  c("BR", "Бразилия", "AMERICAS", /^\d{5}-?\d{3}$/, "01310-100"),
  c("AR", "Аргентина", "AMERICAS", /^([A-Z]\d{4}[A-Z]{3}|\d{4})$/i, "C1063"),
  c("AU", "Австралия", "OCEANIA", /^\d{4}$/, "2000"),
  c("NZ", "Новая Зеландия", "OCEANIA", /^\d{4}$/, "1010"),
];

const GENERIC = /^[A-Z0-9][A-Z0-9 -]{1,9}$/i;

export const COUNTRY_CODES = COUNTRIES.map((x) => x.code);

export function findCountry(code: string) {
  return COUNTRIES.find((x) => x.code === code) ?? null;
}

/** Проверка индекса по формату почтовой службы страны. */
export function isValidPostal(countryCode: string, value: string) {
  const country = findCountry(countryCode);
  const v = value.trim();
  if (!country) return GENERIC.test(v);
  if (!country.postal) return v === "" || GENERIC.test(v) || v === "—";
  return country.postal.test(v);
}

export function postalRequired(countryCode: string) {
  return findCountry(countryCode)?.postal != null;
}

/** Сроки доставки в днях: [мин, макс] */
export function deliveryEta(countryCode: string, method: "STANDARD" | "EXPRESS"): [number, number] {
  const zone = findCountry(countryCode)?.zone ?? "OTHER";
  if (method === "EXPRESS") {
    if (zone === "EU") return [2, 4];
    if (zone === "EUROPE") return [3, 6];
    return [4, 8];
  }
  if (zone === "EU") return [7, 14];
  if (zone === "EUROPE") return [10, 21];
  return [14, 30];
}
