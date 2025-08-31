import Image from "next/image";
import { ReactNode } from "react";
import CornerTagCard from "./CornerTagCard";
import { EventUpgrade } from "@/lib/upgrades";

type EventCardProps = {
  event: EventUpgrade;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function EventCard({ 
  event, 
  children, 
  className = "",
  onClick,
}: EventCardProps) {
  
  const tagColor = event.ui.colorToken;

  return (
    <CornerTagCard tagColor={tagColor} cardSize="small">
      <div 
        className={`
          relative flex flex-col items-center p-2 rounded-lg
          min-w-22
          bg-zinc-100 text-zinc-900 hover:bg-zinc-50
          cursor-pointer 
          ${className}
        `}
        onClick={onClick}
      >
        {event.ui.sprite ? (
          <Image src={event.ui.sprite} alt={event.name} width={32} height={32} />
        ) : null}
        <span className="text-sm font-semibold">{event.name}</span>
        <span className="text-xs text-zinc-600 text-center">
          {event.description}
        </span>
        {children}
      </div>
    </CornerTagCard>
  );
}
