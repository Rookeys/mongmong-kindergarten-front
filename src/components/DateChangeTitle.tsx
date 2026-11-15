"use client"

import { useState } from "react"
import { useFormatter, useTranslations } from "next-intl"
import { BottomSheet, Button, DatePicker } from "@kojaem/mongmong"
import { useRouter } from "@/i18n/navigation"
import { toDateString, toKstDate } from "@/utils/date"

const FIRST_YEAR = 2025

interface Props {
  /** 지금 보고 있는 날짜 YYYY-MM-DD */
  date: string
  /** 고른 날짜로 이동할 경로. ?date=YYYY-MM-DD가 붙는다 */
  path: string
}

/**
 * 상단의 "2026년 5월 5일 ˅". 누르면 시트에서 날짜를 바꾼다. 미래 날짜를 고르면 오늘로 맞춘다.
 * TODO: Figma에 날짜 선택 UI가 없어 임시 구현 (TODO.md). 디자인시스템 달력은 어두운 화면용이라
 * 밝은 바텀시트 안에서는 휠을 쓴다 (일지 "달 선택"과 같은 방식).
 */
export default function DateChangeTitle({ date, path }: Props) {
  const t = useTranslations("common")
  const format = useFormatter()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => new Date(`${date}T00:00:00`))

  const handleConfirm = () => {
    setIsOpen(false)
    const today = toKstDate()
    const picked = toDateString(selectedDate)
    router.push(`${path}?date=${picked > today ? today : picked}`)
  }

  return (
    <>
      <button type="button" className="flex items-center gap-[6px]" onClick={() => setIsOpen(true)}>
        {format.dateTime(new Date(`${date}T00:00:00`), { dateStyle: "long" })}
        <img src="/assets/icons/arrow-down.png" alt="" width={16} height={16} className="rotate-90" />
      </button>
      <BottomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t("pickDate")}
        buttons={
          <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleConfirm}>
            {t("confirm")}
          </Button>
        }
      >
        <DatePicker
          type="wheel"
          value={selectedDate}
          onChange={setSelectedDate}
          minYear={FIRST_YEAR}
          maxYear={new Date().getFullYear()}
        />
      </BottomSheet>
    </>
  )
}
