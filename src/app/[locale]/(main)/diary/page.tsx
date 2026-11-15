import { getFormatter, getTranslations } from "next-intl/server"
import { Button } from "@kojaem/mongmong"
import { getLetterCalendar } from "@/apis/letter"
import { getDailyQuestion } from "@/apis/question"
import { Link } from "@/i18n/navigation"
import { cn } from "@/utils/cn"
import { getMonthCells, toKstDate, type CalendarCell } from "@/utils/date"
import { requireSession } from "@/utils/session"
import MonthPicker from "./MonthPicker"

/** "2026-05" 형식이면 그 달, 아니면 이번 달 */
function parseMonth(value: string | undefined, today: string) {
  const monthText = value && /^\d{4}-\d{2}$/.test(value) ? value : today.slice(0, 7)
  const [year, month] = monthText.split("-").map(Number)
  return { year, month }
}

/** 일지 탭: 월간 캘린더. ?month=YYYY-MM */
export default async function DiaryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("diary")
  const format = await getFormatter()
  const today = toKstDate()
  const { year, month } = parseMonth((await searchParams).month, today)

  const [calendar, todayQuestion] = await Promise.all([
    getLetterCalendar({ year, month }, token),
    getDailyQuestion({}, token)
  ])
  const writtenDates = calendar.map((entry) => entry.date)
  // 2026-02-01이 일요일이라 그 주로 요일 이름을 만든다
  const weekdays = [0, 1, 2, 3, 4, 5, 6].map((i) =>
    format.dateTime(new Date(Date.UTC(2026, 1, 1 + i)), { weekday: "narrow", timeZone: "UTC" })
  )

  return (
    <main className="flex flex-1 flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <header className="flex h-[54px] items-center justify-center px-2.5">
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
          {/* TODO: 질문 리스트 화면 (Figma "질문 리스트") */}
          <img src="/assets/icons/menu.svg" alt="" width={24} height={24} aria-hidden />
        </div>
      </header>

      <section className="flex flex-col gap-2 py-5">
        <div className="grid grid-cols-7 px-6 py-2">
          {weekdays.map((weekday) => (
            <span key={weekday} className="text-caption-lg text-text-tertiary text-center">
              {weekday}
            </span>
          ))}
        </div>
        <ol className="grid grid-cols-7 gap-y-4 px-6 py-2">
          {getMonthCells(year, month).map((cell) => (
            <li key={cell.date}>
              <CalendarDay
                cell={cell}
                today={today}
                isWritten={writtenDates.includes(cell.date)}
                writtenLabel={t("written")}
              />
            </li>
          ))}
        </ol>
      </section>

      {!todayQuestion.letterId && (
        <div className="mt-auto px-5 pb-5">
          <Button asChild size="xl" color="brand" variant="fill" isFullWidth>
            <Link href="/letter/write">{t("writeToday")}</Link>
          </Button>
        </div>
      )}
    </main>
  )
}

interface CalendarDayProps {
  cell: CalendarCell
  today: string
  isWritten: boolean
  writtenLabel: string
}

/** 답장한 날은 하트, 오늘은 강조. 지난 날짜·오늘은 눌러서 그 날짜 답장 쓰기로 간다. */
function CalendarDay({ cell, today, isWritten, writtenLabel }: CalendarDayProps) {
  const isToday = cell.date === today
  const isFuture = cell.date > today

  const content = (
    <span
      className={cn(
        "text-title-sm mx-auto flex h-[42px] w-9 items-center justify-center rounded-full",
        isToday && !isWritten ? "bg-fill-brand text-text-strong" : "text-text-tertiary",
        !cell.isCurrentMonth && "text-text-quaternary opacity-50"
      )}
    >
      {isWritten ? (
        <img
          src="/assets/images/heart.png"
          alt={writtenLabel}
          width={36}
          height={36}
          className="[image-rendering:pixelated]"
        />
      ) : (
        cell.day
      )}
    </span>
  )

  if (isFuture) return content
  return (
    <Link href={`/letter/write?date=${cell.date}`} aria-label={cell.date}>
      {content}
    </Link>
  )
}
