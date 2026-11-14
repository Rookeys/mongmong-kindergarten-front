import { getTranslations } from "next-intl/server"
import BackTopNavigation from "@/components/BackTopNavigation"
import { api, type UserSetting } from "@/utils/api"
import { requireSession } from "@/utils/session"
import Settings from "./Settings"

// TODO: Figma에 설정·로그아웃·탈퇴 화면이 없어 임시 구현 (TODO.md)
export default async function SettingsPage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("settings")
  const setting = await api<UserSetting>("/auth/me/settings", { token })
  return (
    <main className="flex min-h-dvh flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <BackTopNavigation title={t("title")} />
      <Settings setting={setting} />
    </main>
  )
}
