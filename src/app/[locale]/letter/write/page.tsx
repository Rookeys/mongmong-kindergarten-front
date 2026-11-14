import { getFormatter, getLocale } from "next-intl/server"
import { api, type Character, type DailyQuestion, type Letter } from "@/utils/api"
import { requireSession } from "@/utils/session"
import LetterWriteForm from "./LetterWriteForm"

export default async function LetterWritePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { access_token: token } = await requireSession()
  const { date } = await searchParams
  const locale = await getLocale()
  const format = await getFormatter()

  const query = new URLSearchParams({ locale, ...(date && { date }) })
  const [character, question] = await Promise.all([
    api<Character>("/characters/me", { token }),
    api<DailyQuestion>(`/questions/daily?${query}`, { token })
  ])
  const letters = await api<Letter[]>(`/letters?questionId=${question.id}`, { token })
  const written = letters.find((letter) => letter.id === question.letterId)
  const previous = letters.filter((letter) => letter.id !== question.letterId)

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <LetterWriteForm
        title={format.dateTime(new Date(`${question.date}T00:00:00`), { dateStyle: "long" })}
        question={question}
        written={written}
        previous={previous}
        characterName={character.characterType.name}
        characterImage={character.characterType.imageUrl}
      />
    </main>
  )
}
