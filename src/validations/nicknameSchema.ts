import { z } from "zod"

export const nicknameSchema = (t: (key: "nameConditions1" | "nameConditions2") => string) =>
  z.object({
    nickname: z
      .string()
      .regex(/^[\p{L}\p{N}]+$/u, { message: t("nameConditions2") })
      .refine((val) => !/[A-Z]/.test(val), {
        message: t("nameConditions2")
      })
      .min(2, { message: t("nameConditions1") })
      .max(8, { message: t("nameConditions1") })
  })

export type NicknmaeType = z.infer<ReturnType<typeof nicknameSchema>>
