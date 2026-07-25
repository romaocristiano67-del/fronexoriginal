"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.64,
  ease: [0.22, 1, 0.36, 1],
};

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f8f7f3] pt-20 text-zinc-950 transition-colors duration-300 dark:bg-[#080809] dark:text-[#f5f3ee] md:pt-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(206,17,38,0.10),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(247,209,22,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_20%_12%,rgba(206,17,38,0.20),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(247,209,22,0.12),transparent_28%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-b from-transparent to-white dark:to-[#080809]"
      />

      <div className="container-fronex grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <div className="flex flex-col items-start">
          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={transition}
            className="mb-5 inline-flex rounded-full border border-zinc-200 bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300"
          >
            Estúdio digital independente
          </motion.p>

          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.08 }}
            className="max-w-4xl font-display text-[3.15rem] font-semibold leading-[0.94] text-zinc-950 dark:text-[#f5f3ee] sm:text-6xl md:text-7xl"
          >
            Marcas digitais com presença, ritmo e confiança.
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300 md:text-xl md:leading-9"
          >
            A Fronex desenha sites, apps, sistemas e identidades visuais com
            acabamento premium, clareza comercial e atenção ao detalhe em cada
            ecrã.
          </motion.p>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.24 }}
            className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <motion.a
              href="#portfolio"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-base font-semibold text-white shadow-[0_18px_60px_-30px_rgba(0,0,0,0.45)] transition-colors hover:bg-angola-red dark:bg-white dark:text-zinc-950 dark:hover:bg-angola-gold"
            >
              Ver projectos
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.a>
            <motion.a
              href="#servicos"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white/85 px-5 text-base font-semibold text-zinc-950 shadow-sm backdrop-blur-xl transition-colors hover:border-zinc-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]"
            >
              Explorar serviços
            </motion.a>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.32 }}
            className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-300"
          >
            {["Feito em Angola", "Processo acompanhado", "Contacto directo"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                <CheckCircle2 size={15} className="text-angola-red" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          animate="show"
          transition={{ ...transition, delay: 0.18 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[0.82/1] w-full max-w-[24rem] overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_40px_120px_-65px_rgba(0,0,0,0.55)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-[0_50px_140px_-70px_rgba(0,0,0,0.95)] sm:aspect-[1.05/1] sm:max-w-xl">
            <Image
              src="/portfolio/websites-fronex.jpg"
              alt="Projecto de website criado pela Fronex"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/65 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/92 p-4 text-zinc-950 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/82 dark:text-white sm:inset-x-6 sm:bottom-6 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-angola-red">
                <Sparkles size={14} />
                Trabalho Fronex
              </div>
              <p className="mt-2 text-lg font-semibold leading-snug sm:text-2xl">
                Interfaces com intenção clara: apresentar, vender e acompanhar.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
