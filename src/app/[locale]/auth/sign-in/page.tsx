"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Onboarding from "@/app/[locale]/auth/components/SignInOnboarding"

export default function Page() {
  const locale = useLocale()
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.access_token) return
    router.replace(session.signup_required ? `/${locale}/auth/sign-up` : `/${locale}`)
  }, [session, locale, router])

  return <Onboarding />
}
