"use client"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "motion/react"
import { nicknameSchema } from "@/validations/nicknameSchema"
import { Button, TextField } from "@kojaem/mongmong"
import { api, ApiError } from "@/utils/api"

interface props {
  setSendNext: Dispatch<SetStateAction<"question" | "inputNicknmae" | "goodName" | "bridge">>
  onNext: (nickname: string) => void
}

interface nicknameI {
  nickname: string
}

export default function InputNickname({ setSendNext, onNext }: props) {
  const t = useTranslations("sign-up")
  const { data: session, update } = useSession()
  const [submitting, setSubmitting] = useState(false)
  // TODO: Figma에 없는 임시 입력칸 (TODO.md). 첫 일지를 쓰면 초대한 사람과 나 모두 꿈조각을 받는다.
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
          onClick={async () => {
            if (errors.nickname?.message) return
            const nickname = watch("nickname")
            setSubmitting(true)
            try {
              setInviteError(undefined)
              const friendInviteCode = inviteCode.trim() || undefined
              await api("/auth/me", { method: "PATCH", token: session?.access_token, body: { nickname, friendInviteCode } })
              await update({ nickname })
              onNext(nickname)
              setSendNext("goodName")
            } catch (error) {
              const message = error instanceof ApiError ? error.message : String(error)
              if (error instanceof ApiError && error.code.startsWith("INVITE")) setInviteError(message)
              else setError("nickname", { message })
            } finally {
              setSubmitting(false)
            }
          }}
          size="xl"
          color="brand"
          variant="fill"
          disabled={submitting}
          isFullWidth={true}
        >
          {t("nextButton")}
        </Button>
      </div>
    </motion.div>
  )
}
