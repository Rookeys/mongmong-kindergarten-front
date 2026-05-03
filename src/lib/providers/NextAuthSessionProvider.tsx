"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

type NextAuthSessionProviderProps = {
  children: React.ReactNode
  session: Session | null
}

export default function NextAuthSessionProvider({
  children,
  session
}: NextAuthSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
