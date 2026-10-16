import type { SVGProps } from "react";

/** Иконка ритуальной чаши — «Добавить в корзину». */
export function ChaliceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M6 3h12c0 5-2.5 8-6 8S6 8 6 3Z" />
      <path d="M12 11v7" />
      <path d="M8 21h8" />
      <path d="M9.5 18h5" />
      <path d="M12 5.5l.6 1.2 1.3.2-1 .9.3 1.3-1.2-.7-1.2.7.3-1.3-1-.9 1.3-.2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CrescentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M15 3a9 9 0 1 0 6 15.5A7.5 7.5 0 0 1 15 3Z" />
    </svg>
  );
}
