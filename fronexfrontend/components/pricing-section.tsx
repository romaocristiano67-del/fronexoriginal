"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SERVICES, formatKz } from "@/lib/pricing";

export default function PricingSection() {
  return (
    <section id="precos" className="py-24 md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:max-w-2xl">
          <div className="flag-thread" />
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Preços transparentes, sem surpresas
          </h2>
          <p className="text-base text-muted dark:text-muted-dark md:text-lg">
            Cada faixa de preço reflete a complexidade do que escolher no
            questionário. O valor final nunca ultrapassa o teto indicado.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card-fronex flex flex-col p-6"
            >
              <p className="font-display text-base font-semibold">
                {service.title}
              </p>
              <p className="mt-4 font-display text-3xl font-semibold">
                {formatKz(service.basePrice)}
              </p>
              <p className="text-xs text-muted dark:text-muted-dark">
                preço médio
              </p>

              <div className="my-5 h-px w-full bg-border dark:bg-border-dark" />

              <ul className="flex flex-1 flex-col gap-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-angola-red" />
                  Piso a partir de {formatKz(service.minPrice)}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-angola-red" />
                  Teto máximo de {formatKz(service.maxPrice)}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-angola-red" />
                  Orçamento calculado no questionário
                </li>
              </ul>

              <a
                href="#servicos"
                className="mt-6 flex items-center justify-center rounded-full border border-border py-2.5 text-sm font-medium transition-colors hover:border-ink dark:border-border-dark dark:hover:border-ink-dark"
              >
                Simular orçamento
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
