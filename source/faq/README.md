# LANCER 规则 FAQ 与勘误：中文译本

[项目说明](../../README.md) · [文档目录](../../docs/README.md) · [FAQ 使用说明](../../docs/FAQ-TRANSLATION.md)

维护说明更新：2026-11-04；此日期不表示上游快照已更新。命令从项目根目录执行。

本目录保留 aritsune/lancer-faq 的英文源文、中文逐条译文、贡献者名单及 GPL-3.0 许可。中文改编日期：2026-10-25。译文与原文一并提供，保持原项目许可；见 [LICENSE](LICENSE)。

- 原站：[LANCER Rules FAQ & Errata](https://lancer-faq.netlify.app/)
- 上游：[aritsune/lancer-faq](https://github.com/aritsune/lancer-faq)
- 固定版本：3e5fd612a2308fe28f1f937620d1efd2f4bcf5ae
- 184 条问答，113 个目录项（其中 NPC 通用规则、NPC 职业为分组标题）。
- 问题与章节 ID 沿用上游标题的 HMAC-SHA512 前六位，已与下载的在线页面逐项核对。
- 页码均沿用原站对应英文出版物的页码，不是中文核心规则书 PDF 物理页码。
- 该站是社区整理的 FAQ 与勘误。原文有 `<wot:...>` 标记的条目，在界面标为“Tom 裁定”，保留全部 Discord 来源。没有标记的条目不会被自动标为官方裁定。
- 保留原文的肯定、否定、例外、条件、推测和未来修订措辞；不把 FAQ 的修订静默写入车卡器规则数据。
- 中文名尽量沿用本车卡器与核心规则书 v3.5；尚未收录的专名附英文供核对。扩展书名为中文检索用名，并保留英文标题。

## 文件与构建

`upstream.md`、`upstream.json` 为英文快照；`zh-01.json` 至 `zh-03.json` 按稳定 ID 保存完整问答译文；`sections-zh.json` 保存完整章节译名。`contributors.txt`、`LICENSE` 来自上游。

运行 `node tools/build-faq.js` 生成 `assets/js/faq-data.js`，无需联网、无需安装依赖。运行 `node tools/test-faq.js` 检查覆盖率、链接、搜索与渲染。`tools/prepare-faq.js` 用于从保留的 Markdown 与 HTML 快照重新提取英文索引。

下次更新需先核对上游变更，再翻译新增或修改的问题；不要仅替换上游数据或将未译文本充作中文。


## 原文与项目说明的边界

`upstream.md` 是用于重建索引的第三方英文原文快照，本轮项目文档整理不改写其内容、上游相对资源引用或版权信息。原站排版和资源应在上游站点查看；本项目网页使用生成的本地数据展示问答，不直接渲染这份 Markdown。

文档位置调整不改变稳定问答 ID 和 `assets/js/faq-data.js` 的位置。提交 FAQ 更新时，应同时检查源快照、中文译文、生成结果及许可；不能只更新页面说明后声称已同步上游。
