"use client";

import { Headphones, Pause } from "lucide-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useAmbient } from "@/components/providers/Ambient";

const EVENT = "sg-audio-guide";

/** Аудиогид: запись голоса художника, а если её нет — озвучка экспликации синтезом речи. */
export function AudioGuide({ id, url, transcript }: { id: string; url: string | null; transcript: string | null }) {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const { duck } = useAmbient();

  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) stop();
    };
    window.addEventListener(EVENT, onOther);
    return () => {
      window.removeEventListener(EVENT, onOther);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function stop() {
    audio.current?.pause();
    if (!url && typeof window !== "undefined") window.speechSynthesis?.cancel();
    setPlaying(false);
    duck(false);
  }

  function play() {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
    duck(true);
    setPlaying(true);
    if (url) {
      audio.current ??= new Audio(url);
      audio.current.onended = () => stop();
      audio.current.play().catch(() => stop());
      return;
    }
    if (!transcript || !("speechSynthesis" in window)) return stop();
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(transcript);
    u.lang = "ru-RU";
    u.rate = 0.88;
    u.pitch = 0.8;
    const voice = synth.getVoices().find((v) => v.lang.startsWith("ru") && /male|муж|yuri|pavel|dmitr/i.test(v.name)) ?? synth.getVoices().find((v) => v.lang.startsWith("ru"));
    if (voice) u.voice = voice;
    u.onend = () => stop();
    u.onerror = () => stop();
    synth.speak(u);
  }

  if (!url && !transcript) return null;

  return (
    <button
      type="button"
      onClick={() => (playing ? stop() : play())}
      aria-pressed={playing}
      className={clsx(
        "inline-flex items-center gap-2 font-display text-[0.6rem] uppercase tracking-[0.24em] transition-colors",
        playing ? "text-parchment" : "text-gold hover:text-parchment",
      )}
    >
      {playing ? <Pause className="h-3.5 w-3.5" /> : <Headphones className="h-3.5 w-3.5" />}
      {playing ? "Пауза" : "Аудиогид"}
      {playing && (
        <span className="wave-active flex h-3 items-end gap-[2px]" aria-hidden>
          {[0, 0.15, 0.3, 0.45].map((d) => (
            <span key={d} className="wave-bar h-3 w-[2px] bg-gold" style={{ animationDelay: `${d}s` }} />
          ))}
        </span>
      )}
    </button>
  );
}
