import { fetcher } from "./fetcher"

export interface DailyQuestion {
  id: string
  /** YYYY-MM-DD (KST) */
  date: string
  content: string
  /** 그 날짜에 쓴 내 일지. 없으면 null */
  letterId: string | null
}

/** 날짜별 질문. date를 생략하면 오늘(KST) */
export function getDailyQuestion({ date, locale }: { date?: string; locale?: string }, token?: string) {
  const query = new URLSearchParams()
  if (date) query.set("date", date)
  if (locale) query.set("locale", locale)
  return fetcher<DailyQuestion>(`/questions/daily?${query}`, { token })
}
