#!/usr/bin/env node
"use strict";
// 导出 Foundry 自带官方数据中的 NPC 条目（NPC 职业 / 特性 / 模板）待译文字：dist/fvtt/zh-npc.todo.json。
// 用法：node tools/export-npc-todo.js
//
// 来源：source/fvtt/core 与 source/fvtt/official/<补充书> 中的 npc_classes.json、npc_features.json、npc_templates.json
// （与 foundryvtt-lancer 3.1.3 使用的 @massif 数据包版本相同）。核心规则书的 NPC 名册不在 lancer-data 中，Foundry 也不自带。
// 格式同 zh-overrides.json：{ 官方 id: { 字段路径: 英文 } }。译好的文件放到 source/fvtt/zh-npc.json。
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FVTT = path.join(ROOT, "source", "fvtt");
const KINDS = ["npc_classes", "npc_templates", "npc_features"];
// 名称与说明类文字。type、weapon_type、伤害 / 射程类型、标签 id 等是 Foundry 依赖的英文枚举，不译。
const FIELDS = new Set(["name", "description", "effect", "on_hit", "trigger", "tactics", "flavor", "detail", "role_description", "terse"]);
const KIND_ZH = { npc_classes: "NPC 职业", npc_templates: "NPC 模板", npc_features: "NPC 特性" };

function strings(rec) {
	const out = {};
	const walk = (o, p) => {
		if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${p}[${i}]`));
		if (!o || typeof o !== "object") return;
		for (const [k, v] of Object.entries(o)) {
			const at = p ? `${p}.${k}` : k;
			if (typeof v === "string") { if (FIELDS.has(k) && /[A-Za-z]{2,}/.test(v)) out[at] = v; }
			else if (!["tags", "origin", "base_features", "optional_features", "damage", "range"].includes(k)) walk(v, at);
		}
	};
	walk(rec, "");
	return out;
}

function collect() {
	const dirs = [["core", path.join(FVTT, "core")], ...fs.readdirSync(path.join(FVTT, "official")).sort().map(d => [d, path.join(FVTT, "official", d)])];
	const list = [];
	for (const [pack, dir] of dirs) for (const kind of KINDS) {
		const f = path.join(dir, `${kind}.json`);
		if (!fs.existsSync(f)) continue;
		for (const rec of JSON.parse(fs.readFileSync(f, "utf8"))) list.push({ pack, kind, rec, text: strings(rec) });
	}
	return list;
}

if (require.main === module) {
	const list = collect();
	const todo = {
		_说明: "Foundry 官方数据中的 NPC 条目待译文字。键为官方 id 与字段路径；只翻译值，保留 HTML 标签、数字和 {VAL} 这类占位符。术语按 source/fvtt/README.md 的对照表（准度、回避、HP、护盾等）。同一模板名（如 Horror）在模板与特性中要译成同一个词。",
	};
	for (const e of list) todo[e.rec.id] = e.text;
	fs.mkdirSync(path.join(ROOT, "dist", "fvtt"), { recursive: true });
	fs.writeFileSync(path.join(ROOT, "dist", "fvtt", "zh-npc.todo.json"), JSON.stringify(todo, null, "\t") + "\n");
	const fields = list.reduce((n, e) => n + Object.keys(e.text).length, 0);
	const byPack = {};
	for (const e of list) byPack[`${e.pack} ${KIND_ZH[e.kind]}`] = (byPack[`${e.pack} ${KIND_ZH[e.kind]}`] || 0) + 1;
	console.log(`NPC 条目 ${list.length} 个，待译字段 ${fields} 处：dist/fvtt/zh-npc.todo.json`);
	for (const [k, n] of Object.entries(byPack)) console.log(`  ${k}：${n}`);
}

module.exports = { collect, strings };
