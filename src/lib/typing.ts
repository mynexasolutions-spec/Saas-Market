// Shared by the /typing-test page and /api/typing so both score a run identically.

export const DURATIONS = [30, 45, 60] as const;
export type Duration = (typeof DURATIONS)[number];
export const DEFAULT_DURATION: Duration = 30;

// The score visitors are challenged to beat. Edit here to change the pinned benchmark.
// The team's fixed score. It is the floor of the "score to beat" until someone on the board goes past it.
export const BENCHMARK = { name: "SaaS MRKT Team", wpm: 53 };

// The score to beat for one test length: the team's, or the board leader's once they are faster.
export interface Bench {
  name: string;
  wpm: number;
  team: boolean;
}

export function resolveBench(record: { name: string; wpm: number } | null | undefined): Bench {
  if (record && record.wpm > BENCHMARK.wpm) return { name: record.name, wpm: record.wpm, team: false };
  return { name: BENCHMARK.name, wpm: BENCHMARK.wpm, team: true };
}

export const MAX_WPM = 250;
export const MAX_KEYS_PER_SECOND = 25;

export function isDuration(value: unknown): value is Duration {
  return DURATIONS.some((d) => d === value);
}

export function cleanName(raw: string): string {
  return raw.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim();
}

export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 30;
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export interface Score {
  wpm: number;
  rawWpm: number;
  accuracy: number;
}

// Net WPM counts only correct characters (5 chars = 1 word); raw WPM counts every keystroke.
export function computeScore(
  seconds: number,
  correctChars: number,
  correctKeystrokes: number,
  totalKeystrokes: number,
): Score {
  const minutes = seconds / 60;
  return {
    wpm: Math.round((correctChars / 5 / minutes) * 10) / 10,
    rawWpm: Math.round((totalKeystrokes / 5 / minutes) * 10) / 10,
    accuracy: totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10 : 0,
  };
}

const COMMON_WORDS = (
  "the of and to in it that for with as not on at by this we you do but from or which one would all will there say who " +
  "make when can more if no out other so what time up go about than into could only new some take come these know see " +
  "use get like then first any work now may such give over think most even find day also after way many must look " +
  "before great back through long where much should well people down own just because good each those feel seem how " +
  "high too place little world very still hand life tell write become here show house both between need mean call " +
  "under last right move thing same another begin while number part turn real leave might want point form small ask " +
  "late home large open follow during present again hold around possible head word program problem lead system set " +
  "order plan run keep face fact group play stand early course change help"
).split(" ");

const SAAS_WORDS = (
  "pricing vendor license dashboard startup revenue billing product software cloud subscription deploy launch growth " +
  "market buyer seller trial support security analytics workflow integrate customer invoice scale team tool review " +
  "compare deal listing checkout renewal seats churn onboard platform feature data export secure monthly annual " +
  "discount trusted verified marketplace"
).split(" ");

const WORD_POOL = [...COMMON_WORDS, ...SAAS_WORDS];

export interface WordOptions {
  punctuation?: boolean;
  numbers?: boolean;
}

// A number token of 1 to 4 digits, never starting with zero.
function randomNumber(): string {
  const digits = 1 + Math.floor(Math.random() * 4);
  let out = String(1 + Math.floor(Math.random() * 9));
  for (let i = 1; i < digits; i++) out += Math.floor(Math.random() * 10);
  return out;
}

// Monkeytype-style punctuation: sentences start with a capital, and words randomly gain
// commas, full stops, question and exclamation marks, quotes, brackets and apostrophes.
function punctuate(words: string[]): string[] {
  let capitalizeNext = true;
  return words.map((raw) => {
    let word = raw;
    if (capitalizeNext) word = word.charAt(0).toUpperCase() + word.slice(1);
    capitalizeNext = false;
    const plain = !/^\d/.test(word);
    const wrap = Math.random();
    if (plain) {
      if (wrap < 0.07) word = `"${word}"`;
      else if (wrap < 0.11) word = `(${word})`;
      else if (wrap < 0.14) word = `${word}'s`;
    }
    const end = Math.random();
    if (end < 0.1) word += ",";
    else if (end < 0.18) {
      word += ".";
      capitalizeNext = true;
    } else if (end < 0.21) {
      word += "?";
      capitalizeNext = true;
    } else if (end < 0.23) {
      word += "!";
      capitalizeNext = true;
    } else if (end < 0.25) word += ";";
    else if (end < 0.27) word += ":";
    return word;
  });
}

export function generateWords(count: number, options: WordOptions = {}): string[] {
  const out: string[] = [];
  let last = "";
  while (out.length < count) {
    const word = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    if (word === last) continue;
    out.push(word);
    last = word;
  }
  const withNumbers = options.numbers ? out.map((w) => (Math.random() < 0.2 ? randomNumber() : w)) : out;
  return options.punctuation ? punctuate(withNumbers) : withNumbers;
}

// ---------- Test modes (Monkeytype-style) ----------

export type Mode = "time" | "words" | "quote";
export const MODES: Mode[] = ["time", "words", "quote"];
export const WORD_COUNTS = [10, 25, 50, 100] as const;
export type WordCount = (typeof WORD_COUNTS)[number];
export type StopOnError = "off" | "word" | "letter";
export const STOP_ON_ERROR: StopOnError[] = ["off", "word", "letter"];

export interface TestConfig {
  mode: Mode;
  duration: Duration;
  wordCount: WordCount;
  punctuation: boolean;
  numbers: boolean;
  stopOnError: StopOnError;
}

export const DEFAULT_CONFIG: TestConfig = {
  mode: "time",
  duration: DEFAULT_DURATION,
  wordCount: 25,
  punctuation: false,
  numbers: false,
  stopOnError: "off",
};

// Only plain timed tests are comparable, so only they reach the leaderboard.
export function isRanked(config: TestConfig): boolean {
  return config.mode === "time" && !config.punctuation && !config.numbers && config.stopOnError === "off";
}

export function configLabel(config: TestConfig): string {
  if (config.mode === "time") return `${config.duration}s`;
  if (config.mode === "words") return `${config.wordCount} words`;
  return "Quote";
}

// e.g. "time 30 · punctuation · numbers · stop on word"
export function configDetail(config: TestConfig): string {
  const parts: string[] = [];
  if (config.mode === "time") parts.push(`time ${config.duration}`);
  else if (config.mode === "words") parts.push(`words ${config.wordCount}`);
  else parts.push("quote");
  if (config.mode !== "quote") {
    if (config.punctuation) parts.push("punctuation");
    if (config.numbers) parts.push("numbers");
  }
  if (config.stopOnError !== "off") parts.push(`stop on ${config.stopOnError}`);
  return parts.join(" · ");
}

// Personal bests are tracked per distinct test setup.
export function configKey(config: TestConfig): string {
  const amount = config.mode === "time" ? config.duration : config.mode === "words" ? config.wordCount : 0;
  const flags = config.mode === "quote" ? "" : `${config.punctuation ? "p" : ""}${config.numbers ? "n" : ""}`;
  return `${config.mode}-${amount}-${flags}-${config.stopOnError}`;
}

const QUOTES = [
  "Great software is not built in a day, but a great product is shipped one small release at a time.",
  "Every renewal is a vote of confidence, so make sure your customers have a reason to say yes again.",
  "The best tool is the one your team actually uses, not the one with the longest list of features.",
  "Measure what matters, cut what does not, and keep the stack simple enough to explain on one page.",
  "A fast checkout, a clear price and honest reviews turn a curious visitor into a loyal customer.",
  "Before you buy another license, check how many seats are sitting idle in the software you already pay for.",
  "Small teams move quickly when the tools stay out of the way and the goals are written down.",
  "Practice does not need to be perfect, it only needs to be regular, and speed will follow accuracy.",
  "Good vendors answer questions before they are asked, and great ones fix problems before anyone notices.",
  "Typing is a craft: slow down to be accurate, then let rhythm carry you the rest of the way.",
];

// The words a run is typed from. Timed runs get a long pool that grows as you type.
export function buildWords(config: TestConfig, timedPool = 120): string[] {
  const options = { punctuation: config.punctuation, numbers: config.numbers };
  if (config.mode === "quote") return QUOTES[Math.floor(Math.random() * QUOTES.length)].split(" ");
  if (config.mode === "words") return generateWords(config.wordCount, options);
  return generateWords(timedPool, options);
}

// ---------- Result analysis ----------

export interface Sample {
  t: number; // seconds into the run
  wpm: number; // net WPM so far
  raw: number; // raw WPM over the last second
  errors: number; // mistakes made in the last second
}

export interface CharStats {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

// Monkeytype's breakdown: correct / incorrect / extra / missed. Correct includes the space
// after every exactly-typed word, matching how net WPM is counted.
export function charStats(words: string[], typed: string[], current: string): CharStats {
  const stats: CharStats = { correct: 0, incorrect: 0, extra: 0, missed: 0 };
  const tally = (word: string, input: string, completed: boolean) => {
    const shared = Math.min(word.length, input.length);
    for (let i = 0; i < shared; i++) {
      if (input[i] === word[i]) stats.correct++;
      else stats.incorrect++;
    }
    stats.extra += Math.max(0, input.length - word.length);
    if (completed) stats.missed += Math.max(0, word.length - input.length);
  };
  for (let i = 0; i < typed.length; i++) {
    tally(words[i] ?? "", typed[i], true);
    if (typed[i] === words[i]) stats.correct++; // the trailing space
  }
  if (current) tally(words[typed.length] ?? "", current, false);
  return stats;
}

// Monkeytype's consistency: 100 means perfectly steady speed, lower means a bumpier run.
export function consistencyScore(values: number[]): number {
  if (values.length < 2) return 100;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  if (mean <= 0) return 0;
  const sd = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length);
  const cov = sd / mean;
  const score = 100 * (1 - Math.tanh(cov + cov ** 3 / 3 + cov ** 5 / 5));
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Characters that count toward net WPM: every letter of an exactly-typed word plus its
// trailing space, and the matching letters of the word currently being typed.
export function scoreChars(words: string[], typed: string[], current: string): number {
  let total = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === words[i]) total += words[i].length + 1;
  }
  const target = words[typed.length] ?? "";
  for (let i = 0; i < current.length && i < target.length; i++) {
    if (current[i] === target[i]) total++;
  }
  return total;
}
