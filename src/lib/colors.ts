import { capitalizeFirst } from "./utils";

export const pokemonTypeColors: Record<string, string> = {
    Normal: "gray-400",
    Fire: "red-500",
    Water: "blue-500",
    Electric: "yellow-400",
    Grass: "green-500",
    Ice: "cyan-300",
    Fighting: "orange-700",
    Poison: "purple-600",
    Ground: "yellow-700",
    Flying: "sky-400",
    Psychic: "pink-500",
    Bug: "lime-500",
    Rock: "amber-600",
    Ghost: "indigo-700",
    Dragon: "violet-600",
    Dark: "neutral-800",
    Steel: "zinc-500",
    Fairy: "rose-300",
  };

export const getTypeColorClass = (type: string): string => {
  const colorKey = capitalizeFirst(type);
  const color = pokemonTypeColors[colorKey];
  return color ? `${color}` : "gray-400";
};