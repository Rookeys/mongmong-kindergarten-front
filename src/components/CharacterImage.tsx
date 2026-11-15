import { cn } from "@/utils/cn"

interface Props {
  /** 캐릭터 종류 이미지. 없으면 임시 알 이미지 */
  src: string | null
  alt: string
  size: number
  className?: string
}

/** 캐릭터 이미지. 임시 알 이미지는 여백이 커서 Figma와 같은 비율로 잘라 보여준다. */
export default function CharacterImage({ src, alt, size, className }: Props) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden", className)} style={{ width: size, height: size }}>
      <img
        src={src ?? "/assets/images/character-egg.png"}
        alt={alt}
        className="pixelated absolute top-[-53%] left-[-55%] size-[213%] max-w-none"
      />
    </div>
  )
}
