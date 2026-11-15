import { z } from "zod"

type NicknameMessageKey = "nameConditions1" | "nameConditions2"

/** 이름 작성 폼. 닉네임 규칙은 백엔드 NICKNAME_PATTERN과 같게 유지한다 (한글·일본어·영문 소문자·숫자, 2~8자) */
export const nicknameSchema = (t: (key: NicknameMessageKey) => string) =>
  z.object({
    nickname: z
      .string()
      .regex(/^[a-z0-9가-힣ぁ-ゖァ-ヺー一-鿿]*$/, { message: t("nameConditions2") })
      .min(2, { message: t("nameConditions1") })
      .max(8, { message: t("nameConditions1") }),
    /** 친구 초대 코드 (선택) */
    friendInviteCode: z.string().trim().max(20)
  })

export type NicknameFormValues = z.infer<ReturnType<typeof nicknameSchema>>
