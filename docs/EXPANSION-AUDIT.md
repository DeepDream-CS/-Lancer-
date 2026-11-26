# 扩展内容全量对照核查清单（车卡器部分 · 已全部修复并验证 · 2026-11-24）

[返回文档目录](README.md) · [FVTT 扩展并行修复交接单](FVTT-EXPANSION-SYNC.md)

> [!NOTE]
> **车卡器修复状态：已全部完成并通过全量回归测试（2026-11-24）**
> 以下第一类（70 项实质规则与数值错漏）、第二类（14 项前端构筑/多模式/常驻加值与导出缺陷）、第三类（11 组术语统一与润色）及第四类拍板确认项（幽灵牌照保留汉化版数值并修正机翻措辞、树绳妖核心主动兜底修正、砖匠 III 溢出护盾修顺、`“烟囱”冷源` 与 `超巨质量模块` 专名修正统一、NPC 暴风雨类别 III 核实结案）均已在车卡器源码与重编数据包中落地验证。Foundry VTT 并行部分详见 [FVTT-EXPANSION-SYNC.md](FVTT-EXPANSION-SYNC.md)。

## 核查范围与基准

遵循与核心规则书核查相同的双窗口并行约定，本轮已将车卡器收录的全部扩展内容（`source/expansions/all-expansions.js`、`source/expansions/professional-licenses.js`、`source/lore/zh.json`、`source/npc/books-npcs.json` 及前端构筑/渲染脚本）与对应英文原文及核心规则书 v3.5 术语规范逐条对照完毕：

1. **8 部 Massif Press 官方补充书结构化英文原文**（`@massif/dustgrave-data 1.4.0`、`ktb-data 1.2.4`、`long-rim-data 1.2.2`、`osr-data 1.2.0`、`ows-data 1.0.1`、`sotw-data 1.0.2`、`ssmr-data 1.7.0`、`wallflower-data 2.1.0`）：
   - **机甲骨架（26 部）及内建武器（5 件）**：14 项基础属性与挂载点 **100% 一致**；逐句比对特征与核心系统后检出 **19 项实质规则错漏** 与 **2 部骨架特征顺序错位**。
   - **牌照与 GMS 武器（24 件）、系统（43 件）、武器模块（2 件）**：基础数值一致；检出 **29 项实质规则错译/漏译/标签缺失** 与 **5 把武器缺失多模式 `profiles`**。
   - **天赋（11 项 / 33 级）、GMS 核心奖励（1 项 `超重挂载`）、驾驶员装备（1 项 `个人动能屏障`）、KTB 背景（5 项）与扩展规则（3 项：`变体骨架`、`高效`、`无形`）**：检出 **10 项实质规则错漏** 与 **5 个背景推荐触发失配**。
   - **官方未收录条目排查（`docs/FVTT-OFFICIAL-UNCOVERED.md` 共 58 项）**：逐一核验标签与出处后确认，其中 **57 项均为战役专属异域装备/奖励**（带 `tg_exotic` 的武器/系统/模块/驾驶员装备、`cb_order_of_leander` 战役勋章、常青镇甲壳防护服），仅 **1 项为「太空民」1 级内置系统 `ms_spaceborn_1`（Spaceborn EVA）**（车卡器已写在天赋正文内，FVTT 需补映射/翻译）。**8 部官方补充书中的所有常规牌照装备与通用 GMS 装备在车卡器中零遗漏。**
2. **全部已出版英文第三方扩展（对照英文原书核查）**：
   - ***Field Guide to Suldan***（Kai Tave）：`C&H` 厂商（9 骨架、6 核心奖励、牌照装备）、四大厂与 GMS 骨架（沃登、彗尾蛾、伊芙利特、阿格里帕、纳尔逊飞翼型、切夜蛾、奇美拉、萨拉丁“恐惧刽子手”、康格多）、3 个 GMS 核心奖励、6 个天赋，以及 `professional-licenses.js` 中的 **15 个苏尔丹专业牌照（28 件装备）**。
   - ***Field Guide to Castor & Pollux***（Miles Mellott / `@hellaspooks`）：`PI-OF` 顶峰工业猎户座分部（8 部香草/香料骨架、6 核心奖励、牌照装备）、四大厂骨架（法罗斯、镰翅蛾、羽蛇、为朝）、4 个天赋及爆破者工具箱。
   - ***Coldcore Coliseum***（Miles Mellott / `@hellaspooks`）：`K/KCA` 卡尔甘/卡西米尔定制装配厂（4 部名剑骨架、5 核心奖励、牌照装备）及 2 部 SSC 变体骨架（柔剑、鸟翼蝶 + 亲和刃）。
   - ***Iphigenia at Midnight***（Ash and Gold）：米切尔、史泰钦、幽灵、哈勃及牌照装备。
   - ***Lancer: Enhanced Combat***（Interpoint Station）：布莱（含 3 件船工武器）、夹竹桃蛾、哈布斯堡、火蜥蜴。
   - **其余社区变体骨架**：内莫（*Pass the Torch*）、赤蛱蝶（*IMI*）、树绳妖、格兰特。
   - **自设排除说明**：遵照此前约定，`source/expansions/professional-licenses.js` 第 64–428 行的 **6 个自设专业牌照**（顶峰 `拓荒者/矿工/伊甸园` 与卡西米尔 `侍从/骑士/领主`）为你的原创设定，无英文原书，不纳入翻译对照（仅在第三类附注 1 处术语统一提示）。
3. **扩展 NPC 构筑（19 职业 / 203 特性）与构建管线脚本检查**：
   - 已运行脚本验证 `tools/calibrate-text.js` 与 `tools/core-v35.js` 对扩展文件的误伤数为 **0**。
   - `source/npc/books-npcs.json` 核查完毕，并对照《塞壬之歌》英文原书解决了 `source/npc/README.md` 遗留的「暴风雨（Tempest）」类别 III 疑问。

> **双窗口并行约定**：本清单仅列出**车卡器窗口**负责修改的文件（`source/expansions/all-expansions.js`、`source/expansions/professional-licenses.js`、`source/lore/zh.json`、`source/npc/README.md`、`tools/build-data.js`、`assets/js/*` 及对应车卡器测试）。涉及 Foundry VTT 的修改已全部独立拆分至 [FVTT-EXPANSION-SYNC.md](FVTT-EXPANSION-SYNC.md)，两侧修改文件完全不相交。

---

## 第一类：实质性规则错译、漏译与数值偏差（70 项 · 高优必改）

此类问题会直接改变牌桌结算（漏掉「命中时/由你选择/以一个反应/1次使用次数」、把持续时间「结束时」译成「结束前」或「开始前」、把「拉动」译成「推动」、把「盾牌」译成「护盾」、SP 数值录错等）。

### 1.1 官方补充书：机甲骨架与内建武器（19 项）

| # | 条目 ID / 名称 | 所在位置 | 英文原文 | 当前车卡器错误文本 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 1 | `mf_ext_amber_phantom` 晶眼蝶 · 战场先知 & 可能性映射 | `all-expansions.js:324,329` | Trait 1: `move up to 2 spaces.` / Core: `1/round, the allied character may deal +1d6 bonus damage on hit` | `立即移动 2 空间` / `盟友角色每轮一次对该目标造成的攻击获得 +1d6 额外伤害` | ① 核心被动**漏译 `on hit`（命中时）**与 **`may`（可以）**（未命中或擦伤可靠伤害不应触发，且可留到会心一击时再用）；② 战场先知补 **`至多 2 空间`**。 |
| 2 | `mf_ext_atlas` 阿特拉斯蛾 · 巨人杀手 / 外置反应堆 / 致命狩猎 | `all-expansions.js:620,623,632-633` | `even from that character.` / `take +1d6 Kinetic bonus damage from it.` / `Search for you` / `before rolling` | `即使对方是敌对角色也一样。` / 漏 `对该伤害` / `寻找` / 漏结算时点 | ① **严重错译**：`even from that character` 指**即使对抗来自该被共享空间角色的攻击也享有软性掩护**，误译为废话「即使对方是敌对角色也一样」；② 外置反应堆补「则你**对该伤害**具有抗性」；③ 核心主动 `寻找`→`搜索`，末句补「在攻击掷骰前结算」。 |
| 3 | `mf_ext_calendula` 金盏花 · 命运雕塑家 | `all-expansions.js:505` | `1/round, when the Calendula hits a character with a tech attack... Hostile characters are Slowed while at least partially within the area.` | `1/轮，金盏花用科技攻击某个角色时，可以在目标距离3内的自由空间制造一个空壳…敌人部分进入该区域则缓慢。` | ① **严重漏译 `hits`（命中）**，变成科技攻击未命中也能刷空壳；② `距离3`→`射程3`；③ `部分进入该区域`→`只要至少部分位于该区域内就会陷入缓慢`。 |
| 4 | `mf_ext_chomolungma` 珠穆朗玛 · 数据抽取 & 高级入侵包 | `all-expansions.js:444,451-454` | `it may also automatically Scan them.` / `1/scene per character: ...` / `choosing options for each target.` | `也会对其扫描。` / `改为受到 4 热度…（每个角色 1/场景）` / 漏分选说明 | ① 数据抽取补 **`可以`** 与 **`自动对其扫描`**（`glossary.js` 专门用「自动扫描」排除演说家 I「快速科技扫描」误触发！）；② `系统粉碎` 明确整项对每个角色 `1/场景`；③ `平衡控制锁定` 删去误导词 `改为`（入侵本身仍造成基础 2 热度）；④ 核心主动补「可为每个目标分别选择入侵选项」。 |
| 5 | `mf_ext_empakaai` 因帕卡伊 & `mw_ext_colossus_pyroclaw` 巨像热能爪 | `all-expansions.js:201,209-210,1121` | Pyroclaw: `pull any characters of your choice within Threat...` / Core: `you may attempt...` / `successfully Grapple or Ram a character` | 热能爪：`将威胁范围内的所有其他角色拉到邻接位置`（无自选）；核心主动：`擒拿或冲撞一个敌人`、`其他自由空间` | ① **严重漏译 `of your choice`（由你选择的）**，把可选拉人变成了强制把范围内友军全拉过来；② 核心被动补 `可以`；③ 核心主动 `一个敌人`→`一个角色`，删去多余的 `其他`（留在原位也合法）。 |
| 6 | `mf_ext_emperor` 帝王蝶 · 薛西斯之巅 & 帝国护甲 | `all-expansions.js:601,608` | `from any source, including this trait` / `arcs out from that mech, striking a character of your choice within RANGE 3, which can be the character it originated from.` | `基于该特征从任何来源获得护盾` / `电弧会跳跃到射程3内的一个角色身上（可以以被攻击的机甲作为起点）` | ① **严重错译**：原意是电弧从攻击了护盾友军的敌机身上跃出，**击中该敌机射程3内由你选择的一个角色（也可以直接劈回释放该电弧的攻击者自身）**，现译成不知所云的「可以以被攻击的机甲作为起点」；② `基于该特征`→`包括本特征在内`。 |
| 7 | `mf_ext_gilgamesh` 吉尔伽美什 · 外骨骼扩容 | `all-expansions.js:536` | `you may also clear all such conditions currently affecting you.` | `你还可以清除当前影响你的所有此类敌方施加的状态。` | ① **凭空多加「敌方施加」**（错误禁止清除过热紧急排热、地形等非自身系统/天赋造成的受损/缓慢/固定）；② **`conditions`（状况）错译为「状态」**（错误暗示能清伏卧/暴露）。应改为「所有非自身系统、天赋等造成的此类**状况**」。 |
| 8 | `mf_ext_hecatoncheires` 百臂巨人 · 剃刀虫群 & 全环境装甲 | `all-expansions.js:398,403,409-410` | `counts as a Drone ... (but is not a character)` / `at least partially in the area` / `in areas that grant soft cover` / `liturgicode seeds` | 漏 `但不是角色` 与 `至少部分`；`在软性掩护下`；设定写 `礼拜蝙蝠种` | ① **漏译 `（但它不是角色）`**（否则剃刀虫群会被当成盟友角色吃统帅光环、触发友军邻接或阻挡站位）；② 补 `至少部分位于区域内`；③ 特征 2 明确「处于提供软性掩护的区域中时」（而非普通墙角掩体）；④ 设定 L398 乱码错词 `礼拜蝙蝠种`→`礼拜代码种子`。 |
| 9 | `mf_ext_kidd` 基德 · 能量导流 / 快速部署 / 骷髅旗 | `all-expansions.js:547,549,556` | `destroy one of its DEPLOYABLES or DRONES that has been deployed or created in the current scene` / `deploy or activate any one system` / `takes a tech action targeting an allied character within your SENSORS` | `摧毁一个在当前场景中已部署的可展开或无人机` / `部署或启动任何带有无人机或可展开标签的系统` | ① **严重漏译归属 `它自己的（one of its）`** 与 `或创造的`（字面允许直接炸毁敌方无人机回血！）；② **严重漏译数量 `任意一个（any one）`**（字面允许第一回合用自由动作把身上所有无人机/部署物全铺出去！）；③ 骷髅旗明确「对位于你**感应**内的盟友角色执行科技动作」。 |
| 10 | `mf_ext_kutuzov` 库图佐夫 · 斥力区 / 应急霎场 / 投射神盾 / 并联力场 | `all-expansions.js:361-373` | `adjacent character of its choice` / `Emergency Blinkfields` / `with the Shield tag` / `conditions` | 漏 `由它选择的`；错字 `应急姿场`；全文将 `Shield` 译为 `护盾`；`状态` | ① **核心术语混淆**：车卡器中 `tg_shield` 标签名为 **`盾牌`**，而 `护盾` 是 **`tg_overshield`（临时生命）**！把 L361、L367、L373 的 `Shield` 译成 `护盾`，既触发错误的临时 HP 悬停词条，又切断了核心被动「投射神盾（本系统视为带有**盾牌**标签）」与自身特征 1/核心主动的联动！② 斥力区补 **`由它选择的`**；③ L362 `应急姿场`→**`应急霎场`**；④ L370 `状态`→**`状况`**。 |
| 11 | `mf_ext_lich` 巫妖 · 魂匣 / 不朽者 / 时间故障 | `all-expansions.js:690,692,698-700` | Soul Vessel: `takes damage... or is hit by a tech attack` + `from that effect` / Immortal: `remains dead` / Glitch Time: `before it resolves` + `You teleport to one of the spaces originally occupied by that character.` | 魂匣：`或受到科技攻击时`、漏 `来自该效果`；不朽者：`如常死亡`；时间故障：`中断它的决意`、`你可以瞬间移动该角色到初始占据的某个空间` | ① 魂匣**漏译 `命中（is hit by）`**与**`来自该效果的`**；② 不朽者 `如常死亡` 误导为原本活着现在死掉，原文是「若已死亡，回来后**依然保持死亡状态**（躯体带回）」；③ 时间故障将 `before it resolves`（在该动作结算前）译成 `中断它的决意`，且第 2 项**主客体完全译反**（原文是**巫妖自己瞬间移动到目标原本占据的空间**，误译成瞬间移动目标！），第 1 项并按 `faq-data.js` 官方勘误明确为「该动作的目标」而非执行者。 |
| 12 | `mf_ext_lycan` 狼人 & `mw_ext_shock_claws` 电震利爪 | `all-expansions.js:350,1130-1131` | `If this happens again before activating it...` / `another character of your choice` | `若此情况在你激活后再次发生，这些升级将合并…` / `攻击时` 漏 `由你选择的` | **时间条件完全译反**：原文是「在激活『狼嚎』**之前**，每场景第 1 次与第 2 次友军受结构/压力伤害会使利爪升级（激活后即锁定形态）」，现译成「在你激活**后**再次发生」！同时在 `狼嚎` 正文补齐升级规则，并在 `on_attack` 补 `由你选择的`。 |
| 13 | `mf_ext_orchis` 红门兰 · 皇家卫队 & 冥顽投掷 | `all-expansions.js:486,491` | `1/round between its turns... mirroring that character's movement... This effect doesn't take a reaction.` / `in addition to any other effects` / `their next turn` | 漏 `在它的两个回合之间`、漏 `同步模仿移动`、漏 `不消耗反应`；漏 `除任何其他效果外` | ① **漏译三处关键机制**：皇家卫队仅限**在红门兰自己的回合之外（between its turns）**触发、**不消耗反应**，且是**同步跟随该友军移动**；② 冥顽投掷补「除任何其他效果外」及「**其**下一回合结束前」。 |
| 14 | `mf_ext_swallowtail_ranger` 游骑兵 · 接地 & 斥候战场套件 & 设定 | `all-expansions.js:299,301,309` | Grounded: `Until you move, take damage, attack...` / Scout: `up to two` / Lore: `imperfect` | `直到你移动、攻击、强迫豁免…`（漏 `受到伤害`） / `选择以下两项` / 设定 `臻于完善` | ① **严重漏译 `受到伤害（take damage）`**，让核心主动赋予的隐形变成挨打也不破隐；② 斥候战场套件补 `至多两项`；③ L299 设定将 `imperfect`（并不完美）译反为 `臻于完善`。 |
| 15 | `mf_ext_tagetes` 万寿菊 · 沙暴散热系统 & 军纪 | `all-expansions.js:424,431-432` | `all skill checks and saves` / `venting heat on Stabilize... stationary burst 2... allied characters` | `所有检定和豁免` / `（1 CP，协定）…溅射2…盟友机甲` | ① **区域模板与动作双错**：将 **`固定的爆发2`（stationary burst 2，以万寿菊当时所处位置为中心）** 错译为 **`溅射2`**，且误标了原文不存在的 **`协定`**（实际是在执行「稳住阵脚」排热时启动），并误把 `盟友角色` 限缩为 `盟友机甲`；② 军纪补 `所有技能检定和豁免`（排除结构/过热检定误解）。 |
| 16 | `mf_ext_taraxacum` 蒲公英 · 全频谱传感器爆发 / 中继联轴器 / 重负减免 | `all-expansions.js:384-385,391` | Core: `within burst 4` / Trait 2: `within sensors... using a system or tech action` / Trait 1: `carry only a single... each of the Taraxacum's turns in which it uses this trait` | 核心主动写 **`爆发3`**；特征 2 漏 **`感应内`** 与 **`使用系统或`**；特征 1 漏 **`仅`** | ① **数值沿用旧测试版**：核心主动正式版范围为 **`爆发4`** 而非 `爆发3`；② 中继联轴器漏译 **`感应内`** 距离限制，以及 **`使用系统或`（如无人机系统、FABI 等非科技动作系统也能借视线！）**；③ 重负减免明确「一次**仅**能搭载一台」且仅在「蒲公英使用本特征的自身回合结束时」受 2 热度。 |
| 17 | `mf_ext_viceroy` 总督蝶 · 近威胁目标处理器 / 义警全向发射器 / 天堂倾雨 | `all-expansions.js:245-246,252` | Trait 1: `also count as CQB` / Trait 2: `characters of its choice within Range 3 of itself.` / Core: `Burst 3... up to 2 spaces` | 特征 1：`视为 CQB`（漏 `同时`）；特征 2：`对其射程3内的任意角色`；核心主动：**`溅射3`**、漏 `至多` | ① 特征 1 补 **`同时视为`**（否则被误读为失去「发射器」类型、不能吃兴风者！）；② **中心点错位**：特征 2 原文是以**总督蝶自身为中心射程 3 内**自选角色受爆炸溅射，现译 `对其射程3内` 变成了以远端暴击目标为中心！③ 核心主动将 **`爆发3`（Burst 3）** 错译为 **`溅射3`**，并补 `至多 2 空间`。 |
| 18 | `mf_ext_white_witch` 白巫蛾 · 固化 & 超激活模式 | `all-expansions.js:577,584-586` | Hardening: `gains Overshield equal to 4 + GRIT.` / Hyperactive: `characters... SHREDDED...` | 固化：**`获得 5 点护盾`**；超激活：`所有角色和物品在移动离开该区域前受损` | ① **数值错误**：固化正式版护盾值为 **`4 + 毅力`**（LL0 为 4，LL12 为 10），现写死旧版 `5`；② **状况错译**：超激活模式正式版施加的是 **`离散（Shredded）`** 而非 `受损（Impaired）`，且删去旧废案 `和物品`。 |
| 19 | `mf_ext_zheng` 郑 · 晓礼之韧 & 晓礼之智 | `all-expansions.js:743-747` | `1/turn, as a free action during the Zheng's turn... Ram... up to 3 spaces` / `in a turn` | 两处均写 **`1/轮`** / **`一轮中`**，且冲撞写 `击退 3 空间`（漏 `至多`） | **频率错译**：在对手回合触发反应出拳，或在多回合效果下，`1/回合（1/turn）` 与 `1/轮（1/round）` 规则不同；且晓礼之韧冲撞击退应补 **`至多 3 空间`**。 |

### 1.2 官方补充书：牌照与 GMS 武器、系统、武器模块（29 项）

| # | 条目 ID / 名称 | 所在位置 | 英文原文 | 当前车卡器错误文本 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 20 | `mw_ext_dd288` D/D288（充能模式） | `all-expansions.js:1232` | `deals 30 AP kinetic damage to objects and terrain on hit` | `命中时对物品和地形造成 30 AP 爆炸伤害` | **伤害类型错译**：30 AP 拆迁伤害为 **`动能伤害`**，误译为 `爆炸伤害`。另需补入「为 D/D 288 充能」快速动作说明。 |
| 21 | `mw_ext_arrow_nexus` 电箭巢房 | `all-expansions.js:1178` | `giving it Range 20, Seeking, 4 Energy Damage, and Reliable 4 against that character only` | 漏译 `against that character only` | **漏译核心限制**：20 射程/导引/4 能量/可靠 4 **仅在针对该已标记角色攻击时生效**（现译变成标记一人后对全场所有敌人都能用强化模式射击！）。 |
| 22 | `mw_ext_reversal_loop` 骏逆回环 | `all-expansions.js:1171` | `Charges are also lost if you take structure damage or stress.` | 整句漏译 | **漏译断档惩罚**：补入「当你受到结构伤害或压力伤害时，充能也会清空归零」。 |
| 23 | `mw_ext_ferrofluid_lance` 铁磁流长枪 | `all-expansions.js:1168` | `...is Immobilized and cannot be moved in any way.` | `你的机甲固定。`（漏后半句） | **漏译防强制位移条款**：普通「固定」仍可被队友或敌人推拉击退从而提前扯断长枪控制，原文明确规定**且无法以任何方式移动（免疫强制位移）**！另补 `tag("tg_round", 1)`。 |
| 24 | `mw_ext_legionnaire_rifle` “军团战士”战斗步枪 | `all-expansions.js:1136` | `gain +2 Reliable for the attack` / `push your target 1 space in any direction` | `获得可靠2` / `将你的目标向任意方向击退1` | ① 原文是**可靠数值 +2**（步枪本身已有 `可靠2`，消耗充能后变为 **可靠 4**），写「获得可靠2」等于没加；② `push 1 space in any direction` 是**向任意方向推动 1 空间**，译成加粗标签 **`击退1`**（只能沿远离攻击者直线推开，且会错误叠加超巨质量模块击退！）属规则错误。 |
| 25 | `mw_ext_legion_hive` 军团巢房 | `all-expansions.js:1150-1151` | `grants +2 damage on hit` / `deployables[0].activation: "Free"` | `提供 +2 伤害`（漏 `命中时`）；`deployables[0]` 缺 `activation: "Free"` | ① 漏译 **`命中时（on hit）`**，字面上把 +2 加进了未命中时的 `可靠2` 擦伤里；② `deployables[0]` 漏标 `activation: "Free"`，导致前端部署卡标题显示错误的「**快速动作部署**」而非「**自由动作部署**」。 |
| 26 | `mw_ext_terashima_blade` 寺岛之刃（暴风架势） | `all-expansions.js:1187` | `all other characters adjacent to you or your target` | `与你和你的目标邻接的所有其他角色` | **集合关系译错**：`or`（并集：与你邻接、**或**与目标邻接）错译成 `和`（交集：必须同时贴着你和目标，威胁 2–3 时几乎无人满足）。 |
| 27 | `ms_ext_spear_charges` 矛式炸药（穿甲地雷 & 钻地火箭） | `all-expansions.js:1333-1334` | `On a success, they take half damage only.` / `Failing to disarm this mine also causes it to detonate against that character.` / `single character` | `成功则伤害减半。未被拆除的这枚地雷还会对该角色再次引爆。` / 火箭漏 `单个角色` | **灾难级错译**：原文是常规排雷补充说明「**拆除此地雷失败也会使其对该角色引爆**」，被错译成「**未被拆除的这枚地雷还会对该角色再次引爆**」（变成踩一次地雷连炸两轮 2d6 AP 停止移动）！且豁免成功补「**仅**受到一半伤害（不会停止移动）」，钻地火箭补「对射程10内的**单个**角色」。 |
| 28 | `ms_ext_human_error` 人因故障（PEBCAC） | `all-expansions.js:1338-1340` | `allied mech character... immune to all tech actions other than this one... This cannot be used on Jammed characters.` / d6=2,3 `up to` / d6=5 `deals the amount cooled as energy damage` | 漏 `机甲`、漏 `除此动作以外`、**漏整句禁受扰**、d6=2/3 漏 `至多`、d6=5 `造成等量的能量伤害` | **5 处实质漏译/歧义**：① **整句漏译「不能对处于受扰状况的角色使用」**（彻底颠覆用途，玩家最常拿它去救受扰队友！）；② 漏 `盟友机甲角色`；③ 漏 `除此动作以外的`；④ d6=2、3 移动补 `至多`；⑤ d6=5 明确为「造成**等于实际所清除热度数值**的能量伤害」（0 热时造 0 伤，而非按 1d6 骰面直接造伤）。 |
| 29 | `ms_ext_forge_ii` “锻炉二型”副官班组 | `all-expansions.js:1353,1356` | `fit characters up to a combined SIZE 1` / `moves adjacent to it` | `可容纳一个大小 1 的角色` / 漏 `移动至` | 炮兵阵地可容纳 **合计大小不超过 1 的角色**（如两名大小 ½ 的机甲/驾驶员），译为「一个大小 1 的角色」排除了大小 ½ 共处；装甲包补「**移动至**与它邻接」。 |
| 30 | `ms_ext_chimney_cold_source` “烟窗”冷源 | `all-expansions.js:1359-1362` | `from any source... Objects and DEPLOYABLES are hit automatically.` + Quick Action | **整句漏译物件/可展开物自动受击**；漏 `来自任何来源的`；缺 `tg_quick_action` | 补全「**区域内的物品和可展开物自动受到该伤害**」与「来自任何来源的热度」，并补 `tag("tg_quick_action")` 及 `deployables[0].activation: "Quick"`。 |
| 31 | `ms_ext_redundant_armament` 武备冗余 | `all-expansions.js:1365-1366` | `tags: [tg_unique, tg_indestructible]` / `and is not a valid target for system destruction.` | 缺 `tg_indestructible`；`且不能作用于系统被摧毁的结果。` | **防滥用规则错译 + 漏不可摧毁标签**：原意是「**且本系统自身不能作为『系统被摧毁』的合法目标**」（防止花 1 SP 买个空壳专门当系统创伤垫子拆掉），误译成「不能用来免疫系统被摧毁」。补 `tag("tg_indestructible")` 并修正正文。 |
| 32 | `ms_ext_empathic_shield` 共感护盾 | `all-expansions.js:1371-1373` | `any damage dealt to this Overshield before reductions of any kind also deals equivalent kinetic damage to you` | `该护盾每减少一次伤害之前，其造成的伤害会对你造成等量的动能伤害` | 英文 `before reductions of any kind` 指「**在计算任何形式的伤害减免（装甲、抗性等）之前，对该护盾造成的任何伤害**」，现译成语无伦次的病句；另 `距离5`→`射程5`，补 `tag("tg_overshield")`。 |
| 33 | `ms_ext_camus_edge` 加缪之锋 | `all-expansions.js:1376-1377` | `Once primed, you gain one use of the Intervention reaction...` / `line, cone, blast` | `一旦启动，在接下来的场景中你获得干预反应。` / `线形、锥形、爆发` | ① **严重漏译 `1 次使用次数（one use）`**：每次花快速动作预备只给 **1 次**干预反应次数（用完需重新预备），漏掉后配合反应头「每轮1次」会让玩家以为花 1 个快速动作就能整场每轮无限用！② `blast` 是 **`溅射`** 而非 `爆发`。 |
| 34 | `ms_ext_ferro_spike_wall` 铁磁钉壁 | `all-expansions.js:1380-1381` | `The first time in a round any character would move into its space after the barrier hardens...` | `任何角色每轮第一次移入其所在空间时，受到 1d6 AP 动能伤害。` | **漏译 `在屏障固化后（after the barrier hardens）`**——刚喷出的第一轮尚未固化时进入液态金属区域不受伤害；固化后在角色即将被推入/移入其占据格时受 1d6 AP 动能伤害。 |
| 35 | `ms_ext_emperors_eye` 帝王之眼 | `all-expansions.js:1386-1388` | `takes 2 AP energy damage and must succeed on an Engineering save or be knocked back 2...` / `allied mech character` | `必须通过工程豁免，否则受到 2 AP 能量伤害，并被击退2…` / 漏 `机甲` | **严重错置伤害条件**：原文中 **2 AP 能量伤害自动必中**（稳定触发帝王蝶刷盾特征），仅击退/伏卧/离散可豁免；现译塞进了「否则」后面！另补 `盟友机甲角色`，`type` 由 `"Shield"` 改为 `"Tech"`。 |
| 36 | `ms_ext_book_of_kings` 列王记 | `all-expansions.js:1389-1391` | `allied mech character... Resistance to heat inflicted by other characters.` | 漏 `机甲`；`对其他角色造成的热度具有抗性` | ① 补 `盟友机甲角色`；② 消除施受主歧义，改为「**对由其他角色施加的热度具有抗性**」；③ `type` 改为 `"Tech"`，补 `tag("tg_overshield")`。 |
| 37 | `ms_ext_proof_of_syzygy` 朔望之证 | `all-expansions.js:1394` | `is hit by a ranged or melee attack... at least partly in the area` | `第一次被远程或近战攻击时…区域内所有敌方角色` | **严重漏译 `命中（is hit）`**（变成朝场内敌人空枪未中也能炸全场 2 AP 能量伤害），并补 `至少部分位于区域内的`。 |
| 38 | `ms_ext_multistage_mobility` 多档机动系统 | `all-expansions.js:1402` | `Size 1/2 characters that are adjacent to either end of the line can move to the other end` | `大小1/2 的角色只要能抓住绳索，就可以用快速动作移动到另一端` | **漏译入口位置限制**：必须 **与滑索任一端邻接** 才能上索（可以从中途任意位置跳下，但不能从滑索中段起跳上索）。 |
| 39 | `ms_ext_immolate` 献祭 | `all-expansions.js:1438` | `start their turn in it or that enter it for the first time in a round` | `在该回合开始时位于其中或首次进入其中` | 明确时点与频率：「**在区域内开始其自身回合、或每轮首次进入该区域**的角色」。 |
| 40 | `ms_ext_purge_code` 净化代码 | `all-expansions.js:1443-1444` | `At the end of their next turn, if they are [not] adjacent...` | 两项均译为 `在对方下一回合结束前，若…` | **严重时点错译**：`At the end of their next turn` 是在**对方下一回合结束时**做唯一一次站位结算（给目标一整回合走位解毒）；译成「结束前」导致一挂上病毒在空地或路过地形瞬间立刻引爆！ |
| 41 | `ms_ext_antilinear_time` 反线性时间 | `all-expansions.js:1452` | `clear all conditions other than Stunned... receive all conditions they cleared` | 两处均译为 `状态` | **`conditions`（状况）错译为「状态」**，会误导玩家用它清除队友的「暴露」甚至「关机」。改为 **`状况`**。 |
| 42 | `ms_ext_final_secret` 终决机密 | `all-expansions.js:1485` | `teleport them up to 4 spaces to a free, valid space` | `瞬间移动 4 空间，到你所选择的一个自由空间` | 补 **`至多 4 空间`**（不必硬传满 4 格）与 **`有效的自由空间`**。 |
| 43 | `ms_ext_reality_breach` 现世缺口 | `all-expansions.js:1488-1490` | `(of its player's choice)` / `excluding Blast, Line, Burst, or Cone weapons` / `within Range 10 of the zone` / `or end it as a quick action.` | `（由玩家选择）` / `（不包括 AOE）` / `射程10区域内` / `或直到你再次使用或结束该快速科技。` | ① **漏译提前关闭动作消耗**：「或以一个**快速动作**将其结束」；② **决定权归属歧义**：`（由该角色/物品所属控制者选择）`（而非由孙子玩家替敌人选落点）；③ 明确「距离该区域**射程10**内」及「不包括溅射、线形、爆发或锥形武器」。 |
| 44 | `ms_ext_power_assembly_3` 力量总成套组 III | `all-expansions.js:1501` | Full Action: `You end a Grapple, pushing the other character 5 spaces...` | `当你结束对一个角色的擒拿，可以向任何方向将对方角色推离 5 空间…` | 本系统自身就是**完整动作**（消耗完整动作直接终结擒拿把对方轰飞 5 格，且不限于你是擒拿发起方），现译成自由松手触发的被动句式。改为「你结束一次**擒拿**，将另一方角色向任意方向推动 5 空间…」。 |
| 45 | `ms_ext_unstable_nhp` 不稳定 NHP | `all-expansions.js:1321` | `for each undestroyed NHP on your mech including this one.` | `你的机甲上每有一个 NHP（包括这个），火花就造成 +1 伤害。` | **漏译 `未被摧毁的（undestroyed）`**——已损毁的其他 NHP 不能继续提供 +1 伤害。 |
| 46 | `wm_ext_thermal_shroud` 热熔缭绕 | `all-expansions.js:1625` | `Cone 3 cloud oriented away from your target in a direction of your choice. ... each take 2 Explosive Damage.` | `从你的目标向你选择的方向投射一片锥形3的过热云。` | **漏译锥形朝向限制 `朝背离目标的方向（oriented away from your target）`**（不能反喷回你自己或目标背后方向），并明确「各受到 2 爆炸伤害」。 |
| 47 | `mw_ext_hhs155_cannibal` HHS-155「食人族」 | `all-expansions.js:1206` | `3d6+4 Kinetic` | `伤害增加到 3d6+4` | 补明伤害类型 **`3d6+4 动能伤害`**，并补齐单管/双管双 `profiles`。 |
| 48 | `ms_ext_universal_plate` 万用基板 | `all-expansions.js:1348` | `hold a single SIZE 1 or smaller DRONE or DEPLOYABLE at a time` | `它同时能容纳一个大小 1 或更小的无人机或可展开` | 汉语「同时能」意为「而且还能」，而 `at a time` 是数量上限「**同一时间只能容纳一个**」。 |

### 1.3 官方补充书：天赋与扩展规则（10 项）

| # | 条目 ID / 名称 | 所在位置 | 英文原文 | 当前车卡器错误文本 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 49 | `t_ext_mind_reader` 读心者 III（主观性共享）& 简介 | `all-expansions.js:74,79` | `Until the end of their next turn, any time that character makes an attack, check, or saving throw...` | `直到该角色下一回合开始前，其进行的所有攻击、检定或豁免…`（且 `desc: ""`） | **严重持续时间错译**：将 **`直到该角色下一回合结束前`（end）** 译成了 **`开始前`（start）**，导致受加持的队友在自己的下一回合里根本享受不到必出 10 的核心大招！同时明确前半句「直到**你的**下一回合开始」，并补齐缺失的天赋简介 `desc`。 |
| 50 | `t_ext_blackthumb` 黑拇指 II & III（马术表演 / 马术大师） | `all-expansions.js:148-149,154-155` | Rank II: `which you can do as part of this protocol` + `you cannot start a rodeo again on your following turn.` + `Conditions` / Rank III: `adjacent allied mechs.` | Rank II：漏协定内顺带移交控制权 + `你下一回合开始前无法再次使用马术表演` + `状态`；Rank III：`邻接的机甲` | ① **严重冷却失效**：马术表演是**协定**（只能在回合开始时用），译成「下一回合开始**前**无法再次使用」等于到了下回合开始正好解禁、毫无冷却惩罚！原文 `on your following turn` 指 **在你的下一回合无法再次开启马术表演**；② **漏译动作经济许可**：补明「**你可以在启动本协定的同时顺带将机甲控制权移交给 NHP**」（及 `半身爬出舱外`）；③ `状态`→**`状况`**；④ Rank III 补 **`邻接的盟友机甲`**。 |
| 51 | `t_ext_pankrati` 潘克拉蒂 II & III（我见 / 我征服） | `all-expansions.js:138-139` | Rank II: `moving up to twice your Speed` / Rank III: `they may immediately Boost as a reaction after your charge resolves.` | Rank II：`移动两倍于你速度的距离`；Rank III：`他们可以在你的冲锋结束时立即推进。` | ① **Rank III 严重漏译 `以一个反应（as a reaction）`**，导致队友不消耗反应且无视受扰/受身限制白嫖推进；② Rank II 补 **`至多`** 两倍速度。 |
| 52 | `t_ext_demolitionist` 爆破专家 I & III（破片与清理 / 小心手雷） | `all-expansions.js:88,91-92` | Rank III: `within Range 3 of the targeted space` / `whether it forces a save or not, one character in the affected area takes 1d6 explosive damage instead.` | Rank III：`目标区域射程3内` / `若该地雷正常引爆时不会造成伤害，则无论豁免是否成功，影响范围内的一个角色受到 1d6 爆炸伤害。` | ① 第 1 项原文是从投掷指定的**目标空间（targeted space，中心单格）**起算射程 3，写「目标区域」会被当成从整个溅射范围边缘再外扩 3 格；② **第 2 项严重错译**：`whether it forces a save or not` 指无伤功能雷「**无论该地雷是否迫使豁免**（如烟雾雷无豁免），均**改为**使范围内一个角色受 1d6 爆炸伤害」，误译成「无论豁免是否成功」；前半句并写明 `+1d6 爆炸额外伤害`。 |
| 53 | `t_ext_orator` 演说家 I & II（巧言辞令 / 理性之声·激励） | `all-expansions.js:112,115` | Rank I: `Reaction, 1/round` / Rank II: `against any non-self inflicted conditions... using the Orator Die at [as] accuracy` | Rank I 仅写 `反应`（漏 `1/轮`）；Rank II：`对抗…状态，以演说骰数作为准度` | ① Rank I 反应栏补 **`反应，1/轮`**；② Rank II `状态`→**`状况`**；③ 英文是花费 1 颗 d6 演说骰，**将该演说骰作为本次检定的准度骰（即 +1 准度）**，译成「以演说骰数作为准度」误导玩家与模组按持有骰子颗数加 +2/+3 准度！ |
| 54 | `t_ext_field_analyst` 战场分析师 II & III（情报处理 / 激活干扰） | `all-expansions.js:31-32` | Rank II: `you may increase` / Rank III: `Whenever a hostile character in line of sight hits with an attack, you know what they rolled.` | Rank II：漏 `可以`；Rank III：`每当视线内的敌对角色攻击时，你知道他们掷出了多少。` | ① **Rank III 漏译 `命中（hits）`**（只有敌人攻击命中时才自动获知具体点数）；② Rank II 补 **`可以`**（允许仅 +1 而不消耗高面值情报骰）。 |
| 55 | `t_ext_prospector` 探勘者 I（秘密变阵） | `all-expansions.js:43` | `ending the movement completely within a different Entrance` | `并结束移动在与第一个进口由同一角色创建的另一个进口上。` | **漏译 `且完全位于该进口内（completely within）`**（对大小 2/3 机甲落点范围有严格限制）。 |
| 56 | `t_ext_iconoclast` 偶像破坏者 I（海侵·内嵌说明） | `all-expansions.js:56-57` | `undestroyed NHP`；官方 `ms_iconoclast` 标签为 `独特，快速动作，1/轮`（不带 AI 标签） | 模因火花漏 `未被摧毁的`；内嵌框仍写旧 PDF 的 `0 SP，独特，AI` | ① 模因火花补 **`未被摧毁的 NHP`**；② 更新内嵌框说明以与下方已按官方校准的 `ms_ext_unstable_nhp` 一致（不带 AI 标签、不计入 AI 上限，仍视为可进入层流的 NHP）。 |
| 57 | 扩展规则：`无形（Intangible）` | `all-expansions.js:1667` | `Intangible characters cannot capture points or count for zones (for sitreps) and don't count as adjacent to tangible characters.` | `无形角色无法占领目标区域或计分区域，也不能当作有形角色的掩护。` | **核心基础规则错译**：将 **`且不视为与有形角色邻接（and don't count as adjacent to tangible characters）`** 凭空错译成了「也不能当作有形角色的掩护」，丢失了无形切断跨位面交战、守望、护法、同袍等一切邻接判定的核心规则！ |
| 58 | 扩展规则：`变体骨架（Variant Frames）` | `all-expansions.js:1664` | 相关牌照达到 **等级 II** 时可选（GMS 变体 LL0 可用），基础数值/挂载/特征/核心系统均有差异，示例为 `Minotaur` | `驾驶员牌照等级 2 时…但特征和核心系统略有不同…代替标准牛头怪` | ① 修正为「相关牌照达到等级 II 时（GMS 变体骨架在 LL0 即可使用）」；② 补「基础数值、挂载点、特征和核心系统」；③ `标准牛头怪` 统一为 v3.5 译名 **`标准米诺陶洛斯`**。 |

### 1.4 第三方扩展与苏尔丹专业牌照英文原书核查出的实质错漏（12 项）

| # | 条目 ID / 名称 | 所在位置 | 英文原书 / 原文 | 当前车卡器错误文本 / 数值 | 问题说明与修正方案 |
|---|---|---|---|---|---|
| 59 | `ms_ch_falling_star` 落星模块（C&H 拳术师 II） | `all-expansions.js:2627` | *Field Guide to Suldan*: `2 SP, Quick Action, Unique` | **`sp: 1`** | **SP 数值录错**：苏尔丹英文原书明确为 **2 SP**，需修正 `sp: 2`。 |
| 60 | `ms_ch_hound` “猎犬级”伙伴礼宾单元（C&H 战车御手 III） | `all-expansions.js:2580` | *Suldan*: `3 SP, AI, Unique`（**无 Limited 1**；群体动力学为 `1/scene`）；`Whenever you Scan a hostile character, you may move 1 space and pull your target 1 space... cannot enter cascade. Whenever it would enter cascade, instead you are immediately pulled 3 spaces...` | 多标了 **`tag("tg_limited", 1)`**；正文写 `每当你扫描一个角色，可以移动 1 空间并向任何方向推动目标 1 空间…无法进入层流。当它层流时，你会立即由 GM 选择方向推动 3 空间。` | **同一系统 4 处实质错误**：① **删去错误的 `受限 1` 标签**（原书无受限标签，否则用一次或工程加成全错）；② 两处 `pull`（**拉动**）全被译反为 **推动**；③ `Whenever it would enter cascade, instead...` 译成自相矛盾的「无法进入层流。当它层流时…」，应改为「**每当它本应进入层流时，改为…**」；④ 扫描目标补 **`敌对角色`**。 |
| 61 | `ms_ext_wodeng_counterfire` 反火力套组（IPS-N 沃登 III） | `all-expansions.js:1710-1711` | *Suldan* (`Sustained Counterfire`, `Reaction, 1/round`): Trigger: `A hostile character hits an allied character within Sensors with an attack.` Effect: `Spend your Overwatch to cause the attacker to gain Lock On...` | `当感应范围内的敌方角色攻击盟友角色时，你可以使用你的守望作为反应，使攻击者获得锁定`（且缺 `tg_reaction`） | **解决 `EXPANSION-TRANSLATION-REVIEW.md` 遗留疑点**：① **漏译 `命中（hits）`**；② `Spend your Overwatch` 是**以反应消耗你本轮的「守望」使用次数**来施加锁定+清弹幕难度（并**不是**开火打一次守望攻击！），现译极易误导玩家先打一枪守望再白送锁定；③ 补 `tag("tg_reaction")` 与结构化反应块。 |
| 62 | `ms_kkca_archer_companion` 步弓手式伙伴礼宾单元（K/KCA 祖母绿弯刀 III） | `all-expansions.js:1876` | *Coldcore Coliseum* (`TOXOTES-Pattern Comp/Con`): `It gains Recharge 4+ (or increases its existing recharge value by 1, to a maximum of 6) and becomes uncharged as your shot disables a vital component.` | `它获得再充能 4+（或将其现有的充能值增加 1，最高为 6），并且因为你此次射击使一个重要部件失效而使对方不再充能。` | **严重机制错译**：`becomes uncharged` 是让该敌方武器/系统**立即进入「未充能（待充能）」状态**（下回合起必须掷充能骰才能再用），误译成「使对方不再充能」（永远无法充能，那前面的充能 4+ 完全失去意义！）；同时 `再充能 4+` 统一为 NPC 标准术语 **`充能 4+`**。 |
| 63 | `mf_piof_pepper` 胡椒 · 特征「飞车射击」（PI-OF） | `all-expansions.js:2326` | *Castor & Pollux* (`Peppercorn` — `Drive-By`): `When the Peppercorn Skirmishes or Barrages...` | `当胡椒进行交战或弹幕动作时…` | **核心动作名错译**：将 **`交火（Skirmish）`** 错译为 **`交战（Engagement）`**！ |
| 64 | `mw_piof_plasma_caster` & `ms_piof_plasma_tread`（PI-OF 胡椒 II） | `all-expansions.js:2359,2378` | *Castor & Pollux*: `Plasma Caster` / `Plasmatic Treads` | **`等离子脚轮`** / **`血浆胎面`** | **典型机翻事故**：把武器 `Caster`（投射器/发射器）译成家具「脚轮」，把物理等离子 `Plasmatic` 译成医学「血浆」！应修正为 **`等离子投射器`** 与 **`等离子胎面`**（同步更新 `胡椒` 牌照风味与检索引用）。 |
| 65 | `mf_ext_ornithoptera` 鸟翼蝶 · 核心主动「紧缚」（SSC） | `all-expansions.js:2076` | *Coldcore Coliseum* (`Hauteclere`): contested Hull check vs Agility check | `对方必须用机体豁免对抗你的敏捷豁免否则摔倒伏卧` | 枪骑兵规则不存在「豁免对抗豁免」，对抗掷骰均为**对抗检定**：应改为「**必须进行机体检定对抗你的敏捷检定**」。 |
| 66 | PI-OF 牌照 5 处 `检定（Check）` 与 `豁免（Save）` 混译 | `all-expansions.js:2153,2282,2384,2403,2462` | 被迫抵抗敌方效果（对抗施加者豁免目标）均为 **Save（豁免）**；自己花快速动作挣脱装置为 **Check（检定）** | ① 香菜 L2153 `迫使他们进行机体检定`；② 流星锤 L2282 `必须通过敏捷检定…成功豁免`；③ 燃油手雷 L2384 `必须通过敏捷检定…第一次豁免`；④ 冰湖喷管 L2462 `必须通过工程检定否则受 2 能量伤害并缓慢` | 流星锤与燃油手雷自身后半句都写着「成功豁免/第一次豁免」，前半句却误印成「检定」（玩家会按固定 10 而非施加者豁免目标 10~16 投骰！）。上述 4 处被动抵抗全部修正为 **`豁免`**（流星锤花快速动作拆除保持 `机体检定`）；另核对 `迷迭香` L2350 与 `里氏地雷` L2403 起身判定一致性。 |
| 67 | `mf_ext_banshee_vine` 树绳妖 · 核心主动「面部附着者/胸腔爆裂者」 | `all-expansions.js:1087` | 精神控制完整科技：豁免失败强制下马走向树绳妖；若目标因任何原因无法离舱或无驾驶员，则改为晕眩 | `失败则必须在其下一回合下马机甲…成功则对方因任何原因无法离开驾驶舱，若没有驾驶员则晕眩至下一回合结束。` | **解决 `EXPANSION-TRANSLATION-REVIEW.md:69` 遗留病句**：把豁免失败后针对无驾驶员/锁舱目标（如副官、RPV、恩奇都、生物体）的兜底条款 `If they cannot...` 误译成了 `成功则…`，导致敌人**豁免成功反而被锁死舱门或直接晕眩**！修正为「若豁免失败的目标因任何原因无法离开驾驶舱或没有驾驶员，则改为**晕眩**至其下一回合结束」。 |
| 68 | `cb_ext_kanggeduo_chassis` 康格多底盘、`cb_ext_enhanced_system_upgrade` 增强系统升级、`cb_ch_pressure` 紧急泄压板 | `all-expansions.js:1632-1633,1643-1644,1797` | *Suldan* GMS & C&H Core Bonuses | ① `将 GMS 康格多更换为你正在驾驶的机甲`、`熔炉融解`；② `你可以选择 +2 热度`；③ `获得超过 0 HP 所承受的多余伤害获得抗性` | ① 康格多主宾颠倒，改为「**将你正在驾驶的机甲更换为 GMS 康格多**」，`熔炉融解`→`炉心熔解`；② 增强系统升级消除「自身受热」歧义，改为「**使目标额外承受 +2 热度**，或者额外选择第二个入侵选项」；③ 紧急泄压板修顺病句为「**对将你降至 0 HP 后溢出的剩余伤害获得抗性**」。 |
| 69 | `mw_ext_ea17_mortar` EA17 特种有效荷载迫击炮 & `ms_ext_lens_codex` 空_指针 | `all-expansions.js:1269,1557` | *Iphigenia* EA17: `Instead of attacking normally with this weapon, you may place a Blast 2 area...` / *C&P* `NULL_POINTER`: `next attack they make before the end of their next turn...` | EA17：`代替原本的武器进行正常攻击`；空_指针：连续三处 `下回合` 指代不清 | **解决 `EXPANSION-TRANSLATION-REVIEW.md:50,53` 两处疑点**：① EA17 改为「使用该武器时，你可以选择不进行常规攻击，改为在该武器射程内任意位置放置一个**溅射2**区域」；② 空_指针改为「目标在其下一回合结束前进行的下一次攻击 +1 难度。若该次攻击未命中，或目标在其下一回合结束前未进行攻击，则目标在该回合结束时陷入**晕眩**，直到其再下一回合开始」。 |
| 70 | `mw_ext_swan_song_lance` “绝唱”归零长矛 & `ms_ext_fallen_mask` 堕落面具之训 | `all-expansions.js:1264,1523` | *Iphigenia*: `...cancel an attack against them, or cause one to miss`（标准护卫三联触发语，与 `家族禁卫 III` 完全同源） | `取消对他们的攻击，或引起一次失误` | **解决 `EXPANSION-TRANSLATION-REVIEW.md:48` 疑点**：`cause one [an attack] to miss` 被机翻成「引起一次失误」，应与 `家族禁卫 III` 统一为 **`或使针对他们的一次攻击未命中（落空）`**；绝唱同时明确为「自你上一回合结束以来（或本场战斗中）」。 |
| 71 | `mw_ext_comet_hound` 猎兔犬巢房（SSC 彗尾蛾 III） | `all-expansions.js:1772` | *Suldan* (`Harrier Nexus`, p. 115): `At the end of your turn, as a free action you may deal 1 AP kinetic damage to all hostile characters within range 5 and line of sight that have Lock On.` | `在你的回合结束时，以一个自由动作，你在视线内可以对被锁定的所有敌方角色造成 1 AP 动能伤害。` | **严重漏译距离限制**：中译本整段漏掉了 **`within range 5`（射程5内）**，导致变成全图视线无限距离必中削血。已修正为「在你的回合结束时，以一个自由动作，你可以对**射程5**且视线内所有带有锁定的敌方角色造成 1 AP 动能伤害」。 |
| 72 | `mf_ext_comet_moth` 彗尾蛾 · 核心主动「天眼」 | `all-expansions.js:1768` | *Suldan* (`Sky Eye`): `at the end of each of your turns you may Bolster all allies within Sensors and line of sight that you are at a higher elevation than as a free action, and all hostile characters within Sensors and line of sight that you are at a higher elevation than become Locked On.` | `在你每回合结束并且处于更高的位置时，你可以在视线感应内强化所有盟友角色同时锁定所有敌对角色。` | **漏译自由动作 + 高度参照模糊 + 科技动作与挂状况混同**：已修正为以**自由动作**强化位于感应且视线内、且**你所处高度高于他们的**盟友角色；同时满足相同条件的敌对角色**获得锁定**。 |

---

## 第二类：车卡器前端构筑、多模式、常驻加值与渲染缺陷（14 项 · 建议同步修复）

| # | 问题模块 | 所在文件与行号 | 具体问题与影响 | 修正方案 |
|---|---|---|---|---|
| 1 | 5 个 KTB 官方背景推荐触发在引导向导中失效 | `all-expansions.js:173-187`、`assets/js/wizard.js:9-15` | `贵族后嗣 / 第二顺位者 / 连队扈从 / 潘克拉蒂 / 幼鹿` 的 `triggers` 仍写旧触发名（`摆架子`、`审度时势`、`掌控`、`入侵修理`、`打脸`、`快速到达某地`、`治疗`）且无 `skills` ID 数组，导致引导创建第 2 步推荐触发筹码大量丢失。 | 将 5 个背景的 `triggers` 更新为 v3.5 正式触发名（`显摆权势`、`审时度势`、`接管控制`、`骇入或修整`、`痛扁一顿`、`赶赴某地`、`包扎修理`），并补齐结构化 `skills: [...]`。 |
| 2 | 20 部 `高效` 扩展骨架漏标 `efficient: true` | `all-expansions.js`、`assets/js/frame-catalog.js:30` | 除 `康格多` 外，其余 **20 部** 正文写明 `（高效）` 的扩展骨架（官方 8 部：`晶眼蝶/狼人/库图佐夫/蒲公英/百臂巨人/万寿菊/红门兰/金盏花`；第三方 12 部：`布莱/夹竹桃蛾/哈布斯堡/火蜥蜴/内莫/纳尔逊飞翼型/切夜蛾/奇美拉/萨拉丁“恐惧刽子手”/柔剑/香菜/迦耶阿修罗`）均未设 `core_system.efficient: true`，导致骨架图鉴徽章显示「每任务通常可启动一次」而非「高效 · 场景结束时返还 1 CP」。 | 为上述 20 部骨架补齐 `core_system.efficient: true`（或在 `build-data.js` 自动识别 `（高效）` 注入 `efficient: true`）。 |
| 3 | `阿特拉斯蛾` 与 `基德` 特征数组顺序与官方错位 | `all-expansions.js:617-625,546-550` | `阿特拉斯蛾` 现为 `[猎人闪避, 绝杀, 外置反应堆, 巨人杀手]`（官方为 `[巨人杀手, 猎人闪避, 绝杀, 外置反应堆]`）；`基德` 现为 `[能量导流, 回收利用, 快速部署]`（官方为 `[快速部署, 能量导流, 回收利用]`）。导致车卡器「官方补充说明」面板中特征序号错乱（并影响 FVTT 按下标映射）。 | 将这两部骨架的 `traits` 顺序调整为与官方一致，并重跑 `build-official-supplements.js`。 |
| 4 | 5 把官方多模式武器缺失 `profiles` + `app.js` 模式索引截断在 2 | `all-expansions.js:1126,1169,1176,1183,1203`、`assets/js/app.js:904,1060,1267` | ① 官方武器 `电震利爪`（3 模式）、`骏逆回环`（4 模式）、`电箭巢房`（2 模式）、`寺岛之刃`（5 模式）、`HHS-155「食人族」`（2 模式）目前只有单组数据，无法在机甲挂载槽切换模式查看实时射程/伤害/标签；② **关键隐藏 Bug**：`app.js` 3 处 `slotProfile` 写了 `int(..., 0, 2)`，一旦武器超过 3 个模式（如骏逆回环第 4 模式、寺岛之刃第 4–5 架势），点击第 4/5 个按钮会被硬截断回第 3 个模式！ | ① 为这 5 把武器补齐完整 `profiles`（注意按 `rules.js:119` 规则将本体共享标签一并写入各 `profile.tags`）；② 将 `app.js` 的上限从写死 `2` 改为动态 `Math.max(0, (w?.profiles?.length || 1) - 1)`。 |
| 5 | 5 部扩展骨架将常驻被动部署物误放入 `active_deployables` | `all-expansions.js:869,936,979,2236,2449`、`assets/js/frame-catalog.js:23-32` | `镰翅蛾（黑猫无人机）`、`布莱（「船工」无人机）`、`哈布斯堡（E-R-桥塔）`、`茴香（军刀无人机）`、`八角（建筑项目）` 的可展开物都属于常驻核心被动（无需消耗 1 CP），却写在 `active_deployables` 里，导致渲染在 1 CP 主动大招下方。 | 统一迁入 `core_system.deployables`。 |
| 6 | 双类型武器缺失 `types` 与模式 `type` 导致模块校验与加值失效 | `all-expansions.js:1956,2166,2601,2604,2650`、`assets/js/rules.js:61,103` | ① `mw_kkca_kinetic_musket` 动能滑膛枪的 `刺刀` 模式未写 `type: "Melee"`，切换刺刀后仍被当成 `大炮（Cannon）`；② `17 型跳帮手枪`（CQB/近战）、`96 型盾炮`（近战/大炮）、`“残酷收割”等离子镰`（近战/巢房）、`黑荚克战斗弓`（发射器/步枪）未写 `types: [...]`，导致无法安装另一类型的合法武器模块（如 96 型盾炮装不上大炮模块）。 | 为刺刀模式补 `type: "Melee"`，并为上述双类型武器补齐 `types: [...]` 数组。 |
| 7 | 特殊限制武器漏标 `no_mods / no_core_bonus / no_attack` 与零伤拦截 | `all-expansions.js:1734,2635`、`assets/js/rules.js:63,107,137,191` | ① `mw_ext_ifrit_slip` 滑移枪正文写明「不能搭载模块或受核心奖励加成，且不进行攻击掷骰」，但缺 `no_mods: true, no_core_bonus: true, no_attack: true`，目前可违规装模块、挂超功率口径/自动稳定硬点并吃鬼面蛾 +1 命中；② `mw_ch_tangle_cannon` 纠结加农炮明文「不能造成任何伤害（包括额外伤害）」，却能挂载 `超功率口径（+1d6 额外伤害）`。 | 为滑移枪补齐三项标记；为纠结加农炮补 `no_bonus_damage`（或在 `mountEligibleForBonus` 中排除 `damage: []` 且禁伤害的武器）。 |
| 8 | `私人家教（cb_kkca_private_tutor）` 顶部天赋预算摘要未同步 | `assets/js/ui.js:64` | `ui.js:64` 顶部摘要写死 `天赋 ${spent}/${level.talents}` 而未调用 `talentBudget(p)`，选私人家教后显示 `8/6`（注：原文「在两个天赋上各获得 1 级，或在单个天赋上获得 2 级」在任意 2 点正整数拆分下与 `+2` 天赋总预算完全等价，且升级时可继续正常提升等级，不额外附加阻断合法构筑的人工限制）。 | 将 `ui.js:64` 改用 `talentBudget(p)`。 |
| 9 | `“曲线球”臂部调谐（cb_piof_curveball）` 榴弹 `+2` 受限次数未生效 | `all-expansions.js:2103`、`assets/js/rules.js:89-92` | 核心奖励规定「你的榴弹获得 +3 射程和 **+2 受限充能**」，但 `limitedTags(tags, p, m)` 目前只计算工程加值与 `内置弹药带`，未对榴弹系统（`tg_grenade` 或效果含榴弹的系统）增加 +2 使用次数。 | 在 `limitedTags`（传入装备对象或分类上下文）识别 `cb_piof_curveball` 并对带榴弹分类的系统自动 `+2` 受限次数。 |
| 10 | `赤蛱蝶` 特征「天蛇之尾」主近战 `+1 威胁` 未计入面板射程 | `all-expansions.js:1054` | 托尔图加、死神之首等骨架特征加值均已结构化写入 `bonuses`，唯独 `mf_ext_red_admiral` 特征 1「主武器近战武器获得 +1 威胁」缺少 `bonuses`，装备主近战武器时面板威胁值未自动 +1。 | 为 `mf_ext_red_admiral` 补入 `bonuses: [{ id: "range", val: 1, weapon_types: ["Melee"], weapon_sizes: ["Main"], range_types: ["Threat"] }]`。 |
| 11 | `总督蝶` 与 `万寿菊` 武器类型转换特征未接入模块与面板计算 | `all-expansions.js:245,423`、`assets/js/rules.js:61,103` | ① `总督蝶` 特征 1 让所有「发射器」同时视为「CQB」且获得 `威胁3`（应允许发射器安装 CQB 模块并在面板显示威胁 3）；② `万寿菊` 特征 1「枪决」让非重火器/非超重型远程武器视为「步枪」并获得 `杀绝`。目前两项特征均未反映到 `canModify` 与 `effectiveProfile` 中。 | 在 `weaponTypes(w, mech)` 与 `effectiveProfile(w, idx, p, m, slot)` 中按当前骨架 `mf_ext_viceroy` / `mf_ext_tagetes` 动态叠加对应类型、威胁 3 与 `tg_overkill`。 |
| 12 | 7 个主动扩展系统缺动作标签被系统库归为「被动」 + 5 个官方科技系统错标 `type: "Shield"` | `all-expansions.js:1359,1383-1396,1425,1529,1575,1706,1710,1924,2576` | ① `“烟窗”冷源`、`双联炮塔支架`、`反火力套组`、`CBNRN 密封技术`、`蟋蟀之艺，一式`、`犹大漏洞`、`子母弹发射器` 缺少对应动作标签（如 `tg_quick_action`、`tg_reaction`、`tg_protocol`、`tg_free_action`），在「系统库」按动作筛选时被误归入 `Passive`；② `高速机动喷口` 根本不是盾牌却标了 `type: "Shield"`，帝王蝶 4 个科技系统（`广域支配/帝王之眼/列王记/君王步态`）官方均为 `type: "Tech"` 却被错标为 `"Shield"`。 | 补齐上述系统的动作标签与 `tg_overshield`，并将 `高速机动喷口` 删去 `type: "Shield"`、帝王蝶 4 系统改为 `type: "Tech"`。 |
| 13 | GMS 变体骨架 `珠穆朗玛` 与 `萨加玛塔` 的 `license_level` 被设为 `2` + 非 GMS 变体骨架互斥校验缺失 | `tools/build-data.js:218`、`assets/js/app.js:270-310` | ① `build-data.js` 对所有 `variant_of` 骨架一刀切赋 `license_level: 2`，但 GMS 埃弗勒斯变体官方均为 `license_level: 0`；② `checks(p)` 未检查同一驾驶员多机甲列表中是否同时保留了同一非 GMS 牌照的标准骨架与变体骨架（违反互斥规则）。 | ① 在 `build-data.js:218` 对 `source === "GMS"` 的变体设为 `0`；② 在 `checks(p)` 增加非 GMS 标准骨架与变体骨架互斥提示。 |
| 14 | 专业牌照「武器舱 / 战术带」及「太空民 `ms_spaceborn_1`」内建系统与 Foundry 导出遗漏 | `all-expansions.js:164`、`assets/js/app.js:1223-1231`、`assets/js/foundry-export.js:55,70,94-95` | ① 卸下 `可拆卸武器舱（ms_pl_weapon_pod）` 时未清空 `m.podWeapon1/podWeapon2`，且 `foundry-export.js:94` 未检查是否装有武器舱及当前 `podMode`（主武器模式下仍把残留 `podWeapon2` 导出）；② 战术带占用的挂载点导出未标 `lock: true`；③ `太空民` I 级未挂接 `integrated: ["ms_spaceborn_1"]`（0 SP、独特、**不可摧毁**），机甲内建栏与导出均缺失该 EVA 组件。 | 在 `all-expansions.js` 补入 `ms_spaceborn_1` 内建系统（同步标明不可摧毁），并在 `cleanMechSystemRefs` 与 `foundry-export.js` 补齐武器舱校验与战术带 `lock: true`。 |

---

## 第三类：v3.5 术语一致性、细节润色与错别字（11 组）

1. **`散裂` → `离散`（Shredded）**：
   - `source/expansions/professional-licenses.js:60`（`wm_pl_underslung` 下挂式冲击器）：`目标必须通过机体豁免，否则陷入散裂` → 改为 **`离散`**（修复悬停词条识别）。
2. **`引导` → `导引`（Seeking，`tg_seeking`）**：
   - `professional-licenses.js:44`（`ms_pl_active_defense` 主动防御系统）、`all-expansions.js:1721`（`mw_ext_ifrit_nexus` 弓兵巢房）、`2611`（`mf_ch_matador` 斗牛士）、`2614`（`mw_ch_bull_missile` 公牛反辐射导弹）、`2648`（`mf_ch_sagittarius` 游隼寻索阔剑）中指代 `Seeking` 标签的 `引导` 统一为 **`导引`**。
3. **`崩溃` → `层流`（Cascade，v3.5 主译名）**：
   - `all-expansions.js:56-57,68`（`t_ext_iconoclast` 偶像破坏者）、`1320-1321`（`ms_ext_unstable_nhp` 不稳定 NHP）、`1338`（`ms_ext_human_error` 人因故障）中的 NHP `崩溃` 统一为 **`层流`**。
4. **`状态` vs `状况` 精确区分**：
   - `all-expansions.js:1468`（`ms_ext_reprieve` 死缓括号示例 `终止的状态` → `终止的状况`，同时将第二处 `下一回合结束` 明确为 `再下一回合结束`）。
   - *(附注：自设牌照 `professional-licenses.js:425`「凯旋」号角 `清除自身 1 个非自身造成的状态` 若原意指状况也可顺手按需调整，不作强制改动。)*
5. **`临时护盾` → `护盾`（Overshield）**：
   - `professional-licenses.js:49`（`ms_pl_hsc` 谐波护盾发生器）：`获得 1 点临时护盾` → **`获得 1 点护盾`**。
6. **`俯卧` → `伏卧`（Prone）**：
   - `all-expansions.js:2628`（`ms_ch_serpent_fang` //蛇 牙击）：`且不会俯卧` → **`且不会伏卧`**。
7. **`传送` → `瞬间移动`（Teleport）**：
   - `all-expansions.js:1182`（`mw_ext_kral_rifle` 克拉尔步枪）：`若你的目标传送` → **`若你的目标瞬间移动`**。
8. **`距离 X` → `射程 X`（Range X）**：
   - `all-expansions.js:505`（金盏花）、`1148`（军团巢房 `无人机距离 5 以内` → `射程5内`）、`1373`（共感护盾）。
9. **官方装备 12 处轻微断句与用词精度润色**：
   - `mw_ext_liberator` 解脱者（L1218）：消除「不能摧毁目标，或造成至少 1 结构伤害」的断句歧义，改为「若该武器的攻击所造成的伤害不足以摧毁目标或使其受到至少 1 点结构伤害，则即使命中也改为仅造成**可靠2**的伤害」。
   - `mw_ext_warp_rifle` 扭曲步枪（L1223）：`在自由空间中落地` → `在有效的自由空间中结束移动`（避免误导飞行目标必须降落地面）。
   - `ms_ext_fabi` FABI（L1345）：第二句 `当目标的一次远程或近战攻击命中` 改为 `当该友方角色的一次远程或近战攻击掷骰成功命中`（避免与前一句敌方「目标」重词）。
   - `ms_ext_multirole_drone` 多功能无人机（L1328）：补 `所有` 检定和豁免，明确「以快速动作将一台多功能无人机重新部署到新位置」。
   - `ms_ext_jager_kunst_1` 猎人之艺，一式（L1407）：`每件独立物品或地形` → `每个不同的物品或地形只能触发一次`（避免与前文 `free-standing` 独立地形撞词）。
   - `ms_ext_furnace_clamp` 熔炉钳夹（L1431）：`被你钳住的物品被破坏` → `被你钳住的物品或地形被摧毁`。
   - `ms_ext_dilemmas_nhp` 狄律摩斯级 NHP（L1461）：`大小和形状与你的目标大致相同` → `大小与你的目标相同、形状大致相似`。
   - `ms_ext_blink_charges` 霎间炸药（L1478）：`非自主角色` → **`非自愿角色`**（`unwilling`），补 `有效的自由空间`。
   - `ms_ext_blink_tunneler` 霎间隧道器（L1481）：`部分进入该空间的其他角色` → `至少部分进入该空间的除你之外的角色（敌人或盟友）`。
   - `ms_ext_power_assembly_1` 力量总成套组 I（L1494–1495）：补 `直接向远离你的方向击退1`；`除此之外，你的投射物会脱离地面或环境` → `否则，你的投射物是从地面或环境中扯出的`。
   - `mw_ext_marathon_arc_bow` 马拉松弧弓（L1175）、`mw_ext_hhs075_flayer` 剥皮者（L1195）、`mw_ext_slag_cannon` 熔渣炮（L1214）：将 `effect` 与 `on_attack` 字段名与官方结构对齐（熔渣炮补 `熔渣` 部署物条目）。
   - `t_ext_void_native` 太空民 I–III（L164–166）：`强制豁免` → `由其他角色强迫进行的豁免`；修顺第 3 级尾句。
10. **骨架与天赋内部译名统一及错字**：
    - `mf_ext_zheng` 郑（L733–737, 749）：人物姓氏 `Xiong Xiaoli` 在同篇设定中混用 `穹晓礼` / `熊晓礼`、`弓式` / `熊式`（应统一为 **`熊晓礼`**、**`熊式`**），L737 删多字 `一她`→`她`。
    - `mf_ext_emperor` 帝王蝶（L596–602）：特征正文中自称 `帝皇` 与骨架名 `帝王蝶` 混用，统一为 **`帝王蝶`**。
    - `mf_ext_amber_phantom` 晶眼蝶（L319）：设定提及 SSC 本家狙击骨架 `Death's Head` 误译为 `黄蛱蝶`，统一为 v3.5 译名 **`鬼面蛾`**。
    - `mf_ext_stortebeker` 斯托特贝克（L219, 234）：设定提及雷利核心武器 `M35 Mjolnir` 误译为 `寡言之锤`，统一为 **`雷神之锤`**；核心主动补 `在本场景中`。
    - `mf_ext_enkidu` 恩奇都（L272）：核心主动名 `Crush Limiter` 现写成了动作名 `一刀两断`，官方 `active_name` 为 **`粉碎限制器`**（启动后获得「一刀两断」反应）。
    - `mf_ext_sunzi` 孙子（L723, 725–726）：`捡起或放下它`、`至多 3 空间`、将混排 `TT_LIC_01` 统一为 `TT_许可_01`。
    - `t_ext_crusher` 碾碎机 I（L1769）：`鲁莽摇摆（Reckless Swing）` → **`鲁莽挥击`**。
    - `t_ext_iconoclast` 偶像破坏者 I（L55）：等级名 `Transgression` 意为「**僭越 / 犯忌**」（呼应风味 `打破禁忌`），现译 `海侵` 误取了地质学义项。
11. **重名系统提示（无需改 ID，仅供知悉）**：
    - `ms_ext_agrippa_parvati`（HA 阿格里帕 III）与 `ms_piof_parvati_nhp`（PI-OF 茴香 III）中文名称均为 `帕尔瓦蒂级 NHP`。车卡器内部全走唯一 ID 互不冲突，但在系统库同时显示时可凭厂商/牌照徽章区分（或为其中之一加厂商后缀区分）。

---

## 第四类：版本差异与用户拍板确认结果（5 项 · 已全部落实）

经确认拍板，以下 5 项版本取舍与专名修订已全部写入车卡器数据并通过测试验证：

1. **《午夜伊菲革涅亚》幽灵牌照（`针与线` & `堕落面具之训`）的数值版本**：
   - **已确认保留汉化版锁定数值**：`针与线（ms_ext_needle_and_thread）` 赋予 **`1+毅力`** 护盾，`堕落面具之训（ms_ext_fallen_mask）` 轮末恢复 **`毅力`** 点 HP（未改用英文后续迭代版 v0.6.0 的 `4+毅力/2` 与 `2+毅力/2`），同时将机翻 `引起一次失误` 修正为 **`使针对他们的一次攻击未命中`**（同步修正 `“绝唱”归零长矛`）。
2. **`mf_ext_banshee_vine` 树绳妖核心主动（第 67 项）**：
   - **已确认修正**：将原误译的 `成功则对方因任何原因无法离开驾驶舱，若没有驾驶员则晕眩至下一回合结束` 修正为豁免失败无法离舱或无驾驶员时的兜底效果：**`若目标因任何原因无法离开驾驶舱或没有驾驶员，则改为晕眩至其下一回合结束。`**
3. **`t_ext_bricklayer` 砖匠 III 溢出治疗措辞（`all-expansions.js`）**：
   - **已确认修顺**：改为 **`恢复等同最大 HP 一半的 HP；超出最大 HP 上限的溢出恢复量转化为护盾。`**
4. **两处既有专名修正与统一**：
   - `ms_ext_chimney_cold_source`（基德 III，`SMOKESTACK Heat Sink`）：已由 `“烟窗”冷源` 修正为 **`“烟囱”冷源`**。
   - `wm_ext_hypermass_mod`（卡利班 I，`Supermassive Mod`）：已由 `超巨质量模组` 按 v3.5 统一为 **`超巨质量模块`**（同步更新 `source/lore/zh.json` 风味引用）。
5. **扩展 NPC 遗留疑问结案**：
   - `source/npc/README.md` 中关于《塞壬之歌》NPC 职业「暴风雨（Tempest）」的 `零度浴 / 太阳浴 / 旋涡浴 / 狂风浴` 归属疑问，经核对英文原书确认确为「类别 III（系统，协定）」下的四项气象姿态选项，已在 `source/npc/README.md` 移入已确认记录结案。
