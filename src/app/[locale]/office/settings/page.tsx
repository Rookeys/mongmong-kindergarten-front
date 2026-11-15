import { requireSession } from "@/utils/session"
import SettingsScreen from "./SettingsScreen"

/** 설정·로그아웃·탈퇴. TODO: Figma 화면이 없어 임시 구현 (TODO.md) */
export default async function SettingsPage() {
  await requireSession()
  return <SettingsScreen />
}
