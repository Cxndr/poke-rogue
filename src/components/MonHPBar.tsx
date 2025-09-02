import { LocalMon, getMonMaxHP } from "@/lib/gameState"

type MonHPBarTypes = {
  pokemon: LocalMon,
}

export default function MonHPBar({pokemon}: MonHPBarTypes) {
  const hpPercent = Math.round(pokemon.hp / getMonMaxHP(pokemon) * 100)
  
  // Use a conditional to determine the complete class name
  const barColor = hpPercent < 21 
    ? "bg-red-500" 
    : hpPercent < 41 
      ? "bg-orange-500" 
      : "bg-green-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div 
        className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${hpPercent}%`}}
      ></div>
    </div>
  )
}
