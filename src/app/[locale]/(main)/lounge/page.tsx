import { getFormatter, getLocale, getTranslations } from "next-intl/server"
import { Asset, Button, ListRow, Result } from "@kojaem/mongmong"
import { getPublicLetters, type PublicLetter } from "@/apis/letter"
import { getDailyQuestion } from "@/apis/question"
import CharacterFace from "@/components/CharacterFace"
import { ON_DARK_SECONDARY_TEXT, ON_DARK_TEXT } from "@/constants/designSystemOverrides"
import { Link } from "@/i18n/navigation"
import { requireSession } from "@/utils/session"
import LoungeWelcomeSheet from "./LoungeWelcomeSheet"
import ReportButton from "./ReportButton"

/** 휴게실 탭: 같은 질문에 다른 사람이 쓴 공개 답장. ?date=YYYY-MM-DD */
export default async function LoungePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { access_token: token } = await requireSession()
  const { date } = await searchParams
  const locale = await getLocale()
  const t = await getTranslations("lounge")
  const format = await getFormatter()

  const question = await getDailyQuestion({ date, locale }, token)
  const letters = await getPublicLetters(question.id, token)
  const writeHref = `/letter/write?date=${question.date}`

  return (
    <main className="bg-gradient-letter flex flex-1 flex-col">
      {/* TODO: 제목 옆 화살표로 날짜 변경 (Figma "날짜 변경") */}
      <header className="text-subtitle-lg text-text-primary flex h-[54px] items-center justify-center">
        {format.dateTime(new Date(`${question.date}T00:00:00`), { dateStyle: "long" })}
      </header>
      <h1 className="text-title-md text-text-primary px-5 py-6">{question.content}</h1>

      {letters.length === 0 ? (
        <Result
          className={ON_DARK_SECONDARY_TEXT}
          image={<CharacterFace size={40} />}
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
              className={ON_DARK_TEXT}
              leadingAsset={<CharacterFace />}
              title={t("writeToo")}
              trailingAccessory={<span aria-hidden>›</span>}
            />
          </Link>
          <ul className="flex flex-col gap-6 px-5 pt-3 pb-6">
            {letters.map((letter) => (
              <li key={letter.id}>
                <PublicLetterCard
                  letter={letter}
                  timeAgo={format.relativeTime(new Date(letter.createdDate))}
                  from={t("from")}
                />
              </li>
            ))}
          </ul>
        </>
      )}
      <LoungeWelcomeSheet />
    </main>
  )
}

function PublicLetterCard({ letter, timeAgo, from }: { letter: PublicLetter; timeAgo: string; from: string }) {
  return (
    <article className="bg-card border-border-brand-weak flex flex-col gap-2.5 rounded-lg border p-4">
      <div className="flex items-start gap-2.5">
        <div className="flex flex-1 items-center gap-2.5">
          <Asset
            shape="squircle"
            size="l"
            icon={<img src="/assets/images/mood-placeholder.png" alt="" width={26} height={26} />}
          />
          <div className="text-text-inverse-primary flex flex-col gap-1">
            {/* TODO: 백엔드 응답에 익명 닉네임이 없어 고정 문구 */}
            <p className="text-subtitle-sm">{from}</p>
            <p className="text-[11px] leading-[14px]">{timeAgo}</p>
          </div>
        </div>
        <ReportButton letterId={letter.id} />
      </div>
      <p className="text-body-md text-text-inverse-primary whitespace-pre-line">{letter.answer}</p>
    </article>
  )
}
