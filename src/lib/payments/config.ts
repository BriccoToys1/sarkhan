export type CardMode = "stripe" | "demo" | "off";
export type CryptoMode = "coinbase" | "demo" | "off";

export type PaymentConfig = {
  card: CardMode;
  crypto: CryptoMode;
  stripePublishableKey: string | null;
  /** Адреса кошельков для демо-режима (QR) */
  wallets: Record<"BTC" | "ETH" | "SOL", string>;
};

const demoAllowed = () => process.env.PAYMENTS_DEMO !== "false";

export function getPaymentConfig(): PaymentConfig {
  const stripeReady = Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const coinbaseReady = Boolean(process.env.COINBASE_COMMERCE_API_KEY);
  return {
    card: stripeReady ? "stripe" : demoAllowed() ? "demo" : "off",
    crypto: coinbaseReady ? "coinbase" : demoAllowed() ? "demo" : "off",
    stripePublishableKey: stripeReady ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY! : null,
    wallets: {
      BTC: process.env.CRYPTO_WALLET_BTC ?? "bc1qsarkhangrimdemo0000000000000000000000",
      ETH: process.env.CRYPTO_WALLET_ETH ?? "0x5a7c0000000000000000000000000000000d3a0",
      SOL: process.env.CRYPTO_WALLET_SOL ?? "GR1MdemoSoLaNa111111111111111111111111111",
    },
  };
}
