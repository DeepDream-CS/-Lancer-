const assert = require('assert/strict');
const x = require('../source/expansions/all-expansions.js');
const frame = id => x.frames.find(f => f.id === id);
const mk = x.weapons.find(w => w.id === 'mw_ext_wodeng_mk12');
assert(frame('mf_ext_sicklewing').core_system.passive_effect.includes('2AP 动能伤害'));
assert(!frame('mf_ext_sicklewing').core_system.passive_effect.includes('2AP 能量伤害'));
assert.equal(frame('mf_ext_sicklewing').traits[0].name, '曲跃鞘跟');
assert(frame('mf_ext_sicklewing').core_system.active_effect.includes('邻近黑猫'));
assert(!mk.profiles[1].tags.some(t => t.id === 'tg_ordnance'));
assert(mk.profiles[0].tags.some(t => t.id === 'tg_ordnance'));
assert(!mk.effect.includes('目标可以立即'));
assert(mk.profiles[1].effect.includes('目标可以立即'));
assert(mk.profiles[1].tags.some(t => t.id === 'tg_reliable' && t.val === 4));
assert(x.systems.find(s => s.id === 'ms_ext_fallen_mask').effect.includes('恢复后的 HP'));
// 2026-11-09 依英文原文确认的三处（计时单位、漏译）
const saladin = JSON.stringify(frame('mf_ext_saladin_dread'));
assert(saladin.includes('此反应每轮最多使用两次') && !saladin.includes('每回合中进行两次'));
const plating = x.systems.find(s => s.id === 'ms_ext_evaporative_cooling_plating').effect;
assert(plating.includes('并即将受到<b>热度</b>时') && plating.includes('将本次受到的<b>热度</b>减少'));
const pemada = frame('mf_ch_pemada').traits[0].description;
assert(pemada.startsWith('每轮任何次数') && pemada.includes('恰好等于佩马刀者的<b>回避</b>'));
const names = ['米切尔','幽灵','哈勃','法罗斯','镰翅蛾','羽蛇','为朝','沃登'];
const variants = ['布莱','夹竹桃蛾','哈布斯堡','火蜥蜴','史泰钦'];
assert.equal(x.frames.filter(f => [...names,...variants].includes(f.name)).length,13);
for (const kind of ['weapons','systems','mods']) {
 const entries = x[kind].filter(e => names.includes(e.license));
 console.log(kind + ': ' + entries.length);
 for (const e of entries) {
  assert(x.frames.some(f => f.name === e.license));
  assert([1,2,3].includes(e.license_level));
 }
}
console.log('PASS expansion source corrections and license references');
