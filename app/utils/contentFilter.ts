// Lightweight profanity + spam filtering for blog comments. This is
// intentionally basic — it catches the obvious cases without pretending to be
// a full moderation system. Auto-imported by Nuxt from `app/utils`.

const PROFANITY = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "dick",
  "piss",
  "cunt",
  "slut",
  "whore",
  "nigger",
  "faggot",
  "retard",
];

// Match any profanity as a whole word, case-insensitive. The word boundaries
// keep innocent substrings (e.g. "classic", "assassin") from being flagged.
const profanityRe = new RegExp(`\\b(${PROFANITY.join("|")})\\b`, "gi");

export const containsProfanity = (text: string) => profanityRe.test(text);

/** Replace any profane word with asterisks of the same length. */
export const censorProfanity = (text: string) =>
  text.replace(profanityRe, (word) => "*".repeat(word.length));

export interface SpamCheck {
  isSpam: boolean;
  reason?: string;
}

/** Heuristic spam detection. Returns the first rule that trips, if any. */
export const checkSpam = (text: string): SpamCheck => {
  const trimmed = text.trim();

  // Too many links is the classic comment-spam signature.
  const linkCount = (trimmed.match(/https?:\/\/|www\./gi) || []).length;
  if (linkCount > 2) {
    return { isSpam: true, reason: "Too many links — looks like spam." };
  }

  // Long runs of the same character ("aaaaaaaaaa", "!!!!!!!!!!").
  if (/(.)\1{9,}/.test(trimmed)) {
    return { isSpam: true, reason: "Looks like spam (repeated characters)." };
  }

  // The same word repeated many times in a row.
  if (/\b(\w+)\b(?:\s+\1\b){5,}/i.test(trimmed)) {
    return { isSpam: true, reason: "Looks like spam (repeated words)." };
  }

  // Shouting: mostly uppercase in a reasonably long message.
  const letters = trimmed.replace(/[^a-z]/gi, "");
  if (letters.length > 20) {
    const upper = trimmed.replace(/[^A-Z]/g, "").length;
    if (upper / letters.length > 0.7) {
      return { isSpam: true, reason: "Looks like spam (excessive caps)." };
    }
  }

  return { isSpam: false };
};
