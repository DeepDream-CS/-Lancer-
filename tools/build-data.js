// 生成 data.js：合并 COMP/CON 的 lancer-data（数值）与规则站的繁中翻译（文本）
// 用法：node tools/build-data.js
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ld = f => JSON.parse(fs.readFileSync(path.join(ROOT, "source/lancer-data", f + ".json"), "utf8"));
const tw = f => JSON.parse(fs.readFileSync(path.join(ROOT, "source/cn", f + ".json"), "utf8"));

// ---------- 繁中条目渲染（5etools 风格 entries → HTML） ----------
function inline(s) {
	return String(s)
		.replace(/\{@b ([^}|]*)[^}]*\}/g, "<b>$1</b>")
		.replace(/\{@i ([^}|]*)[^}]*\}/g, "<i>$1</i>")
		.replace(/\{@\w+ ([^}|]*)[^}]*\}/g, "$1")
		.replace(/\{@b ([^}]*)$/g, "<b>$1</b>");
}
function render(e) {
	if (e == null) return "";
	if (Array.isArray(e)) return e.map(render).join("");
	if (typeof e === "string") return `<p>${inline(e)}</p>`;
	switch (e.type) {
		case "list":
			return `<ul>${e.items.map(i => `<li>${typeof i === "string" ? inline(i) : render(i)}</li>`).join("")}</ul>`;
		case "quote":
			return `<blockquote>${render(e.entries)}</blockquote>`;
		case "reactionBlock":
			// 规则站有几个天赋给予的装备只留了空框，用 BLOCK_FILLS 补上
			if (!e.trigger && !(e.effect || []).join("").trim() && BLOCK_FILLS[e.name]) {
				const f = BLOCK_FILLS[e.name];
				return `<div class="blk"><div class="blk-h">${inline(e.translate_name || e.name)} <span class="muted">${f.meta}</span></div>${f.html}</div>`;
			}
			return `<div class="blk"><div class="blk-h">${inline(e.translate_name || e.name)} <span class="muted">${inline(e.action || "")}${e.frequency ? "，" + inline(e.frequency) : ""}</span></div>` +
				(e.trigger ? `<p><b>触发：</b>${inline(e.trigger)}</p>` : "") +
				(e.effect ? `<div><b>效果：</b>${render(e.effect)}</div>` : "") + `</div>`;
		case "actionBlock":
			return `<div class="blk"><div class="blk-h">${inline(e.translate_name || e.name)} <span class="muted">${inline(e.tag || "")}</span></div>${render(e.entries)}</div>`;
		case "table":
			return `<table class="dt">${e.colLabels && e.colLabels.length ? `<tr>${e.colLabels.map(c => `<th>${inline(c)}</th>`).join("")}</tr>` : ""}${e.rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</table>`;
		case "entries":
		case "section":
			return (e.translate_name ? `<h5>${inline(e.translate_name)}</h5>` : "") + render(e.entries);
		default:
			return e.entries ? render(e.entries) : "";
	}
}

// ---------- 规则站留空的天赋装备 ----------
// 规则站天赋页里，以下几个由天赋给予的装备只有标题、效果是空的。
// 效果文字尽量复用 source/i18n/zh 里同一装备的译文，没有的才在这里补译。
const i18nZh = f => JSON.parse(fs.readFileSync(path.join(ROOT, "source/i18n/zh", f + ".json"), "utf8"));
const zhW = i18nZh("weapons-2"), zhS = i18nZh("systems-2");
const p_ = s => `<p>${s}</p>`;
const AMMO_I = "<ul><li><b>重击弹</b>（1发）：这攻击得到<b>击退1</b>并造成<b>爆炸</b>伤害。</li><li><b>电击弹</b>（1发）：这攻击造成<b>能量</b>伤害。选择这次攻击的一个目标，无论命中与否，与其邻接的角色受到1点AP能量伤害。</li><li><b>磁轨弹</b>（1发）：这攻击得到<b>抛射</b>并造成<b>动能</b>伤害。</li></ul>";
const BLOCK_FILLS = {
	"Prototype Weapon": { meta: "主 特殊武器 · 威胁1 或 射程10 · 1d6+2 自选伤害类型 · 受限 1d6+2、杀绝", html: p_(zhW["mw_prototype_1.effect"]) },
	"Last Argument of Kings": { meta: "完整科技", html: p_("对感应范围内且在视线范围内的一个目标进行<b>科技攻击</b>。成功的话，你植入一个病毒，引发目标反应炉的小型熔解：目标立即受到等同其当前<b>热度</b>的<b>燃烧</b>。如果这动作使目标过热，它会在目标重置热度之前结算。") },
	"Fuel Rod Gun": { meta: "主 CQB · 射程3、威胁3 · 1d3+2 能量 · 受限3、独特", html: p_("<b>攻击时：</b>冷却4热度。") },
	"Servant-Class NHP": { meta: "AI、独特", html: p_(zhS["ms_technophile_1.effect"]) },
	"Student-Class NHP": { meta: "AI、独特", html: p_(zhS["ms_technophile_2.effect"]) },
	"Englihtenment-Class NHP": { meta: "AI、独特", html: p_(zhS["ms_technophile_3.effect"]) },
	"Ammo Case": { meta: "受限6、每回合1次", html: p_("每回合一次，当你以<b>主远距武器</b>攻击时，你可以按所列消耗来消耗发数，为该攻击套用以下其中一种效果：") + AMMO_I },
};

// ---------- 繁中覆盖层 ----------
const zh = { talents: {}, cb: {}, bg: {}, skills: {}, tags: {}, gear: {}, gms: {}, frames: {}, makers: {} };

for (const t of tw("talents").talents) {
	zh.talents[t.name] = {
		name: t.translate_name,
		desc: render(t.desc),
		ranks: t.ranks.map(r => ({ name: r.translate_name || r.name, html: render(r.entries) })),
	};
}
for (const c of tw("core-bonuses").core_bonuses) {
	zh.cb[c.name.replace(/’/g, "'")] = { name: c.translate_name, html: render(c.desc) };
}
for (const b of tw("backgrounds").backgrounds) {
	zh.bg[b.name.toLowerCase()] = { name: b.translate_name, triggers: inline(b.tag || ""), html: render(b.entries) };
}
for (const t of tw("tags").tags) {
	zh.tags[t.name.replace(/\bX\b/g, "{VAL}").toLowerCase()] = { name: t.translate_name, html: render(t.entries) };
}
for (const g of tw("gears").gears) {
	zh.gear[g.name] = { name: g.translate_name, html: render(g.entries) + render(g.desc) };
}
// 驾驶员武器/护甲（来自汇编表格）
Object.assign(zh.gear, {
	"Archaic Melee": { name: "古董肉搏" }, "Archaic Ranged": { name: "古董远距" },
	"Light A/C": { name: "轻A/C" }, "Medium A/C": { name: "中A/C" }, "Heavy A/C": { name: "重A/C" },
	"Light Signature": { name: "轻招牌武器" }, "Medium Signature": { name: "中招牌武器" }, "Heavy Signature": { name: "重招牌武器" },
	"Light Hardsuit": { name: "轻型卫士服" }, "Assault Hardsuit": { name: "突击卫士服" }, "Heavy Hardsuit": { name: "重型卫士服" },
	"Mobility Hardsuit": { name: "机动卫士服" }, "Stealth Hardsuit": { name: "匿迹卫士服" },
});

// 触发范例（第一章）
(function () {
	const s1 = tw("section-1-building-pilots-and-mechs");
	const walk = o => {
		if (Array.isArray(o)) return o.forEach(walk);
		if (!o || typeof o !== "object") return;
		if (o.name === "Example Triggers") {
			for (const e of o.entries) if (e && e.type === "entries") zh.skills[e.name.toLowerCase()] = { name: e.translate_name, html: render(e.entries) };
		}
		for (const k in o) walk(o[k]);
	};
	walk(s1.data);
})();

// GMS 武器/系统（汇编表格，按名称对应）
(function () {
	const comp = tw("section-4-compendium");
	const tables = {};
	const walk = (o, p) => {
		if (Array.isArray(o)) return o.forEach(x => walk(x, p));
		if (!o || typeof o !== "object") return;
		if (o.type === "table" && !tables[p]) tables[p] = o;
		for (const k in o) walk(o[k], o.name || p);
	};
	walk(comp.data, "");
	const wNames = ["Anti-Materiel Rifle", "Assault Rifle", "Charged Blade", "Cyclone Pulse Rifle", "Heavy Charged Blade", "Heavy Machine Gun", "Heavy Melee Weapon", "Howitzer", "Missile Rack", "Mortar", "Nexus (Hunter-Killer)", "Nexus (Light)", "Pistol", "Segment Knife", "Rocket-Propelled Grenade", "Shotgun", "Tactical Knife", "Tactical Melee Weapon", "Thermal Lance", "Thermal Pistol", "Thermal Rifle"];
	const sNames = ["COMP/CON-Class Assistant Unit", "Custom Paint Job", "Expanded Compartment", "Manipulators", "Pattern-A Smoke Charges", "Pattern-A Jericho Deployable Cover", "Pattern-B HEX Charges", "Personalizations", "Stable Structure", "Turret Drones", "Type-3 Projected Shield"];
	const fNames = ["EVA Module", "Rapid Burst Jump Jet System", "Type-I Flight System"];
	const strip = s => inline(s).replace(/<[^>]+>/g, "");
	tables["GMS Mech Weapons"].rows.forEach((r, i) => { zh.gms[wNames[i]] = { name: strip(r[0]) }; });
	tables["GMS General Market Systems"].rows.forEach((r, i) => { zh.gms[sNames[i]] = { name: strip(r[0]), html: `<p>${inline(r[2])}</p>` }; });
	tables["GMS Flight Systems"].rows.forEach((r, i) => { zh.gms[fNames[i]] = { name: strip(r[0]), html: `<p>${inline(r[2])}</p>` }; });
})();

Object.assign(zh.frames, {
	"Everest": "埃佛勒斯", "Blackbeard": "黑胡子", "Drake": "德瑞克", "Lancaster": "兰开斯特", "Nelson": "纳尔逊",
	"Raleigh": "雷利", "Tortuga": "托尔图加", "Vlad": "弗拉德", "Black Witch": "黑巫", "Death's Head": "骷髅天蛾",
	"Dusk Wing": "暮翼", "Metalmark": "蚬蝶", "Monarch": "帝王蝶", "Mourning Cloak": "黄缘蛱蝶", "Swallowtail": "凤蝶",
	"Balor": "巴罗尔", "Goblin": "哥布林", "Gorgon": "戈尔贡", "Hydra": "九头蛇", "Manticore": "蝎尾狮",
	"Minotaur": "米诺陶洛斯", "Pegasus": "飞马", "Barbarossa": "巴巴罗萨", "Genghis": "成吉思汗", "Iskander": "伊斯坎达尔",
	"Napoleon": "拿破仑", "Saladin": "萨拉丁", "Sherman": "谢尔曼", "Tokugawa": "德川",
});
Object.assign(zh.makers, { "GMS": "通用重型系统", "IPS-N": "极星船运", "SSC": "斯密—岛野财团", "HORUS": "荷鲁斯", "HA": "哈里逊兵工厂" });

// ---------- 数值数据（去掉不需要的字段以减小体积） ----------
const drop = (arr, keys) => arr.map(o => { const c = { ...o }; keys.forEach(k => delete c[k]); return c; });
const data = {
	rules: ld("rules"),
	manufacturers: ld("manufacturers").map(m => ({ id: m.id, name: m.name, color: m.dark })),
	frames: drop(ld("frames"), ["image_url", "y_pos"]),
	weapons: ld("weapons"),
	systems: ld("systems"),
	mods: ld("mods"),
	core_bonuses: ld("core_bonuses"),
	talents: ld("talents"),
	pilot_gear: ld("pilot_gear"),
	skills: ld("skills"),
	backgrounds: ld("backgrounds"),
	tags: ld("tags"),
	zh,
};
// 武器/系统/改装的背景描述界面上不显示，去掉以减小体积
for (const k of ["weapons", "systems", "mods"]) data[k] = drop(data[k], ["description"]);

// ---------- 合并自译中文（source/i18n/zh，键为「id.字段路径」） ----------
(function () {
	const dir = path.join(ROOT, "source/i18n");
	const files = fs.readdirSync(path.join(dir, "en")).map(f => f.replace(".json", ""));
	const load = (lang, f) => { const p = path.join(dir, lang, f + ".json"); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : {}; };
	const pairs = files.map(f => [load("en", f), load("zh", f)]);
	// 英文原文相同的条目共用同一译文
	const same = {};
	for (const [en, zhf] of pairs) for (const k in zhf) if (en[k]) same[en[k]] = zhf[k];

	const byId = {};
	for (const k of ["frames", "weapons", "systems", "mods", "tags", "skills", "talents", "pilot_gear"]) data[k].forEach(o => { byId[o.id] = o; });
	const ids = Object.keys(byId).sort((a, b) => b.length - a.length); // id 本身可能含「.」，取最长前缀
	let n = 0, miss = 0;
	for (const [en, zhf] of pairs) for (const key in en) {
		const val = key in zhf ? zhf[key] : same[en[key]];
		if (val == null) { miss++; continue; }
		const id = ids.find(i => key.startsWith(i + "."));
		const ks = key.slice(id.length + 1).split(".");
		let o = byId[id];
		for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
		o[ks[ks.length - 1]] = val;
		n++;
	}
	// 埃佛勒斯的介绍直接用规则站译文
	const ev = tw("mechs").mechs.find(m => m.name === "Everest");
	if (ev) { byId["mf_standard_pattern_i_everest"].description = render(ev.desc); n++; }
	console.log("i18n applied:", n, "missing:", miss);
})();

const out = "// 自动生成，请勿手改。来源：massif-press/lancer-data + reno-lam.github.io/Lancer-Free-Version\nwindow.LANCER_DATA = " + JSON.stringify(data) + ";\n";
fs.writeFileSync(path.join(ROOT, "data.js"), out);
console.log("data.js written,", (out.length / 1024).toFixed(0), "KB");
console.log("zh coverage:", Object.fromEntries(Object.entries(zh).map(([k, v]) => [k, Object.keys(v).length])));
