const KST_DATE_FORMAT = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" })

/** 한국 날짜 YYYY-MM-DD. 백엔드 일지 날짜가 KST 기준이라 서버·브라우저 시간대와 상관없이 맞춘다. */
export function toKstDate(date: Date | string = new Date()) {
  return KST_DATE_FORMAT.format(new Date(date))
}

/** 화면 표시용 YYYY.MM.DD */
export function formatDotDate(date: Date | string) {
  return toKstDate(date).replaceAll("-", ".")
}

export interface CalendarCell {
  /** YYYY-MM-DD */
  date: string
  day: number
  /** 보고 있는 달의 날짜인지 (앞뒤 달 날짜는 false) */
  isCurrentMonth: boolean
}

/** 일요일부터 시작하는 달력 칸. 첫 주와 마지막 주의 빈칸은 앞뒤 달 날짜로 채운다. */
export function getMonthCells(year: number, month: number): CalendarCell[] {
  const firstDay = new Date(Date.UTC(year, month - 1, 1))
  const lastDate = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const leadingDays = firstDay.getUTCDay()
  const cellCount = Math.ceil((leadingDays + lastDate) / 7) * 7

  const cells: CalendarCell[] = []
  for (let i = 0; i < cellCount; i++) {
    const date = new Date(Date.UTC(year, month - 1, 1 - leadingDays + i))
    cells.push({
      date: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      isCurrentMonth: date.getUTCMonth() === month - 1
    })
  }
  return cells
}

/** Date(로컬) → YYYY-MM-DD */
export function toDateString(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

/** 2월 29일은 질문이 없는 쉬는 날이다 (백엔드도 질문을 주지 않는다) */
export function isRestDay(date: string) {
  return date.slice(5) === "02-29"
}

/** 질문 순번(1~365)이 올해 며칠인지. 평년 기준으로 1번 = 1월 1일, 365번 = 12월 31일 (2월 29일은 질문 없음) */
export function getDateOfQuestionOrder(year: number, orderNum: number) {
  const nonLeapDate = new Date(2001, 0, orderNum)
  const month = String(nonLeapDate.getMonth() + 1).padStart(2, "0")
  const day = String(nonLeapDate.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
