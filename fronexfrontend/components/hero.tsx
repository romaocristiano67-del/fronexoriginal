"use client";

import { motion } from "framer-motion";
import { ArrowRight, MoveDown } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function Hero() {
  return (
    <section
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

      <div className="container-fronex flex min-h-[calc(100svh-5rem)] items-center py-8 pb-14 lg:py-16">
        <motion.div className="flex flex-col items-start">
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
      </div>
    </section>
  );
}
