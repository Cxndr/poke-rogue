import { GameState, LocalMon } from "@/lib/gameState";
import { DragEvent } from "react";
import HeaderPanel from "./HeaderPanel";
import MonCard from "./MonCard";

type PokemonStorageProps = {
  game: GameState;
  onDrop: (e: DragEvent<HTMLDivElement>, storageIndex: number) => void;
}

export default function PokemonStorage({ game, onDrop }: PokemonStorageProps) {
  const handleDragStart = (e: DragEvent, pokemon: LocalMon, index: number) => {
    e.dataTransfer.setData("pokemon", JSON.stringify({
      storageIndex: index,
      isFromStorage: true
    }));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent, index: number) => {
    onDrop(e as DragEvent<HTMLDivElement>, index);
  };

  return (
    <div className="flex flex-col items-center gap-0">
      <HeaderPanel className="-z-10">
        <h3>Pokemon Storage</h3>
      </HeaderPanel>
      <div 
        className="
          grid grid-cols-6 gap-2 p-4 rounded-2xl
          bg-linear-150 from-green-500 from-10% to-green-600 to-90%
          shadow-md shadow-zinc-900/30
          min-w-lg
        "
      >
        {game.pokemonStorage.map((pokemon, index) => (
          <div 
            key={index} 
            className={`
              flex flex-col items-center p-2 
              cursor-pointer
            `}
            draggable
            onDragStart={(e) => handleDragStart(e, pokemon, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <MonCard
              key={`${pokemon.data.id}-${index}`}
              mon={pokemon}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 