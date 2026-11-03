import React from "react";
import Link from "next/link";
import { BENCHMARK } from "@/lib/typing";

// Server-rendered copy for the typing test page. The FAQ doubles as the FAQPage structured data,
// so every answer here must stay plain text.
export const TYPING_FAQ: { question: string; answer: string }[] = [
  {
    question: "What is WPM?",
    answer:
      "WPM stands for words per minute. It measures how many words you can type in one minute, where a word is counted as five characters including spaces.",
  },
  {
    question: "How is my typing speed calculated?",
    answer:
      "Your net WPM is your correctly typed characters divided by five, divided by the test length in minutes. Raw WPM counts every keystroke, and accuracy is the share of keystrokes that were correct.",
  },
  {
    question: "What is a good typing speed?",
    answer: `The average adult types about 40 WPM. For most office and remote jobs, 45 to 65 WPM is comfortable, and developers, writers and support teams often reach 65 to 90 WPM. Our team benchmark is ${BENCHMARK.wpm} WPM.`,
  },
  {
    question: "Is the typing test free, and do I need an account?",
    answer:
      "The typing test is completely free and no account is needed. You only enter a display name and an email address before you start.",
  },
  {
    question: "Is my email address shown on the leaderboard?",
    answer:
      "No. Only your display name, WPM and accuracy are public. Your email is used to keep one best score per person for each test length.",
  },
  {
    question: "What are the punctuation and numbers options?",
    answer:
      "Punctuation adds capital letters, commas, full stops, quotes and brackets to the words, and numbers mixes digits in. Both make the test harder and are a closer match for real typing at work.",
  },
  {
    question: "Which typing tests count on the leaderboard?",
    answer:
      "Plain timed tests of 15, 30 or 60 seconds, with punctuation, numbers and stop on error switched off. Words, quote and the other custom tests are practice runs, because their speeds are not directly comparable.",
  },
  {
    question: "Why are there 15, 30 and 60 second tests?",
    answer:
      "Shorter tests usually produce a higher WPM than longer ones because you do not have time to tire. Each test length has its own leaderboard so scores stay comparable.",
  },
  {
    question: `How can I beat the SaaS MRKT team's ${BENCHMARK.wpm} WPM?`,
    answer:
      "Focus on accuracy first, because mistakes cost more time than they save. Keep your eyes on the words, use all ten fingers, and practise in short daily sessions. Speed follows accuracy.",
  },
];

// Icons are 24x24 outlines drawn with currentColor.
const ICONS = {
  bars: <path d="M5 21V11M12 21V3M19 21v-7" />,
  play: <path d="M7 4.5v15l12-7.5z" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2.9-1.2 1.8M12 17h.01" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12C12 8 9.5 6 5 6c0 4 2.5 6 7 6z" />
      <path d="M12 14c0-3 2-5 7-5 0 4-2.5 5.5-7 5.5" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  crown: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  sliders: <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" />,
  keyboard: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 15h10" />
    </>
  ),
  calc: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <path d="M8.5 7h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  hand: (
    <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V13M8 12l-1.6-1.8a1.6 1.6 0 0 0-2.4 2L8 17.5c1 1.5 2.4 3 5 3h1c3 0 5-2 5-5V13" />
  ),
  pulse: <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4.5 4-6.5 8-6.5s7 2 8 6.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="M6 15l6-6 6 6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  hourglass: <path d="M6 3h12M6 21h12M7 3c0 5 3 6 5 9-2 3-5 4-5 9M17 3c0 5-3 6-5 9 2 3 5 4 5 9" />,
};

type IconName = keyof typeof ICONS;

function Ico({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}

// The scale runs 0 to SCALE_MAX WPM; each level owns a slice of it.
const SCALE_MAX = 120;
const LEVELS: {
  level: string;
  wpm: string;
  from: number;
  to: number;
  color: string;
  tint: string;
  ink: string;
  icon: IconName;
  note: string;
}[] = [
  { level: "Beginner", wpm: "Under 30", from: 0, to: 30, color: "#94a3b8", tint: "#e8edf4", ink: "#475569", icon: "sprout", note: "Still building muscle memory. Focus on accuracy first." },
  { level: "Average", wpm: "30 to 45", from: 30, to: 45, color: "#60a5fa", tint: "#dbeafe", ink: "#1d4ed8", icon: "layers", note: "Typical for everyday computer users." },
  { level: "Good", wpm: "45 to 65", from: 45, to: 65, color: "#8b5cf6", tint: "#ede9fe", ink: "#6d28d9", icon: "trophy", note: `Comfortable for office and remote work. Our team sits at ${BENCHMARK.wpm} WPM.` },
  { level: "Fast", wpm: "65 to 90", from: 65, to: 90, color: "#c026d3", tint: "#fae8ff", ink: "#a21caf", icon: "bolt", note: "Common among developers, writers and support teams." },
  { level: "Expert", wpm: "90+", from: 90, to: SCALE_MAX, color: "#ec4899", tint: "#fce7f3", ink: "#be185d", icon: "crown", note: "Top-tier speed that takes dedicated practice." },
];

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "mail", title: "Enter your details", text: "Enter a display name and email. Your email is never shown publicly." },
  { icon: "sliders", title: "Choose test settings", text: "Pick a mode (time, words or quote) and a length. Add punctuation, numbers or stop on error if you want a harder test." },
  { icon: "keyboard", title: "Start typing", text: "Type the words on screen. The timer starts on your first keystroke." },
  { icon: "bars", title: "Get your results", text: "See your WPM, accuracy, consistency and a WPM-over-time chart, then find your rank on the leaderboard." },
];

const TIPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "target", title: "Prioritise accuracy", text: "Speed comes naturally once mistakes drop." },
  { icon: "monitor", title: "Keep your eyes on the screen", text: "Instead of the keyboard." },
  { icon: "hand", title: "Rest your fingers on the home row", text: "And use all ten fingers." },
  { icon: "pulse", title: "Type with a steady rhythm", text: "Rather than in bursts." },
  { icon: "hourglass", title: "Practise for 10 to 15 minutes a day", text: "Instead of one long session." },
];

// "Aa" is drawn as text, so it is a marker rather than an icon name. Same order as TYPING_FAQ.
const FAQ_ICONS: (IconName | "aa")[] = ["keyboard", "calc", "bolt", "user", "trophy", "aa", "bars", "clock", "target"];

const pct = (wpm: number) => `${(wpm / SCALE_MAX) * 100}%`;

// A heading word in purple with a hand-drawn underline.
function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span className="tt-hl">
      {children}
      <svg viewBox="0 0 120 10" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M2 7C30 2 80 1 118 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

// White keycap carrying a bolt, on a purple edge. `id` keeps the gradient ids unique per drawing.
function BoltKey({ id, transform }: { id: string; transform?: string }) {
  return (
    <g transform={transform}>
      <defs>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ece5ff" />
        </linearGradient>
      </defs>
      <rect x="0" y="12" width="84" height="76" rx="22" fill={`url(#${id}-side)`} />
      <rect x="0" y="0" width="84" height="76" rx="22" fill={`url(#${id}-top)`} />
      <rect x="4" y="4" width="76" height="68" rx="18" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" />
      <path d="M13 2L4 14h7l-1 8 9-12h-7z" transform="translate(21.5 17) scale(1.7)" fill="#7c3aed" />
    </g>
  );
}

// Decorative: a purple 3D keyboard with a bolt key flying off it.
function KeyboardArt() {
  const rows = [
    { y: 12, keys: Array.from({ length: 9 }, (_, i) => ({ x: 12 + i * 20, w: 16 })) },
    { y: 31, keys: Array.from({ length: 8 }, (_, i) => ({ x: 22 + i * 20, w: 16 })) },
    { y: 50, keys: Array.from({ length: 8 }, (_, i) => ({ x: 17 + i * 20, w: 16 })) },
    { y: 69, keys: [{ x: 12, w: 28 }, { x: 46, w: 98 }, { x: 150, w: 36 }] },
  ];
  return (
    <svg viewBox="0 0 310 190" fill="none">
      <defs>
        <linearGradient id="ka-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b79cff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="ka-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d28d9" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <path d="M232 70h64M240 90h56M232 110h40" stroke="#c9b8ff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
      <path d="M4 40l7 12M20 24l5 13M38 14l2 10" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(14 92) skewY(-13)">
        <rect x="0" y="14" width="198" height="94" rx="16" fill="url(#ka-side)" />
        <rect x="0" y="0" width="198" height="94" rx="16" fill="url(#ka-top)" />
        {rows.map((row) =>
          row.keys.map((k) => (
            <g key={`${row.y}-${k.x}`}>
              <rect x={k.x} y={row.y + 3} width={k.w} height="14" rx="4" fill="#cdbbff" />
              <rect x={k.x} y={row.y} width={k.w} height="14" rx="4" fill="#ffffff" />
            </g>
          )),
        )}
      </g>
      <BoltKey id="ka-bolt" transform="translate(206 4) rotate(-7 42 42)" />
    </svg>
  );
}

function BoltKeyArt() {
  return (
    <svg viewBox="0 0 130 130" fill="none">
      <path d="M8 22l8 10M24 8l5 13M96 10l-3 12" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <BoltKey id="kb-bolt" transform="translate(22 26) rotate(-8 42 42) scale(1.1)" />
    </svg>
  );
}

// Keyboard with a speech bubble: decorative art for the FAQ panel.
function FaqArt() {
  const rows = [
    { y: 8, n: 7, x: 10 },
    { y: 26, n: 7, x: 18 },
    { y: 44, n: 6, x: 26 },
  ];
  const bubble = "M18 14h64a18 18 0 0 1 18 18v28a18 18 0 0 1-18 18H62l-16 18-3-18H18A18 18 0 0 1 0 60V32a18 18 0 0 1 18-18z";
  return (
    <svg viewBox="0 0 280 190" fill="none">
      <defs>
        <linearGradient id="fa-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b79cff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="fa-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d28d9" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="fa-bubble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6dcff" />
        </linearGradient>
      </defs>
      <path d="M20 70l9 7M40 52l5 10M64 42l1 9" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(18 92) skewY(-16)">
        <rect x="0" y="14" width="190" height="78" rx="14" fill="url(#fa-side)" />
        <rect x="0" y="0" width="190" height="78" rx="14" fill="url(#fa-top)" />
        {rows.map((row) =>
          Array.from({ length: row.n }, (_, i) => (
            <g key={`${row.y}-${i}`}>
              <rect x={row.x + i * 24} y={row.y + 3} width="19" height="14" rx="4" fill="#cdbbff" />
              <rect x={row.x + i * 24} y={row.y} width="19" height="14" rx="4" fill="#ffffff" />
            </g>
          )),
        )}
        <rect x="46" y="64" width="100" height="10" rx="4" fill="#ffffff" />
      </g>
      <g transform="translate(150 6) rotate(6 50 40)">
        <path d={bubble} fill="#c9b8ff" transform="translate(0 7)" />
        <path d={bubble} fill="url(#fa-bubble)" />
        <path d="M40 40c0-8 5-12 11-12 7 0 11 4 11 10 0 6-5 8-9 11-2 1.5-2 3-2 5M51 62h.01" stroke="#6d28d9" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function TypingSeoContent() {
  return (
    <section className="tt-seo" aria-label="About the typing speed test">
      <div className="tt-seo-card tt-guide tt-guide-levels">
        <div className="tt-guide-art tt-guide-art-kb" aria-hidden="true">
          <KeyboardArt />
        </div>
        <span className="tt-eyebrow"><Ico name="bars" size={14} /> Typing Speed Guide</span>
        <h2>
          What is a good <Hl>typing speed?</Hl>
        </h2>
        <p className="tt-guide-lede">
          Typing speed is measured in words per minute (WPM). The average adult types about 40 WPM, while professional
          typists and developers often reach 65 to 80 WPM. Use the table below to see where your result sits.
        </p>

        <div className="tt-scale" aria-hidden="true">
          <span className="tt-scale-flag" style={{ left: pct(BENCHMARK.wpm) }}>
            <Ico name="trophy" size={14} />
            SaaS MRKT team · {BENCHMARK.wpm} WPM
          </span>
          <div className="tt-scale-bar">
            {LEVELS.map((l) => (
              <span key={l.level} style={{ width: pct(l.to - l.from), background: l.color }} />
            ))}
          </div>
          {LEVELS.slice(1).map((l) => (
            <i key={l.level} className="tt-scale-dot" style={{ left: pct(l.from) }} />
          ))}
          <div className="tt-scale-ticks">
            {LEVELS.slice(1).map((l) => (
              <span key={l.level} style={{ left: pct(l.from) }}>{l.from}</span>
            ))}
          </div>
        </div>

        <ul className="tt-levels">
          {LEVELS.map((l) => {
            const team = BENCHMARK.wpm >= l.from && BENCHMARK.wpm < l.to;
            return (
              <li
                key={l.level}
                className={team ? "tt-lv tt-lv-team" : "tt-lv"}
                style={{ "--lv": l.color, "--tint": l.tint, "--ink": l.ink } as React.CSSProperties}
              >
                {team && <span className="tt-lv-check"><Ico name="check" size={16} /></span>}
                <div className="tt-lv-top">
                  <span className="tt-lv-icon"><Ico name={l.icon} size={18} /></span>
                  <span className="tt-lv-name">{l.level}</span>
                </div>
                <strong>{l.wpm} WPM</strong>
                <p>{l.note}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="tt-seo-split">
        <div className="tt-seo-card tt-guide">
          <span className="tt-eyebrow"><Ico name="play" size={14} /> How It Works</span>
          <h2>
            How the <Hl>typing speed test</Hl> works?
          </h2>
          <p className="tt-guide-lede">A quick look at how the test works and how your results are calculated.</p>
          <ol className="tt-steps">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="tt-step-n">{i + 1}</span>
                <div className="tt-step-card">
                  <span className="tt-step-icon"><Ico name={step.icon} size={22} /></span>
                  <div>
                    <b>{step.title}</b>
                    <p>{step.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="tt-formula">
            <span className="tt-formula-icon"><Ico name="calc" size={28} /></span>
            <div className="tt-formula-body">
              <h3>How we calculate WPM</h3>
              <code>Net WPM = (correct characters ÷ 5) ÷ minutes</code>
              <p>Raw WPM counts every keystroke, and accuracy is correct keystrokes ÷ total keystrokes.</p>
            </div>
          </div>
        </div>

        <div className="tt-seo-card tt-guide tt-guide-tips">
          <div className="tt-guide-art tt-guide-art-key" aria-hidden="true">
            <BoltKeyArt />
          </div>
          <span className="tt-eyebrow"><Ico name="bolt" size={14} /> Typing Tips</span>
          <h2>
            5 tips to <Hl>type faster</Hl>
          </h2>
          <p className="tt-guide-lede">Simple and effective tips to improve your typing speed and accuracy.</p>
          <ul className="tt-tips">
            {TIPS.map((tip, i) => (
              <li key={tip.title}>
                <span className="tt-tip-icon"><Ico name={tip.icon} size={24} /></span>
                <div>
                  <b>{tip.title}</b>
                  <p>{tip.text}</p>
                </div>
                <span className="tt-tip-n">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="tt-seo-card tt-faq-layout">
        <div className="tt-faq-intro">
          <span className="tt-eyebrow"><Ico name="help" size={15} /> FAQ</span>
          <h2>
            Typing Test <span className="tt-faq-accent">FAQ</span>
          </h2>
          <p className="tt-guide-lede">Find answers to common questions about the typing test, WPM, accuracy, and leaderboard.</p>
          <a href="#typing-test" className="tt-cta tt-faq-cta">
            <Ico name="play" size={16} />
            Take the Test
            <Ico name="arrow" size={18} />
          </a>
          <div className="tt-faq-art" aria-hidden="true">
            <FaqArt />
          </div>
        </div>
        <div className="tt-faq">
          {TYPING_FAQ.map((item, i) => {
            const icon = FAQ_ICONS[i % FAQ_ICONS.length];
            return (
              <details key={item.question} open={i === 0}>
                <summary>
                  <span className="tt-faq-icon">{icon === "aa" ? <b>Aa</b> : <Ico name={icon} size={22} />}</span>
                  <span className="tt-faq-q">{item.question}</span>
                  <i className="tt-faq-toggle" aria-hidden="true">
                    <span className="tt-faq-plus"><Ico name="plus" size={16} /></span>
                    <span className="tt-faq-chev"><Ico name="chevron" size={16} /></span>
                  </i>
                </summary>
                <p>{item.answer}</p>
              </details>
            );
          })}
        </div>
      </div>

      <p className="tt-seo-links">
        More free tools from SaaS MRKT:{" "}
        <Link href="/tools/saas-spend-calculator">SaaS spend and waste calculator</Link>
        {" · "}
        <Link href="/products">Browse SaaS products</Link>
        {" · "}
        <Link href="/compare">Compare software</Link>
      </p>
    </section>
  );
}
