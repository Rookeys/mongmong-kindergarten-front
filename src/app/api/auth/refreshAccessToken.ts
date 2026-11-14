import { api, type AuthTokenResponse } from "@/utils/api"

// 백엔드는 Refresh Token을 한 번 쓰면 폐기한다. 같은 토큰으로 동시에 갱신하면 하나만 성공하므로
// 진행 중인 갱신을 공유하고, 결과를 잠시 남겨 옛 쿠키로 늦게 온 요청도 같은 새 토큰을 받게 한다.
// ponytail: 서버 프로세스 메모리 기준. 프론트 서버를 여러 대 띄우면 Redis 같은 공유 저장소로 옮긴다.
const inflight = new Map<string, Promise<AuthTokenResponse>>()
const KEEP_MS = 10_000

export function refreshAccessToken(refreshToken: string): Promise<AuthTokenResponse> {
  let pending = inflight.get(refreshToken)
  if (!pending) {
    pending = api<AuthTokenResponse>("/auth/refresh", { method: "POST", body: { refreshToken } })
    pending.finally(() => setTimeout(() => inflight.delete(refreshToken), KEEP_MS)).catch(() => {})
    inflight.set(refreshToken, pending)
  }
  return pending
}
