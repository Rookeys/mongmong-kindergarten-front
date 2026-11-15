"use client"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "motion/react"
import { nicknameSchema } from "@/validations/nicknameSchema"
import { Button, TextField } from "@kojaem/mongmong"
import { useAuthUpdateMe } from "@/apis/generated/auth/auth"
import { getErrorCode, getErrorMessage } from "@/apis/instance"

interface props {
  setSendNext: Dispatch<SetStateAction<"question" | "inputNicknmae" | "goodName" | "bridge">>
  onNext: (nickname: string) => void
}

interface nicknameI {
  nickname: string
}

export default function InputNickname({ setSendNext, onNext }: props) {
  const t = useTranslations("sign-up")
  const { update: updateSession } = useSession()
  const updateMe = useAuthUpdateMe()
  // TODO: Figma에 없는 임시 입력칸 (TODO.md). 친구가 첫 일지를 쓰면 초대한 사람과 나 모두 꿈조각을 받는다.
  const [inviteCode, setInviteCode] = useState("")
  const [inviteError, setInviteError] = useState<string>()
  const {
    setValue,
    setError,
    trigger,
    watch,
    formState: { errors }
  } = useForm<nicknameI>({
    resolver: zodResolver(nicknameSchema(t)),
    mode: "onChange",
    defaultValues: {
      nickname: ""
    }
  })

  useEffect(() => {
    trigger("nickname")
  }, [])

  const handleNext = () => {
    if (errors.nickname?.message) return
    const nickname = watch("nickname")
    setInviteError(undefined)
    updateMe.mutate(
      { data: { nickname, friendInviteCode: inviteCode.trim() || undefined } },
      {
        onSuccess: async () => {
          await updateSession({ nickname })
          onNext(nickname)
          setSendNext("goodName")
        },
        onError: (error) => {
          // 초대 코드 오류(INVITE_*)는 초대 코드 칸에, 나머지는 닉네임 칸에 보여준다
          if (getErrorCode(error)?.startsWith("INVITE")) {
            setInviteError(getErrorMessage(error))
          } else {
            setError("nickname", { message: getErrorMessage(error) })
          }
        }
      }
    )
  }

  return (
    <motion.div
      className="absolute inset-0 flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mt-14 h-25 w-25 shrink-0" aria-hidden />
      <span className="mt-gap-m">{t("name")}</span>
      <div className="w-full pt-6 pr-5 pl-5">
        <TextField
          value={watch("nickname")}
          placeholder={t("namePlaceholder")}
          onChange={(event) => {
            setValue("nickname", event.target.value, { shouldValidate: true })
          }}
          error={Boolean(errors.nickname?.message)}
          helperText={errors.nickname?.message}
        />
        <div className="pt-4">
          <TextField
            label={t("inviteCodeLabel")}
            value={inviteCode}
            placeholder={t("inviteCodePlaceholder")}
            onChange={(event) => setInviteCode(event.target.value)}
            error={Boolean(inviteError)}
            helperText={inviteError}
          />
        </div>
      </div>
      <div className="text-subtitle-lg absolute bottom-0 left-0 w-full py-5">
        <Button
          type="button"
          onClick={handleNext}
          size="xl"
          color="brand"
          variant="fill"
          disabled={updateMe.isPending}
          isFullWidth={true}
        >
          {t("nextButton")}
        </Button>
      </div>
    </motion.div>
  )
}
