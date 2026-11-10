"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Megaphone, Scale, Send, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { toast } from "sonner";

interface Mentor {
  id: "financas" | "marketing_tiktok" | "burocracia";
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

type MentorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const MENTORS: Mentor[] = [
  {
    id: "financas",
    name: "Mentor de Finanças",
    role: "Especialista em economia angolana",
    description:
      "Orienta sobre investimento, fluxo de caixa, formalização e leitura responsável do mercado local.",
    icon: <TrendingUp size={20} strokeWidth={1.5} />,
  },
  {
    id: "marketing_tiktok",
    name: "Mentor de Marketing & TikTok",
    role: "Especialista em redes sociais",
    description:
      "Ajuda a criar estratégias de conteúdo, calendários editoriais e ideias de vídeos com alcance real.",
    icon: <Megaphone size={20} strokeWidth={1.5} />,
  },
  {
    id: "burocracia",
    name: "Mentor de Burocracia",
    role: "Especialista em legalização",
    description:
      "Explica NIF, licenças, formalização e próximos passos com linguagem clara e prudente.",
    icon: <Scale size={20} strokeWidth={1.5} />,
  },
];

export default function MentorsSection() {
  const [selected, setSelected] = useState<Mentor["id"]>(MENTORS[0].id);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesByMentor, setMessagesByMentor] = useState<Record<string, MentorMessage[]>>({});
  const activeMentor = MENTORS.find((mentor) => mentor.id === selected)!;
  const fallbackMessages: MentorMessage[] = [
    {
      id: `${selected}-intro`,
      role: "assistant",
      content: `Olá, sou o ${activeMentor.name}. Envie uma pergunta e eu ajudo com um próximo passo claro.`,
    },
  ];
  const messages = messagesByMentor[selected] ?? fallbackMessages;

  const getSessionId = () => {
    const key = "fronex_session_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  };

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;

    const userMessage: MentorMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];

    setMessagesByMentor((prev) => ({ ...prev, [selected]: nextMessages }));
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorKey: selected,
          message: content,
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
        throw new Error(payload?.error ?? "Não foi possível falar com o mentor.");
      }

      setMessagesByMentor((prev) => ({
        ...prev,
        [selected]: [
          ...(prev[selected] ?? nextMessages),
          { id: crypto.randomUUID(), role: "assistant", content: payload.reply },
        ],
      }));
      window.dispatchEvent(
        new CustomEvent("fronex:tokens-updated", {
          detail: { tokensRemaining: payload.tokensRemaining },
        })
      );
      toast.success("Token utilizado na conversa");
    } catch (error) {
      toast.error("Mentor indisponível", {
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="mentores" className="scroll-mt-24 py-16 text-ink md:py-24">
      <div className="container-fronex">
        <ScrollReveal className="mb-8 flex flex-col gap-4 md:mb-12 md:max-w-2xl">
          <p className="section-label">Mentores</p>
          <h2 className="font-editorial text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Mentoria rápida para decisões com mais contexto
          </h2>
        </ScrollReveal>

        {/* Mobile: Mentor Selection Tabs */}
        <ScrollReveal className="-mx-5 mb-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 lg:hidden">
          {MENTORS.map((mentor) => (
            <button
              key={mentor.id}
              onClick={() => setSelected(mentor.id)}
              aria-pressed={selected === mentor.id}
              className={`flex min-h-12 shrink-0 snap-start items-center gap-2.5 rounded-full border px-4 py-2 transition-all ${
                selected === mentor.id
                  ? "border-accent/45 bg-accent/10 text-accent"
                  : "border-border bg-surface/80 text-ink-muted hover:border-accent/30"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${
                selected === mentor.id
                  ? "bg-accent text-accent-contrast"
                  : "bg-canvas text-accent"
              }`}>
                {mentor.icon}
              </span>
              <span className="whitespace-nowrap text-xs font-semibold">{mentor.name}</span>
            </button>
          ))}
        </ScrollReveal>

        <ScrollReveal className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Desktop: Mentor Sidebar */}
          <div className="hidden lg:flex flex-col gap-3">
            {MENTORS.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => setSelected(mentor.id)}
                aria-pressed={selected === mentor.id}
                className={`glass flex min-h-20 items-start gap-3 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                  selected === mentor.id
                    ? "border-accent/50 text-ink"
                    : "hover:border-accent/30"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected === mentor.id
                      ? "bg-accent text-canvas"
                      : "bg-canvas text-accent"
                  }`}
                >
                  {mentor.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{mentor.name}</p>
                  <p className={`mt-0.5 text-xs ${
                    selected === mentor.id ? "text-accent/80" : "text-muted"
                  }`}>
                    {mentor.role}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <motion.div
            key={activeMentor.id}
            initial={false}
            animate={{ opacity: 1 }}
            className="flex min-h-[min(68svh,560px)] flex-col rounded-md border border-border bg-surface p-4 md:p-6 lg:min-h-[520px]"
          >
            {/* Mentor Info */}
            <div className="mb-4 flex items-start gap-3 border-b border-border/60 pb-4 md:mb-6 md:pb-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                {activeMentor.icon}
              </span>
              <div>
                <h3 className="font-editorial text-lg font-semibold text-ink md:text-xl">
                  {activeMentor.name}
                </h3>
                <p className="mt-1 text-xs leading-5 text-ink-muted md:text-sm">
                  {activeMentor.description}
                </p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-border/60 bg-canvas/35">
              <div className="flex-1 space-y-3 overflow-y-auto p-3 md:p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[85%] md:max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-accent text-accent-contrast"
                          : "border border-border/50 bg-surface/80 text-ink-muted"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-2.5 text-xs text-muted border border-border/30">
                      <Loader2 size={14} className="animate-spin text-accent" />
                      A pensar
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex items-center gap-2 border-t border-border/60 bg-surface/45 p-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  placeholder="Sua pergunta..."
                  aria-label="Sua pergunta..."
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface/90 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  aria-label="Enviar"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-contrast transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
