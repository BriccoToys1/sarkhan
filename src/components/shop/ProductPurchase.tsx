"use client";

import { useState } from "react";
import clsx from "clsx";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ChaliceIcon } from "@/components/ui/icons";
import { btnPrimary } from "@/components/ui/buttons";
import { useCart, lineLimit } from "@/store/cart";
import { availabilityLabel } from "@/lib/labels";
import type { ProductDTO } from "@/lib/types";

export function ProductPurchase({ product, onAdded }: { product: ProductDTO; onAdded?: () => void }) {
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.lines.find((l) => l.productId === product.id)?.quantity ?? 0);
  const limit = Math.max(0, lineLimit(product) - inCart);
  const [qty, setQty] = useState(1);
  const soldOut = product.availability === "SOLD_OUT";
  const disabled = soldOut || limit <= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-ash">
        <span
          className={clsx(
            "h-1.5 w-1.5 rounded-full",
            soldOut ? "bg-crimson-light" : product.availability === "PRE_ORDER" ? "bg-gold/60" : "bg-gold animate-breathe",
          )}
        />
        {availabilityLabel(product)}
        {product.isLimited && product.editionSize ? <span className="text-gold/70">· тираж {product.editionSize} экз.</span> : null}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {!disabled && <QuantitySelector value={Math.min(qty, limit)} onChange={setQty} max={limit} />}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            add(product, Math.min(qty, limit));
            setQty(1);
            onAdded?.();
          }}
          className={clsx(btnPrimary, "flex-1 whitespace-nowrap")}
        >
          <ChaliceIcon className="h-4 w-4" />
          {soldOut ? "Артефакт обрёл владельца" : limit <= 0 ? "Весь запас уже в корзине" : "Окунуться в бездну (В корзину)"}
        </button>
      </div>
      {product.availability === "PRE_ORDER" && !soldOut && (
        <p className="text-xs text-ash/80">Предзаказ: изготовление и отправка — через {product.leadTimeDays ?? 14} дн. после оплаты.</p>
      )}
    </div>
  );
}
