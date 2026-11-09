"use strict";
// 检查 tools/build-lcp.js 生成的两个 Foundry 内容包（扩展内容、核心规则书）：
// - zip 能解开，清单合法（Foundry 只收 v2 LCP），dist 中的文件是最新构建结果
// - 枚举值、动作频率都是 Foundry v3.1.3 数据模型接受的值（不合法会让整批条目导入失败）
// - 牌照、内建装备、标签引用都能找到
// - id 不重复，新条目不会意外覆盖核心或官方条目
// - 映射表与补译表没有失效项；几处代表性条目的转换结果
// 用法：node tools/test-lcp.js

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { build, zip, lcpFiles, ENUM, CORE_KINDS, PACKS, freqOk } = require("./build-lcp");

const ROOT = path.join(__dirname, "..");
let failures = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { failures++; console.error("✗ " + msg); } };

// ---- 解 zip（只支持 build-lcp 写出的 deflate / store）
function unzip(buf) {
	const files = {};
	const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
	const count = buf.readUInt16LE(eocd + 10);
	let p = buf.readUInt32LE(eocd + 16);
	for (let i = 0; i < count; i++) {
		const method = buf.readUInt16LE(p + 10), crc = buf.readUInt32LE(p + 16), csize = buf.readUInt32LE(p + 20);
		const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
		const name = buf.slice(p + 46, p + 46 + nlen).toString("utf8");
		const lnlen = buf.readUInt16LE(off + 26), lxlen = buf.readUInt16LE(off + 28);
		const raw = buf.slice(off + 30 + lnlen + lxlen, off + 30 + lnlen + lxlen + csize);
		const data = method === 8 ? zlib.inflateRawSync(raw) : raw;
		ok((zlib.crc32(data) >>> 0) === crc, `${name} CRC 校验失败`);
		files[name] = data.toString("utf8");
		p += 46 + nlen + xlen + clen;
	}
	return files;
}

const readJson = f => JSON.parse(fs.readFileSync(f, "utf8"));
const results = Object.fromEntries(Object.keys(PACKS).map(id => [id, build(id)]));

// ---- 参照数据：Foundry 的 lancer-data、官方补充书快照、车卡器的 lancer-data 副本、两个内容包
const known = Object.fromEntries(CORE_KINDS.map(k => [k, new Set()]));
const coreIds = new Set(), officialIds = new Set(), tagIds = new Set();
const addDir = (dir, set) => {
	for (const k of CORE_KINDS) {
		const f = path.join(dir, k + ".json");
		if (!fs.existsSync(f)) continue;
		for (const x of readJson(f)) { if (k === "tags") tagIds.add(x.id); else known[k].add(x.id); set.add(x.id); }
	}
};
addDir(path.join(ROOT, "source/lancer-data"), coreIds);
addDir(path.join(ROOT, "source/fvtt/core"), coreIds);
const offDir = path.join(ROOT, "source/fvtt/official");
for (const pack of fs.readdirSync(offDir)) addDir(path.join(offDir, pack), officialIds);
for (const { out } of Object.values(results)) for (const k of CORE_KINDS) for (const x of out[k] || []) (k === "tags" ? tagIds : known[k]).add(x.id);
const frameIds = known.frames;
const equipIds = new Set([...known.weapons, ...known.systems, ...known.mods, ...known.pilot_gear]);

const CJK = /[㐀-鿿]/;
const hasText = s => typeof s === "string" && s.trim().length > 0;
const integratedOk = (list, where) => { for (const id of list || []) ok(equipIds.has(id), `${where} 内建装备找不到：${id}`); };

// ---- 递归检查动作、伤害、射程、标签、部署物
// coerce：官方数据里的武器类型、伤害 / 射程类型由 Foundry 的 restrict_enum 修正，不会导致导入失败
function walk(o, where, coerce = false) {
	if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${where}[${i}]`, coerce));
	if (!o || typeof o !== "object") return;
	if ("frequency" in o) ok(freqOk(o.frequency), `${where} 频率「${o.frequency}」Foundry 无法解析`);
	for (const f of ["activation", "deactivation", "recall", "redeploy"])
		// 空字符串出现在官方数据里，Foundry 照常导入
		if (typeof o[f] === "string" && o[f] !== "") ok(ENUM.activation.includes(o[f]), `${where}.${f} 不合法：${o[f]}`);
	for (const d of o.damage || []) if (d && typeof d === "object" && !coerce) ok(ENUM.damage.includes(d.type) || ENUM.damage.includes(String(d.type)[0].toUpperCase() + String(d.type).slice(1)), `${where} 伤害类型不合法：${d.type}`);
	for (const r of o.range || []) if (r && typeof r === "object" && !coerce) ok(ENUM.range.includes(r.type), `${where} 射程类型不合法：${r.type}`);
	for (const t of Array.isArray(o.tags) ? o.tags : []) ok(tagIds.has(t.id), `${where} 标签不存在：${t.id}`);
	for (const t of Array.isArray(o.added_tags) ? o.added_tags : []) ok(tagIds.has(t.id), `${where} 附加标签不存在：${t.id}`);
	for (const d of Array.isArray(o.deployables) ? o.deployables : []) ok(typeof d.name === "string" && d.name.trim() && typeof d.type === "string", `${where} 部署物缺少名称或类型`);
	for (const [k, v] of Object.entries(o)) if (v && typeof v === "object") walk(v, `${where}.${k}`, coerce);
}

function checkPack(packId) {
	const { out, audit, P } = results[packId];
	const kinds = P.kinds;
	const label = `[${packId}]`;

	// zip 往返与 dist 中的文件
	const files = unzip(zip(lcpFiles(out, P)));
	const manifest = JSON.parse(files["lcp_manifest.json"]);
	ok(["name", "author", "version"].every(k => typeof manifest[k] === "string" && manifest[k]), `${label} 清单需要字符串 name / author / version`);
	ok(!manifest.v3, `${label} Foundry 不接受 v3 LCP`);
	for (const k of kinds) if (out[k].length) ok(JSON.parse(files[`${k}.json`]).length === out[k].length, `${label} ${k}.json 条目数与构建结果不一致`);
	const lcpPath = path.join(ROOT, "dist/fvtt", P.lcp);
	ok(fs.existsSync(lcpPath), `${label} 缺少 dist/fvtt/${P.lcp}，请运行 node tools/build-lcp.js`);
	if (fs.existsSync(lcpPath)) {
		const disk = unzip(fs.readFileSync(lcpPath));
		ok(Object.keys(files).every(f => disk[f] === files[f]), `${label} dist 中的 LCP 不是最新构建结果，请重新运行 node tools/build-lcp.js`);
	}

	// id
	const overlaidTargets = new Set(audit.overlaid.map(o => o.target));
	const seen = new Set();
	for (const k of kinds) for (const x of out[k]) {
		ok(typeof x.id === "string" && x.id, `${label} ${k} 条目缺少 id`);
		ok(!seen.has(x.id), `${label} id 重复：${x.id}`);
		seen.add(x.id);
		if (!overlaidTargets.has(x.id) && k !== "tags") ok(!coreIds.has(x.id) && !officialIds.has(x.id), `${label} 新条目 ${x.id} 与核心或官方条目同 id，会覆盖它`);
	}
	for (const k of kinds) for (const x of out[k]) walk(x, x.id, overlaidTargets.has(x.id));

	// 部署物会被建成 Foundry 角色：这些数值不是非负整数会让整批导入报错（LancerActor validation errors）
	const depInt = ["armor", "evasion", "edef", "heatcap", "save", "speed"];
	const depWalk = (o, id) => {
		if (Array.isArray(o)) return o.forEach(v => depWalk(v, id));
		if (!o || typeof o !== "object") return;
		for (const [key, v] of Object.entries(o)) {
			if (key === "deployables" && Array.isArray(v)) for (const d of v) {
				for (const f of depInt) if (d[f] !== undefined) ok(Number.isInteger(d[f]) && d[f] >= 0, `${label} ${id} 部署物「${d.name}」的 ${f} 必须是非负整数，实际 ${JSON.stringify(d[f])}`);
				if (d.size !== undefined) ok(typeof d.size === "number" && d.size >= 0.5, `${label} ${id} 部署物「${d.name}」的大小不合法：${JSON.stringify(d.size)}`);
				if (d.hp !== undefined) ok(/^\s*\d+(\s*[+*-]\s*(\d+|\{(grit|ll)\}))*\s*$/.test(String(d.hp)), `${label} ${id} 部署物「${d.name}」的 HP 不是数字或公式：${JSON.stringify(d.hp)}`);
			}
			if (typeof v === "object") depWalk(v, id);
		}
	};
	for (const k of kinds) for (const x of out[k]) depWalk(x, x.id);

	for (const f of out.frames) {
		ok(hasText(f.name), `${f.id} 缺少名称`);
		ok((f.mechtype || []).every(t => ENUM.mechType.includes(t)), `${f.id} 定位不合法：${f.mechtype}`);
		ok((f.mounts || []).length > 0 && f.mounts.every(t => ENUM.mount.includes(t)), `${f.id} 挂载点不合法：${f.mounts}`);
		ok(f.stats && ["hp", "evasion", "edef", "heatcap", "sp", "speed", "save", "size"].every(s => typeof f.stats[s] === "number"), `${f.id} 骨架数值不完整`);
		ok(f.core_system && hasText(f.core_system.name), `${f.id} 缺少核心系统`);
		ok(!f.license_id || frameIds.has(f.license_id), `${f.id} 牌照骨架找不到：${f.license_id}`);
		integratedOk(f.core_system.integrated, f.id + " 核心系统");
		for (const t of f.traits || []) integratedOk(t.integrated, f.id + " 特性");
	}
	for (const k of ["weapons", "systems", "mods"]) for (const x of out[k]) {
		ok(hasText(x.name), `${x.id} 缺少名称`);
		if (x.license_id) ok(frameIds.has(x.license_id) || /^pl_/.test(x.license_id), `${x.id} 牌照找不到：${x.license_id}`);
		integratedOk(x.integrated, x.id);
	}
	for (const w of out.weapons) {
		ok(ENUM.weaponSize.includes(w.mount), `${w.id} 挂载不合法：${w.mount}`);
		const coerce = overlaidTargets.has(w.id);
		if (w.type && !coerce) ok(ENUM.weaponType.includes(w.type), `${w.id} 武器类型不合法：${w.type}`);
		for (const pf of w.profiles || []) if (pf.type && !coerce) ok(ENUM.weaponType.includes(pf.type), `${w.id} 数据组类型不合法：${pf.type}`);
	}
	for (const s of out.systems) ok(ENUM.systemType.includes(s.type), `${s.id} 系统类型不合法：${s.type}`);
	for (const m of out.mods) {
		ok((m.allowed_types || []).every(t => ENUM.weaponType.includes(t)), `${m.id} 适用类型不合法`);
		ok((m.allowed_sizes || []).every(t => ENUM.weaponSize.includes(t)), `${m.id} 适用尺寸不合法`);
	}
	for (const t of out.talents) {
		ok(hasText(t.name) && Array.isArray(t.ranks) && t.ranks.length > 0, `${t.id} 天赋等级缺失`);
		for (const r of t.ranks || []) ok(hasText(r.name) && hasText(r.description), `${t.id} 天赋等级缺少名称或说明`);
		for (const r of t.ranks || []) integratedOk(r.integrated, t.id);
	}

	// 车卡器独有字段与说明块不应留在内容包里
	const builderOnly = ["ext", "pack", "zh_name", "variant_of", "talent_item", "professional_license", "active_deployables", "special_equipment"];
	for (const k of kinds) for (const x of out[k]) {
		const json = JSON.stringify(x);
		for (const f of builderOnly) ok(!json.includes(`"${f}":`), `${x.id} 残留车卡器字段 ${f}`);
		ok(!json.includes('class=\\"blk'), `${x.id} 残留车卡器说明块（.blk）`);
	}

	// 覆盖的官方条目要换成车卡器的名称
	for (const o of audit.overlaid) {
		const item = out[o.kind].find(x => x.id === o.target);
		ok(item && item.name === o.name, `${o.target} 覆盖后名称应为「${o.name}」：${item && item.name}`);
	}
	ok(audit.mapErrors.length === 0, `${label} 映射或补译表有错误：\n  ` + audit.mapErrors.join("\n  "));
	return results[packId];
}

// ---- 扩展内容
{
	const { out, audit } = checkPack("ext");
	// NPC 模板与特性（官方补充书数据 + zh-npc.json）
	const offNpc = { npc_templates: [], npc_features: [] };
	for (const pack of fs.readdirSync(offDir)) for (const k of Object.keys(offNpc)) { const f = path.join(offDir, pack, k + ".json"); if (fs.existsSync(f)) offNpc[k].push(...readJson(f)); }
	const lcpFilesExt = unzip(fs.readFileSync(path.join(ROOT, "dist/fvtt", PACKS.ext.lcp)));
	for (const k of Object.keys(offNpc)) {
		const got = out[k] || [];
		ok(got.length === offNpc[k].length && got.length > 0, `${k} 应全部导出（${got.length} / ${offNpc[k].length}）`);
		ok(lcpFilesExt[`${k}.json`] && JSON.parse(lcpFilesExt[`${k}.json`]).length === got.length, `扩展包应包含 ${k}.json`);
		for (const x of got) {
			const o = offNpc[k].find(y => y.id === x.id);
			ok(CJK.test(x.name), `${k} ${x.id} 名称应为中文：${x.name}`);
			for (const f of ["type", "weapon_type", "damage", "range", "tags", "base_features", "optional_features", "attack_bonus", "accuracy", "uses", "recharge"])
				ok(JSON.stringify(x[f]) === JSON.stringify(o[f]), `${k} ${x.id} 的 ${f} 应与官方相同（Foundry 依赖英文枚举与数值）`);
			for (const f of ["effect", "description", "on_hit", "trigger"]) if (/[A-Za-z]{4,}/.test(String(o[f] || "").replace(/<[^>]+>/g, ""))) ok(CJK.test(x[f] || ""), `${k} ${x.id} 的 ${f} 应为中文`);
		}
	}
	const tplZh = Object.fromEntries((out.npc_templates || []).map(t => [offNpc.npc_templates.find(o => o.id === t.id).name, t.name]));
	for (const ft of out.npc_features || []) if (ft.origin?.type === "Template" && ft.origin.name) ok(Object.values(tplZh).includes(ft.origin.name), `NPC 特性 ${ft.id} 的来源模板名应为中文：${ft.origin.name}`);

	// 自动生成的动作按钮（说明块 + source/fvtt/ext-actions.json）
	ok(audit.autoActions.length >= 80, `扩展条目应自动生成动作按钮（实际 ${audit.autoActions.length}）`);
	const sysById = id => out.systems.find(s => s.id === id);
	const white = sysById("ms_ext_comet_white_star");
	ok(white?.actions?.length === 2 && white.actions.every(a => a.activation === "Invade") && !/blk|中继协议/.test(white.effect), "白星信号拦截器的两个入侵选项应转成动作，并从效果文字中移除");
	const shield = sysById("ms_ch_shield_array")?.actions?.[0];
	ok(shield?.activation === "Reaction" && shield.frequency === "1/Round" && /远程攻击/.test(shield.trigger || ""), "盾牌阵列无人机的反应应带频率与触发");
	ok(sysById("ms_ext_gas_grenade_dispenser")?.actions?.[0]?.activation === "Quick", "正文里的快速动作（瓦斯榴弹抛洒器）应生成按钮");
	ok(out.frames.find(f => f.id === "mf_ext_red_admiral")?.traits[1]?.actions?.[0]?.activation === "Reaction", "骨架特征里的反应（赤蛱蝶「截剑流拔刀术」）应生成按钮");
	ok(!(sysById("ms_ch_swallow")?.actions || []).length, "ext-actions.json 中写成 [] 的条目不加动作");
	// 附带武器数据的改装 → 另导出可直接攻击的附带武器
	const under = out.weapons.find(w => w.id === "mw_pl_underslung_data");
	ok(under && under.name === "下挂式冲击器（附带武器）" && under.mount === "Auxiliary" && under.type === "Launcher" && under.damage[0]?.val === 5 && under.range[0]?.val === 3, "下挂式冲击器应另导出为附带武器（副武器发射器，射程 3，5 爆炸）");
	ok(under && under.tags.some(t => t.id === "tg_ap") && under.tags.some(t => t.id === "tg_loading") && under.no_bonus && under.no_core_bonus && under.sp === 0, "附带武器：穿甲、装填，不受其他改装与核心奖励影响，0 SP");
	ok(under && under.license_id === "pl_ips_vanguard" && /离散/.test(under.on_hit), "附带武器沿用改装的牌照，命中效果取自改装说明");
	// 犹大漏洞是命中后的追加动作（自由动作），不是快速科技
	const judas = sysById("ms_ext_judas_exploit")?.actions?.[0];
	ok(judas?.activation === "Free" && judas.frequency === "1/Scene" && /命中/.test(judas.trigger || ""), "犹大漏洞应为带触发的自由动作");
	// 2026-11-09 动作推断复核（FVTT-ACTION-INFERENCE-REVIEW）：频率属于哪个动作、按钮按操作拆分
	const acts = (list) => (list || []).map(a => `${a.name}|${a.activation}|${a.frequency || ""}`);
	ok(!acts(sysById("ms_piof_cicada_chatter")?.actions).some(s => s.endsWith("1/Scene")) && acts(sysById("ms_piof_cicada_chatter")?.actions).includes("集中噪音|Quick|"), "蝉鸣叨叨：1/场景限制的是受影响角色，动作本身不设频率");
	ok(JSON.stringify(acts(sysById("ms_ch_seismic_pulse")?.actions)) === JSON.stringify(["激活脉冲场|Protocol|", "震碎地形|Quick|1/Round"]), "地震脉冲场：激活为协定，1/轮属于震碎地形");
	ok(acts(sysById("ms_ch_saboteur")?.actions).includes("执行骑乘选项|Free|1/Round") && acts(sysById("ms_ch_saboteur")?.actions).includes("部署并骑乘|Quick|"), "破坏者无人机：1/轮属于自由动作的骑乘选项");
	const plating = sysById("ms_kkca_transdomain_plating")?.actions || [];
	ok(plating.length === 2 && plating[1].activation === "Reaction" && /被攻击命中/.test(plating[1].trigger), "跨域镀层：自毁抵消的反应触发是「你被命中」");
	ok(acts(sysById("ms_ext_unsigned_surrender")?.actions).join() === "插旗坚守|Quick|,停止坚守|Protocol|", "拒签投降书：启动为快速动作，协定是停止");
	const orni = out.frames.find(f => f.id === "mf_ext_ornithoptera");
	ok(/推、拉、击退或伏卧/.test(orni?.traits[0]?.actions?.[0]?.trigger || "") && /紧缚/.test(orni?.core_system?.passive_actions?.[0]?.detail || ""), "鸟翼蝶：丝之舞的触发、单丝线轴的三个效果完整");
	const anise = out.frames.find(f => f.id === "mf_piof_star_anise")?.core_system?.passive_actions || [];
	ok(anise.map(a => `${a.name}|${a.activation}`).join() === "部署建筑项目|Quick,藤蔓传送|Free,拆除项目|Quick", "八角：部署为快速动作，自由动作只是藤蔓传送");
	// 说明文字里写了数值的部署物（source/fvtt/ext-deployables.json）
	const depOf = (list, name) => (list || []).find(d => d.name === name);
	const night = depOf(sysById("ms_ch_nightjar")?.deployables, "夜莺无人机");
	ok(night && night.type === "Drone" && night.size === 0.5 && night.hp === 5 && night.evasion === 10 && night.edef === 10, "夜莺无人机应成为部署物（大小 1/2，5 HP，10 回避 / 电子防御）");
	const tower = depOf(sysById("ms_ext_agrippa_tower")?.deployables, "休克桥塔");
	ok(tower && tower.size === 1 && tower.hp === 10 && tower.evasion === 5 && tower.edef === undefined && /电子防御/.test(tower.detail), "休克桥塔：原文没写电子防御时不补，说明里提示");
	const anchor = depOf(out.frames.find(f => f.id === "mf_ch_retiarius")?.core_system?.deployables, "锚点装置");
	ok(anchor && anchor.instances === 3 && anchor.size === 0.5 && anchor.hp === 10, "网斗士核心的锚点装置：一次部署 3 个");
	const extDeps = readJson(path.join(ROOT, "source/fvtt/ext-deployables.json"));
	for (const [id, list] of Object.entries(extDeps)) {
		if (id.startsWith("_")) continue;
		ok(audit.added.some(a => a.id === id), `ext-deployables.json 的 ${id} 应是扩展包新增的条目`);
		for (const d of list) {
			ok(["Deployable", "Drone", "Mine"].includes(d.type) && CJK.test(d.name) && CJK.test(d.detail), `ext-deployables.json 的 ${id}「${d.name}」类型、名称或说明不合法`);
			ok(d.hp !== undefined && d.evasion !== undefined, `ext-deployables.json 的 ${id}「${d.name}」应写明 HP 与回避（照原文）`);
		}
	}
	const extActions = readJson(path.join(ROOT, "source/fvtt/ext-actions.json"));
	const activations = ["Quick", "Full", "Free", "Reaction", "Protocol", "Quick Tech", "Full Tech", "Invade"];
	for (const [id, list] of Object.entries(extActions)) {
		if (id.startsWith("_")) continue;
		ok(audit.added.some(a => a.id === id), `ext-actions.json 的 ${id} 应是扩展包新增的条目（覆盖官方的条目保留官方动作）`);
		for (const a of list) {
			ok(a.name && CJK.test(a.name) && a.detail, `ext-actions.json 的 ${id} 动作缺少中文名称或说明`);
			ok(activations.includes(a.activation), `ext-actions.json 的 ${id}「${a.name}」类型不合法：${a.activation}`);
			ok(freqOk(a.frequency), `ext-actions.json 的 ${id}「${a.name}」频率不合法：${a.frequency}`);
		}
	}
	ok(!out.frames.some(f => f.id === "mf_ext_chomolungma"), "珠穆朗玛不应再以车卡器 id 导出");
	const chomo = out.frames.find(f => f.id === "mf_chomolungma");
	ok(chomo && chomo.name === "珠穆朗玛" && chomo.stats.sp === 7, "珠穆朗玛应覆盖官方 mf_chomolungma");
	const bligh = out.frames.find(f => f.id === "mf_ext_bligh");
	ok(bligh && bligh.license_id === "mf_kidd", "布莱（基德变体）的牌照应指向官方 mf_kidd");
	const gilgaRifle = out.weapons.find(w => w.id === "mw_legionnaire_battle_rifle");
	ok(gilgaRifle && gilgaRifle.license_id === "mf_gilgamesh", "军团战士战斗步枪应挂在官方吉尔伽美什牌照下");
	const crew = out.weapons.find(w => w.id === "mw_ext_crew_sword");
	ok(crew && crew.mount === "Main" && /无人机武器/.test(crew.effect + crew.description), "无人机武器改为 Main 挂载并写明说明");
	const misdirect = JSON.stringify(out.systems.find(s => s.id === "ms_piof_smoke_generator") || {});
	ok(!misdirect.includes('"frequency":"X/'), "X/轮 频率应改写进说明");
	const tutor = out.core_bonuses.find(c => c.id === "cb_kkca_private_tutor");
	ok(tutor && /车卡器说明/.test(tutor.effect || tutor.description), "私人家教应注明需手动处理");
	const kang = out.frames.find(f => f.id === "mf_ext_kanggeduo");
	ok(kang && /康格多底盘/.test(kang.description), "康格多应注明需要核心奖励");
	const plItem = out.weapons.find(w => w.id === "mw_pl_buckler");
	ok(plItem && plItem.license_id === "pl_ips_vanguard" && /专业牌照/.test(plItem.effect + plItem.description), "专业牌照装备应注明专业牌照");
	ok(audit.overlaid.length === 108, `扩展包应覆盖 108 个官方条目，实际 ${audit.overlaid.length}`);
}

// ---- 核心规则书
{
	const { out, audit, untouched } = checkPack("core");
	ok(untouched.length === 0, "Foundry lancer-data 中的核心条目应全部覆盖：" + untouched.map(u => u.id).join(", "));
	ok(audit.added.every(a => a.kind === "tags"), "核心包只应新增标签：" + audit.added.filter(a => a.kind !== "tags").map(a => a.id).join(", "));
	const monarch = out.frames.find(f => f.id === "mf_monarch");
	ok(monarch && monarch.name === "金斑蝶", "Monarch 应使用 v3.5 译名「金斑蝶」");
	// 状态与状况：Foundry 用 id 或 icon 生成 lid 覆盖已有条目，icon / type 必须与官方一致
	const baseStatuses = readJson(path.join(ROOT, "source/fvtt/core/statuses.json"));
	const st = out.statuses || [];
	ok(st.length === baseStatuses.length, `状态与状况应全部导出（${st.length} / ${baseStatuses.length}）`);
	for (const b of baseStatuses) {
		const s = st.find(x => x.icon === b.icon);
		ok(s && s.type === b.type && s.exclusive === b.exclusive, `状态 ${b.name} 的 icon / type / exclusive 应与官方一致`);
		ok(s && CJK.test(s.name) && CJK.test(s.terse) && CJK.test(s.effects) && !/[A-Za-z]{4,}/.test(s.effects.replace(/<[^>]+>/g, "")), `状态 ${b.name} 的名称、简述与说明应为中文`);
		ok(s && ["Status", "Condition", "Effect"].includes(s.type), `状态 ${b.name} 的类型不合法`);
	}
	ok(st.find(s => s.icon === "stunned")?.name === "晕眩" && st.find(s => s.icon === "downandout")?.name === "昏迷", "晕眩、昏迷（Down and Out）按术语库命名");
	const unzipped = unzip(fs.readFileSync(path.join(ROOT, "dist/fvtt", PACKS.core.lcp)));
	ok(unzipped["statuses.json"] && JSON.parse(unzipped["statuses.json"]).length === st.length, "核心包应包含 statuses.json");
	// 模组的状态图标名应与状态条目同名
	const cnFlat = readJson(path.join(ROOT, "source/fvtt/module/cn-flat.json"));
	const iconKey = { "danger-zone": "dangerzone", "shut-down": "shutdown", "lock-on": "lockon", slow: "slow" };
	for (const s of st) {
		const k = `lancer.statusIconsNames.${iconKey[s.icon] || s.icon}`;
		if (k in cnFlat) ok(cnFlat[k] === s.name, `模组状态图标名 ${k}「${cnFlat[k]}」应与状态条目「${s.name}」一致`);
	}
	const barb = out.weapons.find(w => w.id === "mw_barbarossa_integrated");
	ok(barb && barb.mount === "Ship-class", "巴巴罗萨内建武器应保留 Ship-class 挂载");
	const cb = out.core_bonuses.find(c => c.id === "cb_auto_stabilizing_hardpoints");
	ok(cb && /^<p><i>/.test(cb.description) && CJK.test(cb.effect) && !/<i>/.test(cb.effect), "核心奖励的风味与效果应分开，且效果为中文");
	ok(out.core_bonuses.every(c => CJK.test(c.effect || "")), "核心奖励效果都应为中文：" + out.core_bonuses.filter(c => !CJK.test(c.effect || "")).map(c => c.id).join(", "));
	ok(out.skills.length === 22 && out.skills.every(s => CJK.test(s.name) && CJK.test(s.detail)), "技能名称与说明应为中文");
	ok(out.talents.every(t => t.ranks.every(r => CJK.test(r.name) && CJK.test(r.description))), "天赋等级名称与说明应为中文");
	const ace = out.talents.find(t => t.id === "t_ace");
	const supersonic = ace?.ranks[2].actions.find(a => a.activation === "Reaction");
	ok(supersonic && supersonic.name === "超音速" && CJK.test(supersonic.trigger), "王牌「超音速」反应应换成中文名称与触发");
	const ap = out.tags.find(t => t.id === "tg_ap");
	ok(ap && CJK.test(ap.name) && CJK.test(ap.description), "标签应为中文");
	ok(out.frames.every(f => CJK.test(f.name) && f.traits.every(t => CJK.test(t.name))), "核心骨架与特性名称应为中文");
	ok(["weapons", "systems", "mods", "pilot_gear"].every(k => out[k].every(x => CJK.test(x.name))), "核心装备名称应为中文");
	// 核心包沿用 Foundry 的 lancer-data 数值，除非车卡器有意改动
	const ar = out.weapons.find(w => w.id === "mw_assault_rifle");
	const arBase = readJson(path.join(ROOT, "source/fvtt/core/weapons.json")).find(w => w.id === "mw_assault_rifle");
	ok(ar && JSON.stringify(ar.damage) === JSON.stringify(arBase.damage) && JSON.stringify(ar.tags) === JSON.stringify(arBase.tags), "突击步枪数值应与 Foundry 的 lancer-data 相同");
}

// ---- 补译表：HTML 标签与数字要与英文原文一致；术语要用车卡器 / v3.5 的写法
{
	const getPath = (o, p) => p.replace(/\[(\d+)\]/g, ".$1").split(".").reduce((x, k) => (x == null ? x : x[k]), o);
	const tagsOf = s => (String(s).match(/<\/?[a-z]+[^>]*>/gi) || []).map(t => t.replace(/\s.*>/, ">").toLowerCase()).sort().join("");
	const numsOf = s => String(s).replace(/<[^>]+>/g, "").match(/\d+(\.\d+)?/g) || [];
	// 英文原文自身标签残缺（结尾 "</ul" 缺 ">"），译文补全了列表
	const TAG_EXEMPT = new Set(["t_juggernaut|ranks[2].synergies[0].detail"]);
	// 与车卡器用法不一致的写法 → 应改为
	const TERMS = [[/精准/, "准度"], [/重击(?!弹)/, "会心一击"], [/维修值/, "维修"], [/(?<!猎人)闪避/, "回避（阿特拉斯蛾特性「猎人闪避」除外）"], [/生命值/, "HP"],
		[/躲藏状态/, "匿迹状态"], [/干扰状态/, "受扰状态"], [/闪烁空间/, "瞬空"], [/免费动作/, "自由动作"], [/核心加成/, "核心奖励"], [/超量护盾/, "护盾（Overshield）"]];
	const base = {};
	const addBase = dir => { for (const k of CORE_KINDS) { const f = path.join(dir, k + ".json"); if (fs.existsSync(f)) for (const x of readJson(f)) base[x.id] = x; } };
	addBase(path.join(ROOT, "source/fvtt/core"));
	for (const pack of fs.readdirSync(offDir)) addBase(path.join(offDir, pack));
	for (const pack of fs.readdirSync(offDir)) for (const k of ["npc_templates", "npc_features"]) { const f = path.join(offDir, pack, k + ".json"); if (fs.existsSync(f)) for (const x of readJson(f)) base[x.id] = x; }
	for (const file of ["zh-overrides.json", "zh-overrides-core.json", "zh-npc.json"]) {
		const f = path.join(ROOT, "source/fvtt", file);
		if (!fs.existsSync(f)) continue;
		const ov = readJson(f);
		delete ov._说明;
		for (const [id, fields] of Object.entries(ov)) for (const [p, zh] of Object.entries(fields)) {
			const where = `${file} ${id} ${p}`;
			for (const [re, to] of TERMS) ok(!re.test(zh), `${where}：「${zh.match(re)?.[0]}」应写作「${to}」`);
			const en = base[id] && getPath(base[id], p);
			if (typeof en !== "string") continue;
			if (!TAG_EXEMPT.has(`${id}|${p}`)) ok(tagsOf(en) === tagsOf(zh), `${where}：HTML 标签与英文原文不一致（原文 ${tagsOf(en) || "无"}，译文 ${tagsOf(zh) || "无"}）`);
			const zhNums = new Set(numsOf(zh));
			const lost = numsOf(en).filter(x => !zhNums.has(x));
			ok(!lost.length, `${where}：译文缺少原文数字 ${lost.join("、")}`);
		}
	}
}

console.log(`test-lcp：${checks} 项检查，${failures ? failures + " 项失败" : "全部通过"}（扩展：覆盖 ${results.ext.audit.overlaid.length}、新增 ${results.ext.audit.added.length}；核心：覆盖 ${results.core.audit.overlaid.length}、新增标签 ${results.core.audit.added.length}）`);
process.exitCode = failures ? 1 : 0;
