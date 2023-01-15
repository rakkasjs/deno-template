import { createRequestHandler } from "./walk.ts";
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { fromFileUrl } from "https://deno.land/std@0.170.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.170.0/fs/walk.ts";
import { serveDir } from "https://deno.land/std@0.170.0/http/file_server.ts";

// deno-lint-ignore no-explicit-any
(globalThis as any).process = { env: Deno.env.toObject() };

const { default: handler } = await import("./dist/server/hattip.mjs");

serve(
  createRequestHandler(handler, {
    staticDir: fromFileUrl(
      new URL(
        // Bundled entry sits next to the client directory
        Deno.env.get("DENO_DEPLOYMENT_ID") ? "./client" : "./dist/client",
        import.meta.url
      )
    ),
    walk,
    serveDir,
  }),
  { port: Number(Deno.env.get("PORT")) || 3000 }
);
