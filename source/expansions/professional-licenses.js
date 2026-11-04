"use strict";
// 用户提供的专业牌照截图。此处的牌照不生成骨架。
const tag=(id,val)=>val==null?{id}:{id,val};
const p=s=>`<p>${s}</p>`;
const block=(name,meta,text)=>`<div class="blk"><div class="blk-h">${name} <span class="muted">${meta}</span></div>${p(text)}</div>`;
const professional_licenses=[
 {id:'pl_ips_vanguard',name:'先遣兵',source:'IPS-N',rank:1,description:'作为一种以高威胁近身任务为核心的通用牌照，先遣兵总结了 IPS-N 在登船和反海盗行动方面的丰富经验，为驾驶员提供一个无论底盘规格如何都可使用的灵活战术包。所有先遣兵系统都经过 IPS-N 自己的特种作战单位，海军/坚井主干安保部门的认证，完全可以在舰装和地面战区使用。'},
 {id:'pl_ips_watchman',name:'守夜人',source:'IPS-N',rank:2,prerequisites:['pl_ips_vanguard'],description:'IPS-N 守夜人扩展包被宣传为先遣兵系列的配套牌照，它在设计时考虑到了防御行为。它在所有 IPS-N 海军舰艇上使用，并作为一种免费牌照提供给在进出南航座航线星座贸易路线上运行的商船，所有的“守夜人”系统通过为驾驶员提供快速部署、模块化监蔽增强功能来补充“占领固守/反登舰”操作，可用于加强受到威胁的阵地，或在可能接近道路上建立稳固杀区。'},
 {id:'pl_ips_overlord',name:'霸主',source:'IPS-N',rank:3,prerequisites:['pl_ips_watchman'],description:'IPS-N 战术火力小队/班组综合指挥和控制许可正被命名为“霸主”，其设计意图满足集中增强联合作战行动的需要。一套升级硬件组合，包括传感器和通讯套件，以及 NHP 增强瞄准系统和战术网络固件，用于补充任何小单位编队战术需要，包括突击、火力支援/目标指定、防御行动和特种作战。'},
 {id:'pl_ssc_sparrowhawk',name:'雀鹰',source:'SSC',rank:1,description:'云雀牌照是独立专业许可包，是 SSC 空天优势计划的一部分，其设计意图为在空战中作战的底盘驾驶员提供增强战区特定作战能力。传统的空中支援/空中优势理论可以通过使用适当装备的底盘代替空天战斗机来实现，同时仍然保留地面攻击能力，使这些中队在战术打击/拦截和火力支援交战中具有无与伦比的多角色灵活性。'},
 {id:'pl_ssc_micro_monarch',name:'微型金斑蝶',source:'SSC',rank:2,prerequisites:['pl_ssc_sparrowhawk'],description:'微型金斑蝶系统包是 SSC 公司主生产线导弹电池平台的发展成果。用户反馈表明，与“金斑蝶”远程火力支援原则相反，他们强烈希望为中/近距离交战定制多用途导弹系统。经过大量战地测试，微型金斑蝶最终获得了牌照，它不仅作为金斑蝶的补充区域升级，也是套灵活多变适用于所有适当牌照底盘的战术武器选择。'},
 {id:'pl_ssc_acolyte',name:'盲从者',source:'SSC',rank:3,prerequisites:['pl_ssc_micro_monarch'],description:'虽然完全生物底盘工程的概念已被理论化很长时间，但这种设计面临的实际限制仍然巨大（至少据大多数人所知）。尽管如此，史密斯-岛野仍在不断突破综合生物技术设计边界，将量身定制的生物来源和灵感系统整合到他们的全套精确工程作战框架中。盲从者是奢华系列最前沿设计专业牌照系列的最新独家授权，提供性能增强的全骨架升级，来自 SSC 广泛培养的异种基因数据库，以及定制生物设计，以在最困难的操作中支援驾驶员。'},
 {id:'pl_horus_reason',name:'理性',source:'HORUS',rank:1,description:'伴随 NHP 和次级 NHP 辅助电子战理论在现代战场上的日益流行，武器化编码协议、逻辑病毒和猎人/杀手算法似乎在无休止地扩散，并已发展并蔓延到整个联盟太空。因此，理性并非是传统意义上的牌照，而是作为荷鲁斯档案管理员策划和分发的广泛电子战程序库授权的万物网访问。随着电子对抗和防御系统的适应和发展，可行方案的选择本身就是进化军备竞赛的一部分，动态更新以适应战场的新趋势。'},
 {id:'pl_horus_three_eye',name:'三眼',source:'HORUS',rank:2,prerequisites:['pl_horus_reason'],description:'尽管荷鲁斯模式组通常不符合标准战斗职责分类，但也需要实现任何现存机甲核心都无法解决的特定战场目标。当这种情况出现时，多个专业牌照便会加速开发、分发、实地测试、丢弃，而那些成功满足或超过需求的牌照将被重新编译和标准化以便进行大量发行。三眼便是这样的牌照，其设计意图为在多方底盘推动狙击神射手主义学说。'},
 {id:'pl_horus_bunraku',name:'文乐木偶戏',source:'HORUS',rank:3,prerequisites:['pl_horus_three_eye'],description:'直至最近出现在万物网上并且正在传播给适当牌照持有者的“文乐木偶戏”，根据联盟调查局分析尚未确定指定牌照究竟是全新的荷鲁斯模式组早期证据，还是仅仅是个实验技术试验台。初步报告暗展示了隐秘的班级战术整合指挥范式，其中涉及到使用快速建立的本体论[桥梁，通往我浩瀚的心灵之门，我灵魂的无底洞。这是我给你的礼物，去使用它们，用你的智慧，或者愚钝，白痴]'},
 {id:'pl_ha_superfire',name:'超级火力',source:'HA',rank:1,description:'大多数国家和企业军队的武器解决方案主要依赖于动能/爆炸平台，为特殊目的保留基于能量的武器，但哈里逊兵工厂的超级火力牌照扭转了这一模式，迈出了最新一步。一场首发活动试图将 HA 辐射武器定位为“驾驶员在黑暗中最好的伙伴”，在大举进军传统上由 GMS 和 IPS-N 主导的市场之前，引发了一场企业间的军备竞赛。'},
 {id:'pl_ha_workshop',name:'铸造车间',source:'HA',rank:2,prerequisites:['pl_ha_superfire'],description:'哈里森军械库最近推出了铸造计划，意图创造一个独立牌照包，允许适格驾驶员比较定规模更宽泛地制造客制化/个人定制化的武器——所有这些都无需冒险去出兵工厂更大的产品空间保护伞。随着牌照向更广泛市场推出，预测性客户和委托国忠诚度指标预计随着时间推移会有良好增长，计划一系列免费牌照已在进行中，对各大战区的战术效益进一步提高。'},
 {id:'pl_ha_deepwell',name:'坠落深井',source:'HA',rank:3,prerequisites:['pl_ha_workshop'],description:'哈里逊兵工厂最新的公共 beta 测试牌照现可提供给有兴趣参加他们最新开发武器的现场测试的适格驾驶员。该牌照开发代号为“坠落深井”，代表了智囊团在创造综合性全覆盖骨架重力平台方面的持续努力。目前，人工重力产生在民用领域的实际应用仍然有限，相反在军事战区的应用逐渐增长，其主要呈现亚光型 k-comp 系统中。很明显，下一步就是寻找扩展该技术使用的可行方法，而 HA 凭借数十年在尖端和非因果律作战系统开发方面的经验，在实现这一承诺方面具有独特优势。'},
 {id:'pl_ch_shepherd',name:'羊倌',source:'C&H',rank:1,description:'羊倌是钱德拉塞卡赫歇尔公司强大而可定制的全覆盖底盘牌照，其设计意图为驾驶员提供全战区/全地形负载增强能力的定制解决方案。每个羊倌牌照都有 C&H 终身保修，所有系统都经过严格测试以确保在最恶劣条件下发挥效能，包括臭名昭著的荒地耐力测试。'},
 {id:'pl_ch_tawa',name:'塔瓦',source:'C&H',rank:2,prerequisites:['pl_ch_shepherd'],description:'塔瓦许可包提供给 C&H 所有对扩展可用武器库以配备最于近距离作战最精良特种武器感兴趣的常驻牌照持有者。每个塔瓦系统都被设计用来满足 C&H 严格质量标准和驾驶员信赖的军规可靠性，为所有核心提供灵活而强大的防御解决方案，这在其他牌照中不可寻得。'},
 {id:'pl_ch_duelist',name:'斗篷',source:'C&H',rank:3,prerequisites:['pl_ch_tawa'],description:'虽然近战被认为是诸多国家级军事和安全服务的专责角色，C&H 的“斗篷”借鉴了几个世纪的角斗武器工程经验，为持牌驾驶员提供了一系列精选近战增强改造，将经典设计与当代材料相结合。C&H 选用军用级硬板护盾，适用于多种骨架和作用，有多种定制款式和许可供选择。'}
];
for (const def of professional_licenses) def.reference_image = `source/expansions/references/professional/${def.id}.png`;
const gear=(id,name,pl,extra)=>{const l=professional_licenses.find(x=>x.id===pl);return {id,name,source:l.source,license:l.name,license_level:l.rank,professional_license:pl,...extra};};
const profile=(name,type,range,damage,tags=[],extra={})=>({name,type,range,damage,tags,...extra});
const r=(type,val)=>({type,val}),d=(type,val)=>({type,val});
const weapons=[
 gear('mw_pl_buckler','弹道臂盾','pl_ips_vanguard',{mount:'Main',type:'Melee',range:[r('Threat',1)],damage:[d('Kinetic','1d3+2')],tags:[tag('tg_knockback',1)],effect:'以<b>协定</b>，你可以伸缩防护罩弹道板。当防板被延长时，你会<b>缓慢</b>，你获得对所有伤害的<b>抗性</b>。',on_crit:'目标伏卧。',actions:[{name:'伸缩弹道板',activation:'Protocol',detail:'伸出时自己缓慢，获得对所有伤害的抗性。'}]}),
 gear('mw_pl_valkyrie','瓦亚维亚导弹','pl_ssc_sparrowhawk',{mount:'Main',type:'Launcher',range:[r('Range',15)],damage:[d('Explosive','1d6')],tags:[tag('tg_smart')],effect:'使用该武器攻击飞行目标时 <b>+1 准度</b>，但攻击飞行或更高高度的目标时 <b>+1 难度</b>。',on_hit:'任何被该武器命中的飞行目标必须通过敏捷豁免否则立即降落（这算作没有任何时候的坠落）；此外，他们无法再飞行直到他们下一回合结束。'}),
 gear('mw_pl_gorgon_micro','哥瓦尔丹微型导弹','pl_ssc_micro_monarch',{mount:'Auxiliary',type:'Launcher',range:[r('Range',5)],damage:[d('Explosive',4)],tags:[tag('tg_limited',4)],effect:'你可以用该武器攻击视线射程内一个或两个目标。若你攻击两个目标，则该武器将替换为造成 <b>2 爆炸伤害</b>。'}),
 gear('mw_pl_garuda','缇娜玻安导弹','pl_ssc_micro_monarch',{mount:'Heavy',type:'Launcher',sp:2,range:[r('Range',10),r('Blast',2)],damage:[d('Explosive','1d6+1')],tags:[tag('tg_arcing'),tag('tg_ordnance'),tag('tg_smart')],effect:'该武器不会攻击到你自己或盟友角色。使用该武器攻击一个具有锁定的角色时，你可以使用强化数据；必须在攻击中消耗锁定，且放弃正常的准度奖励。',profiles:[profile('标准发射','Launcher',[r('Range',10),r('Blast',2)],[d('Explosive','1d6+1')],[tag('tg_arcing'),tag('tg_ordnance'),tag('tg_smart')]),profile('锁定强化发射','Launcher',[r('Range',10)],[d('Explosive','2d6+2')],[tag('tg_arcing'),tag('tg_ordnance'),tag('tg_reliable',4),tag('tg_smart')],{effect:'必须消耗目标的锁定，且放弃正常的准度奖励。不会攻击自己或盟友。'})]}),
 gear('mw_pl_seeking_launcher','寻索弹射器','pl_horus_three_eye',{mount:'Heavy',type:'Rifle',types:['Rifle','Nexus'],range:[r('Range',15)],damage:[d('Kinetic','1d6+4')],tags:[tag('tg_ap'),tag('tg_loading'),tag('tg_smart')],profiles:[profile('步枪／巢房','Nexus',[r('Range',15)],[d('Kinetic','1d6+4')],[tag('tg_ap'),tag('tg_loading'),tag('tg_smart')])],effect:'重武器步枪/巢房。',on_hit:'你可以对第一个目标射程 5 内最近的敌人进行第二次攻击，确认视线和掩护时以第一个目标为准。该第二次攻击无法造成额外伤害，且不会触发第三次攻击。'}),
 gear('mw_pl_polaris','“北极星”式多功能辐射枪','pl_ha_superfire',{mount:'Main',type:'Rifle',range:[r('Range',8)],damage:[d('Energy','1d6')],tags:[],effect:'当该武器涉及包括激光通信、精密切割或焊接、数据传输、激光麦克风干涉测量，或其他杂项任务的驾驶员或机甲技能检定时 <b>+1 准度</b>。',on_attack:'你可以超频它来获得杀绝并且在命中时造成 +3 额外伤害，但它必须重新装填才能再次使用（正如它拥有装填标签）。'}),
 gear('mw_pl_orion','“猎户座”式热射辐射枪','pl_ha_superfire',{mount:'Auxiliary',type:'CQB',range:[r('Range',3),r('Threat',3)],damage:[d('Energy','1d3')],tags:[tag('tg_overkill')],on_attack:'你可以受到 1 热度来造成命中 +1 燃烧伤害。'}),
 gear('mw_pl_modular_rifle','模块化先进战斗步枪','pl_ha_workshop',{mount:'Main',type:'Rifle',range:[r('Range',10)],damage:[d('Kinetic','1d6')],tags:[tag('tg_accurate')],select_profile:true,max_mods:2,mod_sp_discount:1,effect:'你最多可安装两个模组到该武器上，并且你可以降低每个模组花费 <b>1 SP</b>，最低为 <b>1 SP</b>。每次打印该武器时，选择一种数据；每次打印新副本时可选择不同数据。',profiles:[profile('进攻','Rifle',[r('Range',10)],[d('Kinetic','1d6')],[tag('tg_accurate')]),profile('DMR','Rifle',[r('Range',12)],[d('Kinetic','1d6+3')],[tag('tg_accurate'),tag('tg_loading')]),profile('突击','Rifle',[r('Range',8),r('Threat',3)],[d('Kinetic','1d6')])]}),
 gear('mw_pl_kinetic_driver','运动驱动器','pl_ha_deepwell',{mount:'Superheavy',type:'Cannon',range:[r('Range',20),r('Blast',1)],damage:[d('Kinetic','2d6')],tags:[tag('tg_ordnance'),tag('tg_heat_self',3)],effect:'攻击时选择折叠场或线性场开火。',profiles:[profile('折叠场','Cannon',[r('Range',20),r('Blast',1)],[d('Kinetic','2d6')],[tag('tg_ordnance'),tag('tg_heat_self',3)],{on_attack:'该武器的溅射范围垂直扩展到 10 空间。',on_hit:'所有被命中的目标必须通过机体豁免否则伏卧。飞行角色未通过豁免则立即被迫降落（视同坠落但不受到伤害），然后伏卧。'}),profile('线性场','Cannon',[r('Range',20)],[d('Kinetic','3d6')],[tag('tg_ap'),tag('tg_ordnance'),tag('tg_heat_self',5)],{on_hit:'目标每有 1 点装甲，该次命中额外造成 +1d6 伤害，最多 +3d6 额外伤害。（触发条件由用户核对确认。）'})]}),
 gear('mw_pl_hotwind','热风冲锋手枪','pl_ch_tawa',{mount:'Auxiliary',type:'CQB',range:[r('Range',3),r('Threat',3)],damage:[d('Kinetic','1d3+1')],tags:[tag('tg_inaccurate')],on_attack:'你可将其射程改为锥形 5，但它必须重新装填才能再次使用（正如它拥有装填标签）。'}),
 gear('mw_pl_heavy_blaster','重击炮','pl_ch_tawa',{mount:'Heavy',type:'Cannon',range:[r('Range',5)],damage:[d('Kinetic','2d6+6')],tags:[tag('tg_ap'),tag('tg_loading'),tag('tg_overkill')],on_hit:'你的目标必须通过机体豁免否则击倒伏卧。',effect:'在使用该武器任意攻击触发杀绝后，你必须通过机体检定否则击倒伏卧。'}),
 gear('mw_pl_plasma_shield','等离子电浆盾','pl_ch_duelist',{mount:'Main',type:'Melee',range:[r('Threat',1)],damage:[d('Kinetic','1d6')],tags:[tag('tg_limited',2),tag('tg_unique')],effect:'你可以使用该武器攻击而无需消耗充能。当你因致命伤害或其他影响而被迫摧毁一件武器时，可选择摧毁该武器，即使它已耗尽剩余充能。你也可以消耗 1 充能来使用充能格挡反应。',on_hit:'你可消耗 1 充能，造成 +1d6 额外能量伤害。',actions:[{name:'充能格挡',activation:'Reaction',frequency:'1/round',heat_cost:3,trigger:'你被远程或近战攻击命中。',detail:'消耗 1 充能，自己受到 3 热度，获得对该伤害的抗性。'}]}),
 gear('mw_pl_heavy_shield','赫塔卡重型战斗盾','pl_ch_duelist',{mount:'Heavy',type:'Melee',range:[r('Threat',1)],damage:[d('Kinetic','1d6+3')],tags:[tag('tg_knockback',2)],effect:'交战时，你的机甲<b>大小</b>被视为 <b>+1</b>，并且你可以将所有针对你的强制移动减少 <b>1 空间</b>，最低 <b>0 空间</b>。'})
];
const systems=[
 gear('ms_pl_sentry_drone','哨兵无人机','pl_ips_watchman',{sp:3,tags:[tag('tg_unique'),tag('tg_full_action'),tag('tg_drone')],effect:'以一个完整动作，在一个邻近自由空间部署该无人机。配备任何一件从你的机甲已武装的非超重型 CQB、步枪，并在部署时安装到无人机。无人机有自己的回合，在此期间它可使用安装在身上的武器攻击，使用你的毅力与豁免目标，但无法使用你的天赋。每当你采取稳住阵脚动作时，装在无人机上的武器会重新装填。无人机可以一个完整动作回收而武器返回你的机甲；若无人机被毁，进行工程检定，成功武器保持完整并可重新装备，否则武器会被摧毁。',deployables:[{name:'哨兵无人机',type:'Drone',size:0.5,hp:10,evasion:10,edef:10,detail:'标签：无人机；拥有自己的回合，使用安装的非超重型 CQB 或步枪攻击，使用部署者的毅力和豁免目标，不能使用其天赋。'}],actions:[{name:'部署哨兵无人机',activation:'Full',detail:'部署到邻近自由空间，并装备机甲已安装的一件非超重型 CQB 或步枪。'},{name:'哨兵射击',activation:'Reaction',frequency:'1/round',trigger:'敌方角色移动到哨兵无人机射程 3 内。',detail:'无人机可对该角色进行 +2 难度的武器攻击。'},{name:'回收哨兵无人机',activation:'Full',detail:'回收无人机，武器回到机甲。'}]}),
 gear('ms_pl_active_defense','主动防御系统','pl_ips_watchman',{sp:3,tags:[tag('tg_unique'),tag('tg_quick_action'),tag('tg_deployable'),tag('tg_shield'),tag('tg_limited',2)],effect:'以一个快速动作，在邻近自由空间部署<b>爆发 2</b>拦截场。对你、该系统或区域内任意盟友角色的远程攻击 <b>+1 难度</b>；使用发射器、投掷、抛射或引导武器攻击会将区域内目标视为隐形。效果持续到场景结束，或直到系统被摧毁。',deployables:[{name:'主动防御系统',type:'Deployable',size:1,hp:10,evasion:5,detail:'标签：可展开；爆发 2 拦截场。'}],actions:[{name:'部署主动防御系统',activation:'Quick',detail:'消耗 1 充能，在邻近自由空间部署爆发 2 拦截场。'}]}),
 gear('ms_pl_fcs_relay','FCS 战术网络中继','pl_ips_overlord',{sp:3,tags:[tag('tg_unique')],effect:'<b>1/轮</b>，当你消耗锁定时，可选择感应内一个盟友角色，使其下一个攻击骰 <b>+1 准度</b>直到其下一回合结束；或者当感应内一个盟友角色消耗锁定时，你下一个攻击骰 <b>+1 准度</b>直到你下一回合结束。'}),
 gear('ms_pl_mitra','密特拉级 NHP','pl_ips_overlord',{sp:3,tags:[tag('tg_unique'),tag('tg_ai')],effect:'你的机甲获得 <b>AI</b> 标签和<b>密特拉协定</b>。',actions:[{name:'密特拉协定',activation:'Protocol',heat_cost:1,detail:'自己受到 1 热度，给予感应内一个盟友以下奖励之一；或者自己受到 3 热度，从以下三项中任选两项同时给予。①该盟友下一次远程或近战攻击消耗锁定时获得基于武器大小的可靠（副 1、主 2、重或超重 3），若已有可靠则 +1。②该盟友下一次远程或近战攻击消耗锁定时获得 AP。③该盟友攻击具有锁定状况的角色时武器获得抛射，但必须在攻击过程中消耗锁定。'}]}),
 gear('ms_pl_atg_bombs','ATG 精确炸弹','pl_ssc_sparrowhawk',{sp:3,tags:[tag('tg_unique'),tag('tg_quick_action'),tag('tg_limited',2)],effect:'以一个快速动作，你可以准备发射一个炸弹部署。当你在飞行时，可在移动过程中向你经过的空间或邻近空间投下准备发射的炸弹。所有在<b>溅射 1</b>或<b>线形 8</b>区域内的角色必须通过敏捷豁免，否则受到 <b>1d6+3 爆炸伤害</b>并<b>伏卧</b>，成功则伤害减半且保持站立。对物品、掩体、地形和环境造成 <b>20 AP 爆炸伤害</b>。一次只能准备发射一枚炸弹。',actions:[{name:'准备 ATG 精确炸弹',activation:'Quick',detail:'消耗 1 充能准备一枚炸弹；飞行移动时投至经过或邻近空间，选择溅射 1 或线形 8。'}]}),
 gear('ms_pl_coolwind','“凉风”温控器','pl_ssc_acolyte',{sp:3,tags:[tag('tg_unique')],effect:'在你回合结束时，清除 <b>1 热度</b>。'}),
 gear('ms_pl_hsc','HSC 电镀','pl_ssc_acolyte',{sp:3,tags:[tag('tg_unique'),tag('tg_overshield')],effect:'当你<b>稳住阵脚</b>时，可以额外花费 <b>1 修理</b>来获得你的<b>毅力+4 护盾</b>。'}),
 gear('ms_pl_tazo_worm','塔佐蠕虫','pl_horus_reason',{sp:1,tags:[tag('tg_unique'),tag('tg_quick_tech')],effect:block('僵尸网络','快速科技','选择射程 3 内的角色。你可同时选择以第一个目标为准射程 3 内的其他角色，只要该射程内持续有新的有效目标，就可重复该过程。所有目标必须通过系统豁免否则受到 1 热度。下一次科技攻击你获得 +1 准度，并且每失败的豁免会使命中 +1 热量，上限为 +3 热量。该效果不会叠加；使用该系统时所有角色无法被多次选中。'),actions:[{name:'僵尸网络',activation:'Quick Tech',detail:'以射程 3 链接未选中的角色；所有目标系统豁免失败受到 1 热度。下一次科技攻击 +1 准度，命中额外热度按失败数增加，最多 +3，不叠加。'}]}),
 gear('ms_pl_disgust_reflex','厌恶/反射','pl_horus_reason',{sp:2,tags:[tag('tg_unique'),tag('tg_invade'),tag('tg_quick_tech')],effect:'获得以下入侵选项：'+block('贱民毒株','入侵','直到你目标下一回合结束，该角色爆发 2 范围内的敌对角色所有攻击 +1 难度。这种效果本身并不叠加。')+block('//没中/_乐了','入侵','你的目标直到下一回合结束前将所有准度视为难度。')}),
 gear('ms_pl_scan_bombs','扫描炸弹','pl_horus_three_eye',{sp:2,tags:[tag('tg_unique'),tag('tg_limited',2)],effect:'消耗 1 充能获得以下效果之一：'+block('脉冲手雷','榴弹，投掷，射程 5，溅射 2','你和所有盟友角色对受影响区域内目标的所有攻击都 +1 准度，且区域内敌对角色无法匿迹、不能躲藏、不能受益于隐形。该区域持续到你下一回合结束。')+block('回声地雷','地雷，爆发 2','任何角色移动经过或邻近地雷就会引爆，创造持续到场景结束的高强度扫描场。该区域爆炸时，区域内所有角色必须通过系统豁免否则受到 4 热度，成功热度减半。你和所有盟友角色对区域内角色进行远程和科技攻击时忽略视线要求，所有攻击 +1 准度；区域内敌对角色无法匿迹、不能躲藏、不能受益于隐形。被引爆的回声地雷可被摧毁以终结效果，视为 5 HP、5 回避、大小 1/2 的物品。')}),
 gear('ms_pl_self_bridge','自我意识桥接','pl_horus_bunraku',{sp:3,tags:[tag('tg_unique'),tag('tg_quick_tech'),tag('tg_heat_self',2)],effect:'获得以下快速科技选项：',actions:[{name:'对话',activation:'Quick Tech',frequency:'1/round',detail:'自己受到 2 热度。视线感应内一个盟友可受到 2 热度，以反应立即使用你选择的挂载点进行交火；所有攻击 +1 难度。适用时使用该盟友自己的数据、天赋和你自己的天赋，相同天赋不叠加。'}]}),
 gear('ms_pl_ontological_pulse','本体论超空间战术脉冲','pl_horus_bunraku',{sp:4,tags:[tag('tg_unique'),tag('tg_quick_action'),tag('tg_limited',1)],effect:'<b>1/场景</b>，激活后你<b>晕眩</b>直到下一回合结束。所有感应内盟友可立即做出以下所有反应：①移动 3 空间（忽略交战和反应），或立即从伏卧站起；②重新装填武器，或下次攻击 +1 准度；③结束自己身上的一个状态，或感应内处于超温危域的敌对角色必须通过系统豁免，否则受损和缓慢直到他们下一回合结束。',actions:[{name:'本体论超空间战术脉冲',activation:'Quick',frequency:'1/scene',detail:'消耗 1 充能，自己晕眩至下一回合结束；感应内盟友立即进行三组反应，各组选择其一。'}]}),
 gear('ms_pl_gravity_vane','重力风向标','pl_ha_deepwell',{sp:2,tags:[tag('tg_unique'),tag('tg_protocol')],effect:'当你激活该协定时，你不能进行科技动作、攻击或任何强制豁免的动作，但你可以在移动时<b>悬浮</b>，并且<b>免疫所有坠落伤害</b>。只要系统处于激活状态，仍可获得<b>软性掩护</b>的增益。效果持续到场景结束，或以<b>协定</b>停用。',actions:[{name:'重力风向标',activation:'Protocol',detail:'激活或停用。激活期间移动可悬浮，免疫所有坠落伤害，仍可受益于软性掩护；不能科技动作、攻击或强迫豁免。'}]}),
 gear('ms_pl_tactical_belt','战术带','pl_ch_shepherd',{sp:0,tags:[tag('tg_unique')],effect:'该系统占据你选择的一个<b>非内置挂载点</b>来代替武器。选择最多 <b>2</b> 个带有<b>榴弹、地雷或可展开</b>标签的系统，安装到该系统上，将它们的 SP 总成本降低 <b>4</b>，最低 <b>0</b>。若该系统被摧毁，装载其上的所有系统也被摧毁，且在此次战术修复前无法修复。'}),
 gear('ms_pl_weapon_pod','武器舱','pl_ch_shepherd',{sp:3,tags:[tag('tg_unique'),tag('tg_quick_action')],effect:'装备该系统时，选择 <b>2 把副武器或 1 把主武器</b>储存于舱内。所储武器无需装备到机甲挂载点，不能用来攻击，也不能重新装填。以一个<b>快速动作</b>，可将舱内武器与任何非内置挂载点的武器交换。所有最终武器的安装及 SP 花费必须合乎规则。若系统被摧毁，储存的所有武器也被摧毁。',actions:[{name:'交换武器舱武器',activation:'Quick',detail:'将储存武器与任意非内置挂载点武器交换，最终挂载尺寸和 SP 必须合法。'}]})
];
const mods=[
 gear('wm_pl_underslung','下挂式冲击器','pl_ips_vanguard',{sp:3,allowed_sizes:['Main','Heavy'],tags:[tag('tg_unique'),tag('tg_mod')],effect:'选择一把主武器或重武器。使用该武器攻击时可改用以下数据。其他任何适用于武器的改造（包括核心奖励）均不适用于此模组。即使该数据需要重新装填，仍可继续使用原本的武器攻击。'+block('下挂式冲击器','副武器发射器，AP，装填；射程 3；5 爆炸伤害','命中：目标必须通过机体豁免否则离散直到他们下一回合结束。当向物品、掩体、地形和环境开火时，该武器自动对最多 3 个邻近大小 1 区域造成 20 AP 爆炸伤害。'),profiles:[profile('下挂式冲击器','Launcher',[r('Range',3)],[d('Explosive',5)],[tag('tg_ap'),tag('tg_loading')],{mount:'Auxiliary',no_bonuses:true})]}),
 gear('wm_pl_optimized','最优化工程','pl_ha_workshop',{sp:2,restricted_types:['Melee'],tags:[tag('tg_mod'),tag('tg_limited',2)],effect:'选择一把远程武器。<b>1/轮</b>，可以消耗 1 充能重新掷该武器的攻击骰，但必须接受第二个结果。可消耗 1 充能在休息期间免费修复该武器。'})
];

// 用户确认的 PI-OF 与 K/KCA 专业牌照；装备风味文本见 source/lore/zh.json。
professional_licenses.push(...[
  {
    "id": "pl_piof_pioneer",
    "name": "拓荒者",
    "source": "PI-OF",
    "rank": 1,
    "description": "拓荒者是顶峰实业猎户座派系面向殖民地先遣队与边境驻军提供的通用工程牌照，采用公司现有的殖民地建设设备，为不同规格的底盘提供野外作业和维护能力。牌照中的液压工具与便携作业设施经过军用改装，适用于临时工事修筑、障碍清除及缺乏后勤支援条件下的装备抢修。对同时承担建设与防卫任务的殖民地部队而言，这套设备可以减少专用工程载具的配备需求，并继续使用当地已有的工业维修设施。"
  },
  {
    "id": "pl_piof_miner",
    "name": "星际矿工",
    "source": "PI-OF",
    "rank": 2,
    "description": "星际矿工是拓荒者系列的重型工程扩展，其技术源自顶峰实业长期供应小行星矿场和卫星露天采掘区的破岩设备。猎户座派系保留了这些设备在高负荷作业中的机械结构，并针对机甲近距离交战重新设计了挂载接口与控制系统。冲击掘进钻能够用于破坏装甲和加固工事，配套推进器则允许驾驶员穿越原本无法通行的地形。该牌照主要面向承担攻坚与通路开辟任务的单位；在缺少工程支援时，持牌机甲也可直接参与矿区和地下设施的抢通作业。",
    "prerequisites": [
      "pl_piof_pioneer"
    ]
  },
  {
    "id": "pl_piof_eden",
    "name": "伊甸先锋",
    "source": "PI-OF",
    "rank": 3,
    "description": "伊甸先锋牌照由顶峰实业的殖民地环境改造部门提供技术支持，最初用于装备在大型施工设施抵达前开展作业的先遣单位。其地貌重塑阵列与便携天候塔允许驾驶员在有限区域内整治地形、调节作业环境，为后续人员建立落脚点。猎户座派系将这套设备引入军事用途后，扩大了系统的现场控制权限，使其能够用于临时阵地构筑、进攻路线整理及局部战场环境干预。相较于公司的常规地球化设备，伊甸先锋更注重快速部署，适合需要频繁转移作业位置的小规模编队。",
    "prerequisites": [
      "pl_piof_miner"
    ]
  },
  {
    "id": "pl_kkca_squire",
    "name": "侍从",
    "source": "K/KCA",
    "rank": 1,
    "description": "侍从是哈尔根／卡西米尔定制装配面向初次参加锦标赛的驾驶员提供的基础专业牌照，包含一套适用于多种底盘的决斗武器与纹章展示设备。“誓约”短剑采用工作室的标准制式，便于骑手在不同机体上保持熟悉的操控手感；配套纹章旗则兼作近距离战术信标，为同队骑手提供姿态修正与威胁预警。持牌者可以提交自己的家族纹章或所属团体标识，由工作室完成相应的外观定制。"
  },
  {
    "id": "pl_kkca_knight",
    "name": "骑士",
    "source": "K/KCA",
    "rank": 2,
    "prerequisites": [
      "pl_kkca_squire"
    ],
    "description": "骑士牌照提供给在伊斯帕萨拉尔锦标赛中取得认可战绩的侍从牌照持有者，其装备针对公开比武中的正面交锋设计。重骑枪沿用当地骑士赛事的冲击武器结构，在一次全力冲刺中释放足以破坏自身的载荷；配套决斗协议负责向参赛机体及场地系统广播挑战，持续标记交战双方。随着持牌驾驶员进入军事与安保领域，这套原本用于竞技场的装备也开始用于突击任务，以迅速迫使选定目标投入近距离交战。"
  },
  {
    "id": "pl_kkca_lord",
    "name": "领主",
    "source": "K/KCA",
    "rank": 3,
    "prerequisites": [
      "pl_kkca_knight"
    ],
    "description": "领主是 K/KCA 为率领扈从与骑士编队的资深驾驶员保留的定制专业牌照，采用邀请授予的方式，由工作室根据持有者的惯用底盘、家族纹章和编队战法分别调校。守护铠将紧急机动与护盾发生器联动，用于掩护遭受致命打击的同伴；凯旋号角则接入编队通讯与状态监控系统，协助友军在突破敌方阵线后恢复行动并继续进攻。每套装备交付时均附有工作室创始人签署的证书，其调校记录也将随持有者的服役经历持续更新。"
  }
]);
weapons.push(gear("mw_pl_piof_rivet", "「垦荒者」液压铆钉枪", "pl_piof_pioneer", {
  "mount": "Main",
  "type": "CQB",
  "range": [
    {
      "type": "Range",
      "val": 5
    }
  ],
  "damage": [
    {
      "type": "Kinetic",
      "val": "1d6+2"
    }
  ],
  "tags": [
    {
      "id": "tg_loading"
    }
  ],
  "on_hit": "若目标邻近硬性掩护、障碍物或墙面，目标必须通过机体豁免，否则被钉在该处并固定。<br>固定持续到目标自己用快速动作拔出铆钉、目标不再与该处邻接，或该处被摧毁。<br>只有目标自己能拔出铆钉；已被铆钉固定的角色不会再次被固定。",
  "effect": "该武器对物品和地形造成双倍伤害。"
}));
weapons.push(gear("mw_pl_piof_drill", "TT.5 冲击掘进钻", "pl_piof_miner", {
  "mount": "Heavy",
  "type": "Melee",
  "range": [
    {
      "type": "Threat",
      "val": 1
    }
  ],
  "damage": [
    {
      "type": "Kinetic",
      "val": "1d6+4"
    }
  ],
  "tags": [
    {
      "id": "tg_ap"
    }
  ],
  "on_hit": "目标必须通过机体豁免，否则被击退 2 并伏卧；若因此撞上障碍物或地形，额外受到 1d6 动能伤害。",
  "effect": "该武器对物品和地形造成 20 AP 动能伤害。"
}));
weapons.push(gear("mw_pl_kkca_oath", "「誓约」决斗短剑", "pl_kkca_squire", {
  "mount": "Auxiliary",
  "type": "Melee",
  "tags": [
    {
      "id": "tg_reliable",
      "val": 1
    }
  ],
  "range": [
    {
      "type": "Threat",
      "val": 1
    }
  ],
  "damage": [
    {
      "type": "Kinetic",
      "val": "1d3"
    }
  ],
  "effect": "获得招架反击反应。",
  "actions": [
    {
      "name": "招架反击",
      "activation": "Reaction",
      "frequency": "1/round",
      "trigger": "威胁 1 内的一个敌对角色对你进行的近战攻击未命中。",
      "detail": "<b>条件：</b>与决斗短剑装在同一挂载点上的另一件武器是近战武器。<br><b>效果：</b>你用那件近战武器攻击触发攻击的角色。"
    }
  ]
}));
weapons.push(gear("mw_pl_kkca_joust", "「比武」重骑枪", "pl_kkca_knight", {
  "mount": "Heavy",
  "type": "Melee",
  "tags": [
    {
      "id": "tg_knockback",
      "val": 2
    }
  ],
  "range": [
    {
      "type": "Threat",
      "val": 2
    }
  ],
  "damage": [
    {
      "type": "Kinetic",
      "val": "1d6+3"
    }
  ],
  "effect": "<b>骑枪冲刺：</b><b>1/场景</b>，当你进行标准移动或推进时，你可以作为这次移动的一部分进行<b>骑枪冲刺：</b>在这次移动中已直线移动至少 6 空间后，用该武器攻击威胁内的一个角色，<b>不需要额外动作</b>。<br>该攻击获得 AP 且 <b>+1 准度</b>；命中时造成 +1d6 额外伤害，并使目标伏卧。<br>攻击结算后，你可以继续完成这次移动，剩余移动忽略该目标的交战与反应。<br>若骑枪冲刺命中，骑枪碎裂：该武器被摧毁，直到你下一次全面维修前都不能使用或修复。<br>骑枪碎裂前，该武器可以照常用交火或弹幕攻击。"
}));
systems.push(gear("ms_pl_piof_workbench", "「拓荒工位」野外作业台", "pl_piof_pioneer", {
  "sp": 2,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_deployable"
    },
    {
      "id": "tg_quick_action"
    },
    {
      "id": "tg_limited",
      "val": 1
    }
  ],
  "effect": "作业台可当作硬性掩护，持续到场景结束。<br>邻近作业台的角色可以用快速动作花费 1 修理，修复自己一件被摧毁的武器或系统；每个角色每场景 1 次。",
  "deployables": [
    {
      "name": "拓荒工位",
      "type": "Deployable",
      "size": 1,
      "hp": 10,
      "evasion": 5,
      "detail": "标签：可展开；可作为硬性掩护，持续到场景结束。"
    }
  ],
  "actions": [
    {
      "name": "部署拓荒工位",
      "activation": "Quick",
      "detail": "消耗 1 充能，在邻近自由空间部署。"
    }
  ]
}));
systems.push(gear("ms_pl_piof_tunnel", "「矿道」掘进推进器", "pl_piof_miner", {
  "sp": 3,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_protocol"
    }
  ],
  "effect": "获得掘进协定。",
  "actions": [
    {
      "name": "掘进",
      "activation": "Protocol",
      "detail": "激活时受到等同你的大小 +1 的热度（大小 ½ 视为 1）：大小 ½、1 为 2，大小 2 为 3，大小 3 为 4。<br>直到你的回合结束，你可以将移动路径上的地形和障碍物视为困难地形穿过。<br>自愿移动时离开的每个空间（按你的占格计算）都变为困难地形，持续到场景结束。<br>被挖穿的地形和障碍物不再阻挡移动或视线，也不再提供掩护。<br>飞行时不能激活；不能挖穿地图边界或 GM 认定无法破坏的结构。"
    }
  ]
}));
systems.push(gear("ms_pl_piof_terraform", "地貌重塑阵列", "pl_piof_eden", {
  "sp": 4,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_full_action"
    },
    {
      "id": "tg_limited",
      "val": 1
    }
  ],
  "effect": "获得重塑地貌完整动作。",
  "actions": [
    {
      "name": "重塑地貌",
      "activation": "Full",
      "detail": "消耗 1 充能，选择视线感应内最多 3 个互不重叠的爆发 1 区域，各自选择一项，持续到场景结束：<br><b>隆起：</b>区域变为高 2 的硬性掩护地形，区域内角色被推到最近的自由空间。<br><b>沉陷：</b>区域变为困难地形，区域内角色必须通过敏捷豁免，否则伏卧。<br><b>平整：</b>移除区域内所有地形与掩体，物品不受影响。"
    }
  ]
}));
systems.push(gear("ms_pl_piof_weather", "天候塔", "pl_piof_eden", {
  "sp": 3,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_deployable"
    },
    {
      "id": "tg_quick_action"
    }
  ],
  "effect": "以快速动作在视线射程 5 内部署天候塔，产生持续到场景结束的爆发 3 天候区。<br>部署时选择模式，之后可以快速动作切换：<br><b>冷凝：</b>你和盟友在区域内结束回合时清除 2 热度。<br><b>沙暴：</b>区域内所有角色获得软性掩护。<br><b>雷暴：</b>只要攻击者或目标至少一方在区域内，敌对角色进行的科技攻击 <b>+1 难度</b>。<br>飞行角色在区域内开始回合或进入区域时，必须通过敏捷豁免，否则立即降落（视为不受伤害的坠落），且直到其下一回合结束前不能飞行。",
  "deployables": [
    {
      "name": "天候塔",
      "type": "Deployable",
      "size": 1,
      "hp": 10,
      "evasion": 5,
      "detail": "标签：可展开；爆发 3 天候区，持续到场景结束。"
    }
  ],
  "actions": [
    {
      "name": "部署天候塔",
      "activation": "Quick",
      "detail": "在视线射程 5 内部署并选择模式。"
    },
    {
      "name": "切换天候",
      "activation": "Quick",
      "detail": "切换冷凝、沙暴或雷暴模式。"
    }
  ]
}));
systems.push(gear("ms_pl_kkca_banner", "「家徽」纹章旗", "pl_kkca_squire", {
  "sp": 2,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_deployable"
    },
    {
      "id": "tg_quick_action"
    }
  ],
  "effect": "纹章旗持续到场景结束；同一时间只能有一面纹章旗。<br>旗帜爆发 2 内的盟友角色，在对抗伏卧、强制移动和晕眩的检定与豁免中 <b>+1 准度</b>。<br><b>每场景一次</b>，当区域内一个盟友角色失去结构时，其余区域内盟友角色的下一次攻击 <b>+1 准度</b>。",
  "deployables": [
    {
      "name": "家徽纹章旗",
      "type": "Deployable",
      "size": 0.5,
      "hp": 5,
      "evasion": 5,
      "detail": "标签：可展开；爆发 2，持续到场景结束。同一时间只能有一面。"
    }
  ],
  "actions": [
    {
      "name": "部署纹章旗",
      "activation": "Quick",
      "detail": "在邻近自由空间插下纹章旗。"
    }
  ]
}));
systems.push(gear("ms_pl_kkca_challenge", "「宣战」决斗协议", "pl_kkca_knight", {
  "sp": 2,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_quick_action"
    }
  ],
  "effect": "获得宣战快速动作。",
  "actions": [
    {
      "name": "宣战",
      "activation": "Quick",
      "detail": "以快速动作选择视线感应内一个敌对角色作为你的对手，持续到场景结束、任一方被摧毁，或你选择新的对手。<br>你对对手的攻击 <b>+1 准度</b>，对其他角色的攻击 <b>+1 难度</b>；对手攻击你以外的角色时 <b>+1 难度</b>。"
    }
  ]
}));
systems.push(gear("ms_pl_kkca_guard", "「代誓」守护铠", "pl_kkca_lord", {
  "sp": 3,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_overshield"
    }
  ],
  "effect": "获得代誓反应。",
  "actions": [
    {
      "name": "代誓",
      "activation": "Reaction",
      "frequency": "1/scene",
      "trigger": "视线射程 5 内一个盟友角色受到会使其 HP 降至 0 的伤害。",
      "detail": "<b>条件：</b>该盟友邻近存在你能以此次移动到达的自由空间。<br><b>效果：</b>按顺序结算以下效果：<br>①你立即移动最多 <b>5 空间</b>，在该盟友邻近的一个自由空间结束移动。此次移动忽略交战，且不会触发反应。<br>②你获得 <b>4＋毅力的临时护盾</b>。<br>③你代替该盟友承受触发此反应的伤害及其所有效果，即使你通常不是有效目标。<br><b>此次获得的临时护盾仅用于承受本次反应转移给你的伤害。本次反应结算完毕后，失去该临时护盾的全部剩余值。</b>"
    }
  ]
}));
systems.push(gear("ms_pl_kkca_triumph", "「凯旋」号角", "pl_kkca_lord", {
  "sp": 2,
  "tags": [
    {
      "id": "tg_unique"
    },
    {
      "id": "tg_limited",
      "val": 2
    }
  ],
  "effect": "获得凯旋自由动作。",
  "actions": [
    {
      "name": "凯旋",
      "activation": "Free",
      "detail": "当你在本回合摧毁一个敌对角色或使其失去结构后，可以用自由动作消耗 <b>1 充能</b>。感应内所有盟友角色<b>各自选择以下一项</b>：<br>①清除自身 <b>1 个非自身造成的状态</b>。<br>②下一次攻击获得 <b>+1 准度</b>。"
    }
  ]
}));
module.exports={PACK:'专业牌照（用户截图）',professional_licenses,weapons,systems,mods};
