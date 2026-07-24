import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * GET /api/auth/callback
 * Callback do fluxo OAuth / Magic Link do Supabase Auth.
 * Troca o "code" pela sessão e grava os cookies na resposta de redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") ? rawNext : "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/erro?motivo=codigo_ausente`);
  }

  const redirectTo = NextResponse.redirect(`${origin}${next}`);

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectTo.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error("[api/auth/callback] erro ao trocar código por sessão:", error);
      return NextResponse.redirect(`${origin}/auth/erro?motivo=sessao_invalida`);
    }

    const { user } = data.session;

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name:
          (user.user_metadata?.full_name as string | undefined) ??
          (user.user_metadata?.name as string | undefined) ??
          user.email,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );

    if (profileError) {
      // Não bloqueia o login — o trigger do banco já deve ter criado o perfil.
      console.error("[api/auth/callback] aviso ao garantir perfil:", profileError);
    }

    return redirectTo;
  } catch (err) {
    console.error("[api/auth/callback] erro inesperado:", err);
    return NextResponse.redirect(`${origin}/auth/erro?motivo=erro_interno`);
  }
}
