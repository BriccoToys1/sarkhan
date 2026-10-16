import type { Metadata } from "next";
import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Доставка и оплата", alternates: { canonical: "/shipping" } };

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Поддержка искателя"
      title="Доставка и оплата"
      intro="Мы отправляем артефакты по всему миру из пражской мастерской."
      sections={[
        {
          title: "Стандартная доставка",
          body: <p>AirMail с трек-номером — $15 за заказ. Подходит для колод, принтов, книг и аксессуаров. Сроки: 7–14 дней по ЕС, 10–21 день по Европе, 14–30 дней в остальные страны.</p>,
        },
        {
          title: "Экспресс DHL",
          body: (
            <>
              <p>DHL Express — $25 для колод, принтов и аксессуаров, 2–8 рабочих дней.</p>
              <p>Оригиналы картин отправляются только страхованной доставкой DHL Express в деревянном кофре — $150. Стандартная доставка для оригиналов недоступна из-за веса и хрупкости.</p>
            </>
          ),
        },
        {
          title: "Промокоды",
          body: (
            <>
              <p>
                <span className="text-gold">OCCULT10</span> — скидка 10% на весь заказ, кроме оригиналов картин.
              </p>
              <p>
                <span className="text-gold">GRIMSHIPPING</span> — бесплатная доставка при сумме заказа от $200.
              </p>
            </>
          ),
        },
        {
          title: "Способы оплаты",
          body: <p>Банковские карты Visa, Mastercard, American Express через Stripe с 3-D Secure, а также криптовалюта (BTC, ETH, SOL) через Coinbase Commerce — для ценителей конфиденциальности.</p>,
        },
        {
          title: "Упаковка",
          body: <p>Каждый заказ заворачивается в вощёную бумагу и запечатывается сургучной печатью мастерской. После отправки вы получите письмо со ссылкой на отслеживание.</p>,
        },
      ]}
    />
  );
}
