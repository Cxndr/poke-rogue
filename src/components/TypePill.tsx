import { pokemonTypeColors } from "@/lib/colors";

type TypePillProps = {
  type: string;
  className?: string;
}

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Map color names to full Tailwind class names
const getTypeColorClass = (type: string): string => {
  const colorMap: Record<string, string> = {
    "Normal": "bg-gray-400",
    "Fire": "bg-red-500",
    "Water": "bg-blue-500",
    "Electric": "bg-yellow-400",
    "Grass": "bg-green-500",
    "Ice": "bg-cyan-300",
    "Fighting": "bg-orange-700",
    "Poison": "bg-purple-600",
    "Ground": "bg-yellow-700",
    "Flying": "bg-sky-400",
    "Psychic": "bg-pink-500",
    "Bug": "bg-lime-500",
    "Rock": "bg-amber-600",
    "Ghost": "bg-indigo-700",
    "Dragon": "bg-violet-600",
    "Dark": "bg-neutral-800",
    "Steel": "bg-zinc-500",
    "Fairy": "bg-rose-300",
  };
  
  return colorMap[capitalizeFirst(type)] || "bg-gray-400";
};

export default function TypePill({ type, className = "" }: TypePillProps) {
  const capitalizedType = capitalizeFirst(type);
  const colorClass = getTypeColorClass(type);
  
  return (
    <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium text-white ${colorClass} ${className}`}>
      {capitalizedType}
    </div>
  );
} 