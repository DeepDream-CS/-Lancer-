# Lancer 简易车卡器：开发说明

纯前端、无依赖的《枪骑兵》（Lancer）中文车卡器。双击 `index.html` 即可使用；本地预览用 `node tools/serve.js`（`.claude/launch.json` 里的 `builder`，端口 8765）。角色存在 localStorage 的 `lancer-builder-v1`，战斗地图另存在 `lancer-battle-map-v1`。

## 协作约定

- **不要替用户提交或推送**。用户自己在 GitHub Desktop 里提交。
- 界面与文档用简体中文；术语以《枪骑兵》核心规则书 v3.5 为准（见 `TRANSLATION-V35.md`、`source/core-v35-overrides.json`），例如核心奖励、机甲技能、标准移动、超温危域、防护服、检定。核心骨架用 v3.5 译名（如 Monarch 为「金斑蝶」，不要和扩展骨架「帝王蝶」混淆）。
- 用户提供的扩展资料（PDF、截图）照原文转录。明显错字可以修正，但要告诉用户；原文缺失或看不清的内容不要自行补写，列出来请用户提供。
- 改动要能在浏览器里看到时，用预览实际检查，再汇报结果。检查用的临时角色用完要删除，并恢复改过的设置（如「无视牌照限制」）。
- 网页版由 GitHub Pages 提供，脚本缓存约 10 分钟；用户说推送后看不到更新时，先确认线上文件，再提示强制刷新。

## 文件结构

| 文件 | 作用 |
|---|---|
| `index.html` | 页面骨架；脚本顺序：`data.js → wizard.js → cardexport.js → rules.js → glossary.js → ui.js → faq-data.js → faq.js → frame-catalog.js → battlemap.js → app.js` |
| `data.js` | **生成文件，不要手改**。由 `tools/build-data.js` 生成 |
| `app.js` | 状态、存档、导入导出、各页面（驾驶员 / 等级成长 / 机甲 / 角色卡 / 战斗地图入口）、数值计算、渲染与事件 |
| `rules.js` | 车卡规则：天赋装备、加值、挂载点与超重型、受限、配装检查、旧存档迁移 |
| `wizard.js` | 引导式车卡步骤（`WIZ_STEPS`），复用 app.js 的各个面板 |
| `ui.js` | 纯界面状态：天赋/系统/骨架筛选、系统搜索（`systemSearchText`）、切换骨架确认、术语高亮与术语库、武器表 |
| `frame-catalog.js` / `.css` | 骨架目录：浏览、预览后再确认使用 |
| `faq.js` / `faq.css`、`faq-data.js` | 规则 FAQ 面板；`faq-data.js` 由 `tools/build-faq.js` 生成 |
| `battlemap.js` / `.css` | GM 本机六角格战斗地图，存档与角色独立 |
| `glossary.js` | 手写术语（`GLOSSARY_SRC`）；标签说明与扩展规则在运行时并入 |
| `cardexport.js` | 角色卡图片（canvas）与文字卡 |
| `style.css` | 主样式 |
| `source/lancer-data/` | COMP/CON 开源数值数据（核心规则书） |
| `source/cn/`、`source/tw/` | 规则站简体 / 繁体原文 |
| `source/i18n/{en,zh}/` | 自译：键为 `id.字段路径`，英文相同的条目共用译文 |
| `source/core-v35-overrides.json` | v3.5 译名与术语覆盖层 |
| `source/expansions/all-expansions.js` | 扩展内容（PDF 与截图转录，原文即中文） |
| `source/expansions/professional-licenses.js` | 专业牌照（见 `PROFESSIONAL-LICENSES.md`） |
| `source/faq/` | FAQ 英文快照、中文译文与许可（见该目录 README） |

注意：`ui.js` 在 `app.js` 之前载入，`esc`、`plain`、`T`、`tagText` 等此时还不存在；ui.js 里用到它们的初始化要延后到首次调用（参照 `getGlossary()` 的写法）。`app.js` 里读档时就会用到的函数要写成函数声明（例如 `licenseFrames`、`talentBudget`），不能用 `const`。

## 数据流水线（`node tools/build-data.js`）

1. 读 lancer-data 数值 + 规则站中文 + `source/i18n/zh` 自译，组成 `data`（中文名放在 `data.zh` 各表或条目的 `zh_name`）。
2. `calibrate-text.js` 统一术语 → `core-v35.js` 套用 v3.5 译名覆盖。
3. `mergeExpansion()` 并入扩展与专业牌照：只套用 calibrate-text 和 v3.5 **术语表**，不做旧译名替换（那一步会把「内建武器」「百臂巨人」这类普通词误换成核心条目的新译名）。
4. 输出 `data.js`。

## 扩展内容约定

- 每个条目自动带 `ext: true` 和 `pack`，界面显示金色「扩展」标签。
- 新厂商：在 all-expansions.js 用 `manufacturers.push({ id, name, color, description })`，构建时并入 `D.manufacturers` 和 `zh.makers`，厂商筛选、牌照列表、核心奖励分组会自动出现。核心奖励用 `core_bonuses.push`，`source` 填厂商 id；资格按该厂商牌照合计 3 级 / 个计算。
- 变体骨架：`variant_of` 指向标准骨架 id；沿用标准骨架牌照（牌照 II 可用），不出现在牌照列表，构建时排在标准骨架之后。`source` 用标准骨架的厂商，实际制造商写在 `maker_note`。
- 新授权骨架：装备的 `license` 填骨架的 `name`（查找名），`license_level` 1–3；骨架本身牌照 II 解锁。
- 骨架内建武器不写 `source`（因此不会出现在可选列表），在核心系统写 `integrated: [id]`。多模式武器（多枪头、两种形态）用 `profiles`，每项含 name / damage / range / tags / effect。
- 天赋装备用 `talent_item`、`talent_id`、`talent_rank`，并在天赋等级里写 `special_equipment`。天赋等级上的 `bonuses`（如 `deployable_hp`）会保留到 data.js 并计入数值。
- 武器改装放在 `mods`，用 `allowed_types` / `allowed_sizes` 限制；`stack_tags: true` 表示同名数值标签相加（如击退 +1）。
- 新规则术语（变体骨架、高效、无形等）写在 `rules`，会出现在术语库和相关骨架的「扩展规则说明」。
- 特殊机制需要代码支持时，在骨架或核心奖励上加字段并在 app.js / rules.js 处理。现有例子：`no_grit_hp`、`cb_ext_superheavy_mounting`、`cb_kkca_private_tutor`（`talentBudget`）、`cb_kkca_signature_move`（机甲字段 `signature`，`signatureDiscount`）。需要指定对象的核心奖励在 `loadoutChecks` 里加未指定的报错。
- 新增内容后更新 `tools/test-rules.js` 里扩展条目数量的断言，并为新机制加检查；id 不能和已有条目重复（有专门检查）。

## 术语高亮

- `highlightTerms()` 在每次渲染后扫描 `#app` 的文字节点；名称、标题、按钮、选单等不标记（`TERM_SKIP`）。
- 多义词要写 `re`（上下文正则），只在规则意义下标记，例如「强化」只认「强化一个盟友 / 或锁定」；字面意义常见的标签列在 `GLOSSARY_STRICT_TAGS`。
- 个别短语要排除时加 `{ t: "短语", stop: true }`：匹配但不标记，长匹配优先（例：卫戍长矛的「锁定该武器」）。
- 改动术语后运行 `node tools/glossary-audit.js [术语] [条数]`，逐条看命中的上下文有没有误标；误标案例加进 test-rules 的术语测试。

## 测试与检查

```bash
node tools/build-data.js            # 重新生成 data.js
node tools/test-rules.js            # 车卡规则、扩展、核心奖励、筛选与搜索、术语、武器表回归检查
node tools/test-v35.js              # 核心数据的译名、数值结构与稳定 ID（会先剔除扩展条目）
node tools/test-expansion-copy.js   # 扩展文案校正与牌照引用
node tools/test-mod-display.js      # 武器改装显示
node tools/test-faq.js              # 规则 FAQ
node tools/i18n-missing.js          # 自译缺项
```

- test-v35 用数值结构摘要锁住核心数据；扩展内容和新增的顶层字段（如 `ext_rules`、`professional_licenses`）要在 `stripExt()` 里剔除，不要改基线。
- 测试在 vm 里跑全部脚本，没有真实 DOM；会碰 DOM 的函数要先判断（如 `enhanceUI` 检查 `app.querySelector`）。测试代码里的变量名不要和全局名（`m`、`a` 等）冲突。 battlemap.js 也在测试里载入（`BattleMap.footprint` 有占格检查）；faq.js 不载入。
- 机甲 SP、豁免目标等会加上毅力，测试数值时用不受毅力影响的项（如感应、热度上限）。

## 编辑注意

- 含反斜杠的正则、含引号的多行文字，不要经 bash heredoc 或 `node -e` 写入：转义会丢失或被 shell 打断。用编辑工具改，或先把脚本写到临时文件再执行。
- 仓库文件可能是 CRLF / 缩进不一（用户在 GitHub Desktop 提交时会转换）；字符串替换前先看清原文。
- all-expansions.js 可能同时被其他会话修改；编辑前后注意「文件已在磁盘上变更」的提示，构建后核对条目数量是否只多了自己加的部分。
