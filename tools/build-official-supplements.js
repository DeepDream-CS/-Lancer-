const fs = require('fs');
const path = require('path');
const KINDS = ['frames', 'weapons', 'systems', 'mods', 'core_bonuses', 'talents', 'pilot_gear'];
const LABELS = {core_system:'核心系统',traits:'骨架特征',ranks:'天赋等级',profiles:'武器模式',actions:'动作',passive_actions:'被动动作',active_actions:'主动动作',synergies:'规则提示',passive_synergies:'被动规则提示',active_synergies:'主动规则提示',deployables:'部署物',counters:'计数器',name:'名称',description:'背景说明',detail:'效果',effect:'效果',on_hit:'命中效果',on_attack:'攻击效果',on_crit:'会心一击效果',trigger:'触发条件'};
function label(field) {
 return field.split('.').map(part=>{const m=part.match(/^([^[]+)(?:\[(\d+)\])?$/);if(!m||!LABELS[m[1]])throw Error('Unknown supplement field: '+field);return LABELS[m[1]]+(m[2]===undefined?'':' '+(Number(m[2])+1));}).join(' · ');
}
function apply(data, root) {
 const mapping=JSON.parse(fs.readFileSync(path.join(root,'source/fvtt/official-map.json'),'utf8'));
 const overrides=JSON.parse(fs.readFileSync(path.join(root,'source/fvtt/zh-overrides.json'),'utf8'));
 const byId=new Map(KINDS.flatMap(k=>data[k]).map(item=>[item.id,item]));
 const reverse=new Map();
 for(const [local,official]of Object.entries(mapping)) {if(local.startsWith('_'))continue;if(reverse.has(official))throw Error('Ambiguous official mapping: '+official);reverse.set(official,local);}
 let items=0,fields=0;
 for(const [official,texts]of Object.entries(overrides)) {
  if(official.startsWith('_'))continue;
  const id=reverse.get(official)||official,item=byId.get(id);
  if(!item)throw Error('Supplement has no builder item: '+official);
  if(!item.ext)throw Error('Expansion supplement targets a core item: '+id);
  const entries=Object.entries(texts).map(([field,text])=>{
   if(typeof text!=='string')throw Error('Non-text supplement: '+official+' '+field);
   fields++;return {label:label(field),text};
  });
  item.official_supplement={source:'FVTT 官方模组 · 中文补译',entries};items++;
 }
 console.log(`Official supplements: ${items} items, ${fields} fields`);
 return data;
}
module.exports={apply};
