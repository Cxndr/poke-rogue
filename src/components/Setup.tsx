import { GameState } from "@/lib/gameState";
import Party from "./Party";
type SetupProps = {
  game: GameState;
  setGame: (game: GameState) => void;
}


export default function Setup({game, setGame}: SetupProps) {



  return (
    <div className="h-full p-8 flex flex-col items-center justify-between gap-4">

      <h2>Round {game.round}</h2>

      <button onClick={() => setGame({...game, currentState: "fight"})}>Fight</button>

      <Party game={game} />

    </div>

  );
}