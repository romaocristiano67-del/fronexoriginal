# Fronex — Frontend

Frontend oficial da Fronex, construído em **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion** e **Lucide Icons**.

## Como correr o projeto

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Estrutura

```
app/
  layout.tsx          → Layout raiz (fontes, ThemeProvider, AIChatWidget global)
  page.tsx             → Página inicial (compõe todas as secções)
  globals.css           → Tokens de tema, dark mode, utilitários
  login/page.tsx        → Página de Login/Cadastro (estilo Claude AI)

components/
  header.tsx             → Navegação + toggle dark/light + logótipo
  hero.tsx                → Hero com vídeo de abertura
  services-section.tsx    → Grelha de serviços (abre o ServiceModal)
  service-modal.tsx       → Questionário interativo com preço dinâmico
  mentors-section.tsx     → Seleção de mentores de IA
  innovate-section.tsx    → Simulador de Ideias
  pricing-section.tsx     → Resumo de preços por serviço
  ai-chat-widget.tsx      → Botão flutuante + chat + contador de tokens
  footer.tsx               → Rodapé
  theme-provider.tsx       → Contexto de dark/light mode (localStorage + prefers-color-scheme)

lib/
  pricing.ts             → Definição dos serviços, perguntas e motor de cálculo do orçamento
  whatsapp.ts             → Geração da mensagem e link do WhatsApp

public/
  images/                 → Imagens dos serviços e logótipo
  videos/                 → hero-abertura.mp4 (Hero) e login-institucional.mp4 (Login)
```

## Lógica de preço dinâmico

Toda a lógica está centralizada em `lib/pricing.ts`, no array `SERVICES`. Cada serviço tem:

- `basePrice` — preço médio
- `minPrice` / `maxPrice` — piso e teto
- `questions` — perguntas do questionário, cada opção com um `impactType` (`percent` ou `fixed`) e `impactValue`

A função `calculatePrice()` acumula os impactos percentuais sobre o preço base e aplica sempre um `clamp` entre `minPrice` e `maxPrice` — o valor **nunca ultrapassa o teto**, mesmo que a soma dos impactos seja superior a 100%.

Para adicionar um novo serviço ou pergunta, basta editar este ficheiro — nenhum componente precisa de ser tocado.

## Ligar à API real

Pontos já preparados para integração (marcados com comentários `// substituir por...` no código):

1. **`components/ai-chat-widget.tsx`** — a função `handleSend` tem um `setTimeout` de demonstração. Substituir pela chamada `fetch` à API de chat da Fronex, atualizando `tokensUsed` com a contagem real devolvida pela API.
2. **`components/innovate-section.tsx`** — a função `generatePlan()` é local. Substituir por uma chamada à API de IA que gera o plano de ação real.
3. **`app/login/page.tsx`** — `handleSubmit` está pronto para receber a chamada à API de autenticação (login/registo).
4. **`lib/pricing.ts`** — pode passar a ser alimentado por uma API (ex: `/api/services`) em vez do array estático, mantendo a mesma interface `ServiceDefinition`.

## Notas de design

- Paleta neutra tipo Apple (off-white `#FAFAF9` / near-black `#0A0A0B`), com um "flag-thread" (gradiente preto → vermelho → dourado, cores da bandeira de Angola) usado como assinatura visual discreta em títulos, no logótipo e nos vídeos.
- Tipografia: `Manrope` para títulos (`font-display`), `Inter` para corpo de texto (`font-body`).
- Dark mode via classe `.dark` no `<html>`, persistido em `localStorage` e com fallback para `prefers-color-scheme`.
