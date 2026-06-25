"use client"
import { useTranslations } from "next-intl"
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { nicknameSchema } from "@/validations/nicknameSchema"
import { cn } from "@/utils/cn"
import { ONBOARDING_LAYOUT_ID } from "@/lib/providers/animationLayoutId/onboardingLayoutId"
import SingleLineTextField from "@/components/SingleLineTextField"
import Button from "@/components/Button"

interface props {
  show: boolean
  setSendNext: Dispatch<SetStateAction<boolean>>
  nickname: string
  setNickname: Dispatch<SetStateAction<string>>
}

interface nicknameI {
  nickname: string
}

export default function InputNickname({ show, setSendNext, nickname, setNickname }: props) {
  const t = useTranslations("sign-up")
  const {
    setValue,
    trigger,
    watch,
    formState: { errors }
  } = useForm<nicknameI>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: {
      nickname: ""
    }
  })
  const errorMsg = useMemo(() => {
    return errors.nickname?.message && t(errors.nickname?.message)
  }, [errors.nickname?.message])

  useEffect(() => {
    trigger("nickname")
  }, [])

  useEffect(() => {
    setValue("nickname", nickname, { shouldValidate: true })
  }, [nickname, setValue])

  return (
    <div
      className={cn(
        `flex h-screen w-screen transform flex-col items-center justify-start transition-all duration-1000 ease-out`,
        show && "translate-y-0 opacity-100",
        !show && "translate-y-3 opacity-0"
      )}
    >
      <motion.img
        layoutId={ONBOARDING_LAYOUT_ID}
        src="/onboarding.gif"
        alt=""
        className="mt-14 h-25 w-25"
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 34
        }}
      />
      <span className="mt-gap-m">{t("name")}</span>
      <div className="w-full pt-6 pr-5 pl-5">
        <SingleLineTextField
          value={watch("nickname")}
          placeholder={t("namePlaceholder")}
          onChange={(value) => {
            const nextNickname = value
            setValue("nickname", nextNickname, { shouldValidate: true })
            setNickname(nextNickname)
          }}
          clearAble={true}
          errorMsg={errorMsg}
        />
      </div>
      <div className="text-subtitle-lg absolute bottom-0 left-0 w-full p-5">
        <Button
          onClick={() => !errors.nickname?.message && setSendNext(true)}
          title={t("nextButton")}
          size="XL"
          color="Brand"
          variant="Fill"
          disabled={false}
          width="full"
        />
      </div>
    </div>
  )
}
