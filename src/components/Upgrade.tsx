import { GameState } from "@/lib/gameState";
import { Upgrade as UpgradeType, getRandomUpgrades } from "@/lib/upgrades";
import { useState, useEffect } from "react";

type UpgradeProps = {
  game: GameState;
  setGame: (game: GameState) => void;
}

export default function Upgrade({game, setGame}: UpgradeProps) {
  const [upgrades, setUpgrades] = useState<UpgradeType[]>([]);

  useEffect(() => {
    setUpgrades(getRandomUpgrades(3));
  }, []);

  const handleUpgradeSelect = async (upgrade: UpgradeType) => {
    await upgrade.execute(game);
    setGame({...game, currentState: "setup"});
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Choose an upgrade!</h1>
      <div className="grid grid-cols-3 gap-4">
        {upgrades.map((upgrade, index) => (
          <button
            key={index}
            onClick={() => handleUpgradeSelect(upgrade)}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <h3 className="font-bold">{upgrade.name}</h3>
            <p>{upgrade.description}</p>
          </button>
        ))}
      </div>  
    </div>
  );
}