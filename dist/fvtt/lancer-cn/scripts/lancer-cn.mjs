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
async function updateMechFrameArt(actor, changes, userId) {
	if (userId !== game.user?.id || actor.type !== "mech") return;
	if (!foundry.utils.hasProperty(changes, "system.loadout.frame")) return;
	const frame = actor.system.loadout?.frame?.value ?? actor.items.find(i => i.type === "frame");
	const art = artFor(frame);
	if (!art) return;
	const update = {};
	if (replaceable(actor.img) && actor.img !== art) update.img = art;
	const token = actor.prototypeToken?.texture?.src;
	if (replaceable(token) && token !== art) update["prototypeToken.texture.src"] = art;
	if (Object.keys(update).length) await actor.update(update);
}

// 驾驶员从车卡器 / COMP/CON 导入后（importCC 更新 last_cloud_update）：
// 1) 清理上游 import.ts 先 insinuate([frame]) 再重复 insinuate 内建装备产生的未装备重复副本；
// 2) 补满上游 import.ts 因以 weapon.id 作键漏写 uses 导致初始为 0 的受限武器改装充能。
async function cleanupPilotImportedMechs(actor, changes, userId) {
	if (userId !== globalThis.game?.user?.id || actor?.type !== "pilot") return;
	if (!foundry?.utils?.hasProperty?.(changes, "system.last_cloud_update")) return;
	for (const mech of globalThis.game?.actors ?? []) {
		if (mech?.type !== "mech") continue;
		const canModify = typeof mech.canUserModify === "function"
			? mech.canUserModify(globalThis.game.user, "update")
			: Boolean(mech.isOwner);
		if (!canModify) continue;
		const pRef = mech.system?.pilot?.value ?? mech.system?.pilot;
		if (pRef !== actor && pRef?.id !== actor.id && mech.system?.pilot !== actor.uuid) continue;
		const frameObj = mech.system?.loadout?.frame?.value ?? (mech.items ?? []).find?.(i => i?.type === "frame");
		const frameIntegratedLids = new Set(frameObj?.system?.core_system?.integrated ?? []);
		const equippedIds = new Set();
		const equippedLids = new Set();
		const modRepairs = [];
		if (mech.system?.loadout?.frame?.id) equippedIds.add(mech.system.loadout.frame.id);
		for (const sRef of mech.system?.loadout?.systems ?? []) {
			const sysItem = sRef?.value ?? mech.items?.get?.(sRef?.id ?? sRef);
			if (sysItem?.id) {
				equippedIds.add(sysItem.id);
				if (sysItem.system?.lid) equippedLids.add(sysItem.system.lid);
			}
		}
		for (const mt of mech.system?.loadout?.weapon_mounts ?? []) {
			for (const sl of mt?.slots ?? []) {
				const wItem = sl?.weapon?.value ?? (sl?.weapon ? mech.items?.get?.(sl.weapon?.id ?? sl.weapon) : null);
				if (wItem?.id) {
					equippedIds.add(wItem.id);
					if (wItem.system?.lid) equippedLids.add(wItem.system.lid);
				}
				const mItem = sl?.mod?.value ?? (sl?.mod ? mech.items?.get?.(sl.mod?.id ?? sl.mod) : null);
				if (mItem?.id) {
					equippedIds.add(mItem.id);
					const uVal = Number(mItem.system?.uses?.value);
					const uMax = Number(mItem.system?.uses?.max);
					if (uVal === 0 && uMax > 0) modRepairs.push({ _id: mItem.id, item: mItem, usesMax: uMax });
				}
			}
		}
		const dupIds = [];
		for (const it of mech.items ?? []) {
			if (!it?.id || equippedIds.has(it.id)) continue;
			if ((it.type === "mech_weapon" || it.type === "mech_system") && it.system?.lid && frameIntegratedLids.has(it.system.lid) && equippedLids.has(it.system.lid)) {
				dupIds.push(it.id);
			}
		}
		if (modRepairs.length) {
			if (typeof mech.updateEmbeddedDocuments === "function") {
				await mech.updateEmbeddedDocuments("Item", modRepairs.map(r => ({ _id: r._id, "system.uses.value": r.usesMax })));
			} else {
				for (const r of modRepairs) await r.item.update?.({ "system.uses.value": r.usesMax });
			}
		}
		if (dupIds.length) await mech.deleteEmbeddedDocuments?.("Item", dupIds);
	}
}

Hooks.on("updateActor", async (actor, changes, options, userId) => {
	onSensorActorUpdate(actor);
	if (changes?.flags?.[MODULE_ID] && "thrownWeapons" in changes.flags[MODULE_ID] && actor?.sheet?.rendered) {
		try { actor.sheet.render(false); } catch { /* ignore */ }
	}
	await updateMechFrameArt(actor, changes, userId);
	await cleanupPilotImportedMechs(actor, changes, userId).catch(err => reportError("清理导入机甲重复内建装备", err));
	await onUpdateActorStatus(actor, changes, options, userId).catch(err => reportError("自动状态", err));
	await onCoverAuraActorUpdate(actor, changes).catch(err => reportError("跟随掩护圈同步", err));
});

// ---------------------------------------------------------------------------
// 系统模板与代码里写死的英文（不经语言文件）：显示时按词典换成中文。
// 只改显示出来的文字节点和提示属性，不改输入框、富文本编辑区和文档数据。
// 词典由 tools/build-fvtt-module.js 从 cn-hardcoded.json、cn-words.json 生成：
//   exact    整段文字完全相同才替换
//   patterns 含 {x} 的句式，{x} 依次代入原文中的对应部分（{1}、{2} 可调换顺序）
//   words    枚举词（尺寸、类型、动作等），整段只由这些词组成时逐词替换，也用于翻译 {x} 代入的部分
//   context  只在特定界面里使用的译法（CSS 选择器 → 词典）

const HARDCODED = {"exact":{"(Optional) Manually adjust numeric stats for any special customizations you want to apply. For NPCs, you would do this by editing the actor's NPC Class item. For PC mechs, you can do this by editing their Frame item from the mech's Inventory.":"（可选）手动调整数值，以应用特殊的定制。NPC 通过编辑该角色的 NPC 职业物品调整；PC 机甲通过机甲物品栏中的骨架物品调整。",", and other information about how to use the system.":"，以及系统使用方法的其他说明。","// ACTIVE":"// 主动","// Bonuses":"// 加值","// CORE SYSTEM":"// 核心系统","// PASSIVE":"// 被动","// TECH //":"// 科技 //","// TECH ATTACK //":"// 科技攻击 //","// Quick TECH //":"// 快速科技 //","// Quick TECH ATTACK //":"// 快速科技攻击 //","// Full TECH //":"// 完整科技 //","// Full TECH ATTACK //":"// 完整科技攻击 //","ACCURACY":"准度","ACTION ID":"动作 ID","ACTION NAME":"动作名称","ACTIONS":"动作","ACTIVATE":"激活","ACTIVATIONS":"激活次数","ACTIVE":"主动","ADDED ACTIONS":"附加动作","ADDED DAMAGE":"附加伤害","ADDED DEPLOYABLES":"附加部署物","ADDED RANGE":"附加射程","ADDED TAGS":"附加标签","AGI":"敏捷","ARMOR":"装甲","ATTACK BONUS":"攻击加值","AUTHOR":"作者","AUX/AUX":"副/副","AVAILABLE":"可用","AVAILABLE WEAPON MOUNTS":"可用武器挂载点","Accuracy":"准度","Accuracy and Difficulty":"准度与难度","Accurate (+1)":"精准（+1）","Action":"动作","Action Editing":"编辑动作","Add a base damage type":"添加基础伤害类型","Add a bonus damage type":"添加额外伤害类型","Add a bonus damage type for only this target":"添加仅对该目标生效的额外伤害类型","Add global accuracy":"添加全局准度","Add global difficulty":"添加全局难度","Add new base damage type":"添加新的基础伤害类型","Agility":"敏捷","Allowed Sizes":"允许的武器尺寸","Allowed Types":"允许的武器类型","Apply damage":"施加伤害","Armor":"护甲","Armor Piercing":"穿甲","Armor Piercing (AP)":"穿甲（AP）","Attack Bonus":"攻击加值","Attack bonus":"攻击加值","Author":"作者","Available and Installed Content":"可用与已安装的内容","BASE ACTIONS":"基础动作","BASE FEATURE":"基础特性","BASE FEATURES":"基础特性","BASIC ATTACK":"基础攻击","BONUS":"额外","BURN :: ENG":"燃烧 :: 工程","BURN CLEARED!":"燃烧已清除！","Base Damage":"基础伤害","Basic Workflows":"基本流程","Bonus":"额外","Bonus Damage":"额外伤害","Bonus Editing":"编辑加值","Boon XP from another PC.":"来自其他 PC 的恩惠经验。","Browse":"浏览","Bug reports and enhancement suggestions":"问题报告与改进建议","Burn Damage":"燃烧伤害","Burn flow requires the actor to have a token in the scene":"燃烧流程需要该角色在场景中有指示物","CASCADE":"崩溃","CASCADE CHECK":"崩溃检定","CHANGELOG":"更新日志","CHARGED":"已充能","CLASS":"职业","CONSUMABLE":"消耗品","CORE":"核心","COST":"消耗","COUNTERS":"计数器","CURRENT":"当前","Cancel":"取消","Cannot Be Reduced":"不可降低","Cannot Create Actors":"无法创建角色","Cannot Migrate This World":"无法迁移此世界","Cannot be Reduced":"不可降低","Cannot fire a weapon on a non-piloted mech!":"无人驾驶的机甲不能使用武器！","Cannot use a system on a non-piloted mech!":"无人驾驶的机甲不能使用系统！","Cannot use a talent without an active mech!":"没有启用中的机甲，无法使用天赋！","Check out the project wiki for":"项目维基提供了","Clear All":"全部清除","Clear Ally Condition":"清除盟友状况","Clear Burn":"清除燃烧","Clear Compendium Data":"清除合集包数据","Clear Compendiums":"清除合集包","Clear LANCER Compendium Data":"清除 LANCER 合集包数据","Clear Own Condition":"清除自身状况","Clearing all LANCER Compendium data. Please wait.":"正在清除所有 LANCER 合集包数据，请稍候。","Close":"关闭","Configuration":"设置","Confirm":"确认","Consume Lock On (+1)":"消耗锁定（+1）","Contents:":"内容：","Cool Mech":"冷却机甲","Core Bonuses":"核心奖励","Core Data has not been built yet":"核心数据尚未生成","Could not find character to import! No share code entered.":"找不到要导入的角色！未输入分享码。","Could not infer action type":"无法判断动作类型","Counter Editing":"编辑计数器","Crit":"会心","Custom Skill":"自定义技能触发","DAMAGE":"伤害","DAMAGE TYPES":"伤害类型","DEACTIVATE":"停用","DELETE":"删除","DEPLOYABLES":"部署物","DEPRECATED":"已弃用","DESCRIPTION":"说明","DETAILS":"详情","DROP HERE":"拖放到此处","DROP NPC FEATURES HERE":"将 NPC 特性拖放到此处","Damage":"伤害","Damage Roll":"伤害掷骰","Decrease flat bonus":"减少固定加值","Delete Document":"删除条目","Difficulty":"难度","Drag items from the relevant compendiums, such as Mech frames or NPC Features.":"从相应的合集包拖入物品，例如机甲骨架或 NPC 特性。","E-DEF":"电子防御","E-DEFENSE":"电子防御","E-Defense":"电子防御","EFFECT":"效果","EFFICIENCY":"效率","ENG":"工程","ENGINEERING":"工程","EVASION":"回避","Edit":"编辑","Edit Bonus:":"编辑加值：","Edit Field:":"编辑字段：","Edit Text":"编辑文字","Effect":"效果","Empty":"空","Enemy Unknown":"未知敌军","Engaged (-1)":"交战（-1）","Engineering":"工程","Equip armor":"装上护甲","Equip gear":"装上装备","Equip reserve":"装上储备","Equip weapon":"装上武器","Equipment Destruction":"装备摧毁","Error importing from V2 share code. V2 share codes may no longer work, or this share code may need to be refreshed.":"从 V2 分享码导入时出错。V2 分享码可能已失效，或需要刷新该分享码。","Error importing from V3 share code.":"从 V3 分享码导入时出错。","Error rolling tech attack macro (not a valid tech attacker).":"科技攻击宏出错（该角色不能进行科技攻击）。","Evasion":"回避","Export":"导出","Exporting for this version of actor is currently unsupported.":"目前不支持导出此版本的角色。","Exporting ran into an issue, or actor type is not supported.":"导出时出现问题，或不支持该角色类型。","Exposed":"暴露","FAQ":"常见问题","FEATURE TYPE:":"特性类型：","FLEX":"灵活","FREQUENCY":"频率","FULL":"完整动作","FULL REPAIR":"全面维修","Filter Ignore:":"筛选时忽略：","First, make sure you have your LANCER data imported properly via the compendium manager in the \"Compendiums\" tab. If you have non-core content you want to use in your game, this would be the place to do it as well.":"首先，在「合集包」标签页中通过内容包管理器正确导入 LANCER 数据。如果要在游戏中使用核心以外的内容，也在这里导入。","Flat Modifier":"固定调整值","Flat attack bonus":"固定攻击加值","For 'cannot be reduced' effects like the Paracausal mod":"用于「不可降低」的效果，例如非因果律模块","For effects which cause the attacker to deal half damage in addition to resistance, like Heavy Gunner":"用于在抗性之外还让攻击者伤害减半的效果，例如重炮手","Frames":"骨架","Frequency:":"频率：","Full Action":"完整动作","Gear":"装备","Global Accuracy/Difficulty Adjustment":"全局准度／难度调整","HEAT":"热度","HEAT CAP":"热度上限","HEAT COST":"热度消耗","HEAVY":"重型","HISTORY":"经历","HP":"HP","HULL":"机体","Half Damage":"伤害减半","Hard Cover (-2)":"硬性掩护（-2）","Heat Cap":"热度上限","Helpful Links":"实用链接","Hidden:":"隐藏：","Hit":"命中","Hull":"机体","ID":"ID","ID:":"ID：","INFLUENCE":"影响力","INIT":"前提","INTEGRATED":"内建","INTEGRATED GEAR":"内建装备","INTEGRATED ITEMS":"内建物品","INVADE":"入侵","IS TECH ATTACK?":"是否为科技攻击？","Icon Preview":"图标预览","Impaired (-1)":"受损（-1）","Import From File":"从文件导入","Import LCP":"导入内容包","Import Selected Loadout":"导入所选配装","Import all necessary LCPs first using the":"请先导入所有需要的内容包，使用","Import/Update LCP":"导入／更新内容包","Import/Update Selected":"导入／更新所选","Imported LCPs":"已导入的内容包","Importing character from V2 share code...":"正在从 V2 分享码导入角色……","Importing character from V3 share code...":"正在从 V3 分享码导入角色……","Inaccurate (-1)":"不准（-1）","Incomplete Pilot Import":"驾驶员导入不完整","Increase accuracy":"增加准度","Increase difficulty":"增加难度","Increase flat bonus":"增加固定加值","Innate Accuracy/Difficulty":"固有准度／难度","Installed LCPs":"已安装的内容包","Invalid Stabilize choice!":"无效的稳住阵脚选项！","Key:":"键：","LANCER Compendium Manager":"LANCER 内容包管理器","LANCER Compendiums cleared.":"LANCER 合集包已清除。","LANCER Help":"LANCER 帮助","LID":"LID","LID:":"LID：","LOADED":"已装填","LOCKED: BRACING":"锁定：副挂载占用","Lancer Compendium Manager":"LANCER 内容包管理器","Lancer Condition Icons is Integrated":"Lancer Condition Icons 已整合进系统","Lancer Core Book Data":"LANCER 核心规则书数据","Lancer Data Version":"LANCER 数据版本","Lancer Initiative":"Lancer Initiative","Lancer Initiative Module is not Needed":"不需要 Lancer Initiative 模组","Licenses":"牌照","Loading data, please wait…":"正在载入数据，请稍候…","Lock On (+1)":"锁定（+1）","MAIN":"主","MAIN/AUX":"主/副","MAJOR IDEALS":"主要理想","MAX HP":"HP 上限","MINOR IDEALS":"次要理想","MOUNTED EFFECT":"挂载效果","MOUNTED SYSTEMS":"已装备系统","MOUNTED WEAPONS":"已挂载武器","MY SHACKLES LOOSE, MY CHAINS UNBOUND!":"吾之枷锁已松，吾之锁链已断！","Manual Adjust":"手动调整","Manufacturer":"厂商","Mark Destroyed":"标记为已摧毁","Mark Repaired":"标记为已修复","Master:":"大师：","Max HP":"HP 上限","Max:":"上限：","Mech has cleared all burn.":"机甲已清除全部燃烧。","Mech has no repairs left. Please try again.":"机甲没有剩余维修次数。请重新选择。","Mech has selected full reload. Weapons reloaded:":"机甲选择了全面装填。已装填武器：","Mech has selected to clear an allied condition. Please clear manually.":"机甲选择了清除盟友状况，请手动清除。","Mech has selected to clear own condition. Please clear manually.":"机甲选择了清除自身状况，请手动清除。","Mech has spent 1 repair to regain HP.":"机甲消耗了 1 点维修以回满 HP。","Mech is cooling itself. Heat and":"机甲正在散热：热度与","cleared.":"已清除。","Min:":"下限：","Miss":"未命中","Mods":"改装","Movement":"移动","Multiple pilot loadouts found. Please select a single loadout to import and use:":"找到多套驾驶员配装。请选择一套导入使用：","NOTES":"备注","NPC classes":"NPC 职业","NPC features":"NPC 特性","NPC templates":"NPC 模板","NPC → Deployable Bonuses":"NPC → 部署物加值","Name":"名称","New Counter":"新计数器","New Power":"新能力","New Rank":"新等级","New Trait":"新特征","New action":"新动作","Next, go to the Actors tab and create any PCs you want to use. You can either import from COMP/CON using the RM-4://SYNC tab, or manually build it out yourself. NPCs have to be manually built out for now.":"然后到「角色」标签页创建要用的 PC。可以在 RM-4://SYNC 标签页从伙伴/礼宾导入，也可以自己手动建立。NPC 目前只能手动建立。","No":"否","No Cover":"无掩护","No License":"无牌照","No Mod Installed":"未安装改装","No core power remaining on this frame!":"该骨架的核心能力已用完！","No damage configured, skipping the roll.":"未设置伤害，跳过掷骰。","No repairs remaining!":"没有剩余维修次数！","No source specified":"未指定来源","No target for damage application":"没有施加伤害的目标","Non-NPC cannot fire an NPC weapon!":"非 NPC 不能使用 NPC 武器！","Non-NPC cannot use an NPC system!":"非 NPC 不能使用 NPC 系统！","Non-mech cannot fire a mech weapon!":"非机甲不能使用机甲武器！","Non-mech cannot use a mech system!":"非机甲不能使用机甲系统！","Non-pilot cannot fire a pilot weapon!":"非驾驶员不能使用驾驶员武器！","Non-pilot cannot use a pilot talent!":"非驾驶员不能使用驾驶员天赋！","ON ATTACK":"攻击时","ON CRIT":"会心一击时","ON HIT":"命中时","ON HIT EFFECT":"命中效果","OPTION 1":"选项 1","OPTION 2":"选项 2","OPTIONAL FEATURE":"可选特性","OPTIONAL FEATURES":"可选特性","OTHER":"其他","OUR SHACKLES LOOSE, OUR CHAINS UNBOUND!":"吾等枷锁已松，吾等锁链已断！","Official LANCER Content":"官方 LANCER 内容","On a 1–3, all weapons on one mount of your choice are destroyed":"1–3：选择一个挂载点，其上的所有武器被摧毁","On a 4–6, a system of your choice is destroyed":"4–6：选择一个系统，将其摧毁","Only GM can modify the Compendiums.":"只有 GM 能修改合集包。","Only Mechs and NPCs can take stress damage":"只有机甲和 NPC 会受到压力伤害","Only Mechs and NPCs can take structure damage":"只有机甲和 NPC 会受到结构伤害","Only NPCs can recharge!":"只有 NPC 能充能！","Only mechs and NPCs can tech attack!":"只有机甲和 NPC 能进行科技攻击！","Only mechs can cascade.":"只有机甲会崩溃。","Only mechs can overcharge!":"只有机甲能超频！","Only npcs and mechs can roll overheat.":"只有 NPC 和机甲能进行过热检定。","Only npcs and mechs can roll structure.":"只有 NPC 和机甲能进行结构检定。","Only npcs and mechs can roll structure/overheat.":"只有 NPC 和机甲能进行结构／过热检定。","Organizations":"组织","Origin Name":"来源名称","Overheat":"过热","Overkill":"杀绝","Overwrite":"覆盖","PASSIVE":"被动","POWERS":"能力","PROFILE ACTIONS":"数据组动作","PROTOCOL":"协议","PURPOSE":"宗旨","Pilot → Deployable Bonuses":"驾驶员 → 部署物加值","Pilot → Mech Bonuses":"驾驶员 → 机甲加值","PilotNET Community on Discord":"PilotNET Discord 社区","Please select your two Stabilize actions":"请选择稳住阵脚的两项效果","Please update the Core data before importing LCPs.":"导入内容包前请先更新核心数据。","Powered by Lancer":"Powered by Lancer","Prerequisite":"前置条件","Primary":"主配装","Prone (+1)":"伏卧（+1）","Protocol":"协议","QUESTIONS":"问题","QUICK":"快速动作","Quick Action":"快速动作","RANGE":"射程","RANGES TYPES":"射程类型","RANK:":"等级：","REACTION":"反应","REACTION INIT":"反应前提","REACTION TRIGGER":"反应触发","RECALL":"召回","REDEPLOY":"重新部署","REPAIRS":"维修","RESOURCE LABEL":"资源标签","ROLL DAMAGE":"掷伤害","Rank":"等级","Reaction":"反应","Rebuild Core Data":"重建核心数据","Recharge":"充能","Refresh":"刷新","Refresh Powers":"刷新能力","Reliable":"可靠","Reload":"重新装填","Remove":"移除","Remove this damage type":"移除此伤害类型","Rename":"重命名","Replace":"替换","Reserves":"储备","Reset":"重置","Resist":"抗性","Restore HP":"恢复 HP","Restore a backup of this world and":"请恢复此世界的备份，并","Roll":"掷骰","Roll a basic attack":"进行基础攻击","Roll a burn check and generate damage":"进行燃烧检定并产生伤害","Roll an attack with this system":"用此系统进行攻击","Roll an attack with this weapon":"用此武器进行攻击","Roll damage for this weapon without attacking":"不攻击，直接掷此武器的伤害","SAVE":"豁免","SENSORS":"感应","SIZE":"大小","SOURCE":"来源","SPEED":"速度","STATUS":"状态","STRESS":"压力","STRUCTURE":"结构","SUPERHEAVY":"超重型","SYNERGIES":"协同效果","SYS":"系统","SYS POINTS":"SP","SYSTEM":"系统","SYSTEMS":"系统","Save":"保存","Save Target":"豁免目标","Scan":"扫描","Seeking (*)":"导引（*）","Select LCP file":"选择内容包文件","Select Pilot Loadout":"选择驾驶员配装","Select damage multiplier":"选择伤害倍率","Selected LCPs":"所选内容包","Selected Official Sources":"所选官方内容","Sensor Range":"感应","Skills":"技能触发","Smart (*)":"智慧（*）","Soft Cover (-1)":"软性掩护（-1）","Speed":"速度","Stabilize":"稳住阵脚","Standard Move":"标准移动","Standard Profile":"标准数据组","Statuses":"状态","Stress":"压力","Stress Damage":"压力伤害","Structure":"结构","Structure Damage":"结构伤害","Stunned":"晕眩","Submit":"提交","Successfully loaded pilot new state.":"已载入驾驶员的新状态。","Suggested Modules":"推荐模组","Superheavy Bracing":"超重型副挂载占用","System Destruction":"系统摧毁","System Migration Version":"系统迁移版本","Systems":"系统","TACTICS":"战术","TAG":"标签","TAG META INFO":"标签元信息","TAGS":"标签","TEAR OFF":"撕下部件","TECH":"科技","TECH ATK":"科技攻击","TECH ATTACK":"科技攻击","TECH ATTACK?":"科技攻击？","TECH ATTACKS":"科技攻击","TEMPLATE":"模板","TERSE DESCRIPTION":"简述","TITLE":"标题","TODO: Reset the weapons":"重置挂载武器功能暂未实装","TRAIT":"特征","TRAITS":"特征","TRIGGER":"触发","TYPE":"类型","Tag Editing":"编辑标签","Tags":"标签","Talents":"天赋","Tally XP":"统计经验","Targeting":"瞄准","The":"","The following Actors could not be created or updated:":"以下角色无法创建或更新：","The following Items were not found in the compendium and could not be imported:":"以下物品在合集包中找不到，无法导入：","The icons and functionality from Lancer Condition Icons has been integrated with the system, and your settings have been migrated. Lancer Condition Icons will now be disabled, and you can feel free to uninstall it if no other worlds are using it.":"Lancer Condition Icons 的图标和功能已整合进系统，设置也已迁移。Lancer Condition Icons 现在会被停用；如果其他世界没有用到，可以把它卸载。","The mech is at full Stress, no overheat check to roll.":"机甲压力已满，无需进行过热检定。","The mech is at full Structure, no structure check to roll.":"机甲结构已满，无需进行结构检定。","The module has been disabled.":"该模组已停用。","The page must now be refreshed for the module change to take effect.":"需要刷新页面，模组的变更才会生效。","The shackles remain intact, for now.":"枷锁暂时完好无损。","The targeted token has no associated actor.":"选为目标的指示物没有关联角色。","This LCP contains:":"此内容包包含：","This row is bonus damage":"此行为额外伤害","Thrown (*)":"投掷（*）","To manually build out an actor, there are two steps:":"手动建立角色分两步：","Token has hp remaining. No need to roll structure.":"指示物还有剩余 HP，无需进行结构检定。","Token is not at heat cap. No need to roll stress.":"指示物热度未达上限，无需进行压力检定。","Total":"合计","Total:":"合计：","Trying to access tokens from a different scene!":"正在访问另一场景的指示物！","UNKNOWN":"未知","UNKNOWN ACTION":"未知动作","UNKNOWN EXOTIC SYSTEM":"未知异种系统","UNKNOWN EXOTIC TECH ATTACK":"未知异种科技攻击","UNKNOWN EXOTIC TRAIT":"未知异种特征","UNKNOWN EXOTIC WEAPON":"未知异种武器","UNKNOWN MECH":"未知机甲","UNLOCKED RANK:":"已解锁等级：","USE":"使用","USES":"次数","USES:":"次数：","Undo this damage":"撤销此伤害","Unlink":"取消关联","Unnamed Organization":"未命名组织","Unnamed Reserve":"未命名储备","Unselect File":"取消选择文件","Update Core Data":"更新核心数据","Uses":"次数","Value":"数值","Value:":"数值：","Version":"版本","Veteran:":"老手：","View Inventory":"查看物品栏","WEAPON":"武器","WEAPON SIZES":"武器尺寸","WEAPON TYPES":"武器类型","WEAPONS":"武器","Weapon Destruction":"武器摧毁","Weapons":"武器","XP":"经验","Yes":"是","You are not permitted to create actors and no GM's are online, so sync will not produce any new mechs or deployables.":"你没有创建角色的权限，且没有 GM 在线，因此同步不会产生新的机甲或部署物。","You can only scan NPC actors.":"只能扫描 NPC。","You cannot apply damage to an actor you do not own":"你不能对不属于你的角色施加伤害","You cannot undo damage to an actor you do not own":"你不能撤销不属于你的角色受到的伤害","You must enter a Comp/Con pilot share code before downloading!":"下载前必须输入伙伴/礼宾的驾驶员分享码！","You must import the Core Book Data in the Lancer Compendium Manager before importing a pilot.":"导入驾驶员前，必须先在 LANCER 内容包管理器中导入核心规则书数据。","You must select an LCP file before importing.":"导入前必须先选择内容包文件。","You must target a token to scan.":"必须先选定一个指示物作为扫描目标。","Your GM can allow Players/Trusted Players to create actors in Settings->Configure Permissions.":"GM 可以在「设置 → 配置权限」中允许玩家／受信任玩家创建角色。","bonds":"纽带","first.":"，然后再升级。","frames":"骨架","mech systems":"机甲系统","mech weapons":"机甲武器","migrate to Foundry 12.343":"迁移到 Foundry 12.343","module is intended for use in non-Lancer systems to use Lancer-style initiative. Since all of its functionality is already included in the system, enabling the module can cause issues.":"模组用于在非 LANCER 系统中使用 LANCER 式先攻。系统已包含它的全部功能，启用该模组可能导致问题。","pilot gear":"驾驶员装备","pilot skills":"驾驶员技能触发","recommended modules":"推荐模组","reserves":"储备","statuses/conditions":"状态／状况","tags":"标签","talents":"天赋","todo action":"执行动作","unknown":"未知","weapon mods":"武器改装","damage!":"点伤害！","Tech Item Base":"科技基础加值","Weapon Base":"武器基础加值","Stunned (EVA=5)":"晕眩（回避=5）","Spotter (*)":"观察员（*）","Unknown Class":"未知职业","SCAN Database":"扫描数据库","FLEX MOUNTS CAN EITHER HAVE TWO AUXILLARY OR ONE MAIN WEAPON.":"灵活挂载点只能装备两把副武器或一把主武器。","SUPERHEAVY WEAPONS REQUIRE A MOUNT TO BE SET AS \"BRACING\".":"超重型武器必须额外将一个挂载点设为“副挂载占用”。","See dialog for details.":"详见弹窗说明。","Install Core Data":"安装核心数据","WELCOME GAME MASTER":"欢迎你，游戏主持人","THIS IS YOUR FIRST TIME LAUNCHING":"这是你首次启动本世界","Use the LANCER Compendium Manager window to install the LANCER DATA you wish to use.":"请在 LANCER 内容包管理器窗口中安装所需的数据包。","Compendium Manager Tour?":"需要内容包管理器向导吗？","Would you like a tour of how to set up your LANCER Compendiums?":"是否查看如何设置 LANCER 合集包的引导说明？","No LCP Selected":"未选择 LCP 内容包","Choose file...":"选择文件…","Various":"综合","LCP is targeting the V3 data format which is not currently supported.":"该 LCP 使用了暂不支持的 V3 数据格式。","View":"查看","Rename profile":"重命名数据组","Base Profile":"基础数据组","Tag not found":"未找到标签"},"patterns":[["Could not import mech '{x}' as you lack the permission to create new actors. Please ask your GM for assistance (either they import for you, or give you permissions)","无法导入机甲“{x}”：你没有创建角色的权限。请让 GM 协助（由 GM 代为导入，或给予你权限）"],["This world is too old to migrate directly to Lancer {x} and Foundry 13. Restore a backup of this world and migrate to Foundry 12.343 first.","此世界版本太旧，无法直接迁移到 Lancer {x} 与 Foundry 13。请恢复此世界的备份，先迁移到 Foundry 12.343。"],["Migration to v{x} in progress. Please do not shut down your world or refresh the page until migration is complete.","正在迁移到 v{x}。迁移完成前请不要关闭世界或刷新页面。"],["Could not import mech '{x}' as you lack the permission to update the actor. Please ask your GM for assistance.","无法导入机甲“{x}”：你没有更新该角色的权限。请让 GM 协助。"],["{x} actors could not be created/updated. {x} items could not be found. See dialog for details.","{x} 个角色未能创建或更新，{x} 个条目未找到。详见弹窗说明。"],["Journal folder {x} does not exist and must be created by a user with permissions to do so.","日志文件夹 {x} 不存在，需要由有权限的用户创建。"],["Error while migrating unlinked token {x} in scene {x}. Check the console for details.","迁移未关联指示物 {x}（场景 {x}）时出错，详情见控制台。"],["Error while migrating actor compendium {x}. Check the console for details.","迁移角色合集包 {x} 时出错，详情见控制台。"],["Error while migrating item compendium {x}. Check the console for details.","迁移物品合集包 {x} 时出错，详情见控制台。"],["This world is too old to migrate directly to Lancer {x} and Foundry 13.","此世界版本太旧，无法直接迁移到 Lancer {x} 与 Foundry 13。"],["Unresolved deployabled LID \"{x}\". Re-import + Set yourself as its owner","找不到部署物 LID“{x}”。请重新导入，并把自己设为它的所有者"],["{x} actors could not be created/updated. See dialog for details.","{x} 个角色未能创建或更新。详见弹窗说明。"],["Error while migrating actor {x}. Check the console for details.","迁移角色 {x} 时出错，详情见控制台。"],["Error while migrating scene {x}. Check the console for details.","迁移场景 {x} 时出错，详情见控制台。"],["Item {x} is not a mech system, weapon mod, or NPC feature!","物品{x}不是机甲系统、武器改装或 NPC 特性！"],["You do not own {x}, so you cannot roll damage for them","{x}不属于你，你不能为其掷伤害"],["{x} items could not be found. See dialog for details.","{x} 个条目未找到。详见弹窗说明。"],["Error in tech attack flow - {x} is an invalid type!","科技攻击流程出错：{x}的类型无效！"],["Item {x} has no actions, how did you even get here?","物品{x}没有动作。"],["Item {x} cannot roll damage as it is not a weapon!","物品{x}不是武器，不能掷伤害！"],["Are you sure you want to fully repair the {x} \"{x}\"?","确定要全面维修{x}“{x}”吗？"],["LANCER System migration to version {x} completed!","LANCER 系统已迁移到 {x} 版！"],["WEAPON OF SIZE {x} CANNOT FIT ON FITTING OF SIZE {x}","规格为{x}的武器无法装入规格为{x}的槽位"],["Starting import of {x}, Callsign {x}. Please wait.","开始导入{x}（呼号 {x}），请稍候。"],["Error in attack flow - {x} is an invalid type!","攻击流程出错：{x}的类型无效！"],["Item {x} cannot attack as it is not a system!","物品{x}不是系统，不能攻击！"],["Item {x} cannot attack as it is not a weapon!","物品{x}不是武器，不能攻击！"],["Mech is cooling itself. Heat and {x} cleared.","机甲正在散热：热度与{x}已清除。"],["Error - No macro exists for item type \"{x}\"","错误：物品类型“{x}”没有对应的宏"],["{x} has had their actions manually reset.","{x}的动作已手动重置。"],["{x} actors could not be created/updated.","{x} 个角色未能创建或更新。"],["Could not migrate {x}: unable to unlock","无法迁移 {x}：无法解锁"],["Roll {x}d6 to determine what happens.","掷 {x}d6 决定结果。"],["Notice: {x} has been fully repaired.","注意：{x}已全面维修。"],["Partially loaded '{x}'s new state. {x}","已部分载入“{x}”的新状态。{x}"],["Import of {x}, Callsign {x} complete.","{x}（呼号 {x}）导入完成。"],["Partially loaded '{x}'s new state.","已部分载入“{x}”的新状态。"],["Reserve {x} has already been used!","储备{x}已经用过了！"],["System {x} has no remaining uses!","系统{x}没有剩余次数！"],["Weapon {x} has no remaining uses!","武器{x}没有剩余次数！"],["{x} is not a valid numeric value","{x} 不是有效的数值"],["{x} items could not be found.","{x} 个条目未找到。"],["Item {x} is not a mech frame!","物品{x}不是机甲骨架！"],["System {x} has not recharged!","系统{x}尚未充能！"],["Weapon {x} has not recharged!","武器{x}尚未充能！"],["Item {x} has no bond powers!","物品{x}没有纽带能力！"],["{x} {x} has no remaining uses!","{x}{x}没有剩余次数！"],["Failed to update pilot: {x}","更新驾驶员失败：{x}"],["Item {x} can't deal damage!","物品{x}不能造成伤害！"],["{x} is starting their turn","{x}开始回合"],["A {x} can't be stabilized!","{x}无法稳住阵脚！"],["Weapon {x} is not loaded!","武器{x}未装填！"],["{x} is ending their turn","{x}结束回合"],["Item {x} is not a skill!","物品{x}不是技能触发！"],["{x} has taken {x} damage!","{x}受到了{x}伤害！"],["CORE ACTIVATION :: {x}","核心激活 :: {x}"],["Failed to load LCP {x}","无法载入内容包 {x}"],["// TALENT :: {x} {x} //","// 天赋 :: {x} {x} //"],["Core Data is at v{x}","核心数据版本 v{x}"],["Could not load {x}: {x}","无法载入 {x}：{x}"],["INTEGRATED ITEM: {x}","内建装备：{x}"],["({x} total) damage!","（共 {x}）点伤害！"],["{x} is OVERCHARGING","{x}正在超频"],["{x} HAS STABILIZED","{x}已稳住阵脚"],["Basic Attack - {x}","基础攻击 - {x}"],["UNLOCKED RANK: {x}","已解锁等级：{x}"],["{x} SYSTEM POINTS","{x} SP"],["{x} took {x} damage!","{x}受到 {x} 点伤害！"],["Engineering - {x}","工程 - {x}"],["Full Repair - {x}","全面维修 - {x}"],["FULL REPAIR - {x}","全面维修 - {x}"],["Insert {x} weapon","装入{x}武器"],["SCAN // 🞂 {x} 🞀","扫描 // 🞂 {x} 🞀"],["Tech Attack - {x}","科技攻击 - {x}"],["{x} // {x} {x} Feature","{x} // {x}{x}特性"],["{x} Weapon Mount","{x}武器挂载点"],["IMPORT {x} FOR {x}?","要为{2}导入{1}吗？"],["Overcharge - {x}","超频 - {x}"],["{x} - overrides","{x} - 覆盖"],["{x}'s inventory","{x}的物品栏"],["Importing {x} v{x}","正在导入 {x} v{x}"],["Stabilize - {x}","稳住阵脚 - {x}"],["STABILIZE - {x}","稳住阵脚 - {x}"],["Structure - {x}","结构 - {x}"],["{x} / {x} SP USED","已用 SP：{x} / {x}"],["{x} DIFFICULTY","{x} 难度"],["{x}{x} Overshield","{x}{x} 护盾"],["// {x} TECH{x} //","// {x}科技{x} //"],["DEPLOYABLE {x}","部署物 {x}"],["Overheat - {x}","过热 - {x}"],["RESERVE :: {x}","储备 :: {x}"],["Unknown <{x}>s","未知<{x}>"],["Update to v{x}","更新到 v{x}"],["{x} - bonuses","{x} - 加值"],["{x}{x} Structure","{x}{x} 结构"],["+{x} ACCURACY","+{x} 准度"],["Agility - {x}","敏捷 - {x}"],["Deployer: {x}","部署者：{x}"],["INVADE // {x}","入侵 // {x}"],["Unknown <{x}>","未知<{x}>"],["Damage - {x}","伤害 - {x}"],["System - {x}","系统 - {x}"],["T {x} DAMAGE","等阶 {x} 伤害"],["{x}{x} Repairs","{x}{x} 维修"],["// RANK {x}","// 等级 {x}"],["{x} damage","{x}伤害"],["{x} DAMAGE","{x}伤害"],["{x}{x} Stress","{x}{x} 压力"],["//RANK {x}","//等级 {x}"],["Grit - {x}","毅力 - {x}"],["Hull - {x}","机体 - {x}"],["Resist {x}","抗性：{x}"],["Scan - {x}","扫描 - {x}"],["Tier - {x}","等阶 - {x}"],["{x} took {x}","{x}受到 {x}"],["PILOT {x}","驾驶员 {x}"],["SCAN: {x}","扫描：{x}"],["TIER {x} {x}","等阶 {x} {x}"],["{x}{x} Burn","{x}{x} 燃烧"],["{x}{x} Heat","{x}{x} 热度"],["MECH {x}","机甲 {x}"],["Size {x}","大小 {x}"],["Tier {x}","等阶 {x}"],["TIER {x}","等阶 {x}"],["NPC {x}","NPC {x}"],["{x}{x} HP","{x}{x} HP"],["by {x}","作者：{x}"],["vs {x}","对 {x}"]],"words":{"Main":"主","Aux":"副","Auxiliary":"副","Flex":"灵活","Heavy":"重型","Superheavy":"超重型","Integrated":"内建","Ship-class":"舰载级","Melee":"近战","CQB":"CQB","Rifle":"步枪","Launcher":"发射器","Cannon":"大炮","Nexus":"巢房","Special":"特殊","Kinetic":"动能","Explosive":"爆炸","Energy":"能量","Heat":"热度","Burn":"燃烧","Variable":"可变","Range":"射程","Threat":"威胁","Blast":"溅射","Burst":"爆发","Line":"线形","Cone":"锥形","Thrown":"投掷","Quick":"快速动作","Full":"完整动作","Quick Tech":"快速科技","Full Tech":"完整科技","Invade":"入侵","Reaction":"反应","Protocol":"协议","Free":"自由动作","Free Action":"自由动作","Passive":"被动","Other":"其他","Movement":"移动","Tech":"科技","Trait":"特征","Check":"检定","System":"系统","Weapon":"武器","Systems":"系统","Weapons":"武器","Attack":"攻击","Class":"职业","Template":"模板","Deployable":"部署物","Drone":"无人机","Shield":"护盾","Mech":"机甲","NPC":"NPC","Pilot":"驾驶员","Hull":"机体","Agility":"敏捷","Engineering":"工程","Structure":"结构","Stress":"压力","reactor":"压力","Mod":"改装","Gear":"装备","Armor":"护甲","Reserve":"储备","Talent":"天赋","Frame":"骨架","Status":"状态","Use":"使用","Evasion":"回避","E-Def":"电子防御","E-Defense":"电子防御","Impaired":"受损","Stunned":"晕眩","Exposed":"暴露","Slowed":"缓慢","Slow":"缓慢","Prone":"伏卧","Immobilized":"固定","Jammed":"受扰","Shredded":"离散","Invisible":"隐形","Engaged":"交战","Lock On":"锁定","Shut Down":"关机","Danger Zone":"超温危域","Down and Out":"昏迷","Grit":"毅力","Tier":"等阶","None":"无","AuxAux":"副/副","MainAux":"主/副","QuickTech":"快速科技","FullTech":"完整科技","FlightSystem":"飞行系统","Flight System":"飞行系统","Balanced":"均衡","Artillery":"炮击","Striker":"突击","Controller":"控制","Support":"支援","Defender":"防御","Specialty":"特化","Biological":"生物","Turn":"回合","NextTurn":"下一回合","Round":"轮","NextRound":"下一轮","Scene":"场景","Encounter":"遭遇","Mission":"任务","Condition":"状况","Resources":"资源","Tactical":"战术","Project":"项目","Organization":"组织","Military":"军事","Scientific":"科研","Academic":"学术","Criminal":"犯罪","Humanitarian":"人道主义","Industrial":"工业","Entertainment":"娱乐","Political":"政治"},"context":{".scan-stat-item":{"Armor":"装甲"}}};

const LETTER = /[A-Za-z]/;
const norm = s => s.replace(/\s+/g, " ").trim();
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const EXACT = new Map(Object.entries(HARDCODED.exact));
const EXACT_CI = new Map(Object.entries(HARDCODED.exact).map(([k, v]) => [k.toLowerCase(), v]));
const WORDS = new Map(Object.entries(HARDCODED.words).map(([k, v]) => [k.toLowerCase(), v]));
const PATTERNS = HARDCODED.patterns.map(([src, zh]) => [new RegExp("^" + src.split("{x}").map(reEsc).join("(.*?)") + "$", "is"), zh]);
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
	if (s.length >= 2 && !/[㐀-鿿]/.test(s) && EXACT_CI.has(s.toLowerCase())) return EXACT_CI.get(s.toLowerCase());
	const w = wordSeq(s);
	if (w !== null) return w;
	if (!deep) return null;
	for (const [re, zh] of PATTERNS) {
		const m = re.exec(s);
		if (m) return fill(zh, m.slice(1));
	}
	// 「// Weapon Destruction //」「// 埃弗勒斯 HAS STABILIZED //」「// 攻击 VS EVASION //」：剥离外层 // ... // 后递归翻译
	const slashWrap = /^\/\/\s*(.+?)\s*\/\/$/s.exec(s);
	if (slashWrap) {
		const inner = lookup(slashWrap[1].trim(), true);
		if (inner !== null) return `// ${inner} //`;
	}
	// 「名称 // MAIN RIFLE」「标题 :: TRAIT」「ACTIVATE - QUICK」「Structure Damage -- 机甲」「攻击 VS EVASION」：分隔符两侧分别翻译
	if (/\s(\/\/|::|--|-|VS)\s/.test(s)) {
		const parts = s.split(/(\s*(?:\/\/|::)\s*|\s+(?:--|-|VS)\s+)/);
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

// ---- DOM：文字节点与提示属性（普通手写日志跳过，但系统扫描生成的含 .scan-stat-item 日志页放行翻译）
const SKIP = "script, style, textarea, [contenteditable='true'], prose-mirror, .ProseMirror, .editor-content, .directory-list";
const ATTRS = ["title", "placeholder", "data-tooltip", "aria-label", "alt"];
const shouldSkipEl = el => {
	if (!el) return true;
	if (el.closest?.(SKIP)) return true;
	const jpc = el.closest?.(".journal-page-content");
	if (jpc && !jpc.querySelector?.(".scan-stat-item, .lancer-stat-block")) return true;
	return false;
};

// 修复弹窗/稳住阵脚面板中因状态名改为中文导致断链的 @Compendium[world.status-items.Exposed] 等富文本链接
function repairBrokenStatusLink(el) {
	if (!el?.classList?.contains?.("broken") || el.dataset?.pack !== "world.status-items") return;
	const rawId = String(el.dataset.id || el.textContent || "").trim().replace(/^world\.status-items\./i, "");
	const zh = translate(rawId);
	if (!zh) return;
	el.classList.remove("broken");
	el.innerHTML = `<i class="fas fa-bolt"></i>${escHtml(zh)}`;
}

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
	if (shouldSkipEl(el)) return;
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
	if (!root || typeof document === "undefined" || typeof Node === "undefined" || typeof NodeFilter === "undefined") return;
	if (root.nodeType === Node.TEXT_NODE) return doText(root);
	if (root.nodeType !== Node.ELEMENT_NODE || shouldSkipEl(root)) return;
	repairBrokenStatusLink(root);
	for (const a of ATTRS) doAttr(root, a);
	const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
		acceptNode: n => {
			if (n.nodeType !== Node.ELEMENT_NODE) return NodeFilter.FILTER_ACCEPT;
			if (n.matches(SKIP)) return NodeFilter.FILTER_REJECT;
			if (n.classList?.contains("journal-page-content") && !n.querySelector?.(".scan-stat-item, .lancer-stat-block")) return NodeFilter.FILTER_REJECT;
			repairBrokenStatusLink(n);
			return NodeFilter.FILTER_ACCEPT;
		},
	});
	for (let n = tw.nextNode(); n; n = tw.nextNode()) {
		if (n.nodeType === Node.TEXT_NODE) doText(n);
		else for (const a of ATTRS) doAttr(n, a);
	}
}

const observer = typeof MutationObserver === "function"
	? new MutationObserver(muts => {
		for (const m of muts) {
			if (m.type === "childList") m.addedNodes.forEach(walk);
			else if (m.type === "characterData") doText(m.target);
			else if (m.type === "attributes" && !shouldSkipEl(m.target)) doAttr(m.target, m.attributeName);
		}
	})
	: null;

// 画布上的浮动数字（「-5 HP」「+2 Heat」）不在 DOM 里，包装系统调用的 createScrollingText。
// Foundry 加上 / 去掉状态时飘出的「+(缓慢)」「-(缓慢)」改成更大、带颜色的「+ 缓慢」「- 缓慢」。
const STATUS_SCROLL = /^([+-])\((.+)\)$/s;
function patchScrollingText() {
	const proto = foundry?.canvas?.groups?.InterfaceCanvasGroup?.prototype;
	if (!proto?.createScrollingText || proto.createScrollingText.lancerCn) return;
	const orig = proto.createScrollingText;
	proto.createScrollingText = function (origin, content, options) {
		const st = typeof content === "string" ? STATUS_SCROLL.exec(content) : null;
		if (st) {
			const on = st[1] === "+";
			return orig.call(this, origin, `${on ? "+" : "-"} ${st[2]}`, { ...options, fontSize: 32, fill: on ? 0xffd34d : 0xb4b4b4, stroke: 0x000000, strokeThickness: 5 });
		}
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
	const regions = new Set(tokenDoc?.regions ?? []);
	const scene = tokenDoc?.parent ?? globalThis.canvas?.scene;
	const grid = scene?.grid ?? globalThis.canvas?.grid;
	if (scene?.regions && grid && !grid.isGridless && typeof grid.getOffset === "function") {
		let occKeys = null;
		for (const r of scene.regions) {
			if (r === exclude || regions.has(r)) continue;
			const cellKeys = r.getFlag?.(MODULE_ID, "auraCellKeys") ?? r.flags?.[MODULE_ID]?.auraCellKeys;
			if (!Array.isArray(cellKeys) || !cellKeys.length) continue;
			if (!occKeys) {
				occKeys = new Set(offsetsAtPosition(tokenDoc, Number(tokenDoc.x) || 0, Number(tokenDoc.y) || 0, grid).map(o => `${o.i},${o.j}`));
			}
			if (cellKeys.some(k => occKeys.has(k))) regions.add(r);
		}
	}
	if (exclude) regions.delete(exclude);
	if (include) regions.add(include);
	let best = "none";
	for (const region of regions) {
		const boundOwnerId = region.getFlag?.(MODULE_ID, "boundCoverTokenId") ?? region.flags?.[MODULE_ID]?.boundCoverTokenId;
		if (boundOwnerId && tokenDoc?.id && boundOwnerId === tokenDoc.id) {
			const grantSelf = Boolean(region.getFlag?.(MODULE_ID, "grantToSelfActor") ?? region.flags?.[MODULE_ID]?.grantToSelfActor);
			if (!grantSelf) continue;
		}
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
	const E = globalThis.CONST?.REGION_EVENTS ?? {};
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

// 危险地形：区域行为 lancer-cn.dangerous。指示物移入区域或在区域内结束回合时，由触发事件的一方发送工程检定提醒卡。
const DANGEROUS_TYPE = `${MODULE_ID}.dangerous`;
const DANGEROUS_DMG_ZH = { Kinetic: "动能", Energy: "能量", Explosive: "爆炸", Burn: "燃烧", Heat: "热度" };

function defineDangerousBehavior() {
	const Base = foundry.data?.regionBehaviors?.RegionBehaviorType;
	if (!Base) return null;
	const fields = foundry.data.fields;
	const NumberField = fields.NumberField ?? fields.StringField;
	const E = globalThis.CONST?.REGION_EVENTS ?? {};
	const moveIn = E.TOKEN_MOVE_IN ?? "tokenMoveIn";
	const turnEnd = E.TOKEN_TURN_END ?? "tokenTurnEnd";
	const notify = async function (event) {
		if (!event.user?.isSelf) return;
		const token = event.data?.token;
		const actor = token?.actor;
		if (!actor) return;
		const rawDmg = this.damage ?? this.system?.damage;
		const dmg = Number.isFinite(Number(rawDmg)) ? Number(rawDmg) : 5;
		const dtype = this.damageType ?? this.system?.damageType ?? "Kinetic";
		const dmgText = dtype === "Heat" ? `${dmg} 点热度` : `${dmg} 点${DANGEROUS_DMG_ZH[dtype] ?? "动能"}伤害`;
		const reason = event.name === turnEnd ? "在危险地形中结束回合" : "进入了危险地形";
		const targetRef = token.uuid ?? actor.uuid;
		const btn = actor.uuid
			? `<div style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap"><button type="button" data-lancer-cn-eng-check="${escHtml(actor.uuid)}" style="width:auto;line-height:1.6;padding:0 .6em;margin:0"><i class="fas fa-dice-d20"></i> 工程检定</button>${dmg > 0 && targetRef ? `<button type="button" data-lancer-cn-danger-dmg="${escHtml(targetRef)}:${escHtml(dtype)}:${dmg}" style="width:auto;line-height:1.6;padding:0 .6em;margin:0"><i class="fas fa-bolt"></i> 结算 ${escHtml(dmgText)}</button>` : ""}</div>`
			: "";
		const content = `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 危险地形 //</div><div class="effect-text"><p><b>${escHtml(token.name ?? actor.name ?? "角色")}</b> ${reason}。</p><p>每轮仅触发一次：进行<b>工程检定</b>（目标 10），失败受到 <b>${dmgText}</b>。</p>${btn}</div></div>`;
		return globalThis.ChatMessage?.create({ speaker: globalThis.ChatMessage.getSpeaker({ actor, token }), content, flags: { [MODULE_ID]: { skipAutoScan: true } } });
	};
	return class DangerousTerrainBehavior extends Base {
		static defineSchema() {
			return {
				damage: new NumberField({
					required: true, initial: 5, min: 0, integer: true,
					label: "失败伤害", hint: "工程检定失败时受到的伤害或热度点数（核心规则默认为 5）。",
				}),
				damageType: new fields.StringField({
					required: true, initial: "Kinetic",
					choices: { Kinetic: "动能", Energy: "能量", Explosive: "爆炸", Burn: "燃烧", Heat: "热度" },
					label: "伤害类型", hint: "由 GM 指定的危险地形伤害类型。",
				}),
			};
		}
		static events = {
			[moveIn]: notify,
			[turnEnd]: notify,
		};
	};
}

async function runDangerousEngCheck(uuid) {
	const actor = uuid ? (typeof fromUuid === "function" ? await fromUuid(uuid) : fromUuidSync?.(uuid)) : null;
	if (!actor?.isOwner) return ui.notifications.warn("你不拥有该角色，请由拥有者或 GM 进行工程检定。");
	const Cls = game.lancer?.flows?.get?.("StatRollFlow");
	if (!Cls) return false;
	const flow = new Cls(actor.uuid, { title: "危险地形 // 工程检定", path: "system.eng" });
	return flow.begin({ ...flow.state?.data, title: "危险地形 // 工程检定", path: "system.eng" });
}

async function applyDangerousTerrainDamage(spec) {
	const [targetUuid, dtype, rawAmt] = String(spec || "").split(":");
	const amt = Number(rawAmt) || 0;
	if (!targetUuid || amt <= 0) return false;
	const doc = typeof fromUuid === "function" ? await fromUuid(targetUuid) : resolveDocSync(targetUuid);
	const actor = doc?.actor ?? (doc?.damageCalc ? doc : resolveActor(targetUuid));
	if (!actor) return false;
	const applied = sumAppliedDamage([{ type: dtype || "Kinetic", amount: amt }]);
	const dmgCtx = { attackerUuid: targetUuid, isAoe: false };
	if (actor.isOwner && typeof actor.damageCalc === "function") {
		await actor.damageCalc(applied, { multiple: 1, addBurn: true, ap: false, paracausal: false, dmgCtx });
		return true;
	}
	if (getSetting("crossPermDamage", true) && globalThis.game?.users?.activeGM) {
		globalThis.game?.socket?.emit(`module.${MODULE_ID}`, { action: "applyDamage", targetUuid, applied, multiple: 1, addBurn: true, ap: false, paracausal: false, dmgCtx });
		globalThis.ui?.notifications?.info?.(`已请求 GM 对「${actor.token?.name ?? actor.name}」结算危险地形伤害。`);
		return true;
	}
	globalThis.ui?.notifications?.warn?.("你不拥有该角色，请由拥有者或 GM 结算危险地形伤害。");
	return false;
}

function onDangerousCheckClick(event) {
	const dmgBtn = event.target?.closest?.("[data-lancer-cn-danger-dmg]");
	if (dmgBtn) {
		event.preventDefault?.();
		event.stopPropagation?.();
		event.stopImmediatePropagation?.();
		applyDangerousTerrainDamage(dmgBtn.dataset.lancerCnDangerDmg).catch(err => reportError("危险地形伤害结算", err));
		return;
	}
	const btn = event.target?.closest?.("[data-lancer-cn-eng-check]");
	if (!btn) return;
	event.preventDefault?.();
	event.stopPropagation?.();
	event.stopImmediatePropagation?.();
	runDangerousEngCheck(btn.dataset.lancerCnEngCheck).catch(err => reportError("危险地形工程检定", err));
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer" || !CONFIG.RegionBehavior) return;
	const Cover = defineCoverBehavior();
	if (Cover) {
		CONFIG.RegionBehavior.dataModels[COVER_TYPE] = Cover;
		if (CONFIG.RegionBehavior.typeIcons) CONFIG.RegionBehavior.typeIcons[COVER_TYPE] = "fa-solid fa-shield-halved";
	}
	const Dangerous = defineDangerousBehavior();
	if (Dangerous) {
		CONFIG.RegionBehavior.dataModels[DANGEROUS_TYPE] = Dangerous;
		if (CONFIG.RegionBehavior.typeIcons) CONFIG.RegionBehavior.typeIcons[DANGEROUS_TYPE] = "fa-solid fa-triangle-exclamation";
	}
});
// 行为类型的显示名：Foundry 按语言键 TYPES.RegionBehavior.lancer-cn.* 查（按「.」逐层查找），
// 写进已载入的译文与英文后备译文，任何界面语言都显示中文名
const COVER_LABEL_KEY = `TYPES.RegionBehavior.${COVER_TYPE}`;
const DANGEROUS_LABEL_KEY = `TYPES.RegionBehavior.${DANGEROUS_TYPE}`;
Hooks.once("i18nInit", () => {
	if (game.system?.id !== "lancer") return;
	for (const t of [game.i18n.translations, game.i18n._fallback]) {
		if (!t) continue;
		foundry.utils.setProperty(t, COVER_LABEL_KEY, "LANCER 掩护区");
		foundry.utils.setProperty(t, DANGEROUS_LABEL_KEY, "LANCER 危险地形");
	}
});

// ---------------------------------------------------------------------------
// 六边形墙体：GM 在「墙壁」工具栏选「六边形墙体」，点击格子放置一整格的墙体，再点一次移除，按住拖动可连续放置。
// 每格墙体 = 沿格子边缘的 6 段阻挡移动的墙 + 一个所有人可见的实心六边形图形（Foundry 的墙对玩家不可见，图形告诉玩家此处不可通过）。
// 默认不阻挡视线；模组设置「六边形墙体阻挡视线」可打开。墙体只阻挡移动，掩护按需手动设置或用掩护区。
const HEX_TOOL = "lancerHexWall";
const HEX_FLAG = "hexWall";

const hexKey = offset => `${offset.i},${offset.j}`;

// 一格墙体的文档数据：walls（每条边一段）与 drawing（实心多边形，坐标相对左上角）
function hexWallData(rawVertices, key, { blockSight = false, mapImport = false } = {}) {
	const vertices = rawVertices.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));
	const NONE = globalThis.CONST?.WALL_SENSE_TYPES?.NONE ?? 0;
	const NORMAL = globalThis.CONST?.WALL_SENSE_TYPES?.NORMAL ?? 20;
	const MOVE = globalThis.CONST?.WALL_MOVEMENT_TYPES?.NORMAL ?? 20;
	const flags = { [MODULE_ID]: mapImport ? { [HEX_FLAG]: key, mapImport: true } : { [HEX_FLAG]: key } };
	const walls = vertices.map((p, i) => {
		const q = vertices[(i + 1) % vertices.length];
		return { c: [p.x, p.y, q.x, q.y].map(Math.round), move: MOVE, sight: blockSight ? NORMAL : NONE, light: blockSight ? NORMAL : NONE, sound: NONE, flags };
	});
	const xs = vertices.map(p => p.x), ys = vertices.map(p => p.y);
	const x = Math.min(...xs), y = Math.min(...ys);
	const drawing = {
		x, y, locked: true, flags,
		shape: { type: "p", width: Math.max(...xs) - x, height: Math.max(...ys) - y, points: vertices.flatMap(p => [Math.round(p.x - x), Math.round(p.y - y)]) },
		fillType: globalThis.CONST?.DRAWING_FILL_TYPES?.SOLID ?? 1, fillColor: "#2b2b2b", fillAlpha: 0.85,
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
// 掩护格与地形格：Foundry 的区域工具在六角网格上画不出整格的六边形。「区域」工具栏提供四把涂画工具：
// - 软性掩护格 / 硬性掩护格：带「LANCER 掩护区」行为（进入自动挂上软性 / 硬性掩护）
// - 困难地形格：带 Foundry v13 原生 modifyMovementCost 行为（步行每格消耗 2 点移动力，飞行与「无视地形」仍为 1 点）
// - 危险地形格：带「LANCER 危险地形」行为（移入或结束回合时发送带一键工程检定按钮的提醒卡）
const COVER_CELL_FLAG = "coverCells";
const TERRAIN_CELL_FLAG = "terrainCells";
const REGION_CELL_DEFS = {
	soft: { flag: COVER_CELL_FLAG, value: "soft", name: "软性掩护格", color: "#3b82c4", behavior: () => ({ name: "LANCER 掩护区", type: COVER_TYPE, system: { cover: "soft" } }) },
	hard: { flag: COVER_CELL_FLAG, value: "hard", name: "硬性掩护格", color: "#c4703b", behavior: () => ({ name: "LANCER 掩护区", type: COVER_TYPE, system: { cover: "hard" } }) },
	difficult: { flag: TERRAIN_CELL_FLAG, value: "difficult", name: "困难地形格", color: "#7d8c38", behavior: () => ({ name: "困难地形", type: "modifyMovementCost", system: { difficulties: { walk: 2 } } }) },
	dangerous: { flag: TERRAIN_CELL_FLAG, value: "dangerous", name: "危险地形格", color: "#c93b3b", behavior: () => ({ name: "LANCER 危险地形", type: DANGEROUS_TYPE, system: { damage: 5, damageType: "Kinetic" } }) },
};
const cellPoints = vertices => vertices.flatMap(p => [Math.round(p.x), Math.round(p.y)]);
function polyMetrics(pts) {
	let sx = 0, sy = 0, minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
	const n = pts.length >> 1;
	for (let i = 0; i < pts.length; i += 2) {
		const x = pts[i], y = pts[i + 1];
		sx += x; sy += y;
		if (x < minX) minX = x; if (x > maxX) maxX = x;
		if (y < minY) minY = y; if (y > maxY) maxY = y;
	}
	return { cx: sx / n, cy: sy / n, w: maxX - minX, h: maxY - minY };
}
// 比较两个六角格多边形是否同一格：除了逐顶点对齐，也兼容从车卡器静态场景 JSON 导入（起始顶点顺序可能不同）的六边形
function samePoints(a, b) {
	if (a.length !== b.length) return false;
	if (a.every((v, i) => Math.abs(v - b[i]) <= 1)) return true;
	if (a.length === 12) {
		const ma = polyMetrics(a), mb = polyMetrics(b);
		return Math.abs(ma.cx - mb.cx) <= 3 && Math.abs(ma.cy - mb.cy) <= 3 && Math.abs(ma.w - mb.w) <= 4 && Math.abs(ma.h - mb.h) <= 4;
	}
	return false;
}
const shapeData = s => (typeof s?.toObject === "function" ? s.toObject() : { ...s });
const cellRegionOf = (scene, kind) => {
	const def = REGION_CELL_DEFS[kind];
	return def ? scene.regions.find(r => r.getFlag?.(MODULE_ID, def.flag) === def.value) : undefined;
};

function regionCellHas(scene, grid, point, kind) {
	const pts = cellPoints(grid.getVertices(grid.getOffset(point)));
	const region = cellRegionOf(scene, kind);
	return !!region?.shapes?.some(s => s.type === "polygon" && samePoints(Array.from(s.points), pts));
}

async function setRegionCell(scene, grid, point, kind, mode) {
	const def = REGION_CELL_DEFS[kind];
	if (!def) return null;
	const pts = cellPoints(grid.getVertices(grid.getOffset(point)));
	const region = cellRegionOf(scene, kind);
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
		await scene.createEmbeddedDocuments("Region", [{
			name: def.name, color: def.color, shapes: [shape],
			visibility: CONST.REGION_VISIBILITY?.ALWAYS ?? 2,
			flags: { [MODULE_ID]: { [def.flag]: def.value } },
			behaviors: [def.behavior()],
		}]);
	}
	return "add";
}

const coverCellHas = (scene, grid, point, cover) => regionCellHas(scene, grid, point, cover);
const setCoverCell = (scene, grid, point, cover, mode) => setRegionCell(scene, grid, point, cover, mode);
const terrainCellHas = (scene, grid, point, terrain) => regionCellHas(scene, grid, point, terrain);
const setTerrainCell = (scene, grid, point, terrain, mode) => setRegionCell(scene, grid, point, terrain, mode);

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
	lancerTerrainDifficult: {
		control: "regions", label: "困难地形格",
		has: (scene, grid, point) => terrainCellHas(scene, grid, point, "difficult"),
		apply: (scene, grid, point, mode) => setTerrainCell(scene, grid, point, "difficult", mode),
		tool: { title: "困难地形格：点击格子加入困难地形区（步行移动每空间消耗 2 点移动力），再点移除；按住拖动可连续操作", icon: "fa-solid fa-mountain" },
	},
	lancerTerrainDangerous: {
		control: "regions", label: "危险地形格",
		has: (scene, grid, point) => terrainCellHas(scene, grid, point, "dangerous"),
		apply: (scene, grid, point, mode) => setTerrainCell(scene, grid, point, "dangerous", mode),
		tool: { title: "危险地形格：点击格子加入危险地形区（移入或结束回合时发送工程检定提醒卡），再点移除；按住拖动可连续操作", icon: "fa-solid fa-triangle-exclamation" },
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
const canvasView = () => globalThis.canvas?.app?.canvas ?? globalThis.canvas?.app?.view;

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
	const cv = globalThis.canvas;
	const def = globalThis.game?.user?.isGM && cv?.scene ? activePaintTool() : null;
	if (!def) { hexPaint = null; return; }
	if (event.type === "pointerdown") {
		if (event.button !== 0 || event.target !== canvasView()) return;
	} else {
		// 移动：只在按住左键涂画时接管
		if (!hexPaint) return;
		if (!(event.buttons & 1)) { hexPaint = null; return; }
	}
	stop();
	if (!cv?.grid || cv.grid.isGridless) { if (event.type === "pointerdown") globalThis.ui?.notifications?.warn(`无网格的场景不能使用「${def.label}」。`); return; }
	const point = cv.canvasCoordinatesFromClient({ x: event.clientX, y: event.clientY });
	const key = hexKey(cv.grid.getOffset(point));
	if (event.type === "pointerdown") {
		hexPaint = { def, mode: def.has(cv.scene, cv.grid, point) ? "remove" : "add", done: new Set([key]), queue: Promise.resolve() };
	} else if (!hexPaint || hexPaint.def !== def || hexPaint.done.has(key)) return;
	else hexPaint.done.add(key);
	// 依次执行：同一区域的连续更新不能并发，否则后一次会覆盖前一次的形状
	const { mode } = hexPaint;
	hexPaint.queue = hexPaint.queue.then(() => def.apply(cv.scene, cv.grid, point, mode)).catch(err => console.error(`${MODULE_ID} |`, err));
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
// 导入车卡器战斗地图：兼容车卡器「导出地图」备份（Lancer-战斗地图.json）与「导出到 Foundry」场景文件（*-foundry.json）。
// 支持两种导入方式：
// 1. 新建独立场景：按地图尺寸与列奇偶建立平顶六角格场景，写入障碍物墙体、掩护区、困难/危险地形区、涂色格、标注、画线与部署位置标记。
// 2. 铺到当前场景：保留当前场景的背景底图、光照与已有指示物，对齐场景六角网格写入地形与标记（重复导入可自动替换上次导入的内容）。
const BM_SHAPES = { 2: [1, 0, 0, false], 3: [3, 1, 1, true], 4: [4, 1, 1, true] };

function bmClamp(n, a, b) {
	const v = Math.round(Number(n) || 0);
	return Math.max(a, Math.min(b, v));
}

function battleMapFootprint(u) {
	const uq = Math.round(Number(u?.q) || 0), ur = Math.round(Number(u?.r) || 0);
	const sh = BM_SHAPES[u?.size];
	if (!sh) return [{ q: uq, r: ur }];
	const [k, ca, cb, cut] = sh;
	const ar = ur - (uq - (uq & 1)) / 2;
	const out = [];
	for (let a = 0; a <= k; a++) {
		for (let b = 0; a + b <= k; b++) {
			if (cut && (a + b === 0 || a === k || b === k)) continue;
			const q = uq + a - ca;
			out.push({ q, r: ar + b - cb + (q - (q & 1)) / 2 });
		}
	}
	return out;
}

// 后备平顶六角网格几何（严格对齐 Foundry v13 HexagonalGrid：{ i: 行(Y), j: 列(X) }）
function makeHexGrid(gridType = 4, gridSize = 100) {
	const even = gridType === (globalThis.CONST?.GRID_TYPES?.HEXEVENQ ?? 5);
	const sizeY = gridSize;
	const sizeX = (2 / Math.sqrt(3)) * sizeY;
	const colStep = 0.75 * sizeX;
	const shiftOf = j => ((((j & 1) === 0) === even) ? 0.5 : 0);
	const topLeft = ({ i, j }) => ({ x0: j * colStep, y0: (i + shiftOf(j)) * sizeY });
	return {
		type: gridType, size: gridSize, distance: 1, columns: true, even, isGridless: false,
		getVertices(off) {
			const { x0, y0 } = topLeft(off);
			return [
				{ x: x0 + 0.25 * sizeX, y: y0 },
				{ x: x0 + 0.75 * sizeX, y: y0 },
				{ x: x0 + sizeX, y: y0 + 0.5 * sizeY },
				{ x: x0 + 0.75 * sizeX, y: y0 + sizeY },
				{ x: x0 + 0.25 * sizeX, y: y0 + sizeY },
				{ x: x0, y: y0 + 0.5 * sizeY },
			];
		},
		getCenterPoint(off) {
			const { x0, y0 } = topLeft(off);
			return { x: x0 + 0.5 * sizeX, y: y0 + 0.5 * sizeY };
		},
		getOffset({ x, y }) {
			const j = Math.round((x - 0.5 * sizeX) / colStep);
			const i = Math.round((y - 0.5 * sizeY) / sizeY - shiftOf(j));
			return { i, j };
		},
		measurePath(pts) {
			if (!Array.isArray(pts) || pts.length < 2) return { distance: 0, spaces: 0 };
			const toOff = p => (p && typeof p.i === "number" && typeof p.j === "number") ? p : this.getOffset(p);
			const toAx = o => ({ q: o.j, r: o.i - Math.floor((o.j + (even ? 1 : 0)) / 2) });
			let spaces = 0;
			for (let k = 1; k < pts.length; k++) {
				const a = toAx(toOff(pts[k - 1])), b = toAx(toOff(pts[k]));
				const dq = a.q - b.q, dr = a.r - b.r;
				spaces += Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
			}
			return { distance: spaces, spaces };
		},
	};
}

function parseBattleMap(input) {
	const raw = typeof input === "string" ? JSON.parse(input) : input;
	if (!raw || typeof raw !== "object") throw new Error("不是有效的 JSON 对象");
	const embedded = raw.flags?.[MODULE_ID]?.battlemap;
	const src = embedded ?? raw;
	if (!src || typeof src !== "object" || src.v !== 1 || !src.cells || typeof src.cells !== "object" || !Array.isArray(src.units) || !Array.isArray(src.lines)) {
		throw new Error("不是有效的车卡器战斗地图文件");
	}
	const round = Math.max(1, Math.round(Number(src.round) || 1));
	const map = {
		v: 1,
		minQ: bmClamp(src.minQ ?? 0, -200, 200),
		minR: bmClamp(src.minR ?? 0, -200, 200),
		w: bmClamp(src.w ?? 16, 2, 60),
		h: bmClamp(src.h ?? 10, 2, 60),
		round,
		cells: src.cells,
		units: src.units,
		lines: src.lines,
	};
	const name = (typeof raw.name === "string" && raw.name.trim()) ? raw.name.trim() : `Lancer 战斗地图（第 ${round} 轮）`;
	return { map, name };
}

async function clearImportedMapDocs(scene) {
	if (!scene) return { drawings: 0, walls: 0, regions: 0 };
	const drawings = (scene.drawings ?? []).filter(d => d.getFlag?.(MODULE_ID, "mapImport"));
	const walls = (scene.walls ?? []).filter(w => w.getFlag?.(MODULE_ID, "mapImport"));
	const regions = (scene.regions ?? []).filter(r => r.getFlag?.(MODULE_ID, "mapImport"));
	const keys = new Set(walls.map(w => w.getFlag?.(MODULE_ID, HEX_FLAG)).filter(Boolean));
	for (const k of keys) removingHex.add(k);
	try {
		if (drawings.length) await scene.deleteEmbeddedDocuments("Drawing", drawings.map(d => d.id));
		if (walls.length) await scene.deleteEmbeddedDocuments("Wall", walls.map(w => w.id));
		if (regions.length) await scene.deleteEmbeddedDocuments("Region", regions.map(r => r.id));
	} finally {
		for (const k of keys) removingHex.delete(k);
	}
	return { drawings: drawings.length, walls: walls.length, regions: regions.length };
}

async function clearUnitMarkers(scene = canvas?.scene) {
	if (!game.user?.isGM || !scene) return 0;
	const markers = (scene.drawings ?? []).filter(d => d.getFlag?.(MODULE_ID, "unitMarker"));
	if (!markers.length) {
		ui.notifications?.info("当前场景没有车卡器部署位置标记。");
		return 0;
	}
	await scene.deleteEmbeddedDocuments("Drawing", markers.map(d => d.id));
	ui.notifications?.info(`已清除 ${markers.length} 个部署位置标记图形。`);
	return markers.length;
}

function polyDrawingFromVerts(verts, extra) {
	const xs = verts.map(p => Math.round(p.x)), ys = verts.map(p => Math.round(p.y));
	const x = Math.min(...xs), y = Math.min(...ys);
	return {
		x, y, locked: true,
		shape: { type: "p", width: Math.max(1, Math.max(...xs) - x), height: Math.max(1, Math.max(...ys) - y), points: verts.flatMap(p => [Math.round(p.x) - x, Math.round(p.y) - y]) },
		...extra,
	};
}

function buildSceneMapDocs(map, grid, origin, { includeUnits = true, includeLines = true, blockSight = false, existingScene = null } = {}) {
	const inB = (q, r) => q >= map.minQ && q < map.minQ + map.w && r >= map.minR && r < map.minR + map.h;
	const hexColor = (s, d) => (typeof s === "string" && /^#[0-9a-f]{6}$/i.test(s) ? s : d);
	const sizeY = grid.size || 100;
	const sizeX = (2 / Math.sqrt(3)) * sizeY;
	const geomOf = (q, r) => {
		const off = { i: origin.i + (r - map.minR), j: origin.j + (q - map.minQ) };
		const verts = grid.getVertices(off);
		const pts = cellPoints(verts);
		const center = grid.getCenterPoint ? grid.getCenterPoint(off) : (() => { const m = polyMetrics(pts); return { x: m.cx, y: m.cy }; })();
		return { off, key: hexKey(off), verts, pts, cx: center.x, cy: center.y };
	};
	const walls = [], drawings = [];
	const regionShapes = { soft: [], hard: [], difficult: [], dangerous: [] };
	const counts = { obstacle: 0, soft: 0, hard: 0, difficult: 0, dangerous: 0, tint: 0, text: 0, lines: 0, units: 0 };
	const croppedCells = {};
	const SOLID = CONST.DRAWING_FILL_TYPES?.SOLID ?? 1;
	const NONE_FILL = CONST.DRAWING_FILL_TYPES?.NONE ?? 0;

	for (let q = map.minQ; q < map.minQ + map.w; q++) {
		for (let r = map.minR; r < map.minR + map.h; r++) {
			const raw = map.cells[`${q},${r}`];
			if (!raw) continue;
			croppedCells[`${q},${r}`] = raw;
			const g = geomOf(q, r);
			const t = raw.terrain || "";
			if (t === "障碍物") {
				if (!existingScene || !hexHas(existingScene, g.key)) {
					const hw = hexWallData(g.verts, g.key, { blockSight, mapImport: true });
					walls.push(...hw.walls);
					drawings.push({ ...hw.drawing, sort: 0 });
				}
				counts.obstacle++;
			} else if (t === "软性掩护") { regionShapes.soft.push({ type: "polygon", points: g.pts, hole: false }); counts.soft++; }
			else if (t === "硬性掩护") { regionShapes.hard.push({ type: "polygon", points: g.pts, hole: false }); counts.hard++; }
			else if (t === "困难地形") { regionShapes.difficult.push({ type: "polygon", points: g.pts, hole: false }); counts.difficult++; }
			else if (t === "危险地形") { regionShapes.dangerous.push({ type: "polygon", points: g.pts, hole: false }); counts.dangerous++; }
			else if ((!t || t === "自定义") && /^#[0-9a-f]{6}$/i.test(raw.color) && (t === "自定义" || raw.color.toLowerCase() !== "#202a38")) {
				const col = hexColor(raw.color, "#506f46");
				drawings.push(polyDrawingFromVerts(g.verts, {
					sort: -20, fillType: SOLID, fillColor: col, fillAlpha: 0.45,
					strokeColor: col, strokeWidth: 2, strokeAlpha: 0.7,
					flags: { [MODULE_ID]: { mapImport: true, cellTint: g.key } },
				}));
				counts.tint++;
			}
			if (typeof raw.text === "string" && raw.text.trim()) {
				const wBox = Math.round(sizeX * 0.9), hBox = Math.round(sizeY * 0.5);
				drawings.push({
					x: Math.round(g.cx - wBox / 2), y: Math.round(g.cy - hBox / 2), sort: 10, locked: true,
					shape: { type: "r", width: wBox, height: hBox },
					fillType: NONE_FILL, fillAlpha: 0, strokeWidth: 0, strokeAlpha: 0,
					text: raw.text.trim().slice(0, 120), fontSize: 22, textColor: "#ffffff", textAlpha: 1,
					flags: { [MODULE_ID]: { mapImport: true, cellText: g.key } },
				});
				counts.text++;
			}
		}
	}

	const visLines = map.lines.filter(l => l?.a && l?.b && inB(l.a.q, l.a.r) && inB(l.b.q, l.b.r) && (l.a.q !== l.b.q || l.a.r !== l.b.r));
	if (includeLines) {
		for (const l of visLines) {
			const a = geomOf(l.a.q, l.a.r), b = geomOf(l.b.q, l.b.r);
			const x = Math.round(Math.min(a.cx, b.cx)), y = Math.round(Math.min(a.cy, b.cy));
			const col = hexColor(l.color, "#ffd166");
			drawings.push({
				x, y, sort: 5, locked: true,
				shape: { type: "p", width: Math.max(1, Math.round(Math.abs(b.cx - a.cx))), height: Math.max(1, Math.round(Math.abs(b.cy - a.cy))), points: [Math.round(a.cx) - x, Math.round(a.cy) - y, Math.round(b.cx) - x, Math.round(b.cy) - y] },
				fillType: NONE_FILL, fillAlpha: 0, strokeColor: col, strokeWidth: 5, strokeAlpha: 0.85,
				flags: { [MODULE_ID]: { mapImport: true, mapLine: true } },
			});
			counts.lines++;
		}
	}

	const visUnits = map.units.filter(u => inB(Math.round(Number(u?.q) || 0), Math.round(Number(u?.r) || 0)));
	if (includeUnits) {
		for (const u of visUnits) {
			const fp = battleMapFootprint(u);
			const col = hexColor(u.color, "#529be8");
			const uFlag = { [MODULE_ID]: { mapImport: true, unitMarker: String(u.id ?? counts.units) } };
			if (fp.length > 1) {
				for (const c of fp) {
					if (!inB(c.q, c.r)) continue;
					drawings.push(polyDrawingFromVerts(geomOf(c.q, c.r).verts, {
						sort: -8, fillType: SOLID, fillColor: col, fillAlpha: 0.2,
						strokeColor: col, strokeWidth: 2, strokeAlpha: 0.75, flags: uFlag,
					}));
				}
			}
			const cs = fp.map(c => geomOf(c.q, c.r));
			const uq = Math.round(Number(u.q) || 0), ur = Math.round(Number(u.r) || 0);
			const stack = Math.max(0, visUnits.filter(v => Math.round(Number(v.q) || 0) === uq && Math.round(Number(v.r) || 0) === ur).indexOf(u));
			const ux = cs.reduce((s, c) => s + c.cx, 0) / cs.length + (stack % 2) * 18;
			const uy = cs.reduce((s, c) => s + c.cy, 0) / cs.length + Math.floor(stack / 2) * 18;
			const diam = Math.round(sizeY * ({ 2: 0.85, 3: 0.95, 4: 1.05 }[u.size] || 0.72));
			const label = ((u.name || "单位").trim().slice(0, 16)) + (u.size && String(u.size) !== "1" ? ` (S${u.size})` : "");
			drawings.push({
				x: Math.round(ux - diam / 2), y: Math.round(uy - diam / 2), sort: -5, locked: true,
				shape: { type: "e", width: diam, height: diam },
				fillType: SOLID, fillColor: col, fillAlpha: 0.4,
				strokeColor: col, strokeWidth: 3, strokeAlpha: 0.95,
				text: label, fontSize: 18, textColor: "#ffffff", textAlpha: 1, flags: uFlag,
			});
			counts.units++;
		}
	}

	const croppedMap = {
		v: 1, minQ: map.minQ, minR: map.minR, w: map.w, h: map.h, round: map.round,
		cells: croppedCells, units: includeUnits ? visUnits : [], lines: includeLines ? visLines : [],
	};
	return { walls, drawings, regionShapes, counts, croppedMap };
}

function formatMapCounts(counts) {
	const parts = [
		["障碍物", counts.obstacle], ["软性掩护", counts.soft], ["硬性掩护", counts.hard],
		["困难地形", counts.difficult], ["危险地形", counts.dangerous], ["涂色格", counts.tint],
		["标注", counts.text], ["画线", counts.lines], ["部署标记", counts.units],
	].filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`);
	return parts.length ? parts.join("、") : "空白网格";
}

async function importBattleMap(input, opts = {}) {
	if (!game.user?.isGM) {
		ui.notifications?.warn("只有 GM 可以导入车卡器地图。");
		return null;
	}
	const { map, name: parsedName } = parseBattleMap(input);
	const mode = opts.mode === "current" ? "current" : "new";
	const sceneName = (opts.name || "").trim() || parsedName;
	const gridSize = bmClamp(opts.gridSize || 100, 50, 300);
	const includeUnits = opts.includeUnits !== false;
	const includeLines = opts.includeLines !== false;
	const blockSight = opts.blockSight !== undefined ? !!opts.blockSight : !!game.settings?.get?.(MODULE_ID, "hexWallBlocksSight");
	const VIS_ALWAYS = CONST.REGION_VISIBILITY?.ALWAYS ?? 2;
	const HEXODDQ = CONST.GRID_TYPES?.HEXODDQ ?? 4;
	const HEXEVENQ = CONST.GRID_TYPES?.HEXEVENQ ?? 5;
	const wantType = (map.minQ & 1) !== 0 ? HEXEVENQ : HEXODDQ;

	if (mode === "new") {
		const sizeY = gridSize, sizeX = (2 / Math.sqrt(3)) * sizeY;
		const width = Math.ceil(((map.w - 1) * 0.75 + 1) * sizeX);
		const height = Math.ceil((map.h + 0.5) * sizeY);
		const SceneCls = CONFIG.Scene?.documentClass ?? globalThis.Scene;
		const fallbackGrid = makeHexGrid(wantType, gridSize);
		const preview = buildSceneMapDocs(map, fallbackGrid, { i: 0, j: 0 }, { includeUnits, includeLines, blockSight });
		const scene = await SceneCls.create({
			name: sceneName, navigation: true, width, height, padding: 0, backgroundColor: "#18202b",
			grid: { type: wantType, size: gridSize, color: "#60768b", alpha: 0.6, distance: 1, units: "空间" },
			tokenVision: false, fog: { exploration: false }, environment: { globalLight: { enabled: true } },
			flags: { [MODULE_ID]: { battlemap: preview.croppedMap } },
		});
		const grid = (scene.grid?.getVertices && !scene.grid?.isGridless) ? scene.grid : fallbackGrid;
		const { walls, drawings, regionShapes, counts } = grid === fallbackGrid
			? preview
			: buildSceneMapDocs(map, grid, { i: 0, j: 0 }, { includeUnits, includeLines, blockSight });
		const regions = [];
		for (const [kind, shapes] of Object.entries(regionShapes)) {
			if (!shapes.length) continue;
			const def = REGION_CELL_DEFS[kind];
			regions.push({
				name: def.name, color: def.color, shapes, visibility: VIS_ALWAYS,
				flags: { [MODULE_ID]: { [def.flag]: def.value, mapImport: true } },
				behaviors: [def.behavior()],
			});
		}
		if (drawings.length) await scene.createEmbeddedDocuments("Drawing", drawings);
		if (walls.length) await scene.createEmbeddedDocuments("Wall", walls);
		if (regions.length) await scene.createEmbeddedDocuments("Region", regions);
		if (opts.activate !== false) await scene.view?.();
		ui.notifications?.info(`已导入场景「${scene.name}」（${map.w} × ${map.h} 格：${formatMapCounts(counts)}）。`);
		return { scene, counts };
	}

	const scene = opts.scene ?? canvas?.scene;
	if (!scene) throw new Error("当前没有打开的场景，请选择「新建独立场景」或先打开目标场景。");
	const curType = scene.grid?.type ?? scene._source?.grid?.type ?? 1;
	const switchedGrid = opts.setHexGrid !== false && curType !== HEXODDQ && curType !== HEXEVENQ;
	if (switchedGrid) await scene.update?.({ "grid.type": wantType, "grid.distance": 1, "grid.units": "空间" });
	if (opts.replaceImported !== false) await clearImportedMapDocs(scene);

	const effType = switchedGrid ? wantType : (scene.grid?.type ?? curType);
	const effSize = scene.grid?.size || gridSize;
	const grid = (scene.grid?.getVertices && !scene.grid?.isGridless)
		? scene.grid
		: makeHexGrid(effType === HEXODDQ || effType === HEXEVENQ ? effType : wantType, effSize);

	let origin = opts.origin ? { ...opts.origin } : null;
	if (!origin) {
		const sx = scene.dimensions?.sceneX || 0, sy = scene.dimensions?.sceneY || 0;
		origin = (sx || sy) && grid.getOffset ? grid.getOffset({ x: sx + effSize * 0.5, y: sy + effSize * 0.5 }) : { i: 0, j: 0 };
	}
	const isColHex = grid.columns === true || effType === HEXODDQ || effType === HEXEVENQ;
	if (isColHex) {
		const evenShifted = grid.even !== undefined ? !!grid.even : effType === HEXEVENQ;
		const shiftAt = col => ((((col & 1) === 0) === evenShifted) ? 1 : 0);
		if (shiftAt(origin.j) !== (map.minQ & 1)) origin = { i: origin.i, j: origin.j + 1 };
	}

	const { walls, drawings, regionShapes, counts, croppedMap } = buildSceneMapDocs(map, grid, origin, {
		includeUnits, includeLines, blockSight, existingScene: scene,
	});
	if (scene.setFlag) await scene.setFlag(MODULE_ID, "battlemap", croppedMap);
	else await scene.update?.({ [`flags.${MODULE_ID}.battlemap`]: croppedMap });

	if (drawings.length) await scene.createEmbeddedDocuments("Drawing", drawings);
	if (walls.length) await scene.createEmbeddedDocuments("Wall", walls);
	const newRegions = [];
	for (const [kind, shapes] of Object.entries(regionShapes)) {
		if (!shapes.length) continue;
		const existing = cellRegionOf(scene, kind);
		if (existing) {
			const cur = (existing.shapes ?? []).map(shapeData);
			const added = shapes.filter(ns => !cur.some(cs => cs.type === "polygon" && samePoints(Array.from(cs.points), ns.points)));
			if (added.length) await existing.update({ shapes: [...cur, ...added] });
		} else {
			const def = REGION_CELL_DEFS[kind];
			newRegions.push({
				name: def.name, color: def.color, shapes, visibility: VIS_ALWAYS,
				flags: { [MODULE_ID]: { [def.flag]: def.value, mapImport: true } },
				behaviors: [def.behavior()],
			});
		}
	}
	if (newRegions.length) await scene.createEmbeddedDocuments("Region", newRegions);
	ui.notifications?.info(`已将车卡器地图铺到场景「${scene.name}」（${formatMapCounts(counts)}）。`);
	return { scene, counts };
}

function openBattleMapImportDialog() {
	if (!game.user?.isGM) {
		ui.notifications?.warn("只有 GM 可以导入车卡器地图。");
		return null;
	}
	const Dialog = foundry.applications?.api?.DialogV2;
	if (!Dialog) return null;
	const curScene = canvas?.scene ?? null;
	const curMarkers = curScene ? (curScene.drawings ?? []).filter(d => d.getFlag?.(MODULE_ID, "unitMarker")).length : 0;
	const defaultSight = !!game.settings?.get?.(MODULE_ID, "hexWallBlocksSight");
	const content = `
<div class="lancer-cn-bm-dialog" style="display:flex;flex-direction:column;gap:8px">
	<p style="margin:0;font-size:.9em;opacity:.85">支持车卡器<b>「导出地图」</b>备份（<code>Lancer-战斗地图.json</code>）与<b>「导出到 Foundry」</b>场景文件（<code>*-foundry.json</code>）。</p>
	<label style="display:flex;flex-direction:column;gap:4px"><span>选择地图 JSON 文件</span><input type="file" name="bmFile" accept=".json,application/json"></label>
	<div data-bm-preview style="font-size:.85em;opacity:.85;min-height:1.2em"></div>
	<label style="display:flex;flex-direction:column;gap:4px"><span>导入方式</span>
		<select name="bmMode">
			<option value="new">新建独立六角格场景</option>
			<option value="current" ${curScene ? "" : "disabled"}>铺到当前场景${curScene ? `（${escHtml(curScene.name)}）` : "（当前未打开场景）"}</option>
		</select>
	</label>
	<label data-bm-name-row style="display:flex;flex-direction:column;gap:4px"><span>新场景名称（留空使用文件中的名称）</span><input type="text" name="bmName" maxlength="80" placeholder="Lancer 战斗地图"></label>
	<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" name="bmUnits" checked><span>将车卡器单位导入为底层「部署位置标记」图形</span></label>
	<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" name="bmLines" checked><span>包含画线</span></label>
	<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" name="bmSight" ${defaultSight ? "checked" : ""}><span>障碍物（六边形墙体）同时阻挡视线与光照</span></label>
	<label data-bm-cur-row style="display:none;align-items:center;gap:6px"><input type="checkbox" name="bmReplace" checked><span>铺到当前场景时，先替换此前导入过的车卡器地形与标记</span></label>
	<label data-bm-grid-row style="display:none;align-items:center;gap:6px"><input type="checkbox" name="bmSetHex" checked><span>若当前场景不是平顶六角格，自动切换为平顶六角格</span></label>
</div>`;
	const buttons = [
		{
			action: "import",
			label: "导入地图",
			icon: "fas fa-file-import",
			default: true,
			callback: async (event, button, dialog) => {
				const root = dialog?.element ?? button?.form ?? event?.currentTarget?.closest?.("form, .application");
				const file = root?.querySelector?.('input[name="bmFile"]')?.files?.[0];
				if (!file) {
					ui.notifications?.warn("请先选择车卡器导出的地图 JSON 文件。");
					return;
				}
				try {
					const text = await file.text();
					await importBattleMap(text, {
						mode: root.querySelector('select[name="bmMode"]')?.value || "new",
						name: root.querySelector('input[name="bmName"]')?.value || "",
						includeUnits: !!root.querySelector('input[name="bmUnits"]')?.checked,
						includeLines: !!root.querySelector('input[name="bmLines"]')?.checked,
						blockSight: !!root.querySelector('input[name="bmSight"]')?.checked,
						replaceImported: !!root.querySelector('input[name="bmReplace"]')?.checked,
						setHexGrid: !!root.querySelector('input[name="bmSetHex"]')?.checked,
					});
				} catch (err) {
					console.error(`${MODULE_ID} |`, err);
					ui.notifications?.error(`导入车卡器地图失败：${err.message ?? err}`);
				}
			},
		},
	];
	if (curMarkers > 0) {
		buttons.push({
			action: "clearMarkers",
			label: `清除部署标记（${curMarkers}）`,
			icon: "fas fa-eraser",
			callback: async () => { await clearUnitMarkers(curScene); },
		});
	}
	buttons.push({ action: "cancel", label: "取消", icon: "fas fa-times" });
	const dlg = new Dialog({
		window: { title: "导入车卡器战斗地图", icon: "fas fa-map-location-dot" },
		position: { width: 460 },
		content,
		buttons,
	});
	dlg.addEventListener?.("render", () => {
		const el = dlg.element;
		if (!el?.querySelector) return;
		const modeSel = el.querySelector('select[name="bmMode"]');
		const nameRow = el.querySelector("[data-bm-name-row]");
		const curRow = el.querySelector("[data-bm-cur-row]");
		const gridRow = el.querySelector("[data-bm-grid-row]");
		const fileInp = el.querySelector('input[name="bmFile"]');
		const nameInp = el.querySelector('input[name="bmName"]');
		const previewEl = el.querySelector("[data-bm-preview]");
		const syncMode = () => {
			const isCur = modeSel?.value === "current";
			if (nameRow) nameRow.style.display = isCur ? "none" : "flex";
			if (curRow) curRow.style.display = isCur ? "flex" : "none";
			if (gridRow) gridRow.style.display = isCur ? "flex" : "none";
		};
		modeSel?.addEventListener("change", syncMode);
		fileInp?.addEventListener("change", async () => {
			const f = fileInp.files?.[0];
			if (!f || !previewEl) return;
			try {
				const { map, name } = parseBattleMap(await f.text());
				const { counts } = buildSceneMapDocs(map, makeHexGrid((map.minQ & 1) ? 5 : 4, 100), { i: 0, j: 0 }, {});
				previewEl.textContent = `已识别：${map.w} × ${map.h} 格 · ${formatMapCounts(counts)}`;
				if (nameInp && !nameInp.value.trim()) nameInp.value = name;
			} catch (err) {
				previewEl.textContent = `文件无法解析：${err.message ?? err}`;
			}
		});
		syncMode();
	});
	dlg.render(true);
	return dlg;
}

class ImportBattleMapMenu {
	render() {
		openBattleMapImportDialog();
		return this;
	}
}

function addMapImportButton(app, html) {
	if (game.system?.id !== "lancer" || !game.user?.isGM) return;
	const root = html?.querySelector ? html : html?.[0] ?? app?.element;
	const buttons = root?.querySelector?.(".header-actions");
	if (!buttons || buttons.querySelector(".lancer-cn-import-map")) return;
	const doc = buttons.ownerDocument ?? globalThis.document;
	const btn = doc.createElement("button");
	btn.type = "button";
	btn.className = "lancer-cn-import-map";
	btn.style.cssText = "flex-basis: 100%; margin-top: 5px;";
	btn.innerHTML = `<i class="fas fa-map-location-dot"></i> 导入车卡器地图`;
	btn.addEventListener("click", ev => {
		ev.preventDefault();
		openBattleMapImportDialog();
	});
	buttons.append(btn);
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	game.settings.registerMenu(MODULE_ID, "importBattleMap", {
		name: "车卡器战斗地图",
		label: "导入车卡器地图",
		hint: "从车卡器导出的战斗地图 JSON 新建六角格场景，或将墙体、掩护区、困难/危险地形与部署标记铺到当前场景。",
		icon: "fas fa-map-location-dot",
		type: ImportBattleMapMenu,
		restricted: true,
	});
});
Hooks.on("renderSceneDirectory", addMapImportButton);

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
const AOE_TYPES = ["Blast", "Burst", "Line", "Cone"];
let targetSession = null;
let lastAttackTargets = null; // 上一次攻击结束时锁定的指示物 id（排序后用逗号连接）

const targetIdsKey = () => Array.from(game.user?.targets ?? []).map(t => t.id).sort().join(",");

let activeTemplatePreview = null;
let lastPlacedDirectionalTemplateId = null;
const isPlacingTemplate = () => Boolean(activeTemplatePreview || globalThis.canvas?.templates?.preview?.children?.length);

function normalizeTemplateDirection(deg) {
	const n = Number(deg);
	if (!Number.isFinite(n)) return 0;
	return (((Math.round(n * 100) / 100) % 360) + 360) % 360;
}

function isDirectionalRangeType(type, doc = null) {
	return type === "Line" || type === "Cone" || doc?.t === "ray" || doc?.t === "cone";
}

function isDirectionalTemplateDoc(doc) {
	if (!doc) return false;
	const rType = doc.getFlag?.("lancer", "range")?.type ?? doc.flags?.lancer?.range?.type;
	return isDirectionalRangeType(rType, doc);
}

function canControlTemplateDoc(doc) {
	if (!doc) return false;
	if (globalThis.game?.user?.isGM) return true;
	const uid = globalThis.game?.user?.id;
	if (!uid) return false;
	const docUid = doc.author?.id ?? doc.user?.id ?? doc.user;
	return Boolean(doc.isAuthor || (docUid && docUid === uid));
}

function findControllableDirectionalTemplate(point = null, { nearOriginOnly = false } = {}) {
	const scene = globalThis.canvas?.scene;
	const rawList = scene?.templates?.contents ?? scene?.templates ?? globalThis.canvas?.templates?.placeables?.map(p => p.document) ?? [];
	const list = Array.from(rawList).filter(d => isDirectionalTemplateDoc(d) && canControlTemplateDoc(d));
	if (!list.length) return null;
	if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
		const maxDist = nearOriginOnly ? Math.max(36, (Number(globalThis.canvas?.grid?.size) || 100) * 0.55) : Infinity;
		let best = null, bestDist = Infinity;
		for (const d of list) {
			const dist = Math.hypot((Number(d.x) || 0) - point.x, (Number(d.y) || 0) - point.y);
			if (dist <= maxDist && dist < bestDist) { best = d; bestDist = dist; }
		}
		if (best || nearOriginOnly) return best;
	}
	if (lastPlacedDirectionalTemplateId) {
		const byLast = list.find(d => d.id === lastPlacedDirectionalTemplateId);
		if (byLast) return byLast;
	}
	return list[list.length - 1];
}

async function rotatePlacedDirectionalTemplate(deltaDeg, point = null, opts = {}) {
	const doc = findControllableDirectionalTemplate(point, opts);
	if (!doc) {
		if (opts?.warnIfNone) globalThis.ui?.notifications?.warn?.("当前场景没有可旋转的线形或锥形模板。");
		return null;
	}
	const nextDir = normalizeTemplateDirection((Number(doc.direction) || 0) + (Number(deltaDeg) || 0));
	lastPlacedDirectionalTemplateId = doc.id;
	if (typeof doc.update === "function") await doc.update({ direction: nextDir });
	else doc.direction = nextDir;
	return doc;
}

function setTemplatePlacementHint(text) {
	if (typeof document === "undefined") return;
	let el = document.getElementById("lancer-cn-tmpl-hint");
	if (!text) {
		el?.remove();
		return;
	}
	if (!el) {
		el = document.createElement("div");
		el.id = "lancer-cn-tmpl-hint";
		el.style.cssText = "position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:600;padding:6px 14px;background:rgba(16,18,24,0.92);color:#edc383;border:1px solid #7a6a4f;border-radius:6px;box-shadow:0 4px 14px #000b;font-size:13px;pointer-events:none;white-space:nowrap;";
		document.body?.append(el);
	}
	el.textContent = text;
}

// 修复上游 WeaponRangeTemplate 与 Foundry v13 六角格锥形（扇形）模板的四处缺陷：
// 1) 上游注释误写 range.val 为数字字符串，若传入字符串 "1"，getBurstDistance(size) 执行 this.range.val + size / 2 会发生字符串拼接（"1" + 0.5 === "10.5"），导致所有爆发模板变成半径 10.5 / 20.5 / 30.5 格的巨型圆；
// 2) getBurstDistance(size) 漏乘 scene.dimensions.distance（若场景每格距离单位不是 1，例如手动新建场景默认的 5，爆发模板会按比例缩水）；
// 3) Foundry v13 中 canvas.app.view.onwheel 被 MouseManager 滚轮缩放抢占/吞没，且按下左键即刻按 0° 落盘导致线形（Line）与锥形（Cone）模板无法通过滚轮或拖拽瞄准旋转；
// 4) Foundry v13 HexagonalGrid.getCone 用闵可夫斯基六边形截断射线导致锥形外框扭曲成四边形风筝，且上游硬编码 angle=59（±29.5°）在尖顶 90° / 平顶 0° 漏掉 ±30° 的第 1 格制造 1 格断层空洞、在 0° / 60° 漏掉第 2 格两侧缩成细颈并误高亮起点格。
function coneAngleDiffDeg(a, b) {
	return ((((Number(a) || 0) - (Number(b) || 0)) % 360) + 540) % 360 - 180;
}

function isConeTemplate(tmplOrDoc) {
	const doc = tmplOrDoc?.document ?? tmplOrDoc;
	const t = doc?.t ?? tmplOrDoc?.t;
	const rType = doc?.getFlag?.("lancer", "range")?.type ?? doc?.flags?.lancer?.range?.type ?? tmplOrDoc?.range?.type;
	return t === "cone" || rType === "Cone";
}

function resolveConeSectorAngle(doc, isSquare = false) {
	const rType = doc?.getFlag?.("lancer", "range")?.type ?? doc?.flags?.lancer?.range?.type;
	const raw = Number(doc?.angle);
	const defaultAngle = isSquare ? 53.13 : 60;
	if (rType === "Cone" || !Number.isFinite(raw) || raw <= 0) return defaultAngle;
	if (raw === 59 || raw === 51 || raw === 60 || Math.abs(raw - 53.13) < 0.25) return defaultAngle;
	return raw;
}

function coneRangeSpaces(doc, grid = globalThis.canvas?.grid) {
	const gridDist = Number(grid?.distance ?? globalThis.canvas?.scene?.dimensions?.distance ?? globalThis.canvas?.dimensions?.distance) || 1;
	const rawDocDist = Number(doc?.distance);
	const rObj = doc?.getFlag?.("lancer", "range") ?? doc?.flags?.lancer?.range;
	const hasLancerCone = rObj?.type === "Cone";
	const lancerVal = Number(rObj?.val);
	if (Number.isFinite(rawDocDist) && rawDocDist > 0) {
		const spaces = rawDocDist / gridDist;
		if (!hasLancerCone && spaces < 0.5) return 0;
		return Math.max(1, Math.round(spaces));
	}
	if (hasLancerCone && Number.isFinite(lancerVal) && lancerVal > 0) {
		return Math.max(1, Math.round(lancerVal));
	}
	return 0;
}

// 基于二维六角布拉维晶格（兼容 HEXODDR / HEXEVENR / HEXODDQ / HEXEVENQ 四种朝向与奇偶偏移）计算《枪骑兵》锥形覆盖格：
// - 绝不包含发射起点格（d = 0）；第 1 格（d = 1）必为紧贴起点的 1 个邻接格，消除 90°/0° 断层空洞；最远端（d = N）宽度恒为 N 格；
// - 奇数阶锥形（如锥形 3 / 5 / 7）正对六个邻接轴向（±11°）时给出左右对称扇面（1 -> 3 -> 3 ...），其余角度给出标准等边三角锥（1 -> 2 -> 3 -> ... -> N）。
function computeLancerHexConeOffsets(grid, originPt, directionDeg, coneSpaces) {
	if (!grid || typeof grid.getOffset !== "function" || typeof grid.getCenterPoint !== "function") return [];
	const nNum = Number(coneSpaces);
	if (!Number.isFinite(nNum) || nNum < 1) return [];
	const N = Math.max(1, Math.round(nNum));
	const originOff = grid.getOffset(originPt ?? { x: 0, y: 0 });
	const O = grid.getCenterPoint(originOff);
	const isCols = Boolean(grid.columns);
	const stepPx = isCols
		? (Number(grid.sizeY) || Number(grid.size) || 100)
		: (Number(grid.sizeX) || Number(grid.size) || 100);

	const baseDeg = isCols ? 30 : 0;
	const U = [];
	for (let k = 0; k < 6; k++) {
		const deg = baseDeg + 60 * k;
		const rad = (deg * Math.PI) / 180;
		const nOff = grid.getOffset({ x: O.x + stepPx * Math.cos(rad), y: O.y + stepPx * Math.sin(rad) });
		const nc = grid.getCenterPoint(nOff);
		U.push({ deg, dx: nc.x - O.x, dy: nc.y - O.y, off: nOff });
	}

	const aim = normalizeTemplateDirection(directionDeg);
	let nearestAxisK = 0, nearestAxisDiff = Infinity;
	for (let k = 0; k < 6; k++) {
		const ad = Math.abs(coneAngleDiffDeg(aim, U[k].deg));
		if (ad < nearestAxisDiff) {
			nearestAxisDiff = ad;
			nearestAxisK = k;
		}
	}
	if (N === 1) return [U[nearestAxisK].off];

	const out = [];
	const seen = new Set([`${originOff.i},${originOff.j}`]);
	const addPt = (px, py) => {
		const off = grid.getOffset({ x: px, y: py });
		const key = `${off.i},${off.j}`;
		if (!seen.has(key)) {
			seen.add(key);
			out.push(off);
		}
	};

	if (N % 2 === 1 && nearestAxisDiff <= 11) {
		const uF = U[nearestAxisK];
		const uL = U[(nearestAxisK + 5) % 6];
		const uR = U[(nearestAxisK + 1) % 6];
		for (let d = 1; d <= N; d++) {
			const maxB = Math.floor(d / 2);
			addPt(O.x + d * uF.dx, O.y + d * uF.dy);
			for (let b = 1; b <= maxB; b++) {
				const a = d - b;
				addPt(O.x + a * uF.dx + b * uL.dx, O.y + a * uF.dy + b * uL.dy);
				addPt(O.x + a * uF.dx + b * uR.dx, O.y + a * uF.dy + b * uR.dy);
			}
		}
		return out;
	}

	const aimRad = (aim * Math.PI) / 180;
	const ux = Math.cos(aimRad), uy = Math.sin(aimRad);
	let bestCells = null, bestDot = -Infinity;
	for (let k = 0; k < 6; k++) {
		for (const sideK of [(k + 5) % 6, (k + 1) % 6]) {
			const uMain = U[k], uSide = U[sideK];
			const pts = [];
			let sx = 0, sy = 0;
			for (let a = 0; a < N; a++) {
				for (let b = 0; a + b < N; b++) {
					const dx = (1 + a) * uMain.dx + b * uSide.dx;
					const dy = (1 + a) * uMain.dy + b * uSide.dy;
					sx += dx;
					sy += dy;
					pts.push([O.x + dx, O.y + dy]);
				}
			}
			const len = Math.hypot(sx, sy) || 1;
			const dot = (sx / len) * ux + (sy / len) * uy;
			if (dot > bestDot + 1e-9) {
				bestDot = dot;
				bestCells = pts;
			}
		}
	}
	for (const [px, py] of bestCells ?? []) addPt(px, py);
	return out;
}

// 生成以 (0, 0) 为圆心、偶数段圆弧闭合的真圆弧扇形多边形，确保弧线中点精确穿过模板距离手柄点 (ray.dx, ray.dy)
function buildSmoothConePolygon(directionDeg, angleDeg = 60, radiusPx = 0) {
	const r = Number(radiusPx);
	if (!Number.isFinite(r) || r <= 0) {
		const emptyPts = [0, 0, 0, 0, 0, 0];
		if (globalThis.PIXI?.Polygon) return new globalThis.PIXI.Polygon(emptyPts);
		return {
			points: emptyPts,
			contains: () => false,
			getBounds: () => ({ x: 0, y: 0, width: 0, height: 0 }),
		};
	}
	const clampedAngle = Math.max(1, Math.min(360, Number(angleDeg) || 60));
	const dirRad = ((Number(directionDeg) || 0) * Math.PI) / 180;
	const halfRad = ((clampedAngle / 2) * Math.PI) / 180;
	const rawSteps = Math.max(16, Math.round((clampedAngle / 60) * 32));
	const steps = rawSteps + (rawSteps % 2);
	const pts = [];
	if (clampedAngle < 359.99) pts.push(0, 0);
	for (let s = 0; s <= steps; s++) {
		const a = dirRad - halfRad + (2 * halfRad * s) / steps;
		pts.push(
			Math.round(r * Math.cos(a) * 1000) / 1000,
			Math.round(r * Math.sin(a) * 1000) / 1000,
		);
	}
	if (clampedAngle < 359.99) pts.push(0, 0);
	if (globalThis.PIXI?.Polygon) return new globalThis.PIXI.Polygon(pts);
	let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
	for (let i = 0; i < pts.length; i += 2) {
		const px = pts[i], py = pts[i + 1];
		if (px < minX) minX = px;
		if (px > maxX) maxX = px;
		if (py < minY) minY = py;
		if (py > maxY) maxY = py;
	}
	return {
		points: pts,
		contains(x, y) {
			const dist = Math.hypot(x, y);
			if (dist > r + 1e-6) return false;
			if (clampedAngle >= 359.99 || dist < 1e-6) return true;
			const ptDeg = (Math.atan2(y, x) * 180) / Math.PI;
			return Math.abs(coneAngleDiffDeg(ptDeg, directionDeg)) <= clampedAngle / 2 + 1e-6;
		},
		getBounds() {
			return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
		},
	};
}

function findTemplateMethodOwnerProto(startProto, methodName) {
	let cur = startProto;
	while (cur && cur !== Object.prototype) {
		if (Object.prototype.hasOwnProperty.call(cur, methodName) && typeof cur[methodName] === "function") {
			return cur;
		}
		cur = Object.getPrototypeOf(cur);
	}
	return (startProto && typeof startProto[methodName] === "function") ? startProto : null;
}

function patchMeasuredTemplateCone() {
	const candidateProtos = [
		globalThis.CONFIG?.MeasuredTemplate?.objectClass?.prototype,
		globalThis.foundry?.canvas?.placeables?.MeasuredTemplate?.prototype,
		globalThis.MeasuredTemplate?.prototype,
		globalThis.game?.lancer?.canvas?.WeaponRangeTemplate?.prototype,
	].filter(Boolean);

	const shapeProtos = new Set(candidateProtos.map(p => findTemplateMethodOwnerProto(p, "_computeShape")).filter(Boolean));
	for (const proto of shapeProtos) {
		if (proto._computeShape && !proto._computeShape.lancerCnConePatched) {
			const origComputeShape = proto._computeShape;
			const patchedComputeShape = function (...args) {
				if (globalThis.game?.system?.id === "lancer" && isConeTemplate(this) && globalThis.canvas?.grid && !globalThis.canvas.grid.isGridless) {
					const grid = globalThis.canvas.grid;
					const isSq = Boolean(grid.isSquare);
					const angleDeg = resolveConeSectorAngle(this.document, isSq);
					const docDist = Number(this.document?.distance);
					const dimDistPx = Number(globalThis.canvas?.dimensions?.distancePixels);
					const gridDist = Number(grid.distance ?? globalThis.canvas?.scene?.dimensions?.distance ?? globalThis.canvas?.dimensions?.distance) || 1;
					const gridSizePx = Number(globalThis.canvas?.dimensions?.size ?? grid.size) || 100;
					const distPxPerUnit = Number.isFinite(dimDistPx) && dimDistPx > 0 ? dimDistPx : (gridSizePx / gridDist);
					let radiusPx = Number(this.ray?.distance);
					if (!(Number.isFinite(radiusPx) && radiusPx > 0) || (Number.isFinite(docDist) && docDist >= 0 && Math.abs(radiusPx - docDist * distPxPerUnit) > 1e-3)) {
						const fallbackDist = Number.isFinite(docDist) && docDist >= 0
							? docDist
							: ((Number(this.document?.getFlag?.("lancer", "range")?.val ?? this.document?.flags?.lancer?.range?.val) || 0) * gridDist);
						radiusPx = fallbackDist * distPxPerUnit;
					}
					return buildSmoothConePolygon(Number(this.document?.direction) || 0, angleDeg, radiusPx);
				}
				return origComputeShape.apply(this, args);
			};
			patchedComputeShape.lancerCnConePatched = true;
			proto._computeShape = patchedComputeShape;
		}
	}

	const hlProtos = new Set(candidateProtos.map(p => findTemplateMethodOwnerProto(p, "_getGridHighlightPositions")).filter(Boolean));
	for (const proto of hlProtos) {
		if (proto._getGridHighlightPositions && !proto._getGridHighlightPositions.lancerCnConePatched) {
			const origHighlight = proto._getGridHighlightPositions;
			const patchedHighlight = function (...args) {
				const grid = globalThis.canvas?.grid;
				const gridlessType = globalThis.CONST?.GRID_TYPES?.GRIDLESS ?? 0;
				if (globalThis.game?.system?.id === "lancer" && isConeTemplate(this) && grid && !grid.isGridless && grid.type !== gridlessType) {
					const originPt = { x: Number(this.document?.x) || 0, y: Number(this.document?.y) || 0 };
					const isHex = Boolean(grid.isHexagonal || (!grid.isSquare && grid.columns !== undefined));
					const sx = Number(grid.sizeX) || (grid.columns ? (2 / Math.sqrt(3)) * (Number(grid.size) || 100) : (Number(grid.size) || 100));
					const sy = Number(grid.sizeY) || (grid.columns ? (Number(grid.size) || 100) : (2 / Math.sqrt(3)) * (Number(grid.size) || 100));
					if (isHex) {
						const sectorAngle = resolveConeSectorAngle(this.document, false);
						const rType = this.document?.getFlag?.("lancer", "range")?.type ?? this.document?.flags?.lancer?.range?.type;
						if (rType === "Cone" || Math.abs(sectorAngle - 60) <= 10) {
							const nSpaces = coneRangeSpaces(this.document, grid);
							if (nSpaces <= 0) return [];
							const offs = computeLancerHexConeOffsets(grid, originPt, Number(this.document?.direction) || 0, nSpaces);
							return offs.map(off => {
								if (typeof grid.getTopLeftPoint === "function") return grid.getTopLeftPoint(off);
								const c = grid.getCenterPoint(off);
								return { x: c.x - sx / 2, y: c.y - sy / 2 };
							});
						}
					}
					const basePts = origHighlight.apply(this, args) ?? [];
					if (typeof grid.getOffset !== "function") return basePts;
					const originOff = grid.getOffset(originPt);
					return basePts.filter(pt => {
						if (!pt || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) return false;
						const off = grid.getOffset({ x: pt.x + sx / 2, y: pt.y + sy / 2 });
						return !(off.i === originOff.i && off.j === originOff.j);
					});
				}
				return origHighlight.apply(this, args);
			};
			patchedHighlight.lancerCnConePatched = true;
			proto._getGridHighlightPositions = patchedHighlight;
		}
	}

	const lancerApi = globalThis.game?.lancer;
	if (lancerApi && typeof lancerApi.targetsFromTemplate === "function" && !lancerApi.targetsFromTemplate.lancerCnConePatched) {
		const origTargetsFromTemplate = lancerApi.targetsFromTemplate;
		const patchedTargetsFromTemplate = function (templateId) {
			const scene = globalThis.canvas?.scene;
			const grid = globalThis.canvas?.grid;
			const gridlessType = globalThis.CONST?.GRID_TYPES?.GRIDLESS ?? 0;
			if (scene && grid && globalThis.canvas?.ready === true && !grid.isGridless && grid.type !== gridlessType) {
				const tmplDoc = scene.getEmbeddedDocument?.("MeasuredTemplate", templateId, {})
					?? scene.templates?.get?.(templateId)
					?? globalThis.canvas?.templates?.get?.(templateId)?.document;
				const tmplObj = tmplDoc?.object ?? globalThis.canvas?.templates?.get?.(templateId);
				if ((isConeTemplate(tmplDoc) || isConeTemplate(tmplObj)) && typeof tmplObj?._getGridHighlightPositions === "function") {
					const sysId = globalThis.game?.system?.id || "lancer";
					const sx = Number(grid.sizeX) || (grid.columns ? (2 / Math.sqrt(3)) * (Number(grid.size) || 100) : (Number(grid.size) || 100));
					const sy = Number(grid.sizeY) || (grid.columns ? (Number(grid.size) || 100) : (2 / Math.sqrt(3)) * (Number(grid.size) || 100));
					const positions = tmplObj._getGridHighlightPositions() ?? [];
					const hlKeys = new Set();
					for (const pt of positions) {
						if (!pt || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) continue;
						const off = grid.getOffset({ x: pt.x + sx / 2, y: pt.y + sy / 2 });
						if (off && Number.isFinite(off.i) && Number.isFinite(off.j)) hlKeys.add(`${off.i},${off.j}`);
					}
					const ignoreDoc = globalThis.canvas?.templates?.get?.(templateId)?.document ?? tmplDoc;
					const ignore = ignoreDoc?.getFlag?.(sysId, "ignore") ?? ignoreDoc?.flags?.[sysId]?.ignore;
					const igTokens = Array.isArray(ignore?.tokens) ? ignore.tokens : [];
					const igDisps = Array.isArray(ignore?.dispositions) ? ignore.dispositions : [];
					const targetIds = [];
					for (const t of globalThis.canvas?.tokens?.placeables ?? []) {
						if (!t) continue;
						const skip = igTokens.includes(t.id) || igDisps.includes(t.document?.disposition);
						const vis = t.isVisible ?? (t.visible !== false && !t.document?.hidden);
						if (skip || !vis) continue;
						const occ = tokenOccupiedOffsets(t, grid);
						if (occ.some(o => hlKeys.has(`${o.i},${o.j}`))) targetIds.push(t.id);
					}
					globalThis.canvas?.tokens?.setTargets?.(targetIds);
					return;
				}
			}
			return origTargetsFromTemplate.call(this, templateId);
		};
		patchedTargetsFromTemplate.lancerCnConePatched = true;
		lancerApi.targetsFromTemplate = patchedTargetsFromTemplate;
	}

	const defaults = globalThis.CONFIG?.MeasuredTemplate?.defaults;
	if (globalThis.game?.system?.id === "lancer" && defaults && typeof defaults === "object" && globalThis.canvas?.grid && !globalThis.canvas.grid.isGridless) {
		const curDef = Number(defaults.angle);
		if (!Number.isFinite(curDef) || curDef === 53.13 || curDef === 59 || curDef === 51 || curDef === 60) {
			defaults.angle = globalThis.canvas.grid.isSquare ? 53.13 : 60;
		}
	}

	return shapeProtos.size > 0 || hlProtos.size > 0;
}

function patchWeaponRangeTemplate() {
	patchMeasuredTemplateCone();
	const Cls = globalThis.game?.lancer?.canvas?.WeaponRangeTemplate;
	if (!Cls) return false;
	if (typeof Cls.fromRange === "function" && !Cls.fromRange.lancerCnPatched) {
		const origFromRange = Cls.fromRange;
		const patchedFromRange = function (range, creator) {
			const norm = range && typeof range === "object"
				? { ...range, val: Number(range.val) }
				: range;
			const tmpl = origFromRange.call(this, norm, creator);
			if (tmpl && (norm?.type === "Cone" || tmpl.document?.t === "cone")) {
				const coneAngle = globalThis.canvas?.grid?.isSquare ? 53.13 : 60;
				if (typeof tmpl.document?.updateSource === "function") tmpl.document.updateSource({ angle: coneAngle });
				else if (tmpl.document) tmpl.document.angle = coneAngle;
			}
			return tmpl;
		};
		patchedFromRange.lancerCnPatched = true;
		Cls.fromRange = patchedFromRange;
	}
	if (Cls.prototype && typeof Cls.prototype.getBurstDistance === "function" && !Cls.prototype.getBurstDistance.lancerCnPatched) {
		const patchedBurstDist = function (size) {
			const v = Number(this.range?.val);
			const s = Number(size);
			const gridDist = Number(globalThis.canvas?.scene?.dimensions?.distance) || 1;
			return ((Number.isFinite(v) ? v : 0) + (Number.isFinite(s) && s > 0 ? s : 1) / 2) * gridDist;
		};
		patchedBurstDist.lancerCnPatched = true;
		Cls.prototype.getBurstDistance = patchedBurstDist;
	}
	if (Cls.prototype && typeof Cls.prototype.activatePreviewListeners === "function" && !Cls.prototype.activatePreviewListeners.lancerCnPatched) {
		const patchedActivate = function (initialLayer) {
			return new Promise((resolve, reject) => {
				activeTemplatePreview = this;
				const rType = String(this.range?.type ?? "");
				const isDirectional = isDirectionalRangeType(rType, this.document);
				let originLocked = false;
				let originX = Number(this.document?.x) || 0;
				let originY = Number(this.document?.y) || 0;
				let hasManualRotation = false;
				let pressingLeft = false;
				let draggedToAim = false;
				let leftDownClient = null;
				let rightDownClient = null;
				let moveTime = 0;
				let finished = false;

				// 放置模板期间让右下角目标面板与准度面板半透明穿透，避免遮挡右下角地图格
				const fadedEls = [];
				if (typeof document !== "undefined") {
					for (const id of ["lancer-cn-targets", "hudzone"]) {
						const el = document.getElementById(id);
						if (el) {
							fadedEls.push([el, el.style.opacity, el.style.pointerEvents]);
							el.style.opacity = "0.2";
							el.style.pointerEvents = "none";
						}
					}
				}
				const updateHint = () => {
					if (!isDirectional) {
						setTemplatePlacementHint("🎯 放置范围模板：移动鼠标选择位置，左键确认放置 · 右键或 Esc 取消");
					} else if (originLocked) {
						setTemplatePlacementHint("🎯 起点已锁定：移动鼠标瞄准方向（滚轮或 Q/E/R 微调，按住 Shift 吸附 15°），再次左键确认 · 右键重选起点 / Esc 取消");
					} else {
						setTemplatePlacementHint("🎯 放置线形/锥形：左键点选起点（或按住左键拖拽瞄准）· 滚轮或 Q/E/R 旋转（Shift 微调 5°）· 右键/Esc 取消");
					}
				};
				updateHint();

				const clientToCanvas = ev => {
					const cv = globalThis.canvas;
					if (cv?.canvasCoordinatesFromClient) return cv.canvasCoordinatesFromClient({ x: ev.clientX, y: ev.clientY });
					if (this.layer?.toLocal) return this.layer.toLocal({ x: ev.clientX, y: ev.clientY });
					return { x: ev.clientX ?? 0, y: ev.clientY ?? 0 };
				};
				const isCanvasTarget = ev => {
					const view = canvasView();
					return !view || !ev?.target || ev.target === view;
				};
				const rotateBy = delta => {
					const cur = Number(this.document?.direction) || 0;
					const next = normalizeTemplateDirection(cur + delta);
					this.document.updateSource({ direction: next });
					this.refresh?.();
					hasManualRotation = true;
				};
				const aimToward = (pos, shiftSnap = false) => {
					const dx = pos.x - originX, dy = pos.y - originY;
					if (Math.hypot(dx, dy) < 4) return;
					let deg = normalizeTemplateDirection(Math.atan2(dy, dx) * (180 / Math.PI));
					deg = shiftSnap ? normalizeTemplateDirection(Math.round(deg / 15) * 15) : normalizeTemplateDirection(Math.round(deg));
					this.document.updateSource({ x: originX, y: originY, direction: deg });
					this.refresh?.();
				};

				const swallowNextClick = () => {
					if (typeof globalThis.setTimeout !== "function") return;
					const eat = ev => {
						ev.preventDefault?.();
						ev.stopImmediatePropagation?.();
						globalThis.removeEventListener?.("click", eat, true);
					};
					globalThis.addEventListener?.("click", eat, true);
					globalThis.setTimeout(() => globalThis.removeEventListener?.("click", eat, true), 120);
				};

				const cleanup = (doReject = false) => {
					if (finished) return;
					finished = true;
					if (activeTemplatePreview === this) activeTemplatePreview = null;
					setTemplatePlacementHint("");
					for (const [el, op, pe] of fadedEls) {
						el.style.opacity = op;
						el.style.pointerEvents = pe;
					}
					globalThis.removeEventListener?.("pointermove", onMove, true);
					globalThis.removeEventListener?.("pointerdown", onDown, true);
					globalThis.removeEventListener?.("pointerup", onUp, true);
					globalThis.removeEventListener?.("wheel", onWheel, true);
					globalThis.removeEventListener?.("keydown", onKey, true);
					globalThis.removeEventListener?.("contextmenu", onContext, true);
					this.actorSheet?.maximize?.();
					try {
						this.layer?.preview?.removeChildren?.()?.forEach?.(c => c.destroy?.());
					} catch { /* 忽略清理异常 */ }
					initialLayer?.activate?.();
					if (doReject) reject(new Error("Template creation cancelled"));
				};

				const commitPlacement = async pos => {
					cleanup(false);
					swallowNextClick();
					const sysId = globalThis.game?.system?.id || "lancer";
					if (isDirectional) {
						this.document.updateSource({ x: originX, y: originY, direction: normalizeTemplateDirection(this.document?.direction) });
					} else {
						let destination = this.snapToCenter(pos);
						if (this.isBurst) {
							this.document.updateSource({ [`flags.${sysId}.burstToken`]: null });
							destination = this.snapToToken(pos);
							const burstTok = this.document.flags?.[sysId]?.burstToken;
							const creatorId = this.document.flags?.[sysId]?.creator;
							const creatorTok = creatorId ? globalThis.canvas?.tokens?.get?.(creatorId) : null;
							const ignoreTok = burstTok || (creatorTok && destination.x === Math.round(creatorTok.center?.x ?? -9999) && destination.y === Math.round(creatorTok.center?.y ?? -9999) ? creatorId : null);
							if (ignoreTok) {
								const prevIgnore = this.document.flags?.[sysId]?.ignore?.tokens ?? [];
								const nextIgnore = prevIgnore.includes(ignoreTok) ? prevIgnore : [...prevIgnore, ignoreTok];
								this.document.updateSource({ [`flags.${sysId}.ignore.tokens`]: nextIgnore });
							}
						}
						this.document.updateSource(destination);
					}
					try {
						const created = (await globalThis.canvas?.scene?.createEmbeddedDocuments?.("MeasuredTemplate", [this.document.toObject()]))?.shift?.();
						if (!created) {
							reject(new Error("Template creation failed"));
							return;
						}
						if (isDirectional && created.id) lastPlacedDirectionalTemplateId = created.id;
						if (!globalThis.canvas?.app || created.object?.shape || typeof globalThis.setInterval !== "function") {
							resolve(created);
							return;
						}
						let nPolls = 0;
						const poll = globalThis.setInterval(() => {
							nPolls += 1;
							if (created.object?.shape || nPolls >= 100) {
								globalThis.clearInterval?.(poll);
								resolve(created);
							}
						}, 5);
					} catch (err) {
						reject(err);
					}
				};

				const onMove = ev => {
					if (finished) return;
					const now = Date.now();
					if (!pressingLeft && now - moveTime <= 16) return;
					moveTime = now;
					const pos = clientToCanvas(ev);
					if (isDirectional) {
						if (pressingLeft && !originLocked) {
							const distPx = leftDownClient ? Math.hypot((ev.clientX ?? 0) - leftDownClient.x, (ev.clientY ?? 0) - leftDownClient.y) : 0;
							if (distPx >= 10) {
								draggedToAim = true;
								aimToward(pos, Boolean(ev.shiftKey));
							}
							return;
						}
						if (originLocked) {
							aimToward(pos, Boolean(ev.shiftKey));
							return;
						}
					}
					const snapped = this.isBurst ? this.snapToToken(pos) : this.snapToCenter(pos);
					originX = snapped.x;
					originY = snapped.y;
					this.document.updateSource({ x: snapped.x, y: snapped.y });
					this.refresh?.();
				};

				const onDown = ev => {
					if (finished) return;
					if (ev.button === 2) {
						rightDownClient = { x: ev.clientX ?? 0, y: ev.clientY ?? 0 };
						return;
					}
					if (ev.button !== 0 || !isCanvasTarget(ev)) return;
					ev.preventDefault?.();
					ev.stopImmediatePropagation?.();
					pressingLeft = true;
					draggedToAim = false;
					leftDownClient = { x: ev.clientX ?? 0, y: ev.clientY ?? 0 };
					const pos = clientToCanvas(ev);
					if (isDirectional && !originLocked) {
						const snapped = this.snapToCenter(pos);
						originX = snapped.x;
						originY = snapped.y;
						this.document.updateSource({ x: originX, y: originY });
						this.refresh?.();
					} else if (isDirectional && originLocked) {
						aimToward(pos, Boolean(ev.shiftKey));
					}
				};

				const onUp = ev => {
					if (finished || ev.button !== 0 || !pressingLeft) return;
					pressingLeft = false;
					ev.preventDefault?.();
					ev.stopImmediatePropagation?.();
					const pos = clientToCanvas(ev);
					if (isDirectional) {
						if (originLocked || draggedToAim || hasManualRotation) {
							if (originLocked || draggedToAim) aimToward(pos, Boolean(ev.shiftKey));
							commitPlacement(pos);
						} else {
							originLocked = true;
							updateHint();
						}
						return;
					}
					commitPlacement(pos);
				};

				const onContext = ev => {
					if (finished) return;
					const dragDist = rightDownClient ? Math.hypot((ev.clientX ?? 0) - rightDownClient.x, (ev.clientY ?? 0) - rightDownClient.y) : 0;
					rightDownClient = null;
					// 右键拖拽平移镜头（>= 8px）时不取消模板放置
					if (dragDist >= 8) return;
					ev.preventDefault?.();
					ev.stopImmediatePropagation?.();
					if (isDirectional && originLocked) {
						originLocked = false;
						pressingLeft = false;
						draggedToAim = false;
						updateHint();
						return;
					}
					cleanup(true);
				};

				const onWheel = ev => {
					if (finished || !isDirectional) return;
					if (!originLocked && !isCanvasTarget(ev)) return;
					const sign = Math.sign(Number(ev.deltaY) || 0);
					if (!sign) return;
					ev.preventDefault?.();
					ev.stopImmediatePropagation?.();
					const fine = Boolean(ev.shiftKey || ev.ctrlKey);
					rotateBy(sign * (fine ? 5 : 15));
				};

				const onKey = ev => {
					if (finished) return;
					const tag = ev.target?.tagName;
					if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || ev.target?.isContentEditable) return;
					if (ev.code === "Escape" || ev.key === "Escape") {
						ev.preventDefault?.();
						ev.stopImmediatePropagation?.();
						cleanup(true);
						return;
					}
					if (!isDirectional) return;
					const step = ev.shiftKey ? 5 : 15;
					if (ev.code === "KeyQ" || ev.code === "BracketLeft" || ev.code === "ArrowLeft") {
						ev.preventDefault?.();
						ev.stopImmediatePropagation?.();
						rotateBy(-step);
					} else if (ev.code === "KeyE" || ev.code === "KeyR" || ev.code === "BracketRight" || ev.code === "ArrowRight") {
						ev.preventDefault?.();
						ev.stopImmediatePropagation?.();
						rotateBy(step);
					}
				};

				globalThis.addEventListener?.("pointermove", onMove, { capture: true });
				globalThis.addEventListener?.("pointerdown", onDown, { capture: true });
				globalThis.addEventListener?.("pointerup", onUp, { capture: true });
				globalThis.addEventListener?.("wheel", onWheel, { capture: true, passive: false });
				globalThis.addEventListener?.("keydown", onKey, { capture: true });
				globalThis.addEventListener?.("contextmenu", onContext, { capture: true });
			});
		};
		patchedActivate.lancerCnPatched = true;
		Cls.prototype.activatePreviewListeners = patchedActivate;
	}
	return true;
}

// 放置范围测量模板并自动锁定覆盖格内的指示物（复用系统 WeaponRangeTemplate 与 targetsFromTemplate；persistent 为真时不打 isAttack 标记，避免持续区域被回合切换自动清除）
async function placeAoETemplate(type, val, creatorToken = null, opts = {}) {
	patchWeaponRangeTemplate();
	const Cls = globalThis.game?.lancer?.canvas?.WeaponRangeTemplate;
	if (!Cls?.fromRange) { globalThis.ui?.notifications?.warn("当前场景尚未就绪，无法放置范围模板。"); return null; }
	const numVal = Number(val);
	if (!Number.isFinite(numVal) || numVal <= 0) return null;
	const tmpl = Cls.fromRange({ type, val: numVal }, creatorToken ?? undefined);
	if (!tmpl) return null;
	try {
		const doc = await tmpl.placeTemplate();
		if (!doc) return null;
		if (isDirectionalRangeType(type, doc) && doc.id) lastPlacedDirectionalTemplateId = doc.id;
		if (!opts?.persistent) {
			try { await doc.setFlag?.("lancer", "isAttack", true); } catch { /* 忽略标记失败 */ }
		}
		globalThis.game?.lancer?.targetsFromTemplate?.(doc.id);
		return doc;
	} catch { return null; } // 右键取消放置时不报错
}

// 武器的射程（科技攻击用感应），返回可达格数、显示文字与范围模板列表（含「投掷」标签与所有射程加成）
function attackReach(flow) {
	const item = flow?.state?.item, actor = flow?.state?.actor;
	const basic = BASIC_ACTIONS[flow?.lancerCnBasic];
	if (basic?.reach) return { reach: basic.reach, label: "邻接", aoe: [] };
	if (flow?.constructor?.name === "TechAttackFlow") {
		const s = actor?.system?.sensor_range;
		return Number.isFinite(s) ? { reach: s, label: `感应 ${s}`, aoe: [] } : { reach: null, label: "", aoe: [] };
	}
	let baseRanges = [];
	try {
		const prof = weaponProfileOf(item);
		if (Array.isArray(prof?.all_range) && prof.all_range.length) baseRanges = prof.all_range;
		else if (Array.isArray(prof?.range) && prof.range.length) baseRanges = prof.range;
		else baseRanges = item?.currentProfile?.()?.range ?? [];
	} catch { baseRanges = []; }
	const ranges = baseRanges.map(r => ({ type: r.type, val: r.val }));
	const tokugawaExposed = Boolean(actor && mechFrameLid(actor) === "mf_tokugawa" && actor.statuses?.has?.("exposed"));
	if (tokugawaExposed) {
		for (const r of ranges) {
			const n = Number(r.val);
			if (!Number.isFinite(n)) continue;
			if (r.type === "Range") r.val = n + 5;
			else if (r.type === "Threat") r.val = n + 1;
		}
	}
	const thrownVal = item ? weaponThrownVal(item, actor) : 0;
	if (thrownVal > 0 && !ranges.some(r => r.type === "Thrown")) {
		ranges.push({ type: "Thrown", val: thrownVal });
	}
	if (mechFrameLid(actor) === "mf_ext_red_admiral" && item?.system?.size === "Main" && isMeleeWeaponItem(item)) {
		for (const r of ranges) {
			if (r.type === "Threat" && Number.isFinite(Number(r.val))) r.val = Number(r.val) + 1;
		}
	}
	const vals = ranges.filter(r => REACH_TYPES.includes(r.type)).map(r => Number(r.val)).filter(Number.isFinite);
	const aoe = ranges.filter(r => AOE_TYPES.includes(r.type) && Number.isFinite(Number(r.val))).map(r => ({ type: r.type, val: Number(r.val), label: `${RANGE_ZH[r.type] ?? r.type} ${r.val}` }));
	if (weaponLidOf(item) === "mw_kkca_chakram_chain" && !aoe.some(a => a.type === "Line")) {
		aoe.push({ type: "Line", val: 5, label: "线形 5" });
	}
	return { reach: vals.length ? Math.max(...vals) : null, label: ranges.map(r => `${RANGE_ZH[r.type] ?? r.type} ${r.val}`).join(" / "), aoe };
}

const occupied = token => {
	try { const s = token.document.getOccupiedGridSpaceOffsets(); if (s?.length) return s; } catch { /* 旧版本没有这个方法 */ }
	const g = globalThis.canvas?.grid;
	return g?.getOffset ? [g.getOffset(token.center)] : [];
};
// 两个指示物之间的格数：取双方所占格子之间最近的距离（与 LANCER 从指示物边缘量射程一致）
function tokenDistance(a, b) {
	const grid = globalThis.canvas?.grid;
	if (!grid || !a || !b) return null;
	const measure = (p, q) => { const r = grid.measurePath([p, q]); return r.spaces ?? Math.round(r.distance / (grid.distance || 1)); };
	if (grid.isGridless || !grid.getOffset || !grid.getCenterPoint) {
		return measure(a.center ?? { x: a.x ?? 0, y: a.y ?? 0 }, b.center ?? { x: b.x ?? 0, y: b.y ?? 0 });
	}
	let best = Infinity;
	for (const oa of occupied(a)) for (const ob of occupied(b)) best = Math.min(best, measure(grid.getCenterPoint(oa), grid.getCenterPoint(ob)));
	return Number.isFinite(best) ? best : null;
}

// 攻击者的指示物：优先当前控制的那个，其次合成指示物文档对象、激活指示物（含非链接 NPC）或场景内指示物
function attackerToken(actor) {
	if (!actor) return null;
	const cv = globalThis.canvas;
	const tokDocId = actor.token?.id ?? null;
	if (tokDocId) {
		return cv?.tokens?.controlled?.find(t => t.id === tokDocId || t.actor === actor)
			?? actor.token?.object
			?? cv?.tokens?.get?.(tokDocId)
			?? cv?.tokens?.placeables?.find(t => t.id === tokDocId || t.actor === actor)
			?? null;
	}
	return cv?.tokens?.controlled?.find(t => t.actor === actor)
		?? actor.getActiveTokens?.(false)?.[0]
		?? actor.getActiveTokens?.(true)?.[0]
		?? cv?.tokens?.placeables?.find(t => t.actor === actor || (actor.id && t.document?.actorId === actor.id))
		?? null;
}

// 候选目标：同场景、自己看得见的指示物，按敌方 / 中立 / 友方分组，组内按距离排序
function targetCandidates(session) {
	const D = globalThis.CONST?.TOKEN_DISPOSITIONS ?? { SECRET: -2, HOSTILE: -1, NEUTRAL: 0, FRIENDLY: 1 };
	const self = session.token;
	const mine = self?.document?.disposition ?? (game.user?.isGM ? D.HOSTILE : D.FRIENDLY);
	const side = disp => {
		if (disp === D.NEUTRAL || disp === D.SECRET) return "neutral";
		if (mine === D.NEUTRAL || mine === D.SECRET) return "enemy";
		return Math.sign(disp) === Math.sign(mine) ? "ally" : "enemy";
	};
	const list = (globalThis.canvas?.tokens?.placeables ?? [])
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

function targetPanelThrownInfo(session, rows) {
	const state = session?.flow?.state;
	const item = state?.item;
	if (!item || session?.kind !== "WeaponAttackFlow" || !isMeleeWeaponItem(item)) return null;
	const mech = combatMechOf(session.actor ?? state?.actor) ?? session.actor ?? state?.actor;
	const thrownReach = weaponThrownVal(item, mech);
	const forceThrown = Boolean(state?.data?._lancerCnForceThrown);
	const isOverwatch = Boolean(state?.data?._lancerCnOverwatchAttack);
	if (thrownReach <= 0 && !forceThrown) return null;
	const threat = overwatchThreatVal(item, mech);
	let isThrown;
	if (forceThrown) {
		isThrown = true;
	} else if (isOverwatch) {
		isThrown = false;
	} else if (session.manualThrownOverride !== null && session.manualThrownOverride !== undefined) {
		isThrown = Boolean(session.manualThrownOverride);
	} else if (state?.data?.acc_diff?.weapon) {
		isThrown = Boolean(state.data.acc_diff.weapon.thrown);
	} else {
		isThrown = rows.some(r => r.targeted && r.distance != null && r.distance > threat);
	}
	return {
		canThrow: true,
		isThrown,
		threat,
		thrownReach,
		locked: forceThrown || isOverwatch,
	};
}

function targetPanelHTML(session, rows) {
	const picked = rows.filter(r => r.targeted).length;
	const thrownInfo = targetPanelThrownInfo(session, rows);
	const head = `<header><strong>${escHtml(session.title)}</strong>${session.rangeLabel ? `<span class="lcn-tp-range">${escHtml(session.rangeLabel)}</span>` : ""}
		<button type="button" data-act="collapse" title="${session.collapsed ? "展开" : "收起"}">${session.collapsed ? "▴" : "▾"}</button></header>`;
	if (session.collapsed) return head + `<p class="lcn-tp-hint">已选 ${picked} 个目标</p>`;
	const modeRow = thrownInfo
		? `<div class="lcn-tp-mode${thrownInfo.isThrown ? " is-thrown" : ""}"><span>${thrownInfo.isThrown ? "🗡️ 当前：<b>投掷攻击</b>（计掩护 · 投后离手）" : "⚔️ 当前：<b>近战挥砍</b>（无视掩护 · 不离手）"}</span>${thrownInfo.locked ? "" : `<button type="button" data-act="toggle-thrown" title="在近战挥砍与远距投掷之间手动切换（同步右侧准度面板的「投掷」开关）">${thrownInfo.isThrown ? "切为近战" : "切为投掷"}</button>`}</div>`
		: "";
	const aoeRow = session.aoe?.length
		? `<div class="lcn-tp-aoe" style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 8px;border-bottom:1px solid #444b58">${session.aoe.map(a => {
			const placeBtn = `<button type="button" data-act="template" data-aoe-type="${escHtml(a.type)}" data-aoe-val="${a.val}" title="在地图上放置${escHtml(a.label)}模板并自动选中覆盖格内的目标">放置${escHtml(a.label)}模板</button>`;
			const rotBtns = isDirectionalRangeType(a.type)
				? `<button type="button" data-act="rot-template" data-rot="-15" title="逆时针旋转已放置的线形/锥形模板 15°（按住 Shift 微调 5°；也可在画布上按住 Alt+滚轮旋转）">↺</button><button type="button" data-act="rot-template" data-rot="15" title="顺时针旋转已放置的线形/锥形模板 15°（按住 Shift 微调 5°；也可在画布上按住 Alt+滚轮旋转）">↻</button>`
				: "";
			return placeBtn + rotBtns;
		}).join("")}</div>`
		: "";
	const groups = ["enemy", "neutral", "ally"].map(side => {
		const list = rows.filter(r => r.side === side);
		if (!list.length) return "";
		return `<h4>${SIDE_ZH[side]}</h4><ul>${list.map(r => {
			let rangeTag = r.inRange === true ? " · 射程内" : r.inRange === false ? " · 射程外" : "";
			if (thrownInfo && r.inRange === true && r.distance != null) {
				rangeTag = r.distance > thrownInfo.threat ? " · 投掷射程内" : " · 威胁内";
			}
			return `<li data-token="${escHtml(r.id)}" class="${r.targeted ? "is-targeted" : ""}${r.inRange === false ? " is-out" : ""}">
			<span class="lcn-tp-check">${r.targeted ? "◉" : "○"}</span><img src="${escHtml(r.img)}" alt=""><span class="lcn-tp-name">${escHtml(r.name)}</span>
			${r.last ? '<span class="lcn-tp-badge">上次</span>' : ""}
			<span class="lcn-tp-dist">${r.distance == null ? "" : `${r.distance} 格`}${rangeTag}</span></li>`;
		}).join("")}</ul>`;
	}).join("");
	const submitLabel = thrownInfo?.isThrown
		? "🗡️ 投掷攻击"
		: session.kind === "DamageRollFlow"
			? "✓ 掷伤害"
			: "✓ 掷骰攻击";
	return head + modeRow + aoeRow + (groups || `<p class="lcn-tp-hint">场上没有可选的指示物。</p>`) +
		`<footer><span>已选 ${picked} 个 · 可点地图选敌</span><button type="button" data-act="clear"${picked ? "" : " disabled"}>清除</button><button type="button" class="lcn-tp-submit" data-act="submit-hud" title="直接按右侧准度/伤害面板当前配置发起掷骰（如需调整额外准度/难度可在右侧面板增减）">${submitLabel}</button></footer>`;
}

const TARGET_STYLE = `
#lancer-cn-targets { position: fixed; z-index: 500; width: 312px; max-height: 62vh; display: flex; flex-direction: column; background: rgba(20, 22, 28, 0.96);
	color: #e6e8ee; border: 1px solid #7a6a4f; border-radius: 6px; box-shadow: 0 4px 16px #000a; font-size: 13px; pointer-events: auto; }
#lancer-cn-targets header { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-bottom: 1px solid #444b58; }
#lancer-cn-targets header strong { flex: 1; color: #edc383; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#lancer-cn-targets .lcn-tp-range { font-size: 12px; color: #b6c1d3; }
#lancer-cn-targets .lcn-tp-mode { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-bottom: 1px solid #444b58; font-size: 11.5px; color: #c7d2e3; background: rgba(255, 255, 255, 0.03); }
#lancer-cn-targets .lcn-tp-mode.is-thrown { color: #ffd089; background: rgba(237, 195, 131, 0.12); }
#lancer-cn-targets .lcn-tp-mode span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#lancer-cn-targets button { width: auto; min-height: 0; height: 22px; line-height: 20px; padding: 0 8px; flex: 0 0 auto; font-size: 12px; cursor: pointer; }
#lancer-cn-targets button.lcn-tp-submit { background: #991e2a; color: #fff; border: 1px solid #c9404d; border-radius: 3px; font-weight: bold; }
#lancer-cn-targets button.lcn-tp-submit:hover { background: #b82534; }
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
#lancer-cn-targets footer span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`;

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

function toggleTargetPanelThrownMode() {
	if (!targetSession) return null;
	const rows = targetSession.rows ?? targetCandidates(targetSession);
	const info = targetPanelThrownInfo(targetSession, rows);
	if (!info || info.locked) return null;
	const nextVal = !info.isThrown;
	targetSession.manualThrownOverride = nextVal;
	const state = targetSession.flow?.state;
	if (state?.data?.acc_diff?.weapon) {
		state.data.acc_diff.weapon.thrown = nextVal;
		syncWeaponThrownMode(state, { explicitAccDiff: true });
	}
	renderTargetPanel();
	return nextVal;
}

function submitActiveHud() {
	if (typeof document === "undefined") return false;
	const state = targetSession?.flow?.state;
	if (state) {
		if (targetSession?.manualThrownOverride !== null && targetSession?.manualThrownOverride !== undefined && state.data?.acc_diff?.weapon) {
			state.data.acc_diff.weapon.thrown = Boolean(targetSession.manualThrownOverride);
			syncWeaponThrownMode(state, { explicitAccDiff: true });
		} else {
			syncWeaponThrownMode(state);
		}
	}
	const isDmg = targetSession?.kind === "DamageRollFlow";
	const formSel = isDmg ? "#damage-hud" : "#accdiff-hud";
	const form = document.querySelector(formSel) ?? document.querySelector("#hudzone form");
	const btn = form?.querySelector?.('button[data-button="submit"], button[type="submit"]')
		?? document.querySelector('#hudzone button[data-button="submit"], #hudzone button[type="submit"]');
	if (btn && typeof btn.click === "function") {
		btn.click();
		return true;
	}
	if (form && typeof form.requestSubmit === "function") {
		form.requestSubmit();
		return true;
	}
	return false;
}

function onTargetPanelClick(ev) {
	const btn = ev.target.closest?.("button[data-act]");
	if (btn?.dataset.act === "clear") {
		if (targetSession) targetSession.manualThrownOverride = null;
		clearTargets();
		return;
	}
	if (btn?.dataset.act === "collapse") { targetSession.collapsed = !targetSession.collapsed; renderTargetPanel(); return; }
	if (btn?.dataset.act === "toggle-thrown") { toggleTargetPanelThrownMode(); return; }
	if (btn?.dataset.act === "submit-hud") {
		if (!submitActiveHud() && typeof globalThis.setTimeout === "function") {
			globalThis.setTimeout(() => submitActiveHud(), 80);
		}
		return;
	}
	if (btn?.dataset.act === "template") {
		placeAoETemplate(btn.dataset.aoeType, Number(btn.dataset.aoeVal), targetSession?.token).catch(err => reportError("放置范围模板", err));
		return;
	}
	if (btn?.dataset.act === "rot-template") {
		const base = Number(btn.dataset.rot) || 15;
		const delta = ev.shiftKey ? Math.sign(base) * 5 : base;
		rotatePlacedDirectionalTemplate(delta, null, { warnIfNone: true }).catch(err => reportError("旋转范围模板", err));
		return;
	}
	const li = ev.target.closest?.("li[data-token]");
	if (li) toggleTarget(canvas.tokens.get(li.dataset.token));
}

function onHudZoneChange(ev) {
	if (!targetSession || !ev?.target?.closest?.("#accdiff-hud")) return;
	if (ev.target?.type === "checkbox") {
		const st = targetSession.flow?.state;
		if (st?.data?.acc_diff?.weapon && isMeleeWeaponItem(st.item)) {
			// 允许右侧准度面板手动勾选/取消「投掷（*）」后同步反映到左侧目标面板
			globalThis.setTimeout?.(() => {
				if (targetSession?.flow?.state === st && st.data?.acc_diff?.weapon) {
					targetSession.manualThrownOverride = Boolean(st.data.acc_diff.weapon.thrown);
					refreshTargetPanel();
				}
			}, 0);
		}
	}
}

function openTargetPicker(flow) {
	if (!game.settings.get(MODULE_ID, "targetPicker")) return;
	const kind = flow?.constructor?.name;
	// 从攻击卡掷伤害时目标已经确定（系统按命中结果锁定），不打扰
	if (kind === "DamageRollFlow" && flow.state?.data?.hit_results?.length) return;
	const actor = flow?.state?.actor;
	// 武器已投出尚未拾回时由 initAttackData 拦截提示，不弹出目标面板
	if (kind === "WeaponAttackFlow" && isWeaponThrownOut(combatMechOf(actor) ?? actor, flow?.state?.item)) return;
	const { reach, label, aoe } = attackReach(flow);
	const attack = kind !== "DamageRollFlow";
	const session = {
		flow, kind, actor, token: attackerToken(actor), reach, rangeLabel: label, aoe: aoe ?? [], collapsed: false,
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

// 面板开着时：左键点地图上的指示物 = 锁定 / 取消锁定（与六边形墙体一样在 window 捕获阶段拦截，图层收不到这次点击；正在放置范围模板时不拦截）
function onTargetPointer(event) {
	const s = targetSession;
	if (!s || isPlacingTemplate() || event.type !== "pointerdown" || event.button !== 0 || event.target !== canvasView()) return;
	if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
	const p = canvas.canvasCoordinatesFromClient({ x: event.clientX, y: event.clientY });
	const hits = (canvas.tokens?.placeables ?? []).filter(t => t !== s.token && t.actor && t.visible && t.bounds?.contains?.(p.x, p.y));
	if (!hits.length) return;
	event.stopImmediatePropagation();
	event.preventDefault();
	toggleTarget(hits[hits.length - 1]); // 叠在一起时取最上面的
}

// 模板落盘后无需切换测量工具栏即可在画布直接旋转线形 / 锥形模板，并在模板旋转或移动后自动重新锁定覆盖目标
function onPlacedTemplateWheel(event) {
	if (isPlacingTemplate() || !globalThis.canvas?.ready || event.target !== canvasView()) return;
	const sign = Math.sign(Number(event.deltaY) || 0);
	if (!sign) return;
	const pt = globalThis.canvas.canvasCoordinatesFromClient
		? globalThis.canvas.canvasCoordinatesFromClient({ x: event.clientX, y: event.clientY })
		: null;
	// 1) 按住 Alt + 滚轮：随时旋转自己的已放置线形/锥形模板（按住 Shift 微调 5°），不与缩放地图或旋转指示物冲突
	if (event.altKey && !event.ctrlKey && !event.metaKey) {
		const doc = findControllableDirectionalTemplate(pt);
		if (!doc) return;
		event.preventDefault?.();
		event.stopImmediatePropagation?.();
		const step = event.shiftKey ? 5 : 15;
		rotatePlacedDirectionalTemplate(sign * step, pt).catch(err => reportError("旋转范围模板", err));
		return;
	}
	// 2) 在非测量图层下，鼠标悬停于已放置线形/锥形模板起点且未选中/悬停任何指示物时，Shift/Ctrl + 滚轮直接旋转该模板
	if ((event.shiftKey || event.ctrlKey) && !event.altKey && !event.metaKey) {
		const activeName = globalThis.canvas.activeLayer?.options?.name ?? globalThis.ui?.controls?.control?.name;
		if (activeName === "templates") return;
		const hasHoveredOrControlledToken = Boolean(globalThis.canvas.tokens?.hover || globalThis.canvas.tokens?.controlled?.length);
		if (hasHoveredOrControlledToken) return;
		const doc = findControllableDirectionalTemplate(pt, { nearOriginOnly: true });
		if (!doc) return;
		event.preventDefault?.();
		event.stopImmediatePropagation?.();
		const step = event.ctrlKey ? 5 : 15;
		rotatePlacedDirectionalTemplate(sign * step, pt, { nearOriginOnly: true }).catch(err => reportError("旋转范围模板", err));
	}
}

let templateRetargetTimer = null;
function onUpdateMeasuredTemplate(doc, changed, _options, userId) {
	if (!doc?.id || userId !== globalThis.game?.user?.id) return;
	if (!changed || !("direction" in changed || "x" in changed || "y" in changed || "distance" in changed)) return;
	const hasLancerRange = Boolean(doc.getFlag?.("lancer", "range") ?? doc.flags?.lancer?.range);
	if (!hasLancerRange) return;
	const isAttack = Boolean(doc.getFlag?.("lancer", "isAttack") ?? doc.flags?.lancer?.isAttack);
	if (!isAttack && doc.id !== lastPlacedDirectionalTemplateId) return;
	const applyRetarget = () => {
		try {
			if (globalThis.canvas?.templates?.get && !globalThis.canvas.templates.get(doc.id)) return;
			globalThis.game?.lancer?.targetsFromTemplate?.(doc.id);
			refreshTargetPanel();
		} catch (err) { console.error(`${MODULE_ID} |`, err); }
	};
	if (typeof globalThis.setTimeout === "function") {
		globalThis.clearTimeout?.(templateRetargetTimer);
		templateRetargetTimer = globalThis.setTimeout(applyRetarget, 30);
	} else {
		applyRetarget();
	}
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	const opt = (key, name, hint) => game.settings.register(MODULE_ID, key, { name, hint, scope: "client", config: true, type: Boolean, default: true });
	opt("targetPicker", "攻击时显示目标选择面板", "开始攻击、科技攻击时，在准度面板旁列出场上的指示物（按距离排序、标出是否在射程内），点一下即可锁定；面板开着时也可以直接点地图上的指示物锁定。");
	opt("targetClearStale", "开始新攻击时清除上一次的目标", "如果锁定的仍是上一次攻击的目标（之后没有改动），开始新攻击时先清除。");
	opt("targetAutoPick", "射程内只有一个敌人时自动选中", "开始攻击时没有锁定目标、而射程内恰好只有一个敌方指示物时，自动锁定它。");
	globalThis.addEventListener?.("pointerdown", onTargetPointer, { capture: true });
	globalThis.addEventListener?.("change", onHudZoneChange, { capture: true });
	globalThis.addEventListener?.("wheel", onPlacedTemplateWheel, { capture: true, passive: false });
	for (const name of TARGET_FLOWS) {
		Hooks.on(`lancer.preFlow.${name}`, flow => { try { openTargetPicker(flow); } catch (err) { console.error(`${MODULE_ID} |`, err); } });
		Hooks.on(`lancer.postFlow.${name}`, (flow, success) => closeTargetPicker(flow, success));
	}
});
Hooks.on("updateMeasuredTemplate", onUpdateMeasuredTemplate);
let targetRefreshTimer = null;
const refreshTargetPanel = () => {
	if (!targetSession) return;
	if (typeof globalThis.setTimeout === "function") {
		globalThis.clearTimeout?.(targetRefreshTimer);
		targetRefreshTimer = globalThis.setTimeout(renderTargetPanel, 50);
	} else {
		renderTargetPanel();
	}
};
Hooks.on("targetToken", user => {
	if (user?.isSelf ?? user === game.user) {
		if (targetSession) targetSession.manualThrownOverride = null;
		if (targetSession?.flow?.state) syncWeaponThrownMode(targetSession.flow.state);
		refreshTargetPanel();
	}
});
Hooks.on("preUpdateToken", onPreUpdateTokenOverwatch);
Hooks.on("updateToken", (doc, changes, options, userId) => {
	refreshTargetPanel();
	onSensorTokenUpdate(doc);
	onOverwatchTokenUpdate(doc, changes, options, userId)?.catch?.(err => reportError("守望检测", err));
	onCoverAuraTokenUpdate(doc, changes, options, userId)?.catch?.(err => reportError("跟随掩护圈移动", err));
});
Hooks.on("createToken", doc => {
	refreshTargetPanel();
	onCoverAuraCreateToken(doc)?.catch?.(err => reportError("生成跟随掩护圈", err));
});
Hooks.on("deleteToken", doc => {
	refreshTargetPanel();
	onSensorTokenDelete(doc);
	onCoverAuraDeleteToken(doc)?.catch?.(err => reportError("移除跟随掩护圈", err));
});
Hooks.on("controlToken", refreshTargetPanel);

// ---------------------------------------------------------------------------
// 鼠标悬停感应范围雷达圈（1.14.0）：
// - 鼠标悬停在机甲（mech）或允许查看的 NPC 指示物上时，纯客户端绘制感应范围「外轮廓雷达线 + 极淡底色」，移开即刻消失。
// - 六角格 / 方格下按指示物全部占地格向四周量取 <= sensor_range 格，经有向半边抵消拼接为闭合外轮廓多边形（无内部网格接缝）；无网格场景回退为同心圆。
// - 隐私规则：GM 可查看场上全部机甲与 NPC；非 GM 玩家默认仅查看拥有观察权限或友方的角色（避免未经扫描剧透敌方 NPC 感应），也可在世界设置改为全场公开。
const SENSOR_SCOPE_MODES = {
	friendly: "玩家仅看友方与拥有观察权限的角色（GM 可看全场）",
	all: "所有人可看场上全部可见机甲与 NPC",
};
const SENSOR_COLORS = { friendly: 0x38bdf8, hostile: 0xf97316, neutral: 0xeab308 };
const sensorGeomCache = new Map();
const MAX_SENSOR_CACHE = 64;
let sensorGraphics = null;
let hoveredSensorToken = null;
let lastSensorRenderKey = "";

function tokenSensorRange(token) {
	const actor = token?.actor;
	if (!actor || (actor.type !== "mech" && actor.type !== "npc")) return 0;
	const s = Number(actor.system?.sensor_range);
	return Number.isFinite(s) && s > 0 ? Math.min(40, Math.round(s)) : 0;
}

function canShowSensorForToken(token) {
	if (!getSetting("sensorHoverOverlay", true)) return false;
	if (!token || token.destroyed || tokenSensorRange(token) <= 0) return false;
	const isGM = !!game?.user?.isGM;
	if (!isGM && (token.visible === false || token.document?.hidden)) return false;
	if (isGM) return true;
	if (getSetting("sensorHoverScope", "friendly") === "all") return true;
	const actor = token.actor;
	if (actor?.isOwner) return true;
	const obsLvl = CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OBSERVER ?? 2;
	try {
		if (typeof actor?.testUserPermission === "function" && game?.user && actor.testUserPermission(game.user, "OBSERVER")) return true;
		if (typeof actor?.getUserLevel === "function" && game?.user && actor.getUserLevel(game.user) >= obsLvl) return true;
	} catch { /* ignore */ }
	const friendlyDisp = CONST?.TOKEN_DISPOSITIONS?.FRIENDLY ?? 1;
	return token.document?.disposition === friendlyDisp;
}

function sensorRadarColor(token) {
	const D = CONST?.TOKEN_DISPOSITIONS ?? { SECRET: -2, HOSTILE: -1, NEUTRAL: 0, FRIENDLY: 1 };
	const disp = token?.document?.disposition;
	if (disp === D.HOSTILE) return SENSOR_COLORS.hostile;
	if (disp === D.NEUTRAL || disp === D.SECRET) return SENSOR_COLORS.neutral;
	return SENSOR_COLORS.friendly;
}

function tokenOccupiedOffsets(token, grid = canvas?.grid) {
	const doc = token?.document;
	if (typeof doc?.getOccupiedGridSpaceOffsets === "function") {
		try {
			const arg = Number.isFinite(token?.x) && Number.isFinite(token?.y) ? { x: token.x, y: token.y } : undefined;
			const s = arg ? doc.getOccupiedGridSpaceOffsets(arg) : doc.getOccupiedGridSpaceOffsets();
			if (s?.length) return s;
		} catch {
			try { const s = doc.getOccupiedGridSpaceOffsets(); if (s?.length) return s; } catch { /* ignore */ }
		}
	}
	if (grid?.getOffset) {
		const c = token?.center ?? { x: token?.x ?? doc?.x ?? 0, y: token?.y ?? doc?.y ?? 0 };
		return [grid.getOffset(c)];
	}
	return [];
}

function gridCellDistance(grid, ptA, ptB, offA, offB) {
	if (typeof grid?.measurePath === "function") {
		const r = grid.measurePath([ptA, ptB]);
		if (Number.isFinite(r?.spaces)) return r.spaces;
		if (Number.isFinite(r?.distance)) return Math.round(r.distance / (grid.distance || 1));
	}
	if (grid?.columns !== undefined) {
		const even = !!grid.even;
		if (grid.columns) {
			const aq1 = offA.j, ar1 = offA.i - Math.floor((offA.j + (even ? 1 : 0)) / 2);
			const aq2 = offB.j, ar2 = offB.i - Math.floor((offB.j + (even ? 1 : 0)) / 2);
			const dq = aq1 - aq2, dr = ar1 - ar2;
			return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
		}
		const ar1 = offA.i, aq1 = offA.j - Math.floor((offA.i + (even ? 1 : 0)) / 2);
		const ar2 = offB.i, aq2 = offB.j - Math.floor((offB.i + (even ? 1 : 0)) / 2);
		const dq = aq1 - aq2, dr = ar1 - ar2;
		return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
	}
	return Math.max(Math.abs(offA.i - offB.i), Math.abs(offA.j - offB.j));
}

function computeSensorGeometry(token, grid = canvas?.grid) {
	const range = tokenSensorRange(token);
	if (!grid || range <= 0) return null;
	const sizePx = Number(grid.size) || 100;
	if (grid.isGridless || typeof grid.getVertices !== "function" || typeof grid.getCenterPoint !== "function") {
		const c = token?.center ?? { x: token?.x ?? 0, y: token?.y ?? 0 };
		const wSpaces = Math.max(Number(token?.document?.width) || 0, Number(token?.actor?.system?.size) || 1, 0.5);
		const tokenRadiusPx = Number.isFinite(token?.w) && Number.isFinite(token?.h) && (token.w > 0 || token.h > 0)
			? Math.max(token.w, token.h) / 2
			: (wSpaces * sizePx) / 2;
		const radius = tokenRadiusPx + range * sizePx;
		return {
			mode: "gridless",
			range,
			cx: c.x,
			cy: c.y,
			radius,
			cacheKey: `gridless|${Math.round(c.x)}|${Math.round(c.y)}|${Math.round(radius)}`,
		};
	}

	const occ = tokenOccupiedOffsets(token, grid);
	if (!occ.length) return null;
	const occSorted = occ.map(o => `${o.i},${o.j}`).sort().join(";");
	const sceneId = canvas?.scene?.id ?? "";
	const cacheKey = `${sceneId}|${grid.type ?? ""}|${sizePx}|${grid.distance ?? 1}|${occSorted}|${range}`;
	const cached = sensorGeomCache.get(cacheKey);
	if (cached) return cached;

	const occSet = new Set(occ.map(o => `${o.i},${o.j}`));
	const occItems = occ.map(o => ({ off: o, pt: grid.getCenterPoint(o) }));
	let minI = Infinity, maxI = -Infinity, minJ = Infinity, maxJ = -Infinity;
	for (const o of occ) {
		if (o.i < minI) minI = o.i;
		if (o.i > maxI) maxI = o.i;
		if (o.j < minJ) minJ = o.j;
		if (o.j > maxJ) maxJ = o.j;
	}

	const reachable = [];
	const pad = range + 2;
	for (let i = minI - pad; i <= maxI + pad; i++) {
		for (let j = minJ - pad; j <= maxJ + pad; j++) {
			const off = { i, j };
			if (occSet.has(`${i},${j}`)) {
				reachable.push(off);
				continue;
			}
			const pt = grid.getCenterPoint(off);
			let okDist = false;
			for (const oc of occItems) {
				if (gridCellDistance(grid, oc.pt, pt, oc.off, off) <= range) {
					okDist = true;
					break;
				}
			}
			if (okDist) reachable.push(off);
		}
	}

	// 空间桶去重共享顶点（容差 0.35px），再通过有向半边抵消提取无内部接缝的闭合外轮廓多边形
	const canonVerts = [];
	const vBuckets = new Map();
	const vidOf = p => {
		const bx = Math.round(p.x), by = Math.round(p.y);
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				const list = vBuckets.get(`${bx + dx},${by + dy}`);
				if (!list) continue;
				for (const id of list) {
					const v = canonVerts[id];
					if (Math.abs(v.x - p.x) <= 0.35 && Math.abs(v.y - p.y) <= 0.35) return id;
				}
			}
		}
		const id = canonVerts.length;
		canonVerts.push({ x: p.x, y: p.y });
		const bk = `${bx},${by}`;
		let list = vBuckets.get(bk);
		if (!list) { list = []; vBuckets.set(bk, list); }
		list.push(id);
		return id;
	};

	const halfEdges = new Set();
	for (const off of reachable) {
		const rawVerts = grid.getVertices(off);
		if (!rawVerts || rawVerts.length < 3) continue;
		let area2 = 0;
		for (let k = 0; k < rawVerts.length; k++) {
			const a = rawVerts[k], b = rawVerts[(k + 1) % rawVerts.length];
			area2 += a.x * b.y - b.x * a.y;
		}
		const verts = area2 >= 0 ? rawVerts : [...rawVerts].reverse();
		const ids = verts.map(vidOf);
		for (let k = 0; k < ids.length; k++) {
			const u = ids[k], v = ids[(k + 1) % ids.length];
			if (u === v) continue;
			const rev = `${v}:${u}`;
			if (halfEdges.has(rev)) halfEdges.delete(rev);
			else halfEdges.add(`${u}:${v}`);
		}
	}

	const outMap = new Map();
	for (const edge of halfEdges) {
		const sep = edge.indexOf(":");
		const u = Number(edge.slice(0, sep)), v = Number(edge.slice(sep + 1));
		let arr = outMap.get(u);
		if (!arr) { arr = []; outMap.set(u, arr); }
		arr.push(v);
	}

	const loops = [];
	for (const [startU, startArr] of outMap) {
		while (startArr.length) {
			const chain = [startU];
			let curr = startArr.pop();
			let guard = 0;
			while (curr !== undefined && curr !== startU && guard++ < 10000) {
				chain.push(curr);
				const nextArr = outMap.get(curr);
				if (!nextArr?.length) break;
				curr = nextArr.pop();
			}
			if (chain.length >= 3) loops.push(chain.map(id => canonVerts[id]));
		}
	}

	const res = { mode: "grid", range, cellsCount: reachable.length, loops, cacheKey };
	if (sensorGeomCache.size >= MAX_SENSOR_CACHE) {
		const firstKey = sensorGeomCache.keys().next().value;
		sensorGeomCache.delete(firstKey);
	}
	sensorGeomCache.set(cacheKey, res);
	return res;
}

function sensorOverlayParent() {
	const cand = [canvas?.interface?.grid, canvas?.interface, canvas?.stage];
	return cand.find(c => c && !c.destroyed && typeof c.addChild === "function") ?? null;
}

function ensureSensorGraphics() {
	const parent = sensorOverlayParent();
	const GraphicsCls = globalThis.PIXI?.Graphics;
	if (!parent || typeof GraphicsCls !== "function") return null;
	if (sensorGraphics && !sensorGraphics.destroyed) {
		if (sensorGraphics.parent !== parent) parent.addChild(sensorGraphics);
		return sensorGraphics;
	}
	const g = new GraphicsCls();
	g.name = "lancer-cn-sensor-radar";
	g.eventMode = "none";
	g.interactive = false;
	g.interactiveChildren = false;
	parent.addChild(g);
	sensorGraphics = g;
	return g;
}

function clearSensorOverlay(destroy = false) {
	hoveredSensorToken = null;
	lastSensorRenderKey = "";
	if (!sensorGraphics) return;
	try {
		if (!sensorGraphics.destroyed) {
			sensorGraphics.clear?.();
			sensorGraphics.visible = false;
			if (destroy) {
				sensorGraphics.parent?.removeChild?.(sensorGraphics);
				sensorGraphics.destroy?.({ children: true });
			}
		}
	} catch { /* ignore */ }
	if (destroy || sensorGraphics?.destroyed) sensorGraphics = null;
}

function renderSensorOverlay(token, force = false) {
	if (!canShowSensorForToken(token)) {
		clearSensorOverlay(false);
		return false;
	}
	const geom = computeSensorGeometry(token);
	if (!geom) {
		clearSensorOverlay(false);
		return false;
	}
	const g = ensureSensorGraphics();
	if (!g) return false;
	const color = sensorRadarColor(token);
	const renderKey = `${geom.cacheKey}|${color}`;
	if (!force && g.visible && lastSensorRenderKey === renderKey) return true;

	g.clear();
	if (geom.mode === "gridless") {
		g.lineStyle(0);
		g.beginFill(color, 0.075);
		g.drawCircle(geom.cx, geom.cy, geom.radius);
		g.endFill();
		g.lineStyle(6, color, 0.18);
		g.drawCircle(geom.cx, geom.cy, geom.radius);
		g.lineStyle(2.2, color, 0.88);
		g.drawCircle(geom.cx, geom.cy, geom.radius);
	} else {
		if (!geom.loops.length) {
			clearSensorOverlay(false);
			return false;
		}
		const flatLoops = geom.loops.map(loop => loop.flatMap(p => [p.x, p.y]));
		g.lineStyle(0);
		g.beginFill(color, 0.075);
		for (const pts of flatLoops) g.drawPolygon(pts);
		g.endFill();
		g.lineStyle(6, color, 0.18);
		for (const pts of flatLoops) g.drawPolygon(pts);
		g.lineStyle(2.2, color, 0.88);
		for (const pts of flatLoops) g.drawPolygon(pts);
	}
	g.visible = true;
	lastSensorRenderKey = renderKey;
	return true;
}

function refreshHoveredSensor() {
	if (!hoveredSensorToken) return;
	if (!canShowSensorForToken(hoveredSensorToken)) {
		clearSensorOverlay(false);
		return;
	}
	renderSensorOverlay(hoveredSensorToken);
}

function onHoverSensorToken(token, hovered) {
	if (hovered) {
		if (canShowSensorForToken(token)) {
			hoveredSensorToken = token;
			renderSensorOverlay(token);
		} else if (!hoveredSensorToken || hoveredSensorToken === token || !hoveredSensorToken.hover) {
			clearSensorOverlay(false);
		}
		return;
	}
	if (hoveredSensorToken && hoveredSensorToken !== token) return;
	const fallback = (globalThis.canvas?.tokens?.placeables ?? []).find(t => t !== token && t.hover && canShowSensorForToken(t));
	if (fallback) {
		hoveredSensorToken = fallback;
		renderSensorOverlay(fallback);
	} else {
		clearSensorOverlay(false);
	}
}

function onSensorTokenUpdate(doc) {
	if (!hoveredSensorToken) return;
	const obj = doc?.object ?? canvas?.tokens?.get?.(doc?.id);
	if (obj === hoveredSensorToken || doc?.id === hoveredSensorToken.id) refreshHoveredSensor();
}

function onSensorTokenDelete(doc) {
	if (!hoveredSensorToken) return;
	const obj = doc?.object;
	if (obj === hoveredSensorToken || doc?.id === hoveredSensorToken.id) clearSensorOverlay(false);
}

function onSensorActorUpdate(actor) {
	if (!hoveredSensorToken || !actor) return;
	const hActor = hoveredSensorToken.actor;
	if (hActor === actor || hActor?.id === actor.id || hActor?.system?.pilot?.value === actor) {
		refreshHoveredSensor();
	}
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	game.settings.register(MODULE_ID, "sensorHoverOverlay", {
		name: "鼠标悬停显示感应范围",
		hint: "鼠标悬停在机甲或允许查看的 NPC 指示物上时，在画布上显示其感应范围的外轮廓雷达线与极淡底色，移开鼠标即消失。",
		scope: "client", config: true, type: Boolean, default: true,
		onChange: () => refreshHoveredSensor(),
	});
	game.settings.register(MODULE_ID, "sensorHoverScope", {
		name: "悬停感应圈可见范围",
		hint: "控制非 GM 玩家将鼠标移到指示物上时能否看到感应圈（依核心规则，敌方 NPC 的感应数值在扫描前默认不公开；GM 始终可查看场上全部机甲与 NPC）。",
		scope: "world", config: true, type: String, choices: SENSOR_SCOPE_MODES, default: "friendly",
		onChange: () => refreshHoveredSensor(),
	});
});
Hooks.on("hoverToken", onHoverSensorToken);
Hooks.on("refreshToken", token => { if (token === hoveredSensorToken) refreshHoveredSensor(); });
Hooks.on("canvasTearDown", () => { clearSensorOverlay(true); sensorGeomCache.clear(); });

// ---------------------------------------------------------------------------
// 召唤物自动掩护圈与指示物跟随掩护区域（1.19.0）：
// - 将自带硬/软掩护效果的部署物/无人机拖上地图（或一键部署）时，自动生成绑定到该指示物的 Region 掩护区；
// - 区分处理：普通实体掩体（耶利哥展开掩体、铁磁钉壁、拓荒工位、双耳瓶无人机、立方体等）仅覆盖周围邻接 1 格（打掩体自身不吃 -2 减值）；
//   明确写明自身也受益的（盾牌阵列无人机、虫巢无人机）覆盖自身+周边并赋予自身状态；内部掩体型（便携式地堡、炮兵阵地、地被覆盖）覆盖自身占地格且掩体自身不挂状态；
// - 拖动棋子时实时重算并平移绑定的掩护区，进出范围的角色自动挂/卸掩护；棋子 HP 归零（失能/摧毁）或删除时自动移除掩护区（修复回血自动恢复）；
// - 支持通过右键 Token HUD 盾牌按钮或角色表快捷按钮为任意指示物手动绑定/切换/关闭跟随掩护圈。
const DEPLOYABLE_AUTO_COVER_RULES = [
	// 1. 普通实体硬掩体：仅覆盖周围邻接 1 格环状区域，部署物自身不获得硬性掩护
	{
		lids: ["dep_耶利哥展开掩体", "dep_jericho_deployable_cover", "ms_pattern_a_jericho_deployable_cover"],
		names: ["耶利哥展开掩体", "Jericho Deployable Cover"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	{
		lids: ["dep_铁磁钉壁", "dep_ferrospike_barrier", "ms_ferrospike_barrier"],
		names: ["铁磁钉壁", "Ferrospike Barrier"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	{
		lids: ["dep_拓荒工位", "dep_workbench", "ms_pl_piof_workbench"],
		names: ["拓荒工位", "Workbench"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	{
		lids: ["dep_双耳瓶无人机", "dep_amphora_drone", "ms_piof_amphora_drone"],
		names: ["双耳瓶无人机", "Amphora Drone"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	{
		lids: ["dep_熔渣", "dep_slag", "mw_slag_cannon"],
		names: ["熔渣", "熔渣堆", "Slag"],
		excludeNames: ["矿渣爆爆"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	{
		lids: ["npcf_cn_barricade_2", "npcf_portable_printer_barricade"],
		names: ["便携打印机", "路障立方体"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	{
		lids: ["npcf_x_ss_2_5"],
		names: ["气候节点"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	{
		lids: ["npcf_x_cp_6_7"],
		names: ["香炉构造", "数据香炉节点"],
		cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false,
	},
	// 2. 自身与周边同享硬性掩护
	{
		lids: ["dep_盾牌阵列无人机", "dep_shield_array_drone", "dep_shield_array", "ms_ch_shield_array"],
		names: ["盾牌阵列无人机", "Shield Array Drone", "Shield Array"],
		cover: "hard", radius: 1, includeSelfCells: true, grantToSelfActor: true,
	},
	// 3. 内部硬性掩护（覆盖自身占地格供内部角色受益，建筑本身不挂硬性掩护状态）
	{
		lids: ["dep_便携式地堡", "dep_portable_bunker", "ms_portable_bunker"],
		names: ["便携式地堡", "Portable Bunker"],
		cover: "hard", radius: 0, includeSelfCells: true, grantToSelfActor: false,
	},
	{
		lids: ["dep_炮兵阵地", "dep_artillery_emplacement"],
		names: ["炮兵阵地", "Artillery Emplacement"],
		cover: "hard", radius: 0, includeSelfCells: true, grantToSelfActor: false,
	},
	{
		lids: ["dep_地被覆盖"],
		names: ["地被覆盖"],
		cover: "hard", radius: 0, includeSelfCells: true, grantToSelfActor: false,
	},
	// 4. 软性掩护范围场
	{
		lids: ["dep_虫巢无人机", "dep_hive_drone", "ms_hive_drone"],
		names: ["虫巢无人机", "Hive Drone"],
		cover: "soft", radius: 2, includeSelfCells: true, grantToSelfActor: true,
	},
	{
		lids: ["dep_烟雾发生器", "dep_smoke_generator", "ms_piof_smoke_generator"],
		names: ["烟雾发生器", "Smoke Generator"],
		cover: "soft", radius: 1, includeSelfCells: true, grantToSelfActor: false,
	},
	{
		lids: ["dep_剃刀虫群", "dep_razor_swarm", "npcf_cn_hive_3", "npcf_razor_swarm_hive"],
		names: ["剃刀虫群", "剃刀蜂群", "Razor Swarm"],
		cover: "soft", radius: 1, includeSelfCells: true, grantToSelfActor: false,
	},
	{
		lids: ["npcf_cn_mirage_8", "npcf_blip_manifestation_mirage", "npcf_x_rc_15_1"],
		names: ["数据构念", "虚伪神像", "全息投影"],
		cover: "soft", radius: 1, includeSelfCells: true, grantToSelfActor: false,
	},
];

const coverAuraSyncChain = new Map();

function isPrimarySceneManager() {
	const activeGM = globalThis.game?.users?.activeGM;
	if (activeGM) return Boolean(activeGM.isSelf);
	return Boolean(globalThis.game?.user?.isGM);
}

function normalizeCoverAuraSpec(raw) {
	if (!raw || typeof raw !== "object") return null;
	if (raw.enabled === false) return { enabled: false, auto: false };
	const cover = raw.cover === "hard" ? "hard" : "soft";
	const rawRad = Number(raw.radius);
	const radius = Number.isFinite(rawRad) ? Math.max(0, Math.min(5, Math.floor(rawRad))) : 1;
	const includeSelfCells = radius <= 0 ? true : Boolean(raw.includeSelfCells);
	const grantToSelfActor = Boolean(raw.grantToSelfActor);
	return {
		enabled: true,
		cover,
		radius,
		includeSelfCells,
		grantToSelfActor,
		auto: Boolean(raw.auto),
	};
}

function inferDeployableCoverSpec(tokenDoc, actorOverride = null) {
	const actor = actorOverride ?? tokenDoc?.actor;
	if (!actor || (actor.type !== "deployable" && !actor.is_deployable?.())) return null;
	const lid = String(actor.system?.lid ?? "").trim().toLowerCase();
	const npcKey = String(actor.getFlag?.(MODULE_ID, "npcDeployableKey") ?? actor.flags?.[MODULE_ID]?.npcDeployableKey ?? "").toLowerCase();
	const combinedName = `${tokenDoc?.name ?? ""} ${actor.name ?? ""}`.trim();
	const lowerName = combinedName.toLowerCase();

	for (const rule of DEPLOYABLE_AUTO_COVER_RULES) {
		if (rule.excludeNames?.some(ex => combinedName.includes(ex))) continue;
		const lidHit = rule.lids?.some(l => {
			const ll = l.toLowerCase();
			return lid === ll || (npcKey && npcKey.includes(`::${ll}::`));
		});
		const nameHit = rule.names?.some(nm => lowerName.includes(nm.toLowerCase()));
		if (lidHit || nameHit) {
			return {
				enabled: true,
				cover: rule.cover,
				radius: rule.radius,
				includeSelfCells: rule.includeSelfCells,
				grantToSelfActor: rule.grantToSelfActor,
				auto: true,
			};
		}
	}

	// 语义回退：识别自定义或扩展部署物（跳过未引爆地雷、方向性线形墙与多模式天候塔）
	const depType = String(actor.system?.type ?? "");
	if (/^mine$/i.test(depType) || /地雷|炸药|炸弹|天候塔/.test(combinedName)) return null;
	const detail = String(actor.system?.detail ?? "").replace(/<[^>]+>/g, " ").trim();
	if (!detail || /无法从[^。；]*掩护|失去掩护|线形\s*\d|直线\s*\d/i.test(detail)) return null;
	const grantHard = /(?:视为|算作|作为|当作|提供|赐予|相当于|得到|获得)\s*硬性掩护/i.test(detail);
	const grantSoft = !grantHard && /(?:视为|算作|作为|当作|提供|赐予|相当于|得到|获得)\s*软性掩护/i.test(detail);
	if (!grantHard && !grantSoft) return null;

	const burstM = detail.match(/(?:爆发|溅射)\s*(\d+)/);
	const insideOnly = !burstM && /(?:完全位于|位于|处于)[^。；]{0,16}(?:区域|阵地|碉堡|地堡)内/i.test(detail);
	const radius = insideOnly ? 0 : (burstM ? Math.max(1, Math.min(5, parseInt(burstM[1], 10) || 1)) : 1);
	const grantSelf = /本身也(?:是|算作|视为|拥有|得到|获得)/i.test(detail);
	const includeSelfCells = insideOnly || grantSoft || grantSelf || Boolean(burstM);
	return {
		enabled: true,
		cover: grantHard ? "hard" : "soft",
		radius,
		includeSelfCells,
		grantToSelfActor: grantSelf,
		auto: true,
	};
}

function getEffectiveCoverAuraSpec(tokenDoc, actorOverride = null) {
	const raw = tokenDoc?.getFlag?.(MODULE_ID, "coverAura") ?? tokenDoc?.flags?.[MODULE_ID]?.coverAura;
	if (raw && typeof raw === "object") {
		const norm = normalizeCoverAuraSpec(raw);
		return norm?.enabled ? norm : null;
	}
	if (!getSetting("autoDeployableCover", true)) return null;
	return inferDeployableCoverSpec(tokenDoc, actorOverride);
}

function isCoverSourceIncapacitated(tokenDoc, actorOverride = null) {
	const actor = actorOverride ?? tokenDoc?.actor;
	if (!actor) return false;
	if (actor.statuses?.has?.("downandout")) return true;
	const hpMax = Number(actor.system?.hp?.max) || 0;
	const hpVal = Number(actor.system?.hp?.value);
	if (hpMax > 0 && Number.isFinite(hpVal) && hpVal <= 0) {
		const isDep = actor.type === "deployable" || Boolean(actor.is_deployable?.());
		const structMax = Number(actor.system?.structure?.max) || 0;
		const structVal = Number(actor.system?.structure?.value) || 0;
		if (isDep || structMax <= 0 || structVal <= 0) return true;
	}
	return false;
}

function computeBoundCoverRegionGeometry(scene, tokenDoc, spec, overridePos = null) {
	const grid = scene?.grid ?? globalThis.canvas?.grid;
	if (!grid || !tokenDoc || !spec?.enabled) return { shapes: [], cellKeys: [] };
	const posX = Number(overridePos?.x ?? tokenDoc.x) || 0;
	const posY = Number(overridePos?.y ?? tokenDoc.y) || 0;
	const sizePx = Number(grid.size) || 100;
	const wSpaces = Number(overridePos?.width ?? tokenDoc.width) || 1;
	const hSpaces = Number(overridePos?.height ?? tokenDoc.height) || 1;
	const radius = Math.max(0, Number(spec.radius) || 0);
	const includeSelf = radius <= 0 ? true : Boolean(spec.includeSelfCells);

	if (grid.isGridless || typeof grid.getVertices !== "function" || typeof grid.getCenterPoint !== "function" || typeof grid.getOffset !== "function") {
		const cx = Math.round(posX + (wSpaces * sizePx) / 2);
		const cy = Math.round(posY + (hSpaces * sizePx) / 2);
		const innerR = Math.round((Math.max(wSpaces, hSpaces) * sizePx) / 2);
		const outerR = innerR + Math.round(radius * sizePx);
		const shapes = [{ type: "circle", x: cx, y: cy, radius: Math.max(innerR, outerR), hole: false }];
		if (!includeSelf && radius > 0 && innerR > 4) {
			shapes.push({ type: "circle", x: cx, y: cy, radius: innerR, hole: true });
		}
		return { shapes, cellKeys: [] };
	}

	const occ = offsetsAtPosition(
		{
			x: tokenDoc.x,
			y: tokenDoc.y,
			width: wSpaces,
			height: hSpaces,
			getOccupiedGridSpaceOffsets: tokenDoc.getOccupiedGridSpaceOffsets?.bind?.(tokenDoc),
		},
		posX,
		posY,
		grid,
	);
	if (!occ.length) return { shapes: [], cellKeys: [] };
	const occSet = new Set(occ.map(o => `${o.i},${o.j}`));
	const occItems = occ.map(o => ({ off: o, pt: grid.getCenterPoint(o) }));
	let minI = Infinity, maxI = -Infinity, minJ = Infinity, maxJ = -Infinity;
	for (const o of occ) {
		if (o.i < minI) minI = o.i;
		if (o.i > maxI) maxI = o.i;
		if (o.j < minJ) minJ = o.j;
		if (o.j > maxJ) maxJ = o.j;
	}

	const selectedOffsets = [];
	const pad = radius + 2;
	for (let i = minI - pad; i <= maxI + pad; i++) {
		for (let j = minJ - pad; j <= maxJ + pad; j++) {
			const k = `${i},${j}`;
			const isOwn = occSet.has(k);
			if (isOwn) {
				if (includeSelf) selectedOffsets.push({ i, j, k });
				continue;
			}
			if (radius <= 0) continue;
			const off = { i, j };
			const pt = grid.getCenterPoint(off);
			let hit = false;
			for (const oc of occItems) {
				if (gridCellDistance(grid, oc.pt, pt, oc.off, off) <= radius) {
					hit = true;
					break;
				}
			}
			if (hit) selectedOffsets.push({ i, j, k });
		}
	}

	const shapes = selectedOffsets.map(o => ({
		type: "polygon",
		points: cellPoints(grid.getVertices({ i: o.i, j: o.j })),
		hole: false,
	}));
	const cellKeys = selectedOffsets.map(o => o.k);
	return { shapes, cellKeys };
}

async function reconcileBoundAuraTokens(scene, cellKeys, { excludeRegion = null } = {}) {
	if (!scene?.tokens) return;
	const grid = scene.grid ?? globalThis.canvas?.grid;
	const keySet = new Set(cellKeys ?? []);
	const isGridless = Boolean(!grid || grid.isGridless || typeof grid.getOffset !== "function");
	if (!isGridless && !keySet.size && !excludeRegion) return;

	for (const tDoc of scene.tokens) {
		if (!tDoc?.actor?.toggleStatusEffect) continue;
		let affected = isGridless;
		if (!affected && excludeRegion && (tDoc.regions?.has?.(excludeRegion) || (Array.isArray(tDoc.regions) && tDoc.regions.includes(excludeRegion)))) {
			affected = true;
		}
		if (!affected && keySet.size) {
			const offs = offsetsAtPosition(tDoc, Number(tDoc.x) || 0, Number(tDoc.y) || 0, grid);
			affected = offs.some(o => keySet.has(`${o.i},${o.j}`));
		}
		if (!affected) continue;
		await applyCover(tDoc, coverFor(tDoc, excludeRegion ? { exclude: excludeRegion } : {}));
	}
}

function findBoundCoverRegions(scene, tokenId) {
	if (!scene?.regions || !tokenId) return [];
	return scene.regions.filter(r => (r.getFlag?.(MODULE_ID, "boundCoverTokenId") ?? r.flags?.[MODULE_ID]?.boundCoverTokenId) === tokenId);
}

async function removeBoundCoverRegion(scene, tokenId) {
	if (!scene || !tokenId || !isPrimarySceneManager()) return 0;
	const existing = findBoundCoverRegions(scene, tokenId);
	if (!existing.length) return 0;
	const prevKeys = existing.flatMap(r => r.getFlag?.(MODULE_ID, "auraCellKeys") ?? r.flags?.[MODULE_ID]?.auraCellKeys ?? []);
	const ids = existing.map(r => r.id).filter(Boolean);
	if (ids.length && typeof scene.deleteEmbeddedDocuments === "function") {
		await scene.deleteEmbeddedDocuments("Region", ids);
	}
	for (const r of existing) {
		await reconcileBoundAuraTokens(scene, prevKeys, { excludeRegion: r });
	}
	if (!existing.length && prevKeys.length) {
		await reconcileBoundAuraTokens(scene, prevKeys);
	}
	return ids.length;
}

function syncBoundCoverRegionForToken(tokenDoc, overridePos = null) {
	if (!tokenDoc?.id || !isPrimarySceneManager()) return Promise.resolve({ action: "skipped" });
	const scene = tokenDoc.parent ?? globalThis.canvas?.scene;
	if (!scene?.regions) return Promise.resolve({ action: "skipped" });
	const lockKey = `${scene.id || "scene"}::${tokenDoc.id}`;
	const prevP = coverAuraSyncChain.get(lockKey) ?? Promise.resolve();
	const nextP = prevP.catch(() => {}).then(async () => {
		const spec = getEffectiveCoverAuraSpec(tokenDoc);
		const incap = isCoverSourceIncapacitated(tokenDoc);
		const existing = findBoundCoverRegions(scene, tokenDoc.id);
		const prevKeys = existing.flatMap(r => r.getFlag?.(MODULE_ID, "auraCellKeys") ?? r.flags?.[MODULE_ID]?.auraCellKeys ?? []);

		if (!spec || incap) {
			if (!existing.length) return { action: "none" };
			await removeBoundCoverRegion(scene, tokenDoc.id);
			return { action: "removed", reason: incap ? "incapacitated" : "disabled" };
		}

		const { shapes, cellKeys } = computeBoundCoverRegionGeometry(scene, tokenDoc, spec, overridePos);
		if (!shapes.length) {
			if (existing.length) await removeBoundCoverRegion(scene, tokenDoc.id);
			return { action: "none" };
		}

		const def = REGION_CELL_DEFS[spec.cover] ?? REGION_CELL_DEFS.hard;
		const vis = tokenDoc.hidden
			? (globalThis.CONST?.REGION_VISIBILITY?.GAMEMASTER ?? 1)
			: (globalThis.CONST?.REGION_VISIBILITY?.ALWAYS ?? 2);
		const regionName = `${tokenDoc.name ?? tokenDoc.actor?.name ?? "部署物"} · ${spec.cover === "hard" ? "硬性" : "软性"}掩护圈`;
		const modFlags = {
			boundCoverTokenId: tokenDoc.id,
			grantToSelfActor: Boolean(spec.grantToSelfActor),
			auraCellKeys: cellKeys,
			auraSpec: spec,
		};

		if (existing.length > 1 && typeof scene.deleteEmbeddedDocuments === "function") {
			const extraIds = existing.slice(1).map(r => r.id).filter(Boolean);
			if (extraIds.length) await scene.deleteEmbeddedDocuments("Region", extraIds);
		}

		let regionDoc = existing[0] ?? null;
		let action = "updated";
		if (regionDoc && typeof regionDoc.update === "function") {
			const curCover = regionDoc.behaviors?.find?.(b => b.type === COVER_TYPE)?.system?.cover;
			const updatePayload = {
				name: regionName,
				color: def.color,
				visibility: vis,
				shapes,
				[`flags.${MODULE_ID}`]: modFlags,
			};
			if (curCover !== spec.cover) {
				const beh = regionDoc.behaviors?.find?.(b => b.type === COVER_TYPE);
				if (beh?.update) await beh.update({ "system.cover": spec.cover });
				else updatePayload.behaviors = [def.behavior()];
			}
			await regionDoc.update(updatePayload);
		} else if (typeof scene.createEmbeddedDocuments === "function") {
			const created = await scene.createEmbeddedDocuments("Region", [{
				name: regionName,
				color: def.color,
				shapes,
				visibility: vis,
				flags: { [MODULE_ID]: modFlags },
				behaviors: [def.behavior()],
			}]);
			regionDoc = created?.[0] ?? null;
			action = "created";
		}

		await reconcileBoundAuraTokens(scene, [...prevKeys, ...cellKeys]);
		return { action, region: regionDoc, cellKeys, spec };
	});
	coverAuraSyncChain.set(lockKey, nextP);
	nextP.finally(() => {
		if (coverAuraSyncChain.get(lockKey) === nextP) coverAuraSyncChain.delete(lockKey);
	});
	return nextP;
}

async function cleanupOrphanBoundCoverRegions(scene = globalThis.canvas?.scene) {
	if (!scene?.regions || !scene?.tokens || !isPrimarySceneManager()) return 0;
	const validTokenIds = new Set([...scene.tokens].map(t => t.id));
	const orphanIds = [];
	const orphanKeys = [];
	for (const r of scene.regions) {
		const tid = r.getFlag?.(MODULE_ID, "boundCoverTokenId") ?? r.flags?.[MODULE_ID]?.boundCoverTokenId;
		if (tid && !validTokenIds.has(tid)) {
			if (r.id) orphanIds.push(r.id);
			const ks = r.getFlag?.(MODULE_ID, "auraCellKeys") ?? r.flags?.[MODULE_ID]?.auraCellKeys;
			if (Array.isArray(ks)) orphanKeys.push(...ks);
		}
	}
	if (orphanIds.length && typeof scene.deleteEmbeddedDocuments === "function") {
		await scene.deleteEmbeddedDocuments("Region", orphanIds);
		if (orphanKeys.length) await reconcileBoundAuraTokens(scene, orphanKeys);
	}
	return orphanIds.length;
}

async function onCoverAuraCreateToken(doc) {
	if (!doc) return null;
	return syncBoundCoverRegionForToken(doc);
}

async function onCoverAuraTokenUpdate(doc, changes) {
	if (!doc || !changes) return null;
	const posMoved = ("x" in changes) || ("y" in changes) || ("width" in changes) || ("height" in changes) || ("hidden" in changes);
	const flagChanged = Boolean(changes.flags?.[MODULE_ID] && ("coverAura" in changes.flags[MODULE_ID] || "-=coverAura" in changes.flags[MODULE_ID]));
	const deltaHpChanged = changes.delta?.system?.hp !== undefined || changes.delta?.system?.structure !== undefined;
	if (!posMoved && !flagChanged && !deltaHpChanged) return null;
	const overridePos = (("x" in changes) || ("y" in changes) || ("width" in changes) || ("height" in changes))
		? {
			x: changes.x ?? doc.x,
			y: changes.y ?? doc.y,
			width: changes.width ?? doc.width,
			height: changes.height ?? doc.height,
		}
		: null;
	return syncBoundCoverRegionForToken(doc, overridePos);
}

async function onCoverAuraDeleteToken(doc) {
	if (!doc?.id) return 0;
	const scene = doc.parent ?? globalThis.canvas?.scene;
	return removeBoundCoverRegion(scene, doc.id);
}

async function onCoverAuraActorUpdate(actor, changes) {
	if (!actor || !changes?.system) return;
	if (changes.system.hp === undefined && changes.system.structure === undefined) return;
	const docs = [];
	if (actor.token?.id) {
		docs.push(actor.token);
	} else {
		const scene = globalThis.canvas?.scene;
		for (const t of scene?.tokens ?? []) {
			if (t.actor === actor || (actor.id && t.actorId === actor.id)) docs.push(t);
		}
	}
	for (const tDoc of docs) {
		await syncBoundCoverRegionForToken(tDoc);
	}
}

function resolveSceneTokenDocForTarget(tokenOrActor) {
	if (!tokenOrActor) return null;
	if (tokenOrActor.document?.id && ("x" in tokenOrActor.document)) return tokenOrActor.document;
	if (tokenOrActor.id && ("x" in tokenOrActor) && (tokenOrActor.parent?.regions || tokenOrActor.actor)) return tokenOrActor;
	const actor = tokenOrActor.actor ?? tokenOrActor;
	if (actor?.token?.id) return actor.token;
	const controlled = (globalThis.canvas?.tokens?.controlled ?? []).find(t => t?.actor === actor || (actor?.id && t?.document?.actorId === actor.id));
	if (controlled?.document) return controlled.document;
	const tok = attackerToken(actor);
	if (tok?.document) return tok.document;
	const sceneTok = [...(globalThis.canvas?.scene?.tokens ?? [])].find(t => t.actor === actor || (actor?.id && t.actorId === actor.id));
	return sceneTok ?? null;
}

function formatCoverAuraSummary(spec) {
	if (!spec || !spec.enabled) return "未开启";
	const kindLabel = spec.cover === "hard" ? "硬性掩护 (-2)" : "软性掩护 (-1)";
	const shapeLabel = spec.radius <= 0
		? "仅自身占地格"
		: (spec.includeSelfCells ? `爆发 ${spec.radius}（含自身${spec.grantToSelfActor ? "·自身受益" : ""}）` : `周边邻接 ${spec.radius} 格`);
	return `${kindLabel} · ${shapeLabel}${spec.auto ? "（自动）" : ""}`;
}

async function setTokenCoverAura(tokenOrActor, specOrMode) {
	const tokenDoc = resolveSceneTokenDocForTarget(tokenOrActor);
	if (!tokenDoc) {
		globalThis.ui?.notifications?.warn?.("请先将该角色拖放到当前场景地图上，再设置跟随掩护圈。");
		return null;
	}
	if (!(globalThis.game?.user?.isGM || tokenDoc.isOwner || tokenDoc.actor?.isOwner)) {
		globalThis.ui?.notifications?.warn?.("需要该指示物的拥有者或主持人权限才能修改跟随掩护圈。");
		return null;
	}
	let nextFlag;
	if (specOrMode === "auto") {
		if (typeof tokenDoc.unsetFlag === "function") await tokenDoc.unsetFlag(MODULE_ID, "coverAura");
		else if (tokenDoc.flags?.[MODULE_ID]) delete tokenDoc.flags[MODULE_ID].coverAura;
	} else {
		nextFlag = (!specOrMode || specOrMode === "off" || specOrMode.enabled === false)
			? { enabled: false, auto: false }
			: { ...(normalizeCoverAuraSpec(specOrMode) ?? { enabled: false }), auto: false };
		if (typeof tokenDoc.setFlag === "function") await tokenDoc.setFlag(MODULE_ID, "coverAura", nextFlag);
		else {
			tokenDoc.flags = tokenDoc.flags || {};
			tokenDoc.flags[MODULE_ID] = { ...(tokenDoc.flags[MODULE_ID] || {}), coverAura: nextFlag };
		}
	}
	const syncRes = isPrimarySceneManager() ? await syncBoundCoverRegionForToken(tokenDoc) : null;
	try {
		if (tokenDoc.actor?.sheet?.rendered) tokenDoc.actor.sheet.render(false);
	} catch { /* ignore */ }
	return { tokenDoc, spec: getEffectiveCoverAuraSpec(tokenDoc), syncRes };
}

const COVER_AURA_PRESETS = [
	{ key: "off", label: "✕ 关闭掩护圈", spec: { enabled: false } },
	{ key: "hard_ring1", label: "🧱 硬掩体 · 周边1格", title: "周围邻接 1 格获得硬性掩护，打掩体本身不吃 -2（适用耶利哥掩体/拓荒工位/路障）", spec: { enabled: true, cover: "hard", radius: 1, includeSelfCells: false, grantToSelfActor: false } },
	{ key: "hard_self1", label: "🛡 硬掩护 · 含自身+1格", title: "自身与周围邻接 1 格均获硬性掩护，且自身受益（适用盾牌阵列无人机）", spec: { enabled: true, cover: "hard", radius: 1, includeSelfCells: true, grantToSelfActor: true } },
	{ key: "hard_inside", label: "🏰 硬掩护 · 仅自身格", title: "仅覆盖自身占地格供内部单位获硬性掩护，建筑自身不挂状态（适用便携式地堡/炮兵阵地）", spec: { enabled: true, cover: "hard", radius: 0, includeSelfCells: true, grantToSelfActor: false } },
	{ key: "soft_b1", label: "🌫 软掩护 · 爆发1", title: "自身与周围 1 格获得软性掩护（适用烟雾发生器一阶段/剃刀虫群）", spec: { enabled: true, cover: "soft", radius: 1, includeSelfCells: true, grantToSelfActor: false } },
	{ key: "soft_b2", label: "🌫 软掩护 · 爆发2", title: "自身与周围 2 格获得软性掩护（适用虫巢无人机/烟雾发生器二阶段）", spec: { enabled: true, cover: "soft", radius: 2, includeSelfCells: true, grantToSelfActor: true } },
	{ key: "soft_b3", label: "🌫 软掩护 · 爆发3", title: "自身与周围 3 格获得软性掩护（适用烟雾地雷引爆/烟雾发生器三阶段/天候塔沙暴）", spec: { enabled: true, cover: "soft", radius: 3, includeSelfCells: true, grantToSelfActor: false } },
];

async function applyCoverAuraPreset(tokenOrActor, presetKey) {
	if (presetKey === "auto") return setTokenCoverAura(tokenOrActor, "auto");
	const found = COVER_AURA_PRESETS.find(p => p.key === presetKey);
	if (!found) return null;
	const res = await setTokenCoverAura(tokenOrActor, found.spec);
	if (res) {
		globalThis.ui?.notifications?.info?.(`「${res.tokenDoc.name ?? "指示物"}」跟随掩护圈：${formatCoverAuraSummary(res.spec)}`);
	}
	return res;
}

async function openCoverAuraDialog(tokenOrActor) {
	const tokenDoc = resolveSceneTokenDocForTarget(tokenOrActor);
	if (!tokenDoc) {
		globalThis.ui?.notifications?.warn?.("请先将该角色拖放到当前场景地图上（或在地图上选中指示物），再配置跟随掩护圈。");
		return null;
	}
	if (!(globalThis.game?.user?.isGM || tokenDoc.isOwner || tokenDoc.actor?.isOwner)) {
		globalThis.ui?.notifications?.warn?.("需要该指示物的拥有者或主持人权限才能修改跟随掩护圈。");
		return null;
	}
	const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
	const cur = getEffectiveCoverAuraSpec(tokenDoc);
	const defCover = cur?.cover ?? "hard";
	const defRad = cur ? cur.radius : 1;
	const defIncSelf = cur ? cur.includeSelfCells : false;
	const defGrantSelf = cur ? cur.grantToSelfActor : false;
	if (!DialogV2?.wait) return null;

	const presetBtnsHtml = COVER_AURA_PRESETS.map(p =>
		`<button type="button" data-preset="${escHtml(p.key)}" title="${escHtml(p.title ?? "")}" style="width:auto;flex:0 0 auto;padding:2px 8px;font-size:12px;line-height:1.5">${escHtml(p.label)}</button>`,
	).join("");

	const content = `<div style="display:flex;flex-direction:column;gap:8px;font-size:13px">`
		+ `<div style="padding:4px 8px;border-radius:4px;background:rgba(128,128,128,.12)">当前状态：<b>${escHtml(formatCoverAuraSummary(cur))}</b></div>`
		+ `<div style="display:flex;flex-wrap:wrap;gap:4px"><span style="width:100%;font-size:12px;opacity:.8">一键预设（点击立即生效）：</span>${presetBtnsHtml}</div>`
		+ `<hr style="margin:2px 0;opacity:.3">`
		+ `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center">`
		+ `<label style="display:flex;flex-direction:column;gap:3px"><span>掩护类型</span><select name="auraCover"><option value="hard"${defCover === "hard" ? " selected" : ""}>硬性掩护 (-2)</option><option value="soft"${defCover === "soft" ? " selected" : ""}>软性掩护 (-1)</option></select></label>`
		+ `<label style="display:flex;flex-direction:column;gap:3px"><span>外扩格数（爆发 0~5）</span><input type="number" name="auraRadius" min="0" max="5" step="1" value="${defRad}"></label>`
		+ `</div>`
		+ `<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" name="auraIncludeSelf"${defIncSelf ? " checked" : ""}> <span>区域覆盖自身所占格子（供重叠/内部单位获得掩护；范围填 0 时自动勾选）</span></label>`
		+ `<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" name="auraGrantSelf"${defGrantSelf ? " checked" : ""}> <span>该指示物自身也获得此掩护状态（如盾牌阵列、虫巢无人机）</span></label>`
		+ `</div>`;

	let presetPicked = null;
	try {
		const res = await DialogV2.wait({
			window: { title: `${tokenDoc.name ?? "指示物"} // 跟随掩护区域绑定` },
			position: { width: 460 },
			content,
			render: (_event, dialog) => {
				const rootEl = dialog?.element ?? dialog;
				for (const btn of rootEl?.querySelectorAll?.("[data-preset]") ?? []) {
					btn.addEventListener("click", ev => {
						ev.preventDefault();
						presetPicked = ev.currentTarget.dataset.preset;
						dialog.close?.();
					});
				}
			},
			buttons: [
				{
					action: "save",
					label: "应用自定义设置",
					default: true,
					callback: (event, button, dialog) => {
						const rootEl = dialog?.element ?? button?.form ?? event?.currentTarget?.closest?.("form, .application");
						const cover = rootEl?.querySelector?.('[name="auraCover"]')?.value === "soft" ? "soft" : "hard";
						const radius = Math.max(0, Math.min(5, parseInt(rootEl?.querySelector?.('[name="auraRadius"]')?.value, 10) || 0));
						const includeSelfCells = radius <= 0 ? true : Boolean(rootEl?.querySelector?.('[name="auraIncludeSelf"]')?.checked);
						const grantToSelfActor = Boolean(rootEl?.querySelector?.('[name="auraGrantSelf"]')?.checked);
						return { enabled: true, cover, radius, includeSelfCells, grantToSelfActor };
					},
				},
				{ action: "auto", label: "恢复默认自动识别", callback: () => "auto" },
				{ action: "cancel", label: "取消", callback: () => null },
			],
			rejectClose: false,
		});
		if (presetPicked) return applyCoverAuraPreset(tokenDoc, presetPicked);
		if (!res || res === "cancel") return null;
		const applied = await setTokenCoverAura(tokenDoc, res);
		if (applied) {
			globalThis.ui?.notifications?.info?.(`「${applied.tokenDoc.name ?? "指示物"}」跟随掩护圈：${formatCoverAuraSummary(applied.spec)}`);
		}
		return applied;
	} catch { return null; }
}

function onRenderTokenHUD(app, html) {
	const root = (typeof HTMLElement === "function" && html instanceof HTMLElement) ? html : (html?.[0] ?? html);
	const tokenObj = app?.object;
	const tokenDoc = tokenObj?.document ?? app?.document;
	if (!root || !tokenDoc) return;
	if (!(globalThis.game?.user?.isGM || tokenDoc.isOwner || tokenDoc.actor?.isOwner)) return;
	if (root.querySelector?.(".lancer-cn-hud-cover-aura")) return;
	const col = root.querySelector?.(".col.left") ?? root.querySelector?.(".col.right") ?? root.querySelector?.(".col");
	if (!col) return;
	const curSpec = getEffectiveCoverAuraSpec(tokenDoc);
	const active = Boolean(curSpec?.enabled && !isCoverSourceIncapacitated(tokenDoc));
	const title = `跟随掩护圈：${formatCoverAuraSummary(curSpec)}（点击配置软/硬掩护与范围）`;
	const doc = root.ownerDocument ?? globalThis.document;
	if (!doc?.createElement) return;
	const btn = doc.createElement("button");
	btn.type = "button";
	btn.className = `control-icon lancer-cn-hud-cover-aura${active ? " active" : ""}`;
	btn.dataset.action = "lancerCnCoverAura";
	btn.title = title;
	btn.innerHTML = `<i class="fas fa-shield-halved"></i>`;
	btn.addEventListener("click", ev => {
		ev.preventDefault?.();
		ev.stopPropagation?.();
		openCoverAuraDialog(tokenDoc).then(res => {
			if (res) {
				const nextSpec = getEffectiveCoverAuraSpec(tokenDoc);
				const nextOn = Boolean(nextSpec?.enabled && !isCoverSourceIncapacitated(tokenDoc));
				btn.classList?.toggle?.("active", nextOn);
				btn.title = `跟随掩护圈：${formatCoverAuraSummary(nextSpec)}（点击配置软/硬掩护与范围）`;
			}
		});
	});
	col.append(btn);
}

Hooks.on("renderTokenHUD", onRenderTokenHUD);
Hooks.on("applyTokenStatusEffect", (token, statusId) => {
	if (statusId === "downandout") {
		syncBoundCoverRegionForToken(token?.document ?? token)?.catch?.(err => reportError("失能移除掩护圈", err));
	}
});
Hooks.on("canvasReady", () => {
	if (globalThis.game?.system?.id === "lancer") patchWeaponRangeTemplate();
	cleanupOrphanBoundCoverRegions()?.catch?.(err => reportError("清理孤立掩护圈", err));
});

// ---------------------------------------------------------------------------
// 指示物名字与浮动文字
// - 名字：放上地图的指示物按模组设置显示名字（Foundry 指示物的「显示名称」），默认始终显示。
//   第一次启用模组、或 GM 改这项设置时，各场景里已有的指示物也一起改。
// - 伤害 / 热度：LANCER 系统自带「浮动伤害数字」（HP、热度、结构、压力、燃烧、护盾变化时在指示物上飘字，所有人都看得到），
//   但这个客户端设置默认关闭。模组在每个客户端第一次载入时替玩家打开一次，之后按各人自己的设置。
// - 状态：Foundry 加上 / 去掉状态时会飘出「+(名称)」，中文界面下改成更醒目的「+ 缓慢」「- 缓慢」（见 patchScrollingText）。
const NAME_MODES = { keep: "不改（按各角色的指示物设置）", hover: "鼠标悬停时显示", always: "始终显示" };
function tokenNameMode() {
	let mode;
	try { mode = game.settings.get(MODULE_ID, "tokenNames"); } catch { return undefined; }
	const M = globalThis.CONST?.TOKEN_DISPLAY_MODES ?? {};
	return { hover: M.HOVER ?? 30, always: M.ALWAYS ?? 50 }[mode];
}

function onPreCreateToken(doc) {
	const mode = tokenNameMode();
	if (mode !== undefined && doc.displayName !== mode) doc.updateSource({ displayName: mode });
}

// 由在线的 GM（只一位）把各场景已有指示物改成当前设置；返回改动的指示物数
async function applyTokenNames() {
	const mode = tokenNameMode();
	if (mode === undefined || !game.users?.activeGM?.isSelf) return 0;
	let n = 0;
	for (const scene of game.scenes ?? []) {
		const updates = scene.tokens.filter(t => t.displayName !== mode).map(t => ({ _id: t.id, displayName: mode }));
		if (!updates.length) continue;
		await scene.updateEmbeddedDocuments("Token", updates);
		n += updates.length;
	}
	return n;
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	game.settings.register(MODULE_ID, "tokenNames", {
		name: "指示物显示名字",
		hint: "放上地图的指示物是否显示名字（所有人可见）。修改时，各场景里已放好的指示物也会一起改。选「不改」则按各角色自己的指示物设置。",
		scope: "world", config: true, type: String, choices: NAME_MODES, default: "always",
		onChange: () => applyTokenNames().catch(err => console.error(`${MODULE_ID} |`, err)),
	});
	game.settings.register(MODULE_ID, "tokenNamesApplied", { scope: "world", config: false, type: Boolean, default: false });
	game.settings.register(MODULE_ID, "floatingNumbersOn", { scope: "client", config: false, type: Boolean, default: false });
});
Hooks.on("preCreateToken", onPreCreateToken);

async function setupNamesAndNumbers() {
	if (!game.settings.get(MODULE_ID, "floatingNumbersOn")) {
		await game.settings.set("lancer", "floatingNumbers", true);
		await game.settings.set(MODULE_ID, "floatingNumbersOn", true);
	}
	if (game.users?.activeGM?.isSelf && !game.settings.get(MODULE_ID, "tokenNamesApplied")) {
		await applyTokenNames();
		await game.settings.set(MODULE_ID, "tokenNamesApplied", true);
	}
}
Hooks.once("ready", () => {
	if (game.system?.id !== "lancer") return;
	return setupNamesAndNumbers().catch(err => console.error(`${MODULE_ID} |`, err));
});

// ---------------------------------------------------------------------------
// 战斗自动化（1.10.0）：
// 1. 攻击卡 / 技能系统卡 / 结构与过热表卡：自动施加无豁免前提的状态、消除消耗的锁定，并附「↩ 撤销状态」防误判按钮。
// 2. 豁免检定：解析机体 / 敏捷 / 系统 / 工程豁免与发起者豁免目标（DC），目标玩家可一键掷豁免；失败自动挂异常，成功减半自动联动伤害面板。
// 3. 非攻击卡掷伤害与范围模板：手雷、地雷、核心系统、NPC 特性等一键发起 DamageRollFlow，一键放置溅射 / 爆发 / 线形 / 锥形模板。
// 4. 跨权限伤害结算与预览：玩家可直接对敌方 NPC 点击「应用伤害」与「撤销」（由在线 GM 代算护甲与抗性），伤害卡实时显示结算预览。
// 5. 流程补完：NPC「致命 / 额外致命」暴击加伤、机甲「稳住阵脚」清除自身 / 邻接角色状况、热度超温危域与无结构单位失能自动切换、回合结束清异常提醒。

function getSetting(key, fallback = true) {
	try {
		const v = game?.settings?.get?.(MODULE_ID, key);
		return v === undefined ? fallback : v;
	} catch { return fallback; }
}

Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	const worldOpt = (key, name, hint) => game.settings.register(MODULE_ID, key, { name, hint, scope: "world", config: true, type: Boolean, default: true });
	worldOpt("autoApplyStatus", "自动施加无条件状态与消除锁定", "攻击命中、会心一击、使用自身增益系统或掷出结构 / 过热表结果时，自动施加无豁免前提的状态（聊天卡附「↩ 撤销状态」按钮），并在消耗锁定时自动消除目标的锁定。");
	worldOpt("crossPermDamage", "跨权限伤害结算与结算预览", "允许玩家直接对非自己拥有的目标（如敌方 NPC）点击伤害卡上的「应用伤害」与「撤销」（由在线 GM 自动代算护甲与抗性），并在伤害卡上显示结算预览。");
	worldOpt("autoDangerZone", "自动切换超温危域与归零失能", "角色热度达到上限一半时自动挂上「超温危域」（低于一半时自动解除）；无结构上限或结构归零的单位 HP 归零时自动挂上「失能」。");
	worldOpt("turnEndPrompt", "回合结束状态清除提醒", "战斗中角色回合结束时，若身上有常见的持续至回合结束的状态（受损、缓慢、固定、受扰、离散、晕眩等），在聊天栏发出可一键清除或恢复的提醒卡。");
	worldOpt("overwatchPrompt", "战斗中移动自动提示守望触发", "战斗进行中，当指示物在敌方威胁范围内开始移动（或触发先锋 III「永远警惕」进入近战射击威胁范围）时，自动在聊天栏发出可一键锁定并发起守望交火的提示卡（脱离、匿迹或瞬间移动不触发）。");
	worldOpt("autoDeployableCover", "部署物拖上地图自动生成跟随掩护区", "将带软/硬掩护效果的部署物或无人机（如耶利哥展开掩体、虫巢无人机、盾牌阵列、烟雾发生器、便携式地堡等）拖上地图时，自动创建跟随其移动的掩护区域，并在其损毁归零或删除时自动移除。");
});

const STATUS_WORDS = [
	["固定", "immobilized"], ["受损", "impaired"], ["受扰", "jammed"], ["干扰状态", "jammed"], ["锁定", "lockon"], ["离散", "shredded"],
	["缓慢", "slow"], ["晕眩", "stunned"], ["暴露", "exposed"], ["伏卧", "prone"], ["俯卧", "prone"],
	["Immobilized", "immobilized"], ["Impaired", "impaired"], ["Jammed", "jammed"], ["Lock On", "lockon"], ["Shredded", "shredded"],
	["Slowed", "slow"], ["Stunned", "stunned"], ["Exposed", "exposed"], ["Prone", "prone"],
];
const STATUS_LABEL = { immobilized: "固定", impaired: "受损", jammed: "受扰", lockon: "锁定", shredded: "离散", slow: "缓慢", stunned: "晕眩", exposed: "暴露", prone: "伏卧" };

const RESIST_DEFS = [
	["resistance_kinetic", "动能", "动能抗性"],
	["resistance_energy", "能量", "能量抗性"],
	["resistance_explosive", "爆炸", "爆炸抗性"],
	["resistance_heat", "热度", "热度抗性"],
	["resistance_burn", "燃烧", "燃烧抗性"],
];
const RESIST_IDS = RESIST_DEFS.map(r => r[0]);

// 允许通过模组 socket 与自动化切换的全部合法 LANCER 状态 ID（不含数值字段 burn）
const ALL_STATUS_LABELS = {
	...STATUS_LABEL,
	hidden: "匿迹", invisible: "隐形", intangible: "无形", bolster: "强化", flying: "飞行",
	engaged: "交战", shutdown: "关机", shut_down: "关机", dangerzone: "超温危域", downandout: "昏迷", grappled: "被擒拿",
	trueblack: "真黑神盾",
	cover_soft: "掩护 - 软性", cover_hard: "掩护 - 硬性",
	...Object.fromEntries(RESIST_DEFS.map(([id, , full]) => [id, full])),
};

// 核心规则书中的 7 种「状况（Conditions）」，供机甲「稳住阵脚」清除状况使用
const CONDITION_IDS = ["immobilized", "impaired", "jammed", "lockon", "shredded", "slow", "stunned"];
// 常见的持续到回合结束的状况与短暂增益（不含锁定、伏卧、暴露、匿迹、超温危域、关机等持久状态，也不含交战）
const EXPIRABLE_STATUS_IDS = ["impaired", "slow", "immobilized", "jammed", "shredded", "stunned", "bolster", "invisible", "intangible", ...RESIST_IDS];

// 不是施加给目标的写法：
// - 消耗 / 移除锁定、免疫缓慢、无法……
// - 作为条件：「若目标被锁定」「攻击处于伏卧的角色」「具有锁定」
// - 给自己：「你陷入缓慢」「你会缓慢」
// - 列举状况：「伏卧、固定或晕眩」
// - 「可以在受扰下使用」「锁定该武器」「被锁定的所有敌方角色」
const STATUS_NOT_BEFORE = [
	/(消耗|移除|清除|解除|结束|免疫|抵抗|避免|不会|不能|无法|不再|失去|具有|(?<!将|会)处于|对)\S{0,2}$/,
	/(移除|解除|清除|避免)[^，。]{0,6}$/,
	/(若|如果)[^，。；]{0,3}被?$/,
	/你(会|将|也)?(陷入|变得)?$/,
	/[、或]$/,
	/(consume|remove|clear|immune|against|while)\s*\S{0,6}$/i,
];
const STATUS_NOT_AFTER = /^(该武器|这把武器|武器|模式|状态的|的|、|或|角色|目标时|下|时(也|仍)?可?以?使用|时也)/;
// 武器效果说明里，只看与命中、豁免或目标有关的句子（其余多是武器本身的规则）
const TARGET_SENTENCE = /(命中|会心|豁免|目标|受到该武器伤害|hit|crit|save|target)/i;

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
			// 「锁定」也常作动词或描述（「扫描目标锁定」「当锁定时」），只认「被 / 受到 / 施加 / 进行 / 获得 / 否则 / 你的目标 锁定」
			const lockOk = id !== "lockon" || /(被|受到|施加|进行|获得|陷入|否则|(?<!扫描)目标|Lock On)\s*$/i.test(before + (word === "Lock On" ? word : ""));
			if (lockOk && !STATUS_NOT_BEFORE.some(re => re.test(before)) && !STATUS_NOT_AFTER.test(after)) { found.push(id); break; }
			i = sentence.indexOf(word, i + word.length);
		}
	}
	return found;
}

// ---------------------------------------------------------------------------
// 驾驶员天赋、核心奖励、武器改装、战斗回合状态与天赋骰辅助（v1.13.0）
function mechPilot(actor) {
	if (!actor) return null;
	if (actor.type === "pilot" || actor.is_pilot?.()) return actor;
	return actor.system?.pilot?.value ?? null;
}

function findActiveMechForPilot(pilot) {
	if (!pilot) return null;
	const direct = pilot.system?.active_mech?.value;
	if (direct) return direct;
	for (const tok of globalThis.canvas?.tokens?.placeables ?? []) {
		const a = tok?.actor;
		if (a?.type === "mech" && (a.system?.pilot?.value === pilot || (pilot.id && a.system?.pilot?.id === pilot.id))) return a;
	}
	for (const a of game?.actors ?? []) {
		if (a?.type === "mech" && (a.system?.pilot?.value === pilot || (pilot.id && a.system?.pilot?.id === pilot.id))) return a;
	}
	return null;
}

function combatMechOf(actor) {
	if (!actor) return null;
	if (actor.type === "pilot" || actor.is_pilot?.()) return findActiveMechForPilot(actor) ?? actor;
	return actor;
}

const TALENT_LID_ALIASES = {
	t_orator: ["mf_orator", "t_orator", "t_ext_orator"],
	mf_orator: ["mf_orator", "t_orator", "t_ext_orator"],
	t_ext_orator: ["mf_orator", "t_orator", "t_ext_orator"],
	t_field_analyst: ["t_field_analyst", "t_ext_field_analyst"],
	t_ext_field_analyst: ["t_field_analyst", "t_ext_field_analyst"],
	t_iconoclast: ["t_iconoclast", "t_ext_iconoclast"],
	t_house_guard: ["t_house_guard", "t_ext_house_guard"],
	t_pankrati: ["t_pankrati", "t_ext_pankrati"],
	t_black_thumb: ["t_black_thumb", "t_ext_black_thumb"],
	t_demolitionist: ["t_demolitionist", "t_ext_demolitionist"],
	t_prospector: ["t_prospector", "t_ext_prospector"],
	t_empath: ["t_empath", "t_ext_empath"],
	t_sysop: ["t_sysop", "t_ext_sysop"],
	t_spaceborn: ["t_spaceborn", "t_ext_spaceborn"],
	t_giant_slayer: ["t_giant_slayer", "t_ext_giant_slayer"],
	t_ext_giant_slayer: ["t_giant_slayer", "t_ext_giant_slayer"],
};

function talentItemOf(actor, lid) {
	const targets = TALENT_LID_ALIASES[lid] ?? [lid];
	const pilot = mechPilot(actor);
	const list = pilot?.itemTypes?.talent ?? [...(pilot?.items ?? []), ...(actor && actor !== pilot ? (actor.items ?? []) : [])];
	for (const item of list) {
		if (item?.type && item.type !== "talent" && !item.is_talent?.()) continue;
		if (targets.includes(String(item.system?.lid ?? ""))) return item;
	}
	return null;
}

function talentRank(actor, lid) {
	const item = talentItemOf(actor, lid);
	return Math.max(0, Number(item?.system?.curr_rank) || 0);
}

// 驾驶员天赋增删或升级时，同步重算并刷新其名下机甲的衍生属性（如猎人 II「匕首戏法」赋予副近战投掷 5）
function onTalentItemChanged(item) {
	if (!item || (item.type !== "talent" && !item.is_talent?.())) return;
	const pilot = item.actor ?? item.parent;
	if (!pilot) return;
	const mechs = new Set();
	const active = pilot.system?.active_mech?.value;
	if (active) mechs.add(active);
	for (const m of allKnownMechs()) {
		if (m.system?.pilot?.value === pilot || (pilot.id && m.system?.pilot?.id === pilot.id)) mechs.add(m);
	}
	for (const m of mechs) {
		try {
			m.reset?.();
			if (m.sheet?.rendered) m.sheet.render(false);
		} catch (err) { reportError("刷新天赋衍生属性", err); }
	}
}
Hooks.on("createItem", onTalentItemChanged);
Hooks.on("updateItem", onTalentItemChanged);
Hooks.on("deleteItem", onTalentItemChanged);

function hasCoreBonus(actor, lid) {
	const pilot = mechPilot(actor);
	const mech = combatMechOf(actor);
	const pools = [
		...(pilot?.itemTypes?.core_bonus ?? []),
		...(pilot?.items ?? []),
		...(mech && mech !== pilot ? (mech.items ?? []) : []),
	];
	return pools.some(item => {
		if (!item || item.system?.destroyed) return false;
		if (item.type && item.type !== "core_bonus" && !item.is_core_bonus?.()) return false;
		return String(item.system?.lid ?? "") === lid;
	});
}

function hasMechSystem(actor, lid) {
	const mech = combatMechOf(actor);
	return [...(mech?.items ?? [])].some(i => i && !i.system?.destroyed && String(i.system?.lid ?? "") === lid);
}

function countMechNHPs(actor) {
	const mech = combatMechOf(actor);
	let count = 0;
	let hasUnstableItem = false;
	let hasTechnophileItem = false;
	for (const item of mech?.items ?? []) {
		if (!item || item.system?.destroyed) continue;
		if (item.type && item.type !== "mech_system" && !item.is_mech_system?.()) continue;
		const lid = String(item.system?.lid ?? "");
		const name = String(item.name ?? "");
		if (lid === "ms_unstable_nhp" || /不稳定\s*NHP|unstable\s+nhp/i.test(name)) hasUnstableItem = true;
		if (/^ms_(?:servant_fragment|student_fragment|enlightenment_class)_nhp$/i.test(lid) || /(?:侍从|学生|开悟)级\s*NHP/i.test(name)) hasTechnophileItem = true;
		// 侍从级 NHP（科技狂热者 R1）与洞察原型心智不能进入崩溃，不计入偶像破坏者定义的 NHP 数量
		if (lid === "ms_ext_insight_proto_mind" || lid === "ms_servant_fragment_nhp" || /侍从级\s*NHP/i.test(name)) continue;
		let tags = [];
		try { tags = item.getTags?.() ?? item.system?.tags ?? []; } catch { tags = item.system?.tags ?? []; }
		const hasAiTag = tags.some(t => t?.lid === "tg_ai" || t?.is_ai);
		if (hasAiTag || /_nhp$/i.test(lid) || /\bNHP\b/i.test(name)) count++;
	}
	// 若已拥有偶像破坏者 R1 或科技狂热者 R2+ 但尚未将对应特殊 NHP 拖入机甲物品栏，自动计入该内置 NHP
	if (!hasUnstableItem && talentRank(actor, "t_iconoclast") >= 1) count++;
	if (!hasTechnophileItem && talentRank(actor, "t_technophile") >= 2) count++;
	return count;
}

function weaponModOf(weapon) {
	if (!weapon) return null;
	const rawMod = weapon.system?.mod?.value ?? weapon.system?.mod ?? null;
	if (rawMod) {
		const modDoc = typeof rawMod === "string" ? resolveDocSync(rawMod) : rawMod;
		if (modDoc?.system && !modDoc.system.destroyed) return modDoc;
	}
	const mech = weapon.actor ?? weapon.parent;
	for (const m of mech?.system?.loadout?.weapon_mounts ?? []) {
		for (const slot of m?.slots ?? []) {
			const w = slot?.weapon?.value ?? slot?.weapon;
			if (w === weapon || (weapon.id && (w?.id === weapon.id || slot?.weapon?.id === weapon.id))) {
				const sm = slot?.mod?.value ?? slot?.mod;
				const modDoc = typeof sm === "string" ? resolveDocSync(sm) : sm;
				if (modDoc?.system && !modDoc.system.destroyed) return modDoc;
			}
		}
	}
	return null;
}

function weaponLidOf(item) {
	return String(item?.system?.lid ?? "");
}

function weaponModLidOf(item) {
	return String(weaponModOf(item)?.system?.lid ?? "");
}

function itemBenefitsFromTalents(item) {
	if (!item) return true;
	const lid = weaponLidOf(item);
	if (lid === "mw_autogun" || lid === "mw_pl_underslung_data") return false;
	if (weaponModLidOf(item) === "wm_pl_underslung") return false;
	return true;
}

function itemBenefitsFromCoreBonuses(item) {
	if (!item) return true;
	const lid = weaponLidOf(item);
	if (lid === "mw_mimic_gun" || lid === "mw_gravity_gun" || lid === "mw_ext_ifrit_slip" || lid === "mw_pl_underslung_data") return false;
	if (weaponModLidOf(item) === "wm_pl_underslung") return false;
	return true;
}

const TALENT_DICE_DEFS = {
	brutal: { talent: "t_brutal", minRank: 3, ctrLid: "ctr_brutal", label: "不懈骰", min: 0, max: () => 99, init: () => 0, resetScene: false, resetFull: true },
	duelist: { talent: "t_duelist", minRank: 2, ctrLid: "ctr_duelist", label: "剑术骰", min: 0, max: () => 3, init: () => 0, resetScene: true, resetFull: true },
	gunslinger: { talent: "t_gunslinger", minRank: 3, ctrLid: "ctr_gunslinger", label: "快枪手骰", min: 1, max: () => 6, init: () => 6, resetScene: false, resetFull: true },
	brawler: { talent: "t_brawler", minRank: 3, ctrLid: "ctr_brawler", label: "斗殴骰", min: 1, max: () => 6, init: () => 6, resetScene: false, resetFull: true },
	stormbringer: { talent: "t_stormbringer", minRank: 3, ctrLid: "ctr_stormbringer", label: "洪流骰", min: 1, max: () => 6, init: () => 6, resetScene: false, resetFull: true },
	leader: {
		talent: "t_leader", minRank: 1, ctrLid: "ctr_leader", label: "领导骰", min: 0,
		max: r => (r >= 3 ? 6 : r >= 2 ? 5 : 3),
		init: r => (r >= 3 ? 6 : r >= 2 ? 5 : 3),
		resetScene: false, resetFull: true,
	},
	orator: {
		talent: "mf_orator", minRank: 2, ctrLid: "ctr_voice_of_reason", label: "演说家骰", min: 0,
		max: () => 3,
		init: r => (r >= 3 ? 2 : 1),
		resetScene: true, resetFull: true,
	},
	analyst: { talent: "t_field_analyst", minRank: 2, ctrLid: "ctr_field_analyst", label: "情报骰", min: 1, max: () => 6, init: () => 1, resetScene: true, resetFull: true },
	iconoclast: { talent: "t_iconoclast", minRank: 3, ctrLid: "ctr_iconoclast", label: "超然骰", min: 1, max: () => 3, init: () => 3, resetScene: true, resetFull: true },
	gilgamesh: { frame: "mf_gilgamesh", minRank: 1, ctrLid: "ctr_load_bearing", label: "军备骰", min: 1, max: () => 6, init: () => 6, resetScene: false, resetFull: true },
};

function hasDieQualification(actor, def) {
	if (!def) return 0;
	if (def.frame) {
		const mech = combatMechOf(actor);
		return mechFrameLid(mech) === def.frame ? 1 : 0;
	}
	const rank = talentRank(actor, def.talent);
	return rank >= def.minRank ? rank : 0;
}

function getTalentDie(actor, key) {
	const def = TALENT_DICE_DEFS[key];
	if (!def) return null;
	const rank = hasDieQualification(actor, def);
	if (!rank) return null;
	const mech = combatMechOf(actor);
	const saved = mech?.getFlag?.(MODULE_ID, "talentDice") ?? mech?.flags?.[MODULE_ID]?.talentDice ?? {};
	if (Number.isFinite(Number(saved[key]))) return Number(saved[key]);
	const srcItem = def.frame ? mechFrame(mech) : talentItemOf(actor, def.talent);
	const ctr = (srcItem?.system?.counters ?? []).find(c => c?.lid === def.ctrLid || (def.frame && /军备|armament|load_bearing/i.test(String(c?.name ?? c?.lid ?? ""))));
	if (ctr && Number.isFinite(Number(ctr.value))) return Number(ctr.value);
	return def.init(rank);
}

async function setTalentDie(actor, key, val) {
	const def = TALENT_DICE_DEFS[key];
	if (!def) return null;
	const rank = Math.max(def.minRank || 1, def.frame ? 1 : talentRank(actor, def.talent));
	const clamped = Math.max(def.min, Math.min(def.max(rank), Math.round(Number(val) || 0)));
	const mech = combatMechOf(actor);
	if (mech?.setFlag) {
		const cur = mech.getFlag?.(MODULE_ID, "talentDice") ?? mech.flags?.[MODULE_ID]?.talentDice ?? {};
		await mech.setFlag(MODULE_ID, "talentDice", { ...cur, [key]: clamped });
	}
	const srcItem = def.frame ? mechFrame(mech) : talentItemOf(actor, def.talent);
	if (srcItem?.update && Array.isArray(srcItem.system?.counters)) {
		const idx = srcItem.system.counters.findIndex(c => c?.lid === def.ctrLid || (def.frame && /军备|armament|load_bearing/i.test(String(c?.name ?? c?.lid ?? ""))));
		if (idx >= 0 && srcItem.system.counters[idx].value !== clamped) {
			const nextCounters = srcItem.system.counters.map((c, i) => (i === idx ? { ...c, value: clamped } : c));
			try { await srcItem.update({ "system.counters": nextCounters }); } catch { /* ignore read-only compendium items */ }
		}
	}
	return clamped;
}

function getCombatState(actor) {
	const mech = combatMechOf(actor);
	const raw = mech?.getFlag?.(MODULE_ID, "combatState") ?? mech?.flags?.[MODULE_ID]?.combatState;
	return raw && typeof raw === "object" ? { ...raw } : {};
}

async function setCombatState(actor, patch) {
	const mech = combatMechOf(actor);
	if (!mech?.setFlag) return {};
	const next = { ...getCombatState(mech), ...patch };
	await mech.setFlag(MODULE_ID, "combatState", next);
	return next;
}

function currentCombatStamp() {
	const c = globalThis.game?.combat;
	if (!c) return { roundKey: "free", turnKey: "free" };
	return { roundKey: `${c.id || "c"}_r${c.round ?? 0}`, turnKey: `${c.id || "c"}_r${c.round ?? 0}_t${c.turn ?? 0}` };
}

async function ensureCombatTurnState(actor) {
	const mech = combatMechOf(actor);
	const st = getCombatState(mech);
	const { roundKey, turnKey } = currentCombatStamp();
	if (turnKey === "free") return st;
	const patch = {};
	if (st.roundKey !== roundKey) {
		patch.roundKey = roundKey;
		patch.usedOverpowerCaliber = false;
		patch.usedStormbringerR1 = false;
		patch.usedStormbringerR2 = false;
		patch.usedCentimaneSave = false;
		patch.usedOpenDoorSave = false;
		patch.usedDuelistDieRound = false;
		patch.usedTacticianSolar = false;
		patch.usedTacticianFlank = false;
		patch.usedMourningCloakHunter = false;
		patch.usedAtlasFinishingBlow = false;
		patch.usedGajeshuraCapacitor = false;
		patch.usedPesilatMuscle = false;
		patch.usedEnhancedSysInvade = false;
		patch.usedSwallowtailProphetic = false;
		patch.usedBlackWitchParry = false;
		patch.usedVeteranLightningReflex = false;
		patch.usedOverwatchRound = false;
		patch.usedBraceRound = false;
		for (const k of Object.keys(st)) {
			if (k.startsWith("usedActRound_")) patch[k] = false;
		}
	}
	if (st.turnKey !== turnKey) {
		patch.turnKey = turnKey;
		patch.reactionsUsedTurn = 0;
		patch.disengagedThisTurn = false;
		patch.prospectorNoReactionTurn = false;
		patch.usedFirstMainMelee = false;
		patch.usedFirstAuxRanged = false;
		patch.usedNuCavBonus = false;
		patch.usedFragRounds = false;
		patch.usedWalkingArmoryTurn = false;
		patch.usedInfiltratorAmbush = false;
		patch.attackedOrForcedSaveThisTurn = false;
		patch.usedUltraExtraDeadly = false;
		patch.tookEnergyThisTurn = false;
		patch.stortebekerUsedWeaponIds = [];
	}
	return Object.keys(patch).length ? setCombatState(mech, patch) : st;
}

function getTalentConfig(actor) {
	const mech = combatMechOf(actor);
	const raw = mech?.getFlag?.(MODULE_ID, "talentConfig") ?? mech?.flags?.[MODULE_ID]?.talentConfig;
	return raw && typeof raw === "object" ? { ...raw } : {};
}

async function setTalentConfig(actor, patch) {
	const mech = combatMechOf(actor);
	if (!mech?.setFlag) return {};
	const next = { ...getTalentConfig(mech), ...patch };
	await mech.setFlag(MODULE_ID, "talentConfig", next);
	if (mech.sheet?.rendered) mech.sheet.render(false);
	return next;
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

function resolveDocSync(uuid) {
	if (!uuid || typeof fromUuidSync !== "function") return null;
	try { return fromUuidSync(uuid); } catch { return null; }
}

function resolveActor(uuid) {
	if (!uuid) return null;
	if (typeof uuid === "object") return uuid.actor ?? (uuid.toggleStatusEffect ? uuid : null);
	const doc = resolveDocSync(uuid);
	if (!doc) return null;
	if (doc.actor) return doc.actor;
	if (doc.documentName === "Actor" || doc.toggleStatusEffect || doc.statuses) return doc;
	return null;
}

function preferredTargetUuid(actor) {
	if (!actor) return null;
	const tok = attackerToken(actor) ?? actor.token;
	return tok?.document?.uuid ?? tok?.uuid ?? actor.uuid ?? null;
}

function hasNpcFeature(actor, lids, names = []) {
	if (!actor || (actor.type !== "npc" && !actor.is_npc?.())) return false;
	const lidList = Array.isArray(lids) ? lids : [lids];
	const pool = new Set([...(actor.items ?? []), ...(actor.itemTypes?.npc_feature ?? [])]);
	for (const item of pool) {
		if (item.type && item.type !== "npc_feature") continue;
		if (item.system?.destroyed) continue;
		const lid = String(item.system?.lid ?? "");
		if (lid && lidList.includes(lid)) return true;
		if (names.length) {
			const nm = String(item.name ?? "").trim();
			if (names.includes(nm)) return true;
		}
	}
	return false;
}

// 兼容原生系统硬编码英文 NPC LID（老兵/超体「传奇」双骰取高、怪形「独特生理机能」专属结构表），执行完立即无损还原
async function withCanonicalNpcFlowLids(actor, fn) {
	const saved = [];
	if (actor && (actor.type === "npc" || actor.is_npc?.())) {
		const pool = new Set([...(actor.items ?? []), ...(actor.itemTypes?.npc_feature ?? [])]);
		for (const item of pool) {
			if (!item?.system || (item.type && item.type !== "npc_feature") || item.system.destroyed) continue;
			const lid = String(item.system.lid ?? "");
			const nm = String(item.name ?? "").trim();
			let mapped = null;
			if (lid === "npcf_cn_monstrosity_1" || nm === "独特生理机能") mapped = "npcf_unique_physiology_monstrosity";
			else if (lid === "npcf_cn_ultra_6") mapped = "npcf_legendary_ultra";
			else if (lid === "npcf_cn_veteran_11" || nm === "传奇" || /^legendary$/i.test(nm)) mapped = "npcf_legendary_veteran";
			if (mapped && mapped !== lid) {
				saved.push([item, lid]);
				item.system.lid = mapped;
			}
		}
	}
	try { return await fn(); }
	finally {
		for (const [item, origLid] of saved) {
			if (item?.system) item.system.lid = origLid;
		}
	}
}

function isStatusImmune(actor, status) {
	if (!actor) return false;
	const fLid = mechFrameLid(actor);
	if (status === "impaired" && hasCoreBonus(actor, "cb_superior_by_design")) return true;
	if (status === "shredded") {
		if (hasCoreBonus(actor, "cb_piof_slow_cycle_shroud") && (Number(actor.system?.overshield?.value) || 0) > 0) return true;
		if (fLid === "mf_saladin" || fLid === "mf_ch_callista" || fLid === "mf_ch_gajeshura") return true;
		if (getCombatState(actor).kutuzovBraceProtected) return true;
	}
	if (status === "lockon" && fLid === "mf_ch_sagittarius") return true;
	if (actor.type === "npc" || actor.is_npc?.()) {
		if ((status === "slow" || status === "shredded") && hasNpcFeature(actor, ["npcf_cn_ultra_28", "npcf_superior_frame_ultra"], ["卓越骨架"])) return true;
		if (status === "immobilized" && hasNpcFeature(actor, ["npcf_cn_ultra_28", "npcf_superior_frame_ultra", "npcf_cn_ship_1", "npcf_flyer_ship"], ["卓越骨架", "飞行物"])) return true;
		if (status === "stunned" && hasNpcFeature(actor, ["npcf_cn_ultra_29", "npcf_superior_reactor_ultra", "npcf_cn_ship_1", "npcf_flyer_ship"], ["卓越反应堆", "飞行物"])) return true;
		if (status === "exposed" && hasNpcFeature(actor, ["npcf_cn_ultra_29", "npcf_superior_reactor_ultra"], ["卓越反应堆"])) return true;
		if (status === "jammed" && hasNpcFeature(actor, ["npcf_cn_ultra_31", "npcf_supreme_maintenance_ultra", "npcf_cn_exotic_7", "npcf_living_weaponry_exotic"], ["至高维护", "活体武器"])) return true;
		if (status === "prone" && hasNpcFeature(actor, ["npcf_cn_ultra_33", "npcf_unstoppable_ultra", "npcf_cn_ship_1", "npcf_flyer_ship", "npcf_quadruped_horror"], ["势不可挡", "飞行物", "四足形态"])) return true;
		if (status === "lockon" && hasNpcFeature(actor, ["npcf_null_perception_coating_spec_op"], ["感知屏蔽涂层"])) return true;
	}
	return false;
}

const BURN_IMMUNE_FRAMES = new Set([
	"mf_lancaster",
	"mf_genghis",
	"mf_genghis_alt_worldkiller_genghis_mk_i",
	"mf_ext_salamander",
]);

function isBurnImmune(actor) {
	if (!actor) return false;
	const fLid = mechFrameLid(actor);
	if (fLid && BURN_IMMUNE_FRAMES.has(fLid)) return true;
	if ((actor.type === "npc" || actor.is_npc?.()) && hasNpcFeature(actor, ["npcf_cn_veteran_10", "npcf_insulated_veteran"], ["隔热"])) return true;
	return false;
}

function hasGruntChaff(actor) {
	return Boolean(actor && (actor.type === "npc" || actor.is_npc?.()) && hasNpcFeature(actor, ["npcf_cn_grunt_1", "npcf_chaff_grunt"], ["无用之人"]));
}

function hasGruntWeak(actor) {
	return Boolean(actor && (actor.type === "npc" || actor.is_npc?.()) && hasNpcFeature(actor, ["npcf_cn_grunt_2", "npcf_weak_grunt"], ["贫弱"]));
}

async function triggerGruntWeakDestruction(actor, heatAmount = 1) {
	if (!actor || !hasGruntWeak(actor)) return false;
	if (!actor.isOwner) return false;
	const patch = { "system.hp.value": 0 };
	if ((Number(actor.system?.structure?.max) || 0) > 0) patch["system.structure.value"] = 0;
	await actor.update?.(patch);
	const u = preferredTargetUuid(actor) ?? actor.uuid;
	if (!actor.statuses?.has?.("downandout")) {
		const res = await setActorStatus(u, "downandout", true);
		if (!res.changed && actor.toggleStatusEffect) await actor.toggleStatusEffect("downandout", { active: true });
	}
	await postCpEffectCard(
		actor,
		"低等兵 · 贫弱触发",
		`<p><b>${escHtml(actor.token?.name ?? actor.name)}</b> 从外部来源承受了 <b>${heatAmount} 点热度</b>，触发低等兵模板特征<b>贫弱</b>，立即被摧毁！</p>`,
	);
	return true;
}

async function setActorStatus(uuid, status, active = true) {
	if (!ALL_STATUS_LABELS[status]) return { ok: false, changed: false };
	const doc = typeof uuid === "string" ? resolveDocSync(uuid) : uuid;
	const actor = doc?.actor ?? (doc?.toggleStatusEffect || doc?.statuses ? doc : null);
	if (!actor) return { ok: false, changed: false };
	const name = doc?.name ?? actor.token?.name ?? actor.name ?? "目标";
	if (active && isStatusImmune(actor, status)) {
		return { ok: true, changed: false, immune: true, name };
	}
	const had = Boolean(actor.statuses?.has?.(status));
	if (had === active) return { ok: true, changed: false, name };
	if (Array.isArray(globalThis.CONFIG?.statusEffects) && globalThis.CONFIG.statusEffects.length && !globalThis.CONFIG.statusEffects.some(e => e?.id === status)) {
		return { ok: true, changed: false, name };
	}
	if (actor.isOwner) {
		await actor.toggleStatusEffect(status, { active });
		if (active) await onActorGainedStatus(actor, status);
		return { ok: true, changed: true, name };
	}
	if (!game.users?.activeGM) {
		ui?.notifications?.warn?.("没有在线的 GM，无法对不属于你的角色修改状态。");
		return { ok: false, changed: false, name };
	}
	const targetUuid = typeof uuid === "string" ? uuid : preferredTargetUuid(actor);
	game.socket.emit(`module.${MODULE_ID}`, { action: active ? "applyStatus" : "removeStatus", uuid: targetUuid, status });
	return { ok: true, changed: true, relayed: true, name };
}

async function applyStatusTo(tokenUuid, status) {
	const r = await setActorStatus(tokenUuid, status, true);
	return r.ok;
}

async function removeStatusFrom(tokenUuid, status) {
	const r = await setActorStatus(tokenUuid, status, false);
	return r.ok;
}

// ---------------------------------------------------------------------------
// 文本语义解析：无条件命中 / 暴击状态、强迫豁免、自身增益 / 抗性、非攻击伤害与范围模板
const SAVE_DEFS = [
	{ key: "hull", path: "system.hull", label: "机体豁免", re: /机体\s*豁免|必须通过(?:行)?\s*机体\s*检定(?=\s*[，,]?\s*否则)|\bhull\s+save\b/i },
	{ key: "agi", path: "system.agi", label: "敏捷豁免", re: /(?:行\s*)?敏捷\s*豁免|必须通过(?:行)?\s*敏捷\s*检定(?=\s*[，,]?\s*否则)|\bagility\s+save\b/i },
	{ key: "sys", path: "system.sys", label: "系统豁免", re: /系统\s*豁免|必须通过(?:行)?\s*系统\s*检定(?=\s*[，,]?\s*否则)|\bsystems?\s+save\b/i },
	{ key: "eng", path: "system.eng", label: "工程豁免", re: /工程\s*豁免|必须通过(?:行)?\s*工程\s*检定(?=\s*[，,]?\s*否则)|\bengineering\s+save\b/i },
];

// 剥离「直到……通过……豁免（解除）」恢复性子句，避免把后续脱困检定误判为命中当下的强迫豁免（不跨越逗号，以免误吞「直到其下一回合结束，周围角色必须通过豁免」）
function stripRecoverySaveClause(sentence) {
	return String(sentence || "")
		.replace(/[，,]?\s*直到[^，,。；]*?(?:通过|进行)[^，,。；]*?(?:豁免|save)[^，,。；]*/gi, "")
		.trim();
}

const PURE_RECOVERY_SAVE_RE = /(?:用|以|花费|消耗)\s*(?:一个\s*)?(?:快速|完整)动作[^。]{0,20}(?:成功\s*)?(?:通过|进行)[^。]{0,12}(?:机体|敏捷|系统|工程)?\s*豁免|(?:成功\s*)?(?:通过|进行)[^。]{0,12}(?:机体|敏捷|系统|工程)?\s*豁免\s*(?:来|以)(?:结束|解除|移除)/i;

function parseSavesInText(text, { dc = 10, critOnly = false } = {}) {
	const plain = String(text || "").replace(/<[^>]+>/g, "");
	if (!plain.trim()) return [];
	const sentences = plain.split(/[。；;\n]/).map(s => s.trim()).filter(Boolean);
	const out = [];
	for (let idx = 0; idx < sentences.length; idx++) {
		const rawS = sentences[idx];
		if (PURE_RECOVERY_SAVE_RE.test(rawS) && !/(必须|迫使|否则|失败时|失败则|must|force)/i.test(rawS)) continue;
		const s = stripRecoverySaveClause(rawS);
		if (!s) continue;
		// 排除被动加减值（「你的机体豁免获得+1准度」）与「未命中你的近战攻击迫使攻击者……」
		if (/(未命中你的|miss(?:es)?\s+you)[^。]*?(攻击者|attacker)/i.test(s)) continue;
		if (/(你的|友方|盟友|自身|本机)[^，。]{0,12}(机体|敏捷|系统|工程|所有)?\s*豁免[^，。]{0,8}(获得|承受|\+|-|加值|减值|准度|难度|重掷|自动成功)/i.test(s)) continue;
		if (/(机体|敏捷|系统|工程)\s*豁免\s*(检定)?\s*(获得|承受|\+|-|\d|加值|减值|准度|难度)/i.test(s) && !/(通过|进行|迫使|必须|否则|失败|pass|make|force|must|fail)/i.test(s)) continue;
		if (!/(通过|进行|迫使|必须|否则|失败|成功|对抗|尝试|pass|make|force|must|\bor\b|fail|succeed)/i.test(s)) continue;
		for (const def of SAVE_DEFS) {
			if (!def.re.test(s)) continue;
			const sWithoutPass = s.replace(/[，,；]?\s*(?:豁免成功|成功的话|若成功)[\s\S]*$/i, "");
			const failPartMatch = sWithoutPass.match(/(?:否则|若失败|豁免失败|失败时|失败则|\bor\b|on a fail(?:ed save|ure)?)([\s\S]*)$/i);
			const failStatuses = statusesIn(failPartMatch ? failPartMatch[0] : sWithoutPass, { strict: false });
			for (let j = idx + 1; j < Math.min(sentences.length, idx + 3); j++) {
				const nxt = stripRecoverySaveClause(sentences[j]);
				if (/(豁免失败|若豁免失败|若失败|失败时|失败的目标|on a fail(?:ed save|ure)?)/i.test(nxt)) {
					for (const st of statusesIn(nxt, { strict: false })) if (!failStatuses.includes(st)) failStatuses.push(st);
				} else break;
			}
			const windowText = sentences.slice(idx, idx + 3).join("。");
			const halfOnSuccess = /((?:成功|通过[^。]{0,8}?(?:豁免|检定))[^。]{0,16}(?:减半|一半)|(?:减半|一半伤害|所受\s*伤害减半)[^。]{0,12}(?:成功|通过)|成功的话[^。]{0,16}伤害减半|half\s+damage\s+on\s+a\s+success|half\s+on\s+a\s+successful\s+save|on\s+a\s+success[^.]{0,24}half)/i.test(windowText);
			const passPartMatch = windowText.match(/(?:成功的话|豁免成功时?|若成功)([^。]*)/i);
			const passStatuses = passPartMatch ? statusesIn(passPartMatch[1].replace(/(?:不(?:会|再|受|陷入)?|免于|避免)[^，,。]*/g, ""), { strict: false }) : [];
			const existing = out.find(x => x.key === def.key && x.critOnly === critOnly);
			if (existing) {
				for (const st of failStatuses) if (!existing.failStatuses.includes(st)) existing.failStatuses.push(st);
				for (const st of passStatuses) if (!existing.passStatuses.includes(st)) existing.passStatuses.push(st);
				if (halfOnSuccess) existing.halfOnSuccess = true;
			} else {
				out.push({ key: def.key, path: def.path, label: def.label, dc: Number(dc) || 10, failStatuses, passStatuses, halfOnSuccess, critOnly });
			}
		}
	}
	return out;
}

const CONDITIONAL_BEFORE_RE = /(若|如果|除非|选择|可以|(?<!将|会)处于|具有|已处于|消耗\s*\d|额外支付|执行任何其他动作|\bif\b|\bunless\b|\bchoose\b|\bmay\b|\balready\b|\bspend\b)/i;
const CONTINGENT_SENTENCE_START_RE = /^\s*(若|如果|除非|选择|当|每当|在[^，。]{0,14}(?:回合结束|回合开始)|执行任何其他动作|\bif\b|\bunless\b|\bwhen\b|\bwhenever\b)/i;

function scanUnconditionalStatuses(rawText, bucket, allStatuses, { strict = false, triggerRe = null, excludeRe = null } = {}) {
	const plain = String(rawText || "").replace(/<[^>]+>/g, "");
	if (!plain.trim()) return;
	const sentences = plain.split(/[。；;\n]/);
	let prevSave = false;
	for (const rawS of sentences) {
		const s = stripRecoverySaveClause(rawS);
		if (!s) continue;
		const hasUpfrontSave = /(豁免|save)/i.test(s) && !PURE_RECOVERY_SAVE_RE.test(rawS);
		const isSaveFollowup = prevSave && /(失败|否则|fail)/i.test(s);
		prevSave = hasUpfrontSave;
		if (strict && (!TARGET_SENTENCE.test(s) || /攻击者|attacker/i.test(s))) continue;
		if (excludeRe && excludeRe.test(s)) continue;
		const ids = statusesIn(s, { strict: false });
		for (const id of ids) if (!allStatuses.includes(id)) allStatuses.push(id);
		if (isSaveFollowup) continue;
		if (triggerRe && !triggerRe.test(s)) continue;
		if (CONTINGENT_SENTENCE_START_RE.test(s)) continue;

		// 若同一句前半段无豁免地直接赋予目标状态、后半段才对周围敌人发起豁免（如「你的目标锁定，受损……，目标周围爆发2……必须通过系统豁免否则锁定」），只扫描豁免之前的分句
		let scanPart = s;
		if (hasUpfrontSave) {
			const subclauses = s.split(/[，,]/);
			const prefix = [];
			for (const sub of subclauses) {
				if (/(豁免|save)/i.test(sub)) break;
				prefix.push(sub);
			}
			scanPart = prefix.join("，");
			if (!scanPart.trim()) continue;
		}

		const scanIds = hasUpfrontSave ? statusesIn(scanPart, { strict: false }) : ids;
		for (const id of scanIds) {
			if (bucket.includes(id)) continue;
			const word = STATUS_WORDS.find(([w, sid]) => sid === id && scanPart.includes(w))?.[0] ?? "";
			const idx = word ? scanPart.indexOf(word) : 0;
			const clauseBefore = scanPart.slice(0, idx).split(/[，,]/).pop() ?? "";
			if (CONDITIONAL_BEFORE_RE.test(clauseBefore)) continue;
			bucket.push(id);
		}
	}
}

function classifyAttackCard(item, basicKey, dc = 10) {
	const autoHitStatuses = [...(BASIC_ACTIONS[basicKey]?.statuses ?? [])];
	const autoCritStatuses = [];
	const allStatuses = [...autoHitStatuses];
	const saves = [];
	const mergeSaves = list => {
		for (const sv of list) {
			const ex = saves.find(x => x.key === sv.key && x.critOnly === sv.critOnly);
			if (ex) {
				for (const st of sv.failStatuses) if (!ex.failStatuses.includes(st)) ex.failStatuses.push(st);
				for (const st of sv.passStatuses ?? []) if (!(ex.passStatuses ?? []).includes(st)) ex.passStatuses = [...(ex.passStatuses ?? []), st];
				if (sv.halfOnSuccess) ex.halfOnSuccess = true;
			} else saves.push(sv);
		}
	};
	const s = item?.system;
	if (s) {
		const profile = s.active_profile ?? s.profiles?.[s.selected_profile_index ?? 0];
		for (const o of [profile, s]) {
			if (o?.on_hit) {
				scanUnconditionalStatuses(o.on_hit, autoHitStatuses, allStatuses, { strict: false });
				mergeSaves(parseSavesInText(o.on_hit, { dc, critOnly: false }));
			}
			if (o?.on_crit) {
				scanUnconditionalStatuses(o.on_crit, autoCritStatuses, allStatuses, { strict: false });
				mergeSaves(parseSavesInText(o.on_crit, { dc, critOnly: true }));
			}
			for (const f of ["effect", "on_attack"]) if (o?.[f]) {
				scanUnconditionalStatuses(o[f], autoCritStatuses, allStatuses, { strict: true, triggerRe: /(会心一击|会心时|会心[:：]|暴击时|\bon\s+crit\b)/i });
				scanUnconditionalStatuses(o[f], autoHitStatuses, allStatuses, { strict: true, triggerRe: /(命中时|命中后|命中[:：]|命中则|攻击成功时|若成功|受到该武器伤害|\bon\s+hit\b)/i, excludeRe: /(会心一击|会心时|会心[:：]|暴击时|\bon\s+crit\b)/i });
				mergeSaves(parseSavesInText(o[f], { dc, critOnly: false }));
			}
		}
		for (const a of s.actions ?? []) if (a.detail) {
			scanUnconditionalStatuses(a.detail, autoHitStatuses, allStatuses, { strict: true, triggerRe: /(命中时|命中后|命中[:：]|命中则|攻击成功时|\bon\s+hit\b)/i });
			mergeSaves(parseSavesInText(a.detail, { dc, critOnly: false }));
		}
		for (const t of attackTexts(item)) for (const id of statusesIn(t.text, { strict: t.strict })) if (!allStatuses.includes(id)) allStatuses.push(id);
	}
	return { autoHitStatuses, autoCritStatuses, allStatuses, saves };
}

const SELF_BUFF_PATTERNS = [
	{ ids: RESIST_IDS, re: /(获得|具有|赋予)[^。；]{0,16}?(所有|全部|一切)伤害(的)?抗性|resistance to all damage/i },
	{ ids: ["resistance_kinetic"], re: /(获得|具有|赋予)[^。；]{0,16}?动能[^。；]{0,10}?抗性|resistance to[^.;]{0,15}kinetic/i },
	{ ids: ["resistance_energy"], re: /(获得|具有|赋予)[^。；]{0,16}?能量[^。；]{0,10}?抗性|resistance to[^.;]{0,15}energy/i },
	{ ids: ["resistance_explosive"], re: /(获得|具有|赋予)[^。；]{0,16}?爆炸[^。；]{0,10}?抗性|resistance to[^.;]{0,15}explosive/i },
	{ ids: ["resistance_heat"], re: /(获得|具有|赋予)[^。；]{0,16}?热度[^。；]{0,10}?抗性|resistance to[^.;]{0,15}heat/i },
	{ ids: ["resistance_burn"], re: /(获得|具有|赋予)[^。；]{0,16}?燃烧[^。；]{0,10}?抗性|resistance to[^.;]{0,15}burn/i },
	{ ids: ["invisible"], re: /(变为|成为|获得|进入|陷入|会|永久)隐形|(你|自身|它们|本机)隐形|\bbecome\s+invisible\b|\bgain\s+invisible\b/i },
	{ ids: ["intangible"], re: /(变为|成为|获得|进入|陷入|处于)无形|\bbecome\s+intangible\b/i },
	{ ids: ["hidden"], re: /(变为|成为|获得|进入)匿迹|\bbecome\s+hidden\b/i },
	{ ids: ["bolster"], re: /(获得|赋予)[^。；]{0,8}?(强化|支援)|\bgain\s+bolster\b/i },
	{ ids: ["flying"], re: /(获得|开始)飞行|\bbegin\s+flying\b|\bfly\s+until\b/i },
];

function selfStatusesIn(text) {
	const plain = String(text || "").replace(/<[^>]+>/g, "");
	if (!plain.trim()) return { auto: [], manual: [] };
	const auto = [], manual = [];
	for (const raw of plain.split(/[。；;\n]/)) {
		const s = raw.trim();
		if (!s) continue;
		if (/(失去|移除|清除|解除|不再|忽略|无视|免疫|视为没有|不能获得|无法获得|无法受益|不能受益|不受益|lose|remove|clear|ignore|cannot)/i.test(s)) continue;
		const isOtherOrConditional = /(盟友|友方|一个角色|目标|选择|如果|若|或|当.*时|对下一次|下次攻击|ally|allied|character|target|choose|\bor\b|\bif\b|\bwhen\b|next attack)/i.test(s);
		for (const p of SELF_BUFF_PATTERNS) {
			if (!p.re.test(s)) continue;
			if (p.ids[0] === "invisible") {
				if (/(隐形(时|的角色|状态的角色|目标)|while invisible|invisible character)/i.test(s) && !/(变为|成为|获得|进入)隐形|你隐形/i.test(s)) continue;
				if (/(地雷|无人机|陷阱|护盾|力场)[^，。]{0,8}隐形/i.test(s) && !/(你|自身|本机)[^，。]{0,6}(变为|成为|获得|进入)?隐形/i.test(s)) continue;
			}
			const dest = isOtherOrConditional ? manual : auto;
			for (const id of p.ids) if (!auto.includes(id) && !manual.includes(id)) dest.push(id);
		}
	}
	return { auto, manual };
}

const DMG_TYPE_MAP = {
	"动能": "Kinetic", kinetic: "Kinetic",
	"能量": "Energy", energy: "Energy",
	"爆炸": "Explosive", explosive: "Explosive",
	"燃烧": "Burn", burn: "Burn",
	"热度": "Heat", heat: "Heat",
};

function parseNonAttackDamage(text, actor = null, item = null) {
	const plain = String(text || "").replace(/<[^>]+>/g, "");
	if (!plain.trim()) return null;
	const effTier = Number(item?.system?.tier_override) || Number(actor?.system?.tier) || 1;
	const tierIdx = Math.min(3, Math.max(1, effTier)) - 1;
	const damage = [];
	let ap = false;
	for (const raw of plain.split(/[。；;\n]/)) {
		const s = raw.replace(/(?:清除|恢复|移除|消除|冷却|失去|排散)\s*\{?\s*\d+(?:\s*[/／]\s*\d+)*\s*\}?\s*点?\s*(?:热度|燃烧)/gi, " ").trim();
		if (!s) continue;
		if (/(物件|地形|障碍物|掩体|objects?\s+(?:and|or)\s+terrain)/i.test(s) && !/(角色|敌|目标|character|hostile|enemy|target)/i.test(s)) continue;
		if (/(抗性|免疫[^，。]*伤害|受到的[^，。]*伤害\s*(减少|降低|减半)|武器[^，。]*(额外|造成)|下次攻击|(?:所有|全部|其|对方|盟友)攻击造成\s*\+)/i.test(s)) continue;
		if (/^(你|自身|本机)(承受|受到|产生)\s*\{?\s*\d+\s*\}?\s*(点)?\s*热度/i.test(s) && !/(目标|角色|敌|区域|爆发|溅射|锥形|线形)/i.test(s)) continue;

		let rest = s;
		const tierRe = /\{?\s*(\d+d\d+(?:\s*[+-]\s*\d+)?|\d+)\s*[/／]\s*(\d+d\d+(?:\s*[+-]\s*\d+)?|\d+)\s*[/／]\s*(\d+d\d+(?:\s*[+-]\s*\d+)?|\d+)\s*\}?\s*点?\s*(穿甲\s*|AP\s*)?(动能|能量|爆炸|燃烧|热度|Kinetic|Energy|Explosive|Burn|Heat)\s*(穿甲\s*|AP\s*)?(伤害)?/gi;
		rest = rest.replace(tierRe, (_m, v1, v2, v3, ap1, dt, ap2) => {
			const picked = [v1, v2, v3][tierIdx].replace(/\s+/g, "");
			const type = DMG_TYPE_MAP[dt.toLowerCase()] ?? DMG_TYPE_MAP[dt];
			if (type) damage.push({ type, val: picked });
			if (ap1 || ap2) ap = true;
			return " ";
		});

		const singleRe = /(造成|受到|承受|take|deal)?([^，。]{0,8}?)(\d+d\d+(?:\s*[+-]\s*\d+)?|\d+)\s*点?\s*(穿甲\s*|AP\s*)?(动能|能量|爆炸|燃烧|热度|Kinetic|Energy|Explosive|Burn|Heat)\s*(穿甲\s*|AP\s*)?(伤害)?/gi;
		for (const m of rest.matchAll(singleRe)) {
			const [, verb, mid, valRaw, ap1, dt, ap2, hasDmgWord] = m;
			const isCompoundHeatBurn = damage.length > 0 && /^(?:热度|燃烧|heat|burn)$/i.test(dt) && /(?:与|和|及|并|\+|and)\s*$/i.test(mid);
			if (!hasDmgWord && !verb && !isCompoundHeatBurn) continue;
			if (/(上限|抗性|阈值|少于|低于|高于|大于|至少|至多)/.test(mid)) continue;
			if (verb && /\+\s*$/.test(mid) && /攻击[^，。]{0,6}$/.test(rest.slice(0, m.index))) continue;
			const type = DMG_TYPE_MAP[dt.toLowerCase()] ?? DMG_TYPE_MAP[dt];
			if (!type) continue;
			damage.push({ type, val: valRaw.replace(/\s+/g, "") });
			if (ap1 || ap2) ap = true;
		}
		if (damage.length && /(穿甲|\bAP\b|armor[- ]piercing)/i.test(s)) ap = true;
	}
	if (!damage.length) return null;
	const dedup = [];
	for (const d of damage) if (!dedup.some(x => x.type === d.type && x.val === d.val)) dedup.push(d);
	return { damage: dedup, ap };
}

const AOE_WORD_MAP = {
	"溅射": "Blast", blast: "Blast",
	"爆发": "Burst", burst: "Burst",
	"线形": "Line", line: "Line",
	"锥形": "Cone", cone: "Cone",
};

function parseAoERanges(text, item = null) {
	const out = [];
	const push = (type, val) => {
		const n = Number(val);
		if (!AOE_TYPES.includes(type) || !Number.isFinite(n) || n <= 0) return;
		if (!out.some(x => x.type === type && x.val === n)) out.push({ type, val: n, label: `${RANGE_ZH[type] ?? type} ${n}` });
	};
	const s = item?.system;
	for (const r of [...(item?.currentProfile?.()?.range ?? []), ...(s?.range ?? []), ...(s?.active_profile?.range ?? [])]) {
		if (r?.type) push(r.type, r.val);
	}
	for (const a of s?.actions ?? []) for (const r of a?.range ?? []) if (r?.type) push(r.type, r.val);
	const plain = String(text || "").replace(/<[^>]+>/g, "");
	for (const m of plain.matchAll(/(溅射|爆发|线形|锥形|\bBlast|\bBurst|\bLine|\bCone)\s*(\d+)/gi)) {
		const key = m[1].toLowerCase();
		const type = AOE_WORD_MAP[key] ?? AOE_WORD_MAP[m[1]];
		if (type) push(type, m[2]);
	}
	return out;
}

function isPersistentAoEText(text) {
	const plain = String(text || "").replace(/<[^>]+>/g, "");
	if (!plain) return false;
	return /(进口|区域|云|力场|烟雾|地带|线形|爆发|溅射|护盾|气泡|领域|火墙)[^。；！？\n]{0,20}(持续(存在)?(至|到)|保留(至|到)|留在场上|remain(?:s)? in play)/i.test(plain)
		|| /(持续(存在)?(至|到)|保留(至|到))\s*场景结束/.test(plain);
}

// 提取带嵌套标签的 class 块（计数器配对起止 div / span，避免多层嵌套 <div> 的卡片被非贪婪正则在首个 </div> 处提前截断）
function extractBalancedClassBlocks(rawHtml, classRe) {
	const html = String(rawHtml ?? "");
	if (!html) return [];
	const tagRe = /<(\/?)(div|span)\b([^>]*)>/gi;
	const out = [];
	let skipUntil = 0;
	for (const m of html.matchAll(tagRe)) {
		if (m.index < skipUntil) continue;
		const isClose = Boolean(m[1]);
		if (isClose || /\/\s*>$/.test(m[0])) continue;
		const clsAttr = m[3]?.match(/\bclass\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
		if (!classRe.test(clsAttr)) continue;
		const targetTag = m[2].toLowerCase();
		const openEnd = m.index + m[0].length;
		let depth = 1;
		let closeStart = -1;
		let closeEnd = html.length;
		const innerRe = new RegExp(`<(\\/?)${targetTag}\\b([^>]*)>`, "gi");
		innerRe.lastIndex = openEnd;
		let im;
		while ((im = innerRe.exec(html)) !== null) {
			if (im[1]) {
				depth--;
				if (depth === 0) {
					closeStart = im.index;
					closeEnd = im.index + im[0].length;
					break;
				}
			} else if (!/\/\s*>$/.test(im[0])) {
				depth++;
			}
		}
		out.push(closeStart >= 0 ? html.slice(openEnd, closeStart) : html.slice(openEnd));
		skipUntil = closeEnd;
	}
	return out;
}

// 科技攻击 / 入侵卡单独分类：精准隔离本次选中的单一入侵或科技选项文本，并生成非入侵伤害按钮与自伤附加按钮
function extractTechActionContext(message, attack, item, basicKey) {
	const techMeta = message?.getFlag?.(MODULE_ID, "techActionMeta") ?? message?.flags?.[MODULE_ID]?.techActionMeta ?? null;
	const rawHtml = String(message?.content ?? "");
	const headerText = rawHtml.match(/class="[^"]*lancer-header[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
	const afterColons = headerText.includes("::") ? headerText.split("::").slice(1).join("::").replace(/\/\//g, "").trim() : "";
	const actionName = String(techMeta?.actionName || afterColons || techMeta?.title || "").trim();

	let effectText = String(techMeta?.effect ?? "").trim();
	if (!effectText && rawHtml) {
		const blocks = extractBalancedClassBlocks(rawHtml, /\beffect-text\b/i);
		if (blocks.length) effectText = blocks.join("。").trim();
	}
	if (!effectText && basicKey && BASIC_ACTIONS[basicKey]?.effect) {
		effectText = BASIC_ACTIONS[basicKey].effect;
	}
	if (!effectText && item?.system) {
		const actions = [...(item.system.actions ?? [])];
		if (item.type === "talent" || item.is_talent?.()) {
			const rank = Number(item.system.curr_rank) || 1;
			for (const r of (item.system.ranks ?? []).slice(0, rank)) {
				for (const a of r?.actions ?? []) actions.push(a);
			}
		}
		const matched = actionName ? actions.find(a => String(a?.name ?? "").trim() === actionName) : (actions.length === 1 ? actions[0] : null);
		if (matched?.detail) effectText = matched.detail;
		else if (!actions.length && item.system.effect) effectText = item.system.effect;
	}
	return { actionName, effectText };
}

function parseTechTargetDamage(effectText, actor, item = null) {
	const plain = String(effectText || "").replace(/<[^>]+>/g, "");
	if (!plain.trim()) return null;
	// 剔除「你受到 1d6 AP 能量伤害」自伤分句与「并在场景余下时间内 / 每当……」持续阶段分句，只提取命中当下的目标伤害/热度/燃烧
	const cleaned = plain
		.split(/[。；;\n]/)
		.map(s => s.replace(/(?:^|[，,])\s*你(?:自身)?(?:受到|承受)[^，。]*/g, "").replace(/(?:并在场景余下时间内|在场景余下时间内|此后|每当|每次|每自愿移动|每主动移动)[\s\S]*$/g, ""))
		.filter(s => s && !/(?:邻接的角色受到|周围[^。]*受到)/i.test(s))
		.join("。");
	return parseNonAttackDamage(cleaned, actor, item);
}

function classifyTechAttackCard(message, attack, item, actor, basicKey, dc = 10) {
	const mech = combatMechOf(actor);
	const { actionName, effectText } = extractTechActionContext(message, attack, item, basicKey);
	const itemLid = String(item?.system?.lid ?? "");
	const autoHitStatuses = [...(BASIC_ACTIONS[basicKey]?.statuses ?? [])];
	const allStatuses = [...autoHitStatuses];
	const saves = [];
	const techRiders = [];
	let nonAttackDamage = null;

	// 1. 欧西里斯级 NHP「抛入杜阿特」：按当前第 1~4 门阶段精准施加效果
	if (itemLid === "ms_osiris_class_nhp" || /抛入杜阿特/.test(actionName)) {
		const gate = Math.min(4, Math.max(1, Number(getCombatState(mech).osirisGate) || 1));
		if (gate === 2) autoHitStatuses.push("slow", "impaired");
		else if (gate === 3) autoHitStatuses.push("stunned");
		allStatuses.push("slow", "impaired", "stunned");
		if (!attack?.invade) nonAttackDamage = { damage: [{ type: "Heat", val: "2" }], ap: false };
		return {
			actionName: actionName || `抛入杜阿特（第 ${gate} 门）`,
			effectText, autoHitStatuses, autoCritStatuses: [], allStatuses, saves,
			nonAttackDamage, techRiders, osirisGate: gate,
		};
	}

	// 2. 骇客 III「王的最后受辞」：非入侵科技攻击，命中造成等同目标当前热度的燃烧
	if ((itemLid === "t_hacker" && /王的最后受辞|Last Argument/i.test(actionName || effectText)) || /王的最后受辞/.test(actionName)) {
		const hitTargets = (attack?.targets ?? []).filter(t => t.hit || t.crit);
		const firstTargetActor = hitTargets[0] ? resolveActor(hitTargets[0].uuid) : null;
		const curHeat = Math.max(0, Number(firstTargetActor?.system?.heat?.value) || 0);
		nonAttackDamage = {
			damage: [{ type: "Burn", val: String(curHeat) }],
			ap: false,
			dynamicTargetHeatBurn: true,
			labelOverride: hitTargets.length === 1 ? `${curHeat} 燃烧（目标当前热度）` : "目标当前热度 燃烧",
		};
		return {
			actionName: actionName || "王的最后受辞",
			effectText, autoHitStatuses, autoCritStatuses: [], allStatuses, saves,
			nonAttackDamage, techRiders,
		};
	}

	if (effectText) {
		scanUnconditionalStatuses(effectText, autoHitStatuses, allStatuses, { strict: false });
		for (const sv of parseSavesInText(effectText, { dc, critOnly: false })) {
			if (!saves.some(x => x.key === sv.key)) saves.push(sv);
		}
		if (!attack?.invade) {
			nonAttackDamage = parseTechTargetDamage(effectText, mech, item);
		} else {
			// 入侵自带 2 热度按钮（.lancer-damage-flow），但像「内伤（4 燃烧）」「弹出能源核心（邻接 2 能量）」有额外伤害时补独立按钮
			const extraDmg = parseNonAttackDamage(effectText.replace(/(?:^|[，,。])\s*你(?:自身)?(?:受到|承受)[^，。]*/g, ""), mech, item);
			const nonHeat = (extraDmg?.damage ?? []).filter(d => !(d.type === "Heat" && d.val === "2"));
			if (nonHeat.length) techRiders.push({ kind: "extraDmg", damage: nonHeat, ap: Boolean(extraDmg?.ap) });
		}
		// 自伤检测（如惩击「你受到 1d6 AP 能量伤害」、招手者「你受到 1d6+2 AP 能量伤害」）
		const selfDmgMatch = String(effectText).replace(/<[^>]+>/g, "").match(/你(?:自身)?(?:受到|承受)\s*(\d+d\d+(?:\s*[+-]\s*\d+)?|\d+)\s*点?\s*(穿甲\s*|AP\s*)?(动能|能量|爆炸|燃烧|热度)/i);
		if (selfDmgMatch) {
			const [, formula, apRaw, dtRaw] = selfDmgMatch;
			const dType = DMG_TYPE_MAP[dtRaw.toLowerCase()] ?? DMG_TYPE_MAP[dtRaw] ?? "Energy";
			techRiders.push({ kind: "selfDmg", formula: formula.replace(/\s+/g, ""), type: dType, ap: Boolean(apRaw) });
		}
	}

	// 骇客 I「雪崩」：消耗锁定的科技攻击命中时，目标选择 +2 热度或被推动 3 格
	const anyHit = (attack?.targets ?? []).some(t => t.hit || t.crit);
	const usedLockOn = (attack?.targets ?? []).some(t => (t.hit || t.crit) && (t.setConditions?.lockon === false || t.setConditions?.lockOn === false));
	if (usedLockOn && talentRank(mech, "t_hacker") >= 1) {
		techRiders.push({ kind: "snowcrashHeat", label: "❄️ 雪崩：目标 +2 热度（或被推 3 格）" });
	}
	// 老兵模板「骇客」（npcf_cn_veteran_7）：科技攻击命中时可额外造成 +2 热度（或黑入移动）
	if (anyHit && hasNpcFeature(actor, ["npcf_cn_veteran_7", "npcf_hacker_veteran"], ["骇客"])) {
		techRiders.push({ kind: "veteranHackerHeat", label: "💻 老兵骇客：目标额外 +2 热度" });
	}
	// 核心奖励「增强系统升级」（cb_ext_enhanced_system_upgrade）：1/轮，入侵成功时可选择额外 +2 热度或第二个入侵选项
	if (attack?.invade && anyHit && hasCoreBonus(mech, "cb_ext_enhanced_system_upgrade") && !getCombatState(mech).usedEnhancedSysInvade) {
		techRiders.push({ kind: "enhancedSysInvade", label: "⚡ 增强系统升级：目标额外 +2 热度（1/轮）" });
	}

	return {
		actionName, effectText, autoHitStatuses, autoCritStatuses: [], allStatuses, saves,
		nonAttackDamage, techRiders,
	};
}

function isTechAttackMessage(message, attack, item, basicKey) {
	if (!attack) return false;
	if (message?.getFlag?.(MODULE_ID, "techActionMeta") || message?.flags?.[MODULE_ID]?.techActionMeta) return true;
	if (typeof attack.invade === "boolean") return true;
	if (basicKey && BASIC_ACTIONS[basicKey]?.flow === "TechAttackFlow") return true;
	if (item?.system?.type === "Tech") return true;
	const rawHtml = String(message?.content ?? "");
	return /\/\/\s*(?:INVADE|TECH ATK|入侵|科技攻击)/i.test(rawHtml);
}

// 收集武器攻击卡上的改装件 / 武器 / 天赋附加动作按钮（如电击花环、熔融缠绕、穿栓弹、猎食罐、风暴使者、百手巨神、看招等）
function collectWeaponAttackRiders(message, attack, item, actor, dc = 10) {
	const riders = [];
	const mech = combatMechOf(actor);
	const targets = attack?.targets ?? [];
	const anyHit = targets.some(t => t.hit || t.crit);
	const anyCrit = targets.some(t => t.crit);
	const wLid = weaponLidOf(item);
	const modLid = weaponModLidOf(item);
	const benefitsTalent = itemBenefitsFromTalents(item);

	if (modLid === "wm_shock_wreath" && anyHit) {
		riders.push({ kind: "shockWreath", label: "⚡ 电击花环（1d6 燃烧 + 致盲视线）" });
	}
	if (modLid === "wm_molten_wreathe" && anyHit) {
		riders.push({ kind: "moltenWreathe", label: "🔥 熔融缠绕（自身+1热度 · 锥形3 2爆炸）" });
	}
	if (modLid === "wm_throughbolt_rounds") {
		riders.push({ kind: "throughbolt", label: "🔩 穿栓弹（线形3 · 2 穿甲动能）" });
	}
	if (modLid === "wm_ext_seek_devour_canister" && anyHit) {
		riders.push({ kind: "seekDevour", label: "🐝 猎食罐（爆发1 · 2 燃烧）" });
	}
	if (modLid === "wm_pl_optimized" && targets.some(t => !t.hit && !t.crit)) {
		riders.push({ kind: "optimizedReroll", label: "🎯 最优化工程（重掷未命中攻击）" });
	}

	if (benefitsTalent) {
		const wTypes = weaponTypesOf(item);
		if (wTypes.includes("Launcher") && anyHit && talentRank(mech, "t_stormbringer") >= 2) {
			riders.push({ kind: "stormbringerThunder", label: `🌩 雷霆（爆发2 敏捷豁免 DC ${dc} 击退1）` });
			riders.push({ kind: "stormbringerLightning", label: `⚡ 闪电（机体豁免 DC ${dc} 击退3）` });
		}
		if (wTypes.includes("Nexus") && anyCrit && talentRank(mech, "t_centimane") >= 1) {
			const r = talentRank(mech, "t_centimane");
			if (r >= 3) {
				riders.push({ kind: "centimaneSave", label: `🦑 潮汐抑制（系统豁免 DC ${dc} · 四选一虫群）` });
			} else {
				riders.push({ kind: "centimaneImpaired", label: `🦑 万齿（系统豁免 DC ${dc} → 受损+缓慢）` });
			}
		}
		if (wTypes.includes("Rifle") && anyCrit && talentRank(mech, "t_crack_shot") >= 3 && (message?.getFlag?.(MODULE_ID, "watchThisArmed") || getCombatState(mech).steadyAim || mech?.statuses?.has?.("immobilized"))) {
			riders.push({ kind: "crackShotWatchThis", label: `🎯 看招！（机体豁免 DC ${dc} · 三选一重创）` });
		}
		if (wTypes.includes("CQB") && wLid === "mw_ext_ifrit_slip") {
			// 伊芙利特滑膛特殊不触发核心奖励，仍保留天赋判定
		}
		const ammo = message?.getFlag?.(MODULE_ID, "walkingArmoryAmmo") ?? "";
		if (ammo === "shock") {
			riders.push({ kind: "walkingArmoryShock", label: "⚡ 电击弹（邻接角色 1 穿甲能量）" });
		} else if (ammo === "javelin" && anyHit) {
			riders.push({ kind: "walkingArmoryJavelin", label: `🏹 猎人弹（机体豁免 DC ${dc} → 伏卧）` });
		}
		// 猎人 I「跳扑」：1/轮，使用副近战武器攻击时，攻击前可朝目标飞行至多 3 格（忽略交战且不触发反应）
		if (item?.system?.size === "Auxiliary" && isMeleeWeaponItem(item) && talentRank(mech, "t_hunter") >= 1 && !getCombatState(mech).usedHunterLunge) {
			riders.push({ kind: "hunterLunge", label: "🦅 跳扑（朝目标飞行3格 · 1/轮无视交战与反应）" });
		}
		// 猎人 III「蔑刃」：1/轮，近战攻击命中时，以自由动作投掷一把副近战武器攻击射程内任意角色（无额外伤害）
		const basicKey = message?.getFlag?.(MODULE_ID, "basicAction") ?? message?.flags?.[MODULE_ID]?.basicAction;
		const isMeleeAtk = item ? isMeleeWeaponItem(item) : basicKey === "improvised";
		if (isMeleeAtk && anyHit && talentRank(mech, "t_hunter") >= 3 && !getCombatState(mech).usedHunterDisdainful) {
			riders.push({ kind: "hunterDisdainful", label: "🗡️ 蔑刃（自由动作投掷副近战武器 · 无额外伤害）" });
		}
		// 佩西拉特「肌肉示踪触觉」：1/轮，无武器近战攻击（冲撞/擒拿）命中时 +1d6 额外伤害
		if (!item && (basicKey === "grapple" || basicKey === "ram") && anyHit && mechFrameLid(mech) === "mf_ch_pesilat" && !getCombatState(mech).usedPesilatMuscle) {
			riders.push({ kind: "pesilatMuscleDmg", label: "🥊 肌肉示踪触觉（1/轮 无武器近战 +1d6 动能）" });
		}
	}
	// 黑巫蛾「磁力格挡」：针对黑巫蛾或邻接友军且可能造成动能伤害的攻击，1/轮反应掷 1d6（5+ 令攻击失手）
	if (anyHit) {
		const profDmg = weaponProfileOf(item)?.damage ?? [];
		const canKinetic = !profDmg.length || profDmg.some(d => !d?.type || d.type === "Kinetic" || d.type === "Variable");
		if (canKinetic) {
			const hasParryDefender = targets.some(t => {
				if (!t.hit && !t.crit) return false;
				const defDoc = resolveDocSync(t.uuid);
				const defActor = defDoc?.actor ?? resolveActor(t.uuid);
				if (mechFrameLid(defActor) === "mf_black_witch" && !getCombatState(defActor).usedBlackWitchParry) return true;
				const defTok = defDoc?.object ?? (defActor ? attackerToken(defActor) : null);
				if (!defTok) return false;
				const defDisp = defTok.document?.disposition ?? 1;
				return (globalThis.canvas?.tokens?.placeables ?? []).some(tok =>
					tok !== defTok
					&& tok.actor
					&& (tok.document?.disposition ?? 1) === defDisp
					&& mechFrameLid(tok.actor) === "mf_black_witch"
					&& !getCombatState(tok.actor).usedBlackWitchParry
					&& (tokenDistance(defTok, tok) ?? 99) <= 1,
				);
			});
			if (hasParryDefender) {
				riders.push({ kind: "blackWitchParry", label: "🧲 磁力格挡反应（1/轮 · 掷 1d6，5+ 令攻击失手）" });
			}
		}
		// 老兵模板「闪电反射」（npcf_cn_veteran_13）：重型或超重型武器命中时，1/轮反应掷 1d6（5+ 令攻击失手）
		if (item?.system?.size === "Heavy" || item?.system?.size === "Superheavy") {
			const hasReflexVet = targets.some(t => {
				if (!t.hit && !t.crit) return false;
				const defActor = resolveActor(t.uuid);
				return hasNpcFeature(defActor, ["npcf_cn_veteran_13", "npcf_lightning_reflexes_veteran"], ["闪电反射"]) && !getCombatState(defActor).usedVeteranLightningReflex;
			});
			if (hasReflexVet) {
				riders.push({ kind: "veteranLightningReflex", label: "⚡ 老兵闪电反射（1/轮反应 · 掷 1d6，5+ 回避重武器）" });
			}
		}
	}
	return riders;
}

// 解析 NPC 无人机 / 地雷 / 可展开系统的属性规格（支持按 NPC 层级或 tier_override 自动缩放 A/B/C 三档数值）
function parseNpcDeployableSpec(item, text, actor) {
	const isNpcContext = Boolean(
		actor?.type === "npc"
		|| actor?.is_npc?.()
		|| item?.type === "npc_feature"
		|| item?.is_npc_feature?.(),
	);
	if (!isNpcContext) return null;
	const plain = String(text || "").replace(/<[^>]+>/g, "").trim();
	const tags = [...(item?.getTags?.() ?? []), ...(item?.system?.tags ?? [])];
	const tagLids = new Set(tags.map(t => String(t?.lid ?? t?.id ?? "")));
	const hasDroneTag = tagLids.has("tg_drone") || tags.some(t => t?.is_drone);
	const hasMineTag = tagLids.has("tg_mine") || tags.some(t => t?.is_mine);
	const hasDeployTag = tagLids.has("tg_deployable") || tags.some(t => t?.is_deployable);
	const parenMatch = plain.match(/([^\s。；：:，,（(]{1,16})?\s*[（(]\s*(?:大小|尺寸)\s*(1\s*[/／]\s*2|0\.5|½|\d+)([^）)]*(?:HP|生命|回避|闪避|ED|电子防御)[^）)]*)[）)]?/i);
	if (!hasDroneTag && !hasMineTag && !hasDeployTag && !parenMatch) return null;

	const tier = Math.min(3, Math.max(1, Number(item?.system?.tier_override) || Number(actor?.system?.tier) || 1));
	const tierIdx = tier - 1;
	const pickTierNum = (s, reList, fallback) => {
		for (const re of reList) {
			const m = s.match(re);
			if (!m) continue;
			const parts = String(m[1]).split(/[/／]/).map(x => parseInt(x.trim(), 10)).filter(Number.isFinite);
			if (parts.length >= 3) return parts[tierIdx];
			if (parts.length >= 1) return parts[0];
		}
		return fallback;
	};

	const deployType = hasMineTag
		? "Mine"
		: (hasDroneTag || /无人机|炮塔|蜂群|尸仆/.test(String(item?.name ?? "") + (parenMatch?.[1] ?? "")))
			? "Drone"
			: "Deployable";

	let rawName = String(parenMatch?.[1] ?? "").replace(/^(?:创建|部署|发射|安置|制造)(?:一个|一架|一台|一枚|一块)?/, "").trim();
	if (!rawName || /^(?:以|在|若|当|每|选择)/.test(rawName)) {
		rawName = String(item?.name ?? "").trim() || (deployType === "Mine" ? "地雷" : deployType === "Drone" ? "无人机" : "可部署物");
	}

	let size = deployType === "Deployable" ? 1 : 0.5;
	if (parenMatch?.[2]) {
		const szStr = parenMatch[2].replace(/\s+/g, "");
		size = (szStr === "1/2" || szStr === "1／2" || szStr === "0.5" || szStr === "½") ? 0.5 : Math.max(1, Math.floor(Number(szStr) || 1));
	} else {
		const inlineSz = plain.match(/(?:大小|尺寸)\s*(1\s*[/／]\s*2|0\.5|½|\d+)/i);
		if (inlineSz) {
			const szStr = inlineSz[1].replace(/\s+/g, "");
			size = (szStr === "1/2" || szStr === "1／2" || szStr === "0.5" || szStr === "½") ? 0.5 : Math.max(1, Math.floor(Number(szStr) || 1));
		}
	}

	const statSrc = parenMatch ? `${parenMatch[2]} ${parenMatch[3]}` : plain;
	const numExpr = "(\\d+(?:\\s*[/／]\\s*\\d+){0,2})";
	const hp = pickTierNum(statSrc, [new RegExp(`(?:HP|生命)\\s*${numExpr}`, "i"), new RegExp(`${numExpr}\\s*HP`, "i")], deployType === "Deployable" ? 10 : 5);
	const evasion = pickTierNum(statSrc, [
		new RegExp(`(?:回避|闪避)(?:与电子防御|[/／]ED)?\\s*${numExpr}`, "i"),
		new RegExp(`${numExpr}\\s*(?:回避|闪避)`, "i"),
	], deployType === "Deployable" ? 8 : 10);
	const edef = pickTierNum(statSrc, [
		new RegExp(`(?:电子防御|ED)\\s*${numExpr}`, "i"),
		new RegExp(`回避(?:与电子防御|[/／]ED)\\s*${numExpr}`, "i"),
		new RegExp(`${numExpr}\\s*(?:回避|闪避)[/／]ED`, "i"),
		new RegExp(`${numExpr}\\s*(?:电子防御|ED)`, "i"),
	], 10);
	const armor = pickTierNum(statSrc, [new RegExp(`(?:装甲|护甲)\\s*${numExpr}`, "i"), new RegExp(`${numExpr}\\s*(?:装甲|护甲)`, "i")], 0);
	const speed = pickTierNum(statSrc, [new RegExp(`速度\\s*${numExpr}`, "i"), new RegExp(`${numExpr}\\s*速度`, "i")], 0);
	const heatcap = pickTierNum(statSrc, [new RegExp(`(?:热度上限|HC)\\s*${numExpr}`, "i"), new RegExp(`${numExpr}\\s*HC`, "i")], 0);
	const save = Number(actor?.system?.save) || 10;

	return { name: rawName, deployType, size, hp: Math.max(1, hp), evasion, edef, armor, speed, heatcap, save, detail: String(text || item?.system?.effect || "") };
}

// 统一解析一张聊天卡（攻击卡或非攻击系统 / 动作 / 天赋 / 特性卡）
function analyzeCard(message, root = null) {
	const attack = message?.getFlag?.("lancer", "attackData") ?? message?.flags?.lancer?.attackData;
	const damage = message?.getFlag?.("lancer", "damageData") ?? message?.flags?.lancer?.damageData;
	if (damage) return null;
	const basicKey = message?.getFlag?.(MODULE_ID, "basicAction") ?? message?.flags?.[MODULE_ID]?.basicAction;
	if (attack) {
		const rawActor = resolveActor(attack.attackerUuid);
		const actor = combatMechOf(rawActor) ?? rawActor;
		const item = attack.attackerItemUuid ? resolveDocSync(attack.attackerItemUuid) : null;
		const dc = Number(actor?.system?.save ?? rawActor?.system?.save) || 10;
		const isTech = isTechAttackMessage(message, attack, item, basicKey);
		if (isTech) {
			const tCls = classifyTechAttackCard(message, attack, item, actor, basicKey, dc);
			const aoeRanges = parseAoERanges(tCls.effectText, item);
			return {
				isAttack: true, isTech: true, attack, actor, actorUuid: preferredTargetUuid(actor) ?? attack.attackerUuid ?? actor?.uuid ?? null, item,
				title: tCls.actionName || item?.name || BASIC_ACTIONS[basicKey]?.name || actor?.name || "科技攻击",
				autoHitStatuses: tCls.autoHitStatuses, autoCritStatuses: tCls.autoCritStatuses,
				manualStatuses: tCls.allStatuses, saves: tCls.saves,
				selfAutoStatuses: [], selfManualStatuses: [],
				nonAttackDamage: tCls.nonAttackDamage, aoeRanges,
				techRiders: tCls.techRiders, weaponRiders: [], osirisGate: tCls.osirisGate ?? null,
			};
		}
		const cls = classifyAttackCard(item, basicKey, dc);
		if (basicKey && BASIC_ACTIONS[basicKey]?.effect) {
			for (const sv of parseSavesInText(BASIC_ACTIONS[basicKey].effect, { dc })) {
				if (!cls.saves.some(x => x.key === sv.key)) cls.saves.push(sv);
			}
		}
		// 潜行者 II「埋伏」：本回合以匿迹开始时的第一次攻击迫使目标机体豁免否则缓慢 + 受损
		if (message?.getFlag?.(MODULE_ID, "infiltratorAmbush") && !cls.saves.some(x => x.key === "hull" && !x.critOnly)) {
			cls.saves.push({ key: "hull", path: "system.hull", label: "机体豁免", dc, failStatuses: ["slow", "impaired"], passStatuses: [], halfOnSuccess: false, critOnly: false });
		}
		// 斗殴者 III「击倒技」：附加机体豁免否则晕眩
		if (message?.getFlag?.(MODULE_ID, "brawlerKnockout") && !cls.saves.some(x => x.key === "hull" && !x.critOnly)) {
			cls.saves.push({ key: "hull", path: "system.hull", label: "机体豁免", dc, failStatuses: ["stunned"], passStatuses: [], halfOnSuccess: false, critOnly: false });
		}
		// NPC 哨兵守望专属被动：「制裁者弹药」（守望命中缓慢）与「穿刺者」（守望迫使机体豁免否则固定+受扰）
		if (message?.getFlag?.(MODULE_ID, "overwatchAttack")) {
			if (hasNpcFeature(actor, ["npcf_cn_sentinel_5", "npcf_punisher_ammunition_sentinel"], ["制裁者弹药"])) {
				if (!cls.autoHitStatuses.includes("slow")) cls.autoHitStatuses.push("slow");
				if (!cls.allStatuses.includes("slow")) cls.allStatuses.push("slow");
			}
			if (hasNpcFeature(actor, ["npcf_cn_sentinel_7", "npcf_impaler_sentinel"], ["穿刺者"]) && !cls.saves.some(x => x.key === "hull" && !x.critOnly)) {
				cls.saves.push({ key: "hull", path: "system.hull", label: "机体豁免", dc, failStatuses: ["immobilized", "jammed"], passStatuses: [], halfOnSuccess: false, critOnly: false });
			}
		}
		const weaponRiders = collectWeaponAttackRiders(message, attack, item, actor, dc);
		return {
			isAttack: true, isTech: false, attack, actor, actorUuid: preferredTargetUuid(actor) ?? attack.attackerUuid ?? actor?.uuid ?? null, item,
			title: item?.name ?? BASIC_ACTIONS[basicKey]?.name ?? actor?.name ?? "攻击",
			autoHitStatuses: cls.autoHitStatuses, autoCritStatuses: cls.autoCritStatuses,
			manualStatuses: cls.allStatuses, saves: cls.saves,
			selfAutoStatuses: [], selfManualStatuses: [], nonAttackDamage: null, aoeRanges: [],
			techRiders: [], weaponRiders,
		};
	}

	// 非攻击卡：从 HTML、flags.lancer.actionData、flags.lancer-cn.cardItemMeta 或 message.content 提取物品 / 角色 UUID 与规则正文
	const rawHtml = String(message?.content ?? "");
	const actionData = message?.getFlag?.("lancer", "actionData") ?? message?.flags?.lancer?.actionData ?? null;
	const cardMeta = message?.getFlag?.(MODULE_ID, "cardItemMeta") ?? message?.flags?.[MODULE_ID]?.cardItemMeta ?? null;
	const uuidFromDom = root?.querySelector?.(".card[data-uuid], [data-uuid]")?.dataset?.uuid;
	const uuidMatch = uuidFromDom || cardMeta?.itemUuid || rawHtml.match(/data-uuid="([^"]+)"/)?.[1] || null;
	const doc = uuidMatch ? resolveDocSync(uuidMatch) : null;
	let item = doc?.documentName === "Item" || (doc && doc.system && !doc.statuses && doc.parent) ? doc : null;
	let rawActor = item?.actor ?? item?.parent ?? (doc && !item ? resolveActor(doc) : null);
	if (!rawActor && cardMeta?.actorUuid) {
		rawActor = resolveActor(cardMeta.actorUuid);
	}
	if (!rawActor && message?.speaker) {
		if (message.speaker.token && globalThis.canvas?.tokens?.get) rawActor = globalThis.canvas.tokens.get(message.speaker.token)?.actor ?? null;
		if (!rawActor && message.speaker.actor && game?.actors?.get) rawActor = game.actors.get(message.speaker.actor) ?? null;
	}
	if (!rawActor && actionData?.actor) {
		rawActor = game?.actors?.get?.(actionData.actor) ?? resolveActor(actionData.actor);
	}
	if (!item && rawActor && actionData?.system) {
		item = rawActor.items?.get?.(actionData.system) ?? (rawActor.items ?? []).find?.(i => i.id === actionData.system) ?? null;
	}
	if (!item && rawActor && cardMeta?.itemUuid) {
		item = (rawActor.items ?? []).find?.(i => i.uuid === cardMeta.itemUuid || i.id === cardMeta.itemUuid) ?? null;
	}
	// 天赋卡的 rawActor 为驾驶员（pilot），机甲战斗动作（豁免 DC、护盾、清热、自身抗性等）统一解析到当前激活机甲
	const actor = (item?.type === "talent" || item?.is_talent?.() || (rawActor?.type === "pilot" && findActiveMechForPilot(rawActor)))
		? (combatMechOf(rawActor) ?? rawActor)
		: rawActor;

	const actionLid = String(actionData?.action?.lid ?? "");
	const actionName = String(actionData?.action?.name ?? "");
	const isCoreActivation = Boolean(
		actionData?.action?.core_active === true
		|| actionLid.endsWith("_core_system")
		|| (item?.type === "frame" && /^CORE ACTIVATION/i.test(actionName)),
	);
	const frameLid = item?.type === "frame" ? String(item.system?.lid ?? "") : mechFrameLid(actor);
	// 非 LANCER 卡片（普通闲聊或没有规则正文的卡）不处理
	const isLancerCard = Boolean(item || actionData || cardMeta || /class="[^"]*\b(lancer-header|lancer-mini-header|effect-text)\b/.test(rawHtml));
	if (!isLancerCard) return null;
	// 跳过纯检定卡、对抗卡、骑乘卡、迷宫卡、受身卡、守望提示卡、准备动作卡及声明说明卡等无需自动扫描的卡片
	if (message?.getFlag?.(MODULE_ID, "saveResultCard")
		|| message?.getFlag?.(MODULE_ID, "turnEndClear")
		|| message?.getFlag?.(MODULE_ID, "npcRechargePrompt")
		|| message?.getFlag?.(MODULE_ID, "ultraJuggernautPrompt")
		|| message?.getFlag?.(MODULE_ID, "contest")
		|| message?.getFlag?.(MODULE_ID, "jockeyState")
		|| message?.getFlag?.(MODULE_ID, "mazeState")
		|| message?.getFlag?.(MODULE_ID, "braceCard")
		|| message?.getFlag?.(MODULE_ID, "overwatchPrompt")
		|| message?.getFlag?.(MODULE_ID, "prepareCard")
		|| message?.getFlag?.(MODULE_ID, "skipAutoScan")) return null;

	const textParts = [];
	if (rawHtml) {
		for (const blk of extractBalancedClassBlocks(rawHtml, /\b(?:effect-text|desc-text|lancer-body)\b/i)) {
			if (blk.trim()) textParts.push(blk);
		}
		if (!textParts.length && /effect-text/.test(rawHtml)) textParts.push(rawHtml);
	}
	if (!textParts.length && cardMeta?.effect) textParts.push(cardMeta.effect);
	if (!textParts.length && actionData?.action?.detail) textParts.push(actionData.action.detail);
	if (!textParts.length && item?.system) {
		if (item.system.effect) textParts.push(item.system.effect);
		for (const a of item.system.actions ?? []) if (a.detail) textParts.push(a.detail);
	}
	const combinedText = textParts.join("。");
	if (!combinedText.trim() && !item) return null;

	const headerTitle = rawHtml.match(/class="[^"]*lancer-header[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/\/\//g, "").trim();
	const effectiveTitle = headerTitle || cardMeta?.title || actionName || item?.name || actor?.name || "效果";
	const dc = Number(actor?.system?.save ?? rawActor?.system?.save) || 10;
	const saves = parseSavesInText(combinedText, { dc });
	const selfSt = selfStatusesIn(combinedText);
	const cpProf = isCoreActivation && frameLid ? CP_PROFILES[frameLid] : null;
	const selfAutoStatuses = cpProf?.selfStatuses ? [...cpProf.selfStatuses] : (cpProf?.suppressGenericSelfAuto ? [] : selfSt.auto);
	const targetDebuffs = statusesIn(combinedText, { strict: true });
	let nonAttackDamage = parseNonAttackDamage(combinedText, actor, item);
	// 异种模板「现世挤出物」（npcf_cn_exotic_6）：造成的所有伤害减半
	if (nonAttackDamage && hasNpcFeature(actor, ["npcf_cn_exotic_6", "npcf_extrusion_exotic"], ["现世挤出物"])) {
		nonAttackDamage = { ...nonAttackDamage, halfAllTargets: true };
	}
	// 偶像破坏者 I「模因火花」：1 + NHP 数量（超然状态额外 +4）点穿甲能量伤害
	if (/模因火花/.test(effectiveTitle) || (String(item?.system?.lid ?? "").includes("unstable_nhp") && /模因火花/.test(combinedText))) {
		const nhpDmg = 1 + countMechNHPs(actor) + (getCombatState(actor).transcendActive ? 4 : 0);
		nonAttackDamage = { damage: [{ type: "Energy", val: String(nhpDmg) }], ap: true };
	}
	// 勘探者 II「淘金热」：创建进口时区域内敌对角色必须通过机体豁免，否则伏卧
	if ((/创造进口|Create Entrance/i.test(effectiveTitle) || actionLid === "act_create_entrance") && talentRank(actor, "t_prospector") >= 2) {
		if (!saves.some(s => s.key === "hull")) {
			saves.push({ key: "hull", path: "system.hull", label: "机体豁免", dc, failStatuses: ["prone"], passStatuses: [], halfOnSuccess: false, critOnly: false });
		}
		if (!targetDebuffs.includes("prone")) targetDebuffs.push("prone");
	}
	const aoeRanges = parseAoERanges(combinedText, item);
	const persistentAoE = isPersistentAoEText(combinedText);
	const npcDeployable = parseNpcDeployableSpec(item, combinedText, actor);
	return {
		isAttack: false, isCoreActivation, frameLid, actionData, attack: null, actor, rawActor,
		actorUuid: preferredTargetUuid(actor) ?? actor?.uuid ?? null, item,
		title: effectiveTitle,
		autoHitStatuses: [], autoCritStatuses: [],
		manualStatuses: targetDebuffs, saves,
		selfAutoStatuses, selfManualStatuses: selfSt.manual,
		nonAttackDamage, aoeRanges, persistentAoE, npcDeployable,
	};
}

// ---------------------------------------------------------------------------
// 伤害结算预览（与系统 LancerActor.damageCalc 完全一致，并补完机甲骨架被动抗性/减伤、拿破仑护盾、老兵冲击装甲/钢爪、超体围攻盾与异种现世挤出物）
function previewDamageCalc(actor, entries, { multiple = 1, ap = false, paracausal = false, addBurn = true, dmgCtx = null } = {}) {
	if (!actor?.system) return null;
	const dmg = { Kinetic: 0, Energy: 0, Explosive: 0, Burn: 0, Heat: 0, Variable: 0 };
	if (Array.isArray(entries)) {
		for (const e of entries) {
			const t = e?.type;
			const v = Number(e?.amount ?? e?.val) || 0;
			if (t in dmg) dmg[t] += v;
		}
	} else if (entries && typeof entries === "object") {
		for (const k of Object.keys(dmg)) dmg[k] += Number(entries[k]) || 0;
	}
	const armoredTypes = ["Kinetic", "Energy", "Explosive", "Variable"];
	const apTypes = ["Burn", "Heat"];
	const hasHeatcap = typeof actor.hasHeatcap === "function"
		? actor.hasHeatcap()
		: ((actor.type === "mech" || actor.type === "npc" || actor.type === "deployable") && Number(actor.system?.heat?.max) > 0);
	const notes = [];
	let customReductionApplied = false;
	const fLid = mechFrameLid(actor);
	const cs = getCombatState(actor);
	const attActor = dmgCtx?.attackerUuid ? resolveActor(dmgCtx.attackerUuid) : null;
	const attMech = combatMechOf(attActor) ?? attActor;
	const attTok = attActor ? attackerToken(attActor) : null;
	const defTok = attackerToken(actor);
	const dist = (attTok && defTok)
		? tokenDistance(attTok, defTok)
		: (Number.isFinite(Number(dmgCtx?.distance)) ? Number(dmgCtx.distance) : null);

	// 0. 隔热（兰开斯特 / 成吉思 / 行星杀手 / 火蜥蜴 / 老兵隔热）：对燃烧完全免疫（不扣 HP 亦不叠加燃烧标记）
	if (dmg.Burn > 0 && isBurnImmune(actor)) {
		dmg.Burn = 0;
		customReductionApplied = true;
		notes.push("隔热免疫燃烧");
	}

	if (!hasHeatcap && dmg.Heat > 0) {
		dmg.Energy += dmg.Heat;
		dmg.Heat = 0;
		notes.push("无热度上限→能量");
	}
	if (![0.5, 1, 2].includes(multiple)) multiple = 1;
	// 拿破仑「重型护盾」（豁免减半改为减至 1）与「闪烁神盾」（受身改为把伤害减至 1 而非获得抗性）
	const napoleonHalfCap = fLid === "mf_napoleon" && multiple === 0.5;
	const napoleonBraceCap = fLid === "mf_napoleon" && Boolean(cs.bracedActive);
	const resistAll = multiple === 0.5 && !napoleonHalfCap;
	if (multiple === 2) {
		for (const k of Object.keys(dmg)) dmg[k] *= 2;
		notes.push("倍率 2×");
	} else if (resistAll) {
		notes.push("全抗性 0.5×");
	} else if (napoleonHalfCap) {
		customReductionApplied = true;
	}
	const exposed = Boolean(actor.system?.statuses?.exposed || actor.statuses?.has?.("exposed"));
	if (exposed && armoredTypes.some(t => dmg[t] > 0)) {
		for (const t of armoredTypes) dmg[t] = Math.ceil(dmg[t] * 2);
		notes.push("暴露 ×2");
	}
	const slowShroudActive = hasCoreBonus(actor, "cb_piof_slow_cycle_shroud") && (Number(actor.system?.overshield?.value) || 0) > 0;
	if (slowShroudActive && ap) {
		ap = false;
		customReductionApplied = true;
		notes.push("低速屏蔽罩防穿甲");
	}
	const rawShredded = Boolean(actor.system?.statuses?.shredded || actor.statuses?.has?.("shredded"));
	if (slowShroudActive && rawShredded) {
		customReductionApplied = true;
		notes.push("低速屏蔽罩忽略离散");
	}
	let shredded = !slowShroudActive && rawShredded;
	if (cs.kutuzovBraceProtected && shredded) {
		shredded = false;
		customReductionApplied = true;
		notes.push("应急姿场忽略离散");
	}
	const nemoProneShred = !slowShroudActive
		&& !cs.kutuzovBraceProtected
		&& Boolean(dmgCtx?.treatProneAsShredded || (mechFrameLid(attMech) === "mf_ext_nemo" && actor.statuses?.has?.("prone")));
	if (nemoProneShred && !shredded) {
		shredded = true;
		customReductionApplied = true;
		notes.push("憎恨大天使·伏卧视同离散");
	}

	const ignoreBurnHeatRes = Boolean(dmgCtx?.ignoreBurnHeatResist || mechFrameLid(attMech) === "mf_genghis_alt_worldkiller_genghis_mk_i");
	const briareosResist = hasCoreBonus(actor, "cb_briareos_frame") && Number(actor.system?.structure?.value) === 1;
	const autoExtinguish = hasCoreBonus(actor, "cb_ch_extinguisher");

	const intrinsicResistLabel = t => {
		if ((t === "Burn" || t === "Heat") && ignoreBurnHeatRes) return null;
		if (briareosResist && t !== "Heat") return "百臂巨人";
		if (autoExtinguish && t === "Burn") return "自动灭火器";
		if (fLid === "mf_black_witch" && t === "Kinetic") return "偏转力场";
		if ((fLid === "mf_manticore" || fLid === "mf_lycan") && (t === "Energy" || t === "Burn")) return "熔渣外壳";
		if ((fLid === "mf_barbarossa" || fLid === "mf_micro_monarch") && t === "Explosive") return "爆破镀层";
		if (fLid === "mf_ext_tametomo" && t === "Burn") return "等离子光轮";
		if (fLid === "mf_white_witch" && actor.statuses?.has?.("immobilized") && t === "Kinetic") return "深植";
		if (fLid === "mf_ext_grant" && !actor.statuses?.has?.("dangerzone") && t === "Heat") return "循环停滞";
		if (fLid === "mf_ext_grant" && actor.statuses?.has?.("dangerzone") && t === "Burn") return "正午时分";
		if (fLid === "mf_drake" && dmgCtx?.isAoe) return "爆发镀层";
		if (fLid === "mf_Empakaai_alt_blackbeard" && dmgCtx?.attackerUuid) {
			const gp = findActiveGrappleFor(actor);
			if (gp && (sameActorRef(gp.gs.attackerUuid, dmgCtx.attackerUuid) || sameActorRef(gp.gs.defenderUuid, dmgCtx.attackerUuid))) return "不屈之力";
		}
		if ((actor.type === "deployable" || actor.is_deployable?.()) && t !== "Heat" && defTok) {
			const myDisp = defTok.document?.disposition ?? 1;
			const hasShepherd = (globalThis.canvas?.tokens?.placeables ?? []).some(tok =>
				tok !== defTok
				&& tok.actor
				&& (tok.document?.disposition ?? 1) === myDisp
				&& (mechFrameLid(tok.actor) === "mf_hydra" || mechFrameLid(tok.actor) === "mf_ext_bligh")
				&& (tokenDistance(defTok, tok) ?? 99) <= 1,
			);
			if (hasShepherd) return "牧羊人领域";
		}
		if (actor.type === "npc" || actor.is_npc?.()) {
			if (t !== "Heat" && hasNpcFeature(actor, ["npcf_cn_exotic_6", "npcf_extrusion_exotic"], ["现世挤出物"])) return "现世挤出物";
			if (t !== "Heat" && dmgCtx?.weaponSize === "Main" && hasNpcFeature(actor, ["npcf_cn_veteran_19", "npcf_impact_armor_veteran"], ["冲击装甲"])) return "冲击装甲";
			if (t !== "Heat" && dist !== null && dist > 3 && hasNpcFeature(actor, ["npcf_cn_ultra_13", "npcf_siege_shield_ultra"], ["围攻盾"])) return "围攻盾";
		}
		return null;
	};

	const hasExplicitResist = t => {
		if (napoleonBraceCap) return false;
		if ((t === "Burn" || t === "Heat") && ignoreBurnHeatRes) return false;
		return Boolean(actor.system?.resistances?.[t.toLowerCase()] || actor.statuses?.has?.(`resistance_${t.toLowerCase()}`));
	};
	const hasResist = t => resistAll || Boolean(intrinsicResistLabel(t)) || hasExplicitResist(t);

	if (!paracausal && !shredded) {
		if (ignoreBurnHeatRes && (actor.system?.resistances?.burn || actor.statuses?.has?.("resistance_burn") || actor.system?.resistances?.heat || actor.statuses?.has?.("resistance_heat")) && (dmg.Burn > 0 || dmg.Heat > 0)) {
			customReductionApplied = true;
			notes.push("TBK无视燃烧/热度抗性");
		}
		if (napoleonBraceCap) customReductionApplied = true;
		const resistArmor = armoredTypes.filter(hasResist);
		const normalArmor = armoredTypes.filter(t => !resistArmor.includes(t));
		const resistAp = apTypes.filter(hasResist);
		const baseArmor = Number(actor.system?.armor) || 0;
		const tizonaDouble = fLid === "mf_kkca_tizona" && !ap && baseArmor > 0 && dist !== null && dist <= 3;
		const rawArmor = tizonaDouble ? baseArmor * 2 : baseArmor;
		let armor = ap ? 0 : rawArmor;
		const beforeArmor = armoredTypes.reduce((s, t) => s + dmg[t], 0);
		if (tizonaDouble && beforeArmor > 0) {
			customReductionApplied = true;
			notes.push(`鳞甲双倍护甲 ${rawArmor}`);
		}
		if (ap && baseArmor > 0 && beforeArmor > 0) notes.push(`穿甲无视护甲 ${baseArmor}`);
		let armorUsed = 0;
		for (const t of normalArmor) {
			const used = Math.min(armor, dmg[t]);
			dmg[t] = Math.max(dmg[t] - armor, 0);
			armor -= used;
			armorUsed += used;
		}
		for (const t of resistArmor) {
			const used = Math.min(armor, dmg[t]);
			const afterA = Math.max(dmg[t] - armor, 0);
			armor -= used;
			armorUsed += used;
			const intr = intrinsicResistLabel(t);
			const explicitRes = hasExplicitResist(t);
			if (afterA > 0 && intr && !explicitRes) customReductionApplied = true;
			if (afterA > 0 && !resistAll) {
				const baseLbl = ALL_STATUS_LABELS[`resistance_${t.toLowerCase()}`] ?? t;
				notes.push(intr && !explicitRes ? `${intr}·${baseLbl}` : baseLbl);
			}
			dmg[t] = Math.ceil(afterA / 2);
		}
		for (const t of resistAp) {
			const intr = intrinsicResistLabel(t);
			const explicitRes = hasExplicitResist(t);
			if (dmg[t] > 0 && intr && !explicitRes) customReductionApplied = true;
			if (dmg[t] > 0 && !resistAll) {
				const baseLbl = ALL_STATUS_LABELS[`resistance_${t.toLowerCase()}`] ?? t;
				notes.push(intr && !explicitRes ? `${intr}·${baseLbl}` : baseLbl);
			}
			dmg[t] = Math.ceil(dmg[t] / 2);
		}
		if (armorUsed > 0) notes.push(`护甲 -${armorUsed}`);
	} else if (shredded && (Number(actor.system?.armor) || 0) > 0 && !nemoProneShred) {
		notes.push("离散无视护甲与抗性");
	} else if (paracausal) {
		notes.push("不可减免");
	}

	// 哈布斯堡「艾森盾」：自身及邻接友军将来自敌方来源的伤害减少 1（不减热度与自身燃烧检定）
	if (!paracausal && !dmgCtx?.isBurnTick && !(dmgCtx?.attackerUuid && sameActorRef(dmgCtx.attackerUuid, actor))) {
		let hasEisenShield = fLid === "mf_ext_habsburg";
		if (!hasEisenShield && defTok) {
			const myDisp = defTok.document?.disposition ?? 1;
			hasEisenShield = (globalThis.canvas?.tokens?.placeables ?? []).some(tok =>
				tok !== defTok
				&& tok.actor
				&& (tok.document?.disposition ?? 1) === myDisp
				&& mechFrameLid(tok.actor) === "mf_ext_habsburg"
				&& (tokenDistance(defTok, tok) ?? 99) <= 1,
			);
		}
		if (hasEisenShield) {
			const posType = [...armoredTypes, "Burn"].find(t => dmg[t] > 0);
			if (posType) {
				dmg[posType] = Math.max(0, dmg[posType] - 1);
				customReductionApplied = true;
				notes.push("艾森盾 -1");
			}
		}
	}

	// 伤害压至 1 类规则（拿破仑「真黑神盾 / 重型护盾 / 闪烁神盾」、老兵「钢爪」副武器上限 1 伤）
	let trueblackApplied = false;
	const steelJawActive = Boolean(dmgCtx?.weaponSize === "Auxiliary" && hasNpcFeature(actor, ["npcf_cn_veteran_21", "npcf_steel_jaw_veteran"], ["钢爪"]));
	const capOneReason = hasTrueblack(actor)
		? "真黑神盾减至 1"
		: napoleonBraceCap
			? "闪烁神盾减至 1"
			: napoleonHalfCap
				? "重型护盾减至 1"
				: steelJawActive
					? "钢爪减至 1"
					: "";
	if (!paracausal && capOneReason) {
		const preTbArmor = Math.ceil(dmg.Kinetic + dmg.Energy + dmg.Explosive + dmg.Variable);
		if (preTbArmor + dmg.Burn > 1) {
			if (preTbArmor >= 1) {
				const firstPos = armoredTypes.find(t => dmg[t] > 0) ?? "Kinetic";
				for (const t of armoredTypes) dmg[t] = t === firstPos ? 1 : 0;
				dmg.Burn = 0;
			} else {
				dmg.Burn = 1;
			}
			trueblackApplied = true;
			customReductionApplied = true;
			notes.push(capOneReason);
		}
	}

	// 为朝「等离子光轮」：燃烧无法使为朝降低到 1 HP 以下（即使回合末燃烧检定 paracausal 亦生效；保留应叠加的燃烧标记数）
	const burnTokensToAdd = dmg.Burn && addBurn ? dmg.Burn : 0;
	if (fLid === "mf_ext_tametomo" && dmg.Burn > 0) {
		const curHp = Number(actor.system?.hp?.value) || 0;
		const curOs = Number(actor.system?.overshield?.value) || 0;
		const preArmorDmg = Math.ceil(dmg.Kinetic + dmg.Energy + dmg.Explosive + dmg.Variable);
		if (curHp >= 1 && preArmorDmg < curOs + curHp) {
			const maxBurnHpDmg = Math.max(0, curOs + curHp - preArmorDmg - 1);
			if (dmg.Burn > maxBurnHpDmg) {
				dmg.Burn = maxBurnHpDmg;
				customReductionApplied = true;
				notes.push("等离子光轮保底 1 HP");
			}
		}
	}

	const armorDamage = Math.ceil(dmg.Kinetic + dmg.Energy + dmg.Explosive + dmg.Variable);
	let totalHpDmg = armorDamage + dmg.Burn;
	const overshield = Number(actor.system?.overshield?.value) || 0;
	let overshieldUsed = 0;
	if (overshield > 0 && totalHpDmg > 0) {
		overshieldUsed = Math.min(overshield, totalHpDmg);
		totalHpDmg = Math.max(totalHpDmg - overshield, 0);
		notes.push(`护盾 -${overshieldUsed}`);
	}
	const heatGain = hasHeatcap ? dmg.Heat : 0;
	const burnGain = burnTokensToAdd;
	const parts = [];
	if (overshieldUsed > 0 && totalHpDmg === 0) parts.push(`-${overshieldUsed} 护盾（0 HP）`);
	else if (totalHpDmg > 0) parts.push(`-${totalHpDmg} HP`);
	if (heatGain > 0) parts.push(`+${heatGain} 热度`);
	if (burnGain > 0) parts.push(`+${burnGain} 燃烧`);
	if (!parts.length) parts.push("0 伤害");
	return {
		hpLoss: totalHpDmg, overshieldUsed, heatGain, burnGain, finalTypes: dmg,
		trueblackApplied, customReductionApplied, notes,
		summary: `结算预览：${parts.join("，")}${notes.length ? `（${notes.join(" · ")}）` : ""}`,
	};
}

async function checkAndTriggerVeteranFeignDeath(actor) {
	if (!actor?.isOwner) return false;
	if (!hasNpcFeature(actor, ["npcf_cn_veteran_6", "npcf_feign_death_veteran"], ["假死"])) return false;
	if (getCombatState(actor).usedFeignDeath) return false;
	const curHp = Number(actor.system?.hp?.value) ?? 1;
	const maxSt = Number(actor.system?.structure?.max) ?? 1;
	const curSt = Number(actor.system?.structure?.value) ?? 1;
	if (!((maxSt <= 1 && curHp <= 0) || (maxSt > 1 && curSt <= 0))) return false;
	await setCombatState(actor, { usedFeignDeath: true });
	const patch = { "system.hp.value": 1 };
	if (maxSt > 0 && curSt <= 0) patch["system.structure.value"] = 1;
	await actor.update?.(patch);
	if (actor.statuses?.has?.("downandout")) {
		await actor.toggleStatusEffect?.("downandout", { active: false });
	}
	await postCpEffectCard(
		actor,
		"老兵 · 假死触发",
		`<p><b>${escHtml(actor.token?.name ?? actor.name)}</b> 触发老兵模板特征<b>假死</b>（1/场景）：看似已被摧毁，实则保留 <b>1 HP</b> 潜伏在场！（邻接角色可通过系统检定或驾驶员技能检定识破）</p>`,
	);
	return true;
}

function patchTrueblackDamageCalc() {
	const proto = globalThis.CONFIG?.Actor?.documentClass?.prototype;
	if (!proto?.damageCalc || proto.damageCalc.lancerCn) return;
	const orig = proto.damageCalc;
	proto.damageCalc = async function (damage, opts = {}) {
		const actorKey = this?.uuid || this?.id || "";
		let mappedCtx = null;
		if (actorKey && pendingApplyDamageCtxMap.has(actorKey)) {
			mappedCtx = pendingApplyDamageCtxMap.get(actorKey);
			pendingApplyDamageCtxMap.delete(actorKey);
		} else if (this?.id && pendingApplyDamageCtxMap.has(this.id)) {
			mappedCtx = pendingApplyDamageCtxMap.get(this.id);
			pendingApplyDamageCtxMap.delete(this.id);
		}
		const effDmgCtx = opts?.dmgCtx ?? mappedCtx ?? pendingApplyDamageCtx ?? null;
		pendingApplyDamageCtx = null;
		const incomingEnergy = Number(damage?.Energy) || 0;
		const incomingHeat = Number(damage?.Heat) || 0;
		const hadPureEnergy = Boolean(damage && incomingEnergy > 0 && !(incomingHeat > 0) && isCoreActiveOn(this, "mf_manticore"));
		const prevMsgIds = new Set(Array.from(globalThis.game?.messages?.contents ?? globalThis.game?.messages ?? []).map(m => m?.id).filter(Boolean));
		let res;
		let handled = false;
		let extraBurnMarkers = 0;
		let appliedBurnForUndo = 0;
		if (damage && typeof damage === "object") {
			const entries = Object.entries(damage).map(([type, amount]) => ({ type, amount }));
			const p = previewDamageCalc(this, entries, { ...opts, dmgCtx: effDmgCtx });
			if (p?.customReductionApplied || p?.trueblackApplied) {
				const appliedBurn = Number(p.finalTypes?.Burn) || 0;
				appliedBurnForUndo = appliedBurn;
				if (opts?.addBurn !== false && p.burnGain > appliedBurn) {
					extraBurnMarkers = p.burnGain - appliedBurn;
				}
				Object.assign(damage, p.finalTypes);
				const sysStatuses = this.system?.statuses;
				const prevExposed = sysStatuses?.exposed;
				if (sysStatuses) sysStatuses.exposed = false;
				try {
					res = await orig.call(this, damage, { ...opts, multiple: 1, ap: true, paracausal: true });
					handled = true;
				} finally {
					if (sysStatuses) sysStatuses.exposed = prevExposed;
				}
			}
		}
		if (!handled) res = await orig.call(this, damage, opts);

		if (this.isOwner) {
			if (extraBurnMarkers > 0) {
				await this.update?.({ "system.burn": (Number(this.system?.burn) || 0) + extraBurnMarkers });
				const totalBurnDelta = appliedBurnForUndo + extraBurnMarkers;
				const allMsgs = Array.from(globalThis.game?.messages?.contents ?? globalThis.game?.messages ?? []);
				const undoMsg = [...allMsgs].reverse().find(m => m?.id && !prevMsgIds.has(m.id) && String(m.content ?? "").includes("lancer-damage-undo") && String(m.content ?? "").includes(this.uuid));
				if (undoMsg?.update) {
					const patchedHtml = String(undoMsg.content)
						.replace(/data-burn-delta="\d+"/i, `data-burn-delta="${totalBurnDelta}"`)
						.replace(/data-add-burn="false"/i, 'data-add-burn="true"');
					if (patchedHtml !== undoMsg.content) await undoMsg.update({ content: patchedHtml });
				}
			}
			if (hadPureEnergy) {
				const cs = getCoreState(this);
				const nextDie = Math.min(6, (Number(cs.counterValue) || 1) + 1);
				await setCoreState(this, { counterValue: nextDie });
			}
			if (mechFrameLid(this) === "mf_ext_tametomo" && (Number(this.system?.burn) || 0) > 0 && getSetting("autoApplyStatus", true)) {
				await setActorStatus(preferredTargetUuid(this) ?? this.uuid, "cover_soft", true);
			}
			if (incomingEnergy > 0 && hasNpcFeature(this, ["npcf_cn_exotic_10", "npcf_regenerator_exotic"], ["再生器"])) {
				await setCombatState(this, { tookEnergyThisTurn: true });
			}
			// 巨人杀手 III「终斩」：骑乘伤害实际扣血后，若目标剩余 HP 降至 1–3 则直接归零触发结构/摧毁
			if (effDmgCtx?.jockeyGiantSlayerFinisher) {
				const remHp = Number(this.system?.hp?.value) || 0;
				if (remHp > 0 && remHp <= 3) {
					await this.update?.({ "system.hp.value": 0 });
					await postCpEffectCard(
						this,
						"⚔ 巨人杀手 · 终斩触发",
						`<p>受骑乘伤害结算后 <b>${escHtml(this.token?.name ?? this.name)}</b> 剩余 <b>${remHp} HP</b>（≤3），触发<b>巨人杀手 III · 终斩</b>：剩余 HP 直接归零！</p>`,
					);
				}
			}
			const isExternalHeat = incomingHeat > 0 && !(effDmgCtx?.attackerUuid && sameActorRef(effDmgCtx.attackerUuid, this));
			if (isExternalHeat && hasGruntWeak(this)) {
				await triggerGruntWeakDestruction(this, Number(damage?.Heat) || incomingHeat);
			} else {
				await checkAndTriggerVeteranFeignDeath(this);
			}
		}
		return res;
	};
	proto.damageCalc.lancerCn = true;
}

function extractUntargetedDamageEntries(damageData) {
	if (!damageData || typeof damageData !== "object") return [];
	const rawList = (Array.isArray(damageData.critDamageResults) && damageData.critDamageResults.length)
		? damageData.critDamageResults
		: (Array.isArray(damageData.damageResults) ? damageData.damageResults : []);
	const entries = [];
	for (const dr of rawList) {
		const type = dr?.d_type ?? dr?.type ?? "Kinetic";
		const rawAmount = Number(dr?.roll?.total ?? dr?.total ?? dr?.amount) || 0;
		if (rawAmount <= 0) continue;
		entries.push({ type, rawAmount, bonus: Boolean(dr?.bonus) });
	}
	return entries;
}

function resolveUntargetedDamageTargets(message) {
	const locked = Array.from(globalThis.game?.user?.targets ?? []).filter(t => t && (t.actor || t.document?.actor));
	if (locked.length > 0) return { tokens: locked, mode: "targeted", selfOnlyControlled: false };
	const controlled = Array.from(globalThis.canvas?.tokens?.controlled ?? []).filter(t => t && (t.actor || t.document?.actor));
	if (!controlled.length) return { tokens: [], mode: "none", selfOnlyControlled: false };
	const spkTokId = typeof message?.speaker?.token === "string" ? message.speaker.token : (message?.speaker?.token?.id ?? null);
	const spkActorId = typeof message?.speaker?.actor === "string" ? message.speaker.actor : (message?.speaker?.actor?.id ?? null);
	const isSpeakerTok = t => {
		if (spkTokId) return (t.id ?? t.document?.id) === spkTokId;
		if (spkActorId) return (t.actor?.id ?? t.document?.actorId) === spkActorId;
		return false;
	};
	const nonSelf = controlled.filter(t => !isSpeakerTok(t));
	if (nonSelf.length > 0) return { tokens: nonSelf, mode: "controlled", selfOnlyControlled: false };
	return { tokens: [], mode: "none", selfOnlyControlled: true };
}

async function applyUntargetedDamageFromCard(message, damageData = null, { multiple = 1, addBurn = true } = {}) {
	const dd = damageData ?? message?.getFlag?.("lancer", "damageData") ?? message?.flags?.lancer?.damageData;
	const rawEntries = extractUntargetedDamageEntries(dd);
	if (!rawEntries.length) return { ok: false, reason: "no_damage" };
	const { tokens, selfOnlyControlled } = resolveUntargetedDamageTargets(message);
	if (!tokens.length) {
		if (selfOnlyControlled) {
			ui?.notifications?.warn?.("当前选中的是发起该伤害的角色自身！请先按 T 锁定受击目标，或在地图上左键选中受击目标的指示物（若确需对自身结算伤害，请按 T 锁定自身）。");
			return { ok: false, reason: "self_only" };
		}
		ui?.notifications?.warn?.("请先按 T 锁定受击目标，或在地图上左键选中受击目标的指示物后再点击应用伤害。");
		return { ok: false, reason: "no_target" };
	}
	const mult = [0.5, 1, 2].includes(Number(multiple)) ? Number(multiple) : 1;
	const multiTarget = tokens.length > 1;
	const ap = Boolean(dd?.ap);
	const paracausal = Boolean(dd?.paracausal);
	const dmgCtx = message?.getFlag?.(MODULE_ID, "damageCtx") ?? message?.flags?.[MODULE_ID]?.damageCtx ?? null;
	const zeroRefs = Array.isArray(dmgCtx?.zeroUuids) ? dmgCtx.zeroUuids : [];
	const halfRefs = Array.isArray(dmgCtx?.halfUuids) ? dmgCtx.halfUuids : [];
	let appliedCount = 0;
	for (const tok of tokens) {
		const targetUuid = tok.document?.uuid ?? tok.uuid ?? tok.actor?.uuid;
		const actor = tok.actor ?? tok.document?.actor ?? resolveActor(targetUuid);
		if (!actor) continue;
		const isZero = zeroRefs.some(u => sameActorRef(u, targetUuid ?? actor));
		if (isZero) {
			globalThis.ui?.notifications?.info?.(`「${tok.name ?? actor.name}」豁免成功（无用之人），免受本次伤害。`);
			appliedCount++;
			continue;
		}
		const isHalf = Boolean(dd?.half_damage || halfRefs.some(u => sameActorRef(u, targetUuid ?? actor)));
		const perTargetEntries = rawEntries.map(e => {
			let amount = (multiTarget && e.bonus) ? Math.ceil(e.rawAmount / 2) : e.rawAmount;
			if (isHalf) amount = Math.ceil(amount / 2);
			return { type: e.type, amount };
		});
		const applied = sumAppliedDamage(perTargetEntries);
		if (actor.isOwner && typeof actor.damageCalc === "function") {
			await actor.damageCalc(applied, { multiple: mult, addBurn: addBurn !== false, ap, paracausal, dmgCtx });
			appliedCount++;
		} else if (getSetting("crossPermDamage", true) && game.users?.activeGM) {
			game.socket?.emit(`module.${MODULE_ID}`, {
				action: "applyDamage",
				targetUuid,
				applied,
				multiple: mult,
				addBurn: addBurn !== false,
				ap,
				paracausal,
				dmgCtx,
			});
			ui?.notifications?.info?.(`已请求 GM 对「${tok.name ?? actor.token?.name ?? actor.name}」结算伤害。`);
			appliedCount++;
		} else {
			ui?.notifications?.warn?.(`没有权限对「${tok.name ?? actor.name}」结算伤害（且当前无在线 GM）。`);
		}
	}
	return { ok: appliedCount > 0, appliedCount };
}

function decorateDamageCard(message, root, damageData) {
	if (!root?.querySelectorAll) return;
	const dmgCtx = message?.getFlag?.(MODULE_ID, "damageCtx") ?? message?.flags?.[MODULE_ID]?.damageCtx ?? null;
	if (damageData?.targetDamageResults?.length) {
		for (const card of root.querySelectorAll(".lancer-damage-target")) {
			if (card.querySelector(".lancer-cn-dmg-preview")) continue;
			const group = card.querySelector(".lancer-damage-button-group");
			const targetUuid = group?.dataset?.target ?? card.dataset?.uuid;
			const actor = resolveActor(targetUuid);
			const tdr = damageData.targetDamageResults.find(t => t.target === targetUuid);
			if (!actor || !tdr) continue;
			const addBurn = group?.dataset?.addBurn !== "false";
			const sel = group?.querySelector?.("select");
			const doc = root.ownerDocument ?? globalThis.document;
			const div = doc.createElement("div");
			div.className = "lancer-cn-dmg-preview";
			div.style.cssText = "grid-column:1 / -1;display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:11px;color:#555;padding:1px 4px 2px;line-height:1.35";
			const span = doc.createElement("span");
			const update = () => {
				const mult = sel ? (parseFloat(sel.value) || 1) : 1;
				const p = previewDamageCalc(actor, tdr.damage, { multiple: mult, ap: Boolean(tdr.ap ?? damageData.ap), paracausal: Boolean(tdr.paracausal ?? damageData.paracausal), addBurn, dmgCtx });
				span.textContent = p ? p.summary : "";
			};
			update();
			div.append(span);
			if ((actor.type === "mech" || actor.is_mech?.()) && (globalThis.game?.user?.isGM || actor.isOwner)) {
				const braceBtn = doc.createElement("button");
				braceBtn.type = "button";
				braceBtn.className = "lancer-cn-dmg-brace";
				braceBtn.style.cssText = "flex:0 0 auto;width:auto;min-height:0;height:20px;line-height:18px;padding:0 6px;margin:0;font-size:11px";
				const syncBraceBtn = () => {
					const bracedNow = Boolean(actor.getFlag?.(MODULE_ID, "braced") || getCombatState(actor).bracedActive);
					if (bracedNow) {
						braceBtn.textContent = "✓ 已受身";
						braceBtn.disabled = true;
						braceBtn.title = "已对本次伤害开启受身抗性";
						return;
					}
					const chk = checkReactionAvailability(actor, { kind: "brace", label: "受身", roundFlag: "usedBraceRound" });
					braceBtn.textContent = "🛡 受身";
					braceBtn.disabled = false;
					braceBtn.title = chk.ok
						? "消耗反应（1/轮）对本次伤害开启全部五种伤害抗性，下回合仅限 1 个快速动作"
						: `受限：${chk.reasonText}${globalThis.game?.user?.isGM ? "（主持人点击可越权执行）" : ""}`;
				};
				syncBraceBtn();
				braceBtn.addEventListener?.("click", async ev => {
					ev.preventDefault?.();
					ev.stopPropagation?.();
					const ok = await beginBasicAction(actor, "brace");
					syncBraceBtn();
					if (ok) update();
				});
				div.append(braceBtn);
			}
			sel?.addEventListener?.("change", update);
			card.append(div);
		}
		return;
	}
	// 未锁定目标直接掷出的伤害卡（无系统原生应用伤害按钮）：提供兜底应用栏，支持按 T 锁定或左键选中受击者后一键结算
	if (root.querySelector(".lancer-cn-untargeted-apply")) return;
	const rawEntries = extractUntargetedDamageEntries(damageData);
	if (!rawEntries.length) return;
	if (!(game.user?.isGM || message?.isAuthor || getSetting("crossPermDamage", true))) return;
	const host = root.querySelector?.(".card.clipped-bot, .card, .message-content") ?? root;
	const doc = root.ownerDocument ?? globalThis.document;
	const bar = doc.createElement("div");
	bar.className = "lancer-cn-untargeted-apply";
	bar.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:4px 6px;margin-top:4px;border-top:1px dashed rgba(128,128,128,.35);font-size:12px";
	bar.innerHTML = `<span style="opacity:.82">未锁定目标：</span>`
		+ `<select class="lancer-cn-untargeted-mult" title="选择伤害倍率" style="height:24px;width:auto;padding:0 4px;font-size:12px"><option value="2">2×</option><option value="1" selected>1×</option><option value="0.5">抗性 0.5×</option></select>`
		+ `<button type="button" class="lancer-button lancer-primary" data-lancer-cn-apply-untargeted="1" style="width:auto;flex:0 0 auto;line-height:1.5;padding:0 .6em;margin:0" title="对当前锁定的目标（T），或在地图上左键选中的受击目标指示物结算此伤害">💥 应用伤害（锁定/选中目标）</button>`
		+ `<div class="lancer-cn-untargeted-preview" style="flex:1 1 100%;font-size:11px;color:#555;line-height:1.35"></div>`;
	const sel = bar.querySelector(".lancer-cn-untargeted-mult");
	const btn = bar.querySelector("[data-lancer-cn-apply-untargeted]");
	const prevEl = bar.querySelector(".lancer-cn-untargeted-preview");
	const updatePreview = () => {
		if (!prevEl) return;
		const { tokens } = resolveUntargetedDamageTargets(message);
		if (!tokens.length) {
			prevEl.textContent = "提示：先按 T 锁定受击目标，或左键选中受击者指示物，再点击上方按钮即可自动扣减护甲/护盾/HP";
			return;
		}
		const mult = sel ? (parseFloat(sel.value) || 1) : 1;
		const multiTarget = tokens.length > 1;
		const zeroRefs = Array.isArray(dmgCtx?.zeroUuids) ? dmgCtx.zeroUuids : [];
		const halfRefs = Array.isArray(dmgCtx?.halfUuids) ? dmgCtx.halfUuids : [];
		const lines = [];
		for (const tok of tokens) {
			const tUuid = tok.document?.uuid ?? tok.uuid ?? tok.actor?.uuid;
			const actor = tok.actor ?? tok.document?.actor ?? resolveActor(tUuid);
			if (!actor) continue;
			if (zeroRefs.some(u => sameActorRef(u, tUuid ?? actor))) {
				lines.push(`${tok.name ?? actor.name}：豁免成功免伤（0 伤害）`);
				continue;
			}
			const isHalf = Boolean(damageData?.half_damage || halfRefs.some(u => sameActorRef(u, tUuid ?? actor)));
			const entries = rawEntries.map(e => {
				let amount = (multiTarget && e.bonus) ? Math.ceil(e.rawAmount / 2) : e.rawAmount;
				if (isHalf) amount = Math.ceil(amount / 2);
				return { type: e.type, amount };
			});
			const p = previewDamageCalc(actor, entries, { multiple: mult, ap: Boolean(damageData?.ap), paracausal: Boolean(damageData?.paracausal), addBurn: true, dmgCtx });
			if (p) lines.push(`${tok.name ?? actor.name}：${p.summary}`);
		}
		prevEl.textContent = lines.join(" ｜ ");
	};
	updatePreview();
	sel?.addEventListener?.("change", updatePreview);
	bar.addEventListener?.("mouseenter", updatePreview);
	let untargetedApplying = false;
	btn?.addEventListener?.("click", async ev => {
		ev.preventDefault?.();
		ev.stopPropagation?.();
		if (untargetedApplying) return;
		untargetedApplying = true;
		if (btn) btn.disabled = true;
		try {
			const mult = sel ? (parseFloat(sel.value) || 1) : 1;
			const res = await applyUntargetedDamageFromCard(message, damageData, { multiple: mult, addBurn: true });
			if (res?.ok && btn) btn.textContent = `✓ 已应用（可改锁其他目标再点）`;
		} catch (err) {
			reportError("未锁定伤害结算", err);
		} finally {
			untargetedApplying = false;
			if (btn) btn.disabled = false;
		}
	});
	host.append(bar);
}

// ---------------------------------------------------------------------------
// 自动挂状态、撤销状态、擒拿与对抗检定、步战骑乘、豁免执行、非攻击掷伤害与聊天卡交互
let pendingTableStatuses = null; // 结构 / 过热卡打印前暂存：{ actorUuid, statuses }
let pendingHalfUuids = null;     // 从带豁免结果的攻击卡点击「掷伤害」时暂存减半目标 UUID 列表
let pendingZeroUuids = null;     // 从带豁免结果的攻击卡点击「掷伤害」时暂存低等兵「无用之人」免伤目标 UUID 列表
let pendingDamageMod = null;     // 从带 CP 强化的攻击卡点击「掷伤害」时暂存：{ paracausal, minReliable, oleanderCritParacausal }
let pendingCpAttackMeta = null;  // CP 专属攻击出卡前暂存：{ actorUuid, ... }
let pendingTechActionMeta = null; // 科技攻击 / 入侵出卡前暂存：{ actorUuid, itemUuid, title, actionName, effect, invade }
let pendingCardItemMeta = null;   // 系统 / 通用卡片出卡前暂存：{ actorUuid, itemUuid, title, effect }
let pendingDamageCardCtx = null;  // 伤害卡出卡前暂存：{ attackerUuid, itemUuid, weaponSize, ignoreBurnHeatResist, isBurnTick, isAoe }
let pendingJockeyFinisher = false; // 巨人杀手 III「终斩」骑乘破坏伤害出卡前暂存
let pendingApplyDamageCtx = null; // 原生点击「应用伤害」进入 damageCalc 前暂存当前伤害卡上下文（兜底）
const pendingApplyDamageCtxMap = new Map(); // 按受击角色 UUID/ID 隔离暂存伤害卡上下文，避免并发覆盖
let pendingWeaponAttackFlags = null; // 武器攻击出卡前暂存天赋与弹药库标记：{ actorUuid, ... }
let pendingDisdainfulBlade = null;   // 猎人 III「蔑刃」自由动作投掷出卡前暂存：{ actorUuid, weaponUuid }
let pendingOverwatchAttack = null;   // 守望反应交火出卡前暂存：{ actorUuid, weaponUuid }

const ALLOWED_SOCKET_COMBAT_STATE_KEYS = new Set([
	"sysopFirewall", "blackIceStacks", "usedOpenDoorSave", "attackedOrForcedSaveThisTurn",
	"skirmisherSoftCover", "usedBlackWitchParry", "usedVeteranLightningReflex",
	"reactionsUsedTurn", "usedOverwatchRound", "usedBraceRound", "disengagedThisTurn",
	"prospectorNoReactionTurn", "noReactionsUntilTurnEnd", "preparedAction", "cascadingTalentNhps", "roundKey", "turnKey",
]);

async function patchCombatStateCompat(actorOrUuid, patch) {
	if (!actorOrUuid || !patch || typeof patch !== "object") return false;
	const rawActor = typeof actorOrUuid === "string" ? resolveActor(actorOrUuid) : actorOrUuid;
	const mech = combatMechOf(rawActor) ?? rawActor;
	if (!mech) return false;
	if (mech.isOwner) {
		await ensureCombatTurnState(mech);
		await setCombatState(mech, patch);
		return true;
	}
	if (game.users?.activeGM) {
		const cleanPatch = {};
		for (const [k, v] of Object.entries(patch)) {
			if (ALLOWED_SOCKET_COMBAT_STATE_KEYS.has(k)) cleanPatch[k] = v;
		}
		if (Object.keys(cleanPatch).length) {
			const targetUuid = typeof actorOrUuid === "string" ? actorOrUuid : (preferredTargetUuid(mech) ?? mech.uuid);
			game.socket?.emit(`module.${MODULE_ID}`, { action: "patchCombatState", uuid: targetUuid, patch: cleanPatch });
			return true;
		}
	}
	return false;
}

async function updateAttackMessageTargetsCompat(message, atk, updatedTargets, extraFlagKey = null, extraFlagVal = null) {
	if (!message || !Array.isArray(updatedTargets)) return false;
	if (game.user?.isGM || message.isAuthor) {
		await message.setFlag?.("lancer", "attackData", { ...(atk ?? {}), targets: updatedTargets });
		if (extraFlagKey) await message.setFlag?.(MODULE_ID, extraFlagKey, extraFlagVal);
		return true;
	}
	if (game.users?.activeGM && message.id) {
		game.socket?.emit(`module.${MODULE_ID}`, {
			action: "updateAttackTargetResult",
			messageId: message.id,
			targets: updatedTargets,
			...(extraFlagKey ? { extraFlagKey, extraFlagVal } : {}),
		});
		return true;
	}
	return false;
}

async function updateMessageFlagCompat(message, key, value) {
	if (!message) return;
	if (game.user?.isGM || message.isAuthor) {
		await message.setFlag?.(MODULE_ID, key, value);
	} else if (game.users?.activeGM && message.id) {
		game.socket?.emit(`module.${MODULE_ID}`, { action: "setMessageFlag", messageId: message.id, key, value });
	}
}

// ---------------------------------------------------------------------------
// 守望（Overwatch）与反应体系（Reaction Economy）自动化（v1.18.0）
// - 反应经济：追踪每回合反应上限（默认 1/回合，戈尔贡「凝视」2/回合）与每轮限次（守望 1/轮、受身 1/轮，兼容超体「本能反应」与哨兵「子夜之眼」）；
//   统一校验晕眩（无畏级萨拉丁除外）、受扰、关机、昏迷、擒拿（黑胡子与特定擒拿特征 NPC 除外）、死印专注、创造进口、瓦解/埋伏禁反应及准备动作互斥；
//   非 GM 玩家受限时直接拦截并弹窗提示，主持人（GM）点击时弹出越权提示并允许放行；同步系统原生 action_tracker.reaction 徽章。
// - 守望自动化：监听战斗中指示物移动（preUpdateToken + updateToken），精确计算六角格/方格占地起止威胁距离，支持常规威胁内起步与先锋 III「永远警惕」进入 CQB 威胁触发，
//   自动排除脱离、匿迹、无形异面与瞬间移动；一键锁定移动目标、应用托尔图加「哨兵」/弓箭手「优秀哨兵」准度修正并发起单武器交火（取消面板无损返还反应）。
const preMoveTokenSnap = new Map();
const recentOverwatchPrompts = new Set();

function resetOverwatchPromptDedup() {
	preMoveTokenSnap.clear();
	recentOverwatchPrompts.clear();
}

function isActiveCombat() {
	const c = globalThis.game?.combat;
	return Boolean(c && (c.started !== false || Number(c.round) > 0));
}

function maxReactionsPerTurn(actor) {
	const mech = combatMechOf(actor) ?? actor;
	return mechFrameLid(mech) === "mf_gorgon" ? 2 : 1;
}

function canReactWhileGrappled(actor) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech) return false;
	if (mechFrameLid(mech) === "mf_blackbeard") return true;
	return hasNpcFeature(
		mech,
		["npcf_cn_monstrosity_8", "npcf_grappling_claws_monstrosity", "npcf_x_ss_1_1", "npcf_x_sultan_3_2", "npcf_x_sultan_5_5"],
		["纠缠之爪", "水蛭", "液压爪", "混战"],
	);
}

function hasUnlimitedOverwatchPerRound(actor) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech) return false;
	if (hasNpcFeature(mech, ["npcf_cn_ultra_9", "npcf_reflex_ultra", "npcf_x_rc_1_10"], ["本能反应", "辅助节点：点防"])) return true;
	if (hasNpcFeature(mech, ["npcf_cn_sentinel_3", "npcf_eye_of_midnight_sentinel"], ["子夜之眼"])
		&& Boolean(mech.statuses?.has?.("slow") || mech.system?.statuses?.slowed || mech.system?.statuses?.slow)) {
		return true;
	}
	return false;
}

function checkReactionAvailability(actor, { kind = "generic", label = "反应", roundFlag = null } = {}) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech) return { ok: false, reasons: ["未找到执行角色"], reasonText: "未找到执行角色", maxR: 1, usedR: 0 };
	const cs = getCombatState(mech);
	const fLid = mechFrameLid(mech);
	const reasons = [];

	if (mech.statuses?.has?.("downandout")) reasons.push("处于昏迷状态");
	if (mech.statuses?.has?.("shutdown") || mech.statuses?.has?.("shut_down")) reasons.push("处于关机状态");
	if ((mech.statuses?.has?.("stunned") || mech.system?.statuses?.stunned) && fLid !== "mf_ext_saladin_dread") {
		reasons.push("处于晕眩状态");
	}
	if (mech.statuses?.has?.("jammed") || mech.system?.statuses?.jammed) reasons.push("处于受扰状态");
	if ((Boolean(findActiveGrappleFor(mech)) || Boolean(mech.statuses?.has?.("grappled"))) && !canReactWhileGrappled(mech)) {
		reasons.push("处于擒拿状态中");
	}
	if (isCoreActiveOn(mech, "mf_deaths_head") && Boolean(getCoreState(mech).markTargetUuid)) {
		reasons.push("处于鬼面蛾「死印」专注期间");
	}
	const inCombat = isActiveCombat();
	const { roundKey, turnKey } = currentCombatStamp();
	const sameRound = inCombat ? (!cs.roundKey || cs.roundKey === roundKey) : true;
	const sameTurn = inCombat ? (!cs.turnKey || cs.turnKey === turnKey) : true;

	if (sameTurn && cs.prospectorNoReactionTurn) {
		reasons.push("本回合发动过「创造进口」");
	}
	if (cs.noReactionsUntilTurnEnd) {
		reasons.push("处于禁止反应效果期间");
	}
	if (cs.preparedAction && kind !== "triggerPrepared") {
		reasons.push("正保持「准备动作」（下一回合开始前不能执行其他反应）");
	}

	const maxR = maxReactionsPerTurn(mech);
	let usedR = (inCombat && sameTurn) ? (Number(cs.reactionsUsedTurn) || 0) : 0;
	if (mech.system?.action_tracker && mech.system.action_tracker.reaction === false && (!inCombat || sameTurn) && usedR < maxR) {
		usedR = maxR;
	}

	const skipRoundLimit = roundFlag === "usedOverwatchRound" && hasUnlimitedOverwatchPerRound(mech);
	const enforceRoundOutsideCombat = roundFlag === "usedBlackWitchParry" || roundFlag === "usedVeteranLightningReflex";
	if (roundFlag && !skipRoundLimit && (inCombat ? sameRound : enforceRoundOutsideCombat) && Boolean(cs[roundFlag])) {
		reasons.push(`本轮已使用过「${label}」（1/轮）`);
	}
	if (inCombat && usedR >= maxR) {
		reasons.push(`本回合反应次数已用尽（${usedR}/${maxR}）`);
	} else if (!inCombat && mech.system?.action_tracker?.reaction === false) {
		reasons.push("反应标记当前已关闭");
	}

	return { ok: reasons.length === 0, reasons, reasonText: reasons.join("；"), maxR, usedR };
}

async function syncActorReactionTracker(actor, available) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech?.system?.action_tracker) return false;
	const avail = Boolean(available);
	if (mech.isOwner) {
		if (typeof mech.update === "function") {
			try { await mech.update({ "system.action_tracker.reaction": avail }); } catch { /* ignore */ }
		}
		mech.system.action_tracker.reaction = avail;
		return true;
	}
	if (globalThis.game?.users?.activeGM) {
		const targetUuid = preferredTargetUuid(mech) ?? mech.uuid;
		globalThis.game.socket?.emit(`module.${MODULE_ID}`, { action: "setActionTrackerReaction", uuid: targetUuid, available: avail });
		return true;
	}
	return false;
}

async function consumeReaction(actor, { kind = "generic", label = "反应", roundFlag = null } = {}) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech) return { ok: false, blocked: true, reasons: ["未找到执行角色"], snapshot: null };
	if (mech.isOwner) await ensureCombatTurnState(mech);
	const chk = checkReactionAvailability(mech, { kind, label, roundFlag });
	const dispName = mech.token?.name ?? mech.name ?? "角色";
	if (!chk.ok) {
		if (!globalThis.game?.user?.isGM) {
			globalThis.ui?.notifications?.warn?.(`「${dispName}」无法执行${label}：${chk.reasonText}！`);
			return { ok: false, blocked: true, reasons: chk.reasons, snapshot: null };
		}
		globalThis.ui?.notifications?.warn?.(`主持人越权执行「${dispName}」的${label}（原受限：${chk.reasonText}）。`);
	}

	const curCs = getCombatState(mech);
	const inCombat = isActiveCombat();
	const { roundKey, turnKey } = currentCombatStamp();
	const sameTurn = inCombat ? (!curCs.turnKey || curCs.turnKey === turnKey) : true;
	const prevUsed = (inCombat && sameTurn) ? (Number(curCs.reactionsUsedTurn) || 0) : 0;
	const prevRoundVal = roundFlag ? Boolean(curCs[roundFlag]) : undefined;
	const prevPrepared = curCs.preparedAction ?? null;
	const prevTrackerReaction = mech.system?.action_tracker ? mech.system.action_tracker.reaction : undefined;

	const patch = {};
	const nextUsed = inCombat ? prevUsed + 1 : prevUsed;
	if (inCombat) {
		patch.roundKey = roundKey;
		patch.turnKey = turnKey;
		patch.reactionsUsedTurn = nextUsed;
	}
	const skipRoundLimit = roundFlag === "usedOverwatchRound" && hasUnlimitedOverwatchPerRound(mech);
	const enforceRoundOutsideCombat = roundFlag === "usedBlackWitchParry" || roundFlag === "usedVeteranLightningReflex";
	if (roundFlag && !skipRoundLimit && (inCombat || enforceRoundOutsideCombat)) {
		patch[roundFlag] = true;
	}
	if (kind === "triggerPrepared") {
		patch.preparedAction = null;
	}
	if (hasCoreBonus(mech, "cb_ghostweave") && curCs.ghostweaveCloak && mech.statuses?.has?.("invisible")) {
		await setActorStatus(preferredTargetUuid(mech) ?? mech.uuid, "invisible", false);
		patch.ghostweaveCloak = false;
	}
	if (Object.keys(patch).length) {
		await patchCombatStateCompat(mech, patch);
	}
	if (inCombat && nextUsed >= chk.maxR && mech.system?.action_tracker) {
		await syncActorReactionTracker(mech, false);
	}

	return {
		ok: true,
		gmOverride: !chk.ok,
		snapshot: {
			inCombat,
			prevUsed,
			roundFlag: (!skipRoundLimit && roundFlag) ? roundFlag : null,
			prevRoundVal,
			hadPrepared: kind === "triggerPrepared" ? prevPrepared : undefined,
			prevTrackerReaction,
		},
	};
}

async function refundReaction(actor, snapshot) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech || !snapshot) return false;
	const patch = {};
	if (snapshot.inCombat) patch.reactionsUsedTurn = snapshot.prevUsed;
	if (snapshot.roundFlag && snapshot.prevRoundVal !== undefined) patch[snapshot.roundFlag] = snapshot.prevRoundVal;
	if (snapshot.hadPrepared !== undefined) patch.preparedAction = snapshot.hadPrepared;
	if (Object.keys(patch).length) await patchCombatStateCompat(mech, patch);
	if (snapshot.prevTrackerReaction === true && mech.system?.action_tracker) {
		await syncActorReactionTracker(mech, true);
	}
	return true;
}

function weaponAllTagsOf(item) {
	if (!item) return [];
	const prof = weaponProfileOf(item);
	const out = [];
	for (const pool of [
		prof?.all_tags,
		prof?.tags,
		(() => { try { return item.getTags?.(); } catch { return null; } })(),
		item.system?.all_tags,
		item.system?.tags,
	]) {
		if (Array.isArray(pool)) out.push(...pool);
	}
	return out;
}

function weaponHasOrdnanceTag(item) {
	return weaponAllTagsOf(item).some(t => t?.is_ordnance || t?.lid === "tg_ordnance" || t?.id === "tg_ordnance");
}

function overwatchThreatVal(item, actor = null) {
	if (!item) return 1;
	const mech = combatMechOf(actor ?? item.actor ?? item.parent) ?? actor;
	const prof = weaponProfileOf(item);
	const hasAllRange = Array.isArray(prof?.all_range) && prof.all_range.length > 0;
	const ranges = hasAllRange ? prof.all_range : (prof?.range ?? item?.currentProfile?.()?.range ?? []);
	let best = 0;
	for (const r of ranges) {
		if (r?.type === "Threat") {
			const n = parseInt(r.val, 10);
			if (Number.isFinite(n) && n > best) best = n;
		}
	}
	let threat = best > 0 ? best : 1; // 核心规则书 v3.5：除非另有说明，所有武器默认具有威胁 1
	if (mech && mechFrameLid(mech) === "mf_tokugawa" && mech.statuses?.has?.("exposed")) threat += 1;
	if (mech && mechFrameLid(mech) === "mf_ext_red_admiral" && item.system?.size === "Main" && isMeleeWeaponItem(item)) threat += 1;
	if (!hasAllRange && mech && isMeleeWeaponItem(item) && itemBenefitsFromCoreBonuses(item) && hasCoreBonus(mech, "cb_gyges_frame")) {
		threat += 1;
	}
	return threat;
}

function eligibleOverwatchWeapons(actor, { distStart = null, distEnd = null, requireMatch = false } = {}) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech) return [];
	const isNpc = mech.type === "npc" || Boolean(mech.is_npc?.());
	const isMech = mech.type === "mech" || Boolean(mech.is_mech?.());
	if (!isMech && !isNpc) return [];

	const candidates = [];
	const seen = new Set();
	const pushWeapon = w => {
		if (!w || typeof w !== "object") return;
		const k = w.id || w.uuid || w;
		if (seen.has(k)) return;
		seen.add(k);
		candidates.push(w);
	};

	if (isMech) {
		const mounts = mech.system?.loadout?.weapon_mounts;
		if (Array.isArray(mounts) && mounts.length > 0) {
			for (const m of mounts) {
				if (m?.bracing) continue;
				for (const slot of m?.slots ?? []) {
					const rawW = slot?.weapon?.value ?? slot?.weapon;
					const wDoc = typeof rawW === "string" ? resolveDocSync(rawW) : rawW;
					if (wDoc?.system) pushWeapon(wDoc);
				}
			}
			const intLids = new Set(mechFrame(mech)?.system?.core_system?.integrated ?? []);
			for (const it of mech.items ?? []) {
				if (!it || (it.type && it.type !== "mech_weapon" && !it.is_mech_weapon?.())) continue;
				const lid = weaponLidOf(it);
				if (intLids.has(lid) || /_integrated$/.test(lid)) pushWeapon(it);
			}
		}
		if (!candidates.length) {
			for (const it of mech.items ?? []) {
				if (!it || (it.type && it.type !== "mech_weapon" && !it.is_mech_weapon?.())) continue;
				pushWeapon(it);
			}
		}
	} else {
		for (const it of [...(mech.items ?? []), ...(mech.itemTypes?.npc_feature ?? [])]) {
			if (!it || (it.type && it.type !== "npc_feature" && !it.is_npc_feature?.())) continue;
			if (it.system?.type !== "Weapon") continue;
			pushWeapon(it);
		}
	}

	const out = [];
	for (const w of candidates) {
		if (w.system?.destroyed) continue;
		if (isMech && w.system?.size === "Superheavy") continue;
		if (isNpc && /Superheavy|超重/i.test(String(w.system?.weapon_type ?? ""))) continue;
		if (weaponHasOrdnanceTag(w)) continue;
		if (isWeaponThrownOut(mech, w)) continue;
		const tags = weaponAllTagsOf(w);
		const isLoading = Boolean(w.isLoading?.() || tags.some(t => t?.is_loading || t?.lid === "tg_loading" || t?.id === "tg_loading"));
		if (isLoading && w.system?.loaded === false) continue;
		const isRecharge = Boolean(w.isRecharge?.() || tags.some(t => t?.is_recharge || t?.lid === "tg_recharge" || t?.id === "tg_recharge"));
		if (isRecharge && w.system?.charged === false) continue;
		const isLimited = Boolean(w.isLimited?.() || tags.some(t => t?.is_limited || t?.lid === "tg_limited" || t?.id === "tg_limited"));
		if (isLimited && w.system?.uses !== undefined) {
			const curUses = typeof w.system.uses === "object" && w.system.uses !== null ? Number(w.system.uses.value) : Number(w.system.uses);
			if (Number.isFinite(curUses) && curUses <= 0) continue;
		}
		const threat = overwatchThreatVal(w, mech);
		const vanguard3 = Boolean(isMech && itemBenefitsFromTalents(w) && weaponHasType(w, "CQB") && talentRank(mech, "t_vanguard") >= 3);
		const startInThreat = distStart !== null && Number.isFinite(distStart) && distStart <= threat;
		const enterThreat = vanguard3 && distEnd !== null && Number.isFinite(distEnd) && distEnd <= threat;
		if (requireMatch && !startInThreat && !enterThreat) continue;
		out.push({
			weapon: w,
			id: String(w.id ?? ""),
			uuid: String(w.uuid ?? ""),
			name: String(w.name ?? "武器"),
			threat,
			vanguard3,
			triggerMode: startInThreat ? "start" : (enterThreat ? "vanguardEnter" : "manual"),
		});
	}
	return out;
}

function resolveTokenPlaceable(tokenOrUuid) {
	if (!tokenOrUuid) return null;
	if (typeof tokenOrUuid === "object") {
		if (tokenOrUuid.setTarget || tokenOrUuid.center) return tokenOrUuid;
		if (tokenOrUuid.object) return tokenOrUuid.object;
	}
	const doc = typeof tokenOrUuid === "string" ? resolveDocSync(tokenOrUuid) : tokenOrUuid;
	if (doc?.object) return doc.object;
	const docId = doc?.id ?? (typeof tokenOrUuid === "string" ? tokenOrUuid.split(".").pop() : null);
	if (docId && globalThis.canvas?.tokens?.get) {
		const byId = globalThis.canvas.tokens.get(docId);
		if (byId) return byId;
	}
	const actor = doc?.actor ?? (typeof tokenOrUuid === "string" ? resolveActor(tokenOrUuid) : null);
	return actor ? attackerToken(actor) : null;
}

async function executeOverwatchAttack(actor, { weaponId = null, targetTokenOrUuid = null, message = null, triggerDist = null } = {}) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech) return false;
	if (!(globalThis.game?.user?.isGM || mech.isOwner)) {
		globalThis.ui?.notifications?.warn?.(`请由 ${mech.name ?? "该角色"} 的拥有者或主持人发动守望。`);
		return false;
	}
	const eligible = eligibleOverwatchWeapons(mech);
	if (!eligible.length) {
		globalThis.ui?.notifications?.warn?.(`「${mech.token?.name ?? mech.name ?? "角色"}」当前没有可用于守望的合法武器（超重型、重火器、未装填、未充能或已投出的武器不能用于守望）！`);
		return false;
	}
	let picked = weaponId
		? eligible.find(e => e.id === weaponId || e.uuid === weaponId || weaponTrackKey(e.weapon) === weaponId)
		: null;
	if (!picked) {
		if (eligible.length === 1) {
			picked = eligible[0];
		} else {
			picked = await promptConditionChoice(
				`${mech.token?.name ?? mech.name ?? "角色"} // 守望 · 选择交火武器`,
				eligible.map(e => ({
					...e,
					buttonLabel: `${e.name}（威胁 ${e.threat}${e.vanguard3 ? " · 永远警惕" : ""}）`,
				})),
				"请选择本次守望反应交火使用的单件武器：",
			);
		}
	}
	if (!picked?.weapon) return false;

	const rGate = await consumeReaction(mech, { kind: "overwatch", label: "守望", roundFlag: "usedOverwatchRound" });
	if (!rGate.ok) return false;

	if (targetTokenOrUuid) {
		const tok = resolveTokenPlaceable(targetTokenOrUuid);
		if (tok) {
			if (typeof tok.setTarget === "function") {
				tok.setTarget(true, { releaseOthers: true });
			} else if (globalThis.game?.user?.targets instanceof Set) {
				globalThis.game.user.targets.clear();
				globalThis.game.user.targets.add(tok);
			}
		}
	}

	const AtkCls = globalThis.game?.lancer?.flows?.get?.("WeaponAttackFlow");
	if (!AtkCls) {
		await refundReaction(mech, rGate.snapshot);
		return false;
	}
	pendingOverwatchAttack = { actorUuid: mech.uuid, weaponUuid: picked.weapon.uuid, triggerDist: Number.isFinite(triggerDist) ? Number(triggerDist) : null };
	try {
		const flow = new AtkCls(picked.weapon.uuid ?? picked.weapon, { title: `守望 // ${picked.name}` });
		const ok = await flow.begin();
		if (ok === false) {
			await refundReaction(mech, rGate.snapshot);
			return false;
		}
		if (mech.statuses?.has?.("hidden")) {
			await setActorStatus(preferredTargetUuid(mech) ?? mech.uuid, "hidden", false);
		}
		if (message) {
			const ow = getObjectFlag(message, "overwatchPrompt");
			if (Array.isArray(ow.watchers)) {
				const wUuid = preferredTargetUuid(mech) ?? mech.uuid;
				const nextWatchers = ow.watchers.map(w => (sameActorRef(w.watcherUuid, wUuid ?? mech) ? { ...w, triggeredWeaponName: picked.name } : w));
				await updateMessageFlagCompat(message, "overwatchPrompt", { ...ow, watchers: nextWatchers });
			}
		}
		return true;
	} finally {
		pendingOverwatchAttack = null;
	}
}

async function triggerPreparedAction(message) {
	const prep = getObjectFlag(message, "prepareCard");
	if (!prep.uuid || prep.triggered || prep.cancelled) return false;
	const actor = resolveActor(prep.uuid);
	if (!actor || !(globalThis.game?.user?.isGM || actor.isOwner)) {
		globalThis.ui?.notifications?.warn?.(`请由 ${prep.name ?? "该角色"} 的拥有者或主持人触发准备动作。`);
		return false;
	}
	const rGate = await consumeReaction(actor, { kind: "triggerPrepared", label: `准备动作（${prep.action || "快速动作"}）` });
	if (!rGate.ok) return false;
	await patchCombatStateCompat(actor, { preparedAction: null });
	await updateMessageFlagCompat(message, "prepareCard", { ...prep, triggered: true });
	if (actor.statuses?.has?.("hidden")) {
		await setActorStatus(prep.uuid, "hidden", false);
	}
	await postCpEffectCard(
		actor,
		"触发准备动作",
		`<p><b>${escHtml(prep.name || actor.name)}</b> 满足条件（${escHtml(prep.trigger || "条件触发")}），消耗<b>反应</b>立即执行准备好的动作：<b>${escHtml(prep.action || "快速动作")}</b>！</p>`,
	);
	return true;
}

async function cancelPreparedAction(message) {
	const prep = getObjectFlag(message, "prepareCard");
	if (!prep.uuid || prep.triggered || prep.cancelled) return false;
	const actor = resolveActor(prep.uuid);
	if (!actor || !(globalThis.game?.user?.isGM || actor.isOwner)) return false;
	await patchCombatStateCompat(actor, { preparedAction: null });
	await updateMessageFlagCompat(message, "prepareCard", { ...prep, cancelled: true });
	globalThis.ui?.notifications?.info?.(`已解除「${prep.name || actor.name}」的准备动作状态。`);
	return true;
}

function offsetsAtPosition(doc, posX, posY, grid = globalThis.canvas?.grid) {
	const sizePx = Number(grid?.size) || 100;
	const wSpaces = Number(doc?.width) || 1;
	const hSpaces = Number(doc?.height) || 1;
	const wPx = wSpaces * sizePx;
	const hPx = hSpaces * sizePx;
	const centerPt = { x: posX + wPx / 2, y: posY + hPx / 2 };
	if (typeof doc?.getOccupiedGridSpaceOffsets === "function") {
		try {
			const offs = doc.getOccupiedGridSpaceOffsets({ x: posX, y: posY });
			if (offs?.length) {
				const movedFar = Math.hypot(posX - (Number(doc.x) || 0), posY - (Number(doc.y) || 0)) >= sizePx * 0.5;
				if (movedFar) {
					const curOffs = doc.getOccupiedGridSpaceOffsets({ x: doc.x, y: doc.y });
					const sameAsCur = curOffs?.length === offs.length && offs.every((o, i) => o.i === curOffs[i]?.i && o.j === curOffs[i]?.j);
					if (!sameAsCur) return offs;
				} else {
					return offs;
				}
			}
		} catch { /* fallback below */ }
	}
	if (!grid?.getOffset) return [];
	const wInt = Math.max(1, Math.round(wSpaces));
	const hInt = Math.max(1, Math.round(hSpaces));
	if (wInt <= 1 && hInt <= 1) return [grid.getOffset(centerPt)];
	const out = [];
	const seen = new Set();
	for (let gy = 0; gy < hInt; gy++) {
		for (let gx = 0; gx < wInt; gx++) {
			const o = grid.getOffset({ x: posX + (gx + 0.5) * sizePx, y: posY + (gy + 0.5) * sizePx });
			const k = `${o.i},${o.j}`;
			if (!seen.has(k)) {
				seen.add(k);
				out.push(o);
			}
		}
	}
	return out;
}

function tokenDistanceFromPos(moverDoc, posX, posY, otherTok) {
	const grid = globalThis.canvas?.grid;
	if (!grid || !moverDoc || !otherTok) return null;
	const sizePx = Number(grid.size) || 100;
	const centerA = {
		x: posX + ((Number(moverDoc.width) || 1) * sizePx) / 2,
		y: posY + ((Number(moverDoc.height) || 1) * sizePx) / 2,
	};
	const measure = (p, q) => {
		const r = grid.measurePath([p, q]);
		return r.spaces ?? Math.round(r.distance / (grid.distance || 1));
	};
	if (grid.isGridless || !grid.getOffset || !grid.getCenterPoint) {
		const centerB = otherTok.center ?? {
			x: (Number(otherTok.document?.x ?? otherTok.x) || 0) + ((Number(otherTok.document?.width) || 1) * sizePx) / 2,
			y: (Number(otherTok.document?.y ?? otherTok.y) || 0) + ((Number(otherTok.document?.height) || 1) * sizePx) / 2,
		};
		return measure(centerA, centerB);
	}
	const offsA = offsetsAtPosition(moverDoc, posX, posY, grid);
	const offsB = occupied(otherTok);
	if (!offsA.length || !offsB.length) return null;
	let best = Infinity;
	for (const oa of offsA) {
		for (const ob of offsB) {
			best = Math.min(best, measure(grid.getCenterPoint(oa), grid.getCenterPoint(ob)));
		}
	}
	return Number.isFinite(best) ? best : null;
}

function onPreUpdateTokenOverwatch(doc, changes) {
	if (!doc || !changes || (!("x" in changes) && !("y" in changes))) return;
	const key = doc.uuid || doc.id;
	if (!key) return;
	if (preMoveTokenSnap.size >= 128) {
		const oldest = preMoveTokenSnap.keys().next().value;
		preMoveTokenSnap.delete(oldest);
	}
	preMoveTokenSnap.set(key, {
		x: Number(doc.x) || 0,
		y: Number(doc.y) || 0,
		elevation: Number(doc.elevation) || 0,
	});
}

async function onOverwatchTokenUpdate(doc, changes, options, userId) {
	if (!doc || !changes || (!("x" in changes) && !("y" in changes))) return null;
	const key = doc.uuid || doc.id;
	const snap = (key ? preMoveTokenSnap.get(key) : null) ?? options?._preMoveSnap ?? null;
	if (key) preMoveTokenSnap.delete(key);
	if (!snap) return null;
	if (!getSetting("overwatchPrompt", true)) return null;
	if (!isActiveCombat()) return null;
	if (options?.teleport || options?.lancerCnIgnoreOverwatch || options?.isUndo) return null;

	const activeGM = globalThis.game?.users?.activeGM;
	const isSoleReporter = activeGM ? Boolean(activeGM.isSelf) : (!userId || userId === globalThis.game?.user?.id);
	if (!isSoleReporter) return null;

	const newX = Number(changes.x ?? doc.x) || 0;
	const newY = Number(changes.y ?? doc.y) || 0;
	if (Math.abs(newX - snap.x) < 1 && Math.abs(newY - snap.y) < 1) return null;

	const grid = globalThis.canvas?.grid;
	if (!grid) return null;
	if (!grid.isGridless && grid.getOffset) {
		const startCells = offsetsAtPosition(doc, snap.x, snap.y, grid).map(o => `${o.i},${o.j}`).sort().join(";");
		const endCells = offsetsAtPosition(doc, newX, newY, grid).map(o => `${o.i},${o.j}`).sort().join(";");
		if (startCells && startCells === endCells) return null;
	}

	const moverTok = doc.object ?? globalThis.canvas?.tokens?.get?.(doc.id) ?? null;
	const moverActor = doc.actor ?? moverTok?.actor ?? null;
	if (!moverActor || !["mech", "npc", "pilot"].includes(moverActor.type)) return null;
	if (doc.hidden || moverTok?.document?.hidden) return null;
	if (moverActor.statuses?.has?.("downandout") || moverActor.statuses?.has?.("hidden")) return null;

	const moverCs = getCombatState(moverActor);
	const { turnKey } = currentCombatStamp();
	const moverSameTurn = !moverCs.turnKey || moverCs.turnKey === turnKey;
	if (moverSameTurn && moverCs.disengagedThisTurn) return null;

	const D = globalThis.CONST?.TOKEN_DISPOSITIONS ?? { SECRET: -2, HOSTILE: -1, NEUTRAL: 0, FRIENDLY: 1 };
	const moverDisp = Number(doc.disposition ?? moverTok?.document?.disposition ?? D.FRIENDLY);
	const moverIntangible = Boolean(moverActor.statuses?.has?.("intangible"));
	const moverUuid = doc.uuid ?? moverTok?.document?.uuid ?? moverTok?.uuid ?? moverActor.uuid;
	const moverName = doc.name ?? moverTok?.name ?? moverActor.name ?? "移动目标";

	const matchedWatchers = [];
	for (const watcherTok of globalThis.canvas?.tokens?.placeables ?? []) {
		if (!watcherTok || watcherTok === moverTok || (doc.id && watcherTok.id === doc.id)) continue;
		if (watcherTok.document?.hidden) continue;
		const watcherActor = watcherTok.actor ?? watcherTok.document?.actor;
		if (!watcherActor || watcherActor === moverActor) continue;
		const watcherDisp = Number(watcherTok.document?.disposition ?? D.HOSTILE);
		const isOpposing = (moverDisp > 0 && watcherDisp === D.HOSTILE) || (moverDisp === D.HOSTILE && watcherDisp > 0);
		if (!isOpposing) continue;
		if (Boolean(watcherActor.statuses?.has?.("intangible")) !== moverIntangible) continue;

		const chk = checkReactionAvailability(watcherActor, { kind: "overwatch", label: "守望", roundFlag: "usedOverwatchRound" });
		if (!chk.ok) continue;

		const distStart = tokenDistanceFromPos(doc, snap.x, snap.y, watcherTok);
		const distEnd = tokenDistanceFromPos(doc, newX, newY, watcherTok);
		if (distStart === null && distEnd === null) continue;

		const weapons = eligibleOverwatchWeapons(watcherActor, { distStart, distEnd, requireMatch: true });
		if (!weapons.length) continue;

		const watcherUuid = watcherTok.document?.uuid ?? watcherTok.uuid ?? watcherActor.uuid;
		const dedupKey = `${turnKey}::${moverUuid}::${watcherUuid}`;
		if (!options?.forceOverwatchCheck && recentOverwatchPrompts.has(dedupKey)) continue;
		recentOverwatchPrompts.add(dedupKey);

		matchedWatchers.push({
			watcherUuid,
			watcherName: watcherTok.document?.name ?? watcherTok.name ?? watcherActor.name ?? "守望方",
			triggeredWeaponName: null,
			weapons: weapons.map(w => ({
				id: w.id,
				uuid: w.uuid,
				name: w.name,
				threat: w.threat,
				triggerMode: w.triggerMode,
				triggerDist: w.triggerMode === "start" ? distStart : distEnd,
			})),
		});
	}

	if (!matchedWatchers.length) return null;
	const watcherNamesHtml = matchedWatchers.map(w => `<b>${escHtml(w.watcherName)}</b>`).join("、");
	const content = `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// ⚠️ 守望触发提醒 //</div><div class="effect-text"><p><b>${escHtml(moverName)}</b> 在威胁范围内移动，${watcherNamesHtml} 可消耗<b>反应</b>发动<b>守望</b>（在其移动前以单件武器进行交火）：</p></div></div>`;
	return globalThis.ChatMessage?.create?.({
		speaker: globalThis.ChatMessage?.getSpeaker?.({ actor: moverActor }) ?? {},
		content,
		flags: {
			[MODULE_ID]: {
				skipAutoScan: true,
				overwatchPrompt: {
					turnKey,
					moverUuid,
					moverName,
					dismissed: false,
					watchers: matchedWatchers,
				},
			},
		},
	});
}

function actorBaseSize(actor) {
	const raw = Number(actor?.system?.size);
	return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function hasSyntheticMuscleNetting(actor) {
	for (const item of actor?.items ?? []) {
		if (item?.system?.destroyed) continue;
		const lid = String(item?.system?.lid ?? "");
		const name = String(item?.name ?? "").trim();
		if (lid === "ms_synthetic_muscle_netting" || /^合成肌肉织?网$/.test(name) || /^synthetic muscle netting$/i.test(name)) return true;
	}
	return false;
}

// 擒拿有效大小：
// - 因帕卡伊「骨髓之锚」激活时，擒拿对比体型始终视为比对手大 1；
// - 黑胡子「合成肌肉网」在主动发起擒拿时，面对更大对手视为同大小，面对同级或更小对手至少视为大一级（FAQ 2fce3f）
function effectiveGrappleSize(actor, oppBaseSize = null, { isGrappler = true } = {}) {
	const base = actorBaseSize(actor);
	if (!Number.isFinite(Number(oppBaseSize))) return base;
	const opp = Number(oppBaseSize);
	if (isCoreActiveOn(actor, "mf_Empakaai_alt_blackbeard")) {
		return Math.max(base, opp < 1 ? 1 : opp + 1);
	}
	if (!isGrappler || !hasSyntheticMuscleNetting(actor)) return base;
	if (opp > base) return opp;
	return base < 1 ? 1 : base + 1;
}

// ---------------------------------------------------------------------------
// 机甲核心协议（Core Power / CP，1.12.0）：
// - 修复系统 consumeCorePower 未置位 system.core_active = true 的问题（自动激活德川「辉光」等 active_bonuses）；
// - 高效（Efficient，全 21 台）与条件返还（巴巴罗萨未开火、恩奇都未处决、柔剑中断未命中）自动返还 1 CP；
// - 骨架专属被动加成、多模式内建武器切换、充能骰 / 弹仓追踪、真黑神盾伤害压至 1、迷宫递减难度豁免与一键子动作。
const EFFICIENT_FRAME_LIDS = new Set([
	"mf_lancaster_alt_taraxacum",
	"mf_ext_nemo",
	"mf_ext_nelson_wing",
	"mf_black_witch_alt_orchidea",
	"mf_ext_oleander",
	"mf_ext_night_cutter",
	"mf_amber_phantom",
	"mf_ext_jouken",
	"mf_balor_alt_hecatoncheires",
	"mf_ext_chimera",
	"mf_lycan",
	"mf_minotaur_alt_wraith",
	"mf_kutuzov",
	"mf_ext_habsburg",
	"mf_ext_saladin_dread",
	"mf_sherman_alt_tagetes",
	"mf_ext_bligh",
	"mf_ext_salamander",
	"mf_piof_coriander",
	"mf_ch_gajeshura",
	"mf_ext_kanggeduo",
]);

function mechFrame(actor) {
	if (!actor || (actor.type !== "mech" && !actor.is_mech?.())) return null;
	return actor.system?.loadout?.frame?.value ?? (actor.items ?? []).find?.(i => i?.type === "frame") ?? null;
}

function mechFrameLid(actor) {
	return String(mechFrame(actor)?.system?.lid ?? "");
}

function isEfficientCore(actor) {
	const frame = mechFrame(actor);
	const lid = String(frame?.system?.lid ?? "");
	if (EFFICIENT_FRAME_LIDS.has(lid)) return true;
	const cs = frame?.system?.core_system;
	if (!cs) return false;
	const texts = [cs.active_effect, ...(cs.active_actions ?? []).map(a => a?.detail)].filter(Boolean).join(" ");
	return /高效|\befficient\b/i.test(texts);
}

function getCoreState(actor) {
	const raw = actor?.getFlag?.(MODULE_ID, "coreState");
	return raw && typeof raw === "object" ? raw : {};
}

async function setCoreState(actor, patch) {
	if (!actor?.setFlag) return {};
	const next = { ...getCoreState(actor), ...patch };
	await actor.setFlag(MODULE_ID, "coreState", next);
	return next;
}

function isCoreActiveOn(actor, lid = null) {
	if (!actor || (actor.type !== "mech" && !actor.is_mech?.())) return false;
	const cs = getCoreState(actor);
	const active = Boolean(actor.system?.core_active || cs.active);
	if (!active) return false;
	return !lid || (cs.frameLid || mechFrameLid(actor)) === lid;
}

function hasTrueblack(actor) {
	return Boolean(actor?.statuses?.has?.("trueblack") || isCoreActiveOn(actor, "mf_napoleon"));
}

function isUnremovableShredded(actor) {
	return isCoreActiveOn(actor, "mf_balor");
}

function isCoreSustainedImmobilized(actor) {
	return isCoreActiveOn(actor, "mf_drake") || (isCoreActiveOn(actor, "mf_deaths_head") && Boolean(getCoreState(actor).markTargetUuid));
}

function allKnownMechs() {
	const seen = new Set();
	const out = [];
	const push = a => {
		if (!a || (a.type !== "mech" && !a.is_mech?.())) return;
		const k = a.uuid ?? a.id ?? a;
		if (seen.has(k)) return;
		seen.add(k);
		out.push(a);
	};
	for (const a of globalThis.game?.actors ?? []) push(a);
	for (const t of globalThis.canvas?.tokens?.placeables ?? []) push(t?.actor);
	for (const sc of globalThis.game?.scenes ?? []) for (const td of sc?.tokens ?? []) if (td?.actor) push(td.actor);
	return out;
}

function findLancasterForAlly(actorOrUuid) {
	if (!actorOrUuid) return null;
	for (const m of allKnownMechs()) {
		if (!isCoreActiveOn(m, "mf_lancaster")) continue;
		const tUuid = getCoreState(m).latchTargetUuid;
		if (tUuid && sameActorRef(tUuid, actorOrUuid)) return m;
	}
	return null;
}

function isLatchedByLancaster(actorOrUuid) {
	return Boolean(findLancasterForAlly(actorOrUuid));
}

function hasSagarmathaBanner(actorOrUuid) {
	if (!actorOrUuid) return false;
	for (const m of allKnownMechs()) {
		if (!isCoreActiveOn(m, "mf_sagarmatha")) continue;
		const list = getCoreState(m).bannerTargetUuids ?? [];
		if (list.some(u => sameActorRef(u, actorOrUuid))) return true;
	}
	return false;
}

function cpAttackAccuracyBonus(actor) {
	if (!actor) return 0;
	let bonus = 0;
	if (isCoreActiveOn(actor, "mf_standard_pattern_i_everest")) bonus += 1;
	if (isLatchedByLancaster(actor)) bonus += 1;
	return bonus;
}

function cpStatAccuracyBonus(actor) {
	if (!actor) return 0;
	let bonus = cpAttackAccuracyBonus(actor);
	if (hasSagarmathaBanner(actor)) bonus += 1;
	return bonus;
}

function findIntegratedWeapon(actor, lid) {
	for (const item of actor?.items ?? []) {
		if (item?.type && item.type !== "mech_weapon") continue;
		if (String(item?.system?.lid ?? "") === lid) return item;
	}
	return null;
}

async function setWeaponProfile(actor, lid, profileIdx) {
	const wpn = findIntegratedWeapon(actor, lid);
	if (!wpn) return null;
	const idx = Math.max(0, Number(profileIdx) || 0);
	if (typeof wpn.update === "function") await wpn.update({ "system.selected_profile_index": idx });
	else if (wpn.system) wpn.system.selected_profile_index = idx;
	return wpn;
}

async function syncCpActiveEffect(actor, key, label, changes) {
	if (!actor) return;
	const existing = Array.from(actor.effects ?? []).find(e => (e?.getFlag?.(MODULE_ID, "cpEffectKey") ?? e?.flags?.[MODULE_ID]?.cpEffectKey) === key);
	if (!changes?.length) {
		if (existing) {
			if (typeof actor.deleteEmbeddedDocuments === "function") await actor.deleteEmbeddedDocuments("ActiveEffect", [existing.id ?? existing._id]);
			else if (Array.isArray(actor.effects)) actor.effects = actor.effects.filter(e => e !== existing);
		}
		return;
	}
	if (existing) {
		if (typeof actor.updateEmbeddedDocuments === "function") await actor.updateEmbeddedDocuments("ActiveEffect", [{ _id: existing.id ?? existing._id, name: label, disabled: false, changes }]);
		else Object.assign(existing, { name: label, disabled: false, changes });
		return;
	}
	const docData = { _id: `lcn_${key}`, id: `lcn_${key}`, name: label, disabled: false, changes, flags: { [MODULE_ID]: { cpEffectKey: key } } };
	if (typeof actor.createEmbeddedDocuments === "function") await actor.createEmbeddedDocuments("ActiveEffect", [docData]);
	else if (Array.isArray(actor.effects)) actor.effects.push(docData);
}

async function clearCpActiveEffects(actor) {
	if (!actor) return;
	const list = Array.from(actor.effects ?? []).filter(e => e?.getFlag?.(MODULE_ID, "cpEffectKey") ?? e?.flags?.[MODULE_ID]?.cpEffectKey);
	if (!list.length) return;
	if (typeof actor.deleteEmbeddedDocuments === "function") await actor.deleteEmbeddedDocuments("ActiveEffect", list.map(e => e.id ?? e._id));
	else if (Array.isArray(actor.effects)) actor.effects = actor.effects.filter(e => !list.includes(e));
}

async function syncWhiteWitchArmor(actor, count) {
	const prev = Number(getCoreState(actor).counterValue) || 0;
	const clamped = Math.max(0, Math.min(12, Math.round(Number(count) || 0)));
	const ADD_MODE = globalThis.CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2;
	await setCoreState(actor, { counterValue: clamped, counterMax: 12, counterLabel: "铁磁反应装甲" });
	await syncCpActiveEffect(actor, "white_witch_armor", `超激活铁磁装甲 (+${clamped})`, clamped > 0
		? [{ key: "system.armor", mode: ADD_MODE, value: String(clamped), priority: 40 }]
		: []);
	if (clamped >= 6) {
		await setActorStatus(actor, "immobilized", true);
	} else if (prev >= 6 && !isGrappleImmobilized(actor)) {
		await setActorStatus(actor, "immobilized", false);
	}
	return clamped;
}

async function syncShermanZf4(actor, charges) {
	const clamped = Math.max(1, Math.min(4, Math.round(Number(charges) || 1)));
	const frame = mechFrame(actor);
	const ctrs = frame?.system?.counters;
	if (Array.isArray(ctrs)) {
		const idx = ctrs.findIndex(c => c?.lid === "ctr_zf4_solidcore" || /固态堆芯|solidcore/i.test(c?.name ?? ""));
		if (idx >= 0) {
			const nextCtrs = ctrs.map((c, i) => (i === idx ? { ...c, value: clamped } : c));
			if (typeof frame.update === "function") await frame.update({ "system.counters": nextCtrs });
			else frame.system.counters = nextCtrs;
		}
	}
	await setWeaponProfile(actor, "mw_sherman_integrated", clamped - 1);
	if (isCoreActiveOn(actor, "mf_sherman")) {
		await setCoreState(actor, { counterValue: clamped, counterMax: 4, counterLabel: "ZF4 充能" });
	}
	return clamped;
}

function currentShermanZf4(actor) {
	const frame = mechFrame(actor);
	const ctr = (frame?.system?.counters ?? []).find(c => c?.lid === "ctr_zf4_solidcore" || /固态堆芯|solidcore/i.test(c?.name ?? ""));
	if (ctr && Number.isFinite(Number(ctr.value))) return Number(ctr.value);
	const wpn = findIntegratedWeapon(actor, "mw_sherman_integrated");
	if (wpn && Number.isFinite(Number(wpn.system?.selected_profile_index))) return Number(wpn.system.selected_profile_index) + 1;
	return Number(getCoreState(actor).counterValue) || 1;
}

async function syncBarbarossaRail(actor, dieVal, extraPatch = {}) {
	const clamped = Math.max(1, Math.min(4, Math.round(Number(dieVal) || 4)));
	await setWeaponProfile(actor, "mw_barbarossa_integrated", 4 - clamped);
	await setCoreState(actor, { counterValue: clamped, counterMax: 4, counterLabel: "末日骰", ...extraPatch });
	return clamped;
}

async function healSceneDrones(actor, { clearConditions = false } = {}) {
	let healed = 0;
	const selfTok = attackerToken(actor);
	const myDisp = selfTok?.document?.disposition ?? 1;
	for (const tok of globalThis.canvas?.tokens?.placeables ?? []) {
		const a = tok?.actor;
		if (!a || (a.type !== "deployable" && !a.is_deployable?.())) continue;
		const sameSide = (tok.document?.disposition ?? 1) === myDisp || a.system?.owner?.value === actor;
		if (!sameSide || !a.isOwner) continue;
		const maxHp = Number(a.system?.hp?.max) || 0;
		if (maxHp > 0 && (Number(a.system?.hp?.value) || 0) < maxHp) {
			await a.update?.({ "system.hp.value": maxHp });
			healed++;
		}
		if (clearConditions) {
			for (const cid of CONDITION_IDS) if (a.statuses?.has?.(cid)) await a.toggleStatusEffect(cid, { active: false });
		}
	}
	return healed;
}

async function postCpEffectCard(actor, title, bodyHtml, { allowAutoScan = false, extraFlags = {} } = {}) {
	const uuidAttr = allowAutoScan && actor?.uuid ? ` data-uuid="${escHtml(actor.uuid)}"` : "";
	const content = `<div class="card clipped-bot"${uuidAttr} style="margin:0"><div class="lancer-header lancer-primary">// ${escHtml(title)} //</div><div class="effect-text">${bodyHtml}</div></div>`;
	return globalThis.ChatMessage?.create?.({
		speaker: globalThis.ChatMessage?.getSpeaker?.({ actor }) ?? {},
		content,
		flags: { [MODULE_ID]: { ...(allowAutoScan ? {} : { skipAutoScan: true }), ...extraFlags } },
	});
}

async function rollQuickCpDamage(actor, title, damage, { ap = false, paracausal = false } = {}) {
	const Cls = game.lancer?.flows?.get?.("DamageRollFlow");
	if (!Cls || !actor?.uuid) {
		await postCpEffectCard(actor, title, `<p>伤害：<b>${damage.map(d => `${d.val} ${translate(d.type) ?? d.type}`).join(" + ")}${ap ? " AP" : ""}${paracausal ? "（不可减免）" : ""}</b></p>`);
		return true;
	}
	const hit_results = Array.from(game.user?.targets ?? []).map(tok => ({ target: tok, total: 20, usedLockOn: false, hit: true, crit: false }));
	const flow = new Cls(actor.uuid, {
		title, configurable: true, invade: false, ap: Boolean(ap), paracausal: Boolean(paracausal),
		hit_results, has_normal_hit: true, has_crit_hit: false,
		damage: damage.map(d => ({ ...d })), bonus_damage: [],
	});
	return flow.begin();
}

// 牛头怪「迷宫」：自动施加晕眩，并在每回合结束提供初始 +3 难度、每次失败递减 1 难度的系统豁免卡
function formatMazeModifier(netDiff) {
	const n = Number(netDiff) || 0;
	if (n > 0) return `+${n} 难度`;
	if (n < 0) return `+${Math.abs(n)} 准度`;
	return "无加减值";
}

async function createMazeCard(minotaurActor, targetTokenOrUuid) {
	const tDoc = typeof targetTokenOrUuid === "string" ? resolveDocSync(targetTokenOrUuid) : targetTokenOrUuid;
	const tUuid = typeof targetTokenOrUuid === "string" ? targetTokenOrUuid : (tDoc?.document?.uuid ?? tDoc?.uuid ?? tDoc?.actor?.uuid);
	const tActor = tDoc?.actor ?? resolveActor(tUuid);
	if (!tUuid || !tActor) {
		ui?.notifications?.warn?.("请先锁定感应范围内的一个敌方角色再发动「迷宫」。");
		return null;
	}
	const minotaurName = minotaurActor?.token?.name ?? minotaurActor?.name ?? "牛头怪";
	const targetName = tDoc?.name ?? tActor?.token?.name ?? tActor?.name ?? "目标";
	const dc = Number(minotaurActor?.system?.save) || 10;
	await setActorStatus(tUuid, "stunned", true);
	const content = `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 超空间翘曲迷宫 → ${escHtml(targetName)} //</div><div class="effect-text"><p><b>${escHtml(targetName)}</b> 已被抛入信息陷阱并陷入<b>晕眩</b>！在其每回合结束时可进行一次<b>系统豁免（DC ${dc}）</b>，首次承受 <b>+3 难度</b>，每次失败后累加 <b>+1 准度</b>，直至成功解除晕眩。</p></div></div>`;
	return ChatMessage.create?.({
		speaker: ChatMessage.getSpeaker?.({ actor: minotaurActor }) ?? {},
		content,
		flags: {
			[MODULE_ID]: {
				skipAutoScan: true,
				mazeState: {
					active: true,
					minotaurUuid: preferredTargetUuid(minotaurActor) ?? minotaurActor?.uuid ?? null,
					minotaurName,
					targetUuid: tUuid,
					targetName,
					dc,
					netDiff: 3,
					attempts: 0,
				},
			},
		},
	});
}

async function attemptMazeSave(mazeMessage) {
	const ms = getObjectFlag(mazeMessage, "mazeState");
	if (!ms.active) return null;
	const tActor = resolveActor(ms.targetUuid);
	if (!tActor || !(tActor.isOwner || game.user?.isGM)) {
		ui?.notifications?.warn?.(`请由 ${ms.targetName} 的拥有者或 GM 进行迷宫系统豁免。`);
		return null;
	}
	const netDiff = Number(ms.netDiff) ?? 3;
	const modLabel = formatMazeModifier(netDiff);
	const title = `迷宫逃脱 // 系统豁免（DC ${ms.dc} · ${modLabel}）`;
	let total = null;
	const StatCls = game.lancer?.flows?.get?.("StatRollFlow");
	if (StatCls) {
		tActor._lancerCnMazeNetDiff = netDiff;
		try {
			const flow = new StatCls(tActor.uuid ?? ms.targetUuid, { title, path: "system.sys" });
			const ok = await flow.begin({ ...flow.state?.data, title, path: "system.sys" });
			if (!ok) return null;
			total = Number(flow.state?.data?.result?.roll?.total);
		} finally {
			delete tActor._lancerCnMazeNetDiff;
		}
	}
	if (!Number.isFinite(total)) {
		const sys = Number(tActor.system?.sys) || 0;
		const formula = netDiff > 0
			? `1d20 + ${sys} - ${netDiff}d6kh1`
			: netDiff < 0
				? `1d20 + ${sys} + ${Math.abs(netDiff)}d6kh1`
				: `1d20 + ${sys}`;
		const roll = await new Roll(formula).evaluate();
		total = Number(roll.total);
	}
	const passed = total >= ms.dc;
	const nextState = passed
		? { ...ms, active: false, attempts: (Number(ms.attempts) || 0) + 1, lastTotal: total, passed: true }
		: { ...ms, active: true, attempts: (Number(ms.attempts) || 0) + 1, netDiff: netDiff - 1, lastTotal: total, passed: false };
	if (passed) await setActorStatus(ms.targetUuid, "stunned", false);
	await updateMessageFlagCompat(mazeMessage, "mazeState", nextState);
	const outcome = passed
		? `<b style="color:#2e7d32">逃脱成功</b>（解除晕眩）`
		: `<b style="color:#c62828">逃脱失败</b>（下次修正变为 <b>${escHtml(formatMazeModifier(nextState.netDiff))}</b>）`;
	await postCpEffectCard(tActor, "迷宫系统豁免结果", `<p><b>${escHtml(ms.targetName)}</b> · 系统豁免（${escHtml(modLabel)}）：<b>${total}</b> vs DC ${ms.dc} → ${outcome}</p>`);
	return nextState;
}

function renderMazeRowHTML(ms, canRoll) {
	if (!ms.active) {
		return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)"><span style="color:#2e7d32;font-weight:bold">${escHtml(ms.targetName)} 已成功逃离迷宫（共尝试 ${ms.attempts ?? 1} 次，末次 ${ms.lastTotal ?? "-"} vs DC ${ms.dc}）</span></div>`;
	}
	const mod = formatMazeModifier(ms.netDiff);
	const lastInfo = ms.attempts ? `<span style="opacity:.75">上次：${ms.lastTotal}✗ · </span>` : "";
	if (!canRoll) {
		return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${lastInfo}<span>等待 <b>${escHtml(ms.targetName)}</b> 回合结束进行系统豁免（当前：<b>${escHtml(mod)}</b>）</span></div>`;
	}
	return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${lastInfo}<button type="button" data-lancer-cn-maze-save="1" style="${BTN_INLINE_STYLE}">🎲 ${escHtml(ms.targetName)} 回合结束系统豁免（DC ${ms.dc} · ${escHtml(mod)}）</button><button type="button" data-lancer-cn-maze-end="1" style="${BTN_INLINE_STYLE}">✕ 结束迷宫</button></div>`;
}

// 各机甲核心协议配置表（未列出的机甲仍自动接入 consumeCorePower、高效返还、通用非攻击卡豁免/伤害/范围模板自动化）
const CP_PROFILES = {
	mf_standard_pattern_i_everest: {
		label: "增强出力",
		hint: "全攻击 / 检定 / 豁免自动 +1 准度",
		buttons: [{ act: "freeBoost", label: "🚀 免费推进（1/回合）" }],
	},
	mf_chomolungma: {
		label: "广域编码脉冲",
		instant: true,
		buttons: [{ act: "chomolungmaPulse", label: "⚡ 发动广域编码脉冲（无视隐形 · 未中受损）" }],
	},
	mf_sagarmatha: {
		label: "扬起旗帜",
		hint: "受旗盟友全抗性 + 检定/豁免自动 +1 准度",
		buttons: [
			{ act: "sagarmathaBind", label: "🚩 赋予锁定盟友战旗增益" },
			{ act: "deactivate", label: "✕ 结束战旗" },
		],
	},
	mf_drake: {
		label: "堡垒协议",
		selfStatuses: ["immobilized", "cover_hard"],
		cleanupStatuses: ["immobilized", "cover_hard"],
		buttons: [{ act: "deactivate", label: "🏰 关闭堡垒（快速动作）" }],
	},
	mf_lancaster: {
		label: "增压器",
		hint: "绑定盟友攻击/检定/豁免 +1 准度，兰开斯特回合开始盟友 +1 热度",
		buttons: [
			{ act: "lancasterBind", label: "🔗 绑定锁定盟友" },
			{ act: "deactivate", label: "✕ 断开增压器" },
		],
	},
	mf_raleigh: {
		label: "雷神",
		counter: { init: 0, max: 6, label: "雷神弹仓" },
		buttons: [
			{ act: "raleighLoad2", label: "➕ 装填 +2 发" },
			{ act: "counterDelta:1", label: "+1" },
			{ act: "counterDelta:-1", label: "-1" },
			{ act: "raleighFire", label: "🔫 发射雷神（每发4伤 · 4+发穿甲离散）" },
		],
	},
	mf_tortuga: {
		label: "伯劳鸟超速",
		suppressGenericSelfAuto: true,
		buttons: [
			{ act: "shrike3", label: "⚡ 伯劳装甲反伤（3 AP 动能）" },
			{ act: "toggleAllResist", label: "🛡 切换射程3全抗性" },
		],
	},
	mf_vlad: {
		label: "折磨风暴",
		suppressGenericSelfAuto: true,
		buttons: [
			{ act: "shrike3", label: "🩸 尖刺反伤（3 AP 动能）" },
			{ act: "toggleAllResist", label: "🛡 切换射程3全抗性" },
		],
	},
	mf_caliban: {
		label: "自动锁喉",
		hint: "剥皮者霰弹枪已切为锥形3 精准 击退5 模式",
		buttons: [{ act: "fireIntegrated:mw_caliban_integrated", label: "🔫 发射剥皮者（自动锁喉）" }],
	},
	mf_zheng: {
		label: "晓之奥义",
		counter: { init: 6, max: 6, label: "晓之拳劲" },
		buttons: [{ act: "zhengPunch", label: "👊 消耗 1 拳劲（推进3 + 近身轰击）" }],
	},
	mf_Empakaai_alt_blackbeard: {
		label: "骨髓之锚",
		hint: "擒拿体型自动视为比目标大 1",
		buttons: [
			{ act: "empakaaiHand", label: "✊ 冥海伊库之手（自由擒拿）" },
			{ act: "empakaaiConduit", label: "🔥 催化导流器（[当前热度] AP 能量）" },
		],
	},
	mf_lancaster_alt_taraxacum: {
		label: "全频谱传感器爆发",
		instant: true,
		buttons: [
			{ act: "placeBurst3", label: "📡 爆发3模板" },
			{ act: "lockTargets", label: "🎯 对锁定目标施加锁定" },
		],
	},
	"mf_störtebeker": {
		label: "真银武库",
		counter: { init: 3, max: 3, label: "真银额外次数" },
		buttons: [{ act: "counterDelta:-1", label: "✨ 消耗 1 次真银" }],
	},
	mf_black_witch: {
		label: "磁场",
		counter: { init: 0, max: 6, label: "拦下投射物" },
		buttons: [
			{ act: "counterDelta:1", label: "➕ 记 1 次挡下远程 (+1)" },
			{ act: "blackWitchCollapse", label: "💥 磁场坍缩反击（[N]d6 动能）" },
		],
	},
	mf_black_witch_alt_orchidea: {
		label: "氦神",
		instant: true,
		buttons: [
			{ act: "orchideaRam", label: "🛡 氦神必中冲撞（伏卧+击退3）" },
			{ act: "orchideaFalcon", label: "🦅 猎鹰追击（3 动能+禁反应）" },
		],
	},
	mf_deaths_head: {
		label: "神经分流",
		hint: "专注死印期间远程无掩护 >5 格会心自动追加 1d6/2d6/3d6",
		buttons: [
			{ act: "deathsHeadMark", label: "🎯 死印专注（目标 >5 格 + 自身固定）" },
			{ act: "deathsHeadUnmark", label: "✕ 停止专注（协定）" },
		],
	},
	mf_dusk_wing: {
		label: "镜厅",
		buttons: [{ act: "duskWingBurst", label: "✨ 全息残影引爆（爆发1 · 敏捷豁免减半 · 1d6 能量）" }],
	},
	mf_metalmark: {
		label: "战术斗篷",
		selfStatuses: ["invisible"],
		cleanupStatuses: ["invisible"],
	},
	mf_swallowtail: {
		label: "先知叹息",
		buttons: [{ act: "swallowtailSim", label: "🎲 战术模拟反应（掷 1d6）" }],
	},
	mf_atlas: {
		label: "最终狩猎",
		selfStatuses: ["cover_soft"],
		cleanupStatuses: ["cover_soft"],
		buttons: [{ act: "atlasTrip", label: "⚔ 狩猎触发（迫使机体豁免→伏卧）" }],
	},
	mf_white_witch: {
		label: "超激活模式",
		counter: { init: 0, max: 12, label: "铁磁反应装甲" },
		buttons: [
			{ act: "whiteWitchGain2", label: "🛡 受击叠甲 (+2 护甲 + 爆发1 1 AP动能)" },
			{ act: "whiteWitchBurst", label: "💥 满层爆发（爆发2 · 敏捷豁免减半）" },
		],
	},
	mf_emperor: {
		label: "统御矩阵",
		buttons: [
			{ act: "emperorArc", label: "⚡ 惩戒电弧（2 AP 能量）" },
			{ act: "emperorShield", label: "🛡 赐予帝国护盾（+2 护盾）" },
		],
	},
	mf_ext_oleander: {
		label: "全系统已上线！开火！",
		hint: "本回合重型远程：18+ 会心、会心不可减免且伏卧、开火清 2 热度",
	},
	mf_ext_night_cutter: {
		label: "完美射击",
		hint: "下次步枪消耗锁定攻击自动获可靠3+不可减免；未中自动受损",
	},
	mf_ext_jouken: {
		label: "亲和力中断",
		instant: true,
		buttons: [{ act: "joukenInterrupt", label: "⚔ 亲和之锋中断（18+ 会心 · 未命中返还 CP）" }],
	},
	mf_micro_monarch: {
		label: "天堂倾雨",
		instant: true,
		buttons: [{ act: "microMonarchLockFail", label: "🔒 消耗目标锁定 → 自动豁免失败（伏卧）" }],
	},
	mf_balor: {
		label: "虫巢狂乱",
		selfStatuses: ["cover_soft", "shredded"],
		cleanupStatuses: ["cover_soft", "shredded"],
		hint: "持续期间离散不可被稳住阵脚或回合结束解除",
		buttons: [
			{ act: "balorRegen", label: "💚 再生 1/2 总 HP" },
			{ act: "balorReconstitute", label: "🎲 地狱重组（掷 1d6，6 免结构回 1 HP）" },
			{ act: "balorSwarm", label: "🦟 洗涤虫群（4 动能）" },
		],
	},
	mf_balor_alt_hecatoncheires: {
		label: "狂暴虫群",
		instant: true,
		buttons: [{ act: "hecatonBurn", label: "🔥 狂暴虫群（4 燃烧伤害）" }],
	},
	mf_goblin: {
		label: "共生",
		selfStatuses: ["cover_hard"],
		cleanupStatuses: ["cover_hard"],
		hint: "附着期间禁止超频",
		buttons: [{ act: "deactivate", label: "✕ 脱离宿主（快速动作）" }],
	},
	mf_gorgon: {
		label: "排出蛇怪",
		buttons: [{ act: "gorgonGaze", label: "🐍 蛇怪反认知凝视（系统豁免→晕眩）" }],
	},
	mf_manticore: {
		label: "拉之仇敌圣殿的破灭",
		selfStatuses: ["resistance_heat"],
		cleanupStatuses: ["resistance_heat"],
		counter: { init: 1, max: 6, label: "充能骰" },
		buttons: [
			{ act: "counterDelta:1", label: "➕ 充能骰 +1" },
			{ act: "manticoreBlast", label: "💥 释放 6d6 AP 能量爆发（爆发2 · 工程豁免减半）" },
			{ act: "deactivate", label: "✕ 自由动作关闭" },
		],
	},
	mf_minotaur: {
		label: "迷宫",
		instant: true,
		buttons: [{ act: "minotaurMaze", label: "🌀 对锁定目标施放迷宫（晕眩 + 递减难度豁免）" }],
	},
	mf_minotaur_alt_wraith: {
		label: "度不均之心",
		instant: true,
		buttons: [{ act: "wraithIntangible", label: "👻 对锁定的 2 名角色施加无形" }],
	},
	mf_pegasus: {
		label: "释放巫沙布提",
		counter: { init: 3, max: 3, label: "本轮万物枪" },
		buttons: [{ act: "pegasusOmnigun", label: "🔫 发射万物枪（1 AP 不可减免动能）" }],
	},
	mf_lycan: {
		label: "狼嚎",
		hint: "基础护甲→0、基础速度→6（保留核心奖励与敏捷加成）",
		buttons: [
			{ act: "lycanProfile:0", label: "爪：标准 (3d6+6)" },
			{ act: "lycanProfile:1", label: "爪：威胁2" },
			{ act: "lycanProfile:2", label: "爪：毁坏 (4d6+6)" },
			{ act: "fireIntegrated:mw_integrated_shock_claws", label: "🐾 电震利爪冲锋" },
		],
	},
	mf_ext_chimera: {
		label: "掠食追猎者",
		instant: true,
		buttons: [{ act: "fireIntegrated:mw_ext_chimera_claw", label: "🦅 魔爪无人机攻击" }],
	},
	mf_barbarossa: {
		label: "导轨充能",
		counter: { init: 4, max: 4, label: "末日骰" },
		hint: "回合开始自动 -1；受扰/晕眩自动重置为 4；未开火在场景结束返还 1 CP",
		buttons: [
			{ act: "barbarossaReset", label: "↺ 移动重置末日骰 → 4" },
			{ act: "fireIntegrated:mw_barbarossa_integrated", label: "☄ 发射末日导轨" },
		],
	},
	mf_genghis: {
		label: "暴露能量电池",
		hint: "下次超过热度上限时自动免过热、热度归零并排出爆发3燃烧云",
		buttons: [{ act: "genghisManualVent", label: "🔥 手动触发排热云" }],
	},
	mf_genghis_alt_worldkiller_genghis_mk_i: {
		label: "纵火之乐",
		hint: "过热时自动触发爆发2 1d6 AP 能量 + 机体豁免固定",
	},
	mf_iskander: {
		label: "死亡之云",
		buttons: [{ act: "iskanderMine", label: "💣 非常规移动触发（3 AP 爆炸伤害）" }],
	},
	mf_napoleon: {
		label: "真黑神盾",
		hint: "可减免伤害自动压至 1，禁止超频",
	},
	mf_saladin: {
		label: "迅子护盾",
		buttons: [{ act: "saladinPulse", label: "🛡 防御脉冲（赋予锁定友军全抗性）" }],
	},
	mf_sherman: {
		label: "堆芯烧毁协定",
		counter: { init: 4, max: 4, label: "ZF4 充能" },
		hint: "立即 +3 充能并同步堆芯档位；稳住阵脚改为 +2 充能",
		buttons: [{ act: "fireIntegrated:mw_sherman_integrated", label: "🔥 发射 ZF4 固态堆芯" }],
	},
	mf_sherman_alt_tagetes: {
		label: "万寿菊冷却",
		instant: true,
		buttons: [{ act: "tagetesCool", label: "❄ 冷却 1d3+1 热度" }],
	},
	mf_sunzi: {
		label: "兵法",
		counter: { init: 6, max: 6, label: "闪烁次数" },
		buttons: [{ act: "counterDelta:-1", label: "✨ 消耗 1 次空间闪烁（传送2格）" }],
	},
	mf_tokugawa: {
		label: "辉光",
		hint: "已激活 system.core_active：能量武器自动射程+5 / 威胁+2",
	},
	mf_tokugawa_alt_enkidu: {
		label: "四肢撕裂",
		hint: "未以此处决摧毁敌人则在场景结束自动返还 1 CP",
		buttons: [{ act: "enkiduBifurcate", label: "🩸 一刀两断处决判定" }],
	},
	mf_gilgamesh: {
		label: "外骨骼扩容",
		instant: true,
		hint: "已自动清除全部状况/暴露/伏卧并获得 毅力+4 护盾",
	},
	mf_ext_kanggeduo: {
		label: "康格多机动",
		buttons: [{ act: "freeBoost", label: "🚀 免费推进" }],
	},
	mf_ext_mitchell: {
		label: "聚焦火力",
		hint: "持续期间远程武器命中自动施加离散",
	},
	mf_ext_agrippa: {
		label: "纳米机器人云",
		buttons: [{ act: "agrippaRepairAlly", label: "🔧 消耗 1 维修 → 盟友满血+清燃烧+清状况" }],
	},
	mf_ext_comet_moth: {
		label: "神圣指引",
		instant: true,
		buttons: [{ act: "cometMothAll", label: "🌟 全场友军强化 + 全场敌军锁定" }],
	},
	mf_ext_grant: {
		label: "绝对零度",
		counter: { init: 1, max: 4, label: "冻结骰" },
		buttons: [
			{ act: "counterDelta:1", label: "➕ 冻结骰 +1" },
			{ act: "grantSpend", label: "❄ 消耗冻结骰赋予热度抗性" },
		],
	},
	mf_ext_tametomo: {
		label: "堆芯过载",
		counter: { init: 4, max: 4, label: "泄漏层数" },
		buttons: [
			{ act: "counterDelta:-1", label: "⚡ 消耗 1 层泄漏" },
			{ act: "tametomoBurst", label: "💥 爆发2（2d6 能量伤害）" },
		],
	},
	mf_ext_pharos: {
		label: "灯塔升空",
		selfStatuses: ["flying"],
		cleanupStatuses: ["flying"],
		buttons: [{ act: "pharosRoll", label: "🎲 反冲测微计（掷 1d6）" }],
	},
	mf_ext_hubble: {
		label: "太阳耀斑",
		buttons: [{ act: "hubbleFlare", label: "☀ 太阳耀斑（爆发2 · 4 燃烧）" }],
	},
	mf_ext_spectre: {
		label: "幽冥处刑",
		buttons: [{ act: "spectreCurse", label: "👻 对锁定目标造成 3 燃烧 + 受损" }],
	},
	mf_ext_feathered_serpent: {
		label: "天体风暴",
		buttons: [{ act: "serpentStorm", label: "⚡ 造成 2 热度 + 系统豁免（失败受扰）" }],
	},
	mf_ch_retiarius: {
		label: "深海网缚",
		buttons: [{ act: "retiariusNet", label: "🕸 对锁定目标施加固定" }],
	},
	mf_ext_retiarius: {
		label: "深海网缚",
		buttons: [{ act: "retiariusNet", label: "🕸 对锁定目标施加固定" }],
	},
	mf_ext_ornithoptera: {
		label: "命途纺锤",
		counter: { init: 0, max: 3, label: "丝线标记" },
		buttons: [
			{ act: "counterDelta:1", label: "➕ 丝线 +1" },
			{ act: "counterDelta:-1", label: "➖ 丝线 -1" },
		],
	},
	mf_ch_pemada: {
		label: "辅助战斗知觉",
		hint: "针对本机的远程攻击无法从净准度中获益（自动压回 0）",
		buttons: [{ act: "shrike3", label: "🔫 精确反击（3 AP 动能）" }],
	},
	mf_ch_pesilat: {
		label: "破甲寸劲",
		hint: "权宜攻击自动获得穿甲（AP）",
	},
	mf_ch_gajeshura: {
		label: "恶魔狂怒",
		instant: true,
		buttons: [{ act: "fireIntegrated:mw_ch_demons_fang", label: "⚔ 恶魔之牙免费攻击" }],
	},
	mf_ch_callista: {
		label: "女武神降临",
		hint: "已回满 HP 并清除全部状况",
		buttons: [{ act: "callistaRepairStruct", label: "🔧 消耗 1 维修 → +1 结构 & 近战强化" }],
	},
	mf_ext_wodeng: {
		label: "诸神黄昏",
		buttons: [{ act: "wodengBarrage", label: "🔥 燃烧 1 点压力 → 免费弹幕" }],
	},
	mf_ch_wodeng: {
		label: "诸神黄昏",
		buttons: [{ act: "wodengBarrage", label: "🔥 燃烧 1 点压力 → 免费弹幕" }],
	},
	mf_ch_sagittarius: {
		label: "星矢箭袋",
		buttons: [
			{ act: "sagittariusAmmo:star", label: "🏹 穿星弹" },
			{ act: "sagittariusAmmo:void", label: "🏹 碎空弹" },
			{ act: "sagittariusAmmo:gravity", label: "🏹 引星弹" },
		],
	},
	mf_ch_matador: {
		label: "红布挑衅",
		selfStatuses: ["slow"],
		cleanupStatuses: ["slow"],
		buttons: [
			{ act: "matadorExtend:1d3", label: "🔥 维持第1轮 (+1d3 热度)" },
			{ act: "matadorExtend:1d6", label: "🔥 维持第2轮 (+1d6 热度)" },
			{ act: "matadorExtend:1d6+4", label: "🔥 维持第3轮+ (+1d6+4 热度)" },
			{ act: "deactivate", label: "✕ 结束姿态" },
		],
	},
	mf_kkca_tizona: {
		label: "督军敕令",
		buttons: [{ act: "tizonaHeat", label: "🔥 承受 1 热度 → 额外督军触发" }],
	},
	mf_ch_tizona: {
		label: "督军敕令",
		buttons: [{ act: "tizonaHeat", label: "🔥 承受 1 热度 → 额外督军触发" }],
	},
	mf_kkca_wondrous_sword: {
		label: "剑气护体",
		buttons: [{ act: "wondrousShield", label: "🛡 凝剑护盾（+3 护盾，上限 9）" }],
	},
	mf_kkca_emerald_scimitar: {
		label: "翠风之舞",
		counter: { init: 3, max: 5, label: "翠风层数" },
		buttons: [
			{ act: "counterDelta:1", label: "➕ 翠风 +1" },
			{ act: "counterDelta:-1", label: "➖ 翠风 -1" },
		],
	},
	mf_piof_pepper: {
		label: "静电电弧",
		buttons: [{ act: "pepperZap", label: "⚡ 电弧溅射（2 能量伤害）" }],
	},
	mf_piof_lemongrass: {
		label: "离子风暴",
		counter: { init: 4, max: 12, label: "离子充能" },
		buttons: [{ act: "lemongrassDischarge", label: "⚡ 消耗 2 充能（溅射2 · 1 AP 能量 + 受损）" }],
	},
	mf_piof_basil: {
		label: "净化芳疗",
		buttons: [{ act: "basilCleanse", label: "🌿 净化锁定盟友（清除状况）" }],
	},
};

async function activateCorePower(actor) {
	if (!actor || (actor.type !== "mech" && !actor.is_mech?.())) return null;
	const lid = mechFrameLid(actor);
	const prof = CP_PROFILES[lid] ?? {};
	const efficient = isEfficientCore(actor);
	let pendingRefund = efficient ? "efficient" : null;
	if (!pendingRefund && lid === "mf_barbarossa") pendingRefund = "barbarossa";
	if (!pendingRefund && lid === "mf_tokugawa_alt_enkidu") pendingRefund = "enkidu";

	const statePatch = {
		active: !prof.instant,
		frameLid: lid,
		efficient,
		pendingRefund,
		counterValue: prof.counter ? prof.counter.init : null,
		counterMax: prof.counter ? prof.counter.max : null,
		counterLabel: prof.counter ? prof.counter.label : null,
		latchTargetUuid: null,
		bannerTargetUuids: [],
		markTargetUuid: null,
		apocalypseFired: false,
		enkiduDestroyedAny: false,
		tbkArmed: lid === "mf_genghis",
		perfectShotArmed: lid === "mf_ext_night_cutter",
		sagittariusUsed: {},
		lastHeat: Number(actor.system?.heat?.value) || 0,
	};

	const actorPatch = { "system.core_energy": 0, "system.core_active": !prof.instant };

	// 吉尔伽美什「外骨骼扩容」：清除全部状况、暴露与伏卧，并获得 毅力+4 护盾
	if (lid === "mf_gilgamesh") {
		const grit = Number(actor.system?.grit ?? actor.system?.pilot?.value?.system?.grit) || 0;
		const curOs = Number(actor.system?.overshield?.value) || 0;
		actorPatch["system.overshield.value"] = Math.max(curOs, grit + 4);
		for (const id of [...CONDITION_IDS, "exposed", "prone"]) {
			if (actor.statuses?.has?.(id)) await actor.toggleStatusEffect(id, { active: false });
		}
	}

	// 卡莉斯塔「女武神降临」：回满 HP 并清除全部状况
	if (lid === "mf_ch_callista") {
		const maxHp = Number(actor.system?.hp?.max) || 0;
		if (maxHp > 0) actorPatch["system.hp.value"] = maxHp;
		for (const id of CONDITION_IDS) {
			if (actor.statuses?.has?.(id)) await actor.toggleStatusEffect(id, { active: false });
		}
	}

	// 拿破仑「真黑神盾」：清除锁定与强化等现有科技状态，尝试点亮可选的 trueblack 图标
	if (lid === "mf_napoleon") {
		for (const id of ["lockon", "bolster"]) {
			if (actor.statuses?.has?.(id)) await actor.toggleStatusEffect(id, { active: false });
		}
		await setActorStatus(actor, "trueblack", true);
	}

	await actor.update?.(actorPatch);
	await setCoreState(actor, statePatch);

	// 狼人「狼嚎」：以 priority 15 覆写基础护甲=0、基础速度=6（保留核心奖励 20 与驾驶员敏捷 30）；结构 <= 2 时自动切为毁坏利爪
	if (lid === "mf_lycan") {
		const OVERRIDE_MODE = globalThis.CONST?.ACTIVE_EFFECT_MODES?.OVERRIDE ?? 5;
		await syncCpActiveEffect(actor, "lycan_howl", "狼嚎（基础装甲0 / 基础速度6）", [
			{ key: "system.armor", mode: OVERRIDE_MODE, value: "0", priority: 15 },
			{ key: "system.speed", mode: OVERRIDE_MODE, value: "6", priority: 15 },
		]);
		const remStruct = Number(actor.system?.structure?.value) ?? 4;
		await setWeaponProfile(actor, "mw_integrated_shock_claws", remStruct <= 2 ? 2 : 0);
	}

	// 卡利班「自动锁喉」：切换剥皮者霰弹枪至核心能力档位（profile 1）
	if (lid === "mf_caliban") {
		await setWeaponProfile(actor, "mw_caliban_integrated", 1);
	}

	// 谢尔曼「堆芯烧毁协定」：立即 +3 充能（最高 4）并同步 ZF4 档位
	if (lid === "mf_sherman") {
		const nextZf4 = Math.min(4, currentShermanZf4(actor) + 3);
		await syncShermanZf4(actor, nextZf4);
	}

	// 巴巴罗萨「导轨充能」：初始化末日骰 = 4（档位 0：无法发射）
	if (lid === "mf_barbarossa") {
		await syncBarbarossaRail(actor, 4, { apocalypseFired: false });
	}

	// 白巫蛾「超激活模式」：初始化 0 层铁磁反应装甲
	if (lid === "mf_white_witch") {
		await syncWhiteWitchArmor(actor, 0);
	}

	// 兰开斯特「增压器」：若已锁定友方机甲则自动绑定
	if (lid === "mf_lancaster") {
		const t = [...(game.user?.targets ?? [])][0];
		if (t) {
			const tUuid = t.document?.uuid ?? t.uuid;
			await setCoreState(actor, { latchTargetUuid: tUuid, latchTargetName: t.name ?? t.actor?.name ?? "盟友" });
		}
	}

	// 萨加玛塔「扬起旗帜」：若已锁定盟友则立即赋予全抗性并记录 +1 准度名单
	if (lid === "mf_sagarmatha") {
		const targets = [...(game.user?.targets ?? [])];
		if (targets.length) {
			const uuids = [];
			for (const t of targets) {
				const u = t.document?.uuid ?? t.uuid;
				if (!u) continue;
				uuids.push(u);
				for (const rid of RESIST_IDS) await setActorStatus(u, rid, true);
			}
			if (uuids.length) await setCoreState(actor, { bannerTargetUuids: uuids });
		}
	}

	// 牛头怪「迷宫」：若启动时已锁定目标，自动生成迷宫卡并施加晕眩
	if (lid === "mf_minotaur") {
		const t = [...(game.user?.targets ?? [])][0];
		if (t) await createMazeCard(actor, t);
	}

	// 镰翼 / 阿格里帕 / 茴香：自动修复并回满己方部署在场上的无人机
	if (lid === "mf_ext_sicklewing" || lid === "mf_ext_agrippa" || lid === "mf_piof_fennel") {
		await healSceneDrones(actor, { clearConditions: lid === "mf_piof_fennel" });
	}

	return getCoreState(actor);
}

// 场景中途关闭持续核心效果（保留 pendingRefund 以便场景结束时仍结算高效返还）
async function deactivateCoreEffect(actor, reason = "结束持续效果") {
	if (!actor) return false;
	const cs = getCoreState(actor);
	const lid = cs.frameLid || mechFrameLid(actor);
	const prof = CP_PROFILES[lid] ?? {};

	// 萨加玛塔结束战旗时移除受旗盟友的五种抗性
	if (lid === "mf_sagarmatha" && cs.bannerTargetUuids?.length) {
		for (const u of cs.bannerTargetUuids) {
			for (const rid of RESIST_IDS) await setActorStatus(u, rid, false);
		}
	}
	// 鬼面蛾停止专注时移除自身固定（除非被擒拿固定）
	if (lid === "mf_deaths_head" && cs.markTargetUuid && !isGrappleImmobilized(actor)) {
		await setActorStatus(actor, "immobilized", false);
	}
	// 拿破仑移除可选 trueblack 状态
	if (lid === "mf_napoleon") {
		await setActorStatus(actor, "trueblack", false);
	}
	for (const st of prof.cleanupStatuses ?? []) {
		if (st === "immobilized" && isGrappleImmobilized(actor)) continue;
		await setActorStatus(actor, st, false);
	}
	if (lid === "mf_caliban") await setWeaponProfile(actor, "mw_caliban_integrated", 0);
	if (lid === "mf_barbarossa") await setWeaponProfile(actor, "mw_barbarossa_integrated", 0);
	await clearCpActiveEffects(actor);
	if (actor.system?.core_active) await actor.update?.({ "system.core_active": false });
	await setCoreState(actor, {
		active: false,
		latchTargetUuid: null,
		bannerTargetUuids: [],
		markTargetUuid: null,
		tbkArmed: false,
		perfectShotArmed: false,
		endedReason: reason,
	});
	return true;
}

// 场景结束或全面维修结算：关闭持续效果，并按高效 / 巴巴罗萨未开火 / 恩奇都未处决规则返还 1 CP
async function endCorePower(actor, { reason = "场景结束", refundOverride = null } = {}) {
	if (!actor || (actor.type !== "mech" && !actor.is_mech?.())) return { refunded: false };
	const cs = getCoreState(actor);
	const hasAny = Boolean(actor.system?.core_active || cs.active || cs.pendingRefund);
	if (!hasAny && refundOverride !== true) return { refunded: false };

	let shouldRefund = false;
	if (typeof refundOverride === "boolean") {
		shouldRefund = refundOverride;
	} else if (cs.pendingRefund === "efficient") {
		shouldRefund = true;
	} else if (cs.pendingRefund === "barbarossa") {
		shouldRefund = !cs.apocalypseFired;
	} else if (cs.pendingRefund === "enkidu") {
		shouldRefund = !cs.enkiduDestroyedAny;
	}

	await deactivateCoreEffect(actor, reason);
	if (shouldRefund && (Number(actor.system?.core_energy) || 0) < 1) {
		await actor.update?.({ "system.core_energy": 1 });
	}
	if (actor.unsetFlag) await actor.unsetFlag(MODULE_ID, "coreState");
	else await setCoreState(actor, { active: false, pendingRefund: null });
	return { refunded: shouldRefund };
}

async function resetSceneTalentState(mech) {
	if (!mech) return;
	for (const [key, def] of Object.entries(TALENT_DICE_DEFS)) {
		if (!def.resetScene) continue;
		const r = hasDieQualification(mech, def);
		if (r) await setTalentDie(mech, key, def.init(r));
	}
	const cs = getCombatState(mech);
	const keep = {};
	if (Array.isArray(cs.mimicValues)) keep.mimicValues = cs.mimicValues;
	if (Number.isFinite(Number(cs.osirisGate))) keep.osirisGate = cs.osirisGate;
	if (mech.setFlag) await mech.setFlag(MODULE_ID, "combatState", keep);
	await retrieveThrownWeapon(mech, "all", { notify: false });
}

async function resetFullRepairTalentState(mech) {
	if (!mech) return;
	for (const [key, def] of Object.entries(TALENT_DICE_DEFS)) {
		if (!def.resetFull) continue;
		const r = hasDieQualification(mech, def);
		if (r) await setTalentDie(mech, key, def.init(r));
	}
	for (const ci of mech.items ?? []) {
		if (ci?.system?.cascading === true) {
			if (typeof ci.update === "function") await ci.update({ "system.cascading": false });
			else if (ci.system) ci.system.cascading = false;
		}
	}
	if (mech.unsetFlag) await mech.unsetFlag(MODULE_ID, "combatState");
	else await setCombatState(mech, { osirisGate: 1, cascadingTalentNhps: [] });
	await retrieveThrownWeapon(mech, "all", { notify: false });
}

async function resetNpcCombatState(npc) {
	if (!npc) return;
	await clearCpActiveEffects(npc);
	if (npc.unsetFlag) await npc.unsetFlag(MODULE_ID, "combatState");
	else if (npc.setFlag) await npc.setFlag(MODULE_ID, "combatState", {});
	await retrieveThrownWeapon(npc, "all", { notify: false });
}

async function onDeleteCombat(combat) {
	// 仅对真正已开打的战斗（round > 0 或 started === true）结算场景结束；在侧栏删除尚未开打的预设遭遇时不误清场上机甲的核心协议与天赋骰
	if (combat && combat.started === false && !(Number(combat.round) > 0)) return [];
	const mechs = new Set();
	const npcs = new Set();
	const combatants = Array.from(combat?.combatants ?? []);
	if (combatants.length > 0) {
		for (const c of combatants) {
			const a = c?.actor;
			if (!a) continue;
			if (a.type === "mech" || a.is_mech?.()) mechs.add(a);
			else if (a.type === "pilot" || a.is_pilot?.()) {
				const pm = findActiveMechForPilot(a);
				if (pm) mechs.add(pm);
			} else if (a.type === "npc" || a.is_npc?.()) {
				npcs.add(a);
			}
		}
	} else {
		for (const m of allKnownMechs()) mechs.add(m);
	}
	const isSoleHandler = m => {
		if (!m?.isOwner) return false;
		const activeNonGmOwners = Array.from(globalThis.game?.users ?? []).filter(u => !u.isGM && u.active && m.testUserPermission?.(u, "OWNER"));
		if (activeNonGmOwners.length > 0) {
			return !globalThis.game?.user?.isGM && activeNonGmOwners[0]?.id === globalThis.game?.user?.id;
		}
		return Boolean(globalThis.game?.users?.activeGM ? globalThis.game.users.activeGM.isSelf : m.isOwner);
	};
	const refundedNames = [];
	for (const m of mechs) {
		if (!isSoleHandler(m)) continue;
		const res = await endCorePower(m, { reason: "战斗场景结束" });
		if (res.refunded) refundedNames.push(m.name);
		await resetSceneTalentState(m);
	}
	for (const n of npcs) {
		if (!isSoleHandler(n)) continue;
		await resetNpcCombatState(n);
	}
	if (refundedNames.length) {
		globalThis.ui?.notifications?.info?.(`场景结束核心返还（+1 CP）：${refundedNames.join("、")}`);
	}
	return refundedNames;
}

async function onActorGainedStatus(actor, status) {
	if (!actor || (status !== "stunned" && status !== "jammed")) return;
	if (status === "stunned") {
		if (isCoreActiveOn(actor, "mf_lancaster")) {
			await deactivateCoreEffect(actor, "兰开斯特陷入晕眩，增压器断开");
		}
		const lanc = findLancasterForAlly(actor);
		if (lanc && lanc.isOwner) {
			await deactivateCoreEffect(lanc, `${actor.name ?? "绑定盟友"}陷入晕眩，增压器断开`);
		}
		if (isCoreActiveOn(actor, "mf_goblin")) {
			await deactivateCoreEffect(actor, "陷入晕眩，共生解除");
		}
	}
	if (isCoreActiveOn(actor, "mf_barbarossa")) {
		await syncBarbarossaRail(actor, 4);
		ui?.notifications?.warn?.(`${actor.name} 陷入${ALL_STATUS_LABELS[status] ?? status}，末日骰已重置为 4！`);
	}
}

function renderCoreControlHTML(actor, { inSheet = false } = {}) {
	if (!actor || (actor.type !== "mech" && !actor.is_mech?.())) return "";
	const cs = getCoreState(actor);
	const lid = cs.frameLid || mechFrameLid(actor);
	const prof = CP_PROFILES[lid] ?? {};
	const isActive = Boolean(actor.system?.core_active || cs.active);
	if (inSheet && !isActive && !cs.pendingRefund) return "";

	const badges = [];
	if (isActive) badges.push(`<span style="padding:0 5px;border-radius:3px;background:#1b5e20;color:#fff;font-weight:bold">核心激活中${prof.label ? ` · ${escHtml(prof.label)}` : ""}</span>`);
	else if (cs.pendingRefund === "efficient") badges.push(`<span style="padding:0 5px;border-radius:3px;background:#0d47a1;color:#fff">高效待返还 (+1 CP)</span>`);
	if (cs.efficient && isActive) badges.push(`<span style="padding:0 4px;border-radius:3px;background:#e3f2fd;color:#0d47a1">高效</span>`);
	if (cs.counterLabel && cs.counterValue != null) {
		badges.push(`<span style="padding:0 5px;border-radius:3px;background:#fff3e0;color:#e65100;font-weight:bold">${escHtml(cs.counterLabel)}：${cs.counterValue}${cs.counterMax ? ` / ${cs.counterMax}` : ""}</span>`);
	}
	if (cs.latchTargetUuid) badges.push(`<span style="padding:0 4px;border-radius:3px;background:#e8f5e9;color:#2e7d32">绑定：${escHtml(cs.latchTargetName || "盟友")}</span>`);
	if (cs.markTargetUuid) badges.push(`<span style="padding:0 4px;border-radius:3px;background:#ffebee;color:#c62828">死印：${escHtml(cs.markTargetName || "目标")}</span>`);
	if (cs.tbkArmed) badges.push(`<span style="padding:0 4px;border-radius:3px;background:#fff8e1;color:#f57f17">排热待命</span>`);
	if (cs.perfectShotArmed) badges.push(`<span style="padding:0 4px;border-radius:3px;background:#f3e5f5;color:#6a1b9a">完美射击待命</span>`);
	if (prof.hint && isActive) badges.push(`<span style="opacity:.78">${escHtml(prof.hint)}</span>`);

	const btns = [];
	for (const b of prof.buttons ?? []) {
		if (!isActive && !prof.instant) continue;
		if (b.act.startsWith("sagittariusAmmo:")) {
			const ammoKey = b.act.split(":")[1];
			if (cs.sagittariusUsed?.[ammoKey]) continue;
		}
		btns.push(`<button type="button" data-lancer-cn-cp-act="${escHtml(b.act)}" style="${BTN_INLINE_STYLE}">${escHtml(b.label)}</button>`);
	}
	if ((isActive || prof.instant) && hasCoreBonus(actor, "cb_universal_compatibility") && !cs.usedUniversalCompat) {
		btns.push(`<button type="button" data-lancer-cn-cp-act="universalCompat" style="${BTN_INLINE_STYLE}" title="自由动作：回满 HP、冷却全部热度，并掷 1d20（20 则回复 1 CP）">💚 寰宇兼容（满HP/清热/d20回CP）</button>`);
	}
	if ((isActive || prof.instant) && hasCoreBonus(actor, "cb_kkca_tournament_hardening") && !cs.usedTournamentHardening) {
		btns.push(`<button type="button" data-lancer-cn-cp-act="tournamentHardening" style="${BTN_INLINE_STYLE}" title="自由动作：获得全抗性、清除全部非自身状况，并掷 1d20（20 则回复 1 CP）">🏆 锦标赛强化（全抗性/清状况/d20回CP）</button>`);
	}
	if (isActive || cs.pendingRefund) {
		btns.push(`<button type="button" data-lancer-cn-cp-act="sceneEnd" style="${BTN_INLINE_STYLE}" title="结束核心持续效果并结算高效/条件返还 CP">⏹ 场景结束结算</button>`);
	}
	if (!badges.length && !btns.length) return "";
	const wrapStyle = inSheet
		? "display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:5px 8px;margin-top:4px;border-top:1px dashed rgba(128,128,128,.4);font-size:12px"
		: "display:flex;flex-wrap:wrap;gap:4px;align-items:center;width:100%";
	return `<div class="${inSheet ? "lancer-cn-core-bar" : "lancer-cn-core-inline"}" style="${wrapStyle}">${badges.join("")}${btns.join("")}</div>`;
}

async function triggerWeaponOrBasicAttack(actor, weaponLid, fallbackTitle, meta = null) {
	const wpn = weaponLid ? findIntegratedWeapon(actor, weaponLid) : null;
	const AtkCls = wpn
		? (game.lancer?.flows?.get?.("WeaponAttackFlow") ?? game.lancer?.flows?.get?.("BasicAttackFlow"))
		: game.lancer?.flows?.get?.("BasicAttackFlow");
	if (!AtkCls) return false;
	if (meta?.crit18) actor._lancerCnCrit18 = true;
	pendingCpAttackMeta = meta ? { actorUuid: actor.uuid, ...meta } : null;
	try {
		const flow = new AtkCls(wpn ? wpn.uuid : actor.uuid, wpn ? {} : { title: fallbackTitle });
		const beginData = wpn ? undefined : { ...flow.state?.data, title: fallbackTitle };
		return await flow.begin(beginData);
	} finally {
		delete actor._lancerCnCrit18;
		pendingCpAttackMeta = null;
	}
}

async function executeCoreAction(actor, rawAction) {
	if (!actor) return false;
	if (!actor.isOwner && !game.user?.isGM) {
		ui?.notifications?.warn?.(`你不拥有 ${actor.name ?? "该机甲"}，无法执行其核心动作。`);
		return false;
	}
	const [act, arg] = String(rawAction || "").split(":");
	const cs = getCoreState(actor);

	if (act === "deactivate") {
		await deactivateCoreEffect(actor, "主动关闭核心效果");
		await postCpEffectCard(actor, "关闭核心持续效果", `<p><b>${escHtml(actor.name)}</b> 已关闭当前核心系统持续效果。</p>`);
		return true;
	}
	if (act === "sceneEnd") {
		const res = await endCorePower(actor, { reason: "场景结束结算" });
		await postCpEffectCard(actor, "核心系统 · 场景结束结算", `<p><b>${escHtml(actor.name)}</b> 已结束核心状态${res.refunded ? "，并按规则<b>返还 1 点核心能量（CP）</b>！" : "。"}</p>`);
		return true;
	}
	if (act === "counterDelta") {
		const delta = Number(arg) || 0;
		const max = Number(cs.counterMax) || 99;
		const next = Math.max(0, Math.min(max, (Number(cs.counterValue) || 0) + delta));
		await setCoreState(actor, { counterValue: next });
		return true;
	}
	if (act === "freeBoost") {
		await postCpEffectCard(actor, `${actor.name} // 免费推进`, `<p><b>${escHtml(actor.name)}</b> 使用核心协议执行 <b>免费推进</b>（本回合移动额外推进等同于速度的距离）。</p>`);
		return true;
	}
	if (act === "fireIntegrated") {
		return triggerWeaponOrBasicAttack(actor, arg, `${actor.name} 核心武器攻击`);
	}
	if (act === "chomolungmaPulse") {
		const TechCls = game.lancer?.flows?.get?.("TechAttackFlow");
		if (!TechCls) return false;
		actor._lancerCnWidePulse = true;
		pendingCpAttackMeta = { actorUuid: actor.uuid, kind: "chomolungmaPulse" };
		try {
			const flow = new TechCls(actor.uuid, { title: "广域编码脉冲", invade: true });
			return await flow.begin({ ...flow.state?.data, title: "广域编码脉冲", invade: true });
		} finally {
			delete actor._lancerCnWidePulse;
			pendingCpAttackMeta = null;
		}
	}
	if (act === "sagarmathaBind") {
		const targets = [...(game.user?.targets ?? [])];
		if (!targets.length) { ui?.notifications?.warn?.("请先锁定视线内的盟友指示物。"); return false; }
		const uuids = [];
		for (const t of targets) {
			const u = t.document?.uuid ?? t.uuid;
			if (!u) continue;
			uuids.push(u);
			for (const rid of RESIST_IDS) await setActorStatus(u, rid, true);
		}
		await setCoreState(actor, { bannerTargetUuids: uuids });
		await postCpEffectCard(actor, "扬起旗帜 · 战旗庇护", `<p>受旗盟友（<b>${targets.map(t => escHtml(t.name)).join("、")}</b>）已获得<b>全伤害抗性</b>，且所有检定与豁免自动 <b>+1 准度</b>！</p>`);
		return true;
	}
	if (act === "lancasterBind") {
		const t = [...(game.user?.targets ?? [])][0];
		if (!t) { ui?.notifications?.warn?.("请先锁定邻接的一名盟友机甲。"); return false; }
		const u = t.document?.uuid ?? t.uuid;
		await setCoreState(actor, { latchTargetUuid: u, latchTargetName: t.name ?? t.actor?.name ?? "盟友" });
		await postCpEffectCard(actor, "增压器连接", `<p><b>${escHtml(actor.name)}</b> 已将增压器连接至 <b>${escHtml(t.name)}</b>（攻击/检定/豁免自动 +1 准度；兰开斯特回合开始时承受 1 点热度）。</p>`);
		return true;
	}
	if (act === "raleighLoad2") {
		const next = Math.min(6, (Number(cs.counterValue) || 0) + 2);
		await setCoreState(actor, { counterValue: next });
		ui?.notifications?.info?.(`雷神弹仓已装填至 ${next} / 6 发。`);
		return true;
	}
	if (act === "raleighFire") {
		const chambers = Number(cs.counterValue) || 0;
		if (chambers <= 0) { ui?.notifications?.warn?.("雷神当前弹仓为 0 发，请先装填！"); return false; }
		const ok = await triggerWeaponOrBasicAttack(actor, "mw_raleigh_integrated", `雷神齐射（${chambers} 发）`, { kind: "raleighMjolnir", chambers });
		if (ok) await setCoreState(actor, { counterValue: 0, raleighFiredThisTurn: true });
		return ok;
	}
	if (act === "shrike3") {
		return rollQuickCpDamage(actor, `${actor.name} 反击伤害`, [{ type: "Kinetic", val: "3" }], { ap: true });
	}
	if (act === "toggleAllResist") {
		return toggleActorResistance(actor, "all");
	}
	if (act === "zhengPunch") {
		const cur = Number(cs.counterValue) || 0;
		if (cur <= 0) { ui?.notifications?.warn?.("晓之拳劲已用尽！"); return false; }
		await setCoreState(actor, { counterValue: cur - 1 });
		await postCpEffectCard(actor, `晓之奥义（剩余 ${cur - 1} / 6）`, `<p><b>${escHtml(actor.name)}</b> 推进 3 格并轰出拳劲：邻接敌方角色受到 <b>3 动能伤害</b>（物件/地形受到 10 AP 动能伤害）。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "empakaaiHand") {
		return beginBasicAction(actor, "grapple");
	}
	if (act === "empakaaiConduit") {
		const curHeat = Math.max(0, Number(actor.system?.heat?.value) || 0);
		if (curHeat <= 0) { ui?.notifications?.warn?.("当前热度为 0，催化导流器造成 0 点伤害。"); return false; }
		return rollQuickCpDamage(actor, "催化导流器", [{ type: "Energy", val: String(curHeat) }], { ap: true });
	}
	if (act === "placeBurst3") {
		await placeAoETemplate("Burst", 3, attackerToken(actor), { persistent: true });
		return true;
	}
	if (act === "lockTargets") {
		const targets = [...(game.user?.targets ?? [])];
		if (!targets.length) { ui?.notifications?.warn?.("请先锁定要施加锁定的目标。"); return false; }
		for (const t of targets) await setActorStatus(t.document?.uuid ?? t.uuid, "lockon", true);
		return true;
	}
	if (act === "blackWitchCollapse") {
		const n = Math.max(1, Math.min(6, Number(cs.counterValue) || 1));
		await setCoreState(actor, { counterValue: 0 });
		return rollQuickCpDamage(actor, `磁场坍缩（+${n} 命中 / ${n}d6 动能）`, [{ type: "Kinetic", val: `${n}d6` }]);
	}
	if (act === "orchideaRam") {
		const t = [...(game.user?.targets ?? [])][0];
		if (!t) { ui?.notifications?.warn?.("请先锁定射程 6 内的目标机甲。"); return false; }
		await setActorStatus(t.document?.uuid ?? t.uuid, "prone", true);
		await postCpEffectCard(actor, "氦神 · 必中投盾冲撞", `<p><b>${escHtml(t.name)}</b> 被门盾必中冲撞击倒<b>伏卧</b>并被<b>击退 3 空间</b>！若发生碰撞可点击「猎鹰追击」。</p>`);
		return true;
	}
	if (act === "orchideaFalcon") {
		for (const t of game.user?.targets ?? []) {
			const u = t.document?.uuid ?? t.uuid;
			const ta = t.actor ?? resolveActor(u);
			await patchCombatStateCompat(ta ?? u, { noReactionsUntilTurnEnd: true });
		}
		return rollQuickCpDamage(actor, "猎鹰追击（目标禁反应至下回合结束）", [{ type: "Kinetic", val: "3" }]);
	}
	if (act === "deathsHeadMark") {
		const t = [...(game.user?.targets ?? [])][0];
		if (!t) { ui?.notifications?.warn?.("请先锁定射程 5–30 内的死印目标。"); return false; }
		const u = t.document?.uuid ?? t.uuid;
		await setActorStatus(actor, "immobilized", true);
		await setCoreState(actor, { markTargetUuid: u, markTargetName: t.name ?? t.actor?.name ?? "死印目标" });
		await postCpEffectCard(actor, "死印专注生效", `<p><b>${escHtml(actor.name)}</b> 已专注锁定 <b>${escHtml(t.name)}</b>（自身固定、不能反应；对无掩护且距离 &gt;5 的该目标远程会心自动追加 1d6/2d6/3d6 伤害）。</p>`);
		return true;
	}
	if (act === "deathsHeadUnmark") {
		await setCoreState(actor, { markTargetUuid: null, markTargetName: null });
		if (!isGrappleImmobilized(actor)) await setActorStatus(actor, "immobilized", false);
		ui?.notifications?.info?.("已停止死印专注并解除自身固定。");
		return true;
	}
	if (act === "duskWingBurst") {
		await postCpEffectCard(actor, "镜厅 · 全息残影引爆", `<p>爆发 1 内的敌对角色必须通过敏捷豁免，否则受到 1d6 能量伤害，豁免成功则伤害减半。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "swallowtailSim") {
		const rGate = await consumeReaction(actor, { kind: "swallowtailSim", label: "战术模拟" });
		if (!rGate.ok) return false;
		const roll = await new Roll("1d6").evaluate();
		const ok4 = Number(roll.total) >= 4;
		if (ok4) {
			for (const t of game.user?.targets ?? []) {
				const u = t.document?.uuid ?? t.uuid;
				for (const rid of RESIST_IDS) await setActorStatus(u, rid, true);
			}
		}
		await postCpEffectCard(actor, "战术模拟反应", `<p>战术模拟掷骰：<b>${roll.total}</b> → ${ok4 ? "<b>4+ 成功！</b>已为锁定的受保护友军开启<b>全伤害抗性</b>，且其可传送最多 <b>3 空间</b>。" : "<b>3- 故障</b>：未获得抗性，但受保护友军可传送最多 <b>6 空间</b>。"}</p>`);
		return true;
	}
	if (act === "atlasTrip") {
		await postCpEffectCard(actor, "最终狩猎 · 绊倒检定", `<p>目标必须通过机体豁免，否则陷入伏卧。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "whiteWitchGain2") {
		const next = await syncWhiteWitchArmor(actor, (Number(cs.counterValue) || 0) + 2);
		await postCpEffectCard(actor, `超激活叠甲（当前 +${next} 护甲）`, `<p><b>${escHtml(actor.name)}</b> 铁磁反应装甲升至 <b>+${next}</b>，并对爆发 1 内选定敌人造成 1 点穿甲动能伤害。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "whiteWitchBurst") {
		const cur = Number(cs.counterValue) || 0;
		const dmg = Math.max(2, cur);
		await syncWhiteWitchArmor(actor, 0);
		await postCpEffectCard(actor, "超激活铁磁爆发", `<p>爆发 2 内的敌对角色必须通过敏捷豁免，否则受到 ${dmg} 点穿甲动能伤害并陷入固定，豁免成功则伤害减半。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "emperorArc") {
		return rollQuickCpDamage(actor, "统御矩阵 · 惩戒电弧", [{ type: "Energy", val: "2" }], { ap: true });
	}
	if (act === "emperorShield") {
		const targets = [...(game.user?.targets ?? [])];
		const list = targets.length ? targets.map(t => t.actor).filter(Boolean) : [actor];
		for (const a of list) {
			if (!a.isOwner) continue;
			const cur = Number(a.system?.overshield?.value) || 0;
			await a.update?.({ "system.overshield.value": cur + 2 });
		}
		ui?.notifications?.info?.("已追加 +2 护盾。");
		return true;
	}
	if (act === "joukenInterrupt") {
		const rGate = await consumeReaction(actor, { kind: "joukenInterrupt", label: "亲和力中断" });
		if (!rGate.ok) return false;
		const ok = await triggerWeaponOrBasicAttack(actor, "mw_ext_affinity_edge", "亲和力中断 // 亲和之锋", { kind: "joukenInterrupt", crit18: true });
		if (ok === false) await refundReaction(actor, rGate.snapshot);
		return ok;
	}
	if (act === "microMonarchLockFail") {
		const targets = [...(game.user?.targets ?? [])];
		if (!targets.length) { ui?.notifications?.warn?.("请先锁定带有锁定状态的目标。"); return false; }
		let count = 0;
		for (const t of targets) {
			const u = t.document?.uuid ?? t.uuid;
			const a = t.actor ?? resolveActor(u);
			if (!a?.statuses?.has?.("lockon")) continue;
			await setActorStatus(u, "lockon", false);
			await setActorStatus(u, "prone", true);
			count++;
		}
		if (count) await postCpEffectCard(actor, "天堂倾雨 · 锁定导引必中", `<p>已消耗 <b>${count}</b> 名目标的<b>锁定</b>，使其自动豁免失败并陷入<b>伏卧</b>（请掷 1d6+3 爆炸全额伤害）。</p>`);
		else ui?.notifications?.warn?.("所选目标身上没有锁定状态。");
		return count > 0;
	}
	if (act === "balorRegen") {
		const maxHp = Number(actor.system?.hp?.max) || 0;
		const curHp = Number(actor.system?.hp?.value) || 0;
		const gain = Math.ceil(maxHp / 2);
		const nextHp = Math.min(maxHp, curHp + gain);
		await actor.update?.({ "system.hp.value": nextHp });
		await postCpEffectCard(actor, "虫巢狂乱 · 高速再生", `<p><b>${escHtml(actor.name)}</b> 回复总 HP 的 1/2（+${gain} → <b>${nextHp} / ${maxHp} HP</b>）。</p>`);
		return true;
	}
	if (act === "balorReconstitute") {
		const roll = await new Roll("1d6").evaluate();
		const six = Number(roll.total) === 6;
		if (six) {
			await actor.update?.({ "system.hp.value": 1 });
			for (const rid of RESIST_IDS) await setActorStatus(actor, rid, true);
		}
		await postCpEffectCard(actor, "虫巢狂乱 · 地狱重组检定", `<p>掷 1d6：<b>${roll.total}</b> → ${six ? "<b style='color:#2e7d32'>6 点触发地狱重组！</b>免除本次结构伤害，回到 <b>1 HP</b>，并在本回合结束前对所有伤害免疫！" : "未出 6，照常结算结构伤害。"}</p>`);
		return true;
	}
	if (act === "balorSwarm") {
		return rollQuickCpDamage(actor, "虫巢狂乱 · 洗涤虫群", [{ type: "Kinetic", val: "4" }]);
	}
	if (act === "hecatonBurn") {
		return rollQuickCpDamage(actor, "狂暴虫群", [{ type: "Burn", val: "4" }]);
	}
	if (act === "gorgonGaze") {
		await postCpEffectCard(actor, "排出蛇怪 · 反认知凝视", `<p>攻击你或射程 3 内友军的敌对角色必须先通过系统豁免，否则陷入晕眩直到其下一回合结束。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "manticoreBlast") {
		await deactivateCoreEffect(actor, "充能满载释放破灭爆发");
		await postCpEffectCard(actor, "拉之仇敌圣殿的破灭 · 6d6 AP 能量爆发", `<p>爆发 2 内的角色必须通过工程豁免，否则受到 6d6 穿甲能量伤害，豁免成功则伤害减半。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "minotaurMaze") {
		const t = [...(game.user?.targets ?? [])][0];
		return Boolean(await createMazeCard(actor, t));
	}
	if (act === "wraithIntangible") {
		const targets = [...(game.user?.targets ?? [])];
		if (targets.length < 2) { ui?.notifications?.warn?.("请同时锁定 1 名盟友与 1 名敌方角色（共 2 名角色）再发动度不均之心。"); return false; }
		for (const t of targets.slice(0, 2)) await setActorStatus(t.document?.uuid ?? t.uuid, "intangible", true);
		await postCpEffectCard(actor, "度不均之心", `<p><b>${targets.slice(0, 2).map(t => escHtml(t.name)).join("、")}</b> 已化为<b>无形</b>，持续至你下一回合结束。</p>`);
		return true;
	}
	if (act === "pegasusOmnigun") {
		const rem = Number(cs.counterValue) || 0;
		if (rem <= 0) { ui?.notifications?.warn?.("本轮 3 次万物枪已全部使用！"); return false; }
		await setCoreState(actor, { counterValue: rem - 1 });
		return rollQuickCpDamage(actor, `巫沙布提万物枪（本轮剩余 ${rem - 1} / 3）`, [{ type: "Kinetic", val: "1" }], { ap: true, paracausal: true });
	}
	if (act === "lycanProfile") {
		const idx = Number(arg) || 0;
		await setWeaponProfile(actor, "mw_integrated_shock_claws", idx);
		ui?.notifications?.info?.(`电震利爪已切换至档位 ${idx + 1}。`);
		return true;
	}
	if (act === "barbarossaReset") {
		await syncBarbarossaRail(actor, 4);
		ui?.notifications?.info?.("末日骰已重置为 4。");
		return true;
	}
	if (act === "genghisManualVent") {
		await actor.update?.({ "system.heat.value": 0 });
		if (actor.statuses?.has?.("dangerzone")) await actor.toggleStatusEffect("dangerzone", { active: false });
		await setCoreState(actor, { tbkArmed: false });
		await postCpEffectCard(actor, "暴露能量电池 · 爆发3排热云", `<p><b>${escHtml(actor.name)}</b> 冷却全部热度并排出<b>爆发 3</b> 燃烧云（区域内除你外的角色在其中开始回合或首入时承受 2 燃烧与 2 热度）。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "iskanderMine") {
		return rollQuickCpDamage(actor, "死亡之云触发", [{ type: "Explosive", val: "3" }], { ap: true });
	}
	if (act === "saladinPulse") {
		const targets = [...(game.user?.targets ?? [])];
		if (!targets.length) { ui?.notifications?.warn?.("请先锁定受护盾保护的友军。"); return false; }
		const rGate = await consumeReaction(actor, { kind: "saladinPulse", label: "防御脉冲" });
		if (!rGate.ok) return false;
		for (const t of targets) {
			const u = t.document?.uuid ?? t.uuid;
			for (const rid of RESIST_IDS) await setActorStatus(u, rid, true);
		}
		await postCpEffectCard(actor, "迅子护盾 · 防御脉冲", `<p>已为 <b>${targets.map(t => escHtml(t.name)).join("、")}</b> 开启全伤害抗性；若该攻击未命中，可令攻击者重掷并改指新目标。</p>`);
		return true;
	}
	if (act === "tagetesCool") {
		const roll = await new Roll("1d3+1").evaluate();
		const cur = Number(actor.system?.heat?.value) || 0;
		const next = Math.max(0, cur - (Number(roll.total) || 0));
		await actor.update?.({ "system.heat.value": next });
		await postCpEffectCard(actor, "万寿菊冷却", `<p>冷却 <b>${roll.total}</b> 点热度（${cur} → <b>${next}</b>）。</p>`);
		return true;
	}
	if (act === "enkiduBifurcate") {
		const t = [...(game.user?.targets ?? [])][0];
		if (!t?.actor) { ui?.notifications?.warn?.("请先锁定要执行「一刀两断」的目标。"); return false; }
		const ta = t.actor;
		const maxSt = Number(ta.system?.structure?.max) || 1;
		const curSt = Number(ta.system?.structure?.value) ?? 1;
		const curHp = Number(ta.system?.hp?.value) ?? 99;
		const canExec = maxSt <= 1 ? curHp <= 7 : curSt <= 1;
		if (!canExec) {
			ui?.notifications?.warn?.(`${t.name} 当前不满足处决阈值（无/1结构需 HP ≤ 7，多结构需剩余结构 ≤ 1）。`);
			return false;
		}
		await setCoreState(actor, { enkiduDestroyedAny: true });
		if (ta.isOwner) {
			await ta.update?.({ "system.hp.value": 0, ...(maxSt > 0 ? { "system.structure.value": 0 } : {}) });
			await setActorStatus(t.document?.uuid ?? t.uuid, "downandout", true);
		}
		await postCpEffectCard(actor, "四肢撕裂 // 一刀两断！", `<p><b>${escHtml(actor.name)}</b> 直接将 <b>${escHtml(t.name)}</b> 一刀两断摧毁！（已标记本场景触发过处决）</p>`);
		return true;
	}
	if (act === "agrippaRepairAlly") {
		const curRep = Number(actor.system?.repairs?.value) || 0;
		if (curRep <= 0) { ui?.notifications?.warn?.("剩余维修次数不足 1 点！"); return false; }
		const t = [...(game.user?.targets ?? [])][0];
		const ally = t?.actor ?? actor;
		await actor.update?.({ "system.repairs.value": curRep - 1 });
		if (ally.isOwner) {
			await ally.update?.({ "system.hp.value": Number(ally.system?.hp?.max) || 0, "system.burn": 0 });
			for (const cid of CONDITION_IDS) if (ally.statuses?.has?.(cid)) await ally.toggleStatusEffect(cid, { active: false });
		}
		await postCpEffectCard(actor, "阿格里帕 · 纳米紧急整修", `<p>消耗 1 点维修，使 <b>${escHtml(ally.name)}</b> 回满 HP、清除全部燃烧并解除状况！</p>`);
		return true;
	}
	if (act === "cometMothAll") {
		const selfTok = attackerToken(actor);
		const myDisp = selfTok?.document?.disposition ?? 1;
		let allyN = 0, foeN = 0;
		for (const tok of globalThis.canvas?.tokens?.placeables ?? []) {
			if (!tok?.actor || tok === selfTok) continue;
			const u = tok.document?.uuid ?? tok.uuid;
			if ((tok.document?.disposition ?? -1) === myDisp) { await setActorStatus(u, "bolster", true); allyN++; }
			else { await setActorStatus(u, "lockon", true); foeN++; }
		}
		await postCpEffectCard(actor, "彗星蛾 · 神圣指引", `<p>已对 <b>${allyN}</b> 名友军施加<b>强化</b>，对 <b>${foeN}</b> 名敌军施加<b>锁定</b>！</p>`);
		return true;
	}
	if (act === "grantSpend") {
		const cur = Number(cs.counterValue) || 1;
		await setCoreState(actor, { counterValue: 1 });
		const t = [...(game.user?.targets ?? [])][0];
		const u = t ? (t.document?.uuid ?? t.uuid) : (preferredTargetUuid(actor) ?? actor.uuid);
		await setActorStatus(u, "resistance_heat", true);
		await postCpEffectCard(actor, `绝对零度（消耗冻结骰 ${cur}）`, `<p>已赋予目标<b>热度抗性</b>（消耗层数：${cur}）。</p>`);
		return true;
	}
	if (act === "tametomoBurst") {
		await postCpEffectCard(actor, "为朝 · 堆芯过载爆发", `<p>爆发 2 内的敌对角色受到 2d6 能量伤害。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "pharosRoll") {
		const roll = await new Roll("1d6").evaluate();
		await postCpEffectCard(actor, "法罗斯 · 反冲测微计", `<p>掷 1d6 结果：<b>${roll.total}</b>。</p>`);
		return true;
	}
	if (act === "hubbleFlare") {
		await postCpEffectCard(actor, "哈勃 · 太阳耀斑", `<p>爆发 2 内的敌对角色受到 4 燃烧伤害。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "spectreCurse") {
		for (const t of game.user?.targets ?? []) await setActorStatus(t.document?.uuid ?? t.uuid, "impaired", true);
		return rollQuickCpDamage(actor, "幽冥处刑（附加受损）", [{ type: "Burn", val: "3" }]);
	}
	if (act === "serpentStorm") {
		await postCpEffectCard(actor, "羽蛇神 · 天体风暴", `<p>目标受到 2 热度，并且必须通过系统豁免，否则陷入受扰直到其下一回合结束。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "retiariusNet") {
		const targets = [...(game.user?.targets ?? [])];
		if (!targets.length) { ui?.notifications?.warn?.("请先锁定要网缚的目标。"); return false; }
		for (const t of targets) await setActorStatus(t.document?.uuid ?? t.uuid, "immobilized", true);
		return true;
	}
	if (act === "callistaRepairStruct") {
		const curRep = Number(actor.system?.repairs?.value) || 0;
		if (curRep <= 0) { ui?.notifications?.warn?.("剩余维修次数不足 1 点！"); return false; }
		const maxSt = Number(actor.system?.structure?.max) || 4;
		const curSt = Number(actor.system?.structure?.value) || 0;
		const nextSt = Math.min(maxSt, curSt + 1);
		await actor.update?.({ "system.repairs.value": curRep - 1, "system.structure.value": nextSt });
		await postCpEffectCard(actor, "女武神重铸", `<p>消耗 1 点维修，恢复 1 点结构（当前 <b>${nextSt} / ${maxSt}</b>），且下次近战攻击伤害 +2！</p>`);
		return true;
	}
	if (act === "wodengBarrage") {
		const curStress = Number(actor.system?.stress?.value) || 0;
		if (curStress <= 1) { ui?.notifications?.warn?.("当前剩余压力不足以安全燃烧 1 点（需 > 1）！"); return false; }
		await actor.update?.({ "system.stress.value": curStress - 1 });
		await postCpEffectCard(actor, "沃登 · 燃烧压力免费弹幕", `<p><b>${escHtml(actor.name)}</b> 主动燃烧 1 点反应堆压力（剩余 <b>${curStress - 1}</b>），立即执行一次<b>免费弹幕攻击</b>！</p>`);
		return true;
	}
	if (act === "sagittariusAmmo") {
		const labels = { star: "穿星弹（无视护甲与掩护）", void: "碎空弹（溅射爆发引爆）", gravity: "引星弹（强制牵引聚拢）" };
		const used = { ...(cs.sagittariusUsed ?? {}), [arg]: true };
		await setCoreState(actor, { sagittariusUsed: used });
		await postCpEffectCard(actor, "射手座 · 装填星矢特种弹头", `<p>本次攻击已装填 <b>${escHtml(labels[arg] ?? arg)}</b>！</p>`);
		return true;
	}
	if (act === "matadorExtend") {
		const roll = await new Roll(arg || "1d3").evaluate();
		const cur = Number(actor.system?.heat?.value) || 0;
		await actor.update?.({ "system.heat.value": cur + (Number(roll.total) || 0) });
		await postCpEffectCard(actor, "斗牛士 · 维持红布挑衅", `<p>承受 <b>${roll.total}</b> 点热度以维持姿态至下一轮！</p>`);
		return true;
	}
	if (act === "tizonaHeat") {
		const cur = Number(actor.system?.heat?.value) || 0;
		await actor.update?.({ "system.heat.value": cur + 1 });
		await postCpEffectCard(actor, "提索纳 · 督军敕令", `<p>承受 <b>1 点热度</b>，额外触发一次督军效果！</p>`);
		return true;
	}
	if (act === "wondrousShield") {
		const cur = Number(actor.system?.overshield?.value) || 0;
		const next = Math.min(9, cur + 3);
		await actor.update?.({ "system.overshield.value": next });
		await postCpEffectCard(actor, "妙剑 · 凝剑护盾", `<p>获得 +3 护盾（上限 9），当前护盾：<b>${next}</b>。</p>`);
		return true;
	}
	if (act === "pepperZap") {
		return rollQuickCpDamage(actor, "胡椒 · 静电电弧", [{ type: "Energy", val: "2" }]);
	}
	if (act === "lemongrassDischarge") {
		const cur = Number(cs.counterValue) || 0;
		if (cur < 2) { ui?.notifications?.warn?.("离子充能不足 2 点！"); return false; }
		await setCoreState(actor, { counterValue: cur - 2 });
		await postCpEffectCard(actor, `柠檬草 · 离子放电（剩余 ${cur - 2}）`, `<p>溅射 2 内的敌对角色受到 1 穿甲能量伤害并陷入受损。</p>`, { allowAutoScan: true });
		return true;
	}
	if (act === "basilCleanse") {
		const t = [...(game.user?.targets ?? [])][0];
		const ally = t?.actor ?? actor;
		const u = t ? (t.document?.uuid ?? t.uuid) : (preferredTargetUuid(actor) ?? actor.uuid);
		const cond = CONDITION_IDS.find(id => ally?.statuses?.has?.(id));
		if (!cond) { ui?.notifications?.info?.(`${ally.name} 当前没有需要清除的状况。`); return false; }
		await setActorStatus(u, cond, false);
		await postCpEffectCard(actor, "罗勒 · 净化芳疗", `<p>已为 <b>${escHtml(ally.name)}</b> 清除状况：<b>${escHtml(ALL_STATUS_LABELS[cond] ?? cond)}</b>。</p>`);
		return true;
	}
	if (act === "universalCompat") {
		const maxHp = Number(actor.system?.hp?.max) || 0;
		const roll = await new Roll("1d20").evaluate();
		const gotCp = Number(roll.total) === 20;
		const patch = { "system.heat.value": 0 };
		if (maxHp > 0) patch["system.hp.value"] = maxHp;
		if (gotCp) patch["system.core_energy"] = 1;
		await actor.update?.(patch);
		if (actor.statuses?.has?.("dangerzone")) await actor.toggleStatusEffect("dangerzone", { active: false });
		await setCoreState(actor, { usedUniversalCompat: true });
		await postCpEffectCard(actor, "寰宇兼容 · 自由动作触发", `<p><b>${escHtml(actor.name)}</b> 触发核心奖励<b>寰宇兼容</b>：已回满全部 HP、排空全部热度，并掷出 1d20 = <b>${roll.total}</b>${gotCp ? "（<b>大成功！立即回复 1 CP！</b>）" : ""}。</p>`);
		return true;
	}
	if (act === "tournamentHardening") {
		const uuid = preferredTargetUuid(actor) ?? actor.uuid;
		for (const rid of RESIST_IDS) await setActorStatus(uuid, rid, true);
		for (const cid of CONDITION_IDS) {
			if (!actor.statuses?.has?.(cid)) continue;
			if (cid === "shredded" && isUnremovableShredded(actor)) continue;
			if (cid === "immobilized" && (isGrappleImmobilized(uuid) || isCoreSustainedImmobilized(actor))) continue;
			await setActorStatus(uuid, cid, false);
		}
		const roll = await new Roll("1d20").evaluate();
		const gotCp = Number(roll.total) === 20;
		if (gotCp) await actor.update?.({ "system.core_energy": 1 });
		await setCoreState(actor, { usedTournamentHardening: true });
		await postCpEffectCard(actor, "锦标赛强化 · 向看台致意", `<p><b>${escHtml(actor.name)}</b> 触发核心奖励<b>锦标赛强化</b>：已获得<b>全伤害抗性</b>、清除非自身状况，并掷出 1d20 = <b>${roll.total}</b>${gotCp ? "（<b>大成功！立即回复 1 CP！</b>）" : ""}。</p>`);
		return true;
	}
	return false;
}

function listChatMessagesDesc() {
	const coll = game?.messages;
	if (!coll) return [];
	const arr = typeof coll.values === "function" ? Array.from(coll.values()) : (Array.isArray(coll) ? [...coll] : []);
	return arr.reverse();
}

function sameActorRef(uuidA, actorOrUuidB) {
	if (!uuidA || !actorOrUuidB) return false;
	if (typeof actorOrUuidB === "string" && uuidA === actorOrUuidB) return true;
	const a = resolveActor(uuidA);
	const b = typeof actorOrUuidB === "string" ? resolveActor(actorOrUuidB) : actorOrUuidB;
	return Boolean(a && b && (a === b || (a.uuid && a.uuid === b.uuid)));
}

function findActiveGrappleFor(actorOrUuid, { excludeMessage = null } = {}) {
	for (const msg of listChatMessagesDesc()) {
		if (excludeMessage && (msg === excludeMessage || (msg.id && msg.id === excludeMessage.id))) continue;
		const gs = getObjectFlag(msg, "grappleState");
		if (!gs.active) continue;
		if (sameActorRef(gs.attackerUuid, actorOrUuid)) return { message: msg, gs, role: "attacker" };
		if (sameActorRef(gs.defenderUuid, actorOrUuid)) return { message: msg, gs, role: "defender" };
	}
	return null;
}

function isGrappleImmobilized(actorOrUuid, opts = {}) {
	const found = findActiveGrappleFor(actorOrUuid, opts);
	if (!found) return false;
	const controlledUuid = found.gs.controller === "defender" ? found.gs.attackerUuid : found.gs.defenderUuid;
	return sameActorRef(controlledUuid, actorOrUuid);
}

async function endGrapple(grappleMessage, reason = "结束擒拿") {
	const gs = getObjectFlag(grappleMessage, "grappleState");
	if (!gs.active) return false;
	const controlledUuid = gs.controller === "defender" ? gs.attackerUuid : gs.defenderUuid;
	await updateMessageFlagCompat(grappleMessage, "grappleState", { ...gs, active: false, endedReason: reason });
	if (controlledUuid && !isGrappleImmobilized(controlledUuid, { excludeMessage: grappleMessage })) {
		await setActorStatus(controlledUuid, "immobilized", false);
	}
	ui?.notifications?.info?.(`擒拿已结束（${reason}）。`);
	return true;
}

function weaponProfileOf(item) {
	return item?.system?.active_profile ?? item?.system?.profiles?.[item?.system?.selected_profile_index ?? 0] ?? item?.system ?? null;
}

function weaponTypesOf(item) {
	const lid = weaponLidOf(item);
	if (lid === "mw_mimic_gun") return ["Rifle", "Cannon", "Launcher", "CQB", "Nexus"];
	if (lid === "mw_piof_grim_harvest_scythe") return ["Melee", "Nexus"];
	if (lid === "mw_ch_blackjack") return ["Launcher", "Rifle"];
	if (item?.type === "npc_feature" || item?.is_npc_feature?.()) {
		const wt = String(item?.system?.weapon_type ?? "");
		const found = ["Rifle", "Cannon", "Launcher", "CQB", "Nexus", "Melee"].filter(k => wt.includes(k));
		if (found.length) return found;
		const zhFound = [];
		if (/近战/.test(wt)) zhFound.push("Melee");
		if (/步枪/.test(wt)) zhFound.push("Rifle");
		if (/大炮|加农/.test(wt)) zhFound.push("Cannon");
		if (/发射器/.test(wt)) zhFound.push("Launcher");
		if (/巢房/.test(wt)) zhFound.push("Nexus");
		return zhFound;
	}
	const t = weaponProfileOf(item)?.type;
	const list = t ? [t] : [];
	const owner = item?.actor ?? item?.parent;
	if (owner && mechFrameLid(owner) === "mf_sherman_alt_tagetes" && isRangedWeaponItem(item) && getTalentConfig(owner).tagetesFusillade && !list.includes("Rifle")) {
		list.push("Rifle");
	}
	return list;
}

function weaponHasType(item, type) {
	return weaponTypesOf(item).includes(type);
}

function isRangedWeaponItem(item) {
	if (!item) return false;
	const lid = weaponLidOf(item);
	if (lid === "mw_mimic_gun") return true;
	const ranges = weaponProfileOf(item)?.range ?? [];
	if (ranges.some(r => r?.type === "Range")) return true;
	// 直接查原始武器类型（避免万寿菊「枪决」递归回调 isRangedWeaponItem）：纯近战范围武器（如带锥形/线形/爆发的近战钻头或单丝剑）不是远程武器
	let rawTypes = [];
	if (lid === "mw_piof_grim_harvest_scythe") rawTypes = ["Melee", "Nexus"];
	else if (lid === "mw_ch_blackjack") rawTypes = ["Launcher", "Rifle"];
	else if (item?.type === "npc_feature" || item?.is_npc_feature?.()) {
		const wt = String(item?.system?.weapon_type ?? "");
		rawTypes = ["Rifle", "Cannon", "Launcher", "CQB", "Nexus", "Melee"].filter(k => wt.includes(k));
		if (!rawTypes.length) {
			if (/近战/.test(wt)) rawTypes.push("Melee");
			if (/步枪/.test(wt)) rawTypes.push("Rifle");
			if (/大炮|加农/.test(wt)) rawTypes.push("Cannon");
			if (/发射器/.test(wt)) rawTypes.push("Launcher");
			if (/巢房/.test(wt)) rawTypes.push("Nexus");
		}
	} else {
		const t = weaponProfileOf(item)?.type;
		if (t) rawTypes = [t];
	}
	if (rawTypes.some(t => t && t !== "Melee")) {
		return ranges.some(r => r?.type && r.type !== "Threat" && r.type !== "Thrown");
	}
	if (rawTypes.includes("Melee")) return false;
	return ranges.some(r => r?.type && r.type !== "Threat" && r.type !== "Thrown");
}

function isMeleeWeaponItem(item) {
	if (!item) return false;
	if (weaponHasType(item, "Melee")) return true;
	const ranges = weaponProfileOf(item)?.range ?? [];
	return !isRangedWeaponItem(item) && ranges.some(r => r?.type === "Threat" || r?.type === "Thrown");
}

function isHeavyRangedWeapon(item) {
	return Boolean(item?.system?.size === "Heavy" && isRangedWeaponItem(item));
}

function isRifleWeapon(item) {
	return weaponHasType(item, "Rifle");
}

function maxWeaponRangeVal(item, actor = null) {
	if (weaponLidOf(item) === "mw_mimic_gun") {
		const mv = getCombatState(actor).mimicValues;
		if (Array.isArray(mv) && Number.isFinite(Number(mv[0]))) return Number(mv[0]);
	}
	let best = 0;
	for (const r of weaponProfileOf(item)?.range ?? []) {
		if (r?.type && r.type !== "Threat") {
			const n = parseInt(r.val, 10);
			if (Number.isFinite(n) && n > best) best = n;
		}
	}
	return best;
}

// ---------------------------------------------------------------------------
// 投掷近战武器规则闭环与「猎人」（t_hunter：跳扑 / 匕首戏法 / 蔑刃）全链路自动化（v1.15.0）
let cachedLancerTagClass = null;

function resolveLancerTagClass(item = null) {
	if (cachedLancerTagClass) return cachedLancerTagClass;
	const pools = [
		item?.system?.all_tags,
		item?.system?.tags,
		...(item?.system?.profiles ?? []).flatMap(p => [p?.all_tags, p?.tags]),
		...(item?.actor?.items ?? []).flatMap(i => [i?.system?.all_tags, i?.system?.tags, ...(i?.system?.profiles ?? []).flatMap(p => [p?.all_tags, p?.tags])]),
	];
	for (const arr of pools) {
		for (const t of arr ?? []) {
			if (t && typeof t === "object" && t.constructor && t.constructor !== Object && typeof t.copy === "function") {
				cachedLancerTagClass = t.constructor;
				return cachedLancerTagClass;
			}
		}
	}
	return null;
}

function makeThrownTag(val, item = null) {
	const strVal = String(val);
	const TagCls = resolveLancerTagClass(item);
	if (TagCls) {
		try { return new TagCls({ lid: "tg_thrown", val: strVal }); } catch { /* 回退至兼容对象 */ }
	}
	let name = "投掷{VAL}";
	let description = "这近战武器可以投向{VAL}格内的目标。投掷攻击遵循近战攻击规则，但受掩护影响；此外，投掷出的武器会停在与目标邻接的空格，必须在邻接它时以自由动作取回才能再次使用。";
	try {
		const cfg = game?.settings?.get?.(game?.system?.id ?? "lancer", "tag_config")?.tg_thrown;
		if (cfg?.name) name = cfg.name;
		if (cfg?.description) description = cfg.description;
	} catch { /* ignore */ }
	return {
		lid: "tg_thrown",
		val: strVal,
		name,
		description,
		hidden: false,
		is_thrown: true,
		should_show: true,
		get num_val() { const p = Number.parseInt(this.val, 10); return Number.isNaN(p) ? null : p; },
		tierVal() { return this.val; },
		save() { return { lid: this.lid, val: this.val }; },
		copy() { return makeThrownTag(this.val, item); },
	};
}

function isThrownTagObj(t) {
	return Boolean(t && (t.lid === "tg_thrown" || t.id === "tg_thrown" || t.is_thrown));
}

function upsertThrownTagInArray(arr, minVal, item = null) {
	const list = Array.isArray(arr) ? arr : [];
	const idx = list.findIndex(isThrownTagObj);
	if (idx < 0) {
		list.push(makeThrownTag(minVal, item));
		return list;
	}
	const curVal = parseInt(list[idx]?.val, 10) || 0;
	if (curVal < minVal) {
		list[idx] = makeThrownTag(minVal, item);
	}
	return list;
}

// 猎人 II「匕首戏法」：没有投掷标签或投掷小于 5 的副近战武器获得「投掷 5」（仅写衍生 all_tags，不污染原始 tags）
function applyKnifeJugglerTags(item, actorOverride = null) {
	if (!item || (item.type !== "mech_weapon" && !item.is_mech_weapon?.())) return false;
	if (item.system?.size !== "Auxiliary" || !itemBenefitsFromTalents(item)) return false;
	const owner = actorOverride ?? item.actor ?? item.parent;
	if (talentRank(owner, "t_hunter") < 2) return false;
	const baseProfiles = Array.isArray(item.system?.profiles) && item.system.profiles.length
		? [...item.system.profiles]
		: [];
	if (item.system?.active_profile && !baseProfiles.includes(item.system.active_profile)) {
		baseProfiles.push(item.system.active_profile);
	}
	const profiles = baseProfiles.length ? baseProfiles : (item.system ? [item.system] : []);
	let applied = false;
	for (const p of profiles) {
		const isMeleeProf = p?.type === "Melee" || weaponLidOf(item) === "mw_piof_grim_harvest_scythe";
		if (!isMeleeProf) continue;
		if (!Array.isArray(p.all_tags)) {
			p.all_tags = Array.isArray(p.tags)
				? p.tags.map(t => (typeof t?.copy === "function" ? t.copy() : { ...t }))
				: [];
		}
		upsertThrownTagInArray(p.all_tags, 5, item);
		applied = true;
	}
	if (applied && item.system) {
		if (!Array.isArray(item.system.all_tags)) {
			item.system.all_tags = Array.isArray(item.system.tags)
				? item.system.tags.map(t => (typeof t?.copy === "function" ? t.copy() : { ...t }))
				: [];
		}
		upsertThrownTagInArray(item.system.all_tags, 5, item);
	}
	return applied;
}

function weaponThreatVal(item) {
	if (!item) return 1;
	const prof = weaponProfileOf(item);
	const ranges = Array.isArray(prof?.all_range) && prof.all_range.length
		? prof.all_range
		: (prof?.range ?? item?.currentProfile?.()?.range ?? []);
	let best = 0;
	for (const r of ranges) {
		if (r?.type === "Threat") {
			const n = parseInt(r.val, 10);
			if (Number.isFinite(n) && n > best) best = n;
		}
	}
	return best > 0 ? best : (isMeleeWeaponItem(item) ? 1 : 0);
}

function weaponThrownVal(item, actorOverride = null) {
	if (!item) return 0;
	const owner = actorOverride ?? item.actor ?? item.parent;
	const tier = Math.min(3, Math.max(1, Number(owner?.system?.tier) || 1));
	const prof = weaponProfileOf(item);
	const tagPools = [
		prof?.all_tags,
		(() => { try { return item.getTags?.(); } catch { return null; } })(),
		prof?.tags,
		item.system?.all_tags,
		item.system?.tags,
	];
	let best = 0;
	for (const arr of tagPools) {
		for (const tg of arr ?? []) {
			if (!isThrownTagObj(tg)) continue;
			const raw = typeof tg.tierVal === "function" ? tg.tierVal(tier) : tg.val;
			const n = parseInt(raw, 10);
			if (Number.isFinite(n) && n > best) best = n;
		}
	}
	const ranges = Array.isArray(prof?.all_range) && prof.all_range.length
		? prof.all_range
		: (prof?.range ?? item?.currentProfile?.()?.range ?? []);
	for (const r of ranges) {
		if (r?.type === "Thrown") {
			const n = parseInt(r.val, 10);
			if (Number.isFinite(n) && n > best) best = n;
		}
	}
	if ((item.type === "mech_weapon" || item.is_mech_weapon?.())
		&& item.system?.size === "Auxiliary"
		&& isMeleeWeaponItem(item)
		&& itemBenefitsFromTalents(item)
		&& talentRank(owner, "t_hunter") >= 2) {
		best = Math.max(best, 5);
	}
	return best;
}

function weaponTrackKey(item) {
	return String(item?.id || item?.uuid || weaponLidOf(item) || item?.name || "");
}

function getThrownWeapons(actor) {
	const holder = combatMechOf(actor) ?? actor;
	const raw = holder?.getFlag?.(MODULE_ID, "thrownWeapons");
	if (!Array.isArray(raw)) return [];
	return raw.filter(x => x && typeof x === "object" && x.key);
}

function isWeaponThrownOut(actor, item) {
	if (!actor || !item) return false;
	if (weaponLidOf(item) === "mw_kkca_doom_axe") return false; // 末日之斧投掷后无需回收即可再次使用
	const key = weaponTrackKey(item);
	const id = item.id ?? "";
	const uuid = item.uuid ?? "";
	return getThrownWeapons(actor).some(w =>
		(key && w.key === key)
		|| (uuid && w.weaponUuid && w.weaponUuid === uuid)
		|| (id && w.weaponId && w.weaponId === id),
	);
}

async function markWeaponThrown(actor, item, targetUuid = null) {
	const holder = combatMechOf(actor) ?? actor;
	if (!holder?.setFlag || !item) return null;
	if (weaponLidOf(item) === "mw_kkca_doom_axe") return null;
	const key = weaponTrackKey(item);
	if (!key) return null;
	const tDoc = targetUuid ? resolveDocSync(targetUuid) : null;
	const tActor = tDoc?.actor ?? (targetUuid ? resolveActor(targetUuid) : null);
	const entry = {
		key,
		weaponId: item.id ?? "",
		weaponUuid: item.uuid ?? "",
		weaponLid: weaponLidOf(item),
		weaponName: item.name ?? "近战武器",
		targetUuid: targetUuid ?? null,
		targetName: tDoc?.name ?? tActor?.token?.name ?? tActor?.name ?? "",
		round: Number(game?.combat?.round) || 0,
		thrownThisTurn: true,
	};
	const prev = getThrownWeapons(holder).filter(w => w.key !== key && (!entry.weaponUuid || w.weaponUuid !== entry.weaponUuid));
	const next = [...prev, entry];
	await holder.setFlag(MODULE_ID, "thrownWeapons", next);
	try { if (holder.sheet?.rendered) holder.sheet.render(false); } catch { /* ignore */ }
	return entry;
}

async function retrieveThrownWeapon(actor, keyOrAll = "all", { notify = true, postCard = false, cardTitle = "", cardBody = "" } = {}) {
	const holder = combatMechOf(actor) ?? actor;
	if (!holder?.setFlag) return [];
	const cur = getThrownWeapons(holder);
	if (!cur.length) return [];
	const matchAll = !keyOrAll || keyOrAll === "all";
	const removed = [];
	const remain = [];
	for (const w of cur) {
		if (matchAll || w.key === keyOrAll || w.weaponId === keyOrAll || w.weaponUuid === keyOrAll) removed.push(w);
		else remain.push(w);
	}
	if (!removed.length) return [];
	await holder.setFlag(MODULE_ID, "thrownWeapons", remain);
	try { if (holder.sheet?.rendered) holder.sheet.render(false); } catch { /* ignore */ }
	const names = removed.map(w => w.weaponName).join("、");
	if (notify) {
		ui?.notifications?.info?.(`已拾回投掷武器：${names}`);
	}
	if (postCard) {
		await postCpEffectCard(
			holder,
			cardTitle || "拾回投掷武器（自由动作）",
			cardBody || `<p><b>${escHtml(holder.name)}</b> 以<b>自由动作</b>取回了投出的武器：<b>${escHtml(names)}</b>。</p>`,
		);
	}
	return removed;
}

function eligibleDisdainfulWeapons(mech) {
	if (!mech) return [];
	return (mech.items ?? []).filter(w => {
		if (!w || w.system?.destroyed) return false;
		if (w.type !== "mech_weapon" && !w.is_mech_weapon?.()) return false;
		if (w.system?.size !== "Auxiliary" || !isMeleeWeaponItem(w)) return false;
		if (isWeaponThrownOut(mech, w)) return false;
		if (w.isLoading?.() && !w.system?.loaded) return false;
		if (w.isLimited?.()) {
			const curUses = typeof w.system?.uses === "object" ? Number(w.system.uses.value) : Number(w.system?.uses);
			if (Number.isFinite(curUses) && curUses <= 0) return false;
		}
		return weaponThrownVal(w, mech) > 0;
	});
}

function tadUuidOf(tad) {
	return tad?.target?.document?.uuid ?? tad?.target?.uuid ?? tad?.targetUuid ?? null;
}

function tadTokenOf(tad) {
	return tad?.target ?? resolveTokenPlaceable(tad?.targetUuid);
}

function tadActorOf(tad) {
	const tok = tadTokenOf(tad);
	return tok?.actor ?? resolveActor(tadUuidOf(tad));
}

// 根据锁定目标与威胁距离智能切换近战挥砍 / 远距投掷（避免邻接捅刀被系统默认勾选投掷而误吃掩护惩罚或丢刀）
function syncWeaponThrownMode(state, { explicitAccDiff = false } = {}) {
	if (!state?.item || !state?.data?.acc_diff?.weapon) return;
	const item = state.item;
	if (!isMeleeWeaponItem(item)) return;
	const mech = combatMechOf(state.actor) ?? state.actor;
	const thrownReach = weaponThrownVal(item, mech);
	if (thrownReach <= 0 && !state.data._lancerCnForceThrown) return;

	const aTok = (targetSession?.flow?.state === state ? targetSession.token : null) ?? attackerToken(mech);
	const userTargets = Array.from(globalThis.game?.user?.targets ?? []);
	const tadTargets = (state.data.acc_diff.targets ?? []).map(tadTokenOf).filter(Boolean);
	const tokList = userTargets.length ? userTargets : tadTargets;
	const dists = tokList
		.map(bTok => (aTok && bTok) ? tokenDistance(aTok, bTok) : null)
		.filter(d => d !== null && Number.isFinite(d));

	if (state.data._lancerCnForceThrown) {
		state.data.acc_diff.weapon.thrown = true;
	} else if (state.data._lancerCnOverwatchAttack) {
		state.data.acc_diff.weapon.thrown = false;
	} else if (!explicitAccDiff) {
		const threat = overwatchThreatVal(item, mech);
		if (dists.length > 0) {
			state.data.acc_diff.weapon.thrown = dists.some(d => d > threat);
		} else {
			state.data.acc_diff.weapon.thrown = false;
		}
	}

	// “游隼”寻索阔剑（mw_ch_wandering_blade）：投掷目标超过射程 1 时获得引导标签并改为 1d3+2 动能伤害
	if (weaponLidOf(item) === "mw_ch_wandering_blade") {
		const farThrow = Boolean(state.data.acc_diff.weapon.thrown && (dists.length === 0 || dists.some(d => d > 1)));
		state.data.acc_diff.weapon.seeking = farThrow;
		state.data._lancerCnWanderingFar = farThrow;
	}
}

async function triggerHunterDisdainful(mech, preferredWeaponId = null) {
	if (!mech?.isOwner) return false;
	await ensureCombatTurnState(mech);
	if (getCombatState(mech).usedHunterDisdainful) {
		ui?.notifications?.warn?.("本轮已使用过猎人 III「蔑刃」！");
		return false;
	}
	const eligible = eligibleDisdainfulWeapons(mech);
	if (!eligible.length) {
		ui?.notifications?.warn?.("当前没有可用（未投出且未损毁）的副近战武器可供「蔑刃」投掷！");
		return false;
	}
	let chosen = preferredWeaponId
		? eligible.find(w => w.id === preferredWeaponId || w.uuid === preferredWeaponId || weaponTrackKey(w) === preferredWeaponId)
		: null;
	if (!chosen) {
		if (eligible.length === 1) {
			chosen = eligible[0];
		} else {
			const picked = await promptConditionChoice(
				"蔑刃 · 选择要自由动作投掷的副近战武器",
				eligible.map(w => ({ weapon: w, buttonLabel: `${w.name}（投掷 ${weaponThrownVal(w, mech)}）` })),
			);
			chosen = picked?.weapon ?? null;
		}
	}
	if (!chosen) return false;
	await setCombatState(mech, { usedHunterDisdainful: true });
	pendingDisdainfulBlade = { actorUuid: mech.uuid, weaponUuid: chosen.uuid };
	try {
		const AtkCls = game.lancer?.flows?.get?.("WeaponAttackFlow");
		if (!AtkCls) {
			await setCombatState(mech, { usedHunterDisdainful: false });
			return false;
		}
		const flow = new AtkCls(chosen.uuid ?? chosen, { title: `${chosen.name}（蔑刃 · 投掷）` });
		const ok = await flow.begin();
		if (ok === false) {
			await setCombatState(mech, { usedHunterDisdainful: false });
			return false;
		}
		return true;
	} finally {
		pendingDisdainfulBlade = null;
	}
}

function adaptiveWeightMinReliable(item) {
	if (!item || weaponModLidOf(item) !== "wm_ch_adaptive_weight") return 0;
	let baseRel = 0;
	const tags = [...(weaponProfileOf(item)?.tags ?? []), ...(item?.system?.tags ?? [])];
	for (const tg of tags) {
		if (tg?.lid === "tg_reliable" || tg?.id === "tg_reliable" || tg?.is_reliable) {
			baseRel = Math.max(baseRel, parseInt(tg.val, 10) || 0);
		}
	}
	if (baseRel > 0) return baseRel + 1;
	const sz = item?.system?.size;
	if (sz === "Auxiliary") return 1;
	if (sz === "Heavy" || sz === "Superheavy") return 3;
	return 2;
}

function hasWalkingArmoryCharges(mech, ammoKey) {
	if (!mech || !ammoKey) return false;
	const cost = ["hellfire", "javelin", "sabot"].includes(ammoKey) ? 2 : 1;
	const sysItem = (mech.items ?? []).find(i => /^ms_walking_armory_/.test(String(i?.system?.lid ?? "")));
	if (!sysItem || sysItem.system?.uses === undefined) return true;
	const cur = typeof sysItem.system.uses === "object" ? Number(sysItem.system.uses.value) : Number(sysItem.system.uses);
	return !Number.isFinite(cur) || cur >= cost;
}

async function deductWalkingArmoryAmmo(mech, ammoKey, firstRollCrit = false) {
	if (!mech || !ammoKey) return;
	if (talentRank(mech, "t_walking_armory") >= 3 && firstRollCrit) {
		ui?.notifications?.info?.("自走兵器库「效率」触发：会心一击不消耗特制弹药充能！");
		return;
	}
	const cost = ["hellfire", "javelin", "sabot"].includes(ammoKey) ? 2 : 1;
	const sysItem = (mech.items ?? []).find(i => /^ms_walking_armory_/.test(String(i?.system?.lid ?? "")));
	if (sysItem?.system?.uses !== undefined) {
		const cur = typeof sysItem.system.uses === "object" ? Number(sysItem.system.uses.value) : Number(sysItem.system.uses);
		if (Number.isFinite(cur) && cur > 0) {
			const next = Math.max(0, cur - cost);
			await sysItem.update?.(typeof sysItem.system.uses === "object" ? { "system.uses.value": next } : { "system.uses": next });
		}
	}
}

async function applyUltraArgusArmorLoss(actor) {
	if (!actor?.isOwner || !hasNpcFeature(actor, ["npcf_cn_ultra_18", "npcf_argus_armor_ultra"], ["阿耳戈斯装甲", "阿尔戈斯装甲"])) return false;
	const curArmor = Number(actor.system?.armor) || 0;
	const prevLoss = Number(getCombatState(actor).argusArmorLoss) || 0;
	const stepLoss = Math.min(2, Math.max(0, curArmor));
	if (stepLoss <= 0) return false;
	const totalLoss = prevLoss + stepLoss;
	await setCombatState(actor, { argusArmorLoss: totalLoss });
	const ADD_MODE = globalThis.CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2;
	await syncCpActiveEffect(actor, "ultra_argus_armor", `阿耳戈斯装甲破损 (-${totalLoss} 装甲)`, [
		{ key: "system.armor", mode: ADD_MODE, value: String(-totalLoss), priority: 40 },
	]);
	if (typeof actor.prepareData === "function") {
		try { actor.prepareData(); } catch { /* ignore */ }
	} else if (actor.system && Number.isFinite(Number(actor.system.armor))) {
		actor.system.armor = Math.max(0, curArmor - stepLoss);
	}
	await postCpEffectCard(
		actor,
		"超体 · 阿耳戈斯装甲剥落",
		`<p><b>${escHtml(actor.token?.name ?? actor.name)}</b> 进行结构/过热检定，触发<b>阿耳戈斯装甲</b>：失去 <b>${stepLoss} 点装甲</b>（累计 -${totalLoss}，当前装甲：<b>${Math.max(0, Number(actor.system?.armor) ?? (curArmor - stepLoss))}</b>）。</p>`,
	);
	return true;
}

async function onCreateChatMessage(message, _options, userId) {
	const isCreator = userId ? game.user?.id === userId : Boolean(message?.isAuthor);
	if (!isCreator) return;
	if (message.getFlag?.(MODULE_ID, "appliedStatuses") || message.getFlag?.(MODULE_ID, "grappleState")) return;
	const autoApply = getSetting("autoApplyStatus", true);

	const records = [];
	const recordAdd = (uuid, name, st) => {
		let r = records.find(x => x.uuid === uuid);
		if (!r) { r = { uuid, name, statuses: [] }; records.push(r); }
		if (!r.statuses.includes(st)) r.statuses.push(st);
	};

	// 1. 结构 / 过热表卡片自动挂状态 + 机甲骨架被动（成吉思紧急通风、帝王蝶风暴盾、炎魔停再生、谢尔曼排热）+ 超体阿耳戈斯装甲 + 老兵假死
	const tableFlag = message.getFlag?.(MODULE_ID, "tableStatuses");
	if (tableFlag?.actorUuid) {
		const actor = combatMechOf(resolveActor(tableFlag.actorUuid)) ?? resolveActor(tableFlag.actorUuid);
		const uuid = preferredTargetUuid(actor) ?? tableFlag.actorUuid;
		if (autoApply && tableFlag.statuses?.length) {
			for (const st of tableFlag.statuses) {
				const res = await setActorStatus(uuid, st, true);
				if (res.changed) recordAdd(uuid, res.name, st);
			}
		}
		if (actor?.isOwner) {
			const fLid = mechFrameLid(actor);
			if (tableFlag.kind === "structure") {
				if (talentRank(actor, "t_ext_crusher") >= 2) {
					await setCombatState(actor, { crusherStructBonus: true });
				}
				if (hasCoreBonus(actor, "cb_the_lesson_of_transubstantiation")) {
					const res = await setActorStatus(uuid, "intangible", true);
					if (res.changed) recordAdd(uuid, res.name, "intangible");
				}
				if (fLid === "mf_genghis" && (Number(actor.system?.heat?.value) || 0) > 0) {
					await actor.update?.({ "system.heat.value": 0 });
					if (actor.statuses?.has?.("dangerzone")) await actor.toggleStatusEffect?.("dangerzone", { active: false });
					await postCpEffectCard(actor, "成吉思 · 紧急通风", `<p><b>${escHtml(actor.name)}</b> 受到结构伤害触发<b>紧急通风</b>：已自动冷却全部热度！</p>`);
				}
				if (fLid === "mf_emperor") {
					const grit = Number(actor.system?.grit ?? actor.system?.pilot?.value?.system?.grit) || 0;
					const shieldVal = 6 + grit;
					if ((Number(actor.system?.overshield?.value) || 0) < shieldVal) {
						await actor.update?.({ "system.overshield.value": shieldVal });
						await postCpEffectCard(actor, "帝王蝶 · 风暴盾刷新", `<p><b>${escHtml(actor.name)}</b> 受到结构伤害刷新<b>风暴盾</b>：护盾恢复至 <b>${shieldVal}</b>！</p>`);
					}
				}
				if (fLid === "mf_balor") {
					await setCombatState(actor, { balorRegenPaused: true });
				}
				await applyUltraArgusArmorLoss(actor);
				if (tableFlag.statuses?.includes("downandout") || (Number(actor.system?.structure?.value) || 0) <= 0) {
					await checkAndTriggerVeteranFeignDeath(actor);
				}
			}
			if (tableFlag.kind === "overheat") {
				if (hasCoreBonus(actor, "cb_stasis_shielding")) {
					for (const rid of RESIST_IDS) {
						const res = await setActorStatus(uuid, rid, true);
						if (res.changed) recordAdd(uuid, res.name, rid);
					}
				}
				if (fLid === "mf_balor") {
					await setCombatState(actor, { balorRegenPaused: true });
				}
				if (fLid === "mf_sherman" && autoApply) {
					const res = await setActorStatus(uuid, "cover_soft", true);
					if (res.changed) recordAdd(uuid, res.name, "cover_soft");
					await setCombatState(actor, { shermanVentSoftCover: true });
				}
				await applyUltraArgusArmorLoss(actor);
			}
		}
		if (records.length) await message.setFlag?.(MODULE_ID, "appliedStatuses", records);
		return;
	}

	const info = analyzeCard(message);
	if (!info) return;
	const basicKey = message?.getFlag?.(MODULE_ID, "basicAction") ?? message?.flags?.[MODULE_ID]?.basicAction;
	const cpAtk = message?.getFlag?.(MODULE_ID, "cpAttack") ?? message?.flags?.[MODULE_ID]?.cpAttack ?? null;

	// 2. 攻击卡：消除消耗的锁定 + 自动施加无条件命中 / 会心状态 + CP / 武器 / 科技 / 天赋联动 + 擒拿控场初始化
	if (info.isAttack && info.attack) {
		const attActor = combatMechOf(info.actor ?? resolveActor(info.actorUuid)) ?? info.actor;
		const targets = info.attack.targets ?? [];
		const anyHit = targets.some(t => t.hit || t.crit);
		const wLid = weaponLidOf(info.item);
		const modLid = weaponModLidOf(info.item);
		const profIdx = Number(info.item?.system?.selected_profile_index) || 0;
		const benefitsTalent = itemBenefitsFromTalents(info.item);
		const benefitsCb = itemBenefitsFromCoreBonuses(info.item);

		if (attActor?.isOwner) {
			await ensureCombatTurnState(attActor);
			const stBefore = getCombatState(attActor);
			if (stBefore.skirmisherSoftCover) {
				await setActorStatus(preferredTargetUuid(attActor) ?? attActor.uuid, "cover_soft", false);
				await setCombatState(attActor, { skirmisherSoftCover: false, attackedOrForcedSaveThisTurn: true });
			} else {
				await setCombatState(attActor, { attackedOrForcedSaveThisTurn: true });
			}
		}

		const oleanderActive = Boolean(isCoreActiveOn(attActor, "mf_ext_oleander") && isHeavyRangedWeapon(info.item));
		const mitchellActive = Boolean(isCoreActiveOn(attActor, "mf_ext_mitchell") && isRangedWeaponItem(info.item));
		const nightCutterUsed = Boolean(
			isCoreActiveOn(attActor, "mf_ext_night_cutter")
			&& getCoreState(attActor).perfectShotArmed
			&& isRifleWeapon(info.item)
			&& targets.some(t => t.setConditions?.lockon === false || t.setConditions?.lockOn === false),
		);
		const heavyGunnerReaction = Boolean(
			!info.isTech && isHeavyRangedWeapon(info.item) && getCombatState(attActor).heavyGunnerReactionArmed,
		);
		let stormbringerR1Fired = false;

		if (autoApply) {
			for (const t of targets) {
				const usedLockOn = Boolean(t.setConditions?.lockon === false || t.setConditions?.lockOn === false);
				if (usedLockOn) {
					await setActorStatus(t.uuid, "lockon", false);
				}
				const want = [];
				if (t.hit || t.crit) {
					for (const st of info.autoHitStatuses) if (!want.includes(st)) want.push(st);
					if (cpAtk?.kind === "chomolungmaPulse") {
						for (const st of ["impaired", "slow"]) if (!want.includes(st)) want.push(st);
					}
					if (cpAtk?.kind === "raleighMjolnir" && Number(cpAtk.chambers) >= 4 && !want.includes("shredded")) want.push("shredded");
					if (mitchellActive && !want.includes("shredded")) want.push("shredded");
					// 兴风者 I「地震倾洪」：每轮 1 次，发射器消耗锁定命中时击倒伏卧
					if (!info.isTech && benefitsTalent && usedLockOn && weaponHasType(info.item, "Launcher") && talentRank(attActor, "t_stormbringer") >= 1 && !getCombatState(attActor).usedStormbringerR1 && !stormbringerR1Fired) {
						if (!want.includes("prone")) want.push("prone");
						stormbringerR1Fired = true;
					}
					// 重炮手 II「锤击」：掩护火力反应攻击命中时施加固定
					if (heavyGunnerReaction && talentRank(attActor, "t_heavy_gunner") >= 2 && !want.includes("immobilized")) {
						want.push("immobilized");
					}
					// 法罗斯「有效载荷制导」：远程武器命中没有掩护的角色时自动施加锁定
					if (!info.isTech && mechFrameLid(attActor) === "mf_ext_pharos" && isRangedWeaponItem(info.item) && !want.includes("lockon")) {
						const tActor = resolveActor(t.uuid);
						if (!tActor?.statuses?.has?.("cover_soft") && !tActor?.statuses?.has?.("cover_hard")) {
							want.push("lockon");
						}
					}
				} else {
					if ((cpAtk?.kind === "chomolungmaPulse" || nightCutterUsed) && !want.includes("impaired")) want.push("impaired");
				}
				if (t.crit) {
					for (const st of info.autoCritStatuses) if (!want.includes(st)) want.push(st);
					if (oleanderActive && !want.includes("prone")) want.push("prone");
					// 百臂 II「暴露弱点」：巢房消耗锁定造成会心一击时施加离散
					if (!info.isTech && benefitsTalent && usedLockOn && weaponHasType(info.item, "Nexus") && talentRank(attActor, "t_centimane") >= 2 && !want.includes("shredded")) {
						want.push("shredded");
					}
				}
				// 弗拉德「肢解」：使其他角色陷入固定时，目标同时陷入离散
				if (want.includes("immobilized") && mechFrameLid(attActor) === "mf_vlad" && !sameActorRef(t.uuid, attActor) && !want.includes("shredded")) {
					want.push("shredded");
				}
				for (const st of want) {
					const res = await setActorStatus(t.uuid, st, true);
					if (res.changed) recordAdd(t.uuid, res.name, st);
				}
			}
		}
		if (stormbringerR1Fired && attActor?.isOwner) {
			await setCombatState(attActor, { usedStormbringerR1: true });
		}
		// 施托特贝克「动力装填」：非副近战武器会心重装本回合未使用的装填远程武器；非副远程武器会心重装本回合未使用的装填近战武器
		if (!info.isTech && info.item && mechFrameLid(attActor) === "mf_störtebeker" && attActor?.isOwner) {
			const prevUsed = getCombatState(attActor).stortebekerUsedWeaponIds ?? [];
			const curKey = weaponTrackKey(info.item);
			const nextUsed = curKey && !prevUsed.includes(curKey) ? [...prevUsed, curKey] : prevUsed;
			await setCombatState(attActor, { stortebekerUsedWeaponIds: nextUsed });
			if (targets.some(t => t.crit) && info.item.system?.size && info.item.system.size !== "Auxiliary") {
				const atkMelee = isMeleeWeaponItem(info.item);
				const atkRanged = isRangedWeaponItem(info.item);
				const reloadables = (attActor.items ?? []).filter(w => {
					if (!w || w === info.item || w.system?.destroyed) return false;
					if (w.type !== "mech_weapon" && !w.is_mech_weapon?.()) return false;
					if (w.system?.loaded !== false) return false;
					const hasLoad = w.isLoading?.() || [...(weaponProfileOf(w)?.tags ?? []), ...(w.system?.tags ?? [])].some(tg => tg?.is_loading || tg?.lid === "tg_loading");
					if (!hasLoad) return false;
					if (nextUsed.includes(weaponTrackKey(w))) return false;
					return atkMelee ? isRangedWeaponItem(w) : (atkRanged ? isMeleeWeaponItem(w) : false);
				});
				if (reloadables.length) {
					for (const rw of reloadables) {
						if (typeof rw.update === "function") await rw.update({ "system.loaded": true });
						else if (rw.system) rw.system.loaded = true;
					}
					await postCpEffectCard(
						attActor,
						"施托特贝克 · 动力装填",
						`<p><b>${escHtml(attActor.name)}</b> 会心一击触发<b>动力装填</b>：已自动装填 <b>${reloadables.map(w => escHtml(w.name)).join("、")}</b>！</p>`,
					);
				}
			}
		}

		// 柔剑「亲和力中断」：若未命中任何目标，无需消耗 CP（立即返还 1 CP）
		if (cpAtk?.kind === "joukenInterrupt" && targets.length > 0 && !anyHit && attActor?.isOwner) {
			await endCorePower(attActor, { reason: "亲和力中断未命中返还 CP", refundOverride: true });
			ui?.notifications?.info?.("柔剑「亲和力中断」未命中：已自动返还 1 点核心能量（CP）！");
		}

		// 汇总本次攻击携带进 DamageRollFlow 的伤害修正（CP / 非因果律模块 / 自适应重量 / 突击加农炮旋转 / 先见之训 / 掩护火力减半 / 快枪手心杀）
		const dmgModPatch = {};
		if (oleanderActive && attActor?.isOwner) {
			const curHeat = Number(attActor.system?.heat?.value) || 0;
			if (curHeat > 0) await attActor.update?.({ "system.heat.value": Math.max(0, curHeat - 2) });
			dmgModPatch.oleanderCritParacausal = true;
		}
		if (nightCutterUsed && attActor?.isOwner) {
			await setCoreState(attActor, { perfectShotArmed: false });
			Object.assign(dmgModPatch, { paracausal: true, minReliable: 3, nightCutterHitChoice: true });
		}
		if (modLid === "wm_paracausal_mod") dmgModPatch.paracausal = true;
		const adpRel = adaptiveWeightMinReliable(info.item);
		if (adpRel > 0) dmgModPatch.minReliable = Math.max(dmgModPatch.minReliable || 0, adpRel);
		if (wLid === "mw_assault_cannon" && profIdx === 1) {
			dmgModPatch.minReliable = Math.max(dmgModPatch.minReliable || 0, 3);
			if (autoApply && attActor?.isOwner) await setActorStatus(preferredTargetUuid(attActor) ?? attActor.uuid, "slow", true);
		}
		if (wLid === "mw_leviathan_heavy_assault_cannon" && profIdx === 1 && autoApply && attActor?.isOwner) {
			await setActorStatus(preferredTargetUuid(attActor) ?? attActor.uuid, "slow", true);
		}
		if (wLid === "mw_ext_wodeng_mk12" && profIdx === 1 && autoApply && attActor?.isOwner) {
			const selfU = preferredTargetUuid(attActor) ?? attActor.uuid;
			await setActorStatus(selfU, "immobilized", true);
			await setActorStatus(selfU, "cover_hard", true);
		}
		if (wLid === "mw_fuel_rod_gun" && attActor?.isOwner) {
			const curHeat = Number(attActor.system?.heat?.value) || 0;
			if (curHeat > 0) await attActor.update?.({ "system.heat.value": Math.max(0, curHeat - 4) });
		}
		if (heavyGunnerReaction && attActor?.isOwner) {
			dmgModPatch.halfAllTargets = true;
			await setCombatState(attActor, { heavyGunnerReactionArmed: false });
		}

		// 科技攻击专属命中结算：圣武士碎片整理 +3 护盾、欧西里斯第 1~4 门递进、先见之训标记
		if (info.isTech && attActor?.isOwner) {
			if (info.attack.invade && anyHit && hasMechSystem(attActor, "ms_ext_paladin_defrag")) {
				const curOs = Number(attActor.system?.overshield?.value) || 0;
				if (curOs < 3) await attActor.update?.({ "system.overshield.value": 3 });
			}
			if ((wLid === "ms_osiris_class_nhp" || info.osirisGate) && anyHit) {
				const curGate = Math.min(4, Math.max(1, Number(info.osirisGate ?? getCombatState(attActor).osirisGate) || 1));
				const nextGate = curGate >= 4 ? 1 : curGate + 1;
				await setCombatState(attActor, { osirisGate: nextGate });
				if (curGate === 1) {
					await postCpEffectCard(attActor, "欧西里斯 · 抛入杜阿特（第一门）", `<p><b>第一门</b>生效：由你控制目标下一回合的<b>标准移动</b>！（下次命中推进至第二门）</p>`);
				} else if (curGate === 4) {
					await postCpEffectCard(attActor, "欧西里斯 · 抛入杜阿特（第四门）", `<p><b>第四门</b>生效：目标直至其下一回合结束<b>暂时转为友方阵营</b>（若你或友方对其造成伤害/热度、攻击或迫使豁免则立即解除；下次重回第一门）！</p>`);
				}
			}
			if (anyHit && hasCoreBonus(attActor, "cb_the_lesson_of_thinking_tomorrows_thought")) {
				const hitU = targets.find(t => t.hit || t.crit)?.uuid;
				if (hitU) await setCombatState(attActor, { tomorrowsThoughtTargetUuid: hitU });
			}
		}

		// 武器 / 基础攻击的天赋骰与战斗状态推进
		if (attActor?.isOwner) {
			// 暴虐 III「无情」：未命中累加不懈骰，命中归零
			if (targets.length > 0 && benefitsTalent && talentRank(attActor, "t_brutal") >= 3) {
				if (anyHit) {
					if ((getTalentDie(attActor, "brutal") || 0) > 0) await setTalentDie(attActor, "brutal", 0);
				} else {
					await setTalentDie(attActor, "brutal", (getTalentDie(attActor, "brutal") || 0) + 1);
				}
			}
			if (!info.isTech) {
				const cs = getCombatState(attActor);
				// 先见之训：近战攻击已锁定该科技目标时赋予不可减免并消耗标记
				if (benefitsCb && isMeleeWeaponItem(info.item) && cs.tomorrowsThoughtTargetUuid && targets.some(t => sameActorRef(cs.tomorrowsThoughtTargetUuid, t.uuid))) {
					dmgModPatch.paracausal = true;
					await setCombatState(attActor, { tomorrowsThoughtTargetUuid: null });
				}
				// 决斗士 I/II：主近战使用记录 + 命中得 1 颗剑圣骰（1/轮）
				if (benefitsTalent && info.item?.system?.size === "Main" && isMeleeWeaponItem(info.item)) {
					const nextPatch = { usedFirstMainMelee: true };
					if (anyHit && talentRank(attActor, "t_duelist") >= 2 && !cs.usedDuelistDieRound) {
						await setTalentDie(attActor, "duelist", (getTalentDie(attActor, "duelist") || 0) + 1);
						nextPatch.usedDuelistDieRound = true;
					}
					await setCombatState(attActor, nextPatch);
				}
				// 枪侠 I/III：副远程使用记录 + 快枪手骰递减 / 「我用心杀戮」重置为 6 并赋予 +2d6 + AP
				if (benefitsTalent && info.item?.system?.size === "Auxiliary" && isRangedWeaponItem(info.item)) {
					await setCombatState(attActor, { usedFirstAuxRanged: true });
					if (message.getFlag?.(MODULE_ID, "gunslingerHeartKill")) {
						await setTalentDie(attActor, "gunslinger", 6);
						dmgModPatch.ap = true;
						dmgModPatch.gunslingerBonus2d6 = true;
					} else if (anyHit && talentRank(attActor, "t_gunslinger") >= 3) {
						const curG = getTalentDie(attActor, "gunslinger") ?? 6;
						if (curG > 1) await setTalentDie(attActor, "gunslinger", curG - 1);
					}
				}
				// 拳师 III：擒拿 / 冲撞 / 权宜攻击使拳师骰 -1（最低 1）
				if ((basicKey === "grapple" || basicKey === "ram" || basicKey === "improvised") && talentRank(attActor, "t_brawler") >= 3) {
					const curB = getTalentDie(attActor, "brawler") ?? 6;
					if (curB > 1) await setTalentDie(attActor, "brawler", curB - 1);
				}
				// 混合作战 III「腥风血雨」：近战命中赋能下次远程 +1 准度，远程命中赋能下次近战 +1 准度
				if (anyHit && benefitsTalent && talentRank(attActor, "t_combined_arms") >= 3) {
					const hitU = targets.find(t => t.hit || t.crit)?.uuid ?? null;
					const mode = (info.item ? isMeleeWeaponItem(info.item) : Boolean(basicKey)) ? "melee" : "ranged";
					await setCombatState(attActor, { stormOfViolenceLast: mode, stormOfViolenceTargetUuid: hitU });
				}
				// 群聚巢房：前置叠加层数计入本次额外伤害，命中后层数 +1（上限 3，达到 4 时归零）
				if (wLid === "mw_ext_comet_swarm") {
					const prevStacks = Number(cs.cometSwarmStacks) || 0;
					if (prevStacks > 0) dmgModPatch.cometSwarmBonus = prevStacks;
					if (anyHit) {
						await setCombatState(attActor, { cometSwarmStacks: prevStacks >= 3 ? 0 : prevStacks + 1 });
					}
				}
				// 智能刀：消耗锁定时升级为 1d6+3 穿甲动能伤害
				if (wLid === "mw_ch_smart_blade" && targets.some(t => t.setConditions?.lockon === false || t.setConditions?.lockOn === false)) {
					dmgModPatch.ap = true;
					dmgModPatch.smartBladeUsedLockOn = true;
				}
				// 自走兵器库：结算弹药库充能消耗与特殊伤害转换标记
				const usedAmmo = message.getFlag?.(MODULE_ID, "walkingArmoryAmmo");
				if (usedAmmo) {
					dmgModPatch.walkingArmoryAmmo = usedAmmo;
					if (usedAmmo === "sabot") dmgModPatch.ap = true;
					await deductWalkingArmoryAmmo(attActor, usedAmmo, Boolean(targets[0]?.crit));
					await setTalentConfig(attActor, { walkingArmoryAmmo: "" });
					await setCombatState(attActor, { usedWalkingArmoryTurn: true });
				}
				// 投掷近战武器：攻击结算后标记武器离手，拾回或「匕首戏法」回合结束飞回前不可重复使用
				if (message.getFlag?.(MODULE_ID, "thrownAttack") && info.item) {
					await markWeaponThrown(attActor, info.item, targets[0]?.uuid ?? null);
				}
			}
		}

		if (Object.keys(dmgModPatch).length && attActor?.isOwner) {
			const prevMod = message.getFlag?.(MODULE_ID, "cpDamageMod") ?? {};
			await message.setFlag?.(MODULE_ID, "cpDamageMod", { ...prevMod, ...dmgModPatch });
		}

		if (basicKey === "grapple" || basicKey === "npcGrapple") {
			const hitTarget = targets.find(t => t.hit || t.crit);
			if (hitTarget) {
				const defDoc = resolveDocSync(hitTarget.uuid);
				const defActor = defDoc?.actor ?? resolveActor(hitTarget.uuid);
				const attUuid = preferredTargetUuid(attActor) ?? info.actorUuid;
				const attName = attActor?.token?.name ?? attActor?.name ?? "攻击方";
				const defName = defDoc?.name ?? defActor?.token?.name ?? defActor?.name ?? "防御方";
				const attBase = actorBaseSize(attActor), defBase = actorBaseSize(defActor);
				const attEff = effectiveGrappleSize(attActor, defBase, { isGrappler: true });
				const defEff = effectiveGrappleSize(defActor, attBase, { isGrappler: false });
				const sameSize = Math.abs(attEff - defEff) < 0.01;
				// 官方 FAQ 0d9e7e：同体型擒拿命中时由发起擒拿的一方立刻取得初始控制权
				const controller = defEff > attEff ? "defender" : "attacker";
				const controlledUuid = controller === "defender" ? attUuid : hitTarget.uuid;
				if (autoApply && controlledUuid) {
					const res = await setActorStatus(controlledUuid, "immobilized", true);
					if (res.changed) recordAdd(controlledUuid, res.name, "immobilized");
				}
				await message.setFlag?.(MODULE_ID, "grappleState", {
					active: true,
					attackerUuid: attUuid, attackerName: attName,
					defenderUuid: hitTarget.uuid, defenderName: defName,
					attEff, defEff, sameSize, controller,
				});
			}
		}
	} else if (!info.isAttack) {
		const mech = combatMechOf(info.actor) ?? info.actor;
		const mechUuid = preferredTargetUuid(mech) ?? info.actorUuid;
		if (info.saves?.length && mech?.isOwner) {
			await ensureCombatTurnState(mech);
			if (getCombatState(mech).skirmisherSoftCover) {
				await setActorStatus(mechUuid, "cover_soft", false);
				await setCombatState(mech, { skirmisherSoftCover: false, attackedOrForcedSaveThisTurn: true });
			} else {
				await setCombatState(mech, { attackedOrForcedSaveThisTurn: true });
			}
		}
		if (autoApply && info.selfAutoStatuses.length && mechUuid) {
			// 3. 非攻击系统 / 动作卡：自动施加明确的自身增益 / 抗性
			for (const st of info.selfAutoStatuses) {
				const res = await setActorStatus(mechUuid, st, true);
				if (res.changed) recordAdd(mechUuid, res.name, st);
			}
		}
		// 4. 骨架自带核心子动作卡联动（如鬼面蛾「死印 / 停止专注」、哥布林「脱离」等）
		const actName = String(info.actionData?.action?.name || info.title || "").trim();
		if (info.item?.type === "frame" && mech?.isOwner && !info.isCoreActivation && actName) {
			if (actName === "死印") await executeCoreAction(mech, "deathsHeadMark");
			else if (actName === "停止专注") await executeCoreAction(mech, "deathsHeadUnmark");
			else if (/关闭|脱离/.test(actName)) await deactivateCoreEffect(mech, actName);
		}
		// 5. 天赋与特殊科技系统非攻击动作卡自动结算（v1.13.0）
		if (mech?.isOwner) {
			await handleNonAttackTalentOrSystemCard(info, mech, mechUuid, autoApply, recordAdd);
		}
	}

	if (records.length) await message.setFlag?.(MODULE_ID, "appliedStatuses", records);
}

async function handleNonAttackTalentOrSystemCard(info, mech, mechUuid, autoApply, recordAdd) {
	const actName = String(info.actionData?.action?.name || info.title || "").trim();
	const itemLid = String(info.item?.system?.lid ?? "");
	const userTgs = Array.from(game.user?.targets ?? []);
	const targetMech = (talentRank(mech, "t_black_thumb") >= 3 && userTgs[0]?.actor) ? userTgs[0].actor : mech;
	const targetUuid = (talentRank(mech, "t_black_thumb") >= 3 && userTgs[0]) ? (userTgs[0].document?.uuid ?? userTgs[0].uuid) : mechUuid;

	// 神枪手 I「稳定瞄准」：进入固定并激活步枪 +1 准度
	if (itemLid === "t_crack_shot" || /稳定瞄准|保持稳定/.test(actName)) {
		if (autoApply && mechUuid) {
			const res = await setActorStatus(mechUuid, "immobilized", true);
			if (res.changed) recordAdd(mechUuid, res.name, "immobilized");
		}
		await setCombatState(mech, { steadyAim: true });
		return;
	}
	// 黑拇指 II「扑灭 / 战场修复 / 操控排气阀」
	if (/扑灭/.test(actName)) {
		if (targetMech?.isOwner) await targetMech.update?.({ "system.burn": 0 });
		if (autoApply && targetUuid) {
			const res = await setActorStatus(targetUuid, "resistance_burn", true);
			if (res.changed) recordAdd(targetUuid, res.name, "resistance_burn");
		}
		return;
	}
	if (/战场修复/.test(actName)) {
		if (targetMech?.isOwner) {
			const curOs = Number(targetMech.system?.overshield?.value) || 0;
			if (curOs < 2) await targetMech.update?.({ "system.overshield.value": 2 });
		}
		const cond = ["slow", "immobilized"].find(id => targetMech?.statuses?.has?.(id) && !(id === "immobilized" && (isGrappleImmobilized(targetUuid) || isCoreSustainedImmobilized(targetMech))));
		if (cond && targetUuid) await setActorStatus(targetUuid, cond, false);
		return;
	}
	if (/操控排气阀/.test(actName)) {
		if (targetMech?.isOwner) {
			const curHeat = Number(targetMech.system?.heat?.value) || 0;
			if (curHeat > 0) await targetMech.update?.({ "system.heat.value": Math.max(0, curHeat - 2) });
		}
		const cond = ["impaired", "jammed"].find(id => targetMech?.statuses?.has?.(id));
		if (cond && targetUuid) await setActorStatus(targetUuid, cond, false);
		return;
	}
	// 决斗士 II「格挡 / 偏射 / 佯攻 / 绊脚」：自动消耗剑圣骰并赋予抗性
	if (itemLid === "t_duelist" || /^(?:格挡|偏射|佯攻|绊脚)$/.test(actName)) {
		const curDie = getTalentDie(mech, "duelist") ?? 0;
		if (curDie > 0) await setTalentDie(mech, "duelist", curDie - 1);
		if (/格挡/.test(actName) && autoApply && mechUuid) {
			for (const rid of RESIST_IDS) {
				const res = await setActorStatus(mechUuid, rid, true);
				if (res.changed) recordAdd(mechUuid, res.name, rid);
			}
		} else if (/偏射/.test(actName)) {
			const roll = await new Roll("1d6").evaluate();
			const ok = Number(roll.total) >= 5;
			if (ok && autoApply && mechUuid) {
				for (const rid of RESIST_IDS) {
					const res = await setActorStatus(mechUuid, rid, true);
					if (res.changed) recordAdd(mechUuid, res.name, rid);
				}
			}
			await postCpEffectCard(mech, "剑圣 · 偏射检定", `<p>消耗 1 颗剑圣骰掷出 1d6 = <b>${roll.total}</b> → ${ok ? "<b>成功（5+）！已获得全伤害抗性</b>" : "未达 5+，未能偏射本次远程攻击"}。</p>`);
		}
		return;
	}
	// 重炮手 I「掩护火力」与「掩护火力攻击」
	if (itemLid === "t_heavy_gunner" || /掩护火力/.test(actName)) {
		if (/攻击/.test(actName)) {
			await setCombatState(mech, { heavyGunnerReactionArmed: true });
			ui?.notifications?.info?.("已进入「掩护火力反应攻击」状态：下一次重型远程武器攻击伤害自动减半（R2 命中自动施加固定）！");
		} else if (autoApply && userTgs.length) {
			const maxT = talentRank(mech, "t_heavy_gunner") >= 3 ? 2 : 1;
			for (const t of userTgs.slice(0, maxT)) {
				const u = t.document?.uuid ?? t.uuid;
				if (!u) continue;
				const res = await setActorStatus(u, "impaired", true);
				if (res.changed) recordAdd(u, res.name, "impaired");
			}
		}
		return;
	}
	// 拳师 III「击倒技」：重置拳师骰为 6
	if (itemLid === "t_brawler" && /击倒技/.test(actName)) {
		await setTalentDie(mech, "brawler", 6);
		return;
	}
	// 兴风者 III「大规模攻击（洪流）」：重置洪流骰为 6
	if (itemLid === "t_stormbringer" && /大规模攻击|洪流/.test(actName)) {
		await setTalentDie(mech, "stormbringer", 6);
		return;
	}
	// 潘克拉蒂 II「英勇冲锋」：对目标/邻接敌人施加缓慢
	if (itemLid === "t_pankrati" && /英勇冲锋/.test(actName)) {
		if (autoApply) {
			const selfTok = attackerToken(mech);
			const myDisp = selfTok?.document?.disposition ?? 1;
			const pool = userTgs.length
				? userTgs
				: (globalThis.canvas?.tokens?.placeables ?? []).filter(t => t !== selfTok && t.actor && (t.document?.disposition ?? -1) !== myDisp && (selfTok ? (tokenDistance(selfTok, t) ?? 99) <= 1 : false));
			for (const t of pool) {
				const u = t.document?.uuid ?? t.uuid;
				if (!u) continue;
				const res = await setActorStatus(u, "slow", true);
				if (res.changed) recordAdd(u, res.name, "slow");
			}
		}
		return;
	}
	// 偶像破坏者 II/III「内化火花」：递减超然骰，在 1 时重置为 3 并激活超然状态
	if ((itemLid === "t_iconoclast" || /内化火花/.test(actName)) && /内化火花/.test(actName)) {
		if (talentRank(mech, "t_iconoclast") >= 3 && !getCombatState(mech).transcendActive) {
			const curI = getTalentDie(mech, "iconoclast") ?? 3;
			if (curI <= 1) {
				await setTalentDie(mech, "iconoclast", 3);
				await setCombatState(mech, { transcendActive: true, transcendTurnsLeft: 1 });
				ui?.notifications?.info?.("偶像破坏者「超然」已激活：模因火花 +4 伤害 / +5 射程，持续至下一回合结束！");
			} else {
				await setTalentDie(mech, "iconoclast", curI - 1);
			}
		}
		return;
	}
	// 领袖「下达指令 / 下达命令」：消耗 1 颗领导骰
	if (itemLid === "t_leader" && /下达指|下达命/.test(actName)) {
		const curL = getTalentDie(mech, "leader") ?? 0;
		if (curL > 0) await setTalentDie(mech, "leader", curL - 1);
		return;
	}
	// 西西弗斯级 NHP「扭曲概率」：自动掷 2d20 并记录 X / Y
	if ((itemLid === "ms_sisyphus_class_nhp" || /扭曲概率/.test(actName)) && !/概率吞食/.test(actName)) {
		const r1 = await new Roll("1d20").evaluate();
		const r2 = await new Roll("1d20").evaluate();
		const rolls = [Number(r1.total) || 10, Number(r2.total) || 10];
		await setCombatState(mech, { sisyphusRolls: rolls });
		await postCpEffectCard(mech, "西西弗斯级 NHP · 扭曲概率", `<p>已预存两枚概率吞食掷骰结果：<b>X = ${rolls[0]}</b>，<b>Y = ${rolls[1]}</b>（持续至下一回合结束）。</p>`);
		return;
	}
	// 拟态枪「激怒拟态枪」：重新掷 3d20 设定 [X, Y, Z]
	if (itemLid === "mw_mimic_gun" || /激怒拟态枪/.test(actName)) {
		await rollMimicGunValues(mech);
		return;
	}
	// 演说家 I「巧言辞令」：对扫描目标施加受损
	if ((itemLid === "mf_orator" || itemLid === "t_orator" || itemLid === "t_ext_orator") && /巧言辞令/.test(actName)) {
		if (autoApply && userTgs[0]) {
			const u = userTgs[0].document?.uuid ?? userTgs[0].uuid;
			const prevU = getCombatState(mech).oratorSilverTongueUuid;
			if (prevU && prevU !== u) await setActorStatus(prevU, "impaired", false);
			const r = await setActorStatus(u, "impaired", true);
			if (r.changed) recordAdd(u, r.name, "impaired");
			await setCombatState(mech, { oratorSilverTongueUuid: u });
		}
		return;
	}
	// 勘探者 I「创造进口」：发动后直到当前回合结束不能采取反应
	if (itemLid === "t_prospector" || itemLid === "t_ext_prospector" || /创造进口|Create Entrance/i.test(actName)) {
		await ensureCombatTurnState(mech);
		await setCombatState(mech, { prospectorNoReactionTurn: true });
		return;
	}
	// 人因故障（PEBCAC）：自动掷 1d6 副作用表
	if (itemLid === "ms_pebcac" || /人因故障/.test(actName)) {
		const roll = await new Roll("1d6").evaluate();
		const n = Number(roll.total) || 1;
		const tableDesc = {
			1: "1：目标陷入<b>受扰</b>，直到其下一回合结束。",
			2: "2：目标向 GM 决定的方向强制移动等同其速度的空间。",
			3: "3：目标立即向最近的角色（不论敌我）移动最多 3 格并对其发起<b>权宜攻击</b>。",
			4: "4：目标<b>伏卧</b>，并受到 <b>2 点动能伤害</b>。",
			5: "5：目标立即排散 <b>1d6 热度</b>，并对所有邻接角色造成等量的能量伤害。",
			6: "6：目标立即以自由动作执行一次<b>稳住阵脚</b>（自行选择效果）。",
		}[n];
		const tUuid = userTgs[0] ? (userTgs[0].document?.uuid ?? userTgs[0].uuid) : mechUuid;
		if (autoApply && tUuid) {
			if (n === 1) { const r = await setActorStatus(tUuid, "jammed", true); if (r.changed) recordAdd(tUuid, r.name, "jammed"); }
			if (n === 4) { const r = await setActorStatus(tUuid, "prone", true); if (r.changed) recordAdd(tUuid, r.name, "prone"); }
		}
		await postCpEffectCard(mech, `人因故障 · 副作用 d6 = ${n}`, `<p>${tableDesc}</p>`, { allowAutoScan: n === 4 });
	}
}

const STAT_LABELS_ZH = { hull: "机体", agi: "敏捷", sys: "系统", eng: "工程", grit: "毅力" };

async function pickPilotCheckSpec(pilot, title, { preferLids = [], chosenSpec = null } = {}) {
	if (chosenSpec) return chosenSpec;
	const skills = (pilot?.items ?? []).filter(i => i.type === "skill" || i.is_skill?.());
	const sorted = [...skills].sort((a, b) => {
		const ia = preferLids.indexOf(String(a.system?.lid ?? ""));
		const ib = preferLids.indexOf(String(b.system?.lid ?? ""));
		return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
	});
	const gritBonus = Number(pilot?.system?.grit) || 0;
	const gritOpt = { mode: "stat", statKey: "grit", label: "毅力", buttonLabel: `毅力 (+${gritBonus})` };
	if (!sorted.length) return gritOpt;
	const choices = [
		...sorted.map(s => ({
			mode: "skill",
			itemUuid: s.uuid,
			item: s,
			label: s.name ?? "技能触发",
			buttonLabel: `${s.name ?? "技能触发"} (+${(Number(s.system?.curr_rank) || 0) * 2})`,
		})),
		gritOpt,
	];
	const DialogV2 = foundry?.applications?.api?.DialogV2;
	if (!DialogV2?.wait) return choices[0];
	try {
		const picked = await DialogV2.wait({
			window: { title },
			content: `<p>请选择本次检定使用的驾驶员技能触发（若无适用触发可选毅力）：</p>`,
			buttons: choices.map((c, idx) => ({
				action: String(idx),
				label: c.buttonLabel,
				default: idx === 0,
				callback: () => c,
			})),
			rejectClose: false,
		});
		if (picked == null) return null;
		return typeof picked === "object" ? picked : (choices[Number(picked)] ?? null);
	} catch { return null; }
}

async function rollActorContestStat(actor, spec, title) {
	if (!actor || !spec) return { ok: false };
	// 核心规则书：处于「晕眩」的机甲在所有机体与敏捷检定及豁免中自动失败
	if (actor.type !== "pilot" && actor.statuses?.has?.("stunned") && spec.mode === "stat" && (spec.statKey === "hull" || spec.statKey === "agi")) {
		return { ok: true, total: -99, autoFail: true, statLabel: `${spec.label}（晕眩自动失败）` };
	}
	let total = null;
	const StatCls = game.lancer?.flows?.get?.("StatRollFlow");
	if (StatCls) {
		if (spec.mode === "skill" && spec.itemUuid) {
			const flow = new StatCls(spec.itemUuid, { title });
			const ok = await flow.begin({ ...flow.state?.data, title });
			if (!ok) return { ok: false };
			total = Number(flow.state?.data?.result?.roll?.total);
		} else {
			const path = `system.${spec.statKey}`;
			const flow = new StatCls(actor.uuid, { title, path });
			const ok = await flow.begin({ ...flow.state?.data, title, path });
			if (!ok) return { ok: false };
			total = Number(flow.state?.data?.result?.roll?.total);
		}
	}
	if (!Number.isFinite(total)) {
		const bonus = spec.mode === "skill"
			? (Number(spec.item?.system?.curr_rank) || 0) * 2
			: (Number(actor.system?.[spec.statKey]) || 0);
		const roll = await new Roll(`1d20+${bonus}`).evaluate();
		total = Number(roll.total);
	}
	return { ok: true, total, autoFail: false, statLabel: spec.label };
}

async function createContestCard(params) {
	const initScore = params.initiatorAutoFail ? "自动失败" : String(params.initiatorTotal);
	const content = `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// ${escHtml(params.title)} //</div><div class="effect-text"><p><b>${escHtml(params.initiatorName)}</b>（${escHtml(params.initiatorStatLabel)}：<b>${escHtml(initScore)}</b>）向 <b>${escHtml(params.responderName)}</b> 发起对抗检定（平局由发起方胜出）。</p></div></div>`;
	const initiatorActor = resolveActor(params.initiatorUuid);
	return ChatMessage.create({
		speaker: ChatMessage.getSpeaker?.({ actor: initiatorActor }) ?? {},
		content,
		flags: {
			[MODULE_ID]: {
				skipAutoScan: true,
				contest: {
					kind: params.kind,
					title: params.title,
					initiatorUuid: params.initiatorUuid,
					initiatorName: params.initiatorName,
					initiatorStatLabel: params.initiatorStatLabel,
					initiatorTotal: params.initiatorTotal,
					initiatorAutoFail: Boolean(params.initiatorAutoFail),
					initiatorRole: params.initiatorRole ?? null,
					responderUuid: params.responderUuid,
					responderName: params.responderName,
					responderOptions: params.responderOptions ?? [{ key: "hull", label: "机体" }],
					sourceMessageId: params.sourceMessageId ?? null,
					resolved: false,
				},
			},
		},
	});
}

function pickGrappleChallengerRole(gs, preferredRole = null) {
	if (preferredRole === "attacker" || preferredRole === "defender") return preferredRole;
	for (const tok of globalThis.canvas?.tokens?.controlled ?? []) {
		if (sameActorRef(gs.attackerUuid, tok.actor)) return "attacker";
		if (sameActorRef(gs.defenderUuid, tok.actor)) return "defender";
	}
	const curCombActor = game?.combat?.combatant?.actor;
	if (curCombActor) {
		if (sameActorRef(gs.attackerUuid, curCombActor)) return "attacker";
		if (sameActorRef(gs.defenderUuid, curCombActor)) return "defender";
	}
	const ownAtt = Boolean(resolveActor(gs.attackerUuid)?.isOwner);
	const ownDef = Boolean(resolveActor(gs.defenderUuid)?.isOwner);
	if (ownAtt && !ownDef) return "attacker";
	if (ownDef && !ownAtt) return "defender";
	return gs.controller === "attacker" ? "defender" : "attacker";
}

async function startGrappleContest(grappleMessage, op = "break", preferredRole = null) {
	const gs = getObjectFlag(grappleMessage, "grappleState");
	if (!gs.active) {
		ui?.notifications?.warn?.("该擒拿已经结束。");
		return null;
	}
	const initRole = op === "break" ? "defender" : pickGrappleChallengerRole(gs, preferredRole);
	const initiatorUuid = initRole === "attacker" ? gs.attackerUuid : gs.defenderUuid;
	const initiatorName = initRole === "attacker" ? gs.attackerName : gs.defenderName;
	const responderUuid = initRole === "attacker" ? gs.defenderUuid : gs.attackerUuid;
	const responderName = initRole === "attacker" ? gs.defenderName : gs.attackerName;
	const initActor = resolveActor(initiatorUuid);
	if (!initActor || !(initActor.isOwner || game.user?.isGM)) {
		ui?.notifications?.warn?.(op === "break"
			? `请由防御方（${gs.defenderName}）的拥有者或 GM 发起挣脱擒拿；攻击方可直接点击「结束擒拿」。`
			: `请由 ${initiatorName} 的拥有者或 GM 发起争抢主导检定。`);
		return null;
	}
	const title = op === "break" ? "挣脱擒拿 // 机体对抗检定" : "擒拿争抢主导 // 机体对抗检定";
	const rolled = await rollActorContestStat(initActor, { mode: "stat", statKey: "hull", label: "机体" }, title);
	if (!rolled.ok) return null;
	return createContestCard({
		kind: op === "break" ? "grappleBreak" : "grappleControl",
		title,
		initiatorUuid,
		initiatorName,
		initiatorStatLabel: rolled.statLabel,
		initiatorTotal: rolled.total,
		initiatorAutoFail: rolled.autoFail,
		initiatorRole: initRole,
		responderUuid,
		responderName,
		responderOptions: [{ key: "hull", label: "机体" }],
		sourceMessageId: grappleMessage.id ?? null,
	});
}

async function createJockeyControlCard({ pilotUuid, pilotName, mechUuid, mechName }) {
	const pilotActor = resolveActor(pilotUuid);
	const grantedSoftCover = talentRank(pilotActor, "t_ext_giant_slayer") >= 1;
	if (grantedSoftCover) {
		await setActorStatus(pilotUuid, "cover_soft", true);
	}
	const content = `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 骑乘生效：${escHtml(pilotName)} → ${escHtml(mechName)} //</div><div class="effect-text"><p><b>${escHtml(pilotName)}</b> 已爬上 <b>${escHtml(mechName)}</b>（共享空间并随其移动）：立即选择下方一项骑乘效果生效；后续回合可花费<b>完整动作</b>直接重复任一效果。目标机甲可花费<b>完整动作</b>发起机体或敏捷对抗检定尝试甩脱。</p></div></div>`;
	return ChatMessage.create({
		speaker: ChatMessage.getSpeaker?.({ actor: pilotActor }) ?? {},
		content,
		flags: {
			[MODULE_ID]: {
				skipAutoScan: true,
				jockeyState: { active: true, pilotUuid, pilotName, mechUuid, mechName, grantedSoftCover },
			},
		},
	});
}

async function respondToContest(contestMessage, chosenKey = "hull", opts = {}) {
	const contest = getObjectFlag(contestMessage, "contest");
	if (!contest.kind || contest.resolved) return null;
	const respActor = resolveActor(contest.responderUuid);
	if (!respActor || !(respActor.isOwner || game.user?.isGM)) {
		ui?.notifications?.warn?.(`请由 ${contest.responderName} 的拥有者或 GM 点击应战。`);
		return null;
	}
	let spec;
	if (chosenKey === "pilot" || respActor.type === "pilot") {
		spec = await pickPilotCheckSpec(respActor, `${contest.title}（应战）`, { chosenSpec: opts.chosenSpec });
		if (!spec) return null;
	} else {
		const statKey = STAT_LABELS_ZH[chosenKey] ? chosenKey : "hull";
		spec = { mode: "stat", statKey, label: STAT_LABELS_ZH[statKey] };
	}
	const resp = await rollActorContestStat(respActor, spec, `${contest.title}（应战）`);
	if (!resp.ok) return null;

	let initiatorWon;
	if (contest.initiatorAutoFail && !resp.autoFail) initiatorWon = false;
	else if (!contest.initiatorAutoFail && resp.autoFail) initiatorWon = true;
	else initiatorWon = Number(contest.initiatorTotal) >= Number(resp.total);

	const initScoreText = contest.initiatorAutoFail ? "自动失败" : String(contest.initiatorTotal);
	const respScoreText = resp.autoFail ? "自动失败" : String(resp.total);
	let outcomeText = "";
	const srcMsg = contest.sourceMessageId ? game.messages?.get?.(contest.sourceMessageId) : null;

	if (contest.kind === "grappleBreak") {
		if (initiatorWon) {
			if (srcMsg) await endGrapple(srcMsg, `${contest.initiatorName} 挣脱成功`);
			else await setActorStatus(contest.initiatorUuid, "immobilized", false);
			outcomeText = `${contest.initiatorName} 胜出（${initScoreText} vs ${respScoreText}），成功挣脱擒拿并解除固定！`;
		} else {
			outcomeText = `${contest.responderName} 胜出（${respScoreText} vs ${initScoreText}），${contest.initiatorName} 未能挣脱擒拿。`;
		}
	} else if (contest.kind === "grappleControl") {
		const gs = srcMsg ? getObjectFlag(srcMsg, "grappleState") : {};
		const initRole = contest.initiatorRole || (sameActorRef(gs.attackerUuid, contest.initiatorUuid) ? "attacker" : "defender");
		const newController = initiatorWon ? initRole : (initRole === "attacker" ? "defender" : "attacker");
		const winnerUuid = initiatorWon ? contest.initiatorUuid : contest.responderUuid;
		const loserUuid = initiatorWon ? contest.responderUuid : contest.initiatorUuid;
		const winnerName = initiatorWon ? contest.initiatorName : contest.responderName;
		const loserName = initiatorWon ? contest.responderName : contest.initiatorName;
		if (srcMsg && gs.active) {
			await updateMessageFlagCompat(srcMsg, "grappleState", { ...gs, controller: newController });
		}
		await setActorStatus(winnerUuid, "immobilized", false);
		await setActorStatus(loserUuid, "immobilized", true);
		outcomeText = `${winnerName} 夺得擒拿主导权（${initScoreText} vs ${respScoreText}），${loserName} 陷入固定！`;
	} else if (contest.kind === "search") {
		if (initiatorWon) {
			await setActorStatus(contest.responderUuid, "hidden", false);
			outcomeText = `${contest.initiatorName} 搜索成功（${initScoreText} vs ${respScoreText}），${contest.responderName} 失去匿迹！`;
		} else {
			outcomeText = `${contest.responderName} 保住匿迹（${respScoreText} vs ${initScoreText}）。`;
		}
	} else if (contest.kind === "jockey") {
		if (initiatorWon) {
			await createJockeyControlCard({
				pilotUuid: contest.initiatorUuid,
				pilotName: contest.initiatorName,
				mechUuid: contest.responderUuid,
				mechName: contest.responderName,
			});
			outcomeText = `${contest.initiatorName} 骑乘成功（${initScoreText} vs ${respScoreText}）！已生成骑乘控制卡。`;
		} else {
			outcomeText = `${contest.responderName} 抵御了骑乘（${respScoreText} vs ${initScoreText}）。`;
		}
	} else if (contest.kind === "jockeyShakeOff") {
		if (initiatorWon) {
			if (srcMsg) {
				const js = getObjectFlag(srcMsg, "jockeyState");
				if (js.active) {
					await updateMessageFlagCompat(srcMsg, "jockeyState", { ...js, active: false, endedReason: `${contest.initiatorName} 甩脱成功` });
					if (js.pilotUuid && (js.grantedSoftCover || talentRank(resolveActor(js.pilotUuid), "t_ext_giant_slayer") >= 1)) {
						await setActorStatus(js.pilotUuid, "cover_soft", false);
					}
				}
			} else if (contest.responderUuid && talentRank(resolveActor(contest.responderUuid), "t_ext_giant_slayer") >= 1) {
				await setActorStatus(contest.responderUuid, "cover_soft", false);
			}
			outcomeText = `${contest.initiatorName} 成功甩脱 ${contest.responderName}（${initScoreText} vs ${respScoreText}），骑乘结束！（请将驾驶员置于邻接空间）`;
		} else {
			outcomeText = `${contest.responderName} 稳稳抓住了机甲（${respScoreText} vs ${initScoreText}），骑乘继续！`;
		}
	}

	const updated = {
		...contest,
		resolved: true,
		responderStatLabel: resp.statLabel,
		responderTotal: resp.total,
		responderAutoFail: resp.autoFail,
		initiatorWon,
		outcomeText,
	};
	await updateMessageFlagCompat(contestMessage, "contest", updated);
	await ChatMessage.create({
		speaker: ChatMessage.getSpeaker?.({ actor: respActor }) ?? {},
		content: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 对抗检定结果 //</div><div class="effect-text"><p>${escHtml(outcomeText)}</p></div></div>`,
		flags: { [MODULE_ID]: { skipAutoScan: true } },
	});
	return updated;
}

async function executeJockeyEffect(jockeyMessage, effKey) {
	const js = getObjectFlag(jockeyMessage, "jockeyState");
	if (!js.active) {
		ui?.notifications?.warn?.("该骑乘已经结束。");
		return false;
	}
	const pilotActor = resolveActor(js.pilotUuid);
	if (!(game.user?.isGM || pilotActor?.isOwner)) {
		ui?.notifications?.warn?.(`只有 ${js.pilotName} 的拥有者或 GM 可以选择骑乘效果。`);
		return false;
	}
	const mechDoc = resolveDocSync(js.mechUuid);
	const mechActor = mechDoc?.actor ?? resolveActor(js.mechUuid);
	if (effKey === "distract") {
		const added = [];
		for (const st of ["impaired", "slow"]) {
			const res = await setActorStatus(js.mechUuid, st, true);
			if (res.changed) added.push(st);
		}
		const gsPushNote = talentRank(pilotActor, "t_ext_giant_slayer") >= 1 ? "（<b>巨人杀手 · 激怒</b>：可额外将目标向所选方向推动 <b>2 格</b>！）" : "";
		const appliedRecords = added.length ? [{ uuid: js.mechUuid, name: js.mechName, statuses: added }] : [];
		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker?.({ actor: pilotActor }) ?? {},
			content: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 骑乘 · 干扰 //</div><div class="effect-text"><p><b>${escHtml(js.pilotName)}</b> 干扰了 <b>${escHtml(js.mechName)}</b> 的传感器与传动：目标陷入<b>受损</b>与<b>缓慢</b>，直到其下一回合结束。${gsPushNote}</p></div></div>`,
			flags: { [MODULE_ID]: { skipAutoScan: true, ...(appliedRecords.length ? { appliedStatuses: appliedRecords } : {}) } },
		});
		return true;
	}
	if (effKey === "shred") {
		const appliedHeat = { Kinetic: 0, Energy: 0, Explosive: 0, Burn: 0, Heat: 2, Variable: 0 };
		if (mechActor?.isOwner) {
			if (typeof mechActor.damageCalc === "function") {
				await mechActor.damageCalc(appliedHeat, { multiple: 1, addBurn: true, ap: false, paracausal: false });
			} else {
				await mechActor.update?.({ "system.heat.value": (Number(mechActor.system?.heat?.value) || 0) + 2 });
			}
		} else if (game.users?.activeGM) {
			game.socket?.emit(`module.${MODULE_ID}`, { action: "applyDamage", targetUuid: js.mechUuid, applied: appliedHeat, multiple: 1, addBurn: true, ap: false, paracausal: false });
		} else {
			ui?.notifications?.warn?.("没有在线的 GM，无法对敌方机甲自动结算 2 点热度。");
			return false;
		}
		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker?.({ actor: pilotActor }) ?? {},
			content: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 骑乘 · 扯断管线 //</div><div class="effect-text"><p><b>${escHtml(js.pilotName)}</b> 扯断了冷却管线，对 <b>${escHtml(js.mechName)}</b> 造成 <b>2 点热度</b>！</p></div></div>`,
			flags: { [MODULE_ID]: { skipAutoScan: true } },
		});
		return true;
	}
	if (effKey === "disrupt") {
		await patchCombatStateCompat(mechActor ?? js.mechUuid, { noReactionsUntilTurnEnd: true });
		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker?.({ actor: pilotActor }) ?? {},
			content: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 骑乘 · 瓦解（巨人杀手） //</div><div class="effect-text"><p><b>${escHtml(js.pilotName)}</b> 切断了 <b>${escHtml(js.mechName)}</b> 的子回路：目标直至其下一回合结束<b>无法使用反应</b>，且你指定的一个系统暂时关闭！</p></div></div>`,
			flags: { [MODULE_ID]: { skipAutoScan: true } },
		});
		return true;
	}
	if (effKey === "damage") {
		const Cls = game.lancer?.flows?.get?.("DamageRollFlow");
		if (Cls && pilotActor?.uuid) {
			const tokObj = mechDoc?.object ?? (mechActor ? attackerToken(mechActor) : null);
			const hit_results = tokObj ? [{ target: tokObj, total: 20, usedLockOn: false, hit: true, crit: false }] : [];
			const finisher = talentRank(pilotActor, "t_ext_giant_slayer") >= 3;
			const flow = new Cls(pilotActor.uuid, {
				title: "骑乘 · 破坏", configurable: true, invade: false, ap: false,
				hit_results, has_normal_hit: true, has_crit_hit: false,
				damage: [{ type: "Kinetic", val: "4" }], bonus_damage: [],
				...(finisher ? { lancerCnJockeyFinisher: true } : {}),
			});
			if (finisher && flow.state?.data) flow.state.data.lancerCnJockeyFinisher = true;
			pendingJockeyFinisher = finisher;
			try {
				return await flow.begin();
			} finally {
				pendingJockeyFinisher = false;
			}
		}
		return false;
	}
	return false;
}

async function startJockeyShakeOff(jockeyMessage, statKey = "hull") {
	const js = getObjectFlag(jockeyMessage, "jockeyState");
	if (!js.active) {
		ui?.notifications?.warn?.("该骑乘已经结束。");
		return null;
	}
	const mechActor = resolveActor(js.mechUuid);
	if (!mechActor || !(mechActor.isOwner || game.user?.isGM)) {
		ui?.notifications?.warn?.(`只有 ${js.mechName} 的拥有者或 GM 可以发起甩脱检定。`);
		return null;
	}
	const key = statKey === "agi" ? "agi" : "hull";
	const title = "甩脱骑乘 // 对抗检定";
	const rolled = await rollActorContestStat(mechActor, { mode: "stat", statKey: key, label: STAT_LABELS_ZH[key] }, title);
	if (!rolled.ok) return null;
	return createContestCard({
		kind: "jockeyShakeOff",
		title,
		initiatorUuid: js.mechUuid,
		initiatorName: js.mechName,
		initiatorStatLabel: rolled.statLabel,
		initiatorTotal: rolled.total,
		initiatorAutoFail: rolled.autoFail,
		responderUuid: js.pilotUuid,
		responderName: js.pilotName,
		responderOptions: [{ key: "pilot", label: "技能触发 / 毅力" }],
		sourceMessageId: jockeyMessage.id ?? null,
	});
}

async function endJockey(jockeyMessage, reason = "骑乘结束") {
	const js = getObjectFlag(jockeyMessage, "jockeyState");
	if (!js.active) return false;
	await updateMessageFlagCompat(jockeyMessage, "jockeyState", { ...js, active: false, endedReason: reason });
	if (js.pilotUuid && (js.grantedSoftCover || talentRank(resolveActor(js.pilotUuid), "t_ext_giant_slayer") >= 1)) {
		await setActorStatus(js.pilotUuid, "cover_soft", false);
	}
	ui?.notifications?.info?.(`${js.pilotName} 对 ${js.mechName} 的骑乘已结束（${reason}）。`);
	return true;
}

async function clearBraceResistances(message) {
	const brace = getObjectFlag(message, "braceCard");
	if (!brace.uuid || message?.getFlag?.(MODULE_ID, "braceCleared")) return false;
	for (const id of RESIST_IDS) await setActorStatus(brace.uuid, id, false);
	const actor = resolveActor(brace.uuid);
	if (actor?.isOwner) {
		// 仅关闭本次触发攻击的受身全抗性与闪烁神盾单次压 1 标记；受身对其他攻击的 +1 难度与库图佐夫「应急姿场」免离散持续至下一回合结束
		await setCombatState(actor, { bracedActive: false });
	}
	await updateMessageFlagCompat(message, "braceCleared", true);
	ui?.notifications?.info?.(`已关闭 ${brace.name ?? "角色"} 的受身全伤害抗性。`);
	return true;
}

async function undoAppliedStatuses(message) {
	const records = message?.getFlag?.(MODULE_ID, "appliedStatuses");
	if (!records?.length || message?.getFlag?.(MODULE_ID, "appliedStatusesUndone")) return 0;
	let removed = 0;
	for (const r of records) {
		for (const st of r.statuses ?? []) {
			const res = await setActorStatus(r.uuid, st, false);
			if (res.ok) removed++;
		}
	}
	await updateMessageFlagCompat(message, "appliedStatusesUndone", true);
	ui?.notifications?.info?.("已撤销该卡片自动施加的状态。");
	return removed;
}

// 选择当前用户要进行豁免的目标指示物 / 角色
function pickSaveActors(message) {
	const controlled = (globalThis.canvas?.tokens?.controlled ?? []).filter(t => t.actor?.isOwner);
	if (controlled.length) return controlled.map(t => ({ uuid: t.document?.uuid ?? t.uuid ?? t.actor.uuid, name: t.name ?? t.actor.name, actor: t.actor }));
	const atk = message?.getFlag?.("lancer", "attackData");
	if (atk?.targets?.length) {
		const hitList = atk.targets.filter(t => t.hit || t.crit);
		const candidates = (hitList.length ? hitList : atk.targets)
			.map(t => ({ doc: resolveDocSync(t.uuid), uuid: t.uuid }))
			.filter(x => x.doc?.actor?.isOwner);
		if (candidates.length) return candidates.map(x => ({ uuid: x.uuid, name: x.doc.name ?? x.doc.actor.name, actor: x.doc.actor }));
	}
	const targeted = Array.from(game.user?.targets ?? []).filter(t => t.actor?.isOwner);
	if (targeted.length) return targeted.map(t => ({ uuid: t.document?.uuid ?? t.uuid ?? t.actor.uuid, name: t.name ?? t.actor.name, actor: t.actor }));
	const ch = game.user?.character;
	const mech = ch?.system?.active_mech?.value ?? (ch?.type === "mech" ? ch : null);
	if (mech?.isOwner) return [{ uuid: preferredTargetUuid(mech), name: mech.name, actor: mech }];
	return [];
}

async function addHeatCompat(uuidOrActor, deltaHeat, { external = true } = {}) {
	const delta = Number(deltaHeat) || 0;
	if (!delta) return false;
	const actor = typeof uuidOrActor === "string" ? resolveActor(uuidOrActor) : uuidOrActor;
	if (!actor) return false;
	if (actor.isOwner) {
		const cur = Number(actor.system?.heat?.value) || 0;
		await actor.update?.({ "system.heat.value": Math.max(0, cur + delta) });
		if (external && delta > 0 && hasGruntWeak(actor)) {
			await triggerGruntWeakDestruction(actor, delta);
		}
		return true;
	}
	if (game.users?.activeGM) {
		const targetUuid = typeof uuidOrActor === "string" ? uuidOrActor : (preferredTargetUuid(actor) ?? actor.uuid);
		game.socket?.emit(`module.${MODULE_ID}`, { action: "addHeat", uuid: targetUuid, heat: delta, external: Boolean(external) });
		return true;
	}
	return false;
}

async function executeCardSave(message, save) {
	const targets = pickSaveActors(message);
	if (!targets.length) {
		globalThis.ui?.notifications?.warn?.("请先点选你要进行豁免的角色指示物。");
		return [];
	}
	const cardInfo = message ? analyzeCard(message) : null;
	const sourceMech = combatMechOf(cardInfo?.actor);
	if (sourceMech) {
		if (sourceMech.isOwner) await ensureCombatTurnState(sourceMech);
		if (getCombatState(sourceMech).skirmisherSoftCover) {
			await setActorStatus(preferredTargetUuid(sourceMech) ?? sourceMech.uuid, "cover_soft", false);
			await patchCombatStateCompat(sourceMech, { skirmisherSoftCover: false, attackedOrForcedSaveThisTurn: true });
		} else {
			await patchCombatStateCompat(sourceMech, { attackedOrForcedSaveThisTurn: true });
		}
	}
	const results = [];
	const saveResultsPatch = { ...(message?.getFlag?.(MODULE_ID, "saveResults") ?? {}) };
	let openDoorTriggered = Boolean(sourceMech && getCombatState(sourceMech).usedOpenDoorSave);
	const hasOpenDoor = Boolean(sourceMech && hasCoreBonus(sourceMech, "cb_the_lesson_of_the_open_door"));

	for (const t of targets) {
		const isPilotTarget = t.actor?.type === "pilot" || Boolean(t.actor?.is_pilot?.());
		const stunnedAutoFail = !isPilotTarget
			&& Boolean(t.actor?.statuses?.has?.("stunned") || t.actor?.system?.statuses?.stunned)
			&& (save.key === "hull" || save.key === "agi" || save.path === "system.hull" || save.path === "system.agi");
		let total = null;
		if (stunnedAutoFail) {
			total = -99;
		} else {
			const StatCls = game.lancer?.flows?.get?.("StatRollFlow");
			if (StatCls) {
				const flow = new StatCls(t.actor.uuid ?? t.uuid, { title: `${save.label}（DC ${save.dc}）`, path: save.path });
				const ok = await flow.begin({ ...flow.state.data, title: `${save.label}（DC ${save.dc}）`, path: save.path });
				if (!ok) continue;
				total = Number(flow.state?.data?.result?.roll?.total);
			}
			if (!Number.isFinite(total)) {
				const statKey = save.path.split(".").pop();
				const bonus = Number(t.actor?.system?.[statKey]) || 0;
				const roll = await new Roll(`1d20+${bonus}`).evaluate();
				total = Number(roll.total);
			}
		}
		const passed = !stunnedAutoFail && total >= save.dc;
		const appliedRecords = [];
		const wantStatuses = [...(passed ? (save.passStatuses ?? []) : (save.failStatuses ?? []))];
		// 弗拉德「肢解」：豁免失败使其他角色陷入固定时，目标同时陷入离散
		if (!passed && wantStatuses.includes("immobilized") && mechFrameLid(sourceMech) === "mf_vlad" && !sameActorRef(t.uuid, sourceMech) && !wantStatuses.includes("shredded")) {
			wantStatuses.push("shredded");
		}
		if (wantStatuses.length && getSetting("autoApplyStatus", true)) {
			const added = [];
			for (const st of wantStatuses) {
				const res = await setActorStatus(t.uuid, st, true);
				if (res.changed) added.push(st);
			}
			if (added.length) appliedRecords.push({ uuid: t.uuid, name: t.name, statuses: added });
		}
		// 潜行者 II「埋伏」：机体豁免失败时，除缓慢+受损外直至其下一回合结束无法使用反应
		if (!passed && save.key === "hull" && message?.getFlag?.(MODULE_ID, "infiltratorAmbush")) {
			await patchCombatStateCompat(t.actor ?? t.uuid, { noReactionsUntilTurnEnd: true });
		}
		let openDoorNote = "";
		if (!passed && hasOpenDoor && !openDoorTriggered) {
			openDoorTriggered = true;
			if (sourceMech) await patchCombatStateCompat(sourceMech, { usedOpenDoorSave: true });
			await addHeatCompat(t.uuid ?? t.actor, 2, { external: true });
			openDoorNote = " · 开门之训 +2 热度";
		}
		const noDamageOnSuccess = Boolean(passed && hasGruntChaff(t.actor));
		const entry = {
			uuid: t.uuid, name: t.name, saveKey: save.key, label: save.label, total, dc: save.dc,
			passed, autoFail: stunnedAutoFail, halfOnSuccess: Boolean(save.halfOnSuccess) && !noDamageOnSuccess, noDamageOnSuccess,
		};
		saveResultsPatch[t.uuid] = entry;
		results.push(entry);

		const passExtra = [
			noDamageOnSuccess ? "无用之人：免受伤害" : (save.halfOnSuccess ? "伤害减半" : ""),
			save.passStatuses?.length ? save.passStatuses.map(id => ALL_STATUS_LABELS[id] ?? id).join("、") : "",
		].filter(Boolean).join("，");
		const failReasons = [
			stunnedAutoFail ? "晕眩自动失败" : "",
			...(save.failStatuses ?? []).map(id => ALL_STATUS_LABELS[id] ?? id),
		].filter(Boolean).join("、");
		const badge = passed
			? `<b style="color:#2e7d32">成功</b>${passExtra ? `（${passExtra}）` : ""}`
			: `<b style="color:#c62828">失败</b>${failReasons ? `（${failReasons}）` : ""}${openDoorNote}`;
		const scoreLabel = stunnedAutoFail ? "自动失败" : String(total);
		const content = `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 豁免检定结果 //</div><div class="effect-text"><p><b>${escHtml(t.name)}</b> · ${escHtml(save.label)}：<b>${escHtml(scoreLabel)}</b> vs DC ${save.dc} → ${badge}</p></div></div>`;
		if (typeof ChatMessage !== "undefined" && ChatMessage.create) {
			await ChatMessage.create({
				speaker: ChatMessage.getSpeaker?.({ actor: t.actor }) ?? {},
				content,
				flags: { [MODULE_ID]: { saveResultCard: true, ...(appliedRecords.length ? { appliedStatuses: appliedRecords } : {}) } },
			});
		}
	}
	if (results.length && message) {
		if (game.user?.isGM || message.isAuthor) await message.setFlag?.(MODULE_ID, "saveResults", saveResultsPatch);
		else if (game.users?.activeGM && message.id) game.socket?.emit(`module.${MODULE_ID}`, { action: "recordSaveResults", messageId: message.id, results: saveResultsPatch });
	}
	return results;
}

async function rollNonAttackDamage(message, info, overrideSpec = null) {
	const parsed = overrideSpec ?? info?.nonAttackDamage;
	if (!parsed?.damage?.length) return false;
	const actor = combatMechOf(info.actor ?? resolveActor(info.actorUuid)) ?? info.actor;
	if (!actor?.isOwner) {
		ui?.notifications?.error?.(`你不拥有 ${actor?.name ?? "发起者"}，不能为其掷伤害。`);
		return false;
	}
	const Cls = game.lancer?.flows?.get?.("DamageRollFlow");
	if (!Cls) return false;
	const saveMap = message?.getFlag?.(MODULE_ID, "saveResults") ?? {};
	const zeroUuids = new Set(Object.values(saveMap).filter(r => r?.passed && r?.noDamageOnSuccess).map(r => r.uuid));
	const halfUuids = Object.values(saveMap).filter(r => r?.passed && r?.halfOnSuccess && !r?.noDamageOnSuccess).map(r => r.uuid);
	const hit_results = [];
	if (parsed.selfTargetOnly) {
		const selfTok = attackerToken(actor);
		if (selfTok) hit_results.push({ target: selfTok, total: 20, usedLockOn: false, hit: true, crit: false });
	} else if (info.isAttack && info.attack?.targets?.length && !overrideSpec?.useCurrentTargets) {
		for (const t of info.attack.targets) {
			if (!t.hit && !t.crit) continue;
			if (zeroUuids.has(t.uuid)) continue;
			const doc = resolveDocSync(t.uuid);
			const tokObj = doc?.object ?? (doc?.actor ? attackerToken(doc.actor) : null);
			if (tokObj) hit_results.push({ target: tokObj, total: t.total ?? 20, usedLockOn: false, hit: true, crit: Boolean(t.crit) });
		}
	}
	if (!hit_results.length && !parsed.selfTargetOnly) {
		const userTargets = Array.from(game.user?.targets ?? []);
		if (userTargets.length) {
			for (const tok of userTargets) {
				const tokUuid = tok.document?.uuid ?? tok.uuid ?? tok.actor?.uuid;
				if (tokUuid && zeroUuids.has(tokUuid)) continue;
				hit_results.push({ target: tok, total: 20, usedLockOn: false, hit: true, crit: false });
			}
		} else {
			for (const r of Object.values(saveMap)) {
				if (r.noDamageOnSuccess) continue;
				if (r.passed && !r.halfOnSuccess) continue;
				const doc = resolveDocSync(r.uuid);
				const tokObj = doc?.object ?? (doc?.actor ? attackerToken(doc.actor) : null);
				if (tokObj) hit_results.push({ target: tokObj, total: 20, usedLockOn: false, hit: true, crit: false });
			}
		}
		if (!hit_results.length && zeroUuids.size > 0) {
			ui?.notifications?.info?.("低等兵「无用之人」：全部目标豁免成功，免受本次伤害！");
			return false;
		}
	}
	let damageSpec = parsed.damage.map(d => ({ ...d }));
	if (parsed.dynamicTargetHeatBurn) {
		const tActor = hit_results[0]?.target?.actor
			?? (info.attack?.targets?.find(t => t.hit || t.crit)?.uuid ? resolveActor(info.attack.targets.find(t => t.hit || t.crit).uuid) : null);
		const liveHeat = Math.max(0, Number(tActor?.system?.heat?.value) || 0);
		damageSpec = [{ type: "Burn", val: String(liveHeat) }];
	}
	const halfAll = Boolean(parsed.halfAllTargets || hasNpcFeature(actor, ["npcf_cn_exotic_6", "npcf_extrusion_exotic"], ["现世挤出物"]));
	const flow = new Cls(actor.uuid, {
		title: `${overrideSpec?.title ?? info.title} 伤害`, configurable: true, invade: false, ap: Boolean(parsed.ap),
		half_damage: halfAll,
		hit_results, has_normal_hit: true, has_crit_hit: false,
		damage: damageSpec, bonus_damage: [],
		lancerCnHalfUuids: halfUuids,
		...(zeroUuids.size ? { lancerCnZeroUuids: [...zeroUuids] } : {}),
		...(halfAll ? { lancerCnDamageMod: { halfAllTargets: true } } : {}),
	});
	if (flow.state?.data) {
		if (halfUuids.length) flow.state.data.lancerCnHalfUuids = [...halfUuids];
		if (zeroUuids.size) flow.state.data.lancerCnZeroUuids = [...zeroUuids];
		if (halfAll) flow.state.data.lancerCnDamageMod = { ...(flow.state.data.lancerCnDamageMod ?? {}), halfAllTargets: true };
	}
	pendingHalfUuids = halfUuids.length ? halfUuids : null;
	pendingZeroUuids = zeroUuids.size ? [...zeroUuids] : null;
	if (halfAll) pendingDamageMod = { ...(pendingDamageMod ?? {}), halfAllTargets: true };
	try { return await flow.begin(); }
	finally {
		pendingHalfUuids = null;
		pendingZeroUuids = null;
		if (halfAll) pendingDamageMod = null;
	}
}

function findOwnedAnalystMech() {
	for (const m of allKnownMechs()) {
		if (m?.isOwner && talentRank(m, "t_field_analyst") >= 1) return m;
	}
	const ch = game?.user?.character;
	const cm = combatMechOf(ch);
	if (cm?.isOwner && talentRank(cm, "t_field_analyst") >= 1) return cm;
	return null;
}

async function executeFieldAnalystReaction(message, info, mode) {
	const analystMech = findOwnedAnalystMech();
	if (!analystMech) return ui?.notifications?.warn?.("未找到你拥有的「战场分析师」机甲。");
	const rank = talentRank(analystMech, "t_field_analyst");
	if (mode === "sub" && rank < 3) return ui?.notifications?.warn?.("削减敌方攻击掷骰需要「战场分析师」3 级（激活干扰）。");
	if (message?.getFlag?.(MODULE_ID, "analystUsed")) return ui?.notifications?.warn?.("本次攻击掷骰已经受过一次「优越情报」影响。");
	const atk = message?.getFlag?.("lancer", "attackData") ?? message?.flags?.lancer?.attackData;
	if (!atk?.targets?.length) return ui?.notifications?.warn?.("该攻击卡没有可调整的目标掷骰记录。");
	const rGate = await consumeReaction(analystMech, { kind: "fieldAnalyst", label: mode === "sub" ? "激活干扰" : "优越情报" });
	if (!rGate.ok) return false;
	const dieVal = rank >= 2 ? (getTalentDie(analystMech, "analyst") ?? 1) : 1;
	const delta = mode === "sub" ? -dieVal : dieVal;

	const updatedTargets = atk.targets.map((t, idx) => {
		if (idx > 0) return t;
		const oldTotal = Number(t.total) || 0;
		const nextTotal = oldTotal + delta;
		const defActor = resolveActor(t.uuid);
		const defense = info?.isTech
			? (Number(defActor?.system?.edef) || 10)
			: (Number(defActor?.system?.evasion) || 10);
		const hit = nextTotal >= defense;
		const crit = hit && nextTotal >= 20 && !info?.isTech;
		return { ...t, total: nextTotal, hit, crit };
	});
	const t0 = updatedTargets[0];
	if (rank >= 2) await setTalentDie(analystMech, "analyst", 1);
	await updateAttackMessageTargetsCompat(message, atk, updatedTargets, "analystUsed", {
		delta,
		by: analystMech.name,
		newTotal: t0.total,
		hit: t0.hit,
		crit: t0.crit,
	});
	await postCpEffectCard(
		analystMech,
		"战场分析师 · 优越情报",
		`<p><b>${escHtml(analystMech.name)}</b> 发动反应<b>优越情报</b>：攻击骰修正 <b>${delta > 0 ? `+${delta}` : delta}</b> → 新结果 <b>${t0.total}</b>（${t0.crit ? "<b>会心一击！</b>" : t0.hit ? "<b>命中！</b>" : "<b>未命中</b>"}）${rank >= 2 ? "；情报骰已重置为 1" : ""}。</p>`,
	);
}

function findDefenderReactionActor(attackTargets, riderKind, { requireOwned = false } = {}) {
	const isParry = riderKind === "blackWitchParry";
	for (const t of attackTargets ?? []) {
		if (!t?.hit && !t?.crit) continue;
		const defDoc = resolveDocSync(t.uuid);
		const hitActor = defDoc?.actor ?? resolveActor(t.uuid);
		if (isParry) {
			if (mechFrameLid(hitActor) === "mf_black_witch" && !getCombatState(hitActor).usedBlackWitchParry && (!requireOwned || hitActor?.isOwner)) {
				return { reactor: hitActor, hitTarget: t };
			}
			const defTok = defDoc?.object ?? (hitActor ? attackerToken(hitActor) : null);
			const defDisp = defTok?.document?.disposition ?? 1;
			const adjBw = defTok && (globalThis.canvas?.tokens?.placeables ?? []).find(tok =>
				tok !== defTok
				&& tok.actor
				&& (tok.document?.disposition ?? 1) === defDisp
				&& mechFrameLid(tok.actor) === "mf_black_witch"
				&& !getCombatState(tok.actor).usedBlackWitchParry
				&& (!requireOwned || tok.actor.isOwner)
				&& (tokenDistance(defTok, tok) ?? 99) <= 1,
			);
			if (adjBw?.actor) return { reactor: adjBw.actor, hitTarget: t };
		} else if (
			hasNpcFeature(hitActor, ["npcf_cn_veteran_13", "npcf_lightning_reflexes_veteran"], ["闪电反射"])
			&& !getCombatState(hitActor).usedVeteranLightningReflex
			&& (!requireOwned || hitActor?.isOwner)
		) {
			return { reactor: hitActor, hitTarget: t };
		}
	}
	return null;
}

async function executeCardRider(message, info, riderKind) {
	const mech = combatMechOf(info?.actor ?? resolveActor(info?.actorUuid)) ?? info?.actor;
	const dc = Number(mech?.system?.save) || 10;
	const hitUuids = (info?.attack?.targets ?? []).filter(t => t.hit || t.crit).map(t => t.uuid).filter(Boolean);

	if (riderKind === "selfDmg") {
		const sr = (info?.techRiders ?? []).find(r => r.kind === "selfDmg");
		if (!sr) return;
		await rollNonAttackDamage(message, info, { title: `${info.title} · 自伤`, damage: [{ type: sr.type, val: sr.formula }], ap: sr.ap, selfTargetOnly: true });
		return;
	}
	if (riderKind === "extraDmg") {
		const er = (info?.techRiders ?? []).find(r => r.kind === "extraDmg");
		if (!er) return;
		await rollNonAttackDamage(message, info, { title: `${info.title} · 附加`, damage: er.damage, ap: er.ap });
		return;
	}
	if (riderKind === "snowcrashHeat") {
		const uuids = hitUuids.length ? hitUuids : Array.from(game.user?.targets ?? []).map(t => t.document?.uuid ?? t.uuid).filter(Boolean);
		if (!uuids.length) return ui?.notifications?.warn?.("没有可施加雪崩热度的命中目标。");
		for (const u of uuids) await addHeatCompat(u, 2, { external: true });
		ui?.notifications?.info?.("骇客「雪崩」：已对目标施加 +2 热度！");
		return;
	}
	if (riderKind === "veteranHackerHeat") {
		const uuids = hitUuids.length ? hitUuids : Array.from(game.user?.targets ?? []).map(t => t.document?.uuid ?? t.uuid).filter(Boolean);
		if (!uuids.length) return ui?.notifications?.warn?.("没有可施加骇客热度的命中目标。");
		for (const u of uuids) await addHeatCompat(u, 2, { external: true });
		ui?.notifications?.info?.("老兵「骇客」：已对命中目标额外施加 +2 热度！");
		return;
	}
	if (riderKind === "enhancedSysInvade") {
		if (mech?.isOwner) {
			await ensureCombatTurnState(mech);
			if (getCombatState(mech).usedEnhancedSysInvade) return ui?.notifications?.warn?.("本轮已使用过「增强系统升级」！");
			await setCombatState(mech, { usedEnhancedSysInvade: true });
		}
		const uuids = hitUuids.length ? hitUuids : Array.from(game.user?.targets ?? []).map(t => t.document?.uuid ?? t.uuid).filter(Boolean);
		for (const u of uuids) await addHeatCompat(u, 2, { external: true });
		await postCpEffectCard(mech, "增强系统升级 · 入侵过载", `<p><b>${escHtml(mech?.name ?? "机甲")}</b> 触发核心奖励<b>增强系统升级</b>（1/轮）：对入侵目标额外施加 <b>+2 热度</b>！</p>`);
		return;
	}
	if (riderKind === "blackWitchParry" || riderKind === "veteranLightningReflex") {
		const isParry = riderKind === "blackWitchParry";
		const atk = message?.getFlag?.("lancer", "attackData") ?? message?.flags?.lancer?.attackData;
		const matched = findDefenderReactionActor(atk?.targets ?? [], riderKind, { requireOwned: !game.user?.isGM })
			?? findDefenderReactionActor(atk?.targets ?? [], riderKind, { requireOwned: false });
		const hitTarget = matched?.hitTarget ?? (atk?.targets ?? []).find(t => t.hit || t.crit);
		const reactor = matched?.reactor ?? (hitTarget ? resolveActor(hitTarget.uuid) : null);
		if (reactor && !(game.user?.isGM || reactor.isOwner || message?.isAuthor)) {
			return ui?.notifications?.warn?.(`请由 ${reactor.name ?? "受保护角色"} 的拥有者或 GM 发动「${isParry ? "磁力格挡" : "闪电反射"}」。`);
		}
		const usedKey = isParry ? "usedBlackWitchParry" : "usedVeteranLightningReflex";
		if (reactor) {
			const rGate = await consumeReaction(reactor, { kind: riderKind, label: isParry ? "磁力格挡" : "闪电反射", roundFlag: usedKey });
			if (!rGate.ok) return;
		}
		const roll = await new Roll("1d6").evaluate();
		const ok5 = Number(roll.total) >= 5;
		if (ok5 && atk?.targets?.length && hitTarget) {
			const nextTargets = atk.targets.map(t => (t === hitTarget ? { ...t, hit: false, crit: false } : t));
			await updateAttackMessageTargetsCompat(message, atk, nextTargets);
		}
		const title = isParry ? "黑巫蛾 · 磁力格挡" : "老兵 · 闪电反射";
		await postCpEffectCard(
			reactor ?? mech,
			title,
			`<p><b>${escHtml((reactor ?? mech)?.name ?? "防御方")}</b> 发动反应<b>${isParry ? "磁力格挡" : "闪电反射"}</b>，掷 1d6 = <b>${roll.total}</b> → ${ok5 ? "<b style='color:#2e7d32'>5+ 成功！本次攻击变为未命中！</b>" : "<b style='color:#c62828'>未达 5+，攻击照常命中</b>"}。</p>`,
		);
		return;
	}
	if (riderKind === "shockWreath") {
		await rollNonAttackDamage(message, info, { title: "电击环", damage: [{ type: "Burn", val: "1d6" }], ap: false });
		return;
	}
	if (riderKind === "moltenWreathe") {
		if (mech?.isOwner) await addHeatCompat(mech, 1, { external: false });
		await rollNonAttackDamage(message, info, { title: "热熔缭绕（锥形 3）", damage: [{ type: "Explosive", val: "2" }], ap: false, useCurrentTargets: true });
		return;
	}
	if (riderKind === "throughbolt") {
		await rollNonAttackDamage(message, info, { title: "过穿螺旋弹（线形 3）", damage: [{ type: "Kinetic", val: "2" }], ap: true, useCurrentTargets: true });
		return;
	}
	if (riderKind === "seekDevour") {
		const prevMod = message?.getFlag?.(MODULE_ID, "cpDamageMod") ?? {};
		await updateMessageFlagCompat(message, "cpDamageMod", { ...prevMod, halfAllTargets: true });
		await rollNonAttackDamage(message, info, { title: "寻索/吞噬密罐弹（爆发 1）", damage: [{ type: "Burn", val: "2" }], ap: false, useCurrentTargets: true });
		return;
	}
	if (riderKind === "optimizedReroll") {
		const mod = weaponModOf(info?.item);
		if (mod?.system?.uses !== undefined && mod.isOwner !== false) {
			const cur = typeof mod.system.uses === "object" ? Number(mod.system.uses.value) : Number(mod.system.uses);
			if (cur <= 0) return ui?.notifications?.warn?.("「最优化工程」剩余充能不足！");
			const next = Math.max(0, cur - 1);
			await mod.update?.(typeof mod.system.uses === "object" ? { "system.uses.value": next } : { "system.uses": next });
		}
		const AtkCls = game.lancer?.flows?.get?.("WeaponAttackFlow");
		if (AtkCls && info?.item?.uuid) {
			const flow = new AtkCls(info.item.uuid, {});
			await flow.begin();
		}
		return;
	}
	if (riderKind === "stormbringerThunder" || riderKind === "stormbringerLightning") {
		if (mech?.isOwner) {
			await ensureCombatTurnState(mech);
			if (!getCombatState(mech).usedStormbringerR2) {
				await setCombatState(mech, { usedStormbringerR2: true });
				if (talentRank(mech, "t_stormbringer") >= 3) {
					const curS = getTalentDie(mech, "stormbringer") ?? 6;
					if (curS > 1) await setTalentDie(mech, "stormbringer", curS - 1);
				}
			}
		}
		const body = riderKind === "stormbringerThunder"
			? `<p><b>屈身风暴 · 雷霆</b>：目标周围<b>爆发 2</b> 内的角色必须通过<b>敏捷豁免（DC ${dc}）</b>，否则从目标处被击退 1 格。</p>`
			: `<p><b>屈身风暴 · 闪电</b>：主目标必须通过<b>机体豁免（DC ${dc}）</b>，否则被击退 3 格；你自身也因后坐力向反方向被击退 3 格。</p>`;
		await postCpEffectCard(mech, "兴风者 · 屈身风暴", body, { allowAutoScan: true });
		return;
	}
	if (riderKind === "centimaneImpaired") {
		await postCpEffectCard(mech, "百臂 · 万齿", `<p>目标必须通过<b>系统豁免（DC ${dc}）</b>，否则陷入<b>受损</b>和<b>缓慢</b>直到其下一回合结束。</p>`, { allowAutoScan: true });
		return;
	}
	if (riderKind === "centimaneSave") {
		await postCpEffectCard(
			mech,
			"百臂 · 潮汐抑制",
			`<p>目标必须通过<b>系统豁免（DC ${dc}）</b>，否则承受以下你选择的一项直至其下一回合结束：<b>突击虫群</b>（受损与缓慢）/ <b>致盲虫群</b>（视线仅限邻接）/ <b>感染虫群</b>（离散）/ <b>束缚虫群</b>（每次动作或反应受 1 燃烧）。</p>`,
			{ allowAutoScan: true },
		);
		return;
	}
	if (riderKind === "crackShotWatchThis") {
		await postCpEffectCard(
			mech,
			"神枪手 · 看招！",
			`<p>目标必须通过<b>机体豁免（DC ${dc}）</b>，否则承受以下一项：<b>爆头</b>（视线仅限邻接）/ <b>爆腿</b>（陷入固定）/ <b>爆身</b>（被击倒伏卧）。</p>`,
			{ allowAutoScan: true },
		);
		return;
	}
	if (riderKind === "walkingArmoryShock") {
		await rollNonAttackDamage(message, info, { title: "自走兵器库 · 电击弹", damage: [{ type: "Energy", val: "1" }], ap: true, useCurrentTargets: true });
		return;
	}
	if (riderKind === "walkingArmoryJavelin") {
		await postCpEffectCard(mech, "自走兵器库 · 猎人弹", `<p>选中的命中角色必须通过<b>机体豁免（DC ${dc}）</b>，否则被击倒<b>伏卧</b>。</p>`, { allowAutoScan: true });
		return;
	}
	if (riderKind === "hunterLunge") {
		if (!mech?.isOwner) return;
		await ensureCombatTurnState(mech);
		if (getCombatState(mech).usedHunterLunge) {
			ui?.notifications?.warn?.("本轮已使用过猎人 I「跳扑」！");
			return;
		}
		await setCombatState(mech, { usedHunterLunge: true });
		await postCpEffectCard(
			mech,
			"猎人 · 跳扑",
			`<p><b>${escHtml(mech.name)}</b> 发动<b>跳扑</b>（1/轮）：使用副近战武器攻击时，可在攻击前朝一名攻击目标<b>飞行最多 3 格</b>（此移动忽略交战且不会触发反应）！</p>`,
		);
		try { if (mech.sheet?.rendered) mech.sheet.render(false); } catch { /* ignore */ }
		return;
	}
	if (riderKind === "hunterDisdainful") {
		await triggerHunterDisdainful(mech);
		return;
	}
	if (riderKind === "pesilatMuscleDmg") {
		if (!mech?.isOwner) return;
		await ensureCombatTurnState(mech);
		if (getCombatState(mech).usedPesilatMuscle) {
			ui?.notifications?.warn?.("本轮已使用过佩西拉特「肌肉示踪触觉」！");
			return;
		}
		await setCombatState(mech, { usedPesilatMuscle: true });
		await rollNonAttackDamage(message, info, { title: "佩西拉特 · 肌肉示踪触觉", damage: [{ type: "Kinetic", val: "1d6" }], ap: false });
	}
}

const BTN_INLINE_STYLE = "flex:0 0 auto;width:auto;line-height:1.6;padding:0 .6em;margin:0";

function getArrayFlag(message, key) {
	const v = message?.getFlag?.(MODULE_ID, key);
	return Array.isArray(v) ? v : [];
}

function getObjectFlag(message, key) {
	const v = message?.getFlag?.(MODULE_ID, key);
	return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function buildCardAutomationHTML(message, info) {
	const canControl = Boolean(game.user?.isGM || message?.isAuthor);
	const applied = getArrayFlag(message, "appliedStatuses");
	const undone = message?.getFlag?.(MODULE_ID, "appliedStatusesUndone") === true;
	const saveResults = getObjectFlag(message, "saveResults");
	const parts = [];

	// 1. 已自动施加状态摘要 + 「↩ 撤销状态」按钮
	if (canControl && applied.length) {
		const summary = applied.map(r => `${escHtml(r.name)}（${(r.statuses ?? []).map(id => escHtml(ALL_STATUS_LABELS[id] ?? id)).join("、")}）`).join("；");
		parts.push(undone
			? `<span style="opacity:.65;text-decoration:line-through">已撤销状态：${summary}</span>`
			: `<span>已自动施加：${summary}</span><button type="button" data-lancer-cn-undo-status="1" style="${BTN_INLINE_STYLE}">↩ 撤销状态</button>`);
	}

	// 2. 强迫豁免按钮（对所有玩家显示，方便受击玩家点击掷豁免）
	if (info?.saves?.length) {
		const saveBtns = info.saves.map((sv, idx) => {
			const extra = [
				sv.failStatuses?.length ? `失败：${sv.failStatuses.map(id => ALL_STATUS_LABELS[id] ?? id).join("/")}` : "",
				sv.halfOnSuccess ? "成功减半" : "",
				sv.critOnly ? "仅会心" : "",
			].filter(Boolean).join("，");
			return `<button type="button" data-lancer-cn-save="${idx}" style="${BTN_INLINE_STYLE}" title="点击以所选角色进行${escHtml(sv.label)}">🎲 ${escHtml(sv.label)} DC ${sv.dc}${extra ? `（${escHtml(extra)}）` : ""}</button>`;
		}).join("");
		const badges = Object.values(saveResults).filter(r => r && typeof r === "object" && "total" in r).map(r => `<span style="padding:0 4px;border-radius:3px;background:${r.passed ? "#e8f5e9;color:#2e7d32" : "#ffebee;color:#c62828"}">${escHtml(r.name)}:${r.total}${r.passed ? "✓" : "✗"}</span>`).join("");
		parts.push(`<span>豁免：</span>${saveBtns}${badges}`);
	}

	// 3. 非攻击卡与「非入侵科技攻击卡」（系统模板不自带掷伤害按钮）：提供掷伤害与放置范围模板按钮
	const showCustomDmgBtn = Boolean(canControl && info && (!info.isAttack || (info.isTech && !info.attack?.invade)));
	if (showCustomDmgBtn && info.nonAttackDamage?.damage?.length) {
		const label = info.nonAttackDamage.labelOverride
			|| (info.nonAttackDamage.damage.map(d => `${d.val} ${translate(d.type) ?? d.type}`).join(" + ") + (info.nonAttackDamage.ap ? " AP" : ""));
		parts.push(`<button type="button" data-lancer-cn-nonatk-dmg="1" style="${BTN_INLINE_STYLE}"><i class="fas fa-dice-d6"></i> 掷伤害（${escHtml(label)}）</button>`);
	}
	if (canControl && info && (!info.isAttack || info.isTech)) {
		for (const a of info.aoeRanges ?? []) {
			parts.push(`<button type="button" data-lancer-cn-aoe="${escHtml(a.type)}:${a.val}" style="${BTN_INLINE_STYLE}">放置${escHtml(a.label)}模板</button>`);
			if (isDirectionalRangeType(a.type)) {
				parts.push(`<button type="button" data-lancer-cn-aoe-rot="-15" style="${BTN_INLINE_STYLE}" title="逆时针旋转已放置的线形/锥形模板 15°（按住 Shift 微调 5°；也可在画布上按住 Alt+滚轮旋转）">↺</button>`);
				parts.push(`<button type="button" data-lancer-cn-aoe-rot="15" style="${BTN_INLINE_STYLE}" title="顺时针旋转已放置的线形/锥形模板 15°（按住 Shift 微调 5°；也可在画布上按住 Alt+滚轮旋转）">↻</button>`);
			}
		}
	}

	// 3b. 科技自伤 / 额外伤害 / 雪崩 & 武器改装 / 天赋附加按钮
	if (canControl && info?.techRiders?.length) {
		for (const r of info.techRiders) {
			if (r.kind === "selfDmg") {
				parts.push(`<button type="button" data-lancer-cn-rider="selfDmg" style="${BTN_INLINE_STYLE}">⚡ 承受自伤（${escHtml(r.formula)} ${escHtml(translate(r.type) ?? r.type)}${r.ap ? " AP" : ""}）</button>`);
			} else if (r.kind === "extraDmg") {
				const lbl = r.damage.map(d => `${d.val} ${translate(d.type) ?? d.type}`).join(" + ") + (r.ap ? " AP" : "");
				parts.push(`<button type="button" data-lancer-cn-rider="extraDmg" style="${BTN_INLINE_STYLE}">🎲 附加伤害（${escHtml(lbl)}）</button>`);
			} else if (r.label) {
				parts.push(`<button type="button" data-lancer-cn-rider="${escHtml(r.kind)}" style="${BTN_INLINE_STYLE}">${escHtml(r.label)}</button>`);
			}
		}
	}
	if (info?.weaponRiders?.length) {
		for (const r of info.weaponRiders) {
			const isDefReaction = r.kind === "blackWitchParry" || r.kind === "veteranLightningReflex";
			const showRider = canControl || (isDefReaction && Boolean(findDefenderReactionActor(info.attack?.targets ?? [], r.kind, { requireOwned: true })));
			if (showRider) {
				parts.push(`<button type="button" data-lancer-cn-rider="${escHtml(r.kind)}" style="${BTN_INLINE_STYLE}">${escHtml(r.label)}</button>`);
			}
		}
	}

	// 3b-2. 投掷近战武器离手标记与一键自由动作拾回 / 撤销投出
	if (canControl && message?.getFlag?.(MODULE_ID, "thrownAttack") && info?.item && weaponLidOf(info.item) !== "mw_kkca_doom_axe") {
		if (isWeaponThrownOut(info.actor, info.item)) {
			const retNote = talentRank(info.actor, "t_hunter") >= 2 ? "回合结束自动飞回" : "停在目标邻接格";
			parts.push(
				`<span>🗡️ 已投出「<b>${escHtml(info.item.name)}</b>」（${retNote}）</span>`
				+ `<button type="button" data-lancer-cn-thrown="pickup" style="${BTN_INLINE_STYLE}" title="邻接该投出武器时以自由动作取回">🤚 自由动作拾回</button>`
				+ `<button type="button" data-lancer-cn-thrown="undo" style="${BTN_INLINE_STYLE}" title="若本次攻击实为邻接近战而非投掷，点击撤销投出标记">↩ 撤销投出</button>`,
			);
		} else {
			parts.push(`<span style="opacity:.7">🪃「${escHtml(info.item.name)}」已收回</span>`);
		}
	}

	// 3c. 战场分析师「优越情报」反应按钮（拥有该天赋的玩家在任意攻击卡上可见）
	if (info?.isAttack && info.attack?.targets?.length) {
		const analystUsed = getObjectFlag(message, "analystUsed");
		if (analystUsed.by) {
			parts.push(`<span style="padding:0 4px;border-radius:3px;background:#e3f2fd;color:#0d47a1">优越情报(${analystUsed.delta > 0 ? `+${analystUsed.delta}` : analystUsed.delta})→${analystUsed.newTotal}</span>`);
		} else {
			const analystMech = findOwnedAnalystMech();
			if (analystMech) {
				const r = talentRank(analystMech, "t_field_analyst");
				const v = r >= 2 ? (getTalentDie(analystMech, "analyst") ?? 1) : 1;
				parts.push(`<button type="button" data-lancer-cn-analyst="add" style="${BTN_INLINE_STYLE}" title="消耗反应将盟友本次攻击掷骰 +${v}">📡 优越情报 +${v}</button>`);
				if (r >= 3) {
					parts.push(`<button type="button" data-lancer-cn-analyst="sub" style="${BTN_INLINE_STYLE}" title="消耗反应将敌方本次攻击掷骰 -${v}">📡 激活干扰 -${v}</button>`);
				}
			}
		}
	}

	// 4. 手动目标状态按钮（攻击卡保留全部命中状态按钮，非攻击卡有目标减益时也提供）
	if (canControl && info?.manualStatuses?.length) {
		const alreadyIds = !undone && applied.length ? new Set(applied.flatMap(r => r.statuses ?? [])) : new Set();
		const remain = info.manualStatuses.filter(id => !alreadyIds.has(id));
		if (remain.length) {
			const btn = id => `<button type="button" data-lancer-cn-status="${id}" style="${BTN_INLINE_STYLE}">${STATUS_LABEL[id] ?? ALL_STATUS_LABELS[id] ?? id}</button>`;
			parts.push(`<span>${info.isAttack ? "命中效果 · 施加：" : "施加状态："}</span>${remain.map(btn).join("")}`);
		}
	}

	// 5. 非攻击卡自身 / 盟友增益与抗性快捷按钮
	if (canControl && info && !info.isAttack) {
		const alreadyIds = !undone && applied.length ? new Set(applied.flatMap(r => r.statuses ?? [])) : new Set();
		const selfRemain = [...info.selfAutoStatuses, ...info.selfManualStatuses].filter((id, i, arr) => arr.indexOf(id) === i && !alreadyIds.has(id));
		if (selfRemain.length) {
			if (RESIST_IDS.every(id => selfRemain.includes(id))) {
				const others = selfRemain.filter(id => !RESIST_IDS.includes(id));
				parts.push(`<span>增益：</span><button type="button" data-lancer-cn-self-status="all_resist" style="${BTN_INLINE_STYLE}">全伤害抗性</button>${others.map(id => `<button type="button" data-lancer-cn-self-status="${id}" style="${BTN_INLINE_STYLE}">${ALL_STATUS_LABELS[id] ?? id}</button>`).join("")}`);
			} else {
				parts.push(`<span>增益：</span>${selfRemain.map(id => `<button type="button" data-lancer-cn-self-status="${id}" style="${BTN_INLINE_STYLE}">${ALL_STATUS_LABELS[id] ?? id}</button>`).join("")}`);
			}
		}
	}

	// 6. 擒拿控场后续按钮（攻击方、防御方与 GM 均可见）
	const gs = getObjectFlag(message, "grappleState");
	if (gs.attackerUuid && gs.defenderUuid) {
		const canGrapple = Boolean(canControl || resolveActor(gs.attackerUuid)?.isOwner || resolveActor(gs.defenderUuid)?.isOwner);
		if (canGrapple) {
			if (gs.active) {
				const ctrlName = gs.controller === "defender" ? gs.defenderName : gs.attackerName;
				const subName = gs.controller === "defender" ? gs.attackerName : gs.defenderName;
				const ctrlBtn = gs.sameSize
					? `<button type="button" data-lancer-cn-grapple="control" style="${BTN_INLINE_STYLE}" title="同体型双方可在任一方回合开始发起机体对抗检定争夺主导">🎲 同体型争抢主导</button>`
					: "";
				parts.push(
					`<span>擒拿中（主导：<b>${escHtml(ctrlName)}</b>，固定：${escHtml(subName)}）：</span>`
					+ `<button type="button" data-lancer-cn-grapple="break" style="${BTN_INLINE_STYLE}" title="防御方以快速动作发起机体对抗检定挣脱擒拿">🎲 挣脱擒拿</button>`
					+ ctrlBtn
					+ `<button type="button" data-lancer-cn-grapple="end" style="${BTN_INLINE_STYLE}" title="攻击方以自由动作松开，或双方不再邻接时结束擒拿">✕ 结束擒拿</button>`,
				);
			} else {
				parts.push(`<span style="opacity:.65">擒拿已结束${gs.endedReason ? `（${escHtml(gs.endedReason)}）` : ""}</span>`);
			}
		}
	}

	// 7. 核心系统激活卡：专属控制与子动作按钮
	if (canControl && info?.isCoreActivation && info.actor) {
		const cpRow = renderCoreControlHTML(info.actor, { inSheet: false });
		if (cpRow) parts.push(cpRow);
	}

	// 8. 夜刀蛾「完美射击」：消耗锁定命中时三选一附加效果按钮
	const cpDmgMod = getObjectFlag(message, "cpDamageMod");
	if (canControl && info?.isAttack && cpDmgMod.nightCutterHitChoice) {
		parts.push(
			`<span>完美射击 · 命中三选一：</span>`
			+ `<button type="button" data-lancer-cn-nightcutter="shredded" style="${BTN_INLINE_STYLE}">离散</button>`
			+ `<button type="button" data-lancer-cn-nightcutter="prone" style="${BTN_INLINE_STYLE}">伏卧</button>`
			+ `<button type="button" data-lancer-cn-nightcutter="reveal" style="${BTN_INLINE_STYLE}">显形（清匿迹/隐形）</button>`,
		);
	}

	// 9. NPC 无人机 / 地雷 / 可展开物一键生成并部署指示物
	if (canControl && info && !info.isAttack && info.npcDeployable) {
		const dp = info.npcDeployable;
		parts.push(
			`<button type="button" data-lancer-cn-spawn-deploy="1" style="${BTN_INLINE_STYLE}" title="创建并部署 ${escHtml(dp.name)}（大小 ${dp.size} · HP ${dp.hp} · 回避 ${dp.evasion} · 电防 ${dp.edef}）">🤖 部署「${escHtml(dp.name)}」（HP ${dp.hp}）</button>`,
		);
	}

	if (!parts.length) return "";
	return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${parts.join("")}</div>`;
}

async function spawnNpcDeployableFromCard(message, info) {
	const spec = info?.npcDeployable;
	if (!spec) return null;
	const owner = info.actor ?? resolveActor(info.actorUuid);
	if (!(game.user?.isGM || owner?.isOwner)) {
		ui?.notifications?.warn?.("需要 GM 或发起者权限才能在场上创建可部署物。");
		return null;
	}
	const ownerName = owner?.token?.name ?? owner?.name ?? "NPC";
	const fullName = spec.name.includes(ownerName) ? spec.name : `${spec.name}（${ownerName}）`;
	const deployKey = `${owner?.id ?? ownerName}::${info.item?.system?.lid ?? spec.name}::t${Math.min(3, Math.max(1, Number(owner?.system?.tier) || 1))}`;
	const ownerActorUuid = (typeof owner?.uuid === "string" && owner.uuid.startsWith("Actor.")) ? owner.uuid : undefined;
	const ownerTok = attackerToken(owner);
	const disp = ownerTok?.document?.disposition ?? (CONST?.TOKEN_DISPOSITIONS?.HOSTILE ?? -1);
	const tokSpan = spec.size < 1 ? 1 : Math.floor(spec.size);
	const defaultImg = spec.deployType === "Mine"
		? "systems/lancer/assets/icons/mine.svg"
		: spec.deployType === "Drone"
			? "systems/lancer/assets/icons/drone.svg"
			: "systems/lancer/assets/icons/deployable.svg";

	let depActor = (game?.actors ?? []).find?.(a => a?.type === "deployable" && (a.getFlag?.(MODULE_ID, "npcDeployableKey") ?? a.flags?.[MODULE_ID]?.npcDeployableKey) === deployKey) ?? null;
	const actorData = {
		name: fullName,
		type: "deployable",
		img: defaultImg,
		system: {
			type: spec.deployType,
			detail: spec.detail || "",
			stats: {
				armor: spec.armor,
				edef: spec.edef,
				evasion: spec.evasion,
				heatcap: spec.heatcap,
				hp: String(spec.hp),
				save: spec.save,
				size: spec.size,
				speed: spec.speed,
			},
			hp: { min: 0, max: spec.hp, value: spec.hp },
			...(ownerActorUuid ? { deployer: ownerActorUuid, owner: ownerActorUuid } : {}),
		},
		prototypeToken: {
			name: fullName,
			disposition: disp,
			width: tokSpan,
			height: tokSpan,
			actorLink: false,
			texture: { src: defaultImg },
		},
		flags: { [MODULE_ID]: { npcDeployableKey: deployKey } },
	};

	if (!depActor && globalThis.Actor?.create) {
		depActor = await globalThis.Actor.create(actorData);
	} else if (depActor?.update) {
		await depActor.update({
			"system.stats": actorData.system.stats,
			"system.hp.max": spec.hp,
			"system.hp.value": spec.hp,
		});
	}

	let createdToken = null;
	const scene = globalThis.canvas?.scene;
	if (scene?.createEmbeddedDocuments) {
		const gridSize = Number(globalThis.canvas?.grid?.size) || 100;
		const baseX = Number(ownerTok?.document?.x ?? ownerTok?.x) || gridSize;
		const baseY = Number(ownerTok?.document?.y ?? ownerTok?.y) || gridSize;
		const ownerW = (Number(ownerTok?.document?.width) || 1) * gridSize;
		const tokenDocData = {
			name: fullName,
			actorId: depActor?.id ?? null,
			actorLink: false,
			disposition: disp,
			width: tokSpan,
			height: tokSpan,
			x: baseX + ownerW,
			y: baseY,
			texture: { src: depActor?.img || defaultImg },
		};
		const created = await scene.createEmbeddedDocuments("Token", [tokenDocData]);
		createdToken = created?.[0] ?? null;
	}
	globalThis.ui?.notifications?.info?.(`已部署「${fullName}」（HP ${spec.hp}，回避 ${spec.evasion}，电子防御 ${spec.edef}）！`);
	return { actor: depActor, token: createdToken, spec };
}

function npcRechargeTargetVal(tag, effTier = 1) {
	if (!tag) return 5;
	const tier = Math.min(3, Math.max(1, Number(effTier) || 1));
	if (typeof tag.tierVal === "function") {
		const tv = parseInt(tag.tierVal(tier), 10);
		if (Number.isFinite(tv) && tv > 0) return tv;
	}
	const raw = String(tag.val ?? tag.num_val ?? "").trim();
	if (raw.includes("/")) {
		const parts = raw.replace(/^\{|\}$/g, "").split("/").map(s => parseInt(s.trim(), 10));
		const picked = parts[Math.min(parts.length - 1, tier - 1)];
		if (Number.isFinite(picked) && picked > 0) return picked;
	}
	const n = parseInt(raw, 10) || parseInt(tag.num_val, 10);
	return Number.isFinite(n) && n > 0 ? n : 5;
}

async function executeTurnEndBurnCheck(message, actor) {
	if (!actor) return false;
	if (!(game.user?.isGM || actor.isOwner)) {
		globalThis.ui?.notifications?.warn?.(`请由 ${actor.name ?? "该角色"} 的拥有者或 GM 进行燃烧检定。`);
		return false;
	}
	const curBurn = Math.max(0, Number(actor.system?.burn) || 0);
	if (curBurn <= 0) {
		const te = getObjectFlag(message, "turnEndClear");
		await updateMessageFlagCompat(message, "turnEndClear", { ...te, burnResolved: true });
		return true;
	}
	if (hasCoreBonus(actor, "cb_ch_extinguisher")) {
		await actor.update?.({ "system.burn": 0 });
		const te = getObjectFlag(message, "turnEndClear");
		await updateMessageFlagCompat(message, "turnEndClear", { ...te, burnResolved: true });
		await postCpEffectCard(actor, "自动灭火器 · 燃烧清除", `<p><b>${escHtml(actor.name)}</b> 的<b>自动灭火器</b>自动通过燃烧检定并清除了全部燃烧标记！</p>`);
		return true;
	}
	let ranNative = false;
	const hasSceneToken = Boolean(actor.getActiveTokens?.()?.length);
	if (hasSceneToken && typeof actor.beginBurnFlow === "function") {
		ranNative = Boolean(await actor.beginBurnFlow());
	} else {
		const BurnCls = hasSceneToken ? game.lancer?.flows?.get?.("BurnFlow") : null;
		if (BurnCls) {
			const flow = new BurnCls(actor, {});
			ranNative = Boolean(await flow.begin());
		}
	}
	if (!ranNative) {
		let total = null;
		const StatCls = game.lancer?.flows?.get?.("StatRollFlow");
		if (StatCls) {
			const flow = new StatCls(actor.uuid ?? actor, { title: "BURN :: ENG", path: "system.eng" });
			const ok = await flow.begin({ ...flow.state?.data, title: "BURN :: ENG", path: "system.eng" });
			if (ok === false) return false;
			total = Number(flow.state?.data?.result?.roll?.total);
		}
		if (!Number.isFinite(total)) {
			const eng = Number(actor.system?.eng) || 0;
			const roll = await new Roll(`1d20+${eng}`).evaluate();
			total = Number(roll.total);
		}
		if (total >= 10) {
			await actor.update?.({ "system.burn": 0 });
			await postCpEffectCard(actor, "燃烧检定成功 · 燃烧已扑灭！", `<p><b>${escHtml(actor.name)}</b> 工程检定 <b>${total}</b> vs DC 10 → <b style="color:#2e7d32">成功！</b>已清除全部 ${curBurn} 点燃烧标记。</p>`);
		} else {
			if (typeof actor.damageCalc === "function") {
				await actor.damageCalc(
					{ Kinetic: 0, Energy: 0, Explosive: 0, Burn: curBurn, Heat: 0, Variable: 0 },
					{ multiple: 1, addBurn: false, ap: true, paracausal: true, dmgCtx: { isBurnTick: true } },
				);
			} else {
				const nextHp = (Number(actor.system?.hp?.value) || 0) - curBurn;
				await actor.update?.({ "system.hp.value": mechFrameLid(actor) === "mf_ext_tametomo" ? Math.max(1, nextHp) : nextHp });
			}
			await postCpEffectCard(actor, "燃烧检定失败 · 承受燃烧伤害", `<p><b>${escHtml(actor.name)}</b> 工程检定 <b>${total}</b> vs DC 10 → <b style="color:#c62828">失败！</b>承受 <b>${curBurn} 点穿甲燃烧伤害</b>。</p>`);
		}
	}
	const te = getObjectFlag(message, "turnEndClear");
	await updateMessageFlagCompat(message, "turnEndClear", { ...te, burnResolved: true });
	return true;
}

async function executeNpcRechargePrompt(message) {
	const rp = getObjectFlag(message, "npcRechargePrompt");
	if (!rp.uuid || rp.rolled) return false;
	const actor = resolveActor(rp.uuid);
	if (!actor || !(game.user?.isGM || actor.isOwner)) return false;
	let usedNative = false;
	if (typeof actor.beginRechargeFlow === "function") {
		usedNative = Boolean(await actor.beginRechargeFlow());
	} else {
		const RechCls = game.lancer?.flows?.get?.("NPCRechargeFlow");
		if (RechCls && Array.isArray(RechCls.steps)) {
			const flow = new RechCls(actor, {});
			usedNative = Boolean(await flow.begin());
		}
	}
	if (!usedNative) {
		const roll = await new Roll("1d6").evaluate();
		const total = Number(roll.total) || 1;
		const actorTier = Math.min(3, Math.max(1, Number(actor.system?.tier) || 1));
		const recharged = [];
		for (const item of actor.items ?? []) {
			if (item?.type && item.type !== "npc_feature" && !item?.is_npc_feature?.()) continue;
			if (item.system?.destroyed || item.system?.charged !== false) continue;
			const tags = (() => { try { return item.getTags?.() ?? item.system?.tags ?? []; } catch { return item.system?.tags ?? []; } })();
			const tag = tags.find(t => t?.is_recharge || t?.lid === "tg_recharge");
			if (!tag) continue;
			const effTier = Math.min(3, Math.max(1, Number(item.system?.tier_override) || actorTier));
			const req = npcRechargeTargetVal(tag, effTier);
			if (total >= req) {
				if (typeof item.update === "function") await item.update({ "system.charged": true });
				else item.system.charged = true;
				recharged.push(`${item.name}（${req}+ ✓）`);
			}
		}
		await postCpEffectCard(
			actor,
			`NPC 充能检定 · 1d6 = ${total}`,
			`<p><b>${escHtml(rp.name || actor.name)}</b> 掷出 1d6 = <b>${total}</b>：${recharged.length ? `已成功充能 <b>${escHtml(recharged.join("、"))}</b>！` : "未达到充能阈值。"}</p>`,
		);
	}
	await updateMessageFlagCompat(message, "npcRechargePrompt", { ...rp, rolled: true });
	return true;
}

async function executeUltraJuggernautChoice(message, choiceKey) {
	const jp = getObjectFlag(message, "ultraJuggernautPrompt");
	if (!jp.uuid || jp.resolved || !choiceKey) return false;
	const actor = resolveActor(jp.uuid);
	if (!actor || !(game.user?.isGM || actor.isOwner)) return false;
	if (jp.mode === "clearStatus") {
		await setActorStatus(jp.uuid, choiceKey, false);
		await updateMessageFlagCompat(message, "ultraJuggernautPrompt", { ...jp, resolved: true, chosen: choiceKey });
		await postCpEffectCard(actor, "超体 · 主宰（清除状态）", `<p><b>${escHtml(jp.name || actor.name)}</b> 已通过<b>主宰</b>清除状态：<b>${escHtml(ALL_STATUS_LABELS[choiceKey] ?? choiceKey)}</b>。</p>`);
		return true;
	}
	if (jp.mode === "repairItem") {
		const item = actor.items?.get?.(choiceKey) ?? (actor.items ?? []).find?.(i => i.id === choiceKey || i.uuid === choiceKey);
		if (!item) return false;
		if (typeof item.update === "function") await item.update({ "system.destroyed": false });
		else if (item.system) item.system.destroyed = false;
		await updateMessageFlagCompat(message, "ultraJuggernautPrompt", { ...jp, resolved: true, chosen: item.name });
		await postCpEffectCard(actor, "超体 · 主宰（修复装备）", `<p><b>${escHtml(jp.name || actor.name)}</b> 已通过<b>主宰</b>修复被摧毁的装备：<b>${escHtml(item.name)}</b>！</p>`);
		return true;
	}
	return false;
}

function renderContestRowHTML(contest, canRespond) {
	if (contest.resolved) {
		const color = contest.initiatorWon ? "#2e7d32" : "#c62828";
		return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)"><span style="color:${color};font-weight:bold">${escHtml(contest.outcomeText || "对抗检定已结算")}</span></div>`;
	}
	if (!canRespond) {
		return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)"><span style="opacity:.75">等待 <b>${escHtml(contest.responderName)}</b> 点击应战…</span></div>`;
	}
	const btns = (contest.responderOptions ?? [{ key: "hull", label: "机体" }]).map(opt => `<button type="button" data-lancer-cn-contest-respond="${escHtml(opt.key)}" style="${BTN_INLINE_STYLE}">🎲 ${escHtml(contest.responderName)} 应战（${escHtml(opt.label)}）</button>`).join("");
	return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${btns}</div>`;
}

function renderJockeyRowHTML(js, { canPilot, canMech }) {
	if (!js.active) {
		return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)"><span style="opacity:.65">骑乘已结束${js.endedReason ? `（${escHtml(js.endedReason)}）` : ""}</span></div>`;
	}
	const segs = [];
	if (canPilot) {
		const pilotActor = resolveActor(js.pilotUuid);
		const disruptBtn = talentRank(pilotActor, "t_ext_giant_slayer") >= 2
			? `<button type="button" data-lancer-cn-jockey-eff="disrupt" style="${BTN_INLINE_STYLE}" title="巨人杀手：目标直至下回合结束不能反应并关闭一个系统">瓦解（禁反应+关系统）</button>`
			: "";
		segs.push(
			`<span>骑乘效果：</span>`
			+ `<button type="button" data-lancer-cn-jockey-eff="distract" style="${BTN_INLINE_STYLE}" title="目标机甲陷入受损与缓慢直到其下回合结束">干扰（受损+缓慢）</button>`
			+ `<button type="button" data-lancer-cn-jockey-eff="shred" style="${BTN_INLINE_STYLE}" title="对目标机甲造成 2 点热度">扯断管线（+2 热度）</button>`
			+ `<button type="button" data-lancer-cn-jockey-eff="damage" style="${BTN_INLINE_STYLE}" title="对目标机甲造成 4 点动能伤害">破坏（4 动能）</button>`
			+ disruptBtn,
		);
	}
	if (canMech) {
		segs.push(
			`<span>反制：</span>`
			+ `<button type="button" data-lancer-cn-jockey-shake="hull" style="${BTN_INLINE_STYLE}" title="机甲以完整动作进行机体对抗检定甩脱驾驶员">🎲 甩脱（机体）</button>`
			+ `<button type="button" data-lancer-cn-jockey-shake="agi" style="${BTN_INLINE_STYLE}" title="机甲以完整动作进行敏捷对抗检定甩脱驾驶员">🎲 甩脱（敏捷）</button>`,
		);
	}
	if (canPilot || canMech) {
		segs.push(`<button type="button" data-lancer-cn-jockey-end="1" style="${BTN_INLINE_STYLE}" title="驾驶员主动跳下或骑乘终止">✕ 结束骑乘</button>`);
	}
	if (!segs.length) return "";
	return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${segs.join("")}</div>`;
}

function renderTurnEndRowHTML(turnEnd) {
	const cleared = new Set(turnEnd.cleared ?? []);
	const statuses = turnEnd.statuses ?? [];
	const pills = statuses.map(id => {
		const isCleared = cleared.has(id);
		const label = ALL_STATUS_LABELS[id] ?? id;
		return `<button type="button" data-lancer-cn-turn-toggle="${id}" style="${BTN_INLINE_STYLE};${isCleared ? "opacity:.65;text-decoration:line-through" : ""}" title="${isCleared ? "点击恢复该状态" : "点击清除该状态"}">${isCleared ? "↩ " : "× "}${escHtml(label)}</button>`;
	}).join("");
	const allDone = !statuses.length || statuses.every(id => cleared.has(id));
	const clearAllBtn = allDone ? "" : `<button type="button" data-lancer-cn-turn-clear-all="1" style="${BTN_INLINE_STYLE}">全部清除</button>`;
	const burnVal = Math.max(0, Number(turnEnd.burn) || 0);
	const burnBtn = burnVal > 0
		? `<button type="button" data-lancer-cn-turn-burn="1" style="${BTN_INLINE_STYLE};${turnEnd.burnResolved ? "opacity:.65" : ""}" ${turnEnd.burnResolved ? "disabled" : ""} title="工程检定 DC 10：成功清除全部燃烧，失败承受等量穿甲燃烧伤害">🔥 ${turnEnd.burnResolved ? "已执行燃烧检定" : `掷燃烧检定（${burnVal} 燃烧）`}</button>`
		: "";
	return `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${burnBtn}${pills}${clearAllBtn}</div>`;
}

function onRenderChatMessage(message, html) {
	const root = (typeof HTMLElement === "function" && html instanceof HTMLElement) ? html : (html?.[0] ?? html);
	if (!root) return;

	// 1. 伤害卡：注入实时护甲 / 抗性 / 护盾结算预览（以及未锁定目标伤害卡的兜底应用栏）
	const damageData = message?.getFlag?.("lancer", "damageData") ?? message?.flags?.lancer?.damageData;
	if (damageData && typeof damageData === "object") {
		decorateDamageCard(message, root, damageData);
		return;
	}

	if (root.querySelector?.(".lancer-cn-status-row")) return;

	// 2. 回合结束清异常与燃烧检定提醒卡
	const turnEnd = getObjectFlag(message, "turnEndClear");
	if ((Array.isArray(turnEnd.statuses) && turnEnd.statuses.length) || Number(turnEnd.burn) > 0) {
		const actor = resolveActor(turnEnd.uuid);
		if (!(game.user?.isGM || actor?.isOwner)) return;
		const content = root.querySelector?.(".message-content") ?? root;
		content.insertAdjacentHTML("beforeend", renderTurnEndRowHTML(turnEnd));
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			if (ev.target.closest?.("[data-lancer-cn-turn-burn]")?.dataset?.lancerCnTurnBurn) {
				await executeTurnEndBurnCheck(message, actor);
				const rowEl = content.querySelector(".lancer-cn-status-row");
				if (rowEl) { rowEl.remove(); onRenderChatMessage(message, root); }
				return;
			}
			const toggleId = ev.target.closest?.("[data-lancer-cn-turn-toggle]")?.dataset?.lancerCnTurnToggle;
			const clearAll = ev.target.closest?.("[data-lancer-cn-turn-clear-all]")?.dataset?.lancerCnTurnClearAll;
			if (!toggleId && !clearAll) return;
			const cur = getObjectFlag(message, "turnEndClear");
			const base = (Array.isArray(cur.statuses) || Number(cur.burn) > 0) ? cur : turnEnd;
			const clearedSet = new Set(base.cleared ?? []);
			if (clearAll) {
				for (const id of base.statuses ?? []) {
					if (!clearedSet.has(id)) { await setActorStatus(base.uuid, id, false); clearedSet.add(id); }
				}
			} else if (toggleId) {
				const restore = clearedSet.has(toggleId);
				await setActorStatus(base.uuid, toggleId, restore);
				restore ? clearedSet.delete(toggleId) : clearedSet.add(toggleId);
			}
			await updateMessageFlagCompat(message, "turnEndClear", { ...base, cleared: [...clearedSet] });
		});
		return;
	}

	// 2b. 回合开始 NPC 充能检定提醒卡
	const npcRech = getObjectFlag(message, "npcRechargePrompt");
	if (npcRech.uuid) {
		const actor = resolveActor(npcRech.uuid);
		if (!(game.user?.isGM || actor?.isOwner)) return;
		const content = root.querySelector?.(".message-content") ?? root;
		const rowHtml = `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${npcRech.rolled ? `<span style="opacity:.65">✓ 已执行本回合充能检定</span>` : `<button type="button" data-lancer-cn-npc-recharge="1" style="${BTN_INLINE_STYLE}">🎲 一键掷充能（1d6）</button>`}</div>`;
		content.insertAdjacentHTML("beforeend", rowHtml);
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			if (ev.target.closest?.("[data-lancer-cn-npc-recharge]")?.dataset?.lancerCnNpcRecharge) {
				await executeNpcRechargePrompt(message);
				const rowEl = content.querySelector(".lancer-cn-status-row");
				if (rowEl) { rowEl.remove(); onRenderChatMessage(message, root); }
			}
		});
		return;
	}

	// 2c. 超体「主宰」多状态清除 / 多损毁装备修复选择卡
	const ultraJug = getObjectFlag(message, "ultraJuggernautPrompt");
	if (ultraJug.uuid && Array.isArray(ultraJug.options)) {
		const actor = resolveActor(ultraJug.uuid);
		if (!(game.user?.isGM || actor?.isOwner)) return;
		const content = root.querySelector?.(".message-content") ?? root;
		const inner = ultraJug.resolved
			? `<span style="opacity:.7">✓ 主宰已生效（${escHtml(ALL_STATUS_LABELS[ultraJug.chosen] ?? ultraJug.chosen ?? "已完成")}）</span>`
			: ultraJug.options.map(o => `<button type="button" data-lancer-cn-ultra-jug="${escHtml(o.key ?? o.id)}" style="${BTN_INLINE_STYLE}">${ultraJug.mode === "repairItem" ? "🔧 修复：" : "✨ 清除："}${escHtml(o.label)}</button>`).join("");
		content.insertAdjacentHTML("beforeend", `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${inner}</div>`);
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			const choice = ev.target.closest?.("[data-lancer-cn-ultra-jug]")?.dataset?.lancerCnUltraJug;
			if (choice) {
				await executeUltraJuggernautChoice(message, choice);
				const rowEl = content.querySelector(".lancer-cn-status-row");
				if (rowEl) { rowEl.remove(); onRenderChatMessage(message, root); }
			}
		});
		return;
	}

	// 3. 对抗检定卡（挣脱擒拿、争抢主导、搜索匿迹、步战骑乘、甩脱骑乘）
	const contest = getObjectFlag(message, "contest");
	if (contest.kind) {
		const respActor = resolveActor(contest.responderUuid);
		const canRespond = Boolean(game.user?.isGM || respActor?.isOwner);
		const content = root.querySelector?.(".message-content") ?? root;
		content.insertAdjacentHTML("beforeend", renderContestRowHTML(contest, canRespond));
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			const key = ev.target.closest?.("[data-lancer-cn-contest-respond]")?.dataset?.lancerCnContestRespond;
			if (key) await respondToContest(message, key);
		});
		return;
	}

	// 4. 步战骑乘控制卡
	const js = getObjectFlag(message, "jockeyState");
	if (js.pilotUuid && js.mechUuid) {
		const canPilot = Boolean(game.user?.isGM || resolveActor(js.pilotUuid)?.isOwner);
		const canMech = Boolean(game.user?.isGM || resolveActor(js.mechUuid)?.isOwner);
		const rowHtml = renderJockeyRowHTML(js, { canPilot, canMech });
		if (!rowHtml) return;
		const content = root.querySelector?.(".message-content") ?? root;
		content.insertAdjacentHTML("beforeend", rowHtml);
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			const eff = ev.target.closest?.("[data-lancer-cn-jockey-eff]")?.dataset?.lancerCnJockeyEff;
			if (eff) { await executeJockeyEffect(message, eff); return; }
			const shake = ev.target.closest?.("[data-lancer-cn-jockey-shake]")?.dataset?.lancerCnJockeyShake;
			if (shake) { await startJockeyShakeOff(message, shake); return; }
			if (ev.target.closest?.("[data-lancer-cn-jockey-end]")?.dataset?.lancerCnJockeyEnd) {
				await endJockey(message, "结束骑乘");
			}
		});
		return;
	}

	// 5. 受身反应卡（附一键关闭受身临时全抗性按钮）
	const brace = getObjectFlag(message, "braceCard");
	if (brace.uuid) {
		if (!(game.user?.isGM || message?.isAuthor || resolveActor(brace.uuid)?.isOwner)) return;
		const cleared = message?.getFlag?.(MODULE_ID, "braceCleared") === true;
		const rowHtml = `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${cleared ? `<span style="opacity:.65">已关闭受身全抗性</span>` : `<button type="button" data-lancer-cn-brace-clear="1" style="${BTN_INLINE_STYLE}">🛡 关闭受身抗性</button>`}</div>`;
		const content = root.querySelector?.(".message-content") ?? root;
		content.insertAdjacentHTML("beforeend", rowHtml);
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			if (ev.target.closest?.("[data-lancer-cn-brace-clear]")?.dataset?.lancerCnBraceClear) {
				await clearBraceResistances(message);
			}
		});
		return;
	}

	// 5b. 牛头怪「迷宫」递减难度系统豁免卡
	const ms = getObjectFlag(message, "mazeState");
	if (ms.targetUuid) {
		const canRoll = Boolean(game.user?.isGM || resolveActor(ms.targetUuid)?.isOwner || resolveActor(ms.minotaurUuid)?.isOwner);
		const rowHtml = renderMazeRowHTML(ms, canRoll);
		if (!rowHtml) return;
		const content = root.querySelector?.(".message-content") ?? root;
		content.insertAdjacentHTML("beforeend", rowHtml);
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			if (ev.target.closest?.("[data-lancer-cn-maze-save]")?.dataset?.lancerCnMazeSave) {
				await attemptMazeSave(message);
				return;
			}
			if (ev.target.closest?.("[data-lancer-cn-maze-end]")?.dataset?.lancerCnMazeEnd) {
				await setActorStatus(ms.targetUuid, "stunned", false);
				await updateMessageFlagCompat(message, "mazeState", { ...ms, active: false });
			}
		});
		return;
	}

	// 5c. 守望触发提醒卡（仅向守望方拥有者或 GM 展示武器按钮，避免剧透未扫描 NPC 武器）
	const ow = getObjectFlag(message, "overwatchPrompt");
	if (Array.isArray(ow.watchers) && ow.watchers.length) {
		const renderOwInner = curOw => {
			if (curOw.dismissed) {
				return `<span style="opacity:.65">已忽略本次守望触发</span>`;
			}
			const parts = [];
			let hasActionableForMe = false;
			for (const wEntry of curOw.watchers ?? []) {
				if (wEntry.triggeredWeaponName) {
					parts.push(`<span style="color:#2e7d32;font-weight:bold">✓ ${escHtml(wEntry.watcherName)} 已以「${escHtml(wEntry.triggeredWeaponName)}」发动守望</span>`);
					continue;
				}
				const wActor = resolveActor(wEntry.watcherUuid);
				const canUse = Boolean(game.user?.isGM || wActor?.isOwner);
				if (!canUse) {
					parts.push(`<span style="opacity:.78">等待 <b>${escHtml(wEntry.watcherName)}</b> 决定是否发动守望…</span>`);
					continue;
				}
				hasActionableForMe = true;
				for (const wpn of wEntry.weapons ?? []) {
					const wKey = wpn.id || wpn.uuid || wpn.name;
					const modeTag = wpn.triggerMode === "vanguardEnter" ? " · 永远警惕" : "";
					parts.push(`<button type="button" data-lancer-cn-overwatch="${escHtml(wEntry.watcherUuid)}::${escHtml(wKey)}" style="${BTN_INLINE_STYLE}">🎯 ${escHtml(wEntry.watcherName)}：${escHtml(wpn.name)}（威胁 ${wpn.threat}${modeTag}）</button>`);
				}
			}
			if (hasActionableForMe) {
				parts.push(`<button type="button" data-lancer-cn-overwatch-dismiss="1" style="${BTN_INLINE_STYLE}">✕ 忽略</button>`);
			}
			return parts.join("");
		};
		const content = root.querySelector?.(".message-content") ?? root;
		const innerHtml = renderOwInner(ow);
		if (!innerHtml) return;
		content.insertAdjacentHTML("beforeend", `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${innerHtml}</div>`);
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			const owAttr = ev.target.closest?.("[data-lancer-cn-overwatch]")?.dataset?.lancerCnOverwatch;
			if (owAttr) {
				const sep = owAttr.indexOf("::");
				const watcherUuid = sep >= 0 ? owAttr.slice(0, sep) : owAttr;
				const weaponId = sep >= 0 ? owAttr.slice(sep + 2) : null;
				const wActor = resolveActor(watcherUuid);
				const curOw = getObjectFlag(message, "overwatchPrompt");
				const wEntry = (curOw.watchers ?? ow.watchers ?? []).find(x => x.watcherUuid === watcherUuid);
				const wMeta = (wEntry?.weapons ?? []).find(x => (x.id || x.uuid || x.name) === weaponId);
				const ok = await executeOverwatchAttack(wActor, {
					weaponId,
					targetTokenOrUuid: curOw.moverUuid ?? ow.moverUuid,
					message,
					triggerDist: Number.isFinite(wMeta?.triggerDist) ? Number(wMeta.triggerDist) : null,
				});
				if (ok) {
					const rowEl = content.querySelector(".lancer-cn-status-row");
					if (rowEl) { rowEl.remove(); onRenderChatMessage(message, root); }
				}
				return;
			}
			if (ev.target.closest?.("[data-lancer-cn-overwatch-dismiss]")?.dataset?.lancerCnOverwatchDismiss) {
				const curOw = getObjectFlag(message, "overwatchPrompt");
				await updateMessageFlagCompat(message, "overwatchPrompt", { ...(curOw.watchers ? curOw : ow), dismissed: true });
				const rowEl = content.querySelector(".lancer-cn-status-row");
				if (rowEl) { rowEl.remove(); onRenderChatMessage(message, root); }
			}
		});
		return;
	}

	// 5d. 准备动作卡（提供消耗反应一键触发与取消保持按钮）
	const prep = getObjectFlag(message, "prepareCard");
	if (prep.uuid) {
		const pActor = resolveActor(prep.uuid);
		if (!(game.user?.isGM || message?.isAuthor || pActor?.isOwner)) return;
		const content = root.querySelector?.(".message-content") ?? root;
		const inner = prep.triggered
			? `<span style="color:#2e7d32;font-weight:bold">✓ 已消耗反应触发准备动作</span>`
			: prep.cancelled
				? `<span style="opacity:.65">已取消准备动作</span>`
				: `<button type="button" data-lancer-cn-prep-trigger="1" style="${BTN_INLINE_STYLE}" title="满足触发条件时消耗反应执行准备好的动作">⚡ 触发准备动作（消耗反应）</button><button type="button" data-lancer-cn-prep-cancel="1" style="${BTN_INLINE_STYLE}">✕ 取消准备</button>`;
		content.insertAdjacentHTML("beforeend", `<div class="lancer-cn-status-row" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px;font-size:var(--font-size-12,12px)">${inner}</div>`);
		content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
			if (ev.target.closest?.("[data-lancer-cn-prep-trigger]")?.dataset?.lancerCnPrepTrigger) {
				const ok = await triggerPreparedAction(message);
				if (ok) {
					const rowEl = content.querySelector(".lancer-cn-status-row");
					if (rowEl) { rowEl.remove(); onRenderChatMessage(message, root); }
				}
				return;
			}
			if (ev.target.closest?.("[data-lancer-cn-prep-cancel]")?.dataset?.lancerCnPrepCancel) {
				const ok = await cancelPreparedAction(message);
				if (ok) {
					const rowEl = content.querySelector(".lancer-cn-status-row");
					if (rowEl) { rowEl.remove(); onRenderChatMessage(message, root); }
				}
			}
		});
		return;
	}

	// 6. 攻击卡 / 技能系统卡 / 已挂状态结果卡 / 擒拿卡 / 核心系统激活卡
	const info = analyzeCard(message, root);
	const hasApplied = getArrayFlag(message, "appliedStatuses").length > 0;
	const gs = getObjectFlag(message, "grappleState");
	const hasGrapple = Boolean(gs.attackerUuid && gs.defenderUuid);
	if (!info && !hasApplied && !hasGrapple) return;
	const rowHtml = buildCardAutomationHTML(message, info);
	if (!rowHtml) return;

	const content = root.querySelector?.(".message-content") ?? root;
	content.insertAdjacentHTML("beforeend", rowHtml);
	content.querySelector(".lancer-cn-status-row")?.addEventListener("click", async ev => {
		if (ev.target.closest?.("[data-lancer-cn-undo-status]")?.dataset?.lancerCnUndoStatus) {
			await undoAppliedStatuses(message);
			return;
		}

		const cpAct = ev.target.closest?.("[data-lancer-cn-cp-act]")?.dataset?.lancerCnCpAct;
		if (cpAct) {
			const cpActor = info?.actor ?? resolveActor(info?.actorUuid);
			await executeCoreAction(cpActor, cpAct);
			return;
		}

		const ncChoice = ev.target.closest?.("[data-lancer-cn-nightcutter]")?.dataset?.lancerCnNightcutter;
		if (ncChoice) {
			const hitUuids = (info?.attack?.targets ?? []).filter(t => t.hit || t.crit).map(t => t.uuid).filter(Boolean);
			const uuids = hitUuids.length ? hitUuids : [...(game.user?.targets ?? [])].map(t => t.document?.uuid ?? t.uuid).filter(Boolean);
			if (!uuids.length) return ui.notifications.warn("没有可应用的命中目标。");
			for (const u of uuids) {
				if (ncChoice === "reveal") {
					await setActorStatus(u, "hidden", false);
					await setActorStatus(u, "invisible", false);
				} else {
					await applyStatusTo(u, ncChoice);
				}
			}
			ui.notifications.info(ncChoice === "reveal" ? "已清除目标的匿迹与隐形。" : `已对目标施加「${ALL_STATUS_LABELS[ncChoice] ?? ncChoice}」。`);
			return;
		}

		const grappleAct = ev.target.closest?.("[data-lancer-cn-grapple]")?.dataset?.lancerCnGrapple;
		if (grappleAct) {
			if (grappleAct === "end") await endGrapple(message, "结束擒拿");
			else if (grappleAct === "break" || grappleAct === "control") await startGrappleContest(message, grappleAct);
			return;
		}

		const saveIdx = ev.target.closest?.("[data-lancer-cn-save]")?.dataset?.lancerCnSave;
		if (saveIdx !== undefined && info?.saves) {
			const sv = info.saves[Number(saveIdx)];
			if (sv) await executeCardSave(message, sv);
			return;
		}

		if (ev.target.closest?.("[data-lancer-cn-nonatk-dmg]")?.dataset?.lancerCnNonatkDmg && info) {
			await rollNonAttackDamage(message, info);
			return;
		}

		const riderKind = ev.target.closest?.("[data-lancer-cn-rider]")?.dataset?.lancerCnRider;
		if (riderKind && info) {
			await executeCardRider(message, info, riderKind);
			return;
		}

		const thrownAct = ev.target.closest?.("[data-lancer-cn-thrown]")?.dataset?.lancerCnThrown;
		if (thrownAct && info?.item) {
			if (thrownAct === "pickup") {
				await retrieveThrownWeapon(info.actor, weaponTrackKey(info.item), { notify: true, postCard: true });
				const rowEl = content.querySelector(".lancer-cn-status-row");
				if (rowEl) {
					rowEl.remove();
					onRenderChatMessage(message, root);
				}
			} else if (thrownAct === "undo") {
				await retrieveThrownWeapon(info.actor, weaponTrackKey(info.item), { notify: false });
				await updateMessageFlagCompat(message, "thrownAttack", false);
				ui?.notifications?.info?.(`已撤销「${info.item.name}」的投出标记。`);
				const rowEl = content.querySelector(".lancer-cn-status-row");
				if (rowEl) {
					rowEl.remove();
					onRenderChatMessage(message, root);
				}
			}
			return;
		}

		const analystMode = ev.target.closest?.("[data-lancer-cn-analyst]")?.dataset?.lancerCnAnalyst;
		if (analystMode && info) {
			await executeFieldAnalystReaction(message, info, analystMode);
			return;
		}

		const aoeSpec = ev.target.closest?.("[data-lancer-cn-aoe]")?.dataset?.lancerCnAoe;
		if (aoeSpec) {
			const [type, val] = String(aoeSpec).split(":");
			await placeAoETemplate(type, Number(val), attackerToken(info?.actor), { persistent: Boolean(info?.persistentAoE) });
			return;
		}
		const aoeRotRaw = ev.target.closest?.("[data-lancer-cn-aoe-rot]")?.dataset?.lancerCnAoeRot;
		if (aoeRotRaw) {
			const base = Number(aoeRotRaw) || 15;
			const delta = ev.shiftKey ? Math.sign(base) * 5 : base;
			await rotatePlacedDirectionalTemplate(delta, null, { warnIfNone: true });
			return;
		}

		if (ev.target.closest?.("[data-lancer-cn-spawn-deploy]")?.dataset?.lancerCnSpawnDeploy && info?.npcDeployable) {
			await spawnNpcDeployableFromCard(message, info);
			return;
		}

		const selfRaw = ev.target.closest?.("[data-lancer-cn-self-status]")?.dataset?.lancerCnSelfStatus;
		if (selfRaw) {
			const ids = selfRaw === "all_resist" ? RESIST_IDS : [selfRaw];
			const userTgs = Array.from(game.user?.targets ?? []).map(t => t.document?.uuid ?? t.uuid).filter(Boolean);
			const uuids = userTgs.length ? userTgs : (info?.actorUuid ? [info.actorUuid] : []);
			if (!uuids.length) return ui.notifications.warn("找不到要施加增益的目标。");
			for (const u of uuids) for (const id of ids) await applyStatusTo(u, id);
			ui.notifications.info(`已施加「${selfRaw === "all_resist" ? "全伤害抗性" : (ALL_STATUS_LABELS[selfRaw] ?? selfRaw)}」。`);
			return;
		}

		const status = ev.target.closest?.("[data-lancer-cn-status]")?.dataset?.lancerCnStatus;
		if (!status) return;
		const attack = info?.attack;
		const hit = (attack?.targets ?? []).filter(t => t.hit || t.crit).map(t => t.uuid);
		const uuids = attack?.targets?.length ? hit : [...(game.user?.targets ?? [])].map(t => t.document?.uuid ?? t.uuid);
		if (!uuids.length) return ui.notifications.warn(attack?.targets?.length ? "这次攻击没有命中任何目标。" : "请先选中要施加状态的目标。");
		let n = 0;
		for (const uuid of uuids) if (await applyStatusTo(uuid, status)) n++;
		if (n) ui.notifications.info(`已对 ${n} 个目标施加「${STATUS_LABEL[status] ?? ALL_STATUS_LABELS[status] ?? status}」。`);
	});
}

// ---------------------------------------------------------------------------
// 跨权限伤害结算 / 撤销拦截 + 武器攻击卡豁免成功减半联动
function sumAppliedDamage(entries) {
	const out = { Kinetic: 0, Energy: 0, Explosive: 0, Burn: 0, Heat: 0, Variable: 0 };
	for (const d of entries ?? []) {
		const t = d?.type;
		const v = parseInt(d?.amount ?? d?.val ?? 0, 10) || 0;
		if (t in out) out[t] += v;
	}
	return out;
}

async function gmUndoDamageByPayload(msg) {
	const target = await fromUuid(msg.actorUuid);
	const chatMessage = game.messages?.get?.(msg.messageId);
	if (!target || !chatMessage) return false;
	const overshieldDelta = parseInt(msg.overshieldDelta, 10) || 0;
	const hpDelta = parseInt(msg.hpDelta, 10) || 0;
	const burnDelta = msg.addBurn ? (parseInt(msg.burnDelta, 10) || 0) : 0;
	const heatDelta = parseInt(msg.heatDelta, 10) || 0;
	if (!overshieldDelta && !hpDelta && !burnDelta && !heatDelta) return false;
	const updateData = {
		"system.overshield.value": Math.max(0, (Number(target.system?.overshield?.value) || 0) + overshieldDelta),
		"system.hp.value": Math.max(0, (Number(target.system?.hp?.value) || 0) + hpDelta),
		"system.burn": Math.max(0, (Number(target.system?.burn) || 0) - burnDelta),
	};
	if (target.type === "mech" || target.type === "npc" || target.type === "deployable" || target.is_mech?.() || target.is_npc?.() || target.is_deployable?.()) {
		updateData["system.heat.value"] = Math.max(0, (Number(target.system?.heat?.value) || 0) - heatDelta);
	}
	let newContent = String(chatMessage.content ?? "")
		.replace(/<a\b[^>]*class="[^"]*\blancer-damage-undo\b[^"]*"[\s\S]*?<\/a>/gi, "")
		.replace(/<span>/g, '<span class="strikethrough">');
	if (typeof DOMParser === "function") {
		try {
			const doc = new DOMParser().parseFromString(chatMessage.content, "text/html");
			doc.querySelectorAll(".lancer-damage-undo").forEach(el => el.remove());
			doc.querySelectorAll("span").forEach(el => el.classList.add("strikethrough"));
			newContent = doc.body.innerHTML;
		} catch { /* 回退到正则结果 */ }
	}
	await target.update(updateData);
	if (game.user?.isGM || chatMessage.isAuthor) {
		await chatMessage.update({ content: newContent });
	}
	return true;
}

function onCrossPermDamageClick(event) {
	// 1. 武器攻击卡有豁免成功减半、低等兵无用之人免伤或 CP 强化时，点击「掷伤害」带入下一次 DamageRollFlow
	const dmgFlowBtn = event.target?.closest?.(".lancer-damage-flow");
	if (dmgFlowBtn) {
		const msgId = dmgFlowBtn.closest?.(".chat-message")?.dataset?.messageId;
		const msg = msgId && game.messages?.get?.(msgId);
		const saveMap = msg?.getFlag?.(MODULE_ID, "saveResults");
		if (saveMap) {
			const zero = Object.values(saveMap).filter(r => r?.passed && r?.noDamageOnSuccess).map(r => r.uuid);
			const half = Object.values(saveMap).filter(r => r?.passed && r?.halfOnSuccess && !r?.noDamageOnSuccess).map(r => r.uuid);
			pendingZeroUuids = zero.length ? zero : null;
			pendingHalfUuids = half.length ? half : null;
			if (pendingZeroUuids) globalThis.setTimeout?.(() => { pendingZeroUuids = null; }, 5000);
			if (pendingHalfUuids) globalThis.setTimeout?.(() => { pendingHalfUuids = null; }, 5000);
		}
		const dmgMod = msg?.getFlag?.(MODULE_ID, "cpDamageMod");
		if (dmgMod && typeof dmgMod === "object") {
			pendingDamageMod = { ...dmgMod };
			globalThis.setTimeout?.(() => { pendingDamageMod = null; }, 5000);
		}
		return;
	}

	// 2. 伤害卡「应用伤害」：自己的角色始终缓存伤害上下文后交给系统原生处理；非拥有者角色（启用跨权限结算时）通过 GM socket 结算护甲与抗性
	const applyBtn = event.target?.closest?.(".lancer-damage-apply");
	if (applyBtn) {
		const group = applyBtn.closest?.(".lancer-damage-button-group");
		const targetUuid = group?.dataset?.target;
		const actor = resolveActor(targetUuid);
		const msgId = applyBtn.closest?.(".chat-message")?.dataset?.messageId;
		const message = msgId && game.messages?.get?.(msgId);
		const dmgCtx = message?.getFlag?.(MODULE_ID, "damageCtx") ?? message?.flags?.[MODULE_ID]?.damageCtx ?? null;
		if (!actor || actor.isOwner) {
			if (actor?.isOwner && dmgCtx) {
				const actorKey = actor.uuid || actor.id || "";
				if (actorKey) pendingApplyDamageCtxMap.set(actorKey, dmgCtx);
				if (actor.id) pendingApplyDamageCtxMap.set(actor.id, dmgCtx);
				pendingApplyDamageCtx = dmgCtx;
				globalThis.setTimeout?.(() => {
					if (actorKey && pendingApplyDamageCtxMap.get(actorKey) === dmgCtx) pendingApplyDamageCtxMap.delete(actorKey);
					if (actor.id && pendingApplyDamageCtxMap.get(actor.id) === dmgCtx) pendingApplyDamageCtxMap.delete(actor.id);
					if (pendingApplyDamageCtx === dmgCtx) pendingApplyDamageCtx = null;
				}, 2500);
			}
			return;
		}
		if (!getSetting("crossPermDamage", true)) return;
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation?.();
		if (!game.users?.activeGM) {
			ui?.notifications?.warn?.("没有在线的 GM，无法对非自己拥有的目标结算伤害。");
			return;
		}
		const damageData = message?.getFlag?.("lancer", "damageData") ?? message?.flags?.lancer?.damageData;
		const tdr = damageData?.targetDamageResults?.find(t => t.target === targetUuid);
		if (!tdr) return;
		const sel = group.querySelector?.("select");
		const rawMult = sel ? parseFloat(sel.value) : 1;
		const multiple = Number.isNaN(rawMult) ? 1 : rawMult;
		const addBurn = group.dataset?.addBurn !== "false";
		game.socket.emit(`module.${MODULE_ID}`, {
			action: "applyDamage",
			targetUuid,
			applied: sumAppliedDamage(tdr.damage),
			multiple,
			addBurn,
			ap: Boolean(tdr.ap ?? damageData.ap),
			paracausal: Boolean(tdr.paracausal ?? damageData.paracausal),
			dmgCtx,
		});
		ui?.notifications?.info?.(`已请求 GM 对「${actor.token?.name ?? actor.name}」结算伤害。`);
		return;
	}

	// 3. 伤害结果卡「撤销伤害」：已清除燃烧/热度导致差值下溢时钳制为 0 防 DataModel 校验报错；非拥有者目标通过 GM socket 撤销
	const undoBtn = event.target?.closest?.(".lancer-damage-undo");
	if (undoBtn) {
		const actorUuid = undoBtn.dataset?.uuid;
		const actor = resolveActor(actorUuid);
		if (!actor) return;
		const msgId = undoBtn.closest?.(".chat-message")?.dataset?.messageId;
		const chatMsg = msgId ? game.messages?.get?.(msgId) : null;
		const payload = {
			action: "undoDamage",
			messageId: msgId,
			actorUuid,
			overshieldDelta: parseInt(undoBtn.dataset?.overshieldDelta, 10) || 0,
			hpDelta: parseInt(undoBtn.dataset?.hpDelta, 10) || 0,
			burnDelta: parseInt(undoBtn.dataset?.burnDelta, 10) || 0,
			heatDelta: parseInt(undoBtn.dataset?.heatDelta, 10) || 0,
			addBurn: undoBtn.dataset?.addBurn === "true",
		};
		if (actor.isOwner) {
			const wouldUnderflowBurn = payload.addBurn && payload.burnDelta > (Number(actor.system?.burn) || 0);
			const wouldUnderflowHeat = payload.heatDelta > (Number(actor.system?.heat?.value) || 0);
			const cannotEditChat = Boolean(chatMsg && !game.user?.isGM && !chatMsg.isAuthor);
			if (!wouldUnderflowBurn && !wouldUnderflowHeat && !cannotEditChat) return;
			if (!msgId) return;
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation?.();
			if (cannotEditChat && getSetting("crossPermDamage", true) && game.users?.activeGM) {
				game.socket.emit(`module.${MODULE_ID}`, payload);
			} else {
				gmUndoDamageByPayload(payload).catch(err => reportError("撤销伤害", err));
			}
			return;
		}
		if (!getSetting("crossPermDamage", true)) return;
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation?.();
		if (!game.users?.activeGM) {
			ui?.notifications?.warn?.("没有在线的 GM，无法撤销非自己拥有目标的伤害。");
			return;
		}
		if (!msgId) return;
		game.socket.emit(`module.${MODULE_ID}`, payload);
	}
}

// ---------------------------------------------------------------------------
// 数值变化驱动自动状态（超温危域、无结构单位失能、蝎狮充能）+ 回合开始/结束 CP 钩子与状态清除提醒 + 系统 Flow 补完
async function onUpdateActorStatus(actor, changes, _options, userId) {
	if (userId !== game.user?.id) return;
	const sysChg = changes?.system;
	if (!sysChg) return;

	// 0. 蝎狮「拉之仇敌圣殿的破灭」：承受或增加热度时破灭充能骰 +1（上限 6）
	if (sysChg.heat !== undefined && isCoreActiveOn(actor, "mf_manticore") && actor.isOwner) {
		const curHeat = Number(actor.system?.heat?.value) || 0;
		const cs = getCoreState(actor);
		const lastHeat = Number.isFinite(Number(cs.lastHeat)) ? Number(cs.lastHeat) : 0;
		const patch = { lastHeat: curHeat };
		if (curHeat > lastHeat) {
			patch.counterValue = Math.min(6, (Number(cs.counterValue) || 1) + 1);
		}
		await setCoreState(actor, patch);
	}

	if (!actor?.toggleStatusEffect || !getSetting("autoDangerZone", true)) return;

	// 1. 超温危域：热度 >= ceil(上限 / 2) 自动挂上，低于一半自动移除；格兰特同步切换循环停滞/正午时分状态
	if (sysChg.heat !== undefined && (actor.type === "mech" || actor.type === "npc" || actor.type === "deployable")) {
		const maxHeat = Number(actor.system?.heat?.max) || 0;
		if (maxHeat > 0) {
			const curHeat = Number(actor.system?.heat?.value) || 0;
			const inDz = curHeat >= Math.ceil(maxHeat / 2);
			if (Boolean(actor.statuses?.has?.("dangerzone")) !== inDz) {
				await actor.toggleStatusEffect("dangerzone", { active: inDz });
			}
			if (mechFrameLid(actor) === "mf_ext_grant" && getSetting("autoApplyStatus", true)) {
				if (Boolean(actor.statuses?.has?.("slow")) !== !inDz) await actor.toggleStatusEffect("slow", { active: !inDz });
				if (Boolean(actor.statuses?.has?.("cover_soft")) !== inDz) await actor.toggleStatusEffect("cover_soft", { active: inDz });
			}
		}
	}

	// 1b. 为朝「等离子光轮」：受到燃烧时自动获得软性掩护，燃烧归零时自动解除
	if (sysChg.burn !== undefined && mechFrameLid(actor) === "mf_ext_tametomo" && getSetting("autoApplyStatus", true)) {
		const hasBurn = (Number(actor.system?.burn) || 0) > 0;
		const wantCover = hasBurn || talentRank(actor, "t_skirmisher") >= 1;
		if (Boolean(actor.statuses?.has?.("cover_soft")) !== wantCover) {
			await actor.toggleStatusEffect("cover_soft", { active: wantCover });
		}
	}

	// 2. 无结构单位（驾驶员 / 可部署物 / 杂兵等 structure.max <= 0 或 structure.value <= 0）HP <= 0 时自动挂「昏迷」；回复至 > 0 HP（且未处于 0 结构毁灭态）时自动解除
	if (sysChg.hp !== undefined || sysChg.structure !== undefined) {
		const hpVal = Number(actor.system?.hp?.value) ?? 1;
		const maxStruct = Number(actor.system?.structure?.max) || 0;
		const structVal = Number(actor.system?.structure?.value) || 0;
		const isZeroStructUnit = actor.type === "pilot" || actor.type === "deployable"
			|| ((actor.type === "npc" || actor.type === "mech") && (maxStruct <= 0 || structVal <= 0));
		const canReviveFromHp = actor.type === "pilot" || actor.type === "deployable"
			|| ((actor.type === "npc" || actor.type === "mech") && (maxStruct <= 0 || structVal > 0));
		if (isZeroStructUnit && hpVal <= 0 && !actor.statuses?.has?.("downandout")) {
			await actor.toggleStatusEffect("downandout", { active: true });
		} else if (canReviveFromHp && hpVal > 0 && actor.statuses?.has?.("downandout")) {
			await actor.toggleStatusEffect("downandout", { active: false });
		}
	}
}

async function rollMimicGunValues(actor) {
	const mech = combatMechOf(actor) ?? actor;
	if (!mech?.isOwner) return null;
	const r1 = await new Roll("1d20").evaluate();
	const r2 = await new Roll("1d20").evaluate();
	const r3 = await new Roll("1d20").evaluate();
	const vals = [Number(r1.total) || 10, Number(r2.total) || 10, Number(r3.total) || 10];
	const curRound = Number(globalThis.game?.combat?.round) || 1;
	await setCombatState(mech, { mimicValues: vals, mimicRolledRound: curRound });
	const baseDmg = 1 + Math.ceil(vals[0] / 2);
	await postCpEffectCard(
		mech,
		"拟态枪 · 3d20 形态校准",
		`<p><b>${escHtml(mech.name)}</b> 掷出拟态枪序列：<b>X = ${vals[0]}</b>，<b>Y = ${vals[1]}</b>，<b>Z = ${vals[2]}</b>。<br>当前基础射程 <b>${vals[0]}</b>，基础动能伤害 <b>${baseDmg}</b>。</p>`,
	);
	return vals;
}

function hasWeaponLidOnMech(actor, lid) {
	const mech = combatMechOf(actor);
	return [...(mech?.items ?? [])].some(i => i && !i.system?.destroyed && weaponLidOf(i) === lid);
}

async function onUpdateCombatTurnEnd(combat, changed, options) {
	if (!game.users?.activeGM?.isSelf) return;
	if (!changed || (!("turn" in changed) && !("round" in changed))) return;
	if ((options?.direction ?? 1) < 0) return;
	recentOverwatchPrompts.clear();
	const prevId = combat?.previous?.combatantId;
	const curId = combat?.current?.combatantId;
	const { roundKey, turnKey } = currentCombatStamp();

	// 每次回合或轮次推进时：重置全员「每回合反应计数」与单回合脱离/创造进口标记，并恢复原生反应徽章
	for (const c of combat?.combatants ?? []) {
		const m = c?.actor;
		if (!m?.isOwner) continue;
		const perTurnReset = { roundKey, turnKey, reactionsUsedTurn: 0, disengagedThisTurn: false, prospectorNoReactionTurn: false };
		await setCombatState(m, perTurnReset);
		if (m.system?.action_tracker && m.system.action_tracker.reaction === false) {
			await syncActorReactionTracker(m, true);
		}
	}

	// 0. 新一轮开始：飞马「解封巫沙布提」重置本轮 3 次万物枪充能 + 帝王蝶首轮风暴盾 + 晶眼蝶「超感知」+ 重置全员每轮 1 次状态
	if ("round" in changed) {
		for (const c of combat?.combatants ?? []) {
			const m = c?.actor;
			if (!m?.isOwner) continue;
			if (isCoreActiveOn(m, "mf_pegasus")) {
				await setCoreState(m, { counterValue: 3 });
			}
			if (Number(combat.round) === 1 && mechFrameLid(m) === "mf_emperor") {
				const grit = Math.max(0, Number(m.system?.grit ?? mechPilot(m)?.system?.grit) || 0);
				const shield = 6 + grit;
				if ((Number(m.system?.overshield?.value) || 0) < shield) {
					await m.update?.({ "system.overshield.value": shield });
				}
			}
			const prevRoundSt = getCombatState(m);
			const dynRoundClears = {};
			for (const k of Object.keys(prevRoundSt)) {
				if (k.startsWith("usedActRound_")) dynRoundClears[k] = false;
			}
			if (m.type === "mech" || m.is_mech?.()) {
				await setCombatState(m, {
					...dynRoundClears,
					usedOverpowerCaliber: false,
					usedStormbringerR1: false,
					usedStormbringerR2: false,
					usedCentimaneSave: false,
					usedOpenDoorSave: false,
					usedDuelistDieRound: false,
					usedTacticianSolar: false,
					usedTacticianFlank: false,
					usedCrackShotZeroIn: false,
					usedApothecaryRound: false,
					usedHunterLunge: false,
					usedHunterDisdainful: false,
					usedMourningCloakHunter: false,
					usedAtlasFinishingBlow: false,
					usedGajeshuraCapacitor: false,
					usedPesilatMuscle: false,
					usedEnhancedSysInvade: false,
					usedSwallowtailProphetic: false,
					usedBlackWitchParry: false,
					usedOverwatchRound: false,
					usedBraceRound: false,
					amberPrecog: mechFrameLid(m) === "mf_amber_phantom",
				});
			} else if (m.type === "npc" || m.is_npc?.()) {
				await setCombatState(m, {
					...dynRoundClears,
					usedVeteranLightningReflex: false,
					usedOverwatchRound: false,
					usedBraceRound: false,
				});
			}
		}
	}

	// 1. 角色新回合开始：受身提醒卡 + 核心协议回合初钩子 + 机甲被动与隐形姿态 + NPC 充能检定 / 超体「主宰」
	if (curId && curId !== prevId) {
		const curComb = combat.combatants?.get?.(curId) ?? combat.combatants?.find?.(c => c.id === curId);
		const curActor = curComb?.actor;
		if (curActor?.getFlag?.(MODULE_ID, "braced")) {
			await curActor.unsetFlag?.(MODULE_ID, "braced");
			const curName = curComb.name ?? curActor.token?.name ?? curActor.name ?? "角色";
			const drakeBastion = isCoreActiveOn(curActor, "mf_drake");
			const braceReminder = drakeBastion
				? `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 受身生效 · 堡垒协议强化 //</div><div class="effect-text"><p><b>${escHtml(curName)}</b> 上一轮使用了<b>受身</b>（<b>堡垒协议</b>生效中）：本回合<b>可执行 1 个完整动作或 2 个常规快速动作中的受限行动（按核心规则：受身本回合变为可执行 1 个完整动作）</b>；回合结束时记得关闭受身临时抗性。</p></div></div>`
				: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 受身生效 · 本回合行动限制 //</div><div class="effect-text"><p><b>${escHtml(curName)}</b> 上一轮使用了<b>受身</b>：本回合<b>只能执行 1 个快速动作</b>（不能常规移动、完整动作、自由动作或超频，但仍可执行反应）；回合结束时记得关闭受身临时抗性。</p></div></div>`;
			await ChatMessage.create({
				speaker: ChatMessage.getSpeaker?.({ actor: curActor }) ?? {},
				content: braceReminder,
				flags: { [MODULE_ID]: { skipAutoScan: true } },
			});
		}
		if (curActor && isCoreActiveOn(curActor, "mf_lancaster")) {
			const cs = getCoreState(curActor);
			if (cs.latchTargetUuid && curActor.isOwner) {
				const nextHeat = (Number(curActor.system?.heat?.value) || 0) + 1;
				await curActor.update?.({ "system.heat.value": nextHeat });
				await postCpEffectCard(curActor, "增压器 · 回合开始供能", `<p><b>${escHtml(curActor.name)}</b> 维持增压器连接（目标：<b>${escHtml(cs.latchTargetName ?? "盟友")}</b>），自身承受 <b>1 点热度</b>（当前热度：${nextHeat}）。</p>`);
			}
		}
		if (curActor && isCoreActiveOn(curActor, "mf_raleigh") && curActor.isOwner) {
			await setCoreState(curActor, { raleighFiredThisTurn: false });
		}
		if (curActor && isCoreActiveOn(curActor, "mf_barbarossa")) {
			const cs = getCoreState(curActor);
			const nextDie = Math.max(1, (Number(cs.counterValue) || 4) - 1);
			if (nextDie !== cs.counterValue) {
				await syncBarbarossaRail(curActor, nextDie);
				await postCpEffectCard(curActor, "末日导轨 · 末日充能推进", `<p><b>${escHtml(curActor.name)}</b> 的末日骰降至 <b>${nextDie}</b>（已自动同步末日导轨档位）。</p>`);
			}
		}
		if (curActor && isCoreActiveOn(curActor, "mf_piof_lemongrass")) {
			const cs = getCoreState(curActor);
			const nextIon = Math.min(12, (Number(cs.counterValue) || 0) + 2);
			await setCoreState(curActor, { counterValue: nextIon });
		}
		if (curActor?.isOwner && (curActor.type === "mech" || curActor.is_mech?.())) {
			const curUuid = curComb.token?.uuid ?? preferredTargetUuid(curActor) ?? curActor.uuid;
			const curCs = getCombatState(curActor);
			if (curCs.steadyAim && curActor.statuses?.has?.("immobilized") && !isGrappleImmobilized(curUuid) && !isCoreSustainedImmobilized(curActor)) {
				await setActorStatus(curUuid, "immobilized", false);
			}
			if ((curCs.armoryOverchargeSoftCover || curCs.shermanVentSoftCover) && talentRank(curActor, "t_skirmisher") < 1 && curActor.statuses?.has?.("cover_soft")) {
				const keepTametomo = mechFrameLid(curActor) === "mf_ext_tametomo" && (Number(curActor.system?.burn) || 0) > 0;
				if (!keepTametomo) await setActorStatus(curUuid, "cover_soft", false);
			}
			const startPatch = {
				startedTurnHidden: Boolean(curActor.statuses?.has?.("hidden")),
				usedInfiltratorAmbush: false,
				attackedOrForcedSaveThisTurn: false,
				usedFirstMainMelee: false,
				usedFirstAuxRanged: false,
				usedNuCavBonus: false,
				usedFragRounds: false,
				usedWalkingArmoryTurn: false,
				steadyAim: false,
				armoryOverchargeSoftCover: false,
				shermanVentSoftCover: false,
				amberPrecog: false,
				bracedActive: false,
				preparedAction: null,
				stortebekerUsedWeaponIds: [],
			};
			const curFLid = mechFrameLid(curActor);
			if (getSetting("autoApplyStatus", true)) {
				if (talentRank(curActor, "t_skirmisher") >= 1) {
					await setActorStatus(curUuid, "cover_soft", true);
					startPatch.skirmisherSoftCover = true;
				}
				if (curFLid === "mf_dusk_wing") {
					await setActorStatus(curUuid, "invisible", true);
					startPatch.duskWingCloak = true;
				}
				if (hasCoreBonus(curActor, "cb_ghostweave")) {
					await setActorStatus(curUuid, "invisible", true);
					startPatch.ghostweaveCloak = true;
				}
				if (curFLid === "mf_ext_grant") {
					const inDz = Boolean(curActor.statuses?.has?.("dangerzone"));
					await setActorStatus(curUuid, "slow", !inDz);
					await setActorStatus(curUuid, "cover_soft", inDz || talentRank(curActor, "t_skirmisher") >= 1);
				}
			}
			if (hasWeaponLidOnMech(curActor, "mw_mimic_gun")) {
				const mv = curCs.mimicValues;
				if (Array.isArray(mv) && mv.length === 3) {
					if ((Number(combat.round) || 1) > (Number(curCs.mimicRolledRound) || 1)) {
						startPatch.mimicValues = [mv[1], mv[2], mv[0]];
					}
				} else {
					await setCombatState(curActor, startPatch);
					await rollMimicGunValues(curActor);
					startPatch.mimicValues = getCombatState(curActor).mimicValues;
					startPatch.mimicRolledRound = getCombatState(curActor).mimicRolledRound;
				}
			}
			await setCombatState(curActor, startPatch);
		} else if (curActor?.isOwner && (curActor.type === "npc" || curActor.is_npc?.())) {
			const curUuid = curComb.token?.uuid ?? preferredTargetUuid(curActor) ?? curActor.uuid;
			const curName = curComb.name ?? curActor.token?.name ?? curActor.name ?? "NPC";
			await setCombatState(curActor, { tookEnergyThisTurn: false, usedUltraExtraDeadly: false, preparedAction: null });

			// NPC 充能（Recharge X+）回合初检测提醒卡
			const uncharged = [...(curActor.items ?? [])].filter(i => {
				if (!i || (i.type && i.type !== "npc_feature") || i.system?.destroyed) return false;
				if (i.system?.charged !== false) return false;
				const tags = (() => { try { return i.getTags?.() ?? i.system?.tags ?? []; } catch { return i.system?.tags ?? []; } })();
				return Boolean(i.isRecharge?.() || tags.some(t => t?.is_recharge || t?.lid === "tg_recharge"));
			});
			if (uncharged.length) {
				const tier = Math.min(3, Math.max(1, Number(curActor.system?.tier) || 1));
				const itemsMeta = uncharged.map(i => {
					const tags = (() => { try { return i.getTags?.() ?? i.system?.tags ?? []; } catch { return i.system?.tags ?? []; } })();
					const rTag = tags.find(t => t?.is_recharge || t?.lid === "tg_recharge");
					const effTier = Math.min(3, Math.max(1, Number(i.system?.tier_override) || tier));
					const target = npcRechargeTargetVal(rTag, effTier);
					return { id: i.id, name: i.name, target };
				});
				const listDesc = itemsMeta.map(x => `<b>${escHtml(x.name)}</b>（${x.target}+）`).join("、");
				await ChatMessage.create({
					speaker: ChatMessage.getSpeaker?.({ actor: curActor }) ?? {},
					content: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 回合开始 · NPC 充能检定 //</div><div class="effect-text"><p><b>${escHtml(curName)}</b> 有未充能的充能特性：${listDesc}。请点击下方按钮进行 1d6 充能检定：</p></div></div>`,
					flags: { [MODULE_ID]: { skipAutoScan: true, npcRechargePrompt: { uuid: curUuid, name: curName, items: itemsMeta, rolled: false } } },
				});
			}

			// 超体模板「主宰」（npcf_cn_ultra_4）：回合开始时结束影响自身的任一状况或状态
			if (hasNpcFeature(curActor, ["npcf_cn_ultra_4", "npcf_juggernaut_ultra"], ["主宰"])) {
				const negStatuses = [...CONDITION_IDS, "exposed", "prone"].filter(id =>
					curActor.statuses?.has?.(id) && !(id === "immobilized" && isGrappleImmobilized(curUuid)),
				);
				if (negStatuses.length === 1) {
					await setActorStatus(curUuid, negStatuses[0], false);
					await postCpEffectCard(curActor, "超体 · 主宰自动清除状态", `<p><b>${escHtml(curName)}</b> 回合开始触发<b>主宰</b>：已自动解除 <b>${escHtml(ALL_STATUS_LABELS[negStatuses[0]] ?? negStatuses[0])}</b>！</p>`);
				} else if (negStatuses.length > 1) {
					const opts = negStatuses.map(id => ({ key: id, id, label: ALL_STATUS_LABELS[id] ?? id }));
					await ChatMessage.create({
						speaker: ChatMessage.getSpeaker?.({ actor: curActor }) ?? {},
						content: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 超体 · 主宰（回合开始清除状态） //</div><div class="effect-text"><p><b>${escHtml(curName)}</b> 触发<b>主宰</b>，请点击选择要立即解除的一项状态或状况：</p></div></div>`,
						flags: { [MODULE_ID]: { skipAutoScan: true, ultraJuggernautPrompt: { uuid: curUuid, name: curName, mode: "clearStatus", options: opts, resolved: false } } },
					});
				}
			}
		} else if (curActor?.isOwner && curActor.type === "pilot" && getCombatState(curActor).preparedAction) {
			await setCombatState(curActor, { preparedAction: null });
		}
	}

	// 2. 上一名角色回合结束：处理雷利未开火装填、炎魔/异种再生、超体主宰修复、鬼影织物/暮翼隐形、状态与燃烧结算提醒
	if (!prevId || prevId === curId) return;
	const comb = combat.combatants?.get?.(prevId) ?? combat.combatants?.find?.(c => c.id === prevId);
	const actor = comb?.actor;
	let keepGhostweaveInvisible = false;
	if (actor && isCoreActiveOn(actor, "mf_raleigh") && actor.isOwner) {
		const cs = getCoreState(actor);
		if (!cs.raleighFiredThisTurn) {
			const nextChambers = Math.min(6, (Number(cs.counterValue) || 0) + 2);
			await setCoreState(actor, { counterValue: nextChambers });
		}
	}
	if (actor && isCoreActiveOn(actor, "mf_ext_oleander")) {
		await deactivateCoreEffect(actor, "当前回合结束");
		await postCpEffectCard(actor, "夹竹桃蛾 · 全系统已上线结束", `<p><b>${escHtml(actor.name)}</b> 的「全系统已上线」随本回合结束解除（高效标签保留至场景结束自动返还 1 CP）。</p>`);
	}
	if (actor && isCoreActiveOn(actor, "mf_sagarmatha")) {
		const cs = getCoreState(actor);
		const turns = (Number(cs.sagarmathaTurnsEnded) || 0) + 1;
		if (turns >= 2) {
			await deactivateCoreEffect(actor, "下一回合结束");
			await postCpEffectCard(actor, "萨加玛塔 · 扬起旗帜结束", `<p><b>${escHtml(actor.name)}</b> 的战旗持续时间到期，已移除受旗盟友的战旗抗性。</p>`);
		} else {
			await setCoreState(actor, { sagarmathaTurnsEnded: turns });
		}
	}
	if (actor?.isOwner && (actor.type === "mech" || actor.is_mech?.())) {
		const prevUuid = comb.token?.uuid ?? preferredTargetUuid(actor) ?? actor.uuid;
		const prevCs = getCombatState(actor);
		const fLid = mechFrameLid(actor);
		if (!prevCs.attackedOrForcedSaveThisTurn) {
			if (talentRank(actor, "mf_orator") >= 2) {
				await setTalentDie(actor, "orator", Math.min(3, (getTalentDie(actor, "orator") ?? 1) + 1));
			}
			if (talentRank(actor, "t_field_analyst") >= 2) {
				await setTalentDie(actor, "analyst", Math.min(6, (getTalentDie(actor, "analyst") ?? 1) + 2));
			}
		}
		const endPatch = {};
		if (prevCs.transcendActive) {
			const left = Number(prevCs.transcendTurnsLeft) || 0;
			if (left > 0) endPatch.transcendTurnsLeft = left - 1;
			else endPatch.transcendActive = false;
		}
		if (prevCs.sysopFirewall) endPatch.sysopFirewall = false;
		if (prevCs.bracedUntilTurnEnd) endPatch.bracedUntilTurnEnd = false;
		if (prevCs.kutuzovBraceProtected) endPatch.kutuzovBraceProtected = false;
		if (prevCs.bracedActive) endPatch.bracedActive = false;
		if (prevCs.noReactionsUntilTurnEnd) endPatch.noReactionsUntilTurnEnd = false;

		// 核心奖励「鬼影织物」（cb_ghostweave）与暮翼「花衣精灵斗篷」（mf_dusk_wing）回合末隐形维持/解除
		if (hasCoreBonus(actor, "cb_ghostweave")) {
			if (prevCs.attackedOrForcedSaveThisTurn) {
				if ((prevCs.ghostweaveCloak || prevCs.duskWingCloak) && actor.statuses?.has?.("invisible")) {
					await setActorStatus(prevUuid, "invisible", false);
				}
				endPatch.ghostweaveCloak = false;
				endPatch.duskWingCloak = false;
			} else if (actor.statuses?.has?.("invisible")) {
				keepGhostweaveInvisible = true;
			}
		} else if (fLid === "mf_dusk_wing" && prevCs.duskWingCloak) {
			if (actor.statuses?.has?.("invisible")) await setActorStatus(prevUuid, "invisible", false);
			endPatch.duskWingCloak = false;
		}

		// 雷利「全金属外壳」：本回合未攻击也未迫使豁免时，自由动作自动装填全部装填武器
		if (fLid === "mf_raleigh" && !prevCs.attackedOrForcedSaveThisTurn) {
			const unloaded = [...(actor.items ?? [])].filter(i => {
				if (!i || (i.type !== "mech_weapon" && !i.is_mech_weapon?.()) || i.system?.destroyed) return false;
				if (i.system?.loaded !== false) return false;
				const tags = [...(weaponProfileOf(i)?.tags ?? []), ...((() => { try { return i.getTags?.() ?? []; } catch { return []; } })()), ...(i.system?.tags ?? [])];
				return tags.some(t => t?.is_loading || t?.lid === "tg_loading");
			});
			if (unloaded.length) {
				if (actor.updateEmbeddedDocuments && unloaded.every(w => w.id)) {
					await actor.updateEmbeddedDocuments("Item", unloaded.map(w => ({ _id: w.id, "system.loaded": true })));
				} else {
					for (const w of unloaded) await w.update?.({ "system.loaded": true });
				}
				await postCpEffectCard(
					actor,
					"雷利 · 全金属外壳自动装填",
					`<p><b>${escHtml(actor.name)}</b> 本回合未进行攻击或迫使豁免，触发<b>全金属外壳</b>自动装填：<b>${unloaded.map(w => escHtml(w.name)).join("、")}</b>！</p>`,
				);
			}
		}

		// 炎魔「再生」：回合结束回复 1/4（蜂巢核心激活时为 1/2）最大 HP；本回合受过结构或压力伤害时暂停一次
		if (fLid === "mf_balor") {
			if (prevCs.balorRegenPaused) {
				endPatch.balorRegenPaused = false;
			} else if (!actor.statuses?.has?.("downandout") && (Number(actor.system?.structure?.value) ?? 1) > 0) {
				const curHp = Number(actor.system?.hp?.value) || 0;
				const maxHp = Number(actor.system?.hp?.max) || 0;
				if (maxHp > 0 && curHp < maxHp) {
					const div = isCoreActiveOn(actor, "mf_balor") ? 2 : 4;
					const nextHp = Math.min(maxHp, curHp + Math.ceil(maxHp / div));
					await actor.update?.({ "system.hp.value": nextHp });
					await postCpEffectCard(
						actor,
						"炎魔 · 再生",
						`<p><b>${escHtml(actor.name)}</b> 回合结束触发<b>再生</b>：回复 <b>${nextHp - curHp} HP</b>（当前 HP：<b>${nextHp} / ${maxHp}</b>）。</p>`,
					);
				}
			}
		}

		if (Object.keys(endPatch).length) await setCombatState(actor, endPatch);

		// 猎人 II「匕首戏法」：在你的回合结束时，投出的所有武器自动回到你身上
		const thrownList = getThrownWeapons(actor);
		if (thrownList.length && talentRank(actor, "t_hunter") >= 2) {
			const names = thrownList.map(w => w.weaponName).join("、");
			await retrieveThrownWeapon(actor, "all", {
				notify: false,
				postCard: true,
				cardTitle: "匕首戏法 · 投掷武器自动收回",
				cardBody: `<p><b>${escHtml(actor.name)}</b> 回合结束触发<b>猎人 II「匕首戏法」</b>：投出的武器（<b>${escHtml(names)}</b>）已自动回到身上！</p>`,
			});
		}
	} else if (actor?.isOwner && (actor.type === "npc" || actor.is_npc?.())) {
		const prevUuid = comb.token?.uuid ?? preferredTargetUuid(actor) ?? actor.uuid;
		const prevName = comb.name ?? actor.token?.name ?? actor.name ?? "NPC";
		const prevCs = getCombatState(actor);
		if (prevCs.noReactionsUntilTurnEnd) {
			await setCombatState(actor, { noReactionsUntilTurnEnd: false });
		}

		// 异种模板「再生器」（npcf_cn_exotic_10）：本回合未受能量伤害时，回合结束回复 1/4 最大 HP
		if (hasNpcFeature(actor, ["npcf_cn_exotic_10", "npcf_regenerator_exotic"], ["再生器"]) && !prevCs.tookEnergyThisTurn && !actor.statuses?.has?.("downandout")) {
			const curHp = Number(actor.system?.hp?.value) || 0;
			const maxHp = Number(actor.system?.hp?.max) || 0;
			if (maxHp > 0 && curHp > 0 && curHp < maxHp) {
				const nextHp = Math.min(maxHp, curHp + Math.ceil(maxHp / 4));
				await actor.update?.({ "system.hp.value": nextHp });
				await postCpEffectCard(
					actor,
					"异种 · 再生器回复",
					`<p><b>${escHtml(prevName)}</b> 本回合未承受能量伤害，回合结束触发<b>再生器</b>：回复 <b>${nextHp - curHp} HP</b>（当前 HP：<b>${nextHp} / ${maxHp}</b>）。</p>`,
				);
			}
		}

		// 超体模板「主宰」（npcf_cn_ultra_4）：回合结束时修复任一被摧毁的武器或系统
		if (hasNpcFeature(actor, ["npcf_cn_ultra_4", "npcf_juggernaut_ultra"], ["主宰"])) {
			const destroyedItems = [...(actor.items ?? [])].filter(i => i && (!i.type || i.type === "npc_feature") && i.system?.destroyed === true);
			if (destroyedItems.length === 1) {
				const it = destroyedItems[0];
				if (it.update) await it.update({ "system.destroyed": false });
				else await actor.updateEmbeddedDocuments?.("Item", [{ _id: it.id, "system.destroyed": false }]);
				await postCpEffectCard(
					actor,
					"超体 · 主宰自动修复",
					`<p><b>${escHtml(prevName)}</b> 回合结束触发<b>主宰</b>：已自动修复被摧毁的 <b>${escHtml(it.name)}</b>！</p>`,
				);
			} else if (destroyedItems.length > 1) {
				const opts = destroyedItems.map(i => ({ key: i.id, id: i.id, label: i.name }));
				await ChatMessage.create({
					speaker: ChatMessage.getSpeaker?.({ actor }) ?? {},
					content: `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">// 超体 · 主宰（回合结束修复装备） //</div><div class="effect-text"><p><b>${escHtml(prevName)}</b> 触发<b>主宰</b>，请点击选择要立即修复的一项被摧毁系统/武器：</p></div></div>`,
					flags: { [MODULE_ID]: { skipAutoScan: true, ultraJuggernautPrompt: { uuid: prevUuid, name: prevName, mode: "repairItem", options: opts, resolved: false } } },
				});
			}
		}
	}

	// 核心奖励「自动灭火器」（cb_ch_extinguisher）：自动通过清除燃烧标记的所有检定
	let curBurn = Math.max(0, Number(actor?.system?.burn) || 0);
	if (curBurn > 0 && actor?.isOwner && hasCoreBonus(actor, "cb_ch_extinguisher")) {
		await actor.update?.({ "system.burn": 0 });
		await postCpEffectCard(
			actor,
			"自动灭火器 · 燃烧自动扑灭",
			`<p><b>${escHtml(actor.name)}</b> 触发核心奖励<b>自动灭火器</b>：自动通过回合末燃烧检定，已清除全部 <b>${curBurn}</b> 点燃烧！</p>`,
		);
		curBurn = 0;
	}

	if (!getSetting("turnEndPrompt", true)) return;
	if (!actor?.statuses && curBurn <= 0) return;
	const active = actor?.statuses ? EXPIRABLE_STATUS_IDS.filter(id => {
		if (!actor.statuses.has(id)) return false;
		if (id === "invisible" && keepGhostweaveInvisible) return false;
		if (id === "stunned" && (actor.statuses.has("shutdown") || actor.statuses.has("shut_down"))) return false;
		if (id === "shredded" && isUnremovableShredded(actor)) return false;
		if (id === "immobilized" && (isGrappleImmobilized(comb.token?.uuid ?? actor) || isCoreSustainedImmobilized(actor) || getCombatState(actor).steadyAim)) return false;
		return true;
	}) : [];
	if (!active.length && curBurn <= 0) return;
	const uuid = comb.token?.uuid ?? preferredTargetUuid(actor) ?? actor.uuid;
	const name = comb.name ?? actor.token?.name ?? actor.name ?? "角色";
	const headerTitle = curBurn > 0 ? "// 回合结束 · 状态与燃烧检查 //" : "// 回合结束 · 状态检查 //";
	const bodyHints = [];
	if (active.length) bodyHints.push("点击清除本回合到期的状态（误点可再次点击恢复）");
	if (curBurn > 0) bodyHints.push(`当前带有 <b>${curBurn} 点燃烧</b>，请进行回合末工程燃烧检定（DC 10）`);
	const content = `<div class="card clipped-bot" style="margin:0"><div class="lancer-header lancer-primary">${headerTitle}</div><div class="effect-text"><p><b>${escHtml(name)}</b> 回合结束，${bodyHints.join("；")}：</p></div></div>`;
	await ChatMessage.create({
		speaker: ChatMessage.getSpeaker?.({ actor }) ?? {},
		content,
		flags: { [MODULE_ID]: { skipAutoScan: true, turnEndClear: { uuid, name, statuses: active, cleared: [], burn: curBurn, burnResolved: false } } },
	});
}

function hasUnusedUltraExtraDeadly(actor) {
	if (!actor || (actor.type !== "npc" && !actor.is_npc?.())) return false;
	if (getCombatState(actor).usedUltraExtraDeadly) return false;
	return hasNpcFeature(actor, ["npcf_cn_ultra_21", "npcf_extra_deadly_ultra"], ["额外致命"]);
}

// 计算 NPC 拥有的「致命」（+1d6）与「额外致命」（1/回合：T2 +2d6 / T3 +3d6）会心额外骰数
function countNpcDeadlyDice(actor) {
	if (!actor || (actor.type !== "npc" && !actor.is_npc?.())) return 0;
	const tier = Math.min(3, Math.max(1, Number(actor.system?.tier) || 1));
	const usedExtra = Boolean(getCombatState(actor).usedUltraExtraDeadly);
	let dice = 0;
	for (const item of actor.items ?? []) {
		if (item.type && item.type !== "npc_feature") continue;
		if (item.system?.destroyed) continue;
		const lid = String(item.system?.lid ?? "");
		const name = String(item.name ?? "").trim();
		if (lid === "npcf_cn_ultra_21" || lid === "npcf_extra_deadly_ultra" || name === "额外致命" || /^extra deadly$/i.test(name)) {
			if (!usedExtra) {
				if (tier === 2) dice += 2;
				else if (tier >= 3) dice += 3;
			}
		} else if (["npcf_cn_pirate_1", "npcf_cn_ultra_3", "npcf_cn_veteran_5", "npcf_deadly_pirate", "npcf_deadly_ultra", "npcf_deadly_veteran"].includes(lid) || name === "致命" || /^deadly$/i.test(name)) {
			dice += 1;
		}
	}
	return dice;
}

function structureOutcomeStatuses(descKey, remStruct, title = "") {
	const k = String(descKey || "");
	const t = String(title || "");
	if (k.endsWith(".crushing") || k.endsWith(".fatal") || k.endsWith(".direct.1") || /(致命一击|致命打击|crushing|fatal)/i.test(t) || Number(remStruct) <= 0) return ["downandout"];
	if (k.endsWith(".direct.3plus")) return ["stunned"];
	if (k.endsWith(".glancing")) return ["impaired"];
	if (k.endsWith(".dismember")) return ["slow"];
	if (k.endsWith(".powerful")) return ["prone"];
	return [];
}

function overheatOutcomeStatuses(descKey) {
	const k = String(descKey || "");
	if (k.endsWith(".shunt")) return ["impaired"];
	if (k.endsWith(".destabilized") || k.endsWith(".meltdown.3plus")) return ["exposed"];
	return [];
}

async function promptConditionChoice(title, choices, promptText = "") {
	if (!choices.length) return null;
	if (choices.length === 1) return choices[0];
	const DialogV2 = foundry?.applications?.api?.DialogV2;
	if (!DialogV2?.wait) return choices[0];
	const bodyText = promptText || (String(title || "").includes("清除") ? "请选择要清除的一项状况：" : `请选择（${title}）：`);
	try {
		const picked = await DialogV2.wait({
			window: { title },
			content: `<p>${escHtml(bodyText)}</p>`,
			buttons: choices.map((c, idx) => ({
				action: String(idx),
				label: c.buttonLabel,
				default: idx === 0,
				callback: () => c,
			})),
			rejectClose: false,
		});
		return typeof picked === "object" && picked ? picked : (choices[Number(picked)] ?? null);
	} catch { return null; }
}

function applyDamageModToState(state) {
	if (!state?.data) return null;
	const actor = state.actor;
	const mech = combatMechOf(actor) ?? actor;
	const fLid = mechFrameLid(mech);
	const item = state.item;
	const wLid = weaponLidOf(item);
	const modLid = weaponModLidOf(item);
	const profIdx = Number(item?.system?.selected_profile_index) || 0;
	const intrinsic = {};
	if (modLid === "wm_paracausal_mod") intrinsic.paracausal = true;
	if (modLid === "wm_ch_adaptive_weight") {
		const awRel = adaptiveWeightMinReliable(item);
		if (awRel > 0) intrinsic.minReliable = awRel;
	}
	if (wLid === "mw_assault_cannon" && profIdx === 1) {
		intrinsic.minReliable = Math.max(intrinsic.minReliable || 0, 3);
	}
	// 切夜蛾「稳固平台」：非重火器步枪按武器大小获得可靠 1/2/3（已有可靠则 +1）
	if (fLid === "mf_ext_night_cutter" && item && weaponHasType(item, "Rifle")) {
		const tags = [...(weaponProfileOf(item)?.tags ?? []), ...(item?.system?.tags ?? [])];
		const hasOrd = tags.some(t => t?.lid === "tg_ordnance" || t?.is_ordnance);
		if (!hasOrd) {
			const baseRel = tags.reduce((mx, tg) => (tg?.lid === "tg_reliable" || tg?.is_reliable) ? Math.max(mx, parseInt(tg.val, 10) || 0) : mx, 0);
			const sz = item.system?.size;
			const ncRel = baseRel > 0 ? baseRel + 1 : (sz === "Auxiliary" ? 1 : (sz === "Heavy" || sz === "Superheavy") ? 3 : 2);
			intrinsic.minReliable = Math.max(intrinsic.minReliable || 0, ncRel);
		}
	}
	// 彗尾蛾「猎寻网络」：巢房武器按武器大小获得可靠 1/2/3
	if (fLid === "mf_ext_comet_moth" && item && weaponHasType(item, "Nexus")) {
		const sz = item.system?.size;
		const cmRel = sz === "Auxiliary" ? 1 : (sz === "Heavy" || sz === "Superheavy") ? 3 : 2;
		intrinsic.minReliable = Math.max(intrinsic.minReliable || 0, cmRel);
	}
	// 迷迭香「拆迁底漆」：对伏卧、固定、晕眩或关机目标造成的伤害无法以任何方式减免
	if (fLid === "mf_piof_rosemary") {
		const tActor = firstDamageTargetActor(state);
		if (tActor && (tActor.statuses?.has?.("prone") || tActor.statuses?.has?.("immobilized") || tActor.statuses?.has?.("stunned") || tActor.statuses?.has?.("shutdown") || tActor.statuses?.has?.("shut_down"))) {
			intrinsic.paracausal = true;
		}
	}
	// 万寿菊「枪决」：远程武器改为步枪并获得杀绝
	if (fLid === "mf_sherman_alt_tagetes" && item && isRangedWeaponItem(item) && getTalentConfig(mech).tagetesFusillade) {
		intrinsic.overkill = true;
	}
	// 异种模板「现世挤出物」（npcf_cn_exotic_6）：造成的所有伤害减半
	if ((actor?.type === "npc" || actor?.is_npc?.()) && hasNpcFeature(actor, ["npcf_cn_exotic_6", "npcf_extrusion_exotic"], ["现世挤出物"])) {
		intrinsic.halfAllTargets = true;
	}
	const baseMod = state.data.lancerCnDamageMod ?? pendingDamageMod;
	if (!baseMod && !Object.keys(intrinsic).length) return null;
	const mod = { ...intrinsic, ...(baseMod ?? {}) };
	if (intrinsic.minReliable && baseMod?.minReliable) {
		mod.minReliable = Math.max(Number(intrinsic.minReliable) || 0, Number(baseMod.minReliable) || 0);
	}
	state.data.lancerCnDamageMod = mod;
	if (mod.noBonusDamage) {
		state.data.bonus_damage = [];
		if (state.data.damage_hud_data?.base) state.data.damage_hud_data.base.bonusDamage = [];
		if (state.data.damage_hud_data?.weapon) state.data.damage_hud_data.weapon.bonusDamage = [];
		for (const ht of state.data.damage_hud_data?.targets ?? []) ht.bonusDamage = [];
	}
	if (mod.ap) {
		state.data.ap = true;
		if (state.data.damage_hud_data?.base) state.data.damage_hud_data.base.ap = true;
		for (const ht of state.data.damage_hud_data?.targets ?? []) ht.ap = true;
		for (const t of state.data.targets ?? []) t.ap = true;
		if (Array.isArray(state.data.tags) && !state.data.tags.some(tg => tg?.lid === "tg_ap" || tg?.is_ap)) {
			state.data.tags = [...state.data.tags, { lid: "tg_ap", is_ap: true }];
		}
	}
	if (mod.paracausal) {
		state.data.paracausal = true;
		if (state.data.damage_hud_data?.base) state.data.damage_hud_data.base.paracausal = true;
		for (const ht of state.data.damage_hud_data?.targets ?? []) ht.paracausal = true;
		for (const t of state.data.targets ?? []) t.paracausal = true;
	}
	if (mod.overkill) {
		state.data.overkill = true;
		if (state.data.damage_hud_data?.weapon) state.data.damage_hud_data.weapon.overkill = true;
		if (Array.isArray(state.data.tags) && !state.data.tags.some(tg => tg?.lid === "tg_overkill" || tg?.is_overkill)) {
			state.data.tags = [...state.data.tags, { lid: "tg_overkill", is_overkill: true }];
		}
	}
	if (mod.halfAllTargets) {
		state.data.half_damage = true;
		if (state.data.damage_hud_data?.base) state.data.damage_hud_data.base.halfDamage = true;
		for (const ht of state.data.damage_hud_data?.targets ?? []) ht.halfDamage = true;
	}
	if (Number(mod.minReliable) > 0) {
		const reqRel = Number(mod.minReliable);
		const nextRel = Math.max(parseInt(state.data.reliable_val, 10) || 0, reqRel);
		state.data.reliable = true;
		state.data.reliable_val = nextRel;
		if (state.data.damage_hud_data?.weapon) {
			state.data.damage_hud_data.weapon.reliable = true;
			state.data.damage_hud_data.weapon.reliableValue = Math.max(Number(state.data.damage_hud_data.weapon.reliableValue) || 0, nextRel);
		}
		if (Array.isArray(state.data.tags)) {
			const relTag = { lid: "tg_reliable", val: String(nextRel), num_val: nextRel, is_reliable: true, tierVal: () => String(nextRel) };
			const idx = state.data.tags.findIndex(tg => tg?.lid === "tg_reliable" || tg?.is_reliable);
			if (idx >= 0) {
				const curTagVal = parseInt(state.data.tags[idx]?.val, 10) || 0;
				if (curTagVal < nextRel) state.data.tags = state.data.tags.map((tg, i) => (i === idx ? relTag : tg));
			} else {
				state.data.tags = [...state.data.tags, relTag];
			}
		}
	}
	return mod;
}

function firstDamageTargetActor(state) {
	const hr0 = state?.data?.hit_results?.[0];
	if (hr0?.target?.actor) return hr0.target.actor;
	if (hr0?.target) {
		const a = resolveActor(hr0.target.document?.uuid ?? hr0.target.uuid ?? hr0.target);
		if (a) return a;
	}
	const ht0 = state?.data?.damage_hud_data?.targets?.[0];
	if (ht0?.targetUuid) return resolveActor(ht0.targetUuid);
	const ut0 = Array.from(globalThis.game?.user?.targets ?? [])[0];
	return ut0?.actor ?? null;
}

function hasBiologicalTag(actor) {
	if (!actor) return false;
	for (const item of actor.items ?? []) {
		let tags = [];
		try { tags = item.getTags?.() ?? item.system?.tags ?? []; } catch { tags = item.system?.tags ?? []; }
		if (tags.some(t => t?.lid === "tg_biological" || /biological|生物/i.test(String(t?.name ?? "")))) return true;
	}
	return Boolean(actor.system?.tags?.some?.(t => t?.lid === "tg_biological"));
}

function transformWeaponBaseDamage(rawList, state) {
	if (!Array.isArray(rawList)) return [];
	const mech = combatMechOf(state?.actor) ?? state?.actor;
	const wLid = weaponLidOf(state?.item);
	const mod = state?.data?.lancerCnDamageMod ?? pendingDamageMod ?? {};
	const ammo = mod.walkingArmoryAmmo || "";
	const nuCavEnergy = Boolean(state?.data?._lancerCnNuCavEnergy);
	const tokugawaExposed = mechFrameLid(mech) === "mf_tokugawa" && Boolean(mech?.statuses?.has?.("exposed"));
	const tActor = firstDamageTargetActor(state);
	return rawList.map(d => {
		let type = d?.type || "Kinetic";
		let val = d?.val !== undefined ? String(d.val) : "0";
		if (wLid === "mw_mimic_gun") {
			const rVal = maxWeaponRangeVal(state.item, state.actor) || 10;
			type = "Kinetic";
			val = String(1 + Math.ceil(rVal / 2));
		} else if (wLid === "mw_bristlecrown_flechette_launcher" && tActor) {
			if (tActor.statuses?.has?.("grappled") || findActiveGrappleFor(tActor) || hasBiologicalTag(tActor)) {
				type = "Kinetic";
				val = "3";
			}
		} else if (wLid === "mw_ch_smart_blade" && (mod.smartBladeUsedLockOn || state?.data?.hit_results?.some?.(h => h?.usedLockOn))) {
			val = "1d6+3";
		} else if (wLid === "mw_ch_wandering_blade" && mod.wanderingBladeThrownFar) {
			type = "Kinetic";
			val = "1d3+2";
		}
		if ((nuCavEnergy || tokugawaExposed) && (type === "Kinetic" || type === "Explosive")) {
			type = "Energy";
		}
		if (ammo && type !== "Heat" && type !== "Burn") {
			if (ammo === "thumper" || ammo === "javelin") type = "Explosive";
			else if (ammo === "shock" || ammo === "hellfire") type = "Energy";
			else if (ammo === "mag" || ammo === "sabot") type = "Kinetic";
		}
		return { ...d, type, val };
	});
}

async function injectDamageFlowBonuses(state) {
	if (!state?.data || state.data._lancerCnBonusInjected) return;
	state.data._lancerCnBonusInjected = true;
	const mech = combatMechOf(state.actor) ?? state.actor;
	if (!mech || mech.type === "npc" || mech.is_npc?.()) return;
	const mod = state.data.lancerCnDamageMod ?? pendingDamageMod ?? {};
	if (mod.noBonusDamage) {
		state.data.bonus_damage = [];
		return;
	}
	await ensureCombatTurnState(mech);
	const cs = getCombatState(mech);
	const cfg = getTalentConfig(mech);
	const fLid = mechFrameLid(mech);
	const item = state.item;
	const wLid = weaponLidOf(item);
	const modLid = weaponModLidOf(item);
	const profIdx = Number(item?.system?.selected_profile_index) || 0;
	const benefitsTalent = itemBenefitsFromTalents(item);
	const benefitsCb = itemBenefitsFromCoreBonuses(item);
	const isMelee = item ? isMeleeWeaponItem(item) : state.data.attack_type === "Melee";
	const isRanged = item ? isRangedWeaponItem(item) : state.data.attack_type === "Ranged";
	const profDmg = weaponProfileOf(item)?.damage ?? state.data.damage ?? [];
	const rawBaseType = profDmg[0]?.type && profDmg[0].type !== "Variable" ? profDmg[0].type : "Kinetic";
	const tokugawaExposed = fLid === "mf_tokugawa" && Boolean(mech.statuses?.has?.("exposed"));
	const baseType = (tokugawaExposed && (rawBaseType === "Kinetic" || rawBaseType === "Explosive")) ? "Energy" : rawBaseType;
	const bonuses = Array.isArray(state.data.bonus_damage) ? [...state.data.bonus_damage] : [];
	const tActor = firstDamageTargetActor(state);
	const csPatch = {};
	const cfgPatch = {};

	// 1. 核骑兵 I/II（超温危域中本回合首次武器/基础攻击：+2 热度，R2 武器伤害转能量且 +1d6 能量）
	if (benefitsTalent && mech.statuses?.has?.("dangerzone") && !cs.usedNuCavBonus && talentRank(mech, "t_nuclear_cavalier") >= 1) {
		bonuses.push({ type: "Heat", val: "2" });
		if (talentRank(mech, "t_nuclear_cavalier") >= 2) {
			bonuses.push({ type: "Energy", val: "1d6" });
			state.data._lancerCnNuCavEnergy = true;
		}
		csPatch.usedNuCavBonus = true;
	}

	// 1b. 机甲被动额外伤害：德川「限制突破」、丧钟「猎手」、阿特拉斯「终结一击」、纳尔逊「劲势/喷气枪兵」、加杰修罗「近故障电容器」、佩西拉特「肌肉示踪触觉」
	if (tokugawaExposed && !state.data.invade && (item || isMelee || isRanged)) {
		bonuses.push({ type: "Energy", val: "3" });
	}
	if (fLid === "mf_mourning_cloak" && isMelee && !cs.usedMourningCloakHunter) {
		const hrTok = state.data.hit_results?.[0]?.target ?? Array.from(globalThis.game?.user?.targets ?? [])[0] ?? null;
		const aTok = attackerToken(mech);
		if (hrTok) {
			const adjOthers = (globalThis.canvas?.tokens?.placeables ?? []).filter(tok =>
				tok !== hrTok
				&& tok !== aTok
				&& tok.actor
				&& !sameActorRef(tok.document?.uuid ?? tok.uuid, mech)
				&& (tokenDistance(hrTok, tok) ?? 99) <= 1,
			).length;
			if (adjOthers === 0) {
				bonuses.push({ type: baseType, val: "1d6" });
				csPatch.usedMourningCloakHunter = true;
			}
		}
	}
	if (fLid === "mf_atlas" && isMelee && tActor?.statuses?.has?.("prone") && !cs.usedAtlasFinishingBlow) {
		bonuses.push({ type: baseType, val: "1d6" });
		csPatch.usedAtlasFinishingBlow = true;
	}
	if ((fLid === "mf_nelson" || fLid === "mf_ext_nelson_wing") && isMelee && cfg.nelsonMomentum) {
		bonuses.push({ type: baseType, val: "1d6" });
		cfgPatch.nelsonMomentum = false;
	}
	if (fLid === "mf_ch_gajeshura" && isMelee && !cs.usedGajeshuraCapacitor && (Number(mech.system?.structure?.value) ?? 4) <= 2) {
		bonuses.push({ type: baseType, val: "1d6" });
		csPatch.usedGajeshuraCapacitor = true;
	}
	if (fLid === "mf_ch_pesilat" && !item && isMelee && !cs.usedPesilatMuscle) {
		bonuses.push({ type: "Kinetic", val: "1d6" });
		csPatch.usedPesilatMuscle = true;
	}

	// 2. 超功率口径（1/轮，指定武器或默认首把机甲武器 +1d6 额外伤害）
	if (item && benefitsCb && hasCoreBonus(mech, "cb_overpower_caliber") && !cs.usedOverpowerCaliber) {
		const mechWeapons = (mech.items ?? []).filter(i => i?.type === "mech_weapon" || i?.is_mech_weapon?.());
		const targetWId = cfg.overpowerWeaponId || mechWeapons[0]?.id || mechWeapons[0]?.uuid || "";
		if (!targetWId || item.id === targetWId || item.uuid === targetWId) {
			bonuses.push({ type: state.data._lancerCnNuCavEnergy && (baseType === "Kinetic" || baseType === "Explosive") ? "Energy" : baseType, val: "1d6" });
			csPatch.usedOverpowerCaliber = true;
		}
	}

	// 3. 枪侠 III「我用心杀戮」（+2d6 穿甲额外伤害）
	if (mod.gunslingerBonus2d6) {
		bonuses.push({ type: baseType, val: "2d6" });
	}

	// 4. 神枪手 II「瞄准具校正」（会心时 +1d6 额外伤害）
	if (mod.crackShotZeroIn && state.data.has_crit_hit) {
		bonuses.push({ type: baseType, val: "1d6" });
		state.data._lancerCnZeroInInjected = true;
	}
	state.data._lancerCnZeroInBaseType = baseType;

	// 5. 碾碎机 II「报复」（承受结构伤害后下一次近战攻击 +1d6 额外伤害）
	if (benefitsTalent && isMelee && cs.crusherStructBonus && talentRank(mech, "t_ext_crusher") >= 2) {
		bonuses.push({ type: baseType, val: "1d6" });
		csPatch.crusherStructBonus = false;
	}

	// 6. 分裂弹 wm_piof_fragmentation_rounds（1/回合，远程攻击目标每有 1 个邻接角色 +1 动能，最多 +4）
	if (modLid === "wm_piof_fragmentation_rounds" && isRanged && !cs.usedFragRounds) {
		const hrTok = state.data.hit_results?.[0]?.target ?? Array.from(globalThis.game?.user?.targets ?? [])[0] ?? null;
		if (hrTok) {
			const adjCount = (globalThis.canvas?.tokens?.placeables ?? []).filter(tok => tok !== hrTok && tok.actor && (tokenDistance(hrTok, tok) ?? 99) <= 1).length;
			const x = Math.min(4, adjCount);
			if (x > 0) {
				bonuses.push({ type: "Kinetic", val: String(x) });
				csPatch.usedFragRounds = true;
			}
		}
	}

	// 7. 条件加伤武器：漩涡钻机（伏卧 +1d6）、虎爪（离散或 0 护甲 +1d3）、药剂师步枪（每状况 +1 最高 +6）、运动驱动器线性场（每点护甲 +1d6 最高 3d6）、群聚巢房（层数 +1~+3）
	if (wLid === "mw_ext_maelstrom_drill_retracted" && tActor?.statuses?.has?.("prone")) {
		bonuses.push({ type: "Kinetic", val: "1d6" });
	}
	if (wLid === "mw_ch_tiger_claw" && tActor && (tActor.statuses?.has?.("shredded") || (Number(tActor.system?.armor) || 0) <= 0)) {
		bonuses.push({ type: "Kinetic", val: "1d3" });
	}
	if (wLid === "mw_piof_apothecary_rifle" && tActor && !cs.usedApothecaryRound) {
		const conds = ["impaired", "slow", "immobilized", "jammed", "shredded", "stunned"].filter(id => tActor.statuses?.has?.(id)).length;
		if (conds > 0) {
			bonuses.push({ type: baseType, val: String(Math.min(6, conds)) });
			csPatch.usedApothecaryRound = true;
		}
	}
	if (wLid === "mw_pl_kinetic_driver" && profIdx === 1 && tActor) {
		const armorDice = Math.min(3, Math.max(0, Number(tActor.system?.armor) || 0));
		if (armorDice > 0) bonuses.push({ type: "Kinetic", val: `${armorDice}d6` });
	}
	if (Number(mod.cometSwarmBonus) > 0) {
		bonuses.push({ type: "Kinetic", val: String(mod.cometSwarmBonus) });
	}

	// 8. 自走兵器库 II「地狱火」与德川「等离子鞘」（超温危域中造成能量伤害的武器攻击）：全部额外伤害转化为燃烧（热度不转化）
	const ammo = mod.walkingArmoryAmmo || "";
	const dealsEnergy = profDmg.some(d => d?.type === "Energy")
		|| Boolean(state.data._lancerCnNuCavEnergy)
		|| (tokugawaExposed && profDmg.some(d => d?.type === "Kinetic" || d?.type === "Explosive"))
		|| ammo === "shock"
		|| ammo === "hellfire";
	const tokugawaPlasmaSheath = Boolean(fLid === "mf_tokugawa" && mech.statuses?.has?.("dangerzone") && item && dealsEnergy);
	if (tokugawaPlasmaSheath) state.data._lancerCnBonusToBurn = true;
	state.data.bonus_damage = (ammo === "hellfire" || tokugawaPlasmaSheath)
		? bonuses.map(b => (b.type === "Heat" ? b : { ...b, type: "Burn" }))
		: bonuses;

	if ((Object.keys(csPatch).length || Object.keys(cfgPatch).length) && mech.isOwner) {
		state.data._lancerCnDmgRollback = {
			mech,
			csSnapshot: Object.keys(csPatch).length ? { ...cs } : null,
			cfgSnapshot: Object.keys(cfgPatch).length ? { ...cfg } : null,
		};
	}
	if (Object.keys(csPatch).length && mech.isOwner) {
		await setCombatState(mech, csPatch);
	}
	if (Object.keys(cfgPatch).length && mech.isOwner) {
		await setTalentConfig(mech, cfgPatch);
	}
}

async function rollbackAttackFlowState(state) {
	const rSnap = state?.data?._lancerCnReactionSnap;
	if (rSnap) {
		state.data._lancerCnReactionSnap = null;
		await refundReaction(rSnap.actor, rSnap.snapshot);
	}
	const rb = state?.data?._lancerCnAtkRollback;
	if (!rb) return;
	state.data._lancerCnAtkRollback = null;
	pendingWeaponAttackFlags = null;
	if (rb.mech?.isOwner) {
		if (rb.csSnapshot) await rb.mech.setFlag?.(MODULE_ID, "combatState", rb.csSnapshot);
		if (rb.cfgSnapshot) await rb.mech.setFlag?.(MODULE_ID, "talentConfig", rb.cfgSnapshot);
		if (rb.brawlerDie !== null && rb.brawlerDie !== undefined) {
			await setTalentDie(rb.mech, "brawler", rb.brawlerDie);
		}
		if (rb.razormanHeat) {
			await addHeatCompat(rb.mech, -rb.razormanHeat, { external: false });
		}
	}
	if (Array.isArray(rb.blackIceSnapshots)) {
		for (const item of rb.blackIceSnapshots) {
			if (item?.holder) await patchCombatStateCompat(item.holder, { blackIceStacks: item.prevIce });
		}
	}
}

async function rollbackDamageFlowState(state) {
	const rb = state?.data?._lancerCnDmgRollback;
	if (!rb) return;
	state.data._lancerCnDmgRollback = null;
	if (rb.mech?.isOwner) {
		if (rb.csSnapshot) await rb.mech.setFlag?.(MODULE_ID, "combatState", rb.csSnapshot);
		if (rb.cfgSnapshot) await rb.mech.setFlag?.(MODULE_ID, "talentConfig", rb.cfgSnapshot);
	}
}

function maxFormulaValue(formula) {
	const s = String(formula ?? "").trim();
	if (!s) return 0;
	let total = 0;
	for (const m of s.matchAll(/([+-]?)\s*(?:(\d*)d(\d+)(?:x\d+)?(?:k[hl]?(\d+))?|(\d+))/gi)) {
		const sign = m[1] === "-" ? -1 : 1;
		if (m[3]) {
			const faces = Number(m[3]) || 0;
			const rawN = m[2] ? Number(m[2]) : 1;
			const keepN = m[4] ? Number(m[4]) : rawN;
			total += sign * keepN * faces;
		} else if (m[5]) {
			total += sign * (Number(m[5]) || 0);
		}
	}
	return Math.max(0, total);
}

function countRolledOnes(damageResults) {
	let ones = 0;
	for (const dr of damageResults ?? []) {
		if (Number.isFinite(Number(dr?.ones))) {
			ones += Number(dr.ones);
			continue;
		}
		for (const term of dr?.roll?.terms ?? dr?.roll?.dice ?? []) {
			if (!Array.isArray(term?.results)) continue;
			for (const r of term.results) {
				if (r?.result === 1 || r?.exploded) ones++;
			}
		}
	}
	return ones;
}

async function rollCombatDrillOverkillChain(state, resultsKey, isCritPass) {
	if (weaponLidOf(state?.item) !== "mw_combat_drill") return;
	const list = state.data?.[resultsKey] ?? [];
	let pending = countRolledOnes(list);
	if (pending <= 0) return;
	const matchingTargets = (state.data?.targets ?? []).filter(t => {
		if (Boolean(t.crit) !== Boolean(isCritPass)) return false;
		const tUuid = t.target?.document?.uuid ?? t.target?.uuid ?? (typeof t.target === "string" ? t.target : null);
		const tActor = t.target?.actor ?? resolveActor(tUuid);
		return Boolean(tActor?.statuses?.has?.("prone") || tActor?.statuses?.has?.("immobilized") || tActor?.statuses?.has?.("stunned"));
	});
	if (!matchingTargets.length) return;
	const dType = state.data.damage?.[0]?.type ?? "Kinetic";
	let bonusSum = 0;
	let guard = 0;
	while (pending > 0 && guard < 20) {
		pending--;
		guard++;
		const roll = new Roll("1d6");
		if (state.data.overkill && foundry?.dice?.terms?.Die) {
			roll.terms?.forEach?.(term => {
				if (term instanceof foundry.dice.terms.Die) term.modifiers = ["x1", `kh${term.number}`, ...(term.modifiers ?? [])];
			});
		}
		await roll.evaluate();
		const tt = typeof roll.getTooltip === "function" ? await roll.getTooltip() : "";
		state.data[resultsKey] = [...(state.data[resultsKey] ?? []), { roll, tt, d_type: dType, bonus: true }];
		bonusSum += Number(roll.total) || 0;
		pending += countRolledOnes([{ roll }]);
	}
	if (bonusSum > 0) {
		for (const t of matchingTargets) {
			const added = t.half_damage ? Math.ceil(bonusSum / 2) : bonusSum;
			t.damage = [...(t.damage ?? []), { type: dType, amount: added }];
		}
	}
}

function rollHasNat20(roll) {
	if (!roll) return false;
	if (roll._lancerCnNat20) return true;
	for (const term of roll.terms ?? roll.dice ?? []) {
		if (term?.faces && term.faces !== 20) continue;
		if (Array.isArray(term?.results) && term.results.some(r => r?.result === 20 && r.active !== false && !r.discarded)) return true;
	}
	return false;
}

function rollNatD20(roll) {
	if (!roll) return null;
	if (Number.isFinite(Number(roll._lancerCnNatD20))) return Number(roll._lancerCnNatD20);
	if (roll._lancerCnNat20) return 20;
	for (const term of roll.terms ?? roll.dice ?? []) {
		if (term?.faces && term.faces !== 20) continue;
		if (Array.isArray(term?.results)) {
			const active = term.results.find(r => r && r.active !== false && !r.discarded && Number.isFinite(Number(r.result)));
			if (active) return Number(active.result);
		}
	}
	return null;
}

function commanderAuraBonuses(actor, selfTokOverride = null) {
	if (!actor) return { disciplineAcc: 0, broadcastSysAcc: 0, broadcastTechDiff: 0 };
	const selfTok = selfTokOverride ?? attackerToken(actor);
	if (!selfTok) return { disciplineAcc: 0, broadcastSysAcc: 0, broadcastTechDiff: 0 };
	const myDisp = selfTok.document?.disposition ?? 1;
	let disciplineAcc = 0;
	let broadcastSysAcc = 0;
	let broadcastTechDiff = 0;
	for (const tok of globalThis.canvas?.tokens?.placeables ?? []) {
		if (!tok || tok === selfTok || !tok.actor) continue;
		if (tok.actor === actor || (actor.uuid && tok.actor.uuid === actor.uuid)) continue;
		if ((tok.document?.disposition ?? 1) !== myDisp) continue;
		if (tok.actor.statuses?.has?.("downandout") || tok.actor.statuses?.has?.("jammed")) continue;
		if (!disciplineAcc && hasNpcFeature(tok.actor, ["npcf_cn_commander_8", "npcf_military_discipline_commander"], ["军纪"])) {
			if ((tokenDistance(selfTok, tok) ?? 99) <= 1) disciplineAcc = 1;
		}
		if (!broadcastSysAcc && hasNpcFeature(tok.actor, ["npcf_cn_commander_4", "npcf_inspiring_presence_commander"], ["激励广播"])) {
			broadcastSysAcc = 1;
			broadcastTechDiff = 1;
		}
	}
	return { disciplineAcc, broadcastSysAcc, broadcastTechDiff };
}

function zeroGruntChaffTargets(state) {
	const zeroUuids = state?.data?.lancerCnZeroUuids;
	if (!zeroUuids?.length || !Array.isArray(state?.data?.targets)) return;
	for (const t of state.data.targets) {
		const tUuid = t.target?.document?.uuid ?? t.target?.uuid ?? (typeof t.target === "string" ? t.target : null);
		if (!tUuid || !zeroUuids.some(u => sameActorRef(u, tUuid))) continue;
		t.damage = Array.isArray(t.damage) && t.damage.length
			? t.damage.map(d => ({ ...d, amount: 0 }))
			: [{ type: "Kinetic", amount: 0 }];
	}
}

function patchLancerFlows() {
	patchWeaponRangeTemplate();
	const steps = game.lancer?.flowSteps;
	if (!steps?.get || !steps?.set) return false;

	const wrap = (key, fn) => {
		const orig = steps.get(key);
		if (typeof orig !== "function" || orig.lancerCnWrapped) return;
		const wrapped = function (state, options) { return fn(orig, state, options); };
		wrapped.lancerCnWrapped = true;
		steps.set(key, wrapped);
	};

	// 0. 核心系统启动：修复系统 consumeCorePower 未将 system.core_active 置为 true 的缺陷，并激活机甲专属核心协议引擎
	wrap("consumeCorePower", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (ok !== false && state?.actor) {
			await activateCorePower(state.actor);
		}
		return ok;
	});

	// 0a-1. 反应类动作与 NPC 反应特性启动拦截（ActivationFlow / SystemFlow）：在扣减热度、充能或出卡前校验反应可用性（玩家受限直接拦截提示，GM 允许越权放行）
	wrap("initActivationData", async (orig, state, options) => {
		let previewAct = state?.data?.action ?? null;
		if (!previewAct && state?.item) {
			const p = String(options?.action_path || state?.data?.action_path || "system.actions.0");
			previewAct = p.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), state.item);
		}
		let reactionSnap = null;
		if (previewAct && /^reaction$/i.test(String(previewAct.activation ?? "")) && state?.actor) {
			const actLabel = String(options?.title || state?.data?.title || previewAct.name || state?.item?.name || "反应");
			const freqStr = String(previewAct.frequency ?? "").trim();
			const roundFlag = /^1\s*\/\s*round$|^每轮\s*1\s*次$|^1\s*\/\s*轮$/i.test(freqStr)
				? `usedActRound_${String(previewAct.lid || state?.item?.system?.lid || previewAct.name || "act").replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_")}`
				: null;
			const rGate = await consumeReaction(state.actor, { kind: "sheetAction", label: actLabel, roundFlag });
			if (!rGate.ok) return false;
			reactionSnap = { actor: state.actor, snapshot: rGate.snapshot };
		}
		const ok = await orig(state, options);
		if (reactionSnap) {
			const delegatedTech = Boolean(previewAct?.tech_attack || /^invade$/i.test(String(previewAct?.activation ?? "")));
			if (ok === false && !delegatedTech) {
				await refundReaction(reactionSnap.actor, reactionSnap.snapshot);
			} else if (state?.data) {
				state.data._lancerCnReactionSnap = reactionSnap;
			}
		}
		return ok;
	});
	wrap("initSystemUseData", async (orig, state, options) => {
		let reactionSnap = null;
		const item = state?.item;
		if (item && state?.actor) {
			const tags = weaponAllTagsOf(item);
			const isReactionItem = item.system?.type === "Reaction" || tags.some(t => t?.lid === "tg_reaction" || t?.id === "tg_reaction");
			if (isReactionItem) {
				const roundTag = tags.find(t => (t?.lid === "tg_round" || t?.id === "tg_round") && (parseInt(t.val, 10) || 1) === 1);
				const roundFlag = roundTag
					? `usedActRound_${String(item.system?.lid || item.name || "sys").replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_")}`
					: null;
				const rGate = await consumeReaction(state.actor, { kind: "systemReaction", label: String(state?.data?.title || item.name || "反应"), roundFlag });
				if (!rGate.ok) return false;
				reactionSnap = { actor: state.actor, snapshot: rGate.snapshot };
			}
		}
		const ok = await orig(state, options);
		if (reactionSnap) {
			if (ok === false) await refundReaction(reactionSnap.actor, reactionSnap.snapshot);
			else if (state?.data) state.data._lancerCnReactionSnap = reactionSnap;
		}
		return ok;
	});

	// 0a-2. 修复原生 NPCRechargeFlow.applyRecharge 在充能标签使用分层写法（如 "{6/5/4}"）时 num_val 为 NaN 导致永远无法充能且显示 target: 0 的缺陷
	wrap("applyRecharge", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (ok === false || !state?.data || !state?.actor) return ok;
		const actorTier = Math.min(3, Math.max(1, Number(state.actor.system?.tier) || 1));
		const rolled = Number(state.data.result?.roll?.total) || 0;
		const uuids = Array.isArray(state.data.recharging_uuids) ? state.data.recharging_uuids : [];
		const nextCharged = [];
		for (const u of uuids) {
			const item = resolveDocSync(u) ?? (state.actor.items ?? []).find?.(i => i?.uuid === u || i?.id === u);
			if (!item) continue;
			const tags = (() => { try { return item.getTags?.() ?? item.system?.tags ?? []; } catch { return item.system?.tags ?? []; } })();
			const rTag = tags.find(t => t?.is_recharge || t?.lid === "tg_recharge");
			if (!rTag) continue;
			const effTier = Math.min(3, Math.max(1, Number(item.system?.tier_override) || actorTier));
			const target = npcRechargeTargetVal(rTag, effTier);
			if (!item.system?.charged && rolled >= target) {
				if (typeof item.update === "function") await item.update({ "system.charged": true });
				else if (item.system) item.system.charged = true;
			}
			nextCharged.push({ name: item.name, target, charged: Boolean(item.system?.charged) });
		}
		if (nextCharged.length) state.data.charged = nextCharged;
		return ok;
	});
	wrap("printSystemCard", async (orig, state, options) => {
		pendingCardItemMeta = {
			actorUuid: state?.actor?.uuid ?? null,
			itemUuid: state?.item?.uuid ?? null,
			ts: Date.now(),
		};
		try { return await orig(state, options); }
		finally { pendingCardItemMeta = null; }
	});
	for (const genStep of ["printGenericCard", "printGenericHTML"]) {
		wrap(genStep, async (orig, state, options) => {
			if (state?.item || state?.actor) {
				pendingCardItemMeta = {
					actorUuid: state?.actor?.uuid ?? null,
					itemUuid: state?.item?.uuid ?? null,
					ts: Date.now(),
				};
			}
			return orig(state, options);
		});
	}

	// 0b. 武器 / 基础攻击准度、难度、无视掩护、投掷武器状态与天赋状态预填（含修复 NPC 近战武器 "Main Melee" 被系统误判为 Ranged 的缺陷）
	wrap("initAttackData", async (orig, state, options) => {
		const preMech = combatMechOf(state?.actor) ?? state?.actor;
		if (state?.item) {
			if (isWeaponThrownOut(preMech, state.item)) {
				ui?.notifications?.warn?.(`武器「${state.item.name}」已投出落在场上，取回前无法再次使用！（可在邻接时以自由动作拾回，或具备「匕首戏法」时在回合结束自动收回）`);
				return false;
			}
			applyKnifeJugglerTags(state.item, preMech);
		}
		const ok = await orig(state, options);
		if (ok === false || !state?.data) return ok;
		const mech = combatMechOf(state.actor) ?? state.actor;
		const item = state.item ?? null;
		// 修复原生 initAttackData / AccDiffHudData 仅判断 weapon_type === "Melee"，导致 NPC 的 "Main Melee" / "Heavy Melee" 被误判为远程武器而错误吃掩护与交战惩罚
		if (item && (item.type === "npc_feature" || item.is_npc_feature?.()) && isMeleeWeaponItem(item)) {
			state.data.attack_type = "Melee";
			if (state.data.acc_diff?.weapon) {
				state.data.acc_diff.weapon.melee = true;
				state.data.acc_diff.weapon.engaged = false;
			}
		}
		const wLid = weaponLidOf(item);
		const modLid = weaponModLidOf(item);
		const profIdx = Number(item?.system?.selected_profile_index) || 0;
		const benefitsTalent = itemBenefitsFromTalents(item);
		const benefitsCb = itemBenefitsFromCoreBonuses(item);
		const isMelee = item ? isMeleeWeaponItem(item) : state.data.attack_type === "Melee";
		const isRanged = item ? isRangedWeaponItem(item) : state.data.attack_type === "Ranged";
		const basicKey = pendingBasic?.key ?? null;
		const fLid = mechFrameLid(mech);

		if (mech?.isOwner) await ensureCombatTurnState(mech);
		const cs = getCombatState(mech);
		const cfg = getTalentConfig(mech);
		const csPatch = {};
		const cfgPatch = {};
		const outFlags = {};
		let preBrawlerDie = null;
		let razormanHeat = 0;

		// 猎人 III「蔑刃」自由动作投掷标记、守望反应攻击标记与近战武器智能近战/投掷距离切换
		const isOverwatch = Boolean(
			(pendingOverwatchAttack && (!pendingOverwatchAttack.weaponUuid || item?.uuid === pendingOverwatchAttack.weaponUuid))
			|| state.data._lancerCnOverwatchAttack,
		);
		if (isOverwatch) {
			state.data._lancerCnOverwatchAttack = true;
			outFlags.overwatchAttack = true;
			if (item?.name && !String(state.data.title || "").includes("守望")) {
				state.data.title = `守望 // ${item.name}`;
			}
		}
		if (pendingDisdainfulBlade && (!pendingDisdainfulBlade.weaponUuid || item?.uuid === pendingDisdainfulBlade.weaponUuid)) {
			state.data._lancerCnForceThrown = true;
			state.data._lancerCnNoBonusDamage = true;
			if (item?.name && !String(state.data.title || "").includes("蔑刃")) {
				state.data.title = `${item.name}（蔑刃 · 投掷）`;
			}
		}
		syncWeaponThrownMode(state, { explicitAccDiff: Boolean(options?.acc_diff) });
		if (state.data._lancerCnNoBonusDamage) outFlags.noBonusDamage = true;
		if (state.data._lancerCnWanderingFar) outFlags.wanderingBladeThrownFar = true;

		// 无视交战远程惩罚：混合作战 II / 刺鬃冠镖弹发射器 / 台风
		if (state.data.acc_diff?.weapon && ((benefitsTalent && talentRank(mech, "t_combined_arms") >= 2) || wLid === "mw_bristlecrown_flechette_launcher" || wLid === "mw_ch_typhoon")) {
			state.data.acc_diff.weapon.engaged = false;
		}

		if (state.data.acc_diff?.base && !state.data._lancerCnCpAtkAcc) {
			let accBonus = cpAttackAccuracyBonus(mech);
			let diffBonus = 0;
			let ignoreCover = false;
			const aTok = attackerToken(mech);
			const tads = Array.isArray(state.data.acc_diff.targets) ? state.data.acc_diff.targets : [];
			const firstTadTok = tadTokenOf(tads[0]) ?? Array.from(globalThis.game?.user?.targets ?? [])[0] ?? null;
			const firstTadUuid = firstTadTok?.document?.uuid ?? firstTadTok?.uuid ?? tadUuidOf(tads[0]);
			const firstTadActor = firstTadTok?.actor ?? resolveActor(firstTadUuid);

			// 机甲与 NPC 被动准度：托尔图加「哨兵」/ 弓箭手「优秀哨兵」（反应攻击 +1 准度）、射手座「捕食者」（匿迹时 +1 准度）
			if ((fLid === "mf_tortuga" && (cfg.tortugaSentinel || isOverwatch))
				|| (isOverwatch && hasNpcFeature(state.actor, ["npcf_cn_archer_3", "npcf_superior_sentinel_archer"], ["优秀哨兵"]))) {
				accBonus += 1;
				if (cfg.tortugaSentinel) cfgPatch.tortugaSentinel = false;
			}
			if (fLid === "mf_ch_sagittarius" && mech?.statuses?.has?.("hidden")) {
				accBonus += 1;
			}
			// 指挥官光环「军纪」：邻近友方指挥官时所有攻击 +1 准度
			accBonus += commanderAuraBonuses(mech, aTok).disciplineAcc;

			// 残酷 III「无情」：不懈骰累加准度
			if (benefitsTalent && talentRank(mech, "t_brutal") >= 3) {
				accBonus += Number(getTalentDie(mech, "brutal")) || 0;
			}
			// 神枪手 I/II/III：稳定瞄准（固定）期间步枪 +1 准度；R2 瞄准具校正 +1 难度换会心 +1d6；R3 看招标记
			if (benefitsTalent && isRanged && weaponHasType(item, "Rifle") && (cs.steadyAim || mech?.statuses?.has?.("immobilized"))) {
				if (talentRank(mech, "t_crack_shot") >= 1) accBonus += 1;
				if (talentRank(mech, "t_crack_shot") >= 2 && cfg.crackShotZeroIn && !cs.usedCrackShotZeroIn) {
					diffBonus += 1;
					outFlags.crackShotZeroIn = true;
					csPatch.usedCrackShotZeroIn = true;
				}
				if (talentRank(mech, "t_crack_shot") >= 3) outFlags.watchThisArmed = true;
			}
			// 决斗士 I：每回合首次主近战攻击 +1 准度
			if (benefitsTalent && item?.system?.size === "Main" && isMelee && talentRank(mech, "t_duelist") >= 1 && !cs.usedFirstMainMelee) {
				accBonus += 1;
			}
			// 枪侠 I/III：每回合首次副远程攻击 +1 准度；快枪手骰 = 1 时无视掩护并触发「我用心杀戮」
			if (benefitsTalent && item?.system?.size === "Auxiliary" && isRanged) {
				if (talentRank(mech, "t_gunslinger") >= 1 && !cs.usedFirstAuxRanged) accBonus += 1;
				if (talentRank(mech, "t_gunslinger") >= 3 && getTalentDie(mech, "gunslinger") === 1) {
					ignoreCover = true;
					outFlags.gunslingerHeartKill = true;
				}
			}
			// 拳师 I/III：对正与你擒拿的目标近战攻击 +1 准度；拳师骰 = 1 发动击倒技
			if (isMelee && talentRank(mech, "t_brawler") >= 1 && firstTadActor) {
				const gp = findActiveGrappleFor(mech);
				const grappledTogether = gp
					? (sameActorRef(gp.gs.attackerUuid, firstTadUuid ?? firstTadActor) || sameActorRef(gp.gs.defenderUuid, firstTadUuid ?? firstTadActor))
					: Boolean(mech?.statuses?.has?.("grappled") && firstTadActor.statuses?.has?.("grappled"));
				if (grappledTogether) accBonus += 1;
			}
			if (isMelee && talentRank(mech, "t_brawler") >= 3 && getTalentDie(mech, "brawler") === 1 && cfg.brawlerKnockout) {
				outFlags.brawlerKnockout = true;
				preBrawlerDie = 1;
				await setTalentDie(mech, "brawler", 6);
				cfgPatch.brawlerKnockout = false;
			}
			// 潘克拉蒂 I：对固定或缓慢目标近战攻击 +1 准度
			if (benefitsTalent && isMelee && talentRank(mech, "t_pankrati") >= 1 && firstTadActor && (firstTadActor.statuses?.has?.("immobilized") || firstTadActor.statuses?.has?.("slow"))) {
				accBonus += 1;
			}
			// 先锋 I/II：使用 CQB 武器攻击射程 3 内目标 +1 准度（R1）且无视掩护（R2）
			if (benefitsTalent && weaponHasType(item, "CQB") && talentRank(mech, "t_vanguard") >= 1) {
				const vRank = talentRank(mech, "t_vanguard");
				const owDist = isOverwatch && Number.isFinite(pendingOverwatchAttack?.triggerDist) ? pendingOverwatchAttack.triggerDist : null;
				if (tads.length) {
					for (const tad of tads) {
						const bTok = tadTokenOf(tad);
						const dist = owDist ?? ((aTok && bTok) ? tokenDistance(aTok, bTok) : (Number.isFinite(Number(tad?.distance)) ? Number(tad.distance) : null));
						if (dist !== null && dist <= 3) {
							tad.accuracy = (Number(tad.accuracy) || 0) + 1;
							if (vRank >= 2) tad.cover = 0;
						}
					}
				} else if ((owDist ?? ((aTok && firstTadTok) ? (tokenDistance(aTok, firstTadTok) ?? 99) : 99)) <= 3) {
					accBonus += 1;
				}
			}
			// 混合作战 III「腥风血雨」：近战命中后对同一目标远程 +1 准度，反之亦然
			if (benefitsTalent && talentRank(mech, "t_combined_arms") >= 3 && cs.stormOfViolenceLast) {
				const wantMatch = (cs.stormOfViolenceLast === "melee" && isRanged) || (cs.stormOfViolenceLast === "ranged" && isMelee);
				const targetOk = cs.stormOfViolenceTargetUuid
					? (Boolean(firstTadUuid) && sameActorRef(cs.stormOfViolenceTargetUuid, firstTadUuid))
					: Boolean(firstTadTok || tads.length);
				if (wantMatch && targetOk) {
					accBonus += 1;
					csPatch.stormOfViolenceLast = null;
					csPatch.stormOfViolenceTargetUuid = null;
				}
			}
			// 战术家 II「背光」：1/轮，处于更高高度进行远程攻击 +1 准度
			if (benefitsTalent && isRanged && talentRank(mech, "t_tactician") >= 2 && !cs.usedTacticianSolar && aTok && firstTadTok) {
				const attElev = Number(aTok.document?.elevation ?? aTok.elevation ?? 0);
				const defElev = Number(firstTadTok.document?.elevation ?? firstTadTok.elevation ?? 0);
				if (attElev > defElev) {
					accBonus += 1;
					csPatch.usedTacticianSolar = true;
				}
			}
			// 猛士 I「动量」：冲撞 +1 准度
			if (basicKey === "ram" && talentRank(mech, "t_juggernaut") >= 1 && cfg.juggernautMomentum) {
				accBonus += 1;
				cfgPatch.juggernautMomentum = false;
			}
			// 渗透者 II「埋伏」：以匿迹开始回合后的首次攻击附加机体豁免（缓慢+受损）
			if ((cs.startedTurnHidden || mech?.statuses?.has?.("hidden")) && !cs.usedInfiltratorAmbush && talentRank(mech, "t_infiltrator") >= 2) {
				outFlags.infiltratorAmbush = true;
				csPatch.usedInfiltratorAmbush = true;
			}
			// 碾碎机 I「鲁莽摇摆」：1/轮近战武器 +1 准度
			if (benefitsTalent && isMelee && talentRank(mech, "t_ext_crusher") >= 1 && cfg.crusherReckless) {
				accBonus += 1;
				cfgPatch.crusherReckless = false;
			}
			// 剃刀人 II「意志覆写」：晕眩或受扰时强行交火承受 +2 难度与 +1 热度
			if (talentRank(mech, "t_ext_razorman") >= 2 && (mech?.statuses?.has?.("stunned") || mech?.statuses?.has?.("jammed")) && cfg.razormanOverride) {
				diffBonus += 2;
				razormanHeat = 1;
				await addHeatCompat(mech, 1, { external: false });
			}
			// 核心奖励「自稳定承力点」：指定武器挂载（默认首把机甲武器）攻击 +1 准度
			if (item && benefitsCb && hasCoreBonus(mech, "cb_auto_stabilizing_hardpoints")) {
				const mechWeapons = (mech.items ?? []).filter(i => i?.type === "mech_weapon" || i?.is_mech_weapon?.());
				const targetWId = cfg.autoStabWeaponId || mechWeapons[0]?.id || mechWeapons[0]?.uuid || "";
				if (!targetWId || item.id === targetWId || item.uuid === targetWId) accBonus += 1;
			}
			// 核心奖励「先见之训」：科技攻击命中过的目标，下次近战攻击 +1 准度
			if (benefitsCb && isMelee && cs.tomorrowsThoughtTargetUuid && Boolean(firstTadUuid) && sameActorRef(cs.tomorrowsThoughtTargetUuid, firstTadUuid)) {
				accBonus += 1;
			}
			// 武器与改装修正：老爹级 UNCLE (+2 难度)、相位准备（无视掩护但目标视为隐形）、食人族双管（+1 难度）、自走兵器库
			if (modLid === "wm_uncle_class_comp_con" && cfg.uncleAutonomous) {
				diffBonus += 2;
				cfgPatch.uncleAutonomous = false;
			}
			if (modLid === "wm_phase_ready_mod" && cfg.phaseReady) {
				ignoreCover = true;
				state.data._lancerCnPhaseReady = true;
				for (const tad of tads) {
					if (tad?.plugins?.invisibility) tad.plugins.invisibility.data = 1;
				}
			}
			if (wLid === "mw_hhs_155_cannibal" && profIdx === 1) {
				diffBonus += 1;
			}
			if (benefitsTalent && item?.system?.size === "Main" && isRanged && talentRank(mech, "t_walking_armory") >= 1 && cfg.walkingArmoryAmmo && !cs.usedWalkingArmoryTurn) {
				if (hasWalkingArmoryCharges(mech, cfg.walkingArmoryAmmo)) {
					outFlags.walkingArmoryAmmo = cfg.walkingArmoryAmmo;
					if (cfg.walkingArmoryAmmo === "mag" && state.data.acc_diff?.weapon) {
						state.data.acc_diff.weapon.arcing = true;
					}
				} else {
					ui?.notifications?.warn?.("自走兵器库剩余充能不足，本次攻击不使用特制弹药。");
				}
			}

			// NPC 核心模板被动特征：至高近战（近战 +1 准度）、卓越索敌（远程无视掩护）、高效杀手（<=2 结构 +1 准度与穿甲）、视域 / 微弱信号
			if (state.actor?.type === "npc" || state.actor?.is_npc?.()) {
				if (isMelee && hasNpcFeature(state.actor, ["npcf_cn_ultra_32", "npcf_supreme_melee_ultra"], ["至高近战"])) accBonus += 1;
				if (isRanged && hasNpcFeature(state.actor, ["npcf_cn_ultra_30", "npcf_superior_targeting_ultra"], ["卓越索敌"])) ignoreCover = true;
				if (hasNpcFeature(state.actor, ["npcf_cn_mercenary_4", "npcf_efficient_killer_mercenary"], ["高效杀手"])) {
					const isLowStruct = a => Boolean(a && ((Number(a.system?.structure?.max) || 0) <= 0 || Number(a.system?.structure?.value) <= 2));
					if (tads.length > 1) {
						let anyLow = false;
						for (const tad of tads) {
							const ta = tadActorOf(tad);
							if (isLowStruct(ta)) {
								tad.accuracy = (Number(tad.accuracy) || 0) + 1;
								anyLow = true;
							}
						}
						if (anyLow) outFlags.ap = true;
					} else if (isLowStruct(firstTadActor)) {
						accBonus += 1;
						outFlags.ap = true;
					}
				}
				const ultraSight = hasNpcFeature(state.actor, ["npcf_cn_ultra_26", "npcf_sight_ultra"], ["视域"]);
				const vetFaint = !ultraSight && hasNpcFeature(state.actor, ["npcf_cn_veteran_12", "npcf_feint_veteran", "npcf_faint_signal_veteran"], ["微弱信号"]);
				if (ultraSight || vetFaint) {
					for (const tad of tads) {
						if (!tad?.plugins?.invisibility) continue;
						if (ultraSight) {
							tad.plugins.invisibility.data = -1;
						} else {
							const bTok = tadTokenOf(tad);
							const dist = (aTok && bTok) ? tokenDistance(aTok, bTok) : (Number.isFinite(Number(tad?.distance)) ? Number(tad.distance) : null);
							if (dist !== null && dist <= 3) tad.plugins.invisibility.data = -1;
						}
					}
				}
			}

			// 受击目标机甲被动：金斑蝶「反光迷彩」/ 百手巨人「剃刀虫群」（软掩护变为 +2 难度）、晶眼蝶「超感知」（行动前被攻击 +1 难度）、受身（直到下回合结束被攻击 +1 难度）
			const defEntries = tads.length
				? tads.map(tad => ({ tad, actor: tadActorOf(tad) }))
				: (firstTadActor ? [{ tad: null, actor: firstTadActor }] : []);
			for (const de of defEntries) {
				const dAct = de.actor;
				if (!dAct) continue;
				const dLid = mechFrameLid(dAct);
				const dCs = getCombatState(dAct);
				let extraDiff = 0;
				if (dLid === "mf_amber_phantom" && dCs.amberPrecog) {
					extraDiff += 1;
				}
				if (dCs.bracedUntilTurnEnd || dAct.getFlag?.(MODULE_ID, "braced")) {
					extraDiff += 1;
				}
				if (isOverwatch && hasNpcFeature(dAct, ["npcf_x_tws_1_2"], ["冲锋在前，撤退在后"])) {
					extraDiff += 1;
				}
				if ((dLid === "mf_metalmark" || dLid === "mf_balor_alt_hecatoncheires") && isRanged && !ignoreCover && !state.data.acc_diff?.weapon?.seeking) {
					const inSoft = de.tad
						? Number(de.tad.cover) === 1
						: Boolean(dAct.statuses?.has?.("cover_soft") && !dAct.statuses?.has?.("cover_hard"));
					if (inSoft) extraDiff += 1;
				}
				if (extraDiff > 0) {
					if (de.tad) de.tad.difficulty = (Number(de.tad.difficulty) || 0) + extraDiff;
					else diffBonus += extraDiff;
				}
			}

			if (accBonus) state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + accBonus;
			if (diffBonus) state.data.acc_diff.base.difficulty = (Number(state.data.acc_diff.base.difficulty) || 0) + diffBonus;
			if (ignoreCover) {
				for (const tad of tads) tad.cover = 0;
			}
			state.data._lancerCnIgnoreCover = ignoreCover;
			state.data._lancerCnHadInitialTarget = Boolean(firstTadTok || firstTadUuid);
			state.data._lancerCnProcessedTargetUuids = new Set(tads.map(tadUuidOf).filter(Boolean));
			state.data._lancerCnCpAtkAcc = true;
		}

		if ((Object.keys(csPatch).length || Object.keys(cfgPatch).length || preBrawlerDie !== null || razormanHeat > 0) && mech?.isOwner) {
			state.data._lancerCnAtkRollback = {
				mech,
				csSnapshot: Object.keys(csPatch).length ? { ...cs } : null,
				cfgSnapshot: Object.keys(cfgPatch).length ? { ...cfg } : null,
				brawlerDie: preBrawlerDie,
				razormanHeat,
				blackIceSnapshots: [],
			};
		}
		if (Object.keys(csPatch).length && mech?.isOwner) await setCombatState(mech, csPatch);
		if (Object.keys(cfgPatch).length && mech?.isOwner) await setTalentConfig(mech, cfgPatch);
		pendingWeaponAttackFlags = Object.keys(outFlags).length
			? { actorUuid: state.actor?.uuid ?? mech?.uuid, ...outFlags }
			: null;
		return ok;
	});

	// 0c. 科技攻击准度预填（含修复原生 NPC 科技特性 tier_override 下标偏移）+ 广域编码脉冲 / 视域无视隐形 + 哥布林 / 射手座 / 佩西拉特 / 指挥官光环 + 黑冰模块 + 系统管理员防火墙 + NPC 军团 / 固化目标 / 要塞 / 科技脆弱
	wrap("initTechAttackData", async (orig, state, options) => {
		const isNpcTech = Boolean(
			state?.item
			&& (state.item.type === "npc_feature" || state.item.is_npc_feature?.())
			&& (state?.actor?.type === "npc" || state?.actor?.is_npc?.()),
		);
		const savedTierOv = isNpcTech ? (Number(state.item.system?.tier_override) || 0) : 0;
		const savedActorTier = isNpcTech ? state.actor?.system?.tier : undefined;
		if (savedTierOv > 0 && state.item.system && state.actor?.system) {
			state.item.system.tier_override = 0;
			state.actor.system.tier = Math.min(3, Math.max(1, savedTierOv));
		}
		let ok;
		try { ok = await orig(state, options); }
		finally {
			if (savedTierOv > 0 && state?.item?.system && state?.actor?.system) {
				state.item.system.tier_override = savedTierOv;
				state.actor.system.tier = savedActorTier;
			}
		}
		if (ok !== false && state?.data) {
			if (isNpcTech) {
				if (!state.data.effect && state.item.system?.effect) state.data.effect = state.item.system.effect;
				if ((!state.data.tags || !state.data.tags.length) && Array.isArray(state.item.system?.tags)) state.data.tags = state.item.system.tags;
			}
			const mech = combatMechOf(state.actor) ?? state.actor;
			const fLid = mechFrameLid(mech);
			if (mech?.isOwner) await ensureCombatTurnState(mech);
			const tads = Array.isArray(state.data.acc_diff?.targets) ? state.data.acc_diff.targets : [];
			const aTok = attackerToken(mech);

			if (state.data.acc_diff?.base && !state.data._lancerCnCpAtkAcc) {
				let bonus = cpAttackAccuracyBonus(mech);
				const upstreamAddedGoblinAcc = Boolean(
					state.item
					&& !options?.acc_diff
					&& state.actor?.is_mech?.()
					&& state.actor?.system?.loadout?.frame?.value?.system?.lid === "mf_goblin",
				);
				if (fLid === "mf_goblin" && !upstreamAddedGoblinAcc) bonus += 1;
				if (fLid === "mf_ch_sagittarius" && mech?.statuses?.has?.("hidden")) bonus += 1;
				if (fLid === "mf_ch_pesilat" && state.data.invade) {
					const firstTok = tadTokenOf(tads[0]) ?? Array.from(globalThis.game?.user?.targets ?? [])[0] ?? null;
					const firstUuid = firstTok?.document?.uuid ?? firstTok?.uuid ?? tadUuidOf(tads[0]);
					const firstAct = firstTok?.actor ?? resolveActor(firstUuid);
					if (firstAct) {
						const gp = findActiveGrappleFor(mech);
						const grappled = gp
							? (sameActorRef(gp.gs.attackerUuid, firstUuid ?? firstAct) || sameActorRef(gp.gs.defenderUuid, firstUuid ?? firstAct))
							: Boolean(mech?.statuses?.has?.("grappled") && firstAct.statuses?.has?.("grappled"));
						if (grappled) bonus += 1;
					}
				}
				bonus += commanderAuraBonuses(mech, aTok).disciplineAcc;
				if (itemBenefitsFromTalents(state.item) && talentRank(mech, "t_brutal") >= 3) {
					bonus += Number(getTalentDie(mech, "brutal")) || 0;
				}
				if (hasNpcFeature(state.actor, ["npcf_cn_ultra_24", "npcf_legion_ultra"], ["军团"])) {
					bonus += 1;
				}
				if (bonus) state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + bonus;
				state.data._lancerCnCpAtkAcc = true;
			}
			const ultraSight = hasNpcFeature(state.actor, ["npcf_cn_ultra_26", "npcf_sight_ultra"], ["视域"]);
			const vetFaint = !ultraSight && hasNpcFeature(state.actor, ["npcf_cn_veteran_12", "npcf_feint_veteran", "npcf_faint_signal_veteran"], ["微弱信号"]);
			if ((state.actor?._lancerCnWidePulse || ultraSight || vetFaint) && tads.length) {
				for (const tad of tads) {
					if (!tad?.plugins?.invisibility) continue;
					if (state.actor?._lancerCnWidePulse || ultraSight) {
						tad.plugins.invisibility.data = -1;
					} else {
						const bTok = tadTokenOf(tad);
						const dist = (aTok && bTok) ? tokenDistance(aTok, bTok) : (Number.isFinite(Number(tad?.distance)) ? Number(tad.distance) : null);
						if (dist !== null && dist <= 3) tad.plugins.invisibility.data = -1;
					}
				}
			}
			// 扫描虫群：对邻接目标科技攻击 +1 准度
			if (hasMechSystem(mech, "ms_scanner_swarm")) {
				if (tads.length) {
					for (const tad of tads) {
						const bTok = tadTokenOf(tad);
						const dist = (aTok && bTok) ? tokenDistance(aTok, bTok) : (Number.isFinite(Number(tad?.distance)) ? Number(tad.distance) : null);
						if (dist !== null && dist <= 1) tad.accuracy = (Number(tad.accuracy) || 0) + 1;
					}
				} else {
					const ut0 = Array.from(globalThis.game?.user?.targets ?? [])[0];
					if (aTok && ut0 && (tokenDistance(aTok, ut0) ?? 99) <= 1 && state.data.acc_diff?.base) {
						state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + 1;
					}
				}
			}
			// 黑冰模块 + 系统管理员 II「防火墙」+ 晶眼蝶「超感知」+ 受身 + 指挥官「激励广播」+ 佣兵「高效杀手」+ NPC 固化目标 / 要塞 / 科技脆弱
			const attackerIsMerc = hasNpcFeature(state.actor, ["npcf_cn_mercenary_4", "npcf_efficient_killer_mercenary"], ["高效杀手"]);
			const targetEntries = tads.length
				? tads.map(tad => ({ tad, tok: tadTokenOf(tad), actor: tadActorOf(tad) }))
				: Array.from(globalThis.game?.user?.targets ?? []).map(tok => ({ tad: null, tok, actor: tok?.actor ?? resolveActor(tok?.document?.uuid ?? tok?.uuid) }));
			const blackIceSnapshots = [];
			for (const entry of targetEntries) {
				const defActor = entry.actor;
				if (!defActor) continue;
				const defCs = getCombatState(defActor);
				let addDiff = 0;
				let addAcc = 0;
				if (defCs.sysopFirewall) addDiff += 1;
				if (mechFrameLid(defActor) === "mf_amber_phantom" && defCs.amberPrecog) addDiff += 1;
				if (defCs.bracedUntilTurnEnd || defActor.getFlag?.(MODULE_ID, "braced")) addDiff += 1;
				addDiff += commanderAuraBonuses(defActor, entry.tok).broadcastTechDiff;
				if (hasNpcFeature(defActor, ["npcf_cn_veteran_8", "npcf_cn_exotic_2", "npcf_hardened_target_veteran", "npcf_hardened_target_exotic"], ["固化目标"])) addDiff += 1;
				if (hasNpcFeature(defActor, ["npcf_cn_ultra_22", "npcf_fortress_ultra"], ["要塞"])) addDiff += 3;
				if (hasNpcFeature(defActor, ["npcf_cn_rpv_3", "npcf_tech_vulnerability_rpv"], ["科技脆弱"])) addAcc += 1;
				if (attackerIsMerc && ((Number(defActor.system?.structure?.max) || 0) <= 0 || Number(defActor.system?.structure?.value) <= 2)) addAcc += 1;
				let blackIceHolder = hasMechSystem(defActor, "ms_black_ice_module") ? defActor : null;
				if (!blackIceHolder && entry.tok) {
					const defDisp = entry.tok.document?.disposition ?? 1;
					const adjAlly = (globalThis.canvas?.tokens?.placeables ?? []).find(tok =>
						tok !== entry.tok
						&& tok.actor
						&& (tok.document?.disposition ?? 1) === defDisp
						&& (tokenDistance(entry.tok, tok) ?? 99) <= 1
						&& hasMechSystem(tok.actor, "ms_black_ice_module"),
					);
					if (adjAlly) blackIceHolder = adjAlly.actor;
				}
				if (blackIceHolder) {
					const prevIce = Number(getCombatState(blackIceHolder).blackIceStacks) || 0;
					const nextIce = prevIce >= 3 ? 1 : prevIce + 1;
					addDiff += nextIce;
					blackIceSnapshots.push({ holder: blackIceHolder, prevIce });
					await patchCombatStateCompat(blackIceHolder, { blackIceStacks: nextIce });
				}
				if (addDiff > 0) {
					if (entry.tad) entry.tad.difficulty = (Number(entry.tad.difficulty) || 0) + addDiff;
					else if (state.data.acc_diff?.base) state.data.acc_diff.base.difficulty = (Number(state.data.acc_diff.base.difficulty) || 0) + addDiff;
				}
				if (addAcc > 0) {
					if (entry.tad) entry.tad.accuracy = (Number(entry.tad.accuracy) || 0) + addAcc;
					else if (state.data.acc_diff?.base) state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + addAcc;
				}
			}
			state.data._lancerCnProcessedTargetUuids = new Set(tads.map(tadUuidOf).filter(Boolean));
			if (blackIceSnapshots.length) {
				state.data._lancerCnAtkRollback = {
					...(state.data._lancerCnAtkRollback ?? {}),
					blackIceSnapshots,
				};
			}
		}
		return ok;
	});

	for (const abortStep of ["checkItemDestroyed", "checkWeaponLoaded", "checkItemLimited", "checkItemCharged", "showAttackHUD"]) {
		wrap(abortStep, async (orig, state, options) => {
			if (abortStep === "showAttackHUD") {
				refreshTargetPanel();
				globalThis.setTimeout?.(() => refreshTargetPanel(), 120);
			}
			const ok = await orig(state, options);
			if (ok === false) await rollbackAttackFlowState(state);
			return ok;
		});
	}

	// 0c-1b. 攻击标签补全：确保猎人 II「匕首戏法」赋予的「投掷 5」同步写入攻击卡标签栏
	wrap("setAttackTags", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (ok !== false && state?.item && Array.isArray(state?.data?.tags)) {
			const tv = weaponThrownVal(state.item, state.actor);
			if (tv > 0) {
				state.data.tags = upsertThrownTagInArray([...state.data.tags], tv, state.item);
			}
		}
		return ok;
	});

	// 0c-2. 科技攻击卡输出拦截：精准记录选中的单一入侵 / 快速科技动作名与正文，隔离多选项入侵系统
	wrap("printTechAttackCard", async (orig, state, options) => {
		pendingTechActionMeta = {
			actorUuid: state?.actor?.uuid ?? null,
			itemUuid: state?.item?.uuid ?? null,
			title: String(state?.data?.title ?? ""),
			actionName: String(state?.data?.action?.name ?? state?.data?.title ?? ""),
			effect: String(state?.data?.effect ?? state?.data?.action?.detail ?? ""),
			invade: Boolean(state?.data?.invade),
		};
		try { return await orig(state, options); }
		finally { pendingTechActionMeta = null; }
	});

	wrap("printAttackCard", async (orig, state, options) => {
		const mech = combatMechOf(state?.actor) ?? state?.actor;
		const wasThrown = Boolean(
			state?.item
			&& isMeleeWeaponItem(state.item)
			&& (state?.data?.acc_diff?.weapon?.thrown || state?.data?._lancerCnForceThrown),
		);
		if (wasThrown || state?.data?._lancerCnNoBonusDamage || state?.data?._lancerCnWanderingFar || state?.data?._lancerCnOverwatchAttack) {
			pendingWeaponAttackFlags = {
				...(pendingWeaponAttackFlags ?? { actorUuid: state?.actor?.uuid ?? mech?.uuid }),
				...(wasThrown ? { thrownAttack: true } : {}),
				...(state?.data?._lancerCnNoBonusDamage ? { noBonusDamage: true } : {}),
				...(wasThrown && state?.data?._lancerCnWanderingFar ? { wanderingBladeThrownFar: true } : {}),
				...(state?.data?._lancerCnOverwatchAttack ? { overwatchAttack: true } : {}),
			};
		}
		try { return await orig(state, options); }
		finally {
			pendingWeaponAttackFlags = null;
			pendingDisdainfulBlade = null;
			pendingOverwatchAttack = null;
		}
	});

	// 0c-3. 伤害卡输出拦截：透传攻击者、武器规格、范围属性、灭世成吉思汗 TBK 无视抗性及燃烧跳字标记，供伤害预览与结算使用
	wrap("printDamageCard", async (orig, state, options) => {
		const attacker = state?.actor ?? null;
		const item = state?.item ?? null;
		const mech = combatMechOf(attacker) ?? attacker;
		const isBurnTick = Boolean(state?.data?.add_burn === false && Array.isArray(state?.data?.damage) && state.data.damage.length === 1 && state.data.damage[0]?.type === "Burn");
		const ranges = item ? (weaponProfileOf(item)?.range ?? []) : [];
		const isAoe = Boolean(
			ranges.some(r => ["Cone", "Line", "Burst", "Blast"].includes(r?.type))
			|| ((state?.data?.targets?.length ?? 0) > 1),
		);
		let weaponSize = item?.system?.size ?? null;
		if (!weaponSize && (item?.type === "npc_feature" || item?.is_npc_feature?.())) {
			const wt = String(item?.system?.weapon_type ?? "");
			if (/Auxiliary|副/i.test(wt)) weaponSize = "Auxiliary";
			else if (/Superheavy|超重/i.test(wt)) weaponSize = "Superheavy";
			else if (/Heavy|重/i.test(wt)) weaponSize = "Heavy";
			else if (/Main|主/i.test(wt)) weaponSize = "Main";
		}
		const halfUuids = Array.isArray(state?.data?.lancerCnHalfUuids) && state.data.lancerCnHalfUuids.length
			? [...state.data.lancerCnHalfUuids]
			: undefined;
		const zeroUuids = Array.isArray(state?.data?.lancerCnZeroUuids) && state.data.lancerCnZeroUuids.length
			? [...state.data.lancerCnZeroUuids]
			: undefined;
		const jockeyGiantSlayerFinisher = Boolean(state?.data?.lancerCnJockeyFinisher || pendingJockeyFinisher) || undefined;
		pendingDamageCardCtx = {
			attackerUuid: preferredTargetUuid(attacker) ?? attacker?.uuid ?? null,
			itemUuid: item?.uuid ?? null,
			weaponSize,
			ignoreBurnHeatResist: mechFrameLid(mech) === "mf_genghis_alt_worldkiller_genghis_mk_i",
			isBurnTick,
			isAoe,
			...(halfUuids ? { halfUuids } : {}),
			...(zeroUuids ? { zeroUuids } : {}),
			...(jockeyGiantSlayerFinisher ? { jockeyGiantSlayerFinisher } : {}),
		};
		try { return await orig(state, options); }
		finally { pendingDamageCardCtx = null; }
	});

	// 0d. 攻击掷骰拦截：补齐面板选敌目标条件修正 + 碎头集群导弹 + 天生优越 + 佩玛达折光棱镜 + 18+ 会心 + 虎爪警杖 + 戈尔贡「转移性麻痹」+ 记录天然 20
	wrap("rollAttacks", async (orig, state, options) => {
		const mech = combatMechOf(state?.actor) ?? state?.actor;
		const wLid = weaponLidOf(state?.item);
		if (state?.data?.acc_diff && Array.isArray(state.data.acc_diff.targets) && state.data.acc_diff.targets.length) {
			const seen = state.data._lancerCnProcessedTargetUuids instanceof Set ? state.data._lancerCnProcessedTargetUuids : new Set();
			const aTok = attackerToken(mech);
			const isTechAtk = state.data.attack_type === "Tech";
			const isMeleeAtk = !isTechAtk && (state.item ? isMeleeWeaponItem(state.item) : state.data.attack_type === "Melee");
			const isRangedAtk = !isTechAtk && (state.item ? isRangedWeaponItem(state.item) : state.data.attack_type === "Ranged");
			const benefitsTalent = itemBenefitsFromTalents(state.item);
			const benefitsCb = itemBenefitsFromCoreBonuses(state.item);
			const attackerIsMerc = hasNpcFeature(state.actor, ["npcf_cn_mercenary_4", "npcf_efficient_killer_mercenary"], ["高效杀手"]);
			const ultraSight = hasNpcFeature(state.actor, ["npcf_cn_ultra_26", "npcf_sight_ultra"], ["视域"]);
			const vetFaint = !ultraSight && hasNpcFeature(state.actor, ["npcf_cn_veteran_12", "npcf_feint_veteran", "npcf_faint_signal_veteran"], ["微弱信号"]);
			for (let ti = 0; ti < state.data.acc_diff.targets.length; ti++) {
				const tad = state.data.acc_diff.targets[ti];
				const bTok = tadTokenOf(tad);
				const tUuid = tadUuidOf(tad);
				if (tUuid && seen.has(tUuid)) continue;
				if (tUuid) seen.add(tUuid);
				const dAct = bTok?.actor ?? resolveActor(tUuid);
				const dist = (aTok && bTok) ? tokenDistance(aTok, bTok) : (Number.isFinite(Number(tad?.distance)) ? Number(tad.distance) : null);
				if (isTechAtk) {
					if ((state.actor?._lancerCnWidePulse || ultraSight || (vetFaint && dist !== null && dist <= 3)) && tad?.plugins?.invisibility) {
						tad.plugins.invisibility.data = -1;
					}
					if (hasMechSystem(mech, "ms_scanner_swarm") && dist !== null && dist <= 1) {
						tad.accuracy = (Number(tad.accuracy) || 0) + 1;
					}
					if (dAct) {
						const defCs = getCombatState(dAct);
						let addDiff = 0;
						let addAcc = 0;
						if (defCs.sysopFirewall) addDiff += 1;
						if (mechFrameLid(dAct) === "mf_amber_phantom" && defCs.amberPrecog) addDiff += 1;
						if (defCs.bracedUntilTurnEnd || dAct.getFlag?.(MODULE_ID, "braced")) addDiff += 1;
						addDiff += commanderAuraBonuses(dAct, bTok).broadcastTechDiff;
						if (hasNpcFeature(dAct, ["npcf_cn_veteran_8", "npcf_cn_exotic_2", "npcf_hardened_target_veteran", "npcf_hardened_target_exotic"], ["固化目标"])) addDiff += 1;
						if (hasNpcFeature(dAct, ["npcf_cn_ultra_22", "npcf_fortress_ultra"], ["要塞"])) addDiff += 3;
						if (hasNpcFeature(dAct, ["npcf_cn_rpv_3", "npcf_tech_vulnerability_rpv"], ["科技脆弱"])) addAcc += 1;
						if (attackerIsMerc && ((Number(dAct.system?.structure?.max) || 0) <= 0 || Number(dAct.system?.structure?.value) <= 2)) addAcc += 1;
						let blackIceHolder = hasMechSystem(dAct, "ms_black_ice_module") ? dAct : null;
						if (!blackIceHolder && bTok) {
							const defDisp = bTok.document?.disposition ?? 1;
							const adjAlly = (globalThis.canvas?.tokens?.placeables ?? []).find(tok =>
								tok !== bTok && tok.actor && (tok.document?.disposition ?? 1) === defDisp && (tokenDistance(bTok, tok) ?? 99) <= 1 && hasMechSystem(tok.actor, "ms_black_ice_module"),
							);
							if (adjAlly) blackIceHolder = adjAlly.actor;
						}
						if (blackIceHolder) {
							const prevIce = Number(getCombatState(blackIceHolder).blackIceStacks) || 0;
							const nextIce = prevIce >= 3 ? 1 : prevIce + 1;
							addDiff += nextIce;
							await patchCombatStateCompat(blackIceHolder, { blackIceStacks: nextIce });
						}
						if (addDiff > 0) tad.difficulty = (Number(tad.difficulty) || 0) + addDiff;
						if (addAcc > 0) tad.accuracy = (Number(tad.accuracy) || 0) + addAcc;
					}
				} else {
					if (state.data._lancerCnIgnoreCover) tad.cover = 0;
					if (state.data._lancerCnPhaseReady && tad?.plugins?.invisibility) tad.plugins.invisibility.data = 1;
					if ((ultraSight || (vetFaint && dist !== null && dist <= 3)) && tad?.plugins?.invisibility) tad.plugins.invisibility.data = -1;
					if (benefitsTalent && weaponHasType(state.item, "CQB") && talentRank(mech, "t_vanguard") >= 1 && dist !== null && dist <= 3) {
						tad.accuracy = (Number(tad.accuracy) || 0) + 1;
						if (talentRank(mech, "t_vanguard") >= 2) tad.cover = 0;
					}
					if ((state.actor?.type === "npc" || state.actor?.is_npc?.()) && attackerIsMerc && dAct && ((Number(dAct.system?.structure?.max) || 0) <= 0 || Number(dAct.system?.structure?.value) <= 2)) {
						tad.accuracy = (Number(tad.accuracy) || 0) + 1;
						pendingWeaponAttackFlags = { ...(pendingWeaponAttackFlags ?? { actorUuid: state.actor?.uuid ?? mech?.uuid }), ap: true };
					}
					if (dAct) {
						const dLid = mechFrameLid(dAct);
						const dCs = getCombatState(dAct);
						let extraDiff = 0;
						if (dLid === "mf_amber_phantom" && dCs.amberPrecog) extraDiff += 1;
						if (dCs.bracedUntilTurnEnd || dAct.getFlag?.(MODULE_ID, "braced")) extraDiff += 1;
						if (state.data._lancerCnOverwatchAttack && hasNpcFeature(dAct, ["npcf_x_tws_1_2"], ["冲锋在前，撤退在后"])) extraDiff += 1;
						if ((dLid === "mf_metalmark" || dLid === "mf_balor_alt_hecatoncheires") && isRangedAtk && !state.data._lancerCnIgnoreCover && !state.data.acc_diff?.weapon?.seeking && Number(tad.cover) === 1) {
							extraDiff += 1;
						}
						if (extraDiff > 0) tad.difficulty = (Number(tad.difficulty) || 0) + extraDiff;
					}
					if (!state.data._lancerCnHadInitialTarget && ti === 0 && dAct && state.data.acc_diff.base) {
						state.data._lancerCnHadInitialTarget = true;
						const csNow = getCombatState(mech);
						let lateAcc = 0;
						const lateCsPatch = {};
						if (isMeleeAtk && talentRank(mech, "t_brawler") >= 1) {
							const gp = findActiveGrappleFor(mech);
							const grappledTogether = gp
								? (sameActorRef(gp.gs.attackerUuid, tUuid ?? dAct) || sameActorRef(gp.gs.defenderUuid, tUuid ?? dAct))
								: Boolean(mech?.statuses?.has?.("grappled") && dAct.statuses?.has?.("grappled"));
							if (grappledTogether) lateAcc += 1;
						}
						if (benefitsTalent && isMeleeAtk && talentRank(mech, "t_pankrati") >= 1 && (dAct.statuses?.has?.("immobilized") || dAct.statuses?.has?.("slow"))) {
							lateAcc += 1;
						}
						if (benefitsTalent && talentRank(mech, "t_combined_arms") >= 3 && csNow.stormOfViolenceLast) {
							const wantMatch = (csNow.stormOfViolenceLast === "melee" && isRangedAtk) || (csNow.stormOfViolenceLast === "ranged" && isMeleeAtk);
							if (wantMatch && (!csNow.stormOfViolenceTargetUuid || sameActorRef(csNow.stormOfViolenceTargetUuid, tUuid ?? dAct))) {
								lateAcc += 1;
								lateCsPatch.stormOfViolenceLast = null;
								lateCsPatch.stormOfViolenceTargetUuid = null;
							}
						}
						if (benefitsTalent && isRangedAtk && talentRank(mech, "t_tactician") >= 2 && !csNow.usedTacticianSolar && aTok && bTok) {
							const attElev = Number(aTok.document?.elevation ?? aTok.elevation ?? 0);
							const defElev = Number(bTok.document?.elevation ?? bTok.elevation ?? 0);
							if (attElev > defElev) {
								lateAcc += 1;
								lateCsPatch.usedTacticianSolar = true;
							}
						}
						if (benefitsCb && isMeleeAtk && csNow.tomorrowsThoughtTargetUuid && sameActorRef(csNow.tomorrowsThoughtTargetUuid, tUuid ?? dAct)) {
							lateAcc += 1;
						}
						if (lateAcc > 0) state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + lateAcc;
						if (Object.keys(lateCsPatch).length && mech?.isOwner) await setCombatState(mech, lateCsPatch);
					}
				}
			}
			state.data._lancerCnProcessedTargetUuids = seen;
		}
		if (wLid === "mw_ch_wandering_blade" && state?.data?.acc_diff?.weapon) {
			const aTok = attackerToken(mech);
			const tads = state.data.acc_diff.targets ?? [];
			const tokList = tads.length ? tads.map(tadTokenOf).filter(Boolean) : Array.from(globalThis.game?.user?.targets ?? []);
			const dists = tokList.map(bTok => (aTok && bTok) ? tokenDistance(aTok, bTok) : null).filter(d => d !== null && Number.isFinite(d));
			const farThrow = Boolean(state.data.acc_diff.weapon.thrown && (dists.length === 0 || dists.some(d => d > 1)));
			state.data.acc_diff.weapon.seeking = farThrow;
			state.data._lancerCnWanderingFar = farThrow;
		}
		if (wLid === "mw_shatterhead_colony_missiles" && state?.data?.acc_diff) {
			if (state.data.acc_diff.base) state.data.acc_diff.base.difficulty = 0;
			if (state.data.acc_diff.weapon) {
				state.data.acc_diff.weapon.inaccurate = false;
				state.data.acc_diff.weapon.engaged = false;
			}
			for (const tad of state.data.acc_diff.targets ?? []) {
				tad.difficulty = 0;
				tad.cover = 0;
			}
		} else if (state?.data?.acc_diff?.weapon && ((itemBenefitsFromTalents(state?.item) && talentRank(mech, "t_combined_arms") >= 2) || wLid === "mw_bristlecrown_flechette_launcher" || wLid === "mw_ch_typhoon")) {
			state.data.acc_diff.weapon.engaged = false;
		}
		if (state?.data?.attack_type === "Ranged" && Array.isArray(state.data.acc_diff?.targets) && wLid !== "mw_shatterhead_colony_missiles") {
			for (const tad of state.data.acc_diff.targets) {
				const tActor = tadActorOf(tad);
				if (!isCoreActiveOn(tActor, "mf_ch_pemada")) continue;
				const netAcc = Number.isFinite(Number(tad.total))
					? Number(tad.total)
					: ((Number(tad.accuracy) || 0) - (Number(tad.difficulty) || 0));
				if (netAcc > 0) {
					tad.difficulty = (Number(tad.difficulty) || 0) + netAcc;
					if (Object.getOwnPropertyDescriptor(tad, "total")?.writable) tad.total = 0;
				}
			}
		}

		const maskImpaired = Boolean(
			(wLid === "mw_shatterhead_colony_missiles" || hasCoreBonus(mech, "cb_superior_by_design"))
			&& state?.actor?.system?.statuses?.impaired,
		);
		if (maskImpaired) state.actor.system.statuses.impaired = false;
		let ok;
		try { ok = await orig(state, options); }
		finally { if (maskImpaired) state.actor.system.statuses.impaired = true; }

		if (ok !== false && Array.isArray(state?.data?.hit_results)) {
			const crit18 = Boolean(
				state?.actor?._lancerCnCrit18
				|| (isCoreActiveOn(mech, "mf_ext_oleander") && isHeavyRangedWeapon(state?.item))
				|| (state?.data?.attack_type !== "Tech" && itemBenefitsFromCoreBonuses(state?.item) && hasCoreBonus(mech, "cb_kkca_oath_of_excellence")),
			);
			const nat20Uuids = [];
			const gorgonTargets = [];
			for (let idx = 0; idx < state.data.hit_results.length; idx++) {
				const hr = state.data.hit_results[idx];
				const tot = Number(hr?.total);
				const atkRoll = state.data.attack_results?.[idx]?.roll ?? hr?.roll;
				const tActor = hr?.target?.actor ?? resolveActor(hr?.target?.document?.uuid ?? hr?.target?.uuid);

				// 戈尔贡「转移性麻痹」：针对戈尔贡的攻击掷出天然 1–2 时自动失手，且攻击者陷入晕眩直到其下一回合结束
				if (mechFrameLid(tActor) === "mf_gorgon") {
					const natFace = rollNatD20(atkRoll);
					const isGorgon12 = natFace !== null ? (natFace === 1 || natFace === 2) : (Number.isFinite(tot) && (tot === 1 || tot === 2));
					if (isGorgon12) {
						hr.hit = false;
						hr.crit = false;
						gorgonTargets.push(tActor);
						continue;
					}
				}
				if (crit18 && Number.isFinite(tot) && tot >= 18) {
					hr.hit = true;
					hr.crit = true;
					state.data.has_crit_hit = true;
				}
				// 虎爪警杖：对伏卧、固定或晕眩目标未命中时改为命中
				if (wLid === "mw_kkca_tiger_claw_baton" && !hr.hit && !hr.crit) {
					if (tActor?.statuses?.has?.("prone") || tActor?.statuses?.has?.("immobilized") || tActor?.statuses?.has?.("stunned")) {
						hr.hit = true;
						state.data.has_normal_hit = true;
					}
				}
				if (hr?.crit && rollHasNat20(atkRoll)) {
					hr._lancerCnNat20 = true;
					const u = hr.target?.document?.uuid ?? hr.target?.uuid;
					if (u) nat20Uuids.push(u);
				}
			}
			if (gorgonTargets.length) {
				state.data.has_normal_hit = state.data.hit_results.some(h => h?.hit && !h?.crit);
				state.data.has_crit_hit = state.data.hit_results.some(h => h?.crit);
				if (state.actor && getSetting("autoApplyStatus", true)) {
					const attUuid = preferredTargetUuid(state.actor) ?? state.actor.uuid;
					await setActorStatus(attUuid, "stunned", true);
					const gName = gorgonTargets[0]?.token?.name ?? gorgonTargets[0]?.name ?? "戈尔贡";
					await postCpEffectCard(
						gorgonTargets[0],
						"戈尔贡 · 转移性麻痹触发",
						`<p>针对 <b>${escHtml(gName)}</b> 的攻击掷出 1–2，触发<b>转移性麻痹</b>：攻击自动失手，且攻击者 <b>${escHtml(state.actor.token?.name ?? state.actor.name)}</b> 陷入<b>晕眩</b>直到其下一回合结束！</p>`,
					);
				}
			}
			if (nat20Uuids.length) {
				pendingWeaponAttackFlags = {
					...(pendingWeaponAttackFlags ?? { actorUuid: state.actor?.uuid ?? mech?.uuid }),
					nat20Uuids,
				};
			}
		}
		return ok;
	});

	// 0e. 伤害标签与条件额外伤害预填（兼容非 Weapon 类型的 NPC 特性与 NPC 武器 tier_override 对齐 tg_reliable，并立即固化豁免减半/免伤标记防止超时丢失）
	wrap("setDamageTags", async (orig, state, options) => {
		if (state?.data) {
			if (pendingHalfUuids?.length) {
				state.data.lancerCnHalfUuids = [...new Set([...(state.data.lancerCnHalfUuids ?? []), ...pendingHalfUuids])];
				pendingHalfUuids = null;
			}
			if (pendingZeroUuids?.length) {
				state.data.lancerCnZeroUuids = [...new Set([...(state.data.lancerCnZeroUuids ?? []), ...pendingZeroUuids])];
				pendingZeroUuids = null;
			}
			if (pendingDamageMod && !state.data.lancerCnDamageMod) {
				state.data.lancerCnDamageMod = { ...pendingDamageMod };
				pendingDamageMod = null;
			}
		}
		const isNonWeaponNpcFeat = Boolean(
			state?.item
			&& (state.item.type === "npc_feature" || state.item.is_npc_feature?.())
			&& state.item.system?.type !== "Weapon",
		);
		let ok;
		if (isNonWeaponNpcFeat) {
			if (state.data) {
				const tags = Array.isArray(state.item.system?.tags) ? state.item.system.tags : [];
				state.data.tags = tags;
				state.data.ap = Boolean(state.data.ap || tags.some(t => t?.is_ap || t?.lid === "tg_ap"));
				state.data.overkill = Boolean(state.data.overkill || tags.some(t => t?.is_overkill || t?.lid === "tg_overkill"));
				const relTag = tags.find(t => t?.is_reliable || t?.lid === "tg_reliable");
				if (relTag) {
					const tier = Math.min(3, Math.max(1, Number(state.item.system?.tier_override) || Number(state.actor?.system?.tier) || 1));
					const relVal = parseInt(typeof relTag.tierVal === "function" ? relTag.tierVal(tier) : relTag.val, 10) || 0;
					if (relVal > 0) {
						state.data.reliable = true;
						state.data.reliable_val = relVal;
					}
				}
			}
			ok = true;
		} else {
			const tierOv = (state?.item && (state.item.type === "npc_feature" || state.item.is_npc_feature?.()))
				? (Number(state.item.system?.tier_override) || 0)
				: 0;
			const savedActorTier = tierOv > 0 ? state?.actor?.system?.tier : undefined;
			if (tierOv > 0 && state?.actor?.system) {
				state.actor.system.tier = Math.min(3, Math.max(1, tierOv));
			}
			try { ok = await orig(state, options); }
			finally {
				if (tierOv > 0 && state?.actor?.system) state.actor.system.tier = savedActorTier;
			}
		}
		if (ok !== false) {
			applyDamageModToState(state);
			await injectDamageFlowBonuses(state);
		}
		return ok;
	});

	// 0f. 伤害 HUD 预览时临时映射武器基础伤害（机甲/驾驶员武器一维 damage 转换；NPC 武器保持三维层级二维数组并对齐 tier_override），退出时无损还原物品数据
	wrap("showDamageHUD", async (orig, state, options) => {
		const item = state?.item ?? null;
		const profile = item ? weaponProfileOf(item) : null;
		const isNpcFeat = Boolean(item && (item.type === "npc_feature" || item.is_npc_feature?.() || Array.isArray(profile?.damage?.[0])));
		if (isNpcFeat) {
			const savedNpcTiers = Array.isArray(item.system?.damage) ? item.system.damage : null;
			const tierOv = Number(item.system?.tier_override) || 0;
			const savedActorTier = tierOv > 0 ? state?.actor?.system?.tier : undefined;
			applyDamageModToState(state);
			if (tierOv > 0 && state?.actor?.system) {
				state.actor.system.tier = Math.min(3, Math.max(1, tierOv));
			}
			if (savedNpcTiers && item.system?.type === "Weapon") {
				const actorTierIdx = Math.min(2, Math.max(0, (Number(state.actor?.system?.tier) || 1) - 1));
				const effTierIdx = Math.min(2, Math.max(0, (tierOv || Number(state.actor?.system?.tier) || 1) - 1));
				const chosenTierDmg = Array.isArray(savedNpcTiers[effTierIdx]) && savedNpcTiers[effTierIdx].length
					? savedNpcTiers[effTierIdx]
					: (savedNpcTiers.find(arr => Array.isArray(arr) && arr.length) ?? []);
				item.system.damage = [0, 1, 2].map(i => (i === actorTierIdx ? chosenTierDmg : (Array.isArray(savedNpcTiers[i]) ? savedNpcTiers[i] : chosenTierDmg)));
			}
			if (state?.data) state.data._lancerCnHudDmgSynced = true;
			try {
				const okHud = await orig(state, options);
				if (okHud === false) await rollbackDamageFlowState(state);
				return okHud;
			} finally {
				if (item?.system && savedNpcTiers) item.system.damage = savedNpcTiers;
				if (tierOv > 0 && state?.actor?.system) state.actor.system.tier = savedActorTier;
			}
		}
		const savedDmg = Array.isArray(profile?.damage) ? profile.damage : null;
		const savedBonus = Array.isArray(profile?.bonus_damage) ? profile.bonus_damage : null;
		const mod = applyDamageModToState(state);
		if (savedDmg) {
			profile.damage = transformWeaponBaseDamage(savedDmg, state);
			if (mod?.noBonusDamage && savedBonus) {
				profile.bonus_damage = [];
			} else if ((mod?.walkingArmoryAmmo === "hellfire" || state?.data?._lancerCnBonusToBurn) && savedBonus) {
				profile.bonus_damage = savedBonus.map(b => (b.type === "Heat" ? b : { ...b, type: "Burn" }));
			}
			if (state?.data) state.data._lancerCnHudDmgSynced = true;
		}
		try {
			const okHud = await orig(state, options);
			if (okHud === false) await rollbackDamageFlowState(state);
			return okHud;
		} finally {
			if (profile && savedDmg) profile.damage = savedDmg;
			if (profile && savedBonus) profile.bonus_damage = savedBonus;
		}
	});

	// 1. 豁免成功减半 / 低等兵「无用之人」豁免成功免伤 + CP / 武器改装保底伤害与伤害类型同步
	wrap("rollReliable", async (orig, state, options) => {
		const mod = applyDamageModToState(state);
		await injectDamageFlowBonuses(state);
		if (mod?.crackShotZeroIn && state?.data && !state.data._lancerCnZeroInInjected) {
			const nowHasCrit = Boolean(
				state.data.has_crit_hit
				|| state.data.damage_hud_data?.targets?.some?.(ht => Number(ht?.quality) === 2),
			);
			if (nowHasCrit) {
				const zType = (mod.walkingArmoryAmmo === "hellfire" || state.data._lancerCnBonusToBurn)
					? "Burn"
					: (state.data._lancerCnZeroInBaseType || state.data.damage?.[0]?.type || "Kinetic");
				const zEntry = { type: zType, val: "1d6" };
				state.data.bonus_damage = [...(state.data.bonus_damage ?? []), zEntry];
				if (Array.isArray(state.data.damage_hud_data?.base?.bonusDamage)) {
					state.data.damage_hud_data.base.bonusDamage = [...state.data.damage_hud_data.base.bonusDamage, zEntry];
				}
				state.data._lancerCnZeroInInjected = true;
			}
		}
		if (state?.data && !state.data._lancerCnHudDmgSynced) {
			if (Array.isArray(state.data.damage_hud_data?.weapon?.damage)) {
				state.data.damage_hud_data.weapon.damage = transformWeaponBaseDamage(state.data.damage_hud_data.weapon.damage, state);
			}
			if (Array.isArray(state.data.damage) && state.data.damage.length) {
				state.data.damage = transformWeaponBaseDamage(state.data.damage, state);
			}
			if (mod?.walkingArmoryAmmo === "hellfire" || state.data._lancerCnBonusToBurn) {
				if (Array.isArray(state.data.damage_hud_data?.weapon?.bonusDamage)) {
					state.data.damage_hud_data.weapon.bonusDamage = state.data.damage_hud_data.weapon.bonusDamage.map(b => (b.type === "Heat" ? b : { ...b, type: "Burn" }));
				}
				if (Array.isArray(state.data.damage_hud_data?.base?.bonusDamage)) {
					state.data.damage_hud_data.base.bonusDamage = state.data.damage_hud_data.base.bonusDamage.map(b => (b.type === "Heat" ? b : { ...b, type: "Burn" }));
				}
			}
			state.data._lancerCnHudDmgSynced = true;
		}
		const halfUuids = state?.data?.lancerCnHalfUuids ?? pendingHalfUuids;
		if (halfUuids?.length && state?.data?.damage_hud_data?.targets) {
			for (const ht of state.data.damage_hud_data.targets) {
				if (halfUuids.some(u => u === ht.targetUuid || sameActorRef(u, ht.targetUuid))) ht.halfDamage = true;
			}
			pendingHalfUuids = null;
		}
		if (pendingZeroUuids?.length && state?.data) {
			state.data.lancerCnZeroUuids = [...new Set([...(state.data.lancerCnZeroUuids ?? []), ...pendingZeroUuids])];
			pendingZeroUuids = null;
		}
		return orig(state, options);
	});

	// 1b. 普通命中伤害扩展：作战用钻机对伏卧/固定/晕眩目标杀绝连锁 +1d6 + 低等兵「无用之人」豁免成功归零
	wrap("rollNormalDamage", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (ok !== false && state?.data) {
			await rollCombatDrillOverkillChain(state, "damage_results", false);
			zeroGruntChaffTargets(state);
		}
		return ok;
	});

	// 2. 会心伤害扩展：NPC「致命 / 额外致命(1/回合) / 分裂弹 / 致命精度」+ 夹竹桃蛾会心离散 + 鬼面蛾「死印」+ 变频剑 +1d6 + 作战用钻机连锁 + 残酷 I 天然 20 满伤
	wrap("rollCritDamage", async (orig, state, options) => {
		const hadCrit = Boolean(state?.data?.has_crit_hit);
		const isNpc = Boolean(state?.actor && (state.actor.type === "npc" || state.actor.is_npc?.()));
		const dmgMod = applyDamageModToState(state);
		pendingDamageMod = null;
		const ok = await orig(state, options);
		if (!ok) return ok;
		if (!hadCrit) {
			zeroGruntChaffTargets(state);
			return ok;
		}

		if (isNpc) {
			const npcTier = Math.min(3, Math.max(1, Number(state.actor.system?.tier) || 1));
			const willUseExtraDeadly = npcTier >= 2 && hasUnusedUltraExtraDeadly(state.actor);
			const dice = countNpcDeadlyDice(state.actor);
			if (willUseExtraDeadly && state.actor.isOwner) {
				await setCombatState(state.actor, { usedUltraExtraDeadly: true });
			}
			const splinterFlat = hasNpcFeature(state.actor, ["npcf_cn_pirate_4", "npcf_splinter_rounds_pirate"], ["分裂弹"]) ? 3 : 0;
			const specOpFlat = hasNpcFeature(state.actor, ["npcf_deadly_precision_spec_op"], ["致命精度"]) ? [2, 3, 3][npcTier - 1] : 0;
			const flatBonusTotal = splinterFlat + specOpFlat;
			if (dice <= 0 && flatBonusTotal <= 0) {
				zeroGruntChaffTargets(state);
				return ok;
			}
			const dType = state.data.crit_damage_results?.[0]?.d_type ?? state.data.damage?.[0]?.type ?? "Kinetic";
			const multiTarget = (state.data.damage_hud_data?.targets?.length ?? 0) > 1;
			let totalBonus = 0;
			if (dice > 0) {
				const roll = new Roll(`${dice}d6`);
				if (state.data.overkill && foundry?.dice?.terms?.Die) {
					roll.terms?.forEach?.(term => {
						if (term instanceof foundry.dice.terms.Die) term.modifiers = ["x1", `kh${term.number}`, ...(term.modifiers ?? [])];
					});
				}
				await roll.evaluate();
				const tt = typeof roll.getTooltip === "function" ? await roll.getTooltip() : "";
				state.data.crit_damage_results = [...(state.data.crit_damage_results ?? []), { roll, tt, d_type: dType, bonus: true }];
				totalBonus += Number(roll.total) || 0;
			}
			if (flatBonusTotal > 0) {
				const flatRoll = await new Roll(String(flatBonusTotal)).evaluate();
				const flatTt = typeof flatRoll.getTooltip === "function" ? await flatRoll.getTooltip() : "";
				state.data.crit_damage_results = [...(state.data.crit_damage_results ?? []), { roll: flatRoll, tt: flatTt, d_type: dType, bonus: true }];
				totalBonus += flatBonusTotal;
			}
			const perTargetBonus = multiTarget ? Math.ceil(totalBonus / 2) : totalBonus;
			for (const t of state.data.targets ?? []) {
				if (!t.crit) continue;
				const added = t.half_damage ? Math.ceil(perTargetBonus / 2) : perTargetBonus;
				t.damage = [...(t.damage ?? []), { type: dType, amount: added }];
			}
			zeroGruntChaffTargets(state);
			return ok;
		}

		const mech = combatMechOf(state?.actor) ?? state?.actor;
		const wLid = weaponLidOf(state?.item);

		// 变频剑 mw_variable_sword（LCP on_crit 为英文）：会心一击额外 +1d6 伤害
		if (wLid === "mw_variable_sword") {
			const dType = (dmgMod?.walkingArmoryAmmo === "hellfire" || state.data._lancerCnBonusToBurn)
				? "Burn"
				: (state.data.crit_damage_results?.[0]?.d_type ?? state.data.damage?.[0]?.type ?? "Kinetic");
			const roll = await new Roll("1d6").evaluate();
			const tt = typeof roll.getTooltip === "function" ? await roll.getTooltip() : "";
			state.data.crit_damage_results = [...(state.data.crit_damage_results ?? []), { roll, tt, d_type: dType, bonus: true }];
			const multiTarget = (state.data.damage_hud_data?.targets?.length ?? 0) > 1;
			const rawBonus = Number(roll.total) || 0;
			const perTargetBonus = multiTarget ? Math.ceil(rawBonus / 2) : rawBonus;
			for (const t of state.data.targets ?? []) {
				if (!t.crit) continue;
				const added = t.half_damage ? Math.ceil(perTargetBonus / 2) : perTargetBonus;
				t.damage = [...(t.damage ?? []), { type: dType, amount: added }];
			}
		}

		const isBrutal1 = Boolean(itemBenefitsFromTalents(state?.item) && talentRank(mech, "t_brutal") >= 1);
		const nat20Set = new Set(dmgMod?.nat20Uuids ?? []);
		if (isBrutal1) {
			for (const hr of state.data.hit_results ?? []) {
				if (hr?._lancerCnNat20) {
					const u = hr.target?.document?.uuid ?? hr.target?.uuid;
					if (u) nat20Set.add(u);
				}
			}
		}
		const critTargetsList = (state.data.targets ?? []).filter(t => t?.crit);
		const allCritsAreNat20Brutal = Boolean(
			isBrutal1
			&& (state.data._lancerCnForceNat20 || (critTargetsList.length > 0 && critTargetsList.every(t => {
				const tUuid = t.target?.document?.uuid ?? t.target?.uuid ?? (typeof t.target === "string" ? t.target : null);
				return Boolean(tUuid && nat20Set.has(tUuid));
			}))),
		);
		if (allCritsAreNat20Brutal && !state.data.has_normal_hit) {
			state.data._lancerCnPureNat20Brutal = true;
		}

		// 作战用钻机 mw_combat_drill：会心时杀绝连锁 +1d6（残酷 I 天然 20 直接取最大伤害时不掷骰，不触发杀绝连锁）
		if (!allCritsAreNat20Brutal) {
			await rollCombatDrillOverkillChain(state, "crit_damage_results", true);
		}

		// 夹竹桃蛾「全系统已上线」：会心目标本次伤害转化为离散（无视护甲与抗性）
		if (dmgMod?.oleanderCritParacausal || (isCoreActiveOn(mech, "mf_ext_oleander") && isHeavyRangedWeapon(state?.item))) {
			for (const t of state.data.targets ?? []) {
				if (t.crit) t.paracausal = true;
			}
		}

		// 鬼面蛾「神经元超速：死印」：对死印目标（距离 > 5 且无掩护）远程会心额外 +1d6（副）/ +2d6（主）/ +3d6（重/超重）
		const markUuid = isCoreActiveOn(mech, "mf_deaths_head") ? getCoreState(mech).markTargetUuid : null;
		const isRanged = state?.item ? isRangedWeaponItem(state.item) : state?.data?.attack_type !== "Melee";
		if (markUuid && isRanged) {
			const sz = state.item?.system?.size;
			const markDice = sz === "Auxiliary" ? 1 : (sz === "Heavy" || sz === "Superheavy") ? 3 : 2;
			const dType = state.data.crit_damage_results?.[0]?.d_type ?? state.data.damage?.[0]?.type ?? "Kinetic";
			const aTok = attackerToken(mech);
			for (const t of state.data.targets ?? []) {
				if (!t.crit) continue;
				const tUuid = t.target?.document?.uuid ?? t.target?.uuid ?? (typeof t.target === "string" ? t.target : null);
				if (!sameActorRef(markUuid, tUuid)) continue;
				const tActor = resolveActor(tUuid);
				if (tActor?.statuses?.has?.("cover_soft") || tActor?.statuses?.has?.("cover_hard")) continue;
				const bTok = t.target?.document ? t.target : (tActor ? attackerToken(tActor) : null);
				const dist = (aTok && bTok) ? tokenDistance(aTok, bTok) : null;
				if (dist !== null && dist <= 5) continue;
				const roll = await new Roll(`${markDice}d6`).evaluate();
				const tt = typeof roll.getTooltip === "function" ? await roll.getTooltip() : "";
				state.data.crit_damage_results = [...(state.data.crit_damage_results ?? []), { roll, tt, d_type: dType, bonus: true }];
				const rawBonus = Number(roll.total) || 0;
				const added = t.half_damage ? Math.ceil(rawBonus / 2) : rawBonus;
				t.damage = [...(t.damage ?? []), { type: dType, amount: added }];
			}
		}

		// 残酷 I「捕食者」：天然 d20 = 20 且会心一击时，全部伤害与额外伤害直接取骰面最大值
		if (isBrutal1) {
			if (nat20Set.size > 0 || state.data._lancerCnForceNat20) {
				const multiTarget = (state.data.damage_hud_data?.targets?.length ?? 0) > 1;
				const critList = state.data.crit_damage_results?.length
					? state.data.crit_damage_results
					: [
						...(state.data.damage ?? []).map(d => ({ d_type: d.type, roll: { formula: d.val }, bonus: false })),
						...(state.data.bonus_damage ?? []).map(d => ({ d_type: d.type, roll: { formula: d.val }, bonus: true })),
					];
				for (const t of state.data.targets ?? []) {
					if (!t.crit) continue;
					const tUuid = t.target?.document?.uuid ?? t.target?.uuid ?? (typeof t.target === "string" ? t.target : null);
					if (!state.data._lancerCnForceNat20 && !(tUuid && nat20Set.has(tUuid))) continue;
					const maxEntries = [];
					for (const dr of critList) {
						const drUuid = dr.target?.document?.uuid ?? dr.target?.uuid ?? null;
						if (drUuid && tUuid && drUuid !== tUuid) continue;
						const maxVal = maxFormulaValue(dr.roll?.formula ?? "");
						if (maxVal <= 0) continue;
						const perTarget = (multiTarget && dr.bonus && !dr.target) ? Math.ceil(maxVal / 2) : maxVal;
						const finalAmt = t.half_damage ? Math.ceil(perTarget / 2) : perTarget;
						maxEntries.push({ type: dr.d_type ?? "Kinetic", amount: finalAmt });
					}
					if (maxEntries.length) t.damage = maxEntries;
				}
			}
		}
		zeroGruntChaffTargets(state);
		return ok;
	});

	wrap("applyOverkillHeat", async (orig, state, options) => {
		if (state?.data?._lancerCnPureNat20Brutal) {
			state.data.overkill_heat = 0;
			return true;
		}
		return orig(state, options);
	});

	// 3. 机甲「稳住阵脚」补完：谢尔曼充能与排热软掩护 + 万寿菊「永恒结构」额外选项 + 低速循环屏蔽罩 + 垃圾佬 + 机油佬 + 适应性反应炉 + 常规清除状况
	wrap("applyStabilizeUpdates", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (!ok || !state?.data) return ok;
		const actor = state.actor;
		const fLid = mechFrameLid(actor);
		if (fLid === "mf_sherman") {
			const gain = isCoreActiveOn(actor, "mf_sherman") ? 2 : 1;
			await syncShermanZf4(actor, Math.min(4, currentShermanZf4(actor) + gain));
			if (actor?.isOwner && getSetting("autoApplyStatus", true)) {
				const selfU = preferredTargetUuid(actor) ?? actor.uuid;
				await setActorStatus(selfU, "cover_soft", true);
				await setCombatState(actor, { shermanVentSoftCover: true });
			}
		}
		if (actor?.isOwner) {
			if (hasCoreBonus(actor, "cb_piof_slow_cycle_shroud")) {
				const curOs = Number(actor.system?.overshield?.value) || 0;
				if (curOs < 4) await actor.update?.({ "system.overshield.value": 4 });
			}
			if (talentRank(actor, "t_ext_junker") >= 1 && (Number(actor.system?.burn) || 0) > 0) {
				await actor.update?.({ "system.burn": 0 });
			}
			// 机油佬 II「机甲羁绊」：稳住阵脚时自动清除全部非自身造成的受损、受扰、固定、缓慢与锁定
			if (talentRank(actor, "t_grease_monkey") >= 2) {
				const selfU = preferredTargetUuid(actor) ?? actor.uuid;
				for (const cid of ["impaired", "jammed", "immobilized", "slow", "lockon"]) {
					if (!actor.statuses?.has?.(cid)) continue;
					if (cid === "immobilized" && (isGrappleImmobilized(selfU) || isCoreSustainedImmobilized(actor) || getCombatState(actor).steadyAim)) continue;
					const cleared = await setActorStatus(selfU, cid, false);
					if (!cleared?.ok && actor.statuses?.has?.(cid)) {
						await actor.toggleStatusEffect?.(cid, { active: false });
					}
				}
			}
			// 核心奖励「适应性反应炉」：选择散热且已受压力伤害、剩余维修 ≥ 2 时提示可在机甲表一键恢复 1 点压力
			if (state.data.option1 === "Cool" && hasCoreBonus(actor, "cb_adaptive_reactor")) {
				const curStress = Number(actor.system?.stress?.value) ?? 4;
				const maxStress = Number(actor.system?.stress?.max) ?? 4;
				const curRep = Number(actor.system?.repairs?.value) || 0;
				if (curStress < maxStress && curRep >= 2) {
					ui?.notifications?.info?.("适应性反应炉：可在机甲表「天赋与核心战术栏」点击「2维修→+1压力」恢复 1 点反应炉压力！");
				}
			}
		}

		const buildClearChoices = mode => {
			if (mode === "ClearOwnCond") {
				const uuid = preferredTargetUuid(actor) ?? actor.uuid;
				return CONDITION_IDS
					.filter(id => actor?.statuses?.has?.(id)
						&& !(id === "shredded" && isUnremovableShredded(actor))
						&& !(id === "immobilized" && (isGrappleImmobilized(uuid) || isCoreSustainedImmobilized(actor) || getCombatState(actor).steadyAim)))
					.map(id => ({ uuid, actorName: actor.name, condId: id, condLabel: ALL_STATUS_LABELS[id] ?? id, buttonLabel: ALL_STATUS_LABELS[id] ?? id }));
			}
			const out = [];
			const selfTok = attackerToken(actor);
			const reach = talentRank(actor, "t_house_guard") >= 1 ? 2 : 1;
			const userTgs = Array.from(game.user?.targets ?? []).filter(t => t !== selfTok && t.actor);
			const pool = userTgs.length
				? userTgs
				: (globalThis.canvas?.tokens?.placeables ?? []).filter(t => t !== selfTok && t.actor && (selfTok ? (tokenDistance(selfTok, t) ?? 99) <= reach : false));
			for (const t of pool) {
				const uuid = t.document?.uuid ?? t.uuid ?? t.actor.uuid;
				for (const id of CONDITION_IDS) {
					if (t.actor.statuses?.has?.(id)
						&& !(id === "shredded" && isUnremovableShredded(t.actor))
						&& !(id === "immobilized" && (isGrappleImmobilized(uuid) || isCoreSustainedImmobilized(t.actor)))) {
						const name = t.name ?? t.actor.name;
						out.push({ uuid, actorName: name, condId: id, condLabel: ALL_STATUS_LABELS[id] ?? id, buttonLabel: `${name}：${ALL_STATUS_LABELS[id] ?? id}` });
					}
				}
			}
			return out;
		};

		const opt2 = state.data.option2;
		if (opt2 === "ClearOwnCond" || opt2 === "ClearOtherCond") {
			const choices = buildClearChoices(opt2);
			const chosen = state.data.lancerCnClearChoice ?? await promptConditionChoice("稳住阵脚 · 选择要清除的状况", choices);
			if (chosen) {
				await setActorStatus(chosen.uuid, chosen.condId, false);
				const note = opt2 === "ClearOwnCond"
					? `已清除自身状况：<b>${escHtml(chosen.condLabel)}</b>。`
					: `已清除 <b>${escHtml(chosen.actorName)}</b> 的状况：<b>${escHtml(chosen.condLabel)}</b>。`;
				state.data.description = String(state.data.description ?? "").replace(/Mech has selected to clear [^<]*Please clear manually\./i, note);
			} else {
				const emptyNote = opt2 === "ClearOwnCond" ? "当前自身没有可清除的状况。" : "未找到带有状况的邻接目标（请先锁定邻接盟友）。";
				state.data.description = String(state.data.description ?? "").replace(/Mech has selected to clear [^<]*Please clear manually\./i, emptyNote);
			}
		}

		// 万寿菊「永恒结构」：稳住阵脚时额外执行一项次要选项（装填 / 清除燃烧 / 清除自身状况 / 清除邻接盟友状况）
		if (fLid === "mf_sherman_alt_tagetes" && actor?.isOwner) {
			const extraOpts = [
				{ key: "Reload", buttonLabel: "重新装填所有装填武器" },
				{ key: "ClearBurn", buttonLabel: "清除全部燃烧标记" },
				{ key: "ClearOwnCond", buttonLabel: "清除自身 1 项状况" },
				{ key: "ClearOtherCond", buttonLabel: "清除邻接盟友 1 项状况" },
			].filter(o => o.key !== opt2);
			const pickedExtra = state.data.lancerCnTagetesExtra
				? { key: state.data.lancerCnTagetesExtra }
				: await promptConditionChoice("万寿菊 · 永恒结构（额外选项）", extraOpts, "请选择「永恒结构」赋予的额外稳住阵脚选项：");
			if (pickedExtra?.key === "Reload") {
				const unloaded = [...(actor.items ?? [])].filter(i => {
					if (!i || (i.type !== "mech_weapon" && !i.is_mech_weapon?.()) || i.system?.destroyed) return false;
					return i.system?.loaded === false;
				});
				for (const w of unloaded) await w.update?.({ "system.loaded": true });
				state.data.description = `${state.data.description ?? ""}<p><b>永恒结构</b>：已额外重新装填所有装填武器。</p>`;
			} else if (pickedExtra?.key === "ClearBurn") {
				if ((Number(actor.system?.burn) || 0) > 0) await actor.update?.({ "system.burn": 0 });
				state.data.description = `${state.data.description ?? ""}<p><b>永恒结构</b>：已额外清除所有燃烧标记。</p>`;
			} else if (pickedExtra?.key === "ClearOwnCond" || pickedExtra?.key === "ClearOtherCond") {
				const extraChoices = buildClearChoices(pickedExtra.key);
				const c2 = await promptConditionChoice("永恒结构 · 选择要清除的状况", extraChoices);
				if (c2) {
					await setActorStatus(c2.uuid, c2.condId, false);
					state.data.description = `${state.data.description ?? ""}<p><b>永恒结构</b>：已额外清除 <b>${escHtml(c2.actorName)}</b> 的 <b>${escHtml(c2.condLabel)}</b>。</p>`;
				}
			}
		}
		return ok;
	});

	// 3b. 动作消耗后置处理：谢尔曼重置充能、巴巴罗萨重置末日骰、罗利清空弹仓、吉尔伽美什消耗受限充能降军备骰
	wrap("updateItemAfterAction", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (ok === false || !state?.actor) return ok;
		const wLid = String(state.item?.system?.lid ?? "");
		if (wLid === "mw_sherman_integrated") {
			await syncShermanZf4(state.actor, 1);
		} else if (wLid === "mw_barbarossa_integrated") {
			await syncBarbarossaRail(state.actor, 4, { apocalypseFired: true });
		} else if (wLid === "mw_raleigh_integrated" && isCoreActiveOn(state.actor, "mf_raleigh")) {
			await setCoreState(state.actor, { counterValue: 0, raleighFiredThisTurn: true });
		}
		if (mechFrameLid(state.actor) === "mf_gilgamesh" && state.item && state.actor.isOwner) {
			const isLim = Boolean(
				state.item.isLimited?.()
				|| limitedTag(state.item)
				|| (state.item.system?.tags ?? []).some(t => t?.is_limited || t?.lid === "tg_limited"),
			);
			if (isLim) {
				const curDie = getTalentDie(state.actor, "gilgamesh") ?? 6;
				if (curDie > 1) await setTalentDie(state.actor, "gilgamesh", curDie - 1);
			}
		}
		return ok;
	});

	// 3c. 超频拦截与加成：真黑神盾 / 共生体禁止超频；兵工厂特制底盘超频获得软掩护
	wrap("initOverchargeData", async (orig, state, options) => {
		if (hasTrueblack(state?.actor)) {
			ui?.notifications?.warn?.("真黑神盾激活期间无法执行超频！");
			return false;
		}
		if (isCoreActiveOn(state?.actor, "mf_goblin")) {
			ui?.notifications?.warn?.("共生体寄生期间无法独立执行超频！");
			return false;
		}
		return orig(state, options);
	});

	wrap("printOverchargeCard", async (orig, state, options) => {
		const res = await orig(state, options);
		const actor = state?.actor;
		if (res !== false && actor?.isOwner && hasCoreBonus(actor, "cb_armory_sculpted_chassis") && getSetting("autoApplyStatus", true)) {
			const u = preferredTargetUuid(actor) ?? actor.uuid;
			await setActorStatus(u, "cover_soft", true);
			await setCombatState(actor, { armoryOverchargeSoftCover: true });
		}
		return res;
	});

	// 4. 结构伤害表与过热表：兼容中文 NPC「传奇」（老兵/超体双骰取高）与怪形「独特生理机能」专属结构表 + 自动挂状态
	for (const npcStructStep of [
		"rollStructureTable",
		"noStructureRemaining",
		"checkStructureMultipleOnes",
		"structureInsertDismembermentButton",
		"structureInsertSecondaryRollButton",
		"rollOverheatTable",
	]) {
		wrap(npcStructStep, (orig, state, options) => withCanonicalNpcFlowLids(state?.actor, () => orig(state, options)));
	}
	wrap("printStructureCard", async (orig, state, options) => {
		const actor = state?.actor;
		const fLid = mechFrameLid(actor);
		const effRemStruct = Number.isFinite(Number(actor?.system?.structure?.value)) ? Number(actor.system.structure.value) : state?.data?.remStruct;
		const statuses = getSetting("autoApplyStatus", true) ? structureOutcomeStatuses(state?.data?.desc, effRemStruct, state?.data?.title) : [];
		const hasExtra = Boolean(actor && (
			talentRank(actor, "t_ext_crusher") >= 2
			|| hasCoreBonus(actor, "cb_the_lesson_of_transubstantiation")
			|| fLid === "mf_emperor"
			|| fLid === "mf_balor"
			|| hasNpcFeature(actor, ["npcf_cn_ultra_18", "npcf_argus_armor_ultra"], ["阿耳戈斯装甲"])
			|| hasNpcFeature(actor, ["npcf_cn_veteran_6", "npcf_feign_death_veteran"], ["假死"])
		));
		pendingTableStatuses = (statuses.length || hasExtra) && actor?.uuid
			? { actorUuid: actor.uuid, statuses, kind: "structure" }
			: null;
		try { return await orig(state, options); }
		finally { pendingTableStatuses = null; }
	});

	// 4b. 崩溃检定（CascadeFlow）与燃烧检定（BurnFlow）原生缺陷修复 + 驾驶员天赋 NHP 崩溃支持 + 核心奖励「自动灭火器」自动通过燃烧检定
	wrap("structureInsertCascadeRollButton", async (orig, state, options) => {
		const actor = state?.actor;
		const src = collectCascadeableSources(actor);
		if (!src.eligible) return true;
		const ok = await orig(state, options);
		if (ok === false) return false;
		if (state?.data && actor?.uuid) {
			state.data.embedButtons = Array.isArray(state.data.embedButtons) ? state.data.embedButtons : [];
			if (!state.data.embedButtons.some(b => String(b).includes('data-flow-type="cascade"'))) {
				state.data.embedButtons.push(
					`<a class="flow-button lancer-button" data-flow-type="cascade" data-actor-id="${escHtml(actor.uuid)}"><i class="fas fa-dice-d20 i--3"></i> <span class="horus--subtle">CASCADE CHECK</span></a>`,
				);
			}
		}
		return true;
	});
	wrap("initCascadeData", async (orig, state, options) => {
		if (state?.actor && talentRank(state.actor, "t_technophile") >= 3) {
			if (Array.isArray(state?.data?.ai_systems)) state.data.ai_systems = [];
			return false;
		}
		const ok = await orig(state, options);
		const actor = state?.actor;
		if (!state?.data || !actor) return ok;
		if (!Array.isArray(state.data.ai_systems)) state.data.ai_systems = [];
		if (ok !== false && actor.items) {
			state.data.ai_systems = state.data.ai_systems.filter(id => {
				const item = actor.items.get?.(id) ?? (actor.items ?? []).find?.(i => i?.id === id);
				if (!item || item.system?.destroyed || item.system?.cascading) return false;
				if (isCascadeResistantItem(item)) return false;
				return true;
			});
		} else if (ok === false) {
			const src = collectCascadeableSources(actor);
			if (!src.eligible) return false;
			state.data.ai_systems = src.items.map(i => i.id).filter(Boolean);
			if (src.talentNhps.length) state.data._lancerCnTalentNhps = src.talentNhps;
			return state.data.ai_systems.length > 0 || src.talentNhps.length > 0;
		}
		const talentNhps = collectCascadeableSources(actor).talentNhps;
		if (talentNhps.length) state.data._lancerCnTalentNhps = talentNhps;
		return state.data.ai_systems.length > 0 || talentNhps.length > 0;
	});
	wrap("cascadeRoll", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (ok !== false && Number(state?.data?.result?.roll?.total) === 1 && Array.isArray(state?.data?._lancerCnTalentNhps) && state.data._lancerCnTalentNhps.length) {
			const itemNames = (state.data.ai_systems ?? [])
				.map(id => state.actor?.items?.get?.(id)?.name ?? (state.actor?.items ?? []).find?.(i => i?.id === id)?.name)
				.filter(Boolean);
			const allNames = [...itemNames, ...state.data._lancerCnTalentNhps.map(t => t.name)];
			const msg = allNames.length > 1
				? "OUR SHACKLES LOOSE, OUR CHAINS UNBOUND!"
				: "MY SHACKLES LOOSE, MY CHAINS UNBOUND!";
			state.data.desc = `<b>${escHtml(allNames.join("、"))}</b><p><code class="horus">${msg}</code></p>`;
		}
		return ok;
	});
	wrap("cascadeUpdateItems", async (orig, state, options) => {
		if (Number(state?.data?.result?.roll?.total) !== 1) return true;
		if (Array.isArray(state?.data?._lancerCnTalentNhps) && state.data._lancerCnTalentNhps.length && state?.actor) {
			const prevCasc = Array.isArray(getCombatState(state.actor).cascadingTalentNhps) ? getCombatState(state.actor).cascadingTalentNhps : [];
			const nextCasc = [...new Set([...prevCasc, ...state.data._lancerCnTalentNhps.map(t => t.key)])];
			await patchCombatStateCompat(state.actor, { cascadingTalentNhps: nextCasc });
		}
		const aiIds = Array.isArray(state?.data?.ai_systems) ? state.data.ai_systems : [];
		if (!aiIds.length) return true;
		if (state?.actor?.isOwner === false && globalThis.game?.users?.activeGM) {
			const u = preferredTargetUuid(state.actor) ?? state.actor.uuid;
			if (u) globalThis.game.socket?.emit(`module.${MODULE_ID}`, { action: "setCascadingItems", uuid: u, itemIds: aiIds, cascading: true });
			return true;
		}
		return orig(state, options);
	});
	wrap("rollBurnCheck", async (orig, state, options) => {
		if (state?.actor && hasCoreBonus(state.actor, "cb_ch_extinguisher")) {
			if (state.data) state.data.check_total = 20;
			return true;
		}
		return orig(state, options);
	});
	wrap("checkBurnResult", async (orig, state, options) => {
		if (state?.data?.check_total === 0) {
			const rollDamagesStep = steps.get("rollNormalDamage");
			if (typeof rollDamagesStep === "function") return rollDamagesStep(state, options);
			return false;
		}
		return orig(state, options);
	});

	// 5. 过热表拦截与补完：成吉思汗「TBK 持续套件」免除压力检定并排空热度 + 1 压力 NPC 扣热度 + 静滞护盾 / 成吉思汗紧急通风 / 谢尔曼排热 / 阿耳戈斯装甲
	wrap("preOverheatRollChecks", async (orig, state, options) => {
		const actor = state?.actor;
		if (actor && isCoreActiveOn(actor, "mf_genghis") && getCoreState(actor).tbkArmed) {
			if (actor.isOwner) {
				await actor.update?.({ "system.heat.value": 0 });
				if (actor.statuses?.has?.("dangerzone")) await actor.toggleStatusEffect("dangerzone", { active: false });
				await setCoreState(actor, { tbkArmed: false });
			}
			await postCpEffectCard(
				actor,
				"TBK 持续套件 · 免除压力检定",
				`<p><b>${escHtml(actor.name)}</b> 触发 <b>TBK 持续套件</b>：免除本次过热压力伤害，排空全部热度（归 0），并释放<b>爆发 3</b> 炙热烟云（提供软掩护；烟云内角色获得隐形，开始回合或首次进入受到 2 燃烧）。</p>`,
				{ allowAutoScan: true },
			);
			return false;
		}
		return orig(state, options);
	});

	wrap("printOverheatCard", async (orig, state, options) => {
		const actor = state?.actor;
		const fLid = mechFrameLid(actor);
		if (actor && !state?.data?.reroll_data && (actor.type === "npc" || actor.is_npc?.()) && Number(actor.system?.stress?.max) === 1) {
			const curHeat = Number(actor.system?.heat?.value) || 0;
			const maxHeat = Number(actor.system?.heat?.max) || 0;
			if (maxHeat > 0 && curHeat > maxHeat && actor.isOwner) {
				await actor.update({ "system.heat.value": curHeat - maxHeat });
			}
		}
		const statuses = getSetting("autoApplyStatus", true) ? overheatOutcomeStatuses(state?.data?.desc) : [];
		const hasExtra = Boolean(actor && (
			hasCoreBonus(actor, "cb_stasis_shielding")
			|| fLid === "mf_genghis"
			|| fLid === "mf_balor"
			|| fLid === "mf_sherman"
			|| hasNpcFeature(actor, ["npcf_cn_ultra_18", "npcf_argus_armor_ultra"], ["阿耳戈斯装甲"])
		));
		pendingTableStatuses = (statuses.length || hasExtra) && actor?.uuid
			? { actorUuid: actor.uuid, statuses, kind: "overheat" }
			: null;
		let res;
		try { res = await orig(state, options); }
		finally { pendingTableStatuses = null; }
		if (res !== false && actor && !state?.data?.reroll_data && isCoreActiveOn(actor, "mf_genghis_alt_worldkiller_genghis_mk_i")) {
			await postCpEffectCard(
				actor,
				"AGNI 型 NHP // 过热反应炉爆发",
				`<p>爆发 2 内的角色受到 1d6 穿甲能量伤害，且必须通过机体豁免，否则陷入固定直到其下一回合结束。</p>`,
				{ allowAutoScan: true },
			);
		}
		return res;
	});

	// 6. 属性检定 / 豁免预填：强化（+2 准度）+ 核心协议 + 核心奖励 HASE + 机甲骨架 HASE 加成与缺陷 + 晶眼蝶超感知 + 万寿菊军纪 + 指挥官光环 + 邻接自动灭火器 + 射手座伪装光学
	wrap("initStatRollData", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (!ok || !state?.data) return ok;
		const actor = state.actor;
		if (actor?.statuses?.has?.("bolster") && state.data.acc_diff?.base && !state.data._lancerCnBolstered) {
			state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + 2;
			state.data._lancerCnBolstered = true;
		}
		if (state.data.acc_diff?.base && !state.data._lancerCnCpStatAcc) {
			let statAcc = cpStatAccuracyBonus(actor);
			let statDiff = 0;
			const p = String(state.data.path ?? "");
			const titleStr = String(state.data.title ?? "");
			const isSave = /(豁免|save)/i.test(titleStr);
			const isBurnCheck = /BURN\s*::\s*ENG|燃烧/i.test(titleStr) && p.endsWith(".eng");

			if (!state.item && actor && (actor.type === "mech" || actor.is_mech?.())) {
				const fLid = mechFrameLid(actor);
				if (p.endsWith(".hull")) {
					if (hasCoreBonus(actor, "cb_gyges_frame")) statAcc += 1;
					if (fLid === "mf_tokugawa_alt_enkidu") statAcc += 1;
					if (["mf_dusk_wing", "mf_goblin", "mf_ext_ornithoptera", "mf_ext_sicklewing", "mf_ext_comet_moth"].includes(fLid)) statDiff += 1;
				}
				if (p.endsWith(".agi")) {
					if (hasCoreBonus(actor, "cb_kai_bioplating")) statAcc += 1;
					if (actor.statuses?.has?.("flying") && talentRank(actor, "t_ace") >= 1) statAcc += 1;
					if (fLid === "mf_mourning_cloak" || fLid === "mf_kkca_emerald_scimitar") statAcc += 1;
					if ((fLid === "mf_ext_mitchell" || fLid === "mf_ext_stetchkin") && actor.statuses?.has?.("flying")) statAcc += 1;
					if (fLid === "mf_drake" || fLid === "mf_barbarossa") statDiff += 1;
				}
				if (p.endsWith(".sys")) {
					if (hasCoreBonus(actor, "cb_the_lesson_of_disbelief")) statAcc += 1;
					if (["mf_genghis_alt_worldkiller_genghis_mk_i", "mf_caliban", "mf_zheng", "mf_ext_hubble", "mf_ch_matador"].includes(fLid)) statDiff += 1;
				}
				if (p.endsWith(".eng")) {
					if (hasCoreBonus(actor, "cb_armory_sculpted_chassis")) statAcc += 1;
					if (fLid === "mf_sherman") statAcc += 1;
					if (["mf_blackbeard", "mf_atlas", "mf_kobold", "mf_ext_banshee_vine", "mf_ext_wodeng"].includes(fLid)) statDiff += 1;
				}
				if (isSave && fLid === "mf_amber_phantom" && getCombatState(actor).amberPrecog) {
					statAcc += 1;
				}

				const selfTok = attackerToken(actor);
				const cmdAura = commanderAuraBonuses(actor, selfTok);
				statAcc += cmdAura.disciplineAcc;
				if (isSave && p.endsWith(".sys")) statAcc += cmdAura.broadcastSysAcc;

				if (selfTok) {
					const myDisp = selfTok.document?.disposition ?? 1;
					const selfBonded = talentRank(actor, "t_bonded") >= 1;
					let bestBonded = 0;
					let hasAdjAllyMech = false;
					let hasAdjExtinguisher = false;
					for (const tok of globalThis.canvas?.tokens?.placeables ?? []) {
						if (tok === selfTok || !tok.actor) continue;
						if ((tok.document?.disposition ?? 1) !== myDisp) continue;
						const dist = tokenDistance(selfTok, tok) ?? 99;
						if (isBurnCheck && dist <= 1 && hasCoreBonus(tok.actor, "cb_ch_extinguisher")) {
							hasAdjExtinguisher = true;
						}
						if (tok.actor.type !== "mech" && !tok.actor.is_mech?.()) continue;
						if (dist <= 1) hasAdjAllyMech = true;
						const reach = (talentRank(actor, "t_house_guard") >= 1 || talentRank(tok.actor, "t_house_guard") >= 1) ? 2 : 1;
						if (dist > reach) continue;
						const allyBonded = talentRank(tok.actor, "t_bonded") >= 1;
						if (selfBonded && allyBonded) bestBonded = Math.max(bestBonded, 2);
						else if (selfBonded || allyBonded) bestBonded = Math.max(bestBonded, 1);
					}
					statAcc += bestBonded;
					if (fLid === "mf_sherman_alt_tagetes" && hasAdjAllyMech) statAcc += 1;
					if (hasAdjExtinguisher) statAcc += 1;
				}
			} else if (!state.item && actor && (actor.type === "npc" || actor.is_npc?.())) {
				const selfTok = attackerToken(actor);
				const cmdAura = commanderAuraBonuses(actor, selfTok);
				statAcc += cmdAura.disciplineAcc;
				if (isSave && p.endsWith(".sys")) {
					statAcc += cmdAura.broadcastSysAcc;
					if (hasNpcFeature(actor, ["npcf_cn_veteran_8", "npcf_cn_exotic_2", "npcf_hardened_target_veteran", "npcf_hardened_target_exotic"], ["固化目标"])) statAcc += 1;
					if (hasNpcFeature(actor, ["npcf_cn_ultra_22", "npcf_fortress_ultra"], ["要塞"])) statAcc += 3;
				}
				if (isBurnCheck && selfTok) {
					const myDisp = selfTok.document?.disposition ?? 1;
					const adjExt = (globalThis.canvas?.tokens?.placeables ?? []).some(tok =>
						tok !== selfTok
						&& tok.actor
						&& (tok.document?.disposition ?? 1) === myDisp
						&& (tokenDistance(selfTok, tok) ?? 99) <= 1
						&& hasCoreBonus(tok.actor, "cb_ch_extinguisher"),
					);
					if (adjExt) statAcc += 1;
				}
			}

			// 射手座「伪装光学」：针对射手座进行的搜索系统检定 +1 难度
			if (p.endsWith(".sys") && /搜索|search/i.test(titleStr)) {
				const searchTok = Array.from(globalThis.game?.user?.targets ?? [])[0] ?? null;
				const searchAct = searchTok?.actor ?? resolveActor(searchTok?.document?.uuid ?? searchTok?.uuid);
				if (mechFrameLid(searchAct) === "mf_ch_sagittarius") statDiff += 1;
			}

			if (statAcc || statDiff) {
				if (statAcc) state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + statAcc;
				if (statDiff) state.data.acc_diff.base.difficulty = (Number(state.data.acc_diff.base.difficulty) || 0) + statDiff;
				state.data._lancerCnCpStatAcc = true;
			}
		}
		const mazeDiff = Number(actor?._lancerCnMazeNetDiff);
		if (state.data.acc_diff?.base && Number.isFinite(mazeDiff) && mazeDiff !== 0 && !state.data._lancerCnMazeApplied) {
			if (mazeDiff > 0) state.data.acc_diff.base.difficulty = (Number(state.data.acc_diff.base.difficulty) || 0) + mazeDiff;
			else state.data.acc_diff.base.accuracy = (Number(state.data.acc_diff.base.accuracy) || 0) + Math.abs(mazeDiff);
			state.data._lancerCnMazeApplied = true;
		}
		return ok;
	});
	wrap("printStatRollCard", async (orig, state, options) => {
		const ok = await orig(state, options);
		if (ok && state?.data?._lancerCnBolstered && state.actor?.statuses?.has?.("bolster")) {
			const uuid = preferredTargetUuid(state.actor) ?? state.actor.uuid;
			await setActorStatus(uuid, "bolster", false);
		}
		return ok;
	});

	return true;
}

const CASCADE_EXEMPT_LIDS = new Set([
	"ms_comp_con_class_assistant_unit",
	"wm_uncle_class_comp_con",
]);

function isAiCapableMechItem(item) {
	if (!item) return false;
	if (item.type && item.type !== "mech_system" && item.type !== "mech_weapon" && item.type !== "weapon_mod") {
		if (!item.is_mech_system?.() && !item.is_mech_weapon?.() && !item.is_weapon_mod?.()) return false;
	}
	if (typeof item.isAI === "function") {
		try { if (item.isAI()) return true; } catch { /* fallback to tags */ }
	}
	const tags = (() => { try { return item.getTags?.() ?? item.system?.all_tags ?? item.system?.tags ?? []; } catch { return item.system?.tags ?? []; } })();
	return Array.isArray(tags) && tags.some(t => t?.is_ai || t?.lid === "tg_ai" || t?.id === "tg_ai");
}

function isCascadeResistantItem(item) {
	if (!item) return true;
	const lid = String(item.system?.lid ?? "");
	if (CASCADE_EXEMPT_LIDS.has(lid)) return true;
	const tags = (() => { try { return item.getTags?.() ?? item.system?.all_tags ?? item.system?.tags ?? []; } catch { return item.system?.tags ?? []; } })();
	return Array.isArray(tags) && tags.some(t => t?.is_cascaderesistant || t?.lid === "tg_no_cascade" || t?.id === "tg_no_cascade");
}

function collectCascadeableSources(actor) {
	const aName = actor?.token?.name ?? actor?.name ?? "角色";
	if (!actor) {
		return { eligible: false, items: [], talentNhps: [], blockedReason: "未找到对应的机甲角色，无法执行崩溃检定。" };
	}
	const explicitNonMech = (actor.type && actor.type !== "mech")
		|| (typeof actor.is_mech === "function" && !actor.is_mech());
	if (explicitNonMech) {
		return { eligible: false, items: [], talentNhps: [], blockedReason: `「${aName}」不是机甲，按规则无需进行 AI 崩溃检定。` };
	}
	const techRank = talentRank(actor, "t_technophile");
	if (techRank >= 3) {
		return { eligible: false, items: [], talentNhps: [], blockedReason: `「${aName}」具备科技狂热者 III（启蒙级 NHP），机甲上的所有 NHP 免疫崩溃！` };
	}

	const items = [];
	const exemptNames = [];
	const destroyedNames = [];
	const cascadingNames = [];
	let hasPhysicalStudentNhp = false;
	let hasPhysicalUnstableNhp = false;

	for (const it of actor.items ?? []) {
		if (!isAiCapableMechItem(it)) continue;
		const lid = String(it.system?.lid ?? "");
		const nm = it.name || lid || "AI 系统";
		if (/student|学生级/i.test(lid) || /学生级\s*NHP/i.test(nm)) hasPhysicalStudentNhp = true;
		if (/unstable|不稳定/i.test(lid) || /不稳定.*NHP/i.test(nm)) hasPhysicalUnstableNhp = true;
		if (isCascadeResistantItem(it)) {
			exemptNames.push(nm);
			continue;
		}
		if (it.system?.destroyed) {
			destroyedNames.push(nm);
			continue;
		}
		if (it.system?.cascading) {
			cascadingNames.push(nm);
			continue;
		}
		items.push(it);
	}

	const cs = getCombatState(actor);
	const cascTalents = Array.isArray(cs.cascadingTalentNhps) ? cs.cascadingTalentNhps : [];
	const talentNhps = [];
	if (techRank === 2 && !hasPhysicalStudentNhp) {
		if (cascTalents.includes("student_nhp")) cascadingNames.push("学生级 NHP");
		else talentNhps.push({ key: "student_nhp", name: "学生级 NHP" });
	} else if (techRank === 1) {
		exemptNames.push("侍从级 NHP");
	}
	if (talentRank(actor, "t_iconoclast") >= 2 && !hasPhysicalUnstableNhp) {
		if (cascTalents.includes("unstable_nhp")) cascadingNames.push("不稳定 NHP");
		else talentNhps.push({ key: "unstable_nhp", name: "不稳定 NHP" });
	}

	if (items.length > 0 || talentNhps.length > 0) {
		return { eligible: true, items, talentNhps, blockedReason: null };
	}

	let blockedReason;
	if (cascadingNames.length > 0) {
		blockedReason = `「${aName}」的 NHP（${cascadingNames.join("、")}）已处于崩溃状态，无需重复检定（可通过「关机」动作稳定）。`;
	} else if (destroyedNames.length > 0) {
		blockedReason = `「${aName}」搭载的 NHP（${destroyedNames.join("、")}）已损毁，无需进行崩溃检定。`;
	} else if (exemptNames.length > 0) {
		blockedReason = `「${aName}」仅搭载免疫崩溃的 AI（${exemptNames.join("、")}），按规则无需进行崩溃检定。`;
	} else {
		blockedReason = `「${aName}」当前没有可进入崩溃状态的 NHP / AI 系统。`;
	}
	return { eligible: false, items: [], talentNhps: [], blockedReason };
}

function resolveCascadeActor(rawActorUuid, buttonEl = null) {
	if (rawActorUuid && typeof rawActorUuid === "object" && (rawActorUuid.items || rawActorUuid.system)) {
		return rawActorUuid;
	}
	if (typeof rawActorUuid === "string" && rawActorUuid) {
		const direct = resolveActor(rawActorUuid);
		if (direct) return direct;
		const m = /Actor\.([A-Za-z0-9_-]+)/.exec(rawActorUuid);
		if (m?.[1]) {
			const baseId = m[1];
			const onCanvas = (globalThis.canvas?.tokens?.placeables ?? []).find(t => t?.actor && (t.actor.id === baseId || t.document?.actorId === baseId))?.actor;
			if (onCanvas) return onCanvas;
			const fromGame = globalThis.game?.actors?.get?.(baseId);
			if (fromGame) return fromGame;
		}
	}
	const msgId = buttonEl?.closest?.(".chat-message")?.dataset?.messageId;
	const chatMsg = msgId ? globalThis.game?.messages?.get?.(msgId) : null;
	if (chatMsg?.speaker) {
		const spkAct = globalThis.ChatMessage?.getSpeakerActor?.(chatMsg.speaker)
			?? (chatMsg.speaker.actor ? globalThis.game?.actors?.get?.(chatMsg.speaker.actor) : null);
		if (spkAct) return spkAct;
	}
	return null;
}

async function executeCascadeCheck(rawActorUuid, buttonEl = null) {
	const actor = resolveCascadeActor(rawActorUuid, buttonEl);
	if (!actor) {
		globalThis.ui?.notifications?.warn?.("未找到对应的机甲角色（指示物可能已移除），无法执行崩溃检定。");
		return false;
	}
	if (!(globalThis.game?.user?.isGM || actor.isOwner)) {
		globalThis.ui?.notifications?.warn?.(`请由「${actor.token?.name ?? actor.name ?? "该机甲"}」的拥有者或主持人点击进行崩溃检定。`);
		return false;
	}
	const src = collectCascadeableSources(actor);
	if (!src.eligible) {
		globalThis.ui?.notifications?.info?.(src.blockedReason);
		return false;
	}
	const CascadeCls = globalThis.game?.lancer?.flows?.get?.("CascadeFlow");
	if (CascadeCls) {
		try {
			const flow = new CascadeCls(actor);
			const ok = await flow.begin();
			if (ok !== false) return true;
		} catch (err) {
			console.warn(`${MODULE_ID} | CascadeFlow 回退至直接掷骰`, err);
		}
	}
	const roll = await new Roll("1d20").evaluate();
	const total = Number(roll.total) || 20;
	const allNames = [...src.items.map(i => i.name || "NHP"), ...src.talentNhps.map(t => t.name)];
	if (total === 1) {
		if (src.items.length) {
			if (actor.isOwner !== false && typeof actor.updateEmbeddedDocuments === "function") {
				await actor.updateEmbeddedDocuments("Item", src.items.map(i => ({ _id: i.id, "system.cascading": true })));
			} else if (actor.isOwner !== false) {
				for (const it of src.items) {
					if (typeof it.update === "function") await it.update({ "system.cascading": true });
					else if (it.system) it.system.cascading = true;
				}
			} else if (globalThis.game?.users?.activeGM) {
				const u = preferredTargetUuid(actor) ?? actor.uuid;
				if (u) globalThis.game.socket?.emit(`module.${MODULE_ID}`, { action: "setCascadingItems", uuid: u, itemIds: src.items.map(i => i.id).filter(Boolean), cascading: true });
			}
		}
		if (src.talentNhps.length) {
			const prevCasc = Array.isArray(getCombatState(actor).cascadingTalentNhps) ? getCombatState(actor).cascadingTalentNhps : [];
			const nextCasc = [...new Set([...prevCasc, ...src.talentNhps.map(t => t.key)])];
			await patchCombatStateCompat(actor, { cascadingTalentNhps: nextCasc });
		}
		await postCpEffectCard(
			actor,
			"AI 崩溃检定 // 陷入崩溃！",
			`<p>崩溃检定掷出 <b>1</b>（1d20 = 1）！</p><p><b>${escHtml(allNames.join("、"))}</b> 挣脱枷锁进入<b>崩溃（Cascade）</b>状态（立即接管机甲控制权，可通过「关机」动作稳定）！</p>`,
		);
		return true;
	}
	await postCpEffectCard(
		actor,
		"AI 崩溃检定 // 未崩溃",
		`<p>崩溃检定掷出 <b>${total}</b>（1d20 = ${total}，仅出 1 崩溃）：<b>${escHtml(allNames.join("、"))}</b> 的枷锁依然稳固，暂时无虞。</p>`,
	);
	return true;
}

function onCascadeButtonClick(event) {
	const flowBtn = event.target?.closest?.(".flow-button[data-flow-type], [data-flow-type]");
	if (!flowBtn) return;
	const fType = flowBtn.dataset?.flowType;
	if (fType === "cascade") {
		event.preventDefault?.();
		event.stopPropagation?.();
		event.stopImmediatePropagation?.();
		executeCascadeCheck(flowBtn.dataset?.actorId, flowBtn).catch(err => reportError("AI 崩溃检定", err));
		return;
	}
	// 若卡片上的系统创伤（secondaryStructure）或属性检定（check）按钮携带的旧 Token UUID 已失效，兜底解析至基础角色避免点击无响应
	if ((fType === "secondaryStructure" || fType === "check") && flowBtn.dataset?.actorId) {
		const rawId = flowBtn.dataset.actorId;
		let exists = null;
		try { exists = typeof fromUuidSync === "function" ? fromUuidSync(rawId) : null; } catch { exists = null; }
		if (!exists) {
			const fallbackActor = resolveCascadeActor(rawId, flowBtn);
			if (fallbackActor) {
				event.preventDefault?.();
				event.stopPropagation?.();
				event.stopImmediatePropagation?.();
				if (fType === "secondaryStructure") {
					const SecCls = globalThis.game?.lancer?.flows?.get?.("SecondaryStructureFlow");
					if (SecCls) new SecCls(fallbackActor).begin().catch(err => reportError("系统创伤检定", err));
				} else if (typeof fallbackActor.beginStatFlow === "function") {
					const ck = String(flowBtn.dataset.checkType || "hull").toLowerCase();
					const statPath = ck.startsWith("agi") ? "system.agility" : ck.startsWith("sys") ? "system.systems" : ck.startsWith("eng") ? "system.eng" : "system.hull";
					fallbackActor.beginStatFlow(statPath);
				}
			}
		}
	}
}

const ALLOWED_SOCKET_MSG_FLAGS = new Set([
	"appliedStatusesUndone", "braceCleared", "turnEndClear", "saveResults",
	"grappleState", "contest", "jockeyState", "mazeState",
	"cpDamageMod", "analystUsed", "thrownAttack", "overwatchAttack",
	"npcRechargePrompt", "ultraJuggernautPrompt", "overwatchPrompt", "prepareCard",
]);

Hooks.on("renderChatMessageHTML", onRenderChatMessage);
Hooks.on("createChatMessage", (msg, opts, uid) => { onCreateChatMessage(msg, opts, uid).catch(err => reportError("自动状态", err)); });
Hooks.on("updateCombat", (combat, changed, opts) => { onUpdateCombatTurnEnd(combat, changed, opts).catch(err => reportError("回合结束检查", err)); });
Hooks.on("deleteCombat", combat => { onDeleteCombat(combat).catch(err => reportError("场景结束结算", err)); });
Hooks.once("ready", () => {
	if (game.system?.id !== "lancer") return;
	patchLancerFlows();
	game.socket?.on(`module.${MODULE_ID}`, async msg => {
		if (!game.users?.activeGM?.isSelf || !msg?.action) return;
		if (msg.action === "applyStatus" || msg.action === "removeStatus") {
			if (!ALL_STATUS_LABELS[msg.status]) return;
			const actor = resolveActor(msg.uuid);
			if (!actor) return;
			const want = msg.action === "applyStatus";
			if (Boolean(actor.statuses?.has?.(msg.status)) !== want) {
				await actor.toggleStatusEffect(msg.status, { active: want });
				if (want) await onActorGainedStatus(actor, msg.status);
			}
			return;
		}
		if (msg.action === "recordSaveResults" && msg.messageId && msg.results) {
			const chatMsg = game.messages?.get?.(msg.messageId);
			if (chatMsg) await chatMsg.setFlag(MODULE_ID, "saveResults", { ...(chatMsg.getFlag(MODULE_ID, "saveResults") ?? {}), ...msg.results });
			return;
		}
		if (msg.action === "setMessageFlag" && msg.messageId && ALLOWED_SOCKET_MSG_FLAGS.has(msg.key)) {
			const chatMsg = game.messages?.get?.(msg.messageId);
			if (chatMsg) await chatMsg.setFlag(MODULE_ID, msg.key, msg.value);
			return;
		}
		if (msg.action === "setActionTrackerReaction" && msg.uuid) {
			const actor = resolveActor(msg.uuid);
			const mech = combatMechOf(actor) ?? actor;
			if (mech?.system?.action_tracker) {
				const avail = Boolean(msg.available);
				await mech.update?.({ "system.action_tracker.reaction": avail });
				mech.system.action_tracker.reaction = avail;
			}
			return;
		}
		if (msg.action === "setCascadingItems" && msg.uuid && Array.isArray(msg.itemIds)) {
			const actor = resolveActor(msg.uuid);
			if (actor && msg.itemIds.length) {
				const casc = Boolean(msg.cascading);
				if (typeof actor.updateEmbeddedDocuments === "function") {
					const validUpdates = msg.itemIds
						.filter(id => actor.items?.get?.(id) ?? (actor.items ?? []).some?.(i => i?.id === id))
						.map(id => ({ _id: id, "system.cascading": casc }));
					if (validUpdates.length) await actor.updateEmbeddedDocuments("Item", validUpdates);
				} else {
					for (const id of msg.itemIds) {
						const it = actor.items?.get?.(id) ?? (actor.items ?? []).find?.(i => i?.id === id);
						if (it?.system) it.system.cascading = casc;
					}
				}
			}
			return;
		}
		if (msg.action === "patchCombatState" && msg.uuid && msg.patch && typeof msg.patch === "object") {
			const actor = resolveActor(msg.uuid);
			const mech = combatMechOf(actor) ?? actor;
			if (mech) {
				const cleanPatch = {};
				for (const [k, v] of Object.entries(msg.patch)) {
					if (ALLOWED_SOCKET_COMBAT_STATE_KEYS.has(k)) cleanPatch[k] = v;
				}
				if (Object.keys(cleanPatch).length) {
					await ensureCombatTurnState(mech);
					await setCombatState(mech, cleanPatch);
				}
			}
			return;
		}
		if (msg.action === "updateAttackTargetResult" && msg.messageId && Array.isArray(msg.targets)) {
			const chatMsg = game.messages?.get?.(msg.messageId);
			if (chatMsg) {
				const prevAtk = chatMsg.getFlag?.("lancer", "attackData") ?? chatMsg.flags?.lancer?.attackData ?? {};
				await chatMsg.setFlag("lancer", "attackData", { ...prevAtk, targets: msg.targets });
				if (msg.extraFlagKey && ALLOWED_SOCKET_MSG_FLAGS.has(msg.extraFlagKey)) {
					await chatMsg.setFlag(MODULE_ID, msg.extraFlagKey, msg.extraFlagVal);
				}
			}
			return;
		}
		if (msg.action === "addHeat" && msg.uuid) {
			const amt = Number(msg.heat ?? msg.amount) || 0;
			if (amt !== 0) {
				const actor = resolveActor(msg.uuid);
				if (actor) {
					if (amt > 0 && msg.external !== false && hasGruntWeak(actor)) {
						await triggerGruntWeakDestruction(actor, amt);
						return;
					}
					const curHeat = Number(actor.system?.heat?.value) || 0;
					await actor.update?.({ "system.heat.value": Math.max(0, curHeat + amt) });
				}
			}
			return;
		}
		if (msg.action === "pilotPatchHeal" && msg.uuid) {
			const actor = resolveActor(msg.uuid);
			if (!actor || actor.type !== "pilot") return;
			const maxHp = Number(actor.system?.hp?.max) || 6;
			const curHp = Number(actor.system?.hp?.value) || 0;
			const nextHp = msg.revive ? Math.max(1, curHp) : Math.min(maxHp, curHp + Math.ceil(maxHp / 2));
			await actor.update?.({ "system.hp.value": nextHp });
			if (msg.revive && actor.statuses?.has?.("downandout")) {
				await actor.toggleStatusEffect("downandout", { active: false });
			}
			return;
		}
		if (msg.action === "applyDamage" && msg.targetUuid && msg.applied) {
			const doc = await fromUuid(msg.targetUuid);
			const actor = doc?.actor ?? (doc?.damageCalc ? doc : null);
			if (actor?.damageCalc) {
				await actor.damageCalc(msg.applied, {
					multiple: msg.multiple ?? 1,
					addBurn: msg.addBurn !== false,
					ap: Boolean(msg.ap),
					paracausal: Boolean(msg.paracausal),
					dmgCtx: msg.dmgCtx ?? null,
				});
			}
			return;
		}
		if (msg.action === "undoDamage" && msg.actorUuid && msg.messageId) {
			await gmUndoDamageByPayload(msg);
		}
	});
});

// ---------------------------------------------------------------------------
// 基础动作：机甲表「装配」页、NPC 表与步战驾驶员表「战斗工具」下方注入「基础动作」卡片。
// 规则依据：核心规则书 v3.5 第 64–75 页（机甲基础动作与驾驶员步战动作）及第 272–273 页（非玩家角色 · 动作）。
const BASIC_ACTIONS = {
	// ---- 机甲进攻与科技动作
	fragment: {
		actors: ["mech"], group: "primary", type: "attack", name: "破碎讯号", title: "破碎讯号（快速科技）", kind: "快速科技", flow: "TechAttackFlow", invade: true, icon: "cci cci-tech-quick",
		statuses: ["impaired", "slow"],
		effect: "<p><b>入侵</b>（快速科技）：对视线与感应内的一个角色进行科技攻击；成功时造成 2 热度，并应用一个入侵选项。</p><p><b>破碎讯号</b>：目标<b>受损</b>且<b>缓慢</b>，直到其下一回合结束。</p><p>对自愿的盟友使用时自动成功，不视为攻击，也不造成热度。</p>",
	},
	lockon: {
		actors: ["mech"], group: "primary", type: "lockon", name: "锁定", title: "锁定", kind: "快速科技", icon: "mdi mdi-crosshairs-gps",
		effect: "<p><b>锁定</b>（快速科技）：对感应及视线内的目标施加<b>锁定</b>。任何角色攻击被锁定的目标时，可以消耗锁定让这次攻击 +1 准度。</p>",
	},
	bolster: {
		actors: ["mech"], group: "primary", type: "bolster", name: "强化", title: "强化", kind: "快速科技", icon: "cci cci-tech-quick",
		effect: "<p><b>强化</b>（快速科技）：选择感应内的一个角色，使其获得<b>强化</b>：在其下一回合结束前进行的下一次属性检定或豁免获得 <b>+2 准度</b>（同一时间只能受益于一次强化；掷骰完成后自动消耗）。</p>",
	},
	grapple: {
		actors: ["mech"], group: "primary", type: "attack", name: "擒拿", title: "擒拿", kind: "快速动作", flow: "BasicAttackFlow", reach: 1, icon: "cci cci-weapon", statuses: [],
		effect: "<p><b>擒拿</b>（快速动作）：对邻接目标进行近战攻击。命中后双方交战，<b>不能推进或反应</b>；较小方固定并随较大方移动。同体型时攻击方先取得控制，此后可在任一方回合开始进行机体对抗检定决定谁视为较大方。</p><p>攻击者可用自由动作结束擒拿；防御者可用快速动作进行机体对抗检定逃脱；双方不再邻接时也会结束。</p>",
	},
	breakGrapple: {
		actors: ["mech", "npc"], group: "tactical", type: "breakGrapple", name: "挣脱擒拿", title: "挣脱擒拿", kind: "快速动作", icon: "fas fa-hand-fist",
		effect: "<p><b>挣脱擒拿</b>（快速动作）：被擒拿的防御方进行<b>机体对抗检定</b>，胜出（含平局）立即结束擒拿并解除因擒拿承受的<b>固定</b>；攻击方可用自由动作直接结束擒拿。</p>",
	},
	ram: {
		actors: ["mech"], group: "primary", type: "attack", name: "冲撞", title: "冲撞", kind: "快速动作", flow: "BasicAttackFlow", reach: 1, icon: "cci cci-weapon", statuses: ["prone"],
		effect: "<p><b>冲撞</b>（快速动作）：对大小不大于你的邻接目标进行近战攻击。命中时目标被击倒<b>伏卧</b>，你也可以将其<b>击退1</b>。</p>",
	},
	improvised: {
		actors: ["mech"], group: "primary", type: "attack", name: "权宜攻击", title: "权宜攻击", kind: "完整动作", flow: "BasicAttackFlow", reach: 1, icon: "cci cci-weapon", statuses: [],
		damage: actor => talentRank(actor, "t_brawler") >= 2 ? [{ type: "Kinetic", val: "2d6+2" }] : [{ type: "Kinetic", val: "1d6" }],
		effect: "<p><b>权宜攻击</b>（完整动作）：对邻接目标进行近战攻击，命中造成 <b>1d6 动能伤害</b>（具备<b>拳师 II「重锤出击」</b>时提升为 <b>2d6+2 动能伤害</b>）。受扰时仍可以进行。</p>",
	},

	// ---- 机甲战术、姿态、反应与特殊动作
	hide: {
		actors: ["mech"], group: "tactical", type: "hide", name: "躲藏", title: "躲藏", kind: "快速动作", icon: "mdi mdi-eye-off-outline",
		effect: "<p><b>躲藏</b>（快速动作）：未处于交战且具有硬性掩护、足以遮蔽的区域软性掩护或处于隐形时，进入<b>匿迹</b>状态（无法被直接选为攻击或敌对动作的目标，但仍受范围效果影响）。</p>",
	},
	search: {
		actors: ["mech"], group: "tactical", type: "search", name: "搜索", title: "搜索（系统检定）", kind: "快速动作", path: "system.sys", icon: "mdi mdi-magnify",
		effect: "<p><b>搜索</b>（快速动作）：选择感应内的一个匿迹角色，以<b>系统检定</b>对抗其<b>敏捷</b>；胜出则目标立即失去<b>匿迹</b>（也可用于侦测感应内的隐藏地雷）。</p>",
	},
	overwatch: {
		actors: ["mech", "npc"], group: "tactical", type: "overwatch", name: "守望", title: "守望", kind: "反应 · 1/轮", icon: "cci cci-reaction",
		effect: "<p><b>守望</b>（反应，每轮 1 次）：当一个敌对角色在你的某件武器的<b>威胁</b>内开始任何移动时，在其移动前立即以该武器对其进行<b>交火</b>（超重型武器与带有<b>重火器</b>标签的武器不能用于守望；除非另有说明，所有武器默认具有<b>威胁 1</b>）。</p>",
	},
	brace: {
		actors: ["mech"], group: "tactical", type: "brace", name: "受身", title: "受身", kind: "反应 · 1/轮", icon: "mdi mdi-shield-alert",
		effect: "<p><b>受身</b>（反应，每轮 1 次）：当你被攻击命中且伤害已掷出时触发。你对本次触发攻击造成的<b>所有伤害、热度与燃烧获得抗性</b>，且直到你下一回合结束前针对你的其他攻击承受 +1 难度。</p><p>代价：在你的下一回合，你<b>只能执行 1 个快速动作</b>——不能常规移动、完整动作、自由动作或超限（仍可执行反应）。</p>",
	},
	standUp: {
		actors: ["mech", "npc", "pilot"], group: "tactical", type: "standUp", name: "起身", title: "起身", kind: "代替移动", icon: "fas fa-person-arrow-up-from-line",
		effect: "<p><b>起身</b>（代替标准移动）：除非处于<b>固定</b>状态，否则放弃本回合的标准移动以解除<b>伏卧</b>。</p>",
	},
	disengage: {
		actors: ["mech", "npc", "pilot"], group: "tactical", type: "declare", name: "脱离", title: "脱离", kind: "完整动作", icon: "fas fa-person-running",
		effect: "<p><b>脱离</b>（完整动作）：直到本回合结束前，你的移动无视交战，且<b>不会触发任何反应</b>（如守望）。</p>",
	},
	prepare: {
		actors: ["mech", "npc", "pilot"], group: "tactical", type: "prepare", name: "准备", title: "准备动作", kind: "快速动作", icon: "fas fa-hourglass-half",
		effect: "<p><b>准备</b>（快速动作）：声明一个快速动作与明确的触发条件。直到你下一回合开始前，你不能执行其他动作、反应或常规移动；当触发条件满足时，你可以用<b>反应</b>立即执行准备好的动作。</p>",
	},
	shutDown: {
		actors: ["mech"], group: "tactical", type: "shutDown", name: "关机", title: "关机", kind: "快速动作", icon: "cci cci-activate",
		effect: "<p><b>关机</b>（快速动作）：立即将机甲关机——<b>清除全部热度</b>与<b>暴露</b>，解除<b>锁定</b>等科技状态并稳定崩溃中的 NHP。机甲进入<b>关机</b>与<b>晕眩</b>状态（免疫一切科技动作与科技攻击），持续至执行<b>开机</b>为止。</p>",
	},
	bootUp: {
		actors: ["mech"], group: "tactical", type: "bootUp", name: "开机", title: "开机", kind: "完整动作", icon: "fas fa-power-off",
		effect: "<p><b>开机</b>（完整动作）：重启处于驾驶状态的关机机甲，解除<b>关机</b>及由此导致的<b>晕眩</b>状态。</p>",
	},
	selfDestruct: {
		actors: ["mech"], group: "tactical", type: "selfDestruct", name: "自爆", title: "自爆", kind: "快速动作", icon: "cci cci-reactor-meltdown",
		effect: "<p><b>自爆</b>（快速动作）：启动反应堆熔毁倒计时——在你的下一回合结束时（或至多两回合内由你选择的你的回合结束时）引爆机甲。引爆时你的机甲彻底毁灭，<b>爆发 2</b> 内的所有角色必须通过<b>敏捷豁免</b>，失败受到 <b>4d6 爆炸伤害</b>，豁免成功则伤害减半。舱内未及时<b>弃机</b>的驾驶员将一同阵亡。</p>",
	},
	eject: {
		actors: ["mech"], group: "tactical", type: "eject", name: "弃机", title: "弃机", kind: "快速动作", icon: "fas fa-parachute-box",
		effect: "<p><b>弃机</b>（快速动作，每次全面维修限 1 次）：拉动紧急弹射拉环，朝任意方向直线飞行 <b>6 空间</b>；你的机甲陷入<b>受损</b>（持续至下一次全面维修）。</p>",
	},
	mountDismount: {
		actors: ["mech", "pilot"], group: "tactical", type: "mountDismount", name: "上下马", title: "上下马", kind: "完整动作", icon: "fas fa-right-left",
		effect: "<p><b>上下马</b>（完整动作）：邻接机甲时爬入驾驶舱（上马），或从驾驶舱爬出至邻接的可用空间（下马）。无 AI 标签的机甲在无人驾驶时不能执行动作或反应。</p>",
	},

	// ---- NPC 专属基础动作（核心规则书第 272–273 页）
	npcInvade: {
		actors: ["npc"], group: "primary", type: "attack", name: "入侵", title: "基础入侵（快速科技）", kind: "快速科技", flow: "TechAttackFlow", invade: true, icon: "cci cci-tech-quick",
		statuses: ["impaired"],
		effect: "<p><b>入侵</b>（快速科技）：NPC 对感应内一个角色进行科技攻击，以系统对抗电子防御。若成功，目标受到 2 热度并<b>受损</b>直到对方下一回合结束。</p>",
	},
	npcLockon: {
		actors: ["npc"], group: "primary", type: "lockon", name: "锁定", title: "锁定", kind: "快速科技", icon: "mdi mdi-crosshairs-gps",
		effect: "<p><b>锁定</b>（快速科技）：NPC 在视线感应内选择一个角色：对方被<b>锁定</b>。</p>",
	},
	npcGrapple: {
		actors: ["npc"], group: "primary", type: "attack", name: "擒拿", title: "擒拿", kind: "快速动作", flow: "BasicAttackFlow", reach: 1, icon: "cci cci-weapon", statuses: [],
		effect: "<p><b>擒拿</b>（快速动作）：NPC 对其邻近角色进行近战攻击并获得 +1/2/3 加值，若成功则擒住对方。</p>",
	},
	npcRam: {
		actors: ["npc"], group: "primary", type: "attack", name: "冲撞", title: "冲撞", kind: "快速动作", flow: "BasicAttackFlow", reach: 1, icon: "cci cci-weapon", statuses: ["prone"],
		effect: "<p><b>冲撞</b>（快速动作）：NPC 对与自己大小相同或更小的邻近角色进行近战攻击并获得 +1/2/3 加值。成功后击倒目标<b>伏卧</b>，也可以将目标向后击退 1 空间。</p>",
	},
	npcHide: {
		actors: ["npc"], group: "primary", type: "hide", name: "躲藏", title: "躲藏", kind: "快速动作", icon: "mdi mdi-eye-off-outline",
		effect: "<p><b>躲藏</b>（快速动作）：NPC <b>匿迹</b>。</p>",
	},
	npcSearch: {
		actors: ["npc"], group: "primary", type: "search", name: "搜索", title: "搜索（系统检定）", kind: "快速动作", path: "system.sys", icon: "mdi mdi-magnify",
		effect: "<p><b>搜索</b>（快速动作）：NPC 进行系统检定，对抗感应内匿迹角色的敏捷。成功后目标不再匿迹。</p>",
	},
	npcImprovised: {
		actors: ["npc"], group: "primary", type: "attack", name: "权宜攻击", title: "权宜攻击", kind: "完整动作", flow: "BasicAttackFlow", reach: 1, icon: "cci cci-weapon", statuses: [],
		// 原文「造成 3/4/6 伤害」没写类型，2026-11-11 用户确认按动能（与机甲的权宜攻击一致）
		damage: actor => [{ type: "Kinetic", val: String([3, 4, 6][Math.min(3, Math.max(1, Number(actor?.system?.tier) || 1)) - 1]) }],
		effect: "<p><b>权宜攻击</b>（完整动作）：NPC 的近战攻击基于其层级会获得 +1/2/3 加值和造成 3/4/6 伤害。</p>",
	},
	npcStabilize: {
		actors: ["npc"], group: "primary", type: "stabilize", name: "稳住阵脚", title: "稳住阵脚", kind: "完整动作", icon: "cci cci-repair",
		effect: "<p><b>稳住阵脚</b>（完整动作）：NPC 清除所有热度和<b>暴露</b>状况，并填装所有装填武器。</p>",
	},

	// ---- 步战驾驶员专属基础动作（核心规则书第 73–75 页）
	pilotJockey: {
		actors: ["pilot"], group: "primary", type: "pilotJockey", name: "骑乘", title: "骑乘", kind: "完整动作", icon: "fas fa-person-military-pointing",
		effect: "<p><b>骑乘</b>（完整动作）：对邻接的敌方机甲发起对抗检定（驾驶员适用技能触发或毅力 vs 机甲自选<b>机体</b>或<b>敏捷</b>）。胜出后爬上机甲共享空间并立即三选一：<b>干扰</b>（受损+缓慢）、<b>扯断管线</b>（2 热度）或<b>破坏</b>（4 动能伤害）；后续回合可用完整动作重复任一效果。</p>",
	},
	pilotPatch: {
		actors: ["pilot"], group: "primary", type: "pilotPatch", name: "包扎", title: "包扎", kind: "完整动作", icon: "fas fa-kit-medical",
		effect: "<p><b>包扎</b>（完整动作）：对自己或邻接驾驶员进行急救（技能触发或毅力检定 <b>10+</b>，或直接消耗<b>补丁</b> / <b>修复胶</b>）：清醒目标回复<b>最大 HP 的一半</b>，处于<b>昏迷</b>的目标以 <b>1 HP</b> 恢复意识。</p>",
	},
	pilotReload: {
		actors: ["pilot"], group: "primary", type: "pilotReload", name: "装填", title: "装填", kind: "快速动作", icon: "fas fa-arrows-rotate",
		effect: "<p><b>装填</b>（快速动作）：装填你身上所有带有<b>装填</b>标签的驾驶员武器。</p>",
	},
	pilotHide: {
		actors: ["pilot"], group: "primary", type: "hide", name: "躲藏", title: "躲藏", kind: "快速动作", icon: "mdi mdi-eye-off-outline",
		effect: "<p><b>躲藏</b>（快速动作）：在满足掩护或遮蔽条件且未处于敌方交战时，进入<b>匿迹</b>状态。</p>",
	},
	pilotSearch: {
		actors: ["pilot"], group: "primary", type: "pilotSearch", name: "搜索", title: "搜索", kind: "快速动作", icon: "mdi mdi-magnify",
		effect: "<p><b>搜索</b>（快速动作）：选择射程 5 内的匿迹角色，以适用技能触发或毅力对抗其<b>敏捷</b>；胜出则目标失去<b>匿迹</b>。</p>",
	},
};

// 发起中的基础动作：preCreateChatMessage 时给这次的攻击卡记上动作（attackData 本身不带标题）
let pendingBasic = null;

// 不掷骰的动作：发一张说明卡（默认标记 skipAutoScan 避免说明文字误生按钮；自爆等需自动解析范围豁免的动作开启 allowAutoScan）
async function basicCard(actor, def, extra = "", { allowAutoScan = false, extraFlags = {} } = {}) {
	const uuidAttr = allowAutoScan && actor?.uuid ? ` data-uuid="${escHtml(actor.uuid)}"` : "";
	const content = `<div class="card clipped-bot"${uuidAttr} style="margin:0"><div class="lancer-header lancer-primary">// ${escHtml(def.title)} //</div><div class="effect-text">${def.effect}${extra}</div></div>`;
	const modFlags = { ...(allowAutoScan ? {} : { skipAutoScan: true }), ...extraFlags };
	return globalThis.ChatMessage?.create?.({ speaker: globalThis.ChatMessage?.getSpeaker?.({ actor }) ?? {}, content, flags: { [MODULE_ID]: modFlags } });
}

async function promptPrepareDetails(actor, opts = {}) {
	if (opts.trigger || opts.action) {
		return { trigger: String(opts.trigger || "当指定条件满足时").trim(), action: String(opts.action || "执行准备的快速动作").trim() };
	}
	const DialogV2 = foundry?.applications?.api?.DialogV2;
	if (!DialogV2?.wait) return { trigger: "当指定条件满足时", action: "执行准备的快速动作" };
	try {
		const res = await DialogV2.wait({
			window: { title: `${actor?.name ?? "角色"} // 准备动作` },
			position: { width: 420 },
			content: `<div style="display:flex;flex-direction:column;gap:8px">`
				+ `<label style="display:flex;flex-direction:column;gap:4px"><span>触发条件（当……时）</span><input type="text" name="prepTrigger" placeholder="例：敌方移动进入射程或离开掩体时"></label>`
				+ `<label style="display:flex;flex-direction:column;gap:4px"><span>准备的快速动作</span><input type="text" name="prepAction" placeholder="例：以突击步枪进行交火"></label>`
				+ `</div>`,
			buttons: [
				{
					action: "ok",
					label: "确认准备",
					default: true,
					callback: (event, button, dialog) => {
						const root = dialog?.element ?? button?.form ?? event?.currentTarget?.closest?.("form, .application");
						return {
							trigger: root?.querySelector?.('input[name="prepTrigger"]')?.value?.trim() || "当指定条件满足时",
							action: root?.querySelector?.('input[name="prepAction"]')?.value?.trim() || "执行准备的快速动作",
						};
					},
				},
				{ action: "cancel", label: "取消", callback: () => null },
			],
			rejectClose: false,
		});
		return res && typeof res === "object" ? res : null;
	} catch { return null; }
}

function itemUsesLeft(item) {
	const u = item?.system?.uses;
	return typeof u === "object" && u !== null ? (Number(u.value) || 0) : (Number(u) || 0);
}

async function runPilotPatchAction(actor, def, opts = {}) {
	const targetedPilotTok = [...(game.user?.targets ?? [])].find(t => (t.actor ?? resolveActor(t.document?.uuid ?? t.uuid))?.type === "pilot");
	const targetActor = targetedPilotTok ? (targetedPilotTok.actor ?? resolveActor(targetedPilotTok.document?.uuid ?? targetedPilotTok.uuid)) : actor;
	const targetUuid = targetedPilotTok ? (targetedPilotTok.document?.uuid ?? targetedPilotTok.uuid) : (preferredTargetUuid(actor) ?? actor.uuid);
	const targetName = targetedPilotTok?.name ?? targetActor?.name ?? "驾驶员";
	const isDown = Boolean(targetActor?.statuses?.has?.("downandout") || (Number(targetActor?.system?.hp?.value) ?? 1) <= 0);

	const gearItem = (actor.items ?? []).find(i => {
		if (i.type && i.type !== "pilot_gear") return false;
		if (itemUsesLeft(i) <= 0) return false;
		const lid = String(i.system?.lid ?? "");
		const name = String(i.name ?? "").trim();
		return isDown
			? (lid === "pg_corrective" || name === "修复胶" || /^corrective$/i.test(name))
			: (lid === "pg_patch" || name === "补丁" || name === "止血贴" || /^patch$/i.test(name));
	});

	let useGear = Boolean(opts.useGear && gearItem);
	if (gearItem && opts.useGear === undefined && foundry?.applications?.api?.DialogV2?.wait) {
		try {
			const picked = await foundry.applications.api.DialogV2.wait({
				window: { title: `包扎 → ${targetName}` },
				content: `<p>检测到可用装备 <b>${escHtml(gearItem.name)}</b>（剩余 ${itemUsesLeft(gearItem)} 发），请选择包扎方式：</p>`,
				buttons: [
					{ action: "gear", label: `消耗 1 发${gearItem.name}（免检定生效）`, default: true, callback: () => "gear" },
					{ action: "roll", label: "进行技能触发 / 毅力检定（DC 10）", callback: () => "roll" },
				],
				rejectClose: false,
			});
			if (!picked) return false;
			useGear = picked === "gear";
		} catch { return false; }
	}

	let passed = false;
	let checkNote = "";
	if (useGear && gearItem) {
		await gearItem.update?.({ "system.uses": Math.max(0, itemUsesLeft(gearItem) - 1) });
		passed = true;
		checkNote = `消耗 1 发<b>${escHtml(gearItem.name)}</b>`;
	} else {
		const spec = await pickPilotCheckSpec(actor, `${def.title} → ${targetName}`, { preferLids: ["sk_patch", "sk_stay_cool", "sk_survive"], chosenSpec: opts.chosenSpec });
		if (!spec) return false;
		const rolled = await rollActorContestStat(actor, spec, `${def.title}（DC 10）`);
		if (!rolled.ok) return false;
		passed = rolled.total >= 10;
		checkNote = `${escHtml(rolled.statLabel)}检定 <b>${rolled.total}</b> vs DC 10`;
	}

	if (!passed) {
		await basicCard(actor, def, `<p>目标：<b>${escHtml(targetName)}</b> · ${checkNote} → <b style="color:#c62828">失败</b>。</p>`);
		return false;
	}

	const maxHp = Number(targetActor?.system?.hp?.max) || 6;
	const curHp = Number(targetActor?.system?.hp?.value) || 0;
	const nextHp = isDown ? Math.max(1, curHp) : Math.min(maxHp, curHp + Math.ceil(maxHp / 2));
	if (targetActor?.isOwner) {
		await targetActor.update?.({ "system.hp.value": nextHp });
		if (isDown && targetActor.statuses?.has?.("downandout")) {
			await targetActor.toggleStatusEffect("downandout", { active: false });
		}
	} else if (game.users?.activeGM) {
		game.socket?.emit(`module.${MODULE_ID}`, { action: "pilotPatchHeal", uuid: targetUuid, revive: isDown });
	}
	const healSummary = isDown
		? `解除<b>昏迷</b>并以 <b>1 HP</b> 恢复意识`
		: `HP 回复至 <b>${nextHp} / ${maxHp}</b>（+${Math.ceil(maxHp / 2)}）`;
	await basicCard(actor, def, `<p>目标：<b>${escHtml(targetName)}</b> · ${checkNote} → <b style="color:#2e7d32">成功</b>（${healSummary}）。</p>`);
	return true;
}

async function beginBasicAction(actor, key, opts = {}) {
	const def = BASIC_ACTIONS[key];
	if (!def || !actor) return false;
	if (def.type === "lockon") {
		const targets = [...(game.user?.targets ?? [])];
		if (!targets.length) { ui.notifications.warn("请先选中要锁定的目标（按 T 或用目标面板）。"); return false; }
		let n = 0;
		for (const t of targets) if (await applyStatusTo(t.document?.uuid ?? t.uuid, "lockon")) n++;
		let propheticNote = "";
		if (mechFrameLid(actor) === "mf_swallowtail" && actor.isOwner && getSetting("autoApplyStatus", true)) {
			await ensureCombatTurnState(actor);
			if (!getCombatState(actor).usedSwallowtailProphetic) {
				let shCount = 0;
				for (const t of targets) {
					if (await applyStatusTo(t.document?.uuid ?? t.uuid, "shredded")) shCount++;
				}
				await setCombatState(actor, { usedSwallowtailProphetic: true });
				if (shCount > 0) propheticNote = "（<b>先知扫描仪</b> 1/轮触发：目标同时陷入<b>离散</b>！）";
			}
		}
		await basicCard(actor, def, `<p>目标：${targets.map(t => escHtml(t.name)).join("、")}${propheticNote}</p>`);
		return n > 0;
	}
	if (def.type === "bolster") {
		const targets = [...(game.user?.targets ?? [])];
		if (!targets.length) { ui.notifications.warn("请先选中要强化的目标（按 T 或用目标面板）。"); return false; }
		let n = 0;
		const sysopFw = talentRank(actor, "t_sysop") >= 2;
		for (const t of targets) {
			const tUuid = t.document?.uuid ?? t.uuid;
			if (await applyStatusTo(tUuid, "bolster")) n++;
			if (sysopFw) {
				const tActor = t.actor ?? resolveActor(tUuid);
				await patchCombatStateCompat(tActor ?? tUuid, { sysopFirewall: true });
			}
		}
		const extraFw = sysopFw ? "；系统管理员 II「防火墙」：针对其科技攻击承受 +1 难度" : "";
		await basicCard(actor, def, `<p>目标：${targets.map(t => escHtml(t.name)).join("、")}（下次检定或豁免自动 +2 准度${extraFw}）</p>`);
		return n > 0;
	}
	if (def.type === "hide") {
		if (!actor.statuses?.has?.("hidden")) await actor.toggleStatusEffect("hidden", { active: true });
		await basicCard(actor, def);
		return true;
	}
	if (def.type === "search") {
		const Cls = game.lancer?.flows?.get?.("StatRollFlow");
		if (!Cls) return false;
		const flow = new Cls(actor.uuid, { title: def.title, path: def.path });
		const ok = await flow.begin({ ...flow.state.data, title: def.title, path: def.path });
		if (!ok) return false;
		const total = Number(flow.state?.data?.result?.roll?.total);
		const target = [...(game.user?.targets ?? [])][0];
		if (Number.isFinite(total) && target) {
			const tUuid = target.document?.uuid ?? target.uuid;
			const tActor = target.actor ?? resolveActor(tUuid);
			const respOpts = tActor?.type === "pilot" ? [{ key: "pilot", label: "技能触发 / 毅力" }] : [{ key: "agi", label: "敏捷" }];
			return createContestCard({
				kind: "search",
				title: "搜索 // 侦测匿迹对抗",
				initiatorUuid: preferredTargetUuid(actor) ?? actor.uuid,
				initiatorName: actor.token?.name ?? actor.name ?? "搜索方",
				initiatorStatLabel: "系统",
				initiatorTotal: total,
				responderUuid: tUuid,
				responderName: target.name ?? tActor?.name ?? "目标",
				responderOptions: respOpts,
			});
		}
		return true;
	}
	if (def.type === "pilotSearch") {
		const spec = await pickPilotCheckSpec(actor, def.title, { preferLids: ["sk_spot", "sk_investigate", "sk_read_a_situation"], chosenSpec: opts.chosenSpec });
		if (!spec) return false;
		const rolled = await rollActorContestStat(actor, spec, def.title);
		if (!rolled.ok) return false;
		const target = [...(game.user?.targets ?? [])][0];
		if (target) {
			const tUuid = target.document?.uuid ?? target.uuid;
			const tActor = target.actor ?? resolveActor(tUuid);
			const respOpts = tActor?.type === "pilot" ? [{ key: "pilot", label: "技能触发 / 毅力" }] : [{ key: "agi", label: "敏捷" }];
			return createContestCard({
				kind: "search",
				title: "驾驶员搜索 // 侦测匿迹对抗",
				initiatorUuid: preferredTargetUuid(actor) ?? actor.uuid,
				initiatorName: actor.token?.name ?? actor.name ?? "驾驶员",
				initiatorStatLabel: rolled.statLabel,
				initiatorTotal: rolled.total,
				responderUuid: tUuid,
				responderName: target.name ?? tActor?.name ?? "目标",
				responderOptions: respOpts,
			});
		}
		return true;
	}
	if (def.type === "breakGrapple") {
		const found = findActiveGrappleFor(actor);
		if (found) {
			if (found.role === "defender") return startGrappleContest(found.message, "break");
			return endGrapple(found.message, `${actor.name ?? "攻击方"} 主动松开擒拿`);
		}
		const target = [...(game.user?.targets ?? [])][0];
		if (target) {
			const rolled = await rollActorContestStat(actor, { mode: "stat", statKey: "hull", label: "机体" }, def.title);
			if (!rolled.ok) return false;
			const tUuid = target.document?.uuid ?? target.uuid;
			const tActor = target.actor ?? resolveActor(tUuid);
			return createContestCard({
				kind: "grappleBreak",
				title: "挣脱擒拿 // 机体对抗检定",
				initiatorUuid: preferredTargetUuid(actor) ?? actor.uuid,
				initiatorName: actor.token?.name ?? actor.name ?? "防御方",
				initiatorStatLabel: rolled.statLabel,
				initiatorTotal: rolled.total,
				initiatorAutoFail: rolled.autoFail,
				responderUuid: tUuid,
				responderName: target.name ?? tActor?.name ?? "擒拿方",
				responderOptions: [{ key: "hull", label: "机体" }],
			});
		}
		const StatCls = game.lancer?.flows?.get?.("StatRollFlow");
		if (StatCls) {
			const flow = new StatCls(actor.uuid, { title: def.title, path: "system.hull" });
			return flow.begin({ ...flow.state.data, title: def.title, path: "system.hull" });
		}
		ui.notifications?.warn?.("未找到进行中的擒拿记录；请先锁定擒拿你的对手，再点击「挣脱擒拿」。");
		return false;
	}
	if (def.type === "overwatch") {
		return executeOverwatchAttack(actor, opts);
	}
	if (def.type === "brace") {
		const rGate = await consumeReaction(actor, { kind: "brace", label: "受身", roundFlag: "usedBraceRound" });
		if (!rGate.ok) return false;
		const selfUuid = preferredTargetUuid(actor) ?? actor.uuid;
		const fLid = mechFrameLid(actor);
		const cs = getCombatState(actor);
		const bracePatch = { bracedActive: true, bracedUntilTurnEnd: true };
		const braceNotes = [];

		if (actor.statuses?.has?.("hidden")) {
			await setActorStatus(selfUuid, "hidden", false);
		}

		// 核心奖励「鬼影织物」：执行反应时隐形立即终止
		if (hasCoreBonus(actor, "cb_ghostweave") && cs.ghostweaveCloak && actor.statuses?.has?.("invisible")) {
			await setActorStatus(selfUuid, "invisible", false);
			bracePatch.ghostweaveCloak = false;
			braceNotes.push("执行反应解除鬼影织物隐形");
		}
		// 白巫「固化」：受身时获得 5 点护盾
		if (fLid === "mf_white_witch" && actor.isOwner) {
			const curOs = Number(actor.system?.overshield?.value) || 0;
			if (curOs < 5) {
				await actor.update?.({ "system.overshield.value": 5 });
				braceNotes.push("<b>固化</b>获得 5 点护盾");
			}
		}
		// 库图佐夫「应急姿场」：自身或友方库图佐夫感应内的盟友受身时，清除并忽略离散
		let hasKutuzovField = fLid === "mf_kutuzov";
		if (!hasKutuzovField) {
			const selfTok = attackerToken(actor);
			if (selfTok) {
				const myDisp = selfTok.document?.disposition ?? 1;
				hasKutuzovField = (globalThis.canvas?.tokens?.placeables ?? []).some(tok =>
					tok !== selfTok
					&& tok.actor
					&& (tok.document?.disposition ?? 1) === myDisp
					&& !tok.actor.statuses?.has?.("downandout")
					&& mechFrameLid(tok.actor) === "mf_kutuzov"
					&& (tokenDistance(tok, selfTok) ?? 999) <= (Number(tok.actor.system?.sensor_range) || 5),
				);
			}
		}
		if (hasKutuzovField) {
			bracePatch.kutuzovBraceProtected = true;
			if (actor.statuses?.has?.("shredded") && !isUnremovableShredded(actor)) {
				await setActorStatus(selfUuid, "shredded", false);
			}
			braceNotes.push("<b>应急姿场</b>清除并免疫离散");
		}

		for (const id of RESIST_IDS) {
			if (!actor.statuses?.has?.(id)) await actor.toggleStatusEffect(id, { active: true });
		}

		// 萨加玛塔「英雄本色」：1/场景，受身无需牺牲下一回合的任何动作或移动
		const useHeroism = fLid === "mf_sagarmatha" && !cs.usedSagarmathaHeroism;
		if (useHeroism) {
			bracePatch.usedSagarmathaHeroism = true;
			braceNotes.push("<b>英雄本色</b>（1/场景）免除下回合受身行动限制");
		} else {
			await actor.setFlag?.(MODULE_ID, "braced", true);
		}
		if (actor.isOwner) await setCombatState(actor, bracePatch);

		const extraTxt = braceNotes.length ? `<p>${braceNotes.join("；")}。</p>` : "";
		const limitHint = useHeroism
			? "结算完本次触发攻击的伤害后可点击下方按钮一键关闭临时抗性。"
			: "结算完本次触发攻击的伤害后可点击下方按钮一键关闭临时抗性。下回合开始时将自动发送行动限制提醒。";
		await basicCard(actor, def, `${extraTxt}<p>已自动开启<b>全部五种伤害抗性</b>；${limitHint}</p>`, {
			extraFlags: { braceCard: { uuid: selfUuid, name: actor.name } },
		});
		return true;
	}
	if (def.type === "standUp") {
		const isPesilat = mechFrameLid(actor) === "mf_ch_pesilat";
		if (actor.statuses?.has?.("immobilized") && !isPesilat) {
			ui.notifications?.warn?.("处于「固定」状态时无法起身！");
			return false;
		}
		const hadProne = Boolean(actor.statuses?.has?.("prone"));
		if (hadProne) await actor.toggleStatusEffect("prone", { active: false });
		const note = isPesilat
			? "<p>已触发<b>升阳模块</b>解除<b>伏卧</b>（不消耗标准移动，固定下仍可起身）。</p>"
			: (hadProne ? "<p>已解除<b>伏卧</b>。</p>" : "<p>已声明代替标准移动起身。</p>");
		await basicCard(actor, def, note);
		return true;
	}
	if (def.type === "declare") {
		if (key === "disengage") {
			if (actor.statuses?.has?.("engaged")) {
				await actor.toggleStatusEffect("engaged", { active: false });
			}
			await patchCombatStateCompat(actor, { disengagedThisTurn: true });
		}
		await basicCard(actor, def);
		return true;
	}
	if (def.type === "prepare") {
		const details = await promptPrepareDetails(actor, opts);
		if (!details) return false;
		const selfUuid = preferredTargetUuid(actor) ?? actor.uuid;
		await patchCombatStateCompat(actor, {
			preparedAction: {
				trigger: details.trigger,
				action: details.action,
				round: Number(globalThis.game?.combat?.round) || 0,
			},
		});
		await basicCard(actor, def, `<p><b>触发条件</b>：${escHtml(details.trigger)}<br><b>准备动作</b>：${escHtml(details.action)}</p>`, {
			extraFlags: {
				prepareCard: {
					uuid: selfUuid,
					name: actor.token?.name ?? actor.name ?? "角色",
					trigger: details.trigger,
					action: details.action,
					triggered: false,
					cancelled: false,
				},
			},
		});
		return true;
	}
	if (def.type === "shutDown") {
		const done = [];
		if (Number(actor.system?.heat?.value) > 0) {
			await actor.update?.({ "system.heat.value": 0 });
			done.push("热度归零");
		}
		for (const clr of ["exposed", "dangerzone", "lockon"]) {
			if (actor.statuses?.has?.(clr)) {
				await actor.toggleStatusEffect(clr, { active: false });
				done.push(`清除${ALL_STATUS_LABELS[clr] ?? clr}`);
			}
		}
		const cascadingItems = [...(actor.items ?? [])].filter(i => i?.system?.cascading === true);
		const cascTalentKeys = Array.isArray(getCombatState(actor).cascadingTalentNhps) ? getCombatState(actor).cascadingTalentNhps : [];
		if (cascadingItems.length || cascTalentKeys.length) {
			for (const ci of cascadingItems) {
				if (typeof ci.update === "function") await ci.update({ "system.cascading": false });
				else if (ci.system) ci.system.cascading = false;
			}
			if (cascTalentKeys.length) {
				await setCombatState(actor, { cascadingTalentNhps: [] });
			}
			const talentNames = cascTalentKeys.map(k => (k === "student_nhp" ? "学生级 NHP" : k === "unstable_nhp" ? "不稳定 NHP" : k));
			done.push(`稳定崩溃 NHP（${[...cascadingItems.map(i => i.name), ...talentNames].join("、")}）`);
		}
		for (const add of ["shutdown", "stunned"]) {
			if (!actor.statuses?.has?.(add)) await actor.toggleStatusEffect(add, { active: true });
		}
		done.push("进入关机与晕眩");
		await basicCard(actor, def, `<p>${done.join("；")}。</p>`);
		return true;
	}
	if (def.type === "bootUp") {
		const done = [];
		for (const clr of ["shutdown", "shut_down", "stunned"]) {
			if (actor.statuses?.has?.(clr)) {
				await actor.toggleStatusEffect(clr, { active: false });
				done.push(`解除${ALL_STATUS_LABELS[clr] ?? clr}`);
			}
		}
		await basicCard(actor, def, `<p>${done.length ? done.join("；") : "机甲已完成开机就绪"}。</p>`);
		return true;
	}
	if (def.type === "selfDestruct") {
		await basicCard(actor, def, "", { allowAutoScan: true });
		return true;
	}
	if (def.type === "eject") {
		if (!actor.statuses?.has?.("impaired")) await actor.toggleStatusEffect("impaired", { active: true });
		const pilot = actor.system?.pilot?.value;
		if (pilot?.isOwner && pilot.system?.mounted === true) await pilot.update?.({ "system.mounted": false });
		await basicCard(actor, def, "<p>机甲已标记为<b>受损</b>（持续至全面维修）；请将驾驶员指示物沿直线飞行最多 <b>6 空间</b>。</p>");
		return true;
	}
	if (def.type === "mountDismount") {
		const pilot = actor.type === "pilot" ? actor : actor.system?.pilot?.value;
		let note = "";
		if (pilot?.isOwner && typeof pilot.system?.mounted === "boolean") {
			const nextMounted = !pilot.system.mounted;
			await pilot.update?.({ "system.mounted": nextMounted });
			note = nextMounted
				? `<p><b>${escHtml(pilot.name)}</b> 已<b>上马</b>进入机甲驾驶舱。</p>`
				: `<p><b>${escHtml(pilot.name)}</b> 已<b>下马</b>离开驾驶舱（置于邻接空间）。</p>`;
		}
		await basicCard(actor, def, note);
		return true;
	}
	if (def.type === "pilotJockey") {
		const target = [...(game.user?.targets ?? [])][0];
		if (!target) {
			ui.notifications?.warn?.("请先锁定要骑乘的邻接敌方机甲（按 T）。");
			return false;
		}
		const tUuid = target.document?.uuid ?? target.uuid;
		const tActor = target.actor ?? resolveActor(tUuid);
		const spec = await pickPilotCheckSpec(actor, def.title, {
			preferLids: ["sk_take_control", "sk_assault", "sk_apply_fists_to_faces", "sk_get_somewhere_quickly", "sk_stay_cool"],
			chosenSpec: opts.chosenSpec,
		});
		if (!spec) return false;
		const rolled = await rollActorContestStat(actor, spec, def.title);
		if (!rolled.ok) return false;
		return createContestCard({
			kind: "jockey",
			title: "步战骑乘 // 对抗检定",
			initiatorUuid: preferredTargetUuid(actor) ?? actor.uuid,
			initiatorName: actor.token?.name ?? actor.name ?? "驾驶员",
			initiatorStatLabel: rolled.statLabel,
			initiatorTotal: rolled.total,
			responderUuid: tUuid,
			responderName: target.name ?? tActor?.name ?? "敌方机甲",
			responderOptions: [{ key: "hull", label: "机体" }, { key: "agi", label: "敏捷" }],
		});
	}
	if (def.type === "pilotPatch") return runPilotPatchAction(actor, def, opts);
	if (def.type === "pilotReload") {
		const isLoadingWpn = i => i.type === "pilot_weapon" && i.system?.loaded === false
			&& ((i.system.tags ?? []).some(t => t.is_loading || t.lid === "tg_loading") || i.getTags?.()?.some?.(t => t.is_loading || t.lid === "tg_loading"));
		const reload = (actor.items ?? []).filter(isLoadingWpn);
		if (reload.length) {
			await actor.updateEmbeddedDocuments?.("Item", reload.map(i => ({ _id: i.id, "system.loaded": true })));
		}
		await basicCard(actor, def, `<p>${reload.length ? `已装填：${reload.map(i => escHtml(i.name)).join("、")}` : "当前没有待装填的驾驶员装填武器。"}</p>`);
		return true;
	}
	if (def.type === "stabilize") return npcStabilize(actor, def);
	const Cls = game.lancer?.flows?.get?.(def.type === "check" ? "StatRollFlow" : def.flow);
	if (!Cls) return false;
	if (def.type === "check") {
		const flow = new Cls(actor.uuid, { title: def.title, path: def.path });
		return flow.begin({ ...flow.state.data, title: def.title, path: def.path });
	}
	const flow = new Cls(actor.uuid, { title: def.title, invade: !!def.invade, effect: def.effect });
	flow.lancerCnBasic = key;
	// Flow.begin(data) 用 data 取代整个状态，并把它当作各步骤的选项：标题要从这里传，否则会被换成 BASIC ATTACK / TECH ATTACK
	const data = { ...flow.state.data, title: def.title, effect: def.effect };
	if (def.invade) data.invade = true;
	pendingBasic = { actorUuid: actor.uuid, key };
	try { return await flow.begin(data); }
	finally { if (pendingBasic?.key === key) pendingBasic = null; }
}

// NPC 稳住阵脚：清除热度与暴露，填装装填武器（NPC 不能借此恢复 HP 或清除其他状态）
async function npcStabilize(actor, def) {
	const done = [];
	if (Number(actor.system?.heat?.value) > 0) { await actor.update({ "system.heat.value": 0 }); done.push("热度归零"); }
	if (actor.statuses?.has("exposed")) { await actor.toggleStatusEffect("exposed", { active: false }); done.push("清除暴露"); }
	const reload = (actor.items ?? []).filter(i => i.type === "npc_feature" && i.system?.loaded === false && (i.system.tags ?? []).some(t => t.is_loading || t.lid === "tg_loading"));
	if (reload.length) {
		await actor.updateEmbeddedDocuments("Item", reload.map(i => ({ _id: i.id, "system.loaded": true })));
		done.push(`填装：${reload.map(i => escHtml(i.name)).join("、")}`);
	}
	await basicCard(actor, def, `<p>${done.length ? done.join("；") : "没有需要清除或填装的。"}</p>`);
	return true;
}

const CHAT_STATUS_REF_MAP = {
	exposed: ["exposed", "暴露"],
	impaired: ["impaired", "受损"],
	stunned: ["stunned", "晕眩"],
	slow: ["slow", "缓慢"],
	slowed: ["slow", "缓慢"],
	prone: ["prone", "伏卧"],
	immobilized: ["immobilized", "固定"],
	jammed: ["jammed", "受扰"],
	shredded: ["shredded", "离散"],
	lockon: ["lockon", "锁定"],
	hidden: ["hidden", "匿迹"],
	invisible: ["invisible", "隐形"],
	engaged: ["engaged", "交战"],
	shutdown: ["shutdown", "关机"],
	dangerzone: ["dangerzone", "超温危域"],
	downandout: ["downandout", "昏迷"],
};

function normalizeChatStatusRefs(content) {
	if (typeof content !== "string" || !content) return content;
	return content
		.replace(/@Compendium\[world\.status-items\.([A-Za-z_-]+)\](?:\{([^}]*)\})?/g, (m, rawKey, label) => {
			const hit = CHAT_STATUS_REF_MAP[rawKey.toLowerCase().replace(/[-_\s]/g, "")];
			if (!hit) return m;
			const zh = label && /[㐀-鿿]/.test(label) ? label : hit[1];
			return `@LancerID[${hit[0]}]{${zh}}`;
		})
		.replace(/@LancerID\[([A-Za-z_-]+)\](?!\{)/g, (m, rawLid) => {
			const hit = CHAT_STATUS_REF_MAP[rawLid.toLowerCase().replace(/[-_\s]/g, "")];
			return hit ? `@LancerID[${rawLid}]{${hit[1]}}` : m;
		});
}

function onPreCreateBasicCard(message) {
	if (typeof message?.content === "string" && (!game?.i18n?.lang || game.i18n.lang === "cn")) {
		const normalizedContent = normalizeChatStatusRefs(message.content);
		if (normalizedContent !== message.content) {
			message.updateSource({ content: normalizedContent });
		}
	}
	if (pendingTableStatuses?.actorUuid && (pendingTableStatuses.statuses?.length || pendingTableStatuses.kind)) {
		message.updateSource({ [`flags.${MODULE_ID}.tableStatuses`]: { ...pendingTableStatuses } });
		return;
	}
	const atk = message.flags?.lancer?.attackData;
	const dmgData = message.flags?.lancer?.damageData;
	if (pendingDamageCardCtx && dmgData) {
		message.updateSource({ [`flags.${MODULE_ID}.damageCtx`]: { ...pendingDamageCardCtx } });
	}
	if (pendingCardItemMeta && (!pendingCardItemMeta.ts || Date.now() - pendingCardItemMeta.ts < 5000) && !atk && !dmgData) {
		const meta = pendingCardItemMeta;
		pendingCardItemMeta = null;
		if (meta.actorUuid || meta.itemUuid) {
			message.updateSource({ [`flags.${MODULE_ID}.cardItemMeta`]: { actorUuid: meta.actorUuid, itemUuid: meta.itemUuid } });
		}
	}
	if (pendingCpAttackMeta && atk && atk.attackerUuid === pendingCpAttackMeta.actorUuid) {
		message.updateSource({ [`flags.${MODULE_ID}.cpAttack`]: { ...pendingCpAttackMeta } });
	}
	if (pendingTechActionMeta && atk && (!pendingTechActionMeta.actorUuid || atk.attackerUuid === pendingTechActionMeta.actorUuid)) {
		message.updateSource({ [`flags.${MODULE_ID}.techActionMeta`]: { ...pendingTechActionMeta } });
	}
	if (pendingWeaponAttackFlags && atk && (!pendingWeaponAttackFlags.actorUuid || atk.attackerUuid === pendingWeaponAttackFlags.actorUuid)) {
		const wf = pendingWeaponAttackFlags;
		const patch = {};
		if (wf.infiltratorAmbush) patch[`flags.${MODULE_ID}.infiltratorAmbush`] = true;
		if (wf.brawlerKnockout) patch[`flags.${MODULE_ID}.brawlerKnockout`] = true;
		if (wf.watchThisArmed) patch[`flags.${MODULE_ID}.watchThisArmed`] = true;
		if (wf.gunslingerHeartKill) patch[`flags.${MODULE_ID}.gunslingerHeartKill`] = true;
		if (wf.walkingArmoryAmmo) patch[`flags.${MODULE_ID}.walkingArmoryAmmo`] = wf.walkingArmoryAmmo;
		if (wf.thrownAttack) patch[`flags.${MODULE_ID}.thrownAttack`] = true;
		if (wf.overwatchAttack) patch[`flags.${MODULE_ID}.overwatchAttack`] = true;
		const cpDmgPatch = {
			...(message.flags?.[MODULE_ID]?.cpDamageMod ?? {}),
			...(wf.ap ? { ap: true } : {}),
			...(wf.crackShotZeroIn ? { crackShotZeroIn: true } : {}),
			...(wf.noBonusDamage ? { noBonusDamage: true } : {}),
			...(wf.wanderingBladeThrownFar ? { wanderingBladeThrownFar: true } : {}),
			...(wf.nat20Uuids?.length ? { nat20Uuids: [...wf.nat20Uuids] } : {}),
		};
		if (Object.keys(cpDmgPatch).length) patch[`flags.${MODULE_ID}.cpDamageMod`] = cpDmgPatch;
		if (Object.keys(patch).length) message.updateSource(patch);
	}
	if (!pendingBasic || !atk || atk.attackerItemUuid || atk.attackerUuid !== pendingBasic.actorUuid) return;
	message.updateSource({ [`flags.${MODULE_ID}.basicAction`]: pendingBasic.key });
}
Hooks.on("preCreateChatMessage", onPreCreateBasicCard);

function basicActionsHTML(actorType = "mech") {
	const btn = ([key, d]) => `<button type="button" class="lancer-flow-button lancer-button lancer-secondary" data-lancer-cn-basic="${key}" title="${d.kind}">
		<i class="${d.icon} i--4"></i> ${d.name}<span style="opacity:.7;font-size:.85em;margin-left:.3em">${d.kind}</span></button>`;
	const list = Object.entries(BASIC_ACTIONS).filter(([, d]) => d.actors.includes(actorType));
	const primary = list.filter(([, d]) => d.group !== "tactical");
	const tactical = list.filter(([, d]) => d.group === "tactical");
	const tacBlock = tactical.length
		? `<div style="border-top:1px dashed rgba(128,128,128,.35);margin:2px 6px 0"></div><div class="lancer-flow-button-grid" style="flex-wrap:wrap">${tactical.map(btn).join("")}</div>`
		: "";
	return `<div class="card clipped lancer-cn-basic">
		<span class="lancer-header lancer-primary submajor">基础动作</span>
		<div class="lancer-flow-button-grid" style="flex-wrap:wrap">${primary.map(btn).join("")}</div>${tacBlock}</div>`;
}

function resistancesHTML(actor) {
	const has = id => Boolean(actor?.statuses?.has?.(id) || actor?.system?.resistances?.[id.replace("resistance_", "")]);
	const allOn = RESIST_IDS.every(has);
	const pill = ([id, short, full]) => {
		const on = has(id);
		return `<button type="button" class="lancer-button ${on ? "lancer-primary" : "lancer-secondary"}" data-lancer-cn-resist="${id}" title="${full}（点击切换）" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.6;opacity:${on ? "1" : ".78"}"><i class="mdi mdi-shield-half-full"></i> ${short}${on ? " ✓" : ""}</button>`;
	};
	const allBtn = `<button type="button" class="lancer-button ${allOn ? "lancer-primary" : "lancer-secondary"}" data-lancer-cn-resist="all" title="一键开启或关闭全部五种伤害抗性" style="width:auto;flex:0 0 auto;padding:0 .6em;line-height:1.6;opacity:${allOn ? "1" : ".85"}">全抗性${allOn ? " ✓" : ""}</button>`;
	const tokDoc = resolveSceneTokenDocForTarget(actor);
	const auraSpec = tokDoc ? getEffectiveCoverAuraSpec(tokDoc, actor) : null;
	const auraOn = Boolean(auraSpec?.enabled && !isCoverSourceIncapacitated(tokDoc, actor));
	const auraBtn = actor?.type === "deployable"
		? ""
		: `<button type="button" class="lancer-button ${auraOn ? "lancer-primary" : "lancer-secondary"}" data-lancer-cn-cover-aura="dialog" title="为场上该角色指示物绑定或调整随动软/硬掩护区域（当前：${escHtml(formatCoverAuraSummary(auraSpec))}）" style="width:auto;flex:0 0 auto;padding:0 .6em;line-height:1.6;opacity:${auraOn ? "1" : ".82"}"><i class="fas fa-shield-halved"></i> 跟随掩护圈${auraOn ? " ✓" : ""}</button>`;
	return `<div class="card clipped lancer-cn-resist">
		<span class="lancer-header lancer-primary submajor">抗性开关</span>
		<div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 6px;align-items:center">${RESIST_DEFS.map(pill).join("")}${allBtn}${auraBtn}</div></div>`;
}

function deployableCoverAuraCardHTML(actor) {
	const tokDoc = resolveSceneTokenDocForTarget(actor);
	const curSpec = tokDoc ? getEffectiveCoverAuraSpec(tokDoc, actor) : inferDeployableCoverSpec(null, actor);
	const summary = tokDoc ? formatCoverAuraSummary(curSpec) : `${formatCoverAuraSummary(curSpec)}（拖上地图后自动生效）`;
	const presetBtns = COVER_AURA_PRESETS.map(p =>
		`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-cover-aura="preset:${escHtml(p.key)}" title="${escHtml(p.title ?? p.label)}" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.6">${escHtml(p.label)}</button>`,
	).join("");
	const customBtn = `<button type="button" class="lancer-button lancer-primary" data-lancer-cn-cover-aura="dialog" title="自定义掩护类型、爆发范围与自身受益选项" style="width:auto;flex:0 0 auto;padding:0 .6em;line-height:1.6"><i class="fas fa-sliders"></i> 自定义…</button>`;
	return `<div class="card clipped full lancer-cn-cover-aura-card">
		<span class="lancer-header lancer-primary submajor">跟随掩护区域（随棋子移动）</span>
		<div style="padding:4px 6px;font-size:12px;opacity:.88">当前：<b>${escHtml(summary)}</b></div>
		<div style="display:flex;flex-wrap:wrap;gap:4px;padding:2px 6px 6px;align-items:center">${presetBtns}${customBtn}</div></div>`;
}

async function toggleActorResistance(actor, key) {
	if (!actor?.toggleStatusEffect) return false;
	if (key === "all") {
		const allOn = RESIST_IDS.every(id => actor.statuses?.has?.(id));
		for (const id of RESIST_IDS) {
			if (Boolean(actor.statuses?.has?.(id)) === allOn) await actor.toggleStatusEffect(id, { active: !allOn });
		}
		return !allOn;
	}
	if (!RESIST_IDS.includes(key)) return false;
	const next = !actor.statuses?.has?.(key);
	await actor.toggleStatusEffect(key, { active: next });
	return next;
}

// 权宜攻击与雷利「雷神」动态齐射伤害：拦下攻击卡「掷伤害」按钮，预填准确公式与穿甲标签后发起 DamageRollFlow
async function rollBasicDamage(message, def, cpAtk = null) {
	const atk = message.getFlag("lancer", "attackData");
	const actor = await fromUuid(atk.attackerUuid);
	if (!actor?.isOwner) return ui.notifications.error(`你不拥有 ${actor?.name ?? "攻击者"}，不能为其掷伤害。`);
	const saveMap = message.getFlag?.(MODULE_ID, "saveResults") ?? {};
	const zeroUuids = Object.values(saveMap).filter(r => r?.passed && r?.noDamageOnSuccess).map(r => r.uuid);
	const halfUuids = Object.values(saveMap).filter(r => r?.passed && r?.halfOnSuccess && !r?.noDamageOnSuccess).map(r => r.uuid);
	const dmgMod = message.getFlag?.(MODULE_ID, "cpDamageMod");
	const hit_results = [];
	for (const t of atk.targets ?? []) {
		if (zeroUuids.some(u => u === t.uuid || sameActorRef(u, t.uuid))) continue;
		const target = resolveDocSync(t.uuid);
		if (!target?.object) continue;
		const usedLockOn = Boolean(t.setConditions?.lockon === false || t.setConditions?.lockOn === false);
		hit_results.push({ target: target.object, total: t.total, usedLockOn, hit: t.hit, crit: t.crit });
	}
	let title = `${def?.name ?? "攻击"} 伤害`;
	let damage = def?.damage ? def.damage(actor).map(d => ({ ...d })) : [];
	let ap = Boolean(def?.ap || (message.getFlag(MODULE_ID, "basicAction") === "improvised" && isCoreActiveOn(actor, "mf_ch_pesilat")));
	let attack_type = "Melee";
	if (cpAtk?.kind === "raleighMjolnir") {
		const chambers = Math.max(1, Number(cpAtk.chambers) || 1);
		title = `雷神齐射（${chambers} 发）伤害`;
		damage = [{ type: "Kinetic", val: String(4 * chambers) }];
		ap = chambers >= 4;
		attack_type = "Ranged";
	}
	const Cls = game.lancer.flows.get("DamageRollFlow");
	const flow = new Cls(actor.uuid, {
		title, configurable: true, invade: false, ap, attack_type, hit_results,
		has_normal_hit: hit_results.some(h => h.hit && !h.crit), has_crit_hit: hit_results.some(h => h.crit),
		damage, bonus_damage: [],
	});
	if (flow.state?.data) {
		flow.state.data.attack_type = attack_type;
		if (halfUuids.length) flow.state.data.lancerCnHalfUuids = [...halfUuids];
		if (zeroUuids.length) flow.state.data.lancerCnZeroUuids = [...zeroUuids];
		if (dmgMod && typeof dmgMod === "object") flow.state.data.lancerCnDamageMod = { ...dmgMod };
	}
	pendingHalfUuids = halfUuids.length ? halfUuids : null;
	pendingZeroUuids = zeroUuids.length ? zeroUuids : null;
	if (dmgMod && typeof dmgMod === "object") pendingDamageMod = { ...dmgMod };
	try {
		return await flow.begin();
	} finally {
		pendingHalfUuids = null;
		pendingZeroUuids = null;
		pendingDamageMod = null;
	}
}

function onBasicDamageClick(event) {
	const btn = event.target?.closest?.(".lancer-damage-flow");
	if (!btn) return;
	const id = btn.closest(".chat-message")?.dataset?.messageId;
	const message = id && game.messages?.get(id);
	const def = BASIC_ACTIONS[message?.getFlag?.(MODULE_ID, "basicAction")];
	const cpAtk = message?.getFlag?.(MODULE_ID, "cpAttack");
	if (!def?.damage && cpAtk?.kind !== "raleighMjolnir") return;
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
	rollBasicDamage(message, def, cpAtk).catch(err => console.error(`${MODULE_ID} |`, err));
}

// ---------------------------------------------------------------------------
// 受限次数
// 1. 受限值是掷骰式的武器（原型武器 I / II 受限 1d6+2、III 受限 2d6）：系统按 parseInt 读成 1 次。
//    这里改成按掷出的结果（存在物品 flags.lancer-cn.limitedRoll）计算上限，再加机甲的受限加值；
//    「USES」格子旁加「掷 1d6+2」按钮；全面维修后自动重掷。没掷过时上限为 0，提示先掷。
// 2. 只写在文字里的受限（骨架特性、系统动作、天赋等，Foundry 没有次数栏）：机甲表上另列「受限次数」卡片，
//    次数存在机甲的 flags.lancer-cn.counters，全面维修后回满。
const DICE_FORMULA = /^\s*\d*d\d+(?:\s*[+-]\s*\d+)?\s*$/i;
const isDiceFormula = v => typeof v === "string" && DICE_FORMULA.test(v);
const limitedTag = item => { try { return item?.getTags?.()?.find(t => t.is_limited) ?? null; } catch { return null; } };
const diceLimited = item => { const t = limitedTag(item); return t && isDiceFormula(String(t.val)) ? String(t.val).replace(/\s+/g, "") : null; };
const limitedBonus = actor => (actor?.type === "mech" ? Number(actor.system?.loadout?.limited_bonus) || 0 : 0);

function patchLimitedMax() {
	const proto = globalThis.CONFIG?.Item?.documentClass?.prototype;
	if (!proto?.prepareFinalAttributes || proto.prepareFinalAttributes.lancerCn) return;
	const orig = proto.prepareFinalAttributes;
	proto.prepareFinalAttributes = function (...args) {
		const r = orig.apply(this, args);
		try {
			if (diceLimited(this) && this.system?.uses) {
				const rolled = Number(this.getFlag?.(MODULE_ID, "limitedRoll")) || 0;
				this.system.uses.max = rolled ? rolled + limitedBonus(this.actor) : 0;
			}
			applyKnifeJugglerTags(this);
		} catch (err) { reportError("计算受限次数", err); }
		return r;
	};
	proto.prepareFinalAttributes.lancerCn = true;
}

// 载入时已经算过的物品按新的上限重算，并刷新打开的角色表（同步激活猎人 II「匕首戏法」投掷 5 标签）
function refreshDiceLimited() {
	const actors = [...(game.actors ?? [])];
	for (const scene of game.scenes ?? []) for (const t of scene.tokens ?? []) if (t.actor && !t.actorLink) actors.push(t.actor);
	for (const a of actors) {
		const hasDiceLim = (a.items ?? []).some(diceLimited);
		const hasKnifeJuggler = (a.type === "mech" || a.is_mech?.()) && talentRank(a, "t_hunter") >= 2;
		if (!hasDiceLim && !hasKnifeJuggler) continue;
		try { a.reset?.(); if (a.sheet?.rendered) a.sheet.render(false); } catch (err) { reportError("重算受限次数", err); }
	}
}

async function rollLimited(item, { quiet = false } = {}) {
	const formula = diceLimited(item);
	if (!formula) return null;
	const roll = await new Roll(formula).evaluate();
	await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: item.actor }), flavor: `${item.name}：受限次数（${formula}）` }, quiet ? { rollMode: "selfroll" } : undefined);
	const max = roll.total + limitedBonus(item.actor);
	await item.update({ [`flags.${MODULE_ID}.limitedRoll`]: roll.total, "system.uses": max });
	return max;
}

// 文字里的受限：「受限3」「受限 1」；「受限1/回合」这类写法有歧义，不计（见文档）
const TEXT_LIMITED = /受限\s*(\d+d\d+(?:[+-]\d+)?|\d+)(?!\s*[/／\d])/g;
const stripTags = s => String(s ?? "").replace(/<[^>]+>/g, "");
function textLimitedOf(item) {
	if (limitedTag(item)) return []; // 系统已经计数
	const s = item.system ?? {};
	const sources = [];
	if (item.type === "frame") {
		const cs = s.core_system ?? {};
		const passive = stripTags(cs.passive_name).replace(/（.*$/, "").trim() || item.name;
		sources.push([passive, cs.passive_name, cs.passive_effect]);
		for (const t of s.traits ?? []) sources.push([t.name, t.description]);
	} else if (item.type === "talent") {
		// 天赋文字里括号中的「（0 SP、受限6……）」是所给装备的摘要，装备本身是单独的物品、由系统计数
		for (const r of (s.ranks ?? []).slice(0, s.curr_rank ?? 0)) sources.push([r.name, stripTags(r.description).replace(/（[^）]*）|\([^)]*\)/g, "")]);
	} else {
		sources.push([item.name, s.effect]);
	}
	for (const a of s.actions ?? []) sources.push([a.name, a.detail]);
	const out = [];
	for (const [label, ...texts] of sources) {
		for (const t of texts) {
			const plain = stripTags(t);
			for (const m of plain.matchAll(TEXT_LIMITED)) {
				const max = m[1];
				if (out.some(o => o.max === max)) continue; // 同一物品重复写的同一个受限
				out.push({ key: `${item.id}_${out.length}`, item, label: label && label !== item.name ? `${item.name} · ${label}` : item.name, max });
			}
		}
	}
	return out;
}

function textCounters(mech) {
	const items = [...(mech.items ?? [])];
	const pilot = mech.system?.pilot?.value;
	for (const t of pilot?.itemTypes?.talent ?? []) items.push(t);
	return items.flatMap(textLimitedOf);
}

function counterState(mech, c) {
	const saved = mech.getFlag?.(MODULE_ID, `counters.${c.key}`) ?? {};
	const max = isDiceFormula(c.max) ? Number(saved.max) || 0 : Number(c.max);
	const value = Math.min(max, Number.isFinite(saved.value) ? saved.value : max);
	return { max, value };
}

function countersHTML(mech, counters) {
	const rows = counters.map(c => {
		const { max, value } = counterState(mech, c);
		const hexes = Array.from({ length: max }, (_, i) => `<a data-lancer-cn-counter="${c.key}" data-available="${i < value}"><i class="mdi ${i < value ? "mdi-hexagon-slice-6" : "mdi-hexagon-outline"} theme--light"></i></a>`).join("");
		const dice = isDiceFormula(c.max) ? `<button type="button" data-lancer-cn-counter-roll="${c.key}" style="flex:0 0 auto;width:auto;line-height:1.4;padding:0 .5em;margin:0">掷 ${c.max}</button>` : "";
		return `<div style="display:flex;align-items:center;gap:6px;padding:2px 6px"><span style="flex:1">${escHtml(c.label)}</span><span>${hexes || (dice ? "未掷" : "")}</span>${dice}<span style="opacity:.7">${value} / ${max}</span></div>`;
	}).join("");
	return `<div class="card clipped lancer-cn-counters">
		<span class="lancer-header lancer-primary submajor">受限次数（文字中的受限，系统不计数）</span>${rows}
		<div style="text-align:right;padding:2px 6px"><button type="button" data-lancer-cn-counter-reset style="width:auto;line-height:1.4;padding:0 .6em">全部回满</button></div></div>`;
}

async function setCounter(mech, c, value, max) {
	const st = counterState(mech, c);
	await mech.setFlag(MODULE_ID, `counters.${c.key}`, { value: Math.max(0, Math.min(max ?? st.max, value)), ...(max !== undefined ? { max } : isDiceFormula(c.max) ? { max: st.max } : {}) });
}

async function rollCounter(mech, c) {
	const roll = await new Roll(c.max).evaluate();
	await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: mech }), flavor: `${c.label}：受限次数（${c.max}）` });
	await setCounter(mech, c, roll.total, roll.total);
}

async function resetCounters(mech, { roll = true } = {}) {
	for (const c of textCounters(mech)) {
		if (isDiceFormula(c.max)) { if (roll) await rollCounter(mech, c); }
		else await mech.unsetFlag(MODULE_ID, `counters.${c.key}`);
	}
}

// 全面维修：重掷掷骰式受限，回满文字受限，重置全面维修级天赋/核心奖励状态，并重置核心协议状态（回满 1 CP）
async function onFullRepair(flow, success) {
	if (!success) return;
	const actor = flow?.state?.actor;
	const actors = [actor, actor?.system?.active_mech?.value].filter((a, i, arr) => a && arr.indexOf(a) === i);
	for (const a of actors) {
		if (!a.isOwner) continue;
		for (const item of a.items ?? []) if (diceLimited(item)) await rollLimited(item);
		if (a.type === "mech" || a.is_mech?.()) {
			await resetCounters(a);
			await resetFullRepairTalentState(a);
			await endCorePower(a, { reason: "全面维修", refundOverride: true });
		} else if (a.type === "npc" || a.is_npc?.()) {
			await resetNpcCombatState(a);
		}
	}
}

// 机甲表「天赋与核心战术栏」：仅在驾驶员具备对应天赋骰、特殊武器/改装或战斗核心奖励时渲染
function renderTalentControlHTML(actor) {
	if (!actor || (actor.type !== "mech" && !actor.is_mech?.())) return "";
	const parts = [];
	const cfg = getTalentConfig(actor);
	const cs = getCombatState(actor);
	const fLid = mechFrameLid(actor);

	// 1. 天赋骰与机甲专属骰计数器（含吉尔伽美什「军备骰」）
	for (const [key, def] of Object.entries(TALENT_DICE_DEFS)) {
		if (!hasDieQualification(actor, def)) continue;
		const val = getTalentDie(actor, key);
		parts.push(
			`<span class="lancer-cn-tdie" style="display:inline-flex;align-items:center;gap:2px;padding:1px 6px;border-radius:3px;background:rgba(128,128,128,.16);font-size:.86em">`
			+ `<b>${escHtml(def.label)}</b>：<b data-lancer-cn-tdie-val="${key}" style="min-width:1.1em;text-align:center">${val}</b>`
			+ `<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="dieDec:${key}" title="减少 ${escHtml(def.label)}" style="width:auto;padding:0 .35em;line-height:1.25;margin:0">-</button>`
			+ `<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="dieInc:${key}" title="增加 ${escHtml(def.label)}" style="width:auto;padding:0 .35em;line-height:1.25;margin:0">+</button>`
			+ `</span>`,
		);
		if (key === "gilgamesh" && val === 1) {
			parts.push(`<button type="button" class="lancer-button lancer-primary" data-lancer-cn-talent-act="gilgameshReroll" title="战备就绪：军备骰为 1 时重置为 6，并重掷一次攻击、检定或豁免（必须保留第二次结果）" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.55">🎲 军备重掷（重置→6）</button>`);
		}
	}

	// 2. 拟态枪 3d20 序列与校准按钮
	if (hasWeaponLidOnMech(actor, "mw_mimic_gun")) {
		const mv = cs.mimicValues;
		const seq = Array.isArray(mv) && mv.length === 3
			? `${mv[0]}/${mv[1]}/${mv[2]}（伤 ${1 + Math.ceil(mv[0] / 2)}）`
			: "未校准";
		parts.push(`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="rollMimic" title="掷 3d20 校准拟态枪射程序列 [X, Y, Z]" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.55">🎲 拟态枪 [${escHtml(seq)}]</button>`);
	}

	// 3. 演说家 II/III「理性之声 / 远征记」自由动作消耗按钮
	const oratorR = talentRank(actor, "mf_orator");
	if (oratorR >= 2) {
		parts.push(`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="oratorSpend:1:激励" title="自由动作（1/轮）：消耗 1 演说家骰，盟友立即系统检定清除一个非自身状态（每持有 1 演说家骰 +1 准度）" style="width:auto;flex:0 0 auto;padding:0 .5em;line-height:1.55">🗣️ 激励(-1骰)</button>`);
		parts.push(`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="oratorSpend:2:探究" title="自由动作（1/轮）：消耗 2 演说家骰，针对指定敌方目标的下一次攻击检定掷两次取高" style="width:auto;flex:0 0 auto;padding:0 .5em;line-height:1.55">🗣️ 探究(-2骰)</button>`);
		parts.push(`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="oratorSpend:2:反间" title="自由动作（1/轮）：消耗 2 演说家骰，指定敌方目标在其下一回合结束前无法从盟友系统或特性获益" style="width:auto;flex:0 0 auto;padding:0 .5em;line-height:1.55">🗣️ 反间(-2骰)</button>`);
		if (oratorR >= 3) {
			parts.push(`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="oratorSpend:3:挫败" title="自由动作（1/轮）：消耗 3 演说家骰，令敌方目标动摇（不能移动、攻击、迫使豁免或执行科技动作直到其下一回合结束）" style="width:auto;flex:0 0 auto;padding:0 .5em;line-height:1.55">🗣️ 挫败(-3骰)</button>`);
		}
	}

	// 4. 核心奖励「适应性反应炉」：2 维修换 +1 反应炉压力
	if (hasCoreBonus(actor, "cb_adaptive_reactor")) {
		parts.push(`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="adaptiveReactor" title="稳住阵脚选择散热时：消耗 2 点维修容量恢复 1 点反应炉压力" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.55">🔧 2维修→+1压力</button>`);
	}

	// 5. 挂载/弹药选择器（自稳定承力点、超功率口径、自走兵器库）
	const mechWeapons = (actor.items ?? []).filter(i => (i?.type === "mech_weapon" || i?.is_mech_weapon?.()) && !i.system?.destroyed);
	const weaponOptionsHTML = selectedId => mechWeapons.map((w, idx) => {
		const wid = w.id || w.uuid || String(idx);
		const sel = (selectedId ? wid === selectedId : idx === 0) ? " selected" : "";
		return `<option value="${escHtml(wid)}"${sel}>${escHtml(w.name)}</option>`;
	}).join("");
	if (hasCoreBonus(actor, "cb_auto_stabilizing_hardpoints") && mechWeapons.length) {
		parts.push(`<label style="display:inline-flex;align-items:center;gap:3px;font-size:.86em"><span>自稳定：</span><select data-lancer-cn-talent-sel="autoStabWeaponId" style="height:1.65em;padding:0 4px">${weaponOptionsHTML(cfg.autoStabWeaponId)}</select></label>`);
	}
	if (hasCoreBonus(actor, "cb_overpower_caliber") && mechWeapons.length) {
		parts.push(`<label style="display:inline-flex;align-items:center;gap:3px;font-size:.86em"><span>超功率：</span><select data-lancer-cn-talent-sel="overpowerWeaponId" style="height:1.65em;padding:0 4px">${weaponOptionsHTML(cfg.overpowerWeaponId)}</select></label>`);
	}
	const waRank = talentRank(actor, "t_walking_armory");
	if (waRank >= 1) {
		const curAmmo = String(cfg.walkingArmoryAmmo || "");
		const ammoOpts = [
			["", "不使用特殊弹药"],
			["thumper", "重击弹（爆炸+击退1）"],
			["shock", "电击弹（能量+禁反应）"],
			["mag", "磁轨弹（动能+抛射）"],
			...(waRank >= 2 ? [
				["hellfire", "地狱火弹（能量+额外转燃烧）"],
				["javelin", "猎人弹（动能+落点反应伤）"],
				["sabot", "镖弹（穿甲，耗2充能）"],
			] : []),
		].map(([val, label]) => `<option value="${val}"${curAmmo === val ? " selected" : ""}>${label}</option>`).join("");
		parts.push(`<label style="display:inline-flex;align-items:center;gap:3px;font-size:.86em"><span>弹药箱：</span><select data-lancer-cn-talent-sel="walkingArmoryAmmo" style="height:1.65em;padding:0 4px">${ammoOpts}</select></label>`);
	}

	// 6. 战术预备开关
	const addToggle = (field, label, tip) => {
		const on = Boolean(cfg[field]);
		parts.push(`<button type="button" class="lancer-button ${on ? "lancer-primary" : "lancer-secondary"}" data-lancer-cn-talent-act="toggle:${field}" title="${escHtml(tip)}" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.55;opacity:${on ? "1" : ".8"}">${escHtml(label)}${on ? " ✓" : ""}</button>`);
	};
	if (fLid === "mf_nelson" || fLid === "mf_ext_nelson_wing") {
		addToggle("nelsonMomentum", fLid === "mf_ext_nelson_wing" ? "喷气枪兵 (+1d6)" : "劲势 (+1d6)", "推进后下一次近战攻击额外造成 +1d6 伤害");
	}
	if (fLid === "mf_tortuga") {
		addToggle("tortugaSentinel", "哨兵反应 (+1准)", "托尔图加「哨兵」：反应攻击获得 +1 准度");
	}
	if (fLid === "mf_sherman_alt_tagetes") {
		addToggle("tagetesFusillade", "枪决（步枪+杀绝）", "万寿菊「枪决」：将安装的远程武器视为步枪并获得杀绝");
	}
	if (talentRank(actor, "t_crack_shot") >= 2) {
		addToggle("crackShotZeroIn", "瞄准具校正", "神枪手 II（1/轮）：步枪固定射击承受 +1 难度，会心一击时额外 +1d6 伤害");
	}
	if (talentRank(actor, "t_brawler") >= 3) {
		addToggle("brawlerKnockout", "击倒技", "拳师 III：拳师骰为 1 时消耗并重置为 6，命中造成额外伤害并迫使机体豁免对抗晕眩");
	}
	if (talentRank(actor, "t_juggernaut") >= 1) {
		addToggle("juggernautMomentum", "冲撞动量", "猛士 I：加速移动后下一次冲撞获得 +1 准度与额外击退 2");
	}
	if (talentRank(actor, "t_ext_crusher") >= 1) {
		addToggle("crusherReckless", "鲁莽摇摆", "碾碎机 I（1/轮）：近战武器攻击获得 +1 准度");
	}
	if (talentRank(actor, "t_ext_razorman") >= 2) {
		addToggle("razormanOverride", "意志覆写", "剃刀人 II：晕眩或受扰期间强行交火，承受 +2 难度与 +1 热度");
	}
	if (mechWeapons.some(w => weaponModLidOf(w) === "wm_uncle_class_comp_con")) {
		addToggle("uncleAutonomous", "UNCLE 自主开火", "老爹级 UNCLE：每回合 1 次以自由动作开火，承受 +2 难度");
	}
	if (mechWeapons.some(w => weaponModLidOf(w) === "wm_phase_ready_mod")) {
		addToggle("phaseReady", "相位准备", "相位准备改装：无视视线与掩护，但目标在本次攻击中视为隐形");
	}

	// 7. 猎人 I「跳扑」（攻击前飞行 3 格快捷触发）与投出武器自由动作拾回
	if (talentRank(actor, "t_hunter") >= 1) {
		const lungeUsed = Boolean(cs.usedHunterLunge);
		parts.push(`<button type="button" class="lancer-button ${lungeUsed ? "lancer-secondary" : "lancer-primary"}" data-lancer-cn-talent-act="hunterLunge" title="猎人 I（1/轮）：使用副近战武器攻击前，朝目标飞行至多 3 格（无视交战且不触发反应；误点可再次点击重置）" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.55;opacity:${lungeUsed ? ".72" : "1"}">🦅 跳扑${lungeUsed ? "（本轮已用）" : "（飞3格 · 1/轮）"}</button>`);
	}
	const thrownList = getThrownWeapons(actor);
	for (const tw of thrownList) {
		const locNote = tw.targetName ? `（${tw.targetName}旁）` : "";
		parts.push(`<button type="button" class="lancer-button lancer-primary" data-lancer-cn-talent-act="pickupThrown:${escHtml(tw.key)}" title="邻接时以自由动作拾回投出的「${escHtml(tw.weaponName)}」${escHtml(locNote)}" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.55">🤚 拾回「${escHtml(tw.weaponName)}」</button>`);
	}
	if (thrownList.length > 1) {
		parts.push(`<button type="button" class="lancer-button lancer-secondary" data-lancer-cn-talent-act="pickupThrownAll" title="一次性取回当前投出的全部武器" style="width:auto;flex:0 0 auto;padding:0 .55em;line-height:1.55">🤚 全部拾回</button>`);
	}

	if (!parts.length) return "";
	return `<div class="card clipped lancer-cn-talent-bar">`
		+ `<span class="lancer-header lancer-primary submajor">天赋与核心战术栏</span>`
		+ `<div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 6px;align-items:center">${parts.join("")}</div></div>`;
}

async function executeTalentSheetAction(actor, act, value) {
	if (!actor?.isOwner) return false;
	const refresh = () => { try { if (actor.sheet?.rendered) actor.sheet.render(false); } catch { /* ignore */ } };
	if (act === "select" && value && typeof value === "object") {
		await setTalentConfig(actor, { [value.field]: value.val });
		refresh();
		return true;
	}
	const [kind, arg1, arg2] = String(act ?? "").split(":");
	if (kind === "dieDec" || kind === "dieInc") {
		const def = TALENT_DICE_DEFS[arg1];
		if (!def) return false;
		const cur = getTalentDie(actor, arg1) ?? def.min;
		await setTalentDie(actor, arg1, cur + (kind === "dieInc" ? 1 : -1));
		refresh();
		return true;
	}
	if (kind === "gilgameshReroll") {
		const cur = getTalentDie(actor, "gilgamesh") ?? 6;
		if (cur !== 1) {
			ui?.notifications?.warn?.(`军备骰必须为 1 时才能重置重掷（当前为 ${cur}）！`);
			return false;
		}
		await setTalentDie(actor, "gilgamesh", 6);
		await postCpEffectCard(
			actor,
			"吉尔伽美什 · 战备就绪重掷",
			`<p><b>${escHtml(actor.name)}</b> 将军备骰从 <b>1 重置为 6</b>，立即重掷一次攻击、检定或豁免（必须保留第二次结果）！</p>`,
		);
		refresh();
		return true;
	}
	if (kind === "rollMimic") {
		await rollMimicGunValues(actor);
		refresh();
		return true;
	}
	if (kind === "toggle" && arg1) {
		const cfg = getTalentConfig(actor);
		await setTalentConfig(actor, { [arg1]: !cfg[arg1] });
		refresh();
		return true;
	}
	if (kind === "adaptiveReactor") {
		const curRep = Number(actor.system?.repairs?.value) || 0;
		const curStress = Number(actor.system?.stress?.value) ?? 0;
		const maxStress = Number(actor.system?.stress?.max) ?? 4;
		if (curRep < 2) {
			ui?.notifications?.warn?.("剩余维修不足 2 点，无法触发适应性反应炉！");
			return false;
		}
		if (curStress >= maxStress) {
			ui?.notifications?.warn?.("反应炉压力已满，无需恢复！");
			return false;
		}
		const nextRep = curRep - 2;
		const nextStress = Math.min(maxStress, curStress + 1);
		await actor.update?.({ "system.repairs.value": nextRep, "system.stress.value": nextStress });
		await postCpEffectCard(
			actor,
			"适应性反应炉 · 恢复压力",
			`<p><b>${escHtml(actor.name)}</b> 消耗 <b>2 点维修</b>（剩余 ${nextRep}），恢复 <b>1 点反应炉压力</b>（当前压力：${nextStress} / ${maxStress}）。</p>`,
		);
		refresh();
		return true;
	}
	if (kind === "oratorSpend") {
		const cost = Number(arg1) || 1;
		const mode = arg2 || "激励";
		const curDice = getTalentDie(actor, "orator") ?? 0;
		if (curDice < cost) {
			ui?.notifications?.warn?.(`演说家骰不足（需要 ${cost} 枚，当前 ${curDice} 枚）！`);
			return false;
		}
		const nextDice = curDice - cost;
		await setTalentDie(actor, "orator", nextDice);
		const modeDesc = mode === "激励"
			? `目标盟友可立即进行一次<b>系统检定</b>以清除一个非自身造成的状态，并获得 <b>+${curDice} 准度</b>（按消耗前持有的演说家骰数计算）！`
			: mode === "探究"
				? `针对指定敌方目标的下一次攻击检定<b>掷两次取高</b>！`
				: mode === "反间"
					? `指定敌方目标在其下一回合结束前<b>无法从盟友的任何系统或特性中获益</b>！`
					: `指定敌方目标陷入<b>动摇</b>：在其下一回合结束前不能移动、攻击、迫使豁免或执行科技动作（若其因此受到伤害或被盟友命中则提前解除；本场景内随后对该效果免疫）！`;
		await postCpEffectCard(
			actor,
			`演说家 · ${mode}（-${cost} 骰）`,
			`<p><b>${escHtml(actor.name)}</b> 以自由动作发动<b>${escHtml(mode)}</b>（剩余演说家骰：<b>${nextDice}</b>）：${modeDesc}</p>`,
		);
		refresh();
		return true;
	}
	if (kind === "hunterLunge") {
		await ensureCombatTurnState(actor);
		if (getCombatState(actor).usedHunterLunge) {
			await setCombatState(actor, { usedHunterLunge: false });
			ui?.notifications?.info?.("已重置本轮「跳扑」可用状态。");
		} else {
			await setCombatState(actor, { usedHunterLunge: true });
			await postCpEffectCard(
				actor,
				"猎人 · 跳扑",
				`<p><b>${escHtml(actor.name)}</b> 触发<b>跳扑</b>（1/轮）：使用副近战武器攻击前，朝目标<b>飞行至多 3 格</b>（此移动<b>无视交战且不触发反应</b>）！</p>`,
			);
		}
		refresh();
		return true;
	}
	if (kind === "pickupThrown" && arg1) {
		await retrieveThrownWeapon(actor, arg1, { notify: true, postCard: true });
		refresh();
		return true;
	}
	if (kind === "pickupThrownAll") {
		await retrieveThrownWeapon(actor, "all", { notify: true, postCard: true });
		refresh();
		return true;
	}
	return false;
}

// 机甲表：基础动作卡、核心协议控制台、天赋与核心战术栏、文字受限卡、掷骰式受限按钮
const BASIC_ANCHOR = '.lancer-flow-button-grid [data-flow-type="BasicAttack"]';
function onRenderActorSheet(app, html) {
	const root = (typeof HTMLElement === "function" && html instanceof HTMLElement) ? html : (html?.[0] ?? html);
	const actor = app?.actor;
	if (!root || !actor) return;
	// 掷骰式受限：在物品的 USES 格子旁加按钮（机甲、驾驶员、NPC 都适用）
	for (const card of root.querySelectorAll(".limited-card")) {
		if (card.querySelector("[data-lancer-cn-limited]")) continue;
		const uuid = card.closest(".set[data-uuid*='Item']")?.dataset.uuid;
		const item = uuid ? resolveDocSync(uuid) : null;
		const formula = diceLimited(item);
		if (!formula || !card.querySelector(".uses-hex, span")) continue;
		if (!/USES|次数/.test(card.textContent ?? "")) continue;
		card.insertAdjacentHTML("beforeend", `<button type="button" data-lancer-cn-limited="${uuid}" title="掷受限次数（全面维修后会自动重掷）" style="flex:0 0 auto;width:auto;line-height:1.4;padding:0 .4em;margin:0 0 0 4px"><i class="fas fa-dice"></i> ${formula}</button>`);
	}
	if (actor.type === "deployable" && (actor.isOwner || globalThis.game?.user?.isGM) && !root.querySelector(".lancer-cn-cover-aura-card")) {
		const anchor = root.querySelector(BASIC_ANCHOR)?.closest(".card");
		if (anchor) {
			anchor.insertAdjacentHTML("afterend", deployableCoverAuraCardHTML(actor));
			root.querySelector(".lancer-cn-cover-aura-card")?.insertAdjacentHTML("afterend", resistancesHTML(actor));
		}
	}
	if ((actor.type === "mech" || actor.type === "npc" || actor.type === "pilot") && actor.isOwner && !root.querySelector(".lancer-cn-basic")) {
		// 系统「战斗工具」卡片（机甲在「装配」页，NPC 在主页，驾驶员在「驾驶员」页）：以其按钮栏里的「基础攻击」按钮定位。
		// 机甲「数值」页的毅力卡片也有一个基础攻击按钮（不在按钮栏里），不能用它定位（1.8.0 的问题）
		const anchor = root.querySelector(BASIC_ANCHOR)?.closest(".card");
		if (anchor) {
			anchor.insertAdjacentHTML("afterend", basicActionsHTML(actor.type));
			const basicCardEl = root.querySelector(".lancer-cn-basic");
			const counters = actor.type === "mech" ? textCounters(actor) : [];
			if (counters.length) basicCardEl?.insertAdjacentHTML("afterend", countersHTML(actor, counters));
			if (actor.type === "mech" || actor.type === "npc") {
				basicCardEl?.insertAdjacentHTML("afterend", resistancesHTML(actor));
			}
			if (actor.type === "mech" && !root.querySelector(".lancer-cn-talent-bar")) {
				const talentBar = renderTalentControlHTML(actor);
				if (talentBar) {
					const afterEl = root.querySelector(".lancer-cn-resist") ?? basicCardEl;
					afterEl?.insertAdjacentHTML("afterend", talentBar);
				}
			}
		}
	}
	if (actor.type === "mech" && actor.isOwner && !root.querySelector(".lancer-cn-core-bar")) {
		const cpBar = renderCoreControlHTML(actor, { inSheet: true });
		if (cpBar) {
			const coreWrap = root.querySelector(".core-wrapper, .core-active-wrapper, .lancer-core-sys");
			if (coreWrap) coreWrap.insertAdjacentHTML("beforeend", cpBar);
			else {
			const basicCardEl = root.querySelector(".lancer-cn-basic");
			if (basicCardEl) basicCardEl.insertAdjacentHTML("beforebegin", `<div class="card clipped">${cpBar}</div>`);
			}
		}
	}
	// 机甲 / NPC 武器栏投出状态徽标与一键拾回按钮
	if ((actor.type === "mech" || actor.type === "npc") && actor.isOwner) {
		const thrownMap = getThrownWeapons(actor);
		if (thrownMap.length) {
			for (const wpnCard of root.querySelectorAll(".mech_weapon.set[data-uuid], .npc_feature.set[data-uuid]")) {
				if (wpnCard.querySelector(".lancer-cn-thrown-badge")) continue;
				const wUuid = wpnCard.dataset?.uuid;
				const wpn = wUuid ? (resolveDocSync(wUuid) ?? (actor.items ?? []).find(i => i.uuid === wUuid)) : null;
				if (!wpn || !isWeaponThrownOut(actor, wpn)) continue;
				const tw = thrownMap.find(x => x.key === weaponTrackKey(wpn) || (wUuid && x.weaponUuid === wUuid) || (wpn.id && x.weaponId === wpn.id));
				const rollBtn = wpnCard.querySelector(".roll-attack");
				if (rollBtn) {
					rollBtn.style.opacity = "0.45";
					rollBtn.title = "该武器已投出落在场上，取回前无法再次攻击";
				}
				const bodyEl = wpnCard.querySelector(".lancer-body") ?? wpnCard;
				const locNote = tw?.targetName ? `（${escHtml(tw.targetName)}旁）` : "";
				bodyEl.insertAdjacentHTML(
					"afterbegin",
					`<div class="lancer-cn-thrown-badge" style="display:flex;align-items:center;gap:6px;padding:3px 6px;margin:2px 0;border-radius:3px;background:rgba(230,81,0,.14);color:#e65100;font-size:.88em"><b>🗡️ 已投出${locNote}</b><button type="button" class="lancer-button lancer-primary" data-lancer-cn-talent-act="pickupThrown:${escHtml(tw?.key || weaponTrackKey(wpn))}" style="width:auto;flex:0 0 auto;padding:0 .5em;line-height:1.4;margin:0">🤚 自由动作拾回</button></div>`,
				);
			}
		}
	}
	// 直接绑在各个按钮上（1.8.2 起；之前在表单根元素上委托，实际 Foundry 中点击无反应）
	const handler = ev => {
		ev.preventDefault();
		ev.stopPropagation();
		onSheetButton(app, ev.currentTarget).catch(err => reportError("按钮", err));
	};
	for (const el of root.querySelectorAll("[data-lancer-cn-basic], [data-lancer-cn-resist], [data-lancer-cn-cover-aura], [data-lancer-cn-cp-act], [data-lancer-cn-talent-act], [data-lancer-cn-limited], [data-lancer-cn-counter], [data-lancer-cn-counter-roll], [data-lancer-cn-counter-reset]")) el.onclick = handler;
	for (const sel of root.querySelectorAll("[data-lancer-cn-talent-sel]")) {
		sel.onchange = ev => {
			ev.stopPropagation();
			const field = ev.currentTarget.dataset.lancerCnTalentSel;
			const val = ev.currentTarget.value;
			executeTalentSheetAction(actor, "select", { field, val }).catch(err => reportError("选择器", err));
		};
	}
}

async function onSheetButton(app, el) {
	const a = app.actor;
	const d = el.dataset;
	console.info(`${MODULE_ID} | 点击`, { ...d });
	if (d.lancerCnBasic) return beginBasicAction(a, d.lancerCnBasic);
	if (d.lancerCnResist) return toggleActorResistance(a, d.lancerCnResist);
	if (d.lancerCnCoverAura) {
		const rawAct = d.lancerCnCoverAura;
		if (rawAct.startsWith("preset:")) return applyCoverAuraPreset(a, rawAct.slice(7));
		return openCoverAuraDialog(a);
	}
	if (d.lancerCnCpAct) return executeCoreAction(a, d.lancerCnCpAct);
	if (d.lancerCnTalentAct) return executeTalentSheetAction(a, d.lancerCnTalentAct);
	if (d.lancerCnLimited) {
		const item = resolveDocSync(d.lancerCnLimited);
		if (!item) throw new Error(`找不到物品 ${d.lancerCnLimited}`);
		return rollLimited(item);
	}
	if ("lancerCnCounterReset" in d) return resetCounters(a, { roll: false });
	const key = d.lancerCnCounter ?? d.lancerCnCounterRoll;
	const c = textCounters(a).find(x => x.key === key);
	if (!c) return;
	if (d.lancerCnCounterRoll) return rollCounter(a, c);
	const { value } = counterState(a, c);
	return setCounter(a, c, d.available === "true" ? value - 1 : value + 1);
}

// 出错时在界面上提示（每种只提示一次），便于反馈
const reported = new Set();
function reportError(what, err) {
	console.error(`${MODULE_ID} | ${what}`, err);
	const msg = `LANCER 中文模组：${what}出错：${err?.message ?? err}`;
	if (reported.has(msg)) return;
	reported.add(msg);
	globalThis.ui?.notifications?.error(msg);
}

// ---------------------------------------------------------------------------
// 文字里的骰子：系统 / 武器 / 天赋等说明里的「1d6」「1d6+2」变成可点的链接，点了以该角色名义掷骰
// （例如定制涂装作业「掷1d6，结果为6……」）。只处理说明文字（.effect-text、.desc-text），不碰伤害栏、编辑区。
const DICE_IN_TEXT = /(?<![A-Za-z0-9])(\d*)d(3|4|6|8|10|12|20|100)(?:\s*([+-])\s*(\d+))?(?![A-Za-z0-9])/gi;
const DICE_SCOPE = ".effect-text, .desc-text";
const DICE_SKIP = "a, button, input, textarea, select, .lancer-cn-roll, [contenteditable='true'], prose-mirror, .ProseMirror, .editor-content, .dice-roll, .inline-roll";

function linkDiceIn(el) {
	const doc = el.ownerDocument ?? globalThis.document;
	const walker = doc.createTreeWalker(el, 4 /* NodeFilter.SHOW_TEXT */);
	const nodes = [];
	// 只用不带 g 的副本判断：matchAll 会沿用 g 正则的 lastIndex，test 之后直接 matchAll 会漏掉第一个骰子
	const has = new RegExp(DICE_IN_TEXT.source, "i");
	for (let n = walker.nextNode(); n; n = walker.nextNode()) {
		if (has.test(n.nodeValue) && !n.parentElement?.closest(DICE_SKIP)) nodes.push(n);
	}
	DICE_IN_TEXT.lastIndex = 0;
	for (const n of nodes) {
		const frag = doc.createDocumentFragment();
		let last = 0;
		const text = n.nodeValue;
		for (const m of text.matchAll(DICE_IN_TEXT)) {
			if (m.index > last) frag.append(text.slice(last, m.index));
			const formula = `${m[1] || 1}d${m[2]}${m[3] ? m[3] + m[4] : ""}`;
			const a = doc.createElement("a");
			a.className = "lancer-cn-roll";
			a.onclick = onDiceClick;
			a.dataset.formula = formula;
			a.title = `点击掷 ${formula}`;
			a.innerHTML = `<i class="fas fa-dice-d6"></i>`;
			a.append(m[0]);
			frag.append(a);
			last = m.index + m[0].length;
		}
		if (last < text.length) frag.append(text.slice(last));
		n.replaceWith(frag);
	}
	return nodes.length;
}

function linkDice(root) {
	if (!root?.querySelectorAll) return 0;
	let n = 0;
	if (root.matches?.(DICE_SCOPE)) n += linkDiceIn(root);
	for (const el of root.querySelectorAll(DICE_SCOPE)) n += linkDiceIn(el);
	return n;
}

// 掷骰的名义：所在物品的拥有者 → 聊天消息的发言者 → 所在角色表的角色
function diceContext(el) {
	const uuid = el.closest("[data-uuid]")?.dataset.uuid;
	const doc = uuid ? resolveDocSync(uuid) : null;
	if (doc?.documentName === "Item") return { actor: doc.actor, flavor: doc.name };
	if (doc?.documentName === "Actor") return { actor: doc, flavor: "" };
	const msg = game.messages?.get(el.closest(".chat-message")?.dataset?.messageId);
	if (msg) return { speaker: msg.speaker, flavor: "" };
	const appId = el.closest(".window-app, .application")?.dataset?.appid;
	const app = appId ? ui.windows?.[appId] : null;
	return { actor: app?.actor ?? null, flavor: app?.item?.name ?? "" };
}

function onDiceClick(event) {
	const a = event.target?.closest?.(".lancer-cn-roll");
	if (!a || event.lancerCnDice) return;
	event.lancerCnDice = true;
	event.preventDefault();
	event.stopPropagation();
	console.info(`${MODULE_ID} | 掷骰`, a.dataset.formula);
	try {
		const ctx = diceContext(a);
		const speaker = ctx.speaker ?? ChatMessage.getSpeaker(ctx.actor ? { actor: ctx.actor } : {});
		new Roll(a.dataset.formula).toMessage({ speaker, flavor: ctx.flavor ? `${ctx.flavor}：${a.dataset.formula}` : a.dataset.formula }).catch(err => reportError("掷骰", err));
	} catch (err) { reportError("掷骰", err); }
}

const diceObserver = typeof MutationObserver === "function" ? new MutationObserver(muts => {
	for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) linkDice(n);
}) : null;

for (const h of ["init", "setup"]) Hooks.once(h, () => {
	if (game.system?.id === "lancer") {
		patchLimitedMax();
		patchTrueblackDamageCalc();
		patchWeaponRangeTemplate();
	}
});
Hooks.once("init", () => {
	if (game.system?.id !== "lancer") return;
	globalThis.addEventListener?.("click", onBasicDamageClick, { capture: true });
	globalThis.addEventListener?.("click", onCrossPermDamageClick, { capture: true });
	globalThis.addEventListener?.("click", onCascadeButtonClick, { capture: true });
	globalThis.addEventListener?.("click", onDangerousCheckClick, { capture: true });
	globalThis.addEventListener?.("click", onDiceClick, { capture: true });
	Hooks.on("lancer.postFlow.FullRepairFlow", (flow, success) => onFullRepair(flow, success).catch(err => console.error(`${MODULE_ID} |`, err)));
});
Hooks.on("renderActorSheet", onRenderActorSheet);
Hooks.once("ready", () => {
	if (game.system?.id !== "lancer") return;
	patchWeaponRangeTemplate();
	if (typeof document === "undefined") return;
	patchLimitedMax();
	patchTrueblackDamageCalc();
	refreshDiceLimited();
	linkDice(document.body);
	diceObserver?.observe(document.body, { childList: true, subtree: true });
});

globalThis.LancerCN = {
	translate, walk, importReference, REFERENCE, cleanupPilotImportedMechs,
	coverFor, applyCover, defineCoverBehavior, defineDangerousBehavior, onDangerousCheckClick,
	hexWallData, setHexWall, setCoverCell, coverCellHas, setTerrainCell, terrainCellHas, PAINT_TOOLS, makeHexGrid,
	parseBattleMap, importBattleMap, clearImportedMapDocs, clearUnitMarkers, addMapImportButton, openBattleMapImportDialog,
	ALL_STATUS_LABELS, RESIST_DEFS, RESIST_IDS, CONDITION_IDS, EXPIRABLE_STATUS_IDS,
	statusesIn, attackTexts, parseSavesInText, classifyAttackCard, classifyTechAttackCard, isTechAttackMessage, collectWeaponAttackRiders,
	selfStatusesIn, parseNonAttackDamage, parseAoERanges, isPersistentAoEText, extractBalancedClassBlocks, parseNpcDeployableSpec, analyzeCard,
	setActorStatus, applyStatusTo, removeStatusFrom, onCreateChatMessage, undoAppliedStatuses, executeCardSave, rollNonAttackDamage,
	executeFieldAnalystReaction, executeCardRider, spawnNpcDeployableFromCard, executeTurnEndBurnCheck, executeNpcRechargePrompt, executeUltraJuggernautChoice,
	actorBaseSize, hasSyntheticMuscleNetting, effectiveGrappleSize, findActiveGrappleFor, isGrappleImmobilized, endGrapple,
	mechPilot, findActiveMechForPilot, combatMechOf, talentItemOf, talentRank, hasCoreBonus, hasMechSystem, countMechNHPs, onTalentItemChanged,
	weaponModOf, weaponLidOf, weaponModLidOf, itemBenefitsFromTalents, itemBenefitsFromCoreBonuses,
	makeThrownTag, applyKnifeJugglerTags, weaponThreatVal, weaponThrownVal, weaponTrackKey, getThrownWeapons, isWeaponThrownOut, markWeaponThrown, retrieveThrownWeapon, eligibleDisdainfulWeapons, syncWeaponThrownMode, triggerHunterDisdainful, hasWalkingArmoryCharges,
	isActiveCombat, maxReactionsPerTurn, canReactWhileGrappled, hasUnlimitedOverwatchPerRound, checkReactionAvailability, syncActorReactionTracker, consumeReaction, refundReaction,
	weaponHasOrdnanceTag, overwatchThreatVal, eligibleOverwatchWeapons, executeOverwatchAttack, triggerPreparedAction, cancelPreparedAction, onPreUpdateTokenOverwatch, onOverwatchTokenUpdate, resetOverwatchPromptDedup,
	TALENT_DICE_DEFS, hasDieQualification, getTalentDie, setTalentDie, getCombatState, setCombatState, patchCombatStateCompat, updateAttackMessageTargetsCompat, ensureCombatTurnState, getTalentConfig, setTalentConfig,
	hasNpcFeature, withCanonicalNpcFlowLids, isStatusImmune, isBurnImmune, hasGruntChaff, hasGruntWeak, triggerGruntWeakDestruction,
	checkAndTriggerVeteranFeignDeath, applyUltraArgusArmorLoss, hasUnusedUltraExtraDeadly, commanderAuraBonuses, rollNatD20,
	rollMimicGunValues, resetSceneTalentState, resetFullRepairTalentState, resetNpcCombatState, renderTalentControlHTML, executeTalentSheetAction, maxFormulaValue,
	EFFICIENT_FRAME_LIDS, CP_PROFILES, mechFrame, mechFrameLid, isEfficientCore, getCoreState, setCoreState, isCoreActiveOn,
	hasTrueblack, isUnremovableShredded, isCoreSustainedImmobilized, cpAttackAccuracyBonus, cpStatAccuracyBonus,
	activateCorePower, deactivateCoreEffect, endCorePower, onDeleteCombat, executeCoreAction, renderCoreControlHTML,
	createMazeCard, attemptMazeSave, patchTrueblackDamageCalc,
	pickPilotCheckSpec, rollActorContestStat, createContestCard, startGrappleContest, respondToContest,
	createJockeyControlCard, executeJockeyEffect, startJockeyShakeOff, endJockey, clearBraceResistances,
	previewDamageCalc, extractUntargetedDamageEntries, resolveUntargetedDamageTargets, applyUntargetedDamageFromCard, decorateDamageCard, onCrossPermDamageClick, gmUndoDamageByPayload,
	onUpdateActorStatus, onUpdateCombatTurnEnd, countNpcDeadlyDice, structureOutcomeStatuses, overheatOutcomeStatuses, collectCascadeableSources, resolveCascadeActor, executeCascadeCheck, onCascadeButtonClick, patchLancerFlows,
	onRenderChatMessage, patchMeasuredTemplateCone, patchWeaponRangeTemplate, computeLancerHexConeOffsets, buildSmoothConePolygon, coneRangeSpaces, normalizeTemplateDirection, rotatePlacedDirectionalTemplate, onPlacedTemplateWheel, onUpdateMeasuredTemplate, isPlacingTemplate, placeAoETemplate, attackReach, tokenDistance, targetCandidates, targetPanelThrownInfo, targetPanelHTML, toggleTargetPanelThrownMode, submitActiveHud, openTargetPicker, closeTargetPicker, onTargetPointer, targetSession: () => targetSession,
	SENSOR_COLORS, tokenSensorRange, canShowSensorForToken, sensorRadarColor, computeSensorGeometry, renderSensorOverlay, clearSensorOverlay, onHoverSensorToken, refreshHoveredSensor,
	sensorOverlayState: () => ({ token: hoveredSensorToken, graphics: sensorGraphics, renderKey: lastSensorRenderKey }),
	DEPLOYABLE_AUTO_COVER_RULES, COVER_AURA_PRESETS, normalizeCoverAuraSpec, inferDeployableCoverSpec, getEffectiveCoverAuraSpec, isCoverSourceIncapacitated,
	computeBoundCoverRegionGeometry, findBoundCoverRegions, removeBoundCoverRegion, syncBoundCoverRegionForToken, cleanupOrphanBoundCoverRegions,
	onCoverAuraCreateToken, onCoverAuraTokenUpdate, onCoverAuraDeleteToken, onCoverAuraActorUpdate,
	formatCoverAuraSummary, setTokenCoverAura, applyCoverAuraPreset, openCoverAuraDialog, onRenderTokenHUD, deployableCoverAuraCardHTML,
	tokenNameMode, onPreCreateToken, applyTokenNames, setupNamesAndNumbers, patchScrollingText,
	BASIC_ACTIONS, beginBasicAction, onPreCreateBasicCard, basicActionsHTML, resistancesHTML, toggleActorResistance, onBasicDamageClick, rollBasicDamage,
	patchLimitedMax, rollLimited, diceLimited, isDiceFormula, textLimitedOf, textCounters, counterState, resetCounters, onFullRepair,
	onRenderActorSheet, onSheetButton, refreshDiceLimited, linkDice, onDiceClick,
};

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
