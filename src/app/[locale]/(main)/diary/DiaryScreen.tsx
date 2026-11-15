"use client"

import { useFormatter, useTranslations } from "next-intl"
import { Button } from "@kojaem/mongmong"
import { useLetterFindCalendar } from "@/apis/generated/letters/letters"
import { useQuestionFindDaily } from "@/apis/generated/questions/questions"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import { getMonthCells, isRestDay, toKstDate } from "@/utils/date"
import CalendarDay from "./CalendarDay"
import MonthPicker from "./MonthPicker"

/** "2026-05" 형식이면 그 달, 아니면 이번 달 */
function parseMonth(value: string | undefined, today: string) {
  const monthText = value && /^\d{4}-\d{2}$/.test(value) ? value : today.slice(0, 7)
  const [year, month] = monthText.split("-").map(Number)
  return { year, month }
}

export default function DiaryScreen({ month: monthParam }: { month?: string }) {
  const t = useTranslations("diary")
  const format = useFormatter()
  const today = toKstDate()
  const { year, month } = parseMonth(monthParam, today)

  const { data: calendar } = useLetterFindCalendar({ year, month })
  // 2월 29일은 질문이 없는 날이라 조회하지 않는다
  const isTodayRestDay = isRestDay(today)
  const { data: todayQuestion } = useQuestionFindDaily(undefined, { query: { enabled: !isTodayRestDay } })

  if (!calendar || (!todayQuestion && !isTodayRestDay)) return <LoadingScreen />

  const writtenDates = calendar.map((entry) => entry.date)
  // 2026-02-01이 일요일이라 그 주로 요일 이름을 만든다
  const weekdays = [0, 1, 2, 3, 4, 5, 6].map((i) =>
    format.dateTime(new Date(Date.UTC(2026, 1, 1 + i)), { weekday: "narrow", timeZone: "UTC" })
  )

  return (
    <main className="bg-night-sky flex flex-1 flex-col">
      <header className="flex h-[54px] items-center px-[10px]">
        <div className="flex-1" />
        <MonthPicker
          title={format.dateTime(new Date(Date.UTC(year, month - 1, 1)), {
            year: "numeric",
            month: "long",
            timeZone: "UTC"
          })}
          year={year}
          month={month}
        />
        <div className="flex flex-1 justify-end">
          <Link href="/questions" aria-label={t("questionList")}>
            <img src="/assets/icons/menu.svg" alt="" width={24} height={24} />
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-[8px] py-[20px]">
        <div className="grid grid-cols-7 px-[24px] py-[8px]">
          {weekdays.map((weekday) => (
            <span key={weekday} className="text-caption-lg text-text-tertiary text-center">
              {weekday}
            </span>
          ))}
        </div>
        <ol className="grid grid-cols-7 gap-y-[16px] px-[24px] py-[8px]">
          {getMonthCells(year, month).map((cell) => (
            <li key={cell.date}>
              <CalendarDay cell={cell} today={today} isWritten={writtenDates.includes(cell.date)} />
            </li>
          ))}
        </ol>
      </section>

      {todayQuestion && !todayQuestion.letterId && (
        <div className="mt-auto px-[20px] pb-[20px]">
          <Button asChild size="xl" color="brand" variant="fill" isFullWidth>
            <Link href="/letter/write">{t("writeToday")}</Link>
          </Button>
        </div>
      )}
    </main>
  )
}
