import { requireSession } from "@/utils/session"
import OfficeScreen from "./OfficeScreen"

/** 원장실 탭 */
export default async function OfficePage() {
  await requireSession()
  return <OfficeScreen />
}
