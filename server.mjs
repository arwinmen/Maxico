import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.MM2_PORT || 4173);
const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml"
};

createServer(async (req, res) => {
  const raw = decodeURIComponent((req.url || "/").split("?")[0]);
  const relative = normalize(raw).replace(/^(\.\.[/\\])+/, "");
  let target = join(root, relative === "/" ? "index.html" : relative);
  if (!target.startsWith(root)) target = join(root, "index.html");
  try {
    const info = await stat(target);
    if (info.isDirectory()) target = join(target, "index.html");
    const body = await readFile(target);
    res.writeHead(200, {
      "content-type": types[extname(target)] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(root, "index.html"));
      res.writeHead(200, { "content-type": types[".html"] });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`MM2 disponible en http://localhost:${port}`);
});
