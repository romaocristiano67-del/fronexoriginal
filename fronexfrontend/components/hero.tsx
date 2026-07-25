"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

/** Cubo isométrico — apenas desktop */
function WireframeCube({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
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
        <div
          className="absolute inset-0 border border-accent/70 bg-gradient-to-br from-accent/25 via-cyan-400/10 to-transparent shadow-neon"
          style={{ transform: "translateZ(0)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 border border-accent/40 bg-gradient-to-t from-accent/15 to-transparent"
          style={{
            transform: "rotateX(-90deg)",
            transformOrigin: "bottom",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 border border-cyan-400/35 bg-gradient-to-l from-cyan-400/15 to-transparent"
          style={{
            transform: "rotateY(90deg)",
            transformOrigin: "right",
          }}
        />
      </div>
    </div>
  );
}

function HeroGeometry() {
  return (
    <div
      aria-hidden
      className="relative mx-auto hidden aspect-square w-full max-w-lg md:block lg:max-w-none"
    >
      <div className="absolute -inset-[20%] bg-[linear-gradient(125deg,transparent_35%,rgba(0,255,163,0.07)_48%,rgba(0,200,255,0.12)_52%,transparent_65%)]" />
      <div className="absolute right-[10%] top-[15%] h-48 w-48 rounded-full bg-accent/20 blur-[80px]" />
      <div className="absolute bottom-[20%] left-[15%] h-40 w-40 rounded-full bg-cyan-500/15 blur-[70px]" />
      <div
        className="absolute inset-[8%] opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,163,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,163,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />
      <WireframeCube className="left-[18%] top-[22%] h-28 w-28 sm:h-36 sm:w-36" />
      <WireframeCube className="right-[12%] top-[18%] h-20 w-20 sm:h-28 sm:w-28" />
      <WireframeCube className="bottom-[18%] left-[28%] h-24 w-24 sm:h-32 sm:w-32" />
      <WireframeCube className="bottom-[28%] right-[22%] h-16 w-16 sm:h-20 sm:w-20" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050B14] pt-20 text-white md:pt-24">
      {/* Mobile: gradiente limpo | Desktop: glow completo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,255,163,0.07),transparent_55%)] md:bg-hero-glow"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,163,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,120,255,0.06),transparent_45%)] md:block"
      />

      <div className="container-fronex grid min-h-[calc(100svh-5rem)] items-center gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-16">
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
            transition={{ ...transition, delay: 0.06 }}
            className="max-w-3xl font-display text-[2.75rem] font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-[3.75rem]"
          >
            Inteligência, precisamente engenheirada para o futuro
            <span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.1 }}
            className="mt-6 max-w-xl text-base leading-7 text-ink-muted md:text-lg md:leading-8"
          >
            Sites, apps, sistemas e identidades digitais com acabamento
            premium — clareza comercial e atenção ao detalhe em cada ecrã.
          </motion.p>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ ...transition, delay: 0.14 }}
            className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <a href="#portfolio" className="btn-primary min-h-12 px-6 text-base">
              Conheça o site
              <ArrowRight size={18} />
            </a>
            <a href="/login" className="btn-secondary min-h-12 px-6 text-base">
              Criar conta
            </a>
          </motion.div>
        </div>

        <div className="relative hidden items-center justify-center md:flex">
          <HeroGeometry />
        </div>
      </div>
    </section>
  );
}
