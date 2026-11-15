"use client"

import { useTranslations } from "next-intl"
import { Button } from "@kojaem/mongmong"

/** TODO: 카드 이미지 저장은 카드를 이미지로 만드는 방법이 정해지면 붙인다. 공유는 지금 글로만 보낸다. */
export default function ShareCardButtons({ shareText }: { shareText: string }) {
  const t = useTranslations("album")

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText })
      } else {
        await navigator.clipboard.writeText(shareText)
      }
    } catch {
      // 사용자가 공유 창을 닫은 경우
    }
  }

  return (
    <div className="mt-auto flex gap-2 px-5 pb-5">
      <Button size="xl" color="brand" variant="weak" isFullWidth disabled>
        {t("save")}
      </Button>
      <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleShare}>
        {t("share")}
      </Button>
    </div>
  )
}
