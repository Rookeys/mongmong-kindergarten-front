import { fetcher } from "./fetcher"

export function getTodayAttendance(token?: string) {
  return fetcher<{ attendanceDate: string; isChecked: boolean }>("/rewards/attendance", { token })
}

export function checkAttendance() {
  return fetcher<{ attendanceDate: string; rewardAmount: number }>("/rewards/attendance", { method: "POST" })
}
