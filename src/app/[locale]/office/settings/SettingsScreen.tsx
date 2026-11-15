"use client"

import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { Chip, ListRow } from "@kojaem/mongmong"
import { getAuthGetMySettingQueryKey, useAuthGetMySetting, useAuthUpdateMySetting } from "@/apis/generated/auth/auth"
import { LocaleType, type UpdateUserSettingRequestDto } from "@/apis/generated/model"
import { getErrorMessage } from "@/apis/instance"
import BackTopNavigation from "@/components/BackTopNavigation"
import LoadingScreen from "@/components/LoadingScreen"
import { usePathname, useRouter } from "@/i18n/navigation"
import AccountActions from "./AccountActions"
import SettingToggleRow from "./SettingToggleRow"

const LOCALE_LABELS: Record<LocaleType, string> = { ko: "한국어", en: "English", ja: "日本語" }

export default function SettingsScreen() {
  const t = useTranslations("settings")
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { data: setting } = useAuthGetMySetting()
  const updateSetting = useAuthUpdateMySetting()

  if (!setting) return <LoadingScreen />

  const saveSetting = (changes: UpdateUserSettingRequestDto) => {
    updateSetting.mutate(
      { data: changes },
      {
        onSuccess: (savedSetting) => {
          queryClient.setQueryData(getAuthGetMySettingQueryKey(), savedSetting)
          if (changes.localeType) {
            router.replace(pathname, { locale: changes.localeType })
          }
        }
      }
    )
  }

  return (
    <main className="bg-night-sky flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />

      {/* 백엔드 값은 "비공개 여부"라서 화면의 켜짐(공개·동의)과 반대다 */}
      <SettingToggleRow
        title={t("setLetterIsPrivate")}
        description={t("setLetterIsPrivateDescription")}
        checked={!setting.setLetterIsPrivate}
        disabled={updateSetting.isPending}
        onChange={(isPublic) => saveSetting({ setLetterIsPrivate: !isPublic })}
      />
      <SettingToggleRow
        title={t("setLetterIsPrivateSns")}
        description={t("setLetterIsPrivateSnsDescription")}
        checked={!setting.setLetterIsPrivateSns}
        disabled={updateSetting.isPending}
        onChange={(allowSns) => saveSetting({ setLetterIsPrivateSns: !allowSns })}
      />
      <SettingToggleRow
        title={t("pushEnabled")}
        description={t("pushEnabledDescription")}
        checked={setting.pushEnabled}
        disabled={updateSetting.isPending}
        onChange={(pushEnabled) => saveSetting({ pushEnabled })}
      />
      <ListRow
        padding="l"
        title={t("language")}
        trailingAccessory={
          <div className="flex gap-1.5">
            {Object.values(LocaleType).map((locale) => (
              <Chip
                key={locale}
                kind="select"
                size="s"
                selected={setting.localeType === locale}
                onClick={() => saveSetting({ localeType: locale })}
              >
                {LOCALE_LABELS[locale]}
              </Chip>
            ))}
          </div>
        }
      />
      {updateSetting.error && (
        <p className="text-caption-lg text-text-danger px-5">{getErrorMessage(updateSetting.error)}</p>
      )}

      <AccountActions />
    </main>
  )
}
