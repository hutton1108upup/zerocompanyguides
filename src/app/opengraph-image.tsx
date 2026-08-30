import { ImageResponse } from "next/og";
import { siteName } from "../lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = `${siteName} Open Graph image`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgb(10, 16, 28) 0%, rgb(20, 38, 56) 55%, rgb(104, 74, 28) 100%)",
          color: "white",
          padding: "64px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", opacity: 0.72 }}>
          Tactical guide hub
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>{siteName}</div>
          <div style={{ fontSize: 30, maxWidth: 920, color: "rgb(178, 214, 255)" }}>
            Builds, squad planning, trophies, walkthrough routes and launch performance fixes.
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>Unofficial fan-made strategy reference</div>
      </div>
    ),
    size,
  );
}
