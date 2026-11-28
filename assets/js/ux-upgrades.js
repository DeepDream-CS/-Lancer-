"use strict";
// UI/UX 全面增强模块：
// 1. 武器 / 改装 / 系统可视化选装器   2. 等级成长吸顶导航 + 牌照与核心奖励筛选
// 3. 顶栏分区与 Ctrl+K 全局速查      4. 机甲吸顶状态条与骨架详述折叠
// 5. 衍生数值构成明细提示            6. 规则校验精准定位清单
// 7. 上桌实战速查卡与本地战局计数器   8. 角色列表搜索排序与机甲克隆

const PLAY_STORE = "lancer-play-state-v1";
const uxState = {
	pilotQuery: "",
	pilotSort: "order",
	lic: { q: "", maker: "", selected: false },
	cb: { q: "", maker: "", mode: "" },
	sheetMode: "export", // 'export' | 'play'
	playBucket: "all",
	playQuery: "",
	compactFrameRules: false,
	picker: null, // { mode: 'weapon'|'mod'|'system', mountKey, slotIdx, modSlot, q, size, type, src, activation, sp, avail, fitSp }
	ql: { q: "", cat: "" },
};

// ---------- 数值格子与构成明细 Tooltip ----------
function statTileHtml(key, displayVal, labelText, bd, highlight) {
	const modified = bd && (bd.delta !== 0 || (bd.rows && bd.rows.length > 1 && String(bd.value) !== String(bd.base)));
	const deltaBadge = bd && typeof bd.delta === "number" && bd.delta !== 0
		? `<sup class="stat-delta">${bd.delta > 0 ? "+" : ""}${bd.delta}</sup>`
		: "";
	const titleText = bd ? `${bd.label} ${bd.value}：${bd.rows.map(([k, v]) => `${k} ${v}`).join("，")}${bd.note ? "（" + bd.note + "）" : ""}` : "";
	return `<div class="stat ${highlight ? "hl" : ""} ${modified ? "is-mod" : ""}" data-stat-key="${esc(key)}" data-breakdown="${esc(JSON.stringify(bd || null))}" tabindex="0" title="${esc(titleText)}"><b>${displayVal}${deltaBadge}</b><span>${labelText}</span></div>`;
}

function showStatTip(el) {
	if (typeof document === "undefined" || !el?.dataset?.breakdown) return;
	let bd;
	try { bd = JSON.parse(el.dataset.breakdown); } catch (_) { return; }
	if (!bd) return;
	let tip = document.getElementById("statTip");
	if (!tip) {
		tip = document.createElement("div");
		tip.id = "statTip";
		tip.className = "stat-tip";
		tip.setAttribute("role", "tooltip");
		document.body.append(tip);
	}
	tip.innerHTML = `<div class="stat-tip-h"><b>${esc(bd.label)}</b><strong>${esc(bd.value)}</strong></div>
		<ul class="stat-tip-list">${(bd.rows || []).map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join("")}</ul>
		${bd.note ? `<div class="stat-tip-note">${esc(bd.note)}</div>` : ""}`;
	tip.hidden = false;
	const r = el.getBoundingClientRect();
	const w = Math.min(310, window.innerWidth - 16);
	tip.style.width = w + "px";
	tip.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + "px";
	const h = tip.offsetHeight || 120;
	tip.style.top = (r.bottom + 8 + h > window.innerHeight - 8 ? Math.max(8, r.top - h - 8) : r.bottom + 8) + "px";
}
function hideStatTip() {
	if (typeof document === "undefined") return;
	const tip = document.getElementById("statTip");
	if (tip) tip.hidden = true;
}

// ---------- 规则校验目标精准定位 ----------
function resolveCheckTarget(text, p) {
	const s = String(text || "");
	const mechMatch = s.match(/机甲「([^」]+)」/);
	let mechIdx = -1;
	if (mechMatch && p?.mechs?.length) {
		mechIdx = p.mechs.findIndex((mx, i) => (mx.name || String(i + 1)) === mechMatch[1]);
	}
	if (s.includes("触发")) return { tab: "pilot", anchor: "#card-triggers", label: "驾驶员 · 触发" };
	if (s.includes("背景")) return { tab: "pilot", anchor: "#card-bg", label: "驾驶员 · 背景" };
	if (s.includes("驾驶员装备")) return { tab: "pilot", anchor: "#card-pilot-gear", label: "驾驶员 · 装备" };
	if (s.includes("机甲技能")) return { tab: "progress", anchor: "#card-hase", label: "成长 · HASE" };
	if (s.includes("天赋") && !mechMatch) return { tab: "progress", anchor: "#card-talents", label: "成长 · 天赋" };
	if (s.includes("专业牌照")) return { tab: "progress", anchor: "#card-professionals", label: "成长 · 专业牌照" };
	if (s.includes("牌照等级合计")) return { tab: "progress", anchor: "#card-licenses", label: "成长 · 牌照" };
	if (s.includes("核心奖励") && !mechMatch && !s.includes("骨架")) return { tab: "progress", anchor: "#card-cbs", label: "成长 · 核心奖励" };
	if (s.includes("互斥")) return { tab: "mech", mechIdx, anchor: "#card-mech-frame", label: "机甲 · 骨架" };
	if (mechMatch || s.includes("机甲")) {
		const m = mechIdx >= 0 ? p.mechs[mechIdx] : M();
		const mtMatch = s.match(/挂载点\s+(m\d+|ia|sh|iw)/);
		if (mtMatch) return { tab: "mech", mechIdx, anchor: "#mount-" + mtMatch[1], label: `机甲 · 挂载点 ${mtMatch[1]}` };
		if (s.includes("骨架") || s.includes("康格多")) return { tab: "mech", mechIdx, anchor: "#card-mech-frame", label: "机甲 · 骨架" };
		if (s.includes("SP 超出") || s.includes("AI 数量") || s.includes("招牌动作") || s.includes("战术带") || s.includes("武器舱") || s.includes("哨兵无人机")) {
			return { tab: "mech", mechIdx, anchor: "#card-mech-systems", label: "机甲 · 系统" };
		}
		if (s.includes("超重型") || s.includes("超功率口径") || s.includes("自稳定") || s.includes("挂载点改装") || s.includes("模组") || s.includes("武器") || s.includes("工程师原型")) {
			return { tab: "mech", mechIdx, anchor: "#card-mech-weapons", label: "机甲 · 武器" };
		}
		if (s.includes("未解锁") || s.includes("独特装备")) {
			const inSys = m && m.systems.some(id => SYSTEMS[id] && s.includes(plain("item", SYSTEMS[id])));
			return { tab: "mech", mechIdx, anchor: inSys ? "#card-mech-systems" : "#card-mech-weapons", label: inSys ? "机甲 · 系统" : "机甲 · 武器" };
		}
		return { tab: "mech", mechIdx, anchor: "#card-mech-weapons", label: "机甲配置" };
	}
	return { tab: "sheet", anchor: "", label: "查看检查" };
}

function flashAndScrollTo(selector) {
	if (!selector || typeof document === "undefined" || !document.querySelector) return;
	const el = document.querySelector(selector);
	if (!el) return;
	el.scrollIntoView?.({ behavior: "smooth", block: "center" });
	el.classList.remove("ux-flash");
	void el.offsetWidth;
	el.classList.add("ux-flash");
	setTimeout(() => el.classList.remove("ux-flash"), 1900);
}

function jumpToCheckTarget(target) {
	if (!target) return;
	const p = P();
	if (p.wizard != null) p.wizard = null;
	if (typeof target.mechIdx === "number" && target.mechIdx >= 0 && target.mechIdx < p.mechs.length) {
		p.activeMech = target.mechIdx;
	}
	if (target.tab) tab = target.tab;
	closeCheckPopover();
	render();
	if (target.anchor) setTimeout(() => flashAndScrollTo(target.anchor), 30);
	else window.scrollTo?.(0, 0);
}

function renderCheckPopoverContent(p) {
	const cs = checks(p);
	if (!cs.length) {
		return `<div class="cp-head"><strong>规则检查</strong><button type="button" data-ui="closeCheckPopover">✕</button></div>
			<div class="cp-ok"><span>✓ 已通过 LL${p.ll} 车卡基础检查</span><button type="button" data-ui="goSheetPlay">实战速查 →</button></div>`;
	}
	return `<div class="cp-head"><strong>⚠ ${cs.length} 项待处理（点击直达位置）</strong><button type="button" data-ui="closeCheckPopover">✕</button></div>
		<div class="cp-body">${cs.map(([lv, t], idx) => {
			const tg = resolveCheckTarget(t, p);
			return `<button type="button" class="cp-item ${lv}" data-ux-jump="${idx}"><span class="cp-msg">${esc(t)}</span><span class="cp-jump">${esc(tg.label)} →</span></button>`;
		}).join("")}</div>
		<div class="cp-foot"><span class="muted">定位后会自动滚动并高亮边框</span><button type="button" data-tab="sheet">打开 ④ 角色卡</button></div>`;
}
function toggleCheckPopover() {
	if (typeof document === "undefined") return;
	const pop = document.getElementById("checkPopover");
	const badge = document.getElementById("checkBadge");
	if (!pop) return;
	const nextOpen = pop.hidden;
	closeTopMenus();
	if (nextOpen) {
		pop.innerHTML = renderCheckPopoverContent(P());
		pop.hidden = false;
		badge?.setAttribute("aria-expanded", "true");
	} else {
		pop.hidden = true;
		badge?.setAttribute("aria-expanded", "false");
	}
}
function closeCheckPopover() {
	if (typeof document === "undefined") return;
	const pop = document.getElementById("checkPopover");
	const badge = document.getElementById("checkBadge");
	if (pop) pop.hidden = true;
	badge?.setAttribute("aria-expanded", "false");
}
function closeTopMenus(exceptId = "") {
	if (typeof document === "undefined" || !document.getElementById) return;
	for (const id of ["pilotSwitcher", "characterMenu", "refMenu", "gmMenu"]) {
		if (id === exceptId) continue;
		const el = document.getElementById(id);
		if (el && el.open) el.open = false;
	}
}

// ---------- 角色列表检索与切换面板 ----------
function syncPilotSwitcher(p) {
	if (typeof document === "undefined" || !document.getElementById) return;
	const nameEl = document.getElementById("psCurName");
	const metaEl = document.getElementById("psCurMeta");
	const listEl = document.getElementById("pilotSwitcherList");
	const curMech = p.mechs[p.activeMech] || p.mechs[0];
	const curFrame = curMech && FRAMES[curMech.frame] ? frameName(FRAMES[curMech.frame]) : "未选骨架";
	if (nameEl) nameEl.textContent = `${p.name || "未命名"}${p.callsign ? `「${p.callsign}」` : ""}`;
	if (metaEl) metaEl.textContent = `LL${p.ll} · ${curFrame}`;
	if (!listEl) return;
	const q = uxState.pilotQuery.trim().toLocaleLowerCase();
	let items = db.pilots.map((x, idx) => {
		const m0 = x.mechs[x.activeMech] || x.mechs[0];
		const fn = m0 && FRAMES[m0.frame] ? frameName(FRAMES[m0.frame]) : "未选骨架";
		const allFrames = x.mechs.map(mx => FRAMES[mx.frame] ? frameName(FRAMES[mx.frame]) : "").join(" ");
		return { x, idx, fn, hay: `${x.name} ${x.callsign} ${x.player} ll${x.ll} ${fn} ${allFrames}`.toLocaleLowerCase() };
	});
	if (q) items = items.filter(it => it.hay.includes(q));
	if (uxState.pilotSort === "ll") items.sort((a, b) => b.x.ll - a.x.ll || a.idx - b.idx);
	else if (uxState.pilotSort === "name") items.sort((a, b) => (a.x.name || "").localeCompare(b.x.name || "", "zh"));
	listEl.innerHTML = items.length ? items.map(({ x, fn }) => `
		<button type="button" class="ps-item ${x.id === p.id ? "on" : ""}" data-ux-pilot="${esc(x.id)}" role="option" aria-selected="${x.id === p.id}">
			<span class="ps-item-top"><b>${esc(x.name || "未命名")}${x.callsign ? `「${esc(x.callsign)}」` : ""}</b><span class="ps-ll">LL${x.ll}</span></span>
			<span class="ps-item-meta"><span>${esc(fn)}</span><span>${x.mechs.length} 台机甲${x.player ? " · " + esc(x.player) : ""}</span></span>
		</button>`).join("") : '<p class="muted" style="text-align:center;padding:12px 6px">没有匹配的角色。</p>';
}

// ---------- ② 等级成长：吸顶点数导航 + 牌照与核心奖励筛选 ----------
function renderProgressSubnav(p) {
	const L = LV(p.ll);
	const hs = Object.values(p.hase).reduce((a, b) => a + b, 0);
	const tr = Object.values(p.talents).reduce((a, b) => a + b, 0);
	const lr = Object.values(p.licenses).reduce((a, b) => a + b, 0);
	const licSpent = lr + (p.professionalLicenses || []).reduce((n, x) => n + x.rank - x.rewardRanks, 0);
	const licBudget = L.licenses + (p.extraLicenseRanks || 0);
	const proCount = (p.professionalLicenses || []).length;
	return `<nav class="ux-subnav" aria-label="等级成长快速跳转">
		<button type="button" class="ux-subnav-btn" data-ux-scroll="#card-hase">HASE ${counter(hs, L.skills)}</button>
		<button type="button" class="ux-subnav-btn" data-ux-scroll="#card-licenses">牌照 ${counter(licSpent, licBudget)}</button>
		<button type="button" class="ux-subnav-btn" data-ux-scroll="#card-professionals">专业牌照 <span class="cnt">${proCount}</span></button>
		<button type="button" class="ux-subnav-btn" data-ux-scroll="#card-cbs">核心奖励 ${counter(p.coreBonuses.length, L.cbs)}</button>
		<button type="button" class="ux-subnav-btn" data-ux-scroll="#card-talents">天赋 ${counter(tr, talentBudget(p))}</button>
		<span class="ux-subnav-sep"><button type="button" class="ux-subnav-btn" data-ux-scroll="#card-reset">重配构筑</button></span>
	</nav>`;
}

const licSearchCache = new Map();
function licenseSearchText(f) {
	if (licSearchCache.has(f.id)) return licSearchCache.get(f.id);
	const items = [...D.weapons, ...D.systems, ...D.mods].filter(it => it.source && licenseOf(it) === f);
	const variants = D.frames.filter(v => v.variant_of === f.id);
	const text = [
		frameName(f), f.name, f.source, makerName(f.source),
		...variants.flatMap(v => [frameName(v), v.name]),
		...items.flatMap(it => [plain("item", it), it.name, tagsPlain(it.tags), itemHoverText(it)]),
	].join(" ").toLocaleLowerCase();
	licSearchCache.set(f.id, text);
	return text;
}
function licenseMatches(f, p) {
	const s = uxState.lic;
	if (s.maker && f.source !== s.maker) return false;
	if (s.selected && !(p.licenses[f.id] || 0)) return false;
	const q = s.q.trim().toLocaleLowerCase();
	if (!q) return true;
	return q.split(/\s+/).every(w => licenseSearchText(f).includes(w));
}
function licenseToolbar() {
	const s = uxState.lic;
	const active = !!(s.q.trim() || s.maker || s.selected);
	return `<div class="catalog-toolbar">
		<label class="search-field"><span>查找牌照或牌照内装备</span><input type="search" data-ui="licSearch" value="${esc(s.q)}" placeholder="搜骨架名、变体或内部装备名（如：冰遁、无人机）"></label>
		<label class="filter-field"><span>厂商</span><select data-ui="licMaker"><option value="">全部厂商</option>${MAKERS.slice(1).map(mk => `<option value="${esc(mk)}" ${s.maker === mk ? "selected" : ""}>${esc(makerName(mk))}</option>`).join("")}</select></label>
		<label class="chk"><input type="checkbox" data-ui="licSelected" ${s.selected ? "checked" : ""}>只看已投入</label>
		<button type="button" data-ui="toggleLicDetails">展开/收起内容</button>
		<button type="button" data-ui="resetLic" ${active ? "" : "disabled"}>重置</button>
		<span class="muted" data-lic-count role="status" style="width:100%"></span>
	</div><p class="empty-state" data-lic-empty hidden>没有匹配的牌照，试试搜装备关键词或重置筛选。</p>`;
}
function filterLicenses() {
	if (typeof document === "undefined" || !document.querySelectorAll) return;
	const rows = [...document.querySelectorAll("[data-lic-id]")];
	if (!rows.length) return;
	const p = P(), q = uxState.lic.q.trim().toLocaleLowerCase(), words = q ? q.split(/\s+/) : [];
	let shown = 0;
	rows.forEach(row => {
		const f = FRAMES[row.dataset.licId];
		const ok = f ? licenseMatches(f, p) : true;
		row.hidden = !ok;
		if (ok) shown++;
		// 搜索命中牌照内部装备时，自动展开该牌照内容并高亮命中条目
		const detEl = row.querySelector("details");
		row.querySelectorAll(".lic-rank li").forEach(li => li.classList.remove("lic-hit"));
		if (ok && words.length && detEl) {
			const headText = (row.querySelector(".lic-head")?.textContent || "").toLocaleLowerCase();
			const headMatch = words.every(w => headText.includes(w));
			let gearHit = false;
			row.querySelectorAll(".lic-rank li").forEach(li => {
				const txt = `${li.textContent || ""} ${li.title || ""}`.toLocaleLowerCase();
				if (words.every(w => txt.includes(w))) { li.classList.add("lic-hit"); gearHit = true; }
			});
			if (gearHit && !headMatch) detEl.open = true;
		}
	});
	document.querySelectorAll("[data-lic-mfr]").forEach(head => {
		const mk = head.dataset.licMfr;
		const grid = document.querySelector(`[data-lic-grid="${mk}"]`);
		const any = grid && [...grid.querySelectorAll("[data-lic-id]")].some(el => !el.hidden);
		head.hidden = !any;
		if (grid) grid.hidden = !any;
	});
	document.querySelectorAll("[data-lic-count]").forEach(el => el.textContent = `显示 ${shown} / ${rows.length} 张牌照`);
	document.querySelectorAll("[data-lic-empty]").forEach(el => el.hidden = shown > 0);
	const active = !!(uxState.lic.q.trim() || uxState.lic.maker || uxState.lic.selected);
	document.querySelectorAll('[data-ui="resetLic"]').forEach(el => el.disabled = !active);
}

function cbMatches(c, p) {
	const s = uxState.cb;
	if (s.maker && c.source !== s.maker) return false;
	const have = hasCB(p, c.id);
	const ok = have || cbEligible(p, c, 1);
	if (s.mode === "selected" && !have) return false;
	if (s.mode === "eligible" && !ok) return false;
	const q = s.q.trim().toLocaleLowerCase();
	if (!q) return true;
	const z = Z.cb[nk(c.name)];
	const hay = `${plain("cb", c)} ${c.name} ${c.source} ${makerName(c.source)} ${stripHtml(z ? z.html : c.effect)}`.toLocaleLowerCase();
	return q.split(/\s+/).every(w => hay.includes(w));
}
function cbToolbar() {
	const s = uxState.cb;
	const active = !!(s.q.trim() || s.maker || s.mode);
	return `<div class="catalog-toolbar">
		<label class="search-field"><span>查找核心奖励</span><input type="search" data-ui="cbSearch" value="${esc(s.q)}" placeholder="名称或效果关键词"></label>
		<label class="filter-field"><span>厂商</span><select data-ui="cbMaker"><option value="">全部厂商</option>${MAKERS.map(mk => `<option value="${esc(mk)}" ${s.maker === mk ? "selected" : ""}>${esc(makerName(mk))}</option>`).join("")}</select></label>
		<label class="filter-field"><span>资格</span><select data-ui="cbMode">
			<option value="" ${!s.mode ? "selected" : ""}>全部核心奖励</option>
			<option value="eligible" ${s.mode === "eligible" ? "selected" : ""}>只看当前可点</option>
			<option value="selected" ${s.mode === "selected" ? "selected" : ""}>只看已选</option>
		</select></label>
		<button type="button" data-ui="resetCb" ${active ? "" : "disabled"}>重置</button>
		<span class="muted" data-cb-count role="status" style="width:100%"></span>
	</div><p class="empty-state" data-cb-empty hidden>没有符合条件的核心奖励，试试清空筛选。</p>`;
}
function filterCoreBonuses() {
	if (typeof document === "undefined" || !document.querySelectorAll) return;
	const rows = [...document.querySelectorAll("[data-cb-id]")];
	if (!rows.length) return;
	const p = P();
	let shown = 0;
	rows.forEach(row => {
		const c = CBS[row.dataset.cbId];
		const ok = c ? cbMatches(c, p) : true;
		row.hidden = !ok;
		if (ok) shown++;
	});
	document.querySelectorAll("[data-cb-mfr]").forEach(head => {
		const mk = head.dataset.cbMfr;
		const any = rows.some(r => !r.hidden && r.dataset.cbMaker === mk);
		head.hidden = !any;
	});
	document.querySelectorAll("[data-cb-count]").forEach(el => el.textContent = `显示 ${shown} / ${rows.length} 项`);
	document.querySelectorAll("[data-cb-empty]").forEach(el => el.hidden = shown > 0);
	const active = !!(uxState.cb.q.trim() || uxState.cb.maker || uxState.cb.mode);
	document.querySelectorAll('[data-ui="resetCb"]').forEach(el => el.disabled = !active);
}

// ---------- ③ 机甲：吸顶状态条 ----------
function renderMechStickyBar(p, m, st) {
	if (!st || !FRAMES[m.frame]) return "";
	const f = FRAMES[m.frame];
	const ai = mechAiSummary(p, m);
	const spPct = Math.min(100, st.sp ? (st.spUsed / st.sp) * 100 : 0);
	const spOver = st.spUsed > st.sp;
	return `<div class="mech-sticky-bar" aria-label="机甲实时状态摘要">
		<span class="msb-name">${esc(m.name || "机甲")} <small>${esc(frameName(f))}</small></span>
		<div class="msb-stats">
			<span class="msb-chip">HP<b>${st.hp}</b></span>
			<span class="msb-chip">甲<b>${st.armor}</b></span>
			<span class="msb-chip">避<b>${st.evasion}</b></span>
			<span class="msb-chip">电<b>${st.edef}</b></span>
			<span class="msb-chip">热<b>${st.heatcap}</b></span>
			<span class="msb-chip">速<b>${st.speed}</b></span>
			<span class="msb-chip">感<b>${st.sensor}</b></span>
			<span class="msb-chip">豁<b>${st.save}</b></span>
		</div>
		<span class="msb-sp ${spOver ? "over" : ""}" title="已用 SP / 总 SP">SP <b>${st.spUsed}/${st.sp}</b><span class="msb-sp-track"><div style="width:${spPct}%"></div></span></span>
		<span class="msb-ai ${ai.used > ai.cap ? "over" : ""}" title="AI 数量 / 上限">AI <b>${ai.used}/${ai.cap}</b></span>
		<div class="msb-jumps">
			<button type="button" data-ux-scroll="#card-mech-frame">骨架</button>
			<button type="button" data-ux-scroll="#card-mech-weapons">武器</button>
			<button type="button" data-ux-scroll="#card-mech-systems">系统</button>
			<button type="button" data-ui="goSheetPlay" title="打开上桌实战速查卡">实战卡</button>
		</div>
	</div>`;
}

// ---------- 机甲可视化选装器（武器 / 模块 / 系统） ----------
function equipPickerCandidates(pk, p, m) {
	const q = (pk.q || "").trim().toLocaleLowerCase();
	const words = q ? q.split(/\s+/) : [];
	const st = mechStats(p, m);
	const spRem = st ? st.sp - st.spUsed : 99;

	if (pk.mode === "weapon") {
		const mounts = mountsOf(p, m);
		const mt = mounts.find(x => x.key === pk.mountKey);
		if (!mt) return [];
		const sst = slotState(m, mt.key);
		const acc = slotAccepts(mt, pk.slotIdx, sst.slots);
		const curId = sst.slots[pk.slotIdx]?.w || "";
		const curSp = curId && WEAPONS[curId] ? (WEAPONS[curId].sp || 0) : 0;
		return D.weapons.filter(w => {
			if (!w.source && !w.talent_item) return false; // 内建武器不能装入普通挂载点
			if (!acc.includes(w.mount)) return false;
			if (pk.size && w.mount !== pk.size) return false;
			if (pk.type && !mechWeaponTypes(w, m).includes(pk.type)) return false;
			const o = weaponOrigin(w);
			if (pk.src === "ext" ? !w.ext : pk.src === "core" ? w.ext : pk.src && o.key !== pk.src) return false;
			if (pk.avail && !(itemAvailable(p, w) || w.id === curId)) return false;
			if (pk.fitSp && (w.sp || 0) - curSp > spRem) return false;
			if (!words.length) return true;
			const hay = `${plain("item", w)} ${w.name} ${o.text} ${T.mount[w.mount] || ""} ${T.wtype[w.type] || ""} ${tagsPlain(w.tags)} ${stripHtml(weaponEffectHtml(w))}`.toLocaleLowerCase();
			return words.every(wd => hay.includes(wd));
		});
	}

	if (pk.mode === "mod" || pk.mode === "mod2") {
		const mt = mountsOf(p, m).find(x => x.key === pk.mountKey);
		const sl = mt ? (slotState(m, mt.key).slots[pk.slotIdx] || {}) : {};
		const baseW = WEAPONS[sl.w];
		const cw = baseW && configuredWeapon(baseW, m, sl);
		if (!mt || !cw) return [];
		const curId = pk.mode === "mod2" ? (sl.mod2 || "") : (sl.mod || "");
		const otherId = pk.mode === "mod2" ? (sl.mod || "") : (sl.mod2 || "");
		const effSp = md => cw.mod_sp_discount ? Math.max(1, (md.sp || 0) - cw.mod_sp_discount) : (md.sp || 0);
		const curSp = curId && MODS[curId] ? effSp(MODS[curId]) : 0;
		return D.mods.filter(md => {
			if (!canModify(cw, md, mt, m)) return false;
			if (otherId && md.id === otherId) return false;
			const o = systemLibraryOrigin(md);
			if (pk.src === "ext" ? !md.ext : pk.src === "core" ? md.ext : pk.src && o.key !== pk.src) return false;
			if (pk.avail && !(itemAvailable(p, md) || md.id === curId)) return false;
			if (pk.fitSp && effSp(md) - curSp > spRem) return false;
			if (!words.length) return true;
			const hay = `${plain("item", md)} ${md.name} ${o.text} ${tagsPlain(md.tags)} ${modRestrictionsText(md)} ${stripHtml(md.effect)}`.toLocaleLowerCase();
			return words.every(wd => hay.includes(wd));
		});
	}

	if (pk.mode === "system") {
		return D.systems.filter(s => {
			if (!s.source && !s.talent_item) return false; // 骨架内建系统不可手动装入
			const o = systemLibraryOrigin(s);
			if (pk.type && !systemLibraryTypes(s).includes(pk.type)) return false;
			if (pk.activation && !systemLibraryActivations(s).includes(pk.activation)) return false;
			if (pk.sp !== "" && (pk.sp === "4+" ? (s.sp || 0) < 4 : (s.sp || 0) !== Number(pk.sp))) return false;
			if (pk.src === "ext" ? !s.ext : pk.src === "core" ? s.ext : pk.src && o.key !== pk.src) return false;
			if (pk.avail && !itemAvailable(p, s)) return false;
			if (pk.fitSp && (s.sp || 0) > spRem) return false;
			if (!words.length) return true;
			const hay = `${systemSearchText(s)} ${o.text} ${systemLibraryActivations(s).map(a => ACT[a] || a).join(" ")} ${stripHtml(actsHtml(s))}`.toLocaleLowerCase();
			return words.every(wd => hay.includes(wd));
		});
	}
	return [];
}

function applyEquipPick(pk, itemId) {
	const p = P(), m = M();
	if (pk.mode === "weapon") {
		const st = slotState(m, pk.mountKey);
		st.slots[pk.slotIdx] = { w: itemId || "", mod: "", mod2: "", profile: 0 };
		const w = WEAPONS[itemId];
		if (+pk.slotIdx === 0 && w && w.mount !== "Auxiliary" && mountsOf(p, m).find(mt => mt.key === pk.mountKey)?.type === "Flex") {
			st.slots.length = 1;
		}
		if (!w || w.mount !== "Superheavy") st.link = "";
		render();
		closeEquipPicker();
		return true;
	}
	if (pk.mode === "mod" || pk.mode === "mod2") {
		const st = slotState(m, pk.mountKey);
		st.slots[pk.slotIdx] = st.slots[pk.slotIdx] || {};
		if (pk.mode === "mod2") st.slots[pk.slotIdx].mod2 = itemId || "";
		else st.slots[pk.slotIdx].mod = itemId || "";
		render();
		closeEquipPicker();
		return true;
	}
	if (pk.mode === "system") {
		if (!itemId || !SYSTEMS[itemId]) return false;
		if (isUnique(SYSTEMS[itemId]) && m.systems.includes(itemId)) return false;
		m.systems.push(itemId);
		render();
		renderEquipPicker();
		return true;
	}
	return false;
}

function removeSystemFromPicker(sysId) {
	const m = M();
	const idx = m.systems.lastIndexOf(sysId);
	if (idx < 0) return false;
	m.systems.splice(idx, 1);
	cleanMechSystemRefs(m);
	render();
	renderEquipPicker();
	return true;
}

function ensureEquipPickerDialog() {
	if (typeof document === "undefined" || !document.createElement) return null;
	let dlg = document.getElementById("equipPickerDialog");
	if (dlg) return dlg;
	dlg = document.createElement("dialog");
	dlg.id = "equipPickerDialog";
	dlg.className = "ux-dialog";
	dlg.setAttribute("aria-labelledby", "epTitle");
	dlg.innerHTML = `<div class="ux-dlg-wrap">
		<header class="ux-dlg-head">
			<div><h2 id="epTitle">装备选装器</h2><p id="epSubtitle"></p></div>
			<div class="ux-dlg-head-right"><div id="epStatus"></div><button type="button" data-ep="close">完成 / 关闭 ✕</button></div>
		</header>
		<div class="ux-dlg-toolbar" id="epToolbar"></div>
		<div class="ux-dlg-body" id="epBody"></div>
	</div>`;
	document.body.append(dlg);
	dlg.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeEquipPicker(); } });
	dlg.addEventListener("input", e => {
		if (e.target.dataset?.ep === "q" && uxState.picker) { uxState.picker.q = e.target.value; renderEquipPickerList(); }
	});
	dlg.addEventListener("change", e => {
		const k = e.target.dataset?.ep;
		if (!k || !uxState.picker || k === "q") return;
		uxState.picker[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		renderEquipPickerList();
	});
	dlg.addEventListener("click", e => {
		const btn = e.target.closest("[data-ep]");
		if (!btn) return;
		const act = btn.dataset.ep;
		if (act === "close") return closeEquipPicker();
		if (act === "reset" && uxState.picker) {
			Object.assign(uxState.picker, { q: "", size: "", type: "", src: "", activation: "", sp: "", avail: true, fitSp: false });
			renderEquipPicker();
			return;
		}
		if (act === "pick" && uxState.picker) applyEquipPick(uxState.picker, btn.dataset.id || "");
		if (act === "clearSlot" && uxState.picker) applyEquipPick(uxState.picker, "");
		if (act === "removeSys" && uxState.picker) removeSystemFromPicker(btn.dataset.id || "");
	});
	return dlg;
}

function openEquipPicker(opts) {
	uxState.picker = { q: "", size: "", type: "", src: "", activation: "", sp: "", avail: true, fitSp: false, ...opts };
	const dlg = ensureEquipPickerDialog();
	if (!dlg) return;
	renderEquipPicker();
	if (!dlg.open) dlg.showModal();
	dlg.querySelector('[data-ep="q"]')?.focus();
}
function closeEquipPicker() {
	if (typeof document === "undefined") return;
	const dlg = document.getElementById("equipPickerDialog");
	if (dlg?.open) dlg.close();
	uxState.picker = null;
}

function renderEquipPicker() {
	const dlg = document.getElementById("equipPickerDialog");
	const pk = uxState.picker;
	if (!dlg || !pk) return;
	const p = P(), m = M(), st = mechStats(p, m), ai = mechAiSummary(p, m);
	const titleEl = dlg.querySelector("#epTitle");
	const subEl = dlg.querySelector("#epSubtitle");
	const statusEl = dlg.querySelector("#epStatus");
	const tbEl = dlg.querySelector("#epToolbar");
	const spOver = st && st.spUsed > st.sp;
	statusEl.innerHTML = st ? `<span class="msb-sp ${spOver ? "over" : ""}">SP <b>${st.spUsed}/${st.sp}</b>（剩 ${st.sp - st.spUsed}）</span> <span class="msb-ai ${ai.used > ai.cap ? "over" : ""}">AI <b>${ai.used}/${ai.cap}</b></span>` : "";

	const sel = (key, lab, opts) => `<label class="filter-field"><span>${lab}</span><select data-ep="${key}">${opts.map(([v, t]) => `<option value="${esc(v)}" ${pk[key] === v ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;

	if (pk.mode === "weapon") {
		const mt = mountsOf(p, m).find(x => x.key === pk.mountKey);
		const sst = mt ? slotState(m, mt.key) : { slots: [] };
		const acc = mt ? slotAccepts(mt, pk.slotIdx, sst.slots) : [];
		const curId = sst.slots[pk.slotIdx]?.w || "";
		titleEl.textContent = `为「${T.mount[mt?.type] || mt?.type || ""}挂载点 · 槽位 ${pk.slotIdx + 1}」选装武器`;
		subEl.textContent = `允许尺寸：${acc.map(x => T.mount[x] || x).join(" / ")} · 可实时预览射程、伤害、标签与完整效果`;
		const types = [...new Set(D.weapons.filter(w => acc.includes(w.mount)).map(w => w.type))];
		tbEl.innerHTML = `<label class="search-field"><span>搜索武器</span><input type="search" data-ep="q" value="${esc(pk.q)}" placeholder="名称、牌照、标签或效果关键词"></label>` +
			(acc.length > 1 ? sel("size", "尺寸", [["", "全部允许尺寸"], ...acc.map(x => [x, T.mount[x] || x])]) : "") +
			sel("type", "武器类型", [["", "全部类型"], ...types.map(t => [t, T.wtype[t] || t])]) +
			sel("src", "来源", [["", "全部来源"], ["GMS", "GMS"], ...MAKERS.slice(1).map(mk => [mk, makerName(mk)]), ["talent", "天赋"], ["core", "核心规则书"], ["ext", "扩展"]]) +
			`<label class="chk"><input type="checkbox" data-ep="avail" ${pk.avail ? "checked" : ""}>只看已解锁</label>` +
			`<label class="chk"><input type="checkbox" data-ep="fitSp" ${pk.fitSp ? "checked" : ""}>剩余 SP 足够</label>` +
			(curId ? `<button type="button" data-ep="clearSlot" class="danger">清空槽位</button>` : "") +
			`<button type="button" data-ep="reset">重置</button>`;
	} else if (pk.mode === "mod" || pk.mode === "mod2") {
		const mt = mountsOf(p, m).find(x => x.key === pk.mountKey);
		const sl = mt ? (slotState(m, mt.key).slots[pk.slotIdx] || {}) : {};
		const w = WEAPONS[sl.w];
		const curId = pk.mode === "mod2" ? (sl.mod2 || "") : (sl.mod || "");
		titleEl.textContent = `为「${w ? plain("item", w) : "武器"}」选装${pk.mode === "mod2" ? "第二模组" : "武器模块"}`;
		subEl.textContent = `已自动过滤所有不适用于该武器类型/尺寸的模块${w?.mod_sp_discount ? "（双模组减免：各模组 -1 SP，最低 1 SP）" : ""}`;
		tbEl.innerHTML = `<label class="search-field"><span>搜索模块</span><input type="search" data-ep="q" value="${esc(pk.q)}" placeholder="模块名称、标签或效果"></label>` +
			sel("src", "来源", [["", "全部来源"], ...MAKERS.map(mk => [mk, makerName(mk)]), ["core", "核心规则书"], ["ext", "扩展"]]) +
			`<label class="chk"><input type="checkbox" data-ep="avail" ${pk.avail ? "checked" : ""}>只看已解锁</label>` +
			`<label class="chk"><input type="checkbox" data-ep="fitSp" ${pk.fitSp ? "checked" : ""}>剩余 SP 足够</label>` +
			(curId ? `<button type="button" data-ep="clearSlot" class="danger">卸下当前模块</button>` : "") +
			`<button type="button" data-ep="reset">重置</button>`;
	} else {
		titleEl.textContent = `安装机甲系统 · ${m.name || "当前机甲"}`;
		subEl.textContent = "可连续安装或移除多个系统，顶栏 SP 与 AI 数量实时更新";
		tbEl.innerHTML = `<label class="search-field"><span>搜索系统</span><input type="search" data-ep="q" value="${esc(pk.q)}" placeholder="名称、标签、牌照或效果关键词"></label>` +
			sel("type", "类别", [["", "全部类别"], ...Object.entries(SYSTEM_LIBRARY_TYPES).filter(([k]) => k !== "Mod")]) +
			sel("activation", "动作", [["", "全部动作"], ...["Quick", "Full", "Protocol", "Reaction", "Free", "Quick Tech", "Full Tech", "Invade"].map(a => [a, ACT[a]]), ["Passive", "被动/其他"]]) +
			sel("sp", "SP", [["", "全部 SP"], ["0", "0 SP"], ["1", "1 SP"], ["2", "2 SP"], ["3", "3 SP"], ["4+", "4+ SP"]]) +
			sel("src", "来源", [["", "全部来源"], ...MAKERS.map(mk => [mk, makerName(mk)]), ["talent", "天赋"], ["core", "核心规则书"], ["ext", "扩展"]]) +
			`<label class="chk"><input type="checkbox" data-ep="avail" ${pk.avail ? "checked" : ""}>只看已解锁</label>` +
			`<label class="chk"><input type="checkbox" data-ep="fitSp" ${pk.fitSp ? "checked" : ""}>剩余 SP 足够</label>` +
			`<button type="button" data-ep="reset">重置</button>`;
	}
	renderEquipPickerList();
}

function renderEquipPickerList() {
	const dlg = document.getElementById("equipPickerDialog");
	const pk = uxState.picker;
	if (!dlg || !pk) return;
	const p = P(), m = M(), st = mechStats(p, m), spRem = st ? st.sp - st.spUsed : 99;
	const list = equipPickerCandidates(pk, p, m);
	const bodyEl = dlg.querySelector("#epBody");
	const prevCtx = STAT_CTX;
	STAT_CTX = st ? { ...st, grit: LV(p.ll).grit, drone_hp: staticBonus(p, m, "drone_hp"), deployable_hp: staticBonus(p, m, "deployable_hp") } : {};

	try {
		if (!list.length) {
			bodyEl.innerHTML = `<p class="empty-state">没有符合条件的选项。可取消「只看已解锁」或减少筛选条件。</p>`;
			return;
		}
		if (pk.mode === "weapon") {
			const mt = mountsOf(p, m).find(x => x.key === pk.mountKey);
			const curId = mt ? (slotState(m, mt.key).slots[pk.slotIdx]?.w || "") : "";
			const curSp = curId && WEAPONS[curId] ? (WEAPONS[curId].sp || 0) : 0;
			bodyEl.innerHTML = `<p class="muted" style="margin:0">匹配 ${list.length} 件武器</p>` + list.map(w => {
				const o = weaponOrigin(w), unlocked = itemAvailable(p, w), isCur = w.id === curId;
				const spCost = w.sp || 0, over = spCost - curSp > spRem;
				const prof = effectiveProfile(w, w.profiles ? w.profiles[0] : w, null, p, m);
				return `<article class="ep-card ${isCur ? "is-current" : ""} ${unlocked ? "" : "is-locked"}">
					<div class="ep-card-head">
						<div class="ep-card-title"><b>${esc(plain("item", w))}</b>${w.name !== plain("item", w) ? `<small>${esc(w.name)}</small>` : ""}${extBadge(w)}<span class="ep-origin">${esc(o.text)}</span>${spCost ? `<span class="ep-sp ${over ? "over" : ""}">${spCost} SP</span>` : ""}</div>
						<div class="ep-actions">${isCur ? `<span class="cnt ok">当前已装</span><button type="button" data-ep="clearSlot" class="danger">卸下</button>` : `<button type="button" class="${unlocked ? "primary" : ""}" data-ep="pick" data-id="${esc(w.id)}" ${unlocked ? "" : "disabled"}>${unlocked ? (over ? "装入（SP将超支）" : "装入此槽位") : "未解锁"}</button>`}</div>
					</div>
					<div class="ep-meta"><span>${esc((T.mount[w.mount] || w.mount) + (T.wtype[w.type] || w.type))}</span><span>${esc(summaryRangeText(w, prof) || "—")}</span><span>${esc(summaryDmgText(w, prof) || "—")}</span>${tagsHtml(prof.tags || w.tags)}</div>
					<div class="ep-effect">${weaponEffectHtml(w)}</div>
				</article>`;
			}).join("");
		} else if (pk.mode === "mod" || pk.mode === "mod2") {
			const mt = mountsOf(p, m).find(x => x.key === pk.mountKey);
			const sl = mt ? (slotState(m, mt.key).slots[pk.slotIdx] || {}) : {};
			const cw = WEAPONS[sl.w] && configuredWeapon(WEAPONS[sl.w], m, sl);
			const curId = pk.mode === "mod2" ? (sl.mod2 || "") : (sl.mod || "");
			const effSp = md => cw?.mod_sp_discount ? Math.max(1, (md.sp || 0) - cw.mod_sp_discount) : (md.sp || 0);
			const curSp = curId && MODS[curId] ? effSp(MODS[curId]) : 0;
			bodyEl.innerHTML = `<p class="muted" style="margin:0">匹配 ${list.length} 件可用模块</p>` + list.map(md => {
				const o = systemLibraryOrigin(md), unlocked = itemAvailable(p, md), isCur = md.id === curId;
				const spCost = effSp(md), over = spCost - curSp > spRem;
				const restr = modRestrictionsText(md);
				return `<article class="ep-card ${isCur ? "is-current" : ""} ${unlocked ? "" : "is-locked"}">
					<div class="ep-card-head">
						<div class="ep-card-title"><b>${esc(plain("item", md))}</b>${md.name !== plain("item", md) ? `<small>${esc(md.name)}</small>` : ""}${extBadge(md)}<span class="ep-origin">${esc(o.text)}</span><span class="ep-sp ${over ? "over" : ""}">${spCost} SP${cw?.mod_sp_discount && spCost !== md.sp ? ` (原${md.sp})` : ""}</span></div>
						<div class="ep-actions">${isCur ? `<span class="cnt ok">当前已装</span><button type="button" data-ep="clearSlot" class="danger">卸下</button>` : `<button type="button" class="${unlocked ? "primary" : ""}" data-ep="pick" data-id="${esc(md.id)}" ${unlocked ? "" : "disabled"}>${unlocked ? (over ? "装入（SP将超支）" : "装入此槽位") : "未解锁"}</button>`}</div>
					</div>
					<div class="ep-meta">${tagsHtml(limitedTags(md.tags, p, m))}${restr ? `<span class="muted">${esc(restr)}</span>` : ""}</div>
					<div class="ep-effect">${md.effect ? `<p>${md.effect}</p>` : ""}${actsHtml(md)}</div>
				</article>`;
			}).join("");
		} else {
			bodyEl.innerHTML = `<p class="muted" style="margin:0">匹配 ${list.length} 项系统</p>` + list.map(s => {
				const o = systemLibraryOrigin(s), unlocked = itemAvailable(p, s);
				const count = m.systems.filter(id => id === s.id).length;
				const uniqBlocked = isUnique(s) && count > 0;
				const spCost = s.sp || 0, over = spCost > spRem;
				const acts = systemLibraryActivations(s).map(a => ACT[a] || (a === "Passive" ? "被动" : a));
				return `<article class="ep-card ${count ? "is-current" : ""} ${unlocked ? "" : "is-locked"}">
					<div class="ep-card-head">
						<div class="ep-card-title"><b>${esc(plain("item", s))}</b>${s.name !== plain("item", s) ? `<small>${esc(s.name)}</small>` : ""}${extBadge(s)}<span class="ep-origin">${esc(o.text)}</span><span class="ep-sp ${over && !count ? "over" : ""}">${spCost} SP</span></div>
						<div class="ep-actions">
							${count ? `<span class="cnt ok">已装 ${count}</span><button type="button" data-ep="removeSys" data-id="${esc(s.id)}" class="danger">移除</button>` : ""}
							${uniqBlocked ? "" : `<button type="button" class="${unlocked ? "primary" : ""}" data-ep="pick" data-id="${esc(s.id)}" ${unlocked ? "" : "disabled"}>${unlocked ? (count ? "＋ 再装一件" : over ? "＋ 安装（SP超支）" : "＋ 安装") : "未解锁"}</button>`}
						</div>
					</div>
					<div class="ep-meta"><span>${esc(acts.join(" / "))}</span>${tagsHtml(systemTags(s, p, m))}</div>
					<div class="ep-effect">${s.effect ? `<p>${s.effect}</p>` : ""}${actsHtml(s)}</div>
				</article>`;
			}).join("");
		}
	} finally {
		STAT_CTX = prevCtx;
	}
	highlightTerms(bodyEl);
}

// ---------- Ctrl+K 全局速查弹窗 ----------
function quickLookupSearch(q, cat) {
	const clean = String(q || "").trim().toLocaleLowerCase();
	const words = clean ? clean.split(/\s+/) : [];
	const match = hay => !words.length || words.every(w => hay.includes(w));
	const out = [];
	const push = (kind, title, sub, id, extra) => { if (out.length < 70) out.push({ kind, title, sub, id, extra }); };

	if (!cat || cat === "term") {
		const G = getGlossary();
		G.list.forEach((g, i) => {
			if (match(`${g.term} ${g.alias.join(" ")} ${stripHtml(g.def)}`.toLocaleLowerCase())) {
				push("term", g.term, stripHtml(g.def).slice(0, 90), String(i), g.cat);
			}
		});
	}
	if (!cat || cat === "frame") {
		for (const f of D.frames) {
			if (match(`${frameName(f)} ${f.name} ${f.source} ${f.traits.map(t => t.name).join(" ")} ${f.core_system?.name || ""}`.toLocaleLowerCase())) {
				push("frame", `${frameName(f)} (${f.source})`, `${frameRoles(f)} · 大小 ${frameSize(f.stats.size)} · HP ${f.stats.hp} · SP ${f.stats.sp}`, f.id, "骨架");
			}
		}
	}
	if (!cat || cat === "weapon") {
		for (const w of D.weapons) {
			const o = weaponOrigin(w);
			if (match(`${plain("item", w)} ${w.name} ${o.text} ${tagsPlain(w.tags)} ${stripHtml(w.effect)}`.toLocaleLowerCase())) {
				push("weapon", plain("item", w), `${o.text} · ${T.mount[w.mount] || w.mount}${T.wtype[w.type] || w.type} · ${summaryRangeText(w)} · ${summaryDmgText(w)}`, w.id, "武器");
			}
		}
	}
	if (!cat || cat === "system") {
		for (const it of [...D.systems, ...D.mods]) {
			const o = systemLibraryOrigin(it);
			if (match(`${plain("item", it)} ${it.name} ${o.text} ${tagsPlain(it.tags)} ${stripHtml(it.effect)}`.toLocaleLowerCase())) {
				push("system", plain("item", it), `${o.text} · ${it.sp || 0} SP · ${stripHtml(it.effect || actsHtml(it)).slice(0, 80)}`, it.id, MODS[it.id] ? "改装" : "系统");
			}
		}
	}
	if (!cat || cat === "talent") {
		for (const t of D.talents) {
			const z = Z.talents[t.name];
			if (match(`${plain("talent", t)} ${t.name} ${t.terse || ""} ${z ? z.ranks.map(r => stripHtml(r.html)).join(" ") : ""}`.toLocaleLowerCase())) {
				push("talent", plain("talent", t), t.terse || "", t.id, "天赋");
			}
		}
	}
	if (!cat || cat === "cb") {
		for (const c of D.core_bonuses) {
			const z = Z.cb[nk(c.name)];
			if (match(`${plain("cb", c)} ${c.name} ${c.source} ${stripHtml(z ? z.html : c.effect)}`.toLocaleLowerCase())) {
				push("cb", `${plain("cb", c)} (${c.source})`, stripHtml(z ? z.html : c.effect).slice(0, 90), c.id, "核心奖励");
			}
		}
	}
	if ((!cat || cat === "faq") && window.LANCER_FAQ_VIEW) {
		for (const e of window.LANCER_FAQ_VIEW.filter({ q: clean }).slice(0, 15)) {
			push("faq", e.question, e.answer.replace(/[*#\n]/g, " ").slice(0, 90), e.id, "FAQ");
		}
	}
	if ((!cat || cat === "lore") && window.LANCER_LORE_CODEX) {
		const loreHits = window.LANCER_LORE_CODEX.visibleLoreEntries({ cat: "", q: clean, maker: "", src: "", ownedOnly: false, mergeShared: true }, P()).slice(0, cat === "lore" ? 40 : 12);
		for (const e of loreHits) {
			push("lore", e.title, (e.plainBody || "").replace(/\s+/g, " ").slice(0, 90), e.id, "风味典藏");
		}
	}
	return out;
}

function ensureQuickLookupDialog() {
	if (typeof document === "undefined" || !document.createElement) return null;
	let dlg = document.getElementById("quickLookupDialog");
	if (dlg) return dlg;
	dlg = document.createElement("dialog");
	dlg.id = "quickLookupDialog";
	dlg.className = "ux-dialog ql-dialog";
	dlg.setAttribute("aria-label", "全局速查");
	dlg.innerHTML = `<div class="ux-dlg-wrap">
		<div class="ql-search-wrap">
			<input type="search" id="qlInput" placeholder="输入关键词：术语、武器、系统、骨架、天赋、核心奖励或规则 FAQ…" autocomplete="off">
			<button type="button" data-ql="close">关闭 <kbd>Esc</kbd></button>
		</div>
		<div class="ql-cats" id="qlCats"></div>
		<div class="ql-results" id="qlResults"></div>
	</div>`;
	document.body.append(dlg);
	dlg.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); dlg.close(); } });
	dlg.addEventListener("input", e => { if (e.target.id === "qlInput") { uxState.ql.q = e.target.value; renderQuickLookup(); } });
	dlg.addEventListener("click", e => {
		const btn = e.target.closest("[data-ql]");
		if (!btn) return;
		if (btn.dataset.ql === "close") return dlg.close();
		if (btn.dataset.ql === "cat") { uxState.ql.cat = btn.dataset.cat; renderQuickLookup(); return; }
		if (btn.dataset.ql === "open") {
			const kind = btn.dataset.kind, id = btn.dataset.id;
			dlg.close();
			openQuickLookupResult(kind, id);
		}
	});
	return dlg;
}

function openQuickLookupResult(kind, id) {
	if (kind === "term") return openGlossary(+id);
	if (kind === "weapon") {
		Object.assign(weaponTableState, { q: plain("item", WEAPONS[id]), mount: "", type: "", src: "", avail: false });
		openWeaponTable();
		const inp = document.querySelector('[data-wt="q"]');
		if (inp) inp.value = weaponTableState.q;
		renderWeaponTable();
		return;
	}
	if (kind === "system") {
		const it = SYSTEMS[id] || MODS[id];
		Object.assign(systemLibraryState, systemLibraryDefaults(), { q: plain("item", it) });
		openSystemLibrary();
		const inp = document.querySelector('[data-sl="q"]');
		if (inp) inp.value = systemLibraryState.q;
		renderSystemLibrary();
		return;
	}
	if (kind === "frame") {
		P().wizard = null; tab = "mech"; frameBrowse.open = true; frameBrowse.preview = id;
		render();
		setTimeout(() => document.querySelector(".frame-catalog")?.scrollIntoView({ block: "start" }), 30);
		return;
	}
	if (kind === "talent") {
		P().wizard = null; tab = "progress"; uiState.talentQuery = plain("talent", TALENTS[id]); uiState.selectedTalents = false;
		render();
		setTimeout(() => flashAndScrollTo(`[data-talent-row="${id}"]`), 30);
		return;
	}
	if (kind === "cb") {
		P().wizard = null; tab = "progress"; uxState.cb = { q: plain("cb", CBS[id]), maker: "", mode: "" };
		render();
		setTimeout(() => flashAndScrollTo(`[data-cb-id="${id}"]`), 30);
		return;
	}
	if (kind === "faq") {
		location.hash = "#faq-" + id;
		document.querySelector('[data-ui="openFAQ"]')?.click();
		return;
	}
	if (kind === "lore" && typeof openLoreCodex === "function") {
		openLoreCodex({ id });
	}
}

function renderQuickLookup() {
	const dlg = document.getElementById("quickLookupDialog");
	if (!dlg) return;
	const cats = [["", "全部"], ["term", "术语"], ["frame", "骨架"], ["weapon", "武器"], ["system", "系统/改装"], ["talent", "天赋"], ["cb", "核心奖励"], ["lore", "风味典藏"], ["faq", "FAQ"]];
	dlg.querySelector("#qlCats").innerHTML = cats.map(([k, n]) => `<button type="button" data-ql="cat" data-cat="${k}" class="${uxState.ql.cat === k ? "on" : ""}">${n}</button>`).join("");
	const res = quickLookupSearch(uxState.ql.q, uxState.ql.cat);
	dlg.querySelector("#qlResults").innerHTML = res.length ? res.map(r => `<button type="button" class="ql-item" data-ql="open" data-kind="${esc(r.kind)}" data-id="${esc(r.id)}">
		<span class="ql-item-main"><b>${esc(r.title)}</b>${r.sub ? `<p>${esc(r.sub)}</p>` : ""}</span>
		<span class="ql-badge">${esc(r.extra)}</span>
	</button>`).join("") : '<p class="empty-state">没有匹配的条目，换个关键词试试。</p>';
}
function openQuickLookup() {
	const dlg = ensureQuickLookupDialog();
	if (!dlg) return;
	closeTopMenus();
	const inp = dlg.querySelector("#qlInput");
	if (inp) inp.value = uxState.ql.q;
	renderQuickLookup();
	if (!dlg.open) dlg.showModal();
	inp?.focus();
	inp?.select();
}

// ---------- ④ 上桌实战速查卡（按动作经济分组 + 本地战局计数器） ----------
const PLAY_BUCKETS = [
	{ id: "protocol", label: "协定", color: "#c77dff", hint: "仅在你的回合开始时执行" },
	{ id: "quick", label: "快速动作", color: "#4cc38a", hint: "每回合可执行 2 个快速动作（或 1 个完整动作）" },
	{ id: "full", label: "完整动作", color: "#e0483e", hint: "消耗整个回合的常规动作（如齐射、超重武器、稳住阵脚）" },
	{ id: "tech", label: "科技 / 入侵", color: "#4ea8de", hint: "快速科技、完整科技与入侵选项" },
	{ id: "free", label: "自由动作", color: "#f0a43a", hint: "不计入常规动作上限（含超限）" },
	{ id: "reaction", label: "反应", color: "#ff7b54", hint: "满足触发条件时执行（通常每回合最多 1 次反应）" },
	{ id: "passive", label: "常驻与被动", color: "#8b92a3", hint: "持续生效或按特定条件自动触发的特征与加成" },
];
const PLAY_CONDITIONS = [
	{ id: "bolstered", name: "强化", pos: true },
	{ id: "hidden", name: "隐蔽", pos: true },
	{ id: "lockon", name: "锁定" },
	{ id: "prone", name: "伏卧" },
	{ id: "slowed", name: "缓慢" },
	{ id: "impaired", name: "受损" },
	{ id: "jammed", name: "受扰" },
	{ id: "exposed", name: "暴露" },
	{ id: "shredded", name: "离散" },
	{ id: "immobilized", name: "定身" },
	{ id: "stunned", name: "晕眩" },
	{ id: "shutdown", name: "关机" },
];
const OVERCHARGE_STEPS = ["1", "1d3", "1d6", "1d6+4"];

function mapActivationToBucket(act) {
	const a = String(act || "").trim();
	if (a === "Protocol" || a === "协定") return "protocol";
	if (a === "Quick" || a === "快速动作") return "quick";
	if (a === "Full" || a === "完整动作") return "full";
	if (["Quick Tech", "Full Tech", "Invade", "快速科技", "完整科技", "入侵"].includes(a)) return "tech";
	if (a === "Free" || a === "自由动作") return "free";
	if (a === "Reaction" || a === "反应") return "reaction";
	return "passive";
}
function inferBucketsFromText(text) {
	const s = stripHtml(text);
	const found = [];
	if (/协定/.test(s)) found.push("protocol");
	if (/作为(?:一个)?反应|以(?:一个)?反应|反应[（(]/.test(s)) found.push("reaction");
	if (/快速科技|完整科技|入侵/.test(s)) found.push("tech");
	if (/自由动作/.test(s)) found.push("free");
	if (/完整动作/.test(s)) found.push("full");
	if (/快速动作/.test(s)) found.push("quick");
	return found.length ? [...new Set(found)] : ["passive"];
}

function collectLimitedTrackers(p, m) {
	const f = FRAMES[m.frame];
	if (!f) return [];
	const out = [];
	const addItem = (key, name, tags, item) => {
		const lt = limitedTags(tags, p, m, item).find(t => t.id === "tg_limited");
		if (!lt) return;
		const max = Number.isFinite(+lt.val) ? +lt.val : 0;
		out.push({ key, name, max, label: tagText(lt) });
	};
	integratedOf(f, p, m).forEach(it => {
		const tags = it.mount ? (effectiveProfile(it, it.profiles?.[0] || it, null, p, m).tags || it.tags) : systemTags(it, p, m);
		addItem(`int_${it.id}`, plain("item", it), tags, it);
	});
	equippedWeapons(p, m).forEach((e, idx) => {
		const prof = effectiveProfile(e.w, e.w.profiles ? e.w.profiles[0] : e.w, e.mod, p, m);
		addItem(`w_${e.mount.key}_${e.i}_${idx}`, plain("item", e.w), prof.tags || e.w.tags, e.w);
		for (const md of (e.mods || (e.mod ? [e.mod] : []))) {
			addItem(`mod_${e.mount.key}_${e.i}_${md.id}`, `${plain("item", md)}（${plain("item", e.w)}）`, md.tags, md);
		}
	});
	m.systems.forEach((id, idx) => {
		const s = SYSTEMS[id];
		if (s) addItem(`sys_${id}_${idx}`, plain("item", s), systemTags(s, p, m), s);
	});
	return out;
}

function collectActionSheet(p, m) {
	const buckets = Object.fromEntries(PLAY_BUCKETS.map(b => [b.id, []]));
	const f = FRAMES[m.frame];
	if (!f) return buckets;
	const st = mechStats(p, m);
	const prevCtx = STAT_CTX;
	STAT_CTX = st ? { ...st, grit: LV(p.ll).grit, drone_hp: staticBonus(p, m, "drone_hp"), deployable_hp: staticBonus(p, m, "deployable_hp") } : {};

	const push = (bucketId, card) => {
		const target = buckets[bucketId] || buckets.passive;
		target.push(card);
	};

	const pushActionsOf = (obj, sourceLabel) => {
		if (!obj || SKIP_DUP_ACTIONS.has(obj.id)) return false;
		let added = false;
		for (const k of ["actions", "active_actions", "passive_actions"]) {
			for (const a of asList(obj[k])) {
				if (!a.detail && !a.name) continue;
				const actRaw = (a.name === "钩索摆荡" && a.activation === "None") ? "Free"
					: ((a.name === "扭曲护盾" || a.name === "曲速护盾") && a.activation === "None") ? "Reaction"
					: a.activation;
				const bk = mapActivationToBucket(actRaw);
				const meta = [ACT[actRaw] || actRaw, freqText(a.frequency)].filter(x => x && x !== "None").join(" · ");
				push(bk, {
					title: a.name || sourceLabel,
					source: sourceLabel,
					meta,
					trigger: a.trigger || "",
					body: `<p>${a.detail || ""}</p>`,
				});
				added = true;
			}
		}
		if (!SKIP_BOGUS_DEPLOYABLES.has(obj.id)) {
			for (const k of ["deployables", "active_deployables"]) {
				for (const d of asList(obj[k])) {
					if (!d.detail && !asList(d.actions).length && d.type !== "Drone") continue;
					const depActRaw = d.type === "Drone" ? (d.activation === "None" ? "Quick" : (d.activation || droneDeployment(obj))) : (d.activation && d.activation !== "None" ? d.activation : QUICK_DEPLOY_SYSTEMS.has(obj.id) ? "Quick" : "");
					const bk = depActRaw ? mapActivationToBucket(depActRaw) : "quick";
					const body = (d.detail ? `<p>${d.detail}</p>` : "") + (asList(d.actions).length ? "" : "");
					push(bk, {
						title: `${d.name || sourceLabel}（部署）`,
						source: sourceLabel,
						meta: `${ACT[d.type] || d.type || "可展开"} · ${ACT[depActRaw] || "快速动作"}`,
						tags: tagsHtml(d.tags),
						body: body || `<p>${obj.effect || ""}</p>`,
					});
					pushActionsOf(d, `${sourceLabel} · ${d.name || ""}`);
					added = true;
				}
			}
		}
		return added;
	};

	try {
		// 1. 骨架特征
		for (const t of mechTraits(m)) {
			const hadActs = pushActionsOf(t, `骨架特征 · ${frameName(f)}`);
			if (t.description || !hadActs) {
				const bks = hadActs ? ["passive"] : inferBucketsFromText(t.description);
				push(bks[0], { title: t.name, source: `骨架特征 · ${frameName(f)}`, meta: bks[0] === "passive" ? "骨架特征" : "", body: `<p>${t.description || ""}</p>` });
			}
		}

		// 2. 核心系统
		const cs = f.core_system;
		if (cs) {
			if (cs.passive_name || cs.passive_effect) {
				push("passive", { title: `${cs.passive_name || cs.name}（核心被动）`, source: `核心系统 · ${frameName(f)}`, meta: cs.efficient ? "高效 · 场景结束返还 1 CP" : "核心被动", body: `<p>${cs.passive_effect || ""}</p>` });
			}
			pushActionsOf({ id: f.id, passive_actions: cs.passive_actions, deployables: cs.deployables }, `核心被动 · ${cs.name}`);
			const actBk = mapActivationToBucket(cs.activation);
			push(actBk, {
				title: `${cs.active_name || cs.name}（核心主动 · 1 CP）`,
				source: `核心系统 · ${frameName(f)}`,
				meta: [ACT[cs.activation] || cs.activation || "主动", cs.efficient ? "高效" : "", cs.deactivation ? `${ACT[cs.deactivation] || cs.deactivation}关闭` : ""].filter(Boolean).join(" · "),
				body: `<p>${cs.active_effect || ""}</p>`,
			});
			pushActionsOf({ id: f.id, actions: cs.actions, active_actions: cs.active_actions, active_deployables: cs.active_deployables }, `核心主动 · ${cs.name}`);
		}

		// 3. 武器（内建 + 已装配）
		const addWeaponCard = (w, mod, mountLabel, note) => {
			const prof = effectiveProfile(w, w.profiles ? w.profiles[0] : w, mod, p, m);
			const isSuper = w.mount === "Superheavy";
			const bk = isSuper ? "full" : "quick";
			const meta = [`${T.mount[w.mount] || w.mount}${T.wtype[w.type] || w.type}`, summaryRangeText(w, prof), summaryDmgText(w, prof)].filter(Boolean).join(" · ");
			let body = "";
			if (note) body += `<p><b>构筑加成：</b>${esc(note)}</p>`;
			if (w.effect) body += `<p>${w.effect}</p>`;
			if (w.on_attack) body += `<p><b>攻击时：</b>${txt(w.on_attack)}</p>`;
			if (w.on_hit) body += `<p><b>命中时：</b>${txt(w.on_hit)}</p>`;
			if (w.on_crit) body += `<p><b>会心一击时：</b>${txt(w.on_crit)}</p>`;
			if (w.profiles?.length) {
				body += w.profiles.map(pf => `<div class="blk"><b>${esc(pf.name)}</b>：${esc([rngText(pf.range || w.range), dmgText(pf.damage || w.damage), tagsPlain(pf.tags)].filter(Boolean).join(" · "))}${pf.effect ? `<p>${pf.effect}</p>` : ""}</div>`).join("");
			}
			if (mod) body += `<div class="blk"><b>模块：${esc(plain("item", mod))}</b><p>${mod.effect || ""}</p></div>`;
			push(bk, {
				title: plain("item", w),
				source: mountLabel,
				meta: `${isSuper ? "齐射（超重型）" : "交战"} · ${meta}`,
				tags: tagsHtml(prof.tags || w.tags),
				body: body || '<p class="muted">常规武器攻击</p>',
			});
			pushActionsOf(w, `武器 · ${plain("item", w)}`);
			if (mod) pushActionsOf(mod, `武器模块 · ${plain("item", mod)}`);
		};
		for (const it of integratedOf(f, p, m)) {
			if (it.mount) addWeaponCard(it, null, "内建武器", buildWeaponNote(p, m, { w: it, mount: { type: "Integrated", key: "integrated" }, i: 0 }));
			else {
				const hadActs = pushActionsOf(it, `内建系统 · ${plain("item", it)}`);
				const acts = systemLibraryActivations(it);
				const bk = mapActivationToBucket(acts[0]);
				if (it.effect || !hadActs) push(bk, { title: plain("item", it), source: "内建系统", meta: acts.map(a => ACT[a] || "被动").join(" / "), tags: tagsHtml(systemTags(it, p, m)), body: `<p>${it.effect || ""}</p>` });
			}
		}
		for (const e of equippedWeapons(p, m)) {
			addWeaponCard(e.w, e.mod, `${T.mount[e.mount.type] || e.mount.type}挂载点`, buildWeaponNote(p, m, e));
		}

		// 4. 已安装系统
		for (const id of m.systems) {
			const s = SYSTEMS[id];
			if (!s) continue;
			const hadActs = pushActionsOf(s, `系统 · ${plain("item", s)}`);
			const acts = systemLibraryActivations(s);
			const bk = hadActs && acts.includes("Passive") ? "passive" : mapActivationToBucket(acts[0]);
			const extra = professionalSystemSummary(s, m, p);
			const cleanEff = stripHtml(s.effect || "");
			const depCoversEffect = hadActs && asList(s.deployables).some(d => !d.detail || stripHtml(d.detail) === cleanEff || cleanEff === "");
			const isStub = hadActs && !extra && (depCoversEffect || /^(?:获得|提供|解锁|可执行)?以下.{0,22}[：:]?$/.test(cleanEff));
			if (!isStub && (s.effect || extra || !hadActs)) {
				push(bk, {
					title: plain("item", s),
					source: `系统 · ${s.sp || 0} SP`,
					meta: acts.map(a => ACT[a] || (a === "Passive" ? "被动" : a)).join(" / "),
					tags: tagsHtml(systemTags(s, p, m)),
					body: (s.effect ? `<p>${s.effect}</p>` : "") + (extra ? `<p class="muted">${esc(extra)}</p>` : ""),
				});
			}
		}

		// 5. 已习得天赋（仅已点等级）
		for (const [tid, rank] of Object.entries(p.talents || {})) {
			if (!rank || !TALENTS[tid]) continue;
			const t = TALENTS[tid], z = Z.talents[t.name];
			t.ranks.slice(0, rank).forEach((rk, i) => {
				const rName = z?.ranks[i]?.name || rk.name;
				const rHtml = z?.ranks[i]?.html || rk.description || "";
				const bks = inferBucketsFromText(rHtml);
				push(bks[0], {
					title: `${plain("talent", t)} ${["I", "II", "III"][i]}：${rName}`,
					source: "天赋",
					meta: bks.map(b => PLAY_BUCKETS.find(x => x.id === b)?.label || "").join(" / "),
					body: rHtml,
				});
			});
		}

		// 6. 已选核心奖励
		for (const id of p.coreBonuses || []) {
			const c = CBS[id];
			if (!c) continue;
			const z = Z.cb[nk(c.name)];
			const html = z ? z.html : `<p>${esc(c.effect || "")}</p>`;
			const bks = inferBucketsFromText(html);
			push(bks[0], { title: plain("cb", c), source: `核心奖励 · ${c.source}`, meta: "永久改造", body: html });
		}

		// 7. 驾驶员装备
		const gearIds = [p.gear.armor, ...(p.gear.weapons || []), ...(p.gear.items || [])].filter(id => id && GEAR[id]);
		for (const id of gearIds) {
			const g = GEAR[id], z = Z.gear[g.name];
			const actTxt = pilotGearActionText(g);
			const bk = actTxt ? mapActivationToBucket(actTxt.split("（")[0]) : (g.type === "Weapon" ? "quick" : "passive");
			const meta = [g.damage ? dmgText(g.damage) : "", g.range ? rngText(g.range) : "", armorText(g), actTxt].filter(Boolean).join(" · ");
			push(bk, {
				title: plain("gear", g),
				source: "驾驶员装备",
				meta,
				tags: tagsHtml(g.tags),
				body: (z && z.html) || (g.effect ? `<p>${g.effect}</p>` : g.description ? `<p>${g.description}</p>` : ""),
			});
		}
	} finally {
		STAT_CTX = prevCtx;
	}
	return buckets;
}

// 本地战局状态存储（独立于角色存档，绝不污染构筑 JSON）
function playStateKey(p, m) { return `${p.id}::${p.activeMech}::${m?.frame || ""}`; }
function loadAllPlayStates() {
	try { return JSON.parse(localStorage.getItem(PLAY_STORE) || "{}") || {}; } catch (_) { return {}; }
}
function saveAllPlayStates(all) {
	try { localStorage.setItem(PLAY_STORE, JSON.stringify(all)); } catch (_) {}
}
function getPlayState(p, m, st) {
	const all = loadAllPlayStates();
	const key = playStateKey(p, m);
	const saved = all[key] || {};
	const limItems = collectLimitedTrackers(p, m);
	const limited = {};
	for (const it of limItems) {
		limited[it.key] = Number.isFinite(saved.limited?.[it.key]) ? Math.max(0, Math.min(it.max, saved.limited[it.key])) : it.max;
	}
	return {
		hp: Number.isFinite(saved.hp) ? Math.max(0, Math.min(st.hp, saved.hp)) : st.hp,
		overshield: Number.isFinite(saved.overshield) ? Math.max(0, saved.overshield) : 0,
		structure: Number.isFinite(saved.structure) ? Math.max(0, Math.min(st.structure, saved.structure)) : st.structure,
		heat: Number.isFinite(saved.heat) ? Math.max(0, saved.heat) : 0,
		stress: Number.isFinite(saved.stress) ? Math.max(0, Math.min(st.stress, saved.stress)) : st.stress,
		repairs: Number.isFinite(saved.repairs) ? Math.max(0, Math.min(st.repcap, saved.repairs)) : st.repcap,
		cp: saved.cp === 0 ? 0 : 1,
		overcharge: Number.isFinite(saved.overcharge) ? Math.max(0, Math.min(3, saved.overcharge)) : 0,
		conditions: Array.isArray(saved.conditions) ? saved.conditions : [],
		limited,
	};
}
function updatePlayState(p, m, fn) {
	const st = mechStats(p, m);
	if (!st) return;
	const all = loadAllPlayStates();
	const key = playStateKey(p, m);
	const cur = getPlayState(p, m, st);
	fn(cur, st);
	all[key] = cur;
	saveAllPlayStates(all);
}

function renderPlaySheet(p) {
	const m = M(), f = FRAMES[m?.frame];
	if (!f) return `<div class="card wide"><p class="muted">请先在「③ 机甲」为角色选择一部骨架。</p></div>`;
	const st = mechStats(p, m);
	const ps = getPlayState(p, m, st);
	const limItems = collectLimitedTrackers(p, m);
	const buckets = collectActionSheet(p, m);
	const q = uxState.playQuery.trim().toLocaleLowerCase();
	const mechSwitcher = p.mechs.length > 1
		? `<div class="mech-tabs" style="margin-bottom:0">${p.mechs.map((x, i) => `<button type="button" data-act="pickMech" data-arg="${i}" class="${i === p.activeMech ? "on" : ""}">${esc(x.name || "机甲" + (i + 1))}</button>`).join("")}</div>`
		: "";

	const totalCards = Object.values(buckets).reduce((n, arr) => n + arr.length, 0);
	const visibleBuckets = PLAY_BUCKETS.map(b => {
		const cards = buckets[b.id].filter(c => !q || `${c.title} ${c.source} ${c.meta || ""} ${c.trigger || ""} ${stripHtml(c.body)}`.toLocaleLowerCase().includes(q));
		return { ...b, cards };
	}).filter(b => (uxState.playBucket === "all" || uxState.playBucket === b.id) && b.cards.length);

	return `<div class="play-grid">
		<section class="play-tracker" aria-label="本地战局状态计数器">
			<div class="play-tracker-head">
				<div>
					<h3>⚔ ${esc(m.name || "当前机甲")} · ${esc(frameName(f))} <span class="muted">回避 ${st.evasion} · 电子防御 ${st.edef} · 装甲 ${st.armor} · 速度 ${st.speed} · 感应 ${st.sensor} · 豁免 ${st.save} · 科技 ${st.tech >= 0 ? "+" : ""}${st.tech} · 攻击 +${st.attack}</span></h3>
					<span class="muted">此计数器仅存于本机浏览器，不修改角色构筑档案</span>
				</div>
				<div class="row" style="margin:0">
					${mechSwitcher}
					<button type="button" data-play="stabilize" title="清除热度（稳住阵脚排热）">稳住阵脚排热</button>
					<button type="button" data-play="sceneEnd" title="场景结束：${f.core_system?.efficient ? "高效骨架自动返还 1 CP" : "清除临时护盾与状况"}">场景结束</button>
					<button type="button" data-play="fullRepair" class="primary" title="恢复满血、结构、压力、热度、维修、CP、超限与受限次数">全面维修重置</button>
					<button type="button" data-ui="openDamageRefProxy">判定速查表</button>
				</div>
			</div>
			<div class="play-meters">
				<div class="play-meter ${ps.hp === 0 ? "danger" : ps.hp <= Math.ceil(st.hp / 3) ? "warn" : ""}">
					<div class="play-meter-top"><span>HP</span><strong>${ps.hp} / ${st.hp}</strong></div>
					<div class="play-meter-ctl"><button type="button" data-play="hp" data-d="-5">−5</button><button type="button" data-play="hp" data-d="-1">−1</button><button type="button" data-play="hp" data-d="1">+1</button><button type="button" data-play="hpFull">满</button></div>
				</div>
				<div class="play-meter">
					<div class="play-meter-top"><span>护盾 Overshield</span><strong>${ps.overshield}</strong></div>
					<div class="play-meter-ctl"><button type="button" data-play="os" data-d="-1">−1</button><button type="button" data-play="os" data-d="1">+1</button><button type="button" data-play="os" data-d="4">+4</button><button type="button" data-play="osClear">清0</button></div>
				</div>
				<div class="play-meter ${ps.structure <= 1 ? "danger" : ps.structure <= 2 ? "warn" : ""}">
					<div class="play-meter-top"><span>结构 Structure</span><strong>${ps.structure} / ${st.structure}</strong></div>
					<div class="play-pips">${Array.from({ length: st.structure }, (_, i) => `<button type="button" class="play-pip ${i < ps.structure ? "on" : ""}" data-play="structure" data-v="${i + 1}" title="设为 ${i + 1} 结构">${i + 1}</button>`).join("")}</div>
				</div>
				<div class="play-meter ${ps.heat > st.heatcap ? "danger" : ps.heat >= Math.ceil(st.heatcap * 0.7) ? "warn" : ""}">
					<div class="play-meter-top"><span>热度 Heat</span><strong>${ps.heat} / ${st.heatcap}</strong></div>
					<div class="play-meter-ctl"><button type="button" data-play="heat" data-d="-2">−2</button><button type="button" data-play="heat" data-d="-1">−1</button><button type="button" data-play="heat" data-d="1">+1</button><button type="button" data-play="heat" data-d="2">+2</button></div>
				</div>
				<div class="play-meter ${ps.stress <= 1 ? "danger" : ps.stress <= 2 ? "warn" : ""}">
					<div class="play-meter-top"><span>压力 Stress</span><strong>${ps.stress} / ${st.stress}</strong></div>
					<div class="play-pips">${Array.from({ length: st.stress }, (_, i) => `<button type="button" class="play-pip stress ${i < ps.stress ? "on" : ""}" data-play="stress" data-v="${i + 1}" title="设为 ${i + 1} 压力">${i + 1}</button>`).join("")}</div>
				</div>
				<div class="play-meter">
					<div class="play-meter-top"><span>维修 / 核心电力</span><strong>修 ${ps.repairs}/${st.repcap}</strong></div>
					<div class="play-meter-ctl"><button type="button" data-play="rep" data-d="-1">修−1</button><button type="button" data-play="rep" data-d="1">修+1</button><button type="button" data-play="cp" class="${ps.cp ? "primary" : ""}">CP ${ps.cp}/1${f.core_system?.efficient ? "·高效" : ""}</button></div>
				</div>
				<div class="play-meter">
					<div class="play-meter-top"><span>超限阶梯</span><strong>${OVERCHARGE_STEPS[ps.overcharge]} 热</strong></div>
					<div class="play-overcharge">${OVERCHARGE_STEPS.map((s, i) => `<button type="button" data-play="oc" data-v="${i}" class="${ps.overcharge === i ? "on" : ""}">${s}</button>`).join("")}</div>
				</div>
			</div>
			${limItems.length ? `<div class="play-limited-row"><span class="muted">受限装备次数：</span>${limItems.map(it => `<span class="play-limited-item"><b>${esc(it.name)}</b><span>${ps.limited[it.key] ?? it.max}/${it.max}</span><button type="button" data-play="lim" data-key="${esc(it.key)}" data-d="-1">−</button><button type="button" data-play="lim" data-key="${esc(it.key)}" data-d="1">+</button></span>`).join("")}</div>` : ""}
			<div class="play-cond-row"><span class="muted">状态 / 状况：</span>${PLAY_CONDITIONS.map(c => `<button type="button" class="play-cond-btn ${c.pos ? "pos" : ""} ${ps.conditions.includes(c.id) ? "on" : ""}" data-play="cond" data-id="${c.id}">${c.name}</button>`).join("")}</div>
		</section>

		<section class="card wide">
			<div class="play-filter-bar">
				<button type="button" class="play-bucket-btn ${uxState.playBucket === "all" ? "on" : ""}" data-play="bucket" data-v="all">全部动作<small>${totalCards}</small></button>
				${PLAY_BUCKETS.map(b => `<button type="button" class="play-bucket-btn ${uxState.playBucket === b.id ? "on" : ""}" data-play="bucket" data-v="${b.id}"><span class="play-dot" style="background:${b.color}"></span> ${b.label}<small>${buckets[b.id].length}</small></button>`).join("")}
				<input type="search" data-ui="playSearch" value="${esc(uxState.playQuery)}" placeholder="筛选当前机甲的武器、天赋或能力…" style="margin-left:auto;min-width:210px;max-width:280px">
			</div>
			<details style="margin-top:8px"><summary>Lancer 常规基础动作速查（所有机甲通用）</summary>
				<div class="play-core-ref">
					<div><b>快速动作</b><p class="muted">交战（单挂载点攻击）、推进（移动速度格）、隐蔽、搜索、快速科技（强化 / 锁定 / 扫描 / 入侵）、擒抱、冲撞、预备、开关机</p></div>
					<div><b>完整动作</b><p class="muted">齐射（两个挂载点或 1 把超重型武器）、完整科技（执行两次快速科技或一次完整科技）、稳住阵脚（排热或花 1 维修回满 HP + 清部分状况）、即兴近战（1d6 动能）、脱离交战</p></div>
					<div><b>自由动作与反应</b><p class="muted">超限（1/回合自由动作执行任一快速动作，按阶梯承受热度）；守望（1/轮反应，在威胁内敌方开始移动时发起交战）；护盾/抵御（受伤害时以反应减半伤害，次回合仅 1 快速动作）</p></div>
				</div>
			</details>
		</section>

		${visibleBuckets.length ? visibleBuckets.map(b => `<section class="play-bucket">
			<div class="play-bucket-h"><h3><span class="play-dot" style="background:${b.color}"></span>${b.label} <span class="cnt">${b.cards.length}</span></h3><span class="muted">${b.hint}</span></div>
			<div class="play-cards">${b.cards.map(c => `<article class="play-card">
				<div class="play-card-top"><b>${esc(c.title)}</b><span class="play-src">${esc(c.source)}</span></div>
				${c.meta || c.tags ? `<div class="wstat">${esc(c.meta || "")} ${c.tags || ""}</div>` : ""}
				${c.trigger ? `<div class="play-trigger"><b>触发：</b>${c.trigger}</div>` : ""}
				<div class="desc">${c.body || ""}</div>
			</article>`).join("")}</div>
		</section>`).join("") : '<p class="empty-state">该分类或关键词下没有匹配的能力。</p>'}
	</div>`;
}

// ---------- UI 挂载与全局事件监听 ----------
function uxEnhanceUI() {
	syncPilotSwitcher(P());
	filterLicenses();
	filterCoreBonuses();
	const pop = document.getElementById("checkPopover");
	if (pop && !pop.hidden) pop.innerHTML = renderCheckPopoverContent(P());
}

if (typeof document !== "undefined" && document.addEventListener) {
	// Stat breakdown tooltip
	document.addEventListener("mouseover", e => { const s = e.target.closest?.(".stat[data-breakdown]"); if (s) showStatTip(s); });
	document.addEventListener("mouseout", e => { if (e.target.closest?.(".stat[data-breakdown]") && !e.relatedTarget?.closest?.(".stat[data-breakdown]")) hideStatTip(); });
	document.addEventListener("focusin", e => { const s = e.target.closest?.(".stat[data-breakdown]"); if (s) showStatTip(s); });
	document.addEventListener("focusout", e => { if (e.target.closest?.(".stat[data-breakdown]")) hideStatTip(); });
	document.addEventListener("scroll", hideStatTip, true);

	// Inputs & selects
	document.addEventListener("input", e => {
		const el = e.target;
		if (el.id === "pilotSearchInput") { uxState.pilotQuery = el.value; syncPilotSwitcher(P()); return; }
		if (el.dataset?.ui === "licSearch") { uxState.lic.q = el.value; filterLicenses(); return; }
		if (el.dataset?.ui === "cbSearch") { uxState.cb.q = el.value; filterCoreBonuses(); return; }
		if (el.dataset?.ui === "playSearch") { uxState.playQuery = el.value; render(); const inp = document.querySelector('[data-ui="playSearch"]'); if (inp) { inp.focus(); inp.setSelectionRange?.(inp.value.length, inp.value.length); } return; }
	});
	document.addEventListener("change", e => {
		const el = e.target;
		if (el.id === "pilotSortSelect") { uxState.pilotSort = el.value; syncPilotSwitcher(P()); return; }
		if (el.dataset?.ui === "licMaker") { uxState.lic.maker = el.value; filterLicenses(); return; }
		if (el.dataset?.ui === "licSelected") { uxState.lic.selected = el.checked; filterLicenses(); return; }
		if (el.dataset?.ui === "cbMaker") { uxState.cb.maker = el.value; filterCoreBonuses(); return; }
		if (el.dataset?.ui === "cbMode") { uxState.cb.mode = el.value; filterCoreBonuses(); return; }
	});

	// Clicks
	document.addEventListener("click", e => {
		const t = e.target;
		// Clicking inside a top dropdown summary closes sibling dropdowns
		const sum = t.closest?.("details.top-dropdown > summary, details.character-menu > summary");
		if (sum) {
			const parentId = sum.parentElement?.id || "";
			closeTopMenus(parentId);
			closeCheckPopover();
			if (parentId === "pilotSwitcher") setTimeout(() => document.getElementById("pilotSearchInput")?.focus(), 20);
			return;
		}
		// Pilot switcher select
		const psBtn = t.closest?.("[data-ux-pilot]");
		if (psBtn) {
			db.current = psBtn.dataset.uxPilot;
			closeTopMenus();
			render();
			return;
		}
		// Check badge popover
		if (t.closest?.("#checkBadge")) { toggleCheckPopover(); return; }
		const jumpBtn = t.closest?.("[data-ux-jump]");
		if (jumpBtn) {
			const cs = checks(P());
			const row = cs[+jumpBtn.dataset.uxJump];
			if (row) jumpToCheckTarget(resolveCheckTarget(row[1], P()));
			return;
		}
		// Smooth scroll buttons
		const scrollBtn = t.closest?.("[data-ux-scroll]");
		if (scrollBtn) { flashAndScrollTo(scrollBtn.dataset.uxScroll); return; }
		// Equipment picker triggers
		const pickBtn = t.closest?.("[data-ux-pick]");
		if (pickBtn) {
			const mode = pickBtn.dataset.uxPick;
			if (mode === "system") openEquipPicker({ mode: "system" });
			else {
				const [mountKey, slotIdx] = (pickBtn.dataset.arg || "").split("|");
				openEquipPicker({ mode, mountKey, slotIdx: +slotIdx || 0 });
			}
			return;
		}
		// Play view tracker controls
		const playBtn = t.closest?.("[data-play]");
		if (playBtn) {
			const p = P(), m = M(), act = playBtn.dataset.play;
			if (act === "bucket") { uxState.playBucket = playBtn.dataset.v; render(); return; }
			updatePlayState(p, m, (ps, st) => {
				const d = +playBtn.dataset.d || 0, v = +playBtn.dataset.v;
				if (act === "hp") ps.hp = Math.max(0, Math.min(st.hp, ps.hp + d));
				else if (act === "hpFull") ps.hp = st.hp;
				else if (act === "os") ps.overshield = Math.max(0, ps.overshield + d);
				else if (act === "osClear") ps.overshield = 0;
				else if (act === "structure") ps.structure = ps.structure === v ? Math.max(0, v - 1) : v;
				else if (act === "heat") ps.heat = Math.max(0, ps.heat + d);
				else if (act === "stress") ps.stress = ps.stress === v ? Math.max(0, v - 1) : v;
				else if (act === "rep") ps.repairs = Math.max(0, Math.min(st.repcap, ps.repairs + d));
				else if (act === "cp") ps.cp = ps.cp ? 0 : 1;
				else if (act === "oc") ps.overcharge = v;
				else if (act === "lim") {
					const lims = collectLimitedTrackers(p, m);
					const item = lims.find(x => x.key === playBtn.dataset.key);
					if (item) ps.limited[item.key] = Math.max(0, Math.min(item.max, (ps.limited[item.key] ?? item.max) + d));
				} else if (act === "cond") {
					const cid = playBtn.dataset.id;
					ps.conditions = ps.conditions.includes(cid) ? ps.conditions.filter(x => x !== cid) : [...ps.conditions, cid];
				} else if (act === "stabilize") { ps.heat = 0; }
				else if (act === "sceneEnd") {
					ps.overshield = 0; ps.conditions = [];
					if (FRAMES[m.frame]?.core_system?.efficient) ps.cp = 1;
				} else if (act === "fullRepair") {
					ps.hp = st.hp; ps.overshield = 0; ps.structure = st.structure; ps.heat = 0;
					ps.stress = st.stress; ps.repairs = st.repcap; ps.cp = 1; ps.overcharge = 0; ps.conditions = [];
					for (const it of collectLimitedTrackers(p, m)) ps.limited[it.key] = it.max;
				}
			});
			render();
			return;
		}
		// Generic UI actions
		const uiBtn = t.closest?.("[data-ui]");
		if (uiBtn) {
			const u = uiBtn.dataset.ui;
			if (u === "openQuickLookup") { openQuickLookup(); return; }
			if (u === "closeCheckPopover") { closeCheckPopover(); return; }
			if (u === "resetLic") { uxState.lic = { q: "", maker: "", selected: false }; render(); document.querySelector('[data-ui="licSearch"]')?.focus(); return; }
			if (u === "toggleLicDetails") {
				const dets = [...document.querySelectorAll('#card-licenses .lic:not([hidden]) details')];
				const anyClosed = dets.some(d => !d.open);
				dets.forEach(d => { d.open = anyClosed; const id = d.dataset.openId; if (id) anyClosed ? openSet.add(id) : openSet.delete(id); });
				return;
			}
			if (u === "resetCb") { uxState.cb = { q: "", maker: "", mode: "" }; render(); document.querySelector('[data-ui="cbSearch"]')?.focus(); return; }
			if (u === "toggleFrameRules") { uxState.compactFrameRules = !uxState.compactFrameRules; render(); return; }
			if (u === "sheetModeExport") { uxState.sheetMode = "export"; render(); return; }
			if (u === "sheetModePlay") { uxState.sheetMode = "play"; render(); return; }
			if (u === "goSheetPlay") { P().wizard = null; tab = "sheet"; uxState.sheetMode = "play"; closeCheckPopover(); window.scrollTo?.(0, 0); render(); return; }
			if (u === "openDamageRefProxy") { document.getElementById("openDamageReference")?.click(); return; }
		}
		// Close dropdowns / check popover when clicking outside or clicking an action button inside ref/gm menu
		if (!t.closest?.("#checkPopover") && !t.closest?.("#checkBadge")) closeCheckPopover();
		const inDrop = t.closest?.("details.top-dropdown");
		if (!inDrop) closeTopMenus();
		else if (inDrop.id !== "pilotSwitcher" && t.closest?.("button")) inDrop.open = false;
	});

	// Keyboard shortcuts: Ctrl+K / Cmd+K for Quick Lookup, Escape for popovers & dropdowns
	document.addEventListener("keydown", e => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
			e.preventDefault();
			openQuickLookup();
			return;
		}
		if (e.key === "Escape") {
			closeTopMenus();
			closeCheckPopover();
			hideStatTip();
		}
	});
}
