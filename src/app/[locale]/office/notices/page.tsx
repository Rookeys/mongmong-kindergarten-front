import { requireSession } from "@/utils/session"
import NoticesScreen from "./NoticesScreen"

/** 공지사항 목록 */
export default async function NoticesPage() {
  await requireSession()
  return <NoticesScreen />
}
