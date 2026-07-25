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
    <section id="mentores" className="bg-white py-24 text-zinc-950 transition-colors duration-300 dark:bg-[#0d0d0f] dark:text-[#f5f3ee] md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:max-w-2xl">
          <div className="flag-thread" />
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Mentoria rápida para decisões melhores
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-300 md:text-lg">
            Quando a próxima decisão ainda está nebulosa, use um mentor
            especializado para estruturar finanças, comunicação ou formalização
            com contexto local.
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
                    ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                    : "border-zinc-200 bg-white hover:border-zinc-950/30 dark:border-white/10 dark:bg-white/[0.045] dark:hover:border-white/30"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected === mentor.id ? "bg-white/15 dark:bg-zinc-950/10" : "bg-[#f8f7f3] dark:bg-white/[0.06]"
                  }`}
                >
                  {mentor.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{mentor.name}</p>
                  <p
                    className={`mt-0.5 text-xs ${
                      selected === mentor.id
                        ? "text-white/70 dark:text-zinc-700"
                        : "text-zinc-500 dark:text-zinc-400"
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

            <div className="mt-6 flex min-h-0 flex-1 flex-col rounded-2xl border border-zinc-200 bg-white/80 dark:border-white/10 dark:bg-zinc-950/45">
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[82%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                          : "bg-[#f8f7f3] text-zinc-950 dark:bg-white/[0.08] dark:text-white"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg bg-[#f8f7f3] px-3.5 py-2.5 text-xs text-zinc-500 dark:bg-white/[0.08] dark:text-zinc-300">
                      <Loader2 size={14} className="animate-spin" />
                      A pensar
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-white/10">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  placeholder={`Pergunte ao ${activeMentor.name.toLowerCase()}...`}
                  className="min-h-11 flex-1 rounded-xl border border-zinc-200 bg-[#f8f7f3] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-zinc-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white/40"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  aria-label="Enviar pergunta ao mentor"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white transition-colors hover:bg-angola-red disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-angola-gold"
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
