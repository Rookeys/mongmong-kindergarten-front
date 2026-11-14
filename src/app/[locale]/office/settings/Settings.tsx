"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { signOut, useSession } from "next-auth/react"
import { Button, Checkbox, Chip, ListRow, Modal } from "@kojaem/mongmong"
import { DIALOG_CLASS } from "@/constants/dialog"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { api, ApiError, type UserSetting } from "@/utils/api"

const ROW_CLASS = "[&_*]:text-text-primary!"
const TOGGLES = ["setLetterIsPrivate", "setLetterIsPrivateSns", "pushEnabled"] as const

export default function Settings({ setting: initial }: { setting: UserSetting }) {
  const t = useTranslations("settings")
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [setting, setSetting] = useState(initial)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  const save = async (patch: Partial<UserSetting>) => {
    const previous = setting
    setSetting({ ...setting, ...patch })
    try {
      await api("/auth/me/settings", { method: "PATCH", token: session?.access_token, body: patch })
      if (patch.localeType) router.replace(pathname, { locale: patch.localeType })
    } catch (e) {
      setSetting(previous)
      setError(e instanceof ApiError ? e.message : String(e))
    }
  }

  const logout = async () => {
    setBusy(true)
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    await signOut({ callbackUrl: "/auth/sign-in" })
  }

  const withdraw = async () => {
    setBusy(true)
    try {
      await api("/auth/me", { method: "DELETE", token: session?.access_token })
      await signOut({ callbackUrl: "/auth/sign-in" })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e))
      setBusy(false)
    }
  }

  return (
    <>
      {TOGGLES.map((key) => {
        // 백엔드 값은 "비공개 여부"라서 화면에서는 반대로 보여준다 (켜짐 = 공개)
        const inverted = key !== "pushEnabled"
        const checked = inverted ? !setting[key] : setting[key]
        return (
          <label key={key} className="block cursor-pointer">
            <ListRow
              padding="l"
              className={ROW_CLASS}
              title={t(key)}
              description={t(`${key}Description`)}
              trailingAccessory={
                <Checkbox checked={checked} onChange={(event) => save({ [key]: inverted ? !event.target.checked : event.target.checked })} />
              }
            />
          </label>
        )
      })}
      <ListRow
        padding="l"
        className={ROW_CLASS}
        title={t("language")}
        trailingAccessory={
          <div className="flex gap-1.5">
            {routing.locales.map((locale) => (
              <Chip key={locale} kind="select" size="s" selected={setting.localeType === locale} onClick={() => save({ localeType: locale })}>
                {t(`locale.${locale}`)}
              </Chip>
            ))}
          </div>
        }
      />
      {error && <p className="text-caption-lg text-text-danger px-5">{error}</p>}

      <div className="mt-auto flex flex-col gap-2 px-5 pb-5">
        <Button size="xl" color="brand" variant="fill" isFullWidth disabled={busy} onClick={logout}>
          {t("logout")}
        </Button>
        <button type="button" className="text-caption-lg text-text-tertiary py-2 underline" onClick={() => setWithdrawOpen(true)}>
          {t("withdraw")}
        </button>
      </div>

      <Modal
        className={DIALOG_CLASS}
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        title={t("withdrawTitle")}
        description={t("withdrawDescription")}
        buttons={
          <>
            <Button size="l" className="whitespace-nowrap" color="brand" variant="weak" isFullWidth onClick={() => setWithdrawOpen(false)}>
              {t("cancel")}
            </Button>
            <Button size="l" className="whitespace-nowrap" color="brand" variant="fill" isFullWidth disabled={busy} onClick={withdraw}>
              {t("withdrawConfirm")}
            </Button>
          </>
        }
      />
    </>
  )
}
