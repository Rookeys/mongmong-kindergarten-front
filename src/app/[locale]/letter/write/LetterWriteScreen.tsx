"use client"

import { useState } from "react"
import { useFormatter, useLocale, useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { Button, ListRow, TextArea } from "@kojaem/mongmong"
import { getAuthGetMeQueryKey, useAuthGetMe } from "@/apis/generated/auth/auth"
import { getCharacterFindMineQueryKey, useCharacterFindMine } from "@/apis/generated/characters/characters"
import { getLetterFindCalendarQueryKey, useLetterCreate, useLetterFindAll } from "@/apis/generated/letters/letters"
import type { CreateLetterResponseDto, LocaleType, MoodType } from "@/apis/generated/model"
import { getQuestionFindDailyQueryKey, useQuestionFindDaily } from "@/apis/generated/questions/questions"
import { getErrorMessage } from "@/apis/instance"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import { toKstDate } from "@/utils/date"
import LetterSentFlow from "./LetterSentFlow"
import MoodSheet from "./MoodSheet"
import PastLetterCostModal, { PAST_LETTER_COST } from "./PastLetterCostModal"
import PreviousLetters from "./PreviousLetters"

const MAX_ANSWER_LENGTH = 1000

export default function LetterWriteScreen({ date }: { date?: string }) {
  const t = useTranslations("letterWrite")
  const format = useFormatter()
  const locale = useLocale() as LocaleType
  const queryClient = useQueryClient()

  const { data: character } = useCharacterFindMine()
  const { data: me } = useAuthGetMe()
  const { data: question } = useQuestionFindDaily({ date, locale })
  const { data: myLetters } = useLetterFindAll({ questionId: question?.id }, { query: { enabled: Boolean(question) } })
  const createLetter = useLetterCreate()

  const [answer, setAnswer] = useState<string>()
  const [isCostModalOpen, setIsCostModalOpen] = useState(false)
  const [isMoodSheetOpen, setIsMoodSheetOpen] = useState(false)
  const [sentLetter, setSentLetter] = useState<CreateLetterResponseDto>()

  if (!character || !me || !question || !myLetters) return <LoadingScreen />
  if (sentLetter) return <LetterSentFlow letter={sentLetter} character={character} />

  const writtenLetter = myLetters.find((letter) => letter.id === question.letterId)
  const previousLetters = myLetters.filter((letter) => letter.id !== question.letterId)
  const answerText = answer ?? writtenLetter?.answer ?? ""
  const isPastDate = question.date < toKstDate()
  const canSubmit = !writtenLetter && answerText.trim().length > 0

  // 지난 날짜 답장은 꿈조각을 쓰므로 먼저 확인받는다
  const handleSubmitClick = () => {
    if (isPastDate) {
      setIsCostModalOpen(true)
    } else {
      setIsMoodSheetOpen(true)
    }
  }

  const handleSend = (mood: MoodType) => {
    createLetter.mutate(
      { data: { answer: answerText, mood, letterDate: question.date, localeType: locale } },
      {
        onSuccess: (letter) => {
          setIsMoodSheetOpen(false)
          setSentLetter(letter)
          // 답장 여부·꿈조각·레벨·캘린더가 바뀐다
          queryClient.invalidateQueries({ queryKey: getQuestionFindDailyQueryKey() })
          queryClient.invalidateQueries({ queryKey: getAuthGetMeQueryKey() })
          queryClient.invalidateQueries({ queryKey: getCharacterFindMineQueryKey() })
          queryClient.invalidateQueries({ queryKey: getLetterFindCalendarQueryKey() })
        }
      }
    )
  }

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      {/* TODO: 제목 옆 화살표로 날짜 변경 (Figma "날짜 변경") */}
      <BackTopNavigation title={format.dateTime(new Date(`${question.date}T00:00:00`), { dateStyle: "long" })} />
      <h1 className="text-title-md text-text-primary px-5 py-6">{question.content}</h1>

      <div className="px-5 py-4">
        <TextArea
          value={answerText}
          onChange={(event) => setAnswer(event.target.value)}
          maxLength={MAX_ANSWER_LENGTH}
          disabled={Boolean(writtenLetter)}
          placeholder={t("placeholder", { max: MAX_ANSWER_LENGTH })}
          helperText={`${answerText.length}/${MAX_ANSWER_LENGTH}`}
          className="field-sizing-content"
        />
      </div>

      <Link href={`/lounge?date=${question.date}`} className="block">
        <ListRow
          padding="l"
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
        hasEnoughReward={me.rewardCount >= PAST_LETTER_COST}
        onClose={() => setIsCostModalOpen(false)}
        onConfirm={() => {
          setIsCostModalOpen(false)
          setIsMoodSheetOpen(true)
        }}
      />

      <MoodSheet
        open={isMoodSheetOpen}
        onOpenChange={setIsMoodSheetOpen}
        isSending={createLetter.isPending}
        errorMessage={createLetter.error ? getErrorMessage(createLetter.error) : undefined}
        onConfirm={handleSend}
      />
    </main>
  )
}
