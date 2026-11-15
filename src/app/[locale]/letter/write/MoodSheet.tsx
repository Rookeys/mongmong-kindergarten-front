"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, GridList, GridListItem } from "@kojaem/mongmong"
import { MoodType } from "@/apis/generated/model"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSending: boolean
  errorMessage?: string
  onConfirm: (mood: MoodType) => void
}

/** 답장을 보내기 전 오늘의 기분 선택 (월간 캘린더에 표시됨) */
export default function MoodSheet({ open, onOpenChange, isSending, errorMessage, onConfirm }: Props) {
  const t = useTranslations("letterWrite")
  const tMood = useTranslations("mood")
  const [selectedMood, setSelectedMood] = useState<MoodType>()

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("moodTitle")}
      description={t("moodDescription")}
      buttons={
        <div className="flex w-full flex-col gap-2">
          {errorMessage && <p className="text-caption-lg text-text-danger">{errorMessage}</p>}
          <Button
            size="xl"
            color="brand"
            variant="fill"
            isFullWidth
            disabled={!selectedMood || isSending}
            onClick={() => selectedMood && onConfirm(selectedMood)}
          >
            {t("moodConfirm")}
          </Button>
        </div>
      }
    >
      <GridList columns="3">
        {Object.values(MoodType).map((mood) => (
          <GridListItem
            key={mood}
            image={<img src="/assets/images/mood-placeholder.png" alt="" width={40} height={40} />}
            label={tMood(mood)}
            selected={selectedMood === mood}
            onClick={() => setSelectedMood(mood)}
          />
        ))}
      </GridList>
    </BottomSheet>
  )
}
