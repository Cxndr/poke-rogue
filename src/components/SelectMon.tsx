import Image from "next/image";
import { GameState, ProperName, LocalMon, resetHP } from "@/lib/gameState";
import { useEffect } from "react";

type SelectMonProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  selection: LocalMon[];
}

export default function SelectMon({game, setGame, selection}: SelectMonProps) {

  useEffect(() => {
    for (const mon of selection) {
      resetHP(mon);
    }
  }, [selection]);
  
  async function selectMonClick (pokemon: LocalMon) {
    const newGame = { ...game };
    // Find first empty slot
    const emptySlot = newGame.party.find(slot => slot.pokemon === null);
    if (emptySlot) {
      emptySlot.pokemon = pokemon;
    } else {
      newGame.pokemonStorage.push(pokemon);
    }
    setGame({
      ...newGame,
      currentState: "upgrade"
    });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2>Select a Pokemon to add to your party:</h2>
      <div className="flex flex-row gap-4">
      {selection.map((option, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <Image src={option.data.sprites.front_default ?? ""} alt={option.data.name} width={96} height={96} />
          <p>{ProperName(option.data.name)}</p>
          <p>{ProperName(option.move.name)}</p>
          <button onClick={() => selectMonClick(option)} className="mt-4">
            Select
          </button>
        </div>
      ))}
      </div>
    </div>
  );
}