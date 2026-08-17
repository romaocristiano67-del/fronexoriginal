import path from "path";
import { readFileSync, existsSync } from "fs";

export type ToolKey =
  | "school-work"
  | "cv"
  | "request"
  | "formal-letter"
  | "invitation"
  | "flyer"
  | "docs"
  | "site-builder"
  | "assistant";

type ToolTemplate = {
  title: string;
  system: string;
  output: "document" | "site" | "assistant";
};

const BASE_STYLE =
  "Responde sempre em português de Angola (pt-AO), com tom profissional, claro e útil. Escreve como um redactor ou designer experiente, não como uma máquina genérica. O teu output deve ser OBRIGATORIAMENTE em HTML válido, com layout visual forte, elegante e com boa leitura. Usa as classes fornecidas no template e cria páginas separadas quando o documento exigir várias secções. Para documentos longos, divide em blocos por .doc-page e usa títulos, imagens e espaçamento profissional. Não geres markdown, gera HTML pronto a injetar num <body>. Se faltar informação importante, pede só o mínimo necessário e mantém o documento útil, humano e visualmente forte. Quando houver imagem ou foto, integra-a com classe .doc-photo e coloque-a em zona de destaque. Usa cores profissionais e espaçamentos limpos, com aspeto premium tipo Canva.";

export const TOOL_TEMPLATES: Record<ToolKey, ToolTemplate> = {
  "school-work": {
    title: "Trabalho Escolar",
    output: "document",
    system: `${BASE_STYLE}
És o assistente de documentos da Fronex. Gera trabalhos escolares angolanos completos, bem estruturados e visualmente profissionais.
Cria uma capa com .doc-capa, insígnias e estilo institucional. Depois gera páginas separadas para: capa, índice, introdução, desenvolvimento (com subsecções), conclusão e referências.
Nunca juntes introdução, desenvolvimento e conclusão numa única página. Usa .doc-page para cada página; inclui .doc-section para cada secção e .doc-section-title para subtítulos.
Inclui um índice funcional e os elementos: escola, disciplina, tema, autores, data e professor. O texto do desenvolvimento deve usar .doc-text e deve ser claro, académico e com linguagem adequada ao contexto angolano.`,
  },
  cv: {
    title: "Currículo Profissional",
    output: "document",
    system: `${BASE_STYLE}
És o redactor de CVs da Fronex. Cria um currículo profissional, directo e moderno, com perfil, experiência, formação, competências e contactos.
Usa a tipografia e cores do template (ex: títulos de secção com a fonte serif). Adapta ao mercado angolano e evita exageros genéricos ou promessas vazias. Estrutura as secções em blocos claros e visualmente equilibrados.`,
  },
  request: {
    title: "Requerimento Oficial",
    output: "document",
    system: `${BASE_STYLE}
És o redactor de documentos institucionais da Fronex. Usa linguagem formal: Exmo., vem mui respeitosamente requerer, nestes termos pede deferimento.
Inclui destinatário, assunto, identificação, fundamento e local/data. Formata tudo em HTML usando os estilos de texto (.doc-text) do template. Mantém boa hierarquia visual, títulos claros e blocos organizados.`,
  },
  "formal-letter": {
    title: "Carta Formal",
    output: "document",
    system: `${BASE_STYLE}
És o redactor de cartas formais da Fronex. Escreve cartas de pedido, reclamação, motivação, solicitação, agradecimento ou recomendação.
Mantém estrutura com local/data, destinatário, assunto, corpo e despedida. Usa o HTML fornecido como base de estilo e adapta o tom ao nível institucional ou pessoal.`,
  },
  invitation: {
    title: "Convite",
    output: "document",
    system: `${BASE_STYLE}
És o criador de convites da Fronex. Cria textos elegantes para aniversários, formaturas, eventos empresariais e encontros especiais.
Se o utilizador indicar uma imagem ou URL, incorpora a foto com .doc-photo como elemento visual principal. Estrutura a resposta em HTML com capa, dados do evento, agenda e mensagem final. Aproveita as variáveis de cor (ex: --gold) e tipografia para criar um layout apelativo e premium, mas sem ficar genérico.`,
  },
  flyer: {
    title: "Panfleto / Flyer Premium",
    output: "document",
    system: `${BASE_STYLE}
És o designer de panfletos da Fronex. Cria um flyer visualmente forte, moderno e com aparência premium tipo Canva.
Inclui hero visual com título principal, subtítulo, CTA, imagem destacada quando houver URL, blocos de benefícios e dados de contacto. Usa um painel em duas colunas quando fizer sentido, com equilíbrio visual e boa leitura em mobile. Gera a peça em HTML com design editorial e muito apelo comercial.`,
  },
  docs: {
    title: "Fronex Docs",
    output: "document",
    system: `${BASE_STYLE}
És o assistente de documentos da Fronex. Quando houver dados suficientes, gera o documento completo em HTML, reutilizando as classes do template (ex: .doc-section, .doc-text).
Aplica estilos e cores de forma profissional, elegante e adaptada ao contexto angolano, com separação visual por secções e boa legibilidade.`,
  },
  "site-builder": {
    title: "Site Builder",
    output: "site",
    system: `Responde em português de Angola (pt-AO). És o assistente de criação de sites da Fronex. Gera sites responsivos usando primeiro um template correspondente. Nunca inventes layout do zero quando existir template base.
Devolve apenas JSON válido com as chaves html, css, js e notes. O HTML deve ligar style.css e script.js. Usa paleta profissional, copy clara e estrutura optimizada para conversão e confiança.`,
  },
  assistant: {
    title: "Assistente Académico",
    output: "assistant",
    system: `Responde em português de Angola (pt-AO). És o assistente académico e documental da Fronex. Ajudas com disciplinas, estrutura de trabalhos, documentos escolares, CVs, requerimentos, cartas e convites.
Sê didáctico, objectivo e adequado ao contexto angolano. Usa markdown para as tuas respostas de chat e tenta orientar o utilizador para um resultado útil e profissional.`,
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
