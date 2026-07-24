// lib/whatsapp.ts
// Gera o link do WhatsApp com a mensagem formatada do orçamento.

const FRONEX_WHATSAPP_NUMBER = "244946419129"; // +244 946 419 129, sem símbolos

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
