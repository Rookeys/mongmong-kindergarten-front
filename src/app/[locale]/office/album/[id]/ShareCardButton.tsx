"use client"

import { useTranslations } from "next-intl"
import { Button } from "@kojaem/mongmong"

// TODO: 졸업 카드 이미지 저장(카드를 이미지로 그리는 방법 필요). 공유는 지금 글로만 보낸다.
export default function ShareCardButton({ text }: { text: string }) {
  const t = useTranslations("album")
  return (
    <div className="mt-auto flex gap-2 px-5 pb-5">
      <Button size="xl" color="brand" variant="weak" isFullWidth disabled>
        {t("save")}
      </Button>
      <Button
        size="xl"
        color="brand"
        variant="fill"
        isFullWidth
        onClick={() => navigator.share?.({ text }).catch(() => {}) ?? navigator.clipboard.writeText(text)}
      >
        {t("share")}
      </Button>
    </div>
  )
}
