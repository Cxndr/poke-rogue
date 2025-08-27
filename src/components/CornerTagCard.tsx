import CornerTag from "./CornerTag"

type CornerTagCardProps = {
  tagColor: string;
  children?: React.ReactNode;
  className?: string;
  cardSize?: "small" | "med" | "large"
}

export default function CornerTagCard({
  tagColor, cardSize="large", children, className
} : CornerTagCardProps) {

  let cutPosX;
  let cutPosY;
  if      (cardSize === "small")  { cutPosX = "72%"; cutPosY = "28%" }
  else if (cardSize === "med")    { cutPosX = "80%"; cutPosY = "20%" }
  else if (cardSize === "large")  { cutPosX = "80%"; cutPosY = "13%" }

  return (
    <div 
      className="
        relative
        overflow-visible
      "
    >

      <CornerTag 
        tagColor={tagColor} 
        size="med" 
        className="drop-shadow-sm/70 scale-75"
      />

      <div className="drop-shadow-sm/40">

        <div
          className={`${className}`}
          style={{
            clipPath: `polygon(${cutPosX} 0, 100% ${cutPosY}, 100% 100%, 0 100%, 0 0)`,
          }}
        >

          {children}

        </div>

      </div>
      
    </div>
  )

}