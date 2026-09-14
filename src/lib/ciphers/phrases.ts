const WORDS = [
  "able", "acid", "after", "again", "air", "all", "also", "amber", "and", "apple",
  "arm", "ask", "away", "badge", "bag", "ball", "barn", "be", "beach", "bear",
  "bed", "bell", "best", "big", "bird", "black", "blue", "boat", "book", "box",
  "bread", "brick", "bright", "brook", "brown", "button", "cake", "camp", "can",
  "candle", "card", "cat", "chair", "chalk", "circle", "city", "clear", "clock",
  "cloud", "coat", "cold", "come", "copper", "corn", "could", "creek", "cup",
  "dark", "day", "desk", "dog", "door", "down", "draw", "dream", "drink", "drop",
  "dry", "duck", "dust", "each", "early", "earth", "east", "easy", "eat", "edge",
  "egg", "eight", "empty", "end", "even", "every", "eye", "face", "fall", "far",
  "farm", "fast", "field", "find", "fire", "first", "fish", "five", "flag", "flat",
  "floor", "flower", "fly", "fog", "for", "forest", "four", "fox", "free", "from",
  "frost", "full", "gate", "gift", "give", "glass", "gold", "good", "grain", "grass",
  "green", "ground", "grow", "hand", "happy", "hard", "hat", "have", "head", "hear",
  "heat", "help", "here", "high", "hill", "hold", "home", "hope", "horse", "hot",
  "house", "ice", "ink", "into", "iron", "island", "jump", "just", "keep", "key",
  "kind", "king", "kit", "lake", "lamp", "land", "large", "last", "late", "leaf",
  "left", "lemon", "let", "letter", "light", "like", "line", "lion", "list", "little",
  "live", "lock", "long", "look", "lost", "loud", "love", "low", "luck", "made",
  "make", "map", "mark", "may", "meadow", "milk", "mint", "mist", "moon", "more",
  "morning", "most", "mouse", "move", "much", "must", "name", "near", "need", "nest",
  "new", "next", "night", "nine", "north", "not", "note", "now", "oak", "ocean",
  "off", "old", "open", "orange", "other", "our", "out", "over", "owl", "own",
  "page", "paint", "paper", "park", "part", "path", "pen", "people", "pick", "pine",
  "place", "plain", "plant", "play", "please", "pond", "port", "post", "press",
  "pretty", "pull", "put", "quiet", "rain", "read", "red", "rest", "rich", "ride",
  "right", "river", "road", "rock", "room", "rope", "round", "row", "run", "safe",
  "said", "salt", "same", "sand", "save", "say", "school", "sea", "see", "seed",
  "send", "seven", "shade", "shape", "sharp", "sheep", "shell", "ship", "shop",
  "short", "show", "side", "sign", "silk", "silver", "sing", "six", "sky", "sleep",
  "slow", "small", "smile", "snow", "soft", "some", "song", "soon", "sound", "south",
  "space", "speak", "spring", "star", "start", "stay", "step", "still", "stone",
  "stop", "storm", "story", "street", "strong", "such", "sun", "sweet", "table",
  "take", "talk", "tall", "tea", "tell", "ten", "than", "thank", "that", "the",
  "them", "then", "there", "these", "they", "thing", "think", "this", "those",
  "three", "through", "time", "tiny", "to", "today", "together", "told", "too",
  "top", "town", "tree", "true", "try", "turn", "under", "until", "upon", "use",
  "very", "view", "visit", "wait", "walk", "wall", "want", "warm", "wash", "watch",
  "water", "wave", "way", "we", "week", "well", "west", "what", "when", "where",
  "which", "white", "who", "wide", "wild", "will", "wind", "window", "winter",
  "wish", "with", "wolf", "wood", "word", "work", "world", "write", "yard", "year",
  "yellow", "yes", "you", "young", "your", "zinc",
];

function pick<T>(list: T[], used: Set<T>): T {
  for (let i = 0; i < 12; i++) {
    const item = list[Math.floor(Math.random() * list.length)];
    if (!used.has(item)) {
      used.add(item);
      return item;
    }
  }
  return list[Math.floor(Math.random() * list.length)];
}

/** Random short phrase so sentence shape does not leak the answer. */
export function randomPhrase(wordCount?: number): string {
  const count = wordCount ?? 4 + Math.floor(Math.random() * 5);
  const used = new Set<string>();
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(pick(WORDS, used));
  }
  return words.join(" ");
}

export function randomLetter(except?: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let ch = alphabet[Math.floor(Math.random() * alphabet.length)];
  if (except && alphabet.length > 1) {
    while (ch === except.toUpperCase()) {
      ch = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
  return ch;
}

export function normalizeGuess(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function choiceDistractors(answer: string, count: number): string[] {
  const wordCount = answer.trim().split(/\s+/).length;
  const out: string[] = [];
  const seen = new Set([normalizeGuess(answer)]);
  while (out.length < count) {
    const phrase = randomPhrase(wordCount);
    const key = normalizeGuess(phrase);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(phrase);
  }
  return out;
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
