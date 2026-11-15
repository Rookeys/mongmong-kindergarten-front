import { getFormatter, getLocale } from "next-intl/server"
import { getMe } from "@/apis/auth"
import { getMyCharacter } from "@/apis/character"
import { getMyLettersByQuestion } from "@/apis/letter"
import { getDailyQuestion } from "@/apis/question"
import { toKstDate } from "@/utils/date"
import { requireSession } from "@/utils/session"
import LetterWriteForm from "./LetterWriteForm"

/** 답장 쓰기. ?date=YYYY-MM-DD로 지난 날짜 질문에도 쓸 수 있다. */
export default async function LetterWritePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { access_token: token } = await requireSession()
  const { date } = await searchParams
  const locale = await getLocale()
  const format = await getFormatter()

  const [character, me, question] = await Promise.all([
    getMyCharacter(token),
    getMe(token),
    getDailyQuestion({ date, locale }, token)
  ])
  const myLetters = await getMyLettersByQuestion(question.id, token)
  const writtenLetter = myLetters.find((letter) => letter.id === question.letterId)
  const previousLetters = myLetters.filter((letter) => letter.id !== question.letterId)

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <LetterWriteForm
        title={format.dateTime(new Date(`${question.date}T00:00:00`), { dateStyle: "long" })}
        question={question}
        writtenLetter={writtenLetter}
        previousLetters={previousLetters}
        character={character}
        isPastDate={question.date < toKstDate()}
        rewardCount={me.rewardCount}
      />
    </main>
  )
}
