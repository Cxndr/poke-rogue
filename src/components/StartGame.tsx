import { GameState, getStartingMons, LocalMon } from "@/lib/gameState";
import { useState, useEffect } from "react";
import SelectMon from "./SelectMon";
import Panel from "./Panel";
import Button from "./Button";
import Image from "next/image";
import Logo from "./Logo";

type StartGameProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  monSelection: LocalMon[];
  setMonSelection: (mons: LocalMon[]) => void;
}

export default function StartGame({game, setGame, monSelection, setMonSelection}: StartGameProps) {

  const [beginGame, setBeginGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load Pokemon data in background when component mounts
  useEffect(() => {
    const loadStartingMons = async () => {
      // Only load if we don't already have data
      if (monSelection.length === 0) {
        const mons = await getStartingMons();
        setMonSelection(mons);
        setDataLoaded(true);
      } else {
        // Data is already loaded (cached)
        setDataLoaded(true);
      }
    };
    loadStartingMons();
  }, [setMonSelection, monSelection.length]);

  // Watch for dataLoaded changes to turn off loading spinner
  useEffect(() => {
    if (dataLoaded && loading) {
      setLoading(false);
    }
  }, [dataLoaded, loading]);

  const handleStartRun = async () => {
    setBeginGame(true);
    
    // If data isn't loaded yet, show spinner
    if (!dataLoaded) {
      setLoading(true);
    }
  };

  return (
    <>
      
      {beginGame ? (
        <SelectMon game={game} setGame={setGame} selection={monSelection} loading={loading} />
      ) : (
        <Panel>
          <div className="flex flex-row items-stretch gap-4 w-xl h-fit">

            <div className="w-3/4 inline-flex flex-col justify-around items-center gap-6">
              <Logo/>
              <p className="text-center">Poke Rogue is a roguelike auto-battler where you assemble and upgrade a team of pokemon through a series of 10 random battles.</p>
              <Button onClick={handleStartRun} className="text-xl">
                Start Run
              </Button>
            </div>

            <div className="flex w-1/4 h-74 relative">
              <Image
                src="/oak-welcome.png"
                alt="professor oak"
                fill
                objectFit="cover"
              />
            </div>

          </div>
        </Panel>
      )}
    </>
  );
}