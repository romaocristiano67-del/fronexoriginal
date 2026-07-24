// lib/whatsapp.ts
// Gera o link do WhatsApp com a mensagem formatada do orçamento.

const FRONEX_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_FRONEX_WHATSAPP_NUMBER ?? "244946419129"; // +244 946 419 129, sem símbolos

export interface OrderSummaryItem {
  question: string;
  answer: string;
}

export function buildWhatsAppMessage(params: {
  serviceTitle: string;
  items: OrderSummaryItem[];
  finalPrice: string;
  clientName?: string;
}): string {
  const { serviceTitle, items, finalPrice, clientName } = params;

  const lines = [
    "Olá Fronex! 👋 Gostaria de solicitar um orçamento.",
    "",
    `*Serviço:* ${serviceTitle}`,
    clientName ? `*Nome:* ${clientName}` : null,
    "",
    "*Resumo do pedido:*",
    ...items.map((item) => `• ${item.question}: ${item.answer}`),
    "",
    `*Orçamento estimado:* ${finalPrice}`,
    "",
    "Aguardo confirmação e próximos passos. Obrigado!",
  ].filter(Boolean);

  return lines.join("\n");
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${FRONEX_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildPremiumServiceRequestMessage(params: {
  serviceTitle: string;
  source: "portfolio" | "dashboard";
  clientEmail?: string;
  clientName?: string;
  userId?: string;
  status?: string;
}): string {
  const lines = [
    "Olá Fronex! Gostaria de avançar com um pedido premium.",
    "",
    `Serviço: ${params.serviceTitle}`,
    `Origem: ${params.source === "portfolio" ? "Portfólio do site" : "Dashboard do cliente"}`,
    params.status ? `Estado atual: ${params.status}` : "Estado pretendido: A aguardar verificação manual",
    params.clientName ? `Nome: ${params.clientName}` : null,
    params.clientEmail ? `Email: ${params.clientEmail}` : null,
    params.userId ? `ID do utilizador: ${params.userId}` : null,
    "",
    "Quero finalizar o pedido, receber as instruções de pagamento e aguardar a verificação manual pela equipa Fronex.",
  ].filter(Boolean);

  return lines.join("\n");
}
