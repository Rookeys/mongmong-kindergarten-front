"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, Chip, Toast } from "@kojaem/mongmong"
import { getErrorMessage } from "@/apis/fetcher"
import { REPORT_REASONS, reportLetter, type ReportReason } from "@/apis/letter"
import { DIALOG_SURFACE } from "@/constants/designSystemOverrides"
import { useToast } from "@/hooks/useToast"

/** 답장 신고. 사유는 선택 사항이다. (TODO: Figma에 신고 사유 화면이 없어 임시 구현) */
export default function ReportButton({ letterId }: { letterId: string }) {
  const t = useTranslations("lounge")
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>()
  const [isSending, setIsSending] = useState(false)
  const { toastMessage, showToast } = useToast()

  const toggleReason = (value: ReportReason) => {
    setReason(reason === value ? undefined : value)
  }

  const handleReport = async () => {
    setIsSending(true)
    try {
      await reportLetter(letterId, reason)
      showToast(t("reportDone"))
    } catch (error) {
      showToast(getErrorMessage(error))
    } finally {
      setIsSending(false)
      setIsOpen(false)
      setReason(undefined)
    }
  }

  return (
    <>
      <button type="button" className="text-subtitle-sm text-text-brand" onClick={() => setIsOpen(true)}>
        {t("report")}
      </button>
      {toastMessage && <Toast className="fixed bottom-28 left-1/2 z-10 -translate-x-1/2">{toastMessage}</Toast>}
      <BottomSheet
        className={DIALOG_SURFACE}
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t("reportTitle")}
        description={t("reportDescription")}
        buttons={
          <>
            <Button size="xl" color="brand" variant="weak" isFullWidth onClick={() => setIsOpen(false)}>
              {t("reportCancel")}
            </Button>
            <Button size="xl" color="brand" variant="fill" isFullWidth disabled={isSending} onClick={handleReport}>
              {t("report")}
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {REPORT_REASONS.map((value) => (
            <Chip key={value} kind="select" size="m" selected={reason === value} onClick={() => toggleReason(value)}>
              {t(`reason.${value}`)}
            </Chip>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
