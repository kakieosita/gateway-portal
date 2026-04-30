// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { createRunnableDevEnvironment } from "vite";

const createSsrDevEnvironment = ((name, config, context) =>
  createRunnableDevEnvironment(name, config, context)) as NonNullable<
  NonNullable<NonNullable<import("vite").UserConfig["environments"]>["ssr"]>["dev"]
>["createEnvironment"];

export default defineConfig({
  tanstackStart: {
    vite: {
      installDevServerMiddleware: true,
    },
  },
  vite: {
    environments: {
      ssr: {
        dev: {
          createEnvironment: createSsrDevEnvironment,
        },
      },
    },
  },
});
