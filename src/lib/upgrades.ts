/* UPGRADES

  - item
    - capes
    - belts
    - gloves
    - supereffective glasses
    - pokeflute
  - new move (move trainer? tm?)
  - stats (minerals, rare candy)
  - special
    - daycare center
    - game corner
    - pokeathlon
    - gym (extra battle with fixed rewards?)
    - acro bike
    - missingno?
    - egg?
    - trade
    - safari zone (get new fixed mon)
    - team rocket (risk/reward)
    - museum
    - professor oak (get new mon)
    
*/

import { Move, MachineClient, MoveClient } from "pokenode-ts";
import { GameState, LocalMon } from "./gameState";

const machineApi = new MachineClient();
const moveApi = new MoveClient();
export type Stat = "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed";
export function upgradeStat(stat:Stat, amount: number, pokemon: LocalMon) {
  const statData = pokemon.data.stats.find(s => s.stat.name === stat);
  if (statData) {
    statData.base_stat += amount;
  }
}
export function getUpgradeStat() {
  const statNumber = Math.floor(Math.random() * 6) + 1;
  let stat: Stat = "hp";
  switch (statNumber) {
    case 1:
      stat = "hp";
      break;
    case 2:
      stat = "attack";
      break;
    case 3:
      stat = "defense";
      break;
    case 4:
      stat = "special-attack";
      break;
    case 5:
      stat = "special-defense";
      break;
    case 6:
      stat = "speed";
      break;
  }
  return stat;
}

export function upgradeMove(move: Move, pokemon: LocalMon) {
  pokemon.move = move;
}

export type ItemType = "vitamin" | "tm" | "tool";

export interface BaseItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  sprite: string;
}

export interface Vitamin extends BaseItem {
  type: "vitamin";
  stat: Stat;
  amount: number;
  use: (pokemon: LocalMon) => void;
}

export interface TM extends BaseItem {
  type: "tm";
  moveId: number;
  moveName: string;
  use: (pokemon: LocalMon) => Promise<void>;
}

export interface Tool extends BaseItem {
  type: "tool";
  effect: (pokemon: LocalMon) => void;
  unequip: (pokemon: LocalMon) => void;
}

export type Item = Vitamin | TM | Tool;

export type UpgradeType = "item" | "move" | "teamRocket" | "safariZone" | "professorOak";

export interface Upgrade {
  type: UpgradeType;
  name: string;
  description: string;
  execute: (game: GameState) => Promise<void>;
}

export const vitamins: Vitamin[] = [
  {
    id: "hpup",
    name: "HP Up",
    description: "Increases HP by 50",
    type: "vitamin",
    sprite: "/items/hpup.png",
    stat: "hp",
    amount: 50,
    use: (pokemon) => upgradeStat("hp", 50, pokemon)
  },
  {
    id: "protein",
    name: "Protein",
    description: "Increases Attack by 10",
    type: "vitamin",
    sprite: "/items/protein.png",
    stat: "attack",
    amount: 10,
    use: (pokemon) => upgradeStat("attack", 10, pokemon)
  },
  {
    id: "iron",
    name: "Iron",
    description: "Increases Defense by 10",
    type: "vitamin",
    sprite: "/items/iron.png",
    stat: "defense",
    amount: 10,
    use: (pokemon) => upgradeStat("defense", 10, pokemon)
  },
  {
    id: "calcium",
    name: "Calcium",
    description: "Increases Special Defense by 10",
    type: "vitamin",
    sprite: "/items/calcium.png",
    stat: "special-defense",
    amount: 10,
    use: (pokemon) => upgradeStat("special-defense", 10, pokemon)
  },
  {
    id: "zinc",
    name: "Zinc",
    description: "Increases Special Attack by 10",
    type: "vitamin",
    sprite: "/items/zinc.png",
    stat: "special-attack",
    amount: 10,
    use: (pokemon) => upgradeStat("special-attack", 10, pokemon)
  },
  {
    id: "carbos",
    name: "Carbos",
    description: "Increases Speed by 10",
    type: "vitamin",
    sprite: "/items/carbos.png",
    stat: "speed",
    amount: 10,
    use: (pokemon) => upgradeStat("speed", 10, pokemon)
  }
  // todo: add rare stronger versions?
  
];

export const tools: Tool[] = [
  {
    id: "choicespecs",
    name: "Choice Specs", 
    description: "+50% Attack", 
    type: "tool",
    sprite: "/items/choicespecs.png",
    effect: (pokemon) => {
      const atk = pokemon.data.stats.find(s => s.stat.name === "attack");
      if (atk) atk.base_stat = Math.floor(atk.base_stat * 1.5);
    },
    unequip: (pokemon) => {
      const atk = pokemon.data.stats.find(s => s.stat.name === "attack");
      if (atk) atk.base_stat = Math.floor(atk.base_stat / 1.5);
    }
  },
  {
    id: "choicespecs",
    name: "Choice Specs",
    description: "+50% Special Attack",
    type: "tool",
    sprite: "/items/choicespecs.png",
    effect: (pokemon) => {
      const spAtk = pokemon.data.stats.find(s => s.stat.name === "special-attack");
      if (spAtk) spAtk.base_stat = Math.floor(spAtk.base_stat * 1.5);
    },
    unequip: (pokemon) => {
      const spAtk = pokemon.data.stats.find(s => s.stat.name === "special-attack");
      if (spAtk) spAtk.base_stat = Math.floor(spAtk.base_stat / 1.5);
    }
  },
  {
    id: "pothelmet",
    name: "Pot Helmet",
    description: "+50% Defense",
    type: "tool",
    sprite: "/items/pothelmet.png",
    effect: (pokemon) => {
      const def = pokemon.data.stats.find(s => s.stat.name === "defense");
      if (def) def.base_stat = Math.floor(def.base_stat * 1.5);
    },
    unequip: (pokemon) => {
      const def = pokemon.data.stats.find(s => s.stat.name === "defense");
      if (def) def.base_stat = Math.floor(def.base_stat / 1.5);
    }
  },
  {
    id: "assaultvest",
    name: "Assault Vest",
    description: "+50% Special Defense",
    type: "tool",
    sprite: "/items/assaultvest.png",
    effect: (pokemon) => {
      const spDef = pokemon.data.stats.find(s => s.stat.name === "special-defense");
      if (spDef) spDef.base_stat = Math.floor(spDef.base_stat * 1.5);
    },
    unequip: (pokemon) => {
      const spDef = pokemon.data.stats.find(s => s.stat.name === "special-defense");
      if (spDef) spDef.base_stat = Math.floor(spDef.base_stat / 1.5);
    }
  },
  {
    id: "choicescarf",
    name: "Choice Scarf",
    description: "+50% Speed",
    type: "tool",
    sprite: "/items/choicescarf.png",
    effect: (pokemon) => {
      const speed = pokemon.data.stats.find(s => s.stat.name === "speed");  
      if (speed) speed.base_stat = Math.floor(speed.base_stat * 1.5);
    },
    unequip: (pokemon) => {
      const speed = pokemon.data.stats.find(s => s.stat.name === "speed");
      if (speed) speed.base_stat = Math.floor(speed.base_stat / 1.5);
    }
  },
  {
    id: "giantcape",
    name: "Giant Cape",
    description: "+50% HP",
    type: "tool",
    sprite: "/items/giantcape.png",
    effect: (pokemon) => {
      const hp = pokemon.data.stats.find(s => s.stat.name === "hp");
      if (hp) hp.base_stat = Math.floor(hp.base_stat * 1.5);
    },
    unequip: (pokemon) => {
      const hp = pokemon.data.stats.find(s => s.stat.name === "hp");
      if (hp) hp.base_stat = Math.floor(hp.base_stat / 1.5);
    }
  },
  // todo: add more

];

async function createTMUseFunction(moveName: string): Promise<(pokemon: LocalMon) => Promise<void>> {
  return async (pokemon: LocalMon) => {
    const move = await moveApi.getMoveByName(moveName);
    const canLearn = move.learned_by_pokemon.some(p => 
      p.name === pokemon.data.name || 
      p.name === pokemon.data.species.name
    );
    
    if (!canLearn) {
      throw new Error(`${pokemon.data.name} cannot learn ${move.name}!`);
    }
    
    upgradeMove(move, pokemon);
  };
}

export function getRandomUpgrades(count: number): Upgrade[] {
  const upgrades: Upgrade[] = [];
  const usedUpgrades = new Set<string>(); // Track used upgrades by name
  
  // Keep trying until we have enough unique upgrades
  while (upgrades.length < count) {
    const roll = Math.random();
    
    if (roll < 0.6) { // 60% chance for item
      const itemRoll = Math.random();
      if (itemRoll < 0.4) { // 40% chance for vitamin
        const vitamin = vitamins[Math.floor(Math.random() * vitamins.length)];
        // Only add if we haven't used this vitamin yet
        if (!usedUpgrades.has(vitamin.name)) {
          usedUpgrades.add(vitamin.name);
          upgrades.push({
            type: "item",
            name: vitamin.name,
            description: vitamin.description,
            execute: async (game) => {
              game.inventory.push(vitamin);
            }
          });
        }
      } else if (itemRoll < 0.7) { // 30% chance for tool
        const tool = tools[Math.floor(Math.random() * tools.length)];
        if (!usedUpgrades.has(tool.name)) {
          usedUpgrades.add(tool.name);
          upgrades.push({
            type: "item",
            name: tool.name,
            description: tool.description,
            execute: async (game) => {
              game.inventory.push(tool);
            }
          });
        }
      } else { // 30% chance for TM
        const tm = tms[Math.floor(Math.random() * tms.length)];
        if (!usedUpgrades.has(tm.name)) {
          usedUpgrades.add(tm.name);
          upgrades.push({
            type: "item",
            name: tm.name,
            description: tm.description,
            execute: async (game) => {
              game.inventory.push(tm);
            }
          });
        }
      }
    } else if (roll < 0.75) { // 15% chance for Team Rocket
      if (!usedUpgrades.has("Team Rocket Deal")) {
        usedUpgrades.add("Team Rocket Deal");
        upgrades.push({
          type: "teamRocket",
          name: "Team Rocket Deal",
          description: "Risk it all! 70% chance to get 3 random items, 30% chance to lose a random Pokémon",
          execute: async (game) => {
            const rocketRoll = Math.random();
            if (rocketRoll < 0.7) {
              // Success - get 3 random items
              for (let i = 0; i < 3; i++) {
                const itemRoll = Math.random();
                if (itemRoll < 0.4) {
                  game.inventory.push(vitamins[Math.floor(Math.random() * vitamins.length)]);
                } else if (itemRoll < 0.7) {
                  game.inventory.push(tools[Math.floor(Math.random() * tools.length)]);
                } else {
                  game.inventory.push(tms[Math.floor(Math.random() * tms.length)]);
                }
              }
            } else {
              // Fail - lose a random pokemon
              if (game.party.length > 1) { // Don't remove last pokemon
                const removeIndex = Math.floor(Math.random() * game.party.length);
                game.party.splice(removeIndex, 1);
              }
            }
          }
        });
      }
    }
    // todo: add more
  }
  
  return upgrades;
}

const TMBlacklist = 
  [3,4,6,7,18,19,23,27,30,31,32,33,34,35,41,44,45,46,50]

export async function getRandomItemTM() {
  const maxId = 50;
  const validIds = [];
  for (let i = 0; i < maxId; i++) {
    if (TMBlacklist.includes(i)) continue;
    validIds.push(i);
  }
  const randomId = validIds[Math.floor(Math.random() * validIds.length)];
  const machine = await machineApi.getMachineById(randomId);
  return machine;
}

export const tms: TM[] = [
  {
    id: "tm01",
    name: "TM01 Mega Punch",
    description: "Teaches Mega Punch (Power: 80)",
    type: "tm",
    sprite: "/items/tm.png",
    moveId: 5,
    moveName: "mega-punch",
    use: await createTMUseFunction("mega-punch")
  },
  {
    id: "tm08",
    name: "TM08 Body Slam",
    description: "Teaches Body Slam (Power: 85)",
    type: "tm",
    sprite: "/items/tm.png",
    moveId: 34,
    moveName: "body-slam",
    use: await createTMUseFunction("body-slam")
  },
  {
    id: "tm24",
    name: "TM24 Thunderbolt",
    description: "Teaches Thunderbolt (Power: 90)",
    type: "tm",
    sprite: "/items/tm.png",
    moveId: 85,
    moveName: "thunderbolt",
    use: await createTMUseFunction("thunderbolt")
  },
  {
    id: "tm38",
    name: "TM38 Fire Blast",
    description: "Teaches Fire Blast (Power: 110)",
    type: "tm",
    sprite: "/items/tm.png",
    moveId: 126,
    moveName: "fire-blast",
    use: await createTMUseFunction("fire-blast")
  }
];

