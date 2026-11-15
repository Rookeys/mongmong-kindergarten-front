import { requireSession } from "@/utils/session"
import GraduationCardScreen from "./GraduationCardScreen"

/** 졸업 카드 상세 */
export default async function GraduationCardPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession()
  const { id } = await params
  return <GraduationCardScreen cardId={id} />
}
