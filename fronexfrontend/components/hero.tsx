"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Layers3, MoveDown, Smartphone, Sparkles } from "lucide-react";
import Wordmark from "@/components/wordmark";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
};

const HERO_TILES = [
  {
    icon: Layers3,
    title: "Arquitectura",
    text: "Estrutura limpa para sites, apps e sistemas que crescem sem perder ordem.",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    text: "Leitura rápida, blocos leves e navegação pensada primeiro para ecrãs pequenos.",
  },
  {
    icon: Sparkles,
    title: "Acabamento",
    text: "Detalhe visual com toque premium, sem exageros e sem ruído desnecessário.",
  },
];

function HeroPanel({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -14]);

  return (
    <motion.div
      style={{ y: panelY }}
      className="relative mx-auto w-full max-w-[34rem]"
    >
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2.4rem] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_44%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.14),transparent_36%)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-4 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.5)] sm:p-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-sky-400 to-accent-soft" />
        <div className="grid gap-4">
          <div className="flex items-start justify-between gap-4">
            <Wordmark textClassName="text-[1.04rem] sm:text-[1.12rem]" />
            <span className="rounded-full border border-border bg-canvas/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Tech-first
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {HERO_TILES.map((tile, index) => {
              const Icon = tile.icon;
              return (
                <motion.div
                  key={tile.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition, delay: 0.05 + index * 0.05 }}
                  className="rounded-[1.35rem] border border-border bg-canvas-light/70 p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                    <Icon size={16} />
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {tile.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {tile.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-[1.5rem] border border-border bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,249,255,0.9))] p-4 dark:bg-[linear-gradient(145deg,rgba(18,24,37,0.98),rgba(11,18,31,0.94))]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-md">
                <p className="section-label">Mobile-first</p>
                <p className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-[1.8rem]">
                  Interfaces nítidas e prontas para ecrãs pequenos.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Preparado para performance
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Sites", "Apps", "Sistemas"].map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-surface/90 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-24 text-ink md:pt-28"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_34%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(37,99,235,0.45),rgba(34,211,238,0.7),transparent)]"
      />

      <div className="container-fronex grid min-h-[calc(100svh-5rem)] items-center gap-10 py-8 pb-14 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12 lg:py-16">
        <motion.div
          style={{ y: copyY }}
          className="order-2 flex flex-col items-start lg:order-1"
        >
          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={transition}
            className="section-label mb-5"
          >
            Fronex Studio
          </motion.p>

          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.06 }}
            className="max-w-[12ch] font-display text-[2.55rem] font-extrabold leading-[0.95] tracking-tight text-ink sm:max-w-3xl sm:text-5xl sm:leading-[0.98] md:text-6xl lg:text-[4rem]"
          >
            <span className="block">Presença digital</span>
            <span className="block">com corpo, ritmo e detalhe.</span>
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.11 }}
            className="mt-5 max-w-xl text-[0.98rem] leading-7 text-ink-muted sm:text-base md:text-lg md:leading-8"
          >
            A Fronex abre com leitura imediata no telemóvel, uma composição
            mais técnica e uma identidade limpa para parecer viva, cuidada e
            moderna em qualquer ecrã.
          </motion.p>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.16 }}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <a href="#servicos" className="btn-primary min-h-12 px-6 text-base">
              Explorar serviços
              <ArrowRight size={18} />
            </a>
            <a href="#portfolio" className="btn-secondary min-h-12 px-6 text-base">
              Ver portfólio
            </a>
          </motion.div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {["Mobile-first", "Site tech", "Dark moderno"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-muted"
              >
                {item}
              </span>
            ))}
          </div>

          <a
            href="#sobre"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
          >
            Descobrir a estrutura
            <MoveDown size={16} />
          </a>
        </motion.div>

        <div className="order-1 flex items-center justify-center lg:order-2">
          <HeroPanel scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
