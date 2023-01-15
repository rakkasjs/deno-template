import { defineConfig, PluginOption } from "npm:vite@4.0.4";
import rakkas from "npm:rakkasjs@0.6.12/vite-plugin";

// deno-lint-ignore no-explicit-any
(globalThis as any).process = { env: Deno.env.toObject() };

const dirname = new URL(".", import.meta.url).pathname;

export default defineConfig({
  plugins: [
    // Help Vite resolve the client and env entries
    {
      name: "resolve-vite-client",
      enforce: "pre",
      resolveId(id) {
        if (id.endsWith("node_modules/vite/dist/client/client.mjs")) {
          return (
            dirname +
            "/node_modules/.deno/rakkasjs@0.6.12/node_modules/vite/dist/client/client.mjs"
          );
        } else if (id.endsWith("node_modules/vite/dist/client/env.mjs")) {
          return (
            dirname +
            "/node_modules/.deno/rakkasjs@0.6.12/node_modules/vite/dist/client/env.mjs"
          );
        }
      },
    },
    rakkas() as PluginOption,
  ],
});
