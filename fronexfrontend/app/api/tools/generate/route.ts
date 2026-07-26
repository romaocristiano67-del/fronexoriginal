import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { toolGenerateRequestSchema } from "@/lib/validations/schemas";
import { getAIChatCompletion, type ChatMessage } from "@/lib/ai/groqClient";
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
import { readLocalTemplateSummary, TOOL_TEMPLATES } from "@/lib/tools/tool-prompts";
import { getTemplateWrapper } from "@/lib/tools/template-injector";

function safeStringify(value: unknown) {
  return JSON.stringify(value, null, 2).slice(0, 6000);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
    }

    const parsed = toolGenerateRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { tool, payload, sessionId } = parsed.data;
    const template = TOOL_TEMPLATES[tool];
    const contentForModeration = safeStringify(payload);
    const conduct = detectConductViolation(contentForModeration);

    if (conduct.blocked) {
      return NextResponse.json({
        reply: conduct.reply ?? FRONEX_CONDUCT_REPLY,
        moderated: true,
        moderationReason: conduct.reason,
      });
    }

    if (conduct.reason === "off_topic" && tool !== "assistant") {
      return NextResponse.json({
        reply: conduct.reply ?? FRONEX_SCOPE_REDIRECT_REPLY,
        moderated: true,
        moderationReason: conduct.reason,
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
          error: "Limite diário de créditos atingido",
          upgradeMessage: identity.userId
            ? "Volte amanhã ou fale connosco diretamente no WhatsApp."
            : "Crie uma conta gratuita para ganhar mais créditos por dia (25/dia em vez de 5).",
        },
        { status: 429 }
      );
    }

    const localTemplateSummary = readLocalTemplateSummary();
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `${template.system}\n\n${localTemplateSummary}`,
      },
      {
        role: "user",
        content: `Ferramenta: ${template.title}\nDados do utilizador:\n${safeStringify(payload)}`,
      },
    ];

    let aiReply: string;
    let tokensUsed: number;
    let model: string;

    try {
      const completion = await getAIChatCompletion(messages, {
        temperature: template.output === "site" ? 0.25 : 0.38,
        maxTokens: template.output === "site" ? 1800 : 2500, // increased for HTML response
      });
      aiReply = completion.content;
      tokensUsed = completion.tokensUsed;
      model = completion.model;
    } catch (aiError) {
      console.error("[api/tools/generate] erro na chamada à IA:", aiError);
      return NextResponse.json(
        { error: "Não foi possível gerar com IA no momento. Tente novamente em instantes." },
        { status: 502 }
      );
    }

    await deductToken(admin, identity, tokensAvailable);

    const { error: logError } = await admin.from("chat_logs").insert([
      {
        user_id: identity.userId ?? null,
        session_id: identity.sessionId ?? null,
        context_type: `tool:${tool}`,
        role: "user",
        content: safeStringify(payload),
      },
      {
        user_id: identity.userId ?? null,
        session_id: identity.sessionId ?? null,
        context_type: `tool:${tool}`,
        role: "assistant",
        content: aiReply,
        tokens_used: tokensUsed,
        model,
      },
    ]);

    if (logError) {
      console.error("[api/tools/generate] erro ao gravar chat_logs:", logError);
    }

    return NextResponse.json({
      reply: aiReply,
      outputType: template.output,
      tokensRemaining: tokensAvailable - 1,
      templateWrapper: template.output === "document" ? getTemplateWrapper() : undefined,
    });
  } catch (err) {
    console.error("[api/tools/generate] erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
