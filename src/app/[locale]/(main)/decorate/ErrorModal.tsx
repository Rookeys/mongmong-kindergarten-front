import { useTranslations } from "next-intl"
import { Button, Modal } from "@kojaem/mongmong"

/** 저장 실패 안내. message가 있으면 열린다. */
export default function ErrorModal({ message, onClose }: { message?: string; onClose: () => void }) {
  const t = useTranslations("decorate")
  return (
    <Modal
      open={Boolean(message)}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={message}
      buttons={
        <Button size="l" color="brand" variant="fill" isFullWidth onClick={onClose}>
          {t("close")}
        </Button>
      }
    />
  )
}
