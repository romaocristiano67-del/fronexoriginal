"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const revealTransition = {
  duration: 0.62,
  ease: [0.22, 1, 0.36, 1],
};

const proofPoints = [
  "Leitura clara em ecrãs pequenos",
  "Ações visíveis sem esforço",
  "Fluxo vertical desenhado para toque",
];

const storySteps = [
  {
    kicker: "01",
    title: "Primeiro impacto sem ruído.",
    copy: "A mensagem entra rápido, com contraste alto, hierarquia forte e espaço suficiente para a página respirar no telemóvel.",
  },
  {
    kicker: "02",
    title: "Cada toque tem resposta.",
    copy: "Os botões reagem no instante certo com escala, brilho e movimento curto, mantendo a experiência fluida mesmo em dispositivos modestos.",
  },
  {
    kicker: "03",
    title: "Scroll que conduz a decisão.",
    copy: "A narrativa aparece em sequência enquanto o visitante avança com o dedo, sem excesso visual e sem distrações no caminho.",
  },
];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 0.45], shouldReduceMotion ? [0, 0] : [0, 90]);
  const lineScale = useTransform(scrollYProgress, [0, 0.42], [0.08, 1]);

  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 pt-20 text-zinc-50 md:pt-24">
      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(9,9,11,0)_0%,#09090b_74%),linear-gradient(135deg,rgba(206,17,38,0.18)_0%,transparent_34%,rgba(247,209,22,0.08)_100%)]"
      />

      <div className="container-fronex relative z-10">
        <div className="flex min-h-[calc(100svh-5rem)] flex-col justify-center py-10 md:min-h-[calc(100vh-6rem)] md:py-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={revealTransition}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-zinc-200 backdrop-blur-xl"
          >
            <Sparkles size={13} className="text-angola-gold" />
            Mobile-first, dark-first, pronto para vender
          </motion.div>

          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...revealTransition, delay: 0.08 }}
            className="max-w-5xl font-display text-[3.25rem] font-semibold leading-[0.94] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Experiências digitais que cabem na mão e parecem maiores que a marca.
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...revealTransition, delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl md:leading-9"
          >
            Websites, apps e sistemas com UI/UX limpo, rápido e pensado primeiro
            para quem navega no smartphone.
          </motion.p>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...revealTransition, delay: 0.24 }}
            className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <motion.a
              href="#portfolio"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-white px-5 text-base font-semibold text-zinc-950 shadow-[0_18px_60px_-24px_rgba(255,255,255,0.9)] outline-none transition-[filter,box-shadow] duration-200 hover:brightness-110 active:brightness-95"
            >
              Ver portfólio
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.a>
            <motion.a
              href="#servicos"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.06] px-5 text-base font-semibold text-white backdrop-blur-xl transition-[background-color,border-color,filter] duration-200 hover:border-white/30 hover:bg-white/[0.1] active:brightness-125"
            >
              Explorar serviços
            </motion.a>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...revealTransition, delay: 0.32 }}
            className="mt-10 grid gap-3 text-sm text-zinc-300 sm:max-w-2xl sm:grid-cols-3"
          >
            {proofPoints.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-3">
                <CheckCircle2 size={16} className="shrink-0 text-angola-gold" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.a
            href="#mobile-story"
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...revealTransition, delay: 0.42 }}
            whileTap={{ scale: 0.94 }}
            className="mt-12 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white transition-colors duration-200 hover:bg-white/10"
            aria-label="Continuar"
          >
            <ArrowDown size={18} />
          </motion.a>
        </div>

        <div id="mobile-story" className="relative pb-20 pt-6 md:pb-28">
          <motion.div
            aria-hidden
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="absolute left-4 top-8 hidden h-[calc(100%-7rem)] w-px bg-gradient-to-b from-angola-gold via-white/20 to-transparent sm:block"
          />

          <div className="grid gap-5 md:gap-6">
            {storySteps.map((step, index) => (
              <motion.article
                key={step.kicker}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.38 }}
                transition={{ ...revealTransition, delay: index * 0.07 }}
                className="relative rounded-lg border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl sm:ml-12 sm:p-6 md:max-w-3xl"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.24em] text-angola-gold">{step.kicker}</span>
                  <Zap size={16} className="text-zinc-500" />
                </div>
                <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-white md:text-4xl">
                  {step.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
                  {step.copy}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
