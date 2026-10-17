// 一次性工具：把规则站繁中数据 source/tw → 简体 source/cn，并转换界面文件里的繁体字
// 需要 opencc-js：npm install opencc-js 后运行 node tools/to-simplified.js
const fs = require("fs");
const path = require("path");
const OpenCC = require("opencc-js");

const ROOT = path.join(__dirname, "..");
const conv = OpenCC.Converter({ from: "hk", to: "cn" });

const twDir = path.join(ROOT, "source/tw"), cnDir = path.join(ROOT, "source/cn");
fs.mkdirSync(cnDir, { recursive: true });
for (const f of fs.readdirSync(twDir)) {
	fs.writeFileSync(path.join(cnDir, f), conv(fs.readFileSync(path.join(twDir, f), "utf8")));
}
for (const f of ["app.js", "index.html", "tools/build-data.js"]) {
	const p = path.join(ROOT, f);
	fs.writeFileSync(p, conv(fs.readFileSync(p, "utf8")));
}
console.log("done");
