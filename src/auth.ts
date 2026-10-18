import { NextAuthOptions, DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import NaverProvider from "next-auth/providers/naver"
import { refreshAccessToken } from "@/app/api/auth/refreshAccessToken"

declare module "next-auth" {
  interface Session {
    access_token?: string
    refresh_token?: string
    access_token_expires_at?: number
    refresh_token_expires_at?: number
    signup_required?: boolean
    user: DefaultSession["user"] & {
      nickname?: string | null
    }
    oauth_provider?: string
    oauth_access_token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
    refresh_token?: string
    access_token_expires_at?: number
    refresh_token_expires_at?: number
    signup_required?: boolean
    nickname?: string | null
    image?: string | null
    oauth_provider?: string
    oauth_access_token?: string
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    // JWT 기반 세션 사용
    strategy: "jwt"
  },
  pages: {
    // 사용자 지정 페이지
    signIn: "/sign-in",
    signOut: "/sign-out"
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
    async jwt({ token, account, user }) {
      try {
        if (!!account && !!user) {
          try {
            // Todo: 로그인 API 호출로 변경
            const { data } = {
              data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken",
                accessTokenExpiresAt: 1774319543,
                refreshTokenExpiresAt: 1776738743,
                nickname: "testUser",
                email: "tamd5971@gmail.com"
              }
            }
            throw { status: 404 }

            const accessToken = data.accessToken
            const refreshToken = data.refreshToken
            const accessTokenExpiresAt = data.accessTokenExpiresAt
            const refreshTokenExpiresAt = data.refreshTokenExpiresAt
            const nickname = data.nickname

            const newToken: JWT = {
              ...token,
              access_token: accessToken,
              refresh_token: refreshToken,
              nickname: nickname,
              signup_required: false
            }

            if (accessTokenExpiresAt) {
              newToken.access_token_expires_at = Date.now() + accessTokenExpiresAt * 1000 // * 초 단위이므로 Date 형식에 맞게 1000을 곱함 (밀리초)
            }
            if (refreshTokenExpiresAt) {
              newToken.refresh_token_expires_at = Date.now() + refreshTokenExpiresAt * 1000
            }
            return newToken
          } catch (error: any) {
            if (error.status === 404) {
              // 신규 회원인 경우
              return {
                ...token,
                signup_required: true,
                oauth_provider: account.provider,
                oauth_access_token: account.access_token,
                email: token.email
              }
            }
          }
        }
        if (token.signup_required) {
          return token
        }

        // 토큰 만료 시 토큰 재발급
        const EXPIRY_BUFFER_MS = 60 * 1000
        if (Date.now() < (token.access_token_expires_at as number) - EXPIRY_BUFFER_MS) {
          return token
        } else {
          const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenExpiresAt: newAccessTokenExpiresAt,
            refreshTokenExpiresAt: newRefreshTokenExpiresAt
          } = await refreshAccessToken(token.refresh_token as string)

          const newToken: JWT = {
            ...token,
            access_token: newAccessToken,
            refresh_token: newRefreshToken
          }

          if (newAccessTokenExpiresAt) {
            newToken.access_token_expires_at = Date.now() + Number(newAccessTokenExpiresAt) * 1000
          }
          if (newRefreshTokenExpiresAt) {
            newToken.refresh_token_expires_at = Date.now() + Number(newRefreshTokenExpiresAt) * 1000
          }
          return newToken
        }
      } catch {
        throw new Error("Refresh token expired")
      }
    },

    async session({ session, token }) {
      session.signup_required = token.signup_required ?? false

      if (!token.signup_required) {
        session.access_token = token.access_token
        session.refresh_token = token.refresh_token
        session.access_token_expires_at = token.access_token_expires_at
        session.refresh_token_expires_at = token.refresh_token_expires_at
        session.signup_required = token.signup_required

        session.user ??= {}
        session.user.nickname = token.nickname
        session.user.image = token.image
      } else {
        session.oauth_provider = token.oauth_provider
        session.oauth_access_token = token.oauth_access_token
      }

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
