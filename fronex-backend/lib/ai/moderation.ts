export const FRONEX_CONDUCT_REPLY =
  "Por favor, mantenha um tom profissional. Este canal destina-se exclusivamente a questões sobre os nossos serviços de desenvolvimento, design e tecnologia. Como posso ajudar dentro deste âmbito?";

const OFFENSIVE_PATTERNS = [
  /\b(foda-se|foder|fodase|merda|caralho|puta|puto|porra|cabr[aã]o|burro|idiota|est[uú]pido|estupidez|vai\s+tomar|vai\s+te\s+foder)\b/i,
  /\b(shit|fuck|fucking|bitch|asshole|idiot|stupid|dumb)\b/i,
  /\b(mata-te|morre|vai\s+morrer|kill\s+yourself)\b/i,
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

export function detectConductViolation(message: string) {
  const normalized = normalizeMessage(message);
  const offensive = OFFENSIVE_PATTERNS.some((pattern) => pattern.test(normalized));
  const noisy = isMostlyNoise(message);

  return {
    blocked: offensive || noisy,
    reason: offensive ? "offensive_language" : noisy ? "low_signal_message" : null,
  };
}
