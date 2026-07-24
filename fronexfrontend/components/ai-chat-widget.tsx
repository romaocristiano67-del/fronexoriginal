"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Cpu, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const VISITOR_TOKEN_LIMIT = 5;

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Olá! Sou o Assistente Fronex 👋 Posso ajudar a escolher um serviço, calcular um orçamento ou tirar dúvidas sobre o que fazemos. Em que posso ajudar?",
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [tokensRemaining, setTokensRemaining] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getSessionId = () => {
    const key = "fronex_session_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isTyping) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, sessionId: getSessionId() }),
      });

      const payload = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Sem tokens disponíveis", {
            description: payload?.upgradeMessage ?? "Tente novamente amanhã ou fale pelo WhatsApp.",
          });
        }
        throw new Error(payload?.error ?? "Não foi possível obter resposta da IA.");
      }

      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: payload.reply,
      };

      setMessages((prev) => [...prev, reply]);
      if (payload.moderated) {
        toast.warning("Tom profissional necessário", {
          description: "A conversa foi reconduzida para o âmbito dos serviços Fronex.",
        });
        return;
      }

      if (typeof payload.tokensRemaining === "number") {
        setTokensRemaining(payload.tokensRemaining);
        window.dispatchEvent(
          new CustomEvent("fronex:tokens-updated", {
            detail: { tokensRemaining: payload.tokensRemaining },
          })
        );
        toast.success("Token utilizado na conversa", {
          description: `${payload.tokensRemaining} tokens restantes.`,
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Não consegui responder agora. Pode tentar novamente em instantes ou falar diretamente com a equipa Fronex pelo WhatsApp.",
        },
      ]);
      if (!(error instanceof Error && error.message.includes("Limite diário"))) {
        toast.error("A IA não respondeu", {
          description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 16 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir Fronex AI Assistant"
        className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas shadow-soft-lg dark:bg-ink-dark dark:text-canvas-dark"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X size={22} /> : <Sparkles size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Janela de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-[90] flex h-[520px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-lg dark:border-border-dark dark:bg-surface-dark"
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-border-dark">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Fronex AI Assistant</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted dark:text-muted-dark">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online
                  </p>
                </div>
              </div>

              {/* Contador de tokens */}
              <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted dark:border-border-dark dark:text-muted-dark">
                <Cpu size={12} />
                {tokensRemaining ?? VISITOR_TOKEN_LIMIT} tokens
              </div>
            </div>

            {/* Mensagens */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-5 py-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark"
                        : "bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-dark"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-canvas px-4 py-3 dark:bg-canvas-dark">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-muted dark:bg-muted-dark"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-border p-3 dark:border-border-dark">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escreva a sua pergunta..."
                className="flex-1 rounded-full border border-border bg-canvas px-4 py-2.5 text-sm outline-none focus:border-ink dark:border-border-dark dark:bg-canvas-dark dark:focus:border-ink-dark"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                aria-label="Enviar mensagem"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-ink-dark dark:text-canvas-dark"
              >
                {isTyping ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
