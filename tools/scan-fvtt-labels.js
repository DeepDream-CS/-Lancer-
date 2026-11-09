#!/usr/bin/env node
// 扫描 foundryvtt-lancer 模板与界面代码里写死的英文文字（不经语言文件的标签）。
// 用法：node tools/scan-fvtt-labels.js <foundryvtt-lancer 目录> [--write]
//   不加 --write 只列出与快照 source/fvtt/module/hardcoded-en.json 的差异；
//   加 --write 更新快照。译文写在 source/fvtt/module/cn-hardcoded.json。
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SNAP = path.join(ROOT, "source/fvtt/module/hardcoded-en.json");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// 一段文字是否值得翻译：含两个以上英文字母的词，不是代码、路径、CSS 类名。
function wanted(s) {
  if (!/[A-Za-z]{2,}/.test(s)) return false;
  if (/^[\w.-]+\.(hbs|svg|png|webp|js|css)$/.test(s)) return false;
  if (/[{};=]|=>|\(\)|\bfunction\b|&&|\|\|/.test(s)) return false;
  if (/^[a-z]+([A-Z][a-z]+)+$/.test(s)) return false; // camelCase
  if (/^[a-z0-9_-]+$/.test(s) && /[-_]/.test(s)) return false; // css-class / snake_case
  if (/^(px|em|rem|div|span|true|false|null|undefined|none|auto|i|fa|mdi)$/i.test(s)) return false;
  if (/^[\w-]+(\.[\w{}-]+)+\.?$/.test(s)) return false; // 语言文件键、数据路径（Foundry 会自行翻译）
  if (/^(cci|mdi|fas|far|fa-)[\w -]*$/.test(s)) return false; // 图标类
  return true;
}

const norm = s => s.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

// 从一段 HTML 中取出文字节点与可见属性。expr 是表达式的正则（换成 {x}）。
function fromHtml(src, expr) {
  const found = [];
  const body = src
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "");
  // 属性
  const attrRe = /\b(title|placeholder|data-tooltip|aria-label|label|alt)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = attrRe.exec(body))) {
    const v = norm(m[2].replace(expr, "{x}"));
    if (wanted(v.replace(/\{x\}/g, ""))) found.push({ kind: "attr", text: v, at: m.index });
  }
  // 文字节点：去掉标签后按标签边界切开
  const noTags = body.replace(/<[^>]*>/g, "\u0000");
  let pos = 0;
  for (const seg of noTags.split("\u0000")) {
    const at = noTags.indexOf(seg, pos);
    pos = at + seg.length;
    // 去掉块语法行（{{#if}} / {#if} 等）后，表达式换成 {x}
    let t = seg.replace(expr, m0 => (/^\{\{?\s*[#/:^!>]|^\{\{?\s*else\b/.test(m0) ? "\u0001" : "{x}"));
    for (const piece of t.split("\u0001")) {
      const v = norm(piece);
      if (v && wanted(v.replace(/\{x\}/g, ""))) found.push({ kind: "text", text: v, at });
    }
  }
  return found;
}

const TPL_EXPR = /\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/g;
// 字面量前面的上下文：通知、对话框 / 窗口 / 聊天卡的标题、按钮文字、提示等
const CONTEXT = new RegExp(
  "(?:notifications[!?]*\\.(?:info|warn|error)\\(\\s*" +
    "|\\b(?:title|label|hint|desc|description|content|name|text|tooltip|flavor|subtitle|header|human)\\s*[:=]\\s*" +
    "|\\b(?:title|label|desc|description|content)\\s*[:=]\\s*[^,;\\n]*\\?\\s*[^,;\\n]*:\\s*)$"
);

const lineOf =(src, at) => src.slice(0, at).split("\n").length;

function scan(fork) {
  const results = new Map(); // text -> Set(file:line)
  const add = (text, where) => {
    if (!results.has(text)) results.set(text, new Set());
    results.get(text).add(where);
  };
  const rel = p => path.relative(fork, p).replace(/\\/g, "/");

  for (const f of walk(path.join(fork, "public/templates")).filter(f => f.endsWith(".hbs"))) {
    const src = fs.readFileSync(f, "utf8");
    for (const r of fromHtml(src, /\{\{\{?[\s\S]*?\}?\}\}/g)) add(r.text, `${rel(f)}:${lineOf(src, r.at)}`);
    // 助手调用的字符串参数，例如 {{{clicker-stat-card "ARMOR" ...}}}
    const callRe = /\{\{\{?\s*([a-z][\w-]*)\b([^}]*)\}?\}\}/g;
    let c;
    while ((c = callRe.exec(src))) {
      if (/^(localize|lancer-|select|if|unless|each|with|else|eq|ne|lookup|concat)$/.test(c[1])) continue;
      for (const a of c[2].matchAll(/"([^"]*)"/g)) {
        const v = norm(a[1]);
        if (/[A-Z]/.test(v) && !/^[A-Z][a-z]+([A-Z][a-z]+)+$/.test(v) && wanted(v)) add(v, `${rel(f)}:${lineOf(src, c.index)}`);
      }
    }
  }
  for (const f of walk(path.join(fork, "src/module")).filter(f => f.endsWith(".svelte"))) {
    const src = fs.readFileSync(f, "utf8");
    for (const r of fromHtml(src, /\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/g)) add(r.text, `${rel(f)}:${lineOf(src, r.at)}`);
  }
  // TS：模板字符串里的 HTML
  for (const f of walk(path.join(fork, "src/module")).filter(f => f.endsWith(".ts") && !f.endsWith(".d.ts"))) {
    const src = fs.readFileSync(f, "utf8");
    const tplRe = /`((?:[^`\\]|\\.)*)`/g;
    let m;
    while ((m = tplRe.exec(src))) {
      const s = m[1];
      if (!/<[a-z][^>]*>/i.test(s)) continue;
      for (const r of fromHtml(s, TPL_EXPR)) {
        add(r.text, `${rel(f)}:${lineOf(src, m.index + 1 + r.at)}`);
      }
    }
  }
  // TS / Svelte：提示消息、窗口标题、按钮、聊天卡标题等属性里的纯文字
  for (const f of walk(path.join(fork, "src/module")).filter(f => /\.(ts|svelte)$/.test(f) && !f.endsWith(".d.ts"))) {
    const src = fs.readFileSync(f, "utf8");
    const litRe = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
    let m;
    while ((m = litRe.exec(src))) {
      const raw = m[1] ?? m[2] ?? m[3];
      if (/<[a-z][^>]*>/i.test(raw)) continue; // HTML 已在上面处理
      const before = src.slice(Math.max(0, m.index - 60), m.index);
      if (!CONTEXT.test(before)) continue;
      const v = norm(raw.replace(TPL_EXPR, "{x}").replace(/\\(.)/g, "$1"));
      if (wanted(v.replace(/\{x\}/g, ""))) add(v, `${rel(f)}:${lineOf(src, m.index)}`);
    }
  }
  const out = {};
  for (const k of [...results.keys()].sort()) out[k] = [...results.get(k)].sort();
  return out;
}

if (require.main === module) {
  const fork = process.argv[2];
  if (!fork || !fs.existsSync(path.join(fork, "public/templates"))) {
    console.error("用法：node tools/scan-fvtt-labels.js <foundryvtt-lancer 目录> [--write]");
    process.exit(1);
  }
  const now = scan(fork);
  if (process.argv.includes("--write")) {
    fs.writeFileSync(SNAP, JSON.stringify(now, null, 2) + "\n");
    console.log(`已写入 ${path.relative(ROOT, SNAP)}：${Object.keys(now).length} 条`);
  } else {
    const old = fs.existsSync(SNAP) ? JSON.parse(fs.readFileSync(SNAP, "utf8")) : {};
    const added = Object.keys(now).filter(k => !(k in old));
    const gone = Object.keys(old).filter(k => !(k in now));
    console.log(`当前 ${Object.keys(now).length} 条；新增 ${added.length}，消失 ${gone.length}`);
    for (const k of added) console.log("+ " + JSON.stringify(k) + "  " + now[k][0]);
    for (const k of gone) console.log("- " + JSON.stringify(k));
  }
}

module.exports = { scan };
