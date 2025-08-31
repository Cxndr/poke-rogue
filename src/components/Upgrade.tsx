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
      <h1 className="text-2xl font-bold">Choose an upgrade!</h1>
      <div className="grid grid-cols-3 gap-4">
        {upgrades.map((upgrade, index) => {
          if (upgrade.kind === "item") {
            return (
              <ItemCard
                key={index}
                item={upgrade.item}
                onClick={() => handleUpgradeSelect(upgrade)}
              />
            );
          }
          // event
          return (
            <EventCard
              key={index}
              event={upgrade}
              onClick={() => handleUpgradeSelect(upgrade)}
            />
          );
        })}
      </div>
    </Panel>
  );
}
