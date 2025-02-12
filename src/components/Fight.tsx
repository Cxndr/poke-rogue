import { checkIfEnemyPartyDefeated, executeAttack, finishRound, GameState, getMaxHP, LocalMon, ProperName } from "@/lib/gameState";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FightProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  enemyParty: LocalMon[];
}

export default function Fight({game, setGame, enemyParty}: FightProps) {

  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const fightLogRef = useRef<HTMLDivElement>(null);

  const [fightLogUpdate, setFightLogUpdate] = useState(0);
  const [fightStatus, setFightStatus] = useState<"fighting" | "Won" | "Lost">("fighting");

  const faintedClassName = "opacity-30";

  useEffect(() => {
    game.party.forEach((slot) => {
      if (!slot.pokemon) return;
      const startAttackLoop = () => {
        if (!slot.pokemon) return;
        if (slot.pokemon?.hp <= 0) return;
        timeoutRefs.current[slot.pokemon?.data.name ?? ""] = setTimeout(() => {
          const targetParty = enemyParty.filter(p => p.hp > 0);
          const target = targetParty[Math.floor(Math.random() * targetParty.length)];
          if (!slot.pokemon) return;
          executeAttack(slot.pokemon, target, game);
          if (checkIfEnemyPartyDefeated(targetParty)) {
            setFightStatus("Won");
          } else {
            setGame({...game});
            setFightLogUpdate(prev => prev + 1);
            startAttackLoop();
          }
        }, slot.pokemon?.data.stats[3].base_stat * 10); // 100
      };

      startAttackLoop();
    });

    // clear all timeouts when component unmounts
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      timeoutRefs.current = {};
    };
  }, []);

  useEffect(() => {
    if (fightLogRef.current) {
      fightLogRef.current.scrollTop = fightLogRef.current.scrollHeight;
    }
  }, [fightLogUpdate]);

  const fightWon = () => {
    finishRound("won", game, setGame);
  }

  const fightLost = () => {
    finishRound("lost", game, setGame);
  }

  return (
    <div className="h-full w-full flex flex-row items-center justify-center gap-8">

      <div className="h-full w-2/3 flex flex-col items-center justify-between">
        
        <h1>Round {game.round}</h1>
        {fightStatus !== "fighting" && (
          <div className="flex flex-col items-center justify-center">
            <h1>Fight {fightStatus}</h1>
            {fightStatus === "Won" && (
              <button onClick={fightWon}>Continue</button>
            )}
            {fightStatus === "Lost" && (
              <button onClick={fightLost}>Try Again</button>
            )}
          </div>
        )}

        <div className="flex flex-row gap-4">
          {enemyParty.map((mon, index) => (
            <div key={index} className={`flex flex-col items-center justify-center ${mon.hp <= 0 && faintedClassName}`}>
              <p>Lvl: {mon.level} HP: {mon.hp}/{getMaxHP(mon.data.stats[0].base_stat, mon.level)}</p>
              <Image src={mon.data.sprites.front_default ?? ""} alt={mon.data.name} width={96} height={96} />
              <p>{ProperName(mon.data.name)}</p>
              <p>{ProperName(mon.move.name)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-row gap-4">
          {game.party.map((slot, index) => {
            if (!slot.pokemon) return null;  // Skip empty slots
            return (
              <div key={index} className={`flex flex-col items-center justify-center ${slot.pokemon.hp <= 0 && faintedClassName}`}>
                <p>Lvl: {slot.pokemon.level} HP: {slot.pokemon.hp}/{getMaxHP(slot.pokemon.data.stats[0].base_stat, slot.pokemon.level)}</p>
                <Image src={slot.pokemon.data.sprites.back_default ?? ""} alt={slot.pokemon.data.name} width={96} height={96} />
                <p>{ProperName(slot.pokemon.data.name)}</p>
                <p>{ProperName(slot.pokemon.move.name)}</p>
              </div>
            );
          })}
        </div>

      </div>

      <div className="h-full w-1/3 px-8 py-4 flex flex-col items-center border-1 border-zinc-300 rounded-md">
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