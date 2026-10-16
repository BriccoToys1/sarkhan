// Правила расчёта стоимости заказа (ТЗ, раздел 4.2). Используются и в браузере, и на сервере.
import type { ProductType, PromoRule, ShippingMethod } from "./types";

export const SHIPPING_RATES = {
  STANDARD: 1500,
  EXPRESS: 2500,
  EXPRESS_ORIGINAL: 15000,
} as const;

export type PricingLine = { price: number; quantity: number; type: ProductType };

export type ShippingOption = {
  method: ShippingMethod;
  title: string;
  carrier: string;
  cents: number;
  available: boolean;
  note: string;
};

const toCents = (n: number) => Math.round(n * 100);

export function hasOriginal(lines: PricingLine[]) {
  return lines.some((l) => l.type === "ORIGINAL" && l.quantity > 0);
}

export function shippingOptions(lines: PricingLine[]): ShippingOption[] {
  const original = hasOriginal(lines);
  return [
    {
      method: "STANDARD",
      title: "Стандартная",
      carrier: "AirMail с трек-номером",
      cents: SHIPPING_RATES.STANDARD,
      available: !original,
      note: original ? "Недоступна для оригиналов картин из-за веса и хрупкости" : "Фиксированная цена для мелких пакетов",
    },
    {
      method: "EXPRESS",
      title: "Экспресс",
      carrier: original ? "DHL Express · страхованная" : "DHL Express",
      cents: original ? SHIPPING_RATES.EXPRESS_ORIGINAL : SHIPPING_RATES.EXPRESS,
      available: true,
      note: original ? "Страховка, деревянный кофр и подпись при получении" : "Для колод, принтов и аксессуаров",
    },
  ];
}

/** Если выбранный способ недоступен — возвращает доступный. */
export function resolveShippingMethod(lines: PricingLine[], method: ShippingMethod): ShippingMethod {
  const option = shippingOptions(lines).find((o) => o.method === method);
  return option?.available ? method : "EXPRESS";
}

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  method: ShippingMethod;
  promoApplied: boolean;
  promoNote: string | null;
};

/** Все суммы — в центах. */
export function calculateTotals(lines: PricingLine[], method: ShippingMethod, promo: PromoRule | null): Totals {
  const active = lines.filter((l) => l.quantity > 0);
  const subtotal = active.reduce((sum, l) => sum + toCents(l.price) * l.quantity, 0);
  const resolved = resolveShippingMethod(active, method);
  let shipping = active.length === 0 ? 0 : (shippingOptions(active).find((o) => o.method === resolved)?.cents ?? 0);
  let discount = 0;
  let promoApplied = false;
  let promoNote: string | null = null;

  if (promo && active.length > 0) {
    const min = promo.minSubtotal != null ? toCents(promo.minSubtotal) : 0;
    if (subtotal < min) {
      promoNote = `Действует при сумме заказа от $${(min / 100).toFixed(0)} — добавьте ещё $${((min - subtotal) / 100).toFixed(2)}`;
    } else if (promo.type === "PERCENT") {
      const eligible = active
        .filter((l) => !(promo.excludeOriginals && l.type === "ORIGINAL"))
        .reduce((sum, l) => sum + toCents(l.price) * l.quantity, 0);
      discount = Math.round((eligible * promo.value) / 100);
      promoApplied = discount > 0;
      if (!promoApplied) promoNote = "Скидка не распространяется на оригиналы картин";
      else if (eligible < subtotal) promoNote = `${promo.value}% — кроме оригиналов картин`;
      else promoNote = `${promo.value}% на весь заказ`;
    } else {
      shipping = 0;
      promoApplied = true;
      promoNote = "Доставка в подарок";
    }
  }

  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    method: resolved,
    promoApplied,
    promoNote,
  };
}
