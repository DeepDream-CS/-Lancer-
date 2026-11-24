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
// 2026-11-24 全量扩展对照核查回归断言
const sys = id => x.systems.find(s => s.id === id);
const wep = id => x.weapons.find(w => w.id === id);
const mod = id => x.mods.find(m => m.id === id);
const tal = id => x.talents.find(t => t.id === id);
assert.equal(sys('ms_ch_falling_star').sp, 2);
assert(!sys('ms_ch_hound').tags.some(t => t.id === 'tg_limited'));
assert(sys('ms_ch_hound').effect.includes('拉动') && sys('ms_ch_hound').effect.includes('每当它本应进入层流时，改为'));
assert.equal(sys('ms_ext_chimney_cold_source').name, '“烟囱”冷源');
assert.equal(mod('wm_ext_hypermass_mod').name, '超巨质量模块');
assert.equal(wep('mw_piof_plasma_caster').name, '等离子投射器');
assert.equal(sys('ms_piof_plasma_tread').name, '等离子胎面');
assert(frame('mf_ext_banshee_vine').core_system.active_effect.includes('若目标因任何原因无法离开驾驶舱或没有驾驶员，则改为<b>晕眩</b>至其下一回合结束'));
assert(!frame('mf_ext_banshee_vine').core_system.active_effect.includes('成功则对方因任何原因无法离开驾驶舱'));
assert(tal('t_ext_bricklayer').ranks[2].html.includes('超出最大 <b>HP</b> 上限的溢出恢复量转化为<b>护盾</b>'));
assert(sys('ms_ext_fallen_mask').effect.includes('使针对他们的一次攻击未命中'));
assert(sys('ms_ext_needle_and_thread').effect.includes('1+毅力'));
assert(tal('t_ext_mind_reader').ranks[2].html.includes('直到该角色下一回合结束前'));
assert(tal('t_ext_blackthumb').ranks[1].html.includes('在你的下一回合无法再次开启马术表演'));
assert(tal('t_ext_pankrati').ranks[2].html.includes('立即以一个<b>反应</b>进行<b>推进</b>'));
assert(sys('ms_spaceborn_1') && sys('ms_spaceborn_1').tags.some(t => t.id === 'tg_indestructible'));
assert.deepEqual(frame('mf_ext_kidd').traits.map(t => t.name), ['快速部署', '能量导流', '回收利用']);
assert.deepEqual(frame('mf_ext_atlas').traits.map(t => t.name), ['巨人杀手', '猎人闪避', '绝杀', '外置反应堆']);
assert.equal(wep('mw_ext_shock_claws').profiles.length, 3);
assert.equal(wep('mw_ext_reversal_loop').profiles.length, 4);
assert.equal(wep('mw_ext_arrow_nexus').profiles.length, 2);
assert.equal(wep('mw_ext_terashima_blade').profiles.length, 5);
assert.equal(wep('mw_ext_hhs155_cannibal').profiles.length, 2);
assert.equal(x.frames.filter(f => f.core_system?.efficient).length, 21);
console.log('PASS expansion source corrections and license references');
