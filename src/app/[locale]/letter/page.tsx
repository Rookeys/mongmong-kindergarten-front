import { requireSession } from "@/utils/session"
import LetterScreen from "./LetterScreen"

/** 캐릭터가 보낸 오늘의 질문 편지 */
export default async function LetterPage() {
  await requireSession()
  return <LetterScreen />
}
