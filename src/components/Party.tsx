import { GameState, ProperName } from "@/lib/gameState";
import Image from "next/image";

type PartyProps = {
  game: GameState;
}

export default function Party({game}: PartyProps) {
  return (
    <div>
      <h3>Party</h3>
      <div className="flex flex-row gap-4 justify-center items-center">
        {game.party.map((partyMember) => (
          <div key={partyMember.data.id} className="flex flex-col items-center justify-center">
            <Image src={partyMember.data.sprites.front_default ?? ""} alt={partyMember.data.name} width={96} height={96} />
            <p>{ProperName(partyMember.data.name)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}