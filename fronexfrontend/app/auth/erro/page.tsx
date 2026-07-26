"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";

const MOTIVOS: Record<string, string> = {
  codigo_ausente: "O Google não devolveu o código de autenticação.",
  sessao_invalida: "Não foi possível criar a sessão. Tente novamente.",
  erro_interno: "Ocorreu um erro interno durante o login.",
};

function ErroContent() {
  const searchParams = useSearchParams();
  const motivo = searchParams.get("motivo") ?? "erro_interno";
  const mensagem = MOTIVOS[motivo] ?? MOTIVOS.erro_interno;

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
          <AlertCircle className="text-accent" size={22} />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Login não concluído
        </h1>
        <p className="mt-3 text-sm text-ink-muted">{mensagem}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="btn-primary font-bold">
            Tentar novamente
          </Link>
          <Link href="/" className="btn-secondary">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AuthErroPage() {
  return (
    <Suspense fallback={null}>
      <ErroContent />
    </Suspense>
  );
}
