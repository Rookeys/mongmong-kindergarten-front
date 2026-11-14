import { getFormatter, getLocale, getTranslations } from "next-intl/server"
import { Asset, Button, ListRow, Result } from "@kojaem/mongmong"
import { Link } from "@/i18n/navigation"
import { api, type DailyQuestion, type PublicLetter } from "@/utils/api"
import { requireSession } from "@/utils/session"
import LoungeWelcome from "./LoungeWelcome"
import ReportButton from "./ReportButton"

export default async function LoungePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { access_token: token } = await requireSession()
  const { date } = await searchParams
  const locale = await getLocale()
  const t = await getTranslations("lounge")
  const format = await getFormatter()

  const query = new URLSearchParams({ locale, ...(date && { date }) })
  const question = await api<DailyQuestion>(`/questions/daily?${query}`, { token })
  const letters = await api<PublicLetter[]>(`/letters/public?questionId=${question.id}`, { token })
  const writeHref = `/letter/write?date=${question.date}`
  const now = new Date()

  return (
    <main className="bg-gradient-letter flex flex-1 flex-col">
      {/* TODO: 제목 옆 화살표로 날짜 변경 (Figma "날짜 변경") */}
      <header className="text-subtitle-lg text-text-primary flex h-[54px] items-center justify-center">
        {format.dateTime(new Date(`${question.date}T00:00:00`), { dateStyle: "long" })}
      </header>
      <h1 className="text-title-md text-text-primary px-5 py-6">{question.content}</h1>

      {letters.length === 0 ? (
        <Result
          className="[&_*]:text-text-secondary!"
          image={<img src="/assets/images/character-face.png" alt="" width={40} height={40} />}
          title={t("empty")}
          action={
            <Button asChild size="s" color="brand" variant="fill">
              <Link href={writeHref}>{t("writeFirst")}</Link>
            </Button>
          }
        />
      ) : (
        <>
          <Link href={writeHref} className="block">
            <ListRow
              padding="l"
              className="[&_*]:text-text-primary!"
              leadingAsset={<img src="/assets/images/character-face.png" alt="" width={30} height={30} />}
              title={t("writeToo")}
              trailingAccessory={<span aria-hidden>›</span>}
            />
          </Link>
          <ul className="flex flex-col gap-6 px-5 pt-3 pb-6">
            {letters.map((letter) => (
              <li
                key={letter.id}
                className="border-border-brand-weak flex flex-col gap-2.5 rounded-lg border bg-[linear-gradient(rgb(41_5_255/0.1),rgb(41_5_255/0.1)),linear-gradient(#f4f4f9,#f4f4f9)] p-4"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex flex-1 items-center gap-2.5">
                    <Asset
                      shape="squircle"
                      size="l"
                      icon={<img src="/assets/images/mood-placeholder.png" alt="" width={26} height={26} />}
                    />
                    <div className="text-text-inverse-primary flex flex-col gap-1">
                      {/* TODO: 백엔드가 익명 닉네임을 주지 않아 고정 문구 */}
                      <p className="text-subtitle-sm">{t("from")}</p>
                      <p className="text-[11px] leading-[14px]">{format.relativeTime(new Date(letter.createdDate), now)}</p>
                    </div>
                  </div>
                  <ReportButton letterId={letter.id} />
                </div>
                <p className="text-body-md text-text-inverse-primary whitespace-pre-line">{letter.answer}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      <LoungeWelcome />
    </main>
  )
}
