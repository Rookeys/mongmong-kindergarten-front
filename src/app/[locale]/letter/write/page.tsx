import { requireSession } from "@/utils/session"
import LetterWriteScreen from "./LetterWriteScreen"

/** 답장 쓰기. ?date=YYYY-MM-DD로 지난 날짜 질문에도 쓸 수 있다. */
export default async function LetterWritePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  await requireSession()
  const { date } = await searchParams
  return <LetterWriteScreen date={date} />
}
