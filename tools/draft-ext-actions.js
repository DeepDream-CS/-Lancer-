#!/usr/bin/env node
"use strict";
// 从扩展内容包的正文里找出「以一个快速动作……」「可用反应……」这类本角色的动作，生成 Foundry 动作按钮的草稿：
// source/fvtt/ext-actions.json。build-lcp.js 按这个文件给新增的扩展条目加动作（说明块形式的动作已由 build-lcp 自动转换）。
//
// 用法：node tools/draft-ext-actions.js          只列出草稿，不写文件
//       node tools/draft-ext-actions.js --write  写入（已有文件时保留人工改过的条目，只补新出现的）
//
// 草稿是按句式推测的，写入后请核对：名称、类型（Quick / Full / Free / Reaction / Protocol / Quick Tech / Full Tech / Invade）、
// 频率（1/Round 等）、触发与说明；不需要的条目整条删掉，写成 [] 表示该条目不加动作（以后重新生成也不会再补）。
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FILE = path.join(ROOT, "source", "fvtt", "ext-actions.json");
process.env.LCP_NO_EXT_ACTIONS = "1";
const { build } = require("./build-lcp");

const ACT = [["快速科技", "Quick Tech"], ["完整科技", "Full Tech"], ["快速动作", "Quick"], ["完整动作", "Full"], ["自由动作", "Free"], ["反应", "Reaction"], ["协定", "Protocol"], ["协议", "Protocol"]];
const ACT_RE = /(以|作为|用|使用|可用|可以用|可以|可)一?个?(快速科技|完整科技|快速动作|完整动作|自由动作|反应|协定|协议)(?!堆)|（(快速科技|完整科技|快速动作|完整动作|自由动作|反应|协定|协议)[，,）]/;
// 动作主语是别人（「他们可用快速动作移除」「盟友角色可以快速动作骑乘」）时不算
const OTHERS = /(他们|对方|角色|盟友|敌人|敌方|目标|被附着的|其)[^，。；]{0,4}$/;
// 否定或描述性的写法（「无法使用反应」「忽略交战和反应」）不是动作
const NEGATED = /(无法|不能|不可|忽略|免疫|不会引起|不引发|和|与|或)$/;
const PERIOD = { 轮: "Round", 回合: "Turn", 场景: "Scene", 任务: "Mission" };
const strip = s => String(s || "").replace(/<[^>]+>/g, "");

function paragraphs(htmlText) {
	const h = String(htmlText || "");
	const ps = h.includes("<p") ? [...h.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => m[1]) : [];
	const lead = h.split(/<p>/)[0];
	return [lead, ...ps].map(s => s.trim()).filter(s => s && !/^<i>[\s\S]*<\/i>$/.test(s) && !s.startsWith("【车卡器说明】"));
}

function draftsFor(text, baseName) {
	const out = [];
	for (const para of paragraphs(text)) {
		const plain = strip(para);
		const m = plain.match(ACT_RE);
		if (!m) continue;
		if (OTHERS.test(plain.slice(0, m.index)) || NEGATED.test(plain.slice(0, m.index))) continue;
		const word = m[2] || m[3];
		const activation = ACT.find(([w]) => w === word)[1];
		const a = { name: String(baseName).replace(/（[^）]*）s*$/, "").trim(), activation, detail: para };
		const f = plain.match(/(\d+)\s*\/\s*(轮|回合|场景|任务)/);
		if (f) a.frequency = `${f[1]}/${PERIOD[f[2]]}`;
		if (activation === "Reaction") {
			const t = plain.match(/当([^，。]{2,40})时/);
			if (t) a.trigger = `当${t[1]}时`;
		}
		out.push(a);
	}
	out.forEach((a, i) => { if (out.length > 1) a.name = `${a.name}（${i + 1}）`; });
	return out;
}

function collect() {
	const { out, audit } = build("ext");
	const added = new Set(audit.added.map(a => a.id));
	const drafts = {};
	const push = (id, path, field, list) => {
		for (const a of list) (drafts[id] = drafts[id] || []).push({ ...(path ? { path } : {}), ...(field ? { field } : {}), ...a });
	};
	for (const kind of ["systems", "weapons", "frames", "talents"]) {
		for (const x of out[kind]) {
			if (!added.has(x.id)) continue;
			if (kind === "systems" || kind === "weapons") {
				if (!(x.actions || []).length) push(x.id, "", "", draftsFor(x.effect, x.name));
			} else if (kind === "frames") {
				(x.traits || []).forEach((t, i) => { if (!(t.actions || []).length) push(x.id, `traits[${i}]`, "", draftsFor(t.description, t.name)); });
				const cs = x.core_system;
				if (!(cs.passive_actions || []).length) push(x.id, "core_system", "passive_actions", draftsFor(cs.passive_effect, cs.passive_name || cs.name));
			} else {
				x.ranks.forEach((r, i) => { if (!(r.actions || []).length) push(x.id, `ranks[${i}]`, "", draftsFor(r.description, r.name)); });
			}
		}
	}
	return drafts;
}

if (require.main === module) {
	const drafts = collect();
	const n = Object.values(drafts).reduce((s, l) => s + l.length, 0);
	if (process.argv.includes("--write")) {
		const old = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : {};
		const merged = {
			_说明: "扩展条目正文里的动作 → Foundry 动作按钮。由 tools/draft-ext-actions.js 生成草稿并人工核对；已有条目不会被覆盖，写成 [] 表示该条目不加动作。path 为空表示条目本身，field 默认 actions。activation 取值：Quick / Full / Free / Reaction / Protocol / Quick Tech / Full Tech / Invade；frequency 如 1/Round、1/Scene。",
			...Object.fromEntries(Object.entries(old).filter(([k]) => !k.startsWith("_"))),
		};
		let added = 0;
		for (const [id, list] of Object.entries(drafts)) if (!(id in merged)) { merged[id] = list; added += list.length; }
		fs.writeFileSync(FILE, JSON.stringify(merged, null, "\t") + "\n");
		console.log(`草稿 ${n} 个动作，新写入 ${added} 个：${path.relative(ROOT, FILE)}`);
	} else {
		for (const [id, list] of Object.entries(drafts)) for (const a of list) console.log(`${id}${a.path ? " " + a.path : ""}「${a.name}」${a.activation}${a.frequency ? " " + a.frequency : ""}${a.trigger ? " 触发：" + a.trigger : ""}`);
		console.log(`共 ${n} 个动作（${Object.keys(drafts).length} 个条目）。加 --write 写入 source/fvtt/ext-actions.json`);
	}
}

module.exports = { collect, draftsFor };
