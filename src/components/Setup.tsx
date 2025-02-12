import { GameState } from "@/lib/gameState";
import Party from "./Party";
import Inventory from "./Inventory";
import PokemonStorage from "./PokemonStorage";
import { DragEvent } from "react";

type SetupProps = {
  game: GameState;
  setGame: (game: GameState) => void;
}

export default function Setup({game, setGame}: SetupProps) {
  const handleItemDrop = async (e: DragEvent, pokemonIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("item");
    if (!data) return; // Not an item drop

    const droppedItemData = JSON.parse(data);
    
    // Look up the actual item from the inventory using the id
    const item = game.inventory.find(i => i.id === droppedItemData.id);
    if (!item) {
      console.error("Item not found in inventory");
      return;
    }

    const partySlot = game.party[pokemonIndex];

    try {
      if (item.type === "tool") {
        // Remove old tool if exists
        if (partySlot.pokemon?.equippedTool?.type === "tool") {
          partySlot.pokemon?.equippedTool.unequip(partySlot.pokemon);
        }
        if (partySlot.pokemon) {
          partySlot.pokemon.equippedTool = item;
          item.effect(partySlot.pokemon);
        }
      } else {
        if (partySlot.pokemon) {
          await item.use(partySlot.pokemon);
          // Remove consumed item from inventory
          const itemIndex = game.inventory.findIndex(i => i.id === item.id);
          game.inventory.splice(itemIndex, 1);
        }
      }

      setGame({...game});
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handlePokemonDrop = (e: DragEvent, targetIndex: number, isStorageTarget: boolean) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("pokemon");
    if (!data) return;

    const { partyIndex, storageIndex, isFromStorage } = JSON.parse(data);
    
    const newGame = { ...game };

    if (isFromStorage) {
      // Moving from storage to party
      if (!isStorageTarget) {
        const [pokemon] = newGame.pokemonStorage.splice(storageIndex, 1);
        // Swap with existing party pokemon if it exists
        if (newGame.party[targetIndex].pokemon) {
          newGame.pokemonStorage.push(newGame.party[targetIndex].pokemon!);
        }
        newGame.party[targetIndex].pokemon = pokemon;
      }
      // Moving within storage
      else if (isStorageTarget) {
        const [pokemon] = newGame.pokemonStorage.splice(storageIndex, 1);
        newGame.pokemonStorage.splice(targetIndex, 0, pokemon);
      }
    } else {
      // Moving from party to storage
      if (isStorageTarget) {
        const pokemon = newGame.party[partyIndex].pokemon!;
        newGame.party[partyIndex].pokemon = null;
        newGame.pokemonStorage.splice(targetIndex, 0, pokemon);
      }
      // Moving within party
      else {
        const pokemon = newGame.party[partyIndex].pokemon;
        const targetPokemon = newGame.party[targetIndex].pokemon;
        newGame.party[partyIndex].pokemon = targetPokemon;
        newGame.party[targetIndex].pokemon = pokemon;
      }
    }

    setGame(newGame);
  };

  return (
    <div className="h-full p-8 flex flex-col items-center justify-between gap-4">
      <h2>Round {game.round}</h2>
      <Inventory game={game} setGame={setGame} />
      <Party 
        game={game} 
        onDrop={(e, index) => {
          const itemData = e.dataTransfer.getData("item");
          if (itemData) {
            handleItemDrop(e, index);
          } else {
            handlePokemonDrop(e, index, false);
          }
        }} 
      />
      <PokemonStorage 
        game={game} 
        onDrop={(e, index) => handlePokemonDrop(e, index, true)} 
      />
      <button 
        onClick={() => setGame({...game, currentState: "fight"})}
        disabled={game.party.length === 0}
        className={`px-4 py-2 rounded ${game.party.length === 0 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        Fight
      </button>
    </div>
  );
}