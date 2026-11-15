"use client"

import { useEffect } from "react"
import type { Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"
import { setAccessToken } from "@/apis/instance"

type NextAuthSessionProviderProps = {
  children: React.ReactNode
  session: Session | null
}

export default function NextAuthSessionProvider({ children, session }: NextAuthSessionProviderProps) {
  return (
    <SessionProvider session={session}>
      <AccessTokenSync />
      {children}
    </SessionProvider>
  )
}

/** 세션의 Access Token이 바뀔 때마다(로그인·갱신·로그아웃) API 인스턴스에 넣어 둔다. */
function AccessTokenSync() {
  const { data: session } = useSession()
  useEffect(() => {
    setAccessToken(session?.access_token)
  }, [session?.access_token])
  return null
}
