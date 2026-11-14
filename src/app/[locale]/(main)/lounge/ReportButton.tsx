"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { Button, Modal } from "@kojaem/mongmong"
import { DIALOG_CLASS } from "@/constants/dialog"
import { api, ApiError } from "@/utils/api"

// TODO: 신고 사유 선택 UI (Figma 없음, TODO.md). 지금은 사유 없이 신고한다.
export default function ReportButton({ letterId }: { letterId: string }) {
  const t = useTranslations("lounge")
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<string>()
  const [sending, setSending] = useState(false)

  const report = async () => {
    setSending(true)
    try {
      await api(`/letters/${letterId}/reports`, { method: "POST", token: session?.access_token, body: {} })
      setResult(t("reportDone"))
    } catch (e) {
      setResult(e instanceof ApiError ? e.message : String(e))
    } finally {
      setSending(false)
    }
  }

  const close = () => {
    setOpen(false)
    setResult(undefined)
  }

  return (
    <>
      <button type="button" className="text-subtitle-sm text-text-brand" onClick={() => setOpen(true)}>
        {t("report")}
      </button>
      <Modal
        className={DIALOG_CLASS}
        open={open}
        onOpenChange={(next) => !next && close()}
        title={result ?? t("reportTitle")}
        description={result ? undefined : t("reportDescription")}
        buttons={
          result ? (
            <Button size="l" color="brand" variant="fill" isFullWidth onClick={close}>
              {t("reportClose")}
            </Button>
          ) : (
            <>
              <Button size="l" className="whitespace-nowrap" color="brand" variant="weak" isFullWidth onClick={close}>
                {t("reportCancel")}
              </Button>
              <Button size="l" className="whitespace-nowrap" color="brand" variant="fill" isFullWidth disabled={sending} onClick={report}>
                {t("report")}
              </Button>
            </>
          )
        }
      />
    </>
  )
}
