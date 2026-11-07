"use strict";
// 生成 Foundry VTT 模组「LANCER 中文」（lancer-cn）：LANCER 系统界面中文翻译，并补上中文骨架名导致缺失的骨架插图。
// 用法：
//   node tools/build-fvtt-module.js                → dist/fvtt/lancer-cn/ 与 dist/fvtt/lancer-cn.zip
//   node tools/build-fvtt-module.js --art <retrograde-map.ts>
//        从 foundryvtt-lancer 的 src/module/actor/retrograde-map.ts 重新生成骨架插图表（source/fvtt/module/frame-art.json）
//
// 来源：
// - source/fvtt/module/cn-flat.json：译文，键与系统 lang/en.json 的路径相同（扁平写法），构建时还原为嵌套结构。
// - source/fvtt/module/system-en.json：foundryvtt-lancer v3.1.3 的 lang/en.json 快照，用于核对键与占位符。
// - source/fvtt/module/frame-art.json：骨架 id → 插图路径。
// - source/fvtt/module/module.json、scripts/：模组清单与脚本。

const fs = require("fs");
const path = require("path");
const { zip } = require("./build-lcp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "source", "fvtt", "module");
const OUT_DIR = path.join(ROOT, "dist", "fvtt", "lancer-cn");
const OUT_ZIP = path.join(ROOT, "dist", "fvtt", "lancer-cn.zip");
const readJson = f => JSON.parse(fs.readFileSync(f, "utf8"));

const flatten = (o, p = "", out = {}) => {
	for (const [k, v] of Object.entries(o)) {
		const key = p ? `${p}.${k}` : k;
		if (v && typeof v === "object") flatten(v, key, out); else out[key] = v;
	}
	return out;
};
// 按英文文件的嵌套结构还原（键名本身可能含「.」以外的符号，如「ips-n」「3plus」）
function nestLike(template, flat, p = "") {
	const out = {};
	for (const [k, v] of Object.entries(template)) {
		const key = p ? `${p}.${k}` : k;
		if (v && typeof v === "object") out[k] = nestLike(v, flat, key);
		else if (key in flat) out[k] = flat[key];
	}
	return out;
}

// 占位符与 Foundry 富文本引用：{name}、@LancerID[...]、@Compendium[...]
const tokensOf = s => (String(s).match(/\{[^}]+\}|@\w+\[[^\]]+\]/g) || []).sort().join(" ");
// 只认小写 HTML 标签；「<MECH//STATS>」这类全大写的风格化标签名不是 HTML
const tagsOf = s => (String(s).match(/<\/?[a-z][a-z0-9]*\b[^>]*>/g) || []).sort().join("");

function checkTranslation(en, cn) {
	const problems = [];
	const flatEn = flatten(en);
	for (const k of Object.keys(flatEn)) if (!(k in cn)) problems.push(`缺少译文：${k}`);
	for (const k of Object.keys(cn)) if (!(k in flatEn)) problems.push(`英文中没有这个键：${k}`);
	for (const [k, v] of Object.entries(cn)) {
		if (!(k in flatEn)) continue;
		if (typeof v !== "string" || !v.trim()) problems.push(`译文为空：${k}`);
		if (tokensOf(flatEn[k]) !== tokensOf(v)) problems.push(`占位符不一致：${k}（原文 ${tokensOf(flatEn[k]) || "无"}，译文 ${tokensOf(v) || "无"}）`);
		if (tagsOf(flatEn[k]) !== tagsOf(v)) problems.push(`HTML 标签不一致：${k}`);
	}
	return problems;
}

// ---- 骨架插图表：Foundry 按英文名查插图；这里换成按骨架 id 查
function buildFrameArt(retroFile) {
	const ts = fs.readFileSync(retroFile, "utf8");
	const byName = {};
	for (const m of ts.matchAll(/^\s*(?:"([^"]+)"|([A-Z0-9_]+)):\s*"([^"]+)"/gm)) byName[(m[1] || m[2]).toUpperCase()] = m[3];
	const frames = [];
	const addFrames = f => { if (fs.existsSync(f)) frames.push(...readJson(f)); };
	addFrames(path.join(ROOT, "source/fvtt/core/frames.json"));
	const offDir = path.join(ROOT, "source/fvtt/official");
	for (const p of fs.readdirSync(offDir)) addFrames(path.join(offDir, p, "frames.json"));
	const art = {};
	// Foundry 的 frameToPath：名称去掉首尾空白后转大写
	for (const f of frames) { const a = byName[String(f.name).trim().toUpperCase()]; if (a) art[f.id] = a; }
	// 车卡器扩展：没有插图的变体骨架沿用原骨架插图。覆盖官方条目的按官方 id 收录
	// （例如珠穆朗玛在 Foundry 中没有插图，沿用埃弗勒斯）。
	const vm = require("vm");
	const ctx = { window: {} };
	vm.createContext(ctx);
	vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8"), ctx);
	const map = readJson(path.join(ROOT, "source/fvtt/official-map.json"));
	for (const f of ctx.window.LANCER_DATA.frames.filter(x => x.ext)) {
		const id = map[f.id] || f.id;
		const base = f.variant_of && (map[f.variant_of] || f.variant_of);
		if (!art[id] && base && art[base]) art[id] = art[base];
	}
	return Object.fromEntries(Object.entries(art).sort());
}

// ---- 写死的英文：cn-hardcoded.json（译文）对照 hardcoded-en.json（tools/scan-fvtt-labels.js 扫描的快照）
// 值为字符串：译文；null：有意保留英文（开发调试信息、教程示例名）；{ pieces }：原文被标签拆成几段，按段翻译。
const placeholders = s => {
	const xs = (s.match(/\{x\}/g) || []).length;
	const ns = new Set(s.match(/\{\d\}/g) || []).size;
	return xs + ns;
};
const literalLength = s => s.replace(/\{x\}/g, "").length;

function checkHardcoded(snapshot, hc, words) {
	const problems = [];
	const text = hc.text || {};
	for (const k of Object.keys(snapshot)) if (!(k in text)) problems.push(`写死的英文缺少译文：${JSON.stringify(k)}`);
	for (const k of Object.keys(text)) if (!(k in snapshot)) problems.push(`快照中没有这段英文：${JSON.stringify(k)}`);
	const checkPair = (k, v) => {
		if (typeof v !== "string") return problems.push(`译文类型不对：${JSON.stringify(k)}`);
		if (placeholders(k) !== placeholders(v)) problems.push(`{x} 数量不一致：${JSON.stringify(k)} → ${JSON.stringify(v)}`);
		if (/^\{x\}$/.test(k.trim())) problems.push(`句式不能只有 {x}：${JSON.stringify(k)}`);
	};
	for (const [k, v] of Object.entries(text)) {
		if (v === null) continue;
		if (v && typeof v === "object") {
			if (!v.pieces || !Object.keys(v.pieces).length) problems.push(`pieces 为空：${JSON.stringify(k)}`);
			else for (const [pk, pv] of Object.entries(v.pieces)) checkPair(pk, pv);
		} else checkPair(k, v);
	}
	for (const [w, v] of Object.entries(words)) if (typeof v !== "string" || !v) problems.push(`枚举词译文为空：${w}`);
	for (const [sel, dict] of Object.entries(hc.context || {})) {
		for (const [k, v] of Object.entries(dict)) {
			if (!(k in text) && !(k in words)) problems.push(`context ${sel} 的 ${JSON.stringify(k)} 不在词典里`);
			if (typeof v !== "string") problems.push(`context ${sel} 的译文类型不对：${JSON.stringify(k)}`);
		}
	}
	return problems;
}

// 运行时词典：整段替换与句式分开，句式按固定文字由长到短排列（长的更具体，先匹配）
function compileHardcoded(hc, words) {
	const exact = {};
	const patterns = [];
	const add = (k, v) => (k.includes("{x}") ? patterns.push([k, v]) : (exact[k] = v));
	for (const [k, v] of Object.entries(hc.text || {})) {
		if (v === null) continue;
		if (typeof v === "object") for (const [pk, pv] of Object.entries(v.pieces)) add(pk, pv);
		else add(k, v);
	}
	patterns.sort((a, b) => literalLength(b[0]) - literalLength(a[0]) || a[0].localeCompare(b[0]));
	return { exact, patterns, words, context: hc.context || {} };
}

// ---- 车卡器资料：专业牌照（及其装备）、扩展厂商（及其骨架、专业牌照）
function loadData() {
	const vm = require("vm");
	const ctx = { window: {} };
	vm.createContext(ctx);
	vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8"), ctx);
	return ctx.window.LANCER_DATA;
}
function buildReference(D = loadData()) {
	const problems = [];
	const map = readJson(path.join(ROOT, "source/fvtt/official-map.json"));
	const lidOf = x => map[x.id] || x.id; // 内容包中的 id（覆盖官方条目时为官方 id）
	const nameOf = x => x.zh_name || x.name;
	const gear = ["weapons", "systems", "mods", "pilot_gear"].flatMap(kind => D[kind].map(x => ({ kind, x })));
	const professional = (D.professional_licenses || []).map(pl => {
		const items = gear.filter(g => g.x.professional_license === pl.id)
			.map(({ kind, x }) => ({ kind, lid: lidOf(x), name: nameOf(x), level: x.license_level || pl.rank }));
		if (!items.length) problems.push(`专业牌照 ${pl.id} 没有装备`);
		for (const it of items) if (it.level !== pl.rank) problems.push(`专业牌照 ${pl.id}（${pl.rank} 级）的 ${it.lid} 等级为 ${it.level}`);
		return { id: pl.id, name: pl.name, maker: pl.source, rank: pl.rank, description: pl.description || "", items };
	});
	// 只收车卡器有说明的扩展厂商；核心五家在 Foundry 里已有，车卡器也没有说明文字
	const makers = D.manufacturers.filter(m => (m.description || "").trim()).map(m => ({
		id: m.id, name: m.name, color: m.color || "", description: m.description,
		frames: D.frames.filter(f => f.source === m.id).map(f => ({ lid: lidOf(f), name: nameOf(f) })),
		professional: professional.filter(p => p.maker === m.id).map(p => `${p.name}（${["", "I", "II", "III"][p.rank]}）`),
	}));
	const rules = readJson(path.join(SRC, "professional-rules.json"));
	return { reference: { professional, makers, rules }, problems };
}

function build() {
	const en = readJson(path.join(SRC, "system-en.json"));
	const cn = readJson(path.join(SRC, "cn-flat.json"));
	const manifest = readJson(path.join(SRC, "module.json"));
	const art = readJson(path.join(SRC, "frame-art.json"));
	const snapshot = readJson(path.join(SRC, "hardcoded-en.json"));
	const hc = readJson(path.join(SRC, "cn-hardcoded.json"));
	const words = readJson(path.join(SRC, "cn-words.json"));
	const { reference, problems: refProblems } = buildReference();
	const problems = [...checkTranslation(en, cn), ...checkHardcoded(snapshot, hc, words), ...refProblems];
	const hardcoded = compileHardcoded(hc, words);
	const lang = nestLike(en, cn);
	const script = fs.readFileSync(path.join(SRC, "scripts", "lancer-cn.mjs"), "utf8")
		.replace("/*FRAME_ART*/{}", JSON.stringify(art))
		.replace("/*HARDCODED*/{ exact: {}, patterns: [], words: {}, context: {} }", JSON.stringify(hardcoded))
		.replace("/*REFERENCE*/{ professional: [], makers: [], rules: [] }", JSON.stringify(reference));
	const files = [
		["module.json", JSON.stringify(manifest, null, 2)],
		["lang/cn.json", JSON.stringify(lang, null, 2)],
		["scripts/lancer-cn.mjs", script],
		["README.md", fs.readFileSync(path.join(SRC, "README.md"), "utf8")],
	];
	return { files, problems, manifest, art, lang, en, cn, hc, snapshot, hardcoded, reference };
}

if (require.main === module) {
	const i = process.argv.indexOf("--art");
	if (i > 0) {
		const art = buildFrameArt(process.argv[i + 1]);
		fs.writeFileSync(path.join(SRC, "frame-art.json"), JSON.stringify(art, null, "\t") + "\n");
		console.log(`骨架插图表：${Object.keys(art).length} 个骨架`);
	}
	const { files, problems, manifest, art } = build();
	if (problems.length) { console.error("译文问题：\n  " + problems.join("\n  ")); process.exitCode = 1; }
	fs.rmSync(OUT_DIR, { recursive: true, force: true });
	for (const [name, text] of files) {
		const f = path.join(OUT_DIR, name);
		fs.mkdirSync(path.dirname(f), { recursive: true });
		fs.writeFileSync(f, text);
	}
	fs.writeFileSync(OUT_ZIP, zip(files));
	console.log(`模组 ${manifest.id} ${manifest.version}：dist/fvtt/lancer-cn/ 与 dist/fvtt/lancer-cn.zip（${files.length} 个文件，骨架插图 ${Object.keys(art).length} 个）`);
}

module.exports = { build, checkTranslation, checkHardcoded, compileHardcoded, flatten, tokensOf };
