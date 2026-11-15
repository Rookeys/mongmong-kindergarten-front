"use client"

import { useTranslations } from "next-intl"
import { Button, Modal } from "@kojaem/mongmong"
import { DIALOG_SURFACE } from "@/constants/designSystemOverrides"

/** 지난 날짜에 답장하면 꿈조각 3개를 쓴다 (백엔드 POST /letters) */
export const PAST_LETTER_COST = 3

interface Props {
  open: boolean
  hasEnoughReward: boolean
  onClose: () => void
  onConfirm: () => void
}

/** 지난 날짜 답장 전 꿈조각 사용 확인. 꿈조각이 부족하면 광고 안내로 바뀐다. */
export default function PastLetterCostModal({ open, hasEnoughReward, onClose, onConfirm }: Props) {
  const t = useTranslations("letterWrite")
  const values = { count: PAST_LETTER_COST }

  return (
    <Modal
      className={DIALOG_SURFACE}
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={hasEnoughReward ? t("costTitle", values) : t("costInsufficientTitle", values)}
      description={hasEnoughReward ? t("costDescription", values) : t("costInsufficientDescription")}
      buttons={
        <>
          <Button size="l" className="whitespace-nowrap" color="brand" variant="weak" isFullWidth onClick={onClose}>
            {t("costLater")}
          </Button>
          {hasEnoughReward ? (
            <Button size="l" className="whitespace-nowrap" color="brand" variant="fill" isFullWidth onClick={onConfirm}>
              {t("costUse")}
            </Button>
          ) : (
            // TODO: AdMob 보상형 광고 연결 전까지 비활성
            <Button size="l" className="whitespace-nowrap" color="brand" variant="fill" isFullWidth disabled>
              {t("costWatchAd")}
            </Button>
          )}
        </>
      }
    />
  )
}
