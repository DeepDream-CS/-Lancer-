const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..');
const existing=fs.readFileSync(path.join(root,'tools/test-rules.js'),'utf8');
const harness=existing.slice(0,existing.indexOf('const run=runtime();'));
const mod={exports:{}};new Function('require','__dirname','module',harness+';module.exports=runtime;')(require,__dirname,mod);
const run=mod.exports();
const mapping=JSON.parse(fs.readFileSync(path.join(root,'source/fvtt/official-map.json'),'utf8'));
const reverse=Object.fromEntries(Object.entries(mapping).map(([a,b])=>[b,a]));
const overrides=JSON.parse(fs.readFileSync(path.join(root,'source/fvtt/zh-overrides.json'),'utf8'));
const kinds=['frames','weapons','systems','mods','core_bonuses','talents','pilot_gear'];
const items=JSON.parse(run('JSON.stringify('+JSON.stringify(kinds)+'.flatMap(k=>D[k]))'));
const by=new Map(items.map(x=>[x.id,x]));let count=0;
for(const [id,fields]of Object.entries(overrides)){
 if(id.startsWith('_'))continue;
 const item=by.get(reverse[id]||id);assert(item?.ext,id);
 assert.deepEqual(item.official_supplement.entries.map(x=>x.text),Object.values(fields),id);
 const html=run('officialSupplementHtml('+JSON.stringify(item)+')');assert.match(html,/官方补充说明/);
 for(const text of Object.values(fields)){assert(html.includes(text),id);count++;}
}
assert.equal(run("officialSupplementHtml({id:'empty'})"),'');
assert.match(run("frameRulesHtml(FRAMES.mf_ext_chomolungma)"),/关停平衡控制/);
assert.match(run("equipmentLoreHtml(SYSTEMS.ms_ext_camus_edge)"),/官方补充说明/);
assert.match(run("equipmentLoreHtml(WEAPONS.mw_ext_terashima_blade)"),/官方补充说明/);
console.log(`PASS ${count} supplement fields: exact translations, mapped items and frame/equipment display`);
