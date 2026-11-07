# Foundry 内容包

[返回文档目录](README.md)

更新日期：2026-11-07。

车卡器的内容可以导出为 Foundry VTT「LANCER」系统（v3.1.3，Foundry v13）能导入的内容包（LCP），不需要修改系统本体。共两个包：

| 内容包 | 文件 | 内容 |
|---|---|---|
| 核心规则书（中文） | `dist/fvtt/lancer-cn-core.lcp` | 核心骨架、武器、系统、改装、核心奖励、天赋、驾驶员装备、技能与标签，覆盖 Foundry 核心数据的英文版 |
| 扩展内容（中文） | `dist/fvtt/lancer-cn-expansions.lcp` | 车卡器收录的扩展内容；与官方补充书相同的条目覆盖英文版，其余为新增 |

## 生成

```bash
node tools/build-data.js   # 先更新 assets/js/data.js
node tools/build-lcp.js    # 生成两个内容包与核对表；只生成一个时加 core 或 ext
node tools/test-lcp.js     # 检查两个内容包
```

其他产物：

- 核对表（自动生成）：[核心规则书](FVTT-LCP-CORE-AUDIT.md)、[扩展内容](FVTT-LCP-AUDIT.md)。
- 仍为英文的文字清单：`dist/fvtt/zh-overrides-core.todo.json`、`dist/fvtt/zh-overrides.todo.json`，补译方法见 [source/fvtt/README.md](../source/fvtt/README.md)。

清单名称、作者、版本写在 `tools/build-lcp.js` 的 `PACKS`。内容变化后提高版本号，Foundry 的内容包管理器会显示已安装版本。

## 在 Foundry 中导入

1. 进入使用 LANCER 系统的世界，打开系统设置中的内容包管理器（LANCER Compendium Manager）。
2. 先导入 Foundry 的核心数据，以及要用的官方补充书（Long Rim、Wallflower、KTB、Dustgrave、OSR、OWS、SotW、SSMR）。
3. 再导入 `lancer-cn-core.lcp`，最后导入 `lancer-cn-expansions.lcp`。
4. 启用「LANCER 中文」模组后，在「配置设置 → 模组设置」中点「导入车卡器资料」：建立专业牌照、把骨架牌照改为中文名，并生成「车卡器资料」日志（见下文）。

顺序很重要：Foundry 按条目 id 覆盖已有条目，所以中文包要在英文数据之后导入。以后如果重新导入核心数据或官方补充书（例如系统升级后提示更新），对应条目会变回英文，需要再导入一次中文包。

先导入英文数据还有一个好处：覆盖已有骨架时 Foundry 不改条目图片，骨架会保留 Foundry 自带的 Retrograde Minis 插图。Foundry 按骨架英文名查找插图，中文名找不到；启用下面的「LANCER 中文」模组后，改按骨架 id 补上插图（新建或导入的骨架条目、机甲换骨架后的头像与指示物）。没有启用模组时：

- 若跳过英文数据直接导入中文包，骨架条目没有插图。
- 把中文骨架拖到机甲上时，机甲头像和指示物不会自动换成骨架插图，需要手动设置。

## 界面中文模组（lancer-cn）

LANCER 系统的界面文字（语言文件中的角色表、聊天卡、设置、状态图标名、结构 / 过热表等 427 条，以及模板和代码中写死的英文）由 Foundry 模组「LANCER 中文」翻译，与内容包分开安装：

```
https://deepdream-cs.github.io/-Lancer-/dist/fvtt/lancer-cn/module.json
```

在 Foundry「附加模组 → 安装模组」的清单链接中填入上面的地址（需先推送到 GitHub，Pages 更新后才能安装），在世界中启用，并把语言设为「中文」。语言代码为 `cn`，与 Foundry 核心中文翻译模组 foundry_chn 相同，两者可同时使用。

```bash
node tools/build-fvtt-module.js    # 生成 dist/fvtt/lancer-cn/ 与 dist/fvtt/lancer-cn.zip
node tools/test-fvtt-module.js     # 检查译文、清单、写死英文的翻译与骨架插图脚本
node tools/scan-fvtt-labels.js ../foundryvtt-lancer   # 系统升级后：列出新增 / 消失的写死英文
```

### 写死的英文

系统模板、Svelte 界面和代码里还有约 670 段不经语言文件的英文（机甲 / 物品表的栏目名、挂载点选项、命中与伤害面板、扫描卡、提示消息、对话框和聊天卡标题等）。模组不改系统本体，而是在界面语言为中文时，按词典把显示出来的文字换成中文：

- 只改文字节点和 `title`、`placeholder`、`data-tooltip`、`aria-label`、`alt` 属性；输入框的值、文本框、富文本编辑区、日志正文、侧栏文档列表不动，存档数据也不会改。之后新出现或被更新的文字（聊天消息、通知、命中面板里的勾选项）同样会翻译。
- 画布上的浮动数字（「-5 HP」「+2 热度」）通过包装系统调用的 `createScrollingText` 翻译。
- 词典在 `source/fvtt/module/`：
  - `cn-hardcoded.json` 的 `text`：英文 → 译文；含 `{x}` 的是句式，`{x}` 依次代入原文对应部分（可用 `{1}`、`{2}` 调换顺序），代入的部分若是枚举词也会翻译。值为 `null` 表示有意保留英文（快捷栏拖放、按钮数据缺失这类开发调试信息，以及教程示例中的呼号）；原文被 HTML 标签拆成几段时用 `{ "pieces": {...} }` 分段翻译。
  - `cn-hardcoded.json` 的 `context`：只在特定界面使用的译法，例如扫描卡里的 Armor 是「装甲」数值，物品栏分类里是「护甲」。
  - `cn-words.json`：尺寸、武器 / 伤害 / 射程类型、动作等枚举词（不分大小写）。整段文字只由这些词组成时逐词翻译，例如「MAIN RIFLE」→「主步枪」；「名称 // MAIN CANNON」这类用 `//`、`::`、` - ` 分隔的标题按段翻译。
  - `hardcoded-en.json`：`scan-fvtt-labels.js` 从 foundryvtt-lancer 扫描出的写死英文快照及出处。构建会检查每段英文都有译文或标为 `null`、`{x}` 数量一致；系统升级后先运行扫描（加 `--write` 更新快照），再补译新增的条目。
- 扫描按源码推测文字，少数句子在实际页面中会被图标或标签拆开；遇到没翻译的英文，确认实际文字节点后在 `text` 中补句式或 `pieces`。

2026-11-07 用临时页面在浏览器中核对过文字节点、属性、后续插入的聊天消息、Svelte 式的文字更新、浮动数字，以及输入框和编辑区不被改动；尚未在实际的 Foundry 世界中测试。

### 车卡器资料：专业牌照与扩展厂商

Foundry 的内容包导入只按骨架生成牌照（并且只新建、不更新），也不导入厂商。模组在「配置设置 → 模组设置 → LANCER 中文」中提供 GM 按钮「导入车卡器资料」，导入两个中文内容包后运行：

- **专业牌照**：在 LANCER 的驾驶员物品合集包（`world.pilot-items`）建立 21 张牌照条目（lid `lic_<专业牌照 id>`，key 为专业牌照 id，厂商为所属厂商，默认牌照等级为该牌照的等级）。专业牌照装备在扩展内容包中的牌照字段就是这个 id，牌照表会按等级列出它们。Foundry 不检查取得条件（前置牌照、计费），由 GM 把关。
- **骨架牌照改名**：英文数据先导入时，骨架牌照一直是英文名；按骨架 id 找到合集包中的骨架，把牌照名改为骨架的中文名。
- **日志合集包「车卡器资料」**（`world.lancer-cn-reference`）：「专业牌照」（规则说明 + 21 页，含厂商、等级、说明和链接到合集包的解锁装备）、「扩展厂商」（C&H、K/KCA、PI-OF 的说明、骨架与专业牌照）。核心五家厂商在车卡器中没有说明文字，不生成页面。重复运行时，模组生成的日志会被替换。

数据由 `tools/build-fvtt-module.js` 从 `assets/js/data.js` 生成，专业牌照的规则说明在 `source/fvtt/module/professional-rules.json`。`test-fvtt-module.js` 用模拟的 Foundry 合集包检查建立、更新、改名与日志内容；尚未在实际的 Foundry 世界中运行。

- 译文在 `source/fvtt/module/cn-flat.json`（键与系统语言文件路径相同），`system-en.json` 是系统 v3.1.3 英文语言文件的快照，用于核对键和占位符。系统升级后替换该快照，构建会列出新增或删除的键。
- 术语与车卡器一致；结构 / 过热表的文字依 v3.5 第 75–76 页（例如炉心熔解可用自由动作重试工程检定，与 Foundry 英文的完整动作不同）。
- 骨架插图表 `frame-art.json` 由系统的 `retrograde-map.ts` 生成：`node tools/build-fvtt-module.js --art ../foundryvtt-lancer/src/module/actor/retrograde-map.ts`。车卡器的变体骨架沿用原骨架插图。
- 修改模组后提高 `source/fvtt/module/module.json` 的版本号，Foundry 才会提示更新。

从 COMP/CON 导入的驾驶员引用的是官方 id，因此会直接用上中文条目。

## 从车卡器导入角色

车卡器「角色卡」页的「导出到 Foundry」生成 COMP/CON v2 格式的驾驶员 JSON（`assets/js/foundry-export.js`）。在 Foundry 中新建一个驾驶员角色，打开驾驶员表的 <RM-4://SYNC> 页，在「文件导入」中选择这个文件；系统会建立技能触发、天赋、牌照、核心奖励、驾驶员装备，并新建机甲（骨架、挂载武器与改装、系统、内建武器）。

- 需要先导入两个中文内容包；专业牌照需要先运行模组的「导入车卡器资料」，否则这些牌照会列在导入结果的缺失清单里。
- 与官方补充书重复的扩展条目按 `source/fvtt/official-map.json`（构建时写入 `data.js` 的 `fvtt_map`）改用官方 id。
- 技能触发的 +2 / +4 / +6 换成等级 1–3；车卡器自定义触发导出为自定义技能。机甲 HP、结构、压力、维修按车卡器的计算填满。
- Foundry 没有对应字段的配置写进机甲备注「【车卡器配置】」：第二改装、选用的数据组、武器舱、战术带、哨兵无人机武器、招牌动作 / 超功率口径 / 自动稳定指定的对象、康格多遗产特征。自定义专业牌照和额外牌照等级写进驾驶员经历。
- 重复导入同一角色时，机甲按「驾驶员 id + 序号」匹配并更新，驾驶员身上的物品会先清空再重建（Foundry 导入的原有做法）。

`node tools/test-foundry-export.js` 检查导出结构符合 foundryvtt-lancer 3.1.3 的 `importCCv2`，并对所有 103 个骨架导出，确认每个条目 id 都能在中文内容包或 Foundry 自带数据中找到。2026-11-07 在车卡器预览中确认按钮可以生成文件；尚未在实际的 Foundry 世界中导入。

## 内容范围

**核心规则书**：Foundry 核心数据中的 424 个条目全部覆盖，另新增 7 个车卡器有、Foundry 数据没有的标签。

- 以 Foundry 使用的 lancer-data 3.1.7 为底，保留其主动效果、动作、协同效果等自动化结构。
- 名称和说明来自车卡器（v3.5 译名、规则站与自译中文、风味文本）。天赋等级里的动作按车卡器中文说明块换上中文名称、触发和说明。
- 数值只采用车卡器有意改过的部分（data.js 与车卡器 lancer-data 副本不同之处）。车卡器的 lancer-data 副本比 3.1.7 旧，其余数值沿用 Foundry 的，避免把新版勘误改回去。2026-11-07 构建时没有这类数值差异。
- 状态与状况（2026-11-07 起）：Foundry 的 15 个状态与状况，名称和说明取自车卡器术语库（依 v3.5），简述另写在 `source/fvtt/statuses-zh.json`。保留官方的 icon、类型，导入时覆盖英文条目；晕眩的数值效果由 Foundry 照常生成。
- 不导出：背景（Foundry 的内容包导入不支持）、预备资源。

**扩展内容**：

- 覆盖官方条目：以官方补充书数据为底，换成车卡器的中文文本和数值。
- 新增条目：车卡器独有的骨架、装备、天赋与核心奖励（哈勃、法罗斯、米切尔、K/KCA、PI-OF、C&H 等）。
- 不导出：厂商资料、背景、专业牌照本身、扩展规则说明。Foundry 的内容包导入不支持这些类型（牌照只按骨架生成），装备上的厂商只是文字。专业牌照与扩展厂商改由「LANCER 中文」模组的「导入车卡器资料」建立，见下节。
- 官方补充书中车卡器没有收录的 58 个条目（多为无牌照的异种装备、战役奖励、Madrigal 装备）导入后仍为英文，清单见 [FVTT-OFFICIAL-UNCOVERED.md](FVTT-OFFICIAL-UNCOVERED.md)，待译文字由 `node tools/export-official-todo.js` 导出到 `dist/fvtt/zh-official.todo.json`。

官方有、车卡器没有对应中文的文字（协同效果、部分动作说明、弹药与数据组名称、核心系统风味文本）由 `source/fvtt/zh-overrides*.json` 补译。2026-11-07 两个包都已没有残留英文；以后官方数据或车卡器内容变动时，新出现的英文会列在核对表与待译清单中。

## 需要 GM 手动处理的规则

Foundry 不知道车卡器的特殊规则，相关条目的说明末尾有「【车卡器说明】」段落：

- 变体骨架与原骨架互斥；HP 不加毅力的骨架（Foundry 会照常加上）。
- 康格多需要核心奖励「康格多底盘」，不占牌照。
- 专业牌照装备（Foundry 没有专业牌照，不会自动解锁）、天赋装备（标为不需要牌照）。
- 无人机武器在 Foundry 中按主武器挂载记录，机甲本身不能使用。
- 多类型武器、可选数据组、双改装武器、标签叠加的改装、附加武器数据的改装。
- 私人家教、招牌动作等由车卡器自动计算的核心奖励。

## 检查范围

`test-lcp.js` 按 foundryvtt-lancer v3.1.3 的数据模型检查枚举值和动作频率（不合法的值会让 Foundry 整批导入失败），并检查牌照、内建装备、标签引用、id 冲突、映射和补译表，以及核心条目是否全部覆盖、名称是否为中文。官方数据中由 Foundry 自动修正的占位值（如武器类型「Special」）不计为错误。2026-11-07 另用 JSZip 3.10.1（与 Foundry 系统相同版本）确认扩展内容包可以读取；两个包使用同一套 zip 写入代码。

尚未在实际的 Foundry 世界中导入测试；第一次导入后请确认没有报错，并抽查几件覆盖条目和新增条目的显示。
