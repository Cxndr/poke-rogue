import { GameState, getEnemyParty, LocalMon } from "@/lib/gameState";
import { useState } from "react";
import Fight from "./Fight";
import { DotLoader } from "react-spinners";

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
    let enemyCount = 3;
    if (game.round === 1) enemyCount = 1;
    if (game.round === 2) enemyCount = 2;
    const enemyParty = await getEnemyParty(game.round*5, enemyCount, game.round);
    setEnemyParty(enemyParty);
    setEnemyLoaded(true);
  }

  if (!enemyFetched) {
    fetchEnemyParty();
    setEnemyFetched(true);
  }

  return (
    <div className="h-full w-full p-8 flex items-center justify-center">
      { enemyLoaded 
        ? <Fight game={game} setGame={setGame} enemyParty={enemyParty} setMonSelection={setMonSelection} />
        : <div className="
            flex flex-col items-center justify-center gap-4
          bg-zinc-50/30 backdrop-blur-xl p-8 rounded-3xl
            shadow-md shadow-zinc-500/40
          ">
            <DotLoader color="oklch(63.7% 0.237 25.331)" loading={true} size={50} />
            <p className="text-red-500/80">Loading...</p>
          </div>
      }
    </div>
  );
}
