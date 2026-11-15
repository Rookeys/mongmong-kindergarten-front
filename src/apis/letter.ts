import { fetcher } from "./fetcher"

export const MOODS = ["good", "excited", "soso", "angry", "sad", "depressed"] as const
export type Mood = (typeof MOODS)[number]

export const REPORT_REASONS = ["spam", "abuse", "inappropriate", "other"] as const
export type ReportReason = (typeof REPORT_REASONS)[number]

export interface Letter {
  id: string
  questionId: string
  /** YYYY-MM-DD (KST) */
  letterDate: string
  answer: string
  mood: Mood | null
  isPrivate: boolean
  isPrivateSns: boolean
}

export interface CreatedLetter extends Letter {
  /** 받은 꿈조각. 오늘 일지는 +, 지난 날짜 일지는 - */
  rewardAmount: number
}

export interface CalendarEntry {
  date: string
  letterId: string
  mood: Mood | null
}

export interface PublicLetter {
  id: string
  questionId: string
  answer: string
  createdDate: string
}

/** 같은 질문에 내가 쓴 일지들 */
export function getMyLettersByQuestion(questionId: string, token?: string) {
  return fetcher<Letter[]>(`/letters?questionId=${questionId}`, { token })
}

/** 월간 캘린더에 표시할, 일지를 쓴 날짜들 */
export function getLetterCalendar({ year, month }: { year: number; month: number }, token?: string) {
  return fetcher<CalendarEntry[]>(`/letters/calendar?year=${year}&month=${month}`, { token })
}

/** 휴게실: 같은 질문에 다른 사람이 쓴 공개 일지 */
export function getPublicLetters(questionId: string, token?: string) {
  return fetcher<PublicLetter[]>(`/letters/public?questionId=${questionId}`, { token })
}

export function createLetter(body: { answer: string; mood?: Mood; letterDate: string; localeType: string }) {
  return fetcher<CreatedLetter>("/letters", { method: "POST", body })
}

/** 답장 공개 여부(isPrivate)와 SNS 소개 거절 여부(isPrivateSns) 저장 */
export function updateLetterVisibility(letterId: string, body: { isPrivate: boolean; isPrivateSns: boolean }) {
  return fetcher<Letter>(`/letters/${letterId}`, { method: "PATCH", body })
}

export function reportLetter(letterId: string, reasonType?: ReportReason) {
  return fetcher(`/letters/${letterId}/reports`, { method: "POST", body: { reasonType } })
}
