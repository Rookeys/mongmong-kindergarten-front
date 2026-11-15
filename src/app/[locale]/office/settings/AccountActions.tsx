"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { signOut } from "next-auth/react"
import { Button, Modal } from "@kojaem/mongmong"
import { useAuthWithdraw } from "@/apis/generated/auth/auth"
import { getErrorMessage } from "@/apis/instance"

const SIGN_IN_PATH = "/auth/sign-in"

/** 로그아웃·탈퇴 */
export default function AccountActions() {
  const t = useTranslations("settings")
  const withdraw = useAuthWithdraw()
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Refresh Token 폐기는 서버 라우트에서 한다 (src/app/api/auth/logout/route.ts). 실패해도 로그아웃은 진행
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    await signOut({ callbackUrl: SIGN_IN_PATH })
  }

  const handleWithdraw = () => {
    withdraw.mutate(undefined, {
      onSuccess: () => signOut({ callbackUrl: SIGN_IN_PATH })
    })
  }

  return (
    <div className="mt-auto flex flex-col gap-[8px] px-[20px] pb-[20px]">
      {withdraw.error && <p className="text-caption-lg text-text-danger">{getErrorMessage(withdraw.error)}</p>}
      <Button size="xl" color="brand" variant="fill" isFullWidth disabled={isLoggingOut} onClick={handleLogout}>
        {t("logout")}
      </Button>
      <button
        type="button"
        className="text-caption-lg text-text-tertiary py-[8px] underline"
        onClick={() => setIsWithdrawModalOpen(true)}
      >
        {t("withdraw")}
      </button>

      <Modal
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        title={t("withdrawTitle")}
        description={t("withdrawDescription")}
        buttons={
          <>
            <Button size="l" color="brand" variant="weak" isFullWidth onClick={() => setIsWithdrawModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              size="l"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={withdraw.isPending}
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
