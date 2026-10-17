// 把标准输入中的 JSON 译文合并进 source/i18n/zh/<文件>.json：node tools/i18n-add.js <文件名> < 译文.json
const fs = require("fs");
const path = require("path");

const name = process.argv[2];
const file = path.join(__dirname, "../source/i18n/zh", name + ".json");
const cur = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
const add = JSON.parse(fs.readFileSync(0, "utf8"));
Object.assign(cur, add);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(cur, null, 1) + "\n");
console.log(name, "+", Object.keys(add).length, "→", Object.keys(cur).length);
