"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Megaphone, Scale, Send, TrendingUp } from "lucide-react";
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
    <section id="mentores" className="bg-canvas py-20 text-ink md:py-28">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:max-w-2xl">
          <p className="section-label">Mentores</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
            Mentoria rápida para decisões com mais contexto
          </h2>
          <p className="text-base text-ink-muted md:text-lg">
            Quando a próxima decisão ainda está em aberto, use um mentor
            especializado para organizar finanças, comunicação ou formalização
            com contexto local e linguagem clara.
          </p>
        </div>

        {/* Mobile: Mentor Selection Tabs */}
        <div className="mb-8 lg:mb-0 grid grid-cols-2 gap-3 sm:flex sm:gap-3 sm:overflow-x-auto sm:pb-2 lg:hidden">
          {MENTORS.map((mentor) => (
            <button
              key={mentor.id}
              onClick={() => setSelected(mentor.id)}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all shrink-0 min-h-[2.75rem] ${
                selected === mentor.id
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border bg-surface hover:border-accent/20 text-ink-muted"
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                selected === mentor.id
                  ? "bg-accent text-canvas"
                  : "bg-canvas text-ink-muted"
              }`}>
                {mentor.icon}
              </span>
              <p className="text-xs font-semibold text-center w-20 truncate">{mentor.name}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Desktop: Mentor Sidebar */}
          <div className="hidden lg:flex flex-col gap-3">
            {MENTORS.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => setSelected(mentor.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  selected === mentor.id
                    ? "border-accent/50 bg-accent/10 text-ink"
                    : "border-border bg-surface hover:border-accent/30"
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
            className="card-fronex flex min-h-[460px] lg:min-h-[520px] flex-col p-5 md:p-6"
          >
            {/* Mentor Info */}
            <div className="hidden lg:block mb-6 pb-6 border-b border-border/50">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent mb-3">
                {activeMentor.icon}
              </span>
              <h3 className="font-display text-lg font-bold text-ink">
                {activeMentor.name}
              </h3>
              <p className="mt-2 text-xs text-ink-muted leading-5">
                {activeMentor.description}
              </p>
            </div>

            {/* Chat Area */}
            <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border/50 bg-canvas/40 overflow-hidden">
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[85%] md:max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-accent text-canvas"
                          : "bg-surface text-ink-muted border border-border/30"
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
              <div className="flex items-center gap-2 border-t border-border/50 p-3 bg-canvas/20">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  placeholder="Sua pergunta..."
                  className="min-h-10 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  aria-label="Enviar"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-canvas transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
