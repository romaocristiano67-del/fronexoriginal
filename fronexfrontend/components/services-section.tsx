"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, formatKz, ServiceDefinition } from "@/lib/pricing";
import ServiceModal from "@/components/service-modal";

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<ServiceDefinition | null>(
    null
  );

  return (
    <section id="servicos" className="bg-white py-24 text-zinc-950 transition-colors duration-300 dark:bg-[#0d0d0f] dark:text-[#f5f3ee] md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-20 md:max-w-2xl">
          <div className="flag-thread" />
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Serviços desenhados para resolver, não apenas decorar
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-300 md:text-lg">
            Cada serviço parte de uma necessidade concreta: vender melhor,
            organizar operação, lançar produto ou fortalecer a percepção da sua
            marca.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_70px_-48px_rgba(0,0,0,0.35)] transition-colors dark:border-white/10 dark:bg-white/[0.055] dark:shadow-[0_30px_95px_-60px_rgba(0,0,0,0.95)]"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {service.description}
                </p>

                <div className="mt-5 flex items-end justify-between border-t border-zinc-200 pt-4 dark:border-white/10">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Média
                    </p>
                    <p className="font-display text-lg font-semibold">
                      {formatKz(service.basePrice)}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      até {formatKz(service.maxPrice)}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveService(service)}
                    className="flex min-h-10 items-center gap-1 rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-transform hover:scale-[1.05] hover:bg-angola-red active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-angola-gold"
                  >
                    Estou Interessado
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </section>
  );
}
