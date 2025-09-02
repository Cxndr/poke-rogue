"use client"

import { useEffect, useState } from "react";
import { gameState, GameState, LocalMon } from "@/lib/gameState";
import SelectMon from "./SelectMon";
import Setup from "./Setup";
import FightLoad from "./FightLoad";
import Upgrade from "./Upgrade";
import StartGame from "./StartGame";
import NewEvolutions from "./NewEvolutions";
import { initializeGame } from "@/lib/upgrades";
import RunWin from "./RunWin";


export default function Game() {

  useEffect(() => {
    initializeGame();
  }, []);

  const [game, setGame] = useState<GameState>(gameState);
  const [monSelection, setMonSelection] = useState<LocalMon[]>([]);

  // When returning to start screen (e.g., after a loss), clear any cached
  // selection so starters are fetched fresh rather than showing old enemy party
  useEffect(() => {
    if (game.currentState === "startGame") {
      setMonSelection([]);
    }
  }, [game.currentState]);

    return (
      <div className="h-full w-full flex items-center justify-center">

        {game.newEvolutions.length > 0 ?   (
          <NewEvolutions game={game} setGame={setGame} />
        ) : (
          <>

            {game.currentState === "runWin" && (
              <RunWin game={game} setGame={setGame} setMonSelection={setMonSelection} />
            )}

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
            
          </>
        )}

      </div>
    )
}
