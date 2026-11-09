// 把核心规则书 v3.5 NPC 章节（PDF 第 278–325 页）的提取文字解析为结构化职业 / 模板 / 特性。
// 文字来源：assets/js/npc-data.js（NPC 库的原书文字索引）。原文照录，只做分段与数值提取。
//   node tools/parse-npc-core.js           检查解析结果，列出可疑条目
//   node tools/parse-npc-core.js --write   写入 source/npc/core-npcs.json（之后人工核对的修正写在本文件的 PATCHES）
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const SOURCE = 1; // 《枪骑兵》核心规则书v3.5

function loadText() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/npc-data.js"), "utf8"), ctx);
  const D = ctx.window.LANCER_NPCS;
  const pages = {};
  for (const e of D.entries) if (e.source === SOURCE) pages[e.page] = e.text;
  return pages;
}

// ---- 词表 ----
const ROLE = { 突擊: "突击", 炮擊: "炮击", 操縱: "操纵", 衛兵: "卫兵", 支援: "支援", 生物: "生物" };
const ROLE_EN = { 突击: "striker", 炮击: "artillery", 操纵: "controller", 卫兵: "defender", 支援: "support", 生物: "biological" };
const CLASS_ID = {
  王牌: "ace", 宙斯盾: "aegis", 弓箭手: "archer", 暗杀者: "assassin", 突击手: "assault", 路障: "barricade",
  棱堡: "bastion", 狂战士: "berserker", 投弹者: "bombard", 破门手: "breacher", 甲胄骑兵: "cataphract",
  粉碎者: "demolisher", 工程师: "engineer", 歌利亚: "goliath", 蜂巢: "hive", 马蜂: "hornet", 蜃楼: "mirage",
  操作员: "operator", 司铎: "priest", 纵火狂: "pyro", 祈雨师: "rainmaker", 浪人: "ronin", 清扫器: "scourer",
  斥候: "scout", 播种机: "seeder", 哨兵: "sentinel", 狙击手: "sniper", 幽鬼: "specter", 支援者: "support",
  女巫: "witch", 人类: "human", 班组: "squad", 怪形: "monstrosity",
};
const TEMPLATES = [
  ["指挥官", "commander"], ["RPV", "rpv"], ["精英", "elite"], ["异种", "exotic"], ["低等兵", "grunt"],
  ["雇佣兵", "mercenary"], ["海盗", "pirate"], ["飞船", "ship"], ["太空民", "spacer"], ["超体", "ultra"],
  ["老兵", "veteran"], ["载具", "vehicle"],
];
// 模板可选表的标题（取最后一次单独成行的位置）
const TEMPLATE_OPTIONAL = {
  指挥官: "指挥官特征", 异种: "异种系统和特征", 雇佣兵: "雇佣兵系统和特征", 海盗: "海盗系统和特征",
  太空民: "太空民系统", 超体: "超体系统和特征", 老兵: "老兵特征", 载具: "载具特征",
};
const DAMAGE = { 动能: "Kinetic", 能量: "Energy", 爆炸: "Explosive", 燃烧: "Burn", 热度: "Heat" };
const RANGE = { 射程: "Range", 威胁: "Threat", 投掷: "Thrown", 线形: "Line", 锥形: "Cone", 溅射: "Blast", 爆发: "Burst" };
const WEAPON_SIZE = [["超重型武器", "超重型"], ["超重型", "超重型"], ["重武器", "重型"], ["主武器", "主武器"], ["副武器", "副武器"]];
// 类型行的词 → 标签 id（数值标签带 VAL）
const TOKEN_TAGS = [
  [/^快速动作$/, "tg_quick_action"], [/^完整动作$/, "tg_full_action"], [/^自由动作$/, "tg_free_action"],
  [/^快速科技$/, "tg_quick_tech"], [/^完整科技$/, "tg_full_tech"], [/^协[定议]$/, "tg_protocol"], [/^自由$/, "tg_free_action"], [/^反应$/, "tg_reaction"],
  [/^(?:再)?充能 ?(\d)\+$/, "tg_recharge"], [/^受限 ?(\d+)$/, "tg_limited"], [/^(\d)\/轮$/, "tg_round"],
  [/^(\d)\/回合$/, "tg_turn"], [/^无人机$/, "tg_drone"], [/^(?:盾牌|护盾)$/, "tg_shield"], [/^可展开$/, "tg_deployable"],
  [/^模块$/, "tg_mod"], [/^榴弹$/, "tg_grenade"], [/^地雷$/, "tg_mine"], [/^重火器$/, "tg_ordnance"], [/^无限$/, "tg_unlimited"],
  [/^(?=\D*(\d+))(?:\d+ ?热度|热度 ?\d+)（自身）$/, "tg_heat_self"], [/^装填$/, "tg_loading"],
  // Foundry 没有对应标签的词：保留为关键词，显示在特性上
  [/^(?:1\/场景|鲜血 ?\d\+|召集|每轮不限次|\?\?\?热度（自身）|AI|（1\/2\/3）\/轮|装置 ?\d+|能源 ?\d+)$/, null],
];
const WEAPON_TAGS = [
  [/^可靠 ?([\d/]+)$/, "tg_reliable"], [/^(?:引导|导引)$/, "tg_seeking"], [/^智慧$/, "tg_smart"], [/^智能$/, "tg_smart"],
  [/^装填$/, "tg_loading"], [/^抛射$/, "tg_arcing"], [/^击退 ?(\d+)$/, "tg_knockback"], [/^AP$/, "tg_ap"],
  [/^重火器$/, "tg_ordnance"], [/^投掷 ?(\d+)$/, "tg_thrown"], [/^精准$/, "tg_accurate"], [/^不准$/, "tg_inaccurate"],
  [/^(\d+) ?热度（自身）$/, "tg_heat_self"], [/^受限 ?(\d+)$/, "tg_limited"], [/^(?:再)?充能 ?(\d)\+$/, "tg_recharge"],
];
const BULLET = /^\uF06C/; // PDF 列表项符号
const KIND_WORDS = ["系统", "特征", "模板特性", "反应"];

const tierArr = s => {
  const p = String(s).replace(/\+/g, "").split("/").map(Number);
  return p.length === 3 ? p : [p[0], p[0], p[0]];
};

// 类型行：全部由已知词组成（逗号分隔）
function typeTokens(line) {
  const parts = line.replace(/,/g, "，").split("，").map(s => s.trim()).filter(Boolean);
  if (!parts.length) return null;
  for (const p of parts) {
    if (KIND_WORDS.includes(p)) continue;
    if (TOKEN_TAGS.some(([re]) => re.test(p))) continue;
    if (/^\+\d+\/(?:\+?\d+\/\+?\d+|层级)(?: 准度)?$/.test(p) || /^\+\d (?:准度|难度)$/.test(p) || /^\+\d+$/.test(p)) continue;
    return null;
  }
  return parts;
}
// 名称与类型写在同一行：「压制 特征，快速动作」「微型导弹弹幕 再充能 6+，快速动作，特征」
function inlineHeader(line) {
  const m = /^(.+?) ((?:特征|模板特性|系统|反应|再充能|受限|快速|完整|自由|\d\/轮).*)$/.exec(line);
  if (!m || /[。：]/.test(m[1]) || m[1].length > 14) return null;
  const t = typeTokens(m[2]);
  return t ? { name: m[1], tokens: t } : null;
}
// 「[冷冽如刃]」「[警卫-激活]」这类方括号名称也算（武器的方括号行都含数字或「伤害」）
const looksName = l => l && l.length <= 14 && !/[。：:，,；]/.test(l) && (!/^[\d+\[（(•]/.test(l) || /^\[[^\]\d]+\]$/.test(l) && !/伤害/.test(l)) && !/^(触发|效果|命中|会心一击)/.test(l);
const ends = l => /[。）)」”]$/.test(l || "");

function parseWeaponHead(lines, i) {
  // 名称之后的 1–2 行：类型与加值、[射程][伤害]
  let head = "";
  let j = i;
  const DMG = /\d[\d/]*\s*(?:伤害|动能|能量|爆炸|燃烧|热度)|无伤害/;
  while (j < lines.length && j < i + 3) {
    // 武器行不会以句号结尾，也不会是触发 / 效果
    if (/[。]$/.test(lines[j]) || /^(触发|效果|命中)：/.test(lines[j])) break;
    head += (head && !/^[，,]/.test(lines[j]) ? "，" : "") + lines[j];
    j++;
    if (/\]/.test(lines[j - 1]) && DMG.test(head)) break;
    if (/\]$/.test(lines[j - 1]) && !/^[\[，,]/.test(lines[j] || "")) break;
  }
  // 没有伤害的武器（「重武器 CQB，击退 5，+1/+2/+3[锥形 5]」）：以武器尺寸开头且有射程方括号
  const noDamage = WEAPON_SIZE.some(([sw]) => head.startsWith(sw)) && /\[(射程|威胁|锥形|线形|溅射|爆发)/.test(head);
  if ((!DMG.test(head) && !noDamage) || !/\[|\]/.test(head)) return null;
  const firstBracket = head.search(/\[/);
  const pre = head.slice(0, firstBracket >= 0 ? firstBracket : head.length).replace(/[，,\s]+$/, "");
  const brackets = head.slice(firstBracket);
  const w = { tags: [], attack_bonus: [0, 0, 0], accuracy: [0, 0, 0], range: [], damage: [] };
  let parts = pre.replace(/[,。]/g, "，").split("，").map(s => s.trim()).filter(Boolean);
  // 「主炮 / 滑膛炮 / 重武器大炮，…」：名称后还有一行子名称，真正的武器名是子名称
  const isSize = x => WEAPON_SIZE.some(([sw]) => x.startsWith(sw));
  if (parts.length > 1 && !isSize(parts[0]) && !/^\+/.test(parts[0]) && isSize(parts[1])) w.subname = parts.shift();
  // 第一段：尺寸 + 类型，或直接是加值（怪形、人类）
  if (parts.length && !/^\+/.test(parts[0])) {
    let first = parts.shift();
    // 「重型大炮 +1/2/3」：类型与加值之间只有空格
    const sp = / (\+\d.*)$/.exec(first);
    if (sp) { parts.unshift(sp[1]); first = first.slice(0, sp.index); }
    const sz = WEAPON_SIZE.find(([w]) => first.startsWith(w));
    w.weapon_size = sz ? sz[1] : "";
    w.weapon_kind = (sz ? first.slice(sz[0].length) : first).trim();
  } else { w.weapon_size = ""; w.weapon_kind = ""; }
  for (let p of parts) {
    // 「+1/+2/+3 [射程…」：人类武器把加值和方括号写在一起
    p = p.trim();
    let m;
    if ((m = /^\+(\d+)\/层级$/.exec(p))) { const n = +m[1]; w.attack_bonus = [n, 2 * n, 3 * n]; continue; }
    if ((m = /^\+(\d+)$/.exec(p))) { w.attack_bonus = [+m[1], +m[1], +m[1]]; continue; }
    if ((m = /^(\+\d+\/\+?\d+\/\+?\d+)( 准度)?$/.exec(p))) { if (m[2]) w.accuracy = tierArr(m[1]); else w.attack_bonus = tierArr(m[1]); continue; }
    if ((m = /^\+(\d) 准度$/.exec(p))) { w.accuracy = w.accuracy.map(a => a + +m[1]); continue; }
    if ((m = /^\+(\d) 难度$/.exec(p))) { w.accuracy = w.accuracy.map(a => a - +m[1]); continue; }
    const t = WEAPON_TAGS.find(([re]) => re.test(p));
    if (t) { const v = t[0].exec(p)[1]; w.tags.push(v ? { id: t[1], val: /\//.test(v) ? tierArr(v) : +v } : { id: t[1] }); continue; }
    (w.unknown ||= []).push(p);
  }
  for (const m of brackets.matchAll(/(射程|威胁|投掷|线形|锥形|溅射|爆发)\s*(\d+)/g)) w.range.push({ type: RANGE[m[1]], val: +m[2] });
  const dm = brackets.replace(/\[(射程|威胁|投掷|线形|锥形|溅射|爆发)\s*\d+\]?/g, "");
  for (const m of dm.matchAll(/([\d/]+)\s*(动能|能量|爆炸|燃烧|热度)?(?:伤害)?((?:，|或)[^\]+]*)?/g)) {
    if (!m[1].replace(/\//g, "")) continue;
    const variable = m[3] && /或/.test(m[3]);
    if (!m[2] && !variable) continue;
    w.damage.push({ type: variable ? "Variable" : DAMAGE[m[2]], val: tierArr(m[1]), ...(variable ? { note: (m[2] || "") + m[3] } : {}) });
  }
  w.raw = head;
  return { w, next: j };
}

function tokensToFeature(tokens) {
  const f = { tags: [] };
  for (const p of tokens) {
    if (KIND_WORDS.includes(p)) continue;
    let m;
    if ((m = /^\+(\d+)\/层级$/.exec(p))) { const n = +m[1]; f.attack_bonus = [n, 2 * n, 3 * n]; continue; }
    if ((m = /^(\+\d+\/\+?\d+\/\+?\d+)( 准度)?$/.exec(p))) { if (m[2]) f.accuracy = tierArr(m[1]); else f.attack_bonus = tierArr(m[1]); continue; }
    if ((m = /^\+(\d) 准度$/.exec(p))) { f.accuracy = (f.accuracy || [0, 0, 0]).map(a => a + +m[1]); continue; }
    if ((m = /^\+(\d) 难度$/.exec(p))) { f.accuracy = (f.accuracy || [0, 0, 0]).map(a => a - +m[1]); continue; }
    if ((m = /^\+(\d+)$/.exec(p))) { f.attack_bonus = [+m[1], +m[1], +m[1]]; continue; }
    const t = TOKEN_TAGS.find(([re]) => re.test(p));
    if (!t[1]) { (f.keywords ||= []).push(p); continue; }
    const v = t[0].exec(p)[1];
    f.tags.push(v ? { id: t[1], val: +v } : { id: t[1] });
  }
  const has = id => f.tags.some(t => t.id === id);
  if (has("tg_quick_tech") || has("tg_full_tech")) { f.type = "Tech"; f.tech_type = has("tg_full_tech") ? "Full" : "Quick"; }
  else if (tokens[0] === "系统") f.type = "System";
  else f.type = "Trait";
  return f;
}

const clean = s => s.replace(/\s*\uF06C\s*/g, "\n• ").replace(/^\n/, "");
const joinLines = ls => ls.reduce((a, l) => {
  if (!a) return clean(l);
  if (/^\uF06C/.test(l.trim())) return a + clean(" " + l.trim());
  return a + (/[A-Za-z0-9]$/.test(a) && /^[A-Za-z0-9]/.test(l) ? " " : "") + l;
}, "").trim()
  // 两端对齐排版在汉字之间留下的空格（「投 弹 者 的 攻 击」）
  .replace(/([一-鿿，。、：；（）]) (?=[一-鿿，。、：；（）])/g, "$1");

// 把一段特性区的行切成特性
function parseFeatures(lines, ctx) {
  const out = [];
  let i = 0;
  let pendingRx = []; // 位于名称之前的「触发 / 效果」行
  let cur = null;
  const push = f => { out.push(f); cur = f; };
  const bodyLine = l => {
    if (/^(触发|效果)：/.test(l) || (pendingRx.length && !/^(命中|会心一击)：/.test(l) && !looksHeaderAt(i))) {
      if (/^(触发|效果)：/.test(l) || pendingRx.length) { pendingRx.push(l); return; }
    }
    if (cur) cur._body.push(l); else (ctx.orphans ||= []).push(l);
  };
  function looksHeaderAt(k) {
    const l = lines[k];
    if (inlineHeader(l)) return true;
    if (looksName(l) && k + 1 < lines.length && typeTokens(lines[k + 1])) return true;
    return false;
  }
  while (i < lines.length) {
    const l = lines[i];
    const prev = lines[i - 1];
    const inl = inlineHeader(l);
    let nextTok = i + 1 < lines.length ? typeTokens(lines[i + 1]) : null;
    // 「爪击 / +2/+4/+6，+1 准度 / [威胁 1]…」：只有加值的行后接方括号，是武器
    if (nextTok && nextTok.every(p => /^\+/.test(p)) && /^\[/.test(lines[i + 2] || "")) nextTok = null;
    if (inl || (looksName(l) && nextTok)) {
      const name = inl ? inl.name : l;
      const tokens = inl ? inl.tokens : nextTok;
      const f = { name, ...tokensToFeature(tokens), _tokens: tokens, _body: [] };
      if (pendingRx.length) {
        // 触发 / 效果写在名称前：这是反应
        const rx = splitRx(pendingRx);
        pendingRx = [];
        const granted = tokens.every(t => t === "反应" || /^\d\/轮$/.test(t)) && cur && cur._body.join("").includes(name);
        if (granted) {
          cur._granted = (cur._granted || []).concat({ name, tokens, ...rx });
          i += inl ? 1 : 2;
          continue;
        }
        f.type = "Reaction";
        Object.assign(f, rx);
      }
      push(f);
      i += inl ? 1 : 2;
      continue;
    }
    // 武器：名称后跟类型 / 加值与方括号
    if (looksName(l) && (ends(prev) || !prev || typeTokens(prev) || /\]$/.test(prev) || ctx.sectionStart === i || (ctx.forceNames && ctx.forceNames.has(l))) && i + 1 < lines.length) {
      const wh = parseWeaponHead(lines, i + 1);
      if (wh) {
        if (pendingRx.length) { (ctx.warn ||= []).push(`${ctx.owner}：武器「${l}」前有未归属的触发 / 效果`); }
        push({ name: wh.w.subname ? `${l}：${wh.w.subname}` : l, type: "Weapon", ...wh.w, _body: [] });
        i = wh.next;
        continue;
      }
      // 只有名称、没有类型行的特征（「冲击装甲」「士兵」）
      if (i + 1 < lines.length && !/^(触发|效果)：/.test(lines[i + 1]) && !pendingRx.length) {
        push({ name: l, type: "Trait", tags: [], _tokens: [], _body: [], _untyped: true });
        i++;
        continue;
      }
    }
    if (/^(触发|效果)：/.test(l) || (pendingRx.length && !looksName(l))) { pendingRx.push(l); i++; continue; }
    if (cur) cur._body.push(l); else (ctx.orphans ||= []).push(l);
    i++;
  }
  if (pendingRx.length) (ctx.warn ||= []).push(`${ctx.owner}：末尾有未归属的触发 / 效果：${pendingRx.join("")}`);
  return out.map(finishFeature);
}
function splitRx(ls) {
  const r = { trigger: [], effect: [] };
  let k = null;
  for (const l of ls) {
    const m = /^(触发|效果)：(.*)$/.exec(l);
    if (m) { k = m[1] === "触发" ? "trigger" : "effect"; r[k].push(m[2]); } else if (k) r[k].push(l);
  }
  return { trigger: joinLines(r.trigger), effect: joinLines(r.effect) };
}
function finishFeature(f) {
  const body = f._body;
  let effect = [], onHit = [], crit = [];
  let k = effect;
  for (const l of body) {
    if (/^命中：/.test(l)) { k = onHit; k.push(l.slice(3)); continue; }
    if (/^会心一击：/.test(l)) { k = crit; k.push(l.slice(5)); continue; }
    if (k !== effect && ends(k[k.length - 1]) && /^(T\d|该武器|若|此|这)/.test(l)) k = effect;
    k.push(l);
  }
  const out = { name: f.name, type: f.type, tags: f.tags };
  if (f.keywords) out.keywords = f.keywords;
  if (f.type === "Weapon") {
    Object.assign(out, { weapon_size: f.weapon_size, weapon_kind: f.weapon_kind, attack_bonus: f.attack_bonus, accuracy: f.accuracy, range: f.range, damage: f.damage });
    if (f.unknown) out._unknown = f.unknown;
    out._raw = f.raw;
  }
  if (f.attack_bonus && f.type !== "Weapon") out.attack_bonus = f.attack_bonus;
  if (f.accuracy && f.type !== "Weapon") out.accuracy = f.accuracy;
  if (f.tech_type) out.tech_type = f.tech_type;
  let eff = joinLines(effect);
  // 武器行里识别不了的部分（多模式武器的「1. 远镜：装置 5」等）保留在效果开头，不丢原文
  if (f.unknown) eff = "（" + f.unknown.join("，") + "）" + (eff ? "\n" + eff : "");
  if (crit.length) eff = (eff ? eff + "\n" : "") + "会心一击：" + joinLines(crit);
  if (f.type === "Reaction") { out.trigger = f.trigger; eff = [f.effect, eff].filter(Boolean).join("\n"); }
  for (const g of f._granted || []) eff += `\n【${g.name}】（反应${g.tokens.filter(t => /轮/.test(t)).map(t => "，" + t).join("")}）触发：${g.trigger}\n效果：${g.effect}`;
  out.effect = eff;
  if (onHit.length) out.on_hit = joinLines(onHit);
  if (f._untyped) out._untyped = true;
  return out;
}

// ---- 职业 ----
const STAT_LABELS = [["机体", "hull"], ["系统", "sys"], ["敏捷", "agi"], ["工程", "eng"], ["HP", "hp"], ["装甲", "armor"], ["回避", "evasion"], ["电子防御", "edef"], ["速度", "speed"], ["大小", "size"], ["热度上限", "heatcap"], ["豁免目标", "save"], ["感应", "sensor"]];
function sizeNum(s) {
  const m = /^(1\/2|\d+)/.exec(s);
  return m ? (m[1] === "1/2" ? 0.5 : +m[1]) : 1;
}
function parseStats(text) {
  const st = {}, raw = {};
  for (const [zh, k] of STAT_LABELS) {
    // 「HP：25（+5）装甲：1」：括号后直接接下一项
    const re = new RegExp("(?:^|\\s|\\n|）)" + zh + "：([^\\s\\n（]+(?:（[^）]*）| 或 \\d+|~\\d+)?)", "g");
    const vals = [...text.matchAll(re)].map(m => m[1]);
    if (!vals.length) continue;
    if (k === "size") { st.size = vals.map(sizeNum); raw.size = vals; }
    else if (vals.length === 1 && /\/层级/.test(vals[0])) { const n = parseInt(vals[0]); st[k] = [n, 2 * n, 3 * n]; }
    else st[k] = vals.map(v => parseInt(v.replace("+", ""), 10) || 0); // 「-」表示没有（如没有热度上限）
    if (st[k].length === 1) st[k] = [st[k][0], st[k][0], st[k][0]];
    if (k === "size" && raw.size.length === 1) raw.size = [raw.size[0], raw.size[0], raw.size[0]];
  }
  if (!st.heatcap) st.heatcap = [0, 0, 0];
  st.structure = [1, 1, 1]; st.stress = [1, 1, 1]; st.activations = [1, 1, 1];
  return { st, sizeRaw: raw.size };
}

const STRIP = new Set(["构筑 NPC", "特殊职业", "模板", "主职职业", "可选突变"]);
function classBlocks(pages) {
  const lines = [];
  for (let p = 278; p <= 317; p++) for (const l of (pages[p] || "").split("\n")) {
    const t = l.trim();
    if (!t) continue;
    lines.push({ t, p });
  }
  const starts = [];
  lines.forEach((x, i) => { if (CLASS_ID[x.t] && lines[i + 1] && ROLE[lines[i + 1].t]) starts.push(i); });
  return starts.map((s, n) => ({ lines: lines.slice(s, starts[n + 1] ?? lines.length) }));
}

// opts（其他书用）：name / role / id、bodyStart（说明从第几行开始）、forceNames（强制当作特性标题的行）
function parseClass(block, report, opts = {}) {
  const L = block.lines;
  const name = opts.name ?? L[0].t, role = opts.role ?? ROLE[L[1].t];
  const id = opts.id ?? "npcc_cn_" + CLASS_ID[name];
  const t = L.map(x => x.t);
  const ti = t.indexOf("层级 1 层级 2 层级 3");
  const statStart = ti >= 0 ? ti : t.findIndex(l => l === "机甲技能");
  let flavor = t.slice(opts.bodyStart ?? 2, statStart >= 0 ? statStart : 2);
  // 统计区到「战术 / 特征 / 基础系统 / 定制」
  const after = t.findIndex((l, i) => i > statStart && /^(战术|特征|基础系统|基础武器|定制)$/.test(l));
  let statEnd = after;
  // 班组：数据后有一段说明再到「特征」
  const statText = t.slice(statStart, statEnd).join("\n");
  const statLines = t.slice(statStart, statEnd);
  const lastStat = statLines.reduce((a, l, i) => (/：/.test(l) && /^(机体|系统|敏捷|工程|HP|回避|速度|热度上限|感应|大小|豁免目标|装甲|电子防御)/.test(l) ? i : a), 0);
  let extraTactics = statLines.slice(lastStat + 1).filter(l => !/^(机甲技能|核心数据)$/.test(l));
  // 数据之后的「特殊规则」段（冷核竞技场的标志性 NPC）作为一条基础特征
  let specialRules = null;
  if (extraTactics[0] === "特殊规则") { specialRules = extraTactics.slice(1); extraTactics = []; }
  const { st, sizeRaw } = parseStats(statText);
  const ctx = { owner: name, forceNames: new Set(opts.forceNames || []) };
  let tactics = [...extraTactics];
  let i = statEnd;
  if (t[i] === "战术") { i++; while (i < t.length && !/^(基础系统|基础武器|特征|定制)$/.test(t[i])) tactics.push(t[i++]); }
  const baseStart = i + 1;
  const optIdx = t.findIndex((l, k) => k > i && /^(可选系统|可选模块|可选突变)$/.test(l));
  // 人类：定制区单独处理
  let baseLines = t.slice(baseStart, optIdx > 0 ? optIdx : t.length).filter(l => !STRIP.has(l) && l !== "基础武器" && l !== "特征");
  let optLines = optIdx > 0 ? t.slice(optIdx + 1).filter(l => !STRIP.has(l)) : [];
  // 怪形：结构伤害表放进「独特生理机能」
  let table = null;
  const ti2 = baseLines.findIndex(l => /^怪形结构伤害表/.test(l));
  if (ti2 >= 0) { table = baseLines.slice(ti2); baseLines = baseLines.slice(0, ti2); }
  // 人类：「定制」里选一件武器，另可任选老兵 / 披甲（原文是列表项，不是特性标题）
  let picks = [], customNote = "";
  if (name === "人类") {
    const rest = t.slice(baseStart).filter(l => !STRIP.has(l));
    customNote = rest.filter(l => /^选择/.test(l)).join(" ");
    picks = rest.filter(l => BULLET.test(l)).map(l => {
      const [, n, v] = /^\uF06C\s*([^：]+)：(.*)$/.exec(l);
      return { name: n, type: "Trait", tags: [], effect: v.trim() };
    });
    baseLines = [];
    optLines = rest.filter(l => !/^选择/.test(l) && !BULLET.test(l));
  }
  const base = parseFeatures(baseLines, ctx);
  const optional = parseFeatures(optLines, ctx).concat(picks);
  if (specialRules) base.unshift({ name: "特殊规则", type: "Trait", tags: [], effect: joinLines(specialRules) });
  if (table) {
    const f = base.find(f => f.name === "独特生理机能");
    f.effect += "\n" + table.map(l => l.replace(/\uF06C\s*/, "• ")).join("\n");
  }
  for (const w of ctx.warn || []) report.push(w);
  if (ctx.orphans) report.push(`${name}：未归属的行 ${ctx.orphans.join(" / ")}`);
  const pages = [...new Set(L.map(x => x.p))];
  return {
    id, name, role, role_en: ROLE_EN[role], page: pages[0], pages,
    flavor: joinLines(flavor), tactics: joinLines(tactics), ...(customNote ? { custom_note: customNote } : {}),
    stats: st, ...(sizeRaw && sizeRaw.some(s => !/^(1\/2|\d+)$/.test(s)) ? { size_note: sizeRaw } : {}),
    base, optional,
  };
}

// ---- 模板 ----
function parseTemplates(pages, report) {
  const lines = [];
  for (let p = 318; p <= 325; p++) for (const l of (pages[p] || "").split("\n")) { const t = l.trim(); if (t) lines.push({ t, p }); }
  const t = lines.map(x => x.t);
  // 第 318 页开头是模板总说明
  const intro = [];
  let k = 1;
  while (t[k] !== "指挥官") intro.push(t[k++]);
  const starts = [];
  let from = 0;
  for (const [zh] of TEMPLATES) { const s = t.indexOf(zh, from); starts.push(s); from = s + 1; }
  const out = TEMPLATES.map(([zh, en], n) => {
    const seg = t.slice(starts[n] + 1, starts[n + 1] ?? t.length).filter(l => !STRIP.has(l));
    const ctx = { owner: zh };
    // 说明到「模板特性 / RPV 特性」或第一个特性标题
    let fi = seg.findIndex(l => /^(模板特性|RPV 特性)$/.test(l));
    let flavorEnd = fi;
    if (fi < 0) {
      fi = seg.findIndex((l, i) => inlineHeader(l) || (looksName(l) && i > 0 && ends(seg[i - 1]) && i + 1 < seg.length && !ends(l)));
      flavorEnd = fi;
      fi--;
    }
    const flavor = seg.slice(0, flavorEnd);
    const optTitle = TEMPLATE_OPTIONAL[zh];
    const oi = optTitle ? seg.lastIndexOf(optTitle) : -1;
    const baseLines = seg.slice(fi + 1, oi > 0 ? oi : seg.length);
    const optLines = oi > 0 ? seg.slice(oi + 1) : [];
    const base = parseFeatures(baseLines, ctx);
    const optional = parseFeatures(optLines, ctx);
    for (const w of ctx.warn || []) report.push(w);
    if (ctx.orphans) report.push(`${zh}：未归属的行 ${ctx.orphans.join(" / ")}`);
    const pages = [...new Set(lines.slice(starts[n], starts[n + 1] ?? lines.length).map(x => x.p))];
    return { id: "npct_cn_" + en, name: zh, page: pages[0], pages, description: joinLines(flavor), base, optional };
  });
  return { intro: joinLines(intro), templates: out };
}

// ---- 依原文核对后的补充：数值加成（原文写在文字里的）、只有文字描述的选择项 ----
// bonus：每级数值 [T1,T2,T3]；override：直接设定。只填原文明写的数字。
const STAT_PATCHES = {
  "指挥官/强化": { bonus: { structure: 1, stress: 1 } },
  "RPV/HP 加值": { bonus: { hp: 5 } },
  "精英/强化": { bonus: { structure: 1, stress: 1 } },
  "精英/蓄势待发": { bonus: { activations: 1 } },
  "低等兵/无用之人": { override: { hp: 1 } },
  "低等兵/贫弱": { override: { structure: 1, stress: 1 } },
  "飞船/巨物": { override: { size: 4 } },
  "飞船/装甲船体": { bonus: { hp: 5 } },
  "超体/震慑": { bonus: { activations: 1 } },
  "超体/强化": { bonus: { structure: 3, stress: 3 } },
  "超体/韧性": { bonus: { hp: 5 } },
  "超体/阿耳戈斯装甲": { override: { armor: 6 } },
  "超体/规避": { bonus: { evasion: 4, structure: -1 } },
  "超体/军团": { bonus: { edef: 4 } },
  "老兵/强化": { bonus: { structure: 1, stress: 1 } },
  "班组/披甲": { bonus: { armor: 1 } },
  "人类/老兵": { bonus: { hp: [2, 4, 6] } },
  "人类/披甲": { bonus: { armor: 1 } },
};

function build() {
  const pages = loadText();
  const report = [];
  const classes = classBlocks(pages).map(b => parseClass(b, report));
  const { intro, templates } = parseTemplates(pages, report);
  const owners = [...classes, ...templates];
  for (const o of owners) {
    let n = 0;
    for (const [list, base] of [[o.base, true], [o.optional, false]]) for (const f of list) {
      f.id = o.id.replace(/^npc[ct]_cn_/, "npcf_cn_") + "_" + ++n;
      f.base = base;
      const p = STAT_PATCHES[o.name + "/" + f.name];
      if (p) Object.assign(f, p);
    }
  }
  for (const key of Object.keys(STAT_PATCHES)) {
    const [on, fn] = key.split("/");
    const o = owners.find(o => o.name === on);
    if (!o || ![...o.base, ...o.optional].some(f => f.name === fn)) report.push(`数值补充找不到对应特性：${key}`);
  }
  return {
    report,
    data: {
      _说明: "由 tools/parse-npc-core.js 从核心规则书 v3.5 NPC 章节（PDF 第 272–325 页）的提取文字生成；数值按 T1/T2/T3 排列。",
      source: "《枪骑兵》核心规则书v3.5",
      template_intro: intro,
      classes, templates,
    },
  };
}

module.exports = { build, parseFeatures, parseClass, parseStats, joinLines, typeTokens, inlineHeader, looksName, ROLE, STRIP, BULLET };

if (require.main === module) {
  const { report, data } = build();
  const feats = [...data.classes, ...data.templates].flatMap(o => [...o.base, ...o.optional]);
  const counts = {};
  for (const f of feats) counts[f.type] = (counts[f.type] || 0) + 1;
  console.log(`职业 ${data.classes.length}、模板 ${data.templates.length}、特性 ${feats.length}`, counts);
  for (const o of [...data.classes, ...data.templates]) {
    console.log(`\n## ${o.name}（p.${o.page}）基础 ${o.base.length} / 可选 ${o.optional.length}`);
    if (o.stats) console.log("   " + Object.entries(o.stats).map(([k, v]) => k + "=" + v.join("/")).join(" "));
    for (const f of [...o.base, ...o.optional]) {
      const extra = f.type === "Weapon" ? ` ${f.weapon_size}${f.weapon_kind} 加值${f.attack_bonus.join("/")} 准度${f.accuracy.join("/")} ${f.range.map(r => r.type + r.val).join(",")} ${f.damage.map(d => d.val.join("/") + d.type).join("+")}${f._unknown ? " ?" + f._unknown.join("|") : ""}` : "";
      const tags = f.tags.map(t => t.id.replace("tg_", "") + (t.val !== undefined ? t.val : "")).join(",");
      console.log(`  ${f.base ? "基" : "选"} ${f.type.padEnd(8)} ${f.name} [${tags}]${extra}${f._untyped ? " (无类型行)" : ""}`);
      if (process.argv.includes("--text")) {
        if (f.trigger) console.log("      触发：" + f.trigger);
        if (f.effect) console.log("      " + f.effect.replace(/\n/g, "\n      "));
        if (f.on_hit) console.log("      命中：" + f.on_hit);
      }
    }
  }
  console.log("\n可疑：" + (report.length ? "\n" + report.join("\n") : "无"));
  if (process.argv.includes("--write")) {
    const strip = o => JSON.parse(JSON.stringify(o, (k, v) => (k.startsWith("_") && k !== "_说明" ? undefined : v)));
    const file = path.join(ROOT, "source/npc/core-npcs.json");
    fs.writeFileSync(file, JSON.stringify(strip(data), null, 1) + "\n");
    console.log("已写入 " + path.relative(ROOT, file));
  }
}
