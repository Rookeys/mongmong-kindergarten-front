import { requireSession } from "@/utils/session"
import DecorateScreen from "./DecorateScreen"

/** 꾸미기 탭 */
export default async function DecoratePage() {
  await requireSession()
  return <DecorateScreen />
}
