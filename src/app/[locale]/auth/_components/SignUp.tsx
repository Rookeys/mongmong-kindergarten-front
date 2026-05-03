"use client"

import { useTranslations } from "next-intl"
import { ReactNode, useEffect, useState } from "react"
import { LayoutGroup, motion } from "framer-motion"
import OnboardingSlides from "@/app/[locale]/auth/_components/OnboardingSlides"
import InputNickname from "@/app/[locale]/auth/_components/InputNickname"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { cn } from "@/utils/cn"
import { ONBOARDING_LAYOUT_ID } from '@/lib/providers/animationLayoutId/onboardingLayoutId';

const FIRST_SCREEN_MS = 1500
const SCREEN_MS = 2500


interface Props {
    slides: ReactNode[]
    footer?: ReactNode
}

export default function SignUp({ session }: { session: Session | null }) {
    const t = useTranslations("sign-up")
    const router = useRouter();
    const [step, setStep] = useState(0)
    const [sendNext, setSendNext] = useState<boolean>(false)
    const slides = [
        {
            printValues: t.raw("question"),
            footer: null,
        },
        {
            printValues: "",
            footer: true,
        },
        {
            printValues: t.raw("goodName"),
            footer: (<button
                onClick={() => router.push('/auth/sign-up/bridge')}
                className="w-full rounded-2xl p-3.75 text-[17px] mb-5 text-white bg-[#6A62EA]"
            >
                {t("confirmButton")}
            </button>),
        },
    ]
    const lastStep = slides.length - 1

    useEffect(() => {
        if (step >= lastStep) return

        const delay = step === 0 ? FIRST_SCREEN_MS : SCREEN_MS

        const timer = slides[step].footer === null ? setTimeout(() => {
            setStep((s) => s + 1)
        }, delay) : (sendNext && setStep((s) => s + 1) && setSendNext(false))

        return () => {
            if (typeof timer === "function")
                clearTimeout(timer)
        }
    }, [step, lastStep, sendNext])


    return (
        <LayoutGroup id="sign-up-flow">
            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-title-sm text-[#575766]">
                {
                    step !== 1 &&
                    <motion.img
                        layoutId={ONBOARDING_LAYOUT_ID}
                        src="/onboarding.gif"
                        alt=""
                        className="w-50 h-50"
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 34,
                        }}
                    />
                }
                {slides.map((slide, i) => (
                    <div key={`slide-${i}`}>
                        {

                            step !== 1 && <div key={i} className={cn(`transform transition-all duration-700 ease-out`,
                                step === i && "translate-y-0 opacity-100", step !== i && "translate-y-10 opacity-0")}>
                                <OnboardingSlides
                                    key={i}
                                    lines={slide.printValues}
                                    show={step === i}
                                />
                            </div>
                        }
                        {step === i && !!slide.footer && (
                            <div className="text-subtitle-lg absolute bottom-0 left-0 w-full p-5">
                                {slide.footer}
                            </div>
                        )}
                    </div>
                ))}
                {
                    step === 1 && <InputNickname show={step === 1} setSendNext={setSendNext} />
                }
            </div>
        </LayoutGroup>
    )
}
