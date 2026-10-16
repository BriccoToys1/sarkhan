import type { Metadata } from "next";
import { InfoPage } from "@/components/layout/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Политика конфиденциальности", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Поддержка искателя"
      title="Политика конфиденциальности"
      intro="Ваши тайны остаются вашими."
      sections={[
        { title: "Какие данные мы собираем", body: <p>Имя, email, телефон и адрес доставки — только для выполнения заказа. Email подписчиков «Оккультного вестника» — для рассылки, на которую вы согласились.</p> },
        { title: "Платёжные данные", body: <p>Данные банковских карт обрабатываются Stripe и не попадают на наши серверы. Криптоплатежи обрабатывает Coinbase Commerce.</p> },
        { title: "Хранение корзины", body: <p>Содержимое корзины хранится в localStorage вашего браузера и не передаётся третьим лицам. Мы не используем рекламные трекеры.</p> },
        { title: "Передача третьим лицам", body: <p>Адрес и телефон передаются только службе доставки (Почта или DHL) для отправки вашего заказа.</p> },
        {
          title: "Удаление данных",
          body: (
            <p>
              Чтобы удалить свои данные или отписаться от рассылки, напишите на <a href={`mailto:${SITE.email}`} className="text-gold hover:text-parchment">{SITE.email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
