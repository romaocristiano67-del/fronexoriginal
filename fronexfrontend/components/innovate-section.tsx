"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/pricing";

interface PlanStep {
  title: string;
  description: string;
  relatedServiceIds: string[];
}

// Gera um plano de ação simples a partir de palavras-chave da ideia.
// Pronto para ser substituído por uma chamada real à API de IA da Fronex.
function generatePlan(idea: string): PlanStep[] {
  const lower = idea.toLowerCase();

  const steps: PlanStep[] = [
    {
      title: "Validar e posicionar a ideia",
      description:
        "Defina o público-alvo em Luanda (ou na sua cidade) e o que torna a sua oferta diferente. Um Mentor de Investimentos pode ajudar a validar o potencial do negócio.",
      relatedServiceIds: [],
    },
    {
      title: "Criar presença digital",
      description: lower.includes("loja") || lower.includes("venda")
        ? "Uma loja online simples permite vender e receber pedidos sem depender só das redes sociais."
        : "Um site institucional transmite confiança e credibilidade desde o primeiro contacto com o cliente.",
      relatedServiceIds: ["web"],
    },
    {
      title: "Construir marca visual",
      description:
        "Logotipo, cores e materiais consistentes ajudam o negócio a ser reconhecido e lembrado.",
      relatedServiceIds: ["design"],
    },
    {
      title: "Gerar visibilidade nas redes",
      description:
        "Conteúdo regular no Instagram e TikTok atrai clientes locais e constrói confiança ao longo do tempo.",
      relatedServiceIds: ["social", "video-edit"],
    },
  ];

  if (lower.includes("app") || lower.includes("sistema") || lower.includes("plataforma")) {
    steps.push({
      title: "Desenvolver o produto digital",
      description:
        "Se a ideia depende de uma aplicação ou sistema, comece por um MVP simples antes de expandir funcionalidades.",
      relatedServiceIds: ["apps"],
    });
  }

  return steps;
}

export default function InnovateSection() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanStep[] | null>(null);

  const handleSimulate = () => {
    if (!idea.trim()) return;
    setLoading(true);
    setPlan(null);
    // Simula latência de geração — substituir por chamada real à API
    setTimeout(() => {
      setPlan(generatePlan(idea));
      setLoading(false);
    }, 1100);
  };

  return (
    <section id="inovar" className="bg-[#f8f7f3] py-24 text-zinc-950 transition-colors duration-300 dark:bg-[#080809] dark:text-[#f5f3ee] md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:max-w-2xl">
          <div className="flag-thread" />
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Criar e Inovar
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-300 md:text-lg">
            Escreva a ideia como ela está na sua cabeça. A Fronex organiza os
            próximos passos, liga cada etapa ao serviço certo e ajuda a sair da
            intenção para a execução.
          </p>
        </div>

        <div className="card-fronex mx-auto max-w-3xl p-6 md:p-8">
          <label className="text-sm font-medium">A sua ideia</label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
              placeholder="Ex: Quero abrir uma loja de roupa online em Luanda"
              className="min-h-12 flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition-colors focus:border-zinc-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white/40"
            />
            <button
              onClick={handleSimulate}
              disabled={loading || !idea.trim()}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] hover:bg-angola-red disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-angola-gold"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              Organizar plano
            </button>
          </div>

          <AnimatePresence>
            {plan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 overflow-hidden"
              >
                <p className="mb-4 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Próximos passos
                </p>
                <div className="flex flex-col gap-4">
                  {plan.map((step, i) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.045]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                          {step.description}
                        </p>
                        {step.relatedServiceIds.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {step.relatedServiceIds.map((id) => {
                              const service = SERVICES.find((s) => s.id === id);
                              if (!service) return null;
                              return (
                                <a
                                  key={id}
                                  href="#servicos"
                                  className="flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:border-zinc-950 dark:border-white/10 dark:hover:border-white/40"
                                >
                                  {service.title}
                                  <ArrowRight size={11} />
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
