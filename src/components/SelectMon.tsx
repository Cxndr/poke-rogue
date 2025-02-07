import { useState } from "react";
import Image from "next/image";
import { Pokemon } from "pokenode-ts";
import { GameState, getRandomMove, getMaxHP, ProperName } from "@/lib/gameState";

type SelectMonProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  selection: Pokemon[];
}

export default function SelectMon({game, setGame, selection}: SelectMonProps) {

  const [options] = useState<Pokemon[]>(selection);
  
  async function selectMonClick (pokemon: Pokemon) {
    const move = await getRandomMove(pokemon);
    setGame({
      ...game,
      party: [...game.party, {data: pokemon, level: 5, move: move, hp: getMaxHP(pokemon.stats[0].base_stat, 5)}],
      currentState: "setup"
    });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2>Select your starting Pokemon</h2>
      <div className="flex flex-row gap-4">
      {options.map((option, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <Image src={option.sprites.front_default ?? ""} alt={option.name} width={96} height={96} />
          <p className="mb-4">{ProperName(option.name)}</p>
          <button onClick={() => selectMonClick(option)}>Select</button>
        </div>
      ))}
      </div>
    </div>
  );
}