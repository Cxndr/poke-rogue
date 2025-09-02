import TypePill from "./TypePill";
import { getTypeColorClass } from "@/lib/colors";
import Image from "next/image";
import { ProperName } from "@/lib/utils";
import { LocalMon } from "@/lib/gameState";
import CornerTagCard from "./CornerTagCard";
import { PiSwordFill } from "react-icons/pi";
import { GiHealthNormal } from "react-icons/gi";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { BiSolidShield } from "react-icons/bi";
import { RiMagicFill } from "react-icons/ri";
import { RiShieldStarFill } from "react-icons/ri";
import { getMonMaxHP, getMonStat } from "@/lib/gameState";
import { getStatBase } from "@/lib/stats";


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
        max-w-48
        px-3.5 py-3.5
      "
    >

      <div 
        className="w-24 h-20 relative overflow-hidden"
      >
        <Image
          src={mon.data.sprites.front_default ?? ""}
          alt={mon.data.name}
          fill
          className="object-cover drop-shadow-sm/0"
          style={{
            imageRendering: "pixelated",
            transform: "scale(1.5)"
          }}
        />
      </div>
      
      <h4>{ProperName(mon.data.name)}</h4>

      <TypePill type={mon.move.type.name} className="mt-2 mb-0.5">
        <span className="text-md font-semibold">{ProperName(mon.move.name)}</span>
      </TypePill>

      <div 
        className="
          grid grid-cols-3 gap-2.5 px-2.5 py-2 mt-3.5
          text-sm text-zinc-50
          bg-zinc-700 rounded-xl
          shadow-sm shadow-zinc-700/40
        "
      >
        <span className="flex items-center gap-1 ">
          <GiHealthNormal size={14} /> 
          {getMonMaxHP(mon)}
        </span>

        <span className="flex items-center gap-1 ">
          <PiSwordFill size={18}/>
          {getMonStat(mon, "attack")}
        </span>

        <span className="flex items-center gap-1 ">
          <RiMagicFill size={18}/>
          {getMonStat(mon, "special-attack")}
        </span>

        <span className="flex items-center gap-1 ">
          <MdOutlineDoubleArrow size={20}/>
          {getMonStat(mon, "speed")}
        </span>

        <span className="flex items-center gap-1 ">
          <BiSolidShield size={18}/>
          {getMonStat(mon, "defense")}
        </span>

        <span className="flex items-center gap-1 ">
          <RiShieldStarFill size={18}/>
          {getMonStat(mon, "special-defense")}
        </span>
        

      </div>

      {children}

    </CornerTagCard>
  )
}
