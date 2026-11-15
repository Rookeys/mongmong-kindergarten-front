import { requireSession } from "@/utils/session"
import QuestionListScreen from "./QuestionListScreen"

/** 질문 리스트 (일지 탭 오른쪽 위 메뉴) */
export default async function QuestionListPage() {
  await requireSession()
  return <QuestionListScreen />
}
