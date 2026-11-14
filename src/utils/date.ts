// 서버·브라우저 시간대와 상관없이 한국 날짜(YYYY-MM-DD). 백엔드 일지 날짜가 KST 기준이다.
export const todayKst = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date())

export interface CalendarCell {
  date: string
  day: number
  inMonth: boolean
}

// 일요일부터 시작하는 달력 칸. 앞뒤 달 날짜로 주를 채운다.
export function monthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const count = Math.ceil((first.getUTCDay() + lastDay) / 7) * 7
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1, 1 - first.getUTCDay() + i))
    return { date: date.toISOString().slice(0, 10), day: date.getUTCDate(), inMonth: date.getUTCMonth() === month - 1 }
  })
}
