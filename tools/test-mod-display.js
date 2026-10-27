const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.join(__dirname, '..');
const el = () => ({ innerHTML: '', classList: { toggle() {}, add() {}, remove() {} }, querySelectorAll() { return []; }, value: '', style: {} });
const elements = new Map(), storage = new Map();
const ctx = vm.createContext({
  console, setTimeout, clearTimeout, Blob, URL,
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  document: { body: el(), addEventListener() {}, querySelectorAll() { return []; }, getElementById(id) { if (!elements.has(id)) elements.set(id, el()); return elements.get(id); } },
  window: { scrollTo() {} }, navigator: {}, confirm: () => true,
});
for (const file of ['data.js', 'wizard.js', 'cardexport.js', 'rules.js', 'glossary.js', 'ui.js', 'frame-catalog.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file });
}
const run = code => vm.runInContext(code, ctx);
run(`
  var p = blankPilot(); p.ll = 6; p.hase = {hull:4, agi:2, sys:0, eng:0};
  p.licenses = {mf_nelson:2}; p.mechs = [blankMech()];
  var m = p.mechs[0]; m.loadout.m0 = {slots:[{w:'mw_tactical_melee',mod:'wm_thermal_charge'}],link:''};
  // Resolve a core main melee weapon by type, without depending on its display name.
  m.loadout.m0.slots[0].w = D.weapons.find(w => w.source === 'GMS' && w.mount === 'Main' && w.type === 'Melee').id;
  db = {pilots:[p],current:p.id,ignoreLimits:false};
`);
let passed = 0;
function test(name, check) { check(); passed++; console.log('PASS', name); }

test('Equipped mod shows its base charges without opening weapon effects', () => {
  const html = run('renderMech(p)');
  assert.match(html, /weapon-mod-meta[^]*?受限3/);
  assert.match(html, /value="wm_thermal_charge"[^>]*>[^<]*\[受限3\]/);
});
test('Engineering updates UI, text summary and PNG tags', () => {
  run('p.hase.eng=2');
  assert.match(run('renderMech(p)'), /weapon-mod-meta[^]*?受限4/);
  assert.match(run('sheetText(p)').split('规则详述（')[0], /模块：[^\n]*受限4/);
  assert.match(run('weaponRows(p,m)[0][4]'), /模块受限4/);
});
test('Core bonus charges stack with engineering exactly once', () => {
  run("p.hase.eng=4;p.coreBonuses=['cb_integrated_ammo_feeds']");
  assert.match(run('renderMech(p)'), /weapon-mod-meta[^]*?受限7/);
  assert.match(run('weaponRows(p,m)[0][4]'), /模块受限7/);
});
test('Exports use each mech\'s bonuses rather than the active mech', () => {
  run("p.hase.eng=2;p.coreBonuses=[];var other=blankMech('mf_ext_gilgamesh');other.loadout.m0={slots:[{...m.loadout.m0.slots[0]}],link:''};p.mechs.push(other)");
  assert.match(run('weaponRows(p,other)[0][4]'), /模块受限5/);
  assert.match(run('weaponRows(p,m)[0][4]'), /模块受限4/);
  assert.match(run('sheetText(p)'), /模块：[^\n]*受限5/);
});
test('Mod charges never turn the base weapon into a limited weapon', () => {
  assert.equal(run("effectiveProfile(WEAPONS[m.loadout.m0.slots[0].w],null,MODS.wm_thermal_charge,p,m).tags.some(t=>t.id==='tg_limited')"), false);
  assert.equal(run("MODS.wm_thermal_charge.tags.find(t=>t.id==='tg_limited').val"), 3);
});
test('Removing a mod removes its charge display', () => {
  run("m.loadout.m0.slots[0].mod=''");
  assert.doesNotMatch(run('renderMech(p)'), /weapon-mod-meta/);
  assert.doesNotMatch(run('weaponRows(p,m)[0][4]'), /模块受限/);
});
test('Unlimited mods retain their tags without inventing charge counts', () => {
  run("m.loadout.m0.slots[0].mod='wm_ch_adaptive_weight'");
  assert.match(run('renderMech(p)'), /weapon-mod-meta/);
  assert.doesNotMatch(run('weaponRows(p,m)[0][4]'), /模块受限/);
});
test('Shield drone clearly resolves before its triggering attack', () => {
  const text = run('SYSTEMS.ms_ch_shield_array.effect');
  assert.match(text, /此反应优先于触发它的攻击结算。阵列移动完成后，再继续结算该次攻击。/);
  assert.doesNotMatch(text, /中断触发/);
});
console.log(`${passed} mod display checks passed`);
