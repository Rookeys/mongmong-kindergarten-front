import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { cn } from "@/utils/cn"
import { isRestDay, type CalendarCell } from "@/utils/date"

interface Props {
  cell: CalendarCell
  today: string
  isWritten: boolean
}

/** 답장한 날은 하트, 오늘은 강조. 지난 날짜·오늘은 눌러서 그 날짜 답장 쓰기로 간다. */
export default function CalendarDay({ cell, today, isWritten }: Props) {
  const t = useTranslations("diary")
  const isToday = cell.date === today
  const isFuture = cell.date > today
  // 2월 29일은 질문이 없는 쉬는 날
  const isDisabled = isFuture || isRestDay(cell.date)

  const content = (
    <span
      className={cn(
        "text-title-sm mx-auto flex h-[42px] w-[36px] items-center justify-center rounded-full",
        isToday && !isWritten ? "bg-fill-brand text-text-strong" : "text-text-tertiary",
        !cell.isCurrentMonth && "text-text-quaternary opacity-50"
      )}
    >
      {isWritten ? (
        <img src="/assets/images/heart.png" alt={t("written")} width={36} height={36} className="pixelated" />
      ) : (
        cell.day
      )}
    </span>
  )

  if (isDisabled) return content
  return (
    <Link href={`/letter/write?date=${cell.date}`} aria-label={cell.date}>
      {content}
    </Link>
  )
}
