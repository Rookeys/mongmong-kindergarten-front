"use client"

import type { RefObject } from "react"
import { useTranslations } from "next-intl"
import { toBlob } from "html-to-image"
import { Button, Toast } from "@kojaem/mongmong"
import { useToast } from "@/hooks/useToast"

interface Props {
  /** 이미지로 만들 졸업 카드 영역 */
  cardRef: RefObject<HTMLElement | null>
  fileName: string
  shareText: string
}

/**
 * 졸업 카드를 화면에 보이는 그대로 PNG로 만들어 저장·공유한다 (html-to-image).
 * 움직이는 캐릭터(gif)는 찍는 순간의 한 프레임이 들어가고, 다른 도메인 이미지는 CORS 허용이 있어야 찍힌다.
 */
export default function ShareCardButtons({ cardRef, fileName, shareText }: Props) {
  const t = useTranslations("album")
  const { toastMessage, showToast } = useToast()

  const captureCard = async () => {
    // 카드 바깥 여백(margin)이 이미지 안으로 들어가 잘리지 않게 margin을 빼고 찍는다
    const blob =
      cardRef.current && (await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true, style: { margin: "0" } }))
    if (!blob) throw new Error("capture failed")
    return new File([blob], fileName, { type: "image/png" })
  }

  const handleSave = async () => {
    try {
      const file = await captureCard()
      const url = URL.createObjectURL(file)
      const link = document.createElement("a")
      link.href = url
      link.download = file.name
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      showToast(t("captureFailed"))
    }
  }

  // 이미지 공유를 지원하면 이미지로, 아니면 글로 공유한다
  const handleShare = async () => {
    try {
      const file = await captureCard()
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText })
      } else if (navigator.share) {
        await navigator.share({ text: shareText })
      } else {
        await navigator.clipboard.writeText(shareText)
        showToast(t("shareCopied"))
      }
    } catch (error) {
      // 사용자가 공유 창을 닫은 경우(AbortError)는 그냥 둔다
      if (!(error instanceof DOMException && error.name === "AbortError")) showToast(t("captureFailed"))
    }
  }

  return (
    <div className="mt-auto flex flex-col items-center gap-[12px] px-[20px] pb-[20px]">
      {toastMessage && <Toast>{toastMessage}</Toast>}
      <div className="flex w-full gap-[8px]">
        <Button size="xl" color="brand" variant="weak" isFullWidth onClick={handleSave}>
          {t("save")}
        </Button>
        <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleShare}>
          {t("share")}
        </Button>
      </div>
    </div>
  )
}
