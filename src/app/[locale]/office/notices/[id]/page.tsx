import { requireSession } from "@/utils/session"
import NoticeScreen from "./NoticeScreen"

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession()
  const { id } = await params
  return <NoticeScreen noticeId={id} />
}
