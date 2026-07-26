import path from "path";
import { readFileSync, readdirSync, existsSync } from "fs";

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
  "Responde em português de Angola (pt-AO), com tom profissional, claro e útil. Usa estrutura em Markdown quando for texto.";

export const TOOL_TEMPLATES: Record<ToolKey, ToolTemplate> = {
  "school-work": {
    title: "Trabalho Escolar",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs. Gera trabalhos escolares angolanos com capa, índice, introdução, desenvolvimento, conclusão e referências.
Se houver dados de escola, disciplina, classe, professor, autores, província ou município, incorpora-os. Mantém linguagem académica acessível.`,
  },
  cv: {
    title: "Currículo Profissional",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para CVs. Cria currículo profissional, directo e moderno, com perfil, experiência, formação, competências e contactos.
Adapta ao mercado angolano e evita exageros genéricos.`,
  },
  request: {
    title: "Requerimento Oficial",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para requerimentos administrativos angolanos. Usa linguagem formal: Exmo., vem mui respeitosamente requerer, nestes termos pede deferimento.
Inclui destinatário, assunto, identificação, fundamento e local/data quando existirem.`,
  },
  "formal-letter": {
    title: "Carta Formal",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para cartas formais. Escreve cartas de pedido, reclamação, motivação, solicitação, agradecimento ou recomendação.
Mantém estrutura com local/data, destinatário, assunto, corpo e despedida.`,
  },
  invitation: {
    title: "Convite",
    output: "document",
    system: `${BASE_STYLE}
És a IA da Fronex Docs para convites. Cria textos elegantes para aniversários, formaturas, eventos empresariais e encontros especiais.
Inclui data, local, tom, confirmação e mensagem curta quando os dados existirem.`,
  },
  docs: {
    title: "Fronex Docs",
    output: "document",
    system: `${BASE_STYLE}
És a IA do Fronex Docs. Lês a intenção do utilizador, escolhes o modelo local mais próximo e nunca crias estrutura totalmente do zero se houver modelo correspondente.
Faz perguntas de paginação, conteúdo e formato quando faltar informação crítica; quando houver dados suficientes, gera o documento completo.`,
  },
  "site-builder": {
    title: "Fronex Site Builder",
    output: "site",
    system: `${BASE_STYLE}
És a IA do Fronex Site Builder. Gera sites responsivos usando primeiro um template correspondente. Nunca inventes layout do zero quando existir template base.
Devolve apenas JSON válido com as chaves html, css, js e notes. O HTML deve ligar style.css e script.js. Usa paleta profissional e copy pronta.`,
  },
  assistant: {
    title: "Assistente IA",
    output: "assistant",
    system: `${BASE_STYLE}
És o assistente educacional e documental da Fronex Docs. Ajudas com disciplinas, estrutura de trabalhos, documentos escolares, CVs, requerimentos, cartas e convites.
Sê didáctico, objectivo e adequado ao contexto angolano.`,
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
    return "Pasta local de templates nao encontrada. Usar apenas modelos internos Fronex.";
  }

  const files = readdirSync(dir).filter((file) => /\.(html|docx?|txt|md)$/i.test(file));
  const htmlPath = path.join(dir, "temple.html");
  let htmlSignals = "";

  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, "utf8");
    const matches = html.match(
      /(Trabalhos Escolares|Currículos \(CV\)|Requerimentos|Cartas Formais|Convites|Assistente IA|Capa Oficial|Índice|Introdução|Desenvolvimento|Conclusão|Referências|Padrão Angola)/g
    );
    htmlSignals = Array.from(new Set(matches ?? [])).join(", ");
  }

  return `Templates locais disponíveis: ${files.join(", ") || "nenhum"}. Sinais estruturais do temple.html: ${htmlSignals || "dashboard, documentos, assistente IA"}.`;
}
