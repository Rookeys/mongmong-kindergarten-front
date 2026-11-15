"use client"

import { slide } from "@/animations/slide"
import { sleep } from "@/utils/sleep"
import { motion } from "motion/react"
import { useEffect } from "react"

type Props = {
  step: string
  currentStep: string
  stringValue: string
  delay: number
  onNext: () => void
}

export default function Slide({ step, currentStep, stringValue, delay, onNext }: Props) {
  useEffect(() => {
    if (step !== currentStep) return

    const run = async () => {
      await sleep(delay)
      onNext()
    }
    run()
  }, [step, currentStep, delay, onNext])

  return (
    <motion.div
      className="absolute inset-0 w-full"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1, transition: slide.transition }}
    >
      <div className="absolute top-[421px] left-1/2 w-full -translate-x-1/2">
        <motion.p
          className="text-title-sm text-text-primary flex h-[96px] items-center justify-center text-center whitespace-pre-line"
          initial={slide.initial}
          animate={slide.animate}
          exit={slide.exit}
          transition={slide.transition}
        >
          {stringValue}
        </motion.p>
      </div>
    </motion.div>
  )
}
