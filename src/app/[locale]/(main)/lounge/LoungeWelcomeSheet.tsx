"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button } from "@kojaem/mongmong"
import CharacterFace from "@/components/CharacterFace"
import { DIALOG_SURFACE } from "@/constants/designSystemOverrides"

const SEEN_STORAGE_KEY = "lounge-welcome-seen"

/** 휴게실 첫 방문 안내. 기기마다 한 번만 보여준다. (localStorage는 막혀 있을 수 있어 실패는 무시) */
export default function LoungeWelcomeSheet() {
  const t = useTranslations("lounge")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_STORAGE_KEY)) setIsOpen(true)
    } catch {}
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    try {
      localStorage.setItem(SEEN_STORAGE_KEY, "true")
    } catch {}
  }

  return (
    <BottomSheet
      className={DIALOG_SURFACE}
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title={t("welcomeTitle")}
      description={t("welcomeDescription")}
      buttons={
        <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleClose}>
          {t("welcomeConfirm")}
        </Button>
      }
    >
      <div className="flex justify-center">
        <CharacterFace size={100} />
      </div>
    </BottomSheet>
  )
}
