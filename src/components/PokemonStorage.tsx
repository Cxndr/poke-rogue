import { GameState, LocalMon } from "@/lib/gameState";
import { DragEvent } from "react";
import PokemonCard from "./PokemonCard";
import HeaderPanel from "./HeaderPanel";

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
          <PokemonCard
            key={`${pokemon.data.id}-${index}`}
            pokemon={pokemon}
            draggable
            onDragStart={(e) => handleDragStart(e, pokemon, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="cursor-move shadow-sm shadow-zinc-900/50"
            imageSize={48}
          />
        ))}
      </div>
    </div>
  );
} 