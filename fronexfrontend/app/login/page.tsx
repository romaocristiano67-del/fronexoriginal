"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Newsreader } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const loginSerif = Newsreader({
  subsets: ["latin"],
  display: "swap",
});

type Mode = "login" | "signup";
type Step = "email" | "credentials";

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

      toast.success(mode === "login" ? "Login efetuado com sucesso" : "Conta criada com sucesso", {
        description:
          mode === "login"
            ? "A sua sessão Fronex está ativa."
            : "Se a confirmação por email estiver ativa, verifique a sua caixa de entrada.",
      });

      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      toast.error("Não foi possível autenticar", {
        description: error instanceof Error ? error.message : "Confirme os dados e tente novamente.",
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
    <div className="min-h-screen bg-[#F9F8F6] text-[#191919]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        {/* Esquerda — marca + cartão */}
        <div className="relative flex flex-col px-6 py-6 sm:px-10 lg:px-12 lg:py-8">
          <Link href="/" className="inline-flex w-fit items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#191919]">
              <span className="text-[13px] font-bold text-[#F9F8F6]">F</span>
            </span>
            <span className={`${loginSerif.className} text-[1.35rem] leading-none tracking-[-0.02em]`}>
              Fronex
            </span>
          </Link>

          <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
            <div className="text-center">
              <h1
                className={`${loginSerif.className} text-[2.5rem] leading-[1.12] tracking-[-0.03em] text-[#191919] sm:text-[3.15rem]`}
              >
                Question what&apos;s next
              </h1>
              <p className={`${loginSerif.className} mt-3 text-[1.05rem] leading-snug text-[#191919]/sm:text-[1.15rem]`}>
                O seu parceiro digital para grandes ambições
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[#E8E6E1] bg-white px-6 py-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-7 sm:py-8">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#D9D7D2] bg-white px-4 py-[0.85rem] text-[0.925rem] font-medium text-[#191919] transition-colors hover:bg-[#FAFAF8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
                Continuar com Google
              </button>

              <div className="my-5 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#A3A09A]">
                or
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
                      className="w-full rounded-lg border border-[#D9D7D2] bg-white px-3.5 py-[0.85rem] text-[0.925rem] text-[#191919] outline-none placeholder:text-[#A3A09A] focus:border-[#191919]"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#191919] py-[0.85rem] text-[0.925rem] font-medium text-white transition-opacity hover:opacity-90"
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
                      className="self-start text-left text-xs text-[#6F6C66] hover:text-[#191919]"
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
                        className="w-full rounded-lg border border-[#D9D7D2] bg-white px-3.5 py-[0.85rem] text-[0.925rem] outline-none placeholder:text-[#A3A09A] focus:border-[#191919]"
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
                        className="w-full rounded-lg border border-[#D9D7D2] bg-white px-3.5 py-[0.85rem] pr-11 text-[0.925rem] outline-none placeholder:text-[#A3A09A] focus:border-[#191919]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3A09A] hover:text-[#191919]"
                        aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#191919] py-[0.85rem] text-[0.925rem] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading && <Loader2 size={15} className="animate-spin" />}
                      {mode === "login" ? "Entrar" : "Criar conta"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="mt-5 text-center text-[11.5px] leading-relaxed text-[#8A867F]">
                Ao continuar, reconhece a{" "}
                <a href="#" className="underline underline-offset-2 hover:text-[#191919]">
                  Política de Privacidade
                </a>{" "}
                da Fronex.
              </p>
            </div>

            <div className="mt-5 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-[#D9D7D2] bg-white px-4 py-2.5 text-sm text-[#191919] transition-colors hover:bg-[#FAFAF8]"
              >
                Voltar ao site
              </Link>
            </div>

            <p className="mt-5 text-center text-sm text-[#6F6C66]">
              {mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setStep("email");
                  setPassword("");
                }}
                className="font-medium text-[#191919] underline underline-offset-4"
              >
                {mode === "login" ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </div>
        </div>

        {/* Direita — imagem arredondada, como na foto */}
        <div className="relative hidden p-5 lg:block lg:p-6">
          <div className="relative h-full min-h-[calc(100vh-3rem)] overflow-hidden rounded-[1.35rem]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/login-institucional.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
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
        <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6] text-sm text-[#6F6C66]">
          A carregar...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
