"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Brush,
  Clapperboard,
  Globe2,
  LayoutDashboard,
  Megaphone,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  buildPremiumServiceRequestMessage,
  getWhatsAppLink,
} from "@/lib/whatsapp";

type MockupKind =
  | "website"
  | "mobile"
  | "system"
  | "social"
  | "aiVideo"
  | "videoEdit"
  | "brand";

const PORTFOLIO_ITEMS: Array<{
  title: string;
  service: string;
  description: string;
  kind: MockupKind;
  icon: typeof Globe2;
  accent: string;
}> = [
  {
    title: "Landing page para marca premium",
    service: "Sites & Web",
    description:
      "Website responsivo com hero forte, catálogo visual e CTA direto para conversão.",
    kind: "website",
    icon: Globe2,
    accent: "bg-angola-red",
  },
  {
    title: "App mobile de pedidos",
    service: "Aplicações Mobile",
    description:
      "Fluxo de app com onboarding, lista de pedidos, notificações e área de cliente.",
    kind: "mobile",
    icon: Smartphone,
    accent: "bg-ink dark:bg-ink-dark",
  },
  {
    title: "Sistema web de gestão",
    service: "Sistemas Web",
    description:
      "Dashboard operacional com métricas, tabela de clientes e estado dos processos.",
    kind: "system",
    icon: LayoutDashboard,
    accent: "bg-angola-gold",
  },
  {
    title: "Calendário de conteúdo social",
    service: "Gestão de Redes/TikTok",
    description:
      "Planeamento de posts, campanhas e peças para Instagram, TikTok e WhatsApp.",
    kind: "social",
    icon: Megaphone,
    accent: "bg-[#2563EB]",
  },
  {
    title: "Vídeo comercial com IA",
    service: "Vídeos de IA",
    description:
      "Storyboard, avatar, voz, cenas e variações criativas para campanhas rápidas.",
    kind: "aiVideo",
    icon: Bot,
    accent: "bg-[#7C3AED]",
  },
  {
    title: "Timeline de edição dinâmica",
    service: "Edição de Vídeos",
    description:
      "Cortes, legendas, trilha, motion e exportação otimizada para redes sociais.",
    kind: "videoEdit",
    icon: Clapperboard,
    accent: "bg-[#059669]",
  },
  {
    title: "Sistema visual de marca",
    service: "Design Gráfico / UI/UX",
    description:
      "Identidade visual, componentes de interface, cartões e peças de comunicação.",
    kind: "brand",
    icon: Brush,
    accent: "bg-[#EA580C]",
  },
];

function BrowserMockup() {
  return (
    <div className="h-full rounded-2xl border border-white/70 bg-white/80 p-3 shadow-soft-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-angola-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-angola-gold" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/70 dark:bg-white/70" />
        <span className="ml-2 h-6 flex-1 rounded-md bg-ink/5 dark:bg-white/10" />
      </div>
      <div className="grid h-[15rem] gap-3 rounded-xl bg-[#111113] p-4 text-white sm:h-[19rem]">
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
          <div className="flex flex-col justify-between rounded-xl bg-white/[0.08] p-4">
            <div>
              <div className="h-3 w-20 rounded-full bg-angola-red" />
              <div className="mt-5 h-6 w-32 rounded-md bg-white/80" />
              <div className="mt-2 h-6 w-24 rounded-md bg-white/50" />
            </div>
            <div className="h-9 w-28 rounded-md bg-angola-gold" />
          </div>
          <div className="rounded-xl bg-[linear-gradient(135deg,#CE1126,#F7D116)] p-3">
            <div className="h-full rounded-lg border border-white/30 bg-white/25" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-lg bg-white/[0.08] p-3">
              <div className="h-3 w-10 rounded-full bg-white/55" />
              <div className="mt-6 h-2 rounded-full bg-white/20" />
              <div className="mt-2 h-2 w-2/3 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMockup() {
  return (
    <div className="mx-auto flex h-[19rem] w-[10.5rem] flex-col rounded-[2rem] border-[7px] border-ink bg-canvas p-3 shadow-soft-lg dark:border-ink-dark dark:bg-canvas-dark sm:h-[22rem] sm:w-48">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border dark:bg-border-dark" />
      <div className="rounded-2xl bg-ink p-4 text-canvas dark:bg-ink-dark dark:text-canvas-dark">
        <p className="text-[11px] opacity-60">Pedido ativo</p>
        <p className="mt-2 text-2xl font-semibold">18 min</p>
      </div>
      <div className="mt-3 grid gap-2">
        {["Entrega", "Pagamento", "Suporte"].map((item, index) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-2 dark:border-border-dark dark:bg-surface-dark"
          >
            <span className="text-[11px] font-semibold">{item}</span>
            <span
              className={`h-2 w-8 rounded-full ${
                index === 0 ? "bg-angola-red" : "bg-border dark:bg-border-dark"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <span key={item} className="h-8 rounded-xl bg-ink/8 dark:bg-white/10" />
        ))}
      </div>
    </div>
  );
}

function SystemMockup() {
  return (
    <div className="rounded-2xl border border-border bg-surface/85 p-3 shadow-soft-lg dark:border-border-dark dark:bg-surface-dark/80">
      <div className="grid h-[17rem] grid-cols-[4rem_1fr] overflow-hidden rounded-xl border border-border dark:border-border-dark sm:h-[20rem] sm:grid-cols-[5.5rem_1fr]">
        <div className="bg-ink p-3 dark:bg-ink-dark">
          <div className="mb-6 h-8 w-8 rounded-lg bg-angola-red" />
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="mb-3 h-2 rounded-full bg-white/20" />
          ))}
        </div>
        <div className="bg-canvas p-4 dark:bg-canvas-dark">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="h-4 w-24 rounded-md bg-ink/80 dark:bg-white/80" />
              <div className="mt-2 h-2 w-36 rounded-full bg-muted/25" />
            </div>
            <div className="h-9 w-20 rounded-md bg-angola-gold" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[78, 42, 91].map((value) => (
              <div key={value} className="rounded-xl bg-surface p-3 shadow-soft dark:bg-surface-dark">
                <div className="h-2 w-8 rounded-full bg-muted/30" />
                <p className="mt-4 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-surface p-3 shadow-soft dark:bg-surface-dark">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="mb-3 grid grid-cols-[1fr_4rem_2rem] gap-3 last:mb-0">
                <span className="h-2 rounded-full bg-muted/20" />
                <span className="h-2 rounded-full bg-angola-red/25" />
                <span className="h-2 rounded-full bg-muted/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialMockup() {
  return (
    <div className="grid h-[18rem] grid-cols-3 gap-3 rounded-2xl border border-border bg-surface/80 p-3 shadow-soft-lg dark:border-border-dark dark:bg-surface-dark/78 sm:h-[20rem]">
      {["SEG", "TER", "QUA"].map((day, index) => (
        <div key={day} className="rounded-xl bg-canvas p-3 dark:bg-canvas-dark">
          <p className="text-[10px] font-bold text-muted dark:text-muted-dark">{day}</p>
          <div
            className={`mt-3 rounded-lg p-3 text-white ${
              index === 0 ? "bg-angola-red" : index === 1 ? "bg-ink dark:bg-ink-dark" : "bg-[#2563EB]"
            }`}
          >
            <div className="h-14 rounded-md bg-white/20" />
            <div className="mt-3 h-2 rounded-full bg-white/60" />
            <div className="mt-2 h-2 w-2/3 rounded-full bg-white/30" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-2 rounded-full bg-muted/20" />
            <div className="h-2 w-2/3 rounded-full bg-muted/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AiVideoMockup() {
  return (
    <div className="rounded-2xl border border-border bg-[#101014] p-4 text-white shadow-soft-lg dark:border-border-dark">
      <div className="grid h-[17rem] gap-3 sm:h-[20rem]">
        <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_35%,rgba(124,58,237,0.8),transparent_28%),linear-gradient(135deg,#1F1F29,#09090B)]">
          <div className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full bg-white/20" />
          <div className="absolute bottom-10 left-1/2 h-24 w-36 -translate-x-1/2 rounded-t-[3rem] bg-white/15" />
          <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/40 p-3 backdrop-blur-xl">
            <div className="h-2 w-24 rounded-full bg-white/60" />
            <div className="mt-2 h-2 w-40 rounded-full bg-white/25" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <span key={item} className="h-12 rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoEditMockup() {
  return (
    <div className="rounded-2xl border border-border bg-[#111113] p-4 text-white shadow-soft-lg dark:border-border-dark">
      <div className="h-[17rem] rounded-xl bg-black/35 p-3 sm:h-[20rem]">
        <div className="mb-3 aspect-video rounded-lg bg-[linear-gradient(135deg,#059669,#111827)] p-4">
          <div className="h-5 w-24 rounded-md bg-white/70" />
          <div className="mt-16 h-3 w-32 rounded-full bg-white/35" />
        </div>
        <div className="space-y-2">
          {["bg-angola-red", "bg-[#059669]", "bg-angola-gold", "bg-white/25"].map(
            (color, index) => (
              <div key={color} className="grid grid-cols-[3rem_1fr] gap-2">
                <span className="h-4 rounded bg-white/10" />
                <span className={`h-4 rounded ${color} ${index === 3 ? "w-3/4" : ""}`} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function BrandMockup() {
  return (
    <div className="grid h-[18rem] grid-cols-[1fr_0.8fr] gap-3 rounded-2xl border border-border bg-surface/80 p-3 shadow-soft-lg dark:border-border-dark dark:bg-surface-dark/78 sm:h-[20rem]">
      <div className="rounded-xl bg-canvas p-4 dark:bg-canvas-dark">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-ink text-3xl font-bold text-canvas dark:bg-ink-dark dark:text-canvas-dark">
          F
        </div>
        <div className="mt-5 h-4 w-28 rounded-md bg-ink/80 dark:bg-white/80" />
        <div className="mt-3 h-2 w-36 rounded-full bg-muted/25" />
        <div className="mt-8 grid grid-cols-4 gap-2">
          {["bg-ink dark:bg-ink-dark", "bg-angola-red", "bg-angola-gold", "bg-[#EA580C]"].map((color) => (
            <span key={color} className={`h-10 rounded-lg ${color}`} />
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        <div className="rounded-xl bg-angola-red p-3 text-white">
          <div className="h-3 w-16 rounded-full bg-white/60" />
          <div className="mt-16 h-8 w-20 rounded-md bg-white/80" />
        </div>
        <div className="rounded-xl bg-ink p-3 text-white dark:bg-ink-dark dark:text-canvas-dark">
          <div className="h-3 w-12 rounded-full bg-white/40" />
          <div className="mt-8 h-2 rounded-full bg-white/25" />
          <div className="mt-2 h-2 w-2/3 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}

function PortfolioMockup({ kind }: { kind: MockupKind }) {
  if (kind === "website") return <BrowserMockup />;
  if (kind === "mobile") return <MobileMockup />;
  if (kind === "system") return <SystemMockup />;
  if (kind === "social") return <SocialMockup />;
  if (kind === "aiVideo") return <AiVideoMockup />;
  if (kind === "videoEdit") return <VideoEditMockup />;
  return <BrandMockup />;
}

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
      {
      duration: 1800,
      }
    );

    window.setTimeout(() => {
      window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
    }, 900);
  };

  return (
    <section id="portfolio" className="overflow-hidden py-24 md:py-32">
      <div className="container-fronex">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div className="flex flex-col gap-4">
            <div className="flag-thread" />
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Portfólio com mockups de produto final
            </h2>
          </div>
          <p className="text-base leading-7 text-muted dark:text-muted-dark md:text-lg">
            Demonstrações visuais criadas para mostrar como cada serviço pode
            ganhar forma em interfaces reais, prontas para clientes verem,
            usarem e confiarem.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {PORTFOLIO_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const featured = index < 3;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className={`group rounded-2xl border border-border bg-surface/72 p-4 shadow-soft-lg backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1 dark:border-border-dark dark:bg-surface-dark/68 ${
                  featured ? "lg:col-span-4" : "lg:col-span-3"
                } ${index === 6 ? "lg:col-span-6" : ""}`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-md border border-border bg-canvas/70 px-3 py-1.5 text-xs font-semibold text-muted dark:border-border-dark dark:bg-canvas-dark/70 dark:text-muted-dark">
                    <span className={`h-2 w-2 rounded-full ${item.accent}`} />
                    {item.service}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-canvas transition-transform group-hover:rotate-6 dark:bg-ink-dark dark:text-canvas-dark">
                    <Icon size={18} />
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-canvas p-3 dark:bg-canvas-dark">
                  <PortfolioMockup kind={item.kind} />
                </div>

                <div className="pt-5">
                  <h3 className="font-display text-xl font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted dark:text-muted-dark">
                    {item.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleServiceRequest(item.service)}
                    className="group/cta relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-md bg-[linear-gradient(135deg,#111113,#CE1126)] px-4 py-2.5 text-sm font-semibold text-white shadow-soft-lg transition-transform hover:-translate-y-0.5 dark:bg-[linear-gradient(135deg,#F4F4F3,#CE1126)] dark:text-canvas-dark"
                  >
                    <span className="absolute inset-0 translate-x-[-120%] bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[120%]" />
                    <span className="relative">Solicitar orçamento</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
