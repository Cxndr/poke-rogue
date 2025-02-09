import { executeAttack, GameState, getMaxHP, LocalMon, ProperName } from "@/lib/gameState";
import Image from "next/image";
import { useEffect, useRef } from "react";

type FightProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  enemyParty: LocalMon[];
}

export default function Fight({game, setGame, enemyParty}: FightProps) {
  // store timeouts for cleanup
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    game.party.forEach((mon) => {
      const startAttackLoop = () => {
        if (mon.hp <= 0) return;

        timeoutRefs.current[mon.data.name] = setTimeout(() => {
          const target = enemyParty[Math.floor(Math.random() * enemyParty.length)];
          console.log(`${mon.data.name} attacking ${target.data.name}`);
          executeAttack(mon, target);
          setGame({...game});
          
          startAttackLoop();
        }, mon.data.stats[3].base_stat * 100);
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

  return (
    <div className="h-full flex flex-col items-center justify-between">
      
      <h1>Round {game.round}</h1>

      <div className="flex flex-row gap-4">
        {enemyParty.map((mon, index) => (
          <div key={index} className="flex flex-col items-center justify-center">
            <p>Lvl: {mon.level} HP: {mon.hp}/{getMaxHP(mon.data.stats[0].base_stat, mon.level)}</p>
            <Image src={mon.data.sprites.front_default ?? ""} alt={mon.data.name} width={96} height={96} />
            <p>{ProperName(mon.data.name)}</p>
            <p>{ProperName(mon.move.name)}</p>
          </div>
        ))}
      </div>

      <div>
        {game.party.map((mon, index) => (
          <div key={index} className="flex flex-col items-center justify-center">
          <p>Lvl: {mon.level} HP: {mon.hp}/{getMaxHP(mon.data.stats[0].base_stat, mon.level)}</p>
          <Image src={mon.data.sprites.front_default ?? ""} alt={mon.data.name} width={96} height={96} />
          <p>{ProperName(mon.data.name)}</p>
          <p>{ProperName(mon.move.name)}</p>
        </div>
        ))}
      </div>

    </div>
  )
}