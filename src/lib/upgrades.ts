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
import { GameState, LocalMon, ProperName } from "./gameState";

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
  moveType: string;
  movePower: number;
  moveAccuracy: number;
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
    description: "+50 HP",
    type: "vitamin",
    sprite: "/items/hpup.png",
    stat: "hp",
    amount: 50,
    use: (pokemon) => upgradeStat("hp", 50, pokemon)
  },
  {
    id: "protein",
    name: "Protein",
    description: "+10 Attack",
    type: "vitamin",
    sprite: "/items/protein.png",
    stat: "attack",
    amount: 10,
    use: (pokemon) => upgradeStat("attack", 10, pokemon)
  },
  {
    id: "iron",
    name: "Iron",
    description: "+10 Defense",
    type: "vitamin",
    sprite: "/items/iron.png",
    stat: "defense",
    amount: 10,
    use: (pokemon) => upgradeStat("defense", 10, pokemon)
  },
  {
    id: "calcium",
    name: "Calcium",
    description: "+10 Special Defense",
    type: "vitamin",
    sprite: "/items/calcium.png",
    stat: "special-defense",
    amount: 10,
    use: (pokemon) => upgradeStat("special-defense", 10, pokemon)
  },
  {
    id: "zinc",
    name: "Zinc",
    description: "+10 Special Attack",
    type: "vitamin",
    sprite: "/items/zinc.png",
    stat: "special-attack",
    amount: 10,
    use: (pokemon) => upgradeStat("special-attack", 10, pokemon)
  },
  {
    id: "carbos",
    name: "Carbos",
    description: "+10 Speed",
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
    id: "choiceband",
    name: "Choice Band", 
    description: "+50% Attack", 
    type: "tool",
    sprite: "/items/choiceband.png",
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

const handleTeamRocketFailure = (game: GameState) => {
  const filledSlots = game.party.filter(slot => slot.pokemon !== null);
  if (filledSlots.length > 1) {
    // Remove pokemon from a random filled slot
    const filledSlot = filledSlots[Math.floor(Math.random() * filledSlots.length)];
    filledSlot.pokemon = null;
    game.currentState = "setup";
  }
};

export function getRandomUpgrades(count: number, game: GameState): Upgrade[] {
  const upgrades: Upgrade[] = [];
  const usedUpgrades = new Set<string>(); // Track used upgrades by name
  
  // Get count of filled party slots
  const filledSlots = game.party.filter(slot => slot.pokemon !== null).length;
  
  while (upgrades.length < count) {
    const roll = Math.random();
    
    if (roll < 0.6) {
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
      } else if (tms.length > 0) { // 30% chance for TM, only if TMs are loaded
        const tm = tms[Math.floor(Math.random() * tms.length)];
        if (tm && !usedUpgrades.has(tm.name)) {
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
    } else if (roll < 0.75 && filledSlots > 1) {
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
              // Fail - remove a random pokemon from party
              handleTeamRocketFailure(game);
            }
            game.currentState = "setup";
          }
        });
      }
    }
    // todo: add more
  }
  
  return upgrades;
}

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

const TMBlacklist = [
  'tm03', 'tm04', 'tm06', 'tm07', 'tm18', 'tm19', 
  'tm23', 'tm27', 'tm30', 'tm31', 'tm32', 'tm33', 
  'tm34', 'tm35', 'tm41', 'tm44', 'tm45', 'tm46', 'tm50'
];

export async function getRandomItemTM() {
  if (tms.length === 0) {
    await initializeGame();
  }
  const randomTM = tms[Math.floor(Math.random() * tms.length)];
  return randomTM;
}

export let tms: TM[] = []

export async function getValidTMs() {
  const tms: TM[] = [];
  
  // Get list of all machines (this just gives us URLs)
  const machineList = await machineApi.listMachines(0, 1000);
  
  // Process each machine URL to get full details
  const machinePromises = machineList.results.map(async (result) => {
    // Extract machine ID from URL
    const machineId = parseInt(result.url.split('/').filter(Boolean).pop() || '0');
    return machineApi.getMachineById(machineId);
  });

  // Fetch all machines in parallel
  const machines = await Promise.all(machinePromises);
  
  // Filter for Gen 1 TMs and exclude blacklisted TMs
  const gen1Machines = machines.filter(machine => 
    machine.version_group.name === "red-blue" && 
    machine.item.name.startsWith('tm') &&
    !TMBlacklist.includes(machine.item.name)
  );

  // Process each Gen 1 TM
  for (const machine of gen1Machines) {
    try {
      const moveData = await moveApi.getMoveByName(machine.move.name);
      
      // Skip TMs with no power (status moves)
      if (!moveData.power) continue;
      
      tms.push({
        id: machine.item.name,
        name: `${machine.item.name.toUpperCase()}: ${ProperName(machine.move.name)}`,
        description: `Teaches ${ProperName(machine.move.name)}`,
        type: "tm",
        sprite: "/items/tm.png",
        moveId: moveData.id,
        moveName: machine.move.name,
        moveType: moveData.type.name,
        movePower: moveData.power ?? 0,
        moveAccuracy: moveData.accuracy ?? 100,
        use: await createTMUseFunction(machine.move.name)
      });
    } catch (error) {
      console.error(`Error processing TM for move ${machine.move.name}:`, error);
    }
  }
  
  return tms;
}

export async function initializeGame() {
  tms = await getValidTMs();
}

export function removeEquippedTool(pokemon: LocalMon, game: GameState) {
  if (pokemon.equippedTool) {
    pokemon.equippedTool.unequip(pokemon);
    game.inventory.push(pokemon.equippedTool);
    pokemon.equippedTool = undefined;
  } 
}