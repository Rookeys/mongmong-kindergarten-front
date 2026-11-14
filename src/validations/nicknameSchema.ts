import { z } from "zod"

export const nicknameSchema = (t: (key: "nameConditions1" | "nameConditions2") => string) =>
  z.object({
    nickname: z
      .string()
      // 백엔드 NICKNAME_PATTERN(^[a-z0-9가-힣]{2,8}$)과 같게 유지
      .regex(/^[a-z0-9가-힣]*$/, { message: t("nameConditions2") })
      .min(2, { message: t("nameConditions1") })
      .max(8, { message: t("nameConditions1") })
  })

export type NicknmaeType = z.infer<ReturnType<typeof nicknameSchema>>
