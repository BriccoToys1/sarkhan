import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StudioGallery } from "@/components/about/StudioGallery";
import { ArtImage } from "@/components/ui/ArtImage";
import { Vignette } from "@/components/ui/Vignette";
import { btnGhost } from "@/components/ui/buttons";

export const metadata: Metadata = {
  title: "Об авторе — Сархан Грим",
  description: "Художник-офортист, гравёр и исследователь герметической философии. Путь, мастерская в Праге и техника: офорт, тушь и цифровая постобработка.",
  alternates: { canonical: "/about" },
};

const PATH = [
  { year: "1987", title: "Баку", text: "Родился в семье реставратора книг. Первые гравюры увидел в отцовской мастерской — в разобранных переплётах XVIII века." },
  { year: "2005", title: "Санкт-Петербург", text: "Академия художеств, мастерская классической гравюры. Шесть лет офорта, сухой иглы и меццо-тинто — и первая встреча с «Mutus Liber»." },
  { year: "2012", title: "Прага", text: "Переезд в город алхимиков Рудольфа II. Чердак на Старом Месте становится мастерской, а оттиски — первыми эзотерическими листами." },
  { year: "2016", title: "Первая колода", text: "Двадцать два Старших Аркана тиражом 300 экземпляров. Тираж разошёлся за неделю, и офорт стал языком Таро." },
  { year: "2022", title: "Карпаты", text: "Три месяца отшельничества в доме лесничего. Без электричества, при свечах — так родилась вселенная «Тень Лилит»." },
  { year: "2026", title: "Бестиарий", text: "Серия о стражах порогов и выставка в лондонской Crypt Gallery. Работа над новой колодой продолжается." },
];

const SHOTS = [
  { src: "/art/about/studio-shelves.svg", title: "Стеллажи", caption: "Антикварные гримуары, черепа и склянки с кислотой", wide: true },
  { src: "/art/about/studio-herbs.svg", title: "Сухие травы", caption: "Полынь, мирра и можжевельник для ритуальных свечей" },
  { src: "/art/about/studio-press.svg", title: "Офортный станок", caption: "Пресс 1890-х годов, на котором печатаются все оттиски" },
  { src: "/art/about/technique-etching.svg", title: "Медная пластина", caption: "Аркан XIII до травления" },
  { src: "/art/about/portrait.svg", title: "Ночная работа", caption: "Мастерская после заката" },
];

const TECHNIQUE = [
  {
    n: "I",
    title: "Офорт",
    image: "/art/about/technique-etching.svg",
    text: "Рисунок процарапывается иглой по кислотоупорному лаку на медной пластине, затем пластина погружается в хлорное железо. Каждое травление углубляет линию — тонкие штрихи травятся минуты, глубокие тени — часы. Так рождается характерный «бархатный» чёрный.",
  },
  {
    n: "II",
    title: "Тушь",
    image: "/art/about/technique-ink.svg",
    text: "Поверх оттиска работы дорабатываются тушью и пером: орнаменты, буквицы, маргиналии. Сархан использует железо-галловые чернила по рецептам XV века — со временем они темнеют и становятся частью бумаги.",
  },
  {
    n: "III",
    title: "Цифровая постобработка",
    image: "/art/about/technique-digital.svg",
    text: "Готовый лист сканируется в сверхвысоком разрешении. Золотые линии отделяются в самостоятельный слой — по нему изготавливаются штампы для тиснения фольгой. Цифра не заменяет руку, а лишь переносит её в тираж.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute right-0 top-20 h-[520px] w-[520px] rounded-full bg-gold/[0.05] blur-[120px]" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md border border-gold/40 bg-abyss p-3 shadow-abyss">
              <div className="pointer-events-none absolute inset-6 z-10 border border-gold/20" />
              <div className="relative h-full w-full overflow-hidden">
                <ArtImage src="/art/about/portrait.svg" alt="Сархан Грим в мастерской" fill sizes="(min-width:1024px) 30vw, 80vw" className="object-cover" preload />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <span className="eyebrow mb-5 block">Биография художника</span>
            <h1 className="font-serif text-5xl font-semibold uppercase tracking-[0.12em] text-parchment sm:text-7xl">Сархан Грим</h1>
            <span className="mt-6 block h-px w-16 bg-gold" />
            <p className="mt-8 font-serif text-3xl italic leading-snug text-gold/85">
              «Я не изобретаю символы. Я лишь снимаю пелену времени с того, что существовало задолго до нашего рождения.»
            </p>
            <p className="mt-8 max-w-2xl leading-relaxed text-ash">
              Художник-офортист, гравёр и исследователь герметической философии. В своих работах соединяет средневековые методы травления медных пластин с современной цифровой
              постобработкой, создавая колоды Таро, гравюры и картины, в которых оккультная символика становится языком искусства.
            </p>
            <nav className="mt-10 flex flex-wrap gap-6" aria-label="Разделы страницы">
              {[
                ["#path", "Путь во тьме"],
                ["#studio", "Внутри мастерской"],
                ["#technique", "Техника"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="font-display text-[0.62rem] uppercase tracking-[0.26em] text-gold transition-colors hover:text-parchment">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section id="path" className="scroll-mt-24 border-t border-gold/10 bg-abyss py-28">
        <div className="mx-auto max-w-5xl px-6">
          <span className="eyebrow mb-4 block text-center">I</span>
          <h2 className="text-center font-serif text-4xl uppercase tracking-[0.14em] text-parchment">Путь во тьме</h2>
          <ol className="relative mt-20 space-y-16 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-gradient-to-b before:from-gold/60 before:via-gold/20 before:to-transparent md:before:left-1/2">
            {PATH.map((step, i) => (
              <li key={step.year} className={`relative grid gap-4 pl-14 md:grid-cols-2 md:gap-16 md:pl-0 ${i % 2 ? "md:[&>div]:col-start-2" : "md:text-right"}`}>
                <span className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold bg-obsidian md:left-1/2" aria-hidden />
                <div>
                  <span className="font-display text-3xl text-gold">{step.year}</span>
                  <h3 className="mt-2 font-serif text-2xl uppercase tracking-[0.12em] text-parchment">{step.title}</h3>
                  <p className="mt-3 font-serif text-lg leading-relaxed text-ash">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="studio" className="scroll-mt-24 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <span className="eyebrow mb-4 block text-center">II</span>
          <h2 className="text-center font-serif text-4xl uppercase tracking-[0.14em] text-parchment">Внутри мастерской</h2>
          <p className="mx-auto mb-16 mt-5 max-w-2xl text-center font-serif text-xl text-ash">
            Чердак дома XVII века на Старом Месте. Склянки с кислотой, сухие травы, черепа и антикварные гримуары. Каждый артефакт, выходящий из-под пресса, проходит очищение огнём.
          </p>
          <StudioGallery shots={SHOTS} videoUrl={process.env.NEXT_PUBLIC_STUDIO_VIDEO_URL || undefined} />
        </div>
      </section>

      <section id="technique" className="scroll-mt-24 border-t border-gold/10 bg-abyss py-28">
        <div className="mx-auto max-w-6xl px-6">
          <span className="eyebrow mb-4 block text-center">III</span>
          <h2 className="text-center font-serif text-4xl uppercase tracking-[0.14em] text-parchment">Техника</h2>
          <p className="mx-auto mt-5 max-w-2xl text-center font-serif text-xl text-ash">Уникальный метод: соединение офорта, туши и цифровой постобработки.</p>
          <div className="mt-20 space-y-24">
            {TECHNIQUE.map((t, i) => (
              <article key={t.n} className="grid items-center gap-12 md:grid-cols-2">
                <div className={`relative aspect-[4/3] overflow-hidden border border-gold/20 shadow-abyss ${i % 2 ? "md:order-2" : ""}`}>
                  <ArtImage src={t.image} alt={t.title} fill sizes="(min-width:768px) 45vw, 90vw" className="object-cover" />
                </div>
                <div>
                  <span className="font-display text-6xl text-gold/30">{t.n}</span>
                  <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.12em] text-parchment">{t.title}</h3>
                  <p className="mt-5 font-serif text-xl leading-relaxed text-ash">{t.text}</p>
                </div>
              </article>
            ))}
          </div>
          <Vignette className="mt-24" />
          <div className="mt-12 text-center">
            <Link href="/gallery" className={btnGhost}>
              Войти в выставочный зал <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
