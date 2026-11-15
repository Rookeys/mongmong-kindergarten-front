import { getServerSession, type Session } from "next-auth"
import { getLocale } from "next-intl/server"
import { authOptions } from "@/auth"
import { redirect } from "@/i18n/navigation"

/**
 * 로그인·이름 작성이 끝난 사용자만 통과시키고 세션을 돌려준다. 아니면 로그인/회원가입으로 보낸다.
 * 로그인이 필요한 서버 페이지 맨 위에서 호출한다.
 */
export async function requireSession(): Promise<Session & { access_token: string }> {
  const session = await getServerSession(authOptions)
  const locale = await getLocale()
  if (!session?.access_token || session.error) return redirect({ href: "/auth/sign-in", locale })
  if (session.signup_required) return redirect({ href: "/auth/sign-up", locale })
  return session as Session & { access_token: string }
}
