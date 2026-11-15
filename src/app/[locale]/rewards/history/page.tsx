import { requireSession } from "@/utils/session"
import RewardHistoryScreen from "./RewardHistoryScreen"

/** 꿈조각 이력 */
export default async function RewardHistoryPage() {
  await requireSession()
  return <RewardHistoryScreen />
}
