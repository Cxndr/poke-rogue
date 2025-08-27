import { GameState } from "@/lib/gameState"
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
                <span>HP:  </span><span>{evolution.oldMonData.stats[0].base_stat}</span>
                <span>Atk: </span><span>{evolution.oldMonData.stats[1].base_stat}</span>
                <span>Def: </span><span>{evolution.oldMonData.stats[2].base_stat}</span>
                <span>SpA: </span><span>{evolution.oldMonData.stats[3].base_stat}</span>
                <span>SpD: </span><span>{evolution.oldMonData.stats[4].base_stat}</span>
                <span>Spd: </span><span>{evolution.oldMonData.stats[5].base_stat}</span>
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
                <span>HP:  </span><span>{evolution.newMonData.stats[0].base_stat}</span>
                <span>Atk: </span><span>{evolution.newMonData.stats[1].base_stat}</span>
                <span>Def: </span><span>{evolution.newMonData.stats[2].base_stat}</span>
                <span>SpA: </span><span>{evolution.newMonData.stats[3].base_stat}</span>
                <span>SpD: </span><span>{evolution.newMonData.stats[4].base_stat}</span>
                <span>Spd: </span><span>{evolution.newMonData.stats[5].base_stat}</span>
              </div>
            </div>

          </div>
        ))}
      </Panel>
    </div>
  )
}