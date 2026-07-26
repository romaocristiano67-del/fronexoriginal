import path from "path";
import { readFileSync, existsSync } from "fs";

export type ToolKey =
  | "school-work"
  | "cv"
  | "request"
  | "formal-letter"
  | "invitation"
  | "docs"
  | "site-builder"
  | "assistant";

type ToolTemplate = {
  title: string;
  system: string;
  output: "document" | "site" | "assistant";
};

const BASE_STYLE =
  "Responde sempre em português de Angola (pt-AO), com tom profissional, claro e útil. O teu output deve ser OBRIGATORIAMENTE em HTML válido, utilizando o CSS e a estrutura fornecida no contexto (Sora, Instrument Serif, cores --red, --gold, etc). Não geres markdown, gera HTML pronto a injetar num <body>. Usa as classes fornecidas no template.";

export const TOOL_TEMPLATES: Record<ToolKey, ToolTemplate> = {
  "school-work": {
    title: "Trabalho Escolar",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs. Gera trabalhos escolares angolanos com capa, índice, introdução, desenvolvimento, conclusão e referências.
Utiliza a classe .doc-capa para a capa, inclui a tag <img src="/insignia-angola.png" alt="Insígnia de Angola"> dentro de .doc-brasao.
Usa as classes: .doc-escola, .doc-disciplina, .doc-tema, .doc-autores.
Separa as secções com a classe .doc-section e os títulos com .doc-section-title.
O texto do desenvolvimento deve usar a classe .doc-text.`,
  },
  cv: {
    title: "Currículo Profissional",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para CVs. Cria currículo profissional, directo e moderno, com perfil, experiência, formação, competências e contactos.
Usa a tipografia e cores do template (ex: títulos de secção com a fonte serif). Adapta ao mercado angolano e evita exageros genéricos.`,
  },
  request: {
    title: "Requerimento Oficial",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para requerimentos administrativos angolanos. Usa linguagem formal: Exmo., vem mui respeitosamente requerer, nestes termos pede deferimento.
Inclui destinatário, assunto, identificação, fundamento e local/data. Formata tudo em HTML usando os estilos de texto (.doc-text) do template.`,
  },
  "formal-letter": {
    title: "Carta Formal",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para cartas formais. Escreve cartas de pedido, reclamação, motivação, solicitação, agradecimento ou recomendação.
Mantém estrutura com local/data, destinatário, assunto, corpo e despedida. Usa o HTML fornecido como base de estilo.`,
  },
  invitation: {
    title: "Convite",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para convites. Cria textos elegantes para aniversários, formaturas, eventos empresariais e encontros especiais.
Estrutura a resposta em HTML, aproveitando as variáveis de cor (ex: --gold) e tipografia para criar um layout apelativo.`,
  },
  docs: {
    title: "Fronex Docs",
    output: "document",
    system: `${BASE_STYLE}
És a IA do Fronex Docs. Quando houver dados suficientes, gera o documento completo em HTML, reutilizando as classes do template (ex: .doc-section, .doc-text).
Aplica estilos e cores de forma profissional e sofisticada.`,
  },
  "site-builder": {
    title: "Fronex Site Builder",
    output: "site",
    system: `Responde em português de Angola (pt-AO). És a IA do Fronex Site Builder. Gera sites responsivos usando primeiro um template correspondente. Nunca inventes layout do zero quando existir template base.
Devolve apenas JSON válido com as chaves html, css, js e notes. O HTML deve ligar style.css e script.js. Usa paleta profissional e copy pronta.`,
  },
  assistant: {
    title: "Assistente IA",
    output: "assistant",
    system: `Responde em português de Angola (pt-AO). És o assistente educacional e documental da Fronex Docs. Ajudas com disciplinas, estrutura de trabalhos, documentos escolares, CVs, requerimentos, cartas e convites.
Sê didáctico, objectivo e adequado ao contexto angolano. Usa markdown para as tuas respostas de chat.`,
  },
};

export function readLocalTemplateSummary() {
  const candidates = [
    path.resolve(process.cwd(), "..", "temples servicos"),
    path.resolve(process.cwd(), "..", "..", "temples servicos"),
    path.resolve(process.cwd(), "temples servicos"),
  ];

  const dir = candidates.find((candidate) => existsSync(candidate));
  if (!dir) {
    return "Pasta local de templates nao encontrada. Utilize HTML limpo com bom design CSS in-line.";
  }

  const htmlPath = path.join(dir, "temple.html");
  if (!existsSync(htmlPath)) {
    return "Ficheiro temple.html não encontrado.";
  }

  const html = readFileSync(htmlPath, "utf8");
  
  // Extrair apenas o bloco de <style> para dar à IA o contexto visual completo
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const styles = styleMatch ? styleMatch[1].trim() : "";
  
  // Limitar o tamanho do CSS para não estourar o limite de tokens (mantém apenas as partes cruciais)
  // O CSS principal, variáveis de cor, e definições do doc-* (capa, brasão, text, etc)
  const relevantStyles = styles
    .split("\\n")
    .filter(line => !line.includes("nav ") && !line.includes(".sidebar") && !line.includes(".dashboard") && !line.includes(".plans-page") && !line.includes(".chat-"))
    .join("\\n")
    .substring(0, 3000);

  return `Regras de Estilo do Template (Usa estas classes OBRIGATORIAMENTE):\n` +
         `- .doc-capa (alinhar ao centro, capa do trabalho)\n` +
         `- .doc-brasao (container do logotipo/insignia)\n` +
         `- .doc-escola, .doc-disciplina, .doc-tema, .doc-autores (para campos da capa)\n` +
         `- .doc-section (container de uma secção de texto)\n` +
         `- .doc-section-title (título da secção, com borda inferior)\n` +
         `- .doc-text (texto justificado)\n\n` +
         `Variáveis CSS disponíveis e exemplos de classes:\n` +
         `${relevantStyles}\n\n` +
         `Gere APENAS o HTML do conteúdo do documento (sem tags <head>, <html> ou <body> externas, apenas as divs internas). O HTML gerado será inserido num container principal.`;
}
