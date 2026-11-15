import { z } from "zod"
import { MoodType } from "@/apis/generated/model"

export const MAX_ANSWER_LENGTH = 1000

/** 답장 쓰기 폼. 답장은 비우면 보낼 수 없고, 보내기 직전에 기분을 고른다 */
export const letterSchema = z.object({
  answer: z.string().trim().min(1).max(MAX_ANSWER_LENGTH),
  mood: z.enum(MoodType)
})

export type LetterFormValues = z.infer<typeof letterSchema>
