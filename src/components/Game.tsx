"use client"

import { useState } from "react";

import { gameState, GameState, LocalMon } from "@/lib/gameState";
import SelectMon from "./SelectMon";
import Setup from "./Setup";
import FightLoad from "./FightLoad";
import Upgrade from "./Upgrade";
import StartGame from "./StartGame";
export default function Game() {

  const [game, setGame] = useState<GameState>(gameState);
  const [monSelection, setMonSelection] = useState<LocalMon[]>([]);

    return (
      <div className="h-full w-full flex items-center justify-center">
        
        {game.currentState === "startGame" && (
          <StartGame game={game} setGame={setGame} monSelection={monSelection} setMonSelection={setMonSelection} />
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