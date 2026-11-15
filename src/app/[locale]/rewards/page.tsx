import { requireSession } from "@/utils/session"
import RewardsScreen from "./RewardsScreen"

/** 꿈 조각 공장: 출석체크·광고·친구 초대로 꿈조각 받기 */
export default async function RewardsPage() {
  await requireSession()
  return <RewardsScreen />
}
