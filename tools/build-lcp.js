"use strict";
// 生成 Foundry VTT「LANCER」系统可导入的内容包（LCP，v2 格式），共两个：
//   扩展内容  dist/fvtt/lancer-cn-expansions.lcp  核对表 docs/FVTT-LCP-AUDIT.md
//   核心规则书 dist/fvtt/lancer-cn-core.lcp        核对表 docs/FVTT-LCP-CORE-AUDIT.md
// 用法：node tools/build-lcp.js [ext|core]（不带参数时两个都生成）
//
// 数据来源：
// - assets/js/data.js（先运行 node tools/build-data.js）。扩展包取带 ext 的条目，核心包取其余条目。
// - source/fvtt/official/：Foundry 系统自带的官方补充书数据快照；source/fvtt/core/：Foundry 用的 lancer-data 快照。
//   版本均与 foundryvtt-lancer 的 package-lock 一致。
// - source/fvtt/official-map.json：扩展条目 id → 官方补充书条目 id。核心条目 id 与 lancer-data 相同。
//
// 覆盖官方条目时以官方记录为底（保留 Foundry 能自动化的动作、部署物、计数器、加值、主动效果），
// 换成车卡器的中文文本与数值；导入时覆盖英文版。核心包只采用车卡器有意改过的数值（v3.5 修正等），
// 其余数值沿用 Foundry 的 lancer-data，避免车卡器较旧的数据副本把新版勘误改回去。
// 未映射的扩展条目按车卡器数据转换为新条目。Foundry 无法自动处理的车卡器规则写进条目说明，供 GM 手动处理。

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..");
const FVTT = path.join(ROOT, "source", "fvtt");
const MAP_FILE = path.join(FVTT, "official-map.json");

const KINDS = ["frames", "weapons", "systems", "mods", "core_bonuses", "talents", "pilot_gear"];
const CORE_KINDS = [...KINDS, "skills", "tags"];

const PACKS = {
	ext: {
		lcp: "lancer-cn-expansions.lcp", audit: "FVTT-LCP-AUDIT.md", todo: "zh-overrides.todo.json",
		overrides: "zh-overrides.json", baseDirs: ["official"], kinds: KINDS, select: x => x.ext,
		manifest: {
			name: "枪骑兵简易车卡器：扩展内容（中文）", author: "DeepDream-CS", version: "1.0.0",
			description: "简易车卡器收录的扩展骨架、装备、天赋与核心奖励（中文）。官方补充书条目会覆盖 Foundry 自带的英文版；其余为新增内容。",
		},
	},
	core: {
		lcp: "lancer-cn-core.lcp", audit: "FVTT-LCP-CORE-AUDIT.md", todo: "zh-overrides-core.todo.json",
		overrides: "zh-overrides-core.json", baseDirs: ["core"], kinds: CORE_KINDS, select: x => !x.ext,
		manifest: {
			name: "枪骑兵简易车卡器：核心规则书（中文）", author: "DeepDream-CS", version: "1.0.0",
			description: "核心规则书的骨架、装备、天赋、核心奖励、驾驶员装备、技能与标签（中文，译名依 v3.5 规则书）。导入后覆盖 Foundry 核心数据的英文版。",
		},
	},
};
const MANIFEST = PACKS.ext.manifest;

// 与 foundryvtt-lancer v3.1.3 src/module/enums.ts 一致；test-lcp.js 也用这些值校验
const ENUM = {
	activation: ["None", "Passive", "Quick", "Quick Tech", "Invade", "Full", "Full Tech", "Other", "Reaction", "Protocol", "Free"],
	period: ["Turn", "Round", "Encounter", "Scene", "Mission", "Unlimited"],
	// mech_weapon.ts 的 size 字段另外接受 "Ship-class"（巴巴罗萨内建武器）
	weaponSize: ["Auxiliary", "Main", "Heavy", "Superheavy", "Ship-class"],
	weaponType: ["Rifle", "Cannon", "Launcher", "CQB", "Nexus", "Melee"],
	systemType: ["System", "AI", "Shield", "Deployable", "Drone", "Tech", "Armor", "Flight System", "Integrated", "Mod"],
	mount: ["Main", "Heavy", "Aux/Aux", "Aux", "Main/Aux", "Flex", "Integrated", "Superheavy"],
	mechType: ["Balanced", "Artillery", "Striker", "Controller", "Support", "Defender", "Specialty"],
	damage: ["Kinetic", "Energy", "Explosive", "Heat", "Burn", "Variable"],
	range: ["Range", "Threat", "Thrown", "Line", "Cone", "Blast", "Burst"],
};

// 车卡器独有字段：不写进 LCP（需要说明的会先转成文字）
const BUILDER_ONLY = ["ext", "pack", "zh_name", "maker_note", "variant_of", "no_grit_hp", "no_license", "required_core_bonus",
	"talent_item", "talent_id", "talent_rank", "professional_license", "select_profile", "max_mods", "mod_sp_discount",
	"stack_tags", "restricted_types", "types", "efficient", "special_equipment", "reference_image"];

// 显示在 Foundry 里的文字字段
const TEXT_FIELDS = ["description", "effect", "on_hit", "on_crit", "on_attack", "terse", "mounted_effect", "detail", "trigger",
	"passive_name", "passive_effect", "active_name", "active_effect"];

const clone = x => JSON.parse(JSON.stringify(x));
const strip = s => String(s || "").replace(/<[^>]+>/g, "");

function loadBuilderData() {
	const ctx = { window: {} };
	vm.createContext(ctx);
	vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8"), ctx);
	return ctx.window.LANCER_DATA;
}

// 官方数据快照：baseDir 下若有 package.json 就是单个数据包（core），否则每个子目录是一个补充书（official）
function loadOfficial(baseDir, kinds) {
	const byKind = Object.fromEntries(kinds.map(k => [k, new Map()]));
	const packs = [];
	const root = path.join(FVTT, baseDir);
	const dirs = fs.existsSync(path.join(root, "package.json")) ? [root]
		: fs.readdirSync(root).sort().map(d => path.join(root, d)).filter(d => fs.statSync(d).isDirectory());
	for (const dir of dirs) {
		const pack = path.basename(dir);
		packs.push({ pack, ...JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")) });
		for (const k of kinds) {
			const f = path.join(dir, k + ".json");
			if (!fs.existsSync(f)) continue;
			// Foundry 会剔除 COMP/CON 的 missing_ 占位条目
			for (const rec of JSON.parse(fs.readFileSync(f, "utf8"))) if (!String(rec.id).startsWith("missing_")) byKind[k].set(rec.id, { rec, pack });
		}
	}
	return { byKind, packs };
}

// 车卡器的 lancer-data 原始副本：用于判断 data.js 中哪些数值是车卡器有意改过的
function loadRaw(kinds) {
	const raw = {};
	for (const k of kinds) {
		const f = path.join(ROOT, "source/lancer-data", k + ".json");
		raw[k] = new Map(fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")).map(x => [x.id, x]) : []);
	}
	return raw;
}

function loadMap() {
	const raw = JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));
	delete raw._说明;
	return raw;
}

// 手工补译：{ "<LCP 中的条目 id>": { "<字段路径，如 actions[0].detail>": "中文" } }
function loadOverrides(file) {
	const f = path.join(FVTT, file);
	if (!fs.existsSync(f)) return {};
	const raw = JSON.parse(fs.readFileSync(f, "utf8"));
	delete raw._说明;
	return raw;
}

// 风味文本（tools/build-equipment-lore.js 生成），按车卡器 id 索引
function loadLore() {
	const f = path.join(ROOT, "assets/js/equipment-lore.js");
	if (!fs.existsSync(f)) return {};
	const ctx = { window: {} };
	vm.createContext(ctx);
	vm.runInContext(fs.readFileSync(f, "utf8"), ctx);
	return ctx.window.LANCER_LORE?.items || {};
}

const pathParts = p => p.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
function getPath(o, p) { return pathParts(p).reduce((x, k) => (x == null ? undefined : x[k]), o); }
function setPath(o, p, v) {
	const parts = pathParts(p);
	const last = parts.pop();
	const parent = parts.reduce((x, k) => (x == null ? undefined : x[k]), o);
	if (parent == null || !(last in parent)) return false;
	parent[last] = v;
	return true;
}

// 车卡器的说明块（.blk）在 Foundry 里没有样式，换成普通段落
function html(s) {
	if (typeof s !== "string") return s;
	return s
		.replace(/<div class="blk-h">([\s\S]*?) <span class="muted">([\s\S]*?)<\/span><\/div>/g, (_, n, m) => `<p><b>${n.trim()}</b>${m.trim() ? `（${m.trim()}）` : ""}</p>`)
		.replace(/<div class="blk">/g, "<div>");
}

function freqOk(f) {
	if (f == null || f === "" || f === "Unlimited") return true;
	const m = String(f).trim().match(/(\d)+\s*\/\s*(.*)/);
	if (!m) return false;
	const p = m[2];
	return ENUM.period.includes(p[0].toUpperCase() + p.slice(1));
}

function build(packId = "ext") {
	const P = PACKS[packId];
	const isCore = packId === "core";
	const kinds = P.kinds;
	const D = loadBuilderData();
	const { byKind: OFF, packs } = loadOfficial(P.baseDirs[0], kinds);
	const MAP = isCore ? {} : loadMap();
	const RAW = isCore ? loadRaw(kinds) : null;
	const OVERRIDES = loadOverrides(P.overrides);
	const LORE = loadLore();
	const Z = D.zh;
	const nk = s => String(s || "").replace(/’/g, "'");
	const CJK = /[㐀-鿿]/;
	const audit = { overlaid: [], added: [], numberDiffs: [], structure: [], english: [], fixes: [], notes: 0, mapErrors: [], overrides: 0 };
	const lore = id => {
		const l = LORE[id];
		return l && l.lang === "zh" && l.text ? l.text.split(/\n+/).map(s => `<p>${s}</p>`).join("") : "";
	};

	// 名称：与车卡器界面的 zhOf() 同一来源
	const frameZh = f => Z.frames[nk(f.name)] || Z.frames[f.name] || f.name;
	const nameOf = (kind, x) => {
		switch (kind) {
			case "frames": return frameZh(x);
			case "talents": return Z.talents[x.name]?.name || x.name;
			case "core_bonuses": return Z.cb[nk(x.name)]?.name || x.name;
			case "pilot_gear": return Z.gear[x.name]?.name || x.name;
			case "skills": return Z.skills[x.name.toLowerCase()]?.name || x.name;
			case "tags": return x.name;
			default: return x.zh_name || Z.gms[x.name]?.name || x.name;
		}
	};
	const outId = id => MAP[id] || id;

	// 牌照名（英文查找名或中文骨架名）→ 骨架 id
	const licByName = {};
	for (const f of D.frames) { licByName[f.name] = f.id; licByName[frameZh(f)] = f.id; }
	const plById = Object.fromEntries((D.professional_licenses || []).map(p => [p.id, p]));
	const coreBonusName = id => (D.core_bonuses.find(c => c.id === id) || {}).name || id;
	const talentById = Object.fromEntries(D.talents.map(t => [t.id, t]));
	const itemName = id => {
		for (const k of KINDS) { const x = D[k].find(y => y.id === id); if (x) return nameOf(k, x); }
		return id;
	};

	const DMG = { Kinetic: "动能", Energy: "能量", Explosive: "爆炸", Heat: "热度", Burn: "燃烧", Variable: "可变" };
	const RNG = { Range: "射程", Threat: "威胁", Thrown: "投掷", Line: "线形", Cone: "锥形", Blast: "爆炸", Burst: "爆发" };
	const WTYPE = { Rifle: "步枪", Cannon: "大炮", Launcher: "发射器", CQB: "CQB", Nexus: "巢房", Melee: "近战" };
	const tagText = t => { const d = D.tags.find(x => x.id === t.id); return d ? d.name.replace("{VAL}", t.val ?? "") : t.id; };
	const profileText = pf => [pf.type && WTYPE[pf.type], (pf.range || []).map(r => `${RNG[r.type] || r.type} ${r.val}`).join("，"),
		(pf.damage || []).map(d => `${d.val} ${DMG[d.type] || d.type}`).join(" + "), (pf.tags || []).map(tagText).join("、")].filter(Boolean).join("；");

	// ---- 车卡器规则说明（Foundry 不自动处理的部分）
	function builderNotes(kind, x) {
		const n = [];
		if (kind === "frames") {
			if (x.variant_of) n.push(`变体骨架：沿用${itemName(x.variant_of)}的牌照，牌照等级 2 可用；与原骨架互斥。`);
			if (x.maker_note) n.push(x.maker_note);
			if (x.no_grit_hp) n.push("HP 不加毅力（Foundry 会照常加上，需手动扣除）。");
			if (x.required_core_bonus) n.push(`需要核心奖励「${coreBonusName(x.required_core_bonus)}」才能使用，不占牌照。`);
			if (x.core_system?.efficient) n.push("核心系统带「高效」：在场景结束时，若已使用过此系统，你重新获得 1 CP。");
		}
		if (x.professional_license) {
			const pl = plById[x.professional_license];
			n.push(`专业牌照：${pl ? pl.name : x.license} ${x.license_level} 级（Foundry 没有专业牌照，不会自动解锁）。`);
		}
		if (x.talent_item) n.push(`天赋装备：由天赋「${talentById[x.talent_id]?.name || x.talent_id}」${x.talent_rank} 级获得，不需要牌照。`);
		if (kind === "weapons") {
			if (x.mount === "Drone") n.push("无人机武器：由无人机使用，机甲本身不能使用（Foundry 中暂按主武器挂载记录）。");
			if (x.types && x.types.length > 1) n.push(`同时视为${x.types.map(t => WTYPE[t] || t).join("与")}武器。`);
			if (x.select_profile) n.push("装备时选定一组数据，之后固定使用该组。");
			if (x.max_mods === 2) n.push(`可安装两个武器改装${x.mod_sp_discount ? `，每个改装 SP -${x.mod_sp_discount}（最低 1）` : ""}。`);
		}
		if (kind === "mods") {
			if (x.stack_tags) n.push("同名数值标签与武器原有标签相加（例如击退 +1），而不是另列一个标签。");
			if (x.restricted_types) n.push(`不能安装到${x.restricted_types.map(t => WTYPE[t] || t).join("、")}武器。`);
			for (const pf of x.profiles || []) n.push(`附加武器数据「${pf.name}」：${profileText(pf)}。`);
		}
		if (kind === "core_bonuses" && /^cb_kkca_(private_tutor|signature_move)$/.test(x.id)) n.push("车卡器会自动计算此核心奖励的效果；Foundry 需手动记录。");
		return n;
	}

	function appendNotes(item, kind, notes) {
		if (!notes.length) return;
		audit.notes += notes.length;
		const block = `<p><i>【车卡器说明】${notes.join("<br>")}</i></p>`;
		const field = ["frames", "talents"].includes(kind) || !item.effect ? "description" : "effect";
		item[field] = (item[field] || "") + block;
	}

	// ---- 修正 Foundry 不接受的值
	function fixActions(list, where) {
		for (const a of list || []) {
			if (a.activation && !ENUM.activation.includes(a.activation)) { audit.fixes.push(`${where}「${a.name}」动作类型 ${a.activation} → Quick`); a.activation = "Quick"; }
			if (!freqOk(a.frequency)) {
				audit.fixes.push(`${where}「${a.name}」频率「${a.frequency}」Foundry 无法解析，改写进说明`);
				a.detail = `（${a.frequency}）${a.detail || ""}`;
				delete a.frequency;
			}
		}
	}
	// Foundry 把部署物建成角色：装甲、回避、电子防御、热度上限、豁免、速度必须是非负整数，大小至少 1/2，
	// 只有 HP 可以写公式（{grit}、{ll}）。不合规的值（如「与部署者相同」的 {evasion}、空字符串）
	// 删掉让 Foundry 用默认值，并在说明里提示 GM 手动修改。
	const DEP_INT = { armor: "装甲", evasion: "回避", edef: "电子防御", heatcap: "热度上限", save: "豁免", speed: "速度" };
	const DEP_REF = { "{evasion}": "与部署者的回避相同", "{edef}": "与部署者的电子防御相同", "{armor}": "与部署者的装甲相同", "{speed}": "与部署者的速度相同", "{save}": "与部署者的豁免相同" };
	function fixDeployableStats(d, where) {
		const notes = [];
		const num = v => (typeof v === "string" && /^\s*\d+(\.\d+)?\s*$/.test(v) ? Number(v) : v);
		for (const [f, zh] of Object.entries(DEP_INT)) {
			if (d[f] === undefined || d[f] === null) continue;
			const v = num(d[f]);
			if (Number.isInteger(v) && v >= 0) { d[f] = v; continue; }
			const raw = String(d[f]).trim();
			if (raw) notes.push(`${zh}${DEP_REF[raw] || `为「${raw}」`}`);
			audit.fixes.push(`${where} 部署物「${d.name}」${f}「${d[f]}」不是整数，改用 Foundry 默认值`);
			delete d[f];
		}
		if (d.size !== undefined) {
			const v = num(d.size);
			if (typeof v === "number" && v >= 0.5) d.size = v;
			else { audit.fixes.push(`${where} 部署物「${d.name}」大小「${d.size}」不合法，改用 Foundry 默认值`); delete d.size; }
		}
		if (d.hp !== undefined && !String(d.hp).trim()) { audit.fixes.push(`${where} 部署物「${d.name}」HP 为空，改用 Foundry 默认值`); delete d.hp; }
		if (notes.length) d.detail = `${d.detail || ""}<p>【车卡器说明】${notes.join("，")}；Foundry 中先显示默认值，请在部署物上手动改成部署者的数值。</p>`;
	}
	function fixDeployables(list, where) {
		for (const d of list || []) { fixActions(d.actions, where + " 部署物"); fixDeployableStats(d, where); for (const f of TEXT_FIELDS) if (d[f]) d[f] = html(d[f]); }
	}
	function finalize(item, kind) {
		for (const k of BUILDER_ONLY) delete item[k];
		const where = item.id;
		fixActions(item.actions, where);
		fixDeployables(item.deployables, where);
		if (kind === "frames") {
			const cs = item.core_system;
			if (cs.active_deployables) { cs.deployables = [...(cs.deployables || []), ...cs.active_deployables]; delete cs.active_deployables; }
			delete cs.efficient;
			fixActions(cs.active_actions, where); fixActions(cs.passive_actions, where); fixDeployables(cs.deployables, where);
			for (const t of item.traits || []) { fixActions(t.actions, where); fixDeployables(t.deployables, where); }
		}
		if (kind === "weapons") {
			if (!ENUM.weaponSize.includes(item.mount)) { audit.fixes.push(`${where} 挂载 ${item.mount} → Main`); item.mount = "Main"; }
			for (const pf of item.profiles || []) { fixActions(pf.actions, where); for (const f of TEXT_FIELDS) if (pf[f]) pf[f] = html(pf[f]); }
		}
		if (kind === "systems" && !ENUM.systemType.includes(item.type)) { if (item.type) audit.fixes.push(`${where} 系统类型 ${item.type} → System`); item.type = "System"; }
		if (kind === "talents") for (const r of item.ranks) { fixActions(r.actions, where); fixDeployables(r.deployables, where); delete r.special_equipment; }
		if (item.description == null) item.description = "";
		const deepHtml = o => {
			if (Array.isArray(o)) return o.forEach(deepHtml);
			if (!o || typeof o !== "object") return;
			for (const [k, v] of Object.entries(o)) {
				if (typeof v === "string" && TEXT_FIELDS.includes(k)) o[k] = html(v);
				else if (typeof v === "object") deepHtml(v);
			}
		};
		deepHtml(item);
		return item;
	}

	function licenseFields(x) {
		if (x.professional_license) return { license: x.license, license_id: x.professional_license, license_level: x.license_level };
		if (x.talent_item || !x.license) return { license: x.license || "", license_level: x.license_level ?? 0 };
		if (x.license === "GMS") return { license: "GMS", license_level: x.license_level ?? 0 };
		const fid = licByName[x.license];
		if (!fid) { audit.mapErrors.push(`${x.id} 的牌照「${x.license}」找不到对应骨架`); return { license: x.license, license_level: x.license_level }; }
		const frame = D.frames.find(f => f.id === fid);
		return { license: frameZh(frame), license_id: outId(fid), license_level: x.license_level };
	}

	// ---- 新条目：车卡器数据 → LCP
	function convert(kind, x) {
		const item = clone(x);
		const notes = builderNotes(kind, x);
		item.name = nameOf(kind, x);
		if (["weapons", "systems", "mods"].includes(kind)) Object.assign(item, licenseFields(x));
		if (item.integrated) item.integrated = item.integrated.map(outId);
		if (kind === "frames") {
			item.license_id = x.variant_of ? outId(x.license_id || x.variant_of) : x.id;
			if (x.required_core_bonus) item.license_level = 0;
			for (const t of item.traits || []) if (t.integrated) t.integrated = t.integrated.map(outId);
			if (item.core_system.integrated) item.core_system.integrated = item.core_system.integrated.map(outId);
		}
		if (kind === "weapons" && x.types?.length) item.type = x.types[0];
		if (kind === "mods") delete item.profiles;
		if (!(item.description || "").trim() && lore(x.id)) item.description = lore(x.id);
		if (kind === "talents") {
			const zh = D.zh.talents[x.name];
			if (zh?.desc) item.description = zh.desc;
			item.ranks = x.ranks.map((r, i) => {
				const rank = { ...r, description: zh?.ranks?.[i]?.html || r.description };
				if (r.special_equipment) rank.description += `<p><i>【车卡器说明】获得特殊装备：${r.special_equipment.map(itemName).join("、")}。</i></p>`;
				return rank;
			});
		}
		appendNotes(item, kind, notes);
		return finalize(item, kind);
	}

	// ---- 官方条目覆盖：以官方记录为底
	const norm = v => String(v ?? "").replace(/~/g, "-").replace(/\s+/g, "").toLowerCase();
	const ACTION_TAGS = new Set(["tg_quick_action", "tg_full_action", "tg_quick_tech", "tg_full_tech", "tg_protocol", "tg_reaction", "tg_free_action", "tg_invade", "tg_deployable", "tg_drone"]);
	// 核心包：只有 data.js 与车卡器自己的 lancer-data 副本不同（v3.5 修正、用户调整）才算有意改动
	const intended = (x, get) => {
		if (!isCore) return true;
		const raw = RAW[x._kind]?.get(x.id);
		return !raw || JSON.stringify(get(x) ?? null) !== JSON.stringify(get(raw) ?? null);
	};
	const diff = (x, field, official, builder) => audit.numberDiffs.push({ id: x.id, name: nameOf(x._kind, x), field, official, builder });
	// 伤害 / 射程：规范化后相同则保留官方写法，否则用车卡器的
	function takeList(dst, x, field, src, label, get) {
		if (!src || (get && !intended(x, get))) return;
		const key = l => (l || []).map(e => `${e.type}:${norm(e.val)}`).sort().join("|");
		if (key(dst[field]) === key(src)) return;
		diff(x, label || field, dst[field], src);
		dst[field] = clone(src);
	}
	// 标签：以车卡器为准合并官方独有的标签；车卡器为显示而加的动作类标签不算差异
	function takeTags(dst, x, src, label, get) {
		if (!src || (get && !intended(x, get))) return;
		const off = dst.tags || [];
		const merged = clone(src);
		for (const t of off) if (!merged.some(m => m.id === t.id)) merged.push(clone(t));
		const show = l => l.filter(t => !ACTION_TAGS.has(t.id)).map(t => t.id + (t.val != null ? "=" + norm(t.val) : "")).sort().join(",");
		if (show(off) !== show(merged)) diff(x, label || "tags", off, src);
		dst.tags = merged;
	}
	function takeValue(dst, x, field, label, eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)) {
		if (x[field] === undefined || eq(dst[field], x[field]) || !intended(x, o => o[field])) return;
		diff(x, label || field, dst[field], x[field]);
		dst[field] = clone(x[field]);
	}
	function overlayText(dst, src, where) {
		for (const f of TEXT_FIELDS) if (typeof src[f] === "string" && CJK.test(src[f])) dst[f] = html(src[f]);
		if (typeof src.name === "string" && CJK.test(src.name) && dst.name !== undefined) dst.name = src.name;
		for (const arr of ["actions", "deployables", "traits", "profiles", "active_actions", "passive_actions"]) {
			const a = dst[arr] || [], b = src[arr] || [];
			// 官方没有这一项：车卡器的文字已在效果说明里，不另加动作（以免与 Foundry 的核心系统按钮重复）
			if (!b.length || !a.length) continue;
			if (a.length !== b.length) {
				audit.structure.push(`${where} 的 ${arr}：官方 ${a.length} 项，车卡器 ${b.length} 项，保留官方结构（英文）`);
				continue;
			}
			a.forEach((el, i) => overlayText(el, b[i], `${where} ${arr}[${i}]`));
		}
	}
	// 天赋等级的中文说明里，动作写成说明块（名称 + 类型，触发 / 效果）。按块给官方动作换上中文：
	// 块数与动作数相同时逐个对应；只有一个动作时，名称与等级同名就用等级中文名，说明用整段等级中文。
	function blocksOf(h) {
		return String(h || "").split('<div class="blk">').slice(1).map(seg => {
			const m = seg.match(/^<div class="blk-h">([\s\S]*?) <span class="muted">[\s\S]*?<\/span><\/div>([\s\S]*)$/);
			if (!m) return null;
			let body = m[2].replace(/<\/div>\s*$/, "");
			const t = body.match(/<p><b>触发：<\/b>([\s\S]*?)<\/p>/);
			if (t) body = body.replace(t[0], "");
			body = body.replace(/<div><b>效果：<\/b>([\s\S]*?)<\/div>/, "$1");
			return { name: strip(m[1]).trim(), trigger: t ? t[1] : "", detail: body };
		}).filter(Boolean);
	}
	function rankActionsZh(rank, zhRank) {
		const acts = rank.actions || [];
		if (!acts.length || !zhRank?.html) return;
		const blks = blocksOf(zhRank.html);
		acts.forEach((a, i) => {
			// 块数对不上时，与等级同名的动作仍可以对应到与中文等级名同名的块
			const b = blks.length === acts.length ? blks[i]
				: (a.name === rank.name ? blks.find(k => k.name === zhRank.name) : null) || null;
			if (b) {
				a.name = b.name;
				a.detail = b.detail;
				if (b.trigger) a.trigger = b.trigger;
			} else if (acts.length === 1) {
				if (a.name === rank.name && zhRank.name) a.name = zhRank.name;
				a.detail = zhRank.html;
				const t = zhRank.html.match(/<p><b>触发：<\/b>([\s\S]*?)<\/p>/);
				if (t && a.trigger) a.trigger = t[1];
			}
		});
	}
	function overlay(kind, x, off) {
		const item = clone(off.rec);
		const where = `${x.id} → ${off.rec.id}`;
		x = { ...x, _kind: kind };
		overlayText(item, x, where);
		item.name = nameOf(kind, x);
		if (kind === "frames") {
			const stats = { ...item.stats };
			for (const [k, v] of Object.entries(x.stats || {})) if (norm(stats[k]) !== norm(v) && intended(x, o => o.stats?.[k])) { diff(x, `骨架数值 ${k}`, stats[k], v); stats[k] = v; }
			item.stats = stats;
			takeValue(item, x, "mounts", "挂载点");
			takeValue(item, x, "mechtype", "定位", (a, b) => [...(a || [])].sort().join() === [...(b || [])].sort().join());
			overlayText(item.core_system, x.core_system, where + " 核心系统");
			if (x.core_system.active_deployables) overlayText(item.core_system, { deployables: x.core_system.active_deployables }, where + " 核心系统");
		}
		if (kind === "weapons") {
			takeValue(item, x, "sp", "SP");
			if (x.mount && ENUM.weaponSize.includes(x.mount)) takeValue(item, x, "mount", "挂载");
			const op = item.profiles || [], bp = x.profiles || [];
			if (bp.length && bp.length === op.length) {
				op.forEach((pf, i) => {
					takeList(pf, x, "damage", bp[i].damage, `数据组 ${i + 1} 伤害`, o => o.profiles?.[i]?.damage);
					takeList(pf, x, "range", bp[i].range, `数据组 ${i + 1} 射程`, o => o.profiles?.[i]?.range);
					takeTags(pf, x, bp[i].tags, `数据组 ${i + 1} 标签`, o => o.profiles?.[i]?.tags);
				});
			} else if (op.length === 1 && !bp.length) {
				takeList(op[0], x, "damage", x.damage, "伤害", o => o.damage); takeList(op[0], x, "range", x.range, "射程", o => o.range); takeTags(op[0], x, x.tags, "tags", o => o.tags);
			} else if (op.length > 1) {
				audit.structure.push(`${where}：官方有 ${op.length} 组数据，车卡器 ${bp.length || 1} 组，保留官方各组数值`);
				if (op[0].tags === undefined && item.tags) takeTags(item, x, x.tags, "tags", o => o.tags);
			} else {
				takeList(item, x, "damage", x.damage, "伤害", o => o.damage); takeList(item, x, "range", x.range, "射程", o => o.range); takeTags(item, x, x.tags, "tags", o => o.tags);
			}
		}
		if (["systems", "mods"].includes(kind)) { takeValue(item, x, "sp", "SP"); takeTags(item, x, x.tags, "tags", o => o.tags); }
		if (kind === "talents") {
			const zh = D.zh.talents[x.name];
			if (zh?.desc) item.description = zh.desc;
			if (item.ranks.length === x.ranks.length) item.ranks.forEach((r, i) => {
				rankActionsZh(r, zh?.ranks?.[i]);
				r.name = zh?.ranks?.[i]?.name || x.ranks[i].name;
				r.description = zh?.ranks?.[i]?.html || x.ranks[i].description;
				if (x.ranks[i].special_equipment) r.description += `<p><i>【车卡器说明】获得特殊装备：${x.ranks[i].special_equipment.map(itemName).join("、")}。</i></p>`;
			});
			else audit.structure.push(`${where} 的天赋等级数不同（官方 ${item.ranks.length}，车卡器 ${x.ranks.length}）`);
		}
		if (kind === "core_bonuses" && !CJK.test(item.effect || "")) {
			// 规则站译文把风味（斜体段落）和效果写在一起，拆回 description / effect
			const zh = Z.cb[nk(x.name)]?.html || "";
			const paras = zh.match(/<p>[\s\S]*?<\/p>|<ul>[\s\S]*?<\/ul>|<table[\s\S]*?<\/table>/g) || [];
			const flavor = paras.filter(p => /^<p><i>[\s\S]*<\/i><\/p>$/.test(p));
			const rules = paras.filter(p => !flavor.includes(p));
			if (rules.length) { item.description = flavor.join(""); item.effect = rules.join(""); }
		}
		if (kind === "pilot_gear" && !CJK.test((item.effect || "") + (item.description || "")) && Z.gear[x.name]?.html) item.description = Z.gear[x.name].html;
		if (kind === "skills" && Z.skills[x.name.toLowerCase()]?.html) {
			const zh = Z.skills[x.name.toLowerCase()].html;
			item.detail = zh;
			item.description = strip(zh).trim();
		}
		if (kind !== "frames" && x.license_level !== undefined && off.rec.license_level !== undefined && x.license_level !== off.rec.license_level)
			diff(x, "牌照等级（保留官方）", off.rec.license_level, x.license_level);
		if (!(x.description || "").trim() && lore(x.id)) item.description = lore(x.id);
		// 部分官方数据只写了 license（骨架名）没写 license_id，Foundry 无法关联到牌照；按车卡器的牌照补上
		if (["weapons", "systems", "mods"].includes(kind) && !item.license_id && item.license && item.license !== "GMS") {
			const lf = licenseFields(x);
			if (lf.license_id) { item.license_id = lf.license_id; audit.fixes.push(`${off.rec.id} 官方数据缺少 license_id，按牌照「${item.license}」补为 ${lf.license_id}`); }
		}
		appendNotes(item, kind, builderNotes(kind, x));
		return finalize(item, kind);
	}

	// ---- 主流程
	const out = Object.fromEntries(kinds.map(k => [k, []]));
	for (const kind of kinds) {
		for (const x of D[kind].filter(P.select)) {
			const target = isCore ? (OFF[kind].has(x.id) ? x.id : null) : MAP[x.id];
			// 车卡器有、Foundry 的 lancer-data 没有的标签照常新增；其他类别缺失说明数据版本对不上
			if (isCore && !target && kind !== "tags") { audit.mapErrors.push(`核心条目 ${x.id} 不在 Foundry 的 lancer-data 中`); continue; }
			if (target) {
				const off = OFF[kind].get(target);
				if (!off) { audit.mapErrors.push(`映射 ${x.id} → ${target}：官方数据中找不到该 ${kind} 条目`); continue; }
				out[kind].push(overlay(kind, x, off));
				audit.overlaid.push({ kind, id: x.id, target, pack: off.pack, name: nameOf(kind, x), officialName: off.rec.name });
			} else {
				out[kind].push(convert(kind, x));
				audit.added.push({ kind, id: x.id, name: nameOf(kind, x) });
			}
		}
	}
	if (!isCore) for (const id of Object.keys(MAP)) if (!KINDS.some(k => D[k].some(y => y.id === id && y.ext))) audit.mapErrors.push(`映射表中的 ${id} 不在车卡器扩展数据里`);

	// 状态与状况（核心包）：以 Foundry 的 statuses.json 为底，名称与说明换成车卡器术语库的中文
	if (isCore) out.statuses = buildStatuses(audit);

	// 手工补译
	const byId = new Map(kinds.flatMap(k => out[k].map(item => [item.id, item])));
	for (const [id, fields] of Object.entries(OVERRIDES)) {
		const item = byId.get(id);
		if (!item) { audit.mapErrors.push(`补译表中的 ${id} 不在内容包里`); continue; }
		for (const [p, v] of Object.entries(fields)) {
			if (setPath(item, p, v)) audit.overrides++;
			else audit.mapErrors.push(`补译表 ${id} 的路径 ${p} 不存在`);
		}
	}

	// 仍为英文的文字：名称不含汉字且有英文单词；其他文字含连续 4 个以上英文词
	const EN = /[A-Za-z][A-Za-z'’]+(?:[\s,\-–]+[A-Za-z][A-Za-z'’]*){3,}/;
	const scan = (o, p, id) => {
		if (Array.isArray(o)) return o.forEach((v, i) => scan(v, `${p}[${i}]`, id));
		if (!o || typeof o !== "object") return;
		for (const [k, v] of Object.entries(o)) {
			const at = `${p}.${k}`.replace(/^\./, "");
			if (typeof v === "string") {
				const t = strip(v).trim();
				// 名称：不含汉字且有英文单词；全大写的短代号（如用户资料中的「DMR」）不算
				if (k === "name" ? (!CJK.test(t) && /[A-Za-z]{3,}/.test(t) && !/^[A-Z0-9][A-Z0-9 \/.+-]{0,7}$/.test(t)) : (TEXT_FIELDS.includes(k) && EN.test(t)))
					audit.english.push({ id, path: at, text: t, raw: v });
			} else if (typeof v === "object") scan(v, at, id);
		}
	};
	for (const k of kinds) for (const item of out[k]) scan(item, "", item.id);
	const overlaidIds = new Set(audit.overlaid.map(o => o.target));

	// 官方补充书中没有被覆盖的条目（导入后仍是英文）
	const untouched = [];
	for (const k of kinds) for (const [id, { rec, pack }] of OFF[k]) if (!overlaidIds.has(id)) untouched.push({ kind: k, id, name: rec.name, pack });

	// 部署物 lid 由名字生成（"dep_" + 名字），重名会互相覆盖
	const depNames = new Map();
	const collectDeps = (o, owner) => {
		if (Array.isArray(o)) return o.forEach(v => collectDeps(v, owner));
		if (!o || typeof o !== "object") return;
		for (const [k, v] of Object.entries(o)) {
			if (k === "deployables" && Array.isArray(v)) for (const d of v) { const key = d.name.trim().replace(/[:\\\/\-\s]+/g, "_").toLowerCase(); const prev = depNames.get(key); if (prev && prev.json !== JSON.stringify(d)) audit.structure.push(`部署物「${d.name}」在 ${prev.owner} 与 ${owner} 中重名但内容不同，Foundry 中会互相覆盖`); else depNames.set(key, { owner, json: JSON.stringify(d) }); }
			else if (typeof v === "object") collectDeps(v, owner);
		}
	};
	for (const k of kinds) for (const item of out[k]) collectDeps(item, item.id);

	return { D, out, audit, untouched, packs, packId, P };
}

// ---- 状态与状况：Foundry 按 id（没有 id 时按 icon）生成 lid 并覆盖已有条目，所以保留官方的 icon / type / exclusive
function loadGlossary() {
	const ctx = {};
	vm.createContext(ctx);
	// glossary.js 是浏览器脚本，顶层 const 在 vm 中取不到，改成 var
	vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/glossary.js"), "utf8").replace(/^const /gm, "var "), ctx);
	return ctx.GLOSSARY_SRC;
}
function buildStatuses(audit) {
	const base = JSON.parse(fs.readFileSync(path.join(FVTT, "core", "statuses.json"), "utf8"));
	const map = JSON.parse(fs.readFileSync(path.join(FVTT, "statuses-zh.json"), "utf8"));
	const glossary = loadGlossary();
	const out = [];
	for (const s of base) {
		const m = map[s.icon];
		if (!m) { audit.mapErrors.push(`状态 ${s.name}（${s.icon}）没有对应的中文`); out.push(clone(s)); continue; }
		const g = glossary.filter(x => x.t === m.term);
		if (g.length !== 1) { audit.mapErrors.push(`状态 ${s.name}：术语库中「${m.term}」有 ${g.length} 条`); out.push(clone(s)); continue; }
		const effects = g[0].d.replace(/<p class="muted">([\s\S]*?)<\/p>/g, "<p><i>$1</i></p>");
		out.push({ ...clone(s), name: m.term, terse: m.terse, effects });
	}
	for (const icon of Object.keys(map)) if (!icon.startsWith("_") && !base.some(s => s.icon === icon)) audit.mapErrors.push(`statuses-zh.json 的 ${icon} 不在 Foundry 的状态数据中`);
	return out;
}

// ---- 极简 zip 写入（deflate），JSZip 可读
function zip(files) {
	const local = [], central = [];
	let offset = 0;
	for (const [name, text] of files) {
		const data = Buffer.from(text, "utf8");
		const comp = zlib.deflateRawSync(data, { level: 9 });
		const nameBuf = Buffer.from(name, "utf8");
		const crc = zlib.crc32(data);
		const head = Buffer.alloc(30);
		head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6); head.writeUInt16LE(8, 8);
		head.writeUInt16LE(0, 10); head.writeUInt16LE(0x21, 12); head.writeUInt32LE(crc >>> 0, 14);
		head.writeUInt32LE(comp.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(nameBuf.length, 26); head.writeUInt16LE(0, 28);
		local.push(head, nameBuf, comp);
		const cen = Buffer.alloc(46);
		cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8); cen.writeUInt16LE(8, 10);
		cen.writeUInt16LE(0, 12); cen.writeUInt16LE(0x21, 14); cen.writeUInt32LE(crc >>> 0, 16); cen.writeUInt32LE(comp.length, 20);
		cen.writeUInt32LE(data.length, 24); cen.writeUInt16LE(nameBuf.length, 28); cen.writeUInt32LE(offset, 42);
		central.push(cen, nameBuf);
		offset += 30 + nameBuf.length + comp.length;
	}
	const cenSize = central.reduce((n, b) => n + b.length, 0);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
	end.writeUInt32LE(cenSize, 12); end.writeUInt32LE(offset, 16);
	return Buffer.concat([...local, ...central, end]);
}

function lcpFiles(out, P = PACKS.ext) {
	const files = [["lcp_manifest.json", JSON.stringify(P.manifest, null, 2)]];
	for (const k of P.kinds) if (out[k]?.length) files.push([`${k}.json`, JSON.stringify(out[k], null, 2)]);
	if (out.statuses?.length) files.push(["statuses.json", JSON.stringify(out.statuses, null, 2)]);
	return files;
}

function auditMarkdown({ out, audit, untouched, packs, packId, P }) {
	const isCore = packId === "core";
	const L = [];
	const cell = v => String(typeof v === "string" ? v : JSON.stringify(v)).replace(/\|/g, "\\|").replace(/\n/g, " ");
	L.push(`# Foundry LCP 导出核对表：${isCore ? "核心规则书" : "扩展内容"}`, "", "由 `node tools/build-lcp.js` 生成，请勿手改。", "");
	L.push(`内容包：${P.manifest.name} ${P.manifest.version}`, "");
	L.push("| 类别 | 条目数 |", "|---|---|", ...P.kinds.map(k => `| ${k} | ${out[k].length} |`), ...(out.statuses ? [`| statuses | ${out.statuses.length} |`] : []), "");
	L.push(`- 覆盖官方条目：${audit.overlaid.length}`, `- 新增条目：${audit.added.length}`, `- 写入的车卡器说明：${audit.notes} 条`, `- 补译：${audit.overrides} 处`, "");
	L.push("官方数据版本：" + packs.map(p => `${p.name} ${p.version}`).join("，"), "");
	if (audit.mapErrors.length) L.push("## 映射错误", "", ...audit.mapErrors.map(s => `- ${s}`), "");
	L.push("## 数值差异（以车卡器为准）", "",
		isCore ? "只采用车卡器有意改过的数值（data.js 与车卡器的 lancer-data 副本不同，例如 v3.5 修正），其余沿用 Foundry 的 lancer-data。"
			: "覆盖官方条目时改用了车卡器的数值。这里列出与官方不同之处，便于确认是有意调整还是转录差异。", "");
	if (audit.numberDiffs.length) {
		L.push("| 条目 | 字段 | 官方 | 车卡器 |", "|---|---|---|---|");
		for (const d of audit.numberDiffs) L.push(`| ${d.name}（${d.id}） | ${d.field} | ${cell(d.official)} | ${cell(d.builder)} |`);
	} else L.push("无。");
	L.push("", "## 结构不一致", "", "官方与车卡器的动作、部署物等数量不同时保留官方结构，对应文字仍是英文。", "");
	L.push(...(audit.structure.length ? audit.structure.map(s => `- ${s}`) : ["无。"]));
	L.push("", "## 覆盖后仍为英文的文字", "");
	L.push(`补译方法：把 \`dist/fvtt/${P.todo}\` 中需要的条目复制到 \`source/fvtt/${P.overrides}\`，把英文换成中文后重新运行构建。`, "");
	if (audit.english.length) { L.push("| 条目 | 位置 | 英文 |", "|---|---|---|"); for (const e of audit.english) L.push(`| ${e.id} | ${e.path} | ${cell(e.text.length > 160 ? e.text.slice(0, 160) + "…" : e.text)} |`); }
	else L.push("无。");
	L.push("", "## 自动修正", "", ...(audit.fixes.length ? audit.fixes.map(s => `- ${s}`) : ["无。"]));
	if (!isCore) {
		L.push("", "## 覆盖的官方条目", "", "| 类别 | 车卡器 id | 官方 id | 补充书 | 中文名 | 官方名 |", "|---|---|---|---|---|---|");
		for (const o of audit.overlaid) L.push(`| ${o.kind} | ${o.id} | ${o.target} | ${o.pack} | ${cell(o.name)} | ${cell(o.officialName)} |`);
	}
	L.push("", `## ${isCore ? "lancer-data" : "官方补充书"}中未覆盖的条目（导入后仍为英文）`, "", "| 类别 | 官方 id | 名称 | 来源 |", "|---|---|---|---|");
	for (const u of untouched) L.push(`| ${u.kind} | ${u.id} | ${cell(u.name)} | ${u.pack} |`);
	if (!untouched.length) L.push("| — | — | 无 | — |");
	if (!isCore) {
		L.push("", "## 新增条目", "", "| 类别 | id | 名称 |", "|---|---|---|");
		for (const a of audit.added) L.push(`| ${a.kind} | ${a.id} | ${cell(a.name)} |`);
	}
	return L.join("\n") + "\n";
}

function writePack(packId) {
	const result = build(packId);
	const P = result.P;
	const dist = path.join(ROOT, "dist", "fvtt");
	fs.mkdirSync(dist, { recursive: true });
	fs.writeFileSync(path.join(dist, P.lcp), zip(lcpFiles(result.out, P)));
	fs.writeFileSync(path.join(ROOT, "docs", P.audit), auditMarkdown(result));
	const a = result.audit;
	const todo = {};
	for (const e of a.english) (todo[e.id] = todo[e.id] || {})[e.path] = e.raw; // 保留 HTML，译文须保留同样的标签
	fs.writeFileSync(path.join(dist, P.todo), JSON.stringify(todo, null, "\t") + "\n");
	console.log(`[${packId}] LCP：dist/fvtt/${P.lcp}（${P.kinds.map(k => `${k} ${result.out[k].length}`).join("，")}）`);
	console.log(`[${packId}] 覆盖官方 ${a.overlaid.length}，新增 ${a.added.length}；数值差异 ${a.numberDiffs.length}，结构不一致 ${a.structure.length}，残留英文 ${a.english.length}，自动修正 ${a.fixes.length}，补译 ${a.overrides}；核对表 docs/${P.audit}`);
	if (a.mapErrors.length) { console.error(`[${packId}] 映射错误：\n  ` + a.mapErrors.join("\n  ")); process.exitCode = 1; }
}

if (require.main === module) {
	const arg = process.argv[2];
	if (arg && !PACKS[arg]) { console.error(`未知的内容包：${arg}（可选 ${Object.keys(PACKS).join(" / ")}）`); process.exit(1); }
	for (const id of arg ? [arg] : Object.keys(PACKS)) writePack(id);
}

module.exports = { build, zip, lcpFiles, loadOfficial, ENUM, KINDS, CORE_KINDS, TEXT_FIELDS, PACKS, MANIFEST, freqOk };

