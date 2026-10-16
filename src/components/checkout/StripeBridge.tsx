"use client";

import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe, type StripeElements } from "@stripe/stripe-js";
import { createContext, useContext, useMemo, type ReactNode } from "react";

type Bridge = { stripe: Stripe | null; elements: StripeElements | null };

const BridgeContext = createContext<Bridge>({ stripe: null, elements: null });

/** Даёт доступ к Stripe вне компонентов, вложенных в <Elements>. */
export const useStripeBridge = () => useContext(BridgeContext);

function Inner({ children }: { children: ReactNode }) {
  const stripe = useStripe();
  const elements = useElements();
  return <BridgeContext.Provider value={{ stripe, elements }}>{children}</BridgeContext.Provider>;
}

const cache = new Map<string, ReturnType<typeof loadStripe>>();

export function StripeBridge({ publishableKey, children }: { publishableKey: string | null; children: ReactNode }) {
  const promise = useMemo(() => {
    if (!publishableKey) return null;
    if (!cache.has(publishableKey)) cache.set(publishableKey, loadStripe(publishableKey, { locale: "ru" }));
    return cache.get(publishableKey)!;
  }, [publishableKey]);

  if (!promise) return <>{children}</>;
  return (
    <Elements
      stripe={promise}
      options={{
        fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap" }],
      }}
    >
      <Inner>{children}</Inner>
    </Elements>
  );
}
