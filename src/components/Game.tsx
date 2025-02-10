"use client"

import { useState, useEffect } from "react";

import { gameState, GameState, getStartingMons, LocalMon } from "@/lib/gameState";
import SelectMon from "./SelectMon";
import Setup from "./Setup";
import FightLoad from "./FightLoad";
import Upgrade from "./Upgrade";

export default function Game() {

  const [game, setGame] = useState<GameState>(gameState);
  const [monSelection, setMonSelection] = useState<LocalMon[]>([]);
  
  useEffect(() => {
    const loadStartingMons = async () => {
      const mons = await Promise.all(getStartingMons());
      setMonSelection(mons);
    };
    loadStartingMons();
  }, []);

    return (
      <div className="h-full w-full flex items-center justify-center">
        
        {game.currentState === "startGame" && (
          <SelectMon game={game} setGame={setGame} selection={monSelection} />
        )}

        {game.currentState === "setup" && (
          <Setup game={game} setGame={setGame} />
        )}

        {game.currentState === "fight" && (
          <FightLoad game={game} setGame={setGame} setMonSelection={setMonSelection} />
        )}

        {game.currentState === "selectMon" && (
          <SelectMon game={game} setGame={setGame} selection={monSelection} />
        )}

        {game.currentState === "upgrade" && (
          <Upgrade game={game} setGame={setGame} />
        )}

      </div>
    )
}