/* 骨架目录：浏览状态不写入角色，只有确认使用后才改变配装。 */
const frameBrowse = { open:false, preview:'', owner:'' };
const frameRoles = f => f.required_core_bonus ? '备用机甲' : f.mechtype.map(r => T.role[r] || r).join(' / ');
const frameSize = s => s === 0.5 ? '½' : s;
function frameVariantDescription(f) {
  if(!f.variant_of)return '';
  return f.variant_of===EVEREST
    ? `${variantNote(f)}：LL0 起即可自由选用，无需购买牌照。`
    : `${variantNote(f)}：与标准骨架共用牌照 II，打印时选择其中一种；装备沿用原牌照。`;
}
function frameAccess(p,f) {
  if(f.required_core_bonus) return `需要核心奖励「${CBS[f.required_core_bonus].name}」 · ${p.coreBonuses.includes(f.required_core_bonus)?'已取得':'未取得'}`;
  if ([f.id,f.variant_of].includes(EVEREST)) return 'GMS · 无需牌照';
  const base=FRAMES[f.variant_of]||f, rank=p.licenses[base.id]||0;
  return `${frameName(base)} 牌照 II${db.ignoreLimits?' · GM 模式':rank>=2?' · 已解锁':` · 当前 ${['未取得','I'][rank]||rank}`}`;
}
function frameIdentity(f) {
  return `<div class="fc-identity" style="--maker:${MAKER_COLOR[f.source]||'#e0483e'}"><span class="fc-maker">${esc(f.source)}</span><div><h3>${esc(frameName(f))}</h3>${f.name!==frameName(f)?`<small>${esc(f.name)}</small>`:''}<div class="fc-tags">${f.mechtype.map(r=>`<span>${esc(T.role[r]||r)}</span>`).join('')}${extBadge(f)}${f.variant_of?'<span>变体</span>':''}</div></div></div>`;
}
function frameRulesHtml(f, prefix='frame', m=null) {
  const cs=f.core_system;
  const traits=m?mechTraits({...m,frame:f.id}):f.traits;
  return `<section class="fc-rules"><h4>骨架特征</h4>${traits.map(t=>`<article class="blk"><div class="blk-h">${esc(t.name)}</div><p>${t.description}</p>${actsHtml(t)}</article>`).join('')}
    <h4>核心系统 <small>${cs.efficient?'高效 · 场景结束时返还 1 CP':'每任务通常可启动一次'}</small></h4><article class="fc-core"><h5>${esc(cs.name)}</h5>
    ${cs.passive_name?`<div class="fc-core-part"><span class="fc-kicker">被动</span><b>${esc(cs.passive_name)}</b><p>${cs.passive_effect||''}</p></div>`:''}
    <div class="fc-core-part"><span class="fc-kicker">${esc(ACT[cs.activation]||cs.activation||'主动')} · 1 CP</span><b>${esc(cs.active_name||cs.name)}</b><p>${cs.active_effect||''}</p></div>${actsHtml(cs)}</article>
    ${extRulesNote(f)}${det(prefix+'-lore-'+f.id,'设定与骨架介绍',`<div class="fc-lore">${f.description||'暂无介绍。'}</div>`)}</section>`;
}
function frameCatalogList(p) {
  const m=M(), list=D.frames.filter(f=>frameMatches(f,p));
  if(!list.length)return '<div class="fc-empty"><b>没有找到符合条件的骨架</b><p>可以减少筛选条件，或换一个名称、特征关键词。</p><button data-ui="resetFrames">清空筛选</button></div>';
  return MAKERS.map(maker=>{
    const rows=list.filter(f=>f.source===maker);if(!rows.length)return '';
    // 保留数据中的标准骨架 / 变体顺序，厂商内不因是否解锁而拆散牌照家族。
    return `<section class="fc-group"><h4 style="--maker:${MAKER_COLOR[maker]||'#e0483e'}">${esc(makerName(maker))}<span>${rows.length}</span></h4><div class="fc-entries">${rows.map(f=>{
      const s=f.stats,available=frameAvailable(p,f),current=f.id===m.frame;
      return `<button class="fc-entry ${f.id===frameBrowse.preview?'is-preview':''}" data-ui="previewFrame" data-frame-id="${esc(f.id)}" aria-pressed="${f.id===frameBrowse.preview}" aria-label="查看${esc(frameName(f))}骨架详情">
      <span class="fc-entry-top"><b>${esc(frameName(f))}</b><span class="fc-availability ${current?'current':available?'available':''}">${current?'使用中':available?'可用':'未解锁'}</span></span>
      <span class="fc-entry-role">${esc(frameRoles(f))}${extBadge(f)}</span><span class="fc-entry-stats">大小 ${frameSize(s.size)} <i>·</i> HP ${s.hp} <i>·</i> 速度 ${s.speed} <i>·</i> SP ${s.sp}</span>
      ${f.variant_of?`<span class="fc-variant">↳ ${esc(variantNote(f))}</span>`:''}</button>`;
    }).join('')}</div></section>`;
  }).join('');
}
function framePreviewHtml(p,f) {
  if(!f)return '';
  const m=M(),s=f.stats,base=FRAMES[m.frame],current=f.id===m.frame,available=frameAvailable(p,f);
  const metrics=[['size','大小'],['hp','HP'],['armor','装甲'],['speed','速度'],['evasion','回避'],['edef','电子防御'],['heatcap','热度上限'],['repcap','维修上限'],['sensor_range','感应'],['save','豁免目标'],['tech_attack','科技攻击'],['sp','SP']];
  // 预览内的可展开物使用候选机甲的数值，避免沿用上一部机甲的上下文。
  const old=STAT_CTX,candidate={...m,frame:f.id,loadout:{},retrofit:-1,stabilized:'',overpower:''};
  let rules;try {STAT_CTX={...mechStats(p,candidate),grit:LV(p.ll).grit,drone_hp:staticBonus(p,candidate,'drone_hp'),deployable_hp:staticBonus(p,candidate,'deployable_hp')};rules=frameRulesHtml(f,'preview',candidate);}finally{STAT_CTX=old;}
  return `<button class="fc-return" data-ui="backFrameList">↑ 返回骨架目录</button><div class="fc-preview-head" tabindex="-1"><p class="fc-kicker">${current?'当前使用的骨架':'正在浏览 · 尚未换装'}</p>${frameIdentity(f)}<p class="fc-access">${esc(frameAccess(p,f))}</p>
    ${f.variant_of?`<p class="fc-note">${esc(frameVariantDescription(f))}</p>`:''}
    ${f.maker_note?`<p class="muted">${esc(f.maker_note)}</p>`:''}${f.pack&&f.pack!=='所有扩展'?`<p class="fc-source">资料来源：${esc(f.pack)}</p>`:''}
    <button class="primary fc-use" data-ui="useFrame" data-frame-id="${esc(f.id)}" ${current||!available?'disabled':''}>${current?'正在使用':available?(f.required_core_bonus?'配置为备用机':'使用这部骨架'):(f.required_core_bonus?'需要对应核心奖励':'需要对应牌照 II')}</button>
    ${!current&&available?`<p class="muted">${f.required_core_bonus?'创建独立的备用机配置，保留当前机甲配装；战斗中按核心奖励部署。':'换装时会重新配置武器挂载；已有系统保留。装有武器时会再次确认。'}</p>`:''}</div>
    <section class="fc-base"><h4>骨架基础数值</h4><p class="muted">未计入驾驶员与装备加成${!current&&base?`；括号为相对当前「${esc(frameName(base))}」的差值`:''}。</p><div class="fc-metrics">${metrics.map(([k,n])=>{
      const v=s[k]??0,delta=base&&!current?v-(base.stats[k]??0):0;
      return `<div><span>${n}</span><b>${k==='size'?frameSize(v):v}${delta?` <small class="fc-delta">(${delta>0?'+':''}${delta})</small>`:''}</b></div>`;
    }).join('')}</div><h4>武器挂载点</h4><div class="fc-mounts">${f.mounts.map(mt=>`<span>${esc(T.mount[mt]||mt)}</span>`).join('')||'<span>无常规挂载点</span>'}</div><p class="muted">内建武器见骨架特征或配装页；SP 是安装系统的容量。</p></section>
    <div class="desc">${rules}</div>${f.required_core_bonus?det('preview-cb-'+f.id,'查看康格多底盘核心奖励与部署规则',Z.cb[nk(CBS[f.required_core_bonus].name)]?.html||CBS[f.required_core_bonus].effect):[f.id,f.variant_of].includes(EVEREST)?'<p class="fc-note">埃弗勒斯及其变体与 GMS 通用装备在 LL0 即可使用，不占用牌照等级。</p>':det('preview-license-'+f.id,'查看这张牌照的 I / II / III 级内容',licenseContents(p,FRAMES[f.variant_of]||f))}<button class="fc-return" data-ui="backFrameList">↑ 返回骨架目录</button>`;
}
function frameCatalog(p,closable=false) {
  const owner=p.id+':'+p.activeMech+':'+M().frame;
  if(frameBrowse.owner!==owner||!FRAMES[frameBrowse.preview]){frameBrowse.preview=M().frame;frameBrowse.owner=owner;}
  return `<section class="frame-catalog" aria-label="骨架目录"><div class="fc-heading"><div><p class="fc-kicker">FRAME CATALOGUE · ${D.frames.length} 部骨架</p><h2>浏览骨架</h2><p>按厂商和定位缩小范围，点选卡片阅读完整规则，确认后再换装。</p></div>${closable?'<button data-ui="closeFrames">收起目录</button>':''}</div>
    ${frameToolbar()}<div class="fc-layout"><div class="fc-list" tabindex="0" aria-label="骨架浏览列表">${frameCatalogList(p)}</div><article class="fc-preview" aria-label="骨架详情">${framePreviewHtml(p,FRAMES[frameBrowse.preview])}</article></div></section>`;
}
function updateFrameCatalog() {
  const el=document.querySelector('.frame-catalog');if(!el)return;
  const list=el.querySelector('.fc-list');list.innerHTML=frameCatalogList(P());
  el.querySelectorAll('[data-frame-count]').forEach(x=>x.textContent=`找到 ${D.frames.filter(f=>frameMatches(f,P())).length} / ${D.frames.length} 部 · 基础数值`);
}
function previewFrame(id) {
  if(!FRAMES[id])return;
  frameBrowse.preview=id;
  const root=document.querySelector('.frame-catalog'),panel=root?.querySelector('.fc-preview');if(!panel)return;
  // 列表不重建，保留键盘焦点、浏览位置与搜索输入。
  root.querySelectorAll('[data-ui="previewFrame"]').forEach(b=>{b.classList.toggle('is-preview',b.dataset.frameId===id);b.setAttribute('aria-pressed',String(b.dataset.frameId===id));});
  panel.innerHTML=framePreviewHtml(P(),FRAMES[id]);panel.scrollTop=0;highlightTerms(panel);
  if(window.matchMedia('(max-width: 760px)').matches){panel.scrollIntoView({block:'start',behavior:'smooth'});panel.querySelector('.fc-preview-head').focus({preventScroll:true});}
}
function useCatalogFrame(id) {
  const f=FRAMES[id],p=P(),m=M();
  if(!f||!frameAvailable(p,f)||m.frame===id)return false;
  if(id==='mf_ext_kanggeduo') { if(!createKanggeduo(p,m))return false; frameBrowse.preview=id;frameBrowse.open=false;return true; }
  if(!changeFrame(m,id))return false;
  frameBrowse.preview=id;frameBrowse.open=false;return true;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-ui]');if(!b)return;
  switch(b.dataset.ui){
    case 'browseFrames':frameBrowse.open=true;frameBrowse.preview=M().frame;render();document.querySelector('.frame-catalog')?.scrollIntoView({block:'start'});document.querySelector('[data-ui="frameSearch"]')?.focus({preventScroll:true});break;
    case 'backFrameList':document.querySelector('.frame-catalog')?.scrollIntoView({block:'start'});document.querySelector('[data-ui="frameSearch"]')?.focus({preventScroll:true});break;
    case 'closeFrames':frameBrowse.open=false;render();document.querySelector('.mech-frame-card')?.scrollIntoView({block:'start'});document.querySelector('[data-ui="browseFrames"]')?.focus({preventScroll:true});break;
    case 'previewFrame':previewFrame(b.dataset.frameId);break;
    case 'useFrame':if(useCatalogFrame(b.dataset.frameId)){render();document.querySelector('.mech-frame-card')?.scrollIntoView({block:'start'});document.querySelector('[data-ui="browseFrames"]')?.focus({preventScroll:true});}break;
  }
});
