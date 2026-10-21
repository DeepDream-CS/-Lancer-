const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const root = require('path').join(__dirname,'..');
function runtime(saved) {
  const storage = new Map(saved ? [['lancer-builder-v1',JSON.stringify(saved)]] : []);
  const el = () => ({innerHTML:'',classList:{toggle(){},add(){},remove(){}},querySelectorAll(){return[];},value:'',style:{}});
  const elements=new Map();
  const ctx = vm.createContext({console, setTimeout, clearTimeout, Blob, URL,
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    document:{body:el(),addEventListener(){},getElementById(id){if(!elements.has(id))elements.set(id,el());return elements.get(id);},querySelectorAll(){return[];}},
    window:{scrollTo(){}},navigator:{},confirm:()=>true});
  for(const file of ['data.js','wizard.js','cardexport.js','rules.js','ui.js','app.js']) vm.runInContext(fs.readFileSync(require('path').join(root,file),'utf8'),ctx,{filename:file});
  return code=>vm.runInContext(code,ctx);
}
const run=runtime(); let passed=0;
function test(name,fn){try{fn();console.log('PASS',name);passed++;}catch(e){console.error('FAIL',name,e);process.exitCode=1;}}
run(`function fixture(ll=0,frame=EVEREST) {const p=blankPilot();p.ll=ll;p.name='规则测试';p.background=D.backgrounds[0].id;p.triggers=D.skills.slice(0,4).map(s=>({id:s.id,custom:'',val:2}));p.hase.hull=2;p.talents=Object.fromEntries(D.talents.slice(0,3).map(t=>[t.id,1]));p.mechs=[blankMech(frame)];db={pilots:[p],current:p.id,ignoreLimits:false};return p;} var p=fixture(),m=p.mechs[0];`);
test('LL0 valid character',()=>assert.equal(run('checks(p).length'),0));
test('All 13 level budgets',()=>{for(let ll=0;ll<=12;ll++)assert.equal(run(`JSON.stringify(LV(${ll}))`),JSON.stringify({grit:Math.ceil(ll/2),skills:2+ll,licenses:ll,talents:3+ll,cbs:Math.floor(ll/3),triggers:8+2*ll}));});
test('29 core frames base/HASE/Grit stats',()=>assert.equal(run(`D.frames.every(f=>{const q=fixture(6,f.id);q.hase={hull:2,agi:2,sys:2,eng:2};const s=mechStats(q,q.mechs[0]);return s.hp===f.stats.hp+7&&s.heatcap===f.stats.heatcap+2&&s.sp===f.stats.sp+4&&s.speed===f.stats.speed+1;})`),true));
test('LL0 forbids rank 3 instead of 3 rank 1 talents',()=>assert(run(`p=fixture();p.talents={[D.talents[0].id]:3};checks(p).some(c=>c[1].includes('三个不同'))`)));
test('LL0 forbids two +4 triggers',()=>assert(run(`p=fixture();p.triggers=p.triggers.slice(0,2).map(t=>({...t,val:4}));checks(p).some(c=>c[1].includes('四个不同'))`)));
test('Main/Aux keeps auxiliary with Main weapon',()=>assert(run(`p=fixture(2,'mf_raleigh');m=p.mechs[0];const mt={type:'Main/Aux'};slotAccepts(mt,1,[{w:'mw_assault_rifle'}]).includes('Auxiliary')`)));
test('Flex rejects Main plus auxiliary',()=>assert.equal(run(`slotAccepts({type:'Flex'},1,[{w:'mw_assault_rifle'}]).length`),0));
test('Superior by Design adds 2 heat cap',()=>assert.equal(run(`p=fixture();m=p.mechs[0];p.coreBonuses=['cb_superior_by_design'];mechStats(p,m).heatcap-FRAMES[m.frame].stats.heatcap`),2));
test('AI cap and Lesson of Shaping',()=>{assert(run(`p=fixture();m=p.mechs[0];m.systems=['ms_comp_con_class_assistant_unit','ms_sekhmet_class_nhp'];loadoutChecks(p,m).some(c=>c[1].includes('AI 数量超限'))`));assert(!run(`p.coreBonuses=['cb_the_lesson_of_shaping'];loadoutChecks(p,m).some(c=>c[1].includes('AI 数量超限'))`));});
test('Engineer and Nuclear Cavalier integrated weapon does not consume mounts',()=>assert.equal(run(`p=fixture(3);m=p.mechs[0];p.talents={t_engineer:3,t_nuclear_cavalier:3};integratedOf(FRAMES[m.frame],p,m).filter(w=>w.mount).length`),2));
test('Integrated talents only grant highest exclusive rank',()=>assert.equal(run(`talentEquipment(p,'integrated').filter(w=>w.id.startsWith('mw_prototype')).map(w=>w.id).join()`),'mw_prototype_3'));
test('Ammo case integrated and cannot be purchased repeatedly',()=>assert(run(`p=fixture();p.talents={t_walking_armory:1};m=p.mechs[0];talentEquipment(p,'integrated').some(x=>x.id==='ms_walking_armory_1')&&!itemAvailable(p,SYSTEMS.ms_walking_armory_1)`)));
test('Technophile only current rank available',()=>assert(run(`p.talents={t_technophile:3};!itemAvailable(p,SYSTEMS.ms_technophile_1)&&itemAvailable(p,SYSTEMS.ms_technophile_3)`)));
test('Enlightenment NHP does not consume AI cap',()=>assert(!run(`m.systems=['ms_technophile_3','ms_comp_con_class_assistant_unit'];loadoutChecks(p,m).some(c=>c[1].includes('AI 数量超限'))`)));
test('Core bonus duplicate rejected',()=>assert(run(`p=fixture();p.coreBonuses=['cb_reinforced_frame','cb_reinforced_frame'];checks(p).some(c=>c[1].includes('不能重复'))`)));
test('Mod type and size validation',()=>assert(run(`!canModify(WEAPONS.mw_assault_rifle,MODS.wm_thermal_charge,{type:'Main'})&&!canModify(WEAPONS.mw_assault_rifle,MODS.wm_stabilizer_mod,{type:'Main'})`)));
test('Tag parameter and Blast translation',()=>assert.equal(run(`tagText({id:'tg_limited',val:3})+' '+rngText([{type:'Blast',val:2}])`),'受限3 溅射2'));
test('Limited bonuses applied to equipment',()=>assert.equal(run(`p=fixture();m=p.mechs[0];p.hase.eng=4;p.coreBonuses=['cb_integrated_ammo_feeds'];limitedTags([{id:'tg_limited',val:3}],p,m)[0].val`),7));
test('Range bonus and weapon mod',()=>assert.equal(run(`p=fixture();m=p.mechs[0];p.coreBonuses=['cb_neurolink_targeting'];effectiveProfile(WEAPONS.mw_mortar,null,MODS.wm_stabilizer_mod,p,m).range.find(r=>r.type==='Range').val`),23));
test('Wrong pilot equipment slot rejected on import',()=>assert.equal(run(`normalizePilot({gear:{armor:'pg_light_signature'}},[]).gear.armor`),''));
test('Imported talents migrated out of ordinary mount',()=>assert(run(`p=fixture();p.talents={t_engineer:1};m=p.mechs[0];m.loadout.m0={slots:[{w:'mw_prototype_1'}],link:''};const q=normalizePilot(p,[]);!q.mechs[0].loadout.m0.slots[0].w&&integratedOf(FRAMES[q.mechs[0].frame],q,q.mechs[0]).some(w=>w.id==='mw_prototype_1')`)));
test('Reload old save preserves pilot ID and wizard step',()=>{const saved=JSON.parse(run(`p=fixture();p.wizard='hase';JSON.stringify(db)`));const reload=runtime(saved);assert.equal(reload('P().id'),saved.current);assert.equal(reload('P().wizard'),'hase');});
test('All frames and all wizard steps render without exceptions',()=>assert(run(`D.frames.every(f=>{p=fixture(12,f.id);m=p.mechs[0];db.ignoreLimits=true;return renderMech(p)&&sheetText(p)&&weaponRows(p,m)&&systemRows(m,p)&&WIZ_STEPS.every(step=>step.body(p));})`)));
test('All weapon profiles, systems and talents render',()=>assert(run(`D.weapons.every(w=>weaponInfo(w))&&D.systems.every(s=>typeof actsHtml(s)==='string')&&progressParts(p).talents.length>0`)));
test('Old save backup retained before migration',()=>{const saved=JSON.parse(run('p=fixture();JSON.stringify(db)'));const reload=runtime(saved);assert.deepEqual(JSON.parse(reload("localStorage.getItem(STORE+'-before-rules-20261021')")),saved);});
test('Accuracy tag without parameter does not display X',()=>assert.equal(run("tagText({id:'tg_accurate'})"),'精准'));
test('Overpower applies to one slot, including PNG summary',()=>assert(run(`p=fixture(3);m=p.mechs[0];p.coreBonuses=['cb_overpower_caliber'];m.loadout.m0={slots:[{w:'mw_assault_rifle',mod:''}],link:''};m.loadout.m1={slots:[{w:'mw_assault_rifle',mod:''},{w:'',mod:''}],link:''};m.overpower='m0|0';weaponRows(p,m).filter(r=>r[5].includes('超功率口径')).length===1`)));
test('Superheavy cannot link its own mount',()=>assert(run(`p=fixture();m=p.mechs[0];m.loadout.m2={slots:[{w:'mw_cyclone_pulse_rifle',mod:''}],link:'m2'};loadoutChecks(p,m).some(c=>c[1].includes('额外挂载点无效'))`)));
test('Cancel frame switch preserves weapons and frame',()=>assert(run(`p=fixture();m=p.mechs[0];m.loadout.m0={slots:[{w:'mw_assault_rifle'}],link:''};confirm=()=>false;!changeFrame(m,'mf_nelson')&&m.frame===EVEREST&&m.loadout.m0.slots[0].w==='mw_assault_rifle'`)));
test('Confirmed frame switch resets mounts and keeps systems',()=>assert(run(`m.systems=['ms_manipulators'];m.overpower='m0|0';confirm=()=>true;changeFrame(m,'mf_nelson')&&m.frame==='mf_nelson'&&Object.keys(m.loadout).length===0&&m.systems[0]==='ms_manipulators'&&m.overpower===''`)));
test('Storage failure preserves in-memory character and shows failure',()=>assert(run(`const oldSet=localStorage.setItem;localStorage.setItem=()=>{throw Error('QuotaExceededError');};const before=JSON.stringify(db),saved=save();localStorage.setItem=oldSet;!saved&&JSON.stringify(db)===before&&document.getElementById('saveStatus').textContent.includes('保存失败')`)));
// ---------- 扩展内容（source/expansions/all-expansions.js） ----------
test('Expansion content merged and marked',()=>assert.equal(run("['frames','talents','backgrounds','core_bonuses','pilot_gear','weapons','systems'].map(k=>D[k].filter(x=>x.ext).length).join()"),'16,7,5,1,1,9,10'));
test('Variant frame follows base license II',()=>assert(run("p=fixture(2);!frameAvailable(p,FRAMES.mf_ext_empakaai)&&(p.licenses={mf_blackbeard:2},frameAvailable(p,FRAMES.mf_ext_empakaai))&&!frameAvailable(p,FRAMES.mf_ext_stortebeker)")));
test('Everest variants free at LL0',()=>assert(run("p=fixture();frameAvailable(p,FRAMES.mf_ext_chomolungma)&&frameAvailable(p,FRAMES.mf_ext_sagarmatha)")));
test('Variants have no license of their own',()=>assert(run("!licenseFrames().some(f=>f.variant_of)&&licenseFrames().some(f=>f.id==='mf_ext_gilgamesh')&&!('mf_ext_lycan' in normalizePilot({licenses:{mf_ext_lycan:2,mf_manticore:2}},[]).licenses)")));
test('New license frames gate their gear',()=>assert(run("p=fixture(3);!itemAvailable(p,WEAPONS.mw_ext_legionnaire_rifle)&&(p.licenses={mf_ext_gilgamesh:1},itemAvailable(p,WEAPONS.mw_ext_legionnaire_rifle)&&!itemAvailable(p,SYSTEMS.ms_ext_multirole_drone))&&!itemAvailable(p,SYSTEMS.ms_ext_human_error)")));
test('Gilgamesh adds +1 limited charge',()=>assert.equal(run("p=fixture(2,'mf_ext_gilgamesh');m=p.mechs[0];p.hase.eng=2;limitedTags([{id:'tg_limited',val:3}],p,m)[0].val"),5));
test('Iconoclast NHP outside AI cap; expansion talents have 3 ranks',()=>assert(run("p=fixture();p.talents={t_ext_iconoclast:1};m=p.mechs[0];m.systems=['ms_ext_unstable_nhp','ms_comp_con_class_assistant_unit'];itemAvailable(p,SYSTEMS.ms_ext_unstable_nhp)&&!loadoutChecks(p,m).some(c=>c[1].includes('AI'))&&D.talents.filter(t=>t.ext).every(t=>t.ranks.length===3&&Z.talents[t.name].ranks.every(r=>r.html))&&normalizePilot({talents:{t_ext_iconoclast:3,t_ext_sysop:2}},[]).talents.t_ext_iconoclast===3")));
test('Superheavy Mounting adds a superheavy mount below 3 mounts',()=>assert(run("p=fixture(3,'mf_ext_kidd');p.coreBonuses=['cb_ext_superheavy_mounting'];m=p.mechs[0];const ms=mountsOf(p,m);ms.some(x=>x.key==='sh'&&x.type==='Superheavy')&&(p.mechs[0]=blankMech(EVEREST),!mountsOf(p,p.mechs[0]).some(x=>x.key==='sh'))")));
test('Superheavy Mounting must link the heavy mount when present',()=>{
  assert(run("p=fixture(3,'mf_manticore');p.coreBonuses=['cb_ext_superheavy_mounting'];m=p.mechs[0];m.loadout.sh={slots:[{w:'mw_ext_tempest_charged_blade',mod:''}],link:'m0'};loadoutChecks(p,m).some(c=>c[1].includes('额外挂载点无效'))"));
  assert(run("m.loadout.sh.link='m1';!loadoutChecks(p,m).some(c=>c[1].includes('额外挂载点无效'))&&equippedWeapons(p,m).some(e=>e.w.id==='mw_ext_tempest_charged_blade')"));
});
test('Expansion background triggers resolve for wizard',()=>assert.equal(run("p=fixture();p.background='pbg_ext_noble_heir';bgSuggestedSkills(p).length"),4));
console.log(passed+' regression checks passed.');
