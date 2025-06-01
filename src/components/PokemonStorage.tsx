import { GameState, LocalMon } from "@/lib/gameState";
import { DragEvent } from "react";
import PokemonCard from "./PokemonCard";

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
    <div>
      <h3>Pokemon Storage</h3>
      <div className="grid grid-cols-6 gap-2 p-4 bg-zinc-300 rounded-lg">
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