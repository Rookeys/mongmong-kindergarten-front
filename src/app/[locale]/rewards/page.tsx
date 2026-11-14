import { getTranslations } from "next-intl/server"
import BackTopNavigation from "@/components/BackTopNavigation"
import { api, type User } from "@/utils/api"
import { requireSession } from "@/utils/session"
import RewardActions from "./RewardActions"

// 꿈 조각 공장: 출석체크·광고·친구 초대로 꿈조각 받기
export default async function RewardsPage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("rewards")
  const [me, attendance] = await Promise.all([
    api<User>("/auth/me", { token }),
    api<{ isChecked: boolean }>("/rewards/attendance", { token })
  ])

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      <RewardActions rewardCount={me.rewardCount} attended={attendance.isChecked} inviteCode={me.myInviteCode} />
    </main>
  )
}
