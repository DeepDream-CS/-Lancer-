"use strict";
// 世界观与风味典藏阅读器（Lore Codex）：
// 汇总骨架、牌照合集、机甲武器（智能合并 GMS T-1/T-2/T-3 系列共用文案）、系统、改装、天赋、核心奖励、背景、随身装备与专业牌照的风味设定。
// 纯只读展示，不修改任何角色存档。

const GMS_SHARED_PREAMBLE = "与GMS机甲一样，GMS武器也是可靠的银河标准产品，采用可互换零件制造，足以承受几乎任何环境。目前共有三个在产系列。";
const GMS_WEAPON_SERIES = [
	{ id: "gms_series_t1", key: "T-1", label: "GMS 一型（T-1）系列共用", title: "GMS 一型（T-1）动能武器系列", en: "GMS Type-I (T-1) Weapon Line", match: /一型（T-1）系列/ },
	{ id: "gms_series_t2", key: "T-2", label: "GMS 二型（T-2）系列共用", title: "GMS 二型（T-2）充能与能量武器系列", en: "GMS Type-II (T-2) Weapon Line", match: /二型（T-2）系列/ },
	{ id: "gms_series_t3", key: "T-3", label: "GMS 三型（T-3）系列共用", title: "GMS 三型（T-3）重型与特种武器系列", en: "GMS Type-III (T-3) Weapon Line", match: /三型（T-3）系列/ },
];

const LORE_CATS = [
	{ id: "", label: "全部档案" },
	{ id: "dossier", label: "牌照连读合集" },
	{ id: "frame", label: "骨架与厂商" },
	{ id: "weapon", label: "机甲武器" },
	{ id: "system", label: "系统与改装" },
	{ id: "talent", label: "天赋" },
	{ id: "cb", label: "核心奖励" },
	{ id: "pilot", label: "背景与随身装备" },
	{ id: "pro", label: "专业牌照" },
];

const loreState = {
	cat: "",
	q: "",
	maker: "",
	src: "", // '' | 'core' | 'ext'
	ownedOnly: false,
	mergeShared: true,
	font: "md", // 'sm' | 'md' | 'lg'
	selectedId: "",
};

function rawItemLore(it) {
	if (!it) return null;
	const found = window.LANCER_LORE?.items?.[it.id];
	if (found?.text) return found;
	if (it.description && !/^Gained from\b/i.test(it.description)) {
		return { text: it.description, lang: /[\u4e00-\u9fff]/.test(it.description) ? "zh" : "en", source: it.ext ? "项目已录入资料" : "基础数据", pages: [] };
	}
	return null;
}

function cleanLoreText(raw) {
	return String(raw || "").replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]*>/g, "").trim();
}

function gmsSeriesMeta(it, text) {
	if (!it || it.source !== "GMS") return null;
	const clean = cleanLoreText(text);
	if (!clean) return null;
	const def = GMS_WEAPON_SERIES.find(s => s.match.test(clean));
	if (!def) return null;
	const hasPreamble = clean.startsWith(GMS_SHARED_PREAMBLE);
	const body = hasPreamble ? clean.slice(GMS_SHARED_PREAMBLE.length).trim() : clean;
	return { ...def, preamble: hasPreamble ? GMS_SHARED_PREAMBLE : "", body };
}

function extractCoreBonusFlavor(c) {
	const z = Z.cb[nk(c.name)];
	if (z?.html) {
		const italics = [...z.html.matchAll(/<p>\s*<i>([\s\S]*?)<\/i>\s*<\/p>/gi)].map(m => cleanLoreText(m[1])).filter(Boolean);
		if (italics.length) return italics.join("\n\n");
	}
	if (c.description) return cleanLoreText(c.description);
	return "";
}

function loreAttributionText(lore) {
	if (!lore?.source) return "";
	return `来源：${lore.source}${lore.pages?.length ? " · PDF 第 " + lore.pages.join("、") + " 页" : ""}`;
}

// ---------- 构建全量典藏索引（懒加载缓存） ----------
let loreCatalogCache = null;

function buildLoreCatalog() {
	if (loreCatalogCache) return loreCatalogCache;
	const entries = [];
	const itemToEntryId = new Map(); // raw item/frame/etc id -> canonical entry id

	const add = e => {
		e.haystack = `${e.title} ${e.en || ""} ${e.maker || ""} ${e.maker ? makerName(e.maker) : ""} ${e.sub || ""} ${e.sourceText || ""} ${e.searchExtra || ""} ${e.plainBody || ""}`.toLocaleLowerCase();
		entries.push(e);
		return e;
	};

	const paraHtml = text => cleanLoreText(text).split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join("");

	// 1. 厂商简介（带独立设定文的厂商）
	for (const mk of D.manufacturers) {
		if (!mk.description) continue;
		const plainBody = cleanLoreText(mk.description);
		add({
			id: `maker:${mk.id}`,
			cat: "frame",
			kindLabel: "厂商档案",
			title: makerName(mk.id),
			en: mk.name,
			maker: mk.id,
			ext: !["GMS", "IPS-N", "SSC", "HORUS", "HA"].includes(mk.id),
			sub: "制造商与设计理念",
			sourceText: "厂商背景档案",
			plainBody,
			bodyHtml: paraHtml(mk.description),
			ownCheck: p => makerLicenseTotal(p, mk.id) > 0,
		});
	}

	// 2. 全部骨架设定
	for (const f of D.frames) {
		if (!f.description) continue;
		const plainBody = cleanLoreText(f.description);
		const baseFrame = f.variant_of ? FRAMES[f.variant_of] : f;
		const dossierId = [f.id, f.variant_of].includes(EVEREST) ? "dossier:gms_core" : (baseFrame && !baseFrame.no_license ? `dossier:${baseFrame.id}` : "");
		const e = add({
			id: `frame:${f.id}`,
			cat: "frame",
			kindLabel: f.variant_of ? "变体骨架" : "机甲骨架",
			title: frameName(f),
			en: f.name,
			maker: f.source,
			ext: !!f.ext,
			sub: `${frameRoles(f)}${f.variant_of ? " · " + variantNote(f) : ""}`,
			sourceText: f.pack || "核心规则书",
			plainBody,
			bodyHtml: f.description.includes("<p") ? f.description : paraHtml(f.description),
			frameId: f.id,
			dossierId,
			ownCheck: p => frameAvailable(p, f) || p.mechs.some(mx => mx.frame === f.id),
			rulesPeek: () => {
				const old = STAT_CTX;
				try { STAT_CTX = {}; return frameRulesHtml(f, "lorepeek"); } finally { STAT_CTX = old; }
			},
		});
		itemToEntryId.set(f.id, e.id);
	}

	// 3. 机甲武器（收集 GMS 系列成员，生成 3 篇合并系列档案 + 非共用独立武器 + 可选展开的逐件 GMS 武器）
	const gmsBuckets = Object.fromEntries(GMS_WEAPON_SERIES.map(s => [s.id, { def: s, members: [], lore: null, meta: null }]));
	for (const w of D.weapons) {
		const lore = rawItemLore(w);
		if (!lore?.text) continue;
		const gms = gmsSeriesMeta(w, lore.text);
		const o = weaponOrigin(w);
		const licF = licenseOf(w);
		const plainBody = cleanLoreText(lore.text);
		const individual = add({
			id: `weapon:${w.id}`,
			cat: "weapon",
			kindLabel: gms ? `GMS ${gms.key} 武器` : "机甲武器",
			title: plain("item", w),
			en: w.name,
			maker: w.source || (licF?.source || ""),
			ext: !!w.ext,
			sub: `${o.text} · ${T.mount[w.mount] || w.mount}${T.wtype[w.type] || w.type}`,
			sourceText: loreAttributionText(lore) || (w.pack || "核心规则书"),
			plainBody,
			bodyHtml: gms ? `${gms.preamble ? `<div class="lc-preamble">${esc(gms.preamble)}</div>` : ""}${paraHtml(gms.body)}` : paraHtml(lore.text),
			sharedGroupId: gms ? gms.id : "",
			isSharedMember: !!gms,
			itemId: w.id,
			licenseId: licF?.id || "",
			dossierId: w.source === "GMS" ? "dossier:gms_core" : (licF ? `dossier:${licF.id}` : ""),
			ownCheck: p => itemAvailable(p, w) || p.mechs.some(mx => equippedWeapons(p, mx).some(eq => eq.w.id === w.id)),
			rulesPeek: () => weaponEffectHtml(w),
		});
		itemToEntryId.set(w.id, gms ? gms.id : individual.id);
		if (gms) {
			gmsBuckets[gms.id].members.push(w);
			if (!gmsBuckets[gms.id].lore) { gmsBuckets[gms.id].lore = lore; gmsBuckets[gms.id].meta = gms; }
		}
	}
	for (const s of GMS_WEAPON_SERIES) {
		const b = gmsBuckets[s.id];
		if (!b.members.length || !b.meta) continue;
		const memberNames = b.members.map(w => `${plain("item", w)} ${w.name}`).join(" ");
		add({
			id: s.id,
			cat: "weapon",
			kindLabel: `GMS 共用系列 (${b.members.length}件)`,
			title: s.title,
			en: s.en,
			maker: "GMS",
			ext: false,
			sub: `覆盖 ${b.members.length} 件 GMS 核心武器（去重合并）`,
			sourceText: loreAttributionText(b.lore) || "核心规则书 · GMS 武器系列总览",
			searchExtra: memberNames,
			plainBody: cleanLoreText(b.lore.text),
			bodyHtml: `${b.meta.preamble ? `<div class="lc-preamble">${esc(b.meta.preamble)}</div>` : ""}${paraHtml(b.meta.body)}`,
			isSharedGroup: true,
			members: b.members,
			dossierId: "dossier:gms_core",
			ownCheck: () => true,
		});
	}

	// 4. 机甲系统与武器改装
	for (const it of [...D.systems, ...D.mods]) {
		const lore = rawItemLore(it);
		if (!lore?.text) continue;
		const isMod = !!MODS[it.id];
		const o = systemLibraryOrigin(it);
		const licF = licenseOf(it);
		const plainBody = cleanLoreText(lore.text);
		const e = add({
			id: `${isMod ? "mod" : "system"}:${it.id}`,
			cat: "system",
			kindLabel: isMod ? "武器改装" : "机甲系统",
			title: plain("item", it),
			en: it.name,
			maker: it.source || (licF?.source || ""),
			ext: !!it.ext,
			sub: `${o.text} · ${it.sp || 0} SP`,
			sourceText: loreAttributionText(lore) || (it.pack || "核心规则书"),
			plainBody,
			bodyHtml: paraHtml(lore.text),
			itemId: it.id,
			licenseId: licF?.id || "",
			dossierId: it.source === "GMS" ? "dossier:gms_core" : (licF ? `dossier:${licF.id}` : ""),
			ownCheck: p => systemLibraryAvailable(it, p) || p.mechs.some(mx => mx.systems.includes(it.id)),
			rulesPeek: () => systemLibraryEffect(it),
		});
		itemToEntryId.set(it.id, e.id);
	}

	// 5. 牌照连读合集（GMS 通用档案 + 每个标准牌照的骨架+变体+I~III级全部装备连读）
	{
		const gmsFrames = D.frames.filter(f => [f.id, f.variant_of].includes(EVEREST));
		const gmsUniqueWeapons = D.weapons.filter(w => w.source === "GMS" && !gmsSeriesMeta(w, rawItemLore(w)?.text || "") && rawItemLore(w));
		const gmsSystems = [...D.systems, ...D.mods].filter(it => it.source === "GMS" && rawItemLore(it));
		const parts = [];
		parts.push({ heading: "GMS 通用骨架（埃弗勒斯及其变体）", items: gmsFrames.map(f => ({ title: frameName(f), sub: frameRoles(f), html: f.description.includes("<p") ? f.description : paraHtml(f.description), meta: f.pack || "核心规则书" })) });
		parts.push({
			heading: "GMS 武器三大标准系列（共 21 件武器，去重合并）",
			items: GMS_WEAPON_SERIES.filter(s => gmsBuckets[s.id].members.length).map(s => {
				const b = gmsBuckets[s.id];
				return {
					title: `${s.title}（${b.members.map(w => plain("item", w)).join("、")}）`,
					sub: `涵盖 ${b.members.length} 件 GMS 核心武器`,
					html: `${b.meta.preamble ? `<div class="lc-preamble">${esc(b.meta.preamble)}</div>` : ""}${paraHtml(b.meta.body)}`,
					meta: loreAttributionText(b.lore),
				};
			}),
		});
		if (gmsUniqueWeapons.length) {
			parts.push({ heading: "GMS 独立扩展武器", items: gmsUniqueWeapons.map(w => ({ title: plain("item", w), sub: `${T.mount[w.mount] || w.mount}${T.wtype[w.type] || w.type}`, html: paraHtml(rawItemLore(w).text), meta: loreAttributionText(rawItemLore(w)) })) });
		}
		parts.push({ heading: `GMS 通用系统（${gmsSystems.length} 项）`, items: gmsSystems.map(s => ({ title: plain("item", s), sub: `${s.sp || 0} SP`, html: paraHtml(rawItemLore(s).text), meta: loreAttributionText(rawItemLore(s)) })) });
		const searchExtra = [
			...gmsFrames.map(f => `${frameName(f)} ${f.name}`),
			...D.weapons.filter(w => w.source === "GMS").map(w => `${plain("item", w)} ${w.name}`),
			...gmsSystems.map(s => `${plain("item", s)} ${s.name}`),
		].join(" ");
		const plainBody = parts.flatMap(sec => sec.items.map(i => cleanLoreText(i.html))).join("\n");
		add({
			id: "dossier:gms_core",
			cat: "dossier",
			kindLabel: "通用档案合集",
			title: "GMS 通用骨架、三大武器系列与系统",
			en: "General Massive Systems Standard Catalogue",
			maker: "GMS",
			ext: false,
			sub: `3 部通用骨架 · 3 大去重武器系列 · ${gmsSystems.length} 项通用系统`,
			sourceText: "核心规则书与官方扩展 · GMS 合集",
			searchExtra,
			plainBody,
			dossierSections: parts,
			ownCheck: () => true,
		});
	}

	for (const f of licenseFrames()) {
		const variants = D.frames.filter(v => v.variant_of === f.id && v.description);
		const gear = [...D.weapons, ...D.systems, ...D.mods].filter(it => it.source && licenseOf(it) === f && rawItemLore(it));
		const parts = [];
		if (f.description) {
			parts.push({
				heading: "骨架档案",
				items: [
					{ title: `${frameName(f)}（标准骨架）`, sub: frameRoles(f), html: f.description.includes("<p") ? f.description : paraHtml(f.description), meta: f.pack || "核心规则书" },
					...variants.map(v => ({ title: `${frameName(v)}（变体骨架）`, sub: frameRoles(v), html: v.description.includes("<p") ? v.description : paraHtml(v.description), meta: v.pack || "扩展" })),
				],
			});
		}
		for (const lv of [1, 2, 3]) {
			const rankGear = gear.filter(it => (it.license_level || 0) === lv);
			if (!rankGear.length) continue;
			parts.push({
				heading: `牌照 ${["", "I", "II", "III"][lv]} 级装备风味`,
				items: rankGear.map(it => {
					const lore = rawItemLore(it);
					const kind = WEAPONS[it.id] ? `${T.mount[it.mount] || it.mount}${T.wtype[it.type] || it.type}` : MODS[it.id] ? "武器改装" : "机甲系统";
					return { title: plain("item", it), sub: `${kind}${it.sp ? ` · ${it.sp} SP` : ""}`, html: paraHtml(lore.text), meta: loreAttributionText(lore) };
				}),
			});
		}
		if (!parts.length) continue;
		const totalItems = (f.description ? 1 : 0) + variants.length + gear.length;
		const searchExtra = [frameName(f), f.name, ...variants.flatMap(v => [frameName(v), v.name]), ...gear.flatMap(it => [plain("item", it), it.name])].join(" ");
		const plainBody = parts.flatMap(sec => sec.items.map(i => cleanLoreText(i.html))).join("\n");
		add({
			id: `dossier:${f.id}`,
			cat: "dossier",
			kindLabel: `牌照合集 (${totalItems}篇)`,
			title: `${frameName(f)} 牌照完整风味档案`,
			en: `${f.source} ${f.name} License Dossier`,
			maker: f.source,
			ext: !!f.ext,
			sub: `${f.source} · 骨架${variants.length ? ` + ${variants.length} 变体` : ""} + ${gear.length} 件装备`,
			sourceText: f.pack || "核心规则书",
			searchExtra,
			plainBody,
			licenseId: f.id,
			dossierSections: parts,
			ownCheck: p => (p.licenses[f.id] || 0) > 0 || p.mechs.some(mx => mx.frame === f.id || FRAMES[mx.frame]?.variant_of === f.id),
		});
	}

	// 6. 天赋风味
	for (const t of D.talents) {
		const z = Z.talents[t.name];
		const desc = z?.desc || t.description || "";
		if (!cleanLoreText(desc)) continue;
		const e = add({
			id: `talent:${t.id}`,
			cat: "talent",
			kindLabel: "天赋设定",
			title: plain("talent", t),
			en: t.name,
			maker: "",
			ext: !!t.ext,
			sub: t.terse || "驾驶员天赋",
			sourceText: t.pack || "核心规则书",
			plainBody: cleanLoreText(desc),
			bodyHtml: desc.includes("<p") ? desc : paraHtml(desc),
			ownCheck: p => (p.talents[t.id] || 0) > 0,
			rulesPeek: () => t.ranks.map((rk, i) => `<div class="rank"><div class="rank-h">${["I", "II", "III"][i]}．${esc(z ? z.ranks[i].name : rk.name)}</div>${z ? z.ranks[i].html : rk.description}</div>`).join(""),
		});
		itemToEntryId.set(t.id, e.id);
	}

	// 7. 核心奖励风味
	for (const c of D.core_bonuses) {
		const flavor = extractCoreBonusFlavor(c);
		if (!flavor) continue;
		const z = Z.cb[nk(c.name)];
		const e = add({
			id: `cb:${c.id}`,
			cat: "cb",
			kindLabel: "核心奖励",
			title: plain("cb", c),
			en: c.name,
			maker: c.source,
			ext: !!c.ext,
			sub: `${makerName(c.source)} 核心奖励`,
			sourceText: c.pack || "核心规则书",
			plainBody: flavor,
			bodyHtml: paraHtml(flavor),
			ownCheck: p => hasCB(p, c.id),
			rulesPeek: () => `<div class="desc">${z ? z.html : esc(c.effect || "")}</div>`,
		});
		itemToEntryId.set(c.id, e.id);
	}

	// 8. 驾驶员背景与随身装备
	for (const b of D.backgrounds) {
		const z = Z.bg[b.name.toLowerCase()];
		const html = z?.html || b.description || "";
		if (!cleanLoreText(html)) continue;
		add({
			id: `bg:${b.id}`,
			cat: "pilot",
			kindLabel: "驾驶员背景",
			title: plain("bg", b),
			en: b.name,
			maker: "",
			ext: !!b.ext,
			sub: z?.triggers || "背景设定",
			sourceText: b.pack || "核心规则书",
			plainBody: cleanLoreText(html),
			bodyHtml: html.includes("<p") ? html : paraHtml(html),
			ownCheck: p => p.background === b.id,
		});
	}
	for (const g of D.pilot_gear) {
		const text = cleanLoreText(g.description || "");
		if (!text) continue;
		add({
			id: `gear:${g.id}`,
			cat: "pilot",
			kindLabel: { Armor: "驾驶装甲", Weapon: "驾驶武器", Gear: "随身装备" }[g.type] || "驾驶装备",
			title: plain("gear", g),
			en: g.name,
			maker: "",
			ext: !!g.ext,
			sub: [armorText(g), g.damage ? dmgText(g.damage) : "", g.range ? rngText(g.range) : "", pilotGearActionText(g)].filter(Boolean).join(" · ") || "驾驶员装备",
			sourceText: g.pack || "核心规则书",
			plainBody: text,
			bodyHtml: paraHtml(text),
			ownCheck: p => p.gear.armor === g.id || (p.gear.weapons || []).includes(g.id) || (p.gear.items || []).includes(g.id),
		});
	}

	// 9. 专业牌照
	for (const def of D.professional_licenses || []) {
		const gear = [...D.weapons, ...D.systems, ...D.mods].filter(it => it.professional_license === def.id && rawItemLore(it));
		if (!def.description && !gear.length) continue;
		const parts = [];
		if (def.description) parts.push({ heading: "专业牌照简介", items: [{ title: `${def.name} ${["", "I", "II", "III"][def.rank]}`, sub: makerName(def.source), html: paraHtml(def.description), meta: "专业牌照扩展" }] });
		if (gear.length) parts.push({ heading: "牌照解锁装备风味", items: gear.map(it => ({ title: plain("item", it), sub: `${it.sp != null ? it.sp + " SP" : ""}`, html: paraHtml(rawItemLore(it).text), meta: loreAttributionText(rawItemLore(it)) })) });
		const plainBody = parts.flatMap(sec => sec.items.map(i => cleanLoreText(i.html))).join("\n");
		add({
			id: `pro:${def.id}`,
			cat: "pro",
			kindLabel: `专业牌照 ${["", "I", "II", "III"][def.rank]}`,
			title: `${def.name} ${["", "I", "II", "III"][def.rank]}`,
			en: def.id,
			maker: def.source,
			ext: true,
			sub: `${makerName(def.source)} · ${gear.length} 件装备`,
			sourceText: "专业牌照资料",
			searchExtra: gear.map(it => `${plain("item", it)} ${it.name}`).join(" "),
			plainBody,
			dossierSections: parts,
			ownCheck: p => professionalLicenseRank(p, def.id) > 0,
		});
	}

	loreCatalogCache = { entries, byId: new Map(entries.map(e => [e.id, e])), itemToEntryId };
	return loreCatalogCache;
}

function visibleLoreEntries(state = loreState, p = P()) {
	const { entries } = buildLoreCatalog();
	const q = state.q.trim().toLocaleLowerCase();
	const words = q ? q.split(/\s+/) : [];
	return entries.filter(e => {
		if (state.mergeShared && e.isSharedMember) return false;
		if (!state.mergeShared && e.isSharedGroup) return false;
		if (state.cat && e.cat !== state.cat) return false;
		if (state.maker && e.maker !== state.maker) return false;
		if (state.src === "core" && e.ext) return false;
		if (state.src === "ext" && !e.ext) return false;
		if (state.ownedOnly && p && typeof e.ownCheck === "function" && !e.ownCheck(p)) return false;
		if (!words.length) return true;
		return words.every(w => e.haystack.includes(w));
	});
}

function highlightLoreHtml(html, q) {
	const words = String(q || "").trim().split(/\s+/).filter(w => w.length >= 1);
	if (!words.length) return html;
	const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const re = new RegExp(`(${words.map(escRe).join("|")})`, "gi");
	return String(html || "").replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => tag || text.replace(re, "<mark>$1</mark>"));
}

function renderLoreArticle(e, list, idx) {
	if (!e) return `<div class="lc-article"><p class="empty-state">没有符合条件的风味档案。可尝试清空关键词、取消「只看当前角色已拥有」或切换分类。</p></div>`;
	const { entries } = buildLoreCatalog();
	const makerColor = e.maker ? (MAKER_COLOR[e.maker] || "#e0483e") : "#f0a43a";
	const prev = idx > 0 ? list[idx - 1] : null;
	const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
	const q = loreState.q;

	let body = "";
	if (e.dossierSections) {
		body = e.dossierSections.map(sec => `<section class="lc-dossier-sec">
			<h3>${esc(sec.heading)}</h3>
			${sec.items.map(it => `<article class="lc-sub-entry">
				<div class="lc-sub-head"><strong>${esc(it.title)}</strong>${it.sub ? `<span class="muted">${esc(it.sub)}</span>` : ""}</div>
				<div class="lc-prose">${highlightLoreHtml(it.html, q)}</div>
				${it.meta ? `<div class="muted" style="margin-top:6px;font-size:11.5px">${esc(it.meta)}</div>` : ""}
			</article>`).join("")}
		</section>`).join("");
	} else {
		body = `<div class="lc-prose">${highlightLoreHtml(e.bodyHtml, q)}</div>`;
	}

	let membersHtml = "";
	if (e.isSharedGroup && e.members?.length) {
		membersHtml = `<section class="lc-members">
			<h4>本系列共用风味文本涵盖以下 ${e.members.length} 件武器</h4>
			<div class="lc-member-grid">${e.members.map(w => `<div class="lc-member-card">
				<b>${esc(plain("item", w))}</b>
				<span>${esc(`${T.mount[w.mount] || w.mount}${T.wtype[w.type] || w.type} · ${summaryRangeText(w) || "—"} · ${summaryDmgText(w) || "—"}`)}</span>
			</div>`).join("")}</div>
		</section>`;
	}

	let rulesPeekHtml = "";
	if (typeof e.rulesPeek === "function") {
		const content = e.rulesPeek();
		if (content) rulesPeekHtml = `<details class="lc-rules-peek"><summary>查看对应规则与数值（只读）</summary><div class="desc" style="margin-top:8px">${content}</div></details>`;
	}

	// 同牌照关联推荐
	const related = [];
	if (e.dossierId && e.dossierId !== e.id) {
		const dos = buildLoreCatalog().byId.get(e.dossierId);
		if (dos) related.push(dos);
	}
	const licId = e.licenseId || e.frameId;
	if (licId) {
		for (const x of entries) {
			if (x.id === e.id || x.id === e.dossierId || x.isSharedMember) continue;
			if (x.licenseId === licId || x.frameId === licId) related.push(x);
		}
	}

	return `<div class="lc-article">
		<header class="lc-article-head">
			<div class="lc-badges">
				${e.maker ? `<span class="lc-maker-badge" style="--maker:${makerColor}">${esc(makerName(e.maker))}</span>` : ""}
				<span class="lc-meta-pill">${esc(e.kindLabel)}</span>
				${e.isSharedGroup ? `<span class="lc-meta-pill shared">已去重合并 ${e.members.length} 件共用文案</span>` : ""}
				${e.ext ? `<span class="tag ext">扩展</span>` : ""}
			</div>
			<h1>${esc(e.title)}</h1>
			${e.en && e.en !== e.title ? `<div class="lc-en-title">${esc(e.en)}</div>` : ""}
			${e.sub ? `<p class="muted" style="margin:6px 0 0">${esc(e.sub)}</p>` : ""}
			<div class="lc-article-nav">
				<div class="row" style="margin:0">
					<button type="button" data-lc="nav" data-id="${prev ? esc(prev.id) : ""}" ${prev ? "" : "disabled"}>← 上一篇</button>
					<button type="button" data-lc="nav" data-id="${next ? esc(next.id) : ""}" ${next ? "" : "disabled"}>下一篇 →</button>
					<button type="button" data-lc="random">🎲 随机读一篇</button>
				</div>
				<div class="row" style="margin:0">
					${e.dossierId && e.dossierId !== e.id ? `<button type="button" data-lc="openDossier" data-id="${esc(e.dossierId)}">📚 连读所属牌照合集</button>` : ""}
				</div>
			</div>
		</header>
		${body}
		${membersHtml}
		${e.sourceText ? `<div class="lc-source-bar"><span>${esc(e.sourceText)}</span><span>方向键 ← / → 切换档案</span></div>` : ""}
		${rulesPeekHtml}
		${related.length ? `<section class="lc-related"><h4>关联档案 · 同牌照风味继续阅读</h4><div class="lc-related-grid">${related.slice(0, 12).map(r => `<button type="button" data-lc="jump" data-id="${esc(r.id)}">${esc(r.title)} <small class="muted">(${esc(r.kindLabel)})</small></button>`).join("")}</div></section>` : ""}
	</div>`;
}

function ensureLoreCodexDialog() {
	if (typeof document === "undefined" || !document.createElement) return null;
	let dlg = document.getElementById("loreCodex");
	if (dlg) return dlg;
	dlg = document.createElement("dialog");
	dlg.id = "loreCodex";
	dlg.className = "lore-dialog";
	dlg.setAttribute("aria-labelledby", "lcTitle");
	dlg.innerHTML = `<div class="lc-shell">
		<header class="lc-head">
			<div class="lc-head-title"><span class="lc-eyebrow">LORE CODEX</span><h2 id="lcTitle">世界观与风味典藏</h2><span class="muted">统一阅读骨架、牌照合集、装备、天赋与背景设定</span></div>
			<div class="lc-head-actions">
				<div class="lc-font-ctl" role="group" aria-label="正文字号">
					<button type="button" data-lc="font" data-v="sm">小</button>
					<button type="button" data-lc="font" data-v="md">标准</button>
					<button type="button" data-lc="font" data-v="lg">大</button>
				</div>
				<button type="button" data-lc="random">🎲 随机读一篇</button>
				<button type="button" data-lc="close" aria-label="关闭风味典藏">关闭 <kbd>Esc</kbd></button>
			</div>
		</header>
		<nav class="lc-tabs" id="lcTabs" aria-label="风味档案分类"></nav>
		<div class="lc-toolbar">
			<input type="search" id="lcSearch" placeholder="搜索名称、厂商、牌照或风味正文任意句子…" aria-label="搜索风味文本">
			<select id="lcMaker" aria-label="按厂商筛选"></select>
			<select id="lcSrc" aria-label="按资料来源筛选">
				<option value="">全部资料</option>
				<option value="core">核心规则书</option>
				<option value="ext">扩展资料</option>
			</select>
			<label class="chk" title="将 21 件共用系列介绍的 GMS 武器合并为 T-1 / T-2 / T-3 三篇总览"><input type="checkbox" id="lcMerge">合并共用文案（GMS 等）</label>
			<label class="chk" title="只看当前角色已解锁或已装备条目的风味设定"><input type="checkbox" id="lcOwned">只看当前角色已拥有</label>
			<button type="button" data-lc="reset">重置</button>
		</div>
		<div class="lc-mobile-pick"><select id="lcMobileSelect" aria-label="选择风味档案"></select></div>
		<div class="lc-main">
			<aside class="lc-sidebar">
				<div class="lc-count" id="lcCount" role="status"></div>
				<div class="lc-list" id="lcList" role="listbox" aria-label="风味档案目录"></div>
			</aside>
			<article class="lc-reader" id="lcReader" data-font="md" tabindex="0" aria-label="风味正文阅读区"></article>
		</div>
	</div>`;
	document.body.append(dlg);

	dlg.addEventListener("keydown", e => {
		if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeLoreCodex(); return; }
		if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const list = visibleLoreEntries();
			const idx = list.findIndex(x => x.id === loreState.selectedId);
			const next = e.key === "ArrowLeft" ? list[idx - 1] : list[idx + 1];
			if (next) { e.preventDefault(); loreState.selectedId = next.id; renderLoreCodex(false); }
		}
	});
	let timer;
	dlg.querySelector("#lcSearch").addEventListener("input", e => {
		loreState.q = e.target.value;
		clearTimeout(timer);
		timer = setTimeout(() => renderLoreCodex(true), 90);
	});
	dlg.querySelector("#lcMaker").addEventListener("change", e => { loreState.maker = e.target.value; renderLoreCodex(true); });
	dlg.querySelector("#lcSrc").addEventListener("change", e => { loreState.src = e.target.value; renderLoreCodex(true); });
	dlg.querySelector("#lcMerge").addEventListener("change", e => { loreState.mergeShared = e.target.checked; renderLoreCodex(true); });
	dlg.querySelector("#lcOwned").addEventListener("change", e => { loreState.ownedOnly = e.target.checked; renderLoreCodex(true); });
	dlg.querySelector("#lcMobileSelect").addEventListener("change", e => { loreState.selectedId = e.target.value; renderLoreCodex(false); });
	dlg.addEventListener("click", e => {
		const btn = e.target.closest("[data-lc]");
		if (!btn) return;
		const act = btn.dataset.lc;
		if (act === "close") return closeLoreCodex();
		if (act === "cat") { loreState.cat = btn.dataset.v || ""; renderLoreCodex(true); return; }
		if (act === "font") { loreState.font = btn.dataset.v || "md"; renderLoreCodex(false); return; }
		if (act === "select" || act === "nav") { if (btn.dataset.id) { loreState.selectedId = btn.dataset.id; renderLoreCodex(false); } return; }
		if (act === "openDossier" || act === "jump") {
			const target = buildLoreCatalog().byId.get(btn.dataset.id);
			if (target) {
				loreState.cat = target.cat === "dossier" ? "dossier" : "";
				loreState.q = ""; loreState.maker = ""; loreState.src = ""; loreState.ownedOnly = false;
				loreState.selectedId = target.id;
				renderLoreCodex(true);
			}
			return;
		}
		if (act === "random") {
			const list = visibleLoreEntries();
			if (list.length) {
				const pool = list.length > 1 ? list.filter(x => x.id !== loreState.selectedId) : list;
				loreState.selectedId = pool[Math.floor(Math.random() * pool.length)].id;
				renderLoreCodex(false);
			}
			return;
		}
		if (act === "reset") {
			Object.assign(loreState, { cat: "", q: "", maker: "", src: "", ownedOnly: false, mergeShared: true });
			renderLoreCodex(true);
			dlg.querySelector("#lcSearch")?.focus();
		}
	});
	return dlg;
}

function renderLoreCodex(resetListScroll = false) {
	const dlg = document.getElementById("loreCodex");
	if (!dlg) return;
	const p = P();
	const allUnfilteredByCat = visibleLoreEntries({ ...loreState, cat: "" }, p);
	const catCounts = {};
	for (const e of allUnfilteredByCat) catCounts[e.cat] = (catCounts[e.cat] || 0) + 1;

	dlg.querySelector("#lcTabs").innerHTML = LORE_CATS.map(c => {
		const n = c.id ? (catCounts[c.id] || 0) : allUnfilteredByCat.length;
		return `<button type="button" class="lc-tab ${loreState.cat === c.id ? "on" : ""}" data-lc="cat" data-v="${esc(c.id)}">${esc(c.label)}<small>${n}</small></button>`;
	}).join("");
	dlg.querySelectorAll('[data-lc="font"]').forEach(b => b.classList.toggle("on", b.dataset.v === loreState.font));
	dlg.querySelector("#lcSearch").value = loreState.q;
	const mkSel = dlg.querySelector("#lcMaker");
	if (!mkSel.options.length) {
		mkSel.innerHTML = `<option value="">全部厂商</option>${MAKERS.map(m => `<option value="${esc(m)}">${esc(makerName(m))}</option>`).join("")}`;
	}
	mkSel.value = loreState.maker;
	dlg.querySelector("#lcSrc").value = loreState.src;
	dlg.querySelector("#lcMerge").checked = loreState.mergeShared;
	dlg.querySelector("#lcOwned").checked = loreState.ownedOnly;

	const list = visibleLoreEntries(loreState, p);
	let idx = list.findIndex(x => x.id === loreState.selectedId);
	if (idx < 0 && list.length) { idx = 0; loreState.selectedId = list[0].id; }
	const cur = list[idx] || null;

	const dupSaved = loreState.mergeShared ? 18 : 0; // 21 GMS 武器合并为 3 篇，省去 18 条重复刷屏
	dlg.querySelector("#lcCount").innerHTML = `<span>共 <b>${list.length}</b> 篇档案</span>${dupSaved && (!loreState.cat || loreState.cat === "weapon") ? `<span class="muted">已去重 GMS 重复项</span>` : ""}`;

	const listEl = dlg.querySelector("#lcList");
	listEl.innerHTML = list.length ? list.map(e => {
		const color = e.maker ? (MAKER_COLOR[e.maker] || "#556178") : "#64748b";
		const snip = (e.plainBody || "").replace(/\s+/g, " ").slice(0, 42);
		return `<button type="button" class="lc-item ${cur && e.id === cur.id ? "on" : ""}" style="--maker:${color}" data-lc="select" data-id="${esc(e.id)}" role="option" aria-selected="${!!(cur && e.id === cur.id)}">
			<span class="lc-item-top"><b>${esc(e.title)}</b><span class="lc-item-kind">${esc(e.kindLabel)}</span></span>
			<span class="lc-item-meta"><span>${esc(e.maker || "通用")}</span><span>${esc(e.ext ? "扩展" : "核心")}</span></span>
			${snip ? `<span class="lc-item-snippet">${esc(snip)}…</span>` : ""}
		</button>`;
	}).join("") : '<p class="empty-state" style="margin:8px">没有匹配的风味档案。</p>';
	if (resetListScroll) listEl.scrollTop = 0;
	else listEl.querySelector(".lc-item.on")?.scrollIntoView?.({ block: "nearest" });

	const mobSel = dlg.querySelector("#lcMobileSelect");
	mobSel.innerHTML = list.map(e => `<option value="${esc(e.id)}" ${cur && e.id === cur.id ? "selected" : ""}>[${esc(e.kindLabel)}] ${esc(e.title)}</option>`).join("") || '<option value="">无匹配档案</option>';

	const reader = dlg.querySelector("#lcReader");
	reader.dataset.font = loreState.font;
	reader.innerHTML = renderLoreArticle(cur, list, idx);
	reader.scrollTop = 0;
}

function openLoreCodex(opts = {}) {
	const cat = buildLoreCatalog();
	if (opts.reset) Object.assign(loreState, { cat: "", q: "", maker: "", src: "", ownedOnly: false, mergeShared: true });
	if (opts.cat !== undefined) loreState.cat = opts.cat;
	if (opts.q !== undefined) loreState.q = opts.q;
	if (opts.ownedOnly !== undefined) loreState.ownedOnly = !!opts.ownedOnly;
	if (opts.id) {
		let targetId = opts.id;
		if (!cat.byId.has(targetId) && cat.itemToEntryId.has(targetId)) targetId = cat.itemToEntryId.get(targetId);
		const entry = cat.byId.get(targetId);
		if (entry) {
			loreState.q = ""; loreState.maker = ""; loreState.src = ""; loreState.ownedOnly = false;
			if (entry.isSharedMember) loreState.mergeShared = false;
			else if (entry.isSharedGroup) loreState.mergeShared = true;
			loreState.cat = opts.cat !== undefined ? opts.cat : (entry.cat === "dossier" ? "dossier" : "");
			loreState.selectedId = entry.id;
		}
	}
	const dlg = ensureLoreCodexDialog();
	if (!dlg) return;
	if (typeof closeTopMenus === "function") closeTopMenus();
	renderLoreCodex(!opts.id);
	if (!dlg.open) dlg.showModal();
	if (opts.id) {
		const scrollToActive = () => dlg.querySelector("#lcList .lc-item.on")?.scrollIntoView?.({ block: "center" });
		if (typeof requestAnimationFrame === "function") requestAnimationFrame(scrollToActive);
		else scrollToActive();
	} else {
		dlg.querySelector("#lcSearch")?.focus();
	}
}

function closeLoreCodex() {
	if (typeof document === "undefined") return;
	const dlg = document.getElementById("loreCodex");
	if (dlg?.open) dlg.close();
}

window.LANCER_LORE_CODEX = { buildLoreCatalog, visibleLoreEntries, gmsSeriesMeta, openLoreCodex, closeLoreCodex };

if (typeof document !== "undefined" && document.addEventListener) {
	document.addEventListener("click", e => {
		const trigger = e.target.closest?.("[data-ui='openLoreCodex']");
		if (trigger) {
			openLoreCodex({
				id: trigger.dataset.loreId || "",
				cat: trigger.dataset.loreCat !== undefined ? trigger.dataset.loreCat : undefined,
				ownedOnly: trigger.dataset.loreOwned === "1" ? true : undefined,
			});
		}
	});
}
