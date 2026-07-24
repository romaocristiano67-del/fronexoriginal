"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16 md:pt-20">
      {/* Vídeo de abertura em background */}
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover"
          src="/videos/hero-abertura.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/service-web.jpg"
        />
        {/* Overlay elegante para legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-canvas dark:to-canvas-dark" />
      </div>

      <div className="container-fronex relative z-10 flex flex-col items-start py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flag-thread mb-6"
        />

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          Tecnologia angolana,
          <br />
          feita para o mundo.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-base text-white/80 md:text-lg"
        >
          A Fronex cria sites, aplicações, sistemas, conteúdo e inteligência
          artificial para negócios em Luanda e além. Da ideia ao lançamento,
          sem complicação.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href="#servicos"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            Ver Serviços
            <ArrowRight size={16} />
          </a>
          <a
            href="#video-institucional"
            className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <Play size={16} />
            Ver vídeo institucional
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6"
        >
          {[
            { value: "6", label: "Áreas de serviço" },
            { value: "48h", label: "Resposta média" },
            { value: "100%", label: "Feito em Angola" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-semibold text-white md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
