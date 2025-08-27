import { GameState, getMaxHP } from "@/lib/gameState";
import { ProperName } from "@/lib/utils";
import Image from "next/image";
import Panel from "./Panel";
import HeaderPanel from "./HeaderPanel";

type PartyProps = {
  game: GameState;
  onDrop: (e: React.DragEvent<HTMLDivElement>, pokemonIndex: number) => void;
  onRemoveTool?: (pokemonIndex: number) => void;
}

export default function Party({game, onDrop, onRemoveTool}: PartyProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("pokemon", JSON.stringify({
      partyIndex: index,
      isFromStorage: false
    }));
  };

  // Handle dragover to allow dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>

      <HeaderPanel>
        <h3>Active Party</h3>
      </HeaderPanel>
      
      <Panel className="flex flex-row gap-4 justify-center items-center">
        {game.party.map((slot) => (
          <div 
            key={slot.index} 
            className="
              flex flex-col items-center justify-center p-2 
              border-2 border-dashed border-gray-300 
              bg-zinc-50
              rounded-lg
              cursor-pointer 
              hover:border-blue-500
            "
            draggable={!!slot.pokemon}
            onDragStart={(e) => handleDragStart(e, slot.index)}
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, slot.index)}
          >
            {slot.pokemon ? (
              <>
                <Image 
                  src={slot.pokemon.data.sprites.front_default ?? ""} 
                  alt={slot.pokemon.data.name} 
                  width={96} 
                  height={96} 
                />
                <p>{ProperName(slot.pokemon.data.name)}</p>
                <p>{ProperName(slot.pokemon.move.name)}</p>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">
                    {slot.pokemon.equippedTool ? ProperName(slot.pokemon.equippedTool.name) : "No item"}
                  </p>
                  {slot.pokemon.equippedTool && onRemoveTool && (
                    <button 
                      onClick={() => onRemoveTool(slot.index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove Tool
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 text-right">
                  <span>Lvl: </span><span>{slot.pokemon.level}</span>
                  <span>HP:  </span><span>{getMaxHP(slot.pokemon.data.stats[0].base_stat, slot.pokemon.level)}</span>
                  <span>Atk: </span><span>{slot.pokemon.data.stats[1].base_stat}</span>
                  <span>Def: </span><span>{slot.pokemon.data.stats[2].base_stat}</span>
                  <span>SpA: </span><span>{slot.pokemon.data.stats[3].base_stat}</span>
                  <span>SpD: </span><span>{slot.pokemon.data.stats[4].base_stat}</span>
                  <span>Spd: </span><span>{slot.pokemon.data.stats[5].base_stat}</span>
                </div>
              </>
            ) : (
              <div className="w-24 h-24 flex items-center justify-center text-gray-400">
                Empty Slot
              </div>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}