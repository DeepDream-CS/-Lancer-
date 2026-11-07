"use strict";
// 检查 Foundry 模组「LANCER 中文」（tools/build-fvtt-module.js）：
// - 译文覆盖系统 lang/en.json 的全部键，占位符与 HTML 一致，术语与车卡器一致
// - 清单：语言代码 cn、只对 LANCER 系统生效、脚本与清单链接
// - 骨架插图脚本：在模拟的 Foundry 环境中运行两个钩子
// - dist 中的模组文件是最新构建结果
// 用法：node tools/test-fvtt-module.js

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const zlib = require("zlib");
const { build, flatten } = require("./build-fvtt-module");

const ROOT = path.join(__dirname, "..");
let failures = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { failures++; console.error("✗ " + msg); } };

const { files, problems, manifest, art, lang, en, cn, hc, snapshot, hardcoded, reference } = build();
const file = name => files.find(f => f[0] === name)?.[1];

// ---- 译文
ok(problems.length === 0, "译文问题：\n  " + problems.join("\n  "));
const flatLang = flatten(lang);
ok(Object.keys(flatLang).length === Object.keys(flatten(en)).length, "生成的 lang/cn.json 键数应与英文相同");
const CJK = /[㐀-鿿]/;
const allowLatin = /^(NPC|HP|LL|SP|RPV|IPS-N|SSC|FADE斗篷|LANCER.*|默认：#[0-9a-f]+|.*\{.*\}.*|\/\/.*)$/;
for (const [k, v] of Object.entries(cn)) if (!CJK.test(v)) ok(allowLatin.test(v), `${k} 没有中文：${v}`);
// 与车卡器不一致的写法（同 test-lcp.js 的补译检查）
const TERMS = [[/精准/, "准度"], [/会心(?!一击|伤害)|暴击/, "会心一击 / 会心"], [/闪避/, "回避"], [/生命值/, "HP"], [/维修值/, "维修"],
	[/躲藏状态/, "匿迹"], [/干扰(?!信号)/, "受扰"], [/免费动作/, "自由动作"], [/核心加成/, "核心奖励"], [/超量护盾/, "护盾"], [/过载/, "超频"]];
for (const [k, v] of Object.entries(cn)) for (const [re, to] of TERMS) if (re !== TERMS[1][0] || !/attack\.crit$/.test(k)) ok(!re.test(v), `${k}：「${v.match(re)?.[0]}」应写作「${to}」`);
const expect = {
	"TYPES.Item.frame": "骨架", "TYPES.Item.core_bonus": "核心奖励", "TYPES.Item.license": "牌照",
	"lancer.common-sheet.shortStats.grit": "毅力", "lancer.common-sheet.shortStats.evasion": "回避",
	"lancer.common-sheet.shortStats.overcharge": "超频", "lancer.statusIconsNames.jammed": "受扰",
	"lancer.statusIconsNames.hidden": "匿迹", "lancer.statusIconsNames.shredded": "离散", "lancer.statusIconsNames.dangerzone": "超温危域",
	"lancer.tables.structure.title.glancing": "擦身而过", "lancer.tables.overheat.title.meltdown": "炉心熔解",
	"lancer.statusIconsNames.trueblack": "真黑神盾", "lancer.statusIconsNames.camus_razor": "加缪之锋",
};
for (const [k, v] of Object.entries(expect)) ok(cn[k] === v, `${k} 应为「${v}」，实际「${cn[k]}」`);
ok(cn["lancer.chat-card.title.defense-hit"].includes("{defense}"), "占位符 {defense} 应保留");
ok(/@LancerID\[stunned\]/.test(cn["lancer.tables.structure.description.direct.2"]), "@LancerID 引用应保留");

// ---- 清单
ok(manifest.id === "lancer-cn" && /^\d+\.\d+\.\d+$/.test(manifest.version), "清单 id / 版本");
const lng = manifest.languages?.[0];
ok(lng && lng.lang === "cn" && lng.system === "lancer" && lng.path === "lang/cn.json", "语言应为 cn，只对 lancer 系统生效（与 foundry_chn 使用同一代码）");
ok(manifest.relationships?.systems?.some(s => s.id === "lancer"), "清单应声明依赖 lancer 系统");
ok(manifest.esmodules?.every(s => file(s)), "esmodules 中的脚本都应打包");
ok(manifest.manifest?.endsWith("/dist/fvtt/lancer-cn/module.json") && manifest.download?.endsWith("/dist/fvtt/lancer-cn.zip"), "清单链接应指向 dist/fvtt 下的模组文件");
ok(String(manifest.compatibility?.minimum) === "13", "兼容 Foundry v13");

// ---- 骨架插图表
ok(Object.keys(art).length >= 60, `骨架插图应覆盖官方骨架（实际 ${Object.keys(art).length}）`);
ok(Object.values(art).every(p => /^systems\/lancer\/assets\/retrograde-minis\/[^"]+\.png$/.test(p)), "插图路径应指向系统自带的 Retrograde Minis");
const forkAssets = path.join(ROOT, "..", "foundryvtt-lancer", "public", "assets", "retrograde-minis");
if (fs.existsSync(forkAssets)) for (const p of new Set(Object.values(art))) ok(fs.existsSync(path.join(forkAssets, path.basename(p))), `插图文件不存在：${p}`);
for (const [id, name] of [["mf_monarch", "MONARCH"], ["mf_standard_pattern_i_everest", "GMS"], ["mf_chomolungma", "GMS"], ["mf_ext_nemo", "NELSON"], ["mf_sunzi", "SUNZI"]])
	ok(art[id]?.includes(name), `${id} 的插图应为 ${name}`);
ok(!art.mf_ext_hubble, "没有官方插图的扩展骨架不应分配插图");

// ---- 钩子脚本：模拟 Foundry
const script = file("scripts/lancer-cn.mjs");
ok(script && !script.includes("/*FRAME_ART*/"), "插图表应已写入脚本");
let ctx;
function runHooks() {
	const hooks = {};
	ctx = {
		Hooks: { on: (n, fn) => { hooks[n] = fn; }, once: (n, fn) => { hooks["once:" + n] = fn; } },
		game: { user: { id: "u1" } },
		foundry: { utils: { hasProperty: (o, p) => p.split(".").reduce((x, k) => (x && k in x ? x[k] : undefined), o) !== undefined } },
		MutationObserver: class { observe() {} },
	};
	vm.createContext(ctx);
	vm.runInContext(script, ctx);
	return hooks;
}
const hooks = runHooks();
ok(typeof hooks.preCreateItem === "function" && typeof hooks.updateActor === "function", "脚本应注册 preCreateItem 与 updateActor");
ok(typeof hooks["once:i18nInit"] === "function", "脚本应在 i18nInit 时启用写死英文的翻译");

// ---- 写死的英文（模板与代码中不经语言文件的文字）
ok(!script.includes("/*HARDCODED*/"), "写死英文的词典应已写入脚本");
const hcText = hc.text;
const translated = Object.values(hcText).filter(v => v !== null).length;
ok(Object.keys(snapshot).length >= 600, `扫描快照应覆盖模板与代码中的写死英文（实际 ${Object.keys(snapshot).length} 条）`);
ok(translated / Object.keys(snapshot).length > 0.85, `大部分写死英文应有译文（实际 ${translated} / ${Object.keys(snapshot).length}）`);
const hcValues = [];
for (const [k, v] of Object.entries(hcText)) {
	if (v === null) continue;
	if (typeof v === "string") hcValues.push([k, v]);
	else for (const [pk, pv] of Object.entries(v.pieces)) hcValues.push([pk, pv]);
}
for (const sel of Object.values(hc.context)) for (const [k, v] of Object.entries(sel)) hcValues.push([k, v]);
const latinOk = /^(|HP|ID：?|LID：?|SP|\{x\} SP|Lancer Initiative|Powered by Lancer|\{x\}\{x\} HP)$/;
// 「精准」是 Accurate 标签在车卡器中的名称，不是准度（Accuracy）
const TAG_NAMES = new Set(["Accurate (+1)"]);
for (const [k, v] of hcValues) {
	if (!CJK.test(v)) ok(latinOk.test(v), `写死英文「${k}」的译文没有中文：${v}`);
	for (const [re, to] of TERMS) if (!(TAG_NAMES.has(k) && re === TERMS[0][0])) ok(!re.test(v), `写死英文「${k}」：「${v.match(re)?.[0]}」应写作「${to}」`);
}
const words = hardcoded.words;
for (const [k, v] of Object.entries(words)) for (const [re, to] of TERMS) ok(!re.test(v), `枚举词 ${k}：「${v.match(re)?.[0]}」应写作「${to}」`);
const tr = ctx.LancerCN.translate;
const cases = [
	["MAIN/AUX", "主/副"], ["  MAIN RIFLE\n ", "主步枪"], ["Quick Tech", "快速科技"], ["USE QUICK TECH", "使用快速科技"],
	["Size 2", "大小 2"], ["Weapon 雷霆炮 is not loaded!", "武器雷霆炮未装填！"], ["Main/Aux Weapon Mount", "主/副武器挂载点"],
	["雷霆炮 // MAIN CANNON", "雷霆炮 // 主大炮"], ["攻击 - QUICK", "攻击 - 快速动作"],
	["Raven took 5", "Raven受到 5"], ["Raven took 0 damage!", "Raven受到 0 点伤害！"], ["(8 total) damage!", "（共 8）点伤害！"],
	["-5 HP", "-5 HP"], ["+2 Heat", "+2 热度"], ["-1 Overshield", "-1 护盾"],
	["TIER 2 突击 :: 精英", "等阶 2 突击 :: 精英"], ["Raven has taken structure damage!", "Raven受到了结构伤害！"],
	["Raven has taken reactor damage!", "Raven受到了压力伤害！"], ["A pilot can't be stabilized!", "驾驶员无法稳住阵脚！"],
	["IMPORT 机甲 FOR 玩家?", "要为玩家导入机甲吗？"], ["// Quick TECH ATTACK //", "// 快速科技攻击 //"], ["// TECH //", "// 科技 //"],
	["Main Rifle // 突击 Class Feature", "主步枪 // 突击职业特性"], ["Insert Heavy weapon", "装入重型武器"],
	["Are you sure you want to fully repair the mech \"Raven\"?", "确定要全面维修机甲“Raven”吗？"],
	["The", ""], ["Armor", "护甲"], ["E-DEF", "电子防御"], ["Stunned", "晕眩"],
];
for (const [s, want] of cases) { const got = tr(s); ok(got === want, `translate(${JSON.stringify(s)}) 应为 ${JSON.stringify(want)}，实际 ${JSON.stringify(got)}`); }
for (const s of ["Raven", "Bandana", "Damage roll button not in chat message", "伤害", "My custom note about the fight", "Raven took", "12", ""])
	ok(tr(s) === null, `${JSON.stringify(s)} 不应翻译，实际 ${JSON.stringify(tr(s))}`);
ok(tr("Armor", { closest: sel => (sel === ".scan-stat-item" ? {} : null) }) === "装甲", "扫描卡中的 Armor 是装甲数值");
// 长句式优先：「{x} took {x} damage!」先于「{x} took {x}」
const pat = hardcoded.patterns.map(p => p[0]);
ok(pat.indexOf("{x} took {x} damage!") < pat.indexOf("{x} took {x}"), "句式应按固定文字由长到短排列");
const mkItem = (type, lid, img) => { const it = { type, img, system: { lid }, updated: null }; it.updateSource = d => { it.updated = d; }; return it; };
let it = mkItem("frame", "mf_monarch", "systems/lancer/assets/icons/frame.svg"); hooks.preCreateItem(it);
ok(it.updated?.img === art.mf_monarch, "新建骨架条目时应补上插图");
it = mkItem("frame", "mf_monarch", "worlds/my/art.png"); hooks.preCreateItem(it);
ok(!it.updated, "自定义图片不应被替换");
it = mkItem("mech_weapon", "mf_monarch", ""); hooks.preCreateItem(it);
ok(!it.updated, "非骨架条目不处理");
it = mkItem("frame", "mf_ext_hubble", ""); hooks.preCreateItem(it);
ok(!it.updated, "没有插图的骨架不处理");
const mkActor = (img, token, lid = "mf_monarch") => {
	const frame = { type: "frame", system: { lid } };
	const a = { type: "mech", img, prototypeToken: { texture: { src: token } }, system: { loadout: { frame: { value: frame } } }, items: [frame], calls: [] };
	a.items.find = fn => [frame].find(fn);
	a.update = async d => { a.calls.push(d); };
	return a;
};
(async () => {
	let a = mkActor("systems/lancer/assets/icons/mech.svg", "systems/lancer/assets/icons/mech.svg");
	await hooks.updateActor(a, { system: { loadout: { frame: "abc" } } }, {}, "u1");
	ok(a.calls[0]?.img === art.mf_monarch && a.calls[0]["prototypeToken.texture.src"] === art.mf_monarch, "换骨架后应设置机甲头像与指示物图片");
	a = mkActor("worlds/my/mech.png", "systems/lancer/assets/icons/mech.svg");
	await hooks.updateActor(a, { system: { loadout: { frame: "abc" } } }, {}, "u1");
	ok(a.calls[0] && !("img" in a.calls[0]) && a.calls[0]["prototypeToken.texture.src"] === art.mf_monarch, "自定义头像不替换，默认指示物图片仍替换");
	a = mkActor("systems/lancer/assets/icons/mech.svg", "systems/lancer/assets/icons/mech.svg");
	await hooks.updateActor(a, { system: { loadout: { frame: "abc" } } }, {}, "someone-else");
	ok(a.calls.length === 0, "只由发起更新的客户端处理");
	await hooks.updateActor(a, { name: "x" }, {}, "u1");
	ok(a.calls.length === 0, "没有更换骨架的更新不处理");
	a = mkActor(art.mf_monarch, art.mf_monarch);
	await hooks.updateActor(a, { system: { loadout: { frame: "abc" } } }, {}, "u1");
	ok(a.calls.length === 0, "已是正确插图时不重复更新（避免更新循环）");

	// ---- 车卡器资料（专业牌照、扩展厂商、骨架牌照改名）：模拟 Foundry 合集包
	ok(!script.includes("/*REFERENCE*/"), "车卡器资料应已写入脚本");
	ok(reference.professional.length === 21 && reference.professional.every(p => p.items.length === 2), "21 张专业牌照，各有两件装备");
	ok(reference.professional.every(p => p.items.every(it => it.level === p.rank)), "专业牌照装备等级应等于牌照等级");
	ok(reference.makers.map(m => m.id).sort().join() === "C&H,K/KCA,PI-OF" && reference.makers.every(m => m.description && m.frames.length), "扩展厂商：C&H、K/KCA、PI-OF，含说明与骨架");
	ok(reference.rules.length >= 3 && reference.rules.every(r => CJK.test(r)), "专业牌照规则说明");
	const log = { create: [], update: [], jcreate: [], jdelete: [], notes: [], menus: [] };
	const mkPack = (collection, index, extra = {}) => ({
		collection, locked: false, index, docs: [],
		folders: { find: fn => (extra.folders || []).find(fn) },
		getIndex: async () => index.map(e => ({ ...e })),
		async getDocuments() { return this.docs; },
		async configure(c) { this.locked = c.locked; },
	});
	const pilotItems = mkPack("world.pilot-items", [
		{ _id: "L1", type: "license", name: "MONARCH", system: { lid: "lic_mf_monarch", key: "mf_monarch" } },
		{ _id: "L2", type: "license", name: "旧名", system: { lid: "lic_pl_ips_vanguard", key: "pl_ips_vanguard" } },
		{ _id: "S1", type: "skill", name: "技能", system: { lid: "sk_x" } },
	], { folders: [{ id: "FOLD", getFlag: (s, k) => (s === "lancer" && k === "entrytype" ? "license" : undefined) }] });
	const mechItems = mkPack("world.mech-items", [
		{ _id: "F1", type: "frame", name: "金斑蝶", system: { lid: "mf_monarch" } },
		{ _id: "W1", type: "mech_weapon", name: "弹道臂盾", system: { lid: "mw_pl_buckler" } },
	]);
	const packs = new Map([["world.pilot-items", pilotItems], ["world.mech-items", mechItems]]);
	let journalPack = null;
	Object.assign(ctx, {
		game: { user: { id: "u1", isGM: true }, system: { id: "lancer" }, packs, settings: { registerMenu: (m, k, cfg) => log.menus.push({ m, k, cfg }) } },
		ui: { notifications: { info: s => log.notes.push(["info", s]), warn: s => log.notes.push(["warn", s]), error: s => log.notes.push(["error", s]) } },
		CONFIG: {
			Item: { documentClass: { createDocuments: async (a, o) => log.create.push({ a, o }), updateDocuments: async (a, o) => log.update.push({ a, o }) } },
			JournalEntry: { documentClass: { createDocuments: async (a, o) => log.jcreate.push({ a, o }), deleteDocuments: async (a, o) => log.jdelete.push({ a, o }) } },
		},
		foundry: { ...ctx.foundry, documents: { collections: { CompendiumCollection: { createCompendium: async meta => { journalPack = mkPack(`world.${meta.name}`, []); journalPack.meta = meta; packs.set(journalPack.collection, journalPack); return journalPack; } } } } },
	});
	hooks["once:init"]();
	ok(log.menus.length === 1 && log.menus[0].m === "lancer-cn" && log.menus[0].cfg.restricted && typeof log.menus[0].cfg.type === "function", "应注册仅 GM 可用的「导入车卡器资料」设置按钮");
	const importReference = ctx.LancerCN.importReference;
	ctx.game.user.isGM = false;
	await importReference();
	ok(log.create.length === 0 && log.notes.at(-1)?.[0] === "warn", "非 GM 不能导入");
	ctx.game.user.isGM = true;
	const res = await importReference();
	const created = log.create[0]?.a || [];
	const updated = log.update[0]?.a || [];
	ok(res && created.length === 20 && created.every(d => d.type === "license" && d.folder === "FOLD" && d.system.key.startsWith("pl_") && d.system.lid === `lic_${d.system.key}`), "应新建 20 张专业牌照（另一张已存在），放进牌照文件夹");
	ok(log.create[0]?.o.pack === "world.pilot-items", "专业牌照写入驾驶员物品合集包");
	const micro = created.find(d => d.system.key === "pl_ssc_micro_monarch");
	ok(micro?.name === "微型金斑蝶" && micro.system.curr_rank === 2 && micro.system.manufacturer === "SSC", "专业牌照的名称、等级与厂商");
	ok(updated.some(u => u._id === "L2" && u.name === "先遣兵"), "已存在的专业牌照按 lid 更新");
	ok(updated.some(u => u._id === "L1" && u.name === "金斑蝶"), "英文骨架牌照改为骨架的中文名");
	ok(!updated.some(u => u._id === "S1"), "非牌照条目不改");
	ok(journalPack?.meta.type === "JournalEntry" && journalPack.meta.label === "车卡器资料", "应建立「车卡器资料」日志合集包");
	const journals = log.jcreate[0]?.a || [];
	const pro = journals.find(j => j.name === "专业牌照");
	const makers = journals.find(j => j.name === "扩展厂商");
	ok(pro?.pages.length === 22 && makers?.pages.length === 3, "日志：专业牌照（规则说明 + 21 页）、扩展厂商（3 页）");
	const vanguard = pro?.pages.find(p => p.name.startsWith("先遣兵"));
	ok(vanguard?.text.content.includes("@UUID[Compendium.world.mech-items.Item.W1]{弹道臂盾}"), "牌照页的装备链接到合集包中的条目");
	ok(vanguard?.text.content.includes("先遣兵 I") && /<b>厂商<\/b>：IPS-N/.test(vanguard?.text.content), "牌照页列出厂商与等级");
	ok(makers?.pages.every(p => p.text.content.includes("<h2>骨架牌照</h2>")), "厂商页列出骨架");
	// 再运行一次：删除模组旧日志后重建，不重复建合集包
	journalPack.docs = journals.map((j, i) => ({ id: "J" + i, getFlag: (m, k) => (m === "lancer-cn" && k === "key" ? j.flags["lancer-cn"].key : undefined) }));
	const compendiumBefore = journalPack;
	await importReference();
	ok(log.jdelete[0]?.a.join() === "J0,J1" && journalPack === compendiumBefore, "重复运行时替换模组生成的日志");
	packs.delete("world.mech-items");
	const n = log.create.length;
	await importReference();
	ok(log.create.length === n && /内容包/.test(log.notes.at(-1)?.[1]), "没有导入内容包时提示先导入");

	// ---- zip 与 dist
	const zipPath = path.join(ROOT, "dist/fvtt/lancer-cn.zip");
	ok(fs.existsSync(zipPath), "缺少 dist/fvtt/lancer-cn.zip，请运行 node tools/build-fvtt-module.js");
	if (fs.existsSync(zipPath)) {
		const buf = fs.readFileSync(zipPath);
		const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
		const names = [];
		let p = buf.readUInt32LE(eocd + 16);
		for (let i = 0; i < buf.readUInt16LE(eocd + 10); i++) {
			const nlen = buf.readUInt16LE(p + 28), off = buf.readUInt32LE(p + 42), csize = buf.readUInt32LE(p + 20);
			const name = buf.slice(p + 46, p + 46 + nlen).toString("utf8");
			const lnlen = buf.readUInt16LE(off + 26), lxlen = buf.readUInt16LE(off + 28);
			const data = zlib.inflateRawSync(buf.slice(off + 30 + lnlen + lxlen, off + 30 + lnlen + lxlen + csize)).toString("utf8");
			names.push(name);
			ok(data === file(name), `zip 中的 ${name} 不是最新构建结果，请重新运行 node tools/build-fvtt-module.js`);
			p += 46 + nlen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
		}
		ok(names.includes("module.json") && names.includes("lang/cn.json"), "zip 根目录应有 module.json 与 lang/cn.json");
	}
	for (const [name, text] of files) {
		const f = path.join(ROOT, "dist/fvtt/lancer-cn", name);
		ok(fs.existsSync(f) && fs.readFileSync(f, "utf8") === text, `dist/fvtt/lancer-cn/${name} 不是最新构建结果`);
	}
	console.log(`test-fvtt-module：${checks} 项检查，${failures ? failures + " 项失败" : "全部通过"}（译文 ${Object.keys(cn).length} 条，骨架插图 ${Object.keys(art).length} 个）`);
	process.exitCode = failures ? 1 : 0;
})();
