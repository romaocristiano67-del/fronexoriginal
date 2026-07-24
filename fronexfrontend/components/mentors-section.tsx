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
  color: string;
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
    icon: <TrendingUp size={20} />,
    color: "from-angola-gold/20 to-transparent",
  },
  {
    id: "marketing_tiktok",
    name: "Mentor de Marketing & TikTok",
    role: "Especialista em redes sociais",
    description:
      "Ajuda a criar estratégias de conteúdo, calendários editoriais e ideias de vídeos com alcance real.",
    icon: <Megaphone size={20} />,
    color: "from-angola-red/15 to-transparent",
  },
  {
    id: "burocracia",
    name: "Mentor de Burocracia",
    role: "Especialista em legalização",
    description:
      "Explica NIF, licenças, formalização e próximos passos com linguagem clara e prudente.",
    icon: <Scale size={20} />,
    color: "from-ink/10 to-transparent dark:from-white/10",
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
    <section id="mentores" className="py-24 md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:max-w-2xl">
          <div className="flag-thread" />
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Fale com um mentor especializado
          </h2>
          <p className="text-base text-muted dark:text-muted-dark md:text-lg">
            Personas de IA da Fronex, treinadas para dar conselhos práticos e
            contextualizados à realidade angolana.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="flex flex-col gap-3">
            {MENTORS.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => setSelected(mentor.id)}
                className={`flex items-start gap-4 rounded-lg border p-4 text-left transition-colors ${
                  selected === mentor.id
                    ? "border-ink bg-ink text-canvas dark:border-ink-dark dark:bg-ink-dark dark:text-canvas-dark"
                    : "border-border hover:border-ink/30 dark:border-border-dark dark:hover:border-ink-dark/30"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected === mentor.id ? "bg-white/15" : "bg-canvas dark:bg-canvas-dark"
                  }`}
                >
                  {mentor.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{mentor.name}</p>
                  <p
                    className={`mt-0.5 text-xs ${
                      selected === mentor.id
                        ? "text-canvas/70 dark:text-canvas-dark/70"
                        : "text-muted dark:text-muted-dark"
                    }`}
                  >
                    {mentor.role}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <motion.div
            key={activeMentor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`card-fronex flex min-h-[460px] flex-col bg-gradient-to-br p-6 ${activeMentor.color}`}
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface shadow-soft dark:bg-surface-dark">
                {activeMentor.icon}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">
                {activeMentor.name}
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted dark:text-muted-dark">
                {activeMentor.description}
              </p>
            </div>

            <div className="mt-6 flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-surface/80 dark:border-border-dark dark:bg-surface-dark/80">
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[82%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark"
                          : "bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-dark"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg bg-canvas px-3.5 py-2.5 text-xs text-muted dark:bg-canvas-dark dark:text-muted-dark">
                      <Loader2 size={14} className="animate-spin" />
                      A pensar
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-border p-3 dark:border-border-dark">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  placeholder={`Pergunte ao ${activeMentor.name.toLowerCase()}...`}
                  className="flex-1 rounded-md border border-border bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink dark:border-border-dark dark:bg-canvas-dark dark:focus:border-ink-dark"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  aria-label="Enviar pergunta ao mentor"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-canvas transition-colors hover:bg-angola-red disabled:cursor-not-allowed disabled:opacity-40 dark:bg-ink-dark dark:text-canvas-dark"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
