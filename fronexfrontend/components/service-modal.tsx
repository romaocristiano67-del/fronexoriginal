"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Check, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ServiceDefinition,
  QuestionOption,
  calculatePrice,
  formatKz,
} from "@/lib/pricing";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/whatsapp";

interface ServiceModalProps {
  service: ServiceDefinition;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [step, setStep] = useState(0); // 0..N-1 = perguntas, N = nome, N+1 = resumo
  const [answers, setAnswers] = useState<Record<string, QuestionOption>>({});
  const [clientName, setClientName] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiQuote, setApiQuote] = useState<{ finalPrice: number; whatsappLink: string } | null>(null);

  const visibleQuestions = useMemo(
    () => service.questions.filter((question) => !question.showIf || question.showIf(answers)),
    [answers, service.questions]
  );
  const totalSteps = visibleQuestions.length + 2; // perguntas + nome + resumo
  const isQuestionStep = step < visibleQuestions.length;
  const isNameStep = step === visibleQuestions.length;
  const isSummaryStep = step === visibleQuestions.length + 1;

  const currentPrice = useMemo(
    () => calculatePrice(service, answers),
    [service, answers]
  );

  const progressPercent = Math.round(((step + 1) / totalSteps) * 100);

  const handleSelectOption = (questionId: string, option: QuestionOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const getSessionId = () => {
    const key = "fronex_session_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  };

  const requestQuote = async () => {
    setIsCalculating(true);

    try {
      const response = await fetch("/api/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: service.id,
          answers,
          clientName: clientName.trim() || undefined,
          sessionId: getSessionId(),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Não foi possível calcular o orçamento.");
      }

      setApiQuote({ finalPrice: payload.finalPrice, whatsappLink: payload.whatsappLink });
      toast.success("Cálculo atualizado", {
        description: `Orçamento estimado: ${formatKz(payload.finalPrice)}`,
      });
    } catch (error) {
      setApiQuote(null);
      toast.error("Não consegui confirmar o cálculo", {
        description: error instanceof Error ? error.message : "A estimativa local continua disponível.",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const goNext = async () => {
    const nextStep = Math.min(step + 1, totalSteps - 1);
    setStep(nextStep);
    if (nextStep === totalSteps - 1) {
      await requestQuote();
    }
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const currentQuestion = isQuestionStep ? visibleQuestions[step] : null;
  const canAdvance = currentQuestion
    ? Boolean(answers[currentQuestion.id])
    : true;

  const summaryItems = visibleQuestions.map((q) => ({
    question: q.question,
    answer: answers[q.id]?.label ?? "—",
  }));

  const finalPrice = apiQuote?.finalPrice ?? currentPrice;
  const whatsappMessage = buildWhatsAppMessage({
    serviceTitle: service.title,
    items: summaryItems,
    finalPrice: formatKz(finalPrice),
    clientName: clientName || undefined,
  });

  const whatsappLink = apiQuote?.whatsappLink ?? getWhatsAppLink(whatsappMessage);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-accent/25 bg-surface text-white shadow-soft-lg md:rounded-2xl"
        >
          <div className="relative h-32 w-full shrink-0 overflow-hidden border-b border-accent/25">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="512px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          </div>

          {/* Cabeçalho */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
            <div>
              <p className="text-xs text-muted">
                Orçamento — {service.title}
              </p>
              <p className="mt-0.5 font-display text-sm font-semibold text-white">
                Passo {step + 1} de {totalSteps}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar questionário"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-white/10 hover:text-accent"
            >
              <X size={16} />
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="h-1 w-full bg-white/10">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Preço em tempo real */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-canvas px-6 py-4">
            <span className="text-xs uppercase tracking-wide text-muted">
              Orçamento estimado
            </span>
            <motion.span
              key={finalPrice}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-xl font-bold text-accent"
            >
              {isCalculating ? (
                <span className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 size={15} className="animate-spin" />
                  A calcular
                </span>
              ) : (
                formatKz(finalPrice)
              )}
            </motion.span>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait">
              {isQuestionStep && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-display text-lg font-semibold text-white">
                    {currentQuestion.question}
                  </h3>
                  <div className="mt-5 flex flex-col gap-3">
                    {currentQuestion.options.map((option) => {
                      const selected =
                        answers[currentQuestion.id]?.id === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            handleSelectOption(currentQuestion.id, option)
                          }
                          className={`flex items-center justify-between rounded-lg border px-4 py-3.5 text-left text-sm transition-colors ${
                            selected
                              ? "border-accent bg-accent text-canvas"
                              : "border-white/10 text-ink-muted hover:border-accent/40 hover:text-white"
                          }`}
                        >
                          <span>{option.label}</span>
                          {selected && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {isNameStep && (
                <motion.div
                  key="name-step"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-display text-lg font-semibold text-white">
                    Como podemos chamá-lo(a)?
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    Opcional — ajuda-nos a personalizar o atendimento no
                    WhatsApp.
                  </p>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="O seu nome"
                    className="mt-5 w-full rounded-lg border border-white/10 bg-canvas px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-accent/50"
                  />
                </motion.div>
              )}

              {isSummaryStep && (
                <motion.div
                  key="summary-step"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-display text-lg font-semibold text-white">
                    Resumo do pedido
                  </h3>
                  <div className="mt-4 flex flex-col divide-y divide-white/[0.06] rounded-lg border border-white/[0.06]">
                    {summaryItems.map((item) => (
                      <div
                        key={item.question}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <span className="text-muted">
                          {item.question}
                        </span>
                        <span className="text-right font-medium text-white">
                          {item.answer}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-canvas px-4 py-4">
                    <span className="text-sm font-medium text-white">
                      Orçamento final
                    </span>
                    <span className="font-display text-xl font-bold text-accent">
                      {isCalculating ? "A calcular..." : formatKz(finalPrice)}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rodapé com navegação */}
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-5">
            <button
              onClick={step === 0 ? onClose : goBack}
              className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={15} />
              {step === 0 ? "Cancelar" : "Voltar"}
            </button>

            {isSummaryStep ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.success("Pedido pronto para verificação manual")}
                className="flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                <MessageCircle size={16} />
                Confirmar via WhatsApp
              </a>
            ) : (
              <button
                onClick={goNext}
                disabled={!canAdvance || isCalculating}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
