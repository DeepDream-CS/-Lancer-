# 核心规则书全量对照核查清单（车卡器部分 · 已全部修复验证 · 2026-11-24）

[返回文档目录](README.md) · [FVTT 并行修复交接单](FVTT-CORE-SYNC.md)

> **修复状态（2026-11-24）**：本清单所列 **第一类（35 项实质规则错漏）+ 第二类（14 项前端渲染/动作/构筑校验问题）+ 第三类（10 组 v3.5 术语与错别字）** 已在车卡器侧全部完成修正并重生成 `assets/js/data.js`，通过 `test-v35`（475 项断言 + SHA-256 数值结构基线不变）、`test-rules`（128 项）、`test-core-corrections`、`test-mod-display`、`test-foundry-export`（4343 项）、`test-expansion-copy`、`test-faq`、`test-equipment-lore`、`test-official-supplements`、`test-npc-builder`（56728 项）及无头 Edge 浏览器全流程验证。FVTT 侧同步清单见 [FVTT-CORE-SYNC.md](FVTT-CORE-SYNC.md)，车卡器修复未触碰任何 `source/fvtt/*`、`dist/fvtt/*` 或 `build-lcp.js` / `build-fvtt-module.js`。

## 核查范围与基准

对照 `@massif/lancer-data 3.1.7`（英文核心规则书官方结构化文本）及《枪骑兵》核心规则书 v3.5 术语规范，已完成车卡器全部核心规则书内容与构筑/渲染代码的逐条核查：

- **机甲骨架（29 部）及骨架内建武器（4 件）**：基础数值、挂载点、特征、核心系统主动/被动/动作/部署物与 `assets/js/frame-catalog.js` — **14 项基础数值与挂载点 100% 一致**。
- **核心奖励（30 项）**：`D.zh.cb` 渲染 HTML、`D.core_bonuses` 加值及 `assets/js/rules.js` / `assets/js/app.js` 常驻计算 — **常驻数值加成计算全部正确，但 5 项说明存在规则错漏**。
- **天赋（29 项 / 87 级）及天赋衍生装备（10 件）**：`D.zh.talents`、`BLOCK_FILLS`、专享升级逻辑与原型武器/弹药库/科技狂热者 NHP。
- **核心武器（85 件）与武器模块（8 件）**：挂载、类型、SP、射程、伤害、标签、多模式数据组与模块限制 — **基础数值与标签 100% 一致，个别旧快照残留动作/隐藏标签影响显示**。
- **机甲系统（124 件）**：SP、类型、标签、动作、可展开物/无人机与 `assets/js/system-library.js`。
- **驾驶员装备（37 件）、触发（22 项）、背景（20 项）、核心标签（49 项）、术语库与判定速查（15 项状态/状况 + 通用动作）**：`assets/js/glossary.js`、`assets/js/damage-reference.js`、`assets/js/wizard.js`。
- **核心 NPC 构筑（33 职业 / 12 模板 / 409 特性）**：`source/npc/core-npcs.json` 与 `assets/js/npc-builder.js`（已核验无新增问题，仅保留 `source/npc/README.md` 已记录的哨兵「快速响应」待确认项）。

> **双窗口并行约定**：本清单仅列出**本窗口（车卡器）**负责修改的数据源、构建工具与前端脚本问题；涉及 Foundry VTT 内容包与 `lancer-cn` 模组的部分已单独拆分至 [FVTT-CORE-SYNC.md](FVTT-CORE-SYNC.md)，两个窗口修改文件完全错开、互不冲突。

---

## 第一类：实质性规则错译、漏译与构建脚本篡改（35 项 · 高优必改）

此类问题会直接导致玩家在牌桌上算错机制、看反条件、漏掉豁免/命中前提或丢失动作类型。

### 1.1 构建脚本全局替换造成的正文篡改（3 项）

| # | 条目 ID / 名称 | 所在源文件 | 英文原文 / 原意 | 当前车卡器错误文本 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 1 | `t_crack_shot` 神枪手（I–III 级及简介） | `tools/core-v35.js:38`、`source/cn/talents.json` | `steady your aim` / `targeting assist` | `保持稳定瞄准具校正`、`辅助瞄准具校正器` | `core-v35.js` 对天赋内旧等级名（2 字词「稳定」「瞄准」）做无边界局部替换，把正文中全部「稳定瞄准」篡改为病句「保持稳定瞄准具校正」，把「辅助瞄准器」篡改为「辅助瞄准具校正器」。需在 `core-v35.js` 限制仅替换精确引用或更新源文案。 |
| 2 | `ms_h0r_os_system_upgrade_i` H0R_OS系统升级 I（傀儡系统） | `source/i18n/zh/systems-2.json` + `tools/core-v35.js` | `They can be moved into hazardous areas and other obstacles` | `他们可以被移入超温危域域和其他障碍` | 原译文「危险区域」被 `core-v35` 的 `危险区 → 超温危域` 误命中，既产生错字「超温危域域」，又把地图**危险地形/区域**混淆成了机甲热量的**超温危域**。应改为「危险地形区域」。 |
| 3 | `mf_barbarossa` 巴巴罗萨、`pg_heavy_hardsuit` 重型防护服、`pbg_far_field_team` 远场小队、`cb_briareos_frame` / `cb_the_lesson_of_disbelief` | `tools/core-v35.js:25-31` | `integrated weapon`（内建武器）/ `determine its nature`（判定其特性）/ `Briareos`（百臂巨人） | `见下方武器一体化的对应充能模式` / `配备武器一体化` / `以检定其特性` / `百臂是IPS-N…` | `core-v35.js` 4 字旧译名替换把普通词「内建武器」换成了 GMS 核心奖励专名「武器一体化」，把神话名「百臂巨人」截成天赋名「百臂」，把普通动词「判定」换成规则词「检定」。需在源文本与 `core-v35.js` 排除误伤。 |

### 1.2 术语库与核心标签的规则定义错误（4 项）

| # | 条目 ID / 名称 | 所在源文件 | 英文原文 | 当前车卡器错误文本 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 4 | 状态/状况：`受扰`（Jammed） | `assets/js/glossary.js:72` | `can't ... take reactions, or take or benefit from tech actions.` | `不能进行科技动作；不能进行反应，也不能从反应中受益。` | **严重译错**：原文是「不能进行反应，也不能进行或**受益于科技动作**」（如无法被队友强化），现译文写成了「不能从**反应**中受益」（误禁了队友萨拉丁/德瑞克等护卫反应）。 |
| 5 | 状态/状况：`伏卧`（Prone） | `assets/js/glossary.js:78` | `PRONE characters are SLOWED and count as moving in difficult terrain. ... Standing up doesn't count as movement, so doesn't trigger OVERWATCH or other effects.` | `对伏卧角色的攻击 +1 准度；伏卧角色视为缓慢。可以放弃标准移动来站起（被固定时除外）。` | **严重漏译**：漏掉了「**移动时视为身处困难地形**（每移动 1 空间消耗 2 点速度）」以及「**站起不算作移动，不会触发守望或其他效果**」。 |
| 6 | 标签：`tg_deployable`（可展开） | `source/i18n/zh/misc.json:74`、`assets/js/glossary.js:124` | `has 5 Evasion and 10 HP per Size.` | `每级大小拥有回避5和10 HP。` | **规则错误且自相矛盾**：可展开物回避固定为 5（仅 HP 乘以大小）。现标签悬停写「每级大小拥有回避5」，且拼入术语库后与上方「回避不乘以大小」直接冲突。 |
| 7 | 标签：`tg_overkill`（杀绝）、`tg_accurate`（精准）、`tg_inaccurate`（不准） | `source/i18n/zh/misc.json:35-52`、`assets/js/ui.js:182` | `any damage dice that land on a 1 cause the attacker to take 1 Heat, and are then rerolled. Additional 1s continue to trigger...` | `任何掷出{VAL}的伤害骰都会使攻击者受到1热度，然后重掷。再掷出的{VAL}会继续触发…`（术语库渲染为 `掷出X`） | 无参数标签误用了 `{VAL}`，导致术语库和正文悬停把阈值 `1` 显示成 `X`（`精准`/`不准` 也变成 `精准X`/`不准X`）。应直接写死为 `1`（及 `+1准度` / `+1难度`）。 |

### 1.3 骨架与核心奖励实质错漏（8 项）

| # | 条目 ID / 名称 | 所在源文件 | 英文原文 | 当前车卡器错误文本 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 8 | `mf_drake` 德瑞克 · 特征「爆发镀层」 | `source/i18n/zh/frames-ips-n.json`、`tools/calibrate-text.js:14` | `Resistance to damage, burn and heat from blast, burst, line, and cone attacks.` | `对来自爆炸、爆发、直线和锥形攻击的伤害、燃烧和热度有抗性。` | 将范围模板 `blast`（**溅射**）误译为伤害类型 `爆炸`（Explosive），且 `直线` 应为 `线形`。 |
| 9 | `mf_napoleon` 拿破仑 · 核心主动「激活神盾」 | `source/i18n/zh/frames-ha.json` | `can only use systems with the Shield tag ... Activate (Shield systems only) ... can't Overcharge` | `只能使用具有护盾标签的系统…启动（仅限护盾系统）…不能超频` | 车卡器中 `tg_shield` 标签名为 **`盾牌`**，而 `护盾` 是 **`tg_overshield`（临时生命值）**（前端悬停会弹出临时 HP 说明！）；同时 `Overcharge` 应为 **`超限`** 而非「超频」。 |
| 10 | `mf_nelson` 纳尔逊 · 核心主动「PMD启动」 | `source/i18n/zh/frames-ips-n.json` | `Skirmisher allows you to move 4 spaces at a time instead of 1 space.` | `在场景余下时间内，游击让你每次移动4格而不是1格。` | 特征 2 已在 v3.5 改名为「**散兵**」，但核心系统与特征动作仍写旧名「游击」，导致同骨架内部特征引用断裂。 |
| 11 | `cb_all_theater_movement_suite` 全战区移动套装 | `source/cn/core-bonuses.json` | `You may choose to count any and all of your movement as flying; however, you take 1 Heat at the end of each of your turns in which you fly this way.` | `当你推进或作标准移动时可以飞行。不过，你在这样飞行的每一回合结束时也会受到1热度。` | 沿用了旧测试版规则，错误排除了天赋/特征/反应移动；正式版允许将**任何及全部移动**视为飞行。 |
| 12 | `cb_briareos_frame` 布里阿柔斯骨架深化改造 | `source/cn/core-bonuses.json` | `As long as your mech has no more than 1 Structure, you gain Resistance to all damage. ... until you rest or perform a Full Repair, at which point your mech can be repaired normally.` | `只要你的机甲结构值只剩1点，你对所有伤害也有抗性。…在休息或进行全面维修前也不能回复HP。` | ① `no more than 1` 是 **不超过 1 点（含 1 点与 0 点结构）**，写「只剩 1 点」导致 0 结构苟活状态下字面失去抗性；② 漏译尾句「届时你的机甲可以如常修复」。 |
| 13 | `cb_fomorian_frame` 弗莫尔骨架深化改造 | `source/cn/core-bonuses.json` | `You can't be knocked Prone, pulled, or knocked back by smaller characters, regardless of what system or weapon causes the effect.` | `无论是甚么系统或是武器的效果，也不能让比你小的角色击倒伏卧、拖行或击退。` | 被动语态颠倒，中文读作「不能把比你小的角色击倒/击退」，应改为「**你不会被体型小于你的角色击倒伏卧、拉动或击退**」。 |
| 14 | `cb_integrated_weapon` 武器一体化 | `source/cn/core-bonuses.json` | `fired 1/round as a free action when you fire any other weapon on your mech.` | `每轮一次，当你使用机甲上的任何武器攻击时，可以自由动作来使用这武器攻击。` | 漏译 **`other`（其他）**，字面上允许该武器发射时自我触发再打一发。 |
| 15 | `cb_the_lesson_of_transubstantiation` 体变之训 | `source/cn/core-bonuses.json` | `If that space is occupied, you reappear in the nearest available free space (chosen by you).` | `如该空间被占，你将在任意最近的空间重现。` | 漏译 **`available free space`（可用的空闲空间）** 与 **`chosen by you`（由你选择）**。 |

### 1.4 天赋、背景与触发实质错漏（11 项）

| # | 条目 ID / 名称 | 所在源文件 | 英文原文 | 当前车卡器错误文本 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 16 | `t_infiltrator` 潜行者 II（埋伏） | `source/cn/talents.json:725` | `the first attack roll of any type that you make sends your target reeling on a hit. Your target must succeed on a Hull save...` | `你第一次的攻击会让你的目标滚倒。你的目标须通过机体豁免…` | ① **漏译 `on a hit`（命中时）**；② 漏译 `attack roll of any type`（任意类型攻击掷骰，含科技攻击）；③ `reeling` 误译为「滚倒」（易误判为直接伏卧）。 |
| 17 | `t_heavy_gunner` 重炮手 I & III（掩护火力 / 夹叉火力） | `source/cn/talents.json:641,658` | Rank I: `...for half damage, Heat, or Burn, and then this effect ends.` / Rank III: `damage from one target only ends the effect on that target.` | Rank I 漏末句；Rank III：`而对其中一个目标的伤害只会结束对该目标的效果。` | ① Rank III **主客体译反**：原意是「其中一个目标**对你造成的伤害**只会结束对该目标的效果」，误译成「对目标造成的伤害」；② Rank I 漏译反应攻击后「**随后此效果结束**」。 |
| 18 | `t_leader` 领袖 II（公开频道） | `source/cn/talents.json:810` | `as a reaction at the start of any other player's turn, any number of times per round.` | `可在其他任何角色的回合开始时，不受数量限制地以反应下指令。` | 将 **`any other player's turn`（其他任何玩家的回合）** 误扩为「其他任何角色」，错误允许在敌方 NPC 回合开始时用反应临时发骰。 |
| 19 | `t_stormbringer` 兴风者 III（洪流） | `source/cn/talents.json:1006` | `become Stunned until the end of their next turn, and be knocked Prone.` | `受到2d6爆炸、晕眩并被击倒伏卧。` | **漏译晕眩持续时间** `直到其下一回合结束`（晕眩无默认自动结束时间）。 |
| 20 | `t_hacker` 骇客 I & II（雪崩 / 骇./杀） | `source/cn/talents.json:587,601` | Rank I: `be pushed 3 spaces` / Rank II: `until the mech is either Shut Down or its core computer is rebooted...` | Rank I：`移动3格` / Rank II：漏关机条件 | ① Rank I 将强制位移 **`被推动 3 格`** 译成普通「移动 3 格」（交战/固定/反应判定完全不同）；② Rank II `骇./杀` 漏译「**直到机甲关机，或…**」。 |
| 21 | `t_siege_specialist` 攻城专家 I（风钻） | `source/cn/talents.json:879` | `dealing 10 AP Kinetic damage to a Size 1 section of any object within Range ... knocked back from it by 2 spaces` | `对任何在射程范围内的大小1物件…造成10动能AP伤害。任何邻接目标的角色也会被击退2格…` | ① 将 **`任意物件的一个大小 1 部分`** 误限缩为「大小 1 物件」（变成不能炸大小 2+ 建筑/掩体）；② 漏译击退方向 **`从该物件处（from it）`**。 |
| 22 | `t_engineer` 工程师 I & II（原型 / 修正） | `source/cn/talents.json:391`、`tools/build-data.js:67` | Rank I: `Main [Melee, CQB, Rifle, Cannon, Launcher, Nexus] ... Kinetic, Explosive or energy.` / Rank II: `choose two:` | Rank I：`主 特殊武器…自选伤害类型` / Rank II：`可选择以下最多两项：` | ① Rank II 原文要求选满**两项**，`rules.js:182` 也强制校验 `count !== 2` 报错，但说明写「最多两项」误导玩家；② Rank I 应列明 6 种可选武器类型和 3 种伤害类型（动能/爆炸/能量）。 |
| 23 | `t_executioner` 处刑人 I & III（回锋斩 / 无处可逃） | `source/cn/talents.json:431,447` | Rank I: `different character` / Rank III: `reroll it against a different target` | Rank I：`另一个敌人` / Rank III：`对…另一个目标重新进行攻击` | Rank III 原文是 **`重掷该次攻击（reroll it）`**（不重复消耗装填/受限/自身热度），译成「重新进行攻击」易造成二次消耗；Rank I `character` 宜按原文译为「角色」。 |
| 24 | `t_hunter` 猎人 I、`t_gunslinger` 枪侠 II、`t_nuclear_cavalier` 核子游侠 I–II、`t_drone_commander` 无人机指挥官 III、`t_vanguard` 先锋 III | `source/cn/talents.json` | 见右侧说明 | 见右侧说明 | 5 处关键限定词补齐：① 猎人 I `攻击前直接朝该目标角色飞行最多3格`（补 `directly towards the targeted`，消除「攻击前往角色」断句歧义）；② 枪侠 II 补 `一件（a single）远程副武器`；③ 核子游侠 I/II 明确为 `第一次…攻击掷骰（first attack roll）`；④ 无人机指挥官 III 明确 `从该目标延伸至其射程3内的另一名队友`；⑤ 先锋 III 明确 `进入、离开或移出你威胁范围内的空间（spaces）`。 |
| 25 | `pbg_far_field_team` 远场小队 | `source/cn/backgrounds.json:36`、`assets/js/wizard.js:9-15` | `Survive, Investigate, Spot, Charm` | `触发例子：求生、调查、取得某物、魅惑` | 推荐触发把 **`入微观察`（Spot）** 错写成了「取得某物」；且 `wizard.js` 宜优先读取结构化 `bg.skills`。 |
| 26 | `sk_charm` 魅惑、`sk_act_unseen_or_unheard` 销声匿迹、`sk_get_a_hold_of_something` 取得某物 | `source/cn/section-1-building-pilots-and-mechs.json` | `talk someone down` / `unholstering your gun` / `can't be used for something that's normally gated by license level` | `贬低别人` / `夺枪` / 漏牌照限制 | ① 魅惑 `talk someone down` 是「劝阻/安抚他人」而非「贬低别人」，并补回对交火敌兵无效的限制；② 销声匿迹 `unholstering your gun` 是「悄悄拔枪」而非「夺枪」；③ 取得某物补回「不能用于获取受牌照等级限制的装备（如机甲部件）」。 |

### 1.5 核心武器、模块与机甲系统实质错漏（9 项）

| # | 条目 ID / 名称 | 所在源文件 | 英文原文 | 当前车卡器错误文本 / 结构 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 27 | `mw_tachyon_lance` 迅子长枪 | `source/lancer-data/weapons.json`、`source/i18n/zh/weapons-2.json` | `on_attack` 无频率限制，3.1.7 无 `actions` | 额外含 `actions[0]`：`迅子长枪后焰 每轮1次` | 旧版数据残留的 `actions[0]` 既与上方 `攻击时：` 整段重复，又凭空捏造了原书不存在的 **`每轮1次`（1/round）** 限制。应按 3.1.7 移除该冗余 `actions`。 |
| 28 | `mw_annihilation_nexus` 湮灭巢房 | `source/i18n/zh/weapons-2.json:37,39` | `either yourself or any of your Drones within Sensors.` | `你自己或你感应范围内的任何无人机上。` | 漏译无人机归属限定 **`属于你的（your）`**，字面上允许借敌方或队友无人机做爆发 2 AP 中心。 |
| 29 | `mw_bristlecrown_flechette_launcher` 刺鬃冠镖弹发射器、`mw_mimic_gun` 拟态枪、`wm_shock_wreath` 电击环 | `source/i18n/zh/weapons-1.json:26`、`weapons-2.json:45`、`misc.json:14` | `Grappled` / `each of your turns after the first` / `already is suffering from burn, it can additionally...` | `被擒拿` / `在第一回合之后你每个回合开始时` / 漏 `此外还` | ① 刺鬃冠：`Grappled` 包含擒拿双方（含主动擒拿我方的敌人），宜译「处于擒拿中的目标」；② 拟态枪：明确「在你的第一个回合之后，每当你回合开始时」；③ 电击环：明确「若目标此前已处于燃烧，则此外还只能对邻接空格建立视线」。 |
| 30 | `ms_caltrop_launcher` 蒺藜发射器 | `source/i18n/zh/systems-1.json`、`source/lancer-data/systems.json` | `Quick Action` — `blankets a free blast 1 area within range 5` | 无 `快速动作`，正文写 `射程5内一个空旷的爆发1区域`，另带 `大小3 [无敌]` | **范围类型译错 + 漏动作**：将 **`溅射1`（blast 1）** 误译为 **`爆发1`（Burst 1）**，且旧 `deployables` 结构导致完全不显示 `快速动作` 并重复打印说明。 |
| 31 | `ms_javelin_rockets` 标枪火箭 | `source/lancer-data/systems.json`、`source/i18n/zh/systems-1.json` | `choose 3 spaces ... not adjacent`（3 个独立空格，无 Burst） | 旧 `deployables[0]` 渲染出 **`标枪火箭 火箭 · 爆发1`** | 旧快照残留的 `deployables` 带了错误的 `Burst 1`，误导玩家以为每枚火箭覆盖 3×3 范围。应按 3.1.7 移除 `deployables`。 |
| 32 | `ms_h0r_os_system_upgrade_ii` H0R_OS系统升级 II | `source/lancer-data/systems.json`、`source/i18n/zh/systems-2.json` | 两个选项均为 `Quick Tech`；`False Idol` 为 `same Size as your target` | 两个选项均**漏掉 `快速科技`**，且「伪像」标题栏写死 **`大小2`** | 旧快照把两个科技动作存在 `deployables` 中，`actsHtml` 丢弃了 `Quick Tech`，并把伪像错误标为固定 `大小2`（与正文「与目标大小相同」冲突）。应按 3.1.7 迁回 `actions`。 |
| 33 | `ms_armor_lock_plating` 装甲锁定镀层 | `source/i18n/zh/systems-1.json` | `when you Brace, you gain the following benefits until the end of your following turn:` | `当你受身时，直到你再下一回合结束前得到以下好处：` | 受身是在他人回合触发的反应，`your following turn` 即接下来到来的「**你的下一回合结束**」（与受身自身惩罚同周期），译成「再下一回合」把持续时间翻倍了。 |
| 34 | `ms_reinforced_cabling` 强化缆绳、`ms_clamp_bombs` 夹钳炸弹 | `source/lancer-data/systems.json` | `Grapple Swing`: `Free Action` / `Launch Clamp Bombs`: `Quick Action` | `钩索摆荡` 漏掉 **`自由动作`**；`夹钳炸弹` 漏掉 **`快速动作`** | 强化缆绳 `actions[0].activation` 为 `"None"`（3.1.7 为 `"Free"`）；夹钳炸弹存在 `deployables` 导致不显示 `快速动作`。 |
| 35 | `ms_turret_drones` 炮塔无人机 | `source/i18n/zh/systems-1.json` | `which can be taken once for each deployed turret drone.` | `每部署一架炮塔可额外使用一次该反应。` | 「额外使用一次」易被误读为「基础 1 次 + 每架炮塔 1 次 = 1 炮塔用 2 次」，应与下方部署物说明统一为「每架已部署的炮塔无人机每轮可使用一次」。 |

---

## 第二类：车卡器前端渲染、动作遗漏与构筑校验缺陷（14 项 · 建议一并修复）

1. **5 件驾驶员装备在 UI 中完全丢失动作消耗（`assets/js/app.js:320-325` + `tools/build-data.js:98-100`）**：
   - `修复胶`（`pg_corrective`，**完整动作**）、`补丁`（`pg_patch`，**完整动作**）、`刺激物`（`pg_stims`，**快速动作**）、`铝热炸弹`（`pg_thermite_charge`，原书铺设为**完整动作**、遥控引爆为快速动作）、`睡袋`（`pg_sleeping_bag`，原书钻入为**完整动作**）：因 `gearInfo` 在 `Z.gear[name].html` 存在时直接早退跳过 `actsHtml(g)`，且 `build-data.js` 丢弃了 `source/cn/gears.json` 的 `tag` 字段，导致界面只显示 `受限X`，动作消耗全部消失。
2. **6 个可展开机甲系统在 UI 中丢失部署动作类型（`assets/js/app.js:547` + `source/i18n/zh/systems-*.json`）**：
   - `actsHtml` 仅在 `d.type === 'Drone'` 时显示部署动作，导致 `埃癸斯护盾发生器`、`便携式地堡`、`网颚陷阱`、`静滞护盾`、`A型耶利哥可展开掩体`、`周边指令基板` 在系统详情与系统库中均看不到部署所需的 **`快速动作`**（及耶利哥收起的 `完整动作`、静滞护盾关闭的 `快速动作`）。
3. **`mf_hydra` 多头蛇四部大蛇无人机渲染出 `None部署` 与未进机甲页时的 `NaN HP`（`assets/js/app.js:547` + `source/lancer-data/frames.json`）**：
   - `mf_hydra` 部署物 `activation` 为 `"None"`，`actsHtml` 输出 **`无人机 · None部署`**；且当 `STAT_CTX` 为空时 `Number(statVal("5 + {grit}"))` 计算出 **`NaN HP`**（同时全局 `STAT_CTX` 在切换至公共「武器表」时会把多头蛇/无人机指挥官的 `+5 HP` 污染到公共武器表的 `妖鬼巢房` 上）。
4. **`mf_drake` 德瑞克核心系统底部多出空白卡片「堡垒掩体」，`mf_saladin` 萨拉丁「扭曲护盾」漏显示 `反应` 且「防御脉冲」重复（`source/lancer-data/frames.json`）**：
   - 德瑞克 `active_deployables[0]` 无中文 `detail` 渲染为空框；萨拉丁 `traits[2].actions[0].activation` 为 `"None"` 漏掉 `反应`，`active_actions[0]` 与 `active_effect` 重复且漏 `1/round`。
5. **核心系统「被动动作」位置错放且在 PNG 机甲卡上完全空白（`assets/js/frame-catalog.js:25-26`、`assets/js/cardexport.js:275-278`）**：
   - 牛头怪「超空间翘曲迷宫」与德川「超频」的规则在 `passive_actions` 中，`frameRulesHtml` 上方「被动」栏留空、却把动作放到 `1 CP` 主动能力下方（同时影响黄蛱蝶、天马、多头蛇，易误以为需花 1 CP 才能用）；导出 PNG 机甲卡时 `drawMechCard` 未读 `passive_actions` / `active_actions`，导致牛头怪与德川被动栏输出空白。
6. **核心骨架内建武器在「骨架目录预览」中不显示，且「末日导轨」在摘要栏与 PNG 卡显示 `射程：无`（`assets/js/frame-catalog.js:50`、`assets/js/app.js:572,726`、`assets/js/ui.js:330`、`assets/js/cardexport.js:207`）**：
   - 骨架目录预览未渲染 `f.core_system.integrated`（巴巴罗萨正文写「见下方内建武器」但下方无内容）；且所有摘要行和 PNG 卡只取 `profiles[0]`，导致巴巴罗萨「末日导轨」（`profiles[0]` 为末日骰 4 无法发射）显示为 `射程：无`、无伤害，充能 1–3 数据与多模式武器（突击加农炮、利维坦、攻城炮、ZF4）的第二模式及自动荚舱/斩首炮/妖鬼巢房的动作/无人机在 PNG 卡上全部丢失；ZF4 固态堆芯同一段充能说明在展开详情中重复打印 4 遍。
7. **全部 8 件核心武器模块的「适用武器类型 / 禁用尺寸」在界面中完全不可见（`assets/js/app.js:393,582`、`assets/js/system-library.js:51`）**：
   - 如高热炸药/电击环仅限 `近战`、稳定器模块仅限 `发射器/大炮`、过穿螺旋弹仅限 `CQB/大炮/步枪`、老爹级禁止 `超重型`：数据只在槽位过滤生效，牌照列表、系统与改装库、模块详情均未展示安装限制。
8. **`wm_paracausal_mod` 非因果律模块暴露内部隐藏标签 `不可减免`（`assets/js/app.js:75` / `source/lancer-data/mods.json`）**：
   - `HIDDEN_TAGS` 未包含 `tg_irreducible`（3.1.7 已移除该标签），安装后界面直接显示 `不可减免` 且悬停弹出开发注释「禁止任何来源的伤害减免（隐藏标签）」。
9. **自稳定承力点等核心奖励的三处状态与校验漏洞（`assets/js/rules.js:127,129`、`assets/js/app.js:729,880`、`assets/js/foundry-export.js:74-76`）**：
   - ① 文字卡 `sheetText` 第 729 行重复输出 `(+1准度)　+1准度`；② 移除核心奖励时未清理 `m.stabilized` / `m.overpower` / `m.retrofit` / `m.signature`，导致文字卡和 Foundry 导出备注残留已移除的核心奖励；③ `buildWeaponNote` 未检查 `!entry.w.no_core_bonus`（拟态枪、重力枪被误标 `+1准度`，鬼面蛾还给不作攻击掷骰的重力枪误标 `远程攻击检定+1`）。
10. **多模式远近混合武器与工程师降级校验细节（`assets/js/rules.js:101,130`）**：
    - `effectiveProfile` 判断 `weapon_types` 时只读父武器 `w.type` 未优先读当前模式 `base.type`（如 96 型盾炮的大炮模式被裘格斯误加威胁）；`buildWeaponNote` 对原型武器「调整光学」漏判 `entry.w.talent_rank >= 2`（工程师从 II 降回 I 后仍显示 `+1准度`）。
11. **`effectiveProfile` 未对模块附加的非数值标签去重（`assets/js/rules.js:112-116`）**：
    - 给已有 `重火器`/`杀绝`/`智慧`/`导引` 的武器安装赋予同名标签的模块时，显示出重复标签（如 `重火器 重火器`）。
12. **拟态枪 `type: "???"` 显示为 `重型???`（`assets/js/app.js:39`）**：
    - `T.wtype` 未映射 `"???"`（仅武器表特判为 `特殊`），机甲页、牌照页、文字卡与 PNG 卡均显示 `重型???`；且拟态枪按规则兼具全部远程武器类型（`types: ["CQB","Rifle","Launcher","Cannon","Nexus"]`）。
13. **系统库「动作」筛选器漏掉全部 18 个纯科技系统并将 5 个主动系统误归为「被动」（`assets/js/system-library.js:20-25,46`）**：
    - 筛选下拉框缺少 `快速科技 / 完整科技 / 入侵` 选项，且耶利哥掩体、周边指令基板、闪光炸药、浩劫炸药、滚筒炸药因缺少顶层动作标签被归入 `被动／未标明动作`。
14. **旧版冗余 `actions` / `deployables` 导致 15 个核心系统/模块/武器在详情框中整段重复打印两遍**：
    - 模块：`wm_uncle_class_comp_con`、`wm_throughbolt_rounds`；武器：`mw_autogun`（及前述 `mw_tachyon_lance`）；系统：`ms_comp_con_class_assistant_unit`、`ms_expanded_compartment`、`ms_sekhmet_class_nhp`、`ms_roland_chamber`、`ms_perimeter_command_plate`、`ms_retractable_profile`、`ms_lb_oc_cloaking_field`、`ms_h0r_os_system_upgrade_iii`、`ms_explosive_vents`。另文字角色卡 `sheetText` 输出核心奖励时未剥离 `<p><i>…</i></p>` 斜体风味诗句，且未输出驾驶员护甲/装备规则。

---

## 第三类：v3.5 术语一致性、旧译名残留与错别字（10 组 · 顺手清理）

1. **`盾牌`（Shield）与 `护盾`（Overshield）术语消歧**：
   - `T.stype.Shield`（`app.js:43`）与 `SYSTEM_LIBRARY_TYPES.Shield`（`system-library.js:4`）写为 `护盾`，与 `tg_overshield` / `glossary.js:94` 的 `护盾`（临时额外 HP）撞车，导致阿刻索稳定器显示 `护盾 [受限3] [护盾] [盾牌]`，且所有盾牌系统正文里的「护盾」悬停都会错误弹出临时 HP 规则。建议将 `Overshield` 在术语提示中明确区分（或将盾牌系统的类型标签统一为 `盾牌 / 防护盾`，避免误标非临时 HP 的盾牌描述）。
2. **`Jammed` 异体译名 `干扰` → 统一为 v3.5 `受扰`**（以恢复术语高亮与悬停）：
   - 涉及 `mf_lancaster`、`mf_raleigh`、`ms_aceso_stabilizer`、`ms_stuncrown`、`ms_h0r_os_system_upgrade_i`、`ms___scorpion_v70.1`。
3. **`Exposed` 异体译名 `曝露` → 统一为 `暴露`**：
   - 涉及 `mf_tokugawa`（界限突破、辉光、超频）。
4. **`Overcharge` 异体译名 `超频` → 统一为 v3.5 `超限`**（避免与德川 `Overclock`「超频」混淆）：
   - 涉及 `mf_goblin`、`mf_napoleon`、`ms_sekhmet_class_nhp`。
5. **`Line X` 正文残留 `直线X` → 统一为 v3.5 `线形X`**：
   - 涉及 `mf_drake`、`mw_sherman_integrated`、`mw_plasma_thrower`、`mw_prototype_2/3`、`mw_impact_lance`、`wm_throughbolt_rounds`、`ms_portable_bunker`、`ms_magnetic_shield`、`ms_havok_charges`、`ms_stasis_barrier`、`t_engineer` II。
6. **因 HTML 标签隔断或单字用法残留的 `肉搏` / `远距` / `攻击检定`**：
   - 涉及 `t_duelist`（`<b>主肉搏</b>武器`）、`t_gunslinger`、`t_nuclear_cavalier`、`t_walking_armory`、`mw_prototype_1~3`、`tg_smart`、`mf_deaths_head`、`mf_tokugawa` 及 8 个系统的 `远距`/`肉搏`/`攻击检定`（v3.5 为 `近战`/`远程`/`攻击掷骰`）。
7. **v3.5 改名后正文中残留的短旧译名（`< 4` 字未被 `core-v35.js` 自动替换）**：
   - 骨架：`黑巫`→`黑巫蛾`（`mf_black_witch`）、`暮翼`→`珠弄蝶`（`mf_dusk_wing`）、`巴罗尔`→`炎魔`（`mf_balor`）、`九头蛇`→`多头蛇`（`mf_hydra`）、`飞马`→`天马` & `全能炮`→`巫沙布提万物枪`（`mf_pegasus`，顺便补上原书风格前缀 `[ERROR]`）。
   - 武器与模块：`突击炮`→`突击加农炮`（`mw_assault_cannon`）、`斩首枪`→`斩首炮`（`mw_vorpal_gun`）、`歼灭者`→`湮灭者`（`mw_annihilator`）、`恶鬼无人机`→`妖鬼无人机`（`mw_ghast_nexus`）、`飞弹`→`导弹`（`mw_pinaka_missiles`）、`贯穿弹`→`过穿螺旋弹`（`wm_throughbolt_rounds`）、`花环`→`电击环`（`wm_shock_wreath`）。
   - 系统与装备：`止血贴`→`补丁`（`pg_patch`）、`使用战斗药`→`使用刺激物`（`pg_stims`）、`快枪手骰`→`枪侠骰`（`t_gunslinger`）、`塞赫美特`→`塞赫麦特`、`阿耆尼`→`阿格尼`、`木桩`→`标桩`（`ms_charged_stake`）、`停滞弹/停滞点`→`静滞插销`（`ms_stasis_bolt`）等。
8. **跨条目重名提示（供确认是否保留原书译名）**：
   - `ms_stasis_barrier`（拿破仑 I 级系统 `Stasis Barrier`）与 `cb_stasis_shielding`（HA 核心奖励 `Stasis Shielding`）在 v3.5 覆盖层均译作 `静滞护盾`；`t_walking_armory` 二阶弹药 `Jager` 译作 `猎人`（与天赋 `Hunter` 重名）；`ms_puppetmaster` 动作 `Electropulse` 译作 `EMP脉冲`（与蝎尾狮 `EMP Pulse` 重名）。
9. **`tg_reliable`（可靠）措辞微调**：
   - `永远造成{VAL}点伤害` → `至少造成{VAL}点伤害`，避免被误读为伤害锁死为固定值。
10. **原文错别字与 HTML 小瑕疵**：
    - `t_engineer` II 多余空 `<li>` 圆点、`t_ace` I 英文句点、`t_brawler`（`回重设为6`→`会`、`来只`→`来自`）、`t_duelist`（`结速前`→`结束前`、`和和`）、`t_bonded`（`幸运你`→`幸运地`）、`t_exemplar`（`在这其间`→`期间`）、`pg_corrective`（`修服`→`修复`）、`pg_wilderness_survival_kit`（`修服贴`→`修补贴`）、`pg_personal_drone`（`机定性`→`机动性`）、`pg_infoskin`（`合性`→`合成`）、`pbg_spec_ops`（`独很侠`→`独行侠`）、`pbg_noble`（`unless you return home` 误译为 `除非你身份显赫`，应为 `除非你返回故乡`）。
