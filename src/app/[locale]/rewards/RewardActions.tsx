"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { BottomSheet, Button, ListRow, Toast } from "@kojaem/mongmong"
import { DIALOG_CLASS } from "@/constants/dialog"
import { Link, useRouter } from "@/i18n/navigation"
import { api, ApiError } from "@/utils/api"
import { sleep } from "@/utils/sleep"

const ATTENDANCE_REWARD = 1
const AD_REWARD = 3
const INVITE_REWARD = 5

interface Props {
  rewardCount: number
  attended: boolean
  inviteCode: string
}

const Face = ({ size = 30 }: { size?: number }) => (
  <img src="/assets/images/character-face.png" alt="" width={size} height={size} />
)

export default function RewardActions({ rewardCount, attended, inviteCode }: Props) {
  const t = useTranslations("rewards")
  const router = useRouter()
  const { data: session } = useSession()
  const [sheet, setSheet] = useState<"attendance" | "invite">()
  const [toast, setToast] = useState<string>()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (toast) sleep(2500).then(() => setToast(undefined))
  }, [toast])

  const attend = async () => {
    setBusy(true)
    try {
      await api("/rewards/attendance", { method: "POST", token: session?.access_token })
      setSheet(undefined)
      setToast(t("attendanceDone", { count: ATTENDANCE_REWARD }))
      router.refresh()
    } catch (e) {
      setToast(e instanceof ApiError ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const invite = async () => {
    const text = t("inviteMessage", { code: inviteCode })
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(inviteCode)
        setToast(t("codeCopied"))
      }
      setSheet(undefined)
    } catch {
      // 공유 창을 닫은 경우
    }
  }

  const row = (title: string, count: number, onClick: () => void, disabled = false, done = false) => (
    <ListRow
      padding="l"
      className="[&_*]:text-text-primary!"
      leadingAsset={<Face />}
      title={title}
      trailingAccessory={
        <Button size="s" color="brand" variant="fill" disabled={disabled} onClick={onClick}>
          {done ? t("received") : t("receive", { count })}
        </Button>
      }
    />
  )

  return (
    <>
      {/* TODO: 꿈조각 이력 화면 (GET /rewards/history) */}
      <ListRow
        padding="l"
        className="[&_*]:text-text-primary! [&_*]:text-title-md!"
        leadingAsset={<Face />}
        title={t("count", { count: rewardCount })}
      />
      {row(t("attendance"), ATTENDANCE_REWARD, () => setSheet("attendance"), attended, attended)}
      {/* TODO: AdMob 보상형 광고 연결 후 POST /rewards/ad-view (백엔드는 SSV 콜백으로 옮길 예정) */}
      {row(t("ad"), AD_REWARD, () => {}, true)}
      {row(t("invite"), INVITE_REWARD, () => setSheet("invite"))}

      {toast && <Toast className="fixed bottom-6 left-1/2 -translate-x-1/2">{toast}</Toast>}

      <BottomSheet
        className={DIALOG_CLASS}
        open={sheet === "attendance"}
        onOpenChange={(open) => !open && setSheet(undefined)}
        title={t("attendanceTitle", { count: ATTENDANCE_REWARD })}
        description={t("attendanceDescription")}
        buttonLayout="vertical"
        buttons={
          <>
            <Button size="xl" color="brand" variant="fill" isFullWidth disabled={busy} onClick={attend}>
              {t("receiveShort")}
            </Button>
            <Button asChild size="xl" color="brand" variant="weak" isFullWidth>
              <Link href="/letter/write">{t("writeReply")}</Link>
            </Button>
          </>
        }
      >
        <div className="flex justify-center">
          <Face size={100} />
        </div>
      </BottomSheet>

      <BottomSheet
        className={DIALOG_CLASS}
        open={sheet === "invite"}
        onOpenChange={(open) => !open && setSheet(undefined)}
        buttonLayout="vertical"
        buttons={
          <>
            <Button size="xl" color="brand" variant="fill" isFullWidth onClick={invite}>
              {t("inviteSend")}
            </Button>
            <Button size="xl" color="brand" variant="weak" isFullWidth onClick={() => setSheet(undefined)}>
              {t("close")}
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-4">
          {(["inviteStep1", "inviteStep2", "inviteStep3"] as const).map((key) => (
            <li key={key} className="flex items-start gap-3">
              <Face />
              <div className="flex flex-col gap-1">
                <p className="text-subtitle-lg text-text-inverse-primary">{t(`${key}.title`, { count: INVITE_REWARD })}</p>
                {t.has(`${key}.description`) && (
                  <p className="text-caption-lg text-text-inverse-secondary">{t(`${key}.description`)}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  )
}
