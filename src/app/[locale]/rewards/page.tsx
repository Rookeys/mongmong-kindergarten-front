import { getTranslations } from "next-intl/server"
import { getMe } from "@/apis/auth"
import { getTodayAttendance } from "@/apis/reward"
import BackTopNavigation from "@/components/BackTopNavigation"
import { requireSession } from "@/utils/session"
import RewardActions from "./RewardActions"

/** 꿈 조각 공장: 출석체크·광고·친구 초대로 꿈조각 받기 */
export default async function RewardsPage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("rewards")
  const [me, attendance] = await Promise.all([getMe(token), getTodayAttendance(token)])

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      <RewardActions
        rewardCount={me.rewardCount}
        hasAttendedToday={attendance.isChecked}
        inviteCode={me.myInviteCode}
      />
    </main>
  )
}
