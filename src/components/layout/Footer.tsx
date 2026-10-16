import Link from "next/link";
import { Glyph } from "@/components/ui/Glyph";
import { NAV } from "@/lib/site";
import type { SiteConfig } from "@/lib/site-config";

const SUPPORT = [
  { href: "/shipping", label: "Доставка и оплата" },
  { href: "/returns", label: "Возврат и обмен" },
  { href: "/faq", label: "Частые вопросы" },
  { href: "/privacy", label: "Политика конфиденциальности" },
];

export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="relative border-t border-gold/10 bg-obsidian text-sm text-ash">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-3">
            <Glyph className="h-9 w-9 text-gold" />
            <span className="flex flex-col">
              <span className="font-display text-base tracking-[0.25em] text-gold">
                {site.name.toUpperCase()}
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.45em]">Mystical Cards</span>
            </span>
          </Link>
          <p className="leading-relaxed text-ash/80">{site.tagline}</p>
        </div>

        <nav aria-label="Навигация в подвале">
          <h3 className="eyebrow mb-5">Храм навигации</h3>
          <ul className="space-y-2.5">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Поддержка">
          <h3 className="eyebrow mb-5">Поддержка искателя</h3>
          <ul className="space-y-2.5">
            {SUPPORT.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="eyebrow mb-5">Мастерская</h3>
          <address className="space-y-2 not-italic leading-relaxed text-ash/80">
            <p>{site.address}</p>
            <p>
              <a href={`mailto:${site.email}`} className="text-gold/90 hover:text-gold">
                {site.email}
              </a>
            </p>
          </address>
          <ul className="mt-5 flex gap-5">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-gold/80 hover:text-gold">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[0.7rem] text-ash/60 sm:flex-row">
          <p>© MMXXVI {site.name}. Все мистические права защищены.</p>
          <p className="font-display tracking-[0.3em] text-gold/40">🜁 🜄 🜃 🜂</p>
        </div>
      </div>
    </footer>
  );
}
