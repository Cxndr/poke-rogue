import { GameState, getEnemyParty, LocalMon } from "@/lib/gameState";
import { useState } from "react";
import Fight from "./Fight";

type FightLoadProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  setMonSelection: (mon: LocalMon[]) => void;
}

export default function FightLoad({game, setGame, setMonSelection}: FightLoadProps) {

  const [enemyParty, setEnemyParty] = useState<LocalMon[]>([]);
  const [enemyFetched, setEnemyFetched] = useState(false);
  const [enemyLoaded, setEnemyLoaded] = useState(false);

  async function fetchEnemyParty() {
    const enemyParty = await getEnemyParty(game.round*5, 3);
    setEnemyParty(enemyParty);
    setEnemyLoaded(true);
    setMonSelection(enemyParty);
  }

  if (!enemyFetched) {
    fetchEnemyParty();
    setEnemyFetched(true);
  }

  return (
    <div className="h-full w-full p-8 flex items-center justify-center">
      { enemyLoaded 
        ? <Fight game={game} setGame={setGame} enemyParty={enemyParty} />
        : <div>Loading...</div>
      }
    </div>
  );
}