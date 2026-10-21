// Translation-only overlay. Stable IDs, English lookup keys and rule values stay intact.
const spec=require('../source/core-v35-overrides.json');
const nk=s=>s.replace(/’/g,"'");
function lookup(d,row){
  const x=d[row.kind].find(x=>row.id?x.id===row.id:nk(x.name)===nk(row.en));
  if(!x) throw Error('Unknown v3.5 translation target: '+JSON.stringify(row));
  const key={frames:nk(x.name),core_bonuses:nk(x.name),talents:x.name,pilot_gear:x.name,skills:x.name.toLowerCase(),backgrounds:x.name.toLowerCase()}[row.kind];
  const map={frames:'frames',core_bonuses:'cb',talents:'talents',pilot_gear:'gear',skills:'skills',backgrounds:'bg'}[row.kind];
  return {x,key,map};
}
function translator(pairs){
  const replacements=new Map(pairs.filter(([a,b])=>a&&a!==b));
  // Protect complete new names from matching an old name contained within them.
  const tokens=[...new Set([...replacements.keys(),...replacements.values()])].sort((a,b)=>b.length-a.length);
  const re=new RegExp(tokens.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
  return s=>s.replace(re,t=>replacements.get(t)||t);
}
function walk(v,translate){
  if(typeof v==='string')return translate(v);
  if(Array.isArray(v))return v.map(x=>walk(x,translate));
  if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x,translate)]));
  return v;
}
function apply(d){
  const pairs=spec.terms.map(t=>[t.from,t.to]);
  for(const row of [...spec.names,...spec.talents.map(t=>({...t,kind:'talents'}))]){
    const {x,key,map}=lookup(d,row),old=map?(typeof d.zh[map][key]==='string'?d.zh[map][key]:d.zh[map][key]?.name):x.zh_name;
    // Short generic words (e.g. 探子/主动) must not rewrite unrelated prose.
    if(old&&old.length>=4)pairs.push([old,row.name]);
  }
  d=walk(d,translator(pairs));
  for(const row of spec.names){const {x,key,map}=lookup(d,row);
    if(map==='frames')d.zh.frames[key]=row.name;
    else if(map)d.zh[map][key].name=row.name;
    else {x.zh_name=row.name;if(d.zh.gms[x.name])d.zh.gms[x.name].name=row.name;}
  }
  for(const row of spec.talents){const {x,key}=lookup(d,{...row,kind:'talents'}),t=d.zh.talents[key];
    const local=translator(t.ranks.map((r,i)=>[r.name,row.ranks[i]]));
    d.zh.talents[key]=walk(t,local);d.zh.talents[key].name=row.name;
    row.ranks.forEach((name,i)=>{d.zh.talents[key].ranks[i].name=name;x.ranks[i].name=name;});
  }
  // Update references within the same frame, without renaming generic words globally.
  for(const frame of d.frames){const pairs=[];
    for(const f of spec.fields.filter(f=>f.kind==='frames'&&f.id===frame.id)){
      const old=f.path.split('.').reduce((o,k)=>o[k],frame);if(old.length>=4)pairs.push([old,f.value]);
    }
    if(pairs.length)Object.assign(frame,walk(frame,translator(pairs)));
  }
  for(const f of spec.fields){const x=d[f.kind].find(x=>x.id===f.id);if(!x)throw Error(f.id);
    let o=x;const ks=f.path.split('.');for(const k of ks.slice(0,-1))o=o[k];
    if(typeof o[ks.at(-1)]!=='string')throw Error('Translation must target a string: '+f.path);
    o[ks.at(-1)]=f.value;
  }
  return d;
}
module.exports={apply,translator,spec};
