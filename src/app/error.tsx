"use client";

import { useEffect } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { btnPrimary } from "@/components/ui/buttons";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Glyph className="h-20 w-20 text-crimson-light/70" />
      <h1 className="mt-8 font-serif text-3xl uppercase tracking-[0.14em] text-parchment">Ритуал прерван</h1>
      <p className="mt-4 max-w-md font-serif text-xl text-ash">Что-то пошло не так по ту сторону завесы. Попробуйте ещё раз.</p>
      <button type="button" onClick={() => retry()} className={`${btnPrimary} mt-10`}>
        Повторить призыв
      </button>
    </div>
  );
}
