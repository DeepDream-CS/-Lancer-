/* GM 本机六角地图；规则与角色存档独立。 */
const BattleMap = (() => {
 const KEY='lancer-battle-map-v1', NS='http://www.w3.org/2000/svg';
 const fresh=()=>({v:1,minQ:0,minR:0,w:14,h:10,cells:{},units:[],lines:[],round:1});
 let state=fresh(), selected='', mode='move', color='#506f46', terrain='软性掩护', start=null, history=[], status='', placing=false, zoom=1;
 const conditions=['伏卧','受损','离散','受扰','晕眩','固定','缓慢','锁定','隐形','躲藏','交战','燃烧','关机','超温危域'];
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
 function valid(x){
  if(!x||x.v!==1||!Array.isArray(x.units)||!Array.isArray(x.lines)||!x.cells||Array.isArray(x.cells))throw Error('不是有效的战斗地图');
  x.w=num(x.w,2,60);x.h=num(x.h,2,60);x.minQ=num(x.minQ,-200,200);x.minR=num(x.minR,-200,200);x.round=num(x.round,1,999);
  x.units=x.units.slice(0,200).map((u,i)=>({...u,id:String(u.id||i),q:num(u.q,-200,260),r:num(u.r,-200,260),max:num(u.max,1,9999),hp:num(u.hp,0,num(u.max,1,9999)),armor:num(u.armor,0,99),size:['½','1','2','3','4'].includes(u.size)?u.size:'1',states:Array.isArray(u.states)?u.states.filter(s=>typeof s==='string').slice(0,30):[],color:/^#[0-9a-f]{6}$/i.test(u.color)?u.color:'#529be8'}));
  return x;
 }
 try{const raw=localStorage.getItem(KEY);if(raw)state=valid(JSON.parse(raw));}catch{status='旧地图未能读取，可导入备份恢复。';}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(state));status='已保存到本机';}catch{status='保存失败：请立即导出地图备份';}}
 function checkpoint(){history.push(JSON.stringify(state));if(history.length>40)history.shift();}
 const pos=(q,r)=>[50+(q-state.minQ)*52,55+(r-state.minR)*60+(q%2?30:0)];
 const dist=(a,b)=>{const cube=u=>{let z=u.r-(u.q-(u.q&1))/2;return[u.q,-u.q-z,z];};let x=cube(a),y=cube(b);return Math.max(...x.map((n,i)=>Math.abs(n-y[i])));};
 function svg(){
  let s=`<svg id="bm-svg" xmlns="${NS}" viewBox="0 0 ${state.w*52+52} ${state.h*60+80}" style="width:${(state.w*52+52)*zoom}px" role="group" aria-label="六角战斗地图">`;
  for(let q=state.minQ;q<state.minQ+state.w;q++)for(let r=state.minR;r<state.minR+state.h;r++){
   const [x,y]=pos(q,r),c=state.cells[q+','+r]||{},pts=Array.from({length:6},(_,i)=>{let a=i*Math.PI/3;return`${x+(52/1.5)*Math.cos(a)},${y+(60/Math.sqrt(3))*Math.sin(a)}`;}).join(' ');
   s+=`<g data-cell="${q},${r}" tabindex="0" role="button" aria-label="格 ${q+1},${r+1} ${E(c.terrain||'空地')} ${E(c.text||'')}"><polygon points="${pts}" fill="${/^#[0-9a-f]{6}$/i.test(c.color)?c.color:'#202a38'}" stroke="#60768b" stroke-width="1"/><text x="${x}" y="${y-15}" text-anchor="middle" fill="#adc0d2" font-size="9">${q+1},${r+1}</text><text x="${x}" y="${y+3}" text-anchor="middle" fill="white" font-size="10">${E(c.terrain||'')}</text><text x="${x}" y="${y+16}" text-anchor="middle" fill="white" font-size="10">${E((c.text||'').slice(0,10))}</text></g>`;
  }
  state.lines.forEach(l=>{let a=pos(l.a.q,l.a.r),b=pos(l.b.q,l.b.r);s+=`<g pointer-events="none"><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${/^#[0-9a-f]{6}$/i.test(l.color)?l.color:'#ffd166'}" stroke-width="4" stroke-dasharray="8 4"/><text x="${(a[0]+b[0])/2}" y="${(a[1]+b[1])/2-8}" fill="white" font-size="13">${dist(l.a,l.b)} 空间</text></g>`;});
  state.units.forEach(u=>{let [x,y]=pos(u.q,u.r),stack=state.units.filter(v=>v.q===u.q&&v.r===u.r).indexOf(u);x+=stack%2*15;y+=Math.floor(stack/2)*16;
   s+=`<g data-unit="${E(u.id)}" tabindex="0" role="button" aria-label="${E(u.name)} HP ${u.hp}/${u.max}" style="cursor:grab"><circle cx="${x}" cy="${y}" r="23" fill="${u.color}" stroke="${u.id===selected?'#fff':'#15202d'}" stroke-width="${u.id===selected?4:2}"/><text x="${x}" y="${y-2}" text-anchor="middle" fill="white" font-size="11" font-weight="bold">${E((u.name||'单位').slice(0,6))}</text><text x="${x}" y="${y+11}" text-anchor="middle" fill="white" font-size="9">${u.hp}/${u.max} · 甲${u.armor}</text><rect x="${x-24}" y="${y+25}" width="48" height="6" rx="3" fill="#521e2c"/><rect x="${x-24}" y="${y+25}" width="${48*u.hp/u.max}" height="6" rx="3" fill="${u.hp?'#55da96':'#f47285'}"/><text x="${x}" y="${y+43}" text-anchor="middle" fill="#ffe096" font-size="10">${E(u.states.join('·').slice(0,22))}</text></g>`;
  });return s+'<g id="bm-preview" pointer-events="none"></g></svg>';
 }
 function render(){const u=state.units.find(x=>x.id===selected);return `<section id="battlemap"><div class="bm-head"><div><h1>战斗地图</h1><p>GM 本机操作 · 六角格 · 第 ${state.round} 轮 <span role="status">${E(status)}</span></p></div><button data-bm="round">下一轮</button><button data-bm="undo" ${history.length?'':'disabled'}>撤销</button><button data-bm="export">导出地图</button><label class="bm-file">导入地图<input id="bm-import" type="file" accept=".json" hidden></label></div>
  <div class="bm-tools">${[['move','选择 / 移动'],['paint','地形涂色'],['text','格子标注'],['line','画线 / 测距'],['erase','擦除地形']].map(([v,t])=>`<button data-bm="mode" data-value="${v}" class="${v===mode?'on':''}">${t}</button>`).join('')}<label>颜色 <input id="bm-color" type="color" value="${color}"></label><label>地形 <select id="bm-terrain">${['软性掩护','硬性掩护','困难地形','危险地形','障碍物','空地','自定义'].map(t=>`<option ${t===terrain?'selected':''}>${t}</option>`).join('')}</select></label><button data-bm="clearLines">清除画线</button><button data-bm="zoom" data-value="-0.15" aria-label="缩小地图">−</button><span>${Math.round(zoom*100)}%</span><button data-bm="zoom" data-value="0.15" aria-label="放大地图">＋</button></div>
  <p class="muted">${mode==='move'?(placing?'点击目的格放置单位；Esc 取消。':'点击单位查看；拖动单位可移动，也可点右侧“移动到…”后选格。点击空格取消选择。'):mode==='line'?'点击起点后移动鼠标预览距离，再点击终点；Esc 取消。':mode==='paint'?'点击或按住鼠标划过格子涂色。':mode==='text'?'点击格子输入文字。':'点击格子清除其颜色和标注。'} ${start?'已选起点。':''}</p>
  <div class="bm-layout"><div class="bm-map"><button class="bm-expand" data-bm="expand" data-value="up">＋ 向上扩展 3 行</button><div class="bm-map-row"><button data-bm="expand" data-value="left" aria-label="向左扩展三列">＋</button><div class="bm-scroll">${svg()}</div><button data-bm="expand" data-value="right" aria-label="向右扩展三列">＋</button></div><button class="bm-expand" data-bm="expand" data-value="down">＋ 向下扩展 3 行</button></div>
  <aside class="bm-panel"><h3>单位与 token <small>${state.units.length}</small></h3><div class="row"><button data-bm="add" data-value="玩家">＋ 玩家</button><button data-bm="add" data-value="敌方">＋ 敌方</button><button data-bm="add" data-value="无人机">＋ token</button></div><button data-bm="fromPilot">从当前车卡添加机甲</button><div class="bm-roster">${state.units.map(x=>`<button data-bm="select" data-value="${E(x.id)}" class="${x.id===selected?'on':''}"><span style="color:${x.color}">●</span> ${E(x.name)} <small>${E(x.owner||x.kind)} · ${x.hp}/${x.max}</small><progress value="${x.hp}" max="${x.max}"></progress></button>`).join('')||'<p class="muted">添加单位后，点击地图放置。</p>'}</div>
  ${u?`<h3>编辑 ${E(u.name)}</h3><button data-bm="place" class="${placing?'on':''}">${placing?'取消放置':'移动到…'}</button><div class="bm-hp-actions"><button data-bm="hp" data-value="-1">HP −1</button><button data-bm="hp" data-value="1">HP +1</button></div><div class="bm-fields">${[['name','名称','text'],['owner','玩家 / 阵营','text'],['hp','当前 HP','number'],['max','最大 HP','number'],['armor','装甲','number'],['color','单位颜色','color']].map(([k,n,t])=>`<label>${n}<input data-bmf="${k}" type="${t}" value="${E(u[k]??'')}" ${t==='number'?'min="0" max="9999"':''}></label>`).join('')}<label>大小<select data-bmf="size">${['½','1','2','3','4'].map(s=>`<option ${s===u.size?'selected':''}>${s}</option>`).join('')}</select></label><label>高度<input data-bmf="height" type="number" value="${num(u.height,0,999)}" min="0"></label></div><p class="muted">大小 ${u.size} · 高度 ${num(u.height,0,999)} · 坐标 ${u.q+1},${u.r+1}</p><div class="bm-states">${conditions.map(s=>`<label><input type="checkbox" data-bms="${s}" ${u.states.includes(s)?'checked':''}>${s}</label>`).join('')}</div><label>自定义状态 / 备注<textarea data-bmf="notes">${E(u.notes||'')}</textarea></label><button data-bm="customState">＋ 自定义状态</button><p>${E(u.states.filter(s=>!conditions.includes(s)).join('、'))}</p><button data-bm="clearStates">清除所有状态</button><button data-bm="remove">删除此单位</button>`:'<p class="muted">选择单位以修改血量、装甲、颜色和状态。</p>'}
  <details><summary>地图设置与规则提示</summary><label>列数<input id="bm-width" type="number" min="2" max="60" value="${state.w}"></label><label>行数<input id="bm-height" type="number" min="2" max="60" value="${state.h}"></label><button data-bm="resize">应用尺寸</button><p>范围 2–60 行列。缩小不会删除单位或地形；再次扩展可找回。</p><p>每格为 1 空间，画线显示六角格距离。软性掩护通常使远程攻击 +1 难度，硬性掩护 +2；掩护、视线、高度与角色大小需由 GM 判定。伏卧会使近战攻击获得 +1 准度、远程攻击受到 +1 难度。困难地形每移动 1 空间花费 2 移动。</p><p>本工具不自动减甲、结算伤害或清除状态。大小为记录字段，token 标记所在参考格，较大单位占格由 GM 判定。地图独立于车卡存档。</p><button data-bm="reset">新建空白地图</button></details></aside></div></section>`;}
 function refresh(){
  if(typeof tab==='undefined'||tab!=='battle')return;
  const root=document.getElementById('battlemap'),scroll=root?.querySelector('.bm-scroll'),panel=root?.querySelector('.bm-panel');
  const offsets=[scroll?.scrollLeft||0,scroll?.scrollTop||0,panel?.scrollTop||0],opened=root?.querySelector('details')?.open;
  document.getElementById('app').innerHTML=render();
  const next=document.getElementById('battlemap');next.querySelector('.bm-scroll').scrollTo(offsets[0],offsets[1]);next.querySelector('.bm-panel').scrollTop=offsets[2];next.querySelector('details').open=!!opened;
 }
 function updateVisuals(){const root=document.getElementById('battlemap');if(!root)return;root.querySelector('#bm-svg').outerHTML=svg();const temp=document.createElement('div');temp.innerHTML=render();root.querySelector('.bm-roster').innerHTML=temp.querySelector('.bm-roster').innerHTML;root.querySelector('[role=status]').textContent=status;const undo=root.querySelector('[data-bm=undo]');undo.disabled=!history.length;}

 function change(fn){checkpoint();fn();save();refresh();}
 function add(kind,extra={}){let id='u'+Date.now()+Math.random().toString(36).slice(2,5);state.units.push({id,name:kind+' '+(state.units.length+1),kind,owner:kind,q:state.minQ,r:state.minR,hp:10,max:10,armor:0,size:'1',color:kind==='敌方'?'#d95b68':kind==='无人机'?'#a981da':'#438ddd',states:[],...extra});selected=id;mode='move';placing=true;start=null;}
 function download(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Lancer-战斗地图.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 document.addEventListener('click',e=>{let b=e.target.closest('[data-bm]');if(!b)return;e.stopImmediatePropagation();let act=b.dataset.bm,v=b.dataset.value;
  if(act==='zoom'){zoom=num(zoom+Number(v),0.4,2);refresh();return;}
  if(act==='place'){placing=!placing;mode='move';refresh();return;}
  if(act==='mode'){mode=v;start=null;placing=false;refresh();return;}
  if(act==='select'){selected=v;mode='move';placing=false;refresh();return;}
  if(act==='export'){download();return;}
  if(act==='undo'){if(history.length){state=JSON.parse(history.pop());selected='';placing=false;start=null;save();refresh();}return;}
  if(act==='reset'&&!confirm('新建空白地图？现有地图可用撤销恢复，建议先导出。'))return;
  change(()=>{let u=state.units.find(x=>x.id===selected);
   if(act==='add')add(v);
   if(act==='hp'&&u)u.hp=num(u.hp+Number(v),0,u.max);
   if(act==='fromPilot'){let p=P(),m=p.mechs[p.activeMech||0],s=mechStats(p,m);add('玩家',{name:m.name||'机甲',owner:p.callsign||p.name,hp:s.hp,max:s.hp,armor:s.armor,size:String(s.size===0.5?'½':s.size)});}
   if(act==='remove'){state.units=state.units.filter(x=>x.id!==selected);selected='';}
   if(act==='clearStates'&&u)u.states=[];
   if(act==='customState'&&u){let t=prompt('状态名称（已有自定义状态输入同名可移除）');if(t?.trim()){t=t.trim().slice(0,40);u.states=u.states.includes(t)?u.states.filter(s=>s!==t):[...u.states,t];}}
   if(act==='round')state.round++;
   if(act==='clearLines')state.lines=[];
   if(act==='reset'){state=fresh();selected='';}
   if(act==='resize'){state.w=num(document.getElementById('bm-width').value,2,60);state.h=num(document.getElementById('bm-height').value,2,60);}
   if(act==='expand'){if(['up','down'].includes(v)){let n=Math.min(3,60-state.h);state.h+=n;if(v==='up')state.minR-=n;}else{let n=Math.min(3,60-state.w);state.w+=n;if(v==='left')state.minQ-=n;}}
  });
 },true);
 let edited=null;
 document.addEventListener('focusin',e=>{if(e.target.matches?.('[data-bmf]'))edited=null;});
 function editField(el){const u=state.units.find(x=>x.id===selected),k=el.dataset.bmf;if(!u||!k)return;
  if(edited!==el){checkpoint();edited=el;}
  if(el.type==='number'&&el.value==='')return;
  u[k]=['hp','max','armor','height'].includes(k)?num(el.value,k==='max'?1:0,k==='armor'?99:9999):el.value.slice(0,2000);u.hp=Math.min(u.hp,u.max);save();updateVisuals();
 }
 document.addEventListener('input',e=>{const el=e.target;if(!el.closest('#battlemap'))return;e.stopImmediatePropagation();if(el.dataset.bmf)editField(el);if(el.id==='bm-color')color=el.value;},true);
 document.addEventListener('change',async e=>{let el=e.target;if(!el.closest('#battlemap'))return;e.stopImmediatePropagation();if(el.id==='bm-color'){color=el.value;return;}if(el.id==='bm-terrain'){terrain=el.value;return;}
  if(el.id==='bm-import'&&el.files[0]){try{if(el.files[0].size>5000000)throw Error('文件过大');let next=valid(JSON.parse(await el.files[0].text()));if(confirm('导入将替换当前地图，是否继续？'))change(()=>{state=next;selected='';});}catch(err){alert('无法导入：'+err.message);}return;}
  let u=state.units.find(x=>x.id===selected);if(!u)return;
  if(el.dataset.bmf){editField(el);if(el.type==='number'){el.value=u[el.dataset.bmf];const hp=document.querySelector('[data-bmf=hp]');if(hp)hp.value=u.hp;}}
  if(el.dataset.bms)change(()=>{let s=el.dataset.bms;u.states=el.checked?[...u.states,s]:u.states.filter(t=>t!==s);});
 },true);
 let gesture=null;
 function at(e){const svg=document.getElementById('bm-svg');if(!svg)return null;const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const p=pt.matrixTransform(svg.getScreenCTM().inverse());
  let best=null,d=Infinity;for(let q=state.minQ;q<state.minQ+state.w;q++)for(let r=state.minR;r<state.minR+state.h;r++){const [x,y]=pos(q,r),n=(x-p.x)**2+(y-p.y)**2;if(n<d){d=n;best={q,r};}}return d<35**2?best:null;
 }
 function preview(c,unit){const g=document.getElementById('bm-preview');if(!g)return;if(!c){g.innerHTML='';return;}const [x,y]=pos(c.q,c.r);let out=`<circle cx="${x}" cy="${y}" r="26" fill="${unit?unit.color:'none'}" fill-opacity=".5" stroke="#ffe096" stroke-width="3"/>`;if(start&&mode==='line'){const [a,b]=pos(start.q,start.r);out+=`<line x1="${a}" y1="${b}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="3" stroke-dasharray="6 4"/><text x="${x}" y="${y-32}" fill="white" font-size="15">${dist(start,c)} 空间</text>`;}g.innerHTML=out;}
 function brush(c){const key=c.q+','+c.r;if(gesture.last===key)return;gesture.last=key;if(mode==='erase')delete state.cells[key];else state.cells[key]={...state.cells[key],color,terrain:terrain==='空地'?'':terrain};updateVisuals();}
 function cellAction(c){const {q,r}=c,key=q+','+r;
  if(mode==='move'){let u=state.units.find(x=>x.id===selected);if(placing&&u){change(()=>{u.q=q;u.r=r;placing=false;});}else{selected='';refresh();}}
  if(mode==='text'){let t=prompt('格子标注（留空可清除）',state.cells[key]?.text||'');if(t!==null)change(()=>{state.cells[key]={...state.cells[key],text:t.slice(0,120)};});}
  if(mode==='line'){if(!start){start={q,r};preview(c);}else if(start.q!==q||start.r!==r)change(()=>{state.lines.push({a:start,b:{q,r},color});start=null;});}
 }
 document.addEventListener('pointerdown',e=>{if(e.button!==0||!e.target.closest('#bm-svg'))return;e.preventDefault();const c=at(e);if(!c)return;const unit=e.target.closest('[data-unit]');gesture={x:e.clientX,y:e.clientY,id:unit?.dataset.unit,c,moved:false};
  if(mode==='paint'||mode==='erase'){checkpoint();brush(c);}
 });
 document.addEventListener('pointermove',e=>{const inside=e.target.closest?.('#bm-svg');const c=inside?at(e):null;if(!gesture){if(start||placing)preview(c);return;}gesture.moved ||= Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>5;if(!c)return;
  if(mode==='paint'||mode==='erase')brush(c);else if(mode==='move'&&gesture.id&&gesture.moved)preview(c,state.units.find(u=>u.id===gesture.id));
 });
 document.addEventListener('pointerup',e=>{if(!gesture)return;const g=gesture;gesture=null;const c=e.target.closest?.('#bm-svg')?at(e):null;
  if(mode==='paint'||mode==='erase'){save();updateVisuals();return;}
  if(mode==='move'&&g.id&&!placing){selected=g.id;if(g.moved&&c)change(()=>{const u=state.units.find(u=>u.id===g.id);u.q=c.q;u.r=c.r;});else refresh();return;}
  if(c)cellAction(c);
 });
 window.addEventListener('blur',()=>{gesture=null;save();});
 document.addEventListener('pointercancel',()=>{gesture=null;save();});
 document.addEventListener('keydown',e=>{if(typeof tab==='undefined'||tab!=='battle')return;const editing=e.target.matches('input,textarea,select');
  if(e.key==='Escape'){gesture=null;start=null;placing=false;selected='';refresh();return;}
  if(!editing&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();document.querySelector('[data-bm=undo]')?.click();return;}
  const c=e.target.closest('[data-cell]'),u=e.target.closest('[data-unit]');if(e.key==='Enter'&&c){e.preventDefault();const [q,r]=c.dataset.cell.split(',').map(Number);if(mode==='paint'||mode==='erase'){checkpoint();gesture={};brush({q,r});gesture=null;save();}else cellAction({q,r});}if(e.key==='Enter'&&u){selected=u.dataset.unit;placing=false;refresh();}
 });
 return {render,dist,valid};
})();
