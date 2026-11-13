const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123"; // misma clave que en index.html
const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css", ".json": "application/json", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/save") {
    if (req.headers["x-admin-pass"] !== ADMIN_PASS) { res.writeHead(401); return res.end("No autorizado"); }
    let body = "";
    req.on("data", c => { body += c; if (body.length > 20e6) req.destroy(); });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!Array.isArray(data)) throw new Error("formato");
        const file = path.join(ROOT, "data.js");
        if (fs.existsSync(file)) fs.copyFileSync(file, file + ".bak");
        fs.writeFileSync(file, "window.DATA=" + JSON.stringify(data, null, 1) + ";");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end('{"ok":true}');
      } catch (e) { res.writeHead(400); res.end("Datos inválidos"); }
    });
    return;
  }
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("No encontrado"); }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(buf);
  });
}).listen(PORT, () => console.log("http://localhost:" + PORT));