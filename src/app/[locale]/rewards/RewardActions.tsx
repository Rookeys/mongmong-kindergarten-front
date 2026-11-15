"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, ListRow, Toast } from "@kojaem/mongmong"
import { getErrorMessage } from "@/apis/fetcher"
import { checkAttendance } from "@/apis/reward"
import CharacterFace from "@/components/CharacterFace"
import { DIALOG_SURFACE, ON_DARK_TEXT } from "@/constants/designSystemOverrides"
import { useToast } from "@/hooks/useToast"
import { Link, useRouter } from "@/i18n/navigation"

/** 받을 수 있는 꿈조각 수 (백엔드 지급량과 맞춘 안내용 숫자) */
const ATTENDANCE_REWARD = 1
const AD_REWARD = 3
const INVITE_REWARD = 5

const INVITE_STEPS = ["inviteStep1", "inviteStep2", "inviteStep3"] as const

interface Props {
  rewardCount: number
  hasAttendedToday: boolean
  inviteCode: string
}

export default function RewardActions({ rewardCount, hasAttendedToday, inviteCode }: Props) {
  const t = useTranslations("rewards")
  const router = useRouter()
  const [isAttendanceSheetOpen, setIsAttendanceSheetOpen] = useState(false)
  const [isInviteSheetOpen, setIsInviteSheetOpen] = useState(false)
  const [isCheckingAttendance, setIsCheckingAttendance] = useState(false)
  const { toastMessage, showToast } = useToast()

  const handleAttendance = async () => {
    setIsCheckingAttendance(true)
    try {
      await checkAttendance()
      setIsAttendanceSheetOpen(false)
      showToast(t("attendanceDone", { count: ATTENDANCE_REWARD }))
      router.refresh()
    } catch (error) {
      showToast(getErrorMessage(error))
    } finally {
      setIsCheckingAttendance(false)
    }
  }

  // 공유 기능이 있는 기기(모바일)는 공유 창, 없으면 초대 코드를 복사한다
  const handleInvite = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: t("inviteMessage", { code: inviteCode }) })
      } else {
        await navigator.clipboard.writeText(inviteCode)
        showToast(t("codeCopied"))
      }
      setIsInviteSheetOpen(false)
    } catch {
      // 사용자가 공유 창을 닫은 경우
    }
  }

  return (
    <>
      {/* TODO: 꿈조각 이력 화면 (GET /rewards/history) */}
      <ListRow
        padding="l"
        className={`${ON_DARK_TEXT} [&_*]:text-title-md!`}
        leadingAsset={<CharacterFace />}
        title={t("count", { count: rewardCount })}
      />
      <RewardRow
        title={t("attendance")}
        buttonLabel={hasAttendedToday ? t("received") : t("receive", { count: ATTENDANCE_REWARD })}
        disabled={hasAttendedToday}
        onClick={() => setIsAttendanceSheetOpen(true)}
      />
      {/* TODO: AdMob 보상형 광고 연결 전까지 비활성 */}
      <RewardRow title={t("ad")} buttonLabel={t("receive", { count: AD_REWARD })} disabled />
      <RewardRow
        title={t("invite")}
        buttonLabel={t("receive", { count: INVITE_REWARD })}
        onClick={() => setIsInviteSheetOpen(true)}
      />

      {toastMessage && <Toast className="fixed bottom-6 left-1/2 -translate-x-1/2">{toastMessage}</Toast>}

      <BottomSheet
        className={DIALOG_SURFACE}
        open={isAttendanceSheetOpen}
        onOpenChange={setIsAttendanceSheetOpen}
        title={t("attendanceTitle", { count: ATTENDANCE_REWARD })}
        description={t("attendanceDescription")}
        buttonLayout="vertical"
        buttons={
          <>
            <Button
              size="xl"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={isCheckingAttendance}
              onClick={handleAttendance}
            >
              {t("receiveShort")}
            </Button>
            <Button asChild size="xl" color="brand" variant="weak" isFullWidth>
              <Link href="/letter/write">{t("writeReply")}</Link>
            </Button>
          </>
        }
      >
        <div className="flex justify-center">
          <CharacterFace size={100} />
        </div>
      </BottomSheet>

      <BottomSheet
        className={DIALOG_SURFACE}
        open={isInviteSheetOpen}
        onOpenChange={setIsInviteSheetOpen}
        buttonLayout="vertical"
        buttons={
          <>
            <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleInvite}>
              {t("inviteSend")}
            </Button>
            <Button size="xl" color="brand" variant="weak" isFullWidth onClick={() => setIsInviteSheetOpen(false)}>
              {t("close")}
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-4">
          {INVITE_STEPS.map((step) => (
            <li key={step} className="flex items-start gap-3">
              <CharacterFace />
              <div className="flex flex-col gap-1">
                <p className="text-subtitle-lg text-text-inverse-primary">
                  {t(`${step}.title`, { count: INVITE_REWARD })}
                </p>
                {t.has(`${step}.description`) && (
                  <p className="text-caption-lg text-text-inverse-secondary">{t(`${step}.description`)}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  )
}

interface RewardRowProps {
  title: string
  buttonLabel: string
  disabled?: boolean
  onClick?: () => void
}

function RewardRow({ title, buttonLabel, disabled, onClick }: RewardRowProps) {
  return (
    <ListRow
      padding="l"
      className={ON_DARK_TEXT}
      leadingAsset={<CharacterFace />}
      title={title}
      trailingAccessory={
        <Button size="s" color="brand" variant="fill" disabled={disabled} onClick={onClick}>
          {buttonLabel}
        </Button>
      }
    />
  )
}
