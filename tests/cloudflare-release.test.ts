import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("Cloudflare Workers release contract", () => {
  it("targets the existing Worker with an OpenNext build", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(projectRoot, "package.json"), "utf8"),
    ) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const wranglerConfig = JSON.parse(
      readFileSync(resolve(projectRoot, "wrangler.jsonc"), "utf8"),
    ) as {
      name: string;
      main: string;
      compatibility_flags: string[];
      assets: { directory: string; binding: string };
      services: Array<{ binding: string; service: string }>;
    };

    expect(packageJson.scripts["cf:build"]).toBe(
      "node scripts/cloudflare-build.mjs --adapter",
    );
    expect(packageJson.scripts["cf:deploy"]).toBe("opennextjs-cloudflare deploy");
    expect(packageJson.scripts["cf:upload"]).toBe("opennextjs-cloudflare upload");
    expect(packageJson.devDependencies.esbuild).toBe("0.25.4");

    expect(wranglerConfig).toMatchObject({
      name: "zerocompanyguides",
      main: ".open-next/worker.js",
      assets: {
        directory: ".open-next/assets",
        binding: "ASSETS",
      },
      services: [
        {
          binding: "WORKER_SELF_REFERENCE",
          service: "zerocompanyguides",
        },
      ],
    });
    expect(wranglerConfig.compatibility_flags).toContain("nodejs_compat");
    expect(wranglerConfig.compatibility_flags).toContain(
      "global_fetch_strictly_public",
    );
  });
});
