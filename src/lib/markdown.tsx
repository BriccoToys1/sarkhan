import type { ReactNode } from "react";
import { Vignette } from "@/components/ui/Vignette";

// Небольшой безопасный рендерер Markdown для текстов из БД (сырой HTML не поддерживается).
// Блоки: ## / ### заголовки, > цитата, - список, *** виньетка, «^ » маргиналия, абзацы.
// Инлайн: **жирный**, *курсив*, [ссылка](url).

const INLINE = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;

function safeHref(href: string) {
  return /^(https?:\/\/|\/|#|mailto:)/i.test(href) ? href : "#";
}

export function renderInline(text: string, keyPrefix = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const key = `${keyPrefix}-${i++}`;
    if (m[2]) out.push(<strong key={key} className="font-semibold text-parchment">{m[2]}</strong>);
    else if (m[3]) out.push(<em key={key} className="italic text-gold-light">{m[3]}</em>);
    else if (m[4] && m[5]) {
      const href = safeHref(m[5]);
      const external = href.startsWith("http");
      out.push(
        <a
          key={key}
          href={href}
          className="text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {m[4]}
        </a>,
      );
    }
    last = start + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Options = { dropCap?: boolean; variant?: "article" | "compact" };

export function Markdown({ source, dropCap = false, variant = "article" }: { source: string } & Options) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const firstParagraph = dropCap ? blocks.findIndex((b) => !/^(\*\*\*|---|#{2,3} |\^ |> |- )/.test(b)) : -1;
  const article = variant === "article";

  return (
    <>
      {blocks.map((block, idx) => {
        const key = `b-${idx}`;
        if (/^(\*\*\*|---)$/.test(block)) return <Vignette key={key} className="my-12" />;
        if (block.startsWith("### "))
          return (
            <h3 key={key} className="mt-10 mb-4 font-serif text-2xl font-semibold text-gold">
              {renderInline(block.slice(4), key)}
            </h3>
          );
        if (block.startsWith("## "))
          return (
            <h2 key={key} className={article ? "mt-14 mb-5 font-serif text-3xl font-semibold tracking-wide text-parchment" : "mt-8 mb-3 font-serif text-2xl text-parchment"}>
              {renderInline(block.slice(3), key)}
            </h2>
          );
        if (block.startsWith("^ "))
          return (
            <aside key={key} className="marginalia" aria-label="Заметка на полях">
              {renderInline(block.slice(2), key)}
            </aside>
          );
        if (block.startsWith("> "))
          return (
            <blockquote key={key} className="my-10 border-l border-gold/40 pl-6 font-serif text-2xl italic leading-snug text-gold-light">
              {renderInline(block.replace(/^> ?/gm, ""), key)}
            </blockquote>
          );
        if (/^- /.test(block))
          return (
            <ul key={key} className="my-6 space-y-2 pl-1">
              {block.split("\n").map((line, li) => (
                <li key={li} className="flex gap-3">
                  <span className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  <span>{renderInline(line.replace(/^- /, ""), `${key}-${li}`)}</span>
                </li>
              ))}
            </ul>
          );
        return (
          <p key={key} className={idx === firstParagraph ? "drop-cap" : undefined}>
            {renderInline(block.replace(/\n/g, " "), key)}
          </p>
        );
      })}
    </>
  );
}
