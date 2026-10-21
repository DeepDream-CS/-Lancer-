# 核心规则书 v3.5 中文修订（2026-10-21）

依据用户提供的《枪骑兵》核心规则书v3.5.pdf（408页）。以下页码均为 PDF 物理页码，从封面起算。此次是车卡相关译名及共用术语修订，不是对408页全文的重新翻译或逐句校对。

## 已落实

- 220项名称覆盖；29项天赋名称及87个等级标题；29种骨架的特征、核心系统与相关动作标题。
- 界面、引导、规则检查、文本与图片导出采用相同术语。英文查找名、内部ID和存档格式保留。
- 原始规则站及自译文件保留；最终生成数据应用带页码的覆盖层，后续重新构建不会丢失修订。
- 不打包或复制原PDF。仅保存修订所需的译名与页码。

## 编辑取舍

- 埃弗勒斯采用第115页标题；第116页正文的“埃佛勒斯”统一修正。
- 第132页“切割Mk2”与“切割者”并存，采用装备标题“‘切割者’Mk2等离子炬”。
- Tracking Bug第159页牌照索引称“追踪窃听器”，条目标题称“追踪漏洞”，采用后者。
- StunCrown第164页牌照索引称“眩晕冠冕”，条目标题称“晕眩冠冕”，采用后者。
- 第153页“偏转立场”按词义纠正为“偏转力场”；保留这一编辑纠错，不照搬明显错字。
- 繁体残字统一简体，例如“完美鎖定”“滾筒”；原型武器和弹药库保留I/II/III区分以便配装。
- Line统一使用第98页标签定义“线形”；描述方向的“直线”保留。Blast为“溅射”，Explosive伤害仍为“爆炸”。
- 没有依据译名改动伤害、SP、牌照门槛等数值。说明正文保留原有译文，并更新本轮核定术语；不宣称所有叙事段落均已逐句对齐PDF。

## 验证

- node tools/test-rules.js：31项车卡回归检查通过，涵盖所有骨架、天赋和装备渲染、配装约束、旧存档迁移及导出相关逻辑。
- node tools/test-v35.js：475项译名及字段断言通过，另核对数值/布尔值/空值/数据结构摘要、全部稳定ID和英文查找名，以及旧通用术语残留。
- node tools/i18n-missing.js：9个翻译文件缺项均为0；该检查代表字段覆盖，不代表全文翻译质量保证。
- 浏览器预览核对了背景、触发、防护服和修订来源显示。

## 通用术语

|原文案|修订|PDF页|
|---|---|---|
|核心加成|核心奖励|32|
|免费动作|自由动作|58|
|普通移动|标准移动|59|
|机甲能力|机甲技能|17|
|危险区|超温危域|99|
|卫士服|防护服|103|
|肉搏武器|近战武器|98|
|肉搏攻击|近战攻击|61|
|远距武器|远程武器|98|
|远距攻击|远程攻击|61|
|攻击判定|攻击掷骰|61|
|判定|检定|12|
|直线{VAL}|线形{VAL}|98|
|爆炸{VAL}|溅射{VAL}|98|

## 名称对照

|英文名称|原译名（已记录项）|采用译名|PDF页|
|---|---|---|---|
|Everest|埃佛勒斯|埃弗勒斯|115|
|Black Witch|黑巫|黑巫蛾|153|
|Death’s Head|骷髅天蛾|鬼面蛾|157|
|Dusk Wing|暮翼|珠弄蝶|161|
|Monarch|帝王蝶|金斑蝶|169|
|Mourning Cloak|黄缘蛱蝶|黄蛱蝶|173|
|Balor|巴罗尔|炎魔|185|
|Hydra|九头蛇|多头蛇|199|
|Minotaur|米诺陶洛斯|牛头怪|207|
|Pegasus|飞马|天马|211|
|Genghis|成吉思汗|成吉思|223|
|Auto-Stabilizing Hardpoints|自动稳定挂载点|自稳定承力点|111|
|Overpower Caliber|过强弹药|超功率口径|111|
|Improved Armament|强化装备|改良武装|111|
|Integrated Weapon|内建武器|武器一体化|111|
|Mount Retrofitting|改造挂载点|挂载点改装|111|
|Universal Compatibility|寰宇兼容|寰宇兼容|111|
|Briareos Frame|百臂巨人骨架|布里阿柔斯骨架深化改造|120|
|Fomorian Frame|弗摩尔骨架|弗莫尔骨架深化改造|120|
|Gyges Frame|盖吉兹骨架|裘格斯改良武装|120|
|Reinforced Frame|强化骨架|强化骨架|120|
|Sloped Plating|倾斜装甲|倾斜电镀层|120|
|Titanomachy Mesh|泰坦战网|泰坦之战格网|120|
|All-Theater Movement Suite|全地形移动套装|全战区移动套装|151|
|Full Subjectivity Sync|全主观性同步|完全主观性同步|151|
|Ghostweave|鬼影绣|鬼影织物|151|
|Integrated Nerveweave|整合神经系统|整合神经编织|151|
|Kai Bioplating|快式生物装甲|凯氏生物镀层|151|
|Neurolink Targeting|神经连接锁定|神经连接锁定|151|
|The Lesson of Disbelief|不信之课|不信之训|184|
|The Lesson of the Open Door|开门之课|开门之训|184|
|The Lesson of the Held Image|固像之课|固像之训|184|
|The Lesson of Thinking-Tomorrow’s-Thought|明想之课|先见之训|184|
|The Lesson of Transubstantiation|变体之课|体变之训|184|
|The Lesson of Shaping|陶冶之课|陶冶之训|184|
|Adaptive Reactor|适应性反应炉|适应性反应炉|218|
|Armory-Sculpted Chassis|兵工厂特制支架|兵工厂特制底盘|218|
|Heatfall Coolant System|热落冷却系统|热落冷却系统|218|
|Integrated Ammo Feeds|内建给弹器|内建弹药供给|218|
|Superior by Design|优越始于设计|优越始于设计|218|
|Stasis Shielding|静滞护盾|静滞护盾|218|
|Anti-Materiel Rifle|反物资步枪|反器材步枪|112|
|Cyclone Pulse Rifle|台风脉冲步枪|气旋脉冲步枪|112|
|Heavy Machine Gun|重机枪|重型机枪|112|
|Heavy Melee Weapon|重肉搏武器|重型近战武器|112|
|Missile Rack|飞弹发射架|导弹发射架|112|
|Segment Knife|多节刀|多段刀|112|
|Shotgun|散弹枪|霰弹枪|112|
|Tactical Melee Weapon|战术肉搏武器|战术近战武器|112|
|Thermal Lance|高热长枪|热能长枪|112|
|Thermal Pistol|高热手枪|热能手枪|112|
|Thermal Rifle|高热步枪|热能步枪|112|
|COMP/CON-Class Assistant Unit|COMP/CON级辅助单位|伙伴/礼宾级辅助单元|113|
|Custom Paint Job|个人涂装|定制涂装作业|113|
|Manipulators|微型操纵器|操纵器|113|
|Pattern-A Jericho Deployable Cover|A型耶利哥展开掩体|A型耶利哥可展开掩体|113|
|Pattern-B HEX Charges|B型毒咒炸弹|B型毒咒弹|113|
|Turret Drones|无人炮塔|炮塔无人机|114|
|Type-3 Projected Shield|三式投射护盾|三式护盾|114|
|EVA Module|EVA模组|EVA模块|114|
|Rapid Burst Jump Jet System|快速喷射跳跃系统|快速猛跃喷射系统|114|
|Type-I Flight System|第一类飞行系统|一式飞行系统|114|
|Chain Axe|链锯斧|链斧|123|
|Bristlecrown Flechette Launcher|刺冠箭弹发射器|刺鬃冠镖弹发射器|123|
|Synthetic Muscle Netting|合成肌肉网|合成肌肉织网|123|
|Reinforced Cabling|强化缆索|强化缆绳|124|
|SEKHMET-Class NHP|塞赫美特级NHP|塞赫麦特级NHP|124|
|Assault Cannon|突击炮|突击加农炮|127|
|Concussion Missiles|震荡飞弹|震荡导弹|127|
|Argonaut Shield|阿尔戈英雄盾|阿尔戈大盾|127|
|Aegis Shield Generator|神盾护盾发生器|埃癸斯护盾发生器|127|
|Portable Bunker|便携式碉堡|便携式地堡|128|
|Leviathan Heavy Assault Cannon|利维坦重型突击炮|利维坦重型突击加农炮|128|
|Cable Winch System|缆索绞盘系统|缆盘系统|131|
|MULE Harness|骡子挽具|马骡装具|131|
|Whitewash Sealant Spray|白洗密封喷剂|白浴密封喷雾|131|
|Aceso Stabilizer|阿克索稳定器|阿刻索稳定器|132|
|Cutter MkII Plasma Torch|切割者MkII等离子炬|“切割者”Mk2等离子炬|132|
|Bulwark Mods|壁垒改装|壁垒模块|135|
|War Pike|战矛|刺枪|135|
|Armor-Lock Plating|装甲锁镀层|装甲锁定镀层|135|
|Thermal Charge|热能炸药|高热炸药|135|
|Power Knuckles|动力拳套|动力指虎|136|
|Ramjet|冲压喷射器|冲压式喷气发动机|136|
|BB Breach/Blast Charges|BB破门/爆破炸药|BB突破/爆破炸药|139|
|Bolt Thrower|弩炮|投矛器|139|
|“Roland” Chamber|「罗兰」膛室|“罗兰”弹仓|139|
|Kinetic Hammer|动能锤|动力锤|140|
|UNCLE-Class Comp/Con|UNCLE级COMP/CON|“老爹级”伙伴/礼宾单元|140|
|Deck-Sweeper Automatic Shotgun|扫甲板自动散弹枪|“甲板清扫者”自动霰弹枪|143|
|Daisy Cutter|雏菊切割者|摘菊使者|143|
|Throughbolt Rounds|贯穿弹|过穿螺旋弹|144|
|HyperDense Armor|超致密装甲|超密度装甲|144|
|Webjaw Snare|蛛颚陷阱|网颚陷阱|147|
|Caltrop Launcher|铁蒺藜发射器|蒺藜发射器|147|
|Impaler Nailgun|穿刺钉枪|穿刺者钉枪|147|
|Combat Drill|战斗钻头|作战用钻机|148|
|Charged Stake|充能木桩|充能标桩|148|
|Ferrous Lash|铁磁鞭|黑铁鞭|155|
|Magnetic Cannon|磁力炮|磁能加农炮|155|
|ICEOUT Drone|冰封无人机|冰遁无人机|155|
|Perimeter Command Plate|周界指令板|周边指令基板|156|
|Black ICE Module|黑冰模组|黑冰模块|156|
|Magnetic Shield|磁力护盾|磁能盾|156|
|High-Stress Mag Clamps|高应力磁力钳|高压磁能钳|159|
|Tracking Bug|追踪器|追踪漏洞|159|
|Railgun|电磁轨道炮|磁轨炮|160|
|Neurospike|神经尖刺|神经刺|163|
|Veil Rifle|帷幕步枪|面纱步枪|163|
|Burst Launcher|爆发发射器|爆裂投射器|163|
|Flicker Field Projector|闪烁力场投射器|闪烁力场投影器|163|
|StunCrown|晕眩冠|晕眩冠冕|164|
|Flash Charges|闪光弹|闪光炸药|167|
|Reactive Weave|反应编织|反应织物|167|
|Rail Rifle|电磁轨道步枪|磁轨步枪|167|
|Shock Knife|电击刀|电击匕首|167|
|Active Camouflage|主动迷彩|主动光学迷彩|168|
|Shock Wreath|电击花环|电击环|168|
|Sharanga Missiles|沙朗迦飞弹|舍罗伽导弹|171|
|Gandiva Missiles|甘狄拔飞弹|甘提娑导弹|171|
|Stabilizer Mod|稳定器改装|稳定器模块|171|
|Pinaka Missiles|比那卡飞弹|毗那喀导弹|172|
|Fold Knife|折叠刀|翘曲匕首|175|
|Vijaya Rockets|胜利火箭|维阿雅火箭|175|
|Hunter Logic Suite|猎手逻辑套件|猎人逻辑套件|175|
|Singularity Motivator|奇点驱动器|奇点动力|175|
|FADE Cloak|消散斗篷|FADE斗篷|176|
|Variable Sword|可变剑|幻剑|176|
|Markerlight|标记光|标光|179|
|Oracle LMG-I|神谕轻机枪-I|神谕LMG-I|179|
|Retractable Profile|可收缩轮廓|可伸缩剖面|179|
|LB/OC Cloaking Field|LB/OC隐形力场|LB/OC隐形场|180|
|Hive Drone|蜂巢无人机|虫巢无人机|187|
|Scanner Swarm|扫描蜂群|扫描虫群|187|
|Nanocomposite Adaptation|纳米复合改造|纳米复合物适应|187|
|Swarm Body|蜂群之躯|虫群之躯|187|
|Nanobot Whip|纳米机器人鞭|纳米机械鞭|188|
|Swarm/Hive Nanites|蜂群/蜂巢纳米机器|“虫群/虫巢”巢房|188|
|Metahook|元钩|超挂钩|192|
|OSIRIS-Class NHP|奥西里斯级NHP|欧西里斯级NHP|193|
|Mimic Mesh|拟态网|拟态网络|197|
|Monitor Module|监视模组|监控模块|197|
|Vorpal Gun|斩首枪|斩首炮|198|
|Ghast Nexus|恶鬼巢房|妖鬼巢房|202|
|Tempest Drone|风暴无人机|暴风无人机|202|
|Annihilation Nexus|歼灭巢房|湮灭巢房|202|
|Beckoner|召唤者|招手者|205|
|Smite|天罚|惩击|205|
|EMP Pulse|电磁脉冲|EMP脉冲|206|
|Lightning Generator|闪电发生器|雷电发生器|206|
|Mesmer Charges|催眠弹|催眠炸药|209|
|Aggressive System Sync|侵略性系统同步|积极系统同步|209|
|Metafold Carver|元折叠雕刻器|空间翘曲雕刻|209|
|Interdiction Field|封锁力场|拦截场|210|
|Law of Blades|刀锋律法|刀剑律法|210|
|“Roller” Directed Payload Charges|「滚轮」定向载荷炸药|“滚筒”定向推进炸药|221|
|Flak Launcher|防空炮发射器|高射炮发射器|222|
|External Ammo Feed|外置供弹|外置供弹系统|222|
|Explosive Vents|爆炸排气口|爆炸性通风|225|
|AGNI-Class NHP|阿耆尼级NHP|阿格尼级NHP|226|
|Plasma Thrower|等离子喷射器|等离子体喷射器|226|
|Grounding Charges|接地炸药|搁浅炸药|229|
|Stub Cannon|短管炮|短管加农炮|229|
|Clamp Bombs|夹附炸弹|夹钳炸弹|230|
|Stasis Bolt|停滞弹|静滞插销|233|
|Stasis Generator|停滞发生器|静滞发生器|233|
|Stasis Barrier|停滞屏障|静滞护盾|233|
|Phase-Ready Mod|相位就绪改装|相位准备模块|233|
|Blinkshield|瞬空护盾|霎盾|234|
|Displacer|置换器|置换枪|234|
|ENCLAVE-Pattern Support Shield|飞地型支援护盾|飞地模式支援护盾|237|
|Shatterhead Colony Missiles|碎首集群飞弹|碎头集落导弹|237|
|Flash Anchor|闪光锚|闪现锚点|237|
|Paracausal Mod|超因果改装|非因果律模块|238|
|SOL-Pattern Laser Rifle|SOL型激光步枪|索尔式镭射步枪|241|
|ANDROMEDA-Pattern Heavy Laser Rifle|仙女座型重型激光步枪|仙女座式重型镭射炮|241|
|Tachyon Lance|超光子长枪|迅子长枪|242|
|Annihilator|歼灭者|湮灭者|245|
|Deep Well Heat Sink|深井散热器|深井实验性冷源|245|
|Plasma Gauntlet|等离子拳套|等离子护手|246|
|Enlightenment-Class NHP|觉醒级NHP|开悟级NHP|97|
|Latch Drone|附着无人机|碰锁无人机|129|
|Apocalypse Rail|天启轨道炮|末日导轨|219|
|ZF4 SOLIDCORE|ZF4坚核|ZF4固态堆芯|239|
|Archaic Melee|古董肉搏|古董近战|101|
|Archaic Ranged|古董远距|古董远程|101|
|Light A/C|轻A/C|轻型A/C|101|
|Medium A/C|中A/C|中型A/C|101|
|Heavy A/C|重A/C|重型A/C|101|
|Light Signature|轻招牌武器|轻型招牌武器|102|
|Medium Signature|中招牌武器|中型招牌武器|102|
|Heavy Signature|重招牌武器|重型招牌武器|102|
|Light Hardsuit|轻型卫士服|轻型防护服|103|
|Assault Hardsuit|突击卫士服|突击防护服|103|
|Heavy Hardsuit|重型卫士服|重型防护服|103|
|Mobility Hardsuit|机动卫士服|机动防护服|103|
|Stealth Hardsuit|匿迹卫士服|隐形防护服|103|
|Patch|止血贴|补丁|105|
|Stims|战斗药|刺激物|105|
|Antiphoton Visor|遮光眼罩|反光子面罩|106|
|Dataplating|内置电脑|数据镀层|106|
|Subjectivity-Enhancement Suite|主观性强化套装|主观性增强套装|106|
|Infoskin|电子外皮|讯息外皮|106|
|Nanite Spray|纳米机器喷剂|纳米喷雾|106|
|Omnihook|万用终端|万物终端|107|
|SSC Sylph Undersuit|SSC风精内衣|SSC风精底层防护服|107|
|Act Unseen or Unheard|隐藏身影|销声匿迹|23|
|Blow Something Up|爆破东西|爆破|23|
|Hack or Fix|入侵或修理|入侵修理|23|
|Celebrity|名伶|名流|18|
|Far-Field Team|探索者|远场小队|18|
|Spaceborn|虚空住民|太空民|21|
|Starship Pilot|星舰驾驶员|星舰领航员|21|
|Get a Hold of Something|—|取得某物|23|
|Invent or Create|—|发明创造|23|
|Lead or Inspire|—|领导启发|23|
|Mercenary|—|雇佣兵|19|
|Frag Grenades|—|破片手雷|105|
|Camo Cloth|—|迷彩织物|106|
|Extra Rations|—|额外口粮|106|

## 天赋与等级

|天赋|采用译名|I / II / III|PDF页|
|---|---|---|---|
|Ace|王牌|杂技 / 补燃器 / 超音速|85|
|Bonded|羁绊|最佳拍档 / 日舞 / 掩护我！|85|
|Brawler|拳师|擒拿术 / 重锤 / 击倒技|86|
|Brutal|暴虐|捕食者 / 扑杀 / 无情|86|
|Crack Shot|神枪手|保持稳定 / 瞄准具校正 / 看招|86|
|Centimane|百臂|万齿 / 暴露弱点 / 潮汐抑制|87|
|Combined Arms|混合作战|锋刃之盾 / CQB训练 / 腥风血雨|87|
|Duelist|决斗士|党羽 / 剑圣 / 势不可挡|88|
|Drone Commander|无人机指挥官|牧羊人 / 高能虫群 / 生机盎然|88|
|Engineer|工程师|原型 / 修正 / 定稿|89|
|Executioner|处刑人|回锋斩 / 大刀斩 / 无处可逃|89|
|Exemplar|模范|光荣挑战 / 惩戒 / 至死方休|90|
|Gunslinger|枪侠|开场白 / 腰射 / 我用心杀戮|90|
|Grease Monkey|机械师|违规容量升级 / 机甲羁绊 / 强力靠山|91|
|Hacker|骇客|雪崩 / 安全协议骇入 / 王的最后受辞|91|
|Heavy Gunner|重炮手|掩护火力 / 锤击 / 夹叉火力|92|
|Hunter|猎人|跳扑 / 匕首戏法 / 蔑刃|92|
|Infiltrator|潜行者|潜行 / 埋伏 / 幕后操纵者|92|
|Juggernaut|主宰|动量 / 动能转移 / 势如破竹|93|
|Leader|领袖|战地指挥官 / 公开频道 / 振奋军心|93|
|Nuclear Cavalier|核子游侠|侵蚀性放热 / 融核泄漏 / 来，接着！|94|
|Siege Specialist|攻城专家|风钻 / 冲击 / 附带损害|94|
|Skirmisher|散兵|内建箔条发射器 / 破锁者 / 迂回|94|
|Spotter|观察员|入微 / 全视 / 边沁/傅柯对消|95|
|Stormbringer|兴风者|地震倾洪 / 屈身风暴 / 洪流|95|
|Tactician|战术家|乘虚而入 / 背光 / 集火|96|
|Technophile|科技狂热者|侍从碎片 / 学生碎片 / 开悟|96|
|Vanguard|先锋|握手礼仪 / 透视追踪器 / 永恒守望|97|
|Walking Armory|自走兵器库|军备 / 扩张选项 / 效率|97|

## 骨架与标签字段

完整逐字段列表见 [source/core-v35-overrides.json](source/core-v35-overrides.json) 的 fields。每项记录稳定ID、字段路径、译文和PDF页码。

## 后续维护

修改 source/core-v35-overrides.json 后运行 node tools/build-data.js，再运行两组测试。tools/core-v35.js只改显示字符串；通用术语和长名称引用采用一次替换，并保护新名称避免重复替换。短而含义宽泛的名称只作定点修改，避免误改无关叙述。
