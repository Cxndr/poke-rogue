
import { Move, MoveClient, Pokemon, PokemonClient, Type, EvolutionClient, PokemonSpecies, EvolutionChain, ChainLink } from "pokenode-ts";
import { totalPokemon, maxRound, maxPartySize } from "./settings";
import { Item, Tool } from './upgrades';
const monApi = new PokemonClient();
const moveApi = new MoveClient();
const evoApi = new EvolutionClient();

export type LocalMon = {
  data: Pokemon;
  hp: number;
  level: number;
  move: Move;
  equippedTool?: Tool;
  speciesData: PokemonSpecies;
  evolutionData: EvolutionChain;
  statBoosts: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  }
}

export const blankStatBoosts = {
  hp: 0,
  attack: 0,
  defense: 0,
  spAttack: 0,
  spDefense: 0,
  speed: 0
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
  "gameOver" |
  "runWin";
  options: Pokemon[];
  round: Range<1, typeof maxRound>;
  fightLog: string[];
  inventory: Item[];
  pokemonStorage: LocalMon[];
  newEvolutions: {oldMonData: Pokemon, newMonData: Pokemon}[];
}

export function createInitialGameState(): GameState {
  return {
    party: Array(maxPartySize).fill(null).map((_, i) => ({ pokemon: null, index: i })),
    currentState: "startGame",
    options: [],
    round: 1,
    fightLog: [],
    inventory: [],
    pokemonStorage: [],
    newEvolutions: []
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

async function evolveSingleMon(mon: LocalMon) {
  // should we round down the evolution level to the nearest 5? - test
  let chainLink: ChainLink;
  if (mon.evolutionData.chain.species.name === mon.data.name) {
    chainLink = mon.evolutionData.chain;
  } else if (mon.evolutionData.chain.evolves_to[0].species.name === mon.data.name) {
    chainLink = mon.evolutionData.chain.evolves_to[0];
  } else return null;

  if (chainLink.evolves_to.length === 0) return null;

  const evolutionTrigger = chainLink.evolves_to[0].evolution_details[0].trigger.name;
  if (evolutionTrigger === "level-up" || evolutionTrigger === "trade") {
    if (mon.level >= chainLink.evolves_to[0].evolution_details[0].min_level!) {
      const newMon = await monApi.getPokemonByName(chainLink.evolves_to[0].species.name);
      const oldMonData = mon.data;
      const newMonData = newMon;
      mon.data = newMon;
      mon.speciesData = await monApi.getPokemonSpeciesById(newMon.id);
      const evolutionChainId = Number(mon.speciesData.evolution_chain.url.split("/").filter(Boolean).pop());
      mon.evolutionData = await evoApi.getEvolutionChainById(evolutionChainId);
      return {oldMonData, newMonData};
    }
  }
  // todo: evolution check for other evolution methods (stone, etc)
  return null;
}

export async function evolveMons(game: GameState) {
  for (const slot of game.party) {
    if (slot.pokemon) {
      const result = await evolveSingleMon(slot.pokemon);
      if (result) {
        game.newEvolutions.push(result);
      }
    }
  }
  for (const mon of game.pokemonStorage) {
    const result = await evolveSingleMon(mon);
    if (result) {
      game.newEvolutions.push(result);
    }
  }
}

export function clearNewEvolutions(game: GameState) {
  game.newEvolutions = [];
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
      clearNewEvolutions(updatedGameState);
      evolveMons(updatedGameState);
      setGame(updatedGameState);
    }
  } else if (result === "lost") {
    setGame(createInitialGameState());
  }
}

const startingMonNames = [
  "bulbasaur",
  "squirtle",
  "charmander",
  "pikachu",
  "eevee",
]

export async function getStartingMons() {
  const startingMons = await Promise.all(
    startingMonNames.map(name => monApi.getPokemonByName(name))
  );
  return Promise.all(startingMons.map(mon => newLocalMon(mon)));
}

export async function getRandomMove(pokemon: Pokemon) {

  const gen1Moves = pokemon.moves.filter((move) => 
    move.version_group_details.some((v) => 
      v.version_group.name === "red-blue"
    )
  );

  const moveDataPromises = gen1Moves.map(move => 
    moveApi.getMoveByName(move.move.name)
  );
  
  const movesData = await Promise.all(moveDataPromises);

  const validMoves = movesData.filter(move => move.power && move.power > 0);
  
  if (validMoves.length === 0) {
    return await moveApi.getMoveByName("struggle");
  }

  return validMoves[Math.floor(Math.random() * validMoves.length)];
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
  if (round === 1) {
    const monName = getMonFromChanceList(enemyMonsRound1);
    return await monApi.getPokemonByName(monName);
  } else if (round === 2) {
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
    const speciesData = await monApi.getPokemonSpeciesById(mon.id); 
    const evolutionChainId = Number(speciesData.evolution_chain.url.split("/").filter(Boolean).pop())
    const evolutionData = await evoApi.getEvolutionChainById(evolutionChainId);
    eParty.push({data: mon, level: level, move: move, hp: getMaxHP(mon.stats[0].base_stat, level), speciesData: speciesData, evolutionData: evolutionData, statBoosts: blankStatBoosts});
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
  
  const isSpecial = move.damage_class?.name === "special";
  const A = isSpecial ? attacker.data.stats[3].base_stat : attacker.data.stats[1].base_stat;
  const D = isSpecial ? target.data.stats[4].base_stat : target.data.stats[2].base_stat;
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
    typeEffectiveness: (Type1 * Type2) <= 1 ? "normal" : (Type1 * Type2) >= 2 ? "super effective" : "not very effective"
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
  const speciesData = await monApi.getPokemonSpeciesById(pokemon.id);
  console.log("SPECIES DATA FOR:", pokemon.name, speciesData);
  const evolutionChainId = Number(speciesData.evolution_chain.url.split("/").filter(Boolean).pop())
  const evolutionData = await evoApi.getEvolutionChainById(evolutionChainId);

  return {
    data: pokemon,
    hp: getMaxHP(pokemon.stats[0].base_stat, 5),
    level: 5,
    move: await getRandomMove(pokemon),
    statBoosts: blankStatBoosts,
    speciesData: speciesData,
    evolutionData: evolutionData
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
