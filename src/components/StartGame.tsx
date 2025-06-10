import { GameState, getStartingMons, LocalMon } from "@/lib/gameState";
import { useEffect, useState } from "react";
import SelectMon from "./SelectMon";

type StartGameProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  monSelection: LocalMon[];
  setMonSelection: (mons: LocalMon[]) => void;
}

export default function StartGame({game, setGame, monSelection, setMonSelection}: StartGameProps) {

  const [beginGame, setBeginGame] = useState(false);

  useEffect(() => {
    const loadStartingMons = async () => {
      const mons = await getStartingMons();
      setMonSelection(mons);
    };
    loadStartingMons();
  }, [setMonSelection]);

  return (
    <>
      
      {beginGame ? (
        <SelectMon game={game} setGame={setGame} selection={monSelection} />
      ) : (
        <div>
          <button onClick={() => setBeginGame(true)}>Start Run</button>
        </div>
      )}
    </>
  );
}