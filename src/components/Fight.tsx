import { executeAttack, GameState, getMaxHP, LocalMon, ProperName } from "@/lib/gameState";
import Image from "next/image";
import { useEffect } from "react";

type FightProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  enemyParty: LocalMon[];
}

export default function Fight({game, setGame, enemyParty}: FightProps) {

  useEffect(() => {
    console.log("starting attacks");
    for (const mon of game.party) {
      console.log("attack timer: ", mon.data.name);
      setTimeout(() => {
        const target = enemyParty[Math.floor(Math.random() * enemyParty.length)];
        console.log("attacking: ", target.data.name);
        executeAttack(mon, target);
        console.log(enemyParty);
      },  mon.data.stats[3].base_stat * 100);
    }
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