// 术语高亮自检：在所有会显示的文字中跑一遍术语匹配，按术语列出命中次数与上下文，便于找出「字面意义」的误标。
// 用法：node tools/glossary-audit.js [术语] [条数]    不带参数时输出每个术语的命中数与 3 条样例
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const el = () => ({ innerHTML: "", classList: { toggle() {}, add() {}, remove() {} }, querySelectorAll() { return []; }, value: "", style: {} });
const elements = new Map();
const ctx = vm.createContext({ console, window: { scrollTo() {} }, document: { body: el(), addEventListener() {}, getElementById(id) { if (!elements.has(id)) elements.set(id, el()); return elements.get(id); }, querySelectorAll() { return []; } }, localStorage: { getItem() { return null; }, setItem() {} }, navigator: {}, confirm: () => true, setTimeout, clearTimeout, URL, Blob });
for (const f of ["data.js", "wizard.js", "cardexport.js", "rules.js", "glossary.js", "ui.js", "app.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
const run = code => vm.runInContext(code, ctx);
// 语料：数据里的全部字符串（去 HTML），以及界面脚本里的中文字符串
const texts = [];
const walk = v => { if (typeof v === "string") texts.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
walk(run("({...D, tags: undefined, rules: undefined})"));
for (const f of ["wizard.js", "app.js", "ui.js"]) for (const m of fs.readFileSync(path.join(root, f), "utf8").matchAll(/[`"']([^`"'\n]*[一-鿿][^`"'\n]*)[`"']/g)) texts.push(m[1]);
const plain = texts.map(t => t.replace(/<br\s*\/?>/g, "\n").replace(/<\/(p|li|div|td|th|h\d)>/g, "\n").replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<")).flatMap(t => t.split("\n")).filter(t => /[一-鿿]/.test(t));
const G = run("getGlossary()");
const hits = {};
for (const t of new Set(plain)) {
	G.re.lastIndex = 0;
	let m;
	while ((m = G.re.exec(t))) {
		const idx = G.byIdx[m.findIndex((x, k) => k > 0 && x !== undefined) - 1];
		if (idx < 0) continue;
		const term = G.list[idx].term;
		(hits[term] = hits[term] || []).push(t.slice(Math.max(0, m.index - 10), m.index) + "【" + m[0] + "】" + t.slice(m.index + m[0].length, m.index + m[0].length + 10));
	}
}
const [only, n] = [process.argv[2], +process.argv[3] || 3];
for (const [term, list] of Object.entries(hits).sort((a, b) => b[1].length - a[1].length)) {
	if (only && term !== only) continue;
	console.log(`${term}  ×${list.length}`);
	const step = Math.max(1, Math.floor(list.length / n));
	for (let i = 0; i < list.length && i / step < n; i += step) console.log("   ", list[i].replace(/\s+/g, " "));
}
