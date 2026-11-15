"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import InputNickname from "@/app/[locale]/auth/components/InputNickname"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { cn } from "@/utils/cn"
import { Button } from "@kojaem/mongmong"
import Slide from "./Slide"
import SlideWithButton from "./SlideWithButton"

const SCREEN_MS = 2500

const imageTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 34
}

export default function SignUp({ session }: { session: Session | null }) {
  const t = useTranslations("sign-up")
  const locale = useLocale()
  const router = useRouter()
  const [step, setStep] = useState<"question" | "inputNicknmae" | "goodName" | "bridge">("question")
  const [nickname, setNickname] = useState("")

  return (
    <div className="bg-background-default">
      <div
        className="text-title-sm text-text-primary relative flex min-h-screen w-full flex-col justify-start overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/images/background.png')"
        }}
      >
        <motion.img
          layout
          src="/onboarding.gif"
          alt=""
          className={cn("mx-auto", step === "inputNicknmae" ? "mt-[54px] h-25 w-25" : "mt-[197px] h-50 w-50")}
          transition={imageTransition}
        />
        <AnimatePresence mode="wait">
          {step === "question" && (
            <Slide
              key="question"
              step="question"
              currentStep={step}
              stringValue={t("question")}
              delay={SCREEN_MS}
              onNext={() => setStep("inputNicknmae")}
            />
          )}
          {step === "inputNicknmae" && <InputNickname key="inputNicknmae" setSendNext={setStep} onNext={setNickname} />}
          {step === "goodName" && (
            <SlideWithButton
              key="goodName"
              step="goodName"
              currentStep={step}
              stringValue={t("goodName", { name: nickname })}
              buttonEl={
                <Button
                  type="button"
                  onClick={() => setStep("bridge")}
                  size="xl"
                  color="brand"
                  variant="fill"
                  disabled={false}
                  isFullWidth={true}
                >
                  {t("confirmButton")}
                </Button>
              }
            />
          )}
          {step === "bridge" && (
            <Slide
              key="bridge"
              step="bridge"
              currentStep={step}
              stringValue={t("bridge", { name: nickname })}
              delay={SCREEN_MS}
              onNext={() => router.replace(`/${locale}`)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
