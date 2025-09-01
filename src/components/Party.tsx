import { GameState } from "@/lib/gameState";
import { ProperName } from "@/lib/utils";
import Panel from "./Panel";
import HeaderPanel from "./HeaderPanel";
import MonCard from "./MonCard";
import Button from "./Button";

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
              flex flex-col items-center justify-center
              cursor-pointer 
              hover:drop-shadow-xl/30
              hover:scale-105
              transition-all duration-300
            "
            draggable={!!slot.pokemon}
            onDragStart={(e) => handleDragStart(e, slot.index)}
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, slot.index)}
          >
            {slot.pokemon ? (
              <>
                <MonCard mon={slot.pokemon}>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">
                    {slot.pokemon.equippedTool ? ProperName(slot.pokemon.equippedTool.name) : "No item"}
                  </p>
                  {slot.pokemon.equippedTool && onRemoveTool && (
                    <Button 
                      onClick={() => onRemoveTool(slot.index)}
                      className="text-xs !px-3 !py-1.5"
                    >
                      Remove Tool
                    </Button>
                  )}
                </div>
                </MonCard>
              </>
            ) : (
              <div 
                className="
                  w-48 min-h-0
                  flex flex-1 items-center justify-center 
                  
                  text-zinc-950/50 bg-zinc-50/50
                  rounded-3xl
                  select-none
                  p-4
                "
              >
                Empty
              </div>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}