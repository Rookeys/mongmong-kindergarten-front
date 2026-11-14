"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { AnimatePresence } from "motion/react"
import { BottomSheet, Button, Toast } from "@kojaem/mongmong"
import CharacterImage from "@/components/CharacterImage"
import { DIALOG_CLASS } from "@/constants/dialog"
import { Link } from "@/i18n/navigation"
import { api, ApiError, type CreateLetterResponse } from "@/utils/api"
import { sleep } from "@/utils/sleep"

const SENT_MS = 2500
const TOAST_MS = 2500

interface Props {
  letter: CreateLetterResponse
  characterName: string
  characterImage: string | null
}

// 편지를 보냈어요 → 답장 공개 여부 (공개하면 SNS 소개 동의) → 꿈조각 보상
export default function LetterSentFlow({ letter, characterName, characterImage }: Props) {
  const t = useTranslations("letterSent")
  const { data: session } = useSession()
  const [step, setStep] = useState<"sent" | "share" | "reward">("sent")
  const [snsSheetOpen, setSnsSheetOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const [toast, setToast] = useState<string>()

  useEffect(() => {
    sleep(SENT_MS).then(() => setStep((current) => (current === "sent" ? "share" : current)))
  }, [])

  useEffect(() => {
    if (!toast) return
    sleep(TOAST_MS).then(() => setToast(undefined))
  }, [toast])

  const saveVisibility = async (isPrivate: boolean, isPrivateSns: boolean) => {
    setSaving(true)
    setError(undefined)
    try {
      await api(`/letters/${letter.id}`, {
        method: "PATCH",
        token: session?.access_token,
        body: { isPrivate, isPrivateSns }
      })
      setSnsSheetOpen(false)
      setToast(isPrivate ? t("savedPrivate") : t("savedPublic"))
      setStep("reward")
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const title = {
    sent: t("sent"),
    share: t("shareTitle"),
    reward:
      letter.rewardAmount >= 0
        ? t("rewardEarned", { count: letter.rewardAmount })
        : t("rewardSpent", { count: -letter.rewardAmount })
  }[step]

  return (
    <div className="flex flex-1 flex-col items-center px-5 pb-5">
      <div className="flex flex-col items-center gap-2 pt-16 text-center">
        <p className="text-title-sm text-text-primary whitespace-pre-line">{title}</p>
        {step === "share" && <p className="text-body-md text-text-secondary">{t("shareDescription")}</p>}
      </div>

      <div className="flex flex-1 items-center">
        <CharacterImage src={characterImage} alt={characterName} size={180} />
      </div>

      <AnimatePresence>
        {toast && (
          <Toast className="mb-3" icon={<span aria-hidden>✓</span>}>
            {toast}
          </Toast>
        )}
      </AnimatePresence>
      {error && <p className="text-caption-lg text-text-danger mb-2">{error}</p>}

      {step === "share" && (
        <div className="flex w-full gap-2">
          <Button
            size="xl"
            color="brand"
            variant="weak"
            isFullWidth
            disabled={saving}
            onClick={() => saveVisibility(true, true)}
          >
            {t("private")}
          </Button>
          <Button size="xl" color="brand" variant="fill" isFullWidth disabled={saving} onClick={() => setSnsSheetOpen(true)}>
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
        className={DIALOG_CLASS}
        open={snsSheetOpen}
        onOpenChange={setSnsSheetOpen}
        title={t("snsTitle", { name: characterName })}
        description={t("snsDescription")}
        buttons={
          <>
            <Button size="xl" color="brand" variant="weak" isFullWidth disabled={saving} onClick={() => saveVisibility(false, true)}>
              {t("snsNo")}
            </Button>
            <Button size="xl" color="brand" variant="fill" isFullWidth disabled={saving} onClick={() => saveVisibility(false, false)}>
              {t("snsYes")}
            </Button>
          </>
        }
      />
    </div>
  )
}
