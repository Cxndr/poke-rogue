import { capitalizeFirst } from "@/lib/utils";
import { getTypeColorClass } from "@/lib/colors";

type TypePillProps = {
  type: string;
  className?: string;
  children?: React.ReactNode;
}

export default function TypePill({ type, className = "", children }: TypePillProps) {
  const capitalizedType = capitalizeFirst(type);
  const colorClass = getTypeColorClass(type);
  
  return (
    <div 
      className={`
        px-[7px] py-[3px] rounded-full 
        text-xs font-medium text-white 
        ${className}
      `}
      style={{backgroundColor: `var(--color-${colorClass})`}}
    >
      { children ?? capitalizedType}
    </div>
  );
} 