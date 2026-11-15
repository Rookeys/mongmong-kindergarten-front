"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, Chip, Toast } from "@kojaem/mongmong"
import { useLetterAddReport } from "@/apis/generated/letters/letters"
import { LetterReportReasonType } from "@/apis/generated/model"
import { getErrorMessage } from "@/apis/instance"
import { useToast } from "@/hooks/useToast"

/** 답장 신고. 사유는 선택 사항이다. (TODO: Figma에 신고 사유 화면이 없어 임시 구현) */
export default function ReportButton({ letterId }: { letterId: string }) {
  const t = useTranslations("lounge")
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<LetterReportReasonType>()
  const addReport = useLetterAddReport()
  const { toastMessage, showToast } = useToast()

  const toggleReason = (value: LetterReportReasonType) => {
    setReason(reason === value ? undefined : value)
  }

  const handleReport = () => {
    addReport.mutate(
      { id: letterId, data: { reasonType: reason } },
      {
        onSuccess: () => showToast(t("reportDone")),
        // 이미 신고한 글 등은 백엔드 문구를 그대로 보여준다
        onError: (error) => showToast(getErrorMessage(error)),
        onSettled: () => {
          setIsOpen(false)
          setReason(undefined)
        }
      }
    )
  }

  return (
    <>
      <button type="button" className="text-subtitle-sm text-text-brand" onClick={() => setIsOpen(true)}>
        {t("report")}
      </button>
      {toastMessage && <Toast className="fixed bottom-28 left-1/2 z-10 -translate-x-1/2">{toastMessage}</Toast>}
      <BottomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t("reportTitle")}
        description={t("reportDescription")}
        buttons={
          <>
            <Button size="xl" color="brand" variant="weak" isFullWidth onClick={() => setIsOpen(false)}>
              {t("reportCancel")}
            </Button>
            <Button
              size="xl"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={addReport.isPending}
              onClick={handleReport}
            >
              {t("report")}
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {Object.values(LetterReportReasonType).map((value) => (
            <Chip key={value} kind="select" size="m" selected={reason === value} onClick={() => toggleReason(value)}>
              {t(`reason.${value}`)}
            </Chip>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
