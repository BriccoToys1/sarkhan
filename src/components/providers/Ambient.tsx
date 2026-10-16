"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type AmbientTrack = { id: string; title: string; preset: string; url?: string | null };

type AmbientState = {
  playing: boolean;
  track: AmbientTrack | null;
  toggle: (track?: AmbientTrack) => void;
  stop: () => void;
  duck: (on: boolean) => void;
};

const AmbientContext = createContext<AmbientState | null>(null);

export function useAmbient() {
  const ctx = useContext(AmbientContext);
  if (!ctx) throw new Error("useAmbient вне AmbientProvider");
  return ctx;
}

export const DEFAULT_TRACK: AmbientTrack = { id: "temple", title: "Эмбиент Храма", preset: "default" };

/** Синтезированные пресеты: базовая частота дрона и лад для колокольных отзвуков. */
const PRESETS: Record<string, { base: number; scale: number[]; noise: number; cutoff: number }> = {
  default: { base: 51.9, scale: [0, 7, 12, 15, 19, 24], noise: 0.05, cutoff: 260 },
  lilith: { base: 55, scale: [0, 3, 7, 10, 12, 15, 22], noise: 0.06, cutoff: 230 },
  alchemy: { base: 65.4, scale: [0, 7, 12, 14, 19, 24, 26], noise: 0.035, cutoff: 340 },
  bestiary: { base: 49, scale: [0, 1, 7, 8, 12, 13], noise: 0.11, cutoff: 190 },
};

type Graph = { ctx: AudioContext; master: GainNode; stopAll: () => void };

function buildSynth(preset: string): Graph {
  const p = PRESETS[preset] ?? PRESETS.default;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp).connect(ctx.destination);

  // Псевдо-реверберация: задержка с обратной связью
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.48;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(master);

  const nodes: AudioScheduledSourceNode[] = [];

  // Дрон
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = p.cutoff;
  filter.Q.value = 5;
  filter.connect(master);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = p.cutoff * 0.45;
  lfo.connect(lfoGain).connect(filter.frequency);
  nodes.push(lfo);

  [
    { type: "sawtooth" as OscillatorType, f: p.base, g: 0.22 },
    { type: "sawtooth" as OscillatorType, f: p.base * 1.004, g: 0.18 },
    { type: "triangle" as OscillatorType, f: p.base * 2.0, g: 0.12 },
    { type: "sine" as OscillatorType, f: p.base * 1.5, g: 0.1 },
  ].forEach((v) => {
    const o = ctx.createOscillator();
    o.type = v.type;
    o.frequency.value = v.f;
    const g = ctx.createGain();
    g.gain.value = v.g;
    o.connect(g).connect(filter);
    nodes.push(o);
  });

  // Ветер: фильтрованный шум
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 420;
  band.Q.value = 0.7;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = p.noise;
  noise.connect(band).connect(noiseGain).connect(master);
  const windLfo = ctx.createOscillator();
  windLfo.frequency.value = 0.08;
  const windDepth = ctx.createGain();
  windDepth.gain.value = 260;
  windLfo.connect(windDepth).connect(band.frequency);
  nodes.push(noise, windLfo);

  nodes.forEach((n) => n.start());

  // Колокольные отзвуки
  let bellTimer = 0;
  const bell = () => {
    const step = p.scale[Math.floor(Math.random() * p.scale.length)];
    const freq = p.base * 4 * Math.pow(2, step / 12);
    const now = ctx.currentTime;
    [1, 2.76, 5.4].forEach((ratio, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq * ratio;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.05 / (i + 1), now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 5 - i);
      o.connect(g);
      g.connect(master);
      g.connect(delay);
      o.start(now);
      o.stop(now + 5.2);
    });
    bellTimer = window.setTimeout(bell, 5000 + Math.random() * 7000);
  };
  bellTimer = window.setTimeout(bell, 2500);

  return {
    ctx,
    master,
    stopAll: () => {
      window.clearTimeout(bellTimer);
      nodes.forEach((n) => {
        try {
          n.stop();
        } catch {}
      });
    },
  };
}

export function AmbientProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<AmbientTrack | null>(null);
  const graph = useRef<Graph | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const level = useRef(0.3);

  const teardown = useCallback((fade = 1.2) => {
    const g = graph.current;
    const a = audio.current;
    graph.current = null;
    audio.current = null;
    if (g) {
      const now = g.ctx.currentTime;
      g.master.gain.cancelScheduledValues(now);
      g.master.gain.setValueAtTime(g.master.gain.value, now);
      g.master.gain.linearRampToValueAtTime(0, now + fade);
      window.setTimeout(() => {
        g.stopAll();
        g.ctx.close().catch(() => {});
      }, fade * 1000 + 100);
    }
    if (a) {
      const start = a.volume;
      const steps = 12;
      let i = 0;
      const t = window.setInterval(() => {
        i++;
        a.volume = Math.max(0, start * (1 - i / steps));
        if (i >= steps) {
          window.clearInterval(t);
          a.pause();
        }
      }, (fade * 1000) / steps);
    }
  }, []);

  const start = useCallback((t: AmbientTrack) => {
    if (t.url) {
      const a = new Audio(t.url);
      a.loop = true;
      a.volume = 0;
      a.play().catch(() => {});
      let v = 0;
      const timer = window.setInterval(() => {
        v = Math.min(0.6, v + 0.03);
        a.volume = v;
        if (v >= 0.6) window.clearInterval(timer);
      }, 100);
      audio.current = a;
    } else {
      const g = buildSynth(t.preset);
      const now = g.ctx.currentTime;
      g.master.gain.linearRampToValueAtTime(level.current, now + 3);
      graph.current = g;
    }
    setTrack(t);
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    teardown();
    setPlaying(false);
  }, [teardown]);

  const toggle = useCallback(
    (t?: AmbientTrack) => {
      const next = t ?? track ?? DEFAULT_TRACK;
      if (playing && track?.id === next.id) {
        stop();
        return;
      }
      if (playing) teardown(0.8);
      start(next);
    },
    [playing, track, start, stop, teardown],
  );

  const duck = useCallback((on: boolean) => {
    level.current = on ? 0.06 : 0.3;
    const g = graph.current;
    if (g) g.master.gain.linearRampToValueAtTime(level.current, g.ctx.currentTime + 0.6);
    if (audio.current) audio.current.volume = on ? 0.12 : 0.6;
  }, []);

  useEffect(() => () => teardown(0.1), [teardown]);

  return <AmbientContext.Provider value={{ playing, track, toggle, stop, duck }}>{children}</AmbientContext.Provider>;
}
