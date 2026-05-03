"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import Onboarding from "@/app/[locale]/auth/_components/SignInOnboarding";


export default function Page() {
    const locale = useLocale()
    const router = useRouter()
    const { data: session } = useSession()

    useEffect(() => {
        if (session?.signup_required) {
            router.push(`/${locale}/auth/sign-up`)
        }
    }, [session, locale, router])

    return (
        <Onboarding />
    )
}
