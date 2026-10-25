import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(fileURLToPath(import.meta.url));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};
const port = Number(process.env.PORT || 8765);
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const relative =
        decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
      const target = path.resolve(root, relative);
      if (!target.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const data = await readFile(target);
      res.writeHead(200, {
        "Content-Type":
          types[path.extname(target)] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Stránka nenalezena.");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Náhled: http://127.0.0.1:${port}`),
  );
