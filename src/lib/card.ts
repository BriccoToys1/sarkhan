export type CardBrand = "visa" | "mastercard" | "amex" | "mir" | "unionpay" | "unknown";

export function detectBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^220[0-4]/.test(n)) return "mir";
  if (/^62/.test(n)) return "unionpay";
  return "unknown";
}

export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  if (detectBrand(digits) === "amex") return digits.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 4);
  if (d.length === 1 && Number(d) > 1) return `0${d}`;
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function luhn(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export function expiryValid(value: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const end = new Date(year, month, 1);
  return end > now;
}

export function cvcValid(value: string, brand: CardBrand) {
  return brand === "amex" ? /^\d{4}$/.test(value) : /^\d{3}$/.test(value);
}
