import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArtImage } from "@/components/ui/ArtImage";
import { Glyph } from "@/components/ui/Glyph";
import { Ouroboros } from "@/components/ui/Ouroboros";
import { Vignette } from "@/components/ui/Vignette";
import { btnPrimary } from "@/components/ui/buttons";
import { SuccessEffects } from "@/components/checkout/SuccessEffects";
import { getCustomerOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/labels";
import { findCountry } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Связь с бездной установлена",
  robots: { index: false, follow: false },
};

export default function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <div className="relative overflow-hidden px-6 pb-32 pt-36">
      <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[120px]" aria-hidden />
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <Ouroboros className="h-12 w-12" />
          </div>
        }
      >
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SuccessContent({ searchParams }: Pick<PageProps<"/checkout/success">, "searchParams">) {
  const sp = await searchParams;
  const orderId = typeof sp.order === "string" ? sp.order : "";
  const token = typeof sp.token === "string" ? sp.token : "";
  const order = orderId && token ? await getCustomerOrder(orderId, token) : null;

  if (!order) {
    return (
      <div className="relative mx-auto max-w-xl text-center">
        <Glyph className="mx-auto h-16 w-16 text-gold/50" />
        <h1 className="mt-8 font-serif text-3xl uppercase tracking-[0.14em] text-parchment">Манускрипт не найден</h1>
        <p className="mt-4 font-serif text-xl text-ash">Ссылка на заказ устарела или повреждена. Проверьте письмо, которое мы отправили на вашу почту.</p>
        <Link href="/" className={`${btnPrimary} mt-10`}>
          Вернуться в Храм
        </Link>
      </div>
    );
  }

  const pending = order.status === "PENDING";

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <SuccessEffects orderId={order.id} token={token} pending={pending} />
      <div className="relative mx-auto h-28 w-28">
        <span className="absolute inset-0 rounded-full border border-gold/30 animate-breathe" />
        <Glyph animated className="relative h-28 w-28 p-4 text-gold drop-shadow-[0_0_20px_rgba(197,168,128,0.5)]" />
      </div>
      <h1 className="mt-10 font-serif text-3xl font-semibold uppercase tracking-[0.12em] text-gold sm:text-4xl">Ваша связь с бездной установлена</h1>
      <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-parchment/90">
        {pending
          ? "Мы ожидаем подтверждения перевода сетью. Как только оно придёт, Сархан Грим начнёт подготовку ваших артефактов."
          : "Сархан Грим начал подготовку ваших артефактов. Проверьте ваш почтовый ящик для получения манускрипта отправки."}
      </p>

      <div className="mt-12 border border-gold/20 bg-abyss p-8 text-left">
        <div className="flex flex-wrap justify-between gap-3 font-display text-[0.62rem] uppercase tracking-[0.24em]">
          <span className="text-gold">Заказ #{order.number}</span>
          <span className={pending ? "flex items-center gap-2 text-gold-light" : "text-ash"}>
            {pending && <Ouroboros className="h-4 w-4" />}
            Статус: {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
        <ul className="mt-6 space-y-3 border-t border-gold/10 pt-6">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-4">
              {i.image && (
                <span className="relative h-14 w-10 shrink-0 overflow-hidden border border-gold/20">
                  <ArtImage src={i.image} alt="" fill sizes="40px" className="object-cover" />
                </span>
              )}
              <span className="flex-1 font-serif text-lg text-parchment">
                {i.title} <span className="text-ash">× {i.quantity}</span>
              </span>
              <span className="font-display text-sm text-gold">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-1.5 border-t border-gold/10 pt-5 text-sm">
          {order.discount > 0 && (
            <div className="flex justify-between text-gold">
              <dt>Скидка</dt>
              <dd>−{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-ash">
            <dt>
              Доставка {order.shippingMethod === "EXPRESS" ? "DHL Express" : "AirMail"} → {findCountry(order.country)?.name ?? order.country}, {order.city}
            </dt>
            <dd>{order.shippingCost === 0 ? "Бесплатно" : formatPrice(order.shippingCost)}</dd>
          </div>
          <div className="flex justify-between pt-2 font-display text-base text-parchment">
            <dt>Итого</dt>
            <dd className="text-gold">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-8 border-t border-gold/10 pt-6">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.26em] text-parchment">Благословение оракула для вас</p>
          <p className="mt-3 font-serif text-xl italic text-gold-light">«{order.blessing}»</p>
        </div>
      </div>

      <Vignette className="my-12" />
      <Link href="/shop" className={btnPrimary}>
        Вернуться в Храм
      </Link>
    </div>
  );
}
