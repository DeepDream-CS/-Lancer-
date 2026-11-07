# Foundry VTT 内容包数据

`tools/build-lcp.js` 用这里的文件生成 Foundry VTT「LANCER」系统可导入的内容包，使用方法见 [Foundry 内容包](../../docs/FVTT-LCP.md)。

| 文件 | 作用 |
|---|---|
| `core/` | Foundry 系统使用的 @massif/lancer-data 3.1.7 快照，核心规则书内容包以它为底 |
| `official/<补充书>/` | Foundry 系统自带的官方补充书数据快照，只保留骨架、武器、系统、改装、核心奖励、天赋、驾驶员装备、标签与清单 |
| `official-map.json` | 车卡器扩展条目 id → 官方条目 id，手工维护（核心条目 id 与 lancer-data 相同，不需要映射） |
| `zh-overrides.json`、`zh-overrides-core.json` | 扩展包、核心包覆盖后仍是英文的文字的补译，手工维护 |
| `statuses-zh.json` | 核心包的状态与状况：Foundry 状态（按 icon）→ 车卡器术语库条目名，以及中文简述 |
| `module/` | 界面中文模组 lancer-cn 的源文件（语言文件译文、写死英文的词典与扫描快照、清单、脚本），见 [Foundry 内容包](../../docs/FVTT-LCP.md#界面中文模组lancer-cn) |

注意 `core/` 与 `source/lancer-data/` 不同：后者是车卡器自己使用的较旧副本，构建核心包时用来判断车卡器有意改过哪些数值。

## 官方数据快照

来自 npm 上 Massif Press 发布的数据包，许可为 GPL-3.0-or-later（见各目录 `package.json`）。版本与 foundryvtt-lancer v3.1.3 的 `package-lock.json` 一致：

| 目录 | 包 | 版本 |
|---|---|---|
| `core` | @massif/lancer-data | 3.1.7 |
| `official/dustgrave` | @massif/dustgrave-data | 1.4.0 |
| `official/ktb` | @massif/ktb-data | 1.2.4 |
| `official/long-rim` | @massif/long-rim-data | 1.2.2 |
| `official/osr` | @massif/osr-data | 1.2.0 |
| `official/ows` | @massif/ows-data | 1.0.1 |
| `official/sotw` | @massif/sotw-data | 1.0.2 |
| `official/ssmr` | @massif/ssmr-data | 1.7.0 |
| `official/wallflower` | @massif/wallflower-data | 2.1.0 |

快照不随日常构建更新。Foundry 系统升级并改动这些版本时，用 `npm pack @massif/<包>@<版本>` 取得新包，替换对应目录的 JSON 和 `package.json`，再运行构建与检查，查看核对表中的变化。

## 映射表

覆盖官方条目的规则：以官方记录为底，保留 Foundry 能自动化的动作、部署物、计数器和加值，换成车卡器的中文文本，以及车卡器的骨架数值、挂载点、武器伤害 / 射程 / 标签、SP。

- 骨架按名称对应；装备、天赋按骨架、牌照等级与类型逐条核对后写入。
- 新增映射后运行 `node tools/test-lcp.js`；目标 id 不存在或重复会报错。
- [核对表](../../docs/FVTT-LCP-AUDIT.md)列出每对条目的数值差异和结构不一致，配错的条目通常会在那里显出很大的差异。

## 补译

每次构建后仍为英文的文字列在 `dist/fvtt/zh-overrides.todo.json`（扩展包）与 `dist/fvtt/zh-overrides-core.todo.json`（核心包），多为官方动作、协同效果、弹药与数据组名称和核心系统风味文本。需要补译的条目复制到对应的 `zh-overrides.json` / `zh-overrides-core.json`，把英文换成中文；路径失效时构建会报错。

核心包的核心系统风味文本、协同效果等没有车卡器中文来源。补译属于自译，应与 `source/i18n/zh` 的译名保持一致。

待译清单保留原文 HTML，译文要保留同样的标签（列表、换行、加粗）和全部数字。`node tools/test-lcp.js` 会检查标签、数字，以及以下与车卡器用法不一致的写法：

| 不要写 | 应写 | | 不要写 | 应写 |
|---|---|---|---|---|
| 精准 | 准度（Accuracy） | | 闪避 | 回避（Evasion） |
| 重击 | 会心一击（Critical hit；「重击弹」除外） | | 生命值 | HP |
| 维修值 | 维修（Repair） | | 躲藏状态 | 匿迹状态（Hidden；躲藏是动作） |
| 闪烁空间 | 瞬空（Blinkspace） | | 干扰状态 | 受扰状态（Jammed） |

另外：护盾（Overshield，不写「超量护盾」）、超频（Overcharge）、受身（Brace）、伙伴/礼宾（COMP/CON，v3.5 译名）。天赋动作、弹药等名称若在车卡器的天赋等级说明里已有中文，以那里为准（例如决斗者的格挡 / 偏射 / 佯攻 / 绊脚）。

2026-11-07 第一批核心包补译（249 处）由 GPT 翻译，经核对后统一了上述术语、恢复了 26 处丢失的 HTML，并按车卡器说明改了 10 个名称。

同日第二批扩展包补译（253 处）同样由 GPT 翻译：统一术语 21 处，按车卡器说明改了约 20 个动作 / 部署物 / 计数器名称（如军备骰、熔渣喷射、钉刺榴弹、马术表演），阿特拉斯统一为「阿特拉斯蛾」；模块化先进战斗步枪的「DMR」保留用户资料原文。

骨架名要用车卡器的完整中文名（如「阿特拉斯蛾」而非「阿特拉斯」）。
