"use client"

import { useTranslations } from "next-intl"
import { ReactNode, useEffect, useState } from "react"
import { LayoutGroup, motion } from "framer-motion"
import OnboardingSlides from "@/app/[locale]/auth/_components/OnboardingSlides"
import InputNickname from "@/app/[locale]/auth/_components/InputNickname"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { cn } from "@/utils/cn"
import { ONBOARDING_LAYOUT_ID } from "@/lib/providers/animationLayoutId/onboardingLayoutId"
import Button from "@/components/Button"

const FIRST_SCREEN_MS = 1500
const SCREEN_MS = 2500

interface Props {
  slides: ReactNode[]
  footer?: ReactNode
}

export default function SignUp({ session }: { session: Session | null }) {
  const t = useTranslations("sign-up")
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [sendNext, setSendNext] = useState<boolean>(false)
  const [nickname, setNickname] = useState("")
  const slides = [
    {
      printValues: t.raw("question"),
      footer: null
    },
    {
      printValues: "",
      footer: true
    },
    {
      printValues: t.raw("goodName"),
      footer: (
        <Button
          onClick={() => router.push("/auth/sign-up/bridge")}
          title={t("confirmButton")}
          size="XL"
          color="Brand"
          variant="Fill"
          disabled={false}
          width="full"
        />
      )
    }
  ]
  const lastStep = slides.length - 1

  useEffect(() => {
    if (step >= lastStep) return

    const delay = step === 0 ? FIRST_SCREEN_MS : SCREEN_MS

    const timer =
      slides[step].footer === null
        ? setTimeout(() => {
            setStep((s) => s + 1)
          }, delay)
        : sendNext && setStep((s) => s + 1) && setSendNext(false)

    return () => {
      if (typeof timer === "function") clearTimeout(timer)
    }
  }, [step, lastStep, sendNext])

  return (
    <LayoutGroup id="sign-up-flow">
      <div className="bg-background-default">
        <div className="text-title-sm text-text-primary relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-t from-white via-[#4B41CE] to-[#131049]">
          {step !== 1 && (
            <motion.img
              layoutId={ONBOARDING_LAYOUT_ID}
              src="/onboarding.gif"
              alt=""
              className="h-50 w-50"
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 34
              }}
            />
          )}
          {slides.map((slide, i) => (
            <div key={`slide-${i}`}>
              {step !== 1 && (
                <div
                  key={i}
                  className={cn(
                    `transform transition-all duration-700 ease-out`,
                    step === i && "translate-y-0 opacity-100",
                    step !== i && "translate-y-10 opacity-0"
                  )}
                >
                  <OnboardingSlides key={i} lines={slide.printValues} show={step === i} nickname={nickname} />
                </div>
              )}
              {step === i && !!slide.footer && (
                <div className="text-subtitle-lg absolute bottom-0 left-0 w-full p-5">{slide.footer}</div>
              )}
            </div>
          ))}
          {step === 1 && (
            <InputNickname show={step === 1} setSendNext={setSendNext} nickname={nickname} setNickname={setNickname} />
          )}
        </div>
      </div>
    </LayoutGroup>
  )
}
