"use client"

import { useTranslations, useLocale } from "next-intl"
import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { signIn } from "next-auth/react"
import { Button } from "@kojaem/mongmong"
import { Link } from "@/i18n/navigation"
import Slide from "@/app/[locale]/auth/components/Slide"
import SlideWithButton from "@/app/[locale]/auth/components/SlideWithButton"

const SCREEN_MS = 2500

export default function OnboardingPage() {
  const t = useTranslations("login.onboarding")
  const tLogin = useTranslations("login")
  const locale = useLocale()
  const [step, setStep] = useState<
    | "introduceCharacter"
    | "dailyLetterIntro"
    | "letterExampleIntro"
    | "rewardCustomizationIntro"
    | "replyChanceIntro"
    | "loginMemoryIntro"
  >("introduceCharacter")

  return (
    <div
      className="text-title-sm text-text-primary relative flex min-h-screen w-full flex-col justify-start overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/images/background.png')"
      }}
    >
      <img src="/onboarding.gif" className="mx-auto mt-[197px] h-[200px] w-[200px]" />
      <AnimatePresence mode="wait">
        {step === "introduceCharacter" && (
          <SlideWithButton
            key={step}
            step={"introduceCharacter"}
            currentStep={step}
            stringValue={t("introduceCharacter", { character: t("placeholderCharacter") })}
            buttonEl={
              <Button
                type="button"
                onClick={() => setStep("dailyLetterIntro")}
                size="xl"
                color="brand"
                variant="fill"
                isFullWidth={true}
              >
                {t("helloMessage")}
              </Button>
            }
          />
        )}
        {step === "dailyLetterIntro" && (
          <Slide
            key={step}
            step={"dailyLetterIntro"}
            currentStep={step}
            stringValue={t("dailyLetterIntro")}
            delay={SCREEN_MS}
            onNext={() => setStep("letterExampleIntro")}
          />
        )}
        {step === "letterExampleIntro" && (
          <Slide
            key={step}
            step={"letterExampleIntro"}
            currentStep={step}
            stringValue={t("letterExampleIntro")}
            delay={SCREEN_MS}
            onNext={() => setStep("rewardCustomizationIntro")}
          />
        )}
        {step === "rewardCustomizationIntro" && (
          <Slide
            key={step}
            step={"rewardCustomizationIntro"}
            currentStep={step}
            stringValue={t("rewardCustomizationIntro", { reward: t("placeholderReward") })}
            delay={SCREEN_MS}
            onNext={() => setStep("replyChanceIntro")}
          />
        )}
        {step === "replyChanceIntro" && (
          <Slide
            key={step}
            step={"replyChanceIntro"}
            currentStep={step}
            stringValue={t("replyChanceIntro")}
            delay={SCREEN_MS}
            onNext={() => setStep("loginMemoryIntro")}
          />
        )}
        {step === "loginMemoryIntro" && (
          <SlideWithButton
            key={step}
            step={"loginMemoryIntro"}
            currentStep={step}
            stringValue={t("loginMemoryIntro")}
            buttonEl={
              <div className="text-subtitle-lg mb-[35px] flex flex-col items-center justify-center">
                <button
                  className="mb-gap-xl flex w-full justify-center rounded-[16px] bg-[#FEE500] p-[17px] text-[#262200]"
                  onClick={() => signIn("kakao", { callbackUrl: `/${locale}/auth/sign-in` })}
                >
                  <img src={"/signIn-logo-kakao.png"} className="mr-[8px] w-[20px]" />
                  {tLogin("oauthTitle", { serviceName: "Kakao" })}
                </button>
                {/* 비회원은 오늘 질문만 볼 수 있다 (답장은 로그인 필요) */}
                <Link
                  href="/guest"
                  className="rounded-button-l text-text-brand bg-fill-brand-weak w-full p-[17px] text-center"
                >
                  {tLogin("startGuest")}
                </Link>
              </div>
            }
          />
        )}
      </AnimatePresence>
    </div>
  )
}
