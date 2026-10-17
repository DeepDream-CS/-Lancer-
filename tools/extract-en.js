// 把界面上仍会显示的英文抽出到 source/i18n/en/*.json（键为「id.字段路径」），供翻译对照
// 翻译放在 source/i18n/zh/ 下同名文件，build-data.js 会合并
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ld = f => JSON.parse(fs.readFileSync(path.join(ROOT, "source/lancer-data", f + ".json"), "utf8"));
const out = {};
const put = (file, key, val) => { if (val && typeof val === "string") (out[file] = out[file] || {})[key] = val; };
// 动作与可展开物（无人机、地雷等）
function acts(file, prefix, o) {
	for (const k of ["actions", "active_actions", "passive_actions"]) {
		if (!Array.isArray(o[k])) continue;
		o[k].forEach((a, i) => { for (const f of ["name", "trigger", "detail"]) put(file, `${prefix}.${k}.${i}.${f}`, a[f]); });
	}
	for (const k of ["deployables", "active_deployables"]) {
		if (!Array.isArray(o[k])) continue;
		o[k].forEach((d, i) => {
			for (const f of ["name", "detail"]) put(file, `${prefix}.${k}.${i}.${f}`, d[f]);
			acts(file, `${prefix}.${k}.${i}`, d);
		});
	}
}

for (const f of ld("frames")) {
	const file = "frames-" + (f.source === "GMS" ? "ha" : f.source.toLowerCase());
	put(file, `${f.id}.description`, f.description);
	f.traits.forEach((t, i) => { put(file, `${f.id}.traits.${i}.name`, t.name); put(file, `${f.id}.traits.${i}.description`, t.description); });
	for (const k of ["name", "active_name", "active_effect", "passive_name", "passive_effect"]) put(file, `${f.id}.core_system.${k}`, f.core_system[k]);
	f.traits.forEach((t, i) => acts(file, `${f.id}.traits.${i}`, t));
	acts(file, `${f.id}.core_system`, f.core_system);
}
const ws = ld("weapons");
ws.forEach((w, n) => {
	const file = n < ws.length / 2 ? "weapons-1" : "weapons-2";
	put(file, `${w.id}.zh_name`, w.name);
	for (const k of ["effect", "on_hit", "on_crit", "on_attack"]) {
		if (w[k] && typeof w[k] === "object") put(file, `${w.id}.${k}.detail`, w[k].detail);
		else put(file, `${w.id}.${k}`, w[k]);
	}
	(w.profiles || []).forEach((p, i) => { put(file, `${w.id}.profiles.${i}.name`, p.name); put(file, `${w.id}.profiles.${i}.effect`, p.effect); acts(file, `${w.id}.profiles.${i}`, p); });
	acts(file, w.id, w);
});
const ss = ld("systems");
ss.forEach((s, n) => {
	const file = n < ss.length / 2 ? "systems-1" : "systems-2";
	put(file, `${s.id}.zh_name`, s.name);
	put(file, `${s.id}.effect`, s.effect);
	acts(file, s.id, s);
});
for (const m of ld("mods")) {
	put("misc", `${m.id}.zh_name`, m.name);
	put("misc", `${m.id}.effect`, m.effect);
	if (m.on_hit && typeof m.on_hit === "object") put("misc", `${m.id}.on_hit.detail`, m.on_hit.detail);
	acts("misc", m.id, m);
}
for (const t of ld("tags")) { put("misc", `${t.id}.name`, t.name); put("misc", `${t.id}.description`, t.description); }
for (const s of ld("skills")) put("misc", `${s.id}.description`, s.description);
for (const t of ld("talents")) put("misc", `${t.id}.terse`, t.terse);
for (const g of ld("pilot_gear")) put("misc", `${g.id}.description`, g.description);

const dir = path.join(ROOT, "source/i18n/en");
fs.mkdirSync(dir, { recursive: true });
for (const [f, o] of Object.entries(out)) fs.writeFileSync(path.join(dir, f + ".json"), JSON.stringify(o, null, 1));
console.log(Object.fromEntries(Object.entries(out).map(([f, o]) => [f, JSON.stringify(o).length])));
