# Foundry LCP 导出核对表：扩展内容

由 `node tools/build-lcp.js` 生成，请勿手改。

内容包：枪骑兵简易车卡器：扩展内容（中文） 1.0.0

| 类别 | 条目数 |
|---|---|
| frames | 74 |
| weapons | 117 |
| systems | 187 |
| mods | 9 |
| core_bonuses | 21 |
| talents | 21 |
| pilot_gear | 1 |

- 覆盖官方条目：108
- 新增条目：322
- 写入的车卡器说明：100 条
- 补译：0 处

官方数据版本：@massif/dustgrave-data 1.4.0，@massif/ktb-data 1.2.4，@massif/long-rim-data 1.2.2，@massif/osr-data 1.2.0，@massif/ows-data 1.0.1，@massif/sotw-data 1.0.2，@massif/ssmr-data 1.7.0，@massif/wallflower-data 2.1.0

## 数值差异（以车卡器为准）

覆盖官方条目时改用了车卡器的数值。这里列出与官方不同之处，便于确认是有意调整还是转录差异。

| 条目 | 字段 | 官方 | 车卡器 |
|---|---|---|---|
| 萨加玛塔（mf_ext_sagarmatha） | 定位 | ["Defender"] | ["Striker"] |
| 库图佐夫（mf_ext_kutuzov） | 定位 | ["Defender","Support"] | ["Striker","Support"] |
| 帝王蝶（mf_ext_emperor） | 骨架数值 sp | 7 | 5 |
| 不稳定 NHP（ms_ext_unstable_nhp） | tags | [{"id":"tg_unique"},{"id":"tg_round","val":1}] | [{"id":"tg_unique"},{"id":"tg_ai"}] |

## 结构不一致

官方与车卡器的动作、部署物等数量不同时保留官方结构，对应文字仍是英文。

- mw_ext_shock_claws → mw_integrated_shock_claws：官方有 3 组数据，车卡器 1 组，保留官方各组数值
- mw_ext_reversal_loop → mw_retort_loop：官方有 4 组数据，车卡器 1 组，保留官方各组数值
- mw_ext_arrow_nexus → mw_bolt_nexus：官方有 2 组数据，车卡器 1 组，保留官方各组数值
- mw_ext_terashima_blade → mw_terashima_blade：官方有 5 组数据，车卡器 1 组，保留官方各组数值
- mw_ext_hhs155_cannibal → mw_hhs_155_cannibal：官方有 2 组数据，车卡器 1 组，保留官方各组数值
- ms_ext_forge_ii → ms_forge_2_subaltern_squad 的 deployables：官方 4 项，车卡器 1 项，保留官方结构（英文）
- ms_ext_camus_edge → ms_camuss_razor 的 actions：官方 2 项，车卡器 1 项，保留官方结构（英文）

## 覆盖后仍为英文的文字

补译方法：把 `dist/fvtt/zh-overrides.todo.json` 中需要的条目复制到 `source/fvtt/zh-overrides.json`，把英文换成中文后重新运行构建。

| 条目 | 位置 | 英文 |
|---|---|---|
| mf_chomolungma | core_system.passive_actions[0].name | Balance Control Lockout |
| mf_chomolungma | core_system.passive_actions[0].detail | Push your target 2 spaces in any direction and knock them Prone. If they are already Prone, they become Immobilized until the end of their next turn. You may on… |
| mf_chomolungma | core_system.passive_actions[1].name | System Crusher |
| mf_chomolungma | core_system.passive_actions[1].detail | Your target takes an additional 2 heat, for a total of 4 heat. If this Invade causes them to exceed their Heat Cap, they take 4 burn as well. This can only be u… |
| mf_sagarmatha | traits[1].synergies[0].detail | 1/scene the Sagarmatha can brace without sacrificing any actions or movement on its following turn. |
| mf_sagarmatha | traits[2].synergies[0].detail | The Sagarmatha can be repaired at a rate of 1 Repair per 1 structure damage. |
| mf_Empakaai_alt_blackbeard | core_system.description | Upon Ololade Omotanwa’s sculpted mountain a message is inscribed under the cold-span limiters of Iku’s Hand.“I gift to you a mountain. Rolling hills, curvilinea… |
| mf_Empakaai_alt_blackbeard | core_system.active_actions[0].name | Iku’s Hand |
| mf_Empakaai_alt_blackbeard | core_system.active_actions[0].detail | After successfully hitting a character with a melee weapon attack, the Empakaai may Grapple the target as a free action. On a success, the target is pulled adja… |
| mf_Empakaai_alt_blackbeard | core_system.active_actions[1].name | Catalytic Infusor |
| mf_Empakaai_alt_blackbeard | core_system.active_actions[1].detail | At the end of the Empakaai's turn, it deals [its current Heat] in energy AP damage to a character of its choice it is Grappled with. It may also instead choose … |
| mf_lancaster_alt_taraxacum | core_system.description | Initial Taraxacum design drafts called for a highly sensitive, custom-printed sensor suite. Unfortunately, a litany of design flaws forced engineers on Crosslan… |
| mf_störtebeker | traits[0].synergies[0].detail | On critical hit: Reload all melee weapons not used to attack this turn. |
| mf_störtebeker | traits[0].synergies[1].detail | On critical hit: Reload all ranged weapons not used to attack this turn. |
| mf_störtebeker | traits[1].synergies[0].detail | 1/Scene, after hitting with a weapon, the Störtebeker may apply one of the following effects depending on the weapon’s type. Non-Loading weapon: The hit is trea… |
| mf_störtebeker | core_system.description | Project TRUESILVER was an attempt to improve the destructive capabilities of whitewash nano-machines. The hyper-specialized nanites manifest themselves as a mir… |
| mf_störtebeker | core_system.passive_actions[0].name | Reprise |
| mf_störtebeker | core_system.passive_actions[0].detail | Skirmish with a weapon that was reloaded via DYNAMIC RELOAD this turn. |
| mf_störtebeker | core_system.passive_actions[1].name | Renewal |
| mf_störtebeker | core_system.passive_actions[1].detail | All weapons not used to attack this turn are reloaded at the end of the turn. |
| mf_black_witch_alt_orchidea | traits[0].synergies[0].detail | The Orchis and all adjacent allied characters have IMMUNITY to all damage and effects from missed attacks. |
| mf_black_witch_alt_orchidea | core_system.description | &ldquo;The man who took the reins of steel and became greater than man. The lowly one, the first, the greatest, the one who threw the sun at the face of his foe… |
| mf_black_witch_alt_orchidea | core_system.passive_actions[0].name | Hunting Eagle |
| mf_black_witch_alt_orchidea | core_system.passive_actions[0].detail | 1/round when the Orchis causes a character to collide with another obstacle or character, you can - in addition to any other effects - throw your mech's scuta s… |
| mf_amber_phantom | core_system.description | SSC's precognitive neural bridging systems are not paracausal as the name might suggest. Using carefully modulated neural stimulation and acceleration, the oper… |
| mf_micro_monarch | traits[0].synergies[0].detail | This weapon is treated as though it were also a CQB weapon with THREAT 3. |
| mf_micro_monarch | core_system.description | By redlining its integrated Vigilante launchers, the Viceroy can deliver a devastating saturation bombardment of its close surroundings. Weathering the onslaugh… |
| mf_swallowtail_alt_swallowtail_ranger_variant | traits[1].synergies[0].detail | 1/round when the Swallowtail inflicts Lock On, an allied character in its sensor range and line of sight can move up to its speed as a reaction. |
| mf_swallowtail_alt_swallowtail_ranger_variant | core_system.description | Outnumbered, outgunned, and lacking the ability to mass-produce mechs, the rangers have had to rely on the legacy of Hercynia itself to protect them. Each of th… |
| mf_balor_alt_hecatoncheires | core_system.description | Hard lessons were learned from the downfall of the Maw, harder even than those learned from the invisible, unstoppable consumption of Bo. From those lessons cam… |
| mf_balor_alt_hecatoncheires | core_system.active_actions[0].name | Enrage Swarm |
| mf_balor_alt_hecatoncheires | core_system.active_actions[0].detail | Each hostile character in one or more areas created by your Drones takes 4 burn. This action is Efficient and will refund 1 Core Point at the end of any scene i… |
| mf_balor_alt_hecatoncheires | core_system.passive_actions[0].name | Deploy Razor Swarm |
| mf_balor_alt_hecatoncheires | core_system.passive_actions[0].detail | Deploy a Razor Swarm to a valid Blast 1 area within Sensors that contains no hostile characters. The Hecatoncheires may only have a single Razor Swarm deployed … |
| mf_balor_alt_hecatoncheires | core_system.deployables[0].name | Razor Swarm |
| mf_balor_alt_hecatoncheires | core_system.deployables[0].detail | A Razor Swarm is a Blast 1 area that provides soft cover to allied characters that are at least partially within the area. Hostile characters that start their t… |
| mf_lycan | core_system.description | As a chassis designed for covert operations, the Lycan leverages the Manticore's affinity for electromagnetics in order to further obscure its precise nature, w… |
| mf_minotaur_alt_wraith | traits[0].synergies[0].detail | 1/round, when the Calendula hits a character with a tech attack, it can create a void husk in a free space within RANGE 3 of its target. Void husks are INTANGIB… |
| mf_minotaur_alt_wraith | traits[0].deployables[0].name | Void Husk |
| mf_minotaur_alt_wraith | traits[0].deployables[0].detail | The void husk is an intangible object that doesn’t cause obstruction. The husk is the same size as its target, immune to all damage and effects, and emits a Bur… |
| mf_minotaur_alt_wraith | traits[2].actions[0].name | Grammaton Mantle |
| mf_minotaur_alt_wraith | traits[2].actions[0].detail | As a protocol, the Calendula can become INTANGIBLE until the start of its next turn. |
| mf_minotaur_alt_wraith | core_system.description | &ldquo;I inscribe thy name, I threaten thee with the second death. I kill thy name, and this I kill thee again in the afterlife.&ldquo; |
| mf_minotaur_alt_wraith | core_system.passive_actions[0].name | Execrate |
| mf_minotaur_alt_wraith | core_system.passive_actions[0].detail | 1/round You may target another character in line of sight within Range 3 of a void husk, banishing them to an interstitial space. Allied characters can choose w… |
| mf_genghis_alt_worldkiller_genghis_mk_i | traits[2].synergies[0].detail | The Genghis receives +1 Difficulty on all SYSTEM saves and checks. |
| mf_genghis_alt_worldkiller_genghis_mk_i | core_system.description | Inside his great suit the fireman smiles. He is a salamander upon the world, belching flame, cleaning away history, and leaving a new land for the living. |
| mf_genghis_alt_worldkiller_genghis_mk_i | core_system.passive_synergies[0].detail | While in the DANGER ZONE, you are surrounded by shimmering heat that interferes with targeting. You gain soft cover. Additionally, other than you, characters wi… |
| mf_kutuzov | core_system.description | One of the Kutuzov's most distinct features is its series of integrated parallel-tracked field emitters, allowing for the simultaneous modulation and projection… |
| mf_sherman_alt_tagetes | core_system.description | Tilimsan is a harsh proving ground for any mech. Baking heat, scouring sand, dry lightning, and treacherous terrain are challenge enough for designers, but Comp… |
| mf_tokugawa_alt_enkidu | traits[0].synergies[0].detail | When the Enkidu ends its turn in the Danger Zone, it enters the Primal Fury state. |
| mf_tokugawa_alt_enkidu | traits[1].synergies[0].detail | While it’s in the DANGER ZONE, the Enkidu can’t make ranged or tech attacks but has 6 base SPEED. |
| mf_tokugawa_alt_enkidu | traits[2].synergies[0].detail | The Enkidu gets +1 accuracy on hull checks and saves. |
| mf_tokugawa_alt_enkidu | core_system.description | “I argue that it is Man who is shapeless; far from immutable, he is given form by the environment around him. In civilization, man is as divine as old God, who … |
| mf_tokugawa_alt_enkidu | core_system.active_actions[0].name | Bifurcate |
| mf_tokugawa_alt_enkidu | core_system.active_actions[0].detail | The Enkidu engages its monstrous strength, targets an adjacent character (allied or hostile) and attempts to tear them in half with its talons. If the target ha… |
| mf_gilgamesh | traits[1].counters[0].name | Arsenal Die |
| mf_gilgamesh | core_system.description | The Gilgamesh was designed from the ground up to be easy and inexpensive to both construct and maintain, but to Harrison Armory "inexpensive" does not equal sho… |
| mf_kidd | traits[0].synergies[0].detail | On its first turn in any combat, the Kidd can deploy or activate any one system with the DRONE or DEPLOYABLE tag as a free action. |
| mf_kidd | traits[1].actions[0].name | Reroute Power |
| mf_kidd | traits[1].actions[0].detail | Destroy one of your deployables or drones to either grant 1d6+1 OVERSHIELD to an allied character or deal 1d6+1 AP Energy Damage to a hostile character. The tar… |
| mf_kidd | traits[2].synergies[0].detail | At the end of any scene in which the Kidd used REROUTE POWER, it restores 1 charge to a LIMITED system of its choice with the DRONE or DEPLOYABLE tag. |
| mf_kidd | core_system.passive_actions[0].name | Plunder 3+ |
| mf_kidd | core_system.passive_actions[0].detail | SCAN every hostile character in a Blast 1 area and give them LOCK ON. |
| mf_kidd | core_system.passive_actions[1].name | Swindle 5+ |
| mf_kidd | core_system.passive_actions[1].detail | Every hostile character in a Blast 1 area must succeed on a SYSTEMS save or become IMPAIRED, JAMMED, and SLOWED until the end of their next turn. |
| mf_kidd | core_system.passive_actions[2].name | Shiver Timbers 6 |
| mf_kidd | core_system.passive_actions[2].detail | Fire a beam weapon, punching a narrow hole through walls and obstructions. One hostile character must succeed on an AGILITY save or take 3d6 AP Energy Damage. O… |
| mf_kidd | core_system.counters[0].name | Jolly Roger |
| mf_white_witch | traits[1].synergies[0].detail | When the White Witch braces, it gains overshield equal to 4 + GRIT before it takes damage. |
| mf_white_witch | core_system.description | “The first test nearly ended the program. Exotic Materials is a … liberal department within the Constellation, but even our executives were hesitant to approve … |
| mf_white_witch | core_system.active_synergies[0].detail | For the rest of the scene, Ferroreactive Armor gives +2 Armor each time instead of +1, to a max of +12. Each time your armor increases in this way, your mech de… |
| mf_white_witch | core_system.passive_synergies[0].detail | Each time you take damage from yourself or a hostile source (even if that damage is reduced or ignored), gain +1 ARMOR for the rest of this scene after taking d… |
| mf_white_witch | core_system.counters[0].name | Ferroreactive Armor |
| mf_emperor | traits[0].synergies[0].detail | The Emperor’s HP is not increased by its pilots GRIT. Instead, at the start of any scene, the Emperor gains OVERSHIELD equal to 6+GRIT. This OVERSHIELD refreshe… |
| mf_emperor | traits[1].synergies[0].detail | Whenever the Emperor grants OVERSHIELD to another character, it gains the same amount of OVERSHIELD. If the Emperor gains OVERSHIELD from any source, including … |
| mf_emperor | traits[2].synergies[0].detail | 1/round, when the Emperor targets a character with an attack, it can condemn that character, forcing them to make an ENGINEERING save. On a failure, the target … |
| mf_atlas | traits[0].synergies[0].detail | The Atlas counts as size 1 for the purposes of ramming and grappling. |
| mf_atlas | traits[0].synergies[1].detail | The Atlas ignores engagement from actors larger than itself, can share space with larger actors (even hostile ones) and move through their spaces unimpeded. Whi… |
| mf_atlas | traits[1].actions[0].name | Jäger Dodge |
| mf_atlas | traits[1].actions[0].trigger | You take damage from a character larger than yourself |
| mf_atlas | traits[1].actions[0].detail | Gain resistance to that damage and move 3 spaces in any direction, ignoring engagement and reactions. |
| mf_atlas | traits[2].synergies[0].detail | 1/round, the Atlas can deal +1d6 bonus damage with a successful melee attack against a prone target. |
| mf_atlas | traits[3].synergies[0].detail | The Atlas takes +1 difficulty on Engineering checks and saves. |
| mf_atlas | core_system.description | The ATLAS extends microneedles into the musculature and ancillary nervous system of its pilot, melding flesh, machine, and the memory of all who wore it before. |
| mf_caliban | traits[0].synergies[0].detail | The Caliban counts as size 3 when inflicting knockback from any ranged or melee attack. |
| mf_caliban | traits[3].synergies[0].detail | The Caliban takes +1 Difficulty on all systems saves and checks |
| mf_caliban | core_system.description | The “Flayer” – officially the Heavy Howitzer-Shotgun 075 – is a compact, formalized version of the popular “Daisy Cutter” howitzer-shotgun used by Trunk Securit… |
| mf_kobold | traits[1].deployables[0].name | Slag Spray |
| mf_kobold | traits[1].deployables[0].detail | This semi-molten polymer grants hard cover. |
| mf_kobold | traits[2].synergies[0].detail | The Kobold takes +1 difficulty on Engineering checks and saves. |
| mf_kobold | core_system.description | Screeching and venting steam, the Kobold digs into the earth. Moments later, the very ground bends to the pilot’s will and the air shrieks with agony — the cry … |
| mf_lich | core_system.description | “Drink Deep, and Descend.” |
| mf_sunzi | traits[2].actions[0].name | Slip |
| mf_sunzi | traits[2].actions[0].detail | 1/round the Sunzi can teleport 2 spaces as a free action |
| mf_sunzi | core_system.description | (TT_CLEARANCE_01): JUST A HEADS UP, YOU’RE GOING TO READ SOME OBTUSE SHIT HERE. I’VE TRANSCRIBED ONLY THE USEFUL PARTS OF WHAT THE VOLS SAID. REFER TO THE VISUA… |
| mf_sunzi | core_system.counters[0].name | Art of War |
| mf_zheng | traits[0].deployables[0].name | Destructive Swing Cover |
| mf_zheng | traits[0].deployables[0].detail | This terrain grants hard cover |
| mf_zheng | traits[1].synergies[0].detail | The Zheng gets +1 Difficulty on all Systems saves and checks |
| mf_zheng | core_system.description | Surviving mostly on colonial rations and an increasingly radioactive air supply, Xiaoli scavenged materials from a dying ship to create modifications that gave … |
| mf_zheng | core_system.passive_actions[0].name | Xiaoli's Tenacity |
| mf_zheng | core_system.passive_actions[0].detail | 1/turn as a free action, you may move up to 3 spaces then deal 2 Kinetic to any adjacent character or 10 Kinetic AP to an object or piece of terrain. This movem… |
| mf_zheng | core_system.counters[0].name | Xiaoli Die |
| mw_tokugawa_alt_enkidu_integrated | description | These molten talons are long, whiplike plasma lashes that the Enkidu can extend or retract. They can only be used in the DANGER ZONE. |
| mw_integrated_shock_claws | profiles[0].name | Shock Claws |
| mw_integrated_shock_claws | profiles[0].effect | This weapon may only be used during the Go Loud core power. This weapon can't be used to attack in the same turn as another Heavy or Superheavy weapon. |
| mw_integrated_shock_claws | profiles[0].on_attack | You may deal 1d6 AP energy damage to a different character of your choice within Range 3 of the target. |
| mw_integrated_shock_claws | profiles[1].name | Damaged |
| mw_integrated_shock_claws | profiles[1].effect | This weapon may only be used during the Go Loud core power. The first time in a scene an allied Mech character within Sensors takes structure damage before Goin… |
| mw_integrated_shock_claws | profiles[1].on_attack | You may deal 1d6 AP energy damage to a different character of your choice within Range 3 of the target. |
| mw_integrated_shock_claws | profiles[2].name | Ruined |
| mw_integrated_shock_claws | profiles[2].effect | This weapon may only be used during the Go Loud core power. If you Go Loud after allied Mech characters within Sensors take structure damage twice or more durin… |
| mw_integrated_shock_claws | profiles[2].on_attack | You may deal 1d6 AP energy damage to a different character of your choice within Range 3 of the target. |
| mw_blackspot_targeting_laser | description | “Who tipped me the black spot the day we landed and began this dance?” – Treasure Island (1883) |
| mw_ferrofluid_lance | on_hit | 1/round, you may force a character hit by this weapon to make a Hull save. On a failure, both you and your target are Immobilized and cannot be moved in any way… |
| mw_ferrofluid_lance | actions[0].name | Ferrofluid Lance Fling |
| mw_ferrofluid_lance | actions[0].detail | End the immobilization effect of the Ferrofluid Lance on both you and your target to knock them back 4 spaces in any direction. |
| mw_retort_loop | profiles[0].name | 0 Charges |
| mw_retort_loop | profiles[0].on_attack | When fired, the weapon deals an additional 1d6 kinetic damage per charge, up to a maximum of 3 charges. Once fired, the charges deplete to 0, hit or miss. They … |
| mw_retort_loop | profiles[1].name | 1 Charge |
| mw_retort_loop | profiles[1].on_attack | When fired, the weapon deals an additional 1d6 kinetic damage per charge, up to a maximum of 3 charges. Once fired, the charges deplete to 0, hit or miss. They … |
| mw_retort_loop | profiles[2].name | 2 Charges |
| mw_retort_loop | profiles[2].on_attack | When fired, the weapon deals an additional 1d6 kinetic damage per charge, up to a maximum of 3 charges. Once fired, the charges deplete to 0, hit or miss. They … |
| mw_retort_loop | profiles[3].name | 3 Charges |
| mw_retort_loop | profiles[3].on_attack | When fired, the weapon deals an additional 1d6 kinetic damage per charge, up to a maximum of 3 charges. Once fired, the charges deplete to 0, hit or miss. They … |
| mw_retort_loop | counters[0].name | Retort Loop |
| mw_emperor_integrated | on_attack | Allied characters caught in the area are not attacked, but instead have any Overshield supercharged, increasing it by +4, but clearing all Overshield at the end… |
| mw_bolt_nexus | profiles[0].name | Default |
| mw_bolt_nexus | profiles[0].on_hit | Once this weapon hits a character, it gains the Target Acquired profile against that character only until you attack a new character with this weapon. |
| mw_bolt_nexus | profiles[1].name | Target Acquired |
| mw_terashima_blade | actions[0].name | Change Stance |
| mw_terashima_blade | actions[0].detail | Change this weapon's stance. |
| mw_terashima_blade | actions[1].name | Drop Stance |
| mw_terashima_blade | actions[1].detail | Drop this weapon's stance. |
| mw_terashima_blade | profiles[0].name | No Stance |
| mw_terashima_blade | profiles[1].name | Troll Stance |
| mw_terashima_blade | profiles[2].name | Storm Stance |
| mw_terashima_blade | profiles[2].effect | You gain the Storm Stance Reaction. |
| mw_terashima_blade | profiles[2].actions[0].name | Storm Stance Reaction |
| mw_terashima_blade | profiles[2].actions[0].trigger | After hitting with this weapon while in Storm Stance. |
| mw_terashima_blade | profiles[2].actions[0].detail | You may immediately deal 2 kinetic to all other characters adjacent to you and your target. |
| mw_terashima_blade | profiles[3].name | Lord's Stance |
| mw_terashima_blade | profiles[3].effect | You cannot make ranged or tech attacks, but any ranged attack against you that misses deflects off your sword, dealing 2 damage (same type as the attack) to a c… |
| mw_terashima_blade | profiles[4].name | Wind Stance |
| mw_terashima_blade | profiles[4].effect | After attacking with this weapon, hit or miss, you may move 2 spaces in any direction, ignoring engagement and reactions. |
| mw_caliban_integrated | profiles[0].on_attack | After any attack with this weapon, you may smack an adjacent character with the butt end, dealing 1 Kinetic Damage and knocking them back 1 space. |
| mw_caliban_integrated | profiles[1].on_attack | After any attack with this weapon, you may smack an adjacent character with the butt end, dealing 1 Kinetic Damage and knocking them back 1 space. |
| mw_hhs_155_cannibal | profiles[0].name | Single Barrel |
| mw_hhs_155_cannibal | profiles[1].name | Both Barrels |
| mw_hhs_155_cannibal | profiles[1].effect | Fire both barrels at once, causing the weapon to be fired with +1 Difficulty and requiring a reload as normal. |
| mw_slag_cannon | effect | If your target is on the ground or a flat surface, once this attack resolves place a SIZE 1 mound of slag in a free space adjacent to them. The mound is an obje… |
| mw_slag_cannon | deployables[0].name | Slag |
| mw_slag_cannon | deployables[0].detail | Created by the Slag Cannon |
| mw_d_d_288 | actions[0].name | Charge D/D 288 |
| mw_d_d_288 | actions[0].detail | Charge the D/D 288. At the start of any of your turns while the D/D 288 is Charged, it uses the "Charged" profile. You become SLOWED, and benefit from soft cove… |
| mw_d_d_288 | profiles[1].on_hit | While charged, this weapon deals 30 AP Kinetic Damage when it hits objects or pieces of terrain. If this destroys objects and pieces of terrain, they explode, d… |
| mw_pl_modular_rifle | profiles[1].name | DMR |
| ms_spear_charges | actions[0].name | Anti-Armor Rocket |
| ms_spear_charges | actions[0].detail | You fire a rocket, targeting a single character within range 10. Your target must pass an Agility save or take 6 AP explosive damage. On a success, they take ha… |
| ms_spear_charges | deployables[0].name | Loitering Payload |
| ms_spear_charges | deployables[0].detail | Deploy a loitering payload to a free space within range 3, where it establishes a Burst 2 area. When deployed, this mine's area cannot overlap any hostile chara… |
| ms_pebcac | actions[0].detail | : An allied mech character within line of sight and SENSORS quickly flash reboots at the system level. This ends all effects caused by tech actions, stops NHP c… |
| ms_field_approved_brass_ignorant_modifications | actions[0].detail | Choose an allied mech character within line of sight and SENSORS. You power up their weapons. When they make a ranged or melee attack roll:  the attack&rsquo;s … |
| ms_forge_2_subaltern_squad | deployables[0].name | Emplacement |
| ms_forge_2_subaltern_squad | deployables[0].detail | When finished, this elevated emplacement is SIZE 1 and 3 spaces high. The top third is a is a shielded platform that can fit characters up to a combined SIZE 1 … |
| ms_forge_2_subaltern_squad | deployables[1].name | Snare Foam |
| ms_forge_2_subaltern_squad | deployables[1].detail | When finished, this project continually sprays foam around it, creating a Burst 2 area of difficult terrain. Destroying it removes the effect. |
| ms_forge_2_subaltern_squad | deployables[2].name | Damping Station |
| ms_forge_2_subaltern_squad | deployables[2].detail | When finished, this repair station generates a Burst 1 field within which allied characters gain IMMUNITY to burn and clear any burn currently affecting them. |
| ms_forge_2_subaltern_squad | deployables[3].name | Armor Pack |
| ms_forge_2_subaltern_squad | deployables[3].detail | When finished, this pack latches onto the next allied character that moves adjacent to it and fuses onto them. The project is destroyed, but they gain +1 ARMOR … |
| ms_smokestack_heatsink | description | The IPS-N Kidd’s SMOKESTACK Heat Sink represents the latest in IPS-N’s heat dispersion systems for chassis and other CORE-powered vehicles and vessels. Utilizin… |
| ms_pinning_spire | actions[0].detail | You and one character within Range 3 and line of sight become Immobilized and cannot be moved in any way. For the duration, the target always considers you with… |
| ms_sympathetic_shield | actions[0].detail | You project a shield of resonant ferrofluid over an allied character within Range 5. They gain Overshield equal to 4 + GRIT, but any damage dealt to this Oversh… |
| ms_camuss_razor | actions[0].name | Prime Camus's Razor |
| ms_camuss_razor | actions[0].detail | Your mech is capable of projecting a spot-magnetic force of incredible power. You can prime this system as a quick action. Once primed, you gain one use of the … |
| ms_camuss_razor | actions[1].name | Intervention |
| ms_camuss_razor | actions[1].trigger | An allied character within Range 5 and line of sight is targeted by an action that deals kinetic or explosive damage. |
| ms_camuss_razor | actions[1].detail | You become the target of the action instead. If the action was an area of effect, such as a line, cone, blast, etc, the attacker must now position it so it targ… |
| ms_dominions_breadth | actions[0].detail | A mech character within Sensors and line of sight gains Overshield 1. When this Overshield is lost for any reason, that character releases a Burst 2 electric pu… |
| ms_the_imperial_eye | actions[0].detail | An allied mech character within Sensors gains a Disruptive Charge until the start of your next turn. When a hostile character enters a space within Range 3 of t… |
| ms_shahnameh | actions[0].detail | An allied mech character within Sensors and line of sight gains Overshield equal to 4 + GRIT. While they have this Overshield, they have Resistance to heat infl… |
| ms_ayah_of_the_syzygy | actions[0].detail | You create a Blast 2 energy field in a space within Sensors and line of sight. The first time each turn any hostile character in this area is hit by a ranged or… |
| ms_the_walk_of_kings | actions[0].detail | An allied character within Sensors and line of sight gains Overshield equal to 4 + GRIT. While they have this Overshield, all their melee attacks gain AP, and t… |
| ms_multi_gear_maneuver_system | actions[0].name | Fire Zip Line |
| ms_multi_gear_maneuver_system | actions[0].detail | You fire a zip line 8 spaces long that connects 2 free spaces in line of sight, one of which must be adjacent to you. Both ends must be attached to a surface, s… |
| ms_jäger_kunst_i | actions[0].name | Jäger Kunst I |
| ms_jäger_kunst_i | actions[0].detail | For the rest of the turn, any time you move adjacent to an object or free-standing piece of terrain larger than you, you move 2 spaces in any direction as a fre… |
| ms_ricochet_blades | actions[0].name | Throw Ricochet Blade |
| ms_ricochet_blades | actions[0].detail | As a quick action, you throw a ricochet blade along a line 3 path, dealing 2 Kinetic Damage to all characters within the affected area. If the initial line reac… |
| ms_spike_charges | actions[0].name | Spike Grenade |
| ms_spike_charges | actions[0].detail | Throw a Spike Grenade at a target within Range 5. Your target must pass an Agility save or the grenade attaches to them and arms itself. It automatically attach… |
| ms_spike_charges | deployables[0].name | Spike Mine |
| ms_spike_charges | deployables[0].detail | Once activated, characters within a Burst 2 must pass an Agility save or a spike grenade attaches itself to them as described above. |
| ms_rapid_maneuver_jets | synergies[0].detail | 1/round, when you Boost, you fly, gain Overshield 3, and ignore engagement from and may freely pass through spaces occupied by larger characters (but not end yo… |
| ms_forge_clamps | actions[0].detail | You sink the jaws of your clamp into an adjacent object or piece of terrain of Size 1 or larger. You become Immobilized but gain Immunity to Knockback and Prone… |
| ms_seismic_pulse | actions[0].detail | You unleash a seismic pulse in a line 10 path: characters in the affected area must pass a Hull save or be knocked Prone and all objects and pieces of terrain a… |
| ms_immolate | actions[0].name | Eject Slag |
| ms_immolate | actions[0].detail | You force the target’s reactor to eject burning liquid in a Burst 2 area around them, not affecting the space they occupy. The affected area becomes difficult t… |
| ms_immolate | actions[1].name | Molten Puncture |
| ms_immolate | actions[1].detail | Until the end of the target’s next turn, their reactor shielding is temporarily cracked. They take 2 Burn for each space they voluntarily move (to a maximum of … |
| ms_purifying_code | actions[0].name | FLAW_plus |
| ms_purifying_code | actions[0].detail | You inject a memetic, proximity based virus into the target’s reactor. At the end of their next turn, if they are not adjacent to another character or piece of … |
| ms_purifying_code | actions[1].name | FLAW_minus |
| ms_purifying_code | actions[1].detail | You inject a memetic, proximity based virus into the target’s reactor. At the end of their next turn, if they are adjacent to another character or piece of terr… |
| ms_tear_firmament | actions[0].name | Wandering Nightmare |
| ms_tear_firmament | actions[0].detail | You generate a Blast 2 zone of distorted timeflow within SENSORS and line of sight that affects all characters other than you. Characters within the affected ar… |
| ms_rewrite | actions[0].detail | Choose a character in Sensors and line of sight. They clear all conditions other than Stunned that weren’t self-inflicted, and you immediately receive all condi… |
| ms_unhinge_chronoflow | actions[0].name | Haste |
| ms_unhinge_chronoflow | actions[0].detail | Choose a character within Sensors and line of sight. For the rest of this scene, or until they take damage, they may Boost 1/round as a free action during their… |
| ms_unhinge_chronoflow | actions[1].name | Slow |
| ms_unhinge_chronoflow | actions[1].detail | Choose a character within Sensors and line of sight. They must pass a Systems save or take 2 Heat, become Slowed, and become unable to take reactions. This effe… |
| ms_didymos_class_nhp | actions[0].name | Time Split |
| ms_didymos_class_nhp | actions[0].detail | Choose yourself or another character within Sensors and line of sight. Your target disappears and you create a chronological split in their timeline, replacing … |
| ms_stay_of_execution | actions[0].detail | Choose yourself or another character within Sensors and line of sight. Your target gains Immunity to all damage and effects from external sources until the end … |
| ms_accelerate | actions[0].detail | Choose and mark two free spaces within your line of sight that share a surface and are within Range 5 of each other. Characters that start their turn in one of … |
| ms_blink_charges | deployables[0].name | Blink Mine |
| ms_blink_charges | deployables[0].detail | Once detonated, the character that triggered it must pass an Engineering save or be teleported to a free, valid space of your choice within Range 5 of the mine … |
| ms_blink_charges | actions[0].name | Warp Grenade |
| ms_blink_charges | actions[0].detail | Throw a grenade with Range 5 and Blast 3. On impact, choose any character within the affected area and teleport them to any free, valid space within the same ar… |
| ms_blinkspace_tunneler | actions[0].detail | You open a blink tear in a free, adjacent space. It lasts until the end of your next turn. As part of any movement, characters other than you (hostile or allied… |
| ms_unravel | actions[0].detail | Choose yourself or another character within Sensors and line of sight. Your target is charged with unstable energy until the start of your next turn. Unwilling … |
| ms_distort | actions[0].detail | You tear a hole in space, creating a Blast 1 area in a free space within Sensors and line of sight. Weapons with the Blast, Line, Burst, or Cone properties do n… |
| ms_total_strength_suite_i | actions[0].detail | You rip up a piece of the environment and hurl it at a character within Range 5 and line of sight. Your target must pass an Agility save or take 1d6 kinetic dam… |
| ms_total_strength_suite_ii | actions[0].detail | Deal 1d6 kinetic damage to a character you are grappling. |
| ms_total_strength_suite_iii | actions[0].detail | You end a Grapple, pushing the other character 5 spaces in any direction and knocking them Prone. This movement may pass through spaces occupied by other charac… |
| cb_superheavy_mounting | description | You’d be surprised how large a gun you could fit on a chassis if you ripped out peripheral systems and failsafe redundancies. |
| t_prospector | ranks[0].actions[0].name | Create Entrance |
| t_prospector | ranks[0].actions[0].detail | 1/Scene While standing on solid ground you may create a Burst 1 Entrance around yourself as a Quick Action. You may then Tunnel to anywhere up to 5 spaces away … |
| t_prospector | ranks[0].actions[1].name | Subterranean Reposition |
| t_prospector | ranks[0].actions[1].trigger | During your turn, you are completely within an Entrance. |
| t_prospector | ranks[0].actions[1].detail | You immediately Tunnel, ending the movement completely within a different Entrance created by the same character as the first. |
| t_iconoclast | ranks[1].actions[0].name | Transmuting Spark |
| t_empath | description | Your time on Hercynia has always been marked by a kind of … searching. A connection to the planet, to something alive there. You can perceive it best at night, … |
| t_sysop | ranks[0].synergies[0].detail | When you Bolster an allied character, the additional Accuracy they gain lasts until their next skill check or save. |
| t_sysop | ranks[1].synergies[0].detail | When you Bolster an allied character, tech attacks against them receive +1 Difficulty until the end of their next turn. |
| t_sysop | ranks[2].synergies[0].detail | 1/round, when you Bolster an allied character, you induce a special cycle in their reactor. They reduce the next amount of heat they would take from a hostile c… |
| mf_orator | ranks[1].counters[0].name | Orator Die |
| t_pankrati | ranks[0].synergies[0].detail | Your melee attacks against Immobilized or Slowed characters gain +1 Accuracy. |
| t_pankrati | ranks[1].actions[0].name | Valiant Charge |
| t_black_thumb | ranks[0].actions[0].name | Black Thumb Dismount |
| t_black_thumb | ranks[1].actions[0].name | Black Thumb Rodeo |
| t_black_thumb | ranks[1].actions[0].detail | Gain a personal shield (as from Flesh to Metal). While in rodeo, your pilot is immune to involuntary movement, occupies your mech’s space and moves when it move… |
| t_black_thumb | ranks[1].actions[1].name | End Black Thumb Rodeo |
| t_black_thumb | ranks[1].actions[1].detail | End your current Black Thumb Rodeo. |
| t_black_thumb | ranks[1].actions[2].name | BT: Extinguish |
| t_black_thumb | ranks[1].actions[2].detail | You immediately clear all Burn affecting your mech, and it gains Resistance to Burn until the start of your next turn. Conditions that were self inflicted canno… |
| t_black_thumb | ranks[1].actions[3].name | BT: Field Repair |
| t_black_thumb | ranks[1].actions[3].detail | Your mech gains Overshield 2 and clears either Slowed or Immobilized. Conditions that were self inflicted cannot be cleared with this action. |
| t_black_thumb | ranks[1].actions[4].name | BT: Rig Vents |
| t_black_thumb | ranks[1].actions[4].detail | Your mech clears 2 Heat and clears either Impaired or Jammed. Conditions that were self inflicted cannot be cleared with this action. |
| t_spaceborn | ranks[2].synergies[0].detail | 1/round, when your mech hits a character with a melee attack, it can immediately give that character +1 Difficulty on all checks or saves to avoid Knockback, Pr… |

## 自动修正

- mw_legionnaire_battle_rifle 官方数据缺少 license_id，按牌照「Gilgamesh」补为 mf_gilgamesh
- mw_superthermal_blade 官方数据缺少 license_id，按牌照「Gilgamesh」补为 mf_gilgamesh
- mw_legion_nexus 官方数据缺少 license_id，按牌照「Gilgamesh」补为 mf_gilgamesh
- mw_warp_rifle 官方数据缺少 license_id，按牌照「Sunzi」补为 mf_sunzi
- mw_ext_crew_sword 挂载 Drone → Main
- mw_ext_crew_rifle 挂载 Drone → Main
- mw_ext_crew_cannon 挂载 Drone → Main
- ms_emergency_repair_module 官方数据缺少 license_id，按牌照「Gilgamesh」补为 mf_gilgamesh
- ms_utility_drone 官方数据缺少 license_id，按牌照「Gilgamesh」补为 mf_gilgamesh
- ms_spear_charges 官方数据缺少 license_id，按牌照「Gilgamesh」补为 mf_gilgamesh
- ms_jäger_kunst_i 官方数据缺少 license_id，按牌照「Atlas」补为 mf_atlas
- ms_piof_smoke_generator「误导」频率「X/轮」Foundry 无法解析，改写进说明

## 覆盖的官方条目

| 类别 | 车卡器 id | 官方 id | 补充书 | 中文名 | 官方名 |
|---|---|---|---|---|---|
| frames | mf_ext_chomolungma | mf_chomolungma | osr | 珠穆朗玛 | Chomolungma |
| frames | mf_ext_sagarmatha | mf_sagarmatha | wallflower | 萨加玛塔 | Sagarmatha |
| frames | mf_ext_empakaai | mf_Empakaai_alt_blackbeard | ssmr | 因帕卡伊 | Empakaai |
| frames | mf_ext_taraxacum | mf_lancaster_alt_taraxacum | sotw | 蒲公英 | Taraxacum |
| frames | mf_ext_stortebeker | mf_störtebeker | dustgrave | 施托特贝克 | Störtebeker |
| frames | mf_ext_orchis | mf_black_witch_alt_orchidea | ktb | 红门兰 | Orchis |
| frames | mf_ext_amber_phantom | mf_amber_phantom | ows | 晶眼蝶 | Amber Phantom |
| frames | mf_ext_viceroy | mf_micro_monarch | dustgrave | 总督蝶 | Viceroy |
| frames | mf_ext_swallowtail_ranger | mf_swallowtail_alt_swallowtail_ranger_variant | wallflower | 游骑兵 | Swallowtail (Ranger Variant) |
| frames | mf_ext_hecatoncheires | mf_balor_alt_hecatoncheires | sotw | 百臂巨人 | Hecatoncheires |
| frames | mf_ext_lycan | mf_lycan | ows | 狼人 | Lycan |
| frames | mf_ext_calendula | mf_minotaur_alt_wraith | ktb | 金盏花 | Calendula |
| frames | mf_ext_worldkiller | mf_genghis_alt_worldkiller_genghis_mk_i | wallflower | 成吉思 MK1「行星杀手」 | “Worldkiller” Genghis Mk I |
| frames | mf_ext_kutuzov | mf_kutuzov | ows | 库图佐夫 | Kutuzov |
| frames | mf_ext_tagetes | mf_sherman_alt_tagetes | sotw | 万寿菊 | Tagetes |
| frames | mf_ext_enkidu | mf_tokugawa_alt_enkidu | wallflower | 恩奇都 | Enkidu |
| frames | mf_ext_gilgamesh | mf_gilgamesh | ows | 吉尔伽美什 | Gilgamesh |
| frames | mf_ext_kidd | mf_kidd | wallflower | 基德 | Kidd |
| frames | mf_ext_white_witch | mf_white_witch | ktb | 白巫蛾 | White Witch |
| frames | mf_ext_emperor | mf_emperor | ktb | 帝王蝶 | Emperor |
| frames | mf_ext_atlas | mf_atlas | long-rim | 阿特拉斯蛾 | Atlas |
| frames | mf_ext_caliban | mf_caliban | long-rim | 卡利班 | Caliban |
| frames | mf_ext_kobold | mf_kobold | long-rim | 狗头人 | Kobold |
| frames | mf_ext_lich | mf_lich | long-rim | 巫妖 | Lich |
| frames | mf_ext_sunzi | mf_sunzi | long-rim | 孙子 | Sunzi |
| frames | mf_ext_zheng | mf_zheng | long-rim | 郑 | Zheng |
| weapons | mw_ext_colossus_pyroclaw | mw_empakaai_alt_blackbeard_integrated | ssmr | “巨像”超温爪 | Colossus Termo-Unguis |
| weapons | mw_ext_plasma_talons | mw_tokugawa_alt_enkidu_integrated | wallflower | 等离子爪 | Plasma Talons |
| weapons | mw_ext_shock_claws | mw_integrated_shock_claws | ows | 电震利爪 | Shock Claws |
| weapons | mw_ext_legionnaire_rifle | mw_legionnaire_battle_rifle | ows | “军团战士”战斗步枪 | Legionnaire Battle Rifle |
| weapons | mw_ext_superheated_blade | mw_superthermal_blade | ows | 超热能剑 | Superthermal Blade |
| weapons | mw_ext_legion_hive | mw_legion_nexus | ows | 军团巢房 | Legion Nexus |
| weapons | mw_ext_black_spot | mw_blackspot_targeting_laser | wallflower | “黑券”目标性辐射枪 | Blackspot Targeting Laser |
| weapons | mw_ext_tempest_charged_blade | mw_tempest_charged_blade | dustgrave | “暴风”充能刃 | Tempest Charged Blade |
| weapons | mw_ext_hurricane_cluster_projector | mw_hurricane_cluster_projector | dustgrave | “飓风”集群投射器 | Hurricane Cluster Projector |
| weapons | mw_ext_ferrofluid_lance | mw_ferrofluid_lance | ktb | 铁磁流长枪 | Ferrofluid Lance |
| weapons | mw_ext_reversal_loop | mw_retort_loop | ktb | 骏逆回环 | Retort Loop |
| weapons | mw_ext_marathon_arc_bow | mw_emperor_integrated | ktb | 马拉松弧弓 | Marathon Arc Bow |
| weapons | mw_ext_arrow_nexus | mw_bolt_nexus | ktb | 电箭巢房 | Bolt Nexus |
| weapons | mw_ext_kral_rifle | mw_kraul_rifle | long-rim | 克拉尔步枪 | Kraul Rifle |
| weapons | mw_ext_terashima_blade | mw_terashima_blade | long-rim | 寺岛之刃 | Terashima Blade |
| weapons | mw_ext_hhs075_flayer | mw_caliban_integrated | long-rim | HHS-075「剥皮者」霰弹枪 | HHS-075 “Flayer” Shotgun |
| weapons | mw_ext_hammer_urpl | mw_hammer_u_rpl | long-rim | 锤式 U-RPL | Hammer U-RPL |
| weapons | mw_ext_hhs155_cannibal | mw_hhs_155_cannibal | long-rim | HHS-155「食人族」 | HHS-155 CANNIBAL |
| weapons | mw_ext_fusion_rifle | mw_fusion_rifle | long-rim | 融核步枪 | Fusion Rifle |
| weapons | mw_ext_slag_cannon | mw_slag_cannon | long-rim | 熔渣炮 | Slag Cannon |
| weapons | mw_ext_liberator | mw_unraveler | long-rim | 解脱者 | Unraveler |
| weapons | mw_ext_warp_rifle | mw_warp_rifle | long-rim | 扭曲步枪 | Warp Rifle |
| weapons | mw_ext_tiger_hunter_gauntlets | mw_xiaoli_combat_sheathe | long-rim | “猎虎”格斗臂套 | Tiger-Hunter Combat Sheathe |
| weapons | mw_ext_dd288 | mw_d_d_288 | long-rim | D/D288 | D/D 288 |
| systems | ms_ext_unstable_nhp | ms_iconoclast | dustgrave | 不稳定 NHP | Unstable NHP |
| systems | ms_ext_emergency_repair_module | ms_emergency_repair_module | ows | 紧急维修模块 | Emergency Repair Module |
| systems | ms_ext_multirole_drone | ms_utility_drone | ows | 多功能无人机 | Utility Drone |
| systems | ms_ext_spear_charges | ms_spear_charges | ows | 矛式炸药 | SPEAR Charges |
| systems | ms_ext_human_error | ms_pebcac | wallflower | 人因故障 | PEBCAC |
| systems | ms_ext_fabi | ms_field_approved_brass_ignorant_modifications | wallflower | 临场全武适配傻瓜式改造（FABI） | Field-Approved, Brass Ignorant Modifications |
| systems | ms_ext_universal_plate | ms_omnibus_plate | wallflower | 万用基板 | Omnibus Plate |
| systems | ms_ext_forge_ii | ms_forge_2_subaltern_squad | wallflower | “锻炉二型”副官班组 | FORGE-2 Subaltern Squad |
| systems | ms_ext_chimney_cold_source | ms_smokestack_heatsink | wallflower | “烟窗”冷源 | SMOKESTACK Heat Sink |
| systems | ms_ext_redundant_armament | ms_armament_redundancy | dustgrave | 武备冗余 | Armament Redundancy |
| systems | ms_ext_spike_spiral | ms_pinning_spire | ktb | 钉刺螺旋 | Pinning Spire |
| systems | ms_ext_empathic_shield | ms_sympathetic_shield | ktb | 共感护盾 | Sympathetic Shield |
| systems | ms_ext_camus_edge | ms_camuss_razor | ktb | 加缪之锋 | Camus’s Razor |
| systems | ms_ext_ferro_spike_wall | ms_ferrospike_barrier | ktb | 铁磁钉壁 | Ferrospike Barrier |
| systems | ms_ext_wide_dominion | ms_dominions_breadth | ktb | 广域支配 | Dominion's Breadth |
| systems | ms_ext_emperors_eye | ms_the_imperial_eye | ktb | 帝王之眼 | The Imperial Eye |
| systems | ms_ext_book_of_kings | ms_shahnameh | ktb | 列王记 | Shahnameh |
| systems | ms_ext_proof_of_syzygy | ms_ayah_of_the_syzygy | ktb | 朔望之证 | Āyah of the Syzygy |
| systems | ms_ext_sovereign_gait | ms_the_walk_of_kings | ktb | 君王步态 | The Walk of Kings |
| systems | ms_ext_multistage_mobility | ms_multi_gear_maneuver_system | long-rim | 多档机动系统 | Multi-Gear Maneuver System |
| systems | ms_ext_jager_kunst_1 | ms_jäger_kunst_i | long-rim | 猎人之艺，一式 | Jäger Kunst I |
| systems | ms_ext_ricochet_blade | ms_ricochet_blades | long-rim | 弹跳利刃 | Ricochet Blades |
| systems | ms_ext_jager_kunst_2 | ms_jäger_kunst_ii | long-rim | 猎人之艺，二式 | Jäger Kunst II |
| systems | ms_ext_hardpoint_reinforcement | ms_hardpoint_reinforcement | long-rim | 硬点加固 | Hardpoint Reinforcement |
| systems | ms_ext_spike_charges | ms_spike_charges | long-rim | 钉刺充能 | Spike Charges |
| systems | ms_ext_rmj_nozzles | ms_rapid_maneuver_jets | long-rim | 高速机动喷口 | Rapid Maneuver Jets |
| systems | ms_ext_furnace_clamp | ms_forge_clamps | long-rim | 熔炉钳夹 | Forge Clamps |
| systems | ms_ext_seismic_ripper | ms_seismic_pulse | long-rim | 震荡开膛手 | Seismic Ripper |
| systems | ms_ext_immolate | ms_immolate | long-rim | 献祭 | IMMOLATE |
| systems | ms_ext_purge_code | ms_purifying_code | long-rim | 净化代码 | Purifying Code |
| systems | ms_ext_wandering_nightmare | ms_tear_firmament | long-rim | 彷徨梦魇 | Wandering Nightmare |
| systems | ms_ext_antilinear_time | ms_rewrite | long-rim | 反线性时间 | Antilinear Time |
| systems | ms_ext_anachronism | ms_unhinge_chronoflow | long-rim | 错乱年代表 | Unhinge Chronology |
| systems | ms_ext_dilemmas_nhp | ms_didymos_class_nhp | long-rim | 狄律摩斯级 NHP | DIDYMOS-Class NHP |
| systems | ms_ext_reprieve | ms_stay_of_execution | long-rim | 死缓 | Stay of Execution |
| systems | ms_ext_accelerate | ms_accelerate | long-rim | 加速 | Accelerate |
| systems | ms_ext_blink_charges | ms_blink_charges | long-rim | 霎间炸药 | Blink Charges |
| systems | ms_ext_blink_tunneler | ms_blinkspace_tunneler | long-rim | 霎间隧道器 | Blinkspace Tunneler |
| systems | ms_ext_final_secret | ms_unravel | long-rim | 终决机密 | Final Secret |
| systems | ms_ext_reality_breach | ms_distort | long-rim | 现世缺口 | Realspace Breach |
| systems | ms_ext_power_assembly_1 | ms_total_strength_suite_i | long-rim | 力量总成套组 I | Total Strength Suite I |
| systems | ms_ext_power_assembly_2 | ms_total_strength_suite_ii | long-rim | 力量总成套组 II | Total Strength Suite II |
| systems | ms_ext_power_assembly_3 | ms_total_strength_suite_iii | long-rim | 力量总成套组 III | Total Strength Suite III |
| mods | wm_ext_hypermass_mod | wm_supermassive_mod | long-rim | 超巨质量模组 | Supermassive Mod |
| mods | wm_ext_thermal_shroud | wm_molten_wreathe | long-rim | 热熔缭绕 | Molten Wreathe |
| core_bonuses | cb_ext_superheavy_mounting | cb_superheavy_mounting | dustgrave | 超重挂载 | Superheavy Mounting |
| talents | t_ext_field_analyst | t_field_analyst | dustgrave | 战场分析师 | Field Analyst |
| talents | t_ext_prospector | t_prospector | dustgrave | 探勘者 | Prospector |
| talents | t_ext_iconoclast | t_iconoclast | dustgrave | 偶像破坏者 | Iconoclast |
| talents | t_ext_mind_reader | t_empath | wallflower | 读心者 | Empath |
| talents | t_ext_demolitionist | t_demolitionist | osr | 爆破专家 | Demolitionist |
| talents | t_ext_sysop | t_sysop | osr | 系统管理员 | Sysop |
| talents | t_ext_orator | mf_orator | ssmr | 演说家 | Orator |
| talents | t_ext_household_guard | t_house_guard | ktb | 家族禁卫 | House Guard |
| talents | t_ext_pankrati | t_pankrati | ktb | 潘克拉蒂 | Pankrati |
| talents | t_ext_blackthumb | t_black_thumb | long-rim | 黑拇指 | Black Thumb |
| talents | t_ext_void_native | t_spaceborn | long-rim | 太空民 | Spaceborn |
| pilot_gear | pg_ext_personal_kinetic_barrier | pg_personal_shielding | sotw | 个人动能屏障 | Personal Kinetic Shielding |

## 官方补充书中未覆盖的条目（导入后仍为英文）

| 类别 | 官方 id | 名称 | 来源 |
|---|---|---|---|
| weapons | mw_brutus_wrecker | Brutus’s Wrecker | dustgrave |
| weapons | mw_brutus_shield | Brutus’s Shield | dustgrave |
| weapons | mw_blast_pick | Blast Pick | dustgrave |
| weapons | mw_shock_baton | Shock Baton | dustgrave |
| weapons | mw_reaper_assault_cannon | Reaper Assault Cannon | dustgrave |
| weapons | mw_xc_br_battle_rifle | XC-BR Battle Rifle | osr |
| weapons | mw_xc_dpm_predator_nexus | XC-DPM Predator Nexus | osr |
| weapons | mw_shrapnel_cannon | Shrapnel Cannon | ows |
| weapons | mw_electrohydraulic_claw | Electrohydraulic Claw | ows |
| weapons | mw_fusion_torch | Fusion Torch | ows |
| weapons | mw_exo_plasma_maul | Plasma Maul | wallflower |
| weapons | mw_exo_sting_heavy_anti_armor_rifle | “Sting” Heavy Anti-Armor Rifle | wallflower |
| weapons | mw_exo_steelpunch_heavy_needlebeam | “Steelpunch” Heavy Needlebeam | wallflower |
| weapons | mw_exo_brood_siblings_molt | Brood-Sibling’s Molt | wallflower |
| systems | ms_cockpit_integrated_stim_pump | Cockpit-Integrated Stim Pump | dustgrave |
| systems | ms_mesmertrance_dampener | MesmerTrance Dampener | dustgrave |
| systems | ms_spaceborn_1 | Spaceborn EVA | long-rim |
| systems | ms_adjutant_class_compcon | ADJUTANT-Class Comp/Con | osr |
| systems | ms_pattern_c_advanced_charges | Pattern-C Advanced Charges | osr |
| systems | ms_miniaturized_linac_coherent_beam_cannon | Miniaturized LinAc Coherent Beam Cannon | osr |
| systems | ms_quickfoam_charges | Quickfoam Charges | ows |
| systems | ms_champions_favor | Champion's Favor | sotw |
| systems | ms_entangled_co-consciousness_rig | Entangled Co-Consciousness Rig | sotw |
| systems | ms_exo_kinesthetic_suit_upgrade | Kinesthetic Suit Upgrade | ssmr |
| systems | ms_exo_emi_theater | Emi Theater | ssmr |
| systems | ms_exo_upgraded_network_array | Upgraded Network Array | ssmr |
| systems | ms_exo_mist_feathers | Mist Feathers | ssmr |
| systems | ms_exo_snapdragon_launcher | Snapdragon Anti-Chassis Guided Missile Launcher | wallflower |
| systems | ms_exo_cynosure | Cynosure | wallflower |
| systems | ms_exo_opportunity | Opportunity | wallflower |
| systems | ms_exo_markeys_fusebox | Markey’s Fusebox | wallflower |
| systems | ms_exo_carapace_cladding | Carapace Cladding | wallflower |
| systems | ms_exo_fragment_beggar_one | Fragment of Beggar One | wallflower |
| mods | mw_bounder_class_comp_con | BOUNDER-Class Comp/Con | ows |
| core_bonuses | cb_order_of_leander | Order of Leander | ows |
| pilot_gear | ms_madrigal_precision_rifle | Madrigal Precision Rifle | dustgrave |
| pilot_gear | ms_madrigal_shoulder_launcher | Madrigal Shoulder Launcher | dustgrave |
| pilot_gear | ms_madrigal_boarding_shotgun | Madrigal Boarding Shotgun | dustgrave |
| pilot_gear | ms_madrigal_power_crusher | Madrigal Power Crusher | dustgrave |
| pilot_gear | ms_madrigal_railgun | Madrigal Railgun | dustgrave |
| pilot_gear | ms_madrigal_disruptor_grenades | Madrigal Disruptor Grenade | dustgrave |
| pilot_gear | ms_madrigal_jump_system | Madrigal Jump System | dustgrave |
| pilot_gear | ms_madrigal_thermal_visor | Madrigal Thermal Visor | dustgrave |
| pilot_gear | ms_madrigal_active_camo | Madrigal Active Camo | dustgrave |
| pilot_gear | ms_madrigal_personal_shield | Madrigal Personal Shield | dustgrave |
| pilot_gear | ms_madrigal_shock_field | Madrigal Shock Field | dustgrave |
| pilot_gear | ms_madrigal_boarding_carapace_armor | Madrigal Boarding Carapace | dustgrave |
| pilot_gear | pg_monofilament_rapier | Monofilament Rapier | sotw |
| pilot_gear | pg_hardlight_knives | The Wolf's Blades | sotw |
| pilot_gear | pg_blue_blood | The Blue Blood of Pangloss | sotw |
| pilot_gear | pg_Psionic_Piston | Psionic Piston | ssmr |
| pilot_gear | ms_exo_anti_armor_signature_weapon | Anti-Armor Signature Weapon | wallflower |
| pilot_gear | ms_exo_bahadurs_reserve | Bahadur's Reserve | wallflower |
| pilot_gear | ms_exo_hercynian_rations | Hercynian Rations | wallflower |
| pilot_gear | ms_exo_locus | Locus | wallflower |
| pilot_gear | ms_exo_light_carapace_armor | Light Carapace Hardsuit | wallflower |
| pilot_gear | ms_exo_assault_carapace_armor | Assault Carapace Hardsuit | wallflower |
| pilot_gear | ms_exo_heavy_carapace_armor | Heavy Carapace Hardsuit | wallflower |

## 新增条目

| 类别 | id | 名称 |
|---|---|---|
| frames | mf_ext_nemo | 内莫 |
| frames | mf_ext_nelson_wing | 纳尔逊飞翼型 |
| frames | mf_ext_oleander | 夹竹桃蛾 |
| frames | mf_ext_night_cutter | 切夜蛾 |
| frames | mf_ext_jouken | 柔剑 |
| frames | mf_ext_banshee_vine | 树绳妖 |
| frames | mf_ext_chimera | 奇美拉 |
| frames | mf_ext_habsburg | 哈布斯堡 |
| frames | mf_ext_saladin_dread | 萨拉丁“恐惧刽子手” |
| frames | mf_ext_grant | 格兰特 |
| frames | mf_ext_bligh | 布莱 |
| frames | mf_ext_red_admiral | 赤蛱蝶 |
| frames | mf_ext_ornithoptera | 鸟翼蝶 |
| frames | mf_ext_salamander | 火蜥蜴 |
| frames | mf_ext_mitchell | 米切尔 |
| frames | mf_ext_stetchkin | 史泰钦 |
| frames | mf_ext_spectre | 幽灵 |
| frames | mf_ext_hubble | 哈勃 |
| frames | mf_ext_pharos | 法罗斯 |
| frames | mf_ext_sicklewing | 镰翅蛾 |
| frames | mf_ext_feathered_serpent | 羽蛇 |
| frames | mf_ext_tametomo | 为朝 |
| frames | mf_ext_wodeng | 沃登 |
| frames | mf_ext_comet_moth | 彗尾蛾 |
| frames | mf_ext_ifrit | 伊芙利特 |
| frames | mf_ext_agrippa | 阿格里帕 |
| frames | mf_kkca_emerald_scimitar | 祖母绿弯刀 |
| frames | mf_kkca_wondrous_sword | 妙源剑 |
| frames | mf_kkca_tizona | 提泽纳剑 |
| frames | mf_kkca_rending_sword | 斩裂剑 |
| frames | mf_piof_basil | 罗勒 |
| frames | mf_piof_coriander | 香菜 |
| frames | mf_piof_fennel | 茴香 |
| frames | mf_piof_lemongrass | 香茅 |
| frames | mf_piof_pepper | 胡椒 |
| frames | mf_piof_rosemary | 迷迭香 |
| frames | mf_piof_mint | 薄荷 |
| frames | mf_piof_star_anise | 八角 |
| frames | mf_ch_charioteer | 战车御手 |
| frames | mf_ch_callista | 卡莉丝塔 |
| frames | mf_ch_gajeshura | 加杰修罗 |
| frames | mf_ch_kalalani | 卡拉拉尼 |
| frames | mf_ch_matador | 斗牛士 |
| frames | mf_ch_pesilat | 佩西拉特 |
| frames | mf_ch_retiarius | 网斗士 |
| frames | mf_ch_pemada | 佩马刀者 |
| frames | mf_ch_sagittarius | 射手座 |
| frames | mf_ext_kanggeduo | 康格多 |
| weapons | mw_ext_crew_sword | 船工之剑 |
| weapons | mw_ext_crew_rifle | 船工步枪 |
| weapons | mw_ext_crew_cannon | 船工加农炮 |
| weapons | mw_ext_incendiary_grenade_launcher | 燃烧榴弹发射器 |
| weapons | mw_ext_cluster_bomb_dispenser | 集束炸弹分撒器 |
| weapons | mw_ext_fast_cycle_missile_rack | 快循环导弹支架 |
| weapons | mw_ext_chain_spear | 链矛 |
| weapons | mw_ext_swan_song_lance | “绝唱”归零长矛 |
| weapons | mw_ext_ea17_mortar | EA17 特种有效荷载迫击炮 |
| weapons | mw_ext_wonderland_cannon | “仙境”神经化学加农炮 |
| weapons | mw_ext_torrent_harpoon | “激流”弹道捕鲸叉 |
| weapons | mw_ext_bulkhead_auger | 舱壁螺钻 |
| weapons | mw_ext_screaming_rifle | 尖啸步枪 |
| weapons | mw_ext_half_life_sun_lens | 半衰烈日透镜 |
| weapons | mw_ext_corona_outpouring | 日冕倾泻 |
| weapons | mw_ext_maelstrom_drill_retracted | JV-69“漩涡”钻机，收缩模式 |
| weapons | mw_ext_maelstrom_drill_extended | JV-69“漩涡”钻机，展开模式 |
| weapons | mw_ext_pt3_flare_bow | PT3 耀斑弓 |
| weapons | mw_ext_typhoon_ion_channel | 台风型离子通道 |
| weapons | mw_ext_wodeng_gpmg | “疣猪”GPMG |
| weapons | mw_ext_wodeng_sticky_launcher | 粘滞发射器 |
| weapons | mw_ext_wodeng_mk12 | Mk 12 底盘支援武器 |
| weapons | mw_ext_comet_swarm | 群聚巢房 |
| weapons | mw_ext_comet_archer | 弓兵巢房 |
| weapons | mw_ext_comet_hound | 猎兔犬巢房 |
| weapons | mw_ext_ifrit_slip | 滑移枪 |
| weapons | mw_ext_ifrit_scimitar | 曲刀 |
| weapons | mw_ext_chimera_claw | 魔爪无人机巢房 |
| weapons | mw_ext_agrippa_siege | 警炮战斗霰弹枪 |
| weapons | mw_kkca_samyeli_bow | “萨姆耶利”自动装填反曲弓 |
| weapons | mw_kkca_thunder_barrel | 雷霆炮管 |
| weapons | mw_kkca_chakram_chain | 轮刃锁鞭 |
| weapons | mw_kkca_pulse_shield | 脉冲盾 |
| weapons | mw_kkca_garrison_lance | 卫戍长矛 |
| weapons | mw_kkca_valencia_lance | “巴伦西亚”C 型长枪 |
| weapons | mw_kkca_kinetic_musket | 动能滑膛枪 |
| weapons | mw_kkca_tiger_claw_baton | 虎爪警杖 |
| weapons | mw_kkca_doom_axe | 末日之斧 |
| weapons | mw_kkca_dust_sprayer | 粉尘喷射器 |
| weapons | mw_kkca_blackbird_net | 乌鸫防御网 |
| weapons | mw_kkca_chain_wheel | 链轮 |
| weapons | mw_ext_affinity_edge | 亲和之锋 |
| weapons | mw_piof_scatter_bow | 散射弓 |
| weapons | mw_piof_grim_harvest_scythe | “残酷收割”等离子镰 |
| weapons | mw_piof_micro_mass_driver | 极微质量驱动器 |
| weapons | mw_piof_wildfire_missiles | 野火导弹 |
| weapons | mw_piof_flintlock_pistol | 燧发手枪 |
| weapons | mw_piof_apothecary_rifle | “药剂师”射手步枪 |
| weapons | mw_piof_dazzle | 炫彩 |
| weapons | mw_piof_current_swarm | 电流虫群 |
| weapons | mw_piof_grinder_uzi | “研磨者”战斗 UZI |
| weapons | mw_piof_plasma_caster | 等离子脚轮 |
| weapons | mw_piof_furnace_hammer | 火炉之锤 |
| weapons | mw_piof_snap_crusher | 卡扣式挤压采矿钳 |
| weapons | mw_piof_geomorph_wrecking_ball | 地质形态粉碎球 |
| weapons | mw_piof_tt8_alpine_carbine | TT.8“阿尔卑斯之春”卡宾枪 |
| weapons | mw_piof_tt32_ice_lake_nozzle | TT.32“冰湖”冷却剂喷管 |
| weapons | mw_ch_tether | 远程锚定缆电枪 |
| weapons | mw_ch_tiger_claw | 虎爪 |
| weapons | mw_ch_markov_chain | 马克胡特链锯剑 |
| weapons | mw_ch_wolf_fang | 传动化狼牙棒 |
| weapons | mw_ch_demons_fang | 恶魔之牙 |
| weapons | mw_ch_typhoon | 台风空爆投射器 |
| weapons | mw_ch_model17 | 17 型跳帮手枪 |
| weapons | mw_ch_clearing_nexus | 清道夫巢房 |
| weapons | mw_ch_sharovski | 沙罗曼蛇狄火霰弹枪 |
| weapons | mw_ch_model96 | 96 型盾炮 |
| weapons | mw_ch_virus_dagger | 病毒匕首 |
| weapons | mw_ch_bull_missile | 公牛反辐射导弹 |
| weapons | mw_ch_tangle_cannon | 纠结加农炮 |
| weapons | mw_ch_shock_whip | 休克鞭 |
| weapons | mw_ch_explosive_chain | 爆炸锁链 |
| weapons | mw_ch_wandering_blade | “游隼”寻索阔剑 |
| weapons | mw_ch_smart_blade | 智能刀 |
| weapons | mw_ch_blackjack | 黑荚克战斗弓 |
| weapons | mw_ch_cover_missile | 防护罩导弹 |
| weapons | mw_pl_buckler | 弹道臂盾 |
| weapons | mw_pl_valkyrie | 瓦亚维亚导弹 |
| weapons | mw_pl_gorgon_micro | 哥瓦尔丹微型导弹 |
| weapons | mw_pl_garuda | 缇娜玻安导弹 |
| weapons | mw_pl_seeking_launcher | 寻索弹射器 |
| weapons | mw_pl_polaris | “北极星”式多功能辐射枪 |
| weapons | mw_pl_orion | “猎户座”式热射辐射枪 |
| weapons | mw_pl_modular_rifle | 模块化先进战斗步枪 |
| weapons | mw_pl_kinetic_driver | 运动驱动器 |
| weapons | mw_pl_hotwind | 热风冲锋手枪 |
| weapons | mw_pl_heavy_blaster | 重击炮 |
| weapons | mw_pl_plasma_shield | 等离子电浆盾 |
| weapons | mw_pl_heavy_shield | 赫塔卡重型战斗盾 |
| weapons | mw_pl_piof_rivet | 「垦荒者」液压铆钉枪 |
| weapons | mw_pl_piof_drill | TT.5 冲击掘进钻 |
| weapons | mw_pl_kkca_oath | 「誓约」决斗短剑 |
| weapons | mw_pl_kkca_joust | 「比武」重骑枪 |
| systems | ms_ext_informant_vald | 告密者 VALD |
| systems | ms_ext_curtain_aem | 谢幕 AEM |
| systems | ms_ext_swordfish_lfcm | 矛鱼 LFCM |
| systems | ms_ext_anti_surveillance | 反网监对策 |
| systems | ms_ext_needle_and_thread | 针与线 |
| systems | ms_ext_fallen_mask | 堕落面具之训 |
| systems | ms_ext_unsigned_surrender | 拒签投降书 |
| systems | ms_ext_cbnrn_sealing | CBNRN 密封技术 |
| systems | ms_ext_gas_grenade_dispenser | 瓦斯榴弹抛洒器 |
| systems | ms_ext_local_sterilization_vent | 局部灭菌气口 |
| systems | ms_ext_bloodhound_sniffer | 寻血猎犬 mk3.3 集群嗅探器 |
| systems | ms_ext_thresher_drone | 长尾鲨无人机 |
| systems | ms_ext_jump_drive | 跃迁驱动器 |
| systems | ms_ext_boarding_rail | 进入导轨 |
| systems | ms_ext_lens_codex | 透镜制造法典 v.08 |
| systems | ms_ext_sonic_explosives | 声波炸药 |
| systems | ms_ext_point_jet_cluster | 点弹射流形簇 |
| systems | ms_ext_insight_proto_mind | “洞察”原型思维体 |
| systems | ms_ext_judas_exploit | 犹大漏洞 |
| systems | ms_ext_obsession_recursion | 痴迷.递归（T） |
| systems | ms_ext_radiant_plume | 辉耀羽流 |
| systems | ms_ext_paladin_defrag | “圣武士”碎片整理子程序 |
| systems | ms_ext_iridescent_holoscales | 虹彩全息鳞 |
| systems | ms_ext_flame_retardant_unit | 阻燃性单元 |
| systems | ms_ext_ionizing_explosives | 电离炸药 |
| systems | ms_ext_em_induction_welder | 电磁感应焊机 |
| systems | ms_ext_evaporative_cooling_plating | 蒸发冷却镀层 |
| systems | ms_ext_offering_arrow | 祭品电箭 |
| systems | ms_ext_wodeng_turret_mount | 炮塔挂载点 |
| systems | ms_ext_wodeng_giant_bag | 巨质包 |
| systems | ms_ext_wodeng_counterfire | 反火力套组 |
| systems | ms_ext_comet_sabr | SABR 引擎 |
| systems | ms_ext_comet_white_star | 白星信号拦截器 |
| systems | ms_ext_comet_ew_ecm | EW/ECM 阵列 |
| systems | ms_ext_ifrit_threader | 空间穿线器 |
| systems | ms_ext_ifrit_entangler | 纠缠约束器 |
| systems | ms_ext_ifrit_superflow | 超储库分流 |
| systems | ms_ext_ifrit_ivan | 伊贝吉级 NHP 流 |
| systems | ms_ext_agrippa_bridge | 桥梁层叠包 |
| systems | ms_ext_agrippa_tower | 休克桥塔 |
| systems | ms_ext_agrippa_crane | 大型起重传动装置 |
| systems | ms_ext_agrippa_optimizer | 系统优化程序 |
| systems | ms_ext_agrippa_parvati | 帕尔瓦蒂级 NHP |
| systems | ms_kkca_cricket_art_1 | 蟋蟀印尼术一式 |
| systems | ms_kkca_cricket_art_2 | 蟋蟀印尼术二式 |
| systems | ms_kkca_trickster_kit | “诡术师”干扰套组 |
| systems | ms_kkca_archer_companion | 步弓手式伙伴礼宾单元 |
| systems | ms_kkca_emergency_laminate | 紧急层板 |
| systems | ms_kkca_transdomain_plating | 跨域镀层 |
| systems | ms_kkca_suppression_explosives | 抑制炸药 |
| systems | ms_kkca_pankration_gambit | 潘克拉辛弃兵法套组 |
| systems | ms_kkca_bulwark_engine | 壁垒引擎 |
| systems | ms_kkca_babieca_mount | “巴比埃卡”马术支架 |
| systems | ms_kkca_rps_fools_guard | RPS：愚人卫士 |
| systems | ms_kkca_rps_chariot_guard | RPS：战车卫士 |
| systems | ms_kkca_rps_world_guard | RPS：世界卫士 |
| systems | ms_kkca_valkyrie_weave | 英灵织物 |
| systems | ms_kkca_emergency_shunt | 应急系统分流 |
| systems | ms_kkca_aurora_aegis | 极光/神盾记忆装甲 |
| systems | ms_piof_overgrowth_explosives | 繁茂炸药 |
| systems | ms_piof_tt7_snowblind | TT.7 雪盲 |
| systems | ms_piof_greenbath_kit | “治愈之手”绿浴套组 |
| systems | ms_piof_carbon_steel_autosaw | 碳钢自动机械锯 |
| systems | ms_piof_ghillie_cloak | 吉利斗篷 |
| systems | ms_piof_overgrowth_charges | 蔓生炸药 |
| systems | ms_piof_smoke_generator | 烟雾发生器 |
| systems | ms_piof_trap_explosives | 陷阱炸药 |
| systems | ms_piof_tt6_strongman | TT.6“猛男”支援无人机 |
| systems | ms_piof_viper_drone | 毒蛇无人机 |
| systems | ms_piof_parvati_nhp | 帕尔瓦蒂级 NHP |
| systems | ms_piof_carrier_clamp | 载体夹 |
| systems | ms_piof_cherenkov_manifold | 切伦科夫流形簇 |
| systems | ms_piof_cicada_chatter | 蝉鸣叨叨 |
| systems | ms_piof_shock_explosives | 电击炸药 |
| systems | ms_piof_bmx_platform | B.M.X.自动打印平台 |
| systems | ms_piof_plasma_tread | 血浆胎面 |
| systems | ms_piof_grease_explosives | 油脂炸药 |
| systems | ms_piof_mercury_nhp | 墨丘利级 NHP |
| systems | ms_piof_all_terrain_muscle | 全地形合成肌 |
| systems | ms_piof_spike_driver | 钢钉驱动器 |
| systems | ms_piof_seismic_explosives | 地震炸药 |
| systems | ms_piof_frost_explosives | 霜冻炸药 |
| systems | ms_piof_springlock_seeder | 弹簧锁播种机 |
| systems | ms_piof_avalanche_charge | 雪崩冲锋 |
| systems | ms_piof_skadi_nhp | 斯卡蒂级 NHP |
| systems | ms_piof_cargo_walker | 货物步行者 |
| systems | ms_piof_damping_pump_alloy | 阻尼泵合金 |
| systems | ms_piof_amphora_drone | 双耳瓶无人机 |
| systems | ms_piof_resupply_explosives | 仓补炸药 |
| systems | ms_piof_ceramic_coating | 陶制外层涂料 |
| systems | ms_piof_nano_ceramsite | 纳米级陶粒载体 |
| systems | ms_ext_demolitions_toolkit | 爆破者工具箱 |
| systems | ms_ch_submunitions | 子母弹发射器 |
| systems | ms_ch_skates | 滑轮 |
| systems | ms_ch_fold_carbine | 可部署侦察卡宾枪 |
| systems | ms_ch_geometry | 可变几何机体 |
| systems | ms_ch_hound | “猎犬级”伙伴礼宾单元 |
| systems | ms_ch_reactive_armor | 爆破/反应装甲（ERA）分层 |
| systems | ms_ch_repair_pipeline | 修复型粘剂管道 |
| systems | ms_ch_ogun | 奥贡级 NHP |
| systems | ms_ch_spider_bombs | 蜘蛛炸弹 |
| systems | ms_ch_saboteur | 破坏者无人机 |
| systems | ms_ch_ecm | ECM 发射器 |
| systems | ms_ch_flytrap | “捕蝇夹”反侵入追踪器 v.2.3 |
| systems | ms_ch_thorn | “尖竹钉”反侵入荆棘 v.1.6 |
| systems | ms_ch_cascade_collapse | 级联雪崩模块 |
| systems | ms_ch_shadow_fist | //影拳 |
| systems | ms_ch_falling_star | 落星模块 |
| systems | ms_ch_serpent_fang | //蛇 牙击 |
| systems | ms_ch_swallow | 浸吞模块 |
| systems | ms_ch_shatter_palm | //碎心 v.5.掌 |
| systems | ms_ch_sling_bombs | 弹石炸弹 |
| systems | ms_ch_seismic_pulse | 地震脉冲场发生器 |
| systems | ms_ch_shield_array | 盾牌阵列无人机 |
| systems | ms_ch_evasive_array | 规避游标阵列 |
| systems | ms_ch_arcturus | 阿尔忒弥斯级 NHP |
| systems | ms_ch_holo_bombs | 全息炸弹 |
| systems | ms_ch_adaptive_coating | 视合适应性涂装 |
| systems | ms_ch_nightjar | 夜莺无人机 |
| systems | ms_ch_tactical_shifter | 战术转移器 |
| systems | ms_ch_echo_mirage | 回声斗篷 |
| systems | ms_pl_sentry_drone | 哨兵无人机 |
| systems | ms_pl_active_defense | 主动防御系统 |
| systems | ms_pl_fcs_relay | FCS 战术网络中继 |
| systems | ms_pl_mitra | 密特拉级 NHP |
| systems | ms_pl_atg_bombs | ATG 精确炸弹 |
| systems | ms_pl_coolwind | “凉风”温控器 |
| systems | ms_pl_hsc | HSC 电镀 |
| systems | ms_pl_tazo_worm | 塔佐蠕虫 |
| systems | ms_pl_disgust_reflex | 厌恶/反射 |
| systems | ms_pl_scan_bombs | 扫描炸弹 |
| systems | ms_pl_self_bridge | 自我意识桥接 |
| systems | ms_pl_ontological_pulse | 本体论超空间战术脉冲 |
| systems | ms_pl_gravity_vane | 重力风向标 |
| systems | ms_pl_tactical_belt | 战术带 |
| systems | ms_pl_weapon_pod | 武器舱 |
| systems | ms_pl_piof_workbench | 「拓荒工位」野外作业台 |
| systems | ms_pl_piof_tunnel | 「矿道」掘进推进器 |
| systems | ms_pl_piof_terraform | 地貌重塑阵列 |
| systems | ms_pl_piof_weather | 天候塔 |
| systems | ms_pl_kkca_banner | 「家徽」纹章旗 |
| systems | ms_pl_kkca_challenge | 「宣战」决斗协议 |
| systems | ms_pl_kkca_guard | 「代誓」守护铠 |
| systems | ms_pl_kkca_triumph | 「凯旋」号角 |
| mods | wm_ext_seek_devour_canister | 寻索/吞噬密罐弹 |
| mods | wm_piof_fragmentation_rounds | 分裂弹 |
| mods | wm_ch_weapon_hardening | 武器硬化 |
| mods | wm_ch_interference | 扰频弹 |
| mods | wm_ch_adaptive_weight | 自适应重量 |
| mods | wm_pl_underslung | 下挂式冲击器 |
| mods | wm_pl_optimized | 最优化工程 |
| core_bonuses | cb_ext_enhanced_system_upgrade | 增强系统升级 |
| core_bonuses | cb_ext_quality_logistics | 高品质后勤 |
| core_bonuses | cb_ext_kanggeduo_chassis | 康格多底盘 |
| core_bonuses | cb_ch_environment | 全环境适应 |
| core_bonuses | cb_ch_extinguisher | 自动灭火器 |
| core_bonuses | cb_ch_pressure | 紧急泄压板 |
| core_bonuses | cb_ch_harness | 冲撞条 |
| core_bonuses | cb_ch_reactor | 紧急反应堆覆盖 |
| core_bonuses | cb_ch_overclock | 超频调用接口 |
| core_bonuses | cb_kkca_custom_armament | 定制军备 |
| core_bonuses | cb_kkca_oath_of_excellence | 卓越誓言 |
| core_bonuses | cb_kkca_private_tutor | 私人家教 |
| core_bonuses | cb_kkca_signature_move | 招牌动作 |
| core_bonuses | cb_kkca_tournament_hardening | 锦标赛强化 |
| core_bonuses | cb_piof_built_to_last | 持久耐用 |
| core_bonuses | cb_piof_curveball | “曲线球”臂部调谐 |
| core_bonuses | cb_piof_survey_hardening | 勘探/挖掘固化 |
| core_bonuses | cb_piof_impact_multiplier | 冲击倍增器 |
| core_bonuses | cb_piof_slow_cycle_shroud | 低速循环屏蔽罩 |
| core_bonuses | cb_piof_woodsman | “樵夫”搜寻单元 |
| talents | t_ext_blade_dancer | 刀锋舞者 |
| talents | t_ext_giant_slayer | 巨人杀手 |
| talents | t_ext_crusher | 碾碎机 |
| talents | t_ext_guerrilla | 游击队 |
| talents | t_ext_gladiator | 角斗士 |
| talents | t_ext_scavenger | 拾荒者 |
| talents | t_ext_bricklayer | 砖匠 |
| talents | t_ext_razorman | 剃刀人 |
| talents | t_ext_sapper | 工兵 |
| talents | t_ext_junker | 垃圾佬 |
