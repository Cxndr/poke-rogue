import { GameState } from "@/lib/gameState";

type RunWinProps = {
  game: GameState;
}

export default function RunWin({ game }: RunWinProps) {
  return (
    <div>
      <h1>YOU WIN!</h1>
      <div className="flex flex-row gap-2">
        {game.party.map((slot, index) => (
          <div key={index} className="flex flex-col items-center">
            <h2>{slot.pokemon?.data.name}</h2>
            <p>Level: {slot.pokemon?.level}</p>
          </div>
        ))}
      </div>
      {/* Show the player their stats for the run */}
    </div>
  );
}