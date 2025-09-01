import Image from "next/image";
import { ReactNode } from "react";
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

  return (
      <div 
        className={`
          relative flex flex-col items-center justify-around p-2
          w-32 h-32
          bg-zinc-100 text-zinc-900 hover:bg-zinc-50
          cursor-pointer
          bg-no-repeat bg-center bg-contain
          ${className}
        `}
        style={
          event.ui.sprite ? { 
            backgroundImage: `url(${event.ui.sprite})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center" 
          } : undefined
        }
        onClick={onClick}
      >
        <span 
          className="
            text-sm font-semibold text-center
            text-zinc-50
            drop-shadow-sm/100
          "
        >
          {event.name}
        </span>

        <span 
          className="
            text-xs text-zinc-50 text-center
            drop-shadow-lg/100
          "
        >
          {event.description}
        </span>

        {children}

      </div>
  );
}
