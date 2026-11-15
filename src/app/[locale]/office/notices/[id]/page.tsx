import { getNotice } from "@/apis/notice"
import BackTopNavigation from "@/components/BackTopNavigation"
import { requireSession } from "@/utils/session"

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { access_token: token } = await requireSession()
  const { id } = await params
  const notice = await getNotice(id, token)

  return (
    <main className="flex min-h-dvh flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <BackTopNavigation title={notice.title} />
      <p className="text-body-md text-text-primary px-5 py-4 whitespace-pre-line">{notice.content}</p>
    </main>
  )
}
