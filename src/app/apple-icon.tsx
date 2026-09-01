import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #08111d 0%, #10273a 58%, #3c2d12 100%)",
          border: "8px solid #22d3ee",
          borderRadius: 36,
          color: "#f6c453",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 72,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: -6,
          width: "100%",
        }}
      >
        ZC
      </div>
    ),
    size,
  );
}
