const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const root = require('path').join(__dirname,'..');
function runtime(saved) {
  const storage = new Map(saved ? [['lancer-builder-v1',JSON.stringify(saved)]] : []);
  const el = () => ({innerHTML:'',classList:{toggle(){},add(){},remove(){}},querySelectorAll(){return[];},value:'',style:{}});
  const elements=new Map();
  const ctx = vm.createContext({console, setTimeout, clearTimeout, Blob, URL,
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    document:{body:el(),addEventListener(){},getElementById(id){if(!elements.has(id))elements.set(id,el());return elements.get(id);},querySelectorAll(){return[];}},
    window:{scrollTo(){},addEventListener(){}},navigator:{},confirm:()=>true});
  for(const file of ['assets/js/data.js','assets/js/wizard.js','assets/js/cardexport.js','assets/js/rules.js','assets/js/glossary.js','assets/js/ui.js','assets/js/frame-catalog.js','assets/js/system-library.js','assets/js/battlemap.js','assets/js/app.js']) vm.runInContext(fs.readFileSync(require('path').join(root,file),'utf8'),ctx,{filename:file});
  return code=>vm.runInContext(code,ctx);
}
const run=runtime(); let passed=0;
function test(name,fn){try{fn();console.log('PASS',name);passed++;}catch(e){console.error('FAIL',name,e);process.exitCode=1;}}
run(`function fixture(ll=0,frame=EVEREST) {const p=blankPilot();p.ll=ll;p.name='规则测试';p.background=D.backgrounds[0].id;p.triggers=D.skills.slice(0,4).map(s=>({id:s.id,custom:'',val:2}));p.hase.hull=2;p.talents=Object.fromEntries(D.talents.slice(0,3).map(t=>[t.id,1]));p.mechs=[blankMech(frame)];db={pilots:[p],current:p.id,ignoreLimits:false};return p;} var p=fixture(),m=p.mechs[0];`);
test('LL0 valid character',()=>assert.equal(run('checks(p).length'),0));
test('All 13 level budgets',()=>{for(let ll=0;ll<=12;ll++)assert.equal(run(`JSON.stringify(LV(${ll}))`),JSON.stringify({grit:Math.ceil(ll/2),skills:2+ll,licenses:ll,talents:3+ll,cbs:Math.floor(ll/3),triggers:8+2*ll}));});
test('29 core frames base/HASE/Grit stats',()=>assert.equal(run(`D.frames.filter(f=>!f.ext).every(f=>{const q=fixture(6,f.id);q.hase={hull:2,agi:2,sys:2,eng:2};const s=mechStats(q,q.mechs[0]);return s.hp===f.stats.hp+7&&s.heatcap===f.stats.heatcap+2&&s.sp===f.stats.sp+4&&s.speed===f.stats.speed+1;})`),true));
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
test('Expansion content merged and marked',()=>assert.equal(run("['frames','talents','backgrounds','core_bonuses','pilot_gear','weapons','systems','mods'].map(k=>D[k].filter(x=>x.ext).length).join()"),'74,21,5,21,1,117,188,9'));
test('Variant frame follows base license II',()=>assert(run("p=fixture(2);!frameAvailable(p,FRAMES.mf_ext_empakaai)&&(p.licenses={mf_blackbeard:2},frameAvailable(p,FRAMES.mf_ext_empakaai))&&!frameAvailable(p,FRAMES.mf_ext_stortebeker)")));
test('Everest variants free at LL0',()=>assert(run("p=fixture();frameAvailable(p,FRAMES.mf_ext_chomolungma)&&frameAvailable(p,FRAMES.mf_ext_sagarmatha)")));
test('Variants have no license of their own',()=>assert(run("!licenseFrames().some(f=>f.variant_of)&&licenseFrames().some(f=>f.id==='mf_ext_gilgamesh')&&!('mf_ext_lycan' in normalizePilot({licenses:{mf_ext_lycan:2,mf_manticore:2}},[]).licenses)")));
test('New license frames gate their gear',()=>assert(run("p=fixture(3);!itemAvailable(p,WEAPONS.mw_ext_legionnaire_rifle)&&(p.licenses={mf_ext_gilgamesh:1},itemAvailable(p,WEAPONS.mw_ext_legionnaire_rifle)&&!itemAvailable(p,SYSTEMS.ms_ext_multirole_drone))&&!itemAvailable(p,SYSTEMS.ms_ext_human_error)")));
test('White Witch license gates frame and gear',()=>assert(run("p=fixture(3);!frameAvailable(p,FRAMES.mf_ext_white_witch)&&!itemAvailable(p,WEAPONS.mw_ext_ferrofluid_lance)&&(p.licenses={mf_ext_white_witch:2},frameAvailable(p,FRAMES.mf_ext_white_witch)&&itemAvailable(p,SYSTEMS.ms_ext_camus_edge)&&!itemAvailable(p,SYSTEMS.ms_ext_ferro_spike_wall))&&licenseFrames().some(f=>f.id==='mf_ext_white_witch'&&f.source==='SSC')")));
test('Emperor: HP ignores Grit; license gates gear',()=>assert(run("p=fixture(6,'mf_ext_emperor');m=p.mechs[0];p.licenses={mf_ext_emperor:2};mechStats(p,m).hp===2+p.hase.hull*2&&frameAvailable(p,FRAMES.mf_ext_emperor)&&itemAvailable(p,SYSTEMS.ms_ext_book_of_kings)&&!itemAvailable(p,SYSTEMS.ms_ext_sovereign_gait)&&integratedOf(FRAMES.mf_ext_emperor,p,m).some(w=>w.id==='mw_ext_marathon_arc_bow')")));
test('Orchis/Calendula follow base license; rules note shown',()=>assert(run("p=fixture(2);p.licenses={mf_black_witch:2};frameAvailable(p,FRAMES.mf_ext_orchis)&&!frameAvailable(p,FRAMES.mf_ext_calendula)&&extRulesNote(FRAMES.mf_ext_calendula).includes('无形')&&extRulesNote(FRAMES.mf_ext_calendula).includes('变体骨架')&&!extRulesNote(FRAMES.mf_ext_gilgamesh).includes('变体骨架')")));
test('Atlas license gates frame and gear',()=>assert(run("p=fixture(3);p.licenses={mf_ext_atlas:2};frameAvailable(p,FRAMES.mf_ext_atlas)&&itemAvailable(p,SYSTEMS.ms_ext_ricochet_blade)&&!itemAvailable(p,WEAPONS.mw_ext_terashima_blade)&&mechStats(p,blankMech('mf_ext_atlas')).size===0.5")));
test('Caliban: license gear, mod and integrated shotgun',()=>assert(run("p=fixture(3);p.licenses={mf_ext_caliban:1};m=p.mechs[0];itemAvailable(p,MODS.wm_ext_hypermass_mod)&&canModify(WEAPONS.mw_assault_rifle,MODS.wm_ext_hypermass_mod,{type:'Main'})===false&&canModify(WEAPONS.mw_shotgun,MODS.wm_ext_hypermass_mod,{type:'Main'})&&!frameAvailable(p,FRAMES.mf_ext_caliban)&&(p.licenses={mf_ext_caliban:2},frameAvailable(p,FRAMES.mf_ext_caliban))&&integratedOf(FRAMES.mf_ext_caliban,p,m).some(w=>w.id==='mw_ext_hhs075_flayer')&&effectiveProfile(WEAPONS.mw_shotgun,null,MODS.wm_ext_hypermass_mod,p,m).tags.some(t=>t.id==='tg_overkill')&&effectiveProfile(WEAPONS.mw_ext_hhs155_cannibal,null,MODS.wm_ext_hypermass_mod,p,m).tags.filter(t=>t.id==='tg_knockback').map(t=>t.val).join()==='3'")));
test('Kobold license gates frame and invade systems',()=>assert(run("p=fixture(3);p.licenses={mf_ext_kobold:2};frameAvailable(p,FRAMES.mf_ext_kobold)&&licenseFrames().some(f=>f.id==='mf_ext_kobold'&&f.source==='HORUS')&&itemAvailable(p,WEAPONS.mw_ext_slag_cannon)&&!itemAvailable(p,SYSTEMS.ms_ext_purge_code)")));
test('Lich license gates frame; Dilemmas NHP counts toward AI cap',()=>assert(run("p=fixture(3);p.licenses={mf_ext_lich:3};m=blankMech('mf_ext_lich');p.mechs=[m];frameAvailable(p,FRAMES.mf_ext_lich)&&itemAvailable(p,SYSTEMS.ms_ext_reprieve)&&(m.systems=['ms_ext_dilemmas_nhp','ms_comp_con_class_assistant_unit'],loadoutChecks(p,m).some(c=>c[1].includes('AI 数量超限')))")));
test('Sunzi license gates frame and gear',()=>assert(run("p=fixture(3);p.licenses={mf_ext_sunzi:2};frameAvailable(p,FRAMES.mf_ext_sunzi)&&licenseFrames().some(f=>f.id==='mf_ext_sunzi'&&f.source==='HA')&&itemAvailable(p,WEAPONS.mw_ext_warp_rifle)&&!itemAvailable(p,SYSTEMS.ms_ext_reality_breach)")));
test('Zheng license gates frame, gear and melee-only mod',()=>assert(run("p=fixture(3);p.licenses={mf_ext_zheng:2};frameAvailable(p,FRAMES.mf_ext_zheng)&&itemAvailable(p,MODS.wm_ext_thermal_shroud)&&canModify(WEAPONS.mw_ext_tiger_hunter_gauntlets,MODS.wm_ext_thermal_shroud,{type:'Main'})&&!canModify(WEAPONS.mw_assault_rifle,MODS.wm_ext_thermal_shroud,{type:'Main'})&&!itemAvailable(p,WEAPONS.mw_ext_dd288)")));
test('Frame filter: maker, role, source, unlocked and search',()=>{
  const q=c=>run("p=fixture(2);p.licenses={mf_blackbeard:2};uiState.frame={q:'',maker:'',role:'',src:'',unlocked:false,..."+c+"};D.frames.filter(f=>frameMatches(f,p)).map(f=>f.id).join()");
  assert.equal(q("{maker:'GMS',src:'core'}"),'mf_standard_pattern_i_everest');
  assert(q("{src:'variant'}").split(',').every(id=>run("FRAMES['"+id+"'].variant_of")));
  assert.equal(q("{unlocked:true,src:'core'}"),'mf_standard_pattern_i_everest,mf_blackbeard');
  assert(q("{q:'黑胡子'}").split(',').includes('mf_ext_empakaai'));
  assert(q("{role:'Artillery',maker:'HA'}").split(',').every(id=>run("FRAMES['"+id+"'].mechtype.includes('Artillery')")));
  run("uiState.frame={q:'',maker:'',role:'',src:'',unlocked:false}");
});
test('License contents list gear for ranks I-III, incl. expansion and variants',()=>assert(run("p=fixture(2);p.licenses={mf_blackbeard:1};const h=licenseContents(p,FRAMES.mf_blackbeard),g=licenseContents(p,FRAMES.mf_ext_gilgamesh);h.includes('I 级 · 已解锁')&&!h.includes('II 级 · 已解锁')&&h.includes('因帕卡伊')&&h.includes(plain('item',WEAPONS.mw_chain_axe))&&g.includes('军团巢房')&&g.includes('吉尔伽美什骨架')")));
test('License contents hover text covers gear without an effect field',()=>assert(run("[...D.weapons,...D.systems,...D.mods].filter(it=>it.source&&licenseOf(it)).every(it=>itemHoverText(it).trim())&&itemHoverText(WEAPONS.mw_chain_axe).includes('会心一击时')&&itemHoverText(SYSTEMS.ms_reinforced_cabling).includes('拖倒')&&itemHoverText(WEAPONS.mw_assault_cannon).includes('\\n旋转')&&!itemHoverText(WEAPONS.mw_chain_axe).includes('—')")));
test('Battle map footprints: size 1/2 = 1 hex, 2 = 3, 3 = 7 (centre + ring), 4 = 12, all connected',()=>assert(run(`{const F=(size,q,r)=>BattleMap.footprint({size,q,r}),D2=BattleMap.dist;[3,4].every(q=>['½','1','2','3','4'].map(z=>new Set(F(z,q,5).map(c=>c.q+','+c.r)).size).join()==='1,1,3,7,12')&&[3,4].every(q=>{const c=F('3',q,5);return c.some(x=>x.q===q&&x.r===5)&&c.every(x=>D2(x,{q,r:5})<=1);})&&[3,4].every(q=>['2','4'].every(z=>{const c=F(z,q,5);return c.some(x=>x.q===q&&x.r===5)&&c.every(x=>c.some(y=>y!==x&&D2(x,y)===1));}))}`)));
test('Glossary: tags merged, ambiguous words not tagged',()=>{
  const terms=s=>run("(()=>{const G=getGlossary(),out=[];G.re.lastIndex=0;let m;const s="+JSON.stringify(s)+";while((m=G.re.exec(s))){const i=G.byIdx[m.findIndex((x,k)=>k>0&&x!==undefined)-1];if(i>=0)out.push(G.list[i].term);}return out.join()})()");
  assert(run("getGlossary().list.length")>100);
  assert(run("getGlossary().list.some(g=>g.term==='受限'&&g.def.includes('标签「受限X」'))"));
  assert.equal(terms("必须通过机体豁免，否则受到 2 热度并受损；反应堆过热；受限3 系统"),"机体,豁免,热度,受损,过热,受限");
  assert.equal(terms("安装系统需要 SP，热度上限 6"),"SP,热度上限");
  // 字面意义不标记（自检发现的误标）
  assert.equal(terms("强化你的飞行系统，用于快速换位"),"飞行");
  assert.equal(terms("当你强化一个盟友角色时"),"强化");
  assert.equal(terms("侍从级NHP，压抑恐惧和其他强烈反应"),"NHP");
  assert.equal(terms("以一个快速动作，你可以锁定该武器。当锁定时，你陷入缓慢；用快速动作停止锁定"),"快速动作,缓慢,快速动作");
  assert.equal(terms("对目标施加锁定"),"锁定");
  assert.equal(terms("层流、崩溃、级联、Cascade"),"层流,层流,层流,层流");
  assert.equal(terms("COMP/CON、NHP、开机"),"伙伴/礼宾单元,NHP,开机");
  assert.equal(terms("XNHPY"),"");
  assert(run("getGlossary().list.some(g=>g.term==='层流'&&g.alias.includes('崩溃')&&g.def.includes('1d20'))"));
  assert(run("getGlossary().list.find(g=>g.term==='超限').def.includes('仅全面维修重置次数')"));
  assert(run("!getGlossary().list.find(g=>g.term==='AI').def.includes('协定把控制权交给AI或收回')"));
  assert.equal(terms("超过热度上限时"),"热度上限");
  assert.equal(terms("兰开斯特是最可靠、做工最好的机甲；其独特造型；无限宽广"),"");
  assert.equal(terms("该武器获得可靠2、不准，独特"),"可靠X,不准,独特");
  assert.equal(terms("三式护盾与迅子护盾不赋予临时生命值，但获得4护盾会"),"护盾");
  assert.equal(terms("上层结构武器化；失去 1 点结构"),"结构");
  assert.equal(terms("触发其他反应；+2 触发"),"反应,触发");
  assert(terms("无形").includes("无形")&&run("getGlossary().list.find(g=>g.term==='无形').cat")==='扩展规则');
});
test('Weapon table: origin, filters and effects for every weapon',()=>assert(run("(()=>{p=fixture(2);const ok=D.weapons.every(w=>weaponOrigin(w).text&&typeof weaponEffectHtml(w)==='string');const set=s=>{Object.assign(weaponTableState,{q:'',mount:'',type:'',src:'',avail:false},s);return D.weapons.filter(w=>weaponTableMatches(w,p)).map(w=>w.id);};const integ=set({src:'integrated'}),gms=set({src:'GMS',avail:true}),sh=set({mount:'Superheavy'}),q=set({q:'突击步枪'});set({});return ok&&integ.includes('mw_ext_colossus_pyroclaw')&&weaponOrigin(WEAPONS.mw_ext_colossus_pyroclaw).text==='内建：因帕卡伊'&&weaponOrigin(WEAPONS.mw_prototype_1).text.startsWith('天赋：')&&gms.includes('mw_assault_rifle')&&sh.every(id=>WEAPONS[id].mount==='Superheavy')&&q.includes('mw_assault_rifle')})()")));
test('Variants of expansion frames follow their base license',()=>assert(run("(()=>{p=fixture(3);p.licenses={mf_ext_kidd:2,mf_deaths_head:2};const ids=D.frames.map(f=>f.id);return frameAvailable(p,FRAMES.mf_ext_bligh)&&frameAvailable(p,FRAMES.mf_ext_oleander)&&!frameAvailable(p,FRAMES.mf_ext_salamander)&&!frameAvailable(p,FRAMES.mf_ext_habsburg)&&ids.indexOf('mf_ext_bligh')===ids.indexOf('mf_ext_kidd')+1&&ids.indexOf('mf_ext_salamander')===ids.indexOf('mf_ext_kobold')+1&&integratedOf(FRAMES.mf_ext_bligh,p,blankMech('mf_ext_bligh')).length===3&&!licenseFrames().some(f=>f.id==='mf_ext_habsburg')})()")));
test('Mitchell license gates frame and gear',()=>assert(run("p=fixture(3);p.licenses={mf_ext_mitchell:2};frameAvailable(p,FRAMES.mf_ext_mitchell)&&itemAvailable(p,SYSTEMS.ms_ext_curtain_aem)&&!itemAvailable(p,SYSTEMS.ms_ext_swordfish_lfcm)&&mechStats(p,blankMech('mf_ext_mitchell')).size===3")));
test('Stetchkin variant follows Mitchell license',()=>assert(run("p=fixture(3);p.licenses={mf_ext_mitchell:2};const f=FRAMES.mf_ext_stetchkin;frameAvailable(p,f)&&!licenseFrames().includes(f)&&mechStats(p,blankMech('mf_ext_stetchkin')).sensor===20")));
test('Spectre Fallen Mask adds 2 HP',()=>assert(run("p=fixture(3);p.licenses={mf_ext_spectre:2};const mm=blankMech('mf_ext_spectre');const a=mechStats(p,mm).hp;mm.systems=['ms_ext_fallen_mask'];frameAvailable(p,FRAMES.mf_ext_spectre)&&mechStats(p,mm).hp===a+2")));
test('Hubble canister mod fits main launchers, not aux',()=>assert(run("p=fixture(3);p.licenses={mf_ext_hubble:3};const md=MODS.wm_ext_seek_devour_canister;frameAvailable(p,FRAMES.mf_ext_hubble)&&itemAvailable(p,WEAPONS.mw_ext_ea17_mortar)&&canModify(WEAPONS.mw_ext_wonderland_cannon,md,{})&&!canModify(WEAPONS.mw_missile_rack,md,{})")));
test('Pharos license gates frame and gear',()=>assert(run("p=fixture(3);p.licenses={mf_ext_pharos:2};frameAvailable(p,FRAMES.mf_ext_pharos)&&itemAvailable(p,WEAPONS.mw_ext_torrent_harpoon)&&!itemAvailable(p,SYSTEMS.ms_ext_boarding_rail)&&mechStats(p,blankMech('mf_ext_pharos')).sensor===20")));
test('Sicklewing license gates frame and gear',()=>assert(run("p=fixture(3);p.licenses={mf_ext_sicklewing:2};frameAvailable(p,FRAMES.mf_ext_sicklewing)&&itemAvailable(p,WEAPONS.mw_ext_screaming_rifle)&&!itemAvailable(p,SYSTEMS.ms_ext_judas_exploit)&&mechStats(p,blankMech('mf_ext_sicklewing')).sensor===10")));
test('Feathered Serpent license gates frame and gear',()=>assert(run("p=fixture(3);p.licenses={mf_ext_feathered_serpent:2};frameAvailable(p,FRAMES.mf_ext_feathered_serpent)&&itemAvailable(p,WEAPONS.mw_ext_half_life_sun_lens)&&!itemAvailable(p,WEAPONS.mw_ext_corona_outpouring)&&mechStats(p,blankMech('mf_ext_feathered_serpent')).sensor===10")));
test('Tametomo license and integrated flare bow',()=>assert(run("p=fixture(3);p.licenses={mf_ext_tametomo:2};frameAvailable(p,FRAMES.mf_ext_tametomo)&&itemAvailable(p,WEAPONS.mw_ext_typhoon_ion_channel)&&!itemAvailable(p,SYSTEMS.ms_ext_offering_arrow)&&!WEAPONS.mw_ext_pt3_flare_bow.source&&mechStats(p,blankMech('mf_ext_tametomo')).heatcap===10")));
test('New variants follow base licenses (Nemo, Red Admiral, Banshee Vine, Grant)',()=>assert(run("p=fixture(3);p.licenses={mf_nelson:2,mf_ext_atlas:2,mf_goblin:2,mf_sherman:2};['mf_ext_nemo','mf_ext_red_admiral','mf_ext_banshee_vine','mf_ext_grant'].every(id=>frameAvailable(p,FRAMES[id])&&!licenseFrames().includes(FRAMES[id]))&&!WEAPONS.mw_ext_maelstrom_drill_extended.source")));
test('K/KCA manufacturer is listed with its Chinese name',()=>assert(run("MAKERS.includes('K/KCA')&&makerName('K/KCA').includes('哈尔根/卡西米尔定制装配')")));
test('K/KCA Private Tutor adds 2 talent ranks; Signature Move cuts one system by 2 SP',()=>assert(run("p=fixture(3);const kb=talentBudget(p);p.coreBonuses=['cb_kkca_private_tutor'];const t1=talentBudget(p)===kb+2;p.coreBonuses=['cb_kkca_signature_move'];const km=blankMech();km.systems=['ms_personalizations','ms_turret_drones'];const u0=mechStats(p,km).spUsed;const e0=loadoutChecks(p,km).some(c=>/招牌动作/.test(c[1]));km.signature='ms_turret_drones';t1&&e0&&mechStats(p,km).spUsed===u0-2&&!loadoutChecks(p,km).some(c=>/招牌动作/.test(c[1]))")));
test('Emerald Scimitar license gates gear, integrated bow, and unlocks K/KCA core bonuses',()=>assert(run("p=fixture(3);p.licenses={mf_kkca_emerald_scimitar:3};frameAvailable(p,FRAMES.mf_kkca_emerald_scimitar)&&itemAvailable(p,WEAPONS.mw_kkca_chakram_chain)&&itemAvailable(p,SYSTEMS.ms_kkca_archer_companion)&&!WEAPONS.mw_kkca_samyeli_bow.source&&cbEligible(p,CBS.cb_kkca_oath_of_excellence)")));
test('Wondrous Sword license gates gear and integrated pulse shield',()=>assert(run("p=fixture(3);p.licenses={mf_kkca_wondrous_sword:2};frameAvailable(p,FRAMES.mf_kkca_wondrous_sword)&&itemAvailable(p,SYSTEMS.ms_kkca_transdomain_plating)&&!itemAvailable(p,SYSTEMS.ms_kkca_bulwark_engine)&&!WEAPONS.mw_kkca_pulse_shield.source&&mechStats(p,blankMech('mf_kkca_wondrous_sword')).armor===3")));
test('Tizona license gates gear; Valencia lance and musket keep their profiles',()=>assert(run("p=fixture(3);p.licenses={mf_kkca_tizona:2};frameAvailable(p,FRAMES.mf_kkca_tizona)&&itemAvailable(p,WEAPONS.mw_kkca_tiger_claw_baton)&&!itemAvailable(p,SYSTEMS.ms_kkca_rps_world_guard)&&WEAPONS.mw_kkca_valencia_lance.profiles.length===3&&!WEAPONS.mw_kkca_valencia_lance.source&&WEAPONS.mw_kkca_kinetic_musket.profiles.length===2")));
test('Rending Sword license gates gear and integrated Doom Axe',()=>assert(run("p=fixture(3);p.licenses={mf_kkca_rending_sword:2};frameAvailable(p,FRAMES.mf_kkca_rending_sword)&&itemAvailable(p,WEAPONS.mw_kkca_blackbird_net)&&!itemAvailable(p,WEAPONS.mw_kkca_chain_wheel)&&!WEAPONS.mw_kkca_doom_axe.source")));
test('Jouken and Ornithoptera variants follow base licenses',()=>assert(run("p=fixture(3);p.licenses={mf_metalmark:2,mf_ext_atlas:2};['mf_ext_jouken','mf_ext_ornithoptera'].every(id=>frameAvailable(p,FRAMES[id])&&!licenseFrames().includes(FRAMES[id]))&&!WEAPONS.mw_ext_affinity_edge.source&&mechStats(p,blankMech('mf_ext_ornithoptera')).size===0.5")));
test('PI-OF maker and Woodsman repair cap bonus',()=>assert(run("p=fixture(3);const wm=blankMech();const wrc=mechStats(p,wm).repcap;p.coreBonuses=['cb_piof_woodsman'];MAKERS.includes('PI-OF')&&D.core_bonuses.filter(c=>c.source==='PI-OF').length===6&&mechStats(p,wm).repcap===wrc+1")));
test('PI-OF frames gate gear and unlock core bonuses at 3 license ranks',()=>assert(run("p=fixture(3);p.licenses={mf_piof_basil:2,mf_piof_coriander:1};frameAvailable(p,FRAMES.mf_piof_basil)&&!frameAvailable(p,FRAMES.mf_piof_coriander)&&itemAvailable(p,WEAPONS.mw_piof_scatter_bow)&&itemAvailable(p,WEAPONS.mw_piof_micro_mass_driver)&&!itemAvailable(p,MODS.wm_piof_fragmentation_rounds)&&cbEligible(p,CBS.cb_piof_woodsman)")));
test('Fennel and Lemongrass licenses gate frames and gear',()=>assert(run("p=fixture(3);p.licenses={mf_piof_fennel:2,mf_piof_lemongrass:1};frameAvailable(p,FRAMES.mf_piof_fennel)&&!frameAvailable(p,FRAMES.mf_piof_lemongrass)&&itemAvailable(p,SYSTEMS.ms_piof_viper_drone)&&itemAvailable(p,WEAPONS.mw_piof_dazzle)&&!itemAvailable(p,SYSTEMS.ms_piof_parvati_nhp)&&mechStats(p,blankMech('mf_piof_lemongrass')).size===0.5")));
test('Pepper and Rosemary licenses gate frames and gear',()=>assert(run("p=fixture(3);p.licenses={mf_piof_pepper:2,mf_piof_rosemary:1};frameAvailable(p,FRAMES.mf_piof_pepper)&&!frameAvailable(p,FRAMES.mf_piof_rosemary)&&itemAvailable(p,WEAPONS.mw_piof_plasma_caster)&&itemAvailable(p,WEAPONS.mw_piof_furnace_hammer)&&!itemAvailable(p,WEAPONS.mw_piof_geomorph_wrecking_ball)&&mechStats(p,blankMech('mf_piof_pepper')).speed===8")));
test('Mint and Star Anise licenses gate frames and gear',()=>assert(run("p=fixture(3);p.licenses={mf_piof_mint:2,mf_piof_star_anise:1};frameAvailable(p,FRAMES.mf_piof_mint)&&!frameAvailable(p,FRAMES.mf_piof_star_anise)&&itemAvailable(p,WEAPONS.mw_piof_tt8_alpine_carbine)&&itemAvailable(p,SYSTEMS.ms_piof_cargo_walker)&&!itemAvailable(p,SYSTEMS.ms_piof_skadi_nhp)&&mechStats(p,blankMech('mf_piof_star_anise')).repcap>=8")));
test('Bricklayer adds deployable HP; Sapper II grants Demolitions Toolkit',()=>assert(run("p=fixture(3);p.talents={t_ext_bricklayer:1,t_ext_sapper:1};const bm=blankMech();const r1=staticBonus(p,bm,'deployable_hp')===5&&!itemAvailable(p,SYSTEMS.ms_ext_demolitions_toolkit);p.talents.t_ext_sapper=2;r1&&itemAvailable(p,SYSTEMS.ms_ext_demolitions_toolkit)")));
test('All data ids are unique (talents, frames, gear, core bonuses)',()=>assert.equal(run("['frames','talents','core_bonuses','weapons','systems','mods','pilot_gear','backgrounds'].flatMap(k=>{const ids=D[k].map(x=>x.id);return ids.filter((x,i)=>ids.indexOf(x)!==i)}).join()"),''));
test('System search matches tag names (e.g. 可展开), not just effect text',()=>assert(run("systemSearchText(SYSTEMS.ms_piof_smoke_generator).includes('可展开')&&systemSearchText(SYSTEMS.ms_turret_drones).includes('受限')&&systemSearchText(SYSTEMS.ms_turret_drones).includes('无人机')")));
test('Monarch text uses its v3.5 name 金斑蝶, not the expansion frame name 帝王蝶',()=>assert(run("!JSON.stringify(FRAMES.mf_monarch).includes('帝王蝶')")));
test('Gilgamesh adds +1 limited charge',()=>assert.equal(run("p=fixture(2,'mf_ext_gilgamesh');m=p.mechs[0];p.hase.eng=2;limitedTags([{id:'tg_limited',val:3}],p,m)[0].val"),5));
test('Iconoclast NHP outside AI cap; expansion talents have 3 ranks',()=>assert(run("p=fixture();p.talents={t_ext_iconoclast:1};m=p.mechs[0];m.systems=['ms_ext_unstable_nhp','ms_comp_con_class_assistant_unit'];itemAvailable(p,SYSTEMS.ms_ext_unstable_nhp)&&!loadoutChecks(p,m).some(c=>c[1].includes('AI'))&&D.talents.filter(t=>t.ext).every(t=>t.ranks.length===3&&Z.talents[t.name].ranks.every(r=>r.html))&&normalizePilot({talents:{t_ext_iconoclast:3,t_ext_sysop:2}},[]).talents.t_ext_iconoclast===3")));
test('Superheavy Mounting adds a superheavy mount below 3 mounts',()=>assert(run("p=fixture(3,'mf_ext_kidd');p.coreBonuses=['cb_ext_superheavy_mounting'];m=p.mechs[0];const ms=mountsOf(p,m);ms.some(x=>x.key==='sh'&&x.type==='Superheavy')&&(p.mechs[0]=blankMech(EVEREST),!mountsOf(p,p.mechs[0]).some(x=>x.key==='sh'))")));
test('Superheavy Mounting must link the heavy mount when present',()=>{
  assert(run("p=fixture(3,'mf_manticore');p.coreBonuses=['cb_ext_superheavy_mounting'];m=p.mechs[0];m.loadout.sh={slots:[{w:'mw_ext_tempest_charged_blade',mod:''}],link:'m0'};loadoutChecks(p,m).some(c=>c[1].includes('额外挂载点无效'))"));
  assert(run("m.loadout.sh.link='m1';!loadoutChecks(p,m).some(c=>c[1].includes('额外挂载点无效'))&&equippedWeapons(p,m).some(e=>e.w.id==='mw_ext_tempest_charged_blade')"));
});
test('Expansion background triggers resolve for wizard',()=>assert.equal(run("p=fixture();p.background='pbg_ext_noble_heir';bgSuggestedSkills(p).length"),4));


test('Wodeng license unlocks each rank',()=>assert(run("p=fixture(3);p.licenses={mf_ext_wodeng:1};!frameAvailable(p,FRAMES.mf_ext_wodeng)&&itemAvailable(p,WEAPONS.mw_ext_wodeng_gpmg)&&itemAvailable(p,SYSTEMS.ms_ext_wodeng_turret_mount)&&!itemAvailable(p,WEAPONS.mw_ext_wodeng_sticky_launcher)&&(p.licenses.mf_ext_wodeng=2,frameAvailable(p,FRAMES.mf_ext_wodeng)&&itemAvailable(p,WEAPONS.mw_ext_wodeng_sticky_launcher)&&itemAvailable(p,SYSTEMS.ms_ext_wodeng_giant_bag)&&!itemAvailable(p,WEAPONS.mw_ext_wodeng_mk12))&&(p.licenses.mf_ext_wodeng=3,itemAvailable(p,WEAPONS.mw_ext_wodeng_mk12)&&itemAvailable(p,SYSTEMS.ms_ext_wodeng_counterfire))")));
test('Wodeng mounts, modes and attached gun',()=>assert(run("FRAMES.mf_ext_wodeng.mounts.join()==='Flex,Main,Heavy'&&FRAMES.mf_ext_wodeng.stats.size===2&&WEAPONS.mw_ext_wodeng_gpmg.profiles[1].damage[0].val==='1d6'&&WEAPONS.mw_ext_wodeng_mk12.mount==='Superheavy'&&WEAPONS.mw_ext_wodeng_mk12.profiles[1].tags.some(t=>t.id==='tg_reliable'&&t.val===4)&&SYSTEMS.ms_ext_wodeng_turret_mount.effect.includes('2d3')&&!D.weapons.some(w=>w.name==='挂载 HMG')")));

test('New GMS bonuses have no manufacturer restriction and add exactly 2 SP',()=>assert(run(`(()=>{
  const q=fixture(3),m=q.mechs[0],before=mechStats(q,m).sp;
  const ids=['cb_ext_enhanced_system_upgrade','cb_ext_quality_logistics','cb_ext_kanggeduo_chassis'];
  if(!ids.every(id=>CBS[id].source==='GMS'&&cbEligible(q,CBS[id],1)))return false;
  q.coreBonuses=['cb_ext_enhanced_system_upgrade'];if(mechStats(q,m).sp!==before+2)return false;
  q.coreBonuses=[];return mechStats(q,m).sp===before;
})()`)));
test('Quality logistics preserves all four screenshot options',()=>assert(run(`(()=>{
  const c=CBS.cb_ext_quality_logistics,s=Z.cb[c.name].html;
  return (s.match(/<li>/g)||[]).length===4&&['1/场景','射程 3','最多三个','溅射 1','射程 20','溅射 2','2d6','敏捷','动能、爆炸或能量'].every(x=>s.includes(x));
})()`)));
test('Kanggeduo is gated by its core bonus, never by a license',()=>assert(run(`(()=>{
  db.ignoreLimits=false;const q=fixture(3),f=FRAMES.mf_ext_kanggeduo;
  q.licenses[f.id]=3;if(frameAvailable(q,f)||licenseFrames().includes(f))return false;
  q.coreBonuses=['cb_ext_kanggeduo_chassis'];if(!frameAvailable(q,f)||!frameAccess(q,f).includes('核心奖励'))return false;
  q.coreBonuses=[];return !frameAvailable(q,f);
})()`)));
test('Reserve configuration preserves original equipment and shares pilot bonuses',()=>assert(run(`(()=>{
  const q=fixture(6),original=q.mechs[0];q.hase={hull:2,agi:2,sys:2,eng:2};
  q.coreBonuses=['cb_ext_kanggeduo_chassis','cb_ext_enhanced_system_upgrade'];q.talents={t_engineer:1};
  original.loadout.m0={slots:[{w:'mw_assault_rifle'}],link:''};original.systems=['ms_personalizations'];
  const before=JSON.stringify(original),b=createKanggeduo(q,original),s=mechStats(q,b);
  return JSON.stringify(original)===before&&q.mechs.length===2&&q.activeMech===1&&b.legacyFrame===original.frame&&b.legacyTrait===''&&equippedWeapons(q,b).length===0&&b.systems.length===0&&s.hp===13&&s.sp===10&&s.heatcap===7&&s.structure===4&&s.stress===4&&integratedOf(FRAMES[b.frame],q,b).some(w=>w.id==='mw_prototype_1');
})()`)));
test('Legacy carries only the chosen trait and survives import/export',()=>assert(run(`(()=>{
  const q=fixture(3),b=blankMech('mf_ext_kanggeduo');q.coreBonuses=['cb_ext_kanggeduo_chassis'];q.mechs.push(b);
  b.legacyFrame=EVEREST;b.legacyTrait='0';
  if(mechTraits(b).length!==3||!inheritedTrait(b).name.includes('先制')||!sheetText(q).includes('先制（遗产：埃弗勒斯）'))return false;
  const restored=normalizePilot(JSON.parse(JSON.stringify(q)),[]).mechs[1];
  return restored.legacyFrame===EVEREST&&restored.legacyTrait==='0'&&inheritedTrait(restored).description===FRAMES[EVEREST].traits[0].description;
})()`)));
test('Legacy respects trait bonuses without inheriting core gear and rejects malformed saves',()=>assert(run(`(()=>{
  const q=fixture(3),b=blankMech('mf_ext_kanggeduo');q.mechs=[b];
  const bonusFrame=D.frames.find(f=>!f.required_core_bonus&&f.traits.some(t=>t.bonuses?.some(b=>b.id==='limited_bonus')));
  b.legacyFrame=bonusFrame.id;b.legacyTrait=String(bonusFrame.traits.findIndex(t=>t.bonuses?.some(b=>b.id==='limited_bonus')));
  if(staticBonus(q,b,'limited_bonus')!==bonusFrame.traits[+b.legacyTrait].bonuses.find(x=>x.id==='limited_bonus').val)return false;
  const weaponFrame=FRAMES.mf_ext_caliban;
  b.legacyFrame=weaponFrame.id;b.legacyTrait='0';
  if(integratedOf(FRAMES[b.frame],q,b).some(x=>weaponFrame.core_system.integrated.includes(x.id)))return false;
  b.legacyFrame=b.frame;b.legacyTrait='0';if(inheritedTrait(b))return false;
  b.legacyFrame=EVEREST;b.legacyTrait='999';return normalizePilot(q,[]).mechs[0].legacyTrait==='';
})()`)));
test('Reserve preview shows its bonus and Efficient instead of invented license',()=>assert(run(`(()=>{
  p=fixture(3);const f=FRAMES.mf_ext_kanggeduo,s=framePreviewHtml(p,f);
  return s.includes('康格多底盘核心奖励与部署规则')&&!s.includes('查看这张牌照的 I / II / III')&&s.includes('高效 · 场景结束时返还 1 CP')&&s.includes('需要对应核心奖励');
})()`)));
test('Catalog creates a reserve without replacing the active build',()=>assert(run(`(()=>{
  p=fixture(3);p.coreBonuses=['cb_ext_kanggeduo_chassis'];const original=JSON.stringify(p.mechs[0]);
  return useCatalogFrame('mf_ext_kanggeduo')&&p.mechs.length===2&&JSON.stringify(p.mechs[0])===original&&M().frame==='mf_ext_kanggeduo';
})()`)));


test('C&H Charioteer license and core bonus eligibility',()=>assert(run("p=fixture(3);p.licenses={mf_ch_charioteer:1};!frameAvailable(p,FRAMES.mf_ch_charioteer)&&itemAvailable(p,WEAPONS.mw_ch_tether)&&!itemAvailable(p,SYSTEMS.ms_ch_skates)&&(p.licenses.mf_ch_charioteer=2,frameAvailable(p,FRAMES.mf_ch_charioteer)&&itemAvailable(p,SYSTEMS.ms_ch_fold_carbine))&&(p.licenses.mf_ch_charioteer=3,itemAvailable(p,SYSTEMS.ms_ch_hound)&&cbEligible(p,CBS.cb_ch_environment,1))")));


test('Gajeshura follows Callista license and supplies integrated fang',()=>assert(run("p=fixture(2);p.licenses={mf_ch_callista:1};!frameAvailable(p,FRAMES.mf_ch_gajeshura)&&(p.licenses.mf_ch_callista=2,frameAvailable(p,FRAMES.mf_ch_gajeshura))&&FRAMES.mf_ch_gajeshura.mounts.join()==='Main,Heavy'&&FRAMES.mf_ch_gajeshura.stats.sensor_range===3&&integratedOf(FRAMES.mf_ch_gajeshura,p).some(w=>w.id==='mw_ch_demons_fang'&&w.tags.some(t=>t.id==='tg_reliable'&&t.val===4))")));

test('Kalalani license ranks, profiles and integrated launcher',()=>assert(run("p=fixture(3);p.licenses={mf_ch_kalalani:1};!frameAvailable(p,FRAMES.mf_ch_kalalani)&&itemAvailable(p,WEAPONS.mw_ch_model17)&&!itemAvailable(p,SYSTEMS.ms_ch_spider_bombs)&&(p.licenses.mf_ch_kalalani=2,frameAvailable(p,FRAMES.mf_ch_kalalani)&&itemAvailable(p,SYSTEMS.ms_ch_spider_bombs))&&(p.licenses.mf_ch_kalalani=3,itemAvailable(p,WEAPONS.mw_ch_model96)&&itemAvailable(p,SYSTEMS.ms_ch_saboteur))&&WEAPONS.mw_ch_model96.sp===2&&WEAPONS.mw_ch_model96.profiles[1].type==='Cannon'&&integratedOf(FRAMES.mf_ch_kalalani,p).some(w=>w.id==='mw_ch_typhoon')")));

test('Matador license unlocks frame, mod and counterintrusion gear',()=>assert(run("p=fixture(3);p.licenses={mf_ch_matador:1};!frameAvailable(p,FRAMES.mf_ch_matador)&&itemAvailable(p,WEAPONS.mw_ch_virus_dagger)&&!itemAvailable(p,MODS.wm_ch_weapon_hardening)&&(p.licenses.mf_ch_matador=2,frameAvailable(p,FRAMES.mf_ch_matador)&&itemAvailable(p,MODS.wm_ch_weapon_hardening)&&itemAvailable(p,SYSTEMS.ms_ch_flytrap))&&(p.licenses.mf_ch_matador=3,itemAvailable(p,WEAPONS.mw_ch_bull_missile)&&itemAvailable(p,SYSTEMS.ms_ch_thorn))&&FRAMES.mf_ch_matador.mounts.join()==='Flex,Main/Aux'")));

test('Pesilat license gates all system ranks',()=>assert(run("p=fixture(3);p.licenses={mf_ch_pesilat:1};!frameAvailable(p,FRAMES.mf_ch_pesilat)&&itemAvailable(p,SYSTEMS.ms_ch_shadow_fist)&&!itemAvailable(p,SYSTEMS.ms_ch_falling_star)&&(p.licenses.mf_ch_pesilat=2,frameAvailable(p,FRAMES.mf_ch_pesilat)&&itemAvailable(p,SYSTEMS.ms_ch_serpent_fang)&&!itemAvailable(p,SYSTEMS.ms_ch_shatter_palm))&&(p.licenses.mf_ch_pesilat=3,itemAvailable(p,SYSTEMS.ms_ch_swallow)&&itemAvailable(p,SYSTEMS.ms_ch_shatter_palm))&&FRAMES.mf_ch_pesilat.mounts.join()==='Aux/Aux'&&FRAMES.mf_ch_pesilat.stats.tech_attack===2")));

test('Retiarius license ranks and interference mod restrictions',()=>assert(run("p=fixture(3);p.licenses={mf_ch_retiarius:1};!frameAvailable(p,FRAMES.mf_ch_retiarius)&&itemAvailable(p,WEAPONS.mw_ch_tangle_cannon)&&!itemAvailable(p,MODS.wm_ch_interference)&&(p.licenses.mf_ch_retiarius=2,frameAvailable(p,FRAMES.mf_ch_retiarius)&&itemAvailable(p,WEAPONS.mw_ch_shock_whip)&&itemAvailable(p,MODS.wm_ch_interference))&&(p.licenses.mf_ch_retiarius=3,itemAvailable(p,WEAPONS.mw_ch_explosive_chain)&&itemAvailable(p,SYSTEMS.ms_ch_seismic_pulse))&&MODS.wm_ch_interference.allowed_types.join()==='Rifle,Cannon,CQB'&&FRAMES.mf_ch_retiarius.mounts.join()==='Flex,Heavy'&&WEAPONS.mw_ch_tangle_cannon.damage.length===0")));

test('Pemada and Sagittarius license ranks and integrated bow',()=>assert(run("p=fixture(6);p.licenses={mf_ch_pemada:1,mf_ch_sagittarius:1};!frameAvailable(p,FRAMES.mf_ch_pemada)&&!frameAvailable(p,FRAMES.mf_ch_sagittarius)&&itemAvailable(p,MODS.wm_ch_adaptive_weight)&&itemAvailable(p,SYSTEMS.ms_ch_holo_bombs)&&(p.licenses.mf_ch_pemada=2,p.licenses.mf_ch_sagittarius=2,frameAvailable(p,FRAMES.mf_ch_pemada)&&frameAvailable(p,FRAMES.mf_ch_sagittarius)&&itemAvailable(p,WEAPONS.mw_ch_smart_blade)&&itemAvailable(p,SYSTEMS.ms_ch_nightjar))&&(p.licenses.mf_ch_pemada=3,p.licenses.mf_ch_sagittarius=3,itemAvailable(p,SYSTEMS.ms_ch_arcturus)&&itemAvailable(p,SYSTEMS.ms_ch_echo_mirage))&&integratedOf(FRAMES.mf_ch_sagittarius,p).some(w=>w.id==='mw_ch_blackjack')")));

test('Every core bonus has a visible description',()=>assert(run("D.core_bonuses.every(c=>{const z=Z.cb[nk(c.name)];return z ? typeof z.html==='string'&&z.html.replace(/<[^>]*>/g,'').trim().length>0 : !!c.effect;})")));




test('Professional rank I free prerequisite; rank II needs same maker',()=>{assert.equal(run(`p=fixture();p.professionalLicenses=[{id:'pro_a',name:'三眼',source:'HORUS',rank:1,rewardRanks:1,prerequisite:'',notes:''}];professionalChecks(p).length`),0);assert.equal(run(`p.professionalLicenses[0].rank=2;professionalChecks(p).length`),1);assert.equal(run(`p.licenses.mf_pegasus=1;professionalChecks(p).length`),0);assert.equal(run(`p.professionalLicenses[0].rank=3;professionalChecks(p).length`),1);assert.equal(run(`p.licenses.mf_pegasus=2;professionalChecks(p).length`),0);});
test('Professional prerequisite chain and cycles',()=>{assert.equal(run(`p=fixture();p.professionalLicenses=[{id:'a',name:'先遣兵',source:'IPS-N',rank:1,rewardRanks:1,prerequisite:'',notes:''},{id:'b',name:'守夜人',source:'IPS-N',rank:2,rewardRanks:2,prerequisite:'a',notes:''}];professionalChecks(p).length`),0);assert(run(`p.professionalLicenses[0].rank=2;p.professionalLicenses[0].prerequisite='b';professionalChecks(p).length>0`));});
test('Professional reward preserves LL and survives reload',()=>{assert(run(`p=fixture(6);p.professionalLicenses=[{id:'pro_test',name:'测试',source:'HORUS',rank:1,rewardRanks:1,prerequisite:'',notes:'装备说明'}];var restored=normalizePilot(JSON.parse(JSON.stringify(p)),[]);restored.ll===6&&restored.professionalLicenses[0].notes==='装备说明'&&LV(restored.ll).cbs===2&&makerLicenseTotal(restored,'HORUS')===1`));assert(run(`professionalPanel(restored).includes('添加专业牌照')&&progressParts(restored).professionals.includes('专业牌照')`));});
test('Rewarded professional ranks do not consume upgrade budget',()=>{assert(run(`p=fixture(0);p.professionalLicenses=[{id:'a',name:'奖励',source:'HORUS',rank:1,rewardRanks:1,prerequisite:'',notes:''}];!checks(p).some(x=>x[1].includes('牌照等级合计'))`));assert(run(`p.professionalLicenses[0].rewardRanks=0;checks(p).some(x=>x[1].includes('牌照等级合计'))`));});

test('Professional catalog has twenty-one independent licenses, forty-two gear entries and no frames',()=>assert(run(`{D.professional_licenses.length===21&&[...D.weapons,...D.systems,...D.mods].filter(x=>x.professional_license).length===42&&!D.frames.some(f=>f.id.startsWith('pl_'))}`)));
test('Each professional license unlocks its own gear only',()=>assert(run(`{D.professional_licenses.every(def=>{const q=fixture(6);const items=[...D.weapons,...D.systems,...D.mods].filter(x=>x.professional_license===def.id);if(items.length!==2||items.some(x=>itemAvailable(q,x)))return false;addCatalogProfessional(q,def.id);return items.every(x=>itemAvailable(q,x))&&[...D.weapons,...D.systems,...D.mods].filter(x=>x.professional_license&&x.professional_license!==def.id).every(x=>!itemAvailable(q,x));})}`)));
test('IPS professional prerequisite checks and independent point costs',()=>assert(run(`{p=fixture(6);addCatalogProfessional(p,'pl_ips_watchman');const locked=professionalChecks(p).length===1;addCatalogProfessional(p,'pl_ips_vanguard');p.professionalLicenses[0].prerequisite='pl_ips_vanguard';addCatalogProfessional(p,'pl_ips_overlord');returnValue=locked&&professionalChecks(p).length===0&&makerLicenseTotal(p,'IPS-N')===6&&p.professionalLicenses.length===3;returnValue}`)));
test('Normal licenses can qualify professionals; professionals do not unlock normal frames',()=>assert(run(`{p=fixture(6);p.licenses.mf_nelson=1;addCatalogProfessional(p,'pl_ips_watchman');professionalChecks(p).length===0&&!frameAvailable(p,FRAMES.mf_nelson)&&!frameAvailable(p,FRAMES.mf_blackbeard)}`)));
test('Professional rewards, catalog identity and old custom records survive import',()=>assert(run(`{p=fixture(6);addCatalogProfessional(p,'pl_horus_reason');p.professionalLicenses[0].rewardRanks=1;p.professionalLicenses.push({id:'custom',name:'自定',source:'SSC',rank:1,rewardRanks:1,prerequisite:'',notes:'保留'});let q=normalizePilot(JSON.parse(JSON.stringify(p)),[]);q.ll===6&&q.professionalLicenses.length===2&&professionalLicenseRank(q,'pl_horus_reason')===1&&q.professionalLicenses[1].notes==='保留'}`)));
test('Underbarrel requires Main or Heavy and keeps its independent loading profile',()=>assert(run(`{canModify(WEAPONS.mw_assault_rifle,MODS.wm_pl_underslung,{})&&!canModify(WEAPONS.mw_pistol,MODS.wm_pl_underslung,{})&&!canModify(WEAPONS.mw_anti_materiel_rifle,{...MODS.wm_pl_underslung,allowed_sizes:['Superheavy']},{})&&MODS.wm_pl_underslung.profiles[0].damage[0].val===5&&MODS.wm_pl_underslung.profiles[0].no_bonuses}`)));
test('Modular rifle supports two valid mods and reduces each cost by one',()=>assert(run(`{p=fixture(6);m=p.mechs[0];addCatalogProfessional(p,'pl_ha_workshop');p.licenses.mf_balor=2;const mt=mountsOf(p,m).find(x=>x.type==='Main');m.loadout[mt.key]={slots:[{w:'mw_pl_modular_rifle',mod:'wm_nanocomposite_adaptation',mod2:'wm_pl_optimized',profile:1}],link:''};const e=equippedWeapons(p,m)[0];e.w.range[0].val===12&&e.w.tags.some(t=>t.id==='tg_loading')&&e.mods.length===2&&e.mod.sp===2&&mechStats(p,m).spUsed===2&&weaponRows(p,m).some(row=>row.join(' ').includes('最优化工程'))}`)));
test('Second module rejects ordinary weapons and repeated modules',()=>assert(run(`{p=fixture(6);m=p.mechs[0];const mt=mountsOf(p,m).find(x=>x.type==='Main');m.loadout[mt.key]={slots:[{w:'mw_assault_rifle',mod2:'wm_pl_optimized'}],link:''};const ordinary=loadoutChecks(p,m).some(x=>x[1].includes('第二模组'));m.loadout[mt.key].slots[0]={w:'mw_pl_modular_rifle',mod:'wm_pl_optimized',mod2:'wm_pl_optimized'};ordinary&&loadoutChecks(p,m).some(x=>x[1].includes('重复安装同一模组'))}`)));
test('Printed rifle profile and second mod survive JSON roundtrip',()=>assert(run(`{p=fixture(6);m=p.mechs[0];const mt=mountsOf(p,m).find(x=>x.type==='Main');m.loadout[mt.key]={slots:[{w:'mw_pl_modular_rifle',mod:'wm_pl_optimized',mod2:'wm_nanocomposite_adaptation',profile:2}],link:''};let q=normalizePilot(JSON.parse(JSON.stringify(p)),[]);q.mechs[0].loadout[mt.key].slots[0].mod2==='wm_nanocomposite_adaptation'&&equippedWeapons(q,q.mechs[0])[0].w.selected_profile==='突击'}`)));
test('Tactical belt occupies one mount and reduces combined system cost by at most four',()=>assert(run(`{p=fixture(6);m=p.mechs[0];m.systems=['ms_pl_tactical_belt','ms_pl_active_defense'];m.beltMount=mountsOf(p,m)[0].key;m.beltSystem1='ms_pl_active_defense';const first=mechStats(p,m).spUsed===0&&tacticalBeltDiscount(p,m)===2;m.systems.push('ms_ext_spear_charges');m.beltSystem2='ms_ext_spear_charges';first&&tacticalBeltDiscount(p,m)===4&&mechStats(p,m).spUsed===1}`)));
test('Tactical belt rejects occupied mounts and ineligible systems',()=>assert(run(`{p=fixture(6);m=p.mechs[0];m.systems=['ms_pl_tactical_belt','ms_pl_coolwind'];m.beltMount=mountsOf(p,m).find(x=>x.type==='Main').key;m.beltSystem1='ms_pl_coolwind';m.loadout[m.beltMount]={slots:[{w:'mw_assault_rifle'}],link:''};const errs=professionalLoadoutChecks(p,m);errs.some(x=>x[1].includes('不能安装武器'))&&errs.some(x=>x[1].includes('带榴弹、地雷或可展开'))&&tacticalBeltDiscount(p,m)===0}`)));
test('Weapon pod stores inactive weapons and exchanges a legal Main weapon',()=>assert(run(`{p=fixture(6);m=p.mechs[0];m.systems=['ms_pl_weapon_pod'];m.podMode='Main';m.podWeapon1='mw_shotgun';const mt=mountsOf(p,m).find(x=>x.type==='Main');m.loadout[mt.key]={slots:[{w:'mw_assault_rifle'}],link:''};const before=equippedWeapons(p,m).every(e=>e.w.id!=='mw_shotgun');swapPodWeapons(p,m,mt.key);before&&m.loadout[mt.key].slots[0].w==='mw_shotgun'&&m.podWeapon1==='mw_assault_rifle'}`)));
test('Sentry weapon selection, pod and belt configuration survive import',()=>assert(run(`{p=fixture(6);m=p.mechs[0];const mt=mountsOf(p,m).find(x=>x.type==='Main');m.loadout[mt.key]={slots:[{w:'mw_assault_rifle'}],link:''};m.sentryWeapon=mt.key+'|0';m.beltMount='some-mount';m.beltSystem1='ms_pl_active_defense';m.podMode='Auxiliary';m.podWeapon1='mw_pistol';let q=normalizePilot(JSON.parse(JSON.stringify(p)),[]);q.mechs[0].sentryWeapon===m.sentryWeapon&&q.mechs[0].beltMount===m.beltMount&&q.mechs[0].podWeapon1==='mw_pistol'&&sentryWeapons(q,q.mechs[0]).length===1}`)));
test('Mitra consumes an AI slot, limited systems receive Engineering bonuses',()=>assert(run(`{p=fixture(6);m=p.mechs[0];m.systems=['ms_pl_mitra','ms_comp_con_class_assistant_unit'];p.hase.eng=4;loadoutChecks(p,m).some(x=>x[1].includes('AI 数量超限'))&&limitedTags(SYSTEMS.ms_pl_ontological_pulse.tags,p,m).some(t=>t.id==='tg_limited'&&t.val===3)}`)));
test('All professional catalogs, systems and modular loadouts render',()=>assert(run(`{p=fixture(6);for(const def of D.professional_licenses)addCatalogProfessional(p,def.id);m=p.mechs[0];m.systems=['ms_pl_sentry_drone','ms_pl_weapon_pod','ms_pl_tactical_belt'];const mt=mountsOf(p,m).find(x=>x.type==='Main');m.loadout[mt.key]={slots:[{w:'mw_pl_modular_rifle',mod:'wm_pl_optimized',mod2:'wm_nanocomposite_adaptation',profile:1}],link:''};professionalPanel(p).includes('斗篷')&&Object.values(mechParts(p)).join('').includes('第二模组')&&Object.values(mechParts(p)).join('').includes('舱内武器')&&weaponRows(p,m).length>0}`)));

test('Wizard license step includes professionals and uses the shared paid-rank budget',()=>assert(run(`{p=fixture(3);addCatalogProfessional(p,'pl_ha_superfire');addCatalogProfessional(p,'pl_ha_workshop');const step=WIZ_STEPS.find(x=>x.id==='licenses');step.check(p).length===0&&step.body(p).includes('专业牌照目录')&&pilotLicenseLines(p).some(x=>x.includes('铸造车间'))}`)));
test('Weapon pod preserves the modular rifle printed profile through exchange and import',()=>assert(run(`{p=fixture(6);m=p.mechs[0];addCatalogProfessional(p,'pl_ha_workshop');m.systems=['ms_pl_weapon_pod'];m.podMode='Main';m.podWeapon1='mw_pl_modular_rifle';m.podProfile1=1;const mt=mountsOf(p,m).find(x=>x.type==='Main');m.loadout[mt.key]={slots:[{w:'mw_assault_rifle'}],link:''};swapPodWeapons(p,m,mt.key);const first=equippedWeapons(p,m)[0].w.selected_profile==='DMR';swapPodWeapons(p,m,mt.key);const q=normalizePilot(JSON.parse(JSON.stringify(p)),[]);first&&m.podProfile1===1&&q.mechs[0].podProfile1===1}`)));
test('Confirmed linear-field and Mitra wording is present',()=>assert(run(`WEAPONS.mw_pl_kinetic_driver.profiles[1].on_hit.includes('每有 1 点装甲')&&SYSTEMS.ms_pl_mitra.actions[0].detail.includes('任选两项')`)));
test('Tawa Heavy Blaster keeps its name instead of the crit term',()=>assert.equal(run(`plain('item',WEAPONS.mw_pl_heavy_blaster)`),'重击炮'));
test('Tactical belt recognizes Deployable type and dual-mode Grenade/Mine systems',()=>assert(run(`{
  const ok=['ms_ext_informant_vald','ms_pattern_a_jericho_deployable_cover','ms_aegis_shield_generator','ms_portable_bunker','ms_ch_spider_bombs','ms_ch_sling_bombs','ms_ch_holo_bombs','ms_pl_scan_bombs','ms_ext_spear_charges','ms_ext_spike_charges','ms_ext_blink_charges','ms_piof_overgrowth_explosives','ms_kkca_suppression_explosives'];
  const no=['ms_pl_tactical_belt','ms_ext_accelerate','ms_ext_demolitions_toolkit','ms_clamp_bombs','ms_pl_atg_bombs'];
  ok.every(id=>beltEligible(SYSTEMS[id]))&&no.every(id=>!beltEligible(SYSTEMS[id]))
}`)));
test('Tactical belt discounts Informant VALD, locks empty mount and blocks occupied mount discount',()=>assert(run(`{
  p=fixture(6);addCatalogProfessional(p,'pl_ch_shepherd');p.licenses.mf_ext_amber_phantom=3;m=p.mechs[0];
  m.systems=['ms_pl_tactical_belt','ms_ext_informant_vald'];m.beltMount='m1';m.beltSystem1='ms_ext_informant_vald';
  const parts=mechParts(p);
  const active=tacticalBeltDiscount(p,m)===2&&mechStats(p,m).spUsed===0&&professionalLoadoutChecks(p,m).length===0&&parts.weapons.includes('被战术带占用')&&parts.systems.includes('告密者 VALD');
  m.loadout.m1={slots:[{w:'mw_assault_rifle'}],link:''};
  const blocked=tacticalBeltDiscount(p,m)===0&&mechStats(p,m).spUsed===2&&professionalLoadoutChecks(p,m).some(x=>x[1].includes('不能安装武器'));
  active&&blocked
}`)));
test('Tactical belt allows two copies of non-unique system and cleans stale references on delete',()=>assert(run(`{
  p=fixture(6);m=p.mechs[0];const dup=D.systems.find(s=>beltEligible(s)&&!isUnique(s)&&(s.sp||0)>0);
  m.systems=['ms_pl_tactical_belt',dup.id,dup.id];m.beltMount='m0';m.beltSystem1=dup.id;m.beltSystem2=dup.id;
  const twoOk=beltSystems(m).length===2&&tacticalBeltDiscount(p,m)===Math.min(4,(dup.sp||0)*2)&&professionalLoadoutChecks(p,m).length===0;
  m.systems.pop();
  const oneErr=professionalLoadoutChecks(p,m).some(x=>x[1].includes('不能重复指定'));
  cleanMechSystemRefs(m);
  const cleanedOne=m.beltSystem1===dup.id&&m.beltSystem2===''&&professionalLoadoutChecks(p,m).length===0;
  m.systems=['ms_pl_tactical_belt'];cleanMechSystemRefs(m);
  const cleanedAll=m.beltSystem1===''&&m.beltSystem2==='';
  m.systems=[];cleanMechSystemRefs(m);
  twoOk&&oneErr&&cleanedOne&&cleanedAll&&m.beltMount===''
}`)));
test('Suldan professional license source audit fixes apply to rules and checks',()=>{
  assert.equal(run("WEAPONS.mw_pl_buckler.effect.includes('作为反应发起的攻击')&&!WEAPONS.mw_pl_buckler.effect.includes('对所有伤害')"),true);
  assert.equal(run("stripHtml(WEAPONS.mw_pl_valkyrie.effect).includes('非飞行目标时 +1 难度')&&stripHtml(WEAPONS.mw_pl_valkyrie.effect).includes('飞行或更高高度的目标时 +1 准度')&&WEAPONS.mw_pl_valkyrie.on_hit.includes('不受到任何伤害')"),true);
  assert.equal(run("SYSTEMS.ms_pl_active_defense.sp"),2);
  assert.equal(run("isUnique(MODS.wm_pl_optimized)"),true);
  assert.equal(run("{p=fixture(6);addCatalogProfessional(p,'pl_ips_watchman');addCatalogProfessional(p,'pl_ha_workshop');p.licenses={mf_nelson:1,mf_barbarossa:1};m=p.mechs[0];const mt0=mountsOf(p,m).find(x=>x.type==='Main'),mt2=mountsOf(p,m).find(x=>x.type==='Heavy');m.loadout[mt0.key]={slots:[{w:'mw_pl_modular_rifle',mod:'wm_pl_optimized',profile:2}],link:''};m.loadout[mt2.key]={slots:[{w:'mw_heavy_machine_gun',mod:'wm_pl_optimized'}],link:''};m.systems=['ms_pl_sentry_drone'];m.sentryWeapon=mt2.key+'|0';const eq=equippedWeapons(p,m)[0];eq.w.effect.includes('反应发起的攻击')&&eq.w.effect.includes('两个模组')&&sentryWeapons(p,m).some(e=>e.w.id==='mw_heavy_machine_gun')&&professionalLoadoutChecks(p,m).length===0&&SYSTEMS.ms_pl_sentry_drone.effect.includes('核心奖励')&&checks(p).some(x=>x[1].includes('独特装备'))}"),true);
});

test('Core Rulebook audit fixes: pipeline, glossary, gear, frames, bonuses, talents, weapons & systems',()=>{
  // 1. Pipeline global/local replacement guards
  assert(!run("JSON.stringify(Z.talents['Crack Shot']).includes('稳定瞄准具校正')||JSON.stringify(Z.talents['Crack Shot']).includes('辅助瞄准具校正器')"));
  assert(run("Z.talents['Crack Shot'].ranks[0].html.includes('稳定瞄准')&&Z.talents['Crack Shot'].desc.includes('辅助瞄准器')"));
  assert(run("SYSTEMS.ms_h0r_os_system_upgrade_i.actions[0].detail.includes('危险地形区域')&&!SYSTEMS.ms_h0r_os_system_upgrade_i.actions[0].detail.includes('超温危域')"));
  assert(run("FRAMES.mf_barbarossa.core_system.active_effect.includes('下方内建武器')&&!FRAMES.mf_barbarossa.core_system.active_effect.includes('武器一体化')"));
  // 2. Glossary & core tags
  assert(run("getGlossary().list.find(g=>g.term==='受扰').def.includes('受益于科技动作')&&!getGlossary().list.find(g=>g.term==='受扰').def.includes('从反应中受益')"));
  assert(run("getGlossary().list.find(g=>g.term==='伏卧').def.includes('困难地形')&&getGlossary().list.find(g=>g.term==='伏卧').def.includes('不会触发守望')"));
  assert(run("TAGS.tg_deployable.description.includes('固定5回避')&&!getGlossary().list.find(g=>g.term==='可展开').def.includes('每级大小拥有回避5')"));
  assert(run("TAGS.tg_overkill.description.includes('掷出1')&&!TAGS.tg_overkill.description.includes('{VAL}')"));
  assert.equal(run("tagText({id:'tg_inaccurate'})"),'不准');
  // 3. Frames & Core Bonuses
  assert(run("FRAMES.mf_drake.traits[1].description.includes('溅射、爆发、线形和锥形')&&!actsHtml(FRAMES.mf_drake.core_system).includes('堡垒掩体')"));
  assert(run("FRAMES.mf_napoleon.core_system.active_effect.includes('盾牌标签')&&FRAMES.mf_napoleon.core_system.active_effect.includes('不能超限')"));
  assert(run("FRAMES.mf_nelson.core_system.active_effect.includes('散兵')&&FRAMES.mf_nelson.traits[1].actions[0].name==='散兵'"));
  assert(run("Z.cb['All-Theater Movement Suite'].html.includes('任何及全部移动')&&Z.cb['Briareos Frame'].html.includes('不超过1点')&&Z.cb['Briareos Frame'].html.includes('如常修复')"));
  assert(run("Z.cb['Fomorian Frame'].html.includes('不会被体型小于你的角色')&&Z.cb['Integrated Weapon'].html.includes('其他')&&Z.cb['The Lesson of Transubstantiation'].html.includes('由你选择的')"));
  // 4. Talents, Backgrounds & Triggers
  assert(run("Z.talents.Infiltrator.ranks[1].html.includes('命中时')&&Z.talents['Heavy Gunner'].ranks[0].html.includes('随后此效果结束')&&Z.talents['Heavy Gunner'].ranks[2].html.includes('对你造成的伤害')"));
  assert(run("Z.talents.Leader.ranks[1].html.includes('其他任何玩家的回合')&&Z.talents.Stormbringer.ranks[2].html.includes('直到其下一回合结束')"));
  assert(run("Z.talents.Hacker.ranks[0].html.includes('被推动')&&Z.talents.Hacker.ranks[1].html.includes('关机')&&Z.talents['Siege Specialist'].ranks[0].html.includes('一个<b>大小1</b>部分')"));
  assert(run("Z.talents.Engineer.ranks[1].html.includes('选择以下两项')&&!Z.talents.Engineer.ranks[1].html.includes('最多两项')&&Z.talents.Executioner.ranks[2].html.includes('重掷该次攻击')"));
  assert.equal(run("p=fixture();p.background='pbg_far_field_team';bgSuggestedSkills(p).map(s=>s.id).join()"),'sk_survive,sk_investigate,sk_spot,sk_charm');
  assert(run("Z.skills.charm.html.includes('安抚劝阻他人')&&Z.skills['act unseen or unheard'].html.includes('悄悄拔枪')&&Z.skills['get a hold of something'].html.includes('牌照等级限制')"));
  // 5. Weapons, Mods, Systems & UI presentation
  assert(run("!actsHtml(WEAPONS.mw_tachyon_lance).includes('每轮1次')&&WEAPONS.mw_annihilation_nexus.on_attack.includes('属于你的任何无人机')"));
  assert(run("SYSTEMS.ms_caltrop_launcher.effect.includes('溅射1')&&!actsHtml(SYSTEMS.ms_caltrop_launcher).includes('大小3')&&!actsHtml(SYSTEMS.ms_javelin_rockets).includes('爆发1')"));
  assert(run("actsHtml(SYSTEMS.ms_h0r_os_system_upgrade_ii).includes('快速科技')&&actsHtml(SYSTEMS.ms_h0r_os_system_upgrade_ii).includes('大小同目标')&&!actsHtml(SYSTEMS.ms_h0r_os_system_upgrade_ii).split('伪像')[1].includes('大小2')"));
  assert(run("SYSTEMS.ms_armor_lock_plating.effect.includes('直到你下一回合结束')&&!SYSTEMS.ms_armor_lock_plating.effect.includes('再下一回合')"));
  assert(run("actsHtml(SYSTEMS.ms_reinforced_cabling).includes('自由动作')&&actsHtml(SYSTEMS.ms_clamp_bombs).includes('快速动作')&&SYSTEMS.ms_turret_drones.effect.includes('每架已部署的炮塔无人机每轮可使用一次')"));
  assert(run("!tagsPlain(MODS.wm_paracausal_mod.tags).includes('不可减免')&&modRestrictionsText(MODS.wm_thermal_charge).includes('近战')"));
  assert(run("{STAT_CTX={};const hh=actsHtml(FRAMES.mf_hydra.core_system);!hh.includes('NaN')&&!hh.includes('None部署')&&hh.includes('快速动作召回')}"));
  assert(run("['pg_corrective','pg_patch','pg_stims','pg_thermite_charge','pg_sleeping_bag'].every(id=>pilotGearActionText(GEAR[id]).length>0)"));
  assert(run("systemLibraryActivations(SYSTEMS.ms_h0r_os_system_upgrade_ii).includes('Quick Tech')&&systemLibraryActivations(SYSTEMS.ms_pattern_a_jericho_deployable_cover).includes('Quick')&&systemLibraryActivations(SYSTEMS.ms_flash_charges).includes('Quick')"));
  // 6. Weapon note & profile edge cases
  assert(run("{p=fixture(6,'mf_deaths_head');p.coreBonuses=['cb_auto_stabilizing_hardpoints','cb_gyges_frame'];m=p.mechs[0];m.stabilized='m0';!buildWeaponNote(p,m,{w:WEAPONS.mw_gravity_gun,mount:{key:'m0',type:'Heavy'},i:0})&&!buildWeaponNote(p,m,{w:WEAPONS.mw_mimic_gun,mount:{key:'m0',type:'Heavy'},i:0}).includes('+1准度')&&effectiveProfile(WEAPONS.mw_ch_model96,WEAPONS.mw_ch_model96.profiles[0],null,p,m).range.find(r=>r.type==='Threat').val===2&&effectiveProfile(WEAPONS.mw_ch_model96,WEAPONS.mw_ch_model96.profiles[1],null,p,m).range.find(r=>r.type==='Threat').val===1}"));
  assert.equal(run("effectiveProfile(WEAPONS.mw_combat_drill,null,MODS.wm_ext_hypermass_mod,fixture(),blankMech()).tags.filter(t=>t.id==='tg_overkill').length"),1);
});

test('Expansion audit fixes: KTB backgrounds, Viceroy, Tagetes, Curveball, Red Admiral, dual-type mods, profiles, variant mutex & Spaceborn EVA',()=>{
  // 1. KTB backgrounds provide structured trigger suggestions in wizard
  assert.equal(run("p=fixture();p.background='pbg_ext_noble_heir';bgSuggestedSkills(p).map(s=>s.id).join()"),'sk_lead_or_inspire,sk_pull_rank,sk_read_a_situation,sk_take_control');
  // 2. GMS variant frames have license_level 0; non-GMS base + variant in same pilot mech list triggers mutex error
  assert(run("FRAMES.mf_ext_chomolungma.license_level===0&&FRAMES.mf_ext_sagarmatha.license_level===0"));
  assert(run("{p=fixture(3,'mf_minotaur');p.licenses={mf_minotaur:2};p.mechs.push(blankMech('mf_ext_calendula'));checks(p).some(c=>c[1].includes('互斥'))}"));
  // 3. Red Admiral Main Melee +1 Threat bonus
  assert.equal(run("{p=fixture(3,'mf_ext_red_admiral');p.licenses={mf_nelson:2};effectiveProfile(WEAPONS.mw_charged_blade,null,null,p,p.mechs[0]).range.find(r=>r.type==='Threat').val}"),2);
  // 4. Viceroy Launcher -> also CQB + Threat 3 + CQB mods allowed
  assert(run("{p=fixture(3,'mf_ext_viceroy');p.licenses={mf_monarch:2,mf_ext_caliban:1};m=p.mechs[0];const ep=effectiveProfile(WEAPONS.mw_rocket_propelled_grenade,null,null,p,m);canModify(WEAPONS.mw_rocket_propelled_grenade,MODS.wm_ext_hypermass_mod,{type:'Main'},m)&&ep.range.some(r=>r.type==='Threat'&&r.val===3)&&ep.range.some(r=>r.type==='Range'&&r.val===10)}"));
  // 5. Tagetes optional Fusilier converts ranged non-Rifle weapon to Rifle + Overkill
  assert(run("{p=fixture(3,'mf_ext_tagetes');p.licenses={mf_sherman:2};m=p.mechs[0];m.loadout.m1={slots:[{w:'mw_mortar',fusilier:true}],link:''};const cw=configuredWeapon(WEAPONS.mw_mortar,m,m.loadout.m1.slots[0]);cw.type==='Rifle'&&cw.tags.some(t=>t.id==='tg_overkill')&&buildWeaponNote(p,m,{w:cw,mount:{key:'m1',type:'Main'},i:0}).includes('枪决')}"));
  // 6. Curveball adds +2 limited charges to Grenade systems only
  assert(run("{p=fixture(3);p.coreBonuses=['cb_piof_curveball'];m=p.mechs[0];systemTags(SYSTEMS.ms_pattern_a_smoke_charges,p,m).find(t=>t.id==='tg_limited').val===5&&systemTags(SYSTEMS.ms_eva_module,p,m).every(t=>t.id!=='tg_limited')}"));
  // 7. Dual-type weapons accept mods of both types and non-Melee mods (wm_pl_optimized)
  assert(run("canModify(WEAPONS.mw_ch_model96,MODS.wm_stabilizer_mod,{type:'Main'})&&canModify(WEAPONS.mw_ch_model96,MODS.wm_pl_optimized,{type:'Main'})&&!canModify(WEAPONS.mw_charged_blade,MODS.wm_pl_optimized,{type:'Main'})"));
  // 8. Special weapon restrictions: Slipgun (no_mods/no_core_bonus/no_attack) & Tangle Cannon (no_bonus_damage)
  assert(run("!canModify(WEAPONS.mw_ext_ifrit_slip,MODS.wm_ext_hypermass_mod,{type:'Main'})"));
  assert(run("{p=fixture(3,'mf_deaths_head');p.coreBonuses=['cb_overpower_caliber','cb_auto_stabilizing_hardpoints'];m=p.mechs[0];m.loadout.m0={slots:[{w:'mw_ext_ifrit_slip'}],link:''};m.loadout.m1={slots:[{w:'mw_ch_tangle_cannon'}],link:''};m.stabilized='m0';m.overpower='m1|0';!buildWeaponNote(p,m,{w:WEAPONS.mw_ext_ifrit_slip,mount:{key:'m0',type:'Main/Aux'},i:0})&&loadoutChecks(p,m).some(c=>c[1].includes('超功率口径'))}"));
  // 9. Multi-profile 5-stance index preserved on normalizePilot; Spaceborn I grants integrated EVA; Private Tutor reflected in pageIntro
  assert.equal(run("normalizePilot({mechs:[{frame:EVEREST,loadout:{m0:{slots:[{w:'mw_ext_terashima_blade',profile:4,fusilier:true}]}}}]},[]).mechs[0].loadout.m0.slots[0].profile"),4);
  assert(run("{p=fixture(3);p.talents={t_ext_void_native:1,t_ace:1,t_combined_arms:1};p.coreBonuses=['cb_kkca_private_tutor'];integratedOf(FRAMES[EVEREST],p,p.mechs[0]).some(x=>x.id==='ms_spaceborn_1')&&pageIntro(p).includes('/8</b>')}"));
  // 10. Removing Weapon Pod clears podWeapon1/2; active expansion systems & Emperor Tech systems categorized properly in System Library
  assert(run("{m=blankMech();m.systems=['ms_pl_weapon_pod'];m.podWeapon1='mw_assault_rifle';m.podWeapon2='mw_pistol';m.systems=[];cleanMechSystemRefs(m);m.podWeapon1===''&&m.podWeapon2===''}"));
  assert(run("['ms_ext_chimney_cold_source','ms_ext_wodeng_counterfire','ms_ext_cbnrn_sealing','ms_kkca_cricket_art_1','ms_ext_judas_exploit','ms_ch_submunitions'].every(id=>!systemLibraryActivations(SYSTEMS[id]).includes('Passive'))"));
  assert(run("['ms_ext_wide_dominion','ms_ext_emperors_eye','ms_ext_book_of_kings','ms_ext_sovereign_gait'].every(id=>SYSTEMS[id].type==='Tech')&&!systemLibraryTypes(SYSTEMS.ms_ext_rmj_nozzles).includes('Shield')"));
});

console.log(passed+' regression checks passed.');
