(() => {
 const D=window.LANCER_NPCS;if(!D)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button=document.createElement('button');button.textContent='NPC 库';button.setAttribute('aria-haspopup','dialog');
 document.querySelector('[data-ui="openSystemLibrary"]').after(button);
 const dlg=document.createElement('dialog');dlg.id='npcLibrary';dlg.setAttribute('aria-labelledby','npcTitle');
 dlg.innerHTML=`<header><div><h2 id="npcTitle">NPC 查看板块</h2><p>GM 资料 · 包含模组剧透</p></div><button class="npc-close" autofocus>关闭 ✕</button></header><div class="npc-toolbar"><label>搜索 NPC、武器或能力<input class="npc-query" type="search" placeholder="例如：王牌、超体、傀儡师"></label><label>来源<select class="npc-source"><option value="">全部资料</option>${D.sources.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label><label>类别<select class="npc-kind"><option value="">全部类别</option>${[...new Set(D.entries.map(e=>e.kind))].map(k=>`<option>${esc(k)}</option>`).join('')}</select></label><label class="npc-check"><input type="checkbox" class="npc-full">搜索全部原书正文</label></div><p class="npc-count" role="status"></p><div class="npc-layout"><nav class="npc-results" aria-label="NPC 查询结果"></nav><article class="npc-detail"></article></div>`;
 document.body.append(dlg);
 let selected=null;
 const $=s=>dlg.querySelector(s);
 function show(e){selected=e;const s=D.sources.find(s=>s.id===e.source);$('.npc-detail').innerHTML=`<h3>${esc(e.title)}</h3><p class="npc-meta">${esc(s.name)} · PDF 第 ${e.page} 页 · ${esc(s.group)}</p><p>阶级 I／II／III 数值、基本系统及可选系统请对照原书表格；同名条目按来源分别保留。</p>${e.image?`<a href="${e.image}" target="_blank" rel="noopener" title="打开原书页大图"><img src="${e.image}" alt="${esc(e.title)}，PDF 第 ${e.page} 页"></a>`:''}<details ${e.image?'':'open'}><summary>可复制的原文${e.image?'（表格以原书页为准）':''}</summary><pre>${esc(e.text)}</pre></details>`;$('.npc-detail').scrollTop=0;$('.npc-results').querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.id===e.id?'true':'false'));}
 function render(){const q=$('.npc-query').value.trim().toLowerCase(),source=$('.npc-source').value,kind=$('.npc-kind').value,full=$('.npc-full').checked;
 let rows=D.entries.filter(e=>(source===''||e.source===Number(source))&&(!kind||e.kind===kind)&&(!q||(e.title+' '+e.text).toLowerCase().includes(q)));
 if(full&&q){const seen=new Set(rows.map(e=>e.id));for(const book of D.books){if(source!==''&&book.source!==Number(source))continue;book.pages.forEach((text,i)=>{const id=book.source+'-'+(i+1);if(!seen.has(id)&&text.toLowerCase().includes(q))rows.push({id,source:book.source,page:i+1,title:(text.split('\n').filter(Boolean).slice(0,2).join(' · ').slice(0,65)||'正文命中'),kind:'正文检索',text});});}}
 $('.npc-count').textContent=`${rows.length} 个参考页 · 已编目 ${D.entries.length} 页，覆盖 ${D.sources.length} 本资料。正文检索用于寻找附录外的特殊单位与上下文，不代表每个命中都是 NPC。`;
 $('.npc-results').innerHTML=rows.slice(0,600).map(e=>`<button data-id="${e.id}"><strong>${esc(e.title)}</strong><span>${esc(D.sources.find(s=>s.id===e.source).name)} · p.${e.page}</span><small>${esc(e.kind)}</small></button>`).join('')||'<p>没有匹配结果。可清除类别筛选，或开启全部原书正文搜索。</p>';
 $('.npc-results').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>show(rows[i]));
 if(rows.length)show(rows.find(e=>e.id===selected?.id)||rows[0]);else $('.npc-detail').innerHTML='<p>请选择其他搜索条件。</p>';
 }
 button.onclick=()=>{dlg.showModal();if(!selected)render();};$('.npc-close').onclick=()=>dlg.close();
 dlg.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dlg.close();}});
 let timer;$('.npc-query').oninput=()=>{clearTimeout(timer);timer=setTimeout(render,160);};dlg.querySelectorAll('select,input[type=checkbox]').forEach(e=>e.onchange=render);
})();

