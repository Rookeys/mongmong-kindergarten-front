"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { BottomSheet, Button, GridList, GridListItem, ListRow, Modal, Result } from "@kojaem/mongmong"
import { DIALOG_CLASS } from "@/constants/dialog"
import { Link } from "@/i18n/navigation"
import { api, ApiError, MOODS, type CreateLetterResponse, type DailyQuestion, type Letter, type Mood } from "@/utils/api"
import LetterTopNavigation from "../LetterTopNavigation"
import LetterSentFlow from "./LetterSentFlow"

const MAX_LENGTH = 1000
// 지난 날짜 일지는 꿈조각 3개 차감 (백엔드 POST /letters)
const PAST_LETTER_COST = 3

interface Props {
  title: string
  question: DailyQuestion
  written?: Letter
  previous: Letter[]
  characterName: string
  characterImage: string | null
  isPastDate: boolean
  rewardCount: number
}

export default function LetterWriteForm({
  title,
  question,
  written,
  previous,
  characterName,
  characterImage,
  isPastDate,
  rewardCount
}: Props) {
  const t = useTranslations("letterWrite")
  const tMood = useTranslations("mood")
  const locale = useLocale()
  const { data: session } = useSession()
  const [answer, setAnswer] = useState(written?.answer ?? "")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [costModal, setCostModal] = useState<"confirm" | "insufficient">()
  const [mood, setMood] = useState<Mood>()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState<CreateLetterResponse>()

  if (sent) {
    return <LetterSentFlow letter={sent} characterName={characterName} characterImage={characterImage} />
  }

  const send = async () => {
    setSending(true)
    setError(undefined)
    try {
      const letter = await api<CreateLetterResponse>("/letters", {
        method: "POST",
        token: session?.access_token,
        body: { answer, mood, letterDate: question.date, localeType: locale }
      })
      setSheetOpen(false)
      setSent(letter)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e))
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* TODO: 제목 옆 화살표로 날짜 변경 (Figma "날짜 변경") */}
      <LetterTopNavigation title={title} />
      <h1 className="text-title-md text-text-primary px-5 py-6">{question.content}</h1>

      <div className="flex flex-col gap-1.5 py-4">
        {/* TODO: 디자인시스템 TextArea(@kojaem/text-field) 배포 후 교체 */}
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          maxLength={MAX_LENGTH}
          disabled={Boolean(written)}
          placeholder={t("placeholder", { max: MAX_LENGTH })}
          rows={2}
          className="border-border-brand-weak rounded-textfield bg-background-upper text-body-md text-text-inverse-primary placeholder:text-text-inverse-tertiary mx-5 min-h-[54px] resize-none border p-4 outline-none field-sizing-content"
        />
        <p className="text-caption-lg text-text-secondary px-6">
          {answer.length}/{MAX_LENGTH}
        </p>
      </div>

      <Link href="/lounge" className="block">
        <ListRow
          padding="l"
          className="[&_*]:text-text-primary!"
          leadingAsset={<img src="/assets/images/character-face.png" alt="" width={30} height={30} />}
          title={t("othersReplies")}
          trailingAccessory={<span aria-hidden>›</span>}
        />
      </Link>

      <h2 className="text-subtitle-lg text-text-primary px-5 pt-6 pb-3">{t("previous")}</h2>
      {previous.length === 0 ? (
        <Result
          className="[&_*]:text-text-secondary!"
          image={<img src="/assets/images/character-face.png" alt="" width={40} height={40} />}
          title={t("noPrevious")}
        />
      ) : (
        <ul className="flex flex-col gap-4 px-5 pb-28">
          {previous.map((letter) => (
            <li key={letter.id} className="flex flex-col gap-2">
              <p className="text-subtitle-md text-text-primary">{letter.letterDate.replaceAll("-", ".")}</p>
              <p className="rounded-textfield border-border-brand-weak bg-background-upper text-body-md text-text-inverse-primary border p-4 whitespace-pre-line">
                {letter.answer}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!written && answer.trim() && (
        <div className="sticky bottom-0 mt-auto px-5 pb-5">
          <Button size="xl" color="brand" variant="fill" isFullWidth onClick={() => {
              if (!isPastDate) return setSheetOpen(true)
              setCostModal(rewardCount < PAST_LETTER_COST ? "insufficient" : "confirm")
            }}
          >
            {t("submit")}
          </Button>
        </div>
      )}

      <Modal
        className={DIALOG_CLASS}
        open={Boolean(costModal)}
        onOpenChange={(open) => !open && setCostModal(undefined)}
        title={t(costModal === "insufficient" ? "costInsufficientTitle" : "costTitle", { count: PAST_LETTER_COST })}
        description={t(costModal === "insufficient" ? "costInsufficientDescription" : "costDescription", {
          count: PAST_LETTER_COST
        })}
        buttons={
          <>
            <Button size="l" className="whitespace-nowrap" color="brand" variant="weak" isFullWidth onClick={() => setCostModal(undefined)}>
              {t("costLater")}
            </Button>
            {costModal === "insufficient" ? (
              // TODO: AdMob 보상형 광고 연결 (백엔드 TODO: SSV 콜백으로 지급)
              <Button size="l" className="whitespace-nowrap" color="brand" variant="fill" isFullWidth disabled>
                {t("costWatchAd")}
              </Button>
            ) : (
              <Button
                size="l"
                color="brand"
                variant="fill"
                isFullWidth
                onClick={() => {
                  setCostModal(undefined)
                  setSheetOpen(true)
                }}
              >
                {t("costUse")}
              </Button>
            )}
          </>
        }
      />

      <BottomSheet
        className={DIALOG_CLASS}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={t("moodTitle")}
        description={t("moodDescription")}
        buttons={
          <div className="flex w-full flex-col gap-2">
            {error && <p className="text-caption-lg text-text-danger">{error}</p>}
            <Button size="xl" color="brand" variant="fill" isFullWidth disabled={!mood || sending} onClick={send}>
              {t("moodConfirm")}
            </Button>
          </div>
        }
      >
        <GridList columns="3">
          {MOODS.map((value) => (
            <GridListItem
              key={value}
              image={<img src="/assets/images/mood-placeholder.png" alt="" width={40} height={40} />}
              label={tMood(value)}
              selected={mood === value}
              onClick={() => setMood(value)}
            />
          ))}
        </GridList>
      </BottomSheet>
    </>
  )
}
