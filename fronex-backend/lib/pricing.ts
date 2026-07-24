import type { CalculatePriceRequest } from './validations/schemas';

type Answers = CalculatePriceRequest['answers'];

type ServicePricing = { base: number; min: number; max: number };

// Preços em Kwanzas (Kz) — ajustável conforme tabela de negócio da Fronex
const SERVICE_BASE_PRICES: Record<string, ServicePricing> = {
  website: { base: 20_000, min: 10_000, max: 30_000 },
  ecommerce: { base: 45_000, min: 30_000, max: 65_000 },
  app_mobile: { base: 80_000, min: 55_000, max: 120_000 },
  sistema_gestao: { base: 60_000, min: 40_000, max: 90_000 },
  identidade_visual: { base: 15_000, min: 8_000, max: 25_000 },
};

const SERVICE_LABELS: Record<string, string> = {
  website: 'Site institucional',
  ecommerce: 'Loja online (e-commerce)',
  app_mobile: 'Aplicativo mobile',
  sistema_gestao: 'Sistema de gestão',
  identidade_visual: 'Identidade visual',
};

/**
 * Calcula uma pontuação de complexidade a partir das respostas do
 * questionário. Escala aproximada: 0 (muito simples) a ~9+ (muito complexo).
 */
export function calculateComplexityScore(answers: Answers): number {
  let score = 0;

  if (answers.numPages) score += Math.min(answers.numPages / 10, 2); // até +2
  if (answers.needsPayment) score += 1.5;
  if (answers.needsAdminPanel) score += 1.5;
  if (answers.needsMultiLanguage) score += 1;
  if (answers.integrations?.length) {
    score += Math.min(answers.integrations.length * 0.3, 1.5);
  }
  if (answers.designComplexity === 'alta') score += 2;
  else if (answers.designComplexity === 'media') score += 1;
  if (answers.deadlineDays && answers.deadlineDays < 7) score += 1.5; // urgência

  return score;
}

export type PriceResult = {
  basePrice: number;
  complexityScore: number;
  finalPrice: number;
  minPrice: number;
  maxPrice: number;
};

/**
 * Aplica a lógica de preço flexível:
 * - Baixa complexidade → reduz o valor (até 50% do base, respeitando o mínimo)
 * - Complexidade moderada-baixa → leve redução (20%)
 * - Complexidade média → preço base
 * - Alta complexidade → aumenta 10% a 20%, limitado ao teto máximo
 */
export function calculateFinalPrice(serviceType: string, answers: Answers): PriceResult {
  const pricing = SERVICE_BASE_PRICES[serviceType];
  if (!pricing) {
    throw new Error(`Tipo de serviço inválido: ${serviceType}`);
  }

  const complexityScore = calculateComplexityScore(answers);
  let finalPrice: number;

  if (complexityScore <= 1) {
    finalPrice = pricing.base * 0.5; // baixa complexidade
  } else if (complexityScore <= 3) {
    finalPrice = pricing.base * 0.8; // complexidade moderada-baixa
  } else if (complexityScore <= 5) {
    finalPrice = pricing.base; // complexidade média — preço base
  } else {
    // alta complexidade: +10% a +20%, escalando com a pontuação acima de 5
    const extraPercent = Math.min(0.1 + (complexityScore - 5) * 0.025, 0.2);
    finalPrice = pricing.base * (1 + extraPercent);
  }

  // garante que nunca sai da faixa [min, max] definida para o serviço
  finalPrice = Math.max(pricing.min, Math.min(finalPrice, pricing.max));
  // arredonda para múltiplos de 500 Kz (valor "redondo" e fácil de comunicar)
  finalPrice = Math.round(finalPrice / 500) * 500;

  return {
    basePrice: pricing.base,
    complexityScore: Number(complexityScore.toFixed(2)),
    finalPrice,
    minPrice: pricing.min,
    maxPrice: pricing.max,
  };
}

/**
 * Gera o link codificado do WhatsApp com uma mensagem pré-preenchida,
 * apontando para o número oficial da Fronex.
 */
export function buildWhatsAppLink(params: {
  serviceType: string;
  finalPrice: number;
  clientName?: string;
}): string {
  const phone = '244946419129'; // +244 946 419 129, sem símbolos
  const label = SERVICE_LABELS[params.serviceType] ?? params.serviceType;
  const greeting = params.clientName ? `Olá, sou ${params.clientName}.` : 'Olá!';

  const text =
    `${greeting} Fiz uma simulação no site da FRONEX para "${label}" ` +
    `e o orçamento estimado foi de ${params.finalPrice.toLocaleString('pt-AO')} Kz. ` +
    `Gostaria de conversar sobre este projecto.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
