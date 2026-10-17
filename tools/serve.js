// 本地预览用的极简静态服务器：node tools/serve.js（其实直接双击 index.html 也能用）
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const PORT = +process.env.PORT || 8765;

http.createServer((req, res) => {
	const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
	const file = path.join(ROOT, rel);
	if (!file.startsWith(ROOT)) return res.writeHead(403).end();
	fs.readFile(file, (err, buf) => {
		if (err) return res.writeHead(404).end("not found");
		res.writeHead(200, { "Content-Type": (TYPES[path.extname(file)] || "application/octet-stream") + "; charset=utf-8", "Cache-Control": "no-store" });
		res.end(buf);
	});
}).listen(PORT, "127.0.0.1", () => console.log(`http://localhost:${PORT}`));
