"use strict";
// 只读更新公告面板：点击顶部「公告」按钮打开，左栏按公告 ID 切换，右栏展示公告正文。
// 后续新增公告时，只需在 ANNOUNCEMENTS 数组最前面插入一条新对象（id 保持唯一，最新在前）。
(() => {
	const SEEN_KEY = "lancer-announcements-seen-v1";

	const ANNOUNCEMENTS = [
		{
			id: "ANN-20261125-01",
			date: "2026-11-25",
			badge: "大面积修订",
			navTitle: "核心与全扩展英文对照校准及构筑升级",
			title: "核心规则书 v3.5 与全扩展英文原文大面积修订及车卡逻辑升级公告",
			summary: "本次更新完成了核心规则书（对照 @massif/lancer-data 3.1.7 与 v3.5 规范）、8 部 Massif Press 官方补充书以及全部已收录第三方扩展与《苏丹》专业牌照的英文原文逐条核查，集中修复了过往译本错漏、数值偏差、多模式缺失及车卡面板联动问题。",
			metrics: [
				["103 部", "核心与扩展骨架全量核验"],
				["130+ 处", "实质规则、译名与术语勘正"],
				["28 项", "构筑计算、多模式与校验升级"],
				["312 / 202", "当前收录系统与机甲武器数"],
			],
			callout: {
				title: "对已有角色存档的影响与配装自查提示",
				items: [
					"<strong>存档完全兼容：</strong>浏览器本地已有角色无需重建，重新打开页面即可自动应用最新文本、多模式与常驻数值计算（如网页缓存未刷新，请按 <code>Ctrl + F5</code> 强制刷新）。",
					"<strong>SP 与受限次数校准：</strong>C&amp;H 拳术师 II <span class=\"ann-chip\">落星模块</span> 按英文原书由 1 SP 修正为 <strong>2 SP</strong>；IPS-N 守夜人 <span class=\"ann-chip\">主动防御系统</span> 由 3 SP 修正为 <strong>2 SP</strong>；专业牌照 <span class=\"ann-chip\">战术带</span> 已修复类型识别并正常减免最高 <strong>4 SP</strong>；C&amp;H <span class=\"ann-chip\">“猎犬级”伙伴礼宾单元</span> 移除误标的受限 1；PI-OF 核心奖励 <span class=\"ann-chip\">“曲线球”臂部调谐</span> 现已自动为榴弹系统增加 <strong>+2 受限次数</strong>。",
					"<strong>新增合法性检查提示：</strong>同一驾驶员的多机甲列表中若同时保留同一非 GMS 牌照的标准骨架与变体骨架，将提示变体互斥；HORUS 伊芙利特 <span class=\"ann-chip\">滑移枪</span>（禁模块／禁核心奖励／无攻击掷骰）与 C&amp;H <span class=\"ann-chip\">纠结加农炮</span>（禁额外伤害，不可指定超功率口径）已补齐违规配装拦截；工程师 II 级原型武器明确须选满两项强化。",
					"<strong>天赋内建装备补齐：</strong>习得扩展天赋 <span class=\"ann-chip\">太空民</span> I 级的角色，机甲内建栏现自动挂载 0 SP、独特、不可摧毁的 <span class=\"ann-chip\">太空民 EVA</span> 系统。",
				],
			},
			sections: [
				{
					id: "sec-build",
					title: "一、车卡构筑、面板数值联动与多模式升级",
					groups: [
						{
							heading: "骨架特征与核心奖励自动化支持",
							items: [
								"<strong>总督蝶 · 近威胁目标处理器：</strong>安装在总督蝶（或康格多遗产继承）上的<strong>发射器</strong>现同时视为 <strong>CQB 武器</strong>，面板自动赋予基础<strong>威胁 3</strong>，且挂载槽允许直接安装 CQB 适用模块（如超巨质量模块）。",
								"<strong>万寿菊 · 枪决：</strong>在万寿菊（或康格多遗产继承）挂载远程非步枪武器时，槽位新增<strong>「枪决：改为步枪（获得杀绝）」</strong>勾选开关，勾选后武器类型切换为步枪、自动附加杀绝标签并同步模块与哨兵无人机校验。",
								"<strong>赤蛱蝶 · 天蛇之尾：</strong>装备主武器近战武器时，面板射程自动计入 <strong>+1 威胁</strong>。",
								"<strong>私人家教（K/KCA 核心奖励）与变体规则：</strong>修复各页面顶部资源摘要未计入私人家教 <strong>+2 天赋上限</strong>的显示问题；GMS 埃弗勒斯变体（<span class=\"ann-chip\">珠穆朗玛</span>、<span class=\"ann-chip\">萨加玛塔</span>）牌照等级修正为 <strong>0</strong>（LL0 可用且不互斥），非 GMS 同牌照标准骨架与变体骨架加入互斥检查。",
								"<strong>“曲线球”臂部调谐（PI-OF 核心奖励）：</strong>除射程外，现对所有榴弹类别系统（含带榴弹标签或子模式为榴弹／手雷的系统）在机甲页、文字卡、PNG 卡与导出中自动结算 <strong>+2 受限次数</strong>。",
							],
						},
						{
							heading: "多模式武器、双类型武器与引导车卡修复",
							items: [
								"<strong>补齐 5 把官方多模式武器的完整数据组：</strong>为 <span class=\"ann-chip\">电震利爪</span>（3 阶段）、<span class=\"ann-chip\">骏逆回环</span>（4 充能阶段）、<span class=\"ann-chip\">电箭巢房</span>（常规／锁定目标双模式）、<span class=\"ann-chip\">寺岛之刃</span>（无架势 + 巨魔／暴风／君王／微风共 5 模式及切换协议）、<span class=\"ann-chip\">HHS-155「食人族」</span>（单管／双管）补齐独立模式射程、伤害与共享标签。",
								"<strong>修复 4～5 模式切换截断 Bug：</strong>将挂载槽、武器舱与存档导入的模式索引上限由固定 <code>2</code> 改为按武器实际模式数动态计算，彻底解决第 4、第 5 架势被截回第 3 模式的问题。",
								"<strong>远近双类型武器与模块兼容：</strong>为 <span class=\"ann-chip\">动能滑膛枪</span>（补刺刀近战类型）、<span class=\"ann-chip\">17 型跳帮手枪</span>（CQB／近战）、<span class=\"ann-chip\">96 型盾炮</span>（近战／大炮）、<span class=\"ann-chip\">“残酷收割”等离子镰</span>（近战／巢房）、<span class=\"ann-chip\">黑荚克战斗弓</span>（发射器／步枪）补齐双类型数组；修复多模式切换时裘格斯等近战射程加值串入远程模式的问题，并使远程专用模块 <span class=\"ann-chip\">最优化工程</span> 正常支持远近双类型武器。",
								"<strong>引导向导背景触发关联：</strong>更新核心背景 <span class=\"ann-chip\">远场小队</span>（补回「入微观察」）与全部 5 个卡拉金（KTB）扩展背景（<span class=\"ann-chip\">贵族后嗣</span>、<span class=\"ann-chip\">第二顺位者</span>、<span class=\"ann-chip\">连队扈从</span>、<span class=\"ann-chip\">潘克拉蒂</span>、<span class=\"ann-chip\">幼鹿</span>）的结构化推荐触发，修复引导车卡第 2 步推荐筹码缺失。",
								"<strong>战术带与配装引用自动清理：</strong>修复专业牌照 <span class=\"ann-chip\">战术带</span> 无法识别 <code>Deployable</code> 类型系统与双模式榴弹／地雷系统导致选单空白的问题；移除核心奖励或卸载 <span class=\"ann-chip\">可拆卸武器舱</span>、<span class=\"ann-chip\">哨兵无人机</span>、<span class=\"ann-chip\">战术带</span> 时自动清空残留槽位引用。",
							],
						},
					],
				},
				{
					id: "sec-core",
					title: "二、核心规则书 v3.5 全量对照修正",
					groups: [
						{
							heading: "核心术语、状态状况与标签定义勘正",
							items: [
								"<strong>受扰（Jammed）：</strong>修正为「不能进行反应，也不能进行或<strong>受益于科技动作</strong>」（修复原译写成「不能从反应中受益」导致误禁队友护卫反应的规则错误）。",
								"<strong>伏卧（Prone）与可展开（Deployable）：</strong>伏卧补齐「<strong>移动时视为身处困难地形</strong>」及「<strong>站起不算作移动，不会触发守望或其他效果</strong>」；可展开标签修正为「<strong>固定 5 回避</strong>，每级大小 10 HP」（修复每级大小 5 回避的错译）。",
								"<strong>杀绝／精准／不准／可靠：</strong>清除无参数标签说明中的 <code>{VAL}</code> 占位符 <code>X</code>（杀绝明确为伤害骰掷出 1）；可靠微调为「至少造成 N 点伤害」。",
								"<strong>盾牌（Shield）与护盾（Overshield）消歧：</strong>明确区分系统标签 <span class=\"ann-chip\">盾牌</span> 与临时生命值 <span class=\"ann-chip\">护盾</span>，防止盾牌装置在正文中悬停误弹临时 HP 说明；统一全库 <span class=\"ann-chip\">超限（Overcharge）</span> 与德川 <span class=\"ann-chip\">超频（Overclock）</span>、<span class=\"ann-chip\">线形（Line）</span>、<span class=\"ann-chip\">受扰</span>、<span class=\"ann-chip\">暴露</span> 用词。",
								"<strong>构建脚本防误伤：</strong>修复旧译名批量替换将神枪手「稳定瞄准／辅助瞄准器」、H0R_OS I「危险地形区域」、巴巴罗萨与重型防护服「内建武器」、布里阿柔斯「百臂巨人」篡改的问题。",
							],
						},
						{
							heading: "核心骨架、核心奖励、天赋、触发与装备修正",
							items: [
								"<strong>核心骨架：</strong><span class=\"ann-chip\">德瑞克</span> 爆发镀层抗性范围修正为「<strong>溅射</strong>、爆发、线形和锥形」（原把溅射误译为爆炸伤害）并移除空白堡垒掩体框；<span class=\"ann-chip\">拿破仑</span> 激活神盾修正为「<strong>盾牌</strong>标签」与「不能<strong>超限</strong>」；<span class=\"ann-chip\">纳尔逊</span> 核心主动统一引用特征新名「散兵」；<span class=\"ann-chip\">萨拉丁</span> 扭曲护盾补标反应并去重防御脉冲；<span class=\"ann-chip\">多头蛇</span> 修复大蛇无人机 <code>None部署</code> 与未进机甲页时的 <code>NaN HP</code>。",
								"<strong>核心奖励：</strong><span class=\"ann-chip\">全战区移动套装</span> 更新为正式版「可将任何及全部移动视为飞行」；<span class=\"ann-chip\">布里阿柔斯</span> 修正为「结构不超过 1 点」并补回修后可正常回复；<span class=\"ann-chip\">弗莫尔</span> 修复被动语态颠倒（不会被体型小于你的角色击倒／拉动／击退）；<span class=\"ann-chip\">武器一体化</span> 补「其他」武器；<span class=\"ann-chip\">体变之训</span> 补「由你选择的可用空闲空间」。",
								"<strong>核心天赋与触发：</strong><span class=\"ann-chip\">潜行者 II</span> 补「命中时」与「任意类型攻击掷骰」；<span class=\"ann-chip\">重炮手 I/III</span> 补反应后结束并修复「目标对你造成的伤害」主客体颠倒；<span class=\"ann-chip\">领袖 II</span> 修正为仅限「其他任何玩家的回合开始时」；<span class=\"ann-chip\">兴风者 III</span> 补晕眩持续至其下一回合结束；<span class=\"ann-chip\">骇客 I/II</span> 修正为「被推动 3 格」并补关机解除条件；<span class=\"ann-chip\">攻城专家 I</span> 修正为「任意物件的一个大小 1 部分」；<span class=\"ann-chip\">处刑人 III</span> 修正为「重掷该次攻击」；补齐猎人 I、枪侠 II、核子游侠 I/II、无人机指挥官 III、先锋 III 限定词；修正触发 <span class=\"ann-chip\">魅惑</span>（安抚劝阻）、<span class=\"ann-chip\">销声匿迹</span>（悄悄拔枪）、<span class=\"ann-chip\">取得某物</span>（受牌照等级限制）。",
								"<strong>核心武器、系统与驾驶员装备：</strong><span class=\"ann-chip\">迅子长枪</span> 移除旧数据捏造的「每轮1次」动作框；<span class=\"ann-chip\">湮灭巢房</span> 补「属于你的无人机」；<span class=\"ann-chip\">蒺藜发射器</span> 修正为溅射 1 与快速动作；<span class=\"ann-chip\">标枪火箭</span> 移除错误的爆发 1；<span class=\"ann-chip\">H0R_OS II</span> 补快速科技且伪像大小同目标；<span class=\"ann-chip\">装甲锁定镀层</span> 修正为「你的下一回合结束」；<span class=\"ann-chip\">强化缆绳</span>（自由动作）、<span class=\"ann-chip\">夹钳炸弹</span>（快速动作）、<span class=\"ann-chip\">炮塔无人机</span>（每架每轮一次）及 5 件驾驶员装备（修复胶、补丁、刺激物、铝热炸弹、睡袋）补齐动作类型显示。",
							],
						},
					],
				},
				{
					id: "sec-official-ext",
					title: "三、8 部官方补充书全量对照修正",
					groups: [
						{
							heading: "官方补充书骨架与内建武器（19 项规则修正 + 20 部骨架补齐高效徽章）",
							items: [
								"<strong>白巫蛾 &amp; 帝王蝶：</strong>白巫蛾「固化」护盾修正为正式版 <strong>4 + 毅力</strong>（原写死 5），超激活区域施加<strong>离散</strong>（原误写受损）；帝王蝶「帝国护甲」电弧修正为击中攻击者射程 3 内自选角色（可直接劈回攻击者自身），统一正文中自称「帝王蝶」。",
								"<strong>蒲公英、万寿菊 &amp; 总督蝶：</strong>蒲公英核心主动修正为<strong>爆发 4</strong>（原为爆发 3），中继联轴器补「感应内」与「使用系统或科技动作」；万寿菊沙暴散热修正为稳住阵脚排热时建立<strong>固定的爆发 2</strong>（移除误标的协定与溅射 2）；总督蝶会心溅射修正为<strong>自身射程 3 内</strong>自选角色，天堂倾雨修正为<strong>爆发 3</strong>。",
								"<strong>巫妖 &amp; 狼人：</strong>巫妖「时间故障」第 2 项修复主客体颠倒（<strong>巫妖自己瞬间移动</strong>至目标原本占据的空间），第 1 项按官方勘误明确为该动作的目标，魂匣补「被科技攻击命中」；狼人修复电震利爪升级时点颠倒（激活「狼嚎」<strong>之前</strong>友军受结构／压力时升级）。",
								"<strong>库图佐夫、基德 &amp; 阿特拉斯蛾：</strong>库图佐夫全文 <code>Shield</code> 修正为<strong>盾牌标签</strong>（接通核心被动投射神盾联动）并正名「应急霎场」；基德能量导流补「<strong>它自己的</strong>可展开或无人机」、快速部署补「<strong>任意一个</strong>系统」，并将基德与阿特拉斯蛾的特征顺序对齐官方数据；阿特拉斯蛾巨人杀手修正为「<strong>即使对抗来自该被共享空间角色的攻击也享有软性掩护</strong>」。",
								"<strong>其余官方骨架校准：</strong><span class=\"ann-chip\">金盏花</span>（科技攻击<strong>命中</strong>时造空壳）、<span class=\"ann-chip\">晶眼蝶</span>（盟友<strong>命中时可以</strong>造成 +1d6）、<span class=\"ann-chip\">红门兰</span>（仅限自身回合之间触发、同步模仿移动且<strong>不消耗反应</strong>）、<span class=\"ann-chip\">游骑兵</span>（接地补<strong>受到伤害</strong>解除隐形）、<span class=\"ann-chip\">因帕卡伊</span>（巨像热能爪拉人补<strong>由你选择的</strong>）、<span class=\"ann-chip\">百臂巨人</span>（剃刀虫群<strong>不是角色</strong>）、<span class=\"ann-chip\">吉尔伽美什</span>（清除非自身系统／天赋造成的状况）、<span class=\"ann-chip\">珠穆朗玛</span>（可以自动扫描、系统粉碎对每角色 1/场景）、<span class=\"ann-chip\">郑</span>（晓礼之韧／之智修正为 <strong>1/回合</strong>，统一人物译名「熊晓礼／熊式」）、<span class=\"ann-chip\">恩奇都</span>（核心主动名校准为「粉碎限制器」）。",
							],
						},
						{
							heading: "官方补充书武器、系统、模块、天赋与扩展规则",
							items: [
								"<strong>官方扩展武器：</strong><span class=\"ann-chip\">D/D 288</span> 充能拆迁伤害修正为 <strong>30 AP 动能伤害</strong>并补充能快速动作说明；<span class=\"ann-chip\">电箭巢房</span> 强化射程／伤害／可靠 4 明确<strong>仅针对该标记角色生效</strong>；<span class=\"ann-chip\">骏逆回环</span> 补受结构或压力伤害时充能归零；<span class=\"ann-chip\">铁磁流长枪</span> 补<strong>且无法以任何方式移动</strong>；<span class=\"ann-chip\">“军团战士”战斗步枪</span> 修正为可靠 +2（变可靠 4）与向任意方向推动 1；<span class=\"ann-chip\">军团巢房</span> 补命中时 +2 伤害与自由动作部署；<span class=\"ann-chip\">寺岛之刃</span> 暴风架势修正为邻接你<strong>或</strong>目标；<span class=\"ann-chip\">热熔缭绕</span> 明确锥形朝背离目标的方向投射；<span class=\"ann-chip\">HHS-155「食人族」</span> 补明动能伤害类型。",
								"<strong>官方扩展系统与模块：</strong><span class=\"ann-chip\">矛式炸药</span> 修复灾难性错译（排雷失败对其引爆，而非未拆除再次引爆）；<span class=\"ann-chip\">人因故障（PEBCAC）</span> 补入<strong>不能对受扰角色使用</strong>及按实际清除热度值造成能量伤害；<span class=\"ann-chip\">“烟囱”冷源</span> 正名并补物品／可展开自动受击与快速动作；<span class=\"ann-chip\">武备冗余</span> 补不可摧毁标签并明确自身不能作为系统被摧毁的目标；<span class=\"ann-chip\">加缪之锋</span> 明确每次预备获得 <strong>1 次</strong>干预反应使用次数且范围含溅射；<span class=\"ann-chip\">铁磁钉壁</span> 补屏障固化后移入才受伤；<span class=\"ann-chip\">帝王之眼</span> 修正为 2 AP 能量伤害自动必中（仅击退／伏卧／离散可豁免）；<span class=\"ann-chip\">净化代码</span> 修正为对方下一回合<strong>结束时</strong>结算；<span class=\"ann-chip\">反线性时间</span> 修正为清除状况；<span class=\"ann-chip\">现世缺口</span> 明确由目标控制者选落点并以快速动作提前结束；<span class=\"ann-chip\">超巨质量模块</span> 统一译名；同步校准共感护盾、列王记、朔望之证、多档机动系统、锻炉二型、万用基板、力量总成套组 III、不稳定 NHP。",
								"<strong>官方扩展天赋与新规则：</strong><span class=\"ann-chip\">读心者 III</span> 修复严重时点错译（直到该角色下一回合<strong>结束前</strong>而非开始前，并补齐天赋简介）；<span class=\"ann-chip\">黑拇指 II/III</span> 修正冷却为<strong>在你的下一回合无法再次开启</strong>、允许协定内顺带移交 NHP 控制权并补盟友机甲限定；<span class=\"ann-chip\">潘克拉蒂 III</span> 补队友推进须消耗<strong>反应</strong>；<span class=\"ann-chip\">爆破专家 III</span> 修正为从目标空间起算且无伤地雷无论是否迫使豁免均改为对一名角色造成 1d6 爆炸伤害；<span class=\"ann-chip\">演说家 I/II</span> 补 1/轮反应并明确花费 1 颗演说骰获得 +1 准度；<span class=\"ann-chip\">战场分析师 III</span> 补敌方攻击<strong>命中</strong>时获知骰值；<span class=\"ann-chip\">探勘者 I</span> 补完全位于进口内结束移动；<span class=\"ann-chip\">偶像破坏者 I</span> 校准内嵌 NHP 标签说明；扩展规则 <span class=\"ann-chip\">无形</span> 修正为「<strong>且不视为与有形角色邻接</strong>」。",
							],
						},
					],
				},
				{
					id: "sec-third-party",
					title: "四、第三方扩展与《苏丹》专业牌照原文校准",
					groups: [
						{
							heading: "《苏丹》专业牌照与扩展条目修正（保留自设顶峰／卡西米尔专业牌照不变）",
							items: [
								"<strong>弹道臂盾（IPS-N 先遣兵 I）：</strong>对照英文原版补回漏译限定——展开弹道板期间<strong>仅对所有作为反应发起的攻击</strong>获得抗性，会心一击击倒伏卧同样仅在展开期间生效。",
								"<strong>其余《苏丹》专业牌照校准：</strong><span class=\"ann-chip\">瓦亚维亚导弹</span> 修正飞行（+1 准度）与非飞行目标（+1 难度）颠倒，迫降不受坠落伤害；<span class=\"ann-chip\">哨兵无人机</span> 补回<strong>大炮</strong>可挂载支持与核心奖励继承；<span class=\"ann-chip\">主动防御系统</span> 修正为 <strong>2 SP</strong> 并统一「导引」；<span class=\"ann-chip\">模块化先进战斗步枪</span> 突击模式补反应攻击 +1 准度；<span class=\"ann-chip\">最优化工程</span> 补回<strong>独特</strong>标签；<span class=\"ann-chip\">HSC 电镀</span> 与 <span class=\"ann-chip\">下挂式冲击器</span> 统一为「护盾／离散」。",
								"<strong>C&amp;H 与苏尔丹骨架装备：</strong>彗尾蛾核心主动 <span class=\"ann-chip\">天眼</span> 按英文原版明确「你所处高度高于目标」的高度比较，并区分自由动作强化友军（科技动作）与敌方直接获得锁定（挂状况）；彗尾蛾 III <span class=\"ann-chip\">猎兔犬巢房</span> 补回汉化漏译的<strong>射程 5 且视线内</strong>限制（修复全图视线无限距离削血）；<span class=\"ann-chip\">落星模块</span> 修正为 <strong>2 SP</strong>；<span class=\"ann-chip\">“猎犬级”伙伴礼宾单元</span> 移除误标受限 1、两处推动更正为<strong>拉动</strong>并修正层流替代文本；沃登 <span class=\"ann-chip\">反火力套组</span> 明确在敌方攻击命中盟友时以反应消耗本轮守望次数施加锁定；校准 <span class=\"ann-chip\">康格多底盘</span>、<span class=\"ann-chip\">增强系统升级</span>、<span class=\"ann-chip\">紧急泄压板</span> 表述。",
							],
						},
						{
							heading: "《卡斯特与帕勒克》《冷核竞技场》《午夜伊菲革涅亚》《强化战斗》等校准",
							items: [
								"<strong>PI-OF（顶峰实业）：</strong><span class=\"ann-chip\">胡椒</span> 特征「飞车射击」将误译的「交战」勘正为<strong>「交火」</strong>；胡椒 II 机翻名称「等离子脚轮 / 血浆胎面」修正为 <strong>等离子投射器 / 等离子胎面</strong>；修复香菜、流星锤、燃油手雷、冰湖喷管共 4 处被动抵抗将「豁免」误印为「检定」的问题；修顺 <span class=\"ann-chip\">砖匠 III</span> 溢出恢复量转化为护盾的说明。",
								"<strong>K/KCA 与冷核竞技场：</strong>祖母绿弯刀 III <span class=\"ann-chip\">步弓手式伙伴礼宾单元</span> 修正为使敌方部件获得<strong>充能 4+</strong> 并立即进入<strong>未充能（待充能）</strong>状态（修复「不再充能」错译）；<span class=\"ann-chip\">鸟翼蝶</span> 核心主动「紧缚」修正为机体检定对抗敏捷检定。",
								"<strong>树绳妖、午夜伊菲革涅亚与被动部署物归位：</strong><span class=\"ann-chip\">树绳妖</span> 核心主动修正无法离舱或无驾驶员目标的晕眩兜底条款；校准 <span class=\"ann-chip\">EA17 特种有效荷载迫击炮</span>（替代常规攻击放置溅射 2）、<span class=\"ann-chip\">空_指针</span>（明确三处回合时点）、<span class=\"ann-chip\">堕落面具之训</span> 与 <span class=\"ann-chip\">“绝唱”归零长矛</span>（「使针对他们的一次攻击未命中」，保留汉化版护盾与回复数值）；将镰翅蛾、布莱、哈布斯堡、茴香、八角的常驻核心部署物从 1 CP 主动区迁回被动区。",
							],
						},
					],
				},
				{
					id: "sec-ui-export",
					title: "五、界面展示、查询工具与角色卡导出优化",
					groups: [
						{
							heading: "武器表、系统库、角色卡与 Foundry 导出",
							items: [
								"<strong>武器模块安装限制可视化：</strong>在等级成长页「牌照内容」悬停提示、系统库与机甲装备详情中完整显示模块的适用类型／尺寸与禁用类型／尺寸，并清理非因果律模块暴露的隐藏开发标签。",
								"<strong>系统库筛选与分类修复：</strong>「动作」筛选器补齐<strong>快速科技、完整科技、入侵</strong>选项；补齐 12 个主动系统的动作标签（修复被误归入「被动」的问题），并将帝王蝶 4 个科技系统修正为科技类别、移除高速机动喷口误标的盾牌类别。",
								"<strong>官方补充说明面板与卡片导出：</strong>87 个官方补充书扩展条目支持展开「官方补充说明」对照面板；PNG 机甲卡补齐核心被动动作（如牛头怪、德川）、内建武器（如末日导轨充能数据）与多模式武器全数据组摘要；导出到 Foundry 时对战术带占用的空挂载点标记锁定、按武器舱当前主／副规格过滤备注，并同步导出太空民内建 EVA 与曲线球榴弹充能。",
							],
						},
					],
				},
			],
		},
	];

	const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
	const stripTags = html => String(html ?? "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
	const norm = s => stripTags(s).normalize("NFKC").toLocaleLowerCase();

	function filterAnnouncement(ann, query = "") {
		const words = norm(query).split(/\s+/).filter(Boolean);
		if (!words.length) {
			const total = ann.sections.reduce((n, sec) => n + sec.groups.reduce((m, g) => m + g.items.length, 0), 0);
			return { sections: ann.sections, matchedCount: total, totalCount: total, filtering: false };
		}
		let matchedCount = 0, totalCount = 0;
		const sections = [];
		for (const sec of ann.sections) {
			const groups = [];
			for (const g of sec.groups) {
				totalCount += g.items.length;
				const items = g.items.filter(item => {
					const hay = norm(`${sec.title} ${g.heading} ${item}`);
					return words.every(w => hay.includes(w));
				});
				if (items.length) {
					matchedCount += items.length;
					groups.push({ ...g, items });
				}
			}
			if (groups.length) sections.push({ ...sec, groups });
		}
		return { sections, matchedCount, totalCount, filtering: true };
	}

	window.LANCER_ANNOUNCEMENTS = ANNOUNCEMENTS;
	window.LANCER_ANNOUNCEMENTS_VIEW = { filterAnnouncement };

	const triggerBtn = typeof document !== "undefined" ? document.getElementById("openAnnouncements") : null;
	if (!triggerBtn?.addEventListener || !document.createElement) return;

	const state = { activeId: ANNOUNCEMENTS[0]?.id || "", query: "", allOpen: true };
	let dialog = null, opener = null, composing = false;
	const inertBackup = new Map();

	function readSeen() {
		try {
			const raw = localStorage.getItem(SEEN_KEY);
			const arr = raw ? JSON.parse(raw) : [];
			return new Set(Array.isArray(arr) ? arr : []);
		} catch {
			return new Set();
		}
	}
	function markSeen(id) {
		try {
			const seen = readSeen();
			seen.add(id);
			localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
		} catch { /* ignore storage quota errors */ }
		syncUnreadDot();
	}
	function syncUnreadDot() {
		const dot = triggerBtn.querySelector(".ann-dot");
		if (!dot) return;
		const seen = readSeen();
		dot.hidden = ANNOUNCEMENTS.every(a => seen.has(a.id));
	}

	function activeAnnouncement() {
		return ANNOUNCEMENTS.find(a => a.id === state.activeId) || ANNOUNCEMENTS[0];
	}

	function mount() {
		if (dialog) return;
		dialog = document.createElement("dialog");
		dialog.id = "announcementDialog";
		dialog.className = "ann-dialog";
		dialog.setAttribute("aria-labelledby", "annDialogTitle");
		dialog.innerHTML = `
			<header class="ann-head">
				<div>
					<div class="ann-eyebrow">UPDATE BULLETIN · 车卡器更新与修订日志</div>
					<h2 id="annDialogTitle">版本更新公告</h2>
					<p>左侧选择公告 ID 查看对应批次记录；右侧支持按装备名、骨架名或规则词实时筛选。</p>
				</div>
				<button type="button" class="ann-close" data-ann-action="close" aria-label="关闭更新公告">关闭 <kbd>Esc</kbd></button>
			</header>
			<div class="ann-mobile-bar">
				<label for="annMobileSelect">公告 ID</label>
				<select id="annMobileSelect" aria-label="选择公告 ID"></select>
			</div>
			<div class="ann-layout">
				<aside class="ann-sidebar" aria-label="公告 ID 列表">
					<div class="ann-sidebar-head"><span>公告 ID</span><span class="ann-total-count"></span></div>
					<div class="ann-list"></div>
				</aside>
				<div class="ann-main">
					<div class="ann-toolbar">
						<div class="ann-search">
							<input type="search" id="annSearchInput" aria-label="在当前公告中搜索关键词" autocomplete="off" placeholder="在当前公告中搜索骨架、装备、天赋或规则关键词…">
						</div>
						<div class="ann-toolbar-actions">
							<span class="ann-match-status" role="status" aria-live="polite"></span>
							<button type="button" data-ann-action="clearSearch" hidden>清空筛选</button>
							<button type="button" data-ann-action="toggleAll">收起全部章节</button>
						</div>
					</div>
					<div class="ann-scroll" tabindex="0" aria-label="公告正文"></div>
				</div>
			</div>`;
		document.body.appendChild(dialog);

		dialog.addEventListener("cancel", e => { e.preventDefault(); close(); });
		dialog.addEventListener("keydown", e => { if (e.key === "Escape") e.stopPropagation(); });
		dialog.addEventListener("click", e => {
			if (e.target === dialog) return close();
			const act = e.target.closest("[data-ann-action]")?.dataset.annAction;
			if (act === "close") return close();
			if (act === "clearSearch") {
				state.query = "";
				dialog.querySelector("#annSearchInput").value = "";
				renderBody();
				dialog.querySelector("#annSearchInput").focus();
				return;
			}
			if (act === "toggleAll") {
				state.allOpen = !state.allOpen;
				dialog.querySelectorAll(".ann-section").forEach(sec => { sec.open = state.allOpen; });
				syncToggleBtn();
				return;
			}
			const idBtn = e.target.closest("[data-ann-id]");
			if (idBtn) {
				selectAnnouncement(idBtn.dataset.annId);
				return;
			}
			const jumpBtn = e.target.closest("[data-ann-jump]");
			if (jumpBtn) {
				const target = dialog.querySelector("#" + jumpBtn.dataset.annJump);
				if (target) {
					if (target.tagName === "DETAILS") target.open = true;
					target.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}
		});

		const searchInput = dialog.querySelector("#annSearchInput");
		const onSearch = () => {
			state.query = searchInput.value;
			if (state.query.trim()) state.allOpen = true;
			renderBody();
		};
		searchInput.addEventListener("compositionstart", () => { composing = true; });
		searchInput.addEventListener("compositionend", () => { composing = false; onSearch(); });
		searchInput.addEventListener("input", () => { if (!composing) onSearch(); });

		dialog.querySelector("#annMobileSelect").addEventListener("change", e => {
			selectAnnouncement(e.target.value);
		});

		dialog.querySelector(".ann-scroll").addEventListener("toggle", () => {
			const secs = [...dialog.querySelectorAll(".ann-section")];
			if (secs.length) state.allOpen = secs.every(s => s.open);
			syncToggleBtn();
		}, true);
	}

	function selectAnnouncement(id) {
		if (!ANNOUNCEMENTS.some(a => a.id === id)) return;
		state.activeId = id;
		state.query = "";
		state.allOpen = true;
		markSeen(id);
		if (dialog) {
			dialog.querySelector("#annSearchInput").value = "";
			renderNav();
			renderBody();
			dialog.querySelector(".ann-scroll").scrollTop = 0;
		}
	}

	function syncToggleBtn() {
		const btn = dialog?.querySelector('[data-ann-action="toggleAll"]');
		if (!btn) return;
		btn.textContent = state.allOpen ? "收起全部章节" : "展开全部章节";
	}

	function renderNav() {
		dialog.querySelector(".ann-total-count").textContent = `共 ${ANNOUNCEMENTS.length} 期`;
		dialog.querySelector(".ann-list").innerHTML = ANNOUNCEMENTS.map((a, idx) => `
			<button type="button" class="ann-id-btn" data-ann-id="${esc(a.id)}" ${a.id === state.activeId ? 'aria-current="true"' : ""}>
				<span class="ann-id-top">
					<span class="ann-id-code">${esc(a.id)}</span>
					${idx === 0 ? `<span class="ann-badge">最新</span>` : a.badge ? `<span class="ann-badge">${esc(a.badge)}</span>` : ""}
				</span>
				<span class="ann-id-title">${esc(a.navTitle || a.title)}</span>
				<span class="ann-id-date">${esc(a.date)}</span>
			</button>`).join("");
		const sel = dialog.querySelector("#annMobileSelect");
		sel.innerHTML = ANNOUNCEMENTS.map(a => `<option value="${esc(a.id)}">${esc(a.id)} · ${esc(a.navTitle || a.title)}</option>`).join("");
		sel.value = state.activeId;
	}

	function renderBody() {
		const ann = activeAnnouncement();
		const { sections, matchedCount, totalCount, filtering } = filterAnnouncement(ann, state.query);
		const clearBtn = dialog.querySelector('[data-ann-action="clearSearch"]');
		const toggleBtn = dialog.querySelector('[data-ann-action="toggleAll"]');
		const statusEl = dialog.querySelector(".ann-match-status");
		clearBtn.hidden = !filtering;
		toggleBtn.disabled = !sections.length;
		statusEl.textContent = filtering ? `匹配 ${matchedCount} / ${totalCount} 条` : `共 ${totalCount} 条修订记录`;

		const metricsHtml = !filtering && ann.metrics?.length
			? `<div class="ann-metrics">${ann.metrics.map(([val, label]) => `<div class="ann-metric"><b>${esc(val)}</b><span>${esc(label)}</span></div>`).join("")}</div>`
			: "";

		const jumpsHtml = !filtering && sections.length > 1
			? `<div class="ann-jumps"><span>快速定位：</span>${ann.callout ? `<button type="button" data-ann-jump="ann-callout-box">存档影响</button>` : ""}${sections.map(s => `<button type="button" data-ann-jump="${esc(s.id)}">${esc(s.title.replace(/^[一二三四五六七八九十]+、/, ""))}</button>`).join("")}</div>`
			: "";

		const calloutHtml = !filtering && ann.callout
			? `<section class="ann-callout" id="ann-callout-box"><h4>${esc(ann.callout.title)}</h4><ul>${ann.callout.items.map(x => `<li>${x}</li>`).join("")}</ul></section>`
			: "";

		const sectionsHtml = sections.length
			? sections.map(sec => {
				const count = sec.groups.reduce((n, g) => n + g.items.length, 0);
				return `<details class="ann-section" id="${esc(sec.id)}" ${state.allOpen || filtering ? "open" : ""}>
					<summary><span>${esc(sec.title)}</span><span class="ann-sec-count">${count} 条</span></summary>
					<div class="ann-section-body">
						${sec.groups.map(g => `<div class="ann-group"><h4>${esc(g.heading)}</h4><ul class="ann-items">${g.items.map(item => `<li>${item}</li>`).join("")}</ul></div>`).join("")}
					</div>
				</details>`;
			}).join("")
			: `<div class="ann-empty"><p>当前公告中没有包含「${esc(state.query.trim())}」的条目。</p><button type="button" data-ann-action="clearSearch">清空搜索关键词</button></div>`;

		dialog.querySelector(".ann-scroll").innerHTML = `
			<header class="ann-article-head">
				<div class="ann-meta-row">
					<span class="ann-meta-id">${esc(ann.id)}</span>
					<span>发布日期：${esc(ann.date)}</span>
					${ann.badge ? `<span class="ann-badge">${esc(ann.badge)}</span>` : ""}
				</div>
				<h3>${esc(ann.title)}</h3>
				<p class="ann-lead">${esc(ann.summary)}</p>
				${metricsHtml}
				${jumpsHtml}
			</header>
			${calloutHtml}
			${sectionsHtml}`;
		syncToggleBtn();
	}

	function open(targetId) {
		mount();
		if (targetId && ANNOUNCEMENTS.some(a => a.id === targetId)) state.activeId = targetId;
		markSeen(state.activeId);
		renderNav();
		renderBody();
		if (!dialog.open) {
			opener = document.activeElement === document.body ? triggerBtn : document.activeElement;
			dialog.showModal();
			document.body.classList.add("ann-open");
			for (const child of document.body.children) {
				if (child !== dialog && !["SCRIPT", "LINK", "STYLE"].includes(child.tagName)) {
					inertBackup.set(child, child.inert);
					child.inert = true;
				}
			}
		}
		dialog.querySelector(".ann-scroll").scrollTop = 0;
	}

	function close() {
		if (!dialog?.open) return;
		dialog.close();
		document.body.classList.remove("ann-open");
		for (const [child, wasInert] of inertBackup) child.inert = wasInert;
		inertBackup.clear();
		(opener || triggerBtn)?.focus();
	}

	triggerBtn.addEventListener("click", () => open());
	syncUnreadDot();
})();
