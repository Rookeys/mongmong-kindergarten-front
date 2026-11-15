"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button } from "@kojaem/mongmong"
import CharacterFace from "@/components/CharacterFace"
import { Link } from "@/i18n/navigation"
import { toKstDate } from "@/utils/date"

const DISMISSED_STORAGE_KEY = "letter-arrival-dismissed-date"

/**
 * 오늘 편지에 아직 답장하지 않았으면 홈에 들어올 때 하루 한 번 띄운다 (Figma "편지 도착").
 * TODO: 언제 띄울지 Figma에 기준이 없어 임시 구현 (TODO.md). localStorage는 막혀 있을 수 있어 실패는 무시
 */
export default function LetterArrivalSheet() {
  const t = useTranslations("home")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISSED_STORAGE_KEY) !== toKstDate()) setIsOpen(true)
    } catch {}
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, toKstDate())
    } catch {}
  }

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title={t("arrivalTitle")}
      buttonLayout="vertical"
      buttons={
        <>
          <Button asChild size="xl" color="brand" variant="fill" isFullWidth onClick={handleClose}>
            <Link href="/letter">{t("arrivalOpen")}</Link>
          </Button>
          <Button size="xl" color="brand" variant="weak" isFullWidth onClick={handleClose}>
            {t("arrivalLater")}
          </Button>
        </>
      }
    >
      <div className="flex justify-center">
        <CharacterFace size={140} />
      </div>
    </BottomSheet>
  )
}
