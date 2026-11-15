import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { authLogout } from "@/apis/generated/auth/auth"

/** Refresh Token은 브라우저 세션에 없어서, 서버에서 쿠키를 읽어 백엔드에 폐기 요청한다. 실패해도 로그아웃은 진행한다. */
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (token?.refresh_token) {
    await authLogout({ refreshToken: token.refresh_token }).catch(() => {})
  }
  return new Response(null, { status: 204 })
}
