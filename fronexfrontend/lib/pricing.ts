// lib/pricing.ts
// Motor de precificação dinâmica da Fronex.
// Cada serviço parte de um preço médio (base) e um teto máximo.
// Cada resposta do questionário aplica um modificador percentual ou fixo,
// sempre respeitando o teto máximo definido para o serviço.

export type ServiceId =
  | "web"
  | "apps"
  | "social"
  | "ai-video"
  | "video-edit"
  | "design";

export interface ServiceDefinition {
  id: ServiceId;
  title: string;
  description: string;
  image: string;
  basePrice: number; // Kz — média
  minPrice: number; // Kz — piso (opções mais simples)
  maxPrice: number; // Kz — teto (opções mais complexas)
  questions: QuestionDefinition[];
}

export interface QuestionOption {
  id: string;
  label: string;
  // impacto no preço: 'percent' aplica sobre o preço corrente, 'fixed' soma/subtrai um valor em Kz
  impactType: "percent" | "fixed";
  impactValue: number; // ex: -0.25 (=-25%), 0.15 (=+15%), ou valor fixo em Kz
  helper?: string;
}

export interface QuestionDefinition {
  id: string;
  question: string;
  options: QuestionOption[];
  showIf?: (answers: Record<string, QuestionOption | undefined>) => boolean;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: "web",
    title: "Sites & Web",
    description: "Sites institucionais, landing pages e lojas online.",
    image: "/images/service-web.jpg",
    basePrice: 20000,
    minPrice: 8000,
    maxPrice: 35000,
    questions: [
      {
        id: "pages",
        question: "Quantas páginas o site vai ter?",
        options: [
          { id: "one", label: "1 página (Landing Page)", impactType: "percent", impactValue: -0.35 },
          { id: "few", label: "2 a 5 páginas", impactType: "percent", impactValue: 0 },
          { id: "many", label: "6 ou mais páginas", impactType: "percent", impactValue: 0.15 },
        ],
      },
      {
        id: "database",
        question: "O site precisa de base de dados / login de utilizadores?",
        options: [
          { id: "no", label: "Não, apenas conteúdo estático", impactType: "percent", impactValue: -0.15 },
          { id: "simple", label: "Sim, formulário simples (sem login)", impactType: "percent", impactValue: 0.05 },
          { id: "full", label: "Sim, com login e base de dados completa", impactType: "percent", impactValue: 0.25 },
        ],
      },
      {
        id: "design",
        question: "Que nível de design pretende?",
        options: [
          { id: "template", label: "Modelo simples e direto", impactType: "percent", impactValue: -0.1 },
          { id: "custom", label: "Design personalizado à marca", impactType: "percent", impactValue: 0.1 },
          { id: "premium", label: "Design premium com animações", impactType: "percent", impactValue: 0.2 },
        ],
      },
    ],
  },
  {
    id: "apps",
    title: "Apps & Sistemas",
    description: "Aplicações móveis e sistemas de gestão à medida.",
    image: "/images/service-apps.jpg",
    basePrice: 70000,
    minPrice: 40000,
    maxPrice: 120000,
    questions: [
      {
        id: "platform",
        question: "Para que plataforma é o produto?",
        options: [
          { id: "single", label: "Apenas Android ou iOS", impactType: "percent", impactValue: -0.15 },
          { id: "both", label: "Android e iOS", impactType: "percent", impactValue: 0.1 },
          { id: "web-system", label: "Sistema Web de gestão", impactType: "percent", impactValue: 0 },
        ],
      },
      {
        id: "complexity",
        question: "Qual a complexidade das funcionalidades?",
        options: [
          { id: "basic", label: "Básica (cadastro, listagem)", impactType: "percent", impactValue: -0.2 },
          { id: "medium", label: "Média (pagamentos, notificações)", impactType: "percent", impactValue: 0.1 },
          { id: "advanced", label: "Avançada (IA, integrações múltiplas)", impactType: "percent", impactValue: 0.2 },
        ],
      },
      {
        id: "backend",
        question: "Precisa de backend/API dedicado?",
        options: [
          { id: "no", label: "Não, uso serviços prontos", impactType: "percent", impactValue: -0.1 },
          { id: "yes", label: "Sim, backend próprio", impactType: "percent", impactValue: 0.15 },
        ],
      },
    ],
  },
  {
    id: "social",
    title: "Gestão de Redes/TikTok",
    description: "Gestão de conteúdo e crescimento nas redes sociais.",
    image: "/images/service-social.jpg",
    basePrice: 25000,
    minPrice: 12000,
    maxPrice: 40000,
    questions: [
      {
        id: "platforms",
        question: "Quantas redes sociais deseja gerir?",
        options: [
          { id: "one", label: "Apenas 1 rede", impactType: "percent", impactValue: -0.3 },
          { id: "two", label: "2 redes", impactType: "percent", impactValue: 0 },
          { id: "three-plus", label: "3 ou mais redes", impactType: "percent", impactValue: 0.2 },
        ],
      },
      {
        id: "posts",
        question: "Quantas publicações por semana?",
        options: [
          { id: "low", label: "1 a 2 publicações", impactType: "percent", impactValue: -0.15 },
          { id: "mid", label: "3 a 5 publicações", impactType: "percent", impactValue: 0.05 },
          { id: "high", label: "6 ou mais publicações", impactType: "percent", impactValue: 0.2 },
        ],
      },
      {
        id: "ads",
        question: "Inclui gestão de anúncios pagos?",
        options: [
          { id: "no", label: "Não", impactType: "percent", impactValue: -0.05 },
          { id: "yes", label: "Sim, com relatórios mensais", impactType: "percent", impactValue: 0.15 },
        ],
      },
    ],
  },
  {
    id: "ai-video",
    title: "Vídeos de IA",
    description: "Vídeos gerados e potenciados por Inteligência Artificial.",
    image: "/images/service-ai-video.jpg",
    basePrice: 35000,
    minPrice: 18000,
    maxPrice: 55000,
    questions: [
      {
        id: "duration",
        question: "Qual a duração aproximada do vídeo?",
        options: [
          { id: "short", label: "Até 30 segundos", impactType: "percent", impactValue: -0.25 },
          { id: "medium", label: "30s a 2 minutos", impactType: "percent", impactValue: 0 },
          { id: "long", label: "Mais de 2 minutos", impactType: "percent", impactValue: 0.2 },
        ],
      },
      {
        id: "voice",
        question: "Precisa de narração com voz de IA?",
        options: [
          { id: "no", label: "Não", impactType: "percent", impactValue: -0.1 },
          { id: "yes", label: "Sim", impactType: "percent", impactValue: 0.1 },
        ],
      },
      {
        id: "avatar",
        question: "Deseja um avatar/apresentador de IA?",
        options: [
          { id: "no", label: "Não", impactType: "percent", impactValue: -0.1 },
          { id: "yes", label: "Sim, avatar personalizado", impactType: "percent", impactValue: 0.2 },
        ],
      },
    ],
  },
  {
    id: "video-edit",
    title: "Edição de Vídeos",
    description: "Edição profissional para redes sociais e conteúdos.",
    image: "/images/service-video-edit.jpg",
    basePrice: 15000,
    minPrice: 6000,
    maxPrice: 25000,
    questions: [
      {
        id: "videos",
        question: "Quantos vídeos por mês?",
        options: [
          { id: "low", label: "1 a 4 vídeos", impactType: "percent", impactValue: -0.3 },
          { id: "mid", label: "5 a 10 vídeos", impactType: "percent", impactValue: 0 },
          { id: "high", label: "11 ou mais vídeos", impactType: "percent", impactValue: 0.25 },
        ],
      },
      {
        id: "style",
        question: "Que estilo de edição pretende?",
        options: [
          { id: "simple", label: "Cortes simples e legendas", impactType: "percent", impactValue: -0.15 },
          { id: "dynamic", label: "Dinâmica com efeitos e motion", impactType: "percent", impactValue: 0.15 },
          { id: "cinematic", label: "Cinematográfica avançada", impactType: "percent", impactValue: 0.25 },
        ],
      },
    ],
  },
  {
    id: "design",
    title: "Design Gráfico",
    description: "Identidade visual, artes e materiais de marca.",
    image: "/portfolio/photoshop-fronex.jpg",
    basePrice: 10000,
    minPrice: 4000,
    maxPrice: 18000,
    questions: [
      {
        id: "scope",
        question: "O que precisa de ser desenhado?",
        options: [
          { id: "single", label: "Uma peça pontual (post, flyer)", impactType: "percent", impactValue: -0.35 },
          { id: "pack", label: "Pacote de artes (5 a 10 peças)", impactType: "percent", impactValue: 0.1 },
          { id: "identity", label: "Identidade visual completa (logo + manual)", impactType: "percent", impactValue: 0.35 },
        ],
      },
      {
        id: "revisions",
        question: "Quantas revisões deseja incluir?",
        options: [
          { id: "one", label: "1 revisão", impactType: "percent", impactValue: -0.1 },
          { id: "two", label: "2 a 3 revisões", impactType: "percent", impactValue: 0.05 },
          { id: "unlimited", label: "Revisões ilimitadas", impactType: "percent", impactValue: 0.2 },
        ],
      },
    ],
  },
];

export function getService(id: ServiceId): ServiceDefinition | undefined {
  return SERVICES.find((s) => s.id === id);
}

/**
 * Calcula o preço final a partir das respostas selecionadas.
 * As percentagens acumulam sobre o preço base; o resultado é sempre
 * limitado (clamp) entre o piso e o teto máximo do serviço.
 */
export function calculatePrice(
  service: ServiceDefinition,
  selectedOptions: Record<string, QuestionOption | undefined>
): number {
  let price = service.basePrice;
  let percentAccumulator = 0;
  let fixedAccumulator = 0;

  Object.values(selectedOptions).forEach((option) => {
    if (!option) return;
    if (option.impactType === "percent") {
      percentAccumulator += option.impactValue;
    } else {
      fixedAccumulator += option.impactValue;
    }
  });

  price = price * (1 + percentAccumulator) + fixedAccumulator;

  // Nunca ultrapassa o teto máximo, nem desce abaixo do piso mínimo
  price = Math.min(price, service.maxPrice);
  price = Math.max(price, service.minPrice);

  // Arredonda para o milhar mais próximo (múltiplos de 500 Kz)
  return Math.round(price / 500) * 500;
}

export function formatKz(value: number): string {
  return new Intl.NumberFormat("pt-AO", {
    maximumFractionDigits: 0,
  }).format(value) + " Kz";
}

type ApiAnswers = Record<string, unknown>;

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICES.map((service) => [service.id, service.title])
);

export type PriceResult = {
  basePrice: number;
  complexityScore: number;
  finalPrice: number;
  minPrice: number;
  maxPrice: number;
};

function isQuestionOption(value: unknown): value is QuestionOption {
  return (
    value !== null &&
    typeof value === "object" &&
    "impactType" in value &&
    "impactValue" in value
  );
}

export function calculateComplexityScore(answers: ApiAnswers): number {
  let score = 0;

  Object.values(answers).forEach((value) => {
    if (isQuestionOption(value)) {
      score += value.impactType === "percent" ? Math.max(value.impactValue * 10, -2) : value.impactValue / 10_000;
      return;
    }

    if (typeof value === "boolean") score += value ? 1.25 : 0;
    if (typeof value === "number") score += Math.min(value / 10, 2);
    if (Array.isArray(value)) score += Math.min(value.length * 0.35, 1.75);
    if (value === "media") score += 1;
    if (value === "alta") score += 2;
  });

  return Math.max(0, Number(score.toFixed(2)));
}

export function calculateFinalPrice(serviceType: string, answers: ApiAnswers): PriceResult {
  const service = SERVICES.find((item) => item.id === serviceType);

  if (!service) {
    throw new Error(`Tipo de serviço inválido: ${serviceType}`);
  }

  const optionAnswers: Record<string, QuestionOption | undefined> = {};

  Object.entries(answers).forEach(([key, value]) => {
    if (isQuestionOption(value)) optionAnswers[key] = value;
  });

  const hasOptionAnswers = Object.keys(optionAnswers).length > 0;
  const complexityScore = calculateComplexityScore(answers);
  let finalPrice = hasOptionAnswers ? calculatePrice(service, optionAnswers) : service.basePrice;

  if (!hasOptionAnswers) {
    if (complexityScore <= 1) finalPrice = service.basePrice * 0.5;
    else if (complexityScore <= 3) finalPrice = service.basePrice * 0.8;
    else if (complexityScore <= 5) finalPrice = service.basePrice;
    else finalPrice = service.basePrice * (1 + Math.min(0.1 + (complexityScore - 5) * 0.025, 0.2));

    finalPrice = Math.round(Math.max(service.minPrice, Math.min(finalPrice, service.maxPrice)) / 500) * 500;
  }

  return {
    basePrice: service.basePrice,
    complexityScore,
    finalPrice,
    minPrice: service.minPrice,
    maxPrice: service.maxPrice,
  };
}

export function buildApiWhatsAppLink(params: {
  serviceType: string;
  finalPrice: number;
  clientName?: string;
}): string {
  const phone = "244946419129";
  const label = SERVICE_LABELS[params.serviceType] ?? params.serviceType;
  const greeting = params.clientName ? `Olá, sou ${params.clientName}.` : "Olá!";
  const text = [
    greeting,
    `Fiz uma simulação no site da FRONEX para "${label}" e o orçamento estimado foi de ${formatKz(params.finalPrice)}.`,
    "Gostaria de fazer a verificação manual do pedido e alinhar os próximos passos.",
  ].join(" ");

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
