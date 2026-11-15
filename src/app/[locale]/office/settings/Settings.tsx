"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { signOut } from "next-auth/react"
import { Checkbox, Chip, ListRow } from "@kojaem/mongmong"
import { updateMySetting, type UserSetting } from "@/apis/auth"
import { getErrorMessage } from "@/apis/fetcher"
import { ON_DARK_TEXT } from "@/constants/designSystemOverrides"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import AccountActions from "./AccountActions"

export default function Settings({ initialSetting }: { initialSetting: UserSetting }) {
  const t = useTranslations("settings")
  const router = useRouter()
  const pathname = usePathname()
  const [setting, setSetting] = useState(initialSetting)
  const [errorMessage, setErrorMessage] = useState<string>()

  // 화면에 먼저 반영하고, 저장에 실패하면 되돌린다
  const saveSetting = async (changes: Partial<UserSetting>) => {
    const previousSetting = setting
    setSetting({ ...setting, ...changes })
    setErrorMessage(undefined)
    try {
      await updateMySetting(changes)
      if (changes.localeType) {
        router.replace(pathname, { locale: changes.localeType })
      }
    } catch (error) {
      setSetting(previousSetting)
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <>
      {/* 백엔드 값은 "비공개 여부"라서 화면의 켜짐(공개)과 반대다 */}
      <SettingToggleRow
        title={t("setLetterIsPrivate")}
        description={t("setLetterIsPrivateDescription")}
        checked={!setting.setLetterIsPrivate}
        onChange={(isPublic) => saveSetting({ setLetterIsPrivate: !isPublic })}
      />
      <SettingToggleRow
        title={t("setLetterIsPrivateSns")}
        description={t("setLetterIsPrivateSnsDescription")}
        checked={!setting.setLetterIsPrivateSns}
        onChange={(allowSns) => saveSetting({ setLetterIsPrivateSns: !allowSns })}
      />
      <SettingToggleRow
        title={t("pushEnabled")}
        description={t("pushEnabledDescription")}
        checked={setting.pushEnabled}
        onChange={(pushEnabled) => saveSetting({ pushEnabled })}
      />
      <ListRow
        padding="l"
        className={ON_DARK_TEXT}
        title={t("language")}
        trailingAccessory={
          <div className="flex gap-1.5">
            {routing.locales.map((locale) => (
              <Chip
                key={locale}
                kind="select"
                size="s"
                selected={setting.localeType === locale}
                onClick={() => saveSetting({ localeType: locale })}
              >
                {t(`locale.${locale}`)}
              </Chip>
            ))}
          </div>
        }
      />
      {errorMessage && <p className="text-caption-lg text-text-danger px-5">{errorMessage}</p>}

      <AccountActions onSignOut={() => signOut({ callbackUrl: "/auth/sign-in" })} />
    </>
  )
}

interface SettingToggleRowProps {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function SettingToggleRow({ title, description, checked, onChange }: SettingToggleRowProps) {
  return (
    <label className="block cursor-pointer">
      <ListRow
        padding="l"
        className={ON_DARK_TEXT}
        title={title}
        description={description}
        trailingAccessory={<Checkbox checked={checked} onChange={(event) => onChange(event.target.checked)} />}
      />
    </label>
  )
}
