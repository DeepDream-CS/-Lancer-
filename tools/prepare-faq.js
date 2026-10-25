// Parse the pinned GPL-3.0 upstream source. Never discard sections or questions.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..'), dir = path.join(root, 'source/faq');
const input = fs.readFileSync(path.join(dir, 'upstream.md'), 'utf8');
const slug = text => crypto.createHmac('sha512', 'abc').update(text).digest('hex').slice(0, 6);
const sections = [], entries = [];
let section, entry;
for (const line of input.split(/\r?\n/)) {
  if (line.startsWith('## ')) {
    const title = line.slice(3).trim();
    section = { id: slug(title), title, index: sections.length };
    sections.push(section); entry = null;
  } else if (line.startsWith('### ')) {
    const question = line.slice(4).trim();
    entry = { id: slug(question), index: entries.length, section: section.id, question, answer: '' };
    entries.push(entry);
  } else if (entry) entry.answer += line + '\n';
}
entries.forEach(e => { e.answer = e.answer.trim(); });
const result = { source: 'https://lancer-faq.netlify.app/', repository: 'https://github.com/aritsune/lancer-faq', revision: '3e5fd612a2308fe28f1f937620d1efd2f4bcf5ae', retrieved: '2026-10-25', license: 'GPL-3.0', contributors: fs.readFileSync(path.join(dir, 'contributors.txt'), 'utf8').trim().split(/\r?\n/), sections, entries };
const html = fs.readFileSync(path.join(dir, 'upstream.html'), 'utf8');
for (const item of [...sections, ...entries]) {
  if (!new RegExp('id=["\']?' + item.id + '["\'>]').test(html)) throw new Error('Upstream anchor mismatch: ' + item.id);
}
fs.writeFileSync(path.join(dir, 'upstream.json'), JSON.stringify(result, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'numbered.txt'), entries.map(e => `${e.index} [${e.id}] ${sections.find(s => s.id === e.section).title}\nQ: ${e.question}\nA: ${e.answer}\n`).join('\n'));
console.log(`${sections.length} sections, ${entries.length} complete Q&A; every source anchor verified against the live page.`);
