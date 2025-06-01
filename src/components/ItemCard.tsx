import { Item, TM } from "@/lib/upgrades";
import Image from "next/image";
import { ReactNode } from "react";
import TypePill from "./TypePill";

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
      return "#3b82f6"; // blue-500
    case "tool":
      return "#f97316"; // orange-500
    case "tm":
      return "#a855f7"; // purple-500
    default:
      return "#6b7280"; // gray-500
  }
};

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  const triangleColor = getItemTypeColor(item.type);
  const isTM = item.type === "tm";
  
  return (
    <div 
      className={`relative flex flex-col items-center p-2 bg-zinc-100 text-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-50 ${className}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <Image src={item.sprite} alt={item.name} width={32} height={32} />
      <span className="text-sm">{item.name}</span>
      
      {isTM ? (
        renderTMDetails(item as TM)
      ) : (
        <span className="text-xs text-zinc-600 text-center">{item.description}</span>
      )}
      
      {children}
      
      {/* Colored triangle in top-right corner */}
      <div className="absolute top-0 right-0 w-0 h-0" 
           style={{
             borderLeft: "16px solid transparent",
             borderTop: `16px solid ${triangleColor}`,
             borderTopRightRadius: "6px"
           }} 
      />
    </div>
  );
} 