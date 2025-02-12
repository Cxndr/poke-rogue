import { Move, MoveClient, Pokemon, PokemonClient } from "pokenode-ts";
import { totalPokemon, maxRound, maxPartySize } from "./settings";
import { Item, Tool } from './upgrades';
const monApi = new PokemonClient();
const moveApi = new MoveClient();

export type LocalMon = {
  data: Pokemon;
  hp: number;
  level: number;
  move: Move;
  equippedTool?: Tool;
}

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | F;
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type PartySlot = {
  pokemon: LocalMon | null;
  index: number;
}

export type GameState = {
  party: PartySlot[];
  currentState: 
  "startGame" | 
  "selectMon" |  
  "setup" |
  "fight" |
  "upgrade" |
  "gameComplete" |
  "gameOver";
  options: Pokemon[];
  round: Range<1, typeof maxRound>;
  fightLog: string[];
  inventory: Item[];
  pokemonStorage: LocalMon[];
}

export const gameState: GameState = {
  party: Array(maxPartySize).fill(null).map((_, i) => ({ pokemon: null, index: i })),
  currentState: "startGame",
  options: [],
  round: 1,
  fightLog: [],
  inventory: [],
  pokemonStorage: [],
}

export function resetParty(game: GameState) {
  game.party.forEach(slot => {
    if (slot.pokemon) {
      resetHP(slot.pokemon);
    }
  });
}

export function finishRound(result: "won" | "lost", game: GameState, setGame: (game: GameState) => void) {
  if (result === "won") {
    if (game.round >= maxRound) {
      setGame({...game, currentState: "gameComplete"});
    } else {
      setGame({...game, currentState: "selectMon", round: (game.round + 1) as Range<1, typeof maxRound>, fightLog: []});
      resetParty(game);
    }
  } else {
    setGame({...game, currentState: "startGame"});
  }
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

export function executeAttack(mon: LocalMon, target: LocalMon, game: GameState) {
  if (!mon.move.power) {
    return;
  }
  const damage = Math.floor(mon.move.power * mon.level / 50) + 2;
  target.hp -= damage;
  if (target.hp <= 0) {
    target.hp = 0;
    game.fightLog.push(`${ProperName(target.data.name)} fainted!`);
  } else {
    game.fightLog.push(`${ProperName(mon.data.name)} used ${ProperName(mon.move.name)} and did ${damage} damage to ${ProperName(target.data.name)}`);
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

export function checkIfPartyDefeated(party: PartySlot[]) {
  return party.every(slot => !slot.pokemon || slot.pokemon.hp <= 0);
}

export function checkIfEnemyPartyDefeated(party: LocalMon[]) {
  return party.every(mon => mon.hp <= 0);
}
