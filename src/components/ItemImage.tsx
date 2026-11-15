"use client"

import { useState } from "react"

/** 아이템 이미지. 주소가 깨지면(개발 샘플 데이터는 example.com) 임시 별 이미지를 보여준다. */
export default function ItemImage({ src, size, className }: { src: string; size: number; className?: string }) {
  const [hasError, setHasError] = useState(false)
  return (
    <img
      src={hasError ? "/assets/images/mood-placeholder.png" : src}
      alt=""
      width={size}
      height={size}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
