"use client";

import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchase } from "./ProductPurchase";
import { ProductSpecs } from "./ProductSpecs";
import { useModal } from "@/hooks/useModal";
import { formatPrice } from "@/lib/format";
import { TYPE_LABELS } from "@/lib/labels";
import type { ProductDTO } from "@/lib/types";
import { btnLink } from "@/components/ui/buttons";

export function QuickViewModal({ product, onClose, onExitComplete }: { product: ProductDTO | null; onClose: () => void; onExitComplete: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useModal(product !== null, panel, onClose);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {product && (
        <motion.div
          key="qv"
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
        >
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-[8px]" onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            tabIndex={-1}
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-gold/25 bg-abyss shadow-gold-strong focus:outline-none"
            initial={{ scale: 0.55, opacity: 0, filter: "blur(6px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.4, ease: [0.64, 0, 0.78, 0] } }}
          >
            <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 p-1 text-ash transition-colors hover:text-gold" aria-label="Закрыть">
              <X className="h-6 w-6" />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="border-gold/10 bg-obsidian/50 p-6 md:border-r md:p-8">
                <ProductGallery images={product.images} title={product.title} />
              </div>
              <div className="flex flex-col gap-6 p-6 md:p-10">
                <div>
                  <span className="font-display text-[0.6rem] tracking-[0.3em] text-gold/60">SKU: {product.sku}</span>
                  <span className="ml-3 font-display text-[0.6rem] uppercase tracking-[0.3em] text-ash">{TYPE_LABELS[product.type]}</span>
                  <h2 id="qv-title" className="mt-3 font-serif text-[32px] font-semibold leading-tight text-parchment">
                    {product.title}
                  </h2>
                  {product.titleEn && <p className="mt-1 font-serif text-base italic text-ash">{product.titleEn}</p>}
                  <p className="mt-4 font-display text-2xl text-gold">{formatPrice(product.price)}</p>
                </div>
                <p className="font-serif text-lg italic leading-relaxed text-parchment/85">{product.shortDescription}</p>
                <ProductSpecs product={product} />
                <ProductPurchase product={product} onAdded={onClose} />
                <Link href={`/shop/${product.slug}`} onClick={onClose} className={btnLink}>
                  Полная страница артефакта <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
