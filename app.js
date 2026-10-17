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
const MAKERS = ["GMS", "IPS-N", "SSC", "HORUS", "HA"];
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
};
const T = {
	mount: { "Main": "主", "Aux": "副", "Flex": "灵活", "Main/Aux": "主/副", "Aux/Aux": "副/副", "Heavy": "重型", "Integrated": "内建", "Auxiliary": "副", "Superheavy": "超重型", "Ship-class": "舰载级" },
	wtype: { "Melee": "肉搏", "CQB": "CQB", "Rifle": "步枪", "Launcher": "发射器", "Cannon": "大炮", "Nexus": "巢房", "Special": "特殊" },
	dmg: { "Kinetic": "动能", "Explosive": "爆炸", "Energy": "能量", "Heat": "热度", "Burn": "燃烧", "Variable": "可变" },
	range: { "Range": "射程", "Threat": "威胁", "Blast": "爆炸", "Burst": "爆发", "Line": "直线", "Cone": "锥形", "Thrown": "投掷" },
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
	return html ? `${esc(z)} <small>${esc(x.name)}</small>` : z;
}
const plain = (kind, x) => label(kind, x, false);
const makerName = m => (Z.makers[m] ? `${m} ${Z.makers[m]}` : m);

function tagText(t) {
	const def = TAGS[t.id];
	if (!def) return t.id;
	const key = def.name.toLowerCase();
	const z = Z.tags[key] || Z.tags[key.replace(/\s*\{val\}/, "")];
	const val = def.name.includes("{VAL}") && t.val != null ? String(t.val) : "";
	if (!z) return def.name.replace(/\s*\{VAL\}/g, val ? " " + val : "");
	if (z.name.includes("X")) return z.name.replace(/X/g, val);
	return val ? `${z.name} ${val}` : z.name;
}
const tagsHtml = tags => (tags || []).filter(t => !["tg_pilot_weapon", "tg_gear", "tg_personal_armor"].includes(t.id)).map(t => `<span class="tag" title="${esc(TAGS[t.id] ? TAGS[t.id].description.replace(/\{VAL\}/g, t.val ?? "X") : "")}">${esc(tagText(t))}</span>`).join("");
const tagsPlain = tags => (tags || []).filter(t => !["tg_pilot_weapon", "tg_gear", "tg_personal_armor"].includes(t.id)).map(tagText).join("、");
const dmgText = d => (d || []).map(x => `${x.val}${T.dmg[x.type] || x.type}`).join("+");
const rngText = r => (r || []).map(x => `${T.range[x.type] || x.type}${x.val}`).join(" ");

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
		talents: {}, licenses: {}, coreBonuses: [],
		gear: { armor: "", weapons: ["", ""], items: ["", "", ""] },
		mechs: [blankMech()], activeMech: 0,
		wizard: null, // 引导式车卡当前步骤 id；null 表示用自定义编辑器
	};
}
function blankMech(frame = EVEREST) {
	return { name: "新机甲", frame, retrofit: -1, stabilized: "", overpower: "", loadout: {}, systems: [], notes: "" };
}
function load() {
	try {
		const s = JSON.parse(localStorage.getItem(STORE));
		if (s && s.pilots && s.pilots.length) return s;
	} catch (e) { /* 忽略损坏的存档 */ }
	const p = blankPilot();
	return { pilots: [p], current: p.id, ignoreLimits: false };
}
function save() { localStorage.setItem(STORE, JSON.stringify(db)); }
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
	if (it.talent_item) return (p.talents[it.talent_id] || 0) >= (it.talent_rank || 1);
	if (!it.source) return false;
	if (it.source === "GMS" && !it.license_level) return true;
	return licenseRank(p, it.license) >= (it.license_level || 0);
}
const frameAvailable = (p, f) => db.ignoreLimits || f.id === EVEREST || (p.licenses[f.id] || 0) >= 2;
const makerLicenseTotal = (p, m) => D.frames.filter(f => f.source === m).reduce((s, f) => s + (p.licenses[f.id] || 0), 0);
function cbEligible(p, cb, extra = 0) {
	if (cb.source === "GMS" || db.ignoreLimits) return true;
	const taken = p.coreBonuses.filter(id => CBS[id] && CBS[id].source === cb.source).length + extra;
	return makerLicenseTotal(p, cb.source) >= 3 * taken;
}
const hasCB = (p, id) => p.coreBonuses.includes(id);
const isUnique = it => (it.tags || []).some(t => t.id === "tg_unique");

function mountsOf(p, m) {
	const f = FRAMES[m.frame];
	if (!f) return [];
	const mounts = f.mounts.map((t, i) => ({ key: "m" + i, type: t }));
	if (hasCB(p, "cb_mount_retrofitting") && mounts[m.retrofit]) mounts[m.retrofit] = { ...mounts[m.retrofit], type: "Main/Aux", retro: true };
	if (hasCB(p, "cb_improved_armament") && mounts.length < 3) mounts.push({ key: "ia", type: "Flex", note: "强化装备" });
	if (hasCB(p, "cb_integrated_weapon")) mounts.push({ key: "iw", type: "Integrated", note: "内建武器（核心加成）", noMods: true });
	return mounts;
}
function integratedOf(f) {
	if (!f) return [];
	const ids = [...(f.core_system.integrated || []), ...f.traits.flatMap(t => t.integrated || [])];
	return ids.map(id => WEAPONS[id] || SYSTEMS[id]).filter(Boolean);
}
const slotState = (m, key) => (m.loadout[key] = m.loadout[key] || { slots: [], link: "" });

// 当前机甲上实际装备的武器 [{mount, slotIdx, w, mod}]
function equippedWeapons(p, m) {
	const out = [];
	const mounts = mountsOf(p, m);
	const linked = new Set(mounts.map(mt => slotState(m, mt.key).link).filter(Boolean));
	for (const mt of mounts) {
		if (linked.has(mt.key)) continue;
		const st = slotState(m, mt.key);
		MOUNT_SLOTS[mt.type].forEach((acc, i) => {
			const s = st.slots[i];
			if (s && s.w && WEAPONS[s.w]) out.push({ mount: mt, i, w: WEAPONS[s.w], mod: s.mod && MODS[s.mod] });
		});
	}
	return out;
}

function mechStats(p, m) {
	const f = FRAMES[m.frame];
	if (!f) return null;
	const s = f.stats, h = p.hase, L = LV(p.ll);
	const bonus = id => {
		let v = 0;
		p.coreBonuses.forEach(c => (CBS[c] && CBS[c].bonuses || []).forEach(b => { if (b.id === id) v += +b.val || 0; }));
		m.systems.forEach(sid => (SYSTEMS[sid] && SYSTEMS[sid].bonuses || []).forEach(b => { if (b.id === id) v += +b.val || 0; }));
		return v;
	};
	let size = s.size;
	if (bonus("size")) size = size < 1 ? 1 : Math.min(3, size + 1);
	const spUsed = m.systems.reduce((a, id) => a + (SYSTEMS[id] ? SYSTEMS[id].sp || 0 : 0), 0) +
		equippedWeapons(p, m).reduce((a, e) => a + (e.w.sp || 0) + (e.mod ? e.mod.sp || 0 : 0), 0);
	return {
		size, structure: s.structure, stress: s.stress,
		hp: s.hp + L.grit + h.hull * 2 + bonus("hp"),
		armor: Math.min(4, s.armor + bonus("armor")),
		evasion: s.evasion + h.agi + bonus("evasion"),
		speed: s.speed + Math.floor(h.agi / 2),
		edef: s.edef + h.sys + bonus("edef"),
		tech: s.tech_attack + h.sys,
		sensor: s.sensor_range,
		save: s.save + L.grit + bonus("save"),
		heatcap: s.heatcap + h.eng,
		repcap: s.repcap + Math.floor(h.hull / 2),
		sp: s.sp + L.grit + Math.floor(h.sys / 2),
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
	const out = []; // [level, text]
	const L = LV(p.ll);
	const trig = p.triggers.reduce((s, t) => s + (+t.val || 0), 0);
	if (trig !== L.triggers) out.push(["warn", `触发点数合计 +${trig}，LL${p.ll} 应为 +${L.triggers}`]);
	if (p.triggers.some(t => !t.id && !t.custom)) out.push(["warn", "有未填写的触发"]);
	const ids = p.triggers.map(t => t.id || t.custom).filter(Boolean);
	if (new Set(ids).size !== ids.length) out.push(["err", "触发重复"]);
	const hs = Object.values(p.hase).reduce((a, b) => a + b, 0);
	if (hs !== L.skills) out.push(["warn", `机甲能力点数 ${hs}，应为 ${L.skills}`]);
	const tr = Object.values(p.talents).reduce((a, b) => a + b, 0);
	if (tr !== L.talents) out.push(["warn", `天赋等级合计 ${tr}，应为 ${L.talents}`]);
	const lr = Object.values(p.licenses).reduce((a, b) => a + b, 0);
	if (lr !== L.licenses) out.push([lr > L.licenses ? "err" : "warn", `牌照等级合计 ${lr}，应为 ${L.licenses}`]);
	if (p.coreBonuses.length !== L.cbs) out.push([p.coreBonuses.length > L.cbs ? "err" : "warn", `核心加成 ${p.coreBonuses.length} 个，应为 ${L.cbs} 个`]);
	if (!db.ignoreLimits) for (const mk of MAKERS.slice(1)) {
		const n = p.coreBonuses.filter(id => CBS[id] && CBS[id].source === mk).length;
		if (n && makerLicenseTotal(p, mk) < n * 3) out.push(["err", `${mk} 核心加成 ${n} 个需要该厂牌照合计 ${n * 3} 级（现有 ${makerLicenseTotal(p, mk)}）`]);
	}
	if (!p.background && !p.bgCustom) out.push(["warn", "未选择背景"]);
	p.mechs.forEach((m, mi) => {
		const f = FRAMES[m.frame];
		const tag = `机甲「${m.name || mi + 1}」`;
		if (!f) return out.push(["err", `${tag} 未选择骨架`]);
		if (!frameAvailable(p, f)) out.push(["err", `${tag} 的骨架 ${f.name} 需要该牌照 2 级`]);
		const st = mechStats(p, m);
		if (st.spUsed > st.sp) out.push(["err", `${tag} SP 超出：${st.spUsed}/${st.sp}`]);
		const eq = equippedWeapons(p, m);
		const all = [...eq.map(e => e.w), ...eq.map(e => e.mod).filter(Boolean), ...m.systems.map(id => SYSTEMS[id]).filter(Boolean)];
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
	return `<span class="stepper"><button data-act="${act}" data-arg="${esc(arg)}" data-d="-1" ${val <= min ? "disabled" : ""}>−</button><span>${fmt(val)}</span><button data-act="${act}" data-arg="${esc(arg)}" data-d="1" ${val >= max ? "disabled" : ""}>+</button></span>`;
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
function pilotParts(p) {
	const L = LV(p.ll), ps = pilotStats(p);
	const bg = BGS[p.background];
	const bgz = bg && Z.bg[bg.name.toLowerCase()];
	const trigSum = p.triggers.reduce((s, t) => s + (+t.val || 0), 0);
	const skillOpts = D.skills.slice().sort((a, b) => a.family.localeCompare(b.family));
	const gearSel = (path, type, val) => `<select data-k="${path}"><option value="">—</option>${D.pilot_gear.filter(g => g.type === type).map(g => opt(g.id, plain("gear", g), g.id === val)).join("")}</select>`;
	const gearInfo = (id, slot) => {
		const g = GEAR[id];
		if (!g) return "";
		const z = Z.gear[g.name];
		const meta = [g.damage ? dmgText(g.damage) : "", g.range ? rngText(g.range) : "", tagsPlain(g.tags)].filter(Boolean).join(" · ");
		return `<div class="wstat">${esc(meta)}</div>` + det("gear-" + id + slot, "说明", (z && z.html) || esc(g.description || g.effect || ""));
	};
	return {
	basic: `<div class="card">
		<h3>基本资料</h3>
		<div class="row"><label>名字</label><input type="text" data-k="name" value="${esc(p.name)}"></div>
		<div class="row"><label>呼号</label><input type="text" data-k="callsign" value="${esc(p.callsign)}"></div>
		<div class="row"><label>玩家</label><input type="text" data-k="player" value="${esc(p.player)}"></div>
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
		<div class="row"><select data-k="background"><option value="">— 自创背景 —</option>${D.backgrounds.map(b => opt(b.id, plain("bg", b), b.id === p.background)).join("")}</select>
		<button data-act="rollBg" title="掷 1d20">🎲 随机</button></div>
		${p.background ? "" : `<div class="row"><input type="text" data-k="bgCustom" placeholder="自创背景名称" value="${esc(p.bgCustom)}"></div>`}
		${bgz ? `<div class="muted">${esc(bgz.triggers)}</div>${det("bg", "背景说明", bgz.html)}` : ""}
		<p class="muted">使用背景：在战斗以外，与背景相关的技能判定可得 +1 准度（或 +1 难度）。</p>
		<h4>外貌 / 经历</h4>
		<textarea data-k="bio" placeholder="简单写写这个驾驶员的故事">${esc(p.bio)}</textarea>
	</div>`,
	triggers: `<div class="card wide">
		<h3>触发 Triggers ${counter(trigSum, L.triggers)}</h3>
		<p class="muted">LL0 有四个 +2 触发；每升一级可让一个触发 +2 或新增一个 +2 触发（单项最高 +6）。可从范例中选，也可自订。</p>
		${p.triggers.map((t, i) => {
			const sk = SKILLS[t.id];
			const z = sk && Z.skills[sk.name.toLowerCase()];
			return `<div class="list-item"><div class="li-head">
				<span class="row" style="flex:1">
					<select data-k="triggers.${i}.id"><option value="">— 自订触发 —</option>${skillOpts.map(s => opt(s.id, plain("skill", s), s.id === t.id)).join("")}</select>
					${t.id ? "" : `<input type="text" style="max-width:220px" data-k="triggers.${i}.custom" placeholder="自订触发名称" value="${esc(t.custom)}">`}
				</span>
				<span>${stepper("trig", i, +t.val, 2, 6, v => "+" + v)} <button data-act="delTrig" data-arg="${i}" class="danger">✕</button></span>
			</div>${sk ? det("sk" + t.id + i, esc(sk.description), (z && z.html) || esc(sk.detail)) : ""}</div>`;
		}).join("")}
		<button data-act="addTrig">+ 新增触发</button>
	</div>`,
	gear: `<div class="card wide">
		<h3>驾驶员装备 <span class="muted">一套装甲、最多两件武器、三件其他装备</span></h3>
		<div class="grid">
			<div><h4>装甲</h4>${gearSel("gear.armor", "Armor", p.gear.armor)}${gearInfo(p.gear.armor, "a")}</div>
			${p.gear.weapons.map((w, i) => `<div><h4>武器 ${i + 1}</h4>${gearSel(`gear.weapons.${i}`, "Weapon", w)}${gearInfo(w, "w" + i)}</div>`).join("")}
			${p.gear.items.map((w, i) => `<div><h4>装备 ${i + 1}</h4>${gearSel(`gear.items.${i}`, "Gear", w)}${gearInfo(w, "g" + i)}</div>`).join("")}
		</div>
	</div>`,
	};
}
function renderPilot(p) {
	const x = pilotParts(p);
	return `<div class="grid">${x.basic}${x.bg}${x.triggers}${x.gear}</div>`;
}

// ---------- 页面：等级成长 ----------
function progressParts(p) {
	const L = LV(p.ll);
	const hs = Object.values(p.hase).reduce((a, b) => a + b, 0);
	const tr = Object.values(p.talents).reduce((a, b) => a + b, 0);
	const lr = Object.values(p.licenses).reduce((a, b) => a + b, 0);
	const levelTable = `<table class="tbl"><tr><th>LL</th><th>毅力</th><th>机甲能力</th><th>牌照</th><th>天赋</th><th>核心加成</th><th>触发</th></tr>${Array.from({ length: 13 }, (_, i) => {
		const l = LV(i);
		return `<tr class="${i === p.ll ? "cur" : ""}"><td>${i}</td><td>${l.grit}</td><td>${l.skills}</td><td>${l.licenses}</td><td>${l.talents}</td><td>${l.cbs}</td><td>+${l.triggers}</td></tr>`;
	}).join("")}</table>`;
	const haseDesc = { hull: "每点 +2 HP；每两点 +1 维修上限", agi: "每点 +1 回避；每两点 +1 速度", sys: "每点 +1 电子防御与科技攻击；每两点 +1 SP", eng: "每点 +1 热度上限；每两点 +1 受限装备使用次数" };
	return {
	hase: `<div class="card">
		<h3>机甲能力 HASE ${counter(hs, L.skills)}</h3>
		${Object.keys(T.hase).map(k => `<div class="row" style="justify-content:space-between"><span><b>${T.hase[k]}</b><br><span class="muted">${haseDesc[k]}</span></span>${stepper("hase", k, p.hase[k], 0, 6, v => "+" + v)}</div>`).join("")}
	</div>`,
	levels: `<div class="card"><h3>等级表 <span class="muted">当前 LL${p.ll}</span></h3>${levelTable}
		<p class="muted">升级时可重分配：一个天赋的全部等级、一个牌照的全部等级，或换一个核心加成。</p></div>`,
	licenses: `<div class="card wide">
		<h3>牌照 Licenses ${counter(lr, L.licenses)}</h3>
		<p class="muted">每级 LL 得 1 牌照等级。牌照分一至三级，须依次取得；二级解锁该骨架。GMS（埃佛勒斯及 GMS 装备）永远可用。</p>
		${MAKERS.slice(1).map(mk => `<div class="mfr" style="border-color:${MAKER_COLOR[mk]}">${esc(makerName(mk))} <span class="muted">合计 ${makerLicenseTotal(p, mk)} 级</span></div>
			<div class="lic-grid">${D.frames.filter(f => f.source === mk).map(f => `<div class="lic ${p.licenses[f.id] ? "has" : ""}"><span>${label("frame", f)}</span>${stepper("lic", f.id, p.licenses[f.id] || 0, 0, 3, v => ["—", "I", "II", "III"][v])}</div>`).join("")}</div>`).join("")}
	</div>`,
	cbs: `<div class="card wide">
		<h3>核心加成 Core Bonuses ${counter(p.coreBonuses.length, L.cbs)}</h3>
		<p class="muted">每 3 级 LL 得一个。GMS 加成随时可选；其他厂商每个加成需要该厂商合计 3 级牌照（第二个需要 6 级，以此类推）。</p>
		${MAKERS.map(mk => `<div class="mfr" style="border-color:${MAKER_COLOR[mk]}">${esc(makerName(mk))}</div>${D.core_bonuses.filter(c => c.source === mk).map(c => {
			const have = hasCB(p, c.id);
			const ok = have || cbEligible(p, c, 1);
			const z = Z.cb[nk(c.name)];
			return `<div class="list-item ${have ? "active" : ok ? "" : "locked"}"><div class="li-head"><span class="li-title">${label("cb", c)}</span>
				<button data-act="cb" data-arg="${c.id}" ${!have && !ok ? "disabled" : ""}>${have ? "移除" : "选择"}</button></div>
				<div class="desc">${z ? z.html : esc(c.effect)}</div></div>`;
		}).join("")}`).join("")}
	</div>`,
	talents: `<div class="card wide">
		<h3>天赋 Talents ${counter(tr, L.talents)}</h3>
		<p class="muted">LL0 有三个一级天赋；每升一级可让一个天赋升一级，或取得一个新的一级天赋。</p>
		${D.talents.map(t => {
			const r = p.talents[t.id] || 0;
			const z = Z.talents[t.name];
			const ranks = t.ranks.map((rk, i) => `<div class="rank ${i < r ? "have" : ""}"><div class="rank-h">${["I", "II", "III"][i]}．${esc(z ? z.ranks[i].name : rk.name)}</div>${z ? z.ranks[i].html : rk.description}</div>`).join("");
			return `<div class="list-item ${r ? "active" : ""}"><div class="li-head"><span class="li-title">${label("talent", t)}</span>${stepper("tal", t.id, r, 0, 3, v => ["—", "I", "II", "III"][v])}</div>
				<div class="muted">${esc(t.terse || "")}</div>${det("t" + t.id, "天赋详情", (z ? z.desc : "") + ranks)}</div>`;
		}).join("")}
	</div>`,
	};
}
function renderProgress(p) {
	const x = progressParts(p);
	return `<div class="grid">${x.hase}${x.levels}${x.licenses}${x.cbs}${x.talents}</div>`;
}

// ---------- 页面：机甲 ----------
function itemOptions(p, list, cur, filter) {
	const groups = {};
	list.filter(filter).forEach(it => {
		const ok = itemAvailable(p, it) || it.id === cur;
		if (!ok) return;
		const g = it.source ? `${it.source}${it.license && it.license !== "GMS" ? " · " + (Z.frames[nk(it.license)] || it.license) + " " + it.license_level : ""}` : "天赋";
		(groups[g] = groups[g] || []).push(it);
	});
	return Object.entries(groups).map(([g, items]) => `<optgroup label="${esc(g)}">${items.map(it => opt(it.id, esc(plain("item", it)) + (it.sp ? ` [${it.sp}SP]` : ""), it.id === cur)).join("")}</optgroup>`).join("");
}
const ACT = { "Quick": "快速动作", "Full": "完整动作", "Reaction": "反应", "Protocol": "协定", "Free": "免费动作", "Quick Tech": "快速科技", "Full Tech": "完整科技", "Invade": "入侵", "Deployable": "可展开", "Drone": "无人机", "Mine": "地雷" };
const freqText = f => String(f || "").replace(/(\d+)\s*\/\s*round/i, "每轮$1次").replace(/(\d+)\s*\/\s*turn/i, "每回合$1次").replace(/(\d+)\s*\/\s*scene/i, "每场景$1次").replace(/unlimited/i, "无限");
const txt = v => (v && typeof v === "object" ? v.detail || "" : v || "");
// 系统、武器、骨架上的动作（反应、协定等）与可展开物（无人机、地雷等）
let STAT_CTX = {}; // 当前机甲数值，用于展开可展开物数值里的 {grit}、{evasion} 等
const statVal = v => {
	const r = String(v).replace(/\{(\w+)\}/g, (m, k) => (STAT_CTX[k] != null ? STAT_CTX[k] : m));
	return /^[\d\s+]+$/.test(r) ? r.split("+").reduce((a, b) => a + (+b || 0), 0) : r;
};
function actsHtml(o) {
	let h = "";
	for (const k of ["actions", "active_actions", "passive_actions"]) for (const a of o[k] || []) {
		if (!a.detail && !a.name) continue;
		const meta = [ACT[a.activation] || a.activation, freqText(a.frequency)].filter(x => x && x !== "None").join("，");
		h += `<div class="blk"><div class="blk-h">${esc(a.name || "")} <span class="muted">${esc(meta)}</span></div>${a.trigger ? `<p><b>触发：</b>${a.trigger}</p>` : ""}<p>${a.detail || ""}</p></div>`;
	}
	for (const k of ["deployables", "active_deployables"]) for (const d of o[k] || []) {
		const st = [d.size != null ? "大小" + (d.size === 0.5 ? "½" : d.size) : "", d.hp != null ? statVal(d.hp) + " HP" : "", d.armor ? "装甲" + statVal(d.armor) : "", d.evasion != null ? "回避" + statVal(d.evasion) : "", d.edef != null ? "电子防御" + statVal(d.edef) : ""].filter(Boolean).join(" · ");
		h += `<div class="blk"><div class="blk-h">${esc(d.name || "")} <span class="muted">${esc(ACT[d.type] || d.type || "")}${st ? " · " + esc(st) : ""}</span></div><p>${d.detail || ""}</p>${actsHtml(d)}</div>`;
	}
	return h;
}
function weaponInfo(w, mod) {
	const prof = w.profiles ? w.profiles[0] : w;
	const meta = [`${T.mount[w.mount] || w.mount}${T.wtype[w.type] || w.type}`, rngText(prof.range), dmgText(prof.damage)].filter(Boolean).join(" · ");
	const z = Z.gms[w.name];
	let detail = (z && z.html) || "";
	if (w.effect) detail += `<p>${w.effect}</p>`;
	if (w.on_hit) detail += `<p><b>命中时：</b>${txt(w.on_hit)}</p>`;
	if (w.on_crit) detail += `<p><b>重击时：</b>${txt(w.on_crit)}</p>`;
	if (w.on_attack) detail += `<p><b>攻击时：</b>${txt(w.on_attack)}</p>`;
	if (w.profiles) detail += w.profiles.map(pf => `<div class="blk"><div class="blk-h">${esc(pf.name)}</div><div>${rngText(pf.range)} · ${dmgText(pf.damage)} ${tagsHtml(pf.tags)}</div>${pf.effect ? `<p>${pf.effect}</p>` : ""}${actsHtml(pf)}</div>`).join("");
	detail += actsHtml(w);
	if (mod) detail += `<div class="blk"><div class="blk-h">改装：${esc(plain("item", mod))} (${mod.sp}SP)</div><p>${mod.effect || ""}</p>${actsHtml(mod)}</div>`;
	return `<div class="wstat">${esc(meta)} ${tagsHtml(prof.tags || w.tags)}</div>` + det("w" + w.id + (mod ? mod.id : ""), "武器效果", detail);
}
function mechParts(p) {
	const m = M();
	const f = FRAMES[m.frame];
	const st = mechStats(p, m);
	STAT_CTX = st ? { ...st, grit: LV(p.ll).grit } : {};
	const mechTabs = `<div class="mech-tabs">${p.mechs.map((x, i) => `<button data-act="pickMech" data-arg="${i}" class="${i === p.activeMech ? "on" : ""}">${esc(x.name || "机甲" + (i + 1))}</button>`).join("")}
		<button data-act="addMech">+ 新机甲</button>${p.mechs.length > 1 ? `<button data-act="delMech" class="danger">删除此机甲</button>` : ""}</div>`;
	const frameSel = `<select data-k="mech.frame">${MAKERS.map(mk => `<optgroup label="${esc(makerName(mk))}">${D.frames.filter(x => x.source === mk).map(x => opt(x.id, esc(plain("frame", x)) + (frameAvailable(p, x) ? "" : " 🔒"), x.id === m.frame, !frameAvailable(p, x) && x.id !== m.frame)).join("")}</optgroup>`).join("")}</select>`;
	if (!f) return { only: mechTabs + `<div class="card">${frameSel}</div>` };

	const stat = (v, n, hl) => `<div class="stat ${hl ? "hl" : ""}"><b>${v}</b><span>${n}</span></div>`;
	const statsHtml = `<div class="stats">
		${stat(st.hp, "HP", 1)}${stat(st.armor, "装甲")}${stat(st.structure, "结构")}${stat(st.stress, "压力")}
		${stat(st.evasion, "回避", 1)}${stat(st.edef, "电子防御", 1)}${stat(st.speed, "速度")}${stat(st.size === 0.5 ? "½" : st.size, "大小")}
		${stat(st.heatcap, "热度上限")}${stat(st.repcap, "维修上限")}${stat(st.sensor, "感应")}${stat(st.save, "豁免目标")}
		${stat((st.tech >= 0 ? "+" : "") + st.tech, "科技攻击")}${stat("+" + st.attack, "攻击加值")}${stat("+" + st.limited, "受限加成")}${stat(st.sp, "SP")}
	</div>`;

	const traits = f.traits.map(t => `<div class="blk"><div class="blk-h">${esc(t.name)}</div><p>${t.description}</p></div>`).join("");
	const cs = f.core_system;
	const coreActs = actsHtml(cs);
	const core = `<div class="blk"><div class="blk-h">核心系统：${esc(cs.name)}</div>${cs.passive_name ? `<p><b>${esc(cs.passive_name)}（被动）</b>：${cs.passive_effect || ""}</p>` : ""}<p><b>${esc(cs.active_name || "")}</b> <span class="muted">${esc(ACT[cs.activation] || cs.activation || "")}，消耗1 CP</span>：${cs.active_effect || ""}</p>${coreActs}</div>`;

	// 挂载点
	const mounts = mountsOf(p, m);
	const linkedBy = {};
	mounts.forEach(mt => { const l = slotState(m, mt.key).link; if (l) linkedBy[l] = mt.key; });
	const mountHtml = mounts.map(mt => {
		const sst = slotState(m, mt.key);
		const title = `${T.mount[mt.type] || mt.type}挂载点${mt.retro ? "（改造挂载点）" : ""}${mt.note ? "（" + mt.note + "）" : ""}`;
		const stab = hasCB(p, "cb_auto_stabilizing_hardpoints") ? `<label class="chk"><input type="radio" name="stab" data-act="stab" data-arg="${mt.key}" ${m.stabilized === mt.key ? "checked" : ""}> 自动稳定（+1准度）</label>` : "";
		if (linkedBy[mt.key]) return `<div class="mount"><div class="mount-h">${title}</div><div class="muted">被超重型武器占用</div></div>`;
		const slots = MOUNT_SLOTS[mt.type].map((acc, i) => {
			const s = sst.slots[i] || {};
			const first = sst.slots[0] && WEAPONS[sst.slots[0].w];
			if (i === 1 && first && first.mount !== "Auxiliary") return "";
			const w = WEAPONS[s.w];
			const mods = w && !mt.noMods && !w.no_mods ? D.mods.filter(md => (!md.allowed_types || md.allowed_types.includes(w.type)) && !(md.restricted_sizes || []).includes(w.mount)) : [];
			let html = `<div class="slot"><select data-act="slotW" data-arg="${mt.key}|${i}"><option value="">— 空 —</option>${itemOptions(p, D.weapons, s.w, x => acc.includes(x.mount))}</select>
				${mods.length ? `<select data-act="slotMod" data-arg="${mt.key}|${i}"><option value="">— 无改装 —</option>${itemOptions(p, mods, s.mod, () => true)}</select>` : "<span></span>"}</div>`;
			if (w) html += weaponInfo(w, s.mod && MODS[s.mod]);
			if (w && w.mount === "Superheavy") {
				const others = mounts.filter(o => o.key !== mt.key && o.type !== "Integrated");
				html += `<div class="row"><span class="muted">超重型武器需同时占用另一个挂载点：</span><select data-act="link" data-arg="${mt.key}"><option value="">— 选择 —</option>${others.map(o => opt(o.key, `${T.mount[o.type]}挂载点`, sst.link === o.key)).join("")}</select></div>`;
			}
			return html;
		}).join("");
		return `<div class="mount"><div class="mount-h"><span>${title}</span>${stab}</div>${slots}</div>`;
	}).join("");
	const integ = integratedOf(f).map(w => `<div class="mount"><div class="mount-h">内建：${esc(plain("item", w))}</div>${w.mount ? weaponInfo(w) : `<div class="desc">${w.effect || ""}${actsHtml(w)}</div>`}</div>`).join("");
	const retro = hasCB(p, "cb_mount_retrofitting") ? `<div class="row"><span class="muted">改造挂载点（核心加成）：把哪个挂载点换成主/副？</span><select data-act="retro"><option value="-1">—</option>${f.mounts.map((t, i) => opt(i, `${i + 1}. ${T.mount[t]}挂载点`, m.retrofit === i)).join("")}</select></div>` : "";
	const overpower = hasCB(p, "cb_overpower_caliber") ? `<div class="row"><span class="muted">过强弹药（核心加成）指定武器：</span><select data-k="mech.overpower"><option value="">—</option>${equippedWeapons(p, m).map(e => opt(e.w.id, esc(plain("item", e.w)), m.overpower === e.w.id)).join("")}</select></div>` : "";

	// 系统
	const sysHtml = m.systems.map((id, i) => {
		const s = SYSTEMS[id];
		if (!s) return "";
		const z = Z.gms[s.name];
		const lock = !itemAvailable(p, s);
		return `<div class="list-item ${lock ? "locked" : ""}"><div class="li-head"><span class="li-title">${label("item", s)} <small>${s.sp || 0} SP</small></span><button data-act="delSys" data-arg="${i}" class="danger">✕</button></div>
			<div class="wstat">${s.type ? (T.stype[s.type] || s.type) + " " : ""}${tagsHtml(s.tags)}</div>${det("s" + id + i, "系统效果", (z && z.html) || ((s.effect ? `<p>${s.effect}</p>` : "") + actsHtml(s)))}</div>`;
	}).join("");
	const spPct = Math.min(100, (st.spUsed / st.sp) * 100);

	return {
	tabs: mechTabs,
	info: `<div class="card">
		<h3>机甲</h3>
		<div class="row"><label>名称</label><input type="text" data-k="mech.name" value="${esc(m.name)}"></div>
		<div class="row"><label>骨架</label>${frameSel}</div>
		<div class="muted">${esc(f.source)} · ${f.mechtype.map(r => T.role[r] || r).join("/")} · 挂载点：${f.mounts.map(x => T.mount[x]).join("、")}</div>
		${det("fdesc", "骨架介绍", `<p>${f.description}</p>`)}
		<h4>骨架特性</h4><div class="desc">${traits}${core}</div>
	</div>`,
	stats: `<div class="card">
		<h3>数值 <span class="muted">已计入毅力、HASE、核心加成与系统</span></h3>
		${statsHtml}
		<h4>SP ${st.spUsed} / ${st.sp}</h4>
		<div class="spbar ${st.spUsed > st.sp ? "over" : ""}"><div style="width:${spPct}%"></div></div>
	</div>`,
	weapons: `<div class="card">
		<h3>武器</h3>${retro}${mountHtml}${integ}${overpower}
	</div>`,
	systems: `<div class="card">
		<h3>系统 <span class="muted">剩余 ${st.sp - st.spUsed} SP</span></h3>
		${sysHtml || '<p class="muted">尚未安装系统</p>'}
		<div class="row"><select id="sysAdd" style="flex:1"><option value="">— 选择系统 —</option>${itemOptions(p, D.systems, "", s => !(isUnique(s) && m.systems.includes(s.id)))}</select><button data-act="addSys" class="primary">安装</button></div>
		<h4>备注</h4><textarea data-k="mech.notes">${esc(m.notes)}</textarea>
	</div>`,
	};
}
function renderMech(p) {
	const x = mechParts(p);
	return x.only || x.tabs + `<div class="grid">${x.info}${x.stats}${x.weapons}${x.systems}</div>`;
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
	lines.push(`机甲能力：机体 +${p.hase.hull}　敏捷 +${p.hase.agi}　系统 +${p.hase.sys}　工程 +${p.hase.eng}`);
	lines.push(`天赋：${Object.entries(p.talents).filter(([, r]) => r).map(([id, r]) => `${plain("talent", TALENTS[id])} ${["", "I", "II", "III"][r]}`).join("、") || "—"}`);
	lines.push(`牌照：GMS${Object.entries(p.licenses).filter(([, r]) => r).map(([id, r]) => `、${plain("frame", FRAMES[id])} ${["", "I", "II", "III"][r]}`).join("")}`);
	lines.push(`核心加成：${p.coreBonuses.map(id => plain("cb", CBS[id])).join("、") || "—"}`);
	const g = p.gear;
	lines.push(`驾驶员装备：${[g.armor, ...g.weapons, ...g.items].filter(Boolean).map(id => plain("gear", GEAR[id])).join("、") || "—"}`);
	if (p.bio) lines.push(`经历：${p.bio}`);
	p.mechs.forEach(m => {
		const f = FRAMES[m.frame];
		if (!f) return;
		const st = mechStats(p, m);
		lines.push("");
		lines.push(`【机甲】${m.name}　骨架：${f.source} ${plain("frame", f)}`);
		lines.push(`HP ${st.hp}｜装甲 ${st.armor}｜结构 ${st.structure}｜压力 ${st.stress}｜热度上限 ${st.heatcap}｜维修上限 ${st.repcap}`);
		lines.push(`回避 ${st.evasion}｜电子防御 ${st.edef}｜速度 ${st.speed}｜大小 ${st.size === 0.5 ? "½" : st.size}｜感应 ${st.sensor}｜豁免目标 ${st.save}`);
		lines.push(`科技攻击 ${st.tech >= 0 ? "+" : ""}${st.tech}｜攻击加值 +${st.attack}｜SP ${st.spUsed}/${st.sp}`);
		lines.push(`特性：${f.traits.map(t => t.name).join("、")}｜核心系统：${f.core_system.name}`);
		lines.push("武器：");
		integratedOf(f).forEach(w => lines.push(`  · [内建] ${plain("item", w)}`));
		equippedWeapons(p, m).forEach(e => {
			const prof = e.w.profiles ? e.w.profiles[0] : e.w;
			lines.push(`  · [${T.mount[e.mount.type]}] ${plain("item", e.w)}　${T.mount[e.w.mount]}${T.wtype[e.w.type] || ""}　${rngText(prof.range)}　${dmgText(prof.damage)}${tagsPlain(prof.tags) ? "　" + tagsPlain(prof.tags) : ""}${e.mod ? "　改装：" + plain("item", e.mod) : ""}${m.stabilized === e.mount.key ? "　(+1准度)" : ""}${m.overpower === e.w.id ? "　(过强弹药)" : ""}`);
		});
		lines.push(`系统：${m.systems.map(id => SYSTEMS[id] ? `${plain("item", SYSTEMS[id])}(${SYSTEMS[id].sp || 0})` : "").filter(Boolean).join("、") || "—"}`);
		if (m.notes) lines.push(`备注：${m.notes}`);
	});
	return lines.join("\n");
}
function renderSheet(p) {
	const cs = checks(p);
	return `<div class="grid">
	<div class="card wide noprint">
		<h3>规则检查</h3>
		${cs.length ? `<ul class="warn-list">${cs.map(([lv, t]) => `<li class="${lv}">${esc(t)}</li>`).join("")}</ul>` : `<p class="oklist">✓ 全部符合 LL${p.ll} 的车卡规则</p>`}
		<div class="row" style="margin-top:10px">
			<button data-act="copySheet" class="primary">复制文字角色卡</button>
			<button data-act="print">列印</button>
			<button data-act="exportJson">汇出 JSON</button>
			<button data-act="importJson">汇入 JSON</button>
		</div>
	</div>
	<div class="card wide"><pre class="sheet" id="sheetText">${esc(sheetText(p))}</pre></div>
	</div>`;
}

// ---------- 主渲染 ----------
function render() {
	const p = P();
	document.getElementById("charSelect").innerHTML = db.pilots.map(x => opt(x.id, esc(`${x.name || "未命名"}${x.callsign ? "「" + x.callsign + "」" : ""} LL${x.ll}`), x.id === p.id)).join("");
	document.getElementById("ignoreLimits").checked = !!db.ignoreLimits;
	document.querySelectorAll(".tabs button[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
	const cs = checks(p);
	const badge = document.getElementById("checkBadge");
	badge.className = "badge " + (cs.length ? "bad" : "ok");
	badge.textContent = cs.length ? `⚠ ${cs.length} 项待处理` : "✓ 符合规则";
	badge.title = cs.map(c => c[1]).join("\n");
	const y = window.scrollY;
	const inWiz = p.wizard != null;
	document.body.classList.toggle("in-wiz", inWiz);
	document.getElementById("modal").innerHTML = chooser ? renderChooser(chooser) : "";
	document.getElementById("app").innerHTML = inWiz ? renderWizard(p) :
		tab === "pilot" ? renderPilot(p) : tab === "progress" ? renderProgress(p) : tab === "mech" ? renderMech(p) : renderSheet(p);
	window.scrollTo(0, y);
	save();
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
	if (k.startsWith("mech.")) {
		const m = M();
		const key = k.slice(5);
		if (key === "frame" && m.frame !== el.value) { m.frame = el.value; m.loadout = {}; m.retrofit = -1; m.stabilized = ""; }
		else m[key] = el.value;
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
			if (+i === 0 && w && w.mount !== "Auxiliary") st.slots.length = 1;
			if (!w || w.mount !== "Superheavy") st.link = "";
		} else st.slots[i].mod = el.value;
	} else if (act === "link") {
		const st = slotState(m, arg);
		st.link = el.value;
		if (el.value) m.loadout[el.value] = { slots: [], link: "" };
	} else if (act === "retro") { m.retrofit = +el.value; m.loadout = {}; }
	else if (act === "stab") m.stabilized = arg;
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
	if (e.target.id === "checkBadge") { tab = "sheet"; return render(); }
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
		case "rollBg": p.background = D.backgrounds[Math.floor(Math.random() * D.backgrounds.length)].id; break;
		case "lic": { const v = clamp((p.licenses[arg] || 0) + d, 0, 3); if (v) p.licenses[arg] = v; else delete p.licenses[arg]; break; }
		case "tal": { const v = clamp((p.talents[arg] || 0) + d, 0, 3); if (v) p.talents[arg] = v; else delete p.talents[arg]; break; }
		case "cb": p.coreBonuses = hasCB(p, arg) ? p.coreBonuses.filter(x => x !== arg) : [...p.coreBonuses, arg]; break;
		case "pickMech": p.activeMech = +arg; break;
		case "addMech": {
			const best = D.frames.find(f => f.id !== EVEREST && (p.licenses[f.id] || 0) >= 2);
			p.mechs.push(blankMech(best ? best.id : EVEREST)); p.activeMech = p.mechs.length - 1; break;
		}
		case "delMech": if (!confirm(`删除机甲「${m.name}」？`)) return; p.mechs.splice(p.activeMech, 1); p.activeMech = 0; break;
		case "addSys": { const v = document.getElementById("sysAdd").value; if (v) m.systems.push(v); break; }
		case "delSys": m.systems.splice(+arg, 1); break;
		case "copySheet":
			navigator.clipboard.writeText(sheetText(p)).then(() => { el.textContent = "已复制 ✓"; setTimeout(() => (el.textContent = "复制文字角色卡"), 1500); });
			return;
		case "print": window.print(); return;
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
function importFile(input) {
	const file = input.files[0];
	if (!file) return;
	file.text().then(t => {
		try {
			const n = JSON.parse(t);
			if (!n.hase || !n.mechs) throw new Error("不是本车卡器汇出的角色");
			n.id = blankPilot().id;
			db.pilots.push(n); db.current = n.id; render();
		} catch (err) { alert("汇入失败：" + err.message); }
		input.value = "";
	});
}

render();
