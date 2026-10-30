"use strict";
// Lancer 简易车卡器 —— 纯前端，无依赖。数据见 data.js（tools/build-data.js 生成）

const D = window.LANCER_DATA;
const Z = D.zh;
const nk = s => String(s || "").replace(/’/g, "'");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const by = (arr, key = "id") => Object.fromEntries(arr.map(x => [x[key], x]));

const FRAMES = by(D.frames), WEAPONS = by(D.weapons), SYSTEMS = by(D.systems), MODS = by(D.mods);
const CBS = by(D.core_bonuses), TALENTS = by(D.talents), GEAR = by(D.pilot_gear), SKILLS = by(D.skills);
const BGS = by(D.backgrounds), TAGS = by(D.tags);
const FRAME_BY_NAME = Object.fromEntries(D.frames.map(f => [nk(f.name).toLowerCase(), f]));
const MAKERS = D.manufacturers.map(m => m.id);
const MAKER_COLOR = Object.fromEntries(D.manufacturers.map(m => [m.id, m.color]));
const EVEREST = "mf_standard_pattern_i_everest";

// ---------- 规则常量（规则站第一章「等级表」） ----------
const LV = ll => ({
	grit: Math.ceil(ll / 2),
	skills: 2 + ll,
	licenses: ll,
	talents: 3 + ll,
	cbs: Math.floor(ll / 3),
	triggers: 8 + 2 * ll,
});
const MOUNT_SLOTS = {
	"Main": [["Main", "Auxiliary"]],
	"Aux": [["Auxiliary"]],
	"Flex": [["Main", "Auxiliary"], ["Auxiliary"]],
	"Main/Aux": [["Main", "Auxiliary"], ["Auxiliary"]],
	"Aux/Aux": [["Auxiliary"], ["Auxiliary"]],
	"Heavy": [["Superheavy", "Heavy", "Main", "Auxiliary"]],
	"Integrated": [["Auxiliary"]],
	"Superheavy": [["Superheavy"]], // 扩展核心奖励「超重挂载」
};
const T = {
	mount: { "Main": "主", "Aux": "副", "Flex": "灵活", "Main/Aux": "主/副", "Aux/Aux": "副/副", "Heavy": "重型", "Integrated": "内建", "Auxiliary": "副", "Superheavy": "超重型", "Ship-class": "舰载级", "Drone": "无人机" },
	wtype: { "Melee": "近战", "CQB": "CQB", "Rifle": "步枪", "Launcher": "发射器", "Cannon": "大炮", "Nexus": "巢房", "Special": "特殊", "Spool Weapon": "卷绕武器" },
	dmg: { "Kinetic": "动能", "Explosive": "爆炸", "Energy": "能量", "Heat": "热度", "Burn": "燃烧", "Variable": "可变" },
	range: { "Range": "射程", "Threat": "威胁", "Blast": "溅射", "Burst": "爆发", "Line": "线形", "Cone": "锥形", "Thrown": "投掷" },
	hase: { hull: "机体 HULL", agi: "敏捷 AGI", sys: "系统 SYS", eng: "工程 ENG" },
	stype: { "AI": "AI", "Deployable": "可展开", "Drone": "无人机", "Shield": "护盾", "Flight System": "飞行系统", "Tech": "科技" },
	role: { "Balanced": "均衡", "Striker": "打击", "Controller": "控制", "Support": "支援", "Defender": "防御", "Artillery": "炮击" },
};

// ---------- 名称（中文优先，附英文） ----------
function zhOf(kind, x) {
	if (!x) return "";
	switch (kind) {
		case "frame": return Z.frames[nk(x.name)];
		case "talent": return Z.talents[x.name] && Z.talents[x.name].name;
		case "cb": return Z.cb[nk(x.name)] && Z.cb[nk(x.name)].name;
		case "gear": return Z.gear[x.name] && Z.gear[x.name].name;
		case "skill": return Z.skills[x.name.toLowerCase()] && Z.skills[x.name.toLowerCase()].name;
		case "bg": return Z.bg[x.name.toLowerCase()] && Z.bg[x.name.toLowerCase()].name;
		case "item": return x.zh_name || (Z.gms[x.name] && Z.gms[x.name].name);
	}
}
function label(kind, x, html = true) {
	const z = zhOf(kind, x);
	if (!z) return html ? esc(x.name) : x.name;
	return html ? `${esc(z)}${z === x.name ? "" : ` <small>${esc(x.name)}</small>`}` : z;
}
const plain = (kind, x) => label(kind, x, false);
const makerName = m => (Z.makers[m] ? `${m} ${Z.makers[m]}` : m);

function tagText(t) {
  const def = TAGS[t.id];
  if (!def) return t.id;
  const basic = ['tg_accurate','tg_inaccurate','tg_overkill'].includes(t.id);
  return def.name.replace(/\{VAL\}/g, String(t.val ?? (basic ? '' : 'X'))).trim();
}
// 这些标签只是给 COMP/CON 用的内部标记，不显示
const HIDDEN_TAGS = ["tg_pilot_weapon", "tg_gear", "tg_personal_armor", "tg_set_damage_type", "tg_set_max_uses", "tg_set_damage_value", "tg_no_cascade"];
const tagsHtml = tags => (tags || []).filter(t => !HIDDEN_TAGS.includes(t.id)).map(t => `<span class="tag" title="${esc(TAGS[t.id] ? TAGS[t.id].description.replace(/\{VAL\}/g, t.val ?? (['tg_accurate','tg_inaccurate','tg_overkill'].includes(t.id) ? 1 : "X")) : "")}">${esc(tagText(t))}</span>`).join("");
const tagsPlain = tags => (tags || []).filter(t => !HIDDEN_TAGS.includes(t.id)).map(tagText).join("、");
const dmgText = d => (d || []).filter(x => x.val !== "N/A").map(x => { const k = x.type ? x.type[0].toUpperCase() + x.type.slice(1) : ""; return `${x.val}${T.dmg[k] || x.type || ""}`; }).join("+");
const rngText = r => (r || []).map(x => `${T.range[x.type] || x.type}${x.val === "N/A" ? "：无" : x.val}`).join(" ");

// ---------- 状态与存储 ----------
const STORE = "lancer-builder-v1";
// 首次打开（没有存档）或点「新建」时，先让玩家选择引导式或自定义车卡
let chooser = localStorage.getItem(STORE) ? null : "first";
let db = load();
let tab = "pilot";
const openSet = new Set();

function blankPilot() {
	return {
		id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
		name: "新驾驶员", callsign: "", player: "", ll: 0,
		background: "", bgCustom: "", bio: "", appearance: "",
		triggers: [{ id: "", custom: "", val: 2 }, { id: "", custom: "", val: 2 }, { id: "", custom: "", val: 2 }, { id: "", custom: "", val: 2 }],
		hase: { hull: 0, agi: 0, sys: 0, eng: 0 },
		talents: {}, licenses: {}, professionalLicenses: [], extraLicenseRanks: 0, coreBonuses: [],
		gear: { armor: "", weapons: ["", ""], items: ["", "", ""] },
		mechs: [blankMech()], activeMech: 0,
		wizard: null, // 引导式车卡当前步骤 id；null 表示用自定义编辑器
	};
}
function blankMech(frame = EVEREST) {
	return { sentryWeapon:"", beltMount:"", beltSystem1:"", beltSystem2:"", podMode:"Main", podWeapon1:"", podWeapon2:"", podProfile1:0, podProfile2:0, name: "新机甲", frame, retrofit: -1, stabilized: "", overpower: "", signature: "", loadout: {}, systems: [], notes: "", legacyFrame:"", legacyTrait:"" };
}
function load() {
	try {
		const rawSave = localStorage.getItem(STORE);
		const s = JSON.parse(rawSave);
		if (rawSave && s?.pilots?.length && !localStorage.getItem(STORE + '-before-rules-20261021')) {
			try { localStorage.setItem(STORE + '-before-rules-20261021', rawSave); } catch (_) { /* 不影响空间不足时读取原存档 */ }
		}
		if (s && Array.isArray(s.pilots) && s.pilots.length) { s.pilots = s.pilots.map(raw => ({...normalizePilot(raw, []), id: str(raw.id) || blankPilot().id})); return s; }
	} catch (e) { /* 忽略损坏的存档 */ }
	const p = blankPilot();
	return { pilots: [p], current: p.id, ignoreLimits: false };
}
function save() {
	const status=document.getElementById('saveStatus');
	try {
		localStorage.setItem(STORE, JSON.stringify(db));
		if(status){status.textContent='✓ 已保存到此浏览器';status.className='save-status saved';status.title='角色保存在当前浏览器；换设备前请导出 JSON。';}
		return true;
	} catch(error) {
		if(status){status.textContent='⚠ 保存失败，请导出备份';status.className='save-status failed';status.title='浏览器存储不可用或空间不足。当前修改仍在页面中，请立即导出 JSON。';}
		return false;
	}
}
const P = () => db.pilots.find(p => p.id === db.current) || db.pilots[0];
const M = () => { const p = P(); return p.mechs[p.activeMech] || p.mechs[0]; };

// ---------- 规则计算 ----------
const licenseRank = (p, licName) => {
	if (!licName || licName === "GMS") return 3;
	const f = FRAME_BY_NAME[nk(licName).toLowerCase()];
	return f ? (p.licenses[f.id] || 0) : 0;
};
function itemAvailable(p, it) {
	if (db.ignoreLimits && it.source) return true;
	if (it.talent_item) return talentEquipment(p, 'special_equipment').some(x => x.id === it.id);
	if (!it.source) return false;
	if (it.source === "GMS" && !it.license_level) return true;
	if(it.professional_license) return professionalLicenseRank(p,it.professional_license) >= it.license_level;
	return licenseRank(p, it.license) >= (it.license_level || 0);
}
// 变体骨架（扩展）沿用标准骨架的牌照：标准骨架牌照 II 即可使用；埃弗勒斯的变体人人可用
const frameAvailable = (p, f) => db.ignoreLimits || (f.required_core_bonus ? p.coreBonuses.includes(f.required_core_bonus) : [f.id, f.variant_of].includes(EVEREST) || (p.licenses[f.variant_of || f.id] || 0) >= 2);
function licenseFrames() { return D.frames.filter(f => !f.variant_of && !f.no_license); } // 读档时（load）就会用到，须是函数声明
const frameName = f => zhOf("frame", f) || f.name;
const variantNote = f => (f.variant_of ? `${frameName(FRAMES[f.variant_of])}变体` : "");
// 扩展骨架用到变体、高效、无形等扩展规则时，附带说明
const extRulesNote = f => {
	if (!f.ext || !D.ext_rules) return "";
	const text = JSON.stringify(f);
	const hit = D.ext_rules.filter(r => (r.term === "变体" ? f.variant_of : text.includes(r.term)));
	return hit.length ? det("extRules" + f.id, "扩展规则说明", hit.map(r => `<h5>${esc(r.title)}</h5>${r.html}`).join("")) : "";
};
const extBadge = x => (x && x.ext ? ` <span class="tag ext" title="来自扩展：${esc(x.pack || "")}">扩展</span>` : "");
const makerLicenseTotal = (p, m) => licenseFrames().filter(f => f.source === m).reduce((s, f) => s + (p.licenses[f.id] || 0), 0) + (p.professionalLicenses || []).filter(x => x.source === m).reduce((n,x) => n + x.rank, 0);
function cbEligible(p, cb, extra = 0) {
	if (cb.source === "GMS" || db.ignoreLimits) return true;
	const taken = p.coreBonuses.filter(id => CBS[id] && CBS[id].source === cb.source).length + extra;
	return makerLicenseTotal(p, cb.source) >= 3 * taken;
}
const hasCB = (p, id) => p.coreBonuses.includes(id);
// K/KCA「私人家教」：额外 2 级天赋
function talentBudget(p) { return LV(p.ll).talents + (p.coreBonuses.includes("cb_kkca_private_tutor") ? 2 : 0); }
// K/KCA「招牌动作」：指定系统 SP 成本 -2（最低 0）
function signatureDiscount(p, m) { return hasCB(p, "cb_kkca_signature_move") && m.systems.includes(m.signature) && SYSTEMS[m.signature] ? Math.min(2, SYSTEMS[m.signature].sp || 0) : 0; }
const isUnique = it => (it.tags || []).some(t => t.id === "tg_unique");

function mountsOf(p, m) {
	const f = FRAMES[m.frame];
	if (!f) return [];
	const mounts = f.mounts.map((t, i) => ({ key: "m" + i, type: t }));
	if (hasCB(p, "cb_mount_retrofitting") && mounts[m.retrofit]) mounts[m.retrofit] = { ...mounts[m.retrofit], type: "Main/Aux", retro: true };
	if (hasCB(p, "cb_improved_armament") && mounts.length < 3) mounts.push({ key: "ia", type: "Flex", note: "改良武装" });
	if (hasCB(p, "cb_ext_superheavy_mounting") && mounts.length < 3) mounts.push({ key: "sh", type: "Superheavy", note: "超重挂载（核心奖励）" });
	if (hasCB(p, "cb_integrated_weapon")) mounts.push({ key: "iw", type: "Integrated", note: "武器一体化（核心奖励）", noMods: true });
	return mounts;
}
function integratedOf(f, p, m = p.mechs.find(m => m.frame === f?.id) || {}) {
	if (!f) return [];
	const ids = [...(f.core_system.integrated || []), ...mechTraits({...m,frame:f.id}).flatMap(t => t.integrated || []), ...talentEquipment(p, "integrated").map(x => x.id)];
	return [...new Set(ids)].map(id => WEAPONS[id] || SYSTEMS[id]).filter(Boolean).map(x => x.mount ? configuredWeapon(x, m) : x);
}
const slotState = (m, key) => (m.loadout[key] = m.loadout[key] || { slots: [], link: "" });

// 当前机甲上实际装备的武器 [{mount, slotIdx, w, mod}]
function equippedWeapons(p, m) {
	const out = [];
	const mounts = mountsOf(p, m);
	const linked = linkedMounts(p, m);
	for (const mt of mounts) {
		if (linked.has(mt.key)) continue;
		const st = slotState(m, mt.key);
		MOUNT_SLOTS[mt.type].forEach((acc, i) => {
			const s = st.slots[i];
			if (s && s.w && WEAPONS[s.w] && slotAccepts(mt, i, st.slots).includes(WEAPONS[s.w].mount)) { const w=configuredWeapon(WEAPONS[s.w],m,s); out.push({ mount:mt,i,w,mod:combinedWeaponMod(w,s),mods:slotMods(s) }); }
		});
	}
	return out;
}

function mechStats(p, m) {
	const f = FRAMES[m.frame];
	if (!f) return null;
	const s = f.stats, h = p.hase, L = LV(p.ll);
	const bonus = id => staticBonus(p, m, id);
	let size = s.size;
	if (bonus("size")) size = size < 1 ? 1 : Math.min(3, size + 1);
	const spUsed = m.systems.reduce((a, id) => a + (SYSTEMS[id] ? SYSTEMS[id].sp || 0 : 0), 0) - signatureDiscount(p, m) - tacticalBeltDiscount(p,m) +
		equippedWeapons(p, m).reduce((a, e) => a + (e.w.sp || 0) + (e.mod ? e.mod.sp || 0 : 0), 0);
	return {
		size, structure: s.structure, stress: s.stress,
		hp: s.hp + (f.no_grit_hp || (inheritedTrait(m)?.inherited_from==='mf_ext_emperor' && FRAMES[m.legacyFrame].traits[Number(m.legacyTrait)]?.name==='风暴盾') ? 0 : L.grit) + h.hull * 2 + bonus("hp"), // 风暴盾（包括遗产）不以毅力提高 HP
		armor: Math.min(4, s.armor + bonus("armor")),
		evasion: s.evasion + h.agi + bonus("evasion"),
		speed: s.speed + Math.floor(h.agi / 2) + bonus("speed"),
		edef: s.edef + h.sys + bonus("edef"),
		tech: s.tech_attack + h.sys + bonus("tech_attack"),
		sensor: s.sensor_range + bonus("sensor"),
		save: s.save + L.grit + bonus("save"),
		heatcap: s.heatcap + h.eng + bonus("heatcap"),
		repcap: s.repcap + Math.floor(h.hull / 2) + bonus("repcap"),
		sp: s.sp + L.grit + Math.floor(h.sys / 2) + bonus("sp"),
		spUsed,
		attack: L.grit,
		limited: Math.floor(h.eng / 2) + bonus("limited_bonus"),
	};
}
function pilotStats(p) {
	const L = LV(p.ll);
	const st = { hp: 6 + L.grit, armor: 0, evasion: 10, edef: 10, speed: 4, size: "½" };
	const a = GEAR[p.gear.armor];
	(a && a.bonuses || []).forEach(b => {
		const k = b.id.replace("pilot_", "");
		if (k in st) st[k] = b.replace ? b.val : st[k] + b.val;
	});
	return st;
}

// ---------- 检查 ----------
function checks(p) {
	const out = creationChecks(p); // [level, text]
	const L = LV(p.ll);
	const trig = p.triggers.reduce((s, t) => s + (+t.val || 0), 0);
	if (trig !== L.triggers) out.push(["warn", `触发点数合计 +${trig}，LL${p.ll} 应为 +${L.triggers}`]);
	if (p.triggers.some(t => !t.id && !t.custom)) out.push(["warn", "有未填写的触发"]);
	const ids = p.triggers.map(t => t.id || t.custom).filter(Boolean);
	if (new Set(ids).size !== ids.length) out.push(["err", "触发重复"]);
	const hs = Object.values(p.hase).reduce((a, b) => a + b, 0);
	if (hs !== L.skills) out.push(["warn", `机甲技能点数 ${hs}，应为 ${L.skills}`]);
	const tr = Object.values(p.talents).reduce((a, b) => a + b, 0);
	if (tr !== talentBudget(p)) out.push(["warn", `天赋等级合计 ${tr}，应为 ${talentBudget(p)}`]);
	const lr = Object.values(p.licenses).reduce((a, b) => a + b, 0);
	const spent = lr + (p.professionalLicenses || []).reduce((n,x) => n + x.rank - x.rewardRanks, 0);
	const budget = L.licenses + (p.extraLicenseRanks || 0);
	if (spent !== budget) out.push([spent > budget ? "err" : "warn", `牌照等级合计 ${spent}，应为 ${budget}（含专业牌照及额外奖励）`]);
	out.push(...professionalChecks(p));
	if (p.coreBonuses.length !== L.cbs) out.push([p.coreBonuses.length > L.cbs ? "err" : "warn", `核心奖励 ${p.coreBonuses.length} 个，应为 ${L.cbs} 个`]);
	if (!db.ignoreLimits) for (const mk of MAKERS.slice(1)) {
		const n = p.coreBonuses.filter(id => CBS[id] && CBS[id].source === mk).length;
		if (n && makerLicenseTotal(p, mk) < n * 3) out.push(["err", `${mk} 核心奖励 ${n} 个需要该厂牌照合计 ${n * 3} 级（现有 ${makerLicenseTotal(p, mk)}）`]);
	}
	if (!p.background && !p.bgCustom) out.push(["warn", "未选择背景"]);
	p.mechs.forEach((m, mi) => {
		const f = FRAMES[m.frame];
		const tag = `机甲「${m.name || mi + 1}」`;
		if (!f) return out.push(["err", `${tag} 未选择骨架`]);
		if (!frameAvailable(p, f)) out.push(["err", `${tag} 的骨架 ${f.name} ${f.required_core_bonus?`需要核心奖励「${CBS[f.required_core_bonus].name}」`:'需要该牌照 2 级'}`]);
		out.push(...loadoutChecks(p, m));
		const st = mechStats(p, m);
		if (st.spUsed > st.sp) out.push(["err", `${tag} SP 超出：${st.spUsed}/${st.sp}`]);
		const eq = equippedWeapons(p, m);
		const all = [...eq.map(e => e.w), ...eq.flatMap(e => e.mods || (e.mod ? [e.mod] : [])), ...m.systems.map(id => SYSTEMS[id]).filter(Boolean)];
		all.forEach(it => { if (it.source && !itemAvailable(p, it)) out.push(["err", `${tag}：${plain("item", it)} 未解锁（需要 ${Z.frames[nk(it.license)] || it.license} ${it.license_level}级牌照）`]); });
		const seen = {};
		all.filter(isUnique).forEach(it => { if (seen[it.id]) out.push(["err", `${tag}：${plain("item", it)} 是独特装备，只能装一件`]); seen[it.id] = 1; });
		mountsOf(p, m).forEach(mt => {
			const st2 = slotState(m, mt.key), w = st2.slots[0] && WEAPONS[st2.slots[0].w];
			if (w && w.mount === "Superheavy" && !st2.link) out.push(["err", `${tag}：超重型武器 ${plain("item", w)} 需要另外占用一个挂载点`]);
		});
	});
	const g = p.gear;
	if (g.weapons.filter(Boolean).length > 2 || g.items.filter(Boolean).length > 3) out.push(["err", "驾驶员装备超出上限"]);
	return out;
}

// ---------- 通用小组件 ----------
function stepper(act, arg, val, min, max, fmt = v => v) {
	const subject=act==='tal' ? plain('talent',TALENTS[arg]) : act==='lic' ? plain('frame',FRAMES[arg]) : act==='hase' ? T.hase[arg] : act==='trig' ? `触发 ${+arg+1}` : '牌照等级';
	return `<span class="stepper"><button aria-label="减少${esc(subject)}" data-act="${act}" data-arg="${esc(arg)}" data-d="-1" ${val <= min ? "disabled" : ""}>−</button><span>${fmt(val)}</span><button aria-label="增加${esc(subject)}" data-act="${act}" data-arg="${esc(arg)}" data-d="1" ${val >= max ? "disabled" : ""}>+</button></span>`;
}
function counter(have, need) {
	const c = have === need ? "ok" : have > need ? "over" : "under";
	return `<span class="cnt ${c}">${have} / ${need}</span>`;
}
function det(id, title, html) {
	if (!html) return "";
	return `<details data-open-id="${esc(id)}" ${openSet.has(id) ? "open" : ""}><summary>${title}</summary><div class="desc">${html}</div></details>`;
}
const opt = (v, text, sel, dis) => `<option value="${esc(v)}" ${sel ? "selected" : ""} ${dis ? "disabled" : ""}>${text}</option>`;

// ---------- 页面：驾驶员 ----------
// 防护服的数值写成一行：+3 HP、装甲、回避、电子防御、速度
const armorText = g => (g.bonuses || []).map(b => {
	const n = { pilot_hp: "HP", pilot_armor: "装甲", pilot_evasion: "回避", pilot_edef: "电子防御", pilot_speed: "速度" }[b.id];
	return n ? (b.replace ? `${n} ${b.val}` : `${n} +${b.val}`) : "";
}).filter(Boolean).join("、");
function pilotParts(p) {
	const L = LV(p.ll), ps = pilotStats(p);
	const bg = BGS[p.background];
	const bgz = bg && Z.bg[bg.name.toLowerCase()];
	const trigSum = p.triggers.reduce((s, t) => s + (+t.val || 0), 0);
	const skillOpts = D.skills.slice().sort((a, b) => a.family.localeCompare(b.family));
	const gearSel = (path, type, val) => `<select data-k="${path}"><option value="">—</option>${D.pilot_gear.filter(g => g.type === type).map(g => opt(g.id, plain("gear", g) + (g.ext ? "（扩展）" : ""), g.id === val)).join("")}</select>`;
	const gearInfo = (id, slot) => {
		const g = GEAR[id];
		if (!g) return "";
		const z = Z.gear[g.name];
		const meta = [g.damage ? dmgText(g.damage) : "", g.range ? rngText(g.range) : "", armorText(g), tagsPlain(g.tags)].filter(Boolean).join(" · ");
		// 规则站有译文的装备（大多是「其他装备」）直接用；防护服和武器用自译的说明＋效果
		const own = (z && z.html) ? "" : (g.effect ? `<p><b>效果：</b>${g.effect}</p>` : "") + actsHtml(g);
		if (z && z.html) return `<div class="wstat">${esc(meta)}</div><div class="desc">${z.html}</div>`;
		return `<div class="wstat">${esc(meta)}</div>` + (own ? `<div class="desc">${own}</div>` : "") + det("gear-" + id + slot, "说明", g.description ? `<p>${g.description}</p>` : "");
	};
	return {
	basic: `<div class="card">
		<h3>基本资料</h3>
		<div class="row"><label>名字</label><input type="text" data-k="name" value="${esc(p.name)}"></div>
		<div class="row"><label>呼号</label><input type="text" data-k="callsign" value="${esc(p.callsign)}"></div>
		<div class="row"><label>玩家</label><input type="text" data-k="player" value="${esc(p.player)}"></div>
		<div class="row"><label>头像</label><input type="file" accept="image/*" data-act="portrait" style="max-width:220px">${p.portrait ? `<img src="${p.portrait}" class="portrait-thumb" alt="头像"><button data-act="delPortrait" class="danger">移除</button>` : `<span class="muted">导出角色卡图片时放在右上角</span>`}</div>
		<div class="row"><label>牌照等级</label>${stepper("ll", "", p.ll, 0, 12, v => "LL" + v)} <span class="muted">毅力 Grit +${L.grit}</span></div>
		<h4>驾驶员数值</h4>
		<div class="stats">
			<div class="stat"><b>${ps.hp}</b><span>HP</span></div>
			<div class="stat"><b>${ps.armor}</b><span>装甲</span></div>
			<div class="stat"><b>${ps.evasion}</b><span>回避</span></div>
			<div class="stat"><b>${ps.edef}</b><span>电子防御</span></div>
			<div class="stat"><b>${ps.speed}</b><span>速度</span></div>
			<div class="stat"><b>½</b><span>大小</span></div>
		</div>
	</div>`,
	bg: `<div class="card">
		<h3>背景</h3>
		<div class="row"><select data-k="background"><option value="">— 自创背景 —</option>${D.backgrounds.filter(b => !b.ext).map(b => opt(b.id, plain("bg", b), b.id === p.background)).join("")}${D.backgrounds.some(b => b.ext) ? `<optgroup label="扩展背景">${D.backgrounds.filter(b => b.ext).map(b => opt(b.id, plain("bg", b), b.id === p.background)).join("")}</optgroup>` : ""}</select>
		<button data-act="rollBg" title="掷 1d20">🎲 随机</button></div>
		${p.background ? "" : `<div class="row"><input type="text" data-k="bgCustom" placeholder="自创背景名称" value="${esc(p.bgCustom)}"></div>`}
		${bgz ? `<div class="muted">${esc(bgz.triggers)}</div>${det("bg", "背景说明", bgz.html)}` : ""}
		<p class="muted">使用背景：在战斗以外，与背景相关的技能检定可得 +1 准度（或 +1 难度）。</p>
		<h4>外貌 / 经历</h4>
		<textarea data-k="bio" placeholder="简单写写这个驾驶员的故事">${esc(p.bio)}</textarea>
	</div>`,
	triggers: `<div class="card wide">
		<h3>触发 Triggers ${counter(trigSum, L.triggers)}</h3>
		<p class="muted">LL0 有四个 +2 触发；每升一级可让一个触发 +2 或新增一个 +2 触发（单项最高 +6）。可从范例中选，也可自定义。</p>
		${p.triggers.map((t, i) => {
			const sk = SKILLS[t.id];
			const z = sk && Z.skills[sk.name.toLowerCase()];
			return `<div class="list-item"><div class="li-head">
				<span class="row" style="flex:1">
					<select data-k="triggers.${i}.id"><option value="">— 自定义触发 —</option>${skillOpts.map(s => opt(s.id, plain("skill", s), s.id === t.id)).join("")}</select>
					${t.id ? "" : `<input type="text" style="max-width:220px" data-k="triggers.${i}.custom" placeholder="自定义触发名称" value="${esc(t.custom)}">`}
				</span>
				<span>${stepper("trig", i, +t.val, 2, 6, v => "+" + v)} <button data-act="delTrig" data-arg="${i}" class="danger">✕</button></span>
			</div>${sk ? det("sk" + t.id + i, esc(sk.description), (z && z.html) || esc(sk.detail)) : ""}</div>`;
		}).join("")}
		<button data-act="addTrig">+ 新增触发</button>
	</div>`,
	gear: `<div class="card wide">
		<h3>驾驶员装备 <span class="muted">一套装甲、最多两件武器、三件其他装备</span></h3>
		${[
			["装甲", "防护服或其他个人装甲，会改变驾驶员数值", [["装甲", gearSel("gear.armor", "Armor", p.gear.armor), gearInfo(p.gear.armor, "a")]]],
			["武器", "最多两件", p.gear.weapons.map((w, i) => [`武器 ${i + 1}`, gearSel(`gear.weapons.${i}`, "Weapon", w), gearInfo(w, "w" + i)])],
			["其他装备", "最多三件", p.gear.items.map((w, i) => [`装备 ${i + 1}`, gearSel(`gear.items.${i}`, "Gear", w), gearInfo(w, "g" + i)])],
		].map(([title, hint, slots]) => `<section class="gear-group"><h4>${title} <span class="muted">${hint}</span></h4>
			<div class="gear-slots">${slots.map(([lab, sel, info]) => `<div class="gear-slot"><span class="gear-label">${lab}</span>${sel}${info}</div>`).join("")}</div></section>`).join("")}
	</div>`,
	};
}
function renderPilot(p) {
	const x = pilotParts(p);
	return `<div class="grid">${x.basic}${x.bg}${x.triggers}${x.gear}</div>`;
}

// ---------- 页面：等级成长 ----------
// 牌照各级解锁的骨架与装备（升级前也能查看后续等级给什么）
const licenseOf = it => (it.license && it.license !== "GMS" ? FRAME_BY_NAME[nk(it.license).toLowerCase()] : null);
function licenseContents(p, f) {
	const rank = p.licenses[f.id] || 0;
	const items = [...D.weapons, ...D.systems, ...D.mods].filter(it => it.source && licenseOf(it) === f);
	const kind = it => WEAPONS[it.id] ? `${T.mount[it.mount] || it.mount}${T.wtype[it.type] || it.type}` : MODS[it.id] ? "武器改装" : (T.stype[it.type] || "系统");
	const variants = D.frames.filter(v => v.variant_of === f.id);
	return [1, 2, 3].map(lv => {
		const list = items.filter(it => (it.license_level || 0) === lv).map(it =>
			`<li title="${esc(stripHtml(it.effect || ""))}">${esc(plain("item", it))} <span class="muted">${esc(kind(it))}${it.sp ? ` · ${it.sp} SP` : ""}</span></li>`);
		if (lv === 2) list.unshift(`<li><b>${esc(frameName(f))}骨架</b>${variants.length ? ` <span class="muted">（也可改用变体：${variants.map(v => esc(frameName(v))).join("、")}）</span>` : ""}</li>`);
		return `<div class="lic-rank ${rank >= lv ? "have" : ""}"><div class="lic-rank-h">${["", "I", "II", "III"][lv]} 级${rank >= lv ? " · 已解锁" : ""}</div><ul>${list.join("") || '<li class="muted">—</li>'}</ul></div>`;
	}).join("");
}
function progressParts(p) {
	const L = LV(p.ll);
	const hs = Object.values(p.hase).reduce((a, b) => a + b, 0);
	const tr = Object.values(p.talents).reduce((a, b) => a + b, 0);
	const lr = Object.values(p.licenses).reduce((a, b) => a + b, 0);
	const levelTable = `<table class="tbl"><tr><th>LL</th><th>毅力</th><th>机甲技能</th><th>牌照</th><th>天赋</th><th>核心奖励</th><th>触发</th></tr>${Array.from({ length: 13 }, (_, i) => {
		const l = LV(i);
		return `<tr class="${i === p.ll ? "cur" : ""}"><td>${i}</td><td>${l.grit}</td><td>${l.skills}</td><td>${l.licenses}</td><td>${l.talents}</td><td>${l.cbs}</td><td>+${l.triggers}</td></tr>`;
	}).join("")}</table>`;
	const haseDesc = { hull: "每点 +2 HP；每两点 +1 维修上限", agi: "每点 +1 回避；每两点 +1 速度", sys: "每点 +1 电子防御与科技攻击；每两点 +1 SP", eng: "每点 +1 热度上限；每两点 +1 受限装备使用次数" };
	return {
	hase: `<div class="card">
		<h3>机甲技能 HASE ${counter(hs, L.skills)}</h3>
		${Object.keys(T.hase).map(k => `<div class="row" style="justify-content:space-between"><span><b>${T.hase[k]}</b><br><span class="muted">${haseDesc[k]}</span></span>${stepper("hase", k, p.hase[k], 0, 6, v => "+" + v)}</div>`).join("")}
	</div>`,
	levels: `<div class="card"><h3>等级表 <span class="muted">当前 LL${p.ll}</span></h3>${levelTable}
		<p class="muted">每次升级可选择一项重分配：一个天赋的全部等级、一个牌照的全部等级，或换一个核心奖励。重分配牌照导致核心奖励失去资格时，须同时替换该核心奖励。</p></div>`,
	licenses: `<div class="card wide">
		<h3>牌照 Licenses ${counter(lr + (p.professionalLicenses || []).reduce((n,x)=>n+x.rank-x.rewardRanks,0), L.licenses + (p.extraLicenseRanks || 0))}</h3>
		<p class="muted">每级 LL 得 1 牌照等级。牌照分一至三级，须依次取得；二级解锁该骨架。GMS（埃弗勒斯及 GMS 装备）永远可用。</p>
		${MAKERS.slice(1).map(mk => `<div class="mfr" style="border-color:${MAKER_COLOR[mk]}">${esc(makerName(mk))} <span class="muted">合计 ${makerLicenseTotal(p, mk)} 级</span></div>
			<div class="lic-grid">${licenseFrames().filter(f => f.source === mk).map(f => `<div class="lic ${p.licenses[f.id] ? "has" : ""}"><div class="lic-head"><span>${label("frame", f)}${extBadge(f)}</span>${stepper("lic", f.id, p.licenses[f.id] || 0, 0, 3, v => ["—", "I", "II", "III"][v])}</div>${det("lic-" + f.id, "牌照内容", licenseContents(p, f))}</div>`).join("")}</div>`).join("")}
	</div>`,
	professionals: professionalPanel(p),
	cbs: `<div class="card wide">
		<h3>核心奖励 Core Bonuses ${counter(p.coreBonuses.length, L.cbs)}</h3>
		<p class="muted">每 3 级 LL 得一个。GMS 加成随时可选；其他厂商每个加成需要该厂商合计 3 级牌照（第二个需要 6 级，以此类推）。</p>
		${MAKERS.map(mk => `<div class="mfr" style="border-color:${MAKER_COLOR[mk]}">${esc(makerName(mk))}</div>${D.core_bonuses.filter(c => c.source === mk).map(c => {
			const have = hasCB(p, c.id);
			const ok = have || cbEligible(p, c, 1);
			const z = Z.cb[nk(c.name)];
			return `<div class="list-item ${have ? "active" : ok ? "" : "locked"}"><div class="li-head"><span class="li-title">${label("cb", c)}${extBadge(c)}</span>
				<button data-act="cb" data-arg="${c.id}" ${!have && !ok ? "disabled" : ""}>${have ? "移除" : "选择"}</button></div>
				<div class="desc">${z ? z.html : esc(c.effect)}</div></div>`;
		}).join("")}`).join("")}
	</div>`,
	talents: `<div class="card wide">
		<h3>天赋 Talents ${counter(tr, talentBudget(p))}</h3>
		<p class="muted">LL0 有三个一级天赋；每升一级可让一个天赋升一级，或取得一个新的一级天赋。</p>
		${talentToolbar()}
		${D.talents.map((t, i) => {
			const r = p.talents[t.id] || 0;
			const z = Z.talents[t.name];
			const ranks = t.ranks.map((rk, i) => `<div class="rank ${i < r ? "have" : ""}"><div class="rank-h">${["I", "II", "III"][i]}．${esc(z ? z.ranks[i].name : rk.name)}</div>${z ? z.ranks[i].html : rk.description}</div>`).join("");
			return `${t.ext && !D.talents[i - 1]?.ext ? `<div class="mfr ext-head">扩展天赋 <span class="muted">${esc(t.pack || "")}</span></div>` : ""}<div class="list-item ${r ? "active" : ""} ${t.incomplete ? "locked" : ""}" data-talent-row="${t.id}" data-selected="${!!r}"><div class="li-head"><span class="li-title">${label("talent", t)}${extBadge(t)}</span>${t.ranks.length ? stepper("tal", t.id, r, 0, t.ranks.length, v => ["—", "I", "II", "III"][v]) : '<span class="muted">资料不全，暂不可选</span>'}</div>
				<div class="muted">${esc(t.terse || "")}</div>${det("t" + t.id, "天赋详情", (z ? z.desc : "") + ranks)}</div>`;
		}).join("")}
	</div>`,
	};
}
function renderProgress(p) {
	const x = progressParts(p);
	return `<div class="grid">${x.hase}${x.levels}${x.licenses}${x.professionals}${x.cbs}${x.talents}</div>`;
}

// ---------- 页面：机甲 ----------
function itemOptions(p, list, cur, filter, m = M()) {
	const groups = {};
	list.filter(filter).forEach(it => {
		const ok = itemAvailable(p, it) || it.id === cur;
		if (!ok) return;
		const g = (it.source ? `${it.source}${it.license && it.license !== "GMS" ? " · " + (Z.frames[nk(it.license)] || it.license) + " " + it.license_level : ""}` : "天赋") + (it.ext ? " · 扩展" : "");
		(groups[g] = groups[g] || []).push(it);
	});
	return Object.entries(groups).map(([g, items]) => `<optgroup label="${esc(g)}">${items.map(it => {
		const limited = MODS[it.id] && limitedTags(it.tags, p, m).find(t => t.id === "tg_limited");
		return opt(it.id, esc(plain("item", it)) + (it.sp ? ` [${it.sp}SP]` : "") + (limited ? ` [${esc(tagText(limited))}]` : ""), it.id === cur);
	}).join("")}</optgroup>`).join("");
}
const ACT = { "Quick": "快速动作", "Full": "完整动作", "Reaction": "反应", "Protocol": "协定", "Free": "自由动作", "Quick Tech": "快速科技", "Full Tech": "完整科技", "Invade": "入侵", "Deployable": "可展开", "Drone": "无人机", "Mine": "地雷", "cover": "掩体", "Rocket": "火箭", "Object": "物件", "Decoy": "诱饵", "Bomb": "炸弹" };
const freqText = f => String(f || "").replace(/(\d+)\s*\/\s*round/i, "每轮$1次").replace(/(\d+)\s*\/\s*turn/i, "每回合$1次").replace(/(\d+)\s*\/\s*scene/i, "每场景$1次").replace(/unlimited/i, "无限");
const txt = v => (v && typeof v === "object" ? v.detail || "" : v || "");
// 系统、武器、骨架上的动作（反应、协定等）与可展开物（无人机、地雷等）
let STAT_CTX = {}; // 当前机甲数值，用于展开可展开物数值里的 {grit}、{evasion} 等
const statVal = v => {
	const r = String(v).replace(/\{(\w+)\}/g, (m, k) => (STAT_CTX[k] != null ? STAT_CTX[k] : m));
	return /^[\d\s+]+$/.test(r) ? r.split("+").reduce((a, b) => a + (+b || 0), 0) : r;
};
// 个别数据把单个动作写成对象而不是数组，这里统一成数组
const asList = v => (Array.isArray(v) ? v : v && typeof v === "object" ? [v] : []);
function actsHtml(o) {
  let h = "";
  if (o.ammo) h += o.ammo.map(a => `<div class="blk"><b>${esc(a.name)}（${a.cost || 1}发）</b><p>${a.detail || ""}</p></div>`).join("");
	for (const k of ["actions", "active_actions", "passive_actions"]) for (const a of asList(o[k])) {
		if (!a.detail && !a.name) continue;
		const meta = [ACT[a.activation] || a.activation, freqText(a.frequency)].filter(x => x && x !== "None").join("，");
		h += `<div class="blk"><div class="blk-h">${esc(a.name || "")} <span class="muted">${esc(meta)}</span></div>${a.trigger ? `<p><b>触发：</b>${a.trigger}</p>` : ""}<p>${a.detail || ""}</p></div>`;
	}
	for (const k of ["deployables", "active_deployables"]) for (const d of asList(o[k])) {
		const st = [d.size != null ? "大小" + (d.size === 0.5 ? "½" : d.size) : "", d.hp != null ? (Number(statVal(d.hp)) + (STAT_CTX[d.type === "Drone" ? "drone_hp" : "deployable_hp"] || 0)) + " HP" : "", d.armor ? "装甲" + statVal(d.armor) : "", d.evasion != null ? "回避" + statVal(d.evasion) : "", d.edef != null ? "电子防御" + statVal(d.edef) : ""].filter(Boolean).join(" · ");
		h += `<div class="blk"><div class="blk-h">${esc(d.name || "")} <span class="muted">${esc(ACT[d.type] || d.type || "")}${st ? " · " + esc(st) : ""}</span></div><p>${d.detail || ""}</p>${actsHtml(d)}</div>`;
	}
	return h;
}
function weaponModSummary(mod, p, m) {
	const meta = [`${mod.sp || 0} SP`, tagsPlain(limitedTags(mod.tags, p, m))].filter(Boolean).join("；");
	return `模块：${plain("item", mod)}（${meta}）`;
}
function weaponInfo(w, mod, p = P(), m = M()) {
	const prof = effectiveProfile(w, w.profiles ? w.profiles[0] : w, mod, p, m);
	const meta = [`${T.mount[w.mount] || w.mount}${T.wtype[w.type] || w.type}`, rngText(prof.range), dmgText(prof.damage)].filter(Boolean).join(" · ");
	const z = Z.gms[w.name];
	let detail = (z && z.html) || "";
	if (w.effect) detail += `<p>${w.effect}</p>`;
	if (w.on_hit) detail += `<p><b>命中时：</b>${txt(w.on_hit)}</p>`;
	if (w.on_crit) detail += `<p><b>会心一击时：</b>${txt(w.on_crit)}</p>`;
	if (w.on_attack) detail += `<p><b>攻击时：</b>${txt(w.on_attack)}</p>`;
	if (w.profiles) detail += w.profiles.map(raw => { const pf = effectiveProfile({...w,select_profile:false}, raw, mod, p, m); return `<div class="blk"><div class="blk-h">${esc(pf.name)}</div><div>${rngText(pf.range)} · ${dmgText(pf.damage)} ${tagsHtml(pf.tags)}</div>${pf.effect ? `<p>${pf.effect}</p>` : ""}${pf.on_hit ? `<p><b>命中时：</b>${txt(pf.on_hit)}</p>` : ""}${pf.on_crit ? `<p><b>会心一击时：</b>${txt(pf.on_crit)}</p>` : ""}${pf.on_attack ? `<p><b>攻击时：</b>${txt(pf.on_attack)}</p>` : ""}${actsHtml(pf)}</div>`; }).join("");
	detail += actsHtml(w);
	if (mod) detail += `<div class="blk"><div class="blk-h">模块：${esc(plain("item", mod))} (${mod.sp}SP)</div><p>${mod.effect || ""}</p>${actsHtml(mod)}</div>`;
	const modMeta = mod ? `<div class="wstat weapon-mod-meta"><span class="muted">模块：${esc(plain("item", mod))} · ${mod.sp || 0} SP</span> ${tagsHtml(limitedTags(mod.tags, p, m))}</div>` : "";
	return `<div class="wstat">${esc(meta)} ${tagsHtml(prof.tags || w.tags)}</div>` + modMeta + det("w" + w.id + (mod ? mod.id : ""), "武器效果", detail);
}
// 骨架选单的选项；filter 用于骨架筛选器（当前骨架始终保留，避免选单把它换掉）
function frameOptions(p, m, filter = () => true) {
	return MAKERS.map(mk => {
		const list = D.frames.filter(x => x.source === mk && (x.id === m.frame || filter(x)));
		return list.length ? `<optgroup label="${esc(makerName(mk))}">${list.map(x => opt(x.id, (x.variant_of ? "　└ " : "") + esc(plain("frame", x)) + (x.variant_of ? `（${esc(variantNote(x))}）` : x.ext ? "（扩展）" : "") + (frameAvailable(p, x) ? "" : " 🔒"), x.id === m.frame, !frameAvailable(p, x) && x.id !== m.frame)).join("")}</optgroup>` : "";
	}).join("");
}
function mechParts(p) {
	const m = M();
	const f = FRAMES[m.frame];
	const st = mechStats(p, m);
	STAT_CTX = st ? { ...st, grit: LV(p.ll).grit, drone_hp: staticBonus(p,m,"drone_hp"), deployable_hp: staticBonus(p,m,"deployable_hp") } : {};
	const mechTabs = `<div class="mech-tabs">${p.mechs.map((x, i) => `<button data-act="pickMech" data-arg="${i}" class="${i === p.activeMech ? "on" : ""}">${esc(x.name || "机甲" + (i + 1))}</button>`).join("")}
		<button data-act="addMech">+ 新机甲</button>${p.mechs.length > 1 ? `<button data-act="delMech" class="danger">删除此机甲</button>` : ""}</div>`;
	const frameSel = `<select data-k="mech.frame">${frameOptions(p, m)}</select>`;
	if (!f) return { only: mechTabs + `<div class="card">${frameSel}${frameToolbar()}</div>` };

	const stat = (v, n, hl) => `<div class="stat ${hl ? "hl" : ""}"><b>${v}</b><span>${n}</span></div>`;
	const statsHtml = `<div class="stats">
		${stat(st.hp, "HP", 1)}${stat(st.armor, "装甲")}${stat(st.structure, "结构")}${stat(st.stress, "压力")}
		${stat(st.evasion, "回避", 1)}${stat(st.edef, "电子防御", 1)}${stat(st.speed, "速度")}${stat(st.size === 0.5 ? "½" : st.size, "大小")}
		${stat(st.heatcap, "热度上限")}${stat(st.repcap, "维修上限")}${stat(st.sensor, "感应")}${stat(st.save, "豁免目标")}
		${stat((st.tech >= 0 ? "+" : "") + st.tech, "科技攻击")}${stat("+" + st.attack, "攻击加值")}${stat("+" + st.limited, "受限加成")}${stat(st.sp, "SP")}
	</div>`;


	// 挂载点
	const mounts = mountsOf(p, m);
	const linkedBy = Object.fromEntries(linkedMounts(p, m));
	const mountHtml = mounts.map(mt => {
		const sst = slotState(m, mt.key);
		const beltNotice=m.systems.includes("ms_pl_tactical_belt")&&m.beltMount===mt.key ? "（战术带占用，请清空武器）" : "";
		const title = `${beltNotice}${T.mount[mt.type] || mt.type}挂载点${mt.retro ? "（挂载点改装）" : ""}${mt.note ? "（" + mt.note + "）" : ""}`;
		const stab = mt.type !== "Integrated" && hasCB(p, "cb_auto_stabilizing_hardpoints") ? `<label class="chk"><input type="radio" name="stab" data-act="stab" data-arg="${mt.key}" ${m.stabilized === mt.key ? "checked" : ""}> 自动稳定（+1准度）</label>` : "";
		if (linkedBy[mt.key]) return `<div class="mount"><div class="mount-h">${title}</div><div class="muted">被超重型武器占用</div></div>`;
		const slots = MOUNT_SLOTS[mt.type].map((acc, i) => {
			const s = sst.slots[i] || {};
			const first = sst.slots[0] && WEAPONS[sst.slots[0].w];
			if (!slotAccepts(mt, i, sst.slots).length) return "";
			const w = WEAPONS[s.w] && configuredWeapon(WEAPONS[s.w],m,s);
			const mods = w && !mt.noMods && !w.no_mods ? D.mods.filter(md => canModify(w, md, mt)) : [];
			let html = `<div class="slot"><select data-act="slotW" data-arg="${mt.key}|${i}"><option value="">— 空 —</option>${itemOptions(p, D.weapons, s.w, x => acc.includes(x.mount))}</select>
				${mods.length ? `<select data-act="slotMod" data-arg="${mt.key}|${i}"><option value="">— 无模块 —</option>${itemOptions(p, mods, s.mod, () => true, m)}</select>` : "<span></span>"}</div>`;
			if(w?.max_mods===2) html += '<div class="row"><span>第二模组（各模组 -1 SP，最低 1 SP）</span><select data-act="slotMod2" data-arg="'+mt.key+'|'+i+'"><option value="">— 无第二模组 —</option>'+itemOptions(p,mods,s.mod2,()=>true,m)+'</select></div>';
            if(w?.select_profile) html += '<label>打印数据 <select data-act="slotProfile" data-arg="'+mt.key+'|'+i+'">'+w.profiles.map((pf,n)=>opt(n,esc(pf.name),n===(s.profile||0))).join('')+'</select></label>';
            if (w) html += weaponInfo(w, combinedWeaponMod(w,s), p, m) + `<p class="muted">${esc(buildWeaponNote(p, m, {w, mount:mt, i}))}</p>`;
			if (w && w.mount === "Superheavy") {
				const others = superheavyLinkTargets(mounts, mt).filter(o => (!linkedBy[o.key] || linkedBy[o.key] === mt.key) && WEAPONS[m.loadout[o.key]?.slots?.[0]?.w]?.mount !== "Superheavy");
				html += `<div class="row"><span class="muted">超重型武器需同时占用另一个挂载点${mt.type === "Superheavy" && others.some(o => o.type === "Heavy") ? "（超重挂载：必须是重型挂载点）" : ""}：</span><select data-act="link" data-arg="${mt.key}"><option value="">— 选择 —</option>${others.map(o => opt(o.key, `${T.mount[o.type]}挂载点`, sst.link === o.key)).join("")}</select></div>`;
			}
			return html;
		}).join("");
		return `<div class="mount"><div class="mount-h"><span>${title}</span>${stab}</div>${slots}</div>`;
	}).join("");
	const integ = integratedOf(f, p, m).map(w => `<div class="mount"><div class="mount-h">内建：${esc(plain("item", w))}</div>${w.mount ? weaponInfo(w) : `<div class="desc">${w.effect || ""}${actsHtml(w)}</div>`}</div>`).join("");
	const retro = hasCB(p, "cb_mount_retrofitting") ? `<div class="row"><span class="muted">挂载点改装（核心奖励）：把哪个挂载点换成主/副？</span><select data-act="retro"><option value="-1">—</option>${f.mounts.map((t, i) => opt(i, `${i + 1}. ${T.mount[t]}挂载点`, m.retrofit === i)).join("")}</select></div>` : "";
	const overpower = hasCB(p, "cb_overpower_caliber") ? `<div class="row"><span class="muted">超功率口径（核心奖励）指定武器：</span><select data-k="mech.overpower"><option value="">—</option>${equippedWeapons(p, m).filter(e => e.mount.type !== "Integrated" && !e.w.no_core_bonus).map(e => opt(`${e.mount.key}|${e.i}`, `${T.mount[e.mount.type]} ${e.mount.key}/${e.i + 1} · ${esc(plain("item", e.w))}`, m.overpower === `${e.mount.key}|${e.i}`)).join("")}</select></div>` : "";

	// 系统
	const sysHtml = m.systems.map((id, i) => {
		const s = SYSTEMS[id];
		if (!s) return "";
		const z = Z.gms[s.name];
		const lock = !itemAvailable(p, s);
		return `<div class="list-item ${lock ? "locked" : ""}"><div class="li-head"><span class="li-title">${label("item", s)} <small>${s.sp || 0} SP</small>${extBadge(s)}</span><button data-act="delSys" data-arg="${i}" class="danger">✕</button></div>
			<div class="wstat">${s.type ? (T.stype[s.type] || s.type) + " " : ""}${tagsHtml(limitedTags(s.tags, p, m))}</div>${professionalSystemSetup(p,m,s)}${det("s" + id + i, "系统效果", (s.effect ? `<p>${s.effect}</p>` : "") + actsHtml(s) || (z && z.html) || "")}</div>`;
	}).join("");
	const spPct = Math.min(100, (st.spUsed / st.sp) * 100);

	return {
	tabs: mechTabs,
	info: `<div class="card mech-frame-card">
        <div class="fc-current-heading"><div><p class="fc-kicker">当前骨架</p>${frameIdentity(f)}</div><button data-ui="browseFrames">浏览 / 更换骨架</button></div>
        <div class="row"><label>机甲名称</label><input type="text" data-k="mech.name" value="${esc(m.name)}"></div>
        <p class="fc-access">${esc(frameAccess(p,f))}</p>
        <div class="fc-mounts">${f.mounts.map(x=>`<span>${T.mount[x]}挂载点</span>`).join('')}</div>
        ${f.ext ? `<p class="muted">${extBadge(f)} ${f.required_core_bonus?'核心奖励提供的备用骨架，不占用独立牌照。':f.variant_of ? esc(frameVariantDescription(f)) : "授权骨架：牌照 I–III 解锁其骨架与装备。"}${f.maker_note ? esc("（" + f.maker_note + "）") : ""}</p>` : ""}
        ${kanggeduoSetup(p,m)}<div class="desc">${frameRulesHtml(f,'current',m)}</div>
    </div>`,
	stats: `<div class="card">
		<h3>数值 <span class="muted">已计入常驻数值加成；条件效果见规则说明</span></h3>
		${statsHtml}
		<h4>SP ${st.spUsed} / ${st.sp}</h4>
		<div class="spbar ${st.spUsed > st.sp ? "over" : ""}"><div style="width:${spPct}%"></div></div>
	</div>`,
	weapons: `<div class="card">
		<h3>武器</h3>${prototypeEditor(p, m)}${retro}${mountHtml}${integ}${overpower}
	</div>`,
	systems: `<div class="card">
		<h3>系统 <span class="muted">剩余 ${st.sp - st.spUsed} SP</span></h3>
		${hasCB(p, "cb_kkca_signature_move") ? `<div class="row"><span class="muted">招牌动作（核心奖励）指定系统，SP −2：</span><select data-k="mech.signature"><option value="">—</option>${[...new Set(m.systems)].filter(id => SYSTEMS[id]).map(id => opt(id, `${esc(plain("item", SYSTEMS[id]))} [${SYSTEMS[id].sp || 0}SP]`, m.signature === id)).join("")}</select></div>` : ""}
		${sysHtml || '<p class="muted">尚未安装系统</p>'}
		<div class="system-picker"><label class="search-field"><span>添加系统</span><input type="search" data-ui="systemSearch" value="${esc(uiState.systemQuery)}" placeholder="搜索系统名称或效果"></label><p class="muted" id="systemSearchCount" role="status"></p><div class="row"><select id="sysAdd" aria-label="选择要安装的系统" style="flex:1"><option value="">— 选择系统 —</option>${itemOptions(p, D.systems, "", s => !(isUnique(s) && m.systems.includes(s.id)))}</select><button data-act="addSys" class="primary" disabled>安装</button></div></div>
		<h4>备注</h4><textarea data-k="mech.notes">${esc(m.notes)}</textarea>
	</div>`,
	};
}
function renderMech(p) {
	const x = mechParts(p);
	return x.only || x.tabs + (frameBrowse.open ? frameCatalog(p,true) : "") + `<div class="grid mech-overview">${x.info}<div class="mech-side">${x.stats}${x.weapons}${x.systems}</div></div>`;
}

// ---------- 页面：角色卡 ----------
function sheetText(p) {
	const L = LV(p.ll), ps = pilotStats(p);
	const lines = [];
	const bg = BGS[p.background];
	lines.push(`【驾驶员】${p.name}${p.callsign ? "「" + p.callsign + "」" : ""}　LL${p.ll}　毅力 +${L.grit}${p.player ? "　玩家：" + p.player : ""}`);
	lines.push(`背景：${bg ? plain("bg", bg) : p.bgCustom || "—"}`);
	lines.push(`HP ${ps.hp}｜装甲 ${ps.armor}｜回避 ${ps.evasion}｜电子防御 ${ps.edef}｜速度 ${ps.speed}｜大小 ½`);
	lines.push(`触发：${p.triggers.filter(t => t.id || t.custom).map(t => `${t.id ? plain("skill", SKILLS[t.id]) : t.custom} +${t.val}`).join("、") || "—"}`);
	lines.push(`机甲技能：机体 +${p.hase.hull}　敏捷 +${p.hase.agi}　系统 +${p.hase.sys}　工程 +${p.hase.eng}`);
	lines.push(`天赋：${Object.entries(p.talents).filter(([, r]) => r).map(([id, r]) => `${plain("talent", TALENTS[id])} ${["", "I", "II", "III"][r]}`).join("、") || "—"}`);
	lines.push(...(p.professionalLicenses||[]).map(x=>`专业牌照：${x.source} ${x.name} ${x.rank}级（额外奖励 ${x.rewardRanks}级）${x.notes?"；"+x.notes:""}`));
	lines.push(`牌照：GMS${Object.entries(p.licenses).filter(([, r]) => r).map(([id, r]) => `、${plain("frame", FRAMES[id])} ${["", "I", "II", "III"][r]}`).join("")}`);
	lines.push(`核心奖励：${p.coreBonuses.map(id => plain("cb", CBS[id])).join("、") || "—"}`);
	const g = p.gear;
	lines.push(`驾驶员装备：${[g.armor, ...g.weapons, ...g.items].filter(Boolean).map(id => plain("gear", GEAR[id])).join("、") || "—"}`);
	if (p.bio) lines.push(`经历：${p.bio}`);
	lines.push('驾驶员规则详述：');
	for (const [id,rank] of Object.entries(p.talents)) {
		const t=TALENTS[id], z=t && Z.talents[t.name];
		if(t) t.ranks.slice(0,rank).forEach((r,i)=>lines.push(`${plain('talent',t)} ${roman(i+1)}：${stripHtml(z?.ranks[i]?.html || r.description)}`));
	}
	for (const id of p.coreBonuses) { const c=CBS[id]; if(c) lines.push(`${plain('cb',c)}：${stripHtml(Z.cb[nk(c.name)]?.html || c.effect)}`); }
	p.mechs.forEach(m => {
		const f = FRAMES[m.frame];
		if (!f) return;
		const st = mechStats(p, m);
		STAT_CTX = { ...st, grit: L.grit, drone_hp: staticBonus(p,m,'drone_hp'), deployable_hp: staticBonus(p,m,'deployable_hp') };
		lines.push("");
		lines.push(`【机甲】${m.name}　骨架：${f.source} ${plain("frame", f)}`);
		lines.push(`HP ${st.hp}｜装甲 ${st.armor}｜结构 ${st.structure}｜压力 ${st.stress}｜热度上限 ${st.heatcap}｜维修上限 ${st.repcap}`);
		lines.push(`回避 ${st.evasion}｜电子防御 ${st.edef}｜速度 ${st.speed}｜大小 ${st.size === 0.5 ? "½" : st.size}｜感应 ${st.sensor}｜豁免目标 ${st.save}`);
		lines.push(`科技攻击 ${st.tech >= 0 ? "+" : ""}${st.tech}｜攻击加值 +${st.attack}｜SP ${st.spUsed}/${st.sp}`);
		lines.push(`特征：${mechTraits(m).map(t => t.name).join("、")}｜核心系统：${f.core_system.name}`);
		lines.push("武器：");
		integratedOf(f, p, m).forEach(w => { const pr = w.mount ? effectiveProfile(w, w.profiles?.[0] || w, null, p, m) : null; lines.push(`  · [内建] ${plain("item", w)}${pr ? `　${rngText(pr.range)}　${dmgText(pr.damage)}　${tagsPlain(pr.tags)}　${buildWeaponNote(p,m,{w,mount:{type:'Integrated',key:'integrated'},i:0})}` : ""}`); });
		equippedWeapons(p, m).forEach(e => {
			const prof = effectiveProfile(e.w, e.w.profiles ? e.w.profiles[0] : e.w, e.mod, p, m);
			lines.push(`  · [${T.mount[e.mount.type]}] ${plain("item", e.w)}　${T.mount[e.w.mount]}${T.wtype[e.w.type] || ""}　${rngText(prof.range)}　${dmgText(prof.damage)}${tagsPlain(prof.tags) ? "　" + tagsPlain(prof.tags) : ""}${e.mod ? "　" + weaponModSummary(e.mod, p, m) : ""}${m.stabilized === e.mount.key ? "　(+1准度)" : ""}${buildWeaponNote(p, m, e) ? "　" + buildWeaponNote(p, m, e) : ""}`);
		});
		lines.push(`系统：${m.systems.map(id => SYSTEMS[id] ? `${plain("item", SYSTEMS[id])}(${SYSTEMS[id].sp || 0} SP；${tagsPlain(limitedTags(SYSTEMS[id].tags,p,m))})` : "").filter(Boolean).join("、") || "—"}`);
		if (m.notes) lines.push(`备注：${m.notes}`);
		lines.push("规则详述（条件效果按场上情况结算）：");
		for (const t of mechTraits(m)) lines.push(`${t.name}：${stripHtml(t.description)} ${stripHtml(actsHtml(t))}`);
		const core = f.core_system;
		lines.push(`${core.name}：${stripHtml(core.active_effect)} ${stripHtml(core.passive_effect)} ${stripHtml(actsHtml(core))}`);
		for (const w of integratedOf(f,p,m)) lines.push(`${plain("item",w)}：${stripHtml(w.mount ? weaponInfo(w,null,p,m) : (w.effect||'')+actsHtml(w))}`);
		for (const e of equippedWeapons(p,m)) lines.push(`${plain("item",e.w)}：${stripHtml(weaponInfo(e.w,e.mod,p,m))} ${buildWeaponNote(p,m,e)}`);
		for (const id of m.systems) { const s = SYSTEMS[id]; if(s) lines.push(`${plain("item",s)}：${stripHtml(s.effect)} ${stripHtml(actsHtml(s))} ${professionalSystemSummary(s,m,p)}`); }
	});
	return lines.join("\n");
}
function renderSheet(p) {
	const cs = checks(p);
	return `<div class="grid">
	<div class="card wide noprint">
		<h3>规则检查</h3>
		${cs.length ? `<ul class="warn-list">${cs.map(([lv, t]) => `<li class="${lv}">${esc(t)}</li>`).join("")}</ul>` : `<p class="oklist">✓ 已通过 LL${p.ll} 的车卡基础检查</p>`}
		${cs.length ? '<div class="row correction-links"><span>继续完善：</span><button data-tab="pilot">驾驶员资料 →</button><button data-tab="progress">点数与牌照 →</button><button data-tab="mech">机甲配置 →</button></div>' : ''}
	</div>
	<div class="card export-card noprint"><h3>分享与上桌</h3><p class="muted">发给 GM 或队友，或打印一份带到游戏桌。</p><div class="row"><button data-card="all" class="primary">下载全部图片</button><button data-act="copySheet">复制文字角色卡</button><button data-act="print">打印</button></div><details><summary>单独下载一张卡</summary><div class="row"><button data-card="pilot">驾驶员卡 PNG</button><button data-card="mech">当前机甲卡 PNG</button></div></details></div>
	<div class="card export-card noprint"><h3>备份与继续编辑</h3><p class="muted">JSON 保留完整配置，可在其他浏览器导入后继续编辑。</p><div class="row"><button data-act="exportJson" class="primary">备份当前角色</button><button data-act="exportAll">备份全部角色</button><button data-act="importJson">导入 JSON</button></div></div>
	<div class="card wide noprint"><h3>图片预览 <span class="muted">点击图片也可单独下载 PNG</span></h3><p class="muted">图片为固定版式摘要，长文会省略。完整配置请保留 JSON，详细规则见下方文字角色卡。</p><div id="cardPreview" class="card-preview">生成中…</div></div>
	<div class="card wide"><details class="text-sheet" data-open-id="sheet-text" ${openSet.has('sheet-text')?'open':''}><summary>文字角色卡与完整规则详述</summary><pre class="sheet" id="sheetText">${esc(sheetText(p))}</pre></details></div>
	</div>`;
}

// ---------- 主渲染 ----------
function render() {
	const p = P();
	const focused=document.activeElement;
	const focusKey=focused?.dataset ? ['act','arg','d','k','ui'].map(k=>[k,focused.dataset[k]]) : null;
	document.getElementById("charSelect").innerHTML = db.pilots.map(x => opt(x.id, esc(`${x.name || "未命名"}${x.callsign ? "「" + x.callsign + "」" : ""} LL${x.ll}`), x.id === p.id)).join("");
	document.getElementById("ignoreLimits").checked = !!db.ignoreLimits;
	document.querySelectorAll(".tabs button[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
	const cs = checks(p);
	const badge = document.getElementById("checkBadge");
	badge.className = "badge " + (cs.length ? "bad" : "ok");
	badge.textContent = cs.length ? `⚠ ${cs.length} 项待处理` : "✓ 基础检查通过";
	badge.title = cs.map(c => c[1]).join("\n");
	const y = window.scrollY;
	const inWiz = p.wizard != null && tab !== "battle";
	document.body.classList.toggle("in-wiz", inWiz);
	document.getElementById("modal").innerHTML = chooser ? renderChooser(chooser) : "";
	document.getElementById("notice").innerHTML = notice ? `<div class="notice ${notice.kind}"><div>${notice.html}</div><button data-act="dismissNotice" title="关闭">✕</button></div>` : "";
	document.getElementById("app").innerHTML = inWiz ? renderWizard(p) : (tab === "battle" ? "" : pageIntro(p)) +
		(tab === "battle" ? BattleMap.render() : tab === "pilot" ? renderPilot(p) : tab === "progress" ? renderProgress(p) : tab === "mech" ? renderMech(p) : renderSheet(p));
	window.scrollTo(0, y);
	if (!inWiz && tab === "sheet") renderCardPreviews(p);
	save();
	enhanceUI();
	if(focusKey?.some(([,v])=>v!==undefined)) {
		const next=[...document.querySelectorAll('#app button,#app input,#app select,#app textarea')].find(el=>focusKey.every(([k,v])=>el.dataset[k]===v));
		if(next&&!next.disabled&&!next.closest('[hidden]')) next.focus({preventScroll:true});
	}
}

// ---------- 事件 ----------
function setPath(obj, path, val) {
	const ks = path.split(".");
	let o = obj;
	for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
	o[ks[ks.length - 1]] = val;
}
function bind(el) {
	const k = el.dataset.k;
	const p = P();
	if (k.startsWith("professionalLicenses.")) { const [,i,key]=k.split("."); const x=p.professionalLicenses[+i]; if(!x)return; const known=professionalDefinition(x); if(known&&["name","source","rank"].includes(key))return; x[key]=["rank","rewardRanks"].includes(key)?int(el.value,key==="rank"?1:0,key==="rank"?3:x.rank):el.value; x.rewardRanks=Math.min(x.rewardRanks,x.rank); }
	else if(k === "extraLicenseRanks") p.extraLicenseRanks=int(el.value,0,36);
	else if (k.startsWith("mech.")) {
		const m = M();
		const key = k.slice(5);
		if (key === "frame" && m.frame !== el.value) { if(!changeFrame(m,el.value)) el.value=m.frame; }
		else { m[key] = el.value; if(key==='legacyFrame') m.legacyTrait=''; }
	} else setPath(p, k, el.value);
}
document.addEventListener("input", e => {
	const el = e.target;
	if (el.dataset.k && (el.tagName === "TEXTAREA" || el.type === "text")) { bind(el); save(); }
});
document.addEventListener("change", e => {
	const el = e.target;
	const p = P(), m = M();
	if (el.id === "charSelect") { db.current = el.value; return render(); }
	if (el.id === "ignoreLimits") { db.ignoreLimits = el.checked; return render(); }
	if (el.id === "importFile") return importFile(el);
	if (el.dataset.k) { bind(el); return render(); }
	const act = el.dataset.act, arg = el.dataset.arg;
	if (act === "slotW" || act === "slotMod") {
		const [key, i] = arg.split("|");
		const st = slotState(m, key);
		st.slots[i] = st.slots[i] || {};
		if (act === "slotW") {
			st.slots[i] = { w: el.value, mod: "" };
			const w = WEAPONS[el.value];
			st.slots[i].mod2=""; st.slots[i].profile=0;
			if (+i === 0 && w && w.mount !== "Auxiliary" && mountsOf(p, m).find(mt => mt.key === key)?.type === "Flex") st.slots.length = 1;
			if (!w || w.mount !== "Superheavy") st.link = "";
		} else st.slots[i].mod = el.value;
	} else if (act === "slotMod2" || act === "slotProfile") {
		const [key,i]=arg.split("|"); const sl=slotState(m,key).slots[i];
		if(sl) { if(act==="slotProfile") sl.profile=int(el.value,0,2); else sl.mod2=el.value; }
	} else if (act === "link") {
		const st = slotState(m, arg);
		st.link = el.value;
		if (el.value) m.loadout[el.value] = { slots: [], link: "" };
	} else if (act === "retro") { m.retrofit = +el.value; m.loadout = {}; }
	else if (act === "stab") m.stabilized = arg;
	else if (act === "portrait") return loadPortrait(el, p);
	else return;
	render();
});
document.addEventListener("toggle", e => {
	const id = e.target.dataset && e.target.dataset.openId;
	if (id) e.target.open ? openSet.add(id) : openSet.delete(id);
}, true);
document.addEventListener("click", e => {
	const tb = e.target.closest("[data-tab]");
	if (tb) { tab = tb.dataset.tab; window.scrollTo(0, 0); return render(); }
	if (e.target.id === "checkBadge") { tab = "sheet"; window.scrollTo(0,0); return render(); }
	const el = e.target.closest("button[data-act]");
	if (!el) return;
	const p = P(), m = M();
	const act = el.dataset.act, arg = el.dataset.arg, d = +el.dataset.d || 0;
	const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
	switch (act) {
		case "newChar": chooser = "new"; break;
		case "toWizard": p.wizard = "intro"; window.scrollTo(0, 0); break;
		case "dupChar": { const n = JSON.parse(JSON.stringify(p)); n.id = blankPilot().id; n.name += "（副本）"; db.pilots.push(n); db.current = n.id; break; }
		case "delChar":
			if (!confirm(`确定删除「${p.name}」？`)) return;
			db.pilots = db.pilots.filter(x => x !== p);
			if (!db.pilots.length) db.pilots.push(blankPilot());
			db.current = db.pilots[0].id; break;
		case "ll": p.ll = clamp(p.ll + d, 0, 12); break;
		case "hase": p.hase[arg] = clamp(p.hase[arg] + d, 0, 6); break;
		case "trig": p.triggers[arg].val = clamp(+p.triggers[arg].val + 2 * d, 2, 6); break;
		case "addTrig": p.triggers.push({ id: "", custom: "", val: 2 }); break;
		case "delTrig": p.triggers.splice(+arg, 1); break;
		case "rollBg": { const core = D.backgrounds.filter(b => !b.ext); p.background = core[Math.floor(Math.random() * core.length)].id; break; }
		case "pickProfessional": addCatalogProfessional(p,arg); break;
		case "podSwap": swapPodWeapons(p,m,arg); break;
		case "addProfessional": p.professionalLicenses.push({id:"pro_"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:"新专业牌照",source:MAKERS[1],rank:1,rewardRanks:0,prerequisite:"",notes:""}); break;
		case "deleteProfessional": p.professionalLicenses.splice(+arg,1); break;
		case "lic": { const v = clamp((p.licenses[arg] || 0) + d, 0, 3); if (v) p.licenses[arg] = v; else delete p.licenses[arg]; break; }
		case "tal": { const v = clamp((p.talents[arg] || 0) + d, 0, TALENTS[arg] ? TALENTS[arg].ranks.length : 0); if (v) p.talents[arg] = v; else delete p.talents[arg]; migratePilot(p); break; }
		case "cb": p.coreBonuses = hasCB(p, arg) ? p.coreBonuses.filter(x => x !== arg) : [...p.coreBonuses, arg]; break;
		case "pickMech": p.activeMech = +arg; break;
		case "addKanggeduo": createKanggeduo(p,m); break;
		case "addMech": {
			const best = D.frames.find(f => f.id !== EVEREST && (p.licenses[f.id] || 0) >= 2);
			p.mechs.push(blankMech(best ? best.id : EVEREST)); p.activeMech = p.mechs.length - 1; break;
		}
		case "delMech": if (!confirm(`删除机甲「${m.name}」？`)) return; p.mechs.splice(p.activeMech, 1); p.activeMech = 0; break;
		case "addSys": { const v = document.getElementById("sysAdd").value; if (v) m.systems.push(v); break; }
		case "delSys": m.systems.splice(+arg, 1); break;
		case "delPortrait": delete p.portrait; break;
		case "copySheet":
			if(!navigator.clipboard) { openSet.add('sheet-text'); tab='sheet'; return notify('此浏览器不支持自动复制。请展开文字角色卡，选中后手动复制。','warn'); }
			navigator.clipboard.writeText(sheetText(p)).then(() => { el.textContent = "已复制 ✓"; setTimeout(() => (el.textContent = "复制文字角色卡"), 1500); }).catch(()=>{openSet.add('sheet-text');tab='sheet';notify('复制未成功。请在下方文字角色卡中选中文字后手动复制。','warn');});
			return;
		case "print": window.print(); return;
		case "exportAll": downloadJson({ app: "lancer-builder", version: 1, pilots: db.pilots }, `lancer-全部角色备份-${new Date().toISOString().slice(0, 10)}`); return;
		case "dismissNotice": notice = null; break;
		case "exportJson": {
			const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = `lancer-${p.name || "pilot"}.json`;
			a.click(); return;
		}
		case "importJson": document.getElementById("importFile").click(); return;
		default: return;
	}
	render();
});
// 头像缩到最长边 600px 再存，避免撑爆 localStorage
function loadPortrait(input, p) {
	const file = input.files[0];
	if (!file) return;
	const img = new Image();
	img.onload = () => {
		const s = Math.min(1, 600 / Math.max(img.width, img.height));
		const cv = document.createElement("canvas");
		cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
		cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
		p.portrait = cv.toDataURL("image/jpeg", 0.85);
		URL.revokeObjectURL(img.src);
		render();
	};
	img.src = URL.createObjectURL(file);
}
// ---------- 导入 / 导出 ----------
// 导入的 JSON 可以是：单个角色、角色数组，或「导出全部」的备份 {pilots:[…]}。
// 每个角色都按 blankPilot() 补齐缺的字段，并去掉本车卡器数据里不存在的 id，避免旧档或手改档弄坏页面。
function int(v, lo, hi, d = 0) { return Number.isFinite(+v) ? Math.max(lo, Math.min(hi, Math.round(+v))) : d; }
function str(v) { return typeof v === "string" ? v : ""; }
function normalizePilot(raw, warn) {
	const p = blankPilot();
	const who = str(raw.name) || "未命名角色";
	const drop = (kind, id) => warn.push(`「${who}」：找不到${kind} ${id}，已略过`);
	for (const k of ["name", "callsign", "player", "background", "bgCustom", "bio", "appearance"]) if (typeof raw[k] === "string") p[k] = raw[k];
	if (p.background && !BGS[p.background]) { drop("背景", p.background); p.bgCustom = p.bgCustom || p.background; p.background = ""; }
	p.ll = int(raw.ll, 0, 12);
	if (raw.hase) for (const k of Object.keys(p.hase)) p.hase[k] = int(raw.hase[k], 0, 6);
	if (Array.isArray(raw.triggers)) p.triggers = raw.triggers.filter(t => t && typeof t === "object").map(t => {
		let id = str(t.id), custom = str(t.custom);
		if (id && !SKILLS[id]) { custom = custom || id; id = ""; }
		custom = custom.trim();
		return { id, custom, val: int(t.val, 2, 6, 2) & ~1 };
	});
	const ranks = (obj, table, kind, max = () => 3) => {
		const out = {};
		if (obj && typeof obj === "object") for (const [id, r] of Object.entries(obj)) {
			if (!table[id]) { drop(kind, id); continue; }
			const v = int(r, 0, max(table[id]));
			if (v) out[id] = v;
		}
		return out;
	};
	p.talents = ranks(raw.talents, TALENTS, "天赋", t => t.ranks.length);
	p.extraLicenseRanks = int(raw.extraLicenseRanks,0,36);
	p.professionalLicenses = normalizeProfessionalLicenses(raw.professionalLicenses);
	p.licenses = ranks(raw.licenses, by(licenseFrames()), "牌照"); // 变体骨架没有自己的牌照
	p.coreBonuses = (Array.isArray(raw.coreBonuses) ? raw.coreBonuses : []).filter(id => CBS[id] || (drop("核心奖励", id), false));
	if (raw.gear) {
		const g = (id, type) => (!id ? "" : GEAR[id]?.type === type ? id : (drop("该栏位可用的驾驶员装备", id), ""));
		p.gear.armor = g(raw.gear.armor, "Armor");
		p.gear.weapons = [0, 1].map(i => g((raw.gear.weapons || [])[i], "Weapon"));
		p.gear.items = [0, 1, 2].map(i => g((raw.gear.items || [])[i], "Gear"));
	}
	if (typeof raw.portrait === "string" && raw.portrait.startsWith("data:image/")) p.portrait = raw.portrait;
	if (Array.isArray(raw.mechs) && raw.mechs.length) p.mechs = raw.mechs.map(rm => {
		const m = blankMech();
		if (!rm || typeof rm !== "object") return m;
		m.name = str(rm.name) || m.name;
		m.notes = str(rm.notes);
		if (FRAMES[rm.frame]) m.frame = rm.frame;
		else if (rm.frame) drop("骨架", rm.frame);
		m.retrofit = int(rm.retrofit, -1, 9, -1);
		m.stabilized = str(rm.stabilized);
		m.overpower = str(rm.overpower);
		m.signature = str(rm.signature);
		for(const k of ["sentryWeapon","beltMount","beltSystem1","beltSystem2","podMode","podWeapon1","podWeapon2"]) m[k]=str(rm[k]);
		for(const k of ["podProfile1","podProfile2"]) m[k]=int(rm[k],0,2);
		m.legacyFrame = FRAMES[rm.legacyFrame] && !FRAMES[rm.legacyFrame].required_core_bonus ? rm.legacyFrame : '';
		m.legacyTrait = m.legacyFrame && rm.legacyTrait !== '' && rm.legacyTrait != null && Number.isInteger(Number(rm.legacyTrait)) && FRAMES[m.legacyFrame].traits[Number(rm.legacyTrait)] ? String(Number(rm.legacyTrait)) : '';
		for (const k of ["prototypeType","prototypeDamage","prototypeOptics","prototypeSmart","prototypeReactor"]) m[k] = str(rm[k]);
		m.systems = (Array.isArray(rm.systems) ? rm.systems : []).filter(id => SYSTEMS[id] || (drop("系统", id), false));
		if (rm.loadout && typeof rm.loadout === "object") for (const [key, st] of Object.entries(rm.loadout)) {
			if (!st || !Array.isArray(st.slots)) continue;
			m.loadout[key] = {
				link: str(st.link),
				slots: st.slots.map(sl => {
					const w = sl && WEAPONS[sl.w] ? sl.w : (sl && sl.w ? (drop("武器", sl.w), "") : "");
					const mod = w && sl.mod && MODS[sl.mod] ? sl.mod : "";
					const mod2=w&&sl.mod2&&MODS[sl.mod2]?sl.mod2:"";
					return { w, mod, mod2, profile:int(sl.profile,0,Math.max(0,(WEAPONS[w]?.profiles?.length||1)-1)) };
				}),
			};
		}
		return m;
	});
	p.activeMech = int(raw.activeMech, 0, p.mechs.length - 1);
  p.wizard = typeof raw.wizard === 'string' && WIZ_STEPS.some(s=>s.id===raw.wizard) ? raw.wizard : null;
  migratePilot(p, warn);
	return p;
}
function importText(t, fileName) {
	let data;
	try { data = JSON.parse(t); } catch (e) { return notify(`「${esc(fileName)}」不是有效的 JSON 文件。`, "err"); }
	const list = Array.isArray(data) ? data : data && Array.isArray(data.pilots) ? data.pilots : [data];
	const raws = list.filter(x => x && typeof x === "object" && (x.hase || x.mechs || x.triggers));
	if (!raws.length) return notify(`「${esc(fileName)}」里没有本车卡器的角色数据。（COMP/CON 导出的文件暂不支持）`, "err");
	const warn = [];
	const added = raws.map(r => normalizePilot(r, warn));
	db.pilots.push(...added);
	db.current = added[0].id;
	chooser = null; tab = "pilot";
	notify(`已导入 ${added.map(p => "「" + esc(p.name) + "」").join("、")}，可以直接修改了。` + (warn.length ? `<br>导入调整说明：<br>· ${warn.map(esc).join("<br>· ")}` : ""), warn.length ? "warn" : "ok");
	window.scrollTo(0, 0);
	render();
}
function importFiles(files) {
	[...files].forEach(f => f.text().then(t => importText(t, f.name)));
}
function importFile(input) {
	importFiles(input.files);
	input.value = "";
}
function downloadJson(obj, name) {
	const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = name.replace(/[\\/:*?"<>|]/g, "_") + ".json";
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
// 页面顶部的提示条
let notice = null;
function notify(html, kind = "ok") { notice = { html, kind }; render(); }
// 把 JSON 文件拖进页面任意位置即可导入
document.addEventListener("dragover", e => { if ([...e.dataTransfer.types].includes("Files")) { e.preventDefault(); document.body.classList.add("drop-hover"); } });
document.addEventListener("dragleave", e => { if (!e.relatedTarget) document.body.classList.remove("drop-hover"); });
document.addEventListener("drop", e => {
	if (!e.dataTransfer.files.length) return;
	e.preventDefault();
	document.body.classList.remove("drop-hover");
	importFiles([...e.dataTransfer.files].filter(f => /\.json$/i.test(f.name) || f.type.includes("json")));
});

render();


// 专业牌照目录与自定义牌照。已发行的专业牌照不生成机甲骨架。
function professionalDefinition(x) {
 return (D.professional_licenses||[]).find(y=>y.id===(x.catalogId||x.id));
}
function professionalLicenseRank(p,id) {
 return Math.max(0,...(p.professionalLicenses||[]).filter(x=>(x.catalogId||x.id)===id).map(x=>x.rank));
}
function normalizeProfessionalLicenses(raw) {
 const out=[],seen=new Set();
 for(const [i,x] of (Array.isArray(raw)?raw:[]).entries()) {
  if(!x||typeof x!=='object')continue;
  const known=professionalDefinition(x),rank=known?.rank||int(x.rank,1,3,1);
  const id=str(x.id)||'pro_import_'+i;
  const identity=known?.id||id;
  if(seen.has(identity))continue;
  seen.add(identity);
  out.push({id,catalogId:known?.id||'',name:known?.name||str(x.name)||'未命名专业牌照',source:known?.source||(MAKERS.includes(x.source)?x.source:MAKERS[1]),rank,rewardRanks:int(x.rewardRanks,0,rank),prerequisite:str(x.prerequisite),notes:str(x.notes)});
 }
 return out;
}
function addCatalogProfessional(p,id) {
 const def=(D.professional_licenses||[]).find(x=>x.id===id);
 if(!def||professionalLicenseRank(p,id))return;
 const pre=(p.professionalLicenses||[]).find(x=>(def.prerequisites||[]).includes(x.catalogId||x.id));
 p.professionalLicenses.push({id:def.id,catalogId:def.id,name:def.name,source:def.source,rank:def.rank,rewardRanks:0,prerequisite:pre?.id||'',notes:''});
}
function professionalChecks(p) {
 const list=p.professionalLicenses||[],out=[];
 for(const x of list) {
  const def=professionalDefinition(x);
  if(def&&(x.rank!==def.rank||x.source!==def.source))out.push(['err',`专业牌照「${def.name}」的厂商或等级不符`]);
  if(x.rank<=1)continue;
  const normal=licenseFrames().some(f=>f.source===x.source&&(p.licenses[f.id]||0)>=x.rank-1);
  const pre=list.find(y=>y.id===x.prerequisite&&y.id!==x.id&&y.source===x.source&&y.rank>=x.rank-1&&(!def||(def.prerequisites||[]).includes(y.catalogId||y.id)));
  let cycle=false,cursor=x,seen=new Set([x.id]);
  while(cursor?.prerequisite){if(seen.has(cursor.prerequisite)){cycle=true;break;}seen.add(cursor.prerequisite);cursor=list.find(y=>y.id===cursor.prerequisite);}
  if(!normal&&(!pre||cycle))out.push(['err',`专业牌照「${x.name}」${x.rank}级需要同厂商至少 ${x.rank-1} 级普通牌照，或其指定专业牌照前置（不可循环依赖）`]);
 }
 return out;
}
function professionalGearHtml(def,p) {
 const items=[...D.weapons,...D.systems,...D.mods].filter(x=>x.professional_license===def.id);
 return `<p><i>${esc(def.description||'')}</i></p><p><a href="${esc(def.reference_image||'')}" target="_blank" rel="noopener">查看原始牌照资料（含背景描述）</a></p>`+items.map(it=>`<div class="list-item"><b>${esc(plain('item',it))}</b> ${it.sp!=null?it.sp+' SP':''}${tagsHtml(it.tags)}<div>${WEAPONS[it.id]?weaponInfo(it,null,p,M()):(it.effect||'')+actsHtml(it)}</div></div>`).join('');
}
function professionalPanel(p) {
 const list=p.professionalLicenses||[];
 const entries=list.map((x,i)=>{
  const def=professionalDefinition(x),k=`professionalLicenses.${i}.`;
  const pre=list.filter(y=>y.id!==x.id&&(!def||(def.prerequisites||[]).includes(y.catalogId||y.id)));
  return `<div class="list-item"><div class="row">${def?`<b>${esc(x.source+' '+x.name+' '+x.rank+'级')}</b>`:`<label>名称 <input type="text" data-k="${k}name" value="${esc(x.name)}"></label><label>厂商 <select data-k="${k}source">${MAKERS.map(m=>opt(m,esc(makerName(m)),x.source===m)).join('')}</select></label><label>等级 <select data-k="${k}rank">${[1,2,3].map(n=>opt(n,n,x.rank===n)).join('')}</select></label>`}<button data-act="deleteProfessional" data-arg="${i}">移除</button></div>
  <div class="row"><label>其中额外奖励等级 <select data-k="${k}rewardRanks">${Array.from({length:x.rank+1},(_,n)=>opt(n,n,x.rewardRanks===n)).join('')}</select></label><label>专业牌照前置 <select data-k="${k}prerequisite"><option value="">无／使用同厂商普通牌照</option>${pre.map(y=>opt(y.id,esc(y.source+' '+y.name+' '+y.rank+'级'),x.prerequisite===y.id)).join('')}</select></label></div>
  <label>装备与奖励说明 <textarea data-k="${k}notes">${esc(x.notes)}</textarea></label>${def?det('owned-'+x.id,'牌照装备',professionalGearHtml(def,p)):''}</div>`;
 }).join('');
 return `<div class="card wide"><h3>专业牌照 <span class="tag ext">扩展</span></h3>
 <p>专业牌照不绑定特定骨架，具有厂商和等级。一级无前置；二级需要同厂商至少一级普通牌照，三级需要同厂商至少二级普通牌照。指定专业牌照也可作为前置；专业牌照本身不解锁普通牌照。</p>
 <p class="muted">GM 可将专业牌照加入升级选择，或作为额外奖励。额外奖励不会提高 LL、毅力、天赋或核心奖励数量；专业牌照等级计入该厂商核心奖励的资格合计。</p>
 <label>其他额外牌照奖励等级（普通牌照等，不提高 LL） <input type="number" min="0" max="36" data-k="extraLicenseRanks" value="${p.extraLicenseRanks||0}"></label>
 <p class="muted">各牌照独立取得、分别计算等级。例如同时取得先遣兵 I、守夜人 II、霸主 III，共占 6 级牌照；每个牌照仅解锁其自身装备。</p><h4>已取得的专业牌照</h4>${entries||'<p class="muted">尚未选择专业牌照。</p>'}<button data-act="addProfessional">添加专业牌照（自定义）</button>
 <h4>专业牌照目录</h4>${MAKERS.filter(m=>(D.professional_licenses||[]).some(x=>x.source===m)).map(m=>`<div class="mfr">${esc(makerName(m))}</div>`+(D.professional_licenses||[]).filter(x=>x.source===m).map(def=>`<div class="lic"><div class="lic-head"><b>${esc(def.name)} ${['','I','II','III'][def.rank]}</b><button data-act="pickProfessional" data-arg="${def.id}" ${professionalLicenseRank(p,def.id)?'disabled':''}>${professionalLicenseRank(p,def.id)?'已取得':'取得牌照'}</button></div>${det('catalog-'+def.id,'牌照内容',professionalGearHtml(def,p))}</div>`).join('')).join('')}
 ${det('professional-rules','规则说明',`<p>获得 N 级专业牌照至少需要一个同厂商、不低于 N−1 级的普通牌照；一级无前置。专业牌照不能作为普通牌照的前置，但可作为其指定专业牌照的前置。升级外的奖励提升特定制造商的牌照资格，不提高整体 LL。LL6 获得两个额外专业牌照后仍为 LL6，而非 LL8。</p>`)}
 </div>`;
}
function slotMods(sl) { return [sl?.mod,sl?.mod2].filter(Boolean).map(id=>MODS[id]).filter(Boolean); }
function combinedWeaponMod(w,sl) {
 const mods=slotMods(sl);
 if(!mods.length)return null;
 const sp=mods.reduce((n,x)=>n+(w.mod_sp_discount?Math.max(1,(x.sp||0)-w.mod_sp_discount):(x.sp||0)),0);
 if(mods.length===1)return {...mods[0],sp};
 return {id:'combined_mods',name:mods.map(x=>plain('item',x)).join(' ＋ '),zh_name:mods.map(x=>plain('item',x)).join(' ＋ '),sp,parts:mods,
  tags:mods.flatMap(x=>x.tags||[]),added_tags:mods.flatMap(x=>x.added_tags||[]),added_range:mods.flatMap(x=>x.added_range||[]),
  stack_tags:mods.some(x=>x.stack_tags),effect:mods.map(x=>`<b>${esc(plain('item',x))}</b>：${x.effect||''}`).join('<hr>'),actions:mods.flatMap(x=>x.actions||[])};
}
function beltEligible(s) { return !!s && s.id!=='ms_pl_tactical_belt' && (s.tags||[]).some(t=>['tg_grenade','tg_mine','tg_deployable'].includes(t.id)); }
function beltSystems(m) { return [...new Set([m.beltSystem1,m.beltSystem2].filter(Boolean))].filter(id=>m.systems.includes(id)&&beltEligible(SYSTEMS[id])); }
function tacticalBeltDiscount(p,m) {
 if(!m.systems.includes('ms_pl_tactical_belt')||!mountsOf(p,m).some(mt=>mt.key===m.beltMount&&mt.type!=='Integrated'))return 0;
 const selected=beltSystems(m),cost=selected.reduce((n,id)=>n+(SYSTEMS[id].sp||0),0)-(selected.includes(m.signature)?signatureDiscount(p,m):0);
 return Math.min(4,Math.max(0,cost));
}
function sentryWeapons(p,m) { return equippedWeapons(p,m).filter(e=>e.mount.type!=='Integrated'&&e.w.mount!=='Superheavy'&&['CQB','Rifle'].includes(e.w.type)); }
function professionalSystemSetup(p,m,s) {
 const sel=(key,options)=>`<select data-k="mech.${key}"><option value="">— 选择 —</option>${options.map(([id,name])=>opt(id,esc(name),String(m[key]??'')===String(id))).join('')}</select>`;
 if(s.id==='ms_pl_sentry_drone')return `<label>部署时交给哨兵的已安装武器 ${sel('sentryWeapon',sentryWeapons(p,m).map(e=>[e.mount.key+'|'+e.i,plain('item',e.w)]))}</label><p class="muted">部署后该武器由无人机使用；回收后返回机甲。</p>`;
 if(s.id==='ms_pl_tactical_belt')return `<div class="blk"><label>战术带占用挂载点 ${sel('beltMount',mountsOf(p,m).filter(mt=>mt.type!=='Integrated').map(mt=>[mt.key,(T.mount[mt.type]||mt.type)+' '+mt.key]))}</label>${[1,2].map(i=>`<label>装载系统 ${i} ${sel('beltSystem'+i,m.systems.filter(id=>beltEligible(SYSTEMS[id])).map(id=>[id,plain('item',SYSTEMS[id])]))}</label>`).join('')}<p>总计减少 ${tacticalBeltDiscount(p,m)} SP（最高 4 SP）。</p></div>`;
 if(s.id==='ms_pl_weapon_pod') {
  const mode=m.podMode==='Auxiliary'?'Auxiliary':'Main';
  const stored=Array.from({length:mode==='Main'?1:2},(_,i)=>{const w=WEAPONS[m['podWeapon'+(i+1)]];return `<label>舱内武器 ${i+1} ${sel('podWeapon'+(i+1),D.weapons.filter(w=>itemAvailable(p,w)&&w.mount===mode).map(w=>[w.id,plain('item',w)]))}</label>${w?.select_profile?'<label>打印数据 '+sel('podProfile'+(i+1),w.profiles.map((pf,n)=>[n,pf.name]))+'</label>':''}`;}).join('');
  return `<div class="blk"><label>储存规格 <select data-k="mech.podMode">${opt('Main','1 把主武器',mode==='Main')}${opt('Auxiliary','2 把副武器',mode==='Auxiliary')}</select></label>${stored}<p class="muted">舱内武器不能攻击或装填；交换视为快速动作，交换后的配置仍需符合挂载点和 SP 规则。</p>${mountsOf(p,m).filter(mt=>mt.type!=='Integrated').map(mt=>`<button data-act="podSwap" data-arg="${mt.key}">与 ${esc(T.mount[mt.type]||mt.type)} ${esc(mt.key)} 交换</button>`).join(' ')}</div>`;
 }
 return '';
}
function swapPodWeapons(p,m,key) {
 if(!m.systems.includes('ms_pl_weapon_pod'))return;
 const mt=mountsOf(p,m).find(mt=>mt.key===key&&mt.type!=='Integrated');
 if(!mt)return;
 const mode=m.podMode==='Auxiliary'?'Auxiliary':'Main',ids=[m.podWeapon1,...(mode==='Auxiliary'?[m.podWeapon2]:[])].filter(Boolean);
 const st=slotState(m,key),old=st.slots.filter(sl=>sl.w);
 if(!ids.length||ids.some(id=>!WEAPONS[id]||WEAPONS[id].mount!==mode||!itemAvailable(p,WEAPONS[id]))||old.some(sl=>sl.mod||sl.mod2)||old.length>(mode==='Main'?1:2)||old.some(sl=>WEAPONS[sl.w]?.mount!==mode)||linkedMounts(p,m).has(key)||m.systems.includes('ms_pl_tactical_belt')&&m.beltMount===key) {alert('无法交换：检查储存规格、目标挂载点、模组和牌照。带模组的武器请先移除模组。');return;}
 const next=ids.map((w,i)=>({w,mod:'',mod2:'',profile:int(m['podProfile'+(i+1)],0,2)}));
 if(next.some((sl,i)=>!slotAccepts(mt,i,next).includes(WEAPONS[sl.w].mount))) {alert('该挂载点无法安装舱内武器。');return;}
 const backup=JSON.parse(JSON.stringify(st)),a=m.podWeapon1,b=m.podWeapon2,ap=m.podProfile1,bp=m.podProfile2;
 m.loadout[key]={slots:next,link:''};m.podWeapon1=old[0]?.w||'';m.podWeapon2=old[1]?.w||'';m.podProfile1=old[0]?.profile||0;m.podProfile2=old[1]?.profile||0;
 if(mechStats(p,m).spUsed>mechStats(p,m).sp||checks(p).some(x=>x[0]==='err'&&x[1].includes('独特装备'))) {m.loadout[key]=backup;m.podWeapon1=a;m.podWeapon2=b;m.podProfile1=ap;m.podProfile2=bp;alert('交换后的 SP 或独特装备配置不合法，已恢复。');}
}
function professionalLoadoutChecks(p,m) {
 const out=[],err=t=>out.push(['err',`机甲「${m.name}」：${t}`]);
 if(m.systems.includes('ms_pl_sentry_drone')&&m.sentryWeapon&&!sentryWeapons(p,m).some(e=>e.mount.key+'|'+e.i===m.sentryWeapon))err('哨兵无人机的武器必须是已安装的非内置、非超重型 CQB 或步枪');
 if(m.systems.includes('ms_pl_tactical_belt')) {
  const mt=mountsOf(p,m).find(x=>x.key===m.beltMount&&x.type!=='Integrated');
  if(!mt)err('战术带需要占用一个非内置挂载点');
  if(mt&&(slotState(m,mt.key).slots.some(sl=>sl.w)||linkedMounts(p,m).has(mt.key)))err('战术带占用的挂载点不能安装武器或供超重型武器占用');
  if(m.beltSystem1&&m.beltSystem1===m.beltSystem2)err('战术带的两个系统不能重复指定同一件');
  for(const id of [m.beltSystem1,m.beltSystem2].filter(Boolean))if(!m.systems.includes(id)||!beltEligible(SYSTEMS[id]))err('战术带只能装载已安装且带榴弹、地雷或可展开标签的系统');
 }
 if(m.systems.includes('ms_pl_weapon_pod')) {
  const mode=m.podMode==='Auxiliary'?'Auxiliary':'Main';
  for(const id of [m.podWeapon1,...(mode==='Auxiliary'?[m.podWeapon2]:[])].filter(Boolean))if(WEAPONS[id]?.mount!==mode||!itemAvailable(p,WEAPONS[id]))err('武器舱储存武器的尺寸或牌照不合法');
 }
 return out;
}
function professionalSystemSummary(s,m,p) {
 if(s.id==='ms_pl_tactical_belt')return `战术带挂载点：${m.beltMount||'未指定'}；装载系统：${beltSystems(m).map(id=>plain('item',SYSTEMS[id])).join('、')||'无'}；合计减免 ${tacticalBeltDiscount(p,m)} SP。`;
 if(s.id==='ms_pl_weapon_pod')return `舱内武器（不能攻击或装填）：${[m.podWeapon1,...(m.podMode==='Auxiliary'?[m.podWeapon2]:[])].filter(id=>WEAPONS[id]).map(id=>plain('item',WEAPONS[id])).join('、')||'未指定'}。`;
 if(s.id==='ms_pl_sentry_drone') {const e=sentryWeapons(p,m).find(e=>e.mount.key+'|'+e.i===m.sentryWeapon);return `哨兵部署武器：${e?plain('item',e.w):'部署时选择'}。`;}
 return '';
}
