// Shared terminology for generated UI text. The upstream source/tw snapshot stays unchanged.
const replacements = [
  ['软掩护','软性掩护'], ['硬掩护','硬性掩护'], ['标准移动','普通移动'],
  ['奈米','纳米'], ['客制','定制'], ['订制','定制'], ['自订','自定义'],
  ['会心一击击','会心一击'], ['会心：','会心一击：'], ['列印','打印'],
  ['机甲技能','机甲能力'],
  ['解除除','解除'],
];
function calibrate(text) {
  for (const [from,to] of replacements) text=text.replaceAll(from,to);
  text=text.replace(/重击(?!弹)/g,'会心一击');
  // Blast is an area template; Explosive is a damage type.
  text=text.replace(/爆炸(?=\s*\d)/g,'溅射').replaceAll('爆炸、直线、爆发和锥形','溅射、直线、爆发和锥形');
  return text;
}
function walk(value) {
  if(typeof value==='string') return calibrate(value);
  if(Array.isArray(value)) return value.map(walk);
  if(value&&typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,walk(v)]));
  return value;
}
module.exports={calibrate,walk};
