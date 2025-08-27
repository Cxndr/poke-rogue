
type HeaderPanelProps = {
  children: React.ReactNode;
  className?: string;
  side?: "above" | "below"
}

export default function HeaderPanel({
  side="above", children, className
}:HeaderPanelProps) {

  return (
    <div
      className={`
        w-auto
        justify-self-center
        text-zinc-800
        bg-zinc-300/30
        backdrop-blur-lg
        shadow-md shadow-zinc-900/30
        px-5
        ${side==="above" && "rounded-t-2xl pt-2 pb-1"}
        ${side==="below" && "rounded-b-2xl pt-0.5 pb-1"}
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  )
}