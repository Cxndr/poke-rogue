import { GameState, LocalMon, ProperName } from "@/lib/gameState";
import Image from "next/image";
import { DragEvent } from "react";

type PokemonStorageProps = {
  game: GameState;
  onDrop: (e: DragEvent<HTMLDivElement>, storageIndex: number) => void;
}

export default function PokemonStorage({ game, onDrop }: PokemonStorageProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, pokemon: LocalMon, index: number) => {
    e.dataTransfer.setData("pokemon", JSON.stringify({
      storageIndex: index,
      isFromStorage: true
    }));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <h3>Pokemon Storage</h3>
      <div className="grid grid-cols-6 gap-2 p-4 bg-gray-100 rounded-lg">
        {game.pokemonStorage.map((pokemon, index) => (
          <div
            key={`${pokemon.data.id}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, pokemon, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, index)}
            className="flex flex-col items-center p-2 bg-white rounded cursor-move hover:bg-gray-50"
          >
            <Image 
              src={pokemon.data.sprites.front_default ?? ""} 
              alt={pokemon.data.name} 
              width={48} 
              height={48} 
            />
            <span className="text-sm">{ProperName(pokemon.data.name)}</span>
            <span className="text-xs">Lvl {pokemon.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 