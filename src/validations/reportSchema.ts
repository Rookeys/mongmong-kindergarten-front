import { z } from "zod"
import { LetterReportReasonType } from "@/apis/generated/model"

/** 답장 신고 폼. 사유는 선택 사항이다 */
export const reportSchema = z.object({
  reasonType: z.enum(LetterReportReasonType).optional()
})

export type ReportFormValues = z.infer<typeof reportSchema>
