"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { BottomSheet, Button, Chip, Toast } from "@kojaem/mongmong"
import { DIALOG_CLASS } from "@/constants/dialog"
import { api, ApiError } from "@/utils/api"
import { sleep } from "@/utils/sleep"

const REASONS = ["spam", "abuse", "inappropriate", "other"] as const

// TODO: Figma에 신고 사유 선택 화면이 없어 임시 구현 (TODO.md). 사유는 선택 사항이다.
export default function ReportButton({ letterId }: { letterId: string }) {
  const t = useTranslations("lounge")
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<(typeof REASONS)[number]>()
  const [toast, setToast] = useState<string>()
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (toast) sleep(2500).then(() => setToast(undefined))
  }, [toast])

  const report = async () => {
    setSending(true)
    try {
      await api(`/letters/${letterId}/reports`, { method: "POST", token: session?.access_token, body: { reasonType: reason } })
      setToast(t("reportDone"))
    } catch (e) {
      setToast(e instanceof ApiError ? e.message : String(e))
    } finally {
      setSending(false)
      setOpen(false)
      setReason(undefined)
    }
  }

  return (
    <>
      <button type="button" className="text-subtitle-sm text-text-brand" onClick={() => setOpen(true)}>
        {t("report")}
      </button>
      {toast && <Toast className="fixed bottom-28 left-1/2 z-10 -translate-x-1/2">{toast}</Toast>}
      <BottomSheet
        className={DIALOG_CLASS}
        open={open}
        onOpenChange={setOpen}
        title={t("reportTitle")}
        description={t("reportDescription")}
        buttons={
          <>
            <Button size="xl" color="brand" variant="weak" isFullWidth onClick={() => setOpen(false)}>
              {t("reportCancel")}
            </Button>
            <Button size="xl" color="brand" variant="fill" isFullWidth disabled={sending} onClick={report}>
              {t("report")}
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {REASONS.map((value) => (
            <Chip
              key={value}
              kind="select"
              size="m"
              selected={reason === value}
              onClick={() => setReason(reason === value ? undefined : value)}
            >
              {t(`reason.${value}`)}
            </Chip>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
