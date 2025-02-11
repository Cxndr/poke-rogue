import { GameState } from "@/lib/gameState";
import { Item } from "@/lib/upgrades";
import Party from "./Party";
import Inventory from "./Inventory";
import { DragEvent } from "react";

type SetupProps = {
  game: GameState;
  setGame: (game: GameState) => void;
}

export default function Setup({game, setGame}: SetupProps) {
  const handleDrop = async (e: DragEvent, pokemonIndex: number) => {
    e.preventDefault();
    const item: Item = JSON.parse(e.dataTransfer.getData("item"));
    const pokemon = game.party[pokemonIndex];

    try {
      if (item.type === "tool") {
        // Remove old tool if exists
        if (pokemon.equippedTool?.type === "tool") {
          pokemon.equippedTool.unequip(pokemon);
        }
        pokemon.equippedTool = item;
        item.effect(pokemon);
      } else {
        await item.use(pokemon);
        // Remove consumed item from inventory
        const itemIndex = game.inventory.findIndex(i => i.id === item.id);
        game.inventory.splice(itemIndex, 1);
      }

      setGame({...game});
    } catch (error) {
      // Show error message to user
      alert(error.message);
    }
  };

  return (
    <div className="h-full p-8 flex flex-col items-center justify-between gap-4">
      <h2>Round {game.round}</h2>
      <Inventory game={game} setGame={setGame} />
      <Party game={game} onDrop={handleDrop} />
      <button onClick={() => setGame({...game, currentState: "fight"})}>
        Fight
      </button>
    </div>
  );
}