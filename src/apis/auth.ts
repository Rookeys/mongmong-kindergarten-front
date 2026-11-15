import { fetcher } from "./fetcher"

export interface User {
  id: string
  email: string | null
  /** null이면 이름 작성 온보딩이 필요하다 */
  nickname: string | null
  rewardCount: number
  myInviteCode: string
  createdDate: string
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  user: User
}

export interface UserSetting {
  localeType: "ko" | "en" | "ja"
  /** 새 답장을 비공개로 둘지 (true면 비공개) */
  setLetterIsPrivate: boolean
  /** SNS 소개를 거절할지 (true면 거절) */
  setLetterIsPrivateSns: boolean
  pushEnabled: boolean
}

export function loginWithKakao(kakaoAccessToken: string) {
  return fetcher<AuthToken>("/auth/kakao", { method: "POST", body: { kakaoAccessToken } })
}

export function refreshAuthToken(refreshToken: string) {
  return fetcher<AuthToken>("/auth/refresh", { method: "POST", body: { refreshToken } })
}

export function logout(refreshToken: string) {
  return fetcher("/auth/logout", { method: "POST", body: { refreshToken } })
}

export function getMe(token?: string) {
  return fetcher<User>("/auth/me", { token })
}

export function updateMe(body: { nickname?: string; friendInviteCode?: string }) {
  return fetcher<User>("/auth/me", { method: "PATCH", body })
}

export function deleteMe() {
  return fetcher("/auth/me", { method: "DELETE" })
}

export function getMySetting(token?: string) {
  return fetcher<UserSetting>("/auth/me/settings", { token })
}

export function updateMySetting(body: Partial<UserSetting>) {
  return fetcher<UserSetting>("/auth/me/settings", { method: "PATCH", body })
}
