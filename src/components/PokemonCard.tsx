import { LocalMon } from "@/lib/gameState";
import { ProperName } from "@/lib/utils";
import Image from "next/image";
import { ReactNode, DragEvent } from "react";
import MonCard from "./MonCard";

type PokemonCardProps = {
  pokemon: LocalMon;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  imageSize?: number;
}

export default function PokemonCard({ 
  pokemon, 
  children, 
  className = "", 
  onClick, 
  draggable = false, 
  onDragStart,
  onDragOver,
  onDrop,
  imageSize = 48
}: PokemonCardProps) {
  
  return (
    <div 
      className={`flex flex-col items-center p-2 bg-zinc-100 text-zinc-900 rounded cursor-pointer hover:bg-zinc-50 ${className}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <MonCard mon={pokemon}>
        {children}
      </MonCard>
    </div>
  );
} 