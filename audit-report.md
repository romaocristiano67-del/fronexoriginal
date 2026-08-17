# 🔍 AUDITORIA FRONEX — FASE 1

**Data**: 2026-08-17  
**Projeto**: fronexfrontend (SaaS de Ferramentas IA)  
**Stack**: Next.js 14 + React + TypeScript + Tailwind + Framer Motion + Supabase  
**Objetivo**: Auditoria pré-refatoração para remover genéricas, corrigir mobile, eliminar lógica sem sentido

---

## 📊 RESUMO EXECUTIVO

| Métrica | Resultado | Status |
|---------|-----------|--------|
| **Codebase Quality** | Sólida, sem lógica contraditória | ✅ |
| **IA Genérica** | 1 componente com copy clichê | ⚠️ Baixo |
| **Mobile Responsividade** | Vários problemas de layout < 428px | 🔴 Alto |
| **Preços** | Corretos, em Kz, sem inconsistências | ✅ |
| **Animações** | Pesadas em Android gama baixa | ⚠️ Médio |
| **Acessibilidade** | Bom (contrast, labels) mas faltam aria-labels | ⚠️ Médio |

---

## 1️⃣ MAPA DE PÁGINAS E ROTAS

### Público

| Rota | Arquivo | Propósito | Componentes |
|------|---------|----------|------------|
| `/` | [app/page.tsx](../app/page.tsx) | Homepage | Header + Hero + About + Services + Pricing + Mentors + Tools + Portfolio + Footer |
| `/login` | [app/login/page.tsx](../app/login/page.tsx) | Autenticação | Email/Senha/Google OAuth |
| `/auth/erro` | [app/auth/erro/page.tsx](../app/auth/erro/page.tsx) | Erro auth | Alert + botões |

### Protegido (requer autenticação Supabase)

| Rota | Arquivo | Propósito |
|------|---------|----------|
| `/dashboard` | [app/dashboard/page.tsx](../app/dashboard/page.tsx) | Área do usuário (tabs: Overview, Profile, Preferences, Services) |

### API (Backend)

| Rota | Método | Propósito | Token |
|------|--------|----------|-------|
| `/api/calculate-price` | POST | Calcula orçamento | Sim |
| `/api/chat` | POST | Chat IA | Sim |
| `/api/mentor` | POST | Mentor IA | Sim |
| `/api/innovate` | POST | Validar ideia | Sim |
| `/api/tools/generate` | POST | Gerar documentos | Sim |
| `/api/export-docx` | POST | Export Word | Não |
| `/api/auth/callback` | GET | OAuth callback | N/A |

---

## 2️⃣ COMPONENTES INTERATIVOS CRÍTICOS

### 🔴 CRÍTICOS (P0)

| Componente | Arquivo | Função | Problemas Detectados |
|-----------|---------|--------|---------------------|
| **Header** | [components/header.tsx](../components/header.tsx) | Navegação + Auth | Menu mobile apertado; logo pode ser cortado em 360px |
| **ServiceModal** | [components/service-modal.tsx](../components/service-modal.tsx) | Questionário 15-passo | Modal com inputs pequenos em mobile; scroll interno ruim |
| **AIChatWidget** | [components/ai-chat-widget.tsx](../components/ai-chat-widget.tsx) | Chat flutuante | Widget fixo no bottom-right pode sobrepor conteúdo em 360px |
| **Login Form** | [app/login/page.tsx](../app/login/page.tsx) | Autenticação | Inputs `type="text"` para email (deviam ser `type="email"`) |

### 🟠 PRINCIPAIS (P1)

| Componente | Arquivo | Viewport Issues |
|-----------|---------|-----------------|
| **Hero** | [components/hero.tsx](../components/hero.tsx) | CTA buttons: h-12 bom, mas em 360px precisam mais espaço |
| **ServicesSection** | [components/services-section.tsx](../components/services-section.tsx) | Cards grid: 1 coluna em mobile, imagem 44px muito grande |
| **MentorsSection** | [components/mentors-section.tsx](../components/mentors-section.tsx) | Tabs horizontais com overflow-x-auto; cards muito compactos |
| **ToolsSection** | [components/tools-section.tsx](../components/tools-section.tsx) | Formulários dinâmicos, inputs muito pequenos |
| **PricingSection** | [components/pricing-section.tsx](../components/pricing-section.tsx) | Cards em grid, bom, sem issues |

---

## 3️⃣ PROBLEMAS MÓBEIS IDENTIFICADOS (360–428px)

### 🔴 CRÍTICOS

#### #1: Menu Mobile — Elementos Cortados
- **Componente**: Header
- **Arquivo**: [components/header.tsx](../components/header.tsx#L95)
- **Viewport Afetado**: 360px, 390px
- **Problema**: 
  - `h-16 md:h-20` — Espaço OK
  - Logo + nav + user button em linha — Logo pode ser comprimido
  - Menu burger em direita — OK
  - **Quando abre menu**: Navegação em dropdown, links muito compactos (sem padding vertical)
- **Esperado**: Links com 44px de altura mínima
- **Código**:
  ```tsx
  // linha 95: container flex com h-16 — OK
  // mas links no dropdown não têm altura mínima
  ```
- **Impacto**: Crítico (utilizador não consegue tocar links)

#### #2: ServiceModal — Diálogo Fora de Viewport
- **Componente**: ServiceModal
- **Arquivo**: [components/service-modal.tsx](../components/service-modal.tsx#L127)
- **Viewport Afetado**: 360px, 390px
- **Problema**:
  - Modal `fixed inset-0` — Bem
  - Conteúdo interno sem altura máxima com scroll — Pode ter scroll duplo
  - Inputs com `min-h-11` — Bem
  - **Em 360px**: Modal inteiro com respostas + botões > 100vh, scroll confuso
- **Esperado**: Modal com scroll interno controlado, rodapé visível
- **Impacto**: Alto (utilizador não vê botão "enviar" ou não consegue fazer scroll)

#### #3: AIChatWidget — Sobrepõe Conteúdo
- **Componente**: AIChatWidget
- **Arquivo**: [components/ai-chat-widget.tsx](../components/ai-chat-widget.tsx#L184)
- **Viewport Afetado**: Todas < 768px
- **Problema**:
  - Button `fixed bottom-5 right-5` — Pode sobrepor botões (CTA em footer, por ex)
  - Sem `right-safe-area-inset` para notch/bezel
  - Sem detecção se conteúdo abaixo está visível
- **Esperado**: Widget respeta safe-area; não sobrepõe CTAs críticas
- **Impacto**: Alto (engano de toque em elemento errado)

#### #4: Login Form — Tipo de Input Errado
- **Componente**: LoginForm
- **Arquivo**: [app/login/page.tsx](../app/login/page.tsx) (linhas ~50-80)
- **Problema**:
  - Inputs `type="text"` para email e password
  - Esperado: `type="email"` (abre teclado email em mobile) e `type="password"` (mascarado)
- **Impacto**: Crítico (UX confusa, teclado errado)

---

### 🟠 ALTOS

#### #5: Header Navigation — Links Comprimidos
- **Componente**: Header nav links
- **Arquivo**: [components/header.tsx](../components/header.tsx) (NAV_LINKS)
- **Viewport Afetado**: 360px (quando menuOpen = false)
- **Problema**:
  - Navegação em desktop `flex gap-4` — OK
  - Em mobile: menu burger, mas links dentro de menu dropdown não têm height mínimo
- **Esperado**: Links 44x44px minimum (ou 44px height + padding)
- **Impacto**: Alto (alvos de toque muito pequenos)

#### #6: ServiceModal — Inputs Muito Pequenos
- **Componente**: ServiceModal form inputs
- **Arquivo**: [components/service-modal.tsx](../components/service-modal.tsx)
- **Problema**:
  - Radio buttons / checkboxes customizados pode ser < 44px
  - Inputs: `min-h-11` = 44px — OK mas padding é justo
- **Impacto**: Alto (difícil selecionar opções em mobile)

#### #7: MentorsSection — Tabs Horizontal Overflow
- **Componente**: Mentor selection tabs
- **Arquivo**: [components/mentors-section.tsx](../components/mentors-section.tsx#L148)
- **Problema**:
  - `overflow-x-auto pb-2` — Scroll horizontal para 3 tabs em 360px
  - Cards: `px-4 py-3` — Compacto
  - Tabs em mobile desnecessariamente horizontais
- **Esperado**: Stack vertical ou 2 colunas em mobile
- **Impacto**: Alto (scroll horizontal confunde utilizadores)

#### #8: ToolsSection — Dropdown Selects Muito Pequenos
- **Componente**: Tools form selects
- **Arquivo**: [components/tools-section.tsx](../components/tools-section.tsx) (~linhas 700-750)
- **Problema**:
  - Select elements sem padding adequado
  - Em mobile, dropdown pode não ser tappable
- **Impacto**: Alto (formulário não funcional)

---

### 🟡 COSMÉTICO

#### #9: Espaçamento Inconsistente
- **Problema**: Padding entre secções varia: `py-20`, `py-24`, `py-28` — sem ritmo consistente
- **Impacto**: Cosmético (parece desorganizado)

#### #10: Hero Title — Muito Grande em Muito Pequeno
- **Componente**: Hero h1
- **Arquivo**: [components/hero.tsx](../components/hero.tsx)
- **Viewport Afetado**: 360px
- **Problema**:
  - Tailwind: `text-[2.55rem] sm:max-w-3xl sm:text-5xl`
  - Em 360px: título pode ter line-height muito aperto
- **Esperado**: `text-3xl sm:text-4xl` em 360px para legibilidade
- **Impacto**: Cosmético (ilegível mas não quebra)

---

## 4️⃣ ANÁLISE DE "CHEIRO A IA GENÉRICA"

### Copy Genérica Identificada

#### 🔴 CRÍTICA: Seção "About"
- **Arquivo**: [components/about-section.tsx](../components/about-section.tsx)
- **Problemas**:
  - **Título**: "Inovação", "Confiança", "Resultados" — 3 palavras genéricas que descrevem QUALQUER agência
  - **Descrição 1**: *"Soluções digitais pensadas para o mercado angolano, com tecnologia atual e execução rápida"* — Vago, sem diferencial
  - **Descrição 2**: *"Processo transparente, contacto direto e entrega com qualidade internacional"* — Clichê corporativo
  - **Descrição 3**: *"Sites, apps e sistemas desenhados para converter, organizar operação e fazer a marca crescer"* — Genérico

- **Estrutura**: 3 cards em grid com ícones (Rocket, Shield, BarChart3) — Padrão Figma template

- **Gradientes Decorativos**:
  ```jsx
  // Linhas 21-27: gradientes radiais azul/cyan sem função
  bg-[radial-gradient(ellipse_at_center,...)]
  ```
  - `aria-hidden` confirma que é puramente decorativo
  - Sem propósito UX, apenas "looks good"

#### ✅ BOM: Outros Componentes
- **Hero**: *"Presença digital com corpo, ritmo e detalhe"* — Específico, com voz
- **Services**: Copy contextualizado por serviço
- **Portfolio**: Descrições realistas de projetos

---

## 5️⃣ LÓGICA SEM SENTIDO (Código)

### ✅ Resultado: Nenhuma Lógica Contraditória Encontrada

- ✅ Condições sempre válidas
- ✅ Handlers funcionam
- ✅ Estados sincronizados
- ✅ APIs apontam para endpoints corretos
- ✅ Imports usados
- ✅ Validação Zod consistente
- ✅ Magic numbers documentados

**Codebase está limpa neste aspecto.**

---

## 6️⃣ TABELA CONSOLIDADA DE PREÇOS

**Local**: [lib/pricing.ts](../lib/pricing.ts)  
**Moeda**: Kwanza (Kz) — Consistente em todos  
**Formatação**: Padrão `pt-AO` com separador de milhar

| Serviço | Piso | Base | Teto | Status |
|---------|------|------|------|--------|
| **Sites & Web** | 10.000 Kz | 25.000 Kz | 43.750 Kz | ✅ OK |
| **Apps & Sistemas** | 50.000 Kz | 87.500 Kz | 150.000 Kz | ✅ OK |
| **Gestão Redes/TikTok** | 15.000 Kz | 31.250 Kz | 50.000 Kz | ✅ OK |
| **Vídeos IA** | 18.000 Kz | 35.000 Kz | 55.000 Kz | ✅ OK |
| **Edição Vídeos** | 6.000 Kz | 15.000 Kz | 25.000 Kz | ✅ OK |
| **Design Gráfico** | 5.000 Kz | 12.500 Kz | 22.500 Kz | ✅ OK |

**Sem revisão necessária** — tudo correto.

---

## 7️⃣ ANIMAÇÕES E PERFORMANCE

### Framer Motion Usage
- ✅ Hero: Reveal animations (OK para homepage)
- ✅ Header: Menu toggle (smooth)
- ✅ ServiceModal: Backdrop fade (OK)
- ✅ AIChatWidget: Float in/out (OK)

### Potencial Issue
- **Android Gama Baixa**: Múltiplos transforms + opacity + blur simultâneos podem travar
- **Recomendação**: Testar em Moto G7 / Samsung A10 real

---

## 8️⃣ ACESSIBILIDADE

### O Que Está Bem
- ✅ Contrast ratios: Fronex Signal Violet (#6D5EF8) vs fundo tem bom contrast
- ✅ Tipografia: 16px base em mobile, bom
- ✅ Dark mode: Respeitado com `prefers-reduced-motion`

### O Que Falta
- ⚠️ Links sem `aria-label` descritivo (ex: logo, menu burger)
- ⚠️ Botões "Estou Interessado" sem `aria-label` contextual
- ⚠️ Modais sem `role="dialog"` explícito
- ⚠️ Skip to main content link ausente

---

## 9️⃣ CHECKLIST FINAL DA FASE 1

| Item | Status | Nota |
|------|--------|------|
| Mapa de rotas | ✅ | 4 páginas + 7 APIs |
| Componentes interativos mapeados | ✅ | 12+ encontrados |
| Problemas móbeis documentados | ✅ | 10 problemas (3 críticos, 5 altos, 2 cosmético) |
| "IA genérica" identificada | ✅ | About section + gradientes decorativos |
| Lógica contraditória | ✅ | Nenhuma encontrada |
| Preços mapeados | ✅ | 6 serviços, tudo em Kz |
| Teste de acessibilidade | ✅ | Bom, mas faltam aria-labels |

---

## 🎯 PRÓXIMOS PASSOS

**Fase 2**: Priorizar problemas e propor correções concretas  
**Fase 3**: Implementar móvel-first, reescrever copy genérica, otimizar animações  
**Fase 4**: Validação e Lighthouse

---

## 📎 ARQUIVOS CRÍTICOS PARA REFATORAÇÃO

1. **[components/header.tsx](../components/header.tsx)** — Menu mobile, alvos de toque
2. **[components/service-modal.tsx](../components/service-modal.tsx)** — Scroll modal, inputs responsivos
3. **[components/ai-chat-widget.tsx](../components/ai-chat-widget.tsx)** — Posicionamento fixed, safe-area
4. **[components/about-section.tsx](../components/about-section.tsx)** — Copy genérica + gradientes
5. **[app/login/page.tsx](../app/login/page.tsx)** — Tipo de inputs errados
6. **[components/mentors-section.tsx](../components/mentors-section.tsx)** — Layout horizontal -> vertical mobile
7. **[components/tools-section.tsx](../components/tools-section.tsx)** — Inputs responsivos

---

**Auditoria Completa: FASE 1 ✅**  
Aguardando aprovação para proceder à **Fase 2 — PLANO**.
