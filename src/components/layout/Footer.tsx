import Link from "next/link";
import { Glyph } from "@/components/ui/Glyph";
import { PinterestIcon, TelegramIcon } from "@/components/ui/icons";
import { NAV } from "@/lib/site";
import type { SiteConfig } from "@/lib/site-config";

const SUPPORT = [
  { href: "/shipping", label: "Доставка и оплата" },
  { href: "/returns", label: "Возврат и обмен" },
  { href: "/faq", label: "Частые вопросы" },
  { href: "/privacy", label: "Политика конфиденциальности" },
];

function SocialIcon({ label }: { label: string }) {
  const key = label.trim().toLowerCase();
  if (key.includes("telegram") || key.includes("телеграм")) {
    return <TelegramIcon className="h-5 w-5" />;
  }
  if (key.includes("pinterest") || key.includes("пинтерест")) {
    return <PinterestIcon className="h-5 w-5" />;
  }
  return null;
}

export function Footer({ site }: { site: SiteConfig }) {
  const socials = site.socials.filter((s) => s.label.toLowerCase() !== "instagram");

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
          <ul className="mt-5 flex items-center gap-4">
            {socials.map((s) => {
              const icon = <SocialIcon label={s.label} />;
              if (!icon) return null;
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-10 w-10 items-center justify-center text-gold/80 transition-colors hover:text-gold"
                  >
                    {icon}
                  </a>
                </li>
              );
            })}
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
