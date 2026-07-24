// ============================================================
// Cliente para a Groq API (Llama 3) — chat completions
// ============================================================

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type CompletionOptions = {
  temperature?: number;
  maxTokens?: number;
};

type CompletionResult = {
  content: string;
  tokensUsed: number;
  model: string;
};

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// llama3-70b-8192 foi descontinuado na Groq — usar modelo atual suportado.
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

export async function getAIChatCompletion(
  messages: ChatMessage[],
  options?: CompletionOptions
): Promise<CompletionResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY não configurada nas variáveis de ambiente.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000); // 20s timeout

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 800,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Groq API respondeu com erro ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    const tokensUsed: number = data?.usage?.total_tokens ?? 0;

    if (!content) {
      throw new Error('Groq API retornou uma resposta vazia.');
    }

    return { content: content.trim(), tokensUsed, model: GROQ_MODEL };
  } finally {
    clearTimeout(timeout);
  }
}

/*
 * ------------------------------------------------------------
 * Alternativa: Gemini API (google-generativeai)
 * ------------------------------------------------------------
 * Caso a Fronex prefira usar Gemini em vez de Groq, basta criar uma
 * função com a mesma assinatura `getAIChatCompletion` chamando o
 * endpoint da Gemini API e mapear as roles ('user' | 'model') e a
 * resposta para o mesmo formato { content, tokensUsed, model}.
 * As rotas de API (/api/chat e /api/mentor) não precisam de qualquer
 * alteração, pois dependem apenas dessa assinatura.
 */
