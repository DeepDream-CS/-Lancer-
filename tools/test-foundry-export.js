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
ok(fs.readFileSync(path.join(ROOT, "assets/js/app.js"), "utf8").includes('data-act="exportFoundry"'), "角色卡页应有「导出到 Foundry」按钮");
ok(fs.readFileSync(path.join(ROOT, "index.html"), "utf8").includes('<script src="assets/js/app.js"></script><script src="assets/js/foundry-export.js"></script>'), "index.html 应在 app.js 之后载入 foundry-export.js");

console.log(`test-foundry-export：${checks} 项检查，${failures ? failures + " 项失败" : "全部通过"}（骨架 ${frameIds.length} 个）`);
process.exitCode = failures ? 1 : 0;
