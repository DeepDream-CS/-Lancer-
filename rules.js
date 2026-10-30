"use strict";
// Core-book character-building helpers. No combat-state/conditional bonuses are applied here.
function inheritedTrait(m) {
  if(m.frame !== 'mf_ext_kanggeduo') return null;
  const source=FRAMES[m.legacyFrame], index=Number(m.legacyTrait);
  if(!source || source.required_core_bonus || m.legacyTrait==='' || !Number.isInteger(index)) return null;
  const trait=source.traits[index];
  return trait ? {...trait, name:`${trait.name}（遗产：${frameName(source)}）`, inherited_from:source.id} : null;
}
function mechTraits(m) {
  const extra=inheritedTrait(m);
  return [...(FRAMES[m.frame]?.traits || []), ...(extra?[extra]:[])];
}
function createKanggeduo(p, original) {
  if((!hasCB(p,'cb_ext_kanggeduo_chassis')&&!db.ignoreLimits) || !original || FRAMES[original.frame]?.required_core_bonus) return null;
  const backup=blankMech('mf_ext_kanggeduo');
  backup.name=`${original.name} · 康格多备用机`;
  backup.legacyFrame=original.frame;
  for(const k of ['prototypeType','prototypeDamage','prototypeOptics','prototypeSmart','prototypeReactor']) if(original[k]) backup[k]=original[k];
  p.mechs.push(backup);p.activeMech=p.mechs.length-1;
  return backup;
}
function kanggeduoSetup(p,m) {
  if(m.frame!=='mf_ext_kanggeduo') return hasCB(p,'cb_ext_kanggeduo_chassis') ? '<p><button data-act="addKanggeduo">配置康格多备用机</button></p>' : '';
  const ids=[...new Set([...p.mechs.filter(x=>!FRAMES[x.frame]?.required_core_bonus).map(x=>x.frame),m.legacyFrame])].filter(id=>FRAMES[id]&&!FRAMES[id].required_core_bonus);
  const source=FRAMES[m.legacyFrame];
  return `<section class="fc-note"><b>康格多备用配置 · 遗产</b><p>首次部署时选择原始机甲的一个特征，直到下次全面维修前保持该选择。武器与系统单独配置；部署、原机甲被毁及超限重置按核心奖励在战斗中结算。</p>
    <label>原始骨架 <select data-k="mech.legacyFrame"><option value="">— 选择原始机甲 —</option>${ids.map(id=>opt(id,esc(frameName(FRAMES[id])),id===m.legacyFrame)).join('')}</select></label>
    <label>继承特征 <select data-k="mech.legacyTrait"><option value="">— 选择一个特征 —</option>${(source?.traits||[]).map((t,i)=>opt(String(i),esc(t.name),String(i)===String(m.legacyTrait))).join('')}</select></label>
    <p class="muted">部署时自带 1 CP。继承特征的规则全文会列在下方，并随角色卡保存和导出。</p></section>`;
}
function talentEquipment(p, field) {
  const ids = [];
  for (const [id, rank] of Object.entries(p.talents)) {
    const ranks = (TALENTS[id]?.ranks || []).slice(0, rank);
    const exclusive = ranks.filter(r => r.exclusive && r[field]?.length);
    const active = [...ranks.filter(r => !r.exclusive), ...exclusive.slice(-1)];
    active.forEach(r => ids.push(...(r[field] || [])));
  }
  return [...new Set(ids)].map(id => WEAPONS[id] || SYSTEMS[id]).filter(Boolean);
}
function buildBonuses(p, m) {
  const f = FRAMES[m.frame];
  const sources = [
    ...new Set(p.coreBonuses.map(id => CBS[id]).filter(Boolean)),
    ...new Set(m.systems.map(id => SYSTEMS[id]).filter(Boolean)),
    ...mechTraits(m),
    ...Object.entries(p.talents).flatMap(([id, rank]) => (TALENTS[id]?.ranks || []).slice(0, rank)),
  ];
  return sources.flatMap(s => (s.bonuses || []).map(b=>({...b,coreBonus:!!CBS[s.id]})));
}
function staticBonus(p, m, id) {
  return buildBonuses(p, m).filter(b => b.id === id && !b.weapon_types && !b.weapon_sizes && !b.damage_types && !b.range_types)
    .reduce((n, b) => n + (Number(b.val) || 0), 0);
}
function slotAccepts(mount, index, slots) {
  if (mount.type === 'Flex' && index === 1 && WEAPONS[slots[0]?.w]?.mount === 'Main') return [];
  return MOUNT_SLOTS[mount.type]?.[index] || [];
}
function canModify(w, mod, mount) {
  return !mount.noMods && !w.no_mods &&
    (!mod.allowed_types?.length || (w.types||[w.type]).some(t=>mod.allowed_types.includes(t))) &&
    (!mod.allowed_sizes?.length || mod.allowed_sizes.includes(w.mount)) &&
    !(w.types||[w.type]).some(t=>(mod.restricted_types||[]).includes(t)) && !(mod.restricted_sizes || []).includes(w.mount);
}
// 超重型武器可另占的挂载点。扩展核心奖励「超重挂载」的超重型挂载点：机甲有重型挂载点时，必须占用它。
function superheavyLinkTargets(mounts, mt) {
  const pool = mounts.filter(x => x.key !== mt.key && x.type !== 'Integrated');
  return mt.type === 'Superheavy' && pool.some(x => x.type === 'Heavy') ? pool.filter(x => x.type === 'Heavy') : pool;
}
function linkedMounts(p, m) {
  const mounts = mountsOf(p, m), links = new Map();
  for (const mt of mounts) {
    const st = m.loadout[mt.key];
    const target = superheavyLinkTargets(mounts, mt).find(x => x.key === st?.link);
    if (['Heavy', 'Superheavy'].includes(mt.type) && WEAPONS[st?.slots?.[0]?.w]?.mount === 'Superheavy' && target && !links.has(target.key)) {
      links.set(target.key, mt.key);
    }
  }
  return links;
}
function limitedTags(tags, p, m) {
  const bonus = Math.floor(p.hase.eng / 2) + staticBonus(p, m, 'limited_bonus');
  return (tags || []).map(t => t.id === 'tg_limited' && bonus ? { ...t, val: Number.isFinite(+t.val) ? +t.val + bonus : `${t.val}+${bonus}` } : t);
}
function configuredWeapon(w, m, slot) {
  if(w.select_profile) { const pf=w.profiles[int(slot?.profile,0,w.profiles.length-1)]; return {...w,...pf,id:w.id,name:w.name,profiles:w.profiles,selected_profile:pf.name}; }
  if (!w.id.startsWith('mw_prototype_')) return w;
  const type = ['Melee','CQB','Rifle','Cannon','Launcher','Nexus'].includes(m.prototypeType) ? m.prototypeType : 'Rifle';
  const damage = ['Kinetic','Explosive','Energy'].includes(m.prototypeDamage) ? m.prototypeDamage : 'Kinetic';
  return { ...w, type, range: [{type: type === 'Melee' ? 'Threat' : 'Range', val: type === 'Melee' ? 1 : 10}],
    damage: w.damage.map(d => ({...d, type: damage})), tags: [...w.tags, ...(w.talent_rank >= 2 && m.prototypeSmart === 'yes' ? [{id:'tg_smart'}] : [])] };
}
function effectiveProfile(w, profile, mod, p, m) {
  const base = w.select_profile ? w : (profile || w);
  const range = (base.range || w.range || []).map(r => {
    let value = Number(r.val);
    if (!Number.isFinite(value) || w.no_bonus || w.no_bonuses) return {...r};
    for (const b of buildBonuses(p, m).filter(b => b.id === 'range')) {
      if (w.no_core_bonus && b.coreBonus) continue;
      if (b.weapon_types?.length && !(w.types||[w.type]).some(t=>b.weapon_types.includes(t))) continue;
      if (b.weapon_sizes?.length && !b.weapon_sizes.includes(w.mount)) continue;
      if (b.range_types?.length && !b.range_types.includes(r.type)) continue;
      if (b.damage_types?.length && !(base.damage || []).some(d => b.damage_types.includes(d.type))) continue;
      value += Number(b.val) || 0;
    }
    value += (mod?.added_range || []).filter(b => b.type === r.type).reduce((n,b) => n + (+b.val || 0), 0);
    return {...r, val: value};
  });
  const tags = [...(base.tags || w.tags || [])];
  // stack_tags（扩展「超巨质量模组」）：同名数值标签相加，例如击退+1，而不是另列一个标签
  for (const t of mod?.added_tags || []) {
    const same = mod.stack_tags && tags.findIndex(x => x.id === t.id && Number.isFinite(+x.val));
    if (same >= 0 && same !== false) tags[same] = {...tags[same], val: +tags[same].val + (+t.val || 0)};
    else tags.push(t);
  }
  if (w.type === 'Melee' && w.mount === 'Auxiliary' && p.talents.t_hunter >= 2) {
    const t = tags.find(t => t.id === 'tg_thrown');
    if (t) tags[tags.indexOf(t)] = {...t, val: Math.max(5, +t.val || 0)};
    else tags.push({id:'tg_thrown',val:5});
  }
  return {...base, range, tags: limitedTags(tags, p, m)};
}
function buildWeaponNote(p, m, entry) {
  const notes = [];
  if (entry.w.selected_profile) notes.push('打印数据：' + entry.w.selected_profile);
  if (hasCB(p, 'cb_auto_stabilizing_hardpoints') && m.stabilized === entry.mount.key) notes.push('+1准度');
  if (hasCB(p, 'cb_overpower_caliber') && m.overpower === `${entry.mount.key}|${entry.i}`) notes.push('超功率口径：每轮一次，命中时+1d6额外伤害');
  if (m.frame === 'mf_deaths_head' && entry.w.type !== 'Melee') notes.push('远程攻击检定+1');
  if (entry.w.id.startsWith('mw_prototype_') && m.prototypeOptics === 'yes') notes.push('+1准度（调整光学）');
  return notes.join('；');
}
function creationChecks(p) {
  const out = [];
  if (p.ll === 0 && (p.triggers.length !== 4 || p.triggers.some(t => t.val !== 2))) out.push(['err','LL0 必须选择四个不同的 +2 触发']);
  if (p.triggers.length < 4) out.push(['err','驾驶员至少保留四个触发']);
  if (p.triggers.some(t => ![2,4,6].includes(t.val))) out.push(['err','触发单项只能为 +2、+4 或 +6']);
  if (Object.values(p.hase).some(v => !Number.isInteger(v) || v < 0 || v > 6)) out.push(['err','机甲技能单项必须为 0–6 的整数']);
  if (p.ll === 0 && (Object.keys(p.talents).length !== 3 || Object.values(p.talents).some(v => v !== 1))) out.push(['err','LL0 必须选择三个不同的一级天赋']);
  if (new Set(p.coreBonuses).size !== p.coreBonuses.length) out.push(['err','核心奖励不能重复选择']);
  const gear = [[p.gear.armor, 'Armor'], ...p.gear.weapons.map(id => [id,'Weapon']), ...p.gear.items.map(id => [id,'Gear'])];
  if (gear.some(([id,type]) => id && GEAR[id]?.type !== type)) out.push(['err','驾驶员装备放入了错误的栏位']);
  return out;
}
function loadoutChecks(p, m) {
  const out = [], prefix = `机甲「${m.name}」：`, mounts = mountsOf(p,m), links = linkedMounts(p,m);
  const error = text => out.push(['err',prefix + text]);
  if(m.frame==='mf_ext_kanggeduo'&&!inheritedTrait(m)) out.push(['warn',prefix+'康格多尚未选择原始机甲的遗产特征']);
  const occupiedLinks = new Set();
  for (const mt of mounts) {
    const st = m.loadout[mt.key] || {slots:[],link:''};
    const first = WEAPONS[st.slots[0]?.w];
    if (st.link) {
      if (first?.mount !== 'Superheavy' || !['Heavy', 'Superheavy'].includes(mt.type) || links.get(st.link) !== mt.key || occupiedLinks.has(st.link)) error('超重型武器的额外挂载点无效或被重复占用');
      occupiedLinks.add(st.link);
    }
    if (links.has(mt.key) && st.slots.some(s => s.w || s.mod)) error('超重型武器占用的挂载点必须清空');
    for (const [i,sl] of st.slots.entries()) {
      if (!sl.w) continue;
      const w = WEAPONS[sl.w];
      if (!w || !slotAccepts(mt,i,st.slots).includes(w.mount)) error(`挂载点 ${mt.key} 的武器尺寸或槽位组合不合法`);
      if (w && !itemAvailable(p,w)) error(`${plain('item',w)} 未解锁或属于内建装备`);
      if (sl.mod && (!MODS[sl.mod] || !w || !canModify(w,MODS[sl.mod],mt))) error('武器模块不适用于该武器或内建挂载点');
      if(sl.mod2 && (w?.max_mods!==2 || !MODS[sl.mod2] || !canModify(w,MODS[sl.mod2],mt))) error('第二模组仅可安装到支持双模组的武器，且必须符合模组限制');
      if(sl.mod && sl.mod===sl.mod2) error('同一把武器不能重复安装同一模组');
    }
  }
  for (const [key,st] of Object.entries(m.loadout)) if (!mounts.some(mt=>mt.key===key) && st.slots?.some(s=>s.w)) error(`挂载点 ${key} 已不存在，请移除残留装备或重新选择骨架`);
  const eq = equippedWeapons(p,m);
  const all = [...eq.map(e=>e.w),...eq.flatMap(e=>e.mods || (e.mod?[e.mod]:[])),...m.systems.map(id=>SYSTEMS[id]).filter(Boolean)];
  const ai = all.filter(x=>(x.tags||[]).some(t=>t.id==='tg_ai')).length;
  if (ai > 1 + staticBonus(p,m,'ai_cap')) error(`AI 数量超限（${ai}/${1 + staticBonus(p,m,'ai_cap')}，含武器模块）`);
  for (const id of m.systems) if (SYSTEMS[id] && !itemAvailable(p,SYSTEMS[id])) error(`${plain('item',SYSTEMS[id])} 未解锁或已由天赋内建提供`);
  const families = all.filter(x=>x.talent_item).map(x=>x.talent_id);
  if (new Set(families).size < families.length) error('同一天赋提供的装备不能重复安装或同时安装多个等级');
  if (hasCB(p,'cb_auto_stabilizing_hardpoints') && !mounts.some(mt=>mt.key===m.stabilized && !links.has(mt.key) && mt.type!=='Integrated')) error('请为自稳定承力点选择一个可用的普通挂载点');
  if (hasCB(p,'cb_mount_retrofitting') && !mounts.some(mt=>mt.retro)) error('请指定挂载点改装的目标');
  if (hasCB(p,'cb_kkca_signature_move') && !(m.systems.includes(m.signature) && SYSTEMS[m.signature])) error('请为招牌动作指定一个已安装的系统');
  if (hasCB(p,'cb_overpower_caliber') && !eq.some(e=>`${e.mount.key}|${e.i}`===m.overpower && e.mount.type!=='Integrated' && !e.w.no_core_bonus)) error('请为超功率口径指定一件可用武器');
  if (p.talents.t_engineer >= 2) {
    const count = [m.prototypeOptics,m.prototypeSmart,m.prototypeReactor].filter(x=>x==='yes').length;
    if (count !== 2) error('工程师原型武器须选择两项调整');
  }
  out.push(...professionalLoadoutChecks(p,m));
  return out;
}
function migratePilot(p, warn = []) {
  for (const m of p.mechs) {
    // Old exports identified Overpower by equipment ID, which is ambiguous for duplicates.
    if (WEAPONS[m.overpower]) {
      const matches = Object.entries(m.loadout).flatMap(([key,st]) => st.slots.map((s,i)=>s.w===m.overpower ? `${key}|${i}` : '').filter(Boolean));
      m.overpower = matches.length === 1 ? matches[0] : '';
      if (matches.length > 1) warn.push('超功率口径原来指向多个同名武器，请重新指定其中一件。');
    }
    for (const st of Object.values(m.loadout)) for (let i=0;i<st.slots.length;i++) {
      const w = WEAPONS[st.slots[i]?.w];
      if (w?.talent_item && talentEquipment(p,'integrated').some(x=>x.talent_id===w.talent_id)) {
        st.slots[i]={w:'',mod:''};
        warn.push(`${plain('item',w)} 已改为天赋武器一体化，不再占用普通挂载点。`);
      }
    }
    m.systems = m.systems.filter(id => !talentEquipment(p,'integrated').some(x=>x.talent_id && x.talent_id===SYSTEMS[id]?.talent_id));
    m.systems = m.systems.map(id => {
      const s=SYSTEMS[id];
      return s?.talent_item ? (talentEquipment(p,'special_equipment').find(x=>x.talent_id===s.talent_id)?.id || id) : id;
    });
  }
}
function prototypeEditor(p,m) {
  if (!p.talents.t_engineer) return '';
  const select = (key, options, current) => `<select data-k="mech.${key}">${options.map(([id,label])=>opt(id,label,id===current)).join('')}</select>`;
  const choices = [['Melee','近战'],['CQB','CQB'],['Rifle','步枪'],['Cannon','大炮'],['Launcher','发射器'],['Nexus','巢房']];
  return `<div class="blk"><b>原型武器配置（全面维修时选择）</b><div class="row">${select('prototypeType',choices,m.prototypeType || 'Rifle')}${select('prototypeDamage',[['Kinetic','动能'],['Explosive','爆炸'],['Energy','能量']],m.prototypeDamage || 'Kinetic')}</div>${p.talents.t_engineer>=2 ? ['Optics','Smart','Reactor'].map((k,i)=>`<label>${['调整光学（+1准度）','调整电脑（智慧）','移除反应炉屏蔽（可选范围攻击，承受2热度）'][i]} ${select('prototype'+k,[['no','未选'],['yes','选择']],m['prototype'+k] || 'no')}</label>`).join('<br>') : ''}</div>`;
}
