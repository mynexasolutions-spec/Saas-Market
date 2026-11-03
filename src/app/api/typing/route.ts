import { NextRequest, NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/server";
import {
  MAX_KEYS_PER_SECOND,
  DURATIONS,
  MAX_WPM,
  cleanName,
  computeScore,
  isDuration,
  isValidEmail,
  isValidName,
} from "@/lib/typing";

const NO_STORE = { "Cache-Control": "no-store" };
const TOP_N = 50;

// Best-effort limiter (per server instance); the real guard is one best row per email.
const recentPosts = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentPosts.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  recentPosts.set(ip, recent);
  if (recentPosts.size > 5000) recentPosts.clear();
  return recent.length > 12;
}

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: NO_STORE });
}

// Fastest score for each test length: this is what the page shows as the score to beat.
async function benchmarks() {
  const db = serviceClient();
  const results = await Promise.all(
    DURATIONS.map((d) =>
      db
        .from("typing_scores")
        .select("name,wpm")
        .eq("duration_seconds", d)
        .order("wpm", { ascending: false })
        .order("accuracy", { ascending: false })
        .order("updated_at", { ascending: true })
        .limit(1),
    ),
  );
  if (results.some((r) => r.error)) {
    console.error("typing_benchmarks_failed", { code: results.find((r) => r.error)?.error?.code });
    return fail(503, "Leaderboard unavailable.");
  }
  const out: Record<string, { name: string; wpm: number } | null> = {};
  DURATIONS.forEach((d, i) => {
    const top = results[i].data?.[0];
    out[String(d)] = top ? { name: String(top.name), wpm: Number(top.wpm) } : null;
  });
  return NextResponse.json({ benchmarks: out }, { headers: NO_STORE });
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.has("benchmarks")) return benchmarks();
  const duration = Number(request.nextUrl.searchParams.get("duration") ?? 30);
  if (!isDuration(duration)) return fail(400, "Unknown test length.");

  const db = serviceClient();
  const [top, count] = await Promise.all([
    db
      .from("typing_scores")
      .select("name,wpm,accuracy")
      .eq("duration_seconds", duration)
      .order("wpm", { ascending: false })
      .order("accuracy", { ascending: false })
      .order("updated_at", { ascending: true })
      .limit(TOP_N),
    db.from("typing_scores").select("id", { count: "exact", head: true }).eq("duration_seconds", duration),
  ]);
  if (top.error || count.error) {
    console.error("typing_leaderboard_failed", { code: top.error?.code ?? count.error?.code });
    return fail(503, "Leaderboard unavailable.");
  }

  return NextResponse.json(
    {
      entries: top.data.map((row) => ({
        name: String(row.name),
        wpm: Number(row.wpm),
        accuracy: Number(row.accuracy),
      })),
      total: count.count ?? 0,
    },
    { headers: NO_STORE },
  );
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return fail(429, "Too many attempts. Please wait a minute.");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Invalid request.");
  }

  const name = cleanName(typeof body.name === "string" ? body.name : "");
  const email = (typeof body.email === "string" ? body.email : "").trim().toLowerCase();
  if (!isValidName(name)) return fail(400, "Enter a name between 2 and 30 characters.");
  if (!isValidEmail(email)) return fail(400, "Enter a valid email address.");

  const { duration, correctChars, correctKeystrokes, totalKeystrokes } = body;
  if (!isDuration(duration)) return fail(400, "Unknown test length.");
  const counts = [correctChars, correctKeystrokes, totalKeystrokes];
  if (!counts.every((n) => typeof n === "number" && Number.isInteger(n) && n >= 0)) {
    return fail(400, "Invalid score.");
  }
  const [chars, correctKeys, totalKeys] = counts as number[];
  // Final correct characters can't outnumber the correct keystrokes that produced them.
  if (chars > correctKeys || correctKeys > totalKeys || totalKeys > duration * MAX_KEYS_PER_SECOND) {
    return fail(400, "Invalid score.");
  }

  const score = computeScore(duration, chars, correctKeys, totalKeys);
  if (score.wpm > MAX_WPM) return fail(422, "That score looks automated, so it wasn't recorded.");
  if (score.wpm < 1) return fail(422, "Type a little more to get on the board.");

  const db = serviceClient();
  const existing = await db
    .from("typing_scores")
    .select("id,wpm,attempts")
    .eq("email", email)
    .eq("duration_seconds", duration)
    .maybeSingle();
  if (existing.error) {
    console.error("typing_lookup_failed", { code: existing.error.code });
    return fail(503, "Leaderboard unavailable.");
  }

  let best = score.wpm;
  let improved = true;
  if (!existing.data) {
    const inserted = await db.from("typing_scores").insert({
      email,
      name,
      duration_seconds: duration,
      wpm: score.wpm,
      accuracy: score.accuracy,
    });
    if (inserted.error) {
      console.error("typing_insert_failed", { code: inserted.error.code });
      return fail(503, "Couldn't save your score.");
    }
  } else {
    const previousBest = Number(existing.data.wpm);
    improved = score.wpm > previousBest;
    best = Math.max(previousBest, score.wpm);
    const changes = improved
      ? { name, wpm: score.wpm, accuracy: score.accuracy, attempts: existing.data.attempts + 1, updated_at: new Date().toISOString() }
      : { attempts: existing.data.attempts + 1 };
    const updated = await db.from("typing_scores").update(changes).eq("id", existing.data.id);
    if (updated.error) {
      console.error("typing_update_failed", { code: updated.error.code });
      return fail(503, "Couldn't save your score.");
    }
  }

  const [ahead, total] = await Promise.all([
    db.from("typing_scores").select("id", { count: "exact", head: true }).eq("duration_seconds", duration).gt("wpm", best),
    db.from("typing_scores").select("id", { count: "exact", head: true }).eq("duration_seconds", duration),
  ]);

  return NextResponse.json(
    { best, improved, rank: (ahead.count ?? 0) + 1, total: total.count ?? 1, ...score },
    { headers: NO_STORE },
  );
}
