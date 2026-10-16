"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let locks = 0;

/** ESC, блокировка прокрутки фона и удержание фокуса внутри открытого окна. */
export function useModal(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useEffectEvent(() => onClose());

  useEffect(() => {
    if (!open) return;
    locks++;
    const prevOverflow = document.documentElement.style.overflow;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbar ? `${scrollbar}px` : "";

    const focusFirst = window.setTimeout(() => {
      const el = ref.current;
      const target = el?.querySelector<HTMLElement>("[data-autofocus]") ?? el;
      target?.focus({ preventScroll: true });
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener("keydown", onKey);
      locks--;
      if (locks <= 0) {
        locks = 0;
        document.documentElement.style.overflow = prevOverflow;
        document.body.style.paddingRight = "";
      }
    };
  }, [open, ref]);
}
