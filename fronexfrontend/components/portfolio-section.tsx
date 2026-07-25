"use client";

import Image from "next/image";
import { ArrowUpRight, BriefcaseBusiness, MonitorSmartphone } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  buildPremiumServiceRequestMessage,
  getWhatsAppLink,
} from "@/lib/whatsapp";

type PortfolioItem = {
  title: string;
  service: string;
  description: string;
  image: string;
  featured?: boolean;
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    title: "Sites modernos e responsivos",
    service: "Sites & Web",
    description:
      "Layouts institucionais, imobiliários e corporativos com navegação clara, secções de serviço e apresentação profissional.",
    image: "/portfolio/websites-fronex.jpg",
    featured: true,
  },
  {
    title: "Aplicações móveis",
    service: "Apps & Sistemas",
    description:
      "Interfaces para apps de treino, delivery, finanças e educação, desenhadas para uso real no telemóvel.",
    image: "/portfolio/apps-fronex.jpeg",
  },
  {
    title: "Sistema de gestão",
    service: "Sistemas Web",
    description:
      "Dashboard administrativo com métricas, relatórios, stock e leitura financeira para operação diária.",
    image: "/portfolio/dashboard-fronex.jpg",
  },
  {
    title: "Edição e design profissional",
    service: "Design Gráfico",
    description:
      "Tratamento visual, edição de imagem e materiais gráficos com aspecto preparado para marca e campanha.",
    image: "/portfolio/photoshop-fronex.jpg",
    featured: true,
  },
];

export default function PortfolioSection() {
  const handleServiceRequest = async (serviceTitle: string) => {
    let clientEmail: string | undefined;
    let clientName: string | undefined;
    let userId: string | undefined;

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      clientEmail = user?.email;
      userId = user?.id;
      clientName =
        typeof user?.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : undefined;
    } catch {
      // Visitantes sem sessão seguem para atendimento sem dados pessoais.
    }

    const message = buildPremiumServiceRequestMessage({
      serviceTitle,
      source: "portfolio",
      clientEmail,
      clientName,
      userId,
    });

    toast.info(
      "A redirecionar para o atendimento premium para finalizar o seu pedido e verificar o pagamento...",
      { duration: 1800 }
    );

    window.setTimeout(() => {
      window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
    }, 900);
  };

  return (
    <section id="portfolio" className="bg-canvas py-24 text-white md:py-32">
      <div className="container-fronex">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div className="flex flex-col gap-4">
            <p className="section-label">Portfólio</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
              Portfólio com matéria real
            </h2>
          </div>
          <p className="text-lg leading-8 text-ink-muted">
            Em vez de mockups genéricos, a secção mostra peças visuais criadas
            para comunicar entrega, contexto e nível de acabamento.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {PORTFOLIO_ITEMS.map((item) => (
            <article
              key={item.title}
              className={`group overflow-hidden rounded-2xl border border-white/[0.06] bg-surface transition-colors hover:border-accent/25 ${
                item.featured ? "lg:col-span-7" : "lg:col-span-5"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={item.featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                    <BriefcaseBusiness size={13} />
                    {item.service}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                    <MonitorSmartphone size={17} strokeWidth={1.5} />
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold leading-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleServiceRequest(item.service)}
                  className="btn-primary mt-5 min-h-11 px-4 text-sm"
                >
                  Solicitar orçamento
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
