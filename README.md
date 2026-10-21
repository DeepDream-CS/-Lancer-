# Lancer 简易车卡器

直接双击 `index.html` 用浏览器打开即可，无需安装。也可以 `node tools/serve.js` 后访问 http://localhost:8765 。

2026-10-21 规则与译文校准记录见 [VALIDATION.md](VALIDATION.md)，界面改进见 [UI-UX.md](UI-UX.md)。运行 `node tools/test-rules.js` 可执行 31 项回归检查。图片角色卡为固定版式摘要，完整配置请保留 JSON。

- 第一次打开或点「新建」时，可以选择：
  - **引导式车卡**：按规则书顺序一步步完成（起始等级 → 资料 → 背景 → 触发 → 机甲技能 → 天赋 → 牌照 → 核心奖励 → 驾驶员装备 → 骨架 → 武器与系统 → 总检查），每步附规则讲解，并实时检查点数。LL0 会自动跳过牌照和核心奖励。中途关掉网页，下次会回到原来的步骤。
  - **自定义车卡**：直接打开完整编辑器。
  - 已有角色也可以点顶部「引导模式」重新走一遍流程。
- 导入 / 导出：顶部「导入」、新建弹窗里的「导入已有角色」，或直接把 JSON 文件拖进页面，都能导入角色后接着修改；可以是单个角色、角色数组，或「导出全部角色备份」的文件。导入时会补齐缺的字段，找不到的天赋、装备等会略过并列出来。
- 角色自动保存在浏览器本地（localStorage）；换电脑/换浏览器请在「角色卡 / 导出」页导出 JSON 再导入。
- 「无视牌照限制」开关：给 GM 规划或特殊规则时用，所有骨架、装备、核心奖励都可选。

## 数据来源
- 数值：`source/lancer-data/`，来自 COMP/CON 开源数据 [massif-press/lancer-data](https://github.com/massif-press/lancer-data)（核心规则书内容）。
- 中文（规则站）：`source/tw/` 为 [Lancer 免费版繁中规则站](https://reno-lam.github.io/Lancer-Free-Version/) 原文，`source/cn/` 为其简体版（天赋、核心奖励、背景、触发、标签、驾驶员装备、GMS 装备）。
- 中文（自译）：规则站没有的部分——授权厂商骨架的介绍/特性/核心系统、全部武器与系统效果、动作、无人机与地雷等可展开物、武器改装、标签说明——放在 `source/i18n/zh/`，术语尽量与规则站一致。

## 改数据 / 改翻译
- `node tools/extract-en.js`：从 lancer-data 抽出界面会显示的英文到 `source/i18n/en/`。
- `node tools/i18n-missing.js [文件名] [条数]`：列出还没翻译的条目（英文相同的条目共用译文）。
- 直接编辑 `source/i18n/zh/*.json` 修改译文。
- 最后运行 `node tools/build-data.js` 重新生成 `data.js`。

## 核心规则书 v3.5 译名修订

见 [修订对照表](TRANSLATION-V35.md)。最终译名由 `source/core-v35-overrides.json` 覆盖，修改这些译名请编辑该文件；构建后运行 `node tools/test-v35.js` 和 `node tools/test-rules.js`。
