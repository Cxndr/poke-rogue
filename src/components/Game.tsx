"use client"

import { useState } from "react";

import { gameState, GameState, startingMons } from "@/lib/gameState";
import SelectMon from "./SelectMon";
import Setup from "./Setup";
import FightLoad from "./FightLoad";
import Upgrade from "./upgrade";

export default function Game() {

  const [game, setGame] = useState<GameState>(gameState);

    return (
      <div className="h-full w-full flex items-center justify-center">
        
        {game.currentState === "startGame" && (
          <SelectMon game={game} setGame={setGame} selection={startingMons} />
        )}

        {game.currentState === "setup" && (
          <Setup game={game} setGame={setGame} />
        )}

        {game.currentState === "fight" && (
          <FightLoad game={game} setGame={setGame} />
        )}

        {game.currentState === "upgrade" && (
          <Upgrade game={game} setGame={setGame} />
        )}

      </div>
    )
}