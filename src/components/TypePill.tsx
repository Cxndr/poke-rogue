import { capitalizeFirst } from "@/lib/utils";
import { typeColorVars } from "@/lib/colors";

type TypePillProps = {
  type: string;
  className?: string;
  children?: React.ReactNode;
}

export default function TypePill({ type, className = "", children }: TypePillProps) {
  const capitalizedType = capitalizeFirst(type);

  return (
    <div
      className={`
        px-[7px] py-[3px] rounded-full
        text-xs font-medium text-white
        bg-[var(--ui-color)]
        shadow-xs shadow-zinc-900/80
        ${className}
      `}
      style={typeColorVars(type)}
    >
      { children ?? capitalizedType}
    </div>
  );
}