
type PanelProps = {
  children: React.ReactNode;
  className?: string;
}

export default function Panel({children, className}:PanelProps) {

  return (
    <div
      className={`
        bg-linear-150 from-yellow-300 from-40% to-yellow-400 to-60%
        rounded-4xl backdrop-blur-md
        p-8
        shadow-lg shadow-zinc-900/30
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  )
}