"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, formatKz, ServiceDefinition } from "@/lib/pricing";
import ServiceModal from "@/components/service-modal";

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<ServiceDefinition | null>(
    null
  );

  return (
    <section id="servicos" className="bg-canvas-light py-20 text-ink md:py-28">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-20 md:max-w-2xl">
          <p className="section-label">Serviços</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
            Serviços que resolvem e ainda elevam a marca
          </h2>
          <p className="text-base text-ink-muted md:text-lg">
            Cada entrega parte de uma necessidade real: vender melhor,
            organizar operação, lançar produto ou apresentar a marca com mais
            força no mobile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/45"
            >
              <div className="relative h-44 w-full overflow-hidden border-b border-accent/20">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">
                  {service.description}
                </p>

                <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
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
            </div>
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
