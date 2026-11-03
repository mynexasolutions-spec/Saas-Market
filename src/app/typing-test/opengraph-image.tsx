import { ImageResponse } from "next/og";
import { getDefaultBench } from "@/lib/typing-benchmark";

export const revalidate = 300;

export const alt = "Typing speed test: can you beat the score on the leaderboard?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link preview for /typing-test, so a shared "Challenge a friend" link shows the benchmark.
export default async function Image() {
  const bench = await getDefaultBench();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #f7f3ff 0%, #e3d8ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 660 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 24px",
              borderRadius: 999,
              background: "#ffffff",
              border: "2px solid #d6c9ff",
              color: "#5b3fd6",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            SaaS MRKT · Typing Speed Test
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 76, fontWeight: 800, color: "#0f172a", lineHeight: 1.05 }}>
            {bench.team ? "Can you beat our" : "Can you beat the top"}
          </div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800, color: "#6d4df2", lineHeight: 1.05 }}>
            {bench.wpm} WPM?
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, color: "#475569", lineHeight: 1.35 }}>
            Free 30, 45 and 60 second test with a live leaderboard.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 340,
            height: 340,
            borderRadius: 999,
            background: "linear-gradient(145deg, #7c5cf0 0%, #4c1d95 100%)",
            border: "14px solid #ffffff",
            boxShadow: "0 30px 60px rgba(76, 29, 149, 0.35)",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", fontSize: 150, fontWeight: 800, lineHeight: 1 }}>{bench.wpm}</div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: 6, color: "#ddd0ff" }}>WPM</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
