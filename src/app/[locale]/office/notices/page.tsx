import { getTranslations } from "next-intl/server"
import { Result } from "@kojaem/mongmong"
import BackTopNavigation from "@/components/BackTopNavigation"
import { Link } from "@/i18n/navigation"
import { api, type Notice } from "@/utils/api"
import { requireSession } from "@/utils/session"

export default async function NoticesPage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("notices")
  const notices = await api<Notice[]>("/notices", { token })

  return (
    <main className="flex min-h-dvh flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <BackTopNavigation title={t("title")} />
      {notices.length === 0 ? (
        <Result className="mt-20 [&_*]:text-text-secondary!" title={t("empty")} />
      ) : (
        <ol className="flex flex-col">
          {notices.map((notice, index) => (
            <li key={notice.id}>
              <Link href={`/office/notices/${notice.id}`} className="text-subtitle-md text-text-primary flex gap-6 px-5 py-4">
                <span className="text-text-secondary">{String(notices.length - index).padStart(3, "0")}</span>
                {notice.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
