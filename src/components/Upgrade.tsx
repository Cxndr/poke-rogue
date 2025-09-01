import { GameState } from "@/lib/gameState";
import { Upgrade as UpgradeType, getRandomUpgrades } from "@/lib/upgrades";
import { useState, useEffect } from "react";
import Panel from "./Panel";
import ItemCard from "./ItemCard";
import EventCard from "./EventCard";

type UpgradeProps = {
  game: GameState;
  setGame: (game: GameState) => void;
}

export default function Upgrade({game, setGame}: UpgradeProps) {
  const [upgrades, setUpgrades] = useState<UpgradeType[]>([]);

  useEffect(() => {
    setUpgrades(getRandomUpgrades(3, game));
  }, [game]);

  const handleUpgradeSelect = async (upgrade: UpgradeType) => {
    await upgrade.execute(game);
    setGame({...game, currentState: "setup"});
  };

  return (
    <Panel className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Choose One:</h1>
      <div className="grid grid-cols-3 gap-4">
        {upgrades.map((upgrade, index) => (
          <div
            key={index} 
            onClick={() => handleUpgradeSelect(upgrade)} 
            className="
              flex items-center justify-center
              bg-indigo-200 rounded-[30px]
              shadow-sm shadow-zinc-900/50
              overflow-hidden
              hover:scale-105 hover:shadow-md
              transition-all duration-300
            "
          >
            {upgrade.kind === "item" ? (
              <div className="p-2">
                <ItemCard item={upgrade.item} />
              </div>
            ) : (
              <EventCard event={upgrade} />
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
