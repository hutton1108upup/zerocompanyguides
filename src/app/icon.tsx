import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #08111d 0%, #10273a 58%, #3c2d12 100%)",
          border: "3px solid #22d3ee",
          color: "#f6c453",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 24,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: -2,
          width: "100%",
        }}
      >
        ZC
      </div>
    ),
    size,
  );
}
