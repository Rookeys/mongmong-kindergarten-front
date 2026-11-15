import { requireSession } from "@/utils/session"
import DiaryScreen from "./DiaryScreen"

/** 일지 탭: 월간 캘린더. ?month=YYYY-MM */
export default async function DiaryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  await requireSession()
  const { month } = await searchParams
  return <DiaryScreen month={month} />
}
