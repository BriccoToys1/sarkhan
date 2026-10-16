import { plural } from "./format";
import type { Availability, ContactTopic, JournalRubric, OrderStatus, ProductDTO, ProductType } from "./types";

/** Подписи групп фильтра «Тип товара» */
export const TYPE_FILTER_LABELS: Record<ProductType, string> = {
  DECK: "Колоды",
  PRINT: "Принты",
  ORIGINAL: "Картины",
  ACCESSORY: "Аксессуары",
  BOOK: "Книги",
};

/** Категория на карточке товара */
export const TYPE_LABELS: Record<ProductType, string> = {
  DECK: "Колоды Таро",
  PRINT: "Арт-принты",
  ORIGINAL: "Оригиналы картин",
  ACCESSORY: "Аксессуары",
  BOOK: "Гримуары",
};

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  IN_STOCK: "В наличии",
  PRE_ORDER: "Под заказ",
  SOLD_OUT: "Продано",
};

export const RUBRIC_LABELS: Record<JournalRubric, string> = {
  SYMBOLISM: "Символизм",
  TAROT_HISTORY: "История Таро",
  ALCHEMY_ART: "Алхимия и искусство",
  STUDIO_NEWS: "Новости мастерской",
};

export const CONTACT_TOPICS: Record<ContactTopic, string> = {
  COLLABORATION: "Сотрудничество",
  CUSTOM_PAINTING: "Индивидуальный заказ картины",
  DELIVERY: "Проблемы с доставкой",
  PRESS: "Пресса",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Ожидает оплаты",
  PAID: "Оплачен",
  PACKED: "Собран",
  SHIPPED: "В пути",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
};

export function availabilityLabel(p: Pick<ProductDTO, "availability" | "stock" | "type" | "leadTimeDays" | "isLimited">) {
  if (p.availability === "SOLD_OUT") return "Продано";
  if (p.availability === "PRE_ORDER") {
    return p.leadTimeDays ? `Под заказ (${p.leadTimeDays} ${plural(p.leadTimeDays, ["день", "дня", "дней"])})` : "Под заказ";
  }
  if (p.type === "ORIGINAL" && p.stock === 1) return "Единственный экземпляр";
  if (p.stock > 0 && p.stock <= 15) return `В наличии (осталось ${p.stock} шт.)`;
  return "В наличии";
}

/** Максимальное количество в корзине: null — без ограничений (предзаказ). */
export function maxQuantity(p: Pick<ProductDTO, "availability" | "stock">) {
  if (p.availability === "SOLD_OUT") return 0;
  if (p.availability === "PRE_ORDER") return null;
  return Math.max(0, p.stock);
}
