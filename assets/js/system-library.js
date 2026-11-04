// Read-only equipment catalogue. Filters never alter the current loadout.
const systemLibraryDefaults=()=>({q:'',kind:'',type:'',src:'',activation:'',sp:'',avail:false});
const systemLibraryState=systemLibraryDefaults();
const SYSTEM_LIBRARY_TYPES={AI:'AI',Drone:'无人机',Shield:'护盾',Deployable:'可展开物',Mine:'地雷',Grenade:'榴弹',Mod:'武器改装',Other:'其他系统'};
function systemLibraryItems(){return [...D.systems,...D.mods];}
function systemLibraryOrigin(it){
 if(it.professional_license){const lic=(D.professional_licenses||[]).find(x=>x.id===it.professional_license);return {key:it.source,text:`${makerName(it.source)} · ${lic?.name||it.license}（专业牌照）`};}
 return weaponOrigin(it);
}
function systemLibraryAvailable(it,p){
 if(it.talent_item)return [...talentEquipment(p,'integrated'),...talentEquipment(p,'special_equipment')].some(x=>x.id===it.id);
 if(it.source)return itemAvailable(p,it);
 return D.frames.some(f=>frameAvailable(p,f)&&[...(f.core_system?.integrated||[]),...f.traits.flatMap(t=>t.integrated||[])].includes(it.id));
}
function systemLibraryTypes(it){
 if(MODS[it.id])return ['Mod'];
 const types=new Set();const mapping={tg_ai:'AI',tg_drone:'Drone',tg_shield:'Shield',tg_deployable:'Deployable',tg_mine:'Mine',tg_grenade:'Grenade'};
 for(const tag of systemTags(it))if(mapping[tag.id])types.add(mapping[tag.id]);
 if(SYSTEM_LIBRARY_TYPES[it.type])types.add(it.type);
 for(const dep of asList(it.deployables))if(SYSTEM_LIBRARY_TYPES[dep.type])types.add(dep.type);
 if(it.id==='ms_roller_directed_payload_charges')types.add('Grenade'); // This item has separate grenade and mine modes.
 return types.size?[...types]:['Other'];
}
function systemLibraryActivations(it){
 const out=new Set(),mapping={tg_quick_action:'Quick',tg_full_action:'Full',tg_protocol:'Protocol',tg_reaction:'Reaction',tg_free_action:'Free'};
 for(const tag of systemTags(it))if(mapping[tag.id])out.add(mapping[tag.id]);
 function collect(o){for(const k of ['actions','active_actions','passive_actions'])for(const a of asList(o[k]))if(a.activation&&a.activation!=='None')out.add(a.activation);for(const k of ['deployables','active_deployables'])for(const d of asList(o[k])){if(d.activation)out.add(d.activation);collect(d);}}
 collect(it);if(it.activation)out.add(it.activation);
 return out.size?[...out]:['Passive'];
}
function systemLibraryEffect(it){return (it.effect?`<p>${it.effect}</p>`:'')+actsHtml(it)+equipmentLoreHtml(it)||'<span class="muted">—</span>';}
function systemLibraryMatches(it,p){
 const s=systemLibraryState,o=systemLibraryOrigin(it),mod=!!MODS[it.id];
 if(s.kind&&(s.kind==='mods')!==mod)return false;
 if(s.type&&!systemLibraryTypes(it).includes(s.type))return false;
 if(s.src==='core'?it.ext:s.src==='ext'?!it.ext:s.src&&o.key!==s.src)return false;
 if(s.activation&&!systemLibraryActivations(it).includes(s.activation))return false;
 if(s.sp!==''&&(s.sp==='4+'?(it.sp||0)<4:(it.sp||0)!==Number(s.sp)))return false;
 if(s.avail&&!systemLibraryAvailable(it,p))return false;
 const q=s.q.trim().toLocaleLowerCase();
 return !q||`${plain('item',it)} ${it.name} ${o.text} ${it.license||''} ${it.pack||''} ${systemLibraryTypes(it).map(t=>SYSTEM_LIBRARY_TYPES[t]).join(' ')} ${systemLibraryActivations(it).map(a=>ACT[a]||a).join(' ')} ${tagsPlain(systemTags(it))} ${stripHtml(systemLibraryEffect(it))}`.toLocaleLowerCase().includes(q);
}
function renderSystemLibrary(){
 const box=document.getElementById('systemLibrary');if(!box?.querySelector)return;
 const p=P(),s=systemLibraryState,items=systemLibraryItems();
 const select=(key,label,options)=>`<label class="filter-field"><span>${label}</span><select data-sl="${key}">${options.map(([v,t])=>`<option value="${esc(v)}" ${s[key]===v?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
 box.querySelector('.sl-filters').innerHTML=
  select('kind','装备类别',[['','全部装备'],['systems','系统'],['mods','武器改装']])+
  select('type','类型',[['','全部类型'],...Object.entries(SYSTEM_LIBRARY_TYPES)])+
  select('src','来源',[['','全部来源'],...MAKERS.map(m=>[m,makerName(m)]),['talent','天赋'],['integrated','骨架内建'],['core','核心规则书'],['ext','扩展']])+
  select('activation','动作',[['','全部动作'],...['Quick','Full','Protocol','Reaction','Free'].map(a=>[a,ACT[a]]),['Passive','被动／未标明动作']])+
  select('sp','基础 SP',[['','全部 SP'],...['0','1','2','3'].map(n=>[n,n+' SP']),['4+','4 SP及以上']])+
  `<label class="chk"><input type="checkbox" data-sl="avail" ${s.avail?'checked':''}>只看当前角色可用</label>`;
 const rows=items.filter(it=>systemLibraryMatches(it,p)).sort((a,b)=>systemLibraryOrigin(a).text.localeCompare(systemLibraryOrigin(b).text,'zh')||(a.license_level||0)-(b.license_level||0)||plain('item',a).localeCompare(plain('item',b),'zh'));
 box.querySelector('.sl-count').textContent=`${rows.length} / ${items.length} 项装备（系统 ${D.systems.length}、改装 ${D.mods.length}）`;
 box.querySelector('.sl-body').innerHTML=rows.length?rows.map(it=>`<tr class="${systemLibraryAvailable(it,p)?'':'locked'}"><td class="wt-name"><b>${esc(plain('item',it))}</b>${extBadge(it)}${it.name!==plain('item',it)?`<small>${esc(it.name)}</small>`:''}</td><td>${esc(systemLibraryOrigin(it).text)}</td><td>${esc(systemLibraryTypes(it).map(t=>SYSTEM_LIBRARY_TYPES[t]).join('、'))}</td><td>${it.sp||0}</td><td>${esc(tagsPlain(systemTags(it)))||'—'}</td><td class="wt-effect">${systemLibraryEffect(it)}</td></tr>`).join(''):'<tr><td colspan="6" class="empty-state">没有符合条件的系统或改装。可减少筛选条件，或点击重置。</td></tr>';
 highlightTerms(box.querySelector('.sl-body'));
}
function openSystemLibrary(){const box=document.getElementById('systemLibrary');if(!box)return;closeWeaponTable();box.hidden=false;renderSystemLibrary();box.querySelector('[data-sl="q"]').focus();}
function closeSystemLibrary(){const box=document.getElementById('systemLibrary');if(box)box.hidden=true;document.querySelector('[data-ui="openSystemLibrary"]')?.focus();}
document.addEventListener('input',e=>{if(e.target.dataset?.sl==='q'){systemLibraryState.q=e.target.value;renderSystemLibrary();}});
document.addEventListener('change',e=>{const k=e.target.dataset?.sl;if(k&&k!=='q'&&Object.hasOwn(systemLibraryState,k)){systemLibraryState[k]=e.target.type==='checkbox'?e.target.checked:e.target.value;renderSystemLibrary();}});
document.addEventListener('click',e=>{
 if(e.target.closest?.('[data-ui="openSystemLibrary"]'))openSystemLibrary();
 if(e.target.closest?.('[data-ui="closeSystemLibrary"]'))closeSystemLibrary();
 if(e.target.closest?.('[data-ui="resetSystemLibrary"]')){Object.assign(systemLibraryState,systemLibraryDefaults());document.querySelector('[data-sl="q"]').value='';renderSystemLibrary();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('systemLibrary')?.hidden)closeSystemLibrary();});
