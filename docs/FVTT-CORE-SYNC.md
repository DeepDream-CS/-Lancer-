# Foundry VTT 核心规则书与扩展同步任务单（供 FVTT 窗口并行处理）

> **并行分工约定（避免双窗口文件冲突）**
> - **车卡器窗口**只修改：`source/i18n/zh/*`、`source/cn/*`、`source/lancer-data/*`、`source/core-v35-overrides.json`、`source/core-v35-numeric-baseline.json`、`tools/build-data.js`、`tools/calibrate-text.js`、`tools/core-v35.js`、`tools/test-rules.js`、`tools/test-v35.js`、`tools/test-core-corrections.js`、`assets/js/*`（生成 `assets/js/data.js`）。
> - **FVTT 窗口（本文件执行方）**只修改：`source/fvtt/*`（含 `zh-overrides-core.json`、`statuses-zh.json`、`ext-actions.json`、`ext-deployables.json`、`module/*`）、`tools/build-lcp.js`、`tools/build-fvtt-module.js`、`tools/test-lcp.js`、`tools/test-fvtt-module.js`、`dist/fvtt/*`、`docs/FVTT-*.md`。
> - 两个窗口修改的文件集合**完全不相交**，可直接同时开工：FVTT 窗口先修下方 **第一部分（立即独立可改项）** 与 **第二部分（模组自动化核查）**；待车卡器窗口完成 `node tools/build-data.js` 更新 `assets/js/data.js` 与 `assets/js/glossary.js` 后，FVTT 窗口再执行 **第三部分（一键重编 LCP 并校验）**。

---

## 第一部分：FVTT 专属文件错误（现在即可直接修改，不依赖车卡器重编）

### 1. `source/fvtt/zh-overrides-core.json` 实质规则错漏与译名偏差

以下问题位于 FVTT 专属补译文件 `source/fvtt/zh-overrides-core.json` 中，车卡器数据不会覆盖它们，须在 `zh-overrides-core.json` 中直接修正：

1. **`t_ace` 王牌 III · `ranks[2].actions[1].init`（第 297 行）—— 误把目标限制为「友方角色」**
   - **英文原文**：`"...you may nominate a character within a Range equal to your Speed and within line of sight..."`
   - **当前错误文本**：`"需要先启用<b>启动推进器</b>快速动作，并指定一名友方角色为目标。"`
   - **修正**：去掉「友方」，改为 `"需要先启用<b>启动推进器</b>快速动作，并指定一名视线范围内、距离不超过你速度的角色为目标。"`（超音速主要用来追击敌方角色或跟随友军，限死友方会废掉追击用法）。

2. **`mf_tokugawa` 德川 · `core_system.active_synergies[0].detail`（第 115 行）—— 近战威胁加值写错为 `+1`（应为 `+2`）**
   - **英文核心规则书正文（`active_effect`）**：`"weapons that deal any energy gain +5 range if they are ranged or +2 threat if they are melee."`（上游 `lancer-data` 的 `synergies` 残留了 `+1` 笔误）
   - **当前错误文本**：`"你的机甲上所有造成任何能量伤害的武器，若为远程武器则获得+5射程，若为近战武器则获得+1威胁。"`
   - **修正**：将 `+1威胁` 改为 **`+2威胁`**（启动辉光后本身 +2 威胁，暴露时与界限突破 +1 叠加共 +3 威胁）。

3. **`mf_saladin` 萨拉丁 · `core_system.active_actions[0].init`（第 105 行）—— 误写为「视线范围内的一台友方机甲」**
   - **英文正式规则（`active_effect`）**：`"This system projects an accelerated-tachyon shield over an allied character within Sensors."`
   - **当前文本**：`"此系统在视线范围内的一台友方机甲上方投射一面加速迅子护盾。"`
   - **修正**：改为 `"此系统在感应范围内的一名友方角色身上投射一面加速迅子护盾。"`（感应范围而非视线，且可对友方非机甲角色使用）。

4. **`pg_thermite_charge` 铝热炸弹 · `deployables[0].actions[0].detail`（第 470 行）—— 误把装备名译成模块名「高热炸药」**
   - **英文原文**：`"Affected characters must succeed on an Engineering save or take 3 Energy AP. Thermal charges automatically hit objects, dealing 10 Energy AP."`（英文原书笔误把 `Thermite charges` 印成 `Thermal charges`）
   - **当前文本**：`"...高热炸药自动命中物件，造成10点穿甲能量伤害。"`（「高热炸药」是纳尔逊近战模块 `wm_thermal_charge` 的 v3.5 专名）
   - **修正**：改为 `"铝热炸弹自动命中物件，造成10点穿甲能量伤害。"`

5. **`zh-overrides-core.json` 内的 v3.5 术语统一（建议一并校准）**：
   - 第 153 行 `ms_sekhmet_class_nhp`：`塞赫美特协定` → `塞赫麦特协定`；`超频` → **`超限`**（Overcharge）。
   - 第 214、223、238 行 `ms_walking_armory_1/2/3`：`曲射` → **`抛射`**（与 `tg_arcing` 标签名一致）。
   - 第 316–319 行 `t_crack_shot`：`稳定瞄准`（动作名与协同说明）需注意与 v3.5 等级 I 名称 `保持稳定` 对应（动作可写 `保持稳定（稳定瞄准）` 或与 `lancer-cn` 模组触发器名称保持一致，**改前请核对 `lancer-cn.mjs` 是否按动作名匹配神枪手！**）。
   - 第 368、370 行 `t_grease_monkey`：`限量武器和系统` → **`受限武器和系统`**；`维修容量上限` → **`维修上限`**。
   - 第 194、289、327、425、450 行：`软掩体 / 硬掩体` → **`软性掩护 / 硬性掩护`**。
   - 第 445–446 行 `t_technophile`：`崩溃` → **`层流`**（Cascade）。

---

### 2. `tools/build-lcp.js` 构建逻辑改进点

1. **`overlayText` 对对象型 `on_hit` / `on_crit` / `on_attack` 的兼容（`tools/build-lcp.js:473`）**：
   - 当前代码：`for (const f of TEXT_FIELDS) if (typeof src[f] === "string" && CJK.test(src[f])) dst[f] = html(src[f]);`
   - 当 `src[f]` 为 `{ detail: "..." }` 对象（如 8 件核心武器）时会被跳过，目前仅靠 `zh-overrides-core.json` 手工兜底。建议兼容 `const val = typeof src[f] === "string" ? src[f] : src[f]?.detail;`（仅当 `typeof dst[f] === "string"` 时写入），防止后续遗漏。
2. **`wm_shock_wreath` / 单对象 `actions` 兼容（`tools/build-lcp.js:476`）**：
   - `const b = Array.isArray(src[arr]) ? src[arr] : src[arr] ? [src[arr]] : [];`（车卡器侧也会把 `wm_shock_wreath` 修成数组，两边同时加固更稳妥）。
3. **无参数标签 `{VAL}` 清理检查**：
   - 核心包导出 `tags.json` 时，`tg_accurate`、`tg_inaccurate`、`tg_overkill` 在上游无参数（车卡器侧会在 `source/i18n/zh/misc.json` 移除这三个标签里的 `{VAL}`；FVTT 窗口可在 `test-lcp.js` 加一条断言确保这三个标签的 `name` 和 `description` 不残留 `{VAL}`）。

---

## 第二部分：`lancer-cn` 模组（`source/fvtt/module/`）核心规则与专业牌照自动化核查清单

请检查 `source/fvtt/module/lancer-cn.mjs`（及相关脚本/词典）中是否有写死以下规则逻辑或正则匹配，如有请同步修正并递增 `module.json` 版本号：

### A. 核心规则书勘误关联项
1. **状态「受扰（Jammed）」与「伏卧（Prone）」说明**：
   - 核心包 `statuses.json` 的中文说明由 `build-lcp.js` 从车卡器 `assets/js/glossary.js` 提取（车卡器修正后重编核心包即可更新），但若 `lancer-cn.mjs` 内部写死了受扰提示或自动化拦截：请确认受扰拦截的是**「进行或受益于科技动作」**，而非拦截「受益于反应」；伏卧包含**「移动视为困难地形（每格 2 移动力）」**及**「起身不触发守望」**。
2. **天赋「潜行者 II（埋伏 Ambush）」**：
   - 若模组有自动触发豁免提示，必须仅在 **匿迹状态下本回合第一次任意类型攻击掷骰「命中时（on a hit）」** 触发机体豁免（未命中不触发），且效果为「缓慢 + 受损 + 无法反应」，**不施加伏卧（Prone）**。
3. **天赋「重炮手 I & III（掩护火力 / 夹叉火力）」**：
   - Rank I 反应射击结算后，对该目标的掩护火力效果结束；Rank III 是「**某一目标对你造成伤害**时，仅结束对该目标的掩护火力」（而非你对该目标造成伤害时结束）。
4. **天赋「领袖 II（公开频道）」**：
   - 反应发领导骰的触发时机仅限 **其他玩家（PC）回合开始时**，不包含敌方 NPC 回合开始。
5. **天赋「兴风者 III（洪流 / 大规模攻击）」**：
   - 敏捷豁免失败施加的 `晕眩（Stunned）` 持续时间为 **直到目标下一回合结束**（豁免成功伤害减半、仍伏卧但不晕眩）。
6. **天赋「骇客 I & II」**：
   - Rank I 雪崩位移为 **推动 3 格（Push，强制位移）**；Rank II `骇./杀` 在目标 **关机（Shut Down）** 时同样解除。
7. **武器「迅子长枪（`mw_tachyon_lance`）」**：
   - 超温危域攻击时的锥形 3 等离子后焰（4 燃烧 + 2 热度，工程豁免）**没有每轮 1 次限制**（每次用迅子长枪在超温危域开火都会触发）。
8. **武器「湮灭巢房（`mw_annihilation_nexus`）」**：
   - 若模组支持选择无人机作为爆发 2 中心，必须限制为 **攻击者自己控制的无人机（your Drones）**，不能选敌方或队友无人机。
9. **核心奖励「布里阿柔斯骨架深化改造（`cb_briareos_frame`）」**：
   - 全伤害抗性的触发条件为 **结构值 `<= 1`（包含 1 结构与 0 结构状态）**，不能写成 `structure === 1` 导致 0 结构时失去抗性。
10. **核心奖励「全战区移动套装（`cb_all_theater_movement_suite`）」**：
    - 允许将 **任意移动** 视为飞行（不限于标准移动与推进）。
11. **天赋「神枪手（`t_crack_shot`）」名称匹配提醒**：
    - 车卡器修复 `core-v35.js` 后，`D.zh.talents["Crack Shot"]` 正文中的错词 `保持稳定瞄准具校正` 会恢复为 `稳定瞄准`（等级标题仍为 I `保持稳定`、II `瞄准具校正`、III `看招`）。若 `lancer-cn.mjs` 此前为兼容错词写了正则，请保留兼容或同步为 `稳定瞄准 | 保持稳定`。

### B. 上一轮「苏丹专业牌照（Field Guide to Suldan）」修正同步项
车卡器已在 `source/expansions/professional-licenses.js` 完成苏丹专业牌照原文校准。若 `lancer-cn.mjs` 对以下专业牌照装备写有专属自动化，请核对：
1. **`mw_pl_buckler` 弹道臂盾（IPS-N 先遣兵 I）**：
   - 收起形态：仅获得反应「举盾」（1/轮，受到远程或近战攻击时对该次攻击获得伤害抗性，**不是常驻全抗性**）；展开形态（快速动作切换，期间缓慢且该臂盾不能攻击）：对正前方锥形方向攻击获得抗性，且**仅在展开形态下**用臂盾会心一击才击倒目标伏卧。
2. **`mw_pl_valkyrie` 女武神翼装系统（SSC 冲击骑兵 III）**：
   - 近战攻击检定：**未飞行时受 `+1 难度`**；**正在飞行或处于目标更高高度时获 `+1 准度`**（此前车卡器旧文案写反了），且装备期间免疫坠落伤害。
3. **`ms_pl_sentry_drone` 哨兵无人机（GMS 自动化作战专家 II）**：
   - 可挂载已装备的非内置、非超重型 **CQB、步枪或大炮（Cannon）**，且该武器保留原有模块与**核心奖励**加成。
4. **`ms_pl_active_defense` 主动防御系统（HA 攻城专家 II）**：
   - 安装消耗由 `3 SP` 修正为 **`2 SP`**。
5. **`mw_pl_modular_rifle` 模块化步枪（GMS 特种部队 II）**：
   - 「突击队员」打印数据：除威胁 3 外，**使用该武器进行反应攻击（如守望）时获得 `+1 准度`**。
6. **`wm_pl_optimized` 优化改装（GMS 军备专家 I）**：
   - 补齐 **`tg_unique`（独特）** 标签。

---

## 第三部分：待车卡器窗口重编 `assets/js/data.js` 后的 LCP 同步步骤

当车卡器窗口完成核心规则书修正并重新生成 `assets/js/data.js` 与 `assets/js/glossary.js` 后，FVTT 窗口按顺序执行：

```bash
node tools/build-lcp.js
node tools/test-lcp.js
node tools/build-fvtt-module.js
node tools/test-fvtt-module.js
```

并核对以下输出：
1. **递增版本号**：
   - `tools/build-lcp.js` 中 `PACKS.core`（核心规则书包）与 `PACKS.ext`（扩展包，含专业牌照修订）版本号各 +1。
   - 若修改了 `source/fvtt/module/`，递增 `source/fvtt/module/module.json` 版本号，并在 `source/fvtt/module/README.md` 与 `docs/FVTT-LCP.md` 的更新记录中添加说明。
2. **检查自动生成的核对表**：
   - 查看 `docs/FVTT-LCP-CORE-AUDIT.md` 与 `docs/FVTT-LCP-AUDIT.md`：确认「覆盖后仍为英文的文字」仍为 **无**（若车卡器按 3.1.7 调整了 `ms_caltrop_launcher`、`ms_h0r_os_system_upgrade_ii`、`ms_javelin_rockets`、`ms_clamp_bombs`、`ms_reinforced_cabling`、`mw_tachyon_lance` 等结构导致新增英文待译路径，按提示补入 `source/fvtt/zh-overrides-core.json` 后重跑 `build-lcp.js`）。
3. **验证状态与标签导出**：
   - 确认 `dist/fvtt/lancer-cn-core.lcp` 内 `statuses.json` 的 `jammed`（受扰）与 `prone`（伏卧）已更新为修正后的术语库文本，`tags.json` 的 `tg_deployable`、`tg_overkill`、`tg_accurate`、`tg_inaccurate` 无 `{VAL}` 残留或错误倍率。
