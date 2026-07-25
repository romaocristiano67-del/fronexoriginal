"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import RichMessage from "@/components/rich-message";
import { assessInnovateIdea } from "@/lib/ai/innovate";

export default function InnovateSection() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  const getSessionId = () => {
    const key = "fronex_session_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  };

  const handleSimulate = async () => {
    const content = idea.trim();
    if (!content || loading) return;

    // Blindagem imediata no cliente — sem planos genéricos
    const assessment = assessInnovateIdea(content);
    if (!assessment.valid) {
      setReply(assessment.clarification);
      return;
    }

    setLoading(true);
    setReply(null);

    try {
      const response = await fetch("/api/innovate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: content,
          sessionId: getSessionId(),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Sem tokens disponíveis", {
            description: payload?.upgradeMessage ?? "Tente novamente amanhã.",
          });
        }
        throw new Error(payload?.error ?? "Não foi possível organizar o plano.");
      }

      setReply(typeof payload.reply === "string" ? payload.reply : assessment.clarification);

      if (typeof payload.tokensRemaining === "number") {
        window.dispatchEvent(
          new CustomEvent("fronex:tokens-updated", {
            detail: { tokensRemaining: payload.tokensRemaining },
          })
        );
      }
    } catch (error) {
      toast.error("Criar e Inovar indisponível", {
        description:
          error instanceof Error ? error.message : "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="inovar" className="bg-canvas-light py-24 text-white md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:max-w-2xl">
          <p className="section-label">Criar e inovar</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Criar e Inovar
          </h2>
          <p className="text-base text-ink-muted md:text-lg">
            Escreva a ideia como ela está na sua cabeça. A Fronex organiza a
            estratégia de produto e engenharia — com planos ricos quando a ideia
            é clara, e perguntas directas quando ainda não está.
          </p>
        </div>

        <div className="card-fronex mx-auto max-w-3xl p-6 md:p-8">
          <label className="text-sm font-medium text-white">A sua ideia</label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
              placeholder="Ex: Quero abrir uma loja de roupa online em Luanda"
              className="min-h-12 flex-1 rounded-xl border border-white/10 bg-canvas px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-accent/50"
            />
            <button
              onClick={handleSimulate}
              disabled={loading || !idea.trim()}
              className="btn-primary min-h-12 px-6 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              Organizar plano
            </button>
          </div>

          {reply && (
            <div className="mt-8 rounded-xl border border-white/[0.06] bg-canvas/50 p-5">
              <p className="section-label mb-4">Resposta estratégica</p>
              <RichMessage content={reply} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
