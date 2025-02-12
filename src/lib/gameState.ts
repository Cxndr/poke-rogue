import { Move, MoveClient, Pokemon, PokemonClient, Type } from "pokenode-ts";
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

export function createInitialGameState(): GameState {
  return {
    party: Array(maxPartySize).fill(null).map((_, i) => ({ pokemon: null, index: i })),
    currentState: "startGame",
    options: [],
    round: 1,
    fightLog: [],
    inventory: [],
    pokemonStorage: []
  };
}

export const gameState: GameState = createInitialGameState();


export function getMaxHP(baseHP: number, level: number) {
  return Math.floor( (2 * baseHP + 8) * level / 100 ) + level + 10;
}

export function resetHP(mon: LocalMon) {
  mon.hp = getMaxHP(mon.data.stats[0].base_stat, mon.level);
}

export function resetParty(game: GameState) {
  game.party.forEach(slot => {
    if (slot.pokemon) {
      resetHP(slot.pokemon);
    }
  });
}

export function setMonLevels(game: GameState) {
  game.party.forEach(slot => {
    if (slot.pokemon) {
      slot.pokemon.level = game.round*5;
    }
  });
  game.pokemonStorage.forEach(mon => {
    mon.level = game.round*5;
  });
}

export function finishRound(result: "won" | "lost", game: GameState, setGame: (game: GameState) => void) {
  if (result === "won") {
    if (game.round >= maxRound) {
      setGame({...game, currentState: "gameComplete"});
    } else {
      const updatedGameState = {
        ...game,
        currentState: "selectMon",
        round: (game.round + 1) as Range<1, typeof maxRound>,
        fightLog: []
      } as GameState;
      resetParty(updatedGameState);
      setMonLevels(updatedGameState);
      setGame(updatedGameState);
    }
  } else if (result === "lost") {
    setGame(createInitialGameState());
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

const enemyMonsRound1 = [
  {mon: "pidgey", chance: 25},
  {mon: "rattata", chance: 25},
  {mon: "spearow", chance: 10},
  {mon: "nidoran-f", chance: 10},
  {mon: "nidoran-m", chance: 10},
  {mon: "mankey", chance: 10},
  {mon: "bulbasaur", chance: 1},
  {mon: "squirtle", chance: 1},
  {mon: "charmander", chance: 1},
  {mon: "eevee", chance: 1},
]

const enemyMonsRound2 = [
  {mon: "rattata", chance: 25},
  {mon: "pidgey", chance: 25},
  {mon: "pidgeotto", chance: 5},
  {mon: "pikachu", chance: 5},
  {mon: "spearow", chance: 25},
  {mon: "weedle", chance: 30},
  {mon: "kakuna", chance: 20},
  {mon: "beedrill", chance: 5},
  {mon: "caterpie", chance: 30},
  {mon: "metapod", chance: 20},
  {mon: "butterfree", chance: 5},
  {mon: "ekans", chance: 5},
  {mon: "nidoran-f", chance: 15},
  {mon: "nidoran-m", chance: 15}
]

const enemyMonsRound3 = [
  {mon: "vulpix", chance: 15},
  {mon: "jigglypuff", chance: 25},
  {mon: "zubat", chance: 30},
  {mon: "geodude", chance: 20},
  {mon: "oddish", chance: 20},
  {mon: "paras", chance: 25},
  {mon: "magikarp", chance: 10},
  {mon: "mr-mime", chance: 1},
  {mon: "diglett", chance: 15},
  {mon: "mankey", chance: 15}
]
const enemyMonsRound4 = [
  {mon: "sandshrew", chance: 40},
  {mon: "clefairy", chance: 30},
  {mon: "magikarp", chance: 25},
  {mon: "venonat", chance: 30},
  {mon: "ekans", chance: 25},
  {mon: "bellsprout", chance: 60},
  {mon: "venonat", chance: 40},
  {mon: "abra", chance: 20}
]

export function getMonFromChanceList(list: {mon: string, chance: number}[]) {
  const totalChance = list.reduce((acc, mon) => acc + mon.chance, 0);
  const random = Math.random() * totalChance;
  let cumulativeChance = 0;
  for (const mon of list) {
    cumulativeChance += mon.chance;
    if (random <= cumulativeChance) {
      return mon.mon as string;
    }
  }
  return "unown";
}

export async function getEnemyMon(round: number) {
  if (round === 1 || round === 2) {
    const monName = getMonFromChanceList(enemyMonsRound1);
    return await monApi.getPokemonByName(monName);
  } else if (round === 3 || round === 4) {
    const monName = getMonFromChanceList(enemyMonsRound2);
    return await monApi.getPokemonByName(monName);
  } else if (round === 3) {
    const monName = getMonFromChanceList(enemyMonsRound2.concat(enemyMonsRound3));
    return await monApi.getPokemonByName(monName);
  } else if (round === 4) {
    const monName = getMonFromChanceList(enemyMonsRound2.concat(enemyMonsRound3).concat(enemyMonsRound4));
    return await monApi.getPokemonByName(monName);
  }
  
  const monId = Math.floor(Math.random() * totalPokemon) + 1;
  return await monApi.getPokemonById(monId);
}

export async function getEnemyParty(level: number, count: number, round: number) {
  const eParty: LocalMon[] = [];
  for (let i = 0; i < count; i++) {
    const mon = await getEnemyMon(round);
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

function getTypeEffectiveness(moveTypeData: Type, defenderType: string) {
  if (moveTypeData.damage_relations.no_damage_to.some(type => type.name === defenderType)) return 0.1;
  if (moveTypeData.damage_relations.double_damage_to.some(type => type.name === defenderType)) return 2;
  if (moveTypeData.damage_relations.half_damage_to.some(type => type.name === defenderType)) return 0.5;
  return 1;
}

export function calculateAttackTime(speedStat: number) {
  const normalSpeed = 65; // Define "normal" speed
  const normalAttackTime = 2000; // milliseconds

  const baseAttackTime = normalAttackTime * (1 + normalSpeed / normalSpeed);
  const speedModifier = speedStat / normalSpeed;
  const attackTime = baseAttackTime / (1 + speedModifier);

  return attackTime;
}

export async function calculateDamage(attacker: LocalMon, target: LocalMon, move: Move) {
  // using gen 1 formula found here: https://bulbapedia.bulbagarden.net/wiki/Damage
  const level = attacker.level;
  const critThreshold = attacker.data.stats[5].base_stat/2;
  const critRoll = Math.floor(Math.random() * 255);
  const critical = critRoll < critThreshold ? 2 : 1;
  const A = move.damage_class?.name === "special" ? attacker.data.stats[3].base_stat : attacker.data.stats[1].base_stat;
  const D = move.damage_class?.name === "special" ? target.data.stats[4].base_stat : target.data.stats[2].base_stat;
  const power = move.power ?? 0;
  const STAB = attacker.data.types.some(type => type.type.name === move.type.name) ? 1.5 : 1;
  const moveTypeData = await monApi.getTypeByName(move.type.name);
  const Type1 = getTypeEffectiveness(moveTypeData, target.data.types[0].type.name);
  const Type2 = target.data.types[1] ? getTypeEffectiveness(moveTypeData, target.data.types[1].type.name) : 1;
  const random = (Math.floor(Math.random() * 39) + 217) / 255;

  let damage = ((((((2*level*critical)/5)+2) * power * (A/D))/50) + 2) * STAB * Type1 * Type2 * random;
  if (damage < 1) damage = 1;
  damage = Math.floor(damage);
  return {
    damage: damage,
    critical: critical === 2 ? true : false,
    typeEffectiveness: (Type1 * Type2) === 1 ? "normal" : (Type1 * Type2) === 0.1 ? "super effective" : "not very effective"
  }
}

export async function executeAttack(mon: LocalMon, target: LocalMon, game: GameState) {
  const damageResult = await calculateDamage(mon, target, mon.move);
  target.hp -= damageResult.damage;
  
  game.fightLog.push(
    `${ProperName(mon.data.name)} used ${ProperName(mon.move.name)} and did ${damageResult.damage} damage to ${ProperName(target.data.name)}. ${damageResult.critical ? "Critical hit!" : ""} ${damageResult.typeEffectiveness !== "normal" ? `It was ${damageResult.typeEffectiveness}!` : ""}`
  );
  
  if (target.hp <= 0) {
    target.hp = 0;
    game.fightLog.push(`${ProperName(target.data.name)} fainted!`);
    return true;
  }
  return false;
}

export function startAttackLoop(
  attacker: LocalMon | null,
  defenders: (LocalMon | null)[],
  enemyParty: LocalMon[],
  game: GameState,
  timeoutRefs: { [key: string]: NodeJS.Timeout },
  setFightStatus: (status: "fighting" | "Won" | "Lost") => void,
  setFightLogUpdate: (update: (prev: number) => number) => void,
  setGame: (game: GameState) => void,
  isPlayerParty: boolean,
  updateTimer: (monName: string, timeLeft: number) => void
) {
  if (!attacker) return;

  // Clear any existing timeout and interval for this attacker
  if (timeoutRefs[attacker.data.name]) {
    clearTimeout(timeoutRefs[attacker.data.name]);
    clearInterval(timeoutRefs[`${attacker.data.name}_interval`]);
  }

  const attackTime = calculateAttackTime(attacker.data.stats[3].base_stat);
  const startTime = Date.now();

  // Store the interval reference
  timeoutRefs[`${attacker.data.name}_interval`] = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const timeLeft = Math.max(0, 1 - (elapsed / attackTime));
    updateTimer(attacker.data.name, timeLeft);
  }, 50);

  timeoutRefs[attacker.data.name] = setTimeout(async () => {
    clearInterval(timeoutRefs[`${attacker.data.name}_interval`]);
    
    if (attacker.hp <= 0) {
      updateTimer(attacker.data.name, 0);
      return;
    }
    
    // Filter out the attacker itself from valid targets if they're the same Pokemon
    const validDefenders = defenders.filter(d => 
      d && 
      d.hp > 0 && 
      !(isPlayerParty && d === attacker) // Ensure we don't target ourselves
    );

    if (validDefenders.length === 0) {
      const fightOver = checkIfFightOver(game.party, enemyParty);
      setFightStatus(fightOver);
      updateTimer(attacker.data.name, 0);
      return;
    }

    const target = validDefenders[Math.floor(Math.random() * validDefenders.length)];
    if (!target) return;
    
    const pokemonFainted = await executeAttack(attacker, target, game);
    setGame({...game});
    setFightLogUpdate(prev => prev + 1);
    
    if (pokemonFainted) {
      const fightOver = checkIfFightOver(game.party, enemyParty);
      if (fightOver !== "fighting") {
        setFightStatus(fightOver);
        Object.keys(timeoutRefs).forEach(key => {
          clearTimeout(timeoutRefs[key]);
          clearInterval(timeoutRefs[key]);
        });
        updateTimer(attacker.data.name, 0);
        return;
      }
    }
    
    startAttackLoop(attacker, defenders, enemyParty, game, timeoutRefs, setFightStatus, setFightLogUpdate, setGame, isPlayerParty, updateTimer);
  }, attackTime);
}

export async function newLocalMon(pokemon: Pokemon) {
  return {
    data: pokemon,
    hp: getMaxHP(pokemon.stats[0].base_stat, 5),
    level: 5,
    move: await getRandomMove(pokemon)
  }
}

export function checkIfFightOver(party: PartySlot[], enemyParty: LocalMon[]) {
  if (enemyParty.every(mon => mon.hp <= 0)) {
    return "Won";
  }
  if (party.every(slot => !slot.pokemon || slot.pokemon.hp <= 0)) {
    return "Lost";
  }
  return "fighting";
}
