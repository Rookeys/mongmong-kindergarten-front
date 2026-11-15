"use client"

import { useNoticeFindOne } from "@/apis/generated/notices/notices"
import BackTopNavigation from "@/components/BackTopNavigation"
import LoadingScreen from "@/components/LoadingScreen"

export default function NoticeScreen({ noticeId }: { noticeId: string }) {
  const { data: notice } = useNoticeFindOne(noticeId)

  if (!notice) return <LoadingScreen />

  return (
    <main className="bg-night-sky flex min-h-dvh flex-col">
      <BackTopNavigation title={notice.title} />
      <p className="text-body-md text-text-primary px-[20px] py-[16px] whitespace-pre-line">{notice.content}</p>
    </main>
  )
}
