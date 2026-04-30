// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { NodeRequest, sendNodeResponse } from "srvx/node";
import type { PluginOption, ViteDevServer } from "vite";

function tanstackStartFetchableDevFallback(): PluginOption {
  return {
    name: "tanstack-start-fetchable-dev-fallback",
    configureServer(viteDevServer: ViteDevServer) {
      return () => {
        viteDevServer.middlewares.use(async (req, res, next) => {
          const serverEnv = viteDevServer.environments.ssr as unknown as {
            dispatchFetch?: (request: Request) => Promise<Response>;
          };

          if (!serverEnv?.dispatchFetch) {
            return next();
          }

          if (req.originalUrl) {
            req.url = req.originalUrl;
          }

          try {
            const webReq = new NodeRequest({ req, res });
            const webRes = await serverEnv.dispatchFetch(webReq);
            return sendNodeResponse(res, webRes);
          } catch (error) {
            viteDevServer.ssrFixStacktrace(error as Error);
            return next(error);
          }
        });
      };
    },
  };
}

export default defineConfig({
  plugins: [tanstackStartFetchableDevFallback()],
});
