"use client"

import { slide } from "@/animations/slide"
import { motion } from "motion/react"
import { ReactNode } from "react"

type Props = {
  step:
    | "introduceCharacter"
    | "dailyLetterIntro"
    | "letterExampleIntro"
    | "rewardCustomizationIntro"
    | "replyChanceIntro"
    | "loginMemoryIntro"
    | "question"
    | "inputNicknmae"
    | "goodName"
  currentStep:
    | "introduceCharacter"
    | "dailyLetterIntro"
    | "letterExampleIntro"
    | "rewardCustomizationIntro"
    | "replyChanceIntro"
    | "loginMemoryIntro"
    | "question"
    | "inputNicknmae"
    | "goodName"
  stringValue: string
  buttonEl: ReactNode
}

export default function SlideWithButton({ step, currentStep, stringValue, buttonEl }: Props) {
  return (
    <motion.div
      className="absolute inset-0 w-full"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1, transition: slide.transition }}
    >
      <div className="absolute top-[421px] left-1/2 w-full -translate-x-1/2">
        <motion.p
          className="text-title-sm text-text-primary flex h-24 items-center justify-center text-center whitespace-pre-line"
          initial={slide.initial}
          animate={slide.animate}
          exit={slide.exit}
          transition={slide.transition}
        >
          {stringValue}
        </motion.p>
      </div>
      {step === currentStep && (
        <div className="absolute bottom-0 left-0 w-full py-5">{buttonEl}</div>
      )}
    </motion.div>
  )
}
