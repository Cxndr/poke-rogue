import { GameState } from "@/lib/gameState";
import { Item } from "@/lib/upgrades";
import { DragEvent } from "react";
import Image from "next/image";

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
          <div
            key={`${item.id}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="flex flex-col items-center p-2 bg-zinc-100 text-zinc-900 rounded cursor-move hover:bg-zinc-50"
          >
            <Image src={item.sprite} alt={item.name} width={32} height={32} />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 