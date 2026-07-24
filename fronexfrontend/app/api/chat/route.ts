import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { chatRequestSchema } from '@/lib/validations/schemas';
import { getAIChatCompletion, type ChatMessage } from '@/lib/ai/groqClient';
import { FRONEX_AI_SYSTEM_PROMPT } from '@/lib/ai/systemPrompts';
import {
  detectConductViolation,
  FRONEX_CONDUCT_REPLY,
} from '@/lib/ai/moderation';
import {
  ensureAuthenticatedProfile,
  resolveIdentityAndTokens,
  deductToken,
} from '@/lib/tokens';

const HISTORY_LIMIT = 10;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json({ error: 'Corpo da requisição inválido (JSON esperado)' }, { status: 400 });
    }

    const parsed = chatRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, sessionId } = parsed.data;
    const conduct = detectConductViolation(message);

    if (conduct.blocked) {
      return NextResponse.json({
        reply: FRONEX_CONDUCT_REPLY,
        moderated: true,
        moderationReason: conduct.reason,
      });
    }

    const supabaseServer = createSupabaseServerClient();
    const admin = createSupabaseAdminClient();

    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    // Self-healing: garante profiles antes de tokens / Groq
    if (user) {
      const ensured = await ensureAuthenticatedProfile(admin, user);
      if (!ensured.ok) {
        return NextResponse.json({ error: ensured.error }, { status: ensured.status });
      }
    }

    const resolved = await resolveIdentityAndTokens(admin, user?.id, sessionId);
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: resolved.status });
    }

    const { identity, tokensAvailable } = resolved;

    if (tokensAvailable <= 0) {
      return NextResponse.json(
        {
          error: 'Limite diário de mensagens atingido',
          upgradeMessage: identity.userId
            ? 'Volte amanhã ou fale connosco diretamente no WhatsApp.'
            : 'Crie uma conta gratuita para ganhar mais mensagens por dia (25/dia em vez de 5).',
        },
        { status: 429 }
      );
    }

    // busca histórico recente para dar contexto à conversa
    let historyQuery = admin
      .from('chat_logs')
      .select('role, content')
      .eq('context_type', 'chat')
      .order('created_at', { ascending: false })
      .limit(HISTORY_LIMIT);

    historyQuery = identity.userId
      ? historyQuery.eq('user_id', identity.userId)
      : historyQuery.eq('session_id', identity.sessionId!);

    const { data: history } = await historyQuery;
    const orderedHistory = (history ?? []).reverse();

    const messages: ChatMessage[] = [
      { role: 'system', content: FRONEX_AI_SYSTEM_PROMPT },
      ...orderedHistory.map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content as string,
      })),
      { role: 'user', content: message },
    ];

    let aiReply: string;
    let tokensUsed: number;
    let model: string;

    try {
      const completion = await getAIChatCompletion(messages);
      aiReply = completion.content;
      tokensUsed = completion.tokensUsed;
      model = completion.model;
    } catch (aiError) {
      console.error('[api/chat] erro na chamada à IA:', aiError);
      return NextResponse.json(
        { error: 'Não foi possível obter resposta da assistente no momento. Tente novamente em instantes.' },
        { status: 502 }
      );
    }

    await deductToken(admin, identity, tokensAvailable);

    const { error: logError } = await admin.from('chat_logs').insert([
      {
        user_id: identity.userId ?? null,
        session_id: identity.sessionId ?? null,
        context_type: 'chat',
        role: 'user',
        content: message,
      },
      {
        user_id: identity.userId ?? null,
        session_id: identity.sessionId ?? null,
        context_type: 'chat',
        role: 'assistant',
        content: aiReply,
        tokens_used: tokensUsed,
        model,
      },
    ]);

    if (logError) {
      // não falha a resposta ao usuário por causa do log — apenas regista o erro
      console.error('[api/chat] erro ao gravar chat_logs:', logError);
    }

    return NextResponse.json({
      reply: aiReply,
      tokensRemaining: tokensAvailable - 1,
    });
  } catch (err) {
    console.error('[api/chat] erro inesperado:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
