"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cpu, Loader2, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import RichMessage from "@/components/rich-message";

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
    "Olá, bem-vindo à Fronex.\n\n::badge[Online]\n\nDiga-me o que quer construir: site, app, sistema, design, conteúdo ou automação. Eu organizo o pedido e indico o próximo passo.",
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [tokensRemaining, setTokensRemaining] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getSessionId = () => {
    const key = "fronex_session_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;

    const viewport = window.visualViewport;
    const syncInset = () => {
      if (!viewport) return;
      const inset = Math.max(
        0,
        Math.round(window.innerHeight - viewport.height - viewport.offsetTop)
      );
      setKeyboardInset(inset);
      requestAnimationFrame(() => scrollToBottom("auto"));
    };

    syncInset();
    window.addEventListener("resize", syncInset);
    viewport?.addEventListener("resize", syncInset);
    viewport?.addEventListener("scroll", syncInset);

    return () => {
      window.removeEventListener("resize", syncInset);
      viewport?.removeEventListener("resize", syncInset);
      viewport?.removeEventListener("scroll", syncInset);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => scrollToBottom("smooth"), 16);
    return () => window.clearTimeout(timer);
  }, [open, messages, isTyping, keyboardInset]);

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
        toast.warning("A conversa foi redirecionada", {
          description: "A IA manteve o foco no âmbito dos serviços Fronex.",
        });
      }

      if (typeof payload.tokensRemaining === "number") {
        setTokensRemaining(payload.tokensRemaining);
        window.dispatchEvent(
          new CustomEvent("fronex:tokens-updated", {
            detail: { tokensRemaining: payload.tokensRemaining },
          })
        );
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Não consegui responder agora. Tente novamente em instantes ou fale directamente com a equipa Fronex pelo WhatsApp.",
        },
      ]);

      if (!(error instanceof Error && error.message.includes("Limite diário"))) {
        toast.error("A IA não respondeu", {
          description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        });
      }
    } finally {
      setIsTyping(false);
      requestAnimationFrame(() => scrollToBottom("smooth"));
    }
  };

  const panelStyle = isMobile
    ? {
        top: "calc(0.75rem + env(safe-area-inset-top))",
        bottom: `calc(0.75rem + ${keyboardInset}px)`,
      }
    : undefined;

  return (
    <>
        <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 16 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir atendimento Fronex"
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent text-white shadow-neon backdrop-blur-xl"
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            style={panelStyle}
            className={`fixed z-[100] flex flex-col overflow-hidden border border-border bg-surface text-ink shadow-soft-dark backdrop-blur-2xl ${
              isMobile
                ? "left-2 right-2 rounded-[1.35rem]"
                : "bottom-24 right-6 h-[620px] w-[min(92vw,26rem)] rounded-[1.75rem]"
            }`}
          >
            <div className="flex items-center justify-between border-b border-border bg-canvas/40 px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Atendimento Fronex</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Online agora
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-1.5 rounded-full border border-border bg-canvas/50 px-2.5 py-1 text-[11px] font-medium text-ink-muted min-[360px]:flex">
                  <Cpu size={12} className="text-accent" />
                  {tokensRemaining ?? VISITOR_TOKEN_LIMIT} tokens
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar atendimento Fronex"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-ink-muted transition-colors hover:border-accent/45 hover:text-accent"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              aria-live="polite"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-soft ${
                      msg.role === "user"
                        ? "bg-accent text-canvas"
                        : "border border-border bg-canvas/60 text-ink-muted"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <RichMessage content={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-6 text-canvas">
                        {msg.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-[min(18rem,88%)] rounded-3xl border border-border bg-white/[0.05] px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      <Loader2 size={12} className="animate-spin" />
                      A preparar resposta
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-2 w-2 animate-pulse rounded-full bg-white/50"
                          style={{ animationDelay: `${i * 0.16}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-black/30 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <div className="flex items-end gap-2">
                <div className="flex-1 rounded-3xl border border-border bg-white/[0.05] px-4 py-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.65)]">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && !event.shiftKey && handleSend()}
                    onFocus={() => requestAnimationFrame(() => scrollToBottom("smooth"))}
                    placeholder="Escreva a sua pergunta..."
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                  />
                </div>

                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  aria-label="Enviar mensagem"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 520, damping: 34 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-canvas shadow-neon transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </motion.button>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-muted">
                Respostas orientadas para orçamento, serviços e próximos passos.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
