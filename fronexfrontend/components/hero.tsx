"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Layers3, MoveDown, Smartphone, Sparkles } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
};

function FloatingCard({
  className,
  children,
  y,
  rotate,
}: {
  className: string;
  children: ReactNode;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ y, rotate }}
      className={`absolute rounded-[1.3rem] border border-border bg-surface/90 px-4 py-3 shadow-soft-dark backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function HeroShowcase({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const drift = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const driftSoft = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const rotate = useTransform(scrollYProgress, [0, 1], [7, -7]);
  const rotateSoft = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <motion.div
      style={{ y: drift, rotateX: rotate, rotateY: rotateSoft }}
      className="relative mx-auto w-full max-w-[27rem] scale-[0.94] [transform-style:preserve-3d] sm:scale-100"
    >
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,rgba(210,31,43,0.22),transparent_40%),radial-gradient(circle_at_bottom,rgba(242,201,76,0.18),transparent_34%)] blur-2xl"
      />
      <FloatingCard
        className="left-0 top-8 z-20 w-32 sm:left-2 sm:w-36"
        y={useTransform(scrollYProgress, [0, 1], [0, -18])}
        rotate={useTransform(scrollYProgress, [0, 1], [8, -2])}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Layers3 size={16} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Estrutura
            </p>
            <p className="text-sm font-bold text-ink">Camadas reais</p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        className="right-0 top-28 z-20 w-32 sm:right-2 sm:w-36"
        y={useTransform(scrollYProgress, [0, 1], [0, -12])}
        rotate={useTransform(scrollYProgress, [0, 1], [-7, 3])}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Smartphone size={16} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Mobile
            </p>
            <p className="text-sm font-bold text-ink">Pensado para mão</p>
          </div>
        </div>
      </FloatingCard>

      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-3 shadow-[0_30px_90px_-45px_rgba(0,0,0,0.55)]">
        <div className="rounded-[1.55rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,240,232,0.92))] p-4 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:bg-[linear-gradient(180deg,rgba(18,24,35,0.96),rgba(12,16,24,0.96))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Fronex
              </p>
              <p className="mt-1 text-sm font-medium text-ink">
                Identidade original em palco
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-canvas/80 px-3 py-1 text-[11px] font-semibold text-muted">
              <Sparkles size={12} className="text-accent" />
              Claro por padrão
            </span>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[1.4rem] border border-border bg-[radial-gradient(circle_at_top,rgba(210,31,43,0.12),transparent_36%),linear-gradient(145deg,rgba(255,255,255,0.95),rgba(247,243,237,0.88))] p-4 dark:bg-[radial-gradient(circle_at_top,rgba(210,31,43,0.18),transparent_32%),linear-gradient(145deg,rgba(16,21,31,0.98),rgba(12,16,24,0.96))]">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#111111_0%,#D21F2B_45%,#F2C94C_100%)]" />
            <div className="flex items-center justify-center rounded-[1.2rem] border border-border bg-white p-5 shadow-[0_24px_40px_-28px_rgba(0,0,0,0.45)] dark:bg-[#0b1119]">
              <Image
                src="/images/logo-fronex-original.jpg"
                alt="Logo original da Fronex"
                width={900}
                height={900}
                priority
                className="h-auto w-full max-w-[17rem] object-contain"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                "Marca",
                "Detalhe",
                "Ritmo",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.06, ...transition }}
                  className="rounded-xl border border-border bg-surface/90 px-2 py-2 text-center"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[1rem] border border-border bg-surface/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:hidden">
              <span>Mobile-first</span>
              <span className="text-accent">Fronex</span>
            </div>
          </div>
        </div>
      </div>

      <FloatingCard
        className="bottom-8 left-6 z-20 w-36 sm:left-8"
        y={driftSoft}
        rotate={rotateSoft}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Mobile-first
        </p>
        <p className="mt-1 text-sm font-bold text-ink">Pensado para ecrãs pequenos</p>
      </FloatingCard>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, 26]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-24 text-ink md:pt-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-hero-glow"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(242,201,76,0.1),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(210,31,43,0.14),transparent_34%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(210,31,43,0.45),rgba(242,201,76,0.7),transparent)]"
      />

      <div className="container-fronex grid min-h-[calc(100svh-5rem)] items-center gap-10 py-8 pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-16">
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
            A Fronex abre com leitura imediata no telemóvel, composição limpa e
            uma paleta inspirada na marca original para parecer viva, cuidada e
            memorável.
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
            {["Mobile-first", "Claro por padrão", "Dark moderno"].map((item) => (
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
          <HeroShowcase scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
