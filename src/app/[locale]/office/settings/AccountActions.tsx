"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button, Modal } from "@kojaem/mongmong"
import { deleteMe } from "@/apis/auth"
import { getErrorMessage } from "@/apis/fetcher"
import { DIALOG_SURFACE } from "@/constants/designSystemOverrides"

/** 로그아웃·탈퇴. 둘 다 끝나면 onSignOut으로 세션을 지운다. */
export default function AccountActions({ onSignOut }: { onSignOut: () => Promise<unknown> }) {
  const t = useTranslations("settings")
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleLogout = async () => {
    setIsProcessing(true)
    // Refresh Token 폐기는 서버 라우트에서 한다 (src/app/api/auth/logout/route.ts). 실패해도 로그아웃은 진행
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    await onSignOut()
  }

  const handleWithdraw = async () => {
    setIsProcessing(true)
    try {
      await deleteMe()
      await onSignOut()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setIsProcessing(false)
    }
  }

  return (
    <div className="mt-auto flex flex-col gap-2 px-5 pb-5">
      {errorMessage && <p className="text-caption-lg text-text-danger">{errorMessage}</p>}
      <Button size="xl" color="brand" variant="fill" isFullWidth disabled={isProcessing} onClick={handleLogout}>
        {t("logout")}
      </Button>
      <button
        type="button"
        className="text-caption-lg text-text-tertiary py-2 underline"
        onClick={() => setIsWithdrawModalOpen(true)}
      >
        {t("withdraw")}
      </button>

      <Modal
        className={DIALOG_SURFACE}
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        title={t("withdrawTitle")}
        description={t("withdrawDescription")}
        buttons={
          <>
            <Button
              size="l"
              className="whitespace-nowrap"
              color="brand"
              variant="weak"
              isFullWidth
              onClick={() => setIsWithdrawModalOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              size="l"
              className="whitespace-nowrap"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={isProcessing}
              onClick={handleWithdraw}
            >
              {t("withdrawConfirm")}
            </Button>
          </>
        }
      />
    </div>
  )
}
