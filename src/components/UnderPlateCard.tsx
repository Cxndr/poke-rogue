import { tokenColorVars } from "@/lib/colors";

type UnderPlateCardProps = {
  plateColor: string;
  children?: React.ReactNode;
  className?: string;
}

export default function UnderPlateCard({
  plateColor, children, className
} : UnderPlateCardProps) {

  return (
    <div className="relative">

      <div 
        className="
          shadow-sm shadow-zinc-900/50 bg-[var(--ui-color)]
          rounded-xl rounded-tr-3xl rounded-bl-3xl overflow-hidden w-full h-full scale-95 absolute
        "
        style={{
          ...tokenColorVars(plateColor)
        }}
      >



      </div>

      <div
        className={`${className} 
          w-full h-full
          rounded-bl-[24px] rounded-tr-[24px] rounded-tl-[44px] rounded-br-[44px]
          shadow-sm shadow-zinc-900/50
          flex justify-center items-center overflow-hidden
          relative
        `}
      >

        {children}

      </div>

    </div>
    
  )

}