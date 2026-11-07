# Foundry LCP 导出核对表：核心规则书

由 `node tools/build-lcp.js` 生成，请勿手改。

内容包：枪骑兵简易车卡器：核心规则书（中文） 1.0.0

| 类别 | 条目数 |
|---|---|
| frames | 29 |
| weapons | 85 |
| systems | 124 |
| mods | 8 |
| core_bonuses | 30 |
| talents | 29 |
| pilot_gear | 37 |
| skills | 22 |
| tags | 67 |
| statuses | 15 |

- 覆盖官方条目：424
- 新增条目：7
- 写入的车卡器说明：10 条
- 补译：249 处

官方数据版本：@massif/lancer-data 3.1.7

## 数值差异（以车卡器为准）

只采用车卡器有意改过的数值（data.js 与车卡器的 lancer-data 副本不同，例如 v3.5 修正），其余沿用 Foundry 的 lancer-data。

无。

## 结构不一致

官方与车卡器的动作、部署物等数量不同时保留官方结构，对应文字仍是英文。

- ms_sekhmet_class_nhp → ms_sekhmet_class_nhp 的 actions：官方 1 项，车卡器 2 项，保留官方结构（英文）
- ms_retractable_profile → ms_retractable_profile 的 actions：官方 1 项，车卡器 2 项，保留官方结构（英文）
- ms_lb_oc_cloaking_field → ms_lb_oc_cloaking_field 的 actions：官方 1 项，车卡器 2 项，保留官方结构（英文）
- pg_thermite_charge → pg_thermite_charge deployables[0] 的 actions：官方 1 项，车卡器 2 项，保留官方结构（英文）

## 覆盖后仍为英文的文字

补译方法：把 `dist/fvtt/zh-overrides-core.todo.json` 中需要的条目复制到 `source/fvtt/zh-overrides-core.json`，把英文换成中文后重新运行构建。

无。

## 自动修正

无。

## lancer-data中未覆盖的条目（导入后仍为英文）

| 类别 | 官方 id | 名称 | 来源 |
|---|---|---|---|
| — | — | 无 | — |
