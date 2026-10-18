"use client"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "motion/react"
import { nicknameSchema } from "@/validations/nicknameSchema"
import { Button, TextField } from "@kojaem/mongmong"

interface props {
  setSendNext: Dispatch<SetStateAction<"question" | "inputNicknmae" | "goodName">>
  onNext: (nickname: string) => void
}

interface nicknameI {
  nickname: string
}

export default function InputNickname({ setSendNext, onNext }: props) {
  const t = useTranslations("sign-up")
  const {
    setValue,
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
      </div>
      <div className="text-subtitle-lg absolute bottom-0 left-0 w-full py-5">
        <Button
          type="button"
          onClick={() => {
            if (!errors.nickname?.message) {
              onNext(watch("nickname"))
              setSendNext("goodName")
            }
          }}
          size="xl"
          color="brand"
          variant="fill"
          disabled={false}
          isFullWidth={true}
        >
          {t("nextButton")}
        </Button>
      </div>
    </motion.div>
  )
}
