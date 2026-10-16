"use client";

import { AnimatePresence, motion } from "motion/react";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Ouroboros } from "@/components/ui/Ouroboros";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, website }) });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error);
      setState("done");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Связь прервалась. Попробуйте ещё раз");
      setState("error");
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-gold/10 bg-abyss py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Mail className="mx-auto mb-6 h-8 w-8 text-gold/60" strokeWidth={1.2} />
        <span className="eyebrow mb-4 block">Интеграция с бездной</span>
        <h2 className="font-serif text-3xl font-semibold uppercase tracking-[0.14em] text-parchment sm:text-4xl">«Оккультный вестник»</h2>
        <p className="mx-auto mt-5 max-w-lg font-serif text-xl text-ash">Эксклюзивные релизы, предзаказы лимитированных тиражей и письма из мастерской — раньше всех.</p>

        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.p key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 font-serif text-2xl italic text-gold">
              Ваш дух соединён с вестником. Ожидайте первое письмо.
            </motion.p>
          ) : (
            <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} className="mx-auto mt-12 flex max-w-lg flex-col gap-6 sm:flex-row sm:items-end">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <label className="flex-1 text-left">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder="Ваш email для писем из бездны"
                  className="w-full border-0 border-b border-gold/40 bg-transparent px-0 py-3 text-center font-serif text-lg text-parchment placeholder:text-ash/50 focus:border-gold focus:outline-none sm:text-left"
                />
              </label>
              <button type="submit" disabled={state === "loading"} className="flex items-center justify-center gap-2 border-b border-gold/40 px-6 py-3 font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold transition-colors hover:border-gold hover:text-parchment disabled:opacity-60">
                {state === "loading" ? <Ouroboros className="h-5 w-5" /> : "Вступить"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        {state === "error" && <p className="mt-4 text-sm text-crimson-light">{error}</p>}
      </div>
    </section>
  );
}
