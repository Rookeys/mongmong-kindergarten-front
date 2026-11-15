"use client"

import { useTranslations } from "next-intl"
import { BottomSheet, Button } from "@kojaem/mongmong"
import CharacterFace from "@/components/CharacterFace"
import { INVITE_REWARD } from "./constants"

const INVITE_STEPS = ["inviteStep1", "inviteStep2", "inviteStep3"] as const

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteCode: string
  onCopied: () => void
}

/** 친구 초대 방법 안내와 초대 코드 공유 */
export default function InviteSheet({ open, onOpenChange, inviteCode, onCopied }: Props) {
  const t = useTranslations("rewards")

  // 공유 기능이 있는 기기(모바일)는 공유 창, 없으면 초대 코드를 복사한다
  const handleInvite = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: t("inviteMessage", { code: inviteCode }) })
      } else {
        await navigator.clipboard.writeText(inviteCode)
        onCopied()
      }
      onOpenChange(false)
    } catch {
      // 사용자가 공유 창을 닫은 경우
    }
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      buttonLayout="vertical"
      buttons={
        <>
          <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleInvite}>
            {t("inviteSend")}
          </Button>
          <Button size="xl" color="brand" variant="weak" isFullWidth onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </>
      }
    >
      <ul className="flex flex-col gap-[16px]">
        {INVITE_STEPS.map((step) => (
          <li key={step} className="flex items-start gap-[12px]">
            <CharacterFace />
            <div className="flex flex-col gap-[4px]">
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
  )
}
