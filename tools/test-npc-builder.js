// NPC 构筑：核心 NPC 数据的结构、解析回归、数值计算，以及导出 Foundry NPC 角色 JSON 的合法性。
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert/strict");

const ROOT = path.join(__dirname, "..");
let checks = 0;
const ok = (cond, msg) => { checks++; assert.ok(cond, msg); };
// vm 里建立的对象原型不同，比较前先转成普通 JSON
const plain = v => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const eq = (a, b, msg) => { checks++; assert.deepEqual(plain(a), plain(b), msg); };

// 生成文件与源数据一致
const { build } = require("./build-npc-classes.js");
const { data } = build();
const genText = fs.readFileSync(path.join(ROOT, "assets/js/npc-classes.js"), "utf8");
ok(genText.includes(JSON.stringify(data)), "assets/js/npc-classes.js 过期：请运行 node tools/build-npc-classes.js");

// 解析器输出与 source/npc/core-npcs.json 一致（JSON 若人工修改过，要同步到解析器的补丁里）
const parsed = require("./parse-npc-core.js").build();
const strip = o => JSON.parse(JSON.stringify(o, (k, v) => (k.startsWith("_") && k !== "_说明" ? undefined : v)));
eq(strip(parsed.data), JSON.parse(fs.readFileSync(path.join(ROOT, "source/npc/core-npcs.json"), "utf8")), "source/npc/core-npcs.json 与解析结果不同：请运行 node tools/parse-npc-core.js --write 并核对");
eq(parsed.report, [], "解析报告有可疑项");
const parsedBooks = require("./parse-npc-books.js").build();
eq(strip(parsedBooks.data), JSON.parse(fs.readFileSync(path.join(ROOT, "source/npc/books-npcs.json"), "utf8")), "source/npc/books-npcs.json 与解析结果不同：请运行 node tools/parse-npc-books.js --write 并核对");
eq(parsedBooks.report, [], "其他书的解析报告有可疑项");

// ---------- 数据结构 ----------
const FOUNDRY_TAGS = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "source/fvtt/core/tags.json"), "utf8")).map(t => t.id));
const FEATURE_TYPES = ["Trait", "System", "Reaction", "Weapon", "Tech"];
const DAMAGE_TYPES = ["Kinetic", "Energy", "Explosive", "Heat", "Burn", "Variable"];
const RANGE_TYPES = ["Range", "Threat", "Thrown", "Line", "Cone", "Blast", "Burst"];
const STAT_KEYS = ["hp", "armor", "evasion", "edef", "speed", "size", "heatcap", "save", "sensor", "structure", "stress", "activations", "hull", "agi", "sys", "eng"];
const corePack = o => o.pack === "核心规则书";
eq(data.classes.filter(corePack).length, 33, "核心职业 30 + 特殊职业 3");
eq(data.templates.filter(corePack).length, 12, "核心模板 12");
eq(data.templates.filter(t => t.pack === "尘墓").length, 3, "尘墓模板 3");
eq(data.classes.length, 85, "全部职业：核心 33 + 其他书 52");
eq(data.templates.length, 25, "全部模板：核心 12 + 尘墓 3 + 其他书 10");
for (const o of [...data.classes, ...data.templates]) {
  ok(data.packs.some(p => p.name === o.pack), `${o.name} 的来源 ${o.pack} 在 packs 中`);
  if (o.pack !== "尘墓") ok(Number.isInteger(o.source) && fs.existsSync(path.join(ROOT, `assets/npc/${o.source}-${o.page}.jpg`)), `${o.name} 原书页图存在`);
}
const ids = new Set();
for (const c of data.classes) {
  for (const k of STAT_KEYS) {
    ok(Array.isArray(c.stats[k]) && c.stats[k].length === 3 && c.stats[k].every(Number.isFinite), `${c.name} ${k} 三个层级`);
  }
  ok(c.stats.size.every(s => s === 0.5 || (Number.isInteger(s) && s >= 1)), `${c.name} 大小`);
  ok(c.role.split("/").every(r => data.roles.includes(r)), `${c.name} 角色 ${c.role}`);
  if (corePack(c)) ok(c.flavor && (c.tactics || c.role === "生物"), `${c.name} 说明与战术（特殊职业原书没有战术段）`);
  ok(c.base.length + c.optional.length > 0, `${c.name} 有特性`);
}
for (const o of [...data.classes, ...data.templates]) {
  ok(!ids.has(o.id), "重复 id " + o.id); ids.add(o.id);
  for (const f of [...o.base, ...o.optional]) {
    ok(!ids.has(f.id), "重复 id " + f.id); ids.add(f.id);
    const where = `${o.name}/${f.name}`;
    ok(FEATURE_TYPES.includes(f.type), where + " 类型");
    ok(f.name && f.name.length <= 20, where + " 名称");
    for (const t of f.tags) ok(FOUNDRY_TAGS.has(t.id), `${where} 标签 ${t.id} 在 Foundry 中存在`);
    ok(f.effect || f.on_hit || f.type === "Weapon", where + " 有文字");
    // 类型行没识别出来时会留在效果开头
    ok(!/^(系统|特征|反应)[，,]/.test(f.effect || ""), where + " 效果不以类型行开头");
    // 版面残留：小说、通讯记录、分隔线
    ok(!/-{6}|“我不打算|收件人：|同步通讯|共同主观同步|OVERSHIELD|参数：/.test(f.effect || ""), where + " 没有非规则文字");
    if (f.type === "Weapon") {
      ok([f.attack_bonus, f.accuracy].every(a => a.length === 3 && a.every(Number.isInteger)), where + " 攻击加值 / 准度");
      for (const d of f.damage) ok(DAMAGE_TYPES.includes(d.type) && d.val.length === 3 && d.val.every(Number.isInteger), where + " 伤害");
      for (const r of f.range) ok(RANGE_TYPES.includes(r.type) && Number.isInteger(r.val), where + " 射程");
      ok(f.range.length, where + " 有射程或威胁");
    }
    if (f.type === "Reaction") ok(f.trigger, where + " 反应有触发");
    if (f.type === "Tech") ok(["Quick", "Full"].includes(f.tech_type), where + " 科技类型");
  }
}

// ---------- 解析回归（对照原书文字） ----------
const cls = name => data.classes.find(c => c.name === name);
const tpl = name => data.templates.find(t => t.name === name);
const feat = (o, name) => [...o.base, ...o.optional].find(f => f.name === name);
eq(cls("突击手").stats.hp, [15, 18, 21]);
eq(cls("暗杀者").stats.size, [0.5, 0.5, 1], "大小「1/2 或 1」取较小值");
eq(cls("暗杀者").size_note, ["1/2 或 1", "1/2 或 1", "1"]);
eq(cls("人类").stats.hull, [1, 2, 3], "人类「+1/层级」");
eq(cls("人类").stats.hp, [6, 6, 6]);
eq(cls("人类").optional.map(f => f.name), ["远程武器", "近战武器", "反装甲武器", "老兵", "披甲"]);
eq(feat(cls("突击手"), "重型突击步枪").tags, [{ id: "tg_reliable", val: [2, 3, 4] }]);
eq(feat(cls("宙斯盾"), "轻型雷射炮").damage, [{ type: "Energy", val: [3, 3, 3] }, { type: "Burn", val: [2, 4, 6] }]);
eq(feat(cls("投弹者"), "射石加农炮").accuracy, [-1, -1, -1], "+1 难度");
eq(feat(cls("路障"), "重子长矛").attack_bonus, [1, 2, 3], "+1/层级");
ok(feat(cls("路障"), "重子长矛").on_hit.startsWith("目标缓慢"), "命中效果");
eq(feat(cls("狂战士"), "链斧").range, [{ type: "Threat", val: 1 }], "方括号与加值同一行");
ok(feat(cls("狂战士"), "链斧").effect.startsWith("会心一击："));
eq(feat(cls("破门手"), "双管霰弹枪").range.map(r => r.type), ["Range", "Threat"], "缺左括号「射程 3]威胁 3]」");
eq(feat(cls("狙击手"), "反器材步枪").accuracy, [2, 2, 2], "武器行跨两行");
eq(feat(cls("纵火狂"), "火焰喷射器").tags, [{ id: "tg_heat_self", val: 4 }]);
eq(feat(cls("班组"), "主要武器").damage[0].type, "Variable", "制作时选择伤害类型");
eq(feat(cls("怪形"), "爪击").type, "Weapon", "没有尺寸的武器");
ok(feat(cls("怪形"), "独特生理机能").effect.includes("怪形结构伤害表"), "结构伤害表并入特性");
eq(feat(cls("王牌"), "桶滚").type, "Reaction");
eq(feat(cls("王牌"), "桶滚").trigger, "近战或远程攻击命中王牌。");
ok(feat(cls("弓箭手"), "压制").effect.includes("【活靶子】（反应）触发：弓箭手的压制目标开始移动。"), "获得的反应并入原特性");
ok(!feat(cls("弓箭手"), "活靶子"), "获得的反应不单列");
ok(feat(cls("蜃楼"), "漏洞扫描器").effect.includes("【信标光点】"));
eq(feat(cls("哨兵"), "保镖").tags.map(t => t.id), ["tg_protocol"], "「协议」");
eq(feat(cls("女巫"), "扩散苦难").tags.map(t => t.id), ["tg_round", "tg_free_action"], "「自由」");
eq(feat(cls("粉碎者"), "冲击装甲").type, "Trait", "没有类型行的特征");
eq(feat(cls("司铎"), "分形攻势").type, "Reaction");
eq(feat(cls("马蜂"), "钉刺系统").attack_bonus, [2, 4, 6]);
// 已对照英文核心规则书第 296、303 页确认：两件武器都是攻击加值 +0、准度 +1/+2/+3
for (const [c, w] of [["甲胄骑兵", "撞锤加农炮"], ["马蜂", "巫术导弹"]]) {
  eq(feat(cls(c), w).accuracy, [1, 2, 3], `${w} 是准度 +1/+2/+3（英文原书确认）`);
  eq(feat(cls(c), w).attack_bonus, [0, 0, 0], `${w} 攻击加值 +0（英文原书确认）`);
}
eq(tpl("超体").base.length, 10);
eq(tpl("老兵").optional.length, 19);
eq(feat(tpl("超体"), "强化").bonus, { structure: 3, stress: 3 });
eq(feat(tpl("低等兵"), "无用之人").override, { hp: 1 });
eq(feat(tpl("指挥官"), "权威之声").type, "Reaction");
eq(tpl("恐怖体").pack, "尘墓");
// 其他书（各书的版面问题，见 parse-npc-books.js 的 BOOKS）
const bcls = (pack, name) => data.classes.find(c => c.pack === pack && c.name === name);
const btpl = (pack, name) => data.templates.find(t => t.pack === pack && t.name === name);
eq(bcls("苏丹", "搬运工").stats.hp, [14, 17, 20]);
eq(bcls("苏丹", "动员兵").stats.size, [0.5, 0.5, 0.5]);
eq(feat(bcls("苏丹", "动员兵"), "反装甲高爆炸弹").type, "Weapon", "前一句没有句号的武器标题");
eq(feat(bcls("苏丹", "动员兵"), "即抛式 PDW").attack_bonus, [1, 1, 1], "单一加值 +1");
ok(!feat(bcls("苏丹", "食人魔"), "灾厄投掷").effect.includes("卫冕冠军"), "续页小说已切掉");
eq(feat(btpl("苏丹", "铲土机"), "重装机体").bonus, { hp: 5 });
eq(feat(btpl("苏丹", "捍卫者"), "强化").bonus, { structure: 1, stress: 1 });
eq(feat(bcls("强化战斗", "列车"), "死亡引擎").bonus, { structure: 3, stress: 3, activations: 1 });
eq(bcls("强化战斗", "比蒙巨兽").special, "军情报告特殊");
ok(bcls("强化战斗", "比蒙巨兽").optional.slice(0, 7).every(f => f.name.startsWith("辅助节点：")), "辅助节点类型改为可选");
eq(bcls("冬痕行动", "主战坦克").special, "载具");
ok(bcls("冬痕行动", "主战坦克").optional.some(f => f.name === "主炮：滑膛炮"), "主炮改为可选");
eq(feat(bcls("冬痕行动", "主战坦克"), "全向炸药").attack_bonus, [1, 2, 3]);
eq(feat(bcls("塞壬之歌", "暴风雨"), "灰浴控制").effect.slice(0, 9), "暴风雨可激活另一种", "排在名称前的效果已移回");
ok(feat(bcls("塞壬之歌", "暴风雨"), "气象灰浴").effect.includes("【类别 II】"), "类别并入气象灰浴");
ok(feat(bcls("壁花不容", "潜伏者"), "本影护罩").effect.startsWith("任何战斗开始时"));
eq(feat(bcls("卡斯特与帕勒克", "架构师"), "泥浆加农炮").type, "Weapon", "无伤害武器");
eq(feat(bcls("冷核圆形竞技场", "蚊"), "泡罩").keywords, ["鲜血 2+"], "Foundry 没有的关键词");
ok(feat(bcls("冷核圆形竞技场", "武库"), "特殊规则").effect.includes("装置"), "特殊规则成为特征");
ok(!bcls("冷核圆形竞技场", "地球化").optional.some(f => f.name === "电子通道獠牙"), "重复印刷的武器已删");
eq(feat(bcls("天堂末班车", "警卫"), "[警卫-激活]").type, "System", "方括号名称");
eq(feat(bcls("午夜伊菲革涅亚", "霜灵"), "“烟囱桩”标枪").tags.map(t => t.id), ["tg_quick_action", "tg_heat_self"], "「热度 2（自身）」");
eq(feat(bcls("浴金焰", "投石手"), "理当如此").type, "Reaction");
eq(btpl("军团", "傀儡师").optional[0].name, "怪物之母");
ok(!/投 弹 者/.test(JSON.stringify(cls("投弹者"))), "两端对齐留下的空格已去掉");
ok(!/[A-Za-z]{4,}/.test(tpl("恐怖体").base.concat(tpl("恐怖体").optional).map(f => f.name + f.effect).join("")), "尘墓模板已译");

// ---------- 计算与导出 ----------
const ctx = { window: { LANCER_NPC_CLASSES: data, LANCER_DATA: { tags: [] } }, console };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/npc-builder.js"), "utf8"), ctx);
const B = ctx.window.NPCBuilder;
ok(B && typeof B.toFoundry === "function", "NPCBuilder 接口");
const npc = (classId, tier, templates = [], picks = [], adjust = {}) => ({ ...B.newNpc(classId), tier, templates, picks, adjust });
let s = B.npcStats(npc("npcc_cn_assault", 2, ["npct_cn_elite"]));
eq([s.hp, s.structure, s.stress, s.activations, s.save], [18, 2, 2, 2, 12], "突击手 T2 精英");
s = B.npcStats(npc("npcc_cn_assault", 3, ["npct_cn_ultra"], [feat(tpl("超体"), "规避").id]));
eq([s.hp, s.structure, s.evasion, s.activations], [26, 3, 16, 2], "超体：韧性 +5 HP、强化 +3、规避 +4 回避 -1 结构");
s = B.npcStats(npc("npcc_cn_assault", 1, ["npct_cn_grunt"]));
eq(s.hp, 1, "低等兵只有 1 HP");
s = B.npcStats(npc("npcc_cn_human", 3, [], ["npcf_cn_human_4"]));
eq(s.hp, 12, "人类老兵 T3 +6 HP");
s = B.npcStats(npc("npcc_cn_assault", 1, [], [], { hp: 3, evasion: -1 }));
eq([s.hp, s.evasion], [18, 7], "手动调整");
eq(B.npcChecks(npc("npcc_cn_assault", 1, ["npct_cn_elite", "npct_cn_ultra"])).msgs.length, 1, "精英与超体互斥");
eq(B.npcChecks(npc("npcc_cn_squad", 1, ["npct_cn_veteran"])).msgs.length, 1, "班组不能用老兵");
eq(B.npcChecks(npc("npcc_cn_human", 1, ["npct_cn_rpv"])).msgs.length, 1, "人类不能用模板");
eq(B.npcChecks(npc("npcc_cn_assault", 1, [], data.classes.find(c => c.id === "npcc_cn_assault").optional.map(f => f.id))).msgs.length, 1, "可选系统超过建议数");
const extra = B.npcFeatures(npc("npcc_cn_assault", 1, [], ["npcf_cn_specter_7"]));
eq(extra[extra.length - 1].how, "extra", "从其他职业添加");
ok(B.tierHtml("造成 6/8/10 伤害", 2).includes(">8</span>"), "按层级显示");
ok(B.npcText(npc("npcc_cn_sniper", 3, ["npct_cn_veteran"])).includes("20 动能"), "文字版按层级");

const NPC_KEYS = ["activations", "armor", "hp", "evasion", "edef", "heatcap", "speed", "sensor_range", "save", "hull", "agi", "sys", "eng", "size", "structure", "stress"];
function checkFoundry(a, label) {
  ok(a.type === "npc" && [1, 2, 3].includes(a.system.tier), label + " 角色类型与层级");
  for (const k of ["hp", "heat", "structure", "stress"]) ok(Number.isInteger(a.system[k].value) && Number.isInteger(a.system[k].max), `${label} ${k}`);
  const itemIds = new Set();
  for (const it of a.items) {
    ok(/^[A-Za-z0-9]{16}$/.test(it._id) && !itemIds.has(it._id), label + " 物品 _id"); itemIds.add(it._id);
    ok(["npc_class", "npc_template", "npc_feature"].includes(it.type), label + " 物品类型");
    const sy = it.system;
    if (it.type === "npc_class") {
      ok(sy.base_stats.length === 3, label + " base_stats");
      for (const b of sy.base_stats) for (const k of NPC_KEYS) ok(k === "size" ? b.size >= 0.5 : Number.isInteger(b[k]), `${label} 职业数值 ${k}`);
    }
    if (it.type !== "npc_feature") continue;
    const w = `${label}/${it.name}`;
    ok(FEATURE_TYPES.includes(sy.type), w + " 类型");
    ok(["Quick", "Full"].includes(sy.tech_type), w + " tech_type");
    ok(["Class", "Template"].includes(sy.origin.type), w + " origin");
    ok(sy.accuracy.length === 3 && sy.attack_bonus.length === 3 && [...sy.accuracy, ...sy.attack_bonus].every(Number.isInteger), w + " 加值");
    ok(Number.isInteger(sy.uses) && sy.uses >= 0, w + " uses");
    for (const t of sy.tags) ok(FOUNDRY_TAGS.has(t.lid) && typeof t.val === "string" && /^(|\d+|\{\d+\/\d+\/\d+\})$/.test(t.val), `${w} 标签 ${t.lid}=${t.val}`);
    for (const blk of [sy.bonus, sy.override]) if (blk) for (const k of NPC_KEYS) ok(blk[k] === null || (k === "size" ? blk[k] >= 0.5 : Number.isInteger(blk[k])), `${w} 加成 ${k}`);
    if (sy.type === "Weapon") {
      ok(sy.damage.length === 3, w + " 三个层级的伤害");
      for (const tierDmg of sy.damage) for (const d of tierDmg) ok(DAMAGE_TYPES.includes(d.type) && /^\d+$/.test(d.val), w + " 伤害");
      for (const r of sy.range) ok(RANGE_TYPES.includes(r.type) && Number.isInteger(r.val) && r.val >= 0, w + " 射程");
    }
  }
  ok(JSON.parse(JSON.stringify(a)), label + " 可序列化");
}
let exported = 0;
for (const c of data.classes) for (const tier of [1, 2, 3]) {
  const all = c.optional.map(f => f.id);
  checkFoundry(B.toFoundry(npc(c.id, tier, [], all, { hp: 2 })), `${c.name} T${tier}`);
  exported++;
}
for (const t of data.templates) {
  const a = B.toFoundry(npc("npcc_cn_assault", 3, [t.id], t.optional.map(f => f.id)));
  checkFoundry(a, "突击手+" + t.name);
  ok(a.items.some(i => i.type === "npc_template" && i.system.lid === t.id), t.name + " 模板物品");
  exported++;
}
const sample = B.toFoundry(npc("npcc_cn_assault", 2, ["npct_cn_elite"], ["npcf_cn_assault_4"]));
eq(sample.items.filter(i => i.type === "npc_feature").length, 3 + 4 + 1, "突击手精英的特性数");
eq(sample.system.hp, { value: 18, max: 18 });
const rifle = sample.items.find(i => i.name === "重型突击步枪").system;
eq(rifle.damage.map(d => d[0].val), ["6", "8", "10"]);
eq(rifle.tags, [{ lid: "tg_reliable", val: "{2/3/4}" }], "按层级的标签值");
eq(sample.items.find(i => i.name === "强化").system.bonus.structure, 1, "模板加成导出为 bonus");
const adj = B.toFoundry(npc("npcc_cn_assault", 1, [], [], { armor: 1 })).items.find(i => i.system.lid === "npcf_cn_builder_adjust");
ok(adj && adj.system.bonus.armor === 1, "手动调整导出为特性加成");

console.log(`PASS NPC 构筑：${data.classes.length} 个职业、${data.templates.length} 个模板、导出 ${exported} 种组合，${checks} 项检查`);
