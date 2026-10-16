"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { Ouroboros } from "@/components/ui/Ouroboros";
import { btnPrimary, inputBox, labelText } from "@/components/ui/buttons";
import { CONTACT_TOPICS } from "@/lib/labels";
import type { ContactTopic } from "@/lib/types";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; field?: string };
      if (!data.ok) {
        setError({ field: data.field, message: data.error ?? "Послание не дошло" });
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setError({ message: "Связь с мастерской прервалась. Попробуйте позже" });
      setState("error");
    }
  };

  const invalid = (f: string) => error?.field === f;

  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
          <p className="font-serif text-3xl italic text-gold">Ваше послание доставлено.</p>
          <p className="mt-4 font-serif text-lg text-ash">Сархан Грим ответит вам, когда взойдёт Луна — обычно в течение двух дней.</p>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} className="space-y-6" noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="grid gap-6 sm:grid-cols-2">
            <label>
              <span className={labelText}>Ваше имя</span>
              <input name="name" required minLength={2} autoComplete="name" className={clsx(inputBox, invalid("name") && "border-crimson")} />
            </label>
            <label>
              <span className={labelText}>Ваш email</span>
              <input name="email" type="email" required autoComplete="email" className={clsx(inputBox, invalid("email") && "border-crimson")} />
            </label>
          </div>
          <label className="block">
            <span className={labelText}>Тема обращения</span>
            <span className="relative block">
              <select name="topic" defaultValue="COLLABORATION" className={clsx(inputBox, "appearance-none pr-10")}>
                {(Object.keys(CONTACT_TOPICS) as ContactTopic[]).map((t) => (
                  <option key={t} value={t}>
                    {CONTACT_TOPICS[t]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
            </span>
          </label>
          <label className="block">
            <span className={labelText}>Послание</span>
            <textarea name="message" required minLength={10} rows={6} placeholder="Опишите ваше видение или задайте вопрос…" className={clsx(inputBox, "resize-y", invalid("message") && "border-crimson")} />
          </label>
          {error && <p className="text-sm text-crimson-light">{error.message}</p>}
          <button type="submit" disabled={state === "loading"} className={clsx(btnPrimary, "w-full")}>
            {state === "loading" ? <Ouroboros className="h-5 w-5" /> : "Отправить сигнал"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
