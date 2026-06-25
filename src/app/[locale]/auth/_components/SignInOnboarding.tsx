"use client"

import { useTranslations, useLocale } from "next-intl"
import { ReactNode, useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import OnboardingSlides from "@/app/[locale]/auth/_components/OnboardingSlides"
import { cn } from "@/utils/cn"
import Button from "@/components/Button"

const FIRST_SCREEN_MS = 1500
const SCREEN_MS = 2500

interface Props {
  printValues: string[]
  footer?: ReactNode
}

export default function OnboardingPage() {
  const t = useTranslations("login.onboarding")
  const tLogin = useTranslations("login")
  const locale = useLocale()
  const [step, setStep] = useState(0)
  const [isHello, setIsHello] = useState<boolean>(false)
  const slides: Props[] = [
    {
      printValues: t.raw("IntroduceCharacter"),
      footer: (
        <Button
          onClick={() => setIsHello(true)}
          title={t("helloMessage")}
          size="XL"
          color="Brand"
          variant="Fill"
          disabled={false}
          width="full"
        />
      )
    },
    {
      printValues: t.raw("IntroduceService1"),
      footer: null
    },
    {
      printValues: t.raw("IntroduceService2"),
      footer: null
    },
    {
      printValues: t.raw("IntroduceService3"),
      footer: null
    },
    {
      printValues: t.raw("IntroduceService4"),
      footer: null
    },
    {
      printValues: t.raw("login"),
      footer: (
        <div className="text-subtitle-lg mb-8.75 flex flex-col items-center justify-center">
          {/* <button
                        className="w-full mb-[10px] rounded border border-gray-300 p-[15px] text-sm"
                        onClick={() => signIn("google", { callbackUrl: `/${locale}/auth/sign-in` })}
                    >
                        {tLogin("oauthTitleGoogle")}
                    </button> */}

          <button
            className="mb-gap-xl flex w-full justify-center rounded-2xl bg-[#FEE500] p-4.25 text-[#262200]"
            onClick={() => signIn("kakao", { callbackUrl: `/${locale}/auth/sign-in` })}
          >
            <img src={"/signIn-logo-kakao.png"} className="mr-2 w-5" />
            {tLogin("oauthTitleKakao")}
          </button>
          <button
            onClick={() => {
              alert("guest")
            }}
            className="rounded-button-l text-text-brand bg-fill-brand-weak w-full p-4.25"
          >
            {tLogin("startGuest")}
          </button>
        </div>
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
        : isHello && setStep((s) => s + 1)

    return () => {
      if (typeof timer === "function") clearTimeout(timer)
    }
  }, [step, lastStep, isHello])

  return (
    <div className="text-title-sm text-text-primary relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-t from-white via-[#4B41CE] to-[#131049]">
      <img src="/onboarding.gif" className="h-50 w-50" />

      {slides.map((slide, i) => (
        <div key={`slide-${i}`}>
          <div
            key={i}
            className={cn(
              `transform transition-all duration-700 ease-out`,
              step === i && "translate-y-0 opacity-100",
              step !== i && "translate-y-3 opacity-0"
            )}
          >
            <OnboardingSlides key={i} lines={slide.printValues} show={step === i} />
          </div>
          {step === i && !!slide.footer && <div className="absolute bottom-0 left-0 w-full p-5">{slide.footer}</div>}
        </div>
      ))}
    </div>
  )
}
