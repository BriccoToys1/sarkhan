import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { getPaymentConfig } from "@/lib/payments/config";

export const metadata: Metadata = {
  title: "Оформление заказа — завершение ритуала",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 pt-32">
      <header className="mb-14">
        <span className="eyebrow mb-4 block">Завершение ритуала</span>
        <h1 className="font-serif text-4xl font-semibold uppercase tracking-[0.12em] text-parchment sm:text-5xl">Оформление заказа</h1>
      </header>
      <CheckoutFlow config={getPaymentConfig()} />
    </div>
  );
}
