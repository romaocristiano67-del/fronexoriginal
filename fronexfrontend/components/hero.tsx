"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.64,
  ease: [0.22, 1, 0.36, 1] as const,
};

/** Cubo isométrico abstrato — sem fotografias */
function WireframeCube({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.85, rotateX: 12 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${className}`}
      style={{ perspective: 800 }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: "rotateX(58deg) rotateZ(-32deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Face superior */}
        <div
          className="absolute inset-0 border border-accent/70 bg-gradient-to-br from-accent/25 via-cyan-400/10 to-transparent shadow-neon"
          style={{ transform: "translateZ(0)" }}
        />
        {/* Face frontal */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 border border-accent/40 bg-gradient-to-t from-accent/15 to-transparent"
          style={{
            transform: "rotateX(-90deg)",
            transformOrigin: "bottom",
          }}
        />
        {/* Face lateral */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 border border-cyan-400/35 bg-gradient-to-l from-cyan-400/15 to-transparent"
          style={{
            transform: "rotateY(90deg)",
            transformOrigin: "right",
          }}
        />
      </div>
    </motion.div>
  );
}

function HeroGeometry() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-lg lg:max-w-none"
    >
      {/* Feixe diagonal de luz */}
      <div className="absolute -inset-[20%] animate-glow-pulse bg-[linear-gradient(125deg,transparent_35%,rgba(0,255,163,0.07)_48%,rgba(0,200,255,0.12)_52%,transparent_65%)]" />

      {/* Glow ambiente */}
      <div className="absolute right-[10%] top-[15%] h-48 w-48 rounded-full bg-accent/20 blur-[80px]" />
      <div className="absolute bottom-[20%] left-[15%] h-40 w-40 rounded-full bg-cyan-500/15 blur-[70px]" />

      {/* Grelha subtil */}
      <div
        className="absolute inset-[8%] opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,163,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,163,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      {/* Cluster de cubos */}
      <WireframeCube className="left-[18%] top-[22%] h-28 w-28 sm:h-36 sm:w-36" delay={0.2} />
      <WireframeCube className="right-[12%] top-[18%] h-20 w-20 sm:h-28 sm:w-28" delay={0.35} />
      <WireframeCube className="bottom-[18%] left-[28%] h-24 w-24 sm:h-32 sm:w-32" delay={0.5} />
      <WireframeCube className="bottom-[28%] right-[22%] h-16 w-16 sm:h-20 sm:w-20" delay={0.65} />

      {/* Linhas de brilho */}
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 400 400"
        fill="none"
      >
        <motion.path
          d="M40 280 L160 120 L280 200 L360 80"
          stroke="url(#neonStroke)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
        />
        <motion.path
          d="M80 340 L200 220 L320 300"
          stroke="url(#cyanStroke)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="neonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFA3" stopOpacity="0" />
            <stop offset="50%" stopColor="#00FFA3" stopOpacity="1" />
            <stop offset="100%" stopColor="#00E0FF" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="cyanStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E0FF" stopOpacity="0" />
            <stop offset="100%" stopColor="#00FFA3" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-canvas pt-20 text-white md:pt-24">
      {/* Atmosfera de fundo */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,163,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,120,255,0.06),transparent_45%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-canvas to-transparent"
      />

      <div className="container-fronex grid min-h-[calc(100svh-5rem)] items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-16">
        <div className="flex flex-col items-start">
          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={transition}
            className="section-label mb-6"
          >
            Fronex Studio
          </motion.p>

          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.08 }}
            className="max-w-3xl font-display text-[2.75rem] font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-[3.75rem]"
          >
            Inteligência, precisamente engenheirada para o futuro
            <span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-7 text-ink-muted md:text-lg md:leading-8"
          >
            Sites, apps, sistemas e identidades digitais com acabamento
            premium — clareza comercial e atenção ao detalhe em cada ecrã.
          </motion.p>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.24 }}
            className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <motion.a
              href="#portfolio"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
              className="btn-primary min-h-12 px-6 text-base"
            >
              Conheça o site
              <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href="/login"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
              className="btn-secondary min-h-12 px-6 text-base"
            >
              Criar conta
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          animate="show"
          transition={{ ...transition, delay: 0.18 }}
          className="relative flex items-center justify-center"
        >
          <HeroGeometry />
        </motion.div>
      </div>
    </section>
  );
}
