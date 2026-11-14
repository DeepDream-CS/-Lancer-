# Lancer 简易车卡器：开发说明

纯前端、无依赖的《枪骑兵》（Lancer）中文车卡器。双击 `index.html` 即可使用；本地预览用 `node tools/serve.js`（`.claude/launch.json` 里的 `builder`，端口 8765）。角色存在 localStorage 的 `lancer-builder-v1`，战斗地图另存在 `lancer-battle-map-v1`。

## 协作约定

- **不要替用户提交或推送**。用户自己在 GitHub Desktop 里提交。
- 界面与文档用简体中文；术语以《枪骑兵》核心规则书 v3.5 为准（见 `docs/TRANSLATION-V35.md`、`source/core-v35-overrides.json`），例如核心奖励、机甲技能、标准移动、超温危域、防护服、检定。核心骨架用 v3.5 译名（如 Monarch 为「金斑蝶」，不要和扩展骨架「帝王蝶」混淆）。
- 用户提供的扩展资料（PDF、截图）照原文转录。明显错字可以修正，但要告诉用户；原文缺失或看不清的内容不要自行补写，列出来请用户提供。
- 改动要能在浏览器里看到时，用预览实际检查，再汇报结果。检查用的临时角色用完要删除，并恢复改过的设置（如「无视牌照限制」）。
- 网页版由 GitHub Pages 提供，脚本缓存约 10 分钟；用户说推送后看不到更新时，先确认线上文件，再提示强制刷新。

## 文件结构

| 文件 | 作用 |
|---|---|
| `assets/js/`、`assets/css/` | 网页资源统一收纳；生成器、测试与页面均引用此处，根目录不保留重复资源 |
| `index.html` | 页面骨架；脚本顺序：`assets/js/data.js → assets/js/equipment-lore.js → assets/js/wizard.js → assets/js/cardexport.js → assets/js/rules.js → assets/js/glossary.js → assets/js/ui.js → assets/js/system-library.js → assets/js/faq-data.js → assets/js/faq.js → assets/js/frame-catalog.js → assets/js/battlemap.js → assets/js/app.js → assets/js/foundry-export.js`；之后是判定速查、`npc-data.js → npc-library.js`（NPC 库）、`npc-classes.js → npc-builder.js`（NPC 构筑） |
| `assets/js/data.js` | **生成文件，不要手改**。由 `tools/build-data.js` 生成 |
| `assets/js/equipment-lore.js` | **生成文件，不要手改**。风味文本独立数据，由 `tools/build-equipment-lore.js` 生成 |
| `assets/js/system-library.js` / `assets/css/system-library.css` | 只读系统与武器改装查询，搜索、筛选、规则及风味文本展示 |
| `docs/` | 翻译、核验与界面记录；入口为 `docs/README.md`，相对链接按文档实际位置填写 |
| `source/lore/` | 风味文本中文及出处，见该目录 README |
| `assets/js/app.js` | 状态、存档、导入导出、各页面（驾驶员 / 等级成长 / 机甲 / 角色卡 / 战斗地图入口）、数值计算、渲染与事件 |
| `assets/js/rules.js` | 车卡规则：天赋装备、加值、挂载点与超重型、受限、配装检查、旧存档迁移 |
| `assets/js/wizard.js` | 引导式车卡步骤（`WIZ_STEPS`），复用 assets/js/app.js 的各个面板 |
| `assets/js/ui.js` | 纯界面状态：天赋/系统/骨架筛选、系统搜索（`systemSearchText`）、切换骨架确认、术语高亮与术语库、武器表 |
| `assets/js/frame-catalog.js` / `assets/css/frame-catalog.css` | 骨架目录：浏览、预览后再确认使用 |
| `assets/js/faq.js` / `assets/css/faq.css`、`assets/js/faq-data.js` | 规则 FAQ 面板；`assets/js/faq-data.js` 由 `tools/build-faq.js` 生成 |
| `assets/js/battlemap.js` / `assets/css/battlemap.css` | GM 本机六角格战斗地图，存档与角色独立；`BattleMap.toFoundry` 导出 Foundry v13 场景 JSON |
| `assets/js/glossary.js` | 手写术语（`GLOSSARY_SRC`）；标签说明与扩展规则在运行时并入 |
| `assets/js/cardexport.js` | 角色卡图片（canvas）与文字卡 |
| `assets/js/foundry-export.js` | 导出到 Foundry：角色转为 COMP/CON v2 驾驶员 JSON（Foundry 驾驶员表「文件导入」），扩展条目按 `D.fvtt_map` 改用官方 id |
| `assets/js/npc-library.js`、`assets/js/npc-data.js` | NPC 库：原书页图与文字检索（资料见 `source/npc/README.md`） |
| `assets/js/npc-builder.js` / `assets/css/npc-builder.css` | NPC 构筑：职业 + 层级 + 模板 + 可选系统，存 localStorage `lancer-npc-builder-v1`，导出 Foundry NPC 角色 JSON（`toFoundry`）；`window.NPCBuilder` 提供计算接口 |
| `assets/js/npc-classes.js` | **生成文件，不要手改**。由 `tools/build-npc-classes.js` 从 `source/npc/core-npcs.json`、`books-npcs.json` 与尘墓模板生成 |
| `assets/css/style.css` | 主样式 |
| `source/lancer-data/` | COMP/CON 开源数值数据（核心规则书） |
| `source/cn/`、`source/tw/` | 规则站简体 / 繁体原文 |
| `source/i18n/{en,zh}/` | 自译：键为 `id.字段路径`，英文相同的条目共用译文 |
| `source/core-v35-overrides.json` | v3.5 译名与术语覆盖层 |
| `source/expansions/all-expansions.js` | 扩展内容（PDF 与截图转录，原文即中文） |
| `source/expansions/professional-licenses.js` | 专业牌照（见 `docs/PROFESSIONAL-LICENSES.md`） |
| `source/faq/` | FAQ 英文快照、中文译文与许可（见该目录 README） |
| `source/npc/` | NPC 库资料目录与结构化 NPC 数据（`core-npcs.json`、`books-npcs.json`，由解析工具生成；见该目录 README） |
| `source/fvtt/` | Foundry 官方数据快照、id 映射、补译、动作与部署物数据；`source/fvtt/module/` 是界面中文模组源文件 |
| `dist/fvtt/` | **生成结果**：两个中文内容包、模组 `lancer-cn/` 与 zip、待译清单；`lancer-cn-bundle.zip` 是本机测试用打包 |

注意：`assets/js/ui.js` 在 `assets/js/app.js` 之前载入，`esc`、`plain`、`T`、`tagText` 等此时还不存在；assets/js/ui.js 里用到它们的初始化要延后到首次调用（参照 `getGlossary()` 的写法）。`assets/js/app.js` 里读档时就会用到的函数要写成函数声明（例如 `licenseFrames`、`talentBudget`），不能用 `const`。

## 数据流水线（`node tools/build-data.js`）

1. 读 lancer-data 数值 + 规则站中文 + `source/i18n/zh` 自译，组成 `data`（中文名放在 `data.zh` 各表或条目的 `zh_name`）。
2. `calibrate-text.js` 统一术语 → `core-v35.js` 套用 v3.5 译名覆盖。
3. `mergeExpansion()` 并入扩展与专业牌照：只套用 calibrate-text 和 v3.5 **术语表**，不做旧译名替换（那一步会把「内建武器」「百臂巨人」这类普通词误换成核心条目的新译名）。
4. 输出 `assets/js/data.js`。
5. 调用 `tools/build-equipment-lore.js`，结合 `source/lore/zh.json`、原始装备描述和当前数据生成 `assets/js/equipment-lore.js`、`docs/EQUIPMENT-LORE-AUDIT.md`。核对表由工具维护，不在生成文件中手补内容。

FAQ 使用独立流水线：`node tools/build-faq.js` 读取保留的上游快照和中文译文，生成 `assets/js/faq-data.js`。日常数据构建无需联网，不会主动获取上游新版本。

## 扩展内容约定

- 每个条目自动带 `ext: true` 和 `pack`，界面显示金色「扩展」标签。
- 新厂商：在 all-expansions.js 用 `manufacturers.push({ id, name, color, description })`，构建时并入 `D.manufacturers` 和 `zh.makers`，厂商筛选、牌照列表、核心奖励分组会自动出现。核心奖励用 `core_bonuses.push`，`source` 填厂商 id；资格按该厂商牌照合计 3 级 / 个计算。
- 变体骨架：`variant_of` 指向标准骨架 id；沿用标准骨架牌照（牌照 II 可用），不出现在牌照列表，构建时排在标准骨架之后。`source` 用标准骨架的厂商，实际制造商写在 `maker_note`。
- 新授权骨架：装备的 `license` 填骨架的 `name`（查找名），`license_level` 1–3；骨架本身牌照 II 解锁。
- 骨架内建武器不写 `source`（因此不会出现在可选列表），在核心系统写 `integrated: [id]`。多模式武器（多枪头、两种形态）用 `profiles`，每项含 name / damage / range / tags / effect。
- 天赋装备用 `talent_item`、`talent_id`、`talent_rank`，并在天赋等级里写 `special_equipment`。天赋等级上的 `bonuses`（如 `deployable_hp`）会保留到 assets/js/data.js 并计入数值。
- 武器改装放在 `mods`，用 `allowed_types` / `allowed_sizes` 限制；`stack_tags: true` 表示同名数值标签相加（如击退 +1）。
- 新规则术语（变体骨架、高效、无形等）写在 `rules`，会出现在术语库和相关骨架的「扩展规则说明」。
- 特殊机制需要代码支持时，在骨架或核心奖励上加字段并在 assets/js/app.js / assets/js/rules.js 处理。现有例子：`no_grit_hp`、`cb_ext_superheavy_mounting`、`cb_kkca_private_tutor`（`talentBudget`）、`cb_kkca_signature_move`（机甲字段 `signature`，`signatureDiscount`）。需要指定对象的核心奖励在 `loadoutChecks` 里加未指定的报错。
- 新增内容后更新 `tools/test-rules.js` 里扩展条目数量的断言，并为新机制加检查；id 不能和已有条目重复（有专门检查）。

## 术语高亮

- `highlightTerms()` 在每次渲染后扫描 `#app` 的文字节点；名称、标题、按钮、选单等不标记（`TERM_SKIP`）。
- 多义词要写 `re`（上下文正则），只在规则意义下标记，例如「强化」只认「强化一个盟友 / 或锁定」；字面意义常见的标签列在 `GLOSSARY_STRICT_TAGS`。
- 个别短语要排除时加 `{ t: "短语", stop: true }`：匹配但不标记，长匹配优先（例：卫戍长矛的「锁定该武器」）。
- 改动术语后运行 `node tools/glossary-audit.js [术语] [条数]`，逐条看命中的上下文有没有误标；误标案例加进 test-rules 的术语测试。

## 测试与检查

```bash
node tools/build-data.js            # 重新生成 assets/js/data.js
node tools/test-rules.js            # 车卡规则、扩展、核心奖励、筛选与搜索、术语、武器表回归检查
node tools/test-v35.js              # 核心数据的译名、数值结构与稳定 ID（会先剔除扩展条目）
node tools/test-expansion-copy.js   # 扩展文案校正与牌照引用
node tools/test-mod-display.js      # 武器改装显示
node tools/test-faq.js              # 规则 FAQ
node tools/test-core-corrections.js # 核心修正、无人机动作和重分配
node tools/test-equipment-lore.js   # 风味文本与出处
node tools/test-system-library.js   # 系统库浏览器检查（需本机 Playwright / Edge）
node tools/i18n-missing.js          # 自译缺项
node tools/build-lcp.js             # Foundry 核心包与扩展包（dist/fvtt/）及核对表 docs/FVTT-LCP-*.md
node tools/test-lcp.js              # Foundry 内容包的枚举、引用、映射检查
node tools/build-fvtt-module.js     # Foundry 界面中文模组 lancer-cn（dist/fvtt/lancer-cn/、.zip）
node tools/test-fvtt-module.js      # 模组译文、清单、写死英文翻译、骨架插图钩子检查
node tools/test-foundry-export.js   # 导出到 Foundry 的驾驶员 JSON：结构与所有条目 id 都能在 Foundry 中找到
node tools/parse-npc-core.js [--text] [--write]  # 从 NPC 库原书文字解析核心 NPC 职业 / 模板 → source/npc/core-npcs.json
node tools/parse-npc-books.js [--text] [--empty] [--write]  # 官方模组与第三方书的 NPC → source/npc/books-npcs.json
node tools/build-npc-classes.js     # NPC 构筑数据 assets/js/npc-classes.js
node tools/test-npc-builder.js      # NPC 数据结构、解析回归、数值计算、全部职业与模板导出 Foundry NPC 的合法性
node tools/scan-fvtt-labels.js ../foundryvtt-lancer [--write]  # 扫描系统模板与代码中写死的英文，对照 / 更新快照
node tools/export-official-todo.js  # 官方补充书中车卡器未收录条目的清单与待译 JSON
node tools/export-npc-todo.js       # Foundry 官方数据中的 NPC 职业 / 特性 / 模板待译 JSON（dist/fvtt/zh-npc.todo.json）
node tools/draft-ext-actions.js [--write]  # 扩展条目正文里的动作 → 按钮草稿（source/fvtt/ext-actions.json，人工核对）
# source/fvtt/ext-deployables.json：说明文字里写了数值的部署物（人工照原文转录），build-lcp 构建扩展包时套用
```

- test-v35 用数值结构摘要锁住核心数据；扩展内容和新增的顶层字段（如 `ext_rules`、`professional_licenses`）要在 `stripExt()` 里剔除，不要改基线。
- `test-rules.js` 等规则检查在 vm 中运行，使用模拟 DOM；会碰 DOM 的函数要先判断（如 `enhanceUI` 检查 `app.querySelector`）。测试代码里的变量名不要和全局名（`m`、`a` 等）冲突。 assets/js/battlemap.js 也在测试里载入（`BattleMap.footprint` 有占格检查）；assets/js/faq.js 不载入。
- 机甲 SP、豁免目标等会加上毅力，测试数值时用不受毅力影响的项（如感应、热度上限）。

## 编辑注意

- 含反斜杠的正则、含引号的多行文字，不要经 bash heredoc 或 `node -e` 写入：转义会丢失或被 shell 打断。用编辑工具改，或先把脚本写到临时文件再执行。
- 仓库文件可能是 CRLF / 缩进不一（用户在 GitHub Desktop 提交时会转换）；字符串替换前先看清原文。
- all-expansions.js 可能同时被其他会话修改；编辑前后注意「文件已在磁盘上变更」的提示，构建后核对条目数量是否只多了自己加的部分。


## 文档与发布维护（2026-11-04）

- [项目说明](README.md)描述当前功能；[文档目录](docs/README.md)区分当前维护说明和历史核对记录。历史测试数量保留原日期，新增结果另记日期，避免把旧范围当作全部现状。
- 所有命令默认从项目根目录运行。文档搬到 `docs/` 后，指向源码的 Markdown 链接要使用 `../source/...` 等相对路径；行内代码中的路径仍相对于项目根目录。
- `source/faq/upstream.md` 是第三方英文快照，保留原文、版本和许可。更新功能说明时不要改写该快照；变更上游版本需按 `source/faq/README.md` 的流程核对与翻译。
- 系统库脚本在 `assets/js/app.js` 之前加载，依赖后者的调用要延后。库中数据为基础值，受角色加成的受限次数等由配装与导出计算。
- `test-system-library.js` 是真实浏览器检查，当前引用本机 Playwright 路径并使用 Edge；其他环境应先调整依赖位置。截图 `system-library-preview.png` 是本地检查产物，不是网页运行必需资源。
- 仓库只包含正式项目；工作区的历史副本、备份不属于网页运行结构。用户自行提交时，应包含移动后的 docs 文件、旧文件删除以及数据生成结果，不自动提交或推送。

## 网页资源目录（2026-11-04）

根目录只保留网页入口及项目说明、配置；浏览器脚本在 `assets/js/`，样式在 `assets/css/`。脚本文件内容及加载顺序保持原逻辑，仍使用传统 script 标签，以兼容直接打开本地 HTML。页面中的图片／牌照资料路径仍相对于 `index.html`；以后若 CSS 引用图片，应按 CSS 所在目录计算相对路径。

工具命令仍从项目根目录执行；浏览器资源应使用完整的项目相对路径。构建器会自动创建 `assets/js/`，规则和 FAQ 检查均从新目录读取。不要在根目录新增同名资源副本，否则可能出现测试与网页读取不同文件的情况。


## 判定速查（2026-11-05）

顶部“判定速查”可打开结构伤害、过热（压力）两张表及结算步骤，支持手机、离线查询、Esc 关闭。依据用户提供的《枪骑兵》核心规则书 v3.5 PDF 第 75–76 页。只读查询，不改角色或战斗地图存档。实现位于 `assets/js/damage-reference.js` 与 `assets/css/damage-reference.css`，由 `index.html` 加载。


## Foundry 内容包与模组（2026-11-07 起）

见 [Foundry 内容包](docs/FVTT-LCP.md)。用户的系统 fork 在 `../foundryvtt-lancer`，仅作对照，不改系统本体。Foundry 相关的改动要在实际 Foundry 中由用户确认；模拟测试通过不等于实际可用，汇报时分开说。

### 内容包（`tools/build-lcp.js`）

把 `assets/js/data.js` 导出为 LANCER 系统（v3.1.3）可导入的两个 v2 LCP（`PACKS`：`core` 核心规则书、`ext` 扩展内容）。内容变化后提高 `PACKS` 里的版本号。

- 两个包都以 Foundry 自带数据为底（核心包 `source/fvtt/core/` 的 lancer-data 3.1.7，扩展包 `source/fvtt/official/`），按 id 覆盖英文版，换成车卡器文本与数值；只采用含汉字的车卡器文字。
- 核心包只采用车卡器有意改过的数值（data.js 与 `source/lancer-data/` 副本不同）；那份副本比 3.1.7 旧，不要直接拿它的数值覆盖。
- 扩展条目与官方补充书重复时按 `source/fvtt/official-map.json` 改用官方 id；新增扩展条目若对应官方补充书，要在映射表补上，否则会与英文版重复。
- 新的车卡器专用字段要加进 `BUILDER_ONLY`，需要 GM 手动处理的写进 `builderNotes()`。Foundry 枚举或频率不合法会让整批导入失败，`test-lcp.js` 会检查。
- 仍为英文的文字在 `dist/fvtt/zh-overrides*.todo.json`，补译写到 `source/fvtt/zh-overrides*.json`。
- 状态与状况随核心包导出，文字取自术语库（`source/fvtt/statuses-zh.json` 对应）；模组的状态图标名要与之同名（test-lcp 检查）。
- 带附加武器数据的改装另导出「附带武器」；正文里的动作按 `source/fvtt/ext-actions.json` 生成按钮，部署物数值按 `source/fvtt/ext-deployables.json`。
- NPC 职业 / 模板 / 特性由 `buildBuilderNpcs` 从 `assets/js/npc-classes.js` 写入（核心规则书 → 核心包，其他书 → 扩展包；尘墓用官方数据，见下节）。

### 界面中文模组 lancer-cn（`source/fvtt/module/`，`tools/build-fvtt-module.js`）

清单链接指向 GitHub Pages 上的 `dist/fvtt/lancer-cn/module.json`。每次改动都要提高 `module.json` 版本号，并在 `source/fvtt/module/README.md` 与 `docs/FVTT-LCP.md` 的「模组更新记录」里加一行；用户更新后要重启 Foundry。

- **界面译文**：语言代码 `cn`（与 foundry_chn 相同）。系统模板 / 代码里写死的英文不经语言文件，模组在显示时按词典替换（`cn-hardcoded.json`、`cn-words.json`，对照扫描快照 `hardcoded-en.json`），只改文字节点和提示属性，不碰输入框、编辑区和存档数据。系统升级后先运行 `scan-fvtt-labels.js` 看新增条目；不想翻译的调试信息写 `null`。
- **中文版面修正**：`UI_FIX_STYLE`（中文界面启用时注入，系统样式在 `@layer lancer` 里，不分层即可覆盖）；中文字体没有的字形在 `GLYPHS` 里替换。用户截图反馈的版面问题加在这里。
- **骨架插图**：骨架改成中文名后，Foundry 按英文名查插图的地方找不到图，模组用钩子按骨架 id 补图。
- **车卡器资料**：专业牌照、扩展厂商无法经内容包导入，由 GM 按钮「导入车卡器资料」写入合集包（`importReference`），同时把骨架牌照改为中文名。
- **攻击时选目标**：`lancer.preFlow.*` / `lancer.postFlow.*` 钩子开关目标面板（`openTargetPicker`）；客户端设置 `targetPicker`、`targetClearStale`、`targetAutoPick`。
- **指示物名字与飘字**：世界设置 `tokenNames`（`preCreateToken` 设显示名称，`applyTokenNames` 由在线 GM 同步已有指示物）；第一次载入时打开系统设置 `lancer.floatingNumbers`（伤害飘字由系统负责）；状态飘字「+(名称)」在 `patchScrollingText` 里改样式。
- **基础动作、对抗检定与受限计数**：机甲、NPC 与驾驶员表的双层「基础动作」卡（`BASIC_ACTIONS`，`actors` 区分 `mech` / `npc` / `pilot`，`group` 分主动作与战术姿态；含强化联动 `StatRollFlow` 自动 `+2` 准度并消耗、擒拿按有效体型与「合成肌肉网」控场及挣脱/争抢主导对抗、搜索系统 vs 敏捷摘匿迹、受身全抗性与下回合提醒、关机/开机、起身、脱离、准备、自爆、弃机、上下马，以及步战驾驶员骑乘控制卡/甩脱对抗、包扎 `10+` 或消耗止血贴/修复胶急救与昏迷联动、装填；通用对抗引擎 `createContestCard` / `respondToContest` 平局发起方胜出、晕眩机甲机体/敏捷自动失败）；掷骰式受限包装 `prepareFinalAttributes`；文字受限计数器存机甲 `flags.lancer-cn.counters`；说明里的骰子由 `linkDice` 变成链接。
- **战斗自动化（核心协议 CP、武器改装、科技入侵、全天赋与核心奖励、状态、豁免、非攻击伤害、跨权限结算与流程补完）**：机甲核心协议全骨架自动化（包装 `consumeCorePower` 置位 `system.core_active = true`，`deleteCombat` / 场景结束对全部 21 台「高效」骨架、未开火巴巴罗萨、未处决恩奇都自动返还 1 CP，核心激活卡与机甲表注入 `renderCoreControlHTML` 控制台，拿破仑「真黑神盾」包装 `damageCalc` 与 `previewDamageCalc` 将非 `paracausal` 伤害压至 1，多模式内建武器切换、充能骰追踪、迷宫递减难度豁免与专属准度/会心/过热钩子）；武器与全部 17 种改装特效（`transformWeaponBaseDamage` 临时快照拟态枪/自适应配重/刺鬃冠/智能刀不污染物品存档，`rollCombatDrillOverkillChain` 原生联动杀绝热度，燃料棒枪排热、碎颅者零难度免疫受损、虎爪警棍必中、运动驱动器按护甲加伤、彗星群充能与花环/大叔/相位就绪等改装）；科技与多选项入侵单动作精准隔离（`printTechAttackCard`、`classifyTechAttackCard`、欧西里斯四门递进、圣武士碎片整理 `+3` 护盾、骇客 I–III、扫描虫群、黑冰递进难度、西西弗斯与 PEBCAC）；全部 50 项驾驶员天赋、`combatMechOf` 驾驶员天赋卡激活机甲路由、9 类天赋骰与机甲表 `renderTalentControlHTML`「天赋与核心战术栏」，以及设计优越、低速循环屏蔽罩、百臂巨人 1 结构抗性、卓越誓言、门之训等常用战斗核心奖励；攻击 / 激活 / 结构与过热表卡自动施加无豁免前提的状态、消除消耗的锁定并附「↩ 撤销状态」按钮（`onCreateChatMessage`、`classifyAttackCard`、`selfStatusesIn`、`undoAppliedStatuses`）；强迫豁免按钮所有人可见，失败自动挂状态、成功减半联动 `DamageRollFlow`（`parseSavesInText`、`executeCardSave`）；非攻击卡「掷伤害」与范围模板放置按钮（`parseNonAttackDamage`、`parseAoERanges`、`placeAoETemplate`）；非拥有者目标上的伤害应用与撤销经模组 socket 请在线 GM 执行，伤害卡实时显示中文「结算预览」（`onCrossPermDamageClick`、`previewDamageCalc`）；包装 `game.lancer.flowSteps` 补齐 NPC「致命 / 额外致命」暴击加伤、机甲「稳住阵脚」清除状况、结构与过热表状态及 1 压力 NPC 过热扣热度上限（`patchLancerFlows`）；`updateActor` 自动切换超温危域与无结构失能，`updateCombat` 回合结束发出到期状态清除提醒卡（不做交战检测），机甲与 NPC 表加「抗性开关」栏。四个世界设置 `autoApplyStatus`、`crossPermDamage`、`autoDangerZone`、`turnEndPrompt` 默认开启。
- **掩护区、困难与危险地形**：区域行为「LANCER 掩护区」（`lancer-cn.cover`）与「LANCER 危险地形」（`lancer-cn.dangerous`，均在 `module.json` 的 `documentTypes` 声明，显示名写进语言键 `TYPES.RegionBehavior.lancer-cn.*`）：掩护区切换 `cover_soft` / `cover_hard`；危险地形在移入或回合结束时发送带一键工程检定按钮的提醒卡；困难地形用系统与 Foundry v13 原生的 `modifyMovementCost`（`walk: 2`）。「区域」工具栏提供四把涂画工具（`lancerCoverSoft` / `lancerCoverHard` / `lancerTerrainDifficult` / `lancerTerrainDangerous`）。
- **导入车卡器战斗地图**：侧栏「场景」顶部与模组设置的 GM 按钮「导入车卡器地图」（`importBattleMap`、`parseBattleMap`），兼容车卡器备份与 `BattleMap.toFoundry` 导出的场景 JSON，支持新建独立六角格场景或铺到当前场景（自动处理奇偶列错位对齐，并可一键 `clearUnitMarkers` 清除底层部署位置标记）。
- **六边形墙体**：「墙壁」工具栏的 GM 工具（`lancerHexWall`），每格 6 段阻挡移动的墙 + 玩家可见的六边形图形（都带 `flags.lancer-cn.hexWall`）；有墙或图形任一样都算有墙体；`deleteWall` 钩子在墙删光时删图形；设置 `hexWallBlocksSight` 控制是否阻挡视线。
- **画布指针拦截**：涂画工具（`PAINT_TOOLS`、`onHexPointer`）与点地图锁定（`onTargetPointer`）都在 window 的捕获阶段、init 时注册。PIXI 在画布元素与 document / window 上监听，拦在画布元素上不够（墙壁图层会把拖动画成直线墙）。

## NPC 构筑（2026-11-09）

顶部「NPC 构筑」（`assets/js/npc-builder.js`）参照 COMP/CON 的 NPC 名册：选择职业、层级、模板和可选系统，自动计算数值，可导出 Foundry NPC 角色 JSON（Foundry 中新建 NPC 角色 → 右键「导入数据」）。

- 核心职业 / 模板数据由 `tools/parse-npc-core.js` 从 NPC 库的原书文字（`assets/js/npc-data.js`，核心规则书 PDF 第 278–325 页）解析，原文照录。修正写在解析器里（`STAT_PATCHES` 等），再用 `--write` 重新生成；不要直接手改 `source/npc/core-npcs.json`，测试会比对。
- 其他书的 NPC 由 `tools/parse-npc-books.js` 解析，各书的版面问题写在 `BOOKS`：
  - `skip` / `cut`：去掉整页或页末的小说、通讯记录；
  - `strip` / `drop` / `dropExact` / `dropRanges`：去掉标题和残留文字；
  - `moves`：效果文字排在名称前面时，把它移回名称之后；
  - `forceNames`：前一句没有句号结尾时，强制把这一行当作特性标题。
  
  逐条修正写在 `FEATURE_PATCHES`：改为可选、并入其他特性、删除、在开头加原文说明。同样只用 `--write` 重新生成 `source/npc/books-npcs.json`，不要手改。
- 模板加成只填原文写明的数字；原文的互斥（精英 / 超体 / 低等兵、班组、人类）只提示，不阻止。
- 导出格式按 foundryvtt-lancer 3.1.3 的 `npc`、`npc_class`、`npc_template`、`npc_feature` 数据模型：层级数值是三个元素的数组，层级标签值写成 `{a/b/c}`，物品带 16 位 `_id`。
- 已确认与待核对的原文写法列在 `source/npc/README.md`；用户确认后从「待核对」移到「已确认」，并在 `test-npc-builder.js` 锁住数值。
- NPC 数据变了要依次重新运行 `build-npc-classes.js`、`build-lcp.js`，并提高内容包版本号；`test-npc-builder.js` 与 `test-lcp.js` 检查格式与引用。
