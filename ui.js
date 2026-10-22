"use strict";
// UI-only state stays separate from character exports.
const uiState = { talentQuery: '', selectedTalents: false, systemQuery: '', frame: { q: '', maker: '', role: '', src: '', unlocked: false } };

// ---------- 骨架筛选（机甲页选单与引导式「选择骨架」共用） ----------
function frameMatches(f, p) {
  const s = uiState.frame;
  if (s.maker && f.source !== s.maker) return false;
  if (s.role && !f.mechtype.includes(s.role)) return false;
  if (s.src === 'core' && f.ext) return false;
  if (s.src === 'ext' && !f.ext) return false;
  if (s.src === 'variant' && !f.variant_of) return false;
  if (s.src === 'license' && (!f.ext || f.variant_of)) return false;
  if (s.unlocked && !frameAvailable(p, f)) return false;
  const q = s.q.trim().toLocaleLowerCase();
  if (!q) return true;
  const text = [frameName(f), f.name, f.variant_of ? frameName(FRAMES[f.variant_of]) : '', ...f.mechtype.map(r => T.role[r] || r),
    ...f.traits.map(t => t.name), f.core_system?.name, f.core_system?.active_name].join(' ').toLocaleLowerCase();
  return text.includes(q);
}
const frameFilterActive = () => { const s = uiState.frame; return !!(s.q.trim() || s.maker || s.role || s.src || s.unlocked); };
function frameToolbar() {
  const s = uiState.frame, sel = (ui, cur, opts) => `<select data-ui="${ui}">${opts.map(([v, t]) => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  return `<div class="catalog-toolbar frame-toolbar"><label class="search-field"><span>查找骨架</span><input type="search" data-ui="frameSearch" value="${esc(s.q)}" placeholder="名称、特征、核心系统或定位"></label>
    <label class="filter-field"><span>厂商</span>${sel('frameMaker', s.maker, [['', '全部厂商'], ...MAKERS.map(m => [m, makerName(m)])])}</label>
    <label class="filter-field"><span>定位</span>${sel('frameRole', s.role, [['', '全部定位'], ...Object.entries(T.role)])}</label>
    <label class="filter-field"><span>来源</span>${sel('frameSrc', s.src, [['', '全部'], ['core', '核心规则书'], ['ext', '扩展（全部）'], ['license', '扩展授权骨架'], ['variant', '变体骨架']])}</label>
    <label class="chk"><input type="checkbox" data-ui="frameUnlocked" ${s.unlocked ? 'checked' : ''}>只看可用</label>
    <button data-ui="resetFrames" ${frameFilterActive() ? '' : 'disabled'}>重置</button><span class="muted" data-frame-count role="status"></span></div>
    <p class="empty-state" data-frame-empty hidden>没有符合条件的骨架，试试其他条件或重置筛选。</p>`;
}
function filterFrames() {
  const p = P(), m = M();
  let shown = 0, total = D.frames.length;
  // 机甲页：重建骨架选单，当前骨架始终保留
  const select = document.querySelector('select[data-k="mech.frame"]');
  if (select && m) {
    select.innerHTML = frameOptions(p, m, f => frameMatches(f, p));
    shown = D.frames.filter(f => frameMatches(f, p)).length;
  }
  // 引导式：隐藏不符合条件的卡片
  const cards = [...document.querySelectorAll('[data-frame-card]')];
  if (cards.length) { shown = 0; cards.forEach(c => { c.hidden = !frameMatches(FRAMES[c.dataset.frameCard], p); if (!c.hidden) shown++; }); total = cards.length; }
  // 引导式：符合条件的骨架只在「尚未解锁」折叠区时，自动展开它，避免看起来像没有结果
  let lockedShown = 0;
  document.querySelectorAll('details[data-open-id="lockedFrames"]').forEach(d => {
    lockedShown = [...d.querySelectorAll('[data-frame-card]')].filter(c => !c.hidden).length;
    if (frameFilterActive() && lockedShown) d.open = true;
  });
  document.querySelectorAll('[data-frame-count]').forEach(el => el.textContent = `显示 ${shown} / ${total} 部` + (cards.length && lockedShown ? `（其中 ${lockedShown} 部尚未解锁）` : ''));
  document.querySelectorAll('[data-frame-empty]').forEach(el => el.hidden = shown > 0);
  document.querySelectorAll('[data-ui="resetFrames"]').forEach(el => el.disabled = !frameFilterActive());
}

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
  filterTalents(); filterSystems(); filterFrames();
  highlightTerms(app);
}
document.addEventListener('input',e=>{
  if(e.target.dataset.ui==='talentSearch'){uiState.talentQuery=e.target.value;filterTalents();}
  if(e.target.dataset.ui==='systemSearch'){uiState.systemQuery=e.target.value;filterSystems();}
  if(e.target.dataset.ui==='frameSearch'){uiState.frame.q=e.target.value;filterFrames();}
});
document.addEventListener('change',e=>{
  if(e.target.dataset.ui==='selectedTalents'){uiState.selectedTalents=e.target.checked;filterTalents();}
  const fk={frameMaker:'maker',frameRole:'role',frameSrc:'src'}[e.target.dataset.ui];
  if(fk){uiState.frame[fk]=e.target.value;filterFrames();}
  if(e.target.dataset.ui==='frameUnlocked'){uiState.frame.unlocked=e.target.checked;filterFrames();}
  if(e.target.id==='sysAdd'){const b=document.querySelector('[data-act="addSys"]');if(b)b.disabled=!e.target.value;}
});
document.addEventListener('click',e=>{
  const action=e.target.closest('[data-ui]')?.dataset.ui;
  if(action==='resetTalents') {uiState.talentQuery='';uiState.selectedTalents=false;render();document.querySelector('[data-ui="talentSearch"]')?.focus();}
  if(action==='disableGM'){db.ignoreLimits=false;render();}
  if(action==='resetFrames'){uiState.frame={q:'',maker:'',role:'',src:'',unlocked:false};render();document.querySelector('[data-ui="frameSearch"]')?.focus();}
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

// ---------- 术语库与术语悬停说明 ----------
// 术语 = glossary.js 的手写术语 + 全部标签（D.tags）+ 扩展规则（D.ext_rules）。
// 首次使用时才建立（esc 等函数定义在之后载入的 app.js 里）。
let glossaryCache = null;
function getGlossary() {
  if (glossaryCache) return glossaryCache;
  if (typeof GLOSSARY_SRC === 'undefined') return (glossaryCache = { list: [], re: null, byIdx: [], cats: [] });
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const list = [], patterns = [], byTerm = {};
  const add = (entry, pats) => { const i = list.push(entry) - 1; pats.forEach(src => patterns.push({ src, i })); return entry; };
  // 带数值的标签（精准X、投掷X……）：后接数字，或在「获得不准」「、独特」这类标签位置才标记，避免「精准无误」「投掷盾牌」之类的字面用法
  const strict = name => `(?<=^|[、，,。；：:（(\\s「]|获得|得到|具有|带有|失去)${name}(?=$|[、，,。；：）)\\s」]|标签|并|和)`;
  const strictTags = typeof GLOSSARY_STRICT_TAGS === 'undefined' ? [] : GLOSSARY_STRICT_TAGS;
  const strictNames = new Set(D.tags.filter(t => strictTags.includes(t.id)).map(t => t.name));
  for (const g of GLOSSARY_SRC) {
    if (g.stop) { patterns.push({ src: escRe(g.t), i: -1 }); continue; } // 多义词：匹配但不标记
    const pats = g.re || (strictNames.has(g.t) ? [strict(escRe(g.t))] : [g.t, ...(g.a || [])].map(escRe));
    byTerm[g.t] = add({ term: g.t, cat: g.cat, def: g.d, alias: g.a || [] }, pats);
  }
  // 扩展规则：替换占位说明
  for (const r of D.ext_rules || []) {
    const t = r.term === '变体' ? '变体骨架' : r.term;
    if (byTerm[t]) { byTerm[t].def = r.html; byTerm[t].cat = '扩展规则'; }
    else byTerm[t] = add({ term: t, cat: '扩展规则', def: r.html, alias: [] }, [escRe(t)]);
  }
  // 标签：与手写术语同名时并入说明，否则单独成条
  const skip = /^tg_(npc_|set_|pilot_weapon|gear|no_cascade|irreducible|recharge|range|modded|exotic|archaic|personal_armor|sidearm)/;
  for (const t of D.tags) {
    if (skip.test(t.id) || !t.name) continue;
    const shown = t.name.replace(/\{VAL\}/g, 'X'), key = t.name.replace(/\{VAL\}/g, '').replace(/（AP）$/, '').trim();
    const hasVal = t.name.includes('{VAL}'), base = escRe(t.name.replace(/\{VAL\}/g, '').trim());
    const pats = hasVal ? [escRe(t.name).replace(/\\\{VAL\\\}/g, '\\d+'), strict(base)]
      : t.id === 'tg_ai' ? ['(?<![A-Za-z])AI(?![A-Za-z])']
      : strictTags.includes(t.id) ? [strict(base)] : [escRe(t.name)];
    const desc = esc(String(t.description || '').replace(/\{VAL\}/g, 'X'));
    const own = byTerm[key];
    if (own) {
      own.def += `<p class="muted">标签「${esc(shown)}」：${desc}</p>`;
      // 手写术语有自己的上下文规则时，只补上「名称+数字」的写法，不再加入宽松的字面匹配
      const extra = GLOSSARY_SRC.find(g => g.t === key)?.re ? (hasVal ? pats.slice(0, 1) : []) : pats;
      extra.forEach(src => patterns.push({ src, i: list.indexOf(own) }));
    }
    else byTerm[key] = add({ term: shown, cat: '标签', def: desc, alias: [] }, pats);
  }
  // 长的写法优先（「热度上限」先于「热度」）：按实际匹配文字的长度排序，不计前后文条件
  const litLen = src => src.replace(/\(\?<?[=!](?:[^()]|\([^()]*\))*\)/g, '').replace(/\\[ds]\+?|[\\^$?+*]/g, '').length;
  patterns.sort((a, b) => litLen(b.src) - litLen(a.src));
  return (glossaryCache = { list, re: new RegExp(patterns.map(p => `(${p.src})`).join('|'), 'g'), byIdx: patterns.map(p => p.i), cats: [...new Set(list.map(g => g.cat))] });
}
// 不在这些位置标记术语：表单控件、按钮、标题、名称等
const TERM_SKIP = 'select,option,textarea,input,button,script,style,summary,h1,h2,h3,h4,h5,a,label,.term,.tag,.stepper,.li-title,.blk-h,.mount-h,.rank-h,.lic-head,.lic-rank-h,.mfr,.gear-label,.pick b,.eyebrow,.glossary';
function highlightTerms(root) {
  if (typeof document.createTreeWalker !== 'function' || !root?.querySelectorAll) return;
  const G = getGlossary();
  if (!G.re) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.trim() && !n.parentElement?.closest(TERM_SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.nodeValue;
    G.re.lastIndex = 0;
    let m, last = 0, frag = null;
    while ((m = G.re.exec(text))) {
      const idx = G.byIdx[m.findIndex((x, k) => k > 0 && x !== undefined) - 1];
      if (idx < 0) continue; // 多义词，跳过
      frag = frag || document.createDocumentFragment();
      frag.append(text.slice(last, m.index));
      const span = document.createElement('span');
      span.className = 'term'; span.dataset.term = idx; span.textContent = m[0];
      frag.append(span); last = m.index + m[0].length;
    }
    if (frag) { frag.append(text.slice(last)); node.replaceWith(frag); }
  }
}
// 悬停说明
function showTermTip(el) {
  const g = getGlossary().list[+el.dataset.term];
  if (!g) return;
  let tip = document.getElementById('termTip');
  if (!tip) { tip = document.createElement('div'); tip.id = 'termTip'; tip.className = 'term-tip'; tip.setAttribute('role', 'tooltip'); document.body.append(tip); }
  tip.innerHTML = `<div class="term-tip-h"><b>${esc(g.term)}</b><span class="tag">${esc(g.cat)}</span></div><div class="term-tip-d">${g.def}</div><div class="term-tip-f">点击术语可在术语库中查看</div>`;
  tip.hidden = false;
  const r = el.getBoundingClientRect(), w = Math.min(340, innerWidth - 16);
  tip.style.width = w + 'px';
  tip.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px';
  const h = tip.offsetHeight;
  tip.style.top = (r.bottom + 8 + h > innerHeight - 8 ? Math.max(8, r.top - h - 8) : r.bottom + 8) + 'px';
}
const hideTermTip = () => { const tip = document.getElementById('termTip'); if (tip) tip.hidden = true; };
document.addEventListener('mouseover', e => { const t = e.target.closest?.('.term'); if (t) showTermTip(t); });
document.addEventListener('mouseout', e => { if (e.target.closest?.('.term') && !e.relatedTarget?.closest?.('.term')) hideTermTip(); });
document.addEventListener('scroll', hideTermTip, true);
// 术语库面板
const glossaryState = { q: '', cat: '' };
function renderGlossary(focus) {
  const box = document.getElementById('glossary');
  if (!box?.querySelector) return;
  const G = getGlossary(), q = glossaryState.q.trim().toLocaleLowerCase();
  const items = G.list.map((g, i) => ({ g, i })).filter(({ g }) => (!glossaryState.cat || g.cat === glossaryState.cat) &&
    (!q || `${g.term} ${g.alias.join(' ')} ${stripHtml(g.def)}`.toLocaleLowerCase().includes(q)));
  box.querySelector('.glossary-cats').innerHTML = ['', ...G.cats].map(c => `<button data-gcat="${esc(c)}" class="${glossaryState.cat === c ? 'on' : ''}">${esc(c || '全部')}</button>`).join('');
  box.querySelector('.glossary-count').textContent = `${items.length} / ${G.list.length} 条`;
  box.querySelector('.glossary-list').innerHTML = items.length ? items.map(({ g, i }) => `<div class="glossary-item" id="g-${i}"><div class="glossary-h"><b>${esc(g.term)}</b>${g.alias.length ? ` <small>${esc(g.alias.join('、'))}</small>` : ''}<span class="tag">${esc(g.cat)}</span></div><div class="glossary-d">${g.def}</div></div>`).join('') : '<p class="empty-state">没有匹配的术语。</p>';
  if (focus != null) { const el = document.getElementById('g-' + focus); if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); } }
}
function openGlossary(focus) {
  const box = document.getElementById('glossary');
  if (!box) return;
  const input = box.querySelector('[data-ui="glossarySearch"]');
  if (focus != null) { glossaryState.q = ''; glossaryState.cat = ''; input.value = ''; }
  box.hidden = false; document.body.classList.add('glossary-open');
  renderGlossary(focus);
  if (focus == null) input.focus();
}
function closeGlossary() { const box = document.getElementById('glossary'); if (box) { box.hidden = true; document.body.classList.remove('glossary-open'); } }
document.addEventListener('input', e => { if (e.target.dataset?.ui === 'glossarySearch') { glossaryState.q = e.target.value; renderGlossary(); } });
document.addEventListener('click', e => {
  const t = e.target.closest?.('.term');
  if (t && !t.closest('[data-wiz],[data-act],button,a,summary,label,select')) { hideTermTip(); openGlossary(+t.dataset.term); return; }
  if (e.target.closest?.('[data-ui="openGlossary"]')) openGlossary();
  if (e.target.closest?.('[data-ui="closeGlossary"]')) closeGlossary();
  const c = e.target.closest?.('[data-gcat]');
  if (c) { glossaryState.cat = c.dataset.gcat; renderGlossary(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !document.getElementById('glossary')?.hidden) closeGlossary(); });
