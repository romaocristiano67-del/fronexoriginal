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
    <section id="servicos" className="py-24 md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-20 md:max-w-2xl">
          <div className="flag-thread" />
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Serviços feitos à medida do seu negócio
          </h2>
          <p className="text-base text-muted dark:text-muted-dark md:text-lg">
            Escolha uma área, responda a um pequeno questionário e receba um
            orçamento ajustado às suas necessidades — em segundos.
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
              className="card-fronex group flex flex-col overflow-hidden"
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
                <p className="mt-2 flex-1 text-sm text-muted dark:text-muted-dark">
                  {service.description}
                </p>

                <div className="mt-5 flex items-end justify-between border-t border-border pt-4 dark:border-border-dark">
                  <div>
                    <p className="text-xs text-muted dark:text-muted-dark">
                      Média
                    </p>
                    <p className="font-display text-lg font-semibold">
                      {formatKz(service.basePrice)}
                    </p>
                    <p className="text-[11px] text-muted dark:text-muted-dark">
                      até {formatKz(service.maxPrice)}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveService(service)}
                    className="flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-xs font-medium text-canvas transition-transform hover:scale-[1.05] dark:bg-ink-dark dark:text-canvas-dark"
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
