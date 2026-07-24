"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Layers3,
  MousePointer2,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  const { scrollY } = useScroll();
  const panelY = useTransform(scrollY, [0, 700], [0, -70]);
  const gridY = useTransform(scrollY, [0, 700], [0, 90]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden pt-20 md:pt-24">
      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(17,17,19,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,19,0.055)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(206,17,38,0.16),transparent_34%),linear-gradient(180deg,rgba(250,250,249,0)_0%,#FAFAF9_82%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(247,209,22,0.12),transparent_32%),linear-gradient(180deg,rgba(10,10,11,0)_0%,#0A0A0B_84%)]"
      />

      <div className="container-fronex relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-12 py-12 md:grid-cols-[1.02fr_0.98fr] md:py-20 lg:gap-16">
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-5 flex items-center gap-2 rounded-full border border-border bg-surface/75 px-3 py-1.5 text-xs font-medium text-muted shadow-soft backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark/65 dark:text-muted-dark"
          >
            <Sparkles size={13} className="text-angola-red" />
            Design, software e IA para marcas ambiciosas
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.06 }}
            className="max-w-4xl font-display text-[2.85rem] font-semibold leading-[0.98] tracking-tight text-ink dark:text-ink-dark sm:text-6xl md:text-6xl lg:text-7xl"
          >
            Produtos digitais com precisão visual e força de negócio.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14 }}
            className="mt-6 max-w-2xl text-base leading-7 text-muted dark:text-muted-dark md:text-lg"
          >
            A Fronex cria websites, apps, sistemas e experiências UI/UX para
            empresas que querem parecer maiores, vender melhor e operar com
            mais clareza desde o primeiro contacto.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href="#portfolio"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-semibold text-canvas shadow-soft-lg transition-transform hover:-translate-y-0.5 dark:bg-ink-dark dark:text-canvas-dark"
            >
              Ver portfólio
              <ArrowRight size={16} />
            </a>
            <a
              href="#servicos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-surface/80 px-5 text-sm font-semibold text-ink backdrop-blur-xl transition-colors hover:border-ink dark:border-border-dark dark:bg-surface-dark/70 dark:text-ink-dark dark:hover:border-ink-dark"
            >
              Explorar serviços
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-10 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {[
              "Mobile-first",
              "Entrega guiada",
              "Visual premium",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-md border border-border bg-surface/70 px-3 py-3 text-sm text-muted backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark/60 dark:text-muted-dark"
              >
                <CheckCircle2 size={15} className="text-angola-red" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y: panelY }}
          initial={{ opacity: 0, y: 34, rotateX: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="relative mx-auto w-full max-w-md perspective-1000 md:max-w-none"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-angola-red/10 blur-2xl dark:bg-angola-gold/10" />
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-[0_40px_120px_-45px_rgba(0,0,0,0.55)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.07]">
            <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 dark:border-white/10">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-angola-red" />
                <span className="h-2.5 w-2.5 rounded-full bg-angola-gold" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink/80 dark:bg-white/70" />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted dark:text-muted-dark">
                Fronex Studio
              </span>
            </div>

            <div className="grid gap-4 p-4 sm:p-5">
              <div className="rounded-xl bg-ink p-5 text-canvas dark:bg-ink-dark dark:text-canvas-dark">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] opacity-60">
                      Produto em foco
                    </p>
                    <p className="mt-6 max-w-[13rem] font-display text-2xl font-semibold leading-tight">
                      Plataforma de vendas com área de cliente
                    </p>
                  </div>
                  <Layers3 size={24} />
                </div>
                <div className="mt-8 h-2 rounded-full bg-white/15">
                  <motion.div
                    initial={{ width: "28%" }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.6, delay: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-angola-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-surface/80 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                  <p className="text-3xl font-semibold">92%</p>
                  <p className="mt-2 text-xs leading-5 text-muted dark:text-muted-dark">
                    foco em clareza, velocidade e conversão
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface/80 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                  <MousePointer2 size={20} className="text-angola-red" />
                  <p className="mt-6 text-sm font-semibold">
                    Interfaces pensadas para toque, leitura e ação
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface/80 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Sprint visual</p>
                    <p className="mt-1 text-xs text-muted dark:text-muted-dark">
                      Direção criativa, UI e protótipo navegável.
                    </p>
                  </div>
                  <span className="rounded-md bg-angola-red/10 px-3 py-1 text-xs font-semibold text-angola-red">
                    Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
