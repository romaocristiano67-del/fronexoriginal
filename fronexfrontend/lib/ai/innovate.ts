/**
 * Validação exclusiva da aba "Criar e Inovar".
 * Não partilha regras com chat geral nem mentores.
 */

export type InnovateInputAssessment = {
  valid: boolean;
  reason?: "empty" | "too_short" | "noise" | "vague";
  clarification: string;
};

const VAGUE_ONLY = new Set([
  "oi",
  "ola",
  "olá",
  "hey",
  "hi",
  "hello",
  "ajuda",
  "help",
  "teste",
  "test",
  "ok",
  "sim",
  "nao",
  "não",
  "ideia",
  "ideia?",
  "plano",
  "??? ",
  "?",
  "??",
  "???",
]);

function compactUseful(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function assessInnovateIdea(raw: string): InnovateInputAssessment {
  const trimmed = raw.trim();
  const clarification = [
    "::badge[Clarificação necessária]",
    "",
    "A ideia ainda não está clara o suficiente para montar um plano.",
    "",
    "Em **uma frase**, indique:",
    "1. O que quer construir (site, app, sistema, marca…)",
    "2. Para quem é",
    "3. Qual resultado quer obter",
  ].join("\n");

  if (!trimmed) {
    return { valid: false, reason: "empty", clarification };
  }

  const useful = compactUseful(trimmed);
  const lettersOnly = useful.replace(/\s+/g, "");

  if (lettersOnly.length < 8 || lettersOnly.length <= 2) {
    return { valid: false, reason: "too_short", clarification };
  }

  if (VAGUE_ONLY.has(useful) || VAGUE_ONLY.has(lettersOnly)) {
    return { valid: false, reason: "vague", clarification };
  }

  // Ruído: poucas letras úteis vs muitos símbolos / repetição
  const uniqueChars = new Set(lettersOnly.split("")).size;
  if (lettersOnly.length >= 3 && uniqueChars <= 2) {
    return { valid: false, reason: "noise", clarification };
  }

  const words = useful.split(" ").filter(Boolean);
  if (words.length === 1 && words[0].length < 12) {
    return { valid: false, reason: "vague", clarification };
  }

  return { valid: true, clarification: "" };
}
