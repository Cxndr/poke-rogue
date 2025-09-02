import { GameState, createInitialGameState, getStartingMons, LocalMon } from "@/lib/gameState";
import Panel from "./Panel";
import Button from "./Button";
import { useState } from "react";

type RunWinProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  setMonSelection: (mons: LocalMon[]) => void;
}

export default function RunWin({ game, setGame, setMonSelection }: RunWinProps) {
  const [loading, setLoading] = useState(false);

  async function handlePlayAgain() {
    try {
      setLoading(true);
      const starters = await getStartingMons();
      setMonSelection(starters);
      const newGame = createInitialGameState();
      setGame({ ...newGame, currentState: "selectMon" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-300/30 backdrop-blur-xl rounded-3xl p-4">
      <h1>YOU WIN!</h1>
      <Panel className="flex flex-row gap-2">
        {game.party.map((slot, index) => (
          <div 
            key={index} 
            className="
              flex flex-col items-center 
              bg-zinc-50 p-4 rounded-2xl
            "
          >
            <h2>{slot.pokemon?.data.name}</h2>
            <p>Level: {slot.pokemon?.level}</p>
          </div>
        ))}
      </Panel>
      {/* Show the player their stats for the run */}
      <Button onClick={handlePlayAgain} disabled={loading}>
        Play Again
      </Button>
    </div>
  );
}
