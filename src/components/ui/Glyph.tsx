import clsx from "clsx";

export const LOGO_SRC = "/brand/logo.png";

/** Фирменный логотип Mystical Cards — используется везде вместо старого SVG-глифа. */
export function Glyph({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
  /** @deprecated больше не используется (логотип — растровое изображение) */
  strokeWidth?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand mark, sized via className
    <img
      src={LOGO_SRC}
      alt=""
      width={100}
      height={100}
      className={clsx("select-none object-contain", className, animated && "animate-pulse")}
      aria-hidden
      draggable={false}
    />
  );
}
