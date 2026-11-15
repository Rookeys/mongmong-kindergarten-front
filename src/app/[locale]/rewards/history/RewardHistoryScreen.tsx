"use client"

import { useTranslations } from "next-intl"
import { ListRow, Result } from "@kojaem/mongmong"
import { useRewardFindMyHistory } from "@/apis/generated/rewards/rewards"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import LoadingScreen from "@/components/LoadingScreen"
import { formatDotDate } from "@/utils/date"

/** 꿈조각을 받거나 쓴 기록. TODO: Figma 화면이 없어 디자인시스템 ListRow로 임시 구현 (TODO.md) */
export default function RewardHistoryScreen() {
  const t = useTranslations("rewardHistory")
  const { data: history } = useRewardFindMyHistory()

  if (!history) return <LoadingScreen />

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      {history.length === 0 ? (
        <Result className="mt-[80px]" image={<CharacterFace size={40} />} title={t("empty")} />
      ) : (
        <ul>
          {history.map((reward) => (
            <li key={reward.id}>
              <ListRow
                padding="l"
                title={t(`type.${reward.type}`)}
                description={formatDotDate(reward.createdDate)}
                trailingAccessory={
                  <span className={reward.amount >= 0 ? "text-text-brand" : "text-text-tertiary"}>
                    {reward.amount >= 0 ? `+${reward.amount}` : reward.amount}
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
