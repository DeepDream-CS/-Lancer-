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
		// 涂画工具与导入的场景无缝衔接：点 (3,1) 中心能识别困难地形格
		const pt31 = sc.grid.getCenterPoint({ i: 3, j: 1 });
		ok(L.terrainCellHas(sc, sc.grid, pt31, "difficult") && !L.terrainCellHas(sc, sc.grid, pt31, "dangerous"), "导入后的区域可直接用涂画工具继续编辑");
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
		// 再铺到奇数列下移（HEXODDQ=4）的场景且不切换网格：origin.i 应自动偏移 +1 以保持相邻列上下错位一致
		const fixedHexScene = mkSceneObj({ name: "固定 HEXODDQ 底图", grid: { type: 4, size: 100 }, flags: {} });
		await L.importBattleMap(oddMap, { mode: "current", scene: fixedHexScene, setHexGrid: false });
		// oddMap 中障碍物在 q=1,r=1，minQ=-3 → q-minQ=4；因 HEXODDQ 在 i=0 时不移、而 minQ=-3 在车卡器中下移，origin.i 应偏移为 1，故障碍物落在 i=5,j=1
		ok(fixedHexScene.walls.length === 6 && fixedHexScene.walls[0].getFlag("lancer-cn", "hexWall") === "5,1", "在 HEXODDQ 场景铺奇数列地图时自动偏移 1 列对齐六角格上下错位：" + fixedHexScene.walls[0]?.getFlag("lancer-cn", "hexWall"));
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
		ok(keysOf("mech") === "fragment,lockon,bolster,grapple,breakGrapple,ram,improvised,hide,search,brace,standUp,disengage,prepare,shutDown,bootUp,selfDestruct,eject,mountDismount", "机甲的基础动作完整覆盖核心规则书动作表");
		ok(keysOf("npc") === "breakGrapple,standUp,disengage,prepare,npcInvade,npcLockon,npcGrapple,npcRam,npcHide,npcSearch,npcImprovised,npcStabilize", "NPC 的基础动作覆盖专属动作与通用挣脱/起身/脱离/准备");
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
		ok(b.name === "TechAttackFlow" && b.data.title === "入侵 // 破碎讯号" && b.data.invade === true && /破碎讯号/.test(b.data.effect) && b.data.extra === 1, "破碎讯号以科技攻击发起，begin 时带标题、入侵与说明");
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
		ok(manifest.version === "1.13.0", "清单版本应为 1.13.0");
		for (const k of ["autoApplyStatus", "crossPermDamage", "autoDangerZone", "turnEndPrompt"]) {
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

		const mkFlagMsg = (id, initFlags, { isAuthor = true, content = "" } = {}) => {
			const store = JSON.parse(JSON.stringify(initFlags));
			const m = {
				id, isAuthor, content, flags: store,
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
							st.data.acc_diff = st.data.acc_diff || { base: { accuracy: 0, difficulty: 0 }, weapon: { engaged: Boolean(st.engaged), inaccurate: Boolean(st.inaccurate), arcing: false }, targets: st.targets ?? [] };
							return true;
						}],
						["initTechAttackData", async st => {
							st.data = st.data || {};
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
						["setDamageTags", async st => { st.data = st.data || {}; st.data.tags = st.data.tags || []; st.data.bonus_damage = st.data.bonus_damage || []; return true; }],
						["showDamageHUD", async st => {
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
							this.total = q ?? 4;
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

					// C8. 羁绊 I + 家族禁卫 I（2 格内友方机甲同样拥有羁绊时属性检定 +2 准度）+ 盖革斯骨架机体 +1 准度
					attachPilot(friendlyMech, { talents: [["t_bonded", 1]] });
					const friendlyTok = { x: 200, y: 0, actor: friendlyMech, document: { uuid: "Scene.s.Token.fm", disposition: 1 } };
					ctx.canvas.tokens.placeables = [aceTok, friendlyTok];
					const hullStatState = { actor: aceMech, data: { path: "system.hull" } };
					await v13Steps.get("initStatRollData")(hullStatState);
					// 盖革斯骨架 +1 + 双方羁绊（距离 2，家族禁卫扩展邻接至 2 格）+2 = +3 准度
					ok(hullStatState.data.acc_diff.base.accuracy === 3, "家族禁卫扩展邻接至 2 格，双方羁绊 I（+2）与盖革斯骨架（+1）叠加使机体豁免/检定预填 +3 准度");

					// C9. 巨人杀手骑乘强化（R1 软掩护与推动提醒 + R2 瓦解 + R3 终斩）+ 机甲表「天赋与核心战术栏」渲染与操作
					acePilot.system.active_mech.value = null; // 模拟步战下马骑乘
					proneEnemy.statuses.clear();
					proneEnemy.system.hp.value = 3;
					const gsJockeyMsg = await L.createJockeyControlCard({
						pilotUuid: acePilot.uuid, pilotName: acePilot.name,
						mechUuid: "Scene.s.Token.pe", mechName: "伏卧靶",
					});
					await L.executeJockeyEffect(gsJockeyMsg, "distract");
					ok(acePilot.statuses.has("cover_soft") && proneEnemy.statuses.has("impaired") && proneEnemy.statuses.has("slow") && /巨人杀手 · 激怒/.test(chatCreated.at(-1)?.content ?? ""), "巨人杀手 R1：骑乘生效自动赋予驾驶员软掩护，干扰施加受损+缓慢并提示推动 2 格");
					await L.executeJockeyEffect(gsJockeyMsg, "damage");
					ok(proneEnemy.system.hp.value === 0, "巨人杀手 R3「终斩」：骑乘破坏将剩余 HP ≤ 3 的目标直接斩杀至 0 HP");
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
					ok(cbPrev.overshieldUsed === 4 && cbPrev.hpLoss === 0 && cbPrev.notes.some(n => /低速屏蔽罩/.test(n)) && cbPrev.notes.some(n => /百臂巨人/.test(n)), "低速循环屏蔽罩防穿甲 + 百臂巨人 1 结构抗性在伤害预览中协同准确结算");

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
				}
			}
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
