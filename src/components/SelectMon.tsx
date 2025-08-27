
import { GameState, LocalMon, resetHP } from "@/lib/gameState";
import { useEffect } from "react";
import { DotLoader } from "react-spinners";
import Panel from "./Panel";
import HeaderPanel from "./HeaderPanel";
import MonCard from "./MonCard";
import Button from "./Button";

type SelectMonProps = {
  game: GameState;
  setGame: (game: GameState) => void;
  selection: LocalMon[];
  loading?: boolean;
}

export default function SelectMon({game, setGame, selection, loading}: SelectMonProps) {

  useEffect(() => {
    for (const mon of selection) {
      resetHP(mon);
    }
  }, [selection]);
  
  async function selectMonClick (pokemon: LocalMon) {
    const newGame = { ...game };
    // Find first empty slot
    const emptySlot = newGame.party.find(slot => slot.pokemon === null);
    if (emptySlot) {
      emptySlot.pokemon = pokemon;
    } else {
      newGame.pokemonStorage.push(pokemon);
    }
    setGame({
      ...newGame,
      currentState: "upgrade"
    });
  }

  const isLoading = loading || selection.length === 0 || selection.some(mon => !mon.data?.sprites?.front_default || !mon.move?.name);

  if (isLoading) {
    return (
      <div 
        className="
          flex flex-col items-center justify-center gap-4
          bg-zinc-50/30 backdrop-blur-xl p-8 rounded-3xl
          shadow-md shadow-zinc-500/40
        "
      >
        <DotLoader color="oklch(63.7% 0.237 25.331)" loading={true} size={50} />
        <p className="text-red-500/80">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <HeaderPanel>
        <h2>Select a Pokemon to add to your team:</h2>
      </HeaderPanel>
      <Panel className="flex flex-col items-center justify-center min-w-xl">
        <div className="flex flex-row gap-6">
        {selection.map((mon, index) => (
          <MonCard key={index} mon={mon}>
            <Button onClick={() => selectMonClick(mon)} className="mt-4">
              Choose
            </Button>
          </MonCard>
        ))}
        </div>
      </Panel>
    </div>
  );
}