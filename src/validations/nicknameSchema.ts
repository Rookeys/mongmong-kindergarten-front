import { z } from "zod"

export const nicknameSchema = (t: (key: "nameConditions1" | "nameConditions2") => string) =>
  z.object({
    nickname: z
      .string()
      // 백엔드 NICKNAME_PATTERN과 같게 유지 (한글·일본어·영문 소문자·숫자)
      .regex(/^[a-z0-9가-힣\u3041-\u3096\u30A1-\u30FA\u30FC\u4E00-\u9FFF]*$/, { message: t("nameConditions2") })
      .min(2, { message: t("nameConditions1") })
      .max(8, { message: t("nameConditions1") })
  })

export type NicknmaeType = z.infer<ReturnType<typeof nicknameSchema>>
