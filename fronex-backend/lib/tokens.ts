import type { SupabaseClient } from '@supabase/supabase-js';

export type Identity = { userId?: string; sessionId?: string };

type ResolveResult =
  | { ok: true; identity: Identity; tokensAvailable: number }
  | { ok: false; error: string; status: number };

/**
 * Resolve se a requisição vem de um usuário autenticado ou de um
 * visitante anônimo (via sessionId), garante o reset diário de tokens
 * e retorna quantos tokens estão disponíveis.
 *
 * Visitantes: 5 tokens/dia. Usuários autenticados: 25 tokens/dia.
 */
export async function resolveIdentityAndTokens(
  admin: SupabaseClient,
  userId: string | undefined,
  sessionId: string | undefined
): Promise<ResolveResult> {
  if (userId) {
    await admin.rpc('reset_daily_tokens_if_needed', {
      p_user_id: userId,
      p_session_id: null,
    });

    const { data: profile, error } = await admin
      .from('profiles')
      .select('daily_tokens')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return { ok: false, error: 'Perfil não encontrado', status: 404 };
    }

    return { ok: true, identity: { userId }, tokensAvailable: profile.daily_tokens };
  }

  if (!sessionId) {
    return {
      ok: false,
      error: 'sessionId é obrigatório para visitantes não autenticados',
      status: 400,
    };
  }

  await admin.rpc('reset_daily_tokens_if_needed', {
    p_user_id: null,
    p_session_id: sessionId,
  });

  const { data: anon, error } = await admin
    .from('anon_sessions')
    .upsert(
      {
        session_id: sessionId,
        daily_tokens: 5,
      },
      { onConflict: 'session_id' }
    )
    .select('daily_tokens')
    .single();

  if (error || !anon) {
    return { ok: false, error: 'Erro ao verificar ou criar sessão de visitante', status: 500 };
  }

  return { ok: true, identity: { sessionId }, tokensAvailable: anon.daily_tokens };
}

/** Deduz 1 token da identidade resolvida (usuário ou visitante). */
export async function deductToken(
  admin: SupabaseClient,
  identity: Identity,
  currentTokens: number
): Promise<void> {
  if (identity.userId) {
    await admin
      .from('profiles')
      .update({ daily_tokens: currentTokens - 1 })
      .eq('id', identity.userId);
  } else if (identity.sessionId) {
    await admin
      .from('anon_sessions')
      .update({ daily_tokens: currentTokens - 1 })
      .eq('session_id', identity.sessionId);
  }
}
