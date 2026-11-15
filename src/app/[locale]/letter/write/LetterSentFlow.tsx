"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { BottomSheet, Button, Toast } from "@kojaem/mongmong"
import type { Character } from "@/apis/character"
import { getErrorMessage } from "@/apis/fetcher"
import { updateLetterVisibility, type CreatedLetter } from "@/apis/letter"
import CharacterImage from "@/components/CharacterImage"
import { DIALOG_SURFACE } from "@/constants/designSystemOverrides"
import { useToast } from "@/hooks/useToast"
import { Link } from "@/i18n/navigation"

/** "편지를 보냈어요" 화면을 보여주는 시간 */
const SENT_SCREEN_MS = 2500

type Step = "sent" | "share" | "reward"

interface Props {
  letter: CreatedLetter
  character: Character
}

/** 답장을 보낸 뒤: 보냄 안내 → 공개 여부 (공개하면 SNS 소개 동의) → 받은 꿈조각 */
export default function LetterSentFlow({ letter, character }: Props) {
  const t = useTranslations("letterSent")
  const [step, setStep] = useState<Step>("sent")
  const [isSnsSheetOpen, setIsSnsSheetOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string>()
  const { toastMessage, showToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => setStep("share"), SENT_SCREEN_MS)
    return () => clearTimeout(timer)
  }, [])

  const saveVisibility = async ({ isPublic, allowSns }: { isPublic: boolean; allowSns: boolean }) => {
    setIsSaving(true)
    setSaveError(undefined)
    try {
      await updateLetterVisibility(letter.id, { isPrivate: !isPublic, isPrivateSns: !allowSns })
      setIsSnsSheetOpen(false)
      showToast(isPublic ? t("savedPublic") : t("savedPrivate"))
      setStep("reward")
    } catch (error) {
      setSaveError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center px-5 pb-5">
      <div className="flex flex-col items-center gap-2 pt-16 text-center">
        <p className="text-title-sm text-text-primary whitespace-pre-line">{getTitle(step, letter.rewardAmount, t)}</p>
        {step === "share" && <p className="text-body-md text-text-secondary">{t("shareDescription")}</p>}
      </div>

      <div className="flex flex-1 items-center">
        <CharacterImage src={character.characterType.imageUrl} alt={character.characterType.name} size={180} />
      </div>

      {toastMessage && (
        <Toast className="mb-3" icon={<span aria-hidden>✓</span>}>
          {toastMessage}
        </Toast>
      )}
      {saveError && <p className="text-caption-lg text-text-danger mb-2">{saveError}</p>}

      {step === "share" && (
        <div className="flex w-full gap-2">
          <Button
            size="xl"
            color="brand"
            variant="weak"
            isFullWidth
            disabled={isSaving}
            onClick={() => saveVisibility({ isPublic: false, allowSns: false })}
          >
            {t("private")}
          </Button>
          <Button
            size="xl"
            color="brand"
            variant="fill"
            isFullWidth
            disabled={isSaving}
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
        className={DIALOG_SURFACE}
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
              disabled={isSaving}
              onClick={() => saveVisibility({ isPublic: true, allowSns: false })}
            >
              {t("snsNo")}
            </Button>
            <Button
              size="xl"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={isSaving}
              onClick={() => saveVisibility({ isPublic: true, allowSns: true })}
            >
              {t("snsYes")}
            </Button>
          </>
        }
      />
    </div>
  )
}

function getTitle(step: Step, rewardAmount: number, t: ReturnType<typeof useTranslations<"letterSent">>) {
  if (step === "sent") return t("sent")
  if (step === "share") return t("shareTitle")
  if (rewardAmount >= 0) return t("rewardEarned", { count: rewardAmount })
  return t("rewardSpent", { count: -rewardAmount })
}
