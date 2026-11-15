"use client"

import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { Button, TextField } from "@kojaem/mongmong"
import { useAuthUpdateMe } from "@/apis/generated/auth/auth"
import { getErrorCode, getErrorMessage } from "@/apis/instance"
import { nicknameSchema, type NicknameFormValues } from "@/validations/nicknameSchema"

/** 회원가입: 이름(닉네임)과 친구 초대 코드 입력. 저장되면 onComplete */
export default function InputNickname({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations("sign-up")
  const { update: updateSession } = useSession()
  const updateMe = useAuthUpdateMe()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema(t)),
    mode: "onChange",
    defaultValues: { nickname: "", friendInviteCode: "" }
  })

  const onSubmit = ({ nickname, friendInviteCode }: NicknameFormValues) => {
    updateMe.mutate(
      { data: { nickname, friendInviteCode: friendInviteCode || undefined } },
      {
        onSuccess: async () => {
          await updateSession({ nickname })
          onComplete()
        },
        // 초대 코드 오류(INVITE_*)는 초대 코드 칸에, 나머지는 닉네임 칸에 보여준다
        onError: (error) => {
          const field = getErrorCode(error)?.startsWith("INVITE") ? "friendInviteCode" : "nickname"
          setError(field, { message: getErrorMessage(error) })
        }
      }
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute inset-0 flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mt-14 h-25 w-25 shrink-0" aria-hidden />
      <span className="mt-gap-m">{t("name")}</span>
      <div className="flex w-full flex-col gap-4 px-5 pt-6">
        <TextField
          {...register("nickname")}
          placeholder={t("namePlaceholder")}
          error={Boolean(errors.nickname)}
          helperText={errors.nickname?.message}
        />
        {/* TODO: Figma에 없는 임시 입력칸 (TODO.md). 친구가 첫 일지를 쓰면 초대한 사람과 나 모두 꿈조각을 받는다 */}
        <TextField
          {...register("friendInviteCode")}
          label={t("inviteCodeLabel")}
          placeholder={t("inviteCodePlaceholder")}
          error={Boolean(errors.friendInviteCode)}
          helperText={errors.friendInviteCode?.message}
        />
      </div>
      <div className="text-subtitle-lg absolute bottom-0 left-0 w-full py-5">
        <Button
          type="submit"
          size="xl"
          color="brand"
          variant="fill"
          isFullWidth
          disabled={!isValid || updateMe.isPending}
        >
          {t("nextButton")}
        </Button>
      </div>
    </motion.form>
  )
}
