import { GameState, getMaxHP, ProperName } from "@/lib/gameState";
import Image from "next/image";

type PartyProps = {
  game: GameState;
  onDrop: (e: React.DragEvent<HTMLDivElement>, pokemonIndex: number) => void;
}

export default function Party({game, onDrop}: PartyProps) {
  // Handle dragover to allow dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <h3>Party</h3>
      <div className="flex flex-row gap-4 justify-center items-center">
        {game.party.map((partyMember, index) => (
          <div 
            key={partyMember.data.id} 
            className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500"
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, index)}
          >
            <Image 
              src={partyMember.data.sprites.front_default ?? ""} 
              alt={partyMember.data.name} 
              width={96} 
              height={96} 
            />
            <p>{ProperName(partyMember.data.name)}</p>
            <p>{ProperName(partyMember.move.name)}</p>
            <p className="text-sm text-gray-600">
              {partyMember.equippedTool ? ProperName(partyMember.equippedTool.name) : "No item"}
            </p>
            <div className="grid grid-cols-4 gap-0 text-right">
              <span>Lvl: </span><span>{partyMember.level}</span>
              <span>HP:  </span><span>{getMaxHP(partyMember.data.stats[0].base_stat, partyMember.level)}</span>
              <span>Atk: </span><span>{partyMember.data.stats[1].base_stat}</span>
              <span>Def: </span><span>{partyMember.data.stats[2].base_stat}</span>
              <span>SpA: </span><span>{partyMember.data.stats[3].base_stat}</span>
              <span>SpD: </span><span>{partyMember.data.stats[4].base_stat}</span>
              <span>Spd: </span><span>{partyMember.data.stats[5].base_stat}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}