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
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 dark:bg-canvas-dark">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border dark:border-border-dark">
          <AlertCircle className="text-ink dark:text-ink-dark" size={22} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
          Login não concluído
        </h1>
        <p className="mt-3 text-sm text-muted dark:text-muted-dark">{mensagem}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas dark:bg-ink-dark dark:text-canvas-dark"
          >
            Tentar novamente
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border px-5 py-2.5 text-sm text-ink dark:border-border-dark dark:text-ink-dark"
          >
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
