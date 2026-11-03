"use client";

import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import PageLayout from "@/components/PageLayout";
import "@/app/buyers/buyers-page.css";
import "./typing-test.css";
import {
  BENCHMARK,
  DEFAULT_CONFIG,
  DEFAULT_DURATION,
  DURATIONS,
  MODES,
  STOP_ON_ERROR,
  WORD_COUNTS,
  buildWords,
  charStats,
  cleanName,
  computeScore,
  configDetail,
  configKey,
  configLabel,
  consistencyScore,
  generateWords,
  isRanked,
  isValidEmail,
  isValidName,
  scoreChars,
  type CharStats,
  type Duration,
  type Sample,
  type TestConfig,
  type WordCount,
} from "@/lib/typing";

type Phase = "form" | "idle" | "running" | "done";

interface Result {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  errors: number;
  seconds: number; // timed length, or how long a words/quote run actually took
  label: string; // "30s", "25 words", "Quote"
  detail: string; // "time 30 · punctuation"
  ranked: boolean;
  duration: Duration; // the leaderboard tab this score belongs to when ranked
  chars: CharStats;
  consistency: number;
  samples: Sample[];
  pb: { best: number; isNew: boolean };
}

// Everything the typing engine mutates between renders; state only mirrors it for display.
interface Live {
  words: string[];
  typed: string[];
  current: string;
  correctKeys: number;
  totalKeys: number;
  startedAt: number;
  finished: boolean;
  cfg: TestConfig;
  samples: Sample[];
  second: number;
  secKeys: number;
  secErrors: number;
}

interface Submission {
  status: "saving" | "saved" | "error" | "skipped";
  message?: string;
  rank?: number;
  total?: number;
  best?: number;
  improved?: boolean;
}

interface BoardEntry {
  name: string;
  wpm: number;
  accuracy: number;
}

interface Board {
  duration: Duration;
  entries: BoardEntry[];
  total: number;
  error: boolean;
}

interface Row {
  name: string;
  wpm: number;
  accuracy: number | null;
  kind: "user" | "bench";
}

const STORAGE_KEY = "saasmrkt-typing-player";
const INITIAL_WORDS = 120;
const PB_KEY = "saasmrkt-typing-pb";
const MAX_EXTRA_LETTERS = 8;

type WordMode = "todo" | "active" | "done";

const Word = memo(function Word({ word, typed, mode }: { word: string; typed: string; mode: WordMode }) {
  const letters: React.ReactNode[] = [];
  const length = Math.max(word.length, typed.length);
  for (let i = 0; i < length; i++) {
    const extra = i >= word.length;
    const char = extra ? typed[i] : word[i];
    let cls = "tt-letter";
    if (i < typed.length) cls += typed[i] === word[i] ? " tt-ok" : " tt-bad";
    else if (mode === "done") cls += " tt-miss";
    if (extra) cls += " tt-extra";
    letters.push(
      <span key={i} className={cls}>
        {char}
      </span>,
    );
  }
  let wordCls = "tt-word";
  if (mode === "done" && typed !== word) wordCls += " tt-word-err";
  if (mode === "active") wordCls += " tt-word-active";
  return <span className={wordCls}>{letters}</span>;
});

function recordSamples(s: Live, elapsed: number) {
  const target = Math.floor(elapsed);
  while (s.second < target) {
    s.second += 1;
    const errors = s.totalKeys - s.correctKeys;
    s.samples.push({
      t: s.second,
      wpm: Math.round(scoreChars(s.words, s.typed, s.current) / 5 / (s.second / 60)),
      raw: Math.round((s.totalKeys - s.secKeys) * 12),
      errors: errors - s.secErrors,
    });
    s.secKeys = s.totalKeys;
    s.secErrors = errors;
  }
}

function subscribeNoop() {
  return () => {};
}

function readSavedPlayer(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return ""; // storage unavailable: start with an empty form
  }
}

function parseSavedPlayer(raw: string): { name: string; email: string } {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.name === "string" && typeof parsed?.email === "string") return parsed;
  } catch {
    /* empty or corrupted: ignore */
  }
  return { name: "", email: "" };
}

// `children` is the server-rendered SEO copy, shown below the test.
export default function TypingTestClient({ children }: { children?: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("form");
  const [config, setConfig] = useState<TestConfig>(DEFAULT_CONFIG);
  const duration = config.duration;
  // Saved details prefill the form; the draft only takes over once the visitor edits a field.
  const savedPlayer = useSyncExternalStore(subscribeNoop, readSavedPlayer, () => "");
  const saved = useMemo(() => parseSavedPlayer(savedPlayer), [savedPlayer]);
  const [nameDraft, setName] = useState<string | null>(null);
  const [emailDraft, setEmail] = useState<string | null>(null);
  const name = nameDraft ?? saved.name;
  const email = emailDraft ?? saved.email;
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});

  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAcc, setLiveAcc] = useState(100);
  const [focused, setFocused] = useState(true);
  const [runId, setRunId] = useState(0);

  const [result, setResult] = useState<Result | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  const [lbDuration, setLbDuration] = useState<Duration>(DEFAULT_DURATION);
  const [board, setBoard] = useState<Board | null>(null);
  const [boardKey, setBoardKey] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  // Source of truth for the engine; state mirrors it for rendering.
  const live = useRef<Live>({
    words: [],
    typed: [],
    current: "",
    correctKeys: 0,
    totalKeys: 0,
    startedAt: 0,
    finished: false,
    cfg: DEFAULT_CONFIG,
    samples: [],
    second: 0,
    secKeys: 0,
    secErrors: 0,
  });

  // Leaderboard for the selected test length.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/typing?duration=${lbDuration}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("unavailable"))))
      .then((data: { entries: BoardEntry[]; total: number }) => {
        if (!cancelled) setBoard({ duration: lbDuration, entries: data.entries, total: data.total, error: false });
      })
      .catch(() => {
        if (!cancelled) setBoard({ duration: lbDuration, entries: [], total: 0, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [lbDuration, boardKey]);

  // Starts (or restarts) a run. A patch changes the test setup, e.g. startTest({ punctuation: true }).
  const startTest = (patch: Partial<TestConfig> = {}) => {
    const cfg = { ...config, ...patch };
    const fresh = buildWords(cfg, INITIAL_WORDS);
    live.current = {
      words: fresh,
      typed: [],
      current: "",
      correctKeys: 0,
      totalKeys: 0,
      startedAt: 0,
      finished: false,
      cfg,
      samples: [],
      second: 0,
      secKeys: 0,
      secErrors: 0,
    };
    setConfig(cfg);
    setWords(fresh);
    setTyped([]);
    setCurrent("");
    setTimeLeft(cfg.mode === "time" ? cfg.duration : 0);
    setLiveWpm(0);
    setLiveAcc(100);
    setResult(null);
    setSubmission(null);
    setPhase("idle");
    setRunId((id) => id + 1);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = cleanName(name);
    const cleanedEmail = email.trim().toLowerCase();
    const errors: { name?: string; email?: string } = {};
    if (!isValidName(cleanedName)) errors.name = "Enter a name between 2 and 30 characters.";
    if (!isValidEmail(cleanedEmail)) errors.email = "Enter a valid email address.";
    setFormErrors(errors);
    if (errors.name || errors.email) return;
    setName(cleanedName);
    setEmail(cleanedEmail);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: cleanedName, email: cleanedEmail }));
    } catch {
      /* storage unavailable: the details just won't be remembered */
    }
    startTest();
  };

  const finish = useCallback(() => {
    const s = live.current;
    if (s.finished) return;
    s.finished = true;

    const cfg = s.cfg;
    const elapsed = Math.max((performance.now() - s.startedAt) / 1000, 1);
    const seconds = cfg.mode === "time" ? cfg.duration : Math.round(elapsed * 10) / 10;
    const correctChars = scoreChars(s.words, s.typed, s.current);
    const score = computeScore(seconds, correctChars, s.correctKeys, s.totalKeys);
    const ranked = isRanked(cfg);

    // Personal best for this exact setup, kept in the browser.
    let pb = { best: score.wpm, isNew: false };
    try {
      const book: Record<string, number> = JSON.parse(localStorage.getItem(PB_KEY) ?? "{}");
      const key = configKey(cfg);
      const previous = typeof book[key] === "number" ? book[key] : 0;
      if (score.wpm > previous) {
        book[key] = score.wpm;
        localStorage.setItem(PB_KEY, JSON.stringify(book));
        pb = { best: score.wpm, isNew: previous > 0 };
      } else {
        pb = { best: previous, isNew: false };
      }
    } catch {
      /* storage unavailable: no personal best tracking */
    }

    const samples = [...s.samples];
    setResult({
      ...score,
      correctChars,
      errors: s.totalKeys - s.correctKeys,
      seconds,
      label: configLabel(cfg),
      detail: configDetail(cfg),
      ranked,
      duration: cfg.duration,
      chars: charStats(s.words, s.typed, s.current),
      consistency: consistencyScore(samples.map((x) => x.raw)),
      samples,
      pb,
    });
    setTimeLeft(0);
    setPhase("done");
    inputRef.current?.blur();

    // Only plain timed tests are comparable, so everything else is practice.
    if (!ranked) {
      setSubmission({ status: "skipped" });
      return;
    }

    setSubmission({ status: "saving" });
    fetch("/api/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        duration: cfg.duration,
        correctChars,
        correctKeystrokes: s.correctKeys,
        totalKeystrokes: s.totalKeys,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setSubmission({ status: "error", message: data?.error ?? "Couldn't save your score." });
          return;
        }
        setSubmission({ status: "saved", rank: data.rank, total: data.total, best: data.best, improved: data.improved });
        setLbDuration(cfg.duration);
        setBoardKey((k) => k + 1);
      })
      .catch(() => setSubmission({ status: "error", message: "Network error. Your score wasn't saved." }));
  }, [name, email]);

  // Timer + live WPM, driven by wall-clock time so background tabs can't stretch a run.
  // Timed runs count down and end themselves; words and quote runs count up until the last word.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      const s = live.current;
      const timed = s.cfg.mode === "time";
      const elapsed = (performance.now() - s.startedAt) / 1000;
      recordSamples(s, timed ? Math.min(elapsed, s.cfg.duration) : elapsed);
      if (timed && elapsed >= s.cfg.duration) {
        finish();
        return;
      }
      setTimeLeft(timed ? Math.ceil(s.cfg.duration - elapsed) : Math.floor(elapsed));
      setLiveWpm(Math.round(scoreChars(s.words, s.typed, s.current) / 5 / (Math.max(elapsed, 1) / 60)));
      setLiveAcc(s.totalKeys ? Math.round((s.correctKeys / s.totalKeys) * 100) : 100);
    }, 100);
    return () => clearInterval(id);
  }, [phase, finish]);

  useEffect(() => {
    if (phase === "idle") inputRef.current?.focus();
  }, [phase, runId]);

  // Keep the active word on the second visible line.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const word = innerRef.current?.children[typed.length] as HTMLElement | undefined;
    if (!viewport || !word) return;
    viewport.scrollTop = Math.max(0, word.offsetTop - word.offsetHeight);
  }, [typed.length, words, phase]);

  // One caret that glides to the next letter, instead of a bar redrawn on each letter.
  const placeCaret = useCallback(() => {
    const caret = caretRef.current;
    const word = innerRef.current?.children[typed.length] as HTMLElement | undefined;
    if (!caret || !word || word === caret) return;
    const letters = word.children;
    const next = letters[current.length] as HTMLElement | undefined;
    const last = letters[letters.length - 1] as HTMLElement | undefined;
    if (!next && !last) return;
    const x = next ? word.offsetLeft + next.offsetLeft : word.offsetLeft + last!.offsetLeft + last!.offsetWidth;
    // The very first position is set without a slide, so a restart doesn't sweep across the page.
    caret.toggleAttribute("data-snap", typed.length === 0 && current.length === 0);
    caret.style.transform = `translate(${x - 1}px, ${word.offsetTop}px)`;
  }, [typed.length, current]);

  useLayoutEffect(() => {
    placeCaret();
  }, [placeCaret, words, phase]);

  useEffect(() => {
    window.addEventListener("resize", placeCaret);
    return () => window.removeEventListener("resize", placeCaret);
  }, [placeCaret]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase !== "idle" && phase !== "running") return;
    const s = live.current;
    const cfg = s.cfg;
    const fixedLength = cfg.mode !== "time"; // words and quote runs end on the last word
    const value = e.target.value;
    const target = s.words[s.typed.length] ?? "";

    if (value.includes(" ")) {
      const finished = value.slice(0, value.indexOf(" "));
      if (!finished) return; // a leading space does nothing
      begin();
      s.totalKeys += 1;
      if (finished === target) s.correctKeys += 1;
      else if (cfg.stopOnError !== "off") return; // a wrong word can't be left behind
      const next = [...s.typed, finished];
      s.typed = next;
      s.current = "";
      setTyped(next);
      setCurrent("");
      if (fixedLength) {
        if (next.length >= s.words.length) finish();
      } else if (next.length > s.words.length - 40) {
        const more = [...s.words, ...generateWords(60, { punctuation: cfg.punctuation, numbers: cfg.numbers })];
        s.words = more;
        setWords(more);
      }
      return;
    }

    begin();
    const next = value.slice(0, target.length + MAX_EXTRA_LETTERS);
    for (let i = s.current.length; i < next.length; i++) {
      s.totalKeys += 1;
      if (next[i] === target[i]) s.correctKeys += 1;
      else if (cfg.stopOnError === "letter") return; // wrong key: counted as a mistake, cursor stays put
    }
    s.current = next;
    setCurrent(next);

    // The last word ends a words/quote run as soon as it is fully typed.
    const isLastWord = s.typed.length === s.words.length - 1;
    if (fixedLength && isLastWord && next.length >= target.length && (cfg.stopOnError === "off" || next === target)) {
      finish();
    }
  };

  // The timer starts on the first real keystroke.
  const begin = () => {
    if (phase !== "idle") return;
    live.current.startedAt = performance.now();
    setPhase("running");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const s = live.current;
    if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      startTest();
      return;
    }
    // Backspace past an empty word re-opens the previous word, but only if it was wrong.
    if (e.key === "Backspace" && s.current === "" && s.typed.length > 0) {
      const last = s.typed.length - 1;
      if (s.typed[last] !== s.words[last]) {
        e.preventDefault();
        const reopened = s.typed[last];
        s.typed = s.typed.slice(0, last);
        s.current = reopened;
        setTyped(s.typed);
        setCurrent(reopened);
      }
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `I typed ${result.wpm} WPM (${result.accuracy}% accuracy, ${result.detail}) on the SaaS MRKT typing test. Can you beat me? ${window.location.origin}/typing-test`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy your challenge:", text);
    }
  };

  const rows = useMemo<Row[]>(() => {
    if (!board) return [];
    const list: Row[] = board.entries.map((entry) => ({ ...entry, kind: "user" as const }));
    list.push({ name: BENCHMARK.name, wpm: BENCHMARK.wpm, accuracy: null, kind: "bench" });
    // Benchmark sorts ahead of ties so "beating" it means a strictly higher score.
    return list.sort((a, b) => b.wpm - a.wpm || (a.kind === "bench" ? -1 : b.kind === "bench" ? 1 : 0));
  }, [board]);

  const playing = phase === "idle" || phase === "running";
  const topWpm = Math.max(1, ...rows.map((r) => r.wpm));
  const boardLoading = !board || board.duration !== lbDuration;
  const myName = cleanName(name);
  const diff = result ? Math.round((result.wpm - BENCHMARK.wpm) * 10) / 10 : 0;

  return (
    <PageLayout noContainer>
      <div className="buyers-page-wrapper">
        <div className="buyers-container tt-container">
          <header className="tt-hero">
            <WaveBackdrop />
            {playing ? (
              <>
                <div className="tt-badge">
                  <Icon name="keyboard" size={16} />
                  Typing Speed Test
                </div>
                <h1 className="tt-title">
                  Test Your{" "}
                  <span className="tt-title-accent">
                    Typing Speed
                    <svg className="tt-swoosh" viewBox="0 0 220 16" fill="none" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M3 11C55 2 150 1 217 9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>
                <p className="tt-lede">Type the passage below and check your WPM, accuracy, and speed.</p>
                <div className="tt-hero-keys" aria-hidden="true">
                  <Keycaps />
                </div>
                <Stopwatch />
              </>
            ) : (
              <>
                <div className="tt-badge">
                  <Icon name="keyboard" size={16} />
                  Typing Challenge
                </div>
                <h1 className="tt-title">
                  <svg className="tt-sparkle" viewBox="0 0 48 40" fill="currentColor" aria-hidden="true">
                    <path d="M14 4L16.2 11.3L24 13.5L16.2 15.7L14 23L11.8 15.7L4 13.5L11.8 11.3Z" />
                    <path d="M34 22L35.4 26.6L40 28L35.4 29.4L34 34L32.6 29.4L28 28L32.6 26.6Z" opacity="0.6" />
                  </svg>
                  Can you beat our{" "}
                  <span className="tt-title-accent">
                    {BENCHMARK.wpm} WPM?
                    <svg className="tt-swoosh" viewBox="0 0 220 16" fill="none" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M3 11C55 2 150 1 217 9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <svg className="tt-sparkle tt-sparkle-r" viewBox="0 0 48 40" fill="currentColor" aria-hidden="true">
                    <path d="M14 4L16.2 11.3L24 13.5L16.2 15.7L14 23L11.8 15.7L4 13.5L11.8 11.3Z" />
                    <path d="M34 22L35.4 26.6L40 28L35.4 29.4L34 34L32.6 29.4L28 28L32.6 26.6Z" opacity="0.6" />
                  </svg>
                </h1>
                <p className="tt-lede">
                  Take the free typing speed test, see how fast you really are, and find your spot on the leaderboard.
                  No account needed. Just your name and email.
                </p>
                <HeroKey />
                {phase === "done" && (
                  <div className="tt-hero-keys" aria-hidden="true">
                    <Keycaps />
                  </div>
                )}
              </>
            )}
          </header>

          <div className={`tt-grid${playing ? " tt-grid-play" : ""}`}>
            <section className={`tt-stage${playing ? " tt-stage-play" : ""}${phase === "form" ? " tt-stage-form" : ""}${phase === "done" ? " tt-stage-result" : ""}`} id="typing-test" aria-label="Typing test">
              {phase === "form" && (
                <div className="tt-form-layout">
                <form className="tt-form" onSubmit={handleStart} noValidate>
                  <div className="tt-form-head">
                    <span className="tt-bench-pill"><Icon name="trophy" size={16} /> Team Benchmark: {BENCHMARK.wpm} WPM</span>
                    <h2>
                      <svg className="tt-burst" viewBox="0 0 36 30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 7l3 6M17 2l1 7M29 11l-7 3" />
                      </svg>
                      Take the test, then
                      <br />
                      see where{" "}
                      <em>
                        you rank
                        <svg className="tt-underline" viewBox="0 0 220 14" preserveAspectRatio="none" fill="none" aria-hidden="true">
                          <path d="M3 10C60 3 150 2 217 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      </em>
                    </h2>
                    <p>Type as many words as you can before the clock runs out.</p>
                  </div>

                  <label className="tt-field">
                    <span className="tt-label"><Icon name="user" size={18} /> Your Name</span>
                    <span className="tt-input">
                      <Icon name="user" size={19} />
                      <input
                        type="text"
                        value={name}
                        maxLength={30}
                        autoComplete="name"
                        placeholder="Shown on the leaderboard"
                        onChange={(e) => setName(e.target.value)}
                        aria-invalid={!!formErrors.name}
                      />
                    </span>
                    {formErrors.name && <em className="tt-field-error">{formErrors.name}</em>}
                  </label>

                  <label className="tt-field">
                    <span className="tt-label"><Icon name="mail" size={18} /> Email</span>
                    <span className="tt-input">
                      <Icon name="mail" size={19} />
                      <input
                        type="email"
                        value={email}
                        maxLength={254}
                        autoComplete="email"
                        placeholder="you@company.com"
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!formErrors.email}
                      />
                    </span>
                    {formErrors.email && <em className="tt-field-error">{formErrors.email}</em>}
                  </label>

                  <div className="tt-field">
                    <span className="tt-label"><Icon name="clock" size={18} /> Test Length</span>
                    <DurationPills value={duration} onChange={(d) => setConfig((c) => ({ ...c, duration: d }))} />
                  </div>

                  <button type="submit" className="tt-cta">
                    <Icon name="play" size={17} filled />
                    Start Typing Test
                  </button>
                  <p className="tt-fineprint">
                    <Icon name="info" size={14} />
                    Your email is never shown publicly. It only keeps one best score per person.
                  </p>
                </form>
                <div className="tt-form-art" aria-hidden="true">
                  <Gauge value={BENCHMARK.wpm} />
                  <Keycaps />
                </div>
                </div>
              )}

              {playing && (
                <div className="tt-play" onClick={() => inputRef.current?.focus()}>
                  <div className="tt-play-head">
                    <h2 className="tt-play-title">
                      <KeyboardGlyph />
                      Typing Test
                    </h2>
                    {config.mode !== "quote" && (
                      <div className="tt-tabs" role="radiogroup" aria-label={config.mode === "time" ? "Test length" : "Word count"}>
                        {(config.mode === "time" ? DURATIONS : WORD_COUNTS).map((n: number) => {
                          const on = (config.mode === "time" ? config.duration : config.wordCount) === n;
                          return (
                            <button
                              key={n}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              disabled={phase === "running"}
                              className={on ? "tt-tab tt-tab-on" : "tt-tab"}
                              onClick={(e) => {
                                e.stopPropagation();
                                startTest(config.mode === "time" ? { duration: n as Duration } : { wordCount: n as WordCount });
                              }}
                            >
                              {config.mode === "time" ? `${n}s` : n}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <TestOptions config={config} disabled={phase === "running"} onChange={(patch) => startTest(patch)} />

                  <div className="tt-stats">
                    <div className="tt-stat">
                      <span className="tt-stat-icon"><Icon name="clock" size={26} /></span>
                      <div>
                        <small>{config.mode === "time" ? "Time Left" : "Time"}</small>
                        <strong>{timeLeft}s</strong>
                      </div>
                    </div>
                    <div className="tt-stat">
                      <span className="tt-stat-icon"><Icon name="bolt" size={26} /></span>
                      <div>
                        <small>Current WPM</small>
                        <strong>{phase === "running" ? liveWpm : "–"}</strong>
                      </div>
                    </div>
                    <div className="tt-stat">
                      <span className="tt-stat-icon"><Icon name="target" size={26} /></span>
                      <div>
                        <small>Accuracy</small>
                        <strong>{phase === "running" ? `${liveAcc}%` : "–"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="tt-progress" aria-hidden="true">
                    <div
                      className="tt-progress-bar"
                      style={{
                        width: `${
                          config.mode === "time"
                            ? phase === "idle"
                              ? 100
                              : (timeLeft / duration) * 100
                            : (typed.length / Math.max(words.length, 1)) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <div className={`tt-words-box${focused ? " tt-words-box-on" : ""}`}>
                    <div className={`tt-words-viewport${phase === "idle" ? " tt-idle" : ""}`} ref={viewportRef}>
                      <div className="tt-words" ref={innerRef}>
                        {words.map((word, i) => (
                          <Word
                            key={i}
                            word={word}
                            typed={i < typed.length ? typed[i] : i === typed.length ? current : ""}
                            mode={i < typed.length ? "done" : i === typed.length ? "active" : "todo"}
                          />
                        ))}
                        <span className="tt-caret-el" ref={caretRef} aria-hidden="true" />
                      </div>
                      {!focused && (
                        <div className="tt-focus-overlay">Click here or press any key to continue</div>
                      )}
                    </div>
                  </div>

                  <input
                    ref={inputRef}
                    className="tt-hidden-input"
                    value={current}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onPaste={(e) => e.preventDefault()}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Type the words shown above"
                  />

                  <div className="tt-play-foot">
                    <span className="tt-play-hint">
                      <span className="tt-play-info"><Icon name="info" size={20} /></span>
                      {phase === "idle"
                        ? "Start typing to begin the test"
                        : config.mode === "time"
                          ? "Keep going!"
                          : `${typed.length} / ${words.length} words`}
                    </span>
                    <button type="button" className="tt-link-btn" onClick={() => startTest()}>
                      <Icon name="refresh" size={18} />
                      Restart <kbd>Tab</kbd>
                    </button>
                  </div>
                </div>
              )}

              {phase === "done" && result && (
                <div className="tt-result" aria-live="polite">
                  {((result.ranked && diff > 0) || result.pb.isNew) && <Confetti />}

                  <div className="tt-res-head">
                    <h2 className="tt-res-title">
                      <KeyboardGlyph />
                      {result.label} Test Result
                    </h2>
                    <ul className="tt-res-chips" aria-label="Test settings">
                      {result.detail.split(" · ").map((chip, i) => (
                        <li key={chip}>
                          {i === 0 && <Icon name="clock" size={14} />}
                          {chipLabel(chip)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="tt-res-hero">
                    <div className="tt-res-gauge">
                      <Gauge value={result.wpm} max={Math.max(100, Math.ceil((result.wpm * 1.15) / 10) * 10)} animate badge />
                      <p className="tt-coach">{coachLine(result.wpm, result.ranked)}</p>
                    </div>

                    <div className="tt-res-side">
                      {result.ranked ? (
                        <Versus wpm={result.wpm} diff={diff} />
                      ) : (
                        <div className="tt-verdict tt-try">
                          <span className="tt-verdict-icon"><Icon name="info" size={22} /></span>
                          <span>
                            Practice run. Only plain <b>timed</b> tests (no punctuation, numbers or stop on error) are ranked.
                          </span>
                        </div>
                      )}

                      {submission?.status !== "skipped" && (
                        <p className={`tt-submit-status tt-${submission?.status ?? "saving"}`}>
                          {submission?.status === "saved" && <Icon name="check" size={16} />}
                          {submission?.status === "saving" && "Saving your score…"}
                          {submission?.status === "saved" &&
                            (submission.improved
                              ? `Saved! You're #${submission.rank} of ${submission.total} on the ${result.duration}s leaderboard.`
                              : `Your best ${result.duration}s score is still ${submission.best} WPM (#${submission.rank} of ${submission.total}).`)}
                          {submission?.status === "error" && submission.message}
                        </p>
                      )}
                    </div>

                    <div className="tt-result-actions">
                      <button type="button" className="tt-cta" onClick={() => startTest()}>
                        <Icon name="refresh" size={20} />
                        Try Again
                      </button>
                      <button type="button" className="tt-secondary" onClick={handleShare}>
                        <Icon name="users" size={20} />
                        {copied ? "Copied!" : "Challenge a Friend"}
                      </button>
                    </div>
                  </div>

                  <div className="tt-result-stats">
                    <div>
                      <span className="tt-rs-icon"><Icon name="target" size={22} /></span>
                      <div>
                        <small>Accuracy</small>
                        <strong>{result.accuracy}%</strong>
                      </div>
                    </div>
                    <div>
                      <span className="tt-rs-icon"><Icon name="bolt" size={22} /></span>
                      <div>
                        <small>Raw WPM</small>
                        <strong>{result.rawWpm}</strong>
                      </div>
                    </div>
                    <div>
                      <span className="tt-rs-icon"><Icon name="bars" size={22} /></span>
                      <div>
                        <small>Consistency</small>
                        <strong>{result.consistency}%</strong>
                      </div>
                    </div>
                    <div>
                      <span className="tt-rs-icon"><Icon name="clock" size={22} /></span>
                      <div>
                        <small>Time</small>
                        <strong>{result.seconds}s</strong>
                      </div>
                    </div>
                    <div className="tt-rs-bad">
                      <span className="tt-rs-icon"><Icon name="alert" size={22} /></span>
                      <div>
                        <small>Mistakes</small>
                        <strong>{result.errors}</strong>
                      </div>
                    </div>
                    <div className="tt-rs-pb">
                      <span className="tt-rs-icon"><Icon name="trophy" size={22} /></span>
                      <div>
                        <small>
                          Personal Best
                          {result.pb.isNew && <em className="tt-rs-new">New</em>}
                        </small>
                        <strong>
                          {result.pb.best > 0 ? (
                            <>
                              {result.pb.best}
                              <span className="tt-unit">WPM</span>
                            </>
                          ) : (
                            "–"
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="tt-chars">
                    <span className="tt-rs-icon">Aa</span>
                    <small>Characters</small>
                    <ul>
                      <li className="ok"><span className="tt-ci"><Icon name="check" size={12} /></span><b>{result.chars.correct}</b> correct</li>
                      <li className="bad"><span className="tt-ci"><Icon name="x" size={12} /></span><b>{result.chars.incorrect}</b> incorrect</li>
                      <li className="extra"><span className="tt-ci"><Icon name="minus" size={12} /></span><b>{result.chars.extra}</b> extra</li>
                      <li className="miss"><span className="tt-ci tt-ci-dot" /><b>{result.chars.missed}</b> missed</li>
                    </ul>
                  </div>

                  {result.samples.length >= 2 && <WpmChart samples={result.samples} />}
                </div>
              )}
            </section>

            <div className="tt-side">
            <aside className="tt-board" aria-label="Leaderboard">
              <div className="tt-board-head">
                <h2><Icon name="bars" size={20} /> Leaderboard</h2>
                <div className="tt-tabs" role="tablist" aria-label="Test length">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="tab"
                      aria-selected={lbDuration === d}
                      className={lbDuration === d ? "tt-tab tt-tab-on" : "tt-tab"}
                      onClick={() => setLbDuration(d)}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              {!boardLoading && !board.error && board.total > 0 && (
                <p className="tt-board-sub">
                  <i className="tt-live" aria-hidden="true" />
                  Live · {board.total} {board.total === 1 ? "typist" : "typists"} on the {lbDuration}s board
                </p>
              )}

              {boardLoading ? (
                <ul className="tt-skel" role="status" aria-label="Loading scores">
                  <li />
                  <li />
                  <li />
                </ul>
              ) : (
                <>
                  {board.error && (
                    <p className="tt-board-note">Live scores are unavailable right now. The team benchmark is below.</p>
                  )}
                  <ol className="tt-rows">
                    {rows.map((row, i) => {
                      const isYou =
                        row.kind === "user" &&
                        submission?.status === "saved" &&
                        row.name === myName &&
                        row.wpm === submission.best;
                      return (
                        <li
                          key={`${row.kind}-${row.name}-${i}`}
                          className={`tt-row${row.kind === "bench" ? " tt-row-bench" : ""}${isYou ? " tt-row-you" : ""}`}
                          title={row.accuracy === null ? undefined : `${row.accuracy}% accuracy`}
                        >
                          {i < 3 ? <Medal place={i + 1} /> : <span className="tt-rank">{i + 1}</span>}
                          {row.kind === "bench" ? (
                            <span className="tt-avatar tt-avatar-bench" aria-hidden="true">
                              <Icon name="trophy" size={16} />
                            </span>
                          ) : (
                            <span className="tt-avatar" aria-hidden="true" style={{ background: avatarBackground(row.name) }}>
                              {row.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="tt-who">
                            <span className="tt-name">
                              <span className="tt-name-text">{row.name}</span>
                              {row.kind === "bench" && <em>Beat this</em>}
                              {isYou && <em>You</em>}
                            </span>
                            <small className="tt-meta">
                              {row.accuracy === null ? "Team benchmark" : `${row.accuracy}% accuracy`}
                            </small>
                          </span>
                          <span className="tt-score">{row.wpm}<small>wpm</small></span>
                          <i className="tt-row-bar" style={{ "--fill": `${(row.wpm / topWpm) * 100}%` } as React.CSSProperties} />
                        </li>
                      );
                    })}
                  </ol>
                  {!board.error && board.entries.length === 0 && (
                    <div className="tt-empty">
                      <span className="tt-empty-icon"><Icon name="keyboard" size={22} /></span>
                      <strong>No scores yet</strong>
                      <small>Be the first on the {lbDuration}s board.</small>
                    </div>
                  )}
                </>
              )}
            </aside>

            <ul className="tt-perks">
              <li className="tt-perk-purple">
                <span className="tt-perk-icon"><Icon name="bolt" size={22} /></span>
                <strong>Test Your Speed</strong>
                <small>15s, 30s or 60s</small>
              </li>
              <li className="tt-perk-blue">
                <span className="tt-perk-icon"><Icon name="bars" size={22} /></span>
                <strong>See Your Rank</strong>
                <small>Compete on leaderboard</small>
              </li>
              <li className="tt-perk-amber">
                <span className="tt-perk-icon"><Icon name="trophy" size={22} /></span>
                <strong>Beat the Benchmark</strong>
                <small>Can you beat <b>{BENCHMARK.wpm} WPM</b>?</small>
              </li>
            </ul>
            </div>
          </div>
          {children}
        </div>
      </div>
    </PageLayout>
  );
}

type IconName =
  | "keyboard"
  | "bolt"
  | "trophy"
  | "user"
  | "mail"
  | "clock"
  | "play"
  | "info"
  | "bars"
  | "target"
  | "refresh"
  | "alert"
  | "users"
  | "check"
  | "x"
  | "minus"
  | "trend";

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  keyboard: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 15h10" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  play: <path d="M7 4.5v15l12-7.5z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  bars: <path d="M5 21V11M12 21V3M19 21v-7" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
      <path d="M12 12l7-7M16 4v4h4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v5h-5" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  minus: <path d="M5 12h14" />,
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 3.5l10 17.5H2z" />
      <path d="M12 10v5M12 18h.01" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.2 14.3A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
};

// Result-screen copy: the verdict against the team benchmark, and a one-line coach note.
function Verdict({ diff }: { diff: number }) {
  const gap = Math.abs(diff);
  if (diff > 0) return <>You beat the team! <b>{diff} WPM</b> faster than our {BENCHMARK.wpm}.</>;
  if (diff === 0) return <>Dead heat with the team&apos;s {BENCHMARK.wpm} WPM. One more run?</>;
  if (gap <= 5) return <>So close! Only <b>{gap} WPM</b> short of our {BENCHMARK.wpm}. Try again.</>;
  return <>The team types at {BENCHMARK.wpm} WPM. You&apos;re <b>{gap} WPM</b> away. Try again!</>;
}

const AVATAR_GRADIENTS = [
  ["#a78bfa", "#6d28d9"],
  ["#38bdf8", "#2563eb"],
  ["#34d399", "#059669"],
  ["#f472b6", "#db2777"],
  ["#fb923c", "#ea580c"],
  ["#818cf8", "#4f46e5"],
];

// The same name always gets the same colour.
function avatarBackground(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const [from, to] = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  return `linear-gradient(145deg, ${from}, ${to})`;
}

// "time 30" -> "Time: 30s", "words 25" -> "Words: 25", "punctuation" -> "Punctuation"
function chipLabel(chip: string): string {
  const time = /^time (\d+)$/.exec(chip);
  if (time) return `Time: ${time[1]}s`;
  const words = /^words (\d+)$/.exec(chip);
  if (words) return `Words: ${words[1]}`;
  return chip.charAt(0).toUpperCase() + chip.slice(1);
}

// You against the team benchmark, as two bars, with the verdict underneath.
function Versus({ wpm, diff }: { wpm: number; diff: number }) {
  const max = Math.max(wpm, BENCHMARK.wpm, 1) * 1.08;
  const win = diff > 0;
  return (
    <div className={`tt-versus${win ? " tt-versus-win" : ""}`}>
      <div className="tt-vs-row">
        <span>You</span>
        <div className="tt-vs-track"><i style={{ width: `${(wpm / max) * 100}%` }} /></div>
        <b>{wpm}</b>
      </div>
      <div className="tt-vs-row tt-vs-team">
        <span>Team</span>
        <div className="tt-vs-track"><i style={{ width: `${(BENCHMARK.wpm / max) * 100}%` }} /></div>
        <b>{BENCHMARK.wpm}</b>
      </div>
      <p className="tt-verdict-line">
        <Icon name={win ? "trophy" : "info"} size={18} />
        <span><Verdict diff={diff} /></span>
      </p>
    </div>
  );
}

function coachLine(wpm: number, ranked: boolean): string {
  // The team benchmark is a plain timed score, so practice runs aren't compared against it.
  if (!ranked) return "Nice run! Switch to a plain timed test when you want to compete on the leaderboard.";
  if (wpm >= BENCHMARK.wpm) return "Outstanding! You're typing faster than our team.";
  if (wpm >= 40) return "Nice work! A little more practice and you'll beat the benchmark.";
  return "Keep practicing! Your speed will improve with regular practice.";
}

// Monkeytype-style options row: punctuation and numbers, test mode, and stop on error.
function TestOptions({
  config,
  disabled,
  onChange,
}: {
  config: TestConfig;
  disabled: boolean;
  onChange: (patch: Partial<TestConfig>) => void;
}) {
  const textual = config.mode !== "quote"; // quotes are fixed text, so these two don't apply
  const chip = (on: boolean) => (on ? "tt-chip tt-chip-on" : "tt-chip");
  return (
    <div className="tt-opts" role="group" aria-label="Test options">
      <div className="tt-opt-group">
        <button
          type="button"
          className={chip(config.punctuation && textual)}
          aria-pressed={config.punctuation && textual}
          disabled={disabled || !textual}
          onClick={() => onChange({ punctuation: !config.punctuation })}
        >
          <span aria-hidden="true">@</span> punctuation
        </button>
        <button
          type="button"
          className={chip(config.numbers && textual)}
          aria-pressed={config.numbers && textual}
          disabled={disabled || !textual}
          onClick={() => onChange({ numbers: !config.numbers })}
        >
          <span aria-hidden="true">#</span> numbers
        </button>
      </div>
      <span className="tt-opt-sep" aria-hidden="true" />
      <div className="tt-opt-group" role="radiogroup" aria-label="Test mode">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={config.mode === m}
            className={chip(config.mode === m)}
            disabled={disabled}
            onClick={() => onChange({ mode: m })}
          >
            {m}
          </button>
        ))}
      </div>
      <span className="tt-opt-sep" aria-hidden="true" />
      <div className="tt-opt-group" role="radiogroup" aria-label="Stop on error">
        <span className="tt-opt-label">stop on error</span>
        {STOP_ON_ERROR.map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={config.stopOnError === v}
            className={chip(config.stopOnError === v)}
            disabled={disabled}
            onClick={() => onChange({ stopOnError: v })}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

// WPM over time: net WPM, raw WPM per second, and a dot wherever mistakes were made.
function WpmChart({ samples }: { samples: Sample[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 230;
  const padL = 40;
  const padR = 16;
  const padT = 14;
  const padB = 30;
  const last = samples[samples.length - 1].t;
  const top = Math.max(20, Math.ceil((Math.max(...samples.map((s) => Math.max(s.wpm, s.raw))) * 1.1) / 20) * 20);
  const x = (t: number) => padL + ((t - 1) / Math.max(last - 1, 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / top) * (H - padT - padB);
  const path = (key: "wpm" | "raw") =>
    samples.map((s, i) => `${i ? "L" : "M"}${x(s.t).toFixed(1)} ${y(s[key]).toFixed(1)}`).join(" ");
  const area = `${path("wpm")} L${x(last).toFixed(1)} ${y(0)} L${x(samples[0].t).toFixed(1)} ${y(0)} Z`;
  const yTicks = [0, 1, 2, 3, 4].map((i) => Math.round((top * i) / 4));
  const step = Math.max(1, Math.ceil(samples.length / 6));
  const xTicks = samples.filter((s, i) => i % step === 0 || s.t === last);

  // The nearest second to the pointer drives the readout.
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * W;
    let best = 0;
    samples.forEach((s, i) => {
      if (Math.abs(x(s.t) - vx) < Math.abs(x(samples[best].t) - vx)) best = i;
    });
    setHover(best);
  };
  const point = hover === null ? null : samples[hover];

  return (
    <div className="tt-chart">
      <div className="tt-chart-head">
        <span className="tt-chart-title">
          <span className="tt-chart-icon"><Icon name="trend" size={18} /></span>
          <strong>WPM over time</strong>
        </span>
        <span className="tt-chart-legend">
          <i className="tt-lg-wpm" /> WPM <i className="tt-lg-raw" /> Raw <i className="tt-lg-err" /> Mistakes
        </span>
      </div>
      <div className="tt-chart-plot">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Chart of words per minute for each second of the test"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="tt-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="rgba(124,92,240,0.14)" />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#64748b">
                {v}
              </text>
            </g>
          ))}
          {xTicks.map((s) => (
            <text key={s.t} x={x(s.t)} y={H - 10} textAnchor="middle" fontSize="11" fill="#64748b">
              {s.t}s
            </text>
          ))}
          <path d={area} fill="url(#tt-chart-fill)" />
          <path d={path("raw")} fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round" />
          <path d={path("wpm")} fill="none" stroke="#6d28d9" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {samples.map((s) => (
            <circle key={s.t} cx={x(s.t)} cy={y(s.wpm)} r="3.5" fill="#6d28d9" />
          ))}
          {samples
            .filter((s) => s.errors > 0)
            .map((s) => (
              <circle key={`e${s.t}`} cx={x(s.t)} cy={y(s.raw)} r="4" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
            ))}
          {point && (
            <g>
              <line x1={x(point.t)} x2={x(point.t)} y1={padT} y2={H - padB} stroke="#7c3aed" strokeDasharray="4 4" strokeOpacity="0.55" />
              <circle cx={x(point.t)} cy={y(point.wpm)} r="6" fill="#fff" stroke="#6d28d9" strokeWidth="3" />
            </g>
          )}
        </svg>
        {point && (
          <div className="tt-chart-tip" style={{ left: `${Math.min(86, Math.max(14, (x(point.t) / W) * 100))}%` }}>
            <b>{point.t}s</b>
            WPM {point.wpm} · Raw {point.raw}
            {point.errors > 0 && ` · ${point.errors} ${point.errors === 1 ? "mistake" : "mistakes"}`}
          </div>
        )}
      </div>
    </div>
  );
}

// Counts a number up from zero when it appears (instant for reduced-motion visitors).
function CountUp({ value }: { value: number }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = duration === 0 ? 1 : Math.max(0, Math.min((now - start) / duration, 1));
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  const shown = value * (1 - (1 - progress) ** 3);
  return <>{Number.isInteger(value) ? Math.round(shown) : shown.toFixed(1)}</>;
}

const CONFETTI_COLORS = ["#6d4df2", "#a855f7", "#f59e0b", "#10b981", "#ec4899", "#38bdf8"];

// A short burst of falling pieces. The layout is arithmetic, not random, so it never varies per render.
function Confetti() {
  return (
    <div className="tt-confetti" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <i
          key={i}
          style={
            {
              left: `${(i * 29 + 7) % 100}%`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 9) * 0.07}s`,
              animationDuration: `${2.2 + (i % 5) * 0.25}s`,
              "--drift": `${((i * 13) % 11) - 5}rem`,
              "--spin": `${(i % 2 ? 1 : -1) * (360 + (i % 4) * 120)}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function KeyboardGlyph() {
  return (
    <svg className="tt-kbd-glyph" viewBox="0 0 32 24" aria-hidden="true">
      <rect width="32" height="24" rx="5" fill="#6d4df2" />
      <g fill="#fff">
        {[4, 10.5, 17, 23.5].map((x) => (
          <rect key={`a${x}`} x={x} y="5" width="4.5" height="3.5" rx="1" />
        ))}
        {[4, 10.5, 17, 23.5].map((x) => (
          <rect key={`b${x}`} x={x} y="10.2" width="4.5" height="3.5" rx="1" />
        ))}
        <rect x="8" y="15.4" width="16" height="3.5" rx="1" />
      </g>
    </svg>
  );
}

function Icon({ name, size = 16, filled }: { name: IconName; size?: number; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

const MEDALS = [
  { face: ["#fde68a", "#f59e0b"], ribbon: "#ef4444", ink: "#92400e" },
  { face: ["#f1f5f9", "#94a3b8"], ribbon: "#6366f1", ink: "#475569" },
  { face: ["#fed7aa", "#ea580c"], ribbon: "#f97316", ink: "#7c2d12" },
];

function Medal({ place }: { place: 1 | 2 | 3 | number }) {
  const m = MEDALS[place - 1];
  const id = `tt-medal-${place}`;
  return (
    <svg className="tt-medal" viewBox="0 0 32 40" role="img" aria-label={`Rank ${place}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={m.face[0]} />
          <stop offset="1" stopColor={m.face[1]} />
        </linearGradient>
      </defs>
      <path d="M8 1l8 15 8-15h-5l-3 6-3-6z" fill={m.ribbon} />
      <circle cx="16" cy="26" r="11.5" fill={`url(#${id})`} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      <text x="16" y="31" textAnchor="middle" fontSize="14" fontWeight="800" fill={m.ink}>
        {place}
      </text>
    </svg>
  );
}

// Decorative speedometer for the form panel: fills to the team benchmark.
function Gauge({
  value,
  max = 100,
  animate,
  badge,
}: {
  value: number;
  max?: number;
  animate?: boolean;
  badge?: boolean;
}) {
  const r = 78;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.75;
  const fill = Math.round(Math.min(value / max, 1) * arc * 100) / 100;
  const sweep = Math.round(Math.min(value / max, 1) * 270 * 100) / 100; // degrees the knob travels
  const ticks = Array.from({ length: 28 }, (_, i) => {
    const a = ((135 + (270 / 27) * i) * Math.PI) / 180;
    // Rounded: raw floats can print differently on the server and the client, which breaks hydration.
    const at = (radius: number, fn: (n: number) => number) => Math.round((100 + fn(a) * radius) * 100) / 100;
    return {
      x1: at(62, Math.cos),
      y1: at(62, Math.sin),
      x2: at(68, Math.cos),
      y2: at(68, Math.sin),
    };
  });
  return (
    <div className="tt-gauge">
      <svg viewBox="0 0 200 215">
        <defs>
          <linearGradient id="tt-gauge-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#6d4df2" />
            <stop offset="1" stopColor="#d946ef" />
          </linearGradient>
          <linearGradient id="tt-ped-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ece5ff" />
          </linearGradient>
          <linearGradient id="tt-ped-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9ccff" />
            <stop offset="1" stopColor="#b9a5ff" />
          </linearGradient>
        </defs>
        <path d="M22 192v8a78 13 0 0 0 156 0v-8z" fill="url(#tt-ped-side)" />
        <ellipse cx="100" cy="192" rx="78" ry="13" fill="url(#tt-ped-top)" />
        <ellipse cx="100" cy="191" rx="56" ry="8" fill="#ffffff" opacity="0.65" />
        {badge && (
          <g>
            <circle cx="100" cy="186" r="13" fill="#ffffff" stroke="#e4dcff" strokeWidth="2" />
            <path d="M13 2L4 14h7l-1 8 9-12h-7z" transform="translate(92.56 178.56) scale(0.62)" fill="#6d28d9" />
          </g>
        )}
        <circle cx="100" cy="100" r="64" fill="rgba(255,255,255,0.6)" />
        <g transform="rotate(135 100 100)">
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(124,92,240,0.14)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${arc} ${circumference}`} />
          <circle
            className="tt-gauge-fill"
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="url(#tt-gauge-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circumference}`}
            style={{ ["--tt-gauge-from" as string]: fill }}
          />
          <g className="tt-gauge-knob" style={{ ["--sweep" as string]: `${sweep}deg` }}>
            <circle cx={100 + r} cy="100" r="7" fill="#ffffff" stroke="#8b5cf6" strokeWidth="4" />
          </g>
        </g>
        {ticks.map((t, i) => (
          <line key={i} {...t} stroke="rgba(109,77,242,0.4)" strokeWidth="1.6" strokeLinecap="round" />
        ))}
      </svg>
      <div className="tt-gauge-read">
        <strong>{animate ? <CountUp value={value} /> : value}</strong>
        <span>WPM</span>
      </div>
    </div>
  );
}

// Chunky 3D W/A/S/D cluster on a lavender tray (decorative).
const KEYCAPS = [
  { ch: "W", x: 84, y: 30 },
  { ch: "A", x: 14, y: 88 },
  { ch: "S", x: 80, y: 86 },
  { ch: "D", x: 146, y: 82 },
];

function Keycaps() {
  // A keycap dips while its letter is held down on the real keyboard, or while it is tapped.
  const [down, setDown] = useState<string | null>(null);
  useEffect(() => {
    const press = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const letter = e.key.toUpperCase();
      if (KEYCAPS.some((k) => k.ch === letter)) setDown(letter);
    };
    const release = () => setDown(null);
    window.addEventListener("keydown", press);
    window.addEventListener("keyup", release);
    window.addEventListener("pointerup", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keydown", press);
      window.removeEventListener("keyup", release);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("blur", release);
    };
  }, []);

  return (
    <div className="tt-keys">
      <svg viewBox="0 0 232 190" fill="none">
        <defs>
          <linearGradient id="tt-tray-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efeaff" />
            <stop offset="1" stopColor="#c9b8ff" />
          </linearGradient>
          <linearGradient id="tt-tray-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="tt-key-top" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e6dcff" />
          </linearGradient>
          <linearGradient id="tt-key-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9ccff" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
          <radialGradient id="tt-key-glow" cx="0.75" cy="0.2" r="0.6">
            <stop offset="0" stopColor="#f5b8f7" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f5b8f7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="rotate(-3 116 100)">
          <rect x="4" y="64" width="216" height="112" rx="26" fill="url(#tt-tray-side)" />
          <rect x="4" y="52" width="216" height="112" rx="26" fill="url(#tt-tray-top)" />
          {KEYCAPS.map(({ ch, x, y }, i) => (
            <g
              key={ch}
              className={down === ch ? "tt-kc tt-kc-down" : "tt-kc"}
              style={{ "--i": i } as React.CSSProperties}
              onPointerDown={() => setDown(ch)}
            >
              {/* Fixed and invisible: it keeps the whole key hoverable while its top face dips, which stops flicker. */}
              <rect x={x} y={y} width="62" height="63" rx="15" fill="transparent" />
              <rect x={x} y={y + 13} width="62" height="50" rx="15" fill="url(#tt-key-side)" />
              <g className="tt-kc-push">
                <g className="tt-kc-top">
                  <rect x={x} y={y} width="62" height="50" rx="15" fill="url(#tt-key-top)" />
                  {ch === "D" && (
                    <rect className="tt-kc-glow" x={x} y={y} width="62" height="50" rx="15" fill="url(#tt-key-glow)" />
                  )}
                  <rect x={x + 3} y={y + 3} width="56" height="44" rx="12" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.5" />
                  <text
                    x={x + 31}
                    y={y + 33}
                    textAnchor="middle"
                    fontSize="25"
                    fontWeight="800"
                    fill="#5b3fd6"
                    transform={`translate(0 ${y + 33}) scale(1 0.88) translate(0 ${-(y + 33)})`}
                  >
                    {ch}
                  </text>
                </g>
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

// Single chunky lightning keycap floating beside the headline (decorative).
function HeroKey() {
  return (
    <span className="tt-hero-key" aria-hidden="true">
      <svg viewBox="0 0 150 140" fill="none">
        <defs>
          <linearGradient id="tt-hk-top" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#dccfff" />
          </linearGradient>
          <linearGradient id="tt-hk-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="tt-hk-bolt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <g transform="rotate(-7 75 70)">
          <rect x="18" y="52" width="114" height="64" rx="22" fill="url(#tt-hk-side)" />
          <rect x="14" y="20" width="122" height="84" rx="26" fill="url(#tt-hk-side)" opacity="0.55" />
          <rect x="14" y="14" width="122" height="84" rx="26" fill="url(#tt-hk-top)" />
          <rect x="19" y="19" width="112" height="74" rx="21" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" />
          <path
            d="M80 30L58 60h15l-4 22 24-33H77z"
            fill="url(#tt-hk-bolt)"
            transform="translate(2 -1)"
          />
        </g>
      </svg>
    </span>
  );
}

// Glossy purple stopwatch with speed lines, shown beside the title while typing (decorative).
function Stopwatch() {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const at = (radius: number, fn: (n: number) => number) => Math.round((96 + fn(a) * radius) * 100) / 100;
    return { x1: at(34, Math.sin), y1: Math.round((82 - Math.cos(a) * 34) * 100) / 100, x2: at(39, Math.sin), y2: Math.round((82 - Math.cos(a) * 39) * 100) / 100 };
  });
  return (
    <span className="tt-stopwatch" aria-hidden="true">
      <svg viewBox="0 0 190 150" fill="none">
        <defs>
          <linearGradient id="tt-sw-body" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="tt-sw-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e4daff" />
          </linearGradient>
          <linearGradient id="tt-sw-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M6 58h38M0 76h40M12 94h32" stroke="url(#tt-sw-line)" strokeWidth="6" strokeLinecap="round" />
        <rect x="84" y="8" width="24" height="16" rx="5" fill="#7c3aed" />
        <rect x="90" y="20" width="12" height="12" fill="#6d28d9" />
        <rect x="140" y="22" width="22" height="13" rx="5" fill="#7c3aed" transform="rotate(42 151 28)" />
        <circle cx="96" cy="82" r="56" fill="url(#tt-sw-body)" />
        <circle cx="96" cy="82" r="56" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
        <circle cx="96" cy="82" r="45" fill="url(#tt-sw-face)" />
        {ticks.map((t, i) => (
          <line key={i} {...t} stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" />
        ))}
        <path d="M96 82L108 52" stroke="#6d28d9" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="96" cy="82" r="6" fill="#6d28d9" />
      </svg>
    </span>
  );
}

function WaveBackdrop() {
  return (
    <svg className="tt-wave" viewBox="0 0 1200 280" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tt-wave-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ddd6fe" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ede9fe" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d="M0 120C150 40 280 170 470 120S760 20 1200 150V280H0z" fill="url(#tt-wave-fill)" />
      <path d="M0 140C160 70 300 190 480 140S780 50 1200 170" stroke="#a78bfa" strokeOpacity="0.28" strokeWidth="1.5" />
      <path d="M0 160C170 100 320 210 500 160S800 80 1200 190" stroke="#a78bfa" strokeOpacity="0.18" strokeWidth="1.5" />
    </svg>
  );
}

function DurationPills({
  value,
  onChange,
}: {
  value: Duration;
  onChange: (d: Duration) => void;
}) {
  return (
    <div className="tt-pills" role="radiogroup" aria-label="Test length">
      {DURATIONS.map((d) => (
        <button
          key={d}
          type="button"
          role="radio"
          aria-checked={value === d}
          className={value === d ? "tt-pill tt-pill-on" : "tt-pill"}
          onClick={() => onChange(d)}
        >
          {d}s
          {value === d && (
            <span className="tt-pill-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
