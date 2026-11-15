import { refreshAuthToken, type AuthToken } from "@/apis/auth"

/*
 * 백엔드는 Refresh Token을 한 번 쓰면 폐기한다. 여러 요청이 같은 토큰으로 동시에 갱신하면 하나만 성공하므로,
 * 진행 중인 갱신 요청을 같이 쓰고 결과를 10초 동안 남겨 옛 쿠키로 늦게 온 요청도 같은 새 토큰을 받게 한다.
 * 서버 프로세스 메모리 기준이라 프론트 서버를 여러 대 띄우면 Redis 같은 공유 저장소로 옮겨야 한다.
 */
const KEEP_RESULT_MS = 10_000
const pendingRefreshes: Record<string, Promise<AuthToken>> = {}

export function refreshAccessToken(refreshToken: string): Promise<AuthToken> {
  if (!pendingRefreshes[refreshToken]) {
    const request = refreshAuthToken(refreshToken)
    pendingRefreshes[refreshToken] = request
    request.finally(() => setTimeout(() => delete pendingRefreshes[refreshToken], KEEP_RESULT_MS)).catch(() => {})
  }
  return pendingRefreshes[refreshToken]
}
