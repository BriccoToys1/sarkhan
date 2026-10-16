"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

export function Accordion({ items, defaultOpen = 0 }: { items: { title: string; content: ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const id = useId();
  return (
    <div className="divide-y divide-gold/10 border-y border-gold/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              id={`${id}-h-${i}`}
              aria-expanded={isOpen}
              aria-controls={`${id}-p-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left font-display text-[0.7rem] uppercase tracking-[0.24em] text-gold transition-colors hover:text-parchment"
            >
              {item.title}
              <span className={clsx("relative h-3 w-3 transition-transform duration-500", isOpen && "rotate-45")} aria-hidden>
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-p-${i}`}
                  role="region"
                  aria-labelledby={`${id}-h-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-sm leading-relaxed text-ash">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
