import { describe, expect, it } from "vitest";
import { selectBuildTarget } from "../scripts/cloudflare-build.mjs";

describe("Cloudflare build command router", () => {
  it("keeps a normal local build on Next.js", () => {
    expect(selectBuildTarget([], {})).toBe("next");
  });

  it("adapts the dashboard's default build command in Workers CI", () => {
    expect(selectBuildTarget([], { WORKERS_CI: "1" })).toBe("opennext");
  });

  it("runs Next.js inside the OpenNext child build instead of recursing", () => {
    expect(
      selectBuildTarget([], {
        WORKERS_CI: "1",
        OPEN_NEXT_ADAPTER_BUILD: "1",
      }),
    ).toBe("next");
  });

  it("allows cf:build to request OpenNext explicitly", () => {
    expect(selectBuildTarget(["--adapter"], {})).toBe("opennext");
  });
});
