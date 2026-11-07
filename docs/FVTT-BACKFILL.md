# 车卡器补译来源

`source/i18n/{en,zh}/fvtt-backfill.json` 保存从 FVTT 核心模组回填的137处文本，随 `tools/build-data.js` 构建。版本差异以 `source/fvtt/core/` 官方快照为准；不以车卡器旧文案覆盖官方规则。

- 兵工厂特制底盘：官方 `synergies[1]` 与车卡器 `synergies[0]` 都对应过载效果，按语义映射，不按数组下标硬覆盖工程提示。
- 德川：官方 `core_system.active_synergies[0].detail` 写近战威胁+1，而同条目 `active_effect` 和 `active_bonuses` 写+2。回填提示照官方+1；主效果与数值保留官方+2，不自行消除上游矛盾。
- 主宰：保留车卡器完整的HTML结束标签；官方快照的同段末尾缺少`>`，不将残缺标记带入网页。
- 36处已有中文和76处车卡器不存在的字段未在本次回填中覆盖。
