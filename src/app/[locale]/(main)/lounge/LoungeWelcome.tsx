"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button } from "@kojaem/mongmong"
import { DIALOG_CLASS } from "@/constants/dialog"

const SEEN_KEY = "lounge-welcome-seen"

// 휴게실 첫 방문 안내. 기기별로 한 번만 보여준다.
export default function LoungeWelcome() {
  const t = useTranslations("lounge")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) setOpen(true)
    } catch {}
  }, [])

  const close = () => {
    setOpen(false)
    try {
      localStorage.setItem(SEEN_KEY, "1")
    } catch {}
  }

  return (
    <BottomSheet
      className={DIALOG_CLASS}
      open={open}
      onOpenChange={(next) => !next && close()}
      title={t("welcomeTitle")}
      description={t("welcomeDescription")}
      buttons={
        <Button size="xl" color="brand" variant="fill" isFullWidth onClick={close}>
          {t("welcomeConfirm")}
        </Button>
      }
    >
      <img src="/assets/images/character-face.png" alt="" width={100} height={100} className="mx-auto" />
    </BottomSheet>
  )
}
