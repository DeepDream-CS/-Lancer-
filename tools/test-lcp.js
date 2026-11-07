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
	const TERMS = [[/精准/, "准度"], [/重击(?!弹)/, "会心一击"], [/维修值/, "维修"], [/闪避/, "回避"], [/生命值/, "HP"],
		[/躲藏状态/, "匿迹状态"], [/干扰状态/, "受扰状态"], [/闪烁空间/, "瞬空"], [/免费动作/, "自由动作"], [/核心加成/, "核心奖励"]];
	const base = {};
	const addBase = dir => { for (const k of CORE_KINDS) { const f = path.join(dir, k + ".json"); if (fs.existsSync(f)) for (const x of readJson(f)) base[x.id] = x; } };
	addBase(path.join(ROOT, "source/fvtt/core"));
	for (const pack of fs.readdirSync(offDir)) addBase(path.join(offDir, pack));
	for (const file of ["zh-overrides.json", "zh-overrides-core.json"]) {
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
