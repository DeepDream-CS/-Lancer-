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
// 中文界面的版面修正（2026-11-09 用户截图：伤害面板目标卡）
ok(/injectStyle\("lancer-cn-ui-fix", UI_FIX_STYLE\)/.test(script), "中文界面启用时注入版面修正样式");
ok(/\.damage-input-container \{ grid-template-columns: min-content minmax\(4em, 4\.8em\) minmax\(4em, 1fr\)/.test(script), "伤害类型下拉框不再固定 12ch，数值框至少 4em");
ok(/\.lancer-hit-quality-radio-label \{ white-space: nowrap; \}/.test(script), "会心 / 命中 / 未命中不换行");
ok(script.includes('"\\u{1F782}": "▸", "\\u{1F780}": "◂"'), "目标名两侧的 🞂 / 🞀 换成常见字形 ▸ / ◂（中文字体没有原字形，显示成方框）");
let ctx;
function runHooks() {
	const hooks = {};
	ctx = {
		Hooks: { on: (n, fn) => { hooks[n] = fn; }, once: (n, fn) => { const k = "once:" + n; const prev = hooks[k]; hooks[k] = prev ? (...a) => { prev(...a); return fn(...a); } : fn; } },
		game: { user: { id: "u1" } },
		foundry: { utils: { hasProperty: (o, p) => p.split(".").reduce((x, k) => (x && k in x ? x[k] : undefined), o) !== undefined } },
		MutationObserver: class { observe() {} },
		// window 级监听（六边形墙体 / 掩护格的涂画）
		windowListeners: {},
		addEventListener(type, fn, opts) { (ctx.windowListeners[type] ||= []).push({ fn, opts }); },
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
// 伤害面板的命中选项「Crit」与语言文件的 CRIT 同样简写为「会心」
const SHORT_CRIT = new Set(["Crit"]);
for (const [k, v] of hcValues) {
	if (!CJK.test(v)) ok(latinOk.test(v), `写死英文「${k}」的译文没有中文：${v}`);
	for (const [re, to] of TERMS) if (!(TAG_NAMES.has(k) && re === TERMS[0][0]) && !(SHORT_CRIT.has(k) && re === TERMS[1][0])) ok(!re.test(v), `写死英文「${k}」：「${v.match(re)?.[0]}」应写作「${to}」`);
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
	["Main Rifle // 突击 Class Feature", "主步枪 // 突击职业特性"], ["Main Cannon // 工业机甲 Template Feature", "主大炮 // 工业机甲模板特性"], ["Insert Heavy weapon", "装入重型武器"],
	["Are you sure you want to fully repair the mech \"Raven\"?", "确定要全面维修机甲“Raven”吗？"],
	["The", ""], ["Armor", "护甲"], ["E-DEF", "电子防御"], ["Stunned", "晕眩"],
	["// Weapon Destruction //", "// 武器摧毁 //"],
	["// System Destruction //", "// 系统摧毁 //"],
	["// Equipment Destruction //", "// 装备摧毁 //"],
	["// FULL REPAIR //", "// 全面维修 //"],
	["// 埃弗勒斯 HAS STABILIZED //", "// 埃弗勒斯已稳住阵脚 //"],
	["// 埃弗勒斯 is OVERCHARGING //", "// 埃弗勒斯正在超频 //"],
	["// 攻击 VS EVASION //", "// 攻击 VS 回避 //"],
	["// 攻击 VS E-DEF //", "// 攻击 VS 电子防御 //"],
	["Structure Damage -- 埃弗勒斯", "结构伤害 -- 埃弗勒斯"],
	["Stress Damage -- 埃弗勒斯", "压力伤害 -- 埃弗勒斯"],
	["Burn Damage -- 埃弗勒斯", "燃烧伤害 -- 埃弗勒斯"],
	["HULL -- 埃弗勒斯", "机体 -- 埃弗勒斯"],
	["BURN :: ENG -- 埃弗勒斯", "燃烧 :: 工程 -- 埃弗勒斯"],
	["The shackles remain intact, for now.", "枷锁暂时完好无损。"],
	["MY SHACKLES LOOSE, MY CHAINS UNBOUND!", "吾之枷锁已松，吾之锁链已断！"],
	["OUR SHACKLES LOOSE, OUR CHAINS UNBOUND!", "吾等枷锁已松，吾等锁链已断！"],
	["Impaired", "受损"], ["IMPAIRED", "受损"], ["STUNNED", "晕眩"], ["EXPOSED", "暴露"],
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
	const log = { create: [], update: [], jcreate: [], jdelete: [], notes: [], menus: [], settings: {}, settingValues: {} };
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
		game: { user: { id: "u1", isGM: true }, system: { id: "lancer" }, packs, settings: { registerMenu: (m, k, cfg) => log.menus.push({ m, k, cfg }), register: (m, k, cfg) => { log.settings[`${m}.${k}`] = cfg; }, get: (m, k) => log.settingValues[`${m}.${k}`] ?? log.settings[`${m}.${k}`]?.default } },
		ui: { notifications: { info: s => log.notes.push(["info", s]), warn: s => log.notes.push(["warn", s]), error: s => log.notes.push(["error", s]) } },
		CONFIG: {
			Item: { documentClass: { createDocuments: async (a, o) => log.create.push({ a, o }), updateDocuments: async (a, o) => log.update.push({ a, o }) } },
			JournalEntry: { documentClass: { createDocuments: async (a, o) => log.jcreate.push({ a, o }), deleteDocuments: async (a, o) => log.jdelete.push({ a, o }) } },
		},
		foundry: { ...ctx.foundry, documents: { collections: { CompendiumCollection: { createCompendium: async meta => { journalPack = mkPack(`world.${meta.name}`, []); journalPack.meta = meta; packs.set(journalPack.collection, journalPack); return journalPack; } } } } },
	});
	hooks["once:init"]();
	ok(log.menus.length === 2 && log.menus.map(m => m.k).sort().join(",") === "importBattleMap,importReference" && log.menus.every(m => m.m === "lancer-cn" && m.cfg.restricted && typeof m.cfg.type === "function"), "应注册仅 GM 可用的「导入车卡器资料」与「导入车卡器地图」设置按钮");
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

	// ---- 掩护区与危险地形（区域行为）：模拟 Foundry 的 RegionBehaviorType 与区域事件
	ok(manifest.documentTypes?.RegionBehavior?.cover && typeof manifest.documentTypes.RegionBehavior.cover === "object", "清单应声明区域行为子类型 cover（lancer-cn.cover）");
	ok(manifest.documentTypes?.RegionBehavior?.dangerous && typeof manifest.documentTypes.RegionBehavior.dangerous === "object", "清单应声明区域行为子类型 dangerous（lancer-cn.dangerous）");
	{
		class FakeField { constructor(o) { Object.assign(this, o); } }
		Object.assign(ctx, {
			CONST: { REGION_EVENTS: { TOKEN_ENTER: "tokenEnter", TOKEN_EXIT: "tokenExit", TOKEN_MOVE_IN: "tokenMoveIn", TOKEN_TURN_END: "tokenTurnEnd", BEHAVIOR_ACTIVATED: "behaviorActivated", BEHAVIOR_DEACTIVATED: "behaviorDeactivated" } },
			foundry: { ...ctx.foundry, data: { fields: { StringField: FakeField, NumberField: FakeField }, regionBehaviors: { RegionBehaviorType: class {} } } },
		});
		ctx.CONFIG.RegionBehavior = { dataModels: {}, typeIcons: {}, typeLabels: {} };
		hooks["once:init"]();
		const Behavior = ctx.CONFIG.RegionBehavior.dataModels["lancer-cn.cover"];
		const Dangerous = ctx.CONFIG.RegionBehavior.dataModels["lancer-cn.dangerous"];
		ok(typeof Behavior === "function" && typeof Dangerous === "function", "init 时应注册区域行为 lancer-cn.cover 与 lancer-cn.dangerous");
		ok(ctx.CONFIG.RegionBehavior.typeIcons["lancer-cn.cover"] && ctx.CONFIG.RegionBehavior.typeIcons["lancer-cn.dangerous"], "区域行为应有图标");
		// 显示名：Foundry 按语言键 TYPES.RegionBehavior.lancer-cn.<type> 逐层查找；当前语言与英文后备都要有
		const setProperty = (o, key, v) => { const ks = key.split("."); let x = o; for (const k of ks.slice(0, -1)) x = x[k] ??= {}; x[ks.at(-1)] = v; };
		ctx.game.i18n = { lang: "en", translations: {}, _fallback: {} };
		ctx.foundry.utils = { ...ctx.foundry.utils, setProperty };
		hooks["once:i18nInit"]();
		const label = t => t?.TYPES?.RegionBehavior?.["lancer-cn"]?.cover;
		const dLabel = t => t?.TYPES?.RegionBehavior?.["lancer-cn"]?.dangerous;
		ok(label(ctx.game.i18n.translations) === "LANCER 掩护区" && label(ctx.game.i18n._fallback) === "LANCER 掩护区", "区域行为类型的中文名应写入语言键 TYPES.RegionBehavior.lancer-cn.cover");
		ok(dLabel(ctx.game.i18n.translations) === "LANCER 危险地形" && dLabel(ctx.game.i18n._fallback) === "LANCER 危险地形", "危险地形中文名应写入语言键 TYPES.RegionBehavior.lancer-cn.dangerous");
		const schema = Behavior.defineSchema();
		ok(schema.cover && Object.keys(schema.cover.choices).join() === "soft,hard" && schema.cover.initial === "soft", "掩护区可选软性 / 硬性，默认软性");
		const dSchema = Dangerous.defineSchema();
		ok(dSchema.damage?.initial === 5 && dSchema.damageType?.initial === "Kinetic" && Object.keys(dSchema.damageType.choices).join() === "Kinetic,Energy,Explosive,Burn,Heat", "危险地形默认 5 点动能伤害，可选动能 / 能量 / 爆炸 / 燃烧 / 热度");
		const mkActor = () => { const a = { statuses: new Set(), calls: 0 }; a.toggleStatusEffect = async (id, { active }) => { a.calls++; if (active) a.statuses.add(id); else a.statuses.delete(id); }; return a; };
		const mkRegion = (cover, disabled = false) => ({ behaviors: [{ type: "lancer-cn.cover", disabled, system: { cover } }], tokens: [] });
		const me = { isSelf: true }, other = { isSelf: false };
		const ev = (name, token, region, user = me) => Behavior.events[name].call({ region }, { name, data: { token }, region, user });
		const soft = mkRegion("soft"), hard = mkRegion("hard"), off = mkRegion("hard", true);
		const actor = mkActor();
		const tok = { actor, regions: new Set() };
		// 进入软性掩护区（事件触发时 token.regions 可能尚未更新，用 include 补上）
		await ev("tokenEnter", tok, soft);
		ok(actor.statuses.has("cover_soft") && !actor.statuses.has("cover_hard"), "进入软性掩护区：获得软性掩护");
		tok.regions.add(soft);
		await ev("tokenEnter", tok, hard);
		tok.regions.add(hard);
		ok(actor.statuses.has("cover_hard") && !actor.statuses.has("cover_soft"), "同时在软性与硬性掩护区：取硬性掩护");
		await ev("tokenExit", tok, hard);
		tok.regions.delete(hard);
		ok(actor.statuses.has("cover_soft") && !actor.statuses.has("cover_hard"), "离开硬性区、仍在软性区：改回软性掩护");
		await ev("tokenExit", tok, soft);
		tok.regions.delete(soft);
		ok(!actor.statuses.has("cover_soft") && !actor.statuses.has("cover_hard"), "离开全部掩护区：去掉掩护");
		const calls = actor.calls;
		await ev("tokenEnter", tok, soft, other);
		ok(actor.calls === calls && !actor.statuses.size, "其他客户端收到的事件不处理（避免重复更新）");
		tok.regions.add(off);
		await ev("tokenEnter", tok, soft);
		ok(actor.statuses.has("cover_soft") && !actor.statuses.has("cover_hard"), "停用的掩护区不计入");
		const before = actor.calls;
		await ev("tokenEnter", tok, soft);
		ok(actor.calls === before, "状态已正确时不重复切换");
		// 画好区域 / 启用行为：区域里已有的指示物
		const a2 = mkActor(), a3 = mkActor();
		const t2 = { actor: a2, regions: new Set() }, t3 = { actor: a3, regions: new Set() };
		hard.tokens = [t2, t3];
		await ev("behaviorActivated", null, hard);
		ok(a2.statuses.has("cover_hard") && a3.statuses.has("cover_hard"), "启用掩护区时，区域内已有的指示物获得掩护");
		t2.regions.add(hard); t3.regions.add(hard);
		await ev("behaviorDeactivated", null, hard);
		ok(!a2.statuses.size && !a3.statuses.size, "停用掩护区时去掉区域内指示物的掩护");
		ok(await ev("tokenEnter", { actor: null, regions: new Set() }, soft) === undefined, "没有角色的指示物不报错");

		// 危险地形事件与一键工程检定
		const chatCards = [];
		const prevCM = ctx.ChatMessage;
		ctx.ChatMessage = { getSpeaker: ({ actor: a }) => ({ alias: a?.name }), create: async d => { chatCards.push(d); return d; } };
		const dActor = { uuid: "Actor.M1", name: "珠穆朗玛", isOwner: true };
		const dTok = { name: "珠穆朗玛", actor: dActor };
		await Dangerous.events.tokenMoveIn.call({ damage: 5, damageType: "Kinetic" }, { name: "tokenMoveIn", data: { token: dTok }, user: me });
		ok(chatCards.length === 1 && /进入了危险地形/.test(chatCards[0].content) && /5 点动能伤害/.test(chatCards[0].content) && chatCards[0].content.includes('data-lancer-cn-eng-check="Actor.M1"'), "进入危险地形发送提醒卡与工程检定按钮");
		await Dangerous.events.tokenTurnEnd.call({ damage: 4, damageType: "Heat" }, { name: "tokenTurnEnd", data: { token: dTok }, user: me });
		ok(chatCards.length === 2 && /结束回合/.test(chatCards[1].content) && /4 点热度/.test(chatCards[1].content), "在危险地形结束回合可提示热度");
		await Dangerous.events.tokenMoveIn.call({ damage: 5, damageType: "Kinetic" }, { name: "tokenMoveIn", data: { token: dTok }, user: other });
		ok(chatCards.length === 2, "其他客户端收到危险地形事件不重复发卡");
		let engFlowArgs = null;
		ctx.fromUuid = async u => (u === "Actor.M1" ? dActor : null);
		ctx.game.lancer = { flows: new Map([["StatRollFlow", class { constructor(uuid, args) { this.state = { data: {} }; engFlowArgs = { uuid, args }; } async begin(d) { engFlowArgs.began = d; } }]]) };
		ctx.LancerCN.onDangerousCheckClick({
			target: { closest: sel => (sel === "[data-lancer-cn-eng-check]" ? { dataset: { lancerCnEngCheck: "Actor.M1" } } : null) },
			preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {},
		});
		await new Promise(r => setTimeout(r, 0));
		ok(engFlowArgs?.uuid === "Actor.M1" && engFlowArgs.began?.path === "system.eng", "点击工程检定按钮发起 StatRollFlow(system.eng)");
		ctx.ChatMessage = prevCM;
	}

	// ---- 六边形墙体：模拟场景与六角网格
	{
		ok(log.settings["lancer-cn.hexWallBlocksSight"]?.default === false && log.settings["lancer-cn.hexWallBlocksSight"].scope === "world", "应注册世界设置「六边形墙体阻挡视线」，默认关闭");
		Object.assign(ctx.CONST, { WALL_SENSE_TYPES: { NONE: 0, NORMAL: 20 }, WALL_MOVEMENT_TYPES: { NONE: 0, NORMAL: 20 }, DRAWING_FILL_TYPES: { SOLID: 1 } });
		// 尖顶六边形，中心 (100,100)，半径 50
		const hexAt = (cx, cy) => Array.from({ length: 6 }, (_, i) => ({ x: cx + 50 * Math.cos(Math.PI / 3 * i - Math.PI / 2), y: cy + 50 * Math.sin(Math.PI / 3 * i - Math.PI / 2) }));
		const { walls, drawing } = ctx.LancerCN.hexWallData(hexAt(100, 100), "0,0");
		ok(walls.length === 6 && walls.every(w => w.move === 20 && w.sight === 0 && w.light === 0 && w.c.length === 4), "一格墙体 = 6 段只阻挡移动的墙");
		ok(walls.every((w, i) => w.c[2] === walls[(i + 1) % 6].c[0] && w.c[3] === walls[(i + 1) % 6].c[1]), "6 段墙首尾相连，围住整个格子");
		ok(walls.every(w => w.flags["lancer-cn"].hexWall === "0,0") && drawing.flags["lancer-cn"].hexWall === "0,0", "墙与图形都带格子标记，便于移除");
		ok(drawing.shape.type === "p" && drawing.shape.points.length === 12 && drawing.fillType === 1 && drawing.fillAlpha > 0.5 && drawing.locked, "图形是锁定的实心六边形");
		ok(drawing.shape.points.every((v, i) => v >= 0 && v <= (i % 2 ? drawing.shape.height : drawing.shape.width)), "图形顶点坐标相对左上角");
		ok(ctx.LancerCN.hexWallData(hexAt(0, 0), "k", { blockSight: true }).walls.every(w => w.sight === 20 && w.light === 20), "开启设置后同时阻挡视线与光照");
		// 放置 / 移除
		const mkDoc = (data, id) => ({ ...data, id, getFlag: (m, k) => data.flags?.[m]?.[k] });
		const scene = { walls: [], drawings: [], n: 0 };
		scene.createEmbeddedDocuments = async (type, list) => { const arr = type === "Wall" ? scene.walls : scene.drawings; for (const d of list) arr.push(mkDoc(d, `${type}${scene.n++}`)); };
		scene.deleteEmbeddedDocuments = async (type, ids) => { const k = type === "Wall" ? "walls" : "drawings"; scene[k] = scene[k].filter(d => !ids.includes(d.id)); };
		const grid = { getOffset: p => ({ i: Math.round(p.y / 100), j: Math.round(p.x / 100) }), getVertices: o => hexAt(o.j * 100, o.i * 100) };
		log.settingValues["lancer-cn.hexWallBlocksSight"] = false;
		ok(await ctx.LancerCN.setHexWall(scene, grid, { x: 100, y: 100 }, "add") === "add" && scene.walls.length === 6 && scene.drawings.length === 1, "点击空格子：放置墙体与图形");
		ok(await ctx.LancerCN.setHexWall(scene, grid, { x: 110, y: 95 }, "add") === null && scene.walls.length === 6, "同一格不重复放置");
		await ctx.LancerCN.setHexWall(scene, grid, { x: 200, y: 100 }, "add");
		ok(scene.walls.length === 12 && scene.drawings.length === 2, "相邻格子各自放置");
		ok(await ctx.LancerCN.setHexWall(scene, grid, { x: 100, y: 100 }, "remove") === "remove" && scene.walls.length === 6 && scene.drawings.length === 1 && scene.walls.every(w => w.flags["lancer-cn"].hexWall === "1,2"), "移除只删这一格，相邻格子的墙保留");
		ok(await ctx.LancerCN.setHexWall(scene, grid, { x: 900, y: 900 }, "remove") === null, "空格子移除时什么都不做");
		// 工具按钮：只给 GM，放在「墙壁」工具栏
		const gmControls = { walls: { tools: { select: {}, walls: {} } }, tokens: { tools: {} } };
		ctx.game.user.isGM = true;
		hooks.getSceneControlButtons(gmControls);
		const tool = gmControls.walls.tools.lancerHexWall;
		ok(tool && tool.name === "lancerHexWall" && /六边形墙体/.test(tool.title) && tool.icon && !tool.toggle && !tool.button, "GM 的「墙壁」工具栏应有「六边形墙体」工具");
		const playerControls = { walls: { tools: {} } };
		ctx.game.user.isGM = false;
		hooks.getSceneControlButtons(playerControls);
		ok(!playerControls.walls.tools.lancerHexWall, "玩家没有这个工具");
		ctx.game.user.isGM = true;

		// 涂画的指针处理：在 window 捕获阶段拦截，墙壁图层收不到按下 / 拖动 / 松开（否则会拉出一道直线墙）
		for (const t of ["pointerdown", "pointermove", "pointerup", "pointercancel"]) {
			const l = (ctx.windowListeners[t] || [])[0];
			ok(l && l.opts?.capture === true, `${t} 应在 window 上以捕获阶段监听`);
		}
		const view = { id: "board" };
		ctx.canvas = { scene, grid, app: { canvas: view }, canvasCoordinatesFromClient: p => ({ x: p.x, y: p.y }) };
		ctx.ui = { ...(ctx.ui || {}), controls: { control: { name: "walls" }, tool: { name: "lancerHexWall" } } };
		const fire = (type, x, y, extra = {}) => {
			const ev = { type, clientX: x, clientY: y, button: 0, buttons: type === "pointerup" ? 0 : 1, target: view, stopped: false, prevented: false,
				stopImmediatePropagation() { this.stopped = true; }, preventDefault() { this.prevented = true; }, ...extra };
			for (const { fn } of ctx.windowListeners[type]) fn(ev);
			return ev;
		};
		const settle = () => new Promise(r => setTimeout(r, 0));
		scene.walls = []; scene.drawings = [];
		const down = fire("pointerdown", 100, 100);
		const move = fire("pointermove", 200, 100);
		const up = fire("pointerup", 200, 100);
		await settle(); await settle();
		ok(down.stopped && down.prevented && move.stopped && up.stopped, "涂画中的按下、拖动、松开都被拦下，墙壁图层不会开始画直线墙");
		ok(scene.walls.length === 12 && scene.drawings.length === 2, "按住拖动：经过的两格各放一整格墙体，没有多出的直线墙");
		ok(!fire("pointermove", 300, 100, { buttons: 0 }).stopped, "松开后的移动不再拦截");
		ok(!fire("pointerdown", 300, 100, { target: { id: "sidebar" } }).stopped, "按在界面上（不是画布）时不拦截");
		ok(!fire("pointerdown", 300, 100, { button: 2 }).stopped, "右键（平移视图）不拦截");
		// 只剩图形的格子（墙被别的方式删掉）：点它就移除图形，而不是当作空格子
		scene.walls = scene.walls.filter(w => w.flags["lancer-cn"].hexWall !== "1,1");
		ok(scene.drawings.some(d => d.flags["lancer-cn"].hexWall === "1,1"), "准备：1,1 只剩图形");
		fire("pointerdown", 100, 100); fire("pointerup", 100, 100);
		await settle(); await settle();
		ok(!scene.drawings.some(d => d.flags["lancer-cn"].hexWall === "1,1"), "点只剩图形的格子：图形被移除");
		// 拖动移除：从有墙体的格子按下，经过的格子都移除墙和图形
		fire("pointerdown", 100, 100); fire("pointerup", 100, 100); await settle(); await settle();
		ok(scene.walls.length === 12 && scene.drawings.length === 2, "准备：两格墙体");
		fire("pointerdown", 100, 100); fire("pointermove", 200, 100); fire("pointerup", 200, 100);
		await settle(); await settle();
		ok(scene.walls.length === 0 && scene.drawings.length === 0, "从墙体按下拖动：经过的格子墙和图形都删掉");
		// 用 Foundry 自己的墙壁工具删掉一格的墙：最后一段删掉时顺带删图形
		await ctx.LancerCN.setHexWall(scene, grid, { x: 100, y: 100 }, "add");
		const removed = scene.walls.splice(0, 6);
		ok(typeof hooks.deleteWall === "function", "应注册 deleteWall 钩子");
		for (const w of removed) hooks.deleteWall({ ...w, parent: scene }, {}, "u1");
		await settle();
		ok(scene.drawings.length === 0, "墙被别的方式删光时，图形一起删掉，不留色块");
		await ctx.LancerCN.setHexWall(scene, grid, { x: 100, y: 100 }, "add");
		hooks.deleteWall({ ...scene.walls[0], parent: scene }, {}, "u1");
		await settle();
		ok(scene.drawings.length === 1, "还剩其他墙段时不删图形");
		hooks.deleteWall({ ...scene.walls[0], parent: scene }, {}, "other");
		ok(scene.drawings.length === 1, "别的用户删的墙由那位用户处理");
		scene.walls = []; scene.drawings = [];
		ctx.ui.controls = { control: { name: "tokens" }, tool: { name: "select" } };
		ok(!fire("pointerdown", 100, 100).stopped, "没选涂画工具时不拦截");

		// 掩护格：点击格子加入本场景的软性 / 硬性掩护区
		ctx.CONST.REGION_VISIBILITY = { LAYER: 0, GAMEMASTER: 1, ALWAYS: 2 };
		scene.regions = [];
		scene.createEmbeddedDocuments = async (type, list) => {
			if (type !== "Region") return;
			for (const d of list) {
				const r = { ...d, id: `Region${scene.n++}`, getFlag: (m, k) => d.flags?.[m]?.[k] };
				r.update = async u => { Object.assign(r, u); r.updates = (r.updates || 0) + 1; };
				scene.regions.push(r);
			}
		};
		scene.deleteEmbeddedDocuments = async (type, ids) => { if (type === "Region") scene.regions = scene.regions.filter(r => !ids.includes(r.id)); };
		const { setCoverCell, coverCellHas } = ctx.LancerCN;
		ok(await setCoverCell(scene, grid, { x: 100, y: 100 }, "soft", "add") === "add" && scene.regions.length === 1, "第一个软性掩护格：建立软性掩护区");
		const softRegion = scene.regions[0];
		ok(softRegion.visibility === 2 && softRegion.behaviors?.[0]?.type === "lancer-cn.cover" && softRegion.behaviors[0].system.cover === "soft", "掩护区所有人可见，并带「LANCER 掩护区」行为（软性）");
		ok(softRegion.shapes[0].type === "polygon" && softRegion.shapes[0].points.length === 12, "掩护格是整格六边形");
		await setCoverCell(scene, grid, { x: 200, y: 100 }, "soft", "add");
		ok(scene.regions.length === 1 && softRegion.shapes.length === 2, "后续的软性掩护格加进同一个区域");
		ok(await setCoverCell(scene, grid, { x: 205, y: 98 }, "soft", "add") === null && softRegion.shapes.length === 2, "同一格不重复加入");
		ok(coverCellHas(scene, grid, { x: 100, y: 100 }, "soft") && !coverCellHas(scene, grid, { x: 100, y: 100 }, "hard"), "能判断格子是否已在软性 / 硬性掩护区");
		await setCoverCell(scene, grid, { x: 100, y: 100 }, "hard", "add");
		ok(scene.regions.length === 2 && scene.regions[1].behaviors[0].system.cover === "hard" && scene.regions[1].color !== softRegion.color, "硬性掩护格是另一个区域，颜色不同");
		ok(await setCoverCell(scene, grid, { x: 100, y: 100 }, "soft", "remove") === "remove" && softRegion.shapes.length === 1, "移除一个软性掩护格，只删这一格");
		await setCoverCell(scene, grid, { x: 200, y: 100 }, "soft", "remove");
		ok(scene.regions.length === 1 && scene.regions[0].behaviors[0].system.cover === "hard", "软性掩护格全部移除后删除该区域，硬性区域保留");
		// 困难地形格与危险地形格 + 顶点顺序不同的同格多边形识别
		const { setTerrainCell, terrainCellHas } = ctx.LancerCN;
		ok(await setTerrainCell(scene, grid, { x: 100, y: 100 }, "difficult", "add") === "add", "点击格子加入困难地形区");
		const diffReg = scene.regions.find(r => r.getFlag("lancer-cn", "terrainCells") === "difficult");
		ok(diffReg && diffReg.behaviors[0].type === "modifyMovementCost" && diffReg.behaviors[0].system.difficulties.walk === 2, "困难地形格使用 modifyMovementCost（walk: 2）");
		ok(await setTerrainCell(scene, grid, { x: 200, y: 100 }, "dangerous", "add") === "add", "点击格子加入危险地形区");
		const dangReg = scene.regions.find(r => r.getFlag("lancer-cn", "terrainCells") === "dangerous");
		ok(dangReg && dangReg.behaviors[0].type === "lancer-cn.dangerous" && dangReg.behaviors[0].system.damage === 5, "危险地形格使用 lancer-cn.dangerous");
		// 把顶点循环移位（模拟车卡器静态场景 JSON 不同的起始顶点顺序）：仍应识别为同一格并能移除
		const p0 = diffReg.shapes[0].points;
		diffReg.shapes[0].points = [...p0.slice(4), ...p0.slice(0, 4)];
		ok(terrainCellHas(scene, grid, { x: 100, y: 100 }, "difficult"), "起始顶点顺序不同的同一六角格也能识别");
		ok(await setTerrainCell(scene, grid, { x: 100, y: 100 }, "difficult", "remove") === "remove" && !scene.regions.some(r => r.getFlag("lancer-cn", "terrainCells") === "difficult"), "可正常移除静态导入的困难地形格");

		const regionControls = { walls: { tools: {} }, regions: { tools: { select: {} } } };
		hooks.getSceneControlButtons(regionControls);
		ok(/软性掩护格/.test(regionControls.regions.tools.lancerCoverSoft?.title) && /硬性掩护格/.test(regionControls.regions.tools.lancerCoverHard?.title), "GM 的「区域」工具栏应有软性 / 硬性掩护格工具");
		ok(/困难地形格/.test(regionControls.regions.tools.lancerTerrainDifficult?.title) && /危险地形格/.test(regionControls.regions.tools.lancerTerrainDangerous?.title), "GM 的「区域」工具栏应有困难 / 危险地形格工具");
		ok(regionControls.walls.tools.lancerHexWall && !regionControls.walls.tools.lancerCoverSoft && !regionControls.walls.tools.lancerTerrainDifficult, "墙体工具在墙壁栏，掩护与地形工具在区域栏");
	}

	// ---- 导入车卡器战斗地图（parseBattleMap / importBattleMap / clearUnitMarkers / addMapImportButton）
	{
		const L = ctx.LancerCN;
		ctx.CONST.GRID_TYPES = { GRIDLESS: 0, SQUARE: 1, HEXODDR: 2, HEXEVENR: 3, HEXODDQ: 4, HEXEVENQ: 5 };
		const rawMap = {
			v: 1, minQ: 0, minR: 0, w: 6, h: 5, round: 2,
			cells: {
				"1,1": { terrain: "障碍物", color: "#202a38" },
				"2,1": { terrain: "软性掩护", color: "#3b82c4" },
				"2,2": { terrain: "硬性掩护", color: "#c4703b" },
				"3,1": { terrain: "困难地形", color: "#7d8c38" },
				"3,2": { terrain: "危险地形", color: "#c93b3b", text: "电弧池" },
				"4,1": { terrain: "自定义", color: "#44aa88" },
				"9,9": { terrain: "障碍物", color: "#202a38" }, // 范围外
			},
			units: [
				{ id: "u1", name: "黑胡子", kind: "玩家", color: "#529be8", size: "1", q: 0, r: 1, hp: 12, max: 12, armor: 1, states: [] },
				{ id: "u2", name: "巨像", kind: "敌方", color: "#d95b68", size: "2", q: 4, r: 2, hp: 20, max: 20, armor: 2, states: [] },
			],
			lines: [{ a: { q: 0, r: 0 }, b: { q: 3, r: 3 }, color: "#ffd166" }],
		};
		// 同时校验车卡器 BattleMap.toFoundry 产出的场景 JSON 也能被 parseBattleMap 读取
		const bmCtx = vm.createContext({
			console, setTimeout, clearTimeout, Blob, URL,
			localStorage: { getItem: () => null, setItem() {} },
			document: { body: { append() {} }, addEventListener() {}, getElementById: () => ({ value: "10" }), querySelectorAll: () => [], createElement: () => ({ addEventListener() {}, click() {} }) },
			window: { addEventListener() {} }, confirm: () => true,
		});
		vm.runInContext("var E = s => String(s ?? ''), P = () => ({ mechs: [{}], activeMech: 0 }), mechStats = () => ({ hp: 10, armor: 0, size: 1 });", bmCtx);
		const BattleMap = vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/battlemap.js"), "utf8") + "\nBattleMap;", bmCtx);
		const exportedSceneJson = JSON.stringify(BattleMap.toFoundry(rawMap, { name: "车卡器直出场景" }));

		const p1 = L.parseBattleMap(JSON.stringify(rawMap));
		const p2 = L.parseBattleMap(exportedSceneJson);
		ok(p1.map.w === 6 && p1.map.round === 2 && /第 2 轮/.test(p1.name), "parseBattleMap 可解析车卡器原始地图备份 JSON");
		ok(p2.name === "车卡器直出场景" && p2.map.w === 6 && !p2.map.cells["9,9"], "parseBattleMap 可解析车卡器「导出到 Foundry」生成的场景 JSON");
		let badThrew = false;
		try { L.parseBattleMap('{"hello":1}'); } catch { badThrew = true; }
		ok(badThrew, "无效 JSON 结构应报错拒绝");

		const mkSceneObj = init => {
			const s = {
				...init, walls: [], drawings: [], regions: [], n: 1, viewed: false,
				grid: L.makeHexGrid(init.grid?.type ?? 4, init.grid?.size ?? 100),
				getFlag(m, k) { return this.flags?.[m]?.[k]; },
				async setFlag(m, k, v) { this.flags ??= {}; this.flags[m] ??= {}; this.flags[m][k] = v; },
				async update(u) {
					if ("grid.type" in u) { this.grid = L.makeHexGrid(u["grid.type"], this.grid?.size || 100); }
					Object.assign(this, u);
				},
				async view() { this.viewed = true; },
				async createEmbeddedDocuments(type, list) {
					const key = type === "Wall" ? "walls" : type === "Drawing" ? "drawings" : "regions";
					for (const d of list) {
						const doc = { ...d, id: `${type}_${this.n++}`, getFlag: (m, fk) => d.flags?.[m]?.[fk] };
						if (type === "Region") doc.update = async u => { Object.assign(doc, u); };
						this[key].push(doc);
					}
				},
				async deleteEmbeddedDocuments(type, ids) {
					const key = type === "Wall" ? "walls" : type === "Drawing" ? "drawings" : "regions";
					this[key] = this[key].filter(d => !ids.includes(d.id));
				},
			};
			return s;
		};
		const createdScenes = [];
		ctx.CONFIG.Scene = { documentClass: { create: async data => { const s = mkSceneObj(data); createdScenes.push(s); return s; } } };

		ctx.game.user.isGM = false;
		ok(await L.importBattleMap(rawMap) === null && log.notes.at(-1)?.[0] === "warn", "非 GM 不能导入车卡器地图");
		ctx.game.user.isGM = true;

		// 1. 新建独立场景
		const rNew = await L.importBattleMap(exportedSceneJson, { mode: "new" });
		const sc = rNew?.scene;
		ok(sc && sc.name === "车卡器直出场景" && sc.viewed && sc.grid.type === 4 && sc.padding === 0 && sc.tokenVision === false, "新建场景模式：按文件名称建立平顶六角格场景并切换视图");
		ok(sc.walls.length === 6 && sc.regions.length === 4, "新建场景包含 6 段障碍物墙体与 4 类地形/掩护区域");
		// 涂画工具与导入的场景无缝衔接：Foundry v13 HexagonalGrid 中 i=行(r)、j=列(q)，故 (q=3,r=1) 对应 { i: 1, j: 3 }
		const pt31 = sc.grid.getCenterPoint({ i: 1, j: 3 });
		ok(L.terrainCellHas(sc, sc.grid, pt31, "difficult") && !L.terrainCellHas(sc, sc.grid, pt31, "dangerous"), "导入后的区域可直接用涂画工具继续编辑（{ i: 行, j: 列 } 与 BattleMap.toFoundry 完全对齐）");
		// 部署标记清除：只删单位标记（1 个 S1 + 3 格 S2 占地 + 1 个 S2 圆标 = 5 个），保留墙体图形、涂色格、标注和画线
		const drawBefore = sc.drawings.length;
		const cleared = await L.clearUnitMarkers(sc);
		ok(cleared === 5 && sc.drawings.length === drawBefore - 5 && !sc.drawings.some(d => d.getFlag("lancer-cn", "unitMarker")) && sc.drawings.some(d => d.getFlag("lancer-cn", "cellText")), "clearUnitMarkers 只清除单位部署标记，保留地形色块、文字标注与画线");

		// 2. 铺到当前场景（含底图保留、手动区域合并、奇数列 minQ=-3 奇偶对齐与重复导入替换）
		const bgScene = mkSceneObj({ name: "带底图的战场", grid: { type: 1, size: 120 }, flags: {} });
		// GM 手工放一个非导入图形与一个已有软性掩护格
		await bgScene.createEmbeddedDocuments("Drawing", [{ x: 10, y: 10, shape: { type: "r", width: 20, height: 20 }, flags: {} }]);
		const hex120 = L.makeHexGrid(5, 120);
		await L.setCoverCell({ ...bgScene, grid: hex120 }, hex120, hex120.getCenterPoint({ i: 5, j: 4 }), "soft", "add");
		const oddMap = { ...rawMap, minQ: -3 }; // 奇数列起始
		await L.importBattleMap(oddMap, { mode: "current", scene: bgScene, setHexGrid: true, includeUnits: true });
		ok(bgScene.grid.type === 5, "铺到方格场景且勾选自动切换时，网格按 minQ=-3 切为偶数列下移平顶六角格（type=5）");
		const softReg = bgScene.regions.find(r => r.getFlag("lancer-cn", "coverCells") === "soft");
		ok(softReg && softReg.shapes.length === 2, "已有手动软性掩护区时，把导入的掩护格合并进同一区域而不丢失原格子");
		// 再铺到奇数列下移（HEXODDQ=4）的场景且不切换网格：origin.j（列偏移）应自动偏移 +1 以保持相邻列上下错位一致
		const fixedHexScene = mkSceneObj({ name: "固定 HEXODDQ 底图", grid: { type: 4, size: 100 }, flags: {} });
		await L.importBattleMap(oddMap, { mode: "current", scene: fixedHexScene, setHexGrid: false });
		// oddMap 中障碍物在 q=1,r=1，minQ=-3 → q-minQ=4；因 HEXODDQ 在 j=0 时不移、而 minQ=-3 在车卡器中下移，origin.j 应偏移为 1，故障碍物落在 i=1(行), j=5(列)
		ok(fixedHexScene.walls.length === 6 && fixedHexScene.walls[0].getFlag("lancer-cn", "hexWall") === "1,5", "在 HEXODDQ 场景铺奇数列地图时自动偏移 1 列对齐六角格上下错位：" + fixedHexScene.walls[0]?.getFlag("lancer-cn", "hexWall"));
		// 重复导入并开启 replaceImported：旧导入内容被替换，不会翻倍，GM 手工图形保留
		await L.importBattleMap({ ...oddMap, cells: { "1,1": { terrain: "障碍物", color: "#202a38" } }, units: [], lines: [] }, { mode: "current", scene: bgScene, setHexGrid: false, replaceImported: true });
		ok(bgScene.walls.length === 6 && bgScene.drawings.filter(d => !d.getFlag("lancer-cn", "mapImport")).length === 1 && !bgScene.drawings.some(d => d.getFlag("lancer-cn", "unitMarker")), "重复导入替换旧导入内容，不重复叠加墙体且保留 GM 手工图形");

		// 3. 场景侧栏按钮（renderSceneDirectory）
		const headerActions = {
			kids: [],
			ownerDocument: { createElement: tag => ({ tag, style: {}, dataset: {}, listeners: {}, addEventListener(t, fn) { this.listeners[t] = fn; } }) },
			querySelector(sel) { return sel === ".lancer-cn-import-map" ? this.kids.find(k => k.className === "lancer-cn-import-map") : null; },
			append(el) { this.kids.push(el); },
		};
		const dirHtml = { querySelector: sel => (sel === ".header-actions" ? headerActions : null) };
		hooks.renderSceneDirectory({}, dirHtml);
		hooks.renderSceneDirectory({}, dirHtml);
		ok(headerActions.kids.length === 1 && /导入车卡器地图/.test(headerActions.kids[0].innerHTML), "GM 的场景目录顶部应插入一个「导入车卡器地图」按钮且不重复插入");
		const playerHeader = { ...headerActions, kids: [] };
		ctx.game.user.isGM = false;
		hooks.renderSceneDirectory({}, { querySelector: sel => (sel === ".header-actions" ? playerHeader : null) });
		ok(playerHeader.kids.length === 0, "非 GM 不显示场景目录导入按钮");
		ctx.game.user.isGM = true;
	}

	// ---- 攻击时选目标
	{
		const L = ctx.LancerCN;
		const view = { id: "board" };
		for (const k of ["targetPicker", "targetClearStale", "targetAutoPick"]) {
			const s = log.settings[`lancer-cn.${k}`];
			ok(s && s.scope === "client" && s.default === true && /[一-鿿]/.test(s.name), `应注册客户端设置 ${k}（默认开启）`);
		}
		for (const n of ["BasicAttackFlow", "WeaponAttackFlow", "TechAttackFlow", "DamageRollFlow"])
			ok(typeof hooks[`lancer.preFlow.${n}`] === "function" && typeof hooks[`lancer.postFlow.${n}`] === "function", `应监听 ${n} 的开始与结束`);
		ok((ctx.windowListeners.pointerdown || []).length >= 2 && ctx.windowListeners.pointerdown.every(l => l.opts?.capture), "点地图锁定也在 window 捕获阶段");

		// 场景：方格，每格 100；指示物所占格子 → 中心点
		const cells = (i, j, n = 1) => { const r = []; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) r.push({ i: i + a, j: j + b }); return r; };
		ctx.CONST.TOKEN_DISPOSITIONS = { SECRET: -2, HOSTILE: -1, NEUTRAL: 0, FRIENDLY: 1 };
		const targets = new Set();
		ctx.game.user.targets = targets;
		ctx.game.user.isGM = false;
		const mkTok = (id, disp, i, j, n = 1, extra = {}) => {
			const t = {
				id, name: id, actor: { img: id + ".png" }, visible: true, center: { x: j * 100 + 50, y: i * 100 + 50 },
				document: { name: id, disposition: disp, hidden: false, texture: { src: id + ".webp" }, getOccupiedGridSpaceOffsets: () => cells(i, j, n) },
				bounds: { contains: (x, y) => x >= j * 100 && x < (j + n) * 100 && y >= i * 100 && y < (i + n) * 100 },
				setTarget(on) { on ? targets.add(t) : targets.delete(t); },
				...extra,
			};
			return t;
		};
		const me = mkTok("我", 1, 0, 0);
		const near = mkTok("近敌", -1, 0, 3);
		const far = mkTok("远敌", -1, 0, 12);
		const big = mkTok("大型敌", -1, 5, 0, 2); // 占 5..6 行
		const ally = mkTok("友军", 1, 1, 1);
		const hiddenFoe = mkTok("隐藏敌", -1, 0, 2, 1, { visible: false });
		const placeables = [me, near, far, big, ally, hiddenFoe];
		ctx.canvas = {
			scene: {}, app: { canvas: view },
			grid: {
				isGridless: false, distance: 1,
				getCenterPoint: o => ({ x: o.j * 100, y: o.i * 100 }), getOffset: p => ({ i: Math.floor(p.y / 100), j: Math.floor(p.x / 100) }),
				measurePath: ([p, q]) => ({ spaces: Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y)) / 100 }),
			},
			tokens: { placeables, controlled: [me], get: id => placeables.find(t => t.id === id) },
			canvasCoordinatesFromClient: p => ({ x: p.x, y: p.y }),
		};
		const actor = { system: { sensor_range: 8 } };
		me.actor = actor;
		ok(L.tokenDistance(me, near) === 3 && L.tokenDistance(me, big) === 5, "距离按双方所占格子最近的一格算（大型单位按最近的格子）");
		class WeaponAttackFlow { constructor(range) { this.state = { actor, item: { name: "重型突击步枪", currentProfile: () => ({ range }) }, data: {} }; } }
		class TechAttackFlow { constructor() { this.state = { actor, item: null, data: { title: "科技攻击" } }; } }
		class DamageRollFlow { constructor(hits) { this.state = { actor, item: { name: "链斧" }, data: { hit_results: hits } }; } }
		const r = L.attackReach(new WeaponAttackFlow([{ type: "Range", val: 10 }, { type: "Blast", val: 1 }]));
		ok(r.reach === 10 && r.label === "射程 10 / 溅射 1", "武器射程取射程 / 威胁等的最大值，溅射不算可达距离");
		ok(L.attackReach(new WeaponAttackFlow([{ type: "Threat", val: 1 }])).reach === 1, "近战按威胁");
		ok(L.attackReach(new TechAttackFlow()).reach === 8 && L.attackReach(new TechAttackFlow()).label === "感应 8", "科技攻击按感应");
		const rows = L.targetCandidates({ token: me, reach: 10, lastIds: [] });
		ok(rows.map(x => x.name).join(",") === "近敌,大型敌,远敌,友军", "候选：敌方在前按距离排序，友方在后；看不见的指示物不列出");
		ok(rows.find(x => x.name === "近敌").inRange === true && rows.find(x => x.name === "远敌").inRange === false, "标出是否在射程内");
		const html = L.targetPanelHTML({ title: "攻击：重型突击步枪", rangeLabel: "射程 10" }, rows);
		ok(/敌方/.test(html) && /友方/.test(html) && /射程外/.test(html) && /3 格/.test(html) && /已选 0 个/.test(html), "面板分组、距离、射程与已选数量");
		ok(L.targetPanelHTML({ title: "<b>x</b>" }, []).includes("&lt;b&gt;"), "面板文字已转义");

		// 开始攻击：射程内恰好一个敌人时自动选中
		const f1 = new WeaponAttackFlow([{ type: "Range", val: 4 }]);
		hooks["lancer.preFlow.WeaponAttackFlow"](f1);
		ok(L.targetSession()?.flow === f1, "开始攻击时打开目标面板");
		ok(targets.size === 1 && targets.has(near), "射程内只有一个敌人：自动选中");
		// 点地图：面板开着时点指示物 = 锁定 / 取消锁定
		const click = (x, y, extra = {}) => { const ev = { type: "pointerdown", button: 0, clientX: x, clientY: y, target: view, stopped: false, stopImmediatePropagation() { this.stopped = true; }, preventDefault() {}, ...extra }; L.onTargetPointer(ev); return ev; };
		const c1 = click(1250, 50);
		ok(c1.stopped && targets.has(far), "点地图上的指示物：锁定，图层收不到这次点击");
		ok(click(1250, 50).stopped && !targets.has(far), "再点一次：取消锁定");
		ok(!click(50, 50).stopped && !targets.has(me), "点自己的指示物：照常选中，不锁定");
		ok(!click(950, 950).stopped, "点空地：照常处理");
		ok(!click(1250, 50, { shiftKey: true }).stopped, "按住修饰键时不接管");
		hooks["lancer.postFlow.WeaponAttackFlow"](f1, true);
		ok(L.targetSession() === null, "攻击结束后关闭面板");
		ok(!click(350, 50).stopped, "面板关闭后点地图照常处理");
		// 下一次攻击：目标还是上次那几个 → 清掉；射程内有两个敌人 → 不自动选
		const f2 = new WeaponAttackFlow([{ type: "Range", val: 10 }]);
		hooks["lancer.preFlow.WeaponAttackFlow"](f2);
		ok(targets.size === 0, "锁定的仍是上一次攻击的目标：开始新攻击时清除；射程内有多个敌人时不自动选");
		ok(L.targetCandidates(L.targetSession()).find(x => x.name === "近敌").last, "上一次攻击的目标标为「上次」");
		hooks["lancer.postFlow.WeaponAttackFlow"](f2, false);
		// 玩家改过目标后不清
		targets.add(far);
		const f3 = new WeaponAttackFlow([{ type: "Range", val: 10 }]);
		hooks["lancer.preFlow.WeaponAttackFlow"](f3);
		ok(targets.size === 1 && targets.has(far), "目标在上次攻击后改过：不清除");
		hooks["lancer.postFlow.WeaponAttackFlow"](f3, true);
		// 从攻击卡掷伤害：已有命中结果，不弹面板；单独掷伤害时弹
		hooks["lancer.preFlow.DamageRollFlow"](new DamageRollFlow([{ target: near }]));
		ok(L.targetSession() === null, "从攻击卡掷伤害（已有命中结果）不弹面板");
		const fd = new DamageRollFlow([]);
		hooks["lancer.preFlow.DamageRollFlow"](fd);
		ok(L.targetSession()?.kind === "DamageRollFlow" && targets.has(far), "单独掷伤害时弹面板，不清除、不自动选");
		hooks["lancer.postFlow.DamageRollFlow"](fd, true);
		// 关闭设置
		log.settingValues["lancer-cn.targetPicker"] = false;
		hooks["lancer.preFlow.TechAttackFlow"](new TechAttackFlow());
		ok(L.targetSession() === null, "关闭设置后不弹面板");
		log.settingValues["lancer-cn.targetPicker"] = true;
		ctx.game.user.isGM = true;
	}

	// ---- 命中后一键施加状态
	{
		ok(manifest.socket === true, "清单应开启 socket（玩家请 GM 施加状态）");
		const { statusesIn, attackTexts, onRenderChatMessage } = ctx.LancerCN;
		const S = (t, strict) => statusesIn(t, { strict }).join();
		const cases = [
			["目标必须通过机体豁免，否则陷入受损状态，直到其下一回合结束。", false, "impaired"],
			["目标必须通过机体豁免否则伏卧。豁免失败的目标将离散直到他们下一回合结束。", false, "shredded,prone"],
			["该武器可以在受扰下使用。", true, ""],
			["旋转期间，这武器获得可靠3，但你陷入缓慢状态。", true, ""],
			["攻击处于伏卧、固定或晕眩状态的角色时，额外造成 1d6 伤害。", true, ""],
			["若目标被锁定，该武器获得击退2。", true, ""],
			["以一个快速动作，你可以锁定该武器。", true, ""],
			["自动扫描目标锁定，在成功识别时发射圆盘。", true, ""],
			["目标同时被锁定。", true, "lockon"],
			["任何未命中你的近战攻击，都会迫使攻击者进行机体豁免，否则伏卧。", true, ""],
			["可以消耗锁定，使该攻击 +1 准度。", false, ""],
			["The target must pass a HULL save or become Slowed.", false, "slow"],
		];
		for (const [t, strict, want] of cases) ok(S(t, strict) === want, `statusesIn(${JSON.stringify(t)}) 应为「${want}」，实际「${S(t, strict)}」`);
		const weapon = { system: { active_profile: { on_hit: "目标必须通过机体豁免否则缓慢。", effect: "你可以在受扰下使用该武器。" }, profiles: [] } };
		ok(attackTexts(weapon).map(t => `${t.strict}`).join() === "false,true", "命中效果整段看，效果说明按句筛选");
		// 渲染聊天卡并点击：自己的目标直接施加，别人的目标交给 GM
		const mkActorS = owner => { const a = { isOwner: owner, statuses: new Set() }; a.toggleStatusEffect = async (id, { active }) => { if (active) a.statuses.add(id); }; return a; };
		const own = mkActorS(true), npc = mkActorS(false), missed = mkActorS(true);
		const tokens = { "Scene.s.Token.a": { actor: own }, "Scene.s.Token.b": { actor: npc }, "Scene.s.Token.c": { actor: missed }, "Item.w": weapon };
		const emitted = [];
		const notes = [];
		Object.assign(ctx, {
			fromUuidSync: uuid => tokens[uuid] ?? null,
			HTMLElement: class {},
		});
		ctx.game = { ...ctx.game, user: { isGM: false }, users: { activeGM: { isSelf: false } }, socket: { emit: (ch, msg) => emitted.push([ch, msg]), on: (ch, fn) => { ctx.__socket = fn; } } };
		ctx.ui = { notifications: { info: s => notes.push(s), warn: s => notes.push("warn:" + s) } };
		// 简易 DOM
		let inserted = "", clickHandler = null;
		const row = { addEventListener: (t, fn) => { clickHandler = fn; } };
		const content = { insertAdjacentHTML: (pos, h) => { inserted = h; }, querySelector: sel => (sel === ".lancer-cn-status-row" ? row : null) };
		const root = { querySelector: sel => (sel === ".message-content" ? content : null) };
		const message = { isAuthor: true, getFlag: (s, k) => (s === "lancer" && k === "attackData" ? { attackerItemUuid: "Item.w", targets: [{ uuid: "Scene.s.Token.a", hit: true }, { uuid: "Scene.s.Token.b", crit: true }, { uuid: "Scene.s.Token.c", hit: false }] } : undefined) };
		onRenderChatMessage(message, [root]);
		ok(/data-lancer-cn-status="slow"/.test(inserted) && !/jammed/.test(inserted) && /命中效果/.test(inserted), "攻击卡应出现「缓慢」按钮，不出现「受扰」");
		await clickHandler({ target: { closest: () => ({ dataset: { lancerCnStatus: "slow" } }) } });
		ok(own.statuses.has("slow") && !missed.statuses.has("slow"), "点击后施加到命中的目标，未命中的不施加");
		ok(!npc.statuses.has("slow") && emitted.length === 1 && emitted[0][0] === "module.lancer-cn" && emitted[0][1].uuid === "Scene.s.Token.b" && emitted[0][1].status === "slow", "没有权限的目标通过 socket 请 GM 施加");
		ok(notes.some(s => /2 个目标/.test(s)), "提示施加了几个目标");
		// GM 端 socket
		hooks["once:ready"]?.();
		ok(typeof ctx.__socket === "function", "ready 时应监听模组 socket");
		ctx.game.users.activeGM.isSelf = true;
		npc.isOwner = true;
		await ctx.__socket({ action: "applyStatus", uuid: "Scene.s.Token.b", status: "slow" });
		ok(npc.statuses.has("slow"), "GM 收到请求后施加状态");
		await ctx.__socket({ action: "applyStatus", uuid: "Scene.s.Token.b", status: "burn" });
		ok(!npc.statuses.has("burn"), "只接受规定的状态");
		// 没有攻击数据、或文字里没有状态的卡不加按钮
		inserted = "";
		onRenderChatMessage({ isAuthor: true, getFlag: () => undefined }, [root]);
		ok(!inserted, "非攻击卡不加按钮");
		tokens["Item.w"] = { system: { active_profile: { on_hit: "造成 2 额外伤害。" }, profiles: [] } };
		onRenderChatMessage(message, [root]);
		ok(!inserted, "命中效果里没有状态时不加按钮");
		onRenderChatMessage({ ...message, isAuthor: false }, [root]);
		ok(!inserted, "不是攻击者也不是 GM 时不显示按钮");
	}

	// ---- 指示物名字与浮动文字（2026-11-11）
	{
		const L = ctx.LancerCN;
		const s = log.settings["lancer-cn.tokenNames"];
		ok(s && s.scope === "world" && s.config && s.default === "always" && s.choices?.keep && s.choices.hover && s.choices.always, "应注册世界设置「指示物显示名字」，默认始终显示");
		ok(log.settings["lancer-cn.floatingNumbersOn"]?.scope === "client" && log.settings["lancer-cn.floatingNumbersOn"].config === false, "浮动伤害数字的一次性开启标记是隐藏的客户端设置");
		ok(typeof hooks.preCreateToken === "function", "应监听 preCreateToken");
		ctx.CONST.TOKEN_DISPLAY_MODES = { NONE: 0, CONTROL: 10, OWNER_HOVER: 20, HOVER: 30, OWNER: 40, ALWAYS: 50 };
		const mkDoc = displayName => ({ displayName, updateSource(d) { Object.assign(this, d); } });
		let d = mkDoc(0);
		hooks.preCreateToken(d);
		ok(d.displayName === 50, "默认：新放上的指示物始终显示名字");
		log.settingValues["lancer-cn.tokenNames"] = "hover";
		d = mkDoc(0); hooks.preCreateToken(d);
		ok(d.displayName === 30, "选「悬停时」：显示模式为 HOVER");
		log.settingValues["lancer-cn.tokenNames"] = "keep";
		d = mkDoc(10); hooks.preCreateToken(d);
		ok(d.displayName === 10, "选「不改」：保留角色的指示物设置");

		// 已放好的指示物：只由在线的 GM 改，只改不一致的
		log.settingValues["lancer-cn.tokenNames"] = "always";
		const sceneUpdates = [];
		const mkScene = (id, list) => ({ id, tokens: list, updateEmbeddedDocuments: async (t, u) => {
			sceneUpdates.push([id, t, JSON.parse(JSON.stringify(u))]);
			for (const x of u) Object.assign(list.find(tk => tk.id === x._id), { displayName: x.displayName });
		} });
		ctx.game.scenes = [mkScene("s1", [{ id: "a", displayName: 0 }, { id: "b", displayName: 50 }]), mkScene("s2", [{ id: "c", displayName: 30 }]), mkScene("s3", [])];
		ctx.game.users = { activeGM: { isSelf: false } };
		ok(await L.applyTokenNames() === 0 && !sceneUpdates.length, "不是负责的 GM 时不改已有指示物");
		ctx.game.users.activeGM.isSelf = true;
		const n = await L.applyTokenNames();
		ok(n === 2 && sceneUpdates.length === 2 && sceneUpdates.every(([, t]) => t === "Token") && JSON.stringify(sceneUpdates.map(([id, , u]) => [id, u])) === JSON.stringify([["s1", [{ _id: "a", displayName: 50 }]], ["s2", [{ _id: "c", displayName: 50 }]]]), "GM 把各场景里不一致的指示物改成始终显示");
		log.settingValues["lancer-cn.tokenNames"] = "keep";
		sceneUpdates.length = 0;
		ok(await L.applyTokenNames() === 0 && !sceneUpdates.length, "「不改」时不动已有指示物");
		ok(typeof s.onChange === "function", "改设置时同步已有指示物");

		// 第一次载入：打开 LANCER 的浮动伤害数字（只一次），GM 同步已有指示物（只一次）
		log.settingValues["lancer-cn.tokenNames"] = "always";
		ctx.game.scenes[0].tokens[0].displayName = 0;
		sceneUpdates.length = 0;
		const sets = [];
		ctx.game.settings.set = async (m, k, v) => { sets.push(`${m}.${k}=${v}`); log.settingValues[`${m}.${k}`] = v; };
		await L.setupNamesAndNumbers();
		ok(sets.includes("lancer.floatingNumbers=true") && sets.includes("lancer-cn.floatingNumbersOn=true"), "第一次载入时打开 LANCER 的浮动伤害数字");
		ok(sets.includes("lancer-cn.tokenNamesApplied=true") && sceneUpdates.length === 1, "第一次启用时 GM 同步已有指示物");
		log.settingValues["lancer.floatingNumbers"] = false; // 玩家之后自己关掉
		sets.length = 0; sceneUpdates.length = 0;
		await L.setupNamesAndNumbers();
		ok(!sets.length && !sceneUpdates.length, "之后不再改玩家的设置，也不再批量改指示物");

		// 浮动文字：状态改成醒目的样式，数值照旧翻译
		const shown = [];
		class InterfaceCanvasGroup { createScrollingText(o, c, opt) { shown.push([c, opt]); } }
		ctx.foundry.canvas = { groups: { InterfaceCanvasGroup } };
		L.patchScrollingText();
		L.patchScrollingText();
		const ig = new InterfaceCanvasGroup();
		ig.createScrollingText({}, "+(缓慢)", { fontSize: 28, direction: 1 });
		ig.createScrollingText({}, "-(掩护 - 软性)", { fontSize: 28 });
		ig.createScrollingText({}, "+2 Heat", { fontSize: 28 });
		ok(shown.length === 3, "重复包装不会重复显示");
		ok(shown[0][0] === "+ 缓慢" && shown[0][1].fontSize === 32 && shown[0][1].fill === 0xffd34d && shown[0][1].direction === 1, "获得状态：「+ 缓慢」，加大、黄色，保留原来的方向");
		ok(shown[1][0] === "- 掩护 - 软性" && shown[1][1].fill === 0xb4b4b4, "去掉状态：「- 掩护 - 软性」，灰色");
		ok(shown[2][0] === "+2 热度" && shown[2][1].fontSize === 28, "数值变化照旧翻译，不改样式");
	}

	// ---- 基础动作、受限次数、文字里的骰子（2026-11-11）
	{
		const L = ctx.LancerCN;
		const B = L.BASIC_ACTIONS;
		const keysOf = t => Object.keys(B).filter(k => B[k].actors.includes(t)).join();
		ok(keysOf("mech") === "fragment,lockon,bolster,grapple,breakGrapple,ram,improvised,hide,search,overwatch,brace,standUp,disengage,prepare,shutDown,bootUp,selfDestruct,eject,mountDismount", "机甲的基础动作完整覆盖核心规则书动作表（含守望）");
		ok(keysOf("npc") === "breakGrapple,overwatch,standUp,disengage,prepare,npcInvade,npcLockon,npcGrapple,npcRam,npcHide,npcSearch,npcImprovised,npcStabilize", "NPC 的基础动作覆盖专属动作与通用挣脱/守望/起身/脱离/准备");
		ok(keysOf("pilot") === "standUp,disengage,prepare,mountDismount,pilotJockey,pilotPatch,pilotReload,pilotHide,pilotSearch", "驾驶员的基础动作覆盖步战骑乘/包扎/装填/躲藏/搜索及通用动作");
		ok(B.npcInvade.flow === "TechAttackFlow" && B.npcInvade.invade && B.npcInvade.statuses.join() === "impaired" && /以系统对抗电子防御/.test(B.npcInvade.effect), "NPC 入侵：只有受损，没有缓慢");
		ok(["npcGrapple", "npcRam", "npcImprovised"].every(k => B[k].effect.includes("+1/2/3 加值")) && B.npcRam.statuses.join() === "prone", "NPC 擒拿、冲撞、权宜攻击照录 +1/2/3 加值");
		ok([1, 2, 3, 9].map(t => B.npcImprovised.damage({ system: { tier: t } })[0].val).join() === "3,4,6,6", "NPC 权宜攻击按层级 3/4/6 伤害");
		ok(B.npcImprovised.kind === "完整动作" && B.npcStabilize.kind === "完整动作" && ["npcHide", "npcSearch", "npcGrapple", "npcRam"].every(k => B[k].kind === "快速动作"), "NPC 动作的快速 / 完整分类");
		ok(!/npcStabilize|npcHide/.test(L.basicActionsHTML("mech")) && /data-lancer-cn-basic="npcStabilize"/.test(L.basicActionsHTML("npc")) && !/data-lancer-cn-basic="fragment"/.test(L.basicActionsHTML("npc")), "机甲与 NPC 各显示自己的按钮");
		ok(B.fragment.flow === "TechAttackFlow" && B.fragment.invade && B.fragment.statuses.join() === "impaired,slow" && /受损/.test(B.fragment.effect) && /2 热度/.test(B.fragment.effect), "破碎讯号：入侵（科技攻击），命中受损且缓慢");
		ok(B.grapple.kind === "快速动作" && B.ram.kind === "快速动作" && B.improvised.kind === "完整动作", "擒拿、冲撞是快速动作，权宜攻击是完整动作");
		ok(B.ram.statuses.join() === "prone" && B.grapple.statuses.length === 0 && B.improvised.damage()[0].val === "1d6" && B.improvised.damage()[0].type === "Kinetic", "冲撞施加伏卧；权宜攻击 1d6 动能");
		ok([B.grapple, B.ram, B.improvised].every(d => d.flow === "BasicAttackFlow" && d.reach === 1), "擒拿、冲撞、权宜攻击是邻接的近战攻击");
		ok(L.attackReach({ lancerCnBasic: "ram", state: {} }).reach === 1, "目标面板按邻接标射程");
		const html = L.basicActionsHTML();
		ok(["fragment", "lockon", "grapple", "ram", "improvised"].every(k => html.includes(`data-lancer-cn-basic="${k}"`)) && /基础动作/.test(html), "机甲表的基础动作卡片");

		// 卡片位置：只认「战斗工具」按钮栏里的基础攻击按钮（毅力卡片上也有一个，1.8.0 曾插到那里）
		{
			const placed = [];
			const mkCard = name => ({ insertAdjacentHTML: (pos, h) => placed.push([name, pos, h]) });
			const gritBtn = { closest: () => mkCard("毅力") }, gridBtn = { closest: () => mkCard("战斗工具") };
			const btnEl = { dataset: { lancerCnBasic: "npcHide" }, onclick: null };
			const sheetRoot = {
				dataset: {}, addEventListener() {}, querySelectorAll: sel => (sel.includes("[data-lancer-cn-basic]") ? [btnEl] : []),
				querySelector: sel => (sel === ".lancer-cn-basic" ? (placed.length ? { insertAdjacentHTML() {} } : null)
					: sel.includes('[data-flow-type="BasicAttack"]') ? (sel.includes(".lancer-flow-button-grid") ? gridBtn : gritBtn) : null),
			};
			ctx.HTMLElement = class {};
			L.onRenderActorSheet({ actor: { type: "npc", isOwner: true } }, [sheetRoot]);
			ok(placed.length === 1 && placed[0][0] === "战斗工具" && placed[0][1] === "afterend" && /npcStabilize/.test(placed[0][2]), "基础动作卡片插在「战斗工具」卡片之后，不在毅力卡片");
			ok(typeof btnEl.onclick === "function", "按钮直接绑定点击（1.8.2：表单根元素上的委托在实际 Foundry 中无反应）");
			ok(/a\.onclick = onDiceClick/.test(script) && /event\.lancerCnDice/.test(script), "骰子链接自己也绑定点击，与 window 监听不会重复掷");
			ok(/for \(const h of \["init", "setup"\]\) Hooks\.once\(h/.test(script) && /refreshDiceLimited\(\);/.test(script), "受限上限补丁在 init / setup / ready 都会套用，ready 时重算");
		}

		// 发起：标题经 begin(data) 传入；攻击卡记上动作
		const begun = [];
		class FakeFlow {
			constructor(uuid, data) { this.uuid = uuid; this.state = { data: { title: data.title, invade: !!data.invade, effect: data.effect, extra: 1 } }; }
			async begin(data) { begun.push({ name: this.constructor.name, flow: this, data }); L.onPreCreateBasicCard(this.msg); return true; }
		}
		class TechAttackFlow extends FakeFlow {}
		class BasicAttackFlow extends FakeFlow {}
		const damageFlows = [];
		class DamageRollFlow { constructor(uuid, data) { damageFlows.push({ uuid, data }); } async begin() { return true; } }
		ctx.game.lancer = { flows: new Map([["TechAttackFlow", TechAttackFlow], ["BasicAttackFlow", BasicAttackFlow], ["DamageRollFlow", DamageRollFlow]]) };
		const mech = { uuid: "Actor.m", type: "mech", name: "测试机甲", isOwner: true };
		const sourced = [];
		const mkMsg = (attackerUuid, item) => ({ flags: { lancer: { attackData: { attackerUuid, attackerItemUuid: item } } }, updateSource(u) { sourced.push(u); } });
		FakeFlow.prototype.msg = mkMsg("Actor.m");
		await L.beginBasicAction(mech, "fragment");
		let b = begun.at(-1);
		ok(b.name === "TechAttackFlow" && b.data.title === "破碎讯号（快速科技）" && b.data.invade === true && /破碎讯号/.test(b.data.effect) && b.data.extra === 1, "破碎讯号以科技攻击发起，begin 时带快速科技标题、入侵与说明");
		ok(L.translate("INVADE :: 破碎讯号（快速科技）") === "入侵 :: 破碎讯号（快速科技）", "破碎讯号聊天卡标题同时标明入侵类别与快速科技消耗且不重复入侵前缀");
		ok(b.flow.lancerCnBasic === "fragment", "flow 上记下基础动作");
		ok(sourced.length === 1 && sourced[0]["flags.lancer-cn.basicAction"] === "fragment", "攻击卡记上基础动作");
		await L.beginBasicAction(mech, "improvised");
		b = begun.at(-1);
		ok(b.name === "BasicAttackFlow" && b.data.title === "权宜攻击" && !b.data.invade, "权宜攻击以基础攻击发起");
		sourced.length = 0;
		L.onPreCreateBasicCard(mkMsg("Actor.m"));
		ok(!sourced.length, "动作结束后不再给其他卡片记标记");
		FakeFlow.prototype.msg = mkMsg("Actor.m", "Item.w");
		await L.beginBasicAction(mech, "ram");
		ok(!sourced.length, "带物品的攻击卡不记基础动作");

		// 聊天卡：冲撞给伏卧按钮
		let inserted = "";
		const content = { insertAdjacentHTML: (pos, h) => { inserted = h; }, querySelector: sel => (sel === ".lancer-cn-status-row" ? { addEventListener() {} } : null) };
		const root = { querySelector: sel => (sel === ".message-content" ? content : null) };
		ctx.game.user = { isGM: true };
		const ramMsg = { isAuthor: true, getFlag: (s, k) => (s === "lancer" && k === "attackData" ? { attackerUuid: "Actor.m", targets: [] } : s === "lancer-cn" && k === "basicAction" ? "ram" : undefined) };
		L.onRenderChatMessage(ramMsg, [root]);
		ok(/data-lancer-cn-status="prone"/.test(inserted), "冲撞的攻击卡出现「伏卧」按钮");
		inserted = "";
		L.onRenderChatMessage({ ...ramMsg, getFlag: (s, k) => (s === "lancer-cn" ? "fragment" : ramMsg.getFlag(s, k)) }, [root]);
		ok(/data-lancer-cn-status="impaired"/.test(inserted) && /data-lancer-cn-status="slow"/.test(inserted), "破碎讯号的攻击卡出现「受损」「缓慢」按钮");

		// NPC：锁定当前目标、躲藏、搜索、稳住阵脚
		{
			const cards = [];
			ctx.ChatMessage = { getSpeaker: o => ({ actor: o?.actor?.name }), create: async d => cards.push(d) };
			ctx.escHtml = undefined;
			const statusesOf = {};
			const mkTokActor = (id, owner) => { const a = { isOwner: owner, statuses: new Set() }; a.toggleStatusEffect = async (sid, { active }) => { active ? a.statuses.add(sid) : a.statuses.delete(sid); }; statusesOf[id] = a; return a; };
			const tA = mkTokActor("Scene.s.Token.x", true), tB = mkTokActor("Scene.s.Token.y", false);
			const prevSync = ctx.fromUuidSync;
			ctx.fromUuidSync = uuid => (statusesOf[uuid] ? { actor: statusesOf[uuid] } : prevSync(uuid));
			const emitted = [];
			ctx.game.socket = { emit: (ch, m) => emitted.push(m) };
			ctx.game.users = { activeGM: { isSelf: false } };
			ctx.ui = { notifications: { info() {}, warn: w => cards.push({ warn: w }), error() {} } };
			const npc = mkTokActor("npc", true);
			Object.assign(npc, { uuid: "Actor.n", type: "npc", name: "NPC", system: { tier: 2, heat: { value: 3 } } });
			ctx.game.user = { isGM: true, targets: new Set() };
			ok(await L.beginBasicAction(npc, "npcLockon") === false && cards.at(-1).warn, "没有目标时提示先选目标");
			ctx.game.user.targets = new Set([{ name: "甲", document: { uuid: "Scene.s.Token.x" } }, { name: "乙", document: { uuid: "Scene.s.Token.y" } }]);
			await L.beginBasicAction(npc, "npcLockon");
			ok(tA.statuses.has("lockon") && emitted.some(m => m.uuid === "Scene.s.Token.y" && m.status === "lockon"), "锁定：自己的目标直接加，别人的请 GM 加");
			ok(/锁定/.test(cards.at(-1).content) && /甲、乙/.test(cards.at(-1).content), "锁定发说明卡，列出目标");
			await L.beginBasicAction(npc, "npcHide");
			ok(npc.statuses.has("hidden") && /匿迹/.test(cards.at(-1).content), "躲藏：自己获得匿迹");
			const statFlows = [];
			ctx.game.lancer.flows.set("StatRollFlow", class { constructor(u, d) { this.state = { data: { ...d, roll_str: "1d20" } }; } async begin(d) { statFlows.push(d); return true; } });
			await L.beginBasicAction(npc, "npcSearch");
			ok(statFlows.at(-1)?.path === "system.sys" && /搜索/.test(statFlows.at(-1).title), "搜索：系统检定");
			// 稳住阵脚
			npc.statuses.add("exposed");
			const updates = [];
			npc.update = async u => { updates.push(u); npc.system.heat.value = 0; };
			npc.items = [
				{ id: "w1", name: "加农炮", type: "npc_feature", system: { loaded: false, tags: [{ is_loading: true }] } },
				{ id: "w2", name: "步枪", type: "npc_feature", system: { loaded: true, tags: [{ is_loading: true }] } },
				{ id: "w3", name: "刀", type: "npc_feature", system: { loaded: false, tags: [] } },
			];
			npc.updateEmbeddedDocuments = async (t, u) => updates.push([t, u]);
			await L.beginBasicAction(npc, "npcStabilize");
			ok(updates[0]["system.heat.value"] === 0 && !npc.statuses.has("exposed"), "稳住阵脚：热度归零、清除暴露");
			ok(JSON.stringify(updates[1]) === JSON.stringify(["Item", [{ _id: "w1", "system.loaded": true }]]), "稳住阵脚：只填装未填装的装填武器");
			ok(/加农炮/.test(cards.at(-1).content) && /热度归零/.test(cards.at(-1).content), "稳住阵脚发说明卡");
			ctx.fromUuidSync = prevSync;
			ctx.game.user = { isGM: true };
		}

		// 权宜攻击掷伤害：拦下系统按钮，预填 1d6 动能
		const tokenObj = { id: "tok" };
		const impMsg = { getFlag: (s, k) => (s === "lancer" ? { attackerUuid: "Actor.m", targets: [{ uuid: "Scene.s.Token.t", hit: true, total: 15 }] } : k === "basicAction" ? "improvised" : undefined) };
		ctx.game.messages = { get: id => (id === "M1" ? impMsg : id === "M2" ? ramMsg : null) };
		ctx.fromUuid = async uuid => (uuid === "Actor.m" ? mech : null);
		ctx.fromUuidSync = uuid => (uuid === "Scene.s.Token.t" ? { object: tokenObj } : null);
		let stopped = 0;
		const ev = id => ({ target: { closest: sel => (sel === ".lancer-damage-flow" ? { closest: () => ({ dataset: { messageId: id } }) } : null) }, preventDefault() {}, stopPropagation() { stopped++; }, stopImmediatePropagation() {} });
		L.onBasicDamageClick(ev("M1"));
		await new Promise(r => setTimeout(r, 0));
		const df = damageFlows.at(-1);
		ok(stopped === 1 && df && df.data.damage[0].val === "1d6" && df.data.damage[0].type === "Kinetic" && df.data.hit_results[0].target === tokenObj && df.data.has_normal_hit, "权宜攻击的伤害按钮预填 1d6 动能，命中目标照旧");
		L.onBasicDamageClick(ev("M2"));
		ok(stopped === 1, "其他攻击卡的伤害按钮交给系统");
		ok((ctx.windowListeners.click || []).filter(l => l.opts?.capture).length >= 2, "伤害按钮与骰子链接在 window 捕获阶段监听");

		// 掷骰式受限：上限按掷出的结果 + 受限加值
		ok(script.includes('const has = new RegExp(DICE_IN_TEXT.source, "i")'), "骰子链接：判断用不带 g 的正则（matchAll 沿用 lastIndex 会漏掉第一个骰子，2026-11-11 浏览器检查发现）");
		ok(L.isDiceFormula("1d6+2") && L.isDiceFormula("2d6") && !L.isDiceFormula("3") && !L.isDiceFormula(3), "识别掷骰式受限值");
		class Item { prepareFinalAttributes() { this.system.uses.max = 1; } getTags() { return this.tags; } getFlag(m, k) { return this.flags?.[m]?.[k]; } }
		ctx.CONFIG = { ...ctx.CONFIG, Item: { ...ctx.CONFIG?.Item, documentClass: Item } };
		hooks["once:setup"]();
		L.patchLimitedMax();
		const proto = new Item();
		Object.assign(proto, { name: "原型武器 I", tags: [{ is_limited: true, val: "1d6+2" }], system: { uses: { value: 0, max: 0 } }, actor: { type: "mech", system: { loadout: { limited_bonus: 2 } } } });
		proto.prepareFinalAttributes();
		ok(proto.system.uses.max === 0, "没掷过时上限为 0");
		proto.flags = { "lancer-cn": { limitedRoll: 5 } };
		proto.prepareFinalAttributes();
		ok(proto.system.uses.max === 7, "上限 = 掷出的 5 + 受限加值 2");
		const plain = Object.assign(new Item(), { tags: [{ is_limited: true, val: "3" }], system: { uses: { max: 0 } } });
		plain.prepareFinalAttributes();
		ok(plain.system.uses.max === 1, "数字受限值不改（交给系统）");
		const rolls = [];
		ctx.Roll = class { constructor(f) { this.formula = f; } async evaluate() { this.total = 4; return this; } async toMessage(d) { rolls.push([this.formula, d.flavor]); } };
		ctx.ChatMessage = { getSpeaker: o => ({ actor: o?.actor?.name }) };
		const upd = [];
		proto.update = async u => upd.push(u);
		ok(await L.rollLimited(proto) === 6 && rolls.at(-1)[0] === "1d6+2" && /原型武器 I/.test(rolls.at(-1)[1]) && upd.at(-1)["flags.lancer-cn.limitedRoll"] === 4 && upd.at(-1)["system.uses"] === 6, "掷受限次数：记下结果并回满（4 + 2）");

		// 文字里的受限
		const frame = { id: "F", type: "frame", name: "孙子", system: { core_system: { passive_name: "霎间锚点（快速动作，受限3）", passive_effect: "霎间锚点（大小1/2，标签：可展开，受限3）。" }, traits: [] }, getTags: () => [] };
		const sys = { id: "S", type: "mech_system", name: "“诡术师”干扰套组", system: { effect: "", actions: [{ name: "隐没", detail: "（受限 1）你消失在全息编码中。" }] }, getTags: () => [] };
		const tagged = { id: "T", type: "mech_system", name: "猎犬", system: { effect: "群聚动力学 完整动作，受限 1" }, getTags: () => [{ is_limited: true, val: "1" }] };
		const talent = { id: "K", type: "talent", name: "工兵", system: { curr_rank: 2, ranks: [{ name: "一", description: "<p><b>弹药库</b>（0 SP、受限6、每回合1次）</p>" }, { name: "二", description: "爆破者工具箱 0SP，4 受限1/回合" }, { name: "三", description: "受限2" }] }, getTags: () => null };
		const fc = L.textLimitedOf(frame);
		ok(fc.length === 1 && fc[0].label === "孙子 · 霎间锚点" && fc[0].max === "3", "骨架核心系统的受限：一个计数器（重复写的合并）");
		const sc = L.textLimitedOf(sys);
		ok(sc.length === 1 && sc[0].label === "“诡术师”干扰套组 · 隐没" && sc[0].max === "1", "系统动作的受限");
		ok(L.textLimitedOf(tagged).length === 0, "已有受限标签的物品由系统计数");
		ok(L.textLimitedOf(talent).length === 0, "天赋里的装备摘要与「受限1/回合」不计；未解锁的等级不计");
		const flags = {};
		const mech2 = { type: "mech", items: [frame, sys, tagged], system: { pilot: { value: { itemTypes: { talent: [talent] } } } },
			getFlag: (m, k) => k.split(".").reduce((o, x) => o?.[x], flags[m]), setFlag: async (m, k, v) => { const [a, b] = k.split("."); ((flags[m] ||= {})[a] ||= {})[b] = v; },
			unsetFlag: async (m, k) => { const [a, b] = k.split("."); delete flags[m]?.[a]?.[b]; } };
		const counters = L.textCounters(mech2);
		ok(counters.length === 2, "机甲的文字受限：骨架与系统各一个");
		ok(JSON.stringify(L.counterState(mech2, counters[0])) === '{"max":3,"value":3}', "默认回满");
		await mech2.setFlag("lancer-cn", `counters.${counters[0].key}`, { value: 1 });
		ok(L.counterState(mech2, counters[0]).value === 1, "记下剩余次数");
		await L.resetCounters(mech2);
		ok(L.counterState(mech2, counters[0]).value === 3, "全部回满");

		// 全面维修：重掷掷骰式受限、回满文字受限
		const pilotActor = { type: "pilot", isOwner: true, items: [], system: { active_mech: { value: { ...mech2, isOwner: true, items: [proto, frame, sys] } } } };
		await pilotActor.system.active_mech.value.setFlag("lancer-cn", `counters.${counters[1].key}`, { value: 0 });
		const nRolls = rolls.length;
		await L.onFullRepair({ state: { actor: pilotActor } }, true);
		ok(rolls.length === nRolls + 1 && L.counterState(mech2, counters[1]).value === 1, "全面维修后重掷原型武器的受限，文字受限回满");
		await L.onFullRepair({ state: { actor: pilotActor } }, false);
		ok(rolls.length === nRolls + 1, "全面维修取消时不处理");
	}

	// ---- 战斗自动化（1.10.0）：自动挂异常与撤销、豁免检定与减半联动、非攻击掷伤害与模板、跨权限护甲抗性结算与预览、Flow 补完、回合结束清异常、抗性开关
	{
		const L = ctx.LancerCN;
		ok(manifest.version === "1.22.0", "清单版本应为 1.22.0");
		for (const k of ["autoApplyStatus", "crossPermDamage", "autoDangerZone", "turnEndPrompt", "overwatchPrompt", "autoDeployableCover"]) {
			const cfg = log.settings[`lancer-cn.${k}`];
			ok(cfg && cfg.scope === "world" && cfg.config === true && cfg.default === true, `应注册世界设置 ${k}（默认开启）`);
		}

		// 1. 攻击卡分类：严格区分无条件命中、无条件暴击与豁免前置状态
		const wpn = {
			name: "重型磁轨炮",
			system: {
				active_profile: {
					on_hit: "目标伏卧，且你可以将其击退 1。",
					on_crit: "目标陷入晕眩直到其下一回合结束。",
					effect: "命中时，目标必须通过机体豁免，否则受损。你可以在受扰下使用该武器。",
				},
			},
		};
		const cls = L.classifyAttackCard(wpn, null, 13);
		ok(cls.autoHitStatuses.join(",") === "prone", "无条件命中状态只收「伏卧」（忽略后续击退选项与豁免后的受损）");
		ok(cls.autoCritStatuses.join(",") === "stunned", "无条件会心状态只收「晕眩」");
		ok(cls.saves.length === 1 && cls.saves[0].key === "hull" && cls.saves[0].dc === 13 && cls.saves[0].failStatuses.join(",") === "impaired", "豁免前置的「受损」归入机体豁免失败状态，不提前自动施加");
		ok(cls.allStatuses.sort().join(",") === "impaired,prone,stunned", "手动状态列表仍保留全部目标状态");
		const npcColonCls = L.classifyAttackCard({ system: { effect: "命中：目标受到锁定。会心：目标陷入固定。" } }, null, 12);
		ok(npcColonCls.autoHitStatuses.join(",") === "lockon" && npcColonCls.autoCritStatuses.join(",") === "immobilized", "识别 NPC 武器「命中：受到锁定」与「会心：陷入固定」写法");
		const halfAltSave = L.parseSavesInText("区域内的角色必须通过敏捷豁免，否则受到 2d6 爆炸伤害，成功的话受到一半伤害。", { dc: 12 });
		ok(halfAltSave.length === 1 && halfAltSave[0].key === "agi" && halfAltSave[0].halfOnSuccess === true, "识别「成功的话受到一半伤害」为豁免成功减半");

		// 2. 自动挂异常 + 消除消耗的锁定 + 「↩ 撤销状态」（不误删原有状态）
		const mkAutoActor = (name, isOwner, initStatuses = [], extra = {}) => {
			const a = {
				uuid: `Actor.${name}`, name, type: extra.type ?? "mech", isOwner,
				statuses: new Set(initStatuses),
				system: {
					save: extra.save ?? 12, tier: extra.tier ?? 1,
					armor: extra.armor ?? 0, burn: extra.burn ?? 0,
					hp: { value: extra.hp ?? 12, max: extra.hpMax ?? 12 },
					overshield: { value: extra.overshield ?? 0 },
					heat: { value: extra.heat ?? 0, max: extra.heatMax ?? 6 },
					structure: { value: extra.structure ?? 4, max: extra.structureMax ?? 4 },
					stress: { value: extra.stress ?? 4, max: extra.stressMax ?? 4 },
					hull: 2, agi: 1, sys: 0, eng: -1,
					statuses: {}, resistances: {},
				},
				updates: [],
				async toggleStatusEffect(id, { active }) { active ? a.statuses.add(id) : a.statuses.delete(id); },
				async update(u) { a.updates.push(u); for (const [k, v] of Object.entries(u)) { if (k === "system.heat.value") a.system.heat.value = v; if (k === "system.hp.value") a.system.hp.value = v; } },
			};
			return a;
		};
		const attacker = mkAutoActor("攻击者", true, [], { save: 14 });
		const hitOwned = mkAutoActor("甲", true, ["prone", "lockon"]); // 原本已伏卧且被锁定
		const critNpc = mkAutoActor("乙", false, ["lockon"], { type: "npc", armor: 2 }); // 非拥有者 NPC，被锁定且会心命中
		const missNpc = mkAutoActor("丙", true, []);
		const docMap = {
			"Actor.攻击者": attacker,
			"Item.rail": wpn,
			"Scene.s.Token.a": { uuid: "Scene.s.Token.a", name: "甲", actor: hitOwned, object: { id: "tokA", name: "甲", actor: hitOwned, document: { uuid: "Scene.s.Token.a" } } },
			"Scene.s.Token.b": { uuid: "Scene.s.Token.b", name: "乙", actor: critNpc, object: { id: "tokB", name: "乙", actor: critNpc, document: { uuid: "Scene.s.Token.b" } } },
			"Scene.s.Token.c": { uuid: "Scene.s.Token.c", name: "丙", actor: missNpc, object: { id: "tokC", name: "丙", actor: missNpc, document: { uuid: "Scene.s.Token.c" } } },
		};
		ctx.fromUuidSync = u => docMap[u] ?? null;
		ctx.fromUuid = async u => docMap[u] ?? null;
		const socketSent = [];
		const chatCreated = [];
		ctx.ChatMessage = { getSpeaker: o => ({ actor: o?.actor?.name }), create: async d => { chatCreated.push(d); return d; } };
		ctx.ui = { notifications: { info() {}, warn() {}, error() {} } };
		ctx.game = {
			...ctx.game,
			user: { id: "u1", isGM: false, targets: new Set() },
			users: { activeGM: { isSelf: false } },
			messages: new Map(),
			socket: {
				emit: (ch, m) => socketSent.push([ch, m]),
				on: (ch, fn) => { ctx.__gmSocket = fn; },
			},
		};
		hooks["once:ready"]?.();

		const mkFlagMsg = (id, initFlags, { isAuthor = true, content = "", speaker = undefined } = {}) => {
			const store = JSON.parse(JSON.stringify(initFlags));
			const m = {
				id, isAuthor, content, speaker, flags: store,
				getFlag: (scope, key) => store?.[scope]?.[key],
				setFlag: async (scope, key, val) => { (store[scope] ||= {})[key] = val; },
				update: async u => { if ("content" in u) m.content = u.content; },
			};
			ctx.game.messages.set(id, m);
			return m;
		};

		const atkMsg = mkFlagMsg("atk1", {
			lancer: {
				attackData: {
					attackerUuid: "Actor.攻击者",
					attackerItemUuid: "Item.rail",
					targets: [
						{ uuid: "Scene.s.Token.a", hit: true, crit: false, setConditions: { lockon: false } },
						{ uuid: "Scene.s.Token.b", hit: true, crit: true, setConditions: { lockon: false } },
						{ uuid: "Scene.s.Token.c", hit: false, crit: false },
					],
				},
			},
		});
		await L.onCreateChatMessage(atkMsg, {}, "u1");
		ok(!hitOwned.statuses.has("lockon"), "消耗锁定后：拥有者的目标直接移除锁定状态");
		ok(!hitOwned.statuses.has("stunned") && hitOwned.statuses.has("prone"), "普通命中不施加会心专属的「晕眩」");
		ok(socketSent.some(([, m]) => m.action === "removeStatus" && m.uuid === "Scene.s.Token.b" && m.status === "lockon"), "非拥有者目标消耗锁定时通过 socket 请求 GM 移除锁定");
		ok(socketSent.some(([, m]) => m.action === "applyStatus" && m.uuid === "Scene.s.Token.b" && m.status === "prone") && socketSent.some(([, m]) => m.action === "applyStatus" && m.uuid === "Scene.s.Token.b" && m.status === "stunned"), "会心命中的非拥有者目标通过 socket 自动施加「伏卧」与「晕眩」");
		const appliedRec = atkMsg.getFlag("lancer-cn", "appliedStatuses");
		ok(appliedRec.length === 1 && appliedRec[0].uuid === "Scene.s.Token.b" && appliedRec[0].statuses.join(",") === "prone,stunned", "只记录本次新挂上的状态（甲原本已有伏卧，不计入可撤销记录）");

		// GM 执行队列请求后，测试「↩ 撤销状态」
		ctx.game.users.activeGM.isSelf = true;
		critNpc.isOwner = true;
		for (const [, m] of socketSent) await ctx.__gmSocket(m);
		ok(!critNpc.statuses.has("lockon") && critNpc.statuses.has("prone") && critNpc.statuses.has("stunned"), "GM 端正确执行跨权限移除锁定与施加异常");
		socketSent.length = 0;
		ctx.game.users.activeGM.isSelf = false;
		critNpc.isOwner = false;
		await L.undoAppliedStatuses(atkMsg);
		ok(hitOwned.statuses.has("prone"), "撤销状态不会误删目标原本就有的「伏卧」");
		ok(socketSent.filter(([, m]) => m.action === "removeStatus" && m.uuid === "Scene.s.Token.b").map(([, m]) => m.status).sort().join(",") === "prone,stunned", "撤销状态对新挂上的状态发出移除请求");
		ok(atkMsg.getFlag("lancer-cn", "appliedStatusesUndone") === true, "卡片标记为已撤销");

		// 3. 自身增益 / 抗性识别与自动施加 vs 盟友增益不误加给自己
		const selfBrace = L.selfStatusesIn("直到你的下一回合结束，你获得对所有伤害的抗性，并进入隐形。");
		ok(selfBrace.auto.length === 6 && selfBrace.auto.includes("resistance_kinetic") && selfBrace.auto.includes("resistance_burn") && selfBrace.auto.includes("invisible"), "识别自身全伤害抗性（5 种抗性）与隐形为自动增益");
		const allyBuff = L.selfStatusesIn("选择感应内的一个盟友，使其获得支援与动能抗性。");
		ok(allyBuff.auto.length === 0 && allyBuff.manual.sort().join(",") === "bolster,resistance_kinetic", "针对盟友的增益归入手动按钮，不自动误加给自己");
		const nonSelfInv = L.selfStatusesIn("目标无法受益于匿迹和隐形。地雷是隐形的，直到触发。");
		ok(nonSelfInv.auto.length === 0 && nonSelfInv.manual.length === 0, "否定受益句与地雷隐形描述不会误判为自身获得隐形");

		const sysItem = { uuid: "Item.brace", documentName: "Item", name: "准备招架", actor: attacker, parent: attacker, system: { effect: "直到你的下一回合结束，你获得对所有伤害的抗性。" } };
		docMap["Item.brace"] = sysItem;
		const sysMsg = mkFlagMsg("sys1", {}, { content: `<div class="card" data-uuid="Item.brace"><div class="lancer-header">准备招架</div><div class="effect-text">直到你的下一回合结束，你获得对所有伤害的抗性。</div></div>` });
		await L.onCreateChatMessage(sysMsg, {}, "u1");
		ok(L.RESIST_IDS.every(id => attacker.statuses.has(id)), "系统卡自动为自身挂上全部五种抗性");
		await L.undoAppliedStatuses(sysMsg);
		ok(L.RESIST_IDS.every(id => !attacker.statuses.has(id)), "系统卡撤销状态后清除自动挂上的五种抗性");

		// 4. 豁免解析、受击玩家视角按钮可见性、掷豁免自动挂异常与成功减半记录
		const svMulti = L.parseSavesInText("目标必须通过机体豁免否则伏卧。豁免失败的目标将离散直到他们下一回合结束。", { dc: 15 });
		ok(svMulti.length === 1 && svMulti[0].key === "hull" && svMulti[0].dc === 15 && svMulti[0].failStatuses.join(",") === "prone,shredded", "跨句识别豁免失败的多个状态");
		const svHalf = L.parseSavesInText("溅射 2 内的角色必须通过敏捷豁免，否则受到 2d6 爆炸伤害，豁免成功则伤害减半。", { dc: 12 });
		ok(svHalf.length === 1 && svHalf[0].key === "agi" && svHalf[0].halfOnSuccess === true, "识别豁免成功伤害减半");
		ok(L.parseSavesInText("你的机体豁免获得 +1 准度。").length === 0 && L.parseSavesInText("未命中你的近战攻击迫使攻击者通过机体豁免，否则伏卧。").length === 0, "忽略被动豁免加值与未命中反制句");

		// 非作者（受击玩家）也能在 GM 发的卡片上看到豁免按钮，但看不到攻击者的施加状态按钮
		const nadeItem = {
			uuid: "Item.nade", documentName: "Item", name: "破片手雷", actor: critNpc, parent: critNpc,
			system: { effect: "投掷 5，溅射 2。区域内的角色必须通过敏捷豁免，受到 2d6 爆炸伤害并伏卧，豁免成功则伤害减半且不伏卧；物件和地形受到 10 AP 爆炸伤害。" },
		};
		critNpc.system.save = 13;
		docMap["Item.nade"] = nadeItem;
		const nadeMsg = mkFlagMsg("nade1", {}, {
			isAuthor: false,
			content: `<div class="card" data-uuid="Item.nade"><div class="lancer-header">破片手雷</div><div class="effect-text">${nadeItem.system.effect}</div></div>`,
		});
		let nadeInserted = "";
		const nadeRoot = { querySelector: sel => (sel === ".message-content" ? { insertAdjacentHTML: (_p, h) => { nadeInserted = h; }, querySelector: () => ({ addEventListener() {} }) } : null) };
		L.onRenderChatMessage(nadeMsg, [nadeRoot]);
		ok(/data-lancer-cn-save="0"/.test(nadeInserted) && /敏捷豁免 DC 13/.test(nadeInserted) && !/data-lancer-cn-nonatk-dmg/.test(nadeInserted), "受击玩家在 GM 卡片上能看到豁免按钮，不显示发起者的掷伤害按钮");

		// 执行豁免：甲掷出 9（失败 → 自动挂伏卧），丙掷出 16（成功 → 记录减半）
		const defVictim1 = mkAutoActor("受害甲", true, []);
		const defVictim2 = mkAutoActor("受害乙", true, []);
		docMap["Scene.s.Token.v1"] = { uuid: "Scene.s.Token.v1", name: "受害甲", actor: defVictim1, object: { id: "tv1", name: "受害甲", actor: defVictim1, document: { uuid: "Scene.s.Token.v1" } } };
		docMap["Scene.s.Token.v2"] = { uuid: "Scene.s.Token.v2", name: "受害乙", actor: defVictim2, object: { id: "tv2", name: "受害乙", actor: defVictim2, document: { uuid: "Scene.s.Token.v2" } } };
		let nextStatRoll = 9;
		ctx.game.lancer = {
			flows: new Map([
				["StatRollFlow", class {
					constructor(u, d) { this.uuid = u; this.state = { data: { ...d } }; }
					async begin(d) { this.state.data = { ...d, result: { roll: { total: nextStatRoll } } }; return true; }
				}],
			]),
		};
		ctx.canvas = { ...ctx.canvas, tokens: { ...ctx.canvas?.tokens, controlled: [{ uuid: "Scene.s.Token.v1", name: "受害甲", actor: defVictim1, document: { uuid: "Scene.s.Token.v1" } }] } };
		const nadeInfo = L.analyzeCard(nadeMsg);
		socketSent.length = 0;
		chatCreated.length = 0;
		await L.executeCardSave(nadeMsg, nadeInfo.saves[0]);
		ok(defVictim1.statuses.has("prone"), "豁免失败后自动挂上对应异常（伏卧）");
		ok(chatCreated.at(-1)?.flags?.["lancer-cn"]?.appliedStatuses?.[0]?.statuses?.includes("prone"), "豁免结果卡附带自动挂状态记录（支持撤销）");
		ok(socketSent.some(([, m]) => m.action === "recordSaveResults" && m.messageId === "nade1"), "非作者客户端掷豁免后通过 socket 将豁免结果写回原卡片");
		// 模拟 GM 同步回原卡，再让受害乙掷出 16 通过豁免
		ctx.game.users.activeGM.isSelf = true;
		for (const [, m] of socketSent) await ctx.__gmSocket(m);
		ctx.game.users.activeGM.isSelf = false;
		nextStatRoll = 16;
		ctx.canvas.tokens.controlled = [{ uuid: "Scene.s.Token.v2", name: "受害乙", actor: defVictim2, document: { uuid: "Scene.s.Token.v2" } }];
		socketSent.length = 0;
		await L.executeCardSave(nadeMsg, nadeInfo.saves[0]);
		ctx.game.users.activeGM.isSelf = true;
		for (const [, m] of socketSent) await ctx.__gmSocket(m);
		ok(!defVictim2.statuses.has("prone") && nadeMsg.getFlag("lancer-cn", "saveResults")["Scene.s.Token.v2"]?.passed === true, "豁免成功不挂异常并记录通过结果");

		// 5. 非攻击伤害解析、以 actor.uuid 发起 DamageRollFlow 并携带减半名单、范围模板放置
		ok(nadeInfo.nonAttackDamage?.damage?.length === 1 && nadeInfo.nonAttackDamage.damage[0].val === "2d6" && nadeInfo.nonAttackDamage.damage[0].type === "Explosive" && nadeInfo.nonAttackDamage.ap === false, "非攻击伤害解析：提取角色受到的 2d6 爆炸，排除纯物件/地形的 10 AP");
		const npcTierDmg = L.parseNonAttackDamage("目标受到 6/8/10 穿甲能量伤害。", { system: { tier: 2 } });
		ok(npcTierDmg?.damage?.[0]?.val === "8" && npcTierDmg.damage[0].type === "Energy" && npcTierDmg.ap === true, "NPC 非攻击伤害按层级选取 T2 数值并识别穿甲");
		ok(L.parseNonAttackDamage("清除 4 热度。你承受 2 热度。") === null, "清除热度与纯自身承受热度不误判为攻击伤害");
		ok(nadeInfo.aoeRanges.length === 1 && nadeInfo.aoeRanges[0].type === "Blast" && nadeInfo.aoeRanges[0].val === 2, "解析卡片文字中的溅射 2 模板");

		const nonAtkDmgCalls = [];
		ctx.game.lancer.flows.set("DamageRollFlow", class {
			constructor(u, d) { nonAtkDmgCalls.push({ uuid: u, data: d }); }
			async begin() { return true; }
		});
		critNpc.isOwner = true;
		ctx.game.user.targets = new Set();
		await L.rollNonAttackDamage(nadeMsg, nadeInfo);
		const lastDmgCall = nonAtkDmgCalls.at(-1);
		ok(lastDmgCall?.uuid === critNpc.uuid && lastDmgCall.data.damage[0].val === "2d6" && lastDmgCall.data.lancerCnHalfUuids.join(",") === "Scene.s.Token.v2", "非攻击掷伤害以 actor.uuid 发起（兼容 NPC 特性与驾驶员装备），并把豁免成功目标放入减半列表");

		let templateTargeted = null;
		ctx.game.lancer.canvas = {
			WeaponRangeTemplate: {
				fromRange: (r, tok) => ({ range: r, tok, placeTemplate: async () => ({ id: "tmpl1", setFlag: async () => {} }) }),
			},
		};
		ctx.game.lancer.targetsFromTemplate = id => { templateTargeted = id; };
		const placedDoc = await L.placeAoETemplate("Blast", 2, null);
		ok(placedDoc?.id === "tmpl1" && templateTargeted === "tmpl1", "放置范围模板后自动调用系统 targetsFromTemplate 锁定覆盖目标");

		// 6. 护甲 / 穿甲 / 暴露 / 离散 / 抗性 / 护盾结算预览数学 + 跨权限结算与撤销
		const tank = mkAutoActor("重装", false, ["resistance_kinetic"], { armor: 3, overshield: 2, hp: 10 });
		let pv = L.previewDamageCalc(tank, [{ type: "Kinetic", amount: 5 }, { type: "Energy", amount: 4 }]);
		// 防御方优先：3 点护甲先扣无抗性的 4 能量 → 剩 1 能量；5 动能无剩余护甲，抗性减半向上取整 ceil(5/2)=3 → 共 4 点先扣 2 护盾 → HP -2
		ok(pv.overshieldUsed === 2 && pv.hpLoss === 2, "结算预览：护甲优先扣非抗性伤害、抗性向上取整减半、先扣护盾再扣 HP");
		pv = L.previewDamageCalc(tank, [{ type: "Kinetic", amount: 5 }], { ap: true });
		// 穿甲无视 3 护甲 → ceil(5/2)=3 → 扣 2 护盾剩 1 HP
		ok(pv.overshieldUsed === 2 && pv.hpLoss === 1 && pv.notes.some(n => /穿甲/.test(n)), "结算预览：穿甲无视护甲但仍受抗性影响");
		const expTarget = mkAutoActor("暴露靶", false, ["exposed"], { armor: 2, hp: 10 });
		pv = L.previewDamageCalc(expTarget, [{ type: "Kinetic", amount: 4 }]);
		ok(pv.hpLoss === 6, "结算预览：暴露先翻倍（4×2=8）再减护甲（8-2=6）");
		const shredTarget = mkAutoActor("离散靶", false, ["shredded", "resistance_kinetic"], { armor: 3, hp: 10 });
		pv = L.previewDamageCalc(shredTarget, [{ type: "Kinetic", amount: 5 }]);
		ok(pv.hpLoss === 5, "结算预览：离散无视护甲与抗性");
		const heatless = mkAutoActor("步兵", false, [], { armor: 1, hp: 6, heatMax: 0 });
		heatless.hasHeatcap = () => false;
		pv = L.previewDamageCalc(heatless, [{ type: "Heat", amount: 4 }]);
		ok(pv.hpLoss === 3 && pv.heatGain === 0, "结算预览：无热度上限单位受到的热度转为能量伤害并受护甲减免");

		// 跨权限点击 .lancer-damage-apply 与 .lancer-damage-undo
		const bossNpc = mkAutoActor("首领", false, [], { type: "npc", armor: 2, hp: 20, overshield: 3, heat: 2, burn: 1 });
		let bossCalcArgs = null;
		bossNpc.damageCalc = async (applied, opts) => { bossCalcArgs = { applied, opts }; };
		docMap["Scene.s.Token.boss"] = { uuid: "Scene.s.Token.boss", actor: bossNpc };
		docMap["Actor.首领"] = bossNpc;
		const dmgMsg = mkFlagMsg("dmg1", {
			lancer: {
				damageData: {
					ap: true, paracausal: false,
					targetDamageResults: [{ target: "Scene.s.Token.boss", damage: [{ type: "Kinetic", amount: 7 }, { type: "Burn", amount: 2 }], ap: true, paracausal: false }],
				},
			},
		});
		ctx.game.users = { activeGM: { isSelf: false } };
		socketSent.length = 0;
		const applyGroup = {
			dataset: { target: "Scene.s.Token.boss", addBurn: "true" },
			querySelector: sel => (sel === "select" ? { value: "0.5" } : null),
		};
		const applyBtnEl = {
			closest: sel => (sel === ".lancer-damage-button-group" ? applyGroup : sel === ".chat-message" ? { dataset: { messageId: "dmg1" } } : null),
		};
		let applyStopped = false;
		L.onCrossPermDamageClick({
			target: { closest: sel => (sel === ".lancer-damage-apply" ? applyBtnEl : null) },
			preventDefault() {}, stopPropagation() { applyStopped = true; }, stopImmediatePropagation() {},
		});
		ok(applyStopped && socketSent.length === 1 && socketSent[0][1].action === "applyDamage" && socketSent[0][1].multiple === 0.5 && socketSent[0][1].ap === true, "玩家对非拥有者 NPC 点击应用伤害时拦截并经 socket 转发给 GM");
		ctx.game.users.activeGM.isSelf = true;
		await ctx.__gmSocket(socketSent[0][1]);
		ok(bossCalcArgs && bossCalcArgs.applied.Kinetic === 7 && bossCalcArgs.applied.Burn === 2 && bossCalcArgs.opts.multiple === 0.5 && bossCalcArgs.opts.ap === true, "GM 收到请求后调用目标原生 damageCalc 结算");

		// 跨权限撤销伤害
		const appliedChatMsg = mkFlagMsg("undo1", {}, { content: `<div class="flexrow"><span>首领 took 5 damage!</span><a class="lancer-button lancer-damage-undo"></a></div>` });
		ctx.game.users.activeGM.isSelf = false;
		socketSent.length = 0;
		const undoBtnEl = {
			dataset: { uuid: "Actor.首领", overshieldDelta: "2", hpDelta: "4", burnDelta: "1", heatDelta: "2", addBurn: "true" },
			closest: sel => (sel === ".chat-message" ? { dataset: { messageId: "undo1" } } : null),
		};
		L.onCrossPermDamageClick({
			target: { closest: sel => (sel === ".lancer-damage-undo" ? undoBtnEl : null) },
			preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {},
		});
		ok(socketSent.length === 1 && socketSent[0][1].action === "undoDamage", "玩家点击撤销非拥有者伤害时经 socket 转发给 GM");
		ctx.game.users.activeGM.isSelf = true;
		await ctx.__gmSocket(socketSent[0][1]);
		ok(bossNpc.updates.at(-1)?.["system.hp.value"] === 24 && bossNpc.updates.at(-1)?.["system.overshield.value"] === 5 && bossNpc.updates.at(-1)?.["system.burn"] === 0 && bossNpc.updates.at(-1)?.["system.heat.value"] === 0, "GM 撤销伤害后恢复 HP、护盾、燃烧与热度");
		ok(/strikethrough/.test(appliedChatMsg.content) && !/lancer-damage-undo/.test(appliedChatMsg.content), "撤销后伤害提示卡加上删除线并移除撤销按钮");

		// 7. patchLancerFlows：减半联动、NPC 致命 / 额外致命、稳住阵脚清状况、结构与过热表状态 + 1 压力 NPC 扣热
		ctx.Roll = class {
			constructor(f) { this.formula = f; }
			async evaluate() {
				const m = String(this.formula).match(/^(\d+)d6$/);
				this.total = m ? Number(m[1]) * 4 : 4;
				return this;
			}
			async getTooltip() { return ""; }
		};
		const stepMap = new Map([
			["rollReliable", async state => { state._reliableRan = true; return true; }],
			["rollCritDamage", async state => {
				state.data.crit_damage_results = state.data.damage_results;
				for (const hr of state.data.hit_results) {
					if (hr.crit) state.data.targets.push({ target: hr.target, damage: [{ type: "Kinetic", amount: 6 }], hit: true, crit: true, half_damage: false });
				}
				return true;
			}],
			["applyStabilizeUpdates", async state => {
				state.data.description = state.data.option2 === "ClearOwnCond"
					? "<ul><li>Cool</li><li>Mech has selected to clear own condition. Please clear manually.</li></ul>"
					: "<ul><li>Cool</li><li>Mech has selected to clear an allied condition. Please clear manually.</li></ul>";
				return true;
			}],
			["printStructureCard", async state => {
				const m = mkFlagMsg("str1", {});
				m.updateSource = u => { for (const [k, v] of Object.entries(u)) if (k === "flags.lancer-cn.tableStatuses") m.flags["lancer-cn"] = { tableStatuses: v }; };
				L.onPreCreateBasicCard(m);
				await L.onCreateChatMessage(m, {}, "u1");
				state._card = m;
				return true;
			}],
			["printOverheatCard", async state => {
				const m = mkFlagMsg("ovh1", {});
				m.updateSource = u => { for (const [k, v] of Object.entries(u)) if (k === "flags.lancer-cn.tableStatuses") m.flags["lancer-cn"] = { tableStatuses: v }; };
				L.onPreCreateBasicCard(m);
				await L.onCreateChatMessage(m, {}, "u1");
				state._card = m;
				return true;
			}],
		]);
		ctx.game.lancer.flowSteps = stepMap;
		L.patchLancerFlows();
		L.patchLancerFlows(); // 幂等

		// 7a. rollReliable：豁免成功减半目标自动勾选 halfDamage
		const relState = { data: { lancerCnHalfUuids: ["Scene.s.Token.v2"], damage_hud_data: { targets: [{ targetUuid: "Scene.s.Token.v1", halfDamage: false }, { targetUuid: "Scene.s.Token.v2", halfDamage: false }] } } };
		await stepMap.get("rollReliable")(relState);
		ok(relState.data.damage_hud_data.targets[0].halfDamage === false && relState.data.damage_hud_data.targets[1].halfDamage === true, "rollReliable 自动将通过减半豁免的目标设为 halfDamage");

		// 7b. NPC 致命 / 额外致命
		const ultraNpc = mkAutoActor("超体海盗", true, [], { type: "npc", tier: 2 });
		ultraNpc.items = [
			{ type: "npc_feature", name: "致命", system: { lid: "npcf_cn_ultra_3" } },
			{ type: "npc_feature", name: "额外致命", system: { lid: "npcf_cn_ultra_21" } },
			{ type: "npc_feature", name: "致命游戏", system: { lid: "npcf_cn_monstrosity_2" } }, // 不应计入
		];
		ok(L.countNpcDeadlyDice(ultraNpc) === 3, "T2 超体拥有「致命」(+1d6) 与「额外致命」(+2d6) 共 +3d6，不误算「致命游戏」");
		ultraNpc.system.tier = 3;
		ok(L.countNpcDeadlyDice(ultraNpc) === 4, "T3 超体「致命」+「额外致命」共 +4d6");
		const normalResults = [{ d_type: "Kinetic", roll: { total: 6 } }];
		const critState = {
			actor: ultraNpc,
			data: {
				has_normal_hit: true, has_crit_hit: true,
				damage_results: normalResults, crit_damage_results: [],
				damage_hud_data: { targets: [{ targetUuid: "Scene.s.Token.a" }] },
				hit_results: [{ target: { document: { uuid: "Scene.s.Token.a" } }, hit: true, crit: true }],
				targets: [],
			},
		};
		await stepMap.get("rollCritDamage")(critState);
		ok(critState.data.damage_results.length === 1 && critState.data.crit_damage_results.length === 2 && critState.data.crit_damage_results[1].roll.formula === "4d6", "NPC 会心时只向 crit_damage_results 追加 4d6 致命伤害，不污染普通命中结果");
		ok(critState.data.targets[0].damage.reduce((s, d) => s + d.amount, 0) === 22, "会心目标伤害总值包含致命额外伤害（6 + 4×4 = 22）");

		// 7c. 机甲稳住阵脚：清除自身状况与邻接友军状况
		const stabMech = mkAutoActor("兰斯洛特", true, ["jammed", "exposed"]); // exposed 是状态，jammed 是状况
		docMap[stabMech.uuid] = stabMech;
		const stabOwnState = { actor: stabMech, data: { option1: "Cool", option2: "ClearOwnCond", description: "" } };
		await stepMap.get("applyStabilizeUpdates")(stabOwnState);
		ok(!stabMech.statuses.has("jammed") && /已清除自身状况：<b>受扰<\/b>/.test(stabOwnState.data.description), "机甲稳住阵脚：自动清除自身唯一的状况（受扰）并更新说明");

		const stabAlly = mkAutoActor("友方机甲", true, ["slow"]);
		docMap["Scene.s.Token.ally"] = { uuid: "Scene.s.Token.ally", name: "友方机甲", actor: stabAlly };
		ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.ally", name: "友方机甲", actor: stabAlly, document: { uuid: "Scene.s.Token.ally" } }]);
		const stabOtherState = { actor: stabMech, data: { option1: "Cool", option2: "ClearOtherCond", description: "" } };
		await stepMap.get("applyStabilizeUpdates")(stabOtherState);
		ok(!stabAlly.statuses.has("slow") && /友方机甲/.test(stabOtherState.data.description), "机甲稳住阵脚：自动清除目标友军的状况（缓慢）");
		ctx.game.user.targets = new Set();

		// 7d. 结构与过热表状态映射 + 1 压力 NPC 过热扣减热度上限
		ok(L.structureOutcomeStatuses("lancer.tables.structure.description.glancing", 3).join() === "impaired"
			&& L.structureOutcomeStatuses("lancer.tables.structure.description.direct.3plus", 3).join() === "stunned"
			&& L.structureOutcomeStatuses("lancer.tables.structure.description.crushing", 2).join() === "downandout"
			&& L.structureOutcomeStatuses("lancer.tables.structureMonstrosity.description.dismember", 2).join() === "slow"
			&& L.structureOutcomeStatuses("lancer.tables.structureMonstrosity.description.powerful", 2).join() === "prone", "结构伤害表与怪形结构表的自动状态映射正确");
		const strActor = mkAutoActor("结构受创机", true, []);
		docMap[strActor.uuid] = strActor;
		const strState = { actor: strActor, data: { desc: "lancer.tables.structure.description.direct.3plus", remStruct: 3 } };
		await stepMap.get("printStructureCard")(strState);
		ok(strActor.statuses.has("stunned") && strState._card.getFlag("lancer-cn", "appliedStatuses")?.[0]?.statuses?.includes("stunned"), "结构卡打印时自动挂上晕眩并写入可撤销记录");

		const oneStressNpc = mkAutoActor("普通敌兵", true, [], { type: "npc", stress: 1, stressMax: 1, heat: 8, heatMax: 6 });
		docMap[oneStressNpc.uuid] = oneStressNpc;
		const ovhState = { actor: oneStressNpc, data: { desc: "lancer.tables.overheat.description.destabilized", remStress: 1 } };
		await stepMap.get("printOverheatCard")(ovhState);
		ok(oneStressNpc.system.heat.value === 2 && oneStressNpc.statuses.has("exposed"), "1 压力上限 NPC 过热后自动扣除热度上限（8-6=2）并挂上暴露");

		// 8. 数值变化自动状态（超温危域、无结构失能）、回合结束清异常提醒（不含交战）、角色表抗性开关栏
		const dzMech = mkAutoActor("高热机", true, [], { heat: 3, heatMax: 6, structure: 4, structureMax: 4 });
		await L.onUpdateActorStatus(dzMech, { system: { heat: { value: 3 } } }, {}, "u1");
		ok(dzMech.statuses.has("dangerzone"), "热度达到上限一半（3/6）时自动挂上超温危域");
		dzMech.system.heat.value = 2;
		await L.onUpdateActorStatus(dzMech, { system: { heat: { value: 2 } } }, {}, "u1");
		ok(!dzMech.statuses.has("dangerzone"), "热度降到一半以下（2/6）时自动解除超温危域");
		dzMech.system.hp.value = 0;
		await L.onUpdateActorStatus(dzMech, { system: { hp: { value: 0 } } }, {}, "u1");
		ok(!dzMech.statuses.has("downandout"), "仍有剩余结构的机甲 HP 归零时不提前挂失能（交由结构检定决定）");
		const gruntNpc = mkAutoActor("杂兵", true, [], { type: "npc", hp: 0, structure: 0, structureMax: 0 });
		await L.onUpdateActorStatus(gruntNpc, { system: { hp: { value: 0 } } }, {}, "u1");
		ok(gruntNpc.statuses.has("downandout"), "无结构上限单位 HP 归零时自动挂上失能");

		// 回合结束清异常提醒：只提示到期状况/增益，不碰锁定/伏卧，也不含交战自动检测
		ok(!L.EXPIRABLE_STATUS_IDS.includes("engaged") && !L.EXPIRABLE_STATUS_IDS.includes("lockon") && !L.EXPIRABLE_STATUS_IDS.includes("prone"), "回合结束提醒列表不包含交战、锁定、伏卧");
		const turnActor = mkAutoActor("回合机", true, ["impaired", "slow", "lockon", "prone"]);
		docMap[turnActor.uuid] = turnActor;
		ctx.game.users = { activeGM: { isSelf: true } };
		ctx.game.user.isGM = true;
		chatCreated.length = 0;
		const combatMock = {
			previous: { combatantId: "c1" },
			current: { combatantId: "c2" },
			combatants: [{ id: "c1", name: "回合机", actor: turnActor, token: { uuid: turnActor.uuid } }],
		};
		combatMock.combatants.get = id => combatMock.combatants.find(c => c.id === id);
		await L.onUpdateCombatTurnEnd(combatMock, { turn: 1 }, { direction: 1 });
		const turnCardData = chatCreated.at(-1)?.flags?.["lancer-cn"]?.turnEndClear;
		ok(turnCardData && turnCardData.statuses.join(",") === "impaired,slow", "回合结束提醒卡只列出受损与缓慢，保留锁定与伏卧");
		const turnMsg = mkFlagMsg("turn1", { "lancer-cn": { turnEndClear: turnCardData } });
		let turnRowClick = null, turnHtml = "";
		const turnRoot = { querySelector: sel => (sel === ".message-content" ? { insertAdjacentHTML: (_p, h) => { turnHtml = h; }, querySelector: () => ({ addEventListener: (_t, fn) => { turnRowClick = fn; } }) } : null) };
		L.onRenderChatMessage(turnMsg, [turnRoot]);
		ok(/data-lancer-cn-turn-toggle="impaired"/.test(turnHtml) && /全部清除/.test(turnHtml), "回合结束提醒卡渲染逐项清除与全部清除按钮");
		await turnRowClick({ target: { closest: sel => (sel === "[data-lancer-cn-turn-toggle]" ? { dataset: { lancerCnTurnToggle: "impaired" } } : null) } });
		ok(!turnActor.statuses.has("impaired") && turnActor.statuses.has("slow"), "点击单项清除受损");
		await turnRowClick({ target: { closest: sel => (sel === "[data-lancer-cn-turn-toggle]" ? { dataset: { lancerCnTurnToggle: "impaired" } } : null) } });
		ok(turnActor.statuses.has("impaired"), "误点后再次点击可恢复该状态");
		await turnRowClick({ target: { closest: sel => (sel === "[data-lancer-cn-turn-clear-all]" ? { dataset: { lancerCnTurnClearAll: "1" } } : null) } });
		ok(!turnActor.statuses.has("impaired") && !turnActor.statuses.has("slow") && turnActor.statuses.has("lockon"), "点击全部清除后清掉到期状态，保留锁定");

		// 角色表抗性开关栏
		const resActor = mkAutoActor("抗性机", true, []);
		const resHtml = L.resistancesHTML(resActor);
		ok(/抗性开关/.test(resHtml) && L.RESIST_IDS.every(id => resHtml.includes(`data-lancer-cn-resist="${id}"`)) && resHtml.includes('data-lancer-cn-resist="all"'), "角色表抗性开关栏包含五种抗性与全抗性按钮");
		await L.toggleActorResistance(resActor, "resistance_kinetic");
		ok(resActor.statuses.has("resistance_kinetic"), "单项切换开启抗性");
		await L.toggleActorResistance(resActor, "all");
		ok(L.RESIST_IDS.every(id => resActor.statuses.has(id)), "点击全抗性开启全部五种抗性");
		await L.toggleActorResistance(resActor, "all");
		ok(L.RESIST_IDS.every(id => !resActor.statuses.has(id)), "全部开启时再点全抗性一键全部关闭");

		// ---- 基础动作补齐、擒拿后续对抗与步战驾驶员动作（1.11.0）
		{
			let msgSeq = 1;
			ctx.ChatMessage = {
				getSpeaker: o => ({ actor: o?.actor?.name }),
				create: async d => {
					const m = mkFlagMsg(`v11_${msgSeq++}`, d.flags ?? {}, { isAuthor: true, content: d.content ?? "" });
					m.speaker = d.speaker;
					chatCreated.push(m);
					return m;
				},
			};
			const mkV11Actor = (name, isOwner, initStatuses = [], extra = {}) => {
				const a = mkAutoActor(name, isOwner, initStatuses, extra);
				const flagStore = {};
				a.system.size = extra.size ?? 1;
				a.system.grit = extra.grit ?? 0;
				a.system.mounted = extra.mounted ?? false;
				a.system.pilot = extra.pilot ? { value: extra.pilot } : null;
				a.items = extra.items ?? [];
				a.getFlag = (scope, key) => flagStore?.[scope]?.[key];
				a.setFlag = async (scope, key, val) => { (flagStore[scope] ||= {})[key] = val; };
				a.unsetFlag = async (scope, key) => { if (flagStore[scope]) delete flagStore[scope][key]; };
				const origUpdate = a.update.bind(a);
				a.update = async u => {
					await origUpdate(u);
					if ("system.mounted" in u) a.system.mounted = u["system.mounted"];
				};
				a.updateEmbeddedDocuments = async (_type, arr) => {
					for (const u of arr) {
						const it = a.items.find(x => x.id === u._id);
						if (it && "system.loaded" in u) it.system.loaded = u["system.loaded"];
					}
				};
				return a;
			};

			// 1. 合成肌肉网（FAQ 2fce3f）与体型判定
			const smnMech = mkV11Actor("黑胡子", true, [], {
				size: 1,
				items: [{ id: "smn", name: "合成肌肉网", system: { lid: "ms_synthetic_muscle_netting" } }],
			});
			const halfMech = mkV11Actor("半格SMN", true, [], {
				size: 0.5,
				items: [{ id: "smn2", name: "合成肌肉织网", system: {} }],
			});
			const normalS1 = mkV11Actor("普通S1", true, [], { size: 1 });
			ok(L.effectiveGrappleSize(normalS1, 2, { isGrappler: true }) === 1, "无合成肌肉网时有效擒拿体型等于基础体型");
			ok(L.effectiveGrappleSize(smnMech, 3, { isGrappler: true }) === 3, "合成肌肉网主动擒拿更大目标时视为与目标同体型");
			ok(L.effectiveGrappleSize(smnMech, 1, { isGrappler: true }) === 2, "合成肌肉网主动擒拿同体型或更小目标时视为体型 +1");
			ok(L.effectiveGrappleSize(halfMech, 0.5, { isGrappler: true }) === 1, "体型 1/2 搭载合成肌肉网主动擒拿同体型时提升至体型 1");
			ok(L.effectiveGrappleSize(smnMech, 2, { isGrappler: false }) === 1, "合成肌肉网在被动被擒拿时不放大体型（FAQ 2fce3f）");

			// 2. 擒拿完整生命周期：同体型初始控场（FAQ 0d9e7e）→ 回合结束/稳住阵脚跳过固定（FAQ b0f8e4）→ 争抢主导翻转 → 挣脱平局胜出
			const grapAtt = mkV11Actor("擒拿甲", true, [], { size: 1 });
			const grapDef = mkV11Actor("擒拿乙", true, ["impaired"], { size: 1 });
			docMap["Actor.擒拿甲"] = grapAtt;
			docMap["Scene.s.Token.gAtt"] = { uuid: "Scene.s.Token.gAtt", name: "擒拿甲", actor: grapAtt, object: { id: "tgA", name: "擒拿甲", actor: grapAtt, document: { uuid: "Scene.s.Token.gAtt" } } };
			docMap["Scene.s.Token.gDef"] = { uuid: "Scene.s.Token.gDef", name: "擒拿乙", actor: grapDef, object: { id: "tgD", name: "擒拿乙", actor: grapDef, document: { uuid: "Scene.s.Token.gDef" } } };
			grapAtt.token = { uuid: "Scene.s.Token.gAtt", name: "擒拿甲" };
			grapDef.token = { uuid: "Scene.s.Token.gDef", name: "擒拿乙" };

			const grapMsg = mkFlagMsg("grap1", {
				"lancer-cn": { basicAction: "grapple" },
				lancer: {
					attackData: {
						attackerUuid: "Actor.擒拿甲",
						targets: [{ uuid: "Scene.s.Token.gDef", hit: true, crit: false }],
					},
				},
			});
			await L.onCreateChatMessage(grapMsg, {}, "u1");
			const gs0 = grapMsg.getFlag("lancer-cn", "grappleState");
			ok(gs0?.active === true && gs0.sameSize === true && gs0.controller === "attacker", "同体型擒拿命中：记录激活擒拿，攻击方取得初始控制权");
			ok(grapDef.statuses.has("immobilized") && !grapAtt.statuses.has("immobilized"), "同体型擒拿命中：防御方自动挂上固定，攻击方不固定");
			ok(grapMsg.getFlag("lancer-cn", "appliedStatuses")?.[0]?.statuses?.includes("immobilized"), "擒拿自动挂固定支持撤销记录");
			ok(L.isGrappleImmobilized(grapDef, "Scene.s.Token.gDef") === true && L.isGrappleImmobilized(grapAtt, "Scene.s.Token.gAtt") === false, "isGrappleImmobilized 准确区分受控固定方与主导方");

			// 回合结束清异常与机甲稳住阵脚都不应清掉擒拿造成的固定
			const grapCombat = {
				previous: { combatantId: "cg1" },
				current: { combatantId: "cg2" },
				combatants: [{ id: "cg1", name: "擒拿乙", actor: grapDef, token: { uuid: "Scene.s.Token.gDef" } }],
			};
			grapCombat.combatants.get = id => grapCombat.combatants.find(c => c.id === id);
			await L.onUpdateCombatTurnEnd(grapCombat, { turn: 1 }, { direction: 1 });
			const grapTurnClear = chatCreated.at(-1)?.getFlag?.("lancer-cn", "turnEndClear");
			ok(grapTurnClear?.statuses?.join(",") === "impaired", "回合结束清异常提醒跳过因擒拿控场持续存在的固定，只列受损");

			let stabRan = false;
			const stabSteps = new Map([["applyStabilizeUpdates", async () => { stabRan = true; return true; }]]);
			ctx.game.lancer = { flows: new Map(), flowSteps: stabSteps };
			L.patchLancerFlows();
			await stabSteps.get("applyStabilizeUpdates")({ actor: grapDef, data: { option2: "ClearOwnCond" } });
			ok(stabRan && grapDef.statuses.has("immobilized") && !grapDef.statuses.has("impaired"), "机甲稳住阵脚选择清除状况时保留因擒拿持续的固定（FAQ b0f8e4）");

			// 渲染擒拿卡按钮栏
			let grapBarHtml = "";
			const grapRoot = { querySelector: sel => (sel === ".message-content" ? { insertAdjacentHTML: (_p, h) => { grapBarHtml = h; }, querySelector: () => ({ addEventListener() {} }) } : null) };
			L.onRenderChatMessage(grapMsg, [grapRoot]);
			ok(/data-lancer-cn-grapple="break"/.test(grapBarHtml) && /data-lancer-cn-grapple="control"/.test(grapBarHtml) && /data-lancer-cn-grapple="end"/.test(grapBarHtml), "同体型擒拿卡生成挣脱擒拿、争抢主导与结束擒拿三个按钮");

			// 争抢主导：防御方掷出 17 vs 攻击方 12 → 主导权翻转，攻击方陷入固定、防御方解除固定
			let rollQueue = [17, 12];
			ctx.game.lancer = {
				flows: new Map([
					["StatRollFlow", class {
						constructor(u, d) { this.uuid = u; this.state = { data: { ...d } }; }
						async begin(d) { this.state.data = { ...d, result: { roll: { total: rollQueue.shift() ?? 10 } } }; return true; }
					}],
				]),
				flowSteps: new Map(),
			};
			ctx.canvas = { ...ctx.canvas, tokens: { controlled: [] } };
			const ctrlContestMsg = await L.startGrappleContest(grapMsg, "control", "defender");
			ok(ctrlContestMsg?.getFlag("lancer-cn", "contest")?.kind === "grappleControl", "发起同体型擒拿争抢主导对抗检定卡");
			await L.respondToContest(ctrlContestMsg, "hull");
			const gsFlipped = grapMsg.getFlag("lancer-cn", "grappleState");
			ok(gsFlipped.controller === "defender" && grapAtt.statuses.has("immobilized") && !grapDef.statuses.has("immobilized"), "争抢主导胜出后翻转主导权并自动交换双方的固定状态");

			// 挣脱擒拿（防御方通过角色表 breakGrapple 发起，测试平局 14 vs 14 发起方胜出 → 结束擒拿并解除受控方固定）
			rollQueue = [14, 14];
			const defBreakMsg = await L.beginBasicAction(grapDef, "breakGrapple");
			ok(defBreakMsg?.getFlag("lancer-cn", "contest")?.kind === "grappleBreak", "防御方点角色表挣脱擒拿自动定位当前擒拿并发起 grappleBreak 对抗卡");
			await L.respondToContest(defBreakMsg, "hull");
			ok(grapMsg.getFlag("lancer-cn", "grappleState")?.active === false && !grapAtt.statuses.has("immobilized") && !grapDef.statuses.has("immobilized"), "挣脱擒拿平局判定发起方胜出，自动结束擒拿并解除受控方固定");

			// 3. 晕眩机甲在机体 / 敏捷对抗检定中自动失败
			const stunnedMech = mkV11Actor("晕眩机", true, ["stunned"]);
			const stunHull = await L.rollActorContestStat(stunnedMech, { mode: "stat", statKey: "hull", label: "机体" }, "测试");
			const stunSys = await L.rollActorContestStat(stunnedMech, { mode: "stat", statKey: "sys", label: "系统" }, "测试");
			ok(stunHull.ok && stunHull.autoFail === true && !stunSys.autoFail, "处于晕眩的机甲在机体/敏捷对抗检定中自动失败，系统检定不受自动失败影响");

			// 4. 强化（Bolster）+ StatRollFlow 自动 +2 准度与出卡消耗（取消 HUD 不消耗）
			const bolsterMech = mkV11Actor("支援机", true, []);
			const allyMech = mkV11Actor("受援机", true, []);
			docMap["Actor.受援机"] = allyMech;
			ctx.game.user.targets = new Set([{ uuid: "Actor.受援机", name: "受援机", actor: allyMech, document: { uuid: "Actor.受援机" } }]);
			await L.beginBasicAction(bolsterMech, "bolster");
			ok(allyMech.statuses.has("bolster"), "强化动作对锁定目标施加强化状态");
			ctx.game.user.targets = new Set();

			const statSteps = new Map([
				["initStatRollData", async st => { st.data = { acc_diff: { base: { accuracy: 0 } } }; return true; }],
				["printStatRollCard", async () => true],
			]);
			ctx.game.lancer.flowSteps = statSteps;
			L.patchLancerFlows();
			const bolsterFlowState = { actor: allyMech, data: {} };
			await statSteps.get("initStatRollData")(bolsterFlowState);
			ok(bolsterFlowState.data.acc_diff.base.accuracy === 2 && allyMech.statuses.has("bolster"), "强化状态下发起属性检定/豁免自动预填 +2 准度，且在出卡前若取消不会提前消耗");
			await statSteps.get("printStatRollCard")(bolsterFlowState);
			ok(!allyMech.statuses.has("bolster"), "属性检定/豁免出卡完成后自动消耗强化状态");

			// 5. 躲藏与搜索对抗（胜出自动摘除匿迹）
			const hiddenFoe = mkV11Actor("潜伏敌", true, []);
			await L.beginBasicAction(hiddenFoe, "hide");
			ok(hiddenFoe.statuses.has("hidden"), "躲藏动作施加匿迹状态");
			docMap["Scene.s.Token.hFoe"] = { uuid: "Scene.s.Token.hFoe", name: "潜伏敌", actor: hiddenFoe };
			ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.hFoe", name: "潜伏敌", actor: hiddenFoe, document: { uuid: "Scene.s.Token.hFoe" } }]);
			rollQueue = [15, 11];
			const searchContest = await L.beginBasicAction(bolsterMech, "search");
			ctx.game.user.targets = new Set();
			ok(searchContest?.getFlag("lancer-cn", "contest")?.kind === "search", "锁定目标执行搜索生成系统 vs 敏捷对抗检定卡");
			await L.respondToContest(searchContest, "agi");
			ok(!hiddenFoe.statuses.has("hidden"), "搜索对抗胜出后自动解除目标的匿迹状态");

			// 6. 受身（Brace）：开启五种抗性 + 下回合开始行动限制提醒 + 一键关闭受身抗性
			const braceMech = mkV11Actor("受身机", true, []);
			docMap["Actor.受身机"] = braceMech;
			await L.beginBasicAction(braceMech, "brace");
			const braceCardMsg = chatCreated.at(-1);
			ok(L.RESIST_IDS.every(id => braceMech.statuses.has(id)) && braceMech.getFlag("lancer-cn", "braced") === true, "受身自动开启五种伤害全抗性并记录下回合受身标记");
			const braceCombat = {
				previous: { combatantId: "cb0" },
				current: { combatantId: "cb1" },
				combatants: [
					{ id: "cb0", name: "路人", actor: normalS1, token: { uuid: normalS1.uuid } },
					{ id: "cb1", name: "受身机", actor: braceMech, token: { uuid: braceMech.uuid } },
				],
			};
			braceCombat.combatants.get = id => braceCombat.combatants.find(c => c.id === id);
			await L.onUpdateCombatTurnEnd(braceCombat, { turn: 1 }, { direction: 1 });
			ok(!braceMech.getFlag("lancer-cn", "braced") && /受身生效 · 本回合行动限制/.test(chatCreated.at(-1)?.content ?? ""), "受身角色下一回合开始时自动发出仅限 1 个快速动作的提醒卡并清除标记");
			await L.clearBraceResistances(braceCardMsg);
			ok(L.RESIST_IDS.every(id => !braceMech.statuses.has(id)) && braceCardMsg.getFlag("lancer-cn", "braceCleared") === true, "点击关闭受身抗性按钮一键清除五种抗性");

			// 7. 起身、脱离、准备、关机/开机、自爆、弃机、上下马
			const postPilot = mkV11Actor("驾驶员甲", true, [], { type: "pilot", mounted: true, hp: 6, hpMax: 6, grit: 2 });
			docMap["Actor.驾驶员甲"] = postPilot;
			const postMech = mkV11Actor("姿态机", true, ["prone", "immobilized", "exposed", "dangerzone", "lockon"], { heat: 5, pilot: postPilot });
			docMap["Actor.姿态机"] = postMech;
			ok((await L.beginBasicAction(postMech, "standUp")) === false && postMech.statuses.has("prone"), "处于固定状态时禁止执行起身解除伏卧");
			postMech.statuses.delete("immobilized");
			ok((await L.beginBasicAction(postMech, "standUp")) === true && !postMech.statuses.has("prone"), "解除固定后执行起身自动移除伏卧");

			await L.beginBasicAction(postMech, "disengage");
			ok(/脱离/.test(chatCreated.at(-1)?.content ?? "") && L.analyzeCard(chatCreated.at(-1)) === null, "脱离发送声明卡且不会误触发自动扫描按钮");
			await L.beginBasicAction(postMech, "prepare", { trigger: "敌方露头", action: "重机枪交火" });
			ok(/敌方露头/.test(chatCreated.at(-1)?.content ?? "") && /重机枪交火/.test(chatCreated.at(-1)?.content ?? ""), "准备动作卡片记录触发条件与准备的快速动作");

			await L.beginBasicAction(postMech, "shutDown");
			ok(postMech.system.heat.value === 0 && !postMech.statuses.has("exposed") && !postMech.statuses.has("dangerzone") && !postMech.statuses.has("lockon") && postMech.statuses.has("shutdown") && postMech.statuses.has("stunned"), "关机清零热度、清除暴露/超温危域/锁定，并挂上关机与晕眩");
			const sdCombat = {
				previous: { combatantId: "cs1" },
				current: { combatantId: "cs2" },
				combatants: [{ id: "cs1", name: "姿态机", actor: postMech, token: { uuid: postMech.uuid } }],
			};
			sdCombat.combatants.get = id => sdCombat.combatants.find(c => c.id === id);
			const beforeSdTurnCount = chatCreated.length;
			await L.onUpdateCombatTurnEnd(sdCombat, { turn: 1 }, { direction: 1 });
			ok(chatCreated.length === beforeSdTurnCount, "处于关机状态时，回合结束不会误提醒清除因关机持续的晕眩");
			await L.beginBasicAction(postMech, "bootUp");
			ok(!postMech.statuses.has("shutdown") && !postMech.statuses.has("stunned"), "开机解除关机与晕眩状态");

			await L.beginBasicAction(postMech, "selfDestruct");
			const sdCardInfo = L.analyzeCard(chatCreated.at(-1));
			ok(sdCardInfo && sdCardInfo.aoeRanges[0]?.type === "Burst" && sdCardInfo.aoeRanges[0]?.val === 2 && sdCardInfo.saves[0]?.key === "agi" && sdCardInfo.saves[0]?.halfOnSuccess === true && sdCardInfo.nonAttackDamage?.damage?.[0]?.val === "4d6", "自爆卡开启自动扫描：自动识别爆发 2 模板、敏捷豁免减半与 4d6 爆炸伤害按钮");

			await L.beginBasicAction(postMech, "eject");
			ok(postMech.statuses.has("impaired") && postPilot.system.mounted === false, "弃机使机甲陷入受损并将关联驾驶员置为下马状态");
			await L.beginBasicAction(postMech, "mountDismount");
			ok(postPilot.system.mounted === true, "上下马切换驾驶员驾驶舱乘坐状态");

			// 8. 驾驶员表注入、昏迷自动监控、步战装填、包扎与骑乘全套交互
			ok(typeof hooks.updateActor === "function", "已注册 updateActor 钩子以实时联动骨架插图、超温危域与驾驶员昏迷");
			const pilotPlaced = [];
			const pilotAnchorCard = { insertAdjacentHTML: (pos, h) => pilotPlaced.push([pos, h]) };
			const pilotSheetRoot = {
				dataset: {},
				querySelectorAll: () => [],
				querySelector: sel => (sel === ".lancer-cn-basic" ? (pilotPlaced.length ? { insertAdjacentHTML: (p, h) => pilotPlaced.push(["sub", p, h]) } : null)
					: sel.includes('[data-flow-type="BasicAttack"]') ? { closest: () => pilotAnchorCard } : null),
			};
			L.onRenderActorSheet({ actor: postPilot }, [pilotSheetRoot]);
			ok(pilotPlaced.length === 1 && /data-lancer-cn-basic="pilotJockey"/.test(pilotPlaced[0][1]) && !pilotPlaced.some(x => String(x).includes("lancer-cn-resist")), "驾驶员表注入步战基础动作卡，且不重复插入机甲抗性栏");

			postPilot.system.hp.value = 0;
			await L.onUpdateActorStatus(postPilot, { system: { hp: { value: 0 } } }, {}, "u1");
			ok(postPilot.statuses.has("downandout"), "驾驶员 HP 归零时自动挂上昏迷（downandout）");

			const loadingGun = { id: "pw1", type: "pilot_weapon", name: "重型签名武器", system: { loaded: false, tags: [{ lid: "tg_loading", is_loading: true }] } };
			const combatKnife = { id: "pw2", type: "pilot_weapon", name: "战术匕首", system: { loaded: false, tags: [] } };
			postPilot.items = [
				loadingGun,
				combatKnife,
				{ id: "sk1", uuid: "Item.sk1", type: "skill", name: "贴身肉搏", system: { lid: "sk_assault", curr_rank: 2 } },
				{ id: "gear1", type: "pilot_gear", name: "修复胶", system: { lid: "pg_corrective", uses: { value: 1, max: 1 } }, async update(u) { if ("system.uses" in u) this.system.uses.value = u["system.uses"]; } },
			];
			await L.beginBasicAction(postPilot, "pilotReload");
			ok(loadingGun.system.loaded === true && combatKnife.system.loaded === false, "驾驶员装填只填装带有装填标签的未装填驾驶员武器");

			// 包扎：使用修复胶唤醒昏迷的队友（1 HP + 解除昏迷），再通过技能检定 10+ 为清醒伤员回复一半最大 HP
			const downedAlly = mkV11Actor("倒地队友", true, ["downandout"], { type: "pilot", hp: 0, hpMax: 8 });
			docMap["Scene.s.Token.pAlly"] = { uuid: "Scene.s.Token.pAlly", name: "倒地队友", actor: downedAlly };
			ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.pAlly", name: "倒地队友", actor: downedAlly, document: { uuid: "Scene.s.Token.pAlly" } }]);
			await L.beginBasicAction(postPilot, "pilotPatch", { useGear: true });
			ok(downedAlly.system.hp.value === 1 && !downedAlly.statuses.has("downandout") && postPilot.items[3].system.uses.value === 0, "包扎消耗修复胶直接将昏迷驾驶员以 1 HP 唤醒并解除昏迷");

			downedAlly.system.hp.value = 2;
			rollQueue = [12];
			await L.beginBasicAction(postPilot, "pilotPatch", { useGear: false, chosenSpec: { mode: "stat", statKey: "grit", label: "毅力" } });
			ctx.game.user.targets = new Set();
			ok(downedAlly.system.hp.value === 6, "包扎检定 10+ 为清醒驾驶员回复最大 HP 的一半（8 的一半 = +4 → 6 HP）");

			// 骑乘（Jockey）：对抗胜出生成控制卡 → 干扰 / 扯断管线 / 破坏 → 机甲甩脱结束骑乘
			const enemyMech = mkV11Actor("敌方重甲", true, [], { heat: 1 });
			docMap["Scene.s.Token.eMech"] = { uuid: "Scene.s.Token.eMech", name: "敌方重甲", actor: enemyMech, object: { id: "teM", name: "敌方重甲", actor: enemyMech, document: { uuid: "Scene.s.Token.eMech" } } };
			ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.eMech", name: "敌方重甲", actor: enemyMech, document: { uuid: "Scene.s.Token.eMech" } }]);
			rollQueue = [16, 11];
			const jockeyContest = await L.beginBasicAction(postPilot, "pilotJockey", { chosenSpec: { mode: "stat", statKey: "grit", label: "毅力" } });
			ctx.game.user.targets = new Set();
			ok(jockeyContest?.getFlag("lancer-cn", "contest")?.kind === "jockey", "驾驶员骑乘发起对抗检定卡");
			await L.respondToContest(jockeyContest, "hull");
			const jockeyCtrlMsg = chatCreated.find(m => m.getFlag?.("lancer-cn", "jockeyState")?.active);
			ok(Boolean(jockeyCtrlMsg), "骑乘对抗胜出后自动生成骑乘控制卡");

			await L.executeJockeyEffect(jockeyCtrlMsg, "distract");
			ok(enemyMech.statuses.has("impaired") && enemyMech.statuses.has("slow"), "骑乘·干扰对目标机甲自动施加受损与缓慢");
			await L.executeJockeyEffect(jockeyCtrlMsg, "shred");
			ok(enemyMech.system.heat.value === 3, "骑乘·扯断管线对目标机甲自动结算 2 点热度");
			const jockeyDmgCalls = [];
			ctx.game.lancer.flows.set("DamageRollFlow", class {
				constructor(u, d) { jockeyDmgCalls.push({ uuid: u, data: d }); }
				async begin() { return true; }
			});
			await L.executeJockeyEffect(jockeyCtrlMsg, "damage");
			ok(jockeyDmgCalls.length === 1 && jockeyDmgCalls[0].data.damage[0].val === "4" && jockeyDmgCalls[0].data.damage[0].type === "Kinetic", "骑乘·破坏发起 4 点动能伤害流程");

			rollQueue = [18, 9];
			const shakeContest = await L.startJockeyShakeOff(jockeyCtrlMsg, "agi");
			await L.respondToContest(shakeContest, "pilot", { chosenSpec: { mode: "stat", statKey: "grit", label: "毅力" } });
			ok(jockeyCtrlMsg.getFlag("lancer-cn", "jockeyState")?.active === false, "目标机甲甩脱对抗胜出后自动结束骑乘");

			// ---- 机甲核心协议自动化（1.12.0）
			{
				ok(L.EFFICIENT_FRAME_LIDS.size === 21, "高效（Efficient）核心骨架集合应包含全部 21 台骨架");
				ok(typeof hooks.deleteCombat === "function", "已注册 deleteCombat 钩子用于战斗结束自动返还高效/条件 CP");

				const mkCpMech = (name, frameLid, extra = {}) => {
					const frameItem = {
						id: `fr_${frameLid}`,
						type: "frame",
						name: extra.frameName ?? name,
						system: {
							lid: frameLid,
							core_system: {
								name: extra.cpName ?? `${name}核心`,
								active_name: extra.activeName ?? `${name}协议`,
								active_effect: extra.activeEffect ?? "",
								active_actions: extra.activeActions ?? [],
							},
						},
					};
					const weapons = (extra.weapons ?? []).map((w, idx) => ({
						id: w.id ?? `wp_${idx}`,
						uuid: w.uuid ?? `Actor.${name}.Item.wp_${idx}`,
						type: "mech_weapon",
						name: w.name ?? w.lid,
						system: {
							lid: w.lid,
							size: w.size ?? "Main",
							selected_profile_index: w.profile ?? 0,
							profiles: w.profiles ?? [
								{ name: "档0", type: w.wType ?? "Cannon", range: w.range ?? [{ type: "Range", val: 10 }], damage: [{ type: "Kinetic", val: "1d6" }] },
								{ name: "档1", type: w.wType ?? "Cannon", range: w.range ?? [{ type: "Range", val: 10 }], damage: [{ type: "Energy", val: "2d6" }] },
								{ name: "档2", type: w.wType ?? "Cannon", range: w.range ?? [{ type: "Range", val: 10 }], damage: [{ type: "Energy", val: "3d6" }] },
								{ name: "档3", type: w.wType ?? "Cannon", range: w.range ?? [{ type: "Range", val: 10 }], damage: [{ type: "Energy", val: "4d6" }] },
							],
							get active_profile() { return this.profiles[this.selected_profile_index] ?? this.profiles[0]; },
						},
						async update(u) {
							if ("system.selected_profile_index" in u) this.system.selected_profile_index = u["system.selected_profile_index"];
						},
					}));
					const m = mkV11Actor(name, extra.isOwner ?? true, extra.statuses ?? [], {
						...extra,
						items: [frameItem, ...weapons, ...(extra.extraItems ?? [])],
					});
					m.system.core_energy = extra.coreEnergy ?? 1;
					m.system.core_active = extra.coreActive ?? false;
					m.system.loadout = { frame: { value: frameItem }, limited_bonus: 0 };
					m.effects = [];
					const prevUpd = m.update.bind(m);
					m.update = async u => {
						await prevUpd(u);
						if ("system.core_energy" in u) m.system.core_energy = u["system.core_energy"];
						if ("system.core_active" in u) m.system.core_active = u["system.core_active"];
						if ("system.overshield.value" in u) m.system.overshield.value = u["system.overshield.value"];
						if ("system.burn" in u) m.system.burn = u["system.burn"];
						if ("system.structure.value" in u) m.system.structure.value = u["system.structure.value"];
						if ("system.stress.value" in u) m.system.stress.value = u["system.stress.value"];
						if ("system.repairs.value" in u) m.system.repairs = { ...(m.system.repairs ?? { max: 4 }), value: u["system.repairs.value"] };
					};
					m.createEmbeddedDocuments = async (docType, arr) => {
						if (docType === "ActiveEffect") {
							for (const e of arr) {
								const id = e._id ?? e.id ?? `ae_${m.effects.length + 1}`;
								m.effects.push({ id, _id: id, ...e, getFlag: (sc, k) => e.flags?.[sc]?.[k] });
							}
						}
					};
					const prevUpdEmbed = m.updateEmbeddedDocuments.bind(m);
					m.updateEmbeddedDocuments = async (docType, arr) => {
						if (docType === "ActiveEffect") {
							for (const u of arr) {
								const ex = m.effects.find(e => e.id === u._id || e._id === u._id);
								if (ex) Object.assign(ex, u);
							}
							return;
						}
						return prevUpdEmbed(docType, arr);
					};
					m.deleteEmbeddedDocuments = async (docType, ids) => {
						if (docType === "ActiveEffect") m.effects = m.effects.filter(e => !ids.includes(e.id));
					};
					docMap[m.uuid] = m;
					for (const w of weapons) docMap[w.uuid] = w;
					return m;
				};

				ctx.game.actors = [];

				// 1. consumeCorePower 自动置位 system.core_active + 核心激活卡 actionData 识别与渲染
				const cpSteps = new Map([
					["consumeCorePower", async st => { st.actor.system.core_energy = 0; return true; }],
					["initAttackData", async st => { st.data = st.data || {}; st.data.acc_diff = st.data.acc_diff || { base: { accuracy: 0, difficulty: 0 }, targets: [] }; return true; }],
					["initTechAttackData", async st => { st.data = st.data || {}; st.data.acc_diff = st.data.acc_diff || { base: { accuracy: 0, difficulty: 0 }, targets: st.targets ?? [] }; return true; }],
					["rollAttacks", async st => st.rollFn ? st.rollFn(st) : true],
					["setDamageTags", async () => true],
					["rollReliable", async () => true],
					["rollCritDamage", async () => true],
					["applyStabilizeUpdates", async () => true],
					["updateItemAfterAction", async () => true],
					["initOverchargeData", async () => true],
					["preOverheatRollChecks", async () => true],
					["printOverheatCard", async () => true],
					["initStatRollData", async st => { st.data = st.data || {}; st.data.acc_diff = st.data.acc_diff || { base: { accuracy: 0, difficulty: 0 } }; return true; }],
					["printStatRollCard", async () => true],
				]);
				ctx.game.lancer = { flows: new Map(), flowSteps: cpSteps };
				L.patchLancerFlows();

				const everest = mkCpMech("珠峰1号", "mf_standard_pattern_i_everest");
				ctx.game.actors.push(everest);
				await cpSteps.get("consumeCorePower")({ actor: everest, data: {} });
				ok(everest.system.core_active === true && L.isCoreActiveOn(everest, "mf_standard_pattern_i_everest"), "consumeCorePower 自动将 system.core_active 置为 true 并激活骨架协议状态");

				const coreActMsg = mkFlagMsg("cp_act_1", {
					lancer: {
						actionData: {
							actor: everest.uuid,
							action: { name: "增强出力", activation: "Protocol", core_active: true, detail: "所有攻击、检定和豁免得到+1准度。" },
						},
					},
				});
				const coreInfo = L.analyzeCard(coreActMsg);
				ok(coreInfo?.isCoreActivation === true && coreInfo.frameLid === "mf_standard_pattern_i_everest", "analyzeCard 解析 flags.lancer.actionData 识别机甲核心系统激活卡");
				let coreBarHtml = "";
				const coreMsgRoot = { querySelector: sel => (sel === ".message-content" ? { insertAdjacentHTML: (_p, h) => { coreBarHtml = h; }, querySelector: () => ({ addEventListener() {} }) } : null) };
				L.onRenderChatMessage(coreActMsg, [coreMsgRoot]);
				ok(/增强出力/.test(coreBarHtml) && /data-lancer-cn-cp-act="freeBoost"/.test(coreBarHtml) && /data-lancer-cn-cp-act="sceneEnd"/.test(coreBarHtml), "核心激活卡自动渲染协议状态徽章、专属子动作按钮与场景结束结算按钮");

				// 珠穆朗玛全攻击 / 科技攻击 / 属性豁免自动 +1 准度
				const evAtk = { actor: everest, data: {} };
				await cpSteps.get("initAttackData")(evAtk);
				const evTech = { actor: everest, data: {} };
				await cpSteps.get("initTechAttackData")(evTech);
				const evStat = { actor: everest, data: {} };
				await cpSteps.get("initStatRollData")(evStat);
				ok(evAtk.data.acc_diff.base.accuracy === 1 && evTech.data.acc_diff.base.accuracy === 1 && evStat.data.acc_diff.base.accuracy === 1, "珠穆朗玛「增强出力」激活期间武器攻击、科技攻击与属性检定/豁免均自动预填 +1 准度");

				// 2. 兰开斯特「增压器」盟友 +1 准度、回合开始兰开斯特 +1 热度、晕眩自动断开 + 萨加玛塔战旗抗性与 +1 豁免准度
				const lancaster = mkCpMech("兰开斯特", "mf_lancaster", { heat: 1 });
				const latchedAlly = mkCpMech("受援突击机", "mf_nelson");
				docMap["Scene.s.Token.latched"] = { uuid: "Scene.s.Token.latched", name: "受援突击机", actor: latchedAlly };
				latchedAlly.token = { uuid: "Scene.s.Token.latched", name: "受援突击机" };
				ctx.game.actors.push(lancaster, latchedAlly);
				ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.latched", name: "受援突击机", actor: latchedAlly, document: { uuid: "Scene.s.Token.latched" } }]);
				await L.activateCorePower(lancaster);
				ctx.game.user.targets = new Set();
				ok(L.cpAttackAccuracyBonus(latchedAlly) === 1 && L.cpStatAccuracyBonus(latchedAlly) === 1, "兰开斯特增压器绑定盟友后，该盟友的攻击与检定/豁免均自动 +1 准度");
				const lancCombat = {
					previous: { combatantId: "cl0" },
					current: { combatantId: "cl1" },
					combatants: [
						{ id: "cl0", name: "受援突击机", actor: latchedAlly, token: { uuid: "Scene.s.Token.latched" } },
						{ id: "cl1", name: "兰开斯特", actor: lancaster, token: { uuid: lancaster.uuid } },
					],
				};
				lancCombat.combatants.get = id => lancCombat.combatants.find(c => c.id === id);
				await L.onUpdateCombatTurnEnd(lancCombat, { turn: 1 }, { direction: 1 });
				ok(lancaster.system.heat.value === 2 && latchedAlly.system.heat.value === 0, "兰开斯特回合开始时自身自动承受 1 点增压器维持热度");
				await L.setActorStatus("Scene.s.Token.latched", "stunned", true);
				ok(!L.getCoreState(lancaster).latchTargetUuid && L.cpAttackAccuracyBonus(latchedAlly) === 0, "兰开斯特或绑定盟友陷入晕眩时自动断开增压器连接");

				const sagarmatha = mkCpMech("萨加玛塔", "mf_sagarmatha");
				const bannerAlly = mkCpMech("战旗友军", "mf_tortuga");
				docMap["Scene.s.Token.banner"] = { uuid: "Scene.s.Token.banner", name: "战旗友军", actor: bannerAlly };
				bannerAlly.token = { uuid: "Scene.s.Token.banner", name: "战旗友军" };
				ctx.game.actors.push(sagarmatha, bannerAlly);
				ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.banner", name: "战旗友军", actor: bannerAlly, document: { uuid: "Scene.s.Token.banner" } }]);
				await L.activateCorePower(sagarmatha);
				ctx.game.user.targets = new Set();
				ok(L.RESIST_IDS.every(r => bannerAlly.statuses.has(r)) && L.cpStatAccuracyBonus(bannerAlly) === 1, "萨加玛塔「扬起旗帜」为锁定盟友自动开启全伤害抗性并提供 +1 检定/豁免准度");
				const sagCombat = {
					previous: { combatantId: "csg1" },
					current: { combatantId: "csg2" },
					combatants: [
						{ id: "csg1", name: "萨加玛塔", actor: sagarmatha, token: { uuid: sagarmatha.uuid } },
						{ id: "csg2", name: "战旗友军", actor: bannerAlly, token: { uuid: "Scene.s.Token.banner" } },
					],
				};
				sagCombat.combatants.get = id => sagCombat.combatants.find(c => c.id === id);
				await L.onUpdateCombatTurnEnd(sagCombat, { turn: 1 }, { direction: 1 });
				ok(L.isCoreActiveOn(sagarmatha, "mf_sagarmatha"), "萨加玛塔激活当回合结束时战旗仍保持激活（持续至下一回合结束）");
				await L.onUpdateCombatTurnEnd(sagCombat, { turn: 1 }, { direction: 1 });
				ok(!L.isCoreActiveOn(sagarmatha, "mf_sagarmatha") && L.RESIST_IDS.every(r => !bannerAlly.statuses.has(r)), "萨加玛塔下一回合结束时自动解除战旗并清除受旗盟友抗性");

				// 3. 拿破仑「真黑神盾」：非离散伤害强制压至 1（即使暴露+受扰），热度照常、离散不减，且禁止超限
				class MockActorDoc {
					async damageCalc(damage, opts) {
						this._lastDmgCall = { damage, opts, exposedDuringCall: this.system?.statuses?.exposed };
						return { ok: true };
					}
				}
				ctx.CONFIG.Actor = { documentClass: MockActorDoc };
				L.patchTrueblackDamageCalc();
				const napoleon = mkCpMech("拿破仑", "mf_napoleon", { statuses: ["lockon", "exposed", "shredded"], armor: 2 });
				napoleon.system.statuses.exposed = true;
				Object.setPrototypeOf(napoleon, MockActorDoc.prototype);
				await L.activateCorePower(napoleon);
				ok(!napoleon.statuses.has("lockon"), "拿破仑启动真黑神盾时自动清除现有锁定");
				const tbPrevNorm = L.previewDamageCalc(napoleon, [{ type: "Kinetic", val: 14 }, { type: "Heat", val: 4 }], {});
				const tbPrevBurn = L.previewDamageCalc(napoleon, [{ type: "Burn", val: 6 }], {});
				const tbPrevPara = L.previewDamageCalc(napoleon, [{ type: "Kinetic", val: 10 }], { paracausal: true });
				ok(tbPrevNorm.hpLoss === 1 && tbPrevNorm.heatGain === 4, "真黑神盾预览：即使暴露+受扰，非离散伤害仍强制压至 1 HP，热度照常承受 4 点");
				ok(tbPrevBurn.hpLoss === 1 && tbPrevBurn.burnGain === 1, "真黑神盾预览：非离散燃烧伤害同样压至 1 点");
				ok(tbPrevPara.hpLoss === 20, "真黑神盾预览：离散（无法减免）伤害不受真黑神盾压缩（含暴露翻倍为 20）");
				await napoleon.damageCalc({ Kinetic: 15, Energy: 0, Explosive: 0, Burn: 0, Heat: 3, Variable: 0 }, {});
				ok(napoleon._lastDmgCall.damage.Kinetic === 1 && napoleon._lastDmgCall.damage.Heat === 3 && napoleon._lastDmgCall.opts.ap === true && napoleon._lastDmgCall.exposedDuringCall === false && napoleon.system.statuses.exposed === true, "真黑神盾拦截 Actor.damageCalc：非离散伤害压为 1（临时屏蔽暴露翻倍），热度保留原值");
				ok((await cpSteps.get("initOverchargeData")({ actor: napoleon, data: {} })) === false, "真黑神盾激活期间拦截禁止执行超限");

				// 4. 珠穆朗玛II「广域编码脉冲」：科技攻击无视隐形（-1），命中挂受损+缓慢，未命中也自动挂受损
				const chomo = mkCpMech("珠峰II", "mf_chomolungma");
				chomo._lancerCnWidePulse = true;
				const invisTad = { plugins: { invisibility: { data: 1 } } };
				await cpSteps.get("initTechAttackData")({ actor: chomo, targets: [invisTad], data: null });
				delete chomo._lancerCnWidePulse;
				ok(invisTad.plugins.invisibility.data === -1, "广域编码脉冲在 TechAttackFlow 中自动将目标隐形插件设为无视（-1）");
				const pulseHitFoe = mkV11Actor("脉冲命中敌", true, []);
				const pulseMissFoe = mkV11Actor("脉冲未中敌", true, []);
				docMap["Scene.s.Token.pHit"] = { uuid: "Scene.s.Token.pHit", name: "脉冲命中敌", actor: pulseHitFoe };
				docMap["Scene.s.Token.pMiss"] = { uuid: "Scene.s.Token.pMiss", name: "脉冲未中敌", actor: pulseMissFoe };
				const pulseMsg = mkFlagMsg("pulse_1", {
					"lancer-cn": { cpAttack: { kind: "chomolungmaPulse" } },
					lancer: {
						attackData: {
							attackerUuid: chomo.uuid,
							invade: true,
							targets: [
								{ uuid: "Scene.s.Token.pHit", hit: true, crit: false },
								{ uuid: "Scene.s.Token.pMiss", hit: false, crit: false },
							],
						},
					},
				});
				await L.onCreateChatMessage(pulseMsg, {}, "u1");
				ok(pulseHitFoe.statuses.has("impaired") && pulseHitFoe.statuses.has("slow") && pulseMissFoe.statuses.has("impaired") && !pulseMissFoe.statuses.has("slow"), "广域编码脉冲命中施加受损+缓慢，未命中目标也自动施加受损");

				// 5. 多模式核心武器与充能：谢尔曼 ZF4、卡利班剥皮者、狼人狼嚎（priority 15 + 毁坏利爪）、雷利雷神 4 发 AP 受扰、巴巴罗萨末日骰、白巫蛾铁磁装甲
				const sherman = mkCpMech("谢尔曼", "mf_sherman", {
					weapons: [{ lid: "mw_sherman_integrated", profile: 0 }],
				});
				await L.activateCorePower(sherman);
				ok(sherman.items[1].system.selected_profile_index === 3 && L.getCoreState(sherman).counterValue === 4, "谢尔曼激活核心时 ZF4 固态核心炮立即 +3 充能升至 4 阶（档位 3）");
				await cpSteps.get("updateItemAfterAction")({ actor: sherman, item: sherman.items[1], data: {} });
				ok(sherman.items[1].system.selected_profile_index === 0 && L.getCoreState(sherman).counterValue === 1, "谢尔曼发射 ZF4 后自动重置回 1 阶充能（档位 0）");
				await cpSteps.get("applyStabilizeUpdates")({ actor: sherman, data: { option2: "Reload" } });
				ok(sherman.items[1].system.selected_profile_index === 2 && L.getCoreState(sherman).counterValue === 3, "谢尔曼核心激活期间执行稳住阵脚自动获得 +2 充能（1 → 3 阶）");

				const caliban = mkCpMech("卡利班", "mf_caliban", {
					weapons: [{ lid: "mw_caliban_integrated", profile: 0 }],
				});
				await L.activateCorePower(caliban);
				ok(caliban.items[1].system.selected_profile_index === 1, "卡利班激活自动锁喉时切换内建霰弹枪至核心档位（profile 1）");
				await L.deactivateCoreEffect(caliban);
				ok(caliban.items[1].system.selected_profile_index === 0, "卡利班结束核心时恢复内建霰弹枪默认档位（profile 0）");

				const lycan = mkCpMech("狼人", "mf_lycan", {
					structure: 2,
					weapons: [{ lid: "mw_integrated_shock_claws", profile: 0 }],
				});
				ctx.game.actors.push(lycan);
				await L.activateCorePower(lycan);
				ok(lycan.effects.length === 1 && lycan.effects[0].changes.some(c => c.key === "system.speed" && c.value === "6" && c.priority === 15) && lycan.items[1].system.selected_profile_index === 2, "狼人激活狼嚎注入 priority 15 基础护甲0/基础速度6 ActiveEffect，且结构 <= 2 时自动切为毁坏利爪（profile 2）");

				const whiteWitch = mkCpMech("白巫蛾", "mf_white_witch");
				await L.activateCorePower(whiteWitch);
				for (let i = 0; i < 3; i++) await L.executeCoreAction(whiteWitch, "whiteWitchGain2");
				ok(L.getCoreState(whiteWitch).counterValue === 6 && whiteWitch.statuses.has("immobilized") && whiteWitch.effects.some(e => e.changes?.[0]?.value === "6"), "白巫蛾超激活叠甲 3 次（每次 +2）叠至 +6 护甲并自动陷入固定");
				await L.executeCoreAction(whiteWitch, "whiteWitchBurst");
				ok(L.getCoreState(whiteWitch).counterValue === 0 && !whiteWitch.statuses.has("immobilized"), "白巫蛾释放超激活铁磁爆发后护甲归零并自动解除叠甲固定");

				const raleigh = mkCpMech("雷利", "mf_raleigh", {
					weapons: [{ lid: "mw_raleigh_integrated", profile: 0 }],
				});
				await L.activateCorePower(raleigh);
				const ralCombat = {
					previous: { combatantId: "cr1" },
					current: { combatantId: "cr2" },
					combatants: [{ id: "cr1", name: "雷利", actor: raleigh, token: { uuid: raleigh.uuid } }],
				};
				ralCombat.combatants.get = id => ralCombat.combatants.find(c => c.id === id);
				await L.onUpdateCombatTurnEnd(ralCombat, { turn: 1 }, { direction: 1 });
				await L.onUpdateCombatTurnEnd(ralCombat, { turn: 1 }, { direction: 1 });
				ok(L.getCoreState(raleigh).counterValue === 4, "雷利未发射雷神之锤的回合结束时每次自动装填 2 发弹药（0 → 2 → 4）");
				const ralTarget = mkV11Actor("雷神靶机", true, []);
				docMap["Scene.s.Token.ralT"] = { uuid: "Scene.s.Token.ralT", name: "雷神靶机", actor: ralTarget, object: { id: "trT", name: "雷神靶机", actor: ralTarget, document: { uuid: "Scene.s.Token.ralT" } } };
				const ralAtkMsg = mkFlagMsg("ral_atk", {
					"lancer-cn": { cpAttack: { kind: "raleighMjolnir", chambers: 4 } },
					lancer: {
						attackData: {
							attackerUuid: raleigh.uuid,
							targets: [{ uuid: "Scene.s.Token.ralT", total: 18, hit: true, crit: false }],
						},
					},
				});
				await L.onCreateChatMessage(ralAtkMsg, {}, "u1");
				ok(ralTarget.statuses.has("shredded"), "雷利发射 4 发或以上雷神之锤命中时自动对目标施加离散（shredded）");
				const ralDmgCalls = [];
				ctx.game.lancer.flows.set("DamageRollFlow", class {
					constructor(u, d) { ralDmgCalls.push(d); }
					async begin() { return true; }
				});
				await L.rollBasicDamage(ralAtkMsg, null, ralAtkMsg.getFlag("lancer-cn", "cpAttack"));
				ok(ralDmgCalls.length === 1 && ralDmgCalls[0].damage[0].val === "16" && ralDmgCalls[0].ap === true, "雷利 4 发齐射掷伤害自动按 4×4 = 16 动能且附带穿甲（AP）结算");

				const barbarossa = mkCpMech("巴巴罗萨", "mf_barbarossa", {
					weapons: [{ lid: "mw_barbarossa_integrated", profile: 0 }],
				});
				ctx.game.actors.push(barbarossa);
				await L.activateCorePower(barbarossa);
				const barbCombat = {
					previous: { combatantId: "cb0" },
					current: { combatantId: "cb1" },
					combatants: [
						{ id: "cb0", name: "前序机", actor: normalS1, token: { uuid: normalS1.uuid } },
						{ id: "cb1", name: "巴巴罗萨", actor: barbarossa, token: { uuid: barbarossa.uuid } },
					],
				};
				barbCombat.combatants.get = id => barbCombat.combatants.find(c => c.id === id);
				await L.onUpdateCombatTurnEnd(barbCombat, { turn: 1 }, { direction: 1 });
				ok(L.getCoreState(barbarossa).counterValue === 3 && barbarossa.items[1].system.selected_profile_index === 1, "巴巴罗萨回合开始末日骰自动递减（4 → 3）并同步末日导轨档位");
				await L.setActorStatus(barbarossa, "jammed", true);
				ok(L.getCoreState(barbarossa).counterValue === 4 && barbarossa.items[1].system.selected_profile_index === 0, "巴巴罗萨陷入受扰时末日骰自动重置回 4（无法发射档位）");

				// 6. 吉尔伽美什护盾净化、成吉思 TBK 免除过热、蝎尾狮热度/能量充能、牛头怪迷宫递减难度、炎魔不可清受扰、鬼面蛾死印暴击加成、因帕卡伊擒拿体型
				const gilgamesh = mkCpMech("吉尔伽美什", "mf_gilgamesh", { grit: 3, statuses: ["impaired", "exposed", "prone"] });
				await L.activateCorePower(gilgamesh);
				ok(gilgamesh.system.overshield.value === 7 && !gilgamesh.statuses.has("impaired") && !gilgamesh.statuses.has("exposed") && !gilgamesh.statuses.has("prone"), "吉尔伽美什启动外骨骼扩容清除状况/暴露/伏卧并获得毅力+4（7 点）护盾");

				const genghis = mkCpMech("成吉思", "mf_genghis", { heat: 8, statuses: ["dangerzone"] });
				await L.activateCorePower(genghis);
				const tbkRes = await cpSteps.get("preOverheatRollChecks")({ actor: genghis, data: {} });
				ok(tbkRes === false && genghis.system.heat.value === 0 && !genghis.statuses.has("dangerzone") && !L.getCoreState(genghis).tbkArmed, "成吉思 TBK 持续套件自动拦截首次过热压力检定、排空全部热度并生成爆发 3 烟云卡");

				const manticore = mkCpMech("蝎尾狮", "mf_manticore", { heat: 1 });
				Object.setPrototypeOf(manticore, MockActorDoc.prototype);
				await L.activateCorePower(manticore);
				manticore.system.heat.value = 3;
				await L.onUpdateActorStatus(manticore, { system: { heat: { value: 3 } } }, {}, "u1");
				await manticore.damageCalc({ Kinetic: 0, Energy: 4, Explosive: 0, Burn: 0, Heat: 0, Variable: 0 }, {});
				ok(L.getCoreState(manticore).counterValue === 3, "蝎尾狮受到热度与能量伤害时破灭充能骰分别自动 +1（1 → 2 → 3）");

				const minotaur = mkCpMech("牛头怪", "mf_minotaur", { save: 13 });
				const mazeVictim = mkV11Actor("迷宫受困者", true, []);
				docMap["Scene.s.Token.mazeV"] = { uuid: "Scene.s.Token.mazeV", name: "迷宫受困者", actor: mazeVictim };
				const mazeModsSeen = [];
				ctx.game.lancer.flows.set("StatRollFlow", class {
					constructor(u, d) { this.uuid = u; this.state = { actor: mazeVictim, data: { ...d } }; }
					async begin(d) {
						this.state.data = { ...d, acc_diff: { base: { accuracy: 0, difficulty: 0 } } };
						await cpSteps.get("initStatRollData")(this.state);
						mazeModsSeen.push({ ...this.state.data.acc_diff.base });
						this.state.data.result = { roll: { total: rollQueue.shift() ?? 10 } };
						return true;
					}
				});
				const mazeMsg = await L.createMazeCard(minotaur, docMap["Scene.s.Token.mazeV"]);
				ok(mazeVictim.statuses.has("stunned") && mazeMsg.getFlag("lancer-cn", "mazeState")?.netDiff === 3, "牛头怪「迷宫」自动对目标施加晕眩并初始化 +3 难度系统豁免卡");
				rollQueue = [9, 15];
				await L.attemptMazeSave(mazeMsg);
				ok(mazeVictim.statuses.has("stunned") && mazeMsg.getFlag("lancer-cn", "mazeState")?.netDiff === 2 && mazeModsSeen[0].difficulty === 3, "迷宫首次系统豁免自动带入 +3 难度，失败后下次修正递减为 +2 难度");
				await L.attemptMazeSave(mazeMsg);
				ok(!mazeVictim.statuses.has("stunned") && mazeMsg.getFlag("lancer-cn", "mazeState")?.active === false && mazeModsSeen[1].difficulty === 2, "迷宫系统豁免通过后自动解除目标晕眩并归档迷宫卡");

				const balor = mkCpMech("炎魔", "mf_balor", { statuses: ["impaired"] });
				await L.activateCorePower(balor);
				await setActorStatusCompat(balor, "shredded", true);
				async function setActorStatusCompat(a, st, on) { await L.setActorStatus(a, st, on); }
				await cpSteps.get("applyStabilizeUpdates")({ actor: balor, data: { option2: "ClearOwnCond" } });
				ok(balor.statuses.has("shredded") && !balor.statuses.has("impaired"), "炎魔虫巢狂乱持续期间稳住阵脚不会误清不可移除的离散（shredded），只清其他状况");

				const deathsHead = mkCpMech("鬼面蛾", "mf_deaths_head", {
					weapons: [{ lid: "mw_railgun", size: "Heavy", wType: "Rifle", range: [{ type: "Range", val: 20 }] }],
				});
				const dhVictim = mkV11Actor("死印目标", true, []);
				docMap["Scene.s.Token.dhV"] = { uuid: "Scene.s.Token.dhV", name: "死印目标", actor: dhVictim };
				await L.activateCorePower(deathsHead);
				ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.dhV", name: "死印目标", actor: dhVictim, document: { uuid: "Scene.s.Token.dhV" } }]);
				await L.executeCoreAction(deathsHead, "deathsHeadMark");
				ctx.game.user.targets = new Set();
				ok(deathsHead.statuses.has("immobilized") && L.getCoreState(deathsHead).markTargetUuid === "Scene.s.Token.dhV", "鬼面蛾发动死印锁定目标并使自身陷入固定");
				ctx.Roll = class { constructor(f) { this.formula = f; } async evaluate() { this.total = this.formula === "3d6" ? 12 : 4; return this; } async getTooltip() { return ""; } };
				const dhCritState = {
					actor: deathsHead,
					item: deathsHead.items[1],
					data: {
						has_crit_hit: true,
						damage: [{ type: "Kinetic", val: "2d6" }],
						crit_damage_results: [],
						targets: [{ target: { uuid: "Scene.s.Token.dhV" }, crit: true, half_damage: false, damage: [{ type: "Kinetic", amount: 9 }] }],
					},
				};
				await cpSteps.get("rollCritDamage")(dhCritState);
				ok(dhCritState.data.targets[0].damage.some(d => d.amount === 12), "鬼面蛾重型远程武器对无掩护死印目标会心时自动追加 +3d6 死印额外暴击伤害");

				// 7. 佩玛达远程净准度上限为 0、柔剑 18+ 暴击与未命中返还 CP、夹竹桃蛾重型会心离散+排热+回合末停用保留高效、夜刀蛾完美射击离散+可靠3、因帕卡伊擒拿体型
				const pemada = mkCpMech("佩玛达", "mf_ch_pemada");
				await L.activateCorePower(pemada);
				const pemTad = { target: { actor: pemada }, accuracy: 3, difficulty: 1, total: 2 };
				await cpSteps.get("rollAttacks")({ actor: everest, data: { attack_type: "Ranged", acc_diff: { targets: [pemTad] } } });
				ok(pemTad.difficulty === 3 && pemTad.total === 0, "佩玛达折光棱镜将针对其的远程攻击净准度（+2）自动抵消压至 0");

				const jouken = mkCpMech("柔剑", "mf_ext_jouken");
				await L.activateCorePower(jouken);
				jouken._lancerCnCrit18 = true;
				const jkState = { actor: jouken, data: { hit_results: [{ total: 18, hit: true, crit: false }] } };
				await cpSteps.get("rollAttacks")(jkState);
				delete jouken._lancerCnCrit18;
				ok(jkState.data.hit_results[0].crit === true && jkState.data.has_crit_hit === true, "柔剑亲和力中断将 18+ 攻击检定自动升级为会心一击");
				const jkMissMsg = mkFlagMsg("jk_miss", {
					"lancer-cn": { cpAttack: { kind: "joukenInterrupt" } },
					lancer: {
						attackData: {
							attackerUuid: jouken.uuid,
							targets: [{ uuid: "Scene.s.Token.pMiss", hit: false, crit: false }],
						},
					},
				});
				await L.onCreateChatMessage(jkMissMsg, {}, "u1");
				ok(jouken.system.core_energy === 1 && !L.getCoreState(jouken).pendingRefund, "柔剑亲和力中断未命中任何目标时立即自动返还 1 CP 并清除待结算标记（不重复返还）");

				const oleander = mkCpMech("夹竹桃蛾", "mf_ext_oleander", {
					heat: 5,
					weapons: [{ lid: "mw_hmg", size: "Heavy", wType: "Cannon", range: [{ type: "Range", val: 8 }] }],
				});
				ctx.game.actors.push(oleander);
				await L.activateCorePower(oleander);
				const olFoe = mkV11Actor("夹竹桃靶", true, []);
				docMap["Scene.s.Token.olF"] = { uuid: "Scene.s.Token.olF", name: "夹竹桃靶", actor: olFoe };
				const olAtkMsg = mkFlagMsg("ol_atk", {
					lancer: {
						attackData: {
							attackerUuid: oleander.uuid,
							attackerItemUuid: oleander.items[1].uuid,
							targets: [{ uuid: "Scene.s.Token.olF", hit: true, crit: true }],
						},
					},
				});
				await L.onCreateChatMessage(olAtkMsg, {}, "u1");
				ok(oleander.system.heat.value === 3 && olFoe.statuses.has("prone") && olAtkMsg.getFlag("lancer-cn", "cpDamageMod")?.oleanderCritParacausal === true, "夹竹桃蛾全系统已上线期间重型远程攻击冷却 2 热度、暴击击倒目标并标记会心离散伤害");
				const olCritState = {
					actor: oleander,
					item: oleander.items[1],
					data: {
						has_crit_hit: true,
						lancerCnDamageMod: olAtkMsg.getFlag("lancer-cn", "cpDamageMod"),
						targets: [
							{ crit: true, damage: [{ type: "Kinetic", amount: 10 }] },
							{ crit: false, damage: [{ type: "Kinetic", amount: 6 }] },
						],
					},
				};
				await cpSteps.get("rollCritDamage")(olCritState);
				ok(olCritState.data.targets[0].paracausal === true && !olCritState.data.targets[1].paracausal, "夹竹桃蛾只将会心命中的目标伤害转为离散（普通命中不转离散）");
				const olCombat = {
					previous: { combatantId: "co1" },
					current: { combatantId: "co2" },
					combatants: [{ id: "co1", name: "夹竹桃蛾", actor: oleander, token: { uuid: oleander.uuid } }],
				};
				olCombat.combatants.get = id => olCombat.combatants.find(c => c.id === id);
				await L.onUpdateCombatTurnEnd(olCombat, { turn: 1 }, { direction: 1 });
				ok(!L.isCoreActiveOn(oleander, "mf_ext_oleander") && L.getCoreState(oleander).pendingRefund === "efficient", "夹竹桃蛾回合结束时自动停用持续效果，但保留高效返还标记至场景结束");

				const nightCutter = mkCpMech("夜刀蛾", "mf_ext_night_cutter", {
					weapons: [{ lid: "mw_amr", size: "Heavy", wType: "Rifle", range: [{ type: "Range", val: 20 }] }],
				});
				await L.activateCorePower(nightCutter);
				const ncMissFoe = mkV11Actor("夜刀未中靶", true, ["lockon"]);
				docMap["Scene.s.Token.ncM"] = { uuid: "Scene.s.Token.ncM", name: "夜刀未中靶", actor: ncMissFoe };
				const ncAtkMsg = mkFlagMsg("nc_atk", {
					lancer: {
						attackData: {
							attackerUuid: nightCutter.uuid,
							attackerItemUuid: nightCutter.items[1].uuid,
							targets: [{ uuid: "Scene.s.Token.ncM", hit: false, crit: false, setConditions: { lockon: false } }],
						},
					},
				});
				await L.onCreateChatMessage(ncAtkMsg, {}, "u1");
				const ncDmgMod = ncAtkMsg.getFlag("lancer-cn", "cpDamageMod");
				ok(ncMissFoe.statuses.has("impaired") && ncDmgMod?.paracausal === true && ncDmgMod?.minReliable === 3, "夜刀蛾完美射击消耗锁定攻击时赋予离散+可靠3，且未命中目标自动陷入受损");
				const ncRelState = { actor: nightCutter, data: { lancerCnDamageMod: ncDmgMod, reliable: false, reliable_val: 0, targets: [{}] } };
				await cpSteps.get("rollReliable")(ncRelState);
				ok(ncRelState.data.paracausal === true && ncRelState.data.reliable === true && ncRelState.data.reliable_val === 3, "夜刀蛾完美射击在 DamageRollFlow 中自动注入离散与可靠 3 保底伤害");

				const empakaai = mkCpMech("因帕卡伊", "mf_Empakaai_alt_blackbeard", { size: 1 });
				await L.activateCorePower(empakaai);
				ok(L.effectiveGrappleSize(empakaai, 3, { isGrappler: false }) === 4, "因帕卡伊「骨髓之锚」激活时无论攻防均视为比擒拿对手体型大 1（面对体型 3 视为体型 4）");

				// 8. 场景结束（onDeleteCombat）与全面维修（onFullRepair）CP 自动返还验证
				const enkiduNoKill = mkCpMech("恩奇都未处决", "mf_tokugawa_alt_enkidu");
				const enkiduKilled = mkCpMech("恩奇都已处决", "mf_tokugawa_alt_enkidu");
				await L.activateCorePower(enkiduNoKill);
				await L.activateCorePower(enkiduKilled);
				const bifurcateTarget = mkV11Actor("残血敌机", true, [], { structure: 1, hp: 5 });
				docMap["Scene.s.Token.bifT"] = { uuid: "Scene.s.Token.bifT", name: "残血敌机", actor: bifurcateTarget };
				ctx.game.user.targets = new Set([{ uuid: "Scene.s.Token.bifT", name: "残血敌机", actor: bifurcateTarget, document: { uuid: "Scene.s.Token.bifT" } }]);
				await L.executeCoreAction(enkiduKilled, "enkiduBifurcate");
				ctx.game.user.targets = new Set();
				ok(bifurcateTarget.statuses.has("downandout") && L.getCoreState(enkiduKilled).enkiduDestroyedAny === true, "恩奇都「双分断」对 ≤1 结构且 ≤7 HP 目标一键处决并记录已处决");

				const barbFired = mkCpMech("巴巴罗萨已开火", "mf_barbarossa", { weapons: [{ lid: "mw_barbarossa_integrated", profile: 1 }] });
				await L.activateCorePower(barbFired);
				await cpSteps.get("updateItemAfterAction")({ actor: barbFired, item: barbFired.items[1], data: {} });

				await L.onDeleteCombat({
					combatants: [
						{ actor: everest },       // 非高效 → 保持 0 CP
						{ actor: lycan },         // 高效持续 → 返还 1 CP 并清狼嚎 ActiveEffect
						{ actor: oleander },      // 高效短效（已于回合末解除激活） → 仍返还 1 CP
						{ actor: barbarossa },    // 未发射末日导轨 → 返还 1 CP
						{ actor: barbFired },     // 已发射末日导轨 → 保持 0 CP
						{ actor: enkiduNoKill },  // 未用双分断摧毁敌人 → 返还 1 CP
						{ actor: enkiduKilled },  // 已用双分断摧毁敌人 → 保持 0 CP
					],
				});
				ok(everest.system.core_energy === 0 && !everest.system.core_active, "场景结束：普通核心机甲关闭持续效果且不返还 CP");
				ok(lycan.system.core_energy === 1 && lycan.effects.length === 0, "场景结束：高效机甲（狼人）自动返还 1 CP 并清理临时 ActiveEffect");
				ok(oleander.system.core_energy === 1, "场景结束：已在回合末结束持续效果的高效机甲（夹竹桃蛾）仍准确返还 1 CP");
				ok(barbarossa.system.core_energy === 1 && barbFired.system.core_energy === 0, "场景结束：巴巴罗萨仅在本场景未发射末日导轨时返还 1 CP");
				ok(enkiduNoKill.system.core_energy === 1 && enkiduKilled.system.core_energy === 0, "场景结束：恩奇都仅在本场景未以双分断处决敌人时返还 1 CP");

				await L.onFullRepair({ state: { actor: everest } }, true);
				ok(everest.system.core_energy === 1, "全面维修后普通机甲核心能量回满至 1 CP");

				// 9. 机甲表核心协议控制栏注入与按钮点击（飞马巫沙布提万物枪 3 次/轮 + 新轮重置）
				const pegasus = mkCpMech("天马", "mf_pegasus");
				await L.activateCorePower(pegasus);
				const pegInjected = [];
				const coreWrapEl = { insertAdjacentHTML: (pos, h) => pegInjected.push([pos, h]) };
				const pegCpBtn = { dataset: { lancerCnCpAct: "pegasusOmnigun" }, onclick: null };
				const pegSheetRoot = {
					dataset: {},
					querySelectorAll: sel => (sel.includes("[data-lancer-cn-cp-act]") ? [pegCpBtn] : []),
					querySelector: sel => (sel.includes(".core-wrapper") ? coreWrapEl : null),
				};
				L.onRenderActorSheet({ actor: pegasus }, [pegSheetRoot]);
				ok(pegInjected.length === 1 && /lancer-cn-core-bar/.test(pegInjected[0][1]) && /pegasusOmnigun/.test(pegInjected[0][1]) && typeof pegCpBtn.onclick === "function", "机甲表在核心激活期间自动注入核心协议控制栏并绑定子动作按钮");
				await L.onSheetButton({ actor: pegasus }, pegCpBtn);
				ok(L.getCoreState(pegasus).counterValue === 2, "机甲表点击万物枪按钮自动扣减本轮次数（3 → 2）并发起 1 点穿甲离散伤害");
				await L.onUpdateCombatTurnEnd({ combatants: [{ actor: pegasus }] }, { round: 2 }, { direction: 1 });
				ok(L.getCoreState(pegasus).counterValue === 3, "战斗进入新一轮时天马万物枪次数自动恢复至 3 / 3");

				// ---- 武器与改装、科技与入侵系统、驾驶员全天赋与战斗核心奖励自动化（1.13.0）
				{
					const mkPilot = (name, { talents = [], coreBonuses = [], grit = 2, activeMech = null } = {}) => {
						const tItems = talents.map(([lid, rank, extraSys = {}], i) => ({
							id: `tal_${i}`,
							uuid: `Actor.${name}.Item.tal_${i}`,
							type: "talent",
							name: extraSys.name ?? lid,
							is_talent: () => true,
							system: { lid, curr_rank: rank, ranks: extraSys.ranks ?? [], actions: extraSys.actions ?? [], ...extraSys },
						}));
						const cbItems = coreBonuses.map((lid, i) => ({
							id: `cb_${i}`,
							uuid: `Actor.${name}.Item.cb_${i}`,
							type: "core_bonus",
							name: lid,
							system: { lid },
						}));
						const p = mkV11Actor(name, true, [], { type: "pilot", grit, items: [...tItems, ...cbItems] });
						p.itemTypes = { talent: tItems, core_bonus: cbItems };
						p.system.active_mech = { value: activeMech };
						docMap[p.uuid] = p;
						for (const it of p.items) { it.actor = p; it.parent = p; docMap[it.uuid] = it; }
						return p;
					};

					const attachPilot = (mech, pilotOpts) => {
						const p = mkPilot(`${mech.name}_驾驶员`, { ...pilotOpts, activeMech: mech });
						mech.system.pilot = { value: p, id: p.id };
						return p;
					};

					const v13Steps = new Map([
						["consumeCorePower", async st => { st.actor.system.core_energy = 0; return true; }],
						["initAttackData", async st => {
							st.data = st.data || {};
							st.data.acc_diff = st.data.acc_diff || { base: { accuracy: 0, difficulty: 0 }, weapon: { engaged: Boolean(st.engaged), inaccurate: Boolean(st.inaccurate), arcing: false, thrown: Boolean(st.item?.system?.active_profile?.all_tags?.some?.(t => t?.lid === "tg_thrown" || t?.is_thrown)), seeking: false }, targets: st.targets ?? [] };
							return true;
						}],
						["setAttackTags", async st => {
							st.data = st.data || {};
							st.data.tags = st.data.tags || (st.item?.system?.active_profile?.all_tags ?? st.item?.system?.tags ?? []);
							return true;
						}],
						["initTechAttackData", async st => {
							st.data = st.data || {};
							if (st.item?.type === "npc_feature" && st.actor?.type === "npc") {
								// 精确复现系统原生 tech.ts:137 缺少括号的表达式
								const tierIdx = st.item.system.tier_override || st.actor.system.tier - 1;
								const acc = st.item.system.accuracy?.[tierIdx] ?? 0;
								st.data.grit = st.item.system.attack_bonus?.[tierIdx] ?? 0;
								st.data.acc_diff = st.data.acc_diff || {
									base: { grit: st.data.grit, accuracy: acc > 0 ? acc : 0, difficulty: acc < 0 ? -acc : 0 },
									targets: st.targets ?? [],
								};
								return true;
							}
							st.data.acc_diff = st.data.acc_diff || { base: { accuracy: 0, difficulty: 0 }, targets: st.targets ?? [] };
							return true;
						}],
						["printTechAttackCard", async st => {
							const m = mkFlagMsg(`tech_${Date.now()}_${Math.random()}`, {
								lancer: {
									attackData: {
										attackerUuid: st.actor.uuid,
										attackerItemUuid: st.item?.uuid ?? null,
										invade: Boolean(st.data?.invade),
										targets: st.cardTargets ?? [],
									},
								},
							}, { content: st.cardHtml ?? "" });
							m.updateSource = u => {
								for (const [k, v] of Object.entries(u)) {
									const segs = k.split(".");
									let cur = m;
									for (let i = 0; i < segs.length - 1; i++) cur = (cur[segs[i]] ||= {});
									cur[segs.at(-1)] = v;
								}
							};
							L.onPreCreateBasicCard(m);
							await L.onCreateChatMessage(m, {}, "u1");
							st._card = m;
							return true;
						}],
						["printAttackCard", async st => {
							const m = mkFlagMsg(`watk_${Date.now()}_${Math.random()}`, {
								lancer: {
									attackData: {
										attackerUuid: st.actor.uuid,
										attackerItemUuid: st.item?.uuid ?? null,
										targets: st.cardTargets ?? [],
									},
								},
							}, { content: st.cardHtml ?? "" });
							m.updateSource = u => {
								for (const [k, v] of Object.entries(u)) {
									const segs = k.split(".");
									let cur = m;
									for (let i = 0; i < segs.length - 1; i++) cur = (cur[segs[i]] ||= {});
									cur[segs.at(-1)] = v;
								}
							};
							L.onPreCreateBasicCard(m);
							await L.onCreateChatMessage(m, {}, "u1");
							st._card = m;
							return true;
						}],
						["rollAttacks", async st => (st.rollFn ? st.rollFn(st) : true)],
						["setDamageTags", async st => {
							if (st.item && (st.item.type === "npc_feature" || st.item.is_npc_feature?.()) && st.item.system?.type !== "Weapon") {
								return false; // 模拟系统原生 damage.ts 对非 Weapon npc_feature 的拦截
							}
							st.data = st.data || {};
							st.data.tags = st.data.tags || [];
							st.data.bonus_damage = st.data.bonus_damage || [];
							return true;
						}],
						["showDamageHUD", async st => {
							if (st.item && (st.item.type === "npc_feature" || st.item.is_npc_feature?.()) && st.item.system?.type === "Weapon") {
								const tierIdx = (st.actor?.system?.tier ?? 1) - 1;
								// 模拟系统原生 DamageHudData.fromParams(data.svelte.ts:475)：若二维数组被破坏成普通对象，此处 .map 将抛 TypeError
								st._npcHudDamage = st.item.system.damage[tierIdx].map(d => ({ ...d }));
								return true;
							}
							const prof = st.item?.system?.active_profile;
							st._hudSnapshot = prof ? JSON.parse(JSON.stringify({ damage: prof.damage, bonus: prof.bonus_damage ?? [] })) : null;
							return true;
						}],
						["rollReliable", async () => true],
						["rollNormalDamage", async st => {
							st.data.damage_results = st.data.damage_results || [];
							st.data.targets = st.data.targets || [];
							return true;
						}],
						["rollCritDamage", async st => {
							st.data.crit_damage_results = st.data.crit_damage_results || [];
							st.data.targets = st.data.targets || [];
							return true;
						}],
						["applyStabilizeUpdates", async st => { st.data.description = st.data.description || ""; return true; }],
						["updateItemAfterAction", async () => true],
						["initOverchargeData", async () => true],
						["printOverchargeCard", async () => true],
						["rollStructureTable", async st => {
							const hasLeg = (st.actor?.items ?? []).some(i => ["npcf_legendary_ultra", "npcf_legendary_veteran"].includes(i.system?.lid));
							const isMon = (st.actor?.itemTypes?.npc_feature ?? st.actor?.items ?? []).some(i => i.system?.lid === "npcf_unique_physiology_monstrosity");
							st.data = {
								...(st.data ?? {}),
								roll_str: hasLeg ? "{1d6kl1, 1d6kl1}kh" : "1d6kl1",
								desc: isMon ? "lancer.tables.structureMonstrosity.description.dismember" : "lancer.tables.structure.description.direct.3plus",
								result: { roll: { total: 2 } },
							};
							return true;
						}],
						["structureInsertDismembermentButton", async st => {
							const isMon = (st.actor?.itemTypes?.npc_feature ?? st.actor?.items ?? []).some(i => i.system?.lid === "npcf_unique_physiology_monstrosity");
							if (isMon && st.data?.result?.roll?.total === 2) {
								st.data.embedButtons = [...(st.data.embedButtons ?? []), "dismemberDamage"];
							}
							return true;
						}],
						["structureInsertSecondaryRollButton", async st => {
							const isMon = (st.actor?.itemTypes?.npc_feature ?? st.actor?.items ?? []).some(i => i.system?.lid === "npcf_unique_physiology_monstrosity");
							if (!isMon) {
								st.data.embedButtons = [...(st.data.embedButtons ?? []), "secondaryStructure"];
							}
							return true;
						}],
						["rollOverheatTable", async st => {
							const hasLeg = (st.actor?.items ?? []).some(i => ["npcf_legendary_ultra", "npcf_legendary_veteran"].includes(i.system?.lid));
							st.data = { ...(st.data ?? {}), roll_str: hasLeg ? "{1d6kl1, 1d6kl1}kh" : "1d6kl1" };
							return true;
						}],
						["printStructureCard", async st => {
							const m = mkFlagMsg(`str13_${Math.random()}`, {});
							m.updateSource = u => { for (const [k, v] of Object.entries(u)) if (k === "flags.lancer-cn.tableStatuses") m.flags["lancer-cn"] = { tableStatuses: v }; };
							L.onPreCreateBasicCard(m);
							await L.onCreateChatMessage(m, {}, "u1");
							st._card = m;
							return true;
						}],
						["preOverheatRollChecks", async () => true],
						["printOverheatCard", async st => {
							const m = mkFlagMsg(`ovh13_${Math.random()}`, {});
							m.updateSource = u => { for (const [k, v] of Object.entries(u)) if (k === "flags.lancer-cn.tableStatuses") m.flags["lancer-cn"] = { tableStatuses: v }; };
							L.onPreCreateBasicCard(m);
							await L.onCreateChatMessage(m, {}, "u1");
							st._card = m;
							return true;
						}],
						["initStatRollData", async st => { st.data = st.data || {}; st.data.acc_diff = st.data.acc_diff || { base: { accuracy: 0, difficulty: 0 } }; return true; }],
						["printStatRollCard", async () => true],
					]);
					const v13DmgFlows = [];
					ctx.game.lancer = {
						flows: new Map([
							["DamageRollFlow", class {
								constructor(u, d) { v13DmgFlows.push({ uuid: u, data: d }); }
								async begin() { return true; }
							}],
							["StatRollFlow", class {
								constructor(u, d) { this.uuid = u; this.state = { data: { ...d } }; }
								async begin(d) { this.state.data = { ...d, result: { roll: { total: 8 } } }; return true; }
							}],
						]),
						flowSteps: v13Steps,
					};
					L.patchLancerFlows();

					// =========================================================
					// A. 科技攻击与入侵系统自动化
					// =========================================================
					const goblinHacker = mkCpMech("哥布林骇客", "mf_goblin", {
						save: 15,
						extraItems: [
							{
								id: "horos1", uuid: "Item.horos1", type: "mech_system", name: "H0R_OS 系统升级 I",
								system: {
									lid: "ms_h0r_os_system_upgrade_i",
									actions: [
										{ name: "傀儡系统", activation: "Invade", detail: "目标向你选择的方向移动至最大速度，且陷入暴露。" },
										{ name: "弹出能源核心", activation: "Invade", detail: "你的目标将处于受扰，直到其下一回合结束。在其回合结束时邻接的角色受到 2 能量伤害。" },
									],
								},
							},
							{
								id: "tacnet", uuid: "Item.tacnet", type: "mech_system", name: "战术网络回声",
								system: {
									lid: "ms_ext_tacnet_echo",
									actions: [{ name: "回声注入", activation: "Invade", detail: "你的目标锁定，受损，直到其下一回合结束，目标周围爆发2内的敌方角色必须通过系统豁免否则锁定。" }],
								},
							},
							{
								id: "mobius", uuid: "Item.mobius", type: "mech_system", name: "莫比乌斯锚定",
								system: {
									lid: "ms_ext_mobius_tether",
									actions: [{ name: "锚定", activation: "Invade", detail: "目标固定，直到其用一个快速动作成功通过系统豁免解除。" }],
								},
							},
							{
								id: "osiris", uuid: "Item.osiris", type: "mech_system", name: "欧西里斯级 NHP",
								system: { lid: "ms_osiris_class_nhp", tags: [{ lid: "tg_ai" }] },
							},
							{
								id: "paladin", uuid: "Item.paladin", type: "mech_system", name: "圣武士碎片整理",
								system: { lid: "ms_ext_paladin_defrag" },
							},
							{
								id: "scanner", uuid: "Item.scanner", type: "mech_system", name: "扫描虫群",
								system: { lid: "ms_scanner_swarm" },
							},
							{
								id: "smite", uuid: "Item.smite", type: "mech_system", name: "惩击模块",
								system: {
									lid: "ms_smite_test",
									actions: [{ name: "惩击", activation: "Quick Tech", detail: "进行一次科技攻击：命中时目标受到 2 能量伤害与 2 热度，你受到 1d6 AP 能量伤害。" }],
								},
							},
						],
					});
					for (const it of goblinHacker.items) { it.actor = goblinHacker; it.parent = goblinHacker; if (it.uuid) docMap[it.uuid] = it; }
					const hackerPilot = attachPilot(goblinHacker, {
						talents: [["t_hacker", 3], ["t_iconoclast", 3], ["t_sysop", 2]],
						coreBonuses: ["cb_the_lesson_of_the_open_door"],
					});

					const techVictim = mkCpMech("敌方侦察机", "mf_nelson", { heat: 5 });
					docMap["Scene.s.Token.tv"] = { uuid: "Scene.s.Token.tv", name: "敌方侦察机", actor: techVictim };

					// A1. 多选项入侵隔离：仅应用「弹出能源核心」（受扰 + 2 能量附伤），绝不串入同物品「傀儡系统」的暴露
					const horosState = {
						actor: goblinHacker,
						item: docMap["Item.horos1"],
						data: {
							title: "弹出能源核心",
							invade: true,
							effect: "你的目标将处于受扰，直到其下一回合结束。在其回合结束时邻接的角色受到 2 能量伤害。",
						},
						cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }],
					};
					await v13Steps.get("printTechAttackCard")(horosState);
					const horosInfo = L.analyzeCard(horosState._card);
					ok(techVictim.statuses.has("jammed") && !techVictim.statuses.has("exposed"), "多选项入侵系统精准隔离：选中「弹出能源核心」只挂受扰，不串入同系统另一入侵选项的状态");
					ok(horosInfo.nonAttackDamage === null && horosInfo.techRiders.some(r => r.kind === "extraDmg" && r.damage[0]?.type === "Energy" && r.damage[0]?.val === "2"), "入侵卡不重复生成基础 2 热度按钮，并为额外邻接 2 能量生成独立附加按钮");

					// A2. 战术网络回声：同一句前半段无豁免（锁定+受损）自动挂给主目标，后半段生成系统豁免按钮
					techVictim.statuses.clear();
					const tacState = {
						actor: goblinHacker,
						item: docMap["Item.tacnet"],
						data: { title: "回声注入", invade: true, effect: "你的目标锁定，受损，直到其下一回合结束，目标周围爆发2内的敌方角色必须通过系统豁免否则锁定。" },
						cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }],
					};
					await v13Steps.get("printTechAttackCard")(tacState);
					const tacInfo = L.analyzeCard(tacState._card);
					ok(techVictim.statuses.has("lockon") && techVictim.statuses.has("impaired") && tacInfo.saves.length === 1 && tacInfo.saves[0].key === "sys" && tacInfo.saves[0].failStatuses.includes("lockon"), "战术网络回声：自动对命中目标施加锁定+受损，并为爆发 2 敌人保留系统豁免按钮");

					// A3. 门之训：敌人未能通过我方迫使的豁免时，自动额外承受 +2 热度（1/轮）
					ctx.canvas = {
						...ctx.canvas,
						grid: { size: 100, measurePath: pts => ({ distance: Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) / 100 }) },
						tokens: {
							placeables: [],
							controlled: [{ uuid: "Scene.s.Token.tv", name: "敌方侦察机", actor: techVictim, document: { uuid: "Scene.s.Token.tv" } }],
						},
					};
					await L.executeCardSave(tacState._card, tacInfo.saves[0]);
					ok(techVictim.system.heat.value === 7 && L.getCombatState(goblinHacker).usedOpenDoorSave === true, "核心奖励「门之训」：敌方豁免失败时自动使其承受 +2 热度并标记本轮已触发");

					// A4. 莫比乌斯锚定：剥离恢复性豁免子句，命中自动挂固定且不误生即时豁免按钮
					techVictim.statuses.clear();
					const mobState = {
						actor: goblinHacker,
						item: docMap["Item.mobius"],
						data: { title: "锚定", invade: true, effect: "目标固定，直到其用一个快速动作成功通过系统豁免解除。" },
						cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }],
					};
					await v13Steps.get("printTechAttackCard")(mobState);
					ok(techVictim.statuses.has("immobilized") && L.analyzeCard(mobState._card).saves.length === 0, "莫比乌斯锚定：命中自动施加固定，且后续脱困豁免不误判为即时强迫豁免");

					// A5. 欧西里斯「抛入杜阿特」第 1→2→3→4→1 门完整递进 + 场景结束重置
					for (const [expectGate, expectSt] of [[1, null], [2, "slow"], [3, "stunned"], [4, null]]) {
						techVictim.statuses.clear();
						const osState = {
							actor: goblinHacker,
							item: docMap["Item.osiris"],
							data: { title: "抛入杜阿特", invade: true, effect: "抛入杜阿特" },
							cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }],
						};
						await v13Steps.get("printTechAttackCard")(osState);
						if (expectSt) ok(techVictim.statuses.has(expectSt), `欧西里斯第 ${expectGate} 门命中自动施加 ${expectSt}`);
					}
					ok(L.getCombatState(goblinHacker).osirisGate === 1 && /第四门/.test(chatCreated.at(-1)?.content ?? ""), "欧西里斯第 4 门命中后发出接管提醒卡并循环回第 1 门");
					await L.setCombatState(goblinHacker, { osirisGate: 3 });
					await L.onDeleteCombat({ combatants: [{ actor: goblinHacker }] });
					ok(L.getCombatState(goblinHacker).osirisGate === 3, "场景结束（deleteCombat）保留欧西里斯门阶段进度（3）");
					await L.onFullRepair({ state: { actor: goblinHacker } }, true);
					ok((L.getCombatState(goblinHacker).osirisGate ?? 1) === 1, "全面维修后欧西里斯门阶段重置为第 1 门");

					// A6. 圣武士碎片整理（入侵敌方命中自身获得 3 护盾）+ 非入侵科技攻击伤害与自伤分离 + 骇客 III「王的最后受辞」实时热度转燃烧
					const friendlyMech = mkCpMech("友方重装", "mf_drake", { overshield: 0 });
					docMap["Scene.s.Token.fm"] = { uuid: "Scene.s.Token.fm", name: "友方重装", actor: friendlyMech };
					goblinHacker.system.overshield.value = 0;
					const palState = {
						actor: goblinHacker,
						item: docMap["Item.paladin"],
						data: { title: "碎片整理", invade: true, effect: "破碎讯号" },
						cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }],
					};
					await v13Steps.get("printTechAttackCard")(palState);
					ok(goblinHacker.system.overshield.value === 3, "圣武士碎片整理入侵敌方命中时自动赋予自身 3 点护盾");

					const smiteState = {
						actor: goblinHacker,
						item: docMap["Item.smite"],
						data: { title: "惩击", invade: false, effect: "进行一次科技攻击：命中时目标受到 2 能量伤害与 2 热度，你受到 1d6 AP 能量伤害。" },
						cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }],
					};
					await v13Steps.get("printTechAttackCard")(smiteState);
					const smiteInfo = L.analyzeCard(smiteState._card);
					ok(smiteInfo.nonAttackDamage?.damage?.length === 2 && smiteInfo.techRiders.some(r => r.kind === "selfDmg" && r.formula === "1d6" && r.ap === true), "非入侵科技攻击卡准确提取目标 2 能量 + 2 热度按钮，并将攻击者自伤分离为独立附加按钮");

					techVictim.system.heat.value = 6;
					const hackerR3Item = hackerPilot.itemTypes.talent.find(t => t.system.lid === "t_hacker");
					const kingState = {
						actor: hackerPilot,
						item: hackerR3Item,
						data: { title: "王的最后受辞", invade: false, effect: "王的最后受辞" },
						cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }],
					};
					await v13Steps.get("printTechAttackCard")(kingState);
					const kingInfo = L.analyzeCard(kingState._card);
					v13DmgFlows.length = 0;
					await L.rollNonAttackDamage(kingState._card, kingInfo);
					ok(v13DmgFlows.at(-1)?.data?.damage?.[0]?.type === "Burn" && v13DmgFlows.at(-1)?.data?.damage?.[0]?.val === "6", "骇客 III「王的最后受辞」按目标当前实时热度（6 点）发起燃烧伤害流程");

					// A7. 扫描虫群（邻接 +1 准度）+ 黑冰模块（1→2→3→1 难度）+ 系统管理员 II「防火墙」（强化目标 +1 科技难度）
					const iceDefender = mkCpMech("黑冰卫士", "mf_tortuga", {
						extraItems: [{ id: "bice", type: "mech_system", name: "黑冰模块", system: { lid: "ms_black_ice_module" } }],
					});
					const gobTok = { x: 0, y: 0, actor: goblinHacker, document: { uuid: "Scene.s.Token.gob", disposition: 1 } };
					const iceTok = { x: 100, y: 0, name: "黑冰卫士", actor: iceDefender, document: { uuid: "Scene.s.Token.ice", disposition: -1 } };
					goblinHacker.token = gobTok.document;
					ctx.canvas.tokens.placeables = [gobTok, iceTok];
					ctx.game.user.targets = new Set([iceTok]);
					await L.beginBasicAction(goblinHacker, "bolster"); // 给目标挂上系统管理员防火墙
					ok(L.getCombatState(iceDefender).sysopFirewall === true, "系统管理员 II 执行强化时自动为目标开启防火墙标记");

					const iceDiffs = [];
					for (let k = 0; k < 4; k++) {
						const tad = { target: iceTok, accuracy: 0, difficulty: 0, distance: 1 };
						await v13Steps.get("initTechAttackData")({ actor: goblinHacker, targets: [tad], data: null });
						iceDiffs.push([tad.accuracy, tad.difficulty]);
					}
					ctx.game.user.targets = new Set();
					// 扫描虫群邻接固定 +1 准度；难度 = 防火墙 1 + 黑冰 (1, 2, 3, 1) => 2, 3, 4, 2
					ok(iceDiffs.map(x => `${x[0]}/${x[1]}`).join(",") === "1/2,1/3,1/4,1/2", "扫描虫群邻接科技攻击 +1 准度，黑冰模块按 1→2→3→1 递进叠加难度且与系统管理员防火墙叠加");

					// =========================================================
					// B. 武器与全部武器改装自动化
					// =========================================================
					const arsenalMech = mkCpMech("军火测试机", "mf_raleigh", {
						heat: 5, heatMax: 8,
						weapons: [
							{ id: "w_fuel", lid: "mw_fuel_rod_gun", size: "Main", profiles: [{ name: "燃料棒枪", type: "CQB", range: [{ type: "Range", val: 3 }], damage: [{ type: "Energy", val: "1d6+2" }] }] },
							{ id: "w_shatter", lid: "mw_shatterhead_colony_missiles", size: "Heavy", profiles: [{ name: "碎头集群导弹", type: "Launcher", range: [{ type: "Range", val: 15 }], damage: [{ type: "Explosive", val: "2d6" }] }] },
							{ id: "w_mimic", lid: "mw_mimic_gun", size: "Heavy", profiles: [{ name: "拟态枪", type: "Nexus", range: [{ type: "Range", val: 1 }], damage: [{ type: "Kinetic", val: "1" }] }] },
							{ id: "w_baton", lid: "mw_kkca_tiger_claw_baton", size: "Auxiliary", profiles: [{ name: "虎爪警杖", type: "Melee", range: [{ type: "Threat", val: 1 }], damage: [{ type: "Kinetic", val: "1d3+1" }] }] },
							{ id: "w_vsword", lid: "mw_variable_sword", size: "Main", profiles: [{ name: "变频剑", type: "Melee", range: [{ type: "Threat", val: 1 }], damage: [{ type: "Kinetic", val: "1d6+1" }] }] },
							{ id: "w_drill", lid: "mw_combat_drill", size: "Superheavy", profiles: [{ name: "作战用钻机", type: "Melee", range: [{ type: "Threat", val: 1 }], damage: [{ type: "Kinetic", val: "3d6" }, { type: "Energy", val: "1d6" }] }] },
							{ id: "w_apoth", lid: "mw_piof_apothecary_rifle", size: "Main", profiles: [{ name: "药剂师步枪", type: "Rifle", range: [{ type: "Range", val: 10 }], damage: [{ type: "Kinetic", val: "1d6" }] }] },
							{
								id: "w_kdriver", lid: "mw_pl_kinetic_driver", size: "Superheavy", profile: 1,
								profiles: [
									{ name: "折叠场", type: "Cannon", range: [{ type: "Range", val: 20 }], damage: [{ type: "Kinetic", val: "2d6" }] },
									{ name: "线性场", type: "Cannon", range: [{ type: "Range", val: 20 }], damage: [{ type: "Kinetic", val: "3d6" }] },
								],
							},
							{ id: "w_comet", lid: "mw_ext_comet_swarm", size: "Main", profiles: [{ name: "彗星虫群", type: "Nexus", range: [{ type: "Range", val: 10 }], damage: [{ type: "Energy", val: "1d6" }] }] },
						],
					});
					const wByLid = lid => arsenalMech.items.find(i => i.system?.lid === lid);

					// B1. 燃料棒枪开火自动散热 4 点（5 → 1）
					await v13Steps.get("printAttackCard")({ actor: arsenalMech, item: wByLid("mw_fuel_rod_gun"), cardTargets: [{ uuid: "Scene.s.Token.tv", hit: true, crit: false }] });
					ok(arsenalMech.system.heat.value === 1, "燃料棒枪发起攻击时自动清除 4 点热度（5 → 1）");

					// B2. 碎头集群导弹：即使处于受损、交战、掩护与不精准，掷骰时难度强制清零且不改坏受损标记
					arsenalMech.system.statuses.impaired = true;
					let sawImpairedDuringShatter = null;
					const shatterTad = { accuracy: 0, difficulty: 3, cover: 2 };
					await v13Steps.get("rollAttacks")({
						actor: arsenalMech,
						item: wByLid("mw_shatterhead_colony_missiles"),
						data: { attack_type: "Ranged", acc_diff: { base: { accuracy: 0, difficulty: 2 }, weapon: { inaccurate: true, engaged: true }, targets: [shatterTad] } },
						rollFn: st => { sawImpairedDuringShatter = st.actor.system.statuses.impaired; return true; },
					});
					ok(sawImpairedDuringShatter === false && arsenalMech.system.statuses.impaired === true && shatterTad.difficulty === 0 && shatterTad.cover === 0, "碎头集群导弹攻击时清零一切难度与掩护并临时屏蔽受损惩罚");
					arsenalMech.system.statuses.impaired = false;

					// B3. 拟态枪 3d20 校准、基础伤害 = 1 + ceil(X/2) 预览无损还原，以及回合开始自动轮换 [X,Y,Z]→[Y,Z,X]
					rollQueue = [9, 14, 3];
					ctx.Roll = class {
						constructor(f) { this.formula = f; }
						async evaluate() {
							const q = rollQueue.shift();
							this.total = q ?? (/^\d+$/.test(String(this.formula).trim()) ? Number(this.formula) : 4);
							this.terms = [{ results: [{ result: this.total }] }];
							return this;
						}
						async getTooltip() { return ""; }
					};
					await L.rollMimicGunValues(arsenalMech);
					ok(L.getCombatState(arsenalMech).mimicValues.join(",") === "9,14,3", "拟态枪校准记录 3d20 序列 [9, 14, 3]");
					const mimicState = { actor: arsenalMech, item: wByLid("mw_mimic_gun"), data: {} };
					await v13Steps.get("showDamageHUD")(mimicState);
					ok(mimicState._hudSnapshot.damage[0].val === "6" && wByLid("mw_mimic_gun").system.active_profile.damage[0].val === "1", "拟态枪伤害面板预览自动换算为 1+ceil(9/2)=6 动能并在退出后无损恢复原物品数据");
					const mimicCombat = {
						round: 2,
						previous: { combatantId: "cm0" },
						current: { combatantId: "cm1" },
						combatants: [
							{ id: "cm0", name: "前序", actor: techVictim, token: { uuid: "Scene.s.Token.tv" } },
							{ id: "cm1", name: "军火测试机", actor: arsenalMech, token: { uuid: arsenalMech.uuid } },
						],
					};
					mimicCombat.combatants.get = id => mimicCombat.combatants.find(c => c.id === id);
					await L.onUpdateCombatTurnEnd(mimicCombat, { turn: 1 }, { direction: 1 });
					ok(L.getCombatState(arsenalMech).mimicValues.join(",") === "14,3,9", "拟态枪在后续轮次回合开始时自动循环序列 [9,14,3] → [14,3,9]");

					// B4. 虎爪警杖对伏卧目标未命中转命中 + 变频剑会心 +1d6 + 作战用钻机对固定目标杀绝连锁
					const proneEnemy = mkCpMech("伏卧靶", "mf_nelson", { statuses: ["prone", "immobilized", "impaired"], armor: 3 });
					docMap["Scene.s.Token.pe"] = { uuid: "Scene.s.Token.pe", name: "伏卧靶", actor: proneEnemy };
					const batonHr = { target: { actor: proneEnemy, document: { uuid: "Scene.s.Token.pe" } }, total: 5, hit: false, crit: false };
					await v13Steps.get("rollAttacks")({
						actor: arsenalMech,
						item: wByLid("mw_kkca_tiger_claw_baton"),
						data: { attack_type: "Melee", hit_results: [batonHr], has_normal_hit: false },
					});
					ok(batonHr.hit === true, "虎爪警杖攻击伏卧/固定/晕眩目标未命中时自动改为普通命中");

					rollQueue = [5];
					const vsCritState = {
						actor: arsenalMech,
						item: wByLid("mw_variable_sword"),
						data: {
							has_crit_hit: true,
							crit_damage_results: [{ d_type: "Kinetic", roll: { formula: "1d6+1", total: 5 } }],
							damage_hud_data: { targets: [{ targetUuid: "Scene.s.Token.pe" }] },
							targets: [{ target: "Scene.s.Token.pe", hit: true, crit: true, damage: [{ type: "Kinetic", amount: 5 }] }],
						},
					};
					await v13Steps.get("rollCritDamage")(vsCritState);
					ok(vsCritState.data.targets[0].damage.reduce((s, d) => s + d.amount, 0) === 10, "变频剑会心一击自动追加 +1d6 额外伤害（5 + 5 = 10）");

					// 作战用钻机：首次含 1 个 1 点 → 连锁加掷 1d6（掷出 4，不再出 1），总计 +4 伤害并将额外骰写回 damage_results 供系统统计杀绝热度
					rollQueue = [4];
					const drillState = {
						actor: arsenalMech,
						item: wByLid("mw_combat_drill"),
						data: {
							overkill: true,
							hit_results: [{ target: { actor: proneEnemy, document: { uuid: "Scene.s.Token.pe" } }, hit: true, crit: false }],
							damage_results: [{ d_type: "Kinetic", roll: { formula: "3d6", terms: [{ faces: 6, results: [{ result: 1 }, { result: 5 }, { result: 6 }] }] } }],
							targets: [{ target: "Scene.s.Token.pe", hit: true, crit: false, damage: [{ type: "Kinetic", amount: 12 }] }],
						},
					};
					await v13Steps.get("rollNormalDamage")(drillState);
					ok(drillState.data.targets[0].damage.reduce((s, d) => s + d.amount, 0) === 16 && drillState.data.damage_results.length === 2, "作战用钻机攻击固定/伏卧目标掷出 1 时触发杀绝连锁额外 +1d6 伤害");

					// B5. 药剂师步枪（按目标状况数加伤）、运动驱动器线性场（按目标护甲每点 +1d6 最高 3d6）、彗星虫群（0→+1→+2→+3→0 层数循环）
					const apothState = {
						actor: arsenalMech,
						item: wByLid("mw_piof_apothecary_rifle"),
						data: { hit_results: [{ target: { actor: proneEnemy }, hit: true, crit: false }], bonus_damage: [] },
					};
					await v13Steps.get("setDamageTags")(apothState);
					// proneEnemy 有 immobilized 与 impaired 两种状况（prone 是状态不是 CONDITION_IDS） => +2
					ok(apothState.data.bonus_damage.some(b => b.val === "2"), "药剂师步枪按目标当前状况数量（固定+受损=2）自动注入 +2 额外伤害");

					const kdState = {
						actor: arsenalMech,
						item: wByLid("mw_pl_kinetic_driver"),
						data: { hit_results: [{ target: { actor: proneEnemy }, hit: true, crit: false }], bonus_damage: [] },
					};
					await v13Steps.get("setDamageTags")(kdState);
					ok(kdState.data.bonus_damage.some(b => b.type === "Kinetic" && b.val === "3d6"), "运动驱动器（线性场）按目标护甲值（3 点护甲）自动注入 +3d6 动能额外伤害");

					const cometBonuses = [];
					for (let step = 0; step < 5; step++) {
						const cmCardState = {
							actor: arsenalMech,
							item: wByLid("mw_ext_comet_swarm"),
							cardTargets: [{ uuid: "Scene.s.Token.pe", hit: true, crit: false }],
						};
						await v13Steps.get("printAttackCard")(cmCardState);
						const modOnCard = cmCardState._card.getFlag("lancer-cn", "cpDamageMod");
						cometBonuses.push(Number(modOnCard?.cometSwarmBonus) || 0);
					}
					ok(cometBonuses.join(",") === "0,1,2,3,0", "彗星虫群连续命中层数严格按 0 → +1 → +2 → +3 → 0 循环");

					// B6. 武器改装：超因果改装（无视减免）、自适应配重（副1/主2/重3 可靠同步 HUD）、电击花环等攻击卡附加按钮
					const moddedHeavy = {
						id: "w_mod_h", uuid: "Item.w_mod_h", type: "mech_weapon", name: "配重重炮",
						system: {
							lid: "mw_heavy_machine_gun", size: "Heavy",
							mod: { value: { name: "自适应配重", system: { lid: "wm_ch_adaptive_weight" } } },
							active_profile: { type: "Cannon", damage: [{ type: "Kinetic", val: "2d6+4" }] },
						},
					};
					const relModState = {
						actor: arsenalMech,
						item: moddedHeavy,
						data: { tags: [], damage_hud_data: { weapon: { reliable: false, reliableValue: 0 }, targets: [] } },
					};
					await v13Steps.get("setDamageTags")(relModState);
					await v13Steps.get("rollReliable")(relModState);
					ok(relModState.data.reliable === true && relModState.data.reliable_val === 3 && relModState.data.damage_hud_data.weapon.reliableValue === 3, "自适应配重为重型武器自动赋予可靠 3 并同步至伤害面板 HUD");

					const paraWpn = {
						id: "w_para", uuid: "Item.w_para", type: "mech_weapon", name: "超因果步枪",
						system: {
							lid: "mw_assault_rifle", size: "Main",
							mod: { value: { name: "超因果改装", system: { lid: "wm_paracausal_mod" } } },
							active_profile: { type: "Rifle", damage: [{ type: "Kinetic", val: "1d6" }] },
						},
					};
					const paraState = { actor: arsenalMech, item: paraWpn, data: { tags: [], damage_hud_data: { base: {}, targets: [{}] }, targets: [{}] } };
					await v13Steps.get("setDamageTags")(paraState);
					ok(paraState.data.paracausal === true && paraState.data.damage_hud_data.base.paracausal === true && paraState.data.targets[0].paracausal === true, "超因果改装自动为伤害流程开启无视减免（paracausal）");

					const wreathWpn = {
						id: "w_wreath", uuid: "Item.w_wreath", type: "mech_weapon", name: "电击战刀",
						system: {
							lid: "mw_tactical_melee_weapon", size: "Main",
							mod: { value: { name: "电击花环", system: { lid: "wm_shock_wreath" } } },
							active_profile: { type: "Melee", damage: [{ type: "Kinetic", val: "1d6+2" }] },
						},
					};
					docMap[wreathWpn.uuid] = wreathWpn;
					const wreathCardState = { actor: arsenalMech, item: wreathWpn, cardTargets: [{ uuid: "Scene.s.Token.pe", hit: true, crit: false }] };
					await v13Steps.get("printAttackCard")(wreathCardState);
					const wreathInfo = L.analyzeCard(wreathCardState._card);
					ok(wreathInfo.weaponRiders.some(r => r.kind === "shockWreath"), "装备电击花环的近战武器命中后在攻击卡生成「电击花环」一键触发按钮");

					// =========================================================
					// C. 驾驶员全天赋自动化
					// =========================================================
					const aceMech = mkCpMech("全能王牌机", "mf_nelson", {
						save: 14, heat: 4, heatMax: 6, statuses: ["dangerzone"],
						weapons: [
							{ id: "w_ar", lid: "mw_assault_rifle", size: "Main", profiles: [{ name: "突击步枪", type: "Rifle", range: [{ type: "Range", val: 10 }], damage: [{ type: "Kinetic", val: "1d6" }] }] },
							{ id: "w_pist", lid: "mw_pistol", size: "Auxiliary", profiles: [{ name: "手枪", type: "CQB", range: [{ type: "Range", val: 5 }], damage: [{ type: "Kinetic", val: "1d3" }] }] },
							{ id: "w_blade", lid: "mw_charged_blade", size: "Main", profiles: [{ name: "充能刃", type: "Melee", range: [{ type: "Threat", val: 1 }], damage: [{ type: "Energy", val: "1d6+3" }] }] },
							{ id: "w_rpg", lid: "mw_rpg", size: "Main", profiles: [{ name: "火箭筒", type: "Launcher", range: [{ type: "Range", val: 10 }], damage: [{ type: "Explosive", val: "1d6+1" }] }] },
						],
						extraItems: [
							{ id: "nhp1", type: "mech_system", name: "雅典娜级 NHP", system: { lid: "ms_athena_class_nhp", tags: [{ lid: "tg_ai" }] } },
							{ id: "nhp2", type: "mech_system", name: "特拉洛克级 NHP", system: { lid: "ms_tlaloc_class_nhp", tags: [{ lid: "tg_ai" }] } },
						],
					});
					const acePilot = attachPilot(aceMech, {
						talents: [
							["t_brutal", 3], ["t_crack_shot", 3], ["t_duelist", 3], ["t_gunslinger", 3],
							["t_brawler", 3], ["t_nuclear_cavalier", 2], ["t_vanguard", 2], ["t_combined_arms", 3],
							["t_stormbringer", 3], ["t_walking_armory", 3], ["t_skirmisher", 2], ["t_infiltrator", 2],
							["t_black_thumb", 2], ["t_grease_monkey", 2], ["t_ext_junker", 1], ["mf_orator", 3],
							["t_field_analyst", 2], ["t_iconoclast", 3], ["t_bonded", 1], ["t_house_guard", 1],
							["t_ext_giant_slayer", 3],
						],
						coreBonuses: [
							"cb_auto_stabilizing_hardpoints", "cb_overpower_caliber",
							"cb_kkca_oath_of_excellence", "cb_gyges_frame",
							"cb_armory_sculpted_chassis",
						],
					});
					const aceW = lid => aceMech.items.find(i => i.system?.lid === lid);

					// C1. combatMechOf 解析：驾驶员身份发出的天赋卡自动路由到激活机甲
					ok(L.combatMechOf(acePilot) === aceMech && L.BASIC_ACTIONS.improvised.damage(aceMech)[0].val === "2d6+2", "combatMechOf 将驾驶员精准映射至激活机甲，且拳师 II 将权宜攻击伤害提升至 2d6+2");

					// C2. 残酷 I（天然 20 会心满伤）与残酷 III（未命中涨骰 + 命中归零）
					const brutalCritState = {
						actor: aceMech,
						item: aceW("mw_charged_blade"),
						data: {
							has_crit_hit: true,
							_lancerCnForceNat20: true,
							crit_damage_results: [
								{ d_type: "Energy", roll: { formula: "1d6+3" }, bonus: false },
								{ d_type: "Energy", roll: { formula: "2d6" }, bonus: true },
							],
							damage_hud_data: { targets: [{ targetUuid: "Scene.s.Token.pe" }] },
							targets: [{ target: "Scene.s.Token.pe", hit: true, crit: true, half_damage: false, damage: [] }],
						},
					};
					await v13Steps.get("rollCritDamage")(brutalCritState);
					ok(brutalCritState.data.targets[0].damage.reduce((s, d) => s + d.amount, 0) === 21, "残酷 I：天然 d20=20 会心一击时将全部基础与额外伤害直接取骰面最大值（9 + 12 = 21）");

					await v13Steps.get("printAttackCard")({ actor: aceMech, item: aceW("mw_assault_rifle"), cardTargets: [{ uuid: "Scene.s.Token.pe", hit: false, crit: false }] });
					await v13Steps.get("printAttackCard")({ actor: aceMech, item: aceW("mw_assault_rifle"), cardTargets: [{ uuid: "Scene.s.Token.pe", hit: false, crit: false }] });
					ok(L.getTalentDie(aceMech, "brutal") === 2, "残酷 III：连续两次攻击未命中后不懈骰累加至 +2");
					await v13Steps.get("printAttackCard")({ actor: aceMech, item: aceW("mw_assault_rifle"), cardTargets: [{ uuid: "Scene.s.Token.pe", hit: true, crit: false }] });
					ok(L.getTalentDie(aceMech, "brutal") === 0, "残酷 III：一旦攻击命中，不懈骰立即重置为 0");

					// C3. 核骑兵 I/II + 自走兵器库「地狱火弹」+ R3 会心免耗 + 超功率口径 +1d6
					await L.setCombatState(aceMech, { usedNuCavBonus: false, usedOverpowerCaliber: false, usedWalkingArmoryTurn: false });
					await L.setTalentConfig(aceMech, { walkingArmoryAmmo: "hellfire", overpowerWeaponId: "w_ar", autoStabWeaponId: "w_ar" });
					const arAtkState = { actor: aceMech, item: aceW("mw_assault_rifle"), data: {} };
					await v13Steps.get("initAttackData")(arAtkState);
					const arCardState = { actor: aceMech, item: aceW("mw_assault_rifle"), cardTargets: [{ uuid: "Scene.s.Token.pe", hit: true, crit: true }] };
					await v13Steps.get("printAttackCard")(arCardState);
					ok(arCardState._card.getFlag("lancer-cn", "walkingArmoryAmmo") === "hellfire", "自走兵器库 III：会心一击时保留地狱火弹效果且不标记本回合耗尽");

					const arDmgState = {
						actor: aceMech,
						item: aceW("mw_assault_rifle"),
						data: {
							lancerCnDamageMod: arCardState._card.getFlag("lancer-cn", "cpDamageMod"),
							damage: [{ type: "Kinetic", val: "1d6" }],
							bonus_damage: [],
							tags: [],
							damage_hud_data: { weapon: { damage: [{ type: "Kinetic", val: "1d6" }], bonusDamage: [] }, base: { bonusDamage: [] }, targets: [] },
						},
					};
					aceMech.system.heat.value = 3; // 仍带 dangerzone 状态用于核骑兵检测
					aceMech.statuses.add("dangerzone");
					await L.setCombatState(aceMech, { usedNuCavBonus: false, usedOverpowerCaliber: false });
					await v13Steps.get("setDamageTags")(arDmgState);
					await v13Steps.get("rollReliable")(arDmgState);
					ok(
						arDmgState.data.damage[0].type === "Energy"
						&& arDmgState.data.bonus_damage.some(b => b.type === "Heat" && b.val === "2")
						&& arDmgState.data.bonus_damage.filter(b => b.type === "Burn" && b.val === "1d6").length === 2,
						"核子游侠 + 超功率口径 + 地狱火弹联动：主武器转为能量伤害，核子游侠对目标施加 +2 热度（非伤害不转燃烧），且核子游侠(+1d6)与超功率口径(+1d6)额外伤害全部转化为燃烧！",
					);
					await L.setTalentConfig(aceMech, { walkingArmoryAmmo: "" });

					// C4. 枪侠 III「我用心杀戮」（快枪手骰=1 时无视掩护 + 2d6 穿甲，命中后重置为 6）+ 先锋 I/II（射程 3 内 CQB +1 准度且无视掩护）
					await L.setTalentDie(aceMech, "gunslinger", 1);
					await L.setCombatState(aceMech, { usedFirstAuxRanged: false });
					const aceTok = { x: 0, y: 0, actor: aceMech, document: { uuid: "Scene.s.Token.ace", disposition: 1 } };
					const nearTok = { x: 200, y: 0, actor: proneEnemy, document: { uuid: "Scene.s.Token.pe", disposition: -1 } };
					aceMech.token = aceTok.document;
					ctx.canvas.tokens.placeables = [aceTok, nearTok];
					const pistTad = { target: nearTok, accuracy: 0, difficulty: 0, cover: 2, distance: 2 };
					const pistAtkState = { actor: aceMech, item: aceW("mw_pistol"), targets: [pistTad], data: null };
					await v13Steps.get("initAttackData")(pistAtkState);
					// 枪侠 I (+1 base) + 先锋 I (射程 2 <= 3，+1 tad.accuracy) 且 cover 归 0
					ok(pistAtkState.data.acc_diff.base.accuracy >= 1 && pistTad.accuracy === 1 && pistTad.cover === 0, "枪侠 I/III + 先锋 I/II：射程 3 内副手 CQB 获得双重准度并无视掩护");
					const pistCardState = { actor: aceMech, item: aceW("mw_pistol"), cardTargets: [{ uuid: "Scene.s.Token.pe", hit: true, crit: false }] };
					await v13Steps.get("printAttackCard")(pistCardState);
					const pistMod = pistCardState._card.getFlag("lancer-cn", "cpDamageMod");
					ok(L.getTalentDie(aceMech, "gunslinger") === 6 && pistMod?.ap === true && pistMod?.gunslingerBonus2d6 === true, "枪侠 III「我用心杀戮」命中后附加 +2d6 穿甲标记并将快枪手骰重置为 6");

					// C5. 风暴使者 I：消耗锁定的发射器命中自动挂伏卧（1/轮）
					proneEnemy.statuses.delete("prone");
					await L.setCombatState(aceMech, { usedStormbringerR1: false });
					await v13Steps.get("printAttackCard")({
						actor: aceMech,
						item: aceW("mw_rpg"),
						cardTargets: [{ uuid: "Scene.s.Token.pe", hit: true, crit: false, setConditions: { lockon: false } }],
					});
					ok(proneEnemy.statuses.has("prone") && L.getCombatState(aceMech).usedStormbringerR1 === true, "风暴使者 I：消耗锁定的发射器命中时自动击倒目标伏卧");

					// C6. 机油佬 II + 垃圾佬 I 稳住阵脚清燃烧与全部状况 + 黑拇指 II 动作
					aceMech.system.burn = 4;
					aceMech.statuses.add("impaired");
					aceMech.statuses.add("jammed");
					aceMech.statuses.add("slow");
					await v13Steps.get("applyStabilizeUpdates")({ actor: aceMech, data: { option1: "Cool", option2: "Reload" } });
					ok(aceMech.system.burn === 0 && !aceMech.statuses.has("impaired") && !aceMech.statuses.has("jammed") && !aceMech.statuses.has("slow"), "垃圾佬 I + 机油佬 II：稳住阵脚自动清零燃烧并一并清除受损/受扰/缓慢状况");

					aceMech.system.overshield.value = 0;
					aceMech.system.burn = 2;
					aceMech.statuses.add("slow");
					docMap["Scene.s.Token.ace"] = { uuid: "Scene.s.Token.ace", name: "全能王牌机", actor: aceMech };
					const btItem = acePilot.itemTypes.talent.find(t => t.system.lid === "t_black_thumb");
					const btRepairMsg = mkFlagMsg("bt_rig1", { lancer: { actionData: { actor: acePilot.uuid, action: { name: "黑拇指：战场修复" } } } }, {
						content: `<div class="card" data-uuid="${btItem.uuid}"><div class="lancer-header">黑拇指：战场修复</div><div class="effect-text">你的机甲获得2护盾，并清除缓慢或固定中的一种状态。</div></div>`,
					});
					await L.onCreateChatMessage(btRepairMsg, {}, "u1");
					const btSnuffMsg = mkFlagMsg("bt_rig2", { lancer: { actionData: { actor: acePilot.uuid, action: { name: "黑拇指：扑灭" } } } }, {
						content: `<div class="card" data-uuid="${btItem.uuid}"><div class="lancer-header">黑拇指：扑灭</div><div class="effect-text">立即清除机甲承受的全部燃烧，并使其获得对燃烧的抗性。</div></div>`,
					});
					await L.onCreateChatMessage(btSnuffMsg, {}, "u1");
					ok(aceMech.system.overshield.value === 2 && !aceMech.statuses.has("slow") && aceMech.system.burn === 0 && aceMech.statuses.has("resistance_burn"), "黑拇指 II「战场修复 / 扑灭」自动为所属机甲赋予 +2 护盾、清除缓慢、清零燃烧并开启燃烧抗性");

					// C7. 演说家 II 与战场分析师 II 回合末未攻击涨骰 + 优越情报反应按钮 + 偶像破坏者模因火花与超然
					await L.setTalentDie(aceMech, "orator", 1);
					await L.setTalentDie(aceMech, "analyst", 1);
					await L.setCombatState(aceMech, { attackedOrForcedSaveThisTurn: false });
					const pacifistCombat = {
						round: 2,
						previous: { combatantId: "cp1" },
						current: { combatantId: "cp2" },
						combatants: [
							{ id: "cp1", name: "全能王牌机", actor: aceMech, token: { uuid: aceTok.document.uuid } },
							{ id: "cp2", name: "敌方侦察机", actor: techVictim, token: { uuid: "Scene.s.Token.tv" } },
						],
					};
					pacifistCombat.combatants.get = id => pacifistCombat.combatants.find(c => c.id === id);
					await L.onUpdateCombatTurnEnd(pacifistCombat, { turn: 1 }, { direction: 1 });
					ok(L.getTalentDie(aceMech, "orator") === 2 && L.getTalentDie(aceMech, "analyst") === 3, "演说家 II（+1）与战场分析师 II（+2）在本回合未攻击且未迫使豁免时自动涨骰");

					const allyAtkMsg = mkFlagMsg("fa_test", {
						lancer: { attackData: { attackerUuid: friendlyMech.uuid, targets: [{ uuid: "Scene.s.Token.pe", total: 9, hit: false, crit: false }] } },
					});
					await L.executeFieldAnalystReaction(allyAtkMsg, L.analyzeCard(allyAtkMsg), "add");
					ok(L.getTalentDie(aceMech, "analyst") === 1 && /新结果 <b>12<\/b>/.test(chatCreated.at(-1)?.content ?? ""), "战场分析师「优越情报」反应将攻击检定结果 +3（9 → 12）并将情报骰重置为 1");

					// 偶像破坏者：机甲上有 2 个 AI 系统 + 自身不稳定 NHP => countMechNHPs = 3 => 模因火花基础 = 1 + 3 = 4 穿甲能量
					const iconItem = acePilot.itemTypes.talent.find(t => t.system.lid === "t_iconoclast");
					const sparkMsg = mkFlagMsg("spark1", {}, {
						content: `<div class="card" data-uuid="${iconItem.uuid}"><div class="lancer-header">模因火花</div><div class="effect-text">对邻接敌人造成穿甲能量伤害。</div></div>`,
					});
					const sparkInfo = L.analyzeCard(sparkMsg);
					ok(sparkInfo.nonAttackDamage?.damage?.[0]?.val === "4" && sparkInfo.nonAttackDamage?.ap === true, "偶像破坏者 I「模因火花」按机甲搭载 NHP 总数（1+3=4）自动计算穿甲能量伤害");

					// C8. 羁绊 I + 家族禁卫 I（单向扩展拥有者对盟友生效的邻接至 2 格）+ 盖革斯骨架机体 +1 准度
					attachPilot(friendlyMech, { talents: [["t_bonded", 1]] });
					const friendlyTok = { x: 200, y: 0, actor: friendlyMech, document: { uuid: "Scene.s.Token.fm", disposition: 1 } };
					friendlyMech.token = friendlyTok.document;
					ctx.canvas.tokens.placeables = [aceTok, friendlyTok];
					const fmHullAt2 = { actor: friendlyMech, data: { path: "system.hull" } };
					await v13Steps.get("initStatRollData")(fmHullAt2);
					const aceHullAt2 = { actor: aceMech, data: { path: "system.hull" } };
					await v13Steps.get("initStatRollData")(aceHullAt2);
					// 距离 2 时：aceMech 具备家族禁卫 I，仅单向将其对盟友 friendlyMech 的同袍 I 扩展至 2 格（friendlyMech 获 +1 准度；aceMech 仅获盖革斯骨架 +1）
					ok(fmHullAt2.data.acc_diff.base.accuracy === 1 && aceHullAt2.data.acc_diff.base.accuracy === 1, "家族禁卫 I 单向扩展：距离 2 时仅拥有家族禁卫者（aceMech）对盟友提供同袍 +1 准度，不会把无家族禁卫盟友的同袍反向扩到 2 格");
					friendlyTok.x = 100; // 邻接 1 格：双方同袍叠加 +2，叠加盖革斯骨架 +1 = +3 准度
					const hullStatState = { actor: aceMech, data: { path: "system.hull" } };
					await v13Steps.get("initStatRollData")(hullStatState);
					ok(hullStatState.data.acc_diff.base.accuracy === 3, "邻接 1 格时双方羁绊 I（+2）与盖革斯骨架（+1）叠加使机体豁免/检定预填 +3 准度");

					// C9. 巨人杀手骑乘强化（R1 软掩护与结束清理 + R2 瓦解 + R3 实际扣血后终斩）+ 机甲表「天赋与核心战术栏」渲染与操作
					acePilot.system.active_mech.value = null; // 模拟步战下马骑乘
					proneEnemy.statuses.clear();
					proneEnemy.system.hp.value = 6;
					const gsJockeyMsg = await L.createJockeyControlCard({
						pilotUuid: acePilot.uuid, pilotName: acePilot.name,
						mechUuid: "Scene.s.Token.pe", mechName: "伏卧靶",
					});
					await L.executeJockeyEffect(gsJockeyMsg, "distract");
					ok(acePilot.statuses.has("cover_soft") && proneEnemy.statuses.has("impaired") && proneEnemy.statuses.has("slow") && /巨人杀手 · 激怒/.test(chatCreated.at(-1)?.content ?? ""), "巨人杀手 R1：骑乘生效自动赋予驾驶员软掩护，干扰施加受损+缓慢并提示推动 2 格");
					v13DmgFlows.length = 0;
					await L.executeJockeyEffect(gsJockeyMsg, "damage");
					ok(v13DmgFlows.at(-1)?.data?.lancerCnJockeyFinisher === true && proneEnemy.system.hp.value === 6, "巨人杀手 R3：掷伤害卡阶段仅透传终斩标记，不提前在未扣血前误判旧 HP");
					proneEnemy.system.hp.value = 2; // 模拟原生 damageCalc 扣减 4 点伤害后剩余 2 HP
					await ctx.CONFIG.Actor.documentClass.prototype.damageCalc.call(proneEnemy, { Kinetic: 4, Energy: 0, Explosive: 0, Burn: 0, Heat: 0, Variable: 0 }, { multiple: 1, addBurn: true, ap: false, paracausal: false, dmgCtx: { jockeyGiantSlayerFinisher: true } });
					ok(proneEnemy.system.hp.value === 0, "巨人杀手 R3「终斩」：骑乘破坏实际扣血后剩余 HP 降至 1–3 时直接斩杀至 0 HP");
					await L.endJockey(gsJockeyMsg, "测试结束");
					ok(!acePilot.statuses.has("cover_soft"), "巨人杀手 R1：结束骑乘时自动移除骑乘赋予驾驶员的软掩护");
					acePilot.system.active_mech.value = aceMech;

					const talentBarHtml = L.renderTalentControlHTML(aceMech);
					ok(/lancer-cn-talent-bar/.test(talentBarHtml) && /不懈骰/.test(talentBarHtml) && /演说家骰/.test(talentBarHtml) && /walkingArmoryAmmo/.test(talentBarHtml), "机甲表为拥有天赋与核心奖励的机甲生成「天赋与核心战术栏」");
					ok(L.renderTalentControlHTML(pegasus) === "", "无天赋与战斗核心奖励的白板机甲不渲染空的天赋战术栏");
					await L.executeTalentSheetAction(aceMech, "oratorSpend:1:激励");
					ok(L.getTalentDie(aceMech, "orator") === 1 && /激励/.test(chatCreated.at(-1)?.content ?? ""), "机甲表点击演说家「激励」按钮自动扣除 1 枚演说家骰并发出检定加成提示卡");

					// =========================================================
					// D. 常用战斗核心奖励自动化
					// =========================================================
					const cbTank = mkCpMech("核心奖励重装机", "mf_drake", {
						armor: 2, hp: 14, hpMax: 20, overshield: 0, heat: 5, heatMax: 8,
						structure: 1, structureMax: 4, stress: 2, stressMax: 4,
					});
					cbTank.system.repairs = { value: 4, max: 5 };
					attachPilot(cbTank, {
						coreBonuses: [
							"cb_superior_by_design", "cb_piof_slow_cycle_shroud",
							"cb_briareos_frame", "cb_stasis_shielding",
							"cb_the_lesson_of_transubstantiation", "cb_universal_compatibility",
							"cb_kkca_tournament_hardening", "cb_adaptive_reactor",
							"cb_kkca_oath_of_excellence", "cb_armory_sculpted_chassis",
						],
					});

					// D1. 天生优越：免疫受损（setActorStatus 拦截）
					const impTry = await L.setActorStatus(cbTank.uuid, "impaired", true);
					ok(impTry.immune === true && !cbTank.statuses.has("impaired"), "核心奖励「天生优越」：自动免疫并拦截受损状况");

					// D2. 低速循环屏蔽罩：稳住阵脚自动补至 4 护盾；有护盾期间免疫离散且令穿甲攻击失去穿甲！
					await v13Steps.get("applyStabilizeUpdates")({ actor: cbTank, data: { option1: "Cool", option2: "Reload" } });
					ok(cbTank.system.overshield.value === 4, "核心奖励「低速循环屏蔽罩」：稳住阵脚自动获得 4 点护盾");
					const shredTry = await L.setActorStatus(cbTank.uuid, "shredded", true);
					ok(shredTry.immune === true && !cbTank.statuses.has("shredded"), "核心奖励「低速循环屏蔽罩」：拥有护盾期间免疫离散");

					// D3. 百臂巨人骨架（1 结构时非热度全抗性）+ 低速循环屏蔽罩防穿甲结算预览验证：
					// 10 点穿甲动能 → 低速屏蔽罩剥离穿甲 → 扣 2 护甲剩 8 → 百臂巨人 1 结构减半剩 4 → 刚好扣完 4 护盾，HP 损失 0！
					const cbPrev = L.previewDamageCalc(cbTank, [{ type: "Kinetic", amount: 10 }], { ap: true });
					ok(cbPrev.overshieldUsed === 4 && cbPrev.hpLoss === 0 && cbPrev.notes.some(n => /低速屏蔽罩/.test(n)) && cbPrev.notes.some(n => /布里阿柔斯|百臂巨人/.test(n)), "低速循环屏蔽罩防穿甲 + 布里阿柔斯骨架 1 结构抗性在伤害预览中协同准确结算");

					// D4. 卓越之誓（非科技攻击总值 18+ 视为会心一击）+ 兵工厂特制底盘（超频自动获得软掩护）
					const oathHr = { target: { actor: proneEnemy }, total: 18, hit: true, crit: false };
					await v13Steps.get("rollAttacks")({
						actor: cbTank,
						item: { type: "mech_weapon", system: { lid: "mw_assault_rifle", size: "Main" } },
						data: { attack_type: "Ranged", hit_results: [oathHr], has_crit_hit: false },
					});
					ok(oathHr.crit === true, "核心奖励「卓越之誓」：武器攻击总值 18+ 自动升级为会心一击");

					await v13Steps.get("printOverchargeCard")({ actor: cbTank, data: {} });
					ok(cbTank.statuses.has("cover_soft") && L.getCombatState(cbTank).armoryOverchargeSoftCover === true, "核心奖励「兵工厂特制底盘」：超频后自动挂上软掩护");

					// D5. 体变之训（承受结构伤害自动进入无形）与静滞护盾（承受过热压力自动开启全伤害抗性）
					await v13Steps.get("printStructureCard")({ actor: cbTank, data: { desc: "lancer.tables.structure.description.direct.2", remStruct: 2 } });
					ok(cbTank.statuses.has("intangible"), "核心奖励「体变之训」：即使结构表结果本身无状态，承受结构伤害后仍自动进入无形");
					await v13Steps.get("printOverheatCard")({ actor: cbTank, data: { desc: "lancer.tables.overheat.description.emergency", remStress: 2 } });
					ok(L.RESIST_IDS.every(r => cbTank.statuses.has(r)), "核心奖励「静滞护盾」：承受压力伤害后自动开启全部五种伤害抗性");

					// D6. 寰宇兼容（回满 HP 并清空热度）、锦标赛强化（全抗性并清除状况）与适应性反应炉（2 维修 → +1 压力）
					cbTank.statuses.clear();
					cbTank.statuses.add("slow");
					await L.executeCoreAction(cbTank, "tournamentHardening");
					ok(L.RESIST_IDS.every(r => cbTank.statuses.has(r)) && !cbTank.statuses.has("slow"), "核心奖励「锦标赛强化」：开启全部伤害抗性并清除非自身状况");
					await L.executeCoreAction(cbTank, "universalCompat");
					ok(cbTank.system.hp.value === 20 && cbTank.system.heat.value === 0, "核心奖励「寰宇兼容」：一键回满 HP 并清除全部热度");
					await L.executeTalentSheetAction(cbTank, "adaptiveReactor");
					ok(cbTank.system.repairs.value === 2 && cbTank.system.stress.value === 3, "核心奖励「适应性反应炉」：消耗 2 点维修容量恢复 1 点反应炉压力");

					// =========================================================
					// E. 投掷近战武器规则闭环与「猎人」（t_hunter：跳扑 / 匕首戏法 / 蔑刃）全链路自动化（1.15.0）
					// =========================================================
					{
						const mkHunterWpn = (id, name, lid, size, type, { tags = [], range = [{ type: "Threat", val: 1 }], damage = [{ type: "Kinetic", val: "1d3+1" }] } = {}) => {
							const prof = {
								type,
								tags: tags.map(t => ({ ...t })),
								all_tags: tags.map(t => ({ ...t })),
								range: range.map(r => ({ ...r })),
								all_range: range.map(r => ({ ...r })),
								damage: damage.map(d => ({ ...d })),
								bonus_damage: [],
							};
							return {
								id,
								uuid: `Item.${id}`,
								type: "mech_weapon",
								name,
								is_mech_weapon: () => true,
								currentProfile: () => prof,
								getTags: () => prof.all_tags,
								getFlag: () => undefined,
								system: {
									lid,
									size,
									uses: { value: 0, max: 0 },
									tags: tags.map(t => ({ ...t })),
									all_tags: tags.map(t => ({ ...t })),
									selected_profile_index: 0,
									active_profile: prof,
									profiles: [prof],
								},
							};
						};

						const segKnife = mkHunterWpn("h_seg", "分段匕首", "mw_segment_knife", "Auxiliary", "Melee", { tags: [] });
						const tacKnife = mkHunterWpn("h_tac", "战术匕首", "mw_tactical_knife", "Auxiliary", "Melee", { tags: [{ lid: "tg_thrown", val: "3", is_thrown: true }] });
						const farKnife = mkHunterWpn("h_far6", "超距飞刀", "mw_custom_knife6", "Auxiliary", "Melee", { tags: [{ lid: "tg_thrown", val: "6", is_thrown: true }] });
						const mainBlade = mkHunterWpn("h_main", "充能剑", "mw_charged_blade", "Main", "Melee", { tags: [], damage: [{ type: "Energy", val: "1d3+3" }] });
						const auxPistol = mkHunterWpn("h_pistol", "手枪", "mw_pistol", "Auxiliary", "CQB", { tags: [], range: [{ type: "Range", val: 5 }, { type: "Threat", val: 3 }] });
						const chakram = mkHunterWpn("h_chak", "轮刃锁鞭", "mw_kkca_chakram_chain", "Auxiliary", "Melee", { tags: [{ lid: "tg_thrown", val: "5", is_thrown: true }] });
						const wanderingBlade = mkHunterWpn("h_wander", "“游隼”寻索阔剑", "mw_ch_wandering_blade", "Auxiliary", "Melee", { tags: [{ lid: "tg_thrown", val: "5", is_thrown: true }], damage: [{ type: "Kinetic", val: "2" }] });
						const doomAxe = mkHunterWpn("h_doom", "末日之斧", "mw_kkca_doom_axe", "Heavy", "Melee", { tags: [{ lid: "tg_thrown", val: "8", is_thrown: true }] });

						const hunterMech = mkCpMech("飞刀猎手", "mf_nelson", {
							extraItems: [segKnife, tacKnife, farKnife, mainBlade, auxPistol, chakram, wanderingBlade, doomAxe],
						});
						let mechResets = 0;
						hunterMech.reset = () => { mechResets++; };
						for (const it of hunterMech.items) { it.actor = hunterMech; it.parent = hunterMech; if (it.uuid) docMap[it.uuid] = it; }
						ctx.game.actors.push(hunterMech);

						// E1. 猎人 I 阶段尚未解锁匕首戏法；升级至猎人 II 时自动触发机甲重算，且仅对副近战武器注入/升级「投掷 5」而不污染原始 tags
						const hunterPilot = attachPilot(hunterMech, {
							talents: [["t_hunter", 1], ["t_nuclear_cavalier", 2]],
						});
						const prepItem = ctx.CONFIG.Item.documentClass.prototype.prepareFinalAttributes;
						prepItem.call(segKnife);
						prepItem.call(tacKnife);
						ok(L.weaponThrownVal(segKnife, hunterMech) === 0 && L.weaponThrownVal(tacKnife, hunterMech) === 3, "猎人 I 时未解锁匕首戏法：无投掷副近战保持 0，战术匕首保持投掷 3");

						const hunterTalItem = hunterPilot.itemTypes.talent.find(t => t.system.lid === "t_hunter");
						hunterTalItem.system.curr_rank = 2;
						hooks.updateItem(hunterTalItem);
						ok(mechResets === 1, "驾驶员升级猎人天赋至 II 级时自动触发所驾机甲 reset 重算属性");

						for (const w of [segKnife, tacKnife, farKnife, mainBlade, auxPistol]) prepItem.call(w);
						ok(
							segKnife.system.active_profile.all_tags.some(t => t.lid === "tg_thrown" && String(t.val) === "5")
							&& segKnife.system.active_profile.tags.length === 0,
							"猎人 II「匕首戏法」：无投掷标签的副近战武器在衍生 all_tags 自动获得「投掷 5」，且不污染原始 tags",
						);
						ok(
							tacKnife.system.active_profile.all_tags.find(t => t.lid === "tg_thrown")?.val === "5"
							&& tacKnife.system.active_profile.tags[0]?.val === "3",
							"猎人 II「匕首戏法」：原本投掷 3 的战术匕首自动升级为「投掷 5」，且原始 tags 仍保留 3",
						);
						ok(
							farKnife.system.active_profile.all_tags.find(t => t.lid === "tg_thrown")?.val === "6"
							&& L.weaponThrownVal(mainBlade, hunterMech) === 0
							&& L.weaponThrownVal(auxPistol, hunterMech) === 0,
							"猎人 II「匕首戏法」：投掷 >= 5 的副近战不降级，主近战与副远程武器不受影响",
						);

						// E2. 目标选择面板 attackReach 识别投掷射程与轮刃锁鞭线形 5 模板
						const segReach = L.attackReach({ state: { actor: hunterMech, item: segKnife } });
						const chakReach = L.attackReach({ state: { actor: hunterMech, item: chakram } });
						ok(segReach.reach === 5 && segReach.label === "威胁 1 / 投掷 5", `目标选择面板识别匕首戏法投掷射程（实际 reach=${segReach.reach}, label=${segReach.label}）`);
						ok(chakReach.reach === 5 && chakReach.aoe.some(a => a.type === "Line" && a.val === 5), "轮刃锁鞭在目标选择面板同时提供投掷 5 射程与线形 5 模板按钮");

						// E3. 智能近战挥砍 vs 远距投掷距离切换（邻接挥砍不受掩护影响且不离手；超威胁远投受掩护影响并标记武器已投出）
						const hunterTok = { id: "tok_hm", x: 0, y: 0, center: { x: 0, y: 0 }, actor: hunterMech, document: { uuid: "Scene.s.Token.hm", elevation: 0 } };
						const adjTok = { id: "tok_adj", name: "近身敌机", x: 100, y: 0, center: { x: 100, y: 0 }, actor: techVictim, document: { uuid: "Scene.s.Token.adj", elevation: 0 } };
						const farTok = { id: "tok_far", name: "远处敌机", x: 400, y: 0, center: { x: 400, y: 0 }, actor: techVictim, document: { uuid: "Scene.s.Token.far", elevation: 0 } };
						hunterMech.getActiveTokens = () => [hunterTok];
						docMap["Scene.s.Token.adj"] = adjTok.document;
						adjTok.document.actor = techVictim;
						docMap["Scene.s.Token.far"] = farTok.document;
						farTok.document.actor = techVictim;
						ctx.canvas = {
							...ctx.canvas,
							grid: { size: 100, measurePath: pts => ({ spaces: Math.round(Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) / 100), distance: Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) / 100 }) },
							tokens: { placeables: [hunterTok, adjTok, farTok], controlled: [hunterTok] },
						};

						// 邻接挥砍（距离 1 <= 威胁 1）：thrown 自动置为 false，攻击后武器仍在手中
						ctx.game.user.targets = new Set([adjTok]);
						const adjState = { actor: hunterMech, item: segKnife, data: {}, cardTargets: [{ uuid: "Scene.s.Token.adj", hit: true, crit: false }] };
						await v13Steps.get("initAttackData")(adjState);
						await v13Steps.get("setAttackTags")(adjState);
						await v13Steps.get("printAttackCard")(adjState);
						ok(
							adjState.data.acc_diff.weapon.thrown === false
							&& adjState.data.tags.some(t => t.lid === "tg_thrown" && String(t.val) === "5")
							&& !L.isWeaponThrownOut(hunterMech, segKnife),
							"邻接目标（距离 <= 威胁）：自动按常规近战挥砍结算（不吃投掷掩护惩罚、武器保留在手中不离手），且攻击卡保留投掷 5 标签",
						);

						// 远距投掷（距离 4 > 威胁 1）：thrown 自动置为 true，攻击后标记已投出并拦截再次使用
						ctx.game.user.targets = new Set([farTok]);
						const farState = { actor: hunterMech, item: segKnife, data: {}, cardTargets: [{ uuid: "Scene.s.Token.far", hit: true, crit: false }] };
						await v13Steps.get("initAttackData")(farState);
						await v13Steps.get("printAttackCard")(farState);
						ok(farState.data.acc_diff.weapon.thrown === true && L.isWeaponThrownOut(hunterMech, segKnife), "超出威胁的目标（距离 4 > 威胁 1）：自动切换为投掷攻击并在结算后标记该武器已投出");

						const hunterWarns = [];
						ctx.ui = { notifications: { info() {}, warn: s => hunterWarns.push(s), error() {} } };
						const blockedRepeat = await v13Steps.get("initAttackData")({ actor: hunterMech, item: segKnife, data: {} });
						ok(blockedRepeat === false && hunterWarns.some(w => /分段匕首.*已投出/.test(w)), "已投出未取回的近战武器再次发起攻击时自动拦截并提示取回条件");

						// 末日之斧（mw_kkca_doom_axe）：规则明确投掷后无需回收即可再次使用
						const doomState = { actor: hunterMech, item: doomAxe, data: {}, cardTargets: [{ uuid: "Scene.s.Token.far", hit: true, crit: false }] };
						await v13Steps.get("initAttackData")(doomState);
						await v13Steps.get("printAttackCard")(doomState);
						const doomRepeat = await v13Steps.get("initAttackData")({ actor: hunterMech, item: doomAxe, data: {} });
						ok(doomState.data.acc_diff.weapon.thrown === true && !L.isWeaponThrownOut(hunterMech, doomAxe) && doomRepeat === true, "末日之斧投掷后豁免离手锁定，无需拾回即可继续攻击");

						// “游隼”寻索阔剑（mw_ch_wandering_blade）：投掷超过射程 1 时自动获得引导并改为 1d3+2 动能伤害
						const wbState = { actor: hunterMech, item: wanderingBlade, data: {}, cardTargets: [{ uuid: "Scene.s.Token.far", hit: true, crit: false }] };
						await v13Steps.get("initAttackData")(wbState);
						await v13Steps.get("rollAttacks")(wbState);
						await v13Steps.get("printAttackCard")(wbState);
						ok(wbState.data.acc_diff.weapon.seeking === true && wbState._card.flags["lancer-cn"]?.cpDamageMod?.wanderingBladeThrownFar === true, "“游隼”寻索阔剑投掷目标距离 > 1 时自动开启引导（无视掩护与视线）并写入远投伤害修正");
						const wbDmgState = { actor: hunterMech, item: wanderingBlade, data: { lancerCnDamageMod: wbState._card.flags["lancer-cn"].cpDamageMod } };
						await v13Steps.get("showDamageHUD")(wbDmgState);
						ok(wbDmgState._hudSnapshot?.damage?.[0]?.val === "1d3+2" && wanderingBlade.system.active_profile.damage[0].val === "2", "“游隼”寻索阔剑远投伤害自动替换为 1d3+2 动能并在 HUD 关闭后无损还原物品原始数据");

						// E4. 攻击卡与机甲表拾回交互 + 猎人 II「匕首戏法」回合结束自动收回（对比无猎人 II 机甲）
						let farCardHtml = "";
						let farCardClick = null;
						const farCardRoot = {
							querySelector: sel => (sel === ".message-content" ? {
								insertAdjacentHTML: (_p, h) => { farCardHtml = h; },
								querySelector: s => (s === ".lancer-cn-status-row" ? { addEventListener: (_ev, fn) => { farCardClick = fn; }, remove() {} } : null),
							} : null),
						};
						L.onRenderChatMessage(farState._card, [farCardRoot]);
						ok(/已投出/.test(farCardHtml) && /data-lancer-cn-thrown="pickup"/.test(farCardHtml) && /data-lancer-cn-thrown="undo"/.test(farCardHtml), "投掷攻击卡自动渲染「已投出」提示、「自由动作拾回」与「撤销投出」按钮");

						const wpnBadgeOut = [];
						const rollBtnMock = { style: {}, title: "" };
						const wpnCardMock = {
							dataset: { uuid: wanderingBlade.uuid },
							querySelector: sel => {
								if (sel === ".lancer-cn-thrown-badge") return null;
								if (sel === ".roll-attack") return rollBtnMock;
								if (sel === ".lancer-body") return { insertAdjacentHTML: (_p, h) => wpnBadgeOut.push(h) };
								return null;
							},
						};
						const sheetTalentBarHtml = L.renderTalentControlHTML(hunterMech);
						L.onRenderActorSheet({ actor: hunterMech }, [{
							dataset: {},
							querySelectorAll: sel => (sel.includes(".mech_weapon.set[data-uuid]") ? [wpnCardMock] : []),
							querySelector: () => null,
						}]);
						ok(
							wpnBadgeOut.length === 1 && /已投出/.test(wpnBadgeOut[0]) && rollBtnMock.style.opacity === "0.45"
							&& /pickupThrown:h_seg/.test(sheetTalentBarHtml) && /pickupThrownAll/.test(sheetTalentBarHtml),
							"机甲表武器栏在武器已投出时半透明灰显攻击钮、注入「已投出 + 自由动作拾回」徽标，并在战术栏提供快捷拾回与全部拾回",
						);

						await L.executeTalentSheetAction(hunterMech, `pickupThrown:${wanderingBlade.id}`);
						ok(!L.isWeaponThrownOut(hunterMech, wanderingBlade) && L.isWeaponThrownOut(hunterMech, segKnife), "机甲表点击自由动作拾回可单独取回指定投出武器");

						// 对比：无猎人 II 的机甲回合结束不自动收回；具备猎人 II「匕首戏法」的机甲回合结束自动收回全部投出武器并发送提示卡
						const plainThrower = mkCpMech("普通投矛手", "mf_standard_pattern_i_everest");
						const plainKnife = mkHunterWpn("p_tac", "战术匕首", "mw_tactical_knife", "Auxiliary", "Melee", { tags: [{ lid: "tg_thrown", val: "3", is_thrown: true }] });
						plainKnife.actor = plainThrower;
						plainThrower.items.push(plainKnife);
						attachPilot(plainThrower, { talents: [["t_hunter", 1]] });
						await L.markWeaponThrown(plainThrower, plainKnife, "Scene.s.Token.far");
						await L.onUpdateCombatTurnEnd({
							round: 1,
							previous: { combatantId: "c_plain" },
							current: { combatantId: "c_hunter" },
							combatants: {
								get: id => (id === "c_plain" ? { id: "c_plain", name: "普通投矛手", actor: plainThrower } : { id: "c_hunter", name: "飞刀猎手", actor: hunterMech }),
								[Symbol.iterator]: function* () { yield { actor: plainThrower }; yield { actor: hunterMech }; },
							},
						}, { turn: 1 }, { direction: 1 });
						ok(L.isWeaponThrownOut(plainThrower, plainKnife), "未具备猎人 II「匕首戏法」的机甲在回合结束时投出武器不会自动飞回");

						await L.onUpdateCombatTurnEnd({
							round: 1,
							previous: { combatantId: "c_hunter" },
							current: { combatantId: "c_plain" },
							combatants: {
								get: id => (id === "c_hunter" ? { id: "c_hunter", name: "飞刀猎手", actor: hunterMech } : { id: "c_plain", name: "普通投矛手", actor: plainThrower }),
								[Symbol.iterator]: function* () { yield { actor: plainThrower }; yield { actor: hunterMech }; },
							},
						}, { turn: 0 }, { direction: 1 });
						ok(!L.isWeaponThrownOut(hunterMech, segKnife) && L.getThrownWeapons(hunterMech).length === 0 && /匕首戏法 · 投掷武器自动收回/.test(chatCreated.at(-1)?.content ?? ""), "猎人 II「匕首戏法」：回合结束时自动收回本机甲投出的全部武器并发送战报提示卡");

						// E5. 猎人 I「跳扑」（1/轮飞行 3 格）与猎人 III「蔑刃」（1/轮自由动作投掷副近战且禁绝一切额外伤害）
						hunterTalItem.system.curr_rank = 3;
						await L.executeTalentSheetAction(hunterMech, "hunterLunge");
						ok(L.getCombatState(hunterMech).usedHunterLunge === true && /猎人 · 跳扑/.test(chatCreated.at(-1)?.content ?? ""), "猎人 I「跳扑」：点击机甲表按钮发出无视交战与反应的 3 格飞行卡并记为本轮已用");
						await L.executeTalentSheetAction(hunterMech, "hunterLunge");
						ok(L.getCombatState(hunterMech).usedHunterLunge === false, "猎人 I「跳扑」：本轮已用时再次点击支持防误触重置");

						let lastDisdainState = null;
						ctx.game.lancer.flows.set("WeaponAttackFlow", class {
							constructor(u, d) {
								this.item = docMap[u] ?? u;
								this.state = { actor: this.item.actor, item: this.item, data: { ...(d ?? {}) }, cardTargets: [{ uuid: "Scene.s.Token.adj", hit: true, crit: false }] };
							}
							async begin() {
								const okInit = await v13Steps.get("initAttackData")(this.state);
								if (okInit === false) return false;
								await v13Steps.get("setAttackTags")(this.state);
								await v13Steps.get("rollAttacks")(this.state);
								await v13Steps.get("printAttackCard")(this.state);
								lastDisdainState = this.state;
								return true;
							}
						});

						// 先只保留 tacKnife 为唯一未投出副近战（将其余副近战标为已投出），并让机甲处于超温危域测试「蔑刃不能造成额外伤害」
						for (const w of [segKnife, farKnife, chakram, wanderingBlade]) await L.markWeaponThrown(hunterMech, w, "Scene.s.Token.far");
						hunterMech.statuses.add("dangerzone");
						await L.setCombatState(hunterMech, { usedNuCavBonus: false, usedHunterDisdainful: false });

						ctx.game.user.targets = new Set([adjTok]);
						const mainHitState = { actor: hunterMech, item: mainBlade, data: {}, cardTargets: [{ uuid: "Scene.s.Token.adj", hit: true, crit: false }] };
						await v13Steps.get("initAttackData")(mainHitState);
						await v13Steps.get("printAttackCard")(mainHitState);
						const mainHitInfo = L.analyzeCard(mainHitState._card);
						ok(mainHitInfo.weaponRiders.some(r => r.kind === "hunterDisdainful"), "猎人 III「蔑刃」：近战攻击命中卡自动生成自由动作投掷副近战武器按钮");

						await L.executeCardRider(mainHitState._card, mainHitInfo, "hunterDisdainful");
						ok(
							lastDisdainState?.item === tacKnife
							&& lastDisdainState?.data?.acc_diff?.weapon?.thrown === true
							&& L.isWeaponThrownOut(hunterMech, tacKnife)
							&& lastDisdainState?._card?.flags?.["lancer-cn"]?.cpDamageMod?.noBonusDamage === true
							&& L.getCombatState(hunterMech).usedHunterDisdainful === true,
							"猎人 III「蔑刃」：自动筛选未投出的可用副近战武器强制以投掷模式发起攻击、标记离手并写入禁额外伤害标记",
						);

						const disdainDmgState = {
							actor: hunterMech,
							item: tacKnife,
							data: {
								lancerCnDamageMod: lastDisdainState._card.flags["lancer-cn"].cpDamageMod,
								bonus_damage: [{ type: "Kinetic", val: "1d6" }],
								damage_hud_data: { base: { bonusDamage: [{ type: "Kinetic", val: "1d6" }] }, weapon: { bonusDamage: [] }, targets: [{ bonusDamage: [{ type: "Kinetic", val: "1d6" }] }] },
							},
						};
						await v13Steps.get("setDamageTags")(disdainDmgState);
						await v13Steps.get("rollReliable")(disdainDmgState);
						ok(
							disdainDmgState.data.bonus_damage.length === 0
							&& disdainDmgState.data.damage_hud_data.base.bonusDamage.length === 0
							&& disdainDmgState.data.damage_hud_data.targets[0].bonusDamage.length === 0
							&& L.getCombatState(hunterMech).usedNuCavBonus === false,
							"猎人 III「蔑刃」：严格剥离全部额外伤害，且不会误消耗本回合核骑兵等 1/回合额外伤害充能",
						);

						await L.onUpdateCombatTurnEnd({ combatants: [{ actor: hunterMech }] }, { round: 3 }, { direction: 1 });
						ok(L.getCombatState(hunterMech).usedHunterLunge === false && L.getCombatState(hunterMech).usedHunterDisdainful === false, "进入新一轮时自动重置猎人 I「跳扑」与猎人 III「蔑刃」的每轮限次");
						hunterMech.statuses.delete("dangerzone");

						// =========================================================
						// F. NPC 武器伤害流程修复、非链接 NPC 指示物定位与未锁定目标伤害卡兜底应用（1.15.1）
						// =========================================================
						{
							const origTierArray = [
								[{ type: "Kinetic", val: "6" }],
								[{ type: "Kinetic", val: "9" }],
								[{ type: "Kinetic", val: "12" }],
							];
							const npcAssault = mkCpMech("突击兵", "mf_standard_pattern_i_everest", { isOwner: true });
							npcAssault.id = "npc_assault";
							npcAssault.uuid = "Scene.s.Token.npc_a.Actor.npc_assault";
							npcAssault.type = "npc";
							npcAssault.is_npc = () => true;
							npcAssault.is_mech = () => false;
							npcAssault.system.tier = 2;

							const npcRifle = {
								id: "npcf_rifle",
								uuid: "Scene.s.Token.npc_a.Actor.npc_assault.Item.npcf_rifle",
								type: "npc_feature",
								name: "重型突击步枪",
								actor: npcAssault,
								parent: npcAssault,
								is_npc_feature: () => true,
								system: {
									lid: "npcf_assault_heavy_assault_rifle",
									type: "Weapon",
									weapon_type: "Main Rifle",
									tier_override: 0,
									damage: origTierArray,
									range: [{ type: "Range", val: 10 }],
									tags: [{ lid: "tg_reliable", val: "{2/3/4}", is_reliable: true, tierVal: t => [2, 3, 4][t - 1] }],
									all_tags: [{ lid: "tg_reliable", val: "{2/3/4}", is_reliable: true, tierVal: t => [2, 3, 4][t - 1] }],
								},
							};
							const npcBlade = {
								id: "npcf_blade",
								uuid: "Scene.s.Token.npc_a.Actor.npc_assault.Item.npcf_blade",
								type: "npc_feature",
								name: "战术投斧",
								actor: npcAssault,
								parent: npcAssault,
								is_npc_feature: () => true,
								system: {
									lid: "npcf_berserker_chain_axe",
									type: "Weapon",
									weapon_type: "Heavy Melee",
									tier_override: 0,
									damage: [[{ type: "Kinetic", val: "1d6+2" }]], // 单层级自定义 NPC 武器容错测试
									range: [{ type: "Threat", val: 1 }],
									tags: [{ lid: "tg_thrown", val: "5", is_thrown: true }],
									all_tags: [{ lid: "tg_thrown", val: "5", is_thrown: true }],
								},
							};
							const npcTech = {
								id: "npcf_tech",
								uuid: "Scene.s.Token.npc_a.Actor.npc_assault.Item.npcf_tech",
								type: "npc_feature",
								name: "逻辑炸弹",
								actor: npcAssault,
								parent: npcAssault,
								is_npc_feature: () => true,
								system: {
									lid: "npcf_witch_logic_bomb",
									type: "Tech",
									tech_type: "Quick",
									tier_override: 0,
									tags: [
										{ lid: "tg_ap", is_ap: true },
										{ lid: "tg_reliable", val: "{1/2/3}", is_reliable: true, tierVal: t => t },
									],
								},
							};
							npcAssault.items = [npcRifle, npcBlade, npcTech];
							docMap[npcAssault.uuid] = npcAssault;
							docMap[npcRifle.uuid] = npcRifle;
							docMap[npcBlade.uuid] = npcBlade;
							docMap[npcTech.uuid] = npcTech;

							// F1. NPC 武器 showDamageHUD：保留二维层级伤害数组不崩溃、匹配当前层级、支持 tier_override 与单层级回退，且退出后无损还原原数组引用
							const npcDmgSt1 = { actor: npcAssault, item: npcRifle, data: {} };
							const okHud1 = await v13Steps.get("showDamageHUD")(npcDmgSt1);
							ok(
								okHud1 === true
								&& Array.isArray(npcDmgSt1._npcHudDamage)
								&& npcDmgSt1._npcHudDamage[0]?.val === "9"
								&& npcRifle.system.damage === origTierArray
								&& Array.isArray(npcRifle.system.damage[1])
								&& npcRifle.system.damage[1][0].val === "9",
								"NPC 武器掷伤害（showDamageHUD）：保持二维层级数组不触发 .map 崩溃，准确读取 T2 伤害（9）并在退出后无损还原原始二维数组",
							);

							npcRifle.system.tier_override = 3;
							const npcDmgSt2 = { actor: npcAssault, item: npcRifle, data: {} };
							await v13Steps.get("showDamageHUD")(npcDmgSt2);
							npcRifle.system.tier_override = 0;
							ok(npcDmgSt2._npcHudDamage?.[0]?.val === "12" && npcRifle.system.damage === origTierArray, "NPC 武器设置 tier_override=3 时在 T2 NPC 上准确读取 T3 伤害（12）且还原原数组");

							npcAssault.system.tier = 3;
							const npcDmgSt3 = { actor: npcAssault, item: npcBlade, data: {} };
							await v13Steps.get("showDamageHUD")(npcDmgSt3);
							npcAssault.system.tier = 2;
							ok(npcDmgSt3._npcHudDamage?.[0]?.val === "1d6+2", "仅填写了 T1 单层伤害的自定义 NPC 武器在高阶（T3）NPC 上自动回退有效层级而不崩溃");

							// F2. 非 Weapon 类型的 NPC 特性（如 Tech 科技攻击）通过 setDamageTags 并不报错拦截
							const npcTechDmgSt = { actor: npcAssault, item: npcTech, data: {} };
							const okTechTags = await v13Steps.get("setDamageTags")(npcTechDmgSt);
							ok(
								okTechTags === true
								&& npcTechDmgSt.data.ap === true
								&& npcTechDmgSt.data.reliable === true
								&& npcTechDmgSt.data.reliable_val === 2,
								"非 Weapon 类型的 NPC 科技特性触发伤害流程时不报「can't deal damage」，并准确提取穿甲与当前层级可靠值（T2=2）",
							);

							// F3. NPC 武器类型识别与角色表投出武器徽标
							await L.markWeaponThrown(npcAssault, npcBlade, "Scene.s.Token.adj");
							const npcSheetBadgeOut = [];
							const npcRollBtnMock = { style: {}, title: "" };
							L.onRenderActorSheet({ actor: npcAssault }, [{
								dataset: {},
								querySelectorAll: sel => (sel.includes(".npc_feature.set[data-uuid]") ? [{
									dataset: { uuid: npcBlade.uuid },
									querySelector: s => (s === ".lancer-cn-thrown-badge" ? null : s === ".roll-attack" ? npcRollBtnMock : s === ".lancer-body" ? { insertAdjacentHTML: (_p, h) => npcSheetBadgeOut.push(h) } : null),
								}] : []),
								querySelector: () => null,
							}]);
							ok(npcSheetBadgeOut.length === 1 && /已投出/.test(npcSheetBadgeOut[0]) && npcRollBtnMock.style.opacity === "0.45", "NPC 角色表同样为已投出的 NPC 投掷近战武器渲染已投出徽标与自由动作拾回按钮");
							await L.retrieveThrownWeapon(npcAssault, npcBlade);

							// F4. 非链接（actorLink=false）NPC 指示物在 GM 当前左键选中玩家棋子时仍能准确定位自身位置、测距与自动选敌
							const npcTok = {
								id: "tok_npc_a", name: "突击兵", x: 0, y: 0, center: { x: 0, y: 0 }, visible: true,
								actor: npcAssault,
								document: { id: "tok_npc_a", uuid: "Scene.s.Token.npc_a", actorId: "npc_base", disposition: -1, elevation: 0 },
							};
							npcTok.document.object = npcTok;
							npcAssault.token = npcTok.document;
							npcAssault.getActiveTokens = linked => (linked ? [] : [npcTok]); // 真实 Foundry 非链接合成角色：getActiveTokens(true) 返回 []

							const lonePlayerMech = mkCpMech("玩家前锋", "mf_nelson", { isOwner: true, armor: 2, hp: 14, overshield: 0 });
							let playerDmgCalcCalls = [];
							lonePlayerMech.damageCalc = async (applied, opts) => { playerDmgCalcCalls.push({ applied, opts }); };
							const lonePlayerTok = {
								id: "tok_pl_1", name: "玩家前锋", x: 300, y: 0, center: { x: 300, y: 0 }, visible: true,
								actor: lonePlayerMech,
								document: { id: "tok_pl_1", uuid: "Scene.s.Token.pl1", actorId: lonePlayerMech.id, actor: lonePlayerMech, disposition: 1, elevation: 0 },
								setTarget(v) { if (v) ctx.game.user.targets.add(this); else ctx.game.user.targets.delete(this); },
							};
							lonePlayerTok.document.object = lonePlayerTok;
							docMap["Scene.s.Token.pl1"] = lonePlayerTok.document;

							ctx.game.user.isGM = true;
							ctx.game.user.targets = new Set();
							log.settingValues["lancer-cn.targetPicker"] = true;
							log.settingValues["lancer-cn.targetAutoPick"] = true;
							ctx.canvas = {
								...ctx.canvas,
								grid: { size: 100, measurePath: pts => ({ spaces: Math.round(Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) / 100), distance: Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) / 100 }) },
								tokens: {
									placeables: [npcTok, lonePlayerTok],
									controlled: [lonePlayerTok], // 模拟 GM 此前左键点击了玩家机甲（选中控制的是玩家而非 NPC）
									get: id => [npcTok, lonePlayerTok].find(t => t.id === id),
								},
							};
							const fakeNpcAtkFlow = { constructor: { name: "WeaponAttackFlow" }, state: { actor: npcAssault, item: npcRifle, data: {} } };
							L.openTargetPicker(fakeNpcAtkFlow);
							ok(
								L.targetSession()?.token === npcTok && ctx.game.user.targets.has(lonePlayerTok),
								"非链接 NPC 发起攻击时（即使 GM 当前左键选中控制的是玩家棋子），准确解析 NPC 自身指示物位置、测算射程并自动锁定射程内唯一玩家敌机",
							);
							L.closeTargetPicker(fakeNpcAtkFlow, false);

							// F5. 未锁定目标伤害卡兜底应用栏（decorateDamageCard + applyUntargetedDamageFromCard）
							const mkUntargetedRoot = () => {
								const appended = [];
								const listeners = {};
								let selectEl = null;
								let previewEl = null;
								let btnEl = null;
								const host = {
									append: el => {
										appended.push(el);
									},
								};
								const ownerDocument = {
									createElement: tag => {
										const el = {
											tagName: tag.toUpperCase(),
											className: "",
											style: {},
											_html: "",
											set innerHTML(v) {
												this._html = v;
												selectEl = { value: "1", addEventListener: (ev, fn) => { listeners[`sel:${ev}`] = fn; } };
												previewEl = { textContent: "" };
												btnEl = { addEventListener: (ev, fn) => { listeners[`btn:${ev}`] = fn; } };
											},
											get innerHTML() { return this._html; },
											querySelector: s => {
												if (s === ".lancer-cn-untargeted-mult") return selectEl;
												if (s === ".lancer-cn-untargeted-preview") return previewEl;
												if (s === "[data-lancer-cn-apply-untargeted]") return btnEl;
												return null;
											},
											addEventListener: (ev, fn) => { listeners[`bar:${ev}`] = fn; },
										};
										return el;
									},
								};
								return {
									ownerDocument,
									appended,
									listeners,
									getSelect: () => selectEl,
									getPreview: () => previewEl,
									querySelectorAll: () => [],
									querySelector: s => {
										if (s === ".lancer-cn-untargeted-apply") return appended[0] ?? null;
										if (s.includes(".card")) return host;
										return null;
									},
								};
							};

							// 燃烧检定清除卡（damageResults 为空）不应注入兜底应用栏
							const emptyBurnRoot = mkUntargetedRoot();
							const emptyBurnMsg = mkFlagMsg("burn_ok", { lancer: { damageData: { damageResults: [], critDamageResults: [], targetDamageResults: [] } } }, { speaker: { token: "tok_npc_a" } });
							L.decorateDamageCard(emptyBurnMsg, emptyBurnRoot, emptyBurnMsg.flags.lancer.damageData);
							ok(emptyBurnRoot.appended.length === 0, "无伤害数值的卡片（如燃烧清除成功卡）不会注入未锁定兜底应用栏");

							// 未锁定目标掷出的有效 NPC 伤害卡：注入兜底应用栏 + 实时结算预览
							const untargetedDmgData = {
								ap: false,
								paracausal: false,
								half_damage: false,
								damageResults: [
									{ d_type: "Kinetic", roll: { total: 9 }, bonus: false },
									{ d_type: "Energy", roll: { total: 4 }, bonus: true },
								],
								critDamageResults: [],
								targetDamageResults: [],
							};
							const untargetedMsg = mkFlagMsg("npc_untgt_dmg", { lancer: { damageData: untargetedDmgData } }, { speaker: { token: "tok_npc_a", actor: npcAssault.id } });
							ctx.game.user.targets = new Set();
							ctx.canvas.tokens.controlled = [lonePlayerTok]; // GM 左键选中了玩家机甲
							const untargetedRoot = mkUntargetedRoot();
							L.decorateDamageCard(untargetedMsg, untargetedRoot, untargetedDmgData);
							ok(
								untargetedRoot.appended.length === 1
								&& /应用伤害（锁定\/选中目标）/.test(untargetedRoot.appended[0].innerHTML)
								&& /玩家前锋：结算预览：-11 HP/.test(untargetedRoot.getPreview()?.textContent ?? ""),
								`未锁定目标伤害卡自动注入兜底应用按钮并实时预览受击者扣血（9动能+4能量 扣 2 护甲 = -11 HP，实际预览=${untargetedRoot.getPreview()?.textContent}）`,
							);

							// 仅选中攻击者自身（NPC 自己）且未按 T 锁定时：防误伤拦截，绝不扣 NPC 自己的血
							let npcSelfDmgCalled = false;
							npcAssault.damageCalc = async () => { npcSelfDmgCalled = true; };
							const untgtWarns = [];
							ctx.ui = { notifications: { info() {}, warn: s => untgtWarns.push(s), error() {} } };
							ctx.canvas.tokens.controlled = [npcTok];
							const selfRes = await L.applyUntargetedDamageFromCard(untargetedMsg, untargetedDmgData, { multiple: 1 });
							ok(selfRes.ok === false && selfRes.reason === "self_only" && !npcSelfDmgCalled && untgtWarns.some(w => /角色自身/.test(w)), "仅左键选中攻击者自身指示物时自动拦截防误伤，不会把伤害误扣在攻击方 NPC 身上");

							// GM 左键选中玩家机甲（未按 T 锁定）点击应用伤害：准确对玩家机甲调用 damageCalc
							playerDmgCalcCalls = [];
							ctx.canvas.tokens.controlled = [lonePlayerTok];
							const ctrlRes = await L.applyUntargetedDamageFromCard(untargetedMsg, untargetedDmgData, { multiple: 1 });
							ok(
								ctrlRes.ok === true
								&& playerDmgCalcCalls.length === 1
								&& playerDmgCalcCalls[0].applied.Kinetic === 9
								&& playerDmgCalcCalls[0].applied.Energy === 4
								&& playerDmgCalcCalls[0].opts.multiple === 1,
								"GM 左键选中玩家机甲后点击未锁定伤害卡兜底按钮，直接对玩家机甲结算 9 动能 + 4 能量伤害",
							);

							// 按 T 锁定多名目标且选择 0.5× 倍率时：额外伤害（bonus=true）按多目标规则自动减半（4 → 2）并以 0.5 倍率结算
							const secondAllyMech = mkCpMech("玩家支援", "mf_lancaster", { isOwner: true, armor: 1, hp: 12 });
							let secondAllyCalls = [];
							secondAllyMech.damageCalc = async (applied, opts) => { secondAllyCalls.push({ applied, opts }); };
							const secondAllyTok = {
								id: "tok_pl_2", name: "玩家支援",
								actor: secondAllyMech,
								document: { id: "tok_pl_2", uuid: "Scene.s.Token.pl2", actor: secondAllyMech },
							};
							playerDmgCalcCalls = [];
							ctx.game.user.targets = new Set([lonePlayerTok, secondAllyTok]);
							const multiRes = await L.applyUntargetedDamageFromCard(untargetedMsg, untargetedDmgData, { multiple: 0.5 });
							ok(
								multiRes.ok === true
								&& multiRes.appliedCount === 2
								&& playerDmgCalcCalls[0]?.applied.Kinetic === 9
								&& playerDmgCalcCalls[0]?.applied.Energy === 2
								&& playerDmgCalcCalls[0]?.opts.multiple === 0.5
								&& secondAllyCalls[0]?.applied.Energy === 2,
								"按 T 锁定多名目标结算时：优先取锁定目标、多目标额外伤害自动减半（4→2），并透传所选抗性倍率（0.5×）",
							);
							ctx.game.user.targets = new Set();

							// F6. NPC 模板核心特征兼容与被动自动化（1.15.2）
							// (a) 中文老兵「传奇」（npcf_cn_veteran_11）与怪形「独特生理机能」（npcf_cn_monstrosity_1）兼容原生结构/过热表并无损还原 ID
							const vetMonNpc = {
								id: "npc_vet_mon", uuid: "Actor.npc_vet_mon", name: "老兵怪形", type: "npc", isOwner: true,
								is_npc: () => true,
								statuses: new Set(),
								system: { tier: 2, structure: { value: 2, max: 3 }, stress: { value: 1, max: 2 } },
								items: [
									{ type: "npc_feature", name: "独特生理机能", system: { lid: "npcf_cn_monstrosity_1" } },
									{ type: "npc_feature", name: "传奇", system: { lid: "npcf_cn_veteran_11" } },
								],
							};
							vetMonNpc.itemTypes = { npc_feature: vetMonNpc.items };
							const monStrState = { actor: vetMonNpc, data: { remStruct: 2, embedButtons: [] } };
							await v13Steps.get("rollStructureTable")(monStrState);
							await v13Steps.get("structureInsertDismembermentButton")(monStrState);
							await v13Steps.get("structureInsertSecondaryRollButton")(monStrState);
							const monOvhState = { actor: vetMonNpc, data: { remStress: 1 } };
							await v13Steps.get("rollOverheatTable")(monOvhState);
							ok(
								monStrState.data.roll_str === "{1d6kl1, 1d6kl1}kh"
								&& monOvhState.data.roll_str === "{1d6kl1, 1d6kl1}kh"
								&& monStrState.data.desc.includes("structureMonstrosity")
								&& monStrState.data.embedButtons.includes("dismemberDamage")
								&& !monStrState.data.embedButtons.includes("secondaryStructure")
								&& vetMonNpc.items[0].system.lid === "npcf_cn_monstrosity_1"
								&& vetMonNpc.items[1].system.lid === "npcf_cn_veteran_11",
								"中文老兵「传奇」与怪形「独特生理机能」在结构/过热检定中准确触发双骰取高与怪形专属表，并在执行后无损还原中文 LID",
							);

							// (b) NPC 科技特性 tier_override（1~3）下标偏移修复 + effect/tags 补齐
							const witchTech = {
								id: "nf_witch_tear", uuid: "Item.nf_witch_tear", name: "撕裂逻辑", type: "npc_feature",
								is_npc_feature: () => true,
								system: {
									lid: "npcf_cn_witch_2", type: "Tech", tech_type: "Quick", tech_attack: true,
									tier_override: 3,
									attack_bonus: [2, 4, 6],
									accuracy: [1, 1, 2],
									effect: "<div>目标受到 2/3/4 热度并陷入缓慢。</div>",
									tags: [{ lid: "tg_quick_tech", val: "" }],
								},
							};
							const witchNpc = {
								id: "npc_witch", uuid: "Actor.npc_witch", name: "女巫", type: "npc", isOwner: true,
								is_npc: () => true,
								statuses: new Set(),
								system: { tier: 1, sys: 2 },
								items: [witchTech, { type: "npc_feature", name: "军团", system: { lid: "npcf_cn_ultra_24" } }],
							};
							const witchT3State = { actor: witchNpc, item: witchTech, data: {} };
							await v13Steps.get("initTechAttackData")(witchT3State);
							ok(
								witchT3State.data.grit === 6
								&& witchT3State.data.acc_diff.base.accuracy === 3
								&& witchT3State.data.effect.includes("撕裂逻辑") === false
								&& witchT3State.data.effect.includes("2/3/4 热度")
								&& witchT3State.data.tags.length === 1
								&& witchTech.system.tier_override === 3
								&& witchNpc.system.tier === 1,
								"NPC 科技特性设置 tier_override=3 时准确读取 T3 攻击加值(+6)与准度(+2，叠加超体军团+1=3)，补齐 effect/tags 且不污染角色原层级",
							);
							witchTech.system.tier_override = 1;
							witchNpc.system.tier = 3;
							const witchT1State = { actor: witchNpc, item: witchTech, data: {} };
							await v13Steps.get("initTechAttackData")(witchT1State);
							ok(witchT1State.data.grit === 2 && witchNpc.system.tier === 3, "NPC 科技特性设置 tier_override=1 时准确读取 T1 攻击加值(+2)而非误偏到 T2");

							// (c) 海盗「分裂弹」（npcf_cn_pirate_4）会心 +3 固定额外伤害（可与「致命」+1d6 叠加）
							const pirateNpc = {
								id: "npc_pirate", uuid: "Actor.npc_pirate", name: "海盗突击兵", type: "npc", isOwner: true,
								is_npc: () => true,
								system: { tier: 1 },
								items: [
									{ type: "npc_feature", name: "致命", system: { lid: "npcf_cn_pirate_1" } },
									{ type: "npc_feature", name: "分裂弹", system: { lid: "npcf_cn_pirate_4" } },
								],
							};
							const pirateCritState = {
								actor: pirateNpc,
								data: {
									has_crit_hit: true,
									damage: [{ type: "Kinetic", val: "6" }],
									crit_damage_results: [{ d_type: "Kinetic", roll: { total: 6 }, bonus: false }],
									damage_hud_data: { targets: [{ targetUuid: "Scene.s.Token.pl1" }] },
									targets: [{ target: lonePlayerTok, crit: true, half_damage: false, damage: [{ type: "Kinetic", amount: 6 }] }],
								},
							};
							await v13Steps.get("rollCritDamage")(pirateCritState);
							ok(
								pirateCritState.data.crit_damage_results.length === 3
								&& pirateCritState.data.crit_damage_results[2].roll.total === 3
								&& pirateCritState.data.targets[0].damage.reduce((s, d) => s + d.amount, 0) === 13,
								"海盗同时具备「致命」(+1d6=4) 与「分裂弹」(+3) 时，会心一击自动追加两段额外伤害（6+4+3=13）",
							);

							// (d) NPC 模板无条件状态免疫（卓越骨架 / 卓越反应堆 / 至高维护 / 势不可挡 / 活体武器 / 飞行物）
							const immuneUltra = {
								id: "npc_imm_u", uuid: "Actor.npc_imm_u", name: "堡垒超体", type: "npc", isOwner: true,
								is_npc: () => true,
								statuses: new Set(),
								toggleStatusEffect: async (st, { active }) => { if (active) immuneUltra.statuses.add(st); else immuneUltra.statuses.delete(st); },
								items: [
									{ type: "npc_feature", name: "卓越骨架", system: { lid: "npcf_cn_ultra_28" } },
									{ type: "npc_feature", name: "卓越反应堆", system: { lid: "npcf_cn_ultra_29" } },
									{ type: "npc_feature", name: "至高维护", system: { lid: "npcf_cn_ultra_31" } },
									{ type: "npc_feature", name: "势不可挡", system: { lid: "npcf_cn_ultra_33" } },
								],
							};
							docMap[immuneUltra.uuid] = immuneUltra;
							for (const blockedSt of ["slow", "shredded", "immobilized", "stunned", "exposed", "jammed", "prone"]) {
								const immRes = await L.setActorStatus(immuneUltra.uuid, blockedSt, true);
								ok(immRes.immune === true && !immuneUltra.statuses.has(blockedSt), `超体模板特征自动免疫状态 ${blockedSt}`);
							}
							const lockRes = await L.setActorStatus(immuneUltra.uuid, "lockon", true);
							ok(lockRes.changed === true && immuneUltra.statuses.has("lockon"), "非免疫状态（如锁定）仍可正常施加给超体 NPC");

							// (e) NPC 模板攻击、科技攻防与系统豁免自动修正（至高近战 / 卓越索敌 / 视域 / 固化目标 / 要塞 / 科技脆弱）
							const ultraAttacker = {
								id: "npc_u_atk", uuid: "Actor.npc_u_atk", name: "剑圣超体", type: "npc", isOwner: true,
								is_npc: () => true,
								statuses: new Set(),
								system: { tier: 2 },
								items: [
									{ type: "npc_feature", name: "至高近战", system: { lid: "npcf_cn_ultra_32" } },
									{ type: "npc_feature", name: "卓越索敌", system: { lid: "npcf_cn_ultra_30" } },
									{ type: "npc_feature", name: "视域", system: { lid: "npcf_cn_ultra_26" } },
								],
							};
							const meleeNpcState = {
								actor: ultraAttacker,
								item: npcBlade,
								targets: [{ target: lonePlayerTok, accuracy: 0, difficulty: 0, cover: 0, plugins: { invisibility: { data: 1 } } }],
								data: { attack_type: "Melee" },
							};
							await v13Steps.get("initAttackData")(meleeNpcState);
							ok(
								meleeNpcState.data.acc_diff.base.accuracy === 1
								&& meleeNpcState.data.acc_diff.targets[0].plugins.invisibility.data === -1,
								"超体「至高近战」近战攻击自动 +1 准度，「视域」自动将目标隐形插件置为忽略(-1)",
							);
							const rangedNpcState = {
								actor: ultraAttacker,
								item: npcRifle,
								targets: [{ target: lonePlayerTok, accuracy: 0, difficulty: 0, cover: 2 }],
								data: { attack_type: "Ranged" },
							};
							await v13Steps.get("initAttackData")(rangedNpcState);
							ok(rangedNpcState.data.acc_diff.targets[0].cover === 0, "超体「卓越索敌」远程攻击自动忽略目标软/硬掩护");

							const hardenedVet = {
								id: "npc_h_vet", uuid: "Actor.npc_h_vet", name: "固化老兵", type: "npc", isOwner: true,
								is_npc: () => true,
								statuses: new Set(),
								system: { tier: 2, sys: 1 },
								items: [{ type: "npc_feature", name: "固化目标", system: { lid: "npcf_cn_veteran_8" } }],
							};
							const rpvBot = {
								id: "npc_rpv", uuid: "Actor.npc_rpv", name: "无人战车", type: "npc", isOwner: true,
								is_npc: () => true,
								statuses: new Set(),
								system: { tier: 1, sys: 0 },
								items: [{ type: "npc_feature", name: "科技脆弱", system: { lid: "npcf_cn_rpv_3" } }],
							};
							const techVsNpcState = {
								actor: goblinHacker,
								item: docMap["Item.horos1"],
								targets: [
									{ target: { actor: hardenedVet }, accuracy: 0, difficulty: 0 },
									{ target: { actor: rpvBot }, accuracy: 0, difficulty: 0 },
								],
								data: {},
							};
							await v13Steps.get("initTechAttackData")(techVsNpcState);
							ok(
								techVsNpcState.data.acc_diff.targets[0].difficulty === 1
								&& techVsNpcState.data.acc_diff.targets[1].accuracy === 1,
								"对带有「固化目标」的老兵发起科技攻击自动 +1 难度，对带有「科技脆弱」的 RPV 发起科技攻击自动 +1 准度",
							);
							const vetSaveState = { actor: hardenedVet, data: { title: "系统豁免（DC 14）", path: "system.sys" } };
							await v13Steps.get("initStatRollData")(vetSaveState);
							ok(vetSaveState.data.acc_diff.base.accuracy === 1, "带有「固化目标」的 NPC 进行系统豁免时自动 +1 准度");
						}
					}
				}
			}
		}
	}

	// ---- 鼠标悬停感应范围雷达圈（1.14.0）
	{
		const L = ctx.LancerCN;
		const sHover = log.settings["lancer-cn.sensorHoverOverlay"];
		const sScope = log.settings["lancer-cn.sensorHoverScope"];
		ok(sHover && sHover.scope === "client" && sHover.config === true && sHover.default === true, "应注册客户端设置「鼠标悬停显示感应范围」（默认开启）");
		ok(sScope && sScope.scope === "world" && sScope.config === true && sScope.default === "friendly" && sScope.choices?.friendly && sScope.choices?.all, "应注册世界设置「悬停感应圈可见范围」（默认友方与拥有观察权限的角色）");
		ok(typeof hooks.hoverToken === "function" && typeof hooks.refreshToken === "function" && typeof hooks.canvasTearDown === "function", "应注册 hoverToken / refreshToken / canvasTearDown 钩子");

		const hexGrid = L.makeHexGrid(4, 100);
		const mkSensorTok = (id, type, sensorRange, offsets, disp = 1, extra = {}) => {
			const c0 = hexGrid.getCenterPoint(offsets[0]);
			const tok = {
				id, x: c0.x, y: c0.y, center: c0, visible: true, hover: false,
				actor: {
					id: `act_${id}`, type, isOwner: disp === 1,
					system: { sensor_range: sensorRange, size: offsets.length > 1 ? 2 : 1 },
					testUserPermission: (_u, perm) => !!(extra.observer && perm === "OBSERVER"),
				},
				document: {
					id, disposition: disp, hidden: !!extra.hidden, width: offsets.length > 1 ? 2 : 1,
					getOccupiedGridSpaceOffsets: () => offsets,
				},
				...extra.tokProps,
			};
			tok.document.object = tok;
			return tok;
		};

		// 1. 六角格有向半边抵消几何：Size 1 感应 1（7 格、18 条外边界，无内部拼接线）与感应 2（19 格、30 条外边界）及缓存复用
		const s1R1 = mkSensorTok("m_r1", "mech", 1, [{ i: 3, j: 3 }]);
		const gR1 = L.computeSensorGeometry(s1R1, hexGrid);
		ok(gR1 && gR1.mode === "grid" && gR1.cellsCount === 7 && gR1.loops.length === 1 && gR1.loops[0].length === 18, `六角格 Size 1 感应 1 应精确覆盖 7 格并消去内部公共边合成单条 18 顶点闭合外轮廓（实际 ${gR1?.cellsCount} 格 / ${gR1?.loops?.[0]?.length} 顶点）`);

		const s1R2 = mkSensorTok("m_r2", "mech", 2, [{ i: 3, j: 3 }]);
		const gR2 = L.computeSensorGeometry(s1R2, hexGrid);
		const gR2Cached = L.computeSensorGeometry(s1R2, hexGrid);
		ok(gR2 && gR2.cellsCount === 19 && gR2.loops.length === 1 && gR2.loops[0].length === 30 && gR2 === gR2Cached, "六角格 Size 1 感应 2 精确覆盖 19 格、合成 30 顶点外轮廓且命中几何缓存");

		// 2. 多格大型机甲：标准 Size 2 品字形三角占地（3 格两两邻接）感应 1 覆盖 12 格 / 24 顶点，凹折形占地覆盖 13 格 / 26 顶点，均无内部拼接边
		const s2Tri = mkSensorTok("m_s2", "mech", 1, [{ i: 3, j: 3 }, { i: 4, j: 4 }, { i: 3, j: 4 }]);
		const gS2Tri = L.computeSensorGeometry(s2Tri, hexGrid);
		ok(gS2Tri && gS2Tri.cellsCount === 12 && gS2Tri.loops.length === 1 && gS2Tri.loops[0].length === 24, `六角格标准 Size 2 三角占地感应 1 应覆盖 12 格并合成 24 顶点外轮廓（实际 ${gS2Tri?.cellsCount} 格 / ${gS2Tri?.loops?.[0]?.length} 顶点）`);
		const s2Bent = mkSensorTok("m_s2b", "mech", 1, [{ i: 3, j: 3 }, { i: 4, j: 3 }, { i: 3, j: 4 }]);
		const gS2Bent = L.computeSensorGeometry(s2Bent, hexGrid);
		ok(gS2Bent && gS2Bent.cellsCount === 13 && gS2Bent.loops.length === 1 && gS2Bent.loops[0].length === 26, "凹折多格占地同样准确消去全部内部公共边合成单条闭合外轮廓");

		// 3. 方格与无网格（Gridless）场景兼容
		const sqGrid = {
			type: 1, size: 100, distance: 1, isGridless: false,
			getCenterPoint: ({ i, j }) => ({ x: j * 100 + 50, y: i * 100 + 50 }),
			getOffset: ({ x, y }) => ({ i: Math.floor(y / 100), j: Math.floor(x / 100) }),
			getVertices: ({ i, j }) => [
				{ x: j * 100, y: i * 100 }, { x: (j + 1) * 100, y: i * 100 },
				{ x: (j + 1) * 100, y: (i + 1) * 100 }, { x: j * 100, y: (i + 1) * 100 },
			],
			measurePath: ([a, b]) => ({ spaces: Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) / 100 }),
		};
		const gSq = L.computeSensorGeometry(s1R1, sqGrid);
		ok(gSq && gSq.cellsCount === 9 && gSq.loops.length === 1 && gSq.loops[0].length === 12, "方格场景 Size 1 感应 1 覆盖 3×3=9 格并合成 12 段外轮廓");

		const gridless = { type: 0, size: 100, distance: 1, isGridless: true };
		const gGridless = L.computeSensorGeometry(mkSensorTok("m_gl", "mech", 8, [{ i: 0, j: 0 }, { i: 1, j: 0 }]), gridless);
		ok(gGridless && gGridless.mode === "gridless" && gGridless.radius === 900, "无网格场景 Size 2（半径 100px）感应 8 回退为半径 900px 的圆形雷达范围");

		// 4. 角色类型过滤（排除步战驾驶员与部署物）与扫描前敌方隐私保护
		const pilotTok = mkSensorTok("p1", "pilot", 5, [{ i: 1, j: 1 }], 1);
		const depTok = mkSensorTok("d1", "deployable", 5, [{ i: 1, j: 2 }], 1);
		const enemyNpc = mkSensorTok("n_foe", "npc", 10, [{ i: 6, j: 6 }], -1);
		const scannedNpc = mkSensorTok("n_scan", "npc", 8, [{ i: 6, j: 7 }], -1, { observer: true });
		const hiddenNpc = mkSensorTok("n_hid", "npc", 8, [{ i: 6, j: 8 }], -1, { hidden: true });
		ok(L.tokenSensorRange(pilotTok) === 0 && L.tokenSensorRange(depTok) === 0 && !L.canShowSensorForToken(pilotTok), "步战驾驶员（即使系统内部默认 sensor_range=5）与部署物不显示机甲感应圈");

		ctx.game.user.isGM = false;
		log.settingValues["lancer-cn.sensorHoverOverlay"] = true;
		log.settingValues["lancer-cn.sensorHoverScope"] = "friendly";
		ok(L.canShowSensorForToken(s1R2) === true && L.canShowSensorForToken(enemyNpc) === false && L.canShowSensorForToken(scannedNpc) === true && L.canShowSensorForToken(hiddenNpc) === false, "非 GM 玩家默认可看己方/友方与已获观察权限（如已扫描）的 NPC，不泄露未扫描或隐藏敌方 NPC 感应");
		log.settingValues["lancer-cn.sensorHoverScope"] = "all";
		ok(L.canShowSensorForToken(enemyNpc) === true && L.canShowSensorForToken(hiddenNpc) === false, "世界设置改为全场公开时玩家可看可见敌方 NPC，但仍不显示隐藏指示物");
		log.settingValues["lancer-cn.sensorHoverScope"] = "friendly";
		ctx.game.user.isGM = true;
		ok(L.canShowSensorForToken(enemyNpc) === true && L.canShowSensorForToken(hiddenNpc) === true, "GM 始终可查看场上全部机甲与敌方/隐藏 NPC 的感应圈");

		// 5. PIXI v7 画布渲染、防抢指针（eventMode="none"）、悬停切换、移开立消、动态更新与销毁清理
		class MockGraphics {
			constructor() {
				this.ops = [];
				this.visible = false;
				this.destroyed = false;
				this.parent = null;
			}
			clear() { this.ops.push(["clear"]); }
			lineStyle(w, c, a) { this.ops.push(["lineStyle", w, c, a]); }
			beginFill(c, a) { this.ops.push(["beginFill", c, a]); }
			endFill() { this.ops.push(["endFill"]); }
			drawPolygon(pts) { this.ops.push(["drawPolygon", pts.length]); }
			drawCircle(x, y, r) { this.ops.push(["drawCircle", x, y, r]); }
			destroy() { this.destroyed = true; this.ops.push(["destroy"]); }
		}
		ctx.PIXI = { Graphics: MockGraphics };
		const gridLayer = {
			children: [],
			destroyed: false,
			addChild(ch) { ch.parent = this; if (!this.children.includes(ch)) this.children.push(ch); },
			removeChild(ch) { const idx = this.children.indexOf(ch); if (idx >= 0) this.children.splice(idx, 1); ch.parent = null; },
		};
		const prevCanvas = ctx.canvas;
		ctx.canvas = {
			scene: { id: "sc_sensor" },
			grid: hexGrid,
			interface: { grid: gridLayer },
			tokens: { placeables: [s1R2, enemyNpc, pilotTok], get: id => [s1R2, enemyNpc, pilotTok].find(t => t.id === id) },
		};

		s1R2.hover = true;
		hooks.hoverToken(s1R2, true);
		const st1 = L.sensorOverlayState();
		ok(st1.token === s1R2 && st1.graphics && st1.graphics.visible === true && st1.graphics.parent === gridLayer, "鼠标悬停机甲时在 canvas.interface.grid 层挂载并显示感应雷达圈");
		ok(st1.graphics.eventMode === "none" && st1.graphics.interactive === false && st1.graphics.interactiveChildren === false, "感应层设置 eventMode='none' 防止遮挡画布指针导致悬停闪烁");
		ok(
			st1.graphics.ops.some(o => o[0] === "beginFill" && o[1] === L.SENSOR_COLORS.friendly && o[2] === 0.075) &&
			st1.graphics.ops.some(o => o[0] === "lineStyle" && o[1] === 6 && o[2] === L.SENSOR_COLORS.friendly) &&
			st1.graphics.ops.some(o => o[0] === "lineStyle" && o[1] === 2.2 && o[2] === L.SENSOR_COLORS.friendly) &&
			st1.graphics.ops.filter(o => o[0] === "drawPolygon" && o[1] === 60).length === 3,
			"渲染包含极淡闭合底色（alpha 0.075）+ 外轮廓雷达晕光 + 外轮廓清晰雷达线三道同心多边形绘制"
		);

		// 重复 refreshToken（位置/感应未变）不重复重绘 PIXI
		const opsBeforeRefresh = st1.graphics.ops.length;
		hooks.refreshToken(s1R2);
		ok(st1.graphics.ops.length === opsBeforeRefresh, "指示物网格与感应未变时 refreshToken 命中渲染缓存，不重复重绘 PIXI");

		// 叠放指示物平滑切换：先进入敌方 NPC，再收到原机甲 hoverOut，应保持显示敌方橙红雷达圈
		enemyNpc.hover = true;
		hooks.hoverToken(enemyNpc, true);
		s1R2.hover = false;
		hooks.hoverToken(s1R2, false);
		ok(L.sensorOverlayState().token === enemyNpc && st1.graphics.visible === true && st1.graphics.ops.some(o => o[0] === "beginFill" && o[1] === L.SENSOR_COLORS.hostile), "相邻指示物悬停切换时保持新目标雷达圈并按敌我阵营切换配色");

		// 鼠标移开即刻消失
		enemyNpc.hover = false;
		hooks.hoverToken(enemyNpc, false);
		ok(L.sensorOverlayState().token === null && st1.graphics.visible === false, "鼠标移开指示物后感应雷达圈立即隐藏消失");

		// 动态更新角色 sensor_range、开关设置与删除指示物 / 切换场景销毁
		s1R2.hover = true;
		hooks.hoverToken(s1R2, true);
		s1R2.actor.system.sensor_range = 1;
		await hooks.updateActor(s1R2.actor, { system: { sensor_range: 1 } }, {}, "u1");
		ok(st1.graphics.visible === true && st1.graphics.ops.at(-1)?.[0] === "drawPolygon" && st1.graphics.ops.at(-1)?.[1] === 36, "角色感应范围变化时实时重算并刷新外轮廓（18 顶点 = 36 坐标值）");

		log.settingValues["lancer-cn.sensorHoverOverlay"] = false;
		sHover.onChange();
		ok(st1.graphics.visible === false && L.sensorOverlayState().token === null, "关闭客户端开关时立即隐藏当前悬停雷达圈");
		log.settingValues["lancer-cn.sensorHoverOverlay"] = true;

		hooks.hoverToken(s1R2, true);
		hooks.deleteToken(s1R2.document);
		ok(st1.graphics.visible === false && L.sensorOverlayState().token === null, "删除正悬停的指示物时立即清除雷达圈");

		hooks.hoverToken(s1R2, true);
		const gRef = L.sensorOverlayState().graphics;
		hooks.canvasTearDown();
		ok(gRef.destroyed === true && gridLayer.children.length === 0 && L.sensorOverlayState().graphics === null, "切换或卸载场景（canvasTearDown）时彻底销毁 PIXI 对象并清空引用");
		ctx.canvas = prevCanvas;
	}

	// ---- v1.15.3 回归测试：结构/过热/稳住阵脚聊天卡状态引用归一化与 AI 崩溃检定修复
	{
		// 1. preCreateChatMessage 将旧式 @Compendium[world.status-items.Exposed/Impaired] 与无标签 @LancerID[...] 归一化为中文 @LancerID[lid]{中文名}
		let patchedMsg = null;
		const fakeMsg = {
			content: `<div class="effect-text">你的机甲@Compendium[world.status-items.Exposed]，但它@Compendium[world.status-items.Impaired]，且@LancerID[stunned]直到下一回合结束。</div>`,
			flags: {},
			updateSource(d) { patchedMsg = d; },
		};
		ctx.game.i18n = { lang: "cn" };
		hooks.preCreateChatMessage(fakeMsg);
		ok(
			patchedMsg?.content === `<div class="effect-text">你的机甲@LancerID[exposed]{暴露}，但它@LancerID[impaired]{受损}，且@LancerID[stunned]{晕眩}直到下一回合结束。</div>`,
			`结构/过热/稳住阵脚卡应把旧式 @Compendium 状态与裸 @LancerID 归一化为中文标签：实际 ${patchedMsg?.content}`,
		);

		// 2. 崩溃检定（CascadeFlow）：排除 tg_no_cascade 与已摧毁/已崩溃物品；掷出 2–20 时不写入 cascading=true，仅掷出 1 时写入
		const stepsMap = ctx.game.lancer?.flowSteps;
		if (stepsMap?.set && stepsMap?.get) {
			let cascadeUpdates = [];
			stepsMap.set("initCascadeData", async state => {
				state.data.ai_systems.push("ai_normal", "ai_no_cascade", "ai_destroyed", "ai_already");
				return true;
			});
			stepsMap.set("cascadeUpdateItems", async state => {
				cascadeUpdates = state.data.ai_systems.slice();
				return true;
			});
			let burnNormalRolled = false;
			stepsMap.set("rollNormalDamage", async () => { burnNormalRolled = true; return true; });
			stepsMap.set("checkBurnResult", async state => {
				if (!state.data.check_total) throw new TypeError("Burn check hasn't been rolled yet!");
				return true;
			});
			// 重新触发包装在上面新建的原生步骤上
			const L2 = ctx.LancerCN;
			void L2;
			// 直接通过新的子沙盒调用 ready 以包裹新增的 flowSteps
			const cascItems = [
				{ id: "ai_normal", system: { destroyed: false, cascading: false, tags: [{ lid: "tg_ai" }] } },
				{ id: "ai_no_cascade", system: { destroyed: false, cascading: false, tags: [{ lid: "tg_ai" }, { lid: "tg_no_cascade", is_cascaderesistant: true }] } },
				{ id: "ai_destroyed", system: { destroyed: true, cascading: false, tags: [{ lid: "tg_ai" }] } },
				{ id: "ai_already", system: { destroyed: false, cascading: true, tags: [{ lid: "tg_ai" }] } },
			];
			cascItems.get = id => cascItems.find(x => x.id === id);
			// 若 patchLancerFlows 已在 ready 时运行过，检查是否已包裹或模拟新注册后包裹
			if (!stepsMap.get("cascadeUpdateItems").lancerCnWrapped) {
				// 创建独立 flowSteps Map 并在新实例验证
				const h2 = runHooks();
				const sm2 = new Map([
					["initCascadeData", async state => { state.data.ai_systems.push("ai_normal", "ai_no_cascade", "ai_destroyed", "ai_already"); return true; }],
					["cascadeUpdateItems", async state => { cascadeUpdates = state.data.ai_systems.slice(); return true; }],
					["rollNormalDamage", async () => { burnNormalRolled = true; return true; }],
					["checkBurnResult", async state => { if (!state.data.check_total) throw new TypeError("Burn check hasn't been rolled yet!"); return true; }],
				]);
				ctx.game = { system: { id: "lancer" }, user: { id: "u1" }, lancer: { flowSteps: sm2 }, settings: { get: () => true } };
				h2["once:ready"]();
				const stInit = { actor: { items: cascItems }, data: { ai_systems: [] } };
				const initOk = await sm2.get("initCascadeData")(stInit);
				ok(initOk === true && JSON.stringify(stInit.data.ai_systems) === JSON.stringify(["ai_normal"]), `initCascadeData 应剔除防崩溃（tg_no_cascade）、已摧毁与已崩溃的 AI：实际 ${JSON.stringify(stInit.data.ai_systems)}`);

				cascadeUpdates = [];
				await sm2.get("cascadeUpdateItems")({ actor: { items: cascItems }, data: { ai_systems: ["ai_normal"], result: { roll: { total: 14 } } } });
				ok(cascadeUpdates.length === 0, "崩溃检定掷出 2–20（如 14）通过时绝不应把 AI 标记为已崩溃");

				await sm2.get("cascadeUpdateItems")({ actor: { items: cascItems }, data: { ai_systems: ["ai_normal"], result: { roll: { total: 1 } } } });
				ok(JSON.stringify(cascadeUpdates) === JSON.stringify(["ai_normal"]), "崩溃检定掷出 1 时应正常将对应 AI 标记为已崩溃");

				burnNormalRolled = false;
				const burnZeroOk = await sm2.get("checkBurnResult")({ data: { check_total: 0 } });
				ok(burnZeroOk === true && burnNormalRolled === true, "燃烧工程检定总计恰好为 0 时不应抛错崩溃，应正常进入燃烧伤害掷骰");
			}
		}
	}

	// ---- v1.16.0 全面审计增补测试：6 项底层修复 + 机甲被动特征 + 回合初/末生命周期 + 低等兵/NPC 模板/职业被动 + 核心奖励 + NPC 无人机部署
	{
		const L = ctx.LancerCN;
		const v116Cards = [];
		const prevChatMsg116 = ctx.ChatMessage;
		ctx.ChatMessage = {
			getSpeaker: o => ({ actor: o?.actor?.name }),
			create: async d => { v116Cards.push(d); return d; },
		};
		const mkFlagActor = (type, init = {}) => {
			const flags = { "lancer-cn": { ...(init.flags ?? {}) } };
			const statuses = new Set(init.statuses ?? []);
			const items = [...(init.items ?? [])];
			items.get = id => items.find(x => x.id === id);
			const actor = {
				id: init.id || `act_${Math.random().toString(36).slice(2, 8)}`,
				uuid: init.uuid || `Actor.${init.id || Math.random().toString(36).slice(2, 8)}`,
				name: init.name || "测试角色",
				type,
				isOwner: init.isOwner !== false,
				statuses,
				flags,
				items,
				itemTypes: init.itemTypes ?? {},
				is_mech: () => type === "mech",
				is_npc: () => type === "npc",
				is_pilot: () => type === "pilot",
				is_deployable: () => type === "deployable",
				system: {
					hp: { value: 12, max: 12, ...(init.hp ?? {}) },
					overshield: { value: 0, ...(init.overshield ?? {}) },
					heat: { value: 0, max: 6, ...(init.heat ?? {}) },
					burn: init.burn ?? 0,
					armor: init.armor ?? 0,
					structure: { value: 4, max: 4, ...(init.structure ?? {}) },
					stress: { value: 4, max: 4, ...(init.stress ?? {}) },
					tier: init.tier ?? 1,
					save: init.save ?? 11,
					sensor_range: init.sensor_range ?? 10,
					grit: init.grit ?? 2,
					resistances: { ...(init.resistances ?? {}) },
					statuses: Object.fromEntries([...statuses].map(s => [s, true])),
					loadout: init.frameLid
						? { frame: { value: { type: "frame", system: { lid: init.frameLid, counters: init.frameCounters ?? [] }, update: async p => { if (p["system.counters"]) actor.system.loadout.frame.value.system.counters = p["system.counters"]; } } } }
						: (init.loadout ?? {}),
					pilot: init.pilot ? { value: init.pilot } : undefined,
				},
				getFlag(scope, key) {
					return key.split(".").reduce((o, k) => o?.[k], flags[scope]);
				},
				async setFlag(scope, key, val) {
					flags[scope] = flags[scope] ?? {};
					flags[scope][key] = val;
				},
				async unsetFlag(scope, key) {
					if (flags[scope]) delete flags[scope][key];
				},
				async toggleStatusEffect(id, opts) {
					const active = opts?.active !== undefined ? Boolean(opts.active) : !statuses.has(id);
					if (active) statuses.add(id);
					else statuses.delete(id);
					actor.system.statuses[id] = active;
				},
				async update(patch) {
					for (const [k, v] of Object.entries(patch ?? {})) {
						if (k === "system" && v && typeof v === "object") {
							for (const [sk, sv] of Object.entries(v)) {
								const parts = sk.split(".");
								let cur = actor.system;
								for (let i = 0; i < parts.length - 1; i++) cur = (cur[parts[i]] = cur[parts[i]] ?? {});
								cur[parts[parts.length - 1]] = sv;
							}
						} else if (k.startsWith("system.")) {
							const parts = k.slice(7).split(".");
							let cur = actor.system;
							for (let i = 0; i < parts.length - 1; i++) cur = (cur[parts[i]] = cur[parts[i]] ?? {});
							cur[parts[parts.length - 1]] = v;
						}
					}
				},
				async updateEmbeddedDocuments(_type, updates) {
					for (const u of updates ?? []) {
						const it = items.find(x => x.id === u._id);
						if (it && u["system.loaded"] !== undefined) it.system.loaded = u["system.loaded"];
						if (it && u["system.charged"] !== undefined) it.system.charged = u["system.charged"];
						if (it && u["system.destroyed"] !== undefined) it.system.destroyed = u["system.destroyed"];
					}
				},
			};
			return actor;
		};

		// 1. Bugfix ①：扩展骨架 CP_PROFILES ID 对齐（网斗士 / 沃登 / 提索纳）
		ok(Boolean(L.CP_PROFILES.mf_ch_retiarius && L.CP_PROFILES.mf_ext_wodeng && L.CP_PROFILES.mf_kkca_tizona), "扩展骨架 mf_ch_retiarius / mf_ext_wodeng / mf_kkca_tizona 均已对齐 CP_PROFILES");

		// 2. Bugfix ③：extractBalancedClassBlocks 支持嵌套多段 <div> 不提前截断
		const nestedHtml = `<div class="card"><div class="lancer-body"><div class="effect-text"><p><b>触发</b></p><p>目标进入射程</p><div class="sub-box"><p>子区块造成 4 爆炸伤害并必须通过敏捷豁免，否则伏卧。</p></div></div></div></div>`;
		const blocks = L.extractBalancedClassBlocks(nestedHtml, /\beffect-text\b/);
		ok(blocks.length === 1 && blocks[0].includes("4 爆炸伤害") && blocks[0].includes("否则伏卧"), "extractBalancedClassBlocks 完整保留含嵌套 <div> 的卡片正文，不截断后续伤害与豁免");

		// 3. Bugfix ④ & ⑤：豁免减半/检定写法、非攻击加伤/散热排除、受到该武器伤害触发
		const svHalf = L.parseSavesInText("锥形3内的角色受到 6 爆炸伤害，通过敏捷豁免则伤害减半。", { dc: 14 });
		ok(svHalf.length === 1 && svHalf[0].key === "agi" && svHalf[0].halfOnSuccess === true, "识别「通过敏捷豁免则伤害减半」为成功减半");
		const svCheck = L.parseSavesInText("目标必须通过机体检定，否则陷入伏卧并受损。", { dc: 12 });
		ok(svCheck.length === 1 && svCheck[0].key === "hull" && svCheck[0].failStatuses.includes("prone") && svCheck[0].failStatuses.includes("impaired"), "识别「必须通过机体检定，否则...」为机体豁免");
		const svXing = L.parseSavesInText("路径上的角色必须行敏捷豁免，失败则受到固定。", { dc: 13 });
		ok(svXing.length === 1 && svXing[0].key === "agi" && svXing[0].failStatuses.includes("immobilized"), "识别「行敏捷豁免」写法");
		ok(L.parseNonAttackDamage("直到下一回合结束，你的所有攻击造成+3动能伤害，且你冷却 4 热度。") === null, "parseNonAttackDamage 排除被动加伤（「攻击造成+3动能伤害」）与散热（「冷却 4 热度」）误判");
		const seekerCls = L.classifyAttackCard({ system: { effect: "受到该武器伤害的角色自动陷入锁定。" } }, null, 12);
		ok(seekerCls.autoHitStatuses.includes("lockon"), "classifyAttackCard 识别蜂巢寻索云「受到该武器伤害」为命中自动状态");

		// 4. P0 机甲被动特征：燃烧免疫、状态免疫、伤害计算与预览（黑巫/蝎狮/拿破仑受身/为朝燃烧保底 1HP/提索纳双倍甲/哈布斯堡减伤/尼莫伏卧视同离散/灭世成吉思无视燃烧热度抗性）
		const lancaster = mkFlagActor("mech", { frameLid: "mf_lancaster", armor: 1 });
		const sal = mkFlagActor("mech", { frameLid: "mf_saladin", armor: 2 });
		const sag = mkFlagActor("mech", { frameLid: "mf_ch_sagittarius" });
		ok(L.isBurnImmune(lancaster) === true, "兰开斯特对燃烧免疫");
		ok(L.isStatusImmune(sal, "shredded") === true && L.isStatusImmune(sag, "lockon") === true, "萨拉丁免疫离散、射手座免疫锁定");

		const blackWitch = mkFlagActor("mech", { frameLid: "mf_black_witch", armor: 1 });
		const bwPrev = L.previewDamageCalc(blackWitch, { Kinetic: 9, Energy: 0, Explosive: 0, Burn: 0, Heat: 0 });
		ok(bwPrev.hpLoss === 4, `黑巫固有动能抗性：(9 - 1甲)=8 -> 减半为 4，实际 ${bwPrev.hpLoss}`);

		const napoleon = mkFlagActor("mech", { frameLid: "mf_napoleon", armor: 2 });
		await L.setCombatState(napoleon, { bracedActive: true });
		const napPrev = L.previewDamageCalc(napoleon, { Kinetic: 12, Energy: 0, Explosive: 0, Burn: 0, Heat: 3 });
		ok(napPrev.hpLoss === 1 && napPrev.heatGain === 3, `拿破仑受身「重型护盾/闪烁神盾」将普通伤害压至 1（替代常规抗性，热度按原值 3 照常承受），实际 hp=${napPrev.hpLoss}, heat=${napPrev.heatGain}`);

		const tametomo = mkFlagActor("mech", { frameLid: "mf_ext_tametomo", hp: { value: 3, max: 10 }, burn: 6 });
		tametomo.damageCalc = async function (applied, opts) {
			const hpSub = (Number(applied?.Kinetic) || 0) + (Number(applied?.Energy) || 0) + (Number(applied?.Explosive) || 0) + (Number(applied?.Burn) || 0);
			this.system.hp.value = Math.max(0, (Number(this.system.hp.value) || 0) - hpSub);
			if (opts?.addBurn !== false && (Number(applied?.Burn) || 0) > 0) this.system.burn = (Number(this.system.burn) || 0) + Number(applied.Burn);
			if ((Number(applied?.Heat) || 0) > 0) this.system.heat.value = (Number(this.system.heat.value) || 0) + Number(applied.Heat);
		};
		const prevCfgActor = ctx.CONFIG?.Actor;
		ctx.CONFIG = ctx.CONFIG ?? {};
		ctx.CONFIG.Actor = { documentClass: { prototype: tametomo } };
		delete tametomo.damageCalc.lancerCnPatched;
		L.patchTrueblackDamageCalc();
		await tametomo.damageCalc({ Kinetic: 0, Energy: 0, Explosive: 0, Burn: 6, Heat: 0 }, { multiple: 1, addBurn: false, ap: true, paracausal: true, dmgCtx: { isBurnTick: true } });
		ok(tametomo.system.hp.value === 1 && tametomo.system.burn === 6, `为朝「烈焰不灭」燃烧检定伤害应保留至少 1 HP 且不清零燃烧标记：实际 hp=${tametomo.system.hp.value}, burn=${tametomo.system.burn}`);

		const nemoAtk = mkFlagActor("mech", { id: "nemo1", uuid: "Actor.nemo1", frameLid: "mf_ext_nemo" });
		const proneDef = mkFlagActor("npc", { id: "def_p", uuid: "Actor.def_p", armor: 3, statuses: ["prone"], resistances: { kinetic: true } });
		const prevLookup = ctx.fromUuidSync;
		ctx.fromUuidSync = u => (u === "Actor.nemo1" ? nemoAtk : u === "Actor.def_p" ? proneDef : prevLookup?.(u));
		const nemoPrev = L.previewDamageCalc(proneDef, { Kinetic: 6, Energy: 0, Explosive: 0, Burn: 0, Heat: 0 }, { dmgCtx: { attackerUuid: "Actor.nemo1" } });
		ok(nemoPrev.hpLoss === 6, `内莫「憎恨之大天使」攻击伏卧目标应视同离散（无视 3 护甲与动能抗性，打满 6 伤），实际 ${nemoPrev.hpLoss}`);

		const wkGenghis = mkFlagActor("mech", { id: "wkg1", uuid: "Actor.wkg1", frameLid: "mf_genghis_alt_worldkiller_genghis_mk_i" });
		const resistDef = mkFlagActor("npc", { id: "def_r", uuid: "Actor.def_r", statuses: ["resistance_burn", "resistance_heat"] });
		ctx.fromUuidSync = u => (u === "Actor.wkg1" ? wkGenghis : u === "Actor.def_r" ? resistDef : prevLookup?.(u));
		const wkPrev = L.previewDamageCalc(resistDef, { Kinetic: 0, Energy: 0, Explosive: 0, Burn: 6, Heat: 4 }, { dmgCtx: { attackerUuid: "Actor.wkg1", ignoreBurnHeatResist: true } });
		ok(wkPrev.hpLoss === 6 && wkPrev.heatGain === 4, `灭世成吉思汗「TBK 弹药」应无视目标燃烧与热度抗性（6 燃烧 + 4 热度），实际 hp=${wkPrev.hpLoss}, heat=${wkPrev.heatGain}`);
		ctx.fromUuidSync = prevLookup;

		// 5. P0 低等兵（Grunt）模板规则：「贫弱」外部热度即死 + 「无用之人」豁免成功免伤
		const grunt = mkFlagActor("npc", {
			id: "grunt1", uuid: "Actor.grunt1", name: "突击低等兵",
			hp: { value: 1, max: 1 }, structure: { value: 1, max: 1 },
			items: [
				{ type: "npc_feature", name: "无用之人", system: { lid: "npcf_cn_grunt_1" } },
				{ type: "npc_feature", name: "贫弱", system: { lid: "npcf_cn_grunt_2" } },
			],
		});
		ok(L.hasGruntChaff(grunt) === true && L.hasGruntWeak(grunt) === true, "正确识别低等兵「无用之人」与「贫弱」模板特征");
		const prevLookup2 = ctx.fromUuidSync;
		ctx.fromUuidSync = u => (u === "Actor.grunt1" ? grunt : prevLookup2?.(u));
		grunt.damageCalc = tametomo.damageCalc;
		await grunt.damageCalc({ Kinetic: 0, Energy: 0, Explosive: 0, Burn: 0, Heat: 2 }, { multiple: 1, addBurn: true });
		ok(grunt.system.hp.value === 0 && grunt.system.structure.value === 0 && grunt.statuses.has("downandout"), "低等兵承受外部热度时触发「贫弱」立即摧毁并陷入昏迷");
		ctx.fromUuidSync = prevLookup2;

		// 6. P1 老兵「假死」、超体「阿耳戈斯装甲」、老兵「钢爪 / 冲击装甲 / 隔热」、异种「现世挤出物」
		const veteran = mkFlagActor("npc", {
			id: "vet1", uuid: "Actor.vet1", name: "精英老兵",
			armor: 1, hp: { value: 4, max: 14 }, structure: { value: 1, max: 1 },
			items: [
				{ type: "npc_feature", name: "假死", system: { lid: "npcf_cn_veteran_6" } },
				{ type: "npc_feature", name: "隔热", system: { lid: "npcf_cn_veteran_10" } },
				{ type: "npc_feature", name: "冲击装甲", system: { lid: "npcf_cn_veteran_19" } },
				{ type: "npc_feature", name: "钢爪", system: { lid: "npcf_cn_veteran_21" } },
			],
		});
		veteran.damageCalc = tametomo.damageCalc;
		ok(L.isBurnImmune(veteran) === true, "老兵「隔热」对燃烧免疫");
		const auxPrev = L.previewDamageCalc(veteran, { Kinetic: 7, Energy: 0, Explosive: 0, Burn: 0, Heat: 0 }, { dmgCtx: { weaponSize: "Auxiliary" } });
		ok(auxPrev.hpLoss === 1, `老兵「钢爪」受到副武器伤害最多只承受 1 点，实际 ${auxPrev.hpLoss}`);
		const mainPrev = L.previewDamageCalc(veteran, { Kinetic: 9, Energy: 0, Explosive: 0, Burn: 0, Heat: 0 }, { dmgCtx: { weaponSize: "Main" } });
		ok(mainPrev.hpLoss === 4, `老兵「冲击装甲」对主武器伤害有抗性：(9-1甲)=8 -> 4，实际 ${mainPrev.hpLoss}`);
		await veteran.damageCalc({ Kinetic: 10, Energy: 0, Explosive: 0, Burn: 0, Heat: 0 }, { multiple: 1, addBurn: true, ap: true });
		ok(veteran.system.hp.value === 1 && L.getCombatState(veteran).usedFeignDeath === true, `老兵首次被致命击毁时触发「假死」保留 1 HP，实际 hp=${veteran.system.hp.value}`);
		if (prevCfgActor) ctx.CONFIG.Actor = prevCfgActor;

		const ultra = mkFlagActor("npc", {
			id: "ult1", uuid: "Actor.ult1", name: "重装超体", tier: 2, armor: 6,
			items: [
				{ type: "npc_feature", name: "阿耳戈斯装甲", system: { lid: "npcf_cn_ultra_18" } },
				{ type: "npc_feature", name: "额外致命", system: { lid: "npcf_cn_ultra_21" } },
				{ type: "npc_feature", name: "致命", system: { lid: "npcf_cn_ultra_3" } },
			],
		});
		await L.applyUltraArgusArmorLoss(ultra);
		ok(ultra.system.armor === 4, `超体「阿耳戈斯装甲」触发结构/过热检定后损失 2 点护甲（6->4），实际 ${ultra.system.armor}`);
		ok(L.countNpcDeadlyDice(ultra) === 3, "T2 超体首次会心计入致命(+1d6) + 额外致命(+2d6) = 3d6");
		await L.setCombatState(ultra, { usedUltraExtraDeadly: true });
		ok(L.countNpcDeadlyDice(ultra) === 1, "超体「额外致命」本回合已触发后不再重复叠加，仅保留普通「致命」1d6");

		const exotic = mkFlagActor("npc", {
			id: "exo1", uuid: "Actor.exo1", name: "异种体",
			items: [{ type: "npc_feature", name: "现世挤出物", system: { lid: "npcf_cn_exotic_6" } }],
		});
		const exoPrev = L.previewDamageCalc(exotic, { Kinetic: 7, Energy: 0, Explosive: 0, Burn: 0, Heat: 0 });
		ok(exoPrev.hpLoss === 4, `异种「现世挤出物」对所有伤害拥有抗性（ceil(7/2)=4），实际 ${exoPrev.hpLoss}`);

		// 7. Bugfix ② & ⑥ + Flow 集成测试：NPC Main Melee 攻击类型修正、NPC tier_override 可靠标签、特战「致命精度」、戈尔贡「转移性麻痹」、机甲 HASE 检定修正、自动灭火器
		{
			const smFlow = new Map([
				["initAttackData", async state => {
					state.data.attack_type = "Ranged"; // 模拟原生把 "Main Melee" 误判为 Ranged
					state.data.acc_diff = {
						weapon: { melee: false, thrown: false, engaged: true, seeking: false, plugins: {} },
						base: { accuracy: 0, difficulty: 0 },
						targets: [],
					};
					return true;
				}],
				["setDamageTags", async state => {
					const rel = (state.item?.system?.tags ?? []).find(t => t.is_reliable);
					if (rel) {
						state.data.reliable = true;
						state.data.reliable_val = parseInt(rel.tierVal(state.actor.system.tier), 10) || 0;
					}
					return true;
				}],
				["rollAttacks", async () => true],
				["rollCritDamage", async () => true],
				["rollBurnCheck", async state => { state.data.check_total = 4; return true; }],
				["initStatRollData", async () => true],
			]);
			const prevGame = ctx.game;
			const prevRollFlow = ctx.Roll;
			ctx.Roll = class {
				constructor(f) { this.formula = String(f ?? ""); }
				async evaluate() { this.total = Number(this.formula) || 4; return this; }
				async getTooltip() { return ""; }
			};
			ctx.game = {
				...prevGame,
				system: { id: "lancer" },
				user: { id: "u1", targets: new Set() },
				users: { activeGM: { isSelf: true } },
				lancer: { flowSteps: smFlow },
				settings: { get: () => true },
			};
			L.patchLancerFlows();

			// NPC "Main Melee" 修正
			const npcBerserker = mkFlagActor("npc", { tier: 2 });
			const npcAxe = { type: "npc_feature", name: "链锯巨斧", system: { type: "Weapon", weapon_type: "Heavy Melee", range: [{ type: "Threat", val: 1 }], tags: [] } };
			const atkState = { actor: npcBerserker, item: npcAxe, data: {} };
			await smFlow.get("initAttackData")(atkState, {});
			ok(atkState.data.attack_type === "Melee" && atkState.data.acc_diff.weapon.melee === true && atkState.data.acc_diff.weapon.engaged === false, "NPC Heavy/Main Melee 武器应被修正为近战（attack_type=Melee、melee=true、忽略交战惩罚）");

			// NPC 武器 tier_override 对齐 tg_reliable
			const npcT1 = mkFlagActor("npc", { tier: 1 });
			const npcRelWpn = {
				type: "npc_feature",
				system: {
					type: "Weapon",
					tier_override: 3,
					tags: [{ lid: "tg_reliable", is_reliable: true, tierVal: t => [2, 3, 5][t - 1] }],
				},
			};
			const dmgTagState = { actor: npcT1, item: npcRelWpn, data: { tags: [] } };
			await smFlow.get("setDamageTags")(dmgTagState, {});
			ok(dmgTagState.data.reliable_val === 5 && npcT1.system.tier === 1, `NPC 武器 tier_override=3 时可靠标签应取 T3 数值 5 且无损还原 NPC 原层级 1：实际 rel=${dmgTagState.data.reliable_val}, tier=${npcT1.system.tier}`);

			// 特战队员「致命精度」会心固定加伤 (+2/+3/+3)
			const specOp = mkFlagActor("npc", {
				tier: 2,
				items: [{ type: "npc_feature", name: "致命精度", system: { lid: "npcf_deadly_precision_spec_op" } }],
			});
			const critState = {
				actor: specOp,
				data: {
					has_crit_hit: true,
					damage: [{ type: "Kinetic", val: "4" }],
					crit_damage_results: [{ d_type: "Kinetic", roll: { total: 4 } }],
					damage_hud_data: { targets: [{ targetUuid: "Token.p1" }] },
					targets: [{ target: { uuid: "Token.p1" }, crit: true, half_damage: false, damage: [{ type: "Kinetic", amount: 4 }] }],
				},
			};
			await smFlow.get("rollCritDamage")(critState, {});
			const specSum = critState.data.targets[0].damage.reduce((n, d) => n + d.amount, 0);
			ok(specSum === 7, `T2 特战队员「致命精度」会心应在 4 伤基础上追加 +3 固定伤害（合计 7），实际 ${specSum}`);

			// 戈尔贡「转移性麻痹」：天然 1–2 自动失手并令攻击者晕眩
			const gorgon = mkFlagActor("mech", { id: "gorg1", uuid: "Actor.gorg1", frameLid: "mf_gorgon" });
			const attackerNpc = mkFlagActor("npc", { id: "atk1", uuid: "Actor.atk1", name: "突击兵" });
			const prevLookup3 = ctx.fromUuidSync;
			ctx.fromUuidSync = u => (u === "Actor.atk1" ? attackerNpc : u === "Actor.gorg1" ? gorgon : prevLookup3?.(u));
			const gorgonRollState = {
				actor: attackerNpc,
				data: {
					attack_type: "Ranged",
					has_normal_hit: true,
					has_crit_hit: false,
					attack_results: [{ roll: { terms: [{ faces: 20, results: [{ result: 2, active: true }] }] } }],
					hit_results: [{ target: { actor: gorgon, uuid: "Actor.gorg1" }, total: 12, hit: true, crit: false }],
				},
			};
			await smFlow.get("rollAttacks")(gorgonRollState, {});
			ok(gorgonRollState.data.hit_results[0].hit === false && gorgonRollState.data.has_normal_hit === false && attackerNpc.statuses.has("stunned"), "攻击戈尔贡掷出天然 1–2 时自动失手，且攻击者立即陷入晕眩");
			ctx.fromUuidSync = prevLookup3;

			// 骨架 HASE 检定修正（暮翼机体 +1 难度、谢尔曼工程 +1 准度）
			const duskWing = mkFlagActor("mech", { frameLid: "mf_dusk_wing" });
			const dwHullState = { actor: duskWing, data: { path: "system.hull", title: "机体豁免", acc_diff: { base: { accuracy: 0, difficulty: 0 } } } };
			await smFlow.get("initStatRollData")(dwHullState, {});
			ok(dwHullState.data.acc_diff.base.difficulty === 1, "暮翼机体检定与豁免自动预填 +1 难度");

			const sherman = mkFlagActor("mech", { frameLid: "mf_sherman" });
			const shEngState = { actor: sherman, data: { path: "system.eng", title: "工程检定", acc_diff: { base: { accuracy: 0, difficulty: 0 } } } };
			await smFlow.get("initStatRollData")(shEngState, {});
			ok(shEngState.data.acc_diff.base.accuracy === 1, "谢尔曼工程检定与豁免自动预填 +1 准度");

			// 核心奖励「自动灭火器」：BurnFlow 自动通过检定（check_total = 20）
			const extPilot = mkFlagActor("pilot", { items: [{ type: "core_bonus", system: { lid: "cb_ch_extinguisher" } }] });
			const extMech = mkFlagActor("mech", { pilot: extPilot, burn: 5 });
			const burnSt = { actor: extMech, data: {} };
			await smFlow.get("rollBurnCheck")(burnSt, {});
			ok(burnSt.data.check_total === 20, "具备「自动灭火器」的机甲进行燃烧检定时自动以 20 通过");

			ctx.Roll = prevRollFlow;
			ctx.game = prevGame;
		}

		// 8. P0/P2 回合初/末生命周期：NPC 充能提示与一键掷骰、雷利「全金属外壳」自动装填、炎魔「再生」、鬼影织物隐形维持与萨加玛塔「英雄本色」受身免罚
		{
			const raleigh = mkFlagActor("mech", {
				id: "ral1", uuid: "Actor.ral1", name: "雷利号", frameLid: "mf_raleigh",
				items: [{ id: "w_hand_cannon", type: "mech_weapon", name: "手炮", system: { loaded: false, tags: [{ lid: "tg_loading", is_loading: true }] } }],
			});
			const balor = mkFlagActor("mech", {
				id: "bal1", uuid: "Actor.bal1", name: "炎魔号", frameLid: "mf_balor",
				hp: { value: 6, max: 20 },
			});
			const rechargeItem = {
				id: "npcf_rc1", type: "npc_feature", name: "散射地雷",
				system: { charged: false, destroyed: false, tags: [{ lid: "tg_recharge", is_recharge: true, val: "4" }] },
				async update(p) { if (p["system.charged"] !== undefined) rechargeItem.system.charged = p["system.charged"]; },
			};
			const rechargeNpc = mkFlagActor("npc", {
				id: "npc_rc", uuid: "Actor.npc_rc", name: "播种者", tier: 2,
				items: [rechargeItem],
			});
			const prevUsers = ctx.game.users;
			ctx.game.users = { activeGM: { isSelf: true } };
			const mockCombat = {
				round: 2,
				previous: { combatantId: "c_ral" },
				current: { combatantId: "c_bal" },
				combatants: [
					{ id: "c_ral", name: "雷利号", actor: raleigh, token: { uuid: "Actor.ral1" } },
					{ id: "c_bal", name: "炎魔号", actor: balor, token: { uuid: "Actor.bal1" } },
					{ id: "c_npc", name: "播种者", actor: rechargeNpc, token: { uuid: "Actor.npc_rc" } },
				],
			};
			await L.onUpdateCombatTurnEnd(mockCombat, { turn: 1 }, { direction: 1 });
			ok(raleigh.items[0].system.loaded === true, "雷利回合结束未攻击时触发「全金属外壳」自动装填全部装填武器");

			mockCombat.previous = { combatantId: "c_bal" };
			mockCombat.current = { combatantId: "c_npc" };
			await L.onUpdateCombatTurnEnd(mockCombat, { turn: 2 }, { direction: 1 });
			ok(balor.system.hp.value === 11, `炎魔回合结束触发「再生」回复 1/4 最大 HP（6 + 5 = 11），实际 ${balor.system.hp.value}`);
			const rcMsg = v116Cards.find(m => m.flags?.["lancer-cn"]?.npcRechargePrompt);
			ok(Boolean(rcMsg), "NPC 回合开始存在未充能特性时自动发出「NPC 充能检定」提醒卡");
			if (rcMsg) {
				rcMsg.isAuthor = true;
				rcMsg.getFlag = (s, k) => rcMsg.flags?.[s]?.[k];
				rcMsg.setFlag = async (s, k, v) => { rcMsg.flags[s] = rcMsg.flags[s] ?? {}; rcMsg.flags[s][k] = v; };
				const prevLookup4 = ctx.fromUuidSync;
				const prevRoll = ctx.Roll;
				ctx.fromUuidSync = u => (u === "Actor.npc_rc" ? rechargeNpc : prevLookup4?.(u));
				ctx.Roll = class { async evaluate() { this.total = 6; return this; } };
				await L.executeNpcRechargePrompt(rcMsg);
				ctx.Roll = prevRoll;
				ctx.fromUuidSync = prevLookup4;
				ok(rechargeItem.system.charged === true && rcMsg.flags["lancer-cn"].npcRechargePrompt.rolled === true, "点击 NPC 充能检定按钮掷出达标值后自动将特性标记为已充能");
			}
			ctx.game.users = prevUsers;

			// 萨加玛塔「英雄本色」：1/场景受身不设 braced 惩罚标记
			const sagarmatha = mkFlagActor("mech", { frameLid: "mf_sagarmatha" });
			await L.beginBasicAction(sagarmatha, "brace");
			ok(!sagarmatha.getFlag("lancer-cn", "braced") && L.getCombatState(sagarmatha).usedSagarmathaHeroism === true, "萨加玛塔首次受身触发「英雄本色」，不挂下回合行动受限 braced 标记");
			await L.beginBasicAction(sagarmatha, "brace");
			ok(sagarmatha.getFlag("lancer-cn", "braced") === true, "萨加玛塔同场景第二次受身正常挂上 braced 标记");

			// 吉尔伽美什「军备骰」：初始为 6，降至 1 时显示重掷按钮并可一键重置为 6
			const gilgamesh = mkFlagActor("mech", { frameLid: "mf_gilgamesh" });
			ok(L.getTalentDie(gilgamesh, "gilgamesh") === 6, "吉尔伽美什初始军备骰为 6");
			await L.setTalentDie(gilgamesh, "gilgamesh", 1);
			const gilBar = L.renderTalentControlHTML(gilgamesh);
			ok(gilBar.includes("军备骰") && gilBar.includes("gilgameshReroll"), "吉尔伽美什军备骰为 1 时战术栏渲染「军备重掷（重置→6）」按钮");
			await L.executeTalentSheetAction(gilgamesh, "gilgameshReroll");
			ok(L.getTalentDie(gilgamesh, "gilgamesh") === 6, "执行军备重掷后军备骰重置回 6");
		}

		// 9. P2 NPC 无人机 / 地雷属性解析与一键生成部署指示物
		{
			const hiveNpc = mkFlagActor("npc", { id: "hive1", uuid: "Actor.hive1", name: "蜂巢统领", tier: 2 });
			const turretItem = {
				type: "npc_feature",
				name: "炮塔无人机",
				system: {
					lid: "npcf_turret_drone",
					type: "System",
					tags: [{ lid: "tg_drone", is_drone: true }],
					effect: "部署一个炮塔无人机（大小1/2，HP 5/8/10，回避10，电子防御10，护甲0）。",
				},
			};
			const spec = L.parseNpcDeployableSpec(turretItem, turretItem.system.effect, hiveNpc);
			ok(spec && spec.deployType === "Drone" && spec.size === 0.5 && spec.hp === 8 && spec.evasion === 10 && spec.edef === 10, `parseNpcDeployableSpec 按 T2 自动提取无人机属性（HP=8, 大小=0.5）：实际 ${JSON.stringify(spec)}`);

			let createdActorData = null;
			let createdTokenDocs = null;
			const prevActorCls = ctx.Actor;
			const prevCanvas2 = ctx.canvas;
			ctx.Actor = {
				create: async data => {
					createdActorData = data;
					return { id: "dep_act_1", uuid: "Actor.dep_act_1", name: data.name, img: data.img, prototypeToken: data.prototypeToken, update: async () => {} };
				},
			};
			ctx.canvas = {
				...prevCanvas2,
				grid: { size: 100 },
				scene: {
					createEmbeddedDocuments: async (_type, docs) => {
						createdTokenDocs = docs;
						return docs.map(d => ({ ...d, id: "tok_dep_1" }));
					},
				},
				tokens: { placeables: [{ actor: hiveNpc, x: 200, y: 300, document: { disposition: -1, elevation: 0 } }] },
			};
			const spawned = await L.spawnNpcDeployableFromCard({}, { actor: hiveNpc, actorUuid: hiveNpc.uuid, item: turretItem, npcDeployable: spec });
			ctx.Actor = prevActorCls;
			ctx.canvas = prevCanvas2;
			ok(Boolean(spawned && createdActorData?.type === "deployable" && createdActorData.system.stats.hp === "8" && createdTokenDocs?.length === 1 && createdTokenDocs[0].x === 300), "spawnNpcDeployableFromCard 自动创建 deployable 角色并在部署者邻接格放置指示物");
		}
		ctx.ChatMessage = prevChatMsg116;

		// ---- v1.16.1 回归测试：爆发（Burst）范围模板数值类型与 getBurstDistance 字符串拼接修复、持续区域免自动清除及勘探者 II 淘金热豁免
		{
			const prevCanvasT = ctx.canvas;
			const prevWrt = ctx.game.lancer.canvas;
			const flagsSet = [];
			class MockWeaponRangeTemplate {
				constructor(range, creator) {
					this.range = range;
					this.creator = creator;
				}
				// 复刻上游 weapon-range-template.ts 原始实现（未强转 Number 且未乘 grid_distance）
				getBurstDistance(size) {
					return this.range.val + size / 2;
				}
				async placeTemplate() {
					return {
						id: "tmpl_burst_test",
						setFlag: async (scope, key, val) => { flagsSet.push([scope, key, val]); },
					};
				}
				static fromRange(range, creator) {
					return new MockWeaponRangeTemplate(range, creator);
				}
			}
			ctx.canvas = { ...prevCanvasT, scene: { dimensions: { distance: 1 } } };
			ctx.game.lancer.canvas = { WeaponRangeTemplate: MockWeaponRangeTemplate };

			let capturedRange = null;
			const origFrom = MockWeaponRangeTemplate.fromRange;
			MockWeaponRangeTemplate.fromRange = function (range, creator) {
				capturedRange = range;
				return origFrom.call(this, range, creator);
			};

			// 1) placeAoETemplate 传数字或字符串 "1"，range.val 均为数值 1，getBurstDistance(1) === 1.5（而非字符串 "10.5"），getBurstDistance(2) === 2（而非 "11"）
			flagsSet.length = 0;
			await L.placeAoETemplate("Burst", "1", null);
			const inst1 = ctx.game.lancer.canvas.WeaponRangeTemplate.fromRange({ type: "Burst", val: "1" });
			ok(typeof capturedRange?.val === "number" && capturedRange.val === 1, "placeAoETemplate 传入 WeaponRangeTemplate.fromRange 的 val 必须为数值而非字符串");
			ok(inst1.getBurstDistance(1) === 1.5 && inst1.getBurstDistance(2) === 2, "修复后 Burst 1 对体积 1 / 体积 2 指示物的半径分别为 1.5 与 2（杜绝 \"1\" + 0.5 === \"10.5\" 巨型圆缺陷）");
			ok(flagsSet.some(f => f[0] === "lancer" && f[1] === "isAttack" && f[2] === true), "瞬发范围模板默认标记 lancer.isAttack = true");

			// 2) 当场景网格距离单位为 5（手动新建场景默认值）时，Burst 1 半径自动按 1.5 * 5 = 7.5 缩放
			ctx.canvas = { ...prevCanvasT, scene: { dimensions: { distance: 5 } } };
			ok(inst1.getBurstDistance(1) === 7.5, "getBurstDistance 自动乘以 scene.dimensions.distance，兼容非 1 网格比例场景");

			// 3) 持续存在区域（如勘探者「创造进口」）识别 persistentAoE = true，放置时不打 isAttack 标记；瞬发状态持续描述不误判为持续区域
			flagsSet.length = 0;
			const prospectorText = "每场景1次，站在坚实地面上时，你可以用快速动作在自身周围创造爆发1进口。随后你可以穿梭隧道至多5格，并在抵达处创造另一个爆发1进口。进口持续存在至场景结束。与进口重叠的地形及地形部分受到20穿甲爆炸伤害。";
			ok(L.isPersistentAoEText(prospectorText) === true, "勘探者「进口持续存在至场景结束」识别为持续存在区域模板");
			ok(L.isPersistentAoEText("爆发1内的角色必须通过机体豁免，否则陷入缓慢状态，直到其下一回合结束。") === false, "角色状态持续至下一回合结束不误判为持续区域模板");
			await L.placeAoETemplate("Burst", 1, null, { persistent: true });
			ok(flagsSet.length === 0, "persistent: true 的持续区域模板不设置 lancer.isAttack，避免换回合被系统自动删除");

			// 4) 勘探者 II「淘金热」：点击「创造进口」卡片自动附带机体豁免 -> 伏卧
			const prospItem = { id: "it_prosp", uuid: "Actor.p_prosp.Item.it_prosp", type: "talent", is_talent: () => true, system: { lid: "t_prospector", curr_rank: 2 } };
			const prospPilot = {
				id: "p_prosp", uuid: "Actor.p_prosp", name: "矿工", type: "pilot",
				items: [prospItem],
				itemTypes: { talent: [prospItem] },
				system: {},
			};
			prospItem.actor = prospPilot;
			prospItem.parent = prospPilot;
			const prospMech = mkFlagActor("mech", { id: "m_prosp", uuid: "Actor.m_prosp", name: "掘进机", save: 13 });
			prospMech.system.pilot = { value: prospPilot, id: prospPilot.id };
			prospPilot.system.active_mech = { value: prospMech };
			const prevLookupProsp = ctx.fromUuidSync;
			ctx.fromUuidSync = u => (u === prospItem.uuid ? prospItem : u === "Actor.p_prosp" ? prospPilot : u === "Actor.m_prosp" ? prospMech : prevLookupProsp?.(u));
			const entranceMsg = {
				id: "msg_prosp_ent",
				content: `<div class="card clipped-bot" data-uuid="Actor.p_prosp.Item.it_prosp"><div class="lancer-header">// 创造进口 //</div><div class="effect-text">${prospectorText}</div></div>`,
				speaker: { actor: "p_prosp" },
				flags: { lancer: { actionData: { actor: "p_prosp", action: { name: "创造进口" } } } },
				getFlag: (scope, key) => entranceMsg.flags?.[scope]?.[key],
			};
			const entInfo = L.analyzeCard(entranceMsg);
			ctx.fromUuidSync = prevLookupProsp;
			ok(Boolean(entInfo?.persistentAoE && entInfo.aoeRanges?.length === 1 && entInfo.aoeRanges[0].type === "Burst" && entInfo.aoeRanges[0].val === 1), "勘探者「创造进口」卡片解析出数值型 Burst 1 且标记为持续区域");
			ok(Boolean(entInfo?.saves?.some(s => s.key === "hull" && s.dc === 13 && s.failStatuses.includes("prone"))), "勘探者 II「淘金热」在「创造进口」卡片上自动生成 DC=机甲豁免 的机体豁免否则伏卧");

			ctx.canvas = prevCanvasT;
			ctx.game.lancer.canvas = prevWrt;
		}

		// ---- v1.16.2 回归测试：线形（Line）与锥形（Cone）模板放置期滚轮 / 按键 / 拖拽 / 两步瞄准旋转 + 落盘后直接旋转与自动重锁目标
		{
			ok(L.normalizeTemplateDirection(-15) === 345 && L.normalizeTemplateDirection(375) === 15, "normalizeTemplateDirection 将负角与超 360° 角归一化至 [0, 360)");

			const prevCanvasR = ctx.canvas;
			const prevWrtR = ctx.game.lancer.canvas;
			const prevAddEv = ctx.addEventListener;
			const prevRemEv = ctx.removeEventListener;
			const winHandlers = new Map();
			ctx.addEventListener = (type, fn) => {
				if (!winHandlers.has(type)) winHandlers.set(type, new Set());
				winHandlers.get(type).add(fn);
			};
			ctx.removeEventListener = (type, fn) => {
				winHandlers.get(type)?.delete(fn);
			};
			const emitWin = (type, evObj) => {
				for (const fn of Array.from(winHandlers.get(type) ?? [])) fn(evObj);
			};

			const viewEl = { id: "board" };
			const createdDocs = [];
			class MockPreviewTemplate {
				constructor(range) {
					this.range = range;
					const src = {
						t: range.type === "Line" ? "ray" : range.type === "Cone" ? "cone" : "circle",
						x: 0, y: 0, direction: 0, distance: Number(range.val) || 1,
						flags: { lancer: { range, ignore: { tokens: [], dispositions: [] } } },
					};
					this.document = {
						...src,
						updateSource(patch) { Object.assign(this, patch); },
						toObject() { return { ...this }; },
					};
					this.layer = { preview: { removeChildren: () => [] } };
				}
				get isBurst() { return this.range.type === "Burst"; }
				snapToCenter(p) { return { x: Math.round(p.x / 100) * 100, y: Math.round(p.y / 100) * 100 }; }
				snapToToken(p) { return this.snapToCenter(p); }
				refresh() {}
				activatePreviewListeners() { return Promise.resolve(null); }
				placeTemplate() { return this.activatePreviewListeners({ activate() {} }); }
				static fromRange(r) { return new MockPreviewTemplate(r); }
			}

			ctx.canvas = {
				...prevCanvasR,
				ready: true,
				app: null,
				grid: { size: 100 },
				canvasCoordinatesFromClient: p => ({ x: p.x, y: p.y }),
				scene: {
					dimensions: { distance: 1 },
					templates: createdDocs,
					createEmbeddedDocuments: async (_type, arr) => {
						const doc = {
							...arr[0],
							id: `tmpl_dir_${createdDocs.length + 1}`,
							isAuthor: true,
							user: ctx.game.user?.id || "u1",
							flags: { lancer: { range: arr[0].flags.lancer.range, isAttack: true } },
							getFlag(scope, key) { return this.flags?.[scope]?.[key]; },
							async setFlag(scope, key, val) { this.flags[scope] = this.flags[scope] ?? {}; this.flags[scope][key] = val; },
							async update(patch) {
								Object.assign(this, patch);
								L.onUpdateMeasuredTemplate(this, patch, {}, ctx.game.user?.id || "u1");
								return this;
							},
						};
						createdDocs.push(doc);
						return [doc];
					},
				},
			};
			if (ctx.canvas) ctx.canvas.app = { canvas: viewEl };
			// 让无真实 PIXI 渲染测试直接返回创建文档
			const origCreateEmb = ctx.canvas.scene.createEmbeddedDocuments;
			ctx.canvas.scene.createEmbeddedDocuments = async (t, a) => {
				const res = await origCreateEmb(t, a);
				res[0].object = { shape: true };
				return res;
			};
			ctx.game.lancer.canvas = { WeaponRangeTemplate: MockPreviewTemplate };
			L.patchWeaponRangeTemplate();

			// 1) 方式 A：滚轮旋转（阻止地图缩放）+ Q/E 微调 + 单击直接落盘
			let wheelPrevented = false;
			const p1 = L.placeAoETemplate("Line", 5, null);
			ok(L.isPlacingTemplate() === true, "放置范围模板期间 isPlacingTemplate() 为 true，防止目标面板抢夺点击");
			emitWin("pointermove", { clientX: 100, clientY: 100, target: viewEl });
			emitWin("wheel", { deltaY: 100, shiftKey: false, ctrlKey: false, target: viewEl, preventDefault: () => { wheelPrevented = true; }, stopImmediatePropagation: () => {} });
			emitWin("keydown", { code: "KeyE", shiftKey: true, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			emitWin("pointerdown", { button: 0, clientX: 100, clientY: 100, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			emitWin("pointerup", { button: 0, clientX: 100, clientY: 100, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			const d1 = await p1;
			ok(wheelPrevented && d1?.direction === 20 && d1.x === 100 && d1.y === 100, `滚轮(+15°) + Shift+E(+5°) 旋转至 20° 后单击直接落盘，且阻止画布缩放：实际 ${d1?.direction}`);

			// 2) 方式 B：按住左键拖拽瞄准方向（起点锁在 (200,200)，拖向正南 (200,400) -> 90°）
			const p2 = L.placeAoETemplate("Cone", 3, null);
			emitWin("pointerdown", { button: 0, clientX: 200, clientY: 200, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			emitWin("pointermove", { clientX: 200, clientY: 400, shiftKey: false, target: viewEl });
			emitWin("pointerup", { button: 0, clientX: 200, clientY: 400, shiftKey: false, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			const d2 = await p2;
			ok(d2?.x === 200 && d2?.y === 200 && d2?.direction === 90, `按住左键拖拽瞄准：起点保持 (200,200) 且方向实时指向 90°，实际 (${d2?.x},${d2?.y}) @ ${d2?.direction}°`);

			// 3) 方式 C：两步法（左键单击锁起点 -> 右键重选起点 -> 再次左键锁起点 -> 移动鼠标指向 180° -> 左键确认）
			const p3 = L.placeAoETemplate("Line", 4, null);
			emitWin("pointerdown", { button: 0, clientX: 100, clientY: 100, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			emitWin("pointerup", { button: 0, clientX: 100, clientY: 100, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			// 右键轻点解锁起点而不是直接退出
			emitWin("pointerdown", { button: 2, clientX: 100, clientY: 100, target: viewEl });
			emitWin("contextmenu", { clientX: 100, clientY: 100, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			// 重新在 (300,300) 单击锁定起点，移动鼠标到正西 (100,300) -> 180°，再次单击确认
			emitWin("pointerdown", { button: 0, clientX: 300, clientY: 300, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			emitWin("pointerup", { button: 0, clientX: 300, clientY: 300, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			emitWin("pointermove", { clientX: 100, clientY: 300, shiftKey: false, target: viewEl });
			emitWin("pointerdown", { button: 0, clientX: 100, clientY: 300, shiftKey: false, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			emitWin("pointerup", { button: 0, clientX: 100, clientY: 300, shiftKey: false, target: viewEl, preventDefault: () => {}, stopImmediatePropagation: () => {} });
			const d3 = await p3;
			ok(d3?.x === 300 && d3?.y === 300 && d3?.direction === 180, `两步法瞄准与右键重选起点：最终落在 (300,300) @ 180°，实际 (${d3?.x},${d3?.y}) @ ${d3?.direction}°`);

			// 4) 落盘后直接旋转（Alt + 滚轮 / rotatePlacedDirectionalTemplate）并自动触发 targetsFromTemplate 重新锁定目标
			let retargetedId = null;
			const prevTargetsFn = ctx.game.lancer.targetsFromTemplate;
			ctx.game.lancer.targetsFromTemplate = id => { retargetedId = id; };
			L.onPlacedTemplateWheel({
				altKey: true, shiftKey: false, ctrlKey: false, metaKey: false,
				deltaY: -100, clientX: 300, clientY: 300, target: viewEl,
				preventDefault: () => {}, stopImmediatePropagation: () => {},
			});
			await new Promise(r => setTimeout(r, 60));
			ok(d3.direction === 165 && retargetedId === d3.id, `落盘后按住 Alt+滚轮直接将线形模板从 180° 旋至 165° 并自动重跑 targetsFromTemplate（${retargetedId}）`);

			const tpHtmlLine = L.targetPanelHTML({ title: "测试", aoe: [{ type: "Line", val: 5, label: "线形 5" }, { type: "Blast", val: 1, label: "溅射 1" }] }, []);
			ok((tpHtmlLine.match(/data-act="rot-template"/g) ?? []).length === 2, "目标选择面板仅为线形/锥形渲染 ↺ / ↻ 旋转按钮，不为溅射/爆发冗余渲染");

			ctx.game.lancer.targetsFromTemplate = prevTargetsFn;
			ctx.addEventListener = prevAddEv;
			ctx.removeEventListener = prevRemEv;
			ctx.canvas = prevCanvasR;
			ctx.game.lancer.canvas = prevWrtR;
		}

		// ---- v1.17.0 全项目交叉审计回归测试
		{
			const L = ctx.LancerCN;
			ok(manifest.version === "1.22.0", `模组版本号应为 1.22.0（实际 ${manifest.version}）`);

			// 1) UI/聊天词典与全大写/首字母大写匹配修复
			ok(L.translate("// 埃弗勒斯 IS STARTING THEIR TURN //") === "// 埃弗勒斯开始回合 //", "全大写回合开始横幅正常汉化");
			ok(L.translate("// 埃弗勒斯 IS ENDING THEIR TURN //") === "// 埃弗勒斯结束回合 //", "全大写回合结束横幅正常汉化");
			ok(L.translate("On Hit") === "命中时" && L.translate("On Crit") === "会心一击时" && L.translate("On Attack") === "攻击时", "首字母大写 On Attack/Hit/Crit 正常汉化");
			ok(L.translate("// CHECK :: GRIT //") === "// 检定 :: 毅力 //" && L.translate("// CHECK :: TIER //") === "// 检定 :: 等阶 //", "毅力与等阶检定卡标题正常汉化");
			ok(L.translate("LOCKED: BRACING") === "锁定：副挂载占用" && L.translate("Superheavy Bracing") === "超重型副挂载占用", "超重型副挂载占用术语区分于受身动作");
			ok(L.translate("AUXAUX") === "副/副" && L.translate("QUICKTECH") === "快速科技", "编辑器连写枚举值正常汉化");

			// 2) 残酷 I + 杀绝会心公式最大值解析
			ok(L.maxFormulaValue("4d6x1kh2") === 12 && L.maxFormulaValue("2d6x1kh1+3") === 9, `maxFormulaValue 正确解析含 x1 杀绝修饰符的取高公式：${L.maxFormulaValue("4d6x1kh2")} / ${L.maxFormulaValue("2d6x1kh1+3")}`);

			// 3) NPC {a/b/c} 花括号分层伤害与 tier_override 解析
			const bracedT1 = L.parseNonAttackDamage("目标受到 {2/4/6} 点能量伤害。", { system: { tier: 1 } }, null);
			const bracedOv2 = L.parseNonAttackDamage("目标受到 {2/4/6} 点能量伤害。", { system: { tier: 1 } }, { system: { tier_override: 2 } });
			ok(bracedT1?.damage?.[0]?.val === "2" && bracedOv2?.damage?.[0]?.val === "4", `花括号分层伤害按 T1=2、tier_override(2)=4 准确取值（实际 ${bracedT1?.damage?.[0]?.val} / ${bracedOv2?.damage?.[0]?.val}）`);

			// 4) 低速循环屏蔽罩在受击方同时处于离散时置位 customReductionApplied 并正常计入护甲
			const shroudPilot = { type: "pilot", items: [{ type: "core_bonus", system: { lid: "cb_piof_slow_cycle_shroud" } }] };
			const shroudMech = {
				type: "mech",
				is_mech: () => true,
				statuses: new Set(["shredded"]),
				items: [],
				getFlag: () => ({}),
				system: {
					armor: 2,
					hp: { value: 10, max: 10 },
					overshield: { value: 4 },
					heat: { value: 0, max: 6 },
					statuses: { shredded: true, exposed: false },
					resistances: {},
					pilot: { value: shroudPilot },
					loadout: { frame: { value: { system: { lid: "mf_drake" } } } },
				},
			};
			const shroudPrev = L.previewDamageCalc(shroudMech, [{ type: "Kinetic", amount: 5 }], { ap: false });
			ok(shroudPrev?.customReductionApplied === true && shroudPrev?.overshieldUsed === 3 && shroudPrev?.hpLoss === 0, `低速循环屏蔽罩抵消离散时置位 customReductionApplied 并扣减 2 点护甲（护盾 -3，HP -0）`);

			// 5) 哥布林物品科技攻击不重复累加 +1 准度（上游已加 1 时不加，无物品基础科技攻击仍加 1）
			const gobSteps = new Map([
				["initTechAttackData", async st => { st.data = { acc_diff: { base: { accuracy: 0, difficulty: 0 }, targets: [] } }; return true; }],
			]);
			const prevFlowsGob = ctx.game.lancer.flowSteps;
			ctx.game.lancer.flowSteps = gobSteps;
			L.patchLancerFlows();
			const gobActor = {
				type: "mech",
				is_mech: () => true,
				isOwner: true,
				statuses: new Set(),
				items: [],
				getFlag: () => ({}),
				setFlag: async () => {},
				system: { loadout: { frame: { value: { system: { lid: "mf_goblin" } } } } },
			};
			const gobItemSt = { actor: gobActor, item: { type: "mech_system", system: { lid: "ms_h0r_os_system_upgrade_i" } }, data: {} };
			const gobBasicSt = { actor: gobActor, item: null, data: {} };
			await gobSteps.get("initTechAttackData")(gobItemSt, {});
			await gobSteps.get("initTechAttackData")(gobBasicSt, {});
			ok(gobItemSt.data.acc_diff.base.accuracy === 0 && gobBasicSt.data.acc_diff.base.accuracy === 1, `哥布林带系统科技攻击不重复 +1（+${gobItemSt.data.acc_diff.base.accuracy}），无物品基础科技攻击补齐 +1（+${gobBasicSt.data.acc_diff.base.accuracy}）`);
			ctx.game.lancer.flowSteps = prevFlowsGob;

			// 6) 超体「主宰」多选状态清除按钮渲染非空 data-lancer-cn-ultra-jug 并可正常结算
			const jugFlags = {
				"lancer-cn": {
					ultraJuggernautPrompt: {
						uuid: "Actor.jug1",
						name: "超体测试机",
						mode: "clearStatus",
						options: [{ key: "impaired", id: "impaired", label: "受损" }, { key: "slow", id: "slow", label: "缓慢" }],
						resolved: false,
					},
				},
			};
			const jugActor = {
				id: "jug1", uuid: "Actor.jug1", name: "超体测试机", type: "npc", isOwner: true,
				statuses: new Set(["impaired", "slow"]),
				async toggleStatusEffect(id, { active }) { active ? this.statuses.add(id) : this.statuses.delete(id); },
			};
			const prevJugActors = ctx.game.actors;
			ctx.game.actors = { get: id => (id === "jug1" ? jugActor : null), [Symbol.iterator]: function* () { yield jugActor; } };
			const prevFromUuidSyncJug = ctx.fromUuidSync;
			ctx.fromUuidSync = u => (u === "Actor.jug1" ? jugActor : prevFromUuidSyncJug?.(u));
			const jugMsg = {
				id: "m_jug", isAuthor: true, flags: jugFlags,
				getFlag: (sc, k) => jugFlags[sc]?.[k],
				setFlag: async (sc, k, v) => { (jugFlags[sc] ||= {})[k] = v; },
			};
			let jugInserted = "";
			const jugContentEl = {
				insertAdjacentHTML: (_pos, h) => { jugInserted += h; },
				querySelector: () => ({ addEventListener: () => {} }),
			};
			L.onRenderChatMessage(jugMsg, { querySelector: sel => (sel === ".message-content" ? jugContentEl : null) });
			ok(jugInserted.includes('data-lancer-cn-ultra-jug="impaired"') && jugInserted.includes('data-lancer-cn-ultra-jug="slow"'), "超体主宰多选按钮正确写入选项键值而非空字符串");
			await L.executeUltraJuggernautChoice(jugMsg, "impaired");
			ok(!jugActor.statuses.has("impaired") && jugFlags["lancer-cn"].ultraJuggernautPrompt.resolved === true, "超体主宰点击清除指定状态正常结算");
			ctx.fromUuidSync = prevFromUuidSyncJug;
			ctx.game.actors = prevJugActors;

			// 7) 晕眩机甲点击卡片机体豁免自动判负
			const stunnedNpc = {
				id: "st_npc", uuid: "Actor.st_npc", name: "晕眩重甲", type: "npc", isOwner: true,
				statuses: new Set(["stunned"]),
				system: { hull: 6, agi: 4, statuses: { stunned: true } },
				async toggleStatusEffect(id, { active }) { active ? this.statuses.add(id) : this.statuses.delete(id); },
			};
			const prevCanvasSt = ctx.canvas;
			ctx.canvas = { tokens: { controlled: [{ uuid: "Actor.st_npc", name: "晕眩重甲", actor: stunnedNpc }], placeables: [] } };
			const prevFromUuidSyncSt = ctx.fromUuidSync;
			ctx.fromUuidSync = u => (u === "Actor.st_npc" ? stunnedNpc : prevFromUuidSyncSt?.(u));
			const stSaveRes = await L.executeCardSave(null, { key: "hull", path: "system.hull", label: "机体豁免", dc: 10, failStatuses: ["prone"], passStatuses: [], halfOnSuccess: false });
			ok(stSaveRes.length === 1 && stSaveRes[0].passed === false && stSaveRes[0].autoFail === true, "处于晕眩的机甲/NPC 进行机体豁免时自动失败");
			ctx.fromUuidSync = prevFromUuidSyncSt;
			ctx.canvas = prevCanvasSt;

			// 8) 伤害撤销在目标已先清零燃烧/热度时安全钳制为 0，不产生负值
			let patchedUndoData = null;
			const clearedTarget = {
				uuid: "Actor.u_tgt", type: "mech",
				system: { overshield: { value: 0 }, hp: { value: 8 }, burn: 0, heat: { value: 1 } },
				update: async d => { patchedUndoData = d; },
			};
			const undoChatMsg = { id: "m_undo", isAuthor: true, content: '<span>4 燃烧</span><a class="lancer-damage-undo"></a>', update: async () => {} };
			const prevGetMsg = ctx.game.messages?.get;
			const prevFromUuidAsync = ctx.fromUuid;
			ctx.fromUuid = async u => (u === "Actor.u_tgt" ? clearedTarget : prevFromUuidAsync?.(u));
			ctx.game.messages = { ...ctx.game.messages, get: id => (id === "m_undo" ? undoChatMsg : prevGetMsg?.(id)) };
			await L.gmUndoDamageByPayload({ actorUuid: "Actor.u_tgt", messageId: "m_undo", overshieldDelta: 0, hpDelta: 4, burnDelta: 5, heatDelta: 4, addBurn: true });
			ok(patchedUndoData?.["system.burn"] === 0 && patchedUndoData?.["system.heat.value"] === 0 && patchedUndoData?.["system.hp.value"] === 12, "已提前清除燃烧/热度后点撤销伤害时将燃烧与热度安全钳制在 0");
			ctx.fromUuid = prevFromUuidAsync;
			if (prevGetMsg) ctx.game.messages.get = prevGetMsg;

			// 9) 删除尚未开打的预设战斗遭遇（started: false, round: 0）不误关场上机甲核心协议；驾驶员云端导入自动去重骨架内建武器并补满受限改装充能
			let coreEndedOnUnstarted = false;
			const unstartedMech = {
				type: "mech", is_mech: () => true, isOwner: true,
				system: { core_active: true },
				getFlag: () => ({ active: true }),
				update: async () => { coreEndedOnUnstarted = true; },
			};
			await L.onDeleteCombat({ started: false, round: 0, combatants: [{ actor: unstartedMech }] });
			ok(coreEndedOnUnstarted === false, "删除未开打的备用遭遇（started=false, round=0）不会提前关闭机甲核心协议");

			let deletedDupIds = [];
			let refilledModUses = null;
			const eqIntWpn = { id: "w_eq", type: "mech_weapon", system: { lid: "mw_sherman_integrated" } };
			const dupIntWpn = { id: "w_dup", type: "mech_weapon", system: { lid: "mw_sherman_integrated" } };
			const limMod = {
				id: "m_lim", type: "weapon_mod",
				system: { lid: "wm_throughbolt_rounds", uses: { value: 0, max: 3 }, tags: [{ lid: "tg_limited", is_limited: true }] },
				update: async d => { refilledModUses = d["system.uses.value"]; },
			};
			const importedMech = {
				id: "m_imp", type: "mech", isOwner: true,
				items: [eqIntWpn, dupIntWpn, limMod],
				deleteEmbeddedDocuments: async (_t, ids) => { deletedDupIds = ids; },
				system: {
					pilot: { value: { id: "p_imp" } },
					loadout: {
						frame: { value: { system: { core_system: { integrated: ["mw_sherman_integrated"] } } } },
						weapon_mounts: [
							{ slots: [{ weapon: { value: eqIntWpn }, mod: { value: null } }] },
							{ slots: [{ weapon: { value: { id: "w_main" } }, mod: { value: limMod } }] },
						],
						systems: [],
					},
				},
			};
			const prevImpActors = ctx.game.actors;
			const impPilot = { id: "p_imp", type: "pilot", system: { active_mech: { value: importedMech } } };
			ctx.game.actors = [impPilot, importedMech];
			await L.cleanupPilotImportedMechs(impPilot, { system: { last_cloud_update: "2026-11-17" } }, "u1");
			ok(deletedDupIds.length === 1 && deletedDupIds[0] === "w_dup" && refilledModUses === 3, "车卡器导入驾驶员后自动删除未装备的重复骨架内建武器，并将受限武器改装充能从 0 补满至 max");
			ctx.game.actors = prevImpActors;
		}

		// ---- v1.18.0 守望（Overwatch）与反应体系（Reaction Economy）回归测试
		{
			const L = ctx.LancerCN;
			const prevCombat18 = ctx.game.combat;
			const prevIsGM18 = ctx.game.user.isGM;
			const prevUsers18 = ctx.game.users;
			const prevActors18 = ctx.game.actors;
			const prevUi18 = ctx.ui;
			const prevCanvas18 = ctx.canvas;
			const prevFlows18 = ctx.game.lancer.flows;
			const prevFlowSteps18 = ctx.game.lancer.flowSteps;
			const prevFromUuidSync18 = ctx.fromUuidSync;
			const prevFromUuid18 = ctx.fromUuid;
			const prevChatMsg18 = ctx.ChatMessage;

			const docMap = {};
			const chatCreated = [];
			const mkFlagMsg = (id, initFlags = {}, extra = {}) => {
				const flags = JSON.parse(JSON.stringify(initFlags));
				return {
					id,
					isAuthor: extra.isAuthor !== false,
					content: extra.content ?? "",
					flags,
					getFlag: (sc, k) => flags[sc]?.[k],
					setFlag: async (sc, k, v) => { (flags[sc] ||= {})[k] = v; },
					unsetFlag: async (sc, k) => { if (flags[sc]) delete flags[sc][k]; },
					update: async d => { if (d?.content !== undefined) extra.content = d.content; },
				};
			};
			let msgSeq18 = 1;
			ctx.ChatMessage = {
				getSpeaker: o => ({ actor: o?.actor?.name }),
				create: async d => {
					const m = mkFlagMsg(`m18_${msgSeq18++}`, d?.flags ?? {}, { isAuthor: true, content: d?.content ?? "" });
					m.speaker = d?.speaker;
					chatCreated.push(m);
					return m;
				},
			};
			ctx.game.users = { activeGM: { isSelf: true } };
			const warns18 = [];
			ctx.ui = {
				notifications: {
					info() {},
					warn: m => { warns18.push(String(m)); },
					error() {},
				},
			};

			const mkRwActor = (id, name, opts = {}) => {
				const flags = { "lancer-cn": {} };
				const statuses = new Set(opts.statuses ?? []);
				const pilot = opts.pilot ?? {
					id: `p_${id}`,
					type: "pilot",
					items: opts.pilotItems ?? [],
				};
				const a = {
					id,
					uuid: `Actor.${id}`,
					name,
					type: opts.type ?? "mech",
					isOwner: opts.isOwner !== false,
					is_mech: () => (opts.type ?? "mech") === "mech",
					is_npc: () => opts.type === "npc",
					statuses,
					items: opts.items ?? [],
					getFlag: (sc, k) => flags[sc]?.[k],
					setFlag: async (sc, k, v) => { (flags[sc] ||= {})[k] = v; },
					unsetFlag: async (sc, k) => { if (flags[sc]) delete flags[sc][k]; },
					toggleStatusEffect: async (sid, { active }) => { active ? statuses.add(sid) : statuses.delete(sid); },
					update: async d => {
						for (const [k, v] of Object.entries(d)) {
							if (k === "system.action_tracker.reaction") a.system.action_tracker.reaction = v;
							if (k === "system.overshield.value") a.system.overshield.value = v;
							if (k === "system.heat.value") a.system.heat.value = v;
						}
					},
					system: {
						tier: opts.tier ?? 1,
						armor: opts.armor ?? 1,
						hp: { value: opts.hp ?? 14, max: 14 },
						overshield: { value: 0 },
						heat: { value: 0, max: 6 },
						sensor_range: opts.sensor ?? 10,
						action_tracker: { reaction: true },
						statuses: {},
						resistances: {},
						pilot: { value: pilot },
						loadout: {
							frame: { value: { system: { lid: opts.frameLid ?? "mf_standard_pattern_i_everest", core_system: { integrated: opts.integrated ?? [] } } } },
							weapon_mounts: opts.mounts ?? [],
						},
					},
				};
				return a;
			};

			// 1) 反应经济：1/回合拦截（玩家硬阻止 + 提示，GM 越权放行 + 提示）、戈尔贡 2/回合上限与换回合重置
			ctx.game.combat = { id: "cmb18", started: true, round: 1, turn: 0, combatants: [] };
			ctx.game.user.isGM = false;
			const stdMech = mkRwActor("rw_std", "标准机");
			const r1 = await L.consumeReaction(stdMech, { kind: "test", label: "战术反应" });
			ok(r1.ok === true && stdMech.system.action_tracker.reaction === false, "标准机甲战斗中执行第 1 次反应成功，并同步将 action_tracker.reaction 置为 false");
			warns18.length = 0;
			const r2Player = await L.consumeReaction(stdMech, { kind: "test", label: "战术反应" });
			ok(r2Player.ok === false && r2Player.blocked === true && warns18.some(w => w.includes("无法执行战术反应") && w.includes("本回合反应次数已用尽")), "玩家侧同回合尝试第 2 次反应时被直接拦截并弹出提示");
			ctx.game.user.isGM = true;
			warns18.length = 0;
			const r2GM = await L.consumeReaction(stdMech, { kind: "test", label: "战术反应" });
			ok(r2GM.ok === true && r2GM.gmOverride === true && warns18.some(w => w.includes("主持人越权执行")), "主持人侧在反应受限时弹出越权提示并允许放行");

			ctx.game.user.isGM = false;
			const gorgonMech = mkRwActor("rw_gorgon", "戈尔贡测试机", { frameLid: "mf_gorgon" });
			ok(L.maxReactionsPerTurn(gorgonMech) === 2 && L.maxReactionsPerTurn(stdMech) === 1, "戈尔贡「凝视」每回合反应上限识别为 2，其余角色为 1");
			const g1 = await L.consumeReaction(gorgonMech, { kind: "test", label: "反应一" });
			ok(g1.ok === true && gorgonMech.system.action_tracker.reaction === true, "戈尔贡同回合第 1 次反应后仍保留第 2 次反应可用标记");
			const g2 = await L.consumeReaction(gorgonMech, { kind: "test", label: "反应二" });
			ok(g2.ok === true && gorgonMech.system.action_tracker.reaction === false, "戈尔贡同回合第 2 次反应后标记反应耗尽");
			const g3 = await L.consumeReaction(gorgonMech, { kind: "test", label: "反应三" });
			ok(g3.ok === false && g3.blocked === true, "戈尔贡同回合第 3 次反应对非 GM 玩家正常拦截");

			// 换回合后自动恢复反应次数与 action_tracker.reaction
			ctx.game.combat = {
				id: "cmb18", started: true, round: 1, turn: 1,
				previous: { combatantId: "c_std" }, current: { combatantId: "c_gorg" },
				combatants: [
					{ id: "c_std", name: "标准机", actor: stdMech, token: { uuid: stdMech.uuid } },
					{ id: "c_gorg", name: "戈尔贡测试机", actor: gorgonMech, token: { uuid: gorgonMech.uuid } },
				],
			};
			ctx.game.combat.combatants.get = cid => ctx.game.combat.combatants.find(x => x.id === cid);
			ctx.game.actors = [stdMech, gorgonMech];
			ctx.game.user.isGM = true;
			await L.onUpdateCombatTurnEnd(ctx.game.combat, { turn: 1 }, { direction: 1 });
			ok(stdMech.system.action_tracker.reaction === true && gorgonMech.system.action_tracker.reaction === true && L.checkReactionAvailability(gorgonMech).ok === true, "切换到下一名角色的回合后，全场角色每回合反应额度自动重置");

			// 2) 状态与姿态限制及专属豁免：晕眩（无畏级萨拉丁豁免）、受扰、擒拿（黑胡子豁免）、创造进口、瓦解/埋伏、准备动作互斥与触发
			ctx.game.user.isGM = false;
			const stunnedSaladin = mkRwActor("rw_dread", "无畏萨拉丁", { frameLid: "mf_ext_saladin_dread", statuses: ["stunned"] });
			const stunnedNormal = mkRwActor("rw_stun", "晕眩机", { statuses: ["stunned"] });
			ok(L.checkReactionAvailability(stunnedNormal).ok === false && L.checkReactionAvailability(stunnedSaladin).ok === true, "晕眩状态阻止普通机甲反应，但无畏级萨拉丁「反应式防御矩阵」在未关机时仍可反应");
			stunnedSaladin.statuses.add("shutdown");
			ok(L.checkReactionAvailability(stunnedSaladin).ok === false, "无畏级萨拉丁进入关机状态后不可反应");

			const jammedMech = mkRwActor("rw_jam", "受扰机", { statuses: ["jammed"] });
			ok(L.checkReactionAvailability(jammedMech).ok === false && L.checkReactionAvailability(jammedMech).reasonText.includes("受扰"), "受扰状态阻止反应");

			const grappledNormal = mkRwActor("rw_grp1", "被擒普通机", { statuses: ["grappled"] });
			const grappledBlackbeard = mkRwActor("rw_bb", "黑胡子", { frameLid: "mf_blackbeard", statuses: ["grappled"] });
			const grappledMonstrosity = mkRwActor("rw_mon", "怪形纠缠爪", {
				type: "npc",
				statuses: ["grappled"],
				items: [{ type: "npc_feature", name: "纠缠之爪", system: { lid: "npcf_cn_monstrosity_8" } }],
			});
			ok(!L.checkReactionAvailability(grappledNormal).ok && L.checkReactionAvailability(grappledBlackbeard).ok && L.checkReactionAvailability(grappledMonstrosity).ok, "擒拿中普通单位禁反应，黑胡子「锁定/杀戮子系统」与怪形「纠缠之爪」豁免");

			// 勘探者「创造进口」禁本回合反应
			const prospMech = mkRwActor("rw_prosp", "勘探机", {
				pilotItems: [{ type: "talent", system: { lid: "t_prospector", curr_rank: 1 } }],
			});
			docMap[prospMech.uuid] = prospMech;
			ctx.fromUuidSync = u => docMap[u] ?? prevFromUuidSync18?.(u) ?? null;
			const prospCardMsg = mkFlagMsg("prosp_18", {}, {
				isAuthor: true,
				content: `<div class="card clipped-bot" data-uuid="${prospMech.uuid}"><div class="lancer-header">// 创造进口 //</div><div class="effect-text">在自身周围创造爆发1进口。直到当前回合结束，你不能采取反应。</div></div>`,
			});
			await L.onCreateChatMessage(prospCardMsg, {}, "u1");
			ok(!L.checkReactionAvailability(prospMech).ok && L.checkReactionAvailability(prospMech).reasonText.includes("创造进口"), "勘探者发动「创造进口」后本回合禁止反应");

			// 准备动作保持期间阻止其他反应，但允许「⚡ 触发准备动作」消耗反应并解除保持
			const prepMech = mkRwActor("rw_prep", "准备机");
			docMap[prepMech.uuid] = prepMech;
			chatCreated.length = 0;
			await L.beginBasicAction(prepMech, "prepare", { trigger: "敌方露头时", action: "交火射击" });
			const prepMsg = chatCreated.at(-1);
			ok(!L.checkReactionAvailability(prepMech, { kind: "overwatch", label: "守望" }).ok && L.checkReactionAvailability(prepMech, { kind: "triggerPrepared", label: "准备动作" }).ok, "保持准备动作期间禁止守望等其他反应，仅允许触发已准备动作");
			const trigOk = await L.triggerPreparedAction(prepMsg);
			ok(trigOk === true && L.getCombatState(prepMech).preparedAction === null && L.getCombatState(prepMech).reactionsUsedTurn === 1, "点击「触发准备动作」成功消耗本回合反应并解除准备锁定");

			// ActivationFlow / SystemFlow 拦截受限反应（不误扣自身热度）并在取消时退回反应
			const actSteps18 = new Map([
				["initActivationData", async st => { st._ranOrig = true; return st._cancelOrig ? false : true; }],
				["initSystemUseData", async st => { st._ranOrig = true; return true; }],
			]);
			ctx.game.lancer.flowSteps = actSteps18;
			L.patchLancerFlows();
			const reactSysItem = {
				id: "sys_r1", name: "主动点防", type: "mech_system",
				system: { lid: "ms_point_defense", actions: [{ name: "点防拦截", activation: "Reaction", frequency: "1/round" }] },
			};
			const blockedActState = { actor: jammedMech, item: reactSysItem, data: { path: "system.actions.0" } };
			const blockedActRes = await actSteps18.get("initActivationData")(blockedActState, {});
			ok(blockedActRes === false && !blockedActState._ranOrig, "受扰机甲点击角色表反应动作时在结算热度与次数前即被 ActivationFlow 拦截");

			const cleanReactMech = mkRwActor("rw_clean", "点防机");
			const cancelActState = { actor: cleanReactMech, item: reactSysItem, data: { path: "system.actions.0" }, _cancelOrig: true };
			await actSteps18.get("initActivationData")(cancelActState, {});
			ok((L.getCombatState(cleanReactMech).reactionsUsedTurn || 0) === 0 && cleanReactMech.system.action_tracker.reaction === true, "ActivationFlow 原生步骤中途取消时无损返还反应额度与 1/轮标记");

			// 3) overwatchThreatVal 与 eligibleOverwatchWeapons 合法性过滤
			const wRifleDefault = { id: "w_rif", uuid: "Item.w_rif", name: "突击步枪", type: "mech_weapon", system: { size: "Main", active_profile: { type: "Rifle", range: [{ type: "Range", val: 10 }], tags: [] } } };
			const wCqb3 = { id: "w_cqb", uuid: "Item.w_cqb", name: "霰弹枪", type: "mech_weapon", system: { size: "Main", active_profile: { type: "CQB", range: [{ type: "Range", val: 5 }, { type: "Threat", val: 3 }], tags: [] } } };
			const wSuperheavy = { id: "w_sh", uuid: "Item.w_sh", name: "旋风炮", type: "mech_weapon", system: { size: "Superheavy", active_profile: { type: "Cannon", range: [{ type: "Range", val: 15 }], tags: [] } } };
			const wOrdnance = { id: "w_ord", uuid: "Item.w_ord", name: "迫击炮", type: "mech_weapon", system: { size: "Main", active_profile: { type: "Cannon", range: [{ type: "Range", val: 15 }], tags: [{ lid: "tg_ordnance", is_ordnance: true }] } } };
			const wUnloaded = { id: "w_unl", uuid: "Item.w_unl", name: "反器材步枪", type: "mech_weapon", system: { size: "Main", loaded: false, active_profile: { type: "Rifle", range: [{ type: "Range", val: 20 }], tags: [{ lid: "tg_loading", is_loading: true }] } } };
			const wKnife = { id: "w_knf", uuid: "Item.w_knf", name: "战术刀", type: "mech_weapon", system: { size: "Auxiliary", active_profile: { type: "Melee", range: [{ type: "Threat", val: 1 }, { type: "Thrown", val: 3 }], tags: [] } } };

			const tokugawaExposed = mkRwActor("rw_toku", "德川", { frameLid: "mf_tokugawa", statuses: ["exposed"] });
			ok(L.overwatchThreatVal(wRifleDefault, cleanReactMech) === 1 && L.overwatchThreatVal(wRifleDefault, tokugawaExposed) === 2, "未标威胁的武器默认具有威胁 1，德川暴露状态下动态提升至威胁 2");

			const filterMech = mkRwActor("rw_flt", "武器过滤机", {
				pilotItems: [{ type: "talent", system: { lid: "t_vanguard", curr_rank: 3 } }],
				items: [wRifleDefault, wCqb3, wSuperheavy, wOrdnance, wUnloaded, wKnife],
				mounts: [
					{ bracing: false, slots: [{ weapon: { value: wRifleDefault } }] },
					{ bracing: false, slots: [{ weapon: { value: wCqb3 } }] },
					{ bracing: false, slots: [{ weapon: { value: wSuperheavy } }] },
					{ bracing: true, slots: [{ weapon: { value: { id: "w_brc", name: "被占用副武器", type: "mech_weapon", system: { size: "Auxiliary", active_profile: { type: "Rifle", range: [], tags: [] } } } } }] },
					{ bracing: false, slots: [{ weapon: { value: wOrdnance } }, { weapon: { value: wUnloaded } }, { weapon: { value: wKnife } }] },
				],
			});
			await L.markWeaponThrown(filterMech, wKnife);
			const eligAll = L.eligibleOverwatchWeapons(filterMech);
			ok(eligAll.map(e => e.id).join(",") === "w_rif,w_cqb", `守望合法武器过滤掉超重型、重火器、未装填、超重型占用挂载与已投出武器（实际：${eligAll.map(e => e.id).join(",")}）`);
			await L.retrieveThrownWeapon(filterMech, "all", { notify: false });

			// 4) 指示物移动检测（preUpdateToken + updateToken）与一键守望交火（含先锋 III 进入威胁、脱离/匿迹/传送忽略、未扫描 NPC 武器防剧透、取消退回反应）
			const gridMock18 = {
				size: 100,
				distance: 1,
				isGridless: false,
				getOffset: pt => ({ i: Math.floor(pt.y / 100), j: Math.floor(pt.x / 100) }),
				getCenterPoint: off => ({ x: off.j * 100 + 50, y: off.i * 100 + 50 }),
				measurePath: ([p, q]) => ({ spaces: Math.max(Math.abs(Math.floor(p.x / 100) - Math.floor(q.x / 100)), Math.abs(Math.floor(p.y / 100) - Math.floor(q.y / 100))) }),
			};
			const watcherTortuga = mkRwActor("rw_tortuga", "托尔图加哨兵", {
				frameLid: "mf_tortuga",
				pilotItems: [{ type: "talent", system: { lid: "t_vanguard", curr_rank: 3 } }],
				items: [wRifleDefault, wCqb3, wKnife],
				mounts: [{ bracing: false, slots: [{ weapon: { value: wRifleDefault } }, { weapon: { value: wCqb3 } }, { weapon: { value: wKnife } }] }],
			});
			const watcherSecretNpc = mkRwActor("rw_sec_npc", "暗哨机兵", {
				type: "npc",
				isOwner: false,
				items: [{ id: "npcw_1", uuid: "Item.npcw_1", name: "机密电浆刃", type: "npc_feature", system: { type: "Weapon", weapon_type: "Main Melee", range: [{ type: "Threat", val: 1 }], tags: [] } }],
			});
			const moverEnemy = mkRwActor("rw_mover_e", "突击敌机", { type: "npc", isOwner: false });
			const moverFriendly = mkRwActor("rw_mover_f", "突进玩家机", { type: "mech", isOwner: true });

			const tokTortuga = {
				id: "t_tort", uuid: "Scene.s18.Token.t_tort", name: "托尔图加哨兵", actor: watcherTortuga,
				x: 0, y: 0, center: { x: 50, y: 50 },
				document: { id: "t_tort", uuid: "Scene.s18.Token.t_tort", name: "托尔图加哨兵", x: 0, y: 0, width: 1, height: 1, disposition: 1, actor: watcherTortuga },
			};
			const tokSecretNpc = {
				id: "t_snpc", uuid: "Scene.s18.Token.t_snpc", name: "暗哨机兵", actor: watcherSecretNpc,
				x: 0, y: 200, center: { x: 50, y: 250 },
				document: { id: "t_snpc", uuid: "Scene.s18.Token.t_snpc", name: "暗哨机兵", x: 0, y: 200, width: 1, height: 1, disposition: -1, actor: watcherSecretNpc },
			};
			let moverTargetLocked = false;
			const tokEnemy = {
				id: "t_mov_e", uuid: "Scene.s18.Token.t_mov_e", name: "突击敌机", actor: moverEnemy,
				x: 100, y: 0, center: { x: 150, y: 50 },
				setTarget: active => { moverTargetLocked = Boolean(active); ctx.game.user.targets = active ? new Set([tokEnemy]) : new Set(); },
				document: { id: "t_mov_e", uuid: "Scene.s18.Token.t_mov_e", name: "突击敌机", x: 100, y: 0, width: 1, height: 1, disposition: -1, actor: moverEnemy },
			};
			tokEnemy.document.object = tokEnemy;
			const tokFriendly = {
				id: "t_mov_f", uuid: "Scene.s18.Token.t_mov_f", name: "突进玩家机", actor: moverFriendly,
				x: 100, y: 200, center: { x: 150, y: 250 },
				document: { id: "t_mov_f", uuid: "Scene.s18.Token.t_mov_f", name: "突进玩家机", x: 100, y: 200, width: 1, height: 1, disposition: 1, actor: moverFriendly },
			};
			tokFriendly.document.object = tokFriendly;

			docMap[tokTortuga.uuid] = tokTortuga.document;
			docMap[watcherTortuga.uuid] = watcherTortuga;
			docMap[tokSecretNpc.uuid] = tokSecretNpc.document;
			docMap[watcherSecretNpc.uuid] = watcherSecretNpc;
			docMap[tokEnemy.uuid] = tokEnemy.document;
			docMap[moverEnemy.uuid] = moverEnemy;
			docMap[tokFriendly.uuid] = tokFriendly.document;
			docMap[moverFriendly.uuid] = moverFriendly;
			ctx.fromUuidSync = u => docMap[u] ?? prevFromUuidSync18?.(u) ?? null;
			ctx.fromUuid = async u => docMap[u] ?? (await prevFromUuid18?.(u)) ?? null;
			ctx.canvas = {
				grid: gridMock18,
				tokens: {
					placeables: [tokTortuga, tokSecretNpc, tokEnemy, tokFriendly],
					get: id => [tokTortuga, tokSecretNpc, tokEnemy, tokFriendly].find(t => t.id === id) ?? null,
				},
			};
			ctx.game.users = { activeGM: { isSelf: true } };
			ctx.game.user.isGM = true;
			L.resetOverwatchPromptDedup();

			// 4a) 距离 4 -> 3：常规威胁 1 步枪不触发，先锋 III「永远警惕」CQB 霰弹枪（威胁 3）进入威胁触发！
			tokEnemy.document.x = 400; tokEnemy.x = 400; tokEnemy.center = { x: 450, y: 50 };
			L.onPreUpdateTokenOverwatch(tokEnemy.document, { x: 300 });
			tokEnemy.document.x = 300; tokEnemy.x = 300; tokEnemy.center = { x: 350, y: 50 };
			chatCreated.length = 0;
			await L.onOverwatchTokenUpdate(tokEnemy.document, { x: 300 }, {}, "u1");
			const owVanguardData = chatCreated.at(-1)?.flags?.["lancer-cn"]?.overwatchPrompt;
			ok(owVanguardData?.watchers?.length === 1 && owVanguardData.watchers[0].weapons.map(w => `${w.id}:${w.triggerMode}`).join(",") === "w_cqb:vanguardEnter", "敌机从 4 格移入 3 格时，仅触发先锋 III「永远警惕」的 CQB 霰弹枪，不误触发威胁 1 步枪");

			// 4b) 脱离（Disengage）、匿迹（Hidden）与瞬间移动（teleport）不触发守望
			L.resetOverwatchPromptDedup();
			moverEnemy.isOwner = true; // GM 对敌机执行脱离
			await L.beginBasicAction(moverEnemy, "disengage");
			tokEnemy.document.x = 100; tokEnemy.x = 100;
			L.onPreUpdateTokenOverwatch(tokEnemy.document, { x: 200 });
			tokEnemy.document.x = 200; tokEnemy.x = 200;
			chatCreated.length = 0;
			await L.onOverwatchTokenUpdate(tokEnemy.document, { x: 200 }, { forceOverwatchCheck: true }, "u1");
			ok(chatCreated.length === 0, "已执行「脱离」的角色本回合移动不触发守望");
			await moverEnemy.setFlag("lancer-cn", "combatState", {});
			moverEnemy.isOwner = false;

			moverEnemy.statuses.add("hidden");
			tokEnemy.document.x = 100; tokEnemy.x = 100;
			L.onPreUpdateTokenOverwatch(tokEnemy.document, { x: 200 });
			tokEnemy.document.x = 200; tokEnemy.x = 200;
			chatCreated.length = 0;
			await L.onOverwatchTokenUpdate(tokEnemy.document, { x: 200 }, { forceOverwatchCheck: true }, "u1");
			ok(chatCreated.length === 0, "处于「匿迹」的角色移动不触发守望");
			moverEnemy.statuses.delete("hidden");

			tokEnemy.document.x = 100; tokEnemy.x = 100;
			L.onPreUpdateTokenOverwatch(tokEnemy.document, { x: 300 });
			tokEnemy.document.x = 300; tokEnemy.x = 300;
			chatCreated.length = 0;
			await L.onOverwatchTokenUpdate(tokEnemy.document, { x: 300 }, { teleport: true, forceOverwatchCheck: true }, "u1");
			ok(chatCreated.length === 0, "瞬间移动（options.teleport）不触发守望");

			// 4c) 隐私防剧透：玩家移动触发未拥有 NPC 守望时，非 GM 客户端只看到等待提示，不泄露未扫描 NPC 武器名
			L.resetOverwatchPromptDedup();
			tokFriendly.document.x = 100; tokFriendly.x = 100;
			L.onPreUpdateTokenOverwatch(tokFriendly.document, { x: 200 });
			tokFriendly.document.x = 200; tokFriendly.x = 200;
			chatCreated.length = 0;
			await L.onOverwatchTokenUpdate(tokFriendly.document, { x: 200 }, { forceOverwatchCheck: true }, "u1");
			const secOwMsg = chatCreated.at(-1);
			ctx.game.user.isGM = false;
			let playerOwHtml = "", gmOwHtml = "";
			L.onRenderChatMessage(secOwMsg, { querySelector: sel => (sel === ".message-content" ? { insertAdjacentHTML: (_p, h) => { playerOwHtml = h; }, querySelector: () => null } : null) });
			ctx.game.user.isGM = true;
			L.onRenderChatMessage(secOwMsg, { querySelector: sel => (sel === ".message-content" ? { insertAdjacentHTML: (_p, h) => { gmOwHtml = h; }, querySelector: () => null } : null) });
			ok(!playerOwHtml.includes("机密电浆刃") && playerOwHtml.includes("等待") && gmOwHtml.includes("机密电浆刃"), "守望提醒卡对非拥有者玩家隐藏敌方 NPC 具体武器名防剧透，对 GM 正常显示武器按钮");

			// 4d) 执行守望攻击：取消面板无损返还反应；确认开火自动锁定目标、应用托尔图加「哨兵」+1 准度、且目标已移远时近战投掷刀仍保持近战挥砍不丢刀
			let nextOwFlowOk = false;
			let capturedOwState = null;
			const owAtkSteps = new Map([
				["initAttackData", async st => {
					st.data = {
						title: st.item?.name ?? "",
						attack_type: "Melee",
						acc_diff: { base: { accuracy: 0, difficulty: 0 }, weapon: { melee: true, thrown: true, engaged: false }, targets: [{ target: tokEnemy, accuracy: 0, difficulty: 0, cover: 0 }] },
					};
					return true;
				}],
			]);
			ctx.game.lancer.flowSteps = owAtkSteps;
			L.patchLancerFlows();
			ctx.game.lancer.flows = new Map([
				["WeaponAttackFlow", class {
					constructor(uuid, data) {
						this.state = { actor: watcherTortuga, item: wKnife, data: { ...data } };
					}
					async begin() {
						if (!nextOwFlowOk) return false;
						await owAtkSteps.get("initAttackData")(this.state, {});
						capturedOwState = this.state;
						return true;
					}
				}],
			]);
			ctx.game.user.isGM = false;
			const cancelledOw = await L.executeOverwatchAttack(watcherTortuga, { weaponId: "w_knf", targetTokenOrUuid: tokEnemy.uuid, triggerDist: 1 });
			ok(cancelledOw === false && !L.getCombatState(watcherTortuga).usedOverwatchRound && (L.getCombatState(watcherTortuga).reactionsUsedTurn || 0) === 0, "取消守望攻击面板后无损退回每回合反应与每轮守望次数");

			// 目标在画布上已拖到 x=500（距离 5 格），点击守望按钮结算移动前（triggerDist=1）的战术刀交火
			tokEnemy.document.x = 500; tokEnemy.x = 500; tokEnemy.center = { x: 550, y: 50 };
			watcherTortuga.statuses.add("hidden");
			nextOwFlowOk = true;
			moverTargetLocked = false;
			const doneOw = await L.executeOverwatchAttack(watcherTortuga, { weaponId: "w_knf", targetTokenOrUuid: tokEnemy.uuid, triggerDist: 1 });
			ok(doneOw === true && moverTargetLocked === true && L.getCombatState(watcherTortuga).usedOverwatchRound === true && !watcherTortuga.statuses.has("hidden"), "守望攻击成功后自动锁定移动目标、标记本轮已守望并解除攻击者匿迹");
			ok(capturedOwState?.data?.acc_diff?.base?.accuracy >= 1 && capturedOwState?.data?.acc_diff?.weapon?.thrown === false, "托尔图加守望自动获得「哨兵」+1 准度，且即使目标在画布上已移远仍保持战术刀近战挥砍（thrown=false）不误丢刀");

			// 4e) 超体「本能反应」跨回合突破 1/轮守望限制（同回合仍受 1/回合反应限制）
			const ultraSentinel = mkRwActor("rw_ultra_ow", "超体哨卫", {
				type: "npc",
				items: [
					{ type: "npc_feature", name: "本能反应", system: { lid: "npcf_cn_ultra_9" } },
					{ id: "uw_1", uuid: "Item.uw_1", name: "重型机炮", type: "npc_feature", system: { type: "Weapon", weapon_type: "Main Cannon", range: [{ type: "Range", val: 8 }], tags: [] } },
				],
			});
			const uGate1 = await L.consumeReaction(ultraSentinel, { kind: "overwatch", label: "守望", roundFlag: "usedOverwatchRound" });
			ok(uGate1.ok && !L.getCombatState(ultraSentinel).usedOverwatchRound && !L.checkReactionAvailability(ultraSentinel, { kind: "overwatch", label: "守望", roundFlag: "usedOverwatchRound" }).ok, "超体「本能反应」发动守望后不锁死 1/轮标记，但同回合仍受 1/回合反应限制");
			ctx.game.combat.turn = 2;
			ok(L.checkReactionAvailability(ultraSentinel, { kind: "overwatch", label: "守望", roundFlag: "usedOverwatchRound" }).ok === true, "进入同一轮的下一个角色回合后，超体「本能反应」可再次发动守望");

			// 5) 伤害卡目标行内联「🛡 受身」按钮：点击消耗反应开启全抗性并实时刷新结算预览（8 动能 0 护甲 -> 4 HP）
			const braceTargetMech = mkRwActor("rw_brace_t", "受击盾卫", { armor: 0, hp: 14 });
			docMap["Scene.s18.Token.bt"] = { uuid: "Scene.s18.Token.bt", name: "受击盾卫", actor: braceTargetMech };
			const mkMockEl = tag => ({
				tagName: tag.toUpperCase(),
				className: "",
				style: {},
				textContent: "",
				title: "",
				disabled: false,
				children: [],
				listeners: {},
				append(ch) { this.children.push(ch); },
				addEventListener(ev, fn) { this.listeners[ev] = fn; },
			});
			const mockCardDiv = mkMockEl("div");
			const mockSelect = { value: "1", addEventListener() {} };
			const mockTargetRow = {
				querySelector: sel => {
					if (sel === ".lancer-cn-dmg-preview") return null;
					if (sel === ".lancer-damage-button-group") return { dataset: { target: "Scene.s18.Token.bt", addBurn: "true" }, querySelector: s => (s === "select" ? mockSelect : null) };
					return null;
				},
				append(ch) { mockCardDiv.append(ch); },
				closest: () => mockCardDiv,
			};
			const mockDmgRoot = {
				ownerDocument: { createElement: mkMockEl },
				querySelectorAll: sel => (sel === ".lancer-damage-target" ? [mockTargetRow] : []),
				querySelector: () => null,
			};
			const mockDmgMsg = mkFlagMsg("dmg_brace_18", {
				lancer: {
					damageData: {
						ap: false,
						paracausal: false,
						targetDamageResults: [{ target: "Scene.s18.Token.bt", damage: [{ type: "Kinetic", amount: 8 }], ap: false, paracausal: false }],
					},
				},
			});
			ctx.game.user.isGM = false;
			L.onRenderChatMessage(mockDmgMsg, mockDmgRoot);
			const previewBox = mockCardDiv.children[0];
			const spanEl = previewBox?.children?.[0];
			const inlineBraceBtn = previewBox?.children?.[1];
			ok(spanEl?.textContent.includes("-8 HP") && inlineBraceBtn?.textContent === "🛡 受身", `伤害卡目标行生成结算预览（${spanEl?.textContent}）与内联「🛡 受身」按钮`);
			await inlineBraceBtn.listeners.click({ preventDefault() {}, stopPropagation() {} });
			ok(inlineBraceBtn.textContent === "✓ 已受身" && inlineBraceBtn.disabled === true && spanEl.textContent.includes("-4 HP"), `点击伤害卡内联「🛡 受身」后开启全抗性并将预览实时刷新为减半后 -4 HP（实际：${spanEl.textContent}）`);

			ctx.fromUuidSync = prevFromUuidSync18;
			ctx.fromUuid = prevFromUuid18;
			ctx.ChatMessage = prevChatMsg18;
			ctx.game.lancer.flows = prevFlows18;
			ctx.game.lancer.flowSteps = prevFlowSteps18;
			ctx.canvas = prevCanvas18;
			ctx.ui = prevUi18;
			ctx.game.actors = prevActors18;
			ctx.game.users = prevUsers18;
			ctx.game.user.isGM = prevIsGM18;
			ctx.game.combat = prevCombat18;
		}

		// ---- v1.19.0 召唤物自动掩护圈与指示物跟随掩护区域回归测试
		{
			const L = ctx.LancerCN;
			const prevCanvas19 = ctx.canvas;
			const prevUsers19 = ctx.game.users;
			const prevIsGM19 = ctx.game.user.isGM;
			const prevUi19 = ctx.ui;

			ctx.game.users = { activeGM: { isSelf: true } };
			ctx.game.user.isGM = true;
			ctx.ui = { notifications: { info() {}, warn() {}, error() {} } };

			// 1) 部署物掩护规格自动推断（区分普通实体硬掩体、自身同享、内部掩体、软掩护场，并跳过未引爆地雷与矿渣爆爆）
			const mkDepActor = (name, lid, detail = "", depType = "Deployable", hp = 10, hpMax = 10) => {
				const statuses = new Set();
				const flags = { "lancer-cn": {} };
				return {
					id: `a_${lid || name}`,
					name,
					type: "deployable",
					isOwner: true,
					is_deployable: () => true,
					statuses,
					flags,
					getFlag: (sc, k) => flags[sc]?.[k],
					setFlag: async (sc, k, v) => { (flags[sc] ||= {})[k] = v; },
					toggleStatusEffect: async (sid, { active }) => { active ? statuses.add(sid) : statuses.delete(sid); },
					system: {
						lid,
						type: depType,
						detail,
						hp: { value: hp, max: hpMax },
					},
				};
			};

			const jerichoSpec = L.inferDeployableCoverSpec(null, mkDepActor("耶利哥展开掩体 [埃弗勒斯]", "dep_耶利哥展开掩体"));
			ok(jerichoSpec?.cover === "hard" && jerichoSpec.radius === 1 && jerichoSpec.includeSelfCells === false && jerichoSpec.grantToSelfActor === false, "耶利哥展开掩体自动识别为：硬性掩护·周边邻接1格·不含自身且自身不受益");

			const shieldArraySpec = L.inferDeployableCoverSpec(null, mkDepActor("盾牌阵列无人机", "dep_盾牌阵列无人机", "", "Drone"));
			ok(shieldArraySpec?.cover === "hard" && shieldArraySpec.radius === 1 && shieldArraySpec.includeSelfCells === true && shieldArraySpec.grantToSelfActor === true, "盾牌阵列无人机自动识别为：硬性掩护·含自身+周边1格·自身同享硬掩护");

			const bunkerSpec = L.inferDeployableCoverSpec(null, mkDepActor("便携式地堡", "dep_便携式地堡"));
			ok(bunkerSpec?.cover === "hard" && bunkerSpec.radius === 0 && bunkerSpec.includeSelfCells === true && bunkerSpec.grantToSelfActor === false, "便携式地堡自动识别为：硬性掩护·仅覆盖自身占地格·建筑自身不挂状态");

			const hiveSpec = L.inferDeployableCoverSpec(null, mkDepActor("虫巢无人机", "dep_虫巢无人机", "", "Drone"));
			ok(hiveSpec?.cover === "soft" && hiveSpec.radius === 2 && hiveSpec.includeSelfCells === true && hiveSpec.grantToSelfActor === true, "虫巢无人机自动识别为：软性掩护·爆发2·自身同享软掩护");

			const smokeMineSpec = L.inferDeployableCoverSpec(null, mkDepActor("烟雾地雷", "dep_烟雾地雷", "引爆时爆发3区域得到软性掩护。", "Mine"));
			const slagBombSpec = L.inferDeployableCoverSpec(null, mkDepActor("矿渣爆爆", "dep_矿渣爆爆", "被摧毁时在爆发2中引爆。"));
			const customBarrierSpec = L.inferDeployableCoverSpec(null, mkDepActor("自制防爆盾板", "dep_custom_plate", "部署于邻接空格，可作为硬性掩护。"));
			ok(smokeMineSpec === null && slagBombSpec === null && customBarrierSpec?.cover === "hard" && customBarrierSpec.includeSelfCells === false, "跳过未引爆的烟雾地雷与火蜥蜴矿渣爆爆，并通过语义兜底准确识别自定义硬掩体部署物");

			// 2) 拖出自动创建 Region、周边角色自动获掩护、掩体自身不吃 -2、拖动跟随平移、HP=0 自动移除与修复恢复、删除清理
			const grid19 = {
				size: 100,
				distance: 1,
				isGridless: false,
				getOffset: pt => ({ i: Math.floor(pt.y / 100), j: Math.floor(pt.x / 100) }),
				getCenterPoint: off => ({ x: off.j * 100 + 50, y: off.i * 100 + 50 }),
				getVertices: off => {
					const x0 = off.j * 100, y0 = off.i * 100;
					return [{ x: x0, y: y0 }, { x: x0 + 100, y: y0 }, { x: x0 + 100, y: y0 + 100 }, { x: x0, y: y0 + 100 }];
				},
				measurePath: ([p, q]) => ({ spaces: Math.max(Math.abs(Math.floor(p.x / 100) - Math.floor(q.x / 100)), Math.abs(Math.floor(p.y / 100) - Math.floor(q.y / 100))) }),
			};
			let regSeq = 1;
			const scene19 = {
				id: "sc19",
				grid: grid19,
				tokens: [],
				regions: [],
				async createEmbeddedDocuments(type, dataList) {
					if (type !== "Region") return [];
					const out = [];
					for (const d of dataList) {
						const flags = JSON.parse(JSON.stringify(d.flags ?? {}));
						const reg = {
							id: `reg19_${regSeq++}`,
							name: d.name,
							color: d.color,
							visibility: d.visibility,
							shapes: d.shapes,
							behaviors: d.behaviors ?? [],
							flags,
							getFlag: (sc, k) => flags[sc]?.[k],
							async update(u) {
								if (u.name !== undefined) this.name = u.name;
								if (u.color !== undefined) this.color = u.color;
								if (u.visibility !== undefined) this.visibility = u.visibility;
								if (u.shapes !== undefined) this.shapes = u.shapes;
								if (u.behaviors !== undefined) this.behaviors = u.behaviors;
								if (u["flags.lancer-cn"]) flags["lancer-cn"] = JSON.parse(JSON.stringify(u["flags.lancer-cn"]));
							},
						};
						scene19.regions.push(reg);
						out.push(reg);
					}
					return out;
				},
				async deleteEmbeddedDocuments(type, ids) {
					if (type !== "Region") return;
					scene19.regions = scene19.regions.filter(r => !ids.includes(r.id));
				},
			};

			const mkTokDoc19 = (id, actor, x, y, w = 1, h = 1) => {
				const flags = { "lancer-cn": {} };
				const doc = {
					id,
					name: actor.name,
					x,
					y,
					width: w,
					height: h,
					hidden: false,
					isOwner: true,
					parent: scene19,
					actor,
					actorId: actor.id,
					regions: new Set(),
					flags,
					getFlag: (sc, k) => flags[sc]?.[k],
					setFlag: async (sc, k, v) => { (flags[sc] ||= {})[k] = v; },
					unsetFlag: async (sc, k) => { if (flags[sc]) delete flags[sc][k]; },
				};
				actor.token = doc;
				return doc;
			};

			const mkMech19 = (id, name) => {
				const statuses = new Set();
				return {
					id,
					name,
					type: "mech",
					isOwner: true,
					statuses,
					system: { hp: { value: 12, max: 12 }, structure: { value: 4, max: 4 } },
					toggleStatusEffect: async (sid, { active }) => { active ? statuses.add(sid) : statuses.delete(sid); },
				};
			};

			const allyA = mkMech19("m_ally_a", "友军甲");
			const allyB = mkMech19("m_ally_b", "友军乙");
			const jerichoActor = mkDepActor("耶利哥展开掩体", "dep_耶利哥展开掩体");
			const tokAllyA = mkTokDoc19("tok_a", allyA, 200, 100); // 格子 (1, 2)
			const tokAllyB = mkTokDoc19("tok_b", allyB, 500, 100); // 格子 (1, 5)
			const tokJericho = mkTokDoc19("tok_jer", jerichoActor, 100, 100); // 格子 (1, 1)，与友军甲邻接！
			scene19.tokens.push(tokAllyA, tokAllyB, tokJericho);
			ctx.canvas = { scene: scene19, grid: grid19, tokens: { controlled: [], placeables: [] } };

			// 2a) 拖出耶利哥掩体：生成周围 8 格环状硬掩护区（不含自身 1,1），邻接友军甲自动获得 cover_hard，耶利哥自身不获得 cover_hard！
			await L.onCoverAuraCreateToken(tokJericho);
			const regJer = L.findBoundCoverRegions(scene19, "tok_jer")[0];
			ok(Boolean(regJer) && regJer.shapes.length === 8 && !regJer.getFlag("lancer-cn", "auraCellKeys").includes("1,1"), `耶利哥展开掩体拖出后生成 8 格环状硬掩护区且不含自身格 (1,1)`);
			ok(allyA.statuses.has("cover_hard") && !allyB.statuses.has("cover_hard") && !jerichoActor.statuses.has("cover_hard"), "邻接掩体的友军甲自动获得硬性掩护，远处友军乙无掩护，且耶利哥掩体自身不误吃 -2 硬性掩护");

			// 2b) 拖动耶利哥掩体从 (100,100) 移到 (400,100)（格子 1,4，邻接友军乙 1,5）：掩护区跟着平移，友军甲自动摘除硬掩护，友军乙自动获得硬掩护！
			tokJericho.x = 400; tokJericho.y = 100;
			await L.onCoverAuraTokenUpdate(tokJericho, { x: 400, y: 100 });
			ok(scene19.regions.length === 1 && regJer.getFlag("lancer-cn", "auraCellKeys").includes("1,5") && !regJer.getFlag("lancer-cn", "auraCellKeys").includes("1,2"), "拖动召唤物后绑定的同一个 Region 实时跟随平移至新位置");
			ok(!allyA.statuses.has("cover_hard") && allyB.statuses.has("cover_hard"), "召唤物移走后原邻接友军甲自动摘除硬掩护，新邻接友军乙自动挂上硬掩护");

			// 2c) 召唤物被打爆（HP 归零）：自动移除掩护区并摘除友军乙硬掩护；修复回血（HP -> 10）：自动重建掩护区并恢复友军乙硬掩护！
			jerichoActor.system.hp.value = 0;
			await L.onCoverAuraActorUpdate(jerichoActor, { system: { hp: { value: 0 } } });
			ok(L.findBoundCoverRegions(scene19, "tok_jer").length === 0 && !allyB.statuses.has("cover_hard"), "召唤物 HP 归零（摧毁）但棋子未删时，自动移除绑定的掩护区并摘除周边硬掩护");

			jerichoActor.system.hp.value = 10;
			await L.onCoverAuraActorUpdate(jerichoActor, { system: { hp: { value: 10 } } });
			ok(L.findBoundCoverRegions(scene19, "tok_jer").length === 1 && allyB.statuses.has("cover_hard"), "召唤物回血修复后自动恢复跟随掩护区");

			// 2d) 盾牌阵列无人机（自身受益）与便携式地堡（仅内部受益、建筑自身不挂状态）对比验证
			const shieldActor = mkDepActor("盾牌阵列无人机", "dep_盾牌阵列无人机", "", "Drone");
			const tokShield = mkTokDoc19("tok_shd", shieldActor, 0, 400, 2, 2);
			scene19.tokens.push(tokShield);
			await L.onCoverAuraCreateToken(tokShield);
			ok(shieldActor.statuses.has("cover_hard"), "盾牌阵列无人机明确写明自身也算作拥有硬性掩护，部署后自身自动获得 cover_hard");

			const bunkerActor = mkDepActor("便携式地堡", "dep_便携式地堡");
			const allyInside = mkMech19("m_inside", "地堡内机甲");
			const tokInside = mkTokDoc19("tok_in", allyInside, 500, 500, 1, 1);
			const tokBunker = mkTokDoc19("tok_bnk", bunkerActor, 400, 400, 4, 4);
			scene19.tokens.push(tokInside, tokBunker);
			await L.onCoverAuraCreateToken(tokBunker);
			ok(allyInside.statuses.has("cover_hard") && !bunkerActor.statuses.has("cover_hard"), "便携式地堡覆盖自身 4×4 占地格，内部机甲自动获硬性掩护，地堡自身不挂硬掩护状态");

			// 2e) 烟雾发生器一键扩圈（爆发 1 -> 爆发 2 -> 关闭）与机甲手动绑定 + 删除棋子自动清理
			const smokeActor = mkDepActor("烟雾发生器", "dep_烟雾发生器");
			const tokSmoke = mkTokDoc19("tok_smk", smokeActor, 800, 800, 1, 1);
			scene19.tokens.push(tokSmoke);
			await L.onCoverAuraCreateToken(tokSmoke);
			ok(L.findBoundCoverRegions(scene19, "tok_smk")[0]?.shapes.length === 9, "烟雾发生器初始生成爆发 1（自身+8邻接=9格）软性掩护区");
			await L.applyCoverAuraPreset(tokSmoke, "soft_b2");
			ok(L.findBoundCoverRegions(scene19, "tok_smk")[0]?.shapes.length === 25, "烟雾发生器一键切换预设为爆发 2（25格）软性掩护区");
			await L.applyCoverAuraPreset(tokSmoke, "off");
			ok(L.findBoundCoverRegions(scene19, "tok_smk").length === 0, "一键切换关闭后立即移除该指示物的掩护区，且后续不再误自动重建");

			// 为普通机甲手动绑定邻接硬掩护圈（如「守卫者」机甲），再删除棋子自动清理
			await L.applyCoverAuraPreset(tokAllyA, "hard_ring1");
			ok(L.findBoundCoverRegions(scene19, "tok_a").length === 1, "普通机甲也可通过快捷预设手动绑定跟随硬掩护圈");
			scene19.tokens = scene19.tokens.filter(t => t.id !== "tok_jer");
			await L.onCoverAuraDeleteToken(tokJericho);
			ok(L.findBoundCoverRegions(scene19, "tok_jer").length === 0 && !allyB.statuses.has("cover_hard"), "删除召唤物棋子后自动销毁其绑定的掩护区并更新受影响角色状态");

			// 3) Token HUD 盾牌按钮与部署物角色表「跟随掩护区域」卡片注入检查
			const hudAppended = [];
			const mockHudCol = { append: el => hudAppended.push(el) };
			const mockHudRoot = {
				ownerDocument: {
					createElement: () => ({ type: "", className: "", dataset: {}, title: "", innerHTML: "", addEventListener() {} }),
				},
				querySelector: sel => (sel === ".lancer-cn-hud-cover-aura" ? null : sel === ".col.left" ? mockHudCol : null),
			};
			L.onRenderTokenHUD({ object: { document: tokShield } }, mockHudRoot);
			ok(hudAppended.length === 1 && hudAppended[0].className.includes("lancer-cn-hud-cover-aura") && hudAppended[0].className.includes("active"), "右键 Token HUD 注入跟随掩护圈盾牌图标并高亮已启用状态");

			const depCardHtml = L.deployableCoverAuraCardHTML(smokeActor);
			ok(depCardHtml.includes("跟随掩护区域") && depCardHtml.includes('data-lancer-cn-cover-aura="preset:soft_b2"') && depCardHtml.includes('data-lancer-cn-cover-aura="preset:hard_ring1"'), "部署物角色表生成「跟随掩护区域」快捷预设控制卡片");

			ctx.ui = prevUi19;
			ctx.game.user.isGM = prevIsGM19;
			ctx.game.users = prevUsers19;
			ctx.canvas = prevCanvas19;
		}

		// ---- v1.19.1 锥形（扇形，Cone）范围模板几何外框与六角格零断层高亮回归测试
		{
			const L = ctx.LancerCN;
			const prevCanvasCone = ctx.canvas;
			const prevConfigCone = ctx.CONFIG;
			const prevFoundryCone = ctx.foundry;
			const prevLancerCone = ctx.game.lancer;

			const mkTestHexGrid = ({ columns = false, even = false, size = 100 } = {}) => {
				const SQRT3 = Math.sqrt(3);
				const sizeX = columns ? (2 / SQRT3) * size : size;
				const sizeY = columns ? size : (2 / SQRT3) * size;
				return {
					type: columns ? (even ? 5 : 4) : (even ? 3 : 2),
					isHexagonal: true,
					isSquare: false,
					isGridless: false,
					columns,
					even,
					size,
					sizeX,
					sizeY,
					distance: 1,
					getCenterPoint(off) {
						const { i, j } = off;
						if (!columns) {
							const shift = (((i & 1) !== 0) !== even) ? 0.5 : 0;
							return { x: (j + shift + 0.5) * sizeX, y: (0.75 * i + 0.5) * sizeY };
						}
						const shift = (((j & 1) !== 0) !== even) ? 0.5 : 0;
						return { x: (0.75 * j + 0.5) * sizeX, y: (i + shift + 0.5) * sizeY };
					},
					getTopLeftPoint(off) {
						const c = this.getCenterPoint(off);
						return { x: c.x - sizeX / 2, y: c.y - sizeY / 2 };
					},
					getOffset(pt) {
						const approxI = !columns ? Math.round((pt.y / sizeY - 0.5) / 0.75) : Math.round(pt.y / sizeY - 0.5);
						const approxJ = !columns ? Math.round(pt.x / sizeX - 0.5) : Math.round((pt.x / sizeX - 0.5) / 0.75);
						let best = { i: approxI, j: approxJ }, bestD = Infinity;
						for (let di = -2; di <= 2; di++) {
							for (let dj = -2; dj <= 2; dj++) {
								const cand = { i: approxI + di, j: approxJ + dj };
								const c = this.getCenterPoint(cand);
								const d = (c.x - pt.x) ** 2 + (c.y - pt.y) ** 2;
								if (d < bestD) { bestD = d; best = cand; }
							}
						}
						return best;
					},
				};
			};

			// 1) 四种六角网格（尖顶/平顶 × 奇偶偏移）全角度几何不变量校验：不含起点、第 1 格零断层、轴向对称扇面与斜向等边三角锥
			let allModesPass = true;
			for (const columns of [false, true]) {
				for (const even of [false, true]) {
					const g = mkTestHexGrid({ columns, even, size: 100 });
					const origOff = { i: 5, j: 5 };
					const O = g.getCenterPoint(origOff);
					for (let deg = 0; deg < 360; deg += 15) {
						const c3 = L.computeLancerHexConeOffsets(g, O, deg, 3);
						const hasOrig = c3.some(o => o.i === origOff.i && o.j === origOff.j);
						const adjCount = c3.filter(o => {
							const p = g.getCenterPoint(o);
							return Math.hypot(p.x - O.x, p.y - O.y) <= 105;
						}).length;
						if (hasOrig || adjCount !== 1 || (c3.length !== 6 && c3.length !== 7)) {
							allModesPass = false;
							break;
						}
					}
				}
			}
			ok(allModesPass, "全部 4 种六角格朝向下，锥形 3 在 0°~345° 均绝不含发射起点格、第 1 格恒为紧贴起点的 1 格（无空洞断层）、总格数恒为 6 或 7 格");

			const pointyGrid = mkTestHexGrid({ columns: false, even: false, size: 100 });
			const pointyOrig = pointyGrid.getCenterPoint({ i: 4, j: 4 });
			const c3At0 = L.computeLancerHexConeOffsets(pointyGrid, pointyOrig, 0, 3);
			const c3At65 = L.computeLancerHexConeOffsets(pointyGrid, pointyOrig, 65, 3);
			const c3At90 = L.computeLancerHexConeOffsets(pointyGrid, pointyOrig, 90, 3);
			ok(c3At0.length === 7 && c3At65.length === 7, `尖顶六角格 0° 与 65° 的锥形 3 均为 1+3+3=7 格对称扇面（修复第 2 格缩成单格细颈，实际 ${c3At0.length} / ${c3At65.length}）`);
			const d1At90 = c3At90.filter(o => {
				const p = pointyGrid.getCenterPoint(o);
				return Math.hypot(p.x - pointyOrig.x, p.y - pointyOrig.y) <= 105;
			});
			ok(c3At90.length === 6 && d1At90.length === 1, `尖顶六角格 90° 的锥形 3 为 1+2+3=6 格标准等边六角锥，且第 1 格存在 1 个邻接格（消除原截图 90° 空洞断层）`);

			const flatGrid = mkTestHexGrid({ columns: true, even: false, size: 100 });
			const flatOrig = flatGrid.getCenterPoint({ i: 4, j: 4 });
			const flatAt90 = L.computeLancerHexConeOffsets(flatGrid, flatOrig, 90, 5);
			const flatAt0 = L.computeLancerHexConeOffsets(flatGrid, flatOrig, 0, 5);
			ok(flatAt90.length === 17 && flatAt0.length === 15, `平顶六角格锥形 5 在 90°（邻接轴）为 17 格对称扇面、在 0°（顶点方向）为 15 格等边三角锥`);

			// 2) MeasuredTemplate._computeShape 圆弧扇形外框、_getGridHighlightPositions 与 WeaponRangeTemplate.fromRange 角度修正
			class MockBaseMeasuredTemplate {
				constructor(document) {
					this.document = document;
					this.ray = { distance: (Number(document.distance) || 0) * 100 };
				}
				_computeShape() {
					// 模拟 Foundry 原生返回歪斜四边形风筝（仅 4 个顶点 = 10 个坐标）
					return { points: [0, 0, 260, -150, 346, 0, 260, 150, 0, 0], kind: "minkowski_kite" };
				}
				_getGridHighlightPositions() {
					// 模拟方格原生包含起点格 (100, 100) 与前方 3 格
					return [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 300, y: 100 }, { x: 300, y: 200 }];
				}
			}
			class MockWeaponRangeTemplate extends MockBaseMeasuredTemplate {
				static fromRange(range) {
					const isSq = Boolean(ctx.canvas?.grid?.isSquare);
					const doc = {
						t: range.type === "Cone" ? "cone" : "circle",
						distance: Number(range.val),
						direction: 0,
						angle: isSq ? 51 : 59,
						x: 0,
						y: 0,
						flags: { lancer: { range } },
						getFlag(sc, k) { return this.flags?.[sc]?.[k]; },
						updateSource(patch) { Object.assign(this, patch); },
					};
					return new this(doc);
				}
			}

			let targetedResultIds = [];
			let origTargetsCalledWith = null;
			ctx.CONFIG = { ...(prevConfigCone || {}), MeasuredTemplate: { objectClass: MockBaseMeasuredTemplate, defaults: { angle: 53.13 } } };
			ctx.foundry = { ...(prevFoundryCone || {}), canvas: { ...(prevFoundryCone?.canvas || {}), placeables: { MeasuredTemplate: MockBaseMeasuredTemplate } } };
			ctx.canvas = {
				ready: true,
				grid: pointyGrid,
				dimensions: { size: 100, distance: 1, distancePixels: 100 },
				scene: {
					dimensions: { distance: 1 },
					templates: new Map(),
					getEmbeddedDocument(_type, id) { return this.templates.get(id); },
				},
				templates: { get(id) { return ctx.canvas.scene.templates.get(id)?.object; } },
				tokens: {
					placeables: [],
					setTargets: ids => { targetedResultIds = Array.from(ids); },
				},
			};
			ctx.game.lancer = {
				...(prevLancerCone || {}),
				canvas: { WeaponRangeTemplate: MockWeaponRangeTemplate },
				targetsFromTemplate: id => { origTargetsCalledWith = id; },
			};
			L.patchWeaponRangeTemplate();

			const wrtHex = ctx.game.lancer.canvas.WeaponRangeTemplate.fromRange({ type: "Cone", val: "3" });
			ok(wrtHex.document.angle === 60 && ctx.CONFIG.MeasuredTemplate.defaults.angle === 60, `六角格下 WeaponRangeTemplate 与默认锥角自动修正为 60°（替代上游 59° / 53.13°）`);
			wrtHex.document.updateSource({ x: pointyOrig.x, y: pointyOrig.y, direction: 65 });
			const smoothPoly = wrtHex._computeShape();
			const arcSteps = smoothPoly.points.length / 2 - 3;
			const midIdx = 2 + (arcSteps / 2) * 2;
			const midX = smoothPoly.points[midIdx], midY = smoothPoly.points[midIdx + 1];
			const expX = 300 * Math.cos((65 * Math.PI) / 180), expY = 300 * Math.sin((65 * Math.PI) / 180);
			ok(
				smoothPoly.kind !== "minkowski_kite" &&
				smoothPoly.points.length >= 68 &&
				smoothPoly.points[0] === 0 && smoothPoly.points[1] === 0 &&
				Math.hypot(midX - expX, midY - expY) < 0.01 &&
				smoothPoly.contains(expX * 0.9, expY * 0.9) &&
				!smoothPoly.contains(-50, 0),
				"锥形 _computeShape 输出平滑圆弧扇形多边形（替代歪斜四边形风筝），且圆弧正中顶点精确对齐距离手柄点"
			);

			const circleTmpl = new MockBaseMeasuredTemplate({ t: "circle", distance: 2 });
			ok(circleTmpl._computeShape().kind === "minkowski_kite", "非锥形模板（circle/ray）保持原生 _computeShape 不受影响");

			const hlHex90Doc = {
				id: "tmpl_c90",
				t: "cone",
				x: pointyOrig.x,
				y: pointyOrig.y,
				direction: 90,
				distance: 3,
				angle: 60,
				flags: { lancer: { range: { type: "Cone", val: 3 }, ignore: { tokens: ["tok_caster"], dispositions: [] } } },
				getFlag(sc, k) { return this.flags?.[sc]?.[k]; },
			};
			const hlHex90Obj = new MockBaseMeasuredTemplate(hlHex90Doc);
			hlHex90Doc.object = hlHex90Obj;
			const hlPts90 = hlHex90Obj._getGridHighlightPositions();
			const hlOffs90 = hlPts90.map(pt => pointyGrid.getOffset({ x: pt.x + pointyGrid.sizeX / 2, y: pt.y + pointyGrid.sizeY / 2 }));
			ok(hlOffs90.length === 6 && !hlOffs90.some(o => o.i === 4 && o.j === 4), "已放置的原生 MeasuredTemplate 实例在尖顶 90° 同样输出 6 个无断层六角格左顶点且排除起点格");

			// 3) targetsFromTemplate 自动索敌：精确锁定高亮六角格上的全部可见敌军（含外包围盒外的边角格），忽略起点与发射者
			const nearEnemyCenter = pointyGrid.getCenterPoint(hlOffs90[0]);
			const farCornerCenter = pointyGrid.getCenterPoint(hlOffs90[hlOffs90.length - 1]);
			const outsideCenter = pointyGrid.getCenterPoint({ i: 0, j: 0 });
			ctx.canvas.scene.templates.set("tmpl_c90", hlHex90Doc);
			ctx.canvas.tokens.placeables = [
				{ id: "tok_caster", isVisible: true, center: pointyOrig, document: { disposition: 1 } },
				{ id: "tok_orig_ally", isVisible: true, center: pointyOrig, document: { disposition: 1 } },
				{ id: "tok_d1_enemy", isVisible: true, center: nearEnemyCenter, document: { disposition: -1 } },
				{ id: "tok_d3_corner", isVisible: true, center: farCornerCenter, document: { disposition: -1 } },
				{ id: "tok_hidden", isVisible: false, center: nearEnemyCenter, document: { disposition: -1, hidden: true } },
				{ id: "tok_outside", isVisible: true, center: outsideCenter, document: { disposition: -1 } },
			];
			ctx.game.lancer.targetsFromTemplate("tmpl_c90");
			ok(
				targetedResultIds.join(",") === "tok_d1_enemy,tok_d3_corner",
				`锥形 targetsFromTemplate 精准锁定第 1 格与远端边角格敌军，不误锁起点格友军、发射者或不可见单位（实际 ${targetedResultIds.join(",")}）`
			);

			// 非锥形模板继续走原生 targetsFromTemplate
			const circleDoc = { id: "tmpl_cir", t: "circle", object: circleTmpl };
			ctx.canvas.scene.templates.set("tmpl_cir", circleDoc);
			ctx.game.lancer.targetsFromTemplate("tmpl_cir");
			ok(origTargetsCalledWith === "tmpl_cir", "非锥形模板调用 targetsFromTemplate 时正常透传给原生实现");

			// 4) 方格（Square Grid）兼容：角度为 53.13°，且自动剔除发射起点方格 (1, 1)
			const sqGrid = {
				type: 1,
				isHexagonal: false,
				isSquare: true,
				isGridless: false,
				size: 100,
				sizeX: 100,
				sizeY: 100,
				distance: 1,
				getOffset: pt => ({ i: Math.floor(pt.y / 100), j: Math.floor(pt.x / 100) }),
			};
			ctx.canvas.grid = sqGrid;
			const wrtSq = ctx.game.lancer.canvas.WeaponRangeTemplate.fromRange({ type: "Cone", val: 3 });
			wrtSq.document.updateSource({ x: 150, y: 150, direction: 0 });
			const sqHl = wrtSq._getGridHighlightPositions();
			ok(
				Math.abs(wrtSq.document.angle - 53.13) < 0.01 &&
				sqHl.length === 3 &&
				!sqHl.some(p => p.x === 100 && p.y === 100),
				"方格地图下锥形角度设为 53.13°，且 _getGridHighlightPositions 自动排除发射者所在起点方格"
			);

			ctx.game.lancer = prevLancerCone;
			ctx.foundry = prevFoundryCone;
			ctx.CONFIG = prevConfigCone;
			ctx.canvas = prevCanvasCone;
		}

		// ---- v1.19.2 目标选择面板一键投掷/掷骰确认与 AccDiffHudTarget(targetUuid) 解析回归测试
		{
			const L = ctx.LancerCN;
			const prevDoc192 = ctx.document;
			const prevCanvas192 = ctx.canvas;
			const prevFromUuidSync192 = ctx.fromUuidSync;
			const prevTargets192 = ctx.game.user.targets;

			const knifeItem = {
				id: "w_knife",
				name: "战术匕首",
				type: "mech_weapon",
				is_mech_weapon: () => true,
				system: {
					lid: "mw_tactical_knife",
					size: "Auxiliary",
					active_profile: {
						type: "Melee",
						range: [{ type: "Threat", val: 1 }],
						tags: [{ lid: "tg_thrown", val: "3", is_thrown: true }],
						all_tags: [{ lid: "tg_thrown", val: "5", is_thrown: true }],
					},
				},
				currentProfile() { return this.system.active_profile; },
			};
			const hunterPilot = {
				type: "pilot",
				items: [{ type: "talent", system: { lid: "t_hunter", curr_rank: 2 } }],
			};
			const knifeMech = {
				id: "m_knife",
				uuid: "Actor.m_knife",
				name: "猎人机甲",
				type: "mech",
				is_mech: () => true,
				isOwner: true,
				statuses: new Set(),
				items: [knifeItem],
				getFlag: () => undefined,
				system: {
					pilot: { value: hunterPilot },
					loadout: { frame: { value: { system: { lid: "mf_standard_pattern_i_everest" } } } },
				},
			};
			knifeItem.actor = knifeMech;

			const selfTok = { id: "tok_self", center: { x: 50, y: 50 }, actor: knifeMech, visible: true, document: { uuid: "Scene.s1.Token.tok_self", name: "猎人机甲", disposition: 1 } };
			const scoutActor = {
				id: "a_scout",
				uuid: "Actor.a_scout",
				name: "斥侯",
				type: "npc",
				statuses: new Set(["slow"]),
				getFlag: () => undefined,
				system: { statuses: { slow: true } },
			};
			const scoutTok = { id: "tok_scout", center: { x: 550, y: 50 }, actor: scoutActor, visible: true, document: { id: "tok_scout", uuid: "Scene.s1.Token.tok_scout", name: "斥侯", disposition: -1, object: null } };
			scoutTok.document.object = scoutTok;

			ctx.canvas = {
				grid: {
					size: 100,
					distance: 1,
					isGridless: false,
					getOffset: pt => ({ i: Math.floor(pt.y / 100), j: Math.floor(pt.x / 100) }),
					getCenterPoint: off => ({ x: off.j * 100 + 50, y: off.i * 100 + 50 }),
					measurePath: ([a, b]) => ({ spaces: Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 100) }),
				},
				tokens: {
					controlled: [selfTok],
					placeables: [selfTok, scoutTok],
					get: id => (id === "tok_scout" ? scoutTok : id === "tok_self" ? selfTok : null),
				},
			};
			ctx.fromUuidSync = u => (u === "Scene.s1.Token.tok_scout" ? scoutTok.document : prevFromUuidSync192?.(u));

			// 1) 当 AccDiffHudTarget 仅有 targetUuid（无 target 属性，与真实 Foundry LANCER v3.1.3 一致）且 game.user.targets 为空时，syncWeaponThrownMode 仍能准确测出 5 格 > 威胁 1 并开启投掷
			ctx.game.user.targets = new Set();
			const flowState = {
				actor: knifeMech,
				item: knifeItem,
				data: {
					attack_type: "Melee",
					acc_diff: {
						weapon: { melee: true, thrown: false, seeking: false },
						base: { accuracy: 0, difficulty: 0 },
						targets: [{ targetUuid: "Scene.s1.Token.tok_scout", accuracy: 0, difficulty: 0, cover: 1 }],
					},
				},
			};
			L.syncWeaponThrownMode(flowState);
			ok(flowState.data.acc_diff.weapon.thrown === true, "AccDiffHudTarget 仅含 targetUuid 时，syncWeaponThrownMode 仍准确解析 5 格距离并自动勾选 thrown=true");

			// 2) 目标面板针对 5 格目标渲染「投掷攻击」模式提示栏、「投掷射程内」标签与「🗡️ 投掷攻击」确认按钮，并支持手动切换与一键提交右侧 HUD
			const mockSession = {
				flow: { constructor: { name: "WeaponAttackFlow" }, state: flowState },
				kind: "WeaponAttackFlow",
				actor: knifeMech,
				token: selfTok,
				reach: 5,
				rangeLabel: "威胁 1 / 投掷 5",
				aoe: [],
				collapsed: false,
				title: "攻击：战术匕首",
				lastIds: [],
			};
			const tpRows = [
				{ token: scoutTok, id: "tok_scout", name: "斥侯", img: "", side: "enemy", distance: 5, inRange: true, targeted: true, last: false },
			];
			const tpThrownHtml = L.targetPanelHTML(mockSession, tpRows);
			ok(
				tpThrownHtml.includes("投掷攻击") &&
				tpThrownHtml.includes("5 格 · 投掷射程内") &&
				tpThrownHtml.includes('data-act="toggle-thrown"') &&
				tpThrownHtml.includes('data-act="submit-hud"') &&
				tpThrownHtml.includes("🗡️ 投掷攻击"),
				"目标面板在选中 5 格目标时清晰显示「投掷攻击」状态栏、「5 格 · 投掷射程内」标识与底部「🗡️ 投掷攻击」一键开火按钮"
			);

			const prevPickerSetting = log.settingValues["lancer-cn.targetPicker"];
			log.settingValues["lancer-cn.targetPicker"] = true;
			ctx.game.user.targets = new Set([scoutTok]);
			class WeaponAttackFlow {
				constructor() { this.state = flowState; }
			}
			const wfInst = new WeaponAttackFlow();
			L.openTargetPicker(wfInst);
			const toggledVal = L.toggleTargetPanelThrownMode();
			ok(toggledVal === false && flowState.data.acc_diff.weapon.thrown === false, "点击「切为近战」可手动切换为近战模式并同步改写右侧面板 weapon.thrown=false");
			const toggledBack = L.toggleTargetPanelThrownMode();
			ok(toggledBack === true && flowState.data.acc_diff.weapon.thrown === true, "再次点击「切为投掷」恢复投掷模式并同步 weapon.thrown=true");
			let hudSubmitClicked = 0;
			const fakeSubmitBtn = { click() { hudSubmitClicked += 1; } };
			const fakeForm = { querySelector: sel => (sel.includes("submit") ? fakeSubmitBtn : null) };
			ctx.document = {
				getElementById: () => null,
				querySelector: sel => (sel === "#accdiff-hud" ? fakeForm : null),
			};
			ok(L.submitActiveHud() === true && hudSubmitClicked === 1, "点击目标面板「🗡️ 投掷攻击」按钮直接触发右侧 #accdiff-hud 的掷骰提交");
			ctx.document = prevDoc192;
			L.closeTargetPicker(wfInst, false);
			log.settingValues["lancer-cn.targetPicker"] = prevPickerSetting;

			ctx.game.user.targets = prevTargets192;
			ctx.fromUuidSync = prevFromUuidSync192;
			ctx.canvas = prevCanvas192;
			ctx.document = prevDoc192;
		}

		// ---- v1.19.3 崩溃检定（Cascade Check）死按钮消除、天赋 NHP 支持与失效 Token UUID 兜底回归测试
		{
			const L = ctx.LancerCN;
			const prevUi193 = ctx.ui;
			const prevActors193 = ctx.game.actors;
			const prevFromUuidSync193 = ctx.fromUuidSync;
			const prevLancer193 = ctx.game.lancer;

			const infoLogs193 = [];
			ctx.ui = {
				notifications: {
					info: m => { infoLogs193.push(String(m)); },
					warn: m => { infoLogs193.push(String(m)); },
					error: m => { infoLogs193.push(String(m)); },
				},
			};

			const mkCascMech = (id, name, { items = [], pilotItems = [], type = "mech" } = {}) => {
				const flags = { "lancer-cn": {} };
				const statuses = new Set();
				const itemArr = [...items];
				itemArr.get = iid => itemArr.find(x => x.id === iid);
				return {
					id,
					uuid: `Actor.${id}`,
					name,
					type,
					isOwner: true,
					is_mech: () => type === "mech",
					is_npc: () => type === "npc",
					statuses,
					items: itemArr,
					getFlag: (sc, k) => flags[sc]?.[k],
					setFlag: async (sc, k, v) => { (flags[sc] ||= {})[k] = v; },
					unsetFlag: async (sc, k) => { if (flags[sc]) delete flags[sc][k]; },
					toggleStatusEffect: async (sid, { active }) => { active ? statuses.add(sid) : statuses.delete(sid); },
					update: async () => {},
					system: {
						heat: { value: 2, max: 6 },
						pilot: { value: { type: "pilot", items: pilotItems } },
					},
				};
			};

			// 1) COMP/CON、科技狂热者 III、已损毁 NHP 与 NPC：均判定为不可崩溃并给出对应中文原因，点击旧卡片按钮弹出明确提示而不静默失效
			const compconMech = mkCascMech("m_cc", "助理号", {
				items: [{ id: "i_cc", name: "COMP/CON 级助理单元", type: "mech_system", isAI: () => true, system: { lid: "ms_comp_con_class_assistant_unit", tags: [{ lid: "tg_ai" }] } }],
			});
			const tech3Mech = mkCascMech("m_t3", "启蒙号", {
				items: [{ id: "i_osiris", name: "欧西里斯级 NHP", type: "mech_system", isAI: () => true, system: { lid: "ms_osiris_class_nhp", tags: [{ lid: "tg_ai" }] } }],
				pilotItems: [{ type: "talent", system: { lid: "t_technophile", curr_rank: 3 } }],
			});
			const destroyedNhpMech = mkCascMech("m_dest", "战损号", {
				items: [{ id: "i_nhp_d", name: "塞赫美特级 NHP", type: "mech_system", isAI: () => true, system: { lid: "ms_sekhmet_class_nhp", destroyed: true, tags: [{ lid: "tg_ai" }] } }],
			});
			const aiNpc = mkCascMech("n_ai", "AI敌兵", {
				type: "npc",
				items: [{ id: "i_npc_ai", name: "战术心智", type: "mech_system", isAI: () => true, system: { lid: "npcf_ai", tags: [{ lid: "tg_ai" }] } }],
			});

			ok(!L.collectCascadeableSources(compconMech).eligible && L.collectCascadeableSources(compconMech).blockedReason.includes("免疫层流"), "仅携带 COMP/CON 助理单元时判定无需层流检定");
			ok(!L.collectCascadeableSources(tech3Mech).eligible && L.collectCascadeableSources(tech3Mech).blockedReason.includes("科技狂热者 III"), "具备科技狂热者 III 时判定全部 NHP 免疫崩溃");
			ok(!L.collectCascadeableSources(destroyedNhpMech).eligible && L.collectCascadeableSources(destroyedNhpMech).blockedReason.includes("已损毁"), "NHP 已在系统创伤中损毁时明确提示已损毁原因");
			ok(!L.collectCascadeableSources(aiNpc).eligible, "NPC 角色不生成崩溃检定按钮");

			ctx.fromUuidSync = u => (u === compconMech.uuid ? compconMech : null);
			infoLogs193.length = 0;
			const ccRes = await L.executeCascadeCheck(compconMech.uuid);
			ok(ccRes === false && infoLogs193.some(m => m.includes("COMP/CON")), "点击旧结构卡上仅含 COMP/CON 机甲的崩溃检定按钮时，立即弹出中文原因提示而不再静默无反应");

			// 2) 驾驶员天赋自带 NHP（偶像破坏者 II「不稳定 NHP」、科技狂热者 II「学生级 NHP」）自动插入按钮并可正常掷骰与关机稳定
			const iconoMech = mkCascMech("m_icono", "狂信机甲", {
				pilotItems: [
					{ type: "talent", system: { lid: "t_iconoclast", curr_rank: 2 } },
					{ type: "talent", system: { lid: "t_technophile", curr_rank: 2 } },
				],
			});
			const iconoSrc = L.collectCascadeableSources(iconoMech);
			ok(iconoSrc.eligible === true && iconoSrc.talentNhps.length === 2, "科技狂热者 II「学生级 NHP」与偶像破坏者 II「不稳定 NHP」均识别为可崩溃 NHP");

			const cascSteps = new Map([
				["structureInsertCascadeRollButton", async () => true],
				["initCascadeData", async () => false],
				["cascadeRoll", async st => { st.data.result = { roll: { total: 1 } }; return true; }],
				["cascadeUpdateItems", async () => true],
			]);
			ctx.game.lancer = { ...(prevLancer193 || {}), flowSteps: cascSteps, flows: new Map() };
			L.patchLancerFlows();

			const structBtnStateCompcon = { actor: compconMech, data: { embedButtons: [] } };
			await cascSteps.get("structureInsertCascadeRollButton")(structBtnStateCompcon, {});
			ok(structBtnStateCompcon.data.embedButtons.length === 0, "仅携带免崩溃 AI 的机甲在结构/过热卡上不再误插无效崩溃检定按钮");

			const structBtnStateIcono = { actor: iconoMech, data: { embedButtons: [] } };
			await cascSteps.get("structureInsertCascadeRollButton")(structBtnStateIcono, {});
			ok(structBtnStateIcono.data.embedButtons.some(b => b.includes('data-flow-type="cascade"')), "仅携带天赋自带 NHP（不稳定/学生级 NHP）的机甲在结构/过热卡上自动补齐崩溃检定按钮");

			const initIconoSt = { actor: iconoMech, data: { ai_systems: [] } };
			const initIconoOk = await cascSteps.get("initCascadeData")(initIconoSt, {});
			await cascSteps.get("cascadeRoll")(initIconoSt, {});
			await cascSteps.get("cascadeUpdateItems")(initIconoSt, {});
			ok(initIconoOk === true && initIconoSt.data.desc.includes("不稳定 NHP") && !L.collectCascadeableSources(iconoMech).eligible, "天赋 NHP 崩溃检定掷出 1 后写入崩溃状态并阻止重复检定");

			await L.beginBasicAction(iconoMech, "shutDown");
			ok(L.collectCascadeableSources(iconoMech).eligible === true, "执行「关机」动作后自动稳定崩溃中的天赋 NHP");

			// 3) 旧卡片携带已移除 Token 的失效 UUID（Scene.s_old.Token.t_gone.Actor.m_real）时，自动回退解析至 game.actors 中的基础机甲并正常触发 CascadeFlow
			const realNhpMech = mkCascMech("m_real", "重部署机甲", {
				items: [{ id: "i_os", name: "欧西里斯级 NHP", type: "mech_system", isAI: () => true, system: { lid: "ms_osiris_class_nhp", tags: [{ lid: "tg_ai" }] } }],
			});
			ctx.fromUuidSync = () => null; // 模拟旧 Token 已从场景删除，fromUuidSync 返回 null
			ctx.game.actors = { get: id => (id === "m_real" ? realNhpMech : null), [Symbol.iterator]: function* () { yield realNhpMech; } };
			let cascadeFlowActorPassed = null;
			class MockCascadeFlow {
				constructor(actorArg) { cascadeFlowActorPassed = actorArg; }
				async begin() { return true; }
			}
			ctx.game.lancer.flows = new Map([["CascadeFlow", MockCascadeFlow]]);
			let clickStopped = false;
			const mockCascadeBtn = {
				dataset: { flowType: "cascade", actorId: "Scene.s_old.Token.t_gone.Actor.m_real" },
				closest(sel) { return sel.includes("data-flow-type") ? this : null; },
			};
			L.onCascadeButtonClick({
				target: mockCascadeBtn,
				preventDefault() {},
				stopPropagation() {},
				stopImmediatePropagation() { clickStopped = true; },
			});
			await new Promise(r => setTimeout(r, 10));
			ok(clickStopped === true && cascadeFlowActorPassed === realNhpMech, "当卡片上的旧 Token UUID 已失效时，点击崩溃检定按钮仍自动回退解析至基础机甲角色并启动 CascadeFlow");

			ctx.game.lancer = prevLancer193;
			ctx.fromUuidSync = prevFromUuidSync193;
			ctx.game.actors = prevActors193;
			ctx.ui = prevUi193;
		}

		// ---- v1.20.0 核心规则书勘误与苏丹专业牌照同步回归测试
		{
			const L = ctx.LancerCN;
			const prevUi120 = ctx.ui;
			const prevLancer120 = ctx.game.lancer;
			const prevCombat120 = ctx.game.combat;
			const prevCanvas120 = ctx.canvas;
			const prevUser120 = ctx.game.user;
			const prevFromUuidSync120 = ctx.fromUuidSync;
			const prevChatMsg120 = ctx.ChatMessage;

			const warnLogs120 = [];
			ctx.ui = {
				notifications: {
					info: m => { warnLogs120.push(String(m)); },
					warn: m => { warnLogs120.push(String(m)); },
					error: m => { warnLogs120.push(String(m)); },
				},
			};

			const docMap120 = {};
			ctx.fromUuidSync = u => docMap120[u] ?? prevFromUuidSync120?.(u) ?? null;

			const mkPilot120 = (id, talents = [], coreBonuses = []) => ({
				id,
				uuid: `Actor.${id}`,
				type: "pilot",
				isOwner: true,
				items: [
					...talents.map(([lid, rank]) => ({ type: "talent", system: { lid, curr_rank: rank } })),
					...coreBonuses.map(lid => ({ type: "core_bonus", system: { lid } })),
				],
			});

			const mkMech120 = (id, name, { frameLid = "mf_standard_pattern_i_everest", pilot = null, items = [], hp = 12, hpMax = 12, struct = 4, structMax = 4, armor = 0, heat = 0, heatMax = 6, sensors = 10, statuses = [] } = {}) => {
				const flags = { "lancer-cn": {} };
				const stSet = new Set(statuses);
				const itemArr = [...items];
				itemArr.get = iid => itemArr.find(x => x.id === iid);
				const m = {
					id,
					uuid: `Actor.${id}`,
					name,
					type: "mech",
					isOwner: true,
					is_mech: () => true,
					is_npc: () => false,
					is_deployable: () => false,
					hasHeatcap: () => heatMax > 0,
					statuses: stSet,
					items: itemArr,
					getFlag: (sc, k) => flags[sc]?.[k],
					setFlag: async (sc, k, v) => { (flags[sc] ||= {})[k] = v; },
					unsetFlag: async (sc, k) => { if (flags[sc]) delete flags[sc][k]; },
					toggleStatusEffect: async (sid, { active }) => { active ? stSet.add(sid) : stSet.delete(sid); },
					update: async patch => {
						if (patch["system.heat.value"] !== undefined) m.system.heat.value = patch["system.heat.value"];
					},
					system: {
						armor,
						sensor_range: sensors,
						hp: { value: hp, max: hpMax },
						overshield: { value: 0 },
						structure: { value: struct, max: structMax },
						stress: { value: 4, max: 4 },
						heat: { value: heat, max: heatMax },
						burn: 0,
						statuses: {},
						action_tracker: { reaction: true },
						pilot: { value: pilot },
						loadout: { frame: { value: { system: { lid: frameLid } } } },
					},
				};
				for (const it of itemArr) {
					it.actor = m;
					it.parent = m;
					if (it.uuid) docMap120[it.uuid] = it;
				}
				docMap120[m.uuid] = m;
				return m;
			};

			const mkWpn120 = (id, name, lid, size, wType, { range = [{ type: "Range", val: 10 }], damage = [{ type: "Kinetic", val: "1d6" }], tags = [], profiles = null, selectedIdx = 0 } = {}) => {
				const profList = profiles ?? [{
					name,
					type: wType,
					range,
					damage,
					tags: tags.map(t => ({ ...t })),
					all_tags: tags.map(t => ({ ...t })),
				}];
				return {
					id,
					uuid: `Item.${id}`,
					name,
					type: "mech_weapon",
					is_mech_weapon: () => true,
					currentProfile: function () { return this.system.profiles[this.system.selected_profile_index] ?? this.system.active_profile; },
					getTags: function () { return this.currentProfile()?.all_tags ?? []; },
					getFlag: () => undefined,
					system: {
						lid,
						size,
						tags: tags.map(t => ({ ...t })),
						all_tags: tags.map(t => ({ ...t })),
						selected_profile_index: selectedIdx,
						active_profile: profList[selectedIdx] ?? profList[0],
						profiles: profList,
					},
				};
			};

			const createdCards120 = [];
			ctx.ChatMessage = {
				...(prevChatMsg120 || {}),
				getSpeaker: o => ({ actor: o?.actor?.name }),
				create: async data => {
					const f = JSON.parse(JSON.stringify(data.flags ?? {}));
					const msg = {
						id: `c120_${createdCards120.length}`,
						isAuthor: true,
						content: data.content ?? "",
						flags: f,
						getFlag: (sc, k) => f?.[sc]?.[k],
						setFlag: async (sc, k, v) => { (f[sc] ||= {})[k] = v; },
						updateSource: patch => {
							for (const [pk, pv] of Object.entries(patch ?? {})) {
								const segs = pk.split(".");
								let cur = msg;
								for (let si = 0; si < segs.length - 1; si++) cur = (cur[segs[si]] ||= {});
								cur[segs[segs.length - 1]] = pv;
							}
						},
					};
					L.onPreCreateBasicCard(msg);
					createdCards120.push(msg);
					await L.onCreateChatMessage(msg, {}, ctx.game.user?.id);
					return msg;
				},
			};

			const steps120 = new Map([
				["initActivationData", async st => { st.data ||= {}; return true; }],
				["initAttackData", async st => {
					st.data = {
						...(st.data || {}),
						attack_type: st.item?.currentProfile?.()?.type === "Melee" ? "Melee" : "Ranged",
						acc_diff: {
							base: { accuracy: 0, difficulty: 0 },
							weapon: { seeking: false, engaged: false, inaccurate: false, arcing: false },
							targets: st.targets ?? [],
						},
					};
					return true;
				}],
				["initTechAttackData", async st => {
					st.data = {
						...(st.data || {}),
						attack_type: "Tech",
						acc_diff: {
							base: { accuracy: 0, difficulty: 0 },
							targets: st.targets ?? [],
						},
					};
					return true;
				}],
				["initStatRollData", async st => {
					st.data ||= { path: st.path ?? "system.hull", acc_diff: { base: { accuracy: 0, difficulty: 0 } } };
					return true;
				}],
				["printStatRollCard", async () => true],
				["rollAttacks", async () => true],
				["printAttackCard", async st => {
					const targets = (st.cardTargets ?? []).map(t => ({ id: t.uuid, uuid: t.uuid, hit: Boolean(t.hit), crit: Boolean(t.crit) }));
					st._card = await ctx.ChatMessage.create({
						content: `<div class="lancer-attack"></div>`,
						flags: {
							lancer: {
								attackData: {
									attackerUuid: st.actor?.uuid,
									attackerItemUuid: st.item?.uuid ?? null,
									targets,
								},
							},
							...(st.extraCardFlags ? { "lancer-cn": st.extraCardFlags } : {}),
						},
					});
					return true;
				}],
				["printTechAttackCard", async st => {
					const targets = (st.cardTargets ?? []).map(t => ({ id: t.uuid, uuid: t.uuid, hit: Boolean(t.hit), crit: Boolean(t.crit) }));
					st._card = await ctx.ChatMessage.create({
						content: `<div class="lancer-tech-attack"></div>`,
						flags: {
							lancer: {
								attackData: {
									attackerUuid: st.actor?.uuid,
									attackerItemUuid: st.item?.uuid ?? null,
									invade: Boolean(st.data?.invade),
									targets,
								},
							},
						},
					});
					return true;
				}],
				["printDamageCard", async st => {
					if (typeof st.onPrint === "function") await st.onPrint();
					return true;
				}],
			]);
			ctx.game.lancer = { ...(prevLancer120 || {}), flowSteps: steps120, flows: new Map() };
			L.patchLancerFlows();

			// 1) 伏卧起身文案：明确标注不算作移动、不触发守望
			const standUpPlain = L.BASIC_ACTIONS.standUp.effect.replace(/<[^>]+>/g, "");
			ok(
				standUpPlain.includes("不算作移动") && standUpPlain.includes("不会触发守望"),
				"基础动作「起身」明确说明不算作移动且不触发守望"
			);

			// 2) 受扰（Jammed）与黑客 II（骇./杀、抑制维生系统、干扰驾驶舱）限制与解除
			ctx.game.user = { ...(prevUser120 || {}), id: "u120", isGM: false, targets: new Set() };
			const jammedMech = mkMech120("m_jam", "受扰机甲", { statuses: ["jammed"] });
			const allyJammed = mkMech120("m_jam_ally", "受扰友军", { statuses: ["jammed"] });
			const normalMech = mkMech120("m_norm", "支援机甲");
			ok(Boolean(L.techActionBlockReason(jammedMech)), "处于受扰（Jammed）状态的机甲被 techActionBlockReason 拦截科技动作");

			const jamTechAct = { actor: jammedMech, item: { name: "入侵", system: {} }, data: { action: { activation: "Quick Tech", name: "入侵" } } };
			ok(await steps120.get("initActivationData")(jamTechAct) === false, "非 GM 玩家在受扰状态下无法发起快速科技动作");

			const allyJamTok = { actor: allyJammed, document: { uuid: allyJammed.uuid, name: allyJammed.name } };
			ctx.game.user.targets = new Set([allyJamTok]);
			ok(await L.beginBasicAction(normalMech, "bolster") === false, "受扰友军无法受益于「强化（Bolster）」科技动作");
			ctx.game.user.targets = new Set();

			await L.setCombatState(normalMech, { hackSlashLocked: true, disableLifeSupport: true, jamCockpit: true });
			ok(Boolean(L.techActionBlockReason(normalMech)), "黑客 II「骇./杀」锁定期间阻止机甲进行科技动作");
			ok(await L.beginBasicAction(normalMech, "mountDismount") === false, "黑客 II「干扰驾驶舱」生效期间阻止驾驶员上下机甲");
			const saveRollSt = { actor: normalMech, data: { path: "system.hull", title: "机体豁免", acc_diff: { base: { accuracy: 0, difficulty: 0 } } } };
			await steps120.get("initStatRollData")(saveRollSt);
			ok(saveRollSt.data.acc_diff.base.difficulty === 1, "黑客 II「抑制维生系统」使所有豁免承受 +1 难度");

			await steps120.get("printStatRollCard")({ actor: normalMech, data: { path: "system.sys", title: "系统检定", result: { roll: { total: 12 } } } });
			ok(!L.getCombatState(normalMech).hackSlashLocked && !L.getCombatState(normalMech).disableLifeSupport, "成功通过系统检定（>=10）后自动解除「骇./杀」与「抑制维生系统」");
			await steps120.get("printStatRollCard")({ actor: normalMech, data: { path: "system.eng", title: "工程检定", result: { roll: { total: 10 } } } });
			ok(!L.getCombatState(normalMech).jamCockpit, "成功通过工程检定（>=10）后自动解除「干扰驾驶舱」");

			await L.setCombatState(normalMech, { hackSlashLocked: true, disableLifeSupport: true, jamCockpit: true });
			await L.beginBasicAction(normalMech, "shutDown");
			ok(!L.getCombatState(normalMech).hackSlashLocked && !L.getCombatState(normalMech).disableLifeSupport && !L.getCombatState(normalMech).jamCockpit, "执行「关机」动作一并清除黑客 II 三种入侵持续效果");

			// 3) 潜行者 II「埋伏（Ambush）」：未命中不触发；武器命中与科技攻击命中均触发机体豁免（缓慢+受损+禁反应，无伏卧）
			const infPilot = mkPilot120("p_inf", [["t_infiltrator", 2]]);
			const infRifle = mkWpn120("w_inf", "突击步枪", "mw_assault_rifle", "Main", "Rifle");
			const infMech = mkMech120("m_inf", "潜行机甲", { pilot: infPilot, items: [infRifle], statuses: ["hidden"] });
			const infTarget = mkMech120("m_inft", "标靶机甲");

			// 3a) 武器首次攻击未命中：消耗本回合首次攻击名额，但不挂埋伏豁免
			const infMissAtk = { actor: infMech, item: infRifle, targets: [], data: null };
			await steps120.get("initAttackData")(infMissAtk);
			infMissAtk.data.hit_results = [{ target: { actor: infTarget }, total: 5, hit: false, crit: false }];
			await steps120.get("rollAttacks")(infMissAtk);
			const infMissCardSt = { actor: infMech, item: infRifle, cardTargets: [{ uuid: infTarget.uuid, hit: false, crit: false }] };
			await steps120.get("printAttackCard")(infMissCardSt);
			const missCls = L.analyzeCard(infMissCardSt._card);
			ok(L.getCombatState(infMech).usedInfiltratorAmbush === true && !(missCls?.saves ?? []).some(s => s.failStatuses?.includes("impaired")), "潜行者 II「埋伏」在首次攻击未命中时不生成机体豁免");

			// 3b) 新一回合科技攻击命中：同样触发埋伏机体豁免（缓慢+受损+禁反应，且不含伏卧）
			await L.setCombatState(infMech, { usedInfiltratorAmbush: false, startedTurnHidden: true });
			const infTechHit = { actor: infMech, item: { uuid: "Item.t_inv", name: "入侵", system: {} }, targets: [], data: { title: "破碎讯号（快速科技）", invade: true } };
			docMap120["Item.t_inv"] = infTechHit.item;
			await steps120.get("initTechAttackData")(infTechHit);
			infTechHit.data.hit_results = [{ target: { actor: infTarget }, total: 16, hit: true, crit: false }];
			await steps120.get("rollAttacks")(infTechHit);
			const infTechCardSt = { actor: infMech, item: infTechHit.item, data: infTechHit.data, cardTargets: [{ uuid: infTarget.uuid, hit: true, crit: false }] };
			await steps120.get("printTechAttackCard")(infTechCardSt);
			const techAmbushCls = L.analyzeCard(infTechCardSt._card);
			const ambushSave = (techAmbushCls?.saves ?? []).find(s => s.key === "hull");
			ok(
				L.getCombatState(infMech).usedInfiltratorAmbush === true
				&& Boolean(ambushSave)
				&& ambushSave.failStatuses.includes("slow")
				&& ambushSave.failStatuses.includes("impaired")
				&& !ambushSave.failStatuses.includes("prone")
				&& ambushSave.noReactionsUntilTurnEnd === true,
				"潜行者 II「埋伏」支持科技攻击命中触发机体豁免（缓慢+受损+禁反应，绝不误挂伏卧）"
			);

			// 4) 重炮手 I & III「掩护火力 / 夹叉火力」：双目标按目标独立解除
			const hgPilot = mkPilot120("p_hg", [["t_heavy_gunner", 3]]);
			const hmg = mkWpn120("w_hmg", "重机枪", "mw_heavy_machine_gun", "Heavy", "Cannon");
			const hgMech = mkMech120("m_hg", "重炮机甲", { pilot: hgPilot, items: [hmg] });
			const enemyA = mkMech120("m_ea", "敌机甲A", { statuses: ["impaired"] });
			const enemyB = mkMech120("m_eb", "敌机甲B", { statuses: ["impaired"] });
			const enemyC = mkMech120("m_ec", "敌机甲C", { statuses: ["impaired"] });
			await L.setCombatState(hgMech, { heavyGunnerReactionArmed: true, coveringFireTargets: [enemyA.uuid, enemyB.uuid, enemyC.uuid] });
			ctx.game.actors = [hgMech, enemyA, enemyB, enemyC];
			ctx.game.actors.get = id => [hgMech, enemyA, enemyB, enemyC].find(a => a.id === id) ?? null;

			// 对 A 开出掩护火力反应射击 → 仅移除 A 并清 A 的受损，B 与 C 保持掩护火力与受损
			await steps120.get("printAttackCard")({ actor: hgMech, item: hmg, cardTargets: [{ uuid: enemyA.uuid, hit: true, crit: false }] });
			ok(
				!enemyA.statuses.has("impaired")
				&& enemyB.statuses.has("impaired")
				&& L.getCombatState(hgMech).coveringFireTargets.length === 2
				&& L.getCombatState(hgMech).coveringFireTargets.includes(enemyB.uuid),
				"重炮手 III「夹叉火力」：对目标 A 开火仅解除 A 的掩护火力与受损，其余目标继续维持"
			);

			// B 对重炮手造成伤害 → 仅解除 B，C 仍保留！
			const prevProtoDmgCalc = ctx.CONFIG.Actor.documentClass.prototype.damageCalc;
			ctx.CONFIG.Actor.documentClass.prototype.damageCalc = async function (d) {
				const loss = Number(d?.Kinetic) || 0;
				this.system.hp.value = Math.max(0, (Number(this.system.hp.value) || 0) - loss);
				return d;
			};
			L.patchTrueblackDamageCalc();
			hgMech.system.hp.value = 12;
			await ctx.CONFIG.Actor.documentClass.prototype.damageCalc.call(hgMech, { Kinetic: 4 }, { multiple: 1, dmgCtx: { attackerUuid: enemyB.uuid } });
			if (prevProtoDmgCalc) ctx.CONFIG.Actor.documentClass.prototype.damageCalc = prevProtoDmgCalc;
			ok(
				!enemyB.statuses.has("impaired")
				&& enemyC.statuses.has("impaired")
				&& L.getCombatState(hgMech).coveringFireTargets.length === 1
				&& L.getCombatState(hgMech).coveringFireTargets[0] === enemyC.uuid,
				"重炮手 III：当目标 B 对重炮手造成伤害时，仅解除 B 的掩护火力，目标 C 依旧保留"
			);

			// 5) 领袖 II「公开频道」：仅允许在【其他友方玩家角色】回合触发下达命令反应，拦截 NPC 回合与自身回合
			const leaderMech = mkMech120("m_ldr", "指挥机甲");
			const allyPcMech = mkMech120("m_ally_pc", "队友机甲");
			allyPcMech.hasPlayerOwner = true;
			const npcTurnActor = { id: "n_turn", uuid: "Actor.n_turn", name: "敌方突击兵", type: "npc", is_npc: () => true, hasPlayerOwner: false };
			const leaderActItem = { type: "talent", system: { lid: "t_leader" } };
			ctx.game.combat = { started: true, active: true, round: 1, turn: 0, combatant: { id: "c_npc", actor: npcTurnActor } };
			ok(
				await steps120.get("initActivationData")({ actor: leaderMech, item: leaderActItem, data: { action: { activation: "Reaction", name: "公开频道" } } }) === false,
				"领袖 II「公开频道」反应在敌方 NPC 回合被自动拦截"
			);
			ctx.game.combat = { started: true, active: true, round: 1, turn: 1, combatant: { id: "c_self", actor: leaderMech } };
			ok(
				await steps120.get("initActivationData")({ actor: leaderMech, item: leaderActItem, data: { action: { activation: "Reaction", name: "公开频道" } } }) === false,
				"领袖 II「公开频道」反应在自身回合被自动拦截（自身回合应使用免费动作下达命令）"
			);
			ctx.game.combat = { started: true, active: true, round: 1, turn: 2, combatant: { id: "c_ally", actor: allyPcMech } };
			ok(
				await steps120.get("initActivationData")({ actor: leaderMech, item: leaderActItem, data: { action: { activation: "Reaction", name: "公开频道" } } }) === true,
				"领袖 II「公开频道」反应在其他友方 PC 回合正常放行"
			);
			ctx.game.combat = prevCombat120;

			// 6) 风暴使者 III「大规模攻击」豁免解析：成功时减半并伏卧，失败时晕眩并伏卧
			const torrentSaves = L.parseSavesInText("线形区域内的所有角色必须通过机体豁免，否则受到 2d6 点爆炸伤害，伏卧，并晕眩直到其下一回合结束。成功时，目标受到一半伤害并伏卧。");
			ok(
				torrentSaves.length === 1
				&& torrentSaves[0].key === "hull"
				&& torrentSaves[0].halfOnSuccess === true
				&& torrentSaves[0].passStatuses.includes("prone")
				&& torrentSaves[0].failStatuses.includes("stunned")
				&& torrentSaves[0].failStatuses.includes("prone"),
				"风暴使者 III「大规模攻击」准确解析：失败晕眩+伏卧、成功减半伤害+伏卧"
			);

			// 7) 德川「辉光（Radiance）」与被动「界限突破」射程/威胁叠加 + 迅子长枪危险区无限次后焰
			const tokuLaser = mkWpn120("w_toku_r", "步枪", "mw_smartgun", "Main", "Rifle", { range: [{ type: "Range", val: 10 }], damage: [{ type: "Energy", val: "4" }] });
			const tokuBlade = mkWpn120("w_toku_m", "火炬", "mw_torch", "Main", "Melee", { range: [{ type: "Threat", val: 1 }], damage: [{ type: "Energy", val: "1d6" }] });
			const tokuMech = mkMech120("m_toku", "德川", { frameLid: "mf_tokugawa", items: [tokuLaser, tokuBlade], statuses: ["dangerzone", "exposed"] });
			await L.setCoreState(tokuMech, { active: true, frameLid: "mf_tokugawa" });
			ok(
				L.attackReach({ constructor: { name: "WeaponAttackFlow" }, state: { item: tokuLaser, actor: tokuMech } }).reach === 20
				&& L.overwatchThreatVal(tokuBlade, tokuMech) === 4,
				"德川开启「辉光」且处于暴露「界限突破」时：远程射程 10+5(辉光)+5(界限突破)=20，近战威胁 1+2(辉光)+1(界限突破)=4"
			);

			const tachyon = mkWpn120("w_tach", "迅子长枪", "mw_tachyon_lance", "Superheavy", "Cannon", { range: [{ type: "Range", val: 20 }], damage: [{ type: "Energy", val: "2d6" }, { type: "Burn", val: "8" }] });
			tokuMech.items.push(tachyon);
			tachyon.actor = tokuMech;
			const tachRiders1 = L.collectWeaponAttackRiders(null, { targets: [{ hit: true, crit: false }] }, tachyon, tokuMech, 12);
			const tachRiders2 = L.collectWeaponAttackRiders(null, { targets: [{ hit: false, crit: false }] }, tachyon, tokuMech, 12);
			ok(
				tachRiders1.some(r => r.kind === "tachyonBackblast") && tachRiders2.some(r => r.kind === "tachyonBackblast"),
				"迅子长枪在超温危域每次攻击（无论命中与否、不限 1/轮）均生成 4 燃烧 + 2 热度后焰按钮"
			);

			// 8) 湮灭巢房（mw_annihilation_nexus）爆发中心：仅允许以自身或【己方部署的无人机】为中心，拒绝敌方或队友无人机
			const hydraMech = mkMech120("m_hydra", "九头蛇", { sensors: 10 });
			const hydraTok = { id: "t_hydra", center: { x: 50, y: 50 }, actor: hydraMech, document: { id: "t_hydra", uuid: "Scene.s.Token.t_hydra", name: "九头蛇", disposition: 1 } };
			const ownDroneActor = {
				id: "d_own", uuid: "Actor.d_own", name: "食尸鬼无人机", type: "deployable",
				is_deployable: () => true, statuses: new Set(),
				system: { type: "Drone", deployer: { id: hydraMech.uuid, value: hydraMech } },
			};
			const allyDroneActor = {
				id: "d_ally", uuid: "Actor.d_ally", name: "队友无人机", type: "deployable",
				is_deployable: () => true, statuses: new Set(),
				system: { type: "Drone", deployer: { id: "Actor.m_other", value: null } },
			};
			const ownDroneTok = { id: "t_d_own", center: { x: 350, y: 50 }, actor: ownDroneActor, document: { id: "t_d_own", uuid: "Scene.s.Token.t_d_own", name: "食尸鬼无人机", disposition: 1 } };
			const allyDroneTok = { id: "t_d_ally", center: { x: 250, y: 50 }, actor: allyDroneActor, document: { id: "t_d_ally", uuid: "Scene.s.Token.t_d_ally", name: "队友无人机", disposition: 1 } };
			ctx.canvas = {
				grid: {
					size: 100, distance: 1, isGridless: false,
					measurePath: ([a, b]) => ({ spaces: Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 100) }),
				},
				tokens: { controlled: [hydraTok], placeables: [hydraTok, ownDroneTok, allyDroneTok] },
			};
			const annihWpn = mkWpn120("w_annih", "湮灭巢房", "mw_annihilation_nexus", "Superheavy", "Nexus");
			const annihSess = { actor: hydraMech, token: hydraTok, flow: { state: { item: annihWpn } } };
			ok(L.isOwnDroneTokenOf(ownDroneTok, hydraMech) === true && L.isOwnDroneTokenOf(allyDroneTok, hydraMech) === false, "isOwnDroneTokenOf 严格校验 deployer 归属，排除队友或敌方无人机");
			ctx.game.user.targets = new Set([allyDroneTok]);
			ok(await L.resolveAnnihilationBurstOrigin(annihSess) === undefined, "锁定队友无人机放置湮灭巢房爆发模板时被拦截并提示需选自己的无人机");
			ctx.game.user.targets = new Set([ownDroneTok]);
			ok(await L.resolveAnnihilationBurstOrigin(annihSess) === ownDroneTok, "锁定感应范围内己方无人机时允许以其为中心放置爆发 2 模板");
			ctx.game.user.targets = new Set();

			// 9) 布里阿柔斯骨架（cb_briareos_frame）：1 点与 0 点结构均享全伤害抗性（除热度），且 0 HP + 0 结构不自动挂被击倒
			const briPilot = mkPilot120("p_bri", [], ["cb_briareos_frame"]);
			const briMech = mkMech120("m_bri", "不灭巨人", { pilot: briPilot, hp: 0, struct: 0, armor: 0 });
			const briPrev0 = L.previewDamageCalc(briMech, [{ type: "Kinetic", amount: 6 }]);
			ok(briPrev0.hpLoss === 3 && briPrev0.notes.some(n => /布里阿柔斯/.test(n)), "布里阿柔斯骨架在 0 点结构时同样生效非热度全伤害抗性（6 → 3）");
			await L.onUpdateActorStatus(briMech, { system: { hp: { value: 0 }, structure: { value: 0 } } }, {}, "u1");
			ok(!briMech.statuses.has("downandout"), "装备布里阿柔斯骨架的机甲在 0 HP + 0 结构时不会自动挂上「被击倒（Down and Out）」");

			// 10) 苏丹专业牌照自动化：模块化步枪「突击」反应准度、瓦亚维亚导弹飞行/高处准度与非飞行难度、弹道臂盾展开姿态
			const modRifle = mkWpn120("w_modr", "模块化先进战斗步枪", "mw_pl_modular_rifle", "Main", "Rifle", {
				profiles: [
					{ name: "进攻", type: "Rifle", range: [{ type: "Range", val: 10 }], damage: [{ type: "Kinetic", val: "1d6" }], all_tags: [] },
					{ name: "DMR", type: "Rifle", range: [{ type: "Range", val: 12 }], damage: [{ type: "Kinetic", val: "1d6+3" }], all_tags: [] },
					{ name: "突击", type: "Rifle", range: [{ type: "Range", val: 8 }, { type: "Threat", val: 3 }], damage: [{ type: "Kinetic", val: "1d6" }], all_tags: [] },
				],
				selectedIdx: 2,
			});
			const suldanMech = mkMech120("m_sul", "苏丹佣兵", { items: [modRifle] });
			ok(L.isModularRifleReactionProfile(modRifle) === true, "模块化战斗步枪第 3 档案「突击」被识别为反应攻击 +1 准度档案");
			const modOwSt = { actor: suldanMech, item: modRifle, targets: [], data: { _lancerCnReactionSnap: true } };
			await steps120.get("initAttackData")(modOwSt);
			ok(modOwSt.data.acc_diff.base.accuracy === 1, "模块化战斗步枪「突击」档案在守望/反应射击中自动获得 +1 准度");

			const valkLauncher = mkWpn120("w_valk", "瓦亚维亚导弹", "mw_pl_valkyrie", "Main", "Launcher", { range: [{ type: "Range", val: 15 }] });
			const flyEnemy = mkMech120("m_fly", "飞行标靶", { statuses: ["flying"] });
			const groundEnemy = mkMech120("m_gnd", "地面标靶");
			const sulTok = { id: "t_sul", center: { x: 50, y: 50 }, elevation: 0, actor: suldanMech, document: { uuid: "Scene.s.Token.t_sul", elevation: 0, disposition: 1 } };
			const flyTok = { id: "t_fly", center: { x: 250, y: 50 }, elevation: 0, actor: flyEnemy, document: { uuid: "Scene.s.Token.t_fly", elevation: 0, disposition: -1 } };
			const highGroundTok = { id: "t_gnd", center: { x: 250, y: 150 }, elevation: 2, actor: groundEnemy, document: { uuid: "Scene.s.Token.t_gnd", elevation: 2, disposition: -1 } };
			suldanMech.token = sulTok.document;
			ctx.canvas.tokens.controlled = [sulTok];
			ctx.canvas.tokens.placeables = [sulTok, flyTok, highGroundTok];
			const valkTadFly = { target: flyTok, accuracy: 0, difficulty: 0, cover: 0 };
			const valkTadHighGnd = { target: highGroundTok, accuracy: 0, difficulty: 0, cover: 0 };
			await steps120.get("initAttackData")({ actor: suldanMech, item: valkLauncher, targets: [valkTadFly, valkTadHighGnd], data: null });
			ok(
				valkTadFly.accuracy === 1 && valkTadFly.difficulty === 0
				&& valkTadHighGnd.accuracy === 1 && valkTadHighGnd.difficulty === 1,
				"瓦亚维亚导弹（mw_pl_valkyrie）：对飞行目标 +1 准度无难度；对高处非飞行目标同时结算高处 +1 准度与非飞行 +1 难度"
			);

			const buckler = mkWpn120("w_buck", "弹道臂盾", "mw_pl_buckler", "Main", "Melee", { range: [{ type: "Threat", val: 1 }] });
			buckler.system.on_crit = "当弹道板伸出时，目标伏卧。";
			buckler.system.active_profile.on_crit = "当弹道板伸出时，目标伏卧。";
			suldanMech.items.push(buckler);
			buckler.actor = suldanMech;
			const buckRetractedCls = L.classifyAttackCard(buckler, null, 14, suldanMech);
			ok(!buckRetractedCls.autoCritStatuses.includes("prone"), "弹道臂盾收起期间会心一击不会误挂伏卧");
			await L.executeTalentSheetAction(suldanMech, "toggle-buckler-stance");
			ok(L.getCombatState(suldanMech).bucklerExtended === true && suldanMech.statuses.has("slow"), "开启「弹道臂盾展开姿态」后自动标记缓慢");
			const buckPrevRxn = L.previewDamageCalc(suldanMech, [{ type: "Kinetic", amount: 6 }], { reactionAttack: true });
			const buckPrevNorm = L.previewDamageCalc(suldanMech, [{ type: "Kinetic", amount: 6 }], {});
			const buckCritCls = L.classifyAttackCard(buckler, null, 14, suldanMech);
			ok(
				buckPrevRxn.hpLoss === 3 && buckPrevNorm.hpLoss === 6 && buckCritCls.autoCritStatuses.includes("prone"),
				"弹道臂盾展开姿态期间：仅对反应攻击享受伤害抗性（6→3），且使用臂盾会心一击自动附加伏卧"
			);

			ctx.ChatMessage = prevChatMsg120;
			ctx.fromUuidSync = prevFromUuidSync120;
			ctx.game.user = prevUser120;
			ctx.canvas = prevCanvas120;
			ctx.game.combat = prevCombat120;
			ctx.game.lancer = prevLancer120;
			ctx.ui = prevUi120;
		}

		// ---- v1.21.0 扩展规则自动化与词典同步回归测试
		{
			const L = ctx.LancerCN;
			const prevUi121 = ctx.ui;
			const prevLancer121 = ctx.game.lancer;
			const prevCombat121 = ctx.game.combat;
			const prevCanvas121 = ctx.canvas;
			const prevUser121 = ctx.game.user;
			const prevUsers121 = ctx.game.users;
			const prevSocket121 = ctx.game.socket;
			const prevActors121 = ctx.game.actors;
			const prevFromUuidSync121 = ctx.fromUuidSync;
			const prevChatMsg121 = ctx.ChatMessage;
			const prevRoll121 = ctx.Roll;

			const warnLogs121 = [];
			ctx.ui = {
				notifications: {
					info: m => { warnLogs121.push(String(m)); },
					warn: m => { warnLogs121.push(String(m)); },
					error: m => { warnLogs121.push(String(m)); },
				},
			};

			const docMap121 = {};
			ctx.fromUuidSync = u => docMap121[u] ?? prevFromUuidSync121?.(u) ?? null;
			ctx.game.users = { activeGM: { isSelf: true } };
			ctx.canvas = { tokens: { controlled: [], placeables: [] } };

			const mkPilot121 = (id, talents = [], { grit = 0, countersByLid = {} } = {}) => ({
				id,
				uuid: `Actor.${id}`,
				type: "pilot",
				isOwner: true,
				system: { grit },
				items: talents.map(([lid, rank]) => ({
					type: "talent",
					system: {
						lid,
						curr_rank: rank,
						...(countersByLid[lid] ? { counters: countersByLid[lid] } : {}),
					},
				})),
			});

			const mkMech121 = (id, name, { frameLid = "mf_standard_pattern_i_everest", pilot = null, items = [], hp = 12, heat = 0, heatMax = 6, evasion = 10, edef = 10, save = 12, isOwner = true, statuses = [] } = {}) => {
				const flags = { "lancer-cn": {} };
				const stSet = new Set(statuses);
				const itemArr = [...items];
				itemArr.get = iid => itemArr.find(x => x.id === iid);
				const m = {
					id,
					uuid: `Actor.${id}`,
					name,
					type: "mech",
					isOwner,
					is_mech: () => true,
					is_npc: () => false,
					is_deployable: () => false,
					hasHeatcap: () => heatMax > 0,
					statuses: stSet,
					items: itemArr,
					getFlag: (sc, k) => flags[sc]?.[k],
					setFlag: async (sc, k, v) => { (flags[sc] ||= {})[k] = v; },
					unsetFlag: async (sc, k) => { if (flags[sc]) delete flags[sc][k]; },
					toggleStatusEffect: async (sid, { active }) => { active ? stSet.add(sid) : stSet.delete(sid); },
					update: async patch => {
						if (patch["system.heat.value"] !== undefined) m.system.heat.value = patch["system.heat.value"];
						if (patch["system.overshield.value"] !== undefined) m.system.overshield.value = patch["system.overshield.value"];
						if (patch["system.burn"] !== undefined) m.system.burn = patch["system.burn"];
						if (patch["system.action_tracker.reaction"] !== undefined) m.system.action_tracker.reaction = patch["system.action_tracker.reaction"];
					},
					system: {
						grit: pilot?.system?.grit ?? 0,
						evasion,
						edef,
						save,
						hull: 0,
						agi: 0,
						sys: 0,
						eng: 0,
						hp: { value: hp, max: hp },
						overshield: { value: 0 },
						structure: { value: 4, max: 4 },
						stress: { value: 4, max: 4 },
						heat: { value: heat, max: heatMax },
						burn: 0,
						statuses: {},
						action_tracker: { reaction: true },
						pilot: pilot ? { value: pilot, id: pilot.id } : { value: null, id: null },
						loadout: { frame: { value: { system: { lid: frameLid } } } },
					},
				};
				for (const it of itemArr) {
					it.actor = m;
					it.parent = m;
					if (it.uuid) docMap121[it.uuid] = it;
				}
				docMap121[m.uuid] = m;
				return m;
			};

			const createdCards121 = [];
			ctx.ChatMessage = {
				...(prevChatMsg121 || {}),
				getSpeaker: o => ({ actor: o?.actor?.name }),
				create: async data => {
					const f = JSON.parse(JSON.stringify(data.flags ?? {}));
					const msg = {
						id: `c121_${createdCards121.length}`,
						isAuthor: true,
						content: data.content ?? "",
						flags: f,
						getFlag: (sc, k) => f?.[sc]?.[k],
						setFlag: async (sc, k, v) => { (f[sc] ||= {})[k] = v; },
						updateSource: patch => {
							for (const [pk, pv] of Object.entries(patch ?? {})) {
								const segs = pk.split(".");
								let cur = msg;
								for (let si = 0; si < segs.length - 1; si++) cur = (cur[segs[si]] ||= {});
								cur[segs[segs.length - 1]] = pv;
							}
						},
					};
					L.onPreCreateBasicCard(msg);
					createdCards121.push(msg);
					await L.onCreateChatMessage(msg, {}, ctx.game.user?.id);
					return msg;
				},
			};

			// 1) 8 组扩展 LID 别名双向对齐（骨架 + 天赋 + 系统）与碾碎机「鲁莽挥击」按钮
			const aliasPilot = mkPilot121("p_alias", [
				["t_ext_mind_reader", 2],
				["t_ext_void_native", 1],
				["t_ext_household_guard", 1],
				["t_ext_blackthumb", 3],
				["t_ext_crusher", 1],
			]);
			const aliasMech = mkMech121("m_alias", "别名测试机", {
				frameLid: "mf_ch_wodeng",
				pilot: aliasPilot,
				items: [
					{ id: "s_un", type: "mech_system", name: "不稳定 NHP", system: { lid: "ms_ext_unstable_nhp" } },
					{ id: "s_peb", type: "mech_system", name: "人因故障", system: { lid: "ms_ext_human_error" } },
				],
			});
			ok(
				L.mechFrameLid(aliasMech) === "mf_ext_wodeng"
				&& L.FRAME_LID_ALIASES.mf_ch_tizona === "mf_kkca_tizona"
				&& L.FRAME_LID_ALIASES.mf_ext_retiarius === "mf_ch_retiarius"
				&& L.talentRank(aliasMech, "t_empath") === 2
				&& L.talentRank(aliasMech, "t_spaceborn") === 1
				&& L.talentRank(aliasMech, "t_house_guard") === 1
				&& L.talentRank(aliasMech, "t_black_thumb") === 3
				&& L.hasMechSystem(aliasMech, "ms_iconoclast") === true
				&& L.hasMechSystem(aliasMech, "ms_pebcac") === true,
				"8 处扩展 LID 别名（提泽纳剑/沃登/网斗士/不稳定 NHP/共情者/太空民/家族禁卫/黑拇指/人因故障）全部正确归一化"
			);
			const crusherHtml = L.renderTalentControlHTML(aliasMech);
			ok(crusherHtml.includes("鲁莽挥击") && !crusherHtml.includes("鲁莽摇摆"), "碾碎机 I 战术栏开关标题已同步更新为「鲁莽挥击」");

			// 2) 演说家 II & III（mf_orator）：R3 初始 2 骰、激励固定 +1 准度且清除状况、反间补全后半句、挫败无受伤提前解除、1/轮限制及 0→1 涨骰
			const oratorPilot = mkPilot121("p_ora", [["mf_orator", 3]], {
				countersByLid: { mf_orator: [{ lid: "ctr_voice_of_reason", value: 1, default_value: 1 }] },
			});
			const oratorMech = mkMech121("m_ora", "演说机甲", { pilot: oratorPilot });
			ok(L.getTalentDie(oratorMech, "orator") === 2, "演说家 III 在共用 R2 默认值 1 的计数器时自动按 R3 初始 2 枚演说家骰读取");
			await L.setTalentDie(oratorMech, "orator", 3);
			ctx.game.user = { ...(prevUser121 || {}), id: "u121", isGM: false, targets: new Set() };
			ctx.game.combat = { id: "cmb_ora", started: true, round: 1, turn: 0 };
			const oraOk1 = await L.executeTalentSheetAction(oratorMech, "oratorSpend:1:激励");
			const oraCard1 = createdCards121.at(-1)?.content ?? "";
			const oraOk2SameRound = await L.executeTalentSheetAction(oratorMech, "oratorSpend:1:激励");
			ok(
				oraOk1 === true
				&& oraOk2SameRound === false
				&& L.getTalentDie(oratorMech, "orator") === 2
				&& oraCard1.includes("+1 准度")
				&& !oraCard1.includes("+3 准度")
				&& oraCard1.includes("状况"),
				"演说家 II「激励」持有 3 枚消耗 1 枚时固定赋予 +1 准度（清除状况），且严格受 1/轮限制拦截同轮第二次消耗"
			);
			ctx.game.combat = { id: "cmb_ora", started: true, round: 2, turn: 0 };
			await L.setTalentDie(oratorMech, "orator", 3);
			await L.executeTalentSheetAction(oratorMech, "oratorSpend:2:反间");
			const convinceHtml = createdCards121.at(-1)?.content ?? "";
			ctx.game.combat = { id: "cmb_ora", started: true, round: 3, turn: 0 };
			await L.setTalentDie(oratorMech, "orator", 3);
			await L.executeTalentSheetAction(oratorMech, "oratorSpend:3:挫败");
			const demorHtml = createdCards121.at(-1)?.content ?? "";
			ok(
				convinceHtml.includes("也不能成为盟友系统或特性的目标")
				&& !demorHtml.includes("提前解除")
				&& L.getTalentDie(oratorMech, "orator") === 0,
				"演说家「反间」包含不可作为盟友目标条款，「挫败」已移除旧版受伤提前解除条款"
			);
			await L.setCombatState(oratorMech, { attackedOrForcedSaveThisTurn: false });
			const oraTurnCombat = {
				round: 3,
				previous: { combatantId: "co1" },
				current: { combatantId: "co2" },
				combatants: [
					{ id: "co1", name: "演说机甲", actor: oratorMech, token: { uuid: oratorMech.uuid } },
					{ id: "co2", name: "木桩", actor: aliasMech, token: { uuid: aliasMech.uuid } },
				],
			};
			oraTurnCombat.combatants.get = cid => oraTurnCombat.combatants.find(c => c.id === cid);
			await L.onUpdateCombatTurnEnd(oraTurnCombat, { turn: 1 }, { direction: 1 });
			ok(L.getTalentDie(oratorMech, "orator") === 1, "演说家骰扣至 0 枚时，未攻击回合结束正常从 0 恢复至 1 枚");

			// 3) 战场分析师 I–III（t_field_analyst）：对敌锁定阻止涨骰（扫描不阻止）、保骰 ±1 vs 耗骰、多目标指定下标与 2/轮上限
			const faPilot = mkPilot121("p_fa", [["t_field_analyst", 3]]);
			const faMech = mkMech121("m_fa", "情报分析机", { pilot: faPilot });
			const faEnemyA = mkMech121("m_fae1", "敌机甲甲", { evasion: 12 });
			const faEnemyB = mkMech121("m_fae2", "敌机甲乙", { evasion: 12 });
			ctx.game.actors = [faMech, faEnemyA, faEnemyB];
			ctx.game.actors.get = aid => [faMech, faEnemyA, faEnemyB].find(a => a.id === aid) ?? null;

			await L.setTalentDie(faMech, "analyst", 2);
			await L.setCombatState(faMech, { attackedOrForcedSaveThisTurn: false, affectedHostileThisTurn: false });
			const faEnemyTok = { id: "t_fae1", actor: faEnemyA, document: { uuid: faEnemyA.uuid, name: faEnemyA.name, disposition: -1 } };
			ctx.game.user.targets = new Set([faEnemyTok]);
			await L.beginBasicAction(faMech, "lockon");
			ctx.game.user.targets = new Set();
			const faCombat = {
				round: 1,
				previous: { combatantId: "cf1" },
				current: { combatantId: "cf2" },
				combatants: [
					{ id: "cf1", name: "情报分析机", actor: faMech, token: { uuid: faMech.uuid } },
					{ id: "cf2", name: "敌机甲甲", actor: faEnemyA, token: { uuid: faEnemyA.uuid } },
				],
			};
			faCombat.combatants.get = cid => faCombat.combatants.find(c => c.id === cid);
			await L.onUpdateCombatTurnEnd(faCombat, { turn: 1 }, { direction: 1 });
			ok(L.getTalentDie(faMech, "analyst") === 2, "战场分析师 II：本回合对敌方执行「锁定」属于影响敌对角色行动，回合末不涨情报骰");

			// 纯扫描不置位 affectedHostileThisTurn，回合末正常 +2 涨至 4
			await L.setCombatState(faMech, { attackedOrForcedSaveThisTurn: false, affectedHostileThisTurn: false });
			await ctx.ChatMessage.create({
				content: `<div class="card"><div class="lancer-header">扫描</div><div class="effect-text">扫描敌方机甲获取数值信息。</div></div>`,
				flags: { lancer: { actionData: { actor: faMech.uuid, action: { lid: "act_scan", name: "扫描" } } } },
			});
			await L.onUpdateCombatTurnEnd(faCombat, { turn: 1 }, { direction: 1 });
			ok(L.getTalentDie(faMech, "analyst") === 4, "战场分析师 II：本回合仅执行「扫描」不影响涨骰，回合末正常 +2（2 → 4）");

			// 多目标攻击卡：第 1 次选保骰 +1 调整目标 #1（11→12 命中，情报骰保留 4），第 2 次新回合耗骰 +4 调整目标 #0（9→13 命中，情报骰重置 1），同轮第 3 次因 2/轮上限被拦截！
			const mkAtkCard121 = (id, targets) => {
				const f = { lancer: { attackData: { attackerUuid: aliasMech.uuid, targets } }, "lancer-cn": {} };
				return {
					id,
					isAuthor: true,
					content: `<div class="lancer-attack"></div>`,
					flags: f,
					getFlag: (sc, k) => f?.[sc]?.[k],
					setFlag: async (sc, k, v) => { (f[sc] ||= {})[k] = v; },
				};
			};
			ctx.game.combat = { id: "cmb_fa", started: true, round: 2, turn: 0 };
			const aoeMsg = mkAtkCard121("aoe_fa", [
				{ uuid: faEnemyA.uuid, total: 9, hit: false, crit: false },
				{ uuid: faEnemyB.uuid, total: 11, hit: false, crit: false },
			]);
			await L.executeFieldAnalystReaction(aoeMsg, L.analyzeCard(aoeMsg), "add:base", { targetIndex: 1 });
			ok(
				L.getTalentDie(faMech, "analyst") === 4
				&& aoeMsg.flags.lancer.attackData.targets[0].total === 9
				&& aoeMsg.flags.lancer.attackData.targets[1].total === 12
				&& aoeMsg.flags.lancer.attackData.targets[1].hit === true,
				"战场分析师 II/III：支持指定调整多目标攻击中的第 2 个目标，且选择「保骰 +1」时保留当前高点数情报骰（4）"
			);
			ctx.game.combat.turn = 1; // 同一轮的下一个角色回合（手动模拟换回合恢复反应徽章）
			faMech.system.action_tracker.reaction = true;
			await L.executeFieldAnalystReaction(aoeMsg, L.analyzeCard(aoeMsg), "add:die", { targetIndex: 0 });
			ctx.game.combat.turn = 2; // 同一轮的第 3 个角色回合
			faMech.system.action_tracker.reaction = true;
			const thirdMsg = mkAtkCard121("single_fa3", [{ uuid: faEnemyA.uuid, total: 10, hit: false, crit: false }]);
			const faThirdRes = await L.executeFieldAnalystReaction(thirdMsg, L.analyzeCard(thirdMsg), "sub:base");
			ok(
				L.getTalentDie(faMech, "analyst") === 1
				&& aoeMsg.flags.lancer.attackData.targets[0].total === 13
				&& faThirdRes === false,
				"战场分析师「优越情报 / 激活干扰」严格执行每轮至多 2 次（2/轮）上限，同轮第 3 次触发被自动拦截"
			);

			// 4) 偶像破坏者（t_iconoclast）countMechNHPs 精确计数 + R1 层流检定 + 猎犬级伙伴礼宾单元拉动 3 格
			const icono1Pilot = mkPilot121("p_ico1", [["t_iconoclast", 1], ["t_technophile", 1]]);
			const icono1Mech = mkMech121("m_ico1", "狂信一号", {
				pilot: icono1Pilot,
				items: [
					{ id: "ai_cc", type: "mech_system", name: "助理级 COMP/CON 单元", system: { lid: "ms_comp_con_class_assistant_unit", tags: [{ lid: "tg_ai" }, { lid: "tg_no_cascade" }] } },
					{ id: "ai_hound", type: "mech_system", name: "“猎犬级”伙伴礼宾单元", system: { lid: "ms_ch_hound", tags: [{ lid: "tg_ai" }] } },
					{ id: "ai_serv", type: "mech_system", name: "侍从级 NHP", system: { lid: "ms_technophile_1", tags: [{ lid: "tg_ai" }, { lid: "tg_no_cascade" }] } },
					{ id: "ai_os", type: "mech_system", name: "欧西里斯级 NHP", system: { lid: "ms_osiris_class_nhp", tags: [{ lid: "tg_ai" }] } },
					{ id: "ai_un_dest", type: "mech_system", name: "不稳定 NHP", system: { lid: "ms_iconoclast", destroyed: true } },
				],
			});
			ok(
				L.countMechNHPs(icono1Mech) === 1,
				"countMechNHPs 排除 COMP/CON、猎犬级、侍从级等免层流 AI，且不稳定 NHP（ms_iconoclast）损毁时不再通过天赋回退重复 +1（仅计欧西里斯 = 1）"
			);
			const r1PurePilot = mkPilot121("p_ico_r1", [["t_iconoclast", 1]]);
			const r1PureMech = mkMech121("m_ico_r1", "初阶偶像破坏者", { pilot: r1PurePilot });
			const r1CascSrc = L.collectCascadeableSources(r1PureMech);
			ok(r1CascSrc.eligible === true && r1CascSrc.talentNhps.some(t => t.key === "unstable_nhp"), "仅点 1 级偶像破坏者的机甲正常识别「不稳定 NHP」并允许进行层流检定");

			const houndOnlyMech = mkMech121("m_hound", "战车御手", {
				items: [{ id: "h1", type: "mech_system", name: "“猎犬级”伙伴礼宾单元", system: { lid: "ms_ch_hound", tags: [{ lid: "tg_ai" }] } }],
			});
			ctx.game.lancer = { ...(prevLancer121 || {}), flows: new Map() };
			ctx.Roll = class { constructor() {} async evaluate() { return { total: 1 }; } };
			await L.executeCascadeCheck(houndOnlyMech);
			ok(
				!houndOnlyMech.items[0].system.cascading
				&& /拉动 3 空间/.test(createdCards121.at(-1)?.content ?? ""),
				"猎犬级伙伴礼宾单元在层流检定掷出 1 时不进入层流状态，改为提示由 GM 选择方向拉动 3 空间"
			);

			// 5) 黑拇指 II/III（t_black_thumb）：拦截敌方目标、跨玩家 GM Socket 维修结算、复合状况二选一
			const bt3Pilot = mkPilot121("p_bt3", [["t_black_thumb", 3]]);
			const bt3Mech = mkMech121("m_bt3", "工程母舰", { pilot: bt3Pilot });
			const btAllyMech = mkMech121("m_bt_ally", "队友机甲", { isOwner: false, heat: 4, statuses: ["slow", "immobilized", "impaired", "jammed"] });
			btAllyMech.system.burn = 3;
			const btEnemyMech = mkMech121("m_bt_enemy", "敌方重甲", { isOwner: false, statuses: ["slow"] });
			btEnemyMech.system.burn = 5;
			const btSelfTok = { id: "t_bt_s", x: 0, y: 0, center: { x: 50, y: 50 }, actor: bt3Mech, document: { uuid: bt3Mech.uuid, disposition: 1 } };
			const btAllyTok = { id: "t_bt_a", x: 100, y: 0, center: { x: 150, y: 50 }, actor: btAllyMech, document: { uuid: btAllyMech.uuid, disposition: 1 } };
			const btEnemyTok = { id: "t_bt_e", x: 100, y: 0, center: { x: 150, y: 50 }, actor: btEnemyMech, document: { uuid: btEnemyMech.uuid, disposition: -1 } };
			bt3Mech.token = btSelfTok.document;
			ctx.canvas = {
				grid: { size: 100, distance: 1, isGridless: false, measurePath: ([a, b]) => ({ spaces: Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 100) }) },
				tokens: { controlled: [btSelfTok], placeables: [btSelfTok, btAllyTok, btEnemyTok] },
			};
			const emitted121 = [];
			ctx.game.users = { activeGM: { isSelf: true } };
			ctx.game.socket = { emit: (_ch, payload) => { emitted121.push(payload); } };

			// 5a) 选中敌方机甲点击战场修复 → 被拦截，敌方不加护盾也不清缓慢
			ctx.game.user.targets = new Set([btEnemyTok]);
			await ctx.ChatMessage.create({
				content: `<div class="card"><div class="lancer-header">黑拇指：战场修复</div><div class="effect-text">获得 2 护盾并清除缓慢或固定。</div></div>`,
				flags: { lancer: { actionData: { actor: bt3Mech.uuid, action: { name: "黑拇指：战场修复" } } } },
			});
			ok(btEnemyMech.system.overshield.value === 0 && btEnemyMech.statuses.has("slow") && emitted121.length === 0, "黑拇指 III 选中敌方目标时自动拦截，绝不误给敌机加护盾或清状况");

			// 5b) 选中非本人拥有的邻接友方机甲执行扑灭 / 战场修复 / 操控排气阀 → 发出 blackThumbRepair Socket 并由 GM 端生效
			ctx.game.user.targets = new Set([btAllyTok]);
			for (const actN of ["黑拇指：扑灭", "黑拇指：战场修复", "黑拇指：操控排气阀"]) {
				await ctx.ChatMessage.create({
					content: `<div class="card"><div class="lancer-header">${actN}</div><div class="effect-text">${actN}</div></div>`,
					flags: { lancer: { actionData: { actor: bt3Mech.uuid, action: { name: actN } } } },
				});
			}
			for (const p of emitted121) await L.handleModuleSocketMessage(p);
			ctx.game.user.targets = new Set();
			ok(
				btAllyMech.system.burn === 0
				&& btAllyMech.system.overshield.value === 2
				&& btAllyMech.system.heat.value === 2
				&& btAllyMech.statuses.has("resistance_burn")
				&& !bt3Mech.statuses.has("resistance_burn"),
				"黑拇指 III 对其他玩家的邻接友方机甲执行三种维修动作时，通过 GM Socket 正常清零燃烧、赋予 2 护盾、冷却 2 热度，且燃烧抗性挂在友军而非自身"
			);

			// 6) 人因故障（ms_pebcac）：拦截受扰（Jammed）目标，且 d6=5 仅造成等于实际所清除热度数的能量伤害
			const pebTargetJammed = mkMech121("m_peb_j", "受扰队友", { statuses: ["jammed"] });
			const pebJamTok = { id: "t_pj", actor: pebTargetJammed, document: { uuid: pebTargetJammed.uuid, disposition: 1 } };
			ctx.game.user.targets = new Set([pebJamTok]);
			const prevCardCnt = createdCards121.length;
			await ctx.ChatMessage.create({
				content: `<div class="card"><div class="lancer-header">人因故障</div><div class="effect-text">人因故障</div></div>`,
				flags: { lancer: { actionData: { actor: bt3Mech.uuid, action: { name: "人因故障" } } } },
			});
			ok(createdCards121.length === prevCardCnt + 1 && !/副作用 d6/.test(createdCards121.at(-1)?.content ?? ""), "人因故障（PEBCAC）对处于受扰（Jammed）状况的目标自动拦截");

			const pebTargetHot1 = mkMech121("m_peb_h1", "微热队友", { heat: 1 });
			const pebHotTok = { id: "t_ph1", actor: pebTargetHot1, document: { uuid: pebTargetHot1.uuid, disposition: 1 } };
			ctx.game.user.targets = new Set([pebHotTok]);
			let pebRolls = [5, 6]; // 第 1 骰出副作用 5，第 2 骰冷却 1d6 = 6（但目标仅有 1 点热度，实际只清 1 点并造成 1 点能量伤害！）
			ctx.Roll = class { constructor() {} async evaluate() { return { total: pebRolls.shift() ?? 1 }; } };
			await ctx.ChatMessage.create({
				content: `<div class="card"><div class="lancer-header">人因故障</div><div class="effect-text">人因故障</div></div>`,
				flags: { lancer: { actionData: { actor: bt3Mech.uuid, action: { name: "人因故障" } } } },
			});
			ctx.game.user.targets = new Set();
			const pebCard5 = createdCards121.at(-1);
			const pebInfo5 = L.analyzeCard(pebCard5);
			ok(
				pebTargetHot1.system.heat.value === 0
				&& (pebCard5?.content ?? "").includes("1 点能量伤害")
				&& pebInfo5?.nonAttackDamage?.damage?.[0]?.val === "1",
				"人因故障 d6=5：当目标当前仅有 1 点热度而冷却掷出 6 时，实际清除 1 点热度且邻接能量伤害严格按实际清除量（1 点）计算"
			);

			// 7) 其余扩展勘误联动：白巫蛾（固化 4+毅力 & 超激活爆裂离散）、蒲公英（爆发 4）、游骑兵（受伤解除接地隐形）、帝王之眼（豁免成功仍吃 2 AP 能量）、沃登反火力套组（消耗守望并锁定）、树绳妖（仅无法离舱/无驾驶员时豁免失败晕眩）
			const wwPilot = mkPilot121("p_ww", [], { grit: 3 });
			const wwMech = mkMech121("m_ww", "白巫蛾", { frameLid: "mf_white_witch", pilot: wwPilot });
			await L.beginBasicAction(wwMech, "brace");
			ok(wwMech.system.overshield.value === 7, "白巫蛾「固化」受身护盾按 4 + 毅力（4 + 3 = 7）结算而非固定 5");
			await L.activateCorePower(wwMech);
			await L.executeCoreAction(wwMech, "whiteWitchBurst");
			const wwBurstInfo = L.analyzeCard(createdCards121.at(-1));
			ok(
				wwBurstInfo?.nonAttackDamage?.damage?.[0]?.val === "1"
				&& wwBurstInfo?.nonAttackDamage?.unconditionalDamage === true
				&& wwBurstInfo?.saves?.[0]?.key === "hull"
				&& wwBurstInfo?.saves?.[0]?.failStatuses?.includes("shredded"),
				"白巫蛾「超激活铁磁爆裂」造成无条件 1 AP 动能伤害，并迫使机体豁免对抗伏卧+固定+离散"
			);

			ok(L.CP_PROFILES.mf_lancaster_alt_taraxacum.buttons[0].act === "placeBurst4", "蒲公英核心主动模板按钮已更正为爆发 4（placeBurst4）");

			const rangerMech = mkMech121("m_rng", "游骑兵", { frameLid: "mf_swallowtail_alt_swallowtail_ranger_variant", statuses: ["cover_soft"] });
			const rngCombat = {
				round: 1,
				previous: { combatantId: "crg1" },
				current: { combatantId: "crg2" },
				combatants: [
					{ id: "crg1", name: "游骑兵", actor: rangerMech, token: { uuid: rangerMech.uuid } },
					{ id: "crg2", name: "木桩", actor: aliasMech, token: { uuid: aliasMech.uuid } },
				],
			};
			rngCombat.combatants.get = cid => rngCombat.combatants.find(c => c.id === cid);
			await L.onUpdateCombatTurnEnd(rngCombat, { turn: 1 }, { direction: 1 });
			ok(rangerMech.statuses.has("invisible") && L.getCombatState(rangerMech).groundedInvisible === true, "游骑兵在软性掩护中结束回合时触发「接地」获得隐形");
			const prevDmgCalc121 = ctx.CONFIG.Actor.documentClass.prototype.damageCalc;
			ctx.CONFIG.Actor.documentClass.prototype.damageCalc = async function (d) {
				this.system.hp.value = Math.max(0, this.system.hp.value - (Number(d?.Kinetic) || 0));
				return d;
			};
			L.patchTrueblackDamageCalc();
			await ctx.CONFIG.Actor.documentClass.prototype.damageCalc.call(rangerMech, { Kinetic: 2 }, { multiple: 1 });
			if (prevDmgCalc121) ctx.CONFIG.Actor.documentClass.prototype.damageCalc = prevDmgCalc121;
			ok(!rangerMech.statuses.has("invisible") && !L.getCombatState(rangerMech).groundedInvisible, "游骑兵在受到实际伤害时立即解除「接地」隐形");

			const impEyeItem = { id: "s_eye", uuid: "Item.s_eye", type: "mech_system", name: "帝王之眼", system: { lid: "ms_the_imperial_eye" } };
			docMap121[impEyeItem.uuid] = impEyeItem;
			const impEyeDmg = L.parseNonAttackDamage("被电击的角色受到2穿甲能量伤害，并必须通过工程豁免，否则被击退2格、伏卧，并陷入离散状态，直到其下一回合结束。", wwMech, impEyeItem);
			let capturedEyeTargets = null;
			class MockEyeDmgFlow {
				constructor(_u, d) { capturedEyeTargets = d.hit_results; }
				async begin() { return true; }
			}
			ctx.game.lancer = { ...(prevLancer121 || {}), flows: new Map([["DamageRollFlow", MockEyeDmgFlow]]) };
			docMap121["Scene.s.Token.eye_pass"] = { uuid: "Scene.s.Token.eye_pass", object: btEnemyTok, actor: btEnemyMech };
			const eyeCard = {
				getFlag: (_sc, k) => (k === "saveResults" ? { "Scene.s.Token.eye_pass": { uuid: "Scene.s.Token.eye_pass", passed: true, halfOnSuccess: false, noDamageOnSuccess: false } } : null),
			};
			await L.rollNonAttackDamage(eyeCard, { actor: wwMech, title: "帝王之眼", nonAttackDamage: impEyeDmg });
			ok(impEyeDmg?.unconditionalDamage === true && Array.isArray(capturedEyeTargets) && capturedEyeTargets.length === 1, "帝王之眼：即使目标工程豁免成功（免除击退/伏卧/离散），2 点穿甲能量伤害依然自动命中该目标");

			const cfMech = mkMech121("m_cf", "沃登", { frameLid: "mf_ext_wodeng" });
			emitted121.length = 0;
			ctx.game.combat = { id: "cmb_cf", started: true, round: 1, turn: 0 };
			ctx.game.user.targets = new Set([btEnemyTok]);
			await ctx.ChatMessage.create({
				content: `<div class="card"><div class="lancer-header">反火力套组</div><div class="effect-text">反火力套组</div></div>`,
				flags: { lancer: { actionData: { actor: cfMech.uuid, action: { name: "反火力套组", activation: "Reaction" } } } },
			});
			for (const p of emitted121) await L.handleModuleSocketMessage(p);
			ctx.game.user.targets = new Set();
			const owAvailAfterCf = L.checkReactionAvailability(cfMech, { kind: "overwatch", label: "守望", roundFlag: "usedOverwatchRound" });
			ok(
				L.getCombatState(cfMech).usedOverwatchRound === true
				&& btEnemyMech.statuses.has("lockon")
				&& owAvailAfterCf.ok === false,
				"沃登 III「反火力套组」触发后自动为锁定的攻击者施加锁定，并消耗本轮守望次数（1/轮）"
			);

			const bvMech = mkMech121("m_bv", "树绳妖", { frameLid: "mf_ext_banshee_vine", save: 14 });
			const pilotedVictim = mkMech121("m_bv_p", "有人机甲", { pilot: wwPilot });
			const unpilotedVictim = mkMech121("m_bv_u", "无人子机", { pilot: null });
			const pvTok = { id: "t_bvp", name: "有人机甲", actor: pilotedVictim, document: { uuid: pilotedVictim.uuid, name: "有人机甲" } };
			const uvTok = { id: "t_bvu", name: "无人子机", actor: unpilotedVictim, document: { uuid: unpilotedVictim.uuid, name: "无人子机" } };
			ctx.canvas.tokens.controlled = [];
			const bvCard = await ctx.ChatMessage.create({
				content: `<div class="card"><div class="lancer-header">面部附着者/胸腔爆裂者</div><div class="effect-text">选择感应内一个敌方角色进行系统豁免。</div></div>`,
				flags: { lancer: { actionData: { actor: bvMech.uuid, action: { core_active: true, name: "面部附着者/胸腔爆裂者" } } } },
			});
			const bvInfo = L.analyzeCard(bvCard);
			ctx.Roll = class { constructor() {} async evaluate() { return { total: 5 }; } }; // 豁免失败 (5 < 14)
			ctx.game.user.targets = new Set([pvTok, uvTok]);
			await L.executeCardSave(bvCard, bvInfo.saves[0]);
			ctx.game.user.targets = new Set();
			ok(
				!pilotedVictim.statuses.has("stunned")
				&& unpilotedVictim.statuses.has("stunned"),
				"树绳妖「面部附着者/胸腔爆裂者」系统豁免失败时：普通有人机甲仅提示下马移动而不晕眩，无驾驶员/无法离舱目标自动改为晕眩"
			);

			ctx.Roll = prevRoll121;
			ctx.ChatMessage = prevChatMsg121;
			ctx.fromUuidSync = prevFromUuidSync121;
			ctx.game.actors = prevActors121;
			ctx.game.socket = prevSocket121;
			ctx.game.users = prevUsers121;
			ctx.game.user = prevUser121;
			ctx.canvas = prevCanvas121;
			ctx.game.combat = prevCombat121;
			ctx.game.lancer = prevLancer121;
			ctx.ui = prevUi121;
		}

		// ---- v1.21.1 投掷近战武器（刺枪 vs 匕首 + 猎人 II「匕首戏法」）真实 Foundry Collection 回归测试
		{
			const L = ctx.LancerCN;
			const prevLancer1211 = ctx.game.lancer;
			const prevSettingsGet1211 = ctx.game.settings.get;
			const prevSettingsMap1211 = ctx.game.settings.settings;
			const prevCanvas1211 = ctx.canvas;
			const prevTargets1211 = ctx.game.user.targets;
			const prevFromUuidSync1211 = ctx.fromUuidSync;
			const prevSetTimeout1211 = ctx.setTimeout;

			// 模拟真实 Foundry VTT EmbeddedCollection（继承自 Map，无 Array.prototype.flatMap）
			class FakeFoundryCollection extends Map {
				constructor(entries = []) {
					super();
					for (const item of entries) this.set(item.id, item);
				}
				[Symbol.iterator]() { return this.values(); }
				filter(fn) { return Array.from(this.values()).filter(fn); }
				find(fn) { return Array.from(this.values()).find(fn); }
				some(fn) { return Array.from(this.values()).some(fn); }
				map(fn) { return Array.from(this.values()).map(fn); }
			}
			// 模拟真实 foundryvtt-lancer 的 Tag 类（读 game.settings.get("lancer", "tagConfig")）
			class FakeLancerTag {
				constructor(data) {
					this.lid = data.lid;
					this.val = String(data.val ?? "");
					const cfg = ctx.game.settings.get("lancer", "tagConfig")?.[data.lid];
					this.name = cfg?.name ?? "...";
					this.description = cfg?.description ?? "Tag not found";
					this.hidden = cfg?.hidden ?? false;
				}
				get is_thrown() { return this.lid === "tg_thrown"; }
				get num_val() { const n = Number.parseInt(this.val, 10); return Number.isNaN(n) ? null : n; }
				tierVal() { return this.val; }
				save() { return { lid: this.lid, val: this.val }; }
				copy() { return new FakeLancerTag(this.save()); }
			}

			const fakeSettingsMap = new Map([["lancer.tagConfig", {}]]);
			ctx.game.settings.settings = fakeSettingsMap;
			ctx.game.settings.get = (ns, key) => {
				if (ns === "lancer" && key === "tagConfig") {
					return {
						tg_thrown: { lid: "tg_thrown", name: "投掷{VAL}", description: "可将武器投向{VAL}格内目标。", hidden: false },
						tg_knockback: { lid: "tg_knockback", name: "击退{VAL}", description: "命中击退{VAL}格。", hidden: false },
					};
				}
				if (ns === "lancer" && key === "tag_config") {
					throw new Error("lancer.tag_config is not a registered game setting");
				}
				return prevSettingsGet1211(ns, key);
			};

			const mkColWpn = (id, name, lid, size, range, tags) => {
				const tagObjs = tags.map(t => new FakeLancerTag(t));
				const prof = {
					type: "Melee",
					range: range.map(r => ({ ...r })),
					all_range: range.map(r => ({ ...r })),
					tags: tagObjs.map(t => t.copy()),
					all_tags: tagObjs.map(t => t.copy()),
					damage: [{ type: "Kinetic", val: size === "Main" ? "1d6" : "1d3+1" }],
				};
				return {
					id,
					uuid: `Actor.m_col_hunter.Item.${id}`,
					name,
					type: "mech_weapon",
					is_mech_weapon: () => true,
					currentProfile: () => prof,
					getTags: () => prof.all_tags,
					isLoading: () => false,
					isLimited: () => false,
					system: {
						lid,
						size,
						destroyed: false,
						selected_profile_index: 0,
						active_profile: prof,
						profiles: [prof],
						tags: tagObjs.map(t => t.copy()),
						all_tags: tagObjs.map(t => t.copy()),
					},
				};
			};

			const warPikeCol = mkColWpn("wp_pike", "刺枪", "mw_war_pike", "Main", [{ type: "Threat", val: 3 }], [{ lid: "tg_knockback", val: "1" }, { lid: "tg_thrown", val: "5" }]);
			const tacKnifeCol = mkColWpn("wp_tac", "战术匕首", "mw_tactical_knife", "Auxiliary", [{ type: "Threat", val: 1 }], [{ lid: "tg_thrown", val: "3" }]);
			const segKnifeCol = mkColWpn("wp_seg", "多段刀", "mw_segment_knife", "Auxiliary", [{ type: "Threat", val: 1 }], []);
			const foldKnifeCol = mkColWpn("wp_fold", "翘曲匕首", "mw_fold_knife", "Auxiliary", [{ type: "Threat", val: 1 }], []);

			const colFlags = {};
			const colPilot = {
				id: "p_col_hunter",
				uuid: "Actor.p_col_hunter",
				type: "pilot",
				is_pilot: () => true,
				itemTypes: { talent: [{ type: "talent", system: { lid: "t_hunter", curr_rank: 3 } }] },
				items: new FakeFoundryCollection([{ id: "tal_h", type: "talent", system: { lid: "t_hunter", curr_rank: 3 } }]),
			};
			const colMech = {
				id: "m_col_hunter",
				uuid: "Actor.m_col_hunter",
				name: "猎人纳尔逊",
				type: "mech",
				is_mech: () => true,
				isOwner: true,
				statuses: new Set(),
				items: new FakeFoundryCollection([warPikeCol, tacKnifeCol, segKnifeCol, foldKnifeCol]),
				getFlag: (ns, k) => colFlags[`${ns}.${k}`],
				setFlag: async (ns, k, v) => { colFlags[`${ns}.${k}`] = v; },
				system: {
					pilot: { value: colPilot },
					loadout: { frame: { value: { system: { lid: "mf_nelson" } } } },
				},
			};
			for (const w of colMech.items) { w.actor = colMech; w.parent = colMech; }

			// 1) 清空标签类缓存后，面对无 .flatMap() 的 Foundry EmbeddedCollection，resolveLancerTagClass 与 applyKnifeJugglerTags 必须零异常且构造真实 Tag 实例
			L.resetCachedTagClass();
			ok(typeof colMech.items.flatMap === "undefined", "测试夹具的 actor.items 正确模拟真实 Foundry EmbeddedCollection（无 flatMap 方法）");
			let knifeJugglerErr = null;
			try {
				L.applyKnifeJugglerTags(tacKnifeCol, colMech);
				L.applyKnifeJugglerTags(segKnifeCol, colMech);
				L.applyKnifeJugglerTags(foldKnifeCol, colMech);
			} catch (err) {
				knifeJugglerErr = err;
			}
			ok(
				!knifeJugglerErr
				&& tacKnifeCol.system.active_profile.all_tags.some(t => t instanceof FakeLancerTag && t.lid === "tg_thrown" && t.val === "5" && t.name === "投掷{VAL}")
				&& segKnifeCol.system.active_profile.all_tags.some(t => t instanceof FakeLancerTag && t.lid === "tg_thrown" && t.val === "5")
				&& foldKnifeCol.system.active_profile.all_tags.some(t => t instanceof FakeLancerTag && t.lid === "tg_thrown" && t.val === "5"),
				"真实 Foundry Collection（无 flatMap）下：猎人 II「匕首戏法」对战术匕首/多段刀/翘曲匕首注入投掷 5 不再崩溃，并正确复用 Tag 类与 tagConfig 译名"
			);

			// 2) 模拟真实 WeaponAttackFlow 步骤链（initAttackData -> setAttackTags -> printAttackCard）：刺枪与战术匕首/多段刀均能顺利完成冷缓存投掷流程并标记离手
			L.resetCachedTagClass();
			const selfTokC = { id: "tc_self", center: { x: 50, y: 50 }, actor: colMech, visible: true, document: { id: "tc_self", uuid: "Scene.sc.Token.tc_self", name: "猎人纳尔逊", disposition: 1 } };
			const enemyActC = { id: "a_ec", uuid: "Actor.a_ec", name: "斥候", type: "npc", statuses: new Set(), getFlag: () => undefined, system: { statuses: {} } };
			const enemyTokC = { id: "tc_enemy", center: { x: 550, y: 50 }, actor: enemyActC, visible: true, document: { id: "tc_enemy", uuid: "Scene.sc.Token.tc_enemy", name: "斥候", disposition: -1, actor: enemyActC } };
			enemyTokC.document.object = enemyTokC;
			ctx.canvas = {
				grid: {
					size: 100, distance: 1, isGridless: false,
					getOffset: pt => ({ i: Math.floor(pt.y / 100), j: Math.floor(pt.x / 100) }),
					getCenterPoint: off => ({ x: off.j * 100 + 50, y: off.i * 100 + 50 }),
					measurePath: ([a, b]) => ({ spaces: Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 100) }),
				},
				tokens: { controlled: [selfTokC], placeables: [selfTokC, enemyTokC], get: id => (id === "tc_enemy" ? enemyTokC : id === "tc_self" ? selfTokC : null) },
			};
			ctx.fromUuidSync = u => {
				if (u === "Scene.sc.Token.tc_enemy") return enemyTokC.document;
				if (u === colMech.uuid) return colMech;
				for (const w of colMech.items) if (w.uuid === u) return w;
				return prevFromUuidSync1211?.(u);
			};
			ctx.game.user.targets = new Set([enemyTokC]);

			const stepsC = new Map([
				["initAttackData", async st => {
					st.data.attack_type = "Melee";
					st.data.acc_diff = {
						weapon: { melee: true, thrown: st.item.system.active_profile.all_tags.some(t => t.lid === "tg_thrown"), seeking: false },
						base: { accuracy: 0, difficulty: 0 },
						targets: [{ targetUuid: "Scene.sc.Token.tc_enemy", accuracy: 0, difficulty: 0, cover: 1 }],
					};
					return true;
				}],
				["setAttackTags", async st => { st.data.tags = [...st.item.system.active_profile.all_tags]; return true; }],
				["printAttackCard", async () => true],
			]);
			ctx.game.lancer = { flowSteps: stepsC, flows: new Map() };
			L.patchLancerFlows();

			// 重置战术匕首的 all_tags 为未升级态（模拟首次攻击冷启动）
			tacKnifeCol.system.active_profile.all_tags = [new FakeLancerTag({ lid: "tg_thrown", val: "3" })];
			tacKnifeCol.system.all_tags = [new FakeLancerTag({ lid: "tg_thrown", val: "3" })];
			const tacFlowState = { actor: colMech, item: tacKnifeCol, data: {} };
			const tacInitOk = await stepsC.get("initAttackData")(tacFlowState);
			const tacTagsOk = await stepsC.get("setAttackTags")(tacFlowState);
			ok(
				tacInitOk === true
				&& tacTagsOk === true
				&& tacFlowState.data.acc_diff.weapon.thrown === true
				&& tacFlowState.data.tags.some(t => t.lid === "tg_thrown" && t.val === "5"),
				"战术匕首冷启动执行 initAttackData + setAttackTags 不崩溃，正确识别 5 格远投并写入投掷 5 标签"
			);

			// 3) 右侧准度面板勾选非「投掷」复选框（如「精准」）不应错误冻结 manualThrownOverride；仅勾选「投掷（*）」时才锁定手动覆盖
			ctx.setTimeout = fn => { fn(); return 1; };
			const prevPicker1211 = log.settingValues["lancer-cn.targetPicker"];
			log.settingValues["lancer-cn.targetPicker"] = true;
			class WeaponAttackFlow {}
			const hudFlow = new WeaponAttackFlow();
			hudFlow.state = tacFlowState;
			tacFlowState.data.acc_diff.weapon.thrown = false;
			L.openTargetPicker(hudFlow);
			L.onHudZoneChange({
				target: {
					type: "checkbox",
					closest: sel => (sel === "#accdiff-hud" ? {} : sel === "label" ? { textContent: "精准 (+1)" } : null),
				},
			});
			ok(L.targetSession()?.manualThrownOverride === undefined || L.targetSession()?.manualThrownOverride === null, "在右侧面板勾选「精准 (+1)」不会误冻结投掷手动覆盖标记");
			tacFlowState.data.acc_diff.weapon.thrown = true;
			L.onHudZoneChange({
				target: {
					type: "checkbox",
					closest: sel => (sel === "#accdiff-hud" ? {} : sel === "label" ? { textContent: "投掷（*）" } : null),
				},
			});
			ok(L.targetSession()?.manualThrownOverride === true, "在右侧面板手动切换「投掷（*）」复选框才会写入 manualThrownOverride");
			L.closeTargetPicker(hudFlow, false);
			log.settingValues["lancer-cn.targetPicker"] = prevPicker1211;

			// 4) 猎人 III「蔑刃」若底层 flow.begin() 抛出异常，应自动回滚 usedHunterDisdainful 不浪费本轮次数
			class ThrowingFlow {
				async begin() { throw new Error("mock flow crash"); }
			}
			ctx.game.lancer.flows.set("WeaponAttackFlow", ThrowingFlow);
			let caughtDisdainErr = false;
			try { await L.triggerHunterDisdainful(colMech, tacKnifeCol.id); } catch { caughtDisdainErr = true; }
			ok(caughtDisdainErr && L.getCombatState(colMech).usedHunterDisdainful === false, "猎人 III「蔑刃」在攻击流程异常中断时自动回滚本轮已用标记");

			// 5) makeThrownTag 在仅注册 tagConfig（不注册 tag_config）且无 Tag 类时，正确读取中文配置不抛异常
			L.resetCachedTagClass();
			const fbTag = L.makeThrownTag(5, null);
			ok(fbTag.lid === "tg_thrown" && fbTag.val === "5" && fbTag.name === "投掷{VAL}" && fbTag.is_thrown === true, "makeThrownTag 优先读取真实设置键 tagConfig 并在回退对象中保留完整 Tag 接口");

			ctx.setTimeout = prevSetTimeout1211;
			ctx.fromUuidSync = prevFromUuidSync1211;
			ctx.game.user.targets = prevTargets1211;
			ctx.canvas = prevCanvas1211;
			ctx.game.settings.get = prevSettingsGet1211;
			ctx.game.settings.settings = prevSettingsMap1211;
			ctx.game.lancer = prevLancer1211;
		}

		// ---- v1.22.0 实桌四项修复回归测试：领袖领导骰全链路、角色表滚动位置锁定、原型武器受限计数、模因火花 NHP 数量绑定
		{
			const prevActors122 = ctx.game.actors;
			const prevCanvas122 = ctx.canvas;
			const prevTargets122 = ctx.game.user?.targets;
			const prevUsers122 = ctx.game.users;
			const prevSocket122 = ctx.game.socket;
			const prevChat122 = ctx.ChatMessage;
			const prevRoll122 = ctx.Roll;
			const prevFromUuidSync122 = ctx.fromUuidSync;
			const prevLancer122 = ctx.game.lancer;
			const prevDoc122 = ctx.document;
			const prevFoundry122 = ctx.foundry;
			const prevRAF122 = ctx.requestAnimationFrame;

			const emitted122 = [];
			const createdMsgs122 = [];
			const mockActors122 = new Map();
			const mockItems122 = new Map();

			ctx.game.socket = { emit: (ch, msg) => emitted122.push({ ch, msg }) };
			ctx.game.users = { activeGM: { isSelf: true } };
			ctx.game.actors = Object.assign([...mockActors122.values()], {
				get: id => mockActors122.get(id) ?? null,
				[Symbol.iterator]: () => mockActors122.values(),
			});
			ctx.fromUuidSync = u => {
				if (mockItems122.has(u)) return mockItems122.get(u);
				for (const a of mockActors122.values()) {
					if (a.uuid === u) return a;
					const it = (a.items ?? []).find(i => i?.uuid === u || i?.id === u);
					if (it) return it;
				}
				return null;
			};
			ctx.ChatMessage = {
				getSpeaker: o => ({ actor: o?.actor?.id ?? o?.actor?.name ?? "" }),
				create: async d => {
					const m = {
						id: `m122_${createdMsgs122.length + 1}`,
						...d,
						isAuthor: true,
						getFlag(ns, k) { return this.flags?.[ns]?.[k]; },
						async setFlag(ns, k, v) { (this.flags ||= {})[ns] ||= {}; this.flags[ns][k] = v; },
					};
					createdMsgs122.push(m);
					return m;
				},
			};

			const mkMech122 = (id, name, { isOwner = true, pilot = null, items = [], hp = 12, limitedBonus = 0 } = {}) => {
				const flags = {};
				const m = {
					id, uuid: `Actor.${id}`, name, type: "mech", is_mech: () => true, isOwner, hasPlayerOwner: true,
					flags, items,
					statuses: new Set(),
					system: {
						pilot: { value: pilot, id: pilot?.id ?? null },
						hp: { value: hp, max: hp },
						overshield: { value: 0 },
						heat: { value: 0, max: 6 },
						burn: 0,
						armor: 1,
						structure: { value: 4, max: 4 },
						stress: { value: 4, max: 4 },
						loadout: { limited_bonus: limitedBonus, systems: items.filter(i => i.type === "mech_system").map(i => ({ id: i.id, value: i })) },
					},
					getFlag(ns, k) { return this.flags?.[ns]?.[k]; },
					async setFlag(ns, k, v) { (this.flags ||= {})[ns] ||= {}; this.flags[ns][k] = v; },
					async unsetFlag(ns, k) { if (this.flags?.[ns]) delete this.flags[ns][k]; },
					async update(patch) {
						for (const [k, v] of Object.entries(patch ?? {})) {
							if (k === "system.hp.value") this.system.hp.value = v;
							if (k === "system.burn") this.system.burn = v;
						}
					},
					reset() { this._resetCalls = (this._resetCalls || 0) + 1; },
					sheet: { rendered: false, render() { this._renders = (this._renders || 0) + 1; } },
				};
				for (const it of items) {
					it.actor = m;
					it.parent = m;
					if (it.uuid) mockItems122.set(it.uuid, it);
				}
				mockActors122.set(id, m);
				return m;
			};

			// 1) 领袖天赋（t_leader）：默认初始化 3/5/6（绕过上游 ctr_leader default_value: 0）、发放给队友、禁止重复/自有骰时禁用、+1 准度 / R3 +1d6 伤害 / R3 -1d6 减伤、自由动作归还、休息回 1、场景结束清除队友领导骰
			const makeLeaderTalent = (rank, ctrVal = 0, ctrMax = 6) => {
				const t = {
					id: `tl_${rank}_${Math.random().toString(36).slice(2, 6)}`,
					type: "talent",
					is_talent: () => true,
					isOwner: true,
					system: {
						lid: "t_leader",
						curr_rank: rank,
						counters: [{ lid: "ctr_leader", name: "领导骰", value: ctrVal, min: 0, max: ctrMax }],
					},
					async update(u) {
						if (u["system.counters"]) this.system.counters = u["system.counters"];
					},
				};
				return t;
			};

			const ldrTalent1 = makeLeaderTalent(1, 0, 6);
			const ldrPilot1 = { id: "p_ldr1", type: "pilot", is_pilot: () => true, isOwner: true, items: [ldrTalent1], itemTypes: { talent: [ldrTalent1] }, system: { active_mech: { value: null } } };
			const ldrMech1 = mkMech122("m_ldr1", "指挥官一号", { pilot: ldrPilot1 });
			ldrPilot1.system.active_mech.value = ldrMech1;
			ldrTalent1.actor = ldrPilot1;
			ldrTalent1.parent = ldrPilot1;

			ok(L.getTalentDie(ldrMech1, "leader") === 3, "领袖 I 原生 ctr_leader.value 为 0 且未记录 flag 时，自动初始化为 3 颗领导骰");
			await L.syncLeaderCounter(ldrMech1);
			ok(
				ldrTalent1.system.counters[0].value === 3 && ldrTalent1.system.counters[0].max === 3 && ldrMech1.flags["lancer-cn"]?.talentDice?.leader === 3,
				"syncLeaderCounter 将领袖 I 的 talentDice 与 ctr_leader 同步为 3/3"
			);

			// 升级至领袖 III（R1→R3）：自动补增上限至 6 并同步计数器
			ldrTalent1.system.curr_rank = 3;
			await L.syncLeaderCounter(ldrMech1);
			ok(
				L.getTalentDie(ldrMech1, "leader") === 6 && ldrTalent1.system.counters[0].max === 6 && ldrTalent1.system.counters[0].value === 6,
				"领袖升级至 III 级后，领导骰自动增至 6/6 并同步更新 ctr_leader 上限"
			);

			// 消耗至 0 颗后不再被误回满，且休息可回 1 颗
			await L.setTalentDie(ldrMech1, "leader", 0);
			await L.syncLeaderCounter(ldrMech1);
			ok(L.getTalentDie(ldrMech1, "leader") === 0, "手动/消耗至 0 颗领导骰后 syncLeaderCounter 保持为 0 不误回满");
			await L.restRecoverLeaderDie(ldrMech1);
			ok(L.getTalentDie(ldrMech1, "leader") === 1, "领袖剩余 0 颗领导骰时点击休息回复 1 颗");
			await L.setTalentDie(ldrMech1, "leader", 6);

			// 发放领导骰给队友（支持跨玩家 GM socket）
			const allyMech122 = mkMech122("m_ally122", "突击队友", { isOwner: false });
			ctx.canvas = { tokens: { placeables: [
				{ id: "tok_l1", name: "指挥官一号", actor: ldrMech1, document: { uuid: ldrMech1.uuid, disposition: 1 } },
				{ id: "tok_a1", name: "突击队友", actor: allyMech122, document: { uuid: allyMech122.uuid, disposition: 1 } },
			] } };
			emitted122.length = 0;
			const giveRes = await L.giveLeaderDie(ldrMech1, allyMech122, { order: "集火重甲" });
			ok(giveRes?.ok === true && L.getTalentDie(ldrMech1, "leader") === 5, "向队友发放领导骰后领袖剩余骰数减 1（6→5）");
			const setRecSock = emitted122.find(e => e.msg?.action === "setReceivedLeaderDie");
			ok(Boolean(setRecSock && setRecSock.msg.payload?.leaderRank === 3 && setRecSock.msg.payload?.order === "集火重甲"), "跨玩家发放领导骰时通过 GM socket 同步至队友机甲");
			// 模拟 GM 端接收 socket 写入队友机甲
			allyMech122.isOwner = true;
			await L.handleModuleSocketMessage(setRecSock.msg);
			ok(L.getReceivedLeaderDie(allyMech122)?.fromName === "指挥官一号" && L.getReceivedLeaderDie(allyMech122)?.leaderRank === 3, "GM 处理 setReceivedLeaderDie 后队友机甲正确持有来自领袖 III 的领导骰");
			// 禁止向已持有领导骰的队友重复发放
			const dupGive = await L.giveLeaderDie(ldrMech1, allyMech122, { order: "重复" });
			ok(dupGive === false && L.getTalentDie(ldrMech1, "leader") === 5, "队友已持有领导骰时禁止重复发放且不扣减领袖骰数");

			// 队友机甲战术栏展示 +1 准度、R3 +1d6 伤害、-1d6 减伤与归还按钮
			const allyBarHtml = L.renderTalentControlHTML(allyMech122);
			ok(
				allyBarHtml.includes("领导骰（来自 指挥官一号") && allyBarHtml.includes("leaderArm:acc") && allyBarHtml.includes("leaderArm:dmg") && allyBarHtml.includes("leaderReduceDmg") && allyBarHtml.includes("leaderReturn"),
				"即使队友无其他天赋，收到领袖 III 领导骰后机甲战术栏也渲染 +1 准度、+1d6 伤害、-1d6 减伤与归还按钮"
			);

			// 另一名自身还有领导骰的队友：禁止使用他人领导骰，但仍可归还
			const otherLdrT = makeLeaderTalent(1, 0, 6);
			const otherLdrP = { id: "p_ldr2", type: "pilot", is_pilot: () => true, isOwner: true, items: [otherLdrT], itemTypes: { talent: [otherLdrT] }, system: { active_mech: { value: null } } };
			const otherLdrM = mkMech122("m_ldr2", "副队长", { pilot: otherLdrP });
			otherLdrP.system.active_mech.value = otherLdrM;
			await L.giveLeaderDie(ldrMech1, otherLdrM, { order: "掩护" });
			ok(L.canUseReceivedLeaderDie(otherLdrM).ok === false && await L.armReceivedLeaderDie(otherLdrM, "acc") === false, "自身仍有剩余领导骰时不能使用来自其他角色的领导骰");
			// 归还领导骰（跨玩家 GM socket 回退至领袖池）
			ldrMech1.isOwner = false;
			emitted122.length = 0;
			const retOk = await L.returnLeaderDie(otherLdrM);
			const retSock = emitted122.find(e => e.msg?.action === "returnLeaderDie");
			ok(retOk === true && !L.getReceivedLeaderDie(otherLdrM) && Boolean(retSock), "即使自身有领导骰无法使用他人骰子，仍可以自由动作归还并通过 GM socket 退回");
			ldrMech1.isOwner = true;
			await L.handleModuleSocketMessage(retSock.msg);
			ok(L.getTalentDie(ldrMech1, "leader") === 5, "GM 处理 returnLeaderDie 后领袖领导骰数量正确 +1（4→5）");

			// 队友预激活 +1 准度：注入攻击/科技/技能检定，取消时不消耗，出卡后消耗
			const flowSteps122 = new Map([
				["initAttackData", async () => true],
				["printAttackCard", async () => true],
				["initTechAttackData", async () => true],
				["printTechAttackCard", async () => true],
				["initStatRollData", async () => true],
				["printStatRollCard", async () => true],
				["setDamageTags", async () => true],
				["printDamageCard", async () => true],
			]);
			ctx.game.lancer = { flowSteps: flowSteps122, flows: new Map() };
			L.patchLancerFlows();
			await L.armReceivedLeaderDie(allyMech122, "acc");
			const atkSt122 = { actor: allyMech122, item: null, data: { attack_type: "Ranged", acc_diff: { base: { accuracy: 0, difficulty: 0 }, weapon: {}, targets: [] } } };
			await flowSteps122.get("initAttackData")(atkSt122, {});
			ok(atkSt122.data.acc_diff.base.accuracy === 1 && Boolean(L.getReceivedLeaderDie(allyMech122)), "预激活领导骰 +1 准度在 initAttackData 正确加 +1 准度，且确认出卡前未提前消耗（取消安全）");
			await flowSteps122.get("printAttackCard")(atkSt122, {});
			ok(!L.getReceivedLeaderDie(allyMech122), "攻击卡实际输出后自动消耗队友持有的领导骰");

			// 科技攻击与技能检定同样消费预激活的领导骰 +1 准度
			await L.giveLeaderDie(ldrMech1, allyMech122, { order: "科技入侵" });
			await L.armReceivedLeaderDie(allyMech122, "acc");
			const techSt122 = { actor: allyMech122, item: null, data: { attack_type: "Tech", acc_diff: { base: { accuracy: 0, difficulty: 0 }, targets: [] } } };
			await flowSteps122.get("initTechAttackData")(techSt122, {});
			ok(techSt122.data.acc_diff.base.accuracy === 1 && Boolean(L.getReceivedLeaderDie(allyMech122)), "预激活领导骰 +1 准度在 initTechAttackData 生效且取消安全");
			await flowSteps122.get("printTechAttackCard")(techSt122, {});
			ok(!L.getReceivedLeaderDie(allyMech122), "科技攻击卡输出后自动消耗领导骰");

			await L.giveLeaderDie(ldrMech1, allyMech122, { order: "机动" });
			await L.armReceivedLeaderDie(allyMech122, "acc");
			const statSt122 = { actor: allyMech122, item: null, data: { path: "system.agi", title: "敏捷检定", acc_diff: { base: { accuracy: 0, difficulty: 0 } } } };
			await flowSteps122.get("initStatRollData")(statSt122, {});
			ok(statSt122.data.acc_diff.base.accuracy === 1 && Boolean(L.getReceivedLeaderDie(allyMech122)), "预激活领导骰 +1 准度在 initStatRollData 生效且取消安全");
			await flowSteps122.get("printStatRollCard")(statSt122, {});
			ok(!L.getReceivedLeaderDie(allyMech122), "技能检定卡输出后自动消耗领导骰");

			// R3 预激活 +1d6 额外伤害
			await L.giveLeaderDie(ldrMech1, allyMech122, { order: "猛攻" });
			await L.armReceivedLeaderDie(allyMech122, "dmg");
			const dmgSt122 = { actor: allyMech122, item: null, data: { attack_type: "Melee", damage: [{ type: "Kinetic", val: "1d6" }], bonus_damage: [], hit_results: [] } };
			await flowSteps122.get("setDamageTags")(dmgSt122, {});
			ok(dmgSt122.data.bonus_damage.some(b => b.val === "1d6") && Boolean(L.getReceivedLeaderDie(allyMech122)), "领袖 III 领导骰预激活 +1d6 伤害正确注入 bonus_damage 且取消安全");
			await flowSteps122.get("printDamageCard")(dmgSt122, {});
			ok(!L.getReceivedLeaderDie(allyMech122), "伤害卡输出后自动消耗 R3 领导骰");

			// R3 -1d6 减伤（roll 1d6 = 4，预览与实际结算减 4 点伤；含伤害卡内联 leaderDamageReduction）
			await L.giveLeaderDie(ldrMech1, allyMech122, { order: "防守" });
			ctx.Roll = class { constructor(f) { this.formula = f; } async evaluate() { this.total = 4; return this; } async toMessage() {} };
			const redRes = await L.useLeaderDieReduceDamage(allyMech122);
			ok(redRes?.ok === true && redRes.amount === 4 && !L.getReceivedLeaderDie(allyMech122), "领袖 III 领导骰减伤掷出 1d6=4 并消耗领导骰");
			const redPrev = L.previewDamageCalc(allyMech122, [{ type: "Kinetic", amount: 8 }], { multiple: 1, ap: false, paracausal: false });
			ok(redPrev.hpLoss === 3 && redPrev.notes.includes("领导骰 -4"), `领导骰 -4 正确参与伤害预览计算（8 - 1 护甲 - 4 领导骰 = 3 HP，实际 ${redPrev.hpLoss}）`);

			// 发放领导骰聊天卡（leaderDieCard）渲染队友一键归还按钮
			const ldrCardMsg = createdMsgs122.find(m => m.flags?.["lancer-cn"]?.leaderDieCard);
			await L.giveLeaderDie(ldrMech1, allyMech122, { order: "归还测试" });
			const latestLdrCard = createdMsgs122.at(-1);
			const chatInserted = [];
			const mockChatRoot = {
				querySelector: s => (s === ".message-content" ? { insertAdjacentHTML: (_p, h) => chatInserted.push(h), querySelector: () => ({ addEventListener: () => {} }) } : null),
			};
			L.onRenderChatMessage(latestLdrCard, mockChatRoot);
			ok(
				Boolean(ldrCardMsg) && chatInserted.some(h => h.includes("data-lancer-cn-leader-return") && h.includes("自由动作归还领导骰")),
				"发放领导骰聊天卡渲染队友一键「自由动作归还领导骰」按钮"
			);
			await L.returnLeaderDie(allyMech122, { message: latestLdrCard });
			ok(latestLdrCard.flags["lancer-cn"].leaderDieCard.status === "returned", "归还领导骰后聊天卡标记为 returned");

			// 场景结束：清除队友未用完的领导骰，保留领袖自身未用完的领导骰
			await L.giveLeaderDie(ldrMech1, allyMech122, { order: "留存" });
			const ldrBeforeEnd = L.getTalentDie(ldrMech1, "leader");
			await L.resetSceneTalentState(allyMech122);
			await L.resetSceneTalentState(ldrMech1);
			ok(!L.getReceivedLeaderDie(allyMech122) && L.getTalentDie(ldrMech1, "leader") === ldrBeforeEnd, "场景结束清除队友持有的领导骰，领袖自身剩余领导骰跨场景保留");

			// 2) 角色表 / 物品表滚动位置锁定：保存/恢复 .window-content & .scroll-body、渲染期间屏蔽伪滚动事件、onTalentItemChanged 不在普通计数器更新时整表 reset、needsManualSheetRefresh 防重复重绘
			const mkScrollEl = (sel, initTop = 0) => {
				const listeners = {};
				return {
					scrollTop: initTop,
					scrollLeft: 0,
					matches: s => s === sel,
					addEventListener: (ev, fn) => { (listeners[ev] ||= []).push(fn); },
					fire: ev => (listeners[ev] || []).forEach(fn => fn()),
				};
			};
			const winContent = mkScrollEl(".window-content", 340);
			const scrollBody = mkScrollEl(".scroll-body", 180);
			let activeTab122 = "loadout";
			const winEl122 = {
				closest: s => (s.includes(".window-app") ? winEl122 : null),
				matches: () => false,
				addEventListener: () => {},
				querySelector: s => {
					if (s.includes("data-tab") && s.includes("active")) return { dataset: { tab: activeTab122 } };
					if (s === ".window-content") return winContent;
					if (s === ".scroll-body") return scrollBody;
					return null;
				},
			};
			const mockSheetApp = {
				appId: 77,
				rendered: true,
				options: { classes: ["lancer", "sheet", "actor", "mech"] },
				element: [winEl122],
			};
			L.bindSheetScrollTracker(mockSheetApp, winEl122);
			L.captureSheetScroll(mockSheetApp, winEl122);
			// 模拟重绘时容器被重置或被浏览器锚定推到底部
			winContent.scrollTop = 999;
			scrollBody.scrollTop = 0;
			let rafCb = null;
			ctx.requestAnimationFrame = fn => { rafCb = fn; return 1; };
			L.restoreSheetScroll(mockSheetApp, winEl122);
			ok(winContent.scrollTop === 340 && scrollBody.scrollTop === 180, "restoreSheetScroll 同步恢复 .window-content (340) 与 .scroll-body (180) 的滚动位置");
			winContent.scrollTop = 700;
			if (rafCb) rafCb();
			ok(winContent.scrollTop === 340, "下一帧 rAF 保护再次纠偏布局后的滚动漂移");

			// 测试 _render 包装：渲染期间触发的伪 scroll 事件不得覆盖已保存位置，渲染完毕自动还原
			class MockActorSheet122 {
				async _render() {
					winContent.scrollTop = 920;
					winContent.fire("scroll"); // 模拟 DOM 替换时的伪 scroll 事件
				}
			}
			ctx.foundry = { ...(prevFoundry122 ?? {}), appv1: { sheets: { ActorSheet: MockActorSheet122 } } };
			L.patchSheetScrollPreservation();
			const shInst = Object.assign(new MockActorSheet122(), { rendered: true, options: { classes: ["lancer", "sheet"] }, element: [winEl122] });
			L.bindSheetScrollTracker(shInst, winEl122);
			winContent.scrollTop = 260;
			winContent.fire("scroll");
			await shInst._render(false);
			ok(winContent.scrollTop === 260, "_render 包装在渲染期屏蔽伪 scroll 并在重绘结束后精确还原 scrollTop (260)");

			// onTalentItemChanged：仅修改 counters 时不触发机甲 reset() 与重复重绘，仅升级 curr_rank 时触发
			ldrMech1._resetCalls = 0;
			ldrMech1.sheet.rendered = true;
			ldrMech1.sheet._renders = 0;
			L.onTalentItemChanged(ldrTalent1, { system: { counters: [{ lid: "ctr_leader", value: 2, max: 6 }] } });
			ok(ldrMech1._resetCalls === 0 && ldrMech1.sheet._renders === 0, "onTalentItemChanged 在仅更新天赋计数器时不触发机甲整表 reset 与重复重绘");
			L.onTalentItemChanged(ldrTalent1, { system: { curr_rank: 3 } });
			ok(ldrMech1._resetCalls === 1 && ldrMech1.sheet._renders === 1, "onTalentItemChanged 在天赋等级变化时正常重算衍生属性并刷新");
			ldrMech1.apps = { 77: ldrMech1.sheet };
			ldrMech1.sheet.appId = 77;
			ok(L.needsManualSheetRefresh(ldrMech1) === false, "当角色表已注册在 actor.apps 中时 needsManualSheetRefresh 返回 false 避免二次重绘");
			ldrMech1.apps = {};
			ok(L.needsManualSheetRefresh(ldrMech1) === true, "当角色表未注册在 actor.apps 中时 needsManualSheetRefresh 返回 true 兜底刷新");

			// 3) 原型武器（mw_prototype_2）掷骰式受限计数：未掷前无 .limited-card 时自动注入掷骰按钮、掷骰后显示 +/- 与剩余计数、文字内受限公式点击直达 rollLimited
			const protoWpn122 = {
				id: "wp_proto2",
				uuid: "Actor.m_proto.Item.wp_proto2",
				documentName: "Item",
				type: "mech_weapon",
				name: "原型武器 II",
				flags: {},
				system: {
					lid: "mw_prototype_2",
					uses: { value: 0, max: 0 },
					active_profile: { all_tags: [{ is_limited: true, lid: "tg_limited", val: "1d6+2" }] },
				},
				getTags() { return this.system.active_profile.all_tags; },
				getFlag(ns, k) { return this.flags?.[ns]?.[k]; },
				async update(u) {
					if (`flags.lancer-cn.limitedRoll` in u) {
						(this.flags["lancer-cn"] ||= {}).limitedRoll = u["flags.lancer-cn.limitedRoll"];
					}
					if ("system.uses" in u) {
						this.system.uses.value = u["system.uses"];
						this.system.uses.max = L.diceLimitedMax(this);
					}
				},
			};
			const protoMech122 = mkMech122("m_proto", "DF-1A", { items: [protoWpn122], limitedBonus: 2 });
			// 构造未掷骰前无 .limited-card 的武器 DOM 骨架
			const injectedHtml = [];
			const flexRowMock = { insertAdjacentHTML: (_pos, html) => injectedHtml.push(html) };
			const wpnElMock = {
				dataset: { uuid: protoWpn122.uuid },
				querySelector: s => (s === ".lancer-body > .flexrow, .flexrow" ? flexRowMock : null),
			};
			const sheetRootMock = {
				querySelectorAll: s => (s.includes(".set[data-uuid*='Item']") ? [wpnElMock] : []),
				querySelector: () => null,
			};
			L.enhanceDiceLimitedElements(sheetRootMock, protoMech122);
			ok(
				injectedHtml.some(h => h.includes("lancer-cn-dice-limited") && h.includes("掷 1d6+2") && h.includes(protoWpn122.uuid)),
				"原型武器未掷受限前即便系统隐藏了 .limited-card，模组仍自动注入「受限：未掷」与「掷 1d6+2」按钮"
			);
			ok(await L.adjustLimitedUses(protoWpn122, -1) === null, "未掷受限次数前手动减次返回 null 并提示先掷骰");
			ctx.Roll = class { constructor(f) { this.formula = f; } async evaluate() { this.total = 5; return this; } async toMessage() {} };
			const rolledMax = await L.rollLimited(protoWpn122);
			ok(rolledMax === 7 && protoWpn122.system.uses.value === 7 && L.diceLimitedMax(protoWpn122) === 7, "原型武器掷出 1d6+2=5 且机甲受限加值 +2 时，上限与剩余次数记为 7");
			ok(await L.adjustLimitedUses(protoWpn122, -1) === 6 && protoWpn122.system.uses.value === 6, "adjustLimitedUses(-1) 正确将剩余次数从 7 扣减至 6");
			ok(await L.adjustLimitedUses(protoWpn122, 5) === 7 && protoWpn122.system.uses.value === 7, "adjustLimitedUses(+5) 正确钳制在受限上限 7 不溢出");
			// 掷骰后再次渲染：注入 - / 7 / 7 / + 与重掷按钮
			injectedHtml.length = 0;
			L.enhanceDiceLimitedElements(sheetRootMock, protoMech122);
			ok(
				injectedHtml.some(h => h.includes("7 / 7") && h.includes('data-lancer-cn-limited-step="-1"') && h.includes('data-lancer-cn-limited-step="1"')),
				"原型武器掷出受限次数后，卡片上清晰显示剩余次数「7 / 7」与 - / + 快捷计数按钮"
			);
			// 点击说明文字里的「1d6+2」（含「受限」上下文）自动走 rollLimited
			ctx.Roll = class { constructor(f) { this.formula = f; } async evaluate() { this.total = 6; return this; } async toMessage() {} };
			const linkEl = {
				dataset: { formula: "1d6+2" },
				closest: s => {
					if (s === ".lancer-cn-roll") return linkEl;
					if (s === "[data-uuid]") return { dataset: { uuid: protoWpn122.uuid } };
					if (s.includes(".effect-text")) return { textContent: "此外，每次全面维修时，重新掷1d6+2决定这武器的受限次数" };
					return null;
				},
			};
			L.onDiceClick({ target: linkEl, preventDefault() {}, stopPropagation() {} });
			await new Promise(r => setTimeout(r, 10));
			ok(protoWpn122.getFlag("lancer-cn", "limitedRoll") === 6 && protoWpn122.system.uses.value === 8, "点击原型武器说明文字里的「1d6+2」受限公式直接触发 rollLimited 并更新剩余次数（6+2=8）");

			// 原型武器独立物品表（onRenderItemSheet）同样注入受限掷骰与剩余计数栏
			const itemSheetInserted = [];
			const itemStatusRow = { insertAdjacentHTML: (_p, h) => itemSheetInserted.push(h) };
			const itemRootMock = {
				querySelector: s => (s === ".sheet-body" ? itemStatusRow : null),
				querySelectorAll: s => (s === ".card .lancer-header" ? [{ textContent: "STATUS", parentElement: { querySelector: () => itemStatusRow } }] : []),
			};
			L.onRenderItemSheet({ item: protoWpn122, element: [itemRootMock] }, itemRootMock);
			ok(
				itemSheetInserted.some(h => h.includes("8 / 8") && h.includes('data-lancer-cn-limited-step="-1"')),
				"打开原型武器独立物品表（ItemSheet）时同样注入受限掷骰与 +/- 剩余计数控件"
			);

			// 4) 偶像破坏者「模因火花」伤害绑定机甲内 NHP 数量（覆盖 TALENT :: 偶像破坏者 1 无 uuid 卡片、不稳定 NHP 卡片、侍从级 NHP 无 tg_no_cascade 正常计入、动态点击重算与战术栏快捷按钮）
			const icoPilot122 = {
				id: "p_ico122", type: "pilot", is_pilot: () => true, isOwner: true,
				items: [
					{ id: "ti1", type: "talent", system: { lid: "t_iconoclast", curr_rank: 3 } },
					{ id: "tt1", type: "talent", system: { lid: "t_technophile", curr_rank: 1 } },
				],
				itemTypes: {
					talent: [
						{ id: "ti1", type: "talent", system: { lid: "t_iconoclast", curr_rank: 3 } },
						{ id: "tt1", type: "talent", system: { lid: "t_technophile", curr_rank: 1 } },
					],
				},
				system: { active_mech: { value: null } },
			};
			const icoMech122 = mkMech122("m_ico122", "赫尔墨斯", {
				pilot: icoPilot122,
				items: [
					{ id: "nhp_un", type: "mech_system", name: "不稳定 NHP", system: { lid: "ms_iconoclast", type: "AI", tags: [{ lid: "tg_unique" }] } },
					{ id: "nhp_os", type: "mech_system", name: "欧西里斯级 NHP", system: { lid: "ms_osiris_class_nhp", type: "AI", tags: [{ lid: "tg_ai" }] } },
					{ id: "nhp_sv", type: "mech_system", name: "侍从级 NHP", system: { lid: "ms_technophile_1", type: "AI", tags: [{ lid: "tg_ai" }, { lid: "tg_unique" }] } },
					{ id: "ai_cc2", type: "mech_system", name: "COMP/CON", system: { lid: "ms_comp_con_class_assistant_unit", type: "AI", tags: [{ lid: "tg_ai" }, { lid: "tg_no_cascade" }] } },
					{ id: "ai_ent", type: "mech_system", name: "纠缠共意识装置", system: { lid: "ms_entangled_co-consciousness_rig", type: "AI", tags: [{ lid: "tg_ai" }] } },
				],
			});
			icoPilot122.system.active_mech.value = icoMech122;

			const nhpList122 = L.listMechNHPs(icoMech122);
			ok(
				nhpList122.count === 3 && nhpList122.names.includes("不稳定 NHP") && nhpList122.names.includes("欧西里斯级 NHP") && nhpList122.names.includes("侍从级 NHP"),
				`listMechNHPs 正确计入不稳定 NHP、欧西里斯与不带 tg_no_cascade 的侍从级 NHP（共 3 个），排除 COMP/CON 与纠缠共意识装置（实际：${nhpList122.count}）`
			);

			// 复现真实日志「// TALENT :: 偶像破坏者 1 // 海侵」（无 data-uuid，发言者为机甲或驾驶员）
			const realLogCard = {
				id: "msg_hermes_log",
				speaker: { actor: icoMech122.id },
				content: `<div class="card clipped-bot"><div class="lancer-header lancer-talent">// TALENT :: 偶像破坏者 1 //</div><span class="major">海侵</span><div class="effect-text">你可以选择为你的机甲装备一个 不稳定 NHP 系统。模因火花：对射程3内的一个角色造成 1 AP 能量伤害。你的机甲上每有一个未被摧毁的 NHP（包括这个），火花就造成 +1 伤害。</div></div>`,
				getFlag: () => undefined,
			};
			const realLogInfo = L.analyzeCard(realLogCard, null);
			ok(
				realLogInfo?.nonAttackDamage?.memeticSpark === true && realLogInfo.nonAttackDamage.damage?.[0]?.val === "4" && realLogInfo.nonAttackDamage.ap === true,
				`复现真实日志「TALENT :: 偶像破坏者 1 // 海侵」（无 data-uuid）绑定机甲 3 NHP = 4 点穿甲能量（不再误打 1 点，实际：${realLogInfo?.nonAttackDamage?.damage?.[0]?.val}）`
			);

			// Rank 2「内化火花」仍保持固定 2 点穿甲能量（不被模因火花误覆盖）
			const r2SparkCard = {
				id: "msg_r2_spark",
				speaker: { actor: icoMech122.id },
				content: `<div class="card clipped-bot"><div class="lancer-header lancer-primary">// 内化火花 //</div><div class="effect-text">投射出线形3的闪电弧。线形内你所选的角色受到 2 AP 能量伤害。</div></div>`,
				getFlag: () => undefined,
			};
			const r2Info = L.analyzeCard(r2SparkCard, null);
			ok(r2Info?.nonAttackDamage?.damage?.[0]?.val === "2" && !r2Info?.nonAttackDamage?.memeticSpark, "偶像破坏者 II「内化火花」保持固定 2 点穿甲能量，不被模因火花公式误覆盖");

			// Rank 3「超然」卡含「模因火花获得 +4 伤害」与「超然骰」，不被误判为模因火花出伤卡
			const r3Card = {
				id: "msg_r3_trans",
				speaker: { actor: icoMech122.id },
				content: `<div class="card clipped-bot"><div class="lancer-header lancer-talent">// TALENT :: 偶像破坏者 3 //</div><div class="effect-text">获得超然骰：一个从 3 开始的 d3。模因火花获得 +4 伤害和 +5 射程。</div></div>`,
				getFlag: () => undefined,
			};
			ok(!L.analyzeCard(r3Card, null)?.nonAttackDamage?.memeticSpark, "偶像破坏者 III「超然」说明卡不被误识别为模因火花出伤卡");

			// 动态重算：当欧西里斯 NHP 被摧毁后，点击先前已发出的模因火花卡片仍按实时 2 NHP = 3 点伤害结算；激活超然后变为 3+4 = 7 点
			let capturedDmgFlowArgs = null;
			class MockDmgFlow122 {
				constructor(_u, d) { capturedDmgFlowArgs = d; this.state = { data: d }; }
				async begin() { return true; }
			}
			ctx.game.lancer.flows.set("DamageRollFlow", MockDmgFlow122);
			icoMech122.items[1].system.destroyed = true; // 欧西里斯损毁 → 剩 2 NHP
			await L.rollNonAttackDamage(realLogCard, realLogInfo);
			ok(capturedDmgFlowArgs?.damage?.[0]?.val === "3" && capturedDmgFlowArgs?.ap === true, `rollNonAttackDamage 点击时实时重算 NHP 数量（损毁 1 个后 1+2=3 AP 能量，实际：${capturedDmgFlowArgs?.damage?.[0]?.val}）`);
			await L.setCombatState(icoMech122, { transcendActive: true });
			await L.rollNonAttackDamage(realLogCard, realLogInfo);
			ok(capturedDmgFlowArgs?.damage?.[0]?.val === "7", `激活「超然」后模因火花实时结算 1+2+4=7 AP 能量（实际：${capturedDmgFlowArgs?.damage?.[0]?.val}）`);

			// 机甲战术栏直出「⚡ 模因火花」快捷按钮
			const icoBarHtml = L.renderTalentControlHTML(icoMech122);
			ok(
				icoBarHtml.includes('data-lancer-cn-talent-act="memeticSpark"') && icoBarHtml.includes("7 AP 能量") && icoBarHtml.includes("2 NHP"),
				"机甲战术栏直接显示实时绑定 NHP 数量与超然状态的「⚡ 模因火花」快捷按钮"
			);

			// 5) 彗尾蛾（mf_ext_comet_moth）核心主动「天眼」：场景持续非瞬发、按感应距离与严格相对高度过滤、强化按科技动作校验受扰而敌方锁定为直接施加
			ok(
				L.CP_PROFILES.mf_ext_comet_moth?.label === "天眼" && !L.CP_PROFILES.mf_ext_comet_moth?.instant,
				"彗尾蛾核心主动「天眼」名称校准为「天眼」且为场景持续状态（非 instant）"
			);
			const makeStatusActor122 = (id, name, { statuses = [], sensorRange = 10, frameLid = null } = {}) => {
				const stSet = new Set(statuses);
				const a = {
					id, uuid: `Actor.${id}`, name, type: "mech", is_mech: () => true, isOwner: true,
					statuses: stSet,
					items: frameLid ? [{ type: "frame", system: { lid: frameLid } }] : [],
					system: { sensor_range: sensorRange, loadout: { frame: { value: frameLid ? { system: { lid: frameLid } } : null } } },
					flags: {},
					getFlag(ns, k) { return this.flags?.[ns]?.[k]; },
					async setFlag(ns, k, v) { (this.flags ||= {})[ns] ||= {}; this.flags[ns][k] = v; },
					async toggleStatusEffect(sid, { active }) {
						if (active) stSet.add(sid);
						else stSet.delete(sid);
					},
				};
				mockActors122.set(id, a);
				return a;
			};
			const cmSelf = makeStatusActor122("m_cm_self", "彗尾蛾", { sensorRange: 10, frameLid: "mf_ext_comet_moth" });
			const cmAllyLow = makeStatusActor122("m_cm_a1", "下方友军");
			const cmAllyJam = makeStatusActor122("m_cm_a2", "受扰友军", { statuses: ["jammed"] });
			const cmAllySameElev = makeStatusActor122("m_cm_a3", "同高友军");
			const cmAllyFar = makeStatusActor122("m_cm_a4", "超感应友军");
			const cmFoeLow = makeStatusActor122("m_cm_f1", "下方敌军");
			const cmFoeHigh = makeStatusActor122("m_cm_f2", "高空敌军");
			const cmNeutralLow = makeStatusActor122("m_cm_n1", "中立单位");
			const mkTok122 = (id, a, gx, elev, disp) => ({
				id, name: a.name, actor: a,
				x: gx * 100, y: 0, center: { x: gx * 100 + 50, y: 50 },
				document: { uuid: a.uuid, elevation: elev, disposition: disp, width: 1, height: 1 },
			});
			ctx.canvas = {
				grid: {
					size: 100, distance: 1, type: 1,
					measurePath: ([p, q]) => ({ spaces: Math.round(Math.hypot((q.x ?? 0) - (p.x ?? 0), (q.y ?? 0) - (p.y ?? 0)) / 100) }),
				},
				tokens: {
					placeables: [
						mkTok122("t_cm_s", cmSelf, 0, 3, 1),
						mkTok122("t_cm_a1", cmAllyLow, 3, 0, 1),
						mkTok122("t_cm_a2", cmAllyJam, 4, 1, 1),
						mkTok122("t_cm_a3", cmAllySameElev, 2, 3, 1),
						mkTok122("t_cm_a4", cmAllyFar, 15, 0, 1),
						mkTok122("t_cm_f1", cmFoeLow, 5, 2, -1),
						mkTok122("t_cm_f2", cmFoeHigh, 3, 4, -1),
						mkTok122("t_cm_n1", cmNeutralLow, 2, 0, 0),
					],
				},
			};
			await L.executeCoreAction(cmSelf, "cometMothAll");
			ok(
				cmAllyLow.statuses.has("bolster")
				&& !cmAllyJam.statuses.has("bolster")
				&& !cmAllySameElev.statuses.has("bolster")
				&& !cmAllyFar.statuses.has("bolster")
				&& cmFoeLow.statuses.has("lockon")
				&& !cmFoeHigh.statuses.has("lockon")
				&& !cmNeutralLow.statuses.has("lockon"),
				"天眼仅强化感应内且高度低于自身、未受扰的盟友，并仅锁定感应内且高度低于自身的敌对角色（排除同高/更高、超感应与中立单位）"
			);
			// 彗尾蛾自身受扰时：跳过强化（科技动作），但仍直接对下方敌军施加锁定
			cmAllyLow.statuses.clear();
			cmFoeLow.statuses.clear();
			cmSelf.statuses.add("jammed");
			await L.executeCoreAction(cmSelf, "cometMothAll");
			ok(
				!cmAllyLow.statuses.has("bolster") && cmFoeLow.statuses.has("lockon"),
				"彗尾蛾自身受扰时天眼跳过盟友「强化」（科技动作），但仍直接对感应内下方敌对角色施加「锁定」"
			);

			ctx.game.actors = prevActors122;
			ctx.canvas = prevCanvas122;
			ctx.game.user.targets = prevTargets122;
			ctx.game.users = prevUsers122;
			ctx.game.socket = prevSocket122;
			ctx.ChatMessage = prevChat122;
			ctx.Roll = prevRoll122;
			ctx.fromUuidSync = prevFromUuidSync122;
			ctx.game.lancer = prevLancer122;
			ctx.document = prevDoc122;
			ctx.foundry = prevFoundry122;
			ctx.requestAnimationFrame = prevRAF122;
		}
	}

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
