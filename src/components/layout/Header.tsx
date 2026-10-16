"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import clsx from "clsx";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { NAV } from "@/lib/site";
import { cartCount, useCart } from "@/store/cart";
import { useModal } from "@/hooks/useModal";
import { useHydrated } from "@/hooks/useHydrated";
import { ChaliceIcon } from "@/components/ui/icons";
import { Glyph } from "@/components/ui/Glyph";
import { SearchOverlay } from "./SearchOverlay";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart((s) => cartCount(s.lines));
  const openCart = useCart((s) => s.open);
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  const [menu, setMenu] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [search, setSearch] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenu(false), []);
  const closeSearch = useCallback(() => setSearch(false), []);
  useModal(menu, menuRef, closeMenu);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenu(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const transparent = pathname === "/" && !scrolled;

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
          transparent ? "border-transparent bg-transparent" : "border-gold/10 bg-obsidian/85 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="Sarkhan Grim — на главную">
            <Glyph className="h-8 w-8 text-gold transition-transform duration-700 group-hover:rotate-[360deg]" />
            <span className="flex flex-col">
              <span className="font-display text-lg tracking-[0.28em] text-gold transition-colors group-hover:text-parchment">SARKHAN GRIM</span>
              <span className="text-[0.55rem] uppercase tracking-[0.45em] text-ash">Mystical Cards</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Основная навигация">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "group relative font-display text-[0.68rem] uppercase tracking-[0.2em] transition-colors",
                  isActive(item.href) ? "text-gold" : "text-ash hover:text-gold",
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                <span className={clsx("absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500", isActive(item.href) ? "w-full" : "w-0 group-hover:w-full")} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button type="button" onClick={() => setSearch(true)} className="text-parchment transition-colors hover:text-gold" aria-label="Поиск">
              <Search className="h-5 w-5" />
            </button>
            <button type="button" onClick={openCart} className="relative text-parchment transition-colors hover:text-gold" aria-label={`Корзина, артефактов: ${hydrated ? count : 0}`}>
              <ChaliceIcon className="h-6 w-6" />
              <span
                className={clsx(
                  "absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.58rem] font-bold text-obsidian transition-transform duration-300",
                  hydrated && count > 0 ? "scale-100" : "scale-0",
                )}
              >
                {hydrated ? count : 0}
              </span>
            </button>
            <button type="button" onClick={() => setMenu(true)} className="text-parchment transition-colors hover:text-gold lg:hidden" aria-label="Открыть меню" aria-expanded={menu}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            tabIndex={-1}
            className="fixed inset-0 z-[65] flex flex-col items-center justify-center gap-8 bg-obsidian focus:outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" onClick={() => setMenu(false)} className="absolute right-6 top-6 text-ash hover:text-gold" aria-label="Закрыть меню">
              <X className="h-8 w-8" />
            </button>
            <Glyph className="mb-4 h-14 w-14 text-gold/70" />
            {NAV.map((item, i) => (
              <motion.div key={item.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.06 } }}>
                <Link href={item.href} className={clsx("font-serif text-2xl uppercase tracking-[0.25em]", isActive(item.href) ? "text-gold" : "text-parchment hover:text-gold")}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={search} onClose={closeSearch} />
    </>
  );
}
