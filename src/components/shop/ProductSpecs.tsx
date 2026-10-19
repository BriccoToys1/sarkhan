import { Accordion } from "@/components/ui/Accordion";
import type { ProductDTO } from "@/lib/types";

export function ProductSpecs({ product }: { product: ProductDTO }) {
  const specs = Object.entries(product.specs);
  const items = [
    {
      title: "Материалы и размеры",
      content: (
        <dl className="space-y-2.5">
          {specs.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 border-b border-gold/5 pb-2">
              <dt className="text-ash">{k}</dt>
              <dd className="text-right text-parchment">{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  ];
  if (product.visualDescription) items.push({ title: "Облик артефакта", content: <p className="font-serif text-base italic">{product.visualDescription}</p> });
  items.push({
    title: "Комплектация и доставка",
    content: (
      <p>
        Каждый артефакт упаковывается в фирменную вощёную бумагу с сургучной печатью мастерской.{" "}
        {product.type === "ORIGINAL"
          ? "Оригиналы отправляются только страхованной доставкой DHL Express в деревянном кофре — 150 ₽, по всему миру."
          : "Стандартная доставка AirMail с трек-номером — 15 ₽, экспресс DHL — 25 ₽. С промокодом GRIMSHIPPING доставка бесплатна при заказе от 200 ₽."}
      </p>
    ),
  });
  return <Accordion items={items} />;
}
