import { z } from "zod"

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .regex(/^[\p{L}\p{N}]+$/u, { message: "nameConditions2" }) // 특수문자, 공백 확인 정규식
    .refine((val) => !/[A-Z]/.test(val), {
      message: "nameConditions2"
    })
    .min(2, { message: "nameConditions1" })
    .max(8, { message: "nameConditions1" })
})

export type NicknmaeType = z.output<typeof nicknameSchema>
