const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.join(__dirname,'..'),storage=new Map();
const el=()=>({innerHTML:'',classList:{toggle(){},add(){},remove(){}},querySelectorAll(){return[];},value:'',style:{}});
const elements=new Map();
const ctx=vm.createContext({console,setTimeout,clearTimeout,URL,Blob,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{body:el(),addEventListener(){},querySelectorAll(){return[];},getElementById(id){if(!elements.has(id))elements.set(id,el());return elements.get(id);}},window:{scrollTo(){},addEventListener(){}},navigator:{},confirm:()=>true});
for(const file of ['data.js','wizard.js','cardexport.js','rules.js','glossary.js','ui.js','frame-catalog.js','battlemap.js','app.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
const run=code=>vm.runInContext(code,ctx);let passed=0;
function test(name,fn){fn();console.log('PASS',name);passed++;}
run("var fixPilot=blankPilot();fixPilot.ll=6;fixPilot.hase.eng=2;fixPilot.mechs=[blankMech('mf_barbarossa')];db={pilots:[fixPilot],current:fixPilot.id,ignoreLimits:false};var fixMech=fixPilot.mechs[0];");
test('All ammo case ranks expose adjusted charges, not a one-shot limit',()=>{
 for(let r=1;r<=3;r++) {
  run(`fixPilot.talents={t_walking_armory:${r}}`);
  assert.match(run('renderMech(fixPilot)'),/内建：弹药库[^]*?0 SP[^]*?受限7/);
  assert.match(run('sheetText(fixPilot)').split('规则详述（')[0],/弹药库[^\n]*受限7/);
  assert.match(run('JSON.stringify(systemRows(fixMech,fixPilot))'),/受限7/);
 }
 assert.match(run("actsHtml(SYSTEMS.ms_walking_armory_2)"),/2充能/);
 assert.match(run("SYSTEMS.ms_walking_armory_3.effect"),/会心/);
});
test('Barbarossa has a paid quick activation and consistent countdown name',()=>{
 const text=run('renderMech(fixPilot)');
 assert.match(text,/快速动作[^]*?1 CP/);
 assert.match(text,/末日骰/);assert.doesNotMatch(text,/天启骰|末日殿|末日股/);
 assert.match(text,/初始数值为4/);
});
test('Roller distinguishes grenade and mine, and preserves both costs',()=>{
 assert.doesNotMatch(run("tagsPlain(systemTags(SYSTEMS.ms_roller_directed_payload_charges,fixPilot,fixMech))"),/榴弹/);
 const text=run('actsHtml(SYSTEMS.ms_roller_directed_payload_charges)');
 assert.match(text,/手榴弹，线形10/);assert.match(text,/地雷，智慧，爆发1/);
 assert.equal((text.match(/消耗1充能/g)||[]).length,2);
 assert.match(text,/大小1及以下/);assert.match(text,/容纳大小½/);
});
test('Drone action metadata reaches screen, search, text and PNG exports',()=>{
 run("fixMech.systems=['ms_turret_drones','ms_autoloader_drone']");
 for(const id of ['ms_turret_drones','ms_autoloader_drone','ms_hive_drone','ms_lotus_projector']) {
  assert.match(run(`tagsPlain(systemTags(SYSTEMS.${id},fixPilot,fixMech))`),/快速动作/);
  assert.match(run(`systemSearchText(SYSTEMS.${id})`),/快速动作/);
  assert.match(run(`itemHoverText(SYSTEMS.${id})`),/快速动作/);
 }
 assert.match(run('sheetText(fixPilot)'),/炮塔无人机\([^\n]*快速动作/);
 assert.match(run('JSON.stringify(systemRows(fixMech,fixPilot))'),/快速动作/);
 assert.match(run('actsHtml(SYSTEMS.ms_autoloader_drone)'),/快速动作部署/);
 assert.match(run('tagsPlain(systemTags(SYSTEMS.ms_pl_sentry_drone,fixPilot,fixMech))'),/完整动作/);
 assert.doesNotMatch(run('tagsPlain(systemTags(SYSTEMS.ms_pl_sentry_drone,fixPilot,fixMech))'),/快速动作/);
});
test('Cancel reset preserves the character, including any previous undo',()=>{
 const before=run('JSON.stringify(fixPilot)');
 run('confirm=()=>false');assert.equal(run("resetBuildPoints(fixPilot,'all')"),false);
 assert.equal(run('JSON.stringify(fixPilot)'),before);run('confirm=()=>true');
});
test('Each reset affects only the requested points and undo restores them',()=>{
 run("fixPilot.talents={t_walking_armory:3};fixPilot.licenses={mf_barbarossa:3};fixPilot.coreBonuses=['cb_overpower_caliber'];fixPilot.hase={hull:2,agi:2,sys:2,eng:2};fixPilot.professionalLicenses=[{id:'test',rank:1,rewardRanks:1}];fixPilot.extraLicenseRanks=2");
 for(const [scope,key] of [['talents','talents'],['licenses','licenses'],['core','coreBonuses'],['hase','hase']]) {
  const before=JSON.parse(run('JSON.stringify(fixPilot)'));
  assert.equal(run(`resetBuildPoints(fixPilot,'${scope}')`),true);
  const after=JSON.parse(run('JSON.stringify(fixPilot)'));
  assert.notDeepEqual(after[key],before[key]);delete after[key];delete before[key];assert.deepEqual(after,before);
  assert.equal(run('undoBuildReset(fixPilot)'),true);
 }
});
test('Full rebuild is reversible, character-scoped, saved and leaves equipment intact',()=>{
 const before=run('JSON.stringify(fixPilot)');run("resetBuildPoints(fixPilot,'all')");
 assert.equal(run('Object.values(fixPilot.hase).reduce((a,b)=>a+b,0)'),0);
 assert.equal(run('Object.keys(fixPilot.talents).length+Object.keys(fixPilot.licenses).length+fixPilot.coreBonuses.length'),0);
 assert.match(run('renderProgress(fixPilot)'),/撤销上次重置/);
 run('save()');assert.equal(JSON.parse(storage.get('lancer-builder-v1')).pilots[0].ll,6);
 assert.equal(run('undoBuildReset(blankPilot())'),false);
 run('confirm=()=>false');assert.equal(run('undoBuildReset(fixPilot)'),false);run('confirm=()=>true');
 assert.equal(run('undoBuildReset(fixPilot)'),true);assert.equal(run('JSON.stringify(fixPilot)'),before);
 assert.equal(run('undoBuildReset(fixPilot)'),false);
});
console.log(`${passed} core correction checks passed`);
