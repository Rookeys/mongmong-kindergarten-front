import { NextAuthOptions, DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import NaverProvider from "next-auth/providers/naver"
import { refreshAccessToken } from "@/app/api/auth/refreshAccessToken"
import { authKakaoLogin } from "@/apis/generated/auth/auth"
import type { AuthTokenResponseDto } from "@/apis/generated/model"

declare module "next-auth" {
  interface Session {
    access_token?: string
    access_token_expires_at?: number
    // 닉네임이 없으면 이름 작성 온보딩이 필요하다
    signup_required?: boolean
    error?: "RefreshTokenExpired"
    user: DefaultSession["user"] & {
      nickname?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
    refresh_token?: string
    access_token_expires_at?: number
    signup_required?: boolean
    nickname?: string | null
    error?: "RefreshTokenExpired"
  }
}

const EXPIRY_BUFFER_MS = 60 * 1000

// 백엔드 응답에 만료 시각이 없어서 Access Token(JWT)의 exp를 읽는다
function getExpiresAt(accessToken: string) {
  const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString())
  return payload.exp * 1000
}

function saveTokens(token: JWT, data: AuthTokenResponseDto): JWT {
  return {
    ...token,
    access_token: data.accessToken,
    refresh_token: data.refreshToken,
    access_token_expires_at: getExpiresAt(data.accessToken),
    nickname: data.user.nickname,
    signup_required: !data.user.nickname,
    error: undefined
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/sign-in"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),

    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!
    }),

    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!
    })
  ],

  callbacks: {
    // 백엔드는 카카오 로그인만 지원한다. Google·Naver는 백엔드 API가 생기면 연결한다 (TODO.md)
    signIn({ account }) {
      return account?.provider === "kakao"
    },

    async jwt({ token, account, trigger, session }) {
      if (account) {
        // 카카오 로그인: 없는 계정이면 백엔드가 닉네임 없이 가입시킨다
        const data = await authKakaoLogin({ kakaoAccessToken: account.access_token! })
        return saveTokens(token, data)
      }

      // 이름 작성 후 useSession().update({ nickname })
      if (trigger === "update" && session?.nickname) {
        return { ...token, nickname: session.nickname, signup_required: false }
      }

      const isExpiringSoon = Date.now() >= (token.access_token_expires_at ?? 0) - EXPIRY_BUFFER_MS
      if (!token.refresh_token || !isExpiringSoon) {
        return token
      }

      try {
        return saveTokens(token, await refreshAccessToken(token.refresh_token))
      } catch {
        return { ...token, access_token: undefined, refresh_token: undefined, error: "RefreshTokenExpired" }
      }
    },

    async session({ session, token }) {
      session.access_token = token.access_token
      session.access_token_expires_at = token.access_token_expires_at
      session.signup_required = token.signup_required ?? false
      session.error = token.error
      session.user ??= {}
      session.user.nickname = token.nickname
      return session
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }

      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
    }
  },
  secret: process.env.AUTH_SECRET
}
