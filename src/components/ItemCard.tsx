import { Item, TM } from "@/lib/upgrades";
import Image from "next/image";
import { ReactNode } from "react";
import TypePill from "./TypePill";
import { getItemColorClass } from "@/lib/colors";
import UnderPlateCard from "./UnderPlateCard";

type ItemCardProps = {
  item: Item;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

function tmStrip(tm: string) {
  return tm.split(":").pop();
}



const renderTMDetails = (tm: TM) => {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-2 w-full">
      {/* Move type pill */}
      <TypePill type={tm.moveType}>
        <span className="text-md font-semibold">{tmStrip(tm.name)}</span>
      </TypePill>
      
      {/* Power and Accuracy */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-900">
        <span>💥 {tm.movePower}</span>
        <span>🎯 {tm.moveAccuracy}</span>
      </div>
    </div>
  );
};



export default function ItemCard({ 
  item, 
  children, 
  className = "",
  onClick,
  draggable = false,
  onDragStart
}: ItemCardProps) {
  
  const typeColor = getItemColorClass(item.type);
  const isTM = item.type === "tm";
  const imageSize = isTM ? 32 : 48;
  
  return (
    <UnderPlateCard plateColor={typeColor}>
      <div 
        className={`
          flex flex-col justify-center items-center p-2
          w-28 h-28
          bg-zinc-50 text-zinc-900 hover:bg-zinc-50
          cursor-pointer
          ${className}
        `}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
      >
        <Image src={item.sprite} alt={item.name} width={imageSize} height={imageSize} />
        
        
        {isTM ? (
          renderTMDetails(item as TM)
        ) : (
          <>
            <span className="text-sm text-zinc-800 font-semibold mt-1">{item.name}</span>
            <span className="text-xs text-zinc-700 text-center">
              {item.description}
            </span>
          </>
        )}
        
        {children}

      </div>
    </UnderPlateCard>
    
  );
} 