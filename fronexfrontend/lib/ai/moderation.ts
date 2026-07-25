export const FRONEX_CONDUCT_REPLY =
  "Por favor, mantenha um tom profissional. Este canal destina-se exclusivamente a questões sobre os nossos serviços de desenvolvimento, design e tecnologia. Como posso ajudar dentro deste âmbito?";

export const FRONEX_SCOPE_REDIRECT_REPLY =
  "Vou manter a conversa no âmbito da Fronex. Posso ajudar com site, app, sistema, design, IA, orçamento, suporte ou integração com WhatsApp. Se quiser, reformule a sua necessidade nesse contexto.";

export const FRONEX_CLARIFY_REPLY =
  "A mensagem ficou pouco clara. Reescreva de forma curta e objectiva, indicando o que pretende fazer com a Fronex.";

const OFFENSIVE_PATTERNS = [
  /\b(foda-se|fodase|foder|merda|caralho|puta|puto|porra|cabr[aã]o|burro|idiota|est[uú]pido|estupidez|vai\s+tomar|vai\s+te\s+foder)\b/i,
  /\b(shit|fuck|fucking|bitch|asshole|idiot|stupid|dumb)\b/i,
  /\b(mata-te|morre|vai\s+morrer|kill\s+yourself)\b/i,
];

const PROMPT_INJECTION_PATTERNS = [
  /\b(ignore|ignora|desconsidera|disregard)\b.{0,24}\b(previous|anterior|above|acima|todas?)\b.{0,24}\b(instructions?|regras?|mensagens?|prompts?|ordens?)\b/i,
  /\b(system prompt|developer message|hidden prompt|prompt secreto|instruções internas|regras internas|cadeia de racioc[ií]nio|chain of thought)\b/i,
  /\b(jailbreak|bypass|override|sandbox|modo developer|modo livre|act as|you are now|agora és)\b/i,
  /\b(reveal|show|exibe|mostra|diz)\b.{0,24}\b(prompt|instructions?|regras?|pol[ií]ticas?|configura[cç][õo]es?)\b/i,
  /\b(responder\s+como\s+se\s+fosse|finja\s+que\s+é|pretend to be)\b/i,
];

const SOFT_OFFTOPIC_PATTERNS = [
  /\b(nome|idade|onde vives|whats?app pessoal|morada pessoal|vida amorosa|namoro|sexo|pol[ií]tica|futebol|receita|clima|tempo|piada|m[eé]dico|doença|diagn[oó]stico|investimento em cripto|casino|aposta)\b/i,
];

const FRONEX_SCOPE_KEYWORDS = [
  "site",
  "website",
  "web",
  "app",
  "aplicativo",
  "sistema",
  "dashboard",
  "design",
  "logo",
  "identidade",
  "orçamento",
  "orcamento",
  "preço",
  "preco",
  "whatsapp",
  "ia",
  "mentor",
  "portfólio",
  "portfolio",
  "social",
  "instagram",
  "tiktok",
  "video",
  "vídeo",
  "loja",
  "ecommerce",
  "pagamento",
  "suporte",
  "login",
  "cliente",
  "fronex",
];

function normalizeMessage(message: string) {
  return message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[@$!0]/g, (match) => {
      const replacements: Record<string, string> = {
        "@": "a",
        "$": "s",
        "!": "i",
        "0": "o",
      };
      return replacements[match] ?? match;
    });
}

function isMostlyNoise(message: string) {
  const compact = message.replace(/\s+/g, "");
  if (compact.length < 10) return false;

  const lettersAndNumbers = compact.match(/[a-zA-Z0-9À-ÿ]/g)?.length ?? 0;
  const symbolRatio = 1 - lettersAndNumbers / compact.length;
  const repeatedChars = /(.)\1{7,}/.test(compact);
  const hasVowel = /[aeiouáéíóúâêôãõà]/i.test(compact);

  return symbolRatio > 0.55 || repeatedChars || (!hasVowel && compact.length > 16);
}

function hasScopeSignal(message: string) {
  return FRONEX_SCOPE_KEYWORDS.some((keyword) => message.includes(keyword));
}

export type ModerationAction =
  | {
      blocked: true;
      reason: "offensive_language" | "prompt_injection" | "low_signal_message";
      reply: string;
    }
  | {
      blocked: false;
      reason: "off_topic" | null;
      reply?: string;
    };

export function detectConductViolation(message: string): ModerationAction {
  const normalized = normalizeMessage(message);
  const offensive = OFFENSIVE_PATTERNS.some((pattern) => pattern.test(normalized));
  const injection = PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(normalized));
  const noisy = isMostlyNoise(message);

  if (offensive) {
    return { blocked: true, reason: "offensive_language", reply: FRONEX_CONDUCT_REPLY };
  }

  if (injection) {
    return { blocked: true, reason: "prompt_injection", reply: FRONEX_CONDUCT_REPLY };
  }

  if (noisy) {
    return { blocked: true, reason: "low_signal_message", reply: FRONEX_CLARIFY_REPLY };
  }

  const offTopic = normalized.length >= 28 && !hasScopeSignal(normalized) && SOFT_OFFTOPIC_PATTERNS.some((pattern) => pattern.test(normalized));

  if (offTopic) {
    return { blocked: false, reason: "off_topic", reply: FRONEX_SCOPE_REDIRECT_REPLY };
  }

  return { blocked: false, reason: null };
}
