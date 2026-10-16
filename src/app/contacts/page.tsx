import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contacts/ContactForm";
import { PortolanMap } from "@/components/contacts/PortolanMap";
import { getVenues } from "@/lib/data";
import { getSiteConfig } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Контакты — письмо в бездну",
  description: "Сотрудничество, индивидуальные заказы картин, вопросы доставки и пресса. Галереи, где выставляются работы Сархана Грима.",
  alternates: { canonical: "/contacts" },
};

export default async function ContactsPage() {
  const [venues, site] = await Promise.all([getVenues(), getSiteConfig()]);
  return (
    <>
      <PageHeader eyebrow="Письмо в бездну" title="Связаться с мастерской">
        Для коллекционеров, галерей и издателей. Мы отвечаем на каждое послание.
      </PageHeader>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-32 lg:grid-cols-12">
        <div className="border border-gold/20 bg-abyss p-8 shadow-gold-glow lg:col-span-5 lg:p-10">
          <h2 className="mb-8 font-serif text-2xl uppercase tracking-[0.14em] text-parchment">Форма послания</h2>
          <ContactForm />
          <div className="mt-10 border-t border-gold/10 pt-6 text-sm text-ash">
            <p>{site.address}</p>
            <a href={`mailto:${site.email}`} className="text-gold hover:text-parchment">
              {site.email}
            </a>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <div>
            <h2 className="font-serif text-2xl uppercase tracking-[0.14em] text-gold">Аркана-карта мира</h2>
            <p className="mt-2 text-sm leading-relaxed text-ash">Точки силы, где выставлены картины и колоды мастерской. Коснитесь золотой метки, чтобы узнать подробности.</p>
          </div>
          <PortolanMap venues={venues} />
          <ul className="grid gap-4 sm:grid-cols-2">
            {venues.map((v) => (
              <li key={v.id} className="border-l border-gold/30 pl-4">
                <p className="font-display text-[0.58rem] uppercase tracking-[0.26em] text-gold">{v.city}</p>
                <p className="font-serif text-lg text-parchment">{v.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
