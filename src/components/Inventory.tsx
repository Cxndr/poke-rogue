import { GameState } from "@/lib/gameState";
import { Item } from "@/lib/upgrades";
import { DragEvent } from "react";
import ItemCard from "./ItemCard";
import HeaderPanel from "./HeaderPanel";

type InventoryProps = {
  game: GameState;
}

export default function Inventory({ game }: InventoryProps) {
  const handleDragStart = (e: DragEvent, item: Item) => {
    e.dataTransfer.setData("item", JSON.stringify({
      id: item.id,
      type: item.type
    }));
  };

  return (
    <div className="flex flex-col items-center gap-0">
      <HeaderPanel className="-z-10">
        <h3>Inventory</h3>
      </HeaderPanel>
      <div 
        className="
        grid grid-cols-6 gap-2 p-4 rounded-2xl 
        bg-linear-150 from-sky-300 from-10% to-sky-400 to-90%
        shadow-md shadow-zinc-900/30
        min-w-lg
        "
      >
        {game.inventory.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className="
              hover:drop-shadow-xl/30
              hover:scale-105
              transition-all duration-300
              relative
            "
          >
            <ItemCard
              item={item}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="cursor-move"
            />
          </div>          
        ))}
      </div>
    </div>
  );
} 