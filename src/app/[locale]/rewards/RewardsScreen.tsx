"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { BottomSheet, Button, ListRow, Toast } from "@kojaem/mongmong"
import { getAuthGetMeQueryKey, useAuthGetMe } from "@/apis/generated/auth/auth"
import {
  getRewardFindTodayAttendanceQueryKey,
  useRewardCheckAttendance,
  useRewardFindTodayAttendance
} from "@/apis/generated/rewards/rewards"
import { getErrorMessage } from "@/apis/instance"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import LoadingScreen from "@/components/LoadingScreen"
import { useToast } from "@/hooks/useToast"
import { Link } from "@/i18n/navigation"
import { AD_REWARD, ATTENDANCE_REWARD, INVITE_REWARD } from "./constants"
import InviteSheet from "./InviteSheet"
import RewardRow from "./RewardRow"

export default function RewardsScreen() {
  const t = useTranslations("rewards")
  const queryClient = useQueryClient()
  const { data: me } = useAuthGetMe()
  const { data: attendance } = useRewardFindTodayAttendance()
  const checkAttendance = useRewardCheckAttendance()
  const [openSheet, setOpenSheet] = useState<"attendance" | "invite">()
  const { toastMessage, showToast } = useToast()

  if (!me || !attendance) return <LoadingScreen />

  const handleAttendance = () => {
    checkAttendance.mutate(undefined, {
      onSuccess: () => {
        setOpenSheet(undefined)
        showToast(t("attendanceDone", { count: ATTENDANCE_REWARD }))
        queryClient.invalidateQueries({ queryKey: getRewardFindTodayAttendanceQueryKey() })
        queryClient.invalidateQueries({ queryKey: getAuthGetMeQueryKey() })
      },
      onError: (error) => showToast(getErrorMessage(error))
    })
  }

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />

      {/* TODO: 꿈조각 이력 화면 (GET /rewards/history) */}
      <ListRow padding="l" leadingAsset={<CharacterFace />} title={t("count", { count: me.rewardCount })} />
      <RewardRow
        title={t("attendance")}
        buttonLabel={attendance.isChecked ? t("received") : t("receive", { count: ATTENDANCE_REWARD })}
        disabled={attendance.isChecked}
        onClick={() => setOpenSheet("attendance")}
      />
      {/* TODO: AdMob 보상형 광고 연결 전까지 비활성 */}
      <RewardRow title={t("ad")} buttonLabel={t("receive", { count: AD_REWARD })} disabled />
      <RewardRow
        title={t("invite")}
        buttonLabel={t("receive", { count: INVITE_REWARD })}
        onClick={() => setOpenSheet("invite")}
      />

      {toastMessage && <Toast className="fixed bottom-6 left-1/2 -translate-x-1/2">{toastMessage}</Toast>}

      <BottomSheet
        open={openSheet === "attendance"}
        onOpenChange={(open) => setOpenSheet(open ? "attendance" : undefined)}
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
              disabled={checkAttendance.isPending}
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

      <InviteSheet
        open={openSheet === "invite"}
        onOpenChange={(open) => setOpenSheet(open ? "invite" : undefined)}
        inviteCode={me.myInviteCode}
        onCopied={() => showToast(t("codeCopied"))}
      />
    </main>
  )
}
