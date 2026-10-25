"use strict";
// Read-only reference panel. No character state or localStorage writes.
(() => {
  const data = window.LANCER_FAQ;
  if (!data) return;
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline = s => escape(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  function markdown(text) {
    const output = []; let paragraph = [], items = [], kind = '';
    const flushParagraph = () => {if (paragraph.length) output.push(`<p>${paragraph.map(inline).join('<br>')}</p>`); paragraph=[];};
    const flushList = () => {if (items.length) output.push(`<${kind}>${items.map(l=>`<li>${inline(l)}</li>`).join('')}</${kind}>`); items=[]; kind='';};
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) {flushParagraph(); flushList(); continue;}
      const bullet = line.match(/^- (.*)/), number = line.match(/^\d+[.)]+\s+(.*)/);
      if (bullet || number) {flushParagraph(); const next = bullet ? 'ul' : 'ol'; if (kind && kind!==next) flushList(); kind=next; items.push((bullet||number)[1]);}
      else {flushList(); paragraph.push(line);}
    }
    flushParagraph(); flushList(); return output.join('');
  }
  const sections = new Map(data.sections.map(s => [s.id, s]));
  const normal = s => s.normalize('NFKC').toLocaleLowerCase().replace(/[’‘]/g, "'");
  const indexed = data.entries.map(e => {
    const s = sections.get(e.section);
    return {...e, haystack: normal([e.id,e.section,e.question,e.answer,e.enQuestion,e.enAnswer,s.title,s.en,s.group,s.book].join(' '))};
  });
  function filter({q = '', section = '', kind = ''} = {}) {
    const urlId = q.trim().match(/(?:#(?:faq-)?|^)([a-f0-9]{6})$/i)?.[1]?.toLowerCase();
    const words = normal(q.trim()).split(/\s+/).filter(Boolean);
    return indexed.filter(e => (!section || e.section === section) && (kind !== 'errata' || e.errata) && (kind !== 'ruling' || e.sources.length) &&
      (urlId ? e.id === urlId || e.section === urlId : words.every(w => e.haystack.includes(w))));
  }
  // Pure helpers also used by the offline regression checks.
  window.LANCER_FAQ_VIEW = {filter, markdown};
  const state = {q: '', section: '', kind: '', expanded: false};
  let panel, opener, previousHash = '', composing = false;
  const background = new Map();
  const external = (url, text) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(text)} ↗</a>`;
  const citation = s => `${s.book}${s.page ? ` · 原版第 ${s.page} 页` : ''}`;
  function mount() {
    if (panel) return;
    panel = document.createElement('dialog');
    panel.id = 'faqPanel'; panel.className = 'faq-panel'; panel.setAttribute('aria-labelledby', 'faqTitle');
    panel.innerHTML = `<header class="faq-head"><div><span class="faq-eyebrow">规则参考 / RULES REFERENCE</span><h2 id="faqTitle">规则 FAQ 与勘误</h2><p>完整中文译文 · ${data.entries.length} 条问答 · 收录于 ${data.retrieved}</p></div><button class="faq-close" data-faq-action="close" aria-label="关闭规则 FAQ">关闭 <kbd>Esc</kbd></button></header>
      <div class="faq-tools"><label class="faq-search"><span>搜索问答</span><input type="search" id="faqSearch" aria-label="搜索问答" autocomplete="off" placeholder="中文、English、问题编号或原站链接"></label><label class="faq-kind"><span>条目类型</span><select id="faqKind" aria-label="条目类型"><option value="">全部问答</option><option value="errata">勘误条目</option><option value="ruling">附 Tom 裁定出处</option></select></label><button data-faq-action="reset">重置</button></div>
      <div class="faq-quick" aria-label="常用检索"><span>常用</span>${['地雷','超限','隐形','无人机','NPC'].map(q => `<button data-faq-query="${q}">${q}</button>`).join('')}</div>
      <div class="faq-layout"><nav class="faq-nav" aria-label="FAQ 章节"></nav><div class="faq-reading"><div class="faq-results-head"><div><span class="faq-count" role="status" aria-live="polite"></span><span class="faq-selection"></span></div><button data-faq-action="expand" aria-pressed="false">展开全部答案</button></div><label class="faq-mobile-section"><span>跳转章节</span><select id="faqSection"></select></label><div class="faq-scroll" tabindex="0" aria-label="FAQ 问答内容"><div class="faq-intro"><span>社区整理的 FAQ 与勘误；“Tom 裁定”保留原站所附来源。页码沿用英文原书。</span><details><summary>来源、译本与贡献者</summary><p>${external(data.source,'阅读原站')} · ${external(data.repository,'上游项目')} · <a href="source/faq/LICENSE" target="_blank" rel="noopener">GPL-3.0 许可</a> · <a href="source/faq/README.md" target="_blank" rel="noopener">译本说明与源文件</a></p><p>这份中文译本保留原文的条件、例外与不确定措辞。每条可展开英文对照；FAQ 的勘误与车卡器现有规则分开显示。原文中“未来可能修订”等说法是上游快照的表述。</p><p>贡献者：${escape(data.contributors.join('、').replace('(current FAQ manager)', '（现任 FAQ 维护者）'))}。</p><p>上游版本：<code>${escape(data.revision)}</code></p></details></div><div class="faq-results"></div></div></div></div>`;
    document.body.appendChild(panel);
    panel.addEventListener('cancel', e => { e.preventDefault(); close(); });
    panel.addEventListener('click', e => {
      const action = e.target.closest('[data-faq-action]')?.dataset.faqAction;
      if (action === 'close') return close();
      if (action === 'reset') { Object.assign(state, {q:'',section:'',kind:'',expanded:false}); sync(); render(); panel.querySelector('#faqSearch').focus(); return; }
      if (action === 'expand') {
        state.expanded = !state.expanded;
        panel.querySelectorAll('.faq-item').forEach(el => { el.open = state.expanded; }); updateExpand(); return;
      }
      const query = e.target.closest('[data-faq-query]')?.dataset.faqQuery;
      if (query != null) { Object.assign(state,{q:query,section:'',kind:'',expanded:true}); sync(); render(); return; }
      const section = e.target.closest('[data-faq-section]')?.dataset.faqSection;
      if (section != null) { state.section = section; sync(); render(); panel.querySelector('.faq-scroll').focus({preventScroll:true}); return; }
      const link = e.target.closest('[data-faq-link]');
      if (link) { e.preventDefault(); setHash(link.dataset.faqLink); return; }
    });
    const search = panel.querySelector('#faqSearch');
    const searchChanged = () => { state.q = search.value; state.expanded = !!state.q.trim(); render(); };
    search.addEventListener('compositionstart', () => {composing = true;});
    search.addEventListener('compositionend', () => {composing = false; searchChanged();});
    search.addEventListener('input', () => {if (!composing) searchChanged();});
    panel.querySelector('#faqKind').addEventListener('change', e => {state.kind = e.target.value; render();});
    panel.querySelector('#faqSection').addEventListener('change', e => {state.section = e.target.value; render();});
    panel.querySelector('.faq-results').addEventListener('toggle', () => {
      const items = [...panel.querySelectorAll('.faq-item')];
      if (items.length) state.expanded = items.every(el => el.open);
      updateExpand();
    }, true);
  }
  function sync() {
    panel.querySelector('#faqSearch').value = state.q;
    panel.querySelector('#faqKind').value = state.kind;
  }
  function updateExpand() {
    const button = panel.querySelector('[data-faq-action="expand"]');
    button.textContent = state.expanded ? '收起全部答案' : '展开全部答案';
    button.setAttribute('aria-pressed', String(state.expanded));
  }
  function render() {
    const all = filter({...state, section:''}), visible = filter(state);
    panel.querySelector('.faq-count').textContent = `${visible.length} / ${data.entries.length} 条问答`;
    panel.querySelector('.faq-selection').textContent = state.section ? ` · ${sections.get(state.section)?.title || ''}` : ' · 全部章节';
    panel.querySelector('[data-faq-action="expand"]').disabled = !visible.length;
    const counts = new Map(); all.forEach(e => counts.set(e.section, (counts.get(e.section)||0) + 1));
    let group = '';
    panel.querySelector('.faq-nav').innerHTML = `<button data-faq-section="" ${state.section ? '' : 'aria-current="true"'}>全部章节 <span>${all.length}</span></button>` + data.sections.filter(s=>counts.has(s.id)||s.id===state.section).map(s => {
      const heading = group !== s.group ? `<h3>${escape(s.group)}</h3>` : ''; group = s.group;
      return heading + `<button data-faq-section="${s.id}" ${state.section===s.id?'aria-current="true"':''}><span>${escape(s.title)}</span><small>${counts.get(s.id)||0}</small></button>`;
    }).join('');
    panel.querySelector('#faqSection').innerHTML = '<option value="">全部章节</option>' + data.sections.filter(s=>counts.has(s.id)||s.id===state.section).map(s=>`<option value="${s.id}">${escape(s.group + ' / ' + s.title)}</option>`).join('');
    panel.querySelector('#faqSection').value = state.section;
    let lastSection = '';
    panel.querySelector('.faq-results').innerHTML = visible.length ? visible.map(e => {
      const s = sections.get(e.section);
      const heading = e.section !== lastSection ? `<header class="faq-section-head" id="faq-section-${s.id}"><span>${escape(citation(s))}</span><h3>${escape(s.title)}</h3></header>` : ''; lastSection = e.section;
      const tags = `${e.errata?'<span class="faq-label faq-errata">勘误</span>':''}${e.sources.length?'<span class="faq-label">Tom 裁定</span>':''}`;
      return heading + `<details class="faq-item" id="faq-item-${e.id}" ${state.expanded?'open':''}><summary><span class="faq-question">${escape(e.question)}</span><span class="faq-tags">${tags}</span><span class="faq-preview">${escape(e.answer.replace(/\*|\n/g,' ').slice(0,100))}</span></summary><div class="faq-answer">${markdown(e.answer)}<div class="faq-sources">${external(data.source+'#'+e.id,'原站本条')}<a href="#faq-${e.id}" data-faq-link="${e.id}" title="在地址栏定位到本条，方便复制链接">定位本条</a><span>#${e.id}</span>${e.sources.map((url,i)=>external(url,`Tom 裁定${e.sources.length>1?' '+(i+1):''}`)).join('')}</div><details class="faq-english"><summary>英文原文对照</summary><h4>${escape(e.enQuestion)}</h4>${markdown(e.enAnswer)}</details></div></details>`;
    }).join('') : '<div class="faq-empty"><h3>没有找到匹配问答</h3><p>试试更短的关键词、英文名称，或重置章节与类型筛选。</p><button data-faq-action="reset">重置筛选</button></div>';
    panel.querySelector('.faq-scroll').scrollTop = 0;
    updateExpand();
  }
  function open(id) {
    mount();
    if (!panel.open) {
      opener = document.activeElement === document.body ? document.querySelector('[data-ui="openFAQ"]') : document.activeElement;
      previousHash = location.hash.startsWith('#faq-') ? '' : location.hash;
      // Modal dialog keeps the reference pane above every editor without changing its state.
      panel.showModal(); document.body.classList.add('faq-open');
      for (const child of document.body.children) if (child !== panel && !['SCRIPT','LINK','STYLE'].includes(child.tagName)) {background.set(child,child.inert); child.inert=true;}
    }
    if (id) {
      const e = data.entries.find(e=>e.id===id), s = sections.get(id);
      if (e || s) Object.assign(state,{q:'',section:e?.section||id,kind:'',expanded:false});
    }
    sync(); render();
    const entry = id && document.getElementById('faq-item-'+id);
    if (entry) { entry.open = true; entry.scrollIntoView({block:'start'}); entry.querySelector('summary').focus({preventScroll:true}); }
    else panel.querySelector('#faqSearch').focus({preventScroll:true});
  }
  function close() {
    if (!panel?.open) return;
    panel.close(); document.body.classList.remove('faq-open');
    background.forEach((value,el)=>{el.inert=value;}); background.clear();
    if (location.hash.startsWith('#faq-')) {try {history.replaceState(null,'',location.pathname+location.search+previousHash);} catch { /* file: history may be restricted */ }}
    if (opener?.isConnected) opener.focus({preventScroll:true});
  }
  function setHash(id) {
    if (location.hash === '#faq-'+id) open(id);
    else location.hash = 'faq-'+id;
  }
  function openHash() { const id = location.hash.match(/^#faq-([a-f0-9]{6})$/i)?.[1]?.toLowerCase(); if (id && (sections.has(id)||data.entries.some(e=>e.id===id))) open(id); }
  document.addEventListener('click', e => {if (e.target.closest?.('[data-ui="openFAQ"]')) open();});
  window.addEventListener('hashchange', openHash);
  // Avoid initialization while app.js is still restoring the character UI.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',openHash); else openHash();
})();
