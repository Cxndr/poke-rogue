import { useState } from "react";
import Image from "next/image";
import { GameState, ProperName, LocalMon } from "@/lib/gameState";

type SelectMonProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  selection: LocalMon[];
}

export default function SelectMon({game, setGame, selection}: SelectMonProps) {

  const [options] = useState<LocalMon[]>(selection);
  
  async function selectMonClick (pokemon: LocalMon) {
    setGame({
      ...game,
      party: [...game.party, pokemon],
      currentState: "upgrade"
    });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2>Select a Pokemon to add to your party:</h2>
      <div className="flex flex-row gap-4">
      {options.map((option, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <Image src={option.data.sprites.front_default ?? ""} alt={option.data.name} width={96} height={96} />
          <p>{ProperName(option.data.name)}</p>
          <p>{ProperName(option.move.name)}</p>
          <button onClick={() => selectMonClick(option)} className="mb-4">
            Select
          </button>
        </div>
      ))}
      </div>
    </div>
  );
}