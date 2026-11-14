import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { api } from "@/utils/api"

// Refresh Token은 브라우저 세션에 없으므로 서버에서 꺼내 백엔드에 폐기 요청한다. 실패해도 로그아웃은 진행한다.
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (token?.refresh_token) {
    await api("/auth/logout", { method: "POST", body: { refreshToken: token.refresh_token } }).catch(() => {})
  }
  return new Response(null, { status: 204 })
}
