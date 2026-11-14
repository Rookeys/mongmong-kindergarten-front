"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, DatePicker } from "@kojaem/mongmong"
import { DIALOG_CLASS } from "@/constants/dialog"
import { useRouter } from "@/i18n/navigation"

interface Props {
  title: string
  year: number
  month: number
}

// 상단 "2026년 5월 ˅"을 누르면 달 선택 시트
// TODO: 디자인시스템 DatePicker wheel에 연·월만 고르는 옵션이 없어 일(day) 열도 보인다
export default function MonthPicker({ title, year, month }: Props) {
  const t = useTranslations("diary")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState(new Date(year, month - 1, 1))

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-subtitle-lg text-text-primary flex items-center gap-1.5">
        {title}
        <img src="/assets/icons/arrow-down.png" alt="" width={16} height={16} className="rotate-90" />
      </button>
      <BottomSheet
        className={DIALOG_CLASS}
        open={open}
        onOpenChange={setOpen}
        title={t("pickMonth")}
        buttons={
          <Button
            size="xl"
            color="brand"
            variant="fill"
            isFullWidth
            onClick={() => {
              setOpen(false)
              const value = `${picked.getFullYear()}-${String(picked.getMonth() + 1).padStart(2, "0")}`
              router.push(`/diary?month=${value}`)
            }}
          >
            {t("confirm")}
          </Button>
        }
      >
        <DatePicker type="wheel" value={picked} onChange={setPicked} minYear={2025} maxYear={new Date().getFullYear()} />
      </BottomSheet>
    </>
  )
}
