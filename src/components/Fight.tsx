import { finishRound, GameState, getMaxHP, LocalMon, startAttackLoop } from "@/lib/gameState";
import { ProperName } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MonHPBar from "./MonHPBar";
import HeaderPanel from "./HeaderPanel";
import Button from "./Button";

type FightProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  enemyParty: LocalMon[];
}

export default function Fight({game, setGame, enemyParty}: FightProps) {

  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const fightLogRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef(game);

  const [fightLogUpdate, setFightLogUpdate] = useState(0);
  const [fightStatus, setFightStatus] = useState<"fighting" | "Won" | "Lost">("fighting");
  const [attackTimers, setAttackTimers] = useState<{ [key: string]: number }>({});

  const faintedClassName = "opacity-30";

  // Update the game ref whenever game changes, but don't restart attack loops
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    const currentGame = gameRef.current;

    currentGame.party.forEach(slot => {
      if (!slot.pokemon) return;
      startAttackLoop(
        slot.pokemon,
        enemyParty,
        enemyParty,
        gameRef.current,
        timeoutRefs.current,
        setFightStatus,
        setFightLogUpdate,
        setGame,
        true,
        updateTimer
      );
    });

    enemyParty.forEach(mon => {
      startAttackLoop(
        mon,
        currentGame.party.map(slot => slot.pokemon),
        enemyParty,
        gameRef.current,
        timeoutRefs.current,
        setFightStatus,
        setFightLogUpdate,
        setGame,
        false,
        updateTimer
      );
    });

    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout);
      timeoutRefs.current = {};
    };
  }, [enemyParty, setGame]);

  useEffect(() => {
    if (fightLogRef.current) {
      fightLogRef.current.scrollTop = fightLogRef.current.scrollHeight;
    }
  }, [fightLogUpdate]);

  const fightWon = () => {
    game.currentState = "runWin";
    finishRound("won", game, setGame);
  }

  const fightLost = () => {
    game.currentState = "startGame";
  finishRound("lost", game, setGame);
  }

  const updateTimer = (monName: string, timeLeft: number) => {
    setAttackTimers(prev => ({...prev, [monName]: timeLeft}));
  };

  return (
    <div 
      className="
        h-full w-full flex flex-row items-center justify-center gap-8 py-12
      "
    >
      <HeaderPanel side="below" className="absolute top-0">
        <h2>Round {game.round}</h2>
      </HeaderPanel>

      <div 
        className="
          h-full w-2/3 flex flex-col items-center justify-between
          rounded-3xl p-8 
          bg-lime-200
        "
      >
        
        {fightStatus !== "fighting" && (
          <div className="flex flex-col items-center justify-center">
            <h1>Fight {fightStatus}</h1>
            {fightStatus === "Won" && (
              <Button onClick={fightWon}>Continue</Button>
            )}
            {fightStatus === "Lost" && (
              <Button onClick={fightLost}>Try Again</Button>
            )}
          </div>
        )}

        <div className="flex flex-row gap-4">
          {enemyParty.map((mon, index) => (
            <div key={index} className={`flex flex-col items-center justify-center ${mon.hp <= 0 && faintedClassName}`}>
              <p>Lvl: {mon.level} HP: {mon.hp}/{getMaxHP(mon.data.stats[0].base_stat, mon.level)}</p>
              <MonHPBar pokemon={mon} />
              <Image src={mon.data.sprites.front_default ?? ""} alt={mon.data.name} width={96} height={96} />
              <p>{ProperName(mon.data.name)}</p>
              {mon.move?.name && <p>{ProperName(mon.move.name)}</p>}
              {mon.data?.name && attackTimers[mon.data.name] !== undefined && mon.hp > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${((1 - attackTimers[mon.data.name]) * 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-row gap-4">
          {game.party.map((slot, index) => {
            if (!slot.pokemon) return null;  // Skip empty slots
            return (
              <div key={index} className={`flex flex-col items-center justify-center ${slot.pokemon.hp <= 0 && faintedClassName}`}>
                <p>Lvl: {slot.pokemon.level} HP: {slot.pokemon.hp}/{getMaxHP(slot.pokemon.data.stats[0].base_stat, slot.pokemon.level)}</p>
                <MonHPBar pokemon={slot.pokemon}/>
                <Image src={slot.pokemon.data.sprites.back_default ?? ""} alt={slot.pokemon.data.name} width={96} height={96} />
                <p>{ProperName(slot.pokemon.data.name)}</p>
                {slot.pokemon.move?.name && <p>{ProperName(slot.pokemon.move.name)}</p>}
                {slot.pokemon.data?.name && attackTimers[slot.pokemon.data.name] !== undefined && slot.pokemon.hp > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${((1 - attackTimers[slot.pokemon.data.name]) * 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      <div 
        className="
          h-full w-1/3 px-8 py-4 flex flex-col items-center rounded-3xl
          bg-zinc-300/30 backdrop-blur-xl
          shadow-md shadow-zinc-900/30
        "
      >
        <h1 className="pb-4">Fight Log</h1>
        <div ref={fightLogRef} className="flex-1 w-full overflow-y-auto">
          {game.fightLog.map((log, index) => (
            <p key={index} className="p-1">{log}</p>
          ))}
        </div>
      </div>

    </div>
  )
}