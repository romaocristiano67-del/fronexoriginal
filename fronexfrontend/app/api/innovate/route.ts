import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { innovateRequestSchema } from "@/lib/validations/schemas";
import { getAIChatCompletion, type ChatMessage } from "@/lib/ai/groqClient";
import { INNOVATE_AI_SYSTEM_PROMPT } from "@/lib/ai/systemPrompts";
import { assessInnovateIdea } from "@/lib/ai/innovate";
import {
  detectConductViolation,
  FRONEX_CONDUCT_REPLY,
  FRONEX_SCOPE_REDIRECT_REPLY,
} from "@/lib/ai/moderation";
import {
  ensureAuthenticatedProfile,
  resolveIdentityAndTokens,
  deductToken,
} from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { error: "Corpo da requisição inválido (JSON esperado)" },
        { status: 400 }
      );
    }

    const parsed = innovateRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { idea, sessionId } = parsed.data;
    const conduct = detectConductViolation(idea);

    if (conduct.blocked) {
      return NextResponse.json({
        reply: conduct.reply ?? FRONEX_CONDUCT_REPLY,
        moderated: true,
        moderationReason: conduct.reason,
        needsClarification: false,
      });
    }

    if (conduct.reason === "off_topic") {
      return NextResponse.json({
        reply: conduct.reply ?? FRONEX_SCOPE_REDIRECT_REPLY,
        moderated: true,
        moderationReason: conduct.reason,
        needsClarification: false,
      });
    }

    // Blindagem local: não gasta token nem chama a IA em inputs inválidos
    const assessment = assessInnovateIdea(idea);
    if (!assessment.valid) {
      return NextResponse.json({
        reply: assessment.clarification,
        needsClarification: true,
        reason: assessment.reason,
      });
    }

    const supabaseServer = createSupabaseServerClient();
    const admin = createSupabaseAdminClient();

    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

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
          error: "Limite diário de mensagens atingido",
          upgradeMessage: identity.userId
            ? "Volte amanhã ou fale connosco diretamente no WhatsApp."
            : "Crie uma conta gratuita para ganhar mais mensagens por dia (25/dia em vez de 5).",
        },
        { status: 429 }
      );
    }

    const messages: ChatMessage[] = [
      { role: "system", content: INNOVATE_AI_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Ideia do utilizador para a aba Criar e Inovar:\n\n${idea}`,
      },
    ];

    let aiReply: string;
    let tokensUsed: number;
    let model: string;

    try {
      const completion = await getAIChatCompletion(messages, {
        temperature: 0.4,
        maxTokens: 1100,
      });
      aiReply = completion.content;
      tokensUsed = completion.tokensUsed;
      model = completion.model;
    } catch (aiError) {
      console.error("[api/innovate] erro na chamada à IA:", aiError);
      return NextResponse.json(
        {
          error:
            "Não foi possível organizar o plano no momento. Tente novamente em instantes.",
        },
        { status: 502 }
      );
    }

    await deductToken(admin, identity, tokensAvailable);

    const { error: logError } = await admin.from("chat_logs").insert([
      {
        user_id: identity.userId ?? null,
        session_id: identity.sessionId ?? null,
        context_type: "innovate",
        role: "user",
        content: idea,
      },
      {
        user_id: identity.userId ?? null,
        session_id: identity.sessionId ?? null,
        context_type: "innovate",
        role: "assistant",
        content: aiReply,
        tokens_used: tokensUsed,
        model,
      },
    ]);

    if (logError) {
      console.error("[api/innovate] erro ao gravar chat_logs:", logError);
    }

    return NextResponse.json({
      reply: aiReply,
      needsClarification: false,
      tokensRemaining: tokensAvailable - 1,
    });
  } catch (err) {
    console.error("[api/innovate] erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
