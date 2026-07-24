import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/callback
 * Callback do fluxo OAuth / Magic Link do Supabase Auth.
 * Troca o "code" pela sessão do usuário e garante a existência do
 * perfil em `profiles` (o trigger `on_auth_user_created` já cria o
 * perfil com 25 tokens diários — este upsert é apenas uma segurança
 * extra e idempotente).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/erro?motivo=codigo_ausente`);
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error('[api/auth/callback] erro ao trocar código por sessão:', error);
      return NextResponse.redirect(`${origin}/auth/erro?motivo=sessao_invalida`);
    }

    const { user } = data.session;

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: (user.user_metadata?.full_name as string | undefined) ?? user.email,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );

    if (profileError) {
      // Não bloqueia o login — o trigger do banco já deve ter criado o perfil.
      console.error('[api/auth/callback] aviso ao garantir perfil:', profileError);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error('[api/auth/callback] erro inesperado:', err);
    return NextResponse.redirect(`${origin}/auth/erro?motivo=erro_interno`);
  }
}
