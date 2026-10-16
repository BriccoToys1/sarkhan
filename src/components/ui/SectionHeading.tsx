import clsx from "clsx";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={clsx(align === "center" ? "mx-auto text-center" : "text-left", "max-w-3xl", className)}>
      {eyebrow && <span className="eyebrow mb-4 block">{eyebrow}</span>}
      <Tag
        className={clsx(
          "font-serif font-semibold uppercase tracking-[0.12em] text-parchment",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Tag>
      {children && <div className="mt-5 font-serif text-lg leading-relaxed text-ash sm:text-xl">{children}</div>}
    </div>
  );
}
