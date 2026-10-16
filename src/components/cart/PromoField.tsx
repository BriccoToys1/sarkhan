"use client";

import { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatCents } from "@/lib/format";
import type { PromoRule } from "@/lib/types";

export function PromoField({ discount, note, applied }: { discount: number; note: string | null; applied: boolean }) {
  const promo = useCart((s) => s.promo);
  const setPromo = useCart((s) => s.setPromo);
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/promo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const data = (await res.json()) as { ok: boolean; promo?: PromoRule; error?: string };
      if (!data.ok || !data.promo) throw new Error(data.error ?? "Печать недействительна");
      setPromo(data.promo);
      setCode("");
      setState("idle");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Печать недействительна");
      setState("error");
    }
  };

  if (promo) {
    return (
      <div className="flex items-start justify-between gap-3 border border-gold/20 bg-gold/5 px-3 py-2.5 text-xs">
        <div>
          <span className="font-display tracking-[0.2em] text-gold">{promo.code}</span>
          <p className={clsx("mt-1", applied ? "text-ash" : "text-crimson-light")}>{note ?? promo.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {discount > 0 && <span className="font-display text-gold">−{formatCents(discount)}</span>}
          <button type="button" onClick={() => setPromo(null)} className="text-ash hover:text-crimson-light" aria-label="Убрать промокод">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={apply} className="space-y-1.5">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (state === "error") setState("idle");
          }}
          placeholder="Промокод"
          aria-label="Промокод"
          aria-invalid={state === "error"}
          className={clsx(
            "min-w-0 flex-1 border bg-obsidian px-3 py-2 font-display text-xs uppercase tracking-[0.2em] text-parchment placeholder:normal-case placeholder:tracking-normal placeholder:text-ash/50 focus:outline-none",
            state === "error" ? "border-crimson" : "border-gold/20 focus:border-gold",
          )}
        />
        <button type="submit" disabled={state === "loading"} className="bg-gold/15 px-4 font-display text-[0.62rem] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-obsidian disabled:opacity-50">
          {state === "loading" ? "…" : "Применить"}
        </button>
      </div>
      {state === "error" && <p className="text-[0.7rem] text-crimson-light">{message}</p>}
    </form>
  );
}
