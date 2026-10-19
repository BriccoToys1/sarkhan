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

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.8 4.3c.3-.9-.5-1.6-1.3-1.3L2.8 9.4c-.9.3-.9 1.6.1 1.9l4.6 1.5 1.7 5.4c.2.8 1.2 1 1.7.4l2.5-2.6 4.5 3.3c.7.5 1.7.1 1.9-.7l2-14.3ZM8.9 12.7l8.4-5.2-6.7 6.4-.3 2.5-1.4-3.7Z" />
    </svg>
  );
}

export function PinterestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.5 2 2 6.4 2 11.9c0 4.2 2.6 7.8 6.3 9.2-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8-3 0-4.9 2.3-4.9 4.8 0 .9.3 1.5.7 2 .1.1.1.2.1.3l-.3 1c0 .2-.2.2-.3.1-1.3-.6-1.9-2.1-1.9-3.8 0-2.8 2.4-6.2 7.1-6.2 3.8 0 6.3 2.7 6.3 5.7 0 3.9-2.2 6.8-5.4 6.8-1.1 0-2.1-.6-2.4-1.3l-.7 2.5c-.2.9-.9 2-1.3 2.7.9.3 1.9.4 2.9.4 5.5 0 10-4.5 10-9.9S17.5 2 12 2Z" />
    </svg>
  );
}
