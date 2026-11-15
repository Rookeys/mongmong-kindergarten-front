"use client"

import { useTranslations } from "next-intl"
import { Result } from "@kojaem/mongmong"
import { useNoticeFindAll } from "@/apis/generated/notices/notices"
import BackTopNavigation from "@/components/BackTopNavigation"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"

/** 번호는 최신이 가장 크게 (Figma: 004, 003, …) */
export default function NoticesScreen() {
  const t = useTranslations("notices")
  const { data: notices } = useNoticeFindAll()

  if (!notices) return <LoadingScreen />

  return (
    <main className="bg-night-sky flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      {notices.length === 0 ? (
        <Result className="mt-[80px]" title={t("empty")} />
      ) : (
        <ol className="flex flex-col">
          {notices.map((notice, index) => (
            <li key={notice.id}>
              <Link
                href={`/office/notices/${notice.id}`}
                className="text-subtitle-md text-text-primary flex gap-[24px] px-[20px] py-[16px]"
              >
                <span className="text-text-secondary">{String(notices.length - index).padStart(3, "0")}</span>
                {notice.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
