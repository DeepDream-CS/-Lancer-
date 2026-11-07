#!/usr/bin/env node
"use strict";
// 列出官方补充书中车卡器没有收录的条目（扩展内容包没有覆盖，导入 Foundry 后仍是英文），
// 导出待译 JSON：dist/fvtt/zh-official.todo.json，以及清单 docs/FVTT-OFFICIAL-UNCOVERED.md。
// 用法：node tools/export-official-todo.js
//
// JSON 格式与 zh-overrides.json 相同：{ 官方 id: { 字段路径: 英文 } }。译好的文件放到 source/fvtt/zh-official.json。
const fs = require("fs");
const path = require("path");
const { build, loadOfficial, KINDS, TEXT_FIELDS } = require("./build-lcp");

const ROOT = path.join(__dirname, "..");
// 要翻译的字段：名称与说明类文字；类型、标签、频率等枚举值不译（Foundry 依赖英文）
const FIELDS = new Set(["name", "init", "flavor_name", "flavor_description", ...TEXT_FIELDS]);
const KIND_ZH = { frames: "骨架", weapons: "武器", systems: "系统", mods: "武器改装", core_bonuses: "核心奖励", talents: "天赋", pilot_gear: "驾驶员装备" };

function strings(rec) {
	const out = {};
	const walk = (o, p) => {
		if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${p}[${i}]`));
		if (!o || typeof o !== "object") return;
		for (const [k, v] of Object.entries(o)) {
			const at = p ? `${p}.${k}` : k;
			if (typeof v === "string") { if (FIELDS.has(k) && /[A-Za-z]{2,}/.test(v)) out[at] = v; }
			else if (k !== "tags" && k !== "bonuses" && k !== "synergies_locations") walk(v, at);
		}
	};
	walk(rec, "");
	return out;
}

function collect() {
	const { untouched } = build("ext");
	const { byKind } = loadOfficial("official", KINDS);
	return untouched.map(u => {
		const { rec } = byKind[u.kind].get(u.id);
		return { ...u, rec, text: strings(rec) };
	});
}

if (require.main === module) {
	const list = collect();
	const todo = {};
	for (const e of list) todo[e.id] = e.text;
	const dist = path.join(ROOT, "dist", "fvtt");
	fs.mkdirSync(dist, { recursive: true });
	fs.writeFileSync(path.join(dist, "zh-official.todo.json"), JSON.stringify(todo, null, "\t") + "\n");
	const L = ["# 官方补充书中车卡器未收录的条目", "", "由 `node tools/export-official-todo.js` 生成，请勿手改。", "",
		"这些条目在 Foundry 自带的官方补充书数据中，车卡器没有对应的中文，扩展内容包不会覆盖，导入后仍为英文。待译文字在 `dist/fvtt/zh-official.todo.json`。", "",
		"| 补充书 | 类别 | 官方 id | 名称 | 牌照 | 待译字段 |", "|---|---|---|---|---|---|"];
	for (const e of list) {
		const lic = e.rec.license ? `${e.rec.license} ${e.rec.license_level ?? ""}`.trim() : "—";
		L.push(`| ${e.pack} | ${KIND_ZH[e.kind] || e.kind} | ${e.id} | ${String(e.rec.name).replace(/\|/g, "\\|")} | ${lic} | ${Object.keys(e.text).length} |`);
	}
	L.push("", `共 ${list.length} 条，待译字段 ${list.reduce((n, e) => n + Object.keys(e.text).length, 0)} 处。`);
	fs.writeFileSync(path.join(ROOT, "docs", "FVTT-OFFICIAL-UNCOVERED.md"), L.join("\n") + "\n");
	console.log(`官方未收录条目 ${list.length} 条，待译字段 ${list.reduce((n, e) => n + Object.keys(e.text).length, 0)} 处：dist/fvtt/zh-official.todo.json、docs/FVTT-OFFICIAL-UNCOVERED.md`);
}

module.exports = { collect, strings };
