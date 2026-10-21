"use strict";
// UI-only state stays separate from character exports.
const uiState = { talentQuery: '', selectedTalents: false, systemQuery: '' };

function pageIntro(p) {
  const content = {
    pilot: ['驾驶员档案','从身份与背景开始，记录你的触发和随身装备。'],
    progress: ['等级与成长','分配能力、牌照和天赋；随时核对剩余点数。'],
    mech: ['机甲整备','选择骨架，配置武器与系统，检查你的出击准备。'],
    sheet: ['角色卡与备份','把角色卡带到游戏桌，也为下一次编辑保留备份。']
  }[tab];
  const level=LV(p.ll), spent=Object.values(p.talents).reduce((n,r)=>n+r,0);
  return `<section class="page-intro"><div><p class="eyebrow">${esc(p.callsign || p.name || '新驾驶员')} · LL${p.ll}</p><h1>${content[0]}</h1><p>${content[1]}</p></div><div class="resource-summary"><span>毅力 <b>+${level.grit}</b></span><span>天赋 <b>${spent}/${level.talents}</b></span><span>机甲 <b>${p.mechs.length}</b></span></div></section>${db.ignoreLimits ? '<div class="gm-banner" role="status">GM 模式已开启：可选未解锁的装备与骨架。<button data-ui="disableGM">恢复牌照限制</button></div>' : ''}`;
}
function talentToolbar() {
  return `<div class="catalog-toolbar"><label class="search-field"><span>查找天赋</span><input type="search" data-ui="talentSearch" value="${esc(uiState.talentQuery)}" placeholder="中文、英文名称或效果关键词"></label><label class="chk"><input type="checkbox" data-ui="selectedTalents" ${uiState.selectedTalents?'checked':''}>只看已选</label><button data-ui="resetTalents">重置筛选</button><span class="muted" data-talent-count role="status"></span></div><p class="empty-state" data-talent-empty hidden>没有匹配的天赋，试试其他关键词或重置筛选。</p>`;
}
function filterTalents() {
  const q=uiState.talentQuery.trim().toLocaleLowerCase();
  const rows=[...document.querySelectorAll('[data-talent-row]')];
  let count=0;
  rows.forEach(row=>{
    row.hidden=!(row.textContent.toLocaleLowerCase().includes(q) && (!uiState.selectedTalents || row.dataset.selected==='true'));
    if(!row.hidden) count++;
  });
  document.querySelectorAll('[data-talent-count]').forEach(el=>el.textContent=`显示 ${count} / ${rows.length} 项`);
  document.querySelectorAll('[data-talent-empty]').forEach(el=>el.hidden=count>0);
}
function filterSystems() {
  const select=document.getElementById('sysAdd');
  if(!select?.options) return;
  const current=select.value, q=uiState.systemQuery.trim().toLocaleLowerCase(), p=P(), m=M();
  const available=s=>!(isUnique(s)&&m.systems.includes(s.id)) && (!q || `${plain('item',s)} ${s.name} ${s.source} ${stripHtml(s.effect)}`.toLocaleLowerCase().includes(q));
  select.innerHTML='<option value="">— 选择系统 —</option>'+itemOptions(p,D.systems,'',available);
  if([...select.options].some(o=>o.value===current)) select.value=current;
  const count=select.options.length-1;
  const hint=document.getElementById('systemSearchCount');
  if(hint) hint.textContent=count ? `${count} 项可用系统` : '没有匹配的可用系统；试试其他关键词。';
  const install=document.querySelector('[data-act="addSys"]');
  if(install) install.disabled=!select.value;
}
function changeFrame(m,id) {
  if(m.frame===id) return true;
  const equipped=Object.values(m.loadout).some(s=>s.slots?.some(slot=>slot.w));
  if(equipped&&!confirm('切换骨架会清空当前机甲的武器挂载与挂载点设置。系统会保留。\n\n建议先通过「角色管理」复制角色或导出备份。确定切换吗？')) return false;
  m.frame=id; m.loadout={}; m.retrofit=-1; m.stabilized=''; m.overpower='';
  return true;
}
function enhanceUI() {
  const app=document.getElementById('app');
  if(!app.querySelector) return; // Headless rule tests do not implement a browser DOM.
  document.querySelectorAll('.tabs [data-tab]').forEach(b=>{if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  const names={name:'驾驶员名字',callsign:'呼号',player:'玩家名字',background:'背景',bgCustom:'自创背景',bio:'外貌与经历','mech.name':'机甲名称','mech.frame':'机甲骨架','mech.notes':'机甲备注'};
  app.querySelectorAll('input,select,textarea').forEach(el=>{
    if(el.getAttribute('aria-label')||el.id&&document.querySelector(`label[for="${el.id}"]`)||el.closest('label')) return;
    const label=names[el.dataset.k] || el.closest('.row')?.querySelector('label')?.textContent || el.closest('.slot')?.previousElementSibling?.textContent || el.placeholder || el.closest('.card')?.querySelector('h3')?.textContent || '配置';
    el.setAttribute('aria-label',label.trim());
  });
  app.querySelectorAll('[data-act="delSys"]').forEach(el=>el.setAttribute('aria-label','移除系统 '+el.closest('.list-item').querySelector('.li-title').textContent));
  app.querySelectorAll('[data-act="delTrig"]').forEach(el=>el.setAttribute('aria-label',`移除触发 ${+el.dataset.arg+1}`));
  filterTalents(); filterSystems();
}
document.addEventListener('input',e=>{
  if(e.target.dataset.ui==='talentSearch'){uiState.talentQuery=e.target.value;filterTalents();}
  if(e.target.dataset.ui==='systemSearch'){uiState.systemQuery=e.target.value;filterSystems();}
});
document.addEventListener('change',e=>{
  if(e.target.dataset.ui==='selectedTalents'){uiState.selectedTalents=e.target.checked;filterTalents();}
  if(e.target.id==='sysAdd'){const b=document.querySelector('[data-act="addSys"]');if(b)b.disabled=!e.target.value;}
});
document.addEventListener('click',e=>{
  const action=e.target.closest('[data-ui]')?.dataset.ui;
  if(action==='resetTalents') {uiState.talentQuery='';uiState.selectedTalents=false;render();document.querySelector('[data-ui="talentSearch"]')?.focus();}
  if(action==='disableGM'){db.ignoreLimits=false;render();}
  const menu=document.getElementById('characterMenu');
  if(menu && (!e.target.closest('.character-menu') || e.target.closest('button'))) menu.open=false;
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') {const menu=document.getElementById('characterMenu');if(menu?.open){menu.open=false;menu.querySelector('summary').focus();}}
});
// Details elements must actually open for reliable printing across browsers.
let printClosed=[];
window.addEventListener?.('beforeprint',()=>{
  printClosed=[...document.querySelectorAll('.text-sheet:not([open])')];
  printClosed.forEach(el=>el.open=true);
});
window.addEventListener?.('afterprint',()=>{printClosed.forEach(el=>el.open=false);printClosed=[];});
