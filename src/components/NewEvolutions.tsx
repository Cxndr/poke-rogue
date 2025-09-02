import { GameState, getMaxHP } from "@/lib/gameState"
import { getStatBase, StatName } from "@/lib/stats";
import { PiArrowFatLineRight } from "react-icons/pi";
import Image from "next/image";
import HeaderPanel from "./HeaderPanel";
import Button from "./Button";
import Panel from "./Panel";

type NewEvolutionsProps = {
  game: GameState,
  setGame: (game: GameState) => void,
}  

export default function NewEvolutions({ game, setGame }: NewEvolutionsProps) {

  function handleContinueClick() {
    setGame({...game, newEvolutions: []});
  }

  function statWithFlats(pokemonData: any, stat: StatName, mon: any) {
    if (stat === "hp") {
      // Show HP as max HP with flat bonuses only (exclude multipliers)
      const baseMax = getMaxHP(getStatBase(pokemonData, "hp"), mon.level);
      const flat = mon.hpFlatBonus ?? 0;
      return baseMax + flat;
    }
    const base = getStatBase(pokemonData, stat);
    const flat = mon.statFlatBonus?.[stat] ?? 0;
    return base + flat;
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-0">
      <HeaderPanel className="flex gap-4 justify-center items-center">
        <h1 className="inline">You&apos;re pokemon have evolved!</h1>
        <Button 
          onClick={handleContinueClick} 
          className="inline !px-4 !py-1.5 my-1.5"
        >
          Continue
        </Button>
      </HeaderPanel>
      <Panel className="flex flex-row flex-wrap items-center justify-center gap-4 !p-4 ">
        {game.newEvolutions.map((evolution) => (
          <div key={evolution.newMonData.id} className="flex flex-row items-center justify-center gap-4 bg-zinc-50/50 rounded-3xl p-4">

            <div className="flex flex-col items-center justify-center gap-2 bg-zinc-50 rounded-2xl p-4">
              <Image 
                src={evolution.oldMonData.sprites.front_default || ''} 
                alt={evolution.oldMonData.name} 
                width={100} 
                height={100} 
              />
              <p>{evolution.oldMonData.name}</p>
              <div className="grid grid-cols-4 gap-2 text-right"> 
                <span>HP:  </span><span>{statWithFlats(evolution.oldMonData, "hp", evolution.mon)}</span>
                <span>Atk: </span><span>{statWithFlats(evolution.oldMonData, "attack", evolution.mon)}</span>
                <span>Def: </span><span>{statWithFlats(evolution.oldMonData, "defense", evolution.mon)}</span>
                <span>SpA: </span><span>{statWithFlats(evolution.oldMonData, "special-attack", evolution.mon)}</span>
                <span>SpD: </span><span>{statWithFlats(evolution.oldMonData, "special-defense", evolution.mon)}</span>
                <span>Spd: </span><span>{statWithFlats(evolution.oldMonData, "speed", evolution.mon)}</span>
              </div>
            </div>

            <PiArrowFatLineRight />

            <div className="flex flex-col items-center justify-center gap-2 bg-zinc-50 rounded-2xl p-4">
              <Image 
                src={evolution.newMonData.sprites.front_default || ''} 
                alt={evolution.newMonData.name} 
                width={100} 
                height={100} 
              />
              <p>{evolution.newMonData.name}</p>
              <div className="grid grid-cols-4 gap-2 text-right"> 
                <span>HP:  </span><span>{statWithFlats(evolution.newMonData, "hp", evolution.mon)}</span>
                <span>Atk: </span><span>{statWithFlats(evolution.newMonData, "attack", evolution.mon)}</span>
                <span>Def: </span><span>{statWithFlats(evolution.newMonData, "defense", evolution.mon)}</span>
                <span>SpA: </span><span>{statWithFlats(evolution.newMonData, "special-attack", evolution.mon)}</span>
                <span>SpD: </span><span>{statWithFlats(evolution.newMonData, "special-defense", evolution.mon)}</span>
                <span>Spd: </span><span>{statWithFlats(evolution.newMonData, "speed", evolution.mon)}</span>
              </div>
            </div>

          </div>
        ))}
      </Panel>
    </div>
  )
}
