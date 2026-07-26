"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Wordmark from "@/components/wordmark";
import ThemeToggle from "@/components/theme-toggle";

type Mode = "login" | "signup";
type Step = "email" | "credentials";

const inputClassName =
  "w-full rounded-lg border border-border bg-canvas-light px-3.5 py-[0.85rem] text-[0.925rem] text-ink outline-none placeholder:text-muted transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.3 5.3C39.2 37.2 44 32 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}

function LoginContent() {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("credentials");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
              },
            });

      if (result.error) throw result.error;

      toast.success(
        mode === "login"
          ? "Login efetuado com sucesso"
          : "Conta criada com sucesso",
        {
          description:
            mode === "login"
              ? "A sua sessão Fronex está activa."
              : "Se a confirmação por email estiver activa, verifique a sua caixa de entrada.",
        },
      );

      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      toast.error("Não foi possível autenticar", {
        description:
          error instanceof Error
            ? error.message
            : "Confirme os dados e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (error) {
      setLoading(false);
      toast.error("Google indisponível", { description: error.message });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.08),transparent_50%)]"
      />

      <div className="relative mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        <div className="relative flex flex-col px-6 py-6 sm:px-10 lg:px-12 lg:py-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex w-fit items-center">
              <Wordmark textClassName="text-[1rem]" />
            </Link>
            <ThemeToggle />
          </div>

          <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
            <div className="text-center">
              <p className="section-label mb-3">Autenticação</p>
              <h1 className="font-display text-[2.35rem] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[2.85rem]">
                Entrar na experiência Fronex
                <span className="text-accent">.</span>
              </h1>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Acesso rápido à sua conta, com uma interface mais limpa e
                ajustada para telemóvel.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-surface px-6 py-7 sm:px-7 sm:py-8">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-canvas-light px-4 py-[0.85rem] text-[0.925rem] font-medium text-ink transition-colors hover:border-accent/40 hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin text-accent" />
                ) : (
                  <GoogleIcon />
                )}
                Continuar com Google
              </button>

              <div className="my-5 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                ou
              </div>

              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.form
                    key="email"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleEmailContinue}
                    className="flex flex-col gap-3"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Introduza o seu email"
                      className={inputClassName}
                    />
                    <button
                      type="submit"
                      className="btn-primary w-full py-[0.85rem] text-[0.925rem] font-bold"
                    >
                      Continuar com email
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="credentials"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="self-start text-left text-xs text-muted transition-colors hover:text-accent"
                    >
                      ← {email}
                    </button>

                    {mode === "signup" && (
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Nome completo"
                        className={inputClassName}
                      />
                    )}

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Palavra-passe"
                        className={`${inputClassName} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-accent"
                        aria-label={
                          showPassword
                            ? "Ocultar palavra-passe"
                            : "Mostrar palavra-passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-[0.85rem] text-[0.925rem] font-bold disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading && (
                        <Loader2 size={15} className="animate-spin" />
                      )}
                      {mode === "login" ? "Entrar" : "Criar conta"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="mt-5 text-center text-[11.5px] leading-relaxed text-muted">
                Ao continuar, reconhece a{" "}
                <a
                  href="#"
                  className="text-ink-muted underline underline-offset-2 transition-colors hover:text-accent"
                >
                  Política de Privacidade
                </a>{" "}
                da Fronex.
              </p>
            </div>

            <div className="mt-5 flex justify-center">
              <Link href="/" className="btn-secondary px-4 py-2.5 text-sm">
                Voltar ao site
              </Link>
            </div>

            <p className="mt-5 text-center text-sm text-ink-muted">
              {mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setStep("email");
                  setPassword("");
                }}
                className="font-semibold text-accent underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                {mode === "login" ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </div>
        </div>

        {/* Painel visual abstrato */}
        <div className="relative hidden p-5 lg:block lg:p-6">
            <div className="relative h-full min-h-[calc(100vh-3rem)] overflow-hidden rounded-[1.35rem] border border-border bg-surface">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(37,99,235,0.16),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(34,211,238,0.12),transparent_45%)]"
              />
              <div
                aria-hidden
                className="absolute inset-[12%] opacity-[0.14]"
                style={{
                  backgroundImage:
                  "linear-gradient(rgba(37,99,235,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.42) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                  maskImage:
                    "radial-gradient(ellipse at center, black 25%, transparent 72%)",
                }}
              />
            <div
              aria-hidden
              className="absolute left-[18%] top-[28%] h-36 w-36 border border-accent/50 bg-gradient-to-br from-accent/20 to-transparent shadow-neon"
              style={{ transform: "rotate(18deg) skewY(-6deg)" }}
            />
            <div
              aria-hidden
              className="absolute bottom-[22%] right-[16%] h-28 w-28 border border-accent-soft/40 bg-gradient-to-tl from-accent-soft/15 to-transparent"
              style={{ transform: "rotate(-14deg) skewY(5deg)" }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 to-transparent p-8">
              <p className="section-label mb-2">Fronex Studio</p>
              <p className="max-w-sm font-display text-2xl font-bold leading-snug text-ink">
                Presença digital com ritmo, confiança e leitura mobile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-muted">
          A carregar...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
