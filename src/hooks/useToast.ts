import { useEffect, useState } from "react"

/** 잠깐 보였다가 사라지는 토스트 문구 */
export function useToast(duration = 2500) {
  const [toastMessage, setToastMessage] = useState<string>()

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(undefined), duration)
    return () => clearTimeout(timer)
  }, [toastMessage, duration])

  return { toastMessage, showToast: setToastMessage }
}
