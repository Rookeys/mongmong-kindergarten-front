"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, DatePicker } from "@kojaem/mongmong"
import { useRouter } from "@/i18n/navigation"

const FIRST_YEAR = 2025

interface Props {
  title: string
  year: number
  month: number
}

/** 일지 상단 "2026년 5월 ˅". 누르면 달을 고르는 시트가 열린다. */
export default function MonthPicker({ title, year, month }: Props) {
  const t = useTranslations("diary")
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date(year, month - 1, 1))

  const handleConfirm = () => {
    setIsOpen(false)
    const selectedMonth = String(selectedDate.getMonth() + 1).padStart(2, "0")
    router.push(`/diary?month=${selectedDate.getFullYear()}-${selectedMonth}`)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-subtitle-lg text-text-primary flex items-center gap-[6px]"
      >
        {title}
        <img src="/assets/icons/arrow-down.png" alt="" width={16} height={16} className="rotate-90" />
      </button>
      <BottomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t("pickMonth")}
        buttons={
          <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleConfirm}>
            {t("confirm")}
          </Button>
        }
      >
        {/* TODO: 디자인시스템 DatePicker wheel에 연·월만 고르는 옵션이 없어 일(day) 열도 보인다 */}
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
