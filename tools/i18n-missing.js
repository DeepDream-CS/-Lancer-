// 列出尚未翻译的条目：node tools/i18n-missing.js [文件名，不含 .json] [最多条数]
// 英文原文完全相同的条目会共用译文（build-data.js 同样处理），所以不算缺。
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../source/i18n");
const all = fs.readdirSync(path.join(dir, "en")).map(f => f.replace(".json", ""));
const load = (lang, f) => { const p = path.join(dir, lang, f + ".json"); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : {}; };
const same = {};
for (const f of all) { const en = load("en", f), zh = load("zh", f); for (const k in zh) if (en[k]) same[en[k]] = zh[k]; }

const files = process.argv[2] ? [process.argv[2]] : all;
const limit = +process.argv[3] || Infinity;
for (const f of files) {
	const en = load("en", f), zh = load("zh", f);
	const miss = Object.keys(en).filter(k => !(k in zh) && !(en[k] in same));
	if (process.argv[2]) console.log(JSON.stringify(Object.fromEntries(miss.slice(0, limit).map(k => [k, en[k]])), null, 1));
	else console.log(f, "缺", miss.length, "/", Object.keys(en).length);
}
