import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

export function selectBuildTarget(args, env) {
  const adapterRequested = args.includes("--adapter");
  const dashboardBuild =
    env.WORKERS_CI === "1" && env.OPEN_NEXT_ADAPTER_BUILD !== "1";

  return adapterRequested || dashboardBuild ? "opennext" : "next";
}

function runBuild() {
  const target = selectBuildTarget(process.argv.slice(2), process.env);
  const entryPoint =
    target === "opennext"
      ? resolve(
          dirname(require.resolve("@opennextjs/cloudflare")),
          "../cli/index.js",
        )
      : require.resolve("next/dist/bin/next");
  const env =
    target === "opennext"
      ? { ...process.env, OPEN_NEXT_ADAPTER_BUILD: "1" }
      : process.env;
  const result = spawnSync(process.execPath, [entryPoint, "build"], {
    env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  runBuild();
}
