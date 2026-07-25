"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clapperboard,
  Film,
  Globe,
  Palette,
  Share2,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { SERVICES, formatKz, ServiceDefinition, ServiceId } from "@/lib/pricing";
import ServiceModal from "@/components/service-modal";

const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  web: Globe,
  apps: Smartphone,
  social: Share2,
  "ai-video": Film,
  "video-edit": Clapperboard,
  design: Palette,
};

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<ServiceDefinition | null>(
    null
  );

  return (
    <section id="servicos" className="bg-canvas-light py-24 text-white md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-20 md:max-w-2xl">
          <p className="section-label">Serviços</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Serviços desenhados para resolver, não apenas decorar
          </h2>
          <p className="text-base text-ink-muted md:text-lg">
            Cada serviço parte de uma necessidade concreta: vender melhor,
            organizar operação, lançar produto ou fortalecer a percepção da sua
            marca.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.id] ?? Globe;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-surface transition-colors hover:border-accent/30"
              >
                <div className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent transition-shadow group-hover:shadow-neon">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {service.title}
                  </h3>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-6 text-ink-muted">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-end justify-between border-t border-white/[0.06] pt-4">
                    <div>
                      <p className="text-xs text-muted">Média</p>
                      <p className="font-display text-lg font-bold text-accent">
                        {formatKz(service.basePrice)}
                      </p>
                      <p className="text-[11px] font-bold text-accent/80">
                        até {formatKz(service.maxPrice)}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveService(service)}
                      className="btn-primary min-h-10 px-4 text-xs"
                    >
                      Estou Interessado
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
