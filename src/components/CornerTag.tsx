import { tokenColorVars } from "@/lib/colors";

type CornerTagProps = {
  tagColor: string; // Tailwind token like "red-500"
  size?: "small" | "med" | "large"
  className?: string;
}

export default function CornerTag({tagColor, size = "small", className}:CornerTagProps) {

  let tagSize = 16;
  if      (size == "small") { tagSize = 16 }
  else if (size == "med")   { tagSize = 28 }
  else if (size == "large") { tagSize = 40 }

  // Default behavior - simple corner tag
  return (
    <div
      className={`absolute top-0 right-0 w-0 h-0 border-t-[var(--ui-color)] ${className ?? ""}`}
      style={{
        ...tokenColorVars(tagColor),
        borderLeft: `${tagSize}px solid transparent`,
        borderTopWidth: tagSize,
        borderTopStyle: "solid",
        borderTopRightRadius: "6px"
      }}
    />
  )
}