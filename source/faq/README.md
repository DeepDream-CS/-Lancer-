# LANCER 规则 FAQ 与勘误：中文译本

本目录保留 aritsune/lancer-faq 的英文源文、中文逐条译文、贡献者名单及 GPL-3.0 许可。中文改编日期：2026-10-25。译文与原文一并提供，保持原项目许可；见 LICENSE。

- 原站：https://lancer-faq.netlify.app/
- 上游：https://github.com/aritsune/lancer-faq
- 固定版本：3e5fd612a2308fe28f1f937620d1efd2f4bcf5ae
- 184 条问答，113 个目录项（其中 NPC 通用规则、NPC 职业为分组标题）。
- 问题与章节 ID 沿用上游标题的 HMAC-SHA512 前六位，已与下载的在线页面逐项核对。
- 页码均沿用原站对应英文出版物的页码，不是中文核心规则书 PDF 物理页码。
- 该站是社区整理的 FAQ 与勘误。原文有 `<wot:...>` 标记的条目，在界面标为“Tom 裁定”，保留全部 Discord 来源。没有标记的条目不会被自动标为官方裁定。
- 保留原文的肯定、否定、例外、条件、推测和未来修订措辞；不把 FAQ 的修订静默写入车卡器规则数据。
- 中文名尽量沿用本车卡器与核心规则书 v3.5；尚未收录的专名附英文供核对。扩展书名为中文检索用名，并保留英文标题。

## 文件与构建

`upstream.md`、`upstream.json` 为英文快照；`zh-01.json` 至 `zh-03.json` 按稳定 ID 保存完整问答译文；`sections-zh.json` 保存完整章节译名。`contributors.txt`、`LICENSE` 来自上游。

运行 `node tools/build-faq.js` 生成 `faq-data.js`，无需联网、无需安装依赖。运行 `node tools/test-faq.js` 检查覆盖率、链接、搜索与渲染。`tools/prepare-faq.js` 用于从保留的 Markdown 与 HTML 快照重新提取英文索引。

下次更新需先核对上游变更，再翻译新增或修改的问题；不要仅替换上游数据或将未译文本充作中文。
