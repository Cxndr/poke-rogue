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

import { Move, MachineClient } from "pokenode-ts";
import { LocalMon } from "./gameState";

const machineApi = new MachineClient();

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

type Upgrade = {
  name: string;
  description: string;
}

function getRandomUpgrade() {
  const upgradeRoll = Math.floor(Math.random() * 100) + 1;
  if (upgradeRoll < 25) {
  }
}

export function getUpgrades(count: number) {
  const upgrades: Upgrade[] = [];
  for (let i = 0; i < count; i++) {
    getRandomUpgrade();
  }
  return upgrades;
}

export type Item = {
  name: string;
  description: string;
  effect: () => void;
}
export type Tool = {
  name: string;
  description: string;
  effect: () => void;
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

