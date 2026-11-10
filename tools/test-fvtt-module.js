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

	// ---- 掩护区（区域行为）：模拟 Foundry 的 RegionBehaviorType 与区域事件
	ok(manifest.documentTypes?.RegionBehavior?.cover && typeof manifest.documentTypes.RegionBehavior.cover === "object", "清单应声明区域行为子类型 cover（lancer-cn.cover）");
	{
		class FakeField { constructor(o) { Object.assign(this, o); } }
		Object.assign(ctx, {
			CONST: { REGION_EVENTS: { TOKEN_ENTER: "tokenEnter", TOKEN_EXIT: "tokenExit", BEHAVIOR_ACTIVATED: "behaviorActivated", BEHAVIOR_DEACTIVATED: "behaviorDeactivated" } },
			foundry: { ...ctx.foundry, data: { fields: { StringField: FakeField }, regionBehaviors: { RegionBehaviorType: class {} } } },
		});
		ctx.CONFIG.RegionBehavior = { dataModels: {}, typeIcons: {}, typeLabels: {} };
		hooks["once:init"]();
		const Behavior = ctx.CONFIG.RegionBehavior.dataModels["lancer-cn.cover"];
		ok(typeof Behavior === "function", "init 时应注册区域行为 lancer-cn.cover");
		ok(ctx.CONFIG.RegionBehavior.typeIcons["lancer-cn.cover"], "区域行为应有图标");
		// 显示名：Foundry 按语言键 TYPES.RegionBehavior.lancer-cn.cover 逐层查找；当前语言与英文后备都要有
		const setProperty = (o, key, v) => { const ks = key.split("."); let x = o; for (const k of ks.slice(0, -1)) x = x[k] ??= {}; x[ks.at(-1)] = v; };
		ctx.game.i18n = { lang: "en", translations: {}, _fallback: {} };
		ctx.foundry.utils = { ...ctx.foundry.utils, setProperty };
		hooks["once:i18nInit"]();
		const label = t => t?.TYPES?.RegionBehavior?.["lancer-cn"]?.cover;
		ok(label(ctx.game.i18n.translations) === "LANCER 掩护区" && label(ctx.game.i18n._fallback) === "LANCER 掩护区", "区域行为类型的中文名应写入语言键 TYPES.RegionBehavior.lancer-cn.cover");
		const schema = Behavior.defineSchema();
		ok(schema.cover && Object.keys(schema.cover.choices).join() === "soft,hard" && schema.cover.initial === "soft", "掩护区可选软性 / 硬性，默认软性");
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
		const regionControls = { walls: { tools: {} }, regions: { tools: { select: {} } } };
		hooks.getSceneControlButtons(regionControls);
		ok(/软性掩护格/.test(regionControls.regions.tools.lancerCoverSoft?.title) && /硬性掩护格/.test(regionControls.regions.tools.lancerCoverHard?.title), "GM 的「区域」工具栏应有软性 / 硬性掩护格工具");
		ok(regionControls.walls.tools.lancerHexWall && !regionControls.walls.tools.lancerCoverSoft, "墙体工具在墙壁栏，掩护格工具在区域栏");
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
