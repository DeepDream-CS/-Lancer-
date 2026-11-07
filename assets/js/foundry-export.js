"use strict";
// 车卡器角色 → COMP/CON v2 驾驶员 JSON，供 Foundry VTT LANCER 系统驾驶员表「文件导入」（FILE IMPORT）使用。
// Foundry 按条目 id 从合集包取用技能触发、天赋、牌照、核心奖励、装备、骨架、武器、改装和系统，
// 所以需要先导入车卡器导出的中文内容包（与官方补充书重复的扩展条目改用官方 id，见 D.fvtt_map）。
// 车卡器专用的配置（第二改装、武器舱、战术带、招牌动作等）Foundry 没有对应字段，写进机甲备注。
// 依赖 app.js / rules.js 的函数，只在点击导出时调用。

// Foundry 挂载点类型 → 各槽位尺寸（foundryvtt-lancer enums.ts 的 fittingsForMount）
const FOUNDRY_FITTINGS = {
	"Main": ["Main"], "Aux": ["Auxiliary"], "Aux/Aux": ["Auxiliary", "Auxiliary"], "Flex": ["Flex", "Auxiliary"],
	"Main/Aux": ["Main", "Auxiliary"], "Heavy": ["Heavy"], "Superheavy": ["Superheavy"], "Integrated": ["Integrated"],
};

function foundryLid(id) { return (D.fvtt_map && D.fvtt_map[id]) || id; }

function foundryPilotData(p) {
	const pilotNotes = [];
	const limitedOf = (tags, m) => {
		const t = (m ? limitedTags(tags, p, m) : tags || []).find(t => t.id === "tg_limited");
		const n = Number(t?.val);
		return Number.isFinite(n) ? n : 0;
	};
	const itemName = (kind, x) => (x ? plain(kind, x) : "");
	const weaponState = (w, mod, m) => ({
		id: foundryLid(w.id), loaded: true, destroyed: false, cascading: false, uses: limitedOf(w.tags, m),
		mod: mod ? { id: foundryLid(mod.id), destroyed: false, cascading: false, uses: limitedOf(mod.tags, m) } : null,
	});

	// 技能触发：车卡器记加值（+2 / +4 / +6），COMP/CON 记等级（1–3）
	const skills = p.triggers.filter(t => t.id || t.custom).map(t => {
		const rank = Math.max(1, Math.min(3, Math.round((+t.val || 2) / 2)));
		return t.id && SKILLS[t.id] ? { id: t.id, rank } : { id: t.custom || t.id, rank, custom: true, custom_desc: "" };
	});
	const talents = Object.entries(p.talents).filter(([id, r]) => r > 0 && TALENTS[id]).map(([id, rank]) => ({ id: foundryLid(id), rank }));
	const licenses = Object.entries(p.licenses).filter(([id, r]) => r > 0 && FRAMES[id]).map(([id, rank]) => ({ id: foundryLid(id), rank }));
	for (const x of p.professionalLicenses || []) {
		const def = professionalDefinition(x);
		if (def) licenses.push({ id: def.id, rank: x.rank });
		else pilotNotes.push(`自定义专业牌照「${x.name}」（${x.source} ${x.rank} 级）在 Foundry 中没有对应条目`);
	}
	if (p.extraLicenseRanks) pilotNotes.push(`额外牌照等级 ${p.extraLicenseRanks}`);

	const gearIds = ids => (ids || []).filter(id => id && GEAR[id]).map(id => ({ id: foundryLid(id), destroyed: false, uses: limitedOf(GEAR[id].tags) }));
	const bg = BGS[p.background];

	const mechs = p.mechs.map((m, i) => {
		const f = FRAMES[m.frame];
		if (!f) { pilotNotes.push(`机甲「${m.name}」没有选择骨架，未导出`); return null; }
		const st = mechStats(p, m);
		const notes = [];
		const linked = linkedMounts(p, m);
		const mounts = mountsOf(p, m).map(mt => {
			const fit = FOUNDRY_FITTINGS[mt.type] || ["Integrated"];
			const state = m.loadout[mt.key] || { slots: [] };
			if (linked.has(mt.key)) return { mount_type: mt.type, lock: true, slots: fit.map(size => ({ size, weapon: null })), extra: [], bonus_effects: [] };
			const slots = fit.map((size, idx) => {
				const s = state.slots[idx];
				const w = s && s.w && WEAPONS[s.w];
				if (!w || !slotAccepts(mt, idx, state.slots).includes(w.mount)) return { size, weapon: null };
				const mods = slotMods(s);
				if (mods.length > 1) notes.push(`${itemName("item", w)} 的第二改装：${mods.slice(1).map(x => itemName("item", x)).join("、")}`);
				const cw = configuredWeapon(w, m, s);
				if (cw.selected_profile) notes.push(`${itemName("item", w)} 选用数据组：${cw.selected_profile}`);
				return { size, weapon: weaponState(w, mods[0], m) };
			});
			return { mount_type: mt.type, lock: false, slots, extra: [], bonus_effects: [] };
		});
		const integrated = integratedOf(f, p, m);
		const integratedMounts = integrated.filter(x => x.mount).map(w => ({ weapon: weaponState(w, null, m) }));
		const integratedSystems = integrated.filter(x => !x.mount).map(s => ({ id: foundryLid(s.id), destroyed: false, cascading: false, uses: limitedOf(s.tags, m) }));
		const systems = m.systems.filter(id => SYSTEMS[id]).map(id => ({ id: foundryLid(id), destroyed: false, cascading: false, uses: limitedOf(SYSTEMS[id].tags, m) }));

		// 车卡器专用的配置
		if (m.signature && SYSTEMS[m.signature]) notes.push(`招牌动作（核心奖励）指定系统：${itemName("item", SYSTEMS[m.signature])}，SP −2`);
		if (m.overpower) { const [key, idx] = m.overpower.split("|"); const w = WEAPONS[m.loadout[key]?.slots?.[+idx]?.w]; if (w) notes.push(`超功率口径（核心奖励）指定武器：${itemName("item", w)}`); }
		if (m.stabilized) notes.push(`自动稳定（核心奖励）挂载点：${m.stabilized}`);
		if (m.sentryWeapon && WEAPONS[m.sentryWeapon]) notes.push(`哨兵无人机部署时使用：${itemName("item", WEAPONS[m.sentryWeapon])}`);
		const belt = [m.beltSystem1, m.beltSystem2].filter(id => SYSTEMS[id]).map(id => itemName("item", SYSTEMS[id]));
		if (belt.length) notes.push(`战术带指定系统：${belt.join("、")}`);
		const pod = [m.podWeapon1, m.podWeapon2].filter(id => WEAPONS[id]).map(id => itemName("item", WEAPONS[id]));
		if (pod.length) notes.push(`武器舱（${m.podMode === "Main" ? "主武器" : "副武器"}）：${pod.join("、")}`);
		const legacy = inheritedTrait(m);
		if (legacy) notes.push(`康格多遗产特征：${legacy.name}`);
		const noteHtml = [m.notes ? `<p>${esc(m.notes)}</p>` : "", notes.length ? `<p><b>【车卡器配置】</b></p><ul>${notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>` : ""].join("");

		return {
			id: `${p.id}-mech-${i}`, name: m.name || plain("frame", f), frame: foundryLid(f.id), notes: noteHtml,
			portrait: "", cloud_portrait: "",
			current_hp: st.hp, overshield: 0, burn: 0, activations: 1, current_heat: 0,
			current_stress: st.stress, current_structure: st.structure, current_overcharge: 0, current_repairs: st.repcap,
			core_active: false, current_core_energy: 1,
			active_loadout_index: 0,
			loadouts: [{ id: `${p.id}-mech-${i}-loadout`, name: "车卡器配装", systems, integratedSystems, mounts, integratedMounts, integratedWeapon: null, improved_armament: null, superheavy_mounting: null }],
		};
	}).filter(Boolean);

	const active = mechs.find(x => x.id === `${p.id}-mech-${p.activeMech}`);
	const history = [p.bio, pilotNotes.length ? `【车卡器】${pilotNotes.join("；")}` : ""].filter(Boolean).join("\n\n");
	return {
		id: p.id, cc_ver: "lancer-builder", name: p.name || "驾驶员", callsign: p.callsign || "", player_name: p.player || "",
		level: p.ll, status: "Active", text_appearance: p.appearance || "", history, notes: "",
		background: bg ? plain("bg", bg) : p.bgCustom || "",
		cloudID: "", cloud_portrait: "", portrait: "",
		current_hp: pilotStats(p).hp,
		mechSkills: [p.hase.hull, p.hase.agi, p.hase.sys, p.hase.eng],
		skills, talents, licenses, core_bonuses: p.coreBonuses.filter(id => CBS[id]).map(foundryLid), reserves: [],
		loadout: { id: `${p.id}-loadout`, name: "车卡器配装", armor: gearIds([p.gear.armor]), weapons: gearIds(p.gear.weapons), gear: gearIds(p.gear.items), extendedWeapons: [], extendedGear: [] },
		mechs,
		state: { active_mech_id: active ? active.id : (mechs[0] ? mechs[0].id : ""), mounted: true },
		xp: 0, stress: 0, burdens: [], clocks: [], bondAnswers: [], minorIdeal: "",
	};
}

function exportFoundryJson(p) {
	const data = foundryPilotData(p);
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = `${(p.name || "pilot").replace(/[\\/:*?"<>|]/g, "_")}-foundry.json`;
	a.click();
}
