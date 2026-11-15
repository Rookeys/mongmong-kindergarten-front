import { getTranslations } from "next-intl/server"
import { getMySetting } from "@/apis/auth"
import BackTopNavigation from "@/components/BackTopNavigation"
import { requireSession } from "@/utils/session"
import Settings from "./Settings"

/** 설정·로그아웃·탈퇴. TODO: Figma 화면이 없어 임시 구현 (TODO.md) */
export default async function SettingsPage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("settings")
  const setting = await getMySetting(token)

  return (
    <main className="flex min-h-dvh flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <BackTopNavigation title={t("title")} />
      <Settings initialSetting={setting} />
    </main>
  )
}
