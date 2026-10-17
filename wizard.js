"use strict";
// 引导式车卡：按规则站第一章「创造驾驶员」「创造机甲」的顺序，一步步带玩家完成角色。
// 依赖 app.js 里的数据与面板函数（pilotParts / progressParts / mechParts 等），只在运行时调用。

const sumOf = o => Object.values(o).reduce((a, b) => a + (+b || 0), 0);
const tip = (html, cls = "") => `<div class="wiz-tip ${cls}">${html}</div>`;

// 背景的「触发例子」→ 触发 id
function bgSuggestedSkills(p) {
	const bg = BGS[p.background];
	const z = bg && Z.bg[bg.name.toLowerCase()];
	if (!z) return [];
	const names = z.triggers.replace(/^[^：:]*[：:]/, "").split(/[、,，]/).map(s => s.trim()).filter(Boolean);
	return names.map(n => D.skills.find(s => zhOf("skill", s) === n)).filter(Boolean);
}

const WIZ_STEPS = [
	{
		id: "intro", title: "开始之前",
		body: () => `
			<p>《Lancer》的角色由两部分组成：<b>驾驶员</b>（你扮演的人）和<b>机甲</b>（驾驶员开的机器）。这个引导会按规则书的顺序，一步一步带你做完一张能上桌的角色卡。</p>
			<div class="wiz-flow">
				<div><b>驾驶员</b><span>等级 → 资料 → 背景 → 触发 → 机甲能力 → 天赋 → 牌照/核心加成 → 装备</span></div>
				<div><b>机甲</b><span>选择骨架 → 安装武器与系统</span></div>
			</div>
			${tip("<b>没有金钱，只有牌照。</b>你能用什么机甲和装备，取决于你的<b>牌照等级（LL）</b>。每完成一次任务，LL 就会 +1，角色随之变强。")}
			${tip("每一步右侧都会显示「这一步还差什么」。不确定的地方可以先跳过，最后一步会帮你总检查。随时可以点「切换到自定义模式」直接用完整编辑器。", "muted")}`,
	},
	{
		id: "ll", title: "起始等级",
		check: () => [],
		body: p => {
			const L = LV(p.ll);
			return `
			<p>新玩家通常从 <b>LL0</b> 开始，完成第一个任务后升到 LL1。如果 GM 让你们从更高等级开始，在这里调高即可——后面的步骤会自动给你对应的点数。</p>
			<div class="row" style="margin:12px 0"><b>起始牌照等级：</b>${stepper("ll", "", p.ll, 0, 12, v => "LL" + v)}</div>
			<div class="wiz-gets">
				<div><b>${L.triggers / 2}</b><span>次「+2 触发」<small>合计 +${L.triggers}</small></span></div>
				<div><b>${L.skills}</b><span>机甲能力点</span></div>
				<div><b>${L.talents}</b><span>天赋等级</span></div>
				<div><b>${L.licenses}</b><span>牌照等级</span></div>
				<div><b>${L.cbs}</b><span>核心加成</span></div>
				<div><b>+${L.grit}</b><span>毅力 Grit</span></div>
			</div>
			${tip("<b>毅力（Grit）</b>＝LL÷2（进位）。它会加到机甲的 HP、SP、攻击判定和豁免目标上，也会让驾驶员 HP 变成 6＋毅力。")}
			${progressParts(p).levels}`;
		},
	},
	{
		id: "basic", title: "基本资料",
		check: p => (p.name && p.name !== "新驾驶员" ? [] : ["给你的驾驶员起个名字"]),
		body: p => `
			<p>先给驾驶员一个名字。<b>呼号</b>是驾驶员在无线电里的代号，很多枪骑兵更常被人叫呼号而不是真名。</p>
			<div class="card">
				<div class="row"><label>名字</label><input type="text" data-k="name" value="${esc(p.name === "新驾驶员" ? "" : p.name)}" placeholder="例如：织田太郎"></div>
				<div class="row"><label>呼号</label><input type="text" data-k="callsign" value="${esc(p.callsign)}" placeholder="例如：雷神"></div>
				<div class="row"><label>玩家</label><input type="text" data-k="player" value="${esc(p.player)}"></div>
			</div>`,
	},
	{
		id: "bg", title: "背景",
		check: p => (p.background || p.bgCustom ? [] : ["选择或自创一个背景"]),
		body: p => {
			const bg = BGS[p.background];
			const z = bg && Z.bg[bg.name.toLowerCase()];
			return `
			<p><b>背景</b>描述驾驶员成为枪骑兵之前的人生。它不限制你现在的样子，但能帮你和 GM 想象坐在机甲里的是什么人。</p>
			${tip("<b>规则作用：</b>在战斗以外，与背景相关的技能判定可以得到 +1 准度（GM 也可能让它带来 +1 难度）。每个背景还附带几个「触发例子」，下一步会用到。")}
			<div class="row"><button data-act="rollBg">🎲 掷 1d20 随机</button>
				<span class="muted">或点下面的卡片，也可以</span>
				<input type="text" style="max-width:240px" data-k="bgCustom" placeholder="自创背景名称" value="${esc(p.bgCustom)}" ${p.background ? "disabled" : ""}>
				${p.background ? `<button data-wiz="bgClear">改为自创</button>` : ""}</div>
			<div class="pick-grid">${D.backgrounds.map((b, i) => {
				const bz = Z.bg[b.name.toLowerCase()];
				return `<div class="pick ${b.id === p.background ? "on" : ""}" data-wiz="bg" data-arg="${b.id}"><b>${i + 1}. ${esc(bz ? bz.name : b.name)}</b><span>${esc(bz ? bz.triggers.replace(/^[^：:]*[：:]/, "") : "")}</span></div>`;
			}).join("")}</div>
			${z ? `<div class="card"><h3>${esc(z.name)}</h3><div class="desc">${z.html}</div></div>` : ""}
			<h4>外貌 / 经历（可选）</h4><textarea data-k="bio" placeholder="简单写写这个驾驶员的故事">${esc(p.bio)}</textarea>`;
		},
	},
	{
		id: "triggers", title: "触发",
		check: p => {
			const L = LV(p.ll), out = [];
			const sum = p.triggers.reduce((s, t) => s + (+t.val || 0), 0);
			if (sum !== L.triggers) out.push(`触发合计应为 +${L.triggers}（现在 +${sum}）`);
			if (p.triggers.some(t => !t.id && !t.custom)) out.push("有空白的触发");
			const ids = p.triggers.map(t => t.id || t.custom).filter(Boolean);
			if (new Set(ids).size !== ids.length) out.push("有重复的触发");
			return out;
		},
		body: p => {
			const L = LV(p.ll);
			const sug = bgSuggestedSkills(p);
			const have = new Set(p.triggers.map(t => t.id));
			return `
			<p><b>触发（Trigger）</b>是驾驶员擅长的事，像「打脸」「快速到达某地」。当你在故事中做的事符合某个触发，技能判定就加上它的数值（+2、+4 或 +6）。一次判定只能用一个触发。</p>
			${tip(`LL0 选 <b>四个 +2 触发</b>。${p.ll ? `你是 LL${p.ll}，另外还有 <b>${p.ll} 次</b>「让一个触发 +2 或新增一个 +2 触发」，单项最高 +6。合计应为 <b>+${L.triggers}</b>。` : ""}`)}
			${tip("触发只用于驾驶员本人的行动和技能判定；用机甲做事时改用下一步的「机甲能力」。GM 同意的话，也可以自订更具体的触发（例如「冷血杀人」）。", "muted")}
			${sug.length ? `<div class="row"><b>你的背景推荐：</b>${sug.map(s => `<button data-wiz="chip" data-arg="${s.id}" ${have.has(s.id) ? "disabled" : ""}>＋ ${esc(zhOf("skill", s))}</button>`).join("")}</div>` : ""}
			${pilotParts(p).triggers}`;
		},
	},
	{
		id: "hase", title: "机甲能力",
		check: p => {
			const L = LV(p.ll), s = sumOf(p.hase);
			return s === L.skills ? [] : [`机甲能力点应为 ${L.skills}（现在 ${s}）`];
		},
		body: p => {
			const st = mechStats(p, { frame: EVEREST, systems: [], loadout: {} });
			return `
			<p><b>机甲能力（HASE）</b>代表驾驶员建造和驾驶机甲的本事。它们会直接加到你机甲的数值上，也用于机甲的技能判定和豁免。</p>
			${tip(`LL0 有 <b>2 点</b>（一项 +2 或两项各 +1），之后每级 +1，单项最高 +6。${p.ll ? `你现在共有 <b>${LV(p.ll).skills}</b> 点。` : ""}`)}
			<div class="grid">${progressParts(p).hase}
				<div class="card"><h3>以埃佛勒斯为例 <span class="muted">右边数字会随你的分配变化</span></h3>
					<div class="stats">
						<div class="stat hl"><b>${st.hp}</b><span>HP（机体）</span></div>
						<div class="stat"><b>${st.repcap}</b><span>维修上限（机体）</span></div>
						<div class="stat hl"><b>${st.evasion}</b><span>回避（敏捷）</span></div>
						<div class="stat"><b>${st.speed}</b><span>速度（敏捷）</span></div>
						<div class="stat hl"><b>${st.edef}</b><span>电子防御（系统）</span></div>
						<div class="stat"><b>${st.sp}</b><span>SP（系统）</span></div>
						<div class="stat hl"><b>${st.heatcap}</b><span>热度上限（工程）</span></div>
						<div class="stat"><b>+${st.limited}</b><span>受限次数（工程）</span></div>
					</div>
					<p class="muted">想要耐打选机体，想要难以命中选敏捷，想用电子战和更多系统选系统，想多承受热度、多用受限装备选工程。</p>
				</div></div>`;
		},
	},
	{
		id: "talents", title: "天赋",
		check: p => {
			const L = LV(p.ll), s = sumOf(p.talents);
			return s === L.talents ? [] : [`天赋等级合计应为 ${L.talents}（现在 ${s}）`];
		},
		body: p => `
			<p><b>天赋</b>是驾驶员独特的技巧，让你在某种武器、系统或打法上特别出色。每个天赋分 I、II、III 三级，必须依次取得。</p>
			${tip(`LL0 选 <b>三个一级天赋</b>；之后每级可以让一个天赋升一级，或取得一个新的一级天赋。你共有 <b>${LV(p.ll).talents}</b> 级可分配。`)}
			${tip("不知道选什么？先看每个天赋下面的一句话简介，挑和你想玩的机甲风格相符的（例如用大炮选「攻城专家」、想飞选「王牌」、当队长选「领袖」），点「天赋详情」看完整效果。", "muted")}
			${progressParts(p).talents}`,
	},
	{
		id: "licenses", title: "牌照", show: p => p.ll > 0,
		check: p => {
			const L = LV(p.ll), s = sumOf(p.licenses);
			return s === L.licenses ? [] : [`牌照等级合计应为 ${L.licenses}（现在 ${s}）`];
		},
		body: p => `
			<p><b>牌照</b>决定你能用哪些机甲和装备。每一部授权骨架都有自己的牌照，分 I、II、III 级，必须依次取得：</p>
			<ul class="wiz-list"><li><b>I 级</b>：解锁这牌照的第一批武器和系统。</li><li><b>II 级</b>：解锁<b>骨架本身</b>和更多装备。</li><li><b>III 级</b>：解锁最强的装备。</li></ul>
			${tip(`你每有 1 级 LL 就有 1 牌照等级，共 <b>${LV(p.ll).licenses}</b> 级。GMS（埃佛勒斯和 GMS 装备）永远免费可用。`)}
			${tip("装备可以混搭：解锁后，任何牌照的武器和系统都能装在任何骨架上。想开某部骨架，就把它的牌照升到 II。同一厂商的牌照合计每满 3 级，才能选该厂商的一个核心加成。", "muted")}
			${progressParts(p).licenses}`,
	},
	{
		id: "cbs", title: "核心加成", show: p => LV(p.ll).cbs > 0,
		check: p => {
			const L = LV(p.ll), out = [];
			if (p.coreBonuses.length !== L.cbs) out.push(`核心加成应为 ${L.cbs} 个（现在 ${p.coreBonuses.length}）`);
			return out.concat(checks(p).filter(c => c[1].includes("核心加成") && c[1].includes("需要")).map(c => c[1]));
		},
		body: p => `
			<p><b>核心加成</b>是对你所有机甲都有效的永久改造。每 3 级 LL（3、6、9、12）可以选一个。</p>
			${tip("GMS 的核心加成随时可选；其他厂商的每个核心加成，需要你在该厂商的牌照合计达到 3 级（第二个要 6 级，依此类推）。不符合条件的会显示为灰色。")}
			${progressParts(p).cbs}`,
	},
	{
		id: "gear", title: "驾驶员装备",
		check: p => (p.gear.armor ? [] : ["（可选）通常会给驾驶员一套卫士服"]),
		soft: true,
		body: p => {
			const ps = pilotStats(p);
			return `
			<p>驾驶员离开机甲时也需要保护自己。出任务前可以带：<b>一套装甲（卫士服）</b>、<b>最多两件武器</b>、<b>最多三件其他装备</b>。</p>
			${tip(`驾驶员基本数值：HP 6＋毅力、回避 10、电子防御 10、速度 4、大小 ½。卫士服会改变这些数值。目前：<b>HP ${ps.hp}、装甲 ${ps.armor}、回避 ${ps.evasion}、电子防御 ${ps.edef}、速度 ${ps.speed}</b>。`)}
			${tip("新手推荐：「轻型卫士服」（+3 HP 不影响行动）或「突击卫士服」（多 1 装甲），一件招牌武器，再加止血贴之类的实用装备。", "muted")}
			${pilotParts(p).gear}`;
		},
	},
	{
		id: "frame", title: "选择骨架",
		check: p => {
			const m = M(), f = FRAMES[m.frame];
			return f && frameAvailable(p, f) ? [] : ["选择一部你有牌照的骨架"];
		},
		body: p => {
			const m = M();
			const avail = D.frames.filter(f => frameAvailable(p, f));
			const card = f => {
				const s = f.stats, ok = frameAvailable(p, f);
				return `<div class="pick frame ${f.id === m.frame ? "on" : ""} ${ok ? "" : "locked"}" ${ok ? `data-wiz="frame" data-arg="${f.id}"` : ""}>
					<b>${esc(zhOf("frame", f) || f.name)} <small>${esc(f.source)} · ${f.mechtype.map(r => T.role[r] || r).join("/")}</small></b>
					<span>HP ${s.hp} · 装甲 ${s.armor} · 回避 ${s.evasion} · 电子防御 ${s.edef} · 速度 ${s.speed} · SP ${s.sp} · 大小 ${s.size === 0.5 ? "½" : s.size}</span>
					<span>挂载点：${f.mounts.map(x => T.mount[x]).join("、")}</span>
					<span>特性：${f.traits.map(t => esc(t.name)).join("、")}</span>
					${ok ? "" : `<span class="muted">需要 ${esc(zhOf("frame", f))} 牌照 II</span>`}
				</div>`;
			};
			const f = FRAMES[m.frame];
			return `
			<p><b>骨架</b>是机甲的基础，决定它的大小、基本数值、<b>挂载点</b>（能装几件什么尺寸的武器）、<b>SP</b>（能装多少系统），以及独有的<b>特性</b>和每任务通常只能用一次的<b>核心系统</b>。</p>
			${tip(p.ll ? "下面列出你牌照 II 级以上的骨架，以及所有人都能用的埃佛勒斯。" : "LL0 只能使用 GMS 的埃佛勒斯——一部没有短板的万用机甲。升级后拿到牌照 II，就能换开其他骨架。")}
			<div class="row"><label>机甲名称</label><input type="text" data-k="mech.name" value="${esc(m.name === "新机甲" ? "" : m.name)}" placeholder="例如：雷神"></div>
			<div class="pick-grid">${avail.map(card).join("")}</div>
			${f ? `<div class="card"><h3>${esc(zhOf("frame", f))} 的特性与核心系统</h3>${mechParts(p).info.replace(/^[\s\S]*?<h4>骨架特性<\/h4>/, "<div>")}</div>` : ""}
			${avail.length < D.frames.length ? det("lockedFrames", `查看尚未解锁的骨架（${D.frames.length - avail.length} 部）`, `<div class="pick-grid">${D.frames.filter(x => !frameAvailable(p, x)).map(card).join("")}</div>`) : ""}`;
		},
	},
	{
		id: "loadout", title: "武器与系统",
		check: p => {
			const m = M(), out = [];
			if (!equippedWeapons(p, m).length) out.push("至少装一件武器");
			const st = mechStats(p, m);
			if (st && st.spUsed > st.sp) out.push(`SP 超出（${st.spUsed}/${st.sp}）`);
			return out.concat(checks(p).filter(c => c[1].includes("超重型") || c[1].includes("独特") || c[1].includes("未解锁")).map(c => c[1]));
		},
		body: p => {
			const x = mechParts(p);
			if (x.only) return "<p>请先回上一步选择骨架。</p>";
			return `
			<p>最后给机甲装上武器和系统。</p>
			<ul class="wiz-list">
				<li><b>武器</b>装在挂载点上：<b>主</b>挂载点装一件主或副武器；<b>重型</b>挂载点装一件重型、主或副武器；<b>灵活</b>挂载点装一件主武器或两件副武器；<b>主/副</b>装一主一副或两副；<b>副/副</b>装两件副武器。<b>超重型</b>武器要占用一个重型挂载点＋另一个挂载点。</li>
				<li><b>系统</b>用 <b>SP</b> 安装（骨架 SP＋毅力＋每两点系统值 +1），装多少都行，只要 SP 够。部分武器和改装也要 SP。</li>
				<li>除了标有「独特」的装备，同一件武器或系统可以重复选。下拉列表里只会出现你已解锁的装备。</li>
			</ul>
			${tip(p.ll ? "提示：先选武器再用剩余 SP 装系统。武器下方的「武器效果」可以展开看完整规则。" : "LL0 推荐（规则书范例）：重型挂载点装<b>反物资步枪</b>、主挂载点装<b>突击步枪</b>、灵活挂载点装两把<b>战术匕首</b>；系统选 B型毒咒炸弹、快速喷射跳跃系统、三式投射护盾（各 2 SP）。", "muted")}
			<div class="grid">${x.stats}${x.weapons}${x.systems}</div>`;
		},
	},
	{
		id: "review", title: "完成",
		check: p => checks(p).map(c => c[1]),
		body: p => {
			const cs = checks(p);
			return `
			<p>${cs.length ? "差一点就完成了！下面还有几项没对上规则，可以点左边的步骤回去修改，也可以先完成、之后在编辑器里再调整。" : "🎉 恭喜，你的角色已经完全符合规则，可以上桌了！"}</p>
			${cs.length ? `<ul class="warn-list">${cs.map(([lv, t]) => `<li class="${lv}">${esc(t)}</li>`).join("")}</ul>` : ""}
			${tip("<b>之后升级时：</b>每完成一个任务 LL+1，并得到：一次 +2 触发、一点机甲能力、一级天赋、一级牌照；每 3 级再得一个核心加成。升级时还可以把一个天赋或一个牌照的全部等级重新分配，或换掉一个核心加成。")}
			<div class="row" style="margin:12px 0"><button class="primary" data-wiz="finish">完成，进入编辑器</button><button data-act="copySheet">复制文字角色卡</button></div>
			<pre class="sheet">${esc(sheetText(p))}</pre>`;
		},
	},
];

const wizSteps = p => WIZ_STEPS.filter(s => !s.show || s.show(p));

function renderWizard(p) {
	const steps = wizSteps(p);
	let i = steps.findIndex(s => s.id === p.wizard);
	if (i < 0) { i = 0; p.wizard = steps[0].id; }
	const step = steps[i];
	const issues = step.check ? step.check(p) : [];
	const nav = steps.map((s, j) => {
		const bad = s.check && s.check(p).length && !s.soft;
		return `<button data-wiz="goto" data-arg="${s.id}" class="${j === i ? "on" : ""} ${j < i ? (bad ? "warn" : "done") : ""}"><i>${j < i ? (bad ? "!" : "✓") : j + 1}</i>${esc(s.title)}</button>`;
	}).join("");
	return `<div class="wiz">
		<aside class="wiz-nav">
			<div class="wiz-nav-h">引导式车卡</div>${nav}
			<button data-wiz="exit" class="wiz-exit">切换到自定义模式</button>
		</aside>
		<section class="wiz-main">
			<div class="wiz-progress"><div style="width:${(i / (steps.length - 1)) * 100}%"></div></div>
			<div class="wiz-step-n">第 ${i + 1} / ${steps.length} 步</div>
			<h2>${esc(step.title)}</h2>
			<div class="wiz-body">${step.body(p)}</div>
			<div class="wiz-foot">
				${i > 0 ? `<button data-wiz="prev">← 上一步</button>` : "<span></span>"}
				${issues.length && step.id !== "review" ? `<div class="wiz-issues ${step.soft ? "soft" : ""}">这一步还差：${issues.map(esc).join("；")}</div>` : `<span></span>`}
				${i < steps.length - 1 ? `<button class="primary" data-wiz="next">下一步 →</button>` : ""}
			</div>
		</section>
	</div>`;
}

// 新建角色时的模式选择
function renderChooser(kind) {
	return `<div class="modal-bg"><div class="modal">
		<h2>${kind === "first" ? "欢迎使用 Lancer 车卡器" : "新建角色"}</h2>
		<p class="muted">选择你想怎么做这张角色卡：</p>
		<div class="choose">
			<button data-wiz="choose" data-arg="guided"><b>🧭 引导式车卡</b><span>第一次玩或想了解规则？一步步讲解，每一步只做一件事，自动检查点数是否正确。</span></button>
			<button data-wiz="choose" data-arg="custom"><b>🛠 自定义车卡</b><span>熟悉规则？直接打开完整编辑器，自由填写所有内容。</span></button>
		</div>
		${kind === "first" ? "" : `<button data-wiz="chooseCancel" class="modal-x">取消</button>`}
	</div></div>`;
}

document.addEventListener("click", e => {
	const el = e.target.closest("[data-wiz]");
	if (!el || el.disabled) return;
	const p = P();
	const arg = el.dataset.arg;
	const steps = wizSteps(p);
	const i = steps.findIndex(s => s.id === p.wizard);
	const go = id => { p.wizard = id; window.scrollTo(0, 0); };
	switch (el.dataset.wiz) {
		case "choose": {
			let n = p;
			if (chooser === "new") { n = blankPilot(); db.pilots.push(n); db.current = n.id; }
			n.wizard = arg === "guided" ? "intro" : null;
			chooser = null; tab = "pilot"; window.scrollTo(0, 0);
			break;
		}
		case "chooseCancel": chooser = null; break;
		case "next": {
			const s = steps[i];
			const issues = s.check ? s.check(p) : [];
			if (issues.length && !s.soft && !confirm(`这一步还差：\n· ${issues.join("\n· ")}\n\n要先跳过，之后再回来改吗？`)) return;
			go(steps[Math.min(i + 1, steps.length - 1)].id); break;
		}
		case "prev": go(steps[Math.max(i - 1, 0)].id); break;
		case "goto": go(arg); break;
		case "exit": p.wizard = null; tab = "pilot"; break;
		case "finish": p.wizard = null; tab = "sheet"; window.scrollTo(0, 0); break;
		case "bg": p.background = arg; p.bgCustom = ""; break;
		case "bgClear": p.background = ""; break;
		case "chip": {
			const empty = p.triggers.find(t => !t.id && !t.custom);
			if (empty) empty.id = arg; else p.triggers.push({ id: arg, custom: "", val: 2 });
			break;
		}
		case "frame": {
			const m = M();
			if (m.frame !== arg) { m.frame = arg; m.loadout = {}; m.retrofit = -1; m.stabilized = ""; }
			break;
		}
		default: return;
	}
	render();
});
