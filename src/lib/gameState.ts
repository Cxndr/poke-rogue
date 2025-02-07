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
  "selectingMon" |  
  "setup" |
  "fight" |
  "gameOver";
  options: Pokemon[];
  round: Range<1,10>;
}

export const gameState: GameState = {
  party: [],
  currentState: "startGame",
  options: [],
  round: 1
}

export const startingMons: Pokemon[] = [
  await monApi.getPokemonByName("bulbasaur"),
  await monApi.getPokemonByName("squirtle"),
  await monApi.getPokemonByName("charmander"),
  await monApi.getPokemonByName("pikachu"),
  await monApi.getPokemonByName("eevee"),
];

export async function getRandomMove(pokemon: Pokemon) {
  const moves = pokemon.moves;
  const gen1Moves = moves.filter((move) => 
    move.version_group_details.some((v) => 
      v.version_group.name === "red-blue"
    )
  );
  const validMoves = [];
  for (const move of gen1Moves) {
    const moveData = await moveApi.getMoveByName(move.move.name);
    if (!moveData.power || moveData.power <= 0) {
      continue;
    }
    validMoves.push(moveData);
  }
  const selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
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
  console.log(`${mon.data.name} used ${mon.move.name} and did ${damage} damage to ${target.data.name}`);
}

export async function newLocalMon(pokemon: Pokemon) {
  return {
    data: pokemon,
    hp: getMaxHP(pokemon.stats[0].base_stat, 5),
    level: 5,
    move: await getRandomMove(pokemon)
  }
}