import { Item, TM } from "@/lib/upgrades";
import Image from "next/image";
import { ReactNode } from "react";
import TypePill from "./TypePill";
import CornerTagCard from "./CornerTagCard";

type ItemCardProps = {
  item: Item;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const getItemTypeColor = (type: string) => {
  switch (type) {
    case "vitamin":
      return "blue-500"
    case "tool":
      return "orange-500"
    case "tm":
      return "purple-500"
    default:
      return "gray-500"
  }
};

const renderTMDetails = (tm: TM) => {
  return (
    <div className="flex flex-col items-center gap-1 w-full">
      {/* Move type pill */}
      <TypePill type={tm.moveType} />
      
      {/* Power and Accuracy */}
      <div className="flex items-center gap-2 text-xs">
        <span>💥 {tm.movePower}</span>
        <span>🎯 {tm.moveAccuracy}%</span>
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
  
  const typeColor = getItemTypeColor(item.type);
  const isTM = item.type === "tm";
  
  return (
    <CornerTagCard tagColor={typeColor} cardSize="small">
      <div 
        className={`
          relative flex flex-col items-center p-2 rounded-lg
          min-w-22
          bg-zinc-100 text-zinc-900 hover:bg-zinc-50
          cursor-pointer 
          ${className}
        `}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
      >
        <Image src={item.sprite} alt={item.name} width={32} height={32} />
        <span className="text-sm">{item.name}</span>
        
        {isTM ? (
          renderTMDetails(item as TM)
        ) : (
          <span className="text-xs text-zinc-600 text-center">
            {item.description}
          </span>
        )}
        
        {children}

      </div>
    </CornerTagCard>
    
  );
} 