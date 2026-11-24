# Foundry VTT 扩展内容同步与修复任务单（供 FVTT 窗口并行处理 · 2026-11-24）

> **双窗口并行分工约定（文件集合严格不相交，避免写入冲突）**
> - **车卡器窗口**只修改：`source/expansions/all-expansions.js`、`source/expansions/professional-licenses.js`、`source/lore/zh.json`、`source/npc/README.md`、`tools/build-data.js`、`tools/build-official-supplements.js`、`tools/test-rules.js`、`tools/test-expansion-copy.js`、`tools/test-foundry-export.js`、`assets/js/*`（含重生成的 `assets/js/data.js` 与 `assets/js/official-supplements.js`）。
> - **FVTT 窗口（本文件执行方）**只修改：`source/fvtt/*`（含 `zh-overrides.json`、`zh-npc.json`、`official-map.json`、`ext-actions.json`、`ext-deployables.json`、`module/*`）、`tools/build-lcp.js`、`tools/draft-ext-actions.js`、`tools/build-fvtt-module.js`、`tools/test-lcp.js`、`tools/test-fvtt-module.js`、`dist/fvtt/*`、`docs/FVTT-*.md`。
> - **建议执行顺序**：FVTT 窗口可**立即并行修改**下方 **第一部分（FVTT 字典文件）**、**第二部分（`build-lcp.js` 合并逻辑与动作/部署物补全）** 与 **第三部分（`lancer-cn.mjs` 自动化修复）**；待车卡器窗口完成 [EXPANSION-AUDIT.md](EXPANSION-AUDIT.md) 修正并重生成 `assets/js/data.js` 后，FVTT 窗口最后执行一次 `node tools/build-lcp.js` 与 `node tools/build-fvtt-module.js` 即可完成全套扩展包对齐。

---

## 第一部分：FVTT 专属字典文件错误（现在即可独立修改）

### 1.1 `source/fvtt/zh-overrides.json` 规则错译、译名断链与标点笔误（11 项）

以下问题位于 FVTT 专属补译文件 `source/fvtt/zh-overrides.json` 中（车卡器数据不会覆盖它们）：

1. **`ms_rewrite` 反线性时间 · `actions[0].detail`（第 334 行）—— 严重规则错误：凭空多出「选择你自己」+ 状况/状态混译**
   - **英文原文**：`"Choose a character in Sensors and line of sight. They clear all conditions other than Stunned that weren't self-inflicted, and you immediately receive all conditions they cleared until the end of your next turn."`
   - **当前错误文本**：`"选择你自己，或感应及视线范围内的另一名角色。目标清除除晕眩以外、所有并非自身造成的状态；你立即承受其清除的全部状态，直到你的下一回合结束。"`
   - **问题与修正**：巫妖牌照的 `时裂` / `死缓` 写了 `Choose yourself or another character`，但 `反线性时间` 原文**不能指定自身**（角色不处于自身视线与感应内，且对自己用会立刻把清掉的状况贴回自己身上延长一回合）；同时两处 `状态` 应为 **`状况`**（避免误导玩家拿去清「暴露」等状态）：
     ```json
     "actions[0].detail": "选择感应及视线范围内的一名角色。目标清除除晕眩以外、所有并非自身造成的状况；你立即承受其清除的全部状况，直到你的下一回合结束。"
     ```

2. **`ms_blink_charges` 霎间炸药 · `actions[0].detail`（第 356 行）—— 与官方勘误冲突（误锁死为单目标）**
   - **英文原文 + Pilot NET 官方勘误**：勘误明确为 `"choose any characters within the affected area"`（可同时瞬间移动溅射区域内的任意复数角色）。
   - **当前错误文本**：`"投掷一枚射程5、溅射3的手榴弹。落点确定时，选择区域内的任意一名角色，将其瞬间移动至同一区域内的任意有效空格。不情愿的角色可以通过工程豁免避免此效果。"`
   - **修正**：删去汉字 `一名`（注意保持阿拉伯数字 `5` 和 `3` 不变，确保 `test-lcp.js` 数字集合检查通过）：`"…选择区域内的任意角色，将其瞬间移动至同一区域内的任意有效空格…"`。

3. **`t_black_thumb` 黑拇指 · `ranks[1].actions[0..4]`（第 88、92、94、96 / 407–415 行）—— 内部动作名断链 + 骑乘重名 + 状况误译为状态**
   - `ranks[1].actions[0].detail` 写 `效果同血肉化钢`（车卡器等级 I 名称为 **`血肉金甲`**），把马术表演（`Rodeo`）译成 **`骑乘`**（与针对敌机的核心动作 `Jockey 骑乘` 重名混淆，建议统一为 **`马术表演`**），且末句写 `只能采取黑拇指赋予的<b>灭火</b>、<b>战地维修</b>或<b>调整排气口</b>动作`，与紧接着自己定义的动作按钮名 **`扑灭`**、**`战场修复`**、**`操控排气阀`** 完全不一致！
   - 三个子动作 `detail` 中 `清除缓慢或固定中的一种状态。自身造成的状态不能用此动作清除` 对应英文 `Conditions`，应将全部 `状态` 改为 **`状况`**。

3b. **`mf_orator` 演说家计数器下限（`ssmr/talents.json:442`）**：
   - 官方上游数据中 `ctr_voice_of_reason` 的 `min` 误设为 `1`，导致 FVTT 角色卡上演说骰无法减到 `0`。建议在覆盖导出时将其 `min` 修正为 **`0`**。

4. **`mf_minotaur_alt_wraith` 金盏花（第 63、68、70 行）—— 同段译名分裂 + HTML 引号笔误**
   - 第 63 行 `traits[0].synergies[0].detail` 开头把 `Void Husk` 译作 `空壳`，句末却写成 `金盏花可以创造任意数量的残壳`（第 70 行 `active_actions[0].detail` 也写了 `残壳`），应统一为 **`空壳`**。
   - 第 68 行 `"core_system.active_actions[0].name": "驱入&ldquo;天穹&ldquo;"` 第二个引号误用了左引号实体 `&ldquo;`，应改为 **`&rdquo;`**（或直接用中文引号 `“天穹”`）。

5. **`mf_black_witch_alt_orchidea` 红门兰（第 35 行）—— HTML 引号笔误**
   - `"core_system.passive_actions[0].detail"` 中 `&ldquo;冥顽&ldquo;` 闭引号误写为 `&ldquo;`，应改为 **`&rdquo;`**。

6. **`mf_tokugawa_alt_enkidu` 恩奇都（第 89 行）—— 自身反应名断链**
   - 第 88 行 `"core_system.active_actions[0].name"` 为 `"一刀两断"`，第 89 行 `detail` 却写 `"你将<b>一分为二</b>目标"`，应统一为 **`一刀两断`**。

7. **`mw_d_d_288` D/D288（第 233 行）—— 模式名断链**
   - `actions[0].detail` 两处引用 `“已充能”模式`，而武器第二模式 `profiles[1].name` 导出后为 **`“充能”`**，建议统一为 `“充能”` 模式。

8. **`ms_pebcac` 人因故障（第 243 行）—— 段首多余冒号 + v3.5 术语统一**
   - `"actions[0].detail"` 开头照搬了英文上游笔误，变成 `"<p>：视线及感应范围内…停止NHP 级联…"`。建议去掉段首 `：`（改为 `"<p>视线及感应范围内…"`），并将 `停止NHP 级联` 统一为 v3.5 术语 **`停止 NHP 层流`**。

9. **`ms_stay_of_execution` 死缓（第 347 行）—— `状态` → `状况`**
   - 括号示例 `原本在回合结束时消失的状态会延后至再下一回合结束` 对应英文 `conditions that would expire at the end of their turn`，建议改为 `原本在其回合结束时结束的状况会延后至再下一回合结束`。

10. **`mf_worldkiller_genghis_mk_i` 灭世成吉思（第 18 行）—— 指代消歧**
    - `traits[0].actions[0].detail` 中 `最多不超过其当前热度`（英文 `up to its current Heat`）指灭世成吉思**自身**当前热度（而非被擒拿目标的热度），建议写明 `最多不超过灭世成吉思的当前热度`。

11. **为 5 个单部署物官方装备在 `zh-overrides.json` 显式补齐完整的 `deployables[0].detail`（高优！）**
    - 目前 `build-lcp.js` 在 `deployables.length === 1` 时会用 `all-expansions.js` 里 20~40 字的简短摘要直接覆盖掉官方 `deployables[0].detail` 的数百字完整规则，导致玩家把部署物拖上 FVTT 地图打开卡面时丢失几乎全部核心规则：
      1. **`mw_legion_nexus`（军团巢房）**：官方 899 字符规则（协定移动 3 格、压制协议、突击阵位、命中 +2 伤害）被覆盖成 21 字摘要；
      2. **`ms_smokestack_heatsink`（冷源）**：官方 587 字符规则（全来源吸热、6 热爆炸、敏捷豁免、**物件与可展开物自动受击**）被覆盖成 25 字摘要；
      3. **`ms_ferrospike_barrier`（铁磁钉壁）**：官方 498 字符规则（固化前不阻挡、固化后 20 HP 硬性掩护、固化后每轮首次移入受 1d6 AP 动能、唯一部署新替旧）被覆盖成 38 字摘要；
      4. **`ms_utility_drone`（多功能无人机）**：官方 482 字符规则（爆发 2 敌 +1 难度 / 友 +1 准度、不叠加、快速动作重部署、不可召回）被覆盖成 42 字摘要；
      5. **`ms_omnibus_plate`（万用基板）**：官方 391 字符规则（**全伤害抗性**、**爆发/溅射大小 +1**、**邻接效果扩展至射程 2**）被覆盖成 36 字摘要，三大核心增益在部署物卡上完全消失！
    - 请在 `zh-overrides.json` 中为这 5 个 ID 显式写入完整的 `"deployables[0].detail"`（及 `"deployables[0].name"`）。

---

### 1.2 `source/fvtt/zh-npc.json` 与未覆盖官方条目核查（2 项）

1. **`source/fvtt/zh-npc.json:94`（`npcf_operatives_spec_op` 特战干员）—— NPC 模板译名未对齐 v3.5**
   - 现文：`"此外，特战队员不能采用杂兵、精英或究极模板。"`
   - 核心规则书 v3.5 与 `assets/js/npc-classes.js` 中 `Grunt` 为 **`低等兵`**、`Ultra` 为 **`超体`**。请改为：`"此外，特战队员不能采用低等兵、精英或超体模板。"`（其余 `zh-npc.json` 条目经逐条比对官方英文无遗漏字段、数值与占位符全部正确）。

2. **`docs/FVTT-OFFICIAL-UNCOVERED.md`（58 个官方未覆盖条目）分类核实与 `ms_spaceborn_1` 补译建议**
   - 经脚本逐条核验全部 58 个未覆盖官方条目：其中 **57 个均为战役专属异域装备/勋章**（14 把 `tg_exotic` 武器、18 个 `tg_exotic` 系统、1 个 `tg_exotic` 模块、1 个战役勋章核心奖励 `cb_order_of_leander`、23 件战役异域驾驶员装备与常青镇甲壳防护服），车卡器按设计不收录战役掉落物。
   - **唯一 1 个常规玩家构筑会触发的条目是 `ms_spaceborn_1`（`Spaceborn EVA`，出自 `long-rim/systems.json`）**：它是官方天赋 `t_spaceborn`（太空民 1 级）`ranks[0].integrated` 自动挂载的内置系统！（车卡器侧本次也会补入 `ms_spaceborn_1` 内建条目，FVTT 窗口在 `official-map.json` 加入 `"ms_spaceborn_1": "ms_spaceborn_1"` 或在 `zh-overrides.json` 补译即可彻底汉化）。
   - **清单外遗漏的 1 个官方扩展标签：`tg_efficient`（`Efficient`，出自 `source/fvtt/official/ktb/tags.json`）**：因 `build-lcp.js` 与 `export-official-todo.js` 的扩展 `KINDS` 未包含 `"tags"`，该官方扩展标签既未被汉化为 `高效`，也未出现在未覆盖清单中，建议在扩展包导出 `tags.json` 中一并覆盖汉化。

---

## 第二部分：`tools/build-lcp.js` 与 `ext-actions.json` / `ext-deployables.json` 构建改进点（6 项）

1. **修复 `overlayText` 向官方顶层空字段写入重复文本的 Bug（`tools/build-lcp.js:476` · 影响 35 个官方装备）**
   - 官方补充书 JSON 将绝大多数主动/科技/多模式装备的规则仅放在 `actions[].detail`、`profiles[].effect/on_hit/on_attack` 或 `deployables[].detail` 中，顶层 `effect / on_hit / on_attack` 为 `undefined`。
   - 当前 `overlayText` 写了 `if (typeof val === "string" && CJK.test(val) && (dst[f] === undefined || typeof dst[f] === "string")) dst[f] = html(val);`，导致 **35 个官方武器/系统**（如 `mw_integrated_shock_claws`、`mw_bolt_nexus`、`mw_ferrofluid_lance`、`mw_emperor_integrated`、`mw_caliban_integrated`、`mw_slag_cannon`、`ms_spear_charges`、`ms_pebcac`、`ms_the_imperial_eye`、`ms_ayah_of_the_syzygy`、`ms_camuss_razor`、`ms_purifying_code`、`ms_distort` 等）在 FVTT 装备卡上把整段规则在顶层打印一遍、又在下方动作/模式框里重复打印一遍！
   - **修正建议**：在覆盖官方条目（`overlay`）时，顶层文本字段仅当官方原记录本身非空（`typeof dst[f] === "string" && dst[f].trim() !== ""`）时才用车卡器顶层文本覆盖（子结构照常由 `zh-overrides.json` / 对齐后的数组覆盖）。

2. **GMS 变体骨架 `mf_chomolungma` 与 `mf_sagarmatha` 的附加说明矛盾**
   - `build-lcp.js` 当前为所有 `variant_of` 骨架统一追加 `【车卡器说明】变体骨架：沿用埃弗勒斯的牌照，牌照等级 2 可用；与原骨架互斥`，但这两台是 `license_level: 0` 的 GMS 骨架（LL0 起无需牌照即可选用，也没有需要升到 2 级的埃弗勒斯牌照）。建议对 `source === "GMS"` 的变体改为 `【车卡器说明】GMS 变体骨架：牌照等级 0 起即可使用`。

3. **`mf_atlas` 阿特拉斯蛾与 `mf_kidd` 基德的 `traits` 下标错位风险**
   - 当前 `build-lcp.js` 按下标 `traits[i]` 将车卡器特征名/说明覆盖到官方骨架上。此前车卡器中 `mf_ext_atlas` 与 `mf_ext_kidd` 的特征排列顺序与官方不同，导致导出的 `mf_atlas` 与 `mf_kidd` 特征标题与下挂的官方 `actions` / `synergies` 张冠李戴！（车卡器侧本次也会把这两台骨架的 `traits` 顺序调整为与官方一致；FVTT 侧可在 `test-lcp.js` 加一条校验防止特征名与动作错配）。

4. **新增核心奖励 `convert("core_bonuses")` 丢失斜体风味与 HTML 列表排版 + `rankActionsZh()` 单动作多块污染（`tools/build-lcp.js:411-438, 515-520`）**
   - ① `build-lcp.js` 转换新增扩展核心奖励时只读了纯文本单段 `x.effect`，未读取 `D.zh.cb[x.name]?.html`，导致全部 20 个第三方核心奖励在 FVTT 中 `description`（风味文本）为空，且像 `cb_ext_quality_logistics`（高品质后勤）的 4 个战术选项列表被压成一整段无格式长句。建议从 `D.zh.cb[x.name]?.html` 拆分首段 `<i>...</i>` 写入 `description`、其余结构化 HTML 写入 `effect`。
   - ② `rankActionsZh()` 在 `t_iconoclast`（偶像破坏者 II，含 `内化火花` 与 `哪些动作可以触发？` 两个 `.blk` 块，但官方仅 1 个动作）上落入 `else if (acts.length === 1) a.detail = zhRank.html`，导致点击「内化火花」按钮会把整段等级正文和四条长篇 FAQ 说明一并发到聊天栏，建议按动作名称优先匹配对应的单个 `.blk` 块。

5. **26 个带动作标签的第三方系统及若干核心奖励/模块在 FVTT 中缺少动作按钮（`draft-ext-actions.js` / `ext-actions.json`）**
   - 由于 `draft-ext-actions.js` 只在正文匹配「以一个快速动作…」字样（且跳过了 `core_bonuses` 与 `mods`），26 个把动作类型只标在 `tags`（如 `tg_quick_action`、`tg_full_action`、`tg_protocol`、`tg_quick_tech`）里的第三方系统（如 `谢幕 AEM`、`矛鱼 LFCM`、`针与线`、`局部灭菌气口`、`点弹射流形簇`、`虹彩全息鳞`、`电磁感应焊机`、`巨质包`、`抑制炸药`、`潘克拉辛弃兵法套组`、`TT.7 雪盲`、`可变几何机体`、`级联雪崩模块`、`落星模块` 等），以及核心奖励 `高品质后勤 / 增强系统升级 / 招牌动作`、模块 `寻索/吞噬密罐弹`、武器 `模块化先进战斗步枪`、天赋 `剃刀人` 在 FVTT 中 `actions` 为空，没有可点击的动作按钮。
   - **建议**：在 `build-lcp.js`（或 `draft-ext-actions.js`）中，对带有动作标签但 `actions` 与 `deployables` 均为空的新增条目自动生成一个同名动作按钮；另外检查 `ms_piof_nano_ceramsite`（纳米级陶粒载体，缺停用快速动作按钮）与 `mf_piof_coriander`（香菜反应缺 `trigger`）。

6. **15 个第三方与专业牌照「榴弹/地雷二合一炸药」及可展开物件补充建议（`ext-actions.json` / `ext-deployables.json`）**
   - 第三方及苏尔丹专业牌照中的二合一炸药系统（如 `ms_pl_scan_bombs` 扫描炸弹、`ms_ext_sonic_explosives` 声波炸药、`ms_ext_ionizing_explosives` 电离炸药、`ms_ch_sling_bombs` 弹石炸弹、`ms_ch_holo_bombs` 全息炸弹及 PI-OF 各系列炸药）目前在扩展 LCP 中 `actions=0, deployables=0`，可根据需要补充榴弹快速动作与地雷可展开物（及 `mw_ch_tether` 锚定信标、`t_ext_bricklayer` 砖匠掩体）。
   - *注：已核实 `professional-licenses.js` 中的全部 43 件专业牌照武器/系统/模块均已正常导出至 `lancer-cn-expansions.lcp`（牌照条目本身通过模组「导入车卡器资料」生成，符合 `source/fvtt/module/professional-rules.json` 设计）。*

---

## 第三部分：`lancer-cn` 模组（`source/fvtt/module/scripts/lancer-cn.mjs`）扩展自动化核查与修复清单（7 项）

请检查 `source/fvtt/module/scripts/lancer-cn.mjs` 中的以下扩展自动化逻辑，修复后同步运行 `node tools/build-fvtt-module.js` 与 `node tools/test-fvtt-module.js`：

1. **天赋「演说家 II & III（`mf_orator`）」自动化存在 3 处规则错误（第 16050–16055、16220–16236 行）**
   - **① `激励（1 骰）` 准度加倍错误**：第 16050 与 16226 行写成了 `获得 +${curDice} 准度（按消耗前持有的演说家骰数计算）`（持有 3 颗花 1 颗变成给 +3 准度！）。官方规则是花费 1 颗 d6 演说骰，将该骰作为本次系统检定的准度骰（固定 **+1 准度**），且清除的对象是 **`状况（condition）`** 而非 `状态`。
   - **② `挫败（3 骰）` 残留已删除的旧测试版条款**：第 16231 行多写了 `（若其因此受到伤害或被盟友命中则提前解除）`——正式版 `@massif/ssmr-data 1.7.0` 中挫败无受伤/受击提前解除条款。
   - **③ `反间（2 骰）` 与 1/轮限制**：第 16230 行补全后半句 `也不能成为盟友系统或特性的目标`；并为 `oratorSpend` 增加 **每轮 1 次（1/round）** 校验，同时确认演说骰扣至 `0` 时回合末自动恢复（第 11932 行 `getTalentDie(actor, "orator") ?? 1` 在存值为 `0` 时正常 `+1` 变为 `1`，战斗开始时 Rank II 初始为 1、Rank III 初始为 2）。

2. **天赋「战场分析师 I–III（`t_field_analyst`）」自动化存在 3 处偏差（第 6068、10264–10302、11930–11936 行）**
   - **① `优越情报` 缺少 `2/轮` 上限追踪**：`executeFieldAnalystReaction` 调用 `consumeReaction` 时仅做了每回合反应数检查，未维护每轮最多 2 次计数器，导致在多角色回合间一轮可触发 3 次以上。
   - **② Rank II 轮末涨骰条件复用了错误的布尔值**：第 11930 行直接复用了雷利的 `!prevCs.attackedOrForcedSaveThisTurn`，但战场分析师 II 原文是「本回合未采取任何影响敌对角色的行动（扫描除外）」——例如对敌方执行**锁定（Lock On）**既非攻击也不迫使豁免，按规则**不能**涨情报骰，但现代码会错误涨骰；此外 Rank II 原文为 `you may increase... instead of by 1`（可选择只用基础 ±1 而不消耗重置高点数情报骰）。
   - **③ 多目标攻击写死只修改 `idx === 0`**（第 10278 行）：AOE 攻击命中/未命中多个目标时，无法指定调整第 2 个及之后的目标。

3. **天赋「偶像破坏者（`t_iconoclast`）」`countMechNHPs` 计数与层流检定存在 3 处 Bug（第 4073–4096、14674 行）**
   - **① 不会层流的伙伴/礼宾单元被误计入模因火花伤害（第 4089–4090 行）**：`hasAiTag` 未排除带 `tg_no_cascade` 或 `CASCADE_EXEMPT_LIDS` 的辅助 AI（模因火花明确仅统计可层流的 NHP）。
   - **② 已损毁或未安装的不稳定 NHP / 学生级 NHP 被重复 +1 算回（第 4079–4094 行）**：第 4079 行 `continue` 跳过 `destroyed` 物品后 `hasUnstableItem` 仍保持 `false`，导致第 4093–4094 行的天赋回退分支把**已被系统创伤摧毁（或玩家选择未装备）的不稳定 NHP / 学生级 NHP 又自动 +1 补了回来**（且官方 LID 为 `ms_iconoclast` 与 `ms_technophile_1/2/3`，而非 `ms_unstable_nhp` / `ms_servant_fragment_nhp`）！
   - **③ 层流检定等级门槛写错（第 14674 行）**：写了 `talentRank(actor, "t_iconoclast") >= 2`，但**不稳定 NHP 在第 1 级（Rank 1）即解锁**，且官方 `ms_iconoclast` 不带 `tg_ai` 标签，导致只点 1 级偶像破坏者的机甲被模组误判为「当前没有可层流的 NHP」！请同时将第 14685–14691 行提示语中的 `崩溃` 统一为 v3.5 **`层流`**。

3b. **天赋「黑拇指（`t_black_thumb`）」维修动作自动化存在 3 处问题（第 9386–9424 行）**
   - **① 未校验目标是否为邻接友方机甲**：第 9386 行若玩家画布上仍选中着敌方机甲，点击扑灭/战场修复/操控排气阀会直接给敌机加护盾、清燃烧和状况！
   - **② 第 3 级跨玩家维修静默失效**：第 9400 / 9408 / 9417 行修改目标燃烧、护盾、热度均受 `if (targetMech?.isOwner)` 限制而未走 GM Socket，给其他队友的机甲维修时不会生效。
   - **③ 复合状况未提供二选一**：同时承受「缓慢+固定」或「受损+受扰」时写死只清除第一项。

4. **天赋「家族禁卫 I（`t_house_guard`）」邻接扩展方向误设为双向（第 14516 行）**
   - 第 14516 行计算同袍 I 豁免准度时写了 `talentRank(actor, "t_house_guard") >= 1 || talentRank(tok.actor, "t_house_guard") >= 1`。但家族禁卫 I 原文仅扩展**拥有家族禁卫者自身对盟友生效的效果**（`for the purposes of your effects on allied characters`），盟友有家族禁卫并不会把你自己的同袍距离扩到 2 格。

5. **系统「人因故障（`ms_pebcac`）」自动化核对（第 9567–9584 行）**
   - ① 使用前拦截处于 **`受扰（Jammed）`** 状况的目标（英文明确规定 `This cannot be used on Jammed characters`）；
   - ② 第 9572 行 `d6=2` 移动补 `至多`；
   - ③ 第 9575 行 `d6=5` 明确为 `冷却 1d6 热度，并对所有邻接角色造成等于实际所清除热度数值的能量伤害`（若目标当前只有 1 点热度，即使掷出 6 也只造成 1 点能量伤害，而非 6 点）。

6. **清理/补全 `lancer-cn.mjs` 中 8 处不匹配或旧版扩展 LID 引用**
   - 经全文件 LID 交叉扫描发现以下旧前缀或单侧 ID，建议补齐真实导出 LID 以防匹配失效：
     - `mf_ch_tizona`（第 7491 行，实际 ID 为 `mf_kkca_tizona`，已有并列项可保留或清理注释）；
     - `mf_ch_wodeng`（第 7464 行，实际 ID 为 `mf_ext_wodeng`）；
     - `mf_ext_retiarius`（第 7429 行，实际 ID 为 `mf_ch_retiarius`）；
     - `ms_unstable_nhp`（官方 ID 为 `ms_iconoclast`，车卡器 ID 为 `ms_ext_unstable_nhp`）；
     - 4 个官方天赋的扩展别名：`t_ext_empath`（车卡器实际 ID 为 `t_ext_mind_reader`）、`t_ext_spaceborn`（车卡器为 `t_ext_void_native`）、`t_ext_house_guard`（车卡器为 `t_ext_household_guard`）、`t_ext_black_thumb`（车卡器为 `t_ext_blackthumb`）。

7. **本轮扩展勘误关联的其余模组自动化复核清单**
   - 请顺带确认模组内若实现了以下扩展机制，其触发条件与英文原版一致：
     - `mf_minotaur_alt_wraith` 金盏花「命运雕塑家」：科技攻击**命中**时才创造空壳；
     - `mf_white_witch` 白巫蛾：「固化」护盾值为 **`4 + 毅力`**（而非固定 5），「超激活模式」施加 **`离散`**（而非受损）；
     - `mf_taraxacum` 蒲公英：核心主动范围为 **`爆发4`**（而非爆发 3）；
     - `mf_swallowtail_alt` 游骑兵：「接地」隐形在**受到伤害**时同样解除；
     - `ms_the_imperial_eye` 帝王之眼：**2 AP 能量伤害自动必中**（仅击退/伏卧/离散过工程豁免）；
     - `ms_ayah_of_the_syzygy` 朔望之证：远程或近战攻击**命中**场内敌人时才放电；
     - `ms_purifying_code` 净化代码：在目标下一回合**结束时**判定站位；
     - `ms_ext_wodeng_counterfire` 反火力套组（沃登 III）：敌方攻击**命中**友军时，**消耗本轮守望次数**使攻击者获得锁定（不进行守望射击）；
     - `ms_ch_hound` “猎犬级”伙伴礼宾单元（战车御手 III）：无受限次数，扫描与免疫层流位移均为**拉动（Pull）**而非推动；
     - `mf_ext_banshee_vine` 树绳妖：核心主动在系统豁免**失败**且无法离舱/无驾驶员时改为晕眩；
     - `t_ext_crusher` 碾碎机 I（第 16117 行）：若车卡器将 `鲁莽摇摆` 修正为 `鲁莽挥击`，同步更新快捷开关按钮标题。
