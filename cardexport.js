"use strict";
// 导出角色卡图片：按官方中文角色卡的版式，用 canvas 画出「驾驶员」与「机甲」两页，可下载为 PNG。
// 依赖 app.js 的数据和计算函数（mechStats、pilotStats 等），只在运行时调用。

const CARD_W = 920, CARD_H = 1240, CARD_SCALE = 2;
const C_RED = "#c8202f", C_BAR = "#f1f1f1", C_INK = "#111", C_SOFT = "#888", C_HINT = "#fff";
const FONT = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';

const stripHtml = h => String(h || "").replace(/<br\s*\/?>/gi, " ").replace(/<\/(p|li|div)>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const roman = n => ["", "I", "II", "III"][n] || "";

function newCanvas() {
	const cv = document.createElement("canvas");
	cv.width = CARD_W * CARD_SCALE; cv.height = CARD_H * CARD_SCALE;
	const g = cv.getContext("2d");
	g.scale(CARD_SCALE, CARD_SCALE);
	g.fillStyle = "#fff"; g.fillRect(0, 0, CARD_W, CARD_H);
	g.textBaseline = "alphabetic";
	return [cv, g];
}

// ---------- 画图小工具 ----------
const font = (size, bold) => `${bold ? "700" : "400"} ${size}px ${FONT}`;
function text(g, s, x, y, size = 14, opts = {}) {
	g.font = font(size, opts.bold);
	g.fillStyle = opts.color || C_INK;
	g.textAlign = opts.align || "left";
	g.fillText(String(s ?? ""), x, y);
	g.textAlign = "left";
}
function bar(g, x, y, w, h) { g.fillStyle = C_BAR; g.fillRect(x, y, w, h); }
// 中文按字、英文按词折行；超出行数时末尾加省略号
function wrap(g, s, w, maxLines) {
	const tokens = String(s || "").match(/[A-Za-z0-9+\-/.%()（）]+|\s+|./g) || [];
	const lines = [];
	let cur = "";
	for (const t of tokens) {
		if (g.measureText(cur + t).width <= w || !cur) { cur += t; continue; }
		lines.push(cur.trim()); cur = t.trimStart();
		if (lines.length === maxLines) break;
	}
	if (lines.length < maxLines && cur) lines.push(cur.trim());
	else if (cur && lines.length === maxLines) {
		let last = lines[maxLines - 1];
		while (last && g.measureText(last + "…").width > w) last = last.slice(0, -1);
		lines[maxLines - 1] = last + "…";
	}
	return lines;
}
// 在格子里写字：先尝试单行缩字，放不下再折行
function fill(g, s, x, y, w, h, opts = {}) {
	s = String(s ?? "");
	if (!s) return;
	const pad = opts.pad ?? 6, max = opts.size || 14, min = opts.min || 9;
	const iw = w - pad * 2;
	for (let size = max; size >= min; size -= 0.5) {
		g.font = font(size, opts.bold);
		if (g.measureText(s).width <= iw) {
			text(g, s, opts.align === "center" ? x + w / 2 : x + pad, y + h / 2 + size * 0.36, size, { ...opts, align: opts.align });
			return;
		}
	}
	const size = opts.wrapSize || min, lh = size * 1.3;
	g.font = font(size, opts.bold);
	const lines = wrap(g, s, iw, Math.max(1, Math.floor((h - 4) / lh)));
	const y0 = y + (h - lines.length * lh) / 2 + size;
	lines.forEach((l, i) => text(g, l, x + pad, y0 + i * lh, size, opts));
}
function hex(g, cx, cy, r, value, opts = {}) {
	g.beginPath();
	for (let i = 0; i < 6; i++) {
		const a = Math.PI / 6 + (i * Math.PI) / 3; // 尖顶六边形
		g.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
	}
	g.closePath();
	g.fillStyle = "#fff"; g.fill();
	g.lineWidth = 2.5; g.strokeStyle = C_RED; g.stroke();
	if (value !== undefined && value !== "") {
		const v = String(value);
		text(g, v, cx, cy + 6, v.length > 3 ? 12 : v.length > 2 ? 14 : 17, { bold: true, align: "center" });
	}
}
function title(g, zh, en, x, y, size = 26) {
	text(g, zh, x, y, size);
	g.font = font(size);
	text(g, en, x + g.measureText(zh).width, y, size, { bold: true });
}
function personIcon(g, x, y) {
	g.fillStyle = C_INK;
	g.beginPath(); g.arc(x + 9, y + 6, 5, 0, Math.PI * 2); g.fill();
	g.beginPath(); g.moveTo(x, y + 22); g.quadraticCurveTo(x + 9, y + 8, x + 18, y + 22); g.closePath(); g.fill();
}
function mechIcon(g, x, y) {
	g.fillStyle = C_INK;
	g.fillRect(x + 4, y, 12, 9); g.fillRect(x + 1, y + 10, 18, 8); g.fillRect(x + 3, y + 18, 5, 9); g.fillRect(x + 12, y + 18, 5, 9);
	g.fillStyle = "#fff"; g.fillRect(x + 7, y + 3, 6, 3);
}
const loadImage = src => new Promise(res => { if (!src) return res(null); const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });

// ---------- 驾驶员卡 ----------
async function drawPilotCard(p) {
	const [cv, g] = newCanvas();
	const L = LV(p.ll), ps = pilotStats(p);
	const bg = BGS[p.background];

	personIcon(g, 36, 44);
	text(g, "驾驶员", 64, 72, 36);
	[["姓名", p.name, 100, 26], ["称号", p.callsign, 135, 26], ["背景", bg ? zhOf("bg", bg) || bg.name : p.bgCustom, 173, 50]].forEach(([lab, val, y, h]) => {
		bar(g, 35, y, 328, h);
		text(g, lab, 37, y + 17, 15);
		fill(g, val, 78, y, 285, h > 30 ? 26 : h, { size: 15 });
	});

	// 等级与机甲能力
	const hx = [["LL", p.ll, 437, 121, "L"], ["毅力", "+" + L.grit, 479, 121, "R"], ["机体", "+" + p.hase.hull, 458, 157, "L"], ["系统", "+" + p.hase.sys, 500, 157, "R"], ["敏捷", "+" + p.hase.agi, 437, 193, "L"], ["工程", "+" + p.hase.eng, 479, 193, "R"]];
	hx.forEach(([lab, v, x, y, side]) => {
		hex(g, x, y, 20, v);
		text(g, lab, side === "L" ? x - 26 : x + 26, y + 6, 17, { align: side === "L" ? "right" : "left", bold: lab === "LL" });
	});

	// 头像框
	g.lineWidth = 3; g.strokeStyle = C_RED; g.strokeRect(586, 43, 304, 342);
	const im = await loadImage(p.portrait);
	if (im) {
		const bw = 300, bh = 338, s = Math.max(bw / im.width, bh / im.height);
		g.save(); g.beginPath(); g.rect(588, 45, bw, bh); g.clip();
		g.drawImage(im, 588 + (bw - im.width * s) / 2, 45 + (bh - im.height * s) / 2, im.width * s, im.height * s);
		g.restore();
	}

	// 触发
	title(g, "触发技能", "Triggers", 34, 254);
	const trig = p.triggers.filter(t => t.id || t.custom);
	for (let i = 0; i < 8; i++) {
		const col = i % 2, row = Math.floor(i / 2), y = 268 + row * 35;
		const x = col ? 297 : 36;
		bar(g, x, y, 193, 26); bar(g, x + 207, y, 40, 26);
		const t = trig[i];
		if (t) {
			fill(g, t.id ? zhOf("skill", SKILLS[t.id]) || SKILLS[t.id].name : t.custom, x, y, 193, 26);
			fill(g, "+" + t.val, x + 207, y, 40, 26, { align: "center", bold: true });
		}
	}

	// 天赋：按等级展开，每一级占一格
	title(g, "天赋", "Talents", 34, 433);
	const talents = [];
	for (let r = 1; r <= 3; r++) Object.entries(p.talents).forEach(([id, rank]) => { if (rank >= r && TALENTS[id]) talents.push(`${zhOf("talent", TALENTS[id]) || TALENTS[id].name} ${roman(r)}`); });
	const talLabels = ["LL0", "LL0", "LL0", "LL1", "LL2", "LL3", "LL4", "LL5", "LL6", "LL7", "LL8", "LL9", "LL10", "LL11", "LL12"];
	talLabels.forEach((lab, i) => {
		const left = i < 8, x = left ? 36 : 296, y = 444 + (left ? i : i - 8) * 34.4;
		bar(g, x, y, 246, 26);
		if (talents[i]) fill(g, talents[i], x, y, 246, 26);
		else text(g, lab, x + 4, y + 19, 16, { bold: true, color: C_HINT });
	});

	// 牌照：每一级占一格
	title(g, "许可证", "Licenses", 585, 433);
	const lic = [];
	for (let r = 1; r <= 3; r++) Object.entries(p.licenses).forEach(([id, rank]) => { if (rank >= r && FRAMES[id]) lic.push(`${FRAMES[id].source} ${zhOf("frame", FRAMES[id]) || FRAMES[id].name} ${roman(r)}`); });
	for (let i = 0; i < 12; i++) {
		const y = 444 + i * 34.3;
		bar(g, 582, y, 311, 26);
		if (lic[i]) fill(g, lic[i], 582, y, 311, 26);
		else text(g, "LL" + (i + 1), 586, y + 19, 16, { bold: true, color: C_HINT });
	}

	// 核心加成
	title(g, "核心加成", "Core Bonuses", 34, 776);
	for (let i = 0; i < 4; i++) {
		const x = i % 2 ? 295 : 36, y = 787 + Math.floor(i / 2) * 34;
		bar(g, x, y, 246, 26);
		const c = CBS[p.coreBonuses[i]];
		if (c) fill(g, zhOf("cb", c) || c.name, x, y, 246, 26);
	}

	// 配备
	g.lineWidth = 3; g.strokeStyle = C_RED; g.strokeRect(33, 870, 705, 340);
	title(g, "配备", "Loadout", 42, 896);
	const gearLine = id => {
		const it = GEAR[id];
		if (!it) return "";
		const meta = [it.range ? rngText(it.range) : "", it.damage ? dmgText(it.damage) : "", tagsPlain(it.tags)].filter(Boolean).join(" · ");
		return (zhOf("gear", it) || it.name) + (meta ? "　" + meta : "");
	};
	const sect = (zh, en, y) => { text(g, zh, 42, y + 14, 16); text(g, en, 42, y + 32, 17, { bold: true }); };
	sect("装甲", "ARMOR", 912); bar(g, 146, 920, 583, 32); fill(g, gearLine(p.gear.armor), 146, 920, 583, 32, { size: 15 });
	g.fillStyle = C_INK; g.fillRect(40, 962, 690, 1.5);
	sect("武器", "WEAPONS", 974);
	[972, 1013].forEach((y, i) => { bar(g, 146, y, 583, 32); fill(g, gearLine(p.gear.weapons[i]), 146, y, 583, 32, { size: 15 }); });
	g.fillStyle = C_INK; g.fillRect(40, 1056, 690, 1.5);
	sect("设备", "GEAR", 1070);
	[1070, 1112, 1153].forEach((y, i) => { bar(g, 146, y, 583, 32); fill(g, gearLine(p.gear.items[i]), 146, y, 583, 32, { size: 15 }); });

	// 驾驶员数值
	[["HP", ps.hp, 855, 893], ["最大HP", ps.hp, 873, 928], ["装甲", ps.armor, 855, 963], ["电子防御", ps.edef, 873, 998], ["回避", ps.evasion, 855, 1033], ["速度", ps.speed, 873, 1068]].forEach(([lab, v, x, y]) => {
		hex(g, x, y, 20, v);
		text(g, lab, x - 25, y + 6, 17, { align: "right", bold: lab === "HP" });
	});
	return cv;
}

// ---------- 机甲卡 ----------
function weaponRows(p, m) {
	const f = FRAMES[m.frame];
	const rows = [];
	const add = (w, mountName, mod, note = '') => {
		const prof = effectiveProfile(w, w.profiles ? w.profiles[0] : w, mod, p, m);
		const eff = [stripHtml(w.effect), w.on_hit ? "命中：" + stripHtml(txt(w.on_hit)) : "", w.on_crit ? "会心一击：" + stripHtml(txt(w.on_crit)) : "", w.on_attack ? "攻击时：" + stripHtml(txt(w.on_attack)) : "", mod ? `改装「${plain("item", mod)}」：${stripHtml(mod.effect)}` : ""].filter(Boolean).join(" ");
		rows.push([plain("item", w), mountName + " / " + (T.mount[w.mount] || w.mount) + (T.wtype[w.type] || w.type || ""), rngText(prof.range), dmgText(prof.damage), tagsPlain(prof.tags || w.tags), [note, eff].filter(Boolean).join(' ') ]);
	};
	integratedOf(f, p, m).filter(w => w.mount).forEach(w => add(w, "内建", null, buildWeaponNote(p,m,{w,mount:{type:'Integrated',key:'integrated'},i:0})));
	equippedWeapons(p, m).forEach(e => add(e.w, (T.mount[e.mount.type] || e.mount.type), e.mod, buildWeaponNote(p,m,e)));
	return rows;
}
function systemRows(m, p) {
	return [...m.systems.map(id => SYSTEMS[id]).filter(Boolean), ...integratedOf(FRAMES[m.frame],p,m).filter(s=>!s.mount)].map(s => {
		const acts = asList(s.actions).map(a => `${a.name ? a.name + "：" : ""}${stripHtml(a.detail)}`);
		const deps = asList(s.deployables).map(d => `${d.name}：${stripHtml(d.detail)}`);
		return [plain("item", s), s.sp || 0, tagsPlain(limitedTags(s.tags,p,m)), [stripHtml(s.effect), ...acts, ...deps].filter(Boolean).join(" ")];
	});
}

function drawMechCard(p, m) {
	const [cv, g] = newCanvas();
	const f = FRAMES[m.frame];
	const L = LV(p.ll);
	const st = mechStats(p, m) || {};

	mechIcon(g, 38, 20);
	text(g, "机甲", 66, 44, 36);
	[["名称", m.name, 68], ["骨架", f ? `${f.source} ${zhOf("frame", f) || f.name}` : "", 104]].forEach(([lab, val, y]) => {
		bar(g, 37, y, 328, 26); text(g, lab, 39, y + 18, 17); fill(g, val, 80, y, 285, 26, { size: 15 });
	});

	[["LL", p.ll, 445, 44, "L"], ["毅力", "+" + L.grit, 487, 44, "R"], ["机体", "+" + p.hase.hull, 466, 80, "L"], ["系统", "+" + p.hase.sys, 506, 80, "R"], ["敏捷", "+" + p.hase.agi, 445, 116, "L"], ["工程", "+" + p.hase.eng, 487, 116, "R"]].forEach(([lab, v, x, y, side]) => {
		hex(g, x, y, 20, v);
		text(g, lab, side === "L" ? x - 25 : x + 25, y + 7, 18, { align: side === "L" ? "right" : "left", bold: lab === "LL" });
	});
	[["结构", st.structure, 755, 46, "L"], ["HP", st.hp, 812, 46, "R"], ["压力", st.stress, 734, 82, "L"], ["热度上限", st.heatcap, 795, 82, "R"], ["护盾", "", 753, 117, "L"], ["装甲", st.armor, 793, 117, "R"]].forEach(([lab, v, x, y, side]) => {
		hex(g, x, y, 20, v);
		text(g, lab, side === "L" ? x - 25 : x + 25, y + 7, 18, { align: side === "L" ? "right" : "left", bold: lab === "HP" });
	});
	const signed = v => (v >= 0 ? "+" : "") + v;
	[["攻击加成", signed(st.attack ?? 0)], ["科技攻击", signed(st.tech ?? 0)], ["豁免目标", st.save], ["速度", st.speed], ["电子防御", st.edef], ["回避", st.evasion], ["感应", st.sensor], ["大小", st.size === 0.5 ? "½" : st.size]].forEach(([lab, v], i) => {
		const x = 37 + i * 110.2;
		bar(g, x, 152, 84, 56);
		text(g, lab, x + 42, 166, 12, { align: "center" });
		text(g, v ?? "", x + 42, 198, 22, { align: "center", bold: true });
	});

	// 骨架特性（最多 4 条）
	title(g, "骨架特性", "Frame Traits", 36, 241);
	const traits = f ? f.traits : [];
	for (let i = 0; i < 4; i++) {
		const x = i % 2 ? 472 : 34, y = 251 + Math.floor(i / 2) * 50, w = 420, h = 44;
		bar(g, x, y, w, h);
		const t = traits[i];
		if (t) {
			text(g, t.name, x + 6, y + 15, 12.5, { bold: true });
			g.font = font(10.5);
			wrap(g, stripHtml(t.description), w - 12, 2).forEach((l, j) => text(g, l, x + 6, y + 28 + j * 13, 10.5));
		}
	}

	// 核心系统与核心加成
	title(g, "核心加成", "Core Bonus", 38, 380);
	text(g, "核心能力", 708, 373, 18, { align: "right" });
	text(g, "CORE POWER", 708, 373, 18, { bold: true });
	hex(g, 869, 366, 20, 1);
	bar(g, 35, 391, 858, 117);
	const coreLines = [];
	if (f) {
		const cs = f.core_system;
		coreLines.push(`【核心系统】${cs.name}${cs.active_name ? "：" + cs.active_name : ""} — ${stripHtml(cs.active_effect)}`);
		if (cs.passive_name) coreLines.push(`【被动】${cs.passive_name} — ${stripHtml(cs.passive_effect)}`);
	}
	p.coreBonuses.forEach(id => {
		const c = CBS[id];
		if (!c) return;
		const z = Z.cb[nk(c.name)];
		const eff = z ? stripHtml(z.html.replace(/<p><i>[\s\S]*?<\/i><\/p>/g, "")) : c.effect;
		coreLines.push(`【${zhOf("cb", c) || c.name}】${eff}`);
	});
	g.font = font(11);
	let cy = 408;
	for (const ln of coreLines) {
		const ls = wrap(g, ln, 840, 3);
		for (const l of ls) { if (cy > 503) break; text(g, l, 44, cy, 11); cy += 14.5; }
		cy += 2;
	}

	// 武器
	title(g, "武器", "Weapons", 38, 538);
	const wc = [[37, 217, "名字", ""], [263, 128, "槽位", "MOUNT"], [400, 100, "射程", "RANGE"], [509, 100, "伤害", "DAMAGE"], [621, 100, "标签", "TAGS"], [734, 160, "效果", "EFFECTS"]];
	const header = (cols, y) => cols.forEach(([x, , zh, en]) => { text(g, zh, x, y, 12); g.font = font(12); text(g, en, x + g.measureText(zh).width, y, 12, { bold: true }); });
	header(wc, 563);
	const wr = weaponRows(p, m);
	for (let i = 0; i < 6; i++) {
		const y = 572 + i * 46.6;
		wc.forEach(([x, w]) => bar(g, x, y, w, 37));
		let r = wr[i];
		if (i === 5 && wr.length > 6) r = [`……另有 ${wr.length - 5} 件，见文字角色卡`, "", "", "", "", ""];
		if (r) r.forEach((v, j) => fill(g, v, wc[j][0], y, wc[j][1], 37, { size: j === 0 ? 13 : 12, min: 8.5, wrapSize: 8.5 }));
	}

	// 系统
	title(g, "系统", "Systems", 38, 881);
	text(g, "总", 820, 887, 18, { align: "right" }); text(g, "SP", 820, 887, 18, { bold: true });
	hex(g, 869, 880, 21, `${st.spUsed ?? 0}/${st.sp ?? 0}`);
	const sc = [[37, 217, "名字", ""], [263, 53, "", "SP"], [327, 173, "标签", "TAGS"], [509, 384, "效果", "EFFECTS"]];
	header(sc, 903);
	const sr = systemRows(m, p);
	for (let i = 0; i < 6; i++) {
		const y = 908 + i * 44.2;
		sc.forEach(([x, w]) => bar(g, x, y, w, 37));
		let r = sr[i];
		if (i === 5 && sr.length > 6) r = [`……另有 ${sr.length - 5} 个系统`, "", "", "见文字角色卡"];
		if (r) r.forEach((v, j) => fill(g, v, sc[j][0], y, sc[j][1], 37, { size: j === 0 ? 13 : 12, min: 8.5, wrapSize: 8.5, align: j === 1 ? "center" : undefined }));
	}
	return cv;
}

// ---------- 导出与预览 ----------
function downloadCanvas(cv, name) {
	cv.toBlob(b => {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(b);
		a.download = name.replace(/[\\/:*?"<>|]/g, "_") + ".png";
		a.click();
		setTimeout(() => URL.revokeObjectURL(a.href), 2000);
	}, "image/png");
}
async function cardsFor(p, which) {
	const out = [];
	if (which !== "mech") out.push([await drawPilotCard(p), `${p.name || "驾驶员"}-驾驶员卡`]);
	const mechs = which === "pilot" ? [] : which === "mech" ? [M()] : p.mechs;
	mechs.forEach(m => { if (FRAMES[m.frame]) out.push([drawMechCard(p, m), `${p.name || "驾驶员"}-${m.name || "机甲"}-机甲卡`]); });
	return out;
}
// 角色卡页里的缩略预览
async function renderCardPreviews(p) {
	const box = document.getElementById("cardPreview");
	if (!box) return;
	const cards = await cardsFor(p, "all");
	box.innerHTML = "";
	cards.forEach(([cv, name]) => {
		const fig = document.createElement("figure");
		cv.className = "card-img";
		cv.title = "点击下载：" + name;
		cv.tabIndex = 0;
		cv.setAttribute('role','button');
		cv.setAttribute('aria-label','下载 '+name+' PNG');
		cv.onclick = () => downloadCanvas(cv, name);
		cv.onkeydown = e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();downloadCanvas(cv,name);} };
		fig.appendChild(cv);
		const cap = document.createElement("figcaption");
		cap.textContent = name;
		fig.appendChild(cap);
		box.appendChild(fig);
	});
}
document.addEventListener("click", async e => {
	const b = e.target.closest("[data-card]");
	if (!b) return;
	const cards = await cardsFor(P(), b.dataset.card);
	cards.forEach(([cv, name], i) => setTimeout(() => downloadCanvas(cv, name), i * 400));
});
