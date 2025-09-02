import { Pokemon } from "pokenode-ts";

export type StatName = "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed";

export function getStatBase(pokemon: Pokemon, stat: StatName): number {
  const s = pokemon.stats.find((p) => p.stat.name === stat);
  return s ? s.base_stat : 0;
}

export function setStatBase(pokemon: Pokemon, stat: StatName, value: number): void {
  const s = pokemon.stats.find((p) => p.stat.name === stat);
  if (s) s.base_stat = value;
}

