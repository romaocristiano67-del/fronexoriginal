"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_38%)]"
      />

      <div className="container-fronex grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 pb-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:py-16">
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
            Sites, aplicações e sistemas com leitura clara no telemóvel,
            identidade cuidada e uma experiência consistente em qualquer ecrã.
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

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-border/70 bg-surface shadow-[0_32px_90px_-48px_rgba(20,30,50,0.42)]">
            <Image
              src="/portfolio/websites-fronex.jpg"
              alt="Exemplos de websites responsivos desenvolvidos pela Fronex"
              fill
              priority
              sizes="(min-width: 1280px) 48vw, 50vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
