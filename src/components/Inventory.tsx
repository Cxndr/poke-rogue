import { GameState } from "@/lib/gameState";
import { Item } from "@/lib/upgrades";
import { DragEvent } from "react";
import Image from "next/image";

type InventoryProps = {
  game: GameState;
  setGame: (game: GameState) => void;
}

export default function Inventory({ game, setGame }: InventoryProps) {
  const handleDragStart = (e: DragEvent, item: Item) => {
    e.dataTransfer.setData("item", JSON.stringify({
      id: item.id,
      type: item.type
    }));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3>Inventory</h3>
      <div className="grid grid-cols-6 gap-2 p-4 bg-gray-100 rounded-lg">
        {game.inventory.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="flex flex-col items-center p-2 bg-white rounded cursor-move hover:bg-gray-50"
          >
            <Image src={item.sprite} alt={item.name} width={32} height={32} />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 