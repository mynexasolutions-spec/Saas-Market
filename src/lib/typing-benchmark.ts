import { serviceClient } from "@/lib/supabase/server";
import { DEFAULT_DURATION, resolveBench, type Bench } from "@/lib/typing";

// The score to beat for the default test length, read for server-rendered pages and share images.
// If the database can't be reached it falls back to the team's score instead of failing the page.
export async function getDefaultBench(): Promise<Bench> {
  try {
    const { data, error } = await serviceClient()
      .from("typing_scores")
      .select("name,wpm")
      .eq("duration_seconds", DEFAULT_DURATION)
      .order("wpm", { ascending: false })
      .order("accuracy", { ascending: false })
      .order("updated_at", { ascending: true })
      .limit(1);
    if (error) return resolveBench(null);
    const top = data?.[0];
    return resolveBench(top ? { name: String(top.name), wpm: Number(top.wpm) } : null);
  } catch {
    return resolveBench(null);
  }
}
