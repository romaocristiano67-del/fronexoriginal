"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
    <section id="portfolio" className="bg-[#f8f7f3] py-24 text-zinc-950 transition-colors duration-300 dark:bg-[#080809] dark:text-[#f5f3ee] md:py-32">
      <div className="container-fronex">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div className="flex flex-col gap-4">
            <div className="flag-thread" />
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
              Portfólio com matéria real
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Em vez de mockups genéricos, a secção mostra peças visuais criadas
            para comunicar entrega, contexto e nível de acabamento.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_26px_90px_-58px_rgba(0,0,0,0.5)] transition-colors dark:border-white/10 dark:bg-white/[0.055] dark:shadow-[0_34px_110px_-65px_rgba(0,0,0,0.95)] ${
                item.featured ? "lg:col-span-7" : "lg:col-span-5"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={item.featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-[#f8f7f3] px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300">
                    <BriefcaseBusiness size={13} />
                    {item.service}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                    <MonitorSmartphone size={17} />
                  </span>
                </div>

                <h3 className="font-display text-2xl font-semibold leading-tight text-zinc-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleServiceRequest(item.service)}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-angola-red active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-angola-gold"
                >
                  Solicitar orçamento
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
