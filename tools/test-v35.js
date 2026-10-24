const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const {spec,translator}=require('./core-v35');const c={window:{}};vm.runInNewContext(fs.readFileSync('data.js','utf8'),c);const full=c.window.LANCER_DATA,nk=s=>s.replace(/’/g,"'");let n=0;
// 扩展内容（ext:true，见 source/expansions）由 test-rules.js 检查；以下断言只针对核心规则书数据。
function stripExt(d){const core={...d,zh:{...d.zh}},ext=k=>d[k].filter(x=>x.ext);
  const coreMakerIds=new Set(JSON.parse(fs.readFileSync('source/lancer-data/manufacturers.json','utf8')).map(m=>m.id));
  core.manufacturers=d.manufacturers.filter(m=>coreMakerIds.has(m.id));
  core.zh.makers=Object.fromEntries(Object.entries(d.zh.makers).filter(([id])=>coreMakerIds.has(id)));
  for(const k of ['frames','weapons','systems','mods','core_bonuses','talents','pilot_gear','skills','backgrounds'])core[k]=d[k].filter(x=>!x.ext);
  for(const [kind,map,key] of [['frames','frames',x=>x.name],['talents','talents',x=>x.name],['backgrounds','bg',x=>x.name.toLowerCase()],['core_bonuses','cb',x=>x.name],['pilot_gear','gear',x=>x.name]]){
    core.zh[map]={...d.zh[map]};ext(kind).forEach(x=>delete core.zh[map][key(x)]);
  }
  delete core.ext_rules;
  return core;}
const d=stripExt(full);
for(const row of spec.names){const x=d[row.kind].find(x=>row.id?x.id===row.id:nk(x.name)===nk(row.en));assert(x,row.en);
  const map={frames:'frames',core_bonuses:'cb',pilot_gear:'gear',skills:'skills',backgrounds:'bg'}[row.kind];
  const key=['skills','backgrounds'].includes(row.kind)?x.name.toLowerCase():row.kind==='pilot_gear'?x.name:nk(x.name);
  const actual=map?(typeof d.zh[map][key]==='string'?d.zh[map][key]:d.zh[map][key].name):x.zh_name;assert.equal(actual,row.name,row.en);n++;
}
for(const t of spec.talents){assert.equal(d.zh.talents[t.en].name,t.name);assert.deepEqual(Array.from(d.zh.talents[t.en].ranks,r=>r.name),t.ranks);n+=4;}
for(const f of spec.fields){const x=d[f.kind].find(x=>x.id===f.id);assert.equal(f.path.split('.').reduce((o,k)=>o[k],x),f.value);n++;}
function shape(v){if(typeof v==='string')return '<text>';if(Array.isArray(v))return v.map(shape);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,shape(x)]));return v;}
assert.equal(crypto.createHash('sha256').update(JSON.stringify(shape(d))).digest('hex'),require('../source/core-v35-numeric-baseline.json').sha256,'数值或数据结构发生变化');
for(const kind of ['frames','weapons','systems','mods','core_bonuses','talents','pilot_gear','skills','backgrounds']){
 const raw=JSON.parse(fs.readFileSync(`source/lancer-data/${kind}.json`));
 assert.deepEqual(Array.from(d[kind],x=>[x.id,x.name]),raw.map(x=>[x.id,x.name]),kind+'的ID/英文查找名变化');
}
for(const term of spec.terms)assert(!JSON.stringify(full).includes(term.from),`仍有旧术语 ${term.from}`);
const tr=translator([['重机枪','重型机枪'],['主观性强化套装','主观性增强套装']]);assert.equal(tr('重机枪、重型机枪'),'重型机枪、重型机枪');
console.log(`PASS ${n} translation assertions; numeric structure, stable IDs, lookup names and terminology verified.`);
