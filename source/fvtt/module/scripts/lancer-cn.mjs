// LANCER 中文（lancer-cn）：为中文名骨架补上骨架插图。
// LANCER 系统按骨架英文名查找 Retrograde Minis 插图（frameToPath），骨架改成中文名后就找不到。
// 这里改按骨架 id（system.lid）查找；插图表由 tools/build-fvtt-module.js 生成。

const FRAME_ART = /*FRAME_ART*/{};

// 与系统的 replaceDefaultResource 相同：空白、系统自带图片或神秘人图标视为可替换，玩家自定义的图片不动
const replaceable = img => !img?.trim() || img.includes("systems/lancer") || img === "icons/svg/mystery-man.svg";
const artFor = item => (item?.type === "frame" ? FRAME_ART[item.system?.lid] : null) ?? null;

// 新建骨架条目（包括导入内容包到合集）时补上插图
Hooks.on("preCreateItem", item => {
	const art = artFor(item);
	if (art && replaceable(item.img) && item.img !== art) item.updateSource({ img: art });
});

// 机甲换骨架后（机甲表在更新 system.loadout.frame 之前已按英文名尝试换图），按 id 补上头像与指示物图片
Hooks.on("updateActor", async (actor, changes, _options, userId) => {
	if (userId !== game.user.id || actor.type !== "mech") return;
	if (!foundry.utils.hasProperty(changes, "system.loadout.frame")) return;
	const frame = actor.system.loadout?.frame?.value ?? actor.items.find(i => i.type === "frame");
	const art = artFor(frame);
	if (!art) return;
	const update = {};
	if (replaceable(actor.img) && actor.img !== art) update.img = art;
	const token = actor.prototypeToken?.texture?.src;
	if (replaceable(token) && token !== art) update["prototypeToken.texture.src"] = art;
	if (Object.keys(update).length) await actor.update(update);
});

// ---------------------------------------------------------------------------
// 系统模板与代码里写死的英文（不经语言文件）：显示时按词典换成中文。
// 只改显示出来的文字节点和提示属性，不改输入框、富文本编辑区和文档数据。
// 词典由 tools/build-fvtt-module.js 从 cn-hardcoded.json、cn-words.json 生成：
//   exact    整段文字完全相同才替换
//   patterns 含 {x} 的句式，{x} 依次代入原文中的对应部分（{1}、{2} 可调换顺序）
//   words    枚举词（尺寸、类型、动作等），整段只由这些词组成时逐词替换，也用于翻译 {x} 代入的部分
//   context  只在特定界面里使用的译法（CSS 选择器 → 词典）

const HARDCODED = /*HARDCODED*/{ exact: {}, patterns: [], words: {}, context: {} };

const LETTER = /[A-Za-z]/;
const norm = s => s.replace(/\s+/g, " ").trim();
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const EXACT = new Map(Object.entries(HARDCODED.exact));
const WORDS = new Map(Object.entries(HARDCODED.words).map(([k, v]) => [k.toLowerCase(), v]));
const PATTERNS = HARDCODED.patterns.map(([src, zh]) => [new RegExp("^" + src.split("{x}").map(reEsc).join("(.*?)") + "$", "s"), zh]);
const CONTEXT = Object.entries(HARDCODED.context);
const NUMERIC = /^[\d+\-–.,×*()%]+$/;
const CJK_GAP = /(?<=[㐀-鿿）」]) (?=[㐀-鿿（「])/g;

// 整段只由枚举词组成（「MAIN RIFLE」「主/副」「USE QUICK TECH」）时逐词翻译，否则返回 null
function wordSeq(s) {
	const toks = s.split(/(\s+|\/)/).filter(t => t !== "");
	let out = "";
	let hit = false;
	for (let i = 0; i < toks.length; ) {
		const t = toks[i];
		if (t === "/" || /^\s+$/.test(t)) { out += t === "/" ? "/" : " "; i++; continue; }
		if (i + 2 < toks.length && /^\s+$/.test(toks[i + 1])) {
			const two = WORDS.get(`${t} ${toks[i + 2]}`.toLowerCase());
			if (two !== undefined) { out += two; i += 3; hit = true; continue; }
		}
		const w = WORDS.get(t.toLowerCase());
		if (w !== undefined) { out += w; hit = true; i++; continue; }
		if (NUMERIC.test(t)) { out += t; i++; continue; }
		return null;
	}
	return hit ? out.replace(CJK_GAP, "") : null;
}

// 句式里代入的部分：能整段翻译的就翻译（如武器尺寸、角色类型），否则保持原样（如物品名称）
function fill(zh, caps) {
	let n = 0;
	return zh.replace(/\{(x|\d)\}/g, (_, k) => {
		const c = caps[k === "x" ? n++ : Number(k) - 1] ?? "";
		const t = c.trim();
		const tr = t && LETTER.test(t) ? lookup(t, false) : null;
		return tr === null ? c : c.replace(t, tr);
	});
}

function lookup(s, deep) {
	if (EXACT.has(s)) return EXACT.get(s);
	const w = wordSeq(s);
	if (w !== null) return w;
	if (!deep) return null;
	for (const [re, zh] of PATTERNS) {
		const m = re.exec(s);
		if (m) return fill(zh, m.slice(1));
	}
	// 「名称 // MAIN RIFLE」「标题 :: TRAIT」「ACTIVATE - QUICK」：分隔符两侧分别翻译
	if (/\s(\/\/|::|-)\s/.test(s)) {
		const parts = s.split(/(\s*(?:\/\/|::)\s*|\s+-\s+)/);
		let hit = false;
		const out = parts.map((p, i) => {
			if (i % 2 || !LETTER.test(p)) return p;
			const t = lookup(p.trim(), false);
			if (t === null) return p;
			hit = true;
			return p.replace(p.trim(), t);
		});
		if (hit) return out.join("");
	}
	return null;
}

// 翻译一段显示文字；没有对应译文时返回 null。el 用于判断 context 词典
function translate(raw, el) {
	if (typeof raw !== "string" || !LETTER.test(raw)) return null;
	const s = norm(raw);
	if (el) for (const [sel, dict] of CONTEXT) if (s in dict && el.closest?.(sel)) return dict[s];
	return lookup(s, true);
}

// ---- DOM：文字节点与提示属性
const SKIP = "script, style, textarea, [contenteditable='true'], prose-mirror, .ProseMirror, .editor-content, .journal-page-content, .directory-list";
const ATTRS = ["title", "placeholder", "data-tooltip", "aria-label", "alt"];

function doText(node) {
	const v = node.nodeValue;
	if (!v || !LETTER.test(v)) return;
	const el = node.parentElement;
	if (!el || el.closest(SKIP)) return;
	const t = translate(v, el);
	if (t === null) return;
	const nv = v.match(/^\s*/)[0] + t + v.match(/\s*$/)[0];
	if (nv !== v) node.nodeValue = nv;
}

function doAttr(el, a) {
	const v = el.getAttribute(a);
	if (!v || !LETTER.test(v)) return;
	const t = translate(v, el);
	if (t !== null && t !== v) el.setAttribute(a, t);
}

function walk(root) {
	if (root.nodeType === Node.TEXT_NODE) return doText(root);
	if (root.nodeType !== Node.ELEMENT_NODE || root.closest(SKIP)) return;
	for (const a of ATTRS) doAttr(root, a);
	const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
		acceptNode: n => (n.nodeType === Node.ELEMENT_NODE && n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
	});
	for (let n = tw.nextNode(); n; n = tw.nextNode()) {
		if (n.nodeType === Node.TEXT_NODE) doText(n);
		else for (const a of ATTRS) doAttr(n, a);
	}
}

const observer = new MutationObserver(muts => {
	for (const m of muts) {
		if (m.type === "childList") m.addedNodes.forEach(walk);
		else if (m.type === "characterData") doText(m.target);
		else if (m.type === "attributes" && !m.target.closest(SKIP)) doAttr(m.target, m.attributeName);
	}
});

// 画布上的浮动数字（「-5 HP」「+2 Heat」）不在 DOM 里，包装系统调用的 createScrollingText
function patchScrollingText() {
	const proto = foundry?.canvas?.groups?.InterfaceCanvasGroup?.prototype;
	if (!proto?.createScrollingText || proto.createScrollingText.lancerCn) return;
	const orig = proto.createScrollingText;
	proto.createScrollingText = function (origin, content, options) {
		const t = typeof content === "string" ? translate(content) : null;
		return orig.call(this, origin, t ?? content, options);
	};
	proto.createScrollingText.lancerCn = true;
}

// ---------------------------------------------------------------------------
// 车卡器资料：专业牌照、扩展厂商。Foundry 的内容包导入只按骨架生成牌照，也不导入厂商，
// 这里由 GM 手动运行（模组设置中的「导入车卡器资料」）：
//   1. 在 LANCER 的驾驶员物品合集包中建立 / 更新专业牌照条目；专业牌照装备已随扩展内容包导入，
//      其 license 字段就是专业牌照 id，牌照表会按等级列出解锁的装备。
//   2. 把骨架牌照改成骨架的中文名（系统导入时只建立牌照、不更新，英文数据先导入时牌照名一直是英文）。
//   3. 建立「车卡器资料」日志合集包：专业牌照规则与各牌照说明、扩展厂商说明。
// 数据由 tools/build-fvtt-module.js 从车卡器 assets/js/data.js 生成。

const REFERENCE = /*REFERENCE*/{ professional: [], makers: [], rules: [] };
const MODULE_ID = "lancer-cn";
const JOURNAL_PACK = "lancer-cn-reference";
const ROMAN = ["", "I", "II", "III"];
const KIND_NAME = { weapons: "武器", systems: "系统", mods: "武器改装", pilot_gear: "驾驶员装备", frames: "骨架" };
const escHtml = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const paras = s => String(s ?? "").split(/\n+/).filter(t => t.trim()).map(t => `<p>${escHtml(t.trim())}</p>`).join("");

// lid → 合集包中的条目链接（找不到时只写名称）
async function linker() {
	const map = new Map();
	for (const id of ["world.mech-items", "world.pilot-items"]) {
		const pack = game.packs.get(id);
		if (!pack) continue;
		const index = await pack.getIndex({ fields: ["system.lid"] });
		for (const e of index) if (e.system?.lid) map.set(e.system.lid, `@UUID[Compendium.${id}.Item.${e._id}]`);
	}
	return (lid, name) => (map.has(lid) ? `${map.get(lid)}{${escHtml(name)}}` : escHtml(name));
}

function professionalPage(pl, link) {
	const byLevel = {};
	for (const it of pl.items) (byLevel[it.level] = byLevel[it.level] || []).push(it);
	const list = Object.keys(byLevel).sort().map(lv =>
		`<h3>${escHtml(pl.name)} ${ROMAN[lv] || lv}</h3><ul>${byLevel[lv].map(it => `<li>${KIND_NAME[it.kind] || ""}：${link(it.lid, it.name)}</li>`).join("")}</ul>`).join("");
	return `<p><b>厂商</b>：${escHtml(pl.maker)}　<b>牌照等级</b>：${ROMAN[pl.rank] || pl.rank}</p>${paras(pl.description)}<h2>解锁装备</h2>${list}`;
}

function makerPage(m, link) {
	const frames = m.frames.length ? `<h2>骨架牌照</h2><ul>${m.frames.map(f => `<li>${link(f.lid, f.name)}</li>`).join("")}</ul>` : "";
	const pls = m.professional.length ? `<h2>专业牌照</h2><ul>${m.professional.map(p => `<li>${escHtml(p)}</li>`).join("")}</ul>` : "";
	return `<p><b>厂商代号</b>：${escHtml(m.id)}</p>${paras(m.description)}${frames}${pls}`;
}

async function importReference() {
	if (!game.user?.isGM) return ui.notifications.warn("只有 GM 能导入车卡器资料。");
	const items = game.packs.get("world.pilot-items");
	const mech = game.packs.get("world.mech-items");
	if (!items || !mech) return ui.notifications.warn("请先在 LANCER 内容包管理器中导入核心数据与中文内容包，再导入车卡器资料。");
	if (items.locked) return ui.notifications.warn("驾驶员物品合集包已锁定，请先解锁再导入。");
	const Item = CONFIG.Item.documentClass;
	const JournalEntry = CONFIG.JournalEntry.documentClass;

	// 1. 专业牌照
	const licenseFolder = items.folders.find(f => f.getFlag("lancer", "entrytype") === "license");
	const index = await items.getIndex({ fields: ["system.lid", "system.key", "type"] });
	const byLid = new Map(index.filter(e => e.system?.lid).map(e => [e.system.lid, e]));
	const creates = [];
	const updates = [];
	for (const pl of REFERENCE.professional) {
		const data = { name: pl.name, type: "license", system: { lid: `lic_${pl.id}`, key: pl.id, manufacturer: pl.maker, curr_rank: pl.rank }, flags: { [MODULE_ID]: { professional: true } } };
		const existing = byLid.get(data.system.lid);
		if (existing) updates.push({ _id: existing._id, ...data });
		else creates.push({ ...data, folder: licenseFolder?.id });
	}
	// 2. 骨架牌照改成骨架的中文名
	const frames = await mech.getIndex({ fields: ["system.lid", "type"] });
	const frameName = new Map(frames.filter(e => e.type === "frame").map(e => [e.system?.lid, e.name]));
	let renamed = 0;
	for (const e of index) {
		if (e.type !== "license" || REFERENCE.professional.some(p => p.id === e.system?.key)) continue;
		const zh = frameName.get(e.system?.key);
		if (zh && zh !== e.name && /[㐀-鿿]/.test(zh)) { updates.push({ _id: e._id, name: zh }); renamed++; }
	}
	await Item.createDocuments(creates, { pack: items.collection });
	await Item.updateDocuments(updates, { pack: items.collection });

	// 3. 日志：每次重新生成（内容由模组维护，手动修改会被覆盖）
	const CC = foundry.documents?.collections?.CompendiumCollection ?? globalThis.CompendiumCollection;
	let journals = game.packs.get(`world.${JOURNAL_PACK}`);
	if (!journals) journals = await CC.createCompendium({ type: "JournalEntry", label: "车卡器资料", name: JOURNAL_PACK, package: "world" });
	if (journals.locked) await journals.configure({ locked: false });
	const link = await linker();
	const old = await journals.getDocuments();
	const mine = old.filter(j => j.getFlag(MODULE_ID, "key"));
	if (mine.length) await JournalEntry.deleteDocuments(mine.map(j => j.id), { pack: journals.collection });
	await JournalEntry.createDocuments([
		{
			name: "专业牌照",
			flags: { [MODULE_ID]: { key: "professional" } },
			pages: [
				{ name: "规则说明", type: "text", text: { content: REFERENCE.rules.map(r => `<p>${escHtml(r)}</p>`).join("") } },
				...REFERENCE.professional.map(pl => ({ name: `${pl.name}（${pl.maker} ${ROMAN[pl.rank] || pl.rank}）`, type: "text", text: { content: professionalPage(pl, link) } })),
			],
		},
		{
			name: "扩展厂商",
			flags: { [MODULE_ID]: { key: "makers" } },
			pages: REFERENCE.makers.map(m => ({ name: `${m.name}（${m.id}）`, type: "text", text: { content: makerPage(m, link) } })),
		},
	], { pack: journals.collection });

	ui.notifications.info(`车卡器资料已导入：专业牌照 ${REFERENCE.professional.length} 张（新建 ${creates.length}），骨架牌照改名 ${renamed} 个，日志「车卡器资料」。`);
	return { created: creates.length, updated: updates.length, renamed };
}

// 设置菜单的按钮：Foundry 会 new 一个 type 再调用 render，这里直接弹出确认框
class ImportReferenceMenu {
	render() {
		const Dialog = foundry.applications.api.DialogV2;
		Dialog.confirm({
			window: { title: "导入车卡器资料" },
			content: "<p>在 LANCER 合集包中建立专业牌照、把骨架牌照改为中文名，并生成「车卡器资料」日志合集包（专业牌照、扩展厂商）。</p><p>请先导入中文内容包。可以重复运行；日志由模组重新生成。</p>",
		}).then(ok => ok && importReference()).catch(err => { console.error(err); ui.notifications.error(`导入车卡器资料失败：${err.message ?? err}`); });
		return this;
	}
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	game.settings.registerMenu(MODULE_ID, "importReference", {
		name: "车卡器资料",
		label: "导入车卡器资料",
		hint: "建立专业牌照条目、把骨架牌照改为中文名，并生成专业牌照与扩展厂商的说明日志。需先导入中文内容包。",
		icon: "fas fa-book",
		type: ImportReferenceMenu,
		restricted: true,
	});
});

// ---------------------------------------------------------------------------
// 掩护区：在地图上画一个区域（Region），加上「LANCER 掩护区」行为。
// 指示物进入区域时自动挂上「掩护 - 软性 / 硬性」状态，离开时去掉；同时处在多个掩护区时取最高的掩护。
// LANCER 系统的命中面板读取目标身上的这两个状态（cover_soft / cover_hard）计算 -1 / -2。
const COVER_TYPE = `${MODULE_ID}.cover`;
const COVER_STATUS = { soft: "cover_soft", hard: "cover_hard" };
const COVER_RANK = { none: 0, soft: 1, hard: 2 };

// 指示物当前所在的掩护区给出的掩护；exclude 是正在离开的区域，include 是正在进入的区域
function coverFor(tokenDoc, { exclude, include } = {}) {
	const regions = new Set(tokenDoc.regions ?? []);
	if (exclude) regions.delete(exclude);
	if (include) regions.add(include);
	let best = "none";
	for (const region of regions) {
		for (const b of region.behaviors ?? []) {
			if (b.type !== COVER_TYPE || b.disabled) continue;
			const c = b.system?.cover;
			if (COVER_RANK[c] > COVER_RANK[best]) best = c;
		}
	}
	return best;
}

async function applyCover(tokenDoc, cover) {
	const actor = tokenDoc?.actor;
	if (!actor?.toggleStatusEffect) return;
	for (const [kind, status] of Object.entries(COVER_STATUS)) {
		const want = kind === cover;
		if (actor.statuses?.has(status) !== want) await actor.toggleStatusEffect(status, { active: want });
	}
}

function defineCoverBehavior() {
	const Base = foundry.data?.regionBehaviors?.RegionBehaviorType;
	if (!Base) return null;
	const fields = foundry.data.fields;
	const E = CONST.REGION_EVENTS;
	// 事件会在每个客户端触发，只由引发事件的用户处理（移动指示物的玩家或 GM），避免重复更新
	const mine = event => event.user?.isSelf;
	return class CoverZoneBehavior extends Base {
		static defineSchema() {
			return {
				cover: new fields.StringField({
					required: true, initial: "soft", choices: { soft: "软性掩护（-1）", hard: "硬性掩护（-2）" },
					label: "掩护", hint: "区域内的指示物自动获得的掩护。导引武器、科技攻击与非投掷近战攻击按规则忽略掩护。",
				}),
			};
		}
		static events = {
			[E.TOKEN_ENTER]: async function (event) {
				if (!mine(event)) return;
				const token = event.data.token;
				await applyCover(token, coverFor(token, { include: this.region }));
			},
			[E.TOKEN_EXIT]: async function (event) {
				if (!mine(event)) return;
				const token = event.data.token;
				await applyCover(token, coverFor(token, { exclude: this.region }));
			},
			// 画好区域、启用或停用行为时，处理已经在区域里的指示物
			[E.BEHAVIOR_ACTIVATED]: async function (event) {
				if (!mine(event)) return;
				for (const token of this.region.tokens ?? []) await applyCover(token, coverFor(token, { include: this.region }));
			},
			[E.BEHAVIOR_DEACTIVATED]: async function (event) {
				if (!mine(event)) return;
				for (const token of this.region.tokens ?? []) await applyCover(token, coverFor(token, { exclude: this.region }));
			},
		};
	};
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer" || !CONFIG.RegionBehavior) return;
	const Behavior = defineCoverBehavior();
	if (!Behavior) return;
	CONFIG.RegionBehavior.dataModels[COVER_TYPE] = Behavior;
	if (CONFIG.RegionBehavior.typeIcons) CONFIG.RegionBehavior.typeIcons[COVER_TYPE] = "fa-solid fa-shield-halved";
});
// 行为类型的显示名：Foundry 按语言键 TYPES.RegionBehavior.lancer-cn.cover 查（按「.」逐层查找），
// 写进已载入的译文与英文后备译文，任何界面语言都显示中文名
const COVER_LABEL_KEY = `TYPES.RegionBehavior.${COVER_TYPE}`;
Hooks.once("i18nInit", () => {
	if (game.system?.id !== "lancer") return;
	for (const t of [game.i18n.translations, game.i18n._fallback]) if (t) foundry.utils.setProperty(t, COVER_LABEL_KEY, "LANCER 掩护区");
});

// ---------------------------------------------------------------------------
// 六边形墙体：GM 在「墙壁」工具栏选「六边形墙体」，点击格子放置一整格的墙体，再点一次移除，按住拖动可连续放置。
// 每格墙体 = 沿格子边缘的 6 段阻挡移动的墙 + 一个所有人可见的实心六边形图形（Foundry 的墙对玩家不可见，图形告诉玩家此处不可通过）。
// 默认不阻挡视线；模组设置「六边形墙体阻挡视线」可打开。墙体只阻挡移动，掩护按需手动设置或用掩护区。
const HEX_TOOL = "lancerHexWall";
const HEX_FLAG = "hexWall";

const hexKey = offset => `${offset.i},${offset.j}`;

// 一格墙体的文档数据：walls（每条边一段）与 drawing（实心多边形，坐标相对左上角）
function hexWallData(rawVertices, key, { blockSight = false } = {}) {
	const vertices = rawVertices.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));
	const NONE = CONST.WALL_SENSE_TYPES?.NONE ?? 0;
	const NORMAL = CONST.WALL_SENSE_TYPES?.NORMAL ?? 20;
	const MOVE = CONST.WALL_MOVEMENT_TYPES?.NORMAL ?? 20;
	const flags = { [MODULE_ID]: { [HEX_FLAG]: key } };
	const walls = vertices.map((p, i) => {
		const q = vertices[(i + 1) % vertices.length];
		return { c: [p.x, p.y, q.x, q.y].map(Math.round), move: MOVE, sight: blockSight ? NORMAL : NONE, light: blockSight ? NORMAL : NONE, sound: NONE, flags };
	});
	const xs = vertices.map(p => p.x), ys = vertices.map(p => p.y);
	const x = Math.min(...xs), y = Math.min(...ys);
	const drawing = {
		x, y, locked: true, flags,
		shape: { type: "p", width: Math.max(...xs) - x, height: Math.max(...ys) - y, points: vertices.flatMap(p => [Math.round(p.x - x), Math.round(p.y - y)]) },
		fillType: CONST.DRAWING_FILL_TYPES?.SOLID ?? 1, fillColor: "#2b2b2b", fillAlpha: 0.85,
		strokeColor: "#000000", strokeWidth: 4, strokeAlpha: 1,
	};
	return { walls, drawing };
}

const hexDocs = (scene, key) => ({
	walls: scene.walls.filter(w => w.getFlag?.(MODULE_ID, HEX_FLAG) === key),
	drawings: scene.drawings.filter(d => d.getFlag?.(MODULE_ID, HEX_FLAG) === key),
});

// 在某个画布坐标所在的格子放置（mode = "add"）或移除（"remove"）墙体；返回实际做了什么
async function setHexWall(scene, grid, point, mode) {
	const offset = grid.getOffset(point);
	const key = hexKey(offset);
	const existing = hexDocs(scene, key);
	const has = existing.walls.length > 0 || existing.drawings.length > 0;
	if (mode === "remove") {
		if (!has) return null;
		if (existing.walls.length) await scene.deleteEmbeddedDocuments("Wall", existing.walls.map(w => w.id));
		if (existing.drawings.length) await scene.deleteEmbeddedDocuments("Drawing", existing.drawings.map(d => d.id));
		return "remove";
	}
	if (has) return null;
	const { walls, drawing } = hexWallData(grid.getVertices(offset), key, { blockSight: !!game.settings.get(MODULE_ID, "hexWallBlocksSight") });
	await scene.createEmbeddedDocuments("Drawing", [drawing]);
	await scene.createEmbeddedDocuments("Wall", walls);
	return "add";
}

// ---------------------------------------------------------------------------
// 掩护格：Foundry 的区域工具在六角网格上画不出整格的六边形。「区域」工具栏的「软性掩护格 / 硬性掩护格」
// 点击格子把这一格加进本场景的软性 / 硬性掩护区（一个带「LANCER 掩护区」行为的区域，所有人可见），再点移除。
const COVER_CELL_FLAG = "coverCells";
const COVER_CELL_STYLE = {
	soft: { name: "软性掩护格", color: "#3b82c4" },
	hard: { name: "硬性掩护格", color: "#c4703b" },
};
const cellPoints = vertices => vertices.flatMap(p => [Math.round(p.x), Math.round(p.y)]);
const samePoints = (a, b) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= 1);
const shapeData = s => (typeof s?.toObject === "function" ? s.toObject() : { ...s });
const coverRegionOf = (scene, cover) => scene.regions.find(r => r.getFlag?.(MODULE_ID, COVER_CELL_FLAG) === cover);

function coverCellHas(scene, grid, point, cover) {
	const pts = cellPoints(grid.getVertices(grid.getOffset(point)));
	const region = coverRegionOf(scene, cover);
	return !!region?.shapes?.some(s => s.type === "polygon" && samePoints(Array.from(s.points), pts));
}

async function setCoverCell(scene, grid, point, cover, mode) {
	const pts = cellPoints(grid.getVertices(grid.getOffset(point)));
	const region = coverRegionOf(scene, cover);
	const shapes = (region?.shapes ?? []).map(shapeData);
	const idx = shapes.findIndex(s => s.type === "polygon" && samePoints(Array.from(s.points), pts));
	if (mode === "remove") {
		if (idx < 0) return null;
		shapes.splice(idx, 1);
		if (shapes.length) await region.update({ shapes });
		else await scene.deleteEmbeddedDocuments("Region", [region.id]);
		return "remove";
	}
	if (idx >= 0) return null;
	const shape = { type: "polygon", points: pts, hole: false };
	if (region) await region.update({ shapes: [...shapes, shape] });
	else {
		const style = COVER_CELL_STYLE[cover];
		await scene.createEmbeddedDocuments("Region", [{
			name: style.name, color: style.color, shapes: [shape],
			visibility: CONST.REGION_VISIBILITY?.ALWAYS ?? 2,
			flags: { [MODULE_ID]: { [COVER_CELL_FLAG]: cover } },
			behaviors: [{ name: "LANCER 掩护区", type: COVER_TYPE, system: { cover } }],
		}]);
	}
	return "add";
}

// ---------------------------------------------------------------------------
// 按格子涂画的工具：工具启用时拦截画布左键（不让图层开始画墙 / 画区域），按下时所在格子决定放置还是移除，拖动时对经过的格子做同样的事
const PAINT_TOOLS = {
	[HEX_TOOL]: {
		control: "walls", label: "六边形墙体",
		has: (scene, grid, point) => hexDocs(scene, hexKey(grid.getOffset(point))).walls.length > 0,
		apply: (scene, grid, point, mode) => setHexWall(scene, grid, point, mode),
		tool: { title: "六边形墙体：点击格子放置一整格不可通过的墙体，再点移除；按住拖动可连续放置", icon: "fa-solid fa-draw-polygon" },
	},
	lancerCoverSoft: {
		control: "regions", label: "软性掩护格",
		has: (scene, grid, point) => coverCellHas(scene, grid, point, "soft"),
		apply: (scene, grid, point, mode) => setCoverCell(scene, grid, point, "soft", mode),
		tool: { title: "软性掩护格：点击格子加入软性掩护区（进入的指示物获得软性掩护），再点移除；按住拖动可连续操作", icon: "fa-solid fa-shield-halved" },
	},
	lancerCoverHard: {
		control: "regions", label: "硬性掩护格",
		has: (scene, grid, point) => coverCellHas(scene, grid, point, "hard"),
		apply: (scene, grid, point, mode) => setCoverCell(scene, grid, point, "hard", mode),
		tool: { title: "硬性掩护格：点击格子加入硬性掩护区（进入的指示物获得硬性掩护），再点移除；按住拖动可连续操作", icon: "fa-solid fa-shield" },
	},
};

function activePaintTool() {
	const c = ui.controls;
	const control = c?.control?.name ?? c?.activeControl;
	const tool = c?.tool?.name ?? c?.activeTool;
	const def = PAINT_TOOLS[tool];
	return def && def.control === control ? def : null;
}

let hexPaint = null;
function onHexPointer(event) {
	const def = game.user?.isGM && canvas?.scene ? activePaintTool() : null;
	if (!def) return;
	if (event.type === "pointerdown" && event.button !== 0) return;
	// 松开左键（包括在画布外松开）后不再连续操作
	if (event.type === "pointerup" || (event.type === "pointermove" && !(event.buttons & 1))) { hexPaint = null; return; }
	event.stopImmediatePropagation();
	event.preventDefault();
	if (canvas.grid.isGridless) { if (event.type === "pointerdown") ui.notifications.warn(`无网格的场景不能使用「${def.label}」。`); return; }
	const point = canvas.canvasCoordinatesFromClient({ x: event.clientX, y: event.clientY });
	const key = hexKey(canvas.grid.getOffset(point));
	if (event.type === "pointerdown") {
		hexPaint = { def, mode: def.has(canvas.scene, canvas.grid, point) ? "remove" : "add", done: new Set([key]), queue: Promise.resolve() };
	} else if (!hexPaint || hexPaint.def !== def || hexPaint.done.has(key)) return;
	else hexPaint.done.add(key);
	// 依次执行：同一区域的连续更新不能并发，否则后一次会覆盖前一次的形状
	const { mode } = hexPaint;
	hexPaint.queue = hexPaint.queue.then(() => def.apply(canvas.scene, canvas.grid, point, mode)).catch(err => console.error(`${MODULE_ID} |`, err));
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	game.settings.register(MODULE_ID, "hexWallBlocksSight", {
		name: "六边形墙体阻挡视线",
		hint: "开启后，新放置的六边形墙体除了阻挡移动，也阻挡视线与光照。已放置的墙体不受影响。",
		scope: "world", config: true, type: Boolean, default: false,
	});
});

Hooks.on("getSceneControlButtons", controls => {
	if (game.system?.id !== "lancer" || !game.user?.isGM) return;
	for (const [name, def] of Object.entries(PAINT_TOOLS)) {
		const group = controls?.[def.control];
		if (!group?.tools) continue;
		group.tools[name] = { name, ...def.tool, order: Object.keys(group.tools).length };
	}
});

Hooks.once("canvasReady", () => {
	const view = canvas.app?.canvas ?? canvas.app?.view;
	if (!view) return;
	for (const type of ["pointerdown", "pointermove", "pointerup"]) view.addEventListener(type, onHexPointer, { capture: true });
});

// ---------------------------------------------------------------------------
// 命中后一键施加状态：攻击 / 科技攻击的聊天卡下方，按攻击所用物品的命中效果文字列出可施加的状态按钮，
// 点击后施加到这次被命中（含会心一击）的目标；聊天卡没有目标时用当前选中的目标。
// LANCER 系统本身不会施加命中效果里的状态（其代码中为 TODO）。是否满足豁免等条件由玩家与 GM 判断。
// 没有目标角色权限时（玩家打 GM 的 NPC），通过模组 socket 请在线的 GM 施加。
const STATUS_WORDS = [
	["固定", "immobilized"], ["受损", "impaired"], ["受扰", "jammed"], ["锁定", "lockon"], ["离散", "shredded"],
	["缓慢", "slow"], ["晕眩", "stunned"], ["暴露", "exposed"], ["伏卧", "prone"],
	["Immobilized", "immobilized"], ["Impaired", "impaired"], ["Jammed", "jammed"], ["Lock On", "lockon"], ["Shredded", "shredded"],
	["Slowed", "slow"], ["Stunned", "stunned"], ["Exposed", "exposed"], ["Prone", "prone"],
];
const STATUS_LABEL = { immobilized: "固定", impaired: "受损", jammed: "受扰", lockon: "锁定", shredded: "离散", slow: "缓慢", stunned: "晕眩", exposed: "暴露", prone: "伏卧" };
// 不是施加给目标的写法：
// - 消耗 / 移除锁定、免疫缓慢、无法……
// - 作为条件：「若目标被锁定」「攻击处于伏卧的角色」「具有锁定」
// - 给自己：「你陷入缓慢」「你会缓慢」
// - 列举状况：「伏卧、固定或晕眩」
// - 「可以在受扰下使用」「锁定该武器」「被锁定的所有敌方角色」
const STATUS_NOT_BEFORE = [
	/(消耗|移除|清除|解除|结束|免疫|不会|不能|无法|不再|失去|具有|处于|对)\S{0,2}$/,
	/(若|如果)[^，。；]{0,3}被?$/,
	/你(会|将|也)?(陷入|变得)?$/,
	/[、或]$/,
	/(consume|remove|clear|immune|against|while)\s*\S{0,6}$/i,
];
const STATUS_NOT_AFTER = /^(该武器|这把武器|武器|模式|状态的|的|、|或|角色|目标时|下|时(也|仍)?可?以?使用|时也)/;
// 武器效果说明里，只看与命中、豁免或目标有关的句子（其余多是武器本身的规则）
const TARGET_SENTENCE = /(命中|会心|豁免|目标|hit|crit|save|target)/i;

function statusesIn(text, { strict = false } = {}) {
	const plain = String(text || "").replace(/<[^>]+>/g, "");
	// 针对「攻击者」的句子（如未命中你的攻击者伏卧）不是给这次攻击的目标的
	const sentences = strict ? plain.split(/[。；;\n]/).filter(s => TARGET_SENTENCE.test(s) && !/攻击者|attacker/i.test(s)) : [plain];
	const found = [];
	for (const sentence of sentences) for (const [word, id] of STATUS_WORDS) {
		if (found.includes(id)) continue;
		let i = sentence.indexOf(word);
		while (i >= 0) {
			const before = sentence.slice(Math.max(0, i - 6), i), after = sentence.slice(i + word.length, i + word.length + 4);
			// 「锁定」也常作动词或描述（「扫描目标锁定」「当锁定时」），只认「被 / 施加 / 进行 / 获得锁定」
			const lockOk = id !== "lockon" || /(被|施加|进行|获得|陷入|Lock On)\s*$/i.test(before + (word === "Lock On" ? word : ""));
			if (lockOk && !STATUS_NOT_BEFORE.some(re => re.test(before)) && !STATUS_NOT_AFTER.test(after)) { found.push(id); break; }
			i = sentence.indexOf(word, i + word.length);
		}
	}
	return found;
}

// 攻击所用物品的效果文字：命中 / 会心效果整段都看；一般效果说明只看与命中、豁免、目标有关的句子
function attackTexts(item) {
	const s = item?.system;
	if (!s) return [];
	const profile = s.active_profile ?? s.profiles?.[s.selected_profile_index ?? 0];
	const out = [];
	for (const o of [profile, s]) {
		for (const f of ["on_hit", "on_crit"]) if (o?.[f]) out.push({ text: o[f], strict: false });
		for (const f of ["effect", "on_attack"]) if (o?.[f]) out.push({ text: o[f], strict: true });
	}
	for (const a of s.actions ?? []) if (a.detail) out.push({ text: a.detail, strict: true });
	return out.filter(t => typeof t.text === "string" && t.text.trim());
}

async function applyStatusTo(tokenUuid, status) {
	const token = fromUuidSync(tokenUuid);
	const actor = token?.actor;
	if (!actor) return false;
	if (actor.isOwner) {
		if (!actor.statuses?.has(status)) await actor.toggleStatusEffect(status, { active: true });
		return true;
	}
	if (!game.users?.activeGM) { ui.notifications.warn("没有在线的 GM，无法对不属于你的角色施加状态。"); return false; }
	game.socket.emit(`module.${MODULE_ID}`, { action: "applyStatus", uuid: tokenUuid, status });
	return true;
}

function statusButtonsHTML(statuses) {
	const btn = id => `<button type="button" data-lancer-cn-status="${id}" style="flex:0 0 auto;width:auto;line-height:1.6;padding:0 .6em;margin:0">${STATUS_LABEL[id]}</button>`;
	return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)"><span>命中效果 · 施加：</span>${statuses.map(btn).join("")}</div>`;
}

function onRenderChatMessage(message, html) {
	const root = html instanceof HTMLElement ? html : html?.[0];
	if (!root || root.querySelector(".lancer-cn-status-row")) return;
	const attack = message.getFlag?.("lancer", "attackData");
	if (!attack) return;
	if (!(game.user?.isGM || message.isAuthor)) return;
	const item = attack.attackerItemUuid ? fromUuidSync(attack.attackerItemUuid) : null;
	const statuses = [];
	for (const t of attackTexts(item)) for (const id of statusesIn(t.text, { strict: t.strict })) if (!statuses.includes(id)) statuses.push(id);
	if (!statuses.length) return;
	const content = root.querySelector(".message-content") ?? root;
	content.insertAdjacentHTML("beforeend", statusButtonsHTML(statuses));
	content.querySelector(".lancer-cn-status-row").addEventListener("click", async ev => {
		const status = ev.target.closest?.("[data-lancer-cn-status]")?.dataset.lancerCnStatus;
		if (!status) return;
		const hit = (attack.targets ?? []).filter(t => t.hit || t.crit).map(t => t.uuid);
		const uuids = attack.targets?.length ? hit : [...(game.user?.targets ?? [])].map(t => t.document.uuid);
		if (!uuids.length) return ui.notifications.warn(attack.targets?.length ? "这次攻击没有命中任何目标。" : "请先选中要施加状态的目标。");
		let n = 0;
		for (const uuid of uuids) if (await applyStatusTo(uuid, status)) n++;
		if (n) ui.notifications.info(`已对 ${n} 个目标施加「${STATUS_LABEL[status]}」。`);
	});
}

Hooks.on("renderChatMessageHTML", onRenderChatMessage);
Hooks.once("ready", () => {
	if (game.system?.id !== "lancer") return;
	game.socket?.on(`module.${MODULE_ID}`, async msg => {
		if (msg?.action !== "applyStatus" || !game.users?.activeGM?.isSelf || !STATUS_LABEL[msg.status]) return;
		const actor = fromUuidSync(msg.uuid)?.actor;
		if (actor && !actor.statuses?.has(msg.status)) await actor.toggleStatusEffect(msg.status, { active: true });
	});
});

globalThis.LancerCN = { translate, walk, importReference, REFERENCE, coverFor, applyCover, defineCoverBehavior, hexWallData, setHexWall, setCoverCell, coverCellHas, PAINT_TOOLS, statusesIn, attackTexts, onRenderChatMessage };

// 只在界面语言为中文（cn）时启用；语言要在 i18nInit 之后才确定
Hooks.once("i18nInit", () => {
	if (game.system?.id !== "lancer" || game.i18n?.lang !== "cn") return;
	patchScrollingText();
	walk(document.body);
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
		attributes: true,
		attributeFilter: ATTRS,
	});
});
