
type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export default function Button({children, onClick, disabled=false, className}:ButtonProps) {

  return (
    <button
      onClick={onClick}
      className={`
        text-white bg-red-700 
        hover:bg-red-800 hover:scale-102
        font-bold
        transition-all duration-300
        py-2.5 px-5
        rounded-full
        cursor-pointer
        shadow-xs shadow-zinc-700/50
        hover:shadow-md
        ${className ?? ""}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  )
}