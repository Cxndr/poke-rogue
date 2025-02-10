import { Move, MoveClient, Pokemon, PokemonClient } from "pokenode-ts";
import { totalPokemon } from "./settings";
const monApi = new PokemonClient();
const moveApi = new MoveClient();

export type LocalMon = {
  data: Pokemon;
  hp: number;
  level: number;
  move: Move;
}

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | F;
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type GameState = {
  party: LocalMon[];
  currentState: 
  "startGame" | 
  "selectMon" |  
  "setup" |
  "fight" |
  "upgrade" |
  "gameOver";
  options: Pokemon[];
  round: Range<1,10>;
  fightLog: string[];
}

export const gameState: GameState = {
  party: [],
  currentState: "startGame",
  options: [],
  round: 1,
  fightLog: []
}

export const startingMons: Pokemon[] = [
  await monApi.getPokemonByName("bulbasaur"),
  await monApi.getPokemonByName("squirtle"),
  await monApi.getPokemonByName("charmander"),
  await monApi.getPokemonByName("pikachu"),
  await monApi.getPokemonByName("eevee"),
];

export function getStartingMons() {
  return startingMons.map(mon => newLocalMon(mon));
}

export async function getRandomMove(pokemon: Pokemon) {
  // const moves = pokemon.moves;
  // const gen1Moves = moves.filter((move) => 
  //   move.version_group_details.some((v) => 
  //     v.version_group.name === "red-blue"
  //   )
  // );
  // const validMoves = [];
  // for (const move of gen1Moves) {
  //   const moveData = await moveApi.getMoveByName(move.move.name);
  //   if (!moveData.power || moveData.power <= 0) {
  //     continue;
  //   }
  //   validMoves.push(moveData);
  // }
  // const selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  const selectedMove = await moveApi.getMoveByName(pokemon.moves[0].move.name); // changed for faster testing, set back to random
  return selectedMove;
}

export async function getEnemyParty(level: number, count: number) {
  const eParty: LocalMon[] = [];
  for (let i = 0; i < count; i++) {
    const monId = Math.floor(Math.random() * totalPokemon) + 1;
    const mon = await monApi.getPokemonById(monId);
    const move = await getRandomMove(mon);
    eParty.push({data: mon, level: level, move: move, hp: getMaxHP(mon.stats[0].base_stat, level)});
  }
  return eParty;
}

export function ProperName(name: string) {
  let result = name.toLowerCase();
  result = result.replace(/[^a-z0-9]/g, " ");
  result = result.replace(/\b\w/g, (char) => char.toUpperCase());
  return result;
}

export function getMaxHP(baseHP: number, level: number) {
  return Math.floor( (2 * baseHP + 8) * level / 100 ) + level + 10;
}

export function resetHP(mon: LocalMon) {
  mon.hp = getMaxHP(mon.data.stats[0].base_stat, mon.level);
}

export function executeAttack(mon: LocalMon, target: LocalMon) {
  if (!mon.move.power) {
    return;
  }
  const damage = Math.floor(mon.move.power * mon.level / 50) + 2;
  target.hp -= damage;
  if (target.hp <= 0) {
    target.hp = 0;
    gameState.fightLog.push(`${ProperName(target.data.name)} fainted!`);
  } else {
    gameState.fightLog.push(`${ProperName(mon.data.name)} used ${ProperName(mon.move.name)} and did ${damage} damage to ${ProperName(target.data.name)}`);
  }
}

export async function newLocalMon(pokemon: Pokemon) {
  return {
    data: pokemon,
    hp: getMaxHP(pokemon.stats[0].base_stat, 5),
    level: 5,
    move: await getRandomMove(pokemon)
  }
}

export function checkIfPartyDefeated(party: LocalMon[]) {
  return party.every(mon => mon.hp <= 0);
}

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
  let upgrade: Upgrade;
  if (upgradeRoll < 25) {
    upgrade = {
      name: "Improve Stat",
      description: `+5 ${getUpgradeStat()}`
    };
  }

  return upgrade;
  }

export function getUpgrades(count: number) {
  const upgrades: Upgrade[] = [];
  for (let i = 0; i < count; i++) {
    getRandomUpgrade();
  }
  return upgrades;
}

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