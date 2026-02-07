"use client"

import { useEffect } from "react"

export function ModalView({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handler)

    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  // 배경 스크롤 이동 막기
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* content */}
      <div className="relative rounded bg-white p-6">{children}</div>
    </div>
  )
}
