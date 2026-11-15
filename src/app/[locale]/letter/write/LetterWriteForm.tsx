"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button, ListRow } from "@kojaem/mongmong"
import { getErrorMessage } from "@/apis/fetcher"
import { createLetter, type CreatedLetter, type Letter, type Mood } from "@/apis/letter"
import type { Character } from "@/apis/character"
import type { DailyQuestion } from "@/apis/question"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import { ON_DARK_TEXT } from "@/constants/designSystemOverrides"
import { Link } from "@/i18n/navigation"
import LetterSentFlow from "./LetterSentFlow"
import MoodSheet from "./MoodSheet"
import PastLetterCostModal, { PAST_LETTER_COST } from "./PastLetterCostModal"
import PreviousLetters from "./PreviousLetters"

const MAX_ANSWER_LENGTH = 1000

interface Props {
  title: string
  question: DailyQuestion
  /** 이 날짜에 이미 쓴 답장. 있으면 읽기 전용으로 보여준다. */
  writtenLetter?: Letter
  /** 같은 질문에 예전에 쓴 답장들 */
  previousLetters: Letter[]
  character: Character
  isPastDate: boolean
  rewardCount: number
}

export default function LetterWriteForm({
  title,
  question,
  writtenLetter,
  previousLetters,
  character,
  isPastDate,
  rewardCount
}: Props) {
  const t = useTranslations("letterWrite")
  const locale = useLocale()
  const [answer, setAnswer] = useState(writtenLetter?.answer ?? "")
  const [isCostModalOpen, setIsCostModalOpen] = useState(false)
  const [isMoodSheetOpen, setIsMoodSheetOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string>()
  const [sentLetter, setSentLetter] = useState<CreatedLetter>()

  if (sentLetter) {
    return <LetterSentFlow letter={sentLetter} character={character} />
  }

  const canSubmit = !writtenLetter && answer.trim().length > 0

  // 지난 날짜 답장은 꿈조각을 쓰므로 먼저 확인받는다
  const handleSubmitClick = () => {
    if (isPastDate) {
      setIsCostModalOpen(true)
    } else {
      setIsMoodSheetOpen(true)
    }
  }

  const handleSend = async (mood: Mood) => {
    setIsSending(true)
    setSendError(undefined)
    try {
      const letter = await createLetter({ answer, mood, letterDate: question.date, localeType: locale })
      setIsMoodSheetOpen(false)
      setSentLetter(letter)
    } catch (error) {
      setSendError(getErrorMessage(error))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {/* TODO: 제목 옆 화살표로 날짜 변경 (Figma "날짜 변경") */}
      <BackTopNavigation title={title} />
      <h1 className="text-title-md text-text-primary px-5 py-6">{question.content}</h1>

      <div className="flex flex-col gap-1.5 py-4">
        {/* TODO: 디자인시스템 TextArea 배포 후 교체 */}
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          maxLength={MAX_ANSWER_LENGTH}
          disabled={Boolean(writtenLetter)}
          placeholder={t("placeholder", { max: MAX_ANSWER_LENGTH })}
          rows={2}
          className="border-border-brand-weak rounded-textfield bg-background-upper text-body-md text-text-inverse-primary placeholder:text-text-inverse-tertiary mx-5 field-sizing-content min-h-[54px] resize-none border p-4 outline-none"
        />
        <p className="text-caption-lg text-text-secondary px-6">
          {answer.length}/{MAX_ANSWER_LENGTH}
        </p>
      </div>

      <Link href={`/lounge?date=${question.date}`} className="block">
        <ListRow
          padding="l"
          className={ON_DARK_TEXT}
          leadingAsset={<CharacterFace />}
          title={t("othersReplies")}
          trailingAccessory={<span aria-hidden>›</span>}
        />
      </Link>

      <PreviousLetters letters={previousLetters} />

      {canSubmit && (
        <div className="sticky bottom-0 mt-auto px-5 pb-5">
          <Button size="xl" color="brand" variant="fill" isFullWidth onClick={handleSubmitClick}>
            {t("submit")}
          </Button>
        </div>
      )}

      <PastLetterCostModal
        open={isCostModalOpen}
        hasEnoughReward={rewardCount >= PAST_LETTER_COST}
        onClose={() => setIsCostModalOpen(false)}
        onConfirm={() => {
          setIsCostModalOpen(false)
          setIsMoodSheetOpen(true)
        }}
      />

      <MoodSheet
        open={isMoodSheetOpen}
        onOpenChange={setIsMoodSheetOpen}
        isSending={isSending}
        errorMessage={sendError}
        onConfirm={handleSend}
      />
    </>
  )
}
