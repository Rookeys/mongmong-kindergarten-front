import { useTranslations } from "next-intl"
import { Button, Modal } from "@kojaem/mongmong"

interface Props {
  open: boolean
  missingCount: number
  onClose: () => void
}

/** 꿈조각이 모자랄 때 광고 안내 */
export default function InsufficientRewardModal({ open, missingCount, onClose }: Props) {
  const t = useTranslations("decorate")
  const tCommon = useTranslations("common")
  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("insufficientTitle")}
      description={t("insufficientDescription", { count: missingCount })}
      buttons={
        <>
          <Button size="l" color="brand" variant="weak" isFullWidth onClick={onClose}>
            {t("later")}
          </Button>
          {/* TODO: AdMob 보상형 광고 연결 전까지 임시 알림 (TODO.md) */}
          <Button size="l" color="brand" variant="fill" isFullWidth onClick={() => alert(tCommon("adNotReady"))}>
            {t("watchAd")}
          </Button>
        </>
      }
    />
  )
}
