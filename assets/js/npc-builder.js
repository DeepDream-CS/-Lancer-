// NPC 构筑：按核心规则书 v3.5 的职业、层级、模板与可选系统组合 NPC，存在本机，可导出 Foundry VTT 角色 JSON。
// 数据：assets/js/npc-classes.js（tools/build-npc-classes.js 生成）。存档：localStorage「lancer-npc-builder-v1」。
(() => {
  "use strict";
  const C = typeof window !== "undefined" && window.LANCER_NPC_CLASSES;
  if (!C) return;
  const STORE = "lancer-npc-builder-v1";

  // ---------- 资料索引 ----------
  const owners = [...C.classes, ...C.templates];
  const FEATURES = new Map(); // id → { f, owner }
  for (const o of owners) for (const f of [...o.base, ...o.optional]) FEATURES.set(f.id, { f, owner: o });
  const classById = id => C.classes.find(c => c.id === id);
  const templateById = id => C.templates.find(t => t.id === id);

  const STATS = [
    ["hp", "HP"], ["armor", "装甲"], ["evasion", "回避"], ["edef", "电子防御"], ["speed", "速度"], ["size", "大小"],
    ["heatcap", "热度上限"], ["save", "豁免目标"], ["sensor", "感应"], ["structure", "结构"], ["stress", "压力"],
    ["activations", "每轮回合"], ["hull", "机体"], ["agi", "敏捷"], ["sys", "系统"], ["eng", "工程"],
  ];
  const TYPE_ZH = { Weapon: "武器", System: "系统", Trait: "特征", Reaction: "反应", Tech: "科技" };
  const DMG_ZH = { Kinetic: "动能", Energy: "能量", Explosive: "爆炸", Burn: "燃烧", Heat: "热度", Variable: "可变" };
  const RANGE_ZH = { Range: "射程", Threat: "威胁", Thrown: "投掷", Line: "线形", Cone: "锥形", Blast: "溅射", Burst: "爆发" };
  // 原文写明的模板互斥（精英 / 超体 / 低等兵 / 班组 / 人类）
  const TEMPLATE_CONFLICTS = {
    npct_cn_elite: ["npct_cn_grunt", "npct_cn_ultra"],
    npct_cn_ultra: ["npct_cn_elite", "npct_cn_grunt"],
    npct_cn_grunt: ["npct_cn_veteran", "npct_cn_elite", "npct_cn_ultra"],
  };
  const CLASS_TEMPLATE_BAN = { npcc_cn_squad: ["npct_cn_grunt", "npct_cn_veteran", "npct_cn_ultra"] };

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const at = (v, tier) => (Array.isArray(v) ? v[Math.min(v.length, tier) - 1] : v);
  const signed = n => (n > 0 ? "+" + n : String(n));
  const sizeText = n => (n === 0.5 ? "1/2" : String(n));
  const uid = () => "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // ---------- 计算 ----------
  function newNpc(classId = C.classes[0].id) {
    const c = classById(classId);
    return { id: uid(), name: c ? c.name : "NPC", classId, tier: 1, templates: [], picks: [], adjust: {}, notes: "" };
  }

  // NPC 拥有的特性：职业基础 + 已选可选 + 模板基础 + 模板已选可选 + 外加
  function npcFeatures(npc) {
    const cls = classById(npc.classId);
    const tpls = (npc.templates || []).map(templateById).filter(Boolean);
    const out = [];
    const seen = new Set();
    const add = (f, owner, how) => {
      if (seen.has(f.id)) return;
      seen.add(f.id);
      out.push({ f, owner, how });
    };
    const mine = [cls, ...tpls].filter(Boolean);
    for (const o of mine) for (const f of o.base) add(f, o, "base");
    for (const id of npc.picks || []) {
      const hit = FEATURES.get(id);
      if (!hit) continue;
      add(hit.f, hit.owner, mine.includes(hit.owner) ? "optional" : "extra");
    }
    return out;
  }

  function npcStats(npc) {
    const cls = classById(npc.classId);
    const tier = npc.tier || 1;
    const s = {};
    for (const [k] of STATS) s[k] = cls ? at(cls.stats[k], tier) ?? 0 : 0;
    const feats = npcFeatures(npc);
    for (const { f } of feats) if (f.bonus) for (const [k, v] of Object.entries(f.bonus)) if (k in s) s[k] += at(v, tier);
    for (const { f } of feats) if (f.override) for (const [k, v] of Object.entries(f.override)) if (k in s) s[k] = at(v, tier);
    for (const [k, v] of Object.entries(npc.adjust || {})) if (k in s && v) s[k] += v;
    return s;
  }

  // 检查：模板互斥、可选数量建议
  function npcChecks(npc) {
    const msgs = [];
    const tpls = npc.templates || [];
    const name = id => (templateById(id) || {}).name;
    for (const t of tpls) for (const bad of TEMPLATE_CONFLICTS[t] || []) if (tpls.includes(bad) && t < bad) msgs.push(`「${name(t)}」与「${name(bad)}」不能同时使用。`);
    for (const bad of CLASS_TEMPLATE_BAN[npc.classId] || []) if (tpls.includes(bad)) msgs.push(`${classById(npc.classId).name}不能使用「${name(bad)}」模板。`);
    if (npc.classId === "npcc_cn_human" && tpls.length) msgs.push("人类永远不能附加其他模板。");
    const cls = classById(npc.classId);
    const clsPicks = (npc.picks || []).filter(id => cls && cls.optional.some(f => f.id === id)).length;
    let max = 2;
    if (tpls.includes("npct_cn_elite")) max += 1;
    if (tpls.includes("npct_cn_ultra")) max += 2;
    if (clsPicks > max) msgs.push(`已选 ${clsPicks} 项职业可选系统，超过建议的 ${max} 项（原书：0~2 项；精英 +1、超体 +1~2）。`);
    return { msgs, clsPicks, max };
  }

  // Only restore known formatting tags without attributes; other markup stays escaped.
  const RULE_TAG = /(<\/?(?:b|strong|i|em|u|s|p|ul|ol|li|sup|sub)\s*>|<br\s*\/?\s*>)/gi;
  function rulesHtml(text, tier) {
    return String(text ?? "").split(RULE_TAG).map((part, i) => {
      if (i % 2) return part.toLowerCase().startsWith("<br") ? "<br>" : part.toLowerCase().replace(/\s+>/g, ">");
      let out = esc(part);
      if (tier) out = out.replace(/(\+?)(\d+)\/(\+?)(\d+)\/(\+?)(\d+)/g, (m, s1, a, s2, b, s3, c) => {
        const v = [[s1, a], [s2, b], [s3, c]][tier - 1];
        return `<span class="nb-tv" title="T1/T2/T3：${m}">${v[0]}${v[1]}</span>`;
      });
      return out.replace(/\n/g, "<br>");
    }).join("");
  }
  function rulesText(text) {
    return String(text ?? "").replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(?:p|li|ul|ol)\s*>/gi, "\n")
      .replace(/<\/?(?:b|strong|i|em|u|s|p|ul|ol|li|sup|sub)\s*>/gi, "");
  }
  // Tier values retain their complete progression in a hover hint.
  function tierHtml(text, tier) { return rulesHtml(text, tier); }

  function tagName(t, tier) {
    const tags = (window.LANCER_DATA && window.LANCER_DATA.tags) || [];
    const def = tags.find(x => x.id === t.id);
    const val = Array.isArray(t.val) ? at(t.val, tier) : t.val;
    const name = def ? def.name : t.id;
    return name.includes("{VAL}") ? name.replace("{VAL}", val ?? "") : name + (val !== undefined ? " " + val : "");
  }

  function weaponLine(f, tier) {
    const bits = [];
    const kind = [f.weapon_size, f.weapon_kind].filter(Boolean).join(" ");
    if (kind) bits.push(esc(kind));
    const ab = at(f.attack_bonus || [0, 0, 0], tier), acc = at(f.accuracy || [0, 0, 0], tier);
    if (ab) bits.push("攻击 " + signed(ab));
    if (acc > 0) bits.push(`+${acc} 准度`);
    if (acc < 0) bits.push(`+${-acc} 难度`);
    for (const r of f.range || []) bits.push(`[${RANGE_ZH[r.type] || r.type} ${r.val}]`);
    const dmg = (f.damage || []).map(d => `${at(d.val, tier)} ${DMG_ZH[d.type] || d.type}${d.note ? "（" + esc(d.note.replace(/^[，或]/, "")) + "）" : ""}`);
    if (dmg.length) bits.push(`[${dmg.join(" + ")}伤害]`);
    return bits.join(" · ");
  }

  function techLine(f, tier) {
    const bits = [f.tech_type === "Full" ? "完整科技" : "快速科技"];
    const ab = at(f.attack_bonus || [0, 0, 0], tier), acc = at(f.accuracy || [0, 0, 0], tier);
    if (ab) bits.push("科技攻击 " + signed(ab));
    if (acc > 0) bits.push(`+${acc} 准度`);
    if (acc < 0) bits.push(`+${-acc} 难度`);
    return bits.join(" · ");
  }

  // ---------- 文字版 ----------
  function plainTier(text, tier) {
    return rulesText(text).replace(/(\+?)(\d+)\/(\+?)(\d+)\/(\+?)(\d+)/g, (m, s1, a, s2, b, s3, c) => [s1 + a, s2 + b, s3 + c][tier - 1]);
  }
  function npcText(npc) {
    const cls = classById(npc.classId), tier = npc.tier || 1, s = npcStats(npc);
    const tpls = (npc.templates || []).map(templateById).filter(Boolean);
    const lines = [`${npc.name}　${cls.name}（${cls.role}）T${tier}${tpls.length ? "　模板：" + tpls.map(t => t.name).join("、") : ""}`];
    lines.push(STATS.map(([k, zh]) => `${zh} ${k === "size" ? sizeText(s[k]) : ["hull", "agi", "sys", "eng"].includes(k) ? signed(s[k]) : s[k]}`).join("　"));
    for (const { f, owner, how } of npcFeatures(npc)) {
      const tags = [...f.tags.map(t => tagName(t, tier)), ...(f.keywords || [])].join("，");
      let head = `【${f.name}】${TYPE_ZH[f.type]}${tags ? "，" + tags : ""}（${owner.name}${how === "base" ? "" : how === "optional" ? " · 可选" : " · 外加"}）`;
      lines.push(head);
      if (f.type === "Weapon") lines.push("  " + weaponLine(f, tier).replace(/<[^>]+>/g, ""));
      if (f.type === "Tech") lines.push("  " + techLine(f, tier));
      if (f.trigger) lines.push("  触发：" + plainTier(f.trigger, tier));
      if (f.effect) lines.push("  " + plainTier(f.effect, tier).replace(/\n/g, "\n  "));
      if (f.on_hit) lines.push("  命中：" + plainTier(f.on_hit, tier));
    }
    if (npc.notes) lines.push("备注：" + npc.notes);
    return lines.join("\n");
  }

  // ---------- 导出到 Foundry（LANCER 系统 v3.1.3 的 NPC 角色数据，用「导入数据」） ----------
  const FVTT_STAT = { hp: "hp", armor: "armor", evasion: "evasion", edef: "edef", speed: "speed", size: "size", heatcap: "heatcap", save: "save", sensor: "sensor_range", structure: "structure", stress: "stress", activations: "activations", hull: "hull", agi: "agi", sys: "sys", eng: "eng" };
  const FVTT_KEYS = ["activations", "armor", "hp", "evasion", "edef", "heatcap", "speed", "sensor_range", "save", "hull", "agi", "sys", "eng", "size", "structure", "stress"];
  const ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const foundryId = () => Array.from({ length: 16 }, () => ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)]).join("");
  const html = s => (s ? "<div>" + rulesHtml(s) + "</div>" : "");
  function nullBlock(src, tier) {
    if (!src) return null;
    const b = Object.fromEntries(FVTT_KEYS.map(k => [k, null]));
    for (const [k, v] of Object.entries(src)) if (FVTT_STAT[k]) b[FVTT_STAT[k]] = at(v, tier);
    return b;
  }
  function classStatBlock(cls, i) {
    const b = {};
    for (const [k, fk] of Object.entries(FVTT_STAT)) b[fk] = at(cls.stats[k], i + 1) ?? 0;
    b.size = Math.max(0.5, b.size);
    return b;
  }
  function foundryFeature(f, owner, tier, ownerType) {
    const tri = a => (Array.isArray(a) && a.length === 3 ? a.map(n => +n || 0) : [0, 0, 0]);
    const limited = f.tags.find(t => t.id === "tg_limited");
    const sys = {
      // Foundry 没有对应标签的关键词（鲜血 2+、召集、装置 5 等）写在效果开头
      lid: f.id, type: f.type, effect: html((f.keywords ? "【" + f.keywords.join("，") + "】" + (f.effect ? "\n" : "") : "") + (f.effect || "")),
      bonus: nullBlock(f.bonus, tier), override: nullBlock(f.override, tier),
      tags: f.tags.map(t => ({ lid: t.id, val: Array.isArray(t.val) ? `{${t.val.join("/")}}` : t.val === undefined ? "" : String(t.val) })),
      charged: true, loaded: true, tier_override: 0, uses: limited ? +at(limited.val, tier) || 0 : 0,
      destroyed: false, cascading: false,
      origin: { type: ownerType, name: owner.name, base: !!f.base },
      weapon_type: "", damage: [], range: [], on_hit: "", accuracy: [0, 0, 0], attack_bonus: [0, 0, 0],
      trigger: "", tech_type: "Quick", tech_attack: false,
    };
    if (f.type === "Weapon") {
      sys.weapon_type = [f.weapon_size, f.weapon_kind].filter(Boolean).join(" ");
      sys.damage = [0, 1, 2].map(i => (f.damage || []).map(d => ({ type: d.type, val: String(at(d.val, i + 1)) })));
      sys.range = (f.range || []).map(r => ({ type: r.type, val: +r.val }));
      sys.on_hit = html(f.on_hit);
      sys.accuracy = tri(f.accuracy);
      sys.attack_bonus = tri(f.attack_bonus);
    }
    if (f.type === "Reaction") sys.trigger = f.trigger || "";
    if (f.type === "Tech") {
      sys.tech_type = f.tech_type === "Full" ? "Full" : "Quick";
      sys.accuracy = tri(f.accuracy);
      sys.attack_bonus = tri(f.attack_bonus);
      sys.tech_attack = sys.attack_bonus.some(Boolean) || sys.accuracy.some(Boolean);
    }
    if (f.type !== "Weapon" && f.on_hit) sys.effect += html("命中：" + f.on_hit);
    return { _id: foundryId(), name: f.name, type: "npc_feature", system: sys, effects: [], flags: {} };
  }
  function toFoundry(npc) {
    const cls = classById(npc.classId);
    const tier = npc.tier || 1;
    const tpls = (npc.templates || []).map(templateById).filter(Boolean);
    const s = npcStats(npc);
    const items = [];
    items.push({
      _id: foundryId(), name: cls.name, type: "npc_class", system: {
        lid: cls.id, role: cls.role, flavor: html(cls.flavor), tactics: html(cls.tactics),
        base_features: cls.base.map(f => f.id), optional_features: cls.optional.map(f => f.id),
        base_stats: [0, 1, 2].map(i => classStatBlock(cls, i)),
      }, effects: [], flags: {},
    });
    for (const t of tpls) items.push({
      _id: foundryId(), name: t.name, type: "npc_template", system: {
        lid: t.id, description: html(t.description), base_features: t.base.map(f => f.id), optional_features: t.optional.map(f => f.id),
      }, effects: [], flags: {},
    });
    for (const { f, owner } of npcFeatures(npc)) items.push(foundryFeature(f, owner, tier, C.classes.includes(owner) ? "Class" : "Template"));
    const adj = Object.entries(npc.adjust || {}).filter(([, v]) => v);
    if (adj.length) {
      const f = { id: "npcf_cn_builder_adjust", name: "车卡器手动调整", type: "Trait", tags: [], base: true, bonus: Object.fromEntries(adj),
        effect: "在车卡器 NPC 构筑中手动调整的数值：" + adj.map(([k, v]) => STATS.find(x => x[0] === k)[1] + " " + signed(v)).join("，") };
      items.push(foundryFeature(f, { name: "车卡器" }, tier, "Class"));
    }
    const size = Math.max(0.5, s.size);
    return {
      name: npc.name || cls.name,
      type: "npc",
      system: {
        tier, notes: html(npc.notes), destroyed: false, burn: 0, activations: s.activations,
        hp: { value: s.hp, max: s.hp }, heat: { value: 0, max: s.heatcap }, overshield: { value: 0, max: 0 },
        structure: { value: s.structure, max: s.structure }, stress: { value: s.stress, max: s.stress },
      },
      items,
      effects: [],
      prototypeToken: { name: npc.name || cls.name, actorLink: false, disposition: -1, width: size, height: size },
      flags: { "lancer-cn": { npcBuilder: { version: 1, classId: cls.id, tier, templates: npc.templates || [], picks: npc.picks || [] } } },
    };
  }

  const api = { C, FEATURES, STATS, newNpc, npcFeatures, npcStats, npcChecks, npcText, toFoundry, tierHtml };
  window.NPCBuilder = api;
  if (typeof document === "undefined" || !document.querySelector || !document.body) return;

  // ---------- 存档 ----------
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || "null");
      if (s && Array.isArray(s.npcs)) return s;
    } catch (e) { /* 存档损坏时重新开始 */ }
    return { npcs: [], current: null };
  }
  let state = load();
  const save = () => localStorage.setItem(STORE, JSON.stringify(state));
  const cur = () => state.npcs.find(n => n.id === state.current) || null;

  // ---------- 界面 ----------
  const button = document.createElement("button");
  button.textContent = "NPC 构筑";
  button.title = "按职业、层级和模板组合 NPC，可导出到 Foundry";
  button.setAttribute("aria-haspopup", "dialog");
  const anchor = [...document.querySelectorAll(".top-ctl button")].find(b => b.textContent === "NPC 库") || document.querySelector('[data-ui="openSystemLibrary"]');
  if (anchor) anchor.after(button); else document.body.prepend(button);

  const dlg = document.createElement("dialog");
  dlg.id = "npcBuilder";
  dlg.setAttribute("aria-labelledby", "nbTitle");
  dlg.innerHTML = `<header><div><h2 id="nbTitle">NPC 构筑</h2><p>依核心规则书、官方模组与第三方资料的职业和模板组合 NPC · 存在本机浏览器</p></div><button class="nb-close">关闭 ✕</button></header>
<div class="nb-layout"><nav class="nb-roster" aria-label="NPC 列表"><button class="primary nb-new">＋ 新建 NPC</button><div class="nb-list"></div>
<div class="nb-roster-foot"><button class="nb-backup">备份全部</button><button class="nb-restore">导入备份</button><input type="file" class="nb-file" accept=".json,application/json" hidden></div></nav>
<article class="nb-main"></article></div>`;
  document.body.append(dlg);
  const $ = s => dlg.querySelector(s);

  function download(name, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name.replace(/[\\/:*?"<>|]/g, "_");
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function renderList() {
    $(".nb-list").innerHTML = state.npcs.length
      ? state.npcs.map(n => {
          const c = classById(n.classId);
          const t = (n.templates || []).map(id => (templateById(id) || {}).name).filter(Boolean).join("、");
          return `<button data-id="${n.id}" aria-current="${n.id === state.current}"><strong>${esc(n.name || "未命名")}</strong><span>${esc(c ? c.name : "?")} · T${n.tier}${t ? " · " + esc(t) : ""}</span></button>`;
        }).join("")
      : `<p class="nb-empty">还没有 NPC。点「新建 NPC」，选职业和层级即可。</p>`;
  }

  // 核心规则书按角色分组；其他书按书分组，名称后注明角色
  function classOptions(sel) {
    const opt = (c, label) => `<option value="${c.id}"${c.id === sel ? " selected" : ""}>${esc(label)}</option>`;
    const core = C.roles.map(r => {
      const list = C.classes.filter(c => c.pack === "核心规则书" && c.role === r);
      return list.length ? `<optgroup label="核心 · ${r}">${list.map(c => opt(c, c.name)).join("")}</optgroup>` : "";
    }).join("");
    const books = (C.packs || []).filter(p => p.name !== "核心规则书").map(p => {
      const list = C.classes.filter(c => c.pack === p.name);
      return list.length ? `<optgroup label="${esc(p.name)}${p.official ? "" : "（第三方）"}">${list.map(c => opt(c, `${c.name}（${c.role}${c.special ? "，" + c.special : ""}）`)).join("")}</optgroup>` : "";
    }).join("");
    return core + books;
  }
  const packInfo = name => (C.packs || []).find(p => p.name === name) || { name, official: true };

  function featureCard(entry, tier, removable) {
    const { f, owner, how } = entry;
    const tags = [...f.tags.map(t => tagName(t, tier)), ...(f.keywords || [])].map(t => `<span class="nb-tag">${esc(t)}</span>`).join("");
    const origin = `${esc(owner.name)}${how === "base" ? " · 基础" : how === "optional" ? " · 可选" : " · 外加"}`;
    let body = "";
    if (f.type === "Weapon") body += `<p class="nb-wline">${weaponLine(f, tier)}</p>`;
    if (f.type === "Tech") body += `<p class="nb-wline">${techLine(f, tier)}</p>`;
    if (f.trigger) body += `<p><b>触发：</b>${tierHtml(f.trigger, tier)}</p>`;
    if (f.effect) body += `<p>${f.type === "Reaction" ? "<b>效果：</b>" : ""}${tierHtml(f.effect, tier)}</p>`;
    if (f.on_hit) body += `<p><b>命中：</b>${tierHtml(f.on_hit, tier)}</p>`;
    return `<section class="nb-feat nb-${f.type.toLowerCase()}"><header><strong>${esc(f.name)}</strong><span class="nb-kind">${TYPE_ZH[f.type]}</span><span class="nb-origin">${origin}</span>${removable ? `<button class="nb-unpick" data-id="${f.id}" title="移除">✕</button>` : ""}</header>${tags ? `<div class="nb-tags">${tags}</div>` : ""}${body}</section>`;
  }

  function pickList(owner, npc, label) {
    if (!owner.optional.length) return "";
    const tier = npc.tier;
    return `<fieldset class="nb-picks"><legend>${esc(label)}</legend>${owner.optional.map(f => {
      const on = (npc.picks || []).includes(f.id);
      const hint = rulesText(f.effect || f.on_hit || f.trigger || "").replace(/\n/g, " ").slice(0, 90);
      return `<label title="${esc(plainTier(hint, tier))}"><input type="checkbox" data-pick="${f.id}"${on ? " checked" : ""}> ${esc(f.name)} <small>${TYPE_ZH[f.type]}</small></label>`;
    }).join("")}</fieldset>`;
  }

  function renderMain() {
    const npc = cur();
    const main = $(".nb-main");
    if (!npc) {
      main.innerHTML = `<div class="nb-intro"><h3>开始构筑</h3><p>按原书「构筑 NPC」：选择职业 → 从该职业中选择 0~2 项可选系统 → 选择层级 → 如需要再套用模板 → 改名与风格。</p><p>T1 约对应 LL0~4，T2 约 LL5~8，T3 约 LL9~12。精英、老兵适合让人印象深刻的对手；超体用于首领战；低等兵适合成群出现的杂兵。</p><p>导出的 JSON 在 Foundry 里这样用：新建一个 NPC 角色 → 在角色目录里右键它 → 「导入数据」→ 选这个文件。</p></div>`;
      return;
    }
    const cls = classById(npc.classId);
    const tier = npc.tier;
    const s = npcStats(npc);
    const feats = npcFeatures(npc);
    const chk = npcChecks(npc);
    const tpls = (npc.templates || []).map(templateById).filter(Boolean);
    const packs = (C.packs || []).map(p => p.name).filter(p => C.templates.some(t => t.pack === p));
    const statCells = STATS.map(([k, zh]) => {
      const v = k === "size" ? sizeText(s[k]) : ["hull", "agi", "sys", "eng"].includes(k) ? signed(s[k]) : s[k];
      const adj = (npc.adjust || {})[k] || 0;
      return `<div class="nb-stat${adj ? " nb-adjusted" : ""}"><span>${zh}</span><strong>${v}</strong><input type="number" step="1" value="${adj || ""}" placeholder="±" data-adjust="${k}" aria-label="${zh} 手动调整" title="手动调整（加减）"></div>`;
    }).join("");
    const otherOptions = C.classes.filter(c => c !== cls).map(c => `<optgroup label="${esc(c.name)}${c.pack !== "核心规则书" ? "（" + esc(c.pack) + "）" : ""}">${c.optional.concat(c.base).map(f => `<option value="${f.id}">${esc(f.name)}（${TYPE_ZH[f.type]}）</option>`).join("")}</optgroup>`).join("");
    main.innerHTML = `
<div class="nb-row">
 <label class="nb-name">名称<input class="nb-in-name" value="${esc(npc.name)}" maxlength="60"></label>
 <label>职业<select class="nb-in-class">${classOptions(npc.classId)}</select></label>
 <div class="nb-tier" role="radiogroup" aria-label="层级">${[1, 2, 3].map(n => `<button role="radio" aria-checked="${n === tier}" data-tier="${n}">T${n}</button>`).join("")}</div>
</div>
<p class="nb-meta">${esc(cls.role)}${cls.special ? "（" + esc(cls.special) + "）" : ""} · ${esc(packInfo(cls.pack).book || cls.pack)}${packInfo(cls.pack).official ? "" : "（第三方）"} PDF 第 ${cls.pages.join("、")} 页 · <a href="assets/npc/${cls.source || 1}-${cls.page}.jpg" target="_blank" rel="noopener">查看原书页</a>${cls.size_note ? ` · 大小：${esc(cls.size_note[tier - 1])}` : ""}</p>
<div class="nb-stats">${statCells}</div>
${chk.msgs.length ? `<ul class="nb-warn">${chk.msgs.map(m => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}
<details class="nb-about"><summary>职业说明与战术</summary><p>${rulesHtml(cls.flavor)}</p><p><b>战术：</b>${rulesHtml(cls.tactics)}</p>${cls.custom_note ? `<p><b>定制：</b>${rulesHtml(cls.custom_note)}</p>` : ""}</details>
<fieldset class="nb-templates"><legend>模板</legend>${packs.map(p => `<div><span class="nb-pack">${esc(p)}</span>${C.templates.filter(t => t.pack === p).map(t => `<label title="${esc((t.description || "").slice(0, 120))}"><input type="checkbox" data-template="${t.id}"${(npc.templates || []).includes(t.id) ? " checked" : ""}> ${esc(t.name)}</label>`).join("")}</div>`).join("")}</fieldset>
${pickList(cls, npc, `${cls.name}的可选系统（已选 ${chk.clsPicks}，建议 0~${chk.max}）`)}
${tpls.map(t => pickList(t, npc, `${t.name}的可选项`)).join("")}
<label class="nb-extra">从其他职业添加系统<select class="nb-in-extra"><option value="">选择…</option>${otherOptions}</select></label>
<div class="nb-feats">${feats.map(e => featureCard(e, tier, e.how !== "base")).join("")}</div>
${tpls.length ? `<details class="nb-about"><summary>模板说明</summary>${tpls.map(t => `<p><b>${esc(t.name)}：</b>${rulesHtml(t.description)}</p>`).join("")}</details>` : ""}
<label class="nb-notes">备注<textarea class="nb-in-notes" rows="3">${esc(npc.notes)}</textarea></label>
<div class="nb-actions"><button class="primary nb-foundry" title="Foundry：新建 NPC 角色 → 右键 → 导入数据">导出到 Foundry</button><button class="nb-copytext">复制文字版</button><button class="nb-dup">复制此 NPC</button><button class="danger nb-del">删除</button><span class="nb-status" role="status"></span></div>
<p class="nb-help">导出的文件在 Foundry 中这样导入：在角色目录新建一个 <b>NPC</b> 类型的角色 → 右键该角色 → 「导入数据」→ 选择文件。职业、模板与全部特性会一起导入，层级可在角色表上切换。</p>`;
  }

  function render() { renderList(); renderMain(); }
  function update(fn) { const n = cur(); if (!n) return; fn(n); save(); render(); }
  function status(msg) { const el = $(".nb-status"); if (el) el.textContent = msg; }

  button.onclick = () => { dlg.showModal(); render(); };
  $(".nb-close").onclick = () => dlg.close();
  dlg.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); dlg.close(); } });
  $(".nb-new").onclick = () => { const n = newNpc(); state.npcs.push(n); state.current = n.id; save(); render(); $(".nb-in-name")?.select(); };
  $(".nb-list").onclick = e => { const b = e.target.closest("button[data-id]"); if (b) { state.current = b.dataset.id; save(); render(); } };
  $(".nb-backup").onclick = () => download("lancer-npcs.json", { app: "lancer-npc-builder", version: 1, npcs: state.npcs });
  $(".nb-restore").onclick = () => $(".nb-file").click();
  $(".nb-file").onchange = async e => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const list = Array.isArray(data.npcs) ? data.npcs : [];
      const ok = list.filter(n => n && classById(n.classId));
      for (const n of ok) state.npcs.push({ ...newNpc(n.classId), ...n, id: uid() });
      if (ok.length) state.current = state.npcs[state.npcs.length - 1].id;
      save(); render();
      alert(`导入了 ${ok.length} 个 NPC${list.length > ok.length ? `，${list.length - ok.length} 个无法识别` : ""}。`);
    } catch (err) { alert("无法读取该文件：" + err.message); }
  };

  const main = $(".nb-main");
  main.addEventListener("change", e => {
    const t = e.target;
    if (t.matches(".nb-in-class")) update(n => {
      const old = classById(n.classId);
      if (old && n.name === old.name) n.name = classById(t.value).name;
      n.classId = t.value;
      n.picks = (n.picks || []).filter(id => !old || !old.optional.some(f => f.id === id));
    });
    else if (t.matches("[data-template]")) update(n => {
      const id = t.dataset.template;
      n.templates = t.checked ? [...new Set([...(n.templates || []), id])] : (n.templates || []).filter(x => x !== id);
      if (!t.checked) { const tp = templateById(id); n.picks = (n.picks || []).filter(p => !tp.optional.some(f => f.id === p)); }
    });
    else if (t.matches("[data-pick]")) update(n => {
      const id = t.dataset.pick;
      n.picks = t.checked ? [...(n.picks || []), id] : (n.picks || []).filter(x => x !== id);
    });
    else if (t.matches("[data-adjust]")) update(n => {
      n.adjust = n.adjust || {};
      const v = parseInt(t.value, 10);
      if (v) n.adjust[t.dataset.adjust] = v; else delete n.adjust[t.dataset.adjust];
    });
    else if (t.matches(".nb-in-extra") && t.value) update(n => { n.picks = [...new Set([...(n.picks || []), t.value])]; });
    else if (t.matches(".nb-in-notes")) { const n = cur(); n.notes = t.value; save(); }
  });
  main.addEventListener("input", e => {
    if (e.target.matches(".nb-in-name")) { const n = cur(); n.name = e.target.value; save(); renderList(); }
  });
  main.addEventListener("click", async e => {
    const t = e.target.closest("button");
    if (!t) return;
    const npc = cur();
    if (t.dataset.tier) update(n => { n.tier = +t.dataset.tier; });
    else if (t.matches(".nb-unpick")) update(n => { n.picks = (n.picks || []).filter(x => x !== t.dataset.id); });
    else if (t.matches(".nb-foundry")) { download(`${npc.name || "npc"}-foundry-npc.json`, toFoundry(npc)); status("已导出。Foundry：新建 NPC 角色 → 右键 → 导入数据。"); }
    else if (t.matches(".nb-copytext")) {
      try { await navigator.clipboard.writeText(npcText(npc)); status("已复制文字版。"); } catch (err) { status("浏览器不允许复制：" + err.message); }
    }
    else if (t.matches(".nb-dup")) { const n = { ...JSON.parse(JSON.stringify(npc)), id: uid(), name: npc.name + " 副本" }; state.npcs.push(n); state.current = n.id; save(); render(); }
    else if (t.matches(".nb-del")) {
      if (!confirm(`删除「${npc.name}」？此操作无法撤销。`)) return;
      state.npcs = state.npcs.filter(n => n !== npc);
      state.current = state.npcs[0] ? state.npcs[0].id : null;
      save(); render();
    }
  });
})();
