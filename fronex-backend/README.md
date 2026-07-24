# FRONEX — Backend (Next.js API Routes + Supabase + Groq)

## 1. Instalação

```bash
npm install @supabase/supabase-js @supabase/ssr zod
```

## 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, execute o ficheiro:
   `supabase/migrations/0001_init_schema.sql`
3. Em **Authentication > URL Configuration**, defina a Redirect URL:
   `https://SEU_DOMINIO/api/auth/callback`
4. Copie as chaves em **Project Settings > API** para o `.env.local`
   (veja `.env.example`).

## 3. Configurar Groq API

1. Crie uma conta em [console.groq.com](https://console.groq.com).
2. Gere uma API Key e adicione como `GROQ_API_KEY` no `.env.local`.
3. Modelo padrão: `llama3-70b-8192` (ajustável via `GROQ_MODEL`).

## 4. Estrutura de pastas

```
supabase/migrations/0001_init_schema.sql   → schema, triggers, RLS
lib/supabase/server.ts                     → cliente com cookies (respeita RLS)
lib/supabase/admin.ts                      → cliente service_role (backend)
lib/ai/systemPrompts.ts                    → prompts da Fronex AI e Mentores
lib/ai/groqClient.ts                       → wrapper da Groq API
lib/validations/schemas.ts                 → schemas Zod
lib/pricing.ts                             → lógica de preço flexível
lib/tokens.ts                              → gestão de tokens (user/visitante)
app/api/auth/callback/route.ts             → GET  — callback de login
app/api/chat/route.ts                      → POST — chat geral (Fronex AI)
app/api/mentor/route.ts                    → POST — chat com mentores
app/api/calculate-price/route.ts           → POST — calculadora de orçamento
```

## 5. Regras de negócio implementadas

- **Tokens diários**: 5 para visitantes (`anon_sessions`, identificados por
  um `sessionId` UUID gerado no frontend e persistido em cookie), 25 para
  usuários autenticados (`profiles`). Reset automático à meia-noite via
  `reset_daily_tokens_if_needed()`.
- **Contexto de conversa**: as rotas `/api/chat` e `/api/mentor` buscam as
  últimas 10 mensagens em `chat_logs` para dar continuidade à conversa.
  O histórico de mentores é isolado por persona (`mentor_persona`).
- **Preço flexível** (`lib/pricing.ts`):
  - complexidade ≤ 1 → 50% do preço base
  - complexidade ≤ 3 → 80% do preço base
  - complexidade ≤ 5 → preço base
  - complexidade > 5 → +10% a +20%, sempre limitado ao teto máximo do serviço
- **WhatsApp**: link gerado automaticamente para `+244 946 419 129` com
  mensagem pré-preenchida contendo o serviço e o valor estimado.

## 6. Exemplo de uso (frontend)

```ts
// Chat geral
const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'kd o preço dum site simples?', sessionId }),
});

// Mentor de finanças
const res = await fetch('/api/mentor', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'como formalizar meu negócio em Angola?',
    mentorKey: 'burocracia',
    sessionId,
  }),
});

// Calculadora de orçamento
const res = await fetch('/api/calculate-price', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceType: 'website',
    answers: { numPages: 5, needsPayment: false, designComplexity: 'media' },
    clientName: 'Kota Manuel',
  }),
});
```

## 7. Próximos passos sugeridos

- Implementar `discount_badge` como recompensa surpresa (ex.: após X
  mensagens ou X simulações, gerar um badge com desconto via função
  Postgres ou trigger em `chat_logs`/`service_inquiries`).
- Adicionar rate limiting por IP nas rotas públicas (ex.: Upstash Ratelimit)
  como camada extra contra abuso, além do controlo de tokens.
- Painel admin para visualizar `service_inquiries` e atualizar `status`.
