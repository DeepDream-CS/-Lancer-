// 把核心规则书以外的 NPC（官方模组合集、第三方扩展与模组）解析为结构化职业 / 模板 / 特性。
// 文字来源与核心相同：assets/js/npc-data.js。原文照录；版面差异（标题行、小说 / 对白插页）在 BOOKS 里逐本配置。
//   node tools/parse-npc-books.js [--text] [书号]   列出解析结果与可疑项
//   node tools/parse-npc-books.js --write          写入 source/npc/books-npcs.json
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const core = require("./parse-npc-core.js");

const ROOT = path.join(__dirname, "..");
const ROLE_PART = { 突擊: "突击", 炮擊: "炮击", 操縱: "操纵", 衛兵: "卫兵", 支援: "支援", 生物: "生物" };
const ROLE_RE = /^(?:(軍情報告|獎勵目標)特殊)?((?:突擊|炮擊|操縱|衛兵|支援|生物)(?:\/(?:突擊|炮擊|操縱|衛兵|支援|生物))*)$/;
const SPECIAL = { 軍情報告: "军情报告特殊", 獎勵目標: "奖励目标特殊" };

// pages：职业 / 模板所在页；skip：整页是小说、对白或其他内容；cut：该页从这一行起不是 NPC 内容；
// strip：页眉、标题等非内容行；templates：模板标题行 → { optional：可选表标题（取最后一次单独成行）}；
// forceNames：没有类型行、前一句又没有句号结尾，需要强制当作特性标题的行。
const BOOKS = [
  {
    source: 6, code: "ss", pack: "塞壬之歌", official: true, pages: [82, 86], skip: [],
    strip: ["新 NPC 职业"], templates: {}, drop: ["参数："],
    dropRanges: [["-------", "空，看着这一切在我阴影下的黑暗中熊熊燃烧。”"], ["-------", "–——“拥抱他们”"]],
    moves: [
      { from: "擒拿时，水蛭选择选项其二：", count: 5, after: "净化", skip: 1 },
      { from: "选择一个被水蛭擒拿的角色：水蛭和目标隐形直到", count: 2, after: "褪色炉", skip: 1 },
      { from: "战斗开始时，暴风雨可从以下每个类别中选择一个", count: 11, after: "气象灰浴", skip: 1 },
      { from: "暴风雨可结束任意激活的气象灰浴效果", count: 8, after: "纳米体陨石", skip: 1 },
      { from: "暴风雨可将气候节点射程 3 内的任何盟友角色瞬", count: 2, after: "空白空间翘曲转移", skip: 1 },
      { from: "暴风雨视线感应内所有气候节点下一轮结束前隐", count: 2, after: "虚幻节点", skip: 1 },
      { from: "归位节点（大小 1", count: 4, after: "归位节点", skip: 1 },
      { from: "暴风雨在射程 5 内选择最多两个敌对角色", count: 3, after: "雷电发生器", skip: 1 },
      { from: "暴风雨可激活另一种来自气象灰浴的灰浴效果", count: 4, after: "灰浴控制", skip: 1 },
    ],
  },
  {
    source: 7, code: "wf", pack: "壁花不容", official: true, pages: [180, 183], skip: [],
    strip: ["新 NPC 职业"], templates: {},
    moves: [
      { from: "任何战斗开始时，当他们作为增援部队抵达", until: "护罩区域可以互相重叠", after: "本影护罩", skip: 1 },
      { from: "视线感应内某角色必须通过系统豁免，否则受到 4/5/6", until: "已感染病毒目标若再次遭到监禁", after: "监禁", skip: 1 },
    ],
    note: "幻灵是多层首领，结构与普通职业不同，不在此列。",
  },
  {
    source: 5, code: "ws", pack: "冬痕行动", official: true, pages: [59, 62], skip: [],
    strip: ["新 NPC 职业", "新 NPC 模板"], templates: { 海军陆战队: { optional: "海军陆战队系统和特征" } },
  },
  {
    source: 3, code: "mc", pack: "模组资源合集", official: true, pages: [51, 51], skip: [],
    strip: [], templates: {}, drop: ["-不包括复仇者-获得 OVERSHIELD"], // 合集里残留的英文排版层
    note: "复仇者只见于合集；合集里的其他职业取自各模组原书，工业机、特种部队、怖物与尘墓模板相同（用 Foundry 官方数据）。",
  },
  {
    source: 11, code: "cp", pack: "卡斯特与帕勒克", pages: [78, 88], skip: [],
    strip: ["格查尔飞群的 NPC"], templates: { 火葬: { optional: "火葬系统和特征" } },
    moves: [
      { from: "架构师固定直到下一回合开始。以一个快速动作", until: "体豁免否则伏卧。", after: "嵌入式弹射器", skip: 1 },
      { from: "拦截机在视线内选择一个敌对角色施以拦截标记", until: "以新标记会移除前一个标记。", after: "拦截标记", skip: 1 },
      { from: "在拦截机下一回合结束前，敌对角色将拦截机射程 3", until: "每移动 1 空间就会受到 1AP 动能伤害。", after: "碎片投掷器", skip: 1 },
    ],
  },
  {
    source: 12, code: "sultan", pack: "苏丹", pages: [150, 173], skip: [153, 155, 157, 165, 171],
    // 续页下半是小说、通讯记录和题词
    cut: {
      151: "叛乱分子轰炸拉希里广场区域后战斗记录", 159: "“……谁的欲望更胜一筹", 161: "蕾拉娜，", 163: "收件人：尤瑟夫",
      167: "[!]同步通讯", 169: "[共同主观同步启动]", 172: "“光荣战斗就是",
    },
    forceNames: ["反装甲高爆炸弹", "打桩机"],
    strip: ["新 NPC"], templates: { 捍卫者模板: { optional: "捍卫者系统和特征" }, 铲土机模板: { optional: "铲土机系统和特征" } },
  },
  {
    source: 13, code: "cca", pack: "冷核圆形竞技场", pages: [42, 56], skip: [],
    strip: [],
    // 每个标志性 NPC 带一个只给它用的「标志性超体」附加（采用超体模板时获得）
    templates: Object.fromEntries(["无畏级", "流星", "吸血鬼", "暴风", "技术症候群"].map(n => ["标志性超体：" + n, { optional: "可选系统" }])),
    moves: [
      { from: "直到虹膜下一回合开始，当它被远程武器攻击时", count: 3, after: "阻断虫群", skip: 1 },
      { from: "幻人选择感应内一个盟友角色。幻人回合立即结束", until: "受一半的伤害和热度。", after: "直接控制 特征，协定，1/轮" },
    ],
  },
  {
    source: 14, code: "rc", pack: "强化战斗", pages: [51, 70], skip: [55],
    strip: ["常规 NPC"], templates: {},
    dropExact: ["辅助节点"], // 比蒙巨兽各节点类型前的小标题
  },
  {
    source: 16, code: "mi", pack: "午夜伊菲革涅亚", pages: [70, 72], skip: [],
    strip: ["附录 A：新 NPC"], templates: {},
    note: "伊菲革涅亚本人只有层级 3，是专属首领，不在此列。",
  },
  {
    source: 17, code: "lt", pack: "天堂末班车", pages: [20, 21], skip: [], strip: [], templates: {},
    moves: [
      { from: "锥形 5 或爆发 2 内的所有角色必须通过系统豁免", count: 3, after: "区域拒止阵列", skip: 1 },
      { from: "警卫在下一回合开始前固定，只要这些角色在视线", count: 3, after: "[警卫-激活]", skip: 1 },
      { from: "统治哨所（大小 1", until: "威慑，以及哨所造成的交战。", after: "统治之墙", skip: 1 },
      { from: "警卫移动时可悬浮，但必须在地面上结束移动否则", count: 2, after: "“蜻蜓”陀螺仪旋翼", skip: 1 },
      { from: "克隆火力无人机（大小 1/2", until: "对警卫而言失去掩护。", after: "克隆火力无人机", skip: 1 },
      { from: "激活后，警卫将固定", until: "停止该系统。", after: "反火力套组", skip: 1 },
    ],
  },
  {
    source: 19, code: "gf", pack: "浴金焰", pages: [257, 262], skip: [], strip: [], templates: {},
    cut: { 260: "他们说：“它是空的", 262: "“你真有那么强" },
  },
  {
    source: 20, code: "legion", pack: "军团", pages: [73, 73], skip: [], strip: ["NPC 模板"],
    templates: { 傀儡师: { optional: "傀儡师系统和特征" } },
  },
];

function loadBooks() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/npc-data.js"), "utf8"), ctx);
  return ctx.window.LANCER_NPCS;
}

function bookLines(D, b) {
  const lines = [];
  for (let p = b.pages[0]; p <= b.pages[1]; p++) {
    if (b.skip.includes(p)) continue;
    const e = D.entries.find(e => e.source === b.source && e.page === p);
    const book = D.books.find(x => x.source === b.source);
    let text = e ? e.text : (book && book.pages[p - 1]) || "";
    for (const raw of text.split("\n")) {
      const t = raw.trim();
      if (b.cut && b.cut[p] && t.startsWith(b.cut[p])) break;
      if (!t || core.STRIP.has(t) || b.strip.includes(t)) continue;
      if ((b.drop || []).some(d => t.startsWith(d)) || (b.dropExact || []).includes(t)) continue;
      lines.push({ t, p });
    }
  }
  // 插图说明、小说片段：删除从 [0] 开头的行到 [1] 开头的行（含）
  for (const [from, to] of b.dropRanges || []) {
    const s = lines.findIndex(x => x.t.startsWith(from));
    const e = lines.findIndex((x, i) => i >= s && x.t.startsWith(to));
    if (s < 0 || e < 0) throw new Error(`${b.pack}：dropRanges 找不到「${s < 0 ? from : to}」`);
    lines.splice(s, e - s + 1);
  }
  // 版面把效果文字排在名称前面时：把 from 开头的行（到 until 开头的行为止，或共 count 行）
  // 移到 after 那一行之后；after 为名称行时用 skip: 1 跳过其类型行
  for (const mv of b.moves || []) {
    const s = lines.findIndex(x => x.t.startsWith(mv.from));
    if (s < 0) throw new Error(`${b.pack}：moves 找不到「${mv.from}」`);
    const count = mv.until ? lines.findIndex((x, i) => i >= s && x.t.startsWith(mv.until)) - s + 1 : mv.count;
    if (!(count > 0)) throw new Error(`${b.pack}：moves 找不到「${mv.until}」`);
    const block = lines.splice(s, count);
    const a = lines.findIndex(x => x.t === mv.after);
    if (a < 0) throw new Error(`${b.pack}：moves 找不到「${mv.after}」`);
    lines.splice(a + 1 + (mv.skip || 0), 0, ...block);
  }
  return lines;
}

const roleOf = s => s.split("/").map(r => ROLE_PART[r] || r).join("/");

function parseBook(D, b, report) {
  const lines = bookLines(D, b);
  const t = lines.map(x => x.t);
  // 职业起点：名称行 + 角色行（主战坦克是「载具」+ 角色行）
  const starts = [];
  t.forEach((l, i) => {
    const name = l.replace(/^新 NPC：/, "");
    if (name.length > 8 || /[，。：]/.test(name) || name === "载具") return;
    if (ROLE_RE.test(t[i + 1] || "") || (t[i + 1] === "载具" && ROLE_RE.test(t[i + 2] || ""))) starts.push(i);
  });
  const tplStarts = [];
  for (const name of Object.keys(b.templates)) { const k = t.indexOf(name); if (k < 0) report.push(`${b.pack}：找不到模板「${name}」`); else tplStarts.push(k); }
  const bounds = [...starts, ...tplStarts].sort((x, y) => x - y);
  const end = i => bounds.find(k => k > i) ?? t.length;
  const classes = starts.map((s, n) => {
    const block = { lines: lines.slice(s, end(s)) };
    const vehicle = block.lines[1].t === "载具";
    const m = ROLE_RE.exec(block.lines[vehicle ? 2 : 1].t);
    const name = block.lines[0].t.replace(/^新 NPC：/, "");
    const c = core.parseClass(block, report, {
      name, role: roleOf(m[2]), id: `npcc_x_${b.code}_${n + 1}`, bodyStart: vehicle ? 3 : 2, forceNames: b.forceNames,
    });
    if (m[1]) c.special = SPECIAL[m[1]];
    if (vehicle) c.special = "载具";
    return c;
  });
  const templates = tplStarts.map((s, n) => parseTemplate(lines.slice(s, end(s)), b, n, report));
  return { classes, templates };
}

function parseTemplate(L, b, n, report) {
  const t = L.map(x => x.t);
  const title = t[0];
  const conf = b.templates[title];
  const name = title.replace(/模板$/, "");
  let fi = t.findIndex((l, i) => i > 0 && /^(模板特性|模板特征|基础系统)$/.test(l));
  if (fi < 0) fi = 0;
  const oi = conf.optional ? t.lastIndexOf(conf.optional) : -1;
  const ctx = { owner: name, forceNames: new Set(b.forceNames || []) };
  const base = core.parseFeatures(t.slice(fi + 1, oi > 0 ? oi : t.length), ctx);
  const optional = oi > 0 ? core.parseFeatures(t.slice(oi + 1), ctx) : [];
  for (const w of ctx.warn || []) report.push(w);
  if (ctx.orphans) report.push(`${name}：未归属的行 ${ctx.orphans.join(" / ")}`);
  return {
    id: `npct_x_${b.code}_${n + 1}`, name, page: L[0].p, pages: [...new Set(L.map(x => x.p))],
    description: core.joinLines(t.slice(1, fi > 0 ? fi : 1)), base, optional,
  };
}

// 原文写明的模板数值加成
const STAT_PATCHES = {
  "捍卫者/强化": { bonus: { structure: 1, stress: 1 } },
  "铲土机/重装机体": { bonus: { hp: 5 } },
  "列车/死亡引擎": { bonus: { structure: 3, stress: 3, activations: 1 } }, // 每轮两个回合，+3 结构和压力
  "合约杀手/顶级掠食者": { bonus: { structure: 2, stress: 2, activations: 1 } },
  "动员兵/战斗盾": { bonus: { hp: 2 } },
  "十字军/塔盾": { bonus: { armor: 1 } }, // 原文：只要该武器未被摧毁
};

// 逐条修正，键为「书/职业或模板/特性」：
//   set：覆盖字段（只用于原文明显的排版错字，理由写在 note）；optional：改为可选项；
//   mergeInto：并入同一职业的另一特性（小标题、分类表）；drop：删除（插图说明等非规则文字）。
const FEATURE_PATCHES = {
  "塞壬之歌/暴风雨/类别 I": { mergeInto: "气象灰浴" },
  "塞壬之歌/暴风雨/类别 II": { mergeInto: "气象灰浴" },
  "塞壬之歌/暴风雨/类别 III": { mergeInto: "气象灰浴" },
  // 主战坦克「武装配备」：必须选择一门主炮和一件辅助武器，原书列在基础系统里，这里改为可选项供挑选
  ...Object.fromEntries(["主炮：滑膛炮", "轨道炮", "“安塔瑞斯”型镭射炮", "反坦克炮", "“扫街者”榴霰弹发射器", "辅助武器：同轴机枪", "反装甲导弹", "标记巢房", "“天窗”防空镭射炮", "全向炸药"]
    .map(n => [`冬痕行动/主战坦克/${n}`, { optional: true }])),
  // 比蒙巨兽「辅助节点」：每个承重点从这些节点类型中选择一种
  ...Object.fromEntries(["机枪阵列", "点防", "猎潜导弹发射器", "炮击阵列", "骇客节点", "飞行甲板", "护盾发生器"]
    .map(n => [`强化战斗/比蒙巨兽/${n}`, { optional: true, set: { name: "辅助节点：" + n } }])),
  // 吸血鬼（蚊的标志性超体）的武器在原书地球化页又印了一次，与地球化无关
  "冷核圆形竞技场/地球化/电子通道獠牙": { drop: true },
  "冷核圆形竞技场/标志性超体：吸血鬼/电子通道獠牙": { prefix: "原文数值：超重型近战，AP，+X，[威胁 1][X 能量伤害]。" },
  "冷核圆形竞技场/地球化/超原胞播种机": { prefix: "原文伤害：[3/5/7 ???伤害]，伤害类型缺失。" },
  "冷核圆形竞技场/标志性超体：技术症候群/清明梦 协定":{ mergeInto: "伊格林高利万物链接" },
  "冬痕行动/主战坦克/全向炸药": { optional: true, set: { attack_bonus: [1, 2, 3] }, prefix: "原文攻击加值为「+1/2/33」，按 +1/2/3 录入。" },
};

function applyFeaturePatches(pack, o, report) {
  for (const [key, p] of Object.entries(FEATURE_PATCHES)) {
    const [pk, on, fn] = key.split("/");
    if (pk !== pack || on !== o.name) continue;
    const list = o.base.find(f => f.name === fn) ? o.base : o.optional;
    const i = list.findIndex(f => f.name === fn);
    if (i < 0) { report.push("FEATURE_PATCHES 找不到 " + key); continue; }
    const f = list[i];
    if (p.set) Object.assign(f, p.set);
    if (p.prefix) f.effect = p.prefix + (f.effect ? "\n" + f.effect : "");
    if (p.drop) list.splice(i, 1);
    else if (p.mergeInto) {
      const all = [...o.base, ...o.optional];
      const t = all.find(x => x.name === p.mergeInto);
      if (!t) { report.push(`FEATURE_PATCHES ${key} 并入目标不存在`); continue; }
      t.effect = [t.effect, `【${f.name}】${f.effect ? "\n" + f.effect : ""}`].filter(Boolean).join("\n");
      list.splice(i, 1);
    } else if (p.optional && list === o.base) {
      // 保持原书顺序，排在可选项最前面
      list.splice(i, 1);
      o._movedToOptional = (o._movedToOptional || 0) + 1;
      o.optional.splice(o._movedToOptional - 1, 0, f);
    }
  }
}

function build() {
  const D = loadBooks();
  const report = [];
  const books = [];
  for (const b of BOOKS) {
    const { classes, templates } = parseBook(D, b, report);
    const src = D.sources.find(s => s.id === b.source);
    for (const o of [...classes, ...templates]) {
      applyFeaturePatches(b.pack, o, report);
      let k = 0;
      o.pack = b.pack;
      o.source = b.source;
      for (const [list, base] of [[o.base, true], [o.optional, false]]) for (const f of list) {
        // 职业与模板的序号各自从 1 开始，特性 id 里要分开（模板加 t）
        f.id = o.id.replace(/^npcc_x_/, "npcf_x_").replace(/^npct_x_/, "npcf_x_t") + "_" + ++k;
        f.base = base;
        const p = STAT_PATCHES[o.name + "/" + f.name];
        if (p) Object.assign(f, p);
      }
    }
    books.push({ source: b.source, code: b.code, pack: b.pack, book: src.name, official: !!b.official, note: b.note || "", classes, templates });
  }
  return { report, data: { _说明: "由 tools/parse-npc-books.js 从 NPC 库的原书文字解析；数值按 T1/T2/T3 排列。", books } };
}

module.exports = { build, BOOKS };

if (require.main === module) {
  const { report, data } = build();
  const only = process.argv.find(a => /^\d+$/.test(a));
  for (const bk of data.books) {
    if (only && String(bk.source) !== only) continue;
    console.log(`\n######## ${bk.pack}（来源 ${bk.source}）职业 ${bk.classes.length}、模板 ${bk.templates.length}`);
    for (const o of [...bk.classes, ...bk.templates]) {
      console.log(`\n## ${o.name}${o.role ? "（" + o.role + (o.special ? "，" + o.special : "") + "）" : "（模板）"} p.${o.pages.join(",")} 基础 ${o.base.length} / 可选 ${o.optional.length}`);
      if (o.stats) console.log("   " + Object.entries(o.stats).map(([k, v]) => k + "=" + v.join("/")).join(" "));
      for (const f of [...o.base, ...o.optional]) {
        const extra = f.type === "Weapon" ? ` ${f.weapon_size}${f.weapon_kind} 加值${f.attack_bonus.join("/")} 准度${f.accuracy.join("/")} ${f.range.map(r => r.type + r.val).join(",")} ${f.damage.map(d => d.val.join("/") + d.type).join("+")}` : "";
        const tags = f.tags.map(x => x.id.replace("tg_", "") + (x.val !== undefined ? x.val : "")).join(",");
        console.log(`  ${f.base ? "基" : "选"} ${f.type.padEnd(8)} ${f.name} [${tags}]${extra}${f.keywords ? " {" + f.keywords.join(",") + "}" : ""} (${(f.effect || "").length}字)`);
        if (process.argv.includes("--text")) {
          if (f.trigger) console.log("      触发：" + f.trigger);
          if (f.effect) console.log("      " + f.effect.replace(/\n/g, "\n      "));
          if (f.on_hit) console.log("      命中：" + f.on_hit);
        }
      }
    }
  }
  // 没有文字的特性：列出原书中名称前的几行，常见原因是版面把效果排在名称前面（用 BOOKS 的 moves 修正）
  if (process.argv.includes("--empty")) {
    const D = loadBooks();
    for (const bk of data.books) {
      const lines = bookLines(D, BOOKS.find(b => b.code === bk.code)).map(x => x.t);
      for (const o of [...bk.classes, ...bk.templates]) for (const f of [...o.base, ...o.optional]) {
        if (f.effect || f.on_hit || f.trigger || (f.type === "Weapon" && f.damage.length)) continue;
        const k = lines.findIndex(l => l === f.name || l.startsWith(f.name + " "));
        console.log(`\n-- ${bk.pack}/${o.name}/${f.name}（${f.type}）\n   ` + lines.slice(Math.max(0, k - 6), k + 3).join("\n   "));
      }
    }
  }
  console.log("\n可疑：" + (report.length ? "\n" + report.join("\n") : "无"));
  if (process.argv.includes("--write")) {
    const strip = o => JSON.parse(JSON.stringify(o, (k, v) => (k.startsWith("_") && k !== "_说明" ? undefined : v)));
    const file = path.join(ROOT, "source/npc/books-npcs.json");
    fs.writeFileSync(file, JSON.stringify(strip(data), null, 1) + "\n");
    console.log("已写入 " + path.relative(ROOT, file));
  }
}
