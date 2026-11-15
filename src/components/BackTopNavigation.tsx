"use client"

import { TopNavigation } from "@kojaem/mongmong"
import { ON_DARK_TEXT } from "@/constants/designSystemOverrides"
import { useRouter } from "@/i18n/navigation"

/** 뒤로가기 버튼이 있는 상단바 (어두운 배경용) */
export default function BackTopNavigation({ title }: { title: React.ReactNode }) {
  const router = useRouter()
  return <TopNavigation title={title} onBack={() => router.back()} className={ON_DARK_TEXT} />
}
