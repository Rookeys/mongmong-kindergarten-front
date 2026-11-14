import { getFormatter, getTranslations } from "next-intl/server"
import { Button } from "@kojaem/mongmong"
import { Link } from "@/i18n/navigation"
import { api, type CalendarEntry, type DailyQuestion } from "@/utils/api"
import { cn } from "@/utils/cn"
import { monthGrid, todayKst } from "@/utils/date"
import { requireSession } from "@/utils/session"
import MonthPicker from "./MonthPicker"

export default async function DiaryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("diary")
  const format = await getFormatter()
  const today = todayKst()
  const { month: monthParam } = await searchParams
  const [year, month] = (/^\d{4}-\d{2}$/.test(monthParam ?? "") ? monthParam! : today.slice(0, 7)).split("-").map(Number)

  const [entries, todayQuestion] = await Promise.all([
    api<CalendarEntry[]>(`/letters/calendar?year=${year}&month=${month}`, { token }),
    api<DailyQuestion>("/questions/daily", { token })
  ])
  const written = new Map(entries.map((entry) => [entry.date, entry]))
  const cells = monthGrid(year, month)
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    format.dateTime(new Date(Date.UTC(2026, 1, 1 + i)), { weekday: "narrow", timeZone: "UTC" })
  )

  return (
    <main className="flex flex-1 flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <header className="flex h-[54px] items-center justify-center px-2.5">
        <div className="flex-1" />
        <MonthPicker
          title={format.dateTime(new Date(Date.UTC(year, month - 1, 1)), { year: "numeric", month: "long", timeZone: "UTC" })}
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
          {cells.map(({ date, day, inMonth }) => {
            const entry = written.get(date)
            const isToday = date === today
            const cell = (
              <span
                className={cn(
                  "text-title-sm mx-auto flex h-[42px] w-9 items-center justify-center rounded-full",
                  isToday && !entry ? "bg-fill-brand text-text-strong" : "text-text-tertiary",
                  !inMonth && "text-text-quaternary opacity-50"
                )}
              >
                {entry ? (
                  <img src="/assets/images/heart.png" alt={t("written")} width={36} height={36} className="[image-rendering:pixelated]" />
                ) : (
                  day
                )}
              </span>
            )
            return (
              <li key={date}>
                {date > today ? (
                  cell
                ) : (
                  <Link href={`/letter/write?date=${date}`} aria-label={date}>
                    {cell}
                  </Link>
                )}
              </li>
            )
          })}
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
