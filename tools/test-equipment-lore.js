const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..');
const existing=fs.readFileSync(path.join(root,'tools/test-rules.js'),'utf8');
const harness=existing.slice(0,existing.indexOf('const run=runtime();')).replace("'assets/js/data.js','assets/js/wizard.js'","'assets/js/data.js','assets/js/equipment-lore.js','assets/js/wizard.js'");
const mod={exports:{}};new Function('require','__dirname','module',harness+';module.exports=runtime;')(require,__dirname,mod);
const run=mod.exports();
run("var lp=blankPilot();lp.ll=6;lp.licenses={mf_barbarossa:3};lp.mechs=[blankMech('mf_barbarossa')];lp.mechs[0].systems=['ms_flak_launcher'];db={pilots:[lp],current:lp.id,ignoreLimits:false}");
assert.match(run('renderMech(lp)'),/风味文本/);
assert.match(run('renderMech(lp)'),/近迫或撞击引信/);
assert.match(run("weaponInfo(WEAPONS.mw_chain_axe,null,lp,lp.mechs[0])"),/伐木工具/);
assert.match(run("weaponEffectHtml(WEAPONS.mw_chain_axe)"),/伐木工具/);
assert.match(run("equipmentLoreHtml(SYSTEMS.ms_autoloader_drone)"),/多肢体/);
assert.equal(run("equipmentLoreHtml({id:'not-an-item'})"),'');
assert.match(run("equipmentLoreHtml({id:'test',description:'<script>unsafe</script>'})"),/unsafe/);
assert.doesNotMatch(run("equipmentLoreHtml({id:'test',description:'<script>unsafe</script>'})"),/<script>/);
const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/equipment-lore.js'),'utf8'),c);
const data={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/data.js'),'utf8'),data);
const all=data.window.LANCER_DATA;const ids=new Set(['weapons','systems','mods'].flatMap(k=>all[k].map(x=>x.id)));
for(const [id,v] of Object.entries(c.window.LANCER_LORE.items)){assert(ids.has(id),id);assert(v.text.trim(),id);assert(['zh','en'].includes(v.lang),id);}
// Verify GMS T-2 thermal weapons have the complete T-2 paragraph and Lore Codex deduplicates GMS series cleanly
for(const id of ['mw_thermal_lance','mw_thermal_pistol','mw_thermal_rifle']) {
  assert(c.window.LANCER_LORE.items[id].text.includes('GMS T-2能量武器'), `${id} should include full T-2 energy weapon lore`);
}
assert.match(run("equipmentLoreHtml(WEAPONS.mw_assault_rifle)"), /GMS 一型（T-1）系列共用/);
assert.match(run("equipmentLoreHtml(WEAPONS.mw_thermal_rifle)"), /GMS 二型（T-2）系列共用/);
assert.match(run("equipmentLoreHtml(WEAPONS.mw_anti_materiel_rifle)"), /GMS 三型（T-3）系列共用/);
assert(run(`(()=>{
  const cat=buildLoreCatalog();
  const merged=visibleLoreEntries({cat:'weapon',q:'',maker:'GMS',src:'',ownedOnly:false,mergeShared:true},lp);
  const expanded=visibleLoreEntries({cat:'weapon',q:'',maker:'GMS',src:'',ownedOnly:false,mergeShared:false},lp);
  const t2=merged.find(e=>e.id==='gms_series_t2');
  const dossiers=visibleLoreEntries({cat:'dossier',q:'黑巫蛾',maker:'',src:'',ownedOnly:false,mergeShared:true},lp);
  const hitByMember=visibleLoreEntries({cat:'weapon',q:'反器材步枪',maker:'',src:'',ownedOnly:false,mergeShared:true},lp);
  return merged.length===5 && expanded.length===23 && t2 && t2.members.length===5 &&
    dossiers.some(e=>e.id==='dossier:mf_black_witch'&&e.dossierSections.length>=4) &&
    hitByMember.some(e=>e.id==='gms_series_t3') && cat.byId.has('dossier:gms_core');
})()`), 'Lore Codex GMS deduplication, license dossiers and member search');
console.log('PASS lore on equipped systems, weapons, Lore Codex GMS deduplication and license dossiers');
