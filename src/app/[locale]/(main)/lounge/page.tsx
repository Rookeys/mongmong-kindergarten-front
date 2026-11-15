import { requireSession } from "@/utils/session"
import LoungeScreen from "./LoungeScreen"

/** 휴게실 탭: 같은 질문에 다른 사람이 쓴 공개 답장. ?date=YYYY-MM-DD */
export default async function LoungePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  await requireSession()
  const { date } = await searchParams
  return <LoungeScreen date={date} />
}
