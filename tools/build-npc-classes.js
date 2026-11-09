// 生成 NPC 构筑用的数据 assets/js/npc-classes.js（生成文件，不要手改）。
//   核心规则书：source/npc/core-npcs.json（由 tools/parse-npc-core.js 从原书文字解析，人工核对）
//   尘墓模板：Foundry 官方数据 source/fvtt/official/dustgrave/ + 中文 source/fvtt/zh-npc.json
//   其他书：source/npc/books-npcs.json（由 tools/parse-npc-books.js 解析：官方模组与第三方扩展 / 模组）
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));

const SIZE = { Main: "主武器", Auxiliary: "副武器", Heavy: "重型", Superheavy: "超重型" };
const KIND = { Melee: "近战", Rifle: "步枪", Cannon: "大炮", Launcher: "发射器", CQB: "CQB", Nexus: "巢房" };

function officialTemplates() {
  const dir = "source/fvtt/official/dustgrave/";
  const zh = read("source/fvtt/zh-npc.json");
  const feats = read(dir + "npc_features.json");
  const missing = [];
  const tr = (id, key, en) => {
    const v = zh[id] && zh[id][key];
    if (en && !v) missing.push(id + "." + key);
    return v || en || "";
  };
  const conv = f => {
    const out = { id: f.id, name: tr(f.id, "name", f.name), type: f.type, tags: (f.tags || []).map(t => (t.val === undefined ? { id: t.id } : { id: t.id, val: t.val })) };
    if (f.type === "Weapon") {
      const [sz, ...kind] = String(f.weapon_type || "").split(" ");
      Object.assign(out, {
        weapon_size: SIZE[sz] || sz, weapon_kind: kind.map(k => KIND[k] || k).join(" "),
        attack_bonus: f.attack_bonus || [0, 0, 0], accuracy: f.accuracy || [0, 0, 0],
        range: (f.range || []).map(r => ({ type: r.type, val: +r.val })),
        damage: (f.damage || []).filter(d => d.damage.some(Boolean)).map(d => ({ type: d.type, val: d.damage })),
      });
    }
    if (f.type === "Tech") {
      out.tech_type = f.tech_type || "Quick";
      if (f.attack_bonus) out.attack_bonus = f.attack_bonus;
      if (f.accuracy) out.accuracy = f.accuracy;
    }
    if (f.type === "Reaction") out.trigger = tr(f.id, "trigger", f.trigger);
    out.effect = tr(f.id, "effect", f.effect);
    if (f.on_hit) out.on_hit = tr(f.id, "on_hit", f.on_hit);
    if (f.bonus) out.bonus = f.bonus;
    if (f.override) out.override = f.override;
    return out;
  };
  const templates = read(dir + "npc_templates.json").map(t => ({
    id: t.id, name: tr(t.id, "name", t.name), pack: "尘墓", description: tr(t.id, "description", t.description),
    base: t.base_features.map(id => ({ ...conv(feats.find(f => f.id === id)), base: true })),
    optional: t.optional_features.map(id => ({ ...conv(feats.find(f => f.id === id)), base: false })),
  }));
  return { templates, missing };
}

function build() {
  const core = read("source/npc/core-npcs.json");
  const books = read("source/npc/books-npcs.json").books;
  const off = officialTemplates();
  // 尘墓模板放在官方模组之前，其后是第三方书
  const packs = ["核心规则书", "尘墓", ...books.map(b => b.pack).filter((p, i, a) => a.indexOf(p) === i)];
  const bookPacks = Object.fromEntries(books.map(b => [b.pack, { book: b.book, official: b.official, note: b.note, source: b.source }]));
  const data = {
    source: core.source,
    template_intro: core.template_intro,
    roles: ["突击", "炮击", "操纵", "卫兵", "支援", "生物"],
    packs: packs.map(p => ({ name: p, ...(bookPacks[p] || { book: p === "核心规则书" ? core.source : "Foundry 官方数据（尘墓）", official: true, note: "" }) })),
    classes: [
      ...core.classes.map(c => ({ ...c, pack: "核心规则书", source: 1 })),
      ...books.flatMap(b => b.classes),
    ],
    templates: [
      ...core.templates.map(t => ({ ...t, pack: "核心规则书", source: 1 })),
      ...off.templates,
      ...books.flatMap(b => b.templates),
    ],
  };
  return { data, missing: off.missing };
}

module.exports = { build };

if (require.main === module) {
  const { data, missing } = build();
  const file = path.join(ROOT, "assets/js/npc-classes.js");
  fs.writeFileSync(file, "// 自动生成，请勿手改。来源：source/npc/core-npcs.json、source/npc/books-npcs.json、Foundry 官方尘墓模板（source/fvtt/zh-npc.json）。由 tools/build-npc-classes.js 生成。\nwindow.LANCER_NPC_CLASSES = " + JSON.stringify(data) + ";\n");
  const n = o => o.base.length + o.optional.length;
  console.log(`职业 ${data.classes.length}、模板 ${data.templates.length}、特性 ${[...data.classes, ...data.templates].reduce((a, o) => a + n(o), 0)} → ${path.relative(ROOT, file)}`);
  if (missing.length) console.log("尘墓模板缺中文：" + missing.join(", "));
}
