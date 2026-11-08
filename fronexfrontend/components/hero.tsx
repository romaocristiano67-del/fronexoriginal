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
      className="relative isolate overflow-hidden pt-20 text-ink md:pt-28"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_38%)]"
      />

      <div className="container-fronex grid items-start gap-8 py-6 pb-10 lg:min-h-[72svh] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:py-16">
        <motion.div className="flex flex-col items-start">
          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.06 }}
            className="max-w-[14ch] font-display text-[2.4rem] font-extrabold leading-[0.96] tracking-tight text-ink sm:max-w-3xl sm:text-5xl sm:leading-[0.98] md:text-6xl lg:text-[4rem]"
          >
            <span className="block">Presença digital</span>
            <span className="block">com corpo, ritmo e detalhe.</span>
          </motion.h1>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.16 }}
            className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
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
              loading="lazy"
              sizes="(min-width: 1280px) 48vw, 50vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
