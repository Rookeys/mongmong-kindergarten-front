"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, Toast } from "@kojaem/mongmong"
import { useLetterUpdate } from "@/apis/generated/letters/letters"
import type { CreateLetterResponseDto, GetCharacterResponseDto } from "@/apis/generated/model"
import { getErrorMessage } from "@/apis/instance"
import CharacterImage from "@/components/CharacterImage"
import { useToast } from "@/hooks/useToast"
import { Link } from "@/i18n/navigation"

/** "편지를 보냈어요" 화면을 보여주는 시간 */
const SENT_SCREEN_MS = 2500

type Step = "sent" | "share" | "reward"

interface Props {
  letter: CreateLetterResponseDto
  character: GetCharacterResponseDto
}

/** 답장을 보낸 뒤: 보냄 안내 → 공개 여부 (공개하면 SNS 소개 동의) → 받은 꿈조각 */
export default function LetterSentFlow({ letter, character }: Props) {
  const t = useTranslations("letterSent")
  const [step, setStep] = useState<Step>("sent")
  const [isSnsSheetOpen, setIsSnsSheetOpen] = useState(false)
  const updateLetter = useLetterUpdate()
  const { toastMessage, showToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => setStep("share"), SENT_SCREEN_MS)
    return () => clearTimeout(timer)
  }, [])

  // isPrivate·isPrivateSns는 "비공개 여부"라서 화면의 공개·동의와 반대다
  const saveVisibility = ({ isPublic, allowSns }: { isPublic: boolean; allowSns: boolean }) => {
    updateLetter.mutate(
      { id: letter.id, data: { isPrivate: !isPublic, isPrivateSns: !allowSns } },
      {
        onSuccess: () => {
          setIsSnsSheetOpen(false)
          showToast(isPublic ? t("savedPublic") : t("savedPrivate"))
          setStep("reward")
        }
      }
    )
  }

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col items-center px-[20px] pb-[20px]">
      <div className="flex flex-col items-center gap-[8px] pt-[64px] text-center">
        <p className="text-title-sm text-text-primary whitespace-pre-line">{getTitle(step, letter.rewardAmount, t)}</p>
        {step === "share" && <p className="text-body-md text-text-secondary">{t("shareDescription")}</p>}
      </div>

      <div className="flex flex-1 items-center">
        <CharacterImage src={character.characterType.imageUrl} alt={character.characterType.name} size={180} />
      </div>

      {toastMessage && (
        <Toast className="mb-[12px]" icon={<span aria-hidden>✓</span>}>
          {toastMessage}
        </Toast>
      )}
      {updateLetter.error && (
        <p className="text-caption-lg text-text-danger mb-[8px]">{getErrorMessage(updateLetter.error)}</p>
      )}

      {step === "share" && (
        <div className="flex w-full gap-[8px]">
          <Button
            size="xl"
            color="brand"
            variant="weak"
            isFullWidth
            disabled={updateLetter.isPending}
            onClick={() => saveVisibility({ isPublic: false, allowSns: false })}
          >
            {t("private")}
          </Button>
          <Button
            size="xl"
            color="brand"
            variant="fill"
            isFullWidth
            disabled={updateLetter.isPending}
            onClick={() => setIsSnsSheetOpen(true)}
          >
            {t("public")}
          </Button>
        </div>
      )}

      {step === "reward" && (
        <Button asChild size="xl" color="brand" variant="fill" isFullWidth>
          <Link href="/">{t("goHome")}</Link>
        </Button>
      )}

      <BottomSheet
        open={isSnsSheetOpen}
        onOpenChange={setIsSnsSheetOpen}
        title={t("snsTitle", { name: character.characterType.name })}
        description={t("snsDescription")}
        buttons={
          <>
            <Button
              size="xl"
              color="brand"
              variant="weak"
              isFullWidth
              disabled={updateLetter.isPending}
              onClick={() => saveVisibility({ isPublic: true, allowSns: false })}
            >
              {t("snsNo")}
            </Button>
            <Button
              size="xl"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={updateLetter.isPending}
              onClick={() => saveVisibility({ isPublic: true, allowSns: true })}
            >
              {t("snsYes")}
            </Button>
          </>
        }
      />
    </main>
  )
}

function getTitle(step: Step, rewardAmount: number, t: ReturnType<typeof useTranslations<"letterSent">>) {
  if (step === "sent") return t("sent")
  if (step === "share") return t("shareTitle")
  if (rewardAmount >= 0) return t("rewardEarned", { count: rewardAmount })
  return t("rewardSpent", { count: -rewardAmount })
}
