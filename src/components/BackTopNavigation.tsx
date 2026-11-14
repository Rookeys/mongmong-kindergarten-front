"use client"

import { TopNavigation } from "@kojaem/mongmong"
import { useRouter } from "@/i18n/navigation"

export default function BackTopNavigation({ title }: { title: React.ReactNode }) {
  const router = useRouter()
  // 디자인시스템 TopNavigation은 밝은 배경 기준 글자색이라 어두운 그라데이션 위에서는 밝은 글자로 덮어쓴다
  return <TopNavigation title={title} onBack={() => router.back()} className="[&_*]:text-text-primary!" />
}
