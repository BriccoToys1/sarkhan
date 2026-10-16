"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { CardNumberElement } from "@stripe/react-stripe-js";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import { useCartTotals } from "@/hooks/useCartTotals";
import { useCartReady } from "@/hooks/useCartReady";
import { usePageTransition } from "@/components/providers/PageTransition";
import { Ouroboros } from "@/components/ui/Ouroboros";
import { btnGhost, btnPrimary, inputBox, labelText } from "@/components/ui/buttons";
import { COUNTRIES, deliveryEta, findCountry } from "@/lib/countries";
import { contactInfoSchema, type ContactInfo } from "@/lib/validation";
import { shippingOptions } from "@/lib/pricing";
import { formatCents } from "@/lib/format";
import { cvcValid, detectBrand, expiryValid, luhn } from "@/lib/card";
import type { PaymentConfig } from "@/lib/payments/config";
import type { CryptoCurrency, PaymentMethod } from "@/lib/types";
import { CardVisual, type CardErrors, type DemoCard, type StripeCompletion } from "./CardVisual";
import { AnimatedQR } from "./AnimatedQR";
import { OrderSummary } from "./OrderSummary";
import { StripeBridge, useStripeBridge } from "./StripeBridge";

type Step = 1 | 2 | 3;
type FieldKey = keyof ContactInfo;
type CreatedOrder = {
  orderId: string;
  token: string;
  number: number;
  total: number;
  next: { type: "stripe"; clientSecret: string } | { type: "coinbase"; hostedUrl: string } | { type: "demo" };
  method: PaymentMethod;
};

const STEPS: { n: Step; title: string }[] = [
  { n: 1, title: "Контакты" },
  { n: 2, title: "Доставка" },
  { n: 3, title: "Оплата" },
];

const CRYPTO: { code: CryptoCurrency; name: string; scheme: string }[] = [
  { code: "BTC", name: "Bitcoin", scheme: "bitcoin" },
  { code: "ETH", name: "Ethereum", scheme: "ethereum" },
  { code: "SOL", name: "Solana", scheme: "solana" },
];

const EMPTY: ContactInfo = { email: "", phone: "", name: "", country: "", city: "", postalCode: "", address: "" };

/** Контакты переживают перезагрузку вкладки; форма рисуется только после восстановления корзины, поэтому SSR-разметка не расходится. */
function restoreContact(): ContactInfo {
  if (typeof window === "undefined") return EMPTY;
  try {
    const saved = sessionStorage.getItem("sg-checkout-contact");
    return saved ? { ...EMPTY, ...(JSON.parse(saved) as Partial<ContactInfo>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function validate(values: ContactInfo) {
  const res = contactInfoSchema.safeParse(values);
  const errors: Partial<Record<FieldKey, string>> = {};
  if (!res.success) for (const issue of res.error.issues) errors[issue.path[0] as FieldKey] ??= issue.message;
  return errors;
}

export function CheckoutFlow({ config }: { config: PaymentConfig }) {
  return (
    <StripeBridge publishableKey={config.card === "stripe" ? config.stripePublishableKey : null}>
      <Flow config={config} />
    </StripeBridge>
  );
}

function Flow({ config }: { config: PaymentConfig }) {
  const ready = useCartReady();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const method = useCart((s) => s.shippingMethod);
  const setMethod = useCart((s) => s.setShippingMethod);
  const clear = useCart((s) => s.clear);
  const totals = useCartTotals();
  const { navigate } = usePageTransition();
  const { stripe, elements } = useStripeBridge();

  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState<ContactInfo>(restoreContact);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [payment, setPayment] = useState<PaymentMethod>(config.card !== "off" ? "CARD" : "CRYPTO");
  const [crypto, setCrypto] = useState<CryptoCurrency>("BTC");
  const [card, setCard] = useState<DemoCard>({ number: "", name: "", expiry: "", cvc: "" });
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [stripeState, setStripeState] = useState<StripeCompletion>({ number: false, expiry: false, cvc: false, brand: "unknown", error: null });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<CreatedOrder | null>(null);

  const errors = useMemo(() => validate(values), [values]);
  const options = useMemo(() => shippingOptions(lines), [lines]);
  const country = findCountry(values.country);

  useEffect(() => {
    try {
      sessionStorage.setItem("sg-checkout-contact", JSON.stringify(values));
    } catch {}
  }, [values]);

  useEffect(() => {
    if (totals.method !== method) setMethod(totals.method);
  }, [totals.method, method, setMethod]);

  // Опрос статуса крипто-платежа через шлюз
  useEffect(() => {
    if (!order || order.next.type !== "coinbase") return;
    const t = window.setInterval(async () => {
      const status = await confirm(order);
      if (status === "PAID") finish(order);
    }, 6000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const set = (key: FieldKey, value: string) => setValues((v) => ({ ...v, [key]: value }));
  const touch = (key: FieldKey) => setTouched((t) => ({ ...t, [key]: true }));
  const shownError = (key: FieldKey) => {
    if (key === "postalCode" && values.postalCode.length >= 3) return errors.postalCode;
    return touched[key] ? errors[key] : undefined;
  };

  const goShipping = () => {
    setTouched({ email: true, phone: true, name: true, country: true, city: true, postalCode: true, address: true });
    if (Object.keys(errors).length === 0) setStep(2);
  };

  async function confirm(o: CreatedOrder) {
    const res = await fetch(`/api/orders/${o.orderId}/confirm`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: o.token }) });
    const data = (await res.json()) as { ok: boolean; status?: string; error?: string };
    if (!data.ok) throw new Error(data.error ?? "Не удалось подтвердить оплату");
    return data.status;
  }

  function finish(o: CreatedOrder) {
    sessionStorage.removeItem("sg-checkout-contact");
    navigate(`/checkout/success?order=${o.orderId}&token=${encodeURIComponent(o.token)}`);
    window.setTimeout(clear, 600);
  }

  const validateCard = () => {
    if (payment !== "CARD") return true;
    if (config.card === "stripe") {
      if (!stripeState.number || !stripeState.expiry || !stripeState.cvc) {
        setError(stripeState.error ?? "Заполните данные карты");
        return false;
      }
      return true;
    }
    const brand = detectBrand(card.number);
    const e: CardErrors = {};
    if (!luhn(card.number)) e.number = "Номер карты не прошёл проверку";
    if (card.name.trim().length < 2) e.name = "Имя как на карте";
    if (!expiryValid(card.expiry)) e.expiry = "Неверный срок";
    if (!cvcValid(card.cvc, brand)) e.cvc = "Код с оборота";
    setCardErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = async () => {
    setError(null);
    if (!validateCard()) return;
    setProcessing(true);
    try {
      let current = order;
      if (!current || current.method !== payment) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact: values,
            shippingMethod: totals.method,
            paymentMethod: payment,
            cryptoCurrency: payment === "CRYPTO" ? crypto : undefined,
            promoCode: promo && totals.promoApplied ? promo.code : null,
            items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          }),
        });
        const data = (await res.json()) as Omit<CreatedOrder, "method"> & { ok: boolean; error?: string };
        if (!data.ok) throw new Error(data.error ?? "Ритуал прерван");
        current = { ...data, method: payment };
        setOrder(current);
      }

      if (current.next.type === "stripe") {
        const cardEl = elements?.getElement(CardNumberElement);
        if (!stripe || !cardEl) throw new Error("Платёжный шлюз ещё загружается");
        const result = await stripe.confirmCardPayment(current.next.clientSecret, {
          payment_method: {
            card: cardEl,
            billing_details: {
              name: card.name || values.name,
              email: values.email,
              phone: values.phone,
              address: { country: values.country, city: values.city, postal_code: values.postalCode, line1: values.address },
            },
          },
        });
        if (result.error) throw new Error(result.error.message ?? "Банк отклонил платёж");
        await confirm(current);
        finish(current);
        return;
      }

      if (current.next.type === "demo" && payment === "CARD") {
        await new Promise((r) => setTimeout(r, 1600));
        await confirm(current);
        finish(current);
        return;
      }
      // крипто: ждём перевода, панель с QR показана ниже
      setProcessing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ритуал прерван");
      setProcessing(false);
    }
  };

  const confirmDemoCrypto = async () => {
    if (!order) return;
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1400));
      const status = await confirm(order);
      if (status === "PAID") finish(order);
      else setProcessing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Перевод не найден");
      setProcessing(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex justify-center py-40">
        <Ouroboros className="h-12 w-12" />
      </div>
    );
  }

  if (lines.length === 0 && !order) {
    return (
      <div className="py-32 text-center">
        <p className="font-serif text-3xl italic text-ash">Чаша пуста — ритуалу нечего освящать.</p>
        <Link href="/shop" className={clsx(btnPrimary, "mt-10")}>
          Войти в Храм <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const awaitingCrypto = order !== null && order.method === "CRYPTO" && payment === "CRYPTO";
  const coinbaseUrl = awaitingCrypto && order.next.type === "coinbase" ? order.next.hostedUrl : null;
  const wallet = config.wallets[crypto];
  const scheme = CRYPTO.find((c) => c.code === crypto)!.scheme;

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ol className="mb-12 flex items-center" aria-label="Шаги оформления">
          {STEPS.map((s, i) => (
            <li key={s.n} className={clsx("flex items-center", i < STEPS.length - 1 && "flex-1")}>
              <button
                type="button"
                disabled={s.n > step || processing || Boolean(order)}
                onClick={() => setStep(s.n)}
                className="flex items-center gap-3 disabled:cursor-default"
                aria-current={s.n === step ? "step" : undefined}
              >
                <span
                  className={clsx(
                    "flex h-9 w-9 rotate-45 items-center justify-center border transition-colors duration-500",
                    s.n < step ? "border-gold bg-gold text-obsidian" : s.n === step ? "border-gold text-gold shadow-gold-glow" : "border-gold/20 text-ash",
                  )}
                >
                  <span className="-rotate-45 font-display text-xs">{s.n < step ? <Check className="h-3.5 w-3.5" /> : s.n}</span>
                </span>
                <span className={clsx("hidden font-display text-[0.6rem] uppercase tracking-[0.24em] sm:block", s.n === step ? "text-gold" : "text-ash")}>
                  Шаг {s.n}: {s.title}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span className="mx-4 h-px flex-1 bg-gold/15">
                  <span className="block h-full bg-gold transition-all duration-700" style={{ width: s.n < step ? "100%" : "0%" }} />
                </span>
              )}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45 }} aria-labelledby="s1-title">
              <h2 id="s1-title" className="mb-8 font-serif text-3xl uppercase tracking-[0.12em] text-parchment">Контакты и адрес</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Email" error={shownError("email")}>
                  <input type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => touch("email")} placeholder="elizabeth@esoteric.org" className={inputClass(shownError("email"))} />
                </Field>
                <Field label="Телефон" error={shownError("phone")}>
                  <input type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => touch("phone")} placeholder="+420 777 131 313" className={inputClass(shownError("phone"))} />
                </Field>
                <Field label="Имя получателя" error={shownError("name")} wide>
                  <input autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={() => touch("name")} placeholder="Элизабет Кроули" className={inputClass(shownError("name"))} />
                </Field>
                <Field label="Страна" error={shownError("country")}>
                  <span className="relative block">
                    <select
                      autoComplete="country"
                      value={values.country}
                      onChange={(e) => {
                        set("country", e.target.value);
                        touch("country");
                      }}
                      className={clsx(inputClass(shownError("country")), "appearance-none pr-10")}
                    >
                      <option value="">Выберите страну</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                  </span>
                </Field>
                <Field label="Город" error={shownError("city")}>
                  <input autoComplete="address-level2" value={values.city} onChange={(e) => set("city", e.target.value)} onBlur={() => touch("city")} placeholder="Прага" className={inputClass(shownError("city"))} />
                </Field>
                <Field label="Индекс" error={shownError("postalCode")} hint={country ? `Формат: ${country.postalHint}` : undefined}>
                  <input autoComplete="postal-code" value={values.postalCode} onChange={(e) => set("postalCode", e.target.value.toUpperCase())} onBlur={() => touch("postalCode")} placeholder={country?.postalHint ?? "110 00"} className={inputClass(shownError("postalCode"))} />
                </Field>
                <Field label="Адрес" error={shownError("address")}>
                  <input autoComplete="street-address" value={values.address} onChange={(e) => set("address", e.target.value)} onBlur={() => touch("address")} placeholder="ул. Тёмных Ритуалов, 13, кв. 7" className={inputClass(shownError("address"))} />
                </Field>
              </div>
              <div className="mt-10 flex justify-end">
                <button type="button" onClick={goShipping} className={btnPrimary}>
                  К способу доставки <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45 }} aria-labelledby="s2-title">
              <h2 id="s2-title" className="mb-2 font-serif text-3xl uppercase tracking-[0.12em] text-parchment">Способ доставки</h2>
              <p className="mb-8 text-sm text-ash">
                {country?.name}, {values.city} — сроки рассчитаны для вашей страны.
              </p>
              <div className="space-y-4" role="radiogroup" aria-label="Способ доставки">
                {options.map((o) => {
                  const [min, max] = deliveryEta(values.country, o.method);
                  const selected = totals.method === o.method;
                  return (
                    <button
                      key={o.method}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={!o.available}
                      onClick={() => setMethod(o.method)}
                      className={clsx(
                        "flex w-full items-start gap-5 border p-5 text-left transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-40",
                        selected ? "border-gold bg-gold/5 shadow-gold-glow" : "border-gold/15 hover:border-gold/40",
                      )}
                    >
                      <span className={clsx("mt-1 flex h-4 w-4 shrink-0 rotate-45 items-center justify-center border", selected ? "border-gold" : "border-gold/40")}>
                        {selected && <span className="h-2 w-2 bg-gold" />}
                      </span>
                      <span className="flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-serif text-xl text-parchment">
                            {o.title} <span className="text-base text-ash">· {o.carrier}</span>
                          </span>
                          <span className="font-display text-lg text-gold">{promo?.type === "FREE_SHIPPING" && totals.promoApplied ? "Бесплатно" : formatCents(o.cents)}</span>
                        </span>
                        <span className="mt-1 block text-xs text-ash">
                          {o.available ? `${min}–${max} дней · ${o.note}` : o.note}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className={btnGhost}>
                  <ArrowLeft className="h-4 w-4" /> Назад
                </button>
                <button type="button" onClick={() => setStep(3)} className={btnPrimary}>
                  К оплате <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45 }} aria-labelledby="s3-title">
              <h2 id="s3-title" className="mb-8 font-serif text-3xl uppercase tracking-[0.12em] text-parchment">Мистический платёжный шлюз</h2>

              <div className="mb-10 grid grid-cols-2 border border-gold/20" role="tablist" aria-label="Способ оплаты">
                {(
                  [
                    ["CARD", "Кредитная карта", config.card !== "off", <CreditCard key="c" className="h-4 w-4" />],
                    ["CRYPTO", "Криптовалюта", config.crypto !== "off", <Sparkles key="s" className="h-4 w-4" />],
                  ] as const
                ).map(([key, label, enabled, icon]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={payment === key}
                    disabled={!enabled || processing}
                    onClick={() => {
                      setPayment(key);
                      setError(null);
                    }}
                    className={clsx(
                      "flex items-center justify-center gap-2 py-4 font-display text-[0.62rem] uppercase tracking-[0.24em] transition-colors disabled:opacity-40",
                      payment === key ? "bg-gold text-obsidian" : "text-ash hover:text-parchment",
                    )}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {payment === "CARD" ? (
                <div className="py-4">
                  <CardVisual
                    mode={config.card === "stripe" ? "stripe" : "demo"}
                    card={card}
                    errors={cardErrors}
                    onChange={(patch) => {
                      setCard((c) => ({ ...c, ...patch }));
                      setCardErrors((e) => {
                        const next = { ...e };
                        for (const k of Object.keys(patch)) delete next[k as keyof DemoCard];
                        return next;
                      });
                    }}
                    onStripeChange={(s) => setStripeState((p) => ({ ...p, ...s }))}
                  />
                  <p className="mt-6 text-center text-xs text-ash">
                    {config.card === "stripe" ? "Платёж защищён Stripe · 3-D Secure" : "Демо-режим: подойдёт тестовая карта 4242 4242 4242 4242"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 py-2 text-center">
                  <div className="flex gap-2">
                    {CRYPTO.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        disabled={Boolean(order)}
                        onClick={() => setCrypto(c.code)}
                        aria-pressed={crypto === c.code}
                        className={clsx(
                          "border px-4 py-2 font-display text-[0.6rem] uppercase tracking-[0.22em] transition-colors",
                          crypto === c.code ? "border-gold text-gold" : "border-gold/15 text-ash hover:text-parchment",
                        )}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                  {coinbaseUrl ? (
                    <>
                      <AnimatedQR value={coinbaseUrl} />
                      <p className="max-w-sm text-sm text-ash">Отсканируйте код или откройте шлюз Coinbase Commerce. Страница обновится сама, когда сеть подтвердит перевод.</p>
                      <a href={coinbaseUrl} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                        Открыть платёжный шлюз <ExternalLink className="h-4 w-4" />
                      </a>
                      <span className="flex items-center gap-3 text-xs text-gold">
                        <Ouroboros className="h-5 w-5" /> Ожидаем подтверждения сети…
                      </span>
                    </>
                  ) : config.crypto === "coinbase" ? (
                    <p className="max-w-sm py-10 font-serif text-lg italic text-ash">Адрес для перевода в {crypto} будет сформирован платёжным шлюзом Coinbase Commerce после подтверждения заказа.</p>
                  ) : (
                    <>
                      <AnimatedQR value={`${scheme}:${wallet}`} />
                      <div>
                        <p className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold">Сумма к переводу: {formatCents(totals.total)} в {crypto}</p>
                        <p className="mt-2 break-all font-mono text-xs text-ash">{wallet}</p>
                      </div>
                      {awaitingCrypto && (
                        <button type="button" onClick={confirmDemoCrypto} disabled={processing} className={btnPrimary}>
                          {processing ? <Ouroboros className="h-6 w-6" /> : "Я совершил перевод"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {error && (
                <p role="alert" className="mt-6 border border-crimson/50 bg-crimson/10 px-4 py-3 text-sm text-crimson-light">
                  {error}
                </p>
              )}

              {!awaitingCrypto && (
                <div className="mt-10 flex flex-col-reverse justify-between gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setOrder(null);
                      setStep(2);
                    }}
                    disabled={processing}
                    className={btnGhost}
                  >
                    <ArrowLeft className="h-4 w-4" /> Назад
                  </button>
                  <button type="button" onClick={pay} disabled={processing} className={clsx(btnPrimary, "min-w-[280px]")} aria-busy={processing}>
                    {processing ? (
                      <>
                        <Ouroboros className="h-7 w-7" />
                        <span className="sr-only">Ритуал оплаты исполняется</span>
                      </>
                    ) : (
                      <>
                        Завершить ритуал оплаты · {formatCents(totals.total)}
                      </>
                    )}
                  </button>
                </div>
              )}
              {config.card === "demo" || config.crypto === "demo" ? (
                <p className="mt-6 text-center text-[0.68rem] text-ash/60">Платёжные ключи не подключены — оплата проходит в демо-режиме, реальные деньги не списываются.</p>
              ) : null}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <div className="lg:col-span-5">
        <OrderSummary lines={lines} totals={totals} locked={Boolean(order)} />
      </div>
    </div>
  );
}

function inputClass(error?: string) {
  return clsx(inputBox, error && "border-crimson bg-crimson/[0.06] focus:border-crimson");
}

function Field({ label, error, hint, wide, children }: { label: string; error?: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={clsx("block", wide && "sm:col-span-2")}>
      <span className={labelText}>{label}</span>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.span key="e" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-1.5 block text-xs text-crimson-light" role="alert">
            {error}
          </motion.span>
        ) : hint ? (
          <span className="mt-1.5 block text-[0.68rem] text-ash/60">{hint}</span>
        ) : null}
      </AnimatePresence>
    </label>
  );
}
