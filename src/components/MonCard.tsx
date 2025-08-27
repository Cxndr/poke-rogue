import TypePill from "./TypePill";
import { getTypeColorClass } from "@/lib/colors";
import Image from "next/image";
import { ProperName } from "@/lib/utils";
import { LocalMon } from "@/lib/gameState";
import CornerTagCard from "./CornerTagCard";

type MonCardProps = {
  children?: React.ReactNode;
  mon: LocalMon;
}

export default function MonCard({children, mon}: MonCardProps) {

  const typeColor = getTypeColorClass(mon.data.types[0].type.name);

  return (
 
    <CornerTagCard
      tagColor={typeColor}
      className="
        bg-zinc-50 rounded-3xl
        flex flex-col items-center justify-center
        w-34
        px-4 py-3.5
      "
    >

      <div 
        className="w-24 h-20 relative overflow-hidden"
      >
        <Image
          src={mon.data.sprites.front_default ?? ""}
          alt={mon.data.name}
          fill
          className="object-cover"
          style={{
            imageRendering: "pixelated",
            transform: "scale(1.5)"
          }}
        />
      </div>
      
      <h4>{ProperName(mon.data.name)}</h4>

      <TypePill type={mon.move.type.name}>
        <span className="text-md font-semibold">{ProperName(mon.move.name)}</span>
      </TypePill>

      {children}

    </CornerTagCard>
  )
}