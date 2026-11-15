/** 캐릭터 이미지. 임시 알 이미지는 여백이 커서 Figma와 같은 비율로 잘라 보여준다. */
export default function CharacterImage({ src, alt, size }: { src: string | null; alt: string; size: number }) {
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: size, height: size }}>
      <img
        src={src ?? "/assets/images/character-egg.png"}
        alt={alt}
        className="absolute top-[-52.98%] left-[-55.44%] size-[212.9%] max-w-none [image-rendering:pixelated]"
      />
    </div>
  )
}
