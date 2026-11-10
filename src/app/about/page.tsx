import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DeckFrames } from "@/components/about/DeckFrame";
import { StudioGallery } from "@/components/about/StudioGallery";
import { ArtImage } from "@/components/ui/ArtImage";
import { Vignette } from "@/components/ui/Vignette";
import { btnGhost } from "@/components/ui/buttons";
import { decksByYear, resolveDeckPhoto } from "@/lib/about-decks";
import { getSiteConfig } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Об авторе — Сархан Грим",
  description:
    "Сархан Грим: от любви к мистике — к собственным мирам Таро. Путь автора колод New Age, Red Robe, The Secret World, The Mystery of Blood и других.",
  alternates: { canonical: "/about" },
};

function Deck({ children }: { children: ReactNode }) {
  return <span className="text-gold/90">{children}</span>;
}

type Step = {
  year: string;
  title: string;
  body: ReactNode;
};

function buildPath(photos: Record<string, string>): Step[] {
  const frames = (year: string, align: "left" | "right") => (
    <DeckFrames decks={decksByYear(year)} photos={photos} align={align} label={`Колоды ${year}`} />
  );

  return [
    {
      year: "Детство",
      title: "Любовь к мистике",
      body: (
        <>
          <p>
            Ещё в детстве меня притягивало всё загадочное и потустороннее. Пока кто-то предпочитал добрые истории перед сном, я с удовольствием смотрел
            ужастики. Мистика, тёмные тайны, ощущение, что за привычной реальностью скрывается что-то ещё, — всё это неизменно будоражило моё воображение.
          </p>
          <p>
            Судя по тому, какие колоды я создаю сегодня, детские увлечения никуда не делись. Просто теперь у них есть названия, коробочки и тиражи.
          </p>
          <p>Но пропустим несколько глав жизни и начнём с того момента, когда в этой истории появились карты.</p>
        </>
      ),
    },
    {
      year: "2017",
      title: "Сначала я просто смотрел",
      body: (
        <>
          <p>
            Примерно с 2017 года мне всё чаще стали попадаться гороскопы и расклады Таро. Постепенно случайный интерес превратился в увлечение: я смотрел,
            слушал, пытался разобраться. При этом сам раскладов не делал и даже карт в руках не держал.
          </p>
          <p>
            Тогда я ещё не думал, что однажды буду создавать собственные колоды. Знакомство с Таро происходило издалека — словно я долго рассматривал дверь,
            совершенно не подозревая, что со временем начну рисовать то, что находится за ней.
          </p>
        </>
      ),
    },
    {
      year: "2023",
      title: "«А почему бы не попробовать?»",
      body: (
        <>
          <p>
            Настоящий поворот случился в 2023 году, когда я открыл для себя нейросети как инструмент творчества. Возможность превращать образы из головы во
            что-то видимое захватила меня целиком. Параллельно я с нуля осваивал Photoshop и Illustrator: пробовал, ошибался, переделывал и снова пробовал.
          </p>
          <p>
            За компьютером проходило по 18–20 часов. День путался с ночью, на сон иногда оставалась всего пара часов — и так продолжалось несколько месяцев.
            Сейчас понимаю: режим был, мягко говоря, не образцовый. Но тогда мне хотелось научиться всему и желательно ещё вчера.
          </p>
          <p className="italic text-gold/85">«А можно ведь попробовать создавать карты. Почему нет?»</p>
          <p>
            Так родилась <Deck>New Age</Deck> — моя первая колода. Название оказалось символичным: для меня действительно начиналась новая эпоха. Она была
            сырой, наивной, местами слишком смелой. Я ещё плохо разбирался в символике и не успел глубоко изучить систему Уэйта. Зато энтузиазма хватило бы на
            небольшое издательство.
          </p>
          <p>
            Следом появились <Deck>Herald of the Night</Deck> и <Deck>Lord of Skull</Deck> — две тёмные красавицы, созданные скорее по законам моего
            воображения, чем по правилам традиции. Тогда я прежде всего искал образ, настроение, красоту. Понимание того, как всё это должно работать внутри
            системы Таро, пришло позже.
          </p>
          <p>
            После небольшой передышки я взялся за <Deck>Red Robe</Deck>, уже внимательнее относясь к символам. Заодно попробовал создать классический оракул из
            36 карт: на тот момент он показался мне задачей попроще. Впрочем, у начинающего автора слово «попроще» нередко означает лишь то, что он ещё не
            обнаружил всех сложностей.
          </p>
          <p>
            Примерно тогда же появились мой Telegram-канал и чат. Сначала туда приходили люди, которым нравились мои работы. Постепенно мы сдружились, начали
            обсуждать карты, делиться идеями. Мне подсказывали, каких символов не хватает, где стоит точнее передать смысл, а где — посмотреть на изображение
            иначе.
          </p>
          <p>
            <Deck>Red Mercury</Deck> создавалась уже с этой поддержкой. И я почувствовал, насколько ценным может быть диалог с людьми, которые будут
            пользоваться твоими картами.
          </p>
          <p>
            Затем появилась <Deck>World Classic for Sarkhan</Deck> — моя версия классики Уэйта. Перерисовывать знакомые сюжеты оказалось значительно проще, чем
            создавать собственные. Но именно этот опыт помог мне понять: лично мне недостаточно менять внешний облик уже существующей колоды. Хочется сказать
            что-то своё.
          </p>
          <p>
            И да, всё это произошло за один 2023 год. Видимо, мой внутренний художник долго ждал выхода и решил наверстать упущенное без согласования с
            календарём.
          </p>
          {frames("2023", "right")}
        </>
      ),
    },
    {
      year: "2024",
      title: "Новые возможности",
      body: (
        <>
          <p>
            В 2024 году случилось небольшое сотрудничество с другой типографией. Улучшилось качество материалов, появились новые возможности оформления.
            Одновременно рос и я: продолжал учиться, лучше понимал инструменты, увереннее работал с изображениями. Сами программы тоже развивались, позволяя
            воплощать всё более сложные идеи.
          </p>
          <p>
            Так появились <Deck>The Golden Age</Deck> и полноценное переиздание <Deck>Red Robe</Deck> — колоды, в которых я уже видел заметный шаг вперёд и по
            иллюстрациям, и по исполнению.
          </p>
          <p>
            Сообщество тем временем росло. Появлялись новые идеи, пожелания и просьбы вернуть прежние работы. Мне захотелось ответить на эту поддержку, и я
            выпустил четыре небольших тиража:
          </p>
          <ul className="space-y-2 border-l border-gold/30 pl-4">
            <li>
              <Deck>Red Mercury</Deck> — переиздание с небольшими улучшениями;
            </li>
            <li>
              <Deck>«Славянка»</Deck> — акварельное Таро с атмосферой старых славянских сказок;
            </li>
            <li>
              <Deck>«Страшно-смешные сказки»</Deck> — колоду, которую создавал ради удовольствия и возможности немного похулиганить;
            </li>
            <li>
              <Deck>Emotion Tarot</Deck> — ещё один свободный эксперимент, неожиданно полюбившийся многим.
            </li>
          </ul>
          <p>
            Каждая вышла ограниченным тестовым тиражом в 100 экземпляров. Тогда я ещё не знал, что некоторые из этих экспериментов обязательно потребуют
            продолжения.
          </p>
          {frames("2024", "left")}
        </>
      ),
    },
    {
      year: "2025",
      title: "От количества — к осмысленности",
      body: (
        <>
          <p>Со временем мой подход изменился. Я понял, что больше не хочу выпускать колоды одну за другой только потому, что могу.</p>
          <p>
            Изучение Таро, эзотерики и оккультной символики постепенно меняло мой взгляд на собственные работы. Красивое изображение стало для меня началом, а
            не конечной целью. Всё важнее становились точность символов, внутренняя логика и то, насколько удобно человеку взаимодействовать с картами.
          </p>
          <p>Мне захотелось создавать не просто эффектные колоды, а продуманный инструмент для практики — такой, к которому будут возвращаться.</p>
          <p>
            Ближе к концу 2025 года появилась <Deck>The Secret World</Deck>, одна из моих любимых работ. В ней для меня сошлись накопленный опыт, внимание к
            деталям и более ясное понимание того, что я хочу делать дальше.
          </p>
          <p>
            Была отрисована и <Deck>The Twilight Gate</Deck>. Однако в 2026 году я решил её переработать. Сейчас она ждёт своего часа: не каждой колоде нужно
            выходить сразу после последнего штриха.
          </p>
          {frames("2025", "right")}
        </>
      ),
    },
    {
      year: "2026",
      title: "Возвращения и незавершённые истории",
      body: (
        <>
          <p>
            В 2026 году я вернулся к <Deck>Emotion Tarot</Deck>: немного доработал её и выпустил вновь. Желающих оказалось гораздо больше, чем могли
            удовлетворить первые сто экземпляров. Большой формат тоже пришёлся многим по душе — оказалось, эмоциям действительно полезно дать побольше места.
          </p>
          <p>
            Но особое место сейчас занимает <Deck>The Mystery of Blood</Deck>.
          </p>
          <p>
            Я начал создавать эту колоду ещё в 2023 году — и тогда не смог закончить. Мрачная, насыщенная красными оттенками, красивая и сложная, она
            потребовала больше сил, чем у меня было. Работа буквально вымотала меня. Теперь понимаю: я просто ещё не был к ней готов.
          </p>
          <p>
            Спустя почти три года я вернулся. С другим опытом, большим терпением и пониманием того, чего ей не хватало. Работа снова занимает много времени, но
            теперь я вижу, как постепенно складывается именно та колода, которую когда-то задумал.
          </p>
          <p>Надеюсь порадовать ею и себя, и вас в 2027 году. Торопить её я больше не хочу.</p>
          <p>
            О двух своих колодах я здесь намеренно не рассказал. Кто знает — тот знает. В биографии человека с такой любовью к мистике должна же остаться хотя
            бы пара закрытых дверей.
          </p>
          {frames("2026", "left")}
        </>
      ),
    },
    {
      year: "∞",
      title: "И самое главное",
      body: (
        <>
          <p>
            Мой путь начался с любопытства и желания создавать красивые образы. Со временем к ним добавились знания, ответственность за свою работу и
            стремление делать каждую следующую колоду осмысленнее предыдущей.
          </p>
          <p>И очень многое на этом пути стало возможным благодаря людям рядом.</p>
          <p>
            Спасибо каждому, кто поддерживает меня, участвует в обсуждениях, делится идеями, помогает замечать ошибки и радуется новым работам. Тем, кто был с
            самого начала, и тем, кто присоединился совсем недавно. Тем, кто пишет в чате, и тем, кто молча выбирает мои карты.
          </p>
          <p>Вы помогаете мне расти и даёте желание продолжать.</p>
          <p className="text-parchment">Вы лучшие. Просто знайте это.</p>
          <p className="italic text-gold/85">
            С благодарностью,
            <br />
            Сархан Грим
          </p>
        </>
      ),
    },
  ];
}

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

export default async function AboutPage() {
  const site = await getSiteConfig();
  const photo = site.aboutPhotoUrl || "/art/about/portrait.svg";
  const resolved: Record<string, string> = {};
  for (const d of [...decksByYear("2023"), ...decksByYear("2024"), ...decksByYear("2025"), ...decksByYear("2026")]) {
    resolved[d.key] = resolveDeckPhoto(d.key, site.aboutDeckPhotos ?? {});
  }
  const path = buildPath(resolved);

  return (
    <>
      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute right-0 top-20 h-[520px] w-[520px] rounded-full bg-gold/[0.05] blur-[120px]" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md border border-gold/40 bg-abyss p-3 shadow-abyss lg:mx-0">
              <div className="pointer-events-none absolute inset-6 z-10 border border-gold/20" />
              <div className="relative h-full w-full overflow-hidden">
                <ArtImage src={photo} alt="Сархан Грим" fill sizes="(min-width:1024px) 30vw, 80vw" className="object-cover" preload />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <span className="eyebrow mb-5 block">Биография художника</span>
            <h1 className="font-serif text-4xl font-semibold uppercase leading-tight tracking-[0.1em] text-parchment sm:text-5xl lg:text-[3.4rem]">
              Сархан Грим: от любви к мистике — к собственным мирам Таро
            </h1>
            <span className="mt-6 block h-px w-16 bg-gold" />
            <p className="mt-8 font-serif text-2xl italic leading-snug text-gold/85 sm:text-3xl">
              Меня зовут Сархан Грим, и, кажется, к созданию Таро я шёл гораздо дольше, чем сам об этом подозревал.
            </p>
            <nav className="mt-10 flex flex-wrap gap-6" aria-label="Разделы страницы">
              {[
                ["#path", "Хронология"],
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
          <h2 className="text-center font-serif text-4xl uppercase tracking-[0.14em] text-parchment">Хронология</h2>
          <ol className="relative mt-20 space-y-20 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-gradient-to-b before:from-gold/60 before:via-gold/20 before:to-transparent md:before:left-1/2">
            {path.map((step, i) => {
              const alignRight = i % 2 === 0;
              return (
                <li
                  key={`${step.year}-${step.title}`}
                  className={`relative grid gap-4 pl-14 md:grid-cols-2 md:gap-16 md:pl-0 ${alignRight ? "" : "md:[&>div]:col-start-2"} ${alignRight ? "md:text-right md:[&_ul.space-y-2]:border-r md:[&_ul.space-y-2]:border-l-0 md:[&_ul.space-y-2]:pr-4 md:[&_ul.space-y-2]:pl-0" : ""}`}
                >
                  <span className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold bg-obsidian md:left-1/2" aria-hidden />
                  <div>
                    <span className="font-display text-3xl text-gold">{step.year}</span>
                    <h3 className="mt-2 font-serif text-2xl uppercase tracking-[0.12em] text-parchment">{step.title}</h3>
                    <div className="mt-4 space-y-4 font-serif text-lg leading-relaxed text-ash">{step.body}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="studio" className="scroll-mt-24 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <span className="eyebrow mb-4 block text-center">II</span>
          <h2 className="text-center font-serif text-4xl uppercase tracking-[0.14em] text-parchment">Внутри мастерской</h2>
          <p className="mx-auto mb-16 mt-5 max-w-2xl text-center font-serif text-xl text-ash">
            Чердак дома XVII века на Старом Месте. Склянки с кислотой, сухие травы, черепа и антикварные гримуары. Каждый артефакт, выходящий из-под пресса,
            проходит очищение огнём.
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
