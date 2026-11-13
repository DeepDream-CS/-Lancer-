#!/usr/bin/env node
"use strict";
// 导出到 Foundry（assets/js/foundry-export.js）：车卡器角色 → COMP/CON v2 驾驶员 JSON。
// 检查结构符合 foundryvtt-lancer importCCv2 的读取方式，且所有条目 id 都能在 Foundry 中找到
// （车卡器中文内容包 + Foundry 自带的核心与官方补充书数据）。
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..");
let checks = 0, failures = 0;
const ok = (cond, msg) => { checks++; if (!cond) { failures++; console.error("✗ " + msg); } };

// ---- 浏览器脚本运行环境（同 test-rules.js）
const el = () => ({ innerHTML: "", classList: { toggle() {}, add() {}, remove() {} }, querySelectorAll() { return []; }, value: "", style: {} });
const elements = new Map();
const ctx = vm.createContext({
	console, setTimeout, clearTimeout, Blob, URL,
	localStorage: { getItem: () => null, setItem() {} },
	document: { body: el(), addEventListener() {}, getElementById(id) { if (!elements.has(id)) elements.set(id, el()); return elements.get(id); }, querySelectorAll() { return []; }, createElement: () => ({ click() {} }) },
	window: { scrollTo() {}, addEventListener() {} }, navigator: {}, confirm: () => true,
});
for (const file of ["data.js", "wizard.js", "cardexport.js", "rules.js", "glossary.js", "ui.js", "frame-catalog.js", "battlemap.js", "app.js", "foundry-export.js"])
	vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js", file), "utf8"), ctx, { filename: file });
const run = code => vm.runInContext(code, ctx);

// ---- Foundry 中能找到的 id：中文内容包 + Foundry 自带数据
function unzip(buf) {
	const out = {};
	const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
	let p = buf.readUInt32LE(eocd + 16);
	for (let i = 0; i < buf.readUInt16LE(eocd + 10); i++) {
		const nlen = buf.readUInt16LE(p + 28), off = buf.readUInt32LE(p + 42), csize = buf.readUInt32LE(p + 20);
		const name = buf.slice(p + 46, p + 46 + nlen).toString("utf8");
		const lnlen = buf.readUInt16LE(off + 26), lxlen = buf.readUInt16LE(off + 28);
		out[name] = zlib.inflateRawSync(buf.slice(off + 30 + lnlen + lxlen, off + 30 + lnlen + lxlen + csize)).toString("utf8");
		p += 46 + nlen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
	}
	return out;
}
const known = new Set();
const licenseKeys = new Set();
const addRecords = (kind, list) => {
	for (const x of list) {
		known.add(x.id);
		if (kind === "frames") licenseKeys.add(x.license_id || x.id);
	}
};
for (const lcp of ["lancer-cn-core.lcp", "lancer-cn-expansions.lcp"]) {
	const files = unzip(fs.readFileSync(path.join(ROOT, "dist/fvtt", lcp)));
	for (const [name, text] of Object.entries(files)) if (name !== "lcp_manifest.json") addRecords(name.replace(".json", ""), JSON.parse(text));
}
const dataDirs = [path.join(ROOT, "source/fvtt/core"), ...fs.readdirSync(path.join(ROOT, "source/fvtt/official")).map(d => path.join(ROOT, "source/fvtt/official", d))];
for (const dir of dataDirs) for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".json") && !["package.json", "lcp_manifest.json", "info.json"].includes(f))) {
	const list = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
	if (Array.isArray(list)) addRecords(f.replace(".json", ""), list);
}
// 专业牌照由模组的「导入车卡器资料」建立
const professionalIds = new Set(run("D.professional_licenses.map(x=>x.id)"));

function checkExport(label, data) {
	ok(!("originId" in data) && !("EXPORT_TYPE" in data), `${label}：不能带 CCv3 字段，否则 Foundry 走 v3 导入`);
	for (const k of ["name", "callsign", "background", "history", "text_appearance", "notes", "player_name", "status", "cloudID", "cloud_portrait"]) ok(typeof data[k] === "string", `${label}：${k} 应为字符串`);
	ok(Number.isInteger(data.level) && Number.isInteger(data.current_hp), `${label}：level / current_hp 应为整数`);
	ok(Array.isArray(data.mechSkills) && data.mechSkills.length === 4 && data.mechSkills.every(Number.isInteger), `${label}：mechSkills 应为 4 个整数`);
	for (const k of ["skills", "talents", "licenses", "core_bonuses", "reserves", "mechs", "burdens", "clocks"]) ok(Array.isArray(data[k]), `${label}：${k} 应为数组`);
	for (const k of ["armor", "weapons", "gear", "extendedWeapons", "extendedGear"]) ok(Array.isArray(data.loadout?.[k]), `${label}：loadout.${k} 应为数组`);
	const need = (id, what) => ok(known.has(id), `${label}：${what} ${id} 在 Foundry 中找不到`);
	for (const s of data.skills) {
		ok(Number.isInteger(s.rank) && s.rank >= 1 && s.rank <= 3, `${label}：技能触发 ${s.id} 等级应为 1–3`);
		if (!s.custom) need(s.id, "技能触发");
	}
	for (const t of data.talents) { need(t.id, "天赋"); ok(t.rank >= 1 && t.rank <= 3, `${label}：天赋 ${t.id} 等级`); }
	for (const l of data.licenses) ok(licenseKeys.has(l.id) || professionalIds.has(l.id), `${label}：牌照 ${l.id} 在 Foundry 中没有对应牌照`);
	for (const id of data.core_bonuses) need(id, "核心奖励");
	for (const g of [...data.loadout.armor, ...data.loadout.weapons, ...data.loadout.gear]) need(g.id, "驾驶员装备");
	const fittings = run("FOUNDRY_FITTINGS");
	for (const m of data.mechs) {
		need(m.frame, "骨架");
		for (const k of ["current_hp", "current_stress", "current_structure", "current_repairs", "activations"]) ok(Number.isInteger(m[k]), `${label}：机甲 ${m.name} 的 ${k} 应为整数`);
		const lo = m.loadouts[m.active_loadout_index];
		ok(lo && ["systems", "integratedSystems", "mounts", "integratedMounts"].every(k => Array.isArray(lo[k])), `${label}：机甲 ${m.name} 的配装结构`);
		if (!lo) continue;
		for (const s of [...lo.systems, ...lo.integratedSystems]) { need(s.id, "系统"); ok(Number.isInteger(s.uses), `${label}：系统 ${s.id} 的 uses 应为整数`); }
		const weapons = [...lo.integratedMounts.map(x => x.weapon), ...lo.mounts.flatMap(mt => mt.slots.map(s => s.weapon))].filter(Boolean);
		for (const w of weapons) {
			need(w.id, "武器");
			ok(Number.isInteger(w.uses) && w.loaded === true, `${label}：武器 ${w.id} 的状态`);
			if (w.mod) need(w.mod.id, "武器改装");
		}
		for (const mt of lo.mounts) {
			ok(fittings[mt.mount_type], `${label}：挂载点类型 ${mt.mount_type} 不是 Foundry 的类型`);
			ok(JSON.stringify(mt.slots.map(s => s.size)) === JSON.stringify(fittings[mt.mount_type]), `${label}：${mt.mount_type} 挂载点的槽位应为 ${fittings[mt.mount_type]}`);
			ok(Array.isArray(mt.extra) && mt.extra.length === 0, `${label}：不使用 extra（Foundry 会按槽位重复读取）`);
		}
	}
	ok(!data.mechs.length || data.mechs.some(m => m.id === data.state.active_mech_id), `${label}：启用中的机甲应在机甲列表里`);
}

// ---- 1. 完整角色：武器、改装、系统、内建武器、天赋、核心奖励、专业牌照、自定义触发
run(`
	var p = blankPilot();
	p.name = "导出测试"; p.callsign = "测试"; p.ll = 6; p.background = D.backgrounds[0].id;
	p.triggers = [{ id: D.skills[0].id, custom: "", val: 6 }, { id: D.skills[1].id, custom: "", val: 4 }, { id: "", custom: "车卡器自定义触发", val: 2 }, { id: "", custom: "", val: 2 }];
	p.hase = { hull: 2, agi: 2, sys: 2, eng: 2 };
	p.talents = { t_engineer: 2, t_ace: 1 };
	p.licenses = { mf_raleigh: 2, mf_ext_amber_phantom: 1 };
	p.professionalLicenses = [{ id: "pl_ips_vanguard", catalogId: "pl_ips_vanguard", name: "先遣兵", source: "IPS-N", rank: 1, rewardRanks: 0 },
		{ id: "pro_custom", name: "自造牌照", source: "SSC", rank: 1, rewardRanks: 0 }];
	p.coreBonuses = ["cb_overpower_caliber", "cb_kkca_signature_move"];
	p.gear = { armor: D.pilot_gear.find(g => g.type === "Armor").id, weapons: [D.pilot_gear.find(g => g.type === "Weapon").id, ""], items: [D.pilot_gear.find(g => g.type === "Gear").id, "", ""] };
	var m = p.mechs[0];
	m.frame = "mf_raleigh"; m.name = "测试机";
	m.loadout = { m0: { slots: [{ w: "mw_pistol" }], link: "" }, m1: { slots: [{ w: "mw_assault_rifle", mod: "wm_stabilizer_mod" }], link: "" } };
	m.systems = ["ms_pattern_a_smoke_charges", "ms_comp_con_class_assistant_unit"];
	m.overpower = "m1|0"; m.signature = "ms_pattern_a_smoke_charges";
	p.mechs.push(blankMech("mf_ext_amber_phantom")); p.activeMech = 1;
	var out = foundryPilotData(p);
`);
const full = JSON.parse(run("JSON.stringify(out)"));
checkExport("完整角色", full);
ok(full.skills[0].rank === 3 && full.skills[1].rank === 2, "技能触发 +6 / +4 → 等级 3 / 2");
ok(full.skills.some(s => s.custom && s.id === "车卡器自定义触发"), "自定义触发导出为自定义技能");
ok(full.skills.length === 3, "空白触发不导出");
ok(full.licenses.some(l => l.id === "pl_ips_vanguard" && l.rank === 1), "专业牌照按 id 导出");
ok(full.licenses.some(l => l.id === "mf_amber_phantom"), "与官方重复的扩展骨架牌照改用官方 id");
ok(/自造牌照/.test(full.history), "自定义专业牌照写进驾驶员经历");
const mech0 = full.mechs[0];
const lo0 = mech0.loadouts[0];
ok(lo0.mounts[0].mount_type === "Aux/Aux" && lo0.mounts[0].slots[0].weapon?.id === "mw_pistol" && lo0.mounts[1].mount_type === "Flex" && lo0.mounts[1].slots[0].weapon?.id === "mw_assault_rifle" && lo0.mounts[1].slots[0].weapon.mod?.id === "wm_stabilizer_mod", "副/副、灵活挂载点的武器与改装：" + JSON.stringify(lo0.mounts));
ok(lo0.integratedMounts.length >= 1 && lo0.integratedMounts.every(x => x.weapon), "天赋内建武器（工程师）导出为内建挂载");
ok(lo0.systems.map(s => s.id).join() === "ms_pattern_a_smoke_charges,ms_comp_con_class_assistant_unit", "系统");
ok(lo0.systems[0].uses > 0, "受限系统的次数（含工程加成）");
ok(/招牌动作/.test(mech0.notes) && /超功率口径/.test(mech0.notes), "车卡器专用配置写进机甲备注");
ok(full.mechs[1].frame === "mf_amber_phantom" && full.state.active_mech_id === full.mechs[1].id, "扩展骨架改用官方 id，启用中的机甲");
ok(mech0.current_hp === run("mechStats(p,p.mechs[0]).hp") && full.current_hp === run("pilotStats(p).hp"), "HP 与车卡器计算一致");

// ---- 2. 每个骨架（含扩展、变体）都能导出，且所有 id 都在 Foundry 中
const frameIds = run("D.frames.map(f=>f.id)");
for (const id of frameIds) {
	let data;
	try {
		data = JSON.parse(run(`(() => { const q = blankPilot(); q.ll = 12; q.name = "骨架 ${id}"; q.mechs = [blankMech(${JSON.stringify(id)})]; return JSON.stringify(foundryPilotData(q)); })()`));
	} catch (e) { ok(false, `骨架 ${id} 导出出错：${e.message}`); continue; }
	checkExport(`骨架 ${id}`, data);
}

// ---- 3. 超重型武器占用另一挂载点：被占用的挂载点标为锁定
run(`
	var q = blankPilot(); q.ll = 3; var mm = q.mechs[0]; mm.frame = "mf_barbarossa";
	mm.loadout = { m2: { slots: [{ w: "mw_cyclone_pulse_rifle" }], link: "m0" } };
	var outSh = foundryPilotData(q);
`);
const sh = JSON.parse(run("JSON.stringify(outSh)"));
checkExport("超重型", sh);
const shMounts = sh.mechs[0].loadouts[0].mounts;
ok(shMounts[2].slots[0].weapon?.id === "mw_cyclone_pulse_rifle" && shMounts[0].lock === true && shMounts[0].slots.every(s => !s.weapon) && shMounts[1].lock === false, "超重型武器占用的挂载点标为锁定（受身）：" + JSON.stringify(shMounts));

// ---- 4. 角色卡页面有导出按钮
const appJs = fs.readFileSync(path.join(ROOT, "assets/js/app.js"), "utf8");
ok(appJs.includes('data-act="exportFoundry"'), "角色卡页应有「导出到 Foundry」按钮");
ok(appJs.includes('case "exportFoundry": exportFoundryJson(p); return;'), "「导出到 Foundry」按钮应调用 exportFoundryJson");
ok(fs.readFileSync(path.join(ROOT, "index.html"), "utf8").includes('<script src="assets/js/app.js"></script><script src="assets/js/foundry-export.js"></script>'), "index.html 应在 app.js 之后载入 foundry-export.js");

// ---- 5. 战斗地图导出到 Foundry（BattleMap.toFoundry / summary）
{
	const bmJs = fs.readFileSync(path.join(ROOT, "assets/js/battlemap.js"), "utf8");
	ok(bmJs.includes('data-bm="foundry"') && bmJs.includes(">导出到 Foundry</button>"), "战斗地图页应有「导出到 Foundry」按钮");
	const sampleMap = {
		v: 1, minQ: 0, minR: 0, w: 8, h: 6, round: 3,
		cells: {
			"1,1": { terrain: "障碍物", color: "#202a38" },
			"2,1": { terrain: "软性掩护", color: "#3b82c4" },
			"2,2": { terrain: "硬性掩护", color: "#c4703b" },
			"3,1": { terrain: "困难地形", color: "#7d8c38" },
			"3,2": { terrain: "危险地形", color: "#c93b3b", text: "熔岩" },
			"4,1": { terrain: "", color: "#506f46", text: "撤离区" },
			"4,2": { terrain: "自定义", color: "#9944cc" },
			"4,3": { terrain: "", color: "#202a38" }, // 默认空地底色，不应生成涂色格
			"12,1": { terrain: "障碍物", color: "#202a38" }, // 可见范围外，应裁剪
		},
		units: [
			{ id: "u1", name: "珠穆朗玛", side: "玩家", color: "#529be8", size: "1", q: 1, r: 2, hp: 12, max: 12, armor: 0, height: 0, states: [], owner: "", note: "" },
			{ id: "u2", name: "巴巴罗萨", side: "敌人", color: "#e06d53", size: "3", q: 5, r: 2, hp: 20, max: 20, armor: 2, height: 0, states: [], owner: "", note: "" },
			{ id: "u3", name: "界外单位", side: "中立", color: "#7dcfb6", size: "1", q: 15, r: 2, hp: 10, max: 10, armor: 0, height: 0, states: [], owner: "", note: "" },
		],
		lines: [
			{ a: { q: 0, r: 0 }, b: { q: 5, r: 4 }, color: "#ffd166" },
			{ a: { q: 0, r: 0 }, b: { q: 14, r: 4 }, color: "#ffd166" }, // 端点越界，应裁剪
		],
	};
	const sum = JSON.parse(run(`JSON.stringify(BattleMap.summary(${JSON.stringify(sampleMap)}))`));
	ok(sum.obstacle === 1 && sum.soft === 1 && sum.hard === 1 && sum.difficult === 1 && sum.dangerous === 1 && sum.tint === 2 && sum.text === 2 && sum.units === 2 && sum.lines === 1,
		"BattleMap.summary 应只统计当前可见范围内的地形、涂色、标注、单位与画线：" + JSON.stringify(sum));

	const scene = JSON.parse(run(`JSON.stringify(BattleMap.toFoundry(${JSON.stringify(sampleMap)}, { name: "测试战场" }))`));
	ok(scene.name === "测试战场" && scene.padding === 0 && scene.tokenVision === false && scene.fog?.exploration === false && scene.environment?.globalLight?.enabled === true,
		"导出场景应默认关闭迷雾与指示物视野、开启全局照明且边距为 0");
	ok(scene.grid?.type === 4 && scene.grid.size === 100 && scene.grid.distance === 1 && scene.grid.units === "空间",
		"minQ 为偶数时应导出为平顶奇数列下移六角格（type=4）");
	ok(Array.isArray(scene.tokens) && scene.tokens.length === 0, "不应生成无 Actor 的损坏 Token");
	ok(scene.walls.length === 6 && scene.walls.every(w => /^[A-Za-z0-9]{16}$/.test(w._id) && w.move === 20 && w.sight === 0 && w.flags?.["lancer-cn"]?.hexWall === "1,1"),
		"障碍物应导出为 6 段只阻挡移动的六边形墙体（越界障碍物不导出）");
	ok(scene.regions.length === 4 && scene.regions.every(r => /^[A-Za-z0-9]{16}$/.test(r._id) && r.visibility === 2 && r.behaviors?.length === 1 && /^[A-Za-z0-9]{16}$/.test(r.behaviors[0]._id)),
		"软/硬掩护、困难地形、危险地形应导出为 4 个所有人可见的区域，且带 16 位 _id");
	const byName = Object.fromEntries(scene.regions.map(r => [r.name, r]));
	ok(byName["软性掩护格"]?.behaviors[0].type === "lancer-cn.cover" && byName["软性掩护格"].behaviors[0].system.cover === "soft", "软性掩护区行为");
	ok(byName["硬性掩护格"]?.behaviors[0].type === "lancer-cn.cover" && byName["硬性掩护格"].behaviors[0].system.cover === "hard", "硬性掩护区行为");
	ok(byName["困难地形格"]?.behaviors[0].type === "modifyMovementCost" && byName["困难地形格"].behaviors[0].system.difficulties.walk === 2, "困难地形区使用 Foundry 原生 modifyMovementCost（walk: 2）");
	ok(byName["危险地形格"]?.behaviors[0].type === "lancer-cn.dangerous" && byName["危险地形格"].behaviors[0].system.damage === 5, "危险地形区使用 lancer-cn.dangerous");
	// Drawings: 1 obstacle hex + 2 tints + 2 texts + 1 line + (1 marker for S1 + 7 footprint + 1 marker for S3 = 9) = 15
	ok(scene.drawings.every(d => /^[A-Za-z0-9]{16}$/.test(d._id) && d.locked === true), "所有图形应锁定且带 16 位 _id");
	ok(scene.drawings.filter(d => d.flags?.["lancer-cn"]?.cellTint).length === 2, "自定义涂色与非默认底色空地导出为底层色块，默认底色空地不导出");
	ok(scene.drawings.filter(d => d.flags?.["lancer-cn"]?.cellText).map(d => d.text).sort().join(",") === "撤离区,熔岩", "格子文字标注导出为文字图形，不把地形名印成文字");
	ok(scene.drawings.filter(d => d.flags?.["lancer-cn"]?.mapLine).length === 1, "可见范围内的画线导出为折线图形");
	const uMarkers = scene.drawings.filter(d => d.flags?.["lancer-cn"]?.unitMarker);
	ok(uMarkers.some(d => d.text === "珠穆朗玛") && uMarkers.some(d => d.text === "巴巴罗萨 (S3)") && uMarkers.length === 9,
		"单位导出为底层部署位置标记（S3 额外包含 7 格占地轮廓）");
	// 选项关闭与奇数列 minQ=1（向左扩展 3 列后 minQ=-3）
	const oddMap = { ...sampleMap, minQ: -3 };
	const oddScene = JSON.parse(run(`JSON.stringify(BattleMap.toFoundry(${JSON.stringify(oddMap)}, { includeUnits: false, includeLines: false, blockSight: true }))`));
	ok(oddScene.grid.type === 5, "minQ 为奇数（如 -3）时应导出为平顶偶数列下移六角格（type=5）");
	ok(!oddScene.drawings.some(d => d.flags?.["lancer-cn"]?.unitMarker || d.flags?.["lancer-cn"]?.mapLine), "取消勾选单位与画线时不导出对应图形");
	ok(oddScene.walls.every(w => w.sight === 20 && w.light === 20), "勾选阻挡视线后障碍物墙体同时阻挡视线与光照");
	// 场景内嵌 flags["lancer-cn"].battlemap 可被 BattleMap.valid 还原
	const roundtrip = JSON.parse(run(`JSON.stringify(BattleMap.valid(${JSON.stringify(scene.flags["lancer-cn"].battlemap)}))`));
	ok(roundtrip.w === 8 && roundtrip.h === 6 && !roundtrip.cells["12,1"] && roundtrip.units.length === 2 && roundtrip.lines.length === 1,
		"内嵌 flags['lancer-cn'].battlemap 应保留裁剪后的原始地图并能被车卡器重新读取");
}

console.log(`test-foundry-export：${checks} 项检查，${failures ? failures + " 项失败" : "全部通过"}（骨架 ${frameIds.length} 个）`);
process.exitCode = failures ? 1 : 0;
