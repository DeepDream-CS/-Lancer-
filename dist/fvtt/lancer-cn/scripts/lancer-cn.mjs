// LANCER 中文（lancer-cn）：为中文名骨架补上骨架插图。
// LANCER 系统按骨架英文名查找 Retrograde Minis 插图（frameToPath），骨架改成中文名后就找不到。
// 这里改按骨架 id（system.lid）查找；插图表由 tools/build-fvtt-module.js 生成。

const FRAME_ART = {"mf_Empakaai_alt_blackbeard":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-EMPAKAAI.png","mf_amber_phantom":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-METALMARK-2-0.png","mf_atlas":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-ATLAS.png","mf_balor":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-BALOR.png","mf_balor_alt_hecatoncheires":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-BALOR.png","mf_barbarossa":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-BARBAROSSA.png","mf_black_witch":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-BLACK WITCH.png","mf_black_witch_alt_orchidea":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-ORCHIS.png","mf_blackbeard":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-BLACKBEARD.png","mf_caliban":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-CALIBAN.png","mf_chomolungma":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-GMS.png","mf_deaths_head":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-DEATHS HEAD.png","mf_drake":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-DRAKE.png","mf_dusk_wing":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-DUSK WING.png","mf_emperor":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-EMPEROR.png","mf_ext_banshee_vine":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-GOBLIN-2-0.png","mf_ext_bligh":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-KIDD.png","mf_ext_chimera":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-HYDRA.png","mf_ext_grant":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-SHERMAN.png","mf_ext_habsburg":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-SALADIN.png","mf_ext_jouken":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-METALMARK-2-0.png","mf_ext_nelson_wing":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-NELSON-2-0.png","mf_ext_nemo":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-NELSON-2-0.png","mf_ext_night_cutter":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-DEATHS HEAD.png","mf_ext_oleander":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-DEATHS HEAD.png","mf_ext_ornithoptera":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-ATLAS.png","mf_ext_red_admiral":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-ATLAS.png","mf_ext_saladin_dread":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-SALADIN.png","mf_ext_salamander":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-KOBOLD.png","mf_genghis":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-GENGHIS.png","mf_genghis_alt_worldkiller_genghis_mk_i":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-GENGHIS-MK-I---WORLDKILLER.png","mf_goblin":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-GOBLIN-2-0.png","mf_gorgon":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-GORGON.png","mf_hydra":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-HYDRA.png","mf_iskander":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-ISKANDER-2-0.png","mf_kidd":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-KIDD.png","mf_kobold":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-KOBOLD.png","mf_kutuzov":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-NAPOLEON.png","mf_lancaster":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-LANCASTER.png","mf_lancaster_alt_taraxacum":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-LANCASTER.png","mf_lich":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-LICH.png","mf_lycan":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-MANTICORE.png","mf_manticore":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-MANTICORE.png","mf_metalmark":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-METALMARK-2-0.png","mf_micro_monarch":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-VICEROY.png","mf_minotaur":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-MINOTAUR.png","mf_minotaur_alt_wraith":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-RKF-CALENDULA.png","mf_monarch":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-MONARCH.png","mf_mourning_cloak":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-MOURNING CLOAK.png","mf_napoleon":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-NAPOLEON.png","mf_nelson":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-NELSON-2-0.png","mf_pegasus":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-Horus-PEGASUS-2-0.png","mf_raleigh":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-RALEIGH.png","mf_sagarmatha":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-GMS.png","mf_saladin":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-SALADIN.png","mf_sherman":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-SHERMAN.png","mf_sherman_alt_tagetes":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-SHERMAN.png","mf_standard_pattern_i_everest":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-GMS.png","mf_störtebeker":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-RALEIGH.png","mf_sunzi":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-SUNZI.png","mf_swallowtail":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-SWALLOWTAIL-2-0.png","mf_swallowtail_alt_swallowtail_ranger_variant":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-RANGER-SWALLOWTAIL.png","mf_tokugawa":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-TOKUGAWA.png","mf_tokugawa_alt_enkidu":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-HA-ENKIDU.png","mf_tortuga":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-TORTUGA.png","mf_vlad":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-VLAD-2-0.png","mf_white_witch":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-SSC-WHITE WITCH.png","mf_zheng":"systems/lancer/assets/retrograde-minis/Retrograde-Minis-IPS-N-ZHENG.png"};

// 与系统的 replaceDefaultResource 相同：空白、系统自带图片或神秘人图标视为可替换，玩家自定义的图片不动
const replaceable = img => !img?.trim() || img.includes("systems/lancer") || img === "icons/svg/mystery-man.svg";
const artFor = item => (item?.type === "frame" ? FRAME_ART[item.system?.lid] : null) ?? null;

// 新建骨架条目（包括导入内容包到合集）时补上插图
Hooks.on("preCreateItem", item => {
	const art = artFor(item);
	if (art && replaceable(item.img) && item.img !== art) item.updateSource({ img: art });
});

// 机甲换骨架后（机甲表在更新 system.loadout.frame 之前已按英文名尝试换图），按 id 补上头像与指示物图片
Hooks.on("updateActor", async (actor, changes, _options, userId) => {
	if (userId !== game.user.id || actor.type !== "mech") return;
	if (!foundry.utils.hasProperty(changes, "system.loadout.frame")) return;
	const frame = actor.system.loadout?.frame?.value ?? actor.items.find(i => i.type === "frame");
	const art = artFor(frame);
	if (!art) return;
	const update = {};
	if (replaceable(actor.img) && actor.img !== art) update.img = art;
	const token = actor.prototypeToken?.texture?.src;
	if (replaceable(token) && token !== art) update["prototypeToken.texture.src"] = art;
	if (Object.keys(update).length) await actor.update(update);
});

// ---------------------------------------------------------------------------
// 系统模板与代码里写死的英文（不经语言文件）：显示时按词典换成中文。
// 只改显示出来的文字节点和提示属性，不改输入框、富文本编辑区和文档数据。
// 词典由 tools/build-fvtt-module.js 从 cn-hardcoded.json、cn-words.json 生成：
//   exact    整段文字完全相同才替换
//   patterns 含 {x} 的句式，{x} 依次代入原文中的对应部分（{1}、{2} 可调换顺序）
//   words    枚举词（尺寸、类型、动作等），整段只由这些词组成时逐词替换，也用于翻译 {x} 代入的部分
//   context  只在特定界面里使用的译法（CSS 选择器 → 词典）

const HARDCODED = {"exact":{"(Optional) Manually adjust numeric stats for any special customizations you want to apply. For NPCs, you would do this by editing the actor's NPC Class item. For PC mechs, you can do this by editing their Frame item from the mech's Inventory.":"（可选）手动调整数值，以应用特殊的定制。NPC 通过编辑该角色的 NPC 职业物品调整；PC 机甲通过机甲物品栏中的骨架物品调整。",", and other information about how to use the system.":"，以及系统使用方法的其他说明。","// ACTIVE":"// 主动","// Bonuses":"// 加值","// CORE SYSTEM":"// 核心系统","// PASSIVE":"// 被动","// TECH //":"// 科技 //","// TECH ATTACK //":"// 科技攻击 //","// Quick TECH //":"// 快速科技 //","// Quick TECH ATTACK //":"// 快速科技攻击 //","// Full TECH //":"// 完整科技 //","// Full TECH ATTACK //":"// 完整科技攻击 //","ACCURACY":"准度","ACTION ID":"动作 ID","ACTION NAME":"动作名称","ACTIONS":"动作","ACTIVATE":"激活","ACTIVATIONS":"激活次数","ACTIVE":"主动","ADDED ACTIONS":"附加动作","ADDED DAMAGE":"附加伤害","ADDED DEPLOYABLES":"附加部署物","ADDED RANGE":"附加射程","ADDED TAGS":"附加标签","AGI":"敏捷","ARMOR":"装甲","ATTACK BONUS":"攻击加值","AUTHOR":"作者","AUX/AUX":"副/副","AVAILABLE":"可用","AVAILABLE WEAPON MOUNTS":"可用武器挂载点","Accuracy":"准度","Accuracy and Difficulty":"准度与难度","Accurate (+1)":"精准（+1）","Action Editing":"编辑动作","Add a base damage type":"添加基础伤害类型","Add a bonus damage type":"添加额外伤害类型","Add a bonus damage type for only this target":"添加仅对该目标生效的额外伤害类型","Add global accuracy":"添加全局准度","Add global difficulty":"添加全局难度","Add new base damage type":"添加新的基础伤害类型","Agility":"敏捷","Allowed Sizes":"允许的武器尺寸","Allowed Types":"允许的武器类型","Apply damage":"施加伤害","Armor":"护甲","Armor Piercing":"穿甲","Armor Piercing (AP)":"穿甲（AP）","Attack Bonus":"攻击加值","Attack bonus":"攻击加值","Author":"作者","Available and Installed Content":"可用与已安装的内容","BASE ACTIONS":"基础动作","BASE FEATURE":"基础特性","BASE FEATURES":"基础特性","BASIC ATTACK":"基础攻击","BONUS":"额外","BURN :: ENG":"燃烧 :: 工程","BURN CLEARED!":"燃烧已清除！","Base Damage":"基础伤害","Basic Workflows":"基本流程","Bonus":"额外","Bonus Damage":"额外伤害","Bonus Editing":"编辑加值","Boon XP from another PC.":"来自其他 PC 的恩惠经验。","Browse":"浏览","Bug reports and enhancement suggestions":"问题报告与改进建议","Burn flow requires the actor to have a token in the scene":"燃烧流程需要该角色在场景中有指示物","CASCADE":"崩溃","CASCADE CHECK":"崩溃检定","CHANGELOG":"更新日志","CHARGED":"已充能","CLASS":"职业","CONSUMABLE":"消耗品","CORE":"核心","COST":"消耗","COUNTERS":"计数器","CURRENT":"当前","Cancel":"取消","Cannot Be Reduced":"不可降低","Cannot Create Actors":"无法创建角色","Cannot Migrate This World":"无法迁移此世界","Cannot be Reduced":"不可降低","Cannot fire a weapon on a non-piloted mech!":"无人驾驶的机甲不能使用武器！","Cannot use a system on a non-piloted mech!":"无人驾驶的机甲不能使用系统！","Cannot use a talent without an active mech!":"没有启用中的机甲，无法使用天赋！","Check out the project wiki for":"项目维基提供了","Clear All":"全部清除","Clear Ally Condition":"清除盟友状况","Clear Burn":"清除燃烧","Clear Compendium Data":"清除合集包数据","Clear Compendiums":"清除合集包","Clear LANCER Compendium Data":"清除 LANCER 合集包数据","Clear Own Condition":"清除自身状况","Clearing all LANCER Compendium data. Please wait.":"正在清除所有 LANCER 合集包数据，请稍候。","Close":"关闭","Configuration":"设置","Crit":"会心","Hit":"命中","Miss":"未命中","No Cover":"无掩护","Soft Cover (-1)":"软性掩护（-1）","Hard Cover (-2)":"硬性掩护（-2）","Confirm":"确认","Consume Lock On (+1)":"消耗锁定（+1）","Contents:":"内容：","Cool Mech":"冷却机甲","Core Bonuses":"核心奖励","Core Data has not been built yet":"核心数据尚未生成","Could not find character to import! No share code entered.":"找不到要导入的角色！未输入分享码。","Could not infer action type":"无法判断动作类型","Counter Editing":"编辑计数器","DAMAGE":"伤害","DAMAGE TYPES":"伤害类型","DEACTIVATE":"停用","DELETE":"删除","DEPLOYABLES":"部署物","DEPRECATED":"已弃用","DESCRIPTION":"说明","DETAILS":"详情","DROP HERE":"拖放到此处","DROP NPC FEATURES HERE":"将 NPC 特性拖放到此处","Damage":"伤害","Damage Roll":"伤害掷骰","Decrease flat bonus":"减少固定加值","Delete Document":"删除条目","Difficulty":"难度","Drag items from the relevant compendiums, such as Mech frames or NPC Features.":"从相应的合集包拖入物品，例如机甲骨架或 NPC 特性。","E-DEF":"电子防御","E-DEFENSE":"电子防御","E-Defense":"电子防御","EFFECT":"效果","EFFICIENCY":"效率","ENG":"工程","ENGINEERING":"工程","EVASION":"回避","Edit":"编辑","Edit Bonus:":"编辑加值：","Edit Field:":"编辑字段：","Edit Text":"编辑文字","Effect":"效果","Empty":"空","Engaged (-1)":"交战（-1）","Engineering":"工程","Equip armor":"装上护甲","Equip gear":"装上装备","Equip reserve":"装上储备","Equip weapon":"装上武器","Error importing from V2 share code. V2 share codes may no longer work, or this share code may need to be refreshed.":"从 V2 分享码导入时出错。V2 分享码可能已失效，或需要刷新该分享码。","Error importing from V3 share code.":"从 V3 分享码导入时出错。","Error rolling tech attack macro (not a valid tech attacker).":"科技攻击宏出错（该角色不能进行科技攻击）。","Evasion":"回避","Export":"导出","Exporting for this version of actor is currently unsupported.":"目前不支持导出此版本的角色。","Exporting ran into an issue, or actor type is not supported.":"导出时出现问题，或不支持该角色类型。","Exposed":"暴露","FAQ":"常见问题","FEATURE TYPE:":"特性类型：","FLEX":"灵活","FREQUENCY":"频率","FULL":"完整动作","FULL REPAIR":"全面维修","Filter Ignore:":"筛选时忽略：","First, make sure you have your LANCER data imported properly via the compendium manager in the \"Compendiums\" tab. If you have non-core content you want to use in your game, this would be the place to do it as well.":"首先，在「合集包」标签页中通过内容包管理器正确导入 LANCER 数据。如果要在游戏中使用核心以外的内容，也在这里导入。","Flat Modifier":"固定调整值","Flat attack bonus":"固定攻击加值","For 'cannot be reduced' effects like the Paracausal mod":"用于「不可降低」的效果，例如非因果律模块","For effects which cause the attacker to deal half damage in addition to resistance, like Heavy Gunner":"用于在抗性之外还让攻击者伤害减半的效果，例如重炮手","Frames":"骨架","Frequency:":"频率：","Full Action":"完整动作","Gear":"装备","Global Accuracy/Difficulty Adjustment":"全局准度／难度调整","HEAT":"热度","HEAT CAP":"热度上限","HEAT COST":"热度消耗","HEAVY":"重型","HISTORY":"经历","HP":"HP","HULL":"机体","Half Damage":"伤害减半","Heat Cap":"热度上限","Helpful Links":"实用链接","Hidden:":"隐藏：","Hull":"机体","ID":"ID","ID:":"ID：","INFLUENCE":"影响力","INIT":"前提","INTEGRATED":"内建","INTEGRATED GEAR":"内建装备","INTEGRATED ITEMS":"内建物品","INVADE":"入侵","IS TECH ATTACK?":"是否为科技攻击？","Icon Preview":"图标预览","Impaired (-1)":"受损（-1）","Import From File":"从文件导入","Import LCP":"导入内容包","Import Selected Loadout":"导入所选配装","Import all necessary LCPs first using the":"请先导入所有需要的内容包，使用","Import/Update LCP":"导入／更新内容包","Import/Update Selected":"导入／更新所选","Imported LCPs":"已导入的内容包","Importing character from V2 share code...":"正在从 V2 分享码导入角色……","Importing character from V3 share code...":"正在从 V3 分享码导入角色……","Inaccurate (-1)":"不准（-1）","Incomplete Pilot Import":"驾驶员导入不完整","Increase accuracy":"增加准度","Increase difficulty":"增加难度","Increase flat bonus":"增加固定加值","Innate Accuracy/Difficulty":"固有准度／难度","Installed LCPs":"已安装的内容包","Invalid Stabilize choice!":"无效的稳住阵脚选项！","Key:":"键：","LANCER Compendium Manager":"LANCER 内容包管理器","LANCER Compendiums cleared.":"LANCER 合集包已清除。","LANCER Help":"LANCER 帮助","LID":"LID","LID:":"LID：","LOADED":"已装填","LOCKED: BRACING":"锁定：受身","Lancer Compendium Manager":"LANCER 内容包管理器","Lancer Condition Icons is Integrated":"Lancer Condition Icons 已整合进系统","Lancer Core Book Data":"LANCER 核心规则书数据","Lancer Data Version":"LANCER 数据版本","Lancer Initiative":"Lancer Initiative","Lancer Initiative Module is not Needed":"不需要 Lancer Initiative 模组","Licenses":"牌照","Loading data, please wait…":"正在载入数据，请稍候…","Lock On (+1)":"锁定（+1）","MAIN":"主","MAIN/AUX":"主/副","MAJOR IDEALS":"主要理想","MAX HP":"HP 上限","MINOR IDEALS":"次要理想","MOUNTED EFFECT":"挂载效果","MOUNTED SYSTEMS":"已装备系统","MOUNTED WEAPONS":"已挂载武器","Manual Adjust":"手动调整","Manufacturer":"厂商","Mark Destroyed":"标记为已摧毁","Mark Repaired":"标记为已修复","Master:":"大师：","Max HP":"HP 上限","Max:":"上限：","Mech has no repairs left. Please try again.":"机甲没有剩余维修次数。请重新选择。","Min:":"下限：","Mods":"改装","Movement":"移动","Multiple pilot loadouts found. Please select a single loadout to import and use:":"找到多套驾驶员配装。请选择一套导入使用：","NOTES":"备注","NPC classes":"NPC 职业","NPC features":"NPC 特性","NPC templates":"NPC 模板","NPC → Deployable Bonuses":"NPC → 部署物加值","Name":"名称","New Counter":"新计数器","New Power":"新能力","New Rank":"新等级","New Trait":"新特征","New action":"新动作","Next, go to the Actors tab and create any PCs you want to use. You can either import from COMP/CON using the RM-4://SYNC tab, or manually build it out yourself. NPCs have to be manually built out for now.":"然后到「角色」标签页创建要用的 PC。可以在 RM-4://SYNC 标签页从伙伴/礼宾导入，也可以自己手动建立。NPC 目前只能手动建立。","No":"否","No License":"无牌照","No Mod Installed":"未安装改装","No core power remaining on this frame!":"该骨架的核心能力已用完！","No damage configured, skipping the roll.":"未设置伤害，跳过掷骰。","No repairs remaining!":"没有剩余维修次数！","No source specified":"未指定来源","No target for damage application":"没有施加伤害的目标","Non-NPC cannot fire an NPC weapon!":"非 NPC 不能使用 NPC 武器！","Non-NPC cannot use an NPC system!":"非 NPC 不能使用 NPC 系统！","Non-mech cannot fire a mech weapon!":"非机甲不能使用机甲武器！","Non-mech cannot use a mech system!":"非机甲不能使用机甲系统！","Non-pilot cannot fire a pilot weapon!":"非驾驶员不能使用驾驶员武器！","Non-pilot cannot use a pilot talent!":"非驾驶员不能使用驾驶员天赋！","ON ATTACK":"攻击时","ON CRIT":"会心一击时","ON HIT":"命中时","ON HIT EFFECT":"命中效果","OPTION 1":"选项 1","OPTION 2":"选项 2","OPTIONAL FEATURE":"可选特性","OPTIONAL FEATURES":"可选特性","OTHER":"其他","Official LANCER Content":"官方 LANCER 内容","On a 1–3, all weapons on one mount of your choice are destroyed":"1–3：选择一个挂载点，其上的所有武器被摧毁","On a 4–6, a system of your choice is destroyed":"4–6：选择一个系统，将其摧毁","Only GM can modify the Compendiums.":"只有 GM 能修改合集包。","Only Mechs and NPCs can take stress damage":"只有机甲和 NPC 会受到压力伤害","Only Mechs and NPCs can take structure damage":"只有机甲和 NPC 会受到结构伤害","Only NPCs can recharge!":"只有 NPC 能充能！","Only mechs and NPCs can tech attack!":"只有机甲和 NPC 能进行科技攻击！","Only mechs can cascade.":"只有机甲会崩溃。","Only mechs can overcharge!":"只有机甲能超频！","Only npcs and mechs can roll overheat.":"只有 NPC 和机甲能进行过热检定。","Only npcs and mechs can roll structure.":"只有 NPC 和机甲能进行结构检定。","Only npcs and mechs can roll structure/overheat.":"只有 NPC 和机甲能进行结构／过热检定。","Organizations":"组织","Origin Name":"来源名称","Overheat":"过热","Overkill":"杀绝","Overwrite":"覆盖","PASSIVE":"被动","POWERS":"能力","PROFILE ACTIONS":"数据组动作","PROTOCOL":"协议","PURPOSE":"宗旨","Pilot → Deployable Bonuses":"驾驶员 → 部署物加值","Pilot → Mech Bonuses":"驾驶员 → 机甲加值","PilotNET Community on Discord":"PilotNET Discord 社区","Please select your two Stabilize actions":"请选择稳住阵脚的两项效果","Please update the Core data before importing LCPs.":"导入内容包前请先更新核心数据。","Powered by Lancer":"Powered by Lancer","Prerequisite":"前置条件","Primary":"主配装","Prone (+1)":"伏卧（+1）","Protocol":"协议","QUESTIONS":"问题","QUICK":"快速动作","Quick Action":"快速动作","RANGE":"射程","RANGES TYPES":"射程类型","RANK:":"等级：","REACTION":"反应","REACTION INIT":"反应前提","REACTION TRIGGER":"反应触发","RECALL":"召回","REDEPLOY":"重新部署","REPAIRS":"维修","RESOURCE LABEL":"资源标签","ROLL DAMAGE":"掷伤害","Rank":"等级","Reaction":"反应","Rebuild Core Data":"重建核心数据","Recharge":"充能","Refresh":"刷新","Refresh Powers":"刷新能力","Reliable":"可靠","Reload":"重新装填","Remove":"移除","Remove this damage type":"移除此伤害类型","Rename":"重命名","Replace":"替换","Reserves":"储备","Reset":"重置","Resist":"抗性","Restore HP":"恢复 HP","Restore a backup of this world and":"请恢复此世界的备份，并","Roll":"掷骰","Roll a basic attack":"进行基础攻击","Roll a burn check and generate damage":"进行燃烧检定并产生伤害","Roll an attack with this system":"用此系统进行攻击","Roll an attack with this weapon":"用此武器进行攻击","Roll damage for this weapon without attacking":"不攻击，直接掷此武器的伤害","SAVE":"豁免","SENSORS":"感应","SIZE":"大小","SOURCE":"来源","SPEED":"速度","STATUS":"状态","STRESS":"压力","STRUCTURE":"结构","SUPERHEAVY":"超重型","SYNERGIES":"协同效果","SYS":"系统","SYS POINTS":"SP","SYSTEM":"系统","SYSTEMS":"系统","Save":"保存","Save Target":"豁免目标","Scan":"扫描","Seeking (*)":"导引（*）","Select LCP file":"选择内容包文件","Select Pilot Loadout":"选择驾驶员配装","Select damage multiplier":"选择伤害倍率","Selected LCPs":"所选内容包","Selected Official Sources":"所选官方内容","Sensor Range":"感应","Skills":"技能触发","Smart (*)":"智慧（*）","Speed":"速度","Stabilize":"稳住阵脚","Standard Move":"标准移动","Standard Profile":"标准数据组","Statuses":"状态","Stress":"压力","Stress Damage":"压力伤害","Structure":"结构","Structure Damage":"结构伤害","Stunned":"晕眩","Submit":"提交","Successfully loaded pilot new state.":"已载入驾驶员的新状态。","Suggested Modules":"推荐模组","Superheavy Bracing":"超重型受身","System Destruction":"系统摧毁","System Migration Version":"系统迁移版本","Systems":"系统","TACTICS":"战术","TAG":"标签","TAG META INFO":"标签元信息","TAGS":"标签","TEAR OFF":"撕下部件","TECH":"科技","TECH ATK":"科技攻击","TECH ATTACK?":"科技攻击？","TECH ATTACKS":"科技攻击","TEMPLATE":"模板","TERSE DESCRIPTION":"简述","TITLE":"标题","TRAIT":"特征","TRAITS":"特征","TRIGGER":"触发","TYPE":"类型","Tag Editing":"编辑标签","Tags":"标签","Talents":"天赋","Tally XP":"统计经验","Targeting":"瞄准","The":"","The following Actors could not be created or updated:":"以下角色无法创建或更新：","The following Items were not found in the compendium and could not be imported:":"以下物品在合集包中找不到，无法导入：","The icons and functionality from Lancer Condition Icons has been integrated with the system, and your settings have been migrated. Lancer Condition Icons will now be disabled, and you can feel free to uninstall it if no other worlds are using it.":"Lancer Condition Icons 的图标和功能已整合进系统，设置也已迁移。Lancer Condition Icons 现在会被停用；如果其他世界没有用到，可以把它卸载。","The mech is at full Stress, no overheat check to roll.":"机甲压力已满，无需进行过热检定。","The mech is at full Structure, no structure check to roll.":"机甲结构已满，无需进行结构检定。","The module has been disabled.":"该模组已停用。","The page must now be refreshed for the module change to take effect.":"需要刷新页面，模组的变更才会生效。","The targeted token has no associated actor.":"选为目标的指示物没有关联角色。","This LCP contains:":"此内容包包含：","This row is bonus damage":"此行为额外伤害","Thrown (*)":"投掷（*）","To manually build out an actor, there are two steps:":"手动建立角色分两步：","Token has hp remaining. No need to roll structure.":"指示物还有剩余 HP，无需进行结构检定。","Token is not at heat cap. No need to roll stress.":"指示物热度未达上限，无需进行压力检定。","Total":"合计","Total:":"合计：","Trying to access tokens from a different scene!":"正在访问另一场景的指示物！","UNKNOWN EXOTIC SYSTEM":"未知异种系统","UNKNOWN EXOTIC TECH ATTACK":"未知异种科技攻击","UNKNOWN EXOTIC TRAIT":"未知异种特征","UNKNOWN EXOTIC WEAPON":"未知异种武器","UNLOCKED RANK:":"已解锁等级：","USE":"使用","USES":"次数","USES:":"次数：","Undo this damage":"撤销此伤害","Unlink":"取消关联","Unselect File":"取消选择文件","Update Core Data":"更新核心数据","Uses":"次数","Value":"数值","Value:":"数值：","Version":"版本","Veteran:":"老手：","View Inventory":"查看物品栏","WEAPON":"武器","WEAPON SIZES":"武器尺寸","WEAPON TYPES":"武器类型","WEAPONS":"武器","Weapon Destruction":"武器摧毁","Weapons":"武器","XP":"经验","Yes":"是","You are not permitted to create actors and no GM's are online, so sync will not produce any new mechs or deployables.":"你没有创建角色的权限，且没有 GM 在线，因此同步不会产生新的机甲或部署物。","You can only scan NPC actors.":"只能扫描 NPC。","You cannot apply damage to an actor you do not own":"你不能对不属于你的角色施加伤害","You cannot undo damage to an actor you do not own":"你不能撤销不属于你的角色受到的伤害","You must enter a Comp/Con pilot share code before downloading!":"下载前必须输入伙伴/礼宾的驾驶员分享码！","You must import the Core Book Data in the Lancer Compendium Manager before importing a pilot.":"导入驾驶员前，必须先在 LANCER 内容包管理器中导入核心规则书数据。","You must select an LCP file before importing.":"导入前必须先选择内容包文件。","You must target a token to scan.":"必须先选定一个指示物作为扫描目标。","Your GM can allow Players/Trusted Players to create actors in Settings->Configure Permissions.":"GM 可以在「设置 → 配置权限」中允许玩家／受信任玩家创建角色。","bonds":"纽带","first.":"，然后再升级。","frames":"骨架","mech systems":"机甲系统","mech weapons":"机甲武器","migrate to Foundry 12.343":"迁移到 Foundry 12.343","module is intended for use in non-Lancer systems to use Lancer-style initiative. Since all of its functionality is already included in the system, enabling the module can cause issues.":"模组用于在非 LANCER 系统中使用 LANCER 式先攻。系统已包含它的全部功能，启用该模组可能导致问题。","pilot gear":"驾驶员装备","pilot skills":"驾驶员技能触发","recommended modules":"推荐模组","reserves":"储备","statuses/conditions":"状态／状况","tags":"标签","talents":"天赋","weapon mods":"武器改装","damage!":"点伤害！"},"patterns":[["Could not import mech '{x}' as you lack the permission to create new actors. Please ask your GM for assistance (either they import for you, or give you permissions)","无法导入机甲“{x}”：你没有创建角色的权限。请让 GM 协助（由 GM 代为导入，或给予你权限）"],["This world is too old to migrate directly to Lancer {x} and Foundry 13. Restore a backup of this world and migrate to Foundry 12.343 first.","此世界版本太旧，无法直接迁移到 Lancer {x} 与 Foundry 13。请恢复此世界的备份，先迁移到 Foundry 12.343。"],["Migration to v{x} in progress. Please do not shut down your world or refresh the page until migration is complete.","正在迁移到 v{x}。迁移完成前请不要关闭世界或刷新页面。"],["Could not import mech '{x}' as you lack the permission to update the actor. Please ask your GM for assistance.","无法导入机甲“{x}”：你没有更新该角色的权限。请让 GM 协助。"],["Journal folder {x} does not exist and must be created by a user with permissions to do so.","日志文件夹 {x} 不存在，需要由有权限的用户创建。"],["Error while migrating unlinked token {x} in scene {x}. Check the console for details.","迁移未关联指示物 {x}（场景 {x}）时出错，详情见控制台。"],["Error while migrating actor compendium {x}. Check the console for details.","迁移角色合集包 {x} 时出错，详情见控制台。"],["Error while migrating item compendium {x}. Check the console for details.","迁移物品合集包 {x} 时出错，详情见控制台。"],["This world is too old to migrate directly to Lancer {x} and Foundry 13.","此世界版本太旧，无法直接迁移到 Lancer {x} 与 Foundry 13。"],["Unresolved deployabled LID \"{x}\". Re-import + Set yourself as its owner","找不到部署物 LID“{x}”。请重新导入，并把自己设为它的所有者"],["Error while migrating actor {x}. Check the console for details.","迁移角色 {x} 时出错，详情见控制台。"],["Error while migrating scene {x}. Check the console for details.","迁移场景 {x} 时出错，详情见控制台。"],["Item {x} is not a mech system, weapon mod, or NPC feature!","物品{x}不是机甲系统、武器改装或 NPC 特性！"],["You do not own {x}, so you cannot roll damage for them","{x}不属于你，你不能为其掷伤害"],["Error in tech attack flow - {x} is an invalid type!","科技攻击流程出错：{x}的类型无效！"],["Item {x} has no actions, how did you even get here?","物品{x}没有动作。"],["Item {x} cannot roll damage as it is not a weapon!","物品{x}不是武器，不能掷伤害！"],["Are you sure you want to fully repair the {x} \"{x}\"?","确定要全面维修{x}“{x}”吗？"],["LANCER System migration to version {x} completed!","LANCER 系统已迁移到 {x} 版！"],["Starting import of {x}, Callsign {x}. Please wait.","开始导入{x}（呼号 {x}），请稍候。"],["Error in attack flow - {x} is an invalid type!","攻击流程出错：{x}的类型无效！"],["Item {x} cannot attack as it is not a system!","物品{x}不是系统，不能攻击！"],["Item {x} cannot attack as it is not a weapon!","物品{x}不是武器，不能攻击！"],["Error - No macro exists for item type \"{x}\"","错误：物品类型“{x}”没有对应的宏"],["{x} has had their actions manually reset.","{x}的动作已手动重置。"],["Could not migrate {x}: unable to unlock","无法迁移 {x}：无法解锁"],["Roll {x}d6 to determine what happens.","掷 {x}d6 决定结果。"],["Notice: {x} has been fully repaired.","注意：{x}已全面维修。"],["Import of {x}, Callsign {x} complete.","{x}（呼号 {x}）导入完成。"],["Reserve {x} has already been used!","储备{x}已经用过了！"],["System {x} has no remaining uses!","系统{x}没有剩余次数！"],["Weapon {x} has no remaining uses!","武器{x}没有剩余次数！"],["Item {x} is not a mech frame!","物品{x}不是机甲骨架！"],["System {x} has not recharged!","系统{x}尚未充能！"],["Weapon {x} has not recharged!","武器{x}尚未充能！"],["Item {x} has no bond powers!","物品{x}没有纽带能力！"],["{x} {x} has no remaining uses!","{x}{x}没有剩余次数！"],["Failed to update pilot: {x}","更新驾驶员失败：{x}"],["Item {x} can't deal damage!","物品{x}不能造成伤害！"],["{x} is starting their turn","{x}开始回合"],["A {x} can't be stabilized!","{x}无法稳住阵脚！"],["Weapon {x} is not loaded!","武器{x}未装填！"],["{x} is ending their turn","{x}结束回合"],["Item {x} is not a skill!","物品{x}不是技能触发！"],["{x} has taken {x} damage!","{x}受到了{x}伤害！"],["CORE ACTIVATION :: {x}","核心激活 :: {x}"],["Failed to load LCP {x}","无法载入内容包 {x}"],["// TALENT :: {x} {x} //","// 天赋 :: {x} {x} //"],["Core Data is at v{x}","核心数据版本 v{x}"],["Could not load {x}: {x}","无法载入 {x}：{x}"],["({x} total) damage!","（共 {x}）点伤害！"],["Basic Attack - {x}","基础攻击 - {x}"],["UNLOCKED RANK: {x}","已解锁等级：{x}"],["{x} SYSTEM POINTS","{x} SP"],["{x} took {x} damage!","{x}受到 {x} 点伤害！"],["Engineering - {x}","工程 - {x}"],["Full Repair - {x}","全面维修 - {x}"],["FULL REPAIR - {x}","全面维修 - {x}"],["Insert {x} weapon","装入{x}武器"],["SCAN // 🞂 {x} 🞀","扫描 // 🞂 {x} 🞀"],["Tech Attack - {x}","科技攻击 - {x}"],["{x} // {x} {x} Feature","{x} // {x}{x}特性"],["{x} Weapon Mount","{x}武器挂载点"],["IMPORT {x} FOR {x}?","要为{2}导入{1}吗？"],["Overcharge - {x}","超频 - {x}"],["{x} - overrides","{x} - 覆盖"],["{x}'s inventory","{x}的物品栏"],["Stabilize - {x}","稳住阵脚 - {x}"],["STABILIZE - {x}","稳住阵脚 - {x}"],["Structure - {x}","结构 - {x}"],["{x} / {x} SP USED","已用 SP：{x} / {x}"],["{x} DIFFICULTY","{x} 难度"],["{x}{x} Overshield","{x}{x} 护盾"],["// {x} TECH{x} //","// {x}科技{x} //"],["Overheat - {x}","过热 - {x}"],["RESERVE :: {x}","储备 :: {x}"],["Update to v{x}","更新到 v{x}"],["{x} - bonuses","{x} - 加值"],["{x}{x} Structure","{x}{x} 结构"],["+{x} ACCURACY","+{x} 准度"],["Agility - {x}","敏捷 - {x}"],["Damage - {x}","伤害 - {x}"],["System - {x}","系统 - {x}"],["T {x} DAMAGE","等阶 {x} 伤害"],["{x}{x} Repairs","{x}{x} 维修"],["// RANK {x}","// 等级 {x}"],["{x} damage","{x}伤害"],["{x} DAMAGE","{x}伤害"],["{x}{x} Stress","{x}{x} 压力"],["//RANK {x}","//等级 {x}"],["Grit - {x}","毅力 - {x}"],["Hull - {x}","机体 - {x}"],["Resist {x}","抗性：{x}"],["Scan - {x}","扫描 - {x}"],["Tier - {x}","等阶 - {x}"],["{x} took {x}","{x}受到 {x}"],["TIER {x} {x}","等阶 {x} {x}"],["{x}{x} Burn","{x}{x} 燃烧"],["{x}{x} Heat","{x}{x} 热度"],["Size {x}","大小 {x}"],["Tier {x}","等阶 {x}"],["TIER {x}","等阶 {x}"],["{x}{x} HP","{x}{x} HP"],["by {x}","作者：{x}"],["vs {x}","对 {x}"]],"words":{"Main":"主","Aux":"副","Auxiliary":"副","Flex":"灵活","Heavy":"重型","Superheavy":"超重型","Integrated":"内建","Ship-class":"舰载级","Melee":"近战","CQB":"CQB","Rifle":"步枪","Launcher":"发射器","Cannon":"大炮","Nexus":"巢房","Special":"特殊","Kinetic":"动能","Explosive":"爆炸","Energy":"能量","Heat":"热度","Burn":"燃烧","Variable":"可变","Range":"射程","Threat":"威胁","Blast":"溅射","Burst":"爆发","Line":"线形","Cone":"锥形","Thrown":"投掷","Quick":"快速动作","Full":"完整动作","Quick Tech":"快速科技","Full Tech":"完整科技","Invade":"入侵","Reaction":"反应","Protocol":"协议","Free":"自由动作","Free Action":"自由动作","Passive":"被动","Other":"其他","Movement":"移动","Tech":"科技","Trait":"特征","System":"系统","Weapon":"武器","Systems":"系统","Weapons":"武器","Attack":"攻击","Class":"职业","Template":"模板","Deployable":"部署物","Drone":"无人机","Shield":"护盾","Mech":"机甲","NPC":"NPC","Pilot":"驾驶员","Hull":"机体","Agility":"敏捷","Engineering":"工程","Structure":"结构","Stress":"压力","reactor":"压力","Mod":"改装","Gear":"装备","Armor":"护甲","Reserve":"储备","Talent":"天赋","Frame":"骨架","Status":"状态","Use":"使用"},"context":{".scan-stat-item":{"Armor":"装甲"}}};

const LETTER = /[A-Za-z]/;
const norm = s => s.replace(/\s+/g, " ").trim();
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const EXACT = new Map(Object.entries(HARDCODED.exact));
const WORDS = new Map(Object.entries(HARDCODED.words).map(([k, v]) => [k.toLowerCase(), v]));
const PATTERNS = HARDCODED.patterns.map(([src, zh]) => [new RegExp("^" + src.split("{x}").map(reEsc).join("(.*?)") + "$", "s"), zh]);
const CONTEXT = Object.entries(HARDCODED.context);
const NUMERIC = /^[\d+\-–.,×*()%]+$/;
const CJK_GAP = /(?<=[㐀-鿿）」]) (?=[㐀-鿿（「])/g;

// 整段只由枚举词组成（「MAIN RIFLE」「主/副」「USE QUICK TECH」）时逐词翻译，否则返回 null
function wordSeq(s) {
	const toks = s.split(/(\s+|\/)/).filter(t => t !== "");
	let out = "";
	let hit = false;
	for (let i = 0; i < toks.length; ) {
		const t = toks[i];
		if (t === "/" || /^\s+$/.test(t)) { out += t === "/" ? "/" : " "; i++; continue; }
		if (i + 2 < toks.length && /^\s+$/.test(toks[i + 1])) {
			const two = WORDS.get(`${t} ${toks[i + 2]}`.toLowerCase());
			if (two !== undefined) { out += two; i += 3; hit = true; continue; }
		}
		const w = WORDS.get(t.toLowerCase());
		if (w !== undefined) { out += w; hit = true; i++; continue; }
		if (NUMERIC.test(t)) { out += t; i++; continue; }
		return null;
	}
	return hit ? out.replace(CJK_GAP, "") : null;
}

// 句式里代入的部分：能整段翻译的就翻译（如武器尺寸、角色类型），否则保持原样（如物品名称）
function fill(zh, caps) {
	let n = 0;
	return zh.replace(/\{(x|\d)\}/g, (_, k) => {
		const c = caps[k === "x" ? n++ : Number(k) - 1] ?? "";
		const t = c.trim();
		const tr = t && LETTER.test(t) ? lookup(t, false) : null;
		return tr === null ? c : c.replace(t, tr);
	});
}

function lookup(s, deep) {
	if (EXACT.has(s)) return EXACT.get(s);
	const w = wordSeq(s);
	if (w !== null) return w;
	if (!deep) return null;
	for (const [re, zh] of PATTERNS) {
		const m = re.exec(s);
		if (m) return fill(zh, m.slice(1));
	}
	// 「名称 // MAIN RIFLE」「标题 :: TRAIT」「ACTIVATE - QUICK」：分隔符两侧分别翻译
	if (/\s(\/\/|::|-)\s/.test(s)) {
		const parts = s.split(/(\s*(?:\/\/|::)\s*|\s+-\s+)/);
		let hit = false;
		const out = parts.map((p, i) => {
			if (i % 2 || !LETTER.test(p)) return p;
			const t = lookup(p.trim(), false);
			if (t === null) return p;
			hit = true;
			return p.replace(p.trim(), t);
		});
		if (hit) return out.join("");
	}
	return null;
}

// 翻译一段显示文字；没有对应译文时返回 null。el 用于判断 context 词典
function translate(raw, el) {
	if (typeof raw !== "string" || !LETTER.test(raw)) return null;
	const s = norm(raw);
	if (el) for (const [sel, dict] of CONTEXT) if (s in dict && el.closest?.(sel)) return dict[s];
	return lookup(s, true);
}

// ---- DOM：文字节点与提示属性
const SKIP = "script, style, textarea, [contenteditable='true'], prose-mirror, .ProseMirror, .editor-content, .journal-page-content, .directory-list";
const ATTRS = ["title", "placeholder", "data-tooltip", "aria-label", "alt"];

// 系统在目标名两侧用 🞂 / 🞀（Geometric Shapes Extended），常见中文字体没有这两个字形，显示成方框；换成通用的 ▸ / ◂
const GLYPHS = { "\u{1F782}": "▸", "\u{1F780}": "◂" };
const GLYPH_RE = /[\u{1F782}\u{1F780}]/gu;

function doText(node) {
	let v = node.nodeValue;
	if (v && GLYPH_RE.test(v)) {
		GLYPH_RE.lastIndex = 0;
		node.nodeValue = v = v.replace(GLYPH_RE, c => GLYPHS[c]);
	}
	if (!v || !LETTER.test(v)) return;
	const el = node.parentElement;
	if (!el || el.closest(SKIP)) return;
	const t = translate(v, el);
	if (t === null) return;
	const nv = v.match(/^\s*/)[0] + t + v.match(/\s*$/)[0];
	if (nv !== v) node.nodeValue = nv;
}

function doAttr(el, a) {
	const v = el.getAttribute(a);
	if (!v || !LETTER.test(v)) return;
	const t = translate(v, el);
	if (t !== null && t !== v) el.setAttribute(a, t);
}

function walk(root) {
	if (root.nodeType === Node.TEXT_NODE) return doText(root);
	if (root.nodeType !== Node.ELEMENT_NODE || root.closest(SKIP)) return;
	for (const a of ATTRS) doAttr(root, a);
	const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
		acceptNode: n => (n.nodeType === Node.ELEMENT_NODE && n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
	});
	for (let n = tw.nextNode(); n; n = tw.nextNode()) {
		if (n.nodeType === Node.TEXT_NODE) doText(n);
		else for (const a of ATTRS) doAttr(n, a);
	}
}

const observer = new MutationObserver(muts => {
	for (const m of muts) {
		if (m.type === "childList") m.addedNodes.forEach(walk);
		else if (m.type === "characterData") doText(m.target);
		else if (m.type === "attributes" && !m.target.closest(SKIP)) doAttr(m.target, m.attributeName);
	}
});

// 画布上的浮动数字（「-5 HP」「+2 Heat」）不在 DOM 里，包装系统调用的 createScrollingText
function patchScrollingText() {
	const proto = foundry?.canvas?.groups?.InterfaceCanvasGroup?.prototype;
	if (!proto?.createScrollingText || proto.createScrollingText.lancerCn) return;
	const orig = proto.createScrollingText;
	proto.createScrollingText = function (origin, content, options) {
		const t = typeof content === "string" ? translate(content) : null;
		return orig.call(this, origin, t ?? content, options);
	};
	proto.createScrollingText.lancerCn = true;
}

// ---------------------------------------------------------------------------
// 车卡器资料：专业牌照、扩展厂商。Foundry 的内容包导入只按骨架生成牌照，也不导入厂商，
// 这里由 GM 手动运行（模组设置中的「导入车卡器资料」）：
//   1. 在 LANCER 的驾驶员物品合集包中建立 / 更新专业牌照条目；专业牌照装备已随扩展内容包导入，
//      其 license 字段就是专业牌照 id，牌照表会按等级列出解锁的装备。
//   2. 把骨架牌照改成骨架的中文名（系统导入时只建立牌照、不更新，英文数据先导入时牌照名一直是英文）。
//   3. 建立「车卡器资料」日志合集包：专业牌照规则与各牌照说明、扩展厂商说明。
// 数据由 tools/build-fvtt-module.js 从车卡器 assets/js/data.js 生成。

const REFERENCE = {"professional":[{"id":"pl_ips_vanguard","name":"先遣兵","maker":"IPS-N","rank":1,"description":"作为一种以高威胁近身任务为核心的通用牌照，先遣兵总结了 IPS-N 在登船和反海盗行动方面的丰富经验，为驾驶员提供一个无论底盘规格如何都可使用的灵活战术包。所有先遣兵系统都经过 IPS-N 自己的特种作战单位，海军/坚井主干安保部门的认证，完全可以在舰装和地面战区使用。","items":[{"kind":"weapons","lid":"mw_pl_buckler","name":"弹道臂盾","level":1},{"kind":"mods","lid":"wm_pl_underslung","name":"下挂式冲击器","level":1}]},{"id":"pl_ips_watchman","name":"守夜人","maker":"IPS-N","rank":2,"description":"IPS-N 守夜人扩展包被宣传为先遣兵系列的配套牌照，它在设计时考虑到了防御行为。它在所有 IPS-N 海军舰艇上使用，并作为一种免费牌照提供给在进出南航座航线星座贸易路线上运行的商船，所有的“守夜人”系统通过为驾驶员提供快速部署、模块化监蔽增强功能来补充“占领固守/反登舰”操作，可用于加强受到威胁的阵地，或在可能接近道路上建立稳固杀区。","items":[{"kind":"systems","lid":"ms_pl_sentry_drone","name":"哨兵无人机","level":2},{"kind":"systems","lid":"ms_pl_active_defense","name":"主动防御系统","level":2}]},{"id":"pl_ips_overlord","name":"霸主","maker":"IPS-N","rank":3,"description":"IPS-N 战术火力小队/班组综合指挥和控制许可正被命名为“霸主”，其设计意图满足集中增强联合作战行动的需要。一套升级硬件组合，包括传感器和通讯套件，以及 NHP 增强瞄准系统和战术网络固件，用于补充任何小单位编队战术需要，包括突击、火力支援/目标指定、防御行动和特种作战。","items":[{"kind":"systems","lid":"ms_pl_fcs_relay","name":"FCS 战术网络中继","level":3},{"kind":"systems","lid":"ms_pl_mitra","name":"密特拉级 NHP","level":3}]},{"id":"pl_ssc_sparrowhawk","name":"雀鹰","maker":"SSC","rank":1,"description":"云雀牌照是独立专业许可包，是 SSC 空天优势计划的一部分，其设计意图为在空战中作战的底盘驾驶员提供增强战区特定作战能力。传统的空中支援/空中优势理论可以通过使用适当装备的底盘代替空天战斗机来实现，同时仍然保留地面攻击能力，使这些中队在战术打击/拦截和火力支援交战中具有无与伦比的多角色灵活性。","items":[{"kind":"weapons","lid":"mw_pl_valkyrie","name":"瓦亚维亚导弹","level":1},{"kind":"systems","lid":"ms_pl_atg_bombs","name":"ATG 精确炸弹","level":1}]},{"id":"pl_ssc_micro_monarch","name":"微型金斑蝶","maker":"SSC","rank":2,"description":"微型金斑蝶系统包是 SSC 公司主生产线导弹电池平台的发展成果。用户反馈表明，与“金斑蝶”远程火力支援原则相反，他们强烈希望为中/近距离交战定制多用途导弹系统。经过大量战地测试，微型金斑蝶最终获得了牌照，它不仅作为金斑蝶的补充区域升级，也是套灵活多变适用于所有适当牌照底盘的战术武器选择。","items":[{"kind":"weapons","lid":"mw_pl_gorgon_micro","name":"哥瓦尔丹微型导弹","level":2},{"kind":"weapons","lid":"mw_pl_garuda","name":"缇娜玻安导弹","level":2}]},{"id":"pl_ssc_acolyte","name":"盲从者","maker":"SSC","rank":3,"description":"虽然完全生物底盘工程的概念已被理论化很长时间，但这种设计面临的实际限制仍然巨大（至少据大多数人所知）。尽管如此，史密斯-岛野仍在不断突破综合生物技术设计边界，将量身定制的生物来源和灵感系统整合到他们的全套精确工程作战框架中。盲从者是奢华系列最前沿设计专业牌照系列的最新独家授权，提供性能增强的全骨架升级，来自 SSC 广泛培养的异种基因数据库，以及定制生物设计，以在最困难的操作中支援驾驶员。","items":[{"kind":"systems","lid":"ms_pl_coolwind","name":"“凉风”温控器","level":3},{"kind":"systems","lid":"ms_pl_hsc","name":"HSC 电镀","level":3}]},{"id":"pl_horus_reason","name":"理性","maker":"HORUS","rank":1,"description":"伴随 NHP 和次级 NHP 辅助电子战理论在现代战场上的日益流行，武器化编码协议、逻辑病毒和猎人/杀手算法似乎在无休止地扩散，并已发展并蔓延到整个联盟太空。因此，理性并非是传统意义上的牌照，而是作为荷鲁斯档案管理员策划和分发的广泛电子战程序库授权的万物网访问。随着电子对抗和防御系统的适应和发展，可行方案的选择本身就是进化军备竞赛的一部分，动态更新以适应战场的新趋势。","items":[{"kind":"systems","lid":"ms_pl_tazo_worm","name":"塔佐蠕虫","level":1},{"kind":"systems","lid":"ms_pl_disgust_reflex","name":"厌恶/反射","level":1}]},{"id":"pl_horus_three_eye","name":"三眼","maker":"HORUS","rank":2,"description":"尽管荷鲁斯模式组通常不符合标准战斗职责分类，但也需要实现任何现存机甲核心都无法解决的特定战场目标。当这种情况出现时，多个专业牌照便会加速开发、分发、实地测试、丢弃，而那些成功满足或超过需求的牌照将被重新编译和标准化以便进行大量发行。三眼便是这样的牌照，其设计意图为在多方底盘推动狙击神射手主义学说。","items":[{"kind":"weapons","lid":"mw_pl_seeking_launcher","name":"寻索弹射器","level":2},{"kind":"systems","lid":"ms_pl_scan_bombs","name":"扫描炸弹","level":2}]},{"id":"pl_horus_bunraku","name":"文乐木偶戏","maker":"HORUS","rank":3,"description":"直至最近出现在万物网上并且正在传播给适当牌照持有者的“文乐木偶戏”，根据联盟调查局分析尚未确定指定牌照究竟是全新的荷鲁斯模式组早期证据，还是仅仅是个实验技术试验台。初步报告暗展示了隐秘的班级战术整合指挥范式，其中涉及到使用快速建立的本体论[桥梁，通往我浩瀚的心灵之门，我灵魂的无底洞。这是我给你的礼物，去使用它们，用你的智慧，或者愚钝，白痴]","items":[{"kind":"systems","lid":"ms_pl_self_bridge","name":"自我意识桥接","level":3},{"kind":"systems","lid":"ms_pl_ontological_pulse","name":"本体论超空间战术脉冲","level":3}]},{"id":"pl_ha_superfire","name":"超级火力","maker":"HA","rank":1,"description":"大多数国家和企业军队的武器解决方案主要依赖于动能/爆炸平台，为特殊目的保留基于能量的武器，但哈里逊兵工厂的超级火力牌照扭转了这一模式，迈出了最新一步。一场首发活动试图将 HA 辐射武器定位为“驾驶员在黑暗中最好的伙伴”，在大举进军传统上由 GMS 和 IPS-N 主导的市场之前，引发了一场企业间的军备竞赛。","items":[{"kind":"weapons","lid":"mw_pl_polaris","name":"“北极星”式多功能辐射枪","level":1},{"kind":"weapons","lid":"mw_pl_orion","name":"“猎户座”式热射辐射枪","level":1}]},{"id":"pl_ha_workshop","name":"铸造车间","maker":"HA","rank":2,"description":"哈里森军械库最近推出了铸造计划，意图创造一个独立牌照包，允许适格驾驶员比较定规模更宽泛地制造定制化/个人定制化的武器——所有这些都无需冒险去出兵工厂更大的产品空间保护伞。随着牌照向更广泛市场推出，预测性客户和委托国忠诚度指标预计随着时间推移会有良好增长，计划一系列免费牌照已在进行中，对各大战区的战术效益进一步提高。","items":[{"kind":"weapons","lid":"mw_pl_modular_rifle","name":"模块化先进战斗步枪","level":2},{"kind":"mods","lid":"wm_pl_optimized","name":"最优化工程","level":2}]},{"id":"pl_ha_deepwell","name":"坠落深井","maker":"HA","rank":3,"description":"哈里逊兵工厂最新的公共 beta 测试牌照现可提供给有兴趣参加他们最新开发武器的现场测试的适格驾驶员。该牌照开发代号为“坠落深井”，代表了智囊团在创造综合性全覆盖骨架重力平台方面的持续努力。目前，人工重力产生在民用领域的实际应用仍然有限，相反在军事战区的应用逐渐增长，其主要呈现亚光型 k-comp 系统中。很明显，下一步就是寻找扩展该技术使用的可行方法，而 HA 凭借数十年在尖端和非因果律作战系统开发方面的经验，在实现这一承诺方面具有独特优势。","items":[{"kind":"weapons","lid":"mw_pl_kinetic_driver","name":"运动驱动器","level":3},{"kind":"systems","lid":"ms_pl_gravity_vane","name":"重力风向标","level":3}]},{"id":"pl_ch_shepherd","name":"羊倌","maker":"C&H","rank":1,"description":"羊倌是钱德拉塞卡赫歇尔公司强大而可定制的全覆盖底盘牌照，其设计意图为驾驶员提供全战区/全地形负载增强能力的定制解决方案。每个羊倌牌照都有 C&H 终身保修，所有系统都经过严格测试以确保在最恶劣条件下发挥效能，包括臭名昭著的荒地耐力测试。","items":[{"kind":"systems","lid":"ms_pl_tactical_belt","name":"战术带","level":1},{"kind":"systems","lid":"ms_pl_weapon_pod","name":"武器舱","level":1}]},{"id":"pl_ch_tawa","name":"塔瓦","maker":"C&H","rank":2,"description":"塔瓦许可包提供给 C&H 所有对扩展可用武器库以配备最于近距离作战最精良特种武器感兴趣的常驻牌照持有者。每个塔瓦系统都被设计用来满足 C&H 严格质量标准和驾驶员信赖的军规可靠性，为所有核心提供灵活而强大的防御解决方案，这在其他牌照中不可寻得。","items":[{"kind":"weapons","lid":"mw_pl_hotwind","name":"热风冲锋手枪","level":2},{"kind":"weapons","lid":"mw_pl_heavy_blaster","name":"重击炮","level":2}]},{"id":"pl_ch_duelist","name":"斗篷","maker":"C&H","rank":3,"description":"虽然近战被认为是诸多国家级军事和安全服务的专责角色，C&H 的“斗篷”借鉴了几个世纪的角斗武器工程经验，为持牌驾驶员提供了一系列精选近战增强改造，将经典设计与当代材料相结合。C&H 选用军用级硬板护盾，适用于多种骨架和作用，有多种定制款式和许可供选择。","items":[{"kind":"weapons","lid":"mw_pl_plasma_shield","name":"等离子电浆盾","level":3},{"kind":"weapons","lid":"mw_pl_heavy_shield","name":"赫塔卡重型战斗盾","level":3}]},{"id":"pl_piof_pioneer","name":"拓荒者","maker":"PI-OF","rank":1,"description":"拓荒者是顶峰实业猎户座派系面向殖民地先遣队与边境驻军提供的通用工程牌照，采用公司现有的殖民地建设设备，为不同规格的底盘提供野外作业和维护能力。牌照中的液压工具与便携作业设施经过军用改装，适用于临时工事修筑、障碍清除及缺乏后勤支援条件下的装备抢修。对同时承担建设与防卫任务的殖民地部队而言，这套设备可以减少专用工程载具的配备需求，并继续使用当地已有的工业维修设施。","items":[{"kind":"weapons","lid":"mw_pl_piof_rivet","name":"「垦荒者」液压铆钉枪","level":1},{"kind":"systems","lid":"ms_pl_piof_workbench","name":"「拓荒工位」野外作业台","level":1}]},{"id":"pl_piof_miner","name":"星际矿工","maker":"PI-OF","rank":2,"description":"星际矿工是拓荒者系列的重型工程扩展，其技术源自顶峰实业长期供应小行星矿场和卫星露天采掘区的破岩设备。猎户座派系保留了这些设备在高负荷作业中的机械结构，并针对机甲近距离交战重新设计了挂载接口与控制系统。冲击掘进钻能够用于破坏装甲和加固工事，配套推进器则允许驾驶员穿越原本无法通行的地形。该牌照主要面向承担攻坚与通路开辟任务的单位；在缺少工程支援时，持牌机甲也可直接参与矿区和地下设施的抢通作业。","items":[{"kind":"weapons","lid":"mw_pl_piof_drill","name":"TT.5 冲击掘进钻","level":2},{"kind":"systems","lid":"ms_pl_piof_tunnel","name":"「矿道」掘进推进器","level":2}]},{"id":"pl_piof_eden","name":"伊甸先锋","maker":"PI-OF","rank":3,"description":"伊甸先锋牌照由顶峰实业的殖民地环境改造部门提供技术支持，最初用于装备在大型施工设施抵达前开展作业的先遣单位。其地貌重塑阵列与便携天候塔允许驾驶员在有限区域内整治地形、调节作业环境，为后续人员建立落脚点。猎户座派系将这套设备引入军事用途后，扩大了系统的现场控制权限，使其能够用于临时阵地构筑、进攻路线整理及局部战场环境干预。相较于公司的常规地球化设备，伊甸先锋更注重快速部署，适合需要频繁转移作业位置的小规模编队。","items":[{"kind":"systems","lid":"ms_pl_piof_terraform","name":"地貌重塑阵列","level":3},{"kind":"systems","lid":"ms_pl_piof_weather","name":"天候塔","level":3}]},{"id":"pl_kkca_squire","name":"侍从","maker":"K/KCA","rank":1,"description":"侍从是哈尔根／卡西米尔定制装配面向初次参加锦标赛的驾驶员提供的基础专业牌照，包含一套适用于多种底盘的决斗武器与纹章展示设备。“誓约”短剑采用工作室的标准制式，便于骑手在不同机体上保持熟悉的操控手感；配套纹章旗则兼作近距离战术信标，为同队骑手提供姿态修正与威胁预警。持牌者可以提交自己的家族纹章或所属团体标识，由工作室完成相应的外观定制。","items":[{"kind":"weapons","lid":"mw_pl_kkca_oath","name":"「誓约」决斗短剑","level":1},{"kind":"systems","lid":"ms_pl_kkca_banner","name":"「家徽」纹章旗","level":1}]},{"id":"pl_kkca_knight","name":"骑士","maker":"K/KCA","rank":2,"description":"骑士牌照提供给在伊斯帕萨拉尔锦标赛中取得认可战绩的侍从牌照持有者，其装备针对公开比武中的正面交锋设计。重骑枪沿用当地骑士赛事的冲击武器结构，在一次全力冲刺中释放足以破坏自身的载荷；配套决斗协议负责向参赛机体及场地系统广播挑战，持续标记交战双方。随着持牌驾驶员进入军事与安保领域，这套原本用于竞技场的装备也开始用于突击任务，以迅速迫使选定目标投入近距离交战。","items":[{"kind":"weapons","lid":"mw_pl_kkca_joust","name":"「比武」重骑枪","level":2},{"kind":"systems","lid":"ms_pl_kkca_challenge","name":"「宣战」决斗协议","level":2}]},{"id":"pl_kkca_lord","name":"领主","maker":"K/KCA","rank":3,"description":"领主是 K/KCA 为率领扈从与骑士编队的资深驾驶员保留的定制专业牌照，采用邀请授予的方式，由工作室根据持有者的惯用底盘、家族纹章和编队战法分别调校。守护铠将紧急机动与护盾发生器联动，用于掩护遭受致命打击的同伴；凯旋号角则接入编队通讯与状态监控系统，协助友军在突破敌方阵线后恢复行动并继续进攻。每套装备交付时均附有工作室创始人签署的证书，其调校记录也将随持有者的服役经历持续更新。","items":[{"kind":"systems","lid":"ms_pl_kkca_guard","name":"「代誓」守护铠","level":3},{"kind":"systems","lid":"ms_pl_kkca_triumph","name":"「凯旋」号角","level":3}]}],"makers":[{"id":"C&H","name":"钱德拉塞卡赫歇尔有限公司","color":"#a51e22","description":"特殊问题需特殊方案。C&H 是一家年轻的银河级公司，向合格驾驶员提供专业机甲牌照，专注于非正统战斗解决方案，改善恶劣环境及灾难性环境下的表现。","frames":[{"lid":"mf_ch_charioteer","name":"战车御手"},{"lid":"mf_ch_callista","name":"卡莉丝塔"},{"lid":"mf_ch_gajeshura","name":"加杰修罗"},{"lid":"mf_ch_kalalani","name":"卡拉拉尼"},{"lid":"mf_ch_matador","name":"斗牛士"},{"lid":"mf_ch_pesilat","name":"佩西拉特"},{"lid":"mf_ch_retiarius","name":"网斗士"},{"lid":"mf_ch_pemada","name":"佩马刀者"},{"lid":"mf_ch_sagittarius","name":"射手座"}],"professional":["羊倌（I）","塔瓦（II）","斗篷（III）"]},{"id":"K/KCA","name":"哈尔根/卡西米尔定制装配","color":"#7a1f3d","description":"凡事卓越。在熙熙攘攘伊斯帕萨拉尔的生态建筑中，没有哪个行业比机械化底盘设计和制造更有活力，更具成熟创新的了。这里是最大的卡拉金皇家铸造厂园区，数十名独立设计师在不断的战术优势和社会地位竞争中与它并肩作战。这些工作室主要服务于男爵领军事精英（不论贵族还是庶民），依靠为驾驶员定制设计和安装底盘的直接佣金为生，为不满一系列低级选择的客户提供服务。某家工作室可能会因一位知名客户而一夜成名——或者，若他们的骨架在公开比赛中落败也极其容易陷入破产。在这些机甲工作室中，K/KCA 脱颖而出；或者，这位设计师最能持之以恒。哈尔根/卡西米尔定制装配成立于近一个世纪前，并代表阿萨伊德（Assayid）和科里亚特（Coryat）次级家族的民事和金融联盟、哈尔根·阿萨伊德与卡西米尔·科里亚特对机甲设计、传统战斗形式和道德学的共同热情将科里亚特家族工厂的制造和分销线与阿萨伊德贸易学校的技术和机械专业知识结合在了一起。其结果便是 K/KCA 这家专注于大胆实验而不抛弃古典美学和高贵形象的设计工作室，其灵感来源于战斗艺术和实践启发。K/KCA 骨架是骑士精神和勇气的化身；善于大胆而前卫的个性化武器和英雄主义战术。","frames":[{"lid":"mf_kkca_emerald_scimitar","name":"祖母绿弯刀"},{"lid":"mf_kkca_wondrous_sword","name":"妙源剑"},{"lid":"mf_kkca_tizona","name":"提泽纳剑"},{"lid":"mf_kkca_rending_sword","name":"斩裂剑"}],"professional":["侍从（I）","骑士（II）","领主（III）"]},{"id":"PI-OF","name":"顶峰实业——猎户座派系","color":"#c0702a","description":"绝不让步。顶峰实业在土地改造和殖民地开发领域家喻户晓，其产品范畴从建筑材料到种子库到农业设备应有尽有。猎户座派系的开发框架是专门负责更新他们现有的民用机甲，为战斗准备设计模型。PI-OF 骨架混合了简易坚固的设计，反映了他们的蓝领背景，以及更多由猎户座派系重新开发的实验性军事硬件。","frames":[{"lid":"mf_piof_basil","name":"罗勒"},{"lid":"mf_piof_coriander","name":"香菜"},{"lid":"mf_piof_fennel","name":"茴香"},{"lid":"mf_piof_lemongrass","name":"香茅"},{"lid":"mf_piof_pepper","name":"胡椒"},{"lid":"mf_piof_rosemary","name":"迷迭香"},{"lid":"mf_piof_mint","name":"薄荷"},{"lid":"mf_piof_star_anise","name":"八角"}],"professional":["拓荒者（I）","星际矿工（II）","伊甸先锋（III）"]}],"rules":["每张专业牌照独立取得、分别计入牌照等级。例如同时取得先遣兵（I）、守夜人（II）、霸主（III），合计 6 级牌照。每张专业牌照只解锁自己的装备，不解锁骨架。","二级、三级专业牌照分别需要同厂商至少一级、二级的普通牌照，或其指定的前一级专业牌照。","作为 GM 额外奖励取得的等级不提高角色 LL、毅力、天赋或核心奖励数量，但计入该厂商的牌照资格合计。","在 Foundry 中：把专业牌照从合集包拖到驾驶员身上，牌照等级默认为该牌照本身的等级（I–III）。Foundry 不检查上述取得条件，由 GM 把关。"]};
const MODULE_ID = "lancer-cn";
const JOURNAL_PACK = "lancer-cn-reference";
const ROMAN = ["", "I", "II", "III"];
const KIND_NAME = { weapons: "武器", systems: "系统", mods: "武器改装", pilot_gear: "驾驶员装备", frames: "骨架" };
const escHtml = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const paras = s => String(s ?? "").split(/\n+/).filter(t => t.trim()).map(t => `<p>${escHtml(t.trim())}</p>`).join("");

// lid → 合集包中的条目链接（找不到时只写名称）
async function linker() {
	const map = new Map();
	for (const id of ["world.mech-items", "world.pilot-items"]) {
		const pack = game.packs.get(id);
		if (!pack) continue;
		const index = await pack.getIndex({ fields: ["system.lid"] });
		for (const e of index) if (e.system?.lid) map.set(e.system.lid, `@UUID[Compendium.${id}.Item.${e._id}]`);
	}
	return (lid, name) => (map.has(lid) ? `${map.get(lid)}{${escHtml(name)}}` : escHtml(name));
}

function professionalPage(pl, link) {
	const byLevel = {};
	for (const it of pl.items) (byLevel[it.level] = byLevel[it.level] || []).push(it);
	const list = Object.keys(byLevel).sort().map(lv =>
		`<h3>${escHtml(pl.name)} ${ROMAN[lv] || lv}</h3><ul>${byLevel[lv].map(it => `<li>${KIND_NAME[it.kind] || ""}：${link(it.lid, it.name)}</li>`).join("")}</ul>`).join("");
	return `<p><b>厂商</b>：${escHtml(pl.maker)}　<b>牌照等级</b>：${ROMAN[pl.rank] || pl.rank}</p>${paras(pl.description)}<h2>解锁装备</h2>${list}`;
}

function makerPage(m, link) {
	const frames = m.frames.length ? `<h2>骨架牌照</h2><ul>${m.frames.map(f => `<li>${link(f.lid, f.name)}</li>`).join("")}</ul>` : "";
	const pls = m.professional.length ? `<h2>专业牌照</h2><ul>${m.professional.map(p => `<li>${escHtml(p)}</li>`).join("")}</ul>` : "";
	return `<p><b>厂商代号</b>：${escHtml(m.id)}</p>${paras(m.description)}${frames}${pls}`;
}

async function importReference() {
	if (!game.user?.isGM) return ui.notifications.warn("只有 GM 能导入车卡器资料。");
	const items = game.packs.get("world.pilot-items");
	const mech = game.packs.get("world.mech-items");
	if (!items || !mech) return ui.notifications.warn("请先在 LANCER 内容包管理器中导入核心数据与中文内容包，再导入车卡器资料。");
	if (items.locked) return ui.notifications.warn("驾驶员物品合集包已锁定，请先解锁再导入。");
	const Item = CONFIG.Item.documentClass;
	const JournalEntry = CONFIG.JournalEntry.documentClass;

	// 1. 专业牌照
	const licenseFolder = items.folders.find(f => f.getFlag("lancer", "entrytype") === "license");
	const index = await items.getIndex({ fields: ["system.lid", "system.key", "type"] });
	const byLid = new Map(index.filter(e => e.system?.lid).map(e => [e.system.lid, e]));
	const creates = [];
	const updates = [];
	for (const pl of REFERENCE.professional) {
		const data = { name: pl.name, type: "license", system: { lid: `lic_${pl.id}`, key: pl.id, manufacturer: pl.maker, curr_rank: pl.rank }, flags: { [MODULE_ID]: { professional: true } } };
		const existing = byLid.get(data.system.lid);
		if (existing) updates.push({ _id: existing._id, ...data });
		else creates.push({ ...data, folder: licenseFolder?.id });
	}
	// 2. 骨架牌照改成骨架的中文名
	const frames = await mech.getIndex({ fields: ["system.lid", "type"] });
	const frameName = new Map(frames.filter(e => e.type === "frame").map(e => [e.system?.lid, e.name]));
	let renamed = 0;
	for (const e of index) {
		if (e.type !== "license" || REFERENCE.professional.some(p => p.id === e.system?.key)) continue;
		const zh = frameName.get(e.system?.key);
		if (zh && zh !== e.name && /[㐀-鿿]/.test(zh)) { updates.push({ _id: e._id, name: zh }); renamed++; }
	}
	await Item.createDocuments(creates, { pack: items.collection });
	await Item.updateDocuments(updates, { pack: items.collection });

	// 3. 日志：每次重新生成（内容由模组维护，手动修改会被覆盖）
	const CC = foundry.documents?.collections?.CompendiumCollection ?? globalThis.CompendiumCollection;
	let journals = game.packs.get(`world.${JOURNAL_PACK}`);
	if (!journals) journals = await CC.createCompendium({ type: "JournalEntry", label: "车卡器资料", name: JOURNAL_PACK, package: "world" });
	if (journals.locked) await journals.configure({ locked: false });
	const link = await linker();
	const old = await journals.getDocuments();
	const mine = old.filter(j => j.getFlag(MODULE_ID, "key"));
	if (mine.length) await JournalEntry.deleteDocuments(mine.map(j => j.id), { pack: journals.collection });
	await JournalEntry.createDocuments([
		{
			name: "专业牌照",
			flags: { [MODULE_ID]: { key: "professional" } },
			pages: [
				{ name: "规则说明", type: "text", text: { content: REFERENCE.rules.map(r => `<p>${escHtml(r)}</p>`).join("") } },
				...REFERENCE.professional.map(pl => ({ name: `${pl.name}（${pl.maker} ${ROMAN[pl.rank] || pl.rank}）`, type: "text", text: { content: professionalPage(pl, link) } })),
			],
		},
		{
			name: "扩展厂商",
			flags: { [MODULE_ID]: { key: "makers" } },
			pages: REFERENCE.makers.map(m => ({ name: `${m.name}（${m.id}）`, type: "text", text: { content: makerPage(m, link) } })),
		},
	], { pack: journals.collection });

	ui.notifications.info(`车卡器资料已导入：专业牌照 ${REFERENCE.professional.length} 张（新建 ${creates.length}），骨架牌照改名 ${renamed} 个，日志「车卡器资料」。`);
	return { created: creates.length, updated: updates.length, renamed };
}

// 设置菜单的按钮：Foundry 会 new 一个 type 再调用 render，这里直接弹出确认框
class ImportReferenceMenu {
	render() {
		const Dialog = foundry.applications.api.DialogV2;
		Dialog.confirm({
			window: { title: "导入车卡器资料" },
			content: "<p>在 LANCER 合集包中建立专业牌照、把骨架牌照改为中文名，并生成「车卡器资料」日志合集包（专业牌照、扩展厂商）。</p><p>请先导入中文内容包。可以重复运行；日志由模组重新生成。</p>",
		}).then(ok => ok && importReference()).catch(err => { console.error(err); ui.notifications.error(`导入车卡器资料失败：${err.message ?? err}`); });
		return this;
	}
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	game.settings.registerMenu(MODULE_ID, "importReference", {
		name: "车卡器资料",
		label: "导入车卡器资料",
		hint: "建立专业牌照条目、把骨架牌照改为中文名，并生成专业牌照与扩展厂商的说明日志。需先导入中文内容包。",
		icon: "fas fa-book",
		type: ImportReferenceMenu,
		restricted: true,
	});
});

// ---------------------------------------------------------------------------
// 掩护区：在地图上画一个区域（Region），加上「LANCER 掩护区」行为。
// 指示物进入区域时自动挂上「掩护 - 软性 / 硬性」状态，离开时去掉；同时处在多个掩护区时取最高的掩护。
// LANCER 系统的命中面板读取目标身上的这两个状态（cover_soft / cover_hard）计算 -1 / -2。
const COVER_TYPE = `${MODULE_ID}.cover`;
const COVER_STATUS = { soft: "cover_soft", hard: "cover_hard" };
const COVER_RANK = { none: 0, soft: 1, hard: 2 };

// 指示物当前所在的掩护区给出的掩护；exclude 是正在离开的区域，include 是正在进入的区域
function coverFor(tokenDoc, { exclude, include } = {}) {
	const regions = new Set(tokenDoc.regions ?? []);
	if (exclude) regions.delete(exclude);
	if (include) regions.add(include);
	let best = "none";
	for (const region of regions) {
		for (const b of region.behaviors ?? []) {
			if (b.type !== COVER_TYPE || b.disabled) continue;
			const c = b.system?.cover;
			if (COVER_RANK[c] > COVER_RANK[best]) best = c;
		}
	}
	return best;
}

async function applyCover(tokenDoc, cover) {
	const actor = tokenDoc?.actor;
	if (!actor?.toggleStatusEffect) return;
	for (const [kind, status] of Object.entries(COVER_STATUS)) {
		const want = kind === cover;
		if (actor.statuses?.has(status) !== want) await actor.toggleStatusEffect(status, { active: want });
	}
}

function defineCoverBehavior() {
	const Base = foundry.data?.regionBehaviors?.RegionBehaviorType;
	if (!Base) return null;
	const fields = foundry.data.fields;
	const E = CONST.REGION_EVENTS;
	// 事件会在每个客户端触发，只由引发事件的用户处理（移动指示物的玩家或 GM），避免重复更新
	const mine = event => event.user?.isSelf;
	return class CoverZoneBehavior extends Base {
		static defineSchema() {
			return {
				cover: new fields.StringField({
					required: true, initial: "soft", choices: { soft: "软性掩护（-1）", hard: "硬性掩护（-2）" },
					label: "掩护", hint: "区域内的指示物自动获得的掩护。导引武器、科技攻击与非投掷近战攻击按规则忽略掩护。",
				}),
			};
		}
		static events = {
			[E.TOKEN_ENTER]: async function (event) {
				if (!mine(event)) return;
				const token = event.data.token;
				await applyCover(token, coverFor(token, { include: this.region }));
			},
			[E.TOKEN_EXIT]: async function (event) {
				if (!mine(event)) return;
				const token = event.data.token;
				await applyCover(token, coverFor(token, { exclude: this.region }));
			},
			// 画好区域、启用或停用行为时，处理已经在区域里的指示物
			[E.BEHAVIOR_ACTIVATED]: async function (event) {
				if (!mine(event)) return;
				for (const token of this.region.tokens ?? []) await applyCover(token, coverFor(token, { include: this.region }));
			},
			[E.BEHAVIOR_DEACTIVATED]: async function (event) {
				if (!mine(event)) return;
				for (const token of this.region.tokens ?? []) await applyCover(token, coverFor(token, { exclude: this.region }));
			},
		};
	};
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer" || !CONFIG.RegionBehavior) return;
	const Behavior = defineCoverBehavior();
	if (!Behavior) return;
	CONFIG.RegionBehavior.dataModels[COVER_TYPE] = Behavior;
	if (CONFIG.RegionBehavior.typeIcons) CONFIG.RegionBehavior.typeIcons[COVER_TYPE] = "fa-solid fa-shield-halved";
});
// 行为类型的显示名：Foundry 按语言键 TYPES.RegionBehavior.lancer-cn.cover 查（按「.」逐层查找），
// 写进已载入的译文与英文后备译文，任何界面语言都显示中文名
const COVER_LABEL_KEY = `TYPES.RegionBehavior.${COVER_TYPE}`;
Hooks.once("i18nInit", () => {
	if (game.system?.id !== "lancer") return;
	for (const t of [game.i18n.translations, game.i18n._fallback]) if (t) foundry.utils.setProperty(t, COVER_LABEL_KEY, "LANCER 掩护区");
});

// ---------------------------------------------------------------------------
// 六边形墙体：GM 在「墙壁」工具栏选「六边形墙体」，点击格子放置一整格的墙体，再点一次移除，按住拖动可连续放置。
// 每格墙体 = 沿格子边缘的 6 段阻挡移动的墙 + 一个所有人可见的实心六边形图形（Foundry 的墙对玩家不可见，图形告诉玩家此处不可通过）。
// 默认不阻挡视线；模组设置「六边形墙体阻挡视线」可打开。墙体只阻挡移动，掩护按需手动设置或用掩护区。
const HEX_TOOL = "lancerHexWall";
const HEX_FLAG = "hexWall";

const hexKey = offset => `${offset.i},${offset.j}`;

// 一格墙体的文档数据：walls（每条边一段）与 drawing（实心多边形，坐标相对左上角）
function hexWallData(rawVertices, key, { blockSight = false } = {}) {
	const vertices = rawVertices.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));
	const NONE = CONST.WALL_SENSE_TYPES?.NONE ?? 0;
	const NORMAL = CONST.WALL_SENSE_TYPES?.NORMAL ?? 20;
	const MOVE = CONST.WALL_MOVEMENT_TYPES?.NORMAL ?? 20;
	const flags = { [MODULE_ID]: { [HEX_FLAG]: key } };
	const walls = vertices.map((p, i) => {
		const q = vertices[(i + 1) % vertices.length];
		return { c: [p.x, p.y, q.x, q.y].map(Math.round), move: MOVE, sight: blockSight ? NORMAL : NONE, light: blockSight ? NORMAL : NONE, sound: NONE, flags };
	});
	const xs = vertices.map(p => p.x), ys = vertices.map(p => p.y);
	const x = Math.min(...xs), y = Math.min(...ys);
	const drawing = {
		x, y, locked: true, flags,
		shape: { type: "p", width: Math.max(...xs) - x, height: Math.max(...ys) - y, points: vertices.flatMap(p => [Math.round(p.x - x), Math.round(p.y - y)]) },
		fillType: CONST.DRAWING_FILL_TYPES?.SOLID ?? 1, fillColor: "#2b2b2b", fillAlpha: 0.85,
		strokeColor: "#000000", strokeWidth: 4, strokeAlpha: 1,
	};
	return { walls, drawing };
}

const hexDocs = (scene, key) => ({
	walls: scene.walls.filter(w => w.getFlag?.(MODULE_ID, HEX_FLAG) === key),
	drawings: scene.drawings.filter(d => d.getFlag?.(MODULE_ID, HEX_FLAG) === key),
});
// 这一格有墙或图形就算「有墙体」：只剩图形（墙被别的方式删掉）时，点它也是移除
const hexHas = (scene, key) => { const d = hexDocs(scene, key); return d.walls.length > 0 || d.drawings.length > 0; };

// 正在由本工具移除的格子：deleteWall 钩子跳过它们，避免重复删除同一个图形
const removingHex = new Set();

// 在某个画布坐标所在的格子放置（mode = "add"）或移除（"remove"）墙体；返回实际做了什么
async function setHexWall(scene, grid, point, mode) {
	const offset = grid.getOffset(point);
	const key = hexKey(offset);
	const existing = hexDocs(scene, key);
	const has = existing.walls.length > 0 || existing.drawings.length > 0;
	if (mode === "remove") {
		if (!has) return null;
		removingHex.add(key);
		try {
			// 先删图形（玩家看得到的部分），再删墙
			if (existing.drawings.length) await scene.deleteEmbeddedDocuments("Drawing", existing.drawings.map(d => d.id));
			if (existing.walls.length) await scene.deleteEmbeddedDocuments("Wall", existing.walls.map(w => w.id));
		} finally { removingHex.delete(key); }
		return "remove";
	}
	if (has) return null;
	const { walls, drawing } = hexWallData(grid.getVertices(offset), key, { blockSight: !!game.settings.get(MODULE_ID, "hexWallBlocksSight") });
	await scene.createEmbeddedDocuments("Drawing", [drawing]);
	await scene.createEmbeddedDocuments("Wall", walls);
	return "add";
}

// ---------------------------------------------------------------------------
// 掩护格：Foundry 的区域工具在六角网格上画不出整格的六边形。「区域」工具栏的「软性掩护格 / 硬性掩护格」
// 点击格子把这一格加进本场景的软性 / 硬性掩护区（一个带「LANCER 掩护区」行为的区域，所有人可见），再点移除。
const COVER_CELL_FLAG = "coverCells";
const COVER_CELL_STYLE = {
	soft: { name: "软性掩护格", color: "#3b82c4" },
	hard: { name: "硬性掩护格", color: "#c4703b" },
};
const cellPoints = vertices => vertices.flatMap(p => [Math.round(p.x), Math.round(p.y)]);
const samePoints = (a, b) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= 1);
const shapeData = s => (typeof s?.toObject === "function" ? s.toObject() : { ...s });
const coverRegionOf = (scene, cover) => scene.regions.find(r => r.getFlag?.(MODULE_ID, COVER_CELL_FLAG) === cover);

function coverCellHas(scene, grid, point, cover) {
	const pts = cellPoints(grid.getVertices(grid.getOffset(point)));
	const region = coverRegionOf(scene, cover);
	return !!region?.shapes?.some(s => s.type === "polygon" && samePoints(Array.from(s.points), pts));
}

async function setCoverCell(scene, grid, point, cover, mode) {
	const pts = cellPoints(grid.getVertices(grid.getOffset(point)));
	const region = coverRegionOf(scene, cover);
	const shapes = (region?.shapes ?? []).map(shapeData);
	const idx = shapes.findIndex(s => s.type === "polygon" && samePoints(Array.from(s.points), pts));
	if (mode === "remove") {
		if (idx < 0) return null;
		shapes.splice(idx, 1);
		if (shapes.length) await region.update({ shapes });
		else await scene.deleteEmbeddedDocuments("Region", [region.id]);
		return "remove";
	}
	if (idx >= 0) return null;
	const shape = { type: "polygon", points: pts, hole: false };
	if (region) await region.update({ shapes: [...shapes, shape] });
	else {
		const style = COVER_CELL_STYLE[cover];
		await scene.createEmbeddedDocuments("Region", [{
			name: style.name, color: style.color, shapes: [shape],
			visibility: CONST.REGION_VISIBILITY?.ALWAYS ?? 2,
			flags: { [MODULE_ID]: { [COVER_CELL_FLAG]: cover } },
			behaviors: [{ name: "LANCER 掩护区", type: COVER_TYPE, system: { cover } }],
		}]);
	}
	return "add";
}

// ---------------------------------------------------------------------------
// 按格子涂画的工具：工具启用时拦截画布左键（不让图层开始画墙 / 画区域），按下时所在格子决定放置还是移除，拖动时对经过的格子做同样的事
const PAINT_TOOLS = {
	[HEX_TOOL]: {
		control: "walls", label: "六边形墙体",
		has: (scene, grid, point) => hexHas(scene, hexKey(grid.getOffset(point))),
		apply: (scene, grid, point, mode) => setHexWall(scene, grid, point, mode),
		tool: { title: "六边形墙体：点击格子放置一整格不可通过的墙体，再点移除；按住拖动可连续放置", icon: "fa-solid fa-draw-polygon" },
	},
	lancerCoverSoft: {
		control: "regions", label: "软性掩护格",
		has: (scene, grid, point) => coverCellHas(scene, grid, point, "soft"),
		apply: (scene, grid, point, mode) => setCoverCell(scene, grid, point, "soft", mode),
		tool: { title: "软性掩护格：点击格子加入软性掩护区（进入的指示物获得软性掩护），再点移除；按住拖动可连续操作", icon: "fa-solid fa-shield-halved" },
	},
	lancerCoverHard: {
		control: "regions", label: "硬性掩护格",
		has: (scene, grid, point) => coverCellHas(scene, grid, point, "hard"),
		apply: (scene, grid, point, mode) => setCoverCell(scene, grid, point, "hard", mode),
		tool: { title: "硬性掩护格：点击格子加入硬性掩护区（进入的指示物获得硬性掩护），再点移除；按住拖动可连续操作", icon: "fa-solid fa-shield" },
	},
};

function activePaintTool() {
	const c = ui.controls;
	const control = c?.control?.name ?? c?.activeControl;
	const tool = c?.tool?.name ?? c?.activeTool;
	const def = PAINT_TOOLS[tool];
	return def && def.control === control ? def : null;
}

// 画布元素：只拦截落在画布上的按下，界面按钮等不受影响
const canvasView = () => canvas?.app?.canvas ?? canvas?.app?.view;

let hexPaint = null;
// 在 window 的捕获阶段处理。PIXI 在画布元素上监听 pointerdown、在 document / window 上监听 pointermove / pointerup
// （都是捕获阶段）；window 的捕获最先执行，在这里拦下，墙壁图层就不会把拖动当成画一道直线墙。
function onHexPointer(event) {
	const stop = () => { event.stopImmediatePropagation(); event.preventDefault(); };
	// 松开左键（包括在画布外松开）后结束这一次涂画；涂画中的松开也拦下，不让图层收到
	if (event.type === "pointerup" || event.type === "pointercancel") {
		if (hexPaint) { hexPaint = null; stop(); }
		return;
	}
	const def = game.user?.isGM && canvas?.scene ? activePaintTool() : null;
	if (!def) { hexPaint = null; return; }
	if (event.type === "pointerdown") {
		if (event.button !== 0 || event.target !== canvasView()) return;
	} else {
		// 移动：只在按住左键涂画时接管
		if (!hexPaint) return;
		if (!(event.buttons & 1)) { hexPaint = null; return; }
	}
	stop();
	if (canvas.grid.isGridless) { if (event.type === "pointerdown") ui.notifications.warn(`无网格的场景不能使用「${def.label}」。`); return; }
	const point = canvas.canvasCoordinatesFromClient({ x: event.clientX, y: event.clientY });
	const key = hexKey(canvas.grid.getOffset(point));
	if (event.type === "pointerdown") {
		hexPaint = { def, mode: def.has(canvas.scene, canvas.grid, point) ? "remove" : "add", done: new Set([key]), queue: Promise.resolve() };
	} else if (!hexPaint || hexPaint.def !== def || hexPaint.done.has(key)) return;
	else hexPaint.done.add(key);
	// 依次执行：同一区域的连续更新不能并发，否则后一次会覆盖前一次的形状
	const { mode } = hexPaint;
	hexPaint.queue = hexPaint.queue.then(() => def.apply(canvas.scene, canvas.grid, point, mode)).catch(err => console.error(`${MODULE_ID} |`, err));
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	game.settings.register(MODULE_ID, "hexWallBlocksSight", {
		name: "六边形墙体阻挡视线",
		hint: "开启后，新放置的六边形墙体除了阻挡移动，也阻挡视线与光照。已放置的墙体不受影响。",
		scope: "world", config: true, type: Boolean, default: false,
	});
});

Hooks.on("getSceneControlButtons", controls => {
	if (game.system?.id !== "lancer" || !game.user?.isGM) return;
	for (const [name, def] of Object.entries(PAINT_TOOLS)) {
		const group = controls?.[def.control];
		if (!group?.tools) continue;
		group.tools[name] = { name, ...def.tool, order: Object.keys(group.tools).length };
	}
});

// 在 init 时注册（早于画布建立），保证排在 PIXI 的 window 监听之前
Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	for (const type of ["pointerdown", "pointermove", "pointerup", "pointercancel"]) globalThis.addEventListener(type, onHexPointer, { capture: true });
});

// 用 Foundry 自己的墙壁工具删掉某格的最后一段墙时，顺带删掉这一格的六边形图形，不留下删不掉的色块
Hooks.on("deleteWall", (wall, _options, userId) => {
	if (userId !== game.user?.id) return;
	const key = wall.getFlag?.(MODULE_ID, HEX_FLAG);
	const scene = wall.parent;
	if (!key || !scene || removingHex.has(key)) return;
	const left = hexDocs(scene, key);
	if (left.walls.length || !left.drawings.length) return;
	// 一次删掉多段墙时钩子会触发多次，只删一次
	removingHex.add(key);
	scene.deleteEmbeddedDocuments("Drawing", left.drawings.map(d => d.id))
		.catch(err => console.error(`${MODULE_ID} |`, err))
		.finally(() => removingHex.delete(key));
});

// ---------------------------------------------------------------------------
// 攻击时选目标：开始攻击、科技攻击（或不是从攻击卡发起的掷伤害）时，在 LANCER 的准度面板旁边弹出目标面板。
// - 列出场上的指示物（敌方 / 中立 / 友方），按距离排序，标出是否在武器射程（科技攻击为感应）内；点一行锁定 / 取消锁定。
// - 面板开着时，左键点地图上的指示物就是锁定 / 取消锁定（攻击者自己的指示物除外），不用按 T 或切换工具。
// - 开始新攻击时，若锁定的还是上一次攻击的那几个目标（之后没改过），先清掉；射程内只有一个敌人时自动选上。
// LANCER 的准度面板在目标变化时会自己刷新（targetToken 钩子），所以先开面板再选目标也可以。
// 开关时机用系统公开的 flow 钩子 lancer.preFlow.<类名> / lancer.postFlow.<类名>（系统构建保留类名）。
const TARGET_FLOWS = ["BasicAttackFlow", "WeaponAttackFlow", "TechAttackFlow", "DamageRollFlow"];
const RANGE_ZH = { Range: "射程", Threat: "威胁", Thrown: "投掷", Line: "线形", Cone: "锥形", Blast: "溅射", Burst: "爆发" };
const REACH_TYPES = ["Range", "Threat", "Thrown", "Line", "Cone", "Burst"];
let targetSession = null;
let lastAttackTargets = null; // 上一次攻击结束时锁定的指示物 id（排序后用逗号连接）

const targetIdsKey = () => Array.from(game.user?.targets ?? []).map(t => t.id).sort().join(",");

// 武器的射程（科技攻击用感应），返回可达格数与显示文字
function attackReach(flow) {
	const item = flow?.state?.item, actor = flow?.state?.actor;
	if (flow?.constructor?.name === "TechAttackFlow") {
		const s = actor?.system?.sensor_range;
		return Number.isFinite(s) ? { reach: s, label: `感应 ${s}` } : { reach: null, label: "" };
	}
	let ranges = [];
	try { ranges = item?.currentProfile?.()?.range ?? []; } catch { ranges = []; }
	const vals = ranges.filter(r => REACH_TYPES.includes(r.type)).map(r => Number(r.val)).filter(Number.isFinite);
	return { reach: vals.length ? Math.max(...vals) : null, label: ranges.map(r => `${RANGE_ZH[r.type] ?? r.type} ${r.val}`).join(" / ") };
}

const occupied = token => {
	try { const s = token.document.getOccupiedGridSpaceOffsets(); if (s?.length) return s; } catch { /* 旧版本没有这个方法 */ }
	return [canvas.grid.getOffset(token.center)];
};
// 两个指示物之间的格数：取双方所占格子之间最近的距离（与 LANCER 从指示物边缘量射程一致）
function tokenDistance(a, b) {
	const grid = canvas?.grid;
	if (!grid || !a || !b) return null;
	const measure = (p, q) => { const r = grid.measurePath([p, q]); return r.spaces ?? Math.round(r.distance / (grid.distance || 1)); };
	if (grid.isGridless) return measure(a.center, b.center);
	let best = Infinity;
	for (const oa of occupied(a)) for (const ob of occupied(b)) best = Math.min(best, measure(grid.getCenterPoint(oa), grid.getCenterPoint(ob)));
	return Number.isFinite(best) ? best : null;
}

// 攻击者的指示物：优先当前控制的那个
function attackerToken(actor) {
	if (!actor) return null;
	return canvas?.tokens?.controlled?.find(t => t.actor === actor) ?? actor.getActiveTokens?.(true)?.[0] ?? null;
}

// 候选目标：同场景、自己看得见的指示物，按敌方 / 中立 / 友方分组，组内按距离排序
function targetCandidates(session) {
	const D = CONST.TOKEN_DISPOSITIONS ?? { SECRET: -2, HOSTILE: -1, NEUTRAL: 0, FRIENDLY: 1 };
	const self = session.token;
	const mine = self?.document?.disposition ?? (game.user?.isGM ? D.HOSTILE : D.FRIENDLY);
	const side = disp => {
		if (disp === D.NEUTRAL || disp === D.SECRET) return "neutral";
		if (mine === D.NEUTRAL || mine === D.SECRET) return "enemy";
		return Math.sign(disp) === Math.sign(mine) ? "ally" : "enemy";
	};
	const list = (canvas?.tokens?.placeables ?? [])
		.filter(t => t !== self && t.actor && (game.user?.isGM || (t.visible && !t.document.hidden)))
		.map(t => {
			const distance = self ? tokenDistance(self, t) : null;
			return {
				token: t, id: t.id, name: t.document?.name ?? t.name, img: t.document?.texture?.src ?? t.actor.img,
				side: side(t.document?.disposition), distance,
				inRange: session.reach == null || distance == null ? null : distance <= session.reach,
				targeted: !!game.user?.targets?.has(t), last: !!session.lastIds?.includes(t.id),
			};
		});
	const order = { enemy: 0, neutral: 1, ally: 2 };
	return list.sort((x, y) => order[x.side] - order[y.side] || (x.distance ?? 999) - (y.distance ?? 999) || String(x.name).localeCompare(String(y.name)));
}

const SIDE_ZH = { enemy: "敌方", neutral: "中立", ally: "友方" };

function targetPanelHTML(session, rows) {
	const picked = rows.filter(r => r.targeted).length;
	const head = `<header><strong>${escHtml(session.title)}</strong>${session.rangeLabel ? `<span class="lcn-tp-range">${escHtml(session.rangeLabel)}</span>` : ""}
		<button type="button" data-act="collapse" title="${session.collapsed ? "展开" : "收起"}">${session.collapsed ? "▴" : "▾"}</button></header>`;
	if (session.collapsed) return head + `<p class="lcn-tp-hint">已选 ${picked} 个目标</p>`;
	const groups = ["enemy", "neutral", "ally"].map(side => {
		const list = rows.filter(r => r.side === side);
		if (!list.length) return "";
		return `<h4>${SIDE_ZH[side]}</h4><ul>${list.map(r => `<li data-token="${escHtml(r.id)}" class="${r.targeted ? "is-targeted" : ""}${r.inRange === false ? " is-out" : ""}">
			<span class="lcn-tp-check">${r.targeted ? "◉" : "○"}</span><img src="${escHtml(r.img)}" alt=""><span class="lcn-tp-name">${escHtml(r.name)}</span>
			${r.last ? '<span class="lcn-tp-badge">上次</span>' : ""}
			<span class="lcn-tp-dist">${r.distance == null ? "" : `${r.distance} 格`}${r.inRange === true ? " · 射程内" : r.inRange === false ? " · 射程外" : ""}</span></li>`).join("")}</ul>`;
	}).join("");
	return head + (groups || `<p class="lcn-tp-hint">场上没有可选的指示物。</p>`) +
		`<footer><span>已选 ${picked} 个 · 也可以直接点地图上的指示物</span><button type="button" data-act="clear"${picked ? "" : " disabled"}>清除</button></footer>`;
}

const TARGET_STYLE = `
#lancer-cn-targets { position: fixed; z-index: 100; width: 300px; max-height: 60vh; display: flex; flex-direction: column; background: rgba(20, 22, 28, 0.95);
	color: #e6e8ee; border: 1px solid #7a6a4f; border-radius: 6px; box-shadow: 0 4px 16px #000a; font-size: 13px; pointer-events: auto; }
#lancer-cn-targets header { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-bottom: 1px solid #444b58; }
#lancer-cn-targets header strong { flex: 1; color: #edc383; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#lancer-cn-targets .lcn-tp-range { font-size: 12px; color: #b6c1d3; }
#lancer-cn-targets button { width: auto; min-height: 0; height: 22px; line-height: 20px; padding: 0 8px; flex: 0 0 auto; font-size: 12px; }
#lancer-cn-targets h4 { margin: 6px 8px 2px; font-size: 12px; color: #9aa6ba; border: 0; }
#lancer-cn-targets ul { list-style: none; margin: 0; padding: 0 4px; overflow-y: auto; }
#lancer-cn-targets li { display: flex; align-items: center; gap: 6px; padding: 3px 4px; border-radius: 4px; cursor: pointer; }
#lancer-cn-targets li:hover { background: #ffffff14; }
#lancer-cn-targets li.is-targeted { background: #edc38326; }
#lancer-cn-targets li.is-out .lcn-tp-name { color: #9aa0aa; }
#lancer-cn-targets li img { width: 26px; height: 26px; object-fit: cover; border: 0; border-radius: 3px; flex: 0 0 auto; }
#lancer-cn-targets .lcn-tp-check { color: #edc383; width: 1em; }
#lancer-cn-targets .lcn-tp-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#lancer-cn-targets .lcn-tp-dist { font-size: 11px; color: #b6c1d3; white-space: nowrap; }
#lancer-cn-targets li.is-out .lcn-tp-dist { color: #e08a7a; }
#lancer-cn-targets .lcn-tp-badge { font-size: 11px; padding: 0 4px; border: 1px solid #7a6a4f; border-radius: 8px; color: #edc383; }
#lancer-cn-targets .lcn-tp-hint { margin: 6px 8px; color: #b6c1d3; }
#lancer-cn-targets footer { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-top: 1px solid #444b58; font-size: 12px; color: #b6c1d3; }
#lancer-cn-targets footer span { flex: 1; }`;

// 面板放在 LANCER 准度面板（#hudzone）左边；找不到时放在右下角侧栏旁
function placeTargetPanel(el) {
	const hud = document.getElementById("hudzone");
	const r = hud?.getBoundingClientRect?.();
	if (r && r.width) { el.style.right = `${Math.max(8, window.innerWidth - r.left + 8)}px`; el.style.bottom = `${Math.max(8, window.innerHeight - r.bottom)}px`; }
	else { el.style.right = "320px"; el.style.bottom = "10px"; }
}

function renderTargetPanel() {
	const s = targetSession;
	if (!s || typeof document === "undefined") return;
	if (!document.getElementById("lancer-cn-target-style")) {
		const st = document.createElement("style");
		st.id = "lancer-cn-target-style";
		st.textContent = TARGET_STYLE;
		document.head.append(st);
	}
	let el = document.getElementById("lancer-cn-targets");
	if (!el) {
		el = document.createElement("section");
		el.id = "lancer-cn-targets";
		el.addEventListener("click", onTargetPanelClick);
		el.addEventListener("mouseover", ev => hoverToken(ev, true));
		el.addEventListener("mouseout", ev => hoverToken(ev, false));
		document.body.append(el);
	}
	s.rows = targetCandidates(s);
	el.innerHTML = targetPanelHTML(s, s.rows);
	placeTargetPanel(el);
	// 准度面板滑入有动画，稍后再对齐一次
	setTimeout(() => document.getElementById("lancer-cn-targets") === el && placeTargetPanel(el), 400);
}

function hoverToken(ev, on) {
	const li = ev.target.closest?.("li[data-token]");
	const t = li && canvas?.tokens?.get(li.dataset.token);
	try { if (t) on ? t._onHoverIn?.(ev, { hoverOutOthers: true }) : t._onHoverOut?.(ev); } catch { /* 仅为高亮，失败不影响 */ }
}

function toggleTarget(token) {
	if (!token) return;
	token.setTarget(!game.user.targets.has(token), { releaseOthers: false });
}
function clearTargets() {
	for (const t of Array.from(game.user?.targets ?? [])) t.setTarget(false, { releaseOthers: false });
}

function onTargetPanelClick(ev) {
	const btn = ev.target.closest?.("button[data-act]");
	if (btn?.dataset.act === "clear") { clearTargets(); return; }
	if (btn?.dataset.act === "collapse") { targetSession.collapsed = !targetSession.collapsed; renderTargetPanel(); return; }
	const li = ev.target.closest?.("li[data-token]");
	if (li) toggleTarget(canvas.tokens.get(li.dataset.token));
}

function openTargetPicker(flow) {
	if (!game.settings.get(MODULE_ID, "targetPicker")) return;
	const kind = flow?.constructor?.name;
	// 从攻击卡掷伤害时目标已经确定（系统按命中结果锁定），不打扰
	if (kind === "DamageRollFlow" && flow.state?.data?.hit_results?.length) return;
	const actor = flow?.state?.actor;
	const { reach, label } = attackReach(flow);
	const attack = kind !== "DamageRollFlow";
	const session = {
		flow, kind, actor, token: attackerToken(actor), reach, rangeLabel: label, collapsed: false,
		title: `${kind === "DamageRollFlow" ? "掷伤害" : kind === "TechAttackFlow" ? "科技攻击" : "攻击"}：${flow?.state?.item?.name ?? flow?.state?.data?.title ?? "选择目标"}`,
		lastIds: lastAttackTargets ? lastAttackTargets.split(",") : [],
	};
	targetSession = session;
	if (attack) {
		// 锁定的还是上一次攻击的目标（之后没改过）：多半是忘了清，先清掉
		if (game.settings.get(MODULE_ID, "targetClearStale") && lastAttackTargets && targetIdsKey() === lastAttackTargets) clearTargets();
		// 一个目标都没有、射程内只有一个敌人：直接选上
		if (game.settings.get(MODULE_ID, "targetAutoPick") && !game.user.targets.size && reach != null) {
			const inRange = targetCandidates(session).filter(r => r.side === "enemy" && r.inRange);
			if (inRange.length === 1) toggleTarget(inRange[0].token);
		}
	}
	renderTargetPanel();
}

function closeTargetPicker(flow, success) {
	if (!targetSession || targetSession.flow !== flow) return;
	if (success && targetSession.kind !== "DamageRollFlow" && game.user?.targets?.size) lastAttackTargets = targetIdsKey();
	targetSession = null;
	if (typeof document !== "undefined") document.getElementById("lancer-cn-targets")?.remove();
}

// 面板开着时：左键点地图上的指示物 = 锁定 / 取消锁定（与六边形墙体一样在 window 捕获阶段拦截，图层收不到这次点击）
function onTargetPointer(event) {
	const s = targetSession;
	if (!s || event.type !== "pointerdown" || event.button !== 0 || event.target !== canvasView()) return;
	if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
	const p = canvas.canvasCoordinatesFromClient({ x: event.clientX, y: event.clientY });
	const hits = (canvas.tokens?.placeables ?? []).filter(t => t !== s.token && t.actor && t.visible && t.bounds?.contains?.(p.x, p.y));
	if (!hits.length) return;
	event.stopImmediatePropagation();
	event.preventDefault();
	toggleTarget(hits[hits.length - 1]); // 叠在一起时取最上面的
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	const opt = (key, name, hint) => game.settings.register(MODULE_ID, key, { name, hint, scope: "client", config: true, type: Boolean, default: true });
	opt("targetPicker", "攻击时显示目标选择面板", "开始攻击、科技攻击时，在准度面板旁列出场上的指示物（按距离排序、标出是否在射程内），点一下即可锁定；面板开着时也可以直接点地图上的指示物锁定。");
	opt("targetClearStale", "开始新攻击时清除上一次的目标", "如果锁定的仍是上一次攻击的目标（之后没有改动），开始新攻击时先清除。");
	opt("targetAutoPick", "射程内只有一个敌人时自动选中", "开始攻击时没有锁定目标、而射程内恰好只有一个敌方指示物时，自动锁定它。");
	globalThis.addEventListener?.("pointerdown", onTargetPointer, { capture: true });
	for (const name of TARGET_FLOWS) {
		Hooks.on(`lancer.preFlow.${name}`, flow => { try { openTargetPicker(flow); } catch (err) { console.error(`${MODULE_ID} |`, err); } });
		Hooks.on(`lancer.postFlow.${name}`, (flow, success) => closeTargetPicker(flow, success));
	}
});
let targetRefreshTimer = null;
const refreshTargetPanel = () => {
	if (!targetSession) return;
	clearTimeout(targetRefreshTimer);
	targetRefreshTimer = setTimeout(renderTargetPanel, 50);
};
Hooks.on("targetToken", user => { if (user?.isSelf ?? user === game.user) refreshTargetPanel(); });
for (const h of ["updateToken", "createToken", "deleteToken", "controlToken"]) Hooks.on(h, refreshTargetPanel);

// ---------------------------------------------------------------------------
// 命中后一键施加状态：攻击 / 科技攻击的聊天卡下方，按攻击所用物品的命中效果文字列出可施加的状态按钮，
// 点击后施加到这次被命中（含会心一击）的目标；聊天卡没有目标时用当前选中的目标。
// LANCER 系统本身不会施加命中效果里的状态（其代码中为 TODO）。是否满足豁免等条件由玩家与 GM 判断。
// 没有目标角色权限时（玩家打 GM 的 NPC），通过模组 socket 请在线的 GM 施加。
const STATUS_WORDS = [
	["固定", "immobilized"], ["受损", "impaired"], ["受扰", "jammed"], ["锁定", "lockon"], ["离散", "shredded"],
	["缓慢", "slow"], ["晕眩", "stunned"], ["暴露", "exposed"], ["伏卧", "prone"],
	["Immobilized", "immobilized"], ["Impaired", "impaired"], ["Jammed", "jammed"], ["Lock On", "lockon"], ["Shredded", "shredded"],
	["Slowed", "slow"], ["Stunned", "stunned"], ["Exposed", "exposed"], ["Prone", "prone"],
];
const STATUS_LABEL = { immobilized: "固定", impaired: "受损", jammed: "受扰", lockon: "锁定", shredded: "离散", slow: "缓慢", stunned: "晕眩", exposed: "暴露", prone: "伏卧" };
// 不是施加给目标的写法：
// - 消耗 / 移除锁定、免疫缓慢、无法……
// - 作为条件：「若目标被锁定」「攻击处于伏卧的角色」「具有锁定」
// - 给自己：「你陷入缓慢」「你会缓慢」
// - 列举状况：「伏卧、固定或晕眩」
// - 「可以在受扰下使用」「锁定该武器」「被锁定的所有敌方角色」
const STATUS_NOT_BEFORE = [
	/(消耗|移除|清除|解除|结束|免疫|不会|不能|无法|不再|失去|具有|处于|对)\S{0,2}$/,
	/(若|如果)[^，。；]{0,3}被?$/,
	/你(会|将|也)?(陷入|变得)?$/,
	/[、或]$/,
	/(consume|remove|clear|immune|against|while)\s*\S{0,6}$/i,
];
const STATUS_NOT_AFTER = /^(该武器|这把武器|武器|模式|状态的|的|、|或|角色|目标时|下|时(也|仍)?可?以?使用|时也)/;
// 武器效果说明里，只看与命中、豁免或目标有关的句子（其余多是武器本身的规则）
const TARGET_SENTENCE = /(命中|会心|豁免|目标|hit|crit|save|target)/i;

function statusesIn(text, { strict = false } = {}) {
	const plain = String(text || "").replace(/<[^>]+>/g, "");
	// 针对「攻击者」的句子（如未命中你的攻击者伏卧）不是给这次攻击的目标的
	const sentences = strict ? plain.split(/[。；;\n]/).filter(s => TARGET_SENTENCE.test(s) && !/攻击者|attacker/i.test(s)) : [plain];
	const found = [];
	for (const sentence of sentences) for (const [word, id] of STATUS_WORDS) {
		if (found.includes(id)) continue;
		let i = sentence.indexOf(word);
		while (i >= 0) {
			const before = sentence.slice(Math.max(0, i - 6), i), after = sentence.slice(i + word.length, i + word.length + 4);
			// 「锁定」也常作动词或描述（「扫描目标锁定」「当锁定时」），只认「被 / 施加 / 进行 / 获得锁定」
			const lockOk = id !== "lockon" || /(被|施加|进行|获得|陷入|Lock On)\s*$/i.test(before + (word === "Lock On" ? word : ""));
			if (lockOk && !STATUS_NOT_BEFORE.some(re => re.test(before)) && !STATUS_NOT_AFTER.test(after)) { found.push(id); break; }
			i = sentence.indexOf(word, i + word.length);
		}
	}
	return found;
}

// 攻击所用物品的效果文字：命中 / 会心效果整段都看；一般效果说明只看与命中、豁免、目标有关的句子
function attackTexts(item) {
	const s = item?.system;
	if (!s) return [];
	const profile = s.active_profile ?? s.profiles?.[s.selected_profile_index ?? 0];
	const out = [];
	for (const o of [profile, s]) {
		for (const f of ["on_hit", "on_crit"]) if (o?.[f]) out.push({ text: o[f], strict: false });
		for (const f of ["effect", "on_attack"]) if (o?.[f]) out.push({ text: o[f], strict: true });
	}
	for (const a of s.actions ?? []) if (a.detail) out.push({ text: a.detail, strict: true });
	return out.filter(t => typeof t.text === "string" && t.text.trim());
}

async function applyStatusTo(tokenUuid, status) {
	const token = fromUuidSync(tokenUuid);
	const actor = token?.actor;
	if (!actor) return false;
	if (actor.isOwner) {
		if (!actor.statuses?.has(status)) await actor.toggleStatusEffect(status, { active: true });
		return true;
	}
	if (!game.users?.activeGM) { ui.notifications.warn("没有在线的 GM，无法对不属于你的角色施加状态。"); return false; }
	game.socket.emit(`module.${MODULE_ID}`, { action: "applyStatus", uuid: tokenUuid, status });
	return true;
}

function statusButtonsHTML(statuses) {
	const btn = id => `<button type="button" data-lancer-cn-status="${id}" style="flex:0 0 auto;width:auto;line-height:1.6;padding:0 .6em;margin:0">${STATUS_LABEL[id]}</button>`;
	return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)"><span>命中效果 · 施加：</span>${statuses.map(btn).join("")}</div>`;
}

function onRenderChatMessage(message, html) {
	const root = html instanceof HTMLElement ? html : html?.[0];
	if (!root || root.querySelector(".lancer-cn-status-row")) return;
	const attack = message.getFlag?.("lancer", "attackData");
	if (!attack) return;
	if (!(game.user?.isGM || message.isAuthor)) return;
	const item = attack.attackerItemUuid ? fromUuidSync(attack.attackerItemUuid) : null;
	const statuses = [];
	for (const t of attackTexts(item)) for (const id of statusesIn(t.text, { strict: t.strict })) if (!statuses.includes(id)) statuses.push(id);
	if (!statuses.length) return;
	const content = root.querySelector(".message-content") ?? root;
	content.insertAdjacentHTML("beforeend", statusButtonsHTML(statuses));
	content.querySelector(".lancer-cn-status-row").addEventListener("click", async ev => {
		const status = ev.target.closest?.("[data-lancer-cn-status]")?.dataset.lancerCnStatus;
		if (!status) return;
		const hit = (attack.targets ?? []).filter(t => t.hit || t.crit).map(t => t.uuid);
		const uuids = attack.targets?.length ? hit : [...(game.user?.targets ?? [])].map(t => t.document.uuid);
		if (!uuids.length) return ui.notifications.warn(attack.targets?.length ? "这次攻击没有命中任何目标。" : "请先选中要施加状态的目标。");
		let n = 0;
		for (const uuid of uuids) if (await applyStatusTo(uuid, status)) n++;
		if (n) ui.notifications.info(`已对 ${n} 个目标施加「${STATUS_LABEL[status]}」。`);
	});
}

Hooks.on("renderChatMessageHTML", onRenderChatMessage);
Hooks.once("ready", () => {
	if (game.system?.id !== "lancer") return;
	game.socket?.on(`module.${MODULE_ID}`, async msg => {
		if (msg?.action !== "applyStatus" || !game.users?.activeGM?.isSelf || !STATUS_LABEL[msg.status]) return;
		const actor = fromUuidSync(msg.uuid)?.actor;
		if (actor && !actor.statuses?.has(msg.status)) await actor.toggleStatusEffect(msg.status, { active: true });
	});
});

globalThis.LancerCN = { translate, walk, importReference, REFERENCE, coverFor, applyCover, defineCoverBehavior, hexWallData, setHexWall, setCoverCell, coverCellHas, PAINT_TOOLS, statusesIn, attackTexts, onRenderChatMessage, attackReach, tokenDistance, targetCandidates, targetPanelHTML, openTargetPicker, closeTargetPicker, onTargetPointer, targetSession: () => targetSession };

// 中文界面的版面修正。系统样式都在 @layer lancer 里，这里不分层，优先级自然更高。
// - 伤害面板：伤害类型下拉框原本固定 12ch 宽（按英文 Explosive 定），中文只需约 5em，省下的宽度给数值框（原来会被挤成「1(」）。
// - 命中 / 会心 / 未命中：中文标签不换行，三项排在一行（「未命中」原来会折成两行）。
const UI_FIX_STYLE = `
.damage-input-container { grid-template-columns: min-content minmax(4em, 4.8em) minmax(4em, 1fr) min-content; column-gap: 2px; }
.damage-input-container .damage-input-type { width: 100%; min-width: 0; }
.damage-input-container .damage-input-val { width: 100%; min-width: 4em; padding: 0 2px; text-align: center; }
.lancer-hit-quality-radio { flex-wrap: nowrap; gap: 0.2em; }
.lancer-hit-quality-radio-label { white-space: nowrap; }
.damage-hud-target-card .lancer-hit-quality-radio-label { font-size: 0.92em; }
.damage-hud-target-card .target-bonus-damage { min-width: 0; }`;

function injectStyle(id, css) {
	if (typeof document === "undefined" || document.getElementById(id)) return;
	const st = document.createElement("style");
	st.id = id;
	st.textContent = css;
	document.head.append(st);
}

// 只在界面语言为中文（cn）时启用；语言要在 i18nInit 之后才确定
Hooks.once("i18nInit", () => {
	if (game.system?.id !== "lancer" || game.i18n?.lang !== "cn") return;
	injectStyle("lancer-cn-ui-fix", UI_FIX_STYLE);
	patchScrollingText();
	walk(document.body);
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
		attributes: true,
		attributeFilter: ATTRS,
	});
});
