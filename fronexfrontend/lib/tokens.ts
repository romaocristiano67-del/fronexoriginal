import type { SupabaseClient, User } from '@supabase/supabase-js';

export type Identity = { userId?: string; sessionId?: string };

type ResolveResult =
  | { ok: true; identity: Identity; tokensAvailable: number }
  | { ok: false; error: string; status: number };

const AUTH_DAILY_TOKENS = 25;

/**
 * Auto-cura do perfil autenticado: garante que `profiles` tem um
 * registo para o user.id antes de consumir tokens / chamar a Groq.
 * Usa `daily_tokens` (créditos diários do schema Fronex).
 */
export async function ensureAuthenticatedProfile(
  admin: SupabaseClient,
  user: User
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const { data: existing, error: selectError } = await admin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) {
    console.error('[tokens] erro ao verificar profiles:', selectError);
    return { ok: false, error: 'Erro ao verificar perfil', status: 500 };
  }

  if (existing) {
    return { ok: true };
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    null;

  const { error: upsertError } = await admin.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      daily_tokens: AUTH_DAILY_TOKENS,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );

  if (upsertError) {
    console.error('[tokens] falha ao criar perfil (self-healing):', upsertError);
    return {
      ok: false,
      error: 'Não foi possível criar o perfil do utilizador',
      status: 500,
    };
  }

  return { ok: true };
}

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
    console.error('[tokens] falha em anon_sessions:', error);
    const hint =
      error?.code === 'PGRST205' || error?.message?.includes('schema cache')
        ? 'Tabelas em falta no Supabase — execute a migration 0001_init_schema.sql.'
        : 'Erro ao verificar ou criar sessão de visitante';
    return { ok: false, error: hint, status: 500 };
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
