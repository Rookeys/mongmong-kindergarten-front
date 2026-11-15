"use client"

import { useState } from "react"
import { useFormatter, useTranslations } from "next-intl"
import { BottomSheet, DatePicker } from "@kojaem/mongmong"
import { useRouter } from "@/i18n/navigation"
import { toDateString } from "@/utils/date"

interface Props {
  /** 지금 보고 있는 날짜 YYYY-MM-DD */
  date: string
  /** 고른 날짜로 이동할 경로. ?date=YYYY-MM-DD가 붙는다 */
  path: string
}

/**
 * 상단의 "2026년 5월 5일 ˅". 누르면 달력 시트에서 날짜를 바꾼다 (미래 날짜는 고를 수 없음).
 * TODO: Figma에 날짜 선택 UI가 없어 디자인시스템 달력으로 임시 구현 (TODO.md)
 */
export default function DateChangeTitle({ date, path }: Props) {
  const t = useTranslations("common")
  const format = useFormatter()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const selectedDate = new Date(`${date}T00:00:00`)

  const handleSelect = (nextDate: Date) => {
    setIsOpen(false)
    router.push(`${path}?date=${toDateString(nextDate)}`)
  }

  return (
    <>
      <button type="button" className="flex items-center gap-[6px]" onClick={() => setIsOpen(true)}>
        {format.dateTime(selectedDate, { dateStyle: "long" })}
        <img src="/assets/icons/arrow-down.png" alt="" width={16} height={16} className="rotate-90" />
      </button>
      <BottomSheet open={isOpen} onOpenChange={setIsOpen} title={t("pickDate")}>
        <DatePicker
          type="calendar"
          value={selectedDate}
          defaultMonth={selectedDate}
          maxDate={new Date()}
          onChange={handleSelect}
        />
      </BottomSheet>
    </>
  )
}
