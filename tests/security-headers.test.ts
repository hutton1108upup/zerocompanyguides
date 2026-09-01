import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

type HeaderRule = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

describe("security headers", () => {
  it("applies document security headers through Next config", async () => {
    const config = nextConfig as typeof nextConfig & {
      headers?: () => Promise<HeaderRule[]>;
    };
    const rules = await config.headers?.();
    const rule = rules?.find((entry) => entry.source === "/:path*");
    const headers = Object.fromEntries(
      (rule?.headers ?? []).map((header) => [header.key, header.value]),
    );

    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["Content-Security-Policy-Report-Only"]).toContain(
      "frame-src https://www.youtube-nocookie.com",
    );
    expect(headers["Content-Security-Policy-Report-Only"]).toContain(
      "https://*.clarity.ms",
    );
  });
});
