import { GameState } from "@/lib/gameState";
import Panel from "./Panel";

type RunWinProps = {
  game: GameState;
}

export default function RunWin({ game }: RunWinProps) {
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
    </div>
  );
}