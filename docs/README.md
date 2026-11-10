# 项目文档

[返回项目说明](../README.md) · [开发约定](../CLAUDE.md) · [打开车卡器](../index.html)

更新日期：2026-11-10。以下路径均指正式项目，命令默认从项目根目录执行；脚本在 `assets/js/`、样式在 `assets/css/`，网页入口是根目录 `index.html`。

## 文档索引

### 规则与翻译

| 文档 | 用途与范围 |
|---|---|
| [规则与译文校准](VALIDATION.md) | 初次核验记录、后续修正、当前检查入口与功能边界 |
| [核心规则 v3.5 译名对照](TRANSLATION-V35.md) | 核心译名、PDF 依据页与覆盖层维护 |
| [术语修订](GLOSSARY-REVISION.md) | 手写术语的来源与后续释义修正 |
| [扩展翻译核对](EXPANSION-TRANSLATION-REVIEW.md) | 指定骨架及牌照的转录校准、待澄清项，非全部扩展的重译证明 |
| [专业牌照](PROFESSIONAL-LICENSES.md) | 专业牌照的取得方式、配置支持与数据维护 |
| [规则 FAQ 翻译](FAQ-TRANSLATION.md) | 184 条快照问答的使用、来源和验证 |
| [风味文本覆盖与缺项](EQUIPMENT-LORE-AUDIT.md) | 自动生成的当前覆盖情况及未匹配清单 |

### 界面

| 文档 | 用途与范围 |
|---|---|
| [界面与交互改进](UI-UX.md) | 按日期记录布局、查询、地图与配置交互更新 |

### Foundry VTT

| 文档 | 用途与范围 |
|---|---|
| [Foundry 内容包](FVTT-LCP.md) | 两个中文内容包（含 NPC）、界面中文模组 lancer-cn 与其战斗工具、安装与导入顺序、常见问题、模组更新记录、从车卡器导出驾驶员与 NPC |
| [Foundry 核心包核对表](FVTT-LCP-CORE-AUDIT.md) | 自动生成：核心条目覆盖情况、仍为英文的文字 |
| [Foundry 扩展包核对表](FVTT-LCP-AUDIT.md) | 自动生成：覆盖的官方条目、数值差异、仍为英文的文字、自动生成的动作按钮 |
| [官方补充书未收录条目](FVTT-OFFICIAL-UNCOVERED.md) | 自动生成：Foundry 官方补充书中车卡器没有中文的 58 个条目，待译文字导出到 `dist/fvtt/zh-official.todo.json` |

## 数据维护入口

- [FAQ 数据与许可](../source/faq/README.md)：英文固定版本、中文译文和独立构建方式。
- [装备风味文本](../source/lore/README.md)：中文段落、来源、页码、缺项与构建方式。
- [NPC 原书资料与结构化数据](../source/npc/README.md)：NPC 库的来源；NPC 构筑用的职业 / 模板数据如何解析、生成，已确认与待核对的原文写法。
- [Foundry 内容包数据](../source/fvtt/README.md)：官方补充书快照、id 映射与补译；`node tools/build-lcp.js` 生成内容包。
- [界面中文模组](../source/fvtt/module/README.md)：模组的功能、设置与更新记录（随模组发布的说明）。
- `node tools/build-data.js`：生成规则数据，并生成风味文本及缺项表；`node tools/build-faq.js` 单独生成 FAQ。
- 完整检查命令及环境要求见[项目说明](../README.md#开发)与[开发约定](../CLAUDE.md)。

## 阅读约定

历史记录中的日期、测试数量和核验范围保留当时含义；最新维护说明另记日期。尚待英文澄清的条目、缺失风味段落和自动车卡检查不能覆盖的规则组合仍按各文档列出的边界处理。

核对表（风味文本、Foundry 内容包）由工具生成，修改源数据后重新构建；其余文档直接维护。上游 FAQ 英文 Markdown 是原文快照，不随项目说明调整而改写。
