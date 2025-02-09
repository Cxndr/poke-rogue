import { GameState } from "@/lib/gameState";

type UpgradeProps = {
  game: GameState;
  setGame: (game: GameState) => void;
}

export default function Upgrade({game, setGame}: UpgradeProps) {

  

  return (
    <div>
      <h1>Choose an upgrade!</h1>
      <div>
        <button>
          
        </button>
      </div>
    </div>
  )
}