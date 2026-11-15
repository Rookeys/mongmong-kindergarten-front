"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BottomSheet, Button, Chip, Toast } from "@kojaem/mongmong"
import { useLetterAddReport } from "@/apis/generated/letters/letters"
import { LetterReportReasonType } from "@/apis/generated/model"
import { getErrorMessage } from "@/apis/instance"
import { useToast } from "@/hooks/useToast"
import { reportSchema, type ReportFormValues } from "@/validations/reportSchema"

/** 답장 신고. 사유는 선택 사항이다. (TODO: Figma에 신고 사유 화면이 없어 임시 구현) */
export default function ReportButton({ letterId }: { letterId: string }) {
  const t = useTranslations("lounge")
  const [isOpen, setIsOpen] = useState(false)
  const addReport = useLetterAddReport()
  const { toastMessage, showToast } = useToast()
  const { control, handleSubmit, reset } = useForm<ReportFormValues>({ resolver: zodResolver(reportSchema) })

  const closeSheet = () => {
    setIsOpen(false)
    reset()
  }

  const onSubmit = ({ reasonType }: ReportFormValues) => {
    addReport.mutate(
      { id: letterId, data: { reasonType } },
      {
        onSuccess: () => showToast(t("reportDone")),
        // 이미 신고한 글 등은 백엔드 문구를 그대로 보여준다
        onError: (error) => showToast(getErrorMessage(error)),
        onSettled: closeSheet
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
        onOpenChange={(open) => (open ? setIsOpen(true) : closeSheet())}
        title={t("reportTitle")}
        description={t("reportDescription")}
        buttons={
          <>
            <Button size="xl" color="brand" variant="weak" isFullWidth onClick={closeSheet}>
              {t("reportCancel")}
            </Button>
            <Button
              size="xl"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={addReport.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {t("report")}
            </Button>
          </>
        }
      >
        <Controller
          name="reasonType"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {Object.values(LetterReportReasonType).map((reason) => (
                <Chip
                  key={reason}
                  kind="select"
                  size="m"
                  selected={field.value === reason}
                  // 같은 사유를 다시 누르면 선택 해제
                  onClick={() => field.onChange(field.value === reason ? undefined : reason)}
                >
                  {t(`reason.${reason}`)}
                </Chip>
              ))}
            </div>
          )}
        />
      </BottomSheet>
    </>
  )
}
