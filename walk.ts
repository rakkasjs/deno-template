import type {
  AdapterRequestContext,
  HattipHandler,
} from "npm:@hattip/core@0.0.26/index.d.ts";

type DenoHandler = (
  request: Request,
  connInfo: ConnInfo
) => Response | Promise<Response>;

interface ConnInfo {
  readonly localAddr: Deno.Addr;
  readonly remoteAddr: Deno.Addr;
}

// deno-lint-ignore no-namespace
namespace Deno {
  export type Addr = NetAddr | UnixAddr;

  export interface NetAddr {
    transport: "tcp" | "udp";
    hostname: string;
    port: number;
  }

  export interface UnixAddr {
    transport: "unix" | "unixpacket";
    path: string;
  }
}

export interface StaticServeOptions {
  staticDir: string;
  walk(
    root: string | URL,
    options: { includeDirs: false }
  ): AsyncIterableIterator<{ path: string }>;
  serveDir(request: Request, options: { fsRoot: string }): Promise<Response>;
}

export function createRequestHandler(
  hattipHandler: HattipHandler,
  options?: StaticServeOptions
): DenoHandler {
  let staticFiles: Set<string> | undefined;
  let pending: Promise<void> | undefined;

  if (options) {
    console.log("staticDir", options.staticDir);

    pending = (async () => {
      const walker = options.walk(options.staticDir, { includeDirs: false });
      const files = new Set<string>();
      for await (const entry of walker) {
        files.add(
          entry.path.slice(options.staticDir.length).replace(/\\/g, "/")
        );
      }
      staticFiles = files;
    })();
  }

  return async (request, connInfo) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (options) {
      if (!staticFiles) {
        await pending;
      }

      if (staticFiles!.has(pathname)) {
        return options.serveDir(request, { fsRoot: options.staticDir });
      } else if (staticFiles!.has(pathname + "/index.html")) {
        url.pathname = pathname + "/index.html";
        return options.serveDir(new Request(url, request), {
          fsRoot: options.staticDir,
        });
      }
    }

    const context: AdapterRequestContext = {
      request,
      ip: (connInfo.remoteAddr as Deno.NetAddr).hostname,
      waitUntil() {},
      passThrough() {},
      platform: { connInfo },
    };

    return hattipHandler(context);
  };
}
