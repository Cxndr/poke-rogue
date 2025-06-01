import { GameState } from "@/lib/gameState";
import { Item } from "@/lib/upgrades";
import { DragEvent } from "react";
import ItemCard from "./ItemCard";

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
    <div className="flex flex-col items-center gap-4">
      <h3>Inventory</h3>
      <div className="grid grid-cols-6 gap-2 p-4 bg-zinc-300 rounded-lg">
        {game.inventory.map((item, index) => (
          <ItemCard
            key={`${item.id}-${index}`}
            item={item}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="cursor-move shadow-sm shadow-zinc-900/50"
          />
        ))}
      </div>
    </div>
  );
} 