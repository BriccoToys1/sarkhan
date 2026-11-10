import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DeckFrame } from "@/components/about/DeckFrame";
import { StudioGallery } from "@/components/about/StudioGallery";
import { ArtImage } from "@/components/ui/ArtImage";
import { Vignette } from "@/components/ui/Vignette";
import { btnGhost } from "@/components/ui/buttons";
import { ABOUT_DECKS, resolveDeckPhoto } from "@/lib/about-decks";
import { getSiteConfig } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Об авторе — Сархан Грим",
  description:
    "Сархан Грим: от любви к мистике — к собственным мирам Таро. Путь автора колод New Age, Red Robe, The Secret World, The Mystery of Blood и других.",
  alternates: { canonical: "/about" },
};

function Name({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-gold">{children}</strong>;
}

type Step = {
  id: string;
  year: string;
  /** Показывать год только у первого шага периода */
  markYear?: boolean;
  title?: string;
  body: ReactNode;
  /** Ключ колоды → одна фото-рамка справа от линии */
  deckKey?: string;
};

function chronology(): Step[] {
  return [
    {
      id: "childhood",
      year: "Детство",
      markYear: true,
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
      id: "2017",
      year: "2017",
      markYear: true,
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
      id: "2023-intro",
      year: "2023",
      markYear: true,
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
        </>
      ),
    },
    {
      id: "new-age",
      year: "2023",
      deckKey: "new-age",
      body: (
        <p>
          <Name>New Age</Name> — моя первая колода. Название оказалось символичным: для меня действительно начиналась новая эпоха. Она была сырой, наивной,
          местами слишком смелой. Я ещё плохо разбирался в символике и не успел глубоко изучить систему Уэйта. Зато энтузиазма хватило бы на небольшое
          издательство.
        </p>
      ),
    },
    {
      id: "herald-of-the-night",
      year: "2023",
      deckKey: "herald-of-the-night",
      body: (
        <p>
          <Name>Herald of the Night</Name> — тёмная красавица, созданная скорее по законам моего воображения, чем по правилам традиции. Тогда я прежде всего
          искал образ, настроение, красоту. Понимание того, как всё это должно работать внутри системы Таро, пришло позже.
        </p>
      ),
    },
    {
      id: "lord-of-skull",
      year: "2023",
      deckKey: "lord-of-skull",
      body: (
        <p>
          <Name>Lord of Skull</Name> — вторая тёмная красавица того же периода. Всё ещё больше про атмосферу и визуальный язык, чем про строгую символику.
        </p>
      ),
    },
    {
      id: "red-robe",
      year: "2023",
      deckKey: "red-robe",
      body: (
        <p>
          <Name>Red Robe</Name> — после небольшой передышки я взялся за эту колоду, уже внимательнее относясь к символам. Заодно попробовал создать классический
          оракул из 36 карт: на тот момент он показался мне задачей попроще. Впрочем, у начинающего автора слово «попроще» нередко означает лишь то, что он ещё
          не обнаружил всех сложностей.
        </p>
      ),
    },
    {
      id: "telegram",
      year: "2023",
      body: (
        <p>
          Примерно тогда же появились мой Telegram-канал и чат. Сначала туда приходили люди, которым нравились мои работы. Постепенно мы сдружились, начали
          обсуждать карты, делиться идеями. Мне подсказывали, каких символов не хватает, где стоит точнее передать смысл, а где — посмотреть на изображение иначе.
        </p>
      ),
    },
    {
      id: "red-mercury",
      year: "2023",
      deckKey: "red-mercury",
      body: (
        <p>
          <Name>Red Mercury</Name> создавалась уже с этой поддержкой. И я почувствовал, насколько ценным может быть диалог с людьми, которые будут пользоваться
          твоими картами.
        </p>
      ),
    },
    {
      id: "world-classic-for-sarkhan",
      year: "2023",
      deckKey: "world-classic-for-sarkhan",
      body: (
        <p>
          <Name>World Classic for Sarkhan</Name> — моя версия классики Уэйта. Перерисовывать знакомые сюжеты оказалось значительно проще, чем создавать
          собственные. Но именно этот опыт помог мне понять: лично мне недостаточно менять внешний облик уже существующей колоды. Хочется сказать что-то своё.
        </p>
      ),
    },
    {
      id: "2023-close",
      year: "2023",
      body: (
        <p>
          И да, всё это произошло за один 2023 год. Видимо, мой внутренний художник долго ждал выхода и решил наверстать упущенное без согласования с календарём.
        </p>
      ),
    },
    {
      id: "2024-intro",
      year: "2024",
      markYear: true,
      title: "Новые возможности",
      body: (
        <p>
          В 2024 году случилось небольшое сотрудничество с другой типографией. Улучшилось качество материалов, появились новые возможности оформления.
          Одновременно рос и я: продолжал учиться, лучше понимал инструменты, увереннее работал с изображениями. Сами программы тоже развивались, позволяя
          воплощать всё более сложные идеи.
        </p>
      ),
    },
    {
      id: "the-golden-age",
      year: "2024",
      deckKey: "the-golden-age",
      body: (
        <p>
          <Name>The Golden Age</Name> — колода, в которой я уже видел заметный шаг вперёд и по иллюстрациям, и по исполнению.
        </p>
      ),
    },
    {
      id: "red-robe-reprint",
      year: "2024",
      deckKey: "red-robe-reprint",
      body: (
        <p>
          <Name>Red Robe (переиздание)</Name> — полноценное переиздание, тоже с заметным шагом вперёд по качеству и аккуратности.
        </p>
      ),
    },
    {
      id: "2024-community",
      year: "2024",
      body: (
        <p>
          Сообщество тем временем росло. Появлялись новые идеи, пожелания и просьбы вернуть прежние работы. Мне захотелось ответить на эту поддержку, и я
          выпустил четыре небольших тиража — каждая вышла ограниченным тестовым тиражом в 100 экземпляров. Тогда я ещё не знал, что некоторые из этих
          экспериментов обязательно потребуют продолжения.
        </p>
      ),
    },
    {
      id: "red-mercury-reprint",
      year: "2024",
      deckKey: "red-mercury-reprint",
      body: (
        <p>
          <Name>Red Mercury (переиздание)</Name> — переиздание с небольшими улучшениями.
        </p>
      ),
    },
    {
      id: "slavyanka",
      year: "2024",
      deckKey: "slavyanka",
      body: (
        <p>
          <Name>Славянка</Name> — акварельное Таро с атмосферой старых славянских сказок.
        </p>
      ),
    },
    {
      id: "scary-funny-tales",
      year: "2024",
      deckKey: "scary-funny-tales",
      body: (
        <p>
          <Name>Страшно-смешные сказки</Name> — колода, которую создавал ради удовольствия и возможности немного похулиганить.
        </p>
      ),
    },
    {
      id: "emotion-tarot",
      year: "2024",
      deckKey: "emotion-tarot",
      body: (
        <p>
          <Name>Emotion Tarot</Name> — ещё один свободный эксперимент, неожиданно полюбившийся многим.
        </p>
      ),
    },
    {
      id: "2025-intro",
      year: "2025",
      markYear: true,
      title: "От количества — к осмысленности",
      body: (
        <>
          <p>Со временем мой подход изменился. Я понял, что больше не хочу выпускать колоды одну за другой только потому, что могу.</p>
          <p>
            Изучение Таро, эзотерики и оккультной символики постепенно меняло мой взгляд на собственные работы. Красивое изображение стало для меня началом, а
            не конечной целью. Всё важнее становились точность символов, внутренняя логика и то, насколько удобно человеку взаимодействовать с картами.
          </p>
          <p>Мне захотелось создавать не просто эффектные колоды, а продуманный инструмент для практики — такой, к которому будут возвращаться.</p>
        </>
      ),
    },
    {
      id: "the-secret-world",
      year: "2025",
      deckKey: "the-secret-world",
      body: (
        <p>
          <Name>The Secret World</Name> — одна из моих любимых работ. Ближе к концу 2025 года в ней для меня сошлись накопленный опыт, внимание к деталям и более
          ясное понимание того, что я хочу делать дальше.
        </p>
      ),
    },
    {
      id: "the-twilight-gate",
      year: "2025",
      deckKey: "the-twilight-gate",
      body: (
        <p>
          <Name>The Twilight Gate</Name> была отрисована, однако в 2026 году я решил её переработать. Сейчас она ждёт своего часа: не каждой колоде нужно
          выходить сразу после последнего штриха.
        </p>
      ),
    },
    {
      id: "2026-intro",
      year: "2026",
      markYear: true,
      title: "Возвращения и незавершённые истории",
      body: <p>В 2026 году я вернулся к уже знакомым историям — и к одной, которую когда-то не смог закончить.</p>,
    },
    {
      id: "emotion-tarot-2026",
      year: "2026",
      deckKey: "emotion-tarot-2026",
      body: (
        <p>
          <Name>Emotion Tarot</Name> — я немного доработал её и выпустил вновь. Желающих оказалось гораздо больше, чем могли удовлетворить первые сто
          экземпляров. Большой формат тоже пришёлся многим по душе — оказалось, эмоциям действительно полезно дать побольше места.
        </p>
      ),
    },
    {
      id: "the-mystery-of-blood",
      year: "2026",
      deckKey: "the-mystery-of-blood",
      body: (
        <>
          <p>
            <Name>The Mystery of Blood</Name> занимает особое место. Я начал создавать эту колоду ещё в 2023 году — и тогда не смог закончить. Мрачная,
            насыщенная красными оттенками, красивая и сложная, она потребовала больше сил, чем у меня было. Работа буквально вымотала меня. Теперь понимаю: я
            просто ещё не был к ней готов.
          </p>
          <p>
            Спустя почти три года я вернулся. С другим опытом, большим терпением и пониманием того, чего ей не хватало. Работа снова занимает много времени, но
            теперь я вижу, как постепенно складывается именно та колода, которую когда-то задумал.
          </p>
          <p>Надеюсь порадовать ею и себя, и вас в 2027 году. Торопить её я больше не хочу.</p>
        </>
      ),
    },
    {
      id: "secrets",
      year: "2026",
      body: (
        <p>
          О двух своих колодах я здесь намеренно не рассказал. Кто знает — тот знает. В биографии человека с такой любовью к мистике должна же остаться хотя бы
          пара закрытых дверей.
        </p>
      ),
    },
    {
      id: "thanks",
      year: "∞",
      markYear: true,
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
  const photos: Record<string, string> = {};
  for (const d of ABOUT_DECKS) {
    photos[d.key] = resolveDeckPhoto(d.key, site.aboutDeckPhotos ?? {});
  }
  const path = chronology();
  const deckName = (key: string) => ABOUT_DECKS.find((d) => d.key === key)?.name ?? key;

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
          <ol className="relative mt-20 space-y-14 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-gradient-to-b before:from-gold/60 before:via-gold/20 before:to-transparent md:before:left-1/2">
            {path.map((step) => {
              const hasDeck = Boolean(step.deckKey);
              return (
                <li key={step.id} className="relative grid gap-6 pl-14 md:grid-cols-2 md:items-start md:gap-16 md:pl-0">
                  <span className="absolute left-4 top-3 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold bg-obsidian md:left-1/2" aria-hidden />

                  {/* Текст — всегда слева от линии */}
                  <div className="md:pr-4 md:text-right">
                    {step.markYear && <span className="font-display text-3xl text-gold">{step.year}</span>}
                    {step.title && (
                      <h3 className={`font-serif text-2xl uppercase tracking-[0.12em] text-parchment ${step.markYear ? "mt-2" : ""}`}>{step.title}</h3>
                    )}
                    <div className={`space-y-4 font-serif text-lg leading-relaxed text-ash ${step.markYear || step.title ? "mt-4" : ""}`}>{step.body}</div>
                  </div>

                  {/* Фото — всегда справа от линии, только у абзаца колоды */}
                  <div className="md:pl-4">
                    {hasDeck && step.deckKey ? (
                      <DeckFrame name={deckName(step.deckKey)} photoUrl={photos[step.deckKey] ?? ""} />
                    ) : (
                      <span className="hidden md:block" aria-hidden />
                    )}
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
